// ============================================================================
// After Pixels — shared parts. Built from the design system's components; parts
// the system lacks (top bar, chat window, server panel, stat tile, demo bar)
// are built from its colours, type, spacing and square corners.
// ============================================================================

// ---- Covers and tags ---------------------------------------------------------
// fit: the art is drawn to whatever frame it is given, the whole picture showing on its ground and placed by its declared extend.
// fill: the design system's Cover fill, for a cover beside a heading: it takes the height of the text beside it, the art keeps its size and stands where its extend puts it.
const GsCover = ({ art, fit, fill }) => {
  const a = GS_ART[art] || {}; let svg = a.svg || '';
  if (fill) return <DS.Cover fill ground={a.ground || 'indigo'} extend={a.extend || 'centre'}><span style={{ display: 'block' }} dangerouslySetInnerHTML={{ __html: svg }} /></DS.Cover>;
  if (fit) svg = svg.replace('xMidYMid slice', a.extend === 'bottom' ? 'xMidYMax meet' : 'xMidYMid meet');
  return <DS.Cover className={fit ? 'gs-cover-fit is-' + (a.ground || 'indigo') : ''}><span style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: svg }} /></DS.Cover>;
};
// Game art that answers the pointer (design system GameArt, guidelines/game-art-motion.md). Only these pieces
// have a motion design yet; every other game keeps its static cover.
const GS_ART_MOTION = ['groups', 'casebook', 'hunter'];
const I = (c) => <i className={c} />;
const GS_ART_LOCAL = {
  murder: { bg: 'is-wine', body: <>{I('ga-m-ring')}{I('ga-m-bar')}{I('ga-m-cap')}</> },
  escape: { bg: '', body: <>{I('ga-e-door')}{I('ga-e-knob')}{I('ga-e-win')}</> },
  delve: { bg: 'is-wine', body: <>{I('ga-d-out')}{I('ga-d-in')}{I('ga-d-st')}{I('ga-d-st2')}{I('ga-d-st3')}{I('ga-d-post l')}{I('ga-d-post r')}{I('ga-d-fl l')}{I('ga-d-fl r')}</> },
};
const GS_RATIO = { square: 'mcp-art-1', landscape: 'mcp-art-43', wide: 'mcp-art-3' };
const GsArt = ({ art, shape }) => {
  if (GS_ART_MOTION.includes(art)) return <DS.GameArt art={art} shape={shape} />;
  const p = GS_ART_LOCAL[art];
  // A cover with no drawn motion piece (the Barrow): its 4:3 art at the box's height, centred, on its own ground, so every shape keeps the row's ratio.
  if (!p) {
    const a = GS_ART[art] || {}; if (!shape || !GS_RATIO[shape]) return <GsCover art={art} />;
    const svg = (a.svg || '').replace('xMidYMid slice', a.extend === 'bottom' ? 'xMidYMax meet' : 'xMidYMid meet');
    return <div className={'mcp-art ' + GS_RATIO[shape] + (a.ground && a.ground !== 'indigo' ? ' is-' + a.ground : '')} style={{ position: 'relative' }} aria-hidden="true">
      <span style={{ position: 'absolute', inset: 0, display: 'grid' }} dangerouslySetInnerHTML={{ __html: svg.replace('<svg ', '<svg style="width:100%;height:100%;display:block" ') }} /></div>;
  }
  return <div className={'mcp-art ' + GS_RATIO[shape] + ' ' + p.bg} aria-hidden="true"><div className="gs-st">{p.body}</div></div>;
};
// KEEP: on touch, the pose plays while a finger is down on the card and stops on release or when a scroll takes over, so scrolling a row never animates it.
// Put the ref on any element inside the card; the card itself carries .gs-host.
const useGsArtHost = () => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const host = ref.current && ref.current.closest('.gs-host'); if (!host) return undefined;
    // A press on the card's second control (the Pass tag) leaves the art still.
    const on = (e) => { if (e.pointerType !== 'mouse' && !e.target.closest(':is(a, button):not(.mcp-art-link)')) host.classList.add('is-on'); };
    const off = () => host.classList.remove('is-on');
    host.addEventListener('pointerdown', on);
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => host.addEventListener(t, off));
    return () => { host.removeEventListener('pointerdown', on); ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => host.removeEventListener(t, off)); };
  }, []);
  return ref;
};
const GsPassTag = () => {
  const gs = useGs();
  return (
    <button type="button" className="gs-tagbtn" aria-label="Pass. See the Pass" onClick={() => gs.go('pass')}>
      <DS.Tag kind="locked">Pass</DS.Tag>
    </button>
  );
};
const GsTagList = ({ tags, ed }) => (
  <div className="gs-tags">
    {tags.map((t, i) => t === 'FREE' ? <DS.Tag key={i} kind="free">Free</DS.Tag>
      : t === 'FIRST' ? <DS.Tag key={i} kind="free">{'First ' + (ed ? ed[0] : 'edition') + ' free'}</DS.Tag>
      : t === 'PASS' ? <GsPassTag key={i} />
      : <DS.Tag key={i} kind="daily">{t}</DS.Tag>)}
  </div>
);

// ---- Text blocks ---------------------------------------------------------------
const GsSteps = ({ items, row }) => (
  <ol className={'gs-steps' + (row ? ' is-row' : '')}>
    {items.map((it, i) => <li key={i} className="gs-step"><span className="gs-num">{i + 1}</span><div>{it}</div></li>)}
  </ol>
);
const GsWhoCols = ({ ai, server }) => (
  <div className="gs-cols2">
    <div className="gs-stack-sm" style={{ alignContent: 'start' }}><h3 className="mcp-t-card">Your AI</h3><p className="gs-muted">{ai}</p></div>
    <div className="gs-stack-sm" style={{ alignContent: 'start' }}><h3 className="mcp-t-card">The game engine</h3><p className="gs-muted">{server}</p></div>
  </div>
);
// The Pass page's comparison. One row per thing; a tick in each column that has it. Rows agree with the free and Pass rules.
const GS_COMPARE = [
  { name: 'Free games', free: true },
  { name: 'The start of select games', free: true },
  { name: 'Streaks and achievements in every game you can play', free: true },
  { name: 'Your results and history', free: true },
  { name: 'Sharing a result', free: true },
  { name: 'Play earlier editions', free: false },
  { name: 'The full game catalog', free: false },
  { name: 'New releases', free: false },
];
const GsCmpMark = ({ on }) => on
  ? <span className="gs-cmp-cell"><DS.Icon name="check" /><span className="gs-vh">Included</span></span>
  : <span className="gs-cmp-cell gs-muted"><span aria-hidden="true">–</span><span className="gs-vh">Not included</span></span>;
const GsCompare = ({ foot }) => (
  <section className="gs-cmp" aria-labelledby="gs-cmp-h">
    <h2 id="gs-cmp-h" className="mcp-t-sec gs-cmp-h">What you get</h2>
    <div role="table" aria-labelledby="gs-cmp-h" className="gs-cmp-t">
      <div role="row" className="gs-cmp-tr is-head">
        <span role="columnheader"><span className="gs-vh">What you get</span></span>
        <span role="columnheader" className="gs-cmp-cell mcp-t-card">Free</span>
        <span role="columnheader" className="gs-cmp-cell gs-cmp-band mcp-t-card">Pass</span>
      </div>
      {GS_COMPARE.map((r) => (
        <div role="row" key={r.name} className="gs-cmp-tr">
          <span role="rowheader" className="gs-cmp-label"><b>{r.name}</b>{r.sub && <span className="gs-muted">{r.sub}</span>}</span>
          <span role="cell"><GsCmpMark on={r.free} /></span>
          <span role="cell" className="gs-cmp-band"><GsCmpMark on /></span>
        </div>
      ))}
      <div className="gs-cmp-tr is-foot" aria-hidden="true"><span /><span /><span className="gs-cmp-band" /></div>
    </div>
    {foot}
  </section>
);
const GsStat = ({ label, figure, line }) => (
  <DS.Card style={{ gap: 8, alignContent: 'start' }}>
    <span className="gs-label">{label}</span>
    <span className="gs-figure">{figure}</span>
    <p className="gs-muted">{line}</p>
  </DS.Card>
);
const GsTrack = ({ label, value, max = 6, threat }) => (
  <div className="gs-stack-sm">
    <span className="gs-num-text gs-strong">{label} {value}/{max}</span>
    <div className="gs-track" role="img" aria-label={label + ' ' + value + ' of ' + max}>
      {Array.from({ length: max }, (_, i) => <i key={i} className={i < value ? (threat ? 'is-threat' : 'is-on') : ''} />)}
    </div>
  </div>
);
// Coming soon is the design system's SoonCard. A chapter of a game that is out carries label, play and its route.
const GsSoonCard = ({ g }) => {
  const gs = useGs(); const a = GS_ART[g.art] || {};
  return (
    <DS.SoonCard
      art={<DS.Cover fill ground={a.ground} extend={a.extend}><span style={{ display: 'block' }} dangerouslySetInnerHTML={{ __html: a.svg || '' }} /></DS.Cover>}
      label={g.label} title={g.name} line={g.line}
      play={g.play} onPlay={g.play ? () => gs.go(g.route) : undefined} />
  );
};
// ---- A game in three forms, all from the design system: GsCard (GameCard) in every card row,
// GsPick (GamePick) for Discover's two picks, GsTile (GameTile) in Discover's wall and every tile row. Coming soon is GsSoonCard.
// GsCard, GsGameCard and GsPick are in gs-pass-home.jsx.
// The whole card is the target and the hover surface: hover, focus and press play the art's motion.
// KEEP: a blurb's last line is never one word (its last two words stay together), so no card ends on a lone word.
const gsKeepLast = (s) => { const i = s.lastIndexOf(' '); const j = i > 0 ? s.lastIndexOf(' ', i - 1) : -1; return j < 0 ? s : <>{s.slice(0, j + 1)}<span style={{ whiteSpace: 'nowrap' }}>{s.slice(j + 1)}</span></>; };
// The one tile part (design system GameTile): Discover's wall and every CardRow kind="tiles" use it, so a tile is built
// the same way everywhere. `pass` draws the Pass mark, which opens Pricing; `page` opens that page of the game (Library opens 'record').
const GsTile = ({ id, pass, page }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const host = useGsArtHost();
  return (
    <DS.GameTile className="mcp-art-host gs-host"
      art={<div ref={host}><GsArt art={g.art} shape="square" /></div>} pass={!!pass} onPass={() => gs.go('pass')}
      title={<button type="button" className="mcp-gtile-open mcp-art-link" onClick={() => gs.go(g.route, page ? { page } : undefined)}>{g.name}</button>}
      kind={gsKind(g.category)} />
  );
};

// ---- User menu. Trigger: avatar, name, email, chevron. Panel: identity header,
// Manage account, Your AI, divider, Sign out. On a phone the trigger is a person icon in a
// button shaped like the Menu button beside it, which holds only the pages.
const GsAvatar = ({ big, btn }) => {
  const gs = useGs();
  return <span className={'gs-avatar' + (big ? ' is-big' : '') + (btn ? ' is-btn' : '')} aria-hidden="true">{gsName(gs.user)[0].toUpperCase()}</span>;
};
const gsName = (u) => u.username || u.email || '?';
const GsIdentityHead = () => {
  const gs = useGs();
  return (
    <div className="gs-idhead">
      <GsAvatar big />
      <span className="gs-stack-xs gs-id-text"><span className="gs-strong">{gsName(gs.user)}</span><span className="gs-small">{gs.user.email}</span></span>
    </div>
  );
};
const GsUserItems = ({ pick, role }) => {
  const gs = useGs();
  const [busy, run] = useGsBusy();
  // Sign out holds the menu open, its item busy, until the staged wait ends.
  const item = (key, icon, label, fn, work) => (
    <button key={key} type="button" role={role} className="gs-menu-item gs-menu-ico" aria-busy={(work && busy) || undefined}
      onClick={() => (work ? run(() => pick(fn)) : pick(fn))}>
      {work && busy ? <span className="gs-ico-slot"><GsInkSpin /></span>
        : icon ? (icon === 'logout' || icon === 'pass' ? <GsGlyph name={icon} /> : <DS.Icon name={icon} />) : <span className="gs-ico-space" />}{label}
    </button>
  );
  return <>
    {item('acct', 'settings', 'Manage account', () => gs.go('account', { from: gs.route }))}
    {item('pass', 'pass', 'Pass', () => gs.go('pass'))}
    {item('ai', 'play', 'How it works', () => gs.go('connect'))}
    <div className="gs-menu-div" role="separator" />
    {item('out', 'logout', 'Sign out', gs.signOut, true)}
  </>;
};
// A menu opens at its control at every width: outside press and Escape close it,
// and focus goes back to the control.
const gsUseMenuDismiss = (open, setOpen, wrap) => React.useEffect(() => {
  if (!open) return undefined;
  const back = () => { const b = wrap.current && wrap.current.querySelector('button'); b && b.focus(); };
  const onDoc = (e) => { if (wrap.current && !wrap.current.contains(e.target)) { setOpen(false); back(); } };
  const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); back(); } };
  document.addEventListener('pointerdown', onDoc); document.addEventListener('keydown', onKey);
  return () => { document.removeEventListener('pointerdown', onDoc); document.removeEventListener('keydown', onKey); };
}, [open]);
const GsUserMenu = ({ compact }) => {
  const gs = useGs();
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef(null);
  gsUseMenuDismiss(open, setOpen, wrap);
  return (
    <div className="gs-acct" ref={wrap}>
      {compact ? (
        <DS.Button variant="secondary" className="gs-acct-ico" aria-label={'Your account, ' + gsName(gs.user)} aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((o) => !o)}>
          <GsGlyph name="account" size={24} />
        </DS.Button>
      ) : (
        <button type="button" className="gs-acct-btn" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((o) => !o)}>
          <GsAvatar />
          <span className="gs-acct-who"><span className="gs-strong">{gsName(gs.user)}</span><span className="gs-small">{gs.user.email}</span></span>
          <DS.Icon name="down" />
        </button>
      )}
      {open && (
        <div className="gs-pop" role="menu" aria-label="Your account">
          <GsIdentityHead />
          <GsUserItems role="menuitem" pick={(fn) => { setOpen(false); fn(); }} />
        </div>
      )}
    </div>
  );
};

// ---- Shared top bar -------------------------------------------------------------
const GsTopBar = () => {
  const gs = useGs();
  const [menu, setMenu] = React.useState(false);
  const mwrap = React.useRef(null);
  gsUseMenuDismiss(menu, setMenu, mwrap);
  const out = gs.view === 'out';
  // Discover holds the store and every product page; Library holds the Library and every library game page.
  const r = gs.route;
  const cur = !out && (r.name === 'library' || r.page === 'record') ? 'library'
    : (r.name === 'games' || GS_GAME_ORDER.some((k) => GS_GAMES[k].route === r.name)) ? 'games' : r.name;
  const links = out
    ? [['games', 'Discover', () => gs.go('games')], ['how', 'How it works', gs.goHow], ['pass', 'Pricing', () => gs.go('pass')]]
    : [['games', 'Discover', () => gs.go('games')], ['library', 'Library', () => gs.go('library')], ['history', 'History', () => gs.go('history')]];
  const pick = (fn) => { setMenu(false); fn(); };
  return (
    <header className="gs-top">
      <div className="gs-wrap gs-top-in">
        <button type="button" className="gs-brand" aria-label="After Pixels, home" onClick={() => gs.go(out ? 'home' : 'games')}><GsMark /><span>After Pixels</span></button>
        <nav className="gs-nav" aria-label="Main">
          {links.map(([id, l, fn]) => <button key={id} type="button" className="gs-navlink" aria-current={cur === id ? 'page' : undefined} onClick={fn}>{l}</button>)}
        </nav>
        {/* KEEP: the top bar's buttons keep their own width at every width, as menu triggers do (design system Layout); mcp-menu-wrap is the system's hook. */}
        <div className="gs-top-end mcp-menu-wrap">
          {out ? (
            <div className="gs-wide-only">
              <DS.Button variant="secondary" onClick={() => gs.go('signin')}>Sign in</DS.Button>
              <DS.Button onClick={gs.startFree}>Start free</DS.Button>
            </div>
          ) : <div className="gs-wide-only"><GsUserMenu /></div>}
          <div className="gs-narrow-only gs-menu-anchor" ref={mwrap}>
            <DS.Button variant="secondary" aria-expanded={menu} aria-haspopup="menu" onClick={() => setMenu((m) => !m)}>Menu</DS.Button>
            {menu && (
              <div className="gs-pop" role="menu" aria-label="Menu" style={out ? undefined : { minWidth: 200 }}>
                {links.map(([id, l, fn]) => <button key={id} type="button" role="menuitem" className="gs-menu-item" aria-current={cur === id ? 'page' : undefined} onClick={() => pick(fn)}>{l}</button>)}
                {out && <div className="gs-menu-div" role="separator" />}
                {out && <div className="gs-pop-cta">
                  <DS.Button variant="secondary" block role="menuitem" onClick={() => pick(() => gs.go('signin'))}>Sign in</DS.Button>
                  <DS.Button block role="menuitem" onClick={() => pick(gs.startFree)}>Start free</DS.Button>
                </div>}
              </div>
            )}
          </div>
          {!out && <div className="gs-narrow-only"><GsUserMenu compact /></div>}
        </div>
      </div>
    </header>
  );
};

// ---- Demo bar: a prototype control, not part of the product ---------------------
const gsDailyRoute = (gs) => { const k = gsGameOfRoute(gs.route.name); return !!(k && GS_GAMES[k].daily); };
// The "This week" switch shows only where it changes something: a page that shows this edition's play
// (its product page or library game page), and History when signed in.
const gsWeekSwitch = (gs) => {
  const r = gs.route; if (r.name === 'history') return gs.view !== 'out';
  const k = gsGameOfRoute(r.name); if (!k || !window.lbNow || (r.page === 'record' && r.sid)) return false;
  return !!lbNow(gs, k);
};
const GsDemoBar = () => {
  const gs = useGs();
  const opts = [['out', 'signed out'], ['free', 'free'], ['pass', 'Pass']];
  const sw = gsWeekSwitch(gs); const daily = gsDailyRoute(gs);
  return (<>
    <div className={'gs-demo-space' + (sw ? ' is-two' : '')} aria-hidden="true" />
    <div className="gs-demo" role="group" aria-label="Demo view, not part of the product">
      <div className={'gs-demo-in' + (sw ? ' is-two' : '')}>
        <span>Demo view:</span>
        {opts.map(([v, l], i) => (
          <React.Fragment key={v}>
            {i > 0 && <span aria-hidden="true">/</span>}
            <button type="button" className="gs-demo-opt" aria-pressed={gs.view === v} onClick={() => gs.setDemoView(v)}>{l}</button>
          </React.Fragment>
        ))}
        {sw && <>
          <span aria-hidden="true" className="gs-demo-sep" />
          <span>{gs.route.name === 'history' ? 'Today and this week:' : daily ? 'Today:' : 'This week:'}</span>
          {[['live', 'in progress'], ['done', daily ? 'day complete' : 'finished']].map(([v, l], i) => (
            <React.Fragment key={v}>
              {i > 0 && <span aria-hidden="true">/</span>}
              <button type="button" className="gs-demo-opt" aria-pressed={(gs.review.week === 'live' ? 'live' : 'done') === v} onClick={() => gs.setReview({ week: v })}>{l}</button>
            </React.Fragment>
          ))}
        </>}
      </div>
    </div>
  </>);
};

// ---- The play dialog lives in gs-connect.jsx with the prompts ----
const GsPlayPopup = () => <GsPlayDialog />;

Object.assign(window, { GsCover, GsArt, useGsArtHost, GsPassTag, GsTagList, GsSteps, GsWhoCols, GsCompare, GsStat, GsTrack, GsSoonCard, GsTile, gsKeepLast, GsUserMenu, GsTopBar, GsDemoBar, GsPlayPopup, gsUseMenuDismiss });
