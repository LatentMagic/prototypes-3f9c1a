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
const GsPassTag = () => {
  const gs = useGs();
  return (
    <button type="button" className="gs-tagbtn" aria-label="Pass. See the Pass" onClick={() => gs.go('pass')}>
      <DS.Tag kind="locked">Pass</DS.Tag>
    </button>
  );
};
const GsTagList = ({ tags }) => (
  <div className="gs-tags">
    {tags.map((t, i) => t === 'FREE' ? <DS.Tag key={i} kind="free">Free</DS.Tag>
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
    <div className="gs-stack-sm"><h3 className="mcp-t-card">Our server</h3><p className="gs-muted">{server}</p></div>
  </div>
);
// The Pass page's comparison. One row per thing you get; a tick in each column that has it.
const GS_COMPARE = [
  { name: 'Daily Puzzles', sub: 'Short puzzles that change every day.', free: true },
  { name: 'Your results, past plays and streak', free: true },
  { name: 'Sharing a result', free: true },
  { name: GS_NAME.casebook + ', Delve and ' + GS_NAME.hunter, free: false },
  { name: 'Everything you missed', sub: 'Every earlier edition of the daily and weekly games, ready to play.', free: false },
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
      <GsTagList tags={g.tags} />
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
const GsShot = ({ id, crop, caption, className }) => {
  const s = GS_SHOTS[id];
  return (
    <figure className={'gs-shot' + (className ? ' ' + className : '')}>
      <img src={s.src} alt={s.alt} width={s.w} height={s.h} style={crop ? { aspectRatio: s.w + ' / ' + s.cropH } : null} className={crop ? 'is-crop' : ''} />
      {caption && <figcaption className="gs-chat-cap">{caption}</figcaption>}
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
        : icon ? (icon === 'logout' ? <GsGlyph name="logout" /> : <DS.Icon name={icon} />) : <span className="gs-ico-space" />}{label}
    </button>
  );
  return <>
    {item('acct', 'settings', 'Manage account', () => gs.go('account', { from: gs.route }))}
    {item('ai', null, 'Your AI', () => gs.go('connect'))}
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
  const cur = gs.route.name;
  const links = out
    ? [['games', 'Games', () => gs.go('games')], ['how', 'How it works', gs.goHow], ['pass', 'Pricing', () => gs.go('pass')]]
    : [['games', 'Games', () => gs.go('games')], ['history', 'History', () => gs.go('history')]];
  const pick = (fn) => { setMenu(false); fn(); };
  return (
    <header className="gs-top">
      <div className="gs-wrap gs-top-in">
        <button type="button" className="gs-brand" aria-label="[Platform], home" onClick={() => gs.go(out ? 'home' : 'games')}><GsMark /><span>[Platform]</span></button>
        <nav className="gs-nav" aria-label="Main">
          {links.map(([id, l, fn], i) => <React.Fragment key={id}>
            {id === 'games' && window.GsGamesNav ? <window.GsGamesNav /> : <button type="button" className="gs-navlink" aria-current={cur === id ? 'page' : undefined} onClick={fn}>{l}</button>}
            {i === 0 && window.GsNavExtra && <window.GsNavExtra />}
          </React.Fragment>)}
        </nav>
        <div className="gs-top-end">
          {out ? (
            <div className="gs-wide-only">
              <button type="button" className="gs-navlink" onClick={() => gs.go('signin')}>Sign in</button>
              <DS.Button onClick={gs.startFree}>Start free</DS.Button>
            </div>
          ) : <div className="gs-wide-only"><GsUserMenu /></div>}
          <div className="gs-narrow-only gs-menu-anchor" ref={mwrap}>
            <DS.Button variant="secondary" aria-expanded={menu} aria-haspopup="menu" onClick={() => setMenu((m) => !m)}>Menu</DS.Button>
            {menu && (
              <div className="gs-pop" role="menu" aria-label="Menu">
                {links.map(([id, l, fn], i) => <React.Fragment key={id}>
                  {id === 'games' && window.GsGamesNavMenu ? <window.GsGamesNavMenu pick={pick} /> : <button type="button" role="menuitem" className="gs-menu-item" onClick={() => pick(fn)}>{l}</button>}
                  {i === 0 && window.GsNavExtraMenu && <window.GsNavExtraMenu pick={pick} />}
                </React.Fragment>)}
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
const GsDemoBar = () => {
  const gs = useGs();
  const opts = [['out', 'signed out'], ['free', 'free'], ['pass', 'Pass']];
  return (
    <div className="gs-demo" role="group" aria-label="Demo view, not part of the product">
      <div className="gs-demo-in">
        <span>Demo view:</span>
        {opts.map(([v, l], i) => (
          <React.Fragment key={v}>
            {i > 0 && <span aria-hidden="true">/</span>}
            <button type="button" className="gs-demo-opt" aria-pressed={gs.view === v} onClick={() => gs.setDemoView(v)}>{l}</button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// ---- "Play in your AI" pop-up (shown once connected) -----------------------------
const GsPlayPopup = () => {
  const gs = useGs();
  const last = React.useRef(null);
  if (gs.playing) last.current = gs.playing;
  const p = last.current;
  return (
    <DS.Popup open={!!gs.playing} onClose={gs.closePlay} posture={gs.narrow ? 'sheet' : 'window'}
      title={p ? 'Tell your AI: let’s play ' + p.name + '.' : ''} label="Play in your AI">
      <DS.Button variant="secondary" block onClick={gs.closePlay}>Close</DS.Button>
    </DS.Popup>
  );
};

Object.assign(window, {
  GsCover, GsCoverButton, GsPassTag, GsTagList, GsSteps, GsWhoCols, GsCompare, GsStat, GsTrack, GsSoonCard, GsGameCard,
  GsChat, GsMe, GsAi, GsPanel, GsUp, GsShot, GsUserMenu, GsTopBar, GsDemoBar, GsPlayPopup, gsUseMenuDismiss,
});
