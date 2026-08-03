// ============================================================================
// Discourse v4 — shared parts.
// The bottom sheet, a static Swell disc + roster + huddle (the shipped geometry,
// copied from app/swell-reactions.jsx because the module keeps its disc
// internal — keep the numbers in step, never "improve" them), the Same
// primitive, and the one composer that covers every response shape.
// ============================================================================

const { Icon: P4Icon, Avatar: P4Avatar, MicroDot: P4Dot } = window;
const { PGD4_REPLY_STEMS, PGD4_PROMPTS } = window;
const { useState: p4S, useEffect: p4E, useRef: p4R } = React;

const PGD4_GLYPHS = ['\u2764\uFE0F', '\uD83D\uDD25', '\uD83D\uDC4D', '\uD83D\uDCA1', '\uD83D\uDE02'];
const p4Angle = (i) => (-90 + i * 72) * Math.PI / 180;
const p4Hash = (s) => { let h = 2166136261; s = String(s || ''); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const p4Iv = (r) => (r && r.intensity != null ? r.intensity : 0.42);
const p4IsSkip = (r) => !r || !r.glyph;
const p4Label = (r) => (r && r.former ? 'Former member' : (r && r.name));
const p4Pos = (r) => {
  const idx = r && r.glyph ? PGD4_GLYPHS.indexOf(r.glyph) : -1;
  const jr = ((p4Hash((r && r.name) + '~r') % 1000) / 1000 - 0.5) * 0.07;
  const ja = ((p4Hash(r && r.name) % 1000) / 1000 - 0.5) * 0.32;
  let rr = idx >= 0 ? 0.13 + p4Iv(r) * 0.20 : 0.05;
  if (idx >= 0) rr = Math.max(0.1, Math.min(0.34, rr + jr));
  const a = (idx >= 0 ? p4Angle(idx) : -Math.PI / 2) + ja;
  return { x: 0.5 + Math.cos(a) * rr, y: 0.5 + Math.sin(a) * rr };
};
const p4Layout = (list) => {
  const pts = list.map(p4Pos);
  const half = (r) => 0.05 + p4Iv(r) * 0.045;
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

const Pg4Disc = ({ reactions, size = 200, points }) => {
  const list = (reactions || []).filter((r) => !p4IsSkip(r));
  const pts = p4Layout(list);
  const k = size / 216;
  if (points) points(list, pts);
  return (
    <div style={{
      position: 'relative', width: size, height: size, flexShrink: 0, borderRadius: '50%',
      background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-1)',
      backgroundImage: 'radial-gradient(circle, var(--color-border-2) 1px, transparent 1px)',
      backgroundSize: (size / 5) + 'px ' + (size / 5) + 'px', backgroundPosition: 'center',
    }}>
      <span style={{ position: 'absolute', left: '50%', top: '50%', width: 5, height: 5, borderRadius: '50%', background: 'var(--color-border-1)', transform: 'translate(-50%,-50%)' }} />
      {list.map((r, i) => {
        const me = r.name === 'You', fs = ((me ? 20 : 18) + p4Iv(r) * 20) * k;
        return (
          <span key={i} title={p4Label(r)} style={{ position: 'absolute', left: (pts[i].x * 100) + '%', top: (pts[i].y * 100) + '%', transform: 'translate(-50%,-50%)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            {me && <span style={{ position: 'absolute', width: fs * 1.7, height: fs * 1.7, borderRadius: '50%', background: 'rgba(4,120,87,0.14)' }} />}
            <span style={{ position: 'relative', fontSize: fs, lineHeight: 1 }}>{r.glyph}</span>
          </span>
        );
      })}
    </div>
  );
};

const Pg4Roster = ({ reactions }) => {
  const list = reactions || [];
  if (!list.length) return null;
  const row = (me) => ({ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 10px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', color: me ? 'var(--color-accent)' : 'var(--color-fg-1)' });
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
      {list.filter((r) => !p4IsSkip(r)).map((r, i) => (
        <span key={'r' + i} style={row(r.name === 'You')}><span style={{ fontSize: 16, lineHeight: 1 }}>{r.glyph}</span>{p4Label(r)}</span>
      ))}
      {list.filter(p4IsSkip).map((r, i) => (
        <span key={'s' + i} style={row(r.name === 'You')}>
          <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" style={{ stroke: r.name === 'You' ? 'var(--color-accent)' : 'var(--color-fg-3)', strokeWidth: 1.6, fill: 'none' }}><circle cx="12" cy="12" r="8" /></svg>
          {p4Label(r)}
        </span>
      ))}
    </div>
  );
};

const Pg4Huddle = ({ reactions, size = 16 }) => {
  const seen = [];
  for (const r of reactions || []) { if (r.glyph && !seen.includes(r.glyph)) seen.push(r.glyph); if (seen.length === 3) break; }
  if (!seen.length) return null;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      {seen.map((g, i) => <span key={i} style={{ fontSize: size, lineHeight: 1, width: size + 1, height: size + 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: i === 0 ? 0 : -4 }}>{g}</span>)}
    </span>
  );
};

// ---- Bottom sheet — the AddReveal choreography verbatim --------------------
const Pg4Sheet = ({ eyebrow, title, onClose, children, wide }) => {
  const [shown, setShown] = p4S(false);
  const closing = p4R(false);
  p4E(() => { let r2; const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setShown(true)); }); return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); }; }, []);
  const req = () => { if (closing.current) return; closing.current = true; setShown(false); setTimeout(onClose, 220); };
  p4E(() => { const k = (e) => { if (e.key === 'Escape') req(); }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, []);
  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) req(); }} style={{
      position: 'fixed', inset: 0, zIndex: 140, background: 'var(--color-scrim)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      opacity: shown ? 1 : 0, transition: 'opacity var(--duration-slow) ease-in-out',
    }}>
      <div role="dialog" aria-modal="true" aria-label={title || eyebrow || 'Sheet'} style={{
        position: 'relative', width: '100%', maxWidth: wide ? 580 : 520, background: 'var(--color-surface)',
        borderTopLeftRadius: 16, borderTopRightRadius: 16, boxShadow: 'var(--shadow-overlay)',
        padding: 'var(--space-5) var(--space-5) calc(var(--space-4) + env(safe-area-inset-bottom, 0px))',
        maxHeight: 'calc(100% - 20px)', overflowY: 'auto', overscrollBehavior: 'contain',
        transform: shown ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform var(--duration-slow) var(--ease-quiet)',
      }}>
        <button type="button" onClick={req} aria-label="Close" style={{
          position: 'absolute', top: 10, right: 10, width: 36, height: 36, zIndex: 2,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent', border: 0, borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--color-fg-3)',
        }}><P4Icon name="x" size={18} /></button>
        {eyebrow && <div className="d4-eyebrow" style={{ marginBottom: 4 }}>{eyebrow}</div>}
        {title && <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-xl)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: '0 0 12px', paddingRight: 32 }}>{title}</h2>}
        {children}
      </div>
    </div>
  );
};

// ---- Same / Echo — the pointing primitive ---------------------------------
// A glyph reacts to the link. A same reacts to a PERSON'S SENTENCE — that is
// the whole difference, and it is why it reads as being answered. Rendered as
// presence (faces tucked under the line), never as a count.
const p4First = (n) => (n === 'You' ? 'You' : String(n).split(' ')[0]);
const p4Verb = (cfg) => (cfg.word === 'echo' ? 'echoed it' : 'said the same');
const p4List = (names) => (names.length === 1 ? p4First(names[0])
  : names.length === 2 ? p4First(names[0]) + ' and ' + p4First(names[1])
  : names.slice(0, -1).map(p4First).join(', ') + ' and ' + p4First(names[names.length - 1]));

const Pg4Same = ({ names, cfg, word }) => {
  if (!names || !names.length) return null;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
      <span style={{ display: 'inline-flex' }}>
        {names.slice(0, 4).map((n, i) => (
          <span key={n} style={{ marginLeft: i === 0 ? 0 : -6, borderRadius: '50%', boxShadow: '0 0 0 1.5px var(--color-surface)', display: 'inline-flex' }}>
            <P4Avatar name={n} size={18} accent={n === 'You'} />
          </span>
        ))}
      </span>
      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12.5, color: 'var(--color-fg-3)' }}>
        {p4List(names)} {p4Verb(cfg)}{word ? ' \u2014 \u201C' + word + '\u201D' : ''}
      </span>
    </span>
  );
};

const Pg4SameBtn = ({ on, cfg, onClick, label }) => (
  <button type="button" onClick={onClick} aria-pressed={on} className="d4-point" style={{
    display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
    background: on ? 'color-mix(in oklab, var(--color-accent) 8%, var(--color-surface))' : 'transparent',
    border: '1px solid ' + (on ? 'var(--color-accent)' : 'var(--color-border-1)'),
    color: on ? 'var(--color-accent)' : 'var(--color-fg-2)',
    borderRadius: 'var(--radius-md)', padding: '6px 11px', minHeight: 36,
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5,
  }}>
    <svg viewBox="0 0 24 24" width={13} height={13} aria-hidden="true" style={{ stroke: 'currentColor', strokeWidth: 2, fill: 'none', strokeLinecap: 'round' }}>
      <path d="M5 12h14" /><path d="M5 17h9" />
    </svg>
    {label || (cfg.word === 'echo' ? 'Echo' : 'Same')}
  </button>
);

const Pg4MicroDot = () => (
  <span aria-hidden="true" style={{ display: 'inline-flex' }}><P4Dot size={9} /></span>
);

// ---- The composer ----------------------------------------------------------
// One control, five shapes. Brevity is structural first and counted second.
//   note / answer  a short line
//   stem           the app's words stay in the record (07)
//   prompt         the app's words vanish the moment you type (06)
//   point          no writing at all (05)
const pg4Input = {
  width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-sans)', fontWeight: 400,
  fontSize: 16, lineHeight: 1.45, color: 'var(--color-fg-1)', background: 'var(--color-surface)',
  border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-md)', padding: '11px 13px',
  resize: 'none', outlineOffset: 0,
};

const Pg4Composer = ({ cfg, glyph, bank = 'respond', shape, rows = 2, initial = '', question, hint,
  onSend, onSkip, sendLabel, skipLabel, autoFocus, pointed, onPoint }) => {
  const kind = shape || cfg.respond;
  const stems = PGD4_REPLY_STEMS[glyph] || PGD4_REPLY_STEMS.none;
  const [stem, setStem] = p4S(stems[0]);
  const [text, setText] = p4S(initial);
  const limit = kind === 'point' ? 24 : (cfg.limit || 140);
  const ref = p4R(null);
  const prompts = PGD4_PROMPTS[bank] || PGD4_PROMPTS.respond;
  const prompt = p4R(prompts[Math.floor(Math.random() * prompts.length)]).current;
  p4E(() => { if (autoFocus && ref.current) ref.current.focus({ preventScroll: true }); }, []);
  const bad = question && text.trim().length > 0 && !/\?\s*$/.test(text.trim());
  const ready = kind === 'point' ? !!pointed : (text.trim().length > 0 && !bad);
  const send = () => onSend({ by: 'You', text: text.trim(), word: text.trim().split(/\s+/).slice(0, 2).join(' '), stem: [stem, text.trim()], r: 1, same: [] });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {kind === 'stem' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {stems.map((s) => (
            <button key={s} type="button" onClick={() => setStem(s)} className="d4-chip" aria-pressed={stem === s} style={{
              background: stem === s ? 'var(--color-accent)' : 'var(--color-surface)', color: stem === s ? '#fff' : 'var(--color-fg-1)',
              border: '1px solid ' + (stem === s ? 'var(--color-accent)' : 'var(--color-border-1)'),
              borderRadius: 'var(--radius-md)', padding: '7px 11px', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, minHeight: 36,
            }}>{s + '\u2026'}</button>
          ))}
        </div>
      )}
      {kind === 'point' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Pg4SameBtn on={pointed} cfg={cfg} onClick={onPoint} />
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--color-fg-3)' }}>and one word, if you have one</span>
        </div>
      ) : null}
      {kind !== 'point' && kind === 'stem' && (
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--color-fg-1)' }}>{stem + '\u2026'}</div>
      )}
      <div style={{ position: 'relative' }}>
        <textarea ref={ref} rows={kind === 'point' ? 1 : rows} maxLength={limit} value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={kind === 'point' ? 'One word' : kind === 'stem' ? 'finish the sentence'
            : question ? 'Ask the circle something' : kind === 'answer' ? 'Your answer' : prompt}
          style={{ ...pg4Input, paddingRight: 46, height: kind === 'point' ? 46 : undefined }} />
        <span style={{ position: 'absolute', right: 12, bottom: 11, fontFamily: 'var(--font-mono)', fontSize: 11, color: text.length > limit * 0.9 ? 'var(--color-fg-1)' : 'var(--color-fg-3)' }}>{limit - text.length}</span>
      </div>
      {bad && <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, lineHeight: 1.45, color: 'var(--color-fg-3)' }}>{'Turns after your first are questions \u2014 end it with a question mark.'}</div>}
      {hint && !bad && <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, lineHeight: 1.45, color: 'var(--color-fg-3)' }}>{hint}</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
        {onSkip && (
          <button type="button" onClick={onSkip} style={{ background: 'transparent', border: 0, cursor: 'pointer', minHeight: 44, padding: '8px 12px', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14, color: 'var(--color-fg-3)', borderRadius: 'var(--radius-md)' }}>{skipLabel || 'Not this time'}</button>
        )}
        <button type="button" onClick={ready ? send : undefined} disabled={!ready} className="circ-btn circ-btn-primary" style={{
          background: 'var(--color-accent)', color: '#fff', border: 0, borderRadius: 'var(--radius-md)',
          padding: '11px 18px', minHeight: 44, cursor: ready ? 'pointer' : 'default', opacity: ready ? 1 : 0.45,
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14,
        }}>{sendLabel || 'Send'}</button>
      </div>
    </div>
  );
};

Object.assign(window, {
  PGD4_GLYPHS, Pg4Disc, Pg4Roster, Pg4Huddle, Pg4Sheet, Pg4Same, Pg4SameBtn,
  Pg4MicroDot, Pg4Composer, pg4Input, p4First, p4IsSkip, p4Layout, p4List,
});
