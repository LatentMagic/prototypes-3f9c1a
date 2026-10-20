---
date: '2026-10-16'
ticket: '1153'
topic: 'ratified-candidate'
status: 'in-progress'
type: 'build brief'
---

# Handoff: 1153 one new candidate build of everything ratified, with Discover tidied brought up to date

## Current Focus

The owner asked in words for **a brand-new candidate build**. It carries every 1153 decision he has made, plus proposed fixes for Discover, and he reviews it from there. Read `skills/candidate-build/SKILL.md` before building. The two Discover candidates and the playground stay as they are. They're reference material, not the starting point to edit.

The decisions themselves, in words with no option numbers, are in **`docs/specs/1153-pass-upsell/decisions-2026-10-16-pass-upsell.md`**. Build from that file. This handoff says how, and lists what's still proposal rather than ratified.

## Task(s)

1. **Build the candidate.** Make `docs/specs/1153-pass-upsell/candidate/pass-upsell-ratified.html`, with overlays `cand-pass-upsell-ratified-*.jsx` and storage key `kit_1153_pass-upsell-ratified`. Add it to `playgrounds.json` with `"kind": "candidate"` in the same change. It's the whole app with these in it:
   - Every surface in the decisions file: Home, Pricing, the play boxes, Library, the Library game pages, the landing after sign-in, and the link under a finished game.
   - Discover, taken from **Discover, tidied** and brought up to date (next section).
   - Nothing from the "Connecting" designs. That page stays as the main build has it.
2. **Discover, tidied, brought up to date.** The tidied candidate was built on 2026-10-15, before today's decisions, so parts of it are stale. In the new build:
   - **Ratified, apply as is:** the Pass pill is top right on the cover (the tidied build has it top left). The Free and "First … free" chips are off the cards. "The Pass" is the only Pass link in any line. Standalone games (36,000 Summers Ago) are treated differently from games with editions.
   - **Proposed by the owner 2026-10-16, not yet ratified; build them, and flag them as proposals in the handoff:**
     - **Search and filters work like History's** (`app/gs-history.jsx`), replacing the tidied build's open chips and filter panel.
     - **Discover's line about the Pass copies Home's paragraph**, "Two daily puzzles and the start of select games come with your account. Everything else comes with the Pass.", with "the Pass" as the only link. It replaces the tidied build's three options.
     - **The picks and rows are made relevant to today's rules.** The owner said "update the actual selection to be relevant" and didn't say more. Read it as: no game shows twice, standalones are kept apart from games with editions, and nothing claims "this week" where it goes stale. Then ask him whether that reading is right before treating it as settled.
   - **Still unratified from the tidied build, and carried over only if they survive the above:** the Delve pick label "A NEW SCENE EVERY WEEK" (builder's copy), the Word pick label, the free row's subline, the free row's title, the note shown once every first part is played, and the second pick (Casebook or Delve). List each one in the handoff for the owner.
3. **Write the build's handoff**, with the clicks to every surface, each call made without the owner, and the proposals above listed separately from the ratified items.

## Critical References

- `docs/specs/1153-pass-upsell/decisions-2026-10-16-pass-upsell.md`: the ratified decisions, in words.
- `skills/candidate-build/SKILL.md`: entry, overlays, storage key, launcher entry, and the rule that the main build stays as it was.
- The design law the `CLAUDE.md` product block names (MCP Game Store Design System, bundled in `_ds/`). Read it before any visual work.

## Recent changes (this session)

- Playground only (`docs/specs/1153-pass-upsell/playground/`): Home's Pass paragraph built from data (`pg-upsell-store.jsx` `pguPassLine`, `pg-upsell-home.jsx` `PguPassBand`); the Pass pill top right (`index.html` `.pgu-lock.is-chip`); new designs for the play boxes, the empty Library line, the free first part's done line, the finished-game link and "New for you" (`pg-upsell-game.jsx`, `pg-upsell-library.jsx`); a new Pricing section (`pg-upsell-pass.jsx`, loaded in `index.html`); the Barrow's coming-soon line limited to Pass holders.
- Docs: `handoff-2026-10-16-home-pass-line.md` (the running log), `decisions-2026-10-16-pass-upsell.md` (the record).
- Nothing in `app/`, `_ds/` or the two Discover candidates changed.

## Learnings

- **The owner reviews by looking.** Give clicks, not reasoning. When he asks "what is this for", the answer is often that the item was invented: say so and offer to cut it. That happened with the old empty-Library card and with Connecting.
- **Check a new design against the session's rules before showing it.** Today's misses: a purchases line copied over from the main build, a second Pass link beside the line, and a design that didn't follow the sibling it was meant to match.
- **A route is not a page.** The Pricing page is the `pass` route. The `subscribe` route is the plan picker. Opening the wrong one read as "you broke it".
- **The preview's "referenced file not found" warning** is the known false positive for `<base href="../../../../">` pages. Confirm by loading the page, as `CLAUDE.md` says.
- "New for you" reads whether a game was played at all, because the seed has no played flag per edition. A real build needs that flag.

## Artifacts

- `docs/specs/1153-pass-upsell/decisions-2026-10-16-pass-upsell.md`
- `docs/specs/1153-pass-upsell/handoff-2026-10-16-home-pass-line.md`
- `docs/specs/1153-pass-upsell/playground/` (updated), `candidate/discover-tidied.html` and `candidate/discover-games-hub.html` (unchanged)

## Action Items & Next Steps

1. Read the decisions file, `skills/candidate-build/SKILL.md` and the design law.
2. Build the new candidate as above, and add it to `playgrounds.json`.
3. Load it at desktop and 390px, and check Config → Platform: Mobile for both edges.
4. Hand off with the clicks, and walk the owner through the proposals one at a time, starting with what "relevant selection" means.
5. Only once the owner accepts the new candidate in words: archive the two older Discover candidates per the skill, and merge.

## Other Notes

- Still open from the review: whether Home keeps the purchases line under its Pass section now that the line lives on Pricing. Also unchecked: the main build's "Your streak comes with the Pass." and "Every other…" achievements text on a game's Library page.
- The owner keeps chat replies short: one question per turn, with the ask on the last line.
- Nothing goes into `CHANGELOG.md` until the owner accepts the candidate and words the entry.
