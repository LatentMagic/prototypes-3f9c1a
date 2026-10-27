// ============================================================================
// Session pages 2, Daily Word: the seeded plays, the recoloured cover, and the reader and tiles every option draws with.
//
// What the record holds (monorepo libs/mcp-games/backend/daily-word/src/lib/domain/session-record.ts): each guess as a line
// ("Guess 1 · CRANE · No letters in the word"), each hint as a line ("Hint · Letter 2 is T.") in the order taken, the headline,
// and, once the day has ended, the share grid (per-letter marks, no letters). The answer is never in the record.
// So per-letter colours on a finished play come from the share grid; on a play in progress the record has counts only, and the
// seed computes the marks from its answer (an option's cost says so). A failed play never prints the answer.
// The hint is always a letter in its place (game spec daily-word.md section 2): the place of the first letter not yet green.
// ============================================================================
(function () {
  // ---- The three plays (playground seeds; canon's word-today hint is "contains", which the game never gives) ----
  Object.assign(GS_SESSIONS, {
    // Today, No. 212: CRANE, SLATE, the hint (S is green, so it gives letter 2), STILL.
    'sp2-word-solved': {
      kind: 'puzzle', gid: 'word', game: 'Daily Word', art: 'word', number: 212, answer: 'STILL', hints: 1, result: 'Solved in 3 of 6', date: GS.today,
      listTitle: 'Every guess', share: 'Solved in 3 of 6',
      lines: [['Guess 1', 'CRANE', 'No letters in the word'], ['Guess 2', 'SLATE', '1 in place, 2 in the word'], ['Hint', 'Letter 2 is T.'], ['Guess 3', 'STILL', 'Solved']],
    },
    // No. 208, a lost day: all six guesses, with the hint taken after the first. The SHA_E trap: the hint gave letter 1 (S),
    // since A and E were already green, and four letters stayed in place from guess 2 to guess 6. The answer (SHAKE) only computes marks.
    'sp2-word-failed': {
      kind: 'puzzle', gid: 'word', game: 'Daily Word', art: 'word', number: 208, answer: 'SHAKE', loss: true, hints: 1, result: 'Failed', date: 'Sunday 4 October',
      listTitle: 'Every guess', share: 'Failed',
      lines: [['Guess 1', 'CRANE', '2 in place'], ['Hint', 'Letter 1 is S.'], ['Guess 2', 'SHADE', '4 in place'], ['Guess 3', 'SHAME', '4 in place'],
        ['Guess 4', 'SHAPE', '4 in place'], ['Guess 5', 'SHARE', '4 in place'], ['Guess 6', 'SHAVE', '4 in place']],
    },
    // Today in progress: two guesses, no hint yet (canon's word-live).
    'sp2-word-live': {
      kind: 'puzzle', gid: 'word', game: 'Daily Word', art: 'word', number: 212, answer: 'STILL', live: true, result: 'In progress', date: GS.today,
      listTitle: 'Every guess', share: null,
      lines: [['Guess 1', 'CRANE', 'No letters in the word'], ['Guess 2', 'SLATE', '1 in place, 2 in the word']],
    },
  });

  // ---- The tile colours, one set for the cover and every option (word.css carries them as --wd-*) ----
  // Success: the old cover's ground, cover-bg-forest #163328, lifted to 28% lightness at the same hue (#2B6448) so it reads on a dark ground.
  // In the word: cover-amber #E5A63B. Both are filled. Not in the word: an outline in the store's control edge #918B80, never filled on a tile,
  // so a filled tile always outranks it. The cover's ground becomes cover-bg-indigo #1D1B3A (no light ground: owner, 2026-10-27).
  const C = { hit: '#2B6448', near: '#E5A63B', miss: '#918B80', ground: '#1D1B3A' };
  // The cover: a guess row of three blocks on indigo. Placed, elsewhere, and the outline that fills on hover (word.css) as a letter not in the word.
  GS_ART.word = Object.assign({}, GS_ART.word, {
    svg: GS_SVG('<rect width="160" height="120" fill="' + C.ground + '"/><rect x="24" y="44" width="32" height="32" fill="' + C.hit + '"/><rect x="64" y="44" width="32" height="32" fill="' + C.near + '"/><rect class="wd-cover-miss" x="106" y="46" width="28" height="28" fill="' + C.miss + '" fill-opacity="0" stroke="' + C.miss + '" stroke-width="4"/>'),
  });

  // ---- Reading a play ----
  // The engine's marking: greens first, then each remaining letter of the answer lights at most one yellow, left to right.
  const score = (word, answer) => {
    const w = word.split(''), a = answer.split(''), marks = w.map(() => 'miss'), left = {};
    a.forEach((ch, i) => { if (w[i] === ch) marks[i] = 'hit'; else left[ch] = (left[ch] || 0) + 1; });
    w.forEach((ch, i) => { if (marks[i] !== 'hit' && left[ch]) { marks[i] = 'near'; left[ch] -= 1; } });
    return marks;
  };
  const read = (s) => {
    const events = []; let n = 0;
    s.lines.forEach((l) => {
      if (/^Guess/.test(l[0])) { n += 1; events.push({ kind: 'guess', n, word: l[1], caption: l[2], marks: score(l[1], s.answer) }); }
      else if (l[0] === 'Hint') {
        const m = /Letter (\d) is ([A-Z])/.exec(l[1]);
        if (m) events.push({ kind: 'hint', pos: Number(m[1]) - 1, letter: m[2], text: l[1], after: n });
      }
    });
    const guesses = events.filter((e) => e.kind === 'guess');
    return { events, guesses, hint: events.find((e) => e.kind === 'hint') || null, live: !!s.live, left: 6 - guesses.length };
  };
  const SAY = { hit: 'in place', near: 'in the word', miss: 'not in the word' };
  const rowLabel = (g) => 'Guess ' + g.n + ', ' + g.word + ': ' + g.word.split('').map((ch, i) => ch + ' ' + SAY[g.marks[i]]).join(', ');
  const hintLabel = (h) => 'Hint, after guess ' + h.after + ': ' + h.text;

  // ---- Tiles ----
  // k: hit | near | miss | empty | hint. A hint tile is the letter in its place, drawn as the hint (an outline), never as a mark.
  const Tile = ({ k, t }) => <span className={'wd-t wd-' + k}>{t || ''}</span>;
  const Row = ({ g }) => (
    <div className="wd-row" role="img" aria-label={rowLabel(g)}>{g.word.split('').map((ch, i) => <Tile key={i} k={g.marks[i]} t={ch} />)}</div>
  );
  const EmptyRow = () => <div className="wd-row" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <Tile key={i} k="empty" />)}</div>;
  const HintRow = ({ h }) => (
    <div className="wd-row" role="img" aria-label={hintLabel(h)}>{[0, 1, 2, 3, 4].map((i) => <Tile key={i} k={i === h.pos ? 'hint' : 'gap'} t={i === h.pos ? h.letter : ''} />)}</div>
  );

  window.WdModel = { read, score, Tile, Row, EmptyRow, HintRow, rowLabel, hintLabel, colours: C };
})();
