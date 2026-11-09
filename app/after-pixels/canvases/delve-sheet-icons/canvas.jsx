// ============================================================================
// Hi-fi canvas: icon options for five new facts on Delve's hero sheet (Defence, Armour, Heavy attack, Ultimate, Spotlight), two options each.
// "Today" is canon's own sheet parts (DlCell, DlBox, DlHex's number style) as the sheet draws them now. Every option is drawn at the
// sheet's figure size (a 36 px figure row, figures 24-32 px) inside a real sheet cell with its label under it. The icons are the canvas's
// own, line-drawn as the sheet's hexes and glyph boxes are (1.5 stroke, mitred joins, the design system's colours). The values are the canvas's
// SAMPLE (a fighter: defence 10, armour 2 a fight, heavy attack 14, ultimate once a run). Nothing here is ruled.
// ============================================================================
import '../../design-system/_ds_bundle.js';
import '../../canon/app/canon.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import '../../canon/app/gs-data.jsx';
import { DlBox, DlUses, DlCell, DL_HEX } from '../../canon/app/gs-delve.jsx';
import './canvas.css';

// One figure: the sheet's 46 x 50 viewBox (a hex is 36 x 40 inside it), drawn at 32 px wide.
const Fig = ({ label, children }) => (<svg className="ic" viewBox="-5 -5 46 50" width="32" height="35" role="img" aria-label={label}>{children}</svg>);
const Num = ({ x = 18, y = 20.5, size = 18, children }) => <text className="ic-n" x={x} y={y} style={{ fontSize: size }}>{children}</text>;
// The four-point sparkle the route's use-die carries, centred on (cx, cy), r points out from the centre.
const sparkle = (cx, cy, r) => 'M' + cx + ' ' + (cy - r) + 'Q' + (cx + r * .12) + ' ' + (cy - r * .12) + ' ' + (cx + r) + ' ' + cy + 'Q' + (cx + r * .12) + ' ' + (cy + r * .12) + ' ' + cx + ' ' + (cy + r) + 'Q' + (cx - r * .12) + ' ' + (cy + r * .12) + ' ' + (cx - r) + ' ' + cy + 'Q' + (cx - r * .12) + ' ' + (cy - r * .12) + ' ' + cx + ' ' + (cy - r) + 'Z';

// ---- 1 Defence ----
const Shield = () => (<Fig label="Defence 10"><polygon className="ic-o" points="18,0 35,6 35,22 18,40 1,22 1,6" /><Num y={17} size={19}>10</Num></Fig>);
const D20 = () => (<Fig label="Defence 10, the foe's d20 must reach it"><polygon className="ic-o" points={DL_HEX} /><polygon className="ic-f" points="18,6 31,29 5,29" /><Num y={21.5} size={14}>10</Num></Fig>);
// ---- 2 Armour ----
const Breastplate = () => (<Fig label="Armour 2"><path className="ic-o" d="M10 2H14L18 7L22 2H26L34 8L32 20L26 26V38H10V26L4 20L2 8Z" /><Num y={21} size={19}>2</Num></Fig>);
// ---- 3 Heavy attack ----
const Axe = () => (<Fig label="Heavy attack, needs 14"><path className="ic-o" d="M10 5Q28 -3 35 4Q27 20 35 36Q28 43 10 35" /><path className="ic-o" d="M11 0V40" /><Num x={21} y={20} size={14}>14</Num></Fig>);
const UseDieTotal = () => (<Fig label="Heavy attack, needs 14"><polygon className="ic-o" points={DL_HEX} /><path className="ic-s" d={sparkle(18, 10, 5.5)} /><Num y={26} size={16}>14</Num></Fig>);
// ---- 4 Ultimate ----
const RingSpark = ({ used }) => (<Fig label={used ? 'Ultimate, spent' : 'Ultimate, ready'}>
  <circle className={used ? 'ic-o is-used' : 'ic-o'} cx="18" cy="20" r="17.5" />
  <path className={used ? 'ic-s is-used' : 'ic-s'} d={sparkle(18, 20, 11.5)} />
  {used && <line className="ic-x" x1="5" y1="33" x2="31" y2="7" />}</Fig>);
// ---- 5 Spotlight ----
const Torch = () => (<Fig label="Spotlight"><path className="ic-o" d="M18 0C22 7 30 11 30 18C30 23 25 26 18 26C11 26 6 23 6 18C6 11 14 7 18 0Z" /><path className="ic-s" d="M18 11C21 15 23 17 23 19.5C23 22 21 23.5 18 23.5C15 23.5 13 22 13 19.5C13 17 15 15 18 11Z" /><path className="ic-o" d="M10 28H26L23 33H13ZM18 33V40" /></Fig>);
const Beam = () => (<Fig label="Spotlight"><path className="ic-o" d="M4 36L34 2M4 36L38 25M34 2Q41 14 38 25" /><path className="ic-f" d="M4 36L37.5 13.5" /><circle className="ic-d" cx="4" cy="36" r="3.5" /></Fig>);

const Cell = ({ label, children, used, title }) => <DlCell label={label} used={used} title={title}>{children}</DlCell>;
const pips = (left, of) => <DlUses left={left} of={of} />;

const FACTS = [
  { n: 1, name: 'Defence', sample: 'Fighter: 10. The total a foe\'s d20 must reach to hit the hero.', opts: [
    { id: '1a', say: 'Shield with the number', cap: 'A shield with the number inside: the foe has to reach 10 to hit.', cells: [<Cell key="a" label="Defence"><Shield /></Cell>] },
    { id: '1b', say: 'Number in a d20', cap: 'The number inside a d20 outline: the foe\'s d20 must reach 10.', cells: [<Cell key="a" label="Defence"><D20 /></Cell>] } ] },
  { n: 2, name: 'Armour', sample: 'Fighter: 2 a fight. Soaks damage as blows land, full again when the next fight starts.', opts: [
    { id: '2a', say: 'Breastplate with the count', cap: 'A breastplate with the protection count: 2 to soak this fight.', cells: [<Cell key="a" label="Armour"><Breastplate /></Cell>] },
    { id: '2b', say: 'Pips that empty', cap: 'One pip per point, as the use pips are. Left: full. Right: after one blow was absorbed.', cells: [<Cell key="a" label="Armour">{pips(2, 2)}</Cell>, <Cell key="b" label="Armour" used>{pips(1, 2)}</Cell>] } ] },
  { n: 3, name: 'Heavy attack', sample: 'Fighter: needs a 14 to land, for 7 damage. No limit on uses.', opts: [
    { id: '3a', say: 'Axe head with the total', cap: 'An axe head with the total the heavy attack needs: 14.', cells: [<Cell key="a" label="Heavy attack"><Axe /></Cell>] },
    { id: '3b', say: 'Use-die with the total', cap: 'The route\'s use-die look, a hex with the four-point sparkle, with the total needed: 14.', cells: [<Cell key="a" label="Heavy attack"><UseDieTotal /></Cell>] } ] },
  { n: 4, name: 'Ultimate', sample: 'Once a run. Left: ready. Right: spent.', opts: [
    { id: '4a', say: 'One use pip', cap: 'One use pip, as abilities show now: lit while unspent, empty once used.', cells: [<Cell key="a" label="Ultimate">{pips(1, 1)}</Cell>, <Cell key="b" label="Ultimate" used>{pips(0, 1)}</Cell>] },
    { id: '4b', say: 'Sparkle in a ring', cap: 'The use sparkle inside a ring: the one sure blow of a run. Struck through once spent.', cells: [<Cell key="a" label="Ultimate"><RingSpark /></Cell>, <Cell key="b" label="Ultimate" used><RingSpark used /></Cell>] } ] },
  { n: 5, name: 'Spotlight', sample: 'The one thing only this hero can try.', opts: [
    { id: '5a', say: 'Torch', cap: 'A torch: the hero\'s own light on one try.', cells: [<Cell key="a" label="Spotlight"><Torch /></Cell>] },
    { id: '5b', say: 'Beam', cap: 'A beam from a point: a light thrown on one try.', cells: [<Cell key="a" label="Spotlight"><Beam /></Cell>] } ] },
];

const Card = ({ children }) => <div className="dv4 dv7 dv8 is-3b cvi-card"><div className="cvi-cells">{children}</div></div>;

const App = () => (
  <main className="cv">
    <header className="cv-head">
      <h1>Delve hero sheet: five new facts, two icons each</h1>
      <p>Each icon sits in a real sheet cell with its label under it, at the sheet's size. Sample values are a fighter's.</p>
    </header>
    <section className="cv-ver">
      <h2><span className="cv-n">0</span>Today</h2>
      <p className="cv-cap">The sheet as it shows these facts now: bare numbers, and a key box for the spotlight.</p>
      <Card>
        <Cell label="Defence"><span className="dv8-num">10</span></Cell>
        <Cell label="Armour"><span className="dv8-num">2</span></Cell>
        <Cell label="Cleave"><span className="dv8-num">14</span></Cell>
        <Cell label="Spotlight"><DlBox k="key" /></Cell>
      </Card>
    </section>
    {FACTS.map((f) => (
      <section className="cv-ver" key={f.n}>
        <h2><span className="cv-n">{f.n}</span>{f.name}</h2>
        <p className="cv-cap">{f.sample}</p>
        <div className="cvi-opts">
          {f.opts.map((o) => (
            <figure className="cvi-opt" key={o.id}>
              <figcaption><b>{o.id}</b> {o.say}</figcaption>
              <Card>{o.cells}</Card>
              <p>{o.cap}</p>
            </figure>))}
        </div>
      </section>))}
  </main>);
createRoot(document.getElementById('root')).render(<App />);
