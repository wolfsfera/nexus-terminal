import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://scanner.wolfsfera.com';

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily', // It's a live scanner, content changes often
            priority: 1,
        },
        // If we add more pages (blog, about), we add them here
    ];
}
