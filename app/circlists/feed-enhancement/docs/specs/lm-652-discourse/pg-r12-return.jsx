// ============================================================================
// Return v12 — CHAPTER W: how the circle tells you a card you are watching has
// moved, from wherever you are standing in the circle.
//
// What the review kept, and what it threw out:
//   KEPT · v9's strip (N1) — liked, but its touch could be better.
//   KEPT · the fold: the green corner on a card you are watching, grey when you
//          are not. It is in all five options as the baseline, unchanged
//          (window.D9Fold, v9 state 3), because the marking of a card is not
//          what is under test here.
//   OUT  · the pill, the rise (cards re-ordered), the people row, "who answered
//          you", and the full-width band under the circle's name — the third
//          horizontal thing above the tabs.
//
// The question this chapter answers: the affordance must work on Active and on
// Read alike (circle-wide), and it must lead to a LIST of the actual cards, so
// you can pick the one you want to go back to. Two places the earlier round had
// ruled out are deliberately reopened: beside the circle's name, and beside
// circle settings. Each option is one PLACE plus one DESTINATION, and no two
// share both.
// ============================================================================
const { D9WantList: WLIST, d9Names: wNames, d9Spoke: wSpoke, d9Latest: wLatest, d9Title: wTtl } = window;

// One phrasing for every option, so the difference between them is never the
// words: who spoke, and how many cards are talking.
const w12Line = (wanted, st) => wanted.length
  ? wNames(wSpoke(wanted, st)) + ' spoke on ' + wanted.length + ' card' + (wanted.length === 1 ? '' : 's') + ' you are watching'
  : '';
const w12Short = (wanted) => wanted.length + ' talking';

// ---- the mark ---------------------------------------------------------------
// Never a micro dot (ruled out in v8): the mark is a word and a number, with the
// sage rule the circle already uses for "something was said here".
const W12Mark = ({ wanted, onClick, open, label, compact = false }) => (
  <button type="button" onClick={onClick} aria-expanded={open} className="circ-topaction"
    style={{ display: 'inline-flex', alignItems: 'center', gap: compact ? 6 : 7, flexShrink: 0, cursor: 'pointer',
      minHeight: 36, padding: compact ? '0 9px' : '0 11px', background: 'var(--color-surface)',
      borderWidth: 1, borderStyle: 'solid', borderColor: open ? 'var(--color-accent)' : 'var(--color-border-1)',
      borderRadius: 'var(--radius-pill)', font: '600 12.5px/1 var(--font-sans)', color: 'var(--color-fg-1)' }}>
    <span aria-hidden="true" style={{ width: 3, height: 13, borderRadius: 2, background: 'var(--color-sage)' }} />
    <span style={{ whiteSpace: 'nowrap' }}>{label}</span>
    <span aria-hidden="true" style={{ display: 'inline-flex', color: 'var(--color-fg-3)',
      transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base) var(--ease-quiet)' }}>
      <window.Icon name="chevron-down" size={14} />
    </span>
  </button>
);

// ---- the destination, as a panel dropped from the header --------------------
// A popover, not a sheet and not a page: it belongs to the control that opened
// it, it dismisses by tapping away, and the shelf behind it never moves.
const W12Panel = ({ wanted, st, goTo, onClose, travelId, isApp }) => (
  <React.Fragment>
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 58, background: 'rgba(10,10,10,0.16)' }} />
    <div role="dialog" aria-label="Cards still talking" className="circ-anim-fade"
      style={{ position: 'fixed', zIndex: 59, top: 'calc(var(--top-bar-height) + 6px)',
        right: isApp ? 10 : 24, left: isApp ? 10 : 'auto', width: isApp ? 'auto' : 420, maxWidth: 'calc(100vw - 20px)',
        maxHeight: 'calc(var(--circ-vh) - var(--top-bar-height) - 24px)', overflowY: 'auto',
        background: 'var(--color-surface)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--color-border-1)',
        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-overlay, var(--shadow-raised))', padding: '4px 2px 6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px 6px' }}>
        <window.D9Eyebrow>still talking</window.D9Eyebrow>
        <span style={{ flex: 1, minWidth: 0, font: '400 12.5px/1.4 var(--font-sans)', color: 'var(--color-fg-3)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w12Line(wanted, st)}</span>
      </div>
      <WLIST wanted={wanted} st={st} onGo={(it) => { onClose(); goTo(it); }} currentId={travelId} />
    </div>
  </React.Fragment>
);

// ---- W1/W5: into the app's own top bar, by portal --------------------------
// The shipped TopBar takes no slot for this, and a playground does not edit
// app/. So the control is portalled into the real header — beside the real name,
// ahead of the real gear — which is also the only honest way to see it compete
// for that corner.
// The app-shell mounts a circle as a page that slides in, so the header we
// attach to is replaced under us on entry and on every sub-view. The slot is
// therefore re-attached whenever it loses its host rather than attached once.
const useW12Slot = (attach) => {
  const [slot, setSlot] = React.useState(null);
  const ref = React.useRef(null);
  React.useEffect(() => {
    let live = true;
    const tick = () => {
      if (!live) return;
      const cur = ref.current;
      if (cur && cur.el.isConnected) return;
      if (cur && cur.cleanup) cur.cleanup();
      const made = attach();
      ref.current = made || null;
      setSlot(made || null);
    };
    tick();
    const iv = setInterval(tick, 250);
    return () => {
      live = false; clearInterval(iv);
      if (ref.current && ref.current.cleanup) ref.current.cleanup();
      ref.current = null;
    };
  }, []);
  return slot;
};

const w12Header = () => {
  const root = document.querySelector('.circ-phone-screen') || document;
  const hs = [...root.querySelectorAll('header')];
  return hs[hs.length - 1] || null;
};

const W12InHeader = ({ children, before = 'gear' }) => {
  const slot = useW12Slot(() => {
    const h = w12Header();
    if (!h) return null;
    const el = document.createElement('span');
    el.style.cssText = 'display:inline-flex;flex-shrink:0;align-items:center;margin-left:8px';
    if (before === 'gear') {
      const gear = h.querySelector('button[aria-label="Circle settings"]');
      if (gear) h.insertBefore(el, gear); else h.appendChild(el);
    } else {
      // The header's leading slot IS the name (a div on the web, the name span
      // itself in the app posture) — appending into it puts the mark directly
      // after the name, so a long name truncates instead of pushing it away.
      const name = h.firstElementChild;
      if (name) name.appendChild(el); else h.appendChild(el);
    }
    return { el, cleanup: () => el.remove() };
  });
  return slot ? ReactDOM.createPortal(children, slot.el) : null;
};

// W2 in the app posture: circle settings is not in the top bar there, it is the
// bottom bar's gear — so "beside circle settings" means a fourth slot in the
// three-slot bar. That is exactly the cost the option has to be judged on, so it
// is built rather than described.
const W12InNav = ({ children }) => {
  const slot = useW12Slot(() => {
    const root = document.querySelector('.circ-phone-screen') || document;
    const navs = [...root.querySelectorAll('nav[aria-label="Circle"]')];
    const nav = navs[navs.length - 1];
    if (!nav) return null;
    const el = document.createElement('span');
    el.style.cssText = 'flex:1;display:flex';
    const gear = nav.querySelector('button[aria-label="Settings"]');
    if (gear) nav.insertBefore(el, gear); else nav.appendChild(el);
    return { el, cleanup: () => el.remove() };
  });
  return slot ? ReactDOM.createPortal(children, slot.el) : null;
};

// A slot shaped exactly like the app's NavItem (app/app-shell.jsx), with the
// count where the label sits, so nothing new is invented in the thumb zone.
const W12NavSlot = ({ n, onClick, on }) => (
  <button type="button" onClick={onClick} aria-label="Still talking" className="circ-appnav-item"
    style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
      background: 'transparent', borderWidth: 0, cursor: 'pointer', minHeight: 54, padding: '7px 4px' }}>
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <window.Icon name="feed" size={22} color={on ? 'var(--color-accent)' : 'var(--color-fg-2)'} strokeWidth={1.5} />
      {n > 0 && <span aria-hidden="true" style={{ position: 'absolute', top: -2, right: -8, minWidth: 15, height: 15,
        padding: '0 4px', borderRadius: 8, background: 'var(--color-sage)', color: '#fff',
        font: '600 9.5px/15px var(--font-sans)', textAlign: 'center' }}>{n}</span>}
    </span>
    <span style={{ font: '500 10.5px/1 var(--font-sans)', letterSpacing: '0.01em',
      color: on ? 'var(--color-accent)' : 'var(--color-fg-3)' }}>Talking</span>
  </button>
);

// ---- W3: the tab row, with a third segment ---------------------------------
// A documented copy of Tabs (app/shell.jsx): the shipped component's two tabs
// are hard-coded and it takes no third, and a playground does not edit app/.
// Geometry, weights, sticky offset and accent underline are unchanged.
const W12Tabs = ({ active, onChange, n }) => {
  const items = [{ id: 'active', label: 'Active' }, { id: 'read', label: 'Read' },
    { id: 'talking', label: 'Talking' }];
  return (
    <div style={{ background: 'var(--color-surface)', borderBottomWidth: 1, borderBottomStyle: 'solid',
      borderBottomColor: 'var(--color-border-2)', padding: '0 16px', display: 'flex', gap: 4,
      position: 'sticky', top: 'var(--top-bar-height)', zIndex: 49 }}>
      {items.map(t => {
        const on = active === t.id;
        const last = t.id === 'talking';
        return (
          <button key={t.id} type="button" onClick={() => onChange(t.id)} aria-current={on} style={{
            background: 'transparent', borderWidth: 0, padding: '15px 14px', cursor: 'pointer',
            fontFamily: 'var(--font-sans)', fontWeight: on ? 600 : 500, fontSize: 14,
            color: on ? 'var(--color-accent)' : 'var(--color-fg-2)',
            borderBottomWidth: 2, borderBottomStyle: 'solid',
            borderBottomColor: on ? 'var(--color-accent)' : 'transparent',
            marginBottom: -1, marginLeft: last ? 'auto' : 0, transition: 'color var(--duration-base), border-color var(--duration-base)',
            display: 'inline-flex', alignItems: 'center', gap: 7, minHeight: 48 }}>
            <span>{t.label}</span>
            {last && n > 0 && <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%',
              background: 'var(--color-sage)' }} />}
          </button>
        );
      })}
    </div>
  );
};

// ---- W4: v9's strip, with the touch made explicit --------------------------
// Same place (the head of the feed) and same behaviour (opens in place, walks you
// card to card) — but it now reads as a control: a 56px row, a bordered chevron
// target on the right, the line in the circle's own voice, and it stands on
// whichever tab you are on rather than only on Read.
const W12Strip = ({ wanted, st, goTo, travelId, tab }) => {
  const [open, setOpen] = React.useState(false);
  if (!wanted.length) return null;
  const at = Math.max(0, wanted.findIndex(i => i.id === travelId));
  return (
    <div style={{ background: 'var(--color-surface)', borderWidth: 1, borderStyle: 'solid',
      borderColor: open ? 'var(--color-border-1)' : 'var(--color-border-1)', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-raised)', overflow: 'hidden' }}>
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} className="circ-d9-row"
        style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 56, padding: '0 10px 0 14px',
          background: 'transparent', borderWidth: 0, cursor: 'pointer', textAlign: 'left' }}>
        <span aria-hidden="true" style={{ width: 3, height: 22, borderRadius: 2, background: 'var(--color-sage)', flexShrink: 0 }} />
        <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: '600 14px/1.35 var(--font-sans)', color: 'var(--color-fg-1)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{w12Line(wanted, st)}</span>
          <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>
            {open ? 'Pick one to go back to it' : 'See which cards'}
          </span>
        </span>
        {travelId && wanted.length > 1 && <window.D9Dots total={wanted.length} at={at} />}
        <span aria-hidden="true" style={{ flexShrink: 0, width: 34, height: 34, borderRadius: '50%',
          borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--color-border-1)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-fg-2)',
          transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base) var(--ease-quiet)' }}>
          <window.Icon name="chevron-down" size={16} />
        </span>
      </button>
      {open && (
        <div style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)', padding: '4px 2px' }}>
          <WLIST wanted={wanted} st={st} onGo={(it) => { setOpen(false); goTo(it); }} currentId={travelId} />
        </div>
      )}
    </div>
  );
};

// ---- W2's destination: a surface of its own --------------------------------
// Reached the way circle settings is reached, and left the same way: the app's
// own sub-view chrome carries the back arrow and the title.
const W12Surface = ({ wanted, st, goTo, isApp }) => (
  <main style={{ flex: 1, width: '100%' }}>
    <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', width: '100%',
      padding: isApp ? '14px 14px 40px' : '26px 24px 60px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <p style={{ margin: 0, font: '400 13.5px/1.6 var(--font-sans)', color: 'var(--color-fg-3)', textWrap: 'pretty' }}>
        {wanted.length ? w12Line(wanted, st) + '.' : 'Nothing is talking. Cards you are watching come here while the circle is speaking on them.'}
      </p>
      {wanted.length > 0 && (
        <div style={{ background: 'var(--color-surface)', borderWidth: 1, borderStyle: 'solid',
          borderColor: 'var(--color-border-1)', borderRadius: 'var(--radius-lg)', padding: '4px 2px' }}>
          <WLIST wanted={wanted} st={st} onGo={goTo} />
        </div>
      )}
    </div>
  </main>
);

// ---- W5: the name itself is the control ------------------------------------
// Nothing is added beside the name — the name row becomes pressable, with a
// chevron after the text, so a long circle name simply truncates as it already
// does and the control cannot be pushed off the edge. Two hosts are portalled
// into the shipped header: the chevron after the name, and a transparent button
// over the whole name slot.
const W12NameControl = ({ n, open, onToggle }) => {
  const slot = useW12Slot(() => {
    const h = w12Header();
    if (!h) return null;
    const name = h.firstElementChild;
    if (!name) return null;
    const had = name.style.position;
    name.style.position = 'relative';
    const chev = document.createElement('span');
    chev.style.cssText = 'display:inline-flex;flex-shrink:0;align-items:center;gap:6px;margin-left:8px';
    const hit = document.createElement('span');
    hit.style.cssText = 'position:absolute;inset:-6px -8px;display:flex';
    name.appendChild(chev); name.appendChild(hit);
    return { el: chev, hit, cleanup: () => { chev.remove(); hit.remove(); name.style.position = had; } };
  });
  if (!slot) return null;
  const hosts = { chev: slot.el, hit: slot.hit };
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <React.Fragment>
          {n > 0 && <span aria-hidden="true" style={{ width: 3, height: 14, borderRadius: 2, background: 'var(--color-sage)' }} />}
          <span aria-hidden="true" style={{ display: 'inline-flex', color: 'var(--color-fg-3)',
            transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base) var(--ease-quiet)' }}>
            <window.Icon name="chevron-down" size={16} />
          </span>
        </React.Fragment>, hosts.chev)}
      {ReactDOM.createPortal(
        <button type="button" onClick={onToggle} aria-expanded={open} aria-label="What the circle is talking about"
          style={{ flex: 1, background: 'transparent', borderWidth: 0, borderRadius: 'var(--radius-md)',
            cursor: 'pointer', padding: 0 }} />, hosts.hit)}
    </React.Fragment>
  );
};

// ---- the chapter -----------------------------------------------------------
// Five places, five destinations, no pair repeated. The fold is in all five.
const W12_OPTIONS = [
  {
    id: 'w1', n: 'W1', name: 'A mark beside the circle\u2019s name',
    stance: 'A small pressable mark in the top bar, immediately after the circle\u2019s name: the sage rule, and how many cards are talking. It is there on Active and on Read, and on the way in. It drops a popover with the cards in it \u2014 the shelf behind it never moves, and tapping away is how you leave.',
    cost: 'The top bar has been status-only by design, so this is the first pressable thing in it, and it sits in the same corner as the gear. A long circle name truncates to make room \u2014 the mark never shrinks, which is the trade being made.',
    place: 'name-adjacent', dest: 'popover',
  },
  {
    id: 'w2', n: 'W2', name: 'Beside circle settings, opening a surface',
    stance: 'The way in sits next to circle settings \u2014 the corner that already means \u201cthis circle, not this shelf\u201d \u2014 and it opens a page of its own, reached and left exactly the way settings is. The list has room to breathe, and it can hold more than a popover ever could.',
    cost: 'A whole surface for something transient: you leave the shelf to read a list, then come back out of it. In the app posture circle settings lives in the bottom bar, so this becomes a fourth slot in a bar the app deliberately keeps at three.',
    place: 'gear', dest: 'surface',
  },
  {
    id: 'w3', n: 'W3', name: 'A third segment beside Active and Read',
    stance: 'Talking is a place, not a message: it sits at the end of the tab row and holds the cards themselves, so the destination is the shelf you already know how to use \u2014 real cards, the fold on each of them, nothing to dismiss.',
    cost: 'A third tab that is empty most of the time, and the tab set stops being a stable pair. Read and Talking now overlap: a card can be in both, and it is not obvious which one owns it.',
    place: 'tabs', dest: 'shelf',
  },
  {
    id: 'w4', n: 'W4', name: 'The strip, on whichever tab you are on',
    stance: 'v9\u2019s strip, kept \u2014 with the touch made explicit: a 56px row, a bordered chevron target, a second line that says what pressing it does. It now stands at the head of Active as well as Read, so being on the queue is no longer a way to miss it, and the list still opens in place and walks you card to card.',
    cost: 'It lives inside the feed, so it scrolls away and it is gone until you scroll back. On Active it sits above the queue \u2014 the one place an earlier round said nothing should sit.',
    place: 'feed', dest: 'inplace',
  },
  {
    id: 'w5', n: 'W5', name: 'The circle\u2019s name is the control',
    stance: 'Nothing is added beside the name: the name row becomes pressable, with the rule and a chevron after the text, and pressing it drops the same list. A long name truncates as it already does \u2014 there is no second element to push off the edge.',
    cost: 'Nothing announces it. Until something moves, the chevron is the only hint the name does anything, and a header that is suddenly a menu is a new behaviour to learn.',
    place: 'name', dest: 'popover',
  },
];

Object.assign(window, { W12_OPTIONS, W12Mark, W12Panel, W12InHeader, W12InNav, W12NavSlot, useW12Slot,
  W12Tabs, W12Strip, W12Surface, W12NameControl, w12Line, w12Short });
