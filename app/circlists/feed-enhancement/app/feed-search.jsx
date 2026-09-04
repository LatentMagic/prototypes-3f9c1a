// ============================================================================
// Circlists — Search (BIZ-136, candidate build. NOT ratified.)
//
//   circSearchMatch(item, query)   — does one item match every word in query?
//   circFilterSearch(items, query) — the view-only narrowing. Never mutates,
//                                     same contract as feed-sort.jsx /
//                                     feed-lens.jsx / feed-saved.jsx's own
//                                     view functions.
//   SearchTrigger                  — the 44×44 icon button for the tab bar.
//   SearchField                    — the field itself, rendered inside the
//                                     chip row (feed-lens.jsx's LensChips),
//                                     never the tab bar.
//
// THE INDEX RULE, verbatim, because it is the whole design of this file: search
// indexes exactly the text the card displays — the headline, the source line,
// and the contributor label. Its promise is "find what you saw". Nothing that
// is not on the card is indexed: no description/og text, no body text, no
// contributor framing note.
//
// THIS FILE FIRST GOT ITS OWN RULE WRONG, and the correction is the reason the
// helpers below are shaped as they are. It indexed `item.url` unconditionally,
// defending it as "the URL IS the headline on a card whose metadata never
// resolved". True for those cards, false for every other one: feed.jsx renders
// the raw URL ONLY when there is no title. So `https` matched every card in
// the circle, and `bliki` matched a card displaying "On Naming Things You
// Later Regret" — text the member could not see, which is precisely the test
// the rule was chosen for.
//
// So the index is computed from the SAME expressions feed.jsx renders from,
// rather than from a hopeful list of fields:
//   headline    = item.title || feedDeriveTitle(url) || url-minus-protocol
//                 (feed.jsx: `item.title || feedDeriveTitle(item.url)`, falling
//                  back to `prettyUrl`)
//   source line = item.source || feedHostOf(url)
//                 (feed.jsx: `item.source || host` — so the DOMAIN is indexed
//                  exactly when it is the thing on screen, and not when a
//                  publication name has replaced it)
// If feed.jsx ever changes how a card is headed, this must change with it —
// they are one rule expressed twice, and the second copy is the liability.
//
// NO RELEVANCE SCORING. The caller keeps the list's own order, exactly as
// circFilterItems / circFilterSaved do. Matching is ALL-words: every
// whitespace-separated word in the query must substring-match at least one
// indexed field (not necessarily the same field for every word), case-
// insensitively. A query that is empty or whitespace-only leaves the list
// untouched — same no-op contract as the other two view functions.
//
// A DELETABLE AID, same idiom as feed-lens.jsx / feed-saved.jsx: absent,
// main.jsx's `window.circFilterSearch` / `window.SearchTrigger` /
// `window.SearchField` guards all fall through and the Read tab behaves
// exactly as it did before this file existed — no trigger, no field, no
// filter. FeedNoMatch (feed-lens.jsx) degrades the same way: with this file
// gone, a query is never set, and its four search branches never fire.
// ============================================================================

// Both defer to feed.jsx's own helpers where they exist — feed.jsx loads first
// (circlists.html), and a `const` at the top level of a classic script is
// visible to every script after it, which is how `Icon` already reaches here.
// The inline fallbacks exist only so this file is still correct if it is ever
// loaded alone; they mirror feed.jsx exactly.
const circSearchHost = (url) => {
  if (typeof feedHostOf === 'function') return feedHostOf(url);
  try { return new URL(url).hostname.replace(/^www\./i, ''); }
  catch (e) { return String(url || '').replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]; }
};

// The headline the CARD shows, not a guess at it. Order matters and is
// feed.jsx's: an authored title wins; failing that a title derived from the
// path; failing that the address itself, minus its protocol, exactly as
// feed.jsx's `prettyUrl` renders it.
const circSearchHeadline = (item) => {
  const url = String((item && item.url) || '');
  if (item && item.title) return item.title;
  const derived = (typeof feedDeriveTitle === 'function') ? feedDeriveTitle(url) : null;
  if (derived) return derived;
  return url.replace(/^https?:\/\//, '');
};

// The source line the CARD shows: the publication name where one resolved,
// otherwise the host. Never both — when a card says "Martin Fowler" the domain
// is not on screen, so it is not in the index.
const circSearchSource = (item) => (item && item.source) || circSearchHost(item && item.url);

// Every optional field is guarded (`|| ''`) before it is matched — `title`
// and `source` are frequently absent (see seed-data.jsx's own SEED_META), and
// an ungated `undefined` reaching `.toLowerCase()` would throw for exactly the
// bare-URL cards this feature most needs to find.
const circSearchMatch = (item, query) => {
  const q = String(query || '').trim();
  if (!q) return true;
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const fields = [
    circSearchHeadline(item),
    circSearchSource(item),
    (item && item.attribution) || '',
  ].map((f) => String(f || '').toLowerCase());
  return words.every((w) => fields.some((f) => f.indexOf(w) !== -1));
};

const circFilterSearch = (items, query) => {
  const q = String(query || '').trim();
  if (!q) return items || [];
  return (items || []).filter((it) => circSearchMatch(it, query));
};

// ---- The trigger ------------------------------------------------------------
// Same 44×44 shape and colour language as SavedToggle (feed-saved.jsx),
// deliberately — read that file's own header before touching either. `open`
// (whether the field is currently disclosed) drives `aria-expanded`; `active`
// (whether a query is actually typed) drives colour, exactly as SavedToggle's
// `on` does for its own boolean. NO underline — the 2px accent bottom border
// is the tab row's own selected-tab signifier and stays there; see
// SavedToggle's header for the three ways borrowing it went wrong.
const SearchTrigger = ({ open, active, onToggle }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', alignSelf: 'stretch',
    // Same separation, same reason, as SavedToggle's own marginRight: 8 — an
    // unlabelled 44px target abutting the next one is a mis-tap design.
    marginRight: 8,
  }}>
    <button
      type="button"
      onClick={() => onToggle(!open)}
      aria-expanded={open}
      aria-label="Search read links"
      title="Search read links"
      className="circ-lens-trigger"
      style={{
        background: 'transparent', border: 0, cursor: 'pointer', padding: 0,
        height: 'var(--tap-target-min)', width: 'var(--tap-target-min)', flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: active ? 'var(--color-accent)' : 'var(--color-fg-2)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <Icon name="search" size={19} />
    </button>
  </div>
);

// ---- The field ---------------------------------------------------------------
// Lives in the chip row (feed-lens.jsx's LensChips), not the tab bar — see
// that file's own comment on why this is a disclosure and not a fourth chip.
// A real field, not a chip: full width of the feed column, its own row.
//
// fontSize 16 is a hard floor, not a token swapped in — iOS zooms the whole
// page on any typed-into control under 16px, and nothing in this app's
// `--text-*` scale is reserved at that size for typed input. `minHeight` still
// carries the 44px touch floor.
//
// IDENTICAL SHAPE AT 390 AND 1280. This app's adaptive-exceptions table is
// declared complete and does not include search, so there is no isMobile prop
// here at all — the absence is the point, not an oversight.
// FOCUS ON OPENING, NOT ON MOUNTING. This carried a plain `autoFocus`, which
// is right for the one moment it was written for — the member tapped the
// trigger — and wrong for every other mount. The field unmounts on the Active
// tab (its open flag carries `tab === 'read'`) while the query survives in
// state, so Read → Active → Read remounted it and `autoFocus` threw focus back
// into the field and raised the phone keyboard unasked. Same on returning from
// a card, from settings, or from another circle.
//
// So focus is claimed once, on the transition from shut to open, and a remount
// carrying an existing query is left alone.
const SearchField = ({ value, onChange, onClear }) => {
  const ref = React.useRef(null);
  const claimed = React.useRef(false);
  React.useEffect(() => {
    if (claimed.current) return;
    claimed.current = true;
    // Only when the field opens EMPTY, which is the trigger's own path. A
    // field arriving with a query already in it was not just asked for.
    if (!value && ref.current) ref.current.focus();
  }, []);
  return (
  <div className="cand-searchfield" style={{
    display: 'flex', alignItems: 'center', gap: 8, width: '100%',
    // 44px + the 1px border top and bottom. Measured, not guessed: at a flat
    // 44px the bordered box is 44px but the INPUT inside it is 42px, and the
    // 44px floor is about the thing you tap, not the thing you see. Two more
    // pixels also holds the row still — with a bare 44px the row grew to 46px
    // the moment the clear button appeared, so the field jumped as you typed.
    minHeight: 46,
    background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
    borderRadius: 'var(--radius-md)', padding: '0 10px',
  }}>
    <span aria-hidden="true" style={{ display: 'inline-flex', flexShrink: 0, color: 'var(--color-fg-2)' }}>
      <Icon name="search" size={17} />
    </span>
    {/* A REAL label, visually hidden — not the placeholder standing in for
        one. The placeholder below is a hint only, and a hint disappears the
        moment there is a query, which an accessible name must never do. */}
    <label htmlFor="circ-search-input" style={{
      position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
      overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0,
    }}>Search read links</label>
    <input
      id="circ-search-input"
      className="cand-searchinput"
      ref={ref}
      type="text"
      inputMode="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search read links"
      style={{
        flex: 1, minWidth: 0, border: 0, background: 'transparent',
        fontFamily: 'var(--font-sans)', fontSize: 16, color: 'var(--color-fg-1)',
        // STRETCH, not vertical padding. Measured in the browser: with
        // `padding: '10px 0'` the input's own box came out 40px inside the
        // 44px row, so the typed-into control missed this app's 44px floor by
        // 4px and the two 2px strips top and bottom belonged to the wrapper,
        // where a tap does nothing. Stretching makes the control itself the
        // full 44px, which is what the floor is actually about.
        alignSelf: 'stretch', padding: 0,
      }}
    />
    {/* Clears AND closes — the field's one way out that does both in a single
        tap, per this module's own header. Present only once there is
        something to clear. */}
    {!!value && (
      <button type="button" onClick={onClear} aria-label="Clear search" style={{
        background: 'transparent', border: 0, cursor: 'pointer', padding: 0,
        height: 'var(--tap-target-min)', width: 'var(--tap-target-min)', flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--color-fg-2)', borderRadius: 'var(--radius-md)', marginRight: -10,
      }}>
        <Icon name="x" size={15} />
      </button>
    )}
  </div>
  );
};

Object.assign(window, { circSearchMatch, circFilterSearch, circSearchHeadline, circSearchSource, SearchTrigger, SearchField });
