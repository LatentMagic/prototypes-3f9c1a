# Handoff: daily and weekly filters (2026-10-09)

Source: delta instruction from Joe, relaying Jonny, 2026-10-09. Nothing below is ratified beyond what that instruction marked ratified.

## Built
- `app/gs-data.jsx`: `gsRhythm(k)` reads `'daily'`, `'weekly'` or `null` from each game's card tags (`Daily`, `Weekly`), and `GS_RHYTHMS` holds the two options. No new data: the tags were already the source.
- `app/gs-discover.jsx`, Discover: two chips, Daily and Weekly, in the All games "Show only" group, after the kinds and before Free. Library: a **Schedule** choice (All games, Daily, Weekly) between Kind and Order. Library's empty line now reads "No game matches that." when the search is blank (it used to print empty quotes); Show every game also clears Schedule.
- `app/gs-history.jsx`: a **Schedule** choice (All games, Daily, Weekly) between Plays and Show. It narrows plays by their game's rhythm and returns to page 1, as Plays does.
- Every new control sits in the existing `useGsPart` deps, so changing it loads only the list part, like the filters beside it.
- Staging: Discover reads `route.on`, Library `route.kind` and `route.rhythm`, History `route.rhythm`, so a state can open a filtered list.

## Staged states (group "Daily and weekly filters")
- `?state=filter-empty-discover`: Learning and Daily chips on.
- `?state=filter-empty-library`: Kind Learning, Schedule Daily.
- `?state=filter-empty-history`: Show 36,000 Summers Ago, Schedule Daily.
- QA entry `rhythm-filters` in `app/qa.jsx` lists them with their unfiltered screens.

## Choices, for ratification
1. **Form and wording.** Same words everywhere, "Daily" and "Weekly", the tags already on the cards. Each surface uses its own existing control: chips on Discover (multi-pick; Daily and Weekly together equal "both"), single choice on Library and History (beside Kind / Plays, which are single choices). Group label "Schedule" (ratified by the user, 2026-10-09). Rejected: "Released" (implies coming soon), "New editions", "How often", "Comes out".
2. **36,000 Summers Ago** shows under neither Daily nor Weekly, only when no rhythm is picked. It has no editions, so either label would be false.
3. **Other surfaces.** None. Home is out of scope; the Pass page lists nothing; the Editions page and a library game page's plays list one game.
4. **Discover reach.** All games wall only. The picks, Just added and Free to play are short curated rows; filtering them would empty or reorder what we chose.
5. **Empty text.** The surface's existing line: Discover "No game matches that." plus Show every game; Library the same (search-quoted form kept when there is a search); History "No plays match that."

## Not done / open
- History's Show list still offers every played game when Schedule is set, so Show plus Schedule can empty the list (staged). Narrowing Show to matching games was out of scope ("change nothing else").
- No CHANGELOG entry proposed: a filter added to existing lists, not a change in the product's shape.

## Next
Ratify choices 1 to 5, then delete the QA entry.
