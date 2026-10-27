# Escape's session page, v4: the goal (owner, 2026-10-27)

The first v4 build (`playground/v4.html`, `pg-es4.jsx`, `handoff-2026-10-27-escape-session-v4.md`) is rejected. v4 restarts from v3's Design 1 and fixes the owner's v3 review. Nothing else changes.

## Standing rule for this ticket

Nothing is an invariant unless the owner ratified it in words. A thing an earlier build invented stays open. It is never treated as fixed just because it shipped in a playground.

## What v4 is

1. **Keep v3's Design 1:** its look, the clickable doors and its mobile layout.
2. **Par:** move it in from the edge so "Par 30 min" sits centred on its tick.
3. **The lock detail (the second row):** on desktop, make good use of the empty space on the right. The left side works and stays. The fix is a real desktop arrangement of the lock detail that fills its width. Do not add a free-floating sentence or story line to fill the space; the first v4 build did that and it failed.
4. **The result at the top:** three designs of how success is shown. Each says you escaped, shows when you got out (for example 28 min, 2 min to spare, or both) and shows par. "X min under par" is one option, never a rule. Success is never carried by green alone.
5. **How the escape is shown:** three designs. The original line ended in a door like the others, with "Out" under it. A later build invented a special exit icon and copied it beside "Escaped". The owner found the idea interesting, but that symbol is bad and was never ratified. Options include a new symbol, plain doors with "Out", no symbol at all, or another way of showing it. Whatever is chosen applies both at the end of the line and at the top.
6. **Hover:** three hover effects on the doors and numbers. They must be visible at a glance, and the control that switches them must be in view on the owner's screen.
7. **Spec fixes (Escape spec, `escape-spec-2026-10-27.md`):** a typed lock answers only right or wrong; a near miss is the room's reply and is still wrong. A mechanism answers with a count ("3 of 5"). Exactly par counts as under. Nothing in play is timed.

## Build checks

- The playground bar fits on one row at the owner's width (about 1185px), and every control is reachable without scrolling.
- Check each design under par, over par and in progress, on desktop and phone.
