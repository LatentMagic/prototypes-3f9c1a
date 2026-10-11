# Handoff: phone snags, build side (2026-10-11)

Source of every decision: the design system project, `docs/specs/phone-snags/review-notes.md`. Joe ratified each choice there; nothing below is a new decision except where marked **open**.

## Built, and where it lives

The design-system bundle was pulled first: `_ds/mcp-game-store-design-system-ef1abd5b-…/` (`_ds_bundle.js`, `_ds_manifest.json`, `styles.css`, `components/components.css`, `tokens/*`).

**#4 Pass chip.** Deleted `.gs-tagbtn:active { opacity: .55; }` from `index.html`. `GsPassTag` keeps its `.gs-tagbtn` wrapper (44px hit area). No markup change: the new `Tag kind="locked"` draws the solid edge, lock and chevron, and presses itself.
*Why (notes):* 1.5px dashes fall between a phone's pixels and drop out on the short sides. Joe chose "Outline". With the old rule kept, the chip would fade and shrink at once.

**#3 Row arrows.** `DS.CardRow` replaces `GsCardRow`: Home "Available games" (`app/gs-home.jsx`), Discover "Just added" and "Free to play" (`app/gs-discover.jsx`, the sentence passed as `sub`). `GsCardRow` and its `window` export are gone from `app/gs-site.jsx`. Deleted from `index.html`: `.gs-feats` (all rules, and its container query), `.gs-rowhead`, `.gs-rownav`, `.gs-rownav-btn`. Nothing else used them. `.gs-feat` (the card) stays.
*Why (notes):* the arrows sat on the heading's baseline, about 7px low, and on "Free to play" the sentence pushed them onto a line of their own. The title now sits left with the arrows centred on its first line; the sentence runs under both.

**#5 Library row.** `GsLibrary` (`app/gs-discover.jsx`) renders `DS.RowList label="Library"` of `DS.ListRow` (lead `GpMini sm`, title, result, tone, when, onClick to the game's library page). Genre is dropped from the row. `GS_LIB_READY` holds the five "is ready" lines; each row's status comes from `gsLibRow` (see the follow-ups below). Genre and Schedule filters unchanged. Deleted: `.dc-lrow*` CSS (including its hover and reduced-motion entries), `dcChev`.
*Why (notes):* the old line answered four different questions row to row. Joe chose "What's waiting": every row answers whether there is something to play now. Streaks and missed days stay on the game's page and in History.

**#2 Press and hold.** In `index.html`:
- `opacity: .55` press removed from `.gs-inlink`, `.gs-ft-link`, `.dc-tile-name`, and the `opacity` transition dropped from those plus `.gs-ft-mail` and `.gs-support`.
- New press: `.gs-inlink`, `.dc-tile-name`, `.gs-legal-col a` turn white with the underline at 6px in full colour. The muted ones (`.gs-ft-link`, `.gs-ft-mail`, `.gs-support`, `.gs-small a`) go to `var(--text)` with the same underline.
- `user-select: none` and `-webkit-touch-callout: none` on `.gs-pz-item`, `.gs-hrow`, `.lb-tile`, `.lb-achbtn`, `.dc-chips > button`, `.lb-choice > button`, `.gs-plan`.
- Game cards (`.gs-host`) get selection-off and the chip fix from the bundle. The pose still lasts while the finger is down.
*Why (notes):* faded text reads as disabled, not pressed; a long press selected words; a `daily` chip's fill matched the pressed card and vanished. Joe kept "Stay" for the hold.

**#1 Phone top bar, signed out.** `GsTopBar` (`app/gs-parts.jsx`), narrow menu: after the page rows, a `.gs-menu-div`, then one `.gs-pop-cta` block with `DS.Button variant="secondary" block` Sign in and `DS.Button block` Start free, 8px apart, 8px 16px padding. Each closes the menu and goes where it went before. The bar, the signed-in menu and the wide bar are unchanged.
*Why (notes):* Sign in was a plain row and did not read as an action. Joe chose "Menu holds both as buttons"; putting either in the bar overflowed at 390px.

## Checked at 390, 360 and 320px

Menu, all three card rows, the Pass chip, and the Library list (free and Pass) render correctly at each width. A two-line "Available games" at 320px keeps the arrows level with its first line.

## Left alone

- Buttons without an underline (`.gs-navlink`, `.gs-brand`, `.gs-iconbtn`, cover buttons, `.gs-acct-btn`, `.lb-back`, `.gs-hero-name`, `.gs-today-item`, `.lb-pagenums`) keep their `opacity: .55` press, as the notes say.
- The build's underlined links are still selectable; the notes only asked for the pressed look on them. Real `<a href>` links keep the phone's long-press menu.
- **Menu width.** The notes say the menu is 200px wide and suggest 240px. The signed-out menu is already 260px (a later `.gs-pop { min-width: 260px; }` rule wins) and clears the left edge at 320px, so I did not change it.

## Follow-ups (11 October, from the design system's review notes)

**Pass ended, Casebook and Delve rows: "Pass only".** Ratified by the owner, 11 October. It matches 36,000 Summers Ago and says what's waiting. A new state, Screens → "6. Library, Pass ended" (`library-pass-ended`), opens this view.

**Never played: `when` left empty.** It used to say "Not played". The design system's `ListRow` guidance now leaves it empty, because a phrase there takes width from the title. At 320px every game name now fits on one line.

**Library status worked out from the game page's own state.** The fixed `GS_LIB_ME` seed is gone. `gsLibRow` (`app/gs-discover.jsx`) reads what the game's page reads:
- The four puzzle games: `lbNow`, which follows the demo bar's Today / This week switch and Config "Free account, today: Not played". If there's no play of this edition, the date is the game's last played day from `PZ[k].all`.
- Casebook and Delve: `lbNow` with the Pass. A free player follows `lbWeekDone`, the same as the first-edition card. Dates come from `cbHist` / `dvHist`.
- 36,000 Summers Ago: `HG_DAYS`, and the last day before the Pass ended once it has.
- "Last played" sorts by that date; games played today keep the library's game order.

Checked every daily and weekly game in free, Pass and Pass ended, with the switch on "in progress" and "day complete". Each row matched the game page. Also checked Config "Free account, today: Not played": Daily Word reads "Today's word is ready" in the Library, and its page offers Play.

## Open, for the owner

- **The date on a free first edition is the edition's date, not when it was played.** Casebook shows "1 Dec 2025" and Delve "16 Mar", because the seed has no play date for these. The game's own page shows the same dates.

## Found on other surfaces

- **History, "every edition" list: the result column jumped between day groups.** Each day is its own `RowList`; the group holding the "Latest" tag (`end`) had an extra column from 640px, so its results sat about 88px left of the others. Fixed in the design system on 11 October: from 640px, separate RowLists line up whether or not a list has an `end`. The latest bundle, `components.css` and `styles.css` are pulled. The build keeps one RowList per day, adds no padding or spacer, and sets `--mcp-row-end` nowhere (if one list ever sets it, every list that should line up must set the same value).
