// ============================================================================
// Card-metadata playground v3 — data + the extraction/defaulting cascade.
// Narrowed from v2's ten options to the two families that survived review:
// Thumb-right and List-dense. Everything flows through resolve(seed, cfg).
// window.PG3.
//
// v3 changes from v2:
//  - Down to 4 rail entries: two Thumb-right nuances, two List-dense nuances.
//    They differ in WHERE attribution lives — not something config expresses.
//  - New config levers: image side (L/R), favicon placement, favicon fallback
//    (none vs monogram), HR (the real app's hairline) on/off.
//  - URL is hidden by default (title + domain carry identity); only a failed
//    extraction falls back to the URL as headline.
//  - Source is ALWAYS sans now — no mono switch for a bare domain.
// ============================================================================
const PG3 = {};

// ---- Seed feed — identical coverage to v2; both stress cards now carry a real
// preview so long-title / long-URL are testable WITH an image (and the "No
// images" lever still shows them text-only).
PG3.SEED = [
  { key: 'news', by: 'Marcus T.',
    url: 'https://newsletter.pragmaticengineer.com/p/the-software-engineering-industry-in-2024',
    title: 'The Software Engineering Industry in 2024',
    source: 'The Pragmatic Engineer', hasImage: true,
    image: 'uploads/card-previews/pragmatic-engineer.jpg' },
  { key: 'repo', by: 'Priya N.',
    url: 'https://github.com/facebook/react',
    title: 'facebook/react — The library for web and native user interfaces',
    source: 'GitHub', hasImage: true,
    image: 'uploads/card-previews/github-react.png' },
  { key: 'video', by: 'Marcus T.',
    url: 'https://www.youtube.com/watch?v=LKtk3HCgTa8',
    title: 'Simple Made Easy — Rich Hickey',
    source: 'YouTube', hasImage: true,
    image: 'uploads/card-previews/youtube-maxres.jpg' },
  { key: 'post', by: 'Priya N.',
    url: 'https://overreacted.io/a-complete-guide-to-useeffect/',
    title: 'A Complete Guide to useEffect',
    source: 'overreacted', hasImage: true,
    image: 'uploads/card-previews/blog-overreacted.png' },
  { key: 'blog', by: 'Sam R.',
    url: 'https://danluu.com/percentile-latency/',
    title: 'How to measure latency, and why the percentiles matter',
    source: null, hasImage: false },                 // title, but no publication + no image
  { key: 'longtitle', by: 'Priya N.',
    url: 'https://martinfowler.com/articles/patterns-of-distributed-systems/',
    title: 'Patterns of Distributed Systems: A Field Guide to Consensus, Replication, Partitioning and the Trade-offs Every Backend Engineer Eventually Runs Into',
    source: 'Martin Fowler', hasImage: true,
    image: 'uploads/card-previews/blog-overreacted.png' },   // stress: very long title, WITH image
  { key: 'longurl', by: 'Sam R.',
    url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/configuring-request-payment-buckets-requester-pays-example-walkthrough.html',
    title: 'Using Requester Pays buckets for S3 storage transfers',
    source: 'AWS Documentation', hasImage: true,
    image: 'uploads/card-previews/youtube-hqdefault.jpg' },   // stress: very long URL, WITH image
  { key: 'longurlfail', by: 'Marcus T.',
    url: 'https://www.retailer.example.com/products/category/electronics/audio/headphones/over-ear/model-xz-900-active-noise-cancelling?ref=homepage_carousel&utm_source=newsletter&utm_medium=email&utm_campaign=summer_sale_2026&variant=midnight-black&sessionId=a1b2c3d4e5f6g7h8',
    title: null, source: null, hasImage: true,
    image: 'uploads/card-previews/youtube-maxres.jpg' },   // stress: no title -> exceptionally long URL becomes the headline, beside a thumb
  { key: 'fail', by: 'You.',
    url: 'https://notes.hstaszewski.io/2026-03-11-migration-log',
    title: null, source: null, hasImage: false },     // nothing came back (also the faviconless host)
];

PG3.hostOf = (url) => {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch (e) { return String(url).replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]; }
};
// Real favicon, loaded live by the browser (not the sandbox) — no file needed.
PG3.faviconUrl = (host) => `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`;

// Hosts that genuinely return NO favicon. (The live favicon service hands back
// a generic globe for unknown domains — that globe is itself a fabricated
// favicon.) Two reserved example hosts + danluu: a minimal plain-HTML site with
// no publication metadata (source falls back to its domain), the kind that ships
// no favicon either. The metadata-rich hosts legitimately have one.
PG3.NO_FAVICON = ['notes.hstaszewski.io', 'retailer.example.com', 'danluu.com'];

// ---- The one derivation. Everything — the seeded feed, a freshly-added link,
// and the pending stand-in — flows through build(); resolve()/settleCard()/
// makePending() only decide what to feed it.
PG3.build = ({ url, title, source, hasImage, image, by }) => {
  const host = PG3.hostOf(url);
  const domain = host;
  const sourceKnown = !!source;
  const sourceName = source || domain;               // Source is ALWAYS present
  const isYou = by === 'You.';
  const who = String(by).replace(/\.$/, '');
  const faviconExists = !PG3.NO_FAVICON.includes(host);
  return {
    url, prettyUrl: url.replace(/^https?:\/\//, ''),
    attribution: 'Added by ' + by, who, isYou, avatarName: isYou ? 'Sam Rivera' : who,
    title, domain, sourceName, sourceKnown, failed: !title,
    hasImage: !!hasImage, image: hasImage ? (image || null) : null,
    faviconExists, faviconUrl: PG3.faviconUrl(host),
    letter: (sourceName[0] || '?').toUpperCase(),
    trace: {
      title: title ? 'extracted' : 'none',
      source: sourceKnown ? 'publication' : 'domain',
      image: hasImage ? 'preview' : 'none',
      favicon: faviconExists ? 'found' : 'none',
    },
  };
};

// Seeded feed. cfg.extraction forces the outcome so the whole feed can walk the
// fallback cascade at once (As seeded / No images / Total fail).
PG3.resolve = (seed, cfg) => {
  let { title, source, hasImage } = seed;
  if (cfg.extraction === 'noimage') hasImage = false;
  if (cfg.extraction === 'fail') { title = null; source = null; hasImage = false; }
  return { key: seed.key, ...PG3.build({ url: seed.url, title, source, hasImage, image: seed.image, by: seed.by }) };
};

// ---- Async add — the loading choreography (BIZ-80 delta) -------------------
// Metadata extraction is slow + unreliable, so add never blocks on it. A newly
// added link appears IMMEDIATELY as a PENDING card (URL stands in as the title;
// source + image render as quiet skeletons). Extraction then resolves async and
// settleCard() fills the SAME card in place, to one of three terminal states:
// success+image, success+no-image, or the failure floor (URL-as-title).
PG3.deriveTitle = (url) => {
  try {
    const seg = (new URL(url).pathname.split('/').filter(Boolean).pop() || '')
      .replace(/\.(html?|php|aspx?)$/i, '').replace(/[-_]+/g, ' ').trim();
    if (!seg || /^\d+$/.test(seg) || seg.length < 3) return null;
    return seg.charAt(0).toUpperCase() + seg.slice(1);
  } catch (e) { return null; }
};
PG3.PREVIEWS = [
  'uploads/card-previews/pragmatic-engineer.jpg', 'uploads/card-previews/github-react.png',
  'uploads/card-previews/youtube-maxres.jpg', 'uploads/card-previews/blog-overreacted.png',
];
PG3.pickPreview = (seed) => { let h = 0; const s = String(seed); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return PG3.PREVIEWS[h % PG3.PREVIEWS.length]; };

// Believable stand-ins the add popover prefills — one per terminal state.
PG3.ADD_EXAMPLES = {
  image:   { url: 'https://www.smashingmagazine.com/2026/01/css-container-queries-guide/', title: 'A Complete Guide to CSS Container Queries', source: 'Smashing Magazine', image: 'uploads/card-previews/blog-overreacted.png' },
  noimage: { url: 'https://danluu.com/simple-cache/', title: 'A cache that survives restarts', source: null, image: null },
  fail:    { url: 'https://notes.hstaszewski.io/2026-04-11-migration-log', title: null, source: null, image: null },
};

// Pending stand-in: URL as title, source + image reserved as skeletons. hasImage
// stays true so the media slot is HELD and the settle fills it with no reflow.
PG3.makePending = (url) => ({ ...PG3.build({ url, title: null, source: null, hasImage: true, image: null, by: 'You.' }), pending: true });

// The async result. outcome drives the terminal state; a matching example keeps
// its authored metadata, otherwise the title is derived from the path.
PG3.settleCard = (url, outcome) => {
  const host = PG3.hostOf(url);
  const ex = Object.values(PG3.ADD_EXAMPLES).find((e) => PG3.hostOf(e.url) === host);
  if (outcome === 'fail') return PG3.build({ url, title: null, source: null, hasImage: false, image: null, by: 'You.' });
  const title = (ex && ex.title) || PG3.deriveTitle(url) || host;
  const source = (ex && ex.source) || null;          // null -> bare domain
  if (outcome === 'noimage') return PG3.build({ url, title, source, hasImage: false, image: null, by: 'You.' });
  const image = (ex && ex.image) || PG3.pickPreview(url);
  return PG3.build({ url, title, source, hasImage: true, image, by: 'You.' });
};

// ---- The 4 directions. Both families are thumb-beside-text; the image side is
// a config lever, not baked per option. They differ in where attribution sits.
PG3.OPTIONS = [
  { id: 1, name: 'Thumb right — two-row', family: 'thumb',
    desc: 'Source line, then title. Attribution + tick in a foot below the rule.' },
  { id: 2, name: 'Thumb right — title-led', family: 'thumb',
    desc: 'Title leads; source and “added by” fuse into one meta line beneath it.' },
  { id: 3, name: 'List dense — fused', family: 'dense',
    desc: 'Tightest: tiny preview, clamped title, one meta line. Actions on hover.' },
  { id: 4, name: 'List dense — foot', family: 'dense',
    desc: 'Dense body, but attribution + actions keep the real app’s footer.' },
];

window.PG3 = PG3;
