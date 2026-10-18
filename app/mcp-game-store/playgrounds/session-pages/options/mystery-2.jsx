// Session page, Daily Mystery, option 2: "What you asked". The two questions, set large, each with the inspector's answer.
// Reads the session through window.PgMystery (defined in mystery-1.jsx). Hero = separate cards, so Middle and Far colour each card, not a card inside a card.
(function () {
  const QCard = ({ it, n }) => (
    <Ss.Card className="m2-q" kicker={'Question ' + n}>
      <h3 className="m2-ask">{it.text}</h3>
      <span className={'m2-ans ' + (it.answer === 'Yes' ? 'is-yes' : 'is-no')}>
        <span className="m2-ans-lab">The inspector said</span>
        <span className="m2-ans-word">{it.answer}</span>
      </span>
    </Ss.Card>
  );
  const EmptyQ = ({ n, done }) => (
    <article className="ss-card m2-q is-empty">
      <span className="ss-kicker">Question {n}</span>
      <p className="m2-none">{done ? 'Not asked' : 'Not asked yet'}</p>
    </article>
  );

  const MysteryTwo = ({ gid, session, sid, share, api }) => {
    const out = Ss.useOutcome('mystery', session);
    const P = window.PgMystery;
    const c = React.useMemo(() => P.read(session), [session]);
    const status = P.statusOf(session);
    const acc = c.acc;
    // Walk the play in order: each question is a card; a hint is a muted line where it fell.
    let qn = 0;
    const flow = c.items.map((it, i) => it.kind === 'q'
      ? <QCard key={i} it={it} n={++qn} />
      : <p key={i} className="m2-hint"><span className="m2-hint-lab">Hint</span>{it.text}</p>);
    const spare = Array.from({ length: Math.max(0, 2 - c.asked) }).map((_, i) => <EmptyQ key={'e' + i} n={c.asked + i + 1} done={status === 'done'} />);
    return (
      <Ss.Page gid={gid}>
        <Ss.Head gid={gid} art="murder" label={out.label} date={session.date} h1={out.h1} mark={out.mark} stats={status === 'done' ? null : P.stats(out, c, status)} />
        <div className="ss-body">
          <section className="ss-hero m2-hero" aria-label="What you asked">
            <div className="m2-flow">{flow}{spare}</div>
            {acc ? (
              <Ss.Card className="m2-acc" kicker="Then you accused" tag={{ text: acc.right ? 'Right' : 'Wrong', tone: acc.right ? 'success' : 'error' }} title={acc.raw} />
            ) : (
              <article className="ss-card m2-acc is-empty">
                <span className="ss-kicker">Then you accused</span>
                <p className="m2-none">{status === 'ended' ? 'No accusation made' : 'Not accused yet'}</p>
              </article>
            )}
            {c.setting ? <p className="ss-caption m2-scene">{c.setting}{c.victimName ? '. The victim was ' + c.victimName + (c.victimRole ? ', ' + c.victimRole : '') + '.' : '.'}</p> : null}
          </section>
          <aside className="ss-side">
            <Ss.ShareCard status={status} say={P.say(c)} lines={share.lines} gid={gid} session={session} sid={sid} api={api} />
          </aside>
        </div>
      </Ss.Page>
    );
  };

  pgOption('mystery', 2, {
    name: 'What you asked',
    stance: 'Asking is the only reasoning the game records, so set the two questions large, each with the inspector\'s answer, the hints where they fell, then the accusation they led to.',
    cost: 'Low. Questions, answers, hints and the accusation are on the record today; the scene line under the cards needs the engine to send the setting and victim (the seed carries them).',
    Component: MysteryTwo,
    shareText: (session) => window.SsOutcome.mystery(session).lines,
    css: `
      :scope .m2-hero { display: grid; gap: 16px; min-width: 0; }
      :scope .m2-flow { display: grid; gap: 16px; min-width: 0; }
      :scope .m2-q, :scope .m2-acc { gap: 12px; }
      :scope .m2-ask { margin: 0; font: var(--type-section-title); letter-spacing: var(--tracking-heading); text-wrap: balance; }
      :scope .m2-ans { display: inline-flex; align-items: baseline; gap: 10px; justify-self: start; padding: 6px 12px; border: 1.5px solid var(--ss-mark-2); }
      :scope .m2-ans-lab { font: var(--type-caption); color: var(--muted); }
      :scope .m2-ans-word { font: var(--type-label); color: var(--text); }
      :scope .m2-ans.is-yes { background: var(--ss-mark-1); border-color: var(--ss-mark-1); }
      :scope .m2-ans.is-yes .m2-ans-lab, :scope .m2-ans.is-yes .m2-ans-word { color: var(--page); }
      :scope .m2-q.is-empty, :scope .m2-acc.is-empty { background: transparent; box-shadow: none; border-style: dashed; }
      :scope .m2-none { margin: 0; font: var(--type-body); color: var(--muted); }
      :scope .m2-hint { margin: 0; padding-left: 12px; border-left: 3px solid var(--ss-mark-2); font: var(--type-body); color: var(--muted); }
      :scope .m2-hint-lab { font: var(--type-label); margin-right: 8px; }
      :scope .m2-scene { margin: 4px 0 0; }
      @container ss (min-width: 680px) {
        :scope .m2-flow { grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: stretch; }
        :scope .m2-hint { grid-column: 1 / -1; }
        :scope .m2-q, :scope .m2-acc { padding: 20px; }
        :scope .m2-q { align-content: space-between; }
      }
    `,
  });
})();
