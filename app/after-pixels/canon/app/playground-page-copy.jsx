// ============================================================================
// PLAYGROUND, not canon (branch candidate/product-page-copy): a game's product page under three copy rules, Current (canon today),
// The job and Situation, then verbs. The rule's pitch heading, pitch paragraphs, chat captions and card line replace canon's
// while the page is open; every other line stays canon's. Above the page, the card line as it appears elsewhere: canon's game
// card and a plain link-preview box. The settings bar (app/playground.jsx) picks the rule and the game; open with ?pg=page-copy.
// To remove it: delete this file and playground-page-copy.css, and their lines in main.jsx and canon.css.
// ============================================================================
import React from 'react';
import { GS_GAMES } from './gs-data.jsx';
import { GS_PAGES, GsGamePage } from './gs-game.jsx';
import { GS_CHATS } from './gs-chats.jsx';
import { GsGameCard } from './gs-pass-home.jsx';
import { GsArt } from './gs-parts.jsx';
import { pgRegister, usePgSetting } from './playground.jsx';

// ---- The copy, as the proposal file lists it. A line left out (null, or no entry) stays canon's. `blurb: 'h'` means the
// card line is the pitch heading. A `ps` shorter than canon's drops the paragraphs past its length. ----
const PGC_COPY = {
  delve: {
    job: {
      h: 'Pick a hero and play a new adventure each week, one risky roll at a time.', blurb: 'h',
      ps: ['Each week brings a new setting, new foes and a new story. You go room by room, choosing what to search, what to fight and what to carry.',
        'Every risky move is a d20 roll the game makes, where nobody can fudge it. Run out of hit points, or let the threat fill, and the run is lost.'],
      caps: ['The run opens: the first room, its ways on, and the numbers.', 'Every risky move is a roll the game makes, not your AI.', 'Every run ends one of four ways, and your session keeps every roll.'] },
    situation: {
      h: 'A new adventure every week. Every slip brings the end closer.', blurb: 'A weekly adventure game. Pick a hero and play it room by room, on real dice.',
      ps: ['Pick a fighter, a rogue or a wizard. Go room by room, choosing what to search, fight and carry.',
        'The game rolls every die where nobody can fudge it, so a win is yours. Pick your hero.'],
      caps: ['The run opens: the first room, its ways on, and the numbers.', 'A weak hit: the foe gives ground, at a cost the game draws.', 'The ending, with a link back to your full session.'] },
  },
  mystery: {
    job: {
      h: 'Work out who did it, with what and where. You get one accusation.', blurb: 'h',
      ps: ['You get every clue at the start. Together they leave only one answer.', 'Two hints help when you’re stuck. Then make one accusation, checked part by part.'],
      caps: ['Every suspect, weapon, place and clue, given once at the start.', 'When you’re stuck, take a hint. You get two.', null] },
    situation: {
      h: null, blurb: 'A daily murder mystery. Work out who did it from the clues, then accuse.',
      caps: ['Every suspect, weapon, place and clue, given once at the start.', null, null] },
  },
  where: {
    job: {
      h: 'Find today’s country in six guesses.', blurb: 'h',
      ps: ['Name any country. The game tells you how far it lies from today’s, border to border.', 'Zero means the two touch. You get one hint: the compass direction from your last guess.'] },
    situation: { h: null, blurb: 'A daily geography puzzle. Find today’s country in six guesses.' },
  },
};

// ---- Canon's lines for the games drawn, read once before any swap, and put back whenever the rule is Current or the game changes. ----
const PGC_GAMES = ['delve', 'mystery', 'where'];
let pgcCanon = null;
const pgcRead = () => {
  if (pgcCanon) return;
  pgcCanon = {};
  PGC_GAMES.forEach((id) => { pgcCanon[id] = { h: GS_PAGES[id].pitch.h, ps: GS_PAGES[id].pitch.ps.slice(), caps: GS_CHATS[id].map((x) => x.cap), blurb: GS_GAMES[id].blurb }; });
};
const pgcApply = (id, rule) => {
  pgcRead();
  PGC_GAMES.forEach((k) => {
    const c = pgcCanon[k];
    GS_PAGES[k].pitch.h = c.h; GS_PAGES[k].pitch.ps = c.ps.slice(); GS_GAMES[k].blurb = c.blurb;
    GS_CHATS[k].forEach((x, i) => { x.cap = c.caps[i]; });
  });
  const r = PGC_COPY[id][rule]; if (!r) return;
  const c = pgcCanon[id];
  if (r.h) GS_PAGES[id].pitch.h = r.h;
  if (r.ps) GS_PAGES[id].pitch.ps = r.ps.map((p, i) => p || c.ps[i]);
  if (r.caps) GS_CHATS[id].forEach((x, i) => { x.cap = r.caps[i] || c.caps[i]; });
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
const PgcStrip = ({ id }) => (
  <section className="pgc-strip" aria-label="Where the card line also appears">
    <h2 className="pgc-strip-h">Where the card line also appears</h2>
    <div className="pgc-strip-row">
      <figure className="pgc-fig"><div className="pgc-card"><GsGameCard id={id} /></div><figcaption>The game card (More games, Discover)</figcaption></figure>
      <figure className="pgc-fig"><PgcPreview id={id} /><figcaption>A shared link’s preview</figcaption></figure>
    </div>
  </section>);

// Rendered by main.jsx in place of the routed page (its candidate hook), so the page is canon's own GsGamePage, with the strip in its `top` slot.
const PgcScreen = () => {
  const id = usePgSetting('game'); const rule = usePgSetting('rule');
  pgcApply(id, rule);
  return <GsGamePage key={id + rule} id={id} top={<PgcStrip id={id} />} />;
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
