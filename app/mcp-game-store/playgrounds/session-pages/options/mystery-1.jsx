// Session page, Daily Mystery, option 1: "The case file". Reads the session through window.PgMystery (mystery-model.jsx).
// Shape: Ss.Page > Ss.Head, then .ss-body (Hero, then .ss-side with the Share card), then the Record (closed).
(function () {
  const Answer = ({ a }) => <span className={'m1-ans ' + (a === 'Yes' ? 'is-yes' : 'is-no')}>{a}</span>;

  const PgMystery = window.PgMystery;
  const MysteryOne = ({ gid, session, sid, share, api }) => {
    const out = Ss.useOutcome('mystery', session);
    const c = React.useMemo(() => PgMystery.read(session), [session]);
    const status = PgMystery.statusOf(session);
    const acc = c.acc;
    const D = window.DS;
    return (
      <Ss.Page gid={gid}>
        <Ss.Head gid={gid} art="murder" label={out.label} date={session.date} h1={out.h1} mark={out.mark} stats={out.stats} />
        <div className="ss-body">
          <section className="ss-hero ss-surface m1-file" aria-label="The case file">
            <header className="m1-scene">
              <span className="ss-kicker">The case</span>
              {c.setting ? <h2 className="m1-setting">{c.setting}</h2> : null}
              {c.victimName ? <p className="m1-victim">The victim: {c.victimName}{c.victimRole ? ', ' + c.victimRole : ''}</p> : null}
            </header>
            <ol className="m1-rows">
              {c.items.map((it, i) => it.kind === 'q' ? (
                <li className="m1-row" key={i}>
                  <span className="m1-lab">Question {it.n}</span>
                  <span className="m1-text">{it.text}</span>
                  <Answer a={it.answer} />
                </li>
              ) : (
                <li className="m1-row is-hint" key={i}>
                  <span className="m1-lab">Hint</span>
                  <span className="m1-text">{it.text}</span>
                </li>
              ))}
              {Array.from({ length: Math.max(0, 2 - c.asked) }).map((_, i) => (
                <li className="m1-row is-empty" key={'u' + i}>
                  <span className="m1-lab">Question {c.asked + i + 1}</span>
                  <span className="m1-text">{status === 'done' ? 'Not asked' : 'Not asked yet'}</span>
                </li>
              ))}
              <li className="m1-row m1-final">
                <span className="m1-lab">{acc ? 'Your accusation' : 'Accusation'}</span>
                {acc ? (
                  <>
                    <span className="m1-text m1-acc">{acc.raw}</span>
                    <span className="ss-tag" data-tone={acc.right ? 'success' : 'error'}>{acc.right ? 'Right' : 'Wrong'}</span>
                  </>
                ) : <span className="m1-text">{status === 'ended' ? 'Not made' : 'Not accused yet'}</span>}
              </li>
            </ol>
          </section>
          <aside className="ss-side">
            <Ss.ShareCard status={status} say={PgMystery.say(c)} lines={share.lines} gid={gid} session={session} sid={sid} api={api} />
          </aside>
        </div>
        <Ss.Record title={PgMystery.recordTitle} lines={session.lines} />
      </Ss.Page>
    );
  };

  pgOption('mystery', 1, {
    name: 'The case file',
    stance: 'Today\'s page drops the scene, so open with the setting and the victim, then the inspector\'s answers in the order they came, then the accusation, as the case was played.',
    cost: 'Low. Needs the engine to send the case\'s setting and victim (the seed carries them); the questions, hints and accusation are on the record today.',
    Component: MysteryOne,
    shareText: (session) => window.SsOutcome.mystery(session).lines,
    css: `
      :scope .m1-file { gap: 20px; }
      :scope .m1-scene { display: grid; gap: 6px; }
      :scope .m1-setting { margin: 0; font: var(--type-card-title); letter-spacing: var(--tracking-heading); text-wrap: balance; }
      :scope .m1-victim { margin: 0; font: var(--type-body); color: var(--muted); }
      :scope .m1-rows { list-style: none; margin: 0; padding: 0; display: grid; }
      :scope .m1-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 4px 12px; align-items: start; padding: 14px 0; border-top: 1px solid var(--ss-line); }
      :scope .m1-lab { grid-column: 1 / -1; font: var(--type-label); color: var(--muted); }
      :scope .m1-text { font: var(--type-body); min-width: 0; overflow-wrap: anywhere; }
      :scope .m1-row > .ss-tag, :scope .m1-ans { grid-column: 2; grid-row: 2; align-self: start; }
      :scope .m1-ans { display: inline-flex; align-items: center; min-height: 24px; padding: 0 10px; font: var(--type-small); border: 1.5px solid var(--ss-mark-2); color: var(--text); white-space: nowrap; }
      :scope .m1-ans.is-yes { background: var(--ss-mark-1); border-color: var(--ss-mark-1); color: var(--page); }
      :scope .m1-row.is-hint .m1-text { color: var(--muted); }
      :scope .m1-row.is-empty .m1-text { color: var(--muted); }
      :scope .m1-final { padding-bottom: 0; }
      :scope .m1-acc { font: var(--type-card-title); letter-spacing: var(--tracking-heading); text-wrap: balance; }
      @container ss (min-width: 680px) {
        :scope .m1-file { padding: 24px; }
        :scope .m1-row { grid-template-columns: 150px minmax(0, 1fr) auto; align-items: baseline; gap: 16px; padding: 16px 0; }
        :scope .m1-lab { grid-column: 1; }
        :scope .m1-row > .ss-tag, :scope .m1-ans { grid-column: 3; grid-row: 1; }
        :scope .m1-row.is-hint .m1-text, :scope .m1-row.is-empty .m1-text { grid-column: 2 / -1; }
        :scope .m1-final .m1-text:last-child { grid-column: 2 / -1; }
      }
    `,
  });
})();
