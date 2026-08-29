// ============================================================================
// C6 — where the watching control lives. Options + persisted selection.
//
// The problem (measured 2026-08-17): the fold in the card's corner is the
// watching control, and it clears neither accessibility floor.
//   • Contrast — watching is #BCD5CA on white (1.55:1), not watching is #E6E6E6
//     (1.25:1). WCAG 1.4.11 wants 3:1, and the fill is the control's only visual
//     expression. Reaching 3:1 needs roughly 70% accent, which stops reading as
//     a corner turned down and starts reading as a badge.
//   • Target size — a 32px box clipped to a triangle is ~22px of real target,
//     under the house floor of 44 and under WCAG 2.2's own 24. The spacing
//     exception does not apply: the thumbnail's link sits directly beneath it,
//     which is why the target was clipped to a triangle in the first place.
// The corner cannot hold both problems at once, so in every option below the
// fold goes back to being what it is everywhere else — a SIGNAL — and the
// control moves to the conversation's own header row, which has width, no image
// under it and no card anatomy to disturb.
// ============================================================================
const PGC6_OPTIONS = [
  {
    id: 'glyph', n: '1', name: 'Glyph on the row',
    dir: 'The header row becomes the thread\u2019s header: the label left, a hairline across, the folded-page glyph on the right \u2014 hollow in secondary ink when off, filled emerald when on. The corner on the card and the glyph on the row are the same object, so the signal and its control share one vocabulary.',
    cost: 'A bare glyph has to teach its own meaning. Nothing on the page says what pressing it does except the tooltip, which does not exist on touch.',
  },
  {
    id: 'word', n: '2', name: 'Glyph and word',
    dir: 'The same place, said out loud: the glyph with its word beside it \u2014 Watch when it is off, Watching when it is on. One quiet control, ink and fill carrying the state as well as the word.',
    cost: 'The word changes under the press, so the label names the state rather than the action \u2014 and a two-word control on the row competes with the label at the other end of it.',
  },
  {
    id: 'switch', n: '3', name: 'Word and switch',
    dir: 'The settings register: the word Watching on the right of the row with the app\u2019s own switch beside it. Unambiguous \u2014 a switch is the one control nobody has to learn, and its state is readable across the room.',
    cost: 'Puts a settings control on a reading page. It is the loudest thing on the surface and it draws the eye before the conversation does.',
  },
  {
    id: 'line', n: '4', name: 'A line of its own',
    dir: 'The control leaves the header row and becomes a line beneath it \u2014 the glyph and a sentence, the whole line pressable, full width. It says what it will do rather than naming a state, and the row above stays a label.',
    cost: 'A whole line of the page spent on a control that is off most of the time, sitting between the card and the first turn \u2014 the one place the surface was cleared out to protect.',
  },
];

const PGC6_KEY = 'pg_c6_v1';
const pgc6Read = () => {
  try { const v = JSON.parse(localStorage.getItem(PGC6_KEY) || '{}'); return v && v.opt ? v : { opt: 'glyph' }; }
  catch (e) { return { opt: 'glyph' }; }
};
const PGC6 = {
  ...pgc6Read(),
  subs: [],
  set(patch) {
    Object.assign(this, patch);
    try { localStorage.setItem(PGC6_KEY, JSON.stringify({ opt: this.opt })); } catch (e) {}
    this.subs.forEach(f => f());
  },
  sub(f) { this.subs.push(f); return () => { this.subs = this.subs.filter(x => x !== f); }; },
};

Object.assign(window, { PGC6, PGC6_OPTIONS });
