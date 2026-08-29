// ============================================================================
// A3 candidate — seed extension. Wraps window.CircSeed.seedSpaces (loaded before
// this file, before main.jsx) so the delta is reachable on open.
//
// Why it exists: the shipped seed puts ELEVEN members in Backend Pod against a
// cap of ten, and Backend Pod is the only circle You champion. So the members
// surface opens on the "This circle is full" panel and the invite card — the
// whole of this delta — cannot be reached at all. Dropping the two trailing
// members (neither of whom appears in Backend Pod's reaction fixtures) puts the
// circle at 9 of 10 and the card on screen.
//
// This is a fixture, not part of the feature: the same over-cap seed is in the
// main build, where it hides the SHIPPED invite card just as thoroughly. That is
// a defect in app/seed-data.jsx and is not fixed here — flagged for the owner.
// ============================================================================
(() => {
  const base = window.CircSeed.seedSpaces;
  const DROP = ['Owen D.', 'Freya S.'];
  window.CircSeed.seedSpaces = (email) => base(email).map(s => s.id === 'sp-backend'
    ? { ...s, members: s.members.filter(m => DROP.indexOf(m.name) === -1) }
    : s);
})();
