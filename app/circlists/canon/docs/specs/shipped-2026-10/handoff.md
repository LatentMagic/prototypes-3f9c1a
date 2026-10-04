# Handoff: eight corrections (shipped 1 and 3 October)

## Built, and where
1. Ask and Account card wording: `app/push.jsx` (both places), `CHANGELOG.md` (the quoted note).
2. Card menu name: `app/feed.jsx` `menuLabel` is headline, then the full address. "this link" and the site-name step are gone.
3. Notification shape: `app/push-preview.jsx`. Both kinds draw as title "Circlists" with body "New links in {circle}" or "New replies in {circle}", on the lock screen and the Android shade.
4. Failed title save: `app/card-title.jsx` (`onSave` / `onRestore` returning `false` is a refusal), wired in `app/main.jsx`. Shows an inline line and announces through the app's polite live region (`announceOnce`). Dialog and draft stay.
5. Refused reaction: `app/talk-reactions.jsx`. A polite status line sits under the React control, full row. The write is skipped, so the comment keeps its reaction.
6. Home preview row: `app/home-returns.jsx`. Name is "{title} — {circle}. Reactions to you." when the row carries reactions.
7. Dialog buttons: class `circ-dlg-act` in `circlists.html`. Stacked, column-reverse (primary on top), full width at max-width 519px and anywhere inside `.circ-phone-screen`. Desktop is the existing right-aligned row.
8. Search: `app/feed-search.jsx` also indexes `item.title` (the page's own title). The headline is the member's title when set, so both match; a cleared or replaced title is no longer a field.

## Dialogs changed for item 7
Edit title (`card-title.jsx`), Add link (`feed.jsx`), Confirm dialog used by mark/delete-me style confirms (`feed.jsx`), Remove member, Edit circle, Re-verify password, Confirm code (`spaces.jsx`), Add with a thought (`talk-add.jsx`), Sign-up gate (`gate.jsx`).
Already stacked, left alone: the delete-reach dialog (`feed.jsx`), pricing overlays.
Not dialogs, left alone: Account card rows (`circ-acct-act`), Config/QA aid rows.

## Staged states (QA palette, group "Refusals")
- `title-save-fails`: Backend Pod, Active. Menu, Edit title, change text, Save. First save is refused; the second succeeds.
- `comment-reaction-refused`: the Go pipelines conversation. React, pick a glyph. First pick is refused.
- Existing: `push-device-preview` (item 3), `push-ask`, `push-setting-on` (item 1), `home-crowded` (item 6).
- Item 2: open the menu of a card whose fetch failed with no title; its name is the address.
- Item 7: narrow the window below 520px or use the phone frame, then open any dialog above.

## Decisions
- Item 3: the app's shape stands. The prototype's Safari reasoning had no evidence in the repo and the app already ships title plus body for both kinds. Nothing for the app to correct.
- Refusals are one-shot flags (`window.circFail`, `window.circFailNext` in `states.jsx`), so a retry succeeds. Droppable: without `states.jsx` nothing fails.
- Phone width for item 7 is the 519px media query plus the phone frame, not the 1024px mobile posture, so a 700px tablet keeps the row.

## Not done / open
- The request for a QA update about "the resizing button" is unresolved: no control with that name exists in the build. Asked the owner which change is meant.
- Nothing verified in a real screen reader.

## Next
Confirm the resizing-button item, then check each stacked dialog at 390px.
