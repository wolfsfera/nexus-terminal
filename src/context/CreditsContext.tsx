"use client";

import { createContext, useContext, ReactNode } from 'react';

interface CreditsContextType {
    balance: number;
    addCredits: (amount: number) => Promise<void>;
    spendCredits: (amount: number) => Promise<boolean>;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

// ============================================================
// MODO GRATUITO: Sin wallet, sin créditos, acceso libre total.
// Para reactivar el sistema de pago, restaurar la versión
// original con useWallet() y la API /api/nexus/credits.
// ============================================================
export function CreditsProvider({ children }: { children: ReactNode }) {
    const balance = 999999; // Unlimited free credits

    const addCredits = async (_amount: number): Promise<void> => {
        // No-op in free mode
    };

    const spendCredits = async (_amount: number): Promise<boolean> => {
        // Always succeeds in free mode
        return true;
    };

    return (
        <CreditsContext.Provider value={{ balance, addCredits, spendCredits }}>
            {children}
        </CreditsContext.Provider>
    );
}

export function useCredits() {
    const context = useContext(CreditsContext);
    if (context === undefined) {
        throw new Error('useCredits must be used within a CreditsProvider');
    }
    return context;
}
