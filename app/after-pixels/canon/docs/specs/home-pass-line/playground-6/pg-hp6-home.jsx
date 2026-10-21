// Playground: home-pass-line round 6. Card 3 from round 5 (the lock before "The Pass"), first in the row.
// Two axes (owner, 2026-10-21): copy, taken whole (the card's text and whether a line sits under "Available games"), and the action.
// Invariant (owner): the Pass card is never taller than the game cards. The strip's meter measures it.
const HP6_KEY = 'pg_home-pass-line-6_v1';
const Hp6Price = () => <><span className="hp2-price">{GS_PLAN.monthly.price}</span> or <span className="hp2-price">{GS_PLAN.yearly.price}</span></>;
const Hp6Free = () => <span className="hp6-intag"><DS.Tag kind="free">Free</DS.Tag></span>;
const HP6_COPY = [
  { n: 1, name: 'Start free', blurb: 'Start free with an account. The Pass opens every game.', line: null,
    stance: 'Starts with what costs nothing, then what the Pass adds. "Start free" is the hero button’s own words, so the page says one thing twice in the same voice.',
    cost: 'It doesn’t say which games are free. The Free chips on each game do that.' },
  { n: 2, name: 'Account and Pass, side by side', blurb: 'An account plays the free games. The Pass plays them all.', line: null,
    stance: 'Two sentences built the same way, so the difference between them is the message: the free games, or all of them.',
    cost: 'An account doing the playing is a slight stretch; you do the playing.' },
  { n: 3, name: 'The card explains the chips', blurb: 'Free games need only an account. The Pass opens the rest.', line: null,
    stance: 'The row already marks each game Free or with the lock. The card names both marks, so the row explains itself with no line above it.',
    cost: '"The rest" leans on the reader having seen the other cards first; first in the row, they haven’t yet.' },
  { n: 4, name: 'Free in the line, the Pass on the card', blurb: 'You get every game and every edition for one price.', line: () => <>Games marked <Hp6Free /> need only an account.</>,
    stance: 'Each says one thing. The line under the heading says what’s free, using the Free chip itself; the card says what the Pass gives. No line mentions the Pass twice.',
    cost: 'A first-edition chip reads "First room free", not "Free", so the line covers it only loosely. One more line on the page.' },
  { n: 5, name: 'The line sets the deal', blurb: 'You get every game and every edition.', line: () => 'Make a free account to play, then add the Pass for every game.',
    stance: 'The line under the heading carries the whole offer, account then Pass. The card stays short, a name and one sentence, which makes it the calmest card in the row.',
    cost: 'The line and the card both say "every game". One more line on the page.' },
];
const HP6_ACTS = [
  { n: 'a', name: 'Price as the link', stance: 'The price is the link, so the chip line carries both the price and the way to pricing. The link names what’s behind it.', cost: 'A price as a link is less familiar than "See pricing".' },
  { n: 'b', name: 'Chevron, whole card', stance: 'The design system’s clickable sign: a chevron after the name, the whole card the target, as Card and ListRow do. The price sits in the chip line as plain text.', cost: 'No game card has a chevron, which is also why it reads as different.' },
  { n: 'c', name: 'Button on the picture', stance: 'A main button sits on the mosaic’s lower edge. It pops as much as any button and adds no height, because the picture has room.', cost: 'It covers part of two covers; the design system keeps pictures to covers and the Pass mark.' },
  { n: 'd', name: 'Secondary, full width', stance: 'The secondary button across the card, where the chips go.', cost: 'A button is 48px; the chips are shorter. It grows every card in the row: see the meter.' },
  { n: 'e', name: 'Main, full width', stance: 'The main button across the card, where the chips go. The most pop.', cost: 'The same height cost as d, and a second main button on a page whose hero already has Start free.' },
];
const hp6Store = (() => {
  let v = { copy: 1, act: 'a' };
  try { const s = JSON.parse(localStorage.getItem(HP6_KEY)); if (s) { if (HP6_COPY.some((o) => o.n === s.copy)) v.copy = s.copy; if (HP6_ACTS.some((o) => o.n === s.act)) v.act = s.act; } } catch (e) {}
  const subs = new Set();
  return { get: () => v, set: (p) => { v = { ...v, ...p }; try { localStorage.setItem(HP6_KEY, JSON.stringify(v)); } catch (e) {} subs.forEach((f) => f(v)); }, sub: (f) => { subs.add(f); return () => subs.delete(f); } };
})();
const useHp6 = () => { const [v, setV] = React.useState(hp6Store.get()); React.useEffect(() => hp6Store.sub(setV), []); return v; };

const HP6_GAMES = ['word', 'groups', 'mystery', 'hunter', 'escape', 'delve', 'barrow'];
const HP6_PASS_ALL = CPR_SHOWN.filter((k) => CPR_STAGE[k] === 'pass');
const Hp6Card = ({ copy, act }) => {
  const gs = useGs(); const host = useGsArtHost(); const go = () => gs.go('pass');
  const C = HP6_COPY.find((x) => x.n === copy);
  const title = (
    <button type="button" className="gs-titlebtn mcp-art-link" onClick={go}>
      <DS.Icon name="lock" size={18} className="hp5-lock" />The Pass
      {act === 'b' && <span className="hp6-chev" aria-hidden="true"><DS.Icon name="down" size={18} style={{ transform: 'rotate(-90deg)' }} /></span>}
    </button>
  );
  const mosaic = <div ref={host} className="hp2-mosaic" data-hp3="" aria-hidden="true" onClick={go}>{HP6_PASS_ALL.slice(0, 8).map((k) => <GsArt key={k} art={GS_GAMES[k].art} shape="square" />)}</div>;
  const art = act === 'c' ? <div className="hp6-artwrap">{mosaic}<DS.Button onClick={go}>See pricing</DS.Button></div> : mosaic;
  const tags = act === 'a' ? <DS.TextLink onClick={go}>{GS_PLAN.monthly.price + ' or ' + GS_PLAN.yearly.price}</DS.TextLink>
    : act === 'd' ? <DS.Button variant="secondary" block className="hp6-full" onClick={go}>See pricing</DS.Button>
    : act === 'e' ? <DS.Button block className="hp6-full" onClick={go}>See pricing</DS.Button>
    : <span className="hp6-price"><Hp6Price /></span>;
  return <DS.GameCard className={'mcp-art-host gs-host hp6-card is-' + act} art={art} title={title} blurb={C.blurb} tags={tags} />;
};

const Hp6Home = () => {
  const { copy, act } = useHp6(); const gs = useGs(); const field = React.useRef(null);
  React.useEffect(() => {
    const el = field.current; if (!el) return undefined;
    const on = (e) => { if (e.pointerType !== 'mouse' && e.target.closest('.gs-hero-name, .gs-hero-shapes4')) el.classList.add('is-on'); };
    const off = () => el.classList.remove('is-on'); const ends = ['pointerup', 'pointercancel', 'pointerleave'];
    el.addEventListener('pointerdown', on); ends.forEach((t) => el.addEventListener(t, off));
    return () => { el.removeEventListener('pointerdown', on); ends.forEach((t) => el.removeEventListener(t, off)); };
  }, []);
  const C = HP6_COPY.find((x) => x.n === copy); const Line = C.line;
  const cards = [<Hp6Card key="pass" copy={copy} act={act} />, ...HP6_GAMES.map((k) => <GsFeature key={k} id={k} />)];
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
        <DS.CardRow title="Available games" sub={Line ? <Line /> : undefined} className="gs-row4">{cards}</DS.CardRow>
        <div className="gs-grid2">{GS_SOON.map((g) => <GsSoonCard key={g.name} g={g} />)}</div>
        <div><DS.TextLink onClick={() => gs.go('games')}>All games</DS.TextLink></div>
      </section>
      <GsWhatsNew />
    </main>
  );
};

// ---- The tooling strip: pinned to the bottom, not product. ----
// Meter: how much taller the Pass card's text and chip lines are than the tallest game card's. The row shares those lines, so any excess grows every card.
const hp6Excess = () => {
  const track = document.querySelector('.gs-band .mcp-crow-track'); if (!track) return null;
  const part = (c, sel) => { const el = c.querySelector(sel); if (!el || !el.children.length) return 0; const r = [...el.children].map((k) => { const b = k.getBoundingClientRect(), cs = getComputedStyle(k); return { top: b.top - parseFloat(cs.marginTop), bottom: b.bottom + parseFloat(cs.marginBottom) }; }); return Math.max(...r.map((x) => x.bottom)) - Math.min(...r.map((x) => x.top)); };
  let gt = 0, gg = 0, pt = 0, pg = 0;
  [...track.children].filter((c) => c.classList.contains('mcp-gcard')).forEach((c) => {
    const t = part(c, '.mcp-gcard-text'), g = part(c, '.mcp-gcard-tags');
    if (c.classList.contains('hp6-card')) { pt = t; pg = g; } else { gt = Math.max(gt, t); gg = Math.max(gg, g); }
  });
  return Math.round(Math.max(0, pt - gt) + Math.max(0, pg - gg));
};
const hp6Show = () => {
  const el = document.querySelector('.mcp-crow'); if (!el) return;
  let p = el.parentElement;
  while (p && p !== document.body) { const s = getComputedStyle(p).overflowY; if ((s === 'auto' || s === 'scroll') && p.scrollHeight > p.clientHeight) break; p = p.parentElement; }
  const top = el.getBoundingClientRect().top;
  if (p && p !== document.body) p.scrollTo({ top: p.scrollTop + top - p.getBoundingClientRect().top - 24, behavior: 'smooth' });
  else window.scrollTo({ top: window.scrollY + top - 24, behavior: 'smooth' });
};
const Hp6Seg = ({ label, items, value, onPick }) => (
  <div className="hpl-seg" role="radiogroup" aria-label={label}>
    {items.map(([v, l, t]) => <button key={String(v)} type="button" role="radio" title={t} aria-checked={v === value} className={v === value ? 'is-on' : ''} onClick={() => onPick(v)}>{l}</button>)}
  </div>
);
const Hp6Strip = () => {
  const { copy, act } = useHp6(); const [open, setOpen] = React.useState(true); const [why, setWhy] = React.useState(false); const [ex, setEx] = React.useState(null);
  React.useEffect(() => { const id = setInterval(() => setEx(hp6Excess()), 400); return () => clearInterval(id); }, []);
  const c = HP6_COPY.find((x) => x.n === copy); const a = HP6_ACTS.find((x) => x.n === act);
  if (!open) return <button type="button" className="hpl-tab" onClick={() => setOpen(true)}>Copy {copy}{act}</button>;
  return (
    <div className="hpl-strip" role="region" aria-label="Playground options">
      {why && <div className="hpl-why">
        <p><b>Copy {c.n} · {c.name}.</b> {c.stance}</p><p className="hpl-cost">Cost: {c.cost}</p>
        <p><b>Action {a.n} · {a.name}.</b> {a.stance}</p><p className="hpl-cost">Cost: {a.cost}</p>
      </div>}
      <div className="hpl-bar">
        <span className="hpl-lab">Copy</span>
        <Hp6Seg label="Copy" items={HP6_COPY.map((x) => [x.n, String(x.n), x.name])} value={copy} onPick={(v) => hp6Store.set({ copy: v })} />
        <span className="hpl-lab">Action</span>
        <Hp6Seg label="Action" items={HP6_ACTS.map((x) => [x.n, x.n, x.name])} value={act} onPick={(v) => hp6Store.set({ act: v })} />
        <span className="hpl-name">{c.name} · {a.name}</span>
        {ex !== null && <span className={'hpl-meter' + (ex > 0 ? ' is-bad' : '')}>{ex > 0 ? 'Taller than the games by ' + ex + 'px' : 'Level with the games'}</span>}
        <button type="button" className="hpl-btn" aria-expanded={why} onClick={() => setWhy(!why)}>Why</button>
        <button type="button" className="hpl-btn" onClick={hp6Show}>Show</button>
        <button type="button" className="hpl-btn" aria-label="Hide the strip" onClick={() => { setOpen(false); setWhy(false); }}>Hide</button>
      </div>
    </div>
  );
};
(() => { const d = document.createElement('div'); d.id = 'hpl-strip-root'; document.body.appendChild(d); ReactDOM.createRoot(d).render(<Hp6Strip />); })();

Object.assign(window, { GsHome: Hp6Home });
