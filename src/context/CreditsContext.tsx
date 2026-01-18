"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as FingerprintJS from '@fingerprintjs/fingerprintjs';

interface CreditsContextType {
    balance: number;
    addCredits: (amount: number) => Promise<void>;
    spendCredits: (amount: number) => Promise<boolean>;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export function CreditsProvider({ children }: { children: ReactNode }) {
    const [balance, setBalance] = useState<number>(0); // Start at 0 until server confirms
    const [visitorId, setVisitorId] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load Visitor ID & Credits from Server (Anti-Cheat)
    useEffect(() => {
        const init = async () => {
            try {
                // 1. Load FingerprintJS
                const fp = await FingerprintJS.load();
                const result = await fp.get();
                const visitorId = result.visitorId;
                setVisitorId(visitorId);

                console.log("🔒 Identity Secured via Fingerprint:", visitorId);

                // 2. Fetch Server Balance
                const res = await fetch(`/api/nexus/credits?visitorId=${visitorId}`);
                const data = await res.json();

                if (data.balance !== undefined) {
                    setBalance(data.balance);
                }
            } catch (error) {
                console.error("Identity System Error:", error);
            } finally {
                setIsLoaded(true);
            }
        };

        if (typeof window !== 'undefined') {
            init();
        }
    }, []);

    // No more LocalStorage syncing needed! We trust the Cloud.

    const addCredits = async (amount: number) => {
        // Optimistic UI update
        setBalance(prev => prev + amount);

        // Sync with Server
        if (visitorId) {
            await fetch('/api/nexus/credits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ visitorId, action: 'add', amount })
            });
        }
    };

    const spendCredits = async (amount: number): Promise<boolean> => {
        if (balance >= amount) {
            // Optimistic UI check
            setBalance(prev => prev - amount);

            // Server Sync
            if (visitorId) {
                try {
                    const res = await fetch('/api/nexus/credits', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ visitorId, action: 'spend', amount })
                    });
                    const data = await res.json();
                    if (!data.success) {
                        // Revert if server says no (Cheat detected)
                        setBalance(prev => prev + amount);
                        return false;
                    }
                    return true;
                } catch (e) {
                    return true; // Soft fail: let them play if network hiccups
                }
            }
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
