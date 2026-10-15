# Handoff — system bars delta: the strip's colour (2026-10-15)

App posture only (Config → Platform: Mobile). Builds on the kit carry: `docs/specs/app-posture-kit/handoff-2026-10-15-app-posture.md`.

## Already held by the kit carry (left as is)
- **Home, in a circle, Account, circle settings:** `TopBarNative` (`app/app-shell.jsx`) is sticky at `top: 0`, its height and top padding take the top inset, and its background is `--color-surface`. Bar and strip are one band with no seam, and scrolled content passes under the bar, never through the strip.
- **Splash and sign-in:** neither has a top bar. The status bar is transparent over the screen, so the strip is already the screen's own `--color-canvas`. Same for the other frameless pages (one-time code, recovery, Create a circle, share intake, CalmPage).

## Built here
- **Pushed pages leave the strip still.** In `AppShellNative`'s push branch (`app/app-shell.jsx`), a still band of `--color-surface`, the height of the top inset, sits above both sliding layers for the length of the transition. The incoming page's own bar slides beneath it, so the strip neither moves nor shows the layer's edge shadow. Settled views are unchanged: the band exists only while `anim` is set, like the layers.

## `--kit-status-fg`
Left at its default (`--color-fg-1`, `#0A0A0A`) on every Circlists screen: the top bar is `--color-surface` and the frameless screens are `--color-canvas`, both light. The one override is the kit carry's `#fff` on the payment provider page (`.circ-phone-clip[data-app]:has(.circ-provider)`), which is dark. The owner ratified it on 15 Oct.

## Set by the brief, not ruled by the owner
- Where a screen has no top bar (splash, sign-in), the strip takes that screen's own background. Built as written.

## Not built / unresolved
- **No dark theme exists** (`tokens.css` only anticipates one). The icons follow `--kit-status-fg`, so a dark theme only needs to set it where its top chrome is dark. The dark-theme leg of #943 cannot be shown until then.
- `app/push-preview.jsx` draws its own 9:41 row. It renders in place of the phone frame (the device preview), never inside it, so the kit's bars and it never show together. No change.
- A mid-push frame could not be captured in the preview, because the 200ms animation finishes before capture. The still band is checked by reading the code, and the settled frames before and after the push were checked by screenshot.

## Checked (screenshots, Platform: Mobile)
`home-crowded`, `reading-loop` (scrolled), circle settings via the gear, `signin-new-device`, `app-splash`. Platform: Web + Viewport: Mobile: no bars (checked in the kit carry; this delta adds nothing to web).

## Next
- Capture a slowed push (temporarily lengthen `PUSH_MS`) to show the still strip mid-transition.
