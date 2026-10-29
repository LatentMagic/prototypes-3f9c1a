// Canonical row, round 3: the row, the surfaces, the frames and the rail. Options 16 to 18; 0 is the shipped ListRow.
const DS3 = window.MCPGameStoreDesignSystem_ef1abd;
const C3_KEY = 'pg_canonical-row-3_v3';
const C3_WIDTHS = [320, 360, 390, 440, 640, 768, 1024];
const C3_DEF_W = C3_WIDTHS;
const c3NoGo = (e) => e.preventDefault();
const c3Full = (r) => (r.game ? r.game + (r.name ? ' · ' + r.name : ' ' + r.num) : r.num && r.name ? r.num + ' · ' + r.name : r.num || r.name);
const c3Ed = (r) => (r.num && r.name ? r.num + ' · ' + r.name : r.num || r.name);
const C3Art = ({ art, className }) => <span className={className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: CR_ART[art] }} />;

// The title says as much as fits: game · edition; in 16 and 19, edition alone beside a cover; then the edition cut, trimmed of trailing
// space and dots before the “…”. Other options keep their CSS rungs for the game's name and only get the clean cut.
const c3Fit = (t) => {
  const g = t.querySelector('.c3-g'), e = t.querySelector('.c3-e'), full = e.dataset.full || '';
  const fits = () => t.scrollWidth <= t.clientWidth;
  if (g) g.style.display = '';
  e.textContent = full;
  if (fits()) return;
  if (g && t.closest('.o16,.o19') && t.closest('.c3').classList.contains('has-lead')) { g.style.display = 'none'; if (fits()) return; }
  const cut = (n) => full.slice(0, n).replace(/[\s·]+$/, '') + '…';
  let lo = 0, hi = full.length;
  while (lo < hi) { const m = (lo + hi + 1) >> 1; e.textContent = cut(m); if (fits()) lo = m; else hi = m - 1; }
  e.textContent = cut(lo);
};

// One row, the same markup for every option. Each option's CSS picks which form of each field shows and what the row spends.
const C3Row = ({ r }) => {
  const icon = r.tone === 'ok' ? 'check' : r.tone === 'bad' ? 'error' : null;
  const label = [c3Full(r), r.note, r.result, r.when].filter(Boolean).join(', ');
  const tRef = React.useRef(null);
  React.useLayoutEffect(() => { const t = tRef.current; if (!t) return undefined; const run = () => c3Fit(t); run(); document.fonts.ready.then(run); const ro = new ResizeObserver(run); ro.observe(t); ro.observe(t.closest('.c3')); return () => ro.disconnect(); });
  return (
    <a href="#" onClick={c3NoGo} className={'c3' + (r.art ? ' has-lead' : '') + (r.game ? ' has-g' : '') + (r.note ? ' has-x' : '') + (r.result ? ' has-r' : '')} aria-label={label}>
      {r.art && <C3Art art={r.art} className="c3-lead" />}
      <span className="c3-t" ref={tRef}>{r.game && <span className="c3-g">{r.game}{r.name ? ' · ' : ' '}</span>}<span className="c3-e" data-full={c3Ed(r)}></span></span>
      {r.result && <span className={'c3-r is-' + (r.tone || 'none')}>{icon && <DS3.Icon name={icon} size={16} />}<span className="c3-rl">{r.result}</span><span className="c3-rs">{cqShort(r.result)}</span></span>}
      {r.when && <span className="c3-w">{r.when}</span>}
      {r.note && <span className="c3-x">{r.note}</span>}
      <DS3.Icon name="next" size={20} className="c3-go" />
    </a>
  );
};

const C3_WHEN_W = { history: '2.75rem', plays: '3.25rem', words: '3.25rem', cases: '4.75rem', library: '4.75rem' };
const C3List = ({ s, groups, label }) => (
  <div className="crbox" style={{ '--cqw': C3_WHEN_W[s.id] }}>
    <ul className="crl" aria-label={label}>
      {groups.map((g, gi) => <React.Fragment key={gi}>
        {g.h && <li className="crl-h" role="presentation"><h2 className="crl-h" style={{ padding: 0, font: 'inherit' }}>{g.h}</h2></li>}
        {g.rows.map((r) => <li key={r.k} className="is-row"><C3Row r={r} /></li>)}
      </React.Fragment>)}
    </ul>
  </div>
);

// 0: the shipped DS ListRow, called as the product calls it.
const C3DsList = ({ groups, label }) => {
  const row = (r) => <DS3.ListRow key={r.k} onClick={() => {}} lead={r.art ? <C3Art art={r.art} /> : undefined} title={c3Full(r)} result={r.result} tone={r.tone || undefined} when={r.when} note={r.note} />;
  if (groups.length > 1 || groups[0].h) return <div className="crbox">{groups.map((g) => <React.Fragment key={g.h}><h2 className="ph-day">{g.h}</h2><DS3.RowList label={g.h}>{g.rows.map(row)}</DS3.RowList></React.Fragment>)}</div>;
  return <div className="crbox"><DS3.RowList label={label}>{groups[0].rows.map(row)}</DS3.RowList></div>;
};

const C3Surface = ({ s, idea, worst }) => {
  const groups = CR_SEED[s.id](worst);
  const list = idea.ds ? <C3DsList groups={groups} label={s.card || s.page} /> : <C3List s={s} groups={groups} label={s.card || s.page} />;
  if (s.card) return (
    <div className="sf"><section className="sf-card"><div className="sf-cardhead"><h2>{s.card}</h2><DS3.TextLink onClick={() => {}}>{s.link}</DS3.TextLink></div>{list}</section></div>
  );
  return (
    <div className="sf">
      {s.back && <span className="sf-back"><DS3.Icon name="back" size={20} />{s.back}</span>}
      <h1 className="sf-h1">{s.page}</h1>
      {list}
    </div>
  );
};

const C3Frame = ({ w, cap, s, idea, worst, room, voice }) => {
  const z = room && room < w ? Math.max(0.5, Math.floor((room / w) * 100) / 100) : 1;
  return (
    <div className="pg-frame" style={{ width: w, zoom: z === 1 ? undefined : z }}>
      <span className="pg-cap" style={z === 1 ? undefined : { fontSize: 12 / z }}>{(cap || w + 'PX') + (z === 1 ? '' : ' · SHOWN AT ' + Math.round(z * 100) + '%')}</span>
      <div className={'pg-in ' + idea.cls + (voice ? ' is-voice' : '')}><C3Surface s={s} idea={idea} worst={worst} /></div>
    </div>
  );
};

const C3_PAIN_ICON = { ok: 'check', part: 'warn', bad: 'error' };
const C3_PAIN_WORD = { ok: 'Holds', part: 'Partly', bad: 'Breaks' };
const C3Detail = ({ idea }) => (
  <section className="pg-detail" aria-live="polite">
    <h2><small>{idea.n}</small>{idea.name}</h2>
    <p>{idea.stance}</p>
    <p className="pg-cost"><b>Cost.</b> {idea.cost}</p>
    <p className="pg-adapt"><b>Across widths.</b> {idea.adapt}</p>
    <ul className="pg-pains">{CQ3_PAINS.map(([k, l]) => <li key={k} className={'is-' + idea.pains[k]}><DS3.Icon name={C3_PAIN_ICON[idea.pains[k]]} size={16} />{l} <em>{C3_PAIN_WORD[idea.pains[k]]}</em></li>)}</ul>
  </section>
);

const C3Seg = ({ label, opts, value, onPick, multi }) => (
  <div className="pg-seg" role="group" aria-label={label}><span>{label}</span>
    {opts.map(([v, l]) => <button key={v} type="button" aria-pressed={multi ? value.includes(v) : value === v} onClick={() => onPick(v)}>{l}</button>)}
  </div>
);

const C3_DEF = { opt: 19, view: 'opt', worst: false, widths: C3_DEF_W, surf: 'history', w: 390, voice: true };
const c3Load = () => { try { return { ...C3_DEF, ...JSON.parse(localStorage.getItem(C3_KEY) || '{}') }; } catch (e) { return C3_DEF; } };
function C3App() {
  const [st, setSt] = React.useState(c3Load);
  React.useEffect(() => { localStorage.setItem(C3_KEY, JSON.stringify(st)); }, [st]);
  const set = (k, v) => setSt((p) => ({ ...p, [k]: v }));
  const mainRef = React.useRef(null); const [room, setRoom] = React.useState(0);
  React.useLayoutEffect(() => { const m = mainRef.current; if (!m) return undefined; const run = () => { const cs = getComputedStyle(m); setRoom(m.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)); }; run(); const ro = new ResizeObserver(run); ro.observe(m); return () => ro.disconnect(); }, []);
  const idea = CQ3_IDEAS.find((x) => x.n === st.opt) || CQ3_IDEAS[0];
  const flipW = (w) => set('widths', st.widths.includes(w) ? (st.widths.length > 1 ? st.widths.filter((x) => x !== w) : st.widths) : C3_WIDTHS.filter((x) => x === w || st.widths.includes(x)));
  const surf = CR_SURFACES.find((x) => x.id === st.surf) || CR_SURFACES[0];
  return (
    <div className="pg">
      <main className="pg-main" ref={mainRef}>
        <header className="pg-lede">
          <h1>Canonical row, round 3</h1>
          <p>Two things are taken as settled from your reviews: every row in a list is one height, and the trailing column centres the time when it is alone and gives Replay its own line when it is not. What is left to decide on a phone is what to spend. A 320 frame leaves 154px for a line, and the cover, the chevron, the time column and the full words do not all fit in it. <b>16</b>, <b>17</b> and <b>18</b> each spend one of them and keep the rest. <b>0</b> is the shipped row.</p>
          <p className="pg-shared"><b>Shared by 16 to 19.</b> Two 20px lines on every row under 640px of list width, so a row is 62px on every surface. The cover follows the Cover rule and shares the text’s edges: 56×42 beside two lines, 40×30 beside one. Titles never wrap; a title that does not fit ends in “…”, never after a space. A row with nothing on line two centres its title. The title has two voices: the game’s name quiet, the edition’s name in ink (toggle below). From 640 every option is the same one line of fixed columns (title, result, Replay, time), and a page list keeps a 760px measure.</p>
          <div className="pg-ctl">
            <C3Seg label="Option" value={st.opt} onPick={(v) => set('opt', v)} opts={CQ3_IDEAS.map((x) => [x.n, x.n + ' ' + x.name])} />
            <C3Seg label="View" value={st.view} onPick={(v) => set('view', v)} opts={[['surf', 'One surface, every option'], ['opt', 'One option, every surface']]} />
            <C3Seg label="Seed" value={st.worst ? 'w' : 'r'} onPick={(v) => set('worst', v === 'w')} opts={[['r', 'As seeded'], ['w', 'Worst case']]} />
            <C3Seg label="Game’s name" value={st.voice ? 'q' : 'i'} onPick={(v) => set('voice', v === 'q')} opts={[['q', 'Quiet'], ['i', 'Ink']]} />
          </div>
          {st.view === 'opt'
            ? <C3Seg label="Widths" multi value={st.widths} onPick={flipW} opts={C3_WIDTHS.map((w) => [w, w + ''])} />
            : <div className="pg-ctl"><C3Seg label="Surface" value={st.surf} onPick={(v) => set('surf', v)} opts={CR_SURFACES.map((x) => [x.id, x.name])} /><C3Seg label="Width" value={st.w} onPick={(v) => set('w', v)} opts={C3_WIDTHS.map((w) => [w, w + ''])} /></div>}
        </header>
        <C3Detail idea={idea} />
        {st.view === 'opt' ? CR_SURFACES.map((s) => (
          <section key={s.id} className="pg-surf">
            <header><h3>{s.name}</h3><p>{s.recipe}</p></header>
            <div className="pg-strip">{st.widths.map((w) => <C3Frame key={w + '-' + idea.n} w={w} s={s} idea={idea} worst={st.worst} room={room} voice={st.voice} />)}</div>
          </section>
        )) : (
          <section className="pg-surf">
            <header><h3>{surf.name} at {st.w}px</h3><p>{surf.recipe}</p></header>
            <div className="pg-strip">{CQ3_IDEAS.map((x) => <C3Frame key={x.n + '-' + st.w} w={st.w} cap={x.n + ' · ' + x.name.toUpperCase()} s={surf} idea={x} worst={st.worst} room={room} voice={st.voice} />)}</div>
          </section>
        )}
      </main>
    </div>
  );
}
// Mount only on this playground's own page: the design-system bundle also carries this file, and the prototype loads the bundle.
if (document.querySelector('script[src$="pg-row3-app.jsx"]')) ReactDOM.createRoot(document.getElementById('root')).render(<C3App />);
