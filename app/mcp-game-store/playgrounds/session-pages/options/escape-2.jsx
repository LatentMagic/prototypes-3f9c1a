// Session page, Escape, option 2: "The room". The player never sees the room, so draw it from the objects they examined and the locks they found on each.
// Reads the play model from escape-model.jsx (window.EsModel), which loads first.
(function () {
  const Rungs = ({ n }) => (
    <Ss.Cells className="es2-rungs" label={'Hints taken: rung ' + n + ' of 3'}
      rows={[[1, 2, 3].map((r) => ({ t: '', k: r <= n ? 'mark1' : 'empty' }))]} />
  );

  // One lock on a tile: opened (a tick) or still locked, what it took, the hints it needed, what it gave.
  const LockLine = ({ lk, move }) => {
    const open = lk.openedN != null, top = lk.hints.length ? Math.max.apply(null, lk.hints) : 0;
    return (
      <div className="es2-lock">
        <p className="es2-lname">
          {open ? <span className="es2-tick"><DS.Icon name="check" size={16} /></span> : null}
          <span>{open ? lk.name : lk.name + ' · still locked'}</span>
        </p>
        <p className="ss-caption">
          {(open ? 'Opened at move ' + lk.openedN + ' · ' : '') + EsModel.triesText(lk)}
          {lk.forced ? ' · forced with ' + lk.forced : ''}
        </p>
        {top ? <div className="es2-hintrow"><Rungs n={top} /><span className="ss-caption">{EsModel.plural(lk.hints.length, 'hint', 'hints')}</span></div> : null}
        {lk.gave ? <p className="ss-caption es2-gave">{'Gave you: the ' + lk.gave.toLowerCase()}</p> : null}
      </div>
    );
  };

  const Tile = ({ o, m }) => {
    const here = m.allLocks.filter((lk) => lk.obj === o.key);
    return (
      <Ss.Card className="es2-tile" kicker={'Move ' + o.n} title={o.name}>
        <p className="es2-desc">{EsModel.sentences(o.desc, 1)}</p>
        {here.map((lk) => <LockLine key={lk.key} lk={lk} />)}
      </Ss.Card>
    );
  };

  const Door = ({ m }) => {
    const lk = m.exitLock;
    return (
      <Ss.Card className="es2-tile es2-door" kicker="The way out" title={'You got out at ' + m.min + ' min'}>
        <div className="es2-doorrow">
          <span className="es2-knob" aria-hidden="true" />
          <div>
            <p className="es2-lname"><span className="es2-tick"><DS.Icon name="check" size={16} /></span><span>{lk.name}</span></p>
            <p className="ss-caption">{'Opened at move ' + lk.openedN + ' · ' + EsModel.lockFacts(lk) + (m.par != null ? ' · par ' + m.par + ' min' : '')}</p>
          </div>
        </div>
      </Ss.Card>
    );
  };

  const OptionTwo = ({ gid, session, sid, share, api }) => {
    const m = React.useMemo(() => EsModel.build(session), [session]);
    const out = m.out;
    const sub = m.done && m.forced ? EsModel.plural(m.forced, 'lock forced', 'locks forced') : null;
    const say = m.openCount ? EsModel.plural(m.openCount, 'lock', 'locks') + ' open.' : 'No lock open yet.';
    const tiles = m.objects.filter((o) => !(m.done && m.exitLock && o.key === m.exitObj));
    return (
      <Ss.Page gid={gid}>
        <Ss.Head gid={gid} art="escape" label={out.label} date={session.date} h1={out.h1} mark="" stats={out.stats} sub={sub} />
        <div className="ss-body">
          <section className="ss-hero ss-surface" aria-label="The room as you found it">
            <p className="es2-lead">{m.done ? 'The room as you found it' : 'The room so far'}</p>
            <div className="es2-grid">
              {tiles.map((o) => <Tile key={o.key} o={o} m={m} />)}
              {m.done && m.exitLock ? <Door m={m} /> : null}
            </div>
          </section>
          <aside className="ss-side">
            <Ss.ShareCard status={m.status} say={say} lines={share.lines} gid={gid} session={session} sid={sid} api={api} />
          </aside>
        </div>
        <Ss.Record title={session.listTitle} lines={session.lines} />
      </Ss.Page>
    );
  };

  pgOption('escape', 2, {
    name: 'The room',
    stance: 'The player never sees the room, so draw it: a tile for each object they examined, the locks they found on it, and the door last.',
    cost: 'Needs the engine to send which lock sits on which object, tries and hint rungs per lock, and what a lock gave; the seed reads them from the moves and the room’s content. Objects never examined are absent.',
    Component: OptionTwo,
    shareText: (session) => window.SsOutcome.escape(session).lines,
    css: `
      :scope .es2-lead { margin: 0; font: var(--type-label); color: var(--muted); }
      :scope .es2-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
      :scope .es2-tile { background: var(--ss-cell); border: 1px solid var(--ss-cell-line); box-shadow: none; padding: 12px; gap: 8px; }
      :scope .es2-tile .ss-card-title { font: var(--type-label); font-size: 16px; }
      :scope .es2-desc { margin: 0; font: var(--type-caption); color: var(--muted); }
      :scope .es2-lock { display: grid; gap: 2px; padding-top: 8px; border-top: 1px solid var(--ss-line); }
      :scope .es2-lname { margin: 0; display: flex; gap: 6px; align-items: flex-start; font: var(--type-small); }
      :scope .es2-tick { display: inline-flex; flex: none; color: var(--ss-mark-1); margin-top: 0; }
      :scope .es2-tile .ss-caption { margin: 0; }
      :scope .es2-hintrow { display: flex; align-items: center; gap: 8px; margin-top: 2px; }
      :scope .es2-rungs.ss-cells { --c: 10px; gap: 3px; }
      :scope .es2-rungs .ss-cells-row { gap: 3px; }
      :scope .es2-rungs .ss-cell { border-radius: 0; }
      :scope .es2-gave { color: var(--text); }
      :scope .es2-door { grid-column: 1 / -1; border-left: 6px solid var(--ss-mark-1); padding: 16px; }
      :scope .es2-door .ss-card-title { font: var(--type-section-title); }
      :scope .es2-doorrow { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
      :scope .es2-doorrow > div { display: grid; gap: 4px; }
      :scope .es2-knob { order: 2; flex: none; width: 12px; height: 12px; background: var(--ss-mark-2); margin-top: 4px; }
      @container ss (min-width: 680px) {
        :scope .es2-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
        :scope .es2-tile { padding: 16px; }
        :scope .es2-desc { font: var(--type-body); color: var(--muted); }
      }
      /* Middle: on a phone the room runs edge to edge, a place on the page rather than a card on it. */
      @container ss (max-width: 679px) { :scope .ss-page[data-dist="middle"] .ss-hero { margin-inline: -16px; border-inline: 0; padding-inline: 16px; padding-block: 20px; } }
      @container ss (min-width: 680px) { :scope .ss-page[data-dist="middle"] .ss-hero { padding: 24px; gap: 16px; } }
      /* Middle and Far: the room takes the game's own marks. */
      :scope .ss-page:not([data-dist="near"]) .es2-door { border-left-color: var(--ss-mark-1); }
    `,
  });
})();
