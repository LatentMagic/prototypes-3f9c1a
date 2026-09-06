// ============================================================================
// Circlists — the cross-circle returns strip (feed-enhancement candidate build,
// BIZ-136). Home's own conversation surface: the union of every funded circle's
// returns bar (app/talk-return.jsx's candBarRows), grouped under the circle's
// name, so a member sees what has words waiting for them WITHOUT stepping into
// each circle first. See MOBILE.md → "Home: chrome today, a surface later":
// this is the content that flips that test — it exists nowhere else (not the
// rail, not any one circle's own bar), so home stops being chrome and becomes a
// shared surface the moment this mounts. It renders from the SAME CirclesHome
// body every posture already shares, so the promotion needs no per-posture fork.
//
// GRAMMAR, reused from talk-return.jsx exactly rather than reinvented:
//   — collapsed head/subline construction (the count line is the bar's own
//     ratified wording, carried over verbatim)
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
// worth of groups and 6 rows total, chosen newest-first across the WHOLE union
// (not per circle) — a circle with older talk can be squeezed out entirely by
// two circles with fresher talk. Rows that make the cut are then grouped by
// circle in `spaces`' own order (listSpaces' order), never re-sorted by recency
// for display — the bound decides WHICH rows show, not what order they read in.
//
// Opening a row is two writes, in order: enterSpace(circleId) first, THEN
// window.CircCandidate.goToCard — the card route reads the CURRENT circle via
// api.currentId at render time, so entering the wrong circle first would open
// the right card in the wrong one.
//
// DELETABLE AID: guarded at its one render site in app/home.jsx
// (`window.CircHomeReturns &&`), so deleting this file takes the whole
// "Conversations" register with it — heading, strip and caught-up card alike —
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
// in both groups and breach the cap — unreachable, and worth stating rather than
// leaving as an unwritten precondition.
//
// The bound: at most 3 circles' worth of groups, at most 6 rows total, chosen
// from the newest-first union above. Returns { groups, leftover } where groups
// preserve `spaces`' own order (never re-sorted by recency — that ordering
// already did its job deciding what to KEEP) and leftover is true when the
// union held more than the cap let through.
const candCrossBounded = (spaces, flat) => {
  const circleOrder = (spaces || []).map((s) => s.id);
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
  const groups = circleOrder
    .filter((id) => keptCircles.has(id))
    .map((id) => ({
      circleId: id,
      circleName: (flat.find((r) => r.circleId === id) || {}).circleName,
      rows: flat.filter((r) => r.circleId === id && keptIds.has(r.item.id)).map((r) => r.item),
    }));
  return { groups, leftover };
};

// A row, frozen the same way candBarSnap freezes one — title, whether it was
// titled, and who spoke — with the circle carried alongside so the grouping
// survives the snapshot too.
const candCrossSnap = (groups) => groups.map((g) => ({
  circleId: g.circleId, circleName: g.circleName,
  rows: candBarSnap(g.rows),
}));

const CircHomeReturns = ({ spaces, open, onToggle, onEnterSpace }) => {
  const [held, setHeld] = React.useState(null);
  const live = React.useMemo(() => {
    const flat = candCrossRows(spaces);
    return { flat, ...candCrossBounded(spaces, flat) };
  }, [spaces]);

  // Frozen when the member OPENS the panel — never on the initial mount, even
  // though the panel now lands open (ruling 97). Freezing on mount was wrong and
  // only driving it showed why: the app stages `?state=` in an effect AFTER
  // mount, so a snapshot taken at mount captures the pre-staged circles and then
  // never refreshes, because `open` never flips again. The crowded state rendered
  // five rows over two circles instead of six over three, and nothing errored —
  // the panel was faithfully showing a world that had already been replaced.
  // The hold is meant to stop a turn landing MID-VIEW from moving rows; it was
  // never meant to outrank the data the screen was opened on.
  const mounted = React.useRef(false);
  React.useEffect(() => {
    // The leftover flag is frozen WITH the rows, not read live beneath them. The
    // panel's contract is that nothing moves while it is open; a leftover line
    // recomputed from live data could appear or vanish under a row list that by
    // contract cannot change, which is the same inconsistency the snapshot exists
    // to prevent. Latent rather than reachable today — nothing on the home
    // mutates the union while the panel is open — and fixed anyway, because the
    // next thing that can mutate it will not come with a note.
    if (!mounted.current) { mounted.current = true; return; }
    if (open) setHeld({ groups: candCrossSnap(live.groups), leftover: live.leftover });
    else setHeld(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const groups = open && held ? held.groups : candCrossSnap(live.groups);
  const leftover = open && held ? held.leftover : live.leftover;
  const n = groups.reduce((sum, g) => sum + g.rows.length, 0);

  // The caught-up state is rendered HERE, inside the same card, rather than by
  // the caller in place of this component. Two reasons, and the second is the
  // one that matters. (1) The design review measured the old shape and called
  // it a labelled void: an eyebrow over a bare grey caption where a white card
  // had been, which reads as "the thing that belongs here is missing" rather
  // than as arrival. Keeping the card, the rule and the head's own weight makes
  // it a REPORT — the section says what is true instead of vanishing, and its
  // height stops changing between states. (2) The caller previously computed
  // its own `anyFresh` to decide between this component and a caption, so one
  // predicate lived in two places; if they had ever disagreed the result was a
  // heading with nothing beneath it, which is exactly the headless-group defect
  // that got through every check one run ago. One source of truth now.
  if (n === 0) {
    return (
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-raised)', overflow: 'hidden', marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 56, padding: '10px 14px' }}>
          <span aria-hidden="true" style={{ width: 3, height: 22, borderRadius: 2, background: 'var(--color-border-1)', flexShrink: 0 }} />
          <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ font: '600 14px/1.35 var(--font-sans)', color: 'var(--color-fg-1)' }}>You&rsquo;re caught up.</span>
            <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>Nothing new on the cards you are watching.</span>
          </span>
        </div>
      </div>
    );
  }

  const names = [];
  groups.forEach((g) => g.rows.forEach((r) => r.who.forEach((who) => { if (!names.includes(who)) names.push(who); })));
  // The count line is the bar's own ratified wording (app/talk-return.jsx),
  // carried over verbatim — the one place this screen names a number.
  const head = open ? 'Pick one to open its conversation'
    : n + (n === 1 ? ' conversation' : ' conversations') + ' you are watching';
  const sub = candNames(names) + ' spoke';
  const toggle = () => onToggle(!open);

  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-raised)', overflow: 'hidden', marginBottom: 22 }}>
      <button type="button" onClick={toggle} aria-expanded={open} className="circ-menuitem"
        style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 56, padding: '0 12px 0 14px',
          background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left' }}>
        <span aria-hidden="true" style={{ width: 3, height: 22, borderRadius: 2, background: 'var(--color-sage)', flexShrink: 0 }} />
        <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: '600 14px/1.35 var(--font-sans)', color: 'var(--color-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{head}</span>
          <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--color-fg-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</span>
        </span>
        <span aria-hidden="true" style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--color-fg-2)', transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform var(--duration-base) var(--ease-quiet)' }}>
          <Icon name="chevron-down" size={16} />
        </span>
      </button>
      {open && (
        <div style={{ borderTop: '1px solid var(--color-border-2)', padding: '4px 6px 6px' }}>
          {groups.map((g) => (
            <div key={g.circleId}>
              {/* The circle's own name, once, over its rows — never repeated on
                  each row beneath it. This is the slice's one rule: flatten it
                  and the strip stops answering "which circle is this in". */}
              {/* Darker and heavier than the rows it governs. The design review
                  measured the first attempt: the circle name was SMALLER than
                  and the same grey as the subline beneath it, so the organising
                  spine was the faintest thing in the component. Things earns
                  the right to drop per-row labels precisely because its group
                  header is the heaviest thing in its band; without that weight
                  the move is structural on paper and invisible on screen. */}
              <h3 style={{ margin: 0, padding: '10px 8px 4px', font: '600 13px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>{g.circleName}</h3>
              {g.rows.map((r) => (
                <button key={r.id} type="button" className="circ-menuitem"
                  onClick={() => {
                    onEnterSpace(g.circleId);
                    const C = window.CircCandidate;
                    if (C && C.goToCard) C.goToCard({ id: r.id });
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                    background: 'transparent', border: 0, cursor: 'pointer', minHeight: 48, padding: '7px 8px', borderRadius: 'var(--radius-md)',
                    borderTop: '1px solid var(--color-border-2)' }}
                  data-cand-listrow="">
                  <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ font: r.titled ? '600 13.5px/1.35 var(--font-sans)' : '600 12.5px/1.45 var(--font-mono)', color: 'var(--color-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</span>
                    <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--color-fg-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candNames(r.who)}</span>
                  </span>
                  <Icon name="chevron-right" size={16} color="var(--color-fg-3)" />
                </button>
              ))}
            </div>
          ))}
          {leftover && (
            <p style={{ margin: 0, padding: '10px 10px 6px', font: '400 12px/1.4 var(--font-sans)', color: 'var(--color-fg-3)' }}>More in the circles below.</p>
          )}
        </div>
      )}
    </div>
  );
};

Object.assign(window, { CircHomeReturns });
