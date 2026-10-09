// ============================================================================
// [Platform] — Delve's library page, option 16 fitted to Delve (picked by Claude on "decide for me", 2026-10-08).
// This week's scene: the ending beside the title, the rescue as the bar. Weeks in a row. The spec's four
// achievements (game-specs/delve.md). Your scenes. A scene opens the existing session page.
// Scene titles, heroes and records are invented.
// ============================================================================
const DV_TITLES = ['Beneath Gallows Hill', 'The Drum Room', 'The Fungus Path', 'The Escape Tunnel', 'The Drifting Freighter', 'The Cold Hold', 'The Shrine Cavern', 'The Miller’s Cellar'];
const DV_HEROES = ['Vex the Rogue', 'Bryn the Fighter', 'Oda the Wizard'];
const DV_END = { won: { kind: 'ok', label: 'Elsie rescued' }, ritual: { kind: 'bad', label: 'The ritual finished' }, fell: { kind: 'bad', label: 'Your hero fell' } };
const DV_ALL = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 9, 5 - 7 * i);
  const played = i < 3 || i % 4 !== 3;
  return { id: 'dv' + i, date: lbDate(d), month: lbMonth(d), title: DV_TITLES[i % 8], hero: DV_HEROES[i % 3], played,
    end: i === 0 || !played ? null : ['won', 'ritual', 'won', 'fell', 'won', 'ritual'][i % 6], rolls: 6 + ((i * 3) % 9) };
});
const DV_LIVE = { ...DV_ALL[0], rolls: 9, rescue: 4, ritual: 3 };
const DV_DONE = { ...DV_LIVE, end: 'won', rolls: 11, rescue: 6, ritual: 4, dice: '🟩🟨🟥🟩🟩🟨🟩✨🟩🟥🟩' };
const DV_NEXT = 'Monday 12 October';
const DV_ACH = [
  { k: 'shrine', n: 'Reached the shrine cavern', how: 'Find your way to the shrine cavern.', got: '21 September' },
  { k: 'rescued', n: 'Elsie rescued', how: 'Get Elsie out of the warren.', got: '28 September' },
  { k: 'clean', n: 'Rescued without a miss', how: 'Rescue Elsie without failing a roll.' },
  { k: 'heroes', n: 'Won with all three heroes', how: 'Rescue Elsie as the fighter, the rogue and the wizard.', of: 3, have: 1, endedHave: 1 },
];
const DV_BADGES = lbAutoBadges(DV_ACH);
const dvStatus = (s) => (!s.played ? { kind: 'none', label: 'Not played' } : !s.end ? { kind: 'live', label: 'In progress' } : DV_END[s.end]);
const dvGo = (gs, sid) => gs.go('delve', sid ? { page: 'record', sid } : { page: 'record' });
const dvHist = (mode) => DV_ALL.slice(1).filter((s) => s.played || mode === 'pass');
const dvRow = (gs, s, figs) => ({ key: s.id, title: s.title, date: lbShort(s.date), status: dvStatus(s),
  figs: figs ? [s.played ? [s.rolls, 'rolls'] : [null], [null]] : null, onOpen: s.played ? () => gs.go('session', { id: 'delve' }) : null });

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
          <DS.TextLink onClick={() => gs.go('session', { id: 'delve' })}>{s.end ? 'See every roll' : 'See your rolls so far'}</DS.TextLink>
        </div>
        <span className="gs-muted">{'The next scene arrives on ' + DV_NEXT + '.'}</span>
      </div>
    </section>
  );
};
const DV_FILTERS = [['all', 'All', () => true], ['won', 'Rescued', (s) => s.end === 'won'], ['lost', 'Lost', (s) => s.played && s.end && s.end !== 'won'], ['none', 'Not played', (s) => !s.played]];
const DvLibrary = () => {
  const gs = useGs(); const mode = lbMode(gs); const k = gs.view + (gs.sub.freeUsed ? 'u' : '') + (lbWeekDone(gs) ? 'd' : '');
  if (gs.route.sid === 'all') return (
    <LbAll key={k} back="Delve" onBack={() => dvGo(gs)} title="Your scenes" find="Find a scene" hint="A scene name or a month"
      filters={DV_FILTERS.filter(([v]) => v !== 'none' || mode === 'pass')} items={dvHist(mode)}
      text={(s) => s.title + ' ' + s.date + ' ' + s.month + ' ' + s.hero} row={(s) => dvRow(gs, s, true)} empty="No scene matches that. Try another name or month." />
  );
  return (
    <main key={k} className="gs-wrap gs-main">
      <LbHead id="delve" />
      <div className="lb-lay">
        <DvNow s={lbWeekDone(gs) ? DV_DONE : DV_LIVE} />
        <LbRun n={lbStreak(DV_ALL)} unit="weeks" weeks={lbRunOf(DV_ALL)} />
        <LbAch items={DV_ACH} badges={DV_BADGES} mode={mode} ended={CB_ENDED} />
        <LbRecent title="Your scenes" allLabel="All scenes" onAll={() => dvGo(gs, 'all')} rows={dvHist(mode).slice(0, 4).map((s) => dvRow(gs, s))} />
      </div>
    </main>
  );
};
window.GS_LIBRARY.delve = DvLibrary;
