// ============================================================================
// Hi-fi canvas: the tabs of After Pixels' signed-out homepage block in the low-fi shape (a frame wrapping the closed games, the open
// game merged into the frame), in four palettes taken from the design system's own colour tokens. Each is placed in a slice of the
// real homepage (the foot of canon's own Available games, then the block) at desktop and phone. Only what the tabs question needs is
// drawn: the game and chat side is a placeholder edge with the reply bar. The behaviour every palette keeps comes from round 12 of the
// homepage block (concept 1, Mobile first): fixed order, the mark on the open game, the open tab holding the part, the intro and
// "See <game> ›"; a column on desktop, three equal tabs on a phone with the intro in a strip under them. Canon's app runs underneath
// (its candidate hook renders this canvas in place of the page).
// ============================================================================
import './candidate.js';
import '../../canon/app/main.jsx';
import React from 'react';
import { DS, GS_GAMES } from '../../canon/app/gs-data.jsx';
import { GsHome } from '../../canon/app/gs-pass-home.jsx';
import './canvas.css';

// The block's words are the user's, verbatim (the task's Goal).
const HEADING = 'Your AI, cast for each game.';
const SENTENCE = 'Step into a story, crack a puzzle or talk through a mystery.';
const GAMES = [
  { id: 'delve', gid: 'delve', part: 'Game Master', intro: 'It sets each scene, plays everyone you meet and asks what you do next.' },
  { id: 'guess', gid: 'word', part: 'Host', intro: 'It shows how each guess scored and keeps a hint back until you want it.' },
  { id: 'accuse', gid: 'mystery', part: 'Thinking partner', intro: 'Stuck? Ask, and it turns the case into smaller questions. The deduction stays yours.' },
].map((g) => ({ ...g, name: GS_GAMES[g.gid].name }));

const PALETTES = [
  { n: 1, name: 'Off-white buttons',
    tokens: 'Frame --page with a 1px --line edge; closed games --off-white with --page text; the open game --page with --text, merged into the frame; panel --off-white.' },
  { n: 2, name: 'White buttons',
    tokens: 'Frame --page with a 1px --line edge; closed games --white with --page text, beside the --off-white panel and Start free; the open game --page, merged into the frame.' },
  { n: 3, name: 'Card buttons',
    tokens: 'Frame --page with a 1px --line edge; closed games --card with a 1px --line edge and --text; the open game --page, merged into the frame; the only light is the --off-white panel.' },
  { n: 4, name: 'Inverted',
    tokens: 'Frame and panel one --off-white surface; closed games --card with --text; the open game --off-white with --page text, part of that surface; a --c-edge hairline (the chat’s own edge) between the tabs and the panel.' },
];

// All three intros sit in one grid cell with only the open one showing, so the open tab is as tall as the longest and the block never changes height on a tap.
const Intro = ({ open }) => (
  <div className="tb-ins">{GAMES.map((g) => (
    <div key={g.id} className={'tb-intro' + (g.id === open ? '' : ' is-ghost')} aria-hidden={g.id === open ? undefined : true}>
      <p>{g.intro}</p>
      <DS.TextLink href="#" tabIndex={g.id === open ? 0 : -1}>See {g.name} ›</DS.TextLink>
    </div>))}</div>);

// The tabs: the three games in a fixed order.
const Tabs = ({ open, size }) => (
  <div className={'tb-tabs is-' + size} role="tablist" aria-label="Games">
    {GAMES.map((g) => {
      const on = g.id === open;
      return (
        <div key={g.id} className={'tb-tab' + (on ? ' is-open' : '')}>
          <button type="button" role="tab" aria-selected={on} className="tb-tab-b">
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

// The block in one palette. The set is a .mcp-chat scope only in 4, where the frame is the chat's own surface.
const Block = ({ p, open, size }) => (
  <section className={'gs-band tb-block is-p' + p + ' is-' + size} aria-label={HEADING}>
    <div className="tb-head"><DS.Heading level="section">{HEADING}</DS.Heading><p className="gs-muted">{SENTENCE}</p></div>
    <div className={'tb-set' + (p === 4 ? ' mcp-chat' : '')}>
      <Tabs open={open} size={size} />
      <Panel size={size} />
    </div>
  </section>);

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
  { size: 'phone', w: 390, open: 'accuse', cap: 'Phone · 390px · Accuse open' },
];

const Canvas = () => (
  <main className="cv">
    <h1 className="cv-title">Homepage block: the tabs in four palettes</h1>
    <p className="cv-note cv-intro">One shape, the low-fi tabs, in four palettes from the design system’s colour tokens. Each sits in a slice of the real homepage: the foot of Available games, then the block. The game and chat side is drawn as an edge only. Wide frames are drawn at their real width and scaled down to fit a small screen.</p>
    {PALETTES.map((pl) => (
      <section key={pl.n} className="cv-sec" aria-labelledby={'cv-' + pl.n}>
        <h2 id={'cv-' + pl.n} className="cv-h">{pl.n}. {pl.name}</h2>
        <p className="cv-note">{pl.tokens}</p>
        <div className="cv-col">
          {WIDTHS.map((x) => (
            <figure key={x.size} className="cv-fig" style={{ maxWidth: x.w }}>
              <figcaption className="cv-cap">{pl.n}. {pl.name} · {x.cap}</figcaption>
              <Scaled w={x.w}><Slice><Block p={pl.n} open={x.open} size={x.size} /></Slice></Scaled>
            </figure>))}
        </div>
      </section>))}
  </main>);

window.KitCandidate.Screen = Canvas;
