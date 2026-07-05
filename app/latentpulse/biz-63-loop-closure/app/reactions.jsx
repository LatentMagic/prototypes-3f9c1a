// ============================================================================
// LatentPulse — Loop closure. Reaction-reveal at mark-as-read.
// NINE switchable variants across two rounds of exploration (prototype chrome):
//   Round 1 (signal resolution) — 1 Map · 2 Nine Glyphs · 3 Lexicon · 4 Pulse · 5 Gathering
//   Round 2 (tactile two-move)  — 6 Stick · 7 Trace · 8 Dial · 9 Plain Pair
//
// Shared skeleton (all variants): Active cards carry ZERO trace of others'
// reactions; flow = mark-as-read confirm (unchanged) → input (skippable) →
// ephemeral self-fading reveal → card to Read tab (the permanent quiet record).
// Skip still reveals. First-reader → one graceful line. No counts anywhere.
//
// Round-2 SIGNAL CORE — up to two moves: "it landed" (coarse felt intensity)
// + one optional payload from ONE universal set. Dissent ("Pushed back")
// renders identically to every other payload. The global `names` toggle
// (prototype chrome) governs the round-2 variants: on → member attributed,
// off → "someone". Round-1 variants keep their original attribution.
// ============================================================================
const { useState: rxState, useEffect: rxEffect, useRef: rxRef, useMemo: rxMemo } = React;

const RX_VARIANTS = [
  // Round 1 — signal-resolution explorations.
  { n: 1, key: 'map',       name: 'The Map',       sub: 'Two-axis grid' },
  { n: 2, key: 'glyphs',    name: 'Nine Glyphs',   sub: 'Emoji palette' },
  { n: 3, key: 'lexicon',   name: 'The Lexicon',   sub: 'Word reactions' },
  { n: 4, key: 'pulse',     name: 'The Pulse',     sub: 'Wordless intensity' },
  { n: 5, key: 'gathering', name: 'The Gathering', sub: 'Replay' },
  // Round 2 — tactile two-move treatments.
  { n: 6, key: 'stick', name: 'The Stick',      sub: 'Analogue drag' },
  { n: 7, key: 'trace', name: 'The Trace',      sub: 'Marginalia stroke' },
  { n: 8, key: 'dial',  name: 'The Dial',       sub: 'Watch-crown' },
  { n: 9, key: 'plain', name: 'The Plain Pair', sub: 'Control' },
];
const RX_ROUND2 = ['stick', 'trace', 'dial', 'plain'];

// ---- round-1 vocabularies ----
const RX_GLYPHS = ['\uD83D\uDCA1', '\uD83E\uDD2F', '\uD83D\uDD25', '\u2764\uFE0F', '\uD83D\uDE02', '\uD83E\uDD14', '\uD83E\uDDD8', '\u26A1', '\uD83C\uDF31'];
const RX_PHRASES = [
  'Changed my mind', 'Needed this', 'Still thinking about it',
  'Made me smile', 'Over my head', 'Knew it',
  'Hit home', 'Read it twice', 'Passed it on',
];
const firstName = (n) => (n === 'You' ? 'You' : String(n).replace(/\s+[A-Z]\.$/, ''));
const RX_FRAGMENT = {
  'Changed my mind':        (n) => `It changed ${firstName(n)}\u2019s mind.`,
  'Needed this':            (n) => `${firstName(n)} needed this.`,
  'Still thinking about it':(n) => `${firstName(n)} is still thinking about it.`,
  'Made me smile':          (n) => `It made ${firstName(n)} smile.`,
  'Over my head':           (n) => `It went over ${firstName(n)}\u2019s head.`,
  'Knew it':                (n) => `${firstName(n)} knew it.`,
  'Hit home':               (n) => `It hit home for ${firstName(n)}.`,
  'Read it twice':          (n) => `${firstName(n)} read it twice.`,
  'Passed it on':           (n) => `${firstName(n)} passed it on.`,
};

// ---- round-2 universal payload set (same for every user and circle) ----
const RX_PAYLOADS = ['Confirmed it', 'Changed my mind', 'Pushed back', 'Moved me', 'Going to use this'];

// ---- shared ----
const FIRST_LINE = 'You\u2019re the first one here.';
const rxOthers = (item) => ((item && item.reactions) || []).filter(r => r.name !== 'You');
const rxMine = (item) => ((item && item.reactions) || []).find(r => r.name === 'You') || null;
// round-2 attribution rendering — the ONLY thing the names toggle changes.
const who = (name, names) => (name === 'You' ? 'You' : (names ? name : 'someone'));
const iv = (r) => (r && r.intensity != null ? r.intensity : 0.42);
const landedWord = (i) => (i <= 0.12 ? 'didn\u2019t land' : i >= 0.7 ? 'really landed' : 'it landed');

// The Pulse carries no vocabulary → a felt qualitative reading, no counts.
const pulseBand = (w) => w < 0.42 ? { key: 'soft', line: 'It landed gently.' }
  : w < 0.72 ? { key: 'mid', line: 'It landed with the circle.' }
  : { key: 'hard', line: 'It landed hard.' };
const pulseWarmth = (list) => list.length ? list.reduce((a, r) => a + (r.intensity || 0.4), 0) / list.length : 0;

// ---------------------------------------------------------------------------
// ROUND 1 — The Map field (two-axis constellation).
// ---------------------------------------------------------------------------
const MapField = ({ mine, others, placeable, onPlace, revealOthers, small }) => {
  const [named, setNamed] = rxState(null);
  const box = small ? 56 : 232;
  const dot = (r, i, isMine, shown) => {
    const d = small ? 6 : 12;
    return (
      <button key={(isMine ? 'me' : 'o') + i} type="button"
        onClick={(e) => { if (small) return; e.stopPropagation(); setNamed(named === (isMine ? 'me' : i) ? null : (isMine ? 'me' : i)); }}
        aria-label={isMine ? 'Your reaction' : (r.name + ' reacted')}
        style={{
          position: 'absolute', left: (r.x * 100) + '%', top: (r.y * 100) + '%',
          width: d, height: d, borderRadius: '50%', transform: 'translate(-50%,-50%)',
          background: isMine ? 'var(--color-accent)' : 'var(--color-fg-1)',
          opacity: isMine ? 1 : (shown ? 0.5 : 0),
          border: isMine ? '2px solid var(--color-surface)' : 'none',
          padding: 0, cursor: small ? 'default' : 'pointer',
          transition: 'opacity var(--duration-slow) var(--ease-quiet)',
          transitionDelay: (!isMine && !small ? (i * 300 + 260) : 0) + 'ms',
          boxShadow: isMine && !small ? '0 0 0 6px rgba(4,120,87,0.14)' : 'none',
        }} />
    );
  };
  return (
    <div>
      <div
        onClick={placeable ? (e) => {
          const b = e.currentTarget.getBoundingClientRect();
          onPlace({ x: Math.min(1, Math.max(0, (e.clientX - b.left) / b.width)), y: Math.min(1, Math.max(0, (e.clientY - b.top) / b.height)) });
        } : undefined}
        style={{
          position: 'relative', width: box, height: box, flexShrink: 0,
          background: 'var(--color-surface-sunken)',
          border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-md)',
          cursor: placeable ? 'crosshair' : 'default',
          backgroundImage: 'linear-gradient(var(--color-border-2) 1px, transparent 1px), linear-gradient(90deg, var(--color-border-2) 1px, transparent 1px)',
          backgroundSize: (box / 3) + 'px ' + (box / 3) + 'px',
          backgroundPosition: 'center',
        }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'var(--color-border-1)', transform: 'translateX(-0.5px)' }} />
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--color-border-1)', transform: 'translateY(-0.5px)' }} />
        {revealOthers && others.map((r, i) => dot(r, i, false, revealOthers))}
        {mine && dot(mine, 0, true, true)}
        {named != null && !small && (() => {
          const r = named === 'me' ? mine : others[named];
          if (!r) return null;
          return (
            <span style={{
              position: 'absolute', left: (r.x * 100) + '%', top: 'calc(' + (r.y * 100) + '% - 14px)',
              transform: 'translate(-50%,-100%)', whiteSpace: 'nowrap', pointerEvents: 'none',
              background: 'var(--color-fg-1)', color: 'var(--color-surface)',
              fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12,
              padding: '4px 8px', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-raised)',
            }}>{named === 'me' ? 'You' : r.name}</span>
          );
        })()}
      </div>
      {!small && (
        <div style={{ position: 'relative', width: box, margin: '0 auto' }}>
          <RxAxisLabels />
        </div>
      )}
    </div>
  );
};
const RxAxisLabels = () => {
  const lab = { position: 'absolute', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 11, color: 'var(--color-fg-3)', letterSpacing: '0.01em' };
  return (
    <>
      <span style={{ ...lab, top: -226, left: '50%', transform: 'translateX(-50%)' }}>Head</span>
      <span style={{ ...lab, top: 6, left: '50%', transform: 'translateX(-50%)' }}>Heart</span>
      <span style={{ ...lab, top: -112, left: -2, transform: 'translateY(-50%) rotate(-90deg)', transformOrigin: 'left center' }}>Agreed</span>
      <span style={{ ...lab, top: -112, right: -2, transform: 'translateY(-50%) rotate(90deg)', transformOrigin: 'right center' }}>Challenged</span>
    </>
  );
};

// ---------------------------------------------------------------------------
// ROUND 2 — deterministic PRNG (stable trace/pull per member).
// ---------------------------------------------------------------------------
const rxHash = (s) => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const rxRng = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

// ---------------------------------------------------------------------------
// ROUND 2 — The Stick geometry (intensity, payload) → point on a circular pad.
// ---------------------------------------------------------------------------
const STICK_MAX = 0.46;      // furthest a dot sits from centre (fraction of pad)
const STICK_DEAD = 0.14;     // inside this = a plain landing, no payload
const zoneAngle = (idx) => (-90 + idx * 72) * Math.PI / 180;
const stickJitter = (name) => ((rxHash(name || '') % 1000) / 1000 - 0.5) * 0.5; // ±0.25 rad, stable per member
// Position of a dot on the pad. A committed drag carries its own free nx/ny;
// otherwise (seed reactions) we place it fluidly around its payload direction
// with a stable per-member jitter so the circle reads as a constellation.
const stickPos = (r) => {
  if (r && r.nx != null) return { x: r.nx, y: r.ny };
  const i = iv(r);
  const idx = r && r.payload ? RX_PAYLOADS.indexOf(r.payload) : -1;
  const rr = idx >= 0 ? 0.16 + i * 0.28 : 0.04 + i * 0.09;
  const a = (idx >= 0 ? zoneAngle(idx) : -Math.PI / 2) + stickJitter(r && r.name);
  return { x: 0.5 + Math.cos(a) * rr, y: 0.5 + Math.sin(a) * rr };
};
// Nearest payload for a free pull direction — a single word, never a blend.
const nearestPayload = (dx, dy, dist) => {
  if (dist < STICK_DEAD) return null;
  const ang = Math.atan2(dy, dx); let best = 0, bd = 9;
  for (let k = 0; k < 5; k++) { const d = Math.abs(((ang - zoneAngle(k) + Math.PI) % (2 * Math.PI)) - Math.PI); if (d < bd) { bd = d; best = k; } }
  return RX_PAYLOADS[best];
};

const StickPad = ({ size, mine, others, names, live, onChange, onSubmit, interactive }) => {
  const boxRef = rxRef(null);
  const small = size <= 80;
  // fluid: dot follows the pointer continuously, clamped to the pad radius.
  const posToDraft = (clientX, clientY) => {
    const b = boxRef.current.getBoundingClientRect();
    let dx = (clientX - b.left) / b.width - 0.5, dy = (clientY - b.top) / b.height - 0.5;
    let dist = Math.hypot(dx, dy);
    if (dist > STICK_MAX) { dx *= STICK_MAX / dist; dy *= STICK_MAX / dist; dist = STICK_MAX; }
    return { nx: 0.5 + dx, ny: 0.5 + dy, intensity: Math.min(1, dist / STICK_MAX), payload: nearestPayload(dx, dy, dist) };
  };
  const onPointerDown = (e) => {
    if (!interactive) return;
    const el = e.currentTarget;
    try { el.setPointerCapture(e.pointerId); } catch (err) {}
    const move = (ev) => onChange(posToDraft(ev.clientX, ev.clientY));
    move(e);
    const up = () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      // release = the selection stays put; committing is a separate button.
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  };
  const onKeyDown = (e) => {
    if (!interactive) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSubmit && onSubmit(); return; }
    const cur = live || {}; let dx = (cur.nx != null ? cur.nx : 0.5) - 0.5, dy = (cur.ny != null ? cur.ny : 0.5) - 0.5;
    let ang = Math.hypot(dx, dy) < 0.001 ? -Math.PI / 2 : Math.atan2(dy, dx);
    let rad = Math.hypot(dx, dy);
    if (e.key === 'ArrowUp') rad = Math.min(STICK_MAX, rad + 0.06);
    else if (e.key === 'ArrowDown') rad = Math.max(0, rad - 0.06);
    else if (e.key === 'ArrowRight') ang += 0.35;
    else if (e.key === 'ArrowLeft') ang -= 0.35;
    else return;
    e.preventDefault();
    dx = Math.cos(ang) * rad; dy = Math.sin(ang) * rad;
    onChange({ nx: 0.5 + dx, ny: 0.5 + dy, intensity: Math.min(1, rad / STICK_MAX), payload: nearestPayload(dx, dy, rad) });
  };
  const dot = (r, isMine, key) => {
    const p = stickPos(r); const d = small ? 5 : (isMine ? 12 + iv(r) * 6 : 10 + iv(r) * 6);
    return (
      <span key={key} title={small || !names ? undefined : (isMine ? 'You' : r.name)} style={{
        position: 'absolute', left: (p.x * 100) + '%', top: (p.y * 100) + '%',
        width: d, height: d, borderRadius: '50%', transform: 'translate(-50%,-50%)',
        background: isMine ? 'var(--color-accent)' : 'var(--color-fg-1)',
        opacity: isMine ? 1 : 0.3 + iv(r) * 0.42,
        border: isMine ? '2px solid var(--color-surface)' : 'none',
        boxShadow: isMine && !small ? '0 0 0 5px rgba(4,120,87,0.14)' : 'none',
      }} />
    );
  };
  // live puck — expands + deepens as it pulls out (tactile emotive feedback).
  const livePuck = () => {
    const lx = live && live.nx != null ? live.nx : 0.5, ly = live && live.ny != null ? live.ny : 0.5;
    const t = live && live.intensity != null ? live.intensity : 0;
    const puck = 18 + t * 22, halo = 26 + t * 78;
    return (
      <>
        <span style={{ position: 'absolute', left: (lx * 100) + '%', top: (ly * 100) + '%', width: halo, height: halo, borderRadius: '50%', transform: 'translate(-50%,-50%)', background: 'rgba(4,120,87,' + (0.08 + t * 0.16) + ')', transition: 'none' }} />
        <span style={{ position: 'absolute', left: (lx * 100) + '%', top: (ly * 100) + '%', width: puck, height: puck, borderRadius: '50%', transform: 'translate(-50%,-50%)', background: 'var(--color-accent)', opacity: 0.62 + t * 0.38, border: '2px solid var(--color-surface)', boxShadow: '0 2px 8px rgba(4,120,87,' + (0.2 + t * 0.3) + ')' }} />
      </>
    );
  };
  return (
    <div ref={boxRef}
      tabIndex={interactive ? 0 : undefined} onKeyDown={onKeyDown} onPointerDown={onPointerDown}
      role={interactive ? 'slider' : undefined} aria-label={interactive ? 'Drag to say how it landed' : undefined}
      style={{
        position: 'relative', width: size, height: size, flexShrink: 0,
        background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-1)',
        borderRadius: '50%', touchAction: 'none', cursor: interactive ? 'grab' : 'default',
        backgroundImage: 'radial-gradient(circle, var(--color-border-2) 1px, transparent 1px)',
        backgroundSize: (size / 5) + 'px ' + (size / 5) + 'px', backgroundPosition: 'center',
      }}>
      {!small && !interactive && <span style={{ position: 'absolute', left: '50%', top: '50%', width: 4, height: 4, borderRadius: '50%', background: 'var(--color-border-strong)', transform: 'translate(-50%,-50%)' }} />}
      {(others || []).map((r, i) => dot(r, false, 'o' + i))}
      {mine && dot(mine, true, 'me')}
      {interactive && livePuck()}
    </div>
  );
};
const StickZoneLabels = ({ live }) => {
  const active = live && live.payload;
  return RX_PAYLOADS.map((p, k) => {
    const a = zoneAngle(k), rr = 0.62;
    return (
      <span key={p} style={{
        position: 'absolute', left: (50 + Math.cos(a) * rr * 100) + '%', top: (50 + Math.sin(a) * rr * 100) + '%',
        transform: 'translate(-50%,-50%)', whiteSpace: 'nowrap', pointerEvents: 'none',
        fontFamily: 'var(--font-sans)', fontWeight: active === p ? 600 : 500, fontSize: 11,
        color: active === p ? 'var(--color-accent)' : 'var(--color-fg-3)', transition: 'color 120ms, font-weight 120ms',
      }}>{p}</span>
    );
  });
};

// ---------------------------------------------------------------------------
// ROUND 2 — The Trace (stable stroke per member; longer = harder).
// ---------------------------------------------------------------------------
const tracePath = (seed, intensity, w, h, band) => {
  const rnd = rxRng(rxHash(seed));
  const len = 0.34 + Math.min(1, intensity) * 0.6;
  const x0 = w * (0.10 + rnd() * 0.06);
  const y0 = h * (0.28 + band * 0.44 + (rnd() - 0.5) * 0.12);
  const span = (w * 0.82) * len;
  const steps = 4;
  let d = 'M ' + x0.toFixed(1) + ' ' + y0.toFixed(1);
  for (let i = 1; i <= steps; i++) {
    const x = x0 + span * (i / steps);
    const cy = y0 + (rnd() - 0.5) * h * 0.5;
    const y = y0 + (rnd() - 0.5) * h * 0.22;
    d += ' Q ' + (x - span / steps / 2).toFixed(1) + ' ' + cy.toFixed(1) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1);
  }
  return d;
};

// ---------------------------------------------------------------------------
// ROUND 2 — The Dial (quarter arc, soft detents).
// ---------------------------------------------------------------------------
const DIAL_STEPS = 5;
const dialT = (intensity) => Math.max(0, Math.min(1, (iv({ intensity }) - 0.2) / 0.8));
const dialPoint = (t, cx, cy, R) => { const a = Math.PI - t * (Math.PI / 2); return { x: cx + R * Math.cos(a), y: cy - R * Math.sin(a) }; };
const DialArc = ({ size, live, others, interactive, onSet }) => {
  const boxRef = rxRef(null);
  const w = size, h = size * 0.7, cx = w * 0.5, cy = h * 0.92, R = Math.min(cx, cy) - (size <= 64 ? 6 : 16);
  const set = (clientX, clientY) => {
    const b = boxRef.current.getBoundingClientRect();
    const px = (clientX - b.left) / b.width * w, py = (clientY - b.top) / b.height * h;
    const ang = Math.atan2(-(py - cy), px - cx);
    let t = (Math.PI - ang) / (Math.PI / 2); t = Math.max(0, Math.min(1, t));
    const idx = Math.round(t * (DIAL_STEPS - 1));
    onSet(0.2 + (idx / (DIAL_STEPS - 1)) * 0.8);
  };
  const onPointerDown = (e) => {
    if (!interactive) return;
    const el = e.currentTarget;
    try { el.setPointerCapture(e.pointerId); } catch (err) {}
    const move = (ev) => set(ev.clientX, ev.clientY); move(e);
    const up = () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  };
  const onKeyDown = (e) => {
    if (!interactive) return;
    const cur = live == null ? -1 : Math.round(dialT(live) * (DIAL_STEPS - 1));
    let idx = cur;
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') idx = Math.min(DIAL_STEPS - 1, cur + 1);
    else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') idx = Math.max(0, cur - 1);
    else return;
    e.preventDefault(); onSet(0.2 + (idx / (DIAL_STEPS - 1)) * 0.8);
  };
  const arcPath = 'M ' + (cx - R).toFixed(1) + ' ' + cy.toFixed(1) + ' A ' + R + ' ' + R + ' 0 0 0 ' + cx.toFixed(1) + ' ' + (cy - R).toFixed(1);
  const small = size <= 64;
  return (
    <svg ref={boxRef} width={w} height={h} viewBox={'0 0 ' + w + ' ' + h}
      tabIndex={interactive ? 0 : undefined} onKeyDown={onKeyDown} onPointerDown={onPointerDown}
      role={interactive ? 'slider' : undefined} aria-label={interactive ? 'Drag along the dial to say how it landed' : undefined}
      style={{ touchAction: 'none', cursor: interactive ? 'grab' : 'default', display: 'block', overflow: 'visible' }}>
      <path d={arcPath} fill="none" stroke="var(--color-border-1)" strokeWidth={small ? 2 : 3} strokeLinecap="round" />
      {Array.from({ length: DIAL_STEPS }).map((_, i) => {
        const p = dialPoint(i / (DIAL_STEPS - 1), cx, cy, R);
        return <circle key={i} cx={p.x} cy={p.y} r={small ? 1.4 : 2.2} fill="var(--color-border-strong)" />;
      })}
      {(others || []).map((r, i) => { const p = dialPoint(dialT(iv(r)), cx, cy, R); return <circle key={'o' + i} cx={p.x} cy={p.y} r={small ? 2.4 : 4} fill="var(--color-fg-1)" opacity={0.22 + iv(r) * 0.28} />; })}
      {live != null && (() => {
        const t = dialT(live), end = dialPoint(t, cx, cy, R);
        const fill = 'M ' + (cx - R).toFixed(1) + ' ' + cy.toFixed(1) + ' A ' + R + ' ' + R + ' 0 0 0 ' + end.x.toFixed(1) + ' ' + end.y.toFixed(1);
        return (<>
          <path d={fill} fill="none" stroke="var(--color-accent)" strokeWidth={small ? 2 : 3} strokeLinecap="round" />
          <circle cx={end.x} cy={end.y} r={small ? 3 : 7} fill="var(--color-accent)" stroke="var(--color-surface)" strokeWidth={small ? 1 : 2} />
        </>);
      })()}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// ROUND 2 — payload chips + tag + caption row.
// ---------------------------------------------------------------------------
const PayloadChips = ({ value, onPick }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 320 }}>
    {RX_PAYLOADS.map((p) => {
      const on = value === p;
      return (
        <button key={p} type="button" className="lp-rx-chip" onClick={() => onPick(on ? null : p)}
          aria-pressed={on} style={{
            minHeight: 40, padding: '9px 13px', fontFamily: 'var(--font-sans)', fontWeight: on ? 600 : 500, fontSize: 13.5,
            color: on ? 'var(--color-accent)' : 'var(--color-fg-1)',
            background: on ? 'var(--color-accent-soft)' : 'var(--color-surface)',
            border: '1px solid ' + (on ? 'var(--color-accent)' : 'var(--color-border-1)'),
            borderRadius: 'var(--radius-pill)', cursor: 'pointer', lineHeight: 1.2, whiteSpace: 'nowrap',
          }}>{p}</button>
      );
    })}
  </div>
);
const PayloadTag = ({ label }) => (
  <span style={{
    fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12.5, color: 'var(--color-fg-2)',
    background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-2)',
    borderRadius: 'var(--radius-pill)', padding: '3px 9px', whiteSpace: 'nowrap',
  }}>{label}</span>
);
const CaptionRow = ({ r, names, mine }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
    <span style={{ width: 8 + iv(r) * 12, height: 8 + iv(r) * 12, borderRadius: '50%', flexShrink: 0,
      background: mine ? 'var(--color-accent)' : 'var(--color-fg-1)', opacity: mine ? 1 : 0.3 + iv(r) * 0.4 }} />
    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-fg-1)', whiteSpace: 'nowrap' }}>{who(r.name, names)}</span>
    {r.payload && <PayloadTag label={r.payload} />}
  </div>
);

// ===========================================================================
// INPUT STEP — variant-specific, always skippable.
// ===========================================================================
const RxActions = ({ onSkip, done }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: done ? 'space-between' : 'center', gap: 12, width: '100%', minWidth: 240 }}>
    <button type="button" onClick={onSkip} className="lp-btn-tertiary" style={{
      background: 'transparent', border: 0, cursor: 'pointer', padding: '10px 6px',
      fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14, color: 'var(--color-fg-2)',
    }}>Skip</button>
    {done && <Button variant="primary" onClick={done}>Leave reaction</Button>}
  </div>
);
const secondaryBtn = {
  minHeight: 44, padding: '0 18px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
  fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14, color: 'var(--color-fg-1)',
  background: 'var(--color-surface)', border: '1px solid var(--color-border-strong)', marginBottom: 14,
};
const PlainStepLabel = ({ n, optional, children }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, whiteSpace: 'nowrap' }}>
    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 12, color: 'var(--color-fg-3)', flexShrink: 0 }}>{n}</span>
    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--color-fg-1)', flexShrink: 0 }}>{children}</span>
    {optional && <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12.5, color: 'var(--color-fg-3)', flexShrink: 0 }}>optional</span>}
  </div>
);

const RxInput = ({ variant, onCommit, onSkip }) => {
  // round-1 state
  const [placed, setPlaced] = rxState(null);
  const [held, setHeld] = rxState(0);
  const holdRef = rxRef({ raf: 0, start: 0 });
  // round-2 state
  const [draft, setDraft] = rxState({ intensity: null, payload: null });
  const [stroke, setStroke] = rxState(null);
  const traceRef = rxRef(null);
  const touched = draft.intensity != null || draft.payload != null;
  const setPayload = (p) => setDraft(d => ({ ...d, payload: p }));
  const commit2 = () => onCommit({ name: 'You', ...draft });

  // ---- round-1: press & hold (pulse) ----
  const startHold = (e) => {
    e.preventDefault();
    holdRef.current.start = performance.now();
    const tick = () => {
      const ms = performance.now() - holdRef.current.start;
      setHeld(Math.min(1, ms / 1600));
      holdRef.current.raf = requestAnimationFrame(tick);
    };
    holdRef.current.raf = requestAnimationFrame(tick);
  };
  const endHold = () => {
    if (!holdRef.current.start) return;
    cancelAnimationFrame(holdRef.current.raf);
    const v = Math.min(1, (performance.now() - holdRef.current.start) / 1600);
    holdRef.current.start = 0;
    onCommit({ name: 'You', intensity: Math.max(0.12, v) });
  };

  // ---- round-2: trace stroke capture ----
  const traceStart = (e) => {
    const b = traceRef.current.getBoundingClientRect();
    const el = e.currentTarget;
    try { el.setPointerCapture(e.pointerId); } catch (err) {}
    const pts = [{ x: e.clientX - b.left, y: e.clientY - b.top }];
    let len = 0;
    const move = (ev) => {
      const x = ev.clientX - b.left, y = ev.clientY - b.top, last = pts[pts.length - 1];
      len += Math.hypot(x - last.x, y - last.y); pts.push({ x, y }); setStroke([...pts]);
    };
    const up = () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      if (pts.length > 1) setDraft(d => ({ ...d, intensity: Math.max(0.12, Math.min(1, len / (b.width * 1.3))) }));
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  };

  let body = null;
  // ------------------------------ round 1 ------------------------------
  if (variant === 'map') {
    body = (
      <>
        <MapField mine={placed} others={[]} placeable onPlace={setPlaced} revealOthers={false} />
        <div style={{ height: 8 }} />
        <RxActions onSkip={onSkip} done={placed ? () => onCommit({ name: 'You', x: placed.x, y: placed.y }) : null} />
      </>
    );
  } else if (variant === 'glyphs' || variant === 'gathering') {
    body = (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, width: 232 }}>
          {RX_GLYPHS.map((g) => (
            <button key={g} type="button" onClick={() => onCommit({ name: 'You', glyph: g })}
              className="lp-rx-glyph" style={{
                aspectRatio: '1', minHeight: 60, fontSize: 26, lineHeight: 1,
                background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
                borderRadius: 'var(--radius-md)', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>{g}</button>
          ))}
        </div>
        <div style={{ height: 12 }} />
        <RxActions onSkip={onSkip} />
      </>
    );
  } else if (variant === 'lexicon') {
    body = (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: 300 }}>
          {RX_PHRASES.map((p) => (
            <button key={p} type="button" onClick={() => onCommit({ name: 'You', phrase: p })}
              className="lp-rx-phrase" style={{
                minHeight: 44, padding: '10px 12px', textAlign: 'left',
                fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13.5, color: 'var(--color-fg-1)',
                background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
                borderRadius: 'var(--radius-md)', cursor: 'pointer', lineHeight: 1.25,
              }}>{p}</button>
          ))}
        </div>
        <div style={{ height: 12 }} />
        <RxActions onSkip={onSkip} />
      </>
    );
  } else if (variant === 'pulse') {
    body = (
      <>
        <div style={{ position: 'relative', width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{
            position: 'absolute', width: 40 + held * 118, height: 40 + held * 118, borderRadius: '50%',
            background: 'rgba(4,120,87,' + (0.10 + held * 0.22) + ')', transition: 'none',
          }} />
          <button type="button"
            onPointerDown={startHold} onPointerUp={endHold} onPointerLeave={endHold}
            aria-label="Press and hold to pulse"
            style={{
              position: 'relative', width: 84, height: 84, borderRadius: '50%',
              background: 'var(--color-accent)', border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(4,120,87,0.28)', touchAction: 'none',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', opacity: 0.9 }} />
          </button>
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--color-fg-3)', margin: '4px 0 12px' }}>Press and hold — longer if it landed harder.</p>
        <RxActions onSkip={onSkip} />
      </>
    );
  // ------------------------------ round 2 ------------------------------
  } else if (variant === 'stick') {
    body = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 244, height: 244, margin: '34px 0 0' }}>
          <div style={{ position: 'absolute', inset: 36 }}>
            <StickPad size={172} live={draft} interactive
              onChange={(d) => setDraft(d)} onSubmit={() => { if (touched) commit2(); }} />
          </div>
          <StickZoneLabels live={draft} />
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--color-fg-3)', margin: '14px 0 14px', textAlign: 'center', maxWidth: 300 }}>Drag the puck toward a word — further out if it landed harder — then let go. Release in the middle for a plain landing.</p>
        <RxActions onSkip={onSkip} done={touched ? commit2 : null} />
      </div>
    );
  } else if (variant === 'trace') {
    body = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg ref={traceRef} width={300} height={120} onPointerDown={traceStart}
          style={{ touchAction: 'none', cursor: 'crosshair', background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-md)', display: 'block' }}>
          {stroke && stroke.length > 1 && (
            <polyline points={stroke.map(p => p.x + ',' + p.y).join(' ')} fill="none" stroke="var(--color-accent)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--color-fg-3)', margin: '10px 0 8px', textAlign: 'center' }}>
          {draft.intensity != null ? 'Add a word, if you like.' : 'Draw a mark across the card \u2014 a longer mark if it landed harder.'}
        </p>
        {draft.intensity == null && (
          <button type="button" onClick={() => { setStroke(null); setDraft(d => ({ ...d, intensity: 0.55 })); }}
            className="lp-btn-secondary" style={secondaryBtn}>Mark that it landed</button>
        )}
        {draft.intensity != null && (
          <div style={{ margin: '4px 0 14px' }}><PayloadChips value={draft.payload} onPick={setPayload} /></div>
        )}
        <RxActions onSkip={onSkip} done={touched ? commit2 : null} />
      </div>
    );
  } else if (variant === 'dial') {
    body = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <DialArc size={224} live={draft.intensity} interactive onSet={(i) => setDraft(d => ({ ...d, intensity: i }))} />
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--color-fg-3)', margin: '6px 0 14px', textAlign: 'center' }}>
          {draft.intensity == null ? 'Turn the dial to say how it landed.' : 'And a word, if you like.'}
        </p>
        <div style={{ marginBottom: 14 }}><PayloadChips value={draft.payload} onPick={setPayload} /></div>
        <RxActions onSkip={onSkip} done={touched ? commit2 : null} />
      </div>
    );
  } else if (variant === 'plain') {
    // The honest baseline: one click-through control (tap to cycle the landing),
    // then the optional word. No gesture — but the progression is made legible
    // by an expanding disc, a changing label, and three progress pips.
    const PLAIN_LEVELS = [
      { key: 'no',     label: 'It didn\u2019t land', v: 0.06 },
      { key: 'yes',    label: 'It landed',           v: 0.55 },
      { key: 'strong', label: 'It really landed',    v: 0.95 },
    ];
    const idx = draft.intensity == null ? -1 : (draft.intensity <= 0.12 ? 0 : draft.intensity >= 0.7 ? 2 : 1);
    const cur = idx < 0 ? null : PLAIN_LEVELS[idx];
    const advance = () => { const next = (idx + 1) % 3; setDraft(d => ({ ...d, intensity: PLAIN_LEVELS[next].v })); };
    const discStyle = idx < 0 ? { width: 15, height: 15, border: '2px dashed var(--color-fg-3)' }
      : idx === 0 ? { width: 13, height: 13, border: '2px solid var(--color-accent)' }
      : { width: idx === 1 ? 18 : 28, height: idx === 1 ? 18 : 28, background: 'var(--color-accent)' };
    body = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 20, width: 300 }}>
        <div>
          <PlainStepLabel n="1">Did it land?</PlainStepLabel>
          <button type="button" onClick={advance} aria-label={cur ? cur.label + '. Tap to change.' : 'Tap to say how it landed.'}
            style={{
              marginTop: 10, width: '100%', minHeight: 72, padding: '0 16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
              borderRadius: 'var(--radius-md)',
              border: '1px solid ' + (cur ? 'var(--color-accent)' : 'var(--color-border-strong)'),
              background: cur ? 'var(--color-accent-soft)' : 'var(--color-surface)',
              transition: 'border-color var(--duration-base), background var(--duration-base)',
            }}>
            <span style={{ position: 'relative', width: 40, height: 40, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              {idx === 2 && <span style={{ position: 'absolute', width: 40, height: 40, borderRadius: '50%', background: 'rgba(4,120,87,0.14)' }} />}
              <span style={{ borderRadius: '50%', transition: 'width 170ms var(--ease-quiet), height 170ms var(--ease-quiet), background 170ms', ...discStyle }} />
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, minWidth: 0 }}>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, color: cur ? 'var(--color-accent)' : 'var(--color-fg-2)' }}>{cur ? cur.label : 'How did it land?'}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12.5, color: 'var(--color-fg-3)' }}>Tap to change</span>
            </span>
            <span style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
              {[0, 1, 2].map((k) => (
                <span key={k} style={{ width: 6, height: 6, borderRadius: '50%', background: k === idx ? 'var(--color-accent)' : 'var(--color-border-strong)', opacity: k === idx ? 1 : 0.45, transition: 'background 150ms, opacity 150ms' }} />
              ))}
            </span>
          </button>
        </div>
        <div>
          <PlainStepLabel n="2" optional>Add a word</PlainStepLabel>
          <div style={{ marginTop: 10 }}><PayloadChips value={draft.payload} onPick={setPayload} /></div>
        </div>
        <RxActions onSkip={onSkip} done={touched ? commit2 : null} />
      </div>
    );
  }

  const round2 = RX_ROUND2.indexOf(variant) >= 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-xl)', color: 'var(--color-fg-1)', margin: '0 0 4px', letterSpacing: '-0.01em' }}>{round2 ? 'How did it land?' : 'How did it land for you?'}</h2>
      {variant !== 'plain' && <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--color-fg-3)', margin: '0 0 18px' }}>Optional — a note left for the circle.</p>}
      {variant === 'plain' && <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--color-fg-3)', margin: '0 0 18px' }}>Leave the circle a quiet signal — or skip.</p>}
      {body}
    </div>
  );
};

// ===========================================================================
// REVEAL STEP — ephemeral, self-fading. Shows the circle whether or not you
// reacted. First-reader → one graceful line.
// ===========================================================================
const RxRevealLabel = ({ children }) => (
  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-fg-3)' }}>{children}</span>
);
const RxReveal = ({ variant, mine, others, names, onDone }) => {
  const [fading, setFading] = rxState(false);
  const first = others.length === 0;
  const total = first ? 2600
    : variant === 'gathering' ? Math.min(7200, 1400 + (others.length + 1) * 950 + 1600)
    : variant === 'glyphs' ? Math.min(6400, 1200 + others.length * 780 + 1700)
    : variant === 'map' ? 3400 + others.length * 300
    : variant === 'lexicon' ? 3600
    : variant === 'pulse' ? 4400
    : Math.min(6800, 1800 + others.length * 900 + 1400); // round-2
  rxEffect(() => {
    const f = setTimeout(() => setFading(true), total);
    const d = setTimeout(onDone, total + 480);
    return () => { clearTimeout(f); clearTimeout(d); };
  }, []);

  let inner = null;
  if (first) {
    inner = <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 'var(--text-lg)', color: 'var(--color-fg-1)', margin: 0, textAlign: 'center' }}>{FIRST_LINE}</p>;
  // ------------------------------ round 1 ------------------------------
  } else if (variant === 'map') {
    inner = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <RxRevealLabel>Where the circle landed</RxRevealLabel>
        <MapField mine={mine} others={others} placeable={false} revealOthers={true} />
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--color-fg-3)', margin: '2px 0 0' }}>Tap a dot for a name.</p>
      </div>
    );
  } else if (variant === 'glyphs') {
    inner = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <RxRevealLabel>How it landed</RxRevealLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 180 }}>
          {others.map((r, i) => (
            <div key={i} className="lp-rx-rise" style={{ animationDelay: (i * 780) + 'ms', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
              <span style={{ fontSize: 26, lineHeight: 1 }}>{r.glyph}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, color: 'var(--color-fg-1)' }}>{r.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (variant === 'lexicon') {
    inner = (
      <div style={{ maxWidth: 340, textAlign: 'center' }}>
        <RxRevealLabel>In the circle</RxRevealLabel>
        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 'var(--text-lg)', lineHeight: 1.5, color: 'var(--color-fg-1)', margin: '12px 0 0', textWrap: 'pretty' }}>
          {others.map((r) => (RX_FRAGMENT[r.phrase] ? RX_FRAGMENT[r.phrase](r.name) : '') + ' ')}
        </p>
      </div>
    );
  } else if (variant === 'pulse') {
    const warmth = pulseWarmth(others);
    const band = pulseBand(warmth);
    const disc = 56 + warmth * 46;
    inner = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        <RxRevealLabel>How hard it landed</RxRevealLabel>
        <div style={{ position: 'relative', width: 216, height: 176, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="lp-rx-echo" style={{
              animationDelay: (i * 560) + 'ms', width: disc, height: disc,
              '--reach': (1.35 + warmth * 1.6),
              border: '1.5px solid var(--color-accent)',
            }} />
          ))}
          <span className="lp-rx-beat" style={{
            width: disc, height: disc, borderRadius: '50%',
            background: 'rgba(4,120,87,' + (0.22 + warmth * 0.5) + ')',
            '--peak': (1 + warmth * 0.85),
          }} />
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 'var(--text-md)', color: 'var(--color-fg-1)', margin: 0, textAlign: 'center' }}>{band.line}</p>
      </div>
    );
  } else if (variant === 'gathering') {
    const seq = [...others, ...(mine ? [{ ...mine, when: 'now' }] : [])];
    inner = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <RxRevealLabel>The gathering</RxRevealLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 200 }}>
          {seq.map((r, i) => (
            <div key={i} className="lp-rx-rise" style={{ animationDelay: (700 + i * 950) + 'ms', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22, lineHeight: 1, width: 28, textAlign: 'center' }}>{r.glyph || '\u2022'}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-fg-1)' }}>{r.name}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-fg-3)' }}>· {r.when || ''}</span>
            </div>
          ))}
        </div>
      </div>
    );
  // ------------------------------ round 2 ------------------------------
  } else if (variant === 'stick') {
    inner = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <RxRevealLabel>Where the circle landed</RxRevealLabel>
        <StickPad size={200} mine={mine} others={others} names={names} interactive={false} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
          {others.map((r, i) => (<div key={i} className="lp-rx-rise" style={{ animationDelay: (i * 260) + 'ms' }}><CaptionRow r={r} names={names} /></div>))}
        </div>
      </div>
    );
  } else if (variant === 'trace') {
    inner = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: 320 }}>
        <RxRevealLabel>In the margins</RxRevealLabel>
        <div style={{ position: 'relative', width: 300 }}>
          <svg width={300} height={70 + others.length * 8} style={{ display: 'block' }}>
            {others.map((r, i) => (
              <path key={i} className="lp-rx-rise" style={{ animationDelay: (i * 320) + 'ms' }}
                d={tracePath(r.name, iv(r), 300, 70 + others.length * 8, others.length > 1 ? i / (others.length - 1) : 0.5)}
                fill="none" stroke="var(--color-fg-1)" strokeWidth={2} strokeLinecap="round" opacity={0.22 + iv(r) * 0.3} />
            ))}
            {mine && <path d={tracePath('You', iv(mine), 300, 70 + others.length * 8, 0.5)} fill="none" stroke="var(--color-accent)" strokeWidth={2.5} strokeLinecap="round" />}
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, width: '100%' }}>
          {others.map((r, i) => (<div key={i} className="lp-rx-rise" style={{ animationDelay: (i * 320 + 200) + 'ms' }}><CaptionRow r={r} names={names} /></div>))}
        </div>
      </div>
    );
  } else if (variant === 'dial') {
    inner = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <RxRevealLabel>Where the circle landed</RxRevealLabel>
        <DialArc size={200} live={mine ? iv(mine) : null} others={others} interactive={false} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
          {others.map((r, i) => (<div key={i} className="lp-rx-rise" style={{ animationDelay: (i * 260) + 'ms' }}><CaptionRow r={r} names={names} /></div>))}
        </div>
      </div>
    );
  } else if (variant === 'plain') {
    inner = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 10, minWidth: 260 }}>
        <RxRevealLabel>In the circle</RxRevealLabel>
        {others.map((r, i) => (
          <div key={i} className="lp-rx-rise" style={{ animationDelay: (i * 300) + 'ms', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-fg-1)' }}>{who(r.name, names)}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13.5, color: 'var(--color-fg-2)' }}>{landedWord(iv(r))}</span>
            {r.payload && <PayloadTag label={r.payload} />}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: fading ? 0 : 1, transition: 'opacity 460ms var(--ease-quiet)' }}>{inner}</div>
  );
};

// ---------------------------------------------------------------------------
// ReactionFlow — the whole moment. The read is committed inside commit().
// ---------------------------------------------------------------------------
const ReactionFlow = ({ item, variant, names, onMarkRead, onClose }) => {
  const [step, setStep] = rxState('input');
  const [mine, setMine] = rxState(null);
  const others = rxMemo(() => rxOthers(item), [item]);
  const commit = (rx) => { onMarkRead(item, rx); setMine(rx); setStep('reveal'); };

  rxEffect(() => {
    if (step !== 'input') return;
    const onKey = (e) => { if (e.key === 'Escape') commit(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  const modal = step === 'input';
  return (
    <div onClick={(e) => { if (e.target === e.currentTarget && step === 'reveal') onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 135,
        background: modal ? 'var(--color-scrim)' : 'rgba(10,10,10,0.22)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        transition: 'background 460ms var(--ease-quiet)',
      }} className="lp-anim-fade">
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', boxShadow: 'var(--shadow-overlay)', maxWidth: 420, width: 'auto', minWidth: 288 }}>
        {step === 'input'
          ? <RxInput variant={variant} onCommit={commit} onSkip={() => commit(null)} />
          : <RxReveal variant={variant} mine={mine} others={others} names={names} onDone={onClose} />}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// ReadReactions — the permanent, quiet record on the Read-tab card.
// ---------------------------------------------------------------------------
const ReadReactions = ({ item, variant, names }) => {
  const all = (item && item.reactions) || [];
  // The Pulse: a faint warmth mark, no names, even when empty-guarded below.
  if (variant === 'pulse') {
    if (all.length === 0) return null;
    const warmth = pulseWarmth(all);
    const band = pulseBand(warmth);
    const d = 5 + warmth * 7;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border-2)' }}>
        <span style={{ position: 'relative', width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid var(--color-accent)', opacity: 0.18 + warmth * 0.32 }} />
          <span style={{ width: d, height: d, borderRadius: '50%', background: 'var(--color-accent)', opacity: 0.4 + warmth * 0.5 }} />
        </span>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-2)', whiteSpace: 'nowrap' }}>{band.line}</span>
      </div>
    );
  }
  if (all.length === 0) return null;
  const mine = rxMine(item), others = rxOthers(item);

  // round-2 shared readout: name — landed — payload.
  const readList = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 0 }}>
      {all.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', lineHeight: 1.2 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13.5, color: 'var(--color-fg-1)', whiteSpace: 'nowrap' }}>{who(r.name, names)}</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, color: 'var(--color-fg-3)', whiteSpace: 'nowrap' }}>{landedWord(iv(r))}</span>
          {r.payload && <PayloadTag label={r.payload} />}
        </div>
      ))}
    </div>
  );

  let body = null;
  // ------------------------------ round 1 ------------------------------
  if (variant === 'map') {
    body = (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <MapField mine={mine || null} others={all.filter(r => r.name !== 'You')} placeable={false} revealOthers={true} small />
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-3)' }}>Where the circle landed</span>
      </div>
    );
  } else if (variant === 'glyphs') {
    body = (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {all.map((r, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px 5px 8px', background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>{r.glyph}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--color-fg-1)' }}>{r.name}</span>
          </span>
        ))}
      </div>
    );
  } else if (variant === 'lexicon') {
    body = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {all.map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13.5, color: 'var(--color-fg-1)' }}>{r.name}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13.5, color: 'var(--color-fg-2)' }}>{r.phrase}</span>
          </div>
        ))}
      </div>
    );
  } else if (variant === 'gathering') {
    body = (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 2, overflowX: 'auto' }}>
        {all.map((r, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ height: 1, flex: '0 0 18px', background: 'var(--color-border-1)', marginTop: 13 }} />}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0 }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>{r.glyph || '\u2022'}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 11, color: 'var(--color-fg-2)' }}>{r.name === 'You' ? 'You' : firstName(r.name)}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-fg-3)' }}>{r.when || ''}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  // ------------------------------ round 2 ------------------------------
  } else if (variant === 'stick') {
    body = (<div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}><StickPad size={64} mine={mine} others={others} names={names} interactive={false} />{readList}</div>);
  } else if (variant === 'trace') {
    body = (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <svg width={96} height={48} style={{ flexShrink: 0, background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-sm)' }}>
          {others.map((r, i) => (<path key={i} d={tracePath(r.name, iv(r), 96, 48, others.length > 1 ? i / (others.length - 1) : 0.5)} fill="none" stroke="var(--color-fg-1)" strokeWidth={1.4} strokeLinecap="round" opacity={0.2 + iv(r) * 0.28} />))}
          {mine && <path d={tracePath('You', iv(mine), 96, 48, 0.5)} fill="none" stroke="var(--color-accent)" strokeWidth={1.6} strokeLinecap="round" opacity={0.85} />}
        </svg>
        {readList}
      </div>
    );
  } else if (variant === 'dial') {
    body = (<div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}><div style={{ flexShrink: 0 }}><DialArc size={64} live={mine ? iv(mine) : null} others={others} interactive={false} /></div>{readList}</div>);
  } else {
    body = readList; // plain
  }
  return <div style={{ paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border-2)' }}>{body}</div>;
};

Object.assign(window, { RX_VARIANTS, RX_PAYLOADS, ReactionFlow, ReadReactions });
