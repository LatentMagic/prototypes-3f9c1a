// ============================================================================
// PLAYGROUND, not canon (branch candidate/product-page-copy): a game's product page under three copy rules, Current (canon today),
// The job and Situation, then verbs. The rule's pitch heading, pitch paragraphs, chat captions and card line replace canon's
// while the page is open; every other line stays canon's. Above the page, the card line as it appears elsewhere: canon's game
// card and a plain link-preview box. The settings bar (app/playground.jsx) picks the rule and the game; open with ?pg=page-copy.
// To remove it: delete this file and playground-page-copy.css, and their lines in main.jsx and canon.css.
// ============================================================================
import React from 'react';
import { GS_GAMES, DS } from './gs-data.jsx';
import { GS_PAGES, GsGamePage } from './gs-game.jsx';
import { GS_CHATS, GSC_DV_FIGHT, GSC_DV_FIGHT_CAP, gscU, gscAi } from './gs-chats.jsx';
import { GsGameCard } from './gs-pass-home.jsx';
import { GsArt } from './gs-parts.jsx';
import { pgRegister, usePgSetting } from './playground.jsx';

// ---- The copy, as the proposal file lists it. A line left out (null, or no entry) stays canon's. `blurb: 'h'` means the
// card line is the pitch heading. A `ps` shorter than canon's drops the paragraphs past its length. ----
const PGC_DELVE = {
  h: 'A new world every week: fight room by room to the villain at its heart.', blurb: 'h',
  ps: ["One week it’s a goblin warren, the next a ship adrift in space, then a neon tower or a maze out of Greek myth. Each is a handful of rooms and one villain, won or lost in about half an hour. Pick a hero who can take a blow, slip out of reach, or deal big damage before going down.", "Fight whatever stands in your way, and every miss brings the danger a step closer. Say what you try; the die decides. Once a room is clear, the choice is yours: a search might turn up healing or a clue to the villain’s weak spot, but it can cost you. Search a little longer, or push on while you still can."],
  caps: ["Each hero’s strengths, health and defence, side by side before you pick.", "A miss costs you. Spend your inspiration to try again: two dice, and the better one counts.", GSC_DV_FIGHT_CAP, "The run ends with its result, and a row of your rolls to post: green landed, red missed, a spark for a 20."],
  // The four chats, trimmed from the 2026-11-06 playtest (business-ops product-pages _resources/chats/delve-playtest-2026-11-06.md).
  // Trimmed and reformatted for the bubble; no event is changed. No edition secret appears.
  chats: [
    [gscU('hey, I want to play Delve'),
      gscAi('delve', ['Delve #5: The Labyrinth of Crete', 'Every year King Minos of Crete makes Athens send young people to him as tributes, a sort of payment. They are fed to the Minotaur, a monster half man and half bull, kept in a maze called the Labyrinth. This year you are one of them.', 'Choose your hero:'],
        null, [{ type: 'mono', text: 'Leon, the Wrestler\nBest at Strength, Toughness · 23 HP · Defence 10\nIone, the Bull-leaper\nBest at Agility, Charm · 21 HP · Defence 14\nMira, the Temple scholar\nBest at Wits, Wisdom · 17 HP · Defence 12' }]),
      gscU('I’ll go with Ione'),
      gscAi('delve', 'You are Ione, a bull-leaper. You trained to somersault over charging bulls, so you are quick and light, and very hard to hit.')],
    [gscU('I watch the walls for a bit, then dart through the gap that stays open longest'),
      gscAi('delve', 'You watch the stone slide and pick your gap. You dart for it, but it’s the wrong one. A wall swings shut and catches you across the ribs.', null, [{ type: 'mono', text: 'd20 7 +3 Agility = 10 against DC 12\nFailure · 4 damage' }]),
      gscU('ok try again, I’ll use my inspiration this time and vault through when the carved wall lines up'),
      gscAi('delve', 'The stone shudders and then stops, with a straight path laid down the hall.', null, [{ type: 'mono', text: 'd20s 1 and 15, kept 15 +3 Agility = 18 against DC 12\nSuccess · inspiration spent' }])],
    GSC_DV_FIGHT,
    [gscU('go for the somersault to finish it'),
      gscAi('delve', ['The Minotaur goes down, and this time it does not get up. The den goes quiet at last.', 'You won Delve #5. The next run opens next week.']),
      gscU('nice, share my result'),
      gscAi('delve', 'Here’s your result, ready to copy:', null, [{ type: 'mono', text: 'The Labyrinth of Crete\nIone the Bull-leaper · ✅ the Minotaur beaten · 15 rolls · longest streak 2\n🟥🟥🟩🟩🟩✨🟥🟥🟥🟩🟩🟥🟥🟩🟩' }])],
  ],
  tags: [], facts: { long: '25–45 min', often: 'New every week' }, noRun: true, genreOnly: true,
  ai: "Tells the story as your Game Master, voices everyone you meet, and never makes a choice for you.", server: "Rolls every die, yours and your enemies’, and keeps each room hidden until you walk in." };
const PGC_COPY = {
  // Delve: the golden sample, from two copywriter drafts (Opus, GPT) finished by an Opus editor: judge-delve-final.md, then
  // copywriter-delve-rewrite.md (voice-draft.md), in business-ops. One version under both rules for now. PR #1410-only:
  // caption 1's three ways to fight, caption 3's "scene of its own".
  delve: { job: PGC_DELVE, situation: PGC_DELVE },
  mystery: {
    job: {
      h: 'Work out who did it. You get one accusation.', blurb: 'h',
      ps: ['You get every clue at the start. Together they leave only one answer.', 'Two hints help when you’re stuck. Then make one accusation, checked part by part.'],
      caps: ['Every suspect, weapon, place and clue, given once at the start.', 'When you’re stuck, take a hint. You get two.', null] },
    situation: {
      h: null, blurb: 'A daily murder mystery, solved from clues.',
      caps: ['Every suspect, weapon, place and clue, given once at the start.', null, null] },
  },
  where: {
    job: {
      h: 'Find today’s country in six guesses.', blurb: 'h',
      ps: ['Name any country. The game tells you how far it lies from today’s, border to border.', 'Zero means the two touch. You get one hint: the compass direction from your last guess.'] },
    situation: { h: null, blurb: 'A daily geography puzzle. Six guesses.' },
  },
};

// ---- Canon's lines for the games drawn, read once before any swap, and put back whenever the rule is Current or the game changes. ----
const PGC_GAMES = ['delve', 'mystery', 'where'];
let pgcCanon = null;
const pgcRead = () => {
  if (pgcCanon) return;
  pgcCanon = {};
  PGC_GAMES.forEach((id) => { pgcCanon[id] = { h: GS_PAGES[id].pitch.h, ps: GS_PAGES[id].pitch.ps.slice(), caps: GS_CHATS[id].map((x) => x.cap), turns: GS_CHATS[id].map((x) => x.turns), blurb: GS_GAMES[id].blurb, tags: GS_PAGES[id].tags && GS_PAGES[id].tags.slice(), facts: { ...GS_PAGES[id].facts }, ai: GS_PAGES[id].who && GS_PAGES[id].who.ai, server: GS_PAGES[id].who && GS_PAGES[id].who.server }; });
};
const pgcApply = (id, rule) => {
  pgcRead();
  PGC_GAMES.forEach((k) => {
    const c = pgcCanon[k];
    GS_PAGES[k].pitch.h = c.h; GS_PAGES[k].pitch.ps = c.ps.slice(); GS_GAMES[k].blurb = c.blurb; if (c.tags) GS_PAGES[k].tags = c.tags.slice(); GS_PAGES[k].facts = { ...c.facts }; if (GS_PAGES[k].who) { GS_PAGES[k].who.ai = c.ai; GS_PAGES[k].who.server = c.server; }
    GS_CHATS[k].forEach((x, i) => { x.cap = c.caps[i]; x.turns = c.turns[i]; });
  });
  const r = PGC_COPY[id][rule]; if (!r) return;
  const c = pgcCanon[id];
  if (r.h) GS_PAGES[id].pitch.h = r.h;
  if (r.ps) GS_PAGES[id].pitch.ps = r.ps.map((p, i) => p || c.ps[i]);
  if (r.caps) GS_CHATS[id].forEach((x, i) => { x.cap = r.caps[i] || c.caps[i]; });
  if (r.chats) GS_CHATS[id].forEach((x, i) => { if (r.chats[i]) x.turns = r.chats[i]; });
  if (r.tags) GS_PAGES[id].tags = r.tags.slice();
  if (r.facts) GS_PAGES[id].facts = { ...GS_PAGES[id].facts, ...r.facts };
  if (r.ai) GS_PAGES[id].who.ai = r.ai;
  if (r.server) GS_PAGES[id].who.server = r.server;
  if (r.blurb) GS_GAMES[id].blurb = r.blurb === 'h' ? GS_PAGES[id].pitch.h : r.blurb;
};

// ---- Where the card line also appears: canon's game card, and a plain preview of a shared link (name, picture, one line). ----
const PgcPreview = ({ id }) => {
  const g = GS_GAMES[id];
  return (
    <div className="pgc-prev" role="img" aria-label={'Link preview: ' + g.name + '. ' + g.blurb}>
      <div className="pgc-prev-art"><GsArt art={g.art} shape="wide" /></div>
      <div className="pgc-prev-text"><span className="pgc-prev-site">afterpixels.com</span><b>{g.name}</b><span>{g.blurb}</span></div>
    </div>);
};
const PgcStrip = ({ id, rule }) => (
  <section className="pgc-strip" aria-label="Where the card line also appears">
    <PgcWhy rule={rule} />
    <h2 className="pgc-strip-h">Where the card line also appears</h2>
    <figure className="pgc-fig pgc-fig-row"><DS.CardRow className="gs-row4">{[...new Set(['barrow', id, 'escape'])].map((k) => <GsGameCard key={k} id={k} />)}</DS.CardRow><figcaption>Discover’s Just added row, as it is: the line must fit the height the row’s cards share.</figcaption></figure>
    <div className="pgc-strip-row">
      
      <figure className="pgc-fig"><PgcPreview id={id} /><figcaption>A shared link’s preview</figcaption></figure>
    </div>
  </section>);

// ---- The case for each rule, from the advisor reads in business-ops (product-pages _specs/copy-rule/_resources). ----
const PGC_WHY = {
  job: { h: 'Why the job rule (recommended)', by: 'Backed by the product advisor.', for: [
    'One line to keep true. The heading is also the card line, the link preview and what the AI reads in its library. Those must describe the game plainly, not tease it, so the heading meets that bar too, and nothing drifts.',
    'A stranger learns what they would do. Games played in your chat are new, so the line says what you do before any story.',
    'Agents can check it. Every line traces to the game spec, which holds every week.',
    'Guess already reads this way, and you found its page largely good.'],
    against: 'The heading must fit on a game card, story pages read flatter, and it ends the 6 October “cold open, with a dare” headings.' },
  situation: { h: 'Why the situation rule', by: 'Backed by the marketing advisor and Gemini.', for: [
    'The heading can hook. By the time you reach it, the page has said the name, the kind of game, the length and how often, so the heading’s job is pull.',
    'Links and the AI still get a plain line: the card line is written separately and says what you do.',
    'Story games keep their pull without selling one week’s plot. For a daily puzzle the two rules nearly meet.'],
    against: 'Two lines per game to write and keep in line, and a hook is harder for an agent to check against the spec.' },
};
const PgcWhy = ({ rule }) => {
  const w = PGC_WHY[rule]; if (!w) return null;
  return (
    <aside className="pgc-why" aria-label={w.h}>
      <h2 className="pgc-why-h">{w.h}</h2>
      <ul>{w.for.map((x) => <li key={x}>{x}</li>)}</ul>
      <p><b>Against:</b> {w.against}</p>
      <p className="pgc-why-by">{w.by} No study compares the two kinds of heading, so this is judgement, not proof.</p>
    </aside>);
};

// Rendered by main.jsx in place of the routed page (its candidate hook), so the page is canon's own GsGamePage, with the strip in its `top` slot.
const PgcScreen = () => {
  const id = usePgSetting('game'); const rule = usePgSetting('rule');
  pgcApply(id, rule);
  const r = (PGC_COPY[id] || {})[rule] || {};
  // Canon builds the cover label as category + ' · ' + rhythm inline (gs-game.jsx) and draws the "In a run" tiles inline for Delve,
  // so the genre-only label is set on the rendered cover and the tiles are hidden by a class, leaving canon untouched.
  const box = React.useRef(null);
  React.useLayoutEffect(() => {
    const el = r.genreOnly && box.current && box.current.querySelector('.gs-cover-over .gs-label');
    if (el) el.textContent = GS_GAMES[id].category;
  });
  return <div ref={box} className={r.noRun ? 'pgc-no-run' : undefined} style={{ display: 'contents' }}><GsGamePage key={id + rule} id={id} top={<PgcStrip id={id} rule={rule} />} /></div>;
};

export const initPlaygroundPageCopy = () => {
  pgRegister('page-copy', { title: 'Product page copy', settings: [
    { key: 'rule', kind: 'concept', label: 'Rule', options: [
      { value: 'current', label: 'Current' }, { value: 'job', label: 'The job' }, { value: 'situation', label: 'Situation, then verbs' }] },
    { key: 'game', label: 'Game', options: [
      { value: 'delve', label: 'Delve' }, { value: 'mystery', label: 'Accuse' }, { value: 'where', label: 'Where' }] },
  ] });
  if (new URLSearchParams(window.location.search).get('pg') === 'page-copy') window.KitCandidate = { Screen: PgcScreen };
};
