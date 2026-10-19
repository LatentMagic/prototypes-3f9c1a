# Where, Chain and Salvage art: what went wrong, and how it resolved (2026-10-19)

Written at the owner's request as input for the design system. It states the problems; it proposes no rules.

## What went wrong on the first pass

**1. I designed the rest pose and left the end pose to the move.** The motion guide says how to move (400ms, one ease, the stagger limits, capped travel) and asks for the hover to mean something. Nothing in it asks for the end pose to be drawn as a state of its own and checked. So I drew a still cover, picked a move that met the rules, and never looked at where it ended.

**2. Capped travel stopped the end pose from arriving.** Where's guess had to slide until it met the country; Chain's word had to step up into the line. Travel is capped in pixels, so above a stage of about 360px both stopped short. The first handoff noted this and called it a "call", when it was a defect. The guide's own examples (Casebook's bars rising, a sun sinking) are moves with no target, where stopping short doesn't matter. The guide never separates those from moves that have to land on something.

**3. I wrote the meaning after picking the move.** Each hover line explained a move I had already chosen. Where's end pose, two squares touching, means "shares a border" under the game's own rules, not "found". No check held the end pose up against the game's rules.

**4. The worked examples became the vocabulary.** The guide says the five pieces aren't a catalogue, but they and the loader's moves (square to circle, a step up) are the only moves it shows. Salvage's fill copied Daily Word's.

**5. I checked stills, never the motion.** I looked at rest and end at one size. I never froze a frame partway through, or checked a wide frame or the 40px lead mid-transition, which is where every failure showed.

## How it resolved

- **Moves that land are exact at any size.** Where's needle turns about its own centre. Chain's line grows from a fixed edge, and the words fill inside their own boxes. Salvage's pegs and wreck scale about their own centres. None of these depends on a distance, so the cap never cuts them short.
- **Rest and end are two moments of one play.** Where: the hint points the wrong way, then it points at the country and the country is found. Chain: the ends are found, then the line runs through every word and each fills as the line reaches it (the owner's idea). Salvage: the board mid-hunt, then the last hit lands and the wreck shows itself.
- **Subtraction told the story where adding things didn't.** Salvage failed four times: a sinking wreck, an aim ring, a peg board, a boat and dive line. Each added a new scene. It resolved when the misses shrank to nothing (the owner's addition), so the search falls away and only the find is left.
- **Seeing beat describing.** The owner couldn't judge options written in words. Rest, halfway and end frames side by side let him choose, but the first board was too busy to read. Small art takes few shapes and one idea.
- **Checking the transition caught what checking stills missed.** Freezing frames partway through, at 4:3, square, 3:1 and the 40px lead, found the stall in Chain and the seam in Salvage before the owner saw them.

## Still open

- Rotation isn't covered by the travel cap. Where's needle turns 45°; at a 240px stage its point sweeps about 30px. The owner likes it; the design system says nothing either way.
- The Salvage cover playground (`playground/salvage-art.html`) is finished. It can be archived when the owner asks.
