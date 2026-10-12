# Handoff: per-person pricing, as shipped (8 Oct)

Brought canon in line with the deployed app on ten points. Prompt: the "what per-person pricing shipped differently" delta, pasted in chat 8 Oct. Items 1–7 are ratified deployed behaviour. For 8–10 I chose the presentation; the copy is marked where it is mine.

## Built, and where
1. **Plan choice.** Native `<input type="radio">` per plan inside `<fieldset>` + a visually hidden `<legend>Plan</legend>`. The card is the input's `<label>`. `app/pricing-page.jsx` (`PppPlanCard`, `PricingScreen`), CSS `.ppp-fieldset`, `.ppp-radio-native`, `.ppp-sr` in `circlists.html`. The custom `.ppp-radio` dot is no longer used. Its CSS is still in the file.
2. **Heading** "Create a circle": `app/pricing-main.jsx` `createTitle`. Size not changed (still `WizardTitle`'s); see Open.
3. **Submit enabled on an empty name**: `app/spaces.jsx` `CreateSpace`. The `disabled` is gone, and a refused submit now moves focus to the name field (ui-design.md).
4. **No setting-up wait**: `pricing-main.jsx` `onCreate` builds the circle and enters it. The `setting-up` route and `SettingUp` remain only for canon's old fund path, which the build no longer reaches (`hideFunding`).
5. **Cancel at phone width is a centred modal**: `PppOverlay` gains `modal` (`app/pricing-sheet.jsx`). Modal buttons now carry `.circ-dlg-act`, so they stack full width under 520px and in the phone frame, the same as Delete account. Switch keeps its sheet.
6. **Cancel while failed**: the cell reads "From today". Confirming cancels at once: status none, every circle you champion sleeps. `pricing-account.jsx` `PppCancelSheet`.
7. **Delete account, six bodies**: `pricing-circle.jsx` `pppDeleteBody`. `PPP_CONFIRM['delete-account']` is now a getter. Lapsed means status none with the free month used. No subscription means never subscribed.
8. **Failure lines**: `PppFailLine` + `PPP_FAIL` in `pricing-store.jsx`. These use the house failure-line treatment (red x, ink text, role=alert, RbFailLine's), "Try again." is part of the sentence; only the load failure has a Try again control (an inline link). On the card the line sits under the buttons. In a sheet it sits under the panel, above the buttons.
9. **Busy / loading**: `pppAct` (600ms flight) puts the pressed button into `Button`'s `loading` state, the same as Get a link. Sheets stay open while busy. The card shows its title, then a 32px brand spinner body (min-height 120px).
10. **Take-over**: a free take-over announces "You champion this circle now." through the app's polite live region (`api.announce`, added to `Pricing.bind` in `main.jsx` with `api.confirm`). On failure, the alert shows under the asleep screen's buttons. When the end date is unknown, the Ending caption reads "Resume your subscription, then take this circle over."

## Staged states (QA palette → Per-person pricing (candidate))
`ppp-cancel-failed-payment`, `ppp-delete-active`, `ppp-delete-free-month`, `ppp-delete-ending`, `ppp-delete-failed`, `ppp-delete-lapsed`, `ppp-delete-none`, `ppp-card-loading`, `ppp-load-fails`, `ppp-cancel-fails`, `ppp-switch-fails`, `ppp-resume-fails`, `ppp-keep-fails`, `ppp-card-page-fails`, `ppp-cancel-busy`, `ppp-switch-busy`, `ppp-resume-busy`, `ppp-keep-busy`, `ppp-takeover-fails`, `ppp-takeover-ending-no-date`. Free take-over announcement: the existing `ppp-takeover-subscribed`.
Failures are one-shot (`window.circFail`), so the next press succeeds. Busy states need the button pressed.

## Config (Per-person pricing): new, session-only, never persisted
Card load: Loads / Stays loading. Card actions: Complete / Stay busy. End date: Known / Unknown.

## Choices on 8–10, and why
- Failure copy for all seven lines is the deployed wording (confirmed by the owner, 8 Oct).
- Busy uses `Button loading` (spinner in the button). The design-system guide says the spinner never sits in a button, but Get a link already does this, and the prompt calls for a busy confirm. ~~Flagged as a conflict to log upstream.~~ Closed 12 Oct, no conflict: the busy button draws the in-button ring, which the corrected rule asks for (ui.md Decision-13; `docs/specs/button-loading/`).
- Resume, Keep and Update payment card have no sheet, so their own card button shows busy.

## Open
- Item 2 says the prototype used "a smaller size". No size override existed, so the heading size was left alone.
- Ending with no known end date: only the take-over caption changes. The card's "Ends on" row and the Delete body still show a date.
- The app posture's take-over captions are unchanged.
- Nothing has been checked in a real screen reader.

## Next
Decide whether to delete the unused `.ppp-radio` CSS. Check Cancel at 320px.
