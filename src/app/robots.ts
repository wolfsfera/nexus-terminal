import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/', // Just in case we add private routes later
        },
        sitemap: 'https://scanner.wolfsfera.com/sitemap.xml',
    };
}
