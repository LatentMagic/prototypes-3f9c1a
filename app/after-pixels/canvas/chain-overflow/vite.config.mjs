// Builds the Chain overflow canvas: canvas.jsx, canon's main.jsx and everything they import, as build/canvas.js and build/canvas.css.
// Run from the repo root: npx vite build --config app/after-pixels/canvas/chain-overflow/vite.config.mjs
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));

export default {
  root,
  publicDir: false,
  esbuild: { jsx: 'transform', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment' },
  build: {
    lib: { entry: path.join(root, 'canvas.jsx'), name: 'ChainOverflowCanvas', formats: ['iife'], fileName: () => 'canvas.js', cssFileName: 'canvas' },
    outDir: path.join(root, 'build'),
    emptyOutDir: true,
    minify: false,
    sourcemap: false,
    rollupOptions: {
      external: ['react', 'react-dom/client'],
      output: { globals: { react: 'React', 'react-dom/client': 'ReactDOM' } },
    },
  },
};
