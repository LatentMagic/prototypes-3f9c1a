# 16px text-input floor — what landed

Standard: monorepo `specs/governance/standards/ui-design.md` — any control the user
types into renders at 16px or larger.

| # | Control | File | Was | Now |
| --- | --- | --- | --- | --- |
| 1 | Card write + edit face | `app/talk-card.jsx` (two `CandWrite size=`) | 12.5 | 16 |
| 2 | Add-a-link thought box | `app/talk-add.jsx` (`CAND_THOUGHT_PX`) | 15.5 | 16 |
| 3 | Add-a-link URL slot | `app/talk-add.jsx` `CandLinkSlot` | 14 mono | 16 mono |
| 4 | Conversation composer | `app/talk-parts.jsx` `CandWrite` default `size` | 15 | 16 |
| 5 | Turn edit + reply | `app/talk-surface.jsx` (two `CandWrite size=`) | 14.5 | 16 |

Read surfaces untouched: `CandProse` stays at 12.5 (card) and 14.5 (turn), band
words at 12.5, all labels and titles as they were.

## Row counts, not pixel heights

- `CandWrite` already derives `minHeight` from `minLines * size * 1.6`, so the row
  count is size-independent. Composer and card faces open at the same lines they did;
  only the pixel height follows.
- The add sheet's thought box baked 15.5 into `Math.round(15.5 * 1.65 * 6)`. Replaced
  with `CAND_THOUGHT_PX`, so six rows is now derived rather than coincidental.
- **The card's write face.** Its band height is measured at runtime
  (`useCandHeight` in `CandCardRow`, then animated between measured from/to values),
  so the fixed band follows the field rather than constraining it. Nothing was tuned
  by hand: keeping `minLines={2}` keeps two rows, and the band grows ~11px when the
  face opens for writing and settles back on commit.
- URL slot row: `minHeight: 46` untouched, and 16px mono still fits inside it.

## Not touched, deliberately

- `CandWrite`'s `maxPx = 220` cap: at 16px a fully grown field shows ~8 lines rather
  than ~11. It is a maximum, not an opening height, and the delta named neither.
  Flag for ratification if the shorter ceiling reads wrong.
- States aid search (`app/states-ui.jsx`, 13.5px) — a deletable dev aid, not a member
  control. Out of the delta's scope.
- `docs/specs/lm-652-discourse/cand-*` carry forked copies of these components at the
  old sizes. That candidate is merged into `app/`; its entry is left as the record.
