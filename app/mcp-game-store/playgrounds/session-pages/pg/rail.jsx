// ============================================================================
// Session-pages playground: the config rail body. One body, rendered in two places and never forked:
// docked beside the app at 1024 and up (pg/boot.jsx), and inside the app's own Config modal below 1024 (pg/stage.jsx, ConfigExtra).
// Selection lives in window.pgStore (pg/store.js). Names are Pg-prefixed: Babel scripts share one global scope.
// State switcher = the app's own ConfigSeg (app/config.jsx).
// ============================================================================
const usePgSel = () => React.useSyncExternalStore(window.pgStore.subscribe, window.pgStore.get);

const PgRow = ({ game, n, active, onPick }) => {
  const def = window.pgGetOption(game.id, n);
  const [why, setWhy] = React.useState(false);
  const id = 'pg-why-' + game.id + '-' + n;
  return (
    <li className="pg-opt" data-active={active ? '1' : undefined}>
      <div className="pg-opt-line">
        <button type="button" className="pg-opt-pick" aria-pressed={active} onClick={() => onPick(game.id, n)}>
          <span className="pg-opt-n">{n}</span>
          <span className="pg-opt-name">{def.name}</span>
          {n > 0 && !def.built && <span className="pg-opt-tag">not built yet</span>}
        </button>
        <button type="button" className="pg-opt-why" aria-expanded={why} aria-controls={id}
          aria-label={'Stance and cost of ' + (n === 0 ? 'Today' : 'option ' + n)} onClick={() => setWhy((w) => !w)}>{why ? '−' : '+'}</button>
      </div>
      {why && <dl id={id} className="pg-opt-detail">
        <dt>Stance</dt><dd>{def.stance}</dd>
        <dt>Cost</dt><dd>{def.cost}</dd>
      </dl>}
    </li>
  );
};

const PgGroup = ({ game, sel, onPick }) => {
  const open = window.pgStore.isOpen(game.id);
  const cur = sel.game === game.id;
  const stateId = sel.states[game.id];
  const stateLabel = game.states.find((s) => s.id === stateId).label;
  const body = 'pg-grp-' + game.id;
  return (
    <section className="pg-grp" data-current={cur ? '1' : undefined}>
      <h2 className="pg-grp-h">
        <button type="button" aria-expanded={open} aria-controls={body} onClick={() => window.pgStore.toggle(game.id)}>
          <span className="pg-chev" aria-hidden="true">{open ? '▾' : '▸'}</span>
          <span className="pg-grp-name">{game.name}</span>
          <span className="pg-grp-sum">{cur ? (sel.opt === 0 ? 'Today' : 'Option ' + sel.opt) + ' · ' + stateLabel : ''}</span>
        </button>
      </h2>
      {open && <div id={body} className="pg-grp-body">
        <div className="pg-states">
          <div className="pg-states-label">State</div>
          <window.ConfigSeg value={stateId} options={game.states.map((s) => ({ value: s.id, label: s.label }))}
            onChange={(v) => { window.pgStore.setState(game.id, v); if (onPick) onPick(); }} />
        </div>
        <ul className="pg-opts">
          {[0, 1, 2, 3].map((n) => <PgRow key={n} game={game} n={n} active={cur && sel.opt === n} onPick={(g, o) => { window.pgStore.select(g, o); if (onPick) onPick(); }} />)}
        </ul>
      </div>}
    </section>
  );
};

const PgRail = ({ onPick }) => {
  const sel = usePgSel();
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    const link = window.pgStore.link();
    try { navigator.clipboard && navigator.clipboard.writeText(link); } catch (e) {}
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="pg-rail">
      <header className="pg-rail-head">
        <div className="pg-eyebrow">Playground</div>
        <h1 className="pg-title">Session pages</h1>
        <p className="pg-lede">Five games, three options each. Pick a row; the page beside it is the real store.</p>
      </header>
      <div className="pg-groups">
        {window.PG_GAMES.map((g) => <PgGroup key={g.id} game={g} sel={sel} onPick={onPick} />)}
      </div>
      <footer className="pg-rail-foot">
        <button type="button" className="pg-link" onClick={copy}>{copied ? 'Link copied' : 'Copy link to this view'}</button>
      </footer>
    </div>
  );
};

Object.assign(window, { PgRail, usePgSel });
