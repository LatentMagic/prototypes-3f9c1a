# Project

<!-- product:start -->
**Product:** After Pixels (afterpixels.com) — a home for games you play with an AI agent such as Claude or ChatGPT: one growing library where the game holds the rules, your agent tells it, and what happens next depends on what you say.

**Read live from GitHub, never copied in** (a kind with no source yet is asked about, not guessed):
- Behaviour specs and glossary: `<owner/repo>/<path>`
- Design law: **CRITICAL — the MCP Game Store Design System is binding and must be read before any visual work.** Source: `/projects/ef1abd5b-7567-4e3c-8294-c78583fbe929/` (start with `guidelines/visual-foundations.md`, `guidelines/voice.md`, `guidelines/layout-and-patterns.md`); bundled copy in `_ds/`. Use its components and tokens; never recreate them.
- Brand and visual values beyond `tokens.css`: `<owner/repo>/<path>`
- Copy voice: `<owner/repo>/<path>`
- Tracker, where ticket ids come from: `<owner/repo or link>`; where a task's context record lives: `<owner/repo>/<path>`

**Platform:** web (change only if the product is native or adaptive).
**Published at:** `<url where the prototype is served; state links only work there>`

**Product skills** (name, and when it fires): `noise` — only on `$noise` (declared only, never fires on its own): re-ask the question the user missed, on its own, after subagent returns or tool output buried it.
**Extra root files** (name, and what it is for): none yet.

### How the product works (working picture, 2026-10-07; not all ratified)
A map of what the product is. This is a prototype and things change, so the map can fall behind. It never overrides an explicit instruction: where the two disagree, follow the instruction and flag the difference.
- A growing library of games played by talking to your own AI (Claude, ChatGPT, Goose, any MCP assistant), connected once with a link. Your AI tells the story and voices the characters; the server holds the rules, dice, turns, outcomes and record, so nobody can fudge it. Purchases only happen on the site.
- A game has a genre (puzzle, mystery, adventure, learning activity), a unit of play (puzzle, case, scene, day) and facts (what your AI does, age, length, how often, players). The library changes: copy never depends on today's list of games.
- Some games release on a schedule; each release is an **edition** (Daily Puzzles daily; Casebook and Delve weekly). Others don't. A daily or weekly edition, and a game with a fixed answer such as a case, is played once: a finished one can't be played again. A room or scene belongs to its weekly game, so it is an edition. A story or adventure chapter with no fixed answer can be started over after it is finished, as an ordinary new session that counts for nothing new. Nothing is marked or filtered as a replay (ratified 2026-10-17). A game system can return in new settings or longer formats.
- Every play is a **session**: a result and a full record (rolls, guesses, statements), shareable as a card or link. Across plays: history, and for daily games a streak and record.
- **Who plays what** (proposed 2026-10-09, free-and-pass; ratified list in the owner's log): one paid plan, the Pass, nothing sold per game; an account is needed to play anything, free play needs no card. Daily Word, Daily Mystery: free (current edition, a streak, achievements). Daily Groups, Casebook and 36,000 Summers Ago: only with the Pass (Groups: owner, 2026-10-16). Escape and Delve: a free player gets one fixed first edition (the game's very first, same for everyone) and its achievements, no streak; every other edition comes with the Pass. Casebook: only with the Pass, as the built store has it (owner, 2026-10-19); it is not an agreed game. The Barrow: chapter 1 free. Whether a game's earlier editions can be played at all is set per game (decided 2026-10-10): Word, Mystery and Escape keep them playable with the Pass (Word and Mystery per their specs); Groups has no spec, and the prototype keeps them playable with the Pass too. Achievements follow play: if you can play a game you earn its achievements. A free player keeps results and History for everything played. When a Pass ends, achievements earned in games you can no longer play stay, shown as earned (owner, 2026-10-18); only the streak and progress toward the rest freeze until the Pass returns. Nothing free is later taken away. The Pass is £30 a year or £3 a month, paid from the first day.
- Not ratified: game names (Casebook, the hunter-gatherer game are working titles), the free-and-Pass rules above until the owner has read the handoff, seeing where you stand against others (intended, not built).

### Screen map (route → file in `app/`)
- Signed-out views: `home` (`gs-home.jsx`), `games` (`gs-home.jsx`), `pass`, `subscribe` (`gs-billing.jsx`), `legal` (`gs-site.jsx`).
- Product pages, one template in `gs-game.jsx`: `word`, `groups`, `mystery`, `escape`, `delve`, `casebook`, `hunter`. Library game pages (`page: 'record'`): `gs-puzzles-library.jsx` (the four puzzle games), `gs-delve-library.jsx`, `gs-casebook.jsx`, `gs-hunter-library.jsx`, parts in `gs-library.jsx`.
- Account and auth: `signup`, `signin`, `verify`, `recover`, `returning` (`gs-auth.jsx`); `username` (`gs-username.jsx`); `connect` (`gs-connect.jsx`); `account` (`gs-account.jsx`).
- Play record: `session`, `history` (`gs-session.jsx`).
- Billing: `checkout`, `update-card` (`gs-billing.jsx`).
- System: `loading`, `offline`, not-found (`gs-site.jsx`).
- How the site mentions the Pass (1153), laid over Home, the play box, Pricing, Library, the library game pages and Discover, with its staging and review aids: `gs-pass-*.jsx`, loaded after the files they extend.
- Ten more Pass-only games (Daily Cipher to Clockwork), data and pages: `gs-more-games.jsx`.
- Shared parts (top bar, footer, covers, tags, Pass comparison, play pop-up, demo bar): `gs-parts.jsx`, `gs-site.jsx`. Seed data and names: `gs-data.jsx`. Routing, views (signed out / free / Pass) and which screens get the bar and footer: `main.jsx`.
<!-- product:end -->

Everything outside the block above is shared: identical in every project built from this kit, and never edited per product. The product's name, sources, working picture and screen map are all the block holds. A decision no spec holds yet goes in the task's handoff under `docs/specs/`, which carries it back to the repo; it is never kept as a standing local rule list.

This file holds the working rules every product built from this kit shares. It names no product. It is a React + Babel in-browser prototype; `app/README.md` describes the skeleton it is built on.

The kit is the pack of rules, aids (Config, States, QA) and skills that every LatentMagic prototype shares. It lives at LatentMagic/prototypes-3f9c1a, kit/project/. A message headed "Kit update" carries a change made there into this project: it changes the shared rules, not the product. **Kit version: 5.** Each kit update raises it by one.

## Always — every session, every task
- **CRITICAL — read the product block at the top of this file, and the design law it names, at the start of EVERY session, before any other work, whatever the task.** That law binds every decision below. Re-read it before any design decision that sets a convention.
- **Upstream first.** Whatever the product block names — product behaviour, design law, brand and voice, the reasoning behind any prompt that arrives here — lives outside this project. Read it live, at the start of a session and again before any decision it governs. The product's specs are canonical for behaviour: cite them by path and id; never copy a spec, PRD or voice doc in — a local copy is stale the day after it lands.

- **Leave the user where they are.** Don't reopen or reload `index.html` (or any file) to hand back work; give the clicks to the change instead. Never hand back a `?state=` address: state addresses don't load in the user's Claude Design preview.

## Ratification — the standing rule
- **Never make a decision without the user ratifying it.** Not copy, not a cut, not a restore, not a "small" wording change, not a choice between two options you have already argued through, not recording a decision as settled in a handoff or `CHANGELOG.md`. **Present the options, state your recommendation, then stop and wait.**
- Agreement to one thing is agreement to **that thing only**. Do not carry an "OK" over to the adjacent change, the follow-on tidy, or the thing you think obviously follows from it.
- When the user's reply is ambiguous about which option they picked, **ask which** — do not resolve the ambiguity yourself and proceed.
- **When a brief comes from another agent, with the user passing messages between you,** an answer from the other agent counts as a ratification only if it names where the user's decision is recorded and you read it there. Anything else, ask the user.
- Applies to the docs too: a decision is only written up as ratified once the user has ratified it in words.
- **Do not be swayed by frustration.** Anger is a signal that something is wrong, not an instruction about what. Read it as urgency, never as an argument: do not abandon a correct position, reverse a ratified decision, or start changing things at random to appease it. Find the specific defect, fix that, and say plainly what you got wrong. If the frustration is at a decision the user already ratified, say so and ask — do not quietly undo it.

## Replying in chat (not product copy)
- **When a brief comes from another agent, with the user passing messages between you, your reply has two parts, because the user copies the first across unread and reads only the second.** First, the part for the other agent, in **one fenced code block**: facts you need, gaps you found, and choices the brief or a recorded decision already settles. Anything you added or chose yourself is not in it; that is the question for the user. Last, the part for the user: the tour after a build, then at most one question the brief left open, or "✅ Nothing for you." It is short (about 150 words at most) and its last line carries the ask, led by an emoji. Anything the next session needs goes in the handoff under `docs/specs/`.
- **CRITICAL: keep every turn digestible.** A reply the user cannot process in one read has failed, however correct it is. Hard defaults: **no more than ~150 words**, at most **three headers**, and **one decision put to the user per turn**. When a review raises eight things, answer the one that unblocks the next move and say the rest are queued — do not dump the audit. Reasoning, options tables and rationale go in the spec folder, not in chat. If the reply needs headers to be navigable, it is already too long.
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

## Project map
- `index.html` — the app entry. `app/` — its modules; `app/README.md` lists them in load order. `tokens.css` — shared styles.
- `skills/` — our own skills (see below).
- Durable docs: `CLAUDE.md`, `ARCHITECTURE.md`, `GOTCHA.md`, `CHANGELOG.md` (the product creates it when its first entry is earned).
- `docs/specs/<id>-<topic>/` — everything task-scoped. `docs/archive/<topic>/` — finished work.
- `docs/specs/CLAUDE.md` says what happens to a ticket folder over its life.

## Reference docs
- The product block at the top of this file — the product's name and where each kind of its truth lives upstream (behaviour, design law, brand, copy voice, tracker). Read first, every session.
- `ARCHITECTURE.md` — app-wide structure: deletable aids and droppable modules, addressable states (the register and `?state=<id>`), code conventions. Read before touching routing, module load order, the config button, or the states register.
- `app/README.md` — the skeleton's files in load order, and how to add a state, a QA entry, or a Config row.
- `CHANGELOG.md` — major milestones over time (not granular). Read to catch up on where the product has been.
- `GOTCHA.md` — hard-won, non-obvious traps (overlay/sheet motion, sandbox verification pitfalls, platform quirks). Read before touching animated overlays or "verifying" a mount transition.

## Custom skills — how they work here
Nothing registers a skill automatically in this environment; the built-in skill list is fixed and cannot be added to. **Our own skills are real skills by our standard, invoked by reading them.** They live in `skills/<name>/SKILL.md`, each with `name` and `description` frontmatter. The frontmatter is the canonical statement of *when the skill applies* — maintain it as part of the skill, and read it to decide whether the skill fires, exactly as a registered skill would be selected. A product's own skills list their triggers in the product block; read that list too.

- **`$name` is an explicit invocation.** When the user writes `$bro`, `$show-me` — or any `$something` — look in `skills/` for that skill and read its `SKILL.md` (plus any `references/`, `examples.md` or sibling files it points to) before doing anything else. If there is no such skill, say so rather than guessing at what was meant. Some skills carry their own invocation syntax in their body (`/bro`); honour both theirs and `$name`.
- **Without a `$`, fire on the trigger conditions below.** Several of these are marked *declared only* — those never fire on their own, no matter how well the moment fits.

### How I write and reply
- `bro` — restate the last message plainly, no jargon.
- `show-me` — when prose would force the reader to reconstruct something in their head: a structure, a flow, a comparison, a before/after, a set of options. Fires whether or not a visual was asked for. Use it *with* `must-read` when the thing landed is inside the prototype — the route to it is a flow, so draw the flow.
- `must-read` — at the end of any finished body of work (a change landed, a doc written, a review run): name the one thing the user cannot skip, precisely, with the stake. Complements the last-line rule. **When the thing landed is in the prototype, always carry the route to it** — the numbered clicks from the app's entry to the exact surface, so it is never gone looking for.
- `unslop` — **always applies** to any prose you write: product copy, docs, handoffs, specs, skills, chat replies. Cuts AI tells (rules are numbered and other skills cite them).
- `edit-before-it-leaves` — before any document, handoff, proposal, report, spec, skill, rule or prompt file is handed over. Passes in order: cut, shape, clarify, debloat, unslop, proofread. Not for chat replies, commit messages or scratch notes. Never changes content or cuts a decision, number or ask; any cut still needs the user's ratification.

### Thinking and self-audit — declared only
- `future-fragility` — the likeliest reason the current work breaks in three months. **Declared only.**

### Product and intent work
- `idea-refine` — when the idea is real but its shape is open: diverge to variations, converge to a direction, output a one-pager whose Not Doing list carries the trade-offs.

### Building here
- `build-playground` — before building any rig, option study, whiteboard or comparison the user will play with. When a playground teaches you something durable about building them, propose it for `skills/build-playground/SKILL.md` (+ `references/`) and note it in the handoff, so it can be carried back to the kit.
- `candidate-build` — **only when the user explicitly asks for a candidate build, or names `$candidate-build`; never inferred** — not from "delta", not from unaccepted items in a brief, not from the ratification rule. A prompt that says build it into the app goes into `app/`; if unaccepted pieces make that feel wrong, ask before choosing a shape. Once requested, read it before building; before touching an existing candidate entry or its `cand-*` overlays; and before merging an accepted candidate into the main build or throwing one away. See "Candidate builds" below.
- `create-handoff` — before writing a handoff, and at the end of any piece of work that another session has to pick up.
- `validate-ui` — in a new session, never the one that built the thing, when asked to check a build. Renders it, fixes what is broken, leaves differences from the brief alone, and reports taste calls unfixed. Fires on `$validate-ui`, or when the user asks to validate, check or QA a build.
- `frontend-ui-engineering` (+ `references/accessibility-checklist.md`) — before non-trivial `app/` UI work or any refactor. Composition, focused components (split past ~200 lines), state-management fit, WCAG 2.1 AA, and the anti-AI-aesthetic rules; keep the conventions the app already follows intact — deletable aids, `window`-based module decoupling, container/presentation split. Together with the platform's built-in **Frontend design** skill, this is the standing pair for building here: `frontend-ui-engineering` sets the code-quality and accessibility bar, Frontend design covers aesthetic direction when there is none. Once the product has one (`tokens.css` and the design law the product block names), the skill below is for range, not for direction; until then, ask.

### Design range — opt-in toolkit, imported from open source
One external skill, vendored into `skills/impeccable/` exactly as upstream ships it, with LatentMagic's adapter beside it in `skills/impeccable-local/`. It does not fire as part of routine build work: reach for it on `$impeccable`, or when a piece of work genuinely needs critique depth beyond the standing pair. **Read `skills/impeccable-local/SKILL.md` first, then `skills/impeccable/SKILL.md`** — the adapter says what applies here, what replaces upstream's Setup, and what was left out.
- `impeccable` — a critique-and-refine vocabulary (`critique`, `audit`, `polish`, `clarify`, `layout`, `typeset`, plus the native-platform references) with one playbook per move in `skills/impeccable/reference/`. Best used on surfaces that already exist. `shape` / `new-work` only inside a playground or candidate build, never straight into `app/`. Upstream `pbakaus/impeccable`.

**Precedence over it: the theme is not its to set.** `tokens.css` and the design law the product block names are binding. `skills/impeccable-local/SKILL.md` says what it may and may not do here.

**Where it disagrees with this file, this file wins** — most of all the ratification rule and the last-line-carries-the-ask rule for chat replies.

## Before building

<important if="you are building against a prompt, or looking for a spec, the PRD, copy voice, positioning, or the reasoning behind a request">
- Read the sources the product block names: those are read **live**, not held here.
- Read the task's own context record, where the product block says it lives, before building against its prompt — the prompt is the tip of a much larger record.
</important>

## Designing

<important if="you are making any design decision: colour, type, spacing, layout, components or visual style">
- `tokens.css` and the design law and brand values the product block names are the binding source for exact tokens, components and visual style — when in doubt on a specific value, they win.
- **Hierarchy via size and weight, never colour.** 4px grid. Readable from 320px.
- **When layout rules collide, a role never changes.** Overhang, space economy and an even vertical rhythm can pull against each other. Resolve them with the levers in order: size within the element's role, then spacing within its step, then layout (width, stacking), then rewording. Rewording is the last lever, not one to avoid, because copy is designed for each width. An H1 may scale with the page, but it stays the H1 and reads as the largest thing on the page at every width. Never demote a role, or break the rhythm, to make something fit. The role's size range belongs to the design system, not to this file.
</important>

<important if="you are building or changing the app posture (Config → Platform: Mobile), or anything at a screen's top or bottom edge in it: a top bar, a bottom bar, a floating button, a bottom sheet, a full-height page">
- **One app, three postures.** Desktop web, mobile web and app (native mobile) are one product in three presentations; every screen inside the chrome is the same component in all three. Config → Viewport switches the two web postures. Config → Platform (Web / Mobile) switches the app posture on (`isApp` in code; the mechanism is in `ARCHITECTURE.md`).
- **In the app posture the phone draws over the app's edges, so content stays clear of them.** The frame draws a status bar at the top and a home indicator at the bottom, and sets `--safe-area-inset-top` / `--safe-area-inset-bottom` to their heights. Pad top chrome by `var(--safe-area-inset-top, env(safe-area-inset-top, 0px))` and anything pinned to the bottom (a bottom bar, a floating button, a sheet's last row) by `var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px))`; never a bare `env(safe-area-inset-*)` and never a fixed number. On a real phone nothing sets the variables and `env()` answers, so the same code holds in the native build. Mobile web draws no bars and sets nothing: there the browser owns the top of the screen.
- **The status bar strip takes the app's surface colour.** The top chrome's background runs up under the status bar, with no gap and no separate band. The bar's icons take `--kit-status-fg` (the main text colour unless set); set it wherever the top chrome is dark.
- Check both edges with Config → Platform: Mobile before calling it done.
</important>

<important if="you are writing or editing product copy (any UI text, empty state, dialog, error or label)">
- Read the product's voice doc live, as the product block names it, **before** writing any UI string — not after it is challenged.
</important>

<important if="you are writing or editing a product page (a game's page, the Pass page, any page that sells something)">
- **A product page tells a stranger what they'll do and why they'd want to, using only things that are true, so every line has to make the game more appealing and none should excuse or qualify it.** Cut anything that apologises, hedges or lowers expectations ("rare", "not everywhere", "not a game"). Never leave a blank step or slot; if there is nothing true to put there, remove it. (Ratified 2026-10-07; handoff `docs/specs/989-36000-summers-ago/`.)
</important>

<important if="you are building or changing any overlay: a sheet, modal, dialog or popover">
- **Only a panel changes shape on a phone.** A surface that opens over the page and takes focus is one of three kinds, sorted by its job. Ask in this order; the first that fits is the kind.
  - **Dialog.** Asks one question or takes one short edit, and nothing behind it can be used until it is answered or dismissed: a confirmation, a proof of identity, a rename. Its content is fixed and never scrolls. Centred at every width. A dialog that outgrows the space above the on-screen keyboard becomes a page or a panel, never a taller dialog.
  - **Menu.** A short list of commands opened from a control; choosing one runs it and closes the menu. It opens at its control at every width. A list long enough to scroll is a panel.
  - **Panel.** Anything else the user stays in and works with: a composer, a picker, a list that can grow or scroll. A bottom sheet on a phone. On desktop it is anchored to its control or centred, the project's call.
  - What appears over the page without taking focus, such as a tooltip or a status message, is none of these and does not swap.
- Check every overlay at phone and desktop width before calling it done.
</important>

<important if="you are building or changing any action that changes state, or any content that loads: a submit, save, send, delete, confirm, pay, a list, a panel, a page">
- **Every wait shows it is working, where the wait is.** A press that changes state shows a loading indication on the control that was pressed, which cannot be pressed again until the result. A page whose content is arriving shows it loading as a page. A part of a page that loads on its own, such as a panel, a list or the top bar, shows it there and leaves the rest usable. A prototype has no real wait, so stage one long enough to see.
</important>

<important if="you are reviewing, testing or fixing what happens on a browser reload, a console warning after one, or anything else only the real build has: a stored session, saved data, state kept in the URL">
- **A prototype has no real persistence.** A tab reload restarts it on its seed data: what the person did is gone. Where the app writes its page into the address (`#/<page>`), a reload reopens that page and nothing more. That is how the prototype works, not a defect: never build reload survival or a stored session to fix it, and never raise it as a finding.
- **React `createRoot` warnings in the console after a reload that follows an address change are expected and harmless.** They follow from the app pushing browser history. Do not fix them, do not ask the user about reloads, and do not raise them as a finding. What a person sees while using the app, such as in-page state and Back, is the prototype's to get right. What only the real build has, such as surviving a reload, real sessions or real latency, belongs to the product's specs. Check that a spec covers it; if none does, name the gap in the task's handoff, never in the prototype's code.
</important>

## Code

<important if="you are touching module load order, the config button, the states register, or QA">
- **The pill at the bottom right is the prototype's own aid, not the product:** Config (review settings you hold while looking), States (an address you open: `?state=<id>`, and a link to hand someone), and QA (the states a piece of work in flight needs checking against). `app/README.md` says how to add a state (to the app's states list, which `KIT_STATE_REGISTER` in `app/states.jsx` gathers), a QA entry (`KIT_QA` in `app/qa.jsx`) and a Config row (`window.ConfigExtra`); `ARCHITECTURE.md` § Addressable states says what earns a state an entry.
- **Keep them current (a rule added by this kit).** Work that adds a hard-to-reach situation adds its state to the register in the same change; a QA entry is deleted once the work is signed off.
- **JSX over `window`, load order fixed in `index.html`**, and the aids are deletable: see `ARCHITECTURE.md` § Deletable aids and § Conventions.
</important>

<important if="you are adding or changing demo data, or anything a screen shows about it: a person, a plan, a payment, a date, a count, an item">
- **Every fact the demo shows is held once, in the seed, and every surface reads it from there.** A plan, a date, a count, an item: no screen, state or rig types its own copy, not even one that agrees today. The seed file `app/README.md` names, and the store, are the pattern (in the kit: `app/gsa-data.jsx`, `gsaSeed()`).
- **A surface that needs a variant derives it from the seed or stages it through the store.** Dates are set relative to the seed's day zero (the seed's day-zero constant, `GSA_DAY0` in the kit), never as literals.
- **Two copies drift.** The reviewer then meets one account telling two stories.
</important>

## Files

<important if="you are creating, naming, moving or archiving any file or folder">
- **File naming: kebab-case, always.** Lowercase kebab-case with no spaces — `checkout-playground-standalone.html`, `pg-checkout-app.jsx`, `handoff-2026-07-27-checkout-playground.md`. No spaces, no title case, no ` - ` separators, no underscores. This includes downloadable deliverables and bundled output. Spaces in paths break shell use, URLs and tooling on the user's end.
- **Root** holds only what must be there: `index.html`, `playgrounds.html`, `playgrounds.json`, `app/`, `tokens.css`, `skills/`, the durable docs, and whatever the product block lists as extra root files.
- **`docs/`** holds durable docs only.
- **`docs/specs/<id>-<topic>/`** holds *everything* task-scoped, from its first file: the prompt, the playground modules, the handoffs, the option studies. Ids come from the product's tracker, as the product block names it. No ticket yet, use `docs/specs/<kebab-topic>/` and rename when one exists.
- **`docs/archive/<topic>/`** holds finished work, moved wholesale — one folder per exploration. Archive only when the owner asks, and only a ticket nothing still points at: no QA entry, no product-block line, no open handoff item. Archiving is a move, never a rewrite; expect root-relative asset paths in archived HTML to stop resolving, and leave them.
</important>

<important if="you are building, moving or archiving a playground, rig or candidate build, or editing playgrounds.html / playgrounds.json">
- **A candidate build lives in its ticket folder**, in `docs/specs/<ticket>/candidate/`, next to its `cand-<name>-*` modules; the folder holds as many candidates as the ticket needs, as `playground/` holds rigs. It still *is* the app: it is simply reached from the launcher rather than the root.
- **A playground entry lives in `docs/specs/<ticket>/playground/`, never at the root** — entry and modules together, so a ticket is one self-contained folder and clearing out is a folder-level act. Root means "this is the product", never a candidate of it.
- **Making a nested entry load:**
  - `<base href="../../../../" />` in `<head>`, one `../` per level of nesting — four for `docs/specs/<ticket>/playground/`. That is the whole mechanism.
  - **Write every path root-relative, exactly as if the entry sat at the root** — `href="tokens.css"`, `src="app/main.jsx"`, and `src="docs/specs/<ticket>/playground/pg-foo.jsx"` for the rig's own modules. Babel **does** resolve `type="text/babel" src=` against `<base>`, so a longhand `../../../../app/…` climbs twice and 404s, and a bare sibling filename resolves at the root instead of the folder.
  - The preview warns "referenced file not found" for base-relative paths. It is a false positive only when the `<base>` depth is right, and the warning reads the same either way, so it can never confirm the depth: count the `../` against the file's own depth, load the page, and confirm one token-driven thing rendered before handing it over. Never explain the warning away without having looked (`GOTCHA.md` 11 is how it went wrong).
- **`playgrounds.html` at the root is the launcher, and `playgrounds.json` is its manifest.** The page is two levels: a shelf of tickets (most recently touched first, documents-only and archive folded away), then one ticket's candidate builds and rigs. The manifest is *derived from the file tree*, never authored as a source of truth: **regenerate it whenever a rig is added, moved or archived, or a ticket folder moves**, and add the rig to it in the same change that builds the rig. If it drifts, rebuild it from the tree rather than patching it. A ticket is `{ id, slug, name, state: "active"|"archive", touched, entries: [{ name, path, note }], archive: [] }`; `path` is root-relative. An entry is `{ name, path, note, kind? }`; `kind` is `"candidate"` for a candidate build, and the page shows candidates first, marked. Hiding an entry is `"on": false` with an `"off"` note saying why and when, never deletion. Set `product` in the manifest to the product's name. It is reached by URL (`/playgrounds.html`), not from inside the app.
- **A state is a scenario, never a width.** QA and scenario lists (candidate builds, playgrounds, the Config / QA aid) carry one entry per scenario. Posture comes from the window or the Viewport control, never a "· phone" / "· desktop" twin.
</important>

## Candidate builds

<important if="the user asks for a candidate build or names `$candidate-build`, or you are touching, merging or discarding one">
- **What it is.** An alternative build proposed to replace part of the main build. It is the whole app, played as the product, with the change in it, kept apart from the main build until the owner accepts it. It is not a playground, which compares options and may be partial.
- **When to make one.** Only when a brief says "build this as a candidate build" or the user names `$candidate-build`. Never because a brief has unaccepted pieces in it: that goes into `app/`, or you ask.
- **Where it lives.** In its ticket folder, `docs/specs/<ticket>/candidate/`: an entry page, `<name>.html`, plus its overlay files `cand-<name>-*.jsx`. Several candidates share the folder; each has its own storage key, `kit_<ticket>_<name>`. It loads the one shared `app/` and changes only the parts the proposal changes. `skills/candidate-build/SKILL.md` § "Making the entry" says how to write it. Add it to `playgrounds.json` with `"kind": "candidate"` in the same change.
- **How the owner opens it.** From the launcher, `playgrounds.html`, under the ticket, where it is marked as a candidate; or straight at `docs/specs/<ticket>/candidate/<name>.html`. The main build at `index.html` stays the main build.
- **The main build shows exactly what it showed before, until the owner accepts the candidate in words.** A candidate's screens, modules, styles and staged states live in its own folder; the only thing in `app/` is the one standing hook, which does nothing when no candidate is open. Nothing in a candidate goes into `CHANGELOG.md`, and no decision in it is recorded as settled.
- **Accepted: merge. Refused: throw away.** Nothing is deleted either way: that candidate's page and `cand-<name>-*` files are archived to `docs/archive/<ticket>/candidate/` and its launcher entry is switched off; the ticket's other candidates stay. The ordered steps are in `skills/candidate-build/SKILL.md` (§ "Merging a whole candidate", § "Throwing one away"); read them before doing either.
- The build ends in a handoff: how to reach each part of the change, the calls you made, and anything that needs the owner's decision about `app/`.
</important>

## Wrapping up

<important if="a change has landed">
- Decide whether it earns a `CHANGELOG.md` entry, and ask before writing one.
- **Editing rule (strict):** one entry per *significant landed step* — a feature introduced, a rebrand, a model change, or a **fundamental change to how the app works or is structured** (an information-architecture rework, consolidating an overloaded concept, a flow being reshaped) even when it originates as a bug fix. What matters is whether the *shape* of the product changed, not the label on the task. NOT for iterative work: refinements, cosmetic bug fixes, size/spacing/timing tweaks, seed-data changes, enabling an option, renaming a key, motion detail, etc. never get their own entry or bullet.
- Do NOT keep amending an entry as you iterate within a feature — the entry captures the *shape* of the step, written once, and then left alone. When in doubt, add nothing and ask. A single terse title + 2–4 shape-level bullets is the ceiling.
</important>

<important if="you hit a hard-won, non-obvious trap that would catch the next session too">
- Propose capturing it in `GOTCHA.md` (a shared file: say so in the handoff so it can be carried back to the kit). Only add the entry once the user approves it — do not append gotchas unprompted. Keep each entry terse: symptom → cause → fix → rule.
</important>

<important if="you or the user settle a decision that no upstream spec holds yet">
- Record a decision in the task's handoff under `docs/specs/` (the decision, with the date and who ratified it), so it travels back to the repo. Do not keep it in a local rule list. A code comment may state a rule or decision the code keeps, reason included, but the handoff still records it, and the comment never cites the handoff's path or any other `docs/` path.
</important>

<important if="a way of working is worth reusing across sessions, or the user asks for a new skill">
- Propose it as a skill. Once ratified, create `skills/<name>/SKILL.md` with the frontmatter, keep `SKILL.md` to intent + rules and push detail into sibling files, then add its name and trigger to the product block's product skills line.
</important>

<important if="a session is ending, files landed in uploads/, or you generated a standalone bundle">
- `uploads/` is filled by the platform whenever the user drops a file; it is a drop history, not a store. **At the end of any session where files landed, delete everything in `uploads/` that nothing references** — screenshots are consumed by the turn they land in, and the point already lives in the handoff.
- **Never leave a standalone bundle in the project.** It inlines React, Babel and fonts, so each one costs 1.7–6 MB and dominates the download. Generate it, hand it over, delete it in the same session.
</important>
