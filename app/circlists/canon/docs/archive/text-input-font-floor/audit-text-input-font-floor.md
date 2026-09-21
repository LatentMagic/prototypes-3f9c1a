# Audit — text-input font floor (16px)

Standard: monorepo `specs/governance/standards/ui-design.md` line 49 — *"Any control
the user types into renders its text at 16px or larger."* Under 16px, iOS Safari zooms
the viewport in on focus and does not zoom back out. Suppressing it via the viewport
meta tag is not the remedy.

Scope: every typable control in `app/` (main build). Report only — nothing changed.
Date: 2026-08-28.

## Fails

| # | Where | File | Size | Notes |
| --- | --- | --- | --- | --- |
| 1 | Add a link — the URL field on the add sheet | `app/talk-add.jsx:40-42` | **14px** mono | The one you flagged. Highest traffic typable control in the app. |
| 2 | Add a link — the thought textarea | `app/talk-add.jsx:94-98` | **15.5px** | `minHeight` is derived from the size, so a fix moves the box height too. |
| 3 | `CandWrite` default (conversation composer, "Add to the conversation") | `app/talk-parts.jsx:155` (`size = 15`), used at `app/talk-surface.jsx:325` | **15px** | Default value of the shared component — every unspecified caller inherits it. |
| 4 | Conversation: edit a turn; reply to a turn | `app/talk-surface.jsx:195, 314` | **14.5px** | Explicit `size={14.5}` overrides. |
| 5 | Card: edit your thought; write a thought (the write face) | `app/talk-card.jsx:248, 308-309` | **12.5px** | Worst offenders. `12.5` is also matched by the read-only `CandProse` beside it, so the two sizes are coupled by intent. |
| 6 | States aid — "Search states" (config modal + index bar) | `app/states-ui.jsx:117, 156` via `.circ-states-search` in `circlists.html:375` | **13.5px** | A deletable aid, not product surface. Still typable on a phone. |

## Passes

- `Field` primitive — `app/primitives.jsx:155`, 16px, `minHeight: 44`. Everything built
  on it clears the floor: auth (sign in, sign up, code, recovery, new password),
  account (password change, email change, re-verify), invite by email, add-link in
  `app/feed.jsx:328`. Callers that override size go **up** (20px, 22px code fields), never down.
- Rename circle — `app/spaces.jsx:159`, 16px.
- Payment provider fields (card, expiry, CVC, email) — `app/subscriptions.jsx:123`, 16px.
- `states-ui.jsx:52` copy-by-hand field is `readOnly` but focusable and selectable —
  iOS does not zoom read-only fields, so it is out of scope.

## Out of scope

- `app/tweaks-panel.jsx` (`twk-field`, number, range) — the tweaks host aid, not product.
- `docs/specs/**` and `docs/archive/**` copies — the same fails exist in the candidate
  and playground entries because they load the same modules or were forked from them.
  Fixing `app/` fixes the live candidates that overlay it; archived entries stay as-is.
- The homepage demo inherits `app/` modules, so it carries fails 1–5 unchanged.

## What a fix would disturb

Not a find-and-replace. Three of the six sizes are load-bearing for layout or for
pairing with adjacent read-only prose:

- `talk-add.jsx` textarea derives `minHeight` from `15.5 * 1.65 * 6`.
- `CandWrite` derives `minHeight` from `minLines * size * 1.6`, and its 12.5px uses in
  `talk-card.jsx` sit directly against `CandProse` at the same 12.5 — raising only the
  input makes the edit state jump in size against the read state.
- The card write face was tuned at 12.5px against the card's fixed band height.

So the decision is not "set 16" but "what the card and conversation type scale becomes",
which is a visual-intent change and needs ratifying.
