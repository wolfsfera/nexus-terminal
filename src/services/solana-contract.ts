import { Connection, PublicKey } from '@solana/web3.js';
import { getMint } from '@solana/spl-token';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { fetchMetadata, findMetadataPda } from '@metaplex-foundation/mpl-token-metadata';
import { publicKey } from '@metaplex-foundation/umi';

const RPC_ENDPOINTS = [
    'https://solana-rpc.publicnode.com',
    'https://api.mainnet-beta.solana.com',
];

export interface SolanaContractMetadata {
    address: string;
    supply: string;
    decimals: number;
    mintAuthority: string | null;
    freezeAuthority: string | null;
    isInitialized: boolean;
    name?: string;
    symbol?: string;
    uri?: string;
    error?: string;
}

export interface SecurityFlag {
    severity: 'CRITICAL' | 'WARNING' | 'SAFE';
    flag: string;
    description: string;
    code: string;
}

export interface DirectSecurityReport {
    contractAddress: string;
    metadata: SolanaContractMetadata | null;
    securityFlags: SecurityFlag[];
    overallRisk: 'SAFE' | 'DEGEN' | 'CRITICAL' | 'UNKNOWN';
    contractReadable: boolean;
    lastUpdated: number;
}

export const solanaService = {
    // 1. READ METADATA DIRECTLY FROM CHAIN
    readSolanaContractMetadata: async (contractAddress: string): Promise<SolanaContractMetadata | null> => {
        let lastError;

        for (const endpoint of RPC_ENDPOINTS) {
            try {
                const connection = new Connection(endpoint, 'confirmed');
                const pubKey = new PublicKey(contractAddress);

                // Fetch Mint Account Info directly using SPL Token logic
                console.log(`[DEBUG] Fetching Mint info from ${endpoint}...`);
                const mintInfo = await getMint(connection, pubKey);
                console.log(`[DEBUG] Mint Info Retrieved:`, {
                    supply: mintInfo.supply.toString(),
                    mintAuth: mintInfo.mintAuthority?.toBase58(),
                    freezeAuth: mintInfo.freezeAuthority?.toBase58()
                });

                // Fetch Metaplex Metadata (Name, Symbol)
                let name = "UNKNOWN";
                let symbol = "???";
                let uri = "";

                try {
                    const umi = createUmi(endpoint);
                    const mintPda = publicKey(contractAddress);
                    const metadataPda = findMetadataPda(umi, { mint: mintPda });

                    const metadataAccount = await fetchMetadata(umi, metadataPda);
                    name = metadataAccount.name;
                    symbol = metadataAccount.symbol;
                    uri = metadataAccount.uri;
                } catch (metaError) {
                    console.warn("Metaplex Metadata not found or error:", metaError);
                    // Fallback to truncated address if metadata fails
                    name = "Unknown Contract";
                    symbol = `${contractAddress.slice(0, 4)}..${contractAddress.slice(-4)}`;
                }

                return {
                    address: contractAddress,
                    supply: mintInfo.supply.toString(),
                    decimals: mintInfo.decimals,
                    mintAuthority: mintInfo.mintAuthority ? mintInfo.mintAuthority.toBase58() : null,
                    freezeAuthority: mintInfo.freezeAuthority ? mintInfo.freezeAuthority.toBase58() : null,
                    isInitialized: mintInfo.isInitialized,
                    name: name.replace(/\0/g, '').trim(), // Clean null bytes
                    symbol: symbol.replace(/\0/g, '').trim(),
                    uri: uri.replace(/\0/g, '').trim()
                };

            } catch (error) {
                console.warn(`[DEBUG] Failed on ${endpoint}:`, error);
                lastError = error;
                // Continue to next endpoint
            }
        }

        console.error("Solana Direct Read Error (All RPCs failed):", lastError);
        return null;
    },

    // 2. DETECT MALICIOUS PATTERNS
    detectMaliciousPatterns: (metadata: SolanaContractMetadata): SecurityFlag[] => {
        const flags: SecurityFlag[] = [];

        // CHECK 1: Freeze Authority
        if (metadata.freezeAuthority) {
            flags.push({
                severity: 'CRITICAL',
                flag: 'FREEZE_AUTH_ENABLED',
                description: 'Creator can freeze wallets preventing sales.',
                code: 'FREEZE_ENABLED'
            });
        }

        // CHECK 2: Mint Authority
        if (metadata.mintAuthority) {
            flags.push({
                severity: 'CRITICAL',
                flag: 'MINT_AUTH_ENABLED',
                description: 'Creator can mint infinite tokens to dump.',
                code: 'MINT_ENABLED'
            });
        }

        // CHECK 3: Initialization
        if (!metadata.isInitialized) {
            flags.push({
                severity: 'CRITICAL',
                flag: 'NOT_INITIALIZED',
                description: 'Token contract is not fully initialized.',
                code: 'UNINIT'
            });
        }

        // CHECK 4: Zero Supply
        if (BigInt(metadata.supply) <= 0) {
            flags.push({
                severity: 'CRITICAL',
                flag: 'ZERO_SUPPLY',
                description: 'Token has zero supply.',
                code: 'NO_SUPPLY'
            });
        }

        return flags;
    },

    // 3. GENERATE FULL REPORT
    generateSecurityReport: async (contractAddress: string): Promise<DirectSecurityReport> => {
        const metadata = await solanaService.readSolanaContractMetadata(contractAddress);
        const timestamp = Date.now();

        if (!metadata) {
            return {
                contractAddress,
                metadata: null,
                securityFlags: [],
                overallRisk: 'UNKNOWN',
                contractReadable: false,
                lastUpdated: timestamp
            };
        }

        const flags = solanaService.detectMaliciousPatterns(metadata);

        // Determine Risk
        let overallRisk: DirectSecurityReport['overallRisk'] = 'SAFE';
        if (flags.some(f => f.severity === 'CRITICAL')) overallRisk = 'CRITICAL';
        else if (flags.some(f => f.severity === 'WARNING')) overallRisk = 'DEGEN';

        return {
            contractAddress,
            metadata,
            securityFlags: flags,
            overallRisk,
            contractReadable: true,
            lastUpdated: timestamp
        };
    }
};
