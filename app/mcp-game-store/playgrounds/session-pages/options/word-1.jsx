// Session page, Daily Word, option 1: "Your board, guess by guess". THE WORKED EXAMPLE other options copy (see ../README.md, "How an option uses the foundation").
// Shape of every option: Ss.Page > Ss.Head, then .ss-body (the Hero, then .ss-side with the Share card), then Ss.Record.
// The h1, the stat cells and the share text all come from one function, SsOutcome.word (shared/outcome.js).
(function () {
  const KIND = { h: 'hit', n: 'near', x: 'miss' };

  // One row of the board: five square cells and what that guess taught. Phone: the caption sits under the row. Desktop: beside it.
  const Row = ({ r }) => {
    if (r.kind === 'hint') {
      const cells = Array.from({ length: Math.max(1, r.pos + 1) }, (_, i) => (i === r.pos ? { t: r.letter, k: 'hint' } : { t: '', k: 'empty' }));
      return (
        <div className="w1-row w1-hint">
          <Ss.Cells rows={[cells.slice(r.pos)]} label={'Hint: ' + r.caption} />
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
  const EmptyRow = () => (
    <div className="w1-row"><Ss.Cells rows={[Array.from({ length: 5 }, () => ({ t: '', k: 'empty' }))]} label="Unused guess" /></div>
  );

  const WordOne = ({ gid, session, sid, share, api }) => {
    const out = Ss.useOutcome('word', session);
    const status = session.unfinished ? 'ended' : session.live ? 'live' : 'done';
    const played = out.play.guesses.length, hints = out.play.hints;
    const stats = [{ label: 'Guesses', value: played + ' of 6' }, { label: 'Hints', value: hints ? String(hints) : 'None' }];
    const spare = Array.from({ length: Math.max(0, 6 - played) });
    // A lost day shows no answer: nothing in the engine's record holds it. The board is the whole story.
    return (
      <Ss.Page gid={gid}>
        <Ss.Head gid={gid} art="word" label={out.label} date={session.date} h1={out.h1} stats={stats} />
        <div className="ss-body">
          <section className="ss-hero ss-surface" aria-label="Your board">
            <div className="w1-board">
              {out.play.rows.map((r, i) => <Row key={i} r={r} />)}
              {spare.map((_, i) => <EmptyRow key={'e' + i} />)}
            </div>
          </section>
          <aside className="ss-side">
            <Ss.ShareCard status={status} lines={share.lines} gid={gid} session={session} sid={sid} api={api} />
          </aside>
        </div>
        <Ss.Record title={session.listTitle} lines={session.lines} />
      </Ss.Page>
    );
  };

  pgOption('word', 1, {
    name: 'Your board, guess by guess',
    stance: 'The board is what the player stared at, so show it with letters in, and say beside each row what that guess taught.',
    cost: 'Needs the engine to send per-letter marks (guess-scored) and where the hint fell; the seed computes them. A lost day shows no answer, because no engine field holds it.',
    Component: WordOne,
    shareText: (session) => window.SsOutcome.word(session).lines,
    css: `
      :scope .w1-board { display: grid; gap: 12px; }
      :scope .w1-row { display: grid; gap: 4px; justify-items: start; }
      :scope .w1-cap { font: var(--type-caption); color: var(--muted); }
      :scope .w1-hint .w1-cap { color: var(--text); }
      @container ss (min-width: 680px) {
        :scope .w1-row .ss-cells { --c: 64px; }
        :scope .w1-row { grid-template-columns: 344px minmax(0, 1fr); align-items: center; gap: 16px; }
        :scope .w1-cap { font: var(--type-body); }
      }
    `,
  });
})();
