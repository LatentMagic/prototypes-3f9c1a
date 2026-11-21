# How this system meets the cross-app UI standard

This design system follows the monorepo's UI standard, [`specs/governance/standards/ui-design.md`](https://github.com/LatentMagic/monorepo/blob/main/specs/governance/standards/ui-design.md) (LatentMagic/monorepo, main). The standard holds every rule about how a screen behaves; read it there before you design, build or judge a screen. This design system holds only the values, components and patterns that are After Pixels' own. Where the two disagree, the standard wins.

This file names, for each rule the standard leaves to the project, the component or value that meets it.

## Built into components

| Standard's rule | Where, and this product's value |
|---|---|
| Responsive and adaptive design: surfaces that swap, and their widths | Panels (`Popup kind="panel"`) swap: a sheet under 640px, a window at and above. Nothing else swaps |
| Dialog, menu and panel | `Popup` (kind `dialog` default, `panel`), `Menu`. A panel is centred on desktop (the project's call). Card: Patterns › Overlays |
| Focus restoration | `Popup` and `Menu` return focus to the opener. `Popup` focuses its first control on open |
| Text-input font floor | `TextField`, `SearchField` |
| Errors present in place | `TextField error` renders inline with a glyph and `aria-describedby` |
| Deferred validation; a refused submit moves focus | Shown in `ui_kits/shop` sign-in and the "Errors in place" card. Pass `inputRef` to focus |
| Descriptive action labels | The shop's copy rules are in the monorepo's `specs/projects/mcp-games/ui.md` (see `guidelines/voice.md`) |
| Destructive actions signal themselves | `Button variant="danger"` (heavy), `TextLink danger` and `Menu` item `danger` (light) |
| Prefer a statement to a disabled control | `Button disabled` exists |
| Text-size floor | Sizes are in `guidelines/visual-foundations.md` and `guidelines/page-patterns.md`; the smallest is the 12px figure caption, plus fine print in legal text |
| Touch-target floor | 48px controls and menu rows, 44px minimum |
| Pointer cursor | All interactive components |
| Consistent affordances | `Card href/onClick` and `ListRow href/onClick`: chevron at rest, lift on hover (mouse only), deeper fill on press, focus ring. The whole card or row is one target; nothing clickable inside |
| Visibility of system status | `Button done/doneLabel` swaps the label; there is no toast component |
| Non-flicker loading | `Button loading` (working state): the spinner shows at once and holds at least 400ms, with no second press |

## Patterns

- **A filter or search that finds nothing** shows the bare text "Nothing matches that." and one `TextLink`, **Clear all**, that clears the search and every filter. No box, no button, no heading. The wording is the same wherever a filter or search can come up empty.

  ```jsx
  <p>Nothing matches that.</p>
  <TextLink onClick={clearAll}>Clear all</TextLink>
  ```

## Left to the project, and what this product has

- Circlists' other breakpoints (520px, 1024px) are not adopted.
- Loads that take the shape of their content have no skeleton yet. The Game Store has the spinner and the Loader.
