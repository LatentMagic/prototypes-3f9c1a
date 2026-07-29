// ============================================================================
// Circlists — Liveliness. One grammar for "something landed", everywhere:
// the app notices arrivals itself → signals quietly → the reader accepts.
//
//   circWhen(at)                  — coarse relative label for a card's time line
//   circDividerIndex(items, mark) — where the New rule sits, or -1
//   CircleSignal                  — the per-circle slot in the rail / home list:
//                                   the micro dot (unseen), the spinner (a manual
//                                   refresh running), or the mark coming to rest
//                                   (a refresh that found nothing).
//   NewPill                       — arrivals in the circle you are IN. Micro dot
//                                   + "New", no count. The click moves the feed;
//                                   the feed never shifts on its own.
//   FeedDivider                   — the frozen last-seen mark: NEW heads the
//                                   arrivals, FeedSeam closes them.
//   circNextDrop(who)             — a simulated arrival (Config / activity only).
//
// Rules this file exists to hold in one place:
//   • No counts, no badges, no toasts, no status colour. The dot means unseen
//     items, never presence.
//   • Sage is the MARK's light, not a status colour — an arriving card washes
//     sage and resolves to its own white (see .circ-arrive in circlists.html).
//     Nothing travels across it, nothing rings it, and the colour never rests.
//   • A refresh that finds nothing answers with the spinner's own arc closing
//     into a complete ring, which then rests a beat and fades. Same mark, one
//     continuous move — never a second mark swapped in, never a tick.
// ============================================================================

// ---- Time ------------------------------------------------------------------
// Coarse on purpose: a reading list is not a timeline. Short enough to sit on the
// attribution line of a 320px card without ever pushing the name out.
const circWhen = (at) => {
  if (!at) return null;
  const mins = Math.round((Date.now() - at) / 60e3);
  if (mins < 5) return 'just now';
  if (mins < 60) return mins + 'm';
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return hrs + 'h';
  const days = Math.round(hrs / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return days + 'd';
  return Math.round(days / 7) + 'w';
};

// ---- Divider position ------------------------------------------------------
// Index of the first item at-or-before the frozen last-seen mark — i.e. how many
// items arrived since the last visit. The rule is drawn above them, and only
// when items sit on BOTH sides: a rule with nothing below it is noise.
const circDividerIndex = (items, mark) => {
  if (!mark || !items || items.length < 2) return -1;
  const i = items.findIndex((it) => !it.at || it.at <= mark);
  return i > 0 && i < items.length ? i : -1;
};

// ---- The circle's signal slot (rail entry / home row) ----------------------
// One slot, three mutually exclusive states, so a circle never carries two
// signals at once. Every state is decorative + a hidden text equivalent.
const CircleSignal = ({ state }) => {
  const { BrandSpinner, MicroDot } = window;
  if (state === 'busy') return (
    <span className="circ-sig" role="status">
      <span aria-hidden="true" style={{ display: 'inline-flex' }}><BrandSpinner size={18} /></span>
      <span className="circ-vh">Refreshing</span>
    </span>
  );
  // Nothing new: the spinner's arc closes to a full ring, rests, and goes.
  if (state === 'settled') return (
    <span className="circ-sig circ-sig-settle" role="status">
      <span aria-hidden="true" style={{ display: 'inline-flex' }}><BrandSpinner size={18} resolving /></span>
      <span className="circ-vh">Up to date</span>
    </span>
  );
  if (state === 'unseen') return (
    <span className="circ-sig">
      <span aria-hidden="true" style={{ display: 'inline-flex' }}><MicroDot size={10} /></span>
      <span className="circ-vh">Unseen links</span>
    </span>
  );
  return null;
};

// ---- New pill --------------------------------------------------------------
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
// The rule HEADS the arrivals: NEW sits above the items that landed since the
// last visit, so the label names the latest rather than the past. FeedSeam then
// closes the group where the already-seen items resume — without it the label
// reads as a header for the whole feed.
const FeedDivider = () => (
  <div className="circ-fdiv" role="separator" aria-label="New since your last visit">
    <span className="circ-fdiv-label">New</span>
  </div>
);

const FeedSeam = () => <div className="circ-fseam" role="presentation" />;

// ---- Simulated arrivals (Config aid / background activity) -----------------
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

Object.assign(window, { circWhen, circDividerIndex, CircleSignal, NewPill, FeedDivider, FeedSeam, circNextDrop });
