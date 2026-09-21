// ============================================================================
// Clearing the returns bar, INSIDE A CIRCLE — the rig's store, option set,
// the act, and the receipt.
//
// THE QUESTION. The bar at the head of a circle's feed has no way out except
// opening every card behind it. One control clears the whole bar at once.
//
// FIXED BY THE BRIEF, in all four options:
//   — one act, every row. No per-row dismiss.
//   — clearing MARKS NOTHING READ. The replies stay on each card's
//     conversation, and a new reply brings the row back. Every option with room
//     for a line says exactly that, in the same words.
//   — an empty bar is GONE. No caught-up resting state, ever.
//   — CALM: the clear must never read as the bar's main action. Opening a
//     conversation is. That governs weight, colour and placement equally — no
//     filled button, no accent, nothing that competes with a row.
//   — the bar's arrival, collapse and removal behaviour is the shipped one
//     (app/talk-return.jsx). This rig forks the bar to add an affordance; it
//     does not re-time it.
//
// THE RULE CARRIED FROM THE REJECTED ROUND (2026-09-20). The act may borrow the
// BAR's forms — the boxed 34px control, the hairline, the card's own edges, the
// sunken surface — and NEVER the ROWS' forms. No title over a subtitle, no
// trailing chevron, nothing that invites a press expecting a conversation. The
// other finding from that rejection: "text — chevron — yuck". A loose label
// beside the boxed chevron collides two registers in the one row that is always
// on screen, so no option here puts words next to that box.
//
// WHERE IT LANDED. Four answers were played on 2026-09-21 — a band at the foot
// of the panel ("the floor"), the head's freed second line, a bare glyph in the
// card's corner, and this one. The first three were rejected: the band was
// bloat, a hover-filled control has no business in the head, and an unlabelled
// cross in the corner reads "hide this bar" rather than "clear these". What
// survived is the lightest of them, stripped further — no band, no button, no
// teaching line. The rejected three are recorded in
// note-2026-09-21-clear-in-circle.md and are not kept as pills: a rig carrying
// options nobody will choose makes the surviving one harder to judge.
//
// UNDO IS NOT AN OPTION, IT IS A LEVER, applying to all four — so reversal is
// judged on its own rather than masquerading as a fifth idea. It is also the
// rig's answer to "how the bar leaves": Off = the shipped removal; On = the bar
// becomes its own receipt for eight seconds, carrying Undo, then plays that
// same removal.
//
// THE ARGUMENT TO PUT ON UNDO. Clearing destroys no words — every reply stays
// on its card — so what is lost is the INDEX of which cards had words you had
// not seen, and that cannot be reconstructed afterwards. It is also a
// one-press, no-confirmation act, and governance
// (specs/governance/standards/ui-design.md) is explicit: ration confirmation,
// and where undo is cheap it REPLACES confirmation rather than adding to it.
// That is the case for On. The case against is that notification surfaces
// usually decline it, and an eight-second receipt is eight seconds of the bar
// still being there after you asked it to go.
// ============================================================================
const PGCC_KEY = 'pg_cc_v1';
const pgccSaved = (() => { try { return JSON.parse(localStorage.getItem(PGCC_KEY) || 'null') || {}; } catch (e) { return {}; } })();

const PGCC = {
  opt: pgccSaved.opt || 'foot',
  undo: pgccSaved.undo || 'off',
  subs: new Set(),
  set(patch) {
    Object.assign(this, patch);
    try { localStorage.setItem(PGCC_KEY, JSON.stringify({ opt: this.opt, undo: this.undo })); } catch (e) {}
    this.subs.forEach(f => f());
  },
  sub(f) { this.subs.add(f); return () => this.subs.delete(f); },
};
const usePGCC = () => {
  const [, bump] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => PGCC.sub(bump), []);
  return PGCC;
};

const PGCC_OPTIONS = [
  { id: 'foot', n: '1', name: 'The foot',
    dir: 'A FOOTNOTE, not a row. Four attempts failed the same way before this one: the act kept being drawn in the LIST’s register — 13px, medium weight, row-inset, a row’s hover fill — so whatever its placement it read as a fifth conversation that had lost its subtitle. So the register changes, not the placement: the act takes the voice the panel already has for a footnote (“More in the circles below.” on home) — 12px, 400, fg-3, no fill, an underline on hover — with the rows’ own hairline above it as the boundary between the two registers. The list is rows; the act is a footnote; nothing competes.',
    cost: 'Quiet enough to be missed — and quiet is the brief, so the two cannot be separated. Nothing is reachable while the bar is collapsed either, so clearing is two presses. It teaches nothing before it acts, which is the point rather than an omission: see below.' },
  { id: 'row', n: '2', name: 'The footnote, whole-row',
    dir: 'Option 1 exactly — same 12px, same 400, same fg-3, same hairline — with one thing changed: it is a row. Full-width press target, and the list’s own hover tint across it, which is the conventional pairing (a full-width target gets a fill; an underline belongs to a text-width link). The two decisions we kept conflating are separated here: the HIT AREA and the HOVER are a row’s, the REGISTER stays a footnote’s — which is what the version rejected earlier got wrong, since that one took the rows’ type as well at 13px, 500, fg-2.',
    cost: 'The tint is the loudest thing in the panel while the pointer is on it: a full-bleed fill lighting up behind a 12px grey line gives the act more visual weight on hover than any conversation above it. The trilemma in one line — whole-row press, quiet register, conventional feedback: pick two. This drops quiet.' },
];
const pgccOpt = () => PGCC_OPTIONS.find(o => o.id === PGCC.opt) || PGCC_OPTIONS[0];

// ---- the word -----------------------------------------------------------
// "Clear", and nothing else.
//
// WHY NOT "Clear these": the demonstrative does no work. The list it refers to
// is directly above the control, and a label that names its action is the whole
// requirement (governance standards/ui-design.md, descriptive action labels).
//
// WHY THERE IS NO TEACHING LINE (the user's ruling, 2026-09-21, and the reason
// the band went with it). Clearing destroys nothing — every reply stays on its
// card, nobody else's view moves, and a new reply brings the row back. So there
// is nothing to reassure anybody about, and a sentence explaining a harmless act
// is bloat in the one place the product is meant to be calmest. The rule that
// falls out of it, and it is worth keeping: MICROCOPY TEACHES WHERE THE ACT HAS
// A CONSEQUENCE THE MEMBER CANNOT SEE. Mark-as-read has one (it moves in your
// view and not in theirs). Clearing has none.
const PGCC_ACT = 'Clear';

// ---- the act --------------------------------------------------------------
// It moves `talkSeenAt` forward to now on every card the bar stands for — the
// same write the conversation surface makes when you leave it
// (app/talk-surface.jsx). Nothing is deleted and nobody else's view moves.
const pgccTargets = (sp) => (sp ? candBarRows(sp).map(i => ({ id: i.id, mark: i.talkSeenAt })) : []);
// at === undefined restores each card's own prior mark; that is the undo.
const pgccWrite = (api, spaceId, list, at) => {
  if (!api || !list.length) return;
  api.setSpaces(prev => prev.map(s => {
    if (s.id !== spaceId) return s;
    return { ...s, items: s.items.map(i => {
      const t = list.find(x => x.id === i.id);
      if (!t) return i;
      return { ...i, talkSeenAt: at === undefined ? t.mark : at };
    }) };
  }));
};

// ---- the receipt ----------------------------------------------------------
// Module-level, not component state: the bar unmounts and remounts around the
// clear, so a receipt held in the component would be destroyed by the very act
// that creates it.
const PGCC_RECEIPT_MS = 8000;
const PGCCR = {
  at: null, spaceId: null, list: null, subs: new Set(),
  set(v) { Object.assign(this, v || { at: null, spaceId: null, list: null }); this.subs.forEach(f => f()); },
  sub(f) { this.subs.add(f); return () => this.subs.delete(f); },
};
const usePGCCR = () => {
  const [, bump] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => PGCCR.sub(bump), []);
  return PGCCR;
};

// ---- the seed -------------------------------------------------------------
// Seeded for the problem: a bar of one or two rows is not something anybody
// hesitates over. The shipped seed's Backend Pod already carries four watched
// conversations with fresh talk, which is the volume the pain lives at, so the
// rig takes the seed as it stands and only offers a way to put the marks back.
const pgccReset = () => {
  const api = window.CircCandidate && window.CircCandidate.api;
  if (!api) return;
  PGCCR.set(null);
  api.setSpaces(window.CircSeed.seedSpaces((api.user && api.user.email) || ''));
};

Object.assign(window, { PGCC, usePGCC, PGCC_OPTIONS, pgccOpt, PGCC_ACT, pgccTargets, pgccWrite, PGCCR, usePGCCR, PGCC_RECEIPT_MS, pgccReset });
