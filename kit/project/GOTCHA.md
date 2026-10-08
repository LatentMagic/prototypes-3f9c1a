# Gotchas

Hard-won, non-obvious traps. Read before touching overlay/sheet motion or
"verifying" an animation.

Entries 1–3 are code traps. **Entries 4–9 are judgement traps** — the mistakes
that cost the most time were not wrong code, they were wrong intent. Read those
before starting design work, not while debugging it.

Entries 10–12 are code or platform traps; they sit after the judgement traps
because they were found later, not because they matter less.

---

## 1. `.focus()` on an element in an off-screen sheet heaves the whole screen

**Symptom.** Opening a sheet made the entire screen behind it lift ~half a
viewport and drop back — an "eruption" — every time. Other sheets, using the
*same* open logic, were fine.

**Cause.** A bottom sheet mounts at `transform: translateY(100%)` (fully
off-screen below) and slides up. One sheet called `closeRef.current.focus()` on
mount. The close button was therefore off-screen, so the browser scrolled an
ancestor to bring the focused element into view, displacing everything, then
settled as the sheet slid in. The other sheets never call `.focus()` — that was
the *only* difference, not the animation and not where they mount.

**Fix.** `el.focus({ preventScroll: true })` for any focus inside an overlay
that animates in from off-screen.

**Rule.** Any `.focus()` inside a sheet/modal/drawer that starts off-screen must
pass `{ preventScroll: true }`. If you don't need the focus for a11y flow, don't
call it while the element is translated out of view.

---

## 2. This preview sandbox pauses `requestAnimationFrame` — so screenshots lie about transitions

**Symptom.** Multiple rounds "confirming" a sheet slide as working, then broken,
then working — all wrong. `save_screenshot` (html-to-image) froze CSS animations
at frame 0 and rendered `position: fixed` + scrim badly; measurement
`requestAnimationFrame` never fired because the sandbox document is treated as
hidden.

**Consequences to remember.**
- rAF-driven entrances (a `render`/`shown` + double-rAF pattern) do **not**
  advance in the agent's own iframe — the sheet stays at `translateY(100%)` and
  looks "broken" when it is actually fine in the user's real, foreground browser.
- html-to-image captures (`save_screenshot`, `screenshot_user_view`) misrender
  fixed overlays, scrims, and mid-transition opacity — they showed a working
  modal as faint/behind the page. Do not trust them for overlay/stacking bugs.

**How to actually verify mount transitions.** Drive and measure in the user's
**live** view with `eval_js_user_view`: sample real values over time —
`getComputedStyle(sheet).transform`, `getBoundingClientRect().top` of a
background element, `scroller.scrollTop`.

**Rule.** For anything animated on mount, don't conclude from a screenshot.
Measure numbers in the live view, or hand it to the user to eyeball.

---

## 3. A `transform` creates a containing block — it captures every `position: fixed` inside it

One rule, two ways it bites. Both cost a session.

**Symptom A — the sheets bled onto the bezel.** Bottom sheets pinned to the
phone *frame* rather than the screen, spilling over the rounded bezel edge. Put
the transform on the scroller instead and the sheets rode the content as it
scrolled.

**Symptom B — mispinned overlays after a page push.** After a slide-in page
transition settled, sheets opened inside it were subtly offset — the layer still
carried `translateX(0)`, which is still a transform.

**Cause (both).** `position: fixed` resolves against the nearest transformed
ancestor, not the viewport. Any non-`none` transform — including the identity
`translateX(0)` — makes that ancestor the containing block.

**Fix.**
- Structural: the phone frame is **three** layers — bezel (`.kit-phone`) → clip
  (`.kit-phone-clip`: carries the transform, non-scrolling, exactly the
  screen's bounds + radius) → screen (`.kit-phone-screen`: scrolls). The
  Config pill is mounted outside the frame for the same reason.
- Transient: a page-push transition holds its two layers only for the length of
  the transition and returns the plain view once idle, so no transform survives
  at rest.

**Rule.** The only layer allowed a standing transform is one whose box is
exactly the screen and which does not scroll. Everywhere else, transforms are
transient — a layer at rest has no transform, not even an identity one.

---

## 4. Compensating for a structure instead of fixing it

**Symptom.** A tertiary (unboxed) button stacked under a filled primary looked
wrongly spaced however the gaps were set. Equal gaps read unequal. A
`margin-block: -18px` to cancel the button's empty box looked right at rest and
fell apart on hover, when the box painted.

**Cause.** The fault was structural — an unboxed control cannot share a stack
with a boxed one, because half its height is invisible until you touch it. The
negative margin did not fix that; it made the layout **lie**, and any state that
reveals the box exposes the lie.

**Rule.** When spacing needs compensating, the structure is wrong. Never correct
optics with negative margins, nudge values, or per-element exceptions — change
what the elements *are*. (Here: give the exit a real box. Fill still outranks
outline, so nothing was lost by doing it honestly.)

---

## 5. Over-correcting — fixing a symptom at the opposite extreme

**Symptom.** A subheading ran the full width of the canvas, so it was capped at
`28ch`. It then broke into two stranded fragments with 400px of room going
spare — a worse defect than the one fixed, shipped in the same breath.

**Cause.** "Too wide" was treated as "needs a width" instead of asking what the
measure *should* be. The column was always the right measure; a second one was
invented.

**Rule.** Before adding a constraint, check whether an existing one already
answers it. A fix that swaps one visible defect for another means the cause was
never found — go back a step rather than tuning the new number.

---

## 6. "Responsive" verified at the two widths you happened to look at

**Symptom.** A layout keyed off a global posture flag looked correct on the
desktop canvas and in the phone frame, and was unusable at 320 — text squeezed,
actions in a row that did not fit.

**Cause.** A posture flag says which *chrome* to render. It says nothing about
how much room the content has. Designing against it means designing for two
screenshots.

**Rule.** Shared surfaces adapt to the **width they are handed** — container
queries and `cqi` type scaling, not posture flags or viewport media queries.
Probe the real numbers at **320, the phone frame, and desktop** before calling
it done; 320 is the floor, and it is where the design fails first.

---

## 7. Writing product copy without reading the copy voice first

**Symptom.** Shipped a line that broke two standing rules of the product's voice
(one about not narrowing the product to a single kind of content, one about
naming the content rather than the mechanism).

**Cause.** The voice doc was available the whole time. The copy was written from
instinct and the doc was opened only once the copy had been rejected twice.

**Rule.** Read the copy voice the product block in `CLAUDE.md` names **before** writing any product
string, not after it is challenged. The same goes for the other durable docs —
the assets exist so the reasoning is not re-derived badly each session.

---

## 8. Offering options when you were asked for a verdict

**Symptom.** Asked directly for expertise on two UX choices (which button kind,
which side), more side-by-side comparisons came back. The user had to say they
had asked for ratification and got no answer on it.

**Cause.** Comparison rigs are the right tool for *exploring* and the wrong one
for *deciding*. Past a certain point they stop being generous and start being an
abdication — the reviewer is doing the judging that was delegated.

**Related.** Provenance is not a defence of quality: "it's the shipped dialog"
can be true of the component and irrelevant to its copy. Check what is actually
being criticised.

**Rule.** When the ask is "what should we do", answer with a decision and the
reason, name what you would overrule and why, and reserve one genuine open
question for the user. Options are for the exploration phase; verdicts are for
the resolution phase. A verdict is still a proposal: it takes effect only once
the user ratifies it (`CLAUDE.md`, Ratification).

---

## 9. Announcing before you can act

**Symptom.** A "New" pill (or similar arrival affordance) appears while context
is still loading, so it reads as tappable and isn't — the implementer has to
invent a loading state that was never designed.

**Cause.** In the prototype, data arrival and interactivity are the same
instant; on a real backend they are two.

**Fix.** Pick one — hold the element until it is actionable, or design its inert
state explicitly (and say what ends it).

**Rule.** Never let a prototype collapse "appears" into "works". Where they can
separate, name both.

---

## 10. A CSS transition never fires if the `transition` property arrives in the same commit as the value

**Symptom.** A card's swap snapped open with no motion. The class carrying the
transition was on the element, `transition-duration` computed as `0.4s`, the
inline height changed from `146px` to `12px` — and nothing travelled. No console
error, nothing to grep for.

**Cause.** A transition is only generated when the property is transitionable in
the **before** style. Arming it at the moment of the change — `setMoving(true)`
alongside `setOpen(true)`, so the class and the new height land in one React
commit — means the before-style had no transition, so the browser has nothing to
interpolate from and applies the new value directly.

The obvious workaround is worse: an "arm on mount" effect
(`requestAnimationFrame` → `setArmed(true)`) is a race that fails silently under
StrictMode's double-invoked effects and any remount, leaving the class off
entirely. Two rounds were spent on variants of the same wrong idea.

**Fix.** Either the transition property is **permanently present** on the
element, or the motion is driven explicitly: the geometry runs through
`element.animate()` from known from/to values in a `useLayoutEffect`, guarded by
`prefers-reduced-motion`. Only the soft properties — shadow, radius, background,
border colour — stay on a CSS transition, where a miss is invisible.

**Two related traps in the same family.**
- **`auto` is not interpolatable.** A card sitting at `height: auto` snaps on the
  first frame and only then travels. Heights must be explicit at rest — which
  also means the initial `auto` → measured-px step is free, because it cannot
  animate.
- **A discrete `z-index` flip is visible wherever the two elements overlap.**
  Flip it where they do not touch, not halfway through.

**Rule.** Never gate a transition behind a class you switch on at the moment you
use it. And when motion matters, drive it — a silent no-op is the worst failure
mode there is, because the code reads as correct and only the user can see that
it is not (see entry 2: you cannot verify this from a screenshot).

---

## 11. The "referenced file not found" warning is only a false positive when `<base>` is *right*

**Symptom.** A whiteboard in `docs/specs/<ticket>/playground/` was handed over
with no tokens at all — no fonts, no accent, no spacing. The user opened it and
saw black-and-white unstyled text. It was defended in chat as "the usual
base-relative false positive" and shipped twice that way.

**Cause.** The entry was copied from a rig that sits at `docs/specs/<ticket>/`
(three levels deep) and kept its `<base href="../../../" />`. The new file is
**four** levels deep, so `<base>` resolved to `docs/` and `tokens.css` 404'd. The
count is levels *of the file's own folder*, not a constant: `playground/` adds
one.

**Fix and rule.** `CLAUDE.md` § Files holds them (the `<base>` depth, and the
warning being a false positive only when that depth is right). Count the `../`
against the file's own depth and confirm one token-driven thing rendered before
handing it over.

---

## 12. `<style>` and `@keyframes` inside an SVG are stripped on upload

**Symptom.** An animated SVG shipped as a static image after being uploaded to
the project.

**Cause.** The platform strips the `<style>`/`@keyframes` block from SVGs on
upload. The shipped file is static; that is not a defect in the SVG.

**Rule.** Do not treat a static uploaded SVG as broken, and do not edit it to
"restore" the motion. The curves, timings and keyframes live in the doc that
specifies the motion, not in the file.
