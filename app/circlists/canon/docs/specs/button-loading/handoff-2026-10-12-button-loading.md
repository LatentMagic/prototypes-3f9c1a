# Handoff: a busy button shows its own ring (12 Oct)

Prompt: "a busy button shows its own ring: the prototype's half", pasted in chat 12 Oct. Rule: ui.md Decision-13 and Decision-53, ratified.

## Changed
- **`Spinner` → `Ring`** in `app/primitives.jsx` (definition, header comment, `window` export, Button's `loading`). Callers: `app/subscriptions.jsx` (provider Pay), `app/talk-parts.jsx` (Send), `app/pricing-page.jsx` (provider Pay). What it draws is unchanged. `BrandSpinner` (`app/brand-motion.jsx`) keeps its name.
- **Get a link** (`app/invite-link.jsx`): the button now only disables (`disabled={ready || working}`, no `loading`), and `submit` ignores Enter while working. The link box draws `BrandSpinner` at 18px in place of the ring. 18 is the small size already used by the liveliness signal and fits the box's icon slot.
- **`CLAUDE.md`**: one bullet under "Every wait shows it is working" naming both indicators, which goes where, and the Get a link departure.
- **Per-person-pricing handoff** (`docs/specs/per-person-pricing-as-shipped/handoff.md`): the spinner-in-button item is struck through and closed with a pointer to the rule. It is removed from Next.

## Design-system README
The copy at `_ds/…019dca0f…/README.md` is a mirror of the design system project, so I refreshed it from that project and did not edit it in place. The line that landed: "Loading has two indicators, each with its own job (ui.md Decision-13, Decision-53). The **brand spinner**, at three sizes, is the standalone one … The **in-button ring** is a small plain ring before a button's label … The brand spinner never sits inside a button; the ring is what a button shows." Its Components line now reads "**Button** (+ **Ring**, the in-button ring; `Spinner` is a deprecated alias)".

## Docs checked and left alone
- `GOTCHA.md`, `ARCHITECTURE.md`, `MOBILE.md`: say nothing about which indicator goes where.
- History left as it was: `CHANGELOG.md`, `docs/archive/`, older handoffs including `docs/specs/loading-on-action/handoff.md` (it still lists the conflict as open; history).
- `skills/frontend-ui-engineering/references/accessibility-checklist.md` has a generic `<Spinner />` in vendored example code. It is not our component, so I left it.
- `app/primitives.jsx` `AppLoading` comment ("exactly two loading states") is about full-screen loading, not indicators. It is correct.

## Unresolved
- The bundled `_ds_bundle.js` was not refreshed. The app does not load it.
- Not checked in a screen reader: `BrandSpinner` carries `role="img"` "Loading" inside the link box, alongside the card's polite status line.

## Next
Check Get a link at phone width with the box spinner, and decide whether the vendored checklist example should be renamed too.
