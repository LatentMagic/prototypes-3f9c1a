# LM-786 feed controls — handoff (2026-09-28)

Active is the queue, History is everything. Built against the delta prompt of this date (written against prototypes 9aa0b69).

## What was built, and where

1. **Filters per tab.** `lensWho` is keyed `<circleId>:<tab>` (`sortKey`) in `app/main.jsx` — declaration, the `who` read and `setWho`. Order and View unchanged.
2. **Active's people list.** `contributors` in `main.jsx` is `circContributors({ items: activeItems })` on Active (revealed cards only, never `pending`), whole circle on History. Ticked-but-empty people stay listed through FeedLens's existing append.
3. **New pill.** Guard gains `who.length === 0`; the comment above it is rewritten.
4. **Active also matches.** `checkActive` / `activeMatches` / `offerIncludeActive` / `includeActiveNow` in `main.jsx`, beside Search. Only on History, switch off, Saved and Watching both off, and a search or people filter applied; checked against the seeded `activeItems` directly.
   - Hit: `ActiveMatchLine` (`app/feed-history.jsx`), first row of the feed column.
   - Miss: `FeedNoMatch` (`app/feed-lens.jsx`) takes `onIncludeActive` and renders a filled accent "Include cards in Active" beside the existing recovery button.
5. **Panel split.** `FeedLens` renders two `LensFilterList`s under the one Filter eyebrow.
6. **Visit clears.** `resetVisitView` also clears `lensWho`, `savedOn`, `watchingOn`, `searchQuery`, `searchOpen`. Density survives.
7. **Staged states** in `app/states.jsx` ("The feed"). `stageSort` gained `doneUrl` and `pendingBy`, keys `who` per tab, and re-applies filters/search 40ms after entry (the entry now clears them).

## Staged states
- `?state=active-filter-empty-waiting`: sp-backend, Dev K. ticked, his one waiting card marked done, two arrivals from Sam R. behind the (hidden) pill.
- `?state=active-filter-hides-pill`: Priya N. ticked, two arrivals from Sam R. The pill stays hidden.
- `?state=history-search-active-hit`: History, query `fowler`. It matches the done Fowler bliki card and Sam's waiting CD-pipeline card.
- `?state=history-filter-active-miss`: History, Dev K. ticked. He has nothing done and one card waiting.

## Calls I made (unratified; for Joe)
- **Wording (open).** Built with the Gemini draft: hit line "Also matches cards in Active · Include them". The button's accessible name is "Include cards in Active". On the miss, the main button reads "Include cards in Active", as the prompt specifies. Joe has not judged either one.
- **Panel layout.** The Filter eyebrow stays. Saved and Watching come first as their own group (aria "Your cards") with no visible label. Then comes a sentence-case group label "Added by" (LensLabel), then the people. The label only appears when the Saved/Watching group is above it, so Active's panel reads the same as before. Reason: the section pattern reused with no second eyebrow or rule, so the Display/Filter split stays the panel's only rule. "Added by" was the people label before the One List ruling. Reinstating it here only on History is the part most worth Joe's look.
- **Hit line position.** First child of the feed column, above the first card, pulled up 4px so it reads with the chips. Text-link button (`circ-doorlink`) with a 44px target.
- **Miss button weight.** Filled accent for the main action, the existing bordered recovery beside it.
- **q + people together** also offers the Active match. The prompt names "plain" branches, but its acceptance criteria cover any search or people filter.

## Follow-up, 2026-09-28 — the filter lists everything (ratified)
Supersedes items 2 and 5 above and the "Panel layout" call.
- **Everyone listed, both tabs.** `circContributors` (`app/feed-lens.jsx`) now reads `space.members` first, then attribution (leavers, "former member"). `main.jsx` passes the whole circle on both tabs; the `activeItems` branch is gone. FeedLens's older append-any-ticked-name fallback stays as a safety net for a ticked person who leaves.
- **Saved and Watching always on History.** `showSavedLens` / `showWatchingLens` drop the `hasSaved` / `hasWatching` / flag clauses. Active still offers neither.
- **One list.** Filter renders one `LensFilterList` (Saved, Watching, then names); the "Added by" subheading and the "Your cards" group are gone. On desktop the list is bounded (4½ rows), so Saved and Watching now share that height with the names.
- **Active people miss is one line.** `FeedNoMatch` sets `support` to null off History, for every people-only case (You included).
- **States.** `active-filter-empty-waiting` relabelled for the one-line miss. New `history-saved-empty`: History, nothing saved, Saved ticked.
- **States page.** Groups collapse and start collapsed; a search opens every matching group. Per-group notes (`CIRC_STATE_GROUP_NOTES` in `app/states.jsx`, also `window.CIRC_STATE_NOTES`) show at the foot of an open group. The old "The feed" group is split into Feed / waterline / arrivals and New / loading and failures / filters and search / Shared card (group labels only; ids unchanged). The filters-and-search group's notes carry "pipelines" and "chan". Open/closed is not remembered. `?state=` routes unchanged.

## Audit follow-up, 2026-09-28 — five changes (ratified)
Written against prototypes 9c2ec59.
1. **Search always on History.** `showSearch` (`app/main.jsx`) dropped its `CIRC_SORT_MIN_ITEMS` clause; it shows on an empty or one-card History. Active still has none. Order's two-card floor unchanged.
2. **Filter and search changes start at the top.** `filterToTop` in `main.jsx` drops the tab's remembered scroll and lands at the top. Called from `setWho`, `setSavedFilter`, `setWatchingFilter`, `setSearchQueryVal`, `clearSearch`, `includeActiveNow` and the panel's Include-cards-in-Active switch (the switch does what "Include them" does, so it follows the same rule).
3. **"links" → "cards"** in member-facing filter, Saved and search strings: chip clear labels, "Show all cards", the saved misses, the Saved trigger's name ("Saved cards"), the filter list's default label ("Filter cards") and the matching announcements. Comments untouched.
4. **History people miss with the switch on** reads "Nothing here from ‹name›." alone. `FeedNoMatch` takes `includeActive`; the "finished" support line holds only while it is off.
5. **Search matches the full URL** (`circSearchMatch`, `app/feed-search.jsx`), and the miss's support line names the address.

New states (`stageSort` gained `noneDone`, `watchUrls`, `watchingOn`, `includeActive`):
- `?state=history-search-empty`: nothing finished, switch off; the search trigger shows.
- `?state=history-filter-miss-switch-on`: switch on, Lena P. ticked (she added nothing); the one-line miss.
- `?state=history-watching-on`: two finished cards watched, Watching ticked.
- `?state=history-filter-active-hit`: Priya N. ticked; finished cards here, two waiting in Active; the Active-match line under the chips.

## Unresolved / next
- Not verified by eye in this session beyond the background verifier. Walk all four addresses.
- No CHANGELOG entry: this may qualify as a shape change. Ask Joe before adding one.
- The real cost of "does Active hold a match" is engineering's to price.
