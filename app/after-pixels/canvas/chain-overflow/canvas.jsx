// ============================================================================
// Hi-fi canvas: three ways to fit a long word on Chain's failed now card (library game page). Canon draws the last word's tiles at a
// fixed 48px, so a long word runs past the card. Every card is canon's own (ChNow, gs-chain-now.jsx) on a canvas-only session with a
// ten-letter word, the most Chain allows; 1 and 2 change only CSS (canvas.css), 3 swaps the word for the whole chain in words. Nothing
// here is ruled. Game data is rough.
// ============================================================================
import './candidate.js';
import '../../canon/app/main.jsx';
import React from 'react';
import { ChNow } from '../../canon/app/gs-chain-now.jsx';
import { GS_SESSIONS } from '../../canon/app/gs-data.jsx';
import { PZ } from '../../canon/app/gs-puzzles-library.jsx';
import './canvas.css';

// CABLE · TELEVISION · SET · BACK · FIRE · WORKS: BACK given away on its third wrong guess, the last guess finds TELEVISION (TEL
// shown), so the card draws the ten-letter word. Each wrong guess starts with the letters then showing.
const LONG = { w: ['CABLE', 'TELEVISION', 'SET', 'BACK', 'FIRE', 'WORKS'],
  p: [['FLAME', 4], ['FIRE', 4], ['BALL', 3], ['BAND', 3], ['BACON', 3], ['SIT', 2], ['SET', 2], ['TEA', 1], ['TELEPHONE', 1], ['TELEVISION', 1]] };
const SID = 'canvas-chain-long';
const N = 10; // letters in the word the card draws
const seed = () => { if (!GS_SESSIONS[SID]) GS_SESSIONS[SID] = { ...GS_SESSIONS['chain-today'], play: LONG }; };

// The card's inside at a phone page of width w: the page's 16px gutters, the card's 1px border and 16px padding.
const inside = (w) => w - 2 * 16 - 2 - 2 * 16;

// 2: tiles 48px while the word fits one row; otherwise 40px in balanced rows (per row: the letters shared evenly).
const breakAt = (w) => {
  const room = inside(w);
  if (N * 52 - 4 <= room) return null;
  const rows = Math.ceil((N * 44 - 4) / room);
  return Math.ceil(N / rows);
};

// 3: every word of the chain as text in a box, in the tiles' colours, wrapping like text. Replays the play as canon does.
const chainWords = (P) => {
  const end = P.w.length - 1;
  const w = P.w.map((word, i) => ({ word, state: i === 0 || i === end ? 'end' : 'hidden', shown: i === 0 || i === end ? word.length : 1 }));
  P.p.forEach(([g, k]) => { const x = w[k]; if (g === x.word) x.state = 'found'; else { x.shown += 1; if (x.shown >= x.word.length) x.state = 'given'; } });
  return w;
};
const CV_SAY = { end: '', found: '', given: ', given away', hidden: ', not found' };
const ChainWords = () => {
  const w = chainWords(LONG);
  return (
    <div className="cv-words" role="img" aria-label={'The chain: ' + w.map((x) => x.word + CV_SAY[x.state]).join(', ')}>
      {w.map((x, i) => <span key={i} className={'cv-w is-' + x.state} aria-hidden="true">{x.word}</span>)}
    </div>);
};
// Puts ChainWords in canon's card where the word sits (canvas.css hides canon's word for 3), so the links, count and frame stay canon's.
const InCard = ({ host }) => {
  const [at, setAt] = React.useState(null);
  // A passive effect: it runs once the frame's ref is set (a child's layout effect runs before its parent's ref is).
  React.useEffect(() => {
    const pic = host.current && host.current.querySelector('.cn-pic'); if (!pic) return undefined;
    const el = document.createElement('div'); el.className = 'cv-host'; pic.prepend(el); setAt(el);
    return () => el.remove();
  }, []);
  return at ? window.ReactDOM.createPortal(<ChainWords />, at) : null;
};

const Card = () => <ChNow c={{ ...PZ.chain, today: SID }} done />;

// Each card sits in a frame as wide as the phone, with the page's gutters; the frame scrolls sideways where the page would.
const Frame = ({ w, k }) => {
  const ref = React.useRef(null); const per = k === '2' ? breakAt(w) : null;
  return (
    <figure className="wc-fig">
      <figcaption className="gs-muted">{w}px wide phone</figcaption>
      <div ref={ref} className={'wc-frame' + (per ? ' is-broken' : '')} style={{ width: w, '--n': N, '--per': per || N }}>
        <div className="lb-lay"><Card /></div>
        {k === '3' && <InCard host={ref} />}
      </div>
    </figure>);
};

const ITEMS = [
  { k: 'today', n: 'Today', h: 'As canon draws it', note: 'Tiles stay 48px, so TELEVISION runs past the card at 390 and the page scrolls sideways at 320.' },
  { k: '1', n: '1', h: 'Shrink the tiles to fit', note: 'The platform’s way: tiles are 48px until the word is too wide, then all shrink until it fits on one row (about 29px at 390, 22px at 320).' },
  { k: '2', n: '2', h: 'Break the word onto two rows', note: 'Tiles stay a set size (40px once the word breaks) and the word splits into two even rows, as the guesses’ links already do.' },
  { k: '3', n: '3', h: 'Show the chain, not the last word', note: 'Every word of the chain in a small box, wrapping like text: ends light, found green, given away amber. The links and count stay.' },
];

const Canvas = () => {
  seed();
  return (
    <main className="wc">
      <h1 className="gs-h1">Chain: failed now card, a long word</h1>
      <p className="gs-muted wc-intro">Failed: BACK given away, the last guess found TELEVISION, ten letters, the longest a Chain word can be. Each version on a 390px and a 320px phone. Data is rough.</p>
      {ITEMS.map((it) => (
        <section key={it.k} className={'wc-item wc-' + it.k} aria-labelledby={'wc-' + it.k}>
          <h2 id={'wc-' + it.k} className="wc-h"><span className="wc-n">{it.n}</span>{it.h}</h2>
          <p className="gs-muted wc-note">{it.note}</p>
          <div className="wc-set">
            <Frame w={390} k={it.k} />
            <Frame w={320} k={it.k} />
          </div>
        </section>))}
    </main>);
};

window.KitCandidate.Screen = Canvas;
