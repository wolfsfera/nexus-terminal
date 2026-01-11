"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface CreditsContextType {
    balance: number;
    addCredits: (amount: number) => void;
    spendCredits: (amount: number) => boolean; // Returns true if successful
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export function CreditsProvider({ children }: { children: ReactNode }) {
    const [balance, setBalance] = useState<number>(3); // Default 3 free credits
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('nexus_credits');
        if (saved) {
            setBalance(parseInt(saved, 10));
        }
        setIsLoaded(true);
    }, []);

    // Save to LocalStorage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('nexus_credits', balance.toString());
        }
    }, [balance, isLoaded]);

    const addCredits = (amount: number) => {
        setBalance(prev => prev + amount);
    };

    const spendCredits = (amount: number): boolean => {
        if (balance >= amount) {
            setBalance(prev => prev - amount);
            return true;
        }
        return false;
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
