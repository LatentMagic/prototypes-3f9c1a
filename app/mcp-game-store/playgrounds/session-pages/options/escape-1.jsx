// Session page, Escape, option 1: "Against the clock". Reads the play model from escape-model.jsx (window.EsModel), which loads first.
(function () {
  // ---------------------------------------------------------------- Option 1
  const OptionOne = ({ gid, session, sid, share, api }) => {
    const m = React.useMemo(() => EsModel.build(session), [session]);
    const out = m.out;
    const sub = m.done && m.forced ? EsModel.plural(m.forced, 'lock forced', 'locks forced') : null;
    const say = m.openCount ? EsModel.plural(m.openCount, 'lock', 'locks') + ' open.' : 'No lock open yet.';
    return (
      <Ss.Page gid={gid}>
        <Ss.Head gid={gid} art="escape" label={out.label} date={session.date} h1={out.h1} mark="" stats={out.stats} sub={sub} />
        <div className="ss-body">
          <section className="ss-hero ss-surface" aria-label="Your time against par">
            {m.done ? <Chart m={m} /> : <Open m={m} />}
          </section>
          <aside className="ss-side">
            <Ss.ShareCard status={m.status} say={say} lines={share.lines} gid={gid} session={session} sid={sid} api={api} />
          </aside>
        </div>
        <Ss.Record title={session.listTitle} lines={session.lines} />
      </Ss.Page>
    );
  };

  // A room still being played shows no clock (the spec: no clock runs in play) and never says how many locks remain.
  const Open = ({ m }) => (
    <div className="es1-open">
      <p className="ss-kicker">So far</p>
      <h2 className="ss-card-title">{m.openCount ? EsModel.plural(m.openCount, 'lock', 'locks') + ' open' : 'No lock open yet'}</h2>
      {m.locks.length ? <ul className="es1-names">{m.locks.map((lk) => <li key={lk.key}>{lk.name}</li>)}</ul> : null}
      <p className="ss-caption">Time against par shows once you are out.</p>
    </div>
  );

  const Chart = ({ m }) => {
    const hasPar = m.par != null, max = Math.max(m.min, hasPar ? m.par : 0) * 1.04;
    const pct = (x) => (x / max) * 100;
    const flip = (x) => pct(x) > 62;
    return (
      <div className="es1-wrap">
        <div className="es1-chart" role="img" aria-label={'Escaped at minute ' + m.min + (hasPar ? ' against a par of ' + m.par : '') + '. Locks opened at minutes ' + m.locks.map((l) => l.minute).join(', ') + '.'}>
          {hasPar ? <span className="es1-parline" style={{ left: pct(m.par) + '%' }} /> : null}
          {hasPar ? <span className="es1-parlab" data-flip={flip(m.par) ? 1 : 0} style={{ left: pct(m.par) + '%' }}>Par {m.par} min</span> : null}
          <div className="es1-track"><div className="es1-fill" style={{ width: pct(m.min) + '%' }} /></div>
          {m.locks.map((lk) => <span key={lk.key} className="es1-tick" style={{ left: pct(lk.minute) + '%' }} />)}
          {m.locks.map((lk) => (
            <span key={'m' + lk.key} className="es1-mk" data-row={lk.index % 2} data-flip={flip(lk.minute) ? 1 : 0} style={{ left: pct(lk.minute) + '%' }}>
              <EsModel.Num n={lk.index} size={22} />
              <em>{EsModel.shortName(lk)}</em>
            </span>
          ))}
          <span className="es1-out" style={{ left: pct(m.min) + '%' }}>Out {m.min} min</span>
        </div>
        <ol className="es1-rows" aria-label="Locks in the order they opened">
          {m.locks.map((lk) => (
            <li key={lk.key} className="es1-row">
              <EsModel.Num n={lk.index} size={28} />
              <div>
                <p className="es1-rname">{lk.name}</p>
                <p className="ss-caption">{'Minute ' + lk.minute + ' · ' + EsModel.lockFacts(lk)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    );
  };

  pgOption('escape', 1, {
    name: 'Against the clock',
    stance: 'The only score in Escape is time against par, so draw the minutes: one bar, par marked, a tick where each lock gave way.',
    cost: 'Needs the engine to send the minute each lock opened and each hint was taken, wrong tries per lock, and the room’s par; the seed derives them from the moves. Time and par show only once out.',
    Component: OptionOne,
    shareText: (session) => window.SsOutcome.escape(session).lines,
    css: EsModel.numCss + `
      :scope .es1-wrap { display: grid; gap: 16px; }
      :scope .es1-chart { position: relative; height: 140px; margin: 0 4px; }
      :scope .es1-parline { position: absolute; top: 18px; height: 70px; width: 0; border-left: 2px dashed var(--muted); transform: translateX(-1px); }
      :scope .es1-parlab { position: absolute; top: 0; font: var(--type-small); color: var(--muted); padding-left: 6px; white-space: nowrap; }
      :scope .es1-parlab[data-flip="1"] { transform: translateX(-100%); padding: 0 6px 0 0; }
      :scope .es1-track { position: absolute; left: 0; right: 0; top: 30px; height: 36px; background: var(--ss-cell); border: 1px solid var(--ss-cell-line); }
      :scope .es1-fill { height: 100%; background: var(--ss-mark-3); opacity: .55; }
            :scope .es1-tick { position: absolute; top: 26px; height: 44px; width: 3px; background: var(--ss-mark-1); transform: translateX(-1.5px); }
      :scope .es1-mk { position: absolute; top: 76px; display: flex; align-items: center; gap: 6px; transform: translateX(-11px); }
      :scope .es1-mk[data-flip="1"] { flex-direction: row-reverse; transform: translateX(calc(-100% + 11px)); }
            :scope .es1-mk em { display: none; font: var(--type-caption); font-style: normal; color: var(--text); white-space: nowrap; }
      :scope .es1-out { position: absolute; top: 112px; font: var(--type-small); color: var(--text); white-space: nowrap; transform: translateX(-100%); padding-right: 0; }
      :scope .es1-rows { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
      :scope .es1-row { display: grid; grid-template-columns: 28px minmax(0, 1fr); gap: 12px; align-items: start; }
            :scope .es1-rname { margin: 0; font: var(--type-body); font-weight: 600; }
      :scope .es1-row .ss-caption { margin: 2px 0 0; }
      :scope .es1-open { display: grid; gap: 8px; }
      :scope .es1-open .ss-kicker, :scope .es1-open .ss-caption { margin: 0; }
      :scope .es1-names { margin: 0; padding: 0; list-style: none; display: grid; gap: 4px; font: var(--type-body); }
      @container ss (min-width: 680px) {
        :scope .es1-chart { height: 168px; }
        :scope .es1-mk em { display: inline; }
        :scope .es1-mk[data-row="0"] { top: 100px; }
        :scope .es1-out { top: 140px; }
        :scope .es1-rows { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 24px; }
      }
    `,
  });
})();
