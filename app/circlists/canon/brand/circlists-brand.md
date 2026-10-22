---
type: Concept
title: "Circlists Brand"
description: "Circlists's brand — one mark, one wordmark, one lockup: palette, type, mark geometry, and the tittle every surface shares, with the deterministic generators and raster exports."
tags: ["product", "brand"]
timestamp: 2026-10-22T00:00:00Z
---

# Circlists — brand

The brand identity of Circlists. The product it dresses: [circlists.md](../circlists.md).

Values here; pixels in the SVGs under [assets/](assets/). One mark, one wordmark — used everywhere, no per-context variants to keep in sync. The SVGs are shippable as-is; the generators in [scripts/](scripts/) regenerate them (and the raster exports) deterministically.

Every colour and type value here is restated from the prototype design system (`prototypes/app/circlists/canon/tokens.css`) and adds none of its own: the prototype is where they were drawn, and the live values are the web app's styles in the monorepo. [scripts/check_pack.py](scripts/check_pack.py) compares them. The mark, wordmark, lockup, icons and motion are this pack's own.

Formerly LatentPulse; renamed to **Circlists** (2026-07-07).

---

## 1. Palette

- **Emerald** `#047857` — the disc, the wordmark tittle, primary brand colour.
- **Sage** `#8BBFAD` — the halo (opaque). Reads at every size, on any ground.
- **Ink** `#0A0A0A` — the wordmark and body text.
- **Cream** `#FAFAF7` — the page / app ground, and the opaque ground baked behind the installed app icon (the installed-icon exception, §2).
- **White** `#FFFFFF` — the white ring in the mark.

**Text neutrals** — three steps, warm-leaning, all AA on cream and white:

- **Primary** `#0A0A0A` — body and titles. Same value as Ink.
- **Secondary** `#525252` — supporting text.
- **Tertiary** `#6E6E6B` — captions and meta.

**Other colour tokens the prototype defines**, each with the role `tokens.css` gives it:

- **Accent hover** `#036549`: 4% darker than Emerald.
- **Accent press** `#024F3A`: 8% darker than Emerald.
- **Accent ring** `rgba(4, 120, 87, 0.30)`: Emerald at 30%, the focus ring's colour token (--ring-color).
- **Accent soft** `#ECFDF5`: Soft emerald tint. Reserved.
- **New words** `#5E9C86`: Marks unseen content. Its own colour, not the sage: #8BBFAD fails WCAG 1.4.11 on the white surface and #5E9C86 clears 3:1. Dark value, for when a dark theme exists: #8BBFAD.
- **Border strong** `#0A0A0A`: Deliberate emphasis only.
- **Scrim** `rgba(10, 10, 10, 0.40)`: Overlay behind modal layers. Flat, no blur.
- **Destructive** `#991B1B`: Destructive actions and errors.
- **Destructive hover** `#7F1818`: Destructive, hovered.
- **Destructive press** `#641212`: Destructive, pressed.
- **Destructive ring** `rgba(153, 27, 27, 0.30)`: Destructive at 30%.

Not restated: `--color-accent-warm` and `--color-accent-cool`, which `tokens.css` marks as not approved fallbacks, and `--color-surface-raised`, which it reserves.

---

## 2. The mark (logo)

Three concentric circles — **sage halo → white ring → green disc** — and nothing else. No pad, no gradient, no letters, no tile *on the mark itself*. Three surfaces adapt it, all noted below: the installed app icon takes a ground, the notification icon takes a badge, and the notification badge becomes a single-colour silhouette.

Geometry, in a `0 0 48 48` box (keep these ratios at any size):

- **Halo** — `circle r=22.5`, fill `#8BBFAD`, opaque. ~47% of the box.
- **Disc** — `circle r=14.25`, fill `#047857`. ~30% of the box.
- **White ring** — `circle r=14.925`, no fill, stroke `#FFFFFF` width `1.35`. Its inner edge sits on the disc edge (r=14.25), so the green disc stays full and the ring reads as a thin separator into the halo.

The halo reaches 46.5 of the 48 box, so the mark carries no built-in padding.

**One mark, and the tab favicon *is* that mark.** The halo is **opaque**, not transparent — so the mark reads at 16px on a light *or* dark background with no help. The browser-tab favicon is therefore the bare mark on transparency, no tile, at **full size** — tested on light and dark tabs, it holds without a ground. See [circlists-mark.svg](assets/mark/circlists-mark.svg); the tab set ([favicon.svg](assets/icons/favicon.svg), `favicon.ico`, `favicon-16/32.png`) carries this.

**The notification icon is the mark carrying an arrival badge.** A **`circle r=9.4`** at `cx=36 cy=36`, fill `#047857`, behind a keyline of the same **`#FFFFFF` width `1.35`** as the white ring — the badge is built from the mark's own vocabulary, so it reads as construction rather than something stuck on. It sits low-right and deliberately **breaks the halo silhouette** by ~3.9 units; that break is what makes it detectable at 16px, so it is never tucked inside the halo. Its outer edge lands at 46.75 of the 48 box, inside the mark's own 46.5 margin. The mark itself is untouched — this is a **state**, swapped in while something waits and swapped out when it does not, never a redrawing. Static in every state: no motion belongs here. See [favicon-notification.svg](assets/icons/favicon-notification.svg).

**The installed app icon is the deliberate exception — an opaque ground.** iOS and Android home-screen icons cannot take transparency: they fill a transparent icon's corners with **black**, which reads as a small, muddy mark on a harsh tile. The rule generalises: **any surface where we can't control the surrounding colour** — installed icons, clickable app tiles, uncontrolled-background raster — bakes an opaque **cream** (`#FAFAF7`) ground under the *frozen* mark, held smaller (**~72%**) for breathing room. Cream keeps the full mark visible — halo, white ring, and the emerald disc as the focal point — and sits lighter alongside the light-ground apps a home screen is full of. The mark does not change; only a ground is added because the surface demands a filled square. Every raster is **supersampled** (rendered at 4× then downscaled) so the thin white ring stays crisp at small sizes.

**The installed icon ships in two forms, split by who rounds the tile.** A PWA manifest's `purpose` decides this, and the [web-app-manifest standard advises separate `any` + `maskable` icons, never the deprecated `"any maskable"`](https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html):

- **`maskable` — phones round it.** iPhone and Android mask the tile to their own squircle, so the file stays a **hard opaque square**, full-bleed cream, mark at ~72% inside the safe zone. See [maskable-icon-192.png](assets/icons/maskable-icon-192.png) · [maskable-icon-512.png](assets/icons/maskable-icon-512.png).
- **`any` — nobody rounds it, so we do.** Desktop PWA (macOS dock, Windows) shows the file **as-is, unmasked** — a hard cream square, which reads unfinished. So the rounding is **baked into the file**: the same cream tile and ~72% mark, corners cut to a squircle (radius ~22% of the tile) with **transparent** corners. See [icon-192.png](assets/icons/icon-192.png) · [icon-512.png](assets/icons/icon-512.png). This is the plainly-named default per the standard; the maskable variant carries the qualifier.

[apple-touch-icon.png](assets/icons/apple-touch-icon.png) (iOS home) stays a hard square — iOS rounds it itself, exactly like `maskable`.

**The native app icon is the same installed icon, in the formats Android and iOS ask for.** The mark's halo spans **72% of the visible tile** on both OSes: the whole file on iOS, the inner 72 dp of Android's 108 dp adaptive layer. Where an OS themes the icon (Android's themed icons, iOS's tinted appearance), it gets the **notification badge's silhouette**, because both read one channel: Android takes the shape and iOS takes the brightness. iOS's dark appearance is the full mark on transparency. See [assets/native/](assets/native/README.md).

**The notification badge is the mark as a single-colour silhouette.** Android's notification header and status bar show the Web Notifications `badge` using only its shape: the OS throws the colour away and applies its own tint. The full mark would show as a plain dot there, and with no badge at all Chrome shows its own logo instead. So the badge keeps the mark's geometry and changes which parts are solid: the **halo and disc are solid**, and the **white ring is a transparent gap**. The gap is widened to **1.8** (from the ring's 1.35), centred on the same radius, so it stays open at 16px. The fill is **black on transparency**. Android ignores it, but black is what makes the file readable as a brand asset when anyone opens it. Never change it to emerald or add a ground. The badge file itself stays black on transparency. The mark does not change: the installed icon adds a ground because the surface needs a filled square, and the badge cuts out the ring because the surface reads only one channel. See [notification-badge.svg](assets/icons/notification-badge.svg) · [notification-badge-96.png](assets/icons/notification-badge-96.png).

---

## 3. The wordmark

**"Circlists"** in **Inter Bold (700)**, letter-spacing `-0.01em`, sentence case, always one word.

- **Outlined to vector paths** — font-independent, renders identically everywhere with no font loaded.
- **Colour** — Ink `#0A0A0A` on light grounds; Cream `#FAFAF7` reversed on dark grounds.
- **The tittle** — a green `#047857` dot on the **second** `i` (in "l**i**sts"); the first `i` keeps its native black dot. The green tittle is **⌀ 0.25 × cap-height** and its centre is **raised to 1.18 × cap-height above the baseline** — it floats deliberately above the caps, and reads a touch larger than the native i-dot.

Two files, **geometrically identical — only the ink colour differs**:
[circlists-wordmark.svg](assets/wordmark/circlists-wordmark.svg) (ink) · [circlists-wordmark-reversed.svg](assets/wordmark/circlists-wordmark-reversed.svg) (cream).

---

## 4. Lockup

Mark left of the wordmark, vertically centred on the wordmark's cap-midpoint. Mark height = **1.5×** the wordmark's cap-height; gap = **0.4×** cap.

Composed **deterministically** by [build_lockup.py](scripts/build_lockup.py) — it parses the wordmark's own baseline transform, so the alignment is never eyeballed and regenerates whenever the mark or wordmark changes. Shipped as drop-in assets for apps + sites:
[circlists-lockup.svg](assets/lockup/circlists-lockup.svg) (ink, light grounds) · [circlists-lockup-reversed.svg](assets/lockup/circlists-lockup-reversed.svg) (cream, dark grounds).

---

## 5. Type

**Inter** — the main text. Inter Bold (700), letter-spacing `-0.01em`, sentence case, one word.

**JetBrains Mono** — the accent, carrying small labels and standalone link text.

Both families load from Google Fonts (`https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap`), as `tokens.css` does. The pack vendors only the Inter variable file, with its OFL licence, to outline the wordmark.

**Type scale**, from `tokens.css`. Sizes, line heights and tracking are listed there separately, and are restated as listed; the pack pairs none of them.

- Weights:
  - **Regular** `400`
  - **Medium** `500`
  - **Semibold** `600`
  - **Bold** `700`
- Sizes (a 4px grid):
  - **xs** `12px`: Mono caption, badges.
  - **sm** `13px`: Secondary body, meta.
  - **base** `15px`: Body.
  - **md** `16px`
  - **lg** `18px`
  - **xl** `20px`
  - **2xl** `24px`
  - **3xl** `32px`
  - **4xl** `40px`: Hero, brand moments only.
- Line heights:
  - **tight** `1.25`
  - **snug** `1.35`
  - **normal** `1.5`
  - **relaxed** `1.6`
- Tracking:
  - **tight** `-0.01em`: Large titles.
  - **normal** `0`: Body.
  - **wide** `0.02em`: Mono labels and all-caps text.

**Link text — two forms, split by whether the link sits in a sentence.**

- **Standalone** — a link on its own, not inside prose (`support@circlists.com`). JetBrains Mono, Ink `#0A0A0A`, underlined.
- **Inline** — a link inside a sentence ("…you can **champion your own**."). Inter, Emerald `#047857`, underlined. The underline is always present, never hover-only: touch surfaces have no hover, so a hover-revealed underline would leave the link carried by colour alone on every phone.

**Underline values** are the prototype's, not this pack's:

- **Inline**, prototype value, the `.circ-doorlink` rule (`canon/circlists.html`, line 330): 1px thick, 2px below the text, Emerald at 35% at rest (`color-mix(in oklab, #047857 35%, transparent)`), full Emerald on hover and focus-visible, easing over 150 ms (`--duration-base`) on `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-quiet`), no transition under reduced motion.
- **Standalone and any bare link**, prototype value, the bare `a` rule (`tokens.css`, near line 254): 1px thick, 2px below the text, border-1 `#DCDCD8` at rest, Ink `#0A0A0A` on hover. The mono face is this spec's; the rule sets none.

**Buttons are owed.** No ladder yet — tiers, fills, and sizes are undefined.

---

## 6. Motion

Three animated treatments of the same mark, each falling back to the static mark under `prefers-reduced-motion`. Each one's rules and exact values are in [circlists-motion.md](assets/motion/circlists-motion.md). Geometry and palette are this spec's; the motion adds nothing to the mark. Never redraw it.

- **Pulse** ([circlists-pulse.svg](assets/motion/circlists-pulse.svg)): the idle breathing mark. The sage halo breathes and brightens in lockstep on a hand-sampled curve, a 3 s cycle, while the disc and white ring hold still.
- **Spinner** ([circlists-spinner.svg](assets/motion/circlists-spinner.svg)): the loading state. A sage arc on r 19.05 rotates while its length grows and shrinks; the file ships at 1.4 times the reference pace.
- **Micro** ([circlists-micro.svg](assets/motion/circlists-micro.svg)): the ~10 px live-signal dot. A band of sage light sweeps across the halo, a 3.8 s cycle; nothing scales.

The three files are hand-authored sources, not generated. `build_motion.py` checks them against `brand_tokens.py`.

**Validate the motion in a real browser.** A headless or scripted screenshot routinely grabs only the resting frame and reports a working asset as dead; treat that verdict as inconclusive until the motion has been seen in a browser.

---

## 7. Rulings

The owner's rulings on this pack, each traced to its source:

- **The inline link is Emerald.** The journal's words: "Green is also the app's link colour, and a link is itself a primary action" (2026-07-27). Ruled in the lm-561 journal, in the business-ops repo at `work/apps/circlists/_archive/lm-561-in-app-sales/_context/journal.md`, under "The doors built, and the ticket written for the person who picks it up", and written into this spec in wiki commit `bc96d8d` (2026-07-27), which also made the underline permanent.

---

## 8. What's in this pack

Layout — the two "read me" surfaces at top, assets and machinery split into subdirs:

**Top** — [circlists-brand.html](circlists-brand.html) is the visual board (generated; never hand-edit); this spec describes the pack and restates its values, which `scripts/check_pack.py` compares with the prototype's `tokens.css`; [README.md](README.md) is the directory guide.

**In [assets/](assets/)** — the shippable output, one directory per thing. Each logo directory holds **both formats**: the SVG (the master, shippable as-is) and its PNG exports. Full list in [assets/README.md](assets/README.md).

**The SVG is the default.** The PNGs are the raster exports of the SVGs. Geometry is the SVG's, rendered straight to raster on transparency, at two sizes; the number is the **long edge**.

- **[mark/](assets/mark/)** — `circlists-mark.svg`, the canonical mark, transparent, as-is; source for every derivative below. Plus `circlists-mark-512.png` · `-1024.png` — the transparent square raster.
- **[wordmark/](assets/wordmark/)** — `circlists-wordmark.svg` · `-reversed.svg`, ink (light) and cream (dark), plus each at 1024 and 2048 wide.
- **[lockup/](assets/lockup/)** — `circlists-lockup.svg` · `-reversed.svg`, ink and cream (generated), plus each at 1024 and 2048 wide.
- **[icons/](assets/icons/)** — the favicon and installed-icon set, the mark composed on a ground at the sizes the browser and OS dictate:
  - `favicon.svg` — the tab favicon: the bare mark on transparency, full size (geometry identical to `circlists-mark.svg`; kept as a stable `<link rel=icon>` target).
  - `favicon.ico` — packs 16·32·48 for classic browser tabs (transparent, full mark).
  - `favicon-16.png` · `favicon-32.png` — modern `<link rel=icon>` (transparent, full mark).
  - `favicon-notification.svg` · `favicon-notification-16.png` · `favicon-notification-32.png` — the **notification icon**: the mark plus the arrival badge (§2), swapped into the tab while something waits. Built by reading the mark and appending the badge, so it never drifts from it.
  - `notification-badge.svg` · `notification-badge-96.png` — the **notification badge**: the mark as a black silhouette on transparency, ring cut out as a gap (§2). The 96px PNG is the Web Notifications `badge` (Android notification header and status bar).
  - `apple-touch-icon.png` (180) — iOS home screen. **Opaque cream ground**, mark ~72%, hard square (iOS rounds it), supersampled (see §2 — the installed-icon exception).
  - `icon-192.png` · `icon-512.png` — PWA manifest **`any`** (desktop: macOS dock, Windows). **Cream ground, corners rounded into the file** (transparent outside the squircle), mark ~72%, supersampled — because desktop shows the tile unmasked.
  - `maskable-icon-192.png` · `maskable-icon-512.png` — PWA manifest **`maskable`** (iPhone + Android). **Opaque cream ground, hard square**, mark ~72% (safe zone), supersampled — the phone OS masks the tile to its own shape.
  - `app-store-icon-1024.png` — Apple App Store listing icon. Same composition as the maskable icon at 1024×1024: **opaque cream, hard square, no alpha channel** (Apple rejects one); Apple rounds it. Google Play's store icon is `play-store-icon-512.png`: the same composition at 512×512, kept 32-bit with every pixel opaque, as Play asks.
- **[motion/](assets/motion/)** — `circlists-pulse.svg` · `circlists-spinner.svg` · `circlists-micro.svg`, the animated treatments, and `circlists-motion.md`, the motion rules and values (§6). Hand-authored, not generated.
- **[native/](assets/native/README.md)** — the native app's icon sources (Capacitor, Android + iOS), rasters 1024 square: square 1024 px sources for the native icon sets (`icon-only`, `icon-foreground`, `icon-background`), the Android themed-icon layer (`ic_launcher_monochrome.xml` + its raster preview `icon-monochrome.png`), and the iOS dark and tinted icons (`ios-icon-dark.png`, `ios-icon-tinted.png`).

**In [scripts/](scripts/)** — the deterministic generators (+ their font input). See [scripts/README.md](scripts/README.md) for the regenerate order:

- `brand_tokens.py` — every colour, type and geometry value once; the scripts read from it.
- `build_mark.py` — draws the mark from `brand_tokens.py`.
- `wordmark-outline.py` — outlines the wordmark from `inter-latin-wght-normal.woff2`, the vendored Inter (licence in `OFL.txt`, the SIL Open Font License 1.1 with Inter's copyright line, from rsms/inter).
- `build_lockup.py` — composes the lockup(s).
- `build_rasters.py` — the icon set and the native app icons from the mark, and the PNG export of every shippable SVG.
- `build_motion.py` — checks the animated SVGs in [motion/](assets/motion/) against `brand_tokens.py`.
- `build_board.py` — bundles everything into the board: one page, six tabs (Logo, Icons, App icons, Motion, Colour, Type).
- `build_all.sh` — runs the generators in order and rebuilds the whole pack from a clean `assets/`.
- `check_pack.py` — checks the values against the prototype's `tokens.css` and the spec's file list and numbers against `assets/` and the scripts.

**How the wordmark was made:** outlined from Inter (variable, instanced to weight 700) with `fonttools`; the green tittle is laid as a real vector circle at the ratios above.
