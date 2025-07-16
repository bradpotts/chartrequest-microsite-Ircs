// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// Astro configuration
export default defineConfig({
  site: "https://informationreleasecertification.com",
  output: 'static', // Static output for better microsite performance
  integrations: [sitemap()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    }
  }),
  server: {
    host: '0.0.0.0',
    port: 4321
  },
  prefetch: {
    defaultStrategy: 'hover'
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: true,
      minify: 'terser',
      terserOptions: {
        compress: true,
        ecma: 2020,
        keep_classnames: false,
        keep_fnames: false
      },
      assetsInlineLimit: 4096, // Files smaller than this (in bytes) will be inlined
      rollupOptions: {
        output: {
          manualChunks: undefined,
          entryFileNames: 'entry.[hash].js',
          chunkFileNames: 'chunks/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]'
        }
      }
    },
    optimizeDeps: {
      exclude: ['svgo'] // Prevents issues with SVG optimization
    },
    assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp']
  }
});