import { defineConfig } from 'vite';

export default defineConfig({
  base: '/bubu-dudu-birthday/',
  server: {
    watch: {
      usePolling: true,
      interval: 500,
    },
  },
});
