// Playground: Home's Pass mention, options 0 to 4. Re-publishes GsHome; everything but the Pass mention is canon's
// (app/gs-pass-home.jsx). The hero and band are copied here because canon's GsHome takes no slot for them.
const HPL_KEY = 'pg_home-pass-line_v1';
const HPL_OPTS = [
  { n: 0, name: 'Today', stance: 'The Pass band halfway down, under the games: heading, one line, the pay line.', cost: 'Easy to scroll past; nothing about it looks different from the bands around it.' },
  { n: 1, name: 'In the hero', stance: 'One line in the hero, under Start free, set like Works with: a small label and the line. The mid-page band goes.', cost: 'No price on Home, and the Pass never gets a heading of its own.' },
  { n: 2, name: 'A Pass card', stance: 'Same place, but a card with a cover shape block, the line and the price. The only card-with-art on the page that is not a game.', cost: 'Still halfway down; a phone visitor meets it after six games and the coming-soon pair.' },
  { n: 3, name: 'Straight after the hero', stance: 'The band moves up to sit right under the hero, with the price set large beside the line on desktop and under it on a phone.', cost: 'The games move down one band; on a phone the first game card sits a screen lower.' },
  { n: 4, name: 'Shown in the games', stance: 'The band stays where it is and carries a swiping row of the games that come with the Pass, each with its Pass mark.', cost: 'Home shows games twice; the row grows with the library.' },
];
const hplStore = (() => {
  let v = 1; try { const s = JSON.parse(localStorage.getItem(HPL_KEY)); if (s && HPL_OPTS.some((o) => o.n === s.opt)) v = s.opt; } catch (e) {}
  const subs = new Set();
  return { get: () => v, set: (n) => { v = n; try { localStorage.setItem(HPL_KEY, JSON.stringify({ opt: n })); } catch (e) {} subs.forEach((f) => f(n)); }, sub: (f) => { subs.add(f); return () => subs.delete(f); } };
})();
const useHpl = () => { const [v, setV] = React.useState(hplStore.get()); React.useEffect(() => hplStore.sub(setV), []); return v; };

const HplField = () => {
  const gs = useGs(); const field = React.useRef(null);
  React.useEffect(() => {
    const f = field.current; if (!f) return undefined;
    const on = (e) => { if (e.pointerType !== 'mouse' && e.target.closest('.gs-hero-name, .gs-hero-shapes4')) f.classList.add('is-on'); };
    const off = () => f.classList.remove('is-on'); const ends = ['pointerup', 'pointercancel', 'pointerleave'];
    f.addEventListener('pointerdown', on); ends.forEach((t) => f.addEventListener(t, off));
    return () => { f.removeEventListener('pointerdown', on); ends.forEach((t) => f.removeEventListener(t, off)); };
  }, []);
  return (
    <div className="gs-hero-field" ref={field}>
      <div className="gs-hero-shapes4" aria-hidden="true" onClick={() => gs.go(GS_GAMES.casebook.route)}>
        <i style={{ background: '#D66847', '--h': '62%', '--rise': '12px' }}></i>
        <i style={{ background: '#A390B2', '--h': '86%', '--rise': '6px' }}></i>
        <i style={{ background: '#F2EBE0', '--h': '66%', '--rise': '18px' }}></i>
        <b></b>
      </div>
      <button type="button" className="gs-hero-name" onClick={() => gs.go(GS_GAMES.casebook.route)}>
        <span className="gs-label">A NEW CASE EVERY WEEK</span>
        <span className="gs-hero-name-t">{GS_NAME.casebook} <DS.Icon name="down" size={20} style={{ transform: 'rotate(-90deg)' }} /></span>
      </button>
      <DS.ChatPlayback turns={GS_HERO_CHAT} loop mark={GS_CHAT_MARK} toolBy={GS_CHAT_BY} height={340} width={480} label="A Casebook case being played in a chat" />
    </div>
  );
};
const HplHero = ({ opt }) => {
  const gs = useGs();
  return (
    <section className="gs-hero3">
      <div className="gs-hero-copy">
        <h1 className="gs-h1 gs-h1-home"><span>Your AI does the talking.</span> <span>The game keeps the score.</span></h1>
        <p className="gs-hero-sub">Play small games by talking to Claude or ChatGPT. The game holds the rules, the dice and your record.</p>
        <div className="gs-hero-act">
          <DS.Button onClick={gs.startFree}>Start free</DS.Button>
          <DS.Button variant="secondary" onClick={gs.goHow}>See how it works</DS.Button>
        </div>
        {opt === 1 && <div className="gs-works hpl-free" data-hpl=""><span className="gs-label">WHAT’S FREE</span><CprPassPara className="gs-muted gs-pu-wrap" /></div>}
        <div className={'gs-works' + (opt === 1 ? ' hpl-works-after' : '')}><span className="gs-label">WORKS WITH</span><p className="gs-muted">{GS.works}</p></div>
      </div>
      <HplField />
    </section>
  );
};
const HplGames = () => {
  const gs = useGs();
  return (
    <section className="gs-band">
      <DS.CardRow title="Available games" className="gs-row4">
        {GS_HOME_GAMES.map((k) => <GsFeature key={k} id={k} />)}
      </DS.CardRow>
      <div className="gs-grid2">{GS_SOON.map((g) => <GsSoonCard key={g.name} g={g} />)}</div>
      <div><DS.TextLink onClick={() => gs.go('games')}>All games</DS.TextLink></div>
    </section>
  );
};
const HplPrice = () => (
  <p className="hpl-price"><span>{GS_PLAN.yearly.price}</span> <span className="gs-muted">or {GS_PLAN.monthly.price}</span></p>
);
const HplPass = ({ opt }) => {
  if (opt === 0) return (
    <section className="gs-band gs-pu-band" data-hpl="">
      <div className="gs-stack-sm">
        <h2 className="mcp-t-sec">The Pass</h2>
        <CprPassPara className="gs-pu-wrap" />
        <p className="gs-small gs-pu-wrap">{GS.purchase}</p>
      </div>
    </section>
  );
  if (opt === 2) return (
    <section className="gs-band">
      <DS.Card className="hpl-card">
        <div className="hpl-card-in" data-hpl="">
          <div className="hpl-block" aria-hidden="true"><i style={{ background: '#D66847' }}></i><i style={{ background: '#A390B2' }}></i><i style={{ background: '#F2EBE0' }}></i><i style={{ background: '#4CC38A' }}></i></div>
          <h2 className="mcp-t-sec">The Pass</h2>
          <CprPassPara className="gs-pu-wrap hpl-card-line" />
          <HplPrice />
          <p className="gs-small gs-pu-wrap">{GS.purchase}</p>
        </div>
      </DS.Card>
    </section>
  );
  if (opt === 3) return (
    <section className="gs-band hpl-split" data-hpl="">
      <div className="gs-stack-sm">
        <h2 className="mcp-t-sec">The Pass</h2>
        <CprPassPara className="gs-pu-wrap" />
      </div>
      <div className="hpl-split-price">
        <HplPrice />
        <p className="gs-small gs-pu-wrap">{GS.purchase}</p>
      </div>
    </section>
  );
  if (opt === 4) {
    const ids = CPR_SHOWN.filter((k) => CPR_STAGE[k] === 'pass');
    return (
      <section className="gs-band" data-hpl="">
        <div className="gs-stack-sm">
          <h2 className="mcp-t-sec">The Pass</h2>
          <CprPassPara className="gs-pu-wrap" />
        </div>
        <DS.CardRow title="Comes with the Pass" kind="tiles">{ids.map((k) => <GsTile key={k} id={k} pass />)}</DS.CardRow>
        <p className="gs-small gs-pu-wrap">{GS.purchase}</p>
      </section>
    );
  }
  return null;
};
const HplHome = () => {
  const opt = useHpl();
  return (
    <main className="gs-wrap gs-main gs-home">
      <HplHero opt={opt} />
      {opt === 3 && <HplPass opt={3} />}
      <HplGames />
      {opt !== 1 && opt !== 3 && <HplPass opt={opt} />}
      <GsWhatsNew />
    </main>
  );
};

// ---- The tooling strip: pinned to the bottom, not product. ----
const hplScrollTo = (el) => {
  let p = el.parentElement;
  while (p && p !== document.body) { const s = getComputedStyle(p).overflowY; if ((s === 'auto' || s === 'scroll') && p.scrollHeight > p.clientHeight) break; p = p.parentElement; }
  const top = el.getBoundingClientRect().top;
  if (p && p !== document.body) p.scrollTo({ top: p.scrollTop + top - p.getBoundingClientRect().top - 96, behavior: 'smooth' });
  else window.scrollTo({ top: window.scrollY + top - 96, behavior: 'smooth' });
  el.classList.remove('hpl-ring'); void el.offsetWidth; el.classList.add('hpl-ring');
  setTimeout(() => el.classList.remove('hpl-ring'), 1800);
};
const HplStrip = () => {
  const opt = useHpl(); const [open, setOpen] = React.useState(true); const [why, setWhy] = React.useState(false);
  const o = HPL_OPTS.find((x) => x.n === opt);
  const show = () => { const el = [...document.querySelectorAll('[data-hpl]')].pop(); if (el) hplScrollTo(el); };
  if (!open) return <button type="button" className="hpl-tab" onClick={() => setOpen(true)}>Home · Pass {opt}</button>;
  return (
    <div className="hpl-strip" role="region" aria-label="Playground options">
      {why && <div className="hpl-why"><p><b>{o.n} · {o.name}.</b> {o.stance}</p><p className="hpl-cost">Cost: {o.cost}</p></div>}
      <div className="hpl-bar">
        <div className="hpl-seg" role="radiogroup" aria-label="Option">
          {HPL_OPTS.map((x) => <button key={x.n} type="button" role="radio" aria-checked={x.n === opt} title={x.name} className={x.n === opt ? 'is-on' : ''} onClick={() => { hplStore.set(x.n); setTimeout(show, 80); }}>{x.n}</button>)}
        </div>
        <span className="hpl-name">{o.name}</span>
        <button type="button" className="hpl-btn" aria-expanded={why} onClick={() => setWhy(!why)}>Why</button>
        <button type="button" className="hpl-btn" onClick={show}>Show</button>
        <button type="button" className="hpl-btn" aria-label="Hide the strip" onClick={() => { setOpen(false); setWhy(false); }}>Hide</button>
      </div>
    </div>
  );
};
(() => { const d = document.createElement('div'); d.id = 'hpl-strip-root'; document.body.appendChild(d); ReactDOM.createRoot(d).render(<HplStrip />); })();

Object.assign(window, { GsHome: HplHome });
