// Builds the After Pixels design system: every components/**/*.{jsx,js} file, as one script
// (_ds_bundle.js) that sets window.MCPGameStoreDesignSystem_ef1abd. Run with `npm run build:ds`.
// React stays a page global. Consumers: canon (imports the bundle) and the .card.html / find.html pages (script tag).
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { parse } from '@babel/parser';

const root = path.dirname(fileURLToPath(import.meta.url));
const NAMESPACE = 'MCPGameStoreDesignSystem_ef1abd';
const repoRoot = path.resolve(root, '../../..');
const VIRTUAL = path.join(root, 'ds-entry.virtual.js');

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(dir, e.name)) : /\.jsx?$/.test(e.name) ? [path.join(dir, e.name)] : []);
const rel = (f) => path.relative(root, f).split(path.sep).join('/');
const sources = walk(path.join(root, 'components')).sort((a, b) => rel(a).localeCompare(rel(b)));

// Every named export of every source file. A name starting with a capital is part of the public
// surface (window namespace); lower-case helpers (cbPress, usePress...) are bundled but not exposed.
function exportsOf(file) {
  const ast = parse(fs.readFileSync(file, 'utf8'), { sourceType: 'module', plugins: ['jsx'] });
  const names = [];
  for (const n of ast.program.body) {
    if (n.type !== 'ExportNamedDeclaration') continue;
    if (n.declaration?.id) names.push(n.declaration.id.name);
    for (const d of n.declaration?.declarations ?? []) names.push(d.id.name);
    for (const s of n.specifiers) names.push(s.exported.name);
  }
  return names;
}
const entries = sources.map((f) => ({ file: f, sourcePath: rel(f), names: exportsOf(f) }));
const exposed = entries.flatMap((e) => e.names.filter((n) => /^[A-Z]/.test(n)).map((name) => ({ name, sourcePath: e.sourcePath })));
const unexposed = entries.flatMap((e) => e.names.filter((n) => !/^[A-Z]/.test(n)).map((name) => ({ name, sourcePath: e.sourcePath }))).sort((a, b) => a.name.localeCompare(b.name));
const sourceHashes = Object.fromEntries(entries.map((e) =>
  [e.sourcePath, crypto.createHash('sha256').update(fs.readFileSync(e.file)).digest('hex').slice(0, 12)]));

// Read by the prototyping-trial build (namespace, components, sourceHashes).
const header = { format: 4, namespace: NAMESPACE, components: exposed, sourceHashes, inlinedExternals: [], unexposedExports: unexposed };

const entrySource = [
  ...entries.map((e, i) => `import * as m${i} from ${JSON.stringify(e.file)};`),
  `const ns = (window.${NAMESPACE} = window.${NAMESPACE} || {});`,
  'ns.__errors = ns.__errors || [];',
  ...entries.flatMap((e, i) => e.names.filter((n) => /^[A-Z]/.test(n)).map((n) => `ns.${n} = m${i}.${n};`)),
].join('\n');

const virtualEntry = {
  name: 'ds-entry',
  resolveId: (id) => (id === VIRTUAL ? id : null),
  load: (id) => (id === VIRTUAL ? entrySource : null),
  // Added after Vite's own chunk passes, which strip comments.
  generateBundle(_, bundle) {
    for (const chunk of Object.values(bundle)) {
      if (chunk.type === 'chunk') chunk.code = `/* @ds-bundle: ${JSON.stringify(header)} */\n${chunk.code}`;
    }
  },
};

export default {
  root: repoRoot, // outDir (this folder) must sit below Vite's root
  publicDir: false,
  plugins: [virtualEntry],
  esbuild: { jsx: 'transform', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment' },
  build: {
    lib: { entry: VIRTUAL, name: 'AfterPixelsDesignSystem', formats: ['iife'], fileName: () => '_ds_bundle.js' },
    outDir: root,
    emptyOutDir: false,
    minify: false,
    sourcemap: false,
    rollupOptions: {
      external: ['react'],
      output: {
        globals: { react: 'React' },
      },
    },
  },
};
