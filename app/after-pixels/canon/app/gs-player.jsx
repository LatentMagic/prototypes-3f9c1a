// ============================================================================
// After Pixels — each game's route (gpGame): the product page, with the card above it when signed in and the player can play;
// with route.page 'record', the game's library game page (GS_LIBRARY), or its editions list with route.list (gs-editions.jsx).
// The card reads "IN YOUR LIBRARY" and links "Go to your <game>"; its line is not decided yet.
// ============================================================================
import React from 'react';
import { GS_ART, useGs, DS, GS_GAMES } from './gs-data.jsx';
import { GsGamePage } from './gs-game.jsx';
import { PgeListPage } from './gs-editions.jsx';
import { GS_LIBRARY } from './registry.js';

const GpMini = ({ art, sm }) => <span className={'pg-mini' + (sm ? ' is-sm' : '')} aria-hidden="true" dangerouslySetInnerHTML={{ __html: (GS_ART[art] || {}).svg }} />;

export let GP_CFG;
let GP_LINE;
const gpToRecord = (gs, id) => gs.go(GS_GAMES[id].route, { page: 'record' });
const GpCard = ({ id }) => {
  const gs = useGs();
  const g = GS_GAMES[id];
  return (
    <section className="pg-band" aria-label="In your library">
      <GpMini art={g.art} />
      <div className="gs-stack-xs"><span className="gs-label">IN YOUR LIBRARY</span>
        <span className="gs-small">{GP_LINE[id] || 'See every ' + GP_CFG[id].units.replace(/s$/, '') + ' you’ve played and how each one ended.'}</span></div>
      <div className="pg-band-link"><DS.TextLink onClick={() => gpToRecord(gs, id)}>{'Go to your ' + g.name.replace(/^The /, '')}</DS.TextLink></div>
    </section>
  );
};
// Every game page: signed in, the card sits above the cover;
// route.page === 'record' opens that game's library game page, and with route.list (not a case page, route.sid) its editions list.
export const gpGame = (id) => () => {
  const gs = useGs();
  if (gs.view !== 'out' && gs.route.page === 'record') { const L = GS_LIBRARY[id]; return gs.route.list && !gs.route.sid ? <PgeListPage key={id} gid={id} /> : <L />; }
  // The card shows only where the player can play: part of the game is free (free, first), or the Pass. A lapsed Pass is view 'free'.
  const canPlay = gs.view === 'pass' || !!(GS_GAMES[id].free || GS_GAMES[id].first);
  return <GsGamePage id={id} top={gs.view !== 'out' && canPlay ? <GpCard id={id} /> : null} />;
};

export let GsDelve;
export let GsWord;
export let GsGroups;
export let GsMystery;
export let GsWhere;
export let GsChain;
export let GsSalvage;
export let GsEscape;
export let GsCasebook;
export let GsHunter;
export let GsBarrow;

// Load-time code, run by main.jsx in index.html's old tag order.
export function initGsPlayer() {
// Per game: the unit you play, named in the card's default line.
GP_CFG = { delve: { units: 'runs' }, word: { units: 'words' }, groups: { units: 'groups' }, mystery: { units: 'cases' }, where: { units: 'countries' }, chain: { units: 'chains' },
  salvage: { units: 'seas' }, escape: { units: 'rooms' }, casebook: { units: 'cases' }, hunter: { units: 'days' } };
// Card lines. Delve uses the default line.
GP_LINE = {
  word: 'See every day’s word and how many guesses it took you.', groups: 'See every day’s groups and how many mistakes you made.',
  mystery: 'See every case you closed and every one that got away.',
  where: 'See every day’s country and how many guesses it took you.', chain: 'See every day’s chain and how many wrong guesses you made.',
  salvage: 'See every day’s sea and how many dives it took you.', escape: 'See every room you got out of, with your time against par, hints and wrong tries.',
  casebook: 'See every case you’ve worked and the lies you caught.', hunter: 'See every day you’ve explored, what you learned and who you met.',
  delve: 'See every week’s run you’ve played and how each one ended.',
  barrow: 'See every chapter you’ve played and how each one ended.' };
GsDelve = gpGame('delve');
GsWord = gpGame('word');
GsGroups = gpGame('groups');
GsMystery = gpGame('mystery');
GsWhere = gpGame('where');
GsChain = gpGame('chain');
GsSalvage = gpGame('salvage');
GsEscape = gpGame('escape');
GsCasebook = gpGame('casebook');
GsHunter = gpGame('hunter');
GsBarrow = gpGame('barrow');
}
