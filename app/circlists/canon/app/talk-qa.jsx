// ============================================================================
// LM-652 candidate — QA staging for the conversation surface's ARRIVAL WASH.
// Publishes window.CandTalkConfig, which app/config-extra.jsx renders when present.
// Part of the deletable aid: drop this file and its script tag and nothing changes.
//
// The wash cannot be staged from inside the surface. The mark a visit is read
// against is frozen when the member ARRIVES and only moves forward when they
// LEAVE, so anything staged while the surface is open is measured against a mark
// that already includes it. Stage from the shelf, then walk in.
// ============================================================================
const candQaVoices = ['Ada L.', 'Marcus T.', 'Priya N.', 'Dev K.', 'Lena P.', 'Sam R.'];
const candQaSays = [
  'Came back to this after the meeting \u2014 the trade-offs section is the part I keep quoting.',
  'One more thing this answers: why the fallback path is the one that always rots.',
  'Reading it a second time and the middle third is doing all the work.',
  'This is the argument I could not make on Thursday, written properly.',
];
const candQaReplies = [
  'That is the bit I skipped the first time.',
  'Same \u2014 and it explains the numbers from last week.',
  'Worth bringing to the review.',
  'Agreed, though I would push back on the second half.',
];
const candQaId = () => 'qa' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const candQaTurn = (talk, i, replyTo) => ({
  id: candQaId(),
  by: candQaVoices.find(n => !talk.some(t => t.by === n && !t.replyTo)) || candQaVoices[i % candQaVoices.length],
  text: replyTo ? candQaReplies[i % candQaReplies.length] : candQaSays[i % candQaSays.length],
  at: Date.now() + i,
  ...(replyTo ? { replyTo } : {}),
});

// Every item in the circle you are looking at, mapped.
const candQaApply = (fn) => {
  const api = window.CircCandidate && window.CircCandidate.api;
  if (!api) return;
  api.setSpaces(prev => prev.map(s => s.id === api.currentId
    ? { ...s, items: s.items.map(fn) } : s));
};

// One item in the circle, chosen by a predicate — the returns bar's "one more
// card" has to move exactly one row, not every row.
const candQaApplyOne = (pick, fn) => {
  const api = window.CircCandidate && window.CircCandidate.api;
  if (!api) return;
  api.setSpaces(prev => prev.map(s => {
    if (s.id !== api.currentId) return s;
    const target = s.items.find(pick);
    if (!target) return s;
    return { ...s, items: s.items.map(i => (i === target ? fn(i) : i)) };
  }));
};
const candQaMark = (i) => {
  const live = (i.talk || []).filter(t => !t.deleted);
  return i.talkSeenAt || (live.length ? Math.max(...live.map(t => t.at)) : Date.now());
};

const candQaActions = {
  // ---- the returns bar -----------------------------------------------------
  // On: every watched, read card with a conversation carries unseen words, so the
  // bar arrives at the head of the feed. Off: everything is marked seen, so it
  // empties and leaves. Both are staged in the circle the member is looking at.
  //
  // The mark is wound BACK behind the last few turns rather than a single turn
  // being appended: a row whose subline reads one name is the uncommon case, and
  // a lever that stages it everywhere hides the elision the bar exists to do. How
  // far back varies card to card (one, two, then three turns), so the rows carry
  // different numbers of voices the way the seed does.
  barOn: () => { let k = 0; candQaApply(i => {
    const talk = (i.talk || []).filter(t => !t.deleted);
    if (!i.read || !talk.length) return i;
    const theirs = talk.filter(t => t.by !== 'You').sort((a, b) => a.at - b.at);
    if (!theirs.length) return { ...i, watching: true, talkSeenAt: candQaMark(i), talk: [...i.talk, candQaTurn(i.talk, 0)] };
    const want = 1 + (k++ % 3);
    const from = theirs[Math.max(0, theirs.length - want)];
    return { ...i, watching: true, talkSeenAt: from.at - 1000 };
  }); },
  barOff: () => candQaApply(i => ((i.talk || []).length ? { ...i, talkSeenAt: Date.now() } : i)),
  // One more row: the first read card with a conversation that is NOT already in
  // the bar gets a fresh turn from a voice not yet on it.
  barMore: () => candQaApplyOne(
    i => i.read && (i.talk || []).filter(t => !t.deleted).length > 0 && !(i.watching && candFresh(i).length > 0),
    i => ({ ...i, watching: true, talkSeenAt: candQaMark(i), talk: [...i.talk, candQaTurn(i.talk, 0)] }),
  ),
  // Wind the mark back behind the oldest words on the card, so everything already
  // there reads as unseen and any held-back tail opens on arrival. A real
  // timestamp, never 0 — a falsy mark means "never visited", which marks nothing.
  rewind: () => candQaApply(i => {
    const talk = i.talk || [];
    if (!talk.length) return i;
    return { ...i, talkSeenAt: Math.min(...talk.map(t => t.at)) - 1000 };
  }),
  // Take the mark away entirely — the never-visited case, where a first arrival
  // sets the baseline and marks nothing however much has been said.
  clear: () => candQaApply(i => {
    if (!(i.talk || []).length) return i;
    const next = { ...i }; delete next.talkSeenAt; return next;
  }),
  // A fresh turn at the foot of each conversation.
  turn: () => candQaApply(i => {
    const talk = i.talk || [];
    if (!talk.length) return i;
    return { ...i, talk: [...talk, candQaTurn(talk, 0)] };
  }),
  // A fresh reply deep in a tail \u2014 enough replies that the tail exists, with the
  // new words inside it, which is the case that has to open on arrival.
  tail: () => candQaApply(i => {
    const talk = i.talk || [];
    const tops = talk.filter(t => !t.replyTo);
    if (!tops.length) return i;
    let best = tops[0], n = -1;
    tops.forEach(t => { const k = talk.filter(x => x.replyTo === t.id).length; if (k > n) { n = k; best = t; } });
    const need = Math.max(1, 3 - n);
    const add = [];
    for (let j = 0; j < need; j++) add.push(candQaTurn(talk, j, best.id));
    return { ...i, talk: [...talk, ...add] };
  }),
  // Watch everything, so every staged card has a way in from the roster.
  watch: () => candQaApply(i => ((i.talk || []).length ? { ...i, watching: true } : i)),
};

const CandTalkConfig = () => {
  const { ConfigGroup: Group, ConfigAction: Action } = window;
  const A = candQaActions;
  return (
    <Group title="Conversation">
      <Action label="Bring the returns bar in" onClick={() => A.barOn()} hint="Gives every watched, read card unseen words, so the bar arrives at the head of the feed you are in. Stay on the feed to watch it." />
      <Action label="Take the returns bar away" onClick={() => A.barOff()} hint="Marks everything seen, so the bar empties and leaves." />
      <Action label="Add a watched card" onClick={() => A.barMore()} hint="Drops one more watched card into the bar. Expanded, nothing on screen changes until you collapse it: the bar holds its rows while open." />
      <Action label="Everything unseen" onClick={() => A.rewind()} hint="Winds the mark back behind the oldest words, so every turn carries the tab." />
      <Action label="Never visited" onClick={() => A.clear()} hint="Takes the mark away: the first arrival sets the baseline and marks nothing, however much has been said." />
      <Action label="A new turn" onClick={() => A.turn()} hint="Applies to every conversation in the circle you are in. Stage it from the shelf, then open a card: the tab is read against the mark as it stood on arrival." />
      <Action label="A new reply in a tail" onClick={() => A.tail()} hint="Same as a new turn, inside a tail. A tail holding unseen words opens on arrival." />
      <Action label="Watch every card with words" onClick={() => A.watch()} hint="Puts every conversation into the return banner, so there is a way in to each of them." />
    </Group>
  );
};

Object.assign(window, { CandTalkConfig, candQaActions });
