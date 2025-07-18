// @ts-check
import { defineConfig } from 'astro/config';

// Core Integrations
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// CSS Tooling
import tailwindcss from '@tailwindcss/vite';
import purgecss from 'astro-purgecss';

// Asset Optimization
import playformCompress from '@playform/compress';
import compressor from 'astro-compressor';

// SEO Tools
import robotsTxt from 'astro-robots-txt';

export default defineConfig({
  // Site Configuration
  site: "https://informationreleasecertification.com",
  output: 'server',

  // Integrations
  integrations: [
    // SEO Enhancements
    sitemap(),
    robotsTxt(),
    
    // CSS Optimization (reduced for build stability)
    purgecss({
      // Remove unused CSS
      content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
      safelist: ['html', 'body'] // Keep essential selectors
    }),
    
    // Asset Compression & Optimization (simplified)
    playformCompress({
      CSS: true,
      HTML: true,
      JavaScript: true,
    }),
  ],
  
  // Deployment
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    }
  }),
  
  // Build Configuration
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
  },
  
  // Development Server
  server: {
    host: '0.0.0.0',
    port: 4321
  },
  
  // Navigation Optimization
  prefetch: {
    defaultStrategy: 'hover'
  },
  
  // Image Optimization
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        format: ['webp', 'avif'],
        quality: 80
      }
    }
  },
  
  // Vite Configuration
  vite: {
    plugins: [tailwindcss()]
  }
});