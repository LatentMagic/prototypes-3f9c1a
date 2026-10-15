---
date: '2026-10-15'
topic: 'frontend-guild'
status: 'built, awaiting owner review'
type: 'implementation'
---

# Handoff: Frontend Guild becomes the main demo circle

Route: open `circlists.html` (cleared storage) → home, Frontend Guild first → enter it. Or States → Feed → *The reading loop*.

## What changed

- `app/seed-data.jsx` — `sp-guild` is first in `seedSpaces()`. Cards in `GUILD_CARDS`, conversations in `GUILD_TALK`, both verbatim from the brief. `circGuildFinish()` runs after the liveliness pass and sets each card's `at`, thought, `watching`, `talkSeenAt` and turns.
- `app/main.jsx` — fallback circle `sp-guild`; key `circ_state_v16` → `circ_state_v17` with the version comment.
- `app/states.jsx` — `reset()` and `reading-loop` enter `sp-guild`. Nothing else re-pointed.
- `app/store-listings.jsx` — "NO RANKING, NO SCORES" section removed from both descriptions; last caption on both pages changed from "A separate circle for *each group of people*" to the settled "A separate circle for *every group you share with*" (the build contradicted the brief, so the brief won).
- Uploads placed at the brief's paths: `uploads/card-previews/guild-*.jpg` (9), `uploads/store-listings/*` (10, overwritten). Source folder `uploads/frontend-guild-uploads/` and the loose duplicates at `uploads/` root are unreferenced and due for the end-of-session sweep.
- `CHANGELOG.md` — one entry.

## Yours to decide: what I chose

- **Seed lives in `seed-data.jsx`, not a `talk-data.jsx`-style wrapper.** About ten playground and candidate entries load `app/main.jsx` but list their own scripts; a separate file would be missing from them, and the new `sp-guild` fallback would point at a circle they don't have. In `seed-data.jsx` every entry gets it.

## Set by this brief, owner has not ruled

1. Reaction strengths: deeply 0.85, moderately 0.55, little 0.3.
2. Reactors: Dev K. 😂 on Writing Resilient Components; Priya N. ❤️ on Dialog (Modal) Pattern.
3. Added turns: Writing Resilient Components' three-turn conversation (last unseen); Priya N.'s 20h turn on Rich Harris; Amara O.'s 👍 (30h) on Web Vitals.

## Unresolved / to check

- **Acceptance line fails: watching bar.** Observed: "1 conversation you are watching · Priya N. replied", no glyphs. Brief expects "2 conversations … with ❤️💡🔥". Cause: `candFreshRx` (`app/talk-return.jsx`) counts only reactions on *your* turns after `talkSeenAt` (the ratified author-only rule). Web Vitals' one post-mark reaction (Amara O. 👍, 30h) sits on Tomasz W.'s reply, so Web Vitals makes no row; no You-turn in the guild has a post-mark reaction, so no glyphs. Seed left as written. Owner ruled (a), 15 Oct: Web Vitals gains your reply to Dev K. (210h, "I can pair on it. A smaller hero on mobile alone would move the number.") with Amara O. ❤️ 30h, Dev K. 💡 28h, Priya N. 🔥 25h; Amara's 👍 on Tomasz's reply stays. Built as `fh2c` in `GUILD_TALK`. Key stays `circ_state_v17` (owner ruled, 15 Oct): a browser that saved v17 before `fh2c` landed needs one States → reset to see it.
- Not verified by eye by the owner yet.

## Next

Owner reviews the acceptance list in the brief; rule on the three calls above.
