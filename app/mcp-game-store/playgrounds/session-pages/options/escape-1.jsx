// Session page, Escape, option 1: "Against the clock". Reads the play model from escape-model.jsx (window.EsModel), which loads first.
(function () {
  // ---------------------------------------------------------------- Option 1
  const OptionOne = ({ gid, session, sid, share, api, element, layout }) => {
    const m = React.useMemo(() => EsModel.build(session), [session]);
    const out = m.out;
    const sub = m.done && m.forced ? EsModel.plural(m.forced, 'lock forced', 'locks forced') : null;
    const say = m.openCount ? EsModel.plural(m.openCount, 'lock', 'locks') + ' open.' : 'No lock open yet.';
    return (
      <Ss.Page gid={gid}>
        <Ss.Head gid={gid} art="escape" label={out.label} date={session.date} h1={out.h1} mark="" stats={out.stats} sub={sub} />
        <div className="ss-body">
          <section className="ss-hero ss-surface" aria-label="Your time against par">
            {m.done ? <Chart m={m} element={element} ia={layout === 'ia'} /> : <Open m={m} />}
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

  // Game: the bar as a corridor. A door in the wall at each minute a lock gave way (odd locks in the top wall, even in the bottom, so near minutes never collide),
  // par as a doorframe across the corridor, your time as the amber line walking to the end. Every mark is one recorded fact: minute of each lock (S), par, time.
  const Corridor = ({ m }) => {
    const ref = React.useRef(null);
    const W0 = EsModel.useWidth(ref), W = Math.min(W0, 720);
    const hasPar = m.par != null;
    const padX = 20, yT = 44, yB = 100, H = 144, yM = 72;
    const max = Math.max(m.min, hasPar ? m.par : 0) * 1.04, x = (t) => padX + ((W - 2 * padX) * t) / max;
    const gap = 16, doors = m.locks.map((lk) => ({ lk, x: x(lk.minute), top: lk.index % 2 === 1 }));
    const wallPath = (top) => {
      const ds = doors.filter((d) => d.top === top).sort((a, b) => a.x - b.x);
      let d = 'M' + padX + ' ' + (top ? yT : yB), at = padX;
      ds.forEach((q) => { d += 'H' + Math.max(at, q.x - gap / 2) + 'M' + (q.x + gap / 2) + ' ' + (top ? yT : yB); at = q.x + gap / 2; });
      return d + 'H' + (W - padX);
    };
    return (
      <figure className="es1-fig">
        <div className="es-pic es1-pic" ref={ref} style={W ? null : { minHeight: H }}>
          {W ? (
            <div className="es1-corr" style={{ width: W, height: H }} role="img" aria-label={'Escaped at minute ' + m.min + (hasPar ? ' against a par of ' + m.par : '') + '. Doors opened at minutes ' + m.locks.map((l) => l.minute).join(', ') + '.'}>
              <svg width={W} height={H} viewBox={'0 0 ' + W + ' ' + H} aria-hidden="true">
                <path className="es-wall" d={wallPath(true)} />
                <path className="es-wall" d={wallPath(false)} />
                <path className="es-wall" d={'M' + padX + ' ' + yT + 'V' + yB} />
                {doors.map((d) => (
                  <path key={d.lk.key} className="es-leaf" d={'M' + (d.x - gap / 2) + ' ' + (d.top ? yT : yB) + 'l' + (-13) + ' ' + (d.top ? -13 : 13)} />
                ))}
                {hasPar ? <path className="es-leaf es1-frame" d={'M' + (x(m.par) - 6) + ' ' + yT + 'V' + yB + 'M' + (x(m.par) + 6) + ' ' + yT + 'V' + yB} /> : null}
                <path className="es-route" d={'M' + padX + ' ' + yM + 'H' + (x(m.min) - 6)} />
                <polygon className="es-arrow" points={(x(m.min) - 8) + ',' + (yM - 6) + ' ' + (x(m.min) - 8) + ',' + (yM + 6) + ' ' + (x(m.min) + 4) + ',' + yM} />
              </svg>
              {doors.map((d) => (
                <span key={d.lk.key} className="es1-dn" style={{ left: d.x - 11, top: d.top ? yT - 34 : yB + 10 }}><EsModel.Num n={d.lk.index} size={22} /></span>
              ))}
              {hasPar ? <span className="es1-pl" style={{ right: W - x(m.par) + 12, top: yT + 6 }}>{'Par ' + m.par + ' min'}</span> : null}
              <span className="es1-ol" style={{ right: Math.max(W - x(m.min) + 10, 4), top: yM + 8 }}>{'Out ' + m.min + ' min'}</span>
            </div>
          ) : null}
        </div>
      </figure>
    );
  };

  const Chart = ({ m, element, ia }) => {
    const hasPar = m.par != null, max = Math.max(m.min, hasPar ? m.par : 0) * 1.04;
    const pct = (x) => (x / max) * 100;
    const flip = (x) => pct(x) > 62;
    const game = element === 'game';
    return (
      <div className="es1-wrap">
        {game ? <Corridor m={m} /> : (
        <div className="es1-chart" role="img" aria-label={'Escaped at minute ' + m.min + (hasPar ? ' against a par of ' + m.par : '') + '. Locks opened at minutes ' + m.locks.map((l) => l.minute).join(', ') + '.'}>
          {hasPar ? <span className="es1-parline" style={{ left: pct(m.par) + '%' }} /> : null}
          {hasPar ? <span className="es1-parlab" data-flip={flip(m.par) ? 1 : 0} style={{ left: pct(m.par) + '%' }}>Par {m.par} min</span> : null}
          <div className="es1-track"><div className="es1-fill" style={{ width: pct(m.min) + '%' }} /></div>
          {m.locks.map((lk) => <span key={lk.key} className="es1-tick" data-state={EsModel.lockState(lk)} style={{ left: pct(lk.minute) + '%' }} />)}
          {m.locks.map((lk) => (
            <span key={'m' + lk.key} className="es1-mk" data-row={lk.index % 2} data-flip={flip(lk.minute) ? 1 : 0} style={{ left: pct(lk.minute) + '%' }}>
              <EsModel.Num n={lk.index} size={22} />
              <em>{EsModel.shortName(lk)}</em>
            </span>
          ))}
          <span className="es1-out" style={{ left: pct(m.min) + '%' }}>Out {m.min} min</span>
        </div>
        )}
        {ia ? (
          <ol className="es1-rows es1-iarows" aria-label="Locks in the order they opened">
            {m.locks.map((lk) => (
              <li key={lk.key} className="es1-irow">
                <EsModel.Num n={lk.index} size={24} />
                <span className="es1-rname">{EsModel.shortName(lk)}</span>
                <span className="es1-ipips">{lk.hints.length ? <EsModel.SqPips n={Math.max.apply(null, lk.hints)} /> : null}</span>
                <span className="es1-itries">{lk.wrong ? '×' + lk.wrong : ''}</span>
              </li>
            ))}
          </ol>
        ) : (
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
        )}
      </div>
    );
  };

  pgOption('escape', 1, {
    name: 'Against the clock',
    stance: 'The only score in Escape is time against par, so draw the minutes: one bar, par marked, a tick where each lock gave way. The tick caption rows give way to one line per lock in the IA pass; at Between the ticks are the cover’s doors; at Game the bar is a corridor with a door where each lock opened.',
    cost: 'Needs the engine to send the minute each lock opened and each hint was taken, wrong tries per lock, and the room’s par; the seed derives them from the moves. Time and par show only once out. IA pass: the caption rows become one line per lock, its number, name, hint squares and wrong tries. Between: each tick becomes the cover’s teal door with an amber knob and par a solid line. Game: the bar is a corridor, a door in the wall at the minute each lock gave way, par a doorframe, your time the amber line walking out. Corridor marks use the same seeded minutes; nothing new is sent.',
    elements: ['store', 'between', 'game'],
    layouts: ['built', 'ia'],
    Component: OptionOne,
    shareText: (session) => window.SsOutcome.escape(session).lines,
    css: EsModel.numCss + EsModel.planCss + `
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

      /* IA pass: one line per lock */
      :scope .es1-iarows { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
      :scope .es1-irow { display: grid; grid-template-columns: 24px minmax(0, 1fr) 34px 28px; align-items: center; gap: 12px; min-height: 28px; font: var(--type-body); }
      :scope .es1-irow .es1-rname { font-weight: 600; min-width: 0; }
      :scope .es1-ipips .es-sqp { color: var(--text); }
      :scope .es1-itries { font: var(--type-small); color: var(--muted); text-align: right; font-variant-numeric: tabular-nums; }
      /* Between: the cover's door for each tick; par a solid line */
      :scope .ss-page[data-element="between"] .es1-parline { border-left: 2px solid var(--cover-cream); }
      :scope .ss-page[data-element="between"] .es1-tick { width: 12px; transform: translateX(-6px); background: var(--cover-teal); }
      :scope .ss-page[data-element="between"] .es1-tick::after { content: ''; position: absolute; right: 1px; top: 28px; width: 6px; height: 6px; background: var(--cover-amber); }
      :scope .ss-page[data-element="between"] .es1-tick[data-state="forced"]::after { background: var(--cover-orange); }
      /* Game: the corridor */
      :scope .es1-fig { margin: 0; }
      :scope .es1-pic { min-width: 0; }
      :scope .es1-corr { position: relative; flex: none; }
      :scope .es1-corr svg { position: absolute; inset: 0; display: block; }
      :scope .es1-dn { position: absolute; line-height: 0; }
      :scope .es1-dn .es-num { background: var(--cover-bg-indigo); border-color: var(--cover-cream); color: var(--cover-cream); }
      :scope .es1-pl, :scope .es1-ol { position: absolute; white-space: nowrap; font: 600 13px/16px var(--font-text); color: var(--cover-cream); }
      :scope .es1-pl { color: color-mix(in srgb, var(--cover-cream) 80%, var(--cover-bg-indigo)); }
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
