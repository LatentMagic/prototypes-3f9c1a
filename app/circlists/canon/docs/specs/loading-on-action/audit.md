# Audit: every state-changing action (8 Oct 2026)

Rule (CLAUDE.md, Designing): from the press until the result, the pressed control shows a loading indication and cannot be pressed again.

Treatment used for every corrected control: `Button`'s existing `loading` state (spinner in place of the icon, label kept, button inert), driven by `useAct()` in `app/primitives.jsx` with a 600ms staged wait (`CIRC_ACT_MS`). Client-side validation still answers at once; only a press that passes it is staged. "Before" is what the build did before this ticket.

## Held already (left as they were)

| Control | Where | Before |
| --- | --- | --- |
| Get a link (invite) | `invite-link.jsx` | Button loading + box spinner, `INVITE_SIGN_MS` |
| Checkout: Pay / Start free month | `subscriptions.jsx` `Checkout` | spinner + "Processing…", disabled, 1400ms |
| Update payment card, Keep plan, Resume subscription (Account card) | `pricing-account.jsx` | `pppAct`, Button loading, 600ms |
| Switch plan confirm | `pricing-account.jsx` | `pppAct`, Button loading |
| Cancel subscription confirm | `pricing-account.jsx` | `pppAct`, Button loading |
| New pill (accept arrivals) | `liveliness.jsx`, `main.jsx` | brand spinner in the pill face, inert while busy |
| Rail refresh | `shell.jsx` `CircleSignal` | receipt spinner in the slot |

## Corrected (had no indication, could be pressed again)

| Control | Where |
| --- | --- |
| Sign in (email form) | `auth.jsx` `SignIn` |
| Create account | `auth.jsx` `SignUp` |
| Verify (one-time code; wrong/expired answer now arrives after the wait) | `auth.jsx` `OtcEntry` |
| Recovery: Send code, Verify, Update password | `auth.jsx` `Recovery` |
| Create a circle / Continue | `spaces.jsx` `CreateSpace` |
| Edit circle: Save | `spaces.jsx` `EditCircleDialog` |
| Remove member confirm | `spaces.jsx` `RemoveMemberDialog` |
| Change password: Update password | `spaces.jsx` `AccountSettings` |
| Confirm it's you: Continue / Continue with provider | `spaces.jsx` `ReverifyDialog` |
| Change email: Confirm (code) | `spaces.jsx` `ChangeEmail` |
| Add a link: Add (both sheets; refusal line arrives after the wait) | `feed.jsx` `AddSheet`, `talk-add.jsx` |
| Delete for me / Delete for everyone (the other reach goes inert) | `feed.jsx` `DeleteDialog` |
| Leave, Delete account, Cancel funding confirms | `feed.jsx` `ConfirmDialog` |
| Edit title: Save (and clear-to-restore) | `card-title.jsx` |
| Report: Report (replaces "No sending indicator") | `report-block.jsx` `RbReportDialog` |
| Block confirm | `report-block.jsx` `CircBlockDialog` |
| Thought: Add | `talk-card.jsx` `CandWriteFace` |
| Conversation Send arrow (new turn, reply, edit): arrow becomes spinner | `talk-parts.jsx` `CandWrite` |
| Take over this circle (free take-over), Resume subscription (asleep screen) | `pricing-circle.jsx` |
| Provider page: Save card (spinner, label kept) | `pricing-page.jsx` `PppCardPage` |

## Not corrected — open, pending a ruling

Instant by design today: the result lands on the press, which ui-design.md counts as its own acknowledgement. The rule's words reach them; staging a wait would change how the core loop feels.

- Mark as done → The Swell's Done and Skip (`swell-reactions.jsx`)
- Save toggle, Watching toggle, reactions (`feed.jsx`, `talk-reactions.jsx`, `swell-reactions.jsx`)
- Notifications switch (`push.jsx`)
- Menu commands that act directly: Unblock (`spaces.jsx`), Sign out (`shell.jsx`)
- Resend code (text link, `auth.jsx`)

## Not state changes (navigation or opening a surface)

Start free month / Subscribe on the plan page (opens checkout), Fund this circle, Update payment card from a circle (opens provider page), Update email (opens Confirm it's you), Delete your account (opens the confirm), Google/Apple (provider trip, then `AppLoading`), Enter code, Create a circle (home), share-intake circle rows, card-menu items that open dialogs, Copy controls (clipboard, receipt already shown), Try again on load failures (a fetch).

## Unreachable in this build

Canon Funding card (Update payment card / Resume funding / Cancel funding) in `spaces.jsx`: withdrawn by `CircPricing.hideFunding`. Preview gate's Sign up (`gate.jsx`): gate off by default, and it only closes.
