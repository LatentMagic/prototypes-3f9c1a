// Playground: home-pass-line round 5. Two questions, two axes (owner, 2026-10-21):
// the card: it stays a GameCard and must read as not a game; the line: what, if anything, sits under "Available games".
// Always first in the row (owner, 2026-10-21: on a phone the Pass card isn't seen second).
const HP5_KEY = 'pg_home-pass-line-5_v1';
const Hp5Price = () => <><span className="hp2-price">{GS_PLAN.monthly.price}</span> or <span className="hp2-price">{GS_PLAN.yearly.price}</span></>;
const HP5_CARDS = [
  { n: 1, name: 'As it is (round 4’s A)', stance: 'The baseline: a game card titled The Pass, its picture eight Pass covers.', cost: 'Reads as a game called The Pass.' },
  { n: 2, name: 'A label over the name', stance: 'A small caps label over the name, as Coming soon and the hero label their content. No game in the row has one, so the card reads as a different kind of thing before its name is read.', cost: 'One more line of text in the card.' },
  { n: 3, name: 'The lock in the name', stance: 'The lock from the Pass mark sits before the name. Every Pass game in the row carries that lock on its picture, so the card names what the locks mean.', cost: 'The lock can also read as “this card is locked”.' },
  { n: 4, name: 'Label and lock', stance: 'Card 2’s label over card 3’s name. The label says what kind of thing the card is; the lock beside “The Pass” ties it to the locks on the Pass games in the row. Neither repeats “Pass”, so the card still names it once.', cost: 'Two signals on one card, where 2 or 3 alone use one.' },
];
const HP5_LINES = [
  { n: 'a', name: 'No line', node: () => null },
  { n: 'b', name: 'Plain line', node: () => 'Some games start free. Every game comes with the Pass.' },
  { n: 'c', name: 'Line with the mark', node: () => <>Games marked <span className="mcp-passmark hp5-inmark"><DS.Icon name="lock" size={14} />Pass</span> come with the Pass.</> },
  { n: 'd', name: 'Line with a link', node: () => { const gs = useGs(); return <>Some games start free. Every game comes with <button type="button" className="gs-inlink" onClick={() => gs.go('pass')}>the Pass</button>.</>; } },
];
const hp5Store = (() => {
  let v = { card: 1, line: 'a', cta: 'link' };
  try { const s = JSON.parse(localStorage.getItem(HP5_KEY)); if (s) { if (HP5_CARDS.some((o) => o.n === s.card)) v.card = s.card; if (HP5_LINES.some((o) => o.n === s.line)) v.line = s.line; if (s.cta) v.cta = s.cta; } } catch (e) {}
  const subs = new Set();
  return { get: () => v, set: (p) => { v = { ...v, ...p }; try { localStorage.setItem(HP5_KEY, JSON.stringify(v)); } catch (e) {} subs.forEach((f) => f(v)); }, sub: (f) => { subs.add(f); return () => subs.delete(f); } };
})();
const useHp5 = () => { const [v, setV] = React.useState(hp5Store.get()); React.useEffect(() => hp5Store.sub(setV), []); return v; };

const HP5_GAMES = ['word', 'groups', 'mystery', 'hunter', 'escape', 'delve', 'barrow'];
const HP5_PASS_ALL = CPR_SHOWN.filter((k) => CPR_STAGE[k] === 'pass');
const HP5_LineNode = ({ n }) => { const L = HP5_LINES.find((x) => x.n === n); const N = L.node; return <N />; };
const Hp5Card = ({ card, cta }) => {
  const gs = useGs(); const host = useGsArtHost(); const go = () => gs.go('pass');
  const name = 'The Pass'; const lock = card === 3 || card === 4; const label = card === 2 || card === 4;
  const btn = <button type="button" className="gs-titlebtn mcp-art-link" onClick={go}>{lock && <DS.Icon name="lock" size={18} className="hp5-lock" />}{name}</button>;
  const title = label ? <><span className="gs-label hp5-label">ONE PLAN, EVERY GAME</span>{btn}</> : btn;
  const blurb = <>Every game, every edition. <Hp5Price />.</>;
  return (
    <DS.GameCard className={'mcp-art-host gs-host hp5-card is-' + card}
      art={<div ref={host} className="hp2-mosaic" data-hp3="" aria-hidden="true" onClick={go}>{HP5_PASS_ALL.slice(0, 8).map((k) => <GsArt key={k} art={GS_GAMES[k].art} shape="square" />)}</div>}
      title={title} blurb={blurb}
      tags={cta === 'button' ? <DS.Button onClick={go}>See pricing</DS.Button> : <DS.TextLink onClick={go}>See pricing</DS.TextLink>} />
  );
};

const Hp5Home = () => {
  const { card, line, cta } = useHp5(); const gs = useGs(); const field = React.useRef(null);
  React.useEffect(() => {
    const el = field.current; if (!el) return undefined;
    const on = (e) => { if (e.pointerType !== 'mouse' && e.target.closest('.gs-hero-name, .gs-hero-shapes4')) el.classList.add('is-on'); };
    const off = () => el.classList.remove('is-on'); const ends = ['pointerup', 'pointercancel', 'pointerleave'];
    el.addEventListener('pointerdown', on); ends.forEach((t) => el.addEventListener(t, off));
    return () => { el.removeEventListener('pointerdown', on); ends.forEach((t) => el.removeEventListener(t, off)); };
  }, []);
  const cards = HP5_GAMES.map((k) => <GsFeature key={k} id={k} />);
  cards.splice(0, 0, <Hp5Card key="pass" card={card} cta={cta} />);
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
        <DS.CardRow title="Available games" sub={line === 'a' ? undefined : <HP5_LineNode n={line} />} className="gs-row4">{cards}</DS.CardRow>
        <div className="gs-grid2">{GS_SOON.map((g) => <GsSoonCard key={g.name} g={g} />)}</div>
        <div><DS.TextLink onClick={() => gs.go('games')}>All games</DS.TextLink></div>
      </section>
      <GsWhatsNew />
    </main>
  );
};

// ---- The tooling strip: pinned to the bottom, not product. ----
const hp5Show = () => {
  const el = document.querySelector('.mcp-crow'); if (!el) return;
  let p = el.parentElement;
  while (p && p !== document.body) { const s = getComputedStyle(p).overflowY; if ((s === 'auto' || s === 'scroll') && p.scrollHeight > p.clientHeight) break; p = p.parentElement; }
  const top = el.getBoundingClientRect().top;
  if (p && p !== document.body) p.scrollTo({ top: p.scrollTop + top - p.getBoundingClientRect().top - 24, behavior: 'smooth' });
  else window.scrollTo({ top: window.scrollY + top - 24, behavior: 'smooth' });
};
const Hp5Seg = ({ label, items, value, onPick, wide }) => (
  <div className="hpl-seg" role="radiogroup" aria-label={label}>
    {items.map(([v, l, t]) => <button key={String(v)} type="button" role="radio" title={t} aria-checked={v === value} className={(wide ? 'is-wide' : '') + (v === value ? ' is-on' : '')} onClick={() => onPick(v)}>{l}</button>)}
  </div>
);
const Hp5Strip = () => {
  const { card, line, cta } = useHp5(); const [open, setOpen] = React.useState(true); const [why, setWhy] = React.useState(false);
  const c = HP5_CARDS.find((x) => x.n === card) || HP5_CARDS[0]; const l = HP5_LINES.find((x) => x.n === line) || HP5_LINES[0];
  if (!open) return <button type="button" className="hpl-tab" onClick={() => setOpen(true)}>Card {card}{line}</button>;
  return (
    <div className="hpl-strip" role="region" aria-label="Playground options">
      {why && <div className="hpl-why"><p><b>Card {c.n} · {c.name}.</b> {c.stance}</p><p className="hpl-cost">Cost: {c.cost}</p></div>}
      <div className="hpl-bar">
        <span className="hpl-lab">Card</span>
        <Hp5Seg label="Card" items={HP5_CARDS.map((x) => [x.n, String(x.n), x.name])} value={card} onPick={(v) => hp5Store.set({ card: v })} />
        <span className="hpl-lab">Line</span>
        <Hp5Seg label="Line under Available games" items={HP5_LINES.map((x) => [x.n, x.n, x.name])} value={line} onPick={(v) => hp5Store.set({ line: v })} />
        <Hp5Seg label="See pricing as" wide items={[['link', 'Link'], ['button', 'Button']]} value={cta} onPick={(v) => hp5Store.set({ cta: v })} />
        <span className="hpl-name">{c.name} · {l.name}</span>
        <button type="button" className="hpl-btn" aria-expanded={why} onClick={() => setWhy(!why)}>Why</button>
        <button type="button" className="hpl-btn" onClick={hp5Show}>Show</button>
        <button type="button" className="hpl-btn" aria-label="Hide the strip" onClick={() => { setOpen(false); setWhy(false); }}>Hide</button>
      </div>
    </div>
  );
};
(() => { const d = document.createElement('div'); d.id = 'hpl-strip-root'; document.body.appendChild(d); ReactDOM.createRoot(d).render(<Hp5Strip />); })();

Object.assign(window, { GsHome: Hp5Home });
