// Playground: home-pass-line round 7. Card 3 (the lock before "The Pass"), first in the row, action b (owner, 2026-10-21).
// Copy only (owner): the original line and the reword, plus new takes on the two messages: the Pass gets you every game, and what's free.
// Invariant (owner): the Pass card is never taller than the game cards. The strip's meter measures it.
const HP7_KEY = 'pg_home-pass-line-7_v1';
const Hp7Price = () => <><span className="hp2-price">{GS_PLAN.monthly.price}</span> or <span className="hp2-price">{GS_PLAN.yearly.price}</span></>;
const Hp7Canon = () => { const gs = useGs(); const c = cprPassLine(); return <>{c.p1}{c.lead}<button type="button" className="gs-inlink" onClick={() => gs.go('pass')}>the Pass</button>.</>; };
const Hp7PassLink = ({ t }) => { const gs = useGs(); return <button type="button" className="gs-inlink" onClick={() => gs.go('pass')}>{t}</button>; };
const HP7_COPY = [
  { n: 1, name: 'The original line, under the row', blurb: 'Every game, every edition.', line: Hp7Canon,
    stance: 'Home’s line today, word for word, moved under “Available games”. The card keeps the reword.',
    cost: 'It says “two daily puzzles”. On a phone it runs to three lines.' },
  { n: 2, name: 'The reword, no line', blurb: 'Every game, every edition.', line: null,
    stance: 'The card text from rounds 4 to 6. The price sits in the chip line, and the chevron marks the card as something to open.',
    cost: 'Nothing says what’s free.' },
  { n: 3, name: 'Select games, under the row', blurb: 'Every game, every edition.', line: () => 'Select games are free to start.',
    stance: 'Your “select games for free”, as a short line over the row. The line says what’s free and the card says what the Pass gives.',
    cost: '“Select” doesn’t say which games. The chips on each game have to do that.' },
  { n: 4, name: 'Both on the card', blurb: 'Start select games free. Play every one, every edition.', line: null,
    vars: ['Select games free, the rest with the Pass.','Select games are free. The Pass opens the rest.','Free: select games. The Pass: all of them.','Select games free. Everything else with the Pass.','Select games free. Every one with the Pass.', 'Select games free, or their first edition. Everything else with the Pass.', 'Select games free, or just their first edition. Everything else with the Pass.', 'Select games free, first editions of more. Everything else with the Pass.', 'Select games free, first edition free. Everything else with the Pass.'],
    stance: 'No line over the row. The card carries both messages, free first, in its two lines.',
    cost: 'The card says more than a game card does, so it’s the busiest in the row.' },
  { n: 5, name: 'Both in the line', blurb: 'Every edition, back to the first.', line: () => <>Select games start free. Every game comes with <Hp7PassLink t="the Pass" />.</>,
    stance: 'The line over the row carries both messages. The card adds what the line doesn’t: the editions you missed.',
    cost: 'Two places say “the Pass”, the line and the card’s name.' },
  { n: 6, name: 'Free, named by what you play', blurb: 'Every game, every edition.', line: () => 'Today’s word and today’s mystery are free, and so is the first room.',
    stance: 'Says what free is, by what you’d play, without the count.',
    cost: 'It names today’s games. When the free games change, the line has to change too.' },
  { n: 7, name: '1, three words shorter',
    pairs: [
      ['Two daily puzzles and the start of select games come free. Everything else with the Pass.', 'Every game, every edition.'],
      ['Two daily puzzles and the start of select games are free. The rest comes with the Pass.', 'Every game, every edition.'],
      ['Two daily puzzles and the start of select games are free. Everything else needs the Pass.', 'Every game, every edition.'],
    ],
    stance: 'Copy 1’s line with three words shaved off, so it fits two lines on a phone. The card is unchanged.',
    cost: 'It still says “two daily puzzles”.' },
];
const hp7Store = (() => {
  let v = { copy: 1, act: 'b', v4: 0, v7: 0 };
  try { const s = JSON.parse(localStorage.getItem(HP7_KEY)); if (s) { if (HP7_COPY.some((o) => o.n === s.copy)) v.copy = s.copy; if (s.v4 >= 0 && s.v4 < 9) v.v4 = s.v4; if (s.v7 >= 0 && s.v7 < 3) v.v7 = s.v7; } } catch (e) {}
  const subs = new Set();
  return { get: () => v, set: (p) => { v = { ...v, ...p }; try { localStorage.setItem(HP7_KEY, JSON.stringify(v)); } catch (e) {} subs.forEach((f) => f(v)); }, sub: (f) => { subs.add(f); return () => subs.delete(f); } };
})();
const useHp7 = () => { const [v, setV] = React.useState(hp7Store.get()); React.useEffect(() => hp7Store.sub(setV), []); return v; };

const HP7_GAMES = ['word', 'groups', 'mystery', 'hunter', 'escape', 'delve', 'barrow'];
const HP7_PASS_ALL = CPR_SHOWN.filter((k) => CPR_STAGE[k] === 'pass');
const Hp7Card = ({ copy, act }) => {
  const gs = useGs(); const host = useGsArtHost(); const go = () => gs.go('pass');
  const { v4, v7 } = useHp7(); const C = HP7_COPY.find((x) => x.n === copy); const blurb = C.pairs ? C.pairs[v7][1] : C.vars ? C.vars[v4] : C.blurb;
  const title = (
    <button type="button" className="gs-titlebtn mcp-art-link" onClick={go}>
      <DS.Icon name="lock" size={18} className="hp5-lock" />The Pass
      {act === 'b' && <span className="hp6-chev" aria-hidden="true"><DS.Icon name="down" size={18} style={{ transform: 'rotate(-90deg)' }} /></span>}
    </button>
  );
  const mosaic = <div ref={host} className="hp2-mosaic" data-hp3="" aria-hidden="true" onClick={go}>{HP7_PASS_ALL.slice(0, 8).map((k) => <GsArt key={k} art={GS_GAMES[k].art} shape="square" />)}</div>;
  const art = act === 'c' ? <div className="hp6-artwrap">{mosaic}<DS.Button onClick={go}>See pricing</DS.Button></div> : mosaic;
  const tags = act === 'a' ? <DS.TextLink onClick={go}>{GS_PLAN.monthly.price + ' or ' + GS_PLAN.yearly.price}</DS.TextLink>
    : act === 'd' ? <DS.Button variant="secondary" block className="hp6-full" onClick={go}>See pricing</DS.Button>
    : act === 'e' ? <DS.Button block className="hp6-full" onClick={go}>See pricing</DS.Button>
    : <span className="hp6-price"><Hp7Price /></span>;
  return <DS.GameCard className={'mcp-art-host gs-host hp6-card is-' + act} art={art} title={title} blurb={blurb} tags={tags} />;
};

const Hp7Home = () => {
  const { copy, v7 } = useHp7(); const act = 'b'; const gs = useGs(); const field = React.useRef(null);
  React.useEffect(() => {
    const el = field.current; if (!el) return undefined;
    const on = (e) => { if (e.pointerType !== 'mouse' && e.target.closest('.gs-hero-name, .gs-hero-shapes4')) el.classList.add('is-on'); };
    const off = () => el.classList.remove('is-on'); const ends = ['pointerup', 'pointercancel', 'pointerleave'];
    el.addEventListener('pointerdown', on); ends.forEach((t) => el.addEventListener(t, off));
    return () => { el.removeEventListener('pointerdown', on); ends.forEach((t) => el.removeEventListener(t, off)); };
  }, []);
  const C = HP7_COPY.find((x) => x.n === copy); const Line = C.pairs ? () => <>{C.pairs[v7][0].replace(/the Pass\.$/, '')}<Hp7PassLink t="the Pass" />.</> : C.line;
  const cards = [<Hp7Card key="pass" copy={copy} act={act} />, ...HP7_GAMES.map((k) => <GsFeature key={k} id={k} />)];
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
const hp7Excess = () => {
  const track = document.querySelector('.gs-band .mcp-crow-track'); if (!track) return null;
  const part = (c, sel) => { const el = c.querySelector(sel); if (!el || !el.children.length) return 0; const r = [...el.children].map((k) => { const b = k.getBoundingClientRect(), cs = getComputedStyle(k); return { top: b.top - parseFloat(cs.marginTop), bottom: b.bottom + parseFloat(cs.marginBottom) }; }); return Math.max(...r.map((x) => x.bottom)) - Math.min(...r.map((x) => x.top)); };
  let gt = 0, gg = 0, pt = 0, pg = 0;
  [...track.children].filter((c) => c.classList.contains('mcp-gcard')).forEach((c) => {
    const t = part(c, '.mcp-gcard-text'), g = part(c, '.mcp-gcard-tags');
    if (c.classList.contains('hp6-card')) { pt = t; pg = g; } else { gt = Math.max(gt, t); gg = Math.max(gg, g); }
  });
  return Math.round(Math.max(0, pt - gt) + Math.max(0, pg - gg));
};
const hp7Show = () => {
  const el = document.querySelector('.mcp-crow'); if (!el) return;
  let p = el.parentElement;
  while (p && p !== document.body) { const s = getComputedStyle(p).overflowY; if ((s === 'auto' || s === 'scroll') && p.scrollHeight > p.clientHeight) break; p = p.parentElement; }
  const top = el.getBoundingClientRect().top;
  if (p && p !== document.body) p.scrollTo({ top: p.scrollTop + top - p.getBoundingClientRect().top - 24, behavior: 'smooth' });
  else window.scrollTo({ top: window.scrollY + top - 24, behavior: 'smooth' });
};
const Hp7Seg = ({ label, items, value, onPick }) => (
  <div className="hpl-seg" role="radiogroup" aria-label={label}>
    {items.map(([v, l, t]) => <button key={String(v)} type="button" role="radio" title={t} aria-checked={v === value} className={v === value ? 'is-on' : ''} onClick={() => onPick(v)}>{l}</button>)}
  </div>
);
const Hp7Strip = () => {
  const { copy } = useHp7(); const act = 'b'; const [open, setOpen] = React.useState(true); const [why, setWhy] = React.useState(false); const [ex, setEx] = React.useState(null);
  React.useEffect(() => { const id = setInterval(() => setEx(hp7Excess()), 400); return () => clearInterval(id); }, []);
  const c = HP7_COPY.find((x) => x.n === copy);
  if (!open) return <button type="button" className="hpl-tab" onClick={() => setOpen(true)}>Copy {copy}</button>;
  return (
    <div className="hpl-strip" role="region" aria-label="Playground options">
      {why && <div className="hpl-why">
        <p><b>Copy {c.n} · {c.name}.</b> {c.stance}</p><p className="hpl-cost">Cost: {c.cost}</p>
      </div>}
      <div className="hpl-bar">
        <span className="hpl-lab">Copy</span>
        <Hp7Seg label="Copy" items={HP7_COPY.map((x) => [x.n, String(x.n), x.name])} value={copy} onPick={(v) => hp7Store.set({ copy: v })} />
        {c.vars && <><span className="hpl-lab">Wording</span><Hp7Seg label="Wording of 4" items={c.vars.map((t, i) => [i, 'i'.repeat(0) + String(i + 1), t])} value={hp7Store.get().v4} onPick={(v) => hp7Store.set({ v4: v })} /></>}
        {c.pairs && <><span className="hpl-lab">Wording</span><Hp7Seg label="Wording of 7" items={c.pairs.map((t, i) => [i, String(i + 1), t[0] + ' / ' + t[1]])} value={hp7Store.get().v7} onPick={(v) => hp7Store.set({ v7: v })} /></>}
        <span className="hpl-name">{c.name}</span>
        {ex !== null && <span className={'hpl-meter' + (ex > 0 ? ' is-bad' : '')}>{ex > 0 ? 'Taller than the games by ' + ex + 'px' : 'Level with the games'}</span>}
        <button type="button" className="hpl-btn" aria-expanded={why} onClick={() => setWhy(!why)}>Why</button>
        <button type="button" className="hpl-btn" onClick={hp7Show}>Show</button>
        <button type="button" className="hpl-btn" aria-label="Hide the strip" onClick={() => { setOpen(false); setWhy(false); }}>Hide</button>
      </div>
    </div>
  );
};
(() => { const d = document.createElement('div'); d.id = 'hpl-strip-root'; document.body.appendChild(d); ReactDOM.createRoot(d).render(<Hp7Strip />); })();

Object.assign(window, { GsHome: Hp7Home });
