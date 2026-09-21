# A3 — invite link

The champion copies a link and sends it themselves. Carried as a **candidate build**:
`circlists-a3.html` is the app, plus the `cand-a3-*` overlays. Nothing in it is ratified.

- `handoff-2026-08-28_invite-link-candidate.md` — where the work stands, the calls that were
  ours, what was opened in `app/`, and what merging would take.
- `playground/circlists-a3-transition.html` — **the swap**: four treatments of the moment the
  ask becomes a link (Grows / One frame / Settles / No moment), each the app, switched from the
  strip at the foot of the page. It opens on the card: the rig wraps `circResolveState` so the
  landing does not depend on the URL carrying `?state=`.

## Corrections landed in `app/invite-link.jsx` (2026-09-12)

- **Get a link is disabled while a matching link is on screen** (`disabled={ready}`), not merely
  demoted to secondary. Each press in the shipped app mints a fresh, non-withdrawable 30-day
  invitation (CIRC-031, UI Decision-53), so a repeat press strands a live invitation. Editing the
  address frees it — the same signal that empties the box. Demotion styling stays.
- **A fourth box state: refused.** "Couldn't make a link. Try again." inside the same fixed-height
  box (44px, unchanged), Get a link back at primary weight. Distinct from the field-level validation
  errors, which stay on the hint line. Announced on the card's live region.
- **Staging the refusal:** the new state `?state=invite-link-refused` (Invitations group) lands on
  `sp-test-backend` — `sp-backend` seeds at 11 members, over the cap, where the invite card is
  suppressed. The arming flag is `window.CIRC_INVITE_MINT_FAIL`, **not** app state: app state is
  persisted, so a flag on the circle would leave a normal circle refusing the first press forever.
  Re-staging re-arms it; the card clears it on the press. Press → refusal, press again → link.

Token record for the same delta's switch fix: `docs/specs/switch-off-track-contrast/README.md`
(`--color-border-3: #949490`, 3.04:1 on `#FFFFFF`).
