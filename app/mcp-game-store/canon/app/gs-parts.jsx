// ============================================================================
// [Platform] — shared parts. Built from the design system's components; parts
// the system lacks (top bar, chat window, server panel, stat tile, demo bar)
// are built from its colours, type, spacing and square corners.
// ============================================================================

// ---- Covers and tags ---------------------------------------------------------
const GsCover = ({ art }) => (
  <DS.Cover><span style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: GS_ART[art] || '' }} /></DS.Cover>
);
const GsCoverButton = ({ art, label, onClick }) => (
  <button type="button" className="gs-coverbtn" aria-label={label} onClick={onClick}><GsCover art={art} /></button>
);
// Game art that answers the pointer (design system GameArt, guidelines/game-art-motion.md). Only these pieces
// have a motion design yet; every other game keeps its static cover.
const GS_ART_MOTION = ['groups', 'casebook', 'hunter'];
const I = (c) => <i className={c} />;
const GS_ART_LOCAL = {
  word: { bg: 'is-forest', body: <>{I('ga-w ga-w1')}{I('ga-w ga-w2')}{I('ga-w3')}</> },
  murder: { bg: 'is-wine', body: <>{I('ga-m-ring')}{I('ga-m-bar')}{I('ga-m-cap')}</> },
  escape: { bg: '', body: <>{I('ga-e-door')}{I('ga-e-knob')}{I('ga-e-win')}</> },
  delve: { bg: 'is-wine', body: <>{I('ga-d-out')}{I('ga-d-in')}{I('ga-d-st')}{I('ga-d-st2')}{I('ga-d-st3')}{I('ga-d-post l')}{I('ga-d-post r')}{I('ga-d-fl l')}{I('ga-d-fl r')}</> },
};
const GS_RATIO = { square: 'mcp-art-1', landscape: 'mcp-art-43', wide: 'mcp-art-3' };
const GsArt = ({ art, shape }) => {
  if (GS_ART_MOTION.includes(art)) return <DS.GameArt art={art} shape={shape} />;
  const p = GS_ART_LOCAL[art]; if (!p) return <GsCover art={art} />;
  return <div className={'mcp-art ' + GS_RATIO[shape] + ' ' + p.bg} aria-hidden="true"><div className="gs-st">{p.body}</div></div>;
};
// Touch: the pose plays while a finger is down on the card and stops on release or when a scroll takes over.
// Put the ref on any element inside the card; the card itself carries .gs-host.
const useGsArtHost = () => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const host = ref.current && ref.current.closest('.gs-host'); if (!host) return undefined;
    const on = (e) => { if (e.pointerType !== 'mouse') host.classList.add('is-on'); };
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
    <div className="gs-stack-sm"><h3 className="mcp-t-card">Your AI</h3><p className="gs-muted">{ai}</p></div>
    <div className="gs-stack-sm"><h3 className="mcp-t-card">The game engine</h3><p className="gs-muted">{server}</p></div>
  </div>
);
// The Pass page's comparison, back (free-and-pass, 2026-10-09). One row per thing; a tick in each column that has it. Rows agree with the free and Pass rules.
const GS_COMPARE = [
  { name: 'Free games', free: true },
  { name: 'The first edition of select games', free: true },
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
const GsCompare = () => (
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
const GsSoonCard = ({ g }) => (
  <DS.Card style={{ gridTemplateColumns: 'minmax(96px, 1fr) minmax(0, 2fr)', gap: 16, alignItems: 'center', justifyItems: 'stretch' }}>
    <GsCover art={g.art} />
    <div className="gs-stack-sm" style={{ justifyItems: 'start' }}>
      <h3 className="mcp-t-card">{g.name}</h3>
      <p className="gs-muted">{g.line}</p>
      <DS.Tag kind="daily">Coming soon</DS.Tag>
    </div>
  </DS.Card>
);
const GsGameCard = ({ id, mark }) => {
  const gs = useGs(); const g = GS_GAMES[id];
  const open = () => gs.go(g.route);
  return (
    <DS.Card style={{ gap: 12, justifyItems: 'stretch', alignContent: 'start' }}>
      <GsCoverButton art={g.art} label={'Open ' + g.name} onClick={open} />
      <div className="gs-title-row">
        <h3 className="mcp-t-card"><button type="button" className="gs-titlebtn" onClick={open}>{g.name}</button></h3>
        {mark && <DS.Tag kind="daily" icon="check">{mark}</DS.Tag>}
      </div>
      <p className="gs-muted">{g.blurb}</p>
      <GsTagList tags={g.tags} ed={g.ed} />
    </DS.Card>
  );
};

// ---- Chat window: player right in a bubble, assistant plain left, server in a panel
const GsChat = ({ caption, framed, children }) => (
  <figure className={'gs-chat' + (framed ? ' is-framed' : '')}>
    <div className="gs-chat-bar">
      {framed && <span className="gs-win-dots" aria-hidden="true"><i /><i /><i /></span>}
      <span>Your AI app</span>
    </div>
    <div className="gs-chat-body">{children}</div>
    {framed && (
      <div className="gs-composer" aria-hidden="true">
        <span>Reply to your AI</span>
        <span className="gs-composer-send"><DS.Icon name="back" size={16} style={{ transform: 'rotate(90deg)' }} /></span>
      </div>
    )}
    {caption && <figcaption className="gs-chat-cap">{caption}</figcaption>}
  </figure>
);
const GsMe = ({ children }) => <p className="gs-me">{children}</p>;
const GsAi = ({ children }) => <p className="gs-ai">{children}</p>;
const GsPanel = ({ label, children }) => (
  <div className="gs-panel"><span className="gs-panel-label"><img src="assets/logo.svg" alt="" width="16" height="16" />[PLATFORM] · {label}</span>{children}</div>
);
const GsUp = () => <DS.Icon name="back" size={14} style={{ transform: 'rotate(90deg)' }} />;
// ---- Product in use: a real screenshot from assets/in-use/, never a drawn chat
const GS_SHOTS = {
  dailyWord: { src: 'assets/in-use/daily-word-claude-code-2026-10-05.png', w: 1840, h: 1498, cropH: 790,
    alt: 'Daily Word being played in Claude Code: each guess and the board after it.' },
};
// zoom: the image opens whole in a panel, sized to fit the screen (a sheet on a phone, a window on desktop).
const GsShot = ({ id, crop, caption, className, zoom }) => {
  const s = GS_SHOTS[id];
  const [open, setOpen] = React.useState(false);
  const img = <img src={s.src} alt={s.alt} width={s.w} height={s.h} style={crop ? { aspectRatio: s.w + ' / ' + s.cropH } : null} className={crop ? 'is-crop' : ''} />;
  return (
    <figure className={'gs-shot' + (zoom ? ' is-zoom' : '') + (className ? ' ' + className : '')}>
      {zoom ? <button type="button" className="gs-shot-btn" aria-label="View the screenshot full size" onClick={() => setOpen(true)}>
        {img}<span className="gs-shot-hint" aria-hidden="true">View full size</span>
      </button> : img}
      {caption && <figcaption className="gs-chat-cap">{caption}</figcaption>}
      {zoom && <div className="gs-zoom">
        <DS.Popup open={open} onClose={() => setOpen(false)} kind="panel" label="Screenshot, full size">
          <img className="gs-zoom-img" src={s.src} alt={s.alt} width={s.w} height={s.h} />
        </DS.Popup>
      </div>}
    </figure>
  );
};

// ---- User menu. Trigger: avatar, name, email, chevron. Panel: identity header,
// Manage account, Your AI, divider, Sign out. On a phone the Menu button opens the
// same items at the button, with Games and History above.
const GsAvatar = ({ big }) => {
  const gs = useGs();
  return <span className={'gs-avatar' + (big ? ' is-big' : '')} aria-hidden="true">{gsName(gs.user)[0].toUpperCase()}</span>;
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
const GsUserMenu = () => {
  const gs = useGs();
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef(null);
  gsUseMenuDismiss(open, setOpen, wrap);
  return (
    <div className="gs-acct" ref={wrap}>
      <button type="button" className="gs-acct-btn" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((o) => !o)}>
        <GsAvatar />
        <span className="gs-acct-who"><span className="gs-strong">{gsName(gs.user)}</span><span className="gs-small">{gs.user.email}</span></span>
        <DS.Icon name="down" />
      </button>
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
        <button type="button" className="gs-brand" aria-label="[Platform], home" onClick={() => gs.go(out ? 'home' : 'games')}><GsMark /><span>[Platform]</span></button>
        <nav className="gs-nav" aria-label="Main">
          {links.map(([id, l, fn]) => <button key={id} type="button" className="gs-navlink" aria-current={cur === id ? 'page' : undefined} onClick={fn}>{l}</button>)}
        </nav>
        <div className="gs-top-end">
          {out ? (
            <div className="gs-wide-only">
              <DS.Button variant="secondary" onClick={() => gs.go('signin')}>Sign in</DS.Button>
              <DS.Button onClick={gs.startFree}>Start free</DS.Button>
            </div>
          ) : <div className="gs-wide-only"><GsUserMenu /></div>}
          <div className="gs-narrow-only gs-menu-anchor" ref={mwrap}>
            <DS.Button variant="secondary" aria-expanded={menu} aria-haspopup="menu" onClick={() => setMenu((m) => !m)}>Menu</DS.Button>
            {menu && (
              <div className="gs-pop" role="menu" aria-label="Menu">
                {links.map(([id, l, fn]) => <button key={id} type="button" role="menuitem" className="gs-menu-item" aria-current={cur === id ? 'page' : undefined} onClick={() => pick(fn)}>{l}</button>)}
                {out && <button type="button" role="menuitem" className="gs-menu-item" onClick={() => pick(() => gs.go('signin'))}>Sign in</button>}
                {out ? <div className="gs-pop-cta"><DS.Button block onClick={() => pick(gs.startFree)}>Start free</DS.Button></div>
                  : <><div className="gs-menu-div" role="separator" /><GsIdentityHead /><GsUserItems role="menuitem" pick={pick} /></>}
              </div>
            )}
          </div>
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

Object.assign(window, {
  GsCover, GsCoverButton, GsArt, useGsArtHost, GsPassTag, GsTagList, GsSteps, GsWhoCols, GsCompare, GsStat, GsTrack, GsSoonCard, GsGameCard,
  GsChat, GsMe, GsAi, GsPanel, GsUp, GsShot, GsUserMenu, GsTopBar, GsDemoBar, GsPlayPopup, gsUseMenuDismiss,
});
