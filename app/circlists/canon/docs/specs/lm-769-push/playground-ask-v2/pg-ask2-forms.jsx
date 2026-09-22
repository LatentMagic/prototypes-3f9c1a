// ============================================================================
// LM-769 · the ask, round two — five forms. Same words, same device dialog,
// same feed. What differs is WHAT KIND OF THING the ask is:
//
//   1 the block   prose, given a shape so it is neither centred nor a fragment
//   2 the card    an object in the list, in the list's own vocabulary
//   3 the banner  chrome above the list, bled to the full content row
//   4 the setting not a pitch at all — the Account control, brought forward
//   5 the tail    the same sentence, at the FOOT of the list instead of its head
//
// Every form is responsive by container query or by plain flow; none reads a
// posture flag. The × is the same 44px control in all five.
// ============================================================================
const { Icon, Button, CircSwitch } = window;

const PgaX = ({ onDismiss }) => (
  <button type="button" className="pga-x" onClick={onDismiss} aria-label="Dismiss"><Icon name="x" size={16} /></button>
);

// The prose forms take a WORD, not a glyph. A × is a mark that needs an edge to
// sit against: at the column edge it is an orphan with a corridor of dead space
// behind it, and after a short left-aligned line it floats in the middle of the
// column with nothing under it. Bounded forms (2, 3) have that edge; prose does
// not. So in prose the dismiss stays in the sentence's own register — quiet ink,
// no underline, clearly subordinate to the offer beside it. Hit height is the
// floor; the negative margin keeps it from inflating the line.
const PgaQuit = ({ onDismiss }) => (
  <button type="button" className="pga-quit" onClick={onDismiss}>Dismiss</button>
);

// 1 — THE BLOCK. The sentence he liked, left on the cards' own edge, but set as
// a two-line block rather than one line that stops nowhere: statement above,
// offer beneath, × on the offer's own line. A block has a shape; a lone left
// line reads as a fragment that failed to fill its row.
const PgaBlock = ({ label, onTurnOn, onDismiss }) => (
  <div className="pga-block pga-top">
    <p className="pga-block-text">Know when new links land in your circles.</p>
    <div className="pga-block-line">
      <button type="button" className="circ-doorlink pga-block-go" onClick={onTurnOn}>{label}</button>
      <PgaX onDismiss={onDismiss} />
    </div>
  </div>
);

// 2 — THE CARD, built properly this time. The list is made of cards, so the
// offer is one: the card's surface, border, radius and padding, a title at card-
// title weight, a supporting line, the × where a card's actions sit, and the
// house SECONDARY for the offer — never the filled accent, which made the first
// pass the loudest thing on a screen of links.
const PgaCard = ({ label, onTurnOn, onDismiss }) => (
  <div className="pga-card pga-top">
    <div className="pga-card-head">
      <div style={{ minWidth: 0 }}>
        <div className="pga-card-title">Notifications</div>
        <p className="pga-card-body">Know when new links land in your circles. One message per circle, on whatever you read on.</p>
      </div>
      <PgaX onDismiss={onDismiss} />
    </div>
    <div className="pga-card-act"><Button variant="secondary" size="sm" onClick={onTurnOn}>{label}</Button></div>
  </div>
);

// 3 — THE BANNER. Not in the list: attached under it, and bled to the FULL
// content row — the width of <main>, so it spans everything right of the rail on
// desktop and the whole screen in the app posture. It arrives by sliding down
// out from under the tabs, opening its own slot as it comes, which is the
// grammar the returns bar already uses for something landing at the head of the
// feed. Nothing about its width or its ground is read from a posture flag: the
// bleed is MEASURED against the column's own parent, so it holds at 320, in the
// phone frame and on any desktop canvas.
const PGA_GROUNDS = {
  sunken: { background: 'var(--color-surface-sunken)', borderBottom: '1px solid var(--color-border-2)' },
  surface: { background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-1)' },
  accent: { background: 'var(--color-accent-soft)', borderBottom: '1px solid #CFEFE1' },
};

const PgaBanner = ({ label, onTurnOn, onDismiss, ground, full }) => {
  const slot = React.useRef(null);
  const strip = React.useRef(null);
  const [box, setBox] = React.useState(null);
  const [h, setH] = React.useState(null);
  const [leaving, setLeaving] = React.useState(false);
  React.useLayoutEffect(() => {
    const el = slot.current;
    if (!el) return undefined;
    const col = el.parentElement;
    const host = col && col.parentElement;
    if (!host) return undefined;
    // The bleed goes on the SLOT, not the strip: the slot clips (it owns the
    // height animation), so a strip wider than it would simply be cut off at
    // the column's edge. Everything is measured against the COLUMN — which does
    // not move when the slot changes width — and its own computed padding, so
    // the measurement never chases its own result.
    const measure = () => {
      const a = col.getBoundingClientRect();
      const b = host.getBoundingClientRect();
      const padL = parseFloat(getComputedStyle(col).paddingLeft) || 0;
      setBox(full
        ? { ml: b.left - (a.left + padL), w: b.width }
        : { ml: -padL, w: a.width });
      if (strip.current) setH(strip.current.offsetHeight);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    ro.observe(col);
    return () => ro.disconnect();
  }, [full]);
  const wrap = { marginTop: 'calc(0px - var(--circ-feed-pad-top, 16px))' };
  if (box) { wrap.marginLeft = box.ml; wrap.width = box.w; }
  if (h != null) wrap['--pga-bh'] = h + 'px';
  // Leaving is the arrival reversed and quicker — the returns bar's own pair of
  // timings (560 in, 400 out). Without it the banner opens a slot with motion
  // and then vanishes out of it, which reads as a glitch and makes the entrance
  // pointless. main.jsx owns the unmount, so the delay lives here.
  const quick = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const leave = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onDismiss, quick ? 1 : 400);
  };
  const cls = 'pga-bannerslot'
    + (h != null && !leaving ? ' pga-bannerslot-in' : '')
    + (leaving ? ' pga-bannerslot-out' : '');
  return (
    <div ref={slot} className={cls} style={wrap}>
      <div ref={strip} className="pga-banner" style={PGA_GROUNDS[ground] || PGA_GROUNDS.sunken}>
        <p className="pga-banner-text">
          Know when new links land in your circles.{' '}
          <button type="button" className="circ-doorlink pga-banner-go" onClick={onTurnOn}>{label}</button>
        </p>
        <PgaX onDismiss={leave} />
      </div>
    </div>
  );
};

// 4 — THE SETTING. Stop pitching. This is the Account row, surfaced once where
// the member already is: the label, the line, and the app's real switch. Turning
// it on raises the device dialog exactly as the Account switch does, so the
// control the member meets here is the control they will find later.
const PgaSetting = ({ onTurnOn, onDismiss }) => (
  <div className="pga-set pga-top">
    <p className="pga-set-text">Know when new links land in your circles.</p>
    <CircSwitch on={false} onChange={onTurnOn} label="Notifications" />
    <PgaX onDismiss={onDismiss} />
  </div>
);

// 5 — THE TAIL. The same quiet sentence, at the END of the Active list. An
// offer at the head interrupts the reading; an offer at the foot is met once
// the reading is done. `order` puts it last in the feed column — the column is
// already a flex column, so nothing in the app moves.
const PgaTail = ({ label, onTurnOn, onDismiss }) => (
  <div className="pga-tail">
    <p className="pga-tail-text">
      Know when new links land in your circles.{' '}
      <button type="button" className="circ-doorlink pga-tail-go" onClick={onTurnOn}>{label}</button>
    </p>
    <PgaX onDismiss={onDismiss} />
  </div>
);

Object.assign(window, { PgaBlock, PgaCard, PgaBanner, PgaSetting, PgaTail });
