// ============================================================================
// PLAYGROUND, not canon (branch candidate/delve-free-now-card): the Now card a free player sees on Delve's library page after the
// free run (state library-delve-no-pass, Config → This edition not Not played), and the card before it. Two settings: the moment
// (Config popover; after the free run is the default, before has one version) and, for after, the version in the bar (3 first, then
// 1, 2, 4, and today's card). Open it at ?pg=delve-free-now-card&state=library-delve-no-pass&version=3 (or &moment=before).
// Without ?pg= canon's own cards show.
// Hook: CprFirst (app/gs-pass-library.jsx) hands this component to GS_NOW.delve with the default card as its child, for the free
// run's card after it and, with `before`, before it.
// To remove it: delete this file and playground-delve-free-now-card.css, their lines in main.jsx and canon.css, the GS_NOW.delve lines in
// CprFirst (app/gs-pass-library.jsx), and the `export` keywords this playground added in app/gs-delve.jsx: dlBuild, dlWord, DL_HEX, DlStopHead, useDlNowCols.
// ============================================================================
import React from 'react';
import { useGs, DS, GS_SESSIONS, gsEdPick, gsLiveSid } from './gs-data.jsx';
import { LbResult, CprPassEnd, LbNowCard } from './gs-library.jsx';
import { dlBuild, dlWord, DlStopHead, useDlNowCols, DL_HEX } from './gs-delve.jsx';
import { GS_NOW } from './registry.js';
import { pgRegister, pgActive, usePgSetting } from './playground.jsx';

// Not in canon's data: the Pass's two reasons, as the never-played card lists them (the first reworded for a weekly game).
const PGD_GET = ['Play every weekly run.', 'Earn achievements and streaks.'];
const PGD_PLAIN = 'Your free run is done.';

// The finished run's result word and tone, as Delve's own now card draws them (DlNow, app/gs-delve.jsx): the run follows Config → This edition.
const pgdResult = (wk, gs, sids) => { const m = dlBuild(GS_SESSIONS[wk.end ? gsEdPick('delve', gs) || sids[0] : gsLiveSid(sids[1], gs)]);
  return m.end === 'live' ? { kind: 'live', label: 'In progress' } : { kind: m.end === 'won' ? 'ok' : 'bad', label: dlWord(m) }; };

// Two halves, a short divider. Left: the chip (the card's label) and a plain title, or the run's own name and result.
// Right: the Pass line, WHAT YOU GET bullets in versions 3 and 4, and the Get the Pass button.
const PgdCard = ({ s, label, sids, before, title: t0, play, children }) => {
  const gs = useGs(); const v = usePgSetting('version'); const moment = usePgSetting('moment');
  if (!pgdActive() || (moment === 'before') !== !!before) return children;
  if (before) return <PgdBefore label={label} title={t0} play={play} />;
  if (v === 'today') return children;
  const result = pgdResult(s, gs, sids);
  const run = v === '2' || v === '3'; const bullets = v === '3' || v === '4';
  const title = run ? s.title : PGD_PLAIN;
  return (
    <section className="lb-card pgd-card" aria-label={run ? s.title + ', ' + result.label : PGD_PLAIN}>
      <div className="pgd-fill">
        <span className="gs-label">{label}</span>
        <h3 className="mcp-t-sec">{title}</h3>
        {run && <p><LbResult s={result} /></p>}
      </div>
      <div className="pgd-side">
        <div className="pgd-side-in">
          <CprPassEnd text="Keep playing with the Pass." />
          {bullets && <>
            <span className="gs-label pgd-get">WHAT YOU GET</span>
            <ul className="pgd-list">{PGD_GET.map((t, i) => <li key={i}>{t}</li>)}</ul>
          </>}
          <div className="pgd-act"><DS.Button variant="secondary" onClick={() => gs.go('pass')}>Get the Pass</DS.Button></div>
        </div>
      </div>
    </section>);
};

// ---- Before the free run: Delve's own not-started card (the run's rooms drawn empty, Play), labelled THE FIRST RUN · FREE, with the
// Pass line where the next-run line goes. Drawn as concept B of the delve-empty playground (prototypes candidate/delve-fight,
// app/playground-delve-empty.jsx and .css; not merged), copied here in the parts this card needs. Five rooms, as that playground draws them. ----
const PGD_ROOMS = 5;
const PgdHex = () => (<svg className="pgd-hex" viewBox="-5 -5 46 50" aria-hidden="true"><polygon points={DL_HEX} /></svg>);
const PgdRooms = () => { const [ref, cols] = useDlNowCols(PGD_ROOMS);
  return (<div className="dl-now-route"><div className="dl-now-stops" ref={ref} style={{ '--dl-cols': cols }} aria-label="Rooms not yet reached">{Array.from({ length: PGD_ROOMS }, (_, i) => {
    const edge = (i % cols === 0 ? ' is-row-start' : '') + (i % cols === cols - 1 || i === PGD_ROOMS - 1 ? ' is-row-end' : '');
    return (<div key={i} className={'dl-now-stop pgd-far' + edge}><DlStopHead st={{ num: i + 1, name: i === 0 ? 'First room' : 'Not yet reached', back: false }} /><PgdHex /></div>); })}</div></div>); };
const PgdBefore = ({ label, title, play }) => (
  <LbNowCard gid="delve" className="dl-now pgd-now" label={label} title={title} play={play} pass>
    <PgdRooms />
  </LbNowCard>);

const PGD_ID = 'delve-free-now-card';
const pgdActive = () => new URLSearchParams(window.location.search).get('pg') === PGD_ID && !!pgActive();

export function initPlaygroundDelveFreeNowCard() {
  pgRegister(PGD_ID, { title: 'Delve free Now card', settings: [
    { key: 'moment', label: 'Moment', options: [
      { value: 'after', label: 'After the free run', state: 'library-delve-no-pass', go: (api) => api.setReview({ today: 'played', week: 'done', begun: false, ed: null }) },
      { value: 'before', label: 'Before the free run', state: 'library-delve-no-pass', go: (api) => api.setReview({ today: 'none', week: 'done', begun: false, ed: null }) },
    ] },
    { key: 'version', kind: 'concept', label: 'Version', when: { key: 'moment', value: 'after' }, options: [
      { value: '3', label: '3 · Your run + what you get' },
      { value: '1', label: '1 · Plain' },
      { value: '2', label: '2 · Your run' },
      { value: '4', label: '4 · Plain + what you get' },
      { value: 'today', label: 'Today’s card' },
    ] },
  ] });
  if (pgdActive()) GS_NOW.delve = PgdCard; // only under ?pg=delve-free-now-card, so PzNow and CprFirst leave canon untouched without it
}
