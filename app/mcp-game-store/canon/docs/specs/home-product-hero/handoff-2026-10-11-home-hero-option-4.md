# Handoff: home hero, option 4 landed

Date: 2026-10-11. Follows `handoff-2026-10-09-home-product-hero-playground.md`.

## Decided
- **Option 4 goes into the app.** Ratified by the owner, 2026-10-11 ("we're just going to go with this. Integrate 4").
  - H1 is the promise on two lines: "Your AI does the talking. / The game keeps the score." Subline: "Play small games by talking to Claude or ChatGPT. The game holds the rules, the dice and your record."
  - Beside it, Casebook's cover field (home-hero option 9). Its cream bar is taller (48% to 66%).
  - The field takes the copy column's height from 900px and up, so it never overhangs; the chat gives up its top turns to fit.
  - The chat is the whole Casebook conversation from its product page (eight turns), scrollable. It opens on the latest turn. A pill, "Earlier in the case", shows while there is more above and scrolls back to the start. The top fades while there is more above.
  - Scroll bar: 6px, rounded, 4px off the edge, track inset 10px top and bottom.
  - Bar and pill take the chat's send-button colours (`--c-send`, `--c-send-fg`).
  - The lower band is headed "The Pass". The promise no longer repeats there.
- **ChatPicture colours.** The owner changed them in the design system: background off-white, send button warm grey (`--control-edge`) with a white arrow. The bundled `_ds/` `components.css` was refreshed from the source, so every chat in the app follows.

## Changed
- `app/gs-home.jsx`: hero copy, the field's bar, the scroll and pill (`useGsHeroScroll`), and the Pass band.
- `app/gs-chats.jsx`: `GS_HERO_CHAT` is now every Casebook turn.
- `index.html`: H1 size, the field's fit, the scroll bar and pill; the `hm-how` / `hm-say` / `hm-pass` rules were removed.
- Playground: rebased on today's app, with options 4 to 6 added. Option 0 now shows what option 4 shipped.

## Open
- Options 5 and 6 weren't reviewed, so they stay in the rig.
- The new subline needs the voice pass.
- The scroll and pill were checked on desktop only. Check at phone width.
