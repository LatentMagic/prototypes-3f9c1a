// ============================================================================
// Discourse v2 — shared parts.
// The sheet (bottom sheet narrow / centred dialog wide, matching the shipped
// Swell), a static disc copied from app/swell-reactions.jsx, the record row that
// carries a member's glyph AND their words, the pointing control, and the one
// composer every response shape goes through.
// ============================================================================

const { Icon: D2Icon, Avatar: D2Avatar } = window;
const { useState: d2S, useEffect: d2E, useRef: d2R } = React;

// ---- Swell geometry — copied from app/swell-reactions.jsx -------------------
// The shipped module keeps its disc internal, so the numbers live twice. Keep
// them in step with the source; never "improve" them here.
const D2_GLYPHS = ['\u2764\uFE0F', '\uD83D\uDD25', '\uD83D\uDC4D', '\uD83D\uDCA1', '\uD83D\uDE02'];
const d2Angle = (i) => (-90 + i * 72) * Math.PI / 180;
const d2Hash = (s) => { let h = 2166136261; s = String(s || ''); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const d2Iv = (r) => (r && r.intensity != null ? r.intensity : 0.42);
const d2IsSkip = (r) => !r || !r.glyph;
const d2Pos = (r) => {
  const idx = r && r.glyph ? D2_GLYPHS.indexOf(r.glyph) : -1;
  const jr = ((d2Hash((r && r.name) + '~r') % 1000) / 1000 - 0.5) * 0.07;
  const ja = ((d2Hash(r && r.name) % 1000) / 1000 - 0.5) * 0.32;
  let rr = idx >= 0 ? 0.13 + d2Iv(r) * 0.20 : 0.05;
  if (idx >= 0) rr = Math.max(0.1, Math.min(0.34, rr + jr));
  const a = (idx >= 0 ? d2Angle(idx) : -Math.PI / 2) + ja;
  return { x: 0.5 + Math.cos(a) * rr, y: 0.5 + Math.sin(a) * rr };
};
const d2Layout = (list) => {
  const pts = list.map(d2Pos);
  const half = (r) => 0.05 + d2Iv(r) * 0.045;
  for (let it = 0; it < 20; it++) {
    let moved = false;
    for (let a = 0; a < pts.length; a++) for (let b = a + 1; b < pts.length; b++) {
      let dx = pts[b].x - pts[a].x, dy = pts[b].y - pts[a].y, d = Math.hypot(dx, dy);
      if (d < 0.001) { const g = a * 2.39996; dx = Math.cos(g); dy = Math.sin(g); d = 0.001; }
      const min = (half(list[a]) + half(list[b])) * 0.62;
      if (d < min) { const p = (min - d) / 2, ux = dx / d, uy = dy / d; pts[a].x -= ux * p; pts[a].y -= uy * p; pts[b].x += ux * p; pts[b].y += uy * p; moved = true; }
    }
    for (const p of pts) { const cx = p.x - 0.5, cy = p.y - 0.5, dd = Math.hypot(cx, cy); if (dd > 0.46) { p.x = 0.5 + cx * 0.46 / dd; p.y = 0.5 + cy * 0.46 / dd; } }
    if (!moved) break;
  }
  return pts;
};

const D2Disc = ({ reactions, size = 200 }) => {
  const list = (reactions || []).filter((r) => !d2IsSkip(r));
  const pts = d2Layout(list);
  const k = size / 216;
  return (
    <div style={{
      position: 'relative', width: size, height: size, flexShrink: 0, borderRadius: '50%',
      background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-1)',
      backgroundImage: 'radial-gradient(circle, var(--color-border-2) 1px, transparent 1px)',
      backgroundSize: (size / 5) + 'px ' + (size / 5) + 'px', backgroundPosition: 'center',
    }}>
      <span style={{ position: 'absolute', left: '50%', top: '50%', width: 5, height: 5, borderRadius: '50%', background: 'var(--color-border-1)', transform: 'translate(-50%,-50%)' }} />
      {list.map((r, i) => {
        const me = r.name === 'You', fs = ((me ? 20 : 18) + d2Iv(r) * 20) * k;
        return (
          <span key={i} title={r.former ? 'Former member' : r.name} style={{ position: 'absolute', left: (pts[i].x * 100) + '%', top: (pts[i].y * 100) + '%', transform: 'translate(-50%,-50%)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            {me && <span style={{ position: 'absolute', width: fs * 1.7, height: fs * 1.7, borderRadius: '50%', background: 'rgba(4,120,87,0.14)' }} />}
            <span style={{ position: 'relative', fontSize: fs, lineHeight: 1 }}>{r.glyph}</span>
          </span>
        );
      })}
    </div>
  );
};

// Up to three distinct glyphs — the door's own huddle (shipped grammar).
const D2Huddle = ({ reactions, size = 16 }) => {
  const seen = [];
  for (const r of reactions || []) { if (r.glyph && !seen.includes(r.glyph)) seen.push(r.glyph); if (seen.length === 3) break; }
  if (!seen.length) return null;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      {seen.map((g, i) => <span key={i} style={{ fontSize: size, lineHeight: 1, width: size + 1, height: size + 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: i === 0 ? 0 : -4 }}>{g}</span>)}
    </span>
  );
};

// ---- The sheet -------------------------------------------------------------
// Narrow: bottom sheet, the AddReveal choreography verbatim. Wide: centred
// dialog, matching SwellReactionFlow's own breakpoint so the record and the
// reaction wear the same container at every width.
//   noEnter — mount already in place instead of sliding in. Used for the one
//   breath: the reaction sheet leaves and the record takes over its position, so
//   the container never appears to go away.
const D2Sheet = ({ eyebrow, title, onClose, children, noEnter, foot }) => {
  const [vw, setVw] = d2S(window.innerWidth);
  d2E(() => { const on = () => setVw(window.innerWidth); window.addEventListener('resize', on); return () => window.removeEventListener('resize', on); }, []);
  const narrow = vw < 520 || !!document.querySelector('.circ-phone-screen');
  const [shown, setShown] = d2S(!!noEnter);
  const closing = d2R(false);
  d2E(() => {
    if (noEnter) return;
    let r2; const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setShown(true)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, []);
  const req = () => { if (closing.current) return; closing.current = true; setShown(false); setTimeout(onClose, narrow ? 220 : 120); };
  d2E(() => { const k = (e) => { if (e.key === 'Escape') req(); }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, []);
  const panel = narrow ? {
    position: 'relative', width: '100%', maxWidth: 520, background: 'var(--color-surface)',
    borderTopLeftRadius: 16, borderTopRightRadius: 16, boxShadow: 'var(--shadow-overlay)',
    padding: 'var(--space-5) var(--space-5) calc(var(--space-4) + env(safe-area-inset-bottom, 0px))',
    maxHeight: 'calc(100% - 20px)', overflowY: 'auto', overscrollBehavior: 'contain',
    transform: shown ? 'translateY(0)' : 'translateY(100%)',
    transition: 'transform var(--duration-slow) var(--ease-quiet)',
  } : {
    position: 'relative', width: 460, maxWidth: '100%', background: 'var(--color-surface)',
    borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-overlay)', padding: 'var(--space-6)',
    maxHeight: 'calc(100% - 32px)', overflowY: 'auto', overscrollBehavior: 'contain',
    opacity: shown ? 1 : 0, transition: 'opacity var(--duration-base) ease-out',
  };
  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) req(); }} style={{
      position: 'fixed', inset: 0, zIndex: 140, background: 'var(--color-scrim)',
      display: 'flex', alignItems: narrow ? 'flex-end' : 'center', justifyContent: 'center',
      padding: narrow ? 0 : 16,
      opacity: shown || noEnter ? 1 : 0, transition: 'opacity var(--duration-slow) ease-in-out',
    }}>
      <div role="dialog" aria-modal="true" aria-label={title || eyebrow || 'Sheet'} style={panel}>
        <button type="button" onClick={req} aria-label="Close" className="circ-rx-close" style={{
          position: 'absolute', top: 10, right: 10, width: 36, height: 36, zIndex: 2,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent', border: 0, borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--color-fg-3)',
        }}><D2Icon name="x" size={18} /></button>
        {eyebrow && <div className="d2-eyebrow" style={{ marginBottom: 4 }}>{eyebrow}</div>}
        {title && <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-xl)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: '0 0 14px', paddingRight: 32 }}>{title}</h2>}
        {children}
        {foot}
      </div>
    </div>
  );
};

// ---- Type ------------------------------------------------------------------
// The preface outranks everything (ideation note 6): a size up, full weight, and
// the responses are set under it as replies.
const D2Preface = ({ preface, cfg, size = 'card' }) => {
  const q = !!preface.ask;
  const fs = size === 'record' ? (q ? 18 : 16.5) : (q ? 15.5 : 14.5);
  return (
    <span style={{
      fontFamily: 'var(--font-sans)', fontWeight: q ? 600 : 500, fontSize: fs,
      lineHeight: q ? 1.35 : 1.45, letterSpacing: q ? '-0.01em' : 0,
      color: 'var(--color-fg-1)', textWrap: 'pretty',
    }}>{q ? preface.ask : preface.text}</span>
  );
};

const D2Held = ({ preface }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-3)' }}>
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" style={{ stroke: 'var(--color-fg-3)', strokeWidth: 1.7, fill: 'none', strokeLinecap: 'round' }}>
      <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3" />
    </svg>
    {preface.by === 'You' ? 'You kept your line back until they have read it' : preface.by + ' kept a line back until you have read it'}
  </span>
);

const d2Name = (n) => (window.d2Who ? window.d2Who(n) : n);

// Who pointed at a line — presence, never a number.
const D2Pointed = ({ names, cfg }) => {
  if (!names || !names.length) return null;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
      <span style={{ display: 'inline-flex' }}>
        {names.slice(0, 5).map((n, i) => (
          <span key={n} title={n} style={{ marginLeft: i === 0 ? 0 : -6, borderRadius: '50%', boxShadow: '0 0 0 2px var(--color-surface)', display: 'inline-flex' }}>
            <D2Avatar name={d2Name(n)} size={18} accent={n === 'You'} />
          </span>
        ))}
      </span>
      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12, color: 'var(--color-fg-3)' }}>{cfg && cfg.echo === 'echo' ? 'echoed' : 'said the same'}</span>
    </span>
  );
};

// The pointing control — one tap, the participation floor.
const D2PointBtn = ({ word, on, onClick }) => (
  <button type="button" onClick={onClick} aria-pressed={on} className="d2-point" style={{
    display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent',
    border: '1px solid ' + (on ? 'var(--color-accent)' : 'var(--color-border-1)'),
    color: on ? 'var(--color-accent)' : 'var(--color-fg-2)',
    borderRadius: 'var(--radius-md)', padding: '5px 10px', minHeight: 32, cursor: 'pointer',
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5,
  }}>
    {on && <D2Icon name="check" size={12} strokeWidth={2.6} />}
    {word}
  </button>
);

// One attributed line. Attribution in the margin at the reading widths that can
// afford it — never a chat bubble, never a per-line time.
const D2Line = ({ by, cfg, children, dim, sub, foot }) => (
  <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', opacity: dim ? 0.55 : 1 }}>
    <span style={{ paddingTop: 1, flexShrink: 0 }}><D2Avatar name={d2Name(by)} size={sub ? 20 : 24} accent={by === 'You'} /></span>
    <span style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
      <span>
        {cfg.names !== 'muted' && <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--color-fg-1)', marginRight: 6 }}>{by}</span>}
        {children}
      </span>
      {foot}
    </span>
  </div>
);

// ---- The composer ----------------------------------------------------------
// One control. The prompt is a placeholder by default (nothing of the app's
// survives into the record), a tappable prefill in the middle setting, and the
// v1 stem grammar only in its third.
const d2Input = {
  width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-sans)', fontWeight: 400,
  fontSize: 16, lineHeight: 1.45, color: 'var(--color-fg-1)', background: 'var(--color-surface)',
  border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-md)', padding: '11px 13px',
  resize: 'none', outlineOffset: 0,
};

const D2Composer = ({ cfg, bank = 'respond', onSend, onSkip, sendLabel, skipLabel, autoFocus, question, questionHint, to, hint, rows = 2, seal, onSeal, initial, disabled }) => {
  const [text, setText] = d2S(initial || '');
  const [stem, setStem] = d2S(cfg.prompt === 'grammar' ? window.D2_STEMS[bank][0] : null);
  const prompts = window.D2_PROMPTS[bank];
  const stems = window.D2_STEMS[bank];
  const [ph] = d2S(() => prompts[Math.floor(Math.random() * prompts.length)]);
  const limit = cfg.limit || 140;
  const ref = d2R(null);
  d2E(() => { if (autoFocus && ref.current) ref.current.focus({ preventScroll: true }); }, []);
  const asked = /\?\s*$/.test(text.trim());
  const ready = !disabled && text.trim().length > 1 && (!question || asked);
  const send = () => onSend({ text: text.trim(), stem: stem ? [stem, text.trim()] : null, to: to || null });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {to && <div className="d2-eyebrow">to {to}</div>}
      {cfg.prompt === 'grammar' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {stems.map((s) => (
            <button key={s} type="button" onClick={() => setStem(s)} className="d2-chip" aria-pressed={stem === s} style={{
              background: stem === s ? 'var(--color-accent)' : 'var(--color-surface)', color: stem === s ? '#fff' : 'var(--color-fg-1)',
              border: '1px solid ' + (stem === s ? 'var(--color-accent)' : 'var(--color-border-1)'),
              borderRadius: 'var(--radius-md)', padding: '7px 11px', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, minHeight: 36,
            }}>{s + '\u2026'}</button>
          ))}
        </div>
      )}
      {cfg.prompt === 'prefill' && !text && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {stems.map((s) => (
            <button key={s} type="button" onClick={() => { setText(s + ' '); if (ref.current) ref.current.focus({ preventScroll: true }); }} className="d2-chip" style={{
              background: 'var(--color-surface)', color: 'var(--color-fg-2)', border: '1px dashed var(--color-border-1)',
              borderRadius: 'var(--radius-md)', padding: '7px 11px', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, minHeight: 36,
            }}>{s + '\u2026'}</button>
          ))}
        </div>
      )}
      {cfg.prompt === 'grammar' && stem && (
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--color-fg-1)' }}>{stem + '\u2026'}</div>
      )}
      <div style={{ position: 'relative' }}>
        <textarea ref={ref} rows={rows} maxLength={limit} value={text} onChange={(e) => setText(e.target.value)}
          placeholder={question ? 'Ask the circle one thing' : cfg.prompt === 'placeholder' ? ph : cfg.prompt === 'grammar' ? 'finish the sentence' : 'Your line'}
          style={{ ...d2Input, paddingRight: 46 }} />
        {text.length > 0 && <span style={{ position: 'absolute', right: 12, bottom: 11, fontFamily: 'var(--font-mono)', fontSize: 11, color: text.length > limit * 0.9 ? 'var(--color-fg-1)' : 'var(--color-fg-3)' }}>{limit - text.length}</span>}
      </div>
      {(hint || (question && text.trim() && !asked)) && (
        <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, lineHeight: 1.45, color: 'var(--color-fg-3)' }}>
          {question && text.trim() && !asked ? (questionHint || 'A question ends with a question mark.') : hint}
        </div>
      )}
      {onSeal && (
        <button type="button" onClick={() => onSeal(!seal)} aria-pressed={seal} className="d2-seal" style={{
          display: 'flex', alignItems: 'center', gap: 9, background: 'transparent', border: 0, padding: '6px 0',
          cursor: 'pointer', textAlign: 'left', minHeight: 40,
        }}>
          <span style={{ width: 18, height: 18, flexShrink: 0, borderRadius: 4, border: '1.5px solid ' + (seal ? 'var(--color-accent)' : 'var(--color-border-1)'), background: seal ? 'var(--color-accent)' : 'transparent', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            {seal && <D2Icon name="check" size={12} strokeWidth={2.6} />}
          </span>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-2)' }}>Keep this until they have read it</span>
        </button>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
        {onSkip && (
          <button type="button" onClick={onSkip} style={{ background: 'transparent', border: 0, cursor: 'pointer', minHeight: 44, padding: '8px 12px', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14, color: 'var(--color-fg-3)', borderRadius: 'var(--radius-md)' }}>{skipLabel || 'Nothing to add'}</button>
        )}
        <button type="button" onClick={ready ? send : undefined} disabled={!ready} className="circ-btn circ-btn-primary" style={{
          background: 'var(--color-accent)', color: '#fff', border: 0, borderRadius: 'var(--radius-md)',
          padding: '11px 18px', minHeight: 44, cursor: ready ? 'pointer' : 'default', opacity: ready ? 1 : 0.45,
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14,
        }}>{sendLabel || 'Leave it'}</button>
      </div>
    </div>
  );
};

Object.assign(window, {
  D2_GLYPHS, D2Disc, D2Huddle, D2Sheet, D2Preface, D2Held, D2Pointed, D2PointBtn,
  D2Line, D2Composer, d2Input, d2IsSkip,
});
