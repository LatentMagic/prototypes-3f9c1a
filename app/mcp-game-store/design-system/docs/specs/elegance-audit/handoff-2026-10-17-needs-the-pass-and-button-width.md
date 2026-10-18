# Handoff 2026-10-17: Needs the Pass, one button width, empty search results

## What was built, and where

- **NeedsPass** (`components/surfaces/NeedsPass.{jsx,d.ts,prompt.md}`, card `needs-pass.card.html`, demo page `needs-pass-demo.html` loaded by the card at 960px and 390px). Exports `needsPassCopy()` too: every line is built from props (game name, edition word, the player's record, achievements total); no prop takes free copy. Styles: `.mcp-npass*` in `components/components.css`. Guideline entry: `guidelines/layout-and-patterns.md` (Proven answers). Listed in `readme.md`.
- **One button width.** CSS in `components/components.css` after `.mcp-btn-pair`: a screen-width media query at 640px. Under it every `.mcp-btn` is full width and a non-popup `ButtonPair` stacks; from 640px a pair is `inline-grid` at the wider label's width. Rule text in `guidelines/visual-foundations.md` (Layout) and `layout-and-patterns.md` ("Use wide screens by arranging"). `Button.d.ts`, `Button.prompt.md` and `button.card.html` (two iframes of `button-widths.html`, at 390px and 660px) updated.
- **Empty filter or search.** `guidelines/ui-standard.md`, under "Designed empty states", with a worked example.

## Rulings from the owner this session (2026-10-17)

- Menu triggers and Popup actions are outside the button rule. Popup actions keep their old behaviour: they fill the dialog and stack only below 300px.
- 640px is screen width. A button in a narrow column on a wide screen keeps natural width.
- Chapter label: `YOUR LAST CHAPTER · 3`. Date format `17 SEP`.
- Cadence reopened and replaced by one line for every game with editions: "Play every {edition word} as it comes out." (The brief's daily/weekly/chapter lines are gone.)

## Open items, decided here

- **Clear-the-filter link: "Clear all".** The product's History already uses it, so players have seen it. It covers search and filters together, so one wording works on every list. It's short enough to sit on one line under "Nothing matches that." at 320px.
- **The ruled line:** 1px `--line`, the structure border. It's vertical when the halves sit side by side and horizontal when they stack.
- **How Button follows 640px:** CSS only, by screen width, so there's no prop and no JS. `block` still forces full width. A link in a button's row drops beneath because the row is a wrapping flex row and the full-width button takes the whole line. That's documented in `Button.prompt.md`.
- **Same size in both variants:** on wide screens the card has a 320px minimum and fills its grid area. The label and foot slots are always laid out, empty when a variant has nothing to say, so the phone stack keeps one height too. Only a long game name in the never-had heading can add a line.

## Set by the brief without the owner's ruling (built as written)

- Never-had right side: `WHAT YOU GET`, the cadence line, "Earn {total} achievements." The last line is dropped when the total is 0 (my call).
- A game with no editions: "Play the whole game." and `LAST PLAYED · {date}`. The foot's "played" clause is dropped for these games because there are no editions to count (my call).
- A foot clause whose count is 0 is dropped; if both are 0 there is no foot.
- The halves stack under 640px, the same width as the button rule.
- `Button block` is kept as the explicit full-width override.

## Not done or unresolved

- `guidelines/source/ui-design.md` ("A full-width button suits a phone…") is the upstream monorepo standard, quoted as source. I left it unedited. It doesn't contradict the 640px rule, but it still says "phone".
- The product prototype is untouched, as the brief says. Its History empty state ("Nothing matches that. Try a name, a number or a date." with a secondary Clear all button) and every hand-set `block` will differ from the system until the product picks the rules up.
- The plural edition word defaults to word + "s". An irregular word needs `words`.

## Next

- Ask the product agent to adopt NeedsPass on the library game page, the 640px button rule and the empty-filter line.
- Check the product's pairs on wide screens. Sign in / Sign up now take natural width instead of filling the card.
