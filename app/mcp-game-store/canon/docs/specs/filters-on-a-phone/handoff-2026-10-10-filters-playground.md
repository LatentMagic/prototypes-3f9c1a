# Filters on History and the Library: playground built

2026-10-10. Brief: the playground prompt of 2026-10-10 (Joe's statements in `_context/log.md`, "Filters take too much room on a phone" onwards). The scope covers both lists on a phone and on desktop. Nothing here is ratified.

## What was built, and where
- Entry: `docs/specs/filters-on-a-phone/playground/index.html`. Module: `pg-filters.jsx` in the same folder. Listed in `playgrounds.json`.
- The rig is the real app with a bottom strip. It opens on History with the Pass. The strip holds **Filters 0 to 3** (Why opens each option's stance and cost) and **Go: History / Library**. The app's demo bar stays below it. Config sets the viewport (Auto or Mobile); the phone is 390px.
- Selection persists in `localStorage` under `pg_filters_v1`.

## The options
- **0 · Today.** The app as it stands.
- **1 · One Filters button.** Search stays on the page. Every choice sits in one panel behind a secondary "Filters" button, which reads "Filters · 2" when two choices are changed, with a muted line under it naming them. The panel is a bottom sheet on a phone and a centred window on desktop. Its one button reads "Show plays", "Show editions" or "Show games". The list takes the full width on desktop. Cost: changing one choice takes two taps.
- **2 · A control per filter.** Each filter becomes one control showing its label and current choice (a changed one gets an off-white outline). Tapping it opens the design system's `Menu`, with a tick on the current choice. On a phone the controls wrap under search. On desktop, search and the controls share one bar above a full-width list. Cost: you only see the current choice, and Show's menu grows with the games played (eight items in the seed, over the Menu's guide of about six).
- **3 · Folded in place.** On a phone, one `Disclosure` titled "Filters", or "Filters · Oldest first, Replays" when choices are changed, holds today's choices. On desktop the side column stays, and each filter is its own Disclosure titled with its current choice. Cost: desktop still spends a column, and a phone hides the choices until the fold opens.

## Choices made, and why
- **The filtering itself is the app's.** I added one seam to `app/`: `window.LbTools` in `gs-library.jsx`, which renders the same `<aside className="lb-tools">`. `gs-history.jsx` and `gs-discover.jsx` now use `<window.LbTools>`. The app's output does not change. The playground replaces `LbTools` and re-lays the page's own `SearchField` and `LbChoice` elements, so every pick runs the page's own handler.
- Search stays visible in every option, because it is the quickest way to a row.
- "Changed" means a choice other than the first option, which is every filter's default today.
- Options 1 and 3 reuse `LbChoice` as it is. Option 2 uses `DS.Menu` as it is, adding only an indent so labels line up beside the tick.
- No Pass mark or hint appears in any filter. Discover's All games filters are untouched.

## Not built or unresolved
- In option 3, the desktop folds are independent: opening one does not close another, because `Disclosure` keeps its own state.
- In option 2 on a phone, a menu lines up with its control's right edge when there is no room to its right. This is measured, not taken from the design system.
- The new copy ("Filters", "Filters · 2", "Show plays", "Show editions", "Show games") has not been ratified.
- The seam in `app/` needs the owner's OK before it is carried back to the repo.

## What I would do next
Open the rig on a real phone, compare how far each option leaves you from the first row of History, and pick one direction per list (or one for both) for ratification.
