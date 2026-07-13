# Circlists front page — Acceptance criteria

The prototype (`index.html` + `site.css` + `tokens.css` + the vendored demo) is the
**behavioural source of truth** for the shipped page. Every AC below is required of the
coded site, and each is a single testable behaviour or contract. A *Note* marks anything
late-bound at deploy — a value we don't know yet, but whose behaviour is fully specified
here.

IDs are stable — reference them in code review ("satisfies AC-7") and tests ("test('AC-7 - xyz")). Order roughly follows
page flow, but the ID is the anchor, not the position.

Content (copy, archetype names, supporting pricing lines, changelog wording) is per the
prototype and is **not** asserted line-by-line here — see the Notes at the end. Product
essence these serve: **[ABOUT.md](ABOUT.md)**. Brand rules: **[BRANDING.md](BRANDING.md)**.

---

## Header & nav

- **AC-1 — Sign-in routing.** Activating "Sign in" takes the visitor to the sign-in
  destination. *Note: target URL wired at deploy (currently `#`).*
- **AC-2 — Sign-up routing.** Activating "Sign up" takes the visitor to the sign-up
  destination. *Note: target URL wired at deploy (currently `#`).*
- **AC-3 — Wordmark links home.** The header wordmark links to the home page, from every
  page it appears on (including `privacy.html`).
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
  description. The newest entry is flagged with a "Latest" marker and an accent bullet.
  *Note: the entries are hand-authored content — the current prototype entries are
  placeholder and are not the real changelog.*

## Footer

- **AC-11 — Footer links resolve.** The Privacy link goes to `privacy.html`; the support
  link is a `mailto:` to the support address.

## Assets

- **AC-12 — Brand & icon assets resolve.** Every file-referenced brand and icon asset
  resolves to its bundled file: the footer wordmark, the demo poster lockup, and the icon
  set (favicon `.ico` + SVG, apple-touch, PWA raster).

---

## Notes (not acceptance criteria)

- **Content is per the prototype.** Copy, archetype names, the supporting pricing lines
  (champion funds the circle, up to 10 members invited free, shared list / private
  read-state), page title, and meta description are taken from the prototype, not
  asserted here. If any of those become contracts rather than copy, promote them to ACs.
- **Animated marks follow the brand motion pack.** The header lockup pulse, the two
  live-dots (demo hint + changelog), and the loading spinner are inline brand treatments
  governed by BRANDING.md — not itemized here.
- **The demo is vendored.** The site frames the demo (`demo-embed.html` over
  `uploads/homepage-demo/`) and never edits its internals — see `DEMO.md`.
- **Remove review scaffolding at conversion.** The Config launcher, the full-site preview
  stage, the `?preview=1` guards, and `css/15-config-launcher.css` are prototype aids and
  are not part of the product.
