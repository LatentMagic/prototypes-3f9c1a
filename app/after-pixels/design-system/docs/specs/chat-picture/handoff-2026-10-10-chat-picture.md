# Handoff: our own picture of a game being played (chat picture)

Date: 2026-10-10. Asked by Jonny via the product owner. Nothing here is ratified.

## What was built, and where

- **Entry:** `docs/specs/chat-picture/playground/chat-picture.html` (moved from the root on 2026-10-11; it carries `<base href="../../../../">` and root-relative paths).
- **The real app, mounted:** `docs/specs/chat-picture/playground/app/`, `tokens.css` and `assets/` are an unedited snapshot of the Game Store product project (`/projects/9aec15ee-…/`, 2026-10-10). The entry is the product's `index.html` with three changes: the `<base>`, the design-system paths pointed at this project's live `styles.css` and `_ds_bundle.js`, and one script added before `main.jsx`.
- **The rig:** `docs/specs/chat-picture/playground/pg-chat-picture.jsx` and a `<style>` block (`.pgc*`) in the entry. It replaces `window.GsShot` for calls without `zoom`, which is the product page's "How it looks in your chat" slot only. The home hero (which calls it with `zoom`) keeps today's screenshot. It opens the Daily Word product page through the app's own router (`gsApi.go('word')`).
- **Strip:** dark, magenta-edged, above the app's demo bar. Options 0 to 3, one tap each; a tap also scrolls to the picture. "Why" shows the stance and cost; "Hide" folds it to a tab. Selection is kept in `localStorage` under `pg_chat-picture_v1`.
- Viewport: the app's own Config pill (Auto / Mobile, phone frame) works unchanged.

## The options

All three show the same real turns: the Daily Word play of 5 Oct 2026, verbatim from `assets/in-use/daily-word-claude-code-2026-10-05.png`. It ends where the screenshot ends, at the DRAIN board. Nothing was invented. The caption is the page's existing one.

- **0 · Today.** The Claude Code screenshot, for reference. Not an option.
- **1 · Any chat.** A light, rounded chat window in system type with letter tiles, belonging to no app. It is ours through its content. Cost: it breaks the page's dark, square look and can pass for a stock mock-up of somebody else's app.
- **2 · Transcript.** No window or bubbles. The turns are set as a script ("You" / "Your AI") in the page's own type, with the board shown the way the engine returns it (word plus squares). It takes tokens only, no components. Cost: it doesn't read as a chat at a glance, and it runs long.
- **3 · On the cover.** A phone-sized dark chat, latest turn at the bottom, set into Daily Word's cover field and art (`GsArt art="word"`). The art says whose it is. Cost: a drawn device, small type at half width, and the cover art shows twice on one page.

## Open items, and what I chose

- **How much it takes from the design system:** the three options cover the range: none (1), tokens only (2), the game's art but not its UI (3).
- **Whether a drawn picture replaces screenshots:** left open. Option 0 stays so it can be compared.
- **"Called daily-word":** kept in every option. It is in the record and it names our tool, not another company's app.
- **Tile colours:** 1 and 3 use their own neutral green and amber in oklch. 2 uses `--success` / `--warning`.
- **Slot width:** unchanged. The page's `gs-grid2` holds one picture at half width from 720px up, so the right half stays empty, as it does today.

## Not built, or unresolved

- `earlier-drawn-chat.png` was not in the project, so the drawn attempt the owner saw was not compared directly.
- The snapshot will drift from the product. If the product page changes before review, re-copy `app/` from the product project.
- Other games: none was attempted, since Daily Word is the only real play on record.

## Next

1. Review on desktop and on a phone (Config → Viewport → Mobile).
2. Once a direction is picked, build it as a design-system component (for example a `ChatPicture` with a turns prop) with a `@dsCard`, then have the product swap `GsShot` on product pages.
3. Archive the rig by moving `docs/specs/chat-picture/` to `docs/archive/chat-picture/` once agreed.
