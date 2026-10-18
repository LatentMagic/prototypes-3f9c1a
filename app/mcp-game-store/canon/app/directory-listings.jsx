// ============================================================================
// Directory listings (PROTOTYPE REVIEW AID, not product UI). Droppable module.
// Two full-screen mocks: MCP Games on the Claude connector directory and on the
// ChatGPT plugins page, in each directory's own look (an exception to the design
// law for these two routes only).
// Absent ⇒ the two routes render nothing and the register group is not there.
// ============================================================================
const DL_PHONE = 768;
const DL_LOGO = 'assets/logo.svg';

// Fonts and the few rules that cannot be inline (focus, scrollbars), added once.
(function dlHead() {
  if (document.getElementById('dl-head')) return;
  const l = document.createElement('link');
  l.id = 'dl-head'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,400&display=swap';
  document.head.appendChild(l);
  const s = document.createElement('style');
  s.textContent = '.dl-page :focus-visible{outline:2px solid #0B0B0B;outline-offset:2px}'
    + '.dl-page button{font:inherit;color:inherit}'
    + '.dl-page a:hover{text-decoration-thickness:2px}'
    + '.dl-scroll{scrollbar-width:none}.dl-scroll::-webkit-scrollbar{display:none}';
  document.head.appendChild(s);
})();

const dlSvg = (d, size = 20, sw = 1.6) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);
const DL_I = {
  back: <path d="M19 12H5M11 6l-6 6 6 6" />,
  link: <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
  out: <path d="M7 17 17 7M8 7h9v9" />,
  prev: <path d="M15 6l-6 6 6 6" />,
  next: <path d="M9 6l6 6-6 6" />,
  ext: <><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  panel: <><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M9 4v16" /></>,
  pen: <><path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" /><path d="M17.5 3.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z" /></>,
  images: <><rect x="3" y="7" width="13" height="13" rx="2" /><path d="M8 4h11a2 2 0 0 1 2 2v11" /><path d="m3 17 4-4 5 5" /></>,
  plugin: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.5" /><path d="M15.5 12v1.5a2 2 0 0 0 4 0V12" /></>,
  scope: <><path d="m4 15 9-6 2 3-9 6z" /><path d="m13 9 3-2 3 4-3 2" /><path d="M9 18l-2 3M11 17l2 4" /></>,
  plans: <><path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z" /><path d="M12 9v6M9 12h6" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" /></>,
  help: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><path d="m5.6 5.6 3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
};
const dlIcon = (n, size, sw) => dlSvg(DL_I[n], size, sw);
const useDlPhone = () => { const gs = useGs(); return gs.width < DL_PHONE; };
// Lines named here render bold; no character changes.
const dlText = (text, heads) => text.split('\n').map((l, i) => (
  <React.Fragment key={i}>{i > 0 ? '\n' : null}{heads.includes(l) ? <strong style={{ fontWeight: 600 }}>{l}</strong> : l}</React.Fragment>
));
const DL_HEADS = ['WHAT YOU CAN PLAY', 'HOW IT WORKS'];
const dlGames = (ai) => 'MCP Games is a library of small games you play by talking to ' + ai + '. ' + ai + ' does the talking: it sets the scene, plays the characters and follows what you say. The game keeps the score. It holds the rules, the dice and your record, so ' + ai + ' can\'t bend the rules or fudge a roll.\n\nYou need an MCP Games account to play. Sign in when you connect. One connection covers every game in the library, and a game you start in one chat carries on in the next.\n\nWHAT YOU CAN PLAY\n• Daily puzzles. A new word puzzle every day.\n• Mysteries. Read the clues, question the people involved and name who did it.\n• Adventures. Explore, take risks and let the dice decide what happens.\n\nHOW IT WORKS\n• Ask ' + ai + ' what you can play. It lists every game in the library today, how often each one has something new, and how far you have got.\n• Name a game to start it, or ask for the kind of game you want.\n• Every guess, roll and move goes to the game, which decides what happens and keeps count. ' + ai + ' describes what happened.\n• When you finish, share your result without giving the answer away.';

// ---- Claude connector directory --------------------------------------------------
const DLC = { page: '#F9F9F7', head: '#FCFCFB', ink: '#0B0B0B', grey: '#52514E', label: '#898781', line: '#E1E1DF', link: '#184F95', chip: '#EDEDEB', clay: '#D97757',
  sans: '"Instrument Sans", ui-sans-serif, system-ui, sans-serif', serif: '"Source Serif 4", Georgia, serif', mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' };
const DLC_ONELINER = 'Your AI does the talking. The game keeps the score. Play daily puzzles, mysteries and dice adventures in the chat.';
const DLC_TOOLS = ['games_library', 'games_start', 'games_move', 'games_read', 'games_look', 'games_manual', 'games_hint', 'games_share', 'games_stop', 'games_abandon'];
const DLC_GALLERY = [['word', 'Daily Word'], ['casebook', 'Casebook'], ['barrow', 'The Barrow of Hollowmere']];

const dlcS = {
  page: { minHeight: '100%', flex: 1, background: DLC.page, color: DLC.ink, font: '400 16px/1.5 ' + DLC.sans, WebkitFontSmoothing: 'antialiased' },
  head: { background: DLC.head, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' },
  headPhone: { background: DLC.head, padding: '8px 16px 0' },
  brand: { display: 'flex', alignItems: 'center', gap: 6, fontFamily: DLC.serif, fontSize: 22, letterSpacing: '-0.01em', color: DLC.ink },
  headRight: { display: 'flex', alignItems: 'center', gap: 24 },
  copy: { display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 0, padding: 0, fontSize: 15, cursor: 'pointer' },
  signIn: { height: 30, padding: '0 10px', background: '#fff', border: '1px solid ' + DLC.line, borderRadius: 6, fontSize: 14, cursor: 'pointer' },
  col: { maxWidth: 960, margin: '0 auto', padding: '0 24px' },
  colPhone: { padding: '0 16px' },
  back: { display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 15, color: DLC.ink, textDecoration: 'none', marginTop: 28 },
  titleGrid: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 288px', columnGap: 32, alignItems: 'center', marginTop: 16, paddingBottom: 28, borderBottom: '1px solid ' + DLC.line },
  titleLeft: { display: 'flex', gap: 20, alignItems: 'center', minWidth: 0 },
  tile: { width: 80, height: 80, flex: 'none', background: '#fff', border: '1px solid ' + DLC.line, borderRadius: 8, display: 'grid', placeItems: 'center' },
  nameRow: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  name: { margin: 0, fontFamily: DLC.serif, fontWeight: 400, fontSize: 44, lineHeight: 1.1, letterSpacing: '-0.01em' },
  namePhone: { margin: 0, fontFamily: DLC.serif, fontWeight: 400, fontSize: 24, lineHeight: 1.2 },
  tag: { background: DLC.chip, borderRadius: 6, fontSize: 14, lineHeight: '20px', padding: '4px 12px', color: DLC.grey },
  tagPhone: { background: DLC.chip, borderRadius: 6, fontSize: 12, lineHeight: '16px', padding: '2px 8px', color: DLC.grey },
  oneLiner: { margin: '4px 0 0', color: DLC.grey, fontSize: 16, lineHeight: '24px', textWrap: 'pretty' },
  add: { height: 40, padding: '0 16px', background: DLC.ink, color: '#fff', border: 0, borderRadius: 8, fontSize: 16, fontWeight: 500, cursor: 'pointer', justifySelf: 'start' },
  notice: { display: 'flex', gap: 12, alignItems: 'flex-start', marginTop: 28, background: DLC.head, border: '1px solid ' + DLC.line, borderRadius: 12, padding: '16px 20px', fontSize: 15, lineHeight: '20px' },
  noticeIcon: { flex: 'none', marginTop: 0, color: DLC.grey, display: 'flex' },
  a: { color: DLC.link, textDecoration: 'underline', textUnderlineOffset: 3 },
  body: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 288px', columnGap: 32, marginTop: 36 },
  desc: { margin: 0, whiteSpace: 'pre-wrap', fontSize: 16, lineHeight: '26px', textWrap: 'pretty' },
  gallery: { display: 'flex', gap: 16, overflowX: 'auto', marginTop: 56, paddingBottom: 4, scrollSnapType: 'x mandatory', overscrollBehaviorX: 'contain' },
  card: { flex: '0 0 calc((100% - 16px) / 2)', minWidth: 0, scrollSnapAlign: 'start', background: '#fff', border: '1px solid ' + DLC.line, borderRadius: 16, padding: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' },
  arrows: { display: 'flex', gap: 8, marginTop: 16 },
  arrowBtn: { width: 32, height: 32, display: 'grid', placeItems: 'center', background: 'none', border: 0, borderRadius: 6, cursor: 'pointer' },
  toolsH: { margin: '64px 0 20px', fontSize: 22, fontWeight: 400, lineHeight: '28px' },
  tools: { display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(5, auto)', gridAutoFlow: 'column', gap: '8px 16px', justifyItems: 'start' },
  toolsPhone: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gridTemplateRows: 'repeat(5, auto)', gridAutoFlow: 'column', gap: '8px 16px', justifyItems: 'start' },
  tool: { background: DLC.chip, borderRadius: 6, padding: '4px 12px', fontSize: 14, lineHeight: '20px', color: DLC.grey, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  facts: { display: 'flex', flexDirection: 'column', gap: 24 },
  label: { fontSize: 13, lineHeight: '16px', letterSpacing: '0.04em', textTransform: 'uppercase', color: DLC.label, marginBottom: 6 },
  value: { fontSize: 15, lineHeight: '22px' },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  chip: { background: '#fff', border: '1px solid ' + DLC.line, borderRadius: 6, padding: '2px 8px', fontSize: 14, lineHeight: '20px' },
  url: { fontFamily: DLC.mono, fontSize: 14, lineHeight: '20px', overflowWrap: 'anywhere' },
  more: { display: 'flex', flexDirection: 'column', gap: 4 },
  outLink: { color: DLC.link, textDecoration: 'underline', textUnderlineOffset: 3, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 15, width: 'fit-content' },
  rule: { border: 0, borderTop: '1px solid ' + DLC.line, margin: '56px 0 40px' },
  factsPhone: { display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 16 },
  foot: { textAlign: 'center', color: DLC.grey, fontSize: 14, lineHeight: '18px', padding: '80px 16px 48px', textWrap: 'pretty' },
  footA: { color: DLC.grey, textDecoration: 'underline', textUnderlineOffset: 3 },
};
const dlNoGo = (e) => e.preventDefault();

const DlClaudeMark = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" stroke={DLC.clay} strokeWidth="2.4" strokeLinecap="round">
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => (
      <line key={a} x1="12" y1="12" x2="12" y2={i % 2 ? 3.5 : 1.5} transform={'rotate(' + (a + (i % 3) * 4) + ' 12 12)'} />
    ))}
  </svg>
);

const DlcFact = ({ label, children }) => (
  <div><div style={dlcS.label}>{label}</div>{children}</div>
);
const DlcOut = ({ title, children }) => (
  <a href="#" title={title} onClick={dlNoGo} style={dlcS.outLink}>{children}{dlIcon('out', 16, 1.8)}</a>
);
const DlcFacts = ({ phone }) => {
  const made = <DlcFact label="Made by"><DlcOut>Harness Intent Ltd</DlcOut></DlcFact>;
  const cats = <DlcFact label="Categories"><div style={dlcS.chips}><span style={dlcS.chip}>Games</span><span style={dlcS.chip}>Problems &amp; puzzles</span></div></DlcFact>;
  const sign = <DlcFact label="Sign-in"><div style={dlcS.value}>Required</div></DlcFact>;
  const url = <DlcFact label="Connector URL"><div style={dlcS.url}>https://&lt;domain&gt;/mcp</div></DlcFact>;
  const more = (
    <DlcFact label="More info">
      <div style={dlcS.more}>
        <DlcOut title="<domain>/how-it-works">Documentation</DlcOut>
        <DlcOut title="support@harnessintent.com">Support</DlcOut>
        <DlcOut title="<domain>/privacy">Privacy Policy</DlcOut>
      </div>
    </DlcFact>
  );
  if (phone) return (
    <div style={dlcS.factsPhone}>
      <div style={dlcS.facts}>{made}{cats}{sign}</div>
      <div style={dlcS.facts}>{url}{more}</div>
    </div>
  );
  return <div style={dlcS.facts}>{made}{cats}{sign}{url}{more}</div>;
};

const DlcGallery = ({ phone }) => {
  const row = React.useRef(null);
  const [ends, setEnds] = React.useState([true, false]);
  const onScroll = () => { const el = row.current; if (el) setEnds([el.scrollLeft < 4, el.scrollLeft + el.clientWidth > el.scrollWidth - 4]); };
  const step = (d) => { const el = row.current; if (el) el.scrollBy({ left: d * (el.firstChild ? el.firstChild.offsetWidth + 16 : 300), behavior: 'smooth' }); };
  return (
    <div>
      <div ref={row} onScroll={onScroll} className="dl-scroll" style={phone ? { ...dlcS.gallery, marginTop: 40 } : dlcS.gallery}>
        {DLC_GALLERY.map(([id, name]) => (
          <div key={id} style={phone ? { ...dlcS.card, flex: '0 0 calc(100% - 24px)' } : dlcS.card}>
            <GsChatPic turns={GS_CHATS[id][1].turns} width={640} height={262} label={name + ' being played in a chat'} />
          </div>
        ))}
      </div>
      {(
        <div style={dlcS.arrows}>
          <button type="button" aria-label="Previous" disabled={ends[0]} style={{ ...dlcS.arrowBtn, opacity: ends[0] ? 0.3 : 1, cursor: ends[0] ? 'default' : 'pointer' }} onClick={() => step(-1)}>{dlIcon('prev', 18)}</button>
          <button type="button" aria-label="Next" disabled={ends[1]} style={{ ...dlcS.arrowBtn, opacity: ends[1] ? 0.3 : 1, cursor: ends[1] ? 'default' : 'pointer' }} onClick={() => step(1)}>{dlIcon('next', 18)}</button>
        </div>
      )}
    </div>
  );
};

const DlcTools = ({ phone }) => (
  <section>
    <h2 style={phone ? { ...dlcS.toolsH, marginTop: 48 } : dlcS.toolsH}>Tools</h2>
    <div style={phone ? dlcS.toolsPhone : dlcS.tools}>
      {DLC_TOOLS.map((t) => <span key={t} style={dlcS.tool}>{t}</span>)}
    </div>
  </section>
);

const DlClaudeListing = () => {
  const phone = useDlPhone();
  const notice = (
    <div style={phone ? { ...dlcS.notice, marginTop: 28, padding: '16px 16px' } : dlcS.notice}>
      <span style={dlcS.noticeIcon}>{dlIcon('info', 16)}</span>
      <p style={{ margin: 0 }}>Community connectors have undergone automated reviews but aren&rsquo;t verified by Anthropic. We don&rsquo;t control the tools they make available and can&rsquo;t guarantee they&rsquo;ll work as intended or won&rsquo;t change, so only connect developers you trust. <a href="#" onClick={dlNoGo} style={dlcS.a}>Learn more</a>.</p>
    </div>
  );
  const desc = <p style={dlcS.desc}>{dlText(dlGames('Claude'), DL_HEADS)}</p>;
  const logo = (size) => <img src={DL_LOGO} alt="" width={size} height={size} style={{ display: 'block' }} />;
  return (
    <main className="dl-page" style={dlcS.page} aria-label="Directory listing mock: Claude connector">
      {phone ? (
        <header style={dlcS.headPhone}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <span style={dlcS.brand}><DlClaudeMark />Claude</span>
            <button type="button" style={dlcS.signIn}>Sign in</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 22px 8px 0' }}>
            <button type="button" aria-label="Copy link" style={dlcS.copy}>{dlIcon('link', 20)}</button>
          </div>
        </header>
      ) : (
        <header style={dlcS.head}>
          <span style={dlcS.brand}><DlClaudeMark />Claude</span>
          <div style={dlcS.headRight}>
            <button type="button" style={dlcS.copy}>{dlIcon('link', 18)}Copy link</button>
            <button type="button" style={dlcS.signIn}>Sign in</button>
          </div>
        </header>
      )}
      <div style={phone ? dlcS.colPhone : dlcS.col}>
        <a href="#" onClick={dlNoGo} style={phone ? { ...dlcS.back, marginTop: 20 } : dlcS.back}>{dlIcon('back', 16, 1.8)}Directory</a>
        {phone ? (
          <div style={{ marginTop: 16, paddingBottom: 28, borderBottom: '1px solid ' + DLC.line }}>
            <div style={dlcS.tile}>{logo(56)}</div>
            <div style={{ ...dlcS.nameRow, marginTop: 16 }}>
              <h1 style={dlcS.namePhone}>MCP Games</h1>
              <span style={dlcS.tagPhone}>Community</span>
            </div>
            <p style={dlcS.oneLiner}>{DLC_ONELINER}</p>
            <button type="button" style={{ ...dlcS.add, marginTop: 16 }}>Sign in to add</button>
          </div>
        ) : (
          <div style={dlcS.titleGrid}>
            <div style={dlcS.titleLeft}>
              <div style={dlcS.tile}>{logo(56)}</div>
              <div style={{ minWidth: 0 }}>
                <div style={dlcS.nameRow}>
                  <h1 style={dlcS.name}>MCP Games</h1>
                  <span style={dlcS.tag}>Community</span>
                </div>
                <p style={dlcS.oneLiner}>{DLC_ONELINER}</p>
              </div>
            </div>
            <button type="button" style={dlcS.add}>Sign in to add</button>
          </div>
        )}
        {notice}
        {phone ? (
          <div style={{ marginTop: 36 }}>
            {desc}
            <DlcGallery phone />
            <DlcTools phone />
            <hr style={dlcS.rule} />
            <DlcFacts phone />
          </div>
        ) : (
          <div style={dlcS.body}>
            <div style={{ minWidth: 0 }}>{desc}<DlcGallery /><DlcTools /></div>
            <aside><DlcFacts /></aside>
          </div>
        )}
      </div>
      <p style={dlcS.foot}>Submission to the Directory is governed by the <a href="#" onClick={dlNoGo} style={dlcS.footA}>Software Directory Terms</a>; use of Connectors is governed by your <a href="#" onClick={dlNoGo} style={dlcS.footA}>relevant terms</a>.</p>
    </main>
  );
};

// ---- ChatGPT plugins page ----------------------------------------------------------
const DLG = { ink: '#0D0D0D', grey: '#5D5D5D', line: '#E5E5E5', sel: '#ECECEC', blue: '#1F43B1',
  sans: '-apple-system, BlinkMacSystemFont, Inter, "Segoe UI", Helvetica, Arial, sans-serif' };
const DLG_PROMPTS = ['What can I play today?', 'Give me today\'s word puzzle.', 'I want a mystery to solve.'];
const DLG_INFO = [['Developer', 'Harness Intent Ltd'], ['Category', 'Entertainment'], ['Website', null, '<domain>'], ['Version', '1.0.0'], ['Privacy Policy', null, '<domain>/privacy'], ['Terms of Service', null, '<domain>/terms']];

const dlgS = {
  page: { flex: 1, minHeight: '100%', display: 'flex', background: '#fff', color: DLG.ink, font: '400 15px/1.4 ' + DLG.sans, WebkitFontSmoothing: 'antialiased' },
  side: { width: 260, flex: 'none', borderRight: '1px solid ' + DLG.line, position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', padding: '20px 12px 20px' },
  sideTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px 0 8px', marginBottom: 16 },
  sideIcons: { display: 'flex', gap: 16 },
  iconBtn: { width: 24, height: 24, display: 'grid', placeItems: 'center', background: 'none', border: 0, padding: 0, cursor: 'pointer' },
  nav: { display: 'flex', flexDirection: 'column', gap: 4 },
  item: { display: 'flex', alignItems: 'center', gap: 10, height: 44, padding: '0 10px', borderRadius: 8, fontSize: 15, background: 'none', border: 0, textAlign: 'left', cursor: 'pointer', width: '100%' },
  itemSel: { background: DLG.sel },
  sideFoot: { marginTop: 'auto', display: 'flex', flexDirection: 'column' },
  tailor: { borderTop: '1px solid ' + DLG.line, marginTop: 12, padding: '16px 8px 0' },
  tailorH: { fontSize: 14, fontWeight: 600, margin: 0 },
  tailorP: { fontSize: 13, lineHeight: '20px', color: DLG.grey, margin: '8px 0 12px' },
  outPill: { width: '100%', height: 40, borderRadius: 999, border: '1px solid ' + DLG.line, background: '#fff', fontSize: 15, cursor: 'pointer' },
  main: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' },
  top: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, padding: '0 20px' },
  topPhone: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, padding: '0 20px 0 16px' },
  crumb: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 15, background: 'none', border: 0, padding: 0, cursor: 'pointer' },
  blackPill: { height: 40, padding: '0 18px', borderRadius: 999, background: DLG.ink, color: '#fff', border: 0, fontSize: 15, fontWeight: 500, cursor: 'pointer', flex: 'none' },
  col: { width: '100%', maxWidth: 776, margin: '0 auto', padding: '36px 18px 96px' },
  colPhone: { padding: '4px 16px 64px' },
  tile: { width: 56, height: 56, borderRadius: 12, border: '1px solid ' + DLG.line, display: 'grid', placeItems: 'center', background: '#fff' },
  nameRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginTop: 40 },
  name: { margin: 0, fontSize: 28, fontWeight: 600, lineHeight: '34px', letterSpacing: '-0.01em' },
  sub: { margin: '4px 0 0', fontSize: 15, color: DLG.grey },
  banner: { margin: '24px 8px 0', borderRadius: 20, minHeight: 228, padding: '28px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
    background: 'radial-gradient(ellipse 40% 30% at 32% 22%, rgba(255,255,255,0.55), transparent 70%), radial-gradient(ellipse 30% 30% at 82% 92%, rgba(255,255,255,0.5), transparent 70%), linear-gradient(90deg, #AACCF2 0%, #BCC8F4 50%, #C8C4F6 100%)' },
  pill: { display: 'flex', alignItems: 'center', gap: 8, minHeight: 44, padding: '8px 8px 8px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.82)', fontSize: 16, lineHeight: '24px', maxWidth: '100%' },
  pillPhone: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 8px 8px 8px', borderRadius: 12, background: 'rgba(255,255,255,0.82)', fontSize: 16, lineHeight: '24px', width: '100%', maxWidth: 240 },
  pillMark: { width: 20, height: 20, verticalAlign: '-4px', marginRight: 4, display: 'inline-block' },
  pillName: { color: DLG.blue, fontWeight: 500 },
  go: { width: 28, height: 28, borderRadius: 999, background: '#D9D9DE', display: 'grid', placeItems: 'center', flex: 'none', border: 0, padding: 0, cursor: 'pointer' },
  desc: { margin: '28px 0 0', whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: '18px', color: DLG.grey, textWrap: 'pretty' },
  h2: { margin: '48px 0 16px', fontSize: 15, fontWeight: 600 },
  app: { display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 },
  appIcon: { width: 40, height: 40, borderRadius: 999, border: '1px solid ' + DLG.line, display: 'grid', placeItems: 'center', background: '#fff' },
  table: { borderTop: '1px solid ' + DLG.line, margin: 0 },
  row: { display: 'grid', gridTemplateColumns: '160px minmax(0,1fr)', alignItems: 'center', minHeight: 45, borderBottom: '1px solid ' + DLG.line, fontSize: 14 },
  dt: { color: DLG.grey },
  dd: { margin: 0, display: 'flex' },
  ext: { color: DLG.ink, display: 'inline-flex' },
  notice: { margin: '48px 0 0', fontSize: 14, lineHeight: '20px', color: DLG.grey, textWrap: 'pretty' },
  u: { color: DLG.grey, textDecoration: 'underline', textUnderlineOffset: 2 },
};

// A plain ring-and-blossom mark (six petals in a ring), drawn here; no logo file.
const DlGptMark = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    {[0, 60, 120, 180, 240, 300].map((a) => <ellipse key={a} cx="12" cy="7.2" rx="3.4" ry="5" transform={'rotate(' + a + ' 12 12)'} />)}
  </svg>
);
const DlgItem = ({ icon, sel, children }) => (
  <button type="button" style={sel ? { ...dlgS.item, ...dlgS.itemSel } : dlgS.item} aria-current={sel ? 'page' : undefined}>{dlIcon(icon, 20, 1.6)}{children}</button>
);
const DlgSidebar = () => (
  <nav style={dlgS.side} aria-label="ChatGPT sidebar (mock)">
    <div style={dlgS.sideTop}>
      <DlGptMark />
      <div style={dlgS.sideIcons}>
        <button type="button" aria-label="Search" style={dlgS.iconBtn}>{dlIcon('search', 20)}</button>
        <button type="button" aria-label="Close sidebar" style={dlgS.iconBtn}>{dlIcon('panel', 20)}</button>
      </div>
    </div>
    <div style={dlgS.nav}>
      <DlgItem icon="pen">New chat</DlgItem>
      <DlgItem icon="images">Images</DlgItem>
      <DlgItem icon="plugin" sel>Plugins</DlgItem>
      <DlgItem icon="scope">Deep research</DlgItem>
    </div>
    <div style={dlgS.sideFoot}>
      <DlgItem icon="plans">See plans and pricing</DlgItem>
      <DlgItem icon="gear">Settings</DlgItem>
      <DlgItem icon="help">Help</DlgItem>
      <div style={dlgS.tailor}>
        <p style={dlgS.tailorH}>Get responses tailored to you</p>
        <p style={dlgS.tailorP}>Log in to get answers based on saved chats, plus create images and upload files.</p>
        <button type="button" style={dlgS.outPill}>Log in</button>
      </div>
    </div>
  </nav>
);
const DlgPill = ({ text, phone }) => (
  <div style={phone ? dlgS.pillPhone : dlgS.pill}>
    <span style={{ flex: phone ? 1 : 'none', paddingLeft: 4 }}>
      <img src={DL_LOGO} alt="" style={dlgS.pillMark} /><span style={dlgS.pillName}>MCP Games</span> {text}
    </span>
    <button type="button" aria-label={'Send: ' + text} style={dlgS.go}>{dlIcon('arrow', 14, 2)}</button>
  </div>
);

const DlChatGptListing = () => {
  const phone = useDlPhone();
  return (
    <div className="dl-page" style={dlgS.page}>
      {!phone && <DlgSidebar />}
      <main style={dlgS.main} aria-label="Plugin listing mock: ChatGPT">
        <div style={phone ? dlgS.topPhone : dlgS.top}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {phone && <button type="button" aria-label="Open sidebar" style={dlgS.iconBtn}>{dlIcon('panel', 20)}</button>}
            <button type="button" style={dlgS.crumb}>{dlIcon('prev', 14, 2)}Plugins</button>
          </div>
          <button type="button" style={phone ? { ...dlgS.blackPill, height: 32, padding: '0 12px', fontSize: 14 } : dlgS.blackPill}>Log in</button>
        </div>
        <div style={phone ? dlgS.colPhone : dlgS.col}>
          <div style={dlgS.tile}><img src={DL_LOGO} alt="" width="40" height="40" /></div>
          <div style={phone ? { ...dlgS.nameRow, marginTop: 36 } : dlgS.nameRow}>
            <h1 style={dlgS.name}>MCP Games</h1>
            <button type="button" style={dlgS.blackPill}>Install plugin</button>
          </div>
          <p style={dlgS.sub}>Daily puzzles and story games</p>
          <div style={phone ? { ...dlgS.banner, gap: 16, padding: '32px 16px' } : dlgS.banner}>
            {DLG_PROMPTS.map((p) => <DlgPill key={p} text={p} phone={phone} />)}
          </div>
          <p style={dlgS.desc}>{dlText(dlGames('ChatGPT'), DL_HEADS)}</p>
          <h2 style={dlgS.h2}>App</h2>
          <div style={dlgS.app}><span style={dlgS.appIcon}><img src={DL_LOGO} alt="" width="26" height="26" /></span>MCP Games</div>
          <h2 style={dlgS.h2}>Information</h2>
          <dl style={dlgS.table}>
            {DLG_INFO.map(([k, v, t]) => (
              <div key={k} style={phone ? { ...dlgS.row, gridTemplateColumns: '162px minmax(0,1fr)' } : dlgS.row}>
                <dt style={dlgS.dt}>{k}</dt>
                <dd style={dlgS.dd}>{v || <a href="#" onClick={dlNoGo} title={t} aria-label={k + ' (' + t + ')'} style={dlgS.ext}>{dlIcon('ext', 18, 1.7)}</a>}</dd>
              </div>
            ))}
          </dl>
          <p style={dlgS.notice}>When connected to MCP Games, ChatGPT may share relevant chats and memories with this app to help provide context for your requests. MCP Games's use of this data is subject to their <a href="#" onClick={dlNoGo} style={dlgS.u}>terms</a> and <a href="#" onClick={dlNoGo} style={dlgS.u}>privacy policy</a>. If you have <a href="#" onClick={dlNoGo} style={dlgS.u}>Memory</a> enabled, data from the app may be used to proactively provide helpful information or suggestions. ChatGPT always respects your training data preferences, including for data from connected apps. Use of apps may come with <a href="#" onClick={dlNoGo} style={dlgS.u}>elevated risk</a>. You can manage your preferences or disconnect from apps anytime in your settings. <a href="#" onClick={dlNoGo} style={dlgS.u}>Learn more</a></p>
        </div>
      </main>
    </div>
  );
};

// Register entries, spread into KIT_STATE_REGISTER by app/states.jsx (absent ⇒ none).
// Group title per the owner's message of 15 Oct: under Store listing in States.
const DL_STATES = [
  { group: 'Store listing', id: 'directory-listing-claude', label: 'Directory listing: Claude connector', stage: (c) => c.go('directory-claude') },
  { group: 'Store listing', id: 'directory-listing-chatgpt', label: 'Directory listing: ChatGPT plugin', stage: (c) => c.go('directory-chatgpt') },
];

Object.assign(window, { DL_STATES, DlClaudeListing, DlChatGptListing });
