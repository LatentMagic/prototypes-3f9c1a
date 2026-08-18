// ============================================================================
// List dense — foot · ALIGNMENT playground (BIZ-80) + the loading choreography.
// Image is ALWAYS on the right. Five distinct structural answers to how the
// tick + delete stay ALIGNED against a right-hand image that "overhangs" them.
//
// Loading delta: an added link drops into the feed IMMEDIATELY as a pending
// card (URL stands in as the title; source + image are quiet skeletons), the
// add popover closes at once, then extraction resolves asynchronously and fills
// the SAME card in place — success+image, success+no-image, or the URL-as-title
// failure floor. Reuses window.PG3 (data) + primitives. window.PG5.
// ============================================================================
const { useState: uS5, useEffect: uE5 } = React;
const P5 = window.PG3;
const { Icon: I5, Avatar: Av5, LogoMark: LM5, Button: Btn5, Field: Fld5 } = window;
const URL_RE5 = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i;

// ---- atoms ------------------------------------------------------------------
// Skeleton block — the quiet "still resolving" placeholder: a muted fill with a
// slow shimmer sweep (frozen under prefers-reduced-motion). Never a spinner,
// never a broken-image glyph.
const Skel5 = ({ w, h, r = 4, style }) => (
  <span className="pg-skel" aria-hidden="true" style={{ display: 'block', width: w, height: h, borderRadius: r, ...(style || {}) }} />
);

const Favicon5 = ({ card, cfg, size = 14, radius = 3 }) => {
  const [broken, setBroken] = uS5(false);
  const absent = !card.faviconExists || broken;
  if (absent) return null;                       // never fabricate a glyph
  return (
    <span className="pg-fav" style={{ width: size, height: size, borderRadius: radius, background: 'var(--color-surface-sunken)', borderColor: 'var(--color-border-2)' }}>
      <img src={card.faviconUrl} alt="" onError={() => setBroken(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </span>
  );
};
const CardImage5 = ({ card }) => {
  const [broken, setBroken] = uS5(false);
  if (card.image && !broken) return <img src={card.image} alt="" onError={() => setBroken(true)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />;
  return <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#3a3a38,#5a5a56)' }} />;
};
// Thumb — pending renders a shimmer block that reserves the exact slot the image
// will occupy, so the settle fills in place with no reflow.
const Thumb5 = ({ card, size, radius = 6 }) => {
  if (card.pending) return <div className="pg-media pg-skel" aria-hidden="true" style={{ width: size, height: size, borderRadius: radius, flexShrink: 0 }} />;
  return (
    <a href={card.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true" className="pg-thumblink" style={{ flexShrink: 0 }}>
      <div className="pg-media" style={{ width: size, height: size, borderRadius: radius }}><CardImage5 card={card} /></div>
    </a>
  );
};
// Title — pending stands the URL in as the headline (muted, provisional). On
// resolve it becomes the real title, or stays the URL as the failure floor.
const Title5 = ({ card, size, clamp }) => {
  const common = { href: card.url, target: '_blank', rel: 'noopener noreferrer' };
  if (card.pending) return <a {...common} className={'pg-url-headline pg-pending-headline' + (clamp ? ' pg-clamp2' : '')}>{card.prettyUrl}</a>;
  return card.title
    ? <a {...common} className={'pg-title' + (clamp ? ' pg-clamp2' : '')} style={{ fontSize: size, fontWeight: 600 }}>{card.title}</a>
    : <a {...common} className={'pg-url-headline' + (clamp ? ' pg-clamp2' : '')}>{card.prettyUrl}</a>;
};
const Source5 = ({ card, size = 12.5 }) => (
  <span className="pg-src" style={{ fontFamily: 'var(--font-sans)', fontWeight: card.sourceKnown ? 600 : 500, fontSize: size, color: 'var(--color-fg-2)' }}>{card.sourceName}</span>
);
const Actions5 = ({ card, onDelete, size = 15 }) => {
  if (card.pending) return (
    <div className="pg-iconacts" aria-hidden="true">
      <span className="pg-iact pg-iact-inert"><I5 name="check" size={size} /></span>
      <span className="pg-iact pg-iact-inert"><I5 name="trash" size={size - 1} /></span>
    </div>
  );
  return (
    <div className="pg-iconacts">
      <span className="pg-iact pg-iact-inert" aria-hidden="true" title="Mark as read (disabled in playground)" style={{ pointerEvents: 'none' }}><I5 name="check" size={size} /></span>
      <button className="pg-iact" onClick={() => onDelete(card)} aria-label="Delete this link" title="Delete"><I5 name="trash" size={size - 1} /></button>
    </div>
  );
};
const Attr5 = ({ card, avatar = 22 }) => (
  <div className="pg-row" style={{ gap: 8, minWidth: 0 }}>
    <Av5 name={card.avatarName} size={avatar} accent={card.isYou} />
    <span className="pg-attr" style={{ fontSize: 13 }}>{card.attribution}</span>
  </div>
);
// Source row — pending shows a favicon chip + source line as quiet skeletons
// (the publication is unknown until extraction returns).
const SourceRow5 = ({ card, cfg }) => {
  if (card.pending) return (
    <div className="pg-row" style={{ gap: 8, alignItems: 'center' }}>
      {cfg.favicon && <Skel5 w={15} h={15} r={3} />}
      <Skel5 w={96} h={11} r={3} />
    </div>
  );
  return (
    <div className="pg-row" style={{ gap: 8 }}>
      {cfg.favicon && <Favicon5 card={card} cfg={cfg} />}
      <Source5 card={card} />
    </div>
  );
};
const OpenZone5 = ({ className = '', children }) => <div className={'pg-open ' + className}>{children}</div>;
const Guide5 = ({ cfg }) => (cfg.guides ? <span className="pg-guide" aria-hidden="true" style={{ right: cfg.density === 'comfortable' ? 16 : 14 }} /> : null);
const Card5 = ({ children, cfg, card }) => {
  const cls = 'pg-card pg-dense'
    + (cfg.guides ? ' pg-guided' : '')
    + (card && card.__added ? ' pg-card-enter' : '')
    + (card && card.__justSettled ? ' pg-just-settled' : '');
  return <article className={cls}>{children}<Guide5 cfg={cfg} /></article>;
};

const sizes5 = (cfg) => cfg.density === 'comfortable'
  ? { thumb: 72, rail: 108, title: 16.5, gap: 14, pad: '16px', clamp: false }
  : { thumb: 52, rail: 84, title: 15, gap: 12, pad: '14px', clamp: true };

// ============================================================================
// 1 — EDGE-MATCHED. Today's layout, unchanged, except the trailing action's
// optical edge is snapped to the image's right edge (the direct "just line them
// up" fix). Delete glyph edge == image edge; the button keeps its full target.
// ============================================================================
const EdgeMatched = ({ card, cfg, onDelete }) => {
  const s = sizes5(cfg);
  return (
    <Card5 cfg={cfg} card={card}>
      <div className="pg-body" style={{ padding: s.pad }}>
        <OpenZone5>
          <div className="pg-row" style={{ gap: s.gap, alignItems: 'flex-start' }}>
            <div className="pg-stack" style={{ gap: s.clamp ? 5 : 7, flex: 1, minWidth: 0 }}>
              <SourceRow5 card={card} cfg={cfg} />
              <Title5 card={card} size={s.title} clamp={s.clamp} />
            </div>
            {card.hasImage && <Thumb5 card={card} size={s.thumb} />}
          </div>
        </OpenZone5>
        <div className="pg-foot pg-foot-dense">
          <Attr5 card={card} />
          <span style={{ marginLeft: 'auto' }} className="pg-acts-flush"><Actions5 card={card} onDelete={onDelete} /></span>
        </div>
      </div>
    </Card5>
  );
};

// ============================================================================
// 2 — MEDIA RAIL. The image is a full-height right column. ALL text (source,
// title, attribution) AND the actions live in the left column and share ONE
// clean interior guide — the image's left edge. Nothing tries to align to the
// image's right edge, so nothing can "overhang."
// ============================================================================
const MediaRail = ({ card, cfg, onDelete }) => {
  const s = sizes5(cfg);
  return (
    <Card5 cfg={cfg} card={card}>
      <div className="pg-rail-row">
        <div className="pg-rail-body" style={{ padding: s.pad }}>
          <OpenZone5>
            <div className="pg-stack" style={{ gap: s.clamp ? 5 : 7, minWidth: 0 }}>
              <SourceRow5 card={card} cfg={cfg} />
              <Title5 card={card} size={s.title} clamp={s.clamp} />
            </div>
          </OpenZone5>
          <div className="pg-foot pg-foot-dense">
            <Attr5 card={card} />
            <span style={{ marginLeft: 'auto' }}><Actions5 card={card} onDelete={onDelete} /></span>
          </div>
        </div>
        {card.pending
          ? <div className="pg-mediarail pg-skel" aria-hidden="true" style={{ width: s.rail }} />
          : card.hasImage && (
            <a href={card.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true" className="pg-thumblink pg-mediarail" style={{ width: s.rail }}>
              <div className="pg-media" style={{ position: 'absolute', inset: 0, borderRadius: 0, border: 0 }}><CardImage5 card={card} /></div>
            </a>
          )}
      </div>
    </Card5>
  );
};

// ============================================================================
// 3 — OBJECT COLUMN. The card splits into two zones: LEFT is identity (title +
// attribution), RIGHT is the object (image stacked above its actions). Image
// and actions share the same right edge by construction — they're one column.
// ============================================================================
const ObjectColumn = ({ card, cfg, onDelete }) => {
  const s = sizes5(cfg);
  return (
    <Card5 cfg={cfg} card={card}>
      <div className="pg-body" style={{ padding: s.pad }}>
        <div className="pg-row" style={{ gap: s.gap, alignItems: 'flex-start' }}>
          <div className="pg-stack" style={{ gap: 10, flex: 1, minWidth: 0 }}>
            <OpenZone5>
              <div className="pg-stack" style={{ gap: s.clamp ? 5 : 7, minWidth: 0 }}>
                <SourceRow5 card={card} cfg={cfg} />
                <Title5 card={card} size={s.title} clamp={s.clamp} />
              </div>
            </OpenZone5>
            <Attr5 card={card} />
          </div>
          <div className="pg-objcol" style={{ width: card.hasImage ? s.thumb : 'auto', alignItems: 'flex-end' }}>
            {card.hasImage && <Thumb5 card={card} size={s.thumb} />}
            <span className="pg-objacts"><Actions5 card={card} onDelete={onDelete} /></span>
          </div>
        </div>
      </div>
    </Card5>
  );
};

// ============================================================================
// 4 — TOP BAND. Controls ride the top meta row (source · … · actions), where
// no image competes for the right edge. The image sits in the middle, the
// attribution at the foot. The actions align to the card's right edge cleanly.
// ============================================================================
const TopBand = ({ card, cfg, onDelete }) => {
  const s = sizes5(cfg);
  return (
    <Card5 cfg={cfg} card={card}>
      <div className="pg-body" style={{ padding: s.pad }}>
        <div className="pg-row" style={{ gap: 8, marginBottom: 10 }}>
          <SourceRow5 card={card} cfg={cfg} />
          <span style={{ marginLeft: 'auto' }} className="pg-acts-flush"><Actions5 card={card} onDelete={onDelete} /></span>
        </div>
        <OpenZone5>
          <div className="pg-row" style={{ gap: s.gap, alignItems: 'flex-start' }}>
            <div className="pg-stack" style={{ flex: 1, minWidth: 0 }}>
              <Title5 card={card} size={s.title} clamp={s.clamp} />
            </div>
            {card.hasImage && <Thumb5 card={card} size={s.thumb} />}
          </div>
        </OpenZone5>
        <div className="pg-foot pg-foot-dense"><Attr5 card={card} /></div>
      </div>
    </Card5>
  );
};

// ============================================================================
// 5 — FOOTER TRAY. The footer becomes a contained full-width band (top hairline
// + faint sunken fill) spanning edge to edge. The actions right-align inside the
// tray to the same gutter the image uses — a real, visible right boundary they
// share, rather than two objects floating near each other.
// ============================================================================
const FooterTray = ({ card, cfg, onDelete }) => {
  const s = sizes5(cfg);
  return (
    <Card5 cfg={cfg} card={card}>
      <div style={{ padding: s.pad }}>
        <OpenZone5>
          <div className="pg-row" style={{ gap: s.gap, alignItems: 'flex-start' }}>
            <div className="pg-stack" style={{ gap: s.clamp ? 5 : 7, flex: 1, minWidth: 0 }}>
              <SourceRow5 card={card} cfg={cfg} />
              <Title5 card={card} size={s.title} clamp={s.clamp} />
            </div>
            {card.hasImage && <Thumb5 card={card} size={s.thumb} />}
          </div>
        </OpenZone5>
      </div>
      <div className="pg-tray">
        <Attr5 card={card} />
        <span style={{ marginLeft: 'auto' }}><Actions5 card={card} onDelete={onDelete} /></span>
      </div>
    </Card5>
  );
};

// ---- shell ------------------------------------------------------------------
const TREATMENTS5 = { 1: EdgeMatched, 2: MediaRail, 3: ObjectColumn, 4: TopBand, 5: FooterTray };
const OPTIONS5 = [
  { id: 1, name: 'Edge-matched — shipped', desc: 'Today\u2019s layout; the trailing action\u2019s edge snapped onto the image\u2019s right edge.' },
  { id: 2, name: 'Media rail', desc: 'Image is a full-height right column; text and actions share its left edge.' },
  { id: 3, name: 'Object column', desc: 'Image and actions stack as one right column; identity text sits left.' },
  { id: 4, name: 'Top band', desc: 'Actions ride the top meta row; image mid, attribution below \u2014 nothing overhangs.' },
  { id: 5, name: 'Footer tray', desc: 'A contained full-width action band gives the buttons a real shared right edge.' },
];

const STORE5 = 'pg_densefoot_align';
const load5 = () => { try { return JSON.parse(localStorage.getItem(STORE5) || 'null'); } catch (e) { return null; } };
const DEFAULT5 = { density: 'compact', favicon: true, guides: false, extraction: 'seeded' };

const Seg5 = ({ value, onChange, options }) => (
  <div className="pg-seg" role="radiogroup">
    {options.map((o) => (
      <button key={o.value} type="button" role="radio" aria-checked={o.value === value} className="pg-seg-btn" data-active={o.value === value ? '1' : undefined} onClick={() => onChange(o.value)}>{o.label}</button>
    ))}
  </div>
);
const Field5 = ({ label, children }) => <div className="pg-field"><span className="pg-field-label">{label}</span>{children}</div>;

// ---- Add-link popover — desktop popover mirroring the app's AddReveal. On Add
// it closes IMMEDIATELY (no in-popover spinner); progress lives on the pending
// card in the feed. The outcome selector makes all three terminal states
// reachable: success+image, success+no-image, failure (URL-as-title floor).
const OUTCOMES5 = [
  { value: 'image', label: 'With image' },
  { value: 'noimage', label: 'No image' },
  { value: 'fail', label: 'Fails' },
];
const AddPopover5 = ({ onAdd, onClose }) => {
  const [outcome, setOutcome] = uS5('image');
  const [url, setUrl] = uS5(P5.ADD_EXAMPLES.image.url);
  const [error, setError] = uS5(null);
  const inputRef = React.useRef(null);
  const exampleUrls = React.useMemo(() => Object.values(P5.ADD_EXAMPLES).map((e) => e.url), []);
  uE5(() => { const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 60); return () => clearTimeout(t); }, []);
  uE5(() => { const onKey = (e) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [onClose]);
  // Swap the prefilled URL to the chosen outcome's example — but only while the
  // field still holds an example (never clobber something the user typed).
  const pickOutcome = (o) => { setOutcome(o); setUrl((u) => (!u.trim() || exampleUrls.includes(u.trim())) ? P5.ADD_EXAMPLES[o].url : u); };
  const submit = (e) => {
    e.preventDefault();
    const v = url.trim();
    if (!URL_RE5.test(v)) { setError('That doesn\u2019t look like a valid URL. Check it and try again.'); return; }
    const normalized = /^https?:\/\//i.test(v) ? v : 'https://' + v;
    onAdd({ url: normalized, outcome });     // parent closes the popover + drops the pending card
  };
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 120 }} />
      <form role="dialog" aria-label="Add a link" onSubmit={submit} className="pg-addpop">
        <div className="pg-addpop-head">
          <div className="pg-addpop-title">Add a link</div>
          <button type="button" onClick={onClose} aria-label="Close" className="pg-addpop-x"><I5 name="x" size={18} /></button>
        </div>
        <Fld5 ref={inputRef} name="pg-add-url" mono type="text" inputMode="url" placeholder="example.com/article" value={url} onChange={(e) => { setUrl(e.target.value); if (error) setError(null); }} error={error} />
        <div className="pg-field" style={{ marginTop: -4, marginBottom: 16 }}>
          <span className="pg-field-label">Extraction resolves to</span>
          <Seg5 value={outcome} onChange={pickOutcome} options={OUTCOMES5} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Btn5 type="button" variant="secondary" onClick={onClose}>Cancel</Btn5>
          <Btn5 type="submit" variant="primary">Add</Btn5>
        </div>
      </form>
    </>
  );
};

const App5 = () => {
  const saved = load5() || {};
  const [option, setOption] = uS5(saved.option || 1);
  const [ov, setOv] = uS5({ ...DEFAULT5, ...(saved.ov || {}) });
  const [gone, setGone] = uS5([]);
  const [added, setAdded] = uS5([]);       // transient added-link cards (never persisted)
  const [adding, setAdding] = uS5(false);  // add popover open
  uE5(() => { try { localStorage.setItem(STORE5, JSON.stringify({ option, ov })); } catch (e) {} }, [option, ov]);
  const set = (k, v) => setOv((p) => ({ ...p, [k]: v }));

  // The choreography: drop a pending card immediately, close the popover, then
  // resolve asynchronously in place after a slow/variable extraction delay.
  const commitAdd = ({ url, outcome }) => {
    setAdding(false);
    const key = 'add' + Date.now();
    setAdded((a) => [{ key, url, outcome, phase: 'pending', justSettled: false }, ...a]);
    const settleMs = 1500 + Math.round(Math.random() * 1100);
    setTimeout(() => {
      setAdded((a) => a.map((x) => x.key === key ? { ...x, phase: 'settled', justSettled: true } : x));
      setTimeout(() => setAdded((a) => a.map((x) => x.key === key ? { ...x, justSettled: false } : x)), 340);
    }, settleMs);
  };

  const Treatment = TREATMENTS5[option];
  const addedCards = added.map((a) => {
    const base = a.phase === 'pending' ? P5.makePending(a.url) : P5.settleCard(a.url, a.outcome);
    return { ...base, key: a.key, __added: true, __justSettled: a.justSettled };
  });
  const seededCards = P5.SEED.filter((s) => !gone.includes(s.key)).map((s) => P5.resolve(s, ov));
  const cards = [...addedCards, ...seededCards];    // added links sit on top, where they land
  const opt = OPTIONS5[option - 1];
  const remove = (card) => { if (card.__added) setAdded((a) => a.filter((x) => x.key !== card.key)); else setGone((g) => [...g, card.key]); };

  return (
    <div className="pg-root">
      <aside className="pg-rail">
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '4px 8px 16px' }}>
          <LM5 size={22} />
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em', color: 'var(--color-fg-1)' }}>Circlists</span>
        </div>
        <div className="pg-rail-eyebrow">Alignment approaches</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {OPTIONS5.map((o) => {
            const active = o.id === option;
            return (
              <button key={o.id} onClick={() => setOption(o.id)} className="pg-rail-item" data-active={active ? '1' : undefined}>
                {active && <span className="pg-rail-bar" />}
                <span className="pg-rail-num">{o.id}</span>
                <span style={{ minWidth: 0 }}>
                  <span className="pg-rail-name">{o.name}</span>
                  <span className="pg-rail-desc">{o.desc}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="pg-rail-foot">List dense — foot. Image locked right. Edge-matched (1) is the shipped card; 2–5 are the alignment-study record. Add a link to watch a card arrive: it lands pending, then extraction fills it in place.</div>
      </aside>

      <div className="pg-main">
        <header className="pg-head">
          <div className="pg-head-top">
            <div style={{ minWidth: 0 }}>
              <div className="pg-head-title">{opt.name}</div>
              <div className="pg-head-sub">{opt.desc} · {cards.length} card{cards.length === 1 ? '' : 's'}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              {gone.length > 0 && <button className="pg-reset" onClick={() => setGone([])}>Restore feed</button>}
              <button className="pg-addbtn" onClick={() => setAdding(true)} aria-haspopup="dialog" aria-expanded={adding}><I5 name="plus" size={17} color="#fff" strokeWidth={2} /><span>Add a link</span></button>
            </div>
          </div>
          <div className="pg-controls">
            <Field5 label="Density"><Seg5 value={ov.density} onChange={(v) => set('density', v)} options={[{ value: 'compact', label: 'Compact' }, { value: 'comfortable', label: 'Comfortable' }]} /></Field5>
            <Field5 label="Favicon"><Seg5 value={ov.favicon ? 'on' : 'off'} onChange={(v) => set('favicon', v === 'on')} options={[{ value: 'on', label: 'Beside source' }, { value: 'off', label: 'Off' }]} /></Field5>
            <Field5 label="Alignment guide"><Seg5 value={ov.guides ? 'on' : 'off'} onChange={(v) => set('guides', v === 'on')} options={[{ value: 'off', label: 'Off' }, { value: 'on', label: 'On' }]} /></Field5>
            <div className="pg-ctrl-sep" />
            <Field5 label="Seed extraction outcome"><Seg5 value={ov.extraction} onChange={(v) => set('extraction', v)} options={[{ value: 'seeded', label: 'As seeded' }, { value: 'noimage', label: 'No images' }, { value: 'fail', label: 'Total fail' }]} /></Field5>
          </div>
        </header>

        <main className="pg-feed">
          <div className="pg-feed-col">
            {cards.length === 0 ? (
              <div className="pg-empty"><h2>Nothing here.</h2><p>Every card was deleted. Add a link, or restore the feed to keep exploring.</p></div>
            ) : cards.map((card) => (
              <Treatment key={card.key} card={card} cfg={ov} onDelete={remove} />
            ))}
          </div>
        </main>
      </div>

      {adding && <AddPopover5 onAdd={commitAdd} onClose={() => setAdding(false)} />}
    </div>
  );
};

window.PG5 = { App: App5 };
ReactDOM.createRoot(document.getElementById('root')).render(<App5 />);
