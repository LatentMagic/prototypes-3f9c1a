// ============================================================================
// After Pixels — playgrounds (PROTOTYPE AID). A playground compares options for one page. It registers its settings here
// with pgRegister; with ?pg=<id> in the URL, a settings bar replaces the top bar (main.jsx), and nothing else changes.
// Without ?pg= this file does nothing. Replacing the top bar suits a playground of one page; one that needs the top bar's
// navigation needs another layout, not built yet.
// A playground is one file, app/playground-<id>.jsx, with its CSS: it calls pgRegister in an init that main.jsx runs last,
// and wraps or replaces the page part it changes only when pgActive() is true, so canon is untouched without ?pg=.
//
//   pgRegister('guess-result', { title: 'Guess result', settings: [
//     { key: 'dir', label: 'Direction', options: [{ value: '6a', label: '6a Ring' }, { value: '7a', label: '7a Short line' }] },
//     { key: 'play', label: 'Play', options: [{ value: 'failed', label: 'Failed', state: 'session-word-failed' }] },
//   ] });
//   const dir = usePgSetting('dir');   // in the playground's own component: re-renders when it changes
//
// An option may open a situation: `state` is a canon state id (app/states.jsx); `go(gsApi)`, run after it, opens what no
// state reaches (give such an option a `state` too, to sign in and set the account first). Each
// setting's value is kept in the URL (&<key>=<value>), so a link opens exactly the view it was copied from; the first
// option is the default. Styles: app/playground.css.
//
// Every playground gets a Fit button in the bar: it shows the same page laid out 1280px wide, scaled to the window, in an
// iframe of this URL (&fit=1), so a phone shows how the page looks as a desktop. The bar stays outside, at phone size, and
// drives the framed page. The keys `fit` and `pgframe` are reserved: a setting must never use them.
// ============================================================================
import React from 'react';
import { gsUseMenuDismiss } from './gs-parts.jsx';

const PG = {};
export const pgRegister = (id, def) => { PG[id] = def; };

const pgQuery = () => new URLSearchParams(window.location.search);
export const pgActive = () => { const id = pgQuery().get('pg'); return id && PG[id] ? PG[id] : null; };
const pgOption = (s, v) => s.options.find((o) => o.value === v) || s.options[0];
const pgValue = (s) => pgOption(s, pgQuery().get(s.key)).value;

export const pgFitted = () => !!pgActive() && pgQuery().get('fit') === '1';
export const pgFramed = () => pgQuery().get('pgframe') === '1';  // true only inside Fit's iframe

const pgSubs = new Set();
export const usePgSetting = (key) => {
  const [, bump] = React.useState(0);
  React.useEffect(() => { const f = () => bump((n) => n + 1); pgSubs.add(f); return () => pgSubs.delete(f); }, []);
  const def = pgActive(); const s = def && def.settings.find((x) => x.key === key);
  return s ? pgValue(s) : null;
};

export const usePgFit = () => {
  const [, bump] = React.useState(0);
  React.useEffect(() => { const f = () => bump((n) => n + 1); pgSubs.add(f); return () => pgSubs.delete(f); }, []);
  return pgFitted();
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
  if (pgFitted()) pgForward(s.key, v);
};

// Fitted: the outer bar's change reaches the framed page, which runs the setting's state and go in its own app. A frame
// still loading cannot be called yet, so it reloads from the current URL instead.
const pgForward = (key, v) => {
  const fr = document.querySelector('.pg-fit-frame'); if (!fr) return;
  const w = fr.contentWindow;
  if (w && w.pgSetFromParent) w.pgSetFromParent(key, v); else fr.src = pgFrameUrl();
};
window.pgSetFromParent = (key, v) => { const s = pgActive()?.settings.find((x) => x.key === key); if (s) pgSet(s, v); };

const pgFrameUrl = () => { const u = new URL(window.location.href); u.searchParams.delete('fit'); u.searchParams.set('pgframe', '1'); return u.toString(); };

let pgScrollY = 0;
const pgSetFit = (on) => {
  const url = new URL(window.location.href);
  if (on) { pgScrollY = window.scrollY; url.searchParams.set('fit', '1'); } else url.searchParams.delete('fit');
  window.history.replaceState(null, '', url);
  pgSubs.forEach((f) => f());
  if (!on) requestAnimationFrame(() => window.scrollTo(0, pgScrollY));
};

// KEEP: Fit lays the page out 1280px wide, where every desktop rule in canon applies, and scales it down to the window (never up).
const PG_FIT_WIDTH = 1280;
export const PgFit = () => {
  const box = React.useRef(null); const [size, setSize] = React.useState({ w: 0, h: 0 });
  const [src] = React.useState(pgFrameUrl);
  React.useEffect(() => {
    const el = box.current; const read = () => setSize({ w: el.clientWidth, h: el.clientHeight }); read();
    const ro = new ResizeObserver(read); ro.observe(el); return () => ro.disconnect();
  }, []);
  const sc = size.w ? Math.min(1, size.w / PG_FIT_WIDTH) : 1;
  return (
    <div className="pg-fit" ref={box}>
      <iframe className="pg-fit-frame" title="Desktop view" src={src}
        style={{ width: PG_FIT_WIDTH, height: Math.round(size.h / sc), transform: 'scale(' + sc + ')' }} />
    </div>);
};

// Phone: a setting as a button naming its choice, opening canon's menu (gs-pop) at once. Not a native select: a phone's
// own picker animates in and out, too slow for flicking between options.
const PgPick = ({ s, v }) => {
  const [open, setOpen] = React.useState(false); const wrap = React.useRef(null);
  gsUseMenuDismiss(open, setOpen, wrap);
  return (
    <div className="pg-pick gs-menu-anchor" ref={wrap}>
      <button type="button" className="pg-pick-btn" aria-label={s.label + ': ' + pgOption(s, v).label} aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((o) => !o)}>{pgOption(s, v).label}</button>
      {open && <div className="gs-pop pg-pop" role="menu" aria-label={s.label}>
        {s.options.map((o) => <button key={o.value} type="button" role="menuitemradio" aria-checked={o.value === v} className="gs-menu-item" onClick={() => { setOpen(false); pgSet(s, o.value); }}>{o.label}</button>)}
      </div>}
    </div>);
};

// KEEP: the bar takes the top bar's place and height (one row, sticky), so the page below sits where it does in canon.
// Phone: each setting is a button opening a menu (PgPick), so every setting fits one row. From 640px: each setting is a row of buttons.
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
  const fitted = pgFitted(); const framed = pgFramed();
  return (
    <header className="gs-top pg-top" aria-label={'Playground: ' + def.title} {...(framed ? { inert: '', 'aria-hidden': 'true' } : {})}>
      <div className="gs-wrap pg-top-in">
        <span className="pg-title">{def.title}</span>
        {def.settings.map((s) => { const v = pgValue(s); return (
          <div key={s.key} className="pg-set" role="group" aria-label={s.label}>
            <span className="pg-label">{s.label}</span>
            <PgPick s={s} v={v} />
            <div className="pg-opts">{s.options.map((o) => <button key={o.value} type="button" aria-pressed={v === o.value} onClick={() => pgSet(s, o.value)}>{o.label}</button>)}</div>
          </div>); })}
        {!framed && <button type="button" className="pg-fit-btn" aria-pressed={fitted} onClick={() => pgSetFit(!fitted)}>Fit</button>}
      </div>
    </header>);
};
