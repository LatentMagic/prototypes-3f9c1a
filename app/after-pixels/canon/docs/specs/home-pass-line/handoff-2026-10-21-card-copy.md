---
date: '2026-10-21'
topic: 'home-pass-line'
status: 'in-progress'
type: 'exploration (playground), copy'
---

# Handoff: home-pass-line — the Pass card's copy (playground 7)

## Current Focus

The copy on the Home Pass card. The owner has settled on the shape (card 3, first in the row, action b) and is still working out the wording. Next: wording for copy 4 that says both kinds of free, then that everything else comes with the Pass, in the shape of wordings 1 and 4, and without making the row taller.

Wait for his next note before building. When he does ask for work, do the work and don't ask him to confirm first.

## Task(s)

Rig: `docs/specs/home-pass-line/playground-7/index.html` (module `pg-hp7-home.jsx`, storage key `pg_home-pass-line-7_v1`). Launcher: `playgrounds.html` → A stronger Pass on Home → "The Pass card, copy: options 1 to 6".

Fixed in the rig (the owner's words, 2026-10-21; nothing ratified for `app/`):
- The card is card 3 from round 5: a lock before "The Pass" and the mosaic picture.
- It is **first** in the row. On a phone, the Pass card wasn't seen when it was second.
- The action is **b**: a chevron after the name, the whole card as the target, and the price as plain text in the chip line ("£3 a month or £30 a year"). The price is £3 / £30 from `GS_PLAN`. It is not changing, so never raise the price again.
- Invariant: the Pass card never makes the row taller than the game cards. The strip's meter (`hp7Excess`) checks this.

Copy options on the strip (`HP7_COPY`):
1. The original line (Home's canon line, `cprPassLine`) under "Available games", with the card reading "Every game, every edition."
2. The reword: the card reads "Every game, every edition.", with no line under the row.
3. "Select games are free to start." under the row.
4. Both messages on the card, with a **Wording** switch (`vars`):
   1. "Select games free, the rest with the Pass." The owner said this "feels quite good".
   2. "Select games are free. The Pass opens the rest."
   3. "Free: select games. The Pass: all of them."
   4. "Select games free. Everything else with the Pass." Changed at the owner's request. He also said this one "feels quite good".
   5. "Select games free. Every one with the Pass."
   6. to 9. name both kinds of free ("Select daily games and first editions…", "Daily Word, Daily Mystery and select first editions…"). They run to four lines, which breaks the two-line limit. The owner hasn't reviewed them.
5. Both messages in the line under the row; the card reads "Every edition, back to the first."
6. "Today's word and today's mystery are free, and so is the first room."

## Critical References

- `CLAUDE.md` product block: who plays what. **Free games:** Daily Word and Daily Mystery (current edition). **Free first edition:** Escape and Delve (the game's first edition only). The Barrow: chapter 1 free. Daily Groups is a Pass-only daily game, so "the daily games are free" is false.
- Voice: `/projects/ef1abd5b-7567-4e3c-8294-c78583fbe929/guidelines/voice.md`.
- Canon line: `app/gs-pass-store.jsx:61` (`cprPassLine`).

## Earlier handoffs

- `handoff-2026-10-21-not-a-game.md`: rounds 5 to 7, including the owner's notes on cards 1 to 5, the move to first in the row, playground 6's copy and actions, and the finding about the link's 44px touch area.
- `handoff-2026-10-21-pass-card.md`: playground 3 (options 1, 2, 7 to 15) and round 4's copy pairings.
- `handoff-2026-10-20-feedback-session.md`: every feedback burst from 2026-10-20.
- `handoff-2026-10-20-home-pass-options.md`: round 1 options 0 to 4, with 1A, 1B, 4A and 4B.

## Recent changes

- `docs/specs/home-pass-line/playground-7/` (new): `index.html` copies playground 6's page and points at `pg-hp7-home.jsx`. The module is derived from `pg-hp6-home.jsx`, with the action fixed at b and no action switch.
- `docs/specs/home-pass-line/playground-6/`: copy 1 to 5 times action a to e. It's kept for reference, and the owner chose b from it.
- `docs/specs/home-pass-line/playground-5/pg-hp5-home.jsx`: cards 1 to 4 (4 is "Label and lock"), with the card first in the row.
- `playgrounds.json`: entries for playground 6 and playground 7.
- `docs/specs/home-pass-line/README.md`: points at playground 6. It's stale, so update it to name playground 7.
- `app/`: nothing changed.

## Learnings

- Free is **two things**: free games (Daily Word and Daily Mystery), and the free first edition of others (Escape and Delve). Merging them into "select games" loses both. The owner had to correct this several times.
- Wording rules from the owner: no word used twice on a card (for example, "play" twice); "Pass" once; the card's text ideally two lines, like the game cards. "Everything else with the Pass" is the ending he likes. He rejects "two daily puzzles", "make an account" and anything that merely explains the page.
- Editions: the owner was unsure whether Home should mention them. The open point is the free first edition, not "every edition".
- The row lines its cards up in shared bands (name, text, chips). Spare height in the text band can't absorb a taller chip line. A 48px button in the chip line (playground 6's d and e) adds 21px to every card.
- The DS TextLink's 44px touch area made the chip line 21px taller in playgrounds 4 and 5. Playgrounds 6 and 7 fix it with `.hp6-card .mcp-gcard-tags > .mcp-lnk { margin-block: -11px; }`.
- The 52-files-missing warning is a false positive (base depth 4). Check the console: playground 7 first broke on a duplicated `hp7Store` declaration.
- Never change a file the owner has open (`playgrounds.html` reads `playgrounds.json`) without saying so first.

## Artifacts

- `docs/specs/home-pass-line/playground-7/index.html`, `pg-hp7-home.jsx`
- `docs/specs/home-pass-line/playground-6/index.html`, `pg-hp6-home.jsx`
- `docs/specs/home-pass-line/handoff-2026-10-21-card-copy.md` (this file)

## Action Items & Next Steps

1. Wait for the owner's note on copy 4. When he asks, write wordings that give free games, free first editions, then "Everything else with the Pass." Keep to two or three lines if you can, use each word once, and check every wording with the meter and the text height before handing it over.
2. Drop any wording he rejects straight away. Don't defend it.
3. Check the chosen wording at phone width (Config → Viewport: Mobile).
4. Update `README.md` to name playground 7.
5. Once a wording is accepted in words, ask before taking card 3, first in the row, action b, into `app/gs-pass-home.jsx`. The ticket still has no tracker id.

## Other Notes

- The owner was frustrated this session. In his words, the agent misunderstood the free model, asked too many questions and shipped copy that breaks his limits. Keep replies short and do the work when asked.
- Rejected, so don't bring these back: card 5 (a taller card), cards 1, 2 and 4 of round 5 as picks, lines a to d of round 5, copy 1, 2, 3 and 5 of playground 6, the "start select games" wordings (deleted), and "Play … Play …".
- His dictation often cuts off mid-sentence. If a message ends abruptly, say so; don't guess the rest.
