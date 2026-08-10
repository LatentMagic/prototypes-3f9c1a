// Bundle the v7 discourse playground into one self-contained HTML file.
// Everything inlined: React, Babel, tokens, fonts as data URIs, every module.
// No external host is contacted at runtime — required by the artifact CSP.
const fs = require('fs');
const path = require('path');

const CANON = '/home/user/prototypes-3f9c1a/app/circlists/canon';
const DEMO = '/home/user/prototypes-3f9c1a/app/circlists/homepage-demo';
const ENTRY = path.join(CANON, 'discourse-playground-v7.html');
const OUT = path.join(CANON, 'docs/specs/discourse/discourse-playground-v7-standalone.html');

const read = (p) => fs.readFileSync(p, 'utf8');

// ---- fonts: inline the vendored woff2 files as data URIs -------------------
function fontCss() {
  let css = read(path.join(DEMO, 'fonts.css'));
  css = css.replace(/url\(([^)]+\.woff2)\)/g, (m, rel) => {
    const clean = rel.replace(/['"]/g, '').replace(/^\.\//, '');
    const file = path.join(DEMO, clean);
    if (!fs.existsSync(file)) { console.warn('  font missing:', clean); return m; }
    const b64 = fs.readFileSync(file).toString('base64');
    return `url(data:font/woff2;base64,${b64})`;
  });
  return css;
}

// ---- tokens: strip the Google Fonts import, it is replaced by the above ----
function tokensCss() {
  return read(path.join(CANON, 'tokens.css'))
    .replace(/@import\s+url\(['"]https:\/\/fonts\.googleapis\.com[^)]*\);?/g, '');
}

let html = read(ENTRY);

// ---- collect the module list in load order, then remove the tags ----------
const scriptRe = /<script([^>]*?)src="([^"]+)"([^>]*)><\/script>/g;
const externals = [];
let m;
while ((m = scriptRe.exec(html)) !== null) externals.push({ tag: m[0], attrs: m[1] + m[3], src: m[2] });

const vendor = [];
const modules = [];
for (const s of externals) {
  if (/^https?:/.test(s.src)) { vendor.push(s); continue; }
  modules.push(s);
}

console.log('vendor (external) scripts:', vendor.length);
console.log('local modules:', modules.length);

// ---- build the inlined vendor block ---------------------------------------
const react = read(path.join(DEMO, 'react.production.min.js'));
const reactDom = read(path.join(DEMO, 'react-dom.production.min.js'));
const babel = read(path.join(CANON, '.verify/babel.min.js'));

const vendorBlock = [
  '<script>' + react + '</script>',
  '<script>' + reactDom + '</script>',
  '<script>' + babel + '</script>',
].join('\n');

// ---- inline every local module in place, preserving order ------------------
let first = true;
for (const s of externals) {
  if (/^https?:/.test(s.src)) {
    html = html.replace(s.tag, () => (first ? vendorBlock : ''));
    first = false;
    continue;
  }
  const file = path.join(CANON, s.src);
  if (!fs.existsSync(file)) { console.warn('  MISSING MODULE:', s.src); continue; }
  const body = read(file).replace(/<\/script>/g, '<\\/script>');
  const type = /text\/babel/.test(s.attrs) ? ' type="text/babel"' : ' type="text/babel"';
  const inlined = `<script${type} data-src="${s.src}">\n${body}\n</script>`;
  html = html.replace(s.tag, () => inlined);
}

// ---- inline the stylesheets ------------------------------------------------
const tokenStyle = '<style>' + fontCss() + '\n' + tokensCss() + '</style>';
html = html.replace(/<link[^>]+href="tokens\.css"[^>]*>/, () => tokenStyle);
const swellStyle = '<style>' + read(path.join(CANON, 'swell.css')) + '</style>';
html = html.replace(/<link[^>]+href="swell\.css"[^>]*>/, () => swellStyle);


// ---- inline every uploads/* asset the modules reference, as data URIs ------
// The standalone lives in a different directory from the entry HTML, and the
// artifact host blocks external requests, so relative paths cannot survive.
const mimes = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
let inlinedAssets = 0, missingAssets = 0;
html = html.replace(/(['"`])(uploads\/[^'"`)]+?\.(?:png|jpe?g|ico|svg|webp))\1/g, (full, q, rel) => {
  const f = path.join(CANON, rel);
  if (!fs.existsSync(f)) { missingAssets++; return q + q; }
  const ext = path.extname(f).toLowerCase();
  const b64 = fs.readFileSync(f).toString('base64');
  inlinedAssets++;
  return q + 'data:' + (mimes[ext] || 'application/octet-stream') + ';base64,' + b64 + q;
});
console.log('assets inlined:', inlinedAssets, '| missing (blanked):', missingAssets);

// ---- neutralise the Google favicon fallback --------------------------------
// feed.jsx falls back to Google's favicon service for hosts with no local mark.
// That is a network call, so in the bundle it becomes empty and the component's
// own faviconOk path handles the absence.
const gCount = (html.match(/https:\/\/www\.google\.com\/s2\/favicons/g) || []).length;
html = html.replace(/'https:\/\/www\.google\.com\/s2\/favicons\?domain=' \+ encodeURIComponent\(host\) \+ '&sz=64'/g, () => "''");
html = html.replace(/"https:\/\/www\.google\.com\/s2\/favicons\?domain=" \+ encodeURIComponent\(host\) \+ "&sz=64"/g, () => '""');
console.log('google favicon fallbacks neutralised (was', gCount, ')');

// ---- drop the favicon link (it points at a file that will not travel) ------
html = html.replace(/<link[^>]+rel="icon"[^>]*>/, '');

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, html);

const mb = (fs.statSync(OUT).size / 1024 / 1024).toFixed(2);
console.log('written:', OUT, mb + 'MB');

// ---- prove no external host survives ---------------------------------------
const offHost = (html.match(/(?:src|href)="https?:\/\/[^"]+"/g) || [])
  .concat(html.match(/@import[^;]*https?:\/\/[^;]*/g) || [])
  .concat(html.match(/url\(https?:\/\/[^)]*\)/g) || []);
console.log('EXTERNAL REFS REMAINING:', offHost.length);
offHost.slice(0, 10).forEach((r) => console.log('  !', r.slice(0, 120)));
