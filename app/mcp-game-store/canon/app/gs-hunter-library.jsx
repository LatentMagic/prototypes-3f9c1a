// ============================================================================
// [Platform] — 36,000 Summers Ago's library page: option 16's four parts, fitted to a game with no editions.
// Per game-specs/36000-summers-ago.md there is no streak and no sharing, so the run shows the weeks you played
// rather than a streak. The now card is your latest day, with where you left off. Records are invented.
// ============================================================================
const HG_ENDS = ['Home by the fire', 'Slept at the springs', 'Slept in the cave mouth', 'Home with full hands', 'Slept out on the plain'];
// Each day keeps how it ended and what happened in it. Day 18 (5 October) is the latest.
const HG_POOL = {
  Slept: ['At the fire, by Aunt', 'At the springs', 'In the cave mouth', 'At the fire, with the band', 'Out on the plain'],
  Joined: ['The ibex hunt, and the meeting of the bands', 'The walk to the springs', 'Digging roots with Aunt', 'The reindeer watch', 'Painting at the wall'],
  With: ['Aunt and the two hunters', 'The gatherers', 'Aunt', 'The whole band', 'The old storyteller'],
  Made: ['A bone needle', 'A flint scraper', 'A carrying bag', 'Nothing', 'A shell bead'],
  Saw: ['Ibex and a cave lion', 'Horses at the river', 'A herd of reindeer', 'A woolly rhino, far off', 'Cave bears asleep'],
  Weather: ['Hot, then thunder at dusk', 'Cold wind all day', 'Clear and dry', 'Rain until midday', 'Mist over the river'],
};
const HG_DAYS = Array.from({ length: 18 }, (_, i) => {
  const d = new Date(2026, 9, 5 - 3 * i - (i % 2));
  const restarted = i % 5 === 3;
  return { id: 'hg' + i, d, date: lbDate(d), month: lbMonth(d), played: true, restarted, title: 'Day ' + (18 - i), end: restarted ? null : HG_ENDS[i % 5],
    facts: Object.entries(HG_POOL).map(([k, v], n) => [k, v[(i * (n + 2)) % v.length]]) };
});
const HG_LATEST = HG_DAYS[0];
const hgSid = (x) => 'hunter-' + x.id;
const hgStatus = (x) => (x.restarted ? { kind: 'none', label: 'Restarted' } : { kind: 'ok', label: 'Finished' });
// A session page for every day: the result matches its row; the record is what happened in the day. No sharing (game spec).
HG_DAYS.forEach((x) => {
  GS_SESSIONS[hgSid(x)] = { kind: 'day', gid: 'hunter', game: GS_NAME.hunter, art: 'hunter', result: hgStatus(x).label, date: x.d.toLocaleString('en-GB', { weekday: 'long' }) + ' ' + x.date,
    figures: x.end ? [x.title, x.end] : [x.title], listTitle: 'The day', share: null, lines: x.facts };
});
GS_SESSIONS.hunter = GS_SESSIONS[hgSid(HG_LATEST)];
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
const hgRow = (gs, x) => ({ key: x.id, title: x.title, date: lbShort(x.date), status: hgStatus(x),
  onOpen: () => gs.go('session', { id: hgSid(x) }) });

// Your latest day: where you left off, then three facts from the day. The whole day is one tap away.
const HgLatest = ({ last }) => {
  const gs = useGs(); const day = last || HG_LATEST;
  const facts = day.facts.filter(([k]) => ['Slept', 'With', 'Made'].includes(k));
  return (
    <section className="lb-card">
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">{(last ? 'YOUR LAST DAY · ' : 'YOUR LATEST DAY · ') + day.date.toUpperCase()}</span><h2 className="mcp-t-sec">{day.end || day.title}</h2></div>
        <DS.TextLink onClick={() => gs.go('session', { id: hgSid(day) })}>See the whole day</DS.TextLink>
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
  return (
    <main key={k} className="gs-wrap gs-main">
      <LbHead id="hunter" />
      <div className="lb-lay">
        {!pass && <HgClosed again />}
        <HgLatest last={pass ? null : HG_OLD[0]} />
        {pass && <HgLeft />}
        <LbAch items={HG_ACH} badges={HG_BADGES} access={access} ended={CB_ENDED} />
        <LbRecent title="Your days" allLabel="All days" rows={days.slice(0, 8).map((x) => hgRow(gs, x))} />
      </div>
    </main>
  );
};
window.GS_LIBRARY.hunter = HgLibrary;
Object.assign(window, { HG_DAYS, hgSid, hgStatus });
