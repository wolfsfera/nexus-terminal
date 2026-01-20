import { useState, useEffect, useCallback } from 'react';
import { oraculoEngine, OraculoToken } from '@/services/oraculo-engine';

export function useOraculoFeed() {
    const [feed, setFeed] = useState<OraculoToken[]>([]);
    const [gem, setGem] = useState<OraculoToken | null>(null);
    const [isScanning, setIsScanning] = useState(true);

    const fetchData = useCallback(async () => {
        const newTokens = await oraculoEngine.pollNewMints();

        setFeed(prev => {
            // Prepend new tokens, keep max 50
            const updated = [...newTokens, ...prev].slice(0, 50);
            return updated;
        });

        // Simple "Gem Detection" Logic for MVP
        // If a new token has ELITE risk, promote it to 'Gem' slot
        const elite = newTokens.find(t => t.risk === 'ELITE');
        if (elite) {
            setGem(elite);
        }
    }, []);

    useEffect(() => {
        if (!isScanning) return;

        // Poll every 15 seconds to respect API Rate Limits and avoid fallback to Mocks
        // (GeckoTerminal Public API is limited, 3s triggers 429 errors easily)
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, [isScanning, fetchData]);

    return {
        feed,
        gem,
        isScanning,
        setIsScanning
    };
}
