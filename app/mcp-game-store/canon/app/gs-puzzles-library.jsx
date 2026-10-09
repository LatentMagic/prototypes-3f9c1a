// ============================================================================
// [Platform] — Daily Puzzles' library page, option 16 fitted to a daily game (picked by Claude on "decide for me", 2026-10-08).
// Today in place of This week, one row per puzzle. Days in a row. Achievements after game-specs/daily-puzzles.md
// (Solved and Seven days in a row for each puzzle, plus the hard Mystery one). Your puzzles.
// On the free plan, results last today only, so the streak and earlier days point to the Pass.
// Puzzle names follow the app's seed (gs-data.jsx); a play opens the existing session page.
// ============================================================================
const DP_KINDS = [
  { k: 'word', n: 'Word Puzzle', art: 'word', past: 'word-1005', today: 'word-today', ok: (i) => 'Solved in ' + (3 + (i % 4)) + ' of 6' },
  { k: 'escape', n: 'Escape Room', art: 'escape', past: 'escape-today', today: 'escape-today', ok: (i) => 'Escaped in ' + (6 + (i % 5)) + ' moves' },
  { k: 'murder', n: 'Murder Mystery', art: 'murder', past: 'murder-1004', today: 'murder-today', ok: () => 'Case closed' },
];
// Forty days, newest first; today is index 0. A day counts as played if any puzzle was.
const DP_DAYS = Array.from({ length: 40 }, (_, i) => {
  const d = new Date(2026, 9, 8 - i);
  const plays = DP_KINDS.map((p, j) => {
    const played = i === 0 ? j === 0 : (i + j) % 6 !== 5 && i % 9 !== 6;
    const ok = played && (i + 2 * j) % 5 !== 4;
    return { id: 'dp' + i + p.k, kind: p, played, ok, line: ok ? p.ok(i + j) : 'Missed' };
  });
  return { id: 'dpd' + i, date: lbDate(d), month: lbMonth(d), played: plays.some((x) => x.played), plays };
});
const DP_TODAY_LIVE = [
  { kind: DP_KINDS[0], status: { kind: 'ok', label: 'Solved in 3 of 6' } },
  { kind: DP_KINDS[1], status: { kind: 'live', label: 'In progress' } },
  { kind: DP_KINDS[2], status: { kind: 'none', label: 'Not started' } },
];
const DP_TODAY_DONE = [
  { kind: DP_KINDS[0], status: { kind: 'ok', label: 'Solved in 3 of 6' } },
  { kind: DP_KINDS[1], status: { kind: 'ok', label: 'Escaped in 7 moves' } },
  { kind: DP_KINDS[2], status: { kind: 'bad', label: 'Missed' } },
];
const DP_ACH = [
  { k: 'w1', n: 'Word Puzzle solved', how: 'Solve a Word Puzzle.', got: '2 October' },
  { k: 'w7', n: 'Word Puzzle, seven days in a row', how: 'Play Word Puzzle seven days running.', of: 7, have: 5, endedHave: 2 },
  { k: 'e1', n: 'Escape Room solved', how: 'Escape a room.', got: '3 October' },
  { k: 'e7', n: 'Escape Room, seven days in a row', how: 'Play Escape Room seven days running.', of: 7, have: 3, endedHave: 1 },
  { k: 'm1', n: 'Case closed', how: 'Name the culprit in a Murder Mystery.', got: '4 October' },
  { k: 'm0', n: 'Closed with no hints and no questions', how: 'Close a Murder Mystery without a hint or a question.' },
  { k: 'm7', n: 'Murder Mystery, seven days in a row', how: 'Play Murder Mystery seven days running.', of: 7, have: 2, endedHave: 0 },
];
const DP_BADGES = lbAutoBadges(DP_ACH);
const dpGo = (gs, sid) => gs.go('puzzles', sid ? { page: 'record', sid } : { page: 'record' });
const dpStatus = (x) => (!x.played ? { kind: 'none', label: 'Not played' } : x.ok ? { kind: 'ok', label: x.line } : { kind: 'bad', label: 'Missed' });
const dpHist = (mode) => (mode === 'free' ? [] : DP_DAYS.slice(1).flatMap((d) => d.plays.map((x) => ({ ...x, date: d.date, month: d.month }))).filter((x) => x.played || mode === 'pass'));
const dpRow = (gs, x) => ({ key: x.id, title: x.kind.n, date: lbShort(x.date), status: dpStatus(x), onOpen: x.played ? () => gs.go('session', { id: x.kind.past }) : null });

const DpToday = ({ rows }) => {
  const gs = useGs();
  const done = rows.filter((r) => r.status.kind === 'ok' || r.status.kind === 'bad').length;
  return (
    <section className="lb-card">
      <div className="gs-stack-xs"><span className="gs-label">TODAY</span><h2 className="mcp-t-sec">Today’s puzzles</h2></div>
      <p>{done === rows.length ? 'You’ve finished every puzzle today.' : done ? 'You’ve finished ' + (done === 1 ? 'one puzzle' : done + ' puzzles') + ' today. The rest are still open.' : 'You haven’t started today’s puzzles yet.'}</p>
      <DS.ProgressBar label={done + ' finished today'} value={done} max={rows.length} showValue={false} />
      <ul className="lb-list lb-today">{rows.map((r) => (
        <li key={r.kind.k}><LbRow r={{ key: r.kind.k, title: r.kind.n, date: 'Today', status: r.status,
          onOpen: r.status.kind !== 'none' ? () => gs.go('session', { id: r.kind.today }) : null }} /></li>))}</ul>
      <span className="gs-muted">New puzzles arrive tomorrow.</span>
    </section>
  );
};
const DP_FILTERS = [['all', 'All', () => true], ['ok', 'Solved', (x) => x.ok], ['bad', 'Missed', (x) => x.played && !x.ok], ['none', 'Not played', (x) => !x.played]];
const DpLibrary = () => {
  const gs = useGs(); const mode = lbMode(gs); const k = gs.view + (gs.sub.freeUsed ? 'u' : '') + (lbWeekDone(gs) ? 'd' : '');
  if (gs.route.sid === 'all' && mode !== 'free') return (
    <LbAll key={k} back="Daily Puzzles" onBack={() => dpGo(gs)} title="Your puzzles" find="Find a puzzle" hint="A puzzle name or a date"
      filters={DP_FILTERS.filter(([v]) => v !== 'none' || mode === 'pass')} items={dpHist(mode)}
      text={(x) => x.kind.n + ' ' + x.date + ' ' + x.month} row={(x) => dpRow(gs, x)} empty="No puzzle matches that. Try another name or date." />
  );
  return (
    <main key={k} className="gs-wrap gs-main">
      <LbHead id="daily" />
      <div className="lb-lay">
        <DpToday rows={lbWeekDone(gs) ? DP_TODAY_DONE : DP_TODAY_LIVE} />
        <LbRun n={lbStreak(DP_DAYS)} unit="days" weeks={lbRunOf(DP_DAYS)} locked={mode === 'free'} />
        <LbAch items={DP_ACH} badges={DP_BADGES} mode={mode} ended={CB_ENDED} />
        <LbRecent title="Your puzzles" allLabel="All puzzles" onAll={() => dpGo(gs, 'all')} rows={dpHist(mode).slice(0, 4).map((x) => dpRow(gs, x))}
          empty="On the free plan, results last until the end of the day. Earlier days stay with the Pass." />
      </div>
    </main>
  );
};
window.GS_LIBRARY.daily = DpLibrary;
