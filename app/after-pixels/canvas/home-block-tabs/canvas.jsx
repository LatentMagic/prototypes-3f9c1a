// ============================================================================
// Hi-fi canvas: three treatments of the tabs in After Pixels' signed-out homepage block, each placed in a slice of the real
// homepage (the foot of canon's own Available games, then the block) at desktop, tablet and phone. Only what the tabs question
// needs is drawn: the game and chat side is a placeholder edge. The behaviour every treatment keeps comes from round 12 of the
// homepage block (concept 1, Mobile first): fixed order, the mark on the open game, the open tab holding the part, the intro and
// "See <game> ›"; a column on desktop, a row on tablet with the open one wide, three equal tabs on a phone with the intro in a
// strip under them. Canon's app runs underneath (its candidate hook renders this canvas in place of the page).
// ============================================================================
import './candidate.js';
import '../../canon/app/main.jsx';
import React from 'react';
import { DS, GS_GAMES } from '../../canon/app/gs-data.jsx';
import { GsArt } from '../../canon/app/gs-parts.jsx';
import { GsHome } from '../../canon/app/gs-pass-home.jsx';
import './canvas.css';

// The block's words are the user's, verbatim (the task's Goal).
const HEADING = 'Your AI, cast for each game.';
const SENTENCE = 'Step into a story, crack a puzzle or talk through a mystery.';
const GAMES = [
  { id: 'delve', gid: 'delve', part: 'Game Master', intro: 'It sets each scene, plays everyone you meet and asks what you do next.' },
  { id: 'guess', gid: 'word', part: 'Host', intro: 'It shows how each guess scored and keeps a hint back until you want it.' },
  { id: 'accuse', gid: 'mystery', part: 'Thinking partner', intro: 'Stuck? Ask, and it turns the case into smaller questions. The deduction stays yours.' },
].map((g) => ({ ...g, name: GS_GAMES[g.gid].name, art: GS_GAMES[g.gid].art }));

const TREATMENTS = [
  { n: 1, name: 'Literal carry-over',
    why: 'The low-fi tabs in the two colours the block has: a dark frame, the closed games as buttons in the light panel’s colour, the open game dark and merged into the frame.' },
  { n: 2, name: 'Picked in light',
    why: 'From How it works’ “Which app do you use?” picker: unpicked choices are outlined on the page ground and the picked one fills with the light, here running straight into the light panel. Light means picked, as everywhere on the platform, and there is no black frame.' },
  { n: 3, name: 'Game colour frame',
    why: 'From the homepage hero one block up, which frames its light chat in Delve’s colour: the frame takes the open game’s cover colour, and the closed games are the platform’s cards with their cover, as in Available games.' },
];

// All three intros sit in one grid cell with only the open one showing, so the open tab is as tall as the longest and the block never changes height on a tap.
const Intro = ({ open }) => (
  <div className="tb-ins">{GAMES.map((g) => (
    <div key={g.id} className={'tb-intro' + (g.id === open ? '' : ' is-ghost')} aria-hidden={g.id === open ? undefined : true}>
      <p>{g.intro}</p>
      <DS.TextLink href="#" tabIndex={g.id === open ? 0 : -1}>See {g.name} ›</DS.TextLink>
    </div>))}</div>);

// The tabs: the three games in a fixed order. The cover thumbnail shows only where a treatment draws it (3).
const Tabs = ({ open, size }) => (
  <div className={'tb-tabs is-' + size} role="tablist" aria-label="Games">
    {GAMES.map((g) => {
      const on = g.id === open;
      return (
        <div key={g.id} className={'tb-tab' + (on ? ' is-open' : '')}>
          <button type="button" role="tab" aria-selected={on} className="tb-tab-b">
            <span className="tb-thumb" aria-hidden="true"><GsArt art={g.art} shape="square" /></span>
            <span className="tb-label"><small>{g.name}</small><b>{g.part}</b></span>
          </button>
          {on && size !== 'phone' && <Intro open={open} />}
        </div>);
    })}
    {size === 'phone' && <div className="tb-strip"><Intro open={open} /></div>}
  </div>);

// The game and chat side, as an edge only: it is not in question. The chat's reply bar is drawn so its light reads as the chat's.
const Panel = ({ size }) => (
  <div className="mcp-chat tb-panel">
    {size !== 'phone' && <div className="tb-ph tb-ph-game">The game</div>}
    <div className="tb-ph tb-ph-chat">
      <span>The chat</span>
      <div className="mcp-chat-comp tb-reply" role="group" aria-label="Reply"><span>Reply</span><DS.Button>Start free</DS.Button></div>
    </div>
  </div>);

// The cover ground of each game's art, which 3. Game colour frame paints the frame with.
const GROUND = { delve: 'wine', word: 'forest', murder: 'wine' };
const Block = ({ t, open, size }) => {
  const ground = GROUND[GAMES.find((g) => g.id === open).art];
  return (
    <section className={'gs-band tb-block is-t' + t + ' is-' + size} aria-label={HEADING}>
      <div className="tb-head"><DS.Heading level="section">{HEADING}</DS.Heading><p className="gs-muted">{SENTENCE}</p></div>
      <div className="tb-set" style={{ '--tb-ground': 'var(--cover-bg-' + ground + ')' }}>
        <Tabs open={open} size={size} />
        <Panel size={size} />
      </div>
    </section>);
};

// A slice of the real homepage: the foot of canon's Available games (its own component, cropped from the top), then the block.
const Slice = ({ children }) => (
  <div className="tb-slice">
    <div className="tb-crop" aria-hidden="true"><GsHome /></div>
    <div className="gs-wrap tb-after">{children}</div>
  </div>);

// ---- Canvas furniture ----
// A frame drawn at its real width. Where the page is narrower, the frame is scaled down to fit, never scrolled (measured by script).
const Scaled = ({ w, children }) => {
  const outer = React.useRef(null); const inner = React.useRef(null);
  const [k, setK] = React.useState(1); const [h, setH] = React.useState(0);
  React.useLayoutEffect(() => {
    const fit = () => { setK(Math.min(1, outer.current.clientWidth / w)); setH(inner.current.offsetHeight); };
    fit(); const ro = new ResizeObserver(fit); ro.observe(outer.current); ro.observe(inner.current); return () => ro.disconnect();
  }, [w]);
  return (
    <div ref={outer} className="cv-scaled" style={{ maxWidth: w, height: h * k || undefined }}>
      <div ref={inner} className="cv-frame gs" style={{ width: w, transform: 'scale(' + k + ')' }}>{children}</div>
    </div>);
};
const WIDTHS = [
  { size: 'desktop', w: 1280, open: 'delve', cap: 'Desktop · 1280px · Delve open' },
  { size: 'tablet', w: 768, open: 'guess', cap: 'Tablet · 768px · Guess open' },
  { size: 'phone', w: 390, open: 'accuse', cap: 'Phone · 390px · Accuse open' },
];

const Canvas = () => (
  <main className="cv">
    <h1 className="cv-title">Homepage block: three treatments for the tabs</h1>
    <p className="cv-note cv-intro">Each treatment sits in a slice of the real homepage: the foot of Available games, then the block. The game and chat side is drawn as an edge only. Wide frames are drawn at their real width and scaled down to fit a small screen.</p>
    {TREATMENTS.map((tr) => (
      <section key={tr.n} className="cv-sec" aria-labelledby={'cv-' + tr.n}>
        <h2 id={'cv-' + tr.n} className="cv-h">{tr.n}. {tr.name}</h2>
        <p className="cv-note">{tr.why}</p>
        <div className="cv-col">
          {WIDTHS.map((x) => (
            <figure key={x.size} className="cv-fig" style={{ maxWidth: x.w }}>
              <figcaption className="cv-cap">{tr.n}. {tr.name} · {x.cap}</figcaption>
              <Scaled w={x.w}><Slice><Block t={tr.n} open={x.open} size={x.size} /></Slice></Scaled>
            </figure>))}
        </div>
      </section>))}
  </main>);

window.KitCandidate.Screen = Canvas;
