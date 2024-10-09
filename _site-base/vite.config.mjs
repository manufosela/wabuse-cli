import { defineConfig } from 'vite';
import { resolve } from 'path';
import FullReload from 'vite-plugin-full-reload';

export default defineConfig({
  root: './',
  plugins: [
    FullReload(['**/*.js'])
  ],
  server: {
    watch: {
      usePolling: true,
      interval: 100
    }
  },
  optimizeDeps: {
    include: ['some-dependency'] // Lista explícita de dependencias a pre-bundle
  }
});
