# Overlays

Three kinds (`ui-design.md` § Responsive and adaptive design). Ask in order; the first that fits is the kind. Only a panel changes shape on a phone.

1. **Dialog**: one question or one short edit, with nothing behind it usable until it is answered or dismissed. Centred at every width; its content is fixed and never scrolls. A dialog that outgrows the space above the keyboard becomes a page or a panel.
2. **Menu**: a short list of commands at its control; choosing one runs it and closes the menu. Opens at its control at every width. A list long enough to scroll is a panel.
3. **Panel**: anything else the user stays in and works with. A bottom sheet below its breakpoint; anchored or centred above it.

Tooltips and status lines take no focus, are none of these, and do not swap.

Components: `Dialog`, `Menu` (+ `MenuItem`, `MenuSeparator`), `Panel`, or `Overlay kind="dialog"|"menu"|"panel"`.
