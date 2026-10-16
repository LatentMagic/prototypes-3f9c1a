# Project notes

- This design system is used by the Game Store product project: https://claude.ai/design/p/9aec15ee-6c7b-496d-ae68-b88b64b5ccaf (read via `/projects/9aec15ee-6c7b-496d-ae68-b88b64b5ccaf/`). Its screens are in `app/gs-*.jsx` and its product CSS is in `index.html` (`.gs-*` classes). Check it when looking for patterns to bring back into the system. Its playgrounds: https://claude.ai/design/p/9aec15ee-6c7b-496d-ae68-b88b64b5ccaf?file=playgrounds.html
- Build components and their cards from the product's current code and data: re-read its `app/` and `index.html` first, never work from memory or invent copy. Render the card and compare it with the product before reporting.

- The user brings the product agent's reports and questions here for review. Answer every question in one reply, decide everything the design system already covers, and end with one paste-ready message for the agent. If a question shows the system was unclear, fix the guidance too.
- When the product agent needs to act on a change here, give it a prompt that says what changed in the design system, why, and where to read it. The design system carries the detail. Keep it to one short line per change: no props, class names, values or step-by-step instructions, and no list of the product's own code to delete. The agent reads the file and works out the rest.
- Playgrounds (exploratory pages for reviewing options, not part of the design system) live in `docs/specs/<topic>/playground/`, never at the root. The entry page and its modules sit together in that folder. Never give them an `@dsCard` marker.
- File names are lowercase kebab-case: `card-row.html`, `pg-card-row.jsx`. No spaces, title case or underscores.
- To load from that folder, put `<base href="../../../../">` first in `<head>` (one `../` per folder level) and write every path as if the page sat at the root: `href="styles.css"`, `src="_ds_bundle.js"`, `src="docs/specs/<topic>/playground/pg-foo.jsx"`. A bare sibling filename resolves at the root, and a `../../` path climbs twice and 404s. `href="#"` links also resolve to the root, so prevent their default. The missing-file check run after a page is written ignores `<base>`, so it lists these paths doubled (`docs/specs/<topic>/playground/docs/specs/…`). That's a false positive: check the page in the browser, not the warning.
- When the user is done with a topic, move its folder from `docs/specs/` to `docs/archive/`. The depth stays the same, so the base tag still works.
- `playgrounds.html` at the root lists every current playground by topic; archived topics stay in the list file but don't show on the page. Its list is `playgrounds.json`: add the entry in the same change that builds a playground, and update it whenever one moves or is archived.
- `$build-playground` skill exists at `skills/build-playground/SKILL.md`. Use it when building playgrounds.
- `$create-handoff` skill exists at `skills/create-handoff/SKILL.md` (template in `skills/create-handoff/assets/`). Use it when writing a handoff.
- Always register a playground as a reviewable asset (`asset` param on write/copy) so it appears in the project's page list, and open it on the user's screen when done.

## Replying in chat (not product copy)

- **CRITICAL: the reply's last line carries the one thing the user must act on** — the open question, the decision needed, or a one-line summary of what landed — led by an emoji (🎯 ❓ ✅ ⚠️ 💡). User scans bottom-up; never bury the ask or takeaway above it, never hide it mid-paragraph. (This governs chat replies only — the copy voice the product block names still holds for all UI copy.)
- **CRITICAL: after a build, give a tour, not a log.** The user checks work by looking at the prototype, not by reading about it. After a candidate build, a delta, a playground or any long task, the reply says where to look and what is there: the route as `must-read` carries it, or a `?state=` link, then a line on what they will see. When several states need checking, point at the QA list. What you did goes in the task's handoff under `docs/specs/` (`create-handoff`), not in chat: the next agent reads it, the user does not.
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
