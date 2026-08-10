// ============================================================================
// Discourse v7 — the sheet primitive, and the add-link flow.
// ----------------------------------------------------------------------------
// Two things live here because the shell and all ten direction modules need
// them, and they must not be re-implemented ten times.
//
//   PGD7Sheet   — the app's ONE overlay mechanism, available to a direction.
//                 Bottom sheet below 520 (or inside the phone frame), centred
//                 dialog above it. Mount at translateY(100%) → double-rAF →
//                 shown → transition up; close reverses and unmounts after the
//                 slide. Copied from useSheetMount in app/swell-reactions.jsx
//                 (which does not export it) — PLAYGROUND.md allows the copy
//                 once, and it carries this pointer to its source. Do not
//                 "improve" it: a copy tuned to look better is no longer
//                 evidence. Any .focus() inside must pass { preventScroll:true }
//                 — GOTCHA #1.
//
//   PGD7AddFlow — adding a link, working, with metadata auto-populated the way
//                 the product does it. Step one is the app's OWN AddReveal
//                 (app/feed.jsx), mounted verbatim, not a copy. The card lands
//                 PENDING and settles in place ~1.4–2.3s later, exactly as
//                 main.jsx schedules it. Step two exists only when the selected
//                 direction supplies a Compose surface: the thought attached
//                 alongside the link. Skipping step two is a real product
//                 state (no thought attached), not a cancel.
// ============================================================================

const { useState: d7aS, useEffect: d7aE, useRef: d7aR } = React;

// ---- Narrowness: the same test the shipped sheets use ----------------------
const pgd7Narrow = () => (typeof window !== 'undefined' && window.innerWidth < 520)
  || (typeof document !== 'undefined' && !!document.querySelector('.circ-phone-screen'));

// ---- The sheet -------------------------------------------------------------
const PGD7Sheet = ({ label, wide = false, onClose, children }) => {
  const [narrow] = d7aS(pgd7Narrow);
  const [render, setRender] = d7aS(true);
  const [shown, setShown] = d7aS(false);
  const closing = d7aR(false);
  const panelRef = d7aR(null);

  d7aE(() => {
    let r2; const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setShown(true)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, []);

  const requestClose = () => {
    if (closing.current) return;
    closing.current = true;
    if (!narrow) { onClose(); return; }
    setShown(false);
    setTimeout(() => { setRender(false); onClose(); }, 240);
  };

  d7aE(() => {
    const onKey = (e) => { if (e.key === 'Escape') requestClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!render) return null;

  const panel = narrow ? {
    position: 'relative', background: 'var(--color-surface)',
    borderTopLeftRadius: 16, borderTopRightRadius: 16,
    boxShadow: 'var(--shadow-overlay)', width: '100%', maxWidth: 560,
    padding: 'var(--space-5) var(--space-4) calc(var(--space-4) + env(safe-area-inset-bottom, 0px))',
    maxHeight: 'calc(100% - 24px)', overflowY: 'auto', overscrollBehavior: 'contain',
    transform: shown ? 'translateY(0)' : 'translateY(100%)',
    transition: 'transform var(--duration-slow) var(--ease-quiet)',
  } : {
    position: 'relative', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-6)', boxShadow: 'var(--shadow-overlay)',
    width: wide ? 560 : 420, maxWidth: '100%', minWidth: 288,
    maxHeight: '88vh', overflowY: 'auto', overscrollBehavior: 'contain',
  };

  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) requestClose(); }}
      className={narrow ? undefined : 'circ-anim-fade'}
      style={{
        position: 'fixed', inset: 0, zIndex: 138, background: 'var(--color-scrim)',
        display: 'flex', justifyContent: 'center', alignItems: narrow ? 'flex-end' : 'center',
        padding: narrow ? 0 : 16,
        opacity: narrow ? (shown ? 1 : 0) : 1,
        transition: narrow ? 'opacity var(--duration-slow) ease-in-out' : undefined,
      }}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label={label || 'Sheet'} style={panel}>
        <button type="button" onClick={requestClose} aria-label="Close" className="circ-rx-close" style={{
          position: 'absolute', top: 10, right: 10, width: 36, height: 36, zIndex: 2,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent', border: 0, borderRadius: 'var(--radius-md)',
          cursor: 'pointer', color: 'var(--color-fg-3)',
        }}>
          <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true"
            style={{ stroke: 'currentColor', strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round' }}>
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {typeof children === 'function' ? children({ close: requestClose, narrow }) : children}
      </div>
    </div>
  );
};

// ---- Metadata extraction ---------------------------------------------------
// The product's extractor, stood in for. Returns what a real extraction would
// have filled onto the pending card. An unlisted host resolves to the honest
// floor — FeedCard derives a title from the URL and paints a source-keyed tint
// block — which is a real product state and must stay reachable.
const pgd7Host = (url) => {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch (e) { return String(url).replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]; }
};
const pgd7TitleFromUrl = (url) => {
  try {
    const seg = (new URL(url).pathname.split('/').filter(Boolean).pop() || '')
      .replace(/\.(html?|php|aspx?)$/i, '').replace(/[-_]+/g, ' ').trim();
    if (!seg || /^\d+$/.test(seg) || seg.length < 3) return null;
    return seg.charAt(0).toUpperCase() + seg.slice(1);
  } catch (e) { return null; }
};
const pgd7Extract = (url) => {
  const table = (window.PGD7_DATA && window.PGD7_DATA.extract) || {};
  const host = pgd7Host(url);
  const hit = table[host] || table[Object.keys(table).find((d) => host.endsWith('.' + d)) || ''] || null;
  const derived = pgd7TitleFromUrl(url);
  if (!hit) return { title: derived || null, source: null };
  return { title: hit.title || derived || null, ...hit };
};

// ---- Step two: the thought attached alongside the link ---------------------
const PGD7Compose = ({ ctx, pending, Compose, onDone }) => {
  const [draft, setDraft] = d7aS({ text: '', register: 'gist' });
  return (
    <PGD7Sheet label="Attach a thought" onClose={() => onDone(null)}>
      {({ close }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-fg-1)' }}>
              {pgd7Host(pending.url)}
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, color: 'var(--color-fg-3)', marginTop: 2 }}>
              {pending.title || pending.url.replace(/^https?:\/\//, '')}
            </div>
          </div>
          <Compose ctx={ctx} item={pending} draft={draft} setDraft={setDraft}
            submit={(payload) => { onDone(payload || draft); close(); }} />
        </div>
      )}
    </PGD7Sheet>
  );
};

// ---- The flow --------------------------------------------------------------
// open   — 'url' (the app's AddReveal) | 'compose' | null
// onAdd(item, thought) — the rig commits; settling is the rig's job so the
//                        pending card is visible in the feed while it resolves.
const PGD7AddFlow = ({ ctx, isMobile, Compose, open, onClose, onAdd }) => {
  const [pending, setPending] = d7aS(null);
  const { AddReveal } = window;

  const takeUrl = (item) => {
    const meta = pgd7Extract(item.url);
    const staged = { ...item, ...meta, pending: true, by: 'you', attribution: 'Added by you' };
    if (Compose) { setPending(staged); return; }
    onAdd(staged, null);
  };

  return (
    <React.Fragment>
      <AddReveal open={open && !pending} isMobile={isMobile}
        onClose={() => { if (!pending) onClose(); }} onAdd={takeUrl} />
      {pending && (
        <PGD7Compose ctx={ctx} pending={pending} Compose={Compose}
          onDone={(thought) => { const p = pending; setPending(null); onClose(); onAdd(p, thought); }} />
      )}
    </React.Fragment>
  );
};

Object.assign(window, { PGD7Sheet, PGD7AddFlow, pgd7Extract, pgd7Host, pgd7Narrow, pgd7TitleFromUrl });
