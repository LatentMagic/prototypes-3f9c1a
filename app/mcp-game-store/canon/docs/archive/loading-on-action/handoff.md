# Handoff: every state-changing action shows it is working

Kit update, 2026-10-08. The rule is ratified upstream (kit). The two open items below are my choices and still need the user's ratification.

## What changed

- `CLAUDE.md`: the kit paragraph above `## Always`, and the rule block under Designing, after the overlay block. Nothing else changed.
- `app/gs-site.jsx`: `useGsBusy(ms)` returns `[busy, run, cancel]`. `run(fn)` holds the control busy for the staged wait, then applies `fn`, and ignores a second press while busy. `cancel()` drops the wait, and so does unmounting. `GsInkSpin` is the system's `.mcp-spin` in text colour, for controls that are not a `Button`.
- `app/gs-auth.jsx`: `useGsForm` stages every valid submit and returns `busy`. `{ instant: true }` opts out when the submit only opens a surface. The code checks (verify, recover) stage the server check. A short code still fails at once, because that check happens on the device.
- `index.html`: four rules for the ink spinner, the 20px icon slot, `cursor: progress`, and the system's `mcp-busy` pulse under reduced motion.
- `app/qa.jsx`: QA entry `loading-on-action`. Delete it once this is signed off.

## Choices (awaiting ratification)

1. **Indication: one treatment for every control.** Buttons use the design system's own `Button loading`: a spinner before the unchanged label, `aria-busy`, `cursor: progress`, and the system's opacity pulse under reduced motion. I kept each label as it was so no copy changed. Checkout already said "Processing…", so I left it. Two controls are not buttons, and they get the same spinner in text colour: Resend code (a text link) and Sign out (a menu item, where the spinner takes the icon's slot and the menu stays open until the result).
2. **Staged wait: 900ms.** That is `GS_LOADER.withhold + minHold` (300 + 600), the shortest wait the app's loader is already designed to show. It is long enough to see and short enough not to drag. Checkout keeps its existing 1400ms.

## Audit

Held already:
- Checkout, Pay and subscribe / Start free month: spinner and "Processing…". It could be submitted twice with Enter, so I added a guard.
- Returning from Google or Apple: a full-screen loader.
- Connect your AI, waiting for the connection: a loader with "Waiting for … to connect."
- The Copy buttons (Connect, Share): the copy happens on the device and the label swaps to "Copied" at once, so there is nothing to wait for.

Corrected (before this change, each one had no indication and could be pressed again):
- Sign up: Create account. Sign in: Sign in.
- Verify your email and Verify this device: Verify, and Resend code.
- Reset password: Send code, Verify, Update password.
- Your username: Continue. Account, Username: Update username.
- Confirm it's you: Continue, and Continue with Google or Apple. This also covers Delete account.
- Change email: Confirm. Change password: Update password.
- Pass card: Keep monthly or yearly, and Resume subscription.
- Switch sheet: Switch to …. Cancel sheet: Cancel subscription.
- Update card: Save card.
- Account menu: Sign out.

Not state-changing (they navigate or open a surface): Start free, Get the Pass, Play in your AI, Share, Delete your account and Delete account (both open the next step), Update email (opens Confirm it's you), Enter code, Try again (the region shows its own loader). The prototype aids are out of scope.

## Open

- **Closing a surface mid-wait cancels the action.** This applies to Cancel, Escape or the dim on Confirm it's you, the Switch and Cancel sheets, and the Change email code step. A real request already in flight might complete anyway. The other option is to keep the surface open until the result.
- **Google and Apple buttons.** On a press, the page leaves for the provider, and the return screen carries the wait. When a provider fails, the failure shows at once. A real provider sheet would sit in between.
- I did not drive the waits in a live browser. The verifier checks the load, and the QA entry lists every surface to press through.

## Next

Ratify or change the two choices and the cancel behaviour. Then press through QA `loading-on-action` at phone and desktop width, and delete the QA entry.
