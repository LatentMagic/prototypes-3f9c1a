// ============================================================================
// Discourse playground — shared parts.
// The bottom sheet, a static Swell disc + glyph huddle (the shipped geometry,
// copied so discourse content can sit alongside it), the thought and response
// renderers, and the one composer that covers every response shape.
// ============================================================================

const { Icon: PgdIcon, Avatar: PgdAvatar } = window;
const { useState: pgdS, useEffect: pgdE, useRef: pgdR } = React;

// ---- Swell geometry (copied from app/swell-reactions.jsx) ------------------
// Same five glyphs, same radial dial, same distance-and-size depth cue. Copied
// rather than imported because the shipped module keeps its disc internal; the
// numbers below must stay in step with it.
const PGD_GLYPHS = ['\u2764\uFE0F', '\uD83D\uDD25', '\uD83D\uDC4D', '\uD83D\uDCA1', '\uD83D\uDE02'];
const pgdAngle = (i) => (-90 + i * 72) * Math.PI / 180;
const pgdHash = (s) => { let h = 2166136261; s = String(s || ''); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const pgdIv = (r) => (r && r.intensity != null ? r.intensity : 0.42);
const pgdIsSkip = (r) => !r || !r.glyph;
const pgdLabel = (r) => (r && r.former ? 'Former member' : (r && r.name));
const pgdPos = (r) => {
  const idx = r && r.glyph ? PGD_GLYPHS.indexOf(r.glyph) : -1;
  const jr = ((pgdHash((r && r.name) + '~r') % 1000) / 1000 - 0.5) * 0.07;
  const ja = ((pgdHash(r && r.name) % 1000) / 1000 - 0.5) * 0.32;
  let rr = idx >= 0 ? 0.13 + pgdIv(r) * 0.20 : 0.05;
  if (idx >= 0) rr = Math.max(0.1, Math.min(0.34, rr + jr));
  const a = (idx >= 0 ? pgdAngle(idx) : -Math.PI / 2) + ja;
  return { x: 0.5 + Math.cos(a) * rr, y: 0.5 + Math.sin(a) * rr };
};
const pgdLayout = (list) => {
  const pts = list.map(pgdPos);
  const half = (r) => 0.05 + pgdIv(r) * 0.045;
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

// Static review disc — no tap-to-pin; the playground only needs it to read as
// the Swell beside the words.
const PgdDisc = ({ reactions, size = 200 }) => {
  const list = (reactions || []).filter((r) => !pgdIsSkip(r));
  const pts = pgdLayout(list);
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
        const me = r.name === 'You', fs = ((me ? 20 : 18) + pgdIv(r) * 20) * k;
        return (
          <span key={i} title={pgdLabel(r)} style={{ position: 'absolute', left: (pts[i].x * 100) + '%', top: (pts[i].y * 100) + '%', transform: 'translate(-50%,-50%)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            {me && <span style={{ position: 'absolute', width: fs * 1.7, height: fs * 1.7, borderRadius: '50%', background: 'rgba(4,120,87,0.14)' }} />}
            <span style={{ position: 'relative', fontSize: fs, lineHeight: 1 }}>{r.glyph}</span>
          </span>
        );
      })}
    </div>
  );
};

// Roster chips under a disc — same set as the shipped review surface.
const PgdRoster = ({ reactions }) => {
  const list = reactions || [];
  if (!list.length) return null;
  const row = (me) => ({ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 10px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', color: me ? 'var(--color-accent)' : 'var(--color-fg-1)' });
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
      {list.filter((r) => !pgdIsSkip(r)).map((r, i) => (
        <span key={'r' + i} style={row(r.name === 'You')}><span style={{ fontSize: 16, lineHeight: 1 }}>{r.glyph}</span>{pgdLabel(r)}</span>
      ))}
      {list.filter(pgdIsSkip).map((r, i) => (
        <span key={'s' + i} style={row(r.name === 'You')}>
          <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" style={{ stroke: r.name === 'You' ? 'var(--color-accent)' : 'var(--color-fg-3)', strokeWidth: 1.6, fill: 'none' }}><circle cx="12" cy="12" r="8" /></svg>
          {pgdLabel(r)}
        </span>
      ))}
    </div>
  );
};

// Up to three distinct glyphs — the door's own huddle.
const PgdGlyphHuddle = ({ reactions, size = 16 }) => {
  const seen = [];
  for (const r of reactions || []) { if (r.glyph && !seen.includes(r.glyph)) seen.push(r.glyph); if (seen.length === 3) break; }
  if (!seen.length) return null;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      {seen.map((g, i) => <span key={i} style={{ fontSize: size, lineHeight: 1, width: size + 1, height: size + 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: i === 0 ? 0 : -4 }}>{g}</span>)}
    </span>
  );
};

// ---- Bottom sheet ----------------------------------------------------------
// The AddReveal choreography verbatim: mount at translateY(100%), double-rAF,
// transition up; close slides down then unmounts.
const PgdSheet = ({ eyebrow, title, onClose, children, wide }) => {
  const [shown, setShown] = pgdS(false);
  const closing = pgdR(false);
  pgdE(() => { let r2; const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setShown(true)); }); return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); }; }, []);
  const req = () => { if (closing.current) return; closing.current = true; setShown(false); setTimeout(onClose, 220); };
  pgdE(() => { const k = (e) => { if (e.key === 'Escape') req(); }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, []);
  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) req(); }} style={{
      position: 'fixed', inset: 0, zIndex: 140, background: 'var(--color-scrim)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      opacity: shown ? 1 : 0, transition: 'opacity var(--duration-slow) ease-in-out',
    }}>
      <div role="dialog" aria-modal="true" aria-label={title || eyebrow || 'Sheet'} style={{
        position: 'relative', width: '100%', maxWidth: wide ? 560 : 520, background: 'var(--color-surface)',
        borderTopLeftRadius: 16, borderTopRightRadius: 16, boxShadow: 'var(--shadow-overlay)',
        padding: 'var(--space-5) var(--space-5) calc(var(--space-4) + env(safe-area-inset-bottom, 0px))',
        maxHeight: 'calc(100% - 20px)', overflowY: 'auto', overscrollBehavior: 'contain',
        transform: shown ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform var(--duration-slow) var(--ease-quiet)',
      }}>
        <button type="button" onClick={req} aria-label="Close" className="circ-rx-close" style={{
          position: 'absolute', top: 10, right: 10, width: 36, height: 36, zIndex: 2,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent', border: 0, borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--color-fg-3)',
        }}><PgdIcon name="x" size={18} /></button>
        {eyebrow && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', color: 'var(--color-fg-3)', marginBottom: 4 }}>{eyebrow}</div>}
        {title && <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-xl)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: '0 0 12px', paddingRight: 32 }}>{title}</h2>}
        {children}
      </div>
    </div>
  );
};

// ---- Thought + response renderers ------------------------------------------
// One visual language for an attached line, in three registers:
//   plain     a note   — "Marcus T. — Gist: why measuring…"
//   stem      a completed sentence — the stem in medium, the completion in regular
//   question  the sharer's question, set a size up
const pgdWho = (by) => (by === 'You' ? 'You' : by);

const PgdAttrib = ({ by, cfg, size = 22 }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
    <PgdAvatar name={by} size={size} accent={by === 'You'} />
    {cfg.attrib !== 'muted' && <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--color-fg-1)' }}>{pgdWho(by)}</span>}
  </span>
);

const PgdThoughtBody = ({ thought, opt, cfg, big }) => {
  if (opt.id === 'stems' && thought.stem) {
    return (
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: big ? 16 : 14.5, lineHeight: 1.5, color: 'var(--color-fg-1)', textWrap: 'pretty' }}>
        <span style={{ fontWeight: 600 }}>{thought.stem[0]} </span>
        <span style={{ fontWeight: 400, color: 'var(--color-fg-2)' }}>{thought.stem[1]}.</span>
      </span>
    );
  }
  if (opt.id === 'ask' && thought.ask) {
    return <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: big ? 17 : 15, lineHeight: 1.4, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{thought.ask}</span>;
  }
  return <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: big ? 15.5 : 14.5, lineHeight: 1.5, color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{thought.text}</span>;
};

const PgdResponseBody = ({ r, opt, cfg, big }) => {
  const shape = cfg.respond;
  if (shape === 'echo') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--color-fg-3)' }}>echoed</span>
        {r.word && <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--color-fg-1)' }}>{'\u201C' + r.word + '\u201D'}</span>}
      </span>
    );
  }
  if (shape === 'word') return <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--color-fg-1)' }}>{'\u201C' + (r.word || r.text.split(' ').slice(0, 2).join(' ')) + '\u201D'}</span>;
  if (shape === 'stem' && r.stem) {
    return (
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: big ? 15 : 14, lineHeight: 1.5, color: 'var(--color-fg-1)', textWrap: 'pretty' }}>
        <span style={{ fontWeight: 600 }}>{r.stem[0]} </span>
        <span style={{ fontWeight: 400, color: 'var(--color-fg-2)' }}>{r.stem[1]}.</span>
      </span>
    );
  }
  return <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: big ? 15 : 14, lineHeight: 1.5, color: 'var(--color-fg-2)', textWrap: 'pretty' }}>{r.text}</span>;
};

// A single attributed line — used for both halves of the exchange everywhere.
const PgdLine = ({ by, cfg, children, indent, dim }) => (
  <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', paddingLeft: indent || 0, opacity: dim ? 0.55 : 1 }}>
    <span style={{ paddingTop: 1 }}><PgdAvatar name={by} size={22} accent={by === 'You'} /></span>
    <span style={{ minWidth: 0, flex: 1 }}>
      {cfg.attrib !== 'muted' && <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--color-fg-1)', marginRight: 6 }}>{pgdWho(by)}</span>}
      {children}
    </span>
  </div>
);

// ---- The composer ----------------------------------------------------------
// One control, four shapes. Brevity is enforced by the shape first and the
// counter second: `word` and `echo` have no room for a sentence at all.
const pgdInputStyle = {
  width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-sans)', fontWeight: 400,
  fontSize: 16, lineHeight: 1.45, color: 'var(--color-fg-1)', background: 'var(--color-surface)',
  border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-md)', padding: '11px 13px',
  resize: 'none', outlineOffset: 0,
};

const PgdComposer = ({ cfg, opt, glyph, thought, onSend, onSkip, sendLabel, skipLabel, autoFocus }) => {
  const shape = cfg.respond === 'answer' ? 'note' : cfg.respond;
  const stems = (window.PGD_REPLY_STEMS[glyph] || window.PGD_REPLY_STEMS.none);
  const [stem, setStem] = pgdS(shape === 'stem' ? stems[0] : null);
  const [text, setText] = pgdS('');
  const [echoed, setEchoed] = pgdS(false);
  const limit = shape === 'echo' || shape === 'word' ? Math.min(cfg.limit || 24, 24) : (cfg.limit || 140);
  const ref = pgdR(null);
  pgdE(() => { if (autoFocus && ref.current && shape !== 'echo') ref.current.focus({ preventScroll: true }); }, []);
  const ready = shape === 'echo' ? echoed : text.trim().length > 0;
  const send = () => onSend({ by: 'You', text: text.trim(), word: text.trim(), stem: stem ? [stem, text.trim()] : null, echo: echoed });

  const counter = (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: text.length > limit * 0.9 ? 'var(--color-fg-1)' : 'var(--color-fg-3)' }}>{limit - text.length}</span>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {shape === 'stem' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {stems.map((s) => (
            <button key={s} type="button" onClick={() => setStem(s)} className="pgd-chip" aria-pressed={stem === s} style={{
              background: stem === s ? 'var(--color-accent)' : 'var(--color-surface)', color: stem === s ? '#fff' : 'var(--color-fg-1)',
              border: '1px solid ' + (stem === s ? 'var(--color-accent)' : 'var(--color-border-1)'),
              borderRadius: 'var(--radius-md)', padding: '7px 11px', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, minHeight: 36,
            }}>{s + '\u2026'}</button>
          ))}
        </div>
      )}
      {shape === 'echo' && (
        <button type="button" onClick={() => setEchoed(!echoed)} aria-pressed={echoed} style={{
          display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', cursor: 'pointer',
          background: echoed ? 'color-mix(in oklab, var(--color-accent) 8%, var(--color-surface))' : 'var(--color-surface)',
          border: '1px solid ' + (echoed ? 'var(--color-accent)' : 'var(--color-border-1)'),
          borderRadius: 'var(--radius-md)', padding: '12px 14px', minHeight: 48,
        }}>
          <span style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid ' + (echoed ? 'var(--color-accent)' : 'var(--color-border-1)'), background: echoed ? 'var(--color-accent)' : 'transparent', color: '#fff' }}>
            {echoed && <PgdIcon name="check" size={13} strokeWidth={2.4} />}
          </span>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--color-fg-1)' }}>
            {thought ? 'Echo this \u2014 it landed the same way' : 'Echo the share'}
          </span>
        </button>
      )}
      {shape !== 'echo' || echoed ? (
        <div style={{ position: 'relative' }}>
          {shape === 'stem' && (
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--color-fg-1)', marginBottom: 6 }}>{stem + '\u2026'}</div>
          )}
          <textarea ref={ref} rows={shape === 'echo' || shape === 'word' ? 1 : 2} maxLength={limit} value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={shape === 'echo' ? 'One word, if you have one' : shape === 'word' ? 'One word' : shape === 'stem' ? 'finish the sentence' : cfg.respond === 'answer' ? 'Your answer' : 'A note back'}
            style={{ ...pgdInputStyle, paddingRight: 44, height: shape === 'echo' || shape === 'word' ? 46 : 'auto' }} />
          <span style={{ position: 'absolute', right: 12, bottom: 11 }}>{counter}</span>
        </div>
      ) : null}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
        {onSkip && (
          <button type="button" onClick={onSkip} className="circ-swell-skip" style={{ background: 'transparent', border: 0, cursor: 'pointer', minHeight: 44, padding: '8px 12px', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14, color: 'var(--color-fg-3)', borderRadius: 'var(--radius-md)' }}>{skipLabel || 'Not this time'}</button>
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

// A quoted block for the thought being responded to.
const PgdQuote = ({ thought, opt, cfg }) => (
  <div style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
    <PgdLine by={thought.by} cfg={{ ...cfg, attrib: 'named' }}><PgdThoughtBody thought={thought} opt={opt} cfg={cfg} /></PgdLine>
  </div>
);

Object.assign(window, {
  PGD_GLYPHS, PgdDisc, PgdRoster, PgdGlyphHuddle, PgdSheet, PgdLine, PgdThoughtBody,
  PgdResponseBody, PgdComposer, PgdQuote, PgdAttrib, pgdWho, pgdInputStyle, pgdIsSkip,
});
