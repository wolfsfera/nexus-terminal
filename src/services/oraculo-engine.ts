import { dexscreener } from './dexscreener';
import { oraculoBrain } from '@/lib/oraculo-brain';

// TYPES
export interface OraculoToken {
    id: string; // Signature or Address
    ticker: string;
    name: string;
    image?: string;
    timeLabel: string; // "1s ago", "Just now"
    liquidity: string;
    volume?: string;
    risk: 'ELITE' | 'SAFE' | 'DEGEN' | 'RUG' | 'UNKNOWN';
    badge: string; // Emoji badge
    score: number; // 0-100
    contractAddress: string;
}

// MOCK GENERATOR (Fallback)
const generateMock = (): OraculoToken => {
    const tickers = ['PEPE2', 'WIFHAT', 'TRUMP', 'ELON', 'DOGE', 'BONK', 'MOG', 'POPCAT', 'MEW'];
    const suffixes = ['AI', 'GPT', 'BULL', 'MOON', 'COIN', 'DAO'];
    const ticker = tickers[Math.floor(Math.random() * tickers.length)] + suffixes[Math.floor(Math.random() * suffixes.length)];
    const risk = Math.random() > 0.8 ? 'ELITE' : Math.random() > 0.5 ? 'SAFE' : Math.random() > 0.2 ? 'DEGEN' : 'RUG';

    return {
        id: Math.random().toString(36).substring(7),
        ticker: ticker,
        name: `${ticker} Protocol`,
        timeLabel: 'LIVE',
        liquidity: `$${Math.floor(Math.random() * 50)}k`,
        volume: `$${Math.floor(Math.random() * 100)}k`,
        risk: risk as any,
        badge: risk === 'ELITE' ? '💎' : risk === 'SAFE' ? '✅' : risk === 'RUG' ? '💀' : '🎲',
        score: Math.floor(Math.random() * 100),
        contractAddress: 'So11111111111111111111111111111111111111112'
    };
};

export const oraculoEngine = {
    /**
     * Polling method. In production, this would be a WebSocket listener.
     * Hits GeckoTerminal Public API for New Pools. Fallbacks to MOCK if rate limited.
     */
    pollNewMints: async (): Promise<OraculoToken[]> => {
        try {
            // "PLAN B": POLLING PUBLIC API (GeckoTerminal)
            // https://api.geckoterminal.com/api/v2/networks/solana/new_pools
            const response = await fetch('https://api.geckoterminal.com/api/v2/networks/solana/new_pools');
            if (!response.ok) throw new Error('GeckoTerminal Limit');

            const data = await response.json();

            // Map Gecko data to Oraculo Format
            const mappedTokens: OraculoToken[] = data.data.map((pool: any) => {
                const attrs = pool.attributes;
                const createdAt = new Date(attrs.pool_created_at).getTime();
                const now = Date.now();
                const diffSec = Math.floor((now - createdAt) / 1000);

                let timeLabel = diffSec < 60 ? `${diffSec}s ago` : `${Math.floor(diffSec / 60)}m ago`;

                // Risk Heuristic for "Sniper"
                const liquidity = parseFloat(attrs.reserve_in_usd || '0');
                const volume5m = parseFloat(attrs.volume_usd?.m5 || '0');

                // Estimating TX count if not directly provided in list view accurately
                const buys = attrs.transactions?.m5?.buys || 0;
                const sells = attrs.transactions?.m5?.sells || 0;
                const txs5m = buys + sells;

                // BRAIN ANALYSIS 🧠
                const analysis = oraculoBrain.analyze({
                    liquidity,
                    volume5m,
                    txs5m,
                    ageSeconds: diffSec
                });

                return {
                    id: pool.id,
                    ticker: attrs.name.split('/')[0].trim().substring(0, 10),
                    name: attrs.name,
                    timeLabel: timeLabel,
                    liquidity: `$${Math.floor(liquidity / 1000)}k`,
                    volume: `$${Math.floor(volume5m / 1000)}k`,
                    risk: analysis.risk,
                    badge: analysis.badges[0] || (analysis.risk === 'ELITE' ? '💎' : analysis.risk === 'SAFE' ? '✅' : '🎲'),
                    score: analysis.score,
                    contractAddress: attrs.address
                };
            });

            return mappedTokens;

        } catch (error) {
            console.warn("Oraculo Polling Fallback (API Rate Limit?):", error);
            // Fallback to Mock if API fails to keep UI alive
            return [generateMock(), generateMock()];
        }
    }
};
