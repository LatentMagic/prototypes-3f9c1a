const { chromium } = require('playwright-core');
const crypto = require('crypto');

const URL = 'http://localhost:4321/app/circlists/canon/docs/specs/discourse/discourse-playground-v7-standalone.html';
const NAMES = ['The Question', 'The Depths', 'Countercard', 'The Seal', 'The Pulled Line', 'Sounding', 'Seats', 'The Dispatch', 'Palimpsest', 'The Stream'];
const BEATS = ['Attach', 'Land', 'Respond', 'Continue'];

const h = (s) => crypto.createHash('md5').update(s).digest('hex').slice(0, 8);

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1024, height: 720 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 120)));
  await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(4000);

  for (let i = 0; i < NAMES.length; i++) {
    await page.getByText(NAMES[i], { exact: true }).first().click({ timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(700);
    const seen = [];
    for (const b of BEATS) {
      let clicked = true;
      try {
        await page.getByRole('button', { name: b, exact: true }).first().click({ timeout: 3000 });
      } catch (e) { clicked = false; }
      await page.waitForTimeout(800);
      const dom = await page.evaluate(() => {
        const r = document.getElementById('root');
        // hash only the app surface, not the chrome, so beat state is what varies
        const surf = r.querySelector('[class*="surface"], main, section') || r;
        return surf.innerText.slice(0, 4000);
      });
      seen.push({ b, clicked, hash: h(dom), len: dom.length });
    }
    const uniq = new Set(seen.map((s) => s.hash)).size;
    const dead = seen.filter((s) => !s.clicked).map((s) => s.b);
    console.log(
      `${String(i + 1).padStart(2, '0')} ${NAMES[i].padEnd(16)} distinct-beat-states=${uniq}/4` +
      (dead.length ? `  UNCLICKABLE: ${dead.join(',')}` : '') +
      `  [${seen.map((s) => s.b[0] + ':' + s.hash).join(' ')}]`
    );
  }
  console.log('pageerrors:', errs.length);
  errs.slice(0, 5).forEach((e) => console.log('  !', e));
  await browser.close();
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
