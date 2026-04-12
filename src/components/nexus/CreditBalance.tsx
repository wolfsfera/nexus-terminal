"use client";

import { Gem } from 'lucide-react';

interface CreditBalanceProps {
    onTopUp: () => void;
}

// ============================================================
// MODO GRATUITO: Muestra badge "FREE ACCESS" en lugar del
// botón de compra de créditos. Para reactivar el sistema de
// pago, restaurar la versión original con useCredits() y
// el botón BUY.
// ============================================================
export default function CreditBalance({ onTopUp }: CreditBalanceProps) {
    return (
        <div className="relative group/tooltip">
            <div
                className="flex items-center gap-2 bg-green-900/30 border border-green-500/50 rounded-full px-4 py-2 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
            >
                <Gem size={16} className="text-green-400 animate-pulse" />
                <span className="font-mono font-bold text-white text-xs">FREE ACCESS</span>
                <div className="w-px h-4 bg-white/20 mx-1"></div>
                <span className="text-[10px] uppercase font-bold text-green-300">∞</span>
            </div>

            {/* Tooltip */}
            <div className="absolute right-0 top-full mt-2 w-48 p-3 bg-zinc-900 border border-green-500/30 rounded-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                <p className="text-[9px] text-gray-400 leading-tight font-mono text-center">
                    <span className="text-green-400 font-bold block mb-1">ACCESO GRATUITO</span>
                    Escaneos ilimitados. Sin wallet. Sin créditos.
                </p>
            </div>
        </div>
    );
}
