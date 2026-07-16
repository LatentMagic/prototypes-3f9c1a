# Changelog — Circlists homepage

A running record of changes to the public homepage.

## 2026-07-12

- **Updated the hero's live-app demo to a new build.** `uploads/homepage-demo/`
  now carries the app's own motion pack — the header pulse, loading spinner,
  and live-dot all animate inside the demo itself, matching the treatments
  above. `demo-embed.html` regenerated over the new build; the embed seam
  (`?layout=`, forced gate) is unchanged.

- **Synced the animated mark to the new motion pack.** Three treatments moved
  in step with the updated brand spec (`uploads/motion/`): the header lockup's
  **breath is slightly deeper** (peak scale +6.5% → +7.5%; tone/brightness
  unchanged); the loading spinner is now **~100px** and runs at the new **1.4×
  pace** (rotation 1.917s → 1.37s, arc-breathe 2.5s → 1.79s); and the ~10px
  live-dot (demo hint + changelog "live") was re-treated to **"ring reveal"** —
  a sweeping sage band paints the halo in around a dead-still green core,
  replacing the old scale-breath that read as a tiny second pulse at that size.
  All wired inline + `css/16-motion.css` as before; geometry and palette
  untouched.

- **Fixed the loading spinner reading as a static blob, not motion.** The
  rotating sage arc was drawn over a full static sage disc of the *same* colour
  (`cl-halo-static`), so the spin ran but was invisible — "no spinner / just
  clutter" (see the now-resolved `HANDOFF-spinner-contrast.md`). The full sage
  halo is really the *reduced-motion* resting state, so it's now hidden during
  motion: the arc reads against the poster and the still green core, and a
  redundant layer drops away. Reduced motion swaps the arc back for the full
  static halo. No colour or geometry change.

- **Added a "Demo state" control to the Config launcher.** Alongside Viewport,
  a new row pins the hero demo on **Auto / Loading / Armed / Live** so each
  state is reviewable on demand — most usefully Loading, to sit and watch the
  brand spinner. It's a prototype aid only, talks to the demo through a small
  `window.CirclistsDemo` hook (keeping the launcher decoupled), and is **not
  persisted**, so a reload always returns to Auto and never strands the hero on
  a spinner.

## 2026-07-10

- **Embedded the hero's live-app demo.** The hero now iframes a real, working
  prototype of the app (`demo-embed.html` over `uploads/homepage-demo/`)
  instead of a static screenshot — visitors can click around before signing
  up. The frame lazy-loads, shows a branded loading poster, passes a
  `?layout=` param so the app renders desktop vs. mobile UI correctly inside
  the iframe's own width, and scales to a fixed logical width on phones to
  dodge iframe viewport quirks. The app itself is vendored and untouched; see
  `DEMO.md` for the split and its gotchas before editing either side.

## 2026-07-09

- **Footer now shows the wordmark alone, not the full lockup.** With the mark
  already carried by the header and the favicon, repeating it in the footer
  was redundant — especially now that the header's sticky, so the mark stays
  on screen throughout. Footer keeps the Circlists wordmark only.

- **Reworked hero, sub-headline, and section copy to drop "read" as the only
  verb.** Circlists now carries links people watch and listen to as well as
  read, so copy that implied reading-only ("Stay on the pulse with the people
  you read with", "Read at your own pace") undersold the product. New lines:
  "Stay on the pulse with your circle," "Read, watch or listen at your own
  pace — only your view changes," and "For the people you share with." The
  carousel's third caption is now "At your own pace" for the same reason.

- **Added a persistent top toolbar with Sign in / Sign up.** The site now needs a
  clear way into the app. Reviewed how Linear, Notion, and Stripe handle it;
  **Linear** was the reference we chose — a slim bar that stays the same colour as
  the page, separated only by a hairline rule, with a quiet secondary action and a
  filled primary pushed to the right. Adapted to our use case: wordmark left,
  **Sign in** (secondary) + **Sign up** (primary) right. Sticky, cream, single
  accent — in keeping with the calm posture. Top-of-page whitespace was trimmed to
  suit the new bar (likely to need further tuning).

- **Removed the email-capture / newsletter form.** It existed to notify people
  when Circlists opened — a job that no longer exists. Keeping it would mean
  standing up and maintaining a newsletter (cadence, sending tool, deliverability,
  unsubscribe handling) for a weak, cold list, when the emails that matter are
  already captured at signup. There's no SEO benefit to email either. The
  community-comms value lives on in the changelog section, which is public,
  indexable, and zero marginal overhead. Revisit a newsletter only if there's a
  real editorial voice and distribution need behind it.

- **Removed redundant hairline dividers (pricing block + footer).** The top and
  bottom borders on the "one person funds the circle" section were crowding its
  edges — the bottom one sat right above the "What's new" panel's own edge. The
  footer's top border was the same story: it doubled up under the fully-bordered
  changelog card above it. Dropped all three; these blocks now separate on
  whitespace and existing card edges alone.
