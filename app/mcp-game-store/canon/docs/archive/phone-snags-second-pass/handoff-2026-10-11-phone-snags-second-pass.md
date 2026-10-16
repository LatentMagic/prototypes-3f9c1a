# Handoff: phone snags, second pass (2026-10-11)

Six snags from the owner's phone. Bound by `LatentMagic/monorepo` `specs/governance/standards/ui-design.md` (main, read 2026-10-11) and the design system's `guidelines/game-art-motion.md`. QA entry: `phone-snags-second-pass` in `app/qa.jsx` (delete it once signed off).

## What was built, and where

1. **Repeat Play card removed.** `GsWeekCard` and its use are deleted from `app/gs-game.jsx`. No register, Config or QA entry pointed at it. The QA note for `first-release-games` no longer mentions it. `GS_PAGES[id].week` stays, because `gs-player.jsx` (Delve's "This week's scene") and `gs-puzzles-library.jsx` read its `line`.
2. **Cover motion.** "More games" (`GsGameCard`, `app/gs-parts.jsx`) is now a host card like Home's: `mcp-art-host gs-host`, `GsArt` in place of the static cover, the title button stretched over the card, and the touch pose from `useGsArtHost`. `GsCoverButton` had no other user and is deleted (its `.gs-coverbtn` CSS in `index.html` is left, shared with `.dc-tile` rules).
3. **The hold.** One category rule at the end of `<style>` in `index.html`, plus a pointer hook on the home hero (`app/gs-home.jsx`).
4. **Covers on a phone.** CSS only, under `@container gs (max-width: 719px)` at the end of `<style>`.
5. **Phone account button.** `GsUserMenu compact` now renders a secondary `DS.Button` (`.gs-acct-ico`, 48px square) holding a new `account` glyph in `GS_GLYPHS` (`app/gs-site.jsx`).
6. **Account order.** `app/gs-account.jsx`: Pass, Notifications, Username, Change email, Change password, Your data, Delete account.

## Choices under "Yours to decide"

- **Small thumbnails in pressable rows stay still** (History rows, the Delve "recent" rows, the "In your library" banner). At 32–64px the capped moves come to a few pixels and read as jitter; the row already answers the press with its fill. They are also static SVG covers, not motion pieces.
- **More games: the whole card is the target**, as on Home and Discover, not just the cover button. One target, one hover surface, matching what a player has already learned.
- **Oversized covers.** Product page and session page heads, on a phone, show the cover at 96px beside the title, the layout the library game page head (`.rf-head`) already uses. Tablet and desktop are unchanged. On the session page the thumbnail sits beside the edition label (or the H1 on an unplayed edition); the H1, figures and buttons run full width below it. More games art is 2:1 on a phone, 4:3 from 720px. The motion pieces recompose by aspect ratio, so nothing is cropped.
- **Phone account icon: a person.** A square head over a shoulders bar, drawn in the system's line style (1.75 stroke, square caps, mitred joins). The button holds the account, so a person says what it holds. The settings gear was the other option: it already marks "Manage account" inside the menu, and would read as settings only. The system has no person icon, so this is a local glyph beside `mail`, `card` and `pass`. It may belong in the system.
- **Username card position: third, after Pass and Notifications**, at the head of the details you change rarely (username, email, password). Nothing else was reordered. The Notifications QA note now says "second".

## Found already present

- The DS already turns off selection on `.mcp-btn`, `.mcp-lnk`, link cards and rows, `.mcp-art-host`, menu items and disclosure buttons, and the app had a named list (`.gs-pz-item`, `.gs-hrow`, `.lb-tile` and others). Both stay.
- Home and Discover cards already move on hover, focus and touch. The library game page head was already a small cover beside the title.

## What item 1 removed that the top box does not say

- The heading: "Today's word", "Today's groups", "Today's case", "This week's room", "This week's case", "This week's scene", "The day".
- The one-line description of the edition, for example "Five letters. Six guesses." or "Sixteen turns. One accusation."
- A second copy of the game's name and cover.
- For a player who can't play: "… comes with the Pass. The first … is free." and a Pass tag.
- The Play that handed over a prompt naming a specific edition. The top box's plain prompt stays.

## What items 2 and 3 cover and leave alone

**Moves:** Home's "Available games" cards, Discover's picks, rows and tiles (unchanged), the home hero's Casebook art (now also on touch, through `.is-on`), and product pages' More games cards (new).

**Still:** the product page's head cover, the session page cover, library game page heads, Coming soon cards, the share card, and the row thumbnails above.

**No selection on a hold:** every `button`, every element with an ARIA role a press acts on (`button`, `menuitem`, `menuitemradio`, `switch`, `tab`, `option`, `radio`, `checkbox`), `summary`, game cards (`.gs-host`, `.mcp-art-host`), every picture (`.mcp-art`, `.mcp-cover`, `.pg-mini`), the home hero field, and chat pictures (`.mcp-chat`, `.gs-chat`, the "How it looks in your chat" row too). What they share: a press on them does something, or they are pictures.

**Left selectable:** body copy, headings, figures, prompts, share text, fields (reset explicitly, because Safari can lock a field inside an unselectable parent), and real `<a href>` links, which keep the phone's own menu.

## Unresolved

- **Signed-in product page.** The "In your library" banner (about 130px) sits above the head. My estimate: banner, head row (96px), the play box's label, heading and three steps, and the page's 36px gaps put Play just below the fold on a 390×844 phone in Safari. Signed out, it should be in view. This is an estimate and has not been measured. Getting Play into view signed in would need the banner moved below the play box on a phone, or the play box's steps shortened. Both change the order or the copy, so neither was done. Owner's call.
- The chat pictures are now unselectable. If the owner wants their lines copyable, take `.mcp-chat` and `.gs-chat` out of the rule.
- Not checked on a real phone. The touch pose and the hold need a press on a real device (GOTCHA 2).

## Next

Measure signed in and signed out at 390×844 and 320×568, put the banner question to the owner, and propose the person glyph to the design system.
