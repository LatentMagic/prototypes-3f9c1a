// ============================================================================
// After Pixels — playground: Common's item tiles without resizing text (PROTOTYPE AID, candidate branch only). Open with ?pg=common-tiles.
// Three directions for a long item at phone width, each plain CSS text flow at design-system sizes, no measuring and no resizing:
//   1 Word per line: four tiles across as picked; on a phone each word takes its own line and the tiles grow taller to hold them.
//   2 Two by two: on a phone a thread's four tiles sit two by two, each twice as wide; four across from a 520px card as picked.
//   3 List: on a phone a thread's four items are full-width bars, one under another; four across from a 520px card as picked.
// Config: the page and the play's state (finished, in progress, not finished: a day that ended unfinished, board as it stood, grey
// "Not finished", no result word), and the items drawn (the longest real items, today's No. 7, or every real item).
// Styles: app/playground-common-tiles.css.
// ============================================================================
import React from 'react';
import { pgRegister, pgActive, usePgSetting } from './playground.jsx';
import { GS_SESSIONS } from './gs-data.jsx';
import { GsMoves, GsSessCard } from './gs-session.jsx';
import { LbNowCard } from './gs-library.jsx';
import { cmPlay } from './gs-where-chain-salvage.jsx';
import { cmClosed, cmItem, cmSentence, CmPool, CmScore, CmNowPic, CM_SAY, CmNow } from './gs-common.jsx';
import { GS_SESSION_BODY, GS_NOW } from './registry.js';
import { PGCT_ITEMS } from './playground-common-tiles-items.js';

// The longest real items (by length, and the longest single words), three threads of four, with real connections from the same content.
const PGCT_LONG = [
  { items: ['A SANDWICH CUT CORNER TO CORNER', 'THE UNDERGROUND PART OF A TREE', 'SPINNING BLADES THAT COOL YOU', 'A POWER TOOL FOR MAKING HOLES'], link: 'Things shaped like a triangle' },
  { items: ['HIEROGLYPHICS', 'TOASTED MARSHMALLOWS', 'AN AFTER-SCHOOL GROUP', 'A CONVERSATION'], link: 'Things with stripes' },
  { items: ['A FOOTBALL SHIRT', 'A TIGHTROPE WALKER', 'THE MISSISSIPPI', 'RASPBERRIES AND SUGAR'], link: 'Things at the circus' }];

// An item's words. Direction 1 puts each word in its own span, so a phone stylesheet can give each a line; elsewhere they flow.
const PgctText = ({ text }) => {
  const words = cmSentence(text).split(' ');
  return <span className="pgct-tx" lang="en">{words.map((w, i) => <React.Fragment key={i}>{i ? ' ' : ''}<span className="pgct-w">{w}</span></React.Fragment>)}</span>;
};
const PgctRow = ({ x, all }) => (
  <div className={'cm-row is-' + x.state + ' th-' + x.k}>
    <div className="cm-tiles">{[0, 1, 2, 3].map((i) => { const st = cmItem(x, i);
      return <span key={i} className={'cm-t is-' + st + (i === 0 && st === 'seen' && !all ? ' is-first' : '')}>{st === 'hidden' ? '' : <PgctText text={x.items[i]} />}</span>; })}</div>
    <span className="cm-pts">{cmClosed(x) && !all ? x.pts : ''}</span>
    {!all && <p className="cm-conn">{cmClosed(x) ? <b>{x.link}</b> : <span className="cm-say">{CM_SAY[x.state]}</span>}</p>}
  </div>);

const pgctContent = (play, items) => (items === 'today' ? play.c : PGCT_LONG.map((t, k) => ({ ...play.c[k], ...t })));
// Every real item as found rows of four, each word drawn, no connection or points.
const pgctAll = () => Array.from({ length: Math.ceil(PGCT_ITEMS.length / 4) }, (_, r) =>
  ({ k: r % 3, items: PGCT_ITEMS.slice(r * 4, r * 4 + 4), state: 'found', shown: 4, pts: 0, link: '' }));

const PgctBody = ({ s }) => {
  const dir = usePgSetting('dir'); const items = usePgSetting('items');
  if (!s.play) return s.lines.length ? <GsMoves s={s} /> : null;
  const p = cmPlay({ c: pgctContent(s.play, items), m: s.play.m }, s.live);
  const r = s.unfinished ? { tone: 'none', word: 'Not finished' } : s.live ? { tone: 'live', word: 'In progress' } : { tone: 'ok', word: 'Completed' };
  const board = items === 'all'
    ? <div className={'cm-board pgct pgct-d' + dir}>{pgctAll().map((x, i) => <PgctRow key={i} x={x} all />)}</div>
    : <div className={'cm-board pgct pgct-d' + dir}>{p.t.map((x) => <PgctRow key={x.k} x={x} />)}</div>;
  return <>
    <GsSessCard r={r} className="cm-card pgct-card" board={board} rows={[['Score', <CmScore p={p} />], ['Guesses', <CmPool p={p} />]]} />
    <GsMoves s={s} />
  </>;
};

// The now card has no words, so the directions do not change it; only the state does. Not finished: the ended day's board and grey
// "Not finished" where the result sits.
const PgctNow = (props) => {
  const view = usePgSetting('view');
  if (view !== 'now-unfinished') return <CmNow {...props} />;
  const s = GS_SESSIONS['pgct-unfinished'];
  return (
    <LbNowCard gid="common" title={'#' + s.number} result={{ kind: 'over', label: 'Not finished' }} open={() => window.gsApi.go('session', { id: 'pgct-unfinished' })} next={props.c.next} className="cmn pgct-now-unf">
      <CmNowPic p={cmPlay(s.play, false)} />
    </LbNowCard>);
};

export const initPlaygroundCommonTiles = () => {
  // A day that ended before the player finished: today's in-progress play (thread 1, three items, one wrong guess), no longer live.
  GS_SESSIONS['pgct-unfinished'] = { ...GS_SESSIONS['common-live'], live: false, unfinished: true, result: 'Not finished', figures: [] };
  const toUnf = (gs) => gs.go('session', { id: 'pgct-unfinished' });
  pgRegister('common-tiles', { title: 'Common tiles', settings: [
    { key: 'dir', kind: 'concept', label: 'Direction', options: [
      { value: '1', label: '1 Word per line' }, { value: '2', label: '2 Two by two' }, { value: '3', label: '3 List' }] },
    { key: 'view', label: 'Page and state', options: [
      { value: 'session-finished', label: 'Session page · finished', state: 'session-common' },
      { value: 'session-live', label: 'Session page · in progress', state: 'session-common-in-progress' },
      { value: 'session-unfinished', label: 'Session page · not finished', state: 'session-common', go: toUnf },
      { value: 'now-finished', label: 'Now card · finished', state: 'library-common' },
      { value: 'now-live', label: 'Now card · in progress', state: 'library-common-in-progress' },
      { value: 'now-unfinished', label: 'Now card · not finished', state: 'library-common' }] },
    { key: 'items', label: 'Items', options: [
      { value: 'long', label: 'Longest real items' }, { value: 'today', label: 'Today (No. 7)' }, { value: 'all', label: 'Every real item (756)' }] },
  ] });
  if (pgActive()) { GS_SESSION_BODY.common = PgctBody; GS_NOW.common = PgctNow; }
};
