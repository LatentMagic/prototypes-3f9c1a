---
date: '2026-10-15'
topic: 'store-listings'
status: 'in-progress'
type: 'implementation'
---

# Handoff: store-listings — App Store and Google Play page mocks, with a tappable screenshot viewer

## Current Focus

The owner is reviewing the two store pages. The last thing landed is the full-screen screenshot viewer (tap a screenshot, swipe or arrow-key between shots, Done / back arrow / Esc to close); the owner has not yet confirmed it is the behaviour they expected. Nothing is blocked. Background: the access question (where the pages live) is ratified and closed.

Route to the surface: open `circlists.html` → dark pill, bottom right → **States** → group **Store listings** → *Store listing: Apple App Store (iPhone)* or *Store listing: Google Play (Android)* → tap any screenshot.

## Task(s)

Done this session:
- Built both store pages as a deletable review aid (`app/store-listings.jsx`), reached from the States palette and by address. Earlier handoff in this folder covers the first pass.
- Caption change: screenshot 1 on both pages now reads "Stay on the pulse with *your circle*" (accent on "your circle").
- Added the full-screen screenshot viewer (`SlViewer`) on both pages.

Ratified by the owner, 15 Oct:
- Access is the **States palette only**. No dedicated button, no Config dropdown, no Platform forced, not pinned to the top of the palette (offered, declined).

Open for the owner (not blocking): confirm the viewer behaviour; review copy and shots (QA → Store listings).

## Critical References

- `CLAUDE.md` — ratification rule; a state is a scenario, never a width; deletable aids.
- `GOTCHA.md` §5 — a transform captures `position: fixed`; the viewer relies on this so it pins to the phone screen inside the frame.
- `ARCHITECTURE.md` → Deletable aids (row for `app/store-listings.jsx`).

## Recent changes

- `app/store-listings.jsx` — whole module. Key parts: `SL_APPLE_SHOTS` / `SL_PLAY_SHOTS` (captions; `*…*` marks the accent phrase), `SlFrame` (cream caption-over-screen frame), `SlViewer` + `slShotBtn` (viewer; each shot wrapped in a `<button>` with "Screenshot n of N"), `CircStoreAppStore`, `CircStoreGooglePlay`.
- `app/main.jsx` — routes `store-app-store`, `store-google-play`, guarded on `window.CircStore*`; both in `CIRC_UNRESUMABLE`.
- `app/states.jsx` — group `Store listings`, ids `store-listing-app-store`, `store-listing-google-play`.
- `app/qa.jsx` — `CIRC_QA` entry `store-listings`.
- `circlists.html` — script tag after `app/startup.jsx`.
- `ARCHITECTURE.md`, `CHANGELOG.md` (one entry, "Store listings as review states"), `github.md` (Last sync).
- `uploads/store-listings/` — the ten PNGs, moved from where the upload landed.

## Learnings

- The viewer's `position: fixed; inset: 0` lands on the phone screen in Mobile view because `.circ-phone-clip` carries a transform (GOTCHA §5). On a desktop window it covers the whole viewport, which is right for a phone-only page shown as a column. Nothing to add to GOTCHA.
- Store chrome deliberately uses no Circlists tokens (Apple blue `#0A84FF`, Play green `#01875F`, Inter/Roboto loaded only while a store page is open). Do not "fix" this; the design-system lint nudges are expected.
- Verification was by the background verifier only; neither page nor the viewer has been looked at by the owner in Mobile view yet.

## Artifacts

- `app/store-listings.jsx`
- `docs/specs/store-listings/README.md`
- `docs/specs/store-listings/handoff-2026-10-15-store-listings.md` (first pass; decisions and chrome detail)
- this file

## Action Items & Next Steps

1. Owner confirms the viewer behaviour (open question from chat).
2. Owner reviews copy and shots; any edit to captions goes in `SL_APPLE_SHOTS` / `SL_PLAY_SHOTS`, description copy in `SL_DESC_HEAD` / `SL_DESC_TAIL`.
3. Carried from the first handoff, still unruled: Play third chip (`No reviews yet` built; brief also says `New`); Apple link labels use the deck's field names, not Apple's; store chrome labels not in the deck ("Search", "Ratings", "Age", "Category", "Information", "Seller", "Copyright", "About this app", "App support", "Get", "Install").

## Other Notes

- Never infer a candidate build from this work; it is a review aid in `app/`, not a second state of the app.
- Delete `app/store-listings.jsx` and its script tag to remove the pages; the two routes then render nothing and the register group goes stale.
