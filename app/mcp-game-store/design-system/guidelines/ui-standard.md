# Cross-app UI standard: what this system adopts

Source: [`specs/governance/standards/ui-design.md`](https://github.com/LatentMagic/monorepo/blob/main/specs/governance/standards/ui-design.md) (LatentMagic/monorepo, main, re-read 2026-10-08). Full copy: `guidelines/source/ui-design.md`. Circlists precedents: `guidelines/source/circlists-reuse.md`.

## Built into components
| Rule | Where |
|---|---|
| Responsive by default, adaptive by exception; hover becomes tap | Everything reflows; the one swap is listed below |
| Only a panel changes shape on a phone. Dialog: centred at every width, never scrolls. Menu: opens at its control at every width. Panel: bottom sheet on a phone, centred on desktop (our call) | `Popup` (kind `dialog` default, `panel`), `Menu`. Card: Patterns › Overlays |
| Surfaces that swap, and their widths (the standard asks each project to list them; this is the Game Store's list) | Panels (`Popup kind="panel"`): sheet under 640px, window at and above. Nothing else swaps |
| Focus restoration on close, to the opener or the logical next point | `Popup`, `Menu` return focus to the opener; `Popup` focuses its first control on open |
| Text-input font floor 16px | `TextField`, `SearchField` |
| Errors present in place | `TextField error` renders inline with glyph and `aria-describedby` |
| Deferred validation; refused submit moves focus to the first invalid field (form-level failure: the field carrying it, else the first field) | Pattern, shown in `ui_kits/shop` sign-in and the "Errors in place" card. Pass `inputRef` to focus |
| Descriptive action labels | Copy rules in readme; Button and Menu labels name the action |
| Destructive actions signal themselves; weight proportionate | `Button variant="danger"` (heavy), `TextLink danger` and `Menu` item `danger` (light) |
| Prefer a statement to a disabled control | `Button disabled` exists; prefer a sentence in the slot |
| Touch-target floor (value is the project's to set) | 48px controls and menu rows, 44px minimum |
| Pointer cursor | All interactive components |
| Clickable surfaces show hover, press and focus, and look clickable at rest | `Card href/onClick` and `ListRow href/onClick`: chevron at rest, lift on hover (mouse only), deeper fill on press, focus ring. Whole card or row is one target; nothing clickable inside |
| Visibility of status; instant result is its own acknowledgement | `Button done/doneLabel` label swap; no toast component |
| Non-flicker loading. A receipt for a gesture shows at once and holds once shown | `Button loading` (working state): spinner at once, held at least 400ms, no second press |

## Layout and content rules (apply when composing screens)
- Domain-aligned placement: a surface sits within the context that owns it; the persistent navigation carries only movement between contexts and identity.
- Design phone first, then check every shipped width on its own.
- Wide screens used, not stranded; fill by arranging, not stretching. Principles in `readme.md` › Page layout; `PageGrid` is one proven answer.
- The most important thing comes first at every width. A heading can shrink but stays the biggest in its area.
- No overhanging line on headings, labels, buttons, card copy.
- No mismatched shapes in a group; consistent widths; say it once.
- Reading directions: what sits under or beside a thing reads as belonging to it. No implied connection.
- When rules clash: change size, then spacing, then layout, then wording.
- Designed empty states: say why it is empty and offer the next step.
- Ration confirmation; undo beats confirm; protect unsaved work (absolute for costly input; a short inline rename may discard silently).
- Past ~10s of waiting, show progress and a way out.

## Not adopted (undecided for the Game Store)
- Circlists' other breakpoints (520px, 1024px).
- Skeletons for content-shaped loads: the standard leaves skeleton versus spinner to the project; the Game Store has only the spinner and the Loader so far.

## Differences found on 2026-10-08 (summary read 2026-10-06 against the live file)
1. **Overlays.** The summary said a desktop modal or anchored popover becomes a bottom sheet on a phone. The live file sorts overlays into dialog, menu and panel; only a panel swaps. Corrected; `Popup` now takes `kind`, and `Menu` was added.
2. **Swap list.** The live file asks each project to list the surfaces it swaps and their widths; a surface not listed reflows. Added (panels at 640px).
3. **Centred confirmations.** The summary listed Circlists' "dialogs stay centred at every width" as not adopted. It is now the standard. Moved to adopted; the delete confirm is a centred dialog at every width, superseding the hand-off's phone sheet.
4. **Non-flicker loading.** The summary said to withhold the spinner briefly. The live file says a receipt for a gesture drops the withhold and shows at once, keeping the hold-once-shown beat. Corrected; the button's working state is a receipt.
5. **Focus restoration.** The summary named the opener only, for pop-ups. The live file adds menus and "the logical next point" when the opener is gone. Corrected.
6. **Refused submit.** The form-level-failure case was missing. Added.
7. **Rules present in the file but missing from the summary** (not changed upstream, gaps in the summary): domain-aligned placement, most-important-first and reading directions, descriptive action labels, designed empty states, the protect-unsaved-work exemption, the ~10s ceiling, skeleton versus spinner as the project's call. Added.
