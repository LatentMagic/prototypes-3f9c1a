// ============================================================================
// Circlists — brand motion. Three treatments on the static mark; values
// reproduce brand/motion/circlists-motion.md exactly (the spec is the source
// of truth — this does not re-invent tempo, amplitude, or the breath curve).
//   PulseMark    — idle breathing mark (halo breathes + brightens). Rail only.
//   BrandSpinner — the loading state (arc rotates + grows/shrinks). Replaces
//                  the plain ring on every standalone loading view. Rendered at
//                  100px in both product loading states — the in-shell feed load
//                  (app/feed.jsx FeedLoading) and the one app-level full-screen
//                  load (app/primitives.jsx AppLoading, used by auth return /
//                  provisioning / provider handoff alike). The moving part is
//                  the bare sage arc sweeping the surface — there is NO full
//                  static sage disc behind it (a same-colour disc would
//                  camouflage the arc and the spinner would read as a static
//                  dot). Under reduced motion the arc fills to a full sage ring
//                  (see circlists.html).
//   MicroDot     — ~10px live-signal dot. Core (disc + white ring) holds dead
//                  still; a soft sage light-band sweeps across the halo (clipped
//                  to r22.5), painting a ring of sage into view then resting
//                  off-frame — a sweep of light, NOT a breath, because a scale
//                  at this size won't read. The static sage disc is hidden during
//                  motion and revealed only under reduced motion (full resting
//                  mark), mirroring the spinner's static-halo fallback.
// Colours track the brand tokens (sage halo, accent disc), same as LogoMark,
// so they follow the accent Tweak. Animation classes are scoped per-treatment
// (circ-pulse-*, circ-spinner-*, circ-micro-*) since several can be mounted on
// one page at once — the source .svg files can share class names, this can't.
// Keyframes + the shared prefers-reduced-motion override live in circlists.html.
// ============================================================================

const PulseMark = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Circlists"
    style={{ display: 'block', flexShrink: 0, overflow: 'visible' }}>
    <circle className="circ-pulse-halo" cx="24" cy="24" r="22.5" fill="var(--color-sage)" />
    <circle cx="24" cy="24" r="15.2" fill="var(--color-accent)" />
    <circle cx="24" cy="24" r="15.875" fill="none" stroke="#ffffff" strokeWidth="1.35" />
  </svg>
);

const BrandSpinner = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Loading"
    style={{ display: 'block', flexShrink: 0 }}>
    <g className="circ-spinner-rotor">
      <circle className="circ-spinner-arc" cx="24" cy="24" r="19.05" fill="none"
        stroke="var(--color-sage)" strokeWidth="5.3" strokeLinecap="round"
        pathLength="120" strokeDasharray="12 108" />
    </g>
    <circle cx="24" cy="24" r="14.25" fill="var(--color-accent)" />
    <circle cx="24" cy="24" r="14.925" fill="none" stroke="#ffffff" strokeWidth="1.35" />
  </svg>
);

const MicroDot = ({ size = 10 }) => {
  // Unique ids per instance so several live dots on one page don't collide on
  // the clip-path / gradient refs (colons stripped — invalid in url() frags).
  const uid = React.useId().replace(/:/g, '');
  const clipId = `circ-micro-clip-${uid}`;
  const gradId = `circ-micro-band-${uid}`;
  return (
    <svg width={size} height={size} viewBox="-2 -2 52 52" role="img" aria-label="Live"
      style={{ display: 'block', flexShrink: 0 }}>
      <defs>
        <clipPath id={clipId}><circle cx="24" cy="24" r="22.5" /></clipPath>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--color-sage)" stopOpacity="0" />
          <stop offset="0.5" stopColor="var(--color-sage)" stopOpacity="1" />
          <stop offset="1" stopColor="var(--color-sage)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Static sage disc — hidden during motion, shown under reduced motion. */}
      <circle className="circ-micro-halo-static" cx="24" cy="24" r="22.5" fill="var(--color-sage)" />
      <g clipPath={`url(#${clipId})`}>
        <rect className="circ-micro-reveal" x="-32" y="-10" width="26" height="68" fill={`url(#${gradId})`} />
      </g>
      <circle cx="24" cy="24" r="14.25" fill="var(--color-accent)" />
      <circle cx="24" cy="24" r="14.925" fill="none" stroke="#ffffff" strokeWidth="1.35" />
    </svg>
  );
};

// ---- PulseLockup — the rail's mark + wordmark, composed live so the mark can
// animate. The shipped circlists-lockup.svg is a single flattened image (mark
// baked in as static geometry); this reproduces its exact layout instead —
// mark height 1.5x cap-height, gap 0.4x cap-height, mark vertically centred on
// the wordmark's cap-midpoint (brand/circlists-brand.md §4) — using the real
// viewBox/baseline numbers from circlists-wordmark.svg, not an eyeballed guess.
const WORDMARK_CAP_UNITS = 1490;       // cap-height, in the wordmark asset's own units
const WORDMARK_VB_HEIGHT = 2212.05;    // circlists-wordmark.svg viewBox height
const WORDMARK_BASELINE = 2067.33;     // baseline's y in that same viewBox
// Cap-midpoint's position as a fraction of the wordmark asset's own rendered height.
const WORDMARK_CAP_MID_FRAC = (WORDMARK_BASELINE - WORDMARK_CAP_UNITS / 2) / WORDMARK_VB_HEIGHT;

const PulseLockup = ({ size = 20 }) => {
  const cap = size * 0.727;
  const markSize = 1.5 * cap;
  const wordmarkH = cap * (WORDMARK_VB_HEIGHT / WORDMARK_CAP_UNITS);
  // Shift the wordmark image so ITS cap-midpoint lands on the mark's centre,
  // given the mark itself is top-aligned (flex, align-items: flex-start).
  const wordmarkMarginTop = markSize / 2 - WORDMARK_CAP_MID_FRAC * wordmarkH;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', flexShrink: 0 }}>
      <PulseMark size={markSize} />
      <img src="brand/assets/circlists-wordmark.svg" alt="Circlists" style={{
        height: wordmarkH, width: 'auto', display: 'block', flexShrink: 0,
        marginLeft: 0.4 * cap, marginTop: wordmarkMarginTop,
      }} />
    </div>
  );
};

Object.assign(window, { PulseMark, BrandSpinner, MicroDot, PulseLockup });
