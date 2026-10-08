# free-tier-1 — handoff

Date: 2026-10-07. Brief: pasted in chat (six deliverables). Ratified in the brief: the Pass decides what you can play, everything your play produces is yours; the "What you get" columns; Delve has no free scene; sharing is plain text, Wordle-style.

## Built
1. **Free player keeps results, past plays, streak.**
   - Session page: the "isn't kept" note is gone (`app/gs-session.jsx`).
   - History: free players get the Pass holder's page, the streak panel and Daily Puzzles rows only (today's: only those played). Pass ended (free month used): the same plus every Pass-game row.
   - Daily Puzzles page: the streak panel is the Pass holder's for free players too (`app/gs-puzzles.jsx`, `app/gs-game.jsx`).
   - Pass card (free, lapsed) and cancel sheet: wording as the brief (`app/gs-billing.jsx`).
   - Home, How it works step 3: "Get the Pass for Casebook, Delve and 36,000 Summers Ago." (`app/gs-home.jsx`).
2. **"What you get"**: five rows in the brief's order (`GS_COMPARE`, `app/gs-parts.jsx`).
3. **Delve, free**: no "First scene free" tag; play box is Casebook's ("Get the Pass", "Play today's puzzles free", "Delve is part of the [Platform] Pass.").
4. **Works with**: "ChatGPT · Claude · OpenClaw · Hermes · any assistant that supports MCP connectors"; play-box step "ChatGPT, Claude, OpenClaw and others."
5. **Share pop-up**: the text as pasted, in a card where the image card was, one "Copy" button (label swaps to "Copied"; it writes the text to the clipboard).

## States
- New: `?state=lapsed-history` (Pass ended: History keeps the Pass-game plays).
- Relabelled, same ids: `free-puzzle-result`, `free-history`.
- Share pop-up: open any session state (`session-puzzle`, `session-delve`, `session-casebook`, `free-puzzle-result`) and press Share.
- QA entry `free-tier-1` in `app/qa.jsx`; delete once signed off.

## Changed from the direction, and why
- **Delve share text**: "Delve 🎲 Rescued, close call / 🎲 11 rolls  ⏳ threat 5/6". The build's endings are Clean rescue / Close call / Alone / Caught, not "The ritual is stopped"; the build records no "places reached", so threat (a recorded figure) stands in.
- **Word puzzle text**: squares are worked out from the recorded guesses; no hints are recorded, so no 💡. Puzzle numbers (#212 today, #211 on 5 October) are seed data taken from the example.
- **Other games' text**, not in the brief: Casebook "Casebook 🔎 Solved / 11 of 16 turns · 4 lies exposed"; Escape Room and Murder Mystery "<game> · <result>"; 36,000 Summers Ago has no result yet, so the pop-up shows "—" and no button.
- **New "What you get" rows have no second line.** The brief gave names only; I wrote none rather than invent copy.
- **Signed-out Daily Puzzles page no longer shows a streak panel.** Its only content was "kept with the Pass", which is now untrue, and a signed-out visitor has no streak to show.
- **Works with ending**: the brief's "…" became "any assistant that supports MCP connectors" (ratified by the user, 2026-10-07): the bare ellipsis read badly.
- **Free Pass card**: "the weekly games" became "the Pass games" (user, 2026-10-07): 36,000 Summers Ago isn't weekly.
- **Lapsed sample dates**: a lapsed player's Pass-game plays are dated 12–14 September, before the Pass ended on 18 September, and list after the Daily Puzzles plays (user, 2026-10-07).
- Product-page link is a placeholder: `https://platform.example/<route>`.

## Unresolved
- **Goose appears nowhere.** Connect your AI already offers OpenClaw, not Goose (an earlier change). Left alone as instructed; "Goose only on Connect" holds trivially. Confirm that's intended.
- **Game pages' "A finished play"** still shows the old share card. Left as is (user, 2026-10-07): that page is reworked next.
- CHANGELOG entry: not written; ask.
