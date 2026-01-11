"use client";

import { useCredits } from '@/context/CreditsContext';
import { Gem, Plus } from 'lucide-react';

interface CreditBalanceProps {
    onTopUp: () => void;
}

export default function CreditBalance({ onTopUp }: CreditBalanceProps) {
    const { balance } = useCredits();

    return (
        <button
            onClick={onTopUp}
            className="flex items-center gap-2 bg-purple-900/30 border border-purple-500/50 rounded-full px-4 py-2 hover:bg-purple-500/20 transition-all group shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)]"
        >
            <Gem size={16} className="text-purple-400 group-hover:text-white transition-colors animate-pulse" />
            <span className="font-mono font-bold text-white text-xs">{balance} CREDITS</span>
            <div className="w-px h-4 bg-white/20 mx-1"></div>
            <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-purple-300 group-hover:text-white">
                <span>BUY</span> <Plus size={10} />
            </div>
        </button>
    );
}
