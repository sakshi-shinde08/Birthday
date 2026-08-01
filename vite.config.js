import { defineConfig } from 'vite';

export default defineConfig({
  base:'/Birthday/',
  server: {
    watch: {
      usePolling: true,
      interval: 500,
    },
  },
});

