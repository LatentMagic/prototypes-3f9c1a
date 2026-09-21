// ============================================================================
// Clearing conversations — the rig's store, seed and the clear act itself.
//
// THE QUESTION. The returns bar has no way out except reading every card behind
// it. A clear ends the bar in one gesture. Held fixed across all three options
// (the user's lean, 2026-09-19): ONE clear for the whole home strip, never one
// per circle group — a per-group clear rebuilds the circle's own bar inside
// home. The cost that buys is real and is not hidden: a member who wants to
// clear one busy circle goes into it.
//
// THE AXIS THE THREE OPTIONS DIFFER ON is what KIND of thing the act is — the
// affordance itself, which is the part round one got wrong:
//   1  furniture — the panel gains a floor
//   2  a peer of the chevron — the open head changes register
//   3  a gesture — nothing is added to the bar in either state
// Protection is deliberately NOT the axis. It is a lever (undo off / on) that
// applies to all three, so reversal can be judged without also choosing where
// the act lives.
//
// WHAT CLEARING IS. It moves `talkSeenAt` forward to now on every card the bar
// stands for — the same write the conversation surface makes when you leave it
// (app/talk-surface.jsx). Nothing is deleted, nobody else's view moves. Which is
// why every option that has room for a line says so in the same words.
// ============================================================================
const PGC_KEY = 'pg_clr_v1';
const pgcSaved = (() => { try { return JSON.parse(localStorage.getItem(PGC_KEY) || 'null') || {}; } catch (e) { return {}; } })();

const PGC = {
  opt: pgcSaved.opt || 'base',
  undo: pgcSaved.undo || 'off',
  subs: new Set(),
  set(patch) {
    Object.assign(this, patch);
    try { localStorage.setItem(PGC_KEY, JSON.stringify({ opt: this.opt, undo: this.undo })); } catch (e) {}
    this.subs.forEach(f => f());
  },
  sub(f) { this.subs.add(f); return () => this.subs.delete(f); },
};
const usePGC = () => {
  const [, bump] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => PGC.sub(bump), []);
  return PGC.opt;
};

const PGC_OPTIONS = [
  { id: 'base', n: '1', name: 'The base',
    dir: 'The open panel gains a floor: a full-bleed band across the card’s own edges, on the sunken surface, carrying the act, the count and the one line that says what clearing does. It is not a row — no chevron, no title over a subtitle, nothing that can be pressed expecting a conversation — and it absorbs “More in the circles below”, so the foot of the panel tells one story instead of two.',
    cost: 'Two presses, and on home the act sits below six rows and three circle names — the furthest point in the panel from where you decided. It is also the option most exposed to the gap between what the panel shows and what the clear ends.' },
  { id: 'pair', n: '2', name: 'The pair',
    dir: 'Nothing on the collapsed bar. Open it and the head changes register: the two lines fall to one short count — the list beneath is now saying what the subline was — and the space that buys goes to a second boxed control beside the chevron, same height, same border, same radius. Two boxes of one material, at the top, beside the number they end.',
    cost: 'The head carries three targets while open, and there is no room next to them for the line that says what clearing does — this option teaches nothing before it acts. On a narrow card the label drops to the glyph alone.' },
  { id: 'sweep', n: '3', name: 'The sweep',
    dir: 'No control, in either state — at rest this is exactly the shipped bar. Press the collapsed bar and pull it left: the act is underneath, grey while the pull can still be taken back, accent the moment a release would act, which is the whole of the confirmation. Release and the bar plays its ordinary removal, so the gesture ends in the motion the bar already had.',
    cost: 'Undiscoverable: the product swipes nowhere else, so nobody finds this without being told, and there is no keyboard path to it at all. It also cannot be reached from the open panel — you collapse first.' },
];
const pgcOpt = () => PGC_OPTIONS.find(o => o.id === PGC.opt) || PGC_OPTIONS[0];

// ---- the act -------------------------------------------------------------
// Every card the bar stands for, across one circle or every funded one. Home
// takes the WHOLE union, not the six rows the panel bounds itself to — that gap
// is the terminality the rig is here to let you feel.
const pgcTargets = (spaces, onlyId) => {
  const out = [];
  (spaces || []).filter(s => s.funded && (!onlyId || s.id === onlyId)).forEach(s => {
    candBarRows(s).forEach(i => out.push({ sp: s.id, id: i.id, mark: i.talkSeenAt }));
  });
  return out;
};
const pgcCount = (list) => ({ rows: list.length, circles: new Set(list.map(t => t.sp)).size });
// at === undefined restores each card's own prior mark; that is the undo.
const pgcWrite = (api, list, at) => {
  if (!api || !list.length) return;
  api.setSpaces(prev => prev.map(s => {
    const mine = list.filter(t => t.sp === s.id);
    if (!mine.length) return s;
    return { ...s, items: s.items.map(i => {
      const t = mine.find(x => x.id === i.id);
      if (!t) return i;
      return { ...i, talkSeenAt: at === undefined ? t.mark : at };
    }) };
  }));
};

// ---- the seed ------------------------------------------------------------
// Seeded for the problem, not for coverage: home has to be at the strip's
// ceiling or the terminal clear is a clear of four rows in two circles, which
// nobody would hesitate over. Cloning is lifted from app/states.jsx's
// stageHome({ crowd }) — a fixture, not a second seed to maintain.
const pgcSeed = (email) => {
  const base = window.PGC_SEED_BASE(email).filter(sp => !/^TEST\b/i.test(sp.name || ''));
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
window.PGC_SEED_BASE = window.CircSeed.seedSpaces;
window.CircSeed.seedSpaces = pgcSeed;

// A rig that can be played into a corner and not out of it is a rig you use
// once: clearing is terminal by construction, so putting the marks back is the
// one lever the bar carries.
const pgcReset = () => {
  const api = window.CircCandidate && window.CircCandidate.api;
  if (!api) return;
  api.setSpaces(pgcSeed((api.user && api.user.email) || ''));
};

Object.assign(window, { PGC, usePGC, PGC_OPTIONS, pgcOpt, pgcTargets, pgcCount, pgcWrite, pgcReset });
