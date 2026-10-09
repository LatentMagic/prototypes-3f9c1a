// ============================================================================
// [Platform] — 36,000 Summers Ago's library page: option 16's four parts, fitted to a game with no editions.
// Per game-specs/36000-summers-ago.md there is no streak and no sharing, so the run shows the weeks you played
// rather than a streak. The now card is your latest day, with where you left off. Records are invented.
// ============================================================================
const HG_ENDS = ['Home by the fire', 'Slept at the springs', 'Slept in the cave mouth', 'Home with full hands', 'Slept out on the plain'];
const HG_DAYS = Array.from({ length: 18 }, (_, i) => {
  const d = new Date(2026, 9, 5 - 3 * i - (i % 2));
  const restarted = i % 5 === 3;
  return { id: 'hg' + i, date: lbDate(d), month: lbMonth(d), played: true, restarted, title: restarted ? 'Restarted at midday' : HG_ENDS[i % 5] };
});
const HG_LATEST = {
  title: 'Home by the fire', date: '5 October',
  facts: [['Slept', 'At the fire, by Aunt'], ['Joined', 'The ibex hunt, and the meeting of the bands'], ['With', 'Aunt and the two hunters'], ['Made', 'A bone needle'], ['Saw', 'Ibex and a cave lion'], ['Weather', 'Hot, then thunder at dusk']],
};
const HG_LEFT = { when: 'Midday', where: 'by the springs' };
const HG_ACH = [
  ['fire', 'Fed the Fire', '5 October'], ['aunt', 'Dug with Aunt', '28 September'], ['dusk', 'One of Us at Dusk', '5 October'], ['hunters', 'Walked with the Hunters', '5 October'],
  ['wall', 'A Line on the Wall'], ['walk', 'The Long Walk'], ['springs', 'Met at the Springs', '2 October'], ['hands', 'Home with Full Hands', '21 September'], ['meat', 'Meat Home Whole'],
].map(([k, n, got]) => ({ k, n, got, how: 'Earn it in a day at camp.' })).concat([
  { k: 'big', n: 'The Big Animals', how: 'See every big animal, over many days.', of: 6, have: 4, endedHave: 3 },
  { k: 'three', n: 'Hunt, Springs and Wall', how: 'Join all three set moments, over many days.', of: 3, have: 2, endedHave: 1 },
  { k: 'made', n: 'Made Something', how: 'Make things in camp, over many days.', of: 5, have: 1, endedHave: 1 },
  { k: 'quarrel', n: 'Eased a Quarrel', how: 'Ease quarrels in the band, over many days.', of: 3, have: 0, endedHave: 0 },
]);
const HG_BADGES = lbAutoBadges(HG_ACH);
const hgGo = (gs, sid) => gs.go('hunter', sid ? { page: 'record', sid } : { page: 'record' });
const hgRow = (gs, x) => ({ key: x.id, title: x.title, date: lbShort(x.date), status: x.restarted ? { kind: 'none', label: 'Restarted' } : { kind: 'live', label: 'Day finished' },
  onOpen: () => gs.go('session', { id: 'hunter' }) });

const HgLatest = () => {
  const gs = useGs();
  return (
    <section className="lb-card">
      <div className="gs-stack-xs"><span className="gs-label">YOUR LATEST DAY</span><h2 className="mcp-t-sec">{HG_LATEST.title}</h2></div>
      <dl className="gs-rows-dl">{HG_LATEST.facts.map(([k, v]) => <div key={k} className="gs-row-kv"><dt className="gs-muted">{k}</dt><dd>{v}</dd></div>)}</dl>
      <p>{'You left off at ' + HG_LEFT.when.toLowerCase() + ', ' + HG_LEFT.where + '. Carry on in any chat.'}</p>
      <div className="lb-foot"><DS.TextLink onClick={() => gs.go('session', { id: 'hunter' })}>See the whole day</DS.TextLink><span className="gs-muted">{HG_LATEST.date}</span></div>
    </section>
  );
};
// The last ten weeks, oldest first: did you play a day in each?
const hgWeeks = () => Array.from({ length: 10 }, (_, i) => {
  const end = new Date(2026, 9, 11 - 7 * i); const start = new Date(2026, 9, 5 - 7 * i);
  const played = HG_DAYS.some((x) => { const d = new Date(x.date + (x.date.match(/\d{4}$/) ? '' : ' 2026')); return d >= start && d < end; });
  return { id: 'hw' + i, date: lbDate(start), played };
});
const HgLeft = () => (
  <LbRun n={HG_DAYS.filter((x) => !x.restarted).length} unit="weeks" figure="days played" legend="Not played" weeks={lbRunOf(hgWeeks())} />
);
const HG_FILTERS = [['all', 'All', () => true], ['done', 'Finished', (x) => !x.restarted], ['restarted', 'Restarted', (x) => x.restarted]];
const HgLibrary = () => {
  const gs = useGs(); const mode = lbMode(gs); const k = gs.view + (gs.sub.freeUsed ? 'u' : '');
  if (gs.route.sid === 'all') return (
    <LbAll key={k} back={GS_GAMES.hunter.name} onBack={() => hgGo(gs)} title="Your days" find="Find a day" hint="How it ended, or a date"
      filters={HG_FILTERS} items={HG_DAYS} text={(x) => x.title + ' ' + x.date + ' ' + x.month} row={(x) => hgRow(gs, x)} empty="No day matches that. Try another word or date." />
  );
  return (
    <main key={k} className="gs-wrap gs-main">
      <LbHead id="hunter" />
      <div className="lb-lay">
        <HgLatest />
        <HgLeft />
        <LbAch items={HG_ACH} badges={HG_BADGES} mode={mode} ended={CB_ENDED} />
        <LbRecent title="Your days" allLabel="All days" onAll={() => hgGo(gs, 'all')} rows={HG_DAYS.slice(0, 4).map((x) => hgRow(gs, x))} />
      </div>
    </main>
  );
};
window.GS_LIBRARY.hunter = HgLibrary;
