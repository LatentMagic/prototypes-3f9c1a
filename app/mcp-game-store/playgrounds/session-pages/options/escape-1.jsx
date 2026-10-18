// Session page, Escape, option 1: "Against the clock". Also holds the Escape play model (window.EsModel) that options 2 and 3 read at render time.
// The model reads the seed's move lines the way the engine's events would project them. Everything it derives that today's record does not send is S:
// per-lock open minute and hint minute (seeded here from the move's place in the play), locks found, tries and hint rungs per lock.
(function () {
  const cap = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);
  const norm = (s) => String(s).toLowerCase().replace(/^the\s+/, '').trim();
  // The first n sentences of a text, with a closing quote restored when the cut falls inside one.
  const sentences = (t, n) => {
    const parts = String(t || '').split(/(?<=[.!?])\s+(?=[A-Z“"])/);
    let out = parts.slice(0, n).join(' ');
    if ((out.match(/“/g) || []).length > (out.match(/”/g) || []).length) out += '”';
    return out;
  };
  const plural = (n, a, b) => n + ' ' + (n === 1 ? a : b);

  // build(session) -> the play as the three options need it.
  function build(session) {
    const out = window.SsOutcome.escape(session);
    const lines = session.lines || [];
    const locks = {}, lockOrder = [], objects = [], hints = [], moves = [];
    let lastOpened = null, lastMove = 0;
    const lockFor = (name) => {
      const key = norm(name);
      if (!locks[key]) { locks[key] = { key, name: 'The ' + key, tries: 0, wrong: 0, hints: [], openedN: null, contents: '', exit: false, gave: null, forced: null, obj: null }; lockOrder.push(locks[key]); }
      return locks[key];
    };
    lines.forEach((l) => {
      const label = l[0], what = l[1] || '', res = l[2] || '';
      const mv = /^Move (\d+)$/.exec(label);
      if (mv) {
        const n = Number(mv[1]); lastMove = n; moves.push(n);
        let m;
        if ((m = /^Examine (.+)$/.exec(what))) {
          const key = norm(m[1]);
          if (!objects.some((o) => o.key === key)) objects.push({ key, name: cap(m[1]), desc: res, n });
        } else if ((m = /^Try an answer \(.+\) on (.+)$/.exec(what)) || (m = /^Set (the .+?) to /.exec(what))) {
          const lk = lockFor(m[1]); lk.tries++;
          if (res === 'Wrong') lk.wrong++; else { lk.openedN = n; lk.exit = res === 'Out'; lk.contents = res === 'Out' ? '' : res; lastOpened = lk; }
        } else if ((m = /^Force (.+?) with (.+)$/.exec(what))) {
          const lk = lockFor(m[1]); lk.openedN = n; lk.forced = m[2]; lastOpened = lk;
        }
      } else if (label === 'Hint') {
        const lk = lockFor(what);
        const rung = /given outright|^The answer/i.test(res) ? 3 : Math.min(2, lk.hints.length + 1);
        lk.hints.push(rung); hints.push({ lock: lk, rung, after: lastMove });
      } else if (label === 'Item' && lastOpened && lastOpened.openedN === lastMove) {
        lastOpened.gave = what;
      }
    });
    // Which object a lock sits on: the object whose last word the lock's name carries (content: locks[].on).
    lockOrder.forEach((lk) => {
      const o = objects.find((ob) => lk.key.split(' ').indexOf(ob.key.split(' ').pop()) >= 0);
      lk.obj = o ? o.key : null;
    });
    const live = !!session.live, ended = !!session.unfinished;
    const min = out.min, par = out.par, done = !live && !ended;
    const opened = lockOrder.filter((lk) => lk.openedN != null).sort((a, b) => a.openedN - b.openedN);
    // S: the minute a move fell on, seeded from its place in the play (the engine has each event's time).
    const at = (n) => (done && lastMove ? Math.max(1, Math.round(min * n / lastMove)) : null);
    opened.forEach((lk, i) => {
      lk.minute = at(lk.openedN);
      const prev = i ? opened[i - 1].openedN : 0;
      lk.between = moves.filter((n) => n > prev && n < lk.openedN).length;
      lk.index = i + 1;
    });
    hints.forEach((h) => { h.minute = at(h.after); });
    const exitLock = opened.find((lk) => lk.exit) || null;
    const sum = (f) => lockOrder.reduce((a, lk) => a + f(lk), 0);
    return { out, live, ended, done, min, par, over: done && min > par, lastMove, locks: opened, allLocks: lockOrder, objects, hints, exitLock,
      exitObj: exitLock ? exitLock.obj : null, wrong: sum((lk) => lk.wrong), hintCount: hints.length, forced: opened.filter((lk) => lk.forced).length,
      status: ended ? 'ended' : live ? 'live' : 'done', openCount: opened.length };
  }
  const triesText = (lk) => (lk.tries <= 1 ? 'First try' : lk.tries + ' tries');
  const lockFacts = (lk) => [triesText(lk)].concat(lk.hints.length ? [plural(lk.hints.length, 'hint', 'hints')] : []).concat(lk.forced ? ['Forced with ' + lk.forced] : []).join(' · ');
  const shortName = (lk) => lk.name.replace(/^The /, '');
  window.EsModel = { build, sentences, plural, triesText, lockFacts, shortName, cap };

  // ---------------------------------------------------------------- Option 1
  const OptionOne = ({ gid, session, sid, share, api }) => {
    const m = React.useMemo(() => build(session), [session]);
    const out = m.out;
    const stats = m.done ? [{ label: 'Hints', value: m.hintCount ? String(m.hintCount) : 'None' }, { label: 'Wrong tries', value: String(m.wrong) }] : null;
    const sub = m.done && m.forced ? plural(m.forced, 'lock forced', 'locks forced') : null;
    const say = m.openCount ? plural(m.openCount, 'lock', 'locks') + ' open.' : 'No lock open yet.';
    return (
      <Ss.Page gid={gid}>
        <Ss.Head gid={gid} art="escape" label={out.label} date={session.date} h1={out.h1} mark="" stats={stats} sub={sub} />
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
      <h2 className="ss-card-title">{m.openCount ? plural(m.openCount, 'lock', 'locks') + ' open' : 'No lock open yet'}</h2>
      {m.locks.length ? <ul className="es1-names">{m.locks.map((lk) => <li key={lk.key}>{lk.name}</li>)}</ul> : null}
      <p className="ss-caption">Time against par shows once you are out.</p>
    </div>
  );

  const Chart = ({ m }) => {
    const max = Math.max(m.min, m.par) * 1.04;
    const pct = (x) => (x / max) * 100;
    const flip = (x) => pct(x) > 62;
    return (
      <div className="es1-wrap">
        <div className="es1-chart" role="img" aria-label={'Escaped at minute ' + m.min + ' against a par of ' + m.par + '. Locks opened at minutes ' + m.locks.map((l) => l.minute).join(', ') + '.'}>
          <span className="es1-parline" style={{ left: pct(m.par) + '%' }} />
          <span className="es1-parlab" data-flip={flip(m.par) ? 1 : 0} style={{ left: pct(m.par) + '%' }}>Par {m.par} min</span>
          <div className="es1-track"><div className="es1-fill" style={{ width: pct(m.min) + '%' }} /></div>
          {m.hints.map((h, i) => <span key={'h' + i} className="es1-hint" style={{ left: pct(h.minute) + '%' }} title={'Hint at minute ' + h.minute} />)}
          {m.locks.map((lk) => <span key={lk.key} className="es1-tick" style={{ left: pct(lk.minute) + '%' }} />)}
          {m.locks.map((lk) => (
            <span key={'m' + lk.key} className="es1-mk" data-row={lk.index % 2} data-flip={flip(lk.minute) ? 1 : 0} style={{ left: pct(lk.minute) + '%' }}>
              <Ss.Cells rows={[[{ t: String(lk.index), k: 'mark1' }]]} label={'Lock ' + lk.index} />
              <em>{EsModel.shortName(lk)}</em>
            </span>
          ))}
          <span className="es1-out" style={{ left: pct(m.min) + '%' }}>Out {m.min} min</span>
        </div>
        <p className="ss-legend">Squares above the bar are hints taken. Numbered ticks are locks opening.</p>
        <ol className="es1-rows">
          {m.locks.map((lk) => (
            <li key={lk.key} className="es1-row">
              <Ss.Cells rows={[[{ t: String(lk.index), k: 'mark1' }]]} label={'Lock ' + lk.index} />
              <div>
                <p className="es1-rname">{lk.name}</p>
                <p className="ss-caption">{'Minute ' + lk.minute + ' · ' + EsModel.lockFacts(lk)}</p>
              </div>
            </li>
          ))}
        </ol>
        {m.out.second ? <p className="ss-caption">You found the second room.</p> : null}
      </div>
    );
  };

  pgOption('escape', 1, {
    name: 'Against the clock',
    stance: 'The only score in Escape is time against par, so draw the minutes: one bar, par marked, a tick where each lock gave way.',
    cost: 'Needs the engine to send the minute each lock opened and each hint was taken, wrong tries per lock, and the room’s par; the seed derives them from the moves. Time and par show only once out.',
    Component: OptionOne,
    shareText: (session) => window.SsOutcome.escape(session).lines,
    css: `
      :scope .es1-wrap { display: grid; gap: 16px; }
      :scope .es1-chart { position: relative; height: 128px; margin: 0 4px; }
      :scope .es1-parline { position: absolute; top: 18px; height: 44px; width: 0; border-left: 2px dashed var(--muted); transform: translateX(-1px); }
      :scope .es1-parlab { position: absolute; top: 0; font: var(--type-small); color: var(--muted); padding-left: 6px; white-space: nowrap; }
      :scope .es1-parlab[data-flip="1"] { transform: translateX(-100%); padding: 0 6px 0 0; }
      :scope .es1-track { position: absolute; left: 0; right: 0; top: 44px; height: 18px; background: var(--ss-cell); border: 1px solid var(--ss-cell-line); }
      :scope .es1-fill { height: 100%; background: var(--ss-mark-3); opacity: .55; }
      :scope .es1-hint { position: absolute; top: 26px; width: 10px; height: 10px; background: var(--ss-mark-2); transform: translateX(-5px); }
      :scope .es1-tick { position: absolute; top: 40px; height: 26px; width: 3px; background: var(--ss-mark-1); transform: translateX(-1.5px); }
      :scope .es1-mk { position: absolute; top: 70px; display: flex; align-items: center; gap: 6px; transform: translateX(-10px); }
      :scope .es1-mk[data-flip="1"] { flex-direction: row-reverse; transform: translateX(calc(-100% + 10px)); }
      :scope .es1-mk .ss-cells { --c: 20px; }
      :scope .es1-mk .ss-cell { font-size: 12px; }
      :scope .es1-mk em { display: none; font: var(--type-caption); font-style: normal; color: var(--text); white-space: nowrap; }
      :scope .es1-out { position: absolute; top: 100px; font: var(--type-small); color: var(--text); white-space: nowrap; transform: translateX(-100%); padding-right: 0; }
      :scope .es1-rows { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
      :scope .es1-row { display: grid; grid-template-columns: 26px minmax(0, 1fr); gap: 12px; align-items: start; }
      :scope .es1-row .ss-cells { --c: 26px; }
      :scope .es1-row .ss-cell { font-size: 13px; }
      :scope .es1-rname { margin: 0; font: var(--type-body); font-weight: 600; }
      :scope .es1-row .ss-caption { margin: 2px 0 0; }
      :scope .es1-open { display: grid; gap: 8px; }
      :scope .es1-open .ss-kicker, :scope .es1-open .ss-caption { margin: 0; }
      :scope .es1-names { margin: 0; padding: 0; list-style: none; display: grid; gap: 4px; font: var(--type-body); }
      @container ss (min-width: 680px) {
        :scope .es1-chart { height: 150px; }
        :scope .es1-mk em { display: inline; }
        :scope .es1-mk[data-row="0"] { top: 94px; }
        :scope .es1-out { top: 126px; }
        :scope .es1-rows { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 24px; }
      }
    `,
  });
})();
