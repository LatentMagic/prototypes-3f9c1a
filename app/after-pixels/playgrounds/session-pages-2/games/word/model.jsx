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
  // ---- The four plays (playground seeds; canon's word-today hint is "contains", which the game never gives) ----
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
      kind: 'puzzle', gid: 'word', game: 'Daily Word', art: 'word', number: 208, answer: 'SHAKE', loss: true, hints: 1, result: 'Failed', date: 'Friday 2 October',
      listTitle: 'Every guess', share: 'Failed',
      lines: [['Guess 1', 'CRANE', '2 in place'], ['Hint', 'Letter 1 is S.'], ['Guess 2', 'SHADE', '4 in place'], ['Guess 3', 'SHAME', '4 in place'],
        ['Guess 4', 'SHAPE', '4 in place'], ['Guess 5', 'SHARE', '4 in place'], ['Guess 6', 'SHAVE', '4 in place']],
    },
    // No. 210, a hard day: solved on the fifth guess with the hint taken. After ROBOT only letter 4 (O) was green, so the hint gave
    // letter 1 (F); FROGS and FLOUR closed in, and FLOOR's second O came last.
    'sp2-word-hard': {
      kind: 'puzzle', gid: 'word', game: 'Daily Word', art: 'word', number: 210, answer: 'FLOOR', hints: 1, result: 'Solved in 5 of 6', date: 'Sunday 4 October',
      listTitle: 'Every guess', share: 'Solved in 5 of 6',
      lines: [['Guess 1', 'CRANE', '1 in the word'], ['Guess 2', 'ROBOT', '1 in place, 2 in the word'], ['Hint', 'Letter 1 is F.'],
        ['Guess 3', 'FROGS', '2 in place, 1 in the word'], ['Guess 4', 'FLOUR', '4 in place'], ['Guess 5', 'FLOOR', 'Solved']],
    },
    // Today in progress: two guesses, no hint yet (canon's word-live).
    'sp2-word-live': {
      kind: 'puzzle', gid: 'word', game: 'Daily Word', art: 'word', number: 212, answer: 'STILL', live: true, result: 'In progress', date: GS.today,
      listTitle: 'Every guess', share: null,
      lines: [['Guess 1', 'CRANE', 'No letters in the word'], ['Guess 2', 'SLATE', '1 in place, 2 in the word']],
    },
  });

  // ---- The cover ----
  // Colours come from the colour config (colours.jsx), as CSS variables, so the cover and every option's tiles change together.
  // A guess row of three blocks on the cover ground: in place, in the word, and the block not in the word. That block is drawn at
  // full size (104, 44, 32) and word.css shrinks it to a small, thin grey outline at rest; on hover, keyboard focus or a tap it
  // grows to full size and fills. The svg is focusable so the keyboard reaches it; GsCover's replace of 'xMidYMid slice' still applies.
  GS_ART.word = Object.assign({}, GS_ART.word, {
    svg: '<svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" tabindex="0" role="img" aria-label="Daily Word cover">'
      + '<rect width="160" height="120" style="fill:var(--wd-ground)"/><rect x="24" y="44" width="32" height="32" style="fill:var(--wd-hit)"/><rect x="64" y="44" width="32" height="32" style="fill:var(--wd-near)"/><rect class="wd-cover-miss" x="104" y="44" width="32" height="32" style="fill:var(--wd-miss);stroke:var(--wd-miss)"/>'
      + '</svg>',
  });
  // A tap opens the block (touch has no hover); a second tap, or a tap elsewhere, closes it. The mouse uses hover alone.
  document.addEventListener('pointerup', (e) => {
    if (e.pointerType === 'mouse') return;
    const host = e.target.closest ? e.target.closest('.mcp-cover, .wdb-cover') : null;
    const own = host && host.querySelector('.wd-cover-miss') ? host : null;
    document.querySelectorAll('[data-wd-open]').forEach((n) => { if (n !== own) n.removeAttribute('data-wd-open'); });
    if (own) own.toggleAttribute('data-wd-open');
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

  window.WdModel = { read, score, Tile, Row, EmptyRow, HintRow, rowLabel, hintLabel };
})();
