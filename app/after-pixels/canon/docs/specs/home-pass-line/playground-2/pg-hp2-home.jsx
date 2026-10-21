// Playground: the Pass told through Available games, options 1 to 4, built for a phone first. Re-publishes GsHome;
// the hero, Coming soon and What's new are canon's (app/gs-pass-home.jsx). No option has a Pass band.
const HP2_KEY = 'pg_home-pass-line-2_v1';
const HP2_OPTS = [
  { n: 1, name: 'The mark explained', stance: 'Round 2’s 4A, fixed for a phone. The row’s sentence is the Pass mark and one short line: what the mark means, and that every other game starts free. Two lines on a phone, one on desktop.', cost: 'New copy, shorter than the canon Pass line: it no longer counts the free games. No price on Home.' },
  { n: 2, name: 'Sort the row', stance: 'Available games gets three chips: All, Free, With the Pass. With the Pass shows only Pass games and the price under the chips. A visitor asks the question and the row answers it.', cost: 'A control on Home, which has none today. The Pass is one tap away, not in sight.' },
  { n: 3, name: 'The Pass in the row', stance: 'The Pass sits in Available games as a card of its own, third, the same size as the games. Its picture is eight Pass games’ covers; its line carries the price.', cost: 'A card in a games row that is not a game. On a phone it is the third swipe.' },
  { n: 4, name: 'The mark as a band', stance: 'On every Pass game in the row, the small Pass mark becomes a band across the foot of the picture: “Comes with the Pass”, in words. On a phone the first card is free and the band on the second shows in the peek.', cost: 'Changes the design system’s Pass mark for this row only; on cards elsewhere it stays the chip.' },
];
const hp2Store = (() => {
  let v = 1; try { const s = JSON.parse(localStorage.getItem(HP2_KEY)); if (s && HP2_OPTS.some((o) => o.n === s.opt)) v = s.opt; } catch (e) {}
  const subs = new Set();
  return { get: () => v, set: (n) => { v = n; try { localStorage.setItem(HP2_KEY, JSON.stringify({ opt: n })); } catch (e) {} subs.forEach((f) => f(n)); }, sub: (f) => { subs.add(f); return () => subs.delete(f); } };
})();
const useHp2 = () => { const [v, setV] = React.useState(hp2Store.get()); React.useEffect(() => hp2Store.sub(setV), []); return v; };

// Owner, 2026-10-20 (round 2): a few Pass games in the row, so one or two land in the first four.
const HP2_GAMES = ['word', 'groups', 'mystery', 'hunter', 'escape', 'delve', 'barrow'];
const HP2_PASS_ALL = CPR_SHOWN.filter((k) => CPR_STAGE[k] === 'pass');
const hp2Free = (k) => CPR_STAGE[k] && CPR_STAGE[k] !== 'pass';

const Hp2PassLink = ({ children = 'the Pass' }) => {
  const gs = useGs();
  return <button type="button" className="gs-inlink" onClick={() => gs.go('pass')}>{children}</button>;
};
const Hp2Key = () => (
  <span className="hp2-key" data-hp2="">
    <span className="mcp-passmark hp2-mark"><DS.Icon name="lock" size={14} />Pass</span>
    <span>Comes with <Hp2PassLink />. Every other game starts free.</span>
  </span>
);

const Hp2BandCard = ({ id }) => {
  const gs = useGs(); const host = useGsArtHost(); const g = GS_GAMES[id]; const locked = cprLocked(gs, id);
  return (
    <DS.GameCard className="mcp-art-host gs-host"
      art={<><CprArt host={host} id={id} shape="wide" />{locked && <button type="button" className="hp2-band" data-hp2="" onClick={() => gs.go('pass')}><DS.Icon name="lock" size={14} /><span>Comes with the Pass</span><DS.Icon name="down" size={14} style={{ transform: 'rotate(-90deg)' }} /></button>}</>}
      title={<button type="button" className="gs-titlebtn mcp-art-link" onClick={() => gs.go(g.route)}>{g.name}</button>}
      blurb={gsKeepLast(g.blurb)}
      tags={<GsTagList tags={cprTags(id)} ed={g.ed} />} />
  );
};

const Hp2PassCard = () => {
  const gs = useGs(); const host = useGsArtHost();
  return (
    <DS.GameCard className="mcp-art-host gs-host"
      art={<div ref={host} className="hp2-mosaic" data-hp2="" aria-hidden="true" onClick={() => gs.go('pass')}>{HP2_PASS_ALL.slice(0, 8).map((k) => <GsArt key={k} art={GS_GAMES[k].art} shape="square" />)}</div>}
      title={<button type="button" className="gs-titlebtn mcp-art-link" onClick={() => gs.go('pass')}>The Pass</button>}
      blurb={<>Every game, every edition. <span className="hp2-price">{GS_PLAN.monthly.price}</span> or <span className="hp2-price">{GS_PLAN.yearly.price}</span>.</>}
      tags={null} />
  );
};

const HP2_FILTERS = [['all', 'All'], ['free', 'Free'], ['pass', 'With the Pass']];
const Hp2Filter = ({ on, set }) => (
  <span className="hp2-filter" data-hp2="">
    <span className="dc-chips" role="group" aria-label="Show">
      {HP2_FILTERS.map(([v, l]) => <button key={v} type="button" aria-pressed={on === v} onClick={() => set(v)}>{l}</button>)}
    </span>
    {on === 'free' && <span>Free with an account. No card needed.</span>}
    {on === 'pass' && <span>{GS_PLAN.monthly.price} or {GS_PLAN.yearly.price}. <Hp2PassLink>See the Pass</Hp2PassLink></span>}
  </span>
);

const Hp2Games = ({ opt }) => {
  const gs = useGs(); const [f, setF] = React.useState('all');
  let ids = HP2_GAMES;
  if (opt === 2 && f === 'free') ids = HP2_GAMES.filter(hp2Free);
  if (opt === 2 && f === 'pass') ids = HP2_PASS_ALL.slice(0, 6);
  const cards = ids.map((k) => opt === 4 ? <Hp2BandCard key={k} id={k} /> : <GsFeature key={k} id={k} />);
  if (opt === 3) cards.splice(2, 0, <Hp2PassCard key="pass" />);
  const sub = opt === 1 ? <Hp2Key /> : opt === 2 ? <Hp2Filter on={f} set={setF} /> : undefined;
  return (
    <section className="gs-band">
      <DS.CardRow key={opt + f} title="Available games" className="gs-row4" sub={sub}>{cards}</DS.CardRow>
      <div className="gs-grid2">{GS_SOON.map((g) => <GsSoonCard key={g.name} g={g} />)}</div>
      <div><DS.TextLink onClick={() => gs.go('games')}>All games</DS.TextLink></div>
    </section>
  );
};

const Hp2Home = () => {
  const opt = useHp2(); const gs = useGs(); const field = React.useRef(null);
  React.useEffect(() => {
    const el = field.current; if (!el) return undefined;
    const on = (e) => { if (e.pointerType !== 'mouse' && e.target.closest('.gs-hero-name, .gs-hero-shapes4')) el.classList.add('is-on'); };
    const off = () => el.classList.remove('is-on'); const ends = ['pointerup', 'pointercancel', 'pointerleave'];
    el.addEventListener('pointerdown', on); ends.forEach((t) => el.addEventListener(t, off));
    return () => { el.removeEventListener('pointerdown', on); ends.forEach((t) => el.removeEventListener(t, off)); };
  }, []);
  return (
    <main className="gs-wrap gs-main gs-home">
      <section className="gs-hero3">
        <div className="gs-hero-copy">
          <h1 className="gs-h1 gs-h1-home"><span>Your AI does the talking.</span> <span>The game keeps the score.</span></h1>
          <p className="gs-hero-sub">Play small games by talking to Claude or ChatGPT. The game holds the rules, the dice and your record.</p>
          <div className="gs-hero-act">
            <DS.Button onClick={gs.startFree}>Start free</DS.Button>
            <DS.Button variant="secondary" onClick={gs.goHow}>See how it works</DS.Button>
          </div>
          <div className="gs-works"><span className="gs-label">WORKS WITH</span><p className="gs-muted">{GS.works}</p></div>
        </div>
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
      </section>
      <Hp2Games opt={opt} />
      <GsWhatsNew />
    </main>
  );
};

// ---- The tooling strip: pinned to the bottom, not product. ----
const hp2ScrollTo = (el) => {
  let p = el.parentElement;
  while (p && p !== document.body) { const s = getComputedStyle(p).overflowY; if ((s === 'auto' || s === 'scroll') && p.scrollHeight > p.clientHeight) break; p = p.parentElement; }
  const top = el.getBoundingClientRect().top;
  if (p && p !== document.body) p.scrollTo({ top: p.scrollTop + top - p.getBoundingClientRect().top - 120, behavior: 'smooth' });
  else window.scrollTo({ top: window.scrollY + top - 120, behavior: 'smooth' });
  const ring = el.closest('.mcp-crow') || el;
  ring.classList.remove('hpl-ring'); void ring.offsetWidth; ring.classList.add('hpl-ring');
  setTimeout(() => ring.classList.remove('hpl-ring'), 1800);
};
const Hp2Strip = () => {
  const opt = useHp2(); const [open, setOpen] = React.useState(true); const [why, setWhy] = React.useState(false);
  const o = HP2_OPTS.find((x) => x.n === opt) || HP2_OPTS[0];
  const show = () => { const el = document.querySelector('[data-hp2]'); if (el) hp2ScrollTo(el); };
  if (!open) return <button type="button" className="hpl-tab" onClick={() => setOpen(true)}>Home · Pass {opt}</button>;
  return (
    <div className="hpl-strip" role="region" aria-label="Playground options">
      {why && <div className="hpl-why"><p><b>{o.n} · {o.name}.</b> {o.stance}</p><p className="hpl-cost">Cost: {o.cost}</p></div>}
      <div className="hpl-bar">
        <div className="hpl-seg" role="radiogroup" aria-label="Option">
          {HP2_OPTS.map((x) => <button key={x.n} type="button" role="radio" aria-checked={x.n === opt} title={x.name} className={x.n === opt ? 'is-on' : ''} onClick={() => { hp2Store.set(x.n); setTimeout(show, 120); }}>{x.n}</button>)}
        </div>
        <span className="hpl-name">{o.name}</span>
        <button type="button" className="hpl-btn" aria-expanded={why} onClick={() => setWhy(!why)}>Why</button>
        <button type="button" className="hpl-btn" onClick={show}>Show</button>
        <button type="button" className="hpl-btn" aria-label="Hide the strip" onClick={() => { setOpen(false); setWhy(false); }}>Hide</button>
      </div>
    </div>
  );
};
(() => { const d = document.createElement('div'); d.id = 'hpl-strip-root'; document.body.appendChild(d); ReactDOM.createRoot(d).render(<Hp2Strip />); })();

Object.assign(window, { GsHome: Hp2Home });
