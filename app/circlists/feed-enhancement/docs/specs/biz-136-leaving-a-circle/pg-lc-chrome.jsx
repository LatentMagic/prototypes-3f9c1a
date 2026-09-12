// ============================================================================
// BIZ-136 — leaving a circle. The CHROME: three variations, one body.
// ----------------------------------------------------------------------------
// WHAT IS COPIED AND WHY. app/app-shell.jsx exports only AppShellNative;
// TopBarNative, NavItem, AddNavItem, BottomNav and useNativePush are all
// module-local, and the brief fences this playground out of app/ entirely — so
// the export build-playground would normally ask for cannot be added here. The
// top bar and the push choreography below are therefore a COPY, carried
// verbatim from app/app-shell.jsx (by way of the BIZ-136 whiteboard's
// pg-mc-chrome.jsx): same geometry, same sizes, same tokens, same icons, same
// double-rAF beat. They are not to be "improved" — a copy tuned to look better
// stops being evidence. If a variation here is taken forward, the fix is to
// export TopBarNative and useNativePush from app/app-shell.jsx and delete these
// copies.
//
// Everything the chrome frames is the real shared surface, mounted by
// pg-lc-app.jsx. No variation redraws a surface; only the frame differs. The
// FAB is rendered HERE rather than by the rig, because where the one repeated
// action sits — and, in C, what it travels with — is a chrome question and each
// variation has to answer it.
//
// The three variations answer ONE question: inside a circle, with nothing
// persistent at the foot of the screen, how does a member get back out.
//   A  Back at the top     — a control at the top-left. The baseline.
//   B  Close, not back     — the circle is a sheet; the dismiss is in the thumb.
//   C  Pull it aside       — the exit is the edge, not an object.
// ============================================================================
const { useState: lcState, useEffect: lcEffect, useRef: lcRef } = React;

// ---- Copied from app/app-shell.jsx — see the header ------------------------
const LcTopBar = ({ title, wordmark = false, onBack, onTitle = null, avatar = null, right = null }) => (
  <header style={{
    height: 'var(--top-bar-height)', background: 'var(--color-surface)',
    borderBottom: '1px solid var(--color-border-2)', display: 'flex', alignItems: 'center',
    padding: onBack ? '0 8px' : (avatar || right) ? '0 10px 0 16px' : '0 16px', gap: 8,
    position: 'sticky', top: 0, zIndex: 50,
  }}>
    {onBack && (
      <button onClick={onBack} aria-label="Back" className="circ-topaction" style={{
        background: 'transparent', border: 0, padding: 10, margin: '0 -2px', cursor: 'pointer',
        color: 'var(--color-fg-1)', display: 'inline-flex',
      }}><Icon name="arrow-left" size={20} /></button>
    )}
    {wordmark
      ? <span style={{ flex: 1, minWidth: 0, display: 'flex' }}><Wordmark size={19} /></span>
      : onTitle
        // Variation C only: the title itself is the way up. Left as a plain
        // title everywhere else, because a control nobody in that variation is
        // meant to press would be a second exit competing with the one under
        // test. The name stays the visible label — an aria-label naming the
        // destination instead would make the control speak something other
        // than what it reads — so what it DOES rides as hidden text after it.
        ? <button onClick={onTitle} className="lc-titlebtn" style={{
            flex: 1, minWidth: 0, textAlign: 'left', background: 'transparent', border: 0, padding: '8px 0',
            margin: 0, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 17,
            letterSpacing: '-0.01em', color: 'var(--color-fg-1)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{title}<span className="circ-vh">, back to home</span></button>
        : <span style={{
            flex: 1, minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 17,
            letterSpacing: '-0.01em', color: 'var(--color-fg-1)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{title}</span>}
    {avatar}
    {right}
  </header>
);

const LcAvatar = ({ user, onClick }) => (
  <button onClick={onClick} aria-label="Account" className="circ-topaction" style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent',
    border: 0, cursor: 'pointer', width: 40, height: 40, borderRadius: 'var(--radius-md)', flexShrink: 0,
  }}><Avatar name={displayName(user)} size={29} /></button>
);

const LcGear = ({ onClick }) => (
  <button onClick={onClick} aria-label="Circle settings" className="circ-topaction" style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent',
    border: 0, cursor: 'pointer', width: 40, height: 40, borderRadius: 'var(--radius-md)', flexShrink: 0,
    color: 'var(--color-fg-2)',
  }}><Icon name="settings" size={21} strokeWidth={1.6} /></button>
);

// The screen every variation fills: a column at the screen's height, so a
// sticky top bar resolves against the layer's own scroller.
const LcColumn = ({ children }) => (
  <div style={{ minHeight: 'var(--circ-vh)', display: 'flex', flexDirection: 'column', background: 'var(--color-canvas)' }}>
    {children}
  </div>
);

// A layer: exactly the screen's bounds, its own scroller inside it, so two
// layers keep two scroll positions. Transform stays OFF at rest (GOTCHA #5) —
// an idle transform is a containing block, and the FAB and every sheet in here
// are position: fixed.
//
// `inert` when a layer is covered. Home stays mounted under the sheet in B and
// under the pull layer in C, and without this the tab order walks the whole of
// home (and, in C, the whole feed) before it reaches the way out — 49 stops in
// the first build.
const LcLayer = ({ style, className = '', children, scrollRef, covered = false }) => (
  <div className={'lc-layer ' + className} style={style}
    aria-hidden={covered || undefined} {...(covered ? { inert: '' } : {})}>
    <div className="lc-scroll" ref={scrollRef}>{children}</div>
  </div>
);

// Feed scroll survives a variation switch: the scroller is a different element
// in each variation, so the position is remembered on app state, not here.
const lcUseKeptScroll = (app, key) => {
  const ref = lcRef(null);
  lcEffect(() => {
    const el = ref.current;
    if (!el) return;
    const saved = app.scrollMemo.current[key];
    if (saved) el.scrollTop = saved;
    const onScroll = () => { app.scrollMemo.current[key] = el.scrollTop; };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [key]);
  return ref;
};

// A drag that moved has to eat the click that follows it, or the card under the
// finger opens as the gesture ends. Same problem app/config.jsx's launcher
// solves with its own `moved` flag; the pill is one element, this is a whole
// surface, so the swallow is a one-shot capture listener instead.
const lcSwallowClick = () => {
  const eat = (e) => { e.stopPropagation(); e.preventDefault(); };
  window.addEventListener('click', eat, { capture: true, once: true });
  setTimeout(() => window.removeEventListener('click', eat, { capture: true }), 400);
};

// ---- The push, copied from app/app-shell.jsx's useNativePush ----------------
// Depth, not route, decides direction; both layers exist only for the length of
// the transition, so the settled tree carries no transform. A keyframe
// animation, not a transition, because the incoming layer mounts in the same
// commit as the route change and has no painted from-state. Each transition
// gets a fresh id used as the React key, so an interrupted push restarts rather
// than inheriting a running animation.
const LC_PUSH_MS = 200;
let lcPushSeq = 0;

const lcUseNativePush = (view, depth) => {
  const [anim, setAnim] = lcState(null);
  const prev = lcRef({ view, depth });
  lcEffect(() => {
    const p = prev.current;
    if (p.depth === depth) return;
    const dir = depth > p.depth ? 'in' : 'out';
    setAnim({ id: ++lcPushSeq, dir, base: dir === 'in' ? p.view : view, top: dir === 'in' ? view : p.view });
    const t = setTimeout(() => setAnim(null), LC_PUSH_MS + 60);
    return () => clearTimeout(t);
  }, [depth]);
  lcEffect(() => { prev.current = { view, depth }; });
  return anim;
};

const LcPush = ({ view, depth }) => {
  const anim = lcUseNativePush(view, depth);
  if (!anim) return view;
  return (
    <div style={{ position: 'relative', height: 'var(--circ-vh)', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>{anim.base}</div>
      <div key={anim.id} className={anim.dir === 'in' ? 'circ-push-in' : 'circ-push-out'} style={{
        position: 'absolute', inset: 0, overflow: 'hidden', background: 'var(--color-canvas)',
        boxShadow: '-8px 0 24px rgba(10,10,10,0.10)',
      }}>{anim.top}</div>
    </div>
  );
};

const LC_SUB_TITLE = { settings: 'Settings', account: 'Account' };
const lcIsSub = (r) => r === 'settings' || r === 'account';

// The one action the member repeats, exactly where the web app already floats
// it. Circle-scoped and absent on home, which is what the FAB carrying ONE
// meaning — add a link — forces. Down while the lens sheet is up, for the
// reason main.jsx gives: it cannot out-paint a panel rendered inside a sticky
// bar, and a compose action over a scrimmed modal is wrong anyway.
const LcFab = ({ app, isMobile }) => (
  (app.route === 'circle' && !app.lensOpen && !app.addOpen)
    ? <FAB onClick={() => app.setAddOpen(true)} expanded={app.addOpen} isMobile={isMobile} />
    : null
);

// ============================================================================
// A — Back at the top.  (Direction 3 from the BIZ-136 whiteboard, carried over
// unchanged, and the baseline the other two have to beat.)
//
// Nothing persistent at the foot of either screen. Navigation and circle
// settings sit at the top — the wordmark and the avatar on home, a back arrow
// and the gear in a circle — and the one action the member repeats floats where
// the web app already floats it. The bottom of the screen is content.
// ============================================================================
const LcVarA = ({ app, isMobile }) => {
  const r = app.route;
  const sub = lcIsSub(r);
  const scrollRef = lcUseKeptScroll(app, r === 'home' ? 'home' : r === 'circle' ? 'circle:' + app.currentId : 'sub:' + r);
  const view = (
    <LcLayer key="a" scrollRef={scrollRef}>
      <LcColumn>
        {sub
          ? <LcTopBar title={LC_SUB_TITLE[r]} onBack={app.backFromSub} />
          : r === 'home'
            ? <LcTopBar wordmark avatar={<LcAvatar user={app.user} onClick={app.openAccount} />} />
            : <LcTopBar title={app.space ? app.space.name : ''} onBack={app.leaveSpace}
                right={<LcGear onClick={app.openSettings} />} />}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <LcBody app={app} route={r} />
        </div>
      </LcColumn>
    </LcLayer>
  );
  return (
    <React.Fragment>
      <LcPush view={view} depth={app.depth} />
      <LcFab app={app} isMobile={isMobile} />
    </React.Fragment>
  );
};

// ============================================================================
// B — Close, not back.
//
// Back is the wrong verb. A circle is not a page you came from, it is a layer
// you put over home — so it arrives from the foot of the screen, leaves a
// shoulder of home showing above it, and is DISMISSED rather than returned
// from. That buys the thing the top-left arrow cannot: the way out sits in the
// thumb, as a quiet disc mirroring the accent FAB in the opposite corner, and
// the sheet answers a drag downward from ANYWHERE in the feed as long as the
// feed is already at its top — which is the native sheet rule, not a handle.
//
// The top-left is deliberately empty. Circle settings keeps the gear, and a
// sub-view opened from it still pushes in from the right with a back arrow —
// a settings page IS a page you return from, and the stance is only about the
// circle itself.
// ============================================================================
const LC_SHOULDER = 26;     // how much of home stays visible above the sheet
const LC_CLOSE_AT = 92;     // drag past this and the sheet closes
const LC_DRAG_ARM = 10;     // movement before a drag is a drag and not a tap

const LcVarB = ({ app, isMobile }) => {
  const open = app.route !== 'home';
  // The sheet keeps rendering the circle while it slides out, so a closing
  // sheet is never a closing empty box. app.leaveSpace holds currentId for the
  // length of the exit for the same reason.
  const heldRoute = lcRef(app.route === 'home' ? 'circle' : app.route);
  if (open) heldRoute.current = app.route;

  const [render, setRender] = lcState(open);
  const [shown, setShown] = lcState(open);     // mounts already-open, so switching variation mid-circle does not replay an entrance
  const [drag, setDrag] = lcState(0);
  const [dragging, setDragging] = lcState(false);
  const r = heldRoute.current;
  const sub = lcIsSub(r);
  const scrollRef = lcUseKeptScroll(app, sub ? 'sub:' + r : 'circle:' + app.currentId);
  const homeRef = lcUseKeptScroll(app, 'home');
  const st = lcRef({ active: false, armed: false, y0: 0, x0: 0, last: 0 });

  lcEffect(() => {
    if (open) {
      setRender(true);
      let r2; const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setShown(true)); });
      return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
    }
    setShown(false); setDrag(0);
    const t = setTimeout(() => setRender(false), 260);
    return () => clearTimeout(t);
  }, [open]);

  // Sheet dismissal, the native way: a downward drag that begins with the feed
  // already at its top, started anywhere on the sheet. It arms only once the
  // movement is past a threshold AND is more vertical than horizontal, so a tap
  // on a card is still a tap and a sideways swipe is still left alone.
  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const sc = scrollRef.current;
    if (sub || !sc || sc.scrollTop > 0) return;
    const s = st.current;
    s.active = true; s.armed = false; s.y0 = e.clientY; s.x0 = e.clientX; s.last = 0;
    const move = (ev) => {
      if (!s.active) return;
      const dy = ev.clientY - s.y0, dx = ev.clientX - s.x0;
      if (!s.armed) {
        if (Math.abs(dy) < LC_DRAG_ARM && Math.abs(dx) < LC_DRAG_ARM) return;
        if (dy <= 0 || Math.abs(dx) > Math.abs(dy)) { s.active = false; done(); return; }
        s.armed = true; setDragging(true);
      }
      s.last = Math.max(0, dy - LC_DRAG_ARM);
      setDrag(s.last);
    };
    const done = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
    const up = () => {
      s.active = false; done();
      if (!s.armed) return;
      setDragging(false); lcSwallowClick();
      if (s.last > LC_CLOSE_AT) { setDrag(0); app.leaveSpace(); } else setDrag(0);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  const sheetContent = (
    <LcLayer key={sub ? 'sub' : 'circle'} scrollRef={scrollRef}>
      <LcColumn>
        {sub
          ? <LcTopBar title={LC_SUB_TITLE[r]} onBack={app.backFromSub} />
          : <LcTopBar title={app.space ? app.space.name : ''} right={<LcGear onClick={app.openSettings} />} />}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <LcBody app={app} route={r} />
        </div>
      </LcColumn>
    </LcLayer>
  );

  const covered = render && shown;
  return (
    <React.Fragment>
      {/* Home, always beneath. Held back and dimmed while the sheet is over it,
          so the strip showing above reads as the page behind rather than as a
          top bar sliced in half. */}
      <LcLayer covered={covered} className={covered ? 'is-behind' : ''} scrollRef={homeRef} style={{
        // Scale only. A translateY pulled the layer's rounded head off the top
        // of the screen, which is the one part of it the member actually sees.
        transform: covered ? 'scale(0.972)' : 'none',
        transformOrigin: '50% 0',
        transition: 'transform var(--duration-slow) var(--ease-quiet)',
      }}>
        <LcColumn>
          <LcTopBar wordmark avatar={<LcAvatar user={app.user} onClick={app.openAccount} />} />
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <LcHomeBody app={app} />
          </div>
        </LcColumn>
      </LcLayer>
      {/* Sits on the layer's own scaled, rounded footprint — a square scrim
          painted the corners back on and the radius never read. */}
      <div className="lc-behind-scrim" aria-hidden="true" style={{
        opacity: covered ? 1 : 0,
        transform: covered ? 'scale(0.972)' : 'none', transformOrigin: '50% 0',
      }} />

      {render && (
        <React.Fragment>
          {/* The disc comes BEFORE the sheet in the DOM so the tab order reaches
              the way out before the whole feed, not after it. It is fixed, so
              nothing about where it sits depends on this. */}
          {!sub && (
            <button onClick={app.leaveSpace} className="lc-closedisc" aria-label="Close circle, back to home">
              <Icon name="chevron-down" size={22} strokeWidth={1.9} />
            </button>
          )}
          {/* The shoulder is a real target — tapping the page behind a sheet is
              how a sheet closes — but it is the third route, not the first: on
              a real handset this strip sits under the status bar. */}
          <button onClick={app.leaveSpace} aria-label="Close circle, back to home" className="lc-shoulder"
            style={{ height: LC_SHOULDER, opacity: shown ? 1 : 0 }} />
          <div className={'lc-sheet' + (dragging ? ' is-dragging' : '')} onPointerDown={onPointerDown} style={{
            top: LC_SHOULDER,
            transform: shown ? `translateY(${drag}px)` : 'translateY(100%)',
            transition: dragging ? 'none' : 'transform var(--duration-slow) var(--ease-quiet)',
          }}>
            <LcPush view={sheetContent} depth={sub ? 2 : 1} />
          </div>
        </React.Fragment>
      )}
      <LcFab app={app} isMobile={isMobile} />
    </React.Fragment>
  );
};

// ============================================================================
// C — Pull it aside.
//
// The exit is not an object at all. A circle sits on top of home and comes off
// the way a card comes off a deck: you pull it aside from the left edge and
// home is already there underneath, moving with you. The gesture is the whole
// answer, so there is no arrow and nothing floating — the foot of the screen
// stays content and the top-left stays empty.
//
// Two things stop that being a secret. A HANDLE sits proud of the left edge at
// thumb height — a raised lozenge, not a hairline, because a hairline on that
// edge is a scrollbar — which is what you drag, and a tap target in its own
// right. And the circle's NAME in the top bar is a control: the up-affordance
// every platform already has, for the member who reaches for the title.
//
// The pull is a real interactive pop, not a trigger: it tracks the finger, it
// reveals home as it goes, and letting go short of a third of the width springs
// back with nothing committed. A gesture you cannot abandon is not the gesture
// this is imitating.
//
// A sub-view opened from the gear still pushes in from the right with a back
// arrow, for the same reason as B: a settings page IS a page you return from.
// ============================================================================
const LC_POP_AT = 0.32;     // release past this fraction of the width and it commits
const LC_EDGE = 28;         // how far in from the left edge a drag may start

// Once per page load, not once per mount. The guard used to live on the mount
// check; moving the trigger to a real entry took the guard with it, and the
// coach came back on every entry forever — which is a permanent label, not a
// coach, and C's own stance is that the gesture is learned once.
let lcCoachSpent = false;

const LcVarC = ({ app, isMobile }) => {
  const inCircle = app.route !== 'home';
  const [p, setP] = lcState(0);              // 0 = circle covers home, 1 = pulled clear
  const [dragging, setDragging] = lcState(false);
  const [coach, setCoach] = lcState(false);
  const wasIn = lcRef(inCircle);
  const st = lcRef({ active: false, armed: false, x0: 0, y0: 0, w: 1, last: 0 });
  const r = app.route === 'home' ? 'circle' : app.route;
  const sub = lcIsSub(r);
  const scrollRef = lcUseKeptScroll(app, sub ? 'sub:' + r : 'circle:' + app.currentId);
  const homeRef = lcUseKeptScroll(app, 'home');

  // The coach fires on an actual ENTRY into a circle, once. Firing it on mount
  // meant switching A→C while already inside a circle burned it before the
  // member ever entered one under C.
  lcEffect(() => {
    const entered = inCircle && !wasIn.current;
    wasIn.current = inCircle;
    if (!inCircle) { setP(0); setCoach(false); return; }
    if (!entered || lcCoachSpent) return;
    lcCoachSpent = true;
    setCoach(true);
    const t = setTimeout(() => setCoach(false), 6000);
    return () => clearTimeout(t);
  }, [inCircle]);

  const commit = () => { setP(1); setTimeout(() => app.leaveSpace(), 190); };

  // The gesture lives on the layer itself, with an edge guard — not on an
  // invisible strip laid over the left of the screen. That strip won the hit
  // test at every height and ate the left 12px of the tab row and of every card.
  const beginPull = (e, fromHandle) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    // NOT inside a sub-view. The pull takes the whole layer off, so on Settings
    // it discarded the circle level with it and landed on home — and it armed
    // from x≈10, which is exactly where that screen's back arrow sits. The
    // stance is about leaving a CIRCLE; a settings page is a page you return
    // from, and its back arrow is the only way out of it.
    if (sub) return;
    const host = e.currentTarget.closest('.lc-poplayer') || e.currentTarget.closest('.lc-clip');
    const box = host.getBoundingClientRect();
    if (!fromHandle && e.clientX - box.left > LC_EDGE) return;
    const s = st.current;
    s.active = true; s.armed = false; s.x0 = e.clientX; s.y0 = e.clientY; s.w = box.width || 1; s.last = 0;
    setCoach(false);
    const move = (ev) => {
      if (!s.active) return;
      const dx = ev.clientX - s.x0, dy = ev.clientY - s.y0;
      if (!s.armed) {
        if (Math.abs(dx) < LC_DRAG_ARM && Math.abs(dy) < LC_DRAG_ARM) return;
        if (dx <= 0 || Math.abs(dy) > Math.abs(dx)) { s.active = false; done(); return; }
        s.armed = true; setDragging(true);
      }
      s.last = Math.min(1, Math.max(0, (dx - LC_DRAG_ARM) / s.w));
      setP(s.last);
    };
    const done = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
    const up = () => {
      s.active = false; done();
      if (!s.armed) return;
      setDragging(false); lcSwallowClick();
      // A pull you let go of short of the line springs back and commits
      // nothing — including when it started on the handle, where the click
      // that follows would otherwise leave anyway.
      if (s.last > LC_POP_AT) commit(); else setP(0);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  const ease = dragging ? 'none' : 'transform var(--duration-slow) var(--ease-quiet)';
  const circleView = (
    <LcLayer key={sub ? 'sub' : 'circle'} scrollRef={scrollRef}>
      <LcColumn>
        {sub
          ? <LcTopBar title={LC_SUB_TITLE[r]} onBack={app.backFromSub} />
          : <LcTopBar title={app.space ? app.space.name : ''} onTitle={commit}
              right={<LcGear onClick={app.openSettings} />} />}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <LcBody app={app} route={r} />
        </div>
      </LcColumn>
    </LcLayer>
  );

  return (
    <React.Fragment>
      {/* Home, beneath, moving with the drag — iOS's own pop parallax: it
          starts a quarter-screen back and arrives as the circle clears. */}
      <LcLayer covered={inCircle} scrollRef={homeRef} style={{
        transform: inCircle ? `translateX(${(p - 1) * 25}%)` : 'none',
        transition: ease,
      }}>
        <LcColumn>
          <LcTopBar wordmark avatar={<LcAvatar user={app.user} onClick={app.openAccount} />} />
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <LcHomeBody app={app} />
          </div>
        </LcColumn>
      </LcLayer>

      {inCircle ? (
        <div className={'lc-poplayer' + (dragging ? ' is-dragging' : '')}
          onPointerDown={(e) => beginPull(e, false)}
          style={{ transform: `translateX(${p * 100}%)`, transition: ease }}>
          {/* The handle is INSIDE the layer, so it travels with the pull at the
              layer's own rate. Before the tree it frames, so the tab order
              reaches the way out first. */}
          {!sub && (
            <React.Fragment>
              <button className="lc-handle" onPointerDown={(e) => { e.stopPropagation(); beginPull(e, true); }}
                onClick={commit} aria-label="Back to home" data-drag={dragging ? '1' : undefined}>
                <span className="lc-handle-bar" aria-hidden="true" />
              </button>
              {coach && <div className="lc-coach" role="note">Pull the edge across to leave</div>}
            </React.Fragment>
          )}
          <LcPush view={circleView} depth={sub ? 2 : 1} />
          {/* Inside the transformed layer, so the circle's own action travels
              with the circle instead of hanging over home mid-gesture. */}
          <LcFab app={app} isMobile={isMobile} />
        </div>
      ) : <LcFab app={app} isMobile={isMobile} />}
    </React.Fragment>
  );
};

const LC_VARIATIONS = [
  {
    id: 'A', name: 'Back at the top',
    carried: true,
    stance: 'Direction 3 from the whiteboard, unchanged. Nothing persistent at the foot of either screen: navigation and circle settings go to the top bar — a back arrow and the gear inside a circle, the wordmark and the avatar on home — and the one action the member repeats floats exactly where the web app already floats it. The bottom of the screen is content.',
    cost: 'Reach. Leaving is the second most pressed control in the app and it sits in the top-left, the one place a thumb cannot get to on a modern phone. Nothing on screen says there is a level above this one until the member looks up there and finds the arrow.',
    Var: LcVarA,
  },
  {
    id: 'B', name: 'Close, not back',
    stance: 'Back is the wrong verb. A circle is a layer laid over home, not a page you came from — so it arrives from the foot of the screen, leaves a shoulder of home showing above it, and is dismissed rather than returned from. The way out is therefore in the thumb: a quiet disc in the corner opposite the FAB, or a drag downward from anywhere in the feed once it is at its top, which is the native sheet rule. The top-left is empty on purpose.',
    cost: 'Two floating objects now hover over the feed instead of one, and the close disc is a glyph with no word on it. The drag only answers at the top of the feed, so most of the time the disc is carrying the whole job alone — and the shoulder is not a third route on a real handset at all: it sits at the very top of the screen, under the status bar and the Dynamic Island, where taps never reach the page. And the sheet idiom promises transience — a thing you glance at and put down — where a circle is in fact where members spend all their time, so the frame quietly argues against the content it holds.',
    Var: LcVarB,
  },
  {
    id: 'C', name: 'Pull it aside',
    stance: 'The exit is the edge, not an object. A circle sits on top of home and comes off the way a card comes off a deck: pull it aside from the left and home is already underneath, moving with you the whole way — and letting go short of a third of the width springs back with nothing committed. Nothing floats, nothing is added to the top bar, and the foot of the screen stays content. A handle proud of the edge at thumb height is what you pull, and a tap target in its own right; the circle’s name in the top bar is the up-affordance for anyone who reaches for the title instead.',
    cost: 'A handle carries no word, so what it does has to be learned once — and the coach that teaches it is a thing the product would then have to keep. In a browser tab the same gesture is the browser’s own back-swipe, so the two compete on exactly the surface the design leans on; that collision cannot be shown inside this page, so treat it as an open risk rather than a cleared one. And a member who reaches for the conventional arrow at the top-left finds nothing there at all.',
    Var: LcVarC,
  },
];

Object.assign(window, {
  LcTopBar, LcAvatar, LcGear, LcColumn, LcLayer, LcPush, LcFab,
  LcVarA, LcVarB, LcVarC, LC_VARIATIONS,
});
