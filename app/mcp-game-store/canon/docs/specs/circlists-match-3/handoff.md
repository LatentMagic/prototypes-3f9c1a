# Handoff: circlists-match-3 (footer, legal pages, not-found, loading)

Built 2026-10-07 from Part 3 of the prompt, using the text only. No Circlists legal text was read or copied.

## What was built, and where (`app/gs-site.jsx`)
- `GsFooter`: shown on home, the four game pages, Games, Pass and the legal pages (`GS_FOOTER` in `main.jsx`). Wide above 720px. Narrow at 720px and below, with the copyright dropping a line at 420px and the wordmark going at 300px.
- `GsLegal`: Terms and Conditions, Privacy and Refund Policy, opened from the footer and from the consent lines. They have the real headings, and every paragraph reads "This section isn't written yet."
- `GsNotFound`: any route the app doesn't hold.
- `GsSpin` / `GsFullLoader`: the brand spinner at 100px with no caption, announced as a status. Also used on return from a provider.
- `GsLoadFailed`: in place (two lines) and full screen (`GsOffline`, one line). Try again shows a loader, then the content.

## Staged states
`not-found`, `loading-full` (held), `loading-in-place` (held, on Games), `load-failed` (on Games), `cant-connect`. QA entry: `circlists-match-3`.

## Yours to decide: what I chose (for ratification)
- **Resources column:** included, with "Connect via MCP" (short form "MCP"), placed after the brand column. It goes to Connect your AI, or to sign up when signed out.
- **Wordmark and spinner:** the store's logo mark plus "[Platform]", as in the top bar. The spinner is the system's `Loader`.
- **Loading in place:** staged on Games.
- **Timings:** a 300ms withhold, then at least 600ms on screen once shown (`GS_LOADER`, `gsSettle`).

## Open or unresolved
- The prompt says "cream canvas". The store's canvas is the system's dark page, so I used that.
- The system has no monospace font. Footer headings, the "Last revised" line and the narrow footer's address use a system monospace stack (`--gs-mono`). This needs a decision in the design system.
- Legal "Back" is the browser's Back. Routes are now history entries, so it returns to where you came from.

## Next
Ratify, then clear the QA entry.
