// ============================================================================
// v11 — THE MARGIN, three ways. The thought sits inside the card's own head, set
// off by a sage rule in the gutter, in the card's own ink. Same family, same
// place, same register: the three differ on the reveal, the direction of travel
// and the closed budget, which is where the family is actually decided.
//
// The margin has never been shown with an interaction at all, so each of these
// is a whole answer: what a long thought looks like held closed, what asking to
// see it does, and how the reader puts it away without losing their place.
// ============================================================================
const { T11Words: TW, T11Clip: TC, T11Byline: TB, T11Fold: TF, T11Open: TO } = window;
const t11IsLong = (t) => window.PGT11Data.t11Long(t);
const T11_RULE = { borderLeftWidth: 2, borderLeftStyle: 'solid', borderLeftColor: 'var(--color-sage)', paddingLeft: 12 };

// ---------------------------------------------------------------------------
// M1 · Runs on — in place, pushing the shelf down.
// Two lines are the budget and the third is held behind a soft edge. The gutter
// rule does not stop where the words are cut: it runs on past them, further for
// a longer thought, so the closed state says both THAT there is more and roughly
// how much. Opening lets the words run down to meet the end of the rule.
// ---------------------------------------------------------------------------
const T11M1 = ({ item, api }) => {
  const t = item.thought;
  if (!t) return null;
  const open = api.isOpen(item.id);
  const long = t11IsLong(t);
  const tail = open || !long ? 0 : (t.bullets ? 30 : 14);
  const body = (
    <div style={{ ...T11_RULE, paddingBottom: tail, transition: 'padding-bottom 320ms var(--ease-quiet)' }}>
      <TC open={open} closedPx={45}><TW t={t} /></TC>
      <TB t={t}>{long && <TF open={open} more="Read on" less="Enough" />}</TB>
    </div>
  );
  return (
    <div style={{ marginTop: 6 }}>
      {long
        ? <TO t={t} onClick={() => api.toggle(item.id)} label={(open ? 'Put away' : 'Read all of') + ' what ' + t.by + ' wrote'}>{body}</TO>
        : body}
    </div>
  );
};

// ---------------------------------------------------------------------------
// M2 · Lifted forward — the card comes to the reader; the shelf does not move.
// Closed budget is one line and a soft edge, and the name is left to the footer
// row that already says who added it. Opening lifts THIS card off the shelf with
// its words whole; the shelf stays exactly where it was, so putting it away
// cannot lose anybody's place.
// ---------------------------------------------------------------------------
const T11M2 = ({ item, api }) => {
  const t = item.thought;
  if (!t) return null;
  const long = t11IsLong(t);
  const body = (
    <div style={T11_RULE}>
      <TC open={false} closedPx={23}><TW t={t} /></TC>
      {long && <div style={{ marginTop: 4 }}><TF open={false} more="Read it" /></div>}
    </div>
  );
  return (
    <div style={{ marginTop: 6 }}>
      {long
        ? <TO t={t} onClick={() => api.lift(item.id)} label={'Read what ' + t.by + ' wrote'}>{body}</TO>
        : body}
    </div>
  );
};

// The lifted card. The same card, off the shelf, with the margin holding the
// whole thought — and the card's own actions still on it, because it is the card.
const T11Lifted = ({ item, cardFor, onClose }) => {
  const wrap = React.useRef(null);
  const [box, setBox] = React.useState(null);
  window.t11UseEsc(true, onClose);
  React.useLayoutEffect(() => {
    const el = document.querySelector('[data-t11-card="' + item.id + '"]');
    if (!el) return;
    const clip = document.querySelector('.circ-phone-clip');
    const o = clip ? clip.getBoundingClientRect() : { left: 0, top: 0, height: window.innerHeight };
    const r = el.getBoundingClientRect();
    setBox({ left: r.left - o.left, top: r.top - o.top, width: r.width, vh: o.height });
  }, [item.id]);
  React.useLayoutEffect(() => {
    if (!box || !wrap.current) return;
    const h = wrap.current.offsetHeight;
    const max = box.vh - 20;
    if (box.top + h > max && box.top > 20) setBox(b => ({ ...b, top: Math.max(16, max - h) }));
  }, [box && box.top, box && box.vh]);
  if (!box) return null;
  return (
    <React.Fragment>
      <div onClick={onClose} className="circ-t11-scrim" style={{ position: 'fixed', inset: 0, zIndex: 120, background: 'var(--color-scrim)' }} />
      <div ref={wrap} className="circ-t11-lift" style={{ position: 'fixed', zIndex: 121, left: box.left, top: box.top, width: box.width,
        maxHeight: box.vh - 32, overflowY: 'auto', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-overlay)' }}>
        {cardFor(item)}
        <button type="button" onClick={onClose} aria-label="Put it away" className="circ-t11-liftclose"
          style={{ position: 'absolute', top: 8, right: 8, width: 32, height: 32, display: 'inline-flex', alignItems: 'center',
            justifyContent: 'center', background: 'var(--color-surface)', borderWidth: 1, borderStyle: 'solid',
            borderColor: 'var(--color-border-2)', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--color-fg-2)' }}>
          <window.Icon name="x" size={15} />
        </button>
      </div>
    </React.Fragment>
  );
};

// ---------------------------------------------------------------------------
// M3 · Rises over — the words come up out of the card's own head and stand over
// the cards ABOVE it. The card keeps its height and its place, the shelf never
// scrolls, and the reader's eye does not have to travel: the words appear where
// the one line they were reading already was. Nothing below the card moves at all.
// ---------------------------------------------------------------------------
const T11M3 = ({ item, api }) => {
  const t = item.thought;
  if (!t) return null;
  const open = api.isOpen(item.id);
  const long = t11IsLong(t);
  const panel = React.useRef(null);
  window.t11UseEsc(open, () => api.close());
  window.t11UseOutside(open, panel, () => api.close());
  const closed = (
    <div style={T11_RULE}>
      <TC open={false} closedPx={23}><TW t={t} /></TC>
      {long && <div style={{ marginTop: 4 }}><TF open={false} more="Bring it up" /></div>}
    </div>
  );
  return (
    <div style={{ marginTop: 6 }}>
      {long
        ? <TO t={t} onClick={() => api.openOne(item.id)} label={'Read what ' + t.by + ' wrote'}>{closed}</TO>
        : closed}
      {open && (
        <div ref={panel} className="circ-t11-rise" style={{ position: 'absolute', left: 'var(--space-5)', right: 'var(--space-5)', zIndex: 30,
          // Clears the card's action row rather than guessing at it: the card's
          // own bottom padding + the 44px row + the row's top gap + a hairline
          // of air. The panel may never sit over a control.
          bottom: 'calc(var(--space-4) + var(--tap-target-min) + var(--space-2) + 4px)',
          background: 'var(--color-surface)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--color-border-1)',
          borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-overlay)', padding: '14px 16px' }}>
          <div style={T11_RULE}>
            <TW t={t} />
            <TB t={t}><TF open={true} less="Put it back" /></TB>
          </div>
          <button type="button" onClick={() => api.close()} aria-label="Put it back"
            style={{ position: 'absolute', inset: 0, background: 'transparent', borderWidth: 0, cursor: 'pointer' }} />
        </div>
      )}
    </div>
  );
};

// The margin holding the whole thought, with no fold and no way in: what the
// lifted card shows, since the words are the reason it came forward.
const T11Whole = ({ item }) => item.thought ? (
  <div style={{ marginTop: 6, ...T11_RULE }}>
    <TW t={item.thought} />
    <TB t={item.thought} />
  </div>
) : null;

window.T11_MARGIN = [
  { n: 'M1', family: 'margin', name: 'Runs on',
    dir: 'Two lines held behind a soft edge, and a gutter rule that runs on past them to say how much more there is. Opening lets the words run down in place.',
    cost: 'The shelf grows. Open three long ones and the column is a wall \u2014 the fold has to be used, not just offered.',
    onCard: (item, api) => <T11M3Guard item={item} api={api} C={T11M1} /> },
  { n: 'M2', family: 'margin', name: 'Lifted forward',
    dir: 'One line closed. Opening lifts the card itself off the shelf with the words whole; the shelf underneath does not move a pixel.',
    cost: 'A scrim on a quiet shelf, and a modal\u2019s worth of ceremony for a paragraph somebody typed in ten seconds.',
    onCard: (item, api) => <T11M3Guard item={item} api={api} C={T11M2} />, lifts: true },
  { n: 'M3', family: 'margin', name: 'Rises over',
    dir: 'One line closed. The words rise out of the card\u2019s own head and stand over the cards above it \u2014 the card keeps its height, nothing below it moves.',
    cost: 'It covers its neighbours while it is up, and a very long thought reaches further up the shelf than a reader expects.',
    onCard: (item, api) => <T11M3Guard item={item} api={api} C={T11M3} /> },
];

// One place decides whether a card has words at all, so no option can silently
// render nothing and no option can grow a second copy of the check.
const T11M3Guard = ({ item, api, C }) => item.thought ? <C item={item} api={api} /> : null;

Object.assign(window, { T11M1, T11M2, T11M3, T11Lifted, T11M3Guard, T11Whole });
