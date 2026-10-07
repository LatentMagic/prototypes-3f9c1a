# Handoff: circlists-match-1 (sign-in, menu, Account page)

Built 2026-10-07 from Part 1 of the Circlists-match prompt. Circlists' app project was readable, but this build was made from the prompt text; no Circlists files were copied.

## What was built, and where
- `app/gs-auth.jsx`: sign-in and sign-up first screens (Google, black Apple, email; no panel; arrow back in a header row; brand mark beside the H1), email forms, one code screen with two contexts (`ctx: 'signup' | 'device'`), password recovery in four steps, and the provider stops. Step 2 adds a history entry, so the browser's Back does what the arrow does.
- `app/gs-parts.jsx`: user menu (`GsUserMenu`): a trigger with avatar, name, email and chevron; a panel with an identity header, Manage account, Your AI, a divider and Sign out.
- `app/gs-account.jsx`: Account page, change email, change password, delete account, provider variant, support line.
- `app/gs-site.jsx`: extra glyphs (mail, logout, card, x, arrow) and the Google and Apple marks.
- `app/main.jsx`: `user`, `provider` and history-backed routing. Every `go()` is a history entry, so Back works across the whole app.

## Staged states (`?state=<id>`)
`sign-in-new-device`, `code-expired`, `code-wrong`, `account-email`, `account-provider`, `delete-account-confirm`, `change-email-code`. Plus the existing `provider-sign-in-fails` and `apple-no-account`.
Config rows: Signed in with (Email / Google / Apple), Provider sheet (Completes / Cancelled), Google and Apple sign-in (Works / Fails), Apple account (Found / None). QA entry: `circlists-match-1`.

## Yours to decide: ratified by the owner, 2026-10-07 (all five)
- **Menu trigger:** on wide screens, the top bar's right end, where "Account" used to be. On narrow screens the existing "Menu" button stays and opens the sheet: Games and History, then the same identity header and items. A name and email trigger doesn't fit a 320px bar.
- **Account back arrow:** goes back to the screen it was opened from (`route.from`), or to Games if there isn't one.
- **Top bar on sign-in screens:** removed. The brand mark sits beside the H1, at 28px, and isn't a link. "learn more" is the way home.
- **Black Apple button:** `#000` fill, white mark and label, and the system's 1.5px control-edge border so its edge shows on the near-black page. Same height as Google.
- **Icons:** the system has no mail, logout or card glyph. I drew them in its line style (1.75 stroke, square caps, mitred joins) in `GS_GLYPHS`. Ratified as additions to the system. Files are in `icons-for-design-system/`. Manage account uses the system's `settings` glyph. Your AI has no icon, just a spacer so the labels line up.

## Open or unresolved
- The system has no monospace font. The code field uses a system monospace stack (`--gs-mono`). The support line is muted, small and underlined, but not monospace ("if the system has one").
- The Popup component renders its title as an h3, so the modals render their own h2 instead.
- The delete alert adapts (a sheet on a phone, a window on desktop). The prompt asks for "Confirm it's you" as a centred window at every width, so that one doesn't adapt.
- Code screens clear their error on edit rather than re-checking live: a code can't be judged until it's submitted.

## Next
Copy the three icons into the design system project, then clear the QA entry.
