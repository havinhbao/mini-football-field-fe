import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgr()],
  assetsInclude: ['**/*.jpg', '**/*.png', '**/*.webp', '**/*.svg', '**/*.ttf'],
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
