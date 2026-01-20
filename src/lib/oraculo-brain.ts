
/**
 * ORÁCULO BRAIN 🧠
 * The Logic Core for identifying "100x Gems" vs "Rug Pulls" in real-time.
 * 
 * Philosophy:
 * - Speed > Safety (unlike Nexus Main)
 * - Momentum is King (High Volume/Liq ratio)
 * - Liquidity must be "Real" (locked or sufficient depth)
 */

export interface SniperAnalysis {
    score: number;        // 0-100
    risk: 'ELITE' | 'SAFE' | 'DEGEN' | 'RUG' | 'UNKNOWN';
    badges: string[];     // ["🚀 High Vol", "🐳 Whale Entry"]
    reason: string;
}

export const oraculoBrain = {

    analyze: (token: {
        liquidity: number;
        volume5m: number;
        txs5m: number;
        ageSeconds: number;
        priceChange1h: number; // NEW
        priceChange5m: number; // NEW
    }): SniperAnalysis => {
        let score = 50; // Start Neutral
        let badges: string[] = [];
        let risk: SniperAnalysis['risk'] = 'DEGEN';
        let reason = "Analyzing momentum...";

        // 1. LIQUIDITY CHECK (The Foundation)
        // Too low = scam. Too high = suspicious (fake volume or honey).
        if (token.liquidity < 1000) {
            score -= 40;
            return { score: 10, risk: 'RUG', badges: ['⚠️ Low Liq'], reason: "Liquidity dangerously low (<$1k)" };
        } else if (token.liquidity > 5000) {
            score += 10;
        } else if (token.liquidity > 20000) {
            score += 20;
            badges.push("💧 Deep Liq");
        }

        // --- NEW: CRASH PROTECTION ---
        if (token.priceChange1h < -50 || token.priceChange5m < -30) {
            return {
                score: 0,
                risk: 'RUG',
                badges: ['📉 CRASHING'],
                reason: `Dumping hard (${token.priceChange1h.toFixed(1)}% 1h)`
            };
        }

        // 2. MOMENTUM (Volume / Liquidity Ratio)
        // If Volume is 2x Liquidity in 5 mins -> INSANE MOMENTUM
        const volLiqRatio = token.volume5m / token.liquidity;

        if (volLiqRatio > 0.5) { // 50% of liq traded in 5m
            score += 20;
            badges.push("🔥 Hot");
            reason = "High Volume Velocity";
        }
        if (volLiqRatio > 1.0) { // 100% of liq traded!
            score += 15;
            badges.push("🚀 Mooning");
            reason = "Extreme buy pressure";
        }

        // 3. TRANSACTION VELOCITY (Hype)
        if (token.txs5m > 50) {
            score += 10;
        }
        if (token.txs5m > 200) {
            score += 15;
            badges.push("⚡ Viral");
        }

        // 4. AGE FACTOR (The "Sniper" Element)
        // Newer is riskier but higher potential reward
        if (token.ageSeconds < 300) { // Under 5 mins
            score += 5; // Freshness bonus
            badges.push("👶 New Born");
        }

        // FINAL VERDICT MAPPING
        if (score >= 85) risk = 'ELITE';
        else if (score >= 70) risk = 'SAFE';
        else if (score >= 40) risk = 'DEGEN';
        else risk = 'RUG'; // Should be caught by liquidity check, but safety net

        // Cap Score
        score = Math.min(99, Math.max(1, score));

        return {
            score,
            risk,
            badges,
            reason
        };
    }
};
