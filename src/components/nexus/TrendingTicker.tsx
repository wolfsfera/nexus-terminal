"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { dexscreener, DexScreenerPair } from '@/services/dexscreener';

const CURATED_TICKERS = ['WIF', 'BONK', 'POPCAT', 'MEW', 'BOME', 'SLERF', 'WEN', 'JUP', 'PYTH', 'RAY'];

export default function TrendingTicker() {
    const [trending, setTrending] = useState<DexScreenerPair[]>([]);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const promises = CURATED_TICKERS.map(async (ticker) => {
                    const pairs = await dexscreener.searchPairs(ticker);
                    // Find first SOL pair with good liquidity
                    // We prioritize Solana chain, and match the symbol
                    const bestPair = pairs.find(p =>
                        p.chainId === 'solana' &&
                        p.baseToken.symbol.toUpperCase() === ticker &&
                        (p.quoteToken.symbol === 'SOL' || p.quoteToken.symbol === 'USDC')
                    );
                    return bestPair;
                });

                const results = await Promise.all(promises);
                // Filter out undefineds
                setTrending(results.filter((p): p is DexScreenerPair => !!p));
            } catch (e) {
                console.error("Ticker Error:", e);
            }
        };

        fetchTrending();
        const interval = setInterval(fetchTrending, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    if (trending.length === 0) return null;

    return (
        <div className="w-full bg-black/80 border-t border-gold-primary/20 overflow-hidden py-2 absolute bottom-0 z-30 backdrop-blur-sm">
            <div className="flex items-center gap-4">
                <div className="px-4 text-[10px] font-mono font-bold text-gold-primary flex items-center gap-2 shrink-0 border-r border-gold-primary/20 h-full">
                    <Zap size={12} className="animate-pulse" /> SOLANA LIVE
                </div>

                <div className="flex-1 overflow-hidden relative">
                    <motion.div
                        className="flex items-center gap-8 whitespace-nowrap"
                        animate={{ x: ["0%", "-100%"] }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 40 // Slower for readability
                        }}
                    >
                        {[...trending, ...trending].map((pair, i) => (
                            <div key={i} className="flex items-center gap-2 font-mono text-xs hover:bg-white/5 px-2 py-1 rounded cursor-pointer transition-colors" onClick={() => window.open(pair.url, '_blank')}>
                                <span className="font-bold text-white">{pair.baseToken.symbol}</span>
                                <span className="text-gray-400 opacity-60">/{pair.quoteToken.symbol}</span>
                                <span className="text-gray-200">${pair.priceUsd}</span>
                                <span className={`${(pair.priceChange?.h24 || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {pair.priceChange?.h24}%
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
