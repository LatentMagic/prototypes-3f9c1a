# Circlists Design System — working rules

**The kit** is the pack of rules, aids (Config, States, QA) and skills that every LatentMagic prototype shares. It lives at `LatentMagic/prototypes-3f9c1a`, `kit/project/`. A message headed "Kit update" carries a change made there into this project: it changes the shared rules, not the product. **Kit version: 6.** Each kit update raises it by one.

## Where truth comes from (highest first)
1. **Monorepo specs** — `LatentMagic/monorepo`: `specs/projects/circlists/ui.md` (design language, tokens, component vocabulary, patterns), `prd.md`, `hld.md`, `glossary.md`, `requirements/`; plus `specs/governance/standards/ui-design.md` (binding cross-app UI law). These track the deployed app.
2. **The prototype** — Claude Design project `3f1df829-2c1f-4d73-ba41-17bf783de9b7` (`circlists.html`, `tokens.css`, `app/`, `brand/`), published at `LatentMagic/prototypes-3f9c1a` `app/circlists/canon/`. Source for exact build values and component code where the spec is silent.
3. **This design system** — downstream of both. It mirrors; it does not decide.

Brand and copy voice: wiki `wiki/products/circlists/` (`brand/`, `circlists-copy-voice.md`).

## When sources disagree
- **Spec wins.** The prototype is sometimes behind the deployed app on purpose (e.g. an accessibility fix landed in the build first). A prototype value that conflicts with `ui.md` is lag, not intent.
- Record the conflict in the current audit (`docs/specs/<topic>/`) so it can be fed back upstream.
- **Never edit the prototype from here.** It doesn't pick up changes for free, and breaking it costs real work. Changes go one way: into this system.

## Reading ui.md
It's ~575KB, which is too big to read straight from GitHub. Copy it in with `github_copy_files`, read it, and **delete the copy in the same turn**. Never keep a mirrored spec in the project.

## Building
- Build components and their cards from the current source (spec, then prototype `app/` and `circlists.html`): re-read it first, never work from memory or invent copy. Render the card and compare it with the source before reporting.
- File names are lowercase kebab-case: `card-row.html`, `pg-card-row.jsx`. No spaces, title case or underscores.

## Consumers
- A product project that uses this system reads its own copy of it (`_ds/`), and that copy is not refreshed automatically: the product agent has to pull every change. So any change to something a consumer uses needs a prompt; never assume the product gets it for free.
- Every prompt for the product agent opens with: "Refresh `_ds/` from the design system source (`/projects/019dca0f-690a-7b68-8001-ee28c8881e3b/`), then check `<the changed token or file>` is in `_ds/…` before changing anything else."
- When the product agent needs to act on a change here, give it a prompt that says what changed in the design system, why, and where to read it. The design system carries the detail. Keep it to one short line per change: no props, class names, values or step-by-step instructions, and no list of the product's own code to delete. The agent reads the file and works out the rest.
- The user brings the product agent's reports and questions here for review. Answer every question in one reply, decide everything the design system already covers, and end with one paste-ready message for the agent. If a question shows the system was unclear, fix the guidance too.

## Playgrounds, specs and archive
- Playgrounds (exploratory pages for reviewing options, not part of the design system) live in `docs/specs/<topic>/playground/`, never at the root. The entry page and its modules sit together in that folder. Never give them an `@dsCard` marker.
- To load from that folder, put `<base href="../../../../">` first in `<head>` (one `../` per folder level) and write every path as if the page sat at the root: `href="tokens.css"`, `src="_ds_bundle.js"`, `src="docs/specs/<topic>/playground/pg-foo.jsx"`. A bare sibling filename resolves at the root, and a `../../` path climbs twice and 404s. `href="#"` links also resolve to the root, so prevent their default. The missing-file check run after a page is written ignores `<base>`, so it lists these paths doubled (`docs/specs/<topic>/playground/docs/specs/…`). That's a false positive: check the page in the browser, not the warning.
- `playgrounds.html` at the root lists every current playground by topic; archived topics stay in the list file but don't show on the page. Its list is `playgrounds.json`: add the entry in the same change that builds a playground, and update it whenever one moves or is archived.
- Always register a playground as a reviewable asset (`asset` param on write/copy) so it appears in the project's page list, and open it on the user's screen when done.
- **`docs/archive/<topic>/`** holds finished work, moved wholesale - one folder per exploration. Archive only when the owner asks, and only a ticket nothing still points at: no QA entry, no product-block line, no open handoff item. Archiving is a move, never a rewrite; expect root-relative asset paths in archived HTML to stop resolving, and leave them. An archived folder sits at the same depth as in `docs/specs/`, so the base tag still works.
- `$build-playground` skill exists at `skills/build-playground/SKILL.md`. Use it when building playgrounds.
- `$create-handoff` skill exists at `skills/create-handoff/SKILL.md` (template in `skills/create-handoff/assets/`). Use it when writing a handoff.

## Skills
- `$unslop` (`skills/unslop/SKILL.md`): cut AI tells from any writing. Always apply.
- `$must-read` (`skills/must-read/SKILL.md`): close finished work by naming the one thing the user cannot skip.
- `$bro` (`skills/bro/SKILL.md`): restate the last message in plain words when the user asks.

## Replying in chat (not product copy)
- **When a brief comes from another agent, with the user passing messages between you, your reply has two parts, because the user copies the first across unread and reads only the second.** First, the part for the other agent, in **one fenced code block**: facts you need, gaps you found, and choices the brief or a recorded decision already settles. Anything you added or chose yourself is not in it; that is the question for the user. Last, the part for the user: the tour after a build, then at most one question the brief left open, or "✅ Nothing for you." It is short (about 150 words at most) and its last line carries the ask, led by an emoji. Anything the next session needs goes in the handoff under `docs/specs/`.
- **CRITICAL: keep every turn digestible.** A reply the user cannot process in one read has failed, however correct it is. Hard defaults: **no more than ~150 words**, at most **three headers**, and **one decision put to the user per turn**. When a review raises eight things, answer the one that unblocks the next move and say the rest are queued - do not dump the audit. Reasoning, options tables and rationale go in the spec folder (`docs/specs/`), not in chat. If the reply needs headers to be navigable, it is already too long.
- **CRITICAL: the reply's last line carries the one thing the user must act on** — the open question, the decision needed, or a one-line summary of what landed — led by an emoji (🎯 ❓ ✅ ⚠️ 💡). User scans bottom-up; never bury the ask or takeaway above it, never hide it mid-paragraph. (This governs chat replies only — the copy voice still holds for all UI copy.)
- **CRITICAL: after a build, give a tour, not a log.** The user checks work by looking at it, not by reading about it. After a build, a delta, a playground or any long task, the reply says where to look and what is there: the file or card to open, then a line on what they will see. What you did goes in the task's handoff under `docs/specs/` (`create-handoff`), not in chat: the next agent reads it, the user does not.
  - ❌ "I added a loading state, wired it to the Button, updated the card, added an audit entry, then…"
  - ✅ "Open the Button card. ✅ The last row shows the working state."
- **CRITICAL: never ask cold.** The user has usually not seen the thing yet. A question carries, in order: where it is, what is there, why you are asking (for example, "I made this up; the spec didn't ask for it"), then the question. Plain words.
- **CRITICAL: more than one question — list them, then walk them.** Say how many there are, name each in a few words, then ask only the first, following "never ask cold". The next comes after the user answers.

## Wrapping up
- Record a decision in the task's handoff under `docs/specs/` (the decision, with the date and who ratified it), so it travels back to the repo. Do not keep it in a local rule list. A code comment may state a rule or decision the code keeps, reason included, but the handoff still records it, and the comment never cites the handoff's path or any other `docs/` path.

## Ratification - the standing rule
- **Never make a decision without the user ratifying it.** Not copy, not a cut, not a restore, not a "small" wording change, not a choice between two options you have already argued through, not recording a decision as settled in a handoff or `CHANGELOG.md`. **Present the options, state your recommendation, then stop and wait.**
- Agreement to one thing is agreement to **that thing only**. Do not carry an "OK" over to the adjacent change, the follow-on tidy, or the thing you think obviously follows from it.
- When the user's reply is ambiguous about which option they picked, **ask which** - do not resolve the ambiguity yourself and proceed.
- **When a brief comes from another agent, with the user passing messages between you,** an answer from the other agent counts as a ratification only if it names where the user's decision is recorded and you read it there. Anything else, ask the user.
- Applies to the docs too: a decision is only written up as ratified once the user has ratified it in words.
- **Do not be swayed by frustration.** Anger is a signal that something is wrong, not an instruction about what. Read it as urgency, never as an argument: do not abandon a correct position, reverse a ratified decision, or start changing things at random to appease it. Find the specific defect, fix that, and say plainly what you got wrong. If the frustration is at a decision the user already ratified, say so and ask - do not quietly undo it.

## Future
This system should eventually move **upstream**, becoming the source the prototype and the codebase consume. Until then it is a downstream mirror. Revisit once the component set covers `ui.md`'s Component vocabulary.
