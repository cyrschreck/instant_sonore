import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://instantsonore.ch',
  output: 'static',
  build: {
    format: 'file' // génère /mariage.html plutôt que /mariage/index.html
  },
  vite: {
    build: {
      assetsInlineLimit: 0
    }
  }
});
