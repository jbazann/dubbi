// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from "@astrojs/cloudflare";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap({
    i18n: {
      defaultLocale: 'en',
      locales: {
        en: 'en',
        es: 'es',
      },
    },
    filter: (page) => {
      switch (true) {
        case page.includes('jbazann.dev/api/'):
          return false
      }
      return true
    }
  })],

  experimental: {
    preserveScriptOrder: true,
    fonts: [{
      provider: "local",
      name: "KodeMono",
      cssVariable: "--font-kodemono",
      variants: [
        {
          weight: 400,
          style: "normal",
          src: ["./src/assets/fonts/KodeMono/KodeMono-Regular.woff2"]
        }
      ]
    }]
  },

  redirects: {
    "/r/toldyou": "https://youtu.be/dQw4w9WgXcQ",
    "/w/orldwide": "https://youtu.be/a15nUK87Tzo"
  },

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
          "@a": "/src/assets",
          "@s": "/src/styles",
          "@l": "/src/layouts",
          "@lib": "/src/lib",
          "@c": "/src/components",
          "@p": "/public"
      },
    },
    build: {
      minify: false,
    },
  },

  i18n: {
    routing: 'manual',
    locales: ['en', 'es'],
    defaultLocale: 'en'
  },

  site: 'https://jbazann.dev',
  trailingSlash: 'ignore',
  output: 'server',
  adapter: cloudflare({imageService: 'compile'}),
});