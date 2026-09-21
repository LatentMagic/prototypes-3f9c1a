// ============================================================================
// Home's Conversations preview panel — the fork. Replaces window.CircHomeReturns
// (read per render by app/home.jsx), so nothing else in the app is touched.
//
// SOURCE OF TRUTH is app/home-returns.jsx. Carried over unchanged: the union
// (candBarRows per funded circle), the bound (3 circles / 6 rows, newest-first
// across the WHOLE union), the snapshot-while-open hold, the caught-up card,
// and presence-is-the-whole-of-its-state. What this file redesigns is only how
// a row reads and how the circle is carried.
//
// ROUND TWO (2026-09-21). Three corrections from the user's read of round one:
//   — THE HEAD CARRIES INTENT, NOT NAMES. Names have always been a subpoint;
//     promoted to the head they read as a header of people. And once every row
//     says who spoke, a head repeating it is duplication. So the head says what
//     the panel IS, with no count (CIRC-034: the home raises none) — and the
//     wording is a lever, not a decision taken here.
//   — THE CHEVRON IS BACK. Dropping it broke consistency with the in-circle
//     bar's rows, which carry one (governance standards/ui-design.md: an
//     affordance that recurs looks identical wherever it appears). It costs the
//     title ~26px; the alternative is dropping it from the in-circle bar too,
//     which is a bigger change than this rig is scoped to.
//   — THE RUN IS GONE. Rejected outright.
// ============================================================================
const PGH_CARD = { background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-raised)', overflow: 'hidden', marginBottom: 22 };
const PGH_BAR = { width: 3, height: 22, borderRadius: 2, flexShrink: 0 };
// One height, clipped never wrapped (CIRC-034). Every text span in a row takes
// this, so a long title or a long circle name cannot change a row's height.
const PGH_CLIP = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const PGH_TITLE = { display: 'block', font: '600 var(--text-base)/1.35 var(--font-sans)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)', ...PGH_CLIP };
const PGH_METAF = '500 var(--text-sm)/1.35 var(--font-sans)';
const PGH_META = { display: 'block', font: PGH_METAF, color: 'var(--color-fg-3)', marginTop: 3, ...PGH_CLIP };
// With a separator between rows the gap goes to nothing, so the row's own
// padding is the whole of the air around the line — 11px, which keeps the 48px
// floor and reads even above and below the rule.
const PGH_ROW = { display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', background: 'transparent', border: 0, cursor: 'pointer', minHeight: 48, padding: '11px 8px 11px 10px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)' };

// The union, then the bound. Same two steps as home-returns.jsx, with the kept
// rows returned in their newest-first order — nothing groups any more.
const pghUnion = (spaces) => {
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

const pghBound = (spaces, flat) => {
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

// Frozen the same way home-returns.jsx freezes: title, whether it was titled,
// who spoke — with the circle carried alongside.
const pghSnap = (kept) => kept.map((r) => {
  const s = candBarSnap([r.item])[0];
  return { ...s, circleId: r.circleId, circleName: r.circleName };
});

// A title set in mono where the conversation has no title of its own (a URL
// stands in for it) — the shipped treatment, kept verbatim.
const PghTitleText = ({ row }) => (
  <span style={row.titled ? {} : { font: '600 12.5px/1.45 var(--font-mono)' }}>{row.title}</span>
);

// ---- 1 · the meta line ---------------------------------------------------
// The title has line one to itself — which is the whole point at 320px — and
// line two carries the circle and the people together, because both are
// metadata about the same conversation. The circle leads and holds its width;
// the names take the ellipsis, since a partial list of names still reads as a
// list of names while half a circle name reads as nothing.
const PghMeta = ({ row }) => (
  <React.Fragment>
    <span style={PGH_TITLE}><PghTitleText row={row} /></span>
    <span style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 3, font: PGH_METAF, color: 'var(--color-fg-3)' }}>
      <span style={{ flexShrink: 0 }}>{row.circleName}</span>
      <span aria-hidden="true" style={{ flexShrink: 0 }}>&middot;</span>
      <span style={{ flex: 1, minWidth: 0, ...PGH_CLIP }}>{candNames(row.who)}</span>
    </span>
  </React.Fragment>
);

// ---- 2 · the tail --------------------------------------------------------
const PghTail = ({ row }) => (
  <React.Fragment>
    <span style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
      <span style={{ ...PGH_TITLE, flex: 1, minWidth: 0 }}><PghTitleText row={row} /></span>
      <span style={{ flexShrink: 0, font: PGH_METAF, color: 'var(--color-fg-3)' }}>{row.circleName}</span>
    </span>
    <span style={PGH_META}>{candNames(row.who)}</span>
  </React.Fragment>
);

// ---- 3 · the subline -----------------------------------------------------
const PghSubline = ({ row }) => (
  <React.Fragment>
    <span style={PGH_TITLE}><PghTitleText row={row} /></span>
    <span style={PGH_META}>{row.circleName}</span>
  </React.Fragment>
);

// ---- 4 · unsaid ----------------------------------------------------------
const PghUnsaid = ({ row }) => (
  <React.Fragment>
    <span style={PGH_TITLE}><PghTitleText row={row} /></span>
    <span style={PGH_META}>{candNames(row.who)}</span>
  </React.Fragment>
);

const PGH_BODIES = { meta: PghMeta, tail: PghTail, subline: PghSubline, unsaid: PghUnsaid };

const PghHomeReturns = ({ spaces, open, onToggle, onEnterSpace }) => {
  const opt = usePGH();
  const [held, setHeld] = React.useState(null);
  const live = React.useMemo(() => {
    const flat = pghUnion(spaces);
    return { flat, ...pghBound(spaces, flat) };
  }, [spaces]);

  // The hold, and its one guard: never on the initial mount, or a staged demo
  // state that lands the panel open snapshots the pre-staged circles and never
  // refreshes (home-returns.jsx carries the whole reasoning).
  const mounted = React.useRef(false);
  React.useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (open) setHeld({ rows: pghSnap(live.kept), leftover: live.leftover });
    else setHeld(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const rows = open && held ? held.rows : pghSnap(live.kept);
  const leftover = open && held ? held.leftover : live.leftover;
  const Body = PGH_BODIES[opt] || PghMeta;

  const enter = (row) => {
    onEnterSpace(row.circleId);
    const C = window.CircCandidate;
    if (C && C.goToCard) C.goToCard({ id: row.id });
  };

  // The caught-up state stays a REPORT inside the same card — the section says
  // what is true rather than vanishing, and its height does not change between
  // states. One source of truth for the predicate, as before.
  if (!rows.length) {
    return (
      <div style={PGH_CARD}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 56, padding: '10px 14px' }}>
          <span aria-hidden="true" style={{ ...PGH_BAR, background: 'var(--color-border-1)' }} />
          <span style={{ flex: 1, minWidth: 0, font: '600 var(--text-base)/1.35 var(--font-sans)', color: 'var(--color-fg-1)', ...PGH_CLIP }}>You&rsquo;re caught up.</span>
        </div>
      </div>
    );
  }

  return (
    <div style={PGH_CARD}>
      <button type="button" onClick={() => onToggle(!open)} aria-expanded={open} className="circ-menuitem"
        style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 56, padding: '0 12px 0 14px',
          background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left' }}>
        <span aria-hidden="true" style={{ ...PGH_BAR, background: 'var(--color-sage)' }} />
        <span style={{ flex: 1, minWidth: 0, font: '600 var(--text-base)/1.35 var(--font-sans)', color: 'var(--color-fg-1)', ...PGH_CLIP }}>{window.pghHead()}</span>
        <span aria-hidden="true" style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--color-fg-2)', transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform var(--duration-base) var(--ease-quiet)' }}>
          <Icon name="chevron-down" size={16} />
        </span>
      </button>
      {open && (
        <div style={{ borderTop: '1px solid var(--color-border-2)', padding: '6px 6px 8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {rows.map((r, i) => (
              <React.Fragment key={r.id}>
                {/* BETWEEN rows, and only between them. This is where the shipped
                    panel goes wrong: it puts `borderTop` on every row including
                    the first, so a hairline lands a few pixels under the card's
                    own head seam and the two read as one smudged double rule —
                    which is the "strange, only semi-opaque lines" in the user's
                    read. The in-circle bar carries the same bug and gets fixed
                    there if this ratifies; it is not copied here.
                    Inset to the text, not full-bleed, so it belongs to the list
                    rather than cutting the card in half. */}
                {i > 0 && <span role="separator" style={{ height: 1, margin: '0 10px', background: 'var(--color-border-2)' }} />}
                <button type="button" className="circ-menuitem" style={PGH_ROW}
                  aria-label={opt === 'unsaid' ? undefined : r.title + ' — ' + r.circleName} onClick={() => enter(r)}>
                  <span style={{ flex: 1, minWidth: 0 }}><Body row={r} /></span>
                  {/* The in-circle bar's rows carry this, so these do too. */}
                  <Icon name="chevron-right" size={16} color="var(--color-fg-3)" />
                </button>
              </React.Fragment>
            ))}
          </div>
          {leftover && (
            <p style={{ margin: 0, padding: '10px 10px 2px', font: '400 var(--text-xs)/1.4 var(--font-sans)', color: 'var(--color-fg-3)' }}>More in the circles below.</p>
          )}
        </div>
      )}
    </div>
  );
};

Object.assign(window, { PghHomeReturns });
