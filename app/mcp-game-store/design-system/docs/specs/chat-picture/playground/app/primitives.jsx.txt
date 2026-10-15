// ============================================================================
// Kit — primitives. Icons (inline) and the dialogs' scroll lock: what the
// prototype aids draw with and share.
// The product's own primitives (buttons, fields, marks) are added here.
// ============================================================================

// ---- Inline icon set (24px viewBox, 1.5px stroke, currentColor) ------------
const KIT_ICONS = {
  check: '<polyline points="20 6 9 17 4 12"></polyline>',
  x: '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>',
  'chevron-down': '<polyline points="6 9 12 15 18 9"></polyline>',
  link: '<path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5"></path><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5"></path>',
  settings: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',
  list: '<line x1="9" y1="6" x2="20" y2="6"></line><line x1="9" y1="12" x2="20" y2="12"></line><line x1="9" y1="18" x2="20" y2="18"></line><circle cx="4.5" cy="6" r="1.2" fill="currentColor" stroke="none"></circle><circle cx="4.5" cy="12" r="1.2" fill="currentColor" stroke="none"></circle><circle cx="4.5" cy="18" r="1.2" fill="currentColor" stroke="none"></circle>',
};

const Icon = ({ name, size = 20, color = 'currentColor', style = {}, strokeWidth = 1.5 }) => {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', ...style }} aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: KIT_ICONS[name] || '' }}
    />
  );
};

// ---- Scroll lock, shared by the aids' dialogs --------------------------------
// Locks whatever is actually scrolling behind a dialog — the phone frame's
// inner screen when forced-mobile, otherwise the document — so a scroll gesture
// that starts on the scrim never falls through to the app behind. Dialogs can
// stack, so the lock is counted: the overflow it found is put back only when the
// last one lets go. Returns the release, so it reads as an effect:
// useEffect(kitLockScroll, []).
const kitScrollLocks = new Map();
const kitLockScroll = () => {
  const scroller = document.querySelector('.kit-phone-screen') || document.scrollingElement || document.documentElement;
  const held = kitScrollLocks.get(scroller) || { count: 0, prevOverflow: scroller.style.overflow };
  held.count += 1;
  kitScrollLocks.set(scroller, held);
  scroller.style.overflow = 'hidden';
  return () => {
    held.count -= 1;
    if (held.count > 0) return;
    scroller.style.overflow = held.prevOverflow;
    kitScrollLocks.delete(scroller);
  };
};

Object.assign(window, { Icon, kitLockScroll });
