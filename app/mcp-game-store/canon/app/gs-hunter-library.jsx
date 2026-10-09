// ============================================================================
// [Platform] — 36,000 Summers Ago's library page: option 16's four parts, fitted to a game with no editions.
// Per game-specs/36000-summers-ago.md there is no streak and no sharing, so the run shows the weeks you played
// rather than a streak. The now card is your latest day, with where you left off. Records are invented.
// ============================================================================
const HG_ENDS = ['Home by the fire', 'Slept at the springs', 'Slept in the cave mouth', 'Home with full hands', 'Slept out on the plain'];
const HG_DAYS = Array.from({ length: 18 }, (_, i) => {
  const d = new Date(2026, 9, 5 - 3 * i - (i % 2));
  const restarted = i % 5 === 3;
  return { id: 'hg' + i, date: lbDate(d), month: lbMonth(d), played: true, restarted, title: 'Day ' + (18 - i) };
});
const HG_LATEST = {
  title: 'Home by the fire', date: '5 October',
  facts: [['Slept', 'At the fire, by Aunt'], ['Joined', 'The ibex hunt, and the meeting of the bands'], ['With', 'Aunt and the two hunters'], ['Made', 'A bone needle'], ['Saw', 'Ibex and a cave lion'], ['Weather', 'Hot, then thunder at dusk']],
};
const HG_LEFT = { when: 'Midday', where: 'by the springs' };
const HG_ACH = [
  ['fire', 'Fed the Fire', '14 September'], ['aunt', 'Dug with Aunt', '7 September'], ['dusk', 'One of Us at Dusk', '12 September'], ['hunters', 'Walked with the Hunters', '12 September'],
  ['wall', 'A Line on the Wall'], ['walk', 'The Long Walk'], ['springs', 'Met at the Springs', '2 September'], ['hands', 'Home with Full Hands', '1 September'], ['meat', 'Meat Home Whole'],
].map(([k, n, got]) => ({ k, n, got, how: 'Earn it in a day at camp.' })).concat([
  { k: 'big', n: 'The Big Animals', how: 'See every big animal, over many days.', of: 6, have: 4, endedHave: 3 },
  { k: 'three', n: 'Hunt, Springs and Wall', how: 'Join all three set moments, over many days.', of: 3, have: 2, endedHave: 1 },
  { k: 'made', n: 'Made Something', how: 'Make things in camp, over many days.', of: 5, have: 1, endedHave: 1 },
  { k: 'quarrel', n: 'Eased a Quarrel', how: 'Ease quarrels in the band, over many days.', of: 3, have: 0, endedHave: 0 },
]);
const HG_BADGES = lbAutoBadges(HG_ACH);
const hgGo = (gs, sid) => gs.go('hunter', sid ? { page: 'record', sid } : { page: 'record' });
const hgRow = (gs, x) => ({ key: x.id, title: x.title, date: lbShort(x.date), status: x.restarted ? { kind: 'none', label: 'Restarted' } : { kind: 'ok', label: 'Finished' },
  onOpen: () => gs.go('session', { id: 'hunter' }) });

// Your latest day: where you left off, then three facts from the day. The whole day is one tap away.
const HgLatest = ({ last }) => {
  const gs = useGs();
  const facts = HG_LATEST.facts.filter(([k]) => ['Slept', 'With', 'Made'].includes(k));
  return (
    <section className="lb-card">
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">{(last ? 'YOUR LAST DAY · ' + last.date.toUpperCase() : 'YOUR LATEST DAY · ' + HG_LATEST.date.toUpperCase())}</span><h2 className="mcp-t-sec">{HG_LATEST.title}</h2></div>
        <DS.TextLink onClick={() => gs.go('session', { id: 'hunter' })}>See the whole day</DS.TextLink>
      </div>
      <p>{last ? 'That was the last day you played before your Pass ended.' : 'You left off at ' + HG_LEFT.when.toLowerCase() + ', ' + HG_LEFT.where + '. Carry on in any chat.'}</p>
      <dl className="lb-facts">{facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
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
const HG_OLD = HG_DAYS.filter((x) => lbOld(x.date));
// Without the Pass: the game is closed. A player whose Pass ended keeps their last day, their days and what they earned, locked.
const HgClosed = ({ again }) => {
  const gs = useGs();
  return (
    <section className="lb-card">
      <h2 className="mcp-t-sec">{again ? 'Your Pass has ended' : 'Only with the Pass'}</h2>
      <p>{again ? GS_NAME.hunter + ' comes only with the Pass, so you can’t play it now. Your days and what you earned stay here.' : GS_NAME.hunter + ' comes only with the Pass. A free player can’t play it.'}</p>
      <div><DS.Button onClick={() => gs.go('pass')}>{again ? 'Get the Pass again' : 'Get the Pass'}</DS.Button></div>
      <p className="gs-small">{GS.purchase}</p>
    </section>
  );
};
const HgLibrary = () => {
  const gs = useGs(); const access = lbAccess(gs, 'hunter'); const pass = access === 'all'; const past = lbPast(gs); const k = gs.view + (gs.sub.freeUsed ? 'u' : '');
  if (!pass && !past) return (
    <main key={k} className="gs-wrap gs-main"><LbHead id="hunter" /><div className="lb-lay"><HgClosed /></div></main>
  );
  const days = pass ? HG_DAYS : HG_OLD;
  if (gs.route.sid === 'all') return (
    <LbAll key={k} back={GS_GAMES.hunter.name} onBack={() => hgGo(gs)} title="Your days" find="Find a day" hint="A day number or a date"
      filters={HG_FILTERS} items={days} text={(x) => x.title + ' ' + x.date + ' ' + x.month} row={(x) => hgRow(gs, x)} empty="No day matches that. Try another word or date." />
  );
  return (
    <main key={k} className="gs-wrap gs-main">
      <LbHead id="hunter" />
      <div className="lb-lay">
        {!pass && <HgClosed again />}
        <HgLatest last={pass ? null : HG_OLD[0]} />
        {pass && <HgLeft />}
        <LbAch items={HG_ACH} badges={HG_BADGES} access={access} ended={CB_ENDED} />
        <LbRecent title="Your days" allLabel="All days" onAll={() => hgGo(gs, 'all')} rows={days.slice(0, 8).map((x) => hgRow(gs, x))} />
      </div>
    </main>
  );
};
window.GS_LIBRARY.hunter = HgLibrary;
