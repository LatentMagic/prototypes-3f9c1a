# Handoff — kit update: the app posture and its system bars (2026-10-15)

## Path taken (section 0)
Circlists already had Config → Platform (Web / Mobile) and `isApp` (`app/main.jsx`), and the register's `platform` field (`app/states.jsx`, the `go` builder). Section 1 and section 5 skipped; the bars are wired to the existing `isApp`. The viewport meta already carried `viewport-fit=cover`.

## What changed, and where
- `circlists.html`: the kit's bar styles after `.circ-phone-screen` rules, keyed on `.circ-phone-clip[data-app]`. Bare `env()` reads in `.circ-config-modal` and `.ppp-sheet` moved to the variable form. The New pill's sticky offset adds `--circ-app-top-inset`.
- `app/main.jsx`: `KitPhoneBars` above `CircApp`; the clip gets `data-app` and the bars in the app posture.
- `app/app-shell.jsx`: the native top bar's height and top padding take the top inset, so its surface runs up under the status bar. The shell root publishes `--circ-app-top-inset` (unset in web, so web reads 0px). Bottom bar and `APP_FAB_BOTTOM` use the bottom variable.
- `app/shell.jsx` (Tabs), `app/feed-lens.jsx` (chip row), `app/spaces.jsx` (dormant body min-height): sticky offsets add `--circ-app-top-inset, 0px`.
- `app/wizard.jsx` (`WizardShell`), `app/auth.jsx` (`AuthPage`), `app/spaces.jsx` (`CalmPage`): frameless pages pad their header / wordmark by the top variable; wizard frame and auth footer by the bottom variable.
- Every sheet's bottom padding to the variable form; sheets capped at `calc(100% - Npx)` also subtract the top inset: `feed.jsx` AddReveal, `talk-add.jsx`, `gate.jsx`, `feed-lens.jsx`, `swell-reactions.jsx` (×2), `talk-reactions.jsx`.
- `CLAUDE.md`: the postures block, word for word, before the copy block. `ARCHITECTURE.md`: one bullet on the bars in the existing postures section.

## Audit (Platform: Mobile, phone frame). Light only: the product has no dark theme.
| Surface | Address | Before | Now |
|---|---|---|---|
| Circle top bar + tabs + lens row | `reading-loop` | top bar under status bar | held |
| Home top bar | `home-crowded` | under status bar | held |
| Sub-view top bar (Account, Settings) | `account-email-password` | under status bar | held |
| Bottom bar | `reading-loop` | bare env | held |
| Add FAB | `reading-loop` | bare env | held |
| Dormant body | `dormant-circle` | sized off bar only | held |
| Sign in / Sign up / Recovery (AuthPage) | `signin-new-device`, `signup-first-circle`, `forgot-password` | footer near home indicator | held |
| One-time code (back arrow) | `otc-error` | arrow under clock | held |
| Create a circle (WizardShell, ✕) | `create-and-fund` | ✕ under battery | held |
| Share intake (WizardShell, ✕) | `share-intake-picker` | ✕ under battery | held |
| Invalid invite / circle full / not-subscribed (CalmPage) | `invite-invalid`, `invite-circle-full` | wordmark under the island | held |
| Splash, loading, can't-connect | `app-splash`, `startup-cant-connect` | centred, clear | held |
| Bottom sheets (Add, Swell, Who reacted, View options, gate) | — | bare env; tall sheets could reach under the status bar | held (code; not each opened) |
| Centred dialogs | — | centred, clear | held |
| Provider checkout (`ProviderShell`, `#0f172a`) | `create-and-fund` with Mobile payments On | dark chrome, dark status icons | **open, see below** |

Out of scope, left alone: `docs/specs/**` playgrounds and the lm-652 rig modules (history / tooling strips), archive, changelog.

Viewport: Mobile with Platform: Web: no `data-app`, no bars, variables unset; `--circ-app-top-inset` unset, so every new term reads 0px.

## `--kit-status-fg`
Set to `#fff` on `.circ-phone-clip[data-app]:has(.circ-provider)` (`circlists.html`); `ProviderShell` (`app/subscriptions.jsx`) carries `circ-provider`. The provider page is the one dark full-screen surface (`#0f172a`), reached in the app with Mobile payments On. Owner ratified, 15 Oct. All other top chrome is light, so the default (`--color-fg-1`) stands.

Checked: Platform Web + Viewport Mobile shows the phone with no bars, no `data-app`, inset unset; the web top bar sits at the screen top as before.

## Unresolved / next
- `talk-reactions.jsx` `crBounds` reads `--top-bar-height` off the root; used only for the desktop popover, so unaffected. Revisit if the popover ever opens in the phone.
- Open each sheet in the app posture by hand to confirm the last row clears the home indicator.
