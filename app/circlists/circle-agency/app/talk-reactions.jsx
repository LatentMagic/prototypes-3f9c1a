// ============================================================================
// Comment reactions. One of the Swell's five glyphs on any comment or reply.
// A droppable module: CandTurn reads window.CandReactions per render, so
// removing this file removes the react button, the bar, the pill and the
// who-reacted view, and nothing else.
//
// Data: a turn carries `reactions: [{ who, glyph, at }]`, one entry per person,
// in the order they reacted. `who` is a display name, "You", or "Former member."
// (a deleted account — resolved through circContributorLabel, the same rule
// cards and turns use). A removed turn has no reactions (candDeleteTurn).
//
// No wider signal: reacting writes the turn's list and nothing else — not
// `watching`, not `talkSeenAt`, no push. Do not route it through
// candAddTurn. The returns bar reads a reaction on YOUR words from the list
// itself (candFreshRx, app/talk-return.jsx).
// ============================================================================

const CR_GLYPHS = window.RX_GLYPHS || ['\u2764\uFE0F', '\uD83D\uDD25', '\uD83D\uDC4D', '\uD83D\uDCA1', '\uD83D\uDE02'];
const crGlyphName = (g) => (window.glyphName ? window.glyphName(g) : g);
const crList = (t) => ((t && !t.deleted && t.reactions) || []);
const crMine = (t) => crList(t).find(r => r.who === 'You') || null;
const crLabel = (r) => (window.circContributorLabel ? window.circContributorLabel(r.who) : r.who);
// The door's own huddle rule: up to three distinct glyphs, in arrival order.
const crHuddle = (list) => {
  const seen = [];
  for (const r of list) { if (r.glyph && !seen.includes(r.glyph)) seen.push(r.glyph); if (seen.length === 3) break; }
  return seen;
};
const crNarrow = () => window.innerWidth < 520 || !!document.querySelector('.circ-phone-screen');
// The room the overlay can open into: the phone screen, or the viewport. The
// sticky top bar is spent space either way, so it is taken off the top.
const crBounds = () => {
  const bar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--top-bar-height')) || 56;
  const ph = document.querySelector('.circ-phone-screen');
  const b = ph ? ph.getBoundingClientRect() : { top: 0, right: window.innerWidth };
  return { top: b.top + bar, right: b.right };
};
const crReduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const crArrive = (el, dy) => {
  if (!el || crReduced() || !el.animate) return;
  el.animate([{ opacity: 0, transform: 'translateY(' + dy + 'px)' }, { opacity: 1, transform: 'none' }],
    { duration: 150, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
};

// Set, swap or remove YOUR reaction. Picking your current glyph (or null)
// removes it; picking another swaps it in place, keeping your position in the
// reaction order — you reacted then, you changed which.
const candReactTurn = (api, item, turnId, glyph) => candUpdateItem(api, item.id, i => ({ ...i,
  talk: (i.talk || []).map(t => {
    if (t.id !== turnId || t.deleted) return t;
    const list = t.reactions || [];
    const mine = list.find(r => r.who === 'You');
    const next = (!glyph || (mine && mine.glyph === glyph)) ? list.filter(r => r.who !== 'You')
      : mine ? list.map(r => (r.who === 'You' ? { ...r, glyph } : r))
      : [...list, { who: 'You', glyph, at: Date.now() }];
    return { ...t, reactions: next };
  }) }));

const CrFace = () => (
  <svg viewBox="0 0 24 24" width={17} height={17} aria-hidden="true"
    style={{ display: 'block', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M20.2 12.6A8.4 8.4 0 1 1 11.4 3.6" />
    <path d="M8 14.2c.9 1.3 2.1 2 3.5 2s2.6-.7 3.5-2" />
    <circle cx="8.6" cy="9.6" r=".6" fill="currentColor" />
    <circle cx="14.4" cy="9.6" r=".6" fill="currentColor" />
    <path d="M19 2.5v6M16 5.5h6" />
  </svg>
);

// ---- the quick bar ----------------------------------------------------------
const CR_CELL = 40;
const CR_BAR_W = CR_CELL * 5 + 10;
const CandReactBar = ({ mine, place, onPick, onClose }) => {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => { crArrive(ref.current, place.below ? -4 : 4); }, []);
  React.useEffect(() => {
    const btns = ref.current ? ref.current.querySelectorAll('button') : [];
    const i = Math.max(0, CR_GLYPHS.indexOf(mine));
    if (btns[i]) btns[i].focus({ preventScroll: true });
  }, []);
  const onKey = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const btns = Array.from(ref.current.querySelectorAll('button'));
    const i = btns.indexOf(document.activeElement);
    const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + btns.length) % btns.length;
    e.preventDefault(); btns[n].focus({ preventScroll: true });
  };
  return (
    <div ref={ref} role="toolbar" aria-label="React" onKeyDown={onKey}
      style={{ position: 'absolute', zIndex: 30, width: CR_BAR_W,
        ...(place.below ? { top: 'calc(100% + 6px)' } : { bottom: 'calc(100% + 6px)' }),
        ...(place.flip ? { right: -12 } : { left: -12 }),
        display: 'flex', gap: 0, padding: 4, background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-overlay)' }}>
      {CR_GLYPHS.map(g => {
        const on = g === mine;
        return (
          <button key={g} type="button" className="cand-crglyph" aria-pressed={on}
            aria-label={on ? crGlyphName(g) + ', yours. Remove' : crGlyphName(g)}
            onClick={() => onPick(g)}
            style={{ width: CR_CELL, height: 44, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              border: 0, padding: 0, cursor: 'pointer', borderRadius: 'var(--radius-md)', fontSize: 22, lineHeight: 1,
              background: on ? 'var(--color-surface-sunken)' : 'transparent',
              boxShadow: on ? 'inset 0 0 0 1px var(--color-accent)' : 'none' }}>{g}</button>
        );
      })}
    </div>
  );
};

// ---- the pill ---------------------------------------------------------------
const CandReactPill = React.forwardRef(({ list, mine, open, onOpen, animate }, fwd) => {
  const inner = React.useRef(null);
  React.useLayoutEffect(() => { if (animate) crArrive(inner.current, 2); }, []);
  const glyphs = crHuddle(list);
  const n = list.length;
  const said = glyphs.map(crGlyphName).join(', ');
  const label = said + (n > 1 ? ', ' + n + ' people' : '') + (mine ? ', including you' : '') + '. See who reacted';
  return (
    <button ref={fwd} type="button" className="cand-crpill" onClick={onOpen} aria-haspopup="dialog" aria-expanded={open}
      aria-label={label} data-mine={mine ? '' : undefined}
      style={{ background: 'transparent', border: 0, padding: '8px 0', margin: '-8px 0', minHeight: 44, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
      <span ref={inner} className="cand-crpill-face" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 24, padding: '0 6px',
        borderRadius: 'var(--radius-md)', background: 'var(--color-surface)',
        border: '1px solid ' + (mine ? 'var(--color-accent)' : 'var(--color-border-1)') }}>
        {/* Contents nudged down 1px: emoji and figures sit high in a line-height:1 box, so the gap above read smaller than below. */}
        <span style={{ display: 'inline-flex', alignItems: 'center', transform: 'translateY(1px)' }}>
          {glyphs.map((g, i) => (
            <span key={g} aria-hidden="true" style={{ width: 16, height: 16, fontSize: 14, lineHeight: 1, marginLeft: i ? -2 : 0,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{g}</span>
          ))}
        </span>
        {n > 1 && <span aria-hidden="true" style={{ font: '600 12px/1 var(--font-sans)', fontVariantNumeric: 'tabular-nums', transform: 'translateY(1px)',
          color: mine ? 'var(--color-accent)' : 'var(--color-fg-2)' }}>{n}</span>}
      </span>
    </button>
  );
});

// ---- who reacted --------------------------------------------------------------
// You first, then everyone else in the order they reacted.
const crOrdered = (list) => { const me = list.filter(r => r.who === 'You'); return [...me, ...list.filter(r => r.who !== 'You')]; };
const CrRows = ({ list, onRemove }) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    {crOrdered(list).map((r, i) => {
      const mine = r.who === 'You';
      const body = (
        <React.Fragment>
          <span aria-hidden="true" style={{ width: 28, fontSize: 20, lineHeight: 1, flexShrink: 0, textAlign: 'center' }}>{r.glyph}</span>
          <span style={{ flex: 1, minWidth: 0, font: '600 14px/1.3 var(--font-sans)', color: 'var(--color-fg-1)', textAlign: 'left' }}>{crLabel(r)}</span>
          {mine && <span style={{ font: '500 13px/1.3 var(--font-sans)', color: 'var(--color-fg-2)', flexShrink: 0 }}>Remove</span>}
        </React.Fragment>
      );
      const row = { display: 'flex', alignItems: 'center', gap: 10, minHeight: 44, padding: '0 10px', width: '100%', borderRadius: 'var(--radius-sm)' };
      return mine ? (
        <button key={'me'} type="button" className="circ-menuitem" onClick={onRemove}
          aria-label={'Your reaction, ' + crGlyphName(r.glyph) + '. Remove'}
          style={{ ...row, background: 'transparent', border: 0, cursor: 'pointer', font: 'inherit' }}>{body}</button>
      ) : (
        <div key={i} style={row} aria-label={crLabel(r) + ', ' + crGlyphName(r.glyph)} role="listitem">{body}</div>
      );
    })}
  </div>
);

// Phone: a bottom sheet on the app's one sheet mechanism (useSheetMount, portal
// to the phone screen — GOTCHA 1 and 3).
const CandReactSheet = ({ list, onRemove, onClose }) => {
  const { shown, requestClose } = window.useSheetMount(true, onClose);
  const closeRef = React.useRef(null);
  const panelRef = React.useRef(null);
  const [target] = React.useState(() => document.querySelector('.circ-phone-screen') || document.body);
  React.useEffect(() => window.lockScroll(), []);
  React.useEffect(() => {
    const key = (e) => { if (e.key === 'Escape') requestClose(); };
    window.addEventListener('keydown', key);
    if (closeRef.current) closeRef.current.focus({ preventScroll: true });
    return () => window.removeEventListener('keydown', key);
  }, []);
  const Close = window.CloseX;
  return ReactDOM.createPortal(
    <div onClick={(e) => { if (e.target === e.currentTarget) requestClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 140, background: 'var(--color-scrim)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        opacity: shown ? 1 : 0, transition: 'opacity var(--duration-slow) ease-in-out' }}>
      <div role="dialog" aria-modal="true" aria-label="Reactions" ref={panelRef}
        onKeyDown={(e) => window.trapTab && window.trapTab(panelRef.current, e)}
        style={{ position: 'relative', background: 'var(--color-surface)', borderTopLeftRadius: 16, borderTopRightRadius: 16,
          boxShadow: 'var(--shadow-overlay)', width: '100%', maxWidth: 520,
          padding: 'var(--space-4) var(--space-3) calc(var(--space-4) + env(safe-area-inset-bottom, 0px))',
          maxHeight: 'calc(100% - 24px)', overflowY: 'auto', overscrollBehavior: 'contain',
          transform: shown ? 'translateY(0)' : 'translateY(100%)', transition: 'transform var(--duration-slow) var(--ease-quiet)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0 8px 10px' }}>
          <h2 style={{ margin: 0, font: '600 17px/1.3 var(--font-sans)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)' }}>Reactions</h2>
          <button ref={closeRef} type="button" onClick={requestClose} aria-label="Close"
            style={{ width: 44, height: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 0, borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--color-fg-3)' }}>
            {Close ? <Close /> : 'Close'}
          </button>
        </div>
        <div role="list"><CrRows list={list} onRemove={onRemove} /></div>
      </div>
    </div>, target);
};

// Desktop: a popover under the pill, on CandTurnMenu's card and flip rule.
const CR_POP_W = 248;
const CandReactPopover = ({ list, place, onRemove, onClose, wrapRef }) => {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => { crArrive(ref.current, place.below ? -4 : 4); if (ref.current) ref.current.focus({ preventScroll: true }); }, []);
  React.useEffect(() => {
    const away = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) onClose(false); };
    const key = (e) => { if (e.key === 'Escape') onClose(true); };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', key); };
  }, []);
  return (
    <div ref={ref} role="dialog" aria-label="Reactions" tabIndex={-1}
      style={{ position: 'absolute', zIndex: 30, width: CR_POP_W, outline: 'none',
        ...(place.below ? { top: 'calc(100% + 6px)' } : { bottom: 'calc(100% + 6px)' }),
        ...(place.flip ? { right: 0 } : { left: 0 }),
        background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-overlay)', padding: 6 }}>
      <div style={{ padding: '8px 10px 4px', font: '600 13px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>Reactions</div>
      <div role="list"><CrRows list={list} onRemove={onRemove} /></div>
    </div>
  );
};

// ---- the whole control, as it sits in a turn's action line --------------------
// [React] [pill]. The pill comes AFTER the button so the button never moves when
// the first reaction lands; the pill simply arrives beside it.
const CandReactions = ({ item, t, api }) => {
  const list = crList(t);
  const mine = crMine(t);
  const [bar, setBar] = React.useState(null);     // null | { below, flip }
  const [who, setWho] = React.useState(() => {     // null | 'sheet' | { below, flip }
    if (window.__candWhoOpen === t.id) { window.__candWhoOpen = null; return crNarrow() ? 'sheet' : { below: true, flip: false }; }
    return null;
  });
  const barWrap = React.useRef(null);
  const pillWrap = React.useRef(null);
  const btn = React.useRef(null);
  const pill = React.useRef(null);
  const mounted = React.useRef(false);
  const hadPill = React.useRef(list.length > 0);
  const [refused, setRefused] = React.useState(false);
  React.useEffect(() => { mounted.current = true; }, []);
  const arriving = list.length > 0 && !hadPill.current && mounted.current;
  React.useEffect(() => { hadPill.current = list.length > 0; });
  const placeFor = (el, h, w) => {
    const r = el.getBoundingClientRect(); const b = crBounds();
    return { below: r.top - b.top < h + 16, flip: r.left + w > b.right - 8 };
  };
  const closeBar = (refocus) => { setBar(null); if (refocus && btn.current) btn.current.focus({ preventScroll: true }); };
  React.useEffect(() => {
    if (!bar) return;
    const away = (e) => { if (barWrap.current && !barWrap.current.contains(e.target)) closeBar(false); };
    const key = (e) => { if (e.key === 'Escape') closeBar(true); };
    const scroll = () => closeBar(false);
    document.addEventListener('mousedown', away);
    document.addEventListener('touchstart', away, { passive: true });
    document.addEventListener('keydown', key);
    document.addEventListener('scroll', scroll, true);
    return () => {
      document.removeEventListener('mousedown', away); document.removeEventListener('touchstart', away);
      document.removeEventListener('keydown', key); document.removeEventListener('scroll', scroll, true);
    };
  }, [!!bar]);
  const closeWho = (refocus) => {
    setWho(null);
    const back = pill.current || btn.current;
    if (refocus && back) back.focus({ preventScroll: true });
  };
  // Your row removes your reaction. If you were the only one, the pill goes, so
  // the view goes with it and focus lands on the react button.
  const removeMine = () => {
    const last = list.length === 1;
    candReactTurn(api, item, t.id, null);
    if (last) { setWho(null); if (btn.current) btn.current.focus({ preventScroll: true }); }
  };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <span ref={barWrap} style={{ position: 'relative', display: 'inline-flex' }}>
        <button ref={btn} type="button" className="cand-crbtn" aria-haspopup="true" aria-expanded={!!bar}
          aria-label={mine ? 'Your reaction, ' + crGlyphName(mine.glyph) + '. Change' : 'React'} title="React"
          onClick={() => setBar(b => (b ? null : placeFor(btn.current, 56, CR_BAR_W - 12)))}
          style={{ background: 'transparent', border: 0, cursor: 'pointer',
            minHeight: 44, minWidth: 44, padding: 12, margin: '-12px', borderRadius: 'var(--radius-sm)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <CrFace />
        </button>
        {bar && <CandReactBar mine={mine && mine.glyph} place={bar}
          onPick={(g) => {
            // A refused write changes nothing: the comment keeps the reaction it had.
            if (window.circFailNext && window.circFailNext('reaction')) { setRefused(true); closeBar(true); return; }
            setRefused(false); candReactTurn(api, item, t.id, g); closeBar(true); }} onClose={closeBar} />}
      </span>
      {list.length > 0 && (
        <span ref={pillWrap} style={{ position: 'relative', display: 'inline-flex' }}>
          <CandReactPill ref={pill} list={list} mine={!!mine} open={!!who} animate={arriving}
            onOpen={() => setWho(w => (w ? null : crNarrow() ? 'sheet' : placeFor(pill.current, 60 + list.length * 44, CR_POP_W)))} />
          {who && who !== 'sheet' && <CandReactPopover list={list} place={who} wrapRef={pillWrap} onRemove={removeMine} onClose={closeWho} />}
        </span>
      )}
      <span role="status" aria-live="polite" style={refused ? { flexBasis: '100%', display: 'inline-flex', alignItems: 'flex-start', gap: 6, font: '500 13px/1.4 var(--font-sans)', color: 'var(--color-destructive)' } : { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        {refused && <><span aria-hidden="true" style={{ marginTop: 1, flexShrink: 0 }}><Icon name="x" size={14} /></span><span>Couldn&#8217;t save that. Please try again.</span></>}
      </span>
      {who === 'sheet' && list.length > 0 && <CandReactSheet list={list} onRemove={removeMine} onClose={() => closeWho(true)} />}
    </span>
  );
};

Object.assign(window, { CandReactions, CandReactBar, CandReactPill, CandReactSheet, CandReactPopover, candReactTurn, CR_GLYPHS });
