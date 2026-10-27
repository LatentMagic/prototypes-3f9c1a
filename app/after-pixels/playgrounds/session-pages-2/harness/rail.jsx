// ============================================================================
// Session pages 2: the rail. One body, rendered in two places and never forked: docked beside the app at 1024 and up
// (harness/boot.jsx), and inside the app's own Config modal below 1024 (harness/stage.jsx, ConfigExtra).
// Game and state switchers are the app's own ConfigSeg (app/config.jsx).
// ============================================================================
const useSp2Sel = () => React.useSyncExternalStore(window.sp2Store.subscribe, window.sp2Store.get);

const Sp2Row = ({ gid, n, active, onPick }) => {
  const def = window.sp2GetOption(gid, n);
  const [why, setWhy] = React.useState(false);
  const id = 'sp2-why-' + gid + '-' + n;
  return (
    <li className="sp2-opt" data-active={active ? '1' : undefined}>
      <div className="sp2-opt-line">
        <button type="button" className="sp2-opt-pick" aria-pressed={active} onClick={() => { window.sp2Store.pick(gid, n); if (onPick) onPick(); }}>
          <span className="sp2-opt-n">{n}</span>
          <span className="sp2-opt-name">{def.name}</span>
        </button>
        <button type="button" className="sp2-opt-why" aria-expanded={why} aria-controls={id}
          aria-label={'Stance and cost of option ' + n} onClick={() => setWhy((w) => !w)}>{why ? '−' : '+'}</button>
      </div>
      {why && <dl id={id} className="sp2-opt-detail">
        <dt>Stance</dt><dd>{def.stance}</dd>
        <dt>Cost</dt><dd>{def.cost}</dd>
      </dl>}
    </li>
  );
};

const Sp2Rail = ({ onPick }) => {
  const sel = useSp2Sel();
  const game = window.SP2.byId[sel.game];
  const opts = Array.from({ length: window.SP2.optionCount }, (_, i) => i + 1);
  return (
    <div className="sp2-rail">
      <header className="sp2-rail-head">
        <div className="sp2-eyebrow">Playground</div>
        <h1 className="sp2-title">Session pages 2</h1>
        <p className="sp2-lede">Three options for each game's session page. Each is the whole page; pick one and a state.</p>
      </header>
      {window.SP2.games.length > 1 && <div className="sp2-seg">
        <div className="sp2-label">Game</div>
        <window.ConfigSeg value={sel.game} options={window.SP2.games.map((g) => ({ value: g.id, label: g.name }))}
          onChange={(v) => { window.sp2Store.pick(v, sel.opt); if (onPick) onPick(); }} />
      </div>}
      <section className="sp2-game">
        <h2 className="sp2-game-name">{game.name}</h2>
        <div className="sp2-seg">
          <div className="sp2-label">State</div>
          <window.ConfigSeg value={sel.state[game.id]} options={game.states.map((s) => ({ value: s.id, label: s.label }))}
            onChange={(v) => { window.sp2Store.setState(game.id, v); if (onPick) onPick(); }} />
        </div>
        <ul className="sp2-opts">
          {opts.map((n) => <Sp2Row key={n} gid={game.id} n={n} active={!sel.view && sel.opt === n} onPick={onPick} />)}
        </ul>
        {(game.sheets || []).length > 0 && <ul className="sp2-opts">
          {game.sheets.map((sh) => (
            <li key={sh.id} className="sp2-opt" data-active={sel.view === sh.id ? '1' : undefined}>
              <div className="sp2-opt-line">
                <button type="button" className="sp2-opt-pick" aria-pressed={sel.view === sh.id} onClick={() => { window.sp2Store.setView(game.id, sh.id); if (onPick) onPick(); }}>
                  <span className="sp2-opt-n">◇</span><span className="sp2-opt-name">{sh.name}</span>
                </button>
              </div>
            </li>))}
        </ul>}
      </section>
      {game.config && window[game.config] && React.createElement(window[game.config])}
    </div>
  );
};

Object.assign(window, { Sp2Rail, useSp2Sel });
