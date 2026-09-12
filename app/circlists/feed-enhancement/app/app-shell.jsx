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
// ONE BAR, TWO LEVELS (IA direction 2):
//   • Home (account level) — the wordmark in the top bar, the circles list as
//     the body.
//   • Inside a circle (circle level) — the circle's name and its gear in the
//     top bar, and the feed as the body.
// The bottom bar is the SAME at both, and holds account-scoped destinations
// only: Home · Account. It never changes shape as the member moves, and nothing
// in it ever speaks for a circle, so no slot has to prove whose it is. Home is
// the way back; Account is the account, reached from the bar rather than from an
// avatar, so the level a member is standing at is always named in one place.
//   • Circle scope lives entirely ABOVE the bar. The circle's gear sits in the
//     top bar beside the circle's name.
//   • Add is a floating FAB (app/feed.jsx's own, raised clear of the bar by
//     APP_FAB_BOTTOM). It is circle-scoped and means "add a link", so it is
//     absent on home and never changes its noun by context.
// Containers: a bottom sheet is for Add ONLY (short, transient, you return to
// what is behind it). Circle entry, circle settings and Account are full pages
// that slide in from the right — destinations with their own content.
//
// This file is a droppable module (like app/gate.jsx): main.jsx guards on
// window.AppShellNative and falls back to the web AppShell when it's absent, so
// deleting this file cleanly removes the app posture with no edit to main.jsx.
// ============================================================================

const { useState: usAppState, useEffect: usAppEffect, useRef: usAppRef } = React;

// ---- Chrome geometry --------------------------------------------------------
// The bar's own height, and the clearance a floating action needs to sit above
// it. Published because the FAB is rendered by main.jsx from the shared
// app/feed.jsx component: the chrome owns the number, the caller passes it on.
const APP_NAV_HEIGHT = 54;
const APP_FAB_BOTTOM = 'calc(' + (APP_NAV_HEIGHT + 20) + 'px + env(safe-area-inset-bottom, 0px))';

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

// ---- Top bar — status, and the circle's own scope ---------------------------
// Home: the wordmark alone. Root (in a circle): the circle name and its gear —
// the one control that acts on the circle sits beside the thing it acts on.
// Sub-view: back + title.
const TopBarNative = ({ space, isHome = false, onSettings, canSettings = false, subView = null }) => {
  const isSub = !!subView;
  const gear = !isSub && !isHome && canSettings;
  return (
    <header style={{
      height: 'var(--top-bar-height)', background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border-2)', display: 'flex', alignItems: 'center',
      padding: isSub ? '0 8px' : gear ? '0 10px 0 16px' : '0 16px', gap: 8,
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
        <span style={{ flex: 1, minWidth: 0, display: 'flex' }}><Wordmark size={19} /></span>
      ) : space ? (
        <React.Fragment>
          <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{space.name}</span>
          {gear && (
            <button onClick={onSettings} aria-label="Circle settings" className="circ-topaction" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'transparent',
              border: 0, cursor: 'pointer', width: 40, height: 40, borderRadius: 'var(--radius-md)', flexShrink: 0,
              color: 'var(--color-fg-2)',
            }}><Icon name="settings" size={21} strokeWidth={1.6} /></button>
          )}
        </React.Fragment>
      ) : (
        <span style={{ flex: 1, display: 'flex', justifyContent: 'center' }}><Wordmark size={19} /></span>
      )}
    </header>
  );
};

// ---- Bottom navigation — the account's destinations, in the thumb zone -------
// A slot takes either an icon or a `glyph` (Account carries the member's own
// avatar, which no icon in the set can stand for).
const NavItem = ({ icon, label, glyph, active = false, onClick }) => (
  <button onClick={onClick} aria-label={label} aria-current={active || undefined}
    className="circ-appnav-item" style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
      background: 'transparent', border: 0, cursor: 'pointer', minHeight: APP_NAV_HEIGHT, padding: '7px 4px',
    }}>
    {glyph || <Icon name={icon} size={22} color={active ? 'var(--color-accent)' : 'var(--color-fg-2)'} strokeWidth={1.5} />}
    <span style={{
      fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 10.5, letterSpacing: '0.01em',
      color: active ? 'var(--color-accent)' : 'var(--color-fg-3)',
      maxWidth: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    }}>{label}</span>
  </button>
);

// Two slots, the same two everywhere the bar is rendered.
const BottomNav = ({ user, isHome, onHome, onAccount }) => (
  <nav aria-label="Circlists" style={{
    position: 'sticky', bottom: 0, zIndex: 40, display: 'flex', alignItems: 'stretch',
    background: 'var(--color-surface)', borderTop: '1px solid var(--color-border-2)',
    paddingBottom: 'env(safe-area-inset-bottom, 0px)', boxShadow: '0 -1px 0 rgba(10,10,10,0.02)',
  }}>
    <NavItem icon="home" label="Home" active={isHome} onClick={onHome} />
    <NavItem label="Account" glyph={<Avatar name={displayName(user)} size={22} />} onClick={onAccount} />
  </nav>
);

// ---- AppShellNative — same prop surface as AppShell, plus app-only extras ----
const AppShellNative = ({ isMobile, user, spaces, currentId, space, showMembers = true, isHome = false,
                          onSelectSpace, onCreateSpace, onMembers, onManageAccount, onSignOut,
                          onAccountGate, onHome, subView = null, children }) => {
  const isSub = !!subView;

  // Account access mirrors the rail: when the preview gate is armed, the control
  // opens the gate instead of the real destination.
  const openAccount = () => { if (onAccountGate) { onAccountGate(); return; } onManageAccount && onManageAccount(); };

  const view = (
    <div style={{ minHeight: 'var(--circ-vh)', display: 'flex', flexDirection: 'column', background: 'var(--color-canvas)' }}>
      <TopBarNative space={space} isHome={isHome && !isSub} subView={subView}
        onSettings={onMembers} canSettings={showMembers && !!space} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>{children}</div>
      {!isSub && <BottomNav user={user} isHome={isHome} onHome={onHome} onAccount={openAccount} />}
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

Object.assign(window, { AppShellNative, TopBarNative, useNativePush, APP_NAV_HEIGHT, APP_FAB_BOTTOM });
