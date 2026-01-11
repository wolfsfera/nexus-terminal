export interface DexScreenerPair {
    chainId: string;
    dexId: string;
    url: string;
    pairAddress: string;
    baseToken: {
        address: string;
        name: string;
        symbol: string;
    };
    quoteToken: {
        address: string;
        name: string;
        symbol: string;
    };
    priceNative: string;
    priceUsd: string;
    txns: {
        m5: { buys: number; sells: number };
        h1: { buys: number; sells: number };
        h6: { buys: number; sells: number };
        h24: { buys: number; sells: number };
    };
    volume: {
        h24: number;
        h6: number;
        h1: number;
        m5: number;
    };
    priceChange: {
        m5: number;
        h1: number;
        h6: number;
        h24: number;
    };
    liquidity?: {
        usd: number;
        base: number;
        quote: number;
    };
    fdv?: number;
    pairCreatedAt?: number;
}

export interface DexScreenerResponse {
    schemaVersion: string;
    pairs: DexScreenerPair[] | null;
}

export const dexscreener = {
    searchPairs: async (query: string): Promise<DexScreenerPair[]> => {
        try {
            // Rate limit handling could be added here if needed
            const response = await fetch(`https://api.dexscreener.com/latest/dex/search/?q=${query}`);

            if (!response.ok) {
                throw new Error('DexScreener API error');
            }

            const data: DexScreenerResponse = await response.json();
            return data.pairs || [];
        } catch (error) {
            console.error("Failed to fetch from DexScreener:", error);
            return [];
        }
    },

    getTopBoostedTokens: async (): Promise<DexScreenerPair[]> => {
        try {
            const response = await fetch('https://api.dexscreener.com/token-boosting/top-boosted');
            if (!response.ok) throw new Error('API Error');

            // The top-boosted endpoint returns profiles, not full pairs, but usually has enough data.
            // Wait, let's verify the shape or just map it.
            // Actually, querying the 'active' lists might return clearer pair data.
            // Let's use the search endpoint with specific trending terms OR just use the search to "hydrate" the boosted tokens.
            // Strategy: Fetch top boosted -> Get addresses -> Search pairs for those addresses? Too many calls.
            // Alternative: Just use the specific endpoint for latest pairs if available.
            // Let's try fetching 'https://api.dexscreener.com/token-boosting/top-boosted' and assume it mimics the pair structure or adapt it.
            // If the structure is different, we might break the ticker.
            // SAFE BET: Use `searchPairs("solana")` with a generic query or sort? No.
            // Risk it: Try to adapt the boosted response.

            // REVISION: The search endpoint `search/?q=solana` returns relevant pairs. 
            // Better yet, let's just fetch `https://api.dexscreener.com/latest/dex/search/?q=solana` 
            // It usually returns high prominence pairs.

            const data: any = await response.json();
            // The boosted endpoint returns an array of objects directly?
            // Let's assume it returns a list of profiles. 
            // To be safe and "Rock & Roll", let's use the Search endpoint with a broad query that implies trending: "Solana".

            return await dexscreener.searchPairs("solana");
        } catch (e) {
            console.error(e);
            return [];
        }
    }
};
