// Canonical row, round 2: the row, the surfaces, the frames and the rail. Options 11 to 15; 0 is the shipped ListRow.
const DSQ = window.MCPGameStoreDesignSystem_ef1abd;
const CQ_KEY = 'pg_canonical-row-2_v2';
const CQ_WIDTHS = [320, 360, 390, 640, 768, 1024];
const CQ_DEF_W = [320, 360, 390, 768];
const cqNoGo = (e) => e.preventDefault();
const cqFull = (r) => (r.game ? r.game + (r.name ? ' · ' + r.name : ' ' + r.num) : r.num && r.name ? r.num + ' · ' + r.name : r.num || r.name);
const cqEd = (r) => (r.num && r.name ? r.num + ' · ' + r.name : r.num || r.name);
const CqArt = ({ art, className }) => <span className={className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: CR_ART[art] }} />;
// A replay icon in the system's line style, for 14 only. The system has none.
const CqReplayIcon = () => <svg className="cq-wi" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M19.5 12A7.5 7.5 0 1 1 16.8 6.2" /><path d="M18 3V7.5H13.5" /></g></svg>;

// One row, the same markup for every option. Each option's CSS picks which form of each field shows and where it sits.
const CQRow = ({ r }) => {
  const icon = r.tone === 'ok' ? 'check' : r.tone === 'bad' ? 'error' : null;
  const short = cqShort(r.result);
  const label = [cqFull(r), r.note, r.result, r.when].filter(Boolean).join(', ');
  return (
    <a href="#" onClick={cqNoGo} className={'cq' + (r.art ? ' has-lead' : '') + (r.note ? ' has-x' : '')} aria-label={label}>
      {r.art && <CqArt art={r.art} className="cq-lead" />}
      <span className="cq-t">{r.game && <span className="cq-g">{r.game}{r.name ? ' · ' : ' '}</span>}<span className="cq-e">{cqEd(r)}</span></span>
      <span className="cq-l2">
        {r.note && <span className="cq-xp"><CqReplayIcon /><span className="cq-xpt">{r.note}</span><i> ·</i></span>}
        {r.result && <span className={'cq-r is-' + (r.tone || 'none')}>{icon && <DSQ.Icon name={icon} size={16} />}<span className="cq-rl">{r.result}</span><span className="cq-rs">{short}</span></span>}
      </span>
      {(r.when || r.note) && <span className="cq-w">{r.note && <CqReplayIcon />}{r.when}</span>}
      {r.note && <span className="cq-x">{r.note}</span>}
      <DSQ.Icon name="next" size={20} className="cq-go" />
    </a>
  );
};

const CQ_WHEN_W = { history: '2.75rem', plays: '3.25rem', words: '3.25rem', cases: '4.75rem', library: '4.75rem' };
const cqFit = (ul) => {
  const rows = ul.querySelectorAll('.cq');
  rows.forEach((a) => a.classList.remove('is-lift'));
  const cut = (e) => e.offsetWidth > 0 && e.scrollWidth > e.clientWidth + 0.5;
  rows.forEach((a) => { const l2 = a.querySelector('.cq-l2'); if (l2 && (cut(l2) || [...l2.querySelectorAll('span')].some(cut))) a.classList.add('is-lift'); });
};
const CQList = ({ s, groups, label, fit }) => {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => { if (fit && ref.current) cqFit(ref.current); });
  React.useEffect(() => { const ul = ref.current; if (!fit || !ul) return undefined; const ro = new ResizeObserver(() => cqFit(ul)); ro.observe(ul); return () => ro.disconnect(); }, [fit]);
  return (
  <div className="crbox" style={{ '--cqw': CQ_WHEN_W[s.id] }}>
    <ul className="crl" aria-label={label} ref={ref}>
      {groups.map((g, gi) => <React.Fragment key={gi}>
        {g.h && <li className="crl-h" role="presentation"><h2 className="crl-h" style={{ padding: 0, font: 'inherit' }}>{g.h}</h2></li>}
        {g.rows.map((r) => <li key={r.k} className="is-row"><CQRow r={r} /></li>)}
      </React.Fragment>)}
    </ul>
  </div>
  );
};

// 0: the shipped DS ListRow, called as the product calls it.
const CqDsList = ({ groups, label }) => {
  const row = (r) => <DSQ.ListRow key={r.k} onClick={() => {}} lead={r.art ? <CqArt art={r.art} /> : undefined} title={cqFull(r)} result={r.result} tone={r.tone || undefined} when={r.when} note={r.note} />;
  if (groups.length > 1 || groups[0].h) return <div className="crbox">{groups.map((g) => <React.Fragment key={g.h}><h2 className="ph-day">{g.h}</h2><DSQ.RowList label={g.h}>{g.rows.map(row)}</DSQ.RowList></React.Fragment>)}</div>;
  return <div className="crbox"><DSQ.RowList label={label}>{groups[0].rows.map(row)}</DSQ.RowList></div>;
};

const CqSurface = ({ s, idea, worst }) => {
  const groups = CR_SEED[s.id](worst);
  const list = idea.ds ? <CqDsList groups={groups} label={s.card || s.page} /> : <CQList s={s} groups={groups} label={s.card || s.page} fit={idea.fit} />;
  if (s.card) return (
    <div className="sf"><section className="sf-card"><div className="sf-cardhead"><h2>{s.card}</h2><DSQ.TextLink onClick={() => {}}>{s.link}</DSQ.TextLink></div>{list}</section></div>
  );
  return (
    <div className="sf">
      {s.back && <span className="sf-back"><DSQ.Icon name="back" size={20} />{s.back}</span>}
      <h1 className="sf-h1">{s.page}</h1>
      {list}
    </div>
  );
};

const CqFrame = ({ w, cap, s, idea, worst, room }) => {
  const z = room && room < w ? Math.max(0.5, Math.floor((room / w) * 100) / 100) : 1;
  return (
    <div className="pg-frame" style={{ width: w, zoom: z === 1 ? undefined : z }}>
      <span className="pg-cap" style={z === 1 ? undefined : { fontSize: 12 / z }}>{(cap || w + 'PX') + (z === 1 ? '' : ' · SHOWN AT ' + Math.round(z * 100) + '%')}</span>
      <div className={'pg-in ' + idea.cls}><CqSurface s={s} idea={idea} worst={worst} /></div>
    </div>
  );
};

const CQ_PAIN_ICON = { ok: 'check', part: 'warn', bad: 'error' };
const CQ_PAIN_WORD = { ok: 'Holds', part: 'Partly', bad: 'Breaks' };
const CqDetail = ({ idea }) => (
  <section className="pg-detail" aria-live="polite">
    <h2><small>{idea.n}</small>{idea.name}</h2>
    <p>{idea.stance}</p>
    <p className="pg-cost"><b>Cost.</b> {idea.cost}</p>
    <p className="pg-adapt"><b>Across widths.</b> {idea.adapt}</p>
    <ul className="pg-pains">{CQ_PAINS.map(([k, l]) => <li key={k} className={'is-' + idea.pains[k]}><DSQ.Icon name={CQ_PAIN_ICON[idea.pains[k]]} size={16} />{l} <em>{CQ_PAIN_WORD[idea.pains[k]]}</em></li>)}</ul>
  </section>
);

const CqSeg = ({ label, opts, value, onPick, multi }) => (
  <div className="pg-seg" role="group" aria-label={label}><span>{label}</span>
    {opts.map(([v, l]) => <button key={v} type="button" aria-pressed={multi ? value.includes(v) : value === v} onClick={() => onPick(v)}>{l}</button>)}
  </div>
);

const CQ_DEF = { opt: 15, view: 'opt', worst: false, widths: CQ_DEF_W, surf: 'history', w: 320 };
const cqLoad = () => { try { return { ...CQ_DEF, ...JSON.parse(localStorage.getItem(CQ_KEY) || '{}') }; } catch (e) { return CQ_DEF; } };
function CqApp() {
  const [st, setSt] = React.useState(cqLoad);
  React.useEffect(() => { localStorage.setItem(CQ_KEY, JSON.stringify(st)); }, [st]);
  const set = (k, v) => setSt((p) => ({ ...p, [k]: v }));
  const mainRef = React.useRef(null); const [room, setRoom] = React.useState(0);
  React.useLayoutEffect(() => { const m = mainRef.current; if (!m) return undefined; const run = () => { const cs = getComputedStyle(m); setRoom(m.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)); }; run(); const ro = new ResizeObserver(run); ro.observe(m); return () => ro.disconnect(); }, []);
  const idea = CQ_IDEAS.find((x) => x.n === st.opt) || CQ_IDEAS[0];
  const flipW = (w) => set('widths', st.widths.includes(w) ? (st.widths.length > 1 ? st.widths.filter((x) => x !== w) : st.widths) : CQ_WIDTHS.filter((x) => x === w || st.widths.includes(x)));
  const surf = CR_SURFACES.find((x) => x.id === st.surf) || CR_SURFACES[0];
  return (
    <div className="pg">
      <nav className="pg-rail" aria-label="Options">
        <p className="pg-rail-t">OPTIONS</p>
        <ul className="pg-opts">{CQ_IDEAS.map((x) => <li key={x.n}><button type="button" className="pg-opt" aria-pressed={x.n === st.opt} onClick={() => set('opt', x.n)}><b>{x.n}</b><span>{x.name}</span></button></li>)}</ul>
      </nav>
      <main className="pg-main" ref={mainRef}>
        <header className="pg-lede">
          <h1>Canonical row, round 2</h1>
          <p>Options built from the content audit (<b>audit-row-content.md</b>), led by History at 320, 360 and 390. 15b and 15c are two ways to keep the time centred without cutting line two. Each one renders the same row data on the five surfaces. 0 is the shipped row.</p>
          <p className="pg-shared"><b>Shared by 11 to 15.</b> Rows never wrap: every row in a list is the same height. The cover follows the Cover rule, sharing the text’s top and bottom edge: 56×42 beside two lines, 40×30 on one. From 640px of list width every option is one line of fixed columns.</p>
          <div className="pg-ctl">
            <CqSeg label="View" value={st.view} onPick={(v) => set('view', v)} opts={[['opt', 'One option, every surface'], ['surf', 'One surface, every option']]} />
            <CqSeg label="Seed" value={st.worst ? 'w' : 'r'} onPick={(v) => set('worst', v === 'w')} opts={[['r', 'As seeded'], ['w', 'Worst case']]} />
          </div>
          {st.view === 'opt'
            ? <CqSeg label="Widths" multi value={st.widths} onPick={flipW} opts={CQ_WIDTHS.map((w) => [w, w + ''])} />
            : <div className="pg-ctl"><CqSeg label="Surface" value={st.surf} onPick={(v) => set('surf', v)} opts={CR_SURFACES.map((x) => [x.id, x.name])} /><CqSeg label="Width" value={st.w} onPick={(v) => set('w', v)} opts={CQ_WIDTHS.map((w) => [w, w + ''])} /></div>}
        </header>
        <CqDetail idea={idea} />
        {st.view === 'opt' ? CR_SURFACES.map((s) => (
          <section key={s.id} className="pg-surf">
            <header><h3>{s.name}</h3><p>{s.recipe}</p></header>
            <div className="pg-strip">{st.widths.map((w) => <CqFrame key={w + '-' + idea.n} w={w} s={s} idea={idea} worst={st.worst} room={room} />)}</div>
          </section>
        )) : (
          <section className="pg-surf">
            <header><h3>{surf.name} at {st.w}px</h3><p>{surf.recipe}</p></header>
            <div className="pg-strip">{CQ_IDEAS.map((x) => <CqFrame key={x.n + '-' + st.w} w={st.w} cap={x.n + ' · ' + x.name.toUpperCase()} s={surf} idea={x} worst={st.worst} room={room} />)}</div>
          </section>
        )}
      </main>
    </div>
  );
}
// Mount only on this playground's own page: the design-system bundle also carries this file, and the prototype loads the bundle.
if (document.querySelector('script[src$="pg-row2-app.jsx"]')) ReactDOM.createRoot(document.getElementById('root')).render(<CqApp />);
