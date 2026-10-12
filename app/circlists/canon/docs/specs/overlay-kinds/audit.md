# Overlay audit — 2026-10-08

Rule: `CLAUDE.md` § overlays (dialog / menu / panel). Phone = below the surface's own swap width, or the app posture / phone frame. Only items 3–5 of the brief were changed.

## Dialogs — centred at every width
| Surface | File | Phone | Desktop | Matches |
| --- | --- | --- | --- | --- |
| Delete card | `app/feed.jsx` DeleteDialog | centred | centred | yes |
| Confirms: Leave, Delete account, Delete circle and the rest of `CONFIRM` | `app/feed.jsx` ConfirmDialog | centred | centred | yes |
| Remove member | `app/spaces.jsx` | centred | centred | yes |
| Edit circle (name + description) | `app/spaces.jsx` | centred | centred | yes, borderline — see 2 |
| Edit title | `app/card-title.jsx` | centred | centred | yes |
| Confirm it's you | `app/spaces.jsx` | centred | centred | yes |
| Report link / comment | `app/report-block.jsx` | centred | centred | yes |
| Block member | `app/report-block.jsx` | centred | centred | yes |
| Cancel subscription | `app/pricing-account.jsx` | centred | centred | yes (already done) |
| Switch plan | `app/pricing-account.jsx` | **was sheet, now centred** | centred | yes (changed) |
| Sign-up gate (preview) | `app/gate.jsx` | bottom sheet < 640 | centred | **no** — see 1 |

## Menus — at their control at every width
User menu (`app/shell.jsx`), card menu (`app/feed.jsx`), comment menu (`app/report-block.jsx`), thought menu (`app/talk-surface.jsx`), member-row menu (`app/spaces.jsx`). All anchored at both widths. Match.

## Panels — bottom sheet on a phone
| Surface | File | Phone | Desktop | Matches |
| --- | --- | --- | --- | --- |
| Add | `app/feed.jsx` AddReveal, `app/talk-add.jsx` | sheet < 640 | anchored above the Add button | yes |
| View options | `app/feed-lens.jsx` | sheet < 640 | anchored below View | yes (already built) |
| The Swell | `app/swell-reactions.jsx` SwellReactionFlow | sheet < 520 | centred | yes |
| How the circle landed (Swell door) | `app/swell-reactions.jsx` SwellReviewModal | sheet < 520 | centred | yes |
| Who reacted | `app/talk-reactions.jsx` | sheet < 520 | popover at the pill | yes |
| Circle rail (drawer) | `app/shell.jsx` | left drawer < 1024 | fixed rail, not an overlay | **no** — see 3 |

## Out of scope
- Push permission prompt (`app/push.jsx`): a stand-in for the OS's own dialog; the OS owns its shape.
- Config, QA, States (`app/config.jsx`, `qa.jsx`, `states-ui.jsx`): deletable review aids. Ratified 2026-10-08 as panels: bottom sheet below 640, centred above (`circlists.html`, `.circ-config-*`).

## Mismatches — reported, left as they are
1. **Sign-up gate is a dialog, shown as a sheet on a phone.** It says one thing and is dismissed. Would do: centred at every width (pass `false` for its sheet flag in `main.jsx`). Needs ratifying.
2. **Edit circle carries two fields**, one of them free text. Fits "one short edit" today. If the description field grows, or the pair outgrows the space above the keyboard at 320, the rule makes it a page or a panel. Would do: check at 320 with the keyboard up; no change unless it overflows.
3. **The circle rail is a side drawer below 1024**, not a bottom sheet. It is navigation, which `MOBILE.md` keeps out of sheets ("a sheet with navigation inside it is the anti-pattern"), and in the app posture it is not used (the bar replaces it). Would do: raise upstream whether navigation chrome is outside the three kinds, as tooltips are. No change here.
4. **Swap widths differ**: Add, View options and the gate at 640; The Swell, its door and Who reacted at 520. BIZ-136 (2026-09-14) ruled one shared boundary at 640. Would do: move the three 520 surfaces to `isSheetPosture`. Needs ratifying.
5. **Design system README** (`_ds/…/README.md`) says "Swell 1024"; the build swaps The Swell at 520. It does not state the old rule ("Confirm dialogs never become sheets" agrees with the new one). Mirrored folder, not edited here; log in the design system's `audit/`.
