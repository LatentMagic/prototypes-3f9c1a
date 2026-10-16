// ============================================================================
// Playground (pass-upsell-proposal): the proposal panel. Playground chrome, not product: a docked rail at 1024px and wider
// (it can fold away), and below 1024px a strip above the demo bar that opens the same panel as a bottom sheet. It steers the
// real app through window.KitCandidateApi and the app's own setters; it never stages a surface past the product.
// ============================================================================
const usePguWide = () => {
  const [w, setW] = React.useState(window.innerWidth >= 1024);
  React.useEffect(() => { const f = () => setW(window.innerWidth >= 1024); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, []);
  return w;
};
const PguTag = ({ t, note }) => (t === 'decided' ? <DS.Tag kind="free">{note ? 'Decided, ' + note : 'Decided'}</DS.Tag>
  : t === 'open' ? <DS.Tag kind="warning">Open</DS.Tag> : <DS.Tag kind="daily">Set by the brief</DS.Tag>);
const PguSeg = ({ label, value, opts, onPick, tag }) => (
  <div className="pgu-ctl" role="group" aria-label={label}>
    <div className="pgu-ctl-head"><span className="pgu-ctl-label">{label}</span>{tag && <PguTag t={tag} />}</div>
    <div className="pgu-seg">{opts.map(([val, l]) => <button key={String(val)} type="button" aria-pressed={value === val} onClick={() => onPick(val)}>{l}</button>)}</div>
  </div>
);
const pguShownId = (id) => ({ Cacct: 'C', F2link: 'F2', Glead: 'G' }[id] || id);
// Put an item forward in its section, preferring the current one when it already fits.
const pguFocusIn = (sec, pred) => {
  const v = PguStore.get(); const cur = PGU_ITEMS[v.item];
  const list = sec.items.map((i) => PGU_ITEMS[i.id]).filter((i) => i.at);
  const it = (cur && cur.sec === sec.id && cur.at && pred(cur.at(v)) ? cur : list.find((i) => pred(i.at(v)))) || list[0];
  PguStore.set({ item: it.id }); pguShow(it, true);
};

const PguItem = ({ item, v, cur, onPicked }) => {
  const pick = (n) => { PguStore.set({ [item.id]: n, item: item.id }); pguShow(PGU_ITEMS[item.id]); onPicked && onPicked(); };
  const sw = item.sw;
  return (
    <article className={'pgu-item' + (cur ? ' is-cur' : '')}>
      <header className="pgu-item-head"><span className="pgu-id">{pguShownId(item.id)}</span><h3>{item.title}</h3></header>
      <div className="pgu-tags"><PguTag t={item.tag} note={item.tagNote} /></div>
      {item.tag === 'open' && <p className="pgu-open">Not decided: pick from these.</p>}
      <p className="pgu-why">{item.what}</p>
      {item.quote && <p className="pgu-quote">{pguQ(item.quote)}</p>}
      {item.note && <p className="pgu-note">{item.note}</p>}
      {item.vars && <ol className="pgu-vars" aria-label={'Variations of ' + pguShownId(item.id)}>
        {item.vars.map((x, i) => { const n = i + 1; const on = v[item.id] === n; return (
          <li key={n}>
            <button type="button" className="pgu-var" aria-pressed={on} onClick={() => pick(n)}><span className="pgu-n">{n}</span><span>{x.name}</span></button>
            {on && <div className="pgu-detail">
              {x.copy && <p className="pgu-copy">{x.copy}</p>}
              <p><b>For it:</b> {x.stance}</p>
              <p><b>Cost:</b> {x.cost}</p>
            </div>}
          </li>
        ); })}
      </ol>}
      {sw && <PguSeg label={sw.label} tag={sw.tag} value={v[sw.key]} opts={sw.opts} onPick={(val) => { PguStore.set({ [sw.key]: val, item: item.id }); pguShow(PGU_ITEMS[item.id], sw.key === 'F1'); onPicked && onPicked(); }} />}
      {item.id === 'E' && v.Eshow === 'once' && <p className="pgu-note">Leave the game page and come back: the card is gone. {Object.keys(v.seen).length > 0 && <button type="button" className="pgu-inbtn" onClick={() => { PguStore.set({ seen: {} }); pguShow(PGU_ITEMS.E, true); onPicked && onPicked(); }}>Show it again</button>}</p>}
      {item.id === 'F1' && <p className="pgu-note">Showing it signs out and opens Sign in; sign in to see where you land.</p>}
      <div className="pgu-acts">
        {item.at && <button type="button" className="pgu-inbtn" onClick={() => { PguStore.set({ item: item.id }); pguShow(PGU_ITEMS[item.id], true); onPicked && onPicked(); }}>Show it in the app</button>}
        {item.also && <button type="button" className="pgu-inbtn" onClick={() => { PguStore.set({ item: item.id }); pguShow({ at: item.also.at }, true); onPicked && onPicked(); }}>{item.also.label}</button>}
      </div>
    </article>
  );
};

const PguPanel = ({ wide, onFold, onPicked }) => {
  const v = usePgu(); const [, tick] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => PguStore.subApi(tick), []);
  const sec = PGU_SECTIONS.find((s) => s.id === v.sec) || PGU_SECTIONS[0];
  const gs = pguApi(); const now = pguSitNow(gs);
  const goSec = (s) => { const it = PGU_ITEMS[s.items[0].id]; PguStore.set({ sec: s.id, item: it.id }); pguShow(it); };
  const sitKey = 'sit_' + sec.id; const gameKey = 'game_' + sec.id;
  const pickSit = (s) => { PguStore.set({ [sitKey]: s }); pguFocusIn(sec, (t) => t.sit === s); };
  const pickGame = (g) => {
    PguStore.set({ [gameKey]: g });
    if (sec.id === 'B') { const it = PGU_ITEMS[{ daily: 'B1', first: 'B2', pass: 'B3' }[PGU_STAGE[g]]]; PguStore.set({ item: it.id }); pguShow(it, true); }
    else pguFocusIn(sec, (t) => t.route === g);
  };
  const intro = 'The owner has decided how the site mentions the Pass. Each change sits in its section, in the order a person meets it, with variations to choose between. The app ' + (wide ? 'beside' : 'behind') + ' this panel is the real one, and it changes as soon as you pick. Nothing here is in the main build.';
  return (
    <div className="pgu-panel">
      <header className="pgu-head">
        <div className="pgu-head-row"><span className="pgu-eyebrow">PLAYGROUND · NOT THE PRODUCT</span>{onFold && <button type="button" className="pgu-inbtn" onClick={onFold}>Hide panel</button>}</div>
        <h1 className="pgu-title">How the site mentions the Pass</h1>
        <p className="pgu-intro">{intro}</p>
      </header>
      <nav className="pgu-secs" aria-label="Sections">
        {PGU_SECTIONS.map((s) => <button key={s.id} type="button" className="pgu-sec" aria-current={s.id === sec.id ? 'true' : undefined} onClick={() => goSec(s)}><b>{s.id}</b><span>{s.name}</span></button>)}
      </nav>
      <section className="pgu-secbody" aria-label={sec.name}>
        <h2 className="pgu-h2">{sec.id + '. ' + sec.name}</h2>
        {sec.lede && <p className="pgu-why">{sec.lede}</p>}
        {sec.sits && <PguSeg label="Who’s looking" value={v[sitKey]} opts={sec.sits.map((s) => [s, (sec.sitLabels && sec.sitLabels[s]) || PGU_SITS[s]])} onPick={pickSit} />}
        {sec.games && <PguSeg label="Game" value={v[gameKey]} opts={sec.games.map((g) => [g, PGU_GAME_LABEL[g]])} onPick={pickGame} />}
        {sec.id === 'B' && <><PguSeg label="Arrived from a friend’s share of the last edition" tag="brief" value={v.arrived} opts={[[false, 'No'], [true, 'Yes']]} onPick={(x) => PguStore.set({ arrived: x })} />
          <p className="pgu-note">Display only: the box reads the same either way, so the shared edition is never called gone or yesterday’s.</p></>}
        {sec.sitNote && <p className="pgu-note">{sec.sitNote}</p>}
        {gs && <p className="pgu-note">The app now shows: <b>{PGU_SITS[now]}</b>{gs.route.name === 'session' ? ', a play’s record' : ''}.</p>}
        {sec.items.map((it) => <PguItem key={it.id} item={PGU_ITEMS[it.id]} v={v} cur={v.item === it.id} onPicked={onPicked} />)}
      </section>
      <footer className="pgu-foot">
        <p className="pgu-note">The staging is display only: which game gets which kind of access is each game’s own spec. No price appears anywhere on this page.</p>
        <div><button type="button" className="pgu-inbtn" onClick={() => PguStore.defaults()}>Back to every first variation</button></div>
      </footer>
    </div>
  );
};

const PguStrip = ({ onOpen, openerRef }) => {
  const v = usePgu(); const it = PGU_ITEMS[v.item] || PGU_ITEMS.A1;
  const n = it.vars ? it.vars.length : 0; const cur = v[it.id] || 1;
  const step = (d) => { PguStore.set({ [it.id]: ((cur - 1 + d + n) % n) + 1 }); pguShow(it); };
  return (
    <div className="pgu-strip" role="group" aria-label="Proposal panel, not part of the product">
      <button type="button" ref={openerRef} className="pgu-strip-main" aria-haspopup="dialog" onClick={onOpen}>
        <span className="pgu-strip-id">{pguShownId(it.id)}</span>
        <span className="pgu-strip-t">{n ? cur + ' of ' + n + ' · ' + it.vars[cur - 1].name : it.title}</span>
        <span className="pgu-strip-open">Open</span>
      </button>
      {n > 1 && <>
        <button type="button" className="pgu-strip-step" aria-label="Previous variation" onClick={() => step(-1)}><DS.Icon name="back" size={20} /></button>
        <button type="button" className="pgu-strip-step" aria-label="Next variation" onClick={() => step(1)}><DS.Icon name="next" size={20} /></button>
      </>}
    </div>
  );
};
const PguSheet = ({ open, onClose }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return undefined;
    const k = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', k);
    const b = ref.current && ref.current.querySelector('.pgu-sheet-close'); if (b) b.focus({ preventScroll: true });
    return () => document.removeEventListener('keydown', k);
  }, [open]);
  return <>
    <div className="pgu-scrim" data-open={open ? '' : undefined} onClick={onClose} />
    <div className="pgu-sheet" ref={ref} role="dialog" aria-modal="true" aria-label="Proposal panel" data-open={open ? '' : undefined}>
      <div className="pgu-sheet-bar"><button type="button" className="pgu-inbtn pgu-sheet-close" onClick={onClose}>Close</button></div>
      <PguPanel wide={false} onPicked={onClose} />
    </div>
  </>;
};
const PguChrome = () => {
  const wide = usePguWide(); const v = usePgu(); const [open, setOpen] = React.useState(false); const opener = React.useRef(null);
  React.useEffect(() => {
    const h = document.documentElement; h.classList.toggle('pgu-wide', wide); h.classList.toggle('pgu-narrow', !wide); h.classList.toggle('pgu-folded', wide && !!v.folded);
  }, [wide, v.folded]);
  const close = () => { setOpen(false); setTimeout(() => opener.current && opener.current.focus({ preventScroll: true }), 0); };
  if (wide) return v.folded
    ? <aside className="pgu-rail is-folded" aria-label="Proposal panel"><button type="button" className="pgu-unfold" onClick={() => PguStore.set({ folded: false })}><DS.Icon name="next" size={20} /><span>Show the proposal</span></button></aside>
    : <aside className="pgu-rail" aria-label="Proposal panel"><PguPanel wide onFold={() => PguStore.set({ folded: true })} /></aside>;
  return <><PguStrip onOpen={() => setOpen(true)} openerRef={opener} /><PguSheet open={open} onClose={close} /></>;
};
(() => { const m = document.createElement('div'); m.id = 'pgu-chrome'; document.body.appendChild(m); ReactDOM.createRoot(m).render(<PguChrome />); })();
