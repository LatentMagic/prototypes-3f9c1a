// ============================================================================
// [Platform] — Delve's library page, option 16 fitted to Delve (picked by Claude on "decide for me", 2026-10-08).
// This week's scene: the ending beside the title, the rescue as the bar. Weeks in a row. The spec's four
// achievements (game-specs/delve.md). Your scenes. Every played scene has its own session page (delve-<id>).
// Without the Pass: the first scene and your scenes on the left, achievements on the right.
// Scene titles, heroes and records are invented.
// ============================================================================
const DV_TITLES = ['Beneath Gallows Hill', 'The Drum Room', 'The Fungus Path', 'The Escape Tunnel', 'The Drifting Freighter', 'The Cold Hold', 'The Shrine Cavern', 'The Miller’s Cellar'];
const DV_HEROES = ['Vex the Rogue', 'Bryn the Fighter', 'Oda the Wizard'];
const DV_END = { won: { kind: 'ok', label: 'Rescued', short: 'Rescued' }, ritual: { kind: 'bad', label: 'Ritual done', short: 'Ritual done' }, fell: { kind: 'bad', label: 'Hero fell', short: 'Hero fell' } };
const DV_ALL = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 9, 5 - 7 * i);
  const played = i < 3 || i % 4 !== 3;
  return { id: 'dv' + i, d, date: lbDate(d), month: lbMonth(d), title: DV_TITLES[i % 8], hero: DV_HEROES[i % 3], played,
    end: i === 0 || !played ? null : ['won', 'ritual', 'won', 'fell', 'won', 'ritual'][i % 6], rolls: 6 + ((i * 3) % 9) };
});
const DV_LIVE = { ...DV_ALL[0], rolls: 9, rescue: 4, ritual: 3 };
const DV_DONE = { ...DV_LIVE, end: 'won', rolls: 11, rescue: 6, ritual: 5, dice: '🟩🟨🟥🟩🟩🟨🟩✨🟩🟥🟩' };
const DV_NEXT = 'Monday 12 October';
const DV_ACH = [
  { k: 'shrine', n: 'Reached the shrine cavern', how: 'Find your way to the shrine cavern.', got: '14 September', gotFree: '18 March', first: true },
  { k: 'rescued', n: 'Elsie rescued', how: 'Get Elsie out of the warren.', got: '7 September', first: true },
  { k: 'clean', n: 'Rescued without a miss', how: 'Rescue Elsie without failing a roll.', first: true },
  { k: 'heroes', n: 'Won with all three heroes', how: 'Rescue Elsie as the fighter, the rogue and the wizard.', of: 3, have: 1, endedHave: 1 },
  // Invented beyond the spec's four, so the card carries about ten (review-2-notes.md).
  { k: 'tunnel', n: 'Found the escape tunnel', how: 'Find the tunnel out of the warren.', got: '31 August' },
  { k: 'hold', n: 'Reached the freighter’s hold', how: 'Find your way into the drifting freighter’s hold.' },
  { k: 'potion', n: 'Rescued without the potion', how: 'Rescue Elsie and leave the potion full.', got: '7 September', first: true },
  { k: 'spare', n: 'Rescued with time to spare', how: 'Rescue Elsie before the ritual passes 2 of 6.', first: true },
  { k: 'double', n: 'Saved by the double roll', how: 'Win a scene on your double roll.', first: true },
  { k: 'weeks', n: 'Four weeks in the warren', how: 'Play a scene four weeks in a row.', of: 4, have: 3, endedHave: 3 },
];
const DV_BADGES = lbAutoBadges(DV_ACH);
const dvStatus = (s) => (!s.played ? { kind: 'none', label: 'Not played' } : !s.end ? { kind: 'live', label: 'In progress' } : DV_END[s.end]);
const dvGo = (gs, sid) => gs.go('delve', sid ? { page: 'record', sid } : { page: 'record' });
const DV_FIRST = DV_ALL[DV_ALL.length - 1];
// A free player has the first scene; a player whose Pass ended has everything they played before it ended; the Pass has all.
const dvHist = (gs) => DV_ALL.slice(1).filter((s) => (gs.view === 'pass' ? true : gsLapsed(gs) ? s.played && lbOld(s.date) : s === DV_FIRST));
// A session page for every finished scene; this week's are 'delve' (finished) and 'delve-live' (gs-data.jsx).
const dvSid = (s) => (s === DV_FIRST ? 'delve-first' : 'delve-' + s.id);
DV_ALL.forEach((s, i) => {
  if (!s.played || !s.end) return;
  const e = DV_END[s.end]; const won = s.end === 'won'; const threat = won ? 3 + (i % 3) : s.end === 'ritual' ? 6 : 3 + (i % 3);
  const hp = s.end === 'fell' ? 0 : 3 + (i % 8);
  GS_SESSIONS[dvSid(s)] = { ...GS_SESSIONS.delve, result: e.label, loss: !won, date: s.d.toLocaleString('en-GB', { weekday: 'long' }) + ' ' + s.date, lapsedDate: undefined,
    figures: ['Threat ' + threat + '/6', s.rolls + ' rolls', 'HP ' + hp + '/12'], tracks: { progress: won ? 6 : 2 + (i % 3), threat },
    lines: Array.from({ length: s.rolls }, (_, k) => GS_ROLLS[(k + i) % GS_ROLLS.length]),
    reached: won ? (threat > 4 ? 'Close call' : 'Clean rescue') : 'Caught', share: e.label + ' · threat ' + threat + '/6 · ' + s.rolls + ' rolls' };
});
const dvRow = (gs, s) => ({ key: s.id, title: '#' + (DV_ALL.length - DV_ALL.indexOf(s)), date: lbShort(s.date), status: dvStatus(s), onOpen: s.played ? () => gs.go('session', { id: dvSid(s) }) : null });

const DvNow = ({ s }) => {
  const gs = useGs();
  const lines = s.end && ['Delve · ' + s.hero + ' · ✅ Elsie rescued · ' + s.rolls + ' rolls', s.dice, 'https://platform.example/delve'];
  return (
    <section className="lb-card">
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">THIS WEEK</span><h2 className="mcp-t-sec">{s.title}</h2></div>
        {s.end && <span className="lb-big"><LbResult s={dvStatus(s)} /></span>}
      </div>
      <p>{s.end
        ? 'You played ' + s.hero + ' and got Elsie out in ' + s.rolls + ' rolls, with the ritual ' + s.ritual + ' of 6 along.'
        : 'You’re playing ' + s.hero + '. The rescue is ' + s.rescue + ' of 6 along and the ritual is ' + s.ritual + ' of 6.'}</p>
      <DS.ProgressBar label={'Rescue ' + s.rescue + ' of 6'} value={s.rescue} max={6} showValue={false} />
      <div className="lb-foot">
        <div className="lb-acts">
          {lines && <LbShare lines={lines} note="It hides the story and the places." />}
          <DS.TextLink onClick={() => gs.go('session', { id: s.end ? 'delve' : 'delve-live' })}>{s.end ? 'See every roll' : 'See your rolls so far'}</DS.TextLink>
        </div>
        <span className="gs-muted">{'Next scene: ' + DV_NEXT}</span>
      </div>
    </section>
  );
};
const DvFirst = () => {
  const gs = useGs(); const s = DV_FIRST; const again = gsLapsed(gs);
  return (
    <section className="lb-card">
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">THE FIRST SCENE · FREE</span><h2 className="mcp-t-sec">{s.title}</h2></div>
        {s.played && <span className="lb-big"><LbResult s={dvStatus(s)} /></span>}
      </div>
      <p>{s.played ? 'You played ' + s.hero + ' and the ritual finished before Elsie was out, in ' + s.rolls + ' rolls.' : 'The game’s very first scene, the same for everyone. Play it free.'}</p>
      <div className="lb-foot">
        <div className="lb-acts">
          {s.played ? <DS.TextLink onClick={() => gs.go('session', { id: 'delve-first' })}>See every roll</DS.TextLink> : <DS.Button onClick={() => gs.play('Delve', 'delve')}>Play in your AI</DS.Button>}
        </div>
        <span className="gs-muted">Every other scene comes with the Pass.</span>
      </div>
      <div><DS.Button variant="secondary" onClick={() => gs.go('pass')}>{again ? 'Get the Pass again' : 'Get the Pass'}</DS.Button></div>
    </section>
  );
};
const dvPassRow = (gs) => ({ key: 'with-pass', title: 'Every other scene', date: '', status: { kind: 'none', label: 'With the Pass' }, onOpen: () => gs.go('pass') });
const DvLibrary = () => {
  const gs = useGs(); const access = lbAccess(gs, 'delve'); const pass = access === 'all'; const k = gs.view + (gs.sub.freeUsed ? 'u' : '') + (lbWeekDone(gs) ? 'd' : '');
  const rows = dvHist(gs).slice(0, pass ? 8 : 7).map((s) => dvRow(gs, s)).concat(pass ? [] : [dvPassRow(gs)]);
  return (
    <main key={k} className="gs-wrap gs-main">
      <LbHead id="delve" />
      <div className={'lb-lay' + (pass ? '' : ' is-three')}>
        {pass ? <DvNow s={lbWeekDone(gs) ? DV_DONE : DV_LIVE} /> : <DvFirst />}
        {pass && <LbRun n={lbStreak(DV_ALL)} unit="weeks" weeks={lbRunOf(DV_ALL)} />}
        <LbAch items={DV_ACH} badges={DV_BADGES} access={access} ended={CB_ENDED} />
        <LbRecent title="Your scenes" allLabel="All scenes" rows={rows} />
      </div>
    </main>
  );
};
window.GS_LIBRARY.delve = DvLibrary;
Object.assign(window, { DV_ALL, DV_END, DV_LIVE, DV_DONE, dvStatus, dvSid });
