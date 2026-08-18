// ============================================================================
// Liveliness playground — data. The cards are the REAL product cards, so the
// items are the REAL seed fixtures: app/seed-data.jsx's seedSpaces() gives the
// same URLs, titles, sources, preview images and favicons the app demo runs on.
// This file only adds what liveliness needs on top: an `at` timestamp per item
// (never displayed — it exists so the last-seen divider can be computed) and
// the per-circle divider mark.
// ============================================================================
const PGL_USER = window.CircSeed.DEFAULT_USER;
const PGL_T = Date.now();
const PGL_H = 3600e3;

// The three circles the playground runs on — the real seed's first three spaces
// (the TEST fixtures are left out; they exist to stage reaction shapes).
const PGL_SPACE_IDS = ['sp-backend', 'sp-book', 'sp-sam'];
// Where each circle's frozen last-seen mark sits: how many of its unread items
// count as "new since your last visit". Sunday-style return visit = 2.
const PGL_NEW_COUNT = { 'sp-backend': 2, 'sp-book': 0, 'sp-sam': 0 };

// Terse relative label — micro text on the card, so it stays short enough for a
// 320px card: "just now", "2h", "yesterday", "3d", "2w".
const pglWhen = (at) => {
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

const pglBuildCircles = () => {
  const spaces = window.CircSeed.seedSpaces(PGL_USER.email)
    .filter((s) => PGL_SPACE_IDS.includes(s.id));
  return spaces.map((s) => {
    // Newest first, spaced 5h apart: the feed order the app already renders.
    const active = s.items.filter((i) => !i.read).map((it, n) => {
      const at = PGL_T - (n * 5 + 1) * PGL_H;
      return { ...it, at, when: pglWhen(at) };
    });
    const read = s.items.filter((i) => i.read).map((it, n) => {
      const at = PGL_T - (8 + n * 22) * 24 * PGL_H / 24;
      return { ...it, at, when: pglWhen(at) };
    });
    const n = PGL_NEW_COUNT[s.id] || 0;
    // The mark sits just after the n-th item, so exactly n items read as new.
    const dividerAt = active.length > n
      ? (active[n].at + (n > 0 ? active[n - 1].at : PGL_T)) / 2
      : PGL_T - 200 * PGL_H;
    return { id: s.id, name: s.name, items: active, read, dividerAt, unseen: false, pending: [], queued: [] };
  });
};

const PGL_CIRCLES = pglBuildCircles();

// Drops — real URLs with real extracted metadata, same shape the seed produces.
const PGL_DROPS = [
  { url: 'https://www.newyorker.com/books/page-turner/the-quiet-novel-revival', title: 'The Quiet Novel Revival', source: 'The New Yorker' },
  { url: 'https://longreads.com/2026/01/the-long-walk-home/', title: 'The Long Walk Home', source: 'Longreads' },
  { url: 'https://go.dev/blog/errors-are-values', title: 'Errors Are Values: Handling Failure the Go Way', source: 'The Go Blog', image: 'uploads/card-previews/blog-overreacted.png' },
  { url: 'https://jvns.ca/blog/2026/02/dns-resolvers/', title: 'How DNS Resolvers Actually Work', source: 'Julia Evans' },
  { url: 'https://danluu.com/percentile-latency/', title: 'How to Measure Latency, and Why the Percentiles Matter', source: null, hasImage: false, faviconExists: false },
  { url: 'https://sqlite.org/whentouse.html', title: 'Appropriate Uses For SQLite', source: 'SQLite' },
];
let pglDropN = 0;
const pglNextDrop = (who) => {
  const meta = PGL_DROPS[pglDropN % PGL_DROPS.length];
  pglDropN += 1;
  return { ...window.CircSeed.IT(meta.url, 'Added by ' + who, false, []), ...meta, at: Date.now(), when: 'just now' };
};

// Divider position: index of the first item at-or-before the frozen last-seen
// mark. Rendered only when items sit on BOTH sides — a rule with nothing above
// it is noise, not a signal.
const pglDividerIndex = (items, dividerAt) => {
  const i = items.findIndex((it) => it.at <= dividerAt);
  return i > 0 && i < items.length ? i : -1;
};

Object.assign(window, { PGL_CIRCLES, PGL_USER, pglNextDrop, pglDividerIndex });
