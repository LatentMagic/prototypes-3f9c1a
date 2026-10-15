# Handoff: three kinds of overlay, and a button that shows it is working

Date: 2026-10-08. Standard re-read from `LatentMagic/monorepo@main`, `specs/governance/standards/ui-design.md`.

## What changed, and where
- **Overlay guidance.** `readme.md` › Adaptive patterns now states the three kinds and names the component for each. The old "pop-up = window on desktop, bottom sheet on phones" is gone from the readme, `Popup` docs, the surfaces card, the shop kit README and `guidelines/source/rules.md` (hand-off line marked superseded).
- **Popup** (`components/surfaces/Popup.*`). New `kind` input: `dialog` (default) or `panel`. Only a panel swaps to a sheet. New `busy` input stops Escape and the dim closing it while the main action works. Children now sit in a `.mcp-pop-body` wrapper, which scrolls for panels.
- **Menu** (`components/surfaces/Menu.*`, new). Opens at its control at every width.
- **Button working state** (`components/actions/Button.*`). `loading` is the working state; `onClick` returning a promise drives it automatically.
- **CSS** (`components/components.css`). Panel sizing and scroll, menu styles, busy-press suppression, spinner colour on the delete button.
- **Cards.** `guidelines/cards/pattern-overlays.html` replaces `pattern-adaptive-popup.html`: each kind at phone and desktop width. Actions card shows the working state on all three variants plus a clickable one. Surfaces card shows the dialog (working delete) and a menu.
- **Shop kit.** Delete confirm is a centred dialog at every width with a working delete; Add to Claude and Sign in/Sign up show their working state.
- **Standard summary.** `guidelines/ui-standard.md` rewritten; the seven differences are listed at its foot. `guidelines/source/ui-design.md` replaced with the live file.

## Overlay inventory
| Overlay | Kind | Phone | Desktop |
|---|---|---|---|
| `Popup` (default), e.g. delete save, disconnect | Dialog | Centred window, 380px max (screen minus 32px) | Centred window, 380px |
| `Popup kind="panel"` | Panel | Bottom sheet, full width, max 85% high, body scrolls | Centred window, 480px, max 640px high, body scrolls |
| `Menu` | Menu | Below its control (or above with `placement`), 220–320px | Same |
| `StatusMessage` | None (takes no focus) | Inline | Inline |
| `Disclosure` | None (inline, not an overlay) | Inline | Inline |

## What already held
- The button already had a `loading` state with a spinner that blocked clicks; it was shown in the preview. It now also blocks Enter and form submits (previously only the click handler was dropped), keeps focus, and holds 400ms.
- Focus return, Escape and dim-to-close on `Popup`.
- Every non-overlay rule in the summary matched the live file; only the overlay section had moved upstream.

## Choices on the open items
- **How each kind is drawn.** All three reuse the existing pop-up surface: #322E2A fill, 1px control-edge border, card shadow, square corners. Dialog and panel keep the 55% dim; the menu has none, since it is a lightweight list at a control. Menu rows are 48px, 16px text, red text for a destructive command (the system's light destructive signal), pressed fill 16% text like the secondary button. No hover colour, per the readme.
- **Panel on desktop: centred, not anchored.** The Game Store has no anchored popovers and the hand-off draws a centred window, so a panel reuses that shape, wider (480px) for working content.
- **Panel swap width: 640px.** The hand-off's existing pop-up breakpoint; `breakpoint` still allows a per-surface value.
- **Working state.** Spinner beside the label (the hand-off's), label may change ("Deleting"), colour unchanged, not `disabled`, so it reads as progress rather than unavailable and focus is kept. It shows at once because the standard treats an indicator acknowledging a press as a receipt, and holds at least 400ms. Under reduced motion the label pulses instead (the hand-off's rule).
- **Popup `kind` defaults to `dialog`.** Existing confirms become correct without edits; only panels opt in to swapping.

## Not done or unresolved
- No panel is in use in the shop yet; the "Earlier editions" picker in the overlays card is illustrative.
- The menu does not flip itself near screen edges; `align` and `placement` are set by hand.
- The live file's `ui-design-gallery/*.webp` are still LFS pointers and were not viewed.
- The standard asks for a project `ui.md` listing swapped surfaces. The Game Store has none; the list lives in `guidelines/ui-standard.md` and the readme.

## What a prototype needs to change
1. Any confirmation shown as a bottom sheet on a phone: use `Popup` with no `kind`. It is now centred at every width.
2. Anything the user works inside (a picker, a growing list): `Popup kind="panel"`.
3. Any hand-built dropdown of commands: replace with `Menu`.
4. Every button that changes state: pass `loading` from the press until the result, or return a promise from `onClick`. Don't use `disabled` for the wait. In a dialog, pass `busy` too.
5. Custom CSS that targeted `.mcp-pop>p` should target `.mcp-pop-body>p`.
