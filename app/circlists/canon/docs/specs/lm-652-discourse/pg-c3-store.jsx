// ============================================================================
// C3 playground — the return affordance and its dropdown. Five ways the head of
// the feed says the circle has spoken on cards you are watching, and five ways
// it hands you the cards themselves. Installed by re-publishing one name:
// CircCandidate.FeedLead. Nothing else in the app changes.
// What holds: no counts, no badges, no tallies; nothing sits above a card title;
// every option gets you all the way to the card's conversation.
// ============================================================================
const PGC3_KEY = 'pg_c3_v1';
const pgc3Saved = (() => { try { return JSON.parse(localStorage.getItem(PGC3_KEY) || 'null') || {}; } catch (e) { return {}; } })();
const PGC3 = {
  opt: pgc3Saved.opt || 'r1',
  subs: new Set(),
  set(p) { Object.assign(this, p); try { localStorage.setItem(PGC3_KEY, JSON.stringify({ opt: this.opt })); } catch (e) {} this.subs.forEach(f => f()); },
  sub(f) { this.subs.add(f); return () => this.subs.delete(f); },
};
const usePGC3 = () => { const [, b] = React.useReducer(x => x + 1, 0); React.useEffect(() => PGC3.sub(b), []); return PGC3; };

const PGC3_OPTIONS = [
  { id: 'r1', n: '1', name: 'One line',
    dir: 'No box, no chevron, no dropdown. A single line of type at the head of the feed, and the cards are named IN it \u2014 each title an inline link straight to its conversation.',
    cost: 'Past three or four cards the line runs long and has to elide, and there is no state that shows them all.' },
  { id: 'r2', n: '2', name: 'Rule',
    dir: 'The feed\u2019s own waterline grammar, borrowed: a hairline with a small label, and the cards listed plainly beneath it. Always open \u2014 there is nothing to expand.',
    cost: 'It takes permanent vertical room at the head of the feed, and it reads as part of the feed rather than as news.' },
  { id: 'r3', n: '3', name: 'Card, tightened',
    dir: 'What stands today, with everything that was not earning itself removed: no sub-line, the chevron unboxed, the rows without their own chevrons, the names said once \u2014 at the head, never again per row.',
    cost: 'Still a card at the head of a column of cards, so it competes with the thing it is pointing at.' },
  { id: 'r4', n: '4', name: 'Bar',
    dir: 'Not content at all \u2014 chrome. A full-bleed strip flush under the tabs, on the app\u2019s own sunken ground, that pushes the feed down when it opens.',
    cost: 'A second bar under the tab bar; on the phone the chrome starts eating the screen before any reading happens.' },
  { id: 'r5', n: '5', name: 'The cards themselves',
    dir: 'No affordance to design. The cards that have moved are lifted to the head of the feed under one quiet label, drawn as the real rows they are, each carrying who spoke.',
    cost: 'The most room of any of the five, and the reader has to recognise cards they have already read sitting out of place.' },
];
const pgc3Opt = () => PGC3_OPTIONS.find(o => o.id === PGC3.opt) || PGC3_OPTIONS[0];

Object.assign(window, { PGC3, usePGC3, PGC3_OPTIONS, pgc3Opt });
