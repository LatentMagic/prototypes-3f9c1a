// ============================================================================
// After Pixels — Common's session page body and its now card (1236). Theme: earned colour. A thread's item tiles stay grey until its
// connection is named, then take the thread's own colour from Common's cover (orange, teal, lilac); a thread not named stays grey.
// Green is for the result statement alone. Joe's picks from the 2026-11-03 rounds (business-ops common-game session-page-picks.md).
// Session page: one card on the shared session card (GsSessCard, gs-session.jsx): "Completed" top left, the board (a row of four item tiles
// per thread, its connection under them, its points at the end), and beside it (under it on a phone) the score and the five guesses.
// Every move follows, closed. Now card: the same board without words, each thread's points, the score and the guesses.
// Reads the play each Common session carries (`play`, from gs-where-chain-salvage.jsx) through cmPlay, which also writes its lines.
// Styles: app/gs-common.css.
// ============================================================================
import React from 'react';
import { useGs, GS_SESSIONS } from './gs-data.jsx';
import { GsMoves, GsSessCard } from './gs-session.jsx';
import { LbNowCard } from './gs-library.jsx';
import { edList } from './gs-history.jsx';
import { cmPlay } from './gs-where-chain-salvage.jsx';
import { GS_SESSION_BODY, GS_NOW } from './registry.js';

// ---- An item: seen (shown in play), unseen (never shown, revealed once its thread closed) or hidden (its thread still open or not reached). ----
const cmClosed = (x) => x.state === 'found' || x.state === 'passed' || x.state === 'lost';
const cmItem = (x, i) => (i < x.shown ? 'seen' : cmClosed(x) ? 'unseen' : 'hidden');
const cmTotal = (p) => p.t.reduce((a, x) => a + x.pts, 0);
const cmPoolLabel = (p) => p.pool.length + ' of 5 guesses used' + (p.pool.length ? ': ' + p.pool.map((g) => 'thread ' + (g.k + 1) + (g.right ? ' right' : ' wrong')).join(', ') : '');

// ---- The guesses: five squares in the order spent. A right guess fills with the colour of the thread it named, with a tick; a wrong one
// is grey with a cross; one not spent is an outline. ----
const CmPool = ({ p }) => (
  <div className="cm-pool" role="img" aria-label={cmPoolLabel(p)}>
    {[0, 1, 2, 3, 4].map((j) => { const g = p.pool[j];
      return <span key={j} aria-hidden="true" className={'cm-q ' + (g ? (g.right ? 'is-right th-' + g.k : 'is-wrong') : 'is-spare')}>{g ? (g.right ? '✓' : '×') : ''}</span>; })}
  </div>);

// ---- The session page. A thread's row: the four item tiles, its points at the end, its connection under the tiles. Phone (card under
// 520px): the tiles across the card, then the connection and the points on the line under them.
// KEEP: the four tiles are equal columns (minmax(0, 1fr)) in one grid, two by two under a 520px card; a long item wraps inside its
// tile and never widens it, and the tile grows past its minimum height rather than clip. ----
const CmRow = ({ x }) => (
  <div className={'cm-row is-' + x.state + ' th-' + x.k}>
    <div className="cm-tiles">{[0, 1, 2, 3].map((i) => { const st = cmItem(x, i);
      return <span key={i} className={'cm-t is-' + st}>{st === 'hidden' ? '' : x.items[i]}</span>; })}</div>
    <span className="cm-pts">{cmClosed(x) ? x.pts : ''}</span>
    {cmClosed(x) && <p className="cm-conn"><b>{x.link}</b></p>}
  </div>);
const CmScore = ({ p }) => (
  <div className="cm-score" role="img" aria-label={cmTotal(p) + ' of 15 points'}><b aria-hidden="true">{cmTotal(p)}</b><span aria-hidden="true">/ 15</span></div>);
export const CmSessBody = ({ s }) => {
  if (!s.play) return s.lines.length ? <GsMoves s={s} /> : null;
  const p = cmPlay(s.play, s.live);
  return <>
    <GsSessCard r={s.live ? { tone: 'live', word: 'In progress' } : { tone: 'ok', word: 'Completed' }} className="cm-card"
      board={<div className="cm-board">{p.t.map((x) => <CmRow key={x.k} x={x} />)}</div>}
      rows={[['Score', <CmScore p={p} />], ['Guesses', <CmPool p={p} />]]} />
    <GsMoves s={s} />
  </>;
};

// ---- The now card: the board without words (each thread's tiles and points), then the score and the guesses; beside the board on a wide
// card, under it as one centred pair on a phone. Before a play the board is all outlines and every guess spare. ----
const CmMini = ({ x }) => (
  <div className={'cmn-row is-' + x.state + ' th-' + x.k} aria-hidden="true">
    <span className="cmn-tiles">{[0, 1, 2, 3].map((i) => <span key={i} className={'cmn-t is-' + cmItem(x, i)} />)}</span>
    <span className="cmn-pts">{cmClosed(x) ? x.pts : ''}</span>
  </div>);
const cmBoardLabel = (p) => p.t.map((x) => 'thread ' + (x.k + 1) + ': ' + (x.state === 'found' ? 'named, ' + x.pts + (x.pts === 1 ? ' point' : ' points')
  : x.state === 'passed' ? 'passed' : x.state === 'lost' ? 'out of guesses' : x.state === 'open' ? 'open' : 'not reached')).join('; ');
const CmNowPic = ({ p }) => (
  <div className="cmn-pic">
    <div className="cmn-board" role="img" aria-label={cmBoardLabel(p)}>{p.t.map((x) => <CmMini key={x.k} x={x} />)}</div>
    <div className="cmn-sum">
      <div className="cmn-score" role="img" aria-label={cmTotal(p) + ' of 15 points'}><b aria-hidden="true">{cmTotal(p)}</b><span aria-hidden="true">/ 15</span></div>
      <CmPool p={p} />
    </div>
  </div>);
// Not yet played: no thread open, so nothing of today's items is drawn before Play.
const cmFresh = (play) => { const p = cmPlay({ c: play.c, m: [] }, true); return { ...p, t: p.t.map((x) => ({ ...x, shown: 0, state: 'waiting' })) }; };
const CM_NOW_RESULT ={ done: { kind: 'ok', label: 'Completed' }, live: { kind: 'live', label: 'In progress' } };
export const CmNow = ({ c, done, none, children }) => {
  const gs = useGs();
  const today = GS_SESSIONS[c.today]; if (!today || !today.play) return children;
  const title = '#' + today.number;
  if (none) return (
    <LbNowCard gid="common" title={title} play={() => gs.playReq({ kind: 'edition', e: edList(gs, 'common')[0] })} next={c.next} className="cmn">
      <CmNowPic p={cmFresh(today.play)} />
    </LbNowCard>);
  const sid = done ? c.today : c.liveSid; const s = GS_SESSIONS[sid]; if (!s || !s.play) return children;
  return (
    <LbNowCard gid="common" title={title} result={CM_NOW_RESULT[done ? 'done' : 'live']} open={() => gs.go('session', { id: sid })} next={c.next} className="cmn">
      <CmNowPic p={cmPlay(s.play, !done)} />
    </LbNowCard>);
};

export const initGsCommon = () => { GS_SESSION_BODY.common = CmSessBody; GS_NOW.common = CmNow; };
