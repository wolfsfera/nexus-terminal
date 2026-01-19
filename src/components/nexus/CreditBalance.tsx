"use client";

import { useCredits } from '@/context/CreditsContext';
import { Gem, Plus } from 'lucide-react';

interface CreditBalanceProps {
    onTopUp: () => void;
}

export default function CreditBalance({ onTopUp }: CreditBalanceProps) {
    const { balance } = useCredits();

    return (
        <div className="relative group/tooltip">
            <button
                onClick={onTopUp}
                className="flex items-center gap-2 bg-purple-900/30 border border-purple-500/50 rounded-full px-4 py-2 hover:bg-purple-500/20 transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]"
            >
                <Gem size={16} className="text-purple-400 group-hover/tooltip:text-white transition-colors animate-pulse" />
                <span className="font-mono font-bold text-white text-xs">{balance} CREDITS</span>
                <div className="w-px h-4 bg-white/20 mx-1"></div>
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-purple-300 group-hover/tooltip:text-white">
                    <span>BUY</span> <Plus size={10} />
                </div>
            </button>

            {/* Safety Tooltip */}
            <div className="absolute right-0 top-full mt-2 w-48 p-3 bg-zinc-900 border border-purple-500/30 rounded-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                <p className="text-[9px] text-gray-400 leading-tight font-mono text-center">
                    <span className="text-purple-400 font-bold block mb-1">SECURE GATEWAY</span>
                    Wallet connects to Solana Pay only. We do not access your keys.
                </p>
            </div>
        </div>
    );
}
