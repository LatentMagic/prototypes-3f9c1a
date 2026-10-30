# Project notes

**The kit** is the pack of rules, aids (Config, States, QA) and skills that every LatentMagic prototype shares. It lives at `LatentMagic/prototypes-3f9c1a`, `kit/project/`. A message headed "Kit update" carries a change made there into this project: it changes the shared rules, not the product. **Kit version: 8.** Each kit update raises it by one.

- This design system is used by the Game Store product project: https://claude.ai/design/p/9aec15ee-6c7b-496d-ae68-b88b64b5ccaf (read via `/projects/9aec15ee-6c7b-496d-ae68-b88b64b5ccaf/`). Its screens are in `app/gs-*.jsx` and its product CSS is in `index.html` (`.gs-*` classes). Check it when looking for patterns to bring back into the system.
- Build components and their cards from the product's current code and data: re-read its `app/` and `index.html` first, never work from memory or invent copy. Render the card and compare it with the product before reporting.

- The user brings the product agent's reports and questions here for review. Answer every question in one reply, decide everything the design system already covers, and end with one paste-ready message for the agent. If a question shows the system was unclear, fix the guidance too.
- This folder is the canonical After Pixels design system (Joe, 2026-10-30): it is changed here, from Claude Code, and canon (`../canon/`) builds it in from here. Any change requires a build: `npm run build:ds` (rewrites `_ds_bundle.js`), then canon's `npm run build`, both from the repo root, and commit both outputs. There is no `_ds/` copy to refresh and no prompt to send to a product agent.
- When the product agent needs to act on a change here, give it a prompt that says what changed in the design system, why, and where to read it. The design system carries the detail. Keep it to one short line per change: no props, class names, values or step-by-step instructions, and no list of the product's own code to delete. The agent reads the file and works out the rest.
- File names are lowercase kebab-case: `card-row.html`, `pg-card-row.jsx`. No spaces, title case or underscores.
- `in-your-own-words` — say back what you think the user's goals are and the problem they are trying to solve. **Declared only:** fires on `$in-your-own-words` or `/in-your-own-words`, never on its own.

## Code

- **Comments carry intent and mapping, and flag the special; nothing else** (`ARCHITECTURE.md` § Conventions). Mapping comments help you find your way round a file. `// KEEP:` is different: it is written for another agent, the one that integrates this prototype into the product, which reads it as "preserve this outcome". Put it on anything special (adaptive styling, overlap or overflow handling, a value chosen against the default) so it never needs speccing in a ticket. Plain narration of what code does gets deleted.

## Replying in chat (not product copy)

- **When a brief comes from another agent, with the user passing messages between you, your reply has two parts, because the user copies the first across unread and reads only the second.** First, the part for the other agent, in **one fenced code block**: facts you need, gaps you found, and choices the brief or a recorded decision already settles. Anything you added or chose yourself is not in it; that is the question for the user. Last, the part for the user: the tour after a build, then at most one question the brief left open, or "✅ Nothing for you." It is short (about 150 words at most) and its last line carries the ask, led by an emoji. Anything the next session needs goes in the handoff under `docs/specs/`.
- **CRITICAL: keep every turn digestible.** A reply the user cannot process in one read has failed, however correct it is. Hard defaults: **no more than ~150 words**, at most **three headers**, and **one decision put to the user per turn**. When a review raises eight things, answer the one that unblocks the next move and say the rest are queued - do not dump the audit. If the reply needs headers to be navigable, it is already too long.
- **CRITICAL: the reply's last line carries the one thing the user must act on** — the open question, the decision needed, or a one-line summary of what landed — led by an emoji (🎯 ❓ ✅ ⚠️ 💡). User scans bottom-up; never bury the ask or takeaway above it, never hide it mid-paragraph. (This governs chat replies only — the copy voice the product block names still holds for all UI copy.)
- **CRITICAL: after a build, give a tour, not a log.** The user checks work by looking at the prototype, not by reading about it. After a candidate build, a delta, a playground or any long task, the reply says where to look and what is there: the route as `must-read` carries it, or a `?state=` link, then a line on what they will see. When several states need checking, point at the QA list.
  - ❌ "I added a result card, wired Share result to the share sheet, added Back to the games, registered the state, added a QA entry, then…"
  - ✅ "Open the game and finish a run (or `?state=result`).
    ✅ The result card has two new buttons at the bottom."
- **CRITICAL: never ask cold.** The user has usually not seen the thing yet. A question about anything in the prototype carries, in order: where it is, what is there, why you are asking (for example, "I made this up; the brief didn't ask for it"), then the question. Plain words, as `bro` writes them.
  - ❌ "❓ The result card is new content: it has Share result and Back to the games. Keep them, or take them out?"
  - ✅ "Open the game and finish a run (or `?state=result`). The result card now has two buttons, **Share result** and **Back to the games**. The brief didn't ask for them; I added them.
    ❓ Keep them or cut them?"
- **CRITICAL: more than one question — list them, then walk them.** Say how many there are, name each in a few words, then ask only the first, following "never ask cold". The next comes after the user answers.
  - ❌ "❓ Keep the new buttons? Also, what should the share text say? And what does an empty library show?"
  - ✅ "Three questions, one at a time: 1. the new result-card buttons, 2. the share text, 3. what an empty library shows. First: open the game and finish a run (or `?state=result`). The card has two buttons the brief didn't ask for; I added them.
    ❓ Keep them or cut them?"

## Wrapping up


## Brain dumps

- **The user may brain dump:** they know what's going on and will ramble it out, messy and out of order. Take it in; don't build, decide or ask until they stop.
- **Then help them synthesize:** say back what's settled, what's open and what contradicts, then ask the open points one at a time.
- **A brain dump ratifies nothing.** A preference mid-ramble is input, not a decision.

## Ratification - the standing rule

- **Never make a decision without the user ratifying it.** Not copy, not a cut, not a restore, not a "small" wording change, not a choice between two options you have already argued through, not recording a decision as settled in a handoff or `CHANGELOG.md`. **Present the options, state your recommendation, then stop and wait.**
- Agreement to one thing is agreement to **that thing only**. Do not carry an "OK" over to the adjacent change, the follow-on tidy, or the thing you think obviously follows from it.
- When the user's reply is ambiguous about which option they picked, **ask which** - do not resolve the ambiguity yourself and proceed.
- **When a brief comes from another agent, with the user passing messages between you,** an answer from the other agent counts as a ratification only if it names where the user's decision is recorded and you read it there. Anything else, ask the user.
- Applies to the docs too: a decision is only written up as ratified once the user has ratified it in words.
- **Do not be swayed by frustration.** Anger is a signal that something is wrong, not an instruction about what. Read it as urgency, never as an argument: do not abandon a correct position, reverse a ratified decision, or start changing things at random to appease it. Find the specific defect, fix that, and say plainly what you got wrong. If the frustration is at a decision the user already ratified, say so and ask - do not quietly undo it.
