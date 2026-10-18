---
date: 2026-10-16
task: Kit update, comments never cite docs/ paths; archive only when asked
status: landed
---

# Handoff: comments never cite `docs/` paths

## Landed
- `ARCHITECTURE.md` § Conventions: added the bullet "Comments never cite a `docs/` path" word for word. The kit places it before "- **Prefix.**", but this project has no Prefix bullet, so it goes last in the section, after "State". That placement is my call.
- `CLAUDE.md` § Files: the bullet `docs/archive/<topic>/` is replaced word for word.
- `CLAUDE.md` § Wrapping up: the whole block `<important if="you or the user settle a decision that no upstream spec holds yet">` was added word for word, after the last `</important>` block in that section. The project never had it. The kit agent gave the block on 2026-10-16.

## Changed: comments only, no code
Every hit had the pointer removed. Each rule and reason stays.
- `app/invite-link.jsx:17-19`: dropped the path of the swap rig.
- `app/home-returns.jsx:12-14`: kept "COMPOSITION, ratified 2026-09-21 (LM-652)" and dropped the study path and the note filename.
- `app/share-intake.jsx:30-31`: the path became "held-link option board, option 01".
- `app/share-intake.jsx:63-64`: the path became "the signed-out-lead option board".
- `app/talk-return.jsx:29-30`: dropped the handoff path.
- `app/talk-return.jsx:104-106`: the header is now "clearing the bar (ratified 2026-09-21)".
- `app/feed.jsx:768`: dropped "; docs/specs/champion-leave".
- `app/store-listings.jsx:2`: dropped the folder path.
- `app/seed-data.jsx:63`: dropped the folder path.
- `app/pricing-states.jsx:61`: the comment is now "As shipped (8 Oct)."
- `docs/specs/card-title-editing/playground/`: the header comments in `pg-title-clear.jsx`, `pg-title-restore.jsx` and `pg-title-removal.jsx`, and the HTML comment in `card-title-clear.html`, `card-title-restore.html` and `card-title-removal.html`.
- `docs/specs/lm-652-discourse/playground-clear-in-circle/pg-cc-topbar.jsx:2` and `playground-circle-attribution/pg-hp-topbar.jsx:2`: the path became "the clearing-conversations rig's pg-clr-topbar.jsx".
- `docs/specs/lm-652-discourse/playground-circle-attribution/pg-hp-store.jsx:91-92`: the path became the bare `pg-clr-store.jsx`.
- `docs/specs/a3-invite-link/playground/circlists-a3-transition.html:547`: dropped the folder path from the CSS block title.
- `app/talk-parts.jsx:130`: `playground/wb-edit-commit.html` became `wb-edit-commit.html` (owner, 2026-10-16: a partial path is cut to the bare filename). It was the only partial path in an `app/` comment.

## Decisions copied out of comments, to travel upstream
- **2026-09-21, LM-652. The home Conversations panel is composed as four decisions:** the head carries intent and no count; the circle lives on the row's metadata line; and two more. The full text is in `app/home-returns.jsx` under "COMPOSITION".
- **2026-09-21. Clearing the returns bar** moves `talkSeenAt` forward on every card the bar stands for. Nothing is deleted or marked read. It is a footnote, not a row, a band or a button. Source: `app/talk-return.jsx`, "clearing the bar".
- **Undated (the comment-reactions work, about 2026-09-28). Comment reactions reach the returns bar:** reactions others placed on your words since your mark, author-only, and the list shows what stands now. Source: `app/talk-return.jsx:29`.
- **2026-08-19. A card's rows in the returns bar start at the mark** ("MARKED READ"). Source: `app/talk-return.jsx:26`.
- **Undated (LM-771, about 2026-09-23). The held link on the share picker** has no left fade (option 01). Source: `app/share-intake.jsx:30`.
- **2026-09-23, LM-771. What signing in is for lives in the sign-in card's subtitle** (option 03). Source: `app/share-intake.jsx:63`.
- **5 Oct (champion-leave). Leave has two variants beyond the member's own:** the last member leaving ends the circle; a champion leaving a circle that has others puts it to sleep at once. Source: `app/feed.jsx:768`.
- **A3, ratified 2026-08-28. One shape for the invite card's whole life**, so there is no swap. Source: `app/invite-link.jsx:16`.

## Left alone
- **"handoff" as a product word:** WebHandoff, HANDOFF_COPY, PppWebHandoff, "finish-on-web handoff" and "provider handoff" in `main.jsx`, `subscriptions.jsx`, `spaces.jsx`, `primitives.jsx`, `brand-motion.jsx`, `pricing-page.jsx` and `pricing-main.jsx`. These are identifiers and product copy, not pointers.
- **Paths used as data:** `playgrounds.html`, `playgrounds.json`, and every candidate and playground page's `<script src>` lines.
- **Comments citing upstream specs or durable root docs:** `ui.md`, `hld.md`, `ui-design.md`, `CLAUDE.md`, `MOBILE.md`, `ARCHITECTURE.md` and `GOTCHA.md`. These are outside `docs/` and do not move.
- **Board names and bare rig filenames with no `docs/` path**, outside the kit's search terms. Examples: "board pg-not-subscribed A.08" in the `pricing-*.jsx` files, `talk-add.jsx:7-25` (`pg-wb-*.html`), and `feed-lens.jsx:396` (`_resources/…`, which is business-ops). Owner, 2026-10-16: these stay. A bare name survives a move, because a search still finds the file in `docs/archive/`; only folder paths break.
- The `app/qa.jsx` titles and notes, the states register, and the product block at the top of `CLAUDE.md` had no hits.

## History, untouched
`CHANGELOG.md`, all of `docs/archive/`, every handoff, README and prompt under `docs/specs/`, `docs/specs/_handoffs/`, and `docs/specs/lm-652-discourse/archive/early/README.md`.

## Checks
- Only comments changed, so behaviour is identical.
- Nothing was archived or moved.

## Open
Nothing.
