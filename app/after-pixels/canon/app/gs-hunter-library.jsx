// ============================================================================
// After Pixels — 36,000 Summers Ago's library page: the library game page's four parts, fitted to a game with no editions.
// Per game-specs/36000-summers-ago.md there is no streak and no result to share (its session page shares the product page link), so the run shows the weeks you played
// rather than a streak. The now card is your latest day, with where you left off. Records are invented.
// ============================================================================
const HG_ENDS = ['Home by the fire', 'Slept at the springs', 'Slept in the cave mouth', 'Home with full hands', 'Slept out on the plain'];
// Each day keeps how it ended, what happened in it and what it earned (earns). Day 18 (5 October) is the latest.
// A day that ended without an ending (end: null) is not finished.
const HG_POOL = {
  Slept: ['At the fire, by Aunt', 'At the springs', 'In the cave mouth', 'At the fire, with the band', 'Out on the plain'],
  Joined: ['The ibex hunt, and the meeting of the bands', 'The walk to the springs', 'Digging roots with Aunt', 'The reindeer watch', 'Painting at the wall'],
  With: ['Aunt and the two hunters', 'The gatherers', 'Aunt', 'The whole band', 'The old storyteller'],
  Made: ['A bone needle', 'A flint scraper', 'A carrying bag', 'Nothing', 'A shell bead'],
  Saw: ['Ibex and a cave lion', 'Horses at the river', 'A herd of reindeer', 'A woolly rhino, far off', 'Cave bears asleep'],
  Weather: ['Hot, then thunder at dusk', 'Cold wind all day', 'Clear and dry', 'Rain until midday', 'Mist over the river'],
};
// What each finished day earned (sample), by day index; every one falls on or before 17 September.
const HG_EARNS = { 6: ['fire'], 7: ['dusk', 'hunters'], 9: ['aunt'], 10: ['springs'], 11: ['hands'] };
const HG_DAYS = Array.from({ length: 18 }, (_, i) => {
  const d = new Date(2026, 9, 5 - 3 * i - (i % 2));
  const restarted = i % 5 === 3;
  return { id: 'hg' + i, d, date: lbDate(d), month: lbMonth(d), played: true, restarted, title: 'Day ' + (18 - i), end: restarted ? null : HG_ENDS[i % 5], earns: HG_EARNS[i] || [],
    // Where you slept agrees with how the day ended (HG_ENDS and HG_POOL.Slept share an order).
    facts: Object.entries(HG_POOL).map(([k, v], n) => [k, k === 'Slept' ? v[i % 5] : v[(i * (n + 2)) % v.length]]) };
});
const HG_LATEST = HG_DAYS[0];
const hgSid = (x) => 'hunter-' + x.id;
const hgStatus = (x) => ({ kind: x.restarted ? 'none' : 'ok', label: GS_RESULT.hunter({ restarted: !!x.restarted }) });
const hgFact = (p, k) => { const f = p.src.facts.find(([n]) => n === k); return f ? f[1] : null; };
// A session page for every day: the result matches its row; the record is what happened in the day. Share carries the product page link only (MCPG-030 AF-04).
HG_DAYS.forEach((x) => {
  GS_SESSIONS[hgSid(x)] = { kind: 'day', gid: 'hunter', game: GS_NAME.hunter, art: 'hunter', title: x.title, result: hgStatus(x).label, date: x.d.toLocaleString('en-GB', { weekday: 'long' }) + ' ' + x.date,
    figures: x.end ? [x.title, x.end] : [x.title], listTitle: 'The day', share: null, lines: x.facts };
});
GS_SESSIONS.hunter = GS_SESSIONS[hgSid(HG_LATEST)];
const HG_ACH = [
  ['fire', 'Fed the Fire'], ['aunt', 'Dug with Aunt'], ['dusk', 'One of Us at Dusk'], ['hunters', 'Walked with the Hunters'],
  ['wall', 'A Line on the Wall'], ['walk', 'The Long Walk'], ['springs', 'Met at the Springs'], ['hands', 'Home with Full Hands'], ['meat', 'Meat Home Whole'],
].map(([k, n]) => ({ k, n, how: 'Earn it in a day at camp.', by: (p) => p.src.earns.includes(k) })).concat([
  { k: 'big', n: 'The Big Animals', how: 'See every big animal, over many days.', of: 6, count: lbDistinct((p) => hgFact(p, 'Saw')) },
  { k: 'three', n: 'Hunt, Springs and Wall', how: 'Join all three set moments, over many days.', of: 3, count: lbDistinct((p) => { const j = hgFact(p, 'Joined') || ''; return /hunt/.test(j) ? 'hunt' : /springs/.test(j) ? 'springs' : /wall/.test(j) ? 'wall' : null; }) },
  { k: 'made', n: 'Made Something', how: 'Make things in camp, over many days.', of: 5, count: lbDistinct((p) => { const m = hgFact(p, 'Made'); return m === 'Nothing' ? null : m; }) },
  { k: 'quarrel', n: 'Eased a Quarrel', how: 'Ease quarrels in the band, over many days.', of: 3, count: () => [] },
]);
const HG_BADGES = lbAutoBadges(HG_ACH);
const hgGo = (gs, sid) => gs.go('hunter', sid ? { page: 'record', sid } : { page: 'record' });
const hgRow = (gs, x) => ({ key: x.id, title: x.title, date: lbShort(x.date), status: hgStatus(x),
  onOpen: () => gs.go('session', { id: hgSid(x) }) });

// Your latest day in the record: how it ended (or that it isn't finished), then three facts from it. The whole day is one tap away.
// last: a Pass-ended player's last day before the Pass ended.
const HgLatest = ({ day, last }) => {
  const gs = useGs();
  const facts = day.facts.filter(([k]) => ['Slept', 'With', 'Made'].includes(k));
  return (
    <section className="lb-card">
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">{(last ? 'YOUR LAST DAY · ' : 'YOUR LATEST DAY · ') + day.date.toUpperCase()}</span><h2 className="mcp-t-sec">{day.end || hgStatus(day).label}</h2></div>
        <DS.TextLink onClick={() => gs.go('session', { id: hgSid(day) })}>See the whole day</DS.TextLink>
      </div>
      <dl className="lb-facts">{facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
    </section>
  );
};
// The last ten weeks, oldest first: did the record hold a day in each? Days played counts finished days.
const hgWeeks = (plays) => Array.from({ length: 10 }, (_, i) => {
  const end = new Date(2026, 9, 11 - 7 * i); const start = new Date(2026, 9, 5 - 7 * i);
  return { id: 'hw' + i, date: lbDate(start), played: plays.some((p) => p.src.d >= start && p.src.d < end) };
});
const HgLeft = ({ plays }) => (
  <LbRun n={plays.filter((p) => p.status.kind === 'ok').length} unit="weeks" figure="days played" on="Played" legend="Not played" weeks={lbRunOf(hgWeeks(plays))} />
);
// A new account with the Pass: no day yet.
const HgNone = () => {
  const gs = useGs();
  return (
    <section className="lb-card">
      <div className="gs-stack-xs"><span className="gs-label">YOUR FIRST DAY</span><h2 className="mcp-t-sec">Grey dawn below Chauvet cave</h2></div>
      <p>Start your first day at camp in any chat, and go where you like.</p>
      <div><DS.Button onClick={() => gs.play(GS_NAME.hunter)}>Play</DS.Button></div>
    </section>
  );
};
const HgLibrary = () => {
  const gs = useGs(); const access = lbAccess(gs, 'hunter'); const pass = access === 'all'; const past = lbPast(gs); const k = gs.view + (gs.sub.hadPass ? 'u' : '');
  if (!pass && !past) return (
    <main key={k} className="gs-wrap gs-main"><LbHead id="hunter" /><div className="lb-lay"><window.LbNeedsPass id="hunter" ach={HG_ACH} access={access} /></div></main>
  );
  const plays = phVisible(gs).filter((p) => p.gid === 'hunter'); const latest = plays[0] ? plays[0].src : null;
  const ach = phAch(gs, 'hunter', HG_ACH);
  return (
    <main key={k} className="gs-wrap gs-main">
      <LbHead id="hunter" />
      <div className="lb-lay">
        {!pass && <window.LbNeedsPass id="hunter" had ach={ach} access={access} />}
        {!latest ? <HgNone /> : <HgLatest day={latest} last={!pass} />}
        {pass && <HgLeft plays={plays} />}
        <LbAch items={ach} badges={HG_BADGES} access={access} />
        <LbRecent title="Your days" allLabel="See in History" empty="Your days appear here once you have played one." />
      </div>
    </main>
  );
};
window.GS_LIBRARY.hunter = HgLibrary;
Object.assign(window, { HG_DAYS, hgSid, hgStatus });
