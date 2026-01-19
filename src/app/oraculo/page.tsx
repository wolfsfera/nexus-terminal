"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Crosshair, Radar, Zap, Trophy, Skull, Activity, Search } from 'lucide-react';
import Image from 'next/image';

// IMPORT HOOK
import { useOraculoFeed } from '@/hooks/useOraculoFeed';

export default function OraculoPage() {
    const { feed, gem } = useOraculoFeed();

    // Highlight gem if found
    const activeGem = gem || {
        id: 'waiting',
        ticker: 'SCANNING...',
        name: 'Searching Mempool',
        liquidity: '---',
        risk: 'UNKNOWN' as const,
        badge: '🔍',
        score: 0
    };

    return (
        <div className="min-h-screen bg-black text-white font-mono selection:bg-red-500/30 overflow-hidden relative">

            {/* BACKGROUND EFFECTS */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>
                <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
                <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

                {/* GRID OVERLAY */}
                <div className="absolute inset-0 bg-[url('/images/nexus/grid.svg')] opacity-10 bg-repeat bg-[length:50px_50px]"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-6 flex flex-col h-screen max-h-screen">

                {/* HEADER */}
                <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-pulse">
                            <Flame size={28} className="text-black" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600">
                                ORÁCULO <span className="text-white not-italic text-sm font-normal opacity-50 ml-2">v.BETA</span>
                            </h1>
                            <p className="text-[10px] text-gray-500 tracking-[0.3em] uppercase">The Solana Gem Sniper</p>
                        </div>
                    </div>

                    <div className="flex gap-4 text-xs font-bold text-gray-400">
                        <div className="flex items-center gap-2">
                            <Activity size={14} className="text-green-500" />
                            <span>TPS: 4,500</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Radar size={14} className="text-red-500 animate-spin-slow" />
                            <span>SCANNING MEMPOOL...</span>
                        </div>
                    </div>
                </header>

                {/* MAIN CONTENT GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">

                    {/* LEFT: LIVE FEED (Real Data) */}
                    <div className="lg:col-span-4 bg-zinc-900/30 border border-white/10 rounded-2xl p-4 flex flex-col overflow-hidden relative">
                        <h2 className="text-sm font-bold text-red-500 mb-4 flex items-center gap-2 uppercase tracking-wider">
                            <Zap size={16} /> Live Mints (Real-Time)
                        </h2>

                        <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-red-900/50">
                            <AnimatePresence>
                                {feed.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className={`p-3 rounded-lg border flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all ${item.risk === 'RUG' ? 'border-red-500/30 bg-red-900/10' :
                                            item.risk === 'SAFE' ? 'border-green-500/30 bg-green-900/10' :
                                                item.risk === 'ELITE' ? 'border-purple-500/50 bg-purple-900/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]' :
                                                    'border-white/10'
                                            }`}
                                    >
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-white">{item.ticker}</span>
                                                <span className="text-[10px] bg-white/10 px-1 rounded text-gray-400">{item.timeLabel}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 font-mono flex gap-2">
                                                <span>Liq: {item.liquidity}</span>
                                                <span className="text-white/20">|</span>
                                                <span>Vol: {item.volume || '---'}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-xs font-bold px-2 py-0.5 rounded ${item.risk === 'RUG' ? 'bg-red-500 text-black' :
                                                item.risk === 'SAFE' ? 'bg-green-500 text-black' :
                                                    item.risk === 'ELITE' ? 'bg-purple-500 text-white' :
                                                        'bg-yellow-500 text-black'
                                                }`}>{item.risk}</div>
                                            <div className="text-[10px] mt-1">{item.badge}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* CENTER: SNIPER SCOPE (The "Main Event") */}
                    <div className="lg:col-span-8 flex flex-col gap-6">

                        {/* HERO CARD */}
                        <div className="flex-1 bg-gradient-to-br from-zinc-900/80 to-black border border-purple-500/30 rounded-3xl p-8 relative overflow-hidden group">
                            {/* Target Crosshair */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
                                <Crosshair size={300} className="text-white spin-slow" />
                            </div>

                            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    key={activeGem.id}
                                    className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(250,204,21,0.5)] animate-bounce"
                                >
                                    <Trophy size={48} className="text-black" />
                                </motion.div>

                                <h2 className="text-lg text-purple-400 font-mono tracking-widest mb-2">POSSIBLE GEM DETECTED</h2>
                                <h1 className="text-6xl font-black text-white mb-2 tracking-tighter">${activeGem.ticker}</h1>
                                <p className="text-gray-400 max-w-md mx-auto mb-8">
                                    High velocity mint. Dev wallet clean. Liquidity locked instantly.
                                    <span className="text-green-500 font-bold ml-2">Score: 92/100</span>
                                </p>

                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={() => window.open(`http://localhost:3000/?scan=${activeGem.contractAddress}`, '_blank')}
                                        className="bg-purple-600 hover:bg-purple-500 text-white font-black text-xl px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:shadow-[0_0_50px_rgba(168,85,247,0.8)] transition-all flex items-center gap-3 uppercase italic transform hover:scale-105 active:scale-95"
                                    >
                                        <Search size={24} />
                                        SCAN WITH NEXUS
                                    </button>

                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(activeGem.contractAddress);
                                        }}
                                        className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-6 py-4 rounded-xl border border-white/10 flex items-center gap-2 uppercase transition-all"
                                    >
                                        COPY CA
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* BOTTOM STATS */}
                        <div className="h-32 grid grid-cols-3 gap-4">
                            <div className="bg-zinc-900/50 rounded-xl border border-white/5 p-4 flex flex-col justify-center items-center">
                                <span className="text-gray-500 text-xs uppercase tracking-widest">Scams Blocked</span>
                                <span className="text-3xl font-black text-red-500 flex items-center gap-2">
                                    <Skull size={24} /> 142
                                </span>
                            </div>
                            <div className="bg-zinc-900/50 rounded-xl border border-white/5 p-4 flex flex-col justify-center items-center">
                                <span className="text-gray-500 text-xs uppercase tracking-widest">Gems Found</span>
                                <span className="text-3xl font-black text-purple-500 flex items-center gap-2">
                                    <Trophy size={24} /> 8
                                </span>
                            </div>
                            <div className="bg-zinc-900/50 rounded-xl border border-white/5 p-4 flex flex-col justify-center items-center">
                                <span className="text-gray-500 text-xs uppercase tracking-widest">Network Vol</span>
                                <span className="text-3xl font-black text-blue-500 flex items-center gap-2">
                                    <Activity size={24} /> $24M
                                </span>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}
