// ============================================================================
// Circlists — The Swell. Loop-closure reaction mechanism.
// ----------------------------------------------------------------------------
// Adapted from the loop-closure packet (variant 10, "The Swell"). Self-contained
// beyond React + the design tokens + swell.css. Exports on `window`:
//   SwellReactionFlow  — the mark-as-read moment: react (or skip), then a
//                        passive reveal of how the circle landed.
//   SwellDoor          — the permanent affordance on a Read-tab card that opens
//                        the review modal.
//   SwellReviewModal   — the review modal itself (opened by SwellDoor).
//
// ---- DATA MODEL ------------------------------------------------------------
// A reaction is: { name, glyph, intensity, nx, ny }
//   name       string   — reactor's display name; the current user is "You".
//   glyph      string   — one of RX_GLYPHS (the five-glyph vocabulary).
//   intensity  0..1      — how hard it landed. Drives BOTH glyph size and how
//                          far from centre it sits. 0.42 is the fallback.
//   nx, ny     0..1      — OPTIONAL free position from a committed drag. If
//                          present, the glyph sits exactly there. If absent
//                          (e.g. seed data), position is derived from glyph
//                          direction + intensity + a stable per-name jitter, so
//                          the circle still reads as a constellation.
// A SKIP (read, no note) is a reaction with NO glyph: { name, skipped: true }.
//   It lives in the roster ONLY — never on the disc — always last, shown as an
//   empty ring. Same name, same weight as any reaction; only the mark differs.
// A FORMER-MEMBER reaction carries `former: true` and NO `name` — the reactor's
//   account has since been deleted (same trigger + wording as a card's "Added by
//   former member." attribution; mere removal from the circle keeps the real
//   name). Renders identically to any other reactor — same weight, same disc
//   placement — just labelled "Former member" instead of a name. Can carry a
//   glyph or be a skip ({ former: true, skipped: true }).
// An item is: { id, url, attribution, read, reactions: [reaction, ...] }
// ============================================================================

const { useState: rxState, useEffect: rxEffect, useLayoutEffect: rxLayout, useRef: rxRef, useMemo: rxMemo } = React;

// Lock background scroll while an overlay is up (mirrors the Config modal in
// config.jsx): a scroll gesture on the scrim/card never falls through to the
// feed behind. Locks the forced-mobile inner screen when present, else the
// document. Returns a cleanup that restores the prior value. Call from a
// mount-only effect: rxEffect(() => lockScroll(), []).
const lockScroll = () => {
  const el = document.querySelector('.circ-phone-screen') || document.scrollingElement || document.documentElement;
  const prev = el.style.overflow;
  el.style.overflow = 'hidden';
  return () => { el.style.overflow = prev; };
};

// Bottom-sheet mount/close choreography, shared by the reveal flow and the door
// modal. This is the SAME mechanism as AddReveal (the Add-link sheet, feed.jsx),
// no deviations: render at translateY(100%), then a double-requestAnimationFrame
// flips `shown` true so the CSS *transition* carries the sheet up. To close,
// `shown` goes false so the transition slides it back down, then we unmount
// after the slide. Desktop closes instantly (parent just fades the scrim).
const useSheetMount = (narrow, onClose) => {
  const [shown, setShown] = rxState(false);
  const closingRef = rxRef(false);
  rxEffect(() => {
    let r2; const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setShown(true)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, []);
  const requestClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    if (!narrow) { onClose(); return; }
    setShown(false);
    setTimeout(onClose, 240);
  };
  return { shown, requestClose };
};

// ---- focus trap -----------------------------------------------------------
// Wrap Tab / Shift+Tab within a dialog so focus can't fall out to the page
// behind the scrim. Roving-tabindex controls (the glyph radiogroup) expose only
// their one tabbable member, so they count as a single stop — exactly right.
const rxFocusable = (root) => Array.from(root.querySelectorAll(
  'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])'
)).filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement);
const trapTab = (root, e) => {
  if (e.key !== 'Tab' || !root) return;
  const list = rxFocusable(root);
  if (!list.length) return;
  const first = list[0], last = list[list.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
};

// ---- data helpers ----------------------------------------------------------
const rxOthers = (item) => ((item && item.reactions) || []).filter(r => r.name !== 'You');
const rxMine   = (item) => ((item && item.reactions) || []).find(r => r.name === 'You') || null;
// Attribution wording. The current user is always "You"; everyone else by name.
const who = (name) => (name === 'You' ? 'You' : name);
// Display label for a roster row / pinned name — former-member reactions never
// carry a name, so they always read "Former member", regardless of who it was.
const rxLabel = (r) => (r && r.former ? 'Former member' : who(r && r.name));
// Stable hash key for a reactor — former members have no name, so they share a
// fixed fallback key (any resulting overlap is broken by the collision pass).
const rxKey = (r) => (r && (r.name || (r.former ? '~former' : '')));
const iv  = (r) => (r && r.intensity != null ? r.intensity : 0.42);
// A skip = read, no note: a reaction carrying no glyph. Roster-only, never on the disc.
const rxIsSkip = (r) => !r || !r.glyph;
const rxHash = (s) => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };

// ---- vocabulary ------------------------------------------------------------
// Five glyphs, arranged radially, evenly spaced (360/N apart). This is the
// whole reaction alphabet — heart, fire, thumbs-up, bulb, laugh.
// (Emoji here are the reaction vocabulary being prototyped — deliberate, scoped
// to this feature; not general product decoration.)
const RX_GLYPHS = ['\u2764\uFE0F', '\uD83D\uDD25', '\uD83D\uDC4D', '\uD83D\uDCA1', '\uD83D\uDE02'];
const RX_N = RX_GLYPHS.length;

// ---- depth vocabulary (AA) -------------------------------------------------
// A reaction is quantised to three depth rungs. These words are the SPOKEN
// value on every reaction — the input slider's aria-valuetext, the disc glyphs,
// and the roster rows — so a screen-reader user hears HOW DEEPLY it landed, not
// a number. Level 1..3 maps low->high: a little / moderately / deeply.
const DEPTH_WORDS = ['a little', 'moderately', 'deeply'];
const GLYPH_NAMES = { [RX_GLYPHS[0]]: 'heart', [RX_GLYPHS[1]]: 'fire', [RX_GLYPHS[2]]: 'thumbs up', [RX_GLYPHS[3]]: 'lightbulb', [RX_GLYPHS[4]]: 'laughing' };
// Even-thirds quantiser over the stored 0..1 intensity — one rule for seed data
// and fresh reactions alike.
const levelFromIntensity = (i) => { const v = i == null ? 0.42 : i; return v < 0.34 ? 1 : v < 0.67 ? 2 : 3; };
// Rung -> a representative intensity (keyboard input lands exactly on a rung,
// and re-quantises back to the same level).
const intensityFromLevel = (L) => [0.28, 0.6, 0.92][Math.max(1, Math.min(3, L)) - 1];
const depthWord = (r) => DEPTH_WORDS[levelFromIntensity(iv(r)) - 1];
const glyphName = (g) => GLYPH_NAMES[g] || 'reaction';
// Full accessible name for a reactor, everywhere it's read aloud. A reaction
// says who + what + how deep; a skip says who read it with no reaction.
const rxAriaLabel = (r) => rxIsSkip(r)
  ? (rxLabel(r) + ', read, no reaction')
  : (rxLabel(r) + ', ' + glyphName(r.glyph) + ', ' + depthWord(r));

// ---- geometry --------------------------------------------------------------
const SWELL_MAX  = 0.46;    // furthest a glyph sits from centre (fraction of pad)
const SWELL_DEAD = 0.055;   // inside this = no glyph chosen yet
const glyphAngle   = (idx) => (-90 + idx * (360 / RX_N)) * Math.PI / 180;   // radial dial, evenly spaced
const glyphIndexOf = (g) => RX_GLYPHS.indexOf(g);
// Stable per-member angular jitter. Kept narrow so a CLUSTER of the same glyph
// reads as a compact huddle, not a wide arc smeared across its sector. Each
// member keeps a small fixed offset, well inside the glyph's direction.
const swellJitter  = (name) => ((rxHash(name || '') % 1000) / 1000 - 0.5) * 0.32;
// Stable per-member radial nudge — pushes same-glyph, same-intensity reactions
// off each other's exact radius so two never perfectly coincide.
const swellJitterR = (name) => ((rxHash((name || '') + '~r') % 1000) / 1000 - 0.5) * 0.07;
// Where a glyph sits on the pad. A committed drag carries its own free nx/ny;
// otherwise placed along its glyph's direction, distance by intensity, with a
// stable per-member jitter → the circle reads as a constellation.
const swellPos = (r) => {
  if (r && r.nx != null) return { x: r.nx, y: r.ny };
  const i = iv(r);
  const idx = r && r.glyph ? glyphIndexOf(r.glyph) : -1;
  let rr = idx >= 0 ? 0.13 + i * 0.20 : 0.05;
  if (idx >= 0) rr = Math.max(0.1, Math.min(0.34, rr + swellJitterR(rxKey(r))));
  const a = (idx >= 0 ? glyphAngle(idx) : -Math.PI / 2) + swellJitter(rxKey(r));
  return { x: 0.5 + Math.cos(a) * rr, y: 0.5 + Math.sin(a) * rr };
};
// Nearest glyph for a free pull direction — one glyph, never a blend.
const nearestGlyph = (dx, dy, dist) => {
  if (dist < SWELL_DEAD) return null;
  const ang = Math.atan2(dy, dx); let best = 0, bd = 9;
  for (let k = 0; k < RX_N; k++) { const d = Math.abs(Math.atan2(Math.sin(ang - glyphAngle(k)), Math.cos(ang - glyphAngle(k)))); if (d < bd) { bd = d; best = k; } }
  return RX_GLYPHS[best];
};
const swellFontSize = (i, small, isMine) => small ? (10 + i * 6) : ((isMine ? 20 : 18) + i * 20);

// Lay out a set of reactions for the review disc.
//  - Each glyph group is anchored in its glyph's direction (same emoji => same
//    region), at a radius set by the group's mean depth.
//  - Members of a group PACK as a small 2-D blob around that anchor via a
//    golden-angle (phyllotaxis) spiral, so the huddle grows in ALL directions —
//    INWARD into the open centre as readily as outward — instead of bowing along
//    the rim as a constant-radius arc (which could only ever push outward).
//    Hotter reactions lean a touch further out, keeping the distance depth cue.
//  - A final collision pass nudges apart anything still too close, whatever the
//    emoji or however it was placed. Gentle touch is fine; exact stacks are not.
//  - A committed free-position drag (your own just-left reaction) is honoured.
const SWELL_GAP = 0.075;   // sideways centre-to-centre spacing between huddle-mates
const swellLayout = (list) => {
  const arr = list || [];
  const groups = {};
  arr.forEach((r, i) => { if (r && r.nx != null) return; const idx = r && r.glyph ? glyphIndexOf(r.glyph) : -1; (groups[idx] = groups[idx] || []).push(i); });
  // Per-group anchor: a point in the glyph's direction at the group's MEAN depth.
  // The huddle packs around this, so it can bulge inward past the anchor.
  const anchor = {};
  Object.keys(groups).forEach((key) => {
    const idx = Number(key);
    const ids = groups[idx];
    const mean = ids.reduce((s, i) => s + iv(arr[i]), 0) / ids.length;
    let rr = idx >= 0 ? 0.13 + mean * 0.20 : 0.05;
    rr = Math.max(0.1, Math.min(0.34, rr));
    anchor[idx] = { rr, mean };
  });
  const seen = {};
  const pts = arr.map((r) => {
    if (r && r.nx != null) return { x: r.nx, y: r.ny };
    const idx = r && r.glyph ? glyphIndexOf(r.glyph) : -1;
    const n = (groups[idx] || []).length;
    const k = (seen[idx] = (seen[idx] == null ? 0 : seen[idx] + 1));
    const base = idx >= 0 ? glyphAngle(idx) : -Math.PI / 2;
    const A = anchor[idx] || { rr: 0.13 + iv(r) * 0.20, mean: iv(r) };
    const ax = 0.5 + Math.cos(base) * A.rr, ay = 0.5 + Math.sin(base) * A.rr;
    if (n === 1) return { x: ax, y: ay };
    // Golden-angle spiral around the anchor: throws members in every direction,
    // filling inward and outward alike. Local frame = radial (outward) + tangent.
    const ur = [Math.cos(base), Math.sin(base)];
    const ut = [-Math.sin(base), Math.cos(base)];
    const ang = k * 2.399963;
    const pr = SWELL_GAP * 0.95 * Math.sqrt(k);
    const tan = Math.cos(ang) * pr;
    const rad = Math.sin(ang) * pr + (iv(r) - A.mean) * 0.16;   // hotter => a touch further out
    return { x: ax + ut[0] * tan + ur[0] * rad, y: ay + ut[1] * tan + ur[1] * rad };
  });
  // Collision relaxation — a few deterministic passes that push any two glyphs
  // apart until they stop stacking. Some touch is fine (a crowd should read as a
  // crowd); this only kills the near-exact overlaps the fan can't reach — e.g. a
  // free-placed reaction landing on top of a computed one, or two identical-depth
  // siblings. Deeper glyphs claim a little more room. Everything stays in the disc.
  const halfOf = (r) => 0.05 + iv(r) * 0.045;
  for (let it = 0; it < 26; it++) {
    let moved = false;
    for (let a = 0; a < pts.length; a++) {
      for (let b = a + 1; b < pts.length; b++) {
        let dx = pts[b].x - pts[a].x, dy = pts[b].y - pts[a].y;
        let d = Math.hypot(dx, dy);
        if (d < 0.001) { const ang = a * 2.39996; dx = Math.cos(ang); dy = Math.sin(ang); d = 0.001; }  // exact overlap: split along a stable direction
        const min = (halfOf(arr[a]) + halfOf(arr[b])) * 0.62;
        if (d < min) {
          const push = (min - d) / 2, ux = dx / d, uy = dy / d;
          pts[a].x -= ux * push; pts[a].y -= uy * push;
          pts[b].x += ux * push; pts[b].y += uy * push;
          moved = true;
        }
      }
    }
    for (const p of pts) { const cx = p.x - 0.5, cy = p.y - 0.5, dd = Math.hypot(cx, cy); if (dd > 0.46) { p.x = 0.5 + cx * 0.46 / dd; p.y = 0.5 + cy * 0.46 / dd; } }
    if (!moved) break;
  }
  return pts;
};

// ---- inline close glyph (no icon lib) --------------------------------------
const CloseX = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"
    style={{ stroke: 'currentColor', strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ---- read-ring: the skip mark (read, no note). Empty circle, in-system line
// language. Neutral by default; accent when it's your own row. Roster only. ---
const ReadRing = ({ size = 16, me }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"
    style={{ stroke: me ? 'var(--color-accent)' : 'var(--color-fg-3)', strokeWidth: 1.6, fill: 'none' }}>
    <circle cx="12" cy="12" r="8" />
  </svg>
);

// ---- Skip / Done row -------------------------------------------------------
const RxActions = ({ onSkip, done }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)', width: '100%' }}>
    <button type="button" onClick={onSkip} className="circ-swell-skip"
      style={{ background: 'transparent', border: 0, cursor: 'pointer', minHeight: 44, padding: '8px 12px',
        fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14, color: 'var(--color-fg-3)', borderRadius: 'var(--radius-md)' }}>
      Skip reaction
    </button>
    {done && (
      <button type="button" onClick={done} className="circ-swell-done"
        style={{ background: 'var(--color-accent)', border: 0, cursor: 'pointer', minHeight: 44, padding: '8px 20px',
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--color-fg-inverse, #fff)', borderRadius: 'var(--radius-md)' }}>
        Done
      </button>
    )}
  </div>
);

// ============================================================================
// SwellPad — the INTERACTIVE input surface (drag toward a glyph to react).
// ----------------------------------------------------------------------------
// Drag toward one of five glyphs arranged radially; direction = which glyph,
// distance = how hard it landed. Depth is surfaced WITHOUT transparency or
// gradients — twice over: radial distance from centre AND glyph size (it swells
// as it lands harder), with a soft accent halo for the pull. The five glyphs
// ring the pad (SwellPalette); the puck you drag is a plain handle, so the glyph
// you're choosing is never hidden under your finger.
// ============================================================================
const SwellPad = ({ size, mine, others, live, level, onChange, onDepth, onSubmit, interactive, opts }) => {
  const { centerDot = false, breath = false, snap = false } = opts || {};
  const boxRef = rxRef(null);
  const small = size <= 80;
  const [settling, setSettling] = rxState(false);
  const posToDraft = (clientX, clientY) => {
    const b = boxRef.current.getBoundingClientRect();
    let dx = (clientX - b.left) / b.width - 0.5, dy = (clientY - b.top) / b.height - 0.5;
    let dist = Math.hypot(dx, dy);
    if (dist > SWELL_MAX) { dx *= SWELL_MAX / dist; dy *= SWELL_MAX / dist; dist = SWELL_MAX; }
    return { nx: 0.5 + dx, ny: 0.5 + dy, intensity: Math.min(1, dist / SWELL_MAX), glyph: nearestGlyph(dx, dy, dist) };
  };
  const snapDraft = (d) => {
    const dx = d.nx - 0.5, dy = d.ny - 0.5, dist = Math.hypot(dx, dy);
    if (dist < SWELL_DEAD) return d;
    const ang = Math.atan2(dy, dx);
    let ga = 0, bd = 9;
    for (let k = 0; k < RX_N; k++) { const dd = Math.abs(Math.atan2(Math.sin(ang - glyphAngle(k)), Math.cos(ang - glyphAngle(k)))); if (dd < bd) { bd = dd; ga = glyphAngle(k); } }
    const sx = Math.cos(ga) * dist, sy = Math.sin(ga) * dist;
    return { ...d, nx: 0.5 + sx, ny: 0.5 + sy, glyph: nearestGlyph(sx, sy, dist) };
  };
  const onPointerDown = (e) => {
    if (!interactive) return;
    const el = e.currentTarget;
    try { el.setPointerCapture(e.pointerId); } catch (err) {}
    let last = null;
    const move = (ev) => { setSettling(false); last = posToDraft(ev.clientX, ev.clientY); onChange(last); };
    move(e);
    const up = () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      if (snap && last) { setSettling(true); onChange(snapDraft(last)); setTimeout(() => setSettling(false), 300); }
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  };
  // The pad is the DEPTH slider for the keyboard/AT path: which glyph is chosen
  // lives in the glyph radiogroup (SwellGlyphRadios); here Up/Right go deeper,
  // Down/Left shallower, CLAMPED at the two ends — the top rung does not wrap or
  // reset. Enter/Space commits. Pointer drag (onPointerDown) still sets both axes.
  const onKeyDown = (e) => {
    if (!interactive) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSubmit && onSubmit(); return; }
    let L = level || 1;
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') L = Math.min(3, L + 1);
    else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') L = Math.max(1, L - 1);
    else if (e.key === 'Home') L = 1;
    else if (e.key === 'End') L = 3;
    else return;
    e.preventDefault();
    onDepth && onDepth(L);
  };
  const emoji = (r, isMine, key) => {
    const p = swellPos(r); const fs = swellFontSize(iv(r), small, isMine);
    return (
      <span key={key} title={small ? undefined : rxLabel(r)} style={{
        position: 'absolute', left: (p.x * 100) + '%', top: (p.y * 100) + '%',
        transform: 'translate(-50%,-50%)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isMine && !small && <span style={{ position: 'absolute', width: fs * 1.7, height: fs * 1.7, borderRadius: '50%', background: 'rgba(4,120,87,0.14)' }} />}
        <span style={{ position: 'relative', fontSize: fs, lineHeight: 1 }}>{r.glyph}</span>
      </span>
    );
  };
  const livePuck = () => {
    const lx = live && live.nx != null ? live.nx : 0.5, ly = live && live.ny != null ? live.ny : 0.5;
    const t = live && live.intensity != null ? live.intensity : 0;
    const k = size / 208;
    const puck = (17 + t * 40) * k, halo = (28 + t * 62) * k;
    const breathing = breath && t > 0.5;
    const peak = 1 + Math.max(0, (t - 0.5) / 0.5) * 0.07;
    return (
      <span style={{ position: 'absolute', left: (lx * 100) + '%', top: (ly * 100) + '%', transform: 'translate(-50%,-50%)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', transition: settling ? 'left 300ms var(--ease-quiet), top 300ms var(--ease-quiet)' : 'none' }}>
        <span className={breathing ? 'circ-swell-breath' : undefined} style={{ position: 'absolute', width: halo, height: halo, borderRadius: '50%', background: 'rgba(4,120,87,' + (0.10 + t * 0.18) + ')', '--breath-peak': peak }} />
        <span style={{ position: 'relative', width: puck, height: puck, borderRadius: '50%', background: 'var(--color-accent)', opacity: 0.72 + t * 0.28, border: '2px solid var(--color-surface)', boxShadow: '0 2px 8px rgba(4,120,87,' + (0.2 + t * 0.3) + ')' }} />
      </span>
    );
  };
  return (
    <div ref={boxRef} className={interactive ? 'circ-swell-pad' : undefined}
      tabIndex={interactive ? 0 : undefined} onKeyDown={onKeyDown} onPointerDown={onPointerDown}
      role={interactive ? 'slider' : undefined}
      aria-label={interactive ? 'How deeply it landed' : undefined}
      aria-valuemin={interactive ? 1 : undefined} aria-valuemax={interactive ? 3 : undefined}
      aria-valuenow={interactive ? (level || 1) : undefined}
      aria-valuetext={interactive ? DEPTH_WORDS[(level || 1) - 1] : undefined}
      style={{
        position: 'relative', width: size, height: size, flexShrink: 0,
        background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-1)',
        borderRadius: '50%', touchAction: 'none', cursor: interactive ? 'grab' : 'default',
        backgroundImage: 'radial-gradient(circle, var(--color-border-2) 1px, transparent 1px)',
        backgroundSize: (size / 5) + 'px ' + (size / 5) + 'px', backgroundPosition: 'center',
      }}>
      {!small && !interactive && <span style={{ position: 'absolute', left: '50%', top: '50%', width: 4, height: 4, borderRadius: '50%', background: 'var(--color-border-strong)', transform: 'translate(-50%,-50%)' }} />}
      {interactive && centerDot && (
        <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', width: 5, height: 5, borderRadius: '50%', background: 'var(--color-border-1)', transform: 'translate(-50%,-50%)', pointerEvents: 'none', opacity: (live && live.intensity != null && live.intensity > 0.2) ? 1 : 0, transition: 'opacity 160ms var(--ease-quiet)' }} />
      )}
      {(others || []).map((r, i) => emoji(r, false, 'o' + i))}
      {mine && emoji(mine, true, 'me')}
      {interactive && livePuck()}
    </div>
  );
};

// The five glyphs ring the pad like a dial. As you pull the puck toward one it
// brightens; the further you pull the more it SWELLS. Depth lives on the glyph
// itself, out at the rim — never hidden under your finger.
const SwellPalette = ({ live, box }) => {
  const active = live && live.glyph;
  const t = live && live.intensity != null ? live.intensity : 0;
  const base = box ? Math.max(22, Math.round(box * 0.082)) : 22;
  return RX_GLYPHS.map((g, k) => {
    const a = glyphAngle(k), rr = 0.45, on = active === g;
    const scale = on ? (1 + t * 0.95) : 1;
    return (
      <span key={k} style={{
        position: 'absolute', left: (50 + Math.cos(a) * rr * 100) + '%', top: (50 + Math.sin(a) * rr * 100) + '%',
        transform: 'translate(-50%,-50%) scale(' + scale + ')', transformOrigin: 'center', pointerEvents: 'none',
        fontSize: base, lineHeight: 1, opacity: on ? 1 : 0.3,
        transition: 'opacity 120ms var(--ease-quiet), transform 90ms var(--ease-quiet)',
        filter: on ? 'drop-shadow(0 3px 8px rgba(4,120,87,0.26))' : 'none',
      }}>{g}</span>
    );
  });
};

// ============================================================================
// SwellGlyphRadios — the always-present, accessible glyph picker.
// ----------------------------------------------------------------------------
// A radiogroup of the five glyphs, positioned exactly over SwellPalette's ring
// (transparent 44px hit targets). This is the KEYBOARD/AT path for "which glyph":
// Tab lands in the group; Left/Right (and Up/Down) move across the five and
// select as they go, WRAPPING past the ends (standard radiogroup). The chosen
// glyph drives the same `live` draft the pointer drag writes, so the visible
// palette + puck reflect it. Pointer users can also click a glyph directly.
// The depth (how deep) is the separate slider — the pad itself. Two controls,
// never a 15-stop grid.
// ============================================================================
const SwellGlyphRadios = ({ live, onPick }) => {
  const ref = rxRef(null);
  const idxActive = live && live.glyph ? glyphIndexOf(live.glyph) : -1;
  const focusIdx = (i) => { const el = ref.current && ref.current.querySelector('[data-gi="' + i + '"]'); if (el) el.focus(); };
  const move = (delta) => {
    const cur = idxActive < 0 ? 0 : idxActive;
    const next = (cur + delta + RX_N) % RX_N;
    onPick(RX_GLYPHS[next]);
    requestAnimationFrame(() => focusIdx(next));
  };
  const onKey = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
  };
  return (
    <div ref={ref} role="radiogroup" aria-label="Reaction" onKeyDown={onKey}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {RX_GLYPHS.map((g, k) => {
        const a = glyphAngle(k), rr = 0.45, on = idxActive === k;
        return (
          <button type="button" key={k} data-gi={k} role="radio" aria-checked={on}
            aria-label={glyphName(g)} className="circ-swell-radio"
            tabIndex={on || (idxActive < 0 && k === 0) ? 0 : -1}
            onClick={() => onPick(g)}
            style={{ position: 'absolute', left: (50 + Math.cos(a) * rr * 100) + '%', top: (50 + Math.sin(a) * rr * 100) + '%',
              transform: 'translate(-50%,-50%)', width: 44, height: 44, borderRadius: '50%',
              background: 'transparent', border: 0, padding: 0, cursor: 'pointer', pointerEvents: 'auto', zIndex: 2 }} />
        );
      })}
    </div>
  );
};

// ============================================================================
// SwellScatter — the STATIC review circle (used by reveal AND door modal).
// ----------------------------------------------------------------------------
// Its own renderer (not SwellPad) so it can own selection: tap a glyph to PIN
// its name right on the circle; tap again (or empty space) to clear. Fully
// bidirectional with the roster via a shared `selected` index. `interactive`
// off (reveal) => no tap-to-name, no pin.
// ============================================================================
const SwellScatter = ({ all, size, selected, onSelect, interactive = true }) => {
  const dot = size >= 240 ? 6 : 5;   // centre marker — SAME grey as the ring
  const canPick = interactive;
  const active = selected != null;
  const pts = swellLayout(all);
  return (
    <div onClick={() => onSelect && onSelect(null)}
      style={{ position: 'relative', width: size, height: size, flexShrink: 0, borderRadius: '50%',
        background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-1)',
        backgroundImage: 'radial-gradient(circle, var(--color-border-2) 1px, transparent 1px)',
        backgroundSize: (size / 5) + 'px ' + (size / 5) + 'px', backgroundPosition: 'center' }}>
      <span style={{ position: 'absolute', left: '50%', top: '50%', width: dot, height: dot, borderRadius: '50%', background: 'var(--color-border-1)', transform: 'translate(-50%,-50%)' }} />
      {all.map((r, i) => {
        const p = pts[i], fsz = swellFontSize(iv(r), false, r.name === 'You'), me = r.name === 'You';
        const on = selected === i, dim = active && !on;
        return (
          <div key={i} role={canPick ? 'button' : undefined} tabIndex={canPick ? 0 : undefined}
            className={canPick ? 'circ-swell-glyph' : undefined}
            aria-label={rxAriaLabel(r)}
            onClick={canPick ? (e) => { e.stopPropagation(); onSelect(on ? null : i); } : undefined}
            onKeyDown={canPick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(on ? null : i); } } : undefined}
            style={{ position: 'absolute', left: (p.x * 100) + '%', top: (p.y * 100) + '%',
              width: fsz, height: fsz, transform: 'translate(-50%,-50%) scale(' + (on ? 1.08 : 1) + ')',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%',
              cursor: canPick ? 'pointer' : 'default', opacity: dim ? 0.34 : 1, outline: 'none',
              transition: 'transform var(--duration-fast) var(--ease-quiet), opacity var(--duration-fast) var(--ease-quiet)' }}>
            {me && <span style={{ position: 'absolute', width: fsz * 1.7, height: fsz * 1.7, borderRadius: '50%', background: 'rgba(4,120,87,0.14)' }} />}
            {on && <span style={{ position: 'absolute', inset: -7, borderRadius: '50%', border: '2px solid var(--color-accent)' }} />}
            <span style={{ position: 'relative', fontSize: fsz, lineHeight: 1 }}>{r.glyph}</span>
          </div>
        );
      })}
      {canPick && active && (() => {
        const r = all[selected], p = pts[selected], me = r.name === 'You';
        const below = p.y < 0.26, bg = me ? 'var(--color-accent)' : 'var(--color-fg-1)';
        return (
          <div style={{ position: 'absolute', left: (p.x * 100) + '%', top: (p.y * 100) + '%', zIndex: 5,
            transform: below ? 'translate(-50%,16px)' : 'translate(-50%,calc(-100% - 16px))',
            background: bg, color: '#fff', fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-semibold)', fontSize: 12.5,
            whiteSpace: 'nowrap', padding: '5px 10px', borderRadius: 'var(--radius-md)', pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(10,10,10,0.16)' }}>
            {rxLabel(r)}
            <span style={{ position: 'absolute', left: '50%', [below ? 'top' : 'bottom']: -4, width: 8, height: 8, background: bg, transform: 'translateX(-50%) rotate(45deg)' }} />
          </div>
        );
      })()}
    </div>
  );
};

// ============================================================================
// SwellReview — shared body: header + scatter + roster. Used by BOTH the reveal
// and the door modal so the two surfaces are literally identical. Owns the
// selection shared by scatter + roster. `interactive` off (reveal) => static.
// The disc is sized to the INPUT pad's visible disc so it is the EXACT same
// size across the input, the reveal, and the door modal — the circle never
// resizes or jumps.
// ============================================================================
const SwellReview = ({ all, interactive = true, firstHere = false }) => {
  const [sel, setSel] = rxState(null);
  // Reactions land on the disc + roster; skips are roster-only and always last.
  // Both render in ONE continuous roster flow — a skip is set identically to a
  // reaction (same weight, same wrap), it just carries a ring and comes last.
  const list = all || [];
  const reacted = list.filter(r => !rxIsSkip(r));
  const skipped = list.filter(r => rxIsSkip(r));
  const vw = typeof window !== 'undefined' ? window.innerWidth : 400;
  const narrow = vw < 520;
  const avail = vw - (narrow ? 16 : 48) - (narrow ? 24 : 48);
  // One rule for the disc size everywhere: a single cap, clamped down by whatever
  // width is actually available. No per-breakpoint magic number — a larger mobile
  // cap only inflated the empty circle where content is sparsest.
  const box = Math.round(Math.max(248, Math.min(300, avail)));
  const pad = box - Math.round(box * 0.1389) * 2;
  // Roster fill: a lone chip reads as a little lonely, so chips lift slightly at
  // low counts and settle to base as the roster grows. Kept subtle — a gentle
  // continuous factor into CSS clamp(), not the heavy bump of an earlier pass.
  const rn = reacted.length + skipped.length;
  const rf = 1 + 0.22 * Math.max(0, 1 - (rn - 1) / 3);
  const rowStyle = (accent, dim, on) => ({ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 12px 6px 10px', borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-semibold)', fontSize: 'clamp(14px, calc(14px * var(--rf, 1)), 18px)', whiteSpace: 'nowrap',
    color: accent ? 'var(--color-accent)' : 'var(--color-fg-1)',
    background: on ? 'var(--color-surface-sunken)' : 'transparent', opacity: dim ? 0.4 : 1 });
  return (
    <React.Fragment>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-fg-3)', letterSpacing: '0.04em', marginBottom: 4, textAlign: 'center' }}>the circle</div>
      <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-xl)', color: 'var(--color-fg-1)', margin: '0 0 4px', letterSpacing: '-0.01em', textAlign: 'center' }}>{firstHere ? 'You’re the first one here.' : 'How it landed'}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {/* box+inset reserve the palette's former footprint so the disc holds its position between steps */}
        <div style={{ position: 'relative', width: box, height: box, flexShrink: 0, marginTop: narrow ? 7 : 27 }}>
          <div style={{ position: 'absolute', inset: Math.round(box * 0.1389) }}>
            <SwellScatter all={reacted} size={pad} interactive={interactive} selected={interactive ? sel : null} onSelect={interactive ? (i) => setSel(i) : (() => {})} />
          </div>
        </div>
        {(reacted.length + skipped.length) > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4, width: '100%', '--rf': rf }}>
            {reacted.map((r, i) => {
              const me = r.name === 'You', on = sel === i, dim = sel != null && !on;
              return interactive ? (
                <button key={'r' + i} type="button" className="circ-swell-rrow" aria-label={rxAriaLabel(r)}
                  onClick={() => setSel(on ? null : i)}
                  style={{ ...rowStyle(me || on, dim, on), border: 0, cursor: 'pointer', outline: 'none',
                    transition: 'background var(--duration-fast) var(--ease-quiet), opacity var(--duration-fast) var(--ease-quiet)' }}>
                  <span style={{ fontSize: 'clamp(16px, calc(16px * var(--rf, 1)), 20px)', lineHeight: 1 }}>{r.glyph}</span>
                  {rxLabel(r)}
                </button>
              ) : (
                <div key={'r' + i} style={rowStyle(me, dim, on)} aria-label={rxAriaLabel(r)}>
                  <span style={{ fontSize: 'clamp(16px, calc(16px * var(--rf, 1)), 20px)', lineHeight: 1 }}>{r.glyph}</span>
                  {rxLabel(r)}
                </div>
              );
            })}
            {skipped.map((r, i) => {
              const me = r.name === 'You';
              // Skips carry no disc glyph, so there's nothing to pin — but a
              // keyboard/SR user must still reach every roster member. When the
              // surface is interactive (the door modal) render the row as a
              // button so it's a real tab stop; activating it just clears any
              // pinned disc selection. Reveal (static) keeps the plain div.
              return interactive ? (
                <button key={'s' + i} type="button" className="circ-swell-rrow" aria-label={rxAriaLabel(r)}
                  onClick={() => setSel(null)}
                  style={{ ...rowStyle(me, sel != null, false), border: 0, cursor: 'pointer', outline: 'none',
                    transition: 'background var(--duration-fast) var(--ease-quiet), opacity var(--duration-fast) var(--ease-quiet)' }}>
                  <span style={{ display: 'inline-flex', width: 16, justifyContent: 'center' }}><ReadRing me={me} /></span>
                  {rxLabel(r)}
                </button>
              ) : (
                <div key={'s' + i} style={rowStyle(me, sel != null, false)} aria-label={rxAriaLabel(r)}>
                  <span style={{ display: 'inline-flex', width: 16, justifyContent: 'center' }}><ReadRing me={me} /></span>
                  {rxLabel(r)}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

// ============================================================================
// SwellReviewModal — opened by the door. Interactive, closable (x / Esc / scrim).
// ============================================================================
const SwellReviewModal = ({ item, onClose }) => {
  const closeRef = rxRef(null);
  const panelRef = rxRef(null);
  // Bottom sheet on mobile (incl. the forced-mobile phone frame), centred dialog
  // on desktop — the SAME treatment as the reveal step, so the door modal and the
  // just-reacted reveal read as one surface. The old check keyed off
  // window.innerWidth alone, so inside the phone frame (window > 520) it always
  // fell to the desktop dialog — hence the door never became a sheet.
  const [narrow] = rxState(() => (typeof window !== 'undefined' && window.innerWidth < 520)
    || (typeof document !== 'undefined' && !!document.querySelector('.circ-phone-screen')));
  const { shown, requestClose } = useSheetMount(narrow, onClose);
  // Render at the phone-screen root (or <body> when not framed) instead of buried
  // in the FeedCard. A position:fixed overlay that animates deep inside the
  // scrolled, overflow-clipped feed forces the browser to re-composite the whole
  // scroll layer on the transition — that's the "entire screen erupts" glitch.
  // Portalling puts the door at the SAME shallow DOM depth as the mark-as-read
  // reveal and the Add sheet (both siblings of the feed), which animate cleanly.
  const [portalTarget] = rxState(() => (typeof document !== 'undefined'
    && (document.querySelector('.circ-phone-screen') || document.body)) || null);
  rxEffect(() => lockScroll(), []);
  rxEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') requestClose(); };
    window.addEventListener('keydown', onKey);
    // preventScroll: the sheet mounts at translateY(100%) (offscreen below), so a
    // plain focus() makes the browser scroll the close button into view and heave
    // the whole feed up ~half a viewport, then settle as the sheet slides in —
    // that was the "screen erupts" glitch. Focus without scrolling.
    if (closeRef.current) closeRef.current.focus({ preventScroll: true });
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const all = (item.reactions || []);
  const tight = narrow;
  const tree = (
    <div onClick={(e) => { if (e.target === e.currentTarget) requestClose(); }}
      className={tight ? undefined : 'circ-anim-fade'}
      style={{ position: 'fixed', inset: 0, zIndex: 140, background: 'var(--color-scrim)',
        display: 'flex', justifyContent: 'center', alignItems: tight ? 'flex-end' : 'center',
        padding: tight ? 0 : 16,
        opacity: tight ? (shown ? 1 : 0) : 1,
        transition: tight ? 'opacity var(--duration-slow) ease-in-out' : undefined }}>
      <div role="dialog" aria-modal="true" aria-label="How the circle landed"
        ref={panelRef} onKeyDown={(e) => trapTab(panelRef.current, e)}
        style={tight ? {
          position: 'relative', background: 'var(--color-surface)',
          borderTopLeftRadius: 16, borderTopRightRadius: 16,
          boxShadow: 'var(--shadow-overlay)', width: '100%', maxWidth: 520,
          padding: 'var(--space-5) var(--space-3) calc(var(--space-3) + env(safe-area-inset-bottom, 0px))',
          maxHeight: 'calc(100% - 24px)', overflowY: 'auto', overscrollBehavior: 'contain',
          transform: shown ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform var(--duration-slow) var(--ease-quiet)',
        } : {
          position: 'relative', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)', boxShadow: 'var(--shadow-overlay)',
          width: 348, maxWidth: 420, minWidth: 288,
          maxHeight: '88vh', overflowY: 'auto', overscrollBehavior: 'contain' }}>
        <button ref={closeRef} type="button" onClick={requestClose} aria-label="Close" className="circ-rx-close"
          style={{ position: 'absolute', top: 10, right: 10, width: 36, height: 36, zIndex: 2,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 0, borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--color-fg-3)' }}>
          <CloseX />
        </button>
        <SwellReview all={all} />
      </div>
    </div>
  );
  return portalTarget ? ReactDOM.createPortal(tree, portalTarget) : tree;
};

// ============================================================================
// SwellDoor — the permanent affordance on a Read-tab card.
// ----------------------------------------------------------------------------
// A borderless huddle of up to 3 DISTINCT glyphs (uniform 16px — NO intensity,
// no dominant glyph) + a faint always-on "opens-a-view" cue (arrows-out, NOT a
// caret, because it opens a modal not a dropdown). No box at rest; hover/focus
// shows the card's own sunken pill. NOBODY has read it yet => renders nothing.
// If everyone who read it skipped (no glyphs), the door still renders — glyph
// huddle is empty, just the arrows-out cue — and opens onto the empty disc +
// roster of skips, same as any other circle.
// Place it at the right edge of the attribution row: "added by one, received by
// many." Depth/weight lives inside the modal, never in the door.
// ============================================================================
const swellDoorGlyphs = (all) => {
  const seen = [];
  for (const r of all) { if (r.glyph && !seen.includes(r.glyph)) seen.push(r.glyph); if (seen.length === 3) break; }
  return seen;
};

const SwellDoor = ({ item }) => {
  const [open, setOpen] = rxState(false);
  const all = (item && item.reactions) || [];
  if (all.length === 0) return null;              // nobody has read it yet -> no door
  const glyphs = swellDoorGlyphs(all);             // may be empty — everyone skipped is still shown
  // Everyone who read it skipped: no glyphs to huddle. Show NO stand-in mark —
  // empty circles just read as reactions that failed to render. The arrows-out
  // cue alone carries the door: nothing to preview, only a view to open.
  return (
    <React.Fragment>
      <button type="button" onClick={() => setOpen(true)} className="circ-swell-door"
        aria-label="How the circle landed" aria-haspopup="dialog"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
          border: 0, background: 'transparent', padding: 8, margin: '-8px -8px -8px 0',
          borderRadius: 'var(--radius-md)', flexShrink: 0, minHeight: 44,
          transition: 'background var(--duration-fast) var(--ease-quiet)' }}>
        {glyphs.length > 0 && (
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            {glyphs.map((g, i) => (
              <span key={i} style={{ fontSize: 16, lineHeight: 1, width: 17, height: 17, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: i === 0 ? 0 : -4 }}>{g}</span>
            ))}
          </span>
        )}
        <svg viewBox="0 0 24 24" width={13} height={13} aria-hidden="true"
          style={{ stroke: 'var(--color-fg-3)', strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round', flexShrink: 0 }}>
          <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      </button>
      {open && <SwellReviewModal item={item} onClose={() => setOpen(false)} />}
    </React.Fragment>
  );
};

// ============================================================================
// SwellReactionFlow — the mark-as-read MOMENT.
// ----------------------------------------------------------------------------
// Step 1 (input): drag on the SwellPad to leave a reaction, or Skip. Closable.
// Step 2 (reveal): the SAME SwellReview surface, but PASSIVE — no close button,
//   non-interactive (no tap-to-name), fades on its own after a short hold. Can
//   still be dismissed early by clicking off (scrim) or Esc; there's just no x.
// The circle's SIZE is pinned across the two steps (the disc box is computed by
// ONE identical rule in both steps) — that size constancy is the thing that must
// never break. Position is free:
//   - the modal is CENTRED; as the panel grows for the reveal it re-centres, so
//     the disc may drift vertically. That's fine — only disc RESIZING was ever the
//     problem, never disc movement;
//   - the width is LOCKED across steps (no horizontal snap);
//   - the reveal disc reserves the input pad's footprint and matches its header.
// First reader (react OR skip) => reveal too, headed "You're the first one here.";
//   a skip shows as an empty disc + your read-ring in the roster.
//
// Props: { item, swellOpts, onMarkRead(item, reaction|null), onClose }
//   swellOpts (optional): { centerDot, breath, snap } — input pad flourishes.
// ============================================================================
const SwellReactionFlow = ({ item, swellOpts, onMarkRead, onClose }) => {
  const [step, setStep] = rxState('input');
  const [mine, setMine] = rxState(null);
  const [status, setStatus] = rxState('');
  const others = rxMemo(() => rxOthers(item), [item]);
  const bodyRef = rxRef(null);
  const panelRef = rxRef(null);
  const headingRef = rxRef(null);
  const invokerRef = rxRef(null);
  const [bodyH, setBodyH] = rxState('auto');
  const [clip, setClip] = rxState(false);
  const [fading, setFading] = rxState(false);
  const [vw, setVw] = rxState(typeof window !== 'undefined' ? window.innerWidth : 400);
  // Bottom sheet on mobile (or the forced-mobile phone frame); centred dialog on
  // desktop. narrow must be known before useSheetMount, so it's computed up here.
  const narrow = vw < 520 || (typeof document !== 'undefined' && !!document.querySelector('.circ-phone-screen'));
  const { shown, requestClose } = useSheetMount(narrow, onClose);
  rxEffect(() => lockScroll(), []);
  // Move focus into the dialog on open, to the HEADING — not a glyph — so no
  // reaction looks pre-picked. The first Tab/arrow then enters the glyph ring.
  // preventScroll for the same reason the door modal uses it (sheet mounts below).
  rxEffect(() => {
    invokerRef.current = document.activeElement;
    if (headingRef.current) headingRef.current.focus({ preventScroll: true });
    return () => { if (invokerRef.current && invokerRef.current.focus) invokerRef.current.focus({ preventScroll: true }); };
  }, []);
  rxEffect(() => {
    const on = () => setVw(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  const [swell, setSwell] = rxState({ glyph: null, intensity: null, nx: 0.5, ny: 0.5 });
  const swellTouched = swell.glyph != null;
  // Keyboard/AT path: glyph comes from the radiogroup, depth from the pad slider.
  // Both resolve to a rung on the chosen glyph's spoke, writing the same draft the
  // pointer drag does, so the visible pad + puck stay in sync with either path.
  const inputLevel = levelFromIntensity(swell.intensity != null ? swell.intensity : 0.6);
  // L == null => glyph targeted but no depth chosen yet: park the puck in the
  // dead zone on that glyph's spoke, don't invent an intensity.
  const applyGlyphLevel = (g, L) => {
    const a = glyphAngle(glyphIndexOf(g));
    if (L == null) { setSwell({ glyph: g, intensity: null, nx: 0.5, ny: 0.5 }); return; }
    const r = intensityFromLevel(L) * SWELL_MAX;
    setSwell({ glyph: g, intensity: intensityFromLevel(L), nx: 0.5 + Math.cos(a) * r, ny: 0.5 + Math.sin(a) * r });
  };
  // Moving between glyphs (radiogroup Left/Right) only changes WHICH glyph is
  // targeted — it carries over an already-chosen depth, but never assigns one.
  const pickGlyph = (g) => applyGlyphLevel(g, swell.intensity != null ? inputLevel : null);
  // The depth pad is inert until a glyph is targeted — nothing for depth to apply to.
  const setDepthLevel = (L) => { if (swell.glyph) applyGlyphLevel(swell.glyph, L); };
  const commitSwell = () => commit({ name: 'You', glyph: swell.glyph, intensity: swell.intensity, nx: swell.nx, ny: swell.ny });
  // Skip = read, no note. Still recorded (a glyphless reaction) so you appear in
  // the roster as an empty ring; it just never lands on the disc.
  const commitSkip = () => commit({ name: 'You', skipped: true });

  const commit = (rx) => {
    onMarkRead(item, rx); setMine(rx);
    // Commit feedback for AT (4.1.3): the reveal is aria-hidden, so THIS is what
    // tells a screen-reader user their action worked and where the item went.
    setStatus((rxIsSkip(rx) ? 'Marked as read.' : ('Reaction saved as ' + glyphName(rx.glyph) + ', ' + depthWord(rx) + '.')) + ' Moved to your Read tab.');
    setStep('reveal');   // always reveal — the first reader gets the first-one-here circle too, react or skip
  };

  rxEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') requestClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  // grow/shrink the panel height between steps (width is locked); clip only while easing
  rxLayout(() => { const el = bodyRef.current; if (el) setBodyH(el.scrollHeight); }, [step]);
  rxEffect(() => { setClip(true); const t = setTimeout(() => setClip(false), 340); return () => clearTimeout(t); }, [step]);

  // the reveal is a passive glimpse: it fades on its own
  rxEffect(() => {
    if (step !== 'reveal') return;
    const hold = 5000;
    // Mobile: hold, then slide the sheet away. Desktop: hold, fade content, close.
    if (narrow) { const d = setTimeout(requestClose, hold); return () => clearTimeout(d); }
    const f = setTimeout(() => setFading(true), hold);
    const d = setTimeout(onClose, hold + 480);
    return () => { clearTimeout(f); clearTimeout(d); };
  }, [step]);

  const avail = vw - (narrow ? 16 : 48) - (narrow ? 24 : 48);
  // Same single disc-size rule as the reveal step — keeping these identical is the
  // input→reveal pin. Change one, change both.
  const box = Math.round(Math.max(248, Math.min(300, avail)));
  const inset = Math.round(box * 0.1389);
  const pad = box - inset * 2;
  const tight = narrow;

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) requestClose(); }}
      className={tight ? undefined : 'circ-anim-fade'}
      style={{ position: 'fixed', inset: 0, zIndex: 135, background: 'var(--color-scrim)',
        display: 'flex', justifyContent: 'center',
        alignItems: tight ? 'flex-end' : 'center', padding: tight ? 0 : 16,
        opacity: tight ? (shown ? 1 : 0) : 1,
        transition: tight ? 'opacity var(--duration-slow) ease-in-out' : undefined }}>
      {/* Mobile: bottom sheet (matches AddReveal) — anchored to the bottom, grows
         upward as the panel resizes between steps; the disc drifts up but never
         resizes. Slides in on open, back down on close. Desktop: centred dialog. */}
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label="How did it land?"
        onKeyDown={(e) => trapTab(panelRef.current, e)}
        style={tight ? {
        position: 'relative', background: 'var(--color-surface)',
        borderTopLeftRadius: 16, borderTopRightRadius: 16,
        boxShadow: 'var(--shadow-overlay)', width: '100%', maxWidth: 520,
        padding: 'var(--space-5) var(--space-3) calc(var(--space-3) + env(safe-area-inset-bottom, 0px))',
        maxHeight: 'calc(100% - 24px)', overflowY: 'auto',
        transform: shown ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform var(--duration-slow) var(--ease-quiet)',
      } : {
        position: 'relative', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)', boxShadow: 'var(--shadow-overlay)',
        maxWidth: 420, width: 348, minWidth: 288,
      }}>
        {step === 'input' && (
          <button type="button" onClick={requestClose} aria-label="Close" className="circ-rx-close"
            style={{ position: 'absolute', top: 10, right: 10, width: 36, height: 36, zIndex: 2,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 0, borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--color-fg-3)' }}>
            <CloseX />
          </button>
        )}
        <div role="status" aria-live="polite"
          style={{ position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 }}>{status}</div>
        <div ref={bodyRef} style={{ height: bodyH === 'auto' ? 'auto' : bodyH, overflow: clip ? 'hidden' : 'visible', transition: 'height 300ms var(--ease-quiet)' }}>
          {step === 'input' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 ref={headingRef} tabIndex={-1} style={{ outline: 'none', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-xl)', color: 'var(--color-fg-1)', margin: '0 0 4px', letterSpacing: '-0.01em' }}>How did it land?</h2>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--color-fg-3)', margin: narrow ? '0 0 6px' : '0 0 18px' }}>Your reaction for the circle.</p>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div style={{ position: 'relative', width: box, height: box, margin: narrow ? '2px 0 0' : '10px 0 0' }}>
                  <SwellGlyphRadios live={swell} onPick={pickGlyph} />
                  <div style={{ position: 'absolute', inset }}>
                    <SwellPad size={pad} live={swell} level={inputLevel} interactive opts={swellOpts}
                      onChange={setSwell} onDepth={setDepthLevel} onSubmit={() => { if (swellTouched) commitSwell(); }} />
                  </div>
                  <SwellPalette live={swell} box={box} />
                </div>
                <div style={{ height: narrow ? 10 : 16 }} />
                <RxActions onSkip={commitSkip} done={swellTouched ? commitSwell : null} />
              </div>
            </div>
          ) : (
            <div aria-hidden="true" style={{ opacity: fading ? 0 : 1, transition: 'opacity 460ms var(--ease-quiet)' }}>
              <SwellReview all={[...others, ...(mine ? [mine] : [])]} interactive={false} firstHere={others.length === 0} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { RX_GLYPHS, SwellDoor, SwellReviewModal, SwellReactionFlow });
