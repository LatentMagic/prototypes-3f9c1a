// Builds the Delve route canvas: canvas.jsx, canon's Delve files and the design system's bundle, as build/canvas.js and build/canvas.css.
// Run from the repo root: npx vite build --config app/after-pixels/canvases/delve-route/vite.config.mjs
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));

// Canon keeps its Delve held roll, die and route private. The canvas draws those very parts, so this build (this build only) adds their
// exports to canon's gs-delve.jsx as it reads it; the file on disk is never touched.
const exposeDelve = {
  name: 'expose-delve-parts',
  enforce: 'post',
  transform(code, id) {
    if (!id.endsWith('canon/app/gs-delve.jsx')) return null;
    return { code: code + '\nexport { DlHeld, DlDie, DlDieBtn, DlRoute, DlBackArrow, DL_TIER };\n', map: null };
  },
};

export default {
  root,
  publicDir: false,
  plugins: [exposeDelve],
  esbuild: { jsx: 'transform', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment' },
  build: {
    lib: { entry: path.join(root, 'canvas.jsx'), name: 'DelveRouteCanvas', formats: ['iife'], fileName: () => 'canvas.js', cssFileName: 'canvas' },
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
