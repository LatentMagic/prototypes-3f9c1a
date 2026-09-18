#!/usr/bin/env node
'use strict';

// Headless sanity check for a prototype's addressable states.
//
//   npm run check -- [--slug canon] [--widths 1280,390] [--states a,b,c] [--port 4321]
//
// Boots server.js (unless something already answers on the port), caches the
// entry HTML's unpkg <script> runtime once to .playwright-mcp/check/cdn/ (so
// this works offline and in sandboxes where Chromium can't reach unpkg but
// curl can), then drives headless Chromium through every state the prototype
// declares on window.CIRC_STATES — plus one bogus id that must fall back to
// the states index — screenshotting each at each width and failing on any
// uncaught error, failed same-origin request, blank stage, or wrong fallback
// behaviour. See "Addressable states" in app/circlists/canon/ARCHITECTURE.md
// for what the state resolver does.

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { spawn, spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CACHE_DIR = path.join(ROOT, '.playwright-mcp', 'check', 'cdn');
const BOGUS_ID = '__check_bogus__';
const INDEX_HEADLINE = 'Every state this prototype can be opened at';

function log(...args) {
  console.log(...args);
}

function parseArgs(argv) {
  const opts = { slug: 'canon', widths: [1280, 390], states: null, port: 4321 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--slug') opts.slug = argv[++i];
    else if (a === '--widths') {
      opts.widths = argv[++i].split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !Number.isNaN(n));
    } else if (a === '--states') {
      opts.states = argv[++i].split(',').map((s) => s.trim()).filter(Boolean);
    } else if (a === '--port') {
      opts.port = parseInt(argv[++i], 10);
    } else {
      throw new Error(`unknown arg: ${a}`);
    }
  }
  if (!opts.widths.length) throw new Error('--widths parsed to no usable numbers');
  return opts;
}

// ---- entry html + CDN runtime -----------------------------------------

function findEntry(slug) {
  const entryPath = path.join(ROOT, 'app', 'circlists', slug, 'circlists.html');
  if (!fs.existsSync(entryPath)) {
    throw new Error(`no entry at app/circlists/${slug}/circlists.html`);
  }
  return entryPath;
}

function extractCdnUrls(html) {
  const urls = [];
  const re = /<script[^>]+src="(https:\/\/unpkg\.com\/[^"]+)"/g;
  let m;
  while ((m = re.exec(html))) urls.push(m[1]);
  return [...new Set(urls)];
}

function curlFetch(url, destPath) {
  const res = spawnSync('curl', ['-sSL', '-f', '-o', destPath, url], { stdio: ['ignore', 'ignore', 'pipe'] });
  if (res.status === 0 && fs.existsSync(destPath) && fs.statSync(destPath).size > 0) return true;
  if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
  return false;
}

function nodeFetch(url, destPath) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(destPath);
    const cleanup = () => { try { file.close(); } catch {} try { fs.unlinkSync(destPath); } catch {} };
    https.get(url, (res) => {
      if (res.statusCode !== 200) { cleanup(); resolve(false); return; }
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(true)));
      file.on('error', () => { cleanup(); resolve(false); });
    }).on('error', () => { cleanup(); resolve(false); });
  });
}

async function ensureCdnCache(urls) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const map = new Map();
  for (const url of urls) {
    const name = path.basename(new URL(url).pathname);
    const dest = path.join(CACHE_DIR, name);
    map.set(url, dest);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      log(`cdn: cached ${name}`);
      continue;
    }
    log(`cdn: fetching ${name} <- ${url}`);
    let ok = curlFetch(url, dest);
    if (!ok) {
      log(`cdn: curl failed for ${name}, trying node https`);
      ok = await nodeFetch(url, dest);
    }
    if (!ok) throw new Error(`cdn: could not fetch ${url} (curl and node https both failed, no cache at ${dest})`);
  }
  return map;
}

// ---- server.js lifecycle ------------------------------------------------

function portAnswers(port) {
  return new Promise((resolve) => {
    const req = http.get({ host: '127.0.0.1', port, path: '/', timeout: 1000 }, (res) => {
      res.resume();
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

async function waitForPort(port, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await portAnswers(port)) return true;
    await new Promise((r) => setTimeout(r, 100));
  }
  return false;
}

async function ensureServer(port) {
  if (await portAnswers(port)) {
    log(`server: already answering on :${port}, using it`);
    return null;
  }
  log(`server: starting server.js on :${port}`);
  const proc = spawn(process.execPath, [path.join(ROOT, 'server.js')], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'ignore', 'inherit'],
  });
  const ok = await waitForPort(port, 10000);
  if (!ok) {
    proc.kill();
    throw new Error(`server.js did not come up on :${port} within 10s`);
  }
  return proc;
}

// ---- chromium launch ------------------------------------------------------

async function launchChromium(chromium) {
  const candidates = [];
  if (process.env.CHROME_PATH) {
    candidates.push({ opts: { executablePath: process.env.CHROME_PATH }, label: `CHROME_PATH=${process.env.CHROME_PATH}` });
  }
  const base = '/opt/pw-browsers';
  if (fs.existsSync(base)) {
    const dirs = fs.readdirSync(base).filter((d) => d.startsWith('chromium-')).sort();
    for (const d of dirs) {
      const p = path.join(base, d, 'chrome-linux', 'chrome');
      if (fs.existsSync(p)) {
        candidates.push({ opts: { executablePath: p }, label: `/opt/pw-browsers/${d}/chrome-linux/chrome` });
        break;
      }
    }
  }
  candidates.push({ opts: { channel: 'chrome' }, label: 'channel:chrome' });
  candidates.push({ opts: {}, label: 'playwright-core bundled default' });

  let lastErr;
  for (const c of candidates) {
    try {
      const browser = await chromium.launch({ ...c.opts, args: ['--no-sandbox'] });
      log(`chromium: launched via ${c.label}`);
      return browser;
    } catch (err) {
      lastErr = err;
    }
  }
  throw new Error(`chromium: no launch candidate worked (${lastErr && lastErr.message})`);
}

// ---- routing --------------------------------------------------------------

function isSameOrigin(urlStr, port) {
  try {
    const u = new URL(urlStr);
    return u.hostname === '127.0.0.1' && Number(u.port || 80) === Number(port);
  } catch {
    return false;
  }
}

async function attachRouting(context, port, cdnMap, onEgress) {
  await context.route('**/*', (route) => {
    const url = route.request().url();
    if (isSameOrigin(url, port)) { route.continue(); return; }
    if (cdnMap.has(url)) {
      try {
        const body = fs.readFileSync(cdnMap.get(url));
        route.fulfill({ status: 200, contentType: 'text/javascript', body });
      } catch {
        route.abort();
      }
      return;
    }
    if (onEgress) onEgress(url);
    route.abort();
  });
}

// ---- state discovery --------------------------------------------------------

async function discoverStates(browser, opts, cdnMap) {
  if (opts.states && opts.states.length) return opts.states;
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await attachRouting(context, opts.port, cdnMap, null);
  const page = await context.newPage();
  const url = `http://127.0.0.1:${opts.port}/app/circlists/${opts.slug}/circlists.html?state=index`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Array.isArray(window.CIRC_STATES) && window.CIRC_STATES.length > 0, { timeout: 10000 });
  const ids = await page.evaluate(() => window.CIRC_STATES.map((s) => s.id));
  await context.close();
  return ids;
}

// ---- per state x width check ------------------------------------------------

async function testState(browser, opts, cdnMap, id, width) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const jsErrors = [];
  const failedRequests = [];
  let egress = false;

  await attachRouting(context, opts.port, cdnMap, () => { egress = true; });

  const page = await context.newPage();
  page.on('pageerror', (err) => jsErrors.push(String((err && err.message) || err)));
  page.on('console', (msg) => {
    // Chromium logs a console 'error' for every network-level resource
    // failure too (a page's own uncaught exceptions arrive via 'pageerror'
    // instead) — including the off-origin fonts/favicons this check aborts
    // on purpose. Those are tracked separately (egress) and are not app bugs.
    if (msg.type() === 'error' && !/^Failed to load resource:/.test(msg.text())) jsErrors.push(msg.text());
  });
  page.on('requestfailed', (req) => {
    const url = req.url();
    if (isSameOrigin(url, opts.port)) failedRequests.push(`${url} (${req.failure() && req.failure().errorText})`);
  });
  page.on('response', (res) => {
    const url = res.url();
    if (isSameOrigin(url, opts.port) && res.status() >= 400) failedRequests.push(`${url} (HTTP ${res.status()})`);
  });

  const targetUrl = `http://127.0.0.1:${opts.port}/app/circlists/${opts.slug}/circlists.html?state=${encodeURIComponent(id)}`;
  let navErr = null;
  let blank = true;
  try {
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    // "Non-empty" means anything mounted — text or markup. Several states
    // (loading interstitials: app-loading, manage-funding) are legitimately
    // a spinner with no text at all, so text-only would false-positive them.
    await page.waitForFunction(() => {
      const el = document.getElementById('root');
      return !!(el && el.innerHTML && el.innerHTML.trim().length > 0);
    }, { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(400);
    const html = await page.evaluate(() => {
      const el = document.getElementById('root');
      return el ? el.innerHTML.trim() : '';
    });
    blank = html.length === 0;
  } catch (err) {
    navErr = err.message;
  }

  let indexHeadlinePresent = false;
  try {
    indexHeadlinePresent = await page.evaluate((needle) => document.body && document.body.innerText.includes(needle), INDEX_HEADLINE);
  } catch { /* page may be gone if nav errored */ }

  const shotDir = path.join(ROOT, '.playwright-mcp', 'check', opts.slug);
  fs.mkdirSync(shotDir, { recursive: true });
  const shotPath = path.join(shotDir, `${id}-${width}.png`);
  try { await page.screenshot({ path: shotPath }); } catch { /* best effort */ }

  await context.close();

  const isBogus = id === BOGUS_ID;
  const reasons = [];
  if (navErr) reasons.push(`nav error: ${navErr}`);
  if (jsErrors.length) reasons.push(`js error: ${jsErrors[0]}`);
  if (failedRequests.length) reasons.push(`failed request: ${failedRequests[0]}`);
  if (blank) reasons.push('blank #root');
  if (isBogus) {
    if (!indexHeadlinePresent) reasons.push('bogus id did not fall back to states index — checker cannot detect a broken resolver');
  } else if (indexHeadlinePresent) {
    reasons.push('fell back to states index (resolver did not recognise this id)');
  }

  return { id, width, ok: reasons.length === 0, reasons, egress };
}

// ---- main -------------------------------------------------------------------

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const entryPath = findEntry(opts.slug);
  const html = fs.readFileSync(entryPath, 'utf8');
  const cdnUrls = extractCdnUrls(html);
  log(`cdn: ${cdnUrls.length} runtime url(s) declared in circlists.html`);
  const cdnMap = await ensureCdnCache(cdnUrls);

  const serverProc = await ensureServer(opts.port);
  let browser;
  let exitCode = 0;
  try {
    const { chromium } = require('playwright-core');
    browser = await launchChromium(chromium);

    const realIds = await discoverStates(browser, opts, cdnMap);
    const ids = [...realIds, BOGUS_ID];
    log(`states: ${realIds.length} declared + 1 bogus canary, x ${opts.widths.length} width(s) = ${ids.length * opts.widths.length} checks`);

    const results = [];
    let anyEgress = false;
    for (const id of ids) {
      for (const width of opts.widths) {
        const r = await testState(browser, opts, cdnMap, id, width);
        if (r.egress) anyEgress = true;
        results.push(r);
        const line = `${r.ok ? 'ok  ' : 'FAIL'}  ${id} @ ${width}px`;
        console.log(r.reasons.length ? `${line}  — ${r.reasons.join('; ')}` : line);
      }
    }

    if (anyEgress) log('note: off-origin requests were aborted (sandbox egress — fonts/favicons); not counted as failures');

    const fails = results.filter((r) => !r.ok);
    log(`summary: ${results.length} checks, ${results.length - fails.length} ok, ${fails.length} FAIL`);
    if (fails.length) exitCode = 1;
  } finally {
    if (browser) await browser.close();
    if (serverProc) serverProc.kill();
  }
  process.exit(exitCode);
}

main().catch((err) => {
  console.error(`check: ${err && err.stack ? err.stack : err}`);
  process.exit(1);
});
