// ============================================================================
// Circlists — App posture (native mobile) shell. The THIRD presentation
// posture, alongside desktop web and mobile web. See MOBILE.md for the spec
// and ARCHITECTURE.md for how the posture swap works.
// ----------------------------------------------------------------------------
// Not a fork: main.jsx routes every in-shell surface through inShell(), which
// picks THIS shell (AppShellNative) over AppShell only when platform === 'app'.
// Everything INSIDE the shell — feed, cards, members, account, dormant — is the
// SAME shared component the web posture renders. Only the persistent chrome
// diverges.
//
// TWO CHROME STATES, ONE SHELL (IA direction 08):
//   • Home (account level) — "Circlists" + avatar in the top bar, the circles
//     list as the body, and NO bottom bar. Account hangs off the avatar, not off
//     a bar slot: you are already at account level.
//   • Inside a circle (circle level) — the circle name alone in the top bar, and
//     a three-slot bottom bar: Home · Add · Settings.
// The bar is never rendered outside a circle, so the bar IS the circle scope —
// a plain "Settings" cannot be misread as the app's settings. That is the whole
// point of 08; do not reintroduce a bar on home, and do not add global slots.
//   • Home is the way BACK, not an action: it moves you, so it does not
//     reintroduce the scope mix it was introduced to remove.
//   • Add is the centre-docked accent circle (54px, marginTop -30, surface
//     ring). It is not a floating FAB — that was ruled out and stays ruled out.
//   • Settings is the plain gear opening the circle's settings as a full page.
// Containers: a bottom sheet is for Add ONLY (short, transient, you return to
// what is behind it). Circle entry, circle settings and Account are full pages
// that slide in from the right — destinations with their own content.
//
// This file is a droppable module (like app/gate.jsx): main.jsx guards on
// window.AppShellNative and falls back to the web AppShell when it's absent, so
// deleting this file cleanly removes the app posture with no edit to main.jsx.
// ============================================================================

const { useState: usAppState, useEffect: usAppEffect, useRef: usAppRef } = React;

// ---- Push presentation ------------------------------------------------------
// The app has ONE mount choreography (also used by AddReveal in feed.jsx):
// render hidden → double-rAF → `shown` → animate → settle. Here it drives the
// full-page slide: entering a circle, opening circle settings, opening Account.
//
// Depth, not route, decides direction. Deeper (home → circle → sub-view) slides
// the NEW view in from the right over the old one; shallower slides the OLD view
// off to the right, revealing the new one already beneath. Both layers are held
// only for the length of the transition, so the settled tree is exactly the
// plain view — no transform sits on an idle layer (fixed overlays inside would
// otherwise pin to it). See GOTCHA.md #5.
//
// The layers are driven by a CSS ANIMATION, not a transition. A transition
// needs its from-state to be painted before the to-state is set; the incoming
// layer mounts in the same commit as the route change, so that ordering could
// not be relied on (the forward push simply snapped, while the outgoing one
// animated because translateX(0) was already painted). A keyframe animation
// runs on mount by definition. Each transition gets a fresh `id` used as the
// layer's React key, so an interrupted push remounts the node and restarts the
// animation rather than inheriting a running one.
const PUSH_MS = 200;   // = var(--duration-slow)
let pushSeq = 0;

const useNativePush = (view, depth) => {
  const [anim, setAnim] = usAppState(null);
  const prev = usAppRef({ view, depth });
  usAppEffect(() => {
    const p = prev.current;
    if (p.depth === depth) return;
    const dir = depth > p.depth ? 'in' : 'out';
    setAnim({ id: ++pushSeq, dir, base: dir === 'in' ? p.view : view, top: dir === 'in' ? view : p.view });
    const t = setTimeout(() => setAnim(null), PUSH_MS + 60);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depth]);
  // Tracker runs after the effect above, so that one always reads the PREVIOUS
  // commit's view and depth.
  usAppEffect(() => { prev.current = { view, depth }; });
  return anim;
};

// ---- Top bar — status only ---------------------------------------------------
// Home: the wordmark + the account avatar. Root (in a circle): the circle name,
// nothing else — circle settings lives in the bottom bar. Sub-view: back + title.
const TopBarNative = ({ space, isHome = false, user, onAccount, subView = null }) => {
  const isSub = !!subView;
  return (
    <header style={{
      height: 'var(--top-bar-height)', background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border-2)', display: 'flex', alignItems: 'center',
      padding: isSub ? '0 8px' : isHome ? '0 10px 0 16px' : '0 16px', gap: 8,
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      {isSub ? (
        <React.Fragment>
          <button onClick={subView.onBack} aria-label="Back" style={{
            background: 'transparent', border: 0, padding: 10, margin: '0 -2px', cursor: 'pointer',
            color: 'var(--color-fg-1)', display: 'inline-flex',
          }}><Icon name="arrow-left" size={20} /></button>
          <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subView.title}</span>
        </React.Fragment>
      ) : isHome ? (
        <React.Fragment>
          <span style={{ flex: 1, minWidth: 0, display: 'flex' }}><Wordmark size={19} /></span>
          <button onClick={onAccount} aria-label="Account" className="circ-topaction" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent',
            border: 0, cursor: 'pointer', width: 40, height: 40, borderRadius: 'var(--radius-md)', flexShrink: 0,
          }}><Avatar name={displayName(user)} size={29} /></button>
        </React.Fragment>
      ) : space ? (
        <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{space.name}</span>
      ) : (
        <span style={{ flex: 1, display: 'flex', justifyContent: 'center' }}><Wordmark size={19} /></span>
      )}
    </header>
  );
};

// ---- Bottom navigation — the circle's chrome, in the thumb zone -------------
const NavItem = ({ icon, label, disabled, onClick }) => (
  <button onClick={disabled ? undefined : onClick} disabled={disabled} aria-label={label}
    className="circ-appnav-item" style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
      background: 'transparent', border: 0, cursor: disabled ? 'default' : 'pointer', minHeight: 54, padding: '7px 4px',
      opacity: disabled ? 0.4 : 1,
    }}>
    <Icon name={icon} size={22} color="var(--color-fg-2)" strokeWidth={1.5} />
    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 10.5, letterSpacing: '0.01em', color: 'var(--color-fg-3)' }}>{label}</span>
  </button>
);

// Center-docked Add — a large raised circle that overlaps the bar's top edge
// (surface-colour ring separates it from whatever scrolls beneath).
const AddNavItem = ({ disabled, onClick }) => (
  <button onClick={disabled ? undefined : onClick} disabled={disabled} aria-label="Add a link"
    className="circ-appnav-add" style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
      background: 'transparent', border: 0, cursor: disabled ? 'default' : 'pointer', minHeight: 54, padding: '7px 4px',
      opacity: disabled ? 0.4 : 1,
    }}>
    <span className="circ-appnav-adddot" aria-hidden="true" style={{
      width: 54, height: 54, borderRadius: '50%', marginTop: -30, flexShrink: 0,
      background: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 0 0 4px var(--color-surface), 0 4px 12px rgba(4,120,87,0.30)',
      transition: 'background var(--duration-base)',
    }}>
      <Icon name="plus" size={26} strokeWidth={2} color="#fff" />
    </span>
    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 10.5, letterSpacing: '0.01em', color: 'var(--color-fg-3)' }}>Add</span>
  </button>
);

// Three slots, and only ever inside a circle.
const BottomNav = ({ canAdd, canSettings, onHome, onAdd, onSettings }) => (
  <nav aria-label="Circle" style={{
    position: 'sticky', bottom: 0, zIndex: 40, display: 'flex', alignItems: 'stretch',
    background: 'var(--color-surface)', borderTop: '1px solid var(--color-border-2)',
    paddingBottom: 'env(safe-area-inset-bottom, 0px)', boxShadow: '0 -1px 0 rgba(10,10,10,0.02)',
  }}>
    <NavItem icon="home" label="Home" onClick={onHome} />
    <AddNavItem disabled={!canAdd} onClick={onAdd} />
    <NavItem icon="settings" label="Settings" disabled={!canSettings} onClick={onSettings} />
  </nav>
);

// ---- AppShellNative — same prop surface as AppShell, plus app-only extras ----
const AppShellNative = ({ isMobile, user, spaces, currentId, space, showMembers = true, isHome = false,
                          onSelectSpace, onCreateSpace, onMembers, onManageAccount, onSignOut,
                          onAccountGate, onHome, onAdd, canAdd = false, subView = null, children }) => {
  const isSub = !!subView;

  // Account access mirrors the rail: when the preview gate is armed, the control
  // opens the gate instead of the real destination.
  const openAccount = () => { if (onAccountGate) { onAccountGate(); return; } onManageAccount && onManageAccount(); };

  const view = (
    <div style={{ minHeight: 'var(--circ-vh)', display: 'flex', flexDirection: 'column', background: 'var(--color-canvas)' }}>
      <TopBarNative space={space} isHome={isHome && !isSub} user={user} onAccount={openAccount} subView={subView} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>{children}</div>
      {!isSub && !isHome && (
        <BottomNav canAdd={canAdd} canSettings={showMembers && !!space}
          onHome={onHome} onAdd={onAdd} onSettings={onMembers} />
      )}
    </div>
  );

  // home (0) → circle (1) → sub-view (2)
  const anim = useNativePush(view, isSub ? 2 : isHome ? 0 : 1);
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

Object.assign(window, { AppShellNative });
