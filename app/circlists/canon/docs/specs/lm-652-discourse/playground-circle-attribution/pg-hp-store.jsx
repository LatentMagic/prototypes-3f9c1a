// ============================================================================
// Home's Conversations preview — the rig's store, option set and seed.
//
// THE QUESTION. The preview panel's circle headings ("Backend Pod", "Tuesday
// Book Club", "Platform Guild") make it read as bloated: a heading line, then
// two lines per row, then a foot line, in a card that is a PREVIEW. The axis the
// four options differ on is WHERE THE CIRCLE LIVES — line two, the end of line
// one, drawn into the group, or nowhere.
//
// HELD FIXED, and not up for exploration (the user's ruling, 2026-09-21):
//   — the bound: at most 3 circles, at most 6 rows, freshest first across the
//     whole union, "More in the circles below." when more was held back
//   — no count, anywhere. CIRC-034 is explicit that the home "raises no count of
//     links, arrivals or unread items anywhere"; the panel is the one place that
//     still did, in its head
//   — no clear control, and no mark-all-seen. Clearing is a separate question
//     and the user has ruled it off the homepage: this panel is a preview
//   — collapse/expand stays, and the head reads the same line open or shut
//
// FIXED ACROSS ALL FOUR, and each is the removal of a named defect:
//   — THE HEAD IS ONE LINE, carrying who spoke. It replaces the count line and
//     does not change when the panel opens, so opening the panel changes the
//     list and nothing else.
//   — NO PER-ROW HAIRLINE. Every row carried `borderTop: 1px --color-border-2`,
//     which is the "strange semi-opaque lines" in the user's read; six of them
//     under three headings is what the eye registers as text bloat. Separation
//     is the card's one head/list seam plus spacing.
//   — THE PER-ROW CHEVRON STAYS. Round one dropped it, on app/home.jsx's
//     2026-09-09 ruling for the circle rows beneath. The user reversed that
//     here: the in-circle bar's rows carry a chevron, and these rows are the
//     same rows, so consistency of affordance wins (governance
//     standards/ui-design.md). It costs the title ~26px on a phone; the only
//     other way to settle it is to drop the chevron in the circle too, which is
//     a wider change than this rig is scoped to.
//   — ONE HEIGHT PER ROW, clipped never wrapped (CIRC-034), and every row keeps
//     the 44px touch floor (governance standards/ui-design.md).
// ============================================================================
const PGH_KEY = 'pg_hp_v1';
const pghSaved = (() => { try { return JSON.parse(localStorage.getItem(PGH_KEY) || 'null') || {}; } catch (e) { return {}; } })();

const PGH = {
  opt: pghSaved.opt || 'meta',
  head: pghSaved.head || 'watching',
  subs: new Set(),
  set(patch) {
    Object.assign(this, patch);
    try { localStorage.setItem(PGH_KEY, JSON.stringify({ opt: this.opt, head: this.head })); } catch (e) {}
    this.subs.forEach(f => f());
  },
  sub(f) { this.subs.add(f); return () => this.subs.delete(f); },
};
const usePGH = () => {
  const [, bump] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => PGH.sub(bump), []);
  return PGH.opt;
};

const PGH_OPTIONS = [
  { id: 'meta', n: '1', name: 'The meta line',
    dir: 'The tail’s idea, moved off the title line: the title has line one to itself, and line two carries the circle and the people together — “Backend Pod · Marcus T. and Lena P.” Both are metadata about the same conversation, so both belong on the metadata line. The circle leads and holds its width; the names take the ellipsis, because a partial list of names still reads as a list of names where half a circle name reads as nothing.',
    cost: 'Line two is doing two jobs, and at 320px it is the people who get cut — you see that somebody spoke and not always who. The circle also reads first on every row, which is emphasis the circle did not ask for.' },
  { id: 'tail', n: '2', name: 'The tail',
    dir: 'The circle at the end of the title line, right-aligned and quiet; row two keeps who spoke. The reason to keep it in the set: the rows read exactly as the conversations do inside a circle, with one tag added.',
    cost: 'The title gives way to it, and on a phone that is most of the title — the row keeps its facts and loses the one you were reading. The right edge also goes ragged, since the circle names are what terminate the line.' },
  { id: 'subline', n: '3', name: 'The subline',
    dir: 'The circle takes row two outright and who spoke leaves the rows. The calmest of the four by some distance, and the only one where nothing competes for width at any size.',
    cost: 'It drops the people, which is a fundamental part of what a circle is communicating — you cannot tell who spoke on any one conversation until you open it. A circle holding three rows also prints its name three times.' },
  { id: 'unsaid', n: '4', name: 'Unsaid',
    dir: 'The panel does not say which circle. Rows are a title over who spoke; the circle is answered one gesture later, by arriving in it. Kept in the set as the baseline: the circles list directly beneath already carries the map with its own dots (CIRC-034).',
    cost: 'It breaks the strip’s stated rule — the panel stops answering “which circle is this in” — and the seed’s duplicate title across two circles renders as two identical rows.' },
];

// The head, three registers, no count in any of them. Not a decision taken
// here: the user’s complaint was that the head stopped communicating what the
// panel holds, and which of these does that best is theirs to judge.
//   watching — what the panel IS (the old head’s construction, minus its count)
//   replies  — what is IN it: the condition that varies
//   since    — the same condition, put in time
const PGH_HEADS = {
  watching: 'Conversations you are watching',
  replies: 'New replies in your circles',
  since: 'Replies since you last looked',
};
const pghHead = () => PGH_HEADS[PGH.head] || PGH_HEADS.watching;

const pghOpt = () => PGH_OPTIONS.find(o => o.id === PGH.opt) || PGH_OPTIONS[0];

// ---- the seed ------------------------------------------------------------
// Seeded for the problem: the panel has to sit AT its ceiling or there is no
// bloat to judge — three circles, six rows and a leftover line. Lifted verbatim
// from the clear rig's pgcSeed (docs/specs/lm-652-discourse/playground/
// pg-clr-store.jsx), which lifted its cloning from app/states.jsx stageHome({
// crowd }). A fixture, not a second seed to maintain — do not tune it.
const pghSeed = (email) => {
  const base = window.PGH_SEED_BASE(email).filter(sp => !/^TEST\b/i.test(sp.name || ''));
  const clone = (src, id, name, shift) => ({
    ...src, id, name, unseen: false,
    items: src.items.map((i, n) => ({
      ...i, id: id + '-' + n,
      ...(i.talkSeenAt ? { talkSeenAt: i.talkSeenAt - shift } : {}),
      talk: (i.talk || []).map(t => ({ ...t, id: id + '-' + t.id, at: t.at - shift })),
    })),
  });
  const pod = base.find(sp => sp.id === 'sp-backend');
  const club = base.find(sp => sp.id === 'sp-book');
  if (!pod || !club) return base;
  return base.concat([
    clone(club, 'sp-crowd-a', 'Thursday Cinema', 36e5),
    clone(pod, 'sp-crowd-b', 'Platform Guild', 72e5),
  ]);
};
window.PGH_SEED_BASE = window.CircSeed.seedSpaces;
window.CircSeed.seedSpaces = pghSeed;

const pghReset = () => {
  const api = window.CircCandidate && window.CircCandidate.api;
  if (!api) return;
  api.setSpaces(pghSeed((api.user && api.user.email) || ''));
};

Object.assign(window, { PGH, usePGH, PGH_OPTIONS, pghOpt, PGH_HEADS, pghHead, pghReset });
