// ============================================================================
// v11 — THE BACKGROUND CARD, rebuilt. Three ways.
//
// The first attempt got the object wrong. It painted the thought on
// --color-surface-sunken (#F5F5F2) against a #FAFAF7 canvas: two per cent apart,
// on a token that means "a sunken well inside a card". So it read as a slot cut
// into the page, not as a card behind a card. It is now a CARD: the same white,
// the same border, the same radius as the card in front of it — and the FRONT
// card carries the shadow, so it visibly sits on top of something. The back card
// also stands 6px wider on each side, so you see its corners, not a band.
//
// The closed line follows one rule, and it is the answer to the question the
// first attempt dodged: THE BAND NEVER TRUNCATES. It shows the thought's opening
// sentence whole, measured; if that sentence will not fit on one line it shows a
// label instead — who wrote it and how much there is. No gradient, no soft edge,
// no cut words anywhere in the family.
//
// The three differ only in where the second card goes when it opens: round to
// the front of the shelf, up over the card, or over the top as its reverse.
// ============================================================================
const T11_BACK_CARD = {
  background: 'var(--color-surface)', borderWidth: 1, borderStyle: 'solid',
  borderColor: 'var(--color-border-1)', borderRadius: 'var(--radius-lg)',
};
const T11_DEPTH = 22;  // how far the back card sits under the front card's foot
const T11_BLEED = 6;   // how far it stands out on each side
const T11_PADX = 'calc(var(--space-5) + 6px)';  // aligns band text with card text

const T11_NUM = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'];
const t11Extent = (t) => (t.bullets ? T11_NUM[t.bullets.length] + ' points' : 'a paragraph');
const t11First = (text) => { const m = /^([\s\S]+?[.?!])(\s|$)/.exec(text); return m ? m[1] : text; };
const T11_SPINE_FONT = '400 13.5px/1.45 var(--font-sans)';

// ---------------------------------------------------------------------------
// The band's one line. A hidden probe of the same width decides, on every layout
// and every resize, whether the opening sentence fits on one line. It either
// fits and is shown whole, or it does not and the line becomes a label. Nothing
// in between, so nothing is ever cut.
// ---------------------------------------------------------------------------
const T11Spine = ({ t, verb }) => {
  const probe = React.useRef(null);
  const first = t11First(t.text);
  const [fits, setFits] = React.useState(true);
  React.useLayoutEffect(() => {
    const measure = () => { if (probe.current) setFits(probe.current.scrollHeight <= 26); };
    measure();
    const ro = window.ResizeObserver ? new ResizeObserver(measure) : null;
    if (ro && probe.current) ro.observe(probe.current);
    window.addEventListener('resize', measure);
    return () => { window.removeEventListener('resize', measure); if (ro) ro.disconnect(); };
  }, [first]);
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, minWidth: 0 }}>
      <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
        <div ref={probe} aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0,
          visibility: 'hidden', pointerEvents: 'none', font: T11_SPINE_FONT }}>{first}</div>
        {fits
          ? <p style={{ margin: 0, font: T11_SPINE_FONT, color: 'var(--color-fg-2)', whiteSpace: 'nowrap',
              overflow: 'hidden' }}>{first}</p>
          : <p style={{ margin: 0, font: T11_SPINE_FONT, color: 'var(--color-fg-3)' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-fg-2)' }}>{t.by}</span>
              {'\u2003\u00b7\u2003' + t11Extent(t)}
            </p>}
      </div>
      {verb && <span style={{ flexShrink: 0, font: '600 12.5px/1.45 var(--font-sans)', color: 'var(--color-accent)' }}>{verb}</span>}
    </div>
  );
};

// The front card, with the shadow that makes the thing behind it read as behind.
const T11Front = ({ card }) => (
  <div style={{ position: 'relative', zIndex: 2, borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-raised)' }}>{card}</div>
);

// The back card's visible edge: tucked T11_DEPTH under the foot, standing
// T11_BLEED wider on each side. A button only when there is something to open.
const T11Edge = ({ onClick, label, children, innerStyle, style }) => {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag {...(onClick ? { type: 'button', onClick, 'aria-label': label, className: 'circ-t11-band' } : {})}
      style={{ display: 'block', width: 'calc(100% + ' + (T11_BLEED * 2) + 'px)', boxSizing: 'border-box',
        textAlign: 'left', padding: 0, borderWidth: 0,
        background: 'transparent', cursor: onClick ? 'pointer' : 'default', position: 'relative', zIndex: 1,
        margin: '-' + T11_DEPTH + 'px -' + T11_BLEED + 'px 0', ...style }}>
      <div style={{ ...T11_BACK_CARD, paddingTop: T11_DEPTH + 11, paddingBottom: 11,
        paddingLeft: T11_PADX, paddingRight: T11_PADX, ...innerStyle }}>{children}</div>
    </Tag>
  );
};

// What the open second card holds, in all three: the words in card ink (it is a
// card, so it is not a recessed register), then the name, then the way back.
const T11Held = ({ t, back, backLabel }) => (
  <div className="circ-t11-rise">
    <window.T11Words t={t} size={14.5} lh={1.6} color="var(--color-fg-1)" gap={10} />
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 14, marginTop: 14 }}>
      <span style={{ font: '600 12.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{t.by}</span>
      {back && <span style={{ font: '600 12.5px/1.3 var(--font-sans)', color: 'var(--color-accent)' }}>{backLabel}</span>}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// B1 · Comes round — the second card comes round from behind and lands in front
// of the shelf, aligned to the same edges as the card above it. Two cards, one
// unit. It pushes the shelf down, which is the price of the thought being read
// in place with nothing covered.
// ---------------------------------------------------------------------------
const T11B1 = ({ item, api, card }) => {
  const t = item.thought;
  const open = api.isOpen(item.id);
  const long = window.PGT11Data.t11Long(t);
  return (
    <div style={{ position: 'relative' }}>
      <T11Front card={card} />
      <T11Edge onClick={long ? () => api.toggle(item.id) : null}
        label={(open ? 'Put away' : 'Read all of') + ' what ' + t.by + ' wrote'}
        style={{ margin: open ? '10px 0 0' : '-' + T11_DEPTH + 'px -' + T11_BLEED + 'px 0',
          width: open ? '100%' : 'calc(100% + ' + (T11_BLEED * 2) + 'px)',
          transition: 'margin var(--duration-slow) var(--ease-quiet), width var(--duration-slow) var(--ease-quiet)' }}
        innerStyle={{ paddingTop: open ? 16 : T11_DEPTH + 11, paddingBottom: open ? 14 : 11,
          transition: 'padding var(--duration-slow) var(--ease-quiet)' }}>
        {open ? <T11Held t={t} back backLabel="Put it back" /> : <T11Spine t={t} verb={long ? 'Read on' : null} />}
      </T11Edge>
    </div>
  );
};

// ---------------------------------------------------------------------------
// B2 · Comes over — the second card slides up out from behind and stands over
// the card it belongs to, in its own footprint. It keeps a hairline header with
// the link's title, so the words never float free of what they are about. The
// shelf does not move at all.
// ---------------------------------------------------------------------------
const T11B2 = ({ item, api, card }) => {
  const t = item.thought;
  const open = api.isOpen(item.id);
  const long = window.PGT11Data.t11Long(t);
  const panel = React.useRef(null);
  window.t11UseEsc(open, () => api.close());
  window.t11UseOutside(open, panel, () => api.close());
  return (
    <div style={{ position: 'relative' }}>
      <T11Front card={card} />
      <T11Edge onClick={long ? () => api.openOne(item.id) : null}
        label={'Read what ' + t.by + ' wrote'}>
        <T11Spine t={t} verb={long ? 'Read it over' : null} />
      </T11Edge>
      {open && (
        <div ref={panel} className="circ-t11-over" style={{ position: 'absolute', left: -T11_BLEED, right: -T11_BLEED,
          bottom: 0, minHeight: '100%', zIndex: 40, ...T11_BACK_CARD, boxShadow: 'var(--shadow-overlay)',
          padding: '14px ' + T11_PADX + ' 14px' }}>
          <div style={{ font: '500 12px/1.4 var(--font-sans)', color: 'var(--color-fg-3)', paddingBottom: 12,
            marginBottom: 14, borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--color-border-2)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
          <button type="button" onClick={() => api.close()} style={{ display: 'block', width: '100%', textAlign: 'left',
            background: 'transparent', borderWidth: 0, padding: 0, font: 'inherit', cursor: 'pointer' }}>
            <T11Held t={t} back backLabel="Slide it back" />
          </button>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// B3 · Turns over — the two cards are one slot, and the slot turns. The link
// card folds away, the thought comes round to the front in the same footprint,
// and the edge below swaps with it: closed it carries the opening sentence,
// turned it carries the title of the link you are now reading about. Nothing in
// the column moves except this slot's own height.
// ---------------------------------------------------------------------------
const T11B3 = ({ item, api, card }) => {
  const t = item.thought;
  const open = api.isOpen(item.id);
  const long = window.PGT11Data.t11Long(t);
  const front = React.useRef(null);
  const back = React.useRef(null);
  const [h, setH] = React.useState({ f: 0, b: 0 });
  React.useLayoutEffect(() => {
    const measure = () => setH({
      f: front.current ? front.current.offsetHeight : 0,
      b: back.current ? back.current.offsetHeight : 0,
    });
    measure();
    const ro = window.ResizeObserver ? new ResizeObserver(measure) : null;
    if (ro) { if (front.current) ro.observe(front.current); if (back.current) ro.observe(back.current); }
    window.addEventListener('resize', measure);
    return () => { window.removeEventListener('resize', measure); if (ro) ro.disconnect(); };
  }, [t.text, t.bullets, item.id]);
  const face = { position: 'absolute', top: 0, left: 0, right: 0, borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-raised)',
    // backface-visibility alone is not enough to trust: the swap is ALSO an
    // opacity step timed to the middle of the fold, so the hidden face is gone
    // in any renderer and cannot be clicked through.
    transition: 'opacity 60ms linear 190ms' };
  const hidden = { opacity: 0, pointerEvents: 'none' };
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative', zIndex: 2, perspective: 1600 }}>
        <div className="circ-t11-flip" style={{ position: 'relative',
          height: (open ? h.b : h.f) ? (open ? h.b : h.f) + 'px' : 'auto',
          transform: open ? 'rotateY(180deg)' : 'none' }}>
          <div ref={front} className="circ-t11-face" style={{ ...face, ...(open ? hidden : null) }}>{card}</div>
          <div ref={back} className="circ-t11-face" style={{ ...face, ...T11_BACK_CARD, ...(open ? null : hidden),
            transform: 'rotateY(180deg)', padding: '16px var(--space-5) 14px' }} aria-hidden={open ? undefined : 'true'}>
            <button type="button" onClick={() => api.close()} style={{ display: 'block', width: '100%', textAlign: 'left',
              background: 'transparent', borderWidth: 0, padding: 0, font: 'inherit', cursor: 'pointer' }}>
              <T11Held t={t} back backLabel="Turn it back" />
            </button>
          </div>
        </div>
      </div>
      <T11Edge onClick={long ? () => api.toggle(item.id) : null}
        label={(open ? 'Turn back to' : 'Turn over to') + ' what ' + t.by + ' wrote'}>
        {open
          ? <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, minWidth: 0 }}>
              <p style={{ margin: 0, flex: 1, minWidth: 0, font: T11_SPINE_FONT, color: 'var(--color-fg-3)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
              <span style={{ flexShrink: 0, font: '600 12.5px/1.45 var(--font-sans)', color: 'var(--color-accent)' }}>Turn back</span>
            </div>
          : <T11Spine t={t} verb={long ? 'Turn over' : null} />}
      </T11Edge>
    </div>
  );
};

// Every option needs the same two things of the app: a card, and a card with no
// words to leave alone. A card with no thought has nothing behind it.
const T11Back = ({ item, api, card, C }) => (item.thought ? <C item={item} api={api} card={card} /> : card);

window.T11_TUCK = [
  { n: 'B1', family: 'back', name: 'Comes round',
    dir: 'A white card behind the white card, standing 6px wider on each side, its edge showing a line below the foot. Tap and it comes round to the front of the shelf and aligns with the card above it \u2014 two cards, one unit.',
    cost: 'It pushes the shelf down, and once several are round the column is half thoughts. The unit is also two boxes deep, which is a lot of border for one link.',
    wrap: (item, api, card) => <T11Back item={item} api={api} card={card} C={T11B1} /> },
  { n: 'B2', family: 'back', name: 'Comes over',
    dir: 'The same edge closed. Opening slides the second card up over the card it belongs to, in its footprint, with a hairline header carrying the title so the words never float free. The shelf does not move.',
    cost: 'Reading the thought hides the link it is about, so the reader cannot hold both at once \u2014 and one is open at a time by necessity.',
    wrap: (item, api, card) => <T11Back item={item} api={api} card={card} C={T11B2} /> },
  { n: 'B3', family: 'back', name: 'Turns over',
    dir: 'Two cards, one slot, and the slot turns: the link folds away, the thought comes to the front in the same footprint, and the edge below swaps to carry the title of what you are now reading about.',
    cost: 'A turn is the boldest gesture here and the only one that takes the link off screen entirely. It also asks the slot to change height mid-fold.',
    wrap: (item, api, card) => <T11Back item={item} api={api} card={card} C={T11B3} /> },
];

Object.assign(window, { T11B1, T11B2, T11B3, T11Spine, T11Edge, T11Front, T11Held });
