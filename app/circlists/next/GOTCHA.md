# Gotchas

Hard-won, non-obvious traps. Read before touching overlay/sheet motion or
"verifying" an animation.

---

## 1. `.focus()` on an element in an off-screen sheet heaves the whole screen

**Symptom.** Opening the Read-tab "how it landed" door made the entire feed
behind it lift ~half a viewport and drop back — an "eruption" — every time. The
Add sheet and the mark-as-read reveal, using the *same* open logic, were fine.

**Cause.** A bottom sheet mounts at `transform: translateY(100%)` (fully
off-screen below) and slides up. `SwellReviewModal` called
`closeRef.current.focus()` on mount. The close button was therefore off-screen,
so the browser scrolled an ancestor to bring the focused element into view,
displacing everything, then settled as the sheet slid in. The other two sheets
never call `.focus()` — that was the *only* difference, not the animation and
not where they mount.

**Fix.** `el.focus({ preventScroll: true })` for any focus inside an overlay
that animates in from off-screen. (`app/swell-reactions.jsx`, `SwellReviewModal`.)

**Rule.** Any `.focus()` inside a sheet/modal/drawer that starts off-screen must
pass `{ preventScroll: true }`. If you don't need the focus for a11y flow, don't
call it while the element is translated out of view.

---

## 2. This preview sandbox pauses `requestAnimationFrame` — so screenshots lie about transitions

**Symptom.** Spent multiple rounds "confirming" a sheet slide as working, then
broken, then working — all wrong. `save_screenshot` (html-to-image) froze CSS
animations at frame 0 and rendered `position: fixed` + scrim badly; measurement
`requestAnimationFrame` never fired because the sandbox document is treated as
hidden.

**Consequences to remember.**
- rAF-driven entrances (the AddReveal `render`/`shown` + double-rAF pattern) do
  **not** advance in the agent's own iframe — the sheet stays at
  `translateY(100%)` and looks "broken" when it is actually fine in the user's
  real, foreground browser.
- html-to-image captures (`save_screenshot`, `screenshot_user_view`) misrender
  fixed overlays, scrims, and mid-transition opacity — they showed a working
  modal as faint/behind the feed. Do not trust them for overlay/stacking bugs.

**How to actually verify mount transitions.** Drive and measure in the user's
**live** view with `eval_js_user_view`: sample real values over time —
`getComputedStyle(sheet).transform`, `getBoundingClientRect().top` of a
background element, `scroller.scrollTop`. That is how the eruption was finally
pinned (background `cardTop` jumping -44 → -431 while `scrollTop` held).

**Rule.** For anything animated on mount, don't conclude from a screenshot.
Measure numbers in the live view, or hand it to the user to eyeball.

---

## 3. The three overlays are NOT structurally interchangeable

For reference when editing sheet behaviour:

- **AddReveal** (`app/feed.jsx`) and the **mark-as-read reveal**
  (`SwellReactionFlow`) render at the app-root / shell level, outside the feed.
- **The door modal** (`SwellReviewModal`) is opened from `SwellDoor`, which lives
  *inside* a `FeedCard` deep in the scrolling list. It is portalled to the
  `.circ-phone-screen` root so it sits at the same shallow DOM depth as the other
  two.

All three now share one open/close mechanism (`useSheetMount`), which is the
AddReveal pattern verbatim: mount at `translateY(100%)`, double-rAF → `shown`,
transition up; close = `shown` false → transition down → unmount after the slide.
Keep them identical — divergence here is where the bugs came from.

---

## 4. A trailing slash does NOT make `feedDeriveTitle` return null

**Symptom.** Tried to seed a card with no title (bare-URL/mono-font fallback)
by giving it a long path ending in `/`. The card kept showing a real derived
title instead of falling through to the URL-font treatment.

**Cause.** `feedDeriveTitle` (`app/feed.jsx`) does
`pathname.split('/').filter(Boolean).pop()` — `filter(Boolean)` strips the
empty string a trailing slash produces, so `pop()` still returns the last real
segment. Only an empty/very short (`<3` chars) or all-numeric last segment
makes it return `null`.

**Fix.** To seed a genuinely titleless card, put the long content in the query
string instead of the path (e.g. `https://example.com/?trace=...long-slug...`)
so `pathname` is just `/` and there's no segment to derive from. No
`SEED_META` entry for that URL either.

**Rule.** Titleless-fallback test fixtures need an empty/near-empty pathname,
not just a trailing slash.

---

## 5. A `transform` creates a containing block — it captures every `position: fixed` inside it

One rule, two ways it bites. Both cost a session.

**Symptom A — the sheets bled onto the bezel.** Bottom sheets pinned to the
phone *frame* rather than the screen, spilling over the rounded bezel edge. Put
the transform on the scroller instead and the sheets rode the feed as it
scrolled.

**Symptom B — mispinned overlays after a page push.** After the app posture's
slide-in page transition settled, sheets opened inside it were subtly offset —
the layer still carried `translateX(0)`, which is still a transform.

**Cause (both).** `position: fixed` resolves against the nearest transformed
ancestor, not the viewport. Any non-`none` transform — including the identity
`translateX(0)` — makes that ancestor the containing block.

**Fix.**
- Structural: the phone frame is **three** layers — bezel (`.circ-phone`) → clip
  (`.circ-phone-clip`: carries the transform, non-scrolling, exactly the
  screen's bounds + radius) → screen (`.circ-phone-screen`: scrolls).
- Transient: `useNativePush` (`app/app-shell.jsx`) holds its two layers only for
  the length of the transition and returns the plain view once idle, so no
  transform survives at rest.

**Rule.** The only layer allowed a standing transform is one whose box is
exactly the screen and which does not scroll. Everywhere else, transforms are
transient — a layer at rest has no transform, not even an identity one.
