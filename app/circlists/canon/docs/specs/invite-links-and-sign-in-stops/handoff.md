# Handoff: invites by link, Apple with no account, sign-in and report failures

**Reverted 5 Oct (owner): the invite part (items 1 and 2, `invite-link-card`).** The card is back to the address-bound one (`app/invite-link.jsx` restored whole), the dead-link body is back to "It may have expired or been revoked.", and `invite-invalid` is labelled "Accept invite — invalid" again. Everything else below stands.

Status: built into `app/`, 5 Oct. Every choice here is **built, not ratified** unless marked as ruled by the owner (R1, R2, R3, R6, R7). Publishing canon is how the owner ratifies it.

## What was built, and where
1. **Invite card** (`app/invite-link.jsx`, `InviteCard` published as `window.InviteForm`): no Email field, no address check, no `INVITE_EMAIL_RE`, and the token is no longer derived from the address. The link box sits where the field was, with the act beside it (stacked in a narrow card). Each press makes a new random link in the same box. "Valid for 7 days". The refusal ("Couldn’t make a link. Try again.") is unchanged and still staged through `CIRC_INVITE_MINT_FAIL`. `MembersSurface` still passes `onInvite`; the card never called it.
2. **Dead-link page** (`app/spaces.jsx`, `InvalidInvite`): title unchanged; body is now "An invite link works once and lasts 7 days. Ask whoever invited you for a new one."
3. **Apple with no account, Sign in only** (`app/auth.jsx`, `SignIn`): the stop replaces the three buttons in the same `AuthPage` frame. It shows "We couldn’t find an account for this Apple sign-in." with **Create a new account** (primary, lg, full) and **Sign in another way** (secondary, lg, full). The switch line in the footer is hidden while the stop shows. No account is made. `SignUp` is unchanged.
4. **Provider failure line** (`app/auth.jsx`, `AuthFailLine` and `authProviderTrip`, used by both `SignIn` and `SignUp` step 1): "Couldn’t continue with Google. Try again." (or Apple). One line under the three buttons, using the one-time-code page's pattern. It clears on the next press of any of the three buttons. A cancel shows nothing.
5. **Report failure** (`app/report-block.jsx`, `RbReportDialog` and `CircRBHost`): `onReport` returns false when the report didn't go. The dialog stays open with its reason and note, shows "Couldn’t send the report. Try again." above the actions, and keeps Report and Cancel live. `markReported` now runs only on success. The link and comment paths share this dialog.
6. **Config** (`app/config.jsx`, `ConfigSignInRows` under Review settings): **Apple account** (Found / None) and **Provider sheet** (Completes / Cancelled). Both are held on `window.circAuthReview`, not localStorage. The register's reset restores Found / Completes.

## Staged addresses (`?state=`)
- `invite-link-card`: the new card, on TEST Backend (new).
- `invite-link-refused`: the refusal, unchanged.
- `invite-invalid`: the dead-link page. Its label now reads "a spent, expired or broken link"; the id is unchanged.
- `signin-apple-no-account`: Sign in with Apple account set to None; tap Continue with Apple (new).
- `signin-provider-fails`, `signup-provider-fails`: the next Google or Apple press fails (Refusals group, `circFail.provider`) (new).
- `report-fails`: the next report fails (Refusals group, `circFail.report`), Backend Pod (new).
- Cancel at the provider: Config → Provider sheet → Cancelled. Nothing shows, so there is no register entry; the Refusals note says how to walk it.
- QA entry `invite-links-and-sign-in-stops` (first in `app/qa.jsx`); the existing entries are untouched.

## Yours to decide: what I chose (built, not ratified)
- **Card copy.** Title "Invite a member" (kept). Helper "Get a link and send it to them yourself. They join free." Closing line "Each link works once, for the first person who opens it, and takes them straight into {circle}." "Works once" goes in the closing line so the helper stays one act and one fact.
- **Several links.** One box, replaced on each press, with the arrival wash each time. Stacked boxes would read as a list the card keeps, and it keeps none.
- **Button after a link.** Stays pressable, demoted to secondary, and reads "Get another link". The old reason for disabling it (a second press stranding an address-bound invitation) is gone, and the label says what the next press does.
- **Card focus.** No autofocus on mount now that there is no field. Focus moves to each new link box, as before.
- **Dead-link body.** It states the rule, which is true of a spent link and an expired one alike and names nobody. It also gives the way forward, matching the circle-full page's "Ask whoever invited you…". Spent and expired read the same; I see no reason to split them.
- **Apple stop form.** It replaces the buttons rather than sitting above them, which keeps the page shorter than it opens (443px against 479px). The line is 15px, weight 500, ink, centred. Focus moves to the line (`role="status"`, `tabIndex=-1`). Sign in another way restores the three buttons and puts focus back on Continue with Apple.
- **Create a new account.** It takes the footer's existing route to Sign up step 1. Nothing is carried over from the Apple login, and the person can press Continue with Apple there. The held destination is what canon already keeps: a held share link survives the trip to Sign up, then canon's post-signup step drops it (LM-771, "a new account has no circles"). Canon models no invite arrival, so there was no invite destination to carry. I left that rule alone.
- **Provider failure line.** It names the provider, so the person knows which button failed, and echoes the button's own "Continue with". It uses the one-time-code pattern (ink text, red x, `role="alert"`) and not the card-title pattern, because red text is reserved for destructive actions (CLAUDE.md). It sits under the buttons so nothing above moves, and focus stays on the pressed button.
- **Report failure line.** "Couldn’t send the report. Try again.", same pattern, between the reasons and the actions. There is no sending indicator, because the wait is under the flicker threshold.
- **"We" in the Apple line.** The design system's content rules say no "we". The owner gave this wording, so it is built exactly, apart from the app's curly apostrophe.

## Built, not ratified (from the spec or the draft)
- R4, the provider failure line, and R5, the report failure line.
- The three Apple strings: "We couldn’t find an account for this Apple sign-in.", "Create a new account", "Sign in another way".

## Spec lines this ticket changes
- `hld.md` line 81 (invitations responsibility): "create an invitation for an address…" and "tell a wrong account the invitation was addressed to someone else".
- `glossary.md` line 175 (acceptance): the accept endpoint "requires one of the caller's provider-verified addresses to match the invited address".
- `requirements/CIRC-009` line 12 (the "distinct notice for an account the invitation was not addressed to"), EF-03 (lines 58–61), the notes on address matching (lines 71–72), and the address-hint routing note (line 75).
- `requirements/CIRC-031`: invitation created for an address, and its expiry (now 7 days, single use).
- `ui.md`: Invite member (the Email field, the address-bound link, 30 days), the Mismatch notice, and Decision-53. `ui.md` is over the search size cap, so I could not quote lines from it; these are the sections the brief names.
- `requirements/CIRC-003` EF-01 and EF-02 are extended (R4): the line now appears on the three-button step, and Apple behaves as Google does.

## One phone screen
I measured inside canon's phone frame (Config → Viewport → Mobile). In this preview pane the frame's screen was **380 × 470** CSS px, because the pane is short. The heights below are each page's own content height at 380 wide, so they do not depend on the frame's height:
- Sign in as it opens: **479px**. Sign in with the failure line: **513px**. Sign in with the Apple stop: **443px**.
- Sign up as it opens: **479px**. Sign up with the failure line: **513px**.
- For a sense of fit: an iPhone SE in Safari has about 548px of visible height, so all five fit. The opening pages are unchanged by this build, and the failure line adds 34px. In the short 470px preview frame, even canon's opening page scrolls by 9px, and that was already true before this build.

## Not built / unresolved
- The arriving person's path: canon has no screen for opening a valid link (the register opens the circle). "Already in the circle, open a link to it, go into the circle" (CIRC-009 AF-02) matches what canon draws, but the prototype cannot click through it.
- Links already sent under the old rule: out of scope, nothing drawn.
- No revoke, resend or list of links. The card holds together without them, because the closing line carries the rule.

## Found in the brief
- The brief writes the Apple line with a straight apostrophe. I used the app's curly one, as the champion-leave work did.
- The brief's "Goes" list covers everything address-bound in `InviteCard`, including the helper's "Enter their email address" and the closing line; both are gone. Nothing else in `app/` ties an invite to an address. The only other hit, the `NoSpaceHome` comment in `spaces.jsx`, already says the app mails nothing.

## CHANGELOG entry (written 5 Oct; the owner approved the entry's text, and nothing else)
- **An invite is a link, not an address.** Get a link makes any number of single-use links, each valid for 7 days; no address is typed or checked.
- Sign in with Apple stops in place when no account exists; Google and Apple failures, and a report that fails to send, each show one line in place.

## Next
The owner views the QA entry in place and rules on the card's copy, the dead-link body, the Apple stop's form and the two failure lines. Then the CHANGELOG entry, and spec changes for the lines above.
