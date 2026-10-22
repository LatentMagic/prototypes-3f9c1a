// ============================================================================
// Circlists — store listings (review aid).
//
//   CircStoreAppStore   — a mock of the Apple App Store page (iPhone).
//   CircStoreGooglePlay — a mock of the Google Play page (Android phone).
//
// NOT product UI. Each page follows its store's own chrome, so nothing here
// uses a Circlists token — do not "fix" that. Copy is verbatim from the store
// copy deck. Get, Install and every link are inert; only the description
// expands, and a screenshot opens the full-screen viewer. On any width the page is one phone-width column; inside the phone
// frame (Viewport: Mobile, Platform: Mobile) the column is the screen.
//
// DROPPABLE: main.jsx guards both routes on window, so without this file the
// two routes render nothing new and the app opens as it always has.
// ============================================================================

const SL_DIR = 'uploads/store-listings/';
const SL_ICON = SL_DIR + 'icon-maskable-512.png';
const SL_APPLE_FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", Inter, system-ui, sans-serif';
const SL_PLAY_FONT = 'Roboto, "Google Sans", system-ui, sans-serif';

const SL_DESC_HEAD = `Circlists is one shared list for a small group of people you choose, a circle. Share an article, video or podcast and everyone in the circle sees it. Each person gets to it in their own time, and ticking something off clears it from your list only.

In a group chat, a good recommendation scrolls away. In Circlists it stays on the list, with who shared it and why they shared it.

INVITED TO A CIRCLE?
Open the invite, sign in, and you're in. Joining circles is free. Starting your own needs a Circlists subscription.

FOR THE PEOPLE YOU SHARE WITH
Book clubs, close friends, couples, study groups. Up to ten people in a circle.

HOW IT WORKS`;
const SL_DESC_TAIL = `• Add a thought. Say why it's worth the time.
• Your own place in it. Tick something off and it leaves your Active tab. Everyone else's stays as it is.
• Talk about it after you've read it. Each item has its own conversation, and it opens once you've finished.`;
const SL_APPLE_DESC = SL_DESC_HEAD + '\n' + SL_DESC_TAIL;
const SL_PLAY_DESC = SL_DESC_HEAD + '\n• Share from any app. Send an article, video or podcast to Circlists from your browser, YouTube or your podcast app, and pick the circle.\n' + SL_DESC_TAIL;

const SL_APPLE_SHOTS = [
  ['Stay on the pulse with *your circle*', 'apple-01-reading-loop.png'],
  ['Everyone reads at *their own pace*', 'apple-02-history-own-pace.png'],
  ['Say why it\u2019s *worth the time*', 'apple-03-card-conversation-thought.png'],
  ['A separate circle for *every group you share with*', 'apple-05-home-circles.png'],
];
const SL_PLAY_SHOTS = [
  ['Stay on the pulse with *your circle*', 'play-01-reading-loop.png'],
  ['Everyone reads at *their own pace*', 'play-02-history-own-pace.png'],
  ['Say why it\u2019s *worth the time*', 'play-03-card-conversation-thought.png'],
  ['Share to a circle *from any app*', 'play-04-share-picker.png'],
  ['A separate circle for *every group you share with*', 'play-05-home-circles.png'],
];

// Store fonts, loaded only while a store page is open.
const slUseFonts = () => React.useEffect(() => {
  if (document.getElementById('sl-fonts')) return;
  const l = document.createElement('link');
  l.id = 'sl-fonts'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap';
  document.head.appendChild(l);
}, []);

// "*phrase*" marks the accent phrase; the asterisks are not shown.
const slCaption = (text) => text.split('*').map((part, i) => (i % 2 ? <span key={i} style={{ color: '#047857' }}>{part}</span> : part));

// ---- the store frame (style A, cream) --------------------------------------
const slFrameStyles = {
  frame: { position: 'relative', overflow: 'hidden', background: '#FAFAF7', containerType: 'inline-size', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  cap: { margin: 0, padding: '11cqw 8cqw 0', fontFamily: 'Inter, ' + SL_APPLE_FONT, fontWeight: 700, fontSize: '9cqw', lineHeight: 1.08, letterSpacing: '-0.025em', color: '#0A0A0A', textAlign: 'center', textWrap: 'balance' },
  screen: { flexShrink: 0, width: '78cqw', marginTop: '8cqw', borderRadius: '9cqw', overflow: 'hidden', boxShadow: '0 0 0 1px rgba(10,10,10,0.08), 0 6cqw 14cqw rgba(10,10,10,0.14)', background: '#fff' },
  img: { display: 'block', width: '100%', height: 'auto' },
};
const SlFrame = ({ caption, src, ratio }) => (
  <div style={{ ...slFrameStyles.frame, aspectRatio: ratio }}>
    <p style={slFrameStyles.cap}>{slCaption(caption)}</p>
    <div style={slFrameStyles.screen}><img src={SL_DIR + src} alt="" style={slFrameStyles.img} /></div>
  </div>
);

// One phone-width column. On a desktop window it sits centred on a neutral
// ground; inside the phone frame the column is the screen.
const slStageStyles = {
  ground: { minHeight: 'var(--circ-vh, 100vh)', display: 'flex', justifyContent: 'center' },
  col: { width: '100%', maxWidth: 430, minHeight: 'var(--circ-vh, 100vh)', paddingTop: 'var(--safe-area-inset-top, env(safe-area-inset-top, 0px))', paddingBottom: 'calc(48px + var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px)))', WebkitFontSmoothing: 'antialiased' },
};
const SlStage = ({ ground, page, font, label, children }) => (
  <div style={{ ...slStageStyles.ground, background: ground }}>
    <main aria-label={label} style={{ ...slStageStyles.col, background: page, fontFamily: font, boxShadow: '0 0 0 1px rgba(0,0,0,0.06)' }}>{children}</main>
  </div>
);

// Full-screen screenshot viewer, as both stores open one on tap. Swipe or
// arrow keys between shots; Esc or the store's own close control shuts it.
// position: fixed resolves to the phone's screen inside the frame (GOTCHA 5).
const slViewerStyles = {
  root: { position: 'fixed', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', paddingTop: 'var(--safe-area-inset-top, env(safe-area-inset-top, 0px))', paddingBottom: 'var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px))' },
  bar: { display: 'flex', alignItems: 'center', minHeight: 48, padding: '0 8px', flexShrink: 0 },
  row: { flex: 1, minHeight: 0, display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none' },
  slide: { flex: '0 0 100%', scrollSnapAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 24px 24px', boxSizing: 'border-box', minHeight: 0 },
  dots: { display: 'flex', justifyContent: 'center', gap: 6, padding: '0 0 16px' },
};
const SlViewer = ({ shots, ratio, start, dark, closeLabel, onClose }) => {
  const rowRef = React.useRef(null);
  const closeRef = React.useRef(null);
  const [at, setAt] = React.useState(start);
  React.useLayoutEffect(() => { const r = rowRef.current; if (r) r.scrollLeft = start * r.clientWidth; }, []);
  React.useEffect(() => {
    const back = document.activeElement;
    closeRef.current && closeRef.current.focus();
    const onKey = (e) => {
      const r = rowRef.current;
      if (e.key === 'Escape') onClose();
      else if (r && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) r.scrollTo({ left: r.scrollLeft + (e.key === 'ArrowRight' ? 1 : -1) * r.clientWidth, behavior: 'smooth' });
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); back && back.focus && back.focus(); };
  }, []);
  const s = slViewerStyles;
  const fg = dark ? '#fff' : '#0A84FF';
  return (
    <div role="dialog" aria-modal="true" aria-label="Screenshots" style={{ ...s.root, background: dark ? '#000' : '#fff' }}>
      <div style={{ ...s.bar, justifyContent: dark ? 'flex-start' : 'flex-end' }}>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={dark ? 'Back' : undefined} style={{ minWidth: 48, minHeight: 44, padding: '0 12px', background: 'transparent', border: 0, color: fg, fontFamily: 'inherit', fontSize: dark ? 22 : 17, fontWeight: dark ? 400 : 600, cursor: 'pointer' }}>{closeLabel}</button>
      </div>
      <div ref={rowRef} style={s.row} onScroll={(e) => { const r = e.currentTarget; setAt(Math.round(r.scrollLeft / r.clientWidth)); }}>
        {shots.map(([cap, src]) => (
          <div key={src} style={s.slide}>
            <div style={{ height: '100%', maxWidth: '100%', aspectRatio: ratio, borderRadius: dark ? 8 : 18, overflow: 'hidden', boxShadow: '0 0 0 0.5px rgba(0,0,0,0.18)' }}><SlFrame caption={cap} src={src} ratio={ratio} /></div>
          </div>
        ))}
      </div>
      <div style={s.dots} aria-hidden="true">
        {shots.map((_, i) => <span key={i} style={{ width: 6, height: 6, borderRadius: 3, background: dark ? '#fff' : '#000', opacity: i === at ? 0.9 : 0.25 }}></span>)}
      </div>
    </div>
  );
};
const slShotBtn = { display: 'block', width: '100%', padding: 0, border: 0, background: 'transparent', cursor: 'pointer' };

const slShotRow = { display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollPadding: '0 20px', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' };

// ---- Apple App Store --------------------------------------------------------
const slAppleStyles = {
  back: { display: 'flex', alignItems: 'center', minHeight: 44, padding: '0 12px', color: '#0A84FF', fontSize: 17, background: 'transparent', border: 0, cursor: 'pointer', fontFamily: 'inherit', gap: 4 },
  head: { display: 'flex', gap: 16, padding: '8px 20px 20px' },
  icon: { width: 96, height: 96, borderRadius: 22, flexShrink: 0, display: 'block', boxShadow: '0 0 0 0.5px rgba(0,0,0,0.18)' },
  name: { margin: 0, fontSize: 20, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.01em', color: '#000' },
  sub: { margin: '2px 0 0', fontSize: 15, lineHeight: 1.3, color: '#6E6E73' },
  getRow: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto' },
  get: { minWidth: 74, height: 30, padding: '0 18px', borderRadius: 15, border: 0, background: '#0A84FF', color: '#fff', fontFamily: 'inherit', fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  price: { fontSize: 12, color: '#6E6E73' },
  facts: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', margin: '0 20px', borderTop: '1px solid rgba(60,60,67,0.18)', borderBottom: '1px solid rgba(60,60,67,0.18)', padding: '10px 0' },
  fact: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center', padding: '0 6px' },
  factSep: { borderLeft: '1px solid rgba(60,60,67,0.18)' },
  factK: { fontSize: 11, fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase', color: '#8E8E93' },
  factV: { fontSize: 17, fontWeight: 700, color: '#6E6E73', lineHeight: 1.15 },
  shots: { ...slShotRow, gap: 10, padding: '20px 20px' },
  shot: { flex: '0 0 62%', scrollSnapAlign: 'start', borderRadius: 18, overflow: 'hidden', boxShadow: '0 0 0 0.5px rgba(0,0,0,0.18)' },
  rule: { height: 1, background: 'rgba(60,60,67,0.18)', margin: '0 20px' },
  text: { margin: 0, fontSize: 15, lineHeight: 1.45, color: '#000', whiteSpace: 'pre-line' },
  descWrap: { position: 'relative', marginTop: 14 },
  clamp: { display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, overflow: 'hidden' },
  more: { position: 'absolute', right: 0, bottom: 0, background: 'linear-gradient(90deg, rgba(255,255,255,0), #fff 30%)', border: 0, padding: '0 0 0 28px', color: '#0A84FF', fontFamily: 'inherit', fontSize: 15, lineHeight: 1.45, cursor: 'pointer' },
  h2: { margin: '0 0 8px', fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', color: '#000' },
  info: { display: 'flex', justifyContent: 'space-between', gap: 16, padding: '11px 0', borderBottom: '1px solid rgba(60,60,67,0.18)', fontSize: 15 },
  infoK: { color: '#6E6E73' },
  infoV: { color: '#000', textAlign: 'right' },
  link: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, width: '100%', padding: '11px 0', minHeight: 44, border: 0, borderBottom: '1px solid rgba(60,60,67,0.18)', background: 'transparent', fontFamily: 'inherit', fontSize: 15, color: '#0A84FF', cursor: 'pointer', textAlign: 'left' },
};

const CircStoreAppStore = () => {
  slUseFonts();
  const [open, setOpen] = React.useState(false);
  const [shot, setShot] = React.useState(null);
  const s = slAppleStyles;
  const facts = [['Ratings', 'No Ratings'], ['Age', '18+'], ['Category', 'Social Networking']];
  const links = [['Support', 'circlists.com/contact'], ['Marketing', 'circlists.com'], ['Privacy', 'circlists.com/privacy']];
  return (
    <SlStage ground="#E5E5EA" page="#fff" font={SL_APPLE_FONT} label="App Store page">
      <button type="button" style={s.back}><span aria-hidden="true" style={{ fontSize: 26, lineHeight: 1, marginTop: -3 }}>{'\u2039'}</span>Search</button>
      <div style={s.head}>
        <img src={SL_ICON} alt="Circlists icon" style={s.icon} />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', paddingTop: 2 }}>
          <h1 style={s.name}>Circlists</h1>
          <p style={s.sub}>Shared list, your own place</p>
          <div style={s.getRow}><button type="button" style={s.get}>Get</button><span style={s.price}>Free</span></div>
        </div>
      </div>
      <div style={s.facts}>
        {facts.map(([k, v], i) => (
          <div key={k} style={{ ...s.fact, ...(i ? s.factSep : null) }}>
            <span style={s.factK}>{k}</span>
            <span style={{ ...s.factV, fontSize: v.length > 4 ? 13 : 17 }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={s.shots}>
        {SL_APPLE_SHOTS.map(([cap, src], i) => <div key={src} style={s.shot}><button type="button" aria-label={'Screenshot ' + (i + 1) + ' of ' + SL_APPLE_SHOTS.length} style={slShotBtn} onClick={() => setShot(i)}><SlFrame caption={cap} src={src} ratio="1320 / 2868" /></button></div>)}
        <div style={{ flex: '0 0 10px' }} aria-hidden="true"></div>
      </div>
      <div style={s.rule}></div>
      <section style={{ padding: '18px 20px 22px' }}>
        <p style={s.text}>Share an article, video or podcast with your circle. Everyone gets to it in their own time, and ticking it off clears only your own list.</p>
        <div style={s.descWrap}>
          <p style={{ ...s.text, ...(open ? null : s.clamp) }}>{SL_APPLE_DESC}</p>
          {!open && <button type="button" style={s.more} onClick={() => setOpen(true)}>more</button>}
        </div>
      </section>
      <section style={{ padding: '6px 20px 0' }}>
        <h2 style={s.h2}>Information</h2>
        <div style={s.info}><span style={s.infoK}>Seller</span><span style={s.infoV}>Harness Intent Ltd</span></div>
        <div style={s.info}><span style={s.infoK}>Copyright</span><span style={s.infoV}>{'\u00a9'} 2026 Harness Intent Ltd</span></div>
        {links.map(([k, v]) => (
          <button key={k} type="button" style={s.link}><span>{k}</span><span style={{ color: '#0A84FF', fontSize: 14 }}>{v}</span></button>
        ))}
      </section>
      {shot !== null && <SlViewer shots={SL_APPLE_SHOTS} ratio="1320 / 2868" start={shot} closeLabel="Done" onClose={() => setShot(null)} />}
    </SlStage>
  );
};

// ---- Google Play ------------------------------------------------------------
const slPlayStyles = {
  bar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 56, padding: '0 4px', color: '#1F1F1F' },
  barBtn: { width: 48, height: 48, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 0, fontSize: 22, color: '#444746', cursor: 'pointer', fontFamily: 'inherit' },
  feature: { position: 'relative', aspectRatio: '1024 / 500', overflow: 'hidden', background: '#FAFAF7', containerType: 'inline-size' },
  featLeft: { position: 'absolute', left: '9cqw', top: 0, bottom: 0, width: '52cqw', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4cqw' },
  lockup: { display: 'block', height: '6.4cqw', width: 'auto', alignSelf: 'flex-start' },
  featLine: { margin: 0, fontFamily: 'Inter, ' + SL_APPLE_FONT, fontWeight: 700, fontSize: '5.6cqw', lineHeight: 1.1, letterSpacing: '-0.025em', color: '#0A0A0A', textWrap: 'balance' },
  featPhone: { position: 'absolute', right: '8cqw', top: '9cqw', width: '30cqw', borderRadius: '3.6cqw', overflow: 'hidden', boxShadow: '0 0 0 1px rgba(10,10,10,0.08), 0 2cqw 6cqw rgba(10,10,10,0.16)' },
  head: { display: 'flex', alignItems: 'center', gap: 20, padding: '20px 24px 0' },
  icon: { width: 64, height: 64, borderRadius: 14, flexShrink: 0, display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' },
  name: { margin: 0, fontSize: 24, fontWeight: 500, lineHeight: 1.25, color: '#1F1F1F' },
  dev: { margin: '2px 0 0', fontSize: 14, fontWeight: 500, color: '#01875F' },
  chips: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', margin: '20px 24px 0', padding: '10px 0', borderTop: '1px solid #E3E3E3', borderBottom: '1px solid #E3E3E3' },
  chip: { display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: 36, padding: '0 6px', fontSize: 12.5, lineHeight: 1.3, color: '#444746' },
  chipSep: { borderLeft: '1px solid #E3E3E3' },
  install: { display: 'block', width: 'calc(100% - 48px)', margin: '20px 24px 0', height: 40, borderRadius: 8, border: 0, background: '#01875F', color: '#fff', fontFamily: 'inherit', fontSize: 14, fontWeight: 500, letterSpacing: '0.01em', cursor: 'pointer' },
  shots: { ...slShotRow, gap: 8, padding: '24px 24px', scrollPadding: '0 24px' },
  shot: { flex: '0 0 46%', scrollSnapAlign: 'start', borderRadius: 8, overflow: 'hidden', boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' },
  aboutBtn: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', minHeight: 48, padding: 0, background: 'transparent', border: 0, cursor: 'pointer', fontFamily: 'inherit', color: '#1F1F1F', textAlign: 'left' },
  h2: { fontSize: 18, fontWeight: 500, color: '#1F1F1F' },
  arrow: { fontSize: 22, color: '#444746', display: 'inline-flex', transition: 'transform 200ms ease' },
  text: { margin: 0, fontSize: 14, lineHeight: 1.45, color: '#444746', whiteSpace: 'pre-line' },
  linkRow: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, width: '100%', padding: '10px 0', minHeight: 48, background: 'transparent', border: 0, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' },
  linkK: { fontSize: 14, fontWeight: 500, color: '#1F1F1F' },
  linkV: { fontSize: 14, color: '#01875F' },
};

const CircStoreGooglePlay = () => {
  slUseFonts();
  const [open, setOpen] = React.useState(false);
  const [shot, setShot] = React.useState(null);
  const s = slPlayStyles;
  const chips = ['Rated for 18+', 'Social', 'No reviews yet'];
  const links = [['Website', 'circlists.com'], ['Support', 'circlists.com/contact'], ['Privacy', 'circlists.com/privacy']];
  return (
    <SlStage ground="#E8EAED" page="#fff" font={SL_PLAY_FONT} label="Google Play page">
      <div style={s.bar}>
        <button type="button" style={s.barBtn} aria-label="Back">{'\u2190'}</button>
        <button type="button" style={s.barBtn} aria-label="More options">{'\u22ee'}</button>
      </div>
      <div style={s.feature} role="img" aria-label="Circlists feature graphic">
        <div style={s.featLeft}>
          <img src="brand/assets/lockup/circlists-lockup.svg" alt="" style={s.lockup} />
          <p style={s.featLine}>A shared list, <span style={{ color: '#047857' }}>with your own place in it.</span></p>
        </div>
        <div style={s.featPhone}><img src={SL_DIR + 'play-01-reading-loop.png'} alt="" style={{ display: 'block', width: '100%' }} /></div>
      </div>
      <div style={s.head}>
        <img src={SL_ICON} alt="Circlists icon" style={s.icon} />
        <div style={{ minWidth: 0 }}>
          <h1 style={s.name}>Circlists</h1>
          <p style={s.dev}>Harness Intent Ltd</p>
        </div>
      </div>
      <div style={s.chips}>
        {chips.map((c, i) => <div key={c} style={{ ...s.chip, ...(i ? s.chipSep : null) }}>{c}</div>)}
      </div>
      <button type="button" style={s.install}>Install</button>
      <div style={s.shots}>
        {SL_PLAY_SHOTS.map(([cap, src], i) => <div key={src} style={s.shot}><button type="button" aria-label={'Screenshot ' + (i + 1) + ' of ' + SL_PLAY_SHOTS.length} style={slShotBtn} onClick={() => setShot(i)}><SlFrame caption={cap} src={src} ratio="1080 / 1920" /></button></div>)}
        <div style={{ flex: '0 0 16px' }} aria-hidden="true"></div>
      </div>
      <section style={{ padding: '0 24px 16px' }}>
        <button type="button" style={s.aboutBtn} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <span style={s.h2}>About this app</span>
          <span aria-hidden="true" style={{ ...s.arrow, transform: open ? 'rotate(90deg)' : 'none' }}>{'\u2192'}</span>
        </button>
        <p style={s.text}>One shared list for a small group. Read, watch or listen at your own pace.</p>
        {open && <p style={{ ...s.text, marginTop: 16 }}>{SL_PLAY_DESC}</p>}
      </section>
      <section style={{ padding: '8px 24px 0' }}>
        <div style={{ ...s.h2, padding: '12px 0 4px' }}>App support</div>
        {links.map(([k, v]) => (
          <button key={k} type="button" style={s.linkRow}><span style={s.linkK}>{k}</span><span style={s.linkV}>{v}</span></button>
        ))}
      </section>
      {shot !== null && <SlViewer shots={SL_PLAY_SHOTS} ratio="1080 / 1920" start={shot} dark closeLabel={'\u2190'} onClose={() => setShot(null)} />}
    </SlStage>
  );
};

Object.assign(window, { CircStoreAppStore, CircStoreGooglePlay });
