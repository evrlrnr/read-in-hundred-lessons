import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves at /<repo>/ — relative paths work from any subpath.
  base: './',
});
