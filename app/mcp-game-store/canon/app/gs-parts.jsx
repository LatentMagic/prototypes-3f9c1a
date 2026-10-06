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
const GS_FREE_LIST = ['Today’s puzzles', 'Nothing is kept'];
const GS_PASS_LIST = ['Everything free', 'Plus the weekly games', 'Plus past puzzles', 'Plus your streak and your record'];
const GsCompare = ({ passFoot }) => (
  <div className="gs-grid2">
    <DS.Card style={{ gap: 12, justifyItems: 'stretch', alignContent: 'start' }}>
      <h3 className="mcp-t-card">Not paying</h3>
      <ul className="gs-plain">{GS_FREE_LIST.map((x) => <li key={x}>{x}</li>)}</ul>
    </DS.Card>
    <DS.Card style={{ gap: 12, justifyItems: 'stretch', alignContent: 'start' }}>
      <h3 className="mcp-t-card">Paying</h3>
      <ul className="gs-plain">{GS_PASS_LIST.map((x) => <li key={x}>{x}</li>)}</ul>
      {passFoot}
    </DS.Card>
  </div>
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
const GsWordChat = ({ framed }) => (
  <GsChat framed={framed} caption={framed ? null : 'Each guess goes to the server, which checks it and keeps count.'}>
    <GsMe>Third guess: TORUS.</GsMe>
    <GsPanel label="WORD PUZZLE">
      <span className="gs-strong">Guess 3 of 6</span>
      <div className="gs-tiles" role="img" aria-label="Letters found: T, O, R, then two unknown">
        {['T', 'O', 'R', '', ''].map((l, i) => <span key={i} className={l ? 'is-on' : ''}>{l}</span>)}
      </div>
    </GsPanel>
    <GsAi>Three letters in place. Two to find, and three guesses left to find them.</GsAi>
  </GsChat>
);

// ---- Account popover (desktop). On a phone the same items sit in the menu sheet.
const GsAccountMenu = ({ items }) => {
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef(null); const btn = React.useRef(null);
  React.useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); btn.current && btn.current.focus(); } };
    document.addEventListener('pointerdown', onDoc); document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);
  return (
    <div className="gs-acct" ref={wrap}>
      <button ref={btn} type="button" className="gs-navlink gs-acct-btn" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((o) => !o)}>
        Account <DS.Icon name="down" />
      </button>
      {open && (
        <div className="gs-pop" role="menu">
          {items.map(([l, fn]) => <button key={l} type="button" role="menuitem" className="gs-menu-item" onClick={() => { setOpen(false); btn.current && btn.current.focus(); fn(); }}>{l}</button>)}
        </div>
      )}
    </div>
  );
};

// ---- Shared top bar -------------------------------------------------------------
const GsTopBar = () => {
  const gs = useGs();
  const [menu, setMenu] = React.useState(false);
  const out = gs.view === 'out';
  const cur = gs.route.name;
  const links = out
    ? [['games', 'Games', () => gs.go('games')], ['how', 'How it works', gs.goHow], ['pass', 'Pricing', () => gs.go('pass')]]
    : [['games', 'Games', () => gs.go('games')], ['history', 'History', () => gs.go('history')]];
  const acct = [['Your AI', () => gs.go('connect')], ['Pass', () => gs.go('pass')], ['Sign out', gs.signOut]];
  const sheetItems = [...links.map(([, l, fn]) => [l, fn]), ...(out ? [['Sign in', () => gs.go('signin')]] : acct)];
  const pick = (fn) => { setMenu(false); fn(); };
  return (
    <header className="gs-top">
      <div className="gs-wrap gs-top-in">
        <button type="button" className="gs-brand" aria-label="[Platform], home" onClick={() => gs.go(out ? 'home' : 'games')}><img className="gs-brand-mark" src="assets/logo.svg" alt="" width="32" height="32" /><span>[Platform]</span></button>
        <nav className="gs-nav" aria-label="Main">
          {links.map(([id, l, fn]) => <button key={id} type="button" className="gs-navlink" aria-current={cur === id ? 'page' : undefined} onClick={fn}>{l}</button>)}
        </nav>
        <div className="gs-top-end">
          {out ? (
            <div className="gs-wide-only">
              <button type="button" className="gs-navlink" onClick={() => gs.go('signin')}>Sign in</button>
              <DS.Button onClick={gs.startFree}>Start free</DS.Button>
            </div>
          ) : <div className="gs-wide-only"><GsAccountMenu items={acct} /></div>}
          <div className="gs-narrow-only"><DS.Button variant="secondary" onClick={() => setMenu(true)}>Menu</DS.Button></div>
        </div>
      </div>
      <DS.Popup open={menu} onClose={() => setMenu(false)} title="Menu" posture={gs.narrow ? 'sheet' : 'window'}>
        <div className="gs-menu-list">
          {sheetItems.map(([l, fn]) => <button key={l} type="button" className="gs-menu-item" onClick={() => pick(fn)}>{l}</button>)}
        </div>
        {out && <DS.Button block onClick={() => pick(gs.startFree)}>Start free</DS.Button>}
      </DS.Popup>
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
      <div><DS.TextLink onClick={() => gs.go('session', { id: p.session })}>See a finished session (demo)</DS.TextLink></div>
      <DS.Button variant="secondary" block onClick={gs.closePlay}>Close</DS.Button>
    </DS.Popup>
  );
};

Object.assign(window, {
  GsCover, GsCoverButton, GsPassTag, GsTagList, GsSteps, GsWhoCols, GsCompare, GsStat, GsTrack, GsSoonCard, GsGameCard,
  GsChat, GsMe, GsAi, GsPanel, GsUp, GsWordChat, GsAccountMenu, GsTopBar, GsDemoBar, GsPlayPopup,
});
