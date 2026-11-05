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
import { GS_CHATS } from './gs-chats.jsx';
import { GsGameCard } from './gs-pass-home.jsx';
import { GsArt } from './gs-parts.jsx';
import { pgRegister, usePgSetting } from './playground.jsx';

// ---- The copy, as the proposal file lists it. A line left out (null, or no entry) stays canon's. `blurb: 'h'` means the
// card line is the pitch heading. A `ps` shorter than canon's drops the paragraphs past its length. ----
const PGC_COPY = {
  // Delve: the golden sample (advisor-delve-golden-sample.md, then the Opus and Gemini reviews beside it, in business-ops).
  // Same pitch, captions, roles and tags under both rules; only the heading and card line differ. "One sure blow" and the
  // ending told as a scene depend on open PR #1410.
  delve: {
    job: {
      h: 'Pick a hero and fight your way to this week’s final foe, on dice your AI can’t touch.', blurb: 'h',
      ps: ["Each week, Delve sends you somewhere new: a colony ship drifting off course, a megacorp’s tower by night, the maze where the Minotaur sleeps. Pick your hero and go room by room, never sure what waits behind the next door. Your AI runs it like a tabletop game master: it sets each scene and plays everyone you meet, and what your hero does is always yours to say.", "The game, not your AI, rolls every die and keeps the map’s secrets, so a bad roll stays bad and every miss lets the danger close in. Read the clues, find what the final foe fears, and choose when to spend your one sure blow. Win, and you earned it."],
      caps: ["Your hero’s first room: what you see, the ways on, and your call where to go.", "The game rolls in plain sight. Your AI tells you what happened, but can’t change the roll.", "Win or fall, your ending is told as its own scene, and every roll is saved to your session page."],
      tags: ['Solo RPG', 'One run a week'], ai: "Tells the story in each world’s own voice and plays everyone you meet. It asks what you do, and acts only on what you say.", server: "Hides each room until you walk in and each foe’s weakness until you find its clue. Rolls every die, and records every roll." },
    situation: {
      h: 'Your AI tells the story. It can’t touch the dice.', blurb: 'A new half-hour adventure each week. Pick a hero and fight to the final foe.',
      ps: ["Each week, Delve sends you somewhere new: a colony ship drifting off course, a megacorp’s tower by night, the maze where the Minotaur sleeps. Pick your hero and go room by room, never sure what waits behind the next door. Your AI runs it like a tabletop game master: it sets each scene and plays everyone you meet, and what your hero does is always yours to say.", "The game, not your AI, rolls every die and keeps the map’s secrets, so a bad roll stays bad and every miss lets the danger close in. Read the clues, find what the final foe fears, and choose when to spend your one sure blow. Win, and you earned it."],
      caps: ["Your hero’s first room: what you see, the ways on, and your call where to go.", "The game rolls in plain sight. Your AI tells you what happened, but can’t change the roll.", "Win or fall, your ending is told as its own scene, and every roll is saved to your session page."],
      tags: ['Solo RPG', 'One run a week'], ai: "Tells the story in each world’s own voice and plays everyone you meet. It asks what you do, and acts only on what you say.", server: "Hides each room until you walk in and each foe’s weakness until you find its clue. Rolls every die, and records every roll." },
  },
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
  PGC_GAMES.forEach((id) => { pgcCanon[id] = { h: GS_PAGES[id].pitch.h, ps: GS_PAGES[id].pitch.ps.slice(), caps: GS_CHATS[id].map((x) => x.cap), blurb: GS_GAMES[id].blurb, tags: GS_PAGES[id].tags && GS_PAGES[id].tags.slice(), ai: GS_PAGES[id].who && GS_PAGES[id].who.ai, server: GS_PAGES[id].who && GS_PAGES[id].who.server }; });
};
const pgcApply = (id, rule) => {
  pgcRead();
  PGC_GAMES.forEach((k) => {
    const c = pgcCanon[k];
    GS_PAGES[k].pitch.h = c.h; GS_PAGES[k].pitch.ps = c.ps.slice(); GS_GAMES[k].blurb = c.blurb; if (c.tags) GS_PAGES[k].tags = c.tags.slice(); if (GS_PAGES[k].who) { GS_PAGES[k].who.ai = c.ai; GS_PAGES[k].who.server = c.server; }
    GS_CHATS[k].forEach((x, i) => { x.cap = c.caps[i]; });
  });
  const r = PGC_COPY[id][rule]; if (!r) return;
  const c = pgcCanon[id];
  if (r.h) GS_PAGES[id].pitch.h = r.h;
  if (r.ps) GS_PAGES[id].pitch.ps = r.ps.map((p, i) => p || c.ps[i]);
  if (r.caps) GS_CHATS[id].forEach((x, i) => { x.cap = r.caps[i] || c.caps[i]; });
  if (r.tags) GS_PAGES[id].tags = r.tags.slice();
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
  return <GsGamePage key={id + rule} id={id} top={<PgcStrip id={id} rule={rule} />} />;
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
