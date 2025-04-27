import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      // Add any aliases if needed
    }
  },
  build: {
    rollupOptions: {
      // Remove keytar from externals - we'll handle it separately
      external: []
    }
  }
});
