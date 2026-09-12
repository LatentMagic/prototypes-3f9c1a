// ============================================================================
// BIZ-136 whiteboard — build. Writes both artefacts from one module list:
//
//   mobile-chrome-whiteboard.html             the working rig, Babel-based, at
//                                             the project root so app/* and
//                                             tokens.css resolve.
//   mobile-chrome-whiteboard-standalone.html  the asset: compiled, pure HTML,
//                                             no transpiler, no external fetch
//                                             except Google Fonts.
//
// Authoring stays in JSX; the conversion happens at EXPORT. Each module is
// compiled to its own <script> rather than concatenated into one, because
// Babel-type scripts do not share scope in the browser and the modules rely on
// that (they all declare top-level names and publish onto window).
//
// Run from the candidate build root:  node docs/specs/biz-136-mobile-chrome/build.mjs
// Vendor files (Babel, React UMD) are fetched once into .build-cache/ beside
// this script and reused.
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');            // the candidate build root
const CACHE = path.join(HERE, '.build-cache');
const REL = 'docs/specs/biz-136-mobile-chrome';

const MODULES = [
  'app/seed-data.jsx', 'app/primitives.jsx', 'app/brand-motion.jsx', 'app/liveliness.jsx',
  'app/swell-reactions.jsx', 'app/feed.jsx', 'app/feed-sort.jsx', 'app/feed-lens.jsx',
  'app/feed-saved.jsx', 'app/feed-search.jsx', 'app/card-share.jsx', 'app/shell.jsx',
  'app/home.jsx', 'app/app-shell.jsx',
  'app/talk-parts.jsx', 'app/talk-data.jsx', 'app/talk-add.jsx', 'app/talk-card.jsx',
  'app/talk-reveal.jsx', 'app/talk-surface.jsx', 'app/talk-return.jsx', 'app/home-returns.jsx',
  `${REL}/pg-mc-chrome.jsx`, `${REL}/pg-mc-board.jsx`,
];

const VENDOR = {
  'babel.min.js': 'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js',
  'react.production.min.js': 'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
  'react-dom.production.min.js': 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
};

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

async function vendor(name) {
  fs.mkdirSync(CACHE, { recursive: true });
  const file = path.join(CACHE, name);
  if (!fs.existsSync(file)) {
    const res = await fetch(VENDOR[name]);
    if (!res.ok) throw new Error(`${name}: ${res.status}`);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return fs.readFileSync(file, 'utf8');
}

// ---- The page's shell, shared by both artefacts -----------------------------
// The app's own stylesheet set, in the app's own order: tokens, swell, then the
// classes the mounted components rely on (they live in circlists.html, not in
// the modules), then the board's own chrome.
const appStyle = () => {
  const src = read('circlists.html').split('\n');
  const open = src.findIndex((l) => l.trim() === '<style>');
  const close = src.findIndex((l) => l.trim() === '</style>');
  return src.slice(open + 1, close).join('\n');
};

const HEAD_TITLE = 'Whiteboard — the phone&rsquo;s chrome (BIZ-136)';

// ---- 1. The working rig ------------------------------------------------------
function buildWorking() {
  const style = appStyle() + '\n' + read(`${REL}/board.css`);
  const scripts = MODULES.map((m) => `<script type="text/babel" src="${m}"></script>`).join('\n');
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>${HEAD_TITLE}</title>
<link rel="icon" type="image/svg+xml" href="brand/assets/favicon.svg" />
<link rel="stylesheet" href="tokens.css" />
<link rel="stylesheet" href="swell.css" />
<style>
${style}
</style>
</head>
<body>
<div id="board"></div>

<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" crossorigin="anonymous"></script>

${scripts}
</body>
</html>
`;
  fs.writeFileSync(path.join(ROOT, 'mobile-chrome-whiteboard.html'), html);
  return html.length;
}

// ---- 2. The standalone -------------------------------------------------------
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const dataUri = (rel) => {
  const buf = fs.readFileSync(path.join(ROOT, rel));
  return `data:${MIME[path.extname(rel).toLowerCase()] || 'application/octet-stream'};base64,${buf.toString('base64')}`;
};

// Every local file the app asks for by relative path. Inlined, because the
// standalone is opened from wherever it was downloaded to and nothing relative
// resolves there.
const LOCAL_ASSETS = [
  'brand/assets/circlists-lockup.svg',
  'brand/assets/circlists-wordmark.svg',
  ...fs.readdirSync(path.join(ROOT, 'uploads/card-previews')).filter((f) => /\.(png|jpe?g)$/i.test(f)).map((f) => `uploads/card-previews/${f}`),
  ...fs.readdirSync(path.join(ROOT, 'uploads/card-favicons')).filter((f) => /\.(png|ico|jpe?g)$/i.test(f)).map((f) => `uploads/card-favicons/${f}`),
];

// The card garnish. app/feed.jsx falls back to Google's live favicon service
// for any host app/seed-data.jsx has no local file for, which is an external
// fetch the standalone may not make. So every host in the seed is resolved ONCE
// here, at build time, and baked in — the fallback then never fires.
async function faviconMap(seedSrc) {
  const hosts = new Set();
  for (const m of seedSrc.matchAll(/https?:\/\/([^/'"\s]+)/g)) {
    const h = m[1].toLowerCase();
    if (h.endsWith('gstatic.com') || h.endsWith('googleapis.com') || h === 'www.google.com') continue;
    hosts.add(h);
  }
  const out = {};
  for (const h of hosts) {
    try {
      const res = await fetch(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(h)}&sz=64`);
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 64) continue;      // the service's grey placeholder globe
      out[h] = `data:${res.headers.get('content-type') || 'image/png'};base64,${buf.toString('base64')}`;
    } catch { /* a host that will not resolve simply gets no garnish */ }
  }
  return out;
}

async function buildStandalone() {
  const Babel = new Function(await vendor('babel.min.js') + '\nreturn Babel;')();
  const react = await vendor('react.production.min.js');
  const reactDom = await vendor('react-dom.production.min.js');

  const assets = Object.fromEntries(LOCAL_ASSETS.map((a) => [a, dataUri(a)]));
  const inline = (s) => {
    for (const [rel, uri] of Object.entries(assets)) s = s.split(rel).join(uri);
    return s;
  };

  const favicons = await faviconMap(read('app/seed-data.jsx'));
  // Published after seed-data.jsx, so it replaces that file's own resolver: the
  // baked map first (including the local .ico files it already knew about),
  // then nothing — never Google's live service.
  const faviconShim = `(() => {
  const BAKED = ${JSON.stringify(favicons)};
  const prev = window.CircFavicons;
  window.CircFavicons = (host) => {
    const local = prev ? prev(host) : null;
    if (local) return local;
    const h = String(host || '').toLowerCase();
    return BAKED[h] || BAKED['www.' + h] || BAKED[h.replace(/^www\\./, '')]
      || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  };
})();`;

  const compiled = MODULES.map((m) => {
    const src = read(m);
    const code = Babel.transform(src, { presets: ['react'], filename: path.basename(m) }).code;
    return { m, code: inline(code) };
  });

  // The shim rides immediately after seed-data.jsx, in its own program, so the
  // module order the app depends on is untouched.
  const bodyScripts = compiled.map(({ m, code }) => {
    const tag = `<script>\n/* ${m} */\n${code}\n</script>`;
    return m === 'app/seed-data.jsx' ? tag + `\n<script>\n/* standalone: baked favicons */\n${faviconShim}\n</script>` : tag;
  }).join('\n');

  const style = inline(read('tokens.css') + '\n' + read('swell.css') + '\n' + appStyle() + '\n' + read(`${REL}/board.css`));

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>${HEAD_TITLE}</title>
<style>
${style}
</style>
</head>
<body>
<div id="board"></div>
<script>\n${react}\n</script>
<script>\n${reactDom}\n</script>
${bodyScripts}
</body>
</html>
`;
  fs.writeFileSync(path.join(ROOT, 'mobile-chrome-whiteboard-standalone.html'), html);
  return { bytes: html.length, favicons: Object.keys(favicons).length };
}

const w = buildWorking();
console.log('working  ', w, 'bytes');
const s = await buildStandalone();
console.log('standalone', s.bytes, 'bytes ·', s.favicons, 'favicons baked');
