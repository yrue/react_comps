import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.js'],
  },
  build: {
    rollupOptions: {
      input: 'src/main.tsx', // Update the input to point to your entry file
    },
  },
})
