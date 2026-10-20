// Session page, Daily Word, option 1: "Your board, guess by guess". THE WORKED EXAMPLE other options copy (see ../README.md, "How an option uses the foundation").
// Shape of every option: Ss.Page > Ss.Head, then .ss-body (the Hero, then .ss-side with the Share card), then Ss.Record.
// The h1, the stat cells and the share text all come from one function, SsOutcome.word (shared/outcome.js).
(function () {
  const KIND = { h: 'hit', n: 'near', x: 'miss' };

  // One row of the board: five square cells and what that guess taught. Phone: the caption sits under the row. Desktop: beside it.
  const Row = ({ r, ia }) => {
    if (r.kind === 'hint') {
      const cells = Array.from({ length: Math.max(1, r.pos + 1) }, (_, i) => (i === r.pos ? { t: r.letter, k: 'hint' } : { t: '', k: 'empty' }));
      // IA pass: a hint that names a column is drawn in that column of a five-wide row (the other four stay blank), so it reads as a place, not a stray tile.
      const placed = ia && !/^Hint: it has/.test(r.caption);
      return (
        <div className="w1-row w1-hint">
          <Ss.Cells rows={[placed ? Array.from({ length: 5 }, (_, i) => (i === r.pos ? { t: r.letter, k: 'hint' } : { t: '', k: 'empty' })) : cells.slice(r.pos)]} label={'Hint: ' + r.caption} />
          <span className="w1-cap">{r.caption}</span>
        </div>
      );
    }
    return (
      <div className="w1-row">
        <Ss.Cells rows={[r.word.split('').map((ch, i) => ({ t: ch, k: KIND[r.marks[i]] }))]} label={'Guess ' + r.n + ': ' + r.word + ', ' + r.caption} />
        <span className="w1-cap">{r.caption}</span>
      </div>
    );
  };
  // Between and Game: the row is five of the cover's squares (word-model.jsx). A hint is an 8x8 teal square above its column, with its caption.
  const RowDrawn = ({ r }) => {
    if (r.kind === 'hint') {
      const legacy = /^Hint: it has/.test(r.caption);
      return (
        <div className="w1-row w1-hint w1-drawn">
          <div role="img" aria-label={r.caption}><PgWord.HintMarks hints={[{ pos: r.pos, letter: r.letter, legacy }]} /></div>
          <span className="w1-cap">{r.caption}</span>
        </div>
      );
    }
    return (
      <div className="w1-row w1-drawn">
        <div role="img" aria-label={PgWord.speak(r)}><PgWord.Tiles word={r.word} marks={r.marks} fused={r.fused} /></div>
        <span className="w1-cap">{r.caption}</span>
      </div>
    );
  };
  const EmptyDrawn = () => <div className="w1-row w1-drawn"><div role="img" aria-label="Unused guess"><PgWord.Tiles empty /></div></div>;
  const EmptyRow = () => (
    <div className="w1-row"><Ss.Cells rows={[Array.from({ length: 5 }, () => ({ t: '', k: 'empty' }))]} label="Unused guess" /></div>
  );

  const WordOne = ({ gid, session, sid, share, api, element, layout }) => {
    const out = Ss.useOutcome('word', session);
    const status = session.unfinished ? 'ended' : session.live ? 'live' : 'done';
    const played = out.play.guesses.length, hints = out.play.hints;
    const stats = out.stats;
    const left = 6 - played, say = left + (left === 1 ? ' guess left' : ' guesses left');
    // A finished day shows only the rows played; an open day keeps its empty rows so the board still reads as six tries.
    const spare = Array.from({ length: status === 'done' ? 0 : Math.max(0, 6 - played) });
    const drawn = element === 'between' || element === 'game', ia = layout === 'ia';
    const fuse = PgWord.solvedRow(out, session, status), lastN = out.play.guesses.length;
    const rows = drawn ? out.play.rows.map((r) => (r.kind === 'guess' && fuse && r.n === lastN && element === 'game' ? { ...r, fused: true } : r)) : out.play.rows;
    // A lost day shows no answer: nothing in the engine's record holds it. The board is the whole story.
    return (
      <Ss.Page gid={gid}>
        <Ss.Head gid={gid} art="word" label={out.label} date={session.date} h1={out.h1} mark={out.mark} stats={stats} />
        <div className="ss-body">
          <section className={'ss-hero ss-surface' + (element === 'game' ? ' wd-slot' : '')} aria-label="Your board">
            <div className="w1-board">
              {drawn ? rows.map((r, i) => <RowDrawn key={i} r={r} />) : out.play.rows.map((r, i) => <Row key={i} r={r} ia={ia} />)}
              {spare.map((_, i) => (drawn ? <EmptyDrawn key={'e' + i} /> : <EmptyRow key={'e' + i} />))}
            </div>
          </section>
          <aside className="ss-side">
            <Ss.ShareCard status={status} say={say} lines={share.lines} gid={gid} session={session} sid={sid} api={api} />
          </aside>
        </div>
        <Ss.Record title={session.listTitle} lines={session.lines} />
      </Ss.Page>
    );
  };

  pgOption('word', 1, {
    name: 'Your board, guess by guess',
    stance: 'The board is what the player stared at, so show it with letters in, and say beside each row what that guess taught. IA pass: on a phone each caption sits beside its row, so the board and Share fit above the fold, and a hint that names a column is drawn in that column. Between and Game: the rows are the cover\'s own squares, a hint an 8x8 teal square over its column.',
    cost: 'Needs the engine to send per-letter marks (guess-scored) and where the hint fell; the seed computes them. A lost day shows no answer, because no engine field holds it. Between and Game: each mark is one guess-scored mark, the hint square one hint-given event; the engine sends only counts in progress, and the seed\'s "contains" hint has no column, so its square sits at the left. Flat only: no texture.',
    elements: ['store', 'between', 'game'], layouts: ['built', 'ia'],
    Component: WordOne,
    shareText: (session) => window.SsOutcome.word(session).lines,
    css: PgWord.css + `
      :scope .w1-board { display: grid; gap: 12px; }
      :scope .w1-row { display: grid; gap: 4px; justify-items: start; }
      :scope .w1-cap { font: var(--type-caption); color: var(--muted); }
      :scope .w1-hint .w1-cap { color: var(--text); }
      @container ss (min-width: 680px) {
        :scope .w1-row .ss-cells { --c: 64px; }
        :scope .w1-row { grid-template-columns: 344px minmax(0, 1fr); align-items: center; gap: 16px; }
        :scope .w1-cap { font: var(--type-body); }
        :scope .w1-drawn { grid-template-columns: calc(5 * var(--wd-max) + 32px) minmax(0, 1fr); }
        :scope .w1-hint.w1-drawn { grid-template-columns: calc(5 * var(--wd-max) + 32px) minmax(0, 1fr); }
      }
      :scope .w1-drawn .wd-hintrow { margin-bottom: 0; }
      :scope .w1-drawn > [role="img"] { width: 100%; max-width: calc(5 * var(--wd-max) + 32px); }
      :scope .w1-hint .ss-cell[data-k="empty"] { visibility: hidden; }
      /* IA pass, phone: each caption beside its row (cells 40, gap 4), rows tight, so the board, Share and the count all sit above the fold. */
      @container ss (max-width: 679px) {
        :scope .ss-page[data-layout="ia"] .w1-board { gap: 8px; }
        :scope .ss-page[data-layout="ia"] .w1-row { grid-template-columns: max-content minmax(0, 1fr); align-items: center; gap: 12px; }
        :scope .ss-page[data-layout="ia"] .w1-row .ss-cells { --c: 40px; }
        :scope .ss-page[data-layout="ia"] .w1-row .ss-cells-row { gap: 4px; }
        :scope .ss-page[data-layout="ia"] .w1-drawn .wd-tiles { --wd-max: 40px; --wd-gap: 4px; width: 176px; }
        :scope .ss-page[data-layout="ia"] .w1-drawn { grid-template-columns: 176px minmax(0, 1fr); }
        :scope .ss-page[data-layout="ia"] .w1-cap { font-size: 13px; }
      }
    `,
  });
})();
