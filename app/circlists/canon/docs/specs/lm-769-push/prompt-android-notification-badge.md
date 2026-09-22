# Prompt — add the notification badge to the Circlists brand pack

Add one new shippable asset to the brand pack: the **notification badge**, the
monochrome silhouette of the Circlists mark used in the Android notification
header and status bar. Generate it deterministically from the existing mark,
the same way every other raster in the pack is generated, and document it in the
brand spec.

## Why it has to exist

The Web Notifications API's `badge` field maps onto Android's notification
**small icon**, which also appears in the status bar beside the clock. Since
Android 5.0 the OS guarantees that glyph reads on any wallpaper and in any theme
by discarding colour entirely: it keeps only the **alpha channel** and applies
its own tint. MDN's `showNotification()` reference states the badge should
accommodate devices up to 4× — about 96×96px — and that the image is
automatically masked.

Consequences, both of which force a new asset rather than reuse:

1. **The existing mark cannot be passed.** `circlists-mark.svg` and every raster
   derived from it are opaque across the full disc, so their alpha channel is a
   solid circle. Android draws a solid dot — legible as a dot, unrecognisable as
   ours. The sage halo, the white ring and the emerald disc all vanish, because
   all three are *colour*, and colour is what gets thrown away.
2. **Passing nothing is worse.** With no `badge`, Chrome substitutes its own
   glyph, so the Chrome mark sits in the header where ours belongs.

## The design — the mark, re-expressed in alpha

The geometry does not change. What changes is which part is ink: **the halo and
the disc become opaque; the white ring becomes the transparent gap.** The mark's
own structure then survives on the alpha channel alone, and reads as two
concentric circles at 16dp in a single colour, in either polarity.

In the mark's `0 0 48 48` box (ratios per `brand/circlists-brand.md` §2):

| Part | Mark | Badge |
| --- | --- | --- |
| Halo | `circle r=22.5`, `#8BBFAD` | opaque |
| White ring | `circle r=14.925`, stroke `#FFFFFF` w `1.35` | **transparent** — cut out |
| Disc | `circle r=14.25`, `#047857` | opaque |

Net shape: an outer annulus (r 22.5 → ~15.6) and an inner disc (r ~14.25),
separated by a transparent ring.

Two judgement calls to make and record:

- **Ring width.** The mark's 1.35 was drawn for a ring rendered in white against
  two fills. As a transparent gap at 16dp it will close up under antialiasing.
  Try **1.6–1.8** and pick the value where the gap is still visibly open in the
  16dp preview; do not go so wide that the badge reads as two unrelated rings.
- **Fill colour of the opaque parts.** Irrelevant to Android, which only reads
  alpha — but convention, and our own previewing, favour **pure white
  `#FFFFFF`** on transparency. State this in the spec so nobody "fixes" it to
  emerald later.

## Output

In `brand/assets/`:

- `notification-badge.svg` — vector source, `0 0 48 48`, white on transparency.
- `notification-badge-96.png` — 96×96, transparent, **supersampled** (render at
  4× then downscale) exactly as `build_rasters.py` already does, so the gap stays
  crisp.

Do not add colour variants, do not add a cream tile, and do not round anything —
this asset is never shown as a tile. It is a silhouette.

## Generator

Add it to `brand/scripts/build_rasters.py` (or a sibling if that script's shape
makes it cleaner), driven from the same geometry constants as the mark, so it
regenerates whenever the mark changes and cannot drift from it. Update
`brand/scripts/README.md`'s regenerate order.

## Documentation

- **`brand/circlists-brand.md` §2** — add a subsection after the installed-icon
  exception. The framing to keep: *the mark does not change; the installed icon
  adds a ground because the surface demands a filled square, and the notification
  badge inverts the ring because the surface demands a single channel.* Both are
  the same principle — the surface dictates, the geometry holds.
- **§6 "What's in this pack"** — list both new files with a one-line note each.
- Regenerate `brand/circlists-brand.html` via `build_board.py` (generated file;
  never hand-edited) so the badge appears on the visual board, shown at 16dp and
  at 96px, on both a light and a dark ground.

## Acceptance

- At 16dp, on a dark header and on a light one, the badge reads as two
  concentric circles — not a dot, not a ring with a filled hole ambiguity.
- Flattened to one colour in either polarity, it is still recognisably the mark.
- Regenerating from scratch reproduces both files byte-identically.
- Nothing in the existing pack changed.

## Out of scope

The push layer itself — `title`, `tag`, `renotify`, tap target — and the
notification's copy. Those are specified separately; this is the asset only.
Safari ignores `badge` entirely, so this affects Android and desktop Chrome.
