// ============================================================================
// Circlists — History and paging (LM-786).
//
//   circPreHorizon(space, item)  — a card from before the member's Horizon.
//   circInActive(space, item)    — the one test for "this card is in Active":
//                                  not done, and not from before the Horizon.
//   circHistoryItems(space, all) — what History holds under the switch.
//   IncludeActiveRow             — "Include cards in Active", the first row of
//                                  the view-options panel's Display group
//                                  (History only).
//   FeedPageFoot                 — the list's foot while older cards remain:
//                                  an invisible sentinel, the loading mark, or
//                                  the failed-load foot. Shared by both tabs.
//   HistoryEnd                   — History's end line, in the waterline's style.
//
// Droppable: main.jsx reads every one of these off `window`. Absent, History
// holds only done cards, nothing pages, and no end line draws — which is also
// how a candidate-build entry that does not load this file behaves.
// ============================================================================

// A page, in cards. A prototype value, small enough that the seeded circles
// cross a page boundary by scrolling on both tabs.
const CIRC_PAGE_SIZE = 8;
// How long a staged fetch takes. Long enough to read as a fetch.
const CIRC_PAGE_DELAY = 800;

// The Horizon is a circle-level fact about the member: the point their time in
// the circle is counted from. Cards before it never enter Active; they sit in
// History drawn as Unread cards, tick and all, with nothing marking the join.
const circPreHorizon = (space, item) => !!(space && space.horizon && item && item.at && item.at < space.horizon);
const circInActive = (space, item) => !item.read && !circPreHorizon(space, item);
const circHistoryItems = (space, items, includeActive) => (includeActive
  ? items
  : items.filter((i) => !circInActive(space, i)));

// ---- The switch row ---------------------------------------------------------
// First in Display (option 2, lm-786 option board, ratified 2026-09-24). It
// takes Order/View's grid: the label in the group-label voice (LensLabel's
// size, weight and colour), its right edge on the trays' right edge. No
// heading and no rule of its own. It hides nothing the member chose to hide,
// so it never lights the trigger or makes a chip. CandSwitch is the Add
// surface's switch, reused as ruled.
const IncludeActiveRow = ({ on, onChange }) => {
  const Sw = window.CandSwitch;
  if (!Sw) return null;
  return (
    <div style={{ padding: '6px 10px 2px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 44, padding: '0 2px' }}>
        <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-fg-2)' }}>Include cards in Active</span>
        <Sw on={on} onChange={onChange} label="Include cards in Active" />
      </div>
    </div>
  );
};

// ---- The foot ---------------------------------------------------------------
// idle    — a 1px sentinel. When it scrolls into view the next page is asked
//           for; nothing asks for a tap. Re-observed after each page lands, so
//           a foot still in view keeps loading until the list outgrows it.
// loading — the feed's own loading mark, small. No skeleton, no words.
// failed  — two lines. The loaded cards stay above it. Try again fetches that
//           page once; nothing retries on its own.
const FeedPageFoot = ({ status = 'idle', onNeed, onRetry }) => {
  const ref = React.useRef(null);
  const needRef = React.useRef(onNeed);
  needRef.current = onNeed;
  React.useEffect(() => {
    if (status !== 'idle') return undefined;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) needRef.current && needRef.current();
    }, { rootMargin: '0px 0px 240px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [status]);
  if (status === 'loading') {
    return (
      <div role="status" style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
        {window.BrandSpinner ? <window.BrandSpinner size={32} /> : null}
      </div>
    );
  }
  if (status === 'failed') {
    return (
      <div role="status" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2, padding: '8px 16px 0' }}>
        <p style={{ margin: 0, font: '400 14px/1.5 var(--font-sans)', color: 'var(--color-fg-2)' }}>Couldn’t load older cards.</p>
        <button type="button" onClick={onRetry} className="circ-doorlink circ-pagefoot-retry">Try again</button>
      </div>
    );
  }
  return <div ref={ref} aria-hidden="true" style={{ height: 1 }} />;
};

// ---- History's end line -----------------------------------------------------
// The waterline's own class: a word and a hairline, inert, undated, uncounted.
// The word names what is reached at the foot, so it follows the order, as the
// waterline's does: newest first, the foot is the circle's start; oldest first,
// the foot is the present.
const HistoryEnd = ({ newestFirst = true }) => {
  const label = newestFirst ? 'Start of the circle' : 'Up to now';
  return (
    <div className="circ-fdiv circ-fdiv-end" role="listitem" aria-label={label}>
      <span className="circ-fdiv-label">{label}</span>
    </div>
  );
};

// ---- History's empty state -------------------------------------------------
// `allActive`: the switch is off and every card the circle holds is in Active,
// so History has nothing to show while holding everything.
const HISTORY_EMPTY_COPY = {
  empty: { primary: 'Nothing here.', supporting: 'What you mark as done stays here. Only your list changes.' },
  allActive: { primary: 'Nothing here.', supporting: 'Everything in this circle is still waiting for you in Active.' },
};

Object.assign(window, {
  CIRC_PAGE_SIZE, CIRC_PAGE_DELAY, circPreHorizon, circInActive, circHistoryItems,
  IncludeActiveRow, FeedPageFoot, HistoryEnd, HISTORY_EMPTY_COPY,
});
