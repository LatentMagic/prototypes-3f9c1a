// ============================================================================
// Circlists — the cross-circle returns strip.
// Home's own conversation surface: the union of every funded circle's
// returns bar (app/talk-return.jsx's candBarRows), so a member sees what has
// words waiting for them WITHOUT stepping into each circle first. See
// MOBILE.md → "Home: chrome today, a surface later": this is the content that
// flips that test — it exists nowhere else (not the rail, not any one circle's
// own bar), so home stops being chrome and becomes a shared surface the moment
// this mounts. It renders from the SAME CirclesHome body every posture already
// shares, so the promotion needs no per-posture fork.
//
// COMPOSITION, ratified 2026-09-21 (LM-652; the study is
// docs/specs/lm-652-discourse/playground-circle-attribution/, the reasoning
// note-2026-09-21-home-conversations-preview.md). The first build grouped rows
// under a heading per circle and headed the card with a count. It was judged
// bloated, and the rework is four decisions:
//
//   1. THE HEAD CARRIES INTENT, AND NO COUNT. One line, identical open and
//      shut: "Conversations you are watching". The count went because CIRC-034
//      is explicit that the home "raises no count of links, arrivals or unread
//      items anywhere", and this head was the last one on the screen. Who spoke
//      went because every row now says it — a head repeating the rows reads as
//      a header of people, and names have always been a subpoint here.
//   2. THE CIRCLE LIVES ON THE ROW'S METADATA LINE, not in a heading and not on
//      the title line. A row is its title, then "Backend Pod · Marcus T. and
//      Lena P." Both facts are metadata about the same conversation, so both
//      belong on the metadata line; the title gets line one to itself, which is
//      what makes the row survive 320px. The circle leads and holds its width,
//      the names take the ellipsis — a partial list of names still reads as a
//      list of names, where half a circle name reads as nothing.
//      The heading-per-circle went with it: three headings over six rows is
//      structure the panel cannot afford, and grouping also fought the strip's
//      own freshest-first order.
//   3. SEPARATORS SIT BETWEEN ROWS AND NOWHERE ELSE. The rejected build put
//      `borderTop` on every row, so a hairline landed a few pixels under the
//      card's own head seam and the two read as one smudged double rule. Inset
//      to the text rather than full-bleed, so the rule belongs to the list
//      instead of cutting the card in half.
//   4. THE ROW KEEPS ITS CHEVRON, matching the in-circle bar's rows — an
//      affordance that recurs looks identical wherever it appears (governance
//      standards/ui-design.md). Note this is the deliberate exception to
//      app/home.jsx's 2026-09-09 ruling for the circle rows BENEATH the panel:
//      those rows lost their chevron because nothing else on the screen carried
//      one; these rows have a twin inside every circle, and matching it wins.
//
// GRAMMAR, reused from talk-return.jsx exactly rather than reinvented:
//   — the union itself (candBarRows per circle) and candBarSnap's freezing
//   — open-state snapshot-while-open (`held`): what the panel draws is frozen
//     at the moment it opened; a turn landing while it is open moves nothing
//     until the member collapses and reopens it
//   — presence is the whole of its state: no dismiss, no mark-read — a row
//     leaves only because the card behind it was read
// NOT reused: the arrival/removal choreography. That grammar exists because
// entering/leaving a CIRCLE is navigation the per-circle bar has to react to;
// landing on home has no such transition to play — "a change of circle is
// navigation, not the bar coming or going" extends here to "landing on home
// takes the strip's state as it stands, unanimated."
//
// BOUNDED: the union multiplies across circles, so it is capped at 3 circles'
// worth of rows and 6 rows total, chosen newest-first across the WHOLE union
// (not per circle) — a circle with older talk can be squeezed out entirely by
// two circles with fresher talk. The bound decides WHICH rows show; they then
// read in that same newest-first order, which is what the strip claims to be.
//
// Opening a row is two writes, in order: enterSpace(circleId) first, THEN
// window.CircCandidate.goToCard — the card route reads the CURRENT circle via
// api.currentId at render time, so entering the wrong circle first would open
// the right card in the wrong one.
//
// DELETABLE AID: guarded at its one render site in app/home.jsx
// (`window.CircHomeReturns &&`), so deleting this file takes the whole
// "Conversations" register with it — heading and strip alike —
// and leaves the circles list standing. It does NOT revert the whole build: the
// circle row's wording change (`circleSummary`, app/home.jsx) is a direct edit
// to that file and survives this file's deletion. Saying "exactly as before"
// would be a contract this file cannot keep.
// ============================================================================

// Every fresh row across every FUNDED circle the member is in, newest-first,
// each carrying which circle it belongs to. candBarRows() itself does not know
// about `funded` (it is handed one space at a time in the per-circle bar); the
// cross-circle union is exactly where that check has to live, since a card
// behind a dormant circle's paywall is a dead end, not a return.
const candCrossRows = (spaces) => {
  const flat = [];
  (spaces || []).filter((s) => s.funded).forEach((s) => {
    candBarRows(s).forEach((item) => {
      const at = Math.max(...candFresh(item).map((t) => t.at));
      flat.push({ circleId: s.id, circleName: s.name, item, at });
    });
  });
  flat.sort((a, b) => b.at - a.at);
  return flat;
};

// Assumes item ids are unique across circles, which the seed guarantees (they
// are minted from Math.random). Two circles holding one id would render that row
// twice and breach the cap — unreachable, and worth stating rather than leaving
// as an unwritten precondition.
//
// The bound: at most 3 circles' worth of rows, at most 6 rows total, taken from
// the newest-first union above. Returns { kept, leftover }; leftover is true
// when the union held more than the cap let through.
const candCrossBounded = (spaces, flat) => {
  const keptIds = new Set();
  const keptCircles = new Set();
  let leftover = false;
  for (const row of flat) {
    if (keptIds.size >= 6) { leftover = true; break; }
    if (!keptCircles.has(row.circleId) && keptCircles.size >= 3) { leftover = true; continue; }
    keptCircles.add(row.circleId);
    keptIds.add(row.item.id);
  }
  if (!leftover && flat.length > keptIds.size) leftover = true;
  return { kept: flat.filter((r) => keptIds.has(r.item.id)), leftover };
};

// A row, frozen the same way candBarSnap freezes one — title, whether it was
// titled, and who spoke — with the circle carried alongside so the row can name
// it after the snapshot is taken.
const candCrossSnap = (kept) => kept.map((r) => ({
  ...candBarSnap([r.item])[0], circleId: r.circleId, circleName: r.circleName,
}));

// One height per row, clipped never wrapped (CIRC-034: "a circle name or roster
// line longer than its row is clipped rather than wrapped, so every row keeps
// one height") — so no title or circle name can change a row's height.
const CROSS_CLIP = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const CROSS_HEAD = { font: '600 var(--text-base)/1.35 var(--font-sans)', color: 'var(--color-fg-1)', ...CROSS_CLIP };
const CROSS_METAF = '500 var(--text-sm)/1.35 var(--font-sans)';
// Sizes are the scale's own (`--text-base` / `--text-sm`), one step under the
// circle cards beneath (`--text-md`) so the preview reads as subordinate to the
// circles it previews.
const CROSS_ROW = { display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
  background: 'transparent', border: 0, cursor: 'pointer', minHeight: 48, padding: '11px 8px 11px 10px',
  borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)' };

const CircHomeReturns = ({ spaces, open, onToggle, onEnterSpace }) => {
  const [held, setHeld] = React.useState(null);
  const live = React.useMemo(() => {
    const flat = candCrossRows(spaces);
    return { flat, ...candCrossBounded(spaces, flat) };
  }, [spaces]);

  // Frozen when the member OPENS the panel — never on the initial mount. That
  // guard matters even though the panel lands collapsed by default, because a
  // staged demo state can still land it open: the app stages `?state=` in an
  // effect after mount, so a snapshot taken at mount captures the pre-staged
  // circles and then never refreshes, because `open` never flips again. The
  // crowded state rendered five rows instead of six, and nothing errored — the
  // panel was faithfully showing a world that had already been replaced. The
  // hold is meant to stop a turn landing MID-VIEW from moving rows; it was never
  // meant to outrank the data the screen was opened on.
  const mounted = React.useRef(false);
  React.useEffect(() => {
    // The leftover flag is frozen WITH the rows, not read live beneath them. The
    // panel's contract is that nothing moves while it is open; a leftover line
    // recomputed from live data could appear or vanish under a row list that by
    // contract cannot change, which is the same inconsistency the snapshot exists
    // to prevent.
    if (!mounted.current) { mounted.current = true; return; }
    if (open) setHeld({ rows: candCrossSnap(live.kept), leftover: live.leftover });
    else setHeld(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const rows = open && held ? held.rows : candCrossSnap(live.kept);
  const leftover = open && held ? held.leftover : live.leftover;

  // No conversation waiting means no preview AT ALL — no card, no caption, no
  // eyebrow (the heading is guarded in app/home.jsx by CircHomeReturns.any,
  // this module's own predicate, so the section cannot become a heading with
  // nothing beneath it). Ruled 2026-09-21: home says nothing when there is
  // nothing to say, because the circle rows beneath already report their own
  // state. The earlier "You're caught up." card was a report nobody needed
  // twice. Its cost is that the section's height now changes between states;
  // that is the accepted trade, not an oversight.
  if (!rows.length) return null;

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-raised)', overflow: 'hidden', marginBottom: 22 }}>
      <button type="button" onClick={() => onToggle(!open)} aria-expanded={open} className="circ-menuitem"
        style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 56, padding: '0 12px 0 14px',
          background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left' }}>
        <span aria-hidden="true" style={{ width: 3, height: 22, borderRadius: 2, background: 'var(--color-sage)', flexShrink: 0 }} />
        {/* Evergreen and stateless: the line is true on the first read and the
            two-hundredth, and it does not change when the panel opens — opening
            changes the list, and nothing else. */}
        <span style={{ flex: 1, minWidth: 0, ...CROSS_HEAD }}>Conversations you are watching</span>
        <span aria-hidden="true" style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--color-fg-2)', transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform var(--duration-base) var(--ease-quiet)' }}>
          <Icon name="chevron-down" size={16} />
        </span>
      </button>
      {open && (
        <div style={{ borderTop: '1px solid var(--color-border-2)', padding: '3px 6px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {rows.map((r, i) => (
              <React.Fragment key={r.id}>
                {i > 0 && <span role="separator" style={{ height: 1, margin: '3px 0', background: 'var(--color-border-2)' }} />}
                <button type="button" className="circ-menuitem" style={CROSS_ROW}
                  aria-label={r.title + ' — ' + r.circleName}
                  onClick={() => {
                    onEnterSpace(r.circleId);
                    const C = window.CircCandidate;
                    if (C && C.goToCard) C.goToCard({ id: r.id });
                  }}>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    {/* No title: the address IS the name, set in mono as the card
                        sets it (app/feed.jsx) — one treatment for a title-less
                        link wherever it is named. */}
                    <span style={{ display: 'block', font: r.titled ? '600 var(--text-base)/1.35 var(--font-sans)' : '600 12.5px/1.45 var(--font-mono)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)', ...CROSS_CLIP }}>{r.title}</span>
                    <span style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 3, font: CROSS_METAF, color: 'var(--color-fg-3)' }}>
                      <span style={{ flexShrink: 0 }}>{r.circleName}</span>
                      <span aria-hidden="true" style={{ flexShrink: 0 }}>&middot;</span>
                      <span style={{ flex: 1, minWidth: 0, ...CROSS_CLIP }}>{candNames(r.who)}</span>
                    </span>
                  </span>
                  <Icon name="chevron-right" size={16} color="var(--color-fg-3)" />
                </button>
              </React.Fragment>
            ))}
          </div>
          {leftover && (
            <p style={{ margin: 0, padding: '9px 10px 6px', font: '400 var(--text-xs)/1.4 var(--font-sans)', color: 'var(--color-fg-3)' }}>More in the circles below.</p>
          )}
        </div>
      )}
    </div>
  );
};

// The section's own predicate, so the caller can drop the eyebrow in the same
// breath the strip drops its card. One source of truth: it is the same
// bound-and-filtered list the render uses, not a second reading of the data.
CircHomeReturns.any = (spaces) => {
  const flat = candCrossRows(spaces);
  return candCrossBounded(spaces, flat).kept.length > 0;
};

Object.assign(window, { CircHomeReturns });
