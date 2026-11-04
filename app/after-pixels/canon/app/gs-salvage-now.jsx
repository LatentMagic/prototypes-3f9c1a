// ============================================================================
// After Pixels — Salvage's now card on its library game page, on the shared frame (LbNowCard) as Guess's, Where's and Chain's are.
// The picture: the five wrecks as hulls in a row (a raised wreck a solid pill, a wreck not yet raised a dashed one that fills as
// its squares are hit), under them one line of the dives used and the three tools. Drawn from the same plays as the session page
// (gs-salvage.jsx). PzNow (gs-pass-library.jsx) shows it for Salvage. Styles: app/gs-salvage-now.css.
// ============================================================================
import React from 'react';
import { useGs, GS_SESSIONS } from './gs-data.jsx';
import { LbNowCard } from './gs-library.jsx';
import { edList } from './gs-history.jsx';
import { SLV_WRECKS, SLV_DIVES, SLV_ALL, SLV_PLAYS, SLV_RESULT, SLV_ST, ICON } from './gs-salvage.jsx';

// A hull in ninths of a square, as the session page draws one (the pill inset 1/9 each side), so it is never stretched: raised solid,
// otherwise dashed with a disc for each square already hit, filled from the left.
const SvnHull = ({ w, p }) => {
  const up = w.every((s) => p.hit.has(s)); const n = w.length; const L = 9 * n - 2;
  return (
    <svg className={'svn-hull ' + (up ? 'is-raised' : 'is-open')} style={{ '--n': n }} viewBox={'0 0 ' + L + ' 7'} aria-hidden="true">
      {up
        ? <rect x="0" y="0" width={L} height="7" rx="3.5" />
        : <>
          <rect className="svn-dash" x=".3" y=".3" width={L - .6} height="6.4" rx="3.2" strokeDasharray="1.1 .9" />
          {/* KEEP: hits fill from the left as a count, not at the square that was hit (the card says how much of a wreck is found, not where). */}
          {w.filter((s) => p.hit.has(s)).map((s, i) => <circle key={s} cx={9 * i + 3.5} cy="3.5" r="2.4" />)}
        </>}
    </svg>);
};

const SvnTools = ({ p }) => (
  <ul className="svn-tools" aria-hidden="true">{SLV_ALL.map((k) => (
    <li key={k} className={'slv-tool t-' + k + (p.tools[k] ? ' is-used' : '')}>
      <span className="slv-bx"><svg viewBox="0 0 24 24" aria-hidden="true" {...SLV_ST}>{ICON[k]}</svg></span>
    </li>))}</ul>);

const SvnPic = ({ p }) => {
  const raised = SLV_WRECKS.filter((w) => w.every((s) => p.hit.has(s))).length;
  const used = SLV_ALL.filter((k) => p.tools[k]).length;
  return (
    <div className="svn-pic" role="img" aria-label={raised + ' of 5 wrecks raised, ' + p.dives + ' of ' + SLV_DIVES + ' dives, ' + used + ' of 3 tools used'}>
      <div className="svn-fleet">{SLV_WRECKS.map((w) => <SvnHull key={w[0]} w={w} p={p} />)}</div>
      <div className="svn-line">
        <span className="svn-dives" aria-hidden="true"><b>{p.dives}</b>{'/' + SLV_DIVES + ' dives'}</span>
        <SvnTools p={p} />
      </div>
    </div>);
};

// Not yet played: the five hulls empty, nothing used.
const SVN_FRESH = { hit: new Set(), tools: {}, dives: 0 };

export const SvNow = ({ c, done, none }) => {
  const gs = useGs();
  const title = '#' + GS_SESSIONS[c.today].number;
  if (none) return (
    <LbNowCard gid="salvage" title={title} play={() => gs.playReq({ kind: 'edition', e: edList(gs, 'salvage')[0] })} next={c.next} className="svn">
      <SvnPic p={SVN_FRESH} />
    </LbNowCard>);
  const sid = done ? c.today : c.liveSid;
  const s = GS_SESSIONS[sid]; const p = SLV_PLAYS[s.fx]; const r = SLV_RESULT[p.state];
  return (
    <LbNowCard gid="salvage" title={title} result={{ kind: r.tone, label: r.word }} open={() => gs.go('session', { id: sid })} next={c.next} className="svn">
      <SvnPic p={p} />
    </LbNowCard>);
};
