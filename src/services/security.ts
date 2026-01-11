export interface SecurityData {
    is_open_source: string; // "1" if true
    is_honeypot: string; // "1" if true
    mintable: string; // "1" if true (Mint Auth Enabled)
    owner_change_balance: string; // "1" if owner can change balance
    holder_count: string;
    top_holders: Array<{
        address: string;
        balance: string;
        percent: string;
    }>;
    creator_percent: string;
}

export const securityService = {
    checkTokenSecurity: async (chainId: string, address: string): Promise<SecurityData | null> => {
        try {
            // Map DexScreener chainIds to GoPlus/Standard Concept
            // GoPlus often uses numeric IDs for EVM, but 'solana' for Solana
            let targetChainId = chainId;

            if (chainId === 'solana') targetChainId = 'solana';
            else if (chainId === 'ethereum') targetChainId = '1';
            else if (chainId === 'bsc') targetChainId = '56';
            else if (chainId === 'base') targetChainId = '8453';
            else if (chainId === 'arbitrum') targetChainId = '42161';
            // Fallback for others or if DexScreener gives something else

            // Note: Solana endpoint structure might differ from EVM in GoPlus
            let url = '';

            if (targetChainId === 'solana') {
                url = `https://api.gopluslabs.io/api/v1/solana/token_security?contract_addresses=${address}`;
            } else {
                // EVM chains
                url = `https://api.gopluslabs.io/api/v1/token_security/${targetChainId}?contract_addresses=${address}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (data.result && data.result[address]) {
                return data.result[address];
            }

            return null;
        } catch (error) {
            console.error("Security API Error:", error);
            return null;
        }
    }
};
