# Gotchas

Non-obvious traps, each of which already cost real time. Transferable to any
project — none of them are specific to one codebase.

**Editing rule for the copy you keep in a project:** only add an entry when the
user approves it. Terse: symptom → cause → fix → rule.

---

## 1. `.focus()` on an element in an off-screen sheet heaves the whole screen

**Symptom.** Opening a bottom sheet made the entire page behind it lift ~half a
viewport and drop back — an "eruption" — every time. Two other sheets using the
*same* open logic were fine.

**Cause.** A bottom sheet mounts at `transform: translateY(100%)` (fully
off-screen below) and slides up. This one called `closeRef.current.focus()` on
mount. The close button was therefore off-screen, so the browser scrolled an
ancestor to bring the focused element into view, displacing everything, then
settled as the sheet slid in. The other two never call `.focus()` — that was the
*only* difference. Not the animation, not where they mount.

**Fix.** `el.focus({ preventScroll: true })`.

**Rule.** Any `.focus()` inside a sheet/modal/drawer that starts off-screen must
pass `{ preventScroll: true }`. If the focus isn't needed for a11y flow, don't
call it while the element is translated out of view.

---

## 2. Preview sandboxes pause `requestAnimationFrame` — so screenshots lie about transitions

**Symptom.** Multiple rounds "confirming" a sheet slide as working, then broken,
then working — all wrong. DOM-rerender screenshots froze CSS animations at frame 0
and misrendered `position: fixed` + scrim; measurement `requestAnimationFrame`
never fired because the sandboxed document is treated as hidden.

**Consequences.**
- rAF-driven entrances (the `render`/`shown` + double-rAF pattern) do **not**
  advance in an agent's own iframe — the sheet stays at `translateY(100%)` and
  looks broken when it is fine in a real foreground browser.
- html-to-image style captures misrender fixed overlays, scrims, and
  mid-transition opacity. Do not trust them for overlay or stacking bugs.

**How to actually verify a mount transition.** Drive and measure in the user's
**live** view: sample real values over time — `getComputedStyle(el).transform`,
`getBoundingClientRect().top` of a background element, `scroller.scrollTop`. That
is how #1 was finally pinned (background `top` jumping −44 → −431 while
`scrollTop` held).

**Rule.** For anything animated on mount, never conclude from a screenshot.
Measure numbers in the live view, or hand it to the user to eyeball.

---

## 3. Sheets are not structurally interchangeable — give them one mechanism

Overlays opened from different depths (app root vs. deep inside a scrolling list)
behave differently unless you force them to converge. Portal the deep one to the
same shallow root as the others, and share **one** open/close mechanism —
`useSheetMount`-style: mount at `translateY(100%)`, double-rAF → `shown`,
transition up; close = `shown` false → transition down → unmount after the slide.

**Rule.** Keep every sheet on the identical mechanism. Divergence here is where
the bugs come from, and they present as animation bugs while being structural.

---

## 4. A `transform` creates a containing block — it captures every `position: fixed` inside it

One rule, two ways it bites. Both cost a session.

**Symptom A.** Bottom sheets pinned to a phone *frame* rather than the screen,
spilling over the rounded bezel edge.

**Symptom B.** After a slide-in page transition settled, sheets opened inside it
were subtly offset — the layer still carried `translateX(0)`, which is still a
transform.

**Cause (both).** `position: fixed` resolves against the nearest transformed
ancestor, not the viewport. Any non-`none` transform — including the identity
`translateX(0)` — makes that ancestor the containing block.

**Fix.**
- Structural: three layers — bezel → **clip layer** (carries the transform,
  non-scrolling, exactly the screen's bounds + radius) → screen (scrolls).
- Transient: a push/transition hook holds its two layers only for the length of
  the transition and returns the plain view once idle.

**Rule.** The only layer allowed a standing transform is one whose box is exactly
the screen and which does not scroll. Everywhere else transforms are transient —
a layer at rest has no transform, not even an identity one.

---

## 5. Defensive string helpers: `filter(Boolean)` silently defeats your test fixture

**Symptom.** Tried to seed a titleless card (to exercise a fallback) by giving it
a URL path ending in `/`. The card kept deriving a real title.

**Cause.** The deriver did `pathname.split('/').filter(Boolean).pop()` —
`filter(Boolean)` strips the empty string a trailing slash produces, so `pop()`
still returned the last real segment.

**Rule.** When seeding a fixture to trigger a fallback, read the actual predicate
rather than assuming what "empty" means to it. Fallback fixtures fail quietly in
the direction of looking fine.
