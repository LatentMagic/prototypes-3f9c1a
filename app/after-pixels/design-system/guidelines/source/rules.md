# After Pixels design rules

## Colour
- Page #1B1917, card #262320, pop-up #322E2A, line #37332E, control edge #918B80.
- Text #F0EEE8, muted text #ABA79E, off-white #EDE8DF.
- The shop has no colour of its own. Links, the selected-tab line, small labels, the progress bar and ticks are off-white #EDE8DF.
- Status: success #4CC38A (text on it #08140E), warning #FFD23A (#1A1203), error and delete #FF6B5E (#1A0805).
- Cover backgrounds: #1D1B3A, #421A28, #163328.
- Cover shapes: #4CC38A, #D66847, #E5A63B, #328A88, #A390B2, #F2EBE0.
- Strong colour appears only in covers, shape blocks and status colours.
- Every cover has one flat ground colour and declares how it extends in a taller box: from the bottom edge or from the centre (game-art-motion.md).
- A screen with no cover gets a small block of flat shapes in cover colours.
- Covers are flat geometric shapes in solid colours. The three covers in the system are examples, not ratified designs.
- Shape set (assets/shapes): square, circle, triangle, right triangle, half circle, quarter circle, diamond, arch, pill, ring.

## Logo
- Mark: three green #4CC38A squares and an orange #D66847 circle lifted out of the fourth slot (assets/logo.svg).
- Lockup: mark at 32px beside the name in Bricolage 700, 10px gap.
- Favicon 32px, app icon 180px.

## Type
- Headings: Bricolage Grotesque 700, letter-spacing -0.01em (Google Fonts).
- Text: Hanken Grotesk 400, and 600 for labels and buttons (Google Fonts).
- Sizes: page title 34px, section title 24px, card title 20px, body 16px, small label 13px, fine print 11px (only for legal lines such as the footer's company registration).
- Inputs are 16px or larger.

## Spacing and shape
- Regular spacing steps: 4, 8, 12, 16, 24, 36px.
- Corner radius 0 everywhere.
- Touch targets at least 44px; buttons and fields 48px high.

## Buttons
- Main: off-white fill, dark text.
- Secondary: outlined, text-coloured.
- Text link: off-white, underlined.
- Delete: filled red, or red underlined link.
- Disabled and loading states exist. Every button visibly answers a press (scale .97, 120ms).
- Sign in sits beside Sign up, in that order: secondary, then main.

## Movement
- Press 120ms, label swap 160ms, dim 200ms, dropdown 220ms, pop-up 260ms.
- Pop-ups close faster than they open: 200ms.
- Status messages fade and rise 4px into place over 160ms.
- Reduced motion: everything snaps; a busy button drops its spinner and its label pulses gently instead.
- Loading screens use the Loader: the logo with the orange circle travelling clockwise round the four slots; the square it leaves fades to 35% and recovers. 1.2s a lap. Still mark under reduced motion.
- Other logo animations (intros, transitions) may come later; none are defined yet.
- Curve cubic-bezier(.16, 1, .3, 1). No motion for reduced-motion settings.

## Cross-app standard
`specs/governance/standards/ui-design.md` in the monorepo settles three things that matter most here: only a panel changes shape on a phone, so a dialog stays a centred window and a menu opens at its control at every width (updated 2026-10-08; the hand-off's "a pop-up is a window on desktop and a bottom sheet on phones" is superseded); delete actions look different before they are pressed; text inputs are 16px or larger.

## Ruled out
- Blue anywhere, and navy as a background.
- A player-chosen colour.
- Fonts on Impeccable's over-used list.
- Colour on the shop's own parts.

## Not decided
- How shapes are assembled into a cover.
- The layout of any screen.
- Anything about product features.
- Heading font is kept as Bricolage Grotesque for now. Schibsted Grotesk 700 is the alternative to revisit if headings feel too playful.
