---
date: '2026-10-08'
topic: 'delve-two-pages'
status: 'in-progress'
type: 'exploration'
---

# Handoff: delve-two-pages, the user's review of options 1 to 3

## Current Focus

The user reviewed options 1, 2 and 3 in the playground and gave feedback without making decisions, with one exception. They want this handed to another agent to help with two questions:

1. **How a product page works signed in and signed out.** The user is unsure about this and wants help. It matters most.
2. **How you get from the public page to Your Delve and back,** now that the main button can't do it.

Option 0 (today's page) wasn't reviewed. The Delve page design and the no-Pass player page are out of scope for now; the user will come back to them.

## Task(s)

- Done: the user reviewed options 1, 2 and 3. The feedback is in `review-2026-10-08-option-1.md`, `-option-2.md` and `-option-3.md`.
- Not done: no change to the playground. No option has been picked.
- Proposed, not accepted: an option 4 in which the button always starts play and a toggle compares routes to Your Delve (a link beside the button, "Yours" in the top bar, a strip with your streak). The user didn't take it up.

## Critical References

- `CLAUDE.md`: the ratification rule. Record only what the user ratified in words. The user is currently giving feedback, not decisions, so don't ask them to ratify each point.
- `CLAUDE.md`, product page rule: every line must make the game more appealing.
- Copy voice in the design-system guide: copy must stay true when the catalogue changes.

## Recent changes

- Added the three review files listed above. Each one separates what was ratified from what was only raised.
- Added this handoff and updated `README.md`.

## Learnings

### Ratified (user, 2026-10-08)
- The public page's main button works like an app store button: "Get" becomes "Open". It always starts play and never takes you to Your Delve.

### The user's direction, not ratified
- **Linking.** The public page and Your Delve must link to each other, and the link must be easy to find. None of options 1 to 3 does this with a button that always starts play:
  - Options 1 and 2 route through the button, which is now ruled out.
  - Option 3 routes through tabs.
- **Separate pages or tabs.** The user first said the two must be separate pages. After seeing that option 3's tabs are how Your Delve appears, they were unsure. This is still open.
- **Signing in.** Signing in from a product page must bring you back to that same page, now signed in. This differs from Circlists and needs to be said clearly.
- **Same page for everyone.** Showing the same public page whether you're signed in or out is fine, though it may look a little odd.
- **Viewer switcher.** "Shared link / no Pass / Pass new / Pass played" mixes axes. The real split is signed in versus signed out.
- **Top bar.** A "Yours" item under Games for signed-in viewers is fine. On the public page it shows but isn't selected. The breadcrumb's "Games" underline looks like a selected state, which reads oddly.
- **Facts row.**
  - Remove age (age ratings are going product-wide).
  - Remove "Players: solo" (no game has a multiplayer context).
  - Relabel "How often".
  - Move "AI essential" out of the row, since it's an internal tag. What the AI does can go in the right-hand content.
  - Fix the repetition with the kind label, possibly by turning those facts into tags.
  - What's left looks thin, but don't replace it with a line of text.
- **The "finished play" block.** Its purpose is unclear. It reads as a demo that nobody asked for.
- **The description goes stale.** The pitch tells this week's story, but Delve changes weekly. The user offered two routes: update the description with each release, or find an alternative. The agent suggested the pitch describes the game and This week's scene carries the story.
- **More games.** The user likes it.

### Product changes the user reported
- Delve no longer has a free first scene. Nothing in Delve is free without the Pass. The user says the CLAUDE.md product block doesn't need changing now; the Delve redesign will deal with it. The playground's free state and the Pass page line "The first scene of Delve" are out of date as a result.
- Daily Puzzles are always free, so their button logic will differ from Delve's.

### Gotcha for the playground
- Option 3 shows no tab row to a signed-out viewer, so it looks almost the same as option 1. The user couldn't tell them apart. Any comparison of signed-in behaviour needs a signed-in viewer selected.

## Artifacts

- `docs/specs/delve-two-pages/review-2026-10-08-option-1.md`
- `docs/specs/delve-two-pages/review-2026-10-08-option-2.md`
- `docs/specs/delve-two-pages/review-2026-10-08-option-3.md`
- `docs/specs/delve-two-pages/playground/index.html` and `pg-two-pages.jsx` (unchanged). The options are defined in `PG_OPTS` at `pg-two-pages.jsx:27`, and the button rules in `pgAction` at `pg-two-pages.jsx:77`.
- `docs/specs/delve-two-pages/handoff-2026-10-07-two-pages-playground.md`: the earlier handoff covering how the playground was built.

## Action Items & Next Steps

1. Help the user decide how a product page works signed in and signed out. Start from: the same public page for everyone, sign-in returns you to the page, and the button always starts play.
2. Design the route between the two pages, both ways, without using the main button. Then settle separate pages or tabs.
3. Update the playground to match:
   - Relabel the viewers by signed in or out.
   - Remove Delve's free scene.
   - Change option 3's "Play an earlier scene" to start this week's scene.
4. Keep for the Delve redesign: the facts row, the "finished play" block, the stale description.

## Other Notes

- The user is giving feedback at this stage. Write it down, and don't ask for ratification point by point.
- Keep chat replies short.
