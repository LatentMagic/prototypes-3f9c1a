// ============================================================================
// Session-pages playground: the share-text whiteboard. Not the app: no shell, no canon page, a full-window sheet over it.
// Per game, the candidates A to C of work/apps/mcp-game-store/session-pages/_resources/ideation/share-shortlist.md (data: pg/share-data.js),
// each as a win and as a loss, in a chat bubble at 393 and 360 columns. The bubble is a SIMULATION of WhatsApp: system font, its default size,
// a typical bubble share of the screen. Widths are approximate. Names are Pg-prefixed: Babel scripts share one global scope.
// ============================================================================
const PG_WIDTHS = [393, 360];
const PG_BUBBLE_SHARE = 0.8;   // a bubble's share of the screen width; WhatsApp's real value varies by device, so this is approximate

// A frame at a real phone width. If the window is narrower than the frame, the whole frame is scaled down (uniformly, so wrapping stays as at full width).
const PgPhone = ({ width, text }) => {
  const box = React.useRef(null);
  const [zoom, setZoom] = React.useState(1);
  React.useLayoutEffect(() => {
    const el = box.current; if (!el) return undefined;
    const room = el.closest('.pgs-pair');   // the row's own width, which does not depend on the frame
    const fit = () => setZoom(Math.min(1, room.clientWidth / width));
    fit(); const ro = new ResizeObserver(fit); ro.observe(room);
    return () => ro.disconnect();
  }, [width]);
  return (
    <figure className="pgs-fig">
      <figcaption className="pgs-cap">{width} columns{zoom < 1 ? ', shown at ' + Math.round(zoom * 100) + '% to fit' : ''}</figcaption>
      <div style={{ width: Math.round(width * zoom) }}>
        <div ref={box} className="pgs-phone" style={{ width, zoom }}>
          <div className="pgs-bubble" style={{ maxWidth: Math.round(width * PG_BUBBLE_SHARE) }}>
            <div className="pgs-text">{text}</div>
            <div className="pgs-meta">09:41 <span aria-hidden="true">✓✓</span></div>
          </div>
        </div>
      </div>
    </figure>
  );
};

const PgShareRow = ({ label, text }) => (
  <div className="pgs-row">
    <h4 className="pgs-row-h">{label}</h4>
    <div className="pgs-pair">{PG_WIDTHS.map((w) => <PgPhone key={w} width={w} text={text} />)}</div>
  </div>
);

const PgShareText = ({ game }) => {
  const cands = (window.PG_SHARE && window.PG_SHARE[game.id]) || [];
  return (
    <div className="pgs" role="region" aria-label={game.name + ' share text'}>
      <div className="pgs-in">
        <header className="pgs-head">
          <div className="pg-eyebrow">Whiteboard, not the app</div>
          <h1 className="pgs-title">{game.name}: share text</h1>
          <p className="pgs-note"><strong>The bubble is a simulation of a WhatsApp message, and the widths are approximate.</strong> It uses the system font at a typical default size and a bubble about 80% of the screen. Phones, fonts and text-size settings change where lines wrap. All texts are proposed, none deployed; figures are the shortlist’s own. The link is a placeholder.</p>
        </header>
        {cands.map((c) => (
          <section key={c.k} className="pgs-cand" data-rec={c.rec ? '1' : undefined}>
            <h2 className="pgs-cand-h"><span className="pgs-k">{c.k}</span> {c.name}{c.rec && <span className="pgs-rec">Recommended</span>}</h2>
            <PgShareRow label="Triumph" text={c.win} />
            <PgShareRow label="Failure" text={c.fail} />
          </section>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { PgShareText });
