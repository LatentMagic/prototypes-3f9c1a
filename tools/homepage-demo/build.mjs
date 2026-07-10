// ============================================================================
// Circlists homepage-demo build.
//
// Derives the public homepage demo FROM the working-line prototype in ./src by
// DELETION ONLY — no source file is edited. The working line is authored so that
// every surface the demo must not show (New circle, circle settings, account,
// and the dev aids) becomes unreachable once the preview gate is lit; the files
// behind those surfaces then drop with no dangling reference on any live path.
//
// What the build does that the raw prototype does not:
//   • concatenates the KEPT modules (in the entry's own load order) and runs ONE
//     JSX→JS transform + minify → a single app.js. This drops babel-standalone
//     and the per-module XHR fetch the prototype does at runtime — the real perf
//     win for an embedded iframe. React / ReactDOM stay on the CDN (production).
//   • lights the preview gate by setting window.CIRC_FORCE_GATE in the embed
//     (main.jsx reads it) — the one "activation" step, done here, not by editing
//     any module.
//
// Re-derive after a new working-line export: replace ./src wholesale, `npm run
// build`. The DELETE_LIST below IS the derivation rule; keep it in step with what
// the gate makes unreachable.
// ============================================================================
import { readFile, writeFile, mkdir, rm, cp } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, 'src');
const OUT = path.join(__dirname, '..', '..', 'app', 'circlists', 'homepage-demo');

// The derivation rule. Files present in the working line that the public demo
// drops — every one is unreachable once the gate is lit, or a dev-only aid.
const DELETE_LIST = new Set([
  'scenarios.jsx',    // dev aid — the scenario launcher (window-guarded in main)
  'circ-tweaks.jsx',  // dev aid — tweaks wiring (window-guarded in main)
  'tweaks-panel.jsx', // dev aid — tweaks panel UI (typeof-guarded in main)
  'auth.jsx',         // sign-in / up / otc / recovery — never authenticates in preview
  'spaces.jsx',       // create / members / account surfaces — all gated-unreachable
]);

async function main() {
  const entryHtml = await readFile(path.join(SRC, 'circlists.html'), 'utf8');

  // 1. Ordered module list = the entry's own babel <script> tags, minus the strip.
  const scriptRe = /<script\s+type="text\/babel"\s+src="app\/([^"]+)"><\/script>/g;
  const ordered = [...entryHtml.matchAll(scriptRe)].map(m => m[1]);
  const kept = ordered.filter(f => !DELETE_LIST.has(f));
  if (!kept.length) throw new Error('No modules matched — check src/circlists.html script tags.');

  // 2. Concatenate the kept modules verbatim, in load order (no source edits).
  const parts = [];
  for (const f of kept) {
    parts.push(`// ==== app/${f} ====\n` + await readFile(path.join(SRC, 'app', f), 'utf8'));
  }
  const concat = parts.join('\n;\n');

  // 3. One JSX→JS transform + minify → the single served bundle.
  const { code } = await esbuild.transform(concat, {
    loader: 'jsx',
    jsx: 'transform',          // classic React.createElement (React is a CDN global)
    minify: true,
    target: 'es2020',
    legalComments: 'none',
  });

  // 4. Reset output, write bundle + static assets.
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });
  await writeFile(path.join(OUT, 'app.js'), code);
  await cp(path.join(SRC, 'tokens.css'), path.join(OUT, 'tokens.css'));
  await cp(path.join(SRC, 'swell.css'), path.join(OUT, 'swell.css'));
  await cp(path.join(SRC, 'brand'), path.join(OUT, 'brand'), { recursive: true });

  // 5. Derive the embed HTML from the entry: drop babel + the per-module scripts,
  //    move React/ReactDOM to production (dropping the now-stale SRI hashes), light
  //    the gate, and load the one prebuilt bundle.
  const html = entryHtml
    .replace(/^.*@babel\/standalone.*\n/m, '')
    .replace(/\s*<script\s+type="text\/babel"[^>]*><\/script>/g, '')
    .replace(/react\.development\.js/g, 'react.production.min.js')
    .replace(/react-dom\.development\.js/g, 'react-dom.production.min.js')
    .replace(/\s+integrity="[^"]*"/g, '')
    .replace(/\s+crossorigin="[^"]*"/g, '')
    .replace(/<title>[^<]*<\/title>/, '<title>Circlists — homepage demo</title>')
    .replace(/<\/body>/,
      '<script>window.CIRC_FORCE_GATE = true;</script>\n' +
      '<script src="app.js"></script>\n</body>');

  await writeFile(path.join(OUT, 'index.html'), html);

  console.log(`Built homepage demo → ${path.relative(path.join(__dirname, '..', '..'), OUT)}`);
  console.log(`  kept   : ${kept.join(', ')}`);
  console.log(`  dropped: ${[...DELETE_LIST].join(', ')}`);
  console.log(`  app.js : ${(Buffer.byteLength(code) / 1024).toFixed(1)} KB`);
}

main().catch(e => { console.error(e); process.exit(1); });
