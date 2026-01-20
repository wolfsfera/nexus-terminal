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

    // Sync Credits with Wallet Address
    useEffect(() => {
        const fetchCredits = async () => {
            if (!publicKey) {
                setBalance(0); // No wallet = No credits (Guest mode limits)
                setIsLoaded(true);
                return;
            }

            const walletAddress = publicKey.toBase58();
            try {
                // Fetch Server Balance using Wallet Address
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
        if (!publicKey) return;
        const walletAddress = publicKey.toBase58();

        // Optimistic UI update
        setBalance(prev => prev + amount);

        // Sync with Server using Wallet Address
        await fetch('/api/nexus/credits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress, action: 'add', amount })
        });
    };

    const spendCredits = async (amount: number): Promise<boolean> => {
        if (!publicKey) {
            // Can't spend if not connected
            return false;
        }
        const walletAddress = publicKey.toBase58();

        if (balance >= amount) {
            // Optimistic UI check
            setBalance(prev => prev - amount);

            // Server Sync
            try {
                const res = await fetch('/api/nexus/credits', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ walletAddress, action: 'spend', amount })
                });
                const data = await res.json();
                if (!data.success) {
                    // Revert if server says no
                    setBalance(prev => prev + amount);
                    return false;
                }
                return true;
            } catch (e) {
                return true; // Soft fail on network error
            }
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
