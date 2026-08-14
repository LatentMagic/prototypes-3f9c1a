# Handoff — backgrounded-tab arrival signal

**Date:** 2026-07-30
**Status:** decided, not built
**Scope:** desktop browser tab only. No change to in-app arrival treatment.
**Explored in:** `tab-arrival-signal-playground.html` (round 1), `tab-arrival-signal-playground-v2.html` (round 2), `tab-arrival-signal-favicon-refinement.html` (final geometry)

---

## 1. The decision

When links arrive while the Circlists tab is backgrounded, **the favicon gains an emerald badge in its lower-right.** The title does not change. Cleared when the tab regains focus.

In browsers that do not apply favicon updates (Safari), **and only there**, a leading `• ` is prepended to the document title instead. The favicon badge and the title bullet must never both be active — see the fail-closed rule in §4.

One sentence for the whole system: *the tab shows a dot* — on the mark where the browser allows it, in the title where it doesn't.

## 2. What was rejected, and why

Record these so they don't get relitigated.

| Rejected | Reason |
|---|---|
| **Favicon full-swap** (whole tile becomes a filled dot) | Arrivals are frequent, so the logo would be absent most of the time. The resting mark is the asset; nothing may remove it. |
| **Title changes to words** ("New links — Circlists") | The tab title is an identifier, not a message field. Replacing the leading word changes what people scan for, and in a truncated strip the brand name is what gets cut. Prose also either instructs or over-reports — both louder than the product's register. |
| **Title bullet in all browsers** | A dot in the title beside a dot on the mark is a dot on a dot. |
| **Badge as a small mark** (sage halo + emerald core) | At 16px the inner core lands under 2px and turns to mud. |
| **Orbit dot** (mark shifted, satellite dot clear of the halo) | Most legible at 16px, but it moves the mark's optical centre, so the logo appears to jump each time the signal fires and clears. Same objection as the full swap: the resting state must not be disturbed. |
| **Numbers of any kind** | Product constraint — no counts, ever. |
| **Red** | `#991b1b` is destructive treatment only. |
| **Motion** | Calm is the floor. |

## 3. Geometry — exact

The mark is **frozen**. The arrived state adds two circles and changes nothing else.

Resting favicon, unchanged, `brand/assets/favicon.svg`:

```
viewBox 0 0 48 48
halo      circle cx=24 cy=24 r=22.5    fill   #8bbfad
core      circle cx=24 cy=24 r=14.25   fill   #047857
ring      circle cx=24 cy=24 r=14.925  stroke #ffffff  stroke-width 1.35
```

Badge added for the arrived state:

```
keyline   circle cx=36 cy=36 r=10.075  stroke #ffffff  stroke-width 1.35   (draw first)
disc      circle cx=36 cy=36 r=9.4     fill   #047857                     (draw second)
```

Why these numbers:

- **Keyline weight `1.35` is not arbitrary** — it is the exact weight of the ring already sitting between the mark's core and halo. The badge is built from the mark's own vocabulary, so it reads as construction rather than something stuck on. Do not change it independently of the mark.
- **Keyline colour is `#ffffff`**, matching the shipped mark. The brand *cream* is `#FAFAF7` and is the installed-icon ground, not a stroke colour. The exploration files used cream by mistake; `#ffffff` is correct.
- **Outer edge lands at 46.75 of 48.** The resting mark's own outer edge is 46.5, so the badge respects the same optical margin. Earlier drafts drew the badge at `cx 39, r 11` — outer edge 50 — and it was silently clipped by the viewBox on two sides. Any change to badge size or position must be re-checked against the 48 box.
- **Emerald disc is 39% of the tile.** Centre-to-centre distance from the mark is 16.97 against a halo radius of 22.5, so the badge crosses the silhouette by ~3.9 units. That silhouette break is what makes it detectable peripherally at 16px — it is load-bearing, not decorative. Do not tuck the badge inside the halo.

Draw order matters: keyline first, disc over it, so the stroke reads as a clean outer edge rather than eating into the emerald.

## 4. Implementation

### Do not touch the brand assets

`brand/assets/*` and `brand/scripts/build_rasters.py` are the frozen brand record. **Do not regenerate them and do not add the badged variant to them.** The badge is a runtime application state, not a brand asset. It is generated in app code as a data-URI SVG and swapped onto the `<link rel="icon">`. `favicon.svg` remains the only favicon on disk.

### Arrived-state SVG, verbatim

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" role="img" aria-label="Circlists — new links">
  <circle cx="24" cy="24" r="22.5" fill="#8bbfad"/>
  <circle cx="24" cy="24" r="14.25" fill="#047857"/>
  <circle cx="24" cy="24" r="14.925" fill="none" stroke="#ffffff" stroke-width="1.35"/>
  <circle cx="36" cy="36" r="10.075" fill="none" stroke="#ffffff" stroke-width="1.35"/>
  <circle cx="36" cy="36" r="9.4" fill="#047857"/>
</svg>
```

### The Safari branch must fail closed

There is no feature test for "this browser applies favicon updates", so the branch is a positive user-agent match on Safari. **Default to the favicon path.** If detection is wrong, the cost is a missing signal in a minority browser — never a duplicated signal everywhere, which is the outcome that was explicitly rejected.

Keep this as one guarded expression at the edge of the module. Do not grow it into a capability abstraction.

```js
// Tab arrival signal. Favicon badge everywhere; title bullet on Safari only, fail-closed.
const RESTING = 'brand/assets/favicon.svg';
const ARRIVED = 'data:image/svg+xml,' + encodeURIComponent(`<svg …/>`); // §4 SVG above

// Positive Safari match only. Anything unrecognised takes the favicon path.
const TITLE_FALLBACK = /^((?!chrome|android|crios|fxios|edgi).)*safari/i.test(navigator.userAgent);

let baseTitle = document.title;

function setArrivalSignal(on) {
  if (TITLE_FALLBACK) {
    document.title = on ? '• ' + baseTitle : baseTitle;
    return;                                     // never both channels
  }
  document.querySelector('link[rel="icon"]').href = on ? ARRIVED : RESTING;
}
```

### Behaviour

- **Set** when links arrive and `document.visibilityState === 'hidden'`.
- **Clear** on `visibilitychange` back to visible — not on read, not on scroll. Focus is the acknowledgement.
- **Boolean, not a counter.** Further arrivals while already signalling change nothing.
- **No transition.** The swap is instant. No fade, no pulse — the motion spec in `brand/motion/circlists-motion.md` does not apply here.
- If the app updates `document.title` for its own reasons, re-read `baseTitle` so the bullet doesn't get baked in or doubled.

## 5. Known limits — accepted, not bugs

- **Safari collapses tabs to favicon-only as the strip fills.** So the title bullet dies exactly when a user has many tabs. It is a courtesy for the small number of people who read tab titles closely, not Safari coverage. Safari's real answer is the in-app dot.
- **Pinned tabs have no title.** Fine on the favicon path; means the Safari fallback goes fully dark on a pinned tab. Accepted.
- **The badge's keyline crosses outside the halo**, so where it extends past the silhouette the white stroke sits against the tab background rather than against sage. Verify this on a dark tab strip at 16px. If it reads as a floating white arc, clip the keyline to the mark's silhouette rather than reducing the badge — the silhouette break is load-bearing.

## 6. Verification checklist

1. `favicon-16.png`-scale render of the arrived SVG: nothing crosses the 48 box.
2. True 16px on all four tab backgrounds — inactive light, active light (white), inactive dark, active dark. The badge must read on all four.
3. Crowded strip, 10+ tabs: the badged tab is findable without being told where it is.
4. Pinned tab: badge present and uncropped.
5. Safari: title gains `• `, favicon does **not** change. No other browser gains the bullet.
6. Focus the tab: both channels clear, title restored exactly.
7. `brand/assets/` unchanged — `git status` clean under that path.
