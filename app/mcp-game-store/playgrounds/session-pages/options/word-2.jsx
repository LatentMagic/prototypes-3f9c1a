// Session page, Daily Word, option 2: "The board, large". The poster version: the board alone, as large as the column allows.
// Option 1 is the reading page (board plus what each guess taught), option 3 the sending page. This one is for looking at, and keeping.
// Same shape as word-1.jsx: Ss.Page > Ss.Head, .ss-body (Hero, Share card in .ss-side), Ss.Record. Text and h1 from SsOutcome.word.
(function () {
  const KIND = { h: 'hit', n: 'near', x: 'miss' };
  const BLANK = () => Array.from({ length: 5 }, () => ({ t: '', k: 'empty' }));

  const WordTwo = ({ gid, session, sid, share, api }) => {
    const out = Ss.useOutcome('word', session);
    const status = session.unfinished ? 'ended' : session.live ? 'live' : 'done';
    const guesses = out.play.guesses, played = guesses.length, hints = out.play.hints;
    // A finished day is only the rows that were played (the poster of the result). An open day keeps its empty rows, so the board still reads as six tries.
    const spare = status === 'done' ? 0 : Math.max(0, 6 - played);
    const rows = guesses.map((g) => g.word.split('').map((ch, i) => ({ t: ch, k: KIND[g.marks[i]] }))).concat(Array.from({ length: spare }, BLANK));
    const stats = out.stats;
    const left = 6 - played, say = left + (left === 1 ? ' guess left' : ' guesses left');
    const label = 'Your board: ' + guesses.map((g) => g.word + ', ' + g.caption).join('; ');
    // No hint row and no captions on the poster: the hint is in the h1 ("1 hint"), and a lost day shows no answer (no engine field holds it).
    return (
      <Ss.Page gid={gid}>
        <Ss.Head gid={gid} art="word" label={out.label} date={session.date} h1={out.h1} mark={out.mark} stats={stats} />
        <div className="ss-body">
          <section className="ss-hero ss-surface w2-poster" aria-label="Your board">
            <Ss.Cells rows={rows} cols={5} size="lg" label={label} className="w2-cells" />
          </section>
          <aside className="ss-side">
            <Ss.ShareCard status={status} say={say} lines={share.lines} gid={gid} session={session} sid={sid} api={api} />
          </aside>
        </div>
        <Ss.Record title={session.listTitle} lines={session.lines} />
      </Ss.Page>
    );
  };

  pgOption('word', 2, {
    name: 'The board, large',
    stance: 'The board alone, as large as the column allows, with no captions and no hint row: the poster of the day, to look at before you read it (option 1) or send it (option 3).',
    cost: 'Needs the engine to send per-letter marks (guess-scored); the seed computes them. It gives up the reading of each guess and the hint row, and a lost day shows no answer because no engine field holds it.',
    Component: WordTwo,
    shareText: (session) => window.SsOutcome.word(session).lines,
    css: `
      :scope .w2-poster { justify-items: center; padding: 24px 12px; }
      :scope .w2-cells { --c: min(72px, calc((100cqi - 24px - 32px) / 5)); justify-content: center; gap: 8px; }
      :scope .w2-cells .ss-cells-row { gap: 8px; }
      /* Phone: the poster bleeds to the screen edges so the five tiles take the full column (about 66px). */
      @container ss (max-width: 639px) {
        :scope .w2-poster { margin-inline: -16px; border-inline-width: 0; }
      }
      @container ss (min-width: 640px) {
        :scope .w2-poster { padding: 40px 24px; }
        :scope .w2-cells { --c: 72px; }
      }
    `,
  });
})();
