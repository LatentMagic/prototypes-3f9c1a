// ============================================================================
// Playground (1236): Escape's earlier rooms, sample only. The store's seed has one room; this gives Escape nine earlier weekly
// rooms so the streak card, Your rooms and History all read the same history. Loads straight after app/gs-puzzles-library.jsx
// and before app/gs-history.jsx, which builds History (and so the streak and Your rooms) from PZ.escape.all.
// Played pattern, newest first after this week: five played, one missed, one played, one missed, one played. Streak 6 with this
// week played, 5 while it is in progress. Escape has no losing outcome, so every play is escaped.
// ============================================================================
(() => {
  const c = PZ.escape;
  const PAST = [
    // [room, played, minutes, par word, wrong tries, hints]
    ['The Botanist’s Glasshouse', true, 24, 'under par', 1, 0],
    ['The Signal Box', true, 33, 'over par', 3, 2],
    ['The Bell Foundry', true, 27, 'under par', 0, 1],
    ['The Map Room', true, 22, 'under par', 2, 0],
    ['The Printer’s Shop', true, 30, 'under par', 1, 1],
    ['The Ice House', false],
    ['The Observatory', true, 36, 'over par', 4, 2],
    ['The Toy Maker’s Attic', false],
    ['The Night Ferry', true, 26, 'under par', 1, 0],
  ];
  c.rooms = [c.rooms[0], ...PAST.map((p) => p[0])];
  c.count = c.rooms.length;
  const cur = c.all[0];
  const fig = (n, one, many, none) => (n ? n + ' ' + (n === 1 ? one : many) : none);
  c.all = [cur, ...PAST.map((p, k) => {
    const i = k + 1; const d = new Date(2026, 9, 5 - 7 * i); const [title, played, min, par, wrong, hints] = p;
    const line = played ? GS_RESULT.escape({ min, par }) : c.bad;
    const x = { id: 'escape' + i, i, d, date: lbDate(d), month: lbMonth(d), title, played, ok: played, done: played, line };
    if (played) {
      const sid = 'escape-e' + i; const lines = [['Move 1', 'Examine the room', 'Two locks stand between you and the way out.']];
      let n = 1; for (let w = 0; w < wrong; w += 1) lines.push(['Move ' + (++n), 'Try an answer (4 letters) on the iron box', 'Wrong']);
      for (let h = 0; h < hints; h += 1) lines.push(['Hint', 'The iron box', 'Sample hint.']);
      lines.push(['Move ' + (++n), 'Try an answer (4 letters) on the iron box', 'The lid lifts.']);
      lines.push(['Move ' + (++n), 'Try an answer (4 letters) on the door lock', 'Out']);
      GS_SESSIONS[sid] = { kind: 'puzzle', gid: 'escape', game: 'Escape', art: 'escape', date: pzLong(d), result: line, share: line,
        figures: [min + ' min, ' + par, fig(hints, 'hint', 'hints', 'No hints'), fig(wrong, 'wrong try', 'wrong tries', 'No wrong tries')],
        shareLines: ['Escape · ' + title + ' · escaped in ' + min + ' min, ' + par], listTitle: 'Every move', lines,
        pgeTimes: { min, opened: [Math.round(min * 0.55), min] } };
      x.sid = sid;
    }
    return x;
  })];
})();
