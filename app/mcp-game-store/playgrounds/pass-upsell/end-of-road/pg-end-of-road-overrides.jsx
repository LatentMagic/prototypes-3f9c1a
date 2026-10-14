// Rig-owned overrides of canon copy and props. NOTHING here edits canon; it only reads canon's window globals.
// What works, what does not (observed, see scaffold.md):
//   WORKS  pgPatchText(root, from, to)   after-render text swap inside a mounted real screen (copy-only changes)
//   WORKS  pgPatchData(obj, patch)       mutate a canon data object (GS_PAGES, GS_GAMES, GS_SOON...) and get a restore fn
//   WORKS  <GsCtx.Provider value={...}>  the context the screens read (posture, route, callbacks) is the rig's to supply
//   NO     window.GsFoo = MyFoo          a module's own references to GsFoo are lexical consts, not window reads
//          (only code that writes window.GsFoo explicitly, like gs-game.jsx's window.GS_HOME_GAMES, sees the swap)
// Need a structural change inside a component? Copy that one component once, with a pointer to its canon source, per
// skills/build-playground/references/fidelity-and-wiring.md. Rename it Pg<Name> and use it in a wrapper screen.

const pgPatchText = (root, from, to) => {
  if (!root) return false;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n, hit = false;
  while ((n = w.nextNode())) { if (n.nodeValue.includes(from)) { n.nodeValue = n.nodeValue.replace(from, to); hit = true; } }
  return hit;
};

// Keeps a patch applied after React re-renders text inside it (observer re-applies; idempotent because `from` is gone once swapped).
const PgPatch = ({ patches, children }) => {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return undefined;
    const run = () => patches.forEach(([a, b]) => { if (!pgPatchText(el, a, b) && !el.textContent.includes(b)) console.warn('PgPatch: text not found, canon copy moved?', a); });
    run();
    const mo = new MutationObserver(run);
    mo.observe(el, { childList: true, subtree: true, characterData: true });
    return () => mo.disconnect();
  }, []);
  return <div ref={ref} style={{ display: 'contents' }}>{children}</div>;
};

const pgPatchData = (obj, patch) => {
  const before = {}; Object.keys(patch).forEach((k) => { before[k] = obj[k]; obj[k] = patch[k]; });
  return () => Object.keys(before).forEach((k) => { obj[k] = before[k]; });
};

Object.assign(window, { pgPatchText, PgPatch, pgPatchData });
