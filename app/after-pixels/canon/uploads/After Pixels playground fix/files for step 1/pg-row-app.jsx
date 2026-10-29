// Canonical row playground: the row, the five surfaces, the frames and the rail.
const DSR = window.MCPGameStoreDesignSystem_ef1abd;
const CR_KEY = 'pg_canonical-row_v1';
const CR_WIDTHS = [320, 390, 640, 768, 960];
const CR_DEF_W = [320, 390, 640, 960];
const noGo = (e) => e.preventDefault();
const crTitle = (r) => (r.game ? r.game + (r.name ? ' · ' + r.name : ' ' + r.num) : r.num && r.name ? r.num + ' · ' + r.name : r.num || r.name);
const CrArt = ({ art, className }) => <span className={className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: CR_ART[art] }} />;

// ---- One row: the same markup for every idea; each idea's CSS decides where the parts go ----
const CRow = ({ r }) => {
  const icon = r.tone === 'ok' ? 'check' : r.tone === 'bad' ? 'error' : null;
  return (
    <a href="#" onClick={noGo} className={'cr' + (r.art && !r.sub ? ' has-lead' : '') + (r.sub ? ' is-sub' : '')} aria-label={r.sub ? 'Replay, ' + r.result + ', ' + r.when : undefined}>
      {r.art && !r.sub && <CrArt art={r.art} className="cr-lead" />}
      {!r.sub && <span className="cr-t">{r.game && <span className="cr-g">{r.game}{r.name && <span className="cr-sep"> ·</span>}</span>}{r.game && r.num && ' '}{r.num && <span className="cr-n">{r.num}{r.name && <span className="cr-sep"> ·</span>}</span>}{r.name && (r.game || r.num) && ' '}{r.name && <span className="cr-m">{r.name}</span>}</span>}
      <span className="cr-f">
        {r.result && <span className={'cr-r is-' + (r.tone || 'none')}>{icon && <DSR.Icon name={icon} size={16} />}<span>{r.result}</span></span>}
        {r.when && <span className="cr-w">{r.when}</span>}
        {r.note && <span className="cr-x">{r.note}</span>}
      </span>
      <DSR.Icon name="next" size={20} className="cr-go" />
    </a>
  );
};

// Nested (idea 8): replays leave their place and sit under the play they repeat, oldest first.
const crNest = (groups) => {
  const kids = {};
  groups.forEach((g) => g.rows.forEach((r) => { if (r.of) (kids[r.of] = kids[r.of] || []).unshift({ ...r, day: g.h }); }));
  return groups.map((g) => ({ h: g.h, rows: g.rows.filter((r) => !r.of).flatMap((r) => {
    const k = kids[r.k]; if (!k) return [r];
    return [{ ...r, note: k.length + (k.length > 1 ? ' replays' : ' replay') }, ...k.map((c) => ({ ...c, sub: true, note: 'Replay', when: c.day !== g.h && c.long ? c.long : c.when }))];
  }) })).filter((g) => g.rows.length);
};

// All or none (idea 4): the list tries columns; if any title would wrap, every row stacks.
const useFit = (ref, on) => {
  React.useLayoutEffect(() => {
    const box = ref.current; if (!on || !box) return undefined;
    const ul = box.querySelector('.crl'); let last = -1;
    const run = () => {
      const w = box.clientWidth; if (w === last) return; last = w;
      ul.classList.remove('is-stack'); ul.classList.add('is-cols');
      const wrap = Array.from(ul.querySelectorAll('.cr-t')).some((t) => t.offsetHeight > 30);
      if (wrap) { ul.classList.remove('is-cols'); ul.classList.add('is-stack'); }
    };
    run(); const ro = new ResizeObserver(run); ro.observe(box);
    return () => ro.disconnect();
  });
};

const CList = ({ s, groups, idea, label }) => {
  const ref = React.useRef(null); useFit(ref, !!idea.fit);
  const gs = idea.nest ? crNest(groups) : groups;
  return (
    <div ref={ref} className="crbox">
      <ul className={'crl' + (s.lead ? ' has-leads' : '') + (s.outcome === false ? ' no-outcome' : '')} aria-label={label}>
        {gs.map((g, gi) => <React.Fragment key={gi}>
          {g.h && <li className="crl-h" role="presentation"><h2 className="crl-h" style={{ padding: 0, font: 'inherit' }}>{g.h}</h2></li>}
          {g.rows.map((r) => <li key={r.k} className={'is-row' + (r.sub ? ' is-sub-li' : '')}><CRow r={r} /></li>)}
        </React.Fragment>)}
      </ul>
    </div>
  );
};

// Option 0: the shipped DS ListRow, called as the product calls it.
const DsList = ({ s, groups, label }) => {
  const row = (r) => <DSR.ListRow key={r.k} onClick={() => {}} lead={r.art ? <CrArt art={r.art} /> : undefined} title={crTitle(r)} result={r.result} tone={r.tone || undefined} when={r.when} note={r.note} />;
  if (groups.length > 1 || groups[0].h) return <div className="crbox">{groups.map((g) => <React.Fragment key={g.h}><h2 className="ph-day">{g.h}</h2><DSR.RowList label={g.h}>{g.rows.map(row)}</DSR.RowList></React.Fragment>)}</div>;
  return <div className="crbox"><DSR.RowList label={label}>{groups[0].rows.map(row)}</DSR.RowList></div>;
};

const Surface = ({ s, idea, worst }) => {
  const groups = CR_SEED[s.id](worst);
  const list = idea.ds ? <DsList s={s} groups={groups} label={s.card || s.page} /> : <CList s={s} groups={groups} idea={idea} label={s.card || s.page} />;
  if (s.card) return (
    <div className="sf">
      <section className="sf-card">
        <div className="sf-cardhead"><h2>{s.card}</h2><DSR.TextLink onClick={() => {}}>{s.link}</DSR.TextLink></div>
        {list}
      </section>
    </div>
  );
  return (
    <div className="sf">
      {s.back && <span className="sf-back"><DSR.Icon name="back" size={20} />{s.back}</span>}
      <h1 className="sf-h1">{s.page}</h1>
      {list}
    </div>
  );
};

const Frame = ({ w, cap, s, idea, worst, room }) => {
  const z = room && room < w ? Math.max(0.5, Math.floor((room / w) * 100) / 100) : 1;
  return (
  <div className="pg-frame" style={{ width: w, zoom: z === 1 ? undefined : z }}>
    <span className="pg-cap" style={z === 1 ? undefined : { fontSize: 12 / z }}>{(cap || w + 'PX') + (z === 1 ? '' : ' · SHOWN AT ' + Math.round(z * 100) + '%')}</span>
    <div className={'pg-in ' + idea.cls}><Surface s={s} idea={idea} worst={worst} /></div>
  </div>
  );
};

const PAIN_ICON = { ok: 'check', part: 'warn', bad: 'error' };
const PAIN_WORD = { ok: 'Holds', part: 'Partly', bad: 'Breaks' };
const Detail = ({ idea }) => (
  <section className="pg-detail" aria-live="polite">
    <h2><small>{idea.n}</small>{idea.name}</h2>
    <p>{idea.stance}</p>
    <p className="pg-cost"><b>Cost.</b> {idea.cost}</p>
    <p className="pg-adapt"><b>Across widths.</b> {idea.adapt}</p>
    <ul className="pg-pains">{CR_PAINS.map(([k, l]) => <li key={k} className={'is-' + idea.pains[k]}><DSR.Icon name={PAIN_ICON[idea.pains[k]]} size={16} />{l} <em>{PAIN_WORD[idea.pains[k]]}</em></li>)}</ul>
  </section>
);

const Seg = ({ label, opts, value, onPick, multi }) => (
  <div className="pg-seg" role="group" aria-label={label}><span>{label}</span>
    {opts.map(([v, l]) => <button key={v} type="button" aria-pressed={multi ? value.includes(v) : value === v} onClick={() => onPick(v)}>{l}</button>)}
  </div>
);

const crLoad = () => { try { return { opt: 10, view: 'opt', worst: false, widths: CR_DEF_W, surf: 'history', w: 390, ...JSON.parse(localStorage.getItem(CR_KEY) || '{}') }; } catch (e) { return { opt: 10, view: 'opt', worst: false, widths: CR_DEF_W, surf: 'history', w: 390 }; } };
function App() {
  const [st, setSt] = React.useState(crLoad);
  React.useEffect(() => { localStorage.setItem(CR_KEY, JSON.stringify(st)); }, [st]);
  const set = (k, v) => setSt((p) => ({ ...p, [k]: v }));
  const mainRef = React.useRef(null); const [room, setRoom] = React.useState(0);
  React.useLayoutEffect(() => { const m = mainRef.current; if (!m) return undefined; const run = () => { const cs = getComputedStyle(m); setRoom(m.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)); }; run(); const ro = new ResizeObserver(run); ro.observe(m); return () => ro.disconnect(); }, []);
  const idea = CR_IDEAS.find((x) => x.n === st.opt) || CR_IDEAS[0];
  const flipW = (w) => set('widths', st.widths.includes(w) ? (st.widths.length > 1 ? st.widths.filter((x) => x !== w) : st.widths) : CR_WIDTHS.filter((x) => x === w || st.widths.includes(x)));
  const surf = CR_SURFACES.find((x) => x.id === st.surf) || CR_SURFACES[0];
  return (
    <div className="pg">
      <nav className="pg-rail" aria-label="Ideas">
        <p className="pg-rail-t">IDEAS</p>
        <ul className="pg-opts">{CR_IDEAS.map((x) => <li key={x.n}><button type="button" className="pg-opt" aria-pressed={x.n === st.opt} onClick={() => set('opt', x.n)}><b>{x.n}</b><span>{x.name}</span></button></li>)}</ul>
      </nav>
      <main className="pg-main" ref={mainRef}>
        <header className="pg-lede">
          <h1>Canonical row</h1>
          <p>One row for every list in the product. Each idea renders <b>the same row data</b> (cover, game, number, name, result, when, note) on <b>five real surfaces</b>, in frames 320 to 960px wide (the list inside is 34px narrower; the ladders switch on the list’s width). Frames wider than the pane are scaled down and say so. Copy and results are the product’s own. 0 is the shipped ListRow.</p>
          <div className="pg-ctl">
            <Seg label="View" value={st.view} onPick={(v) => set('view', v)} opts={[['opt', 'One idea, every surface'], ['surf', 'One surface, every idea']]} />
            <Seg label="Seed" value={st.worst ? 'w' : 'r'} onPick={(v) => set('worst', v === 'w')} opts={[['r', 'As seeded'], ['w', 'Worst case']]} />
          </div>
          {st.view === 'opt'
            ? <Seg label="Widths" multi value={st.widths} onPick={flipW} opts={CR_WIDTHS.map((w) => [w, w + ''])} />
            : <div className="pg-ctl"><Seg label="Surface" value={st.surf} onPick={(v) => set('surf', v)} opts={CR_SURFACES.map((x) => [x.id, x.name])} /><Seg label="Width" value={st.w} onPick={(v) => set('w', v)} opts={CR_WIDTHS.map((w) => [w, w + ''])} /></div>}
        </header>
        <Detail idea={idea} />
        {st.view === 'opt' ? CR_SURFACES.map((s) => (
          <section key={s.id} className="pg-surf">
            <header><h3>{s.name}</h3><p>{s.recipe}</p></header>
            <div className="pg-strip">{st.widths.map((w) => <Frame key={w + '-' + idea.n} w={w} s={s} idea={idea} worst={st.worst} room={room} />)}</div>
          </section>
        )) : (
          <section className="pg-surf">
            <header><h3>{surf.name} at {st.w}px</h3><p>{surf.recipe}</p></header>
            <div className="pg-strip">{CR_IDEAS.map((x) => <Frame key={x.n + '-' + st.w} w={st.w} cap={x.n + ' · ' + x.name.toUpperCase()} s={surf} idea={x} worst={st.worst} room={room} />)}</div>
          </section>
        )}
      </main>
    </div>
  );
}
// Mount only on this playground's own page: the design-system bundle also carries this file, and the prototype loads the bundle.
if (document.querySelector('script[src$="pg-row-app.jsx"]')) ReactDOM.createRoot(document.getElementById('root')).render(<App />);
