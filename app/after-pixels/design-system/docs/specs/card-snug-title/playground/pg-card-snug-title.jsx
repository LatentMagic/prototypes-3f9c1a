// Card snug title rig: the real design-system CardRow, Tag and GameCard parts with the product's eight Available games.
// Options change only the card's geometry (CSS keyed on data-pgs-opt); Today is the shipped rule.
(() => {
  const DS = window.MCPGameStoreDesignSystem_ef1abd;
  const KEY = 'pg_card_snug_title_v1';
  const OPTS = [
    { n: 0, name: 'Today', why: 'Four lines shared across the row. The name line is as tall as the tallest name, so a one-line name sits above a blank line.', cost: 'The gap you flagged: one two-line name opens a gap under every other title in the row.' },
    { n: 1, name: 'Snug, chips bottom', why: 'Each card stands alone: picture, then name and blurb together, then chips on the card\u2019s bottom edge. Cards are as tall as the tallest in the row. Spare height sits between blurb and chips.', cost: 'Nothing is shared but the picture and the card\u2019s edges. A card with two rows of chips starts its chips higher than one with a single row; their bottom edges stay level.' },
    { n: 2, name: 'Block, shared chips', why: 'Name and blurb become one block (a text slot added to GameCard). The row shares three lines: picture, block, chips. Chips sit centred in their line as ratified.', cost: 'Needs a wrapper in GameCard around name and blurb. One chip row beside a two-row set is centred, so its chips float a little above the bottom edge.' },
    { n: 3, name: 'Block, chips floor', why: 'As 2, with every chip set sitting on the bottom of its line.', cost: 'Needs the same wrapper. A single chip row sits flush with the other card\u2019s last row, but loses the centring ratified earlier.' },
  ];
  GS_GAMES.stress = { name: 'The Hollow Under the Hill', art: 'barrow', ed: ['chapter', 'chapters'], blurb: 'Something under the hill wants its gold back.', tags: ['FIRST', 'Weekly', '45\u201360 min'] };
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const save = (s) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} };
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
  // GameCard's own markup, plus one wrapper (pgs-text) around name and blurb. It is display:contents except in options 2 and 3.
  const Card = ({ id }) => {
    const g = GS_GAMES[id];
    return (
      <div className="mcp-card mcp-gcard mcp-art-host gs-host">
        <div className="mcp-gcard-art"><Art id={id} /></div>
        <div className="pgs-text">
          <div className="mcp-gcard-name"><h3 className="mcp-t-card"><button type="button" className="gs-titlebtn mcp-art-link">{g.name}</button></h3></div>
          <p className="mcp-gcard-blurb">{keepLast(g.blurb)}</p>
        </div>
        <div className="mcp-gcard-tags"><Tags tags={g.tags} ed={g.ed} /></div>
      </div>
    );
  };

  const measure = () => {
    const cards = [...document.querySelectorAll('.mcp-gcard')]; if (!cards.length) return null;
    const gap = cards.map((c) => c.querySelector('.mcp-gcard-blurb').getBoundingClientRect().top - c.querySelector('h3').getBoundingClientRect().bottom);
    const tb = cards.map((c) => { const t = [...c.querySelectorAll('.mcp-tag')]; return Math.max(...t.map((x) => x.getBoundingClientRect().bottom)) - c.getBoundingClientRect().bottom; });
    const hs = cards.map((c) => c.getBoundingClientRect().height);
    const sp = (a) => Math.max(...a) - Math.min(...a);
    const bl = cards.map((c) => { const t = c.querySelector('.mcp-gcard-tags').firstElementChild; const tt = Math.min(...[...c.querySelectorAll('.mcp-tag')].map((x) => x.getBoundingClientRect().top)); return tt - (() => { const rg = document.createRange(); rg.selectNodeContents(c.querySelector('.mcp-gcard-blurb')); return Math.max(...[...rg.getClientRects()].map((x) => x.bottom)); })() - 12; });
    return { gap: Math.max(...gap) - 12, tb: sp(tb), hs: sp(hs), blank: Math.max(...bl) };
  };

  const App = () => {
    const [opt, setOpt] = React.useState(Math.min(init.opt ?? 1, 3));
    const [vp, setVp] = React.useState(init.vp || 'auto');
    const [open, setOpen] = React.useState(init.open ?? true);
    const [stress, setStress] = React.useState(init.stress ?? false);
    const [why, setWhy] = React.useState(false);
    const [read, setRead] = React.useState(null);
    const [w, setW] = React.useState(window.innerWidth);
    const ref = React.useRef(null);
    React.useEffect(() => { document.documentElement.dataset.pgsOpt = String(opt); save({ opt, vp, open, stress }); }, [opt, vp, open, stress]);
    React.useEffect(() => { const t = setInterval(() => setRead(measure()), 500); const r = () => setW(window.innerWidth); window.addEventListener('resize', r); return () => { clearInterval(t); window.removeEventListener('resize', r); }; }, []);
    React.useEffect(() => { const el = ref.current; if (!el) return undefined; const ro = new ResizeObserver(() => document.documentElement.style.setProperty('--pgs-h', el.offsetHeight + 'px')); ro.observe(el); return () => ro.disconnect(); }, []);
    const o = OPTS[opt], f = (x) => Math.round(x);
    const forced = vp === 'mobile';
    const page = (
      <div className="gs-root"><div className="gs-wrap" style={{ paddingBlock: 36 }}>
        <DS.CardRow title="Available games" className="gs-row4">{(stress ? ['stress'].concat(GS_GAME_ORDER) : GS_GAME_ORDER).map((k) => <Card key={k} id={k} />)}</DS.CardRow>
      </div></div>
    );
    return (
      <React.Fragment>
        {forced ? <div className="kit-stage"><div className="kit-phone"><div className="kit-phone-clip"><div className="kit-phone-screen">{page}</div></div></div></div> : page}
        <div ref={ref} className="pgs-strip" role="region" aria-label="Playground options">
          <div className="pgs-row">
            <span className="pgs-k">OPTION</span>
            {OPTS.map((x) => <button key={x.n} type="button" className="pgs-b" aria-pressed={opt === x.n} onClick={() => setOpt(x.n)}>{x.n + ' ' + x.name}</button>)}
            <button type="button" className="pgs-b" aria-expanded={why} onClick={() => setWhy(!why)}>{why ? 'Less' : 'Why \u00b7 cost'}</button>
            <button type="button" className="pgs-b pgs-fold" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Show'}</button>
          </div>
          {why && <p className="pgs-why"><b>{o.n + ' ' + o.name}.</b> {o.why} <b>Cost:</b> {o.cost}</p>}
          {open && <React.Fragment>
            <div className="pgs-row">
              <span className="pgs-k">VIEWPORT</span>
              {[['auto', 'Auto'], ['mobile', 'Mobile']].map(([v, l]) => <button key={v} type="button" className="pgs-b" aria-pressed={vp === v} onClick={() => setVp(v)}>{l}</button>)}
              <span className="pgs-k" style={{ width: 'auto', marginLeft: 12 }}>SEED</span><button type="button" className="pgs-b" aria-pressed={stress} onClick={() => setStress(!stress)}>Stress: 2-line name + blurb, 3 chips</button>
              <span className="pgs-note">{forced ? 'Phone frame' : (w < 1024 ? 'Mobile layout' : 'Desktop layout') + ', ' + w + 'px'}</span>
            </div>
            <div className="pgs-read">{read ? <React.Fragment>Blank under a title <span className={read.gap > 1 ? 'bad' : ''}>{f(read.gap)}px</span> {'\u00b7'} chip bottoms differ from card edge by <span className={read.tb > 1 ? 'bad' : ''}>{f(read.tb)}px</span> {'\u00b7'} most blank above chips <span className={read.blank > 24 ? 'bad' : ''}>{f(read.blank)}px</span> {'\u00b7'} card heights differ <span className={read.hs > 1 ? 'bad' : ''}>{f(read.hs)}px</span></React.Fragment> : '\u2026'}</div>
          </React.Fragment>}
        </div>
      </React.Fragment>
    );
  };
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
})();
