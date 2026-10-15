# Circlists design choices the Game Store can adopt

Read 2026-10-06 from `main` of both repos (pulled, up to date). Status labels: deployed = monorepo `main`; specced = in a stable spec; prototype = `../prototypes/app/circlists/canon/` only.

**Finding that shapes everything:** `specs/governance/standards/ui-design.md` is short and states principles, not components. It never names a modal, a bottom sheet, a button style, a toast or an icon swap beyond "adaptive by exception". The component choices live in the Circlists product spec (`specs/projects/circlists/ui.md`, specced, Circlists-only) and in code.

| # | Decision | Where | Status | In ui-design.md? | Look-neutral? |
|---|---|---|---|---|---|
| 1 | Desktop modal or anchored popover becomes a bottom sheet on a phone; hover becomes tap | ui-design.md "Responsive and adaptive design" | specced | Yes: "a desktop modal, or a popover anchored to a control, becomes a bottom sheet on a phone; hover becomes tap" | Yes |
| 2 | Breakpoint for that swap is per surface, not global (640 / 520 / 1024 px) | `specs/projects/circlists/ui.md` line ~137-146; `libs/circlists/frontend/feed/.../add-link-surface.component.css` (40rem) | deployed + specced | No: the standard gives no number | Yes (numbers only) |
| 3 | Confirmation dialogs stay one centred dialog at every width, never a sheet | Circlists ui.md line ~146 | specced | No | Yes |
| 4 | Focus returns to the opener on close; sheet/popover rests above the keyboard | ui-design.md "Focus restoration"; Circlists ui.md line ~116 | specced | Focus: yes. Keyboard: no | Yes |
| 5 | Icon changes form on a completed action: Share becomes a check for 1600 ms; Save is outline bookmark then filled | `libs/circlists/frontend/feed/src/lib/ui/card-menu/card-menu.component.html` (`shareState() === 'copied' ? 'lucideCheck' : 'lucideShare'`); prototype `app/card-share.jsx`, `app/primitives.jsx` | deployed (share, in the card menu); prototype (standing share icon, bell outline/filled) | No | Yes |
| 6 | No toasts or success banners; the changed state is the acknowledgement; failures surface calmly in place | Circlists ui.md lines ~120-122, 365 | specced | Partly: "Visibility of system status... instant result is its own acknowledgement"; "Errors present in place". The no-toast rule itself is not there | Yes |
| 7 | Inline errors, shown only after first submit, then live; focus moves to first invalid field | ui-design.md "Deferred validation", "Errors present in place", "A refused submit moves focus"; code `focus-first-invalid`, `form-field` | deployed + specced | Yes, all three | Yes |
| 8 | Text inputs at 16px or larger | ui-design.md "Text-input font floor" | specced | Yes | Yes |
| 9 | Button label names the action; destructive looks different before the press; confirm only the serious; undo beats confirm | ui-design.md "Affordances", "Reversibility" | specced | Yes | Mostly (destructive signal needs a colour or weight) |
| 10 | Prefer a plain statement to a disabled control | ui-design.md | specced | Yes | Yes |
| 11 | Designed empty states; non-flicker loading; spinner vs skeleton is the project's call | ui-design.md "System feedback and time"; code `spinner`, `empty-state` | deployed + specced | Yes | Yes |
| 12 | Button variants: primary, secondary, ghost, link, destructive, destructive-outline; sizes to `xl`; loading state; `rounded-none` "square" option exists | `libs/circlists/frontend/shared/ui/src/lib/button/button.variants.ts` | deployed | No | Behaviour yes, colours no |
| 13 | Dialog, popover, dropdown menu, switch, input, form field, card, badge, avatar, top bar, flow shell, step dots, empty state | `libs/circlists/frontend/shared/ui/src/index.ts` | deployed | No | Components yes, theme tokens no |
| 14 | Sign-in: email and password form, then divider, then Google button | `libs/circlists/frontend/auth/src/lib/ui/sign-in-layout/*.html` | deployed | No | Layout yes |
| 15 | Newer sign-in/up: two steps. Step 1: Continue with Google, Continue with Apple, Continue with email. Step 2: email form alone | prototype `app/auth.jsx` (comment: "signup-one-screen, ratified 5 Oct") | prototype | No | Layout yes; Apple button is black fill by Apple's rule |
| 16 | Touch target floor, pointer cursor, no overhanging line, reading order | ui-design.md | specced | Yes | Yes |
| 17 | Dark theme exists: near-white `--primary` on near-black ground | `apps/circlists-web/src/tailwind-theme.css` `.dark` block | deployed | No | Tokens, theme-tied |

Not found anywhere as shared code: toasts (Circlists has none by rule), accordion/disclosure, tabs, tags/chips as a shared component (`filter-chip` is feed-local), skeleton loader, bottom-sheet component (the Add surface does it with Tailwind `sm:` utilities, not a shared component).

## (a) Sign-in and sign-up

- **Deployed** (`libs/circlists/frontend/auth/.../sign-in-layout`): email, password, "Forgot password?", then a full-width default (primary) "Sign in" button, a divider, then the Google button, then a consent line and "New here? Create an account". Sign-up mirrors it ("Create account"). No Apple.
- **Prototype only** (`app/auth.jsx`): page 1 is three full-width large buttons: Google (secondary), Apple (black fill, per Apple's rules), Continue with email (secondary). No primary on page 1. Page 2 is the email form with the primary "Sign in" / "Create account". Recovery uses primary "Send code", "Verify", "Update password".
- **Shared code?** Partly. The sign-in logic is `libs/shared/frontend/auth` (Clerk-based store, guard, validators, sign-in/up/reset view stores), tagged `scope:shared` and project-agnostic: free. The screens and parts (`sign-in-layout`, `circ-google-button`, `form-field`, `auth-divider`, consent line) live in `libs/circlists/...`, so they are Circlists's, not shared. Sheriff (`sheriff.config.ts` line 214) lets other projects import only `scope:shared` libs; `libs/circlists/frontend/shared/ui` carries `scope:shared` by pattern, but I did not verify that a new project can import it in practice. Copy-or-promote is a decision for the owner.

## (b) Modal, sheet, popover

Rule (Circlists ui.md, specced; standard only gives the principle): anchored things are popovers on wide screens and bottom sheets on narrow ones. Per surface: Add reveal 640px (below: sheet; at and above: popover); Who-reacted 520px; Swell and circle switcher 1024px (sheet then centred modal). Confirmation dialogs never become sheets. Prototype matches: `isSheetPosture` = under 640 (`app/main.jsx:124`); `app/pricing-sheet.jsx` is sheet under 640, centred modal above. Navigation destinations are full pages sliding in, never sheets (`MOBILE.md` "Containers", prototype).

## (c) Icon changes on action

Deployed: card menu Share item shows a share icon, becomes a check with "Link copied" for 1600 ms, announced politely (`card-menu.component.html:30`, spec line ~2706). Prototype: `app/card-share.jsx` does the same on a standing icon button, and says it is "the app's own grammar for a completed gesture"; bookmark and bell swap outline to filled. Native share sheet is used where the device has one, with no check shown.

## (d) What the Game Store leanings would break

Nothing in ui-design.md names corners, ground, button colour or accent count, so none of the four breaks a stated rule. Tensions:
- Square corners: Circlists has a `rounded-none` button size option; radius is a token. Free.
- White-on-dark main button on a dark ground: this is exactly Circlists's own `.dark` theme (`--primary` near-white). Free.
- One small accent: "Destructive actions signal themselves" needs a distinct treatment; with one accent colour, destructive must use weight, a label or a second red. Decide this.
- "Prefer a statement to a disabled control" and the 44px touch floor constrain button states and sizing under any theme.

## Gaps

- Circlists ui.md is the product spec, not cross-app; whether the Game Store inherits its Patterns (no toasts, the 640 breakpoint) is not decided anywhere.
- Did not verify the Sheriff import path for another project, or that `monorepo-games` follows it.
- Did not read the design-prototypes governance doc or the Circlists tokens in `canon/tokens.css`.
- No shared tabs, accordion or tags component found; did not search the prototype for them.
