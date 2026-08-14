// ============================================================================
// Circlists — Liveliness. One grammar for "something landed", everywhere:
// the app notices arrivals itself → signals quietly → the reader accepts. When
// the MEMBER asked (the rail refresh), what it finds simply lands.
//
//   circWhen(at)                  — the card's AGE: how long ago it was contributed
//   circDividerIndex(items, mark) — where the waterline sits, or -1
//   CircleSignal                  — the per-circle slot in the rail / home list:
//                                   the micro dot (unseen), the spinner (the refresh
//                                   receipt running), or the mark it resolves into.
//   NewPill                       — arrivals in the circle you are IN, on Active.
//                                   Micro dot + "New", no count. The click moves the
//                                   feed; the feed never shifts on its own.
//   FeedDivider                   — the waterline: where the last visit ended.
//                                   Labelled EARLIER, so it names the pile below it.
//   CircGlow                      — the two newness treatments, each with one
//                                   trigger: the glow (any card above the waterline,
//                                   when it comes INTO VIEW) and the travel (accepting
//                                   the pill alone).
//   circNextDrop(who)             — a simulated arrival (the timed check / Config).
//
// Rules this file exists to hold in one place:
//   • No counts, no badges, no toasts, no status colour. The dot means unseen
//     items, never presence.
//   • Sage is the MARK's light, not a status colour — an arriving card washes
//     sage and resolves to its own white (see .circ-glow in circlists.html).
//     Nothing travels across it, nothing rings it, and the colour never rests.
//   • The receipt resolves into the full mark on BOTH outcomes: the spinner's own
//     arc grows shut into a complete ring as the rotation eases to a halt, rests a
//     beat, then leaves. Never a tick, never a second mark, never words — the
//     gesture's one announcement ("Refreshed") is raised in main.jsx.
//   • Newness is never carried by the glow alone: position against the waterline
//     and the card's age both still say it after the glow resolves.
// ============================================================================

// ---- Age -------------------------------------------------------------------
// Coarse on purpose: a reading list is not a timeline. Short enough to sit on the
// attribution line of a 320px card without ever pushing the name out.
//
// The ladder, elapsed → label:  <5m "just now" · 5–59m "5m…59m" · 1–23h "1h…23h"
// · 1–6d "1d…6d" · 1–4w "1w…4w" · 1–11mo "1mo…11mo" · a year and beyond "1y", "2y"…
// Always relative — it answers how fresh, never when exactly. Bands FLOOR, so a
// label never claims a unit that has not fully elapsed (ninety-five minutes reads
// "1h"). Units: m minutes, mo months, y years — no collisions. The years rung has
// no cap. Computed from the item's contribution timestamp at render; never stored.
const circWhen = (at) => {
  if (!at) return null;
  const mins = Math.floor((Date.now() - at) / 60e3);
  if (mins < 5) return 'just now';
  if (mins < 60) return mins + 'm';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + 'h';
  const days = Math.floor(hrs / 24);
  if (days < 7) return days + 'd';
  if (days < 30) return Math.floor(days / 7) + 'w';
  if (days < 365) return Math.max(1, Math.floor(days / 30.44)) + 'mo';
  return Math.floor(days / 365) + 'y';
};

// ---- Waterline position ----------------------------------------------------
// Index of the first item at-or-before the DRAWN mark — i.e. how many items
// arrived since the last visit. The line is drawn above them, and only when items
// sit on BOTH sides: a line with nothing below it names nothing.
const circDividerIndex = (items, mark) => {
  if (!mark || !items || items.length < 2) return -1;
  const i = items.findIndex((it) => !it.at || it.at <= mark);
  return i > 0 && i < items.length ? i : -1;
};

// ---- The circle's signal slot (rail entry / home row) ----------------------
// One slot, three mutually exclusive states, so a circle never carries two
// signals at once. On the Read tab the receipt runs first and the dot takes the
// slot once it has resolved — that ordering is this precedence, in shell.jsx.
//
// The receipt states are decorative only. They say nothing to a screen reader:
// the gesture gets exactly one announcement, "Refreshed", from main.jsx, and a
// second "loading" would be the feed speaking twice.
const CircleSignal = ({ state }) => {
  const { BrandSpinner, MicroDot } = window;
  if (state === 'busy') return (
    <span className="circ-sig" aria-hidden="true">
      <span style={{ display: 'inline-flex' }}><BrandSpinner size={18} /></span>
    </span>
  );
  // The receipt resolving: the SAME arc closes to a full ring, rests, and goes.
  if (state === 'settled') return (
    <span className="circ-sig circ-sig-settle" aria-hidden="true">
      <span style={{ display: 'inline-flex' }}><BrandSpinner size={18} resolving /></span>
    </span>
  );
  // The dot reports a state, so it is readable without sight: the hidden text
  // ADDS to the circle's name ("Book club, new items") rather than replacing it,
  // which would break voice control's match on the visible name.
  if (state === 'unseen') return (
    <span className="circ-sig">
      <span aria-hidden="true" style={{ display: 'inline-flex' }}><MicroDot size={10} /></span>
      <span className="circ-vh">, new items</span>
    </span>
  );
  return null;
};

// ---- New pill --------------------------------------------------------------
// Announced by the live region in main.jsx, which is already sitting in the page
// empty — a region inserted together with its text announces nothing.
const NewPill = ({ onClick }) => {
  const { MicroDot } = window;
  return (
    <button type="button" className="circ-newpill" onClick={onClick}>
      <span aria-hidden="true" style={{ display: 'inline-flex' }}><MicroDot size={9} /></span>
      New
    </button>
  );
};

// ---- Feed divider ----------------------------------------------------------
// The waterline: it sits where the last visit ended, BELOW the arrivals. A word
// on that boundary is read as a header for what follows it, so the label names
// the past — "Earlier" — and never claims the new cards above. No count, no
// arrow, no affordance, and nothing closing off the items beneath it.
//
// Expressed as a labelled member of the feed's own sequence, not a separator
// laid across it — role="separator" is invalid inside a list (a list may only
// contain list items), so it can't survive the feed carrying list semantics.
// role="listitem" holds the same label and stays valid either way: inert, not
// focusable, closes off nothing.
const FeedDivider = () => (
  <div className="circ-fdiv" role="listitem" aria-label="Earlier — before your last visit">
    <span className="circ-fdiv-label">Earlier</span>
  </div>
);

// ---- The two newness treatments -------------------------------------------
// glow — any card above the waterline, fresh loads included. It waits until the
//        card is actually IN the member's view, so it is never spent behind
//        something they are not looking at, and it plays once per visit.
// rise — the brief upward settle. Accepting the pill alone: the only moment a
//        card inserts into a feed the member is already watching.
// Under prefers-reduced-motion the card does not travel and the glow still plays
// (the CSS keeps circ-glow alive and drops circ-rise).
const CircGlow = ({ glow, rise, children }) => {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    if (!glow || inView) return;
    const el = ref.current;
    if (!el) return;
    // A card already on screen at load has to glow on that first paint, so its
    // position is measured directly on the next frame rather than waiting for an
    // observer callback that a not-yet-composited document may not deliver.
    const raf = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < (window.innerHeight || 0)) setInView(true);
    });
    if (typeof IntersectionObserver !== 'function') return () => cancelAnimationFrame(raf);
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { setInView(true); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [glow, inView]);
  const cls = ((glow && inView) ? 'circ-glow ' : '') + (rise ? 'circ-rise' : '');
  return <div ref={ref} className={cls || undefined}>{children}</div>;
};

// ---- Simulated arrivals (the timed check / Config staging) ------------------
// Real URLs with real extracted metadata, same shape seedSpaces() produces, so
// an arrival is indistinguishable from a seeded card once it lands.
const CIRC_DROPS = [
  { url: 'https://www.newyorker.com/books/page-turner/the-quiet-novel-revival', title: 'The Quiet Novel Revival', source: 'The New Yorker' },
  { url: 'https://go.dev/blog/errors-are-values', title: 'Errors Are Values: Handling Failure the Go Way', source: 'The Go Blog', image: 'uploads/card-previews/blog-overreacted.png' },
  { url: 'https://longreads.com/2026/01/the-long-walk-home/', title: 'The Long Walk Home', source: 'Longreads' },
  { url: 'https://jvns.ca/blog/2026/02/dns-resolvers/', title: 'How DNS Resolvers Actually Work', source: 'Julia Evans' },
  { url: 'https://sqlite.org/whentouse.html', title: 'Appropriate Uses For SQLite', source: 'SQLite' },
  { url: 'https://danluu.com/percentile-latency/', title: 'How to Measure Latency, and Why the Percentiles Matter', source: null, hasImage: false, faviconExists: false },
];
let circDropN = 0;
const circNextDrop = (who) => {
  const meta = CIRC_DROPS[circDropN % CIRC_DROPS.length];
  circDropN += 1;
  return { ...window.CircSeed.IT(meta.url, 'Added by ' + (who || 'Sam R.'), false, []), ...meta, at: Date.now() };
};

Object.assign(window, { circWhen, circDividerIndex, CircleSignal, NewPill, FeedDivider, CircGlow, circNextDrop });
