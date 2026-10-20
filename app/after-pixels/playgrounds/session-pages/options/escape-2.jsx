// Session page, Escape, option 2: "The room". The player never sees the room, so draw it from the objects they examined and the locks they found on each.
// Reads the play model from escape-model.jsx (window.EsModel), which loads first.
(function () {
  const Rungs = ({ n }) => (
    <Ss.Cells className="es2-rungs" label={'Hints taken: rung ' + n + ' of 3'}
      rows={[[1, 2, 3].map((r) => ({ t: '', k: r <= n ? 'mark1' : 'empty' }))]} />
  );

  // One lock on a tile: opened (a tick) or still locked, what it took, the hints it needed, what it gave.
  const LockLine = ({ lk, move, between }) => {
    const open = lk.openedN != null, top = lk.hints.length ? Math.max.apply(null, lk.hints) : 0;
    return (
      <div className="es2-lock">
        <p className="es2-lname">
          {open && !between ? <span className="es2-tick"><DS.Icon name="check" size={16} /></span> : null}
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

  // IA pass: a lock is its name and state, its rungs and tries. Nothing that reads as a sentence.
  const LockLineIa = ({ lk, between }) => {
    const st = EsModel.lockState(lk);
    return (
      <div className="es2-lock">
        <p className="es2-lname">
          {!between && st !== 'shut' ? <span className="es2-tick"><DS.Icon name="check" size={16} /></span> : null}
          <span>{lk.name + (st === 'shut' ? ' · still locked' : '') + (st === 'forced' ? ' · forced' : '')}</span>
        </p>
        <div className="es2-hintrow">
          {lk.hints.length ? (between ? <span className="es2-sq"><EsModel.SqPips n={Math.max.apply(null, lk.hints)} /></span> : <Rungs n={Math.max.apply(null, lk.hints)} />) : null}
          <span className="ss-caption">{EsModel.triesText(lk)}</span>
        </div>
        {lk.gave ? <span className="es2-chip">{'Gave · ' + lk.gave}</span> : null}
      </div>
    );
  };

  // Between: the cover's door down the tile's left edge, one amber knob per lock (filled opened, outline not opened, a bar across it forced).
  const Band = ({ here }) => (
    <span className="es2-band" aria-hidden="true">
      {here.map((lk) => <i key={lk.key} className="es2-knob2" data-state={EsModel.lockState(lk)} />)}
    </span>
  );

  const Tile = ({ o, m, ia, between }) => {
    const here = m.allLocks.filter((lk) => lk.obj === o.key);
    const banded = between && here.length;
    return (
      <Ss.Card className={'es2-tile' + (banded ? ' es2-banded' : '')} kicker={ia ? null : 'Move ' + o.n} title={o.name}>
        {banded ? <Band here={here} /> : null}
        {ia ? null : <p className="es2-desc">{EsModel.sentences(o.desc, 1)}</p>}
        {here.map((lk) => (ia ? <LockLineIa key={lk.key} lk={lk} between={between} /> : <LockLine key={lk.key} lk={lk} between={between} />))}
        {ia ? <details className="es2-more"><summary>What it said</summary><p className="es2-desc">{EsModel.sentences(o.desc, 1)}</p></details> : null}
      </Ss.Card>
    );
  };

  const Door = ({ m, ia, between }) => {
    const lk = m.exitLock;
    return (
      <Ss.Card className={'es2-tile es2-door' + (between ? ' es2-banded' : '')} kicker="The way out" title={ia ? lk.name : 'You got out at ' + m.min + ' min'}>
        {between ? <Band here={[lk]} /> : null}
        {ia ? (
          <div className="es2-hintrow">
            {lk.hints.length ? (between ? <span className="es2-sq"><EsModel.SqPips n={Math.max.apply(null, lk.hints)} /></span> : <Rungs n={Math.max.apply(null, lk.hints)} />) : null}
            <span className="ss-caption">{EsModel.triesText(lk)}</span>
          </div>
        ) : (
          <div className="es2-doorrow">
            <span className="es2-knob" aria-hidden="true" />
            <div>
              <p className="es2-lname"><span className="es2-tick"><DS.Icon name="check" size={16} /></span><span>{lk.name}</span></p>
              <p className="ss-caption">{'Opened at move ' + lk.openedN + ' · ' + EsModel.lockFacts(lk) + (m.par != null ? ' · par ' + m.par + ' min' : '')}</p>
            </div>
          </div>
        )}
      </Ss.Card>
    );
  };

  // Tapping an object on the plan opens its lock, its tries and what it said (IA pass only; the built page shows the tiles).
  const Detail = ({ it }) => {
    if (!it) return null;
    return (
      <div className="es2-detail">
        <h3 className="ss-card-title">{it.o.name}</h3>
        {it.locks.length ? it.locks.map((lk) => (
          <p key={lk.key} className="es2-dline">
            <EsModel.Glyph state={EsModel.lockState(lk)} />
            <span>{lk.name + ' · ' + EsModel.stateWord(lk).toLowerCase() + (lk.openedN != null ? ' at move ' + lk.openedN : '') + ' · ' + EsModel.lockFacts(lk)}</span>
          </p>
        )) : <p className="ss-caption">Nothing locked here.</p>}
        {it.locks.map((lk) => (lk.gave ? <span key={lk.key} className="es2-chip">{'Gave · ' + lk.gave}</span> : null))}
        <details className="es2-more"><summary>What it said</summary><p className="es2-desc">{EsModel.sentences(it.o.desc, 1)}</p></details>
      </div>
    );
  };

  const OptionTwo = ({ gid, session, sid, share, api, element, layout }) => {
    const m = React.useMemo(() => EsModel.build(session), [session]);
    const out = m.out;
    const ia = layout === 'ia', between = element === 'between', game = element === 'game';
    const [sel, setSel] = React.useState(null);
    const sub = m.done && m.forced ? EsModel.plural(m.forced, 'lock forced', 'locks forced') : null;
    const say = m.openCount ? EsModel.plural(m.openCount, 'lock', 'locks') + ' open.' : 'No lock open yet.';
    const tiles = m.objects.filter((o) => !(m.done && m.exitLock && o.key === m.exitObj));
    // IA pass: par moves into the head's strip (it was only on the way-out card, three screens down).
    const stats = ia && m.done && m.par != null ? (out.stats || []).concat([{ label: 'Par', value: m.par + ' min' }]) : out.stats;
    const items = React.useMemo(() => EsModel.objItems(m), [m]);
    const picked = items.find((it) => it.o.key === sel) || null;
    const showTiles = !(game && ia);
    return (
      <Ss.Page gid={gid}>
        <Ss.Head gid={gid} art="escape" label={out.label} date={session.date} h1={out.h1} mark="" stats={stats} sub={sub} />
        <div className="ss-body">
          <section className="ss-hero ss-surface" aria-label={game ? 'The room, as a floor plan' : 'The room as you found it'}>
            {ia ? null : <p className="es2-lead">{m.done ? 'The room as you found it' : 'The room so far'}</p>}
            {game ? <EsModel.Plan m={m} interactive={ia} selected={sel} onSelect={setSel} caption={ia ? 'Placed in the order you examined them. Tap one for detail.' : null} /> : null}
            {game && ia ? <Detail it={picked} /> : null}
            {showTiles ? (
              <div className="es2-grid">
                {tiles.map((o) => <Tile key={o.key} o={o} m={m} ia={ia} between={between} />)}
                {m.done && m.exitLock ? <Door m={m} ia={ia} between={between} /> : null}
              </div>
            ) : null}
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
    stance: 'The player never sees the room, so draw it: a tile for each object they examined, the locks they found on it, and the door last. IA pass: a tile is its name, lock state, hint squares and tries, with what the object said behind a tap, and par joins the head. Between: the cover’s teal door down each locked tile, one amber knob per lock. Game: a floor plan of the study, each object a slot in the order examined, lock glyphs, hint squares, tries, your route in amber and the wall open once you are out.',
    cost: 'Needs the engine to send which lock sits on which object, tries and hint rungs per lock, and what a lock gave; the seed reads them from the moves and the room’s content. Objects never examined are absent. Game: needs the engine to send which object each lock sits on and which lock is the exit (here read from the lock’s name and the last opening); position is examine order, not geography, because content has no coordinates; a forced lock is drawn but no seed has one.',
    elements: ['store', 'between', 'game'],
    layouts: ['built', 'ia'],
    Component: OptionTwo,
    shareText: (session) => window.SsOutcome.escape(session).lines,
    css: EsModel.planCss + `
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

      /* IA pass */
      :scope .es2-banded { position: relative; }
      :scope .ss-page[data-layout="ia"] .es2-door .ss-card-title { font: var(--type-label); font-size: 16px; }
      :scope .es2-more { margin: 0; }
      :scope .es2-more summary { cursor: pointer; font: var(--type-caption); color: var(--muted); min-height: 24px; display: flex; align-items: center; }
      :scope .es2-more .es2-desc { margin: 6px 0 0; }
      :scope .es2-chip { justify-self: start; display: inline-flex; align-items: center; min-height: 24px; padding: 0 8px; border: 1px solid var(--ss-line); font: var(--type-small); color: var(--text); }
      :scope .es2-detail { display: grid; gap: 8px; padding-top: 12px; border-top: 1px solid var(--ss-line); }
      :scope .es2-detail .ss-card-title { font: var(--type-label); font-size: 16px; }
      :scope .es2-dline { margin: 0; display: grid; grid-template-columns: 14px minmax(0, 1fr); gap: 8px; align-items: start; font: var(--type-small); }
      :scope .es2-dline .es-glyph { margin-top: 1px; }
      :scope .es2-detail .es-gbody { fill: var(--text); }
      :scope .es2-detail .es-gshackle { stroke: var(--text); }
      :scope .es2-detail .es-glyph[data-state="open"] .es-gbody { fill: var(--cover-green); }
      :scope .es2-detail .es-glyph[data-state="open"] .es-gshackle { stroke: var(--cover-green); }
      /* Between: the cover's door and knob. Flat shapes in cover tokens on the store's own card. */
      :scope .es2-banded { padding-left: 28px; overflow: hidden; }
      :scope .es2-band { position: absolute; left: 0; top: 0; bottom: 0; width: 12px; background: var(--cover-teal); }
      :scope .es2-knob2 { position: absolute; right: 1px; width: 8px; height: 8px; box-sizing: border-box; border: 1.5px solid var(--cover-amber); background: transparent; }
      :scope .es2-knob2:nth-child(1) { top: 56%; } :scope .es2-knob2:nth-child(2) { top: calc(56% + 14px); } :scope .es2-knob2:nth-child(3) { top: calc(56% + 28px); }
      :scope .es2-knob2[data-state="open"] { background: var(--cover-amber); }
      :scope .es2-knob2[data-state="forced"]::after { content: ''; position: absolute; left: -3px; top: 2.2px; width: 12px; height: 2px; background: var(--cover-orange); transform: rotate(-45deg); }
      :scope .es2-sq .es-sqp { color: var(--cover-cream); }
      :scope .es2-sq .es-sqp i { width: 8px; height: 8px; }
      :scope .ss-page[data-element="between"] .es2-door { border-left: 0; }
      :scope .es2-door.es2-banded { padding-left: 32px; }
      :scope .es2-door.es2-banded .es2-band { width: 12px; }
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
