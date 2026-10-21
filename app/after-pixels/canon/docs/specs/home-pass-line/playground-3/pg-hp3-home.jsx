// Playground: the Pass as a card in Available games (round 3's option 3, taken further). Two axes: how the card is
// drawn (1 to 3) and where it sits (1st, 2nd, 3rd). Re-publishes GsHome; the hero, Coming soon and What's new are canon's.
const HP3_KEY = 'pg_home-pass-line-3_v1';
// Owner, 2026-10-20: light cards (old 1, 3) and 4 to 6 rejected. 1 is round 2's option 3, which this playground is built on;
// 2 kept; 7 to 9 are new takes on the same principle: the Pass as a card in the games row that is plainly not a game.
const HP3_OPTS = [
  { n: 1, name: 'The Pass in the row (round 2’s 3)', stance: 'As round 2 built it: a card the size of a game, its picture eight Pass games’ covers, its line the price.', cost: 'Reads as another game at a glance; no Pass line and no link under it.' },
  { n: 2, name: 'Edged card', stance: 'A dark card with an off-white edge, a strip of eight Pass covers across its top, the canon Pass line, the price and See pricing.', cost: 'The strip can read as one more game picture.' },
  { n: 7, name: 'A stack of games', stance: 'The card’s picture is three Pass covers stacked like cards in a hand. One game is a picture; the Pass is a stack. It says “more than one” before a word is read.', cost: 'The stack is a new drawing on the shop; it shows three games, not all of them.' },
  { n: 8, name: 'Cover that turns over', stance: 'The card’s picture plays through the Pass games one at a time, each named on the picture. On a phone, where one card shows, that one card shows every Pass game.', cost: 'Movement in a row that is otherwise still; held on the first cover for reduced motion.' },
  { n: 9, name: 'The Pass and its games', stance: 'The card opens a run of the Pass games that follow it, all joined by one off-white rule across their tops. The row reads in two parts: games that start free, then the Pass and what comes with it.', cost: 'The row’s order is set by the Pass, not by what is best to show first.' },
  { n: 10, name: '1, edged, with a link', stance: '1 as it is, with the off-white edge from 2 and See pricing where a game has its tags. The same card shape as the games; the edge is the only thing that sets it apart.', cost: 'The line under the name still isn’t the canon Pass line.' },
  { n: 11, name: '1, lit', stance: '1 with its covers lighting one at a time, the Pass mark on the picture where a Pass game has it, and the two prices as chips where a game has its tags. It pops by moving, not by colour.', cost: 'The only moving picture in the row; still for reduced motion. The chips are prices, not facts about a game.' },
  { n: 12, name: '1, with the canon line', stance: '1 with the covers set apart by off-white lines, so the picture reads as a grid of games, the canon Pass line as its text, and the price and See pricing on its last line. Edged as 2.', cost: 'Its text runs longer than a game’s blurb, so the row grows a line or two.' },
  { n: 13, name: '1, in a cover colour', stance: '1 with the card filled in the deep indigo of the Pass covers, so the card itself reads as part of the art. No edge. The price and See pricing on its last line.', cost: 'The shop keeps colour to covers and status; this puts a cover colour on a card.' },
  { n: 14, name: '1, the picture bigger', stance: '1 with its covers run to the card’s edges and twelve of them, not eight. It pops by having more art than any game, not by a new colour or line. The price and See pricing on its last line.', cost: 'The picture is taller than the games’ pictures, so the row grows by a few pixels.' },
  { n: 15, name: '1, raised', stance: '1 on the lighter pop-up surface with a deeper shadow, lifted a little above the row. It pops by depth: the one card that sits nearer to you. The price and See pricing on its last line.', cost: 'Lifted cards usually mean hover or selection; at rest it may read as pressed or picked.' },
];
const HP3_PLACES = [[0, '1st'], [1, '2nd'], [2, '3rd']];
const hp3Store = (() => {
  let v = { opt: 1, at: 1, cta: 'link' }; try { const s = JSON.parse(localStorage.getItem(HP3_KEY)); if (s && HP3_OPTS.some((o) => o.n === s.opt) && [0, 1, 2].includes(s.at)) v = { ...v, ...s }; } catch (e) {}
  const subs = new Set();
  return { get: () => v, set: (p) => { v = { ...v, ...p }; try { localStorage.setItem(HP3_KEY, JSON.stringify(v)); } catch (e) {} subs.forEach((f) => f(v)); }, sub: (f) => { subs.add(f); return () => subs.delete(f); } };
})();
const useHp3 = () => { const [v, setV] = React.useState(hp3Store.get()); React.useEffect(() => hp3Store.sub(setV), []); return v; };

// Owner, 2026-10-20 (round 2): a few Pass games in the row, so one or two land in the first four.
const HP3_GAMES = ['word', 'groups', 'mystery', 'hunter', 'escape', 'delve', 'barrow'];
const HP3_PASS_ALL = CPR_SHOWN.filter((k) => CPR_STAGE[k] === 'pass');
const HP3_FREE = HP3_GAMES.filter((k) => CPR_STAGE[k] !== 'pass');
const HP3_RUN = ['groups', 'hunter', 'casebook'].filter((k) => GS_GAMES[k]);
const Hp3Cta = ({ cta }) => { const gs = useGs(); return cta === 'button' ? <DS.Button onClick={() => gs.go('pass')}>See pricing</DS.Button> : <DS.TextLink onClick={() => gs.go('pass')}>See pricing</DS.TextLink>; };
// Round 2's option 3, unchanged.
const Hp3Mosaic = () => {
  const gs = useGs(); const host = useGsArtHost();
  return (
    <DS.GameCard className="mcp-art-host gs-host"
      art={<div ref={host} className="hp2-mosaic" data-hp3="" aria-hidden="true" onClick={() => gs.go('pass')}>{HP3_PASS_ALL.slice(0, 8).map((k) => <GsArt key={k} art={GS_GAMES[k].art} shape="square" />)}</div>}
      title={<button type="button" className="gs-titlebtn mcp-art-link" onClick={() => gs.go('pass')}>The Pass</button>}
      blurb={<>Every game, every edition. <span className="hp2-price">{GS_PLAN.monthly.price}</span> or <span className="hp2-price">{GS_PLAN.yearly.price}</span>.</>}
      tags={null} />
  );
};
// 10 to 12: round 2's option 3 (1) played with. Same GameCard, same mosaic.
const Hp3Mosaic2 = ({ cls = '' }) => {
  const gs = useGs(); const host = useGsArtHost();
  return <div ref={host} className={'hp2-mosaic ' + cls} data-hp3="" aria-hidden="true" onClick={() => gs.go('pass')}>{HP3_PASS_ALL.slice(0, 8).map((k) => <GsArt key={k} art={GS_GAMES[k].art} shape="square" />)}</div>;
};
const Hp3Title = () => { const gs = useGs(); return <button type="button" className="gs-titlebtn mcp-art-link" onClick={() => gs.go('pass')}>The Pass</button>; };
const Hp3Blurb1 = () => <>Every game, every edition. <span className="hp2-price">{GS_PLAN.monthly.price}</span> or <span className="hp2-price">{GS_PLAN.yearly.price}</span>.</>;
const Hp3Ten = ({ cta }) => (
  <DS.GameCard className="mcp-art-host gs-host hp3-edge" art={<Hp3Mosaic2 />} title={<Hp3Title />} blurb={<Hp3Blurb1 />} tags={<Hp3Cta cta={cta} />} />
);
const Hp3Eleven = () => {
  const gs = useGs();
  return <DS.GameCard className="mcp-art-host gs-host" art={<Hp3Mosaic2 cls="is-lit" />} pass onPass={() => gs.go('pass')} title={<Hp3Title />} blurb={<Hp3Blurb1 />}
    tags={<span className="mcp-tags hp3-tags"><DS.Tag>{GS_PLAN.monthly.price}</DS.Tag><DS.Tag>{GS_PLAN.yearly.price}</DS.Tag></span>} />;
};
const Hp3Twelve = ({ cta }) => {
  const c = cprPassLine();
  return <DS.GameCard className="mcp-art-host gs-host hp3-edge" art={<Hp3Mosaic2 cls="is-ruled" />} title={<Hp3Title />} blurb={<>{c.p1}{c.lead}the Pass.</>}
    tags={<span className="hp3-last"><span className="hp2-price">{GS_PLAN.monthly.price}</span><Hp3Cta cta={cta} /></span>} />;
};
// 13 to 15: other ways for 1 to pop, no off-white edge.
const Hp3Foot = ({ cta }) => <span className="hp3-last"><span className="hp2-price">{GS_PLAN.monthly.price}</span><Hp3Cta cta={cta} /></span>;
const Hp3Thirteen = ({ cta }) => <DS.GameCard className="mcp-art-host gs-host hp3-ink" art={<Hp3Mosaic2 />} title={<Hp3Title />} blurb={<Hp3Blurb1 />} tags={<Hp3Foot cta={cta} />} />;
const Hp3Fourteen = ({ cta }) => {
  const gs = useGs(); const host = useGsArtHost();
  return <DS.GameCard className="mcp-art-host gs-host hp3-bleed"
    art={<div ref={host} className="hp2-mosaic is-12" data-hp3="" aria-hidden="true" onClick={() => gs.go('pass')}>{HP3_PASS_ALL.slice(0, 12).map((k) => <GsArt key={k} art={GS_GAMES[k].art} shape="square" />)}</div>}
    title={<Hp3Title />} blurb={<Hp3Blurb1 />} tags={<Hp3Foot cta={cta} />} />;
};
const Hp3Fifteen = ({ cta }) => <DS.GameCard className="mcp-art-host gs-host hp3-raised" art={<Hp3Mosaic2 />} title={<Hp3Title />} blurb={<Hp3Blurb1 />} tags={<Hp3Foot cta={cta} />} />;
const Hp3Text = ({ cta }) => {
  const c = cprPassLine();
  return <>
    <h3 className="mcp-t-card"><DS.Icon name="lock" size={18} />The Pass</h3>
    <p>{c.p1}{c.lead}the Pass.</p>
    <div className="hp3-foot"><p className="hp3-price">{GS_PLAN.monthly.price} or {GS_PLAN.yearly.price}</p><Hp3Cta cta={cta} /></div>
  </>;
};
const Hp3Stack = ({ cta }) => (
  <article className="hp3-card is-edge" data-hp3="">
    <div className="hp3-stack" aria-hidden="true">{HP3_RUN.slice().reverse().map((k, i) => <div key={k} className={'hp3-stack-l is-' + i}><GsArt art={GS_GAMES[k].art} shape="wide" /></div>)}</div>
    <Hp3Text cta={cta} />
  </article>
);
const Hp3Cycle = ({ cta }) => {
  const [i, setI] = React.useState(0); const ids = HP3_PASS_ALL.slice(0, 8);
  React.useEffect(() => {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => setI((x) => (x + 1) % ids.length), 2400); return () => clearInterval(t);
  }, []);
  return (
    <article className="hp3-card is-edge" data-hp3="">
      <div className="hp3-cycle" aria-hidden="true">
        {ids.map((k, n) => <div key={k} className={'hp3-cycle-l' + (n === i ? ' is-on' : '')}><GsArt art={GS_GAMES[k].art} shape="wide" /></div>)}
        <span className="mcp-passmark hp3-cycle-name">{GS_GAMES[ids[i]].name}</span>
      </div>
      <Hp3Text cta={cta} />
    </article>
  );
};
const Hp3Edged = ({ cta }) => (
  <article className="hp3-card is-edge" data-hp3="">
    <div className="hp3-strip" aria-hidden="true">{HP3_PASS_ALL.slice(0, 8).map((k) => <GsArt key={k} art={GS_GAMES[k].art} shape="square" />)}</div>
    <Hp3Text cta={cta} />
  </article>
);
const Hp3Lead = ({ cta }) => (
  <article className="hp3-card is-edge hp3-run" data-hp3="">
    <Hp3Text cta={cta} />
  </article>
);
const Hp3RunCard = ({ id, last }) => {
  const gs = useGs(); const host = useGsArtHost(); const g = GS_GAMES[id];
  return (
    <DS.GameCard className={'mcp-art-host gs-host hp3-run' + (last ? ' is-last' : '')}
      art={<CprArt host={host} id={id} shape="wide" />} pass={cprLocked(gs, id)} onPass={() => gs.go('pass')}
      title={<button type="button" className="gs-titlebtn mcp-art-link" onClick={() => gs.go(g.route)}>{g.name}</button>}
      blurb={gsKeepLast(g.blurb)}
      tags={<GsTagList tags={cprTags(id)} ed={g.ed} />} />
  );
};

const Hp3Home = () => {
  const { opt, at, cta } = useHp3(); const gs = useGs(); const field = React.useRef(null);
  React.useEffect(() => {
    const el = field.current; if (!el) return undefined;
    const on = (e) => { if (e.pointerType !== 'mouse' && e.target.closest('.gs-hero-name, .gs-hero-shapes4')) el.classList.add('is-on'); };
    const off = () => el.classList.remove('is-on'); const ends = ['pointerup', 'pointercancel', 'pointerleave'];
    el.addEventListener('pointerdown', on); ends.forEach((t) => el.addEventListener(t, off));
    return () => { el.removeEventListener('pointerdown', on); ends.forEach((t) => el.removeEventListener(t, off)); };
  }, []);
  let cards;
  if (opt === 9) {
    const run = [<Hp3Lead key="pass" cta={cta} />, ...HP3_RUN.map((k, n) => <Hp3RunCard key={k} id={k} last={n === HP3_RUN.length - 1} />)];
    const free = HP3_FREE.map((k) => <GsFeature key={k} id={k} />);
    cards = [...free.slice(0, at), ...run, ...free.slice(at)];
  } else {
    cards = HP3_GAMES.map((k) => <GsFeature key={k} id={k} />);
    const P = { 1: Hp3Mosaic, 2: Hp3Edged, 7: Hp3Stack, 8: Hp3Cycle, 10: Hp3Ten, 11: Hp3Eleven, 12: Hp3Twelve, 13: Hp3Thirteen, 14: Hp3Fourteen, 15: Hp3Fifteen }[opt] || Hp3Edged;
    cards.splice(at, 0, <P key="pass" cta={cta} />);
  }
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
        <DS.CardRow title="Available games" className="gs-row4">{cards}</DS.CardRow>
        <div className="gs-grid2">{GS_SOON.map((g) => <GsSoonCard key={g.name} g={g} />)}</div>
        <div><DS.TextLink onClick={() => gs.go('games')}>All games</DS.TextLink></div>
      </section>
      <GsWhatsNew />
    </main>
  );
};

// ---- The tooling strip: pinned to the bottom, not product. ----
const hp3Show = () => {
  const el = document.querySelector('.mcp-crow'); if (!el) return;
  let p = el.parentElement;
  while (p && p !== document.body) { const s = getComputedStyle(p).overflowY; if ((s === 'auto' || s === 'scroll') && p.scrollHeight > p.clientHeight) break; p = p.parentElement; }
  const top = el.getBoundingClientRect().top;
  if (p && p !== document.body) p.scrollTo({ top: p.scrollTop + top - p.getBoundingClientRect().top - 24, behavior: 'smooth' });
  else window.scrollTo({ top: window.scrollY + top - 24, behavior: 'smooth' });
  const card = document.querySelector('[data-hp3]'); const tr = card && card.parentElement;
  if (tr) tr.scrollTo({ left: Math.max(0, card.offsetLeft - tr.offsetLeft - 4), behavior: 'smooth' });
  if (card) { card.classList.remove('hpl-ring'); void card.offsetWidth; card.classList.add('hpl-ring'); setTimeout(() => card.classList.remove('hpl-ring'), 1800); }
};
const Hp3Strip = () => {
  const { opt, at, cta } = useHp3(); const [open, setOpen] = React.useState(true); const [why, setWhy] = React.useState(false);
  const o = HP3_OPTS.find((x) => x.n === opt) || HP3_OPTS[0];
  if (!open) return <button type="button" className="hpl-tab" onClick={() => setOpen(true)}>Pass card {opt} · {HP3_PLACES[at][1]}</button>;
  return (
    <div className="hpl-strip" role="region" aria-label="Playground options">
      {why && <div className="hpl-why"><p><b>{o.n} · {o.name}.</b> {o.stance}</p><p className="hpl-cost">Cost: {o.cost}</p></div>}
      <div className="hpl-bar">
        <div className="hpl-seg" role="radiogroup" aria-label="Card">
          {HP3_OPTS.map((x) => <button key={x.n} type="button" role="radio" aria-checked={x.n === opt} title={x.name} className={x.n === opt ? 'is-on' : ''} onClick={() => hp3Store.set({ opt: x.n })}>{x.n}</button>)}
        </div>
        <div className="hpl-seg" role="radiogroup" aria-label="Place in the row">
          {HP3_PLACES.map(([v, l]) => <button key={v} type="button" role="radio" aria-checked={v === at} className={'is-wide' + (v === at ? ' is-on' : '')} onClick={() => hp3Store.set({ at: v })}>{l}</button>)}
        </div>
        <div className="hpl-seg" role="radiogroup" aria-label="See pricing as">
          {[['link', 'Link'], ['button', 'Button']].map(([v, l]) => <button key={v} type="button" role="radio" aria-checked={v === cta} className={'is-wide' + (v === cta ? ' is-on' : '')} onClick={() => hp3Store.set({ cta: v })}>{l}</button>)}
        </div>
        <span className="hpl-name">{o.name}</span>
        <button type="button" className="hpl-btn" aria-expanded={why} onClick={() => setWhy(!why)}>Why</button>
        <button type="button" className="hpl-btn" onClick={hp3Show}>Show</button>
        <button type="button" className="hpl-btn" aria-label="Hide the strip" onClick={() => { setOpen(false); setWhy(false); }}>Hide</button>
      </div>
    </div>
  );
};
(() => { const d = document.createElement('div'); d.id = 'hpl-strip-root'; document.body.appendChild(d); ReactDOM.createRoot(d).render(<Hp3Strip />); })();

Object.assign(window, { GsHome: Hp3Home });
