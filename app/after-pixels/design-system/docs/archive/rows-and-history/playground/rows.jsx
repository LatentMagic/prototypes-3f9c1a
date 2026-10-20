// Rows proposal: seed, the product's rows as they render today (Before), the proposed rows (After), and the scaled frame.
const DSX = window.MCPGameStoreDesignSystem_ef1abd;
const { Icon, Tag, TextLink, SearchField, Button } = DSX;

// ---- Frame: renders children at a fixed design width, scaled down to fit ----
function Frame({ w, label, children, grow }) {
  const outer = React.useRef(null); const inner = React.useRef(null);
  const [s, setS] = React.useState(1); const [h, setH] = React.useState(0);
  React.useLayoutEffect(() => {
    const fit = () => { const sc = Math.min(1, outer.current.clientWidth / w); setS(sc); setH(inner.current.offsetHeight * sc); };
    fit(); const ro = new ResizeObserver(fit); ro.observe(outer.current); ro.observe(inner.current);
    return () => ro.disconnect();
  }, [w]);
  return (
    <figure className={'fr' + (grow ? ' is-grow' : '')} style={{ flexBasis: grow ? 600 : w }}>
      <figcaption className="fr-cap">{label}{s < 1 && <span className="fr-scale">{' · shown at ' + Math.round(s * 100) + '%'}</span>}</figcaption>
      <div ref={outer} className="fr-box" style={{ height: h }}>
        <div ref={inner} style={{ width: w, transform: 'scale(' + s + ')', transformOrigin: '0 0' }}>{children}</div>
      </div>
    </figure>
  );
}

// ---- Seed ----
const G = {
  word: { name: 'Daily Word', bg: 'wine', ink: 'amber', sh: 'sq' },
  groups: { name: 'Daily Groups', bg: 'forest', ink: 'teal', sh: 'sq4' },
  mystery: { name: 'Daily Mystery', bg: 'indigo', ink: 'orange', sh: 'ci' },
  escape: { name: 'Escape', bg: 'forest', ink: 'amber', sh: 'door' },
  casebook: { name: 'Casebook', bg: 'indigo', ink: 'amber', sh: 'bars' },
  delve: { name: 'Delve', bg: 'wine', ink: 'lilac', sh: 'door' },
};
const Cov = ({ gid, cls }) => {
  const g = G[gid]; const f = { fill: 'var(--cover-' + g.ink + ')' };
  const shape = g.sh === 'ci' ? <circle cx="24" cy="18" r="10" style={f} />
    : g.sh === 'door' ? <rect x="18" y="8" width="12" height="28" style={f} />
    : g.sh === 'bars' ? <><rect x="12" y="14" width="6" height="22" style={f} /><rect x="22" y="8" width="6" height="28" style={f} /><rect x="32" y="18" width="6" height="18" style={f} /></>
    : g.sh === 'sq4' ? <><rect x="12" y="8" width="10" height="10" style={f} /><rect x="26" y="8" width="10" height="10" style={{ fill: 'var(--cover-cream)' }} /><rect x="12" y="20" width="10" height="10" style={{ fill: 'var(--cover-cream)' }} /><rect x="26" y="20" width="10" height="10" style={f} /></>
    : <rect x="16" y="10" width="16" height="16" style={f} />;
  return <span className={cls} aria-hidden="true"><svg viewBox="0 0 48 36"><rect width="48" height="36" style={{ fill: 'var(--cover-bg-' + g.bg + ')' }} />{shape}</svg></span>;
};
// A play: gid, ed (number for the dailies, a title otherwise), short (the list's word today), full (the record's result), k (ok|bad|none), t, again
const P = (gid, ed, k, short, full, t, again) => ({ gid, ed, k, short, full, t, again: !!again });
const PLAYED = [
  ['Today', [
    P('word', 212, 'ok', 'Solved', 'Solved in 2 of 6', '21:15', 1),
    P('casebook', 'The Gull Point Lighthouse', 'ok', 'Solved', 'Solved', '20:24'),
    P('word', 212, 'ok', 'Solved', 'Solved in 1 of 6', '12:40', 1),
    P('mystery', 64, 'bad', 'Missed', 'Missed', '10:27'),
    P('groups', 88, 'ok', 'Solved', 'All 4 groups, 1 mistake', '09:16'),
    P('word', 212, 'ok', 'Solved', 'Solved in 3 of 6', '08:05'),
  ]],
  ['Yesterday', [
    P('escape', 'The Locked Study', 'ok', 'Escaped', 'Escaped in 5 moves', '19:30', 1),
    P('delve', 'The Drowned Stair', 'bad', 'Hero fell', 'Hero fell', '18:30'),
    P('mystery', 63, 'ok', 'Solved', 'Solved', '14:02'),
    P('groups', 87, 'bad', 'Missed', '2 of 4 groups', '09:41'),
    P('escape', 'The Locked Study', 'ok', 'Escaped', 'Escaped in 7 moves', '08:12'),
    P('word', 211, 'bad', 'Missed', 'Missed', '07:22'),
  ]],
];
// Every edition: [heading, [{ gid, n, title?, latest, k, short, full, reps: [[date, t, k, short, full]] }]]
const E = (gid, n, title, latest, k, short, full, reps) => ({ gid, n, title, latest, k, short, full, reps: reps || [] });
const EDITIONS = [
  ['Today', [
    E('word', 212, null, 1, 'ok', 'Solved', 'Solved in 3 of 6', [['6 October', '12:40', 'ok', 'Solved', 'Solved in 1 of 6'], ['6 October', '21:15', 'ok', 'Solved', 'Solved in 2 of 6']]),
    E('groups', 88, null, 1, 'ok', 'Solved', 'All 4 groups, 1 mistake'),
    E('mystery', 64, null, 1, 'bad', 'Missed', 'Missed'),
  ]],
  ['Yesterday', [
    E('word', 211, null, 0, 'bad', 'Missed', 'Missed'),
    E('groups', 87, null, 0, 'bad', 'Missed', '2 of 4 groups'),
    E('mystery', 63, null, 0, 'ok', 'Solved', 'Solved'),
    E('escape', 4, 'The Locked Study', 1, 'ok', 'Escaped', 'Escaped in 7 moves', [['5 October', '19:30', 'ok', 'Escaped', 'Escaped in 5 moves']]),
    E('casebook', 45, 'The Gull Point Lighthouse', 1, 'ok', 'Solved', 'Solved'),
  ]],
  ['Sunday 4 October', [
    E('word', 210, null, 0, 'none', 'Not played', 'Not played'),
    E('groups', 86, null, 0, 'ok', 'Solved', 'All 4 groups, no mistakes'),
    E('mystery', 62, null, 0, 'none', 'Not played', 'Not played'),
  ]],
];
// The Daily Word library page's plays: one entry per edition, its plays first play first. [n, date, [[k, short, full, again]]]
const WORD_PLAYS = [
  [212, '6 Oct', [['ok', 'Solved', 'Solved in 3 of 6'], ['ok', 'Solved', 'Solved in 1 of 6', 1], ['ok', 'Solved', 'Solved in 2 of 6', 1]]],
  [211, '5 Oct', [['bad', 'Missed', 'Missed']]],
  [209, '3 Oct', [['ok', 'Solved', 'Solved in 4 of 6']]],
  [208, '2 Oct', [['ok', 'Solved', 'Solved in 5 of 6'], ['ok', 'Solved', 'Solved in 3 of 6', 1]]],
  [206, '30 Sep', [['ok', 'Solved', 'Solved in 3 of 6']]],
  [205, '29 Sep', [['bad', 'Missed', 'Missed']]],
];
const isPz = (gid) => ['word', 'groups', 'mystery'].includes(gid);

// ---- Before: the product's markup (gs-history.jsx RpRow, the Every edition row, LbRecent) ----
const LbChev = () => <Icon name="back" size={16} className="lb-chev" style={{ transform: 'rotate(180deg)' }} />;
const ico = (k) => (k === 'ok' ? 'check' : k === 'bad' ? 'error' : null);
const RpSt = ({ k, l }) => <span className={'rp-st is-' + k}><span className="rp-ico">{ico(k) && <Icon name={ico(k)} size={14} />}</span><span className="rp-sl">{l}</span></span>;
const PhSt = ({ k, l }) => <span className={'lb-st is-' + k}>{ico(k) && <Icon name={ico(k)} size={14} />}{l}</span>;
const RpNum = ({ n, name }) => <><span className="rp-n">{'#' + n}</span> {name}</>;
const RpRow = ({ cov, title, k, l, when, again, muted }) => (
  <button type="button" className="rp rp-one">
    {cov && <Cov gid={cov} cls="ph-cov" />}
    <span className="rp-a" style={muted ? { color: 'var(--muted)', fontWeight: 400 } : null}><span className="rp-t">{title}</span></span>
    <span className="rp-c"><RpSt k={k} l={l} /></span>
    <span className="rp-d">{when}</span>
    <span className="rp-m">{again && <span className="rp-r" title="Replay">R</span>}</span>
    <LbChev />
  </button>
);
const beforeTitle = (p) => (isPz(p.gid) ? <RpNum n={p.ed} name={G[p.gid].name} /> : G[p.gid].name + ' · ' + p.ed);
const HistHead = () => (
  <>
    <div className="gs-stack-sm"><h1 className="gs-h1">History</h1><p className="gs-muted">A replay doesn’t change your streak or your record.</p></div>
  </>
);
const HistTools = () => (
  <div className="lbf-top"><div className="lbf-bar"><div className="lbf-search"><SearchField label="Search" placeholder="A number, name or date" value="" onChange={() => {}} /></div><Button variant="secondary">Filters</Button></div></div>
);
function BeforePlayed() {
  return (
    <div className="gs-root"><main className="gs-wrap gs-main"><HistHead />
      <div className="lb-alllay"><HistTools />
        <div className="lb-box lb-results">{PLAYED.map(([day, ps]) => (
          <React.Fragment key={day}><h2 className="ph-day">{day}</h2>
            <ul className="ph-list rp-cols is-cov">{ps.map((p, i) => <li key={i}><RpRow cov={p.gid} title={beforeTitle(p)} k={p.k} l={p.short} when={p.t} again={p.again} /></li>)}</ul>
          </React.Fragment>))}
        </div>
      </div>
    </main></div>
  );
}
const edBeforeTitle = (e) => (isPz(e.gid) ? <RpNum n={e.n} name={G[e.gid].name} /> : G[e.gid].name + ' #' + e.n + ' · ' + e.title);
function BeforeEditions() {
  return (
    <div className="gs-root"><main className="gs-wrap gs-main"><HistHead />
      <div className="lb-alllay"><HistTools />
        <div className="lb-box lb-results">{EDITIONS.map(([day, es]) => (
          <React.Fragment key={day}><h2 className="ph-day">{day}</h2>
            <ul className="lb-list ph-eds">{es.map((e, i) => (
              <React.Fragment key={i}>
                <li><button type="button" className="ed-row ph-edcov"><Cov gid={e.gid} cls="ph-cov" /><span className="ed-t">{edBeforeTitle(e)}</span>
                  <span className="ed-slots is-one"><span className="ed-slot">{e.latest ? <Tag kind="daily">Latest</Tag> : null}</span></span>
                  <span className="ed-r"><PhSt k={e.k} l={e.short} /></span><LbChev /></button></li>
                {e.reps.length > 0 && <li className="ph-rep-wrap"><ul className="lb-list rp-cols ph-reps">{e.reps.map((r, j) => <li key={j}><RpRow title={r[0]} k={r[2]} l={r[3]} when={r[1]} again /></li>)}</ul></li>}
              </React.Fragment>))}
            </ul>
          </React.Fragment>))}
        </div>
      </div>
    </main></div>
  );
}
const LibSlot = ({ label }) => <div className="pg-slot"><span>{label}</span></div>;
function BeforeLibrary({ wide }) {
  // newest first: a replay is newer than its first play. Within an edition the plays are listed latest first.
  const order = WORD_PLAYS.flatMap(([n, d, plays]) => plays.slice().reverse().map((p, i) => ({ key: n + '-' + i, n, d, p })));
  const shown = order.slice(0, wide ? 7 : 4);
  return (
    <div className="gs-root"><main className="gs-wrap gs-main">
      <div className="lb-lay">
        {wide && <LibSlot label="Achievements card (beside the plays card from 900px)" />}
        <section className="lb-card lb-recentcard">
          <div className="lb-sechead"><h2 className="mcp-t-card">Your words</h2><TextLink onClick={() => {}}>All words</TextLink></div>
          <ul className="lb-list lb-recent rp-cols">{shown.map((v) => <li key={v.key}><RpRow title={'#' + v.n} k={v.p[0]} l={v.p[1]} when={v.d} again={v.p[3]} /></li>)}</ul>
        </section>
      </div>
    </main></div>
  );
}

// ---- After: one row shape ----
const St = ({ k, l }) => <span className={'pr-st is-' + k}>{ico(k) && <Icon name={ico(k)} size={16} />}<span>{l}</span></span>;
const Go = () => <Icon name="next" size={20} className="pr-go" />;
const PrRow = ({ lead, title, meta, end }) => (
  <button type="button" className={'pr-row' + (lead ? ' has-lead' : '') + (end ? ' has-end' : '')}>
    {lead && <Cov gid={lead} cls="pr-lead" />}
    <span className="pr-body"><span className="pr-title">{title}</span><span className="pr-meta">{meta}</span></span>
    {end && <span className="pr-end">{end}</span>}
    <Go />
  </button>
);
const PrSub = ({ k, l, when, lead }) => (
  <button type="button" className={'pr-row is-sub' + (lead ? ' under-lead' : '')}>
    <span className="pr-subline"><span className="pr-again">Replay</span><St k={k} l={l} /><span className="pr-when">{when}</span></span><Go />
  </button>
);
const afterTitle = (gid, ed) => (isPz(gid) ? <>{G[gid].name} <span className="pr-n">{'#' + ed}</span></> : G[gid].name + ' · ' + ed);
function AfterPlayed({ cols }) {
  return (
    <div className="gs-root"><main className="gs-wrap gs-main"><HistHead />
      <div className="lb-alllay" style={{ maxWidth: cols ? 960 : 760 }}><HistTools />
        <div className="lb-box">{PLAYED.map(([day, ps]) => (
          <React.Fragment key={day}><h2 className="ph-day">{day}</h2>
            <ul className={'pr-list' + (cols ? ' pr-cols' : '')}>{ps.map((p, i) => (
              <li key={i}><PrRow lead={p.gid} title={afterTitle(p.gid, p.ed)} meta={<><St k={p.k} l={p.full} /><span className="pr-when">{p.t}</span>{p.again && <span className="pr-again">Replay</span>}</>} /></li>))}
            </ul>
          </React.Fragment>))}
        </div>
      </div>
    </main></div>
  );
}
function AfterEditions() {
  return (
    <div className="gs-root"><main className="gs-wrap gs-main"><HistHead />
      <div className="lb-alllay" style={{ maxWidth: 760 }}><HistTools />
        <div className="lb-box">{EDITIONS.map(([day, es]) => (
          <React.Fragment key={day}><h2 className="ph-day">{day}</h2>
            <ul className="pr-list">{es.map((e, i) => (
              <li key={i}>
                <PrRow lead={e.gid} title={isPz(e.gid) ? afterTitle(e.gid, e.n) : <>{G[e.gid].name} <span className="pr-n">{'#' + e.n}</span>{' · ' + e.title}</>}
                  meta={<St k={e.k} l={e.full} />} end={e.latest ? <Tag kind="daily">Latest</Tag> : null} />
                {e.reps.length > 0 && <ul className="pr-sublist">{e.reps.map((r, j) => <li key={j}><PrSub lead k={r[2]} l={r[4]} when={r[0].replace(' October', ' Oct') + ', ' + r[1]} /></li>)}</ul>}
              </li>))}
            </ul>
          </React.Fragment>))}
        </div>
      </div>
    </main></div>
  );
}
function AfterLibrary({ wide, cols }) {
  const shown = WORD_PLAYS.slice(0, wide ? 6 : 4);
  return (
    <div className="gs-root"><main className="gs-wrap gs-main">
      <div className="lb-lay">
        {wide && <LibSlot label="Achievements card (beside the plays card from 900px)" />}
        <section className="lb-card pr-card">
          <div className="lb-sechead"><h2 className="mcp-t-card">Your words</h2><TextLink onClick={() => {}}>All words</TextLink></div>
          <ul className={'pr-list' + (cols ? ' pr-cols' : '')}>{shown.map(([n, d, plays]) => {
            const f = plays[0]; const reps = plays.length - 1;
            return <li key={n}><PrRow title={'#' + n} meta={<><St k={f[0]} l={f[2]} /><span className="pr-when">{d}</span>{reps > 0 && <span className={cols ? 'pr-again' : ''}>{reps === 1 ? '1 replay' : reps + ' replays'}</span>}</>} /></li>;
          })}</ul>
        </section>
      </div>
    </main></div>
  );
}

// ---- The system's rows card today (live, from the bundle) and the proposed one ----
function DsCardBefore() {
  const { Card, ListRow, RowList } = DSX;
  const meta = (d, r, c) => <><span>{d}</span><span style={{ color: c }}>{r}</span></>;
  return (
    <div style={{ padding: 20, background: 'var(--page)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 8 }}><Card title="Your cases" action={<TextLink onClick={() => {}}>All cases</TextLink>}><RowList label="Your recent cases">
          <ListRow onClick={() => {}} title="The Gull Point Lighthouse" meta={meta('5 Oct', 'Solved', 'var(--success)')} />
          <ListRow onClick={() => {}} title="The Night Train" meta={meta('28 Sep', 'Unsolved', 'var(--error)')} />
          <ListRow muted title="Not played" meta={<span>21 Sep</span>} />
          <ListRow onClick={() => {}} title="A Death at the Regatta" meta={meta('14 Sep', 'Solved', 'var(--success)')} />
        </RowList></Card><span className="fr-note">Latest four, then All cases opens its own page</span></div>
        <div style={{ display: 'grid', gap: 8 }}><Card><RowList>
          <ListRow className="is-hover" onClick={() => {}} title="Hover" meta={meta('5 Oct', 'Solved', 'var(--success)')} />
          <ListRow className="is-pressed" onClick={() => {}} title="Press" meta={meta('5 Oct', 'Solved', 'var(--success)')} />
          <ListRow className="is-focus" onClick={() => {}} title="Focus" meta={meta('5 Oct', 'Solved', 'var(--success)')} />
          <ListRow muted title="Muted: can't be opened" meta={<span>21 Sep</span>} />
        </RowList></Card><span className="fr-note">Whole row is one target. No inline actions.</span></div>
      </div>
    </div>
  );
}
function DsCardAfter() {
  const box = { background: 'var(--card)', border: '1px solid var(--line)', '--lb-pad': '16px' };
  return (
    <div className="gs-root" style={{ padding: 20, gap: 20 }}>
      <div className="pr-anat" style={{ ...box, padding: '14px 0' }}>
        <div className="pr-row has-lead has-end" style={{ cursor: 'default' }}>
          <span data-n="1" style={{ display: 'block' }}><Cov gid="casebook" cls="pr-lead" /></span>
          <span className="pr-body"><span className="pr-title" data-n="2" style={{ justifySelf: 'start' }}>Casebook <span className="pr-n">#44</span> · The Night Train</span>
            <span className="pr-meta" data-n="3" style={{ justifySelf: 'start' }}><St k="bad" l="Unsolved" /><span>28 Sep, 20:10</span><span className="pr-again">Replay</span></span></span>
          <span className="pr-end" data-n="4"><Tag kind="daily">Latest</Tag></span>
          <span data-n="5" style={{ display: 'grid' }}><Go /></span>
        </div>
      </div>
      <ol className="fr-key">
        <li><b>Lead</b>, optional. A 40×30 cover when the list mixes games.</li>
        <li><b>Title.</b> The name a player would say. The game's name only when the list mixes games.</li>
        <li><b>Meta.</b> One line of facts, always in the same order: result, when, marker. It wraps; it never moves.</li>
        <li><b>End</b>, optional. One short tag about the row.</li>
        <li><b>Chevron</b> at rest whenever the row opens.</li>
      </ol>
      <div style={{ display: 'grid', gridTemplateColumns: '300px minmax(0,1fr)', gap: 16, alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: 8 }}><div style={box}><ul className="pr-list">
          <li><PrRow title="The Night Train" meta={<><St k="bad" l="Unsolved" /><span>28 Sep</span></>} /></li>
          <li><PrRow title="A Death at the Regatta" meta={<><St k="none" l="Not played" /><span>21 Sep</span></>} /></li>
        </ul></div><span className="fr-note">300px wide</span></div>
        <div style={{ display: 'grid', gap: 8 }}><div style={box}><ul className="pr-list">
          <li><PrRow title="The Night Train" meta={<><St k="bad" l="Unsolved" /><span>28 Sep</span></>} /><ul className="pr-sublist"><li><PrSub k="ok" l="Solved" when="2 Oct, 21:00" /></li></ul></li>
          <li><PrRow title="A Death at the Regatta" meta={<><St k="none" l="Not played" /><span>21 Sep</span></>} /></li>
        </ul></div><span className="fr-note">Wider: the same shape. A replay hangs under its edition.</span></div>
      </div>
    </div>
  );
}

Object.assign(window, { Frame, BeforePlayed, BeforeEditions, BeforeLibrary, AfterPlayed, AfterEditions, AfterLibrary, DsCardBefore, DsCardAfter });
