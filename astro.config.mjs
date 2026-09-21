// @ts-check
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
const adapter = cloudflare({
    imageService: 'compile',
});
export default defineConfig({
    site: 'https://a-plus.gr',
    session: false, // no sessions — avoids KV binding requirement on deploy
    adapter,
    integrations: [sitemap()],
    env: {
        schema: {
            RESEND_API_KEY: { type: 'string', context: 'server', access: 'secret' },
        },
    },
    vite: {
        plugins: [ tailwindcss()],
    },
    fonts: [
        {
            name: "Geom",
            cssVariable: "--font-geom",
            provider: fontProviders.google(),
            subsets: ["greek", "latin"]
        },
        {
            name: "Google Sans",
            cssVariable: "--font-google-sans",
            provider: fontProviders.google(),
        },
        {
            name: "Sansation",
            cssVariable: "--font-sansation",
            provider: fontProviders.google(),
        },
        {
            name: "Syne",
            cssVariable: "--font-syne",
            provider: fontProviders.google(),
            subsets: ["latin"],
            weights: [800],
        },
    ],
});
