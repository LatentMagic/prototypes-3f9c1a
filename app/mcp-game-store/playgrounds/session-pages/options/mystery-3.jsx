// Session page, Daily Mystery, option 3: "The accusation". Suspect, weapon and room as three verdict cells, right or wrong each.
// SPOILER-SAFE READING (the owner has not ruled whether the page shows the truth): a missed part says Wrong and nothing more. The answer is never printed.
// Reads the session through window.PgMystery (mystery-model.jsx). On a solve: no squares, names and the scene only. On a loss: the squares, red beside green.
(function () {
  const PARTS = [['suspect', 'Suspect'], ['weapon', 'Weapon'], ['room', 'Room']];
  const nice = (k, v) => (v ? window.PgMystery.cap(String(v).replace(/^(the|a|an) /i, '')) : v);

  const Verdict = ({ ok }) => {
    const D = window.DS;
    if (ok == null) return <span className="m3-sq is-none" aria-hidden="true">?</span>;
    return <span className={'m3-sq ' + (ok ? 'is-ok' : 'is-bad')} aria-hidden="true"><D.Icon name={ok ? 'check' : 'error'} size={32} /></span>;
  };

  const Part = ({ label, name, ok, state }) => (
    <article className={'ss-card m3-part' + (state === 'empty' ? ' is-empty' : '')} aria-label={label + ': ' + (name || 'not named') + (ok == null ? '' : ok ? ', right' : ', wrong')}>
      {state === 'empty' ? <span className="m3-sq is-empty" aria-hidden="true" /> : <Verdict ok={ok} />}
      <span className="ss-kicker">{label}</span>
      <h3 className="m3-name">{name || 'Not named yet'}</h3>
      {ok == null ? null : <span className="ss-tag" data-tone={ok ? 'success' : 'error'}>{ok ? 'Right' : 'Wrong'}</span>}
    </article>
  );

  const MysteryThree = ({ gid, session, sid, share, api }) => {
    const out = Ss.useOutcome('mystery', session);
    const P = window.PgMystery;
    const c = React.useMemo(() => P.read(session), [session]);
    const status = P.statusOf(session);
    const acc = c.acc, v = c.verdict;
    // A solve needs no verdict marks: the h1 has said it. Names and the scene only; the squares are for the loss.
    const solved = !!(acc && acc.right);
    const count = !acc || !v ? null : c.right === 3 ? 'You had all 3 right.' : 'You had ' + c.right + ' of 3 right.';
    return (
      <Ss.Page gid={gid}>
        <Ss.Head gid={gid} art="murder" label={out.label} date={session.date} h1={out.h1} mark={out.mark} stats={out.stats} />
        <div className="ss-body">
          {solved ? (
            <section className="ss-hero m3-hero m3-solved" aria-label="Your accusation">
              <div className="m3-names">
                {PARTS.map(([k, label]) => (
                  <div className="m3-name-block" key={k}>
                    <span className="ss-kicker">{label}</span>
                    <h3 className="m3-big">{nice(k, acc[k])}</h3>
                  </div>
                ))}
              </div>
              {P.scene(c) ? <p className="ss-caption m3-scene">{P.scene(c)}</p> : null}
            </section>
          ) : (
          <section className="ss-hero m3-hero" aria-label="Your accusation">
            <p className="m3-count">{count || (acc ? 'You named all three.' : status === 'ended' ? 'No accusation was made.' : 'One accusation to make.')}</p>
            <div className="m3-row">
              {PARTS.map(([k, label]) => (
                <Part key={k} label={label} name={acc ? nice(k, acc[k]) : null} ok={acc && v ? v[k] : null} state={acc ? 'named' : 'empty'} />
              ))}
            </div>
            {P.scene(c) ? <p className="ss-caption m3-scene">{P.scene(c)}</p> : null}
          </section>
          )}
          <aside className="ss-side">
            <Ss.ShareCard status={status} say={P.say(c)} lines={share.lines} gid={gid} session={session} sid={sid} api={api} />
          </aside>
        </div>
        <Ss.Record title={P.recordTitle} lines={session.lines} />
      </Ss.Page>
    );
  };

  pgOption('mystery', 3, {
    name: 'The accusation',
    stance: 'The verdict is three choices. On a loss, show each one, suspect, weapon and room, as right or wrong, and say how many you had; on a solve, name the three and stop, because the h1 has said it. Spoiler-safe reading: a missed part says Wrong and the page never prints the true answer; showing it after the case closes is the owner\'s call.',
    cost: 'Medium. Needs the engine to send which of the three parts were right (the seed carries it as `wrong`) and the setting and victim; the three names are on the record today.',
    Component: MysteryThree,
    shareText: (session) => window.SsOutcome.mystery(session).lines,
    css: `
      :scope .m3-hero { display: grid; gap: 16px; min-width: 0; }
      :scope .m3-count { margin: 0; font: var(--type-section-title); letter-spacing: var(--tracking-heading); text-wrap: balance; }
      :scope .m3-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; min-width: 0; }
      :scope .m3-part { padding: 10px; gap: 8px; justify-items: start; align-content: start; }
      :scope .m3-sq { box-sizing: border-box; width: 100%; aspect-ratio: 1; display: grid; place-items: center; border: 1px solid transparent; font: 700 28px/1 var(--font-text); }
      :scope .m3-sq.is-ok { background: var(--success); color: var(--success-on); }
      :scope .m3-sq.is-bad { background: var(--error); color: var(--error-on); }
      :scope .m3-sq.is-none, :scope .m3-sq.is-empty { background: transparent; border: 1.5px solid var(--ss-line); color: var(--muted); }
      :scope .m3-part.is-empty { background: transparent; box-shadow: none; border-style: dashed; }
      :scope .m3-name { margin: 0; font: var(--type-label); font-size: 15px; line-height: 1.25; letter-spacing: var(--tracking-heading); overflow-wrap: anywhere; text-wrap: balance; }
      :scope .m3-part:not(.is-empty) .m3-name { color: var(--text); }
      :scope .m3-part.is-empty .m3-name { color: var(--muted); font-weight: 400; }
      :scope .m3-part .ss-tag { margin-top: auto; }
      :scope .m3-scene { margin: 0; }
      :scope .ss-page[data-dist="middle"] .m3-hero { padding-top: 12px; }
      :scope .ss-page[data-dist="middle"] .m3-solved { border-top: 0; padding-top: 0; }
      :scope .m3-names { display: grid; grid-template-columns: minmax(0, 1fr); gap: 0; }
      :scope .m3-name-block { display: grid; gap: 4px; padding: 14px 0; border-top: 1px solid var(--ss-line); min-width: 0; }
      :scope .m3-big { margin: 0; font: var(--type-card-title); letter-spacing: var(--tracking-heading); overflow-wrap: anywhere; text-wrap: balance; }
      :scope .m3-solved .m3-name-block:first-child { border-top: 3px solid var(--ss-mark-1); }
      @container ss (min-width: 680px) {
        :scope .m3-names { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
        :scope .m3-name-block, :scope .m3-solved .m3-name-block:first-child { border-top: 3px solid var(--ss-mark-1); padding: 16px 0 0; }
        :scope .m3-big { font: var(--type-section-title); letter-spacing: var(--tracking-heading); }
        :scope .m3-row { gap: 16px; }
        :scope .m3-part { padding: 20px; gap: 12px; }
        :scope .m3-sq { max-width: 120px; }
        :scope .m3-name { font: var(--type-section-title); letter-spacing: var(--tracking-heading); }
      }
    `,
  });
})();
