import { NextResponse } from 'next/server';
import { kv } from '@/lib/nexus-kv';

// Default credits for new users
const DEFAULT_CREDITS = 3;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get('visitorId');

    if (!visitorId) {
        return NextResponse.json({ error: 'Visitor ID Required' }, { status: 400 });
    }

    try {
        // Check if user exists in KV
        // Key format: "user:<visitorId>:credits"
        const key = `user:${visitorId}:credits`;
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
        // Fallback if KV fails (e.g. invalid credentials): Return 0 to be safe (or 3 if generous)
        // For security, we default to 0 to prevent abuse if DB takes a hit.
        return NextResponse.json({ balance: 0, error: 'Database Error' });
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    const { visitorId, action, amount } = body;

    if (!visitorId || !action) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const key = `user:${visitorId}:credits`;

    try {
        let currentBalance = await kv.get<number>(key);

        // Safety check: if for some reason key doesn't exist, treat as 0
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
            // Top-up credits (e.g. after payment)
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
