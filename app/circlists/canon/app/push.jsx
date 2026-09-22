// ============================================================================
// Circlists — push notifications (LM-769). A DROPPABLE MODULE: main.jsx reads
// every export off `window` per render, so deleting this file removes the ask,
// the Account setting, the simulated device dialog and the device preview with
// no other edit. The staged states that point at them simply stop rendering.
//
// What lives here:
//   CircPushAsk         — the banner above a circle's Active list.
//   CircPushSetting     — the Notifications card on Account (four states).
//   CircPermissionAsk   — the simulated DEVICE dialog. Deliberately NOT drawn in
//                         Circlists UI: it is the operating system speaking, and
//                         a member has to read it as something the app does not
//                         own. System font stack, system blue, system alert box.
//   CircSwitch          — the on/off control. The app had no switch primitive
//                         (the only one lived in the discourse candidate), so it
//                         is defined here rather than promoted into primitives —
//                         one caller, and a droppable module may not be depended
//                         on by a file that must survive without it.
//
// THE ASK IS RESPONSIVE, NOT ADAPTIVE. It is a banner bled to the full content
// row, and that bleed is MEASURED against the feed column's own parent — never
// a viewport unit and never a posture flag, so the SAME element holds at 320px,
// in the app-posture phone frame (whose transform makes 100vw lie), on mobile
// web and on any desktop canvas. It is chrome at the head of the feed column,
// never a toast: a toast would have to be positioned against the viewport,
// which is exactly the adaptive fork this app does not make.
// ============================================================================

// ---- The ×'s return schedule ----------------------------------------------
// Dismissing HIDES the ask; it comes back 3 days after the first ×, 7 after the
// second, then every 30, and never once the device dialog has been raised. The
// feature owns its own rule: main.jsx reads the helper off `window` to decide
// whether the ask is due back, and the Config aid reads it to stage a wait.
// 0 dismissals means there is nothing to wait for.
const PUSH_SNOOZE_DAYS = [3, 7, 30];
const pushWaitDays = (n) => (n ? PUSH_SNOOZE_DAYS[Math.min(n, PUSH_SNOOZE_DAYS.length) - 1] : 0);

const CircSwitch = ({ on, onChange, label }) => (
  <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
    style={{ background: 'transparent', border: 0, padding: 8, margin: -8, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 44, minWidth: 44, flexShrink: 0 }}>
    <span aria-hidden="true" style={{
      width: 44, height: 26, borderRadius: 13, position: 'relative', flexShrink: 0,
      background: on ? 'var(--color-accent)' : 'var(--color-border-strong)',
      transition: 'background var(--duration-base) var(--ease-quiet)',
    }}>
      <span style={{
        position: 'absolute', top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: '50%',
        background: '#fff', boxShadow: '0 1px 2px rgba(10,10,10,0.2)',
        transition: 'left var(--duration-base) var(--ease-quiet)',
      }} />
    </span>
  </button>
);

// ---- The ask ---------------------------------------------------------------
// A BANNER: chrome above the list, not an object in it. Bled to the full
// content row, sitting flush under the tabs, arriving by sliding down out from
// under them while its own slot opens beneath it — the grammar the returns bar
// already uses for something landing at the head of the feed.
//   It is not a card and not a filled call to action. Earlier passes were both,
// and both were wrong: a box gives a passing offer the weight of a card, a
// filled accent button makes it the loudest thing on a screen full of links,
// and a worded dismiss sets the two answers side by side as if refusing were a
// decision worth spelling out. The × is the right size for "no", and it has the
// banner's own right edge to sit against.
//   Speaks for ALL the member's circles, not the one on screen — hence "your
// circles", never the circle it is standing in. `circ-doorlink` is the app's
// existing accent text link (resting underline, deepening on hover), so the
// offer is in the vocabulary the product already uses for a way through.
//   × HIDES it; main.jsx owns when it comes back (3 days, then 7, then every
// 30) and when it is finished with for good (the device dialog raised).
const CircPushAsk = ({ onTurnOn, onDismiss }) => {
  const slot = React.useRef(null);
  const strip = React.useRef(null);
  const [box, setBox] = React.useState(null);
  const [h, setH] = React.useState(null);
  const [leaving, setLeaving] = React.useState(false);
  // The bleed goes on the SLOT, not the strip: the slot owns the height
  // animation and therefore clips, so a strip wider than it would simply be cut
  // off at the column's edge. Everything is measured against the COLUMN — which
  // does not move when the slot changes width — plus its own computed padding,
  // so the measurement never chases its own result.
  React.useLayoutEffect(() => {
    const el = slot.current;
    if (!el) return undefined;
    const col = el.parentElement;
    const host = col && col.parentElement;
    if (!host) return undefined;
    const measure = () => {
      const a = col.getBoundingClientRect();
      const b = host.getBoundingClientRect();
      const padL = parseFloat(getComputedStyle(col).paddingLeft) || 0;
      setBox({ ml: b.left - (a.left + padL), w: b.width });
      if (strip.current) setH(strip.current.offsetHeight);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    ro.observe(col);
    return () => ro.disconnect();
  }, []);
  const wrap = {};
  if (box) { wrap.marginLeft = box.ml; wrap.width = box.w; }
  if (h != null) wrap['--circ-pushask-h'] = h + 'px';
  // Leaving is the arrival reversed and quicker (560 in, 400 out — the returns
  // bar's own pair). Without it the banner opens a slot with motion and then
  // vanishes out of it. main.jsx owns the unmount, so the delay lives here.
  const quick = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const leave = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onDismiss, quick ? 1 : 400);
  };
  const cls = 'circ-pushask-slot'
    + (h != null && !leaving ? ' circ-pushask-slot-in' : '')
    + (leaving ? ' circ-pushask-slot-out' : '');
  return (
    <div ref={slot} className={cls} style={wrap}>
      <div ref={strip} className="circ-pushask" role="region" aria-label="Notifications">
        <p className="circ-pushask-text">
          Get notified when new links land in your circles.{' '}
          <button type="button" className="circ-doorlink circ-pushask-go" onClick={onTurnOn}>Set up notifications</button>
        </p>
        <button type="button" className="circ-pushask-x" onClick={leave} aria-label="Dismiss">
          <window.Icon name="x" size={16} />
        </button>
      </div>
    </div>
  );
};

// ---- The Account setting ---------------------------------------------------
// Four states in one card, and only one of them carries a control:
//   deliverable + asked/unasked → label, supporting line, switch.
//   refused at the device level → a STATEMENT naming where to turn it back on.
//     Not a disabled switch: the app genuinely cannot change this, and a dead
//     control that says so only by being grey is the pattern
//     specs/governance/standards/ui-design.md rules out.
//   an iOS browser tab → a statement naming the one route to delivery. Same
//     reasoning: there is no control that could work here.
//   a browser that cannot deliver at all → NO CARD. An in-app browser — a link
//     opened inside another app — has no notification permission to give and no
//     Home Screen route to name, so there is nothing true to say and nothing to
//     offer. A statement about a capability the member cannot reach is noise on
//     a settings page, so the whole card withdraws and Account simply does not
//     mention notifications. `pushCardShown` is how Account asks.
//   "ON THIS DEVICE" SITS IN THE TITLE, not beside the switch. The switch's
//     scope is what the title names, so it is read once, on the way in, before
//     the control is reached — a second label beside a 44px control would
//     compete with the description and wrap badly at a phone width. And it
//     appears only where the switch does: with no control on the page there is
//     no scope to qualify, so the statement states wear the plain title.
const PUSH_CARD = {
  background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
  borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)',
};
const PUSH_TITLE = { fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, color: 'var(--color-fg-1)', marginBottom: 6 };
// Greedy wrap, NOT `balance`: balance evens the lines, which on a phone left a
// visible gap at the end of line 1 while the words that would fill it sat on
// line 2. The line fills, then wraps.
const PUSH_BODY = { fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 14, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: 0 };

const pushCardShown = (push) => !push || push.channel !== 'unsupported';

const CircPushSetting = ({ push = {}, onChange }) => {
  if (!pushCardShown(push)) return null;
  const statement = push.channel === 'ios-tab'
    ? 'To get notifications, add Circlists to your Home Screen: tap Share, then Add to Home Screen.'
    : push.perm === 'denied'
      ? 'Allow notifications for Circlists in your device settings.'
      : null;
  return (
    <div style={PUSH_CARD}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-5)' }}>
        {/* flex: 1, not the default auto basis. A shrink-to-fit flex item plus
            `text-wrap: balance` makes Chrome balance against the item's own
            intrinsic width — it binary-searches a narrower width and settles on
            three short even lines in a card with room for one. With a definite
            available width, balance only evens a wrap that actually happens. */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={PUSH_TITLE}>{statement ? 'Notifications' : 'Notifications on this device'}</div>
          <p style={PUSH_BODY}>{statement || 'Get notified when new links land in your circles.'}</p>
        </div>
        {!statement && <CircSwitch on={!!push.on} onChange={onChange} label="Notifications" />}
      </div>
    </div>
  );
};

// ---- The device dialog (simulated) ----------------------------------------
// The platform's own alert, not ours. Raised by exactly two things: the ask's
// button and turning the Account setting on for the first time. Shown once —
// after "Don't Allow" nothing in the app can raise it again.
const CircPermissionAsk = ({ onAnswer }) => {
  const allowRef = React.useRef(null);
  React.useEffect(() => {
    const t = setTimeout(() => allowRef.current && allowRef.current.focus(), 40);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="circ-osdialog-scrim" role="dialog" aria-modal="true" aria-label="Circlists would like to send you notifications">
      <div className="circ-osdialog">
        <div className="circ-osdialog-body">
          <p className="circ-osdialog-t">“Circlists” Would Like to Send You Notifications</p>
          <p className="circ-osdialog-b">Notifications may include alerts, sounds and icon badges. These can be configured in Settings.</p>
        </div>
        <div className="circ-osdialog-acts">
          <button type="button" onClick={() => onAnswer(false)}>Don’t Allow</button>
          <button type="button" ref={allowRef} onClick={() => onAnswer(true)}>Allow</button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { CircSwitch, CircPushAsk, CircPushSetting, CircPermissionAsk, PUSH_SNOOZE_DAYS, pushWaitDays, pushCardShown });
