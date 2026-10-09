// ============================================================================
// [Platform] — site-wide pieces: extra glyphs, wordmark, loader (with withhold
// and minimum hold), footer, legal stand-ins, not-found, load failed.
// Structure from Circlists (footer, legal, not-found, loading); store look.
// ============================================================================

// Glyphs the design system's set lacks, drawn in its line style (1.75 stroke,
// square caps, mitred joins). Google and Apple are the providers' own marks.
const GS_GLYPH_A = 'fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="miter"';
const GS_GLYPHS = {
  mail: '<g ' + GS_GLYPH_A + '><path d="M3 5.5H21V18.5H3Z"/><path d="M3.5 6.5L12 13L20.5 6.5"/></g>',
  logout: '<g ' + GS_GLYPH_A + '><path d="M10 4H4V20H10"/><path d="M15 8L19 12L15 16"/><path d="M19 12H9"/></g>',
  card: '<g ' + GS_GLYPH_A + '><path d="M2.5 5.5H21.5V18.5H2.5Z"/><path d="M2.5 10H21.5"/><path d="M6 15H10"/></g>',
  pass: '<g ' + GS_GLYPH_A + '><path d="M3 6.5H21V10H19V14H21V17.5H3V14H5V10H3Z"/><path d="M9.5 6.5V8M9.5 11V13M9.5 16V17.5"/></g>',
  x: '<g fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="square"><path d="M6 6L18 18M18 6L6 18"/></g>',
  arrow: '<g ' + GS_GLYPH_A + '><path d="M4 12H19"/><path d="M13 6L19 12L13 18"/></g>',
  apple: '<path fill="currentColor" d="M16.37 12.62c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.87-.76-1.47.02-2.83.86-3.59 2.18-1.54 2.66-.39 6.6 1.1 8.76.73 1.06 1.6 2.24 2.73 2.2 1.1-.05 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.13.84-1.23 1.18-2.42 1.2-2.48-.03-.01-2.29-.88-2.31-3.5zM14.2 6.16c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.64-1.05 1.67-.92 2.66.97.07 1.96-.49 2.56-1.21z"/>',
  google: '<g transform="scale(.5)"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></g>',
};
const GsGlyph = ({ name, size = 20, style }) => (
  <svg className="mcp-ico" viewBox="0 0 24 24" width={size} height={size} style={{ width: size, height: size, ...style }} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: GS_GLYPHS[name] }} />
);

const GsMark = ({ size = 32 }) => (
  <span className="gs-brand-mark" aria-hidden="true" style={{ width: size, height: size }}>
    <span className="mcp-loader-m" style={{ transform: `scale(${size / 120})`, transformOrigin: '0 0' }}><i className="tl"></i><i className="tr"></i><i className="br"></i><i className="bl"></i></span>
  </span>
);
const GsStaticBrand = () => (
  <span className="gs-brand" style={{ cursor: 'default', pointerEvents: 'none' }}><GsMark /><span>[Platform]</span></span>
);
const GsWordmark = () => {
  const gs = useGs();
  return (
    <button type="button" className="gs-brand" aria-label="[Platform], home" onClick={() => gs.go('home')}>
      <GsMark /><span>[Platform]</span>
    </button>
  );
};

// ---- Loader. Withheld for a wait too short to notice; once shown, held long
// enough not to flicker. gsSettle(start, fn) applies the hold to a finished wait.
const GS_LOADER = { withhold: 300, minHold: 600 };
const gsSettle = (start, fn) => {
  const t = Date.now() - start;
  if (t < GS_LOADER.withhold) { fn(); return undefined; }
  return setTimeout(fn, Math.max(0, GS_LOADER.withhold + GS_LOADER.minHold - t));
};
// ---- Work on a pressed control. run(fn) holds the control busy for a staged
// wait, then applies fn; a second press while busy is ignored. cancel() drops
// the wait (the surface holding the control closed). Unmounting drops it too.
const GS_WORK_MS = 900;
const useGsBusy = (ms = GS_WORK_MS) => {
  const [busy, setBusy] = React.useState(false);
  const live = React.useRef(true);
  const held = React.useRef(false);
  const t = React.useRef(null);
  React.useEffect(() => { live.current = true; return () => { live.current = false; clearTimeout(t.current); }; }, []);
  const run = (fn) => {
    if (held.current) return;
    held.current = true; setBusy(true);
    t.current = setTimeout(() => { held.current = false; if (!live.current) return; setBusy(false); fn(); }, ms);
  };
  const cancel = () => { clearTimeout(t.current); held.current = false; setBusy(false); };
  return [busy, run, cancel];
};
// The system's button spinner, in ink, for a control that is not a Button.
const GsInkSpin = () => <span className="mcp-spin gs-spin-ink" aria-hidden="true" />;
const GsSpin = ({ label = 'Loading' }) => {
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setShown(true), GS_LOADER.withhold); return () => clearTimeout(t); }, []);
  return <div className="gs-spin-slot" role="status" aria-label={label}>{shown && <DS.Loader size={100} label={label} />}</div>;
};
// Full screen: the spinner alone on the canvas. `ms` then `onDone`, or held.
const GsFullLoader = ({ label, ms, onDone }) => {
  React.useEffect(() => {
    if (!ms || !onDone) return undefined;
    const t = setTimeout(onDone, ms);
    return () => clearTimeout(t);
  }, []);
  return <main className="gs-full"><GsSpin label={label} /></main>;
};

// ---- Pages and parts. One staged duration for every page and part load.
// A page loads as a page on arrival (GsArrival, main.jsx); a part loads on its own
// when its controls change (useGsPart). A state can hold either: route.hold = 'page' | 'part'.
const GS_LOAD_MS = 1200;
const useGsPart = (deps) => {
  const gs = useGs();
  const [on, setOn] = React.useState(false);
  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) { first.current = false; return undefined; }
    setOn(true);
    const t = setTimeout(() => setOn(false), GS_LOAD_MS);
    return () => clearTimeout(t);
  }, deps);
  return on || gs.route.hold === 'part';
};
const GsPart = ({ label }) => <div className="gs-inplace" aria-busy="true"><GsSpin label={label} /></div>;

// ---- Load failed: two lines (in place) or one (full screen), then Try again.
// The button shows the wait and cannot be pressed twice; onRetry runs with the result.
const GsLoadFailed = ({ full, onRetry }) => {
  const [busy, run] = useGsBusy(GS_LOAD_MS);
  return (
    <div className={full ? 'gs-full' : 'gs-inplace'}>
      <div className="gs-failed">
        <p className="gs-strong">This didn’t load.</p>
        {!full && <p className="gs-muted">Something went wrong fetching your games.</p>}
        <DS.Button variant="secondary" loading={busy} onClick={() => run(onRetry)}>Try again</DS.Button>
      </div>
    </div>
  );
};
const GsOffline = () => {
  const gs = useGs();
  return <GsLoadFailed full onRetry={() => gs.go('games')} />;
};

// ---- Footer: a directory. Wide: brand, contact, legal. Narrow: see CSS.
const GS_SUPPORT = 'support@[platform].example';
const GS_LEGAL_LINKS = [['privacy', 'Privacy'], ['terms', 'Terms'], ['refunds', 'Refunds']];
const GsFooter = () => {
  const gs = useGs();
  const legal = (doc) => gs.go('legal', { doc });
  const mail = <a className="gs-ft-mail" href={'mailto:' + GS_SUPPORT}>{GS_SUPPORT}</a>;
  return (
    <footer className="gs-ft">
      <div className="gs-wrap">
        <div className="gs-ft-wide">
          <div className="gs-ft-brand"><GsStaticBrand /><p className="gs-ft-copy">© 2026 Harness Intent Ltd</p></div>
          <div className="gs-ft-col"><h2 className="gs-ft-h">contact</h2>{mail}</div>
          <div className="gs-ft-col"><h2 className="gs-ft-h">legal</h2>
            {GS_LEGAL_LINKS.map(([d, l]) => <button key={d} type="button" className="gs-ft-link" onClick={() => legal(d)}>{l}</button>)}
          </div>
        </div>
        <div className="gs-ft-narrow">
          <div className="gs-ft-top"><span className="gs-ft-mark"><GsStaticBrand /></span>{mail}</div>
          <div className="gs-ft-bottom">
            <div className="gs-ft-run">
              {GS_LEGAL_LINKS.map(([d, l], i) => <React.Fragment key={d}>{i > 0 && <span className="gs-ft-dot" aria-hidden="true">·</span>}<button type="button" className="gs-ft-link" onClick={() => legal(d)}>{l}</button></React.Fragment>)}
            </div>
            <p className="gs-ft-copy">© 2026 Harness Intent Ltd</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ---- Legal pages: stand-ins. Real heading structure, no legal text.
const GS_LEGAL = {
  terms: { title: 'Terms and Conditions', sections: ['Who we are', 'What [Platform] is', 'Your account', 'Payments', 'When the Pass ends', 'Support', 'Your content', 'Ending things', 'Our liability', 'Changes to these terms', 'Governing law'] },
  privacy: { title: 'Privacy', opening: 'This page isn’t written yet.', sections: ['On the website', ['In the app', ['Your account', 'Your play history', 'Payments', 'App analytics', 'Server logs']], 'Where your data lives', 'Cookies and storage', 'Children', 'Keeping and deleting your data', 'Contact', 'Updates'] },
  refunds: { title: 'Refund Policy', sections: ['The short version', 'How refunds work', 'Your legal rights', 'Complaints'] },
};
const GS_UNWRITTEN = 'This section isn’t written yet.';
const GsLegal = () => {
  const gs = useGs();
  const doc = GS_LEGAL[gs.route.doc] || GS_LEGAL.terms;
  return (
    <main className="gs-wrap gs-legal">
      <article className="gs-legal-col">
        <header className="gs-stack-sm">
          <h1 className="gs-legal-h1">{doc.title}</h1>
          <p className="gs-legal-rev">Last revised · [date]</p>
        </header>
        {doc.opening && <p>{doc.opening}</p>}
        {doc.sections.map((s) => Array.isArray(s) ? (
          <section key={s[0]} className="gs-legal-sec">
            <h2 className="gs-legal-h2">{s[0]}</h2>
            {s[1].map((h) => <div key={h} className="gs-legal-sub"><h3 className="gs-legal-h3">{h}</h3><p>{GS_UNWRITTEN}</p></div>)}
          </section>
        ) : (
          <section key={s} className="gs-legal-sec"><h2 className="gs-legal-h2">{s}</h2><p>{GS_UNWRITTEN}</p></section>
        ))}
      </article>
    </main>
  );
};

// ---- Not found: never says which case it is.
const GsNotFound = () => {
  const gs = useGs();
  return (
    <main className="gs-nf">
      <div className="gs-nf-mark"><GsWordmark /></div>
      <div className="gs-nf-col">
        <h1 className="gs-h1">Page not found.</h1>
        <p className="gs-muted">Either this address doesn’t exist, or it isn’t available to you.</p>
        <DS.Button onClick={() => gs.go('home')}>Go home</DS.Button>
      </div>
    </main>
  );
};

Object.assign(window, {
  GsGlyph, GsMark, GsWordmark, GS_LOADER, gsSettle, GS_WORK_MS, GS_LOAD_MS, useGsPart, GsPart, useGsBusy, GsInkSpin, GsSpin, GsFullLoader, GsLoadFailed, GsOffline,
  GS_SUPPORT, GsFooter, GsLegal, GsNotFound,
});
