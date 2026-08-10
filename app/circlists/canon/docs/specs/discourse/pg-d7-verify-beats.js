// ============================================================================
// Discourse v7 — beat verification.
// ----------------------------------------------------------------------------
// Walks every direction × every beat and hashes the app surface's rendered text
// at each one. A direction whose beats do not produce four distinct hashes is
// either not answering a layer or quietly rendering the previous beat.
//
// This exists because a verification pass that only switches directions,
// screenshots them and checks the console PASSED while the rig was profoundly
// broken. Mounting is not using. See README-v7.md.
//
//   node pg-d7-verify-beats.js            → 1024x720
//   node pg-d7-verify-beats.js 390 844    → phone
//
// Navigation is the driver strip's own prev/next, not the rail, so the walk is
// identical at both viewports (at 390 the rail is behind a drawer). The strip's
// title is asserted against the expected name at every step, so a click that
// silently fails is a hard failure and never a row of repeated hashes.
// ============================================================================
const { chromium } = require('playwright-core');
const crypto = require('crypto');

const URL = 'http://localhost:4321/app/circlists/canon/docs/specs/discourse/discourse-playground-v7-standalone.html';
const NAMES = [
  'The Question', 'The Depths', 'Countercard', 'The Seal', 'The Pulled Line',
  'Sounding', 'Seats', 'The Dispatch', 'Palimpsest', 'The Stream',
  'The Record', 'Said the Same', 'The Note',
];
const BEATS = ['Attach', 'Land', 'Respond', 'Continue'];

const VW = Number(process.argv[2]) || 1024;
const VH = Number(process.argv[3]) || 720;

const h = (s) => crypto.createHash('md5').update(s).digest('hex').slice(0, 8);

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: VW, height: VH } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
  await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(4000);
  console.log('viewport ' + VW + 'x' + VH);

  const title = () => page.$eval('.pg7-title', (n) => n.textContent.trim());
  const openStrip = async () => {
    if (await page.$('.pg7-beat')) return;
    await page.click('.pg7-name');
    await page.waitForTimeout(250);
  };

  await openStrip();
  let bad = 0;

  for (let i = 0; i < NAMES.length; i++) {
    if (i > 0) {
      await page.click('button[aria-label="Next direction"]');
      await page.waitForTimeout(700);
      await openStrip();
    }
    const shown = await title();
    if (shown !== NAMES[i]) {
      console.log(`${String(i + 1).padStart(2, '0')} EXPECTED ${NAMES[i]} BUT STRIP SAYS ${shown} — walk desynced`);
      bad++;
      continue;
    }

    const seen = [];
    for (const b of BEATS) {
      let clicked = true;
      try {
        await page.getByRole('button', { name: b, exact: true }).first().click({ timeout: 3000 });
      } catch (e) { clicked = false; }
      await page.waitForTimeout(800);
      const dom = await page.evaluate(() => {
        const r = document.getElementById('root');
        const surf = r.querySelector('[class*="surface"], main, section') || r;
        return surf.innerText.slice(0, 4000);
      });
      seen.push({ b, clicked, hash: h(dom), len: dom.length });
    }
    const uniq = new Set(seen.map((s) => s.hash)).size;
    const dead = seen.filter((s) => !s.clicked).map((s) => s.b);
    const thin = seen.filter((s) => s.len < 40).map((s) => s.b);
    if (uniq < 4 || dead.length || thin.length) bad++;
    console.log(
      `${String(i + 1).padStart(2, '0')} ${NAMES[i].padEnd(16)} distinct-beat-states=${uniq}/4` +
      (dead.length ? `  UNCLICKABLE: ${dead.join(',')}` : '') +
      (thin.length ? `  NEARLY-EMPTY: ${thin.join(',')}` : '') +
      `  [${seen.map((s) => s.b[0] + ':' + s.hash).join(' ')}]`
    );
  }

  console.log('pageerrors:', errs.length);
  errs.slice(0, 8).forEach((e) => console.log('  !', e));
  console.log(bad || errs.length ? 'RESULT: FAIL (' + bad + ' directions flagged)' : 'RESULT: PASS');
  await browser.close();
  process.exit(bad || errs.length ? 1 : 0);
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
