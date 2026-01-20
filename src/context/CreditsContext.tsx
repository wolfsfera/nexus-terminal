"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface CreditsContextType {
    balance: number;
    addCredits: (amount: number) => Promise<void>;
    spendCredits: (amount: number) => Promise<boolean>;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export function CreditsProvider({ children }: { children: ReactNode }) {
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState<number>(0);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial Load
    useEffect(() => {
        const fetchCredits = async () => {
            if (!publicKey) {
                // GUEST MODE (LocalStorage)
                const saved = localStorage.getItem('nexus_guest_credits');
                if (saved === null) {
                    localStorage.setItem('nexus_guest_credits', '3'); // 3 Free Scans
                    setBalance(3);
                } else {
                    setBalance(parseInt(saved, 10));
                }
                setIsLoaded(true);
                return;
            }

            // WALLET MODE (Server)
            const walletAddress = publicKey.toBase58();
            try {
                const res = await fetch(`/api/nexus/credits?walletAddress=${walletAddress}`);
                const data = await res.json();
                if (data.balance !== undefined) {
                    setBalance(data.balance);
                }
            } catch (error) {
                console.error("Wallet Sync Error:", error);
            } finally {
                setIsLoaded(true);
            }
        };

        fetchCredits();
    }, [publicKey]);

    const addCredits = async (amount: number) => {
        if (!publicKey) return; // Guests cannot buy credits without connecting
        const walletAddress = publicKey.toBase58();
        setBalance(prev => prev + amount);
        await fetch('/api/nexus/credits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress, action: 'add', amount })
        });
    };

    const spendCredits = async (amount: number): Promise<boolean> => {
        if (balance < amount) return false;

        // Optimistic Update
        setBalance(prev => prev - amount);

        if (!publicKey) {
            // GUEST MODE SPEND
            const newBalance = Math.max(0, balance - amount);
            localStorage.setItem('nexus_guest_credits', newBalance.toString());
            return true;
        }

        // WALLET MODE SPEND
        const walletAddress = publicKey.toBase58();
        try {
            const res = await fetch('/api/nexus/credits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ walletAddress, action: 'spend', amount })
            });
            const data = await res.json();
            if (!data.success) {
                setBalance(prev => prev + amount); // Revert
                return false;
            }
            return true;
        } catch (e) {
            return true; // Consider success if network fails to avoid blocking user
        }
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
