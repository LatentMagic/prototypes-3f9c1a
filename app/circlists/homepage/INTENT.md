# Circlists homepage — Acceptance criteria

This is the **acceptance-criteria contract** for the Circlists homepage: the behaviour
the shipped page is built and tested against. Every AC below is required of the shipped
site, and each is a single testable behaviour or contract. A *Note* marks anything
late-bound at deploy — a value we don't know yet, but whose behaviour is fully specified
here.

**This document is the authority.** These criteria were derived from a design mock, but
that mock is a reference for how the page looks and reads — it is **not** the deliverable,
and conformance is judged against the ACs here, never against the mock. Build the page to
this spec; do not port or "convert" the mock into the production site.

This document is self-contained: it depends on no other document and requires no reading
of the mock to be implemented. It is the behavioural spec, full stop.

IDs are stable — reference them in code review ("satisfies AC-7") and tests ("test('AC-7 - xyz")). Order roughly follows
page flow, but the ID is the anchor, not the position.

Content (copy, archetype names, supporting pricing lines, changelog wording) is **not**
asserted line-by-line here — see the Notes at the end.

---

## Header & nav

- **AC-1 — Sign-in routing.** Activating "Sign in" takes the visitor to the sign-in
  destination. *Note: target URL wired at deploy (currently `#`).*
- **AC-2 — Sign-up routing.** Activating "Sign up" takes the visitor to the sign-up
  destination. *Note: target URL wired at deploy (currently `#`).*
- **AC-3 — Wordmark links home.** The header wordmark links to the home page, from every
  page it appears on (including the privacy page).
- **AC-4 — Header is sticky.** The header stays visible, pinned to the top, as the page
  scrolls.

## Hero — live demo

- **AC-5 — Poster until ready.** The demo shows the branded poster/spinner until the
  embedded app has loaded, then reveals the app.
- **AC-6 — Auto-reveal conditions.** The demo reveals automatically once loaded only when
  the viewport is desktop-width **and** the pointer is fine with hover; otherwise the
  tap-shield is shown first.
- **AC-7 — Tap-shield.** While the tap-shield is shown, a tap reveals the app for
  interaction and a swipe still scrolls the page (the shield does not trap the gesture).
- **AC-8 — Demo layout by viewport.** At viewport width ≥ 768px the demo loads the app's
  desktop layout; below 768px it loads the mobile layout. Crossing the boundary reloads
  the demo with the correct layout and preserves the app's own state.

## Pricing

- **AC-9 — Founding price.** The pricing block displays the founding rate of **£3 per
  circle / month**.

## Changelog

- **AC-10 — Changelog structure.** Entries render newest-first, each carrying a
  description, up to a maximum of three — older entries are dropped, not paginated.
  The newest entry is flagged with a "Latest" marker and an accent bullet.
  *Note: the entries are hand-authored content, supplied at build time — any entries
  carried over from the mock are placeholder, not the real changelog.*

- **AC-11 — "Latest" marker placement is responsive.** At full width the "Latest"
  marker sits to the right of the entry description, baseline-aligned. At narrow
  widths (≤640px) it stacks above the description rather than folding beneath it,
  so it reads as a tag on the entry, not a trailing afterthought.

## Footer

- **AC-12 — Footer links resolve.** The Privacy link goes to the privacy page; the support
  link is a `mailto:` to the support address.

## Assets

- **AC-13 — Brand & icon assets resolve.** Every file-referenced brand and icon asset
  resolves to its bundled file: the footer wordmark, the demo poster lockup, and the icon
  set (favicon `.ico` + SVG, apple-touch, PWA raster).

---

## Notes (not acceptance criteria)

- **Content is author-supplied, not asserted here.** Copy, archetype names, the supporting
  pricing lines (champion funds the circle, up to 10 members invited free, shared list /
  private read-state), page title, and meta description are content the team provides at
  build time. If any of those become contracts rather than copy, promote them to ACs.
- **Animated marks are brand treatments, not itemized here.** The header lockup pulse, the
  two live-dots (demo hint + changelog), and the loading spinner are inline brand
  treatments; their exact motion is not asserted as acceptance criteria.
- **The demo is vendored.** The site frames the demo and never edits its internals; the
  framing behaviour is captured by AC-5 through AC-8.
- **Review-only aids are not part of the product.** The mock carries authoring aids — a
  Config launcher, a full-site preview stage, and their preview guards — for reviewing the
  design. They are not features: the shipped page must not include them.
