// ============================================================================
// Whiteboard — the Add-a-link surface. Shared parts.
// ----------------------------------------------------------------------------
// Nothing here is a design decision: it is the frame the five options are drawn
// in, plus the pieces they all share. The Swell is the REAL component (the input
// trio exported by app/swell-reactions.jsx); the mark-as-read switch is the one
// the current Add popover uses (CandSwitch, cand-lm652-parts.jsx).
// The only re-drawn thing is the FAB, because the shipped one is position:fixed
// and cannot be mounted inside a frame — geometry copied from feed.jsx.
// ============================================================================
const { useState: wbS, useRef: wbR, useEffect: wbE, useLayoutEffect: wbL } = React;
const { SwellPad, SwellPalette, SwellGlyphRadios, levelFromIntensity, intensityFromLevel,
  glyphAngle, glyphIndexOf, SWELL_MAX, Button, Field, Icon, CandSwitch, CAND_PAPER } = window;

const WB_URL_RE = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i;

// ---- the seed thought, at the three lengths --------------------------------
const WB_ONE = 'Made me rethink how we do handovers.';
const WB_PARA = 'We have been arguing about the on-call rota for a month and this is the first thing I have read that names the actual problem. It is not the rota. It is that nothing survives the handover, so every shift starts from nothing. The part I want us to talk about is what gets written down at the end of a shift.';
const WB_BULLETS = WB_PARA + '\n- the handover note is the artefact, not the rota\n- alert volume is a symptom, not the cause\n- shadow two weeks before carrying the pager';
const WB_TEXTS = { none: '', one: WB_ONE, para: WB_PARA, bullets: WB_BULLETS };
const WB_LENGTHS = [['none', 'Empty'], ['one', 'One line'], ['para', 'Paragraph'], ['bullets', '+ bullets']];

// ---- per-option state, shared by both widths of that option -----------------
const useAdd = (url0) => {
  const [url, setUrl] = wbS(url0);
  const [text, setText] = wbS('');
  const [len, setLen] = wbS('none');
  const [read, setRead] = wbS(false);
  const [open, setOpen] = wbS(true);
  const [swell, setSwell] = wbS({ glyph: null, intensity: null, nx: 0.5, ny: 0.5 });
  // Not-read and here-is-my-reaction cannot both be true (the shipped rule).
  const toggleRead = (v) => { setRead(v); if (!v) setSwell({ glyph: null, intensity: null, nx: 0.5, ny: 0.5 }); };
  const pickLen = (k) => { setLen(k); setText(WB_TEXTS[k]); };
  const write = (v) => { setText(v); setLen(null); };
  return { url, setUrl, text, write, len, pickLen, read, toggleRead, swell, setSwell, open, setOpen };
};

// ---- a textarea that grows, then scrolls -----------------------------------
const Grow = ({ value, onChange, placeholder, maxPx = 220, minLines = 2, fs = 15, lh = 1.6, weight = 400,
  color = 'var(--color-fg-1)', max, ariaLabel, style }) => {
  const ref = wbR(null);
  wbL(() => {
    const el = ref.current; if (!el) return;
    el.style.height = 'auto';
    const h = Math.min(el.scrollHeight, maxPx);
    el.style.height = h + 'px';
    el.style.overflowY = el.scrollHeight > maxPx + 1 ? 'auto' : 'hidden';
  }, [value, maxPx, fs]);
  return (
    <textarea ref={ref} value={value} placeholder={placeholder} aria-label={ariaLabel} maxLength={max}
      rows={minLines} onChange={(e) => onChange(e.target.value)} className="wb-ta"
      style={{ display: 'block', width: '100%', border: 0, outline: 'none', background: 'transparent',
        resize: 'none', padding: 0, margin: 0, fontFamily: 'var(--font-sans)', fontWeight: weight,
        fontSize: fs, lineHeight: lh, color, minHeight: Math.round(fs * lh * minLines), ...(style || {}) }} />
  );
};

// ---- height-animated disclosure (the shipped Swell-under-the-toggle pattern) -
const Collapse = ({ open, children }) => {
  const r = wbR(null); const [h, setH] = wbS(0);
  wbL(() => { if (r.current) setH(r.current.scrollHeight); }, [open, children]);
  return (
    <div style={{ overflow: 'hidden', height: open ? h : 0, transition: 'height 300ms var(--ease-quiet)' }} aria-hidden={!open}>
      <div ref={r}>{children}</div>
    </div>
  );
};

// ---- The Swell, mounted (input trio; no Skip/Done — Add commits it) ---------
// Framing: NO heading. One caption under the disc, carrying both the role and
// the optionality — chosen 2026-08-17 from pg-wb-swell-framing.html (route 1a).
// Nothing sits above the disc: a label above it reads as a heading whatever its
// register, which is what killed the earlier attempts.
const SWELL_CAPTION = 'Optional. Say how it landed, or leave it blank.';
const SwellBlock = ({ swell, setSwell, active, box, onWhite = false }) => {
  box = box || 232;
  const level = levelFromIntensity(swell.intensity != null ? swell.intensity : 0.6);
  const apply = (g, L) => {
    const a = glyphAngle(glyphIndexOf(g));
    if (L == null) { setSwell({ glyph: g, intensity: null, nx: 0.5, ny: 0.5 }); return; }
    const r = intensityFromLevel(L) * SWELL_MAX;
    setSwell({ glyph: g, intensity: intensityFromLevel(L), nx: 0.5 + Math.cos(a) * r, ny: 0.5 + Math.sin(a) * r });
  };
  const ins = Math.round(box * 0.1389);
  // Spacing is set on the INK, not the box: a glyph sits on the box's top edge,
  // the lower glyphs stop 20px short of its bottom. padding-top 13 (+7 from the
  // row above = 20 to the heart) and gap 0 (+20 of empty box = 20 to the
  // caption) read as equal. Equal padding does not.
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, padding: '13px 0 12px',
      ...(onWhite ? { background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)', padding: '20px 8px 16px' } : {}) }}>
      <div style={{ position: 'relative', width: box, height: box }}>
        {active && <SwellGlyphRadios live={swell} onPick={(g) => apply(g, swell.intensity != null ? level : null)} />}
        <div style={{ position: 'absolute', inset: ins }}>
          <SwellPad size={box - ins * 2} live={swell} level={level} interactive={active}
            opts={{ centerDot: true, breath: true, snap: true }}
            onChange={setSwell} onDepth={(L) => { if (swell.glyph) apply(swell.glyph, L); }} />
        </div>
        <SwellPalette live={swell} box={box} />
      </div>
      <p style={{ margin: 0, font: '400 12px/1.5 var(--font-sans)', color: 'var(--color-fg-3)', textAlign: 'center', textWrap: 'pretty' }}>
        {SWELL_CAPTION}
      </p>
    </div>
  );
};

// ---- mark-as-read row (label + the shipped switch) -------------------------
const ReadRow = ({ on, onChange, style }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 44, ...(style || {}) }}>
    <span style={{ font: '500 14px/1.3 var(--font-sans)', color: 'var(--color-fg-1)' }}>Mark as read</span>
    <CandSwitch on={on} onChange={onChange} label="Mark as read" />
  </div>
);

const Actions = ({ submit = 'Add', onClose }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
    <Button type="button" variant="primary">{submit}</Button>
  </div>
);

const SheetTitle = ({ children, onClose }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
    <div style={{ font: '600 15px/1.3 var(--font-sans)', color: 'var(--color-fg-1)' }}>{children}</div>
    <button type="button" onClick={onClose} aria-label="Close" style={{ background: 'transparent', border: 0, padding: 6, margin: -6, cursor: 'pointer', color: 'var(--color-fg-2)', display: 'inline-flex' }}>
      <Icon name="x" size={18} />
    </button>
  </div>
);

// ---- the surface shell: bottom sheet at 390, popover on the desktop frame ---
const Shell = ({ mobile, open, onClose, children, pad, bg, bd, scroll = true }) => {
  const base = { background: bg || 'var(--color-surface)', boxShadow: 'var(--shadow-overlay)',
    padding: pad || 'var(--space-5)', overflowY: scroll ? 'auto' : 'visible', overscrollBehavior: 'contain' };
  return mobile ? (
    <React.Fragment>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'var(--color-scrim)', opacity: open ? 1 : 0, transition: 'opacity var(--duration-slow) ease-in-out', pointerEvents: open ? 'auto' : 'none' }} />
      <div role="dialog" aria-label="Add a link" style={{ ...base, position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 3,
        borderTopLeftRadius: 20, borderTopRightRadius: 20, border: bd ? '1px solid ' + bd : undefined, borderBottom: 0,
        maxHeight: 'calc(100% - 32px)', transform: open ? 'translateY(0)' : 'translateY(101%)',
        transition: 'transform var(--duration-slow) var(--ease-quiet)' }}>{children}</div>
    </React.Fragment>
  ) : (
    <div role="dialog" aria-label="Add a link" style={{ ...base, position: 'absolute', right: 24, bottom: 92, width: 400, zIndex: 3,
      borderRadius: 'var(--radius-lg)', border: '1px solid ' + (bd || 'var(--color-border-1)'),
      maxHeight: 'calc(100% - 116px)', opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
      transition: 'opacity var(--duration-base) var(--ease-quiet)' }}>{children}</div>
  );
};

// ---- the FAB (re-drawn: the shipped one is position:fixed) -----------------
const Fab = ({ open, onClick, mobile }) => (
  <button type="button" onClick={onClick} aria-label={open ? 'Close' : 'Add a link'} aria-expanded={open}
    style={{ position: 'absolute', right: mobile ? 24 : 32, bottom: mobile ? 24 : 32, zIndex: 1,
      width: 56, height: 56, borderRadius: '50%', background: 'var(--color-accent)', border: 0, cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(4,120,87,0.28), 0 1px 3px rgba(10,10,10,0.12)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: 'block' }}>
      <g stroke="#fff" strokeWidth="2" strokeLinecap="round" style={{ transformBox: 'fill-box', transformOrigin: 'center',
        transform: open ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform var(--duration-slow) var(--ease-quiet)' }}>
        <line x1="12" y1="4" x2="12" y2="20" /><line x1="4" y1="12" x2="20" y2="12" />
      </g>
    </svg>
  </button>
);

// ---- a frame: one width of one option. No bezel, no feed, no app chrome. ---
const Frame = ({ mobile, label, children }) => (
  <div className="wb-cell">
    <span className="wb-cap">{label}</span>
    <div className="wb-frame" style={{ width: mobile ? 390 : 480 }}>{children}</div>
  </div>
);

const wbHint = { font: '400 12.5px/1.55 var(--font-sans)', color: 'var(--color-fg-3)' };
const wbMono = { font: '500 12px/1.4 var(--font-mono)', color: 'var(--color-fg-2)' };

Object.assign(window, { WB_URL_RE, WB_TEXTS, WB_LENGTHS, useAdd, Grow, Collapse, SwellBlock, SWELL_CAPTION,
  ReadRow, Actions, SheetTitle, Shell, Fab, Frame, wbHint, wbMono, wbS, wbR, wbE, wbL, CAND_PAPER });
