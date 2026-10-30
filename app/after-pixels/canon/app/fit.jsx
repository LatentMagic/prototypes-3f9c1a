// ============================================================================
// After Pixels — Fit (PROTOTYPE AID). A button on the Config pill (config.jsx) that shows the current page laid out
// 1280px wide, scaled to the window, in an iframe of this URL (&fit=1), so a phone shows how the page looks as a desktop.
// It works on every page. Under a playground (?pg=, app/playground.jsx) the settings bar stays outside, at phone size, and
// drives the framed page. The keys `fit` and `pgframe` are reserved: a playground setting must never use them.
// Inside the frame (&pgframe=1) neither the pill nor a second Fit appears.
// ============================================================================
import React from 'react';

const fitQuery = () => new URLSearchParams(window.location.search);
export const isFitted = () => fitQuery().get('fit') === '1';
export const isFramed = () => fitQuery().get('pgframe') === '1';  // true only inside Fit's iframe

const fitSubs = new Set();
export const useFit = () => {
  const [, bump] = React.useState(0);
  React.useEffect(() => { const f = () => bump((n) => n + 1); fitSubs.add(f); return () => fitSubs.delete(f); }, []);
  return isFitted();
};

const fitFrameUrl = () => { const u = new URL(window.location.href); u.searchParams.delete('fit'); u.searchParams.set('pgframe', '1'); return u.toString(); };

let fitScrollY = 0;
export const setFit = (on) => {
  const url = new URL(window.location.href);
  if (on) { fitScrollY = window.scrollY; url.searchParams.set('fit', '1'); } else url.searchParams.delete('fit');
  window.history.replaceState(null, '', url);
  fitSubs.forEach((f) => f());
  if (!on) requestAnimationFrame(() => window.scrollTo(0, fitScrollY));
};

// Fitted: a playground bar's change reaches the framed page, which runs the setting's state and go in its own app. A frame
// still loading cannot be called yet, so it reloads from the current URL instead.
export const fitForward = (key, v) => {
  const fr = document.querySelector('.fit-frame'); if (!fr) return;
  const w = fr.contentWindow;
  if (w && w.pgSetFromParent) w.pgSetFromParent(key, v); else fr.src = fitFrameUrl();
};

// KEEP: Fit lays the page out 1280px wide, where every desktop rule in canon applies, and scales it down to the window (never up).
const FIT_WIDTH = 1280;
export const FitView = () => {
  const box = React.useRef(null); const [size, setSize] = React.useState({ w: 0, h: 0 });
  const [src] = React.useState(fitFrameUrl);
  React.useEffect(() => {
    const el = box.current; const read = () => setSize({ w: el.clientWidth, h: el.clientHeight }); read();
    const ro = new ResizeObserver(read); ro.observe(el); return () => ro.disconnect();
  }, []);
  const sc = size.w ? Math.min(1, size.w / FIT_WIDTH) : 1;
  return (
    <div className="fit" ref={box}>
      <iframe className="fit-frame" title="Desktop view" src={src}
        style={{ width: FIT_WIDTH, height: Math.round(size.h / sc), transform: 'scale(' + sc + ')' }} />
    </div>);
};
