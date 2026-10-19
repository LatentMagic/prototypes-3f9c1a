// ============================================================================
// [Platform] — the library game pages of Daily Word, Daily Groups, Daily Mystery and Escape.
// Word, Groups and Mystery's pages are replaced by gs-pass-library.jsx in every view (cprPzLibrary), Escape's for a player without
// the Pass (CprEsLibrary), and PzNow there too (CprPzNow).
// Each is the standard library game page, built like Delve's: the now card (today's, or this
// week's for Escape), the run, achievements and your plays. "All…" opens History filtered to the game.
// Each game has its own streak. Achievements per game from game-specs/daily-puzzles.md; Escape's are proposed.
// Free: Daily Word and Daily Mystery's current edition, with a streak and the achievements; earlier editions stay in results and playing them comes with the Pass.
// Records are invented; a play opens the existing session page.
// ============================================================================
const pzMis = gsMis;
const PZ = {
  word: {
    no: (i) => 'Daily Word #' + (212 - i), salt: 0, keep: { 1: true }, past: 'word-1005', today: 'word-today', liveSid: 'word-live',
    ok: (i) => GS_RESULT.word({ ok: true, guesses: 3 + (i % 4) }), bad: GS_RESULT.word({ ok: false }),
    title: 'Today’s word', next: 'Next word: tomorrow', links: ['See every guess', 'See your guesses so far'],
    live: { line: 'You’ve used 2 of your 6 guesses. One letter is in place and two more are in the word.', bar: ['Guess 2 of 6', 2, 6] },
    done: { st: { kind: 'ok', label: GS_RESULT.word({ ok: true, guesses: 3 }) }, line: 'You found the word on your third guess, with one hint.', bar: ['Guess 3 of 6', 3, 6] }, plays: ['Your words', 'All words'],
    ach: [{ k: 'w1', n: 'Solved', how: 'Solve a Daily Word.', by: (p) => p.status.kind === 'ok' },
      { k: 'w2', n: 'Solved in two', how: 'Solve a Daily Word in two guesses.', by: (p) => p.status.label === GS_RESULT.word({ ok: true, guesses: 2 }) },
      { k: 'w7', n: 'Seven days in a row', how: 'Solve Daily Word seven days running.', of: 7 }],
  },
  groups: {
    no: (i) => 'Daily Groups #' + (88 - i), salt: 1, keep: { 1: true }, past: 'groups-1005', today: 'groups-today', liveSid: 'groups-live',
    ok: (i) => GS_RESULT.groups({ found: 4, mistakes: i === 1 ? 0 : i % 4 }), bad: GS_RESULT.groups({ found: 2 }),
    title: 'Today’s groups', next: 'Next groups: tomorrow', links: ['See every try', 'See your tries so far'],
    live: { line: 'You’ve found 2 of the 4 groups, with 1 mistake so far.', bar: ['2 of 4 groups', 2, 4] },
    done: { st: { kind: 'ok', label: GS_RESULT.groups({ found: 4, mistakes: 1 }) }, line: 'You found all four groups with one mistake, and no hints.', bar: ['4 of 4 groups', 4, 4] }, plays: ['Your groups', 'All groups'],
    ach: [{ k: 'g1', n: 'Solved', how: 'Find all four groups in a Daily Groups.', by: (p) => p.status.kind === 'ok' },
      { k: 'g0', n: 'Solved with no mistakes', how: 'Find all four groups without a mistake.', by: (p) => p.status.label === GS_RESULT.groups({ found: 4, mistakes: 0 }) },
      { k: 'g7', n: 'Seven days in a row', how: 'Play Daily Groups seven days running.', of: 7 }],
  },
  mystery: {
    no: (i) => 'Daily Mystery #' + (64 - i), salt: 2, keep: { 2: true }, past: 'mystery-1004', today: 'mystery-today', liveSid: 'mystery-live',
    ok: () => GS_RESULT.mystery({ ok: true }), bad: GS_RESULT.mystery({ ok: false }),
    title: 'Today’s case', next: 'Next case: tomorrow', links: ['See every question', 'See your questions so far'],
    live: { line: 'You’ve asked the inspector two questions. You haven’t accused anyone yet.' },
    done: { st: { kind: 'bad', label: GS_RESULT.mystery({ ok: false }) }, line: 'You accused after two questions, and the weapon was wrong.' }, plays: ['Your cases', 'All cases'],
    ach: [{ k: 'm1', n: 'Case closed', how: 'Solve a Daily Mystery case.', by: (p) => p.status.kind === 'ok' },
      { k: 'm0', n: 'Closed with no hints and no questions', how: 'Close a Daily Mystery without a hint or a question.', by: (p) => { const s = GS_SESSIONS[p.sid]; return p.status.kind === 'ok' && !!s && s.q === 0 && !s.hints; } },
      { k: 'm7', n: 'Seven days in a row', how: 'Solve a case seven days running.', of: 7 }],
  },
  // Escape: one room so far, No. 1 The Clockmaker’s Study. Its finished play is escape-week.
  escape: {
    weekly: true, count: 1, rooms: ['The Clockmaker’s Study'],
    no: (i) => PZ.escape.rooms[i] || PZ.escape.rooms[0], salt: 3, keep: {}, past: 'escape-week', today: 'escape-week', liveSid: 'escape-live',
    ok: () => GS_RESULT.escape({ min: 28, par: 'under par' }), bad: GS_RESULT.escape({ min: 28, par: 'under par' }),
    title: 'The Clockmaker’s Study', next: 'Next room: Monday 12 October', links: ['See every move', 'See your moves so far'],
    live: { line: 'You’ve made three moves.' },
    done: { st: { kind: 'ok', label: GS_RESULT.escape({ min: 28, par: 'under par' }) }, line: 'You got out in 13 moves, with one hint.' }, plays: ['Your rooms', 'All rooms'],
    // The game's five achievements (verbatim). This room's finished play (1 hint, 2 wrong tries, under par) meets Beat the Clock only.
    ach: [{ k: 'e1', n: 'Clean Getaway', how: 'Escape without a hint or a wrong try.', by: (p) => { const s = GS_SESSIONS[p.sid]; return !!s && (s.figures || []).includes('No hints') && (s.figures || []).includes('No wrong tries'); } },
      { k: 'e2', n: 'Beat the Clock', how: 'Escape under par.', by: (p) => /under par/.test(p.status.label) },
      { k: 'e3', n: 'Not So Fast', how: 'Discover there’s more than one door to get through.' },
      { k: 'e4', n: 'Regular', how: 'Escape four weeks in a row.', of: 4, count: (ps) => ps.filter((p) => p.status.kind === 'ok') },
      { k: 'e5', n: 'Ten Rooms', how: 'Escape ten rooms.', of: 10, count: (ps) => ps.filter((p) => p.status.kind === 'ok') }],
  },
  // Where, Chain and Salvage (app/gs-where-chain-salvage.jsx).
  ...DP_PZ,
};
// ---- Generated session pages for earlier editions (seed only) ----
const PZ_WORDS = ['TORCH', 'SHIRE', 'GLOVE', 'PLANK', 'CRISP', 'BLOOM', 'FROST', 'NERVE', 'QUILT', 'SPOKE', 'CHALK', 'DRIFT'];
const PZ_OPEN = ['SLATE', 'CRANE', 'AUDIO', 'ROUTE', 'MOIST', 'PRISM'];
const PZ_GROUPS = [['🟦', 'colours: TEAL · RUBY · JADE · AMBER'], ['🟨', 'birds: WREN · KITE · ROOK · TERN'], ['🟩', 'card games: SNAP · BRAG · RUMMY · WHIST'], ['🟪', 'things with keys: PIANO · MAP · LOCK · CODE']];
// Earlier Daily Mystery days, in the real grammar: SAMPLES, not real cases. At most two questions; a wrong accusation gets one part wrong.
const PZ_SUS = ['Ivy Marchbank', 'Colonel Rufus Hale', 'Delphine Rooke', 'Arthur Penhallow', 'Mr Graves', 'Sebastian Wyle', 'Dr Helena Strand', 'Nell Okafor'];
const PZ_WPN = ['brass candlestick', 'vial of foxglove', 'antique pistol', 'iron poker', 'curtain cord', 'paper knife', 'marble bust', 'hatpin'];
const PZ_RMS = ['library', 'conservatory', 'butler’s pantry', 'billiard room', 'wine cellar', 'dining room', 'morning room', 'study'];
const pzQn = (q) => (q === 0 ? 'No questions' : q === 1 ? '1 question' : q + ' questions');
const pzAcc = (s, w, r) => s + ', with the ' + w + ', in the ' + r;
const PZ_MOVES = [];
const pzLong = (d) => d.toLocaleString('en-GB', { weekday: 'long' }) + ' ' + lbDate(d);
const pzSession = (id, c, x) => {
  const i = x.i; const sid = id + '-e' + i; const base = { kind: 'puzzle', gid: id, game: GS_GAMES[id].name, art: GS_GAMES[id].art, date: pzLong(x.d), result: x.line, loss: !x.ok };
  let s;
  if (DP_PZ[id]) s = dpSession(id, c, x, base);
  else if (id === 'word') {
    const answer = PZ_WORDS[i % PZ_WORDS.length]; const n = x.ok ? 3 + (i % 4) : 6;
    const guesses = Array.from({ length: n }, (_, k) => (x.ok && k === n - 1 ? answer : k === 0 ? PZ_OPEN[i % PZ_OPEN.length] : PZ_WORDS[(i + k * 5) % PZ_WORDS.length] === answer ? PZ_OPEN[(i + k) % PZ_OPEN.length] : PZ_WORDS[(i + k * 5) % PZ_WORDS.length]));
    const mark = (g) => { if (g === answer) return 'Solved'; const r = gsWordRow(g, answer); const a = (r.match(/🟩/gu) || []).length; const b = (r.match(/🟨/gu) || []).length;
      return a + b === 0 ? 'No letters in the word' : [a && a + ' in place', b && b + ' in the word'].filter(Boolean).join(', '); };
    s = { ...base, number: 212 - i, answer, listTitle: 'Every guess', share: x.line, lines: guesses.map((g, k) => ['Guess ' + (k + 1), g, mark(g)]) };
  } else if (id === 'groups') {
    const mis = x.ok ? (i === 1 ? 0 : i % 4) : 4; const found = x.ok ? 4 : 2; const lines = []; const rows = [];
    for (let k = 0, f = 0, m = 0; f < found || m < mis; k++) {
      if (m < mis && (k % 2 === 1 || f >= found)) { const g = PZ_GROUPS[f % 4][0]; const o = PZ_GROUPS[(f + 1) % 4][0]; rows.push(g + g + g + o); lines.push(['Try ' + (k + 1), 'Mixed four', m === 0 ? 'One away' : 'Not a group']); m++; }
      else { const [g, w] = PZ_GROUPS[f]; rows.push(g + g + g + g); lines.push(['Try ' + (k + 1), w.split(': ')[1], 'Found: ' + w.split(': ')[0]]); f++; }
    }
    s = { ...base, figures: [found + ' of 4 groups', mis ? pzMis(mis).replace(/^./, (ch) => ch.toUpperCase()) : 'No mistakes'], listTitle: 'Every try', share: x.line,
      shareHead: 'Daily Groups #' + (88 - i) + ' · ' + pzMis(mis), rows, lines };
  } else if (id === 'mystery') {
    const cs = (i * 3) % 8; const cw = (i * 5 + 1) % 8; const cr = (i * 7 + 2) % 8; const q = i % 3;
    const qs = Array.from({ length: q }, (_, k) => (k === 0
      ? ['Question 1', 'Was ' + PZ_SUS[(i + 1) % 8] + ' in the ' + PZ_RMS[(i + 4) % 8] + '?', i % 2 ? 'Yes' : 'No']
      : ['Question 2', 'Did ' + PZ_SUS[(i + 5) % 8] + ' have the ' + PZ_WPN[(i + 3) % 8] + '?', i % 3 === 1 ? 'Yes' : 'No']));
    const part = i % 3;
    const acc = x.ok ? pzAcc(PZ_SUS[cs], PZ_WPN[cw], PZ_RMS[cr])
      : pzAcc(PZ_SUS[part === 0 ? (cs + 1) % 8 : cs], PZ_WPN[part === 1 ? (cw + 1) % 8 : cw], PZ_RMS[part === 2 ? (cr + 1) % 8 : cr]);
    s = { ...base, number: 64 - i, q, hints: 0, listTitle: 'Every question', share: x.line, figures: [pzQn(q), 'No hints'],
      lines: [...qs, ['Accusation', acc, x.ok ? 'Right' : 'Wrong']] };
  } else {
    // Escape has no earlier room: nothing is generated for it.
    s = { ...GS_SESSIONS['escape-week'], date: base.date };
  }
  GS_SESSIONS[sid] = s; return sid;
};
// Seed: forty days (thirty weeks for Escape), newest first; index 0 is this edition.
Object.entries(PZ).forEach(([id, c]) => {
  c.gid = id;
  c.all = Array.from({ length: c.count || (c.weekly ? 30 : 40) }, (_, i) => {
    const d = new Date(2026, 9, c.weekly ? 5 - 7 * i : 6 - i);
    const played = i === 0 || !!c.keep[i] || ((i + c.salt) % 6 !== 5 && (i + c.salt) % 9 !== 6);
    const ok = played && (!!c.keep[i] || (i + 2 * c.salt) % 5 !== 4);
    return { id: id + i, i, d, date: lbDate(d), month: lbMonth(d), title: c.no(i), played, ok, done: played && ok, line: ok ? c.ok(i) : c.bad };
  });
  // Every earlier edition played gets its own session page, so each row opens a real record.
  c.all.slice(1).forEach((x) => { if (x.played) x.sid = c.keep[x.i] ? c.past : pzSession(id, c, x); });
  c.badges = lbAutoBadges(c.ach);
});
// State library-word-streak-broken: yesterday's Daily Word finished in a first play that failed.
(() => {
  const c = PZ.word; const y = c.all[1]; const keep = GS_SESSIONS['word-e1'];
  pzSession('word', c, { ...y, ok: false, line: c.bad }); GS_SESSIONS['word-broken-first'] = GS_SESSIONS['word-e1'];
  if (keep) GS_SESSIONS['word-e1'] = keep; else delete GS_SESSIONS['word-e1'];
})();
const pzGo = (gs, id, sid) => gs.go(GS_GAMES[id].route, sid ? { page: 'record', sid } : { page: 'record' });
const pzStatus = (c, x) => (!x.played ? { kind: 'none', label: 'Not played' } : x.ok ? { kind: 'ok', label: x.line } : { kind: 'bad', label: x.line });

const PzNow = ({ c, done, none, id }) => {
  const gs = useGs(); const st = done ? c.done : c.live;
  if (none) return (
    <section className="lb-card">
      <div className="lb-top"><div className="gs-stack-xs"><span className="gs-label">{c.weekly ? 'THIS WEEK' : 'TODAY'}</span><h2 className="mcp-t-sec">{c.title}</h2></div></div>
      <p>{GS_PAGES[id].week.line}</p>
      <div className="lb-foot">
        <div className="lb-acts"><DS.Button onClick={() => gs.playReq({ kind: 'edition', e: edList(gs, id)[0] })}>Play</DS.Button></div>
        <span className="gs-muted">{c.next}</span>
      </div>
    </section>
  );
  const lines = done && window.gsShareText ? window.gsShareText(GS_SESSIONS[c.today]) : null;
  return (
    <section className="lb-card">
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">{c.weekly ? 'THIS WEEK' : 'TODAY'}</span><h2 className="mcp-t-sec">{c.title}</h2></div>
        {done && <span className="lb-big"><LbResult s={c.done.st} /></span>}
      </div>
      <p>{st.line}</p>
      {st.bar && <DS.ProgressBar label={st.bar[0]} value={st.bar[1]} max={st.bar[2]} showValue={false} />}
      <div className="lb-foot">
        <div className="lb-acts">
          {lines && <LbShare lines={lines} />}
          <DS.TextLink onClick={() => gs.go('session', { id: done ? c.today : c.liveSid })}>{done ? c.links[0] : c.links[1]}</DS.TextLink>
        </div>
        <span className="gs-muted">{c.next}</span>
      </div>
    </section>
  );
};
// The run, from the record: each edition as this player's play of it stands (completed, failed, in progress or not played).
const pzRun = (gs, id) => {
  const by = {}; phVisible(gs).forEach((p) => { if (p.gid === id && !by[p.ed]) by[p.ed] = p; });
  return PZ[id].all.map((x) => { const p = by[x.id]; const k = p ? p.status.kind : 'none'; return { ...x, played: !!p, done: k === 'ok', failed: k === 'bad' }; });
};
const pzLibrary = (id) => () => {
  const gs = useGs(); const c = PZ[id]; const k = gs.view + (gs.sub.hadPass ? 'u' : '') + (lbWeekDone(gs) ? 'd' : '') + (gs.review.today || '');
  const [recent] = c.plays; const allLabel = 'See in History';
  const never = gs.review.never === id || gsFresh(gs);
  const now = never ? null : lbNow(gs, id); // The broken streak changes yesterday's play only (phLog); today's head reads today's play.
  const none = !now;
  const run = pzRun(gs, id); const n = lbStreak(run);
  const ach = phAch(gs, id, c.ach, n);
  return (
    <main key={k} className="gs-wrap gs-main">
      <LbHead id={id} />
      <div className="lb-lay">
        <PzNow c={c} done={lbWeekDone(gs)} none={none} id={id} />
        <LbRun n={n} unit={c.weekly ? 'weeks' : 'days'} weeks={lbRunOf(run)} />
        <LbAch items={ach} badges={c.badges} access="all" />
        <LbRecent title={recent} allLabel={allLabel}
          empty={recent + ' appear here once you have played one.'} />
      </div>
      {gs.view !== 'pass' && id !== 'escape' && <window.CprPassEnd className="gs-muted gs-pu-wrap" text={'Playing earlier ' + GS_GAMES[id].ed[1] + ' comes with the Pass.'} />}
    </main>
  );
};
['word', 'groups', 'mystery', 'escape', ...DP_IDS].forEach((id) => { window.GS_LIBRARY[id] = pzLibrary(id); });
Object.assign(window, { PZ, pzLong, pzStatus, pzRun });
