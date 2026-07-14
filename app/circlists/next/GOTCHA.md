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
