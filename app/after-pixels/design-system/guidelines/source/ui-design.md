# UI Design

Cross-app UI design conventions — the surface-level design law that holds across every product, whichever one renders it.

## Information architecture

**Domain-aligned placement.** Every surface belongs to one bounded context, and its place in the navigation hierarchy reflects that ownership — a surface appears within the context that owns it, never relocated under another. The persistent navigation frame owns no context; it carries only what no single context owns: movement between contexts, and identity. Ownership is not composition — a surface may host or link another context's capability without taking ownership of it. This is the rendered-placement counterpart to grouping a project's Surface inventory by bounded context. For the order of things within one screen, see **Reading order** under [Layout across widths](#layout-across-widths).

## Layout across widths

Design every width you ship. Start with the phone, then widen. One design adapts to every width (see [Responsive and adaptive design](#responsive-and-adaptive-design)), but each width still has to be checked on its own. A layout is done only when each width the project ships, at least a phone and a desktop, has been checked on its own against the three principles below. This section governs Responsive and adaptive design, **No overhanging line**, **Pointer cursor**, **Touch-target floor** and [Taste, pictured](#taste-pictured).

**Space.** Use the whole screen, evenly. Leave no empty space without a reason, and line up things that sit together so they share edges and widths.

- **Wide screens are used, not stranded.** At the widest shipped width, content never sits in a phone-width column with empty space on both sides, unless that space has a reason. Keep body text at a readable line length by changing the layout, not by stretching or narrowing the page.
- **Copy is part of the layout.** Longer text makes things taller, so check it at every width, not only the one it was written for. It fails if it crowds any width, gets cut off, breaks mid-phrase, or leaves a word or two alone on the last line (see **No overhanging line**).
- **Touch and mouse need different spacing.** On touch screens, targets meet the minimum size (see **Touch-target floor**) and nothing needs hover. With a mouse, show hover and cursor feedback (see **Pointer cursor**); controls can sit closer together. Desktop is not the phone layout with bigger margins, and the phone is not desktop shrunk.

**Reading order.** Read top to bottom, the screen tells a story: each part answers the question the part before it raises.

- **The most important thing comes first at every width.** Putting things side by side on desktop must not push it down.
- **A heading can shrink, but stays the biggest.** A page heading may get smaller on a narrow screen, within sizes the design system sets, but it stays the largest and boldest thing in its area. **Scaling never breaks the information architecture**: importance, grouping and reading order stay the same at every width.

**Reading directions.** People read both down and across a screen, so a layout has to work read either way. Anything placed under or beside a thing looks like it belongs to it, so never put things together that don't belong together.

**When two rules clash, make the smallest change first.** If fixing one rule breaks another (**Consistent width** shows an example), try these in order: change the size, within the design system's sizes; change the spacing, within the design system's spacing; change the layout (width, stacking); and only then reword, if the copy can change. Rewording comes last: it changes what the screen says.

## Responsive and adaptive design

The system is responsive by default and adaptive by exception.

**Responsive by default.** A surface adapts across viewports through reflow — layout collapses, restacks, resizes — while its information architecture, affordances, and interaction model stay constant. One design responds to the viewport; a parallel mobile redesign forces the user to learn the product twice and inhibits implementation throughput.

**Adaptive by exception.** Where a viewport's platform convention demands a different interaction _pattern_ — not just different dimensions — substitute the platform-idiomatic component; hover becomes tap. This is _adaptive_ design (component substitution), distinct from responsive reflow. Intent, information, and place in the IA stay identical; only the realised pattern changes. Each project's `ui.md` lists the surfaces it swaps and the width at which each swaps; a surface not listed reflows.

**Only a panel changes shape on a phone.** A surface that opens over the page and takes focus is one of three kinds, sorted by its job. Ask in this order; the first that fits is the kind.

- **Dialog.** Asks one question or takes one short edit, and nothing behind it can be used until it is answered or dismissed: a confirmation, a proof of identity, a rename. Its content is fixed and never scrolls. Centred at every width. A dialog that outgrows the space above the on-screen keyboard becomes a page or a panel, never a taller dialog.
- **Menu.** A short list of commands opened from a control; choosing one runs it and closes the menu. It opens at its control at every width. A list long enough to scroll is a panel.
- **Panel.** Anything else the user stays in and works with: a composer, a picker, a list that can grow or scroll. A bottom sheet on a phone. On desktop it is anchored to its control or centred, the project's call.

What appears over the page without taking focus, such as a tooltip or a status message, is none of these and does not swap.

**No overhanging line.** At mobile or desktop width, a short text block — a heading, a label, a line of button or card copy — never closes on a last line carrying only a word or two past the rest; it sits on one line, or wraps into lines of comparable length. It does not reach long-form body copy, where a short last line is normal. Fix it in the order given in **When two rules clash, make the smallest change first**; a deliberate line break counts as a layout change.

## Affordances and labels

**Consistent affordances.** An affordance that recurs across surfaces looks and behaves identically wherever it appears.

**Pointer cursor.** An interactive element shows the pointer cursor on hover; static content does not. The cursor is part of the affordance — it signals "clickable" before the click.

**Descriptive action labels.** A control names its action — "Delete photo", "Save changes" — never a generic "OK" or "Submit". The label is the command: it states what the system will do.

**Destructive actions signal themselves.** A control that removes, cancels, or irreversibly changes something looks different from a neutral one before it is pressed — the signal lives in the control's own treatment, not only in the confirmation that follows. Weight is proportionate to consequence, so the heaviest treatment does not drift into house style.

**Prefer a statement to a disabled control.** Where an action is unavailable, prefer rendering a plain statement in the control's slot over rendering the control disabled: a disabled control advertises a capability the user cannot reach and leaves them to work out why, where a statement says what the situation is and, where there is one, what they can do instead. This is a preference rather than a prohibition — the disabled state is the case that argues for itself, never the default reach.

## System feedback and time

**Visibility of system status.** Every user action gets visible acknowledgement within a reasonable time; the system never goes silent. Feedback is proportionate — an instant result is its own acknowledgement and needs no added indicator.

**Response time and non-flicker loading.** Honour the perception limits: ~0.1s reads as instant, ~1s holds the user's flow, ~10s is the attention ceiling — past it, show progress and a way out. Never flash a loader for a sub-threshold wait; withhold it briefly, and once shown hold it long enough to clear a flicker. An indicator that acknowledges a gesture rather than reporting a wait — a receipt — drops the withhold and shows at once; the hold-once-shown clause still applies, as the receipt's minimum beat. Skeleton for a content-shaped load versus spinner for an action wait is the project's call.

**Designed empty states.** A surface with no data is never a blank container: it states why it is empty and offers the next step.

## Reversibility and user control

These three share one instinct — never punish or destroy work in progress.

**Ration confirmation.** Confirm only before a serious, hard-to-reverse action; never before a routine or reversible one, where it breeds the habituation that makes every confirmation ignored. A confirmation names the specific consequence, never "Are you sure?".

**Undo as the emergency exit.** Prefer reversibility — offer undo, cancel, or back so a user recovers from a mistake without ceremony. Where undo is cheap, it replaces confirmation rather than adding to it.

**Protect unsaved work.** Never silently destroy in-progress input the user would be pained to recreate — this rule is **absolute** for anything costly to reproduce (forms, long-form or multi-field work): warn before discarding on navigation or close, or autosave; which of the two is the project's call. It does not reach a trivially-reproducible single field — a short value with an explicit Save and instant re-editability, such as an inline rename — where silent discard is fine, there being no real work to lose.

## Input and forms

**Text-input font floor.** Any control the user types into renders its text at 16px or larger. Under that, iOS Safari zooms the viewport in when the field takes focus and does not zoom back out, leaving the user pinching to recover the layout they were working in. Suppressing that zoom through the viewport meta tag is not the remedy — it disables pinch-zoom for everyone, including the users who rely on it; the floor is. A control rendering its text larger than the text it commits is normal and expected — the floor clears where typing happens, while the committed text stays compact in the layout that holds it.

**Deferred validation.** Inline field validation waits for the first submit attempt; after that, validate live as the user corrects. Validating on blur flashes an error the moment a user tabs through a field they have not finished.

**Errors present in place.** A validation error appears inline, next to the field it describes — never a global banner. The user sees what is wrong where they fix it.

Together these set _when_ and _where_ a validation error surfaces. The schemas it runs against are [`validation.md`](validation.md); the component contract that realises it is [`error-handling.md`](error-handling.md).

## Focus and reach

Both conventions carry an accessibility-conformance floor that lives in a project's accessibility requirements; the cross-app interaction intent lives here.

**Focus restoration.** When a modal, menu, or overlay closes, focus returns to the element that opened it — or, if that element is gone, to the logical next point. Focus dumped to the page root is the keyboard-level version of losing your place.

**A refused submit moves focus.** When inline validation refuses a submit, focus moves to the first invalid field, in document order, once its error is showing — so a screen reader hears the field, its invalid state and its error together, and a keyboard user is placed where the fix is rather than left on the button below it. Errors that appear beside fields but leave focus on the submit control are silent to anyone not looking at them. A form whose only failure is form-level moves focus to the field that carries that error, else the first field.

**Touch-target floor.** Interactive targets meet a minimum hit size, so mobile and desktop stay equal citizens. That a floor exists is the default; the exact value is platform-governed — Apple 44pt, Material 48dp, WCAG 24px — and the project's to set.

## Taste, pictured

The rules above say what must hold. This gallery shows the taste behind them, which rules can't capture: pictures of how the product owner wants screens to look, each shown as a bad example and a good one, or a bad one alone. An entry that illustrates a rule links to it. Open every picture in an entry before designing or judging a screen. The gallery is not a design system. Copy the idea, never the layout, components or styling; those come from the design system.

### Space

**No mismatched shapes.** Things that sit together line up and match, anywhere on the screen, at any width. One thing may look different on purpose, when it is the main action, but never by accident. **Consistent affordances** covers matching across screens; this covers matching within one group.

- Bad: [`mismatched-shapes-bad.webp`](ui-design-gallery/mismatched-shapes-bad.webp). Three actions in one group differ in width, icon and style for no reason.
- Good: [`mismatched-shapes-good.webp`](ui-design-gallery/mismatched-shapes-good.webp). One width and shape; only Cancel's red text differs, on purpose (see **Destructive actions signal themselves**). Ignore the wrapped text.

**No stranded width.** A layout that works on mobile can still be wrong on desktop (see **Wide screens are used, not stranded**). Never put a wide row over a narrow column, like an upside-down triangle.

- Good on mobile: [`stranded-width-good-mobile.webp`](ui-design-gallery/stranded-width-good-mobile.webp). One column fills the phone.
- Bad on desktop: [`stranded-width-bad-desktop.webp`](ui-design-gallery/stranded-width-bad-desktop.webp). A wide row over a narrow column.
- Good on desktop: [`stranded-width-good-desktop.webp`](ui-design-gallery/stranded-width-good-desktop.webp). Two columns fill the width.

**Consistent width.** Wherever possible, things share one width, headings most of all. A heading may wrap onto two lines to avoid leaving a word or two alone on the last line, but a heading much narrower than the content below it looks poor. This is not absolute. To fix it, shrink the heading (see **A heading can shrink, but stays the biggest**) or follow the order in **When two rules clash, make the smallest change first**.

- Bad: [`consistent-width-bad.webp`](ui-design-gallery/consistent-width-bad.webp). The heading wraps far narrower than the content below.
- Good: [`consistent-width-good.webp`](ui-design-gallery/consistent-width-good.webp). At two phone widths the heading shrinks to fit on one line, as wide as the content; order and grouping stay the same. Sized here with CSS `clamp()` and `calc()`.

**Say it once.** If the heading, text and button all repeat the same word, combine them so the word appears once. Turning the word into a link in the sentence is one way to do it, not the only way. See **Copy is part of the layout**.

- Bad: [`say-it-once-bad.webp`](ui-design-gallery/say-it-once-bad.webp). "Subscription", "Subscribe to run your own" and a Subscribe button: one word, three times.
- Good: [`say-it-once-good.webp`](ui-design-gallery/say-it-once-good.webp). The button is gone; "Subscribe" in the sentence is the link.

**Fill by arranging, not stretching.** Fill wide space by arranging things, not by stretching one of them. A full-width button suits a phone because the phone is narrow; on desktop it wastes the space. Matching widths (**No mismatched shapes**) never means stretching things to the edges.

- Good on mobile: [`fill-by-arranging-good-mobile.webp`](ui-design-gallery/fill-by-arranging-good-mobile.webp). The full-width button fits the narrow card.
- Bad on desktop: [`fill-by-arranging-bad-desktop.webp`](ui-design-gallery/fill-by-arranging-bad-desktop.webp). The same button stretches across the whole card.
- Good on desktop: [`fill-by-arranging-good-desktop.webp`](ui-design-gallery/fill-by-arranging-good-desktop.webp). The button keeps its natural size, right-aligned below the text, as the product's other cards do.

### Reading directions

**No implied connection.** Features that every plan has never sit under just one plan's card. See **Reading directions**.

- Bad: [`implied-connection-bad.webp`](ui-design-gallery/implied-connection-bad.webp). Each ticked feature sits under one card, so it looks like only that plan has it.
- Good: [`stranded-width-good-desktop.webp`](ui-design-gallery/stranded-width-good-desktop.webp). One list beside the plans covers all of them. Ignore the columns; they illustrate **No stranded width**.
