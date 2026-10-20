// Session pages, Casebook: the reader of the case record (window.PgCb) that options 1 to 3 share. Loads before them (list 'casebook' in PG_MODELS, pg/games.js).
// Casebook's Today is canon's own record page (CbCase), so a Casebook option receives the case record (cbWeek / PG_CB_LOST), not a GS_SESSIONS entry.
// Fix round 1: Gull Point's content (roles, places, the four lies) is a SEED (label S) and is read only for the Gull Point record (c.id === 'gull').
// Any other case reads the record alone: no role, no place count beyond c.places, no quoted lie, no topic. The date reads c.date, else Gull Point's seeded play date.
// Spoilers: only turns the player took. The culprit is in the case file, not the log, so nothing here can name it; the accused suspect is the player's own accusation.
(function () {
  const SEED_ID = 'gull';
  const isSeed = (c) => !!c && c.id === SEED_ID;
  const PLACE_SHORT = { 'the hotel bar': 'Bar', 'the harbour noticeboard': 'Harbour', 'the lighthouse stairs': 'Stairs', 'Pike’s office': 'Office' };
  const SEED_PLACES = 4;   // content `locations` (S): lighthouse stairs, Pike's office, hotel bar, harbour noticeboard
  const SUSP = {
    'Maeve Doyle': { first: 'Maeve', role: 'Hotel manager' },
    'Tobias Pike': { first: 'Tobias', role: 'The victim’s nephew and heir' },
    'Dr. Celia Rourke': { first: 'Celia', role: 'The victim’s former business partner' },
  };
  // The lies a player can break in Gull Point (S; content `suspects[].lies`: topic, brokenBy, revelation; `statements.alibi` is what they said).
  // `gave` is a verbatim run of the lie's revelation. All four lies are on the topic "alibi".
  const LIES = {
    'Maeve Doyle|the bar ledger': { topic: 'alibi', said: 'I was in my office behind reception all evening, doing the accounts. I didn’t leave it until I heard the shouting.',
      gave: 'I was in the bar. He told me at supper I was finished here, after twenty years, and I wanted a drink, and then another.' },
    'Tobias Pike|the ferry notice': { topic: 'alibi', said: 'I wasn’t even here, old thing. I took the nine o’clock ferry to the mainland and only heard this morning.',
      gave: 'There was no ferry. I’ve been hiding in room twelve since the afternoon: a man from the mainland is looking for me about a debt.' },
    'Dr. Celia Rourke|a green silk scarf': { topic: 'alibi', said: 'After dinner I went to the library and read until the commotion. I never went near the east wing.',
      gave: 'I went up to the lighthouse room at ten to speak to Harlan about the hotel. Five minutes, no more.' },
    'Dr. Celia Rourke|what tobias heard': { topic: 'alibi', said: 'He was alive when I left, and I was back in the library by a quarter past.',
      gave: 'I went back up. He had forged my name on that deed, and he laughed about it.' },
  };
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const plural = (n, a, b) => n + ' ' + (n === 1 ? a : b);
  const lastWord = (s) => cap(s).split(' ').pop();

  // c = the case record (cbMake): rec[{c, act, what, out}], cast, verdict, live, total, places.
  function parse(c) {
    const seed = isSeed(c);
    const turns = (c.rec || []).filter((r) => r.c !== 'A').map((r, i) => {
      const t = { n: i + 1, code: r.c, out: r.out || '' };
      let m;
      if (r.act === 'Search' && (m = /^Searched (.+)$/.exec(r.what))) {
        t.kind = 'search'; t.place = cap(m[1]); t.short = (seed && PLACE_SHORT[m[1]]) || lastWord(m[1]);
        t.found = r.c === 'F' ? r.out.replace(/^Found /, '').split(', ') : []; t.result = r.c === 'F' ? 'found' : 'nothing';
      } else if (r.act === 'Question' && (m = /^Asked (.+?) about (.+)$/.exec(r.what))) {
        t.kind = 'question'; t.who = m[1]; t.topic = m[2]; t.result = 'asked';
      } else if (r.act === 'Show evidence' && (m = /^Showed (.+?) to (.+)$/.exec(r.what))) {
        t.kind = 'show'; t.evidence = cap(m[1]); t.who = m[2]; t.result = r.c === 'B' ? 'lie' : 'stood';
        if (r.c === 'B' && seed) t.lie = LIES[m[2] + '|' + m[1].toLowerCase()] || null;
      } else { t.kind = 'question'; t.who = ''; t.result = 'asked'; }
      const known = seed && t.who && SUSP[t.who];
      t.short = t.short || (known ? SUSP[t.who].first : (t.who || '').replace(/^(Dr|Mr|Mrs|Ms|Miss)\.?\s+/, '').split(' ')[0]);
      return t;
    });
    const a = (c.rec || []).find((r) => r.c === 'A');
    const acc = a ? { who: a.what, right: a.out === 'Right' } : null;
    const cast = (c.cast && c.cast.length ? c.cast : seed ? Object.keys(SUSP) : []);
    const suspects = cast.map((name) => {
      const mine = turns.filter((t) => t.who === name);
      const info = (seed && SUSP[name]) || {};
      const topics = mine.filter((t) => t.result === 'lie' && t.lie).map((t) => t.lie.topic);
      return { name: name, first: info.first || name.replace(/^(Dr|Mr|Mrs|Ms|Miss)\.?\s+/, '').split(' ')[0], role: info.role || '', turns: mine,
        lies: mine.filter((t) => t.result === 'lie'), stood: mine.filter((t) => t.result === 'stood').length,
        // the topic a lie was about, only when every exposed lie has a known one and they agree (seed); otherwise none is claimed
        lieTopic: topics.length && topics.length === mine.filter((t) => t.result === 'lie').length && topics.every((x) => x === topics[0]) ? topics[0] : '',
        asked: mine.filter((t) => t.kind === 'question').map((t) => t.topic), spent: mine.length, accused: !!acc && acc.who === name };
    });
    const searched = turns.filter((t) => t.kind === 'search');
    const stoodTurns = turns.filter((t) => t.result === 'stood');
    return { turns: turns, used: turns.length, acc: acc, suspects: suspects, searched: searched,
      placesTotal: c.places != null ? c.places : seed ? SEED_PLACES : null,
      lies: turns.filter((t) => t.result === 'lie'), stood: stoodTurns,
      counts: { search: searched.length, question: turns.filter((t) => t.kind === 'question').length, show: turns.filter((t) => t.kind === 'show').length } };
  }
  // The play date: the record's own, else Gull Point's seeded play date (canon dates that play Monday 5 October). Another case with no date shows none.
  const caseHead = (c) => ({
    date: c.date || (isSeed(c) ? ((window.GS_SESSIONS && window.GS_SESSIONS.casebook && window.GS_SESSIONS.casebook.date) || 'Monday 5 October') : null),
    label: 'Casebook · ' + (c.title || 'Case'),
  });
  const caseLines = (c) => (window.gsCbLines ? window.gsCbLines(c.rec) : []);
  const cardSession = (c) => Object.assign({}, c, { game: window.GS_NAME ? window.GS_NAME.casebook : 'Casebook' });

  // ---------- The night, drawn (Element = Between / Game). Shared by options 1 and 2. window.PgCbArt ----------
  // Every mark is one turn the player took (kind and result from the record lines, parsed above), flat shapes only: rectangles, polygons, a disc. Rotation and opacity are fine; no shadow, glow, dashes or grain.
  // The coral of the cover's first bar is --cover-orange. Lettering is the suspect's initial in design-system type, only under a lie.
  const h = React.createElement;
  const kindOf = (t) => (t.result === 'lie' ? 'lie' : t.result === 'stood' ? 'stood' : t.kind === 'question' ? 'question' : t.result === 'nothing' ? 'nothing' : 'search');
  const baseOf = { search: 'cream', nothing: 'creamo', question: 'lilac', stood: 'coral', lie: 'coral' };
  const turnWords = (t) => t.n + ' ' + (t.kind === 'search' ? 'searched ' + t.short : t.kind === 'question' ? 'asked ' + t.short : 'showed evidence to ' + t.short) + (t.result === 'lie' ? ', lie exposed' : t.result === 'stood' ? ', story stood' : t.result === 'found' ? ', found something' : t.result === 'nothing' ? ', found nothing' : '');
  const initial = (t) => (t.short || t.who || '').charAt(0).toUpperCase();

  // One storm lamp, 34 x 56 viewBox: bail 12, cap 34x6, glass 26x30, base 34x8. state: lit | out | broken | stood.
  const Lamp = ({ state, kind }) => {
    const base = state === 'lit' ? 'none' : baseOf[kind] || 'cream';
    let glass;
    if (state === 'broken') glass = [h('polygon', { key: 'a', className: 'cbl-shard', points: '4,18 30,18 30,26 4,38' }), h('polygon', { key: 'b', className: 'cbl-shard', points: '4,41 30,29 30,48 4,48' })];
    else glass = [h('rect', { key: 'g', className: 'cbl-glass', x: 4, y: 18, width: 26, height: 30 })];
    return h('svg', { className: 'cbl cbl-' + state + ' cbl-b-' + base, viewBox: '0 0 34 56', preserveAspectRatio: 'xMidYMax meet', 'aria-hidden': 'true', focusable: 'false' },
      h('rect', { className: 'cbl-fr', x: 7, y: 4, width: 20, height: 2 }), h('rect', { className: 'cbl-fr', x: 7, y: 6, width: 2, height: 6 }), h('rect', { className: 'cbl-fr', x: 25, y: 6, width: 2, height: 6 }),
      h('rect', { className: 'cbl-fr', x: 0, y: 12, width: 34, height: 6 }),
      glass,
      state === 'lit' ? h('polygon', { className: 'cbl-flame', points: '17,25 22,33 17,41 12,33' }) : null,
      state === 'out' || state === 'stood' ? h('rect', { className: 'cbl-wick', x: 16, y: 42, width: 2, height: 6 }) : null,
      h('rect', { className: 'cbl-base', x: base === 'creamo' ? 0.75 : 0, y: base === 'creamo' ? 48.75 : 48, width: base === 'creamo' ? 32.5 : 34, height: base === 'creamo' ? 6.5 : 8 }));
  };
  const lampState = (t) => (!t ? 'lit' : t.result === 'lie' ? 'broken' : t.result === 'stood' ? 'stood' : 'out');

  // The Between cell: a card-ground cell holding one cover bar. kind: search | nothing | question | stood | lie | spare.
  const BarCell = ({ kind }) => h('span', { className: 'cbn-cell', 'data-k': kind, 'aria-hidden': 'true' }, kind === 'spare' ? null : h('i', { className: 'cbn-bar' }));

  // The whole night, sixteen turns. element: between | game. used = turns taken; sun only when all sixteen are used.
  const Night = ({ turns, element, label }) => {
    const used = turns.length, sun = used >= 16, cells = [];
    for (let i = 0; i < 16; i++) cells.push(turns[i] || null);
    if (element === 'between') {
      return h('div', { className: 'cbn cbn-b', role: 'img', 'aria-label': label },
        cells.map((t, i) => h('div', { className: 'cbn-col', key: i },
          h('span', { className: 'cbn-track' }, i === used - 1 ? h('i', { className: 'cbn-sun' }) : null),
          h(BarCell, { kind: t ? kindOf(t) : 'spare' }),
          h('span', { className: 'cbn-ini' }, t && t.result === 'lie' ? initial(t) : ''))));
    }
    return h('div', { className: 'cbn cbn-g', role: 'img', 'aria-label': label },
      h('div', { className: 'cbn-lamps' }, cells.map((t, i) => h('div', { className: 'cbn-lamp', key: i },
        h(Lamp, { state: lampState(t), kind: t ? kindOf(t) : 'search' }),
        h('span', { className: 'cbn-ini' }, t && t.result === 'lie' ? initial(t) : '')))),
      h('div', { className: 'cbn-dawn' }, sun ? h('i', { className: 'cbn-sun-full' }) : null));
  };

  // A suspect's own turns as a small strip. element: store | between | game. Questions, evidence shown (lie or story stood); searches belong to no suspect.
  const MiniStrip = ({ turns, element, label }) => {
    if (!turns.length) return null;
    if (element === 'game') return h('div', { className: 'cbn-mini cbn-mini-g', role: 'img', 'aria-label': label }, turns.map((t, i) => h('span', { className: 'cbn-mlamp', key: i }, h(Lamp, { state: lampState(t), kind: kindOf(t) }))));
    if (element === 'between') return h('div', { className: 'cbn-mini cbn-mini-b', role: 'img', 'aria-label': label }, turns.map((t, i) => h(BarCell, { key: i, kind: kindOf(t) })));
    return h('div', { className: 'cbn-mini cbn-mini-s' }, h(Ss.Strip, { cells: turns.map((t) => ({ t: '', k: t.result === 'lie' ? 'mark1' : t.result === 'stood' ? 'hint' : 'plain' })), perRow: Math.min(turns.length, 12), label }));
  };
  const miniLabel = (s) => s.name + ': ' + s.turns.map(turnWords).join('; ');

  const ARTCSS = `
      :scope .cbn, :scope .cbn-mini { min-width: 0; --cbn-line: color-mix(in srgb, var(--cover-cream) 16%, var(--cover-bg-indigo)); --cbn-frame: color-mix(in srgb, var(--cover-cream) 55%, var(--cover-bg-indigo)); }
      :scope .cbn-ini { display: block; height: 16px; font: 600 13px/16px var(--font-text); text-align: center; color: var(--text); white-space: nowrap; }
      /* Between: cells with a cover bar, a track and a sun above */
      :scope .cbn-b { --bc: 36px; --bg: 6px; display: grid; grid-template-columns: repeat(8, minmax(0, var(--bc))); column-gap: var(--bg); row-gap: 8px; justify-content: start; }
      :scope .cbn-col { display: grid; grid-template-rows: 16px auto 16px; min-width: 0; }
      :scope .cbn-track { position: relative; height: 16px; }
      :scope .cbn-track::before { content: ""; position: absolute; left: 0; right: calc(var(--bg) * -1); top: 7px; height: 2px; background: var(--line); }
      :scope .cbn-col:nth-child(8n) .cbn-track::before { right: 0; }
      :scope .cbn-sun { position: absolute; left: 50%; top: 2px; width: 12px; height: 12px; margin-left: -6px; border-radius: 50%; background: var(--cover-amber); }
      :scope .cbn-cell { position: relative; display: block; box-sizing: border-box; width: 100%; aspect-ratio: 1; background: var(--ss-cell); border: 1px solid var(--ss-cell-line); overflow: hidden; }
      :scope .cbn-bar { position: absolute; left: 50%; width: 8px; margin-left: -4px; top: 50%; height: 20px; margin-top: -10px; background: var(--cover-cream); }
      :scope .cbn-cell[data-k="nothing"] .cbn-bar { background: transparent; border: 1.5px solid var(--cover-cream); box-sizing: border-box; }
      :scope .cbn-cell[data-k="question"] .cbn-bar { background: var(--cover-lilac); }
      :scope .cbn-cell[data-k="stood"] .cbn-bar { background: var(--cover-lilac); height: 10px; top: auto; bottom: 0; margin-top: 0; }
      :scope .cbn-cell[data-k="lie"] .cbn-bar { background: var(--cover-orange); top: 0; bottom: 0; height: auto; margin-top: 0; }
      @container ss (min-width: 680px) {
        :scope .cbn-b { --bc: 40px; --bg: 4px; grid-template-columns: repeat(16, minmax(0, var(--bc))); }
        :scope .cbn-col:nth-child(8n) .cbn-track::before { right: calc(var(--bg) * -1); }
        :scope .cbn-col:nth-child(16n) .cbn-track::before { right: 0; }
      }
      /* Game: sixteen storm lamps on the cover's indigo, a dawn line under them */
      :scope .cbn-g { background: var(--cover-bg-indigo); margin: -16px -16px 0; padding: 16px 16px 14px; display: grid; gap: 10px; }
      :scope .cbn-lamps { display: grid; grid-template-columns: repeat(8, minmax(0, 34px)); gap: 12px 7px; justify-content: start; }
      :scope .cbn-lamp { display: grid; min-width: 0; }
      :scope .cbn-lamp .cbl { width: 100%; height: auto; aspect-ratio: 34 / 56; display: block; }
      :scope .cbn-dawn { position: relative; height: 24px; }
      :scope .cbn-dawn::before { content: ""; position: absolute; left: 0; right: 0; top: 10px; height: 4px; background: var(--cover-amber); }
      :scope .cbn-sun-full { position: absolute; right: 0; top: 0; width: 24px; height: 24px; border-radius: 50%; background: var(--cover-amber); }
      @container ss (min-width: 680px) {
        :scope .cbn-lamps { grid-template-columns: repeat(16, minmax(0, 38px)); gap: 12px 6px; }
      }
      :scope .cbl .cbl-fr { fill: var(--cbn-frame); }
      :scope .cbl .cbl-glass { fill: var(--cover-cream); }
      :scope .cbl-out .cbl-glass, :scope .cbl-stood .cbl-glass { fill: var(--cbn-line); }
      :scope .cbl .cbl-shard { fill: var(--cover-orange); }
      :scope .cbl .cbl-flame { fill: var(--cover-amber); }
      :scope .cbl .cbl-wick { fill: var(--cover-cream); }
      :scope .cbl .cbl-base { fill: var(--cbn-frame); }
      :scope .cbl-b-cream .cbl-base { fill: var(--cover-cream); }
      :scope .cbl-b-lilac .cbl-base { fill: var(--cover-lilac); }
      :scope .cbl-b-coral .cbl-base { fill: var(--cover-orange); }
      :scope .cbl-b-creamo .cbl-base { fill: none; stroke: var(--cover-cream); stroke-width: 1.5; }
      /* Option 2: a suspect's own turns */
      :scope .cbn-mini { min-width: 0; }
      :scope .cbn-mini-g { display: flex; flex-wrap: wrap; gap: 6px; background: var(--cover-bg-indigo); padding: 10px; width: fit-content; max-width: 100%; box-sizing: border-box; }
      :scope .cbn-mlamp { display: block; width: 20px; }
      :scope .cbn-mlamp .cbl { width: 100%; height: auto; aspect-ratio: 34 / 56; display: block; }
      :scope .cbn-mini-b { display: flex; flex-wrap: wrap; gap: 4px; }
      :scope .cbn-mini-b .cbn-cell { width: 24px; height: 24px; aspect-ratio: auto; }
      :scope .cbn-mini-b .cbn-bar { width: 5px; margin-left: -2.5px; height: 12px; margin-top: -6px; }
      :scope .cbn-mini-b .cbn-cell[data-k="stood"] .cbn-bar { height: 6px; }
      :scope .cbn-mini-s .ss-cells { --c: 22px; gap: 4px; }
      :scope .cbn-mini-s .ss-cells-row { gap: 4px; }
  `;
  window.PgCbArt = { Lamp: Lamp, Night: Night, MiniStrip: MiniStrip, miniLabel: miniLabel, turnWords: turnWords, kindOf: kindOf, css: ARTCSS };
  window.PgCb = { parse: parse, caseHead: caseHead, caseLines: caseLines, cardSession: cardSession, plural: plural, cap: cap, isSeed: isSeed };
})();
