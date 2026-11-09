// ============================================================================
// Hi-fi canvas: icon options for the five tabs of Delve's hero sheet (Stats, Advantage, Pack, Ability, Fight). Each option is drawn as the
// real tab: the icon centred above the word, in the design system's colours and type, closed and open. Where the design system's Icon has a
// glyph that fits, that glyph is used; every other option is a new SVG drawn to the set's rules (24 px, 1.75 stroke, square ends, mitred
// joins, currentColor) and labelled "new". Nothing here is ruled.
// ============================================================================
import '../../design-system/_ds_bundle.js';
import '../../canon/app/canon.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { DS } from '../../canon/app/gs-data.jsx';
import './canvas.css';

// The design system's line style (components/media/Icon.jsx), for the new drawings.
const A = 'fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="miter"';
const FILL = 'fill="currentColor" stroke="none"';
const g = (d, extra = '') => '<g ' + A + '>' + d + '</g>' + extra;

const NEW = {
  hexPlus: g('<path d="M12 2.5L20.5 7.25V16.75L12 21.5L3.5 16.75V7.25Z"/><path d="M12 9V15M9 12H15"/>'),
  bars: g('<path d="M3.5 14H8V20H3.5Z"/><path d="M9.75 9H14.25V20H9.75Z"/><path d="M16 4H20.5V20H16Z"/>'),
  sparkle: g('<path d="M12 3L14.2 9.8L21 12L14.2 14.2L12 21L9.8 14.2L3 12L9.8 9.8Z"/>'),
  hexSparkle: g('<path d="M12 2.5L20.5 7.25V16.75L12 21.5L3.5 16.75V7.25Z"/><path d="M12 7.5L13.3 10.7L16.5 12L13.3 13.3L12 16.5L10.7 13.3L7.5 12L10.7 10.7Z"/>'),
  chevrons: g('<path d="M5 12.5L12 5.5L19 12.5"/><path d="M5 19L12 12L19 19"/>'),
  flame: g('<path d="M12 3C12.5 7 18 9 18 14.5A6 6 0 0 1 6 14.5C6 12.5 7 11 8.5 9.5C8.8 11.2 9.6 12 10.5 12C11.2 9 10.6 6 12 3Z"/>'),
  satchel: g('<path d="M4.5 9H19.5V20.5H4.5Z"/><path d="M4.5 9L12 15L19.5 9"/><path d="M8.5 9V6.5A3.5 3.5 0 0 1 15.5 6.5V9"/>'),
  backpack: g('<path d="M6 21V10A6 6 0 0 1 18 10V21Z"/><path d="M9 21V15H15V21"/><path d="M9 10.5H15"/>'),
  chest: g('<path d="M4 10H20V20.5H4Z"/><path d="M4 10A8 6 0 0 1 20 10"/><path d="M10.5 10H13.5V14H10.5Z"/>'),
  slots: g('<path d="M4 4H11V11H4Z"/><path d="M13 4H20V11H13Z"/><path d="M4 13H11V20H4Z"/><path d="M13 13H20V20H13Z"/>'),
  shield: g('<path d="M12 3L20 6V12C20 16.5 16.5 19.5 12 21C7.5 19.5 4 16.5 4 12V6Z"/>'),
  bolt: g('<path d="M13.5 3L5 13.5H11.5L10.5 21L19 10H12.5Z"/>'),
  pips: g('<path d="M3 8H11V16H3Z"/>', '<path ' + FILL + ' d="M13 8H21V16H13Z"/>'),
  burst: g('<path d="M12 8L16 12L12 16L8 12Z"/><path d="M12 2.5V5M12 19V21.5M2.5 12H5M19 12H21.5"/><path d="M5.5 5.5L7.2 7.2M16.8 16.8L18.5 18.5M18.5 5.5L16.8 7.2M7.2 16.8L5.5 18.5"/>'),
  swords: g('<path d="M4 3L16 15"/><path d="M14.2 16.8L17.8 13.2"/><path d="M16 15L19.5 18.5"/><path d="M20 3L8 15"/><path d="M9.8 16.8L6.2 13.2"/><path d="M8 15L4.5 18.5"/>'),
  sword: g('<path d="M12 2L14 4.5V15.5H10V4.5Z"/><path d="M6.5 15.5H17.5"/><path d="M12 15.5V21"/>'),
  axe: g('<path d="M12 3V21"/><path d="M12 5.5L4 4V12.5L12 9.5"/><path d="M12 5.5L20 4V12.5L12 9.5"/>'),
  slash: g('<path d="M5 21L10 5"/><path d="M10.5 21L15.5 5"/><path d="M16 21L21 5"/>'),
};

// ---- The options: one list per tab, each { key, name, what, ds (design system Icon name) | svg (a NEW drawing) } ----
const TABS = [
  { id: 'stats', word: 'Stats', holds: 'the six ability modifiers, Strength to Charisma', opts: [
    { name: 'rows', what: 'two stacked bars, as a list of values', ds: 'list' },
    { name: 'sliders', what: 'three sliders, as modifiers you adjust by', ds: 'settings' },
    { name: 'hex with plus', what: 'the sheet\'s own stat hex, carrying a plus', svg: 'hexPlus' },
    { name: 'bars', what: 'three bars rising, a spread of scores', svg: 'bars' },
  ] },
  { id: 'advantage', word: 'Advantage', holds: 'Inspiration and the strong-hit Streak', opts: [
    { name: 'sparkle', what: 'a quiet four-point sparkle, a lift', svg: 'sparkle' },
    { name: 'hex sparkle', what: 'the Inspiration hex with a sparkle in it', svg: 'hexSparkle' },
    { name: 'chevrons up', what: 'two chevrons rising, a streak climbing', svg: 'chevrons' },
    { name: 'flame', what: 'a flame, a streak that is burning', svg: 'flame' },
  ] },
  { id: 'pack', word: 'Pack', holds: 'carried gear, such as a Healing draught or a crowbar', opts: [
    { name: 'satchel', what: 'a flapped bag with a carrying strap', svg: 'satchel' },
    { name: 'backpack', what: 'a rounded pack with a front pocket', svg: 'backpack' },
    { name: 'chest', what: 'a small chest with a hasp', svg: 'chest' },
    { name: 'slots', what: 'four slots, as the sheet draws the pack\'s room', svg: 'slots' },
  ] },
  { id: 'ability', word: 'Ability', holds: 'the Shield bash and any ability a run grants', opts: [
    { name: 'shield', what: 'a shield, for the Shield bash', svg: 'shield' },
    { name: 'bolt', what: 'a lightning bolt, a power', svg: 'bolt' },
    { name: 'uses', what: 'two square pips, one spent, as the sheet counts uses', svg: 'pips' },
    { name: 'burst', what: 'a diamond with rays, a charge going off', svg: 'burst' },
  ] },
  { id: 'fight', word: 'Fight', holds: 'Defence, Armour and Cleave, the heavy attack', opts: [
    { name: 'crossed swords', what: 'two swords crossed, a fight', svg: 'swords' },
    { name: 'sword', what: 'one sword, point up', svg: 'sword' },
    { name: 'axe', what: 'a double-headed axe, for the heavy Cleave', svg: 'axe' },
    { name: 'slashes', what: 'three slash marks, a heavy blow', svg: 'slash' },
  ] },
];

// ---- The parts ----
const Glyph = ({ o }) => (o.ds
  ? <DS.Icon name={o.ds} size={24} />
  : <svg className="mcp-ico" viewBox="0 0 24 24" width="24" height="24" style={{ width: 24, height: 24 }} aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: NEW[o.svg] }} />);

// One tab, as the sheet draws it: at least 76 px wide, the icon centred above the word. A word-only tab (no o) is today's.
const Tab = ({ word, o, open }) => (
  <span className={'cv-tab' + (open ? ' is-open' : '') + (o ? '' : ' is-bare')} role="img" aria-label={word + (open ? ', open' : '')}>
    {o && <span className="cv-ico"><Glyph o={o} /></span>}
    <span className="cv-word">{word}</span>
  </span>);

const kind = (o) => (o.ds ? 'design system icon "' + o.ds + '"' : 'new');
// One option: its number and name, what it depicts, then the tab closed and open.
const Option = ({ tab, o, n }) => (
  <figure className="cv-opt">
    <figcaption><b>{tab.word} {n} · {o.name}</b><span>{o.what} · <em className={o.ds ? 'is-ds' : 'is-new'}>{kind(o)}</em></span></figcaption>
    <div className="cv-pair"><Tab word={tab.word} o={o} /><Tab word={tab.word} o={o} open /></div>
  </figure>);

// A full row of five tabs: one option from every tab, so the set reads together (n = 0 is today's word-only row).
const SetRow = ({ n, label, note }) => (
  <figure className="cv-set">
    <figcaption><b>{label}</b>{note && <span>{note}</span>}</figcaption>
    <div className="cv-row">{TABS.map((t, i) => <Tab key={t.id} word={t.word} o={n ? t.opts[n - 1] : null} open={i === 1} />)}</div>
  </figure>);

// ---- The versions, one per tab ----
const VERSIONS = [
  { id: 'current', tab: '0 · Current', title: 'Current: the word only',
    cap: 'Today\'s five tabs, each closed except Advantage (open, to show the inverted state). Every option that follows adds an icon centred above the word and changes nothing else.',
    body: () => <SetRow n={0} label="Current · word only" /> },
  ...TABS.map((t, i) => ({ id: t.id, tab: (i + 1) + ' · ' + t.word, title: (i + 1) + ' · ' + t.word + ': four icons',
    cap: t.word + ' holds ' + t.holds + '. Each option is shown closed, then open.',
    body: () => <div className="cv-opts">{t.opts.map((o, k) => <Option key={k} tab={t} o={o} n={k + 1} />)}</div> })),
  { id: 'sets', tab: '6 · Sets', title: 'The sets: one option across all five tabs',
    cap: 'Option 1 on every tab, then option 2, and so on, under today\'s word-only row. Advantage is drawn open in each row.',
    body: () => <div className="cv-sets"><SetRow n={0} label="Current · word only" />{[1, 2, 3, 4].map((n) => <SetRow key={n} n={n} label={'Set ' + n} note={TABS.map((t) => t.opts[n - 1].name).join(' · ')} />)}</div> },
];

const App = () => {
  const read = () => { const h = (window.location.hash || '').replace('#', ''); return VERSIONS.some((v) => v.id === h) ? h : 'current'; };
  const [id, setId] = React.useState(read);
  React.useEffect(() => { const f = () => setId(read()); window.addEventListener('hashchange', f); return () => window.removeEventListener('hashchange', f); }, []);
  const v = VERSIONS.find((x) => x.id === id);
  return (
    <main className="cv">
      <header className="cv-head">
        <h1>Delve sheet tabs: icon options</h1>
        <p>Five tabs (Stats, Advantage, Pack, Ability, Fight), four icon options each, drawn as the real tab. Options marked new are drawn here in the design system's line style; the rest are the design system's own icons.</p>
      </header>
      <nav className="cv-tabs" role="tablist" aria-label="Tabs">
        {VERSIONS.map((x) => <button key={x.id} type="button" role="tab" aria-selected={x.id === id} className={x.id === id ? 'is-on' : ''} onClick={() => { window.location.hash = x.id; setId(x.id); }}>{x.tab}</button>)}
      </nav>
      <section className="cv-ver" key={id}>
        <h2>{v.title}</h2>
        <p className="cv-cap">{v.cap}</p>
        {v.body()}
      </section>
    </main>);
};
createRoot(document.getElementById('root')).render(<App />);
