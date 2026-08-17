// ============================================================================
// C2 playground — the marks on a Read card. Store, option table, and the seed
// that puts Read cards in every state the question needs.
// One card, three signals competing for one corner: the way through, whether
// anything is unseen, and whether the member is watching. Five whole answers.
// What holds in all five: the fold signifies WATCHING and is never the way
// through; no counts, no badges, no tallies.
// ============================================================================
const PGC2_KEY = 'pg_c2_v1';
const pgc2Saved = (() => { try { return JSON.parse(localStorage.getItem(PGC2_KEY) || 'null') || {}; } catch (e) { return {}; } })();

const PGC2 = {
  opt: pgc2Saved.opt || 'm1',
  subs: new Set(),
  set(patch) {
    Object.assign(this, patch);
    try { localStorage.setItem(PGC2_KEY, JSON.stringify({ opt: this.opt })); } catch (e) {}
    this.subs.forEach(f => f());
  },
  sub(f) { this.subs.add(f); return () => this.subs.delete(f); },
};
const usePGC2 = () => {
  const [, bump] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => PGC2.sub(bump), []);
  return PGC2;
};

const PGC2_OPTIONS = [
  { id: 'm1', n: '1', name: 'Words',
    dir: 'The way through is a word, not a glyph \u2014 "Conversation" sits in the action row as text. Unseen changes the word to name who spoke, so the signal is the label itself.',
    cost: 'The label changes width as the news changes, so the action row moves. Two words is a lot of ink for a quiet card.',
    watch: 'Yes \u2014 the fold alone carries it. The corner is the control: click it to turn it down or flatten it.' },
  { id: 'm2', n: '2', name: 'Inverted door',
    dir: 'The proposal on the table, built properly: the conversation mark inverts to solid ink when something is unseen \u2014 watched or not.',
    cost: 'A filled mark is the loudest thing on a shelf of calm cards. It behaves like a badge even though it counts nothing.',
    watch: 'Yes \u2014 the fold alone carries it, operable in the corner.' },
  { id: 'm3', n: '3', name: 'A line of its own',
    dir: 'No mark in the action row at all. A Read card with a conversation grows a foot line naming who has spoken; that line IS the way through, and its ink goes from grey to black when something is unseen.',
    cost: 'A whole row on every talking card, and cards with no conversation read as a different kind of object beside them.',
    watch: 'No \u2014 the separate toggle survives. The foot line is a destination, and hanging a state control off it would make one row mean two things.' },
  { id: 'm4', n: '4', name: 'The edge',
    dir: 'The way through is the card\u2019s own bottom edge \u2014 a strip attached under it, the same object continued. Unseen darkens the strip one step.',
    cost: 'Every talking card is 30px taller, and a card with nothing to say has no strip, so the column runs at two heights.',
    watch: 'Yes \u2014 the fold alone, operable.' },
  { id: 'm5', n: '5', name: 'Still talking',
    dir: 'Nothing new is drawn on the card. Read cards holding something unseen rise to the top of the tab under a hairline reading "still talking" \u2014 the shelf carries the signal, the card stays clean.',
    cost: 'The shelf reorders under the reader: a card moves because somebody spoke. The signal is gone the moment they scroll past it.',
    watch: 'Yes \u2014 the fold alone, operable.' },
];
const pgc2Opt = () => PGC2_OPTIONS.find(o => o.id === PGC2.opt) || PGC2_OPTIONS[0];

// ---- Seed ------------------------------------------------------------------
// The shelf the question needs, on Read: watched + quiet, watched + unseen,
// unwatched + unseen, unwatched + quiet, and one carrying no conversation at all.
(() => {
  const base = window.CircSeed.seedSpaces;
  window.CircSeed.seedSpaces = (email) => {
    const spaces = base(email);
    const NOW = Date.now();
    const H = 3600e3;
    const T = (id, by, hoursAgo, text) => ({ id, by, text, at: NOW - hoursAgo * H });
    const byUrl = {};
    spaces.forEach(sp => sp.items.forEach(it => { byUrl[it.url] = it; }));
    const set = (url, f) => { const it = byUrl[url]; if (it) Object.assign(it, f); };
    // watched · something unseen (the candidate seed already leaves these fresh)
    set('https://go.dev/blog/pipelines', { watching: true, talkSeenAt: NOW - 20 * H });
    set('https://jvns.ca/blog/2026/02/dns-resolvers/', { watching: true, talkSeenAt: NOW - 10 * H });
    // watched · quiet — everything in it has been seen
    set('https://go.dev/blog/errors-are-values', { watching: true, talkSeenAt: NOW });
    // UNWATCHED · something unseen — the case that decides whether the unseen
    // mark is tied to watching or stands on its own.
    set('https://www.kernel.org/doc/html/latest/process/submitting-patches.html', {
      watching: false, talkSeenAt: NOW - 30 * H,
      talk: [
        T('kp1', 'Dev K.', 4, 'The sign-off section changed last year and half our checklist is out of date because of it.'),
        T('kp2', 'Nadia F.', 2, 'I redid ours against this on Friday. Will drop the diff in on Monday.'),
      ],
    });
    // unwatched · quiet
    set('https://martinfowler.com/bliki/FormerMember.html', {
      watching: false, talkSeenAt: NOW,
      talk: [T('fm1', 'Sam R.', 40, 'Short, and the last paragraph is the one worth keeping.')],
    });
    // no conversation at all — the card that must not look broken beside the rest
    set('https://docs.internal-infra-example.org/wiki/spaces/PLATFORM/pages/884213/postmortem-2026-02-14-cross-region-replication-lag-incident-review-and-followups', {
      watching: false, talk: [], thought: null,
    });
    return spaces;
  };
})();

// Does this card hold anything the member has not seen? candFresh() excludes
// their own turns and anything before talkSeenAt.
const pgc2Unseen = (item) => candFresh(item).length > 0;
const pgc2HasTalk = (item) => candTurns(item).filter(t => !t.deleted).length > 0 || !!item.thought;
const pgc2Who = (item) => {
  const names = [];
  candFresh(item).forEach(t => { if (!names.includes(t.by)) names.push(t.by); });
  return names;
};
const pgc2Voices = (item) => {
  const names = [];
  candTurns(item).forEach(t => { if (!t.deleted && t.by !== 'You' && !names.includes(t.by)) names.push(t.by); });
  return names;
};

Object.assign(window, { PGC2, usePGC2, PGC2_OPTIONS, pgc2Opt, pgc2Unseen, pgc2HasTalk, pgc2Who, pgc2Voices });
