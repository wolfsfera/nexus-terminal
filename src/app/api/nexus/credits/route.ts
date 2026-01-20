import { NextResponse } from 'next/server';
import { kv } from '@/lib/nexus-kv';

// Default credits for new users
const DEFAULT_CREDITS = 3;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('walletAddress');

    if (!walletAddress) {
        return NextResponse.json({ error: 'Wallet Address Required' }, { status: 400 });
    }

    try {
        // Key format: "user:<walletAddress>:credits"
        const key = `user:${walletAddress}:credits`;
        const balance = await kv.get(key);

        if (balance === null) {
            // New User: Initialize with default credits
            await kv.set(key, DEFAULT_CREDITS);
            return NextResponse.json({ balance: DEFAULT_CREDITS, isNew: true });
        }

        // Existing User: Return their balance
        return NextResponse.json({ balance: balance, isNew: false });

    } catch (error) {
        console.error('KV Error:', error);
        // Fallback
        return NextResponse.json({ balance: 0, error: 'Database Error' });
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    const { walletAddress, action, amount } = body;

    if (!walletAddress || !action) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const key = `user:${walletAddress}:credits`;

    try {
        let currentBalance = await kv.get<number>(key);

        if (currentBalance === null) currentBalance = 0;

        if (action === 'spend') {
            const cost = amount || 1;
            if (currentBalance >= cost) {
                const newBalance = await kv.decrby(key, cost);
                return NextResponse.json({ success: true, balance: newBalance });
            } else {
                return NextResponse.json({ success: false, error: 'Insufficient credits' }, { status: 403 });
            }
        }

        if (action === 'add') {
            const topUp = amount || 0;
            const newBalance = await kv.incrby(key, topUp);
            return NextResponse.json({ success: true, balance: newBalance });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error) {
        console.error('KV Transaction Error:', error);
        return NextResponse.json({ error: 'Transaction Failed' }, { status: 500 });
    }
}
