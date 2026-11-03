// ============================================================================
// After Pixels — playgrounds (PROTOTYPE AID). A playground compares options for one page. It registers its settings here
// with pgRegister; with ?pg=<id> in the URL, a settings bar replaces the top bar (main.jsx), and nothing else changes.
// Without ?pg= this file does nothing. Replacing the top bar suits a playground of one page; one that needs the top bar's
// navigation needs another layout, not built yet.
// A playground is one file, app/playground-<id>.jsx, with its CSS: it calls pgRegister in an init that main.jsx runs last,
// and wraps or replaces the page part it changes only when pgActive() is true, so canon is untouched without ?pg=.
//
//   pgRegister('guess-result', { title: 'Guess result', settings: [
//     { key: 'dir', kind: 'concept', label: 'Direction', options: [{ value: '6a', label: '6a Ring' }, { value: '7a', label: '7a Short line' }] },
//     { key: 'play', label: 'Play', options: [{ value: 'failed', label: 'Failed', state: 'session-word-failed' }] },
//   ] });
//   const dir = usePgSetting('dir');   // in the playground's own component: re-renders when it changes
//
// An option may open a situation: `state` is a canon state id (app/states.jsx); `go(gsApi)`, run after it, opens what no
// state reaches (give such an option a `state` too, to sign in and set the account first). Each
// setting's value is kept in the URL (&<key>=<value>), so a link opens exactly the view it was copied from; the first
// option is the default. Styles: app/playground.css.
//
// The bar has a Fit button below 1280px wide (app/fit.jsx; also Config → Global → Fit): it shows the same page laid out 1280px
// wide, scaled to the window, so a phone shows the desktop. The bar stays outside, at phone size, and drives the framed page.
// A setting declares its kind: `kind: 'concept'` is the idea being compared (a dropdown in the bar, with previous / next buttons
// beside it). A playground has one concept: if several are marked, only the first is the dropdown and the rest are config.
// Anything unmarked is config, a data or state knob, listed with the others in the popover of the bar's one Config button.
// A setting with `when: { key, value }` shows in the bar only while that other setting has that value. The keys `fit` and `pgframe` are reserved: a setting must never use them.
// ============================================================================
import React from 'react';
import { gsUseMenuDismiss } from './gs-parts.jsx';
import { isFitted, isFramed, fitForward, useFit, setFit } from './fit.jsx';

const PG = {};
const PG_DESK = 1280;
export const pgRegister = (id, def) => { PG[id] = def; };

const pgQuery = () => new URLSearchParams(window.location.search);
export const pgActive = () => { const id = pgQuery().get('pg'); return id && PG[id] ? PG[id] : null; };
const pgOption = (s, v) => s.options.find((o) => o.value === v) || s.options[0];
const pgValue = (s) => pgOption(s, pgQuery().get(s.key)).value;

const pgSubs = new Set();
// The tab title's name for the open playground: its registered title, else its id; null without ?pg=.
export const pgTabName = () => { const d = pgActive(); return d ? (d.title || pgQuery().get('pg')) : null; };
export const pgSubscribe = (f) => { pgSubs.add(f); return () => pgSubs.delete(f); };
export const usePgSetting = (key) => {
  const [, bump] = React.useState(0);
  React.useEffect(() => { const f = () => bump((n) => n + 1); pgSubs.add(f); return () => pgSubs.delete(f); }, []);
  const def = pgActive(); const s = def && def.settings.find((x) => x.key === key);
  return s ? pgValue(s) : null;
};

// Opening a situation: a canon state keeps ?state= in step, so a reload lands on it (on arrival the page has staged it
// already); `go` runs once the state has staged, so a state can set up the account and `go` open what no state reaches.
const pgOpen = (o, url, arriving) => {
  if (o.state) { const had = url.searchParams.get('state') === o.state; url.searchParams.set('state', o.state); if (!(arriving && had) && window.kitGoState) window.kitGoState(o.state); }
  if (o.go) pgPending = o.go;
};
// A `go` waiting for the state to stage: run after the next render, when window.gsApi holds the staged app.
let pgPending = null;
const pgSet = (s, v) => {
  const url = new URL(window.location.href); url.searchParams.set(s.key, v);
  pgOpen(pgOption(s, v), url);
  window.history.replaceState(null, '', url);
  pgSubs.forEach((f) => f());
  if (isFitted()) fitForward(s.key, v);
};

window.pgSetFromParent = (key, v) => { const s = pgActive()?.settings.find((x) => x.key === key); if (s) pgSet(s, v); };

// A concept as a button naming its current choice, opening canon's menu (gs-pop) at once. Not a native select: a phone's
// own picker animates in and out, too slow for flicking between options. Previous / next buttons beside it step through the
// options without opening the menu.
const PgPick = ({ s, v }) => {
  const [open, setOpen] = React.useState(false); const wrap = React.useRef(null);
  gsUseMenuDismiss(open, setOpen, wrap);
  const i = s.options.findIndex((o) => o.value === v);
  const step = (d) => { const o = s.options[i + d]; if (o) pgSet(s, o.value); };
  return (
    <div className="pg-concept" role="group" aria-label={s.label}>
      <button type="button" className="pg-step" aria-label={'Previous ' + s.label} disabled={i <= 0} onClick={() => step(-1)}>‹</button>
      <div className="pg-pick gs-menu-anchor" ref={wrap}>
        <button type="button" className="pg-pick-btn" aria-label={s.label + ': ' + pgOption(s, v).label} aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((o) => !o)}><span>{pgOption(s, v).label}</span></button>
        {open && <div className="gs-pop pg-pop" role="menu" aria-label={s.label}>
          {s.options.map((o) => <button key={o.value} type="button" role="menuitemradio" aria-checked={o.value === v} className="gs-menu-item" onClick={() => { setOpen(false); pgSet(s, o.value); }}>{o.label}</button>)}
        </div>}
      </div>
      <button type="button" className="pg-step" aria-label={'Next ' + s.label} disabled={i >= s.options.length - 1} onClick={() => step(1)}>›</button>
    </div>);
};

// The Config button: one popover listing every config setting with its full label and its options as full-text buttons, the
// current one marked. It stays open while choices are made; outside tap, Esc and Close shut it.
const PgConfig = ({ settings }) => {
  const [open, setOpen] = React.useState(false); const wrap = React.useRef(null);
  gsUseMenuDismiss(open, setOpen, wrap);
  return (
    <div className="pg-config" ref={wrap}>
      <button type="button" className="pg-config-btn" aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen((o) => !o)}>Config</button>
      {open && <div className="pg-config-pop" role="dialog" aria-label="Config">
        <div className="pg-config-head"><span>Config</span><button type="button" className="pg-config-x" onClick={() => { setOpen(false); }}>Close</button></div>
        <div className="pg-config-body">
          {settings.map((s) => { const v = pgValue(s); return (
            <div key={s.key} className="pg-config-set" role="radiogroup" aria-label={s.label}>
              <div className="pg-config-label">{s.label}</div>
              <div className="pg-config-opts">
                {s.options.map((o) => <button key={o.value} type="button" role="radio" aria-checked={o.value === v} className="pg-config-opt" onClick={() => pgSet(s, o.value)}>{o.label}</button>)}
              </div>
            </div>); })}
        </div>
      </div>}
    </div>);
};

// Fit does something only below the width it lays the page out at, so its button shows only there (and while fitted, to turn it off).
const usePgNarrow = () => {
  const [n, setN] = React.useState(window.innerWidth < PG_DESK);
  React.useEffect(() => { const f = () => setN(window.innerWidth < PG_DESK); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, []);
  return n;
};

// KEEP: the bar takes the top bar's place (sticky), so the page below sits where it does in canon. At every width it is one row,
// at most 56px tall, with no title: previous, the concept's dropdown (current choice only; it may ellipsize on a phone), next, then
// Config for everything else, and Fit below 1280px.
export const PgBar = () => {
  const def = pgActive(); const [, bump] = React.useState(0);
  React.useEffect(() => { const f = () => bump((n) => n + 1); pgSubs.add(f); return () => pgSubs.delete(f); }, []);
  // Declared before the arrival effect, so a `go` set on arrival waits for the render the state causes.
  React.useEffect(() => { if (pgPending) { const f = pgPending; pgPending = null; f(window.gsApi); } });
  // On arrival, stage the situation the URL names, unless ?state= already opens it.
  React.useEffect(() => {
    const url = new URL(window.location.href);
    def.settings.forEach((s) => pgOpen(pgOption(s, pgValue(s)), url, true));
    window.history.replaceState(null, '', url);
  }, []);
  const framed = isFramed(); const fitted = useFit(); const narrow = usePgNarrow();
  const shown = def.settings.filter((s) => !s.when || pgValue(def.settings.find((x) => x.key === s.when.key)) === s.when.value);
  const concept = shown.find((s) => s.kind === 'concept'); const config = shown.filter((s) => s !== concept);
  return (
    <header className="gs-top pg-top" aria-label={'Playground: ' + def.title} {...(framed ? { inert: '', 'aria-hidden': 'true' } : {})}>
      <div className="gs-wrap pg-top-in">
        {concept && <PgPick s={concept} v={pgValue(concept)} />}
        <div className="pg-tools">
          {config.length > 0 && <PgConfig settings={config} />}
          {(narrow || fitted) && <button type="button" className="pg-fit-btn" aria-pressed={fitted} onClick={() => setFit(!fitted)}>Fit</button>}
        </div>
      </div>
    </header>);
};
