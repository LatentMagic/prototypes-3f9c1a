// Session page, Daily Mystery, option 2: "Yes and No". The inspector's answer is a square cell beside each question; the accusation is one line.
// Reads the session through window.PgMystery (mystery-model.jsx). The cell is the Mystery member of the cell family: Yes is a filled mark, No an outlined one.
// Neither is hit or miss (green or grey): a Yes is not a good answer, only an answer.
(function () {
  const Ans = ({ a }) => (
    <Ss.Cells className="m2-cell" size="lg" label={'The inspector said ' + a} rows={[[{ t: a, k: a === 'Yes' ? 'mark1' : 'filled' }]]} />
  );
  const Row = ({ n, text, answer, none }) => (
    <li className={'m2-row' + (none ? ' is-empty' : '')}>
      {none ? <Ss.Cells className="m2-cell" size="lg" label="Not asked" rows={[[{ t: '', k: 'empty' }]]} /> : <Ans a={answer} />}
      <div className="m2-body">
        <span className="ss-kicker">Question {n}</span>
        <p className={none ? 'm2-ask is-none' : 'm2-ask'}>{none || text}</p>
      </div>
    </li>
  );

  const MysteryTwo = ({ gid, session, sid, share, api }) => {
    const out = Ss.useOutcome('mystery', session);
    const P = window.PgMystery;
    const c = React.useMemo(() => P.read(session), [session]);
    const status = P.statusOf(session);
    const acc = c.acc;
    // Walk the play in order: a question is a row with its answer cell; a hint is a muted line where it fell.
    let qn = 0;
    const flow = c.items.map((it, i) => it.kind === 'q'
      ? <Row key={i} n={++qn} text={it.text} answer={it.answer} />
      : <li key={i} className="m2-hint"><span className="m2-hint-lab">Hint</span>{it.text}</li>);
    const spare = Array.from({ length: Math.max(0, 2 - c.asked) }).map((_, i) => <Row key={'e' + i} n={c.asked + i + 1} none={status === 'done' ? 'Not asked' : 'Not asked yet'} />);
    const scene = P.scene(c);
    return (
      <Ss.Page gid={gid}>
        <Ss.Head gid={gid} art="murder" label={out.label} date={session.date} h1={out.h1} mark={out.mark} stats={out.stats} />
        <div className="ss-body">
          <section className="ss-hero m2-hero" aria-label="What you asked">
            {scene ? <p className="ss-caption m2-scene">{scene}</p> : null}
            <ol className="m2-flow">{flow}{spare}</ol>
            <p className="m2-acc">
              {acc ? (
                <>
                  <span className="m2-acc-lab">Then you accused </span>{acc.raw}
                  <span className="ss-tag" data-tone={acc.right ? 'success' : 'error'}>{acc.right ? 'Right' : 'Wrong'}</span>
                </>
              ) : <span className="m2-acc-lab">{status === 'ended' ? 'No accusation was made.' : 'No accusation yet.'}</span>}
            </p>
          </section>
          <aside className="ss-side">
            <Ss.ShareCard status={status} say={P.say(c)} lines={share.lines} gid={gid} session={session} sid={sid} api={api} />
          </aside>
        </div>
        <Ss.Record title={P.recordTitle} lines={session.lines} />
      </Ss.Page>
    );
  };

  pgOption('mystery', 2, {
    name: 'Yes and No',
    stance: 'Asking is the only reasoning the game records, so each question gets the inspector\'s answer as a square cell beside it (Yes filled, No outlined), the hints where they fell, and the accusation as one closing line.',
    cost: 'Low. Questions, answers, hints and the accusation are on the record today; the scene line needs the engine to send the setting and victim (the seed carries them).',
    Component: MysteryTwo,
    shareText: (session) => window.SsOutcome.mystery(session).lines,
    css: `
      :scope .m2-hero { display: grid; gap: 4px; min-width: 0; align-content: start; }
      :scope .m2-scene { margin: 0 0 8px; }
      :scope .ss-page[data-dist="middle"] .m2-hero { padding-top: 12px; }
      :scope .m2-flow { list-style: none; margin: 0; padding: 0; display: grid; min-width: 0; }
      :scope .m2-row { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 16px; align-items: center; padding: 16px 0; border-top: 1px solid var(--ss-line); }
      :scope .m2-body { display: grid; gap: 4px; min-width: 0; }
      :scope .m2-ask { margin: 0; font: var(--type-card-title); letter-spacing: var(--tracking-heading); text-wrap: balance; overflow-wrap: anywhere; }
      :scope .m2-ask.is-none { color: var(--muted); font: var(--type-body); }
      :scope .m2-cell { --c: 72px; }
      :scope .m2-row.is-empty .ss-cell { border-style: dashed; border-color: var(--ss-line); }
      :scope .m2-hint { margin: 0; padding: 4px 0 16px 12px; border-left: 3px solid var(--ss-mark-2); font: var(--type-body); color: var(--muted); }
      :scope .m2-hint-lab { font: var(--type-label); margin-right: 8px; color: var(--text); }
      :scope .m2-acc { margin: 0; padding-top: 16px; border-top: 1px solid var(--ss-line); font: var(--type-card-title); letter-spacing: var(--tracking-heading); text-wrap: balance; overflow-wrap: anywhere; }
      :scope .m2-acc-lab { color: var(--muted); }
      :scope .m2-acc .ss-tag { margin-left: 10px; vertical-align: 3px; }
      @container ss (min-width: 680px) {
        :scope .m2-cell { --c: 96px; }
        :scope .m2-row { gap: 24px; padding: 20px 0; }
        :scope .m2-ask { font: var(--type-section-title); letter-spacing: var(--tracking-heading); }
        :scope .m2-acc { font: var(--type-section-title); letter-spacing: var(--tracking-heading); padding-top: 20px; }
      }
    `,
  });
})();
