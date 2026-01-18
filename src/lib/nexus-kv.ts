import { createClient } from '@vercel/kv';

const KV_REST_API_URL = process.env.KV_REST_API_URL;
const KV_REST_API_TOKEN = process.env.KV_REST_API_TOKEN;

if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
    // In development, this might throw if env vars aren't pulled yet.
    // We'll handle this gracefully in the API route.
    console.warn('Vercel KV environment variables not found.');
}

export const kv = createClient({
    url: KV_REST_API_URL || '',
    token: KV_REST_API_TOKEN || '',
});
