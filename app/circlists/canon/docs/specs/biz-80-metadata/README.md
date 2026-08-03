# BIZ-80 — Card metadata enrichment

Original brief and the exploration handoff for enriching a Circlists feed card
with extracted metadata.

- `PROMPT.md` — the original prompt, verbatim.
- `handoff-2026-07-24_card-metadata-enrichment.md` — v1: the first 5-option exploration, structure, decisions, open questions.
- `handoff-2026-07-24_card-metadata-v2.md` — v2: image-forward 10-option regenerate after the user's review; real preview images wired in.
- `handoff-2026-07-24_card-metadata-v3-direction.md` — v3: narrowed to 4, **direction chosen (List dense — foot)**, spec settled; **blocked** on a structural footer-action ↔ image alignment tension. Also spun off a URL-fallback headline study.
- `handoff-2026-07-24_card-metadata-shipped.md` — **LANDED (needs correction)**: the enriched card (edge-matched dense-foot) is implemented in `app/feed.jsx`, seed items carry metadata, playgrounds cleaned to one reference. **Open blocker: the Swell door is not functional in the new card shape** — re-home it next session. Loading-state change pending from the user.
- `handoff-2026-07-24_swell-door-in-enriched-card.md` — **the door blocker worked**: 16-option exploration → user chose **option 12** (original door + hairline). Integrated a loose version into the real app; then the user set the essential rule — **action icons (tick / delete / door arrows) must sit within the preview image's horizontal band, only the emoji huddle extends left**. Tight geometry (gap 0, delete edge-locked, arrows in a tick-matched slot) landed in `feed.jsx`.
- `handoff-2026-07-24_drop-the-hairline.md` — **LANDED, user happy**: the permanent hairline between the two footer actions was **removed** on both tabs (knock-up + `app/feed.jsx`). The inset hover state-layer (`::before { inset:5px }`) now carries the separation; the footer is clean at rest. Don't re-add the hairline (the file name is now historical). Read this last.

Artifact: the card ships in the real app (`app/feed.jsx` via `circlists.html`). Durable reference: `Feed card — dense-foot reference.html` (+ `playground/cardref{,-data}.jsx`) — Edge-matched (shipped) + the 4 alternative structures, Density = small vs large thumb. v1/v2/v3 + URL-fallback playgrounds removed.
