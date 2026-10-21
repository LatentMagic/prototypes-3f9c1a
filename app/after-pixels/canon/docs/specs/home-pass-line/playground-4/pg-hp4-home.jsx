// Playground: home-pass-line round 4. The Pass card is playground 3's 10 without its edge, always second in Available games.
// What changes is the words: the line under "Available games" and the card's text, written as pairs (owner, 2026-10-21).
// Two switches apply to every pairing: the card dark or inverted, and See pricing as a link or a button.
const HP4_KEY = 'pg_home-pass-line-4_v1';
const hp4Price = (() => {
  const m = GS_PLAN.monthly.price, y = GS_PLAN.yearly.price;
  const per = gsNb('£' + (parseFloat(GS_PLAN.yearly.due.replace('£', '')) / GS_PLAN.yearly.months).toFixed(2) + ' a month');
  return { m, y, per };
})();
const hp4Canon = () => { const c = cprPassLine(); return c.p1 + c.lead + 'the Pass.'; };
const HP4_OPTS = [
  { n: 'A', name: '10 as it was, no edge',
    sub: () => null,
    card: () => <>Every game, every edition. <span className="hp2-price">{hp4Price.m}</span> or <span className="hp2-price">{hp4Price.y}</span>.</>, link: 'See pricing',
    stance: 'Playground 3’s 10 with the off-white edge taken off, and no line under the row. The baseline to compare the others with.',
    cost: 'Nothing on the row says the Pass exists. The card’s line has no verb, which the voice doesn’t allow.' },
  { n: 'B', name: 'The canon line over the row',
    sub: hp4Canon,
    card: () => <>You get every game and every edition. It’s <span className="hp2-price">{hp4Price.m}</span> or <span className="hp2-price">{hp4Price.y}</span>.</>, link: 'See pricing',
    stance: 'Home’s ratified Pass line moves up to sit under “Available games”, so the row explains itself before the card does. The card then says what you get and what it costs.',
    cost: 'The line is long for a row heading; on a phone it runs to three lines.' },
  { n: 'C', name: 'Free first, then the Pass',
    sub: () => 'Some games start free. The rest come with the Pass.',
    card: () => <>Play every game in the library and every edition you missed. It’s <span className="hp2-price">{hp4Price.m}</span>.</>, link: 'See pricing',
    stance: 'A short line splits the row into what’s free and what the Pass opens. The card shows one price, the monthly one, as the way in.',
    cost: '“Some games” doesn’t say which. The Pass mark on each picture has to answer that.' },
  { n: 'D', name: 'An account, or the Pass',
    sub: () => 'Start the free games with an account. Play all of them with the Pass.',
    card: () => <>Every new game joins on its release day. It’s <span className="hp2-price">{hp4Price.y}</span> or <span className="hp2-price">{hp4Price.m}</span>.</>, link: 'What’s included',
    stance: 'The line sets out the two ways to play. The card sells what keeps coming, leads with the yearly price, and its link names what’s behind it, as in How it works.',
    cost: 'The card no longer says “every edition”; earlier editions are left to the Pass page.' },
  { n: 'E', name: 'The lock, and the price per month',
    sub: () => 'Games with the lock come with the Pass.',
    card: () => <>One plan opens every game here. It’s <span className="hp2-price">{hp4Price.per}</span>, paid yearly.</>, link: 'See pricing',
    stance: 'The line teaches the Pass mark on the pictures beside it. The card gives the yearly price as a monthly figure, worked out from the seed.',
    cost: 'A price per month paid yearly is the lowest-looking number, and on a selling line it can read as a trick. Monthly is £3.' },
];
const hp4Store = (() => {
  let v = { opt: 'A', inv: false, cta: 'link' };
  try { const s = JSON.parse(localStorage.getItem(HP4_KEY)); if (s && HP4_OPTS.some((o) => o.n === s.opt)) v = { ...v, ...s }; } catch (e) {}
  const subs = new Set();
  return { get: () => v, set: (p) => { v = { ...v, ...p }; try { localStorage.setItem(HP4_KEY, JSON.stringify(v)); } catch (e) {} subs.forEach((f) => f(v)); }, sub: (f) => { subs.add(f); return () => subs.delete(f); } };
})();
const useHp4 = () => { const [v, setV] = React.useState(hp4Store.get()); React.useEffect(() => hp4Store.sub(setV), []); return v; };

const HP4_GAMES = ['word', 'groups', 'mystery', 'hunter', 'escape', 'delve', 'barrow'];
const HP4_PASS_ALL = CPR_SHOWN.filter((k) => CPR_STAGE[k] === 'pass');
const Hp4Card = ({ o, inv, cta }) => {
  const gs = useGs(); const host = useGsArtHost(); const go = () => gs.go('pass');
  return (
    <DS.GameCard className={'mcp-art-host gs-host hp4-card' + (inv ? ' hp4-inv' : '')}
      art={<div ref={host} className="hp2-mosaic" data-hp3="" aria-hidden="true" onClick={go}>{HP4_PASS_ALL.slice(0, 8).map((k) => <GsArt key={k} art={GS_GAMES[k].art} shape="square" />)}</div>}
      title={<button type="button" className="gs-titlebtn mcp-art-link" onClick={go}>The Pass</button>}
      blurb={o.card()}
      tags={cta === 'button' ? <DS.Button onClick={go}>{o.link}</DS.Button> : <DS.TextLink onClick={go}>{o.link}</DS.TextLink>} />
  );
};

const Hp4Home = () => {
  const { opt, inv, cta } = useHp4(); const gs = useGs(); const field = React.useRef(null);
  const o = HP4_OPTS.find((x) => x.n === opt) || HP4_OPTS[0];
  React.useEffect(() => {
    const el = field.current; if (!el) return undefined;
    const on = (e) => { if (e.pointerType !== 'mouse' && e.target.closest('.gs-hero-name, .gs-hero-shapes4')) el.classList.add('is-on'); };
    const off = () => el.classList.remove('is-on'); const ends = ['pointerup', 'pointercancel', 'pointerleave'];
    el.addEventListener('pointerdown', on); ends.forEach((t) => el.addEventListener(t, off));
    return () => { el.removeEventListener('pointerdown', on); ends.forEach((t) => el.removeEventListener(t, off)); };
  }, []);
  const cards = HP4_GAMES.map((k) => <GsFeature key={k} id={k} />);
  cards.splice(1, 0, <Hp4Card key="pass" o={o} inv={inv} cta={cta} />);
  const sub = o.sub();
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
      <section className="gs-band">
        <DS.CardRow title="Available games" sub={sub || undefined} className="gs-row4">{cards}</DS.CardRow>
        <div className="gs-grid2">{GS_SOON.map((g) => <GsSoonCard key={g.name} g={g} />)}</div>
        <div><DS.TextLink onClick={() => gs.go('games')}>All games</DS.TextLink></div>
      </section>
      <GsWhatsNew />
    </main>
  );
};

// ---- The tooling strip: pinned to the bottom, not product. ----
const hp4Show = () => {
  const el = document.querySelector('.mcp-crow'); if (!el) return;
  let p = el.parentElement;
  while (p && p !== document.body) { const s = getComputedStyle(p).overflowY; if ((s === 'auto' || s === 'scroll') && p.scrollHeight > p.clientHeight) break; p = p.parentElement; }
  const top = el.getBoundingClientRect().top;
  if (p && p !== document.body) p.scrollTo({ top: p.scrollTop + top - p.getBoundingClientRect().top - 24, behavior: 'smooth' });
  else window.scrollTo({ top: window.scrollY + top - 24, behavior: 'smooth' });
};
const Hp4Seg = ({ label, items, value, onPick }) => (
  <div className="hpl-seg" role="radiogroup" aria-label={label}>
    {items.map(([v, l]) => <button key={String(v)} type="button" role="radio" aria-checked={v === value} className={'is-wide' + (v === value ? ' is-on' : '')} onClick={() => onPick(v)}>{l}</button>)}
  </div>
);
const Hp4Strip = () => {
  const { opt, inv, cta } = useHp4(); const [open, setOpen] = React.useState(true); const [why, setWhy] = React.useState(false);
  const o = HP4_OPTS.find((x) => x.n === opt) || HP4_OPTS[0];
  if (!open) return <button type="button" className="hpl-tab" onClick={() => setOpen(true)}>Pass card {opt}</button>;
  return (
    <div className="hpl-strip" role="region" aria-label="Playground options">
      {why && <div className="hpl-why"><p><b>{o.n} · {o.name}.</b> {o.stance}</p><p className="hpl-cost">Cost: {o.cost}</p></div>}
      <div className="hpl-bar">
        <Hp4Seg label="Copy pairing" items={HP4_OPTS.map((x) => [x.n, x.n])} value={opt} onPick={(v) => hp4Store.set({ opt: v })} />
        <Hp4Seg label="Card" items={[[false, 'Dark'], [true, 'Inverted']]} value={inv} onPick={(v) => hp4Store.set({ inv: v })} />
        <Hp4Seg label="Link as" items={[['link', 'Link'], ['button', 'Button']]} value={cta} onPick={(v) => hp4Store.set({ cta: v })} />
        <span className="hpl-name">{o.name}</span>
        <button type="button" className="hpl-btn" aria-expanded={why} onClick={() => setWhy(!why)}>Why</button>
        <button type="button" className="hpl-btn" onClick={hp4Show}>Show</button>
        <button type="button" className="hpl-btn" aria-label="Hide the strip" onClick={() => { setOpen(false); setWhy(false); }}>Hide</button>
      </div>
    </div>
  );
};
(() => { const d = document.createElement('div'); d.id = 'hpl-strip-root'; document.body.appendChild(d); ReactDOM.createRoot(d).render(<Hp4Strip />); })();

Object.assign(window, { GsHome: Hp4Home });
