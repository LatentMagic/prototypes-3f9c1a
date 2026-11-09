// ============================================================================
// Hi-fi canvas: Delve's session-page route (the rooms a run passed through, with their dice) when a run is long and room names are long.
// Today is canon's own route (DlRoute, gs-delve.jsx); 1 to 5 are proposed layouts drawn from the same parts: canon's route CSS, the design
// system's Delve dice (DS.DelveDie through canon's DlDieBtn) and canon's held roll (DlHeld). Only the arrangement is new (canvas.css).
// The run is the canvas's own SAMPLE (10 stops; 12 for headroom): the Goblin Warren's rooms, with names added at the lengths the content
// can produce. Nothing here is ruled. Game data is rough.
// ============================================================================
import '../../design-system/_ds_bundle.js';
import '../../canon/app/canon.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import '../../canon/app/gs-data.jsx';
import { dlBuild, DlStopHead, DlRoute, DlHeld, DlDieBtn, DlBackArrow } from '../../canon/app/gs-delve.jsx';
import './canvas.css';

// ---- The sample run, written as the record's lines, so canon's own dlBuild reads it ----
// A roll in a fight room: [stat, grade, (natural), "Rolled ...", "Struck back: ..."]. foe: undefined = no foe roll shown, 'x' = the foe missed, n = it hit for n.
// An option roll: [stat, action, grade, (natural), "Rolled ..."]; it carries no foe roll.
const GRADE = { s: 'Strong hit', w: 'Weak hit', m: 'Miss' };
const OPT = { s: 'Success', w: 'Partial success', m: 'Failure' };
const HP0 = 11;
const buildRun = (stops) => {
  let hp = HP0; const lines = [];
  const rolled = (kept, mod, other) => 'Rolled ' + kept + (other != null ? ', the higher of ' + other + ' and ' + kept + ',' : '') + ' + ' + mod + ' = ' + (kept + mod) + ' against DC 12';
  stops.forEach((st, i) => {
    if (i > 0) lines.push(['Room', (st.back ? 'Doubled back to ' : 'Entered ') + st.name]);
    st.t.forEach((x) => {
      if (x.use) { lines.push(['Ability', 'Used ' + x.use, 'Struck back: d20 9 vs 13, missed']); return; }
      if (x.lock) { lines.push(['Lock', x.lock]); return; }
      const nat = x.nat ? [x.nat] : [];
      if (x.opt) { lines.push([x.stat, x.opt, OPT[x.g], ...nat, rolled(x.k, x.mod, x.two)]); return; }
      const struck = [];
      if (x.foe === 'x') struck.push('Struck back: d20 8 vs 13, missed');
      else if (x.foe) { hp -= x.foe; struck.push('Struck back: d20 16 vs 13, hit, ' + x.foe + ' damage, HP ' + hp + '/' + HP0); }
      lines.push([x.stat, GRADE[x.g], ...nat, rolled(x.k, x.mod, x.two), ...struck]);
    });
  });
  return dlBuild({ hero: 'Wren the Rogue', hpMax: HP0, end: 'overrun', lines });
};
const F = (stat, g, k, mod, foe, more) => ({ stat, g, k, mod, foe, ...more });
const O = (stat, opt, g, k, mod, more) => ({ stat, opt, g, k, mod, ...more });
// Names: "First room" (the record names no start room), four real Warren rooms, and SAMPLE names at 25, 32 and 26 characters.
const ROOMS = {
  first: { name: 'First room', t: [O('Wisdom', "Search the lock-keeper's niche", 's', 14, 1)] },
  chime: { name: 'The chime run', t: [F('Dexterity', 'm', 8, 3, 1), F('Dexterity', 'w', 9, 3, 'x'), F('Dexterity', 's', 16, 3, 'x')] },
  warren: { name: 'The warren', t: [F('Strength', 'w', 9, 3, 'x'), F('Strength', 's', 14, 3, 'x'), F('Strength', 'm', 1, 3, 2, { nat: 'Natural 1' }), F('Strength', 's', 15, 3, 'x', { two: 6 }), F('Strength', 's', 17, 3)] },
  ante: { name: 'The bone-gate antechamber', t: [O('Intelligence', 'Read the bone-gate carvings', 'w', 11, 1)] },
  hall: { name: 'The long hall of drums and bones', t: [O('Dexterity', 'Slip between the drums', 's', 13, 3), O('Wisdom', 'Listen for the watch', 'm', 6, 1), O('Dexterity', 'Muffle the great drum', 's', 16, 3)] },
  crawl: { name: "The rat-catcher's crawlway", t: [O('Dexterity', 'Squeeze through the crawlway', 's', 12, 3), O('Strength', 'Lift the grate', 'w', 9, 0), O('Wisdom', 'Follow the draught', 's', 14, 1)] },
  gallery: { name: 'The painted gallery', t: [O('Intelligence', 'Read the wall paintings', 's', 13, 1), O('Wisdom', 'Find the hidden latch', 'w', 11, 1)] },
  shrine: { name: 'The shrine cavern', t: [F('Dexterity', 'w', 10, 3, 2), F('Dexterity', 's', 17, 3, 'x'), F('Dexterity', 's', 20, 3, 'x', { nat: 'Natural 20' }), F('Dexterity', 'm', 7, 3, 1, { two: 5 }), F('Dexterity', 'w', 11, 3, 'x'), F('Dexterity', 's', 15, 3, 2)] },
};
const back = (r, t) => ({ name: r.name, back: true, t });
const RUN10 = [ROOMS.first, ROOMS.chime, ROOMS.warren, ROOMS.ante, back(ROOMS.warren, []), ROOMS.hall,
  back(ROOMS.warren, [{ use: 'Backstab' }, F('Dexterity', 's', 17, 3, 'x'), F('Dexterity', 'm', 7, 3, 1)]), ROOMS.crawl,
  back(ROOMS.warren, [O('Strength', 'Force the bone gate', 'm', 6, 0), O('Strength', 'Force the bone gate', 'm', 11, 0), O('Strength', 'Force the bone gate', 's', 14, 0), { lock: 'Forced the bone gate' }]), ROOMS.shrine];
const RUN12 = [...RUN10.slice(0, 9), ROOMS.gallery, back(ROOMS.warren, [F('Dexterity', 's', 14, 3, 'x')]), RUN10[9]];
const M10 = buildRun(RUN10);
const M12 = buildRun(RUN12);

// ---- Measuring ----
// Rooms per row (the now card's rule, useDlNowCols): the fewest rows that fit minCol-wide columns, shared evenly (ceil(n / rows) each), never one room left alone.
const colsFor = (n, width, minCol) => { const fit = Math.max(1, Math.floor(width / minCol)); return n <= fit ? n : Math.ceil(n / Math.ceil(n / fit)); };
const useCols = (n, minCol) => {
  const ref = React.useRef(null); const [cols, setCols] = React.useState(n);
  React.useLayoutEffect(() => { const el = ref.current; if (!el) return undefined;
    const read = () => setCols(colsFor(n, el.clientWidth, minCol));
    read(); const ro = new ResizeObserver(read); ro.observe(el); return () => ro.disconnect(); }, [n, minCol]);
  return [ref, cols];
};
const chunk = (a, k) => Array.from({ length: Math.ceil(a.length / k) }, (_, i) => a.slice(i * k, i * k + k));
const useActive = (m, first) => {
  const [act, setAct] = React.useState(first);
  const on = React.useMemo(() => ({ sel: setAct, hov: () => {} }), []);
  return [act, on];
};
// A die in the last room, not the last die: the room's detail is far from the top of the page.
const pressInLast = (m) => { const ts = m.stops[m.stops.length - 1].turns; return ts[Math.min(3, ts.length - 1)].t; };

// ---- The layouts ----
const Stop = ({ m, st, act, on, named }) => {
  const sel = act ? m.turns[act - 1].stop : null;
  return (
    <div className={'dvA2-stop' + (sel === st.i ? ' is-on' : '')}>
      <DlStopHead st={st} named={named} />
      <div className="dvA2-dice">{st.turns.length ? st.turns.map((r) => (!r.use && m.mom[r.n]
        ? <span key={r.t} className="dvE-mom"><DlDieBtn r={r} act={act} on={on} size={52} /></span>
        : <DlDieBtn key={r.t} r={r} act={act} on={on} size={30} />)) : <i className="dv2-pass" aria-label="No rolls" />}</div>
    </div>);
};
// Horizontal: canon's route, in balanced rows when the columns would be narrower than minCol.
const RowRoute = ({ m, act, on, minCol, named }) => {
  const [ref, cols] = useCols(m.stops.length, minCol);
  return (
    <div ref={ref} className="cv-rows" aria-label="The way you went">
      {chunk(m.stops, cols).map((row, ri) => (
        <div key={ri} className="dvA2-route is-e is-cols-between cv-row" style={{ '--dv-stops': cols, '--cv-cols': cols }}>
          {row.map((st) => <Stop key={st.i} m={m} st={st} act={act} on={on} named={named} />)}
        </div>))}
    </div>);
};
// Vertical: one row per room: its number on a rule running down the left, the full name, then its dice.
const VRow = ({ m, st, act, on, inline, first, last }) => {
  const sel = act ? m.turns[act - 1].stop : null;
  const keys = st.turns.filter((r) => !r.use && m.mom[r.n]); const rest = st.turns.filter((r) => r.use || !m.mom[r.n]);
  const [dref, dcols] = useCols(rest.length, 44);
  return (
    <div className={'cv-vrow' + (sel === st.i ? ' is-on' : '') + (first ? ' is-first' : '') + (last ? ' is-last' : '')}>
      <span className={'dv2-num cv-vnum' + (st.back ? ' is-back' : '')} aria-label={(st.back ? 'Back to ' : 'Room ' + st.num + ', ') + st.name}>{st.back && <DlBackArrow />}{st.num}</span>
      <div className="cv-vbody">
        <p className="cv-vname dv2-sname">{st.name}{!st.turns.length && <i className="dv2-pass cv-vpass" aria-label="No rolls" />}</p>
        {rest.length > 0 && <div className="cv-vdice" ref={dref} style={{ '--cv-dcols': dcols }}>{rest.map((r) => <DlDieBtn key={r.t} r={r} act={act} on={on} size={30} />)}</div>}
        {keys.map((r) => <div key={r.t} className="cv-vkey"><DlDieBtn r={r} act={act} on={on} size={52} /></div>)}
        {inline && sel === st.i && <div className="cv-vheld"><DlHeld m={m} act={act} /></div>}
      </div>
    </div>);
};
const VList = ({ m, act, on, inline }) => (
  <div className="cv-vlist" aria-label="The way you went">{m.stops.map((st, i) => <VRow key={st.i} m={m} st={st} act={act} on={on} inline={inline} first={i === 0} last={i === m.stops.length - 1} />)}</div>);

// One run card: the route (or list) and the held roll, in canon's own run-card box (.dv2), laid out by canon's own container rules.
const Card = ({ m, kind, initial }) => {
  const [act, on] = useActive(m, initial);
  let route;
  if (kind === 'today') return <section className="dv2 dv7r is-3" aria-label="How the run went"><DlRoute m={m} act={act} on={on} /></section>;
  if (kind === 'list') route = <VList m={m} act={act} on={on} />;
  if (kind === 'inline') route = <VList m={m} act={act} on={on} inline />;
  if (kind === 'rows') route = <RowRoute m={m} act={act} on={on} minCol={44} />;
  if (kind === 'named') route = <RowRoute m={m} act={act} on={on} minCol={80} named />;
  return (
    <section className="dv2 dv7r is-3" aria-label="How the run went">
      <div className="dvE-main">{route}{kind !== 'inline' && <div className="dvE-side"><DlHeld m={m} act={act} /></div>}</div>
    </section>);
};

// ---- A frame: a window of w px on the store's background, the run card at its measured width. Scaled down to fit a narrower screen. ----
// clip: draw only this many px of the page, scrolled to the held roll ('held') or to the end of the page ('end').
const Frame = ({ w, card, note, clip, scroll, children }) => {
  const outer = React.useRef(null); const page = React.useRef(null); const win = React.useRef(null);
  const [avail, setAvail] = React.useState(w); const [full, setFull] = React.useState(0); const [shift, setShift] = React.useState(0);
  React.useLayoutEffect(() => { const el = outer.current; const read = () => setAvail(el.clientWidth); read();
    const ro = new ResizeObserver(read); ro.observe(el); return () => ro.disconnect(); }, []);
  const scale = Math.min(1, avail / w);
  React.useLayoutEffect(() => { const el = page.current; if (!el) return undefined;
    const read = () => {
      setFull(el.offsetHeight);
      if (!clip) return;
      if (scroll === 'held') { const side = el.querySelector('.dvE-side'); const k = el.getBoundingClientRect().height / el.offsetHeight || 1;
        setShift(side ? -((side.getBoundingClientRect().top - el.getBoundingClientRect().top) / k - 16) : 0); }
      else setShift(-Math.max(0, el.offsetHeight - clip));
    };
    read(); const ro = new ResizeObserver(read); ro.observe(el); return () => ro.disconnect(); }, [clip, scroll]);
  const h = clip || full;
  const gutter = w <= 480 ? 16 : (w - card) / 2;
  return (
    <figure className="cv-frame">
      <figcaption><b>{w} px wide</b>{clip ? ' × ' + clip : ''} · card {card} px{scale < 0.98 ? ' · shown at ' + Math.round(scale * 100) + '%' : ''}<span>{note}</span></figcaption>
      <div className="cv-fit" ref={outer} style={{ height: h * scale }}>
        <div className="cv-win" ref={win} style={{ width: w, height: h, transform: 'scale(' + scale + ')' }}>
          <div className="cv-gs" style={{ width: w }}>
            <div className="cv-page" ref={page} style={{ padding: '24px ' + gutter + 'px', transform: clip ? 'translateY(' + shift + 'px)' : undefined }}>{children}</div>
          </div>
        </div>
      </div>
    </figure>);
};
const PHONES = [[390, 'a 390 phone'], [320, 'a 320 phone'], [280, 'a 280 phone']];
const phone = (w) => w - 32;

// ---- The versions, one per tab ----
const press10 = pressInLast(M10);
const VERSIONS = [
  { id: 'today', tab: 'Today', n: '0', title: 'Today: the route as canon draws it',
    cap: 'One row, a column per room: room names are not drawn on a phone, and 10 rooms leave columns of about 32, 25 and 21 px.',
    frames: () => PHONES.map(([w]) => <Frame key={w} w={w} card={phone(w)} note="names hidden by canon below 720 px"><Card m={M10} kind="today" initial={M10.turns.length} /></Frame>) },
  { id: 'a', tab: '1 · A', n: '1', title: 'A: vertical list on phones',
    cap: 'One row per room: number on a rule, the full name wrapping, then its dice at 44 px; the held roll stays above, as today.',
    frames: () => [
      ...PHONES.map(([w]) => <Frame key={w} w={w} card={phone(w)} note="held roll above the list"><Card m={M10} kind="list" initial={M10.turns.length} /></Frame>),
      <Frame key="press" w={390} card={358} clip={844} scroll="held" note="after pressing a die in the shrine cavern, the page scrolls up to the held roll (the die is now off screen)"><Card m={M10} kind="list" initial={press10} /></Frame>] },
  { id: 'a-inline', tab: '2 · A inline', n: '2', title: 'A-inline: the pressed room opens its own roll',
    cap: 'The held roll opens under the room that was pressed, so there is no card above to scroll to; this changes the ratified held-roll position on phones.',
    frames: () => [<Frame key="i" w={390} card={358} clip={844} scroll="end" note="pressed a die in the shrine cavern, the last room"><Card m={M10} kind="inline" initial={press10} /></Frame>] },
  { id: 'b', tab: '3 · B', n: '3', title: 'B: horizontal rows on phones, no names',
    cap: 'The now card\'s rule on the session route: balanced rows of 44 px columns, a room number and its dice, no names.',
    frames: () => PHONES.map(([w]) => <Frame key={w} w={w} card={phone(w)} note="rows shared evenly, held roll above"><Card m={M10} kind="rows" initial={M10.turns.length} /></Frame>) },
  { id: 'c', tab: '4 · C', n: '4', title: 'C: desktop and tablet, horizontal with names',
    cap: 'From 720 px of card up the route keeps its names; where 80 px columns do not fit it wraps into balanced rows, and a 768 window (card under 720) takes the vertical list.',
    frames: () => [
      <Frame key="1440" w={1440} card={1152} note="10 rooms, one row of 81 px columns"><Card m={M10} kind="named" initial={M10.turns.length} /></Frame>,
      <Frame key="1024" w={1024} card={976} note="10 rooms wrap into 5 and 5"><Card m={M10} kind="named" initial={M10.turns.length} /></Frame>,
      <Frame key="768" w={768} card={720} note="inside the card, 686 px: under 720, so the list"><Card m={M10} kind="list" initial={M10.turns.length} /></Frame>] },
  { id: 'a-12', tab: '5 · A, 12', n: '5', title: 'A at 12 stops, 280 px',
    cap: 'Headroom: 12 rooms in the vertical list on the narrowest phone; the page grows downward and nothing breaks.',
    frames: () => [<Frame key="12" w={280} card={248} note="12 rooms"><Card m={M12} kind="list" initial={M12.turns.length} /></Frame>] },
];

const App = () => {
  const read = () => { const h = (window.location.hash || '').replace('#', ''); return VERSIONS.some((v) => v.id === h) ? h : 'today'; };
  const [id, setId] = React.useState(read);
  React.useEffect(() => { const f = () => setId(read()); window.addEventListener('hashchange', f); return () => window.removeEventListener('hashchange', f); }, []);
  const v = VERSIONS.find((x) => x.id === id);
  return (
    <main className="cv">
      <header className="cv-head">
        <h1>Delve route: a long run, long room names</h1>
        <p>The route of the rooms a run passed through, with their dice. Sample run: the Goblin Warren, 10 rooms stood in (12 on the last tab), names up to 32 characters. Press any die.</p>
      </header>
      <nav className="cv-tabs" role="tablist" aria-label="Versions">
        {VERSIONS.map((x) => <button key={x.id} type="button" role="tab" aria-selected={x.id === id} className={x.id === id ? 'is-on' : ''} onClick={() => { window.location.hash = x.id; setId(x.id); }}>{x.tab}</button>)}
      </nav>
      <section className="cv-ver" key={id}>
        <h2><span className="cv-n">{v.n}</span>{v.title}</h2>
        <p className="cv-cap">{v.cap}</p>
        {v.frames()}
      </section>
    </main>);
};
createRoot(document.getElementById('root')).render(<App />);
