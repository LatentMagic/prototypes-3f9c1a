// ============================================================================
// Circlists — the browser tab's arrival signal (#618).
//
// One signal for the WHOLE app: links arriving while the tab is in the
// background turn the tab icon into the notification icon — the mark, untouched,
// wearing an emerald badge at its lower right. Boolean: further arrivals change
// nothing, and there is never a count. Focus is the acknowledgement, so the
// signal clears when the tab regains focus — not on reading, not on scrolling,
// not on accepting.
//
// The notification icon is CONSUMED as a brand asset (brand/assets/
// favicon-notification.svg), never redrawn here: the badge's geometry derives
// from the mark, so a hand-copied variant would go stale the next time the mark
// changed.
//
// The page declares four icon links and the browser picks among them, so this
// module takes ownership of the icon: it drops the declared links and keeps one
// of its own to swap.
//
// Safari does not apply favicon updates, so THERE and only there a leading "• "
// is prepended to the title instead. There is no feature test, so the branch is a
// positive match on Safari and everything unrecognised falls through to the icon
// path: a missing signal in a minority browser is the acceptable failure, a
// doubled signal is not.
//
// Droppable module: nothing calls into it except through window.CircTabSignal,
// guarded at every call site.
// ============================================================================
(() => {
  const RESTING = 'brand/assets/favicon.svg';
  const ARRIVED = 'brand/assets/favicon-notification.svg';
  // Positive Safari match only. Anything unrecognised takes the icon path.
  const TITLE_FALLBACK = /^((?!chrome|android|crios|fxios|edgi).)*safari/i.test(navigator.userAgent);

  let on = false;
  let baseTitle = document.title;
  let link = null;

  const iconLink = () => {
    if (link && link.isConnected) return link;
    document.querySelectorAll('link[rel~="icon"]').forEach((l) => l.parentNode.removeChild(l));
    link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = RESTING;
    document.head.appendChild(link);
    return link;
  };

  const paint = () => {
    if (TITLE_FALLBACK) {
      // Re-read the base title in case the app changed it, so the bullet is
      // never baked in or doubled.
      if (document.title.indexOf('\u2022 ') === 0) baseTitle = document.title.slice(2);
      else baseTitle = document.title;
      document.title = on ? '\u2022 ' + baseTitle : baseTitle;
      return;                                   // never both channels
    }
    iconLink().href = on ? ARRIVED : RESTING;
  };

  const set = () => {
    if (on || document.visibilityState !== 'hidden') return;
    on = true; paint();
  };
  const clear = () => { if (!on) return; on = false; paint(); };

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') clear();
  });
  window.addEventListener('focus', clear);

  if (!TITLE_FALLBACK) iconLink();
  window.CircTabSignal = { set, clear, isSafariFallback: TITLE_FALLBACK };
})();
