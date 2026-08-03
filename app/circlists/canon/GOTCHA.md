# Gotchas

Hard-won, non-obvious traps. Read before touching overlay/sheet motion or
"verifying" an animation.

Entries 1–5 are code traps. **Entries 6–10 are judgement traps** — the mistakes
that cost the most time on this project were not wrong code, they were wrong
intent. Read those before starting design work, not while debugging it.

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


---

## 6. Compensating for a structure instead of fixing it

**Symptom.** A tertiary (unboxed) Leave button stacked under a filled primary
looked wrongly spaced however the gaps were set. Equal gaps read unequal. I
"fixed" it with `margin-block: -18px` to cancel the button's empty box. It
looked right at rest and fell apart on hover, when the box painted.

**Cause.** The fault was structural — an unboxed control cannot share a stack
with a boxed one, because half its height is invisible until you touch it. The
negative margin did not fix that; it made the layout **lie**, and any state that
reveals the box exposes the lie.

**Rule.** When spacing needs compensating, the structure is wrong. Never correct
optics with negative margins, nudge values, or per-element exceptions — change
what the elements *are*. (Here: give the exit a real box. Fill still outranks
outline, so nothing was lost by doing it honestly.)

---

## 7. Over-correcting — fixing a symptom at the opposite extreme

**Symptom.** The subheading ran the full width of the canvas, so I capped it at
`28ch`. It then broke into two stranded fragments with 400px of room going
spare — a worse defect than the one I fixed, shipped in the same breath.

**Cause.** I treated "too wide" as "needs a width" instead of asking what the
measure *should* be. The column was always the right measure; I invented a
second one.

**Rule.** Before adding a constraint, check whether an existing one already
answers it. A fix that swaps one visible defect for another means the cause was
never found — go back a step rather than tuning the new number.

---

## 8. "Responsive" verified at the two widths you happened to look at

**Symptom.** A layout keyed off the global `data-circ-posture` flag looked
correct on the desktop canvas and in the 402px phone frame, and was unusable at
320 — text squeezed, actions in a row that did not fit.

**Cause.** A posture flag says which *chrome* to render. It says nothing about
how much room the content has. Designing against it means designing for two
screenshots.

**Rule.** Shared surfaces adapt to the **width they are handed** — container
queries and `cqi` type scaling, not posture flags or viewport media queries.
Probe the real numbers at **320, the phone frame, and desktop** before calling
it done; 320 is the floor the product promises, and it is where the design
fails first.

---

## 9. Writing product copy without reading the copy voice first

**Symptom.** Shipped a subheading reading "nobody can add or read" — one line
breaking two standing rules: **format-neutral** (never narrow to "read"; the
product carries articles, videos and podcasts) and **name the content, not the
mechanism** ("add", "links").

**Cause.** `wiki/circlists-copy-voice.md` was in the repo the whole time. I
wrote from instinct and only opened it once the copy had been rejected twice.

**Rule.** Read `wiki/circlists-copy-voice.md` **before** writing any product
string, not after it is challenged. The same goes for the other durable docs —
the assets exist so the reasoning is not re-derived badly each session.

---

## 10. Offering options when you were asked for a verdict

**Symptom.** Asked directly for expertise on two UX choices (which button kind,
which side), I produced more side-by-side comparisons. The user had to say "I
asked for ratification and you didn't respond to me on that."

**Cause.** Comparison rigs are the right tool for *exploring* and the wrong one
for *deciding*. Past a certain point they stop being generous and start being an
abdication — the reviewer is doing the judging that was delegated.

**Related.** Provenance is not a defence of quality: "it's the shipped dialog"
was true of the component and irrelevant to its copy, which was mine and was
bad. Check what is actually being criticised.

**Rule.** When the ask is "what should we do", answer with a decision and the
reason, name what you would overrule and why, and reserve one genuine open
question for the user. Options are for the exploration phase; verdicts are for
the resolution phase.
