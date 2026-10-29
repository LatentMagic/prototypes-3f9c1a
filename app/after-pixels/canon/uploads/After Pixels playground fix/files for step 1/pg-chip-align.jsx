// Card chip alignment: Home's Available games band (product app/gs-home.jsx), today beside the proposed fix.
// Today mounts DS.GameCard and DS.SoonCard as shipped. The fix adds one wrapper round name and blurb in GameCard (pgx-text) and changes CSS only.
(() => {
  const DS = window.MCPGameStoreDesignSystem_ef1abd;
  const KEY = 'pg_card-chip-alignment_v1';
  const HOME = ['word', 'mystery', 'escape', 'delve', 'barrow', 'hunter'];
  const SOON = [
    { name: 'Derelict', art: 'derelict', line: 'The same game, in science fiction' },
    { name: GS_GAMES.barrow.name, art: 'barrow', line: GS_GAMES.barrow.blurb, label: 'CHAPTER 2', play: 'Play chapter 1' },
  ];
  const WIDTHS = [1200, 1024, 768, 390];
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const init = load();

  const Art = ({ id }) => {
    const a = GS_ART[GS_GAMES[id].art] || {};
    const svg = (a.svg || '').replace('xMidYMid slice', a.extend === 'bottom' ? 'xMidYMax meet' : 'xMidYMid meet').replace('<svg ', '<svg style="width:100%;height:100%;display:block" ');
    return <div className={'mcp-art mcp-art-3' + (a.ground && a.ground !== 'indigo' ? ' is-' + a.ground : '')} style={{ position: 'relative' }} aria-hidden="true"><span style={{ position: 'absolute', inset: 0, display: 'grid' }} dangerouslySetInnerHTML={{ __html: svg }} /></div>;
  };
  const Tags = ({ tags, ed }) => (
    <div className="gs-tags">{tags.map((t, i) => t === 'FREE' ? <DS.Tag key={i} kind="free">Free</DS.Tag>
      : t === 'FIRST' ? <DS.Tag key={i} kind="free">{'First ' + (ed ? ed[0] : 'edition') + ' free'}</DS.Tag>
      : t === 'PASS' ? <button key={i} type="button" className="gs-tagbtn" aria-label="Pass. See the Pass"><DS.Tag kind="locked">Pass</DS.Tag></button>
      : <DS.Tag key={i} kind="daily">{t}</DS.Tag>)}</div>
  );
  const keepLast = (s) => { const i = s.lastIndexOf(' '); const j = i > 0 ? s.lastIndexOf(' ', i - 1) : -1; return j < 0 ? s : <>{s.slice(0, j + 1)}<span style={{ whiteSpace: 'nowrap' }}>{s.slice(j + 1)}</span></>; };
  const Title = ({ g }) => <button type="button" className="gs-titlebtn mcp-art-link">{g.name}</button>;
  const Today = ({ id }) => { const g = GS_GAMES[id]; return <DS.GameCard className="mcp-art-host gs-host" art={<Art id={id} />} title={<Title g={g} />} blurb={keepLast(g.blurb)} tags={<Tags tags={g.tags} ed={g.ed} />} />; };
  // GameCard's markup with the one added wrapper.
  const Fixed = ({ id }) => { const g = GS_GAMES[id]; return (
    <div className="mcp-card mcp-gcard mcp-art-host gs-host">
      <div className="mcp-gcard-art"><Art id={id} /></div>
      <div className="pgx-text">
        <div className="mcp-gcard-name"><h3 className="mcp-t-card"><Title g={g} /></h3></div>
        <p className="mcp-gcard-blurb">{keepLast(g.blurb)}</p>
      </div>
      <div className="mcp-gcard-tags"><Tags tags={g.tags} ed={g.ed} /></div>
    </div>); };
  const Soon = ({ s }) => { const a = GS_ART[s.art] || {}; return <DS.SoonCard art={<DS.Cover fill ground={a.ground} extend={a.extend}><span style={{ display: 'block' }} dangerouslySetInnerHTML={{ __html: a.svg || '' }} /></DS.Cover>} label={s.label} title={s.name} line={s.line} play={s.play} onPlay={s.play ? () => {} : undefined} />; };

  const Band = ({ fix }) => (
    <div className={'gs-root' + (fix ? ' is-fix' : '')}><div className="gs-wrap"><section className="gs-band">
      <DS.CardRow title="Available games" className="gs-row4">{HOME.map((k) => fix ? <Fixed key={k} id={k} /> : <Today key={k} id={k} />)}</DS.CardRow>
      <div className="gs-grid2">{SOON.map((s) => <Soon key={s.name} s={s} />)}</div>
      <div><DS.TextLink onClick={() => {}}>All games</DS.TextLink></div>
    </section></div></div>
  );
  // Each frame renders at the chosen width and scales down to fit the pane.
  const Frame = ({ w, fix, cap, note }) => {
    const box = React.useRef(null); const [z, setZ] = React.useState(1);
    React.useEffect(() => { const el = box.current; const ro = new ResizeObserver(() => setZ(Math.min(1, el.clientWidth / w))); ro.observe(el); return () => ro.disconnect(); }, [w]);
    return (
      <div className="pgc-frame">
        <div className="pgc-cap"><b>{cap}</b><span>{note}{z < 1 ? ' · shown at ' + Math.round(z * 100) + '%' : ''}</span></div>
        <div className="pgc-fit" ref={box}><div className="pgc-stage" style={{ width: w, zoom: z }}><Band fix={fix} /></div></div>
      </div>
    );
  };
  const App = () => {
    const [w, setW] = React.useState(WIDTHS.includes(init.w) ? init.w : 1200);
    const [fix, setFix] = React.useState(init.fix ?? true);
    React.useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify({ w, fix })); } catch (e) {} }, [w, fix]);
    return (
      <div className="pgc">
        <div className="pgc-head">
          <h1>Available games: chip alignment</h1>
          <div className="pgc-row"><span className="pgc-k">VERSION</span>{[[false, '0 Today'], [true, '1 Fix']].map(([v, l]) => <button key={l} type="button" className="pgc-b" aria-pressed={fix === v} onClick={() => setFix(v)}>{l}</button>)}</div>
          <div className="pgc-row"><span className="pgc-k">WIDTH</span>{WIDTHS.map((x) => <button key={x} type="button" className="pgc-b" aria-pressed={w === x} onClick={() => setW(x)}>{x}</button>)}</div>
        </div>
        {fix
          ? <Frame key="f" w={w} fix cap="1 Fix" note="One-row chips centred against Delve. Coming soon chips on one line." />
          : <Frame key="t" w={w} cap="0 Today" note="Chips at the bottom, white space above. Coming soon chips at different heights." />}
      </div>
    );
  };
  // Mount only on this playground's own page: the design-system bundle also carries this file, and the prototype loads the bundle.
  if (document.querySelector('script[src$="pg-chip-align.jsx"]')) ReactDOM.createRoot(document.getElementById('root')).render(<App />);
})();
