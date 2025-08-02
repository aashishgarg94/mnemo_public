import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
    extensions: ['.js', '.jsx'], // Ensure .jsx files are resolved
  },
  server: {
    port: 3000,
    open: true, // Open browser on server start
    historyApiFallback: true,
  },
  build: {
    outDir: 'build',
    sourcemap: true, // Useful for debugging
  },
});