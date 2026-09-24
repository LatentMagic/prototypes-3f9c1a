# LM-786 — History, and a feed that pages — handoff

Date: 2026-09-24. Prompt: business-ops `work/apps/circlists/lm-786-feed-controls/_outputs/prompts/` (pasted into chat, with its four images).

## What was built, and where

- **`app/feed-history.jsx`** (new, droppable, loads after `feed.jsx`). Holds the Horizon test (`circPreHorizon`), the one "is this card in Active" test (`circInActive`), History's composition (`circHistoryItems`), the switch row (`IncludeActiveRow`, reuses `CandSwitch`), the list foot (`FeedPageFoot`: sentinel / loading mark / failed foot), the end line (`HistoryEnd`) and History's empty copy. Page size `CIRC_PAGE_SIZE = 8`, fetch beat `CIRC_PAGE_DELAY = 800ms`. Absent, History holds only done cards, nothing pages, no end line.
- **`app/main.jsx`**: visit state `includeActive`, `feedPages`, `pageStatus`, `tabScroll` (not persisted, cleared in `enterSpace` and on any `currentId` change). `activeItems` now excludes pre-Horizon cards; `historyItems` feeds the second tab. `switchTab` saves the leaving tab's scroll, a layout effect restores the arriving tab's. The feed renders `paged` (a slice of the composed list) and the foot/end line after the cards. Unread cards in History are rendered with `tab="active"`, so they are drawn exactly as Active draws them (tick, no Save).
- **`app/feed-lens.jsx`**: `FeedLens` takes `includeActive` / `onIncludeActive`; the row renders at the head of the panel only when `onIncludeActive` is passed (History). Copy table applied.
- **`app/shell.jsx`**: tab label "History" (id stays `read` internally).
- **Copy**: every Becomes string in the prompt's table, in `feed.jsx`, `talk-card.jsx`, `talk-add.jsx`, `swell-reactions.jsx`, `feed-search.jsx`, `feed-saved.jsx`, `feed-lens.jsx`, `main.jsx`.
- **`circlists.html`**: script tag; `.circ-fdiv-end` and `.circ-pagefoot-retry` rules beside the waterline's.

## Staged states (`app/states.jsx`, group "The feed")

- `?state=history-late-joiner` — new circle "Sunday Reads" (`sp-late`), joined 3 days ago, Horizon 10 days ago. Active: 6 cards. History, switch off: 3 done + 22 pre-Horizon cards drawn as Unread. Pages 4 times; ends on the end line.
- `?state=feed-older-failed` — Backend Pod, History, first page loaded, next fetch failed. Try again loads it.

Paging by scrolling, no state needed: Backend Pod crosses a page boundary on both tabs with the existing seed (10+ Active, 11 History). The seed itself was not changed, so no state-key bump.

## Yours to decide — what I chose

1. **Switch on Active**: History only. It means nothing on Active.
2. **Tab switch and the switch**: kept for the whole visit; only entering a circle (or reloading) resets it. Awaiting Joe's ruling.
3. **End line words**: "Start of the circle" under newest first. Under oldest first the foot is the present, so it reads "Up to now", following the waterline's order-dependent label. Both need ratifying.
4. **Foot and end line look**: the foot is one line of 14px `fg-2` text with a full stop ("Couldn't load older links."), matching "This didn't load.", over a neutral text button (Try again, 600, 44px target, underline on hover). Not accent: `FeedError` records that a recovery is not a primary action. The end line is the waterline's class verbatim, 8px clear of the last card.
5. **Loading mark**: `BrandSpinner` at 32px, centred in the foot. No words, no skeleton.
6. **History empty copy**: empty circle: "Nothing here." / "What you mark as done stays here. Only your list changes." Switch off with every card in Active: "Nothing here." / "Everything in this circle is still waiting for you in Active." The view-options trigger stays reachable in that case (its presence counts the whole circle on History), so the switch is never stranded.
7. **Paging mock data**: page size 8 over the existing seed, plus the late-joiner circle.
8. **Late-joiner state**: id `history-late-joiner`, label "History — joined late, the circle's past drawn as unread", seed as above.
9. **Pre-Horizon tick**: does what any Unread card's tick does (opens the Swell, marks done, card stays in History drawn as Read).

## Ratified after the build

- **Failed-load foot (2026-09-24):** the words are now "Couldn't load older cards." (the user's change from "links"). "Try again" takes the `.circ-doorlink` treatment, accent with a quiet underline, at a 44px target. The neutral styling first shipped here was rejected: a bare neutral text control has no precedent in the app.
- **Switch placement (2026-09-24):** option 2 of `playground/wb-include-switch.html`, "One of Display". The switch is the first row of the Display group, under the DISPLAY eyebrow, using Order and View's grid and group-label voice, with no heading or rule of its own. The reason: Display's contract is to light nothing and add no chip, and that is exactly the switch's ruled behaviour. The board predates this, so its "00 As built" cell and the options' dispatcher now render inside Display. It is kept only as a record.

## Unresolved

- **"Links" in ruled copy, held for the sweep (user, 2026-09-24):** "Show all links", "Showing saved links" and "Showing all links" keep "links" until the copy sweep. "You haven't finished any of your own links yet." became "You haven't finished anything you added yet." (user, 2026-09-24): it matches its sibling string "You haven't finished anything they added." The failed-load foot already says "cards". Do not change these three ahead of the sweep.

- **"Couldn't load older links" under oldest first**: the next page is newer there, so the ratified words are wrong in that order. Left as ratified. Needs a ruling.
- **Search and filters page over the whole circle** in the prototype (the slice is applied after composing). A real backend would search server-side; not modelled.
- **Candidate-build entries** (`docs/specs/*/circlists-*.html`) do not load `feed-history.jsx`, so they show the pre-LM-786 History (done cards only, no paging). The fallbacks keep them working.
- **Home rows and rail**: a late joiner's pre-Horizon cards count as unread in `circleSummary`. Untouched, since the prompt names no home change.
- **CHANGELOG**: no entry yet. One entry for this step still needs the user's OK.

## Next

Get rulings on items 2 and 3 and the oldest-first foot. Then measure the per-tab scroll restore live in the app posture (`eval_js_user_view` on `.circ-phone-screen`, per GOTCHA 2), not from screenshots.
