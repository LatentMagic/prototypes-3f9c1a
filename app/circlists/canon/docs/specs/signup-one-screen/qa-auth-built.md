# QA: the auth frame built into the app (02.2)

Open each state by URL on `circlists.html`. Posture: Config → Platform / Viewport. Check every state at 320, 375, 390 and desktop.

## States

1. `?state=signup-first-circle` — Sign up
   - Step 1: mark in the heading's line, subtitle, Google / Apple / Continue with email at 52px, consent and switch line at the screen's foot.
   - Continue with email → step 2: back arrow, no subtitle, no switch line, First name focused, "Password · At least 8 characters" in the label.
   - Fits one screen on arrival (SE Safari 548 is the tight one, est. ~9px spare).
   - Create account empty → inline errors.
   - Back arrow → step 1, focus on Continue with email.
2. `?state=signin-new-device` — Sign in
   - Same checks; step 2 has Forgot password? above Sign in.
   - Switch line: Create an account → sign-up step 1.
3. `?state=forgot-password` — Recovery: email → Check your email → code → new password, all in the new frame, back arrow on each but the last.
4. `?state=otc-error` — OTC: expired error line, Resend code, back arrow.
5. `?state=share-intake-signed-out` — share lead sits above the heading inside the column.

## Every screen

- Consent line wraps balanced, no lone "Policy."
- Desktop: 360 column, no card. Phone: 400 column.
- Inputs 16px; pointer cursor on every control.

## Known, not defects

- Browser Back at step 2 leaves the page (open decision).
- Switching sign-up ↔ sign-in resets to step 1.
- Apple mark is a stand-in.
