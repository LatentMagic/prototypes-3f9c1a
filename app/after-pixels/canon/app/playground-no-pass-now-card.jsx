// ============================================================================
// PLAYGROUND, not canon (branch candidate/no-pass-now-card-playground): the library Now card a player without the Pass sees on a
// game behind the Pass (Chain, Salvage, Common, Where), never played. The card is two halves with bullets. Two switches in the
// settings bar (app/playground.jsx): the page around it (bare, or with Streak, Achievements and history) and the divider (full, short, none). The game is the library game open:
// open it with its state, e.g. ?pg=no-pass-now-card&state=library-where-free (-chain-, -salvage-, -common-). Without ?pg= canon's own
// page shows. To remove it: delete this file and playground-no-pass-now-card.css, and their lines in main.jsx and canon.css.
// ============================================================================
import React from 'react';
import { useGs, DS, GS_NAME, gsLapsed } from './gs-data.jsx';
import { LbHead, LbRun, LbAch, lbRunOf, lbStreak } from './gs-library.jsx';
import { cprLocked } from './gs-pass-store.jsx';
import { phVisible, phAch, LbRecent } from './gs-history.jsx';
import { PZ, pzRun } from './gs-puzzles-library.jsx';
import { GS_LIBRARY } from './registry.js';
import { pgRegister, pgActive, usePgSetting } from './playground.jsx';

const PGN_IDS = ['where', 'chain', 'salvage', 'common'];
// All four games are daily (their specs), so the two lines hold no game word beyond the name in the title.
const PGN_GET = ['Play every daily edition.', 'Earn achievements and streaks.'];

// Shape 3, two halves: label and title at the top of the left half; what you get, the bullets and the button in the right.
// line: full (the card's whole height), short (only the right half's content), none.
const PgnCard = ({ id, line, onGet }) => {
  const title = GS_NAME[id] + ' comes only\u00a0with the\u00a0Pass.';
  return (
    <section className={'pgn-card pgn-half is-line-' + line} aria-label={title}>
      <div className="pgn-fill">
        <span className="pgn-label">PASS GAME</span>
        <h3 className="mcp-t-sec">{title}</h3>
      </div>
      <div className="pgn-side">
        <div className="pgn-side-in">
          <span className="pgn-label">WHAT YOU GET</span>
          <ul className="pgn-list">{PGN_GET.map((t, i) => <li key={i}>{t}</li>)}</ul>
          <div className="pgn-act"><DS.Button variant="secondary" onClick={onGet}>Get the Pass</DS.Button></div>
        </div>
      </div>
    </section>);
};

// Canon's page for a game behind the Pass that a player with the Pass would see never played (cprPzLibrary), with this card in
// the Now card's place: the Streak card, Achievements and history in their never-played state, or none of them (canon's page here).
const pgnWrap = (id, Base) => function PgnPage(props) {
  const gs = useGs(); const page = usePgSetting('page'); const line = usePgSetting('line');
  const never = cprLocked(gs, id) && !(gsLapsed(gs) && phVisible(gs).some((p) => p.gid === id));
  if (!pgActive() || !never) return <Base {...props} />;
  const c = PZ[id]; const run = pzRun(gs, id); const n = lbStreak(run); const ach = phAch(gs, id, c.ach, n);
  return (
    <main className="gs-wrap gs-main">
      <LbHead id={id} />
      <div className="lb-lay">
        <PgnCard id={id} line={line} onGet={() => gs.go('pass')} />
        {page === 'full' && <>
          <LbRun n={n} unit={c.weekly ? 'weeks' : 'days'} weeks={lbRunOf(run)} />
          <LbAch items={ach} badges={c.badges} access="all" />
          <LbRecent title={c.recent} allLabel="See in History" empty={c.recent + ' appear here once you have played one.'} />
        </>}
      </div>
    </main>);
};

export function initPlaygroundNoPassNowCard() {
  pgRegister('no-pass-now-card', { title: 'Now card without the Pass', settings: [
    { key: 'page', kind: 'concept', label: 'Page around the card', options: [{ value: 'bare', label: 'Bare, as today' }, { value: 'full', label: 'With Streak, Achievements and history' }] },
    { key: 'line', label: 'Divider', options: [{ value: 'full', label: 'Full line' }, { value: 'short', label: 'Short line' }, { value: 'none', label: 'No line' }] },
  ] });
  PGN_IDS.forEach((id) => { GS_LIBRARY[id] = pgnWrap(id, GS_LIBRARY[id]); });
}
