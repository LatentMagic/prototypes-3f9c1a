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
//     win for an embedded iframe.
//   • vendors React / ReactDOM (production UMD) alongside the bundle and points
//     the entry's script tags at them, replacing the unpkg CDN URLs the working
//     line carries. A Design export fetches React from unpkg because it has no
//     build step; this demo does, and it ships on the public marketing site,
//     where every visitor hitting a third-party CDN is a disclosure we would
//     otherwise owe them. Vendored, the demo makes NO third-party request at all
//     and no longer depends on someone else's uptime. The React version is
//     pinned in package.json and asserted against the entry's URL below.
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
  'config.jsx',       // dev aid — the config launcher, was scenarios.jsx (window-guarded in main)
  'circ-tweaks.jsx',  // dev aid — tweaks wiring (window-guarded in main)
  'tweaks-panel.jsx', // dev aid — tweaks panel UI (typeof-guarded in main)
  'auth.jsx',         // sign-in / up / otc / recovery — never authenticates in preview
  'spaces.jsx',       // create / members / account surfaces — all gated-unreachable
]);

// React is vendored from node_modules rather than fetched from unpkg at runtime.
// The working line names the version it was authored against in its own script
// tags; package.json pins what we install. If those ever diverge the demo would
// silently run a React the prototype was never tested on — so this asserts they
// match rather than trusting them to stay in step.
async function vendorReact(entryHtml) {
  const wanted = entryHtml.match(/unpkg\.com\/react@([\d.]+)\/umd\//)?.[1];
  if (!wanted) {
    throw new Error('No React CDN tag in src/circlists.html — has the entry changed?');
  }
  const copied = [];
  for (const pkg of ['react', 'react-dom']) {
    const dir = path.join(__dirname, 'node_modules', pkg);
    const { version } = JSON.parse(await readFile(path.join(dir, 'package.json'), 'utf8'));
    if (version !== wanted) {
      throw new Error(
        `${pkg} ${version} is installed but the working line targets React ${wanted}. ` +
        `Pin ${pkg}@${wanted} in package.json, or re-point the entry.`,
      );
    }
    const file = `${pkg}.production.min.js`;
    await cp(path.join(dir, 'umd', file), path.join(OUT, file));
    copied.push(`${file} (${version})`);
  }
  return copied;
}

// Fonts are vendored for the same reason React is, and it matters more. The
// working line's tokens.css @imports Inter + JetBrains Mono from Google Fonts,
// which hands every visitor's IP to Google on page load — the one pattern here
// with real enforcement precedent behind it. The marketing site already
// self-hosts both faces (@fontsource in its Base layout); an embedded iframe
// reaching out to Google would quietly undo that.
//
// The @font-face rules are derived from the @fontsource packages rather than
// hand-written, so weights, formats and unicode-ranges are whatever upstream
// says they are. Latin only: the demo's content is English, and shipping all 42
// subsets would put 1.9MB in the repo to serve ~144KB of it.
// `as` renames the @fontsource family to the name the working line's tokens.css
// actually asks for. @fontsource-variable ships Inter as 'Inter Variable'; the
// prototype asks for 'Inter' (what Google Fonts serves it as). Without the
// rename nothing matches, Inter silently never loads, and the demo renders in
// the system fallback — with every check here still green, since the font
// request simply never happens.
const FONT_PKGS = [
  { entry: '@fontsource-variable/inter/wght.css', as: 'Inter' }, // variable — one file covers 400..700
  { entry: '@fontsource/jetbrains-mono/400.css' },
  { entry: '@fontsource/jetbrains-mono/500.css' },
  { entry: '@fontsource/jetbrains-mono/600.css' },
  { entry: '@fontsource/jetbrains-mono/700.css' },
];

async function vendorFonts() {
  const faces = [];
  const files = new Map();
  for (const { entry, as } of FONT_PKGS) {
    const cssPath = path.join(__dirname, 'node_modules', entry);
    const css = await readFile(cssPath, 'utf8');
    // Keep only the latin @font-face blocks; each names its own woff2.
    for (const block of css.split('@font-face').slice(1)) {
      const src = block.match(/url\(\.\/files\/([^)]+\.woff2)\)/)?.[1];
      if (!src?.includes('-latin-') || src.includes('-latin-ext-')) continue;
      let face = block.slice(0, block.lastIndexOf('}') + 1).replace('./files/', 'fonts/');
      if (as) face = face.replace(/font-family:\s*['"][^'"]+['"]/, `font-family: '${as}'`);
      faces.push('@font-face' + face);
      files.set(src, path.join(path.dirname(cssPath), 'files', src));
    }
  }
  if (!faces.length) throw new Error('No latin @font-face blocks found — has @fontsource changed layout?');
  await mkdir(path.join(OUT, 'fonts'), { recursive: true });
  for (const [name, from] of files) await cp(from, path.join(OUT, 'fonts', name));
  await writeFile(
    path.join(OUT, 'fonts.css'),
    '/* Vendored from @fontsource by tools/homepage-demo/build.mjs — latin subset.\n' +
    '   Replaces the working line\'s Google Fonts @import so the demo makes no\n' +
    '   third-party request. Do not hand-edit; re-run the build. */\n' +
    faces.join('\n') + '\n',
  );
  const families = [...new Set(faces.map(f => f.match(/font-family:\s*['"]([^'"]+)['"]/)?.[1]))];
  return { count: files.size, families };
}

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
  // In the raw prototype each kept file is its own <script type="text/babel">;
  // Babel Standalone hoists that script's top-level const/let to real globals, so
  // two scripts declaring the same top-level name (e.g. seed-data.jsx's `const M`
  // and main.jsx's `const { M } = window.CircSeed`) never collide — var-style
  // redeclaration is legal. Concatenating into one scope loses that isolation, and
  // esbuild refuses to downlevel const/let itself (no target lowers it), so this
  // line-start-only swap reproduces Babel's real behavior before compiling. Safe
  // here because every file in this codebase declares top-level bindings at column
  // 0 — nested/block-scoped const/let stay indented and untouched.
  const concat = parts.join('\n;\n').replace(/^(?:const|let)\b/gm, 'var');

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
  await cp(path.join(SRC, 'swell.css'), path.join(OUT, 'swell.css'));
  await cp(path.join(SRC, 'brand'), path.join(OUT, 'brand'), { recursive: true });
  const react = await vendorReact(entryHtml);
  const fonts = await vendorFonts();

  // tokens.css is derived, not copied: its Google Fonts @import is re-pointed at
  // the vendored faces. Everything else in it passes through untouched.
  const tokensSrc = await readFile(path.join(SRC, 'tokens.css'), 'utf8');
  const gfImport = /@import\s+url\(['"]?https:\/\/fonts\.googleapis\.com\/[^)]*\)\s*;/;
  if (!gfImport.test(tokensSrc)) {
    throw new Error('No Google Fonts @import in src/tokens.css — has the entry changed?');
  }
  // Every vendored face must be a family the tokens actually ask for. A name
  // mismatch is otherwise silent: the face just never matches, the font never
  // loads, and the demo renders in the fallback with no request to notice.
  for (const family of fonts.families) {
    if (!tokensSrc.includes(`'${family}'`)) {
      throw new Error(
        `Vendored font '${family}' is not requested by src/tokens.css. ` +
        `Alias it via FONT_PKGS[].as to the name the tokens use.`,
      );
    }
  }
  await writeFile(
    path.join(OUT, 'tokens.css'),
    tokensSrc.replace(gfImport, "@import url('fonts.css');"),
  );

  // 5. Derive the embed HTML from the entry: drop babel + the per-module scripts,
  //    move React/ReactDOM to production (dropping the now-stale SRI hashes), point
  //    them at the vendored copies instead of unpkg, light the gate, and load the
  //    one prebuilt bundle.
  const html = entryHtml
    .replace(/^.*@babel\/standalone.*\n/m, '')
    .replace(/\s*<script\s+type="text\/babel"[^>]*><\/script>/g, '')
    .replace(/react\.development\.js/g, 'react.production.min.js')
    .replace(/react-dom\.development\.js/g, 'react-dom.production.min.js')
    // Strip the CDN origin so the tags resolve to the vendored files sitting
    // beside app.js. Must run after the dev→prod swap above, which matches on
    // the filename these URLs still carry.
    .replace(/https:\/\/unpkg\.com\/react(?:-dom)?@[\d.]+\/umd\//g, '')
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
  console.log(`  vendored: ${react.join(', ')}`);
  console.log(`  fonts  : ${fonts.count} files, latin — ${fonts.families.join(' + ')}`);
  console.log(`  app.js : ${(Buffer.byteLength(code) / 1024).toFixed(1)} KB`);
}

main().catch(e => { console.error(e); process.exit(1); });
