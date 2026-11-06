// ============================================================================
// After Pixels — Accuse's now card on its library game page (1236), on the shared frame (LbNowCard) as Guess's, Chain's and Salvage's
// are. The picture is the session page's panel in small (gs-accuse.jsx): the Hints card beside the culprit's case card, in progress
// "Case open" over blank lines, finished "Case closed" or "Case cold" with the culprit. PzNow (gs-pass-library.jsx) shows it for
// Accuse. Styles: app/gs-accuse-now.css.
// ============================================================================
import React from 'react';
import { useGs, GS_SESSIONS } from './gs-data.jsx';
import { LbNowCard } from './gs-library.jsx';
import { edList } from './gs-history.jsx';
import { AccHintsCard, AccCulprit, accWithWhere, accResult } from './gs-accuse.jsx';

const AcnPic = ({ no, p }) => (
  <div className="acn-pic" role="img"
    aria-label={'Case ' + no + ', ' + accResult(p).word.toLowerCase() + ', ' + p.hints + ' of 2 hints.' + (p.live ? '' : ' The culprit: ' + p.cs.truth[0] + ', ' + accWithWhere(p.cs))}>
    <div className="acn-pair" aria-hidden="true">
      <div className="acn-col"><span className="gs-sc-cap">Hints</span><AccHintsCard p={p} /></div>
      <div className="acn-col"><span className="gs-sc-cap">The culprit</span><AccCulprit p={p} /></div>
    </div>
  </div>);

// Not yet played: the case open, no hints taken.
const ACN_FRESH = { hints: 0, live: true, right: false };

export const AcNow = ({ c, done, none }) => {
  const gs = useGs();
  const no = GS_SESSIONS[c.today].number; const title = '#' + no;
  if (none) return (
    <LbNowCard gid="mystery" title={title} play={() => gs.playReq({ kind: 'edition', e: edList(gs, 'mystery')[0] })} next={c.next} className="acn">
      <AcnPic no={no} p={ACN_FRESH} />
    </LbNowCard>);
  const sid = done ? c.today : c.liveSid;
  const s = GS_SESSIONS[sid]; const p = s.acc; const r = accResult(p);
  return (
    <LbNowCard gid="mystery" title={title} result={{ kind: r.tone, label: r.word }} open={() => gs.go('session', { id: sid })} next={c.next} className="acn">
      <AcnPic no={no} p={p} />
    </LbNowCard>);
};
