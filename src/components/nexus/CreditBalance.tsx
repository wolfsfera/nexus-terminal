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
            className="flex items-center gap-2 bg-black/50 border border-gold-primary/30 rounded-full px-4 py-2 hover:bg-gold-primary/10 transition-colors group"
        >
            <Gem size={16} className="text-purple-400 group-hover:text-purple-300 transition-colors" />
            <span className="font-mono font-bold text-gold-primary">{balance}</span>
            <div className="w-px h-4 bg-white/10 mx-1"></div>
            <Plus size={14} className="text-gray-400 group-hover:text-white" />
        </button>
    );
}
