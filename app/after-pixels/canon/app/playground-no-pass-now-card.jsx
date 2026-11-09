// ============================================================================
// PLAYGROUND, not canon (branch candidate/no-pass-now-card-playground): the library Now card a player without the Pass sees on a
// game behind the Pass (Chain, Salvage, Common, Where), never played. Two switches in the settings bar (app/playground.jsx): the shape
// (3 two halves, 5 slim row) and what you get (a sentence, bullets, bullets with icons). The game is the library game open:
// open it with its state, e.g. ?pg=no-pass-now-card&state=library-where-free (-chain-, -salvage-, -common-). Without ?pg= canon's own
// page shows. To remove it: delete this file and playground-no-pass-now-card.css, and their lines in main.jsx and canon.css.
// ============================================================================
import React from 'react';
import { useGs, DS, GS_NAME, gsLapsed } from './gs-data.jsx';
import { LbHead } from './gs-library.jsx';
import { cprLocked } from './gs-pass-store.jsx';
import { phVisible } from './gs-history.jsx';
import { GS_LIBRARY } from './registry.js';
import { pgRegister, pgActive, usePgSetting } from './playground.jsx';

const PGN_IDS = ['where', 'chain', 'salvage', 'common'];
// All four games are daily (their specs), so the two lines hold no game word beyond the name in the title.
const PGN_GET = ['Play every daily edition.', 'Earn achievements and streaks.'];
// The design system has no calendar or trophy icon: the nearest in its set are list (the editions) and check (earned).
const PGN_ICONS = ['list', 'check'];

const PgnGet = ({ mode }) => {
  if (mode === 'sentence') return <p className="pgn-sentence">Play every daily edition and earn achievements and streaks.</p>;
  if (mode === 'icons') return (
    <ul className="pgn-list is-icons">
      {PGN_GET.map((t, i) => <li key={i}><span className="pgn-ic"><DS.Icon name={PGN_ICONS[i]} size={20} /></span>{t}</li>)}
    </ul>);
  return <ul className="pgn-list">{PGN_GET.map((t, i) => <li key={i}>{t}</li>)}</ul>;
};

const PgnCard = ({ id, shape, get, onGet }) => {
  const title = GS_NAME[id] + ' comes only with the Pass.';
  const button = <DS.Button variant="secondary" onClick={onGet}>Get the Pass</DS.Button>;
  if (shape === 'slim') return (
    <section className="pgn-card pgn-slim" aria-label={title}>
      <div className="pgn-main">
        <span className="pgn-label">PASS GAME</span>
        <h3 className="mcp-t-sec">{title}</h3>
        <PgnGet mode={get} />
      </div>
      <div className="pgn-act">{button}</div>
    </section>);
  return (
    <section className="pgn-card pgn-half" aria-label={title}>
      <div className="pgn-fill">
        <span className="pgn-label">PASS GAME</span>
        <h3 className="mcp-t-sec">{title}</h3>
      </div>
      <div className="pgn-side">
        <span className="pgn-label">WHAT YOU GET</span>
        <PgnGet mode={get} />
        <div className="pgn-act">{button}</div>
      </div>
    </section>);
};

// Canon's never-played page for a game behind the Pass (cprPzLibrary), with the card swapped; any other view is canon's own.
const pgnWrap = (id, Base) => function PgnPage(props) {
  const gs = useGs(); const shape = usePgSetting('shape'); const get = usePgSetting('get');
  const never = cprLocked(gs, id) && !(gsLapsed(gs) && phVisible(gs).some((p) => p.gid === id));
  if (!pgActive() || !never) return <Base {...props} />;
  return (
    <main className="gs-wrap gs-main">
      <LbHead id={id} />
      <div className="lb-lay"><PgnCard id={id} shape={shape} get={get} onGet={() => gs.go('pass')} /></div>
    </main>);
};

export function initPlaygroundNoPassNowCard() {
  pgRegister('no-pass-now-card', { title: 'Now card without the Pass', settings: [
    { key: 'shape', kind: 'concept', label: 'Shape', options: [{ value: 'half', label: '3 · two halves' }, { value: 'slim', label: '5 · slim row' }] },
    { key: 'get', label: 'What you get', options: [{ value: 'sentence', label: 'Sentence' }, { value: 'bullets', label: 'Bullets' }, { value: 'icons', label: 'Bullets with icons' }] },
  ] });
  PGN_IDS.forEach((id) => { GS_LIBRARY[id] = pgnWrap(id, GS_LIBRARY[id]); });
}
