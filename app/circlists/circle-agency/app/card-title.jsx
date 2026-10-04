// ============================================================================
// Circlists — a card's title, set by the member who added it.
//
//   circHeadline(item)     — what the card's headline says. One expression, read
//                            by the card, its menu label, search and the thought.
//   circTitleMark(item)    — the Edited marker's text, or null.
//   circRetitle / circUntitle — the two writes. Untitle is the reset: it drops the
//                            custom title and nothing else, so the headline falls
//                            back to the stored fetched title, or to the address
//                            when the fetch failed. It never refetches.
//   CardTitleMenuItem      — "Edit title" in the card's kebab.
//   CardTitleDialog        — the editor.
//
// A DROPPABLE MODULE. Drop this file and the menu item, the editor and the
// marker go; a stored custom title is simply ignored (feed.jsx falls back to its
// own expression), so the card reads as fetched.
//
// ---- Data ------------------------------------------------------------------
// item.customTitle — the contributor's title. Absent = no custom title. The
// fetched title stays where it always was (item.title), untouched by an edit,
// which is what makes the reset exact.
// item.fetchFailed — the unfurl failed: no fetched title, and the headline is
// the address. Seed fixtures need it because feed.jsx would otherwise derive a
// title from the path (GOTCHA 4).
// ============================================================================

// The cap: a headline, not a sentence. 80 holds every short headline and clamps
// at two lines on a 320 card at most a word early.
const CARD_TITLE_CAP = 80;

const circHeadline = (item) => {
  if (!item) return null;
  if (item.customTitle) return item.customTitle;
  if (item.fetchFailed) return null;
  return item.title || (typeof feedDeriveTitle === 'function' ? feedDeriveTitle(item.url) : null);
};

// ---- The Edited marker — removed 2026-09-29 -----------------------------------
// A retitled card carries no marker. The hook stays so feed.jsx's reader needs
// no change; it returns nothing. The thought's own "edited" is unaffected.
const circTitleMark = () => null;

const circMapItem = (setSpaces, itemId, fn) => setSpaces((prev) => prev.map((s) => (
  s.items.some((i) => i.id === itemId) ? { ...s, items: s.items.map((i) => (i.id === itemId ? fn(i) : i)) } : s)));
const circRetitle = (setSpaces, itemId, text) => circMapItem(setSpaces, itemId, (i) => ({ ...i, customTitle: text }));
const circUntitle = (setSpaces, itemId) => circMapItem(setSpaces, itemId, (i) => { const n = { ...i }; delete n.customTitle; return n; });

// Contributor only, fetched or failed; never while the link is still resolving
// (the thought's own rule). For everyone else the item is absent.
const circCanRetitle = (item) => !!item && !item.pending
  && /^added by\s+you\b/i.test(item.attribution || '');

// ---- The menu item -----------------------------------------------------------
// Sits after Share and Save, above the divider: the items every member has keep
// their place on every card, and this one's presence moves nothing above it.
const CardTitleMenuItem = ({ item, onEdit }) => {
  if (!circCanRetitle(item)) return null;
  return (
    <button type="button" role="menuitem" className="circ-menuitem" onClick={onEdit}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
        background: 'transparent', border: 0, cursor: 'pointer', padding: '11px 10px', minHeight: 44,
        borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14,
        color: 'var(--color-fg-1)', whiteSpace: 'nowrap',
      }}>
      <Icon name="edit" size={16} /> Edit title
    </button>
  );
};

// ---- The editor ----------------------------------------------------------------
// The house edit dialog (spaces.jsx EditCircleDialog): same shell, same
// single-line field, cap enforced by the field with no counter, Enter saves,
// Esc / scrim / Cancel dismiss. Opens holding the headline the card shows now;
// on a failed fetch it opens empty, because the address is not a title.
// Removal (ratified 2026-09-29): on a card with a custom title, clearing the
// field and saving restores the original. The editor says so from the moment it
// opens — "Clear to restore." under the field — and the emptied field shows
// the original as its placeholder: the fetched title, or the address in mono on
// a failed fetch. `onRestore` runs circUntitle; nothing refetches.
// With no custom title, an empty Save says so under the field rather than
// greying the button (ui-design.md: prefer a statement to a disabled control;
// deferred validation), and writes nothing. Saving the headline it opened with
// writes nothing either, so no marker appears for a no-op.
const CARD_TITLE_FAIL = "Couldn't save that title. Please try again.";
const CardTitleDialog = ({ item, onSave, onRestore, onCancel, onAnnounce }) => {
  const custom = !!item.customTitle;
  const opening = item.customTitle || (item.fetchFailed ? '' : (circHeadline(item) || ''));
  const address = String(item.url || '').replace(/^https?:\/\//, '');
  const original = item.fetchFailed ? address : (item.title || circHeadline({ ...item, customTitle: null }) || address);
  const [draft, setDraft] = React.useState(opening);
  const [err, setErr] = React.useState(null);
  const [failed, setFailed] = React.useState(false);
  const inputRef = React.useRef(null);
  const invokerRef = React.useRef(null);
  React.useEffect(() => {
    // Captured on the timer, not at mount: the kebab hands focus back to its
    // trigger in the same commit that opens this, and that trigger is where
    // focus belongs on close.
    const id = setTimeout(() => {
      invokerRef.current = document.activeElement;
      const el = inputRef.current;
      // Opens with the whole title selected: typing replaces it, and a single
      // delete clears it (which is how a custom title is restored).
      if (el) { el.focus({ preventScroll: true }); el.select(); }
    }, 40);
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(id); window.removeEventListener('keydown', onKey);
      const inv = invokerRef.current;
      if (inv && inv.isConnected && inv.focus) inv.focus({ preventScroll: true });
    };
  }, []);
  const v = draft.trim();
  const save = () => {
    // A refused write (onSave / onRestore return false) leaves the dialog and the draft as they were.
    const refused = () => { setFailed(true); if (onAnnounce) onAnnounce(CARD_TITLE_FAIL); };
    if (!v) { if (custom && onRestore) { if (onRestore() === false) refused(); return; } setErr('Give it a title.'); return; }
    if (v === opening.trim()) { onCancel(); return; }
    if (onSave(v) === false) refused();
  };
  return (
    <div role="dialog" aria-modal="true" aria-label="Edit title"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 130, background: 'var(--color-scrim)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} className="circ-anim-fade">
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', maxWidth: 400, width: '100%', boxShadow: 'var(--shadow-overlay)' }}>
        <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-2xl)', lineHeight: 1.3, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: '0 0 var(--space-5)' }}>Edit title</h2>
        <input ref={inputRef} value={draft} maxLength={CARD_TITLE_CAP} aria-label="Title" aria-describedby="card-title-help" aria-invalid={!!err}
          placeholder={custom ? original : 'Give it a title'}
          className={custom && item.fetchFailed ? 'circ-titlefield-addr' : undefined}
          onChange={(e) => { setDraft(e.target.value); if (err) setErr(null); if (failed) setFailed(false); }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); save(); } }}
          style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 16, lineHeight: 1.4, color: 'var(--color-fg-1)', border: '1px solid ' + (err ? 'var(--color-destructive)' : 'var(--color-border-1)'), borderRadius: 'var(--radius-md)', padding: '12px 14px', minHeight: 44, background: 'var(--color-surface)' }} />
        {err && (
          <div role="alert" style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 7, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, lineHeight: 1.4, color: 'var(--color-destructive)' }}>
            <span style={{ marginTop: 1, flexShrink: 0 }}><Icon name="x" size={14} /></span><span>{err}</span>
          </div>
        )}
        {failed && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 7, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, lineHeight: 1.4, color: 'var(--color-destructive)' }}>
            <span style={{ marginTop: 1, flexShrink: 0 }}><Icon name="x" size={14} /></span><span>{CARD_TITLE_FAIL}</span>
          </div>
        )}
        <p id="card-title-help" style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, lineHeight: 1.5, color: 'var(--color-fg-3)', margin: '8px 0 0' }}>{custom && onRestore ? 'Clear to restore.' : 'Everyone in the circle sees this title.'}</p>
        <div className="circ-dlg-act" style={{ marginTop: 'var(--space-5)' }}>
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" onClick={save}>Save</Button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { CARD_TITLE_CAP, circHeadline, circTitleMark, circRetitle, circUntitle, circCanRetitle, CardTitleMenuItem, CardTitleDialog });
