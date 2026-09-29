// ============================================================================
// Playground — removing a card's custom title (docs/specs/card-title-editing).
//
// Mounts the whole real app (main.jsx) and swaps two handles on THIS page only:
// window.CardTitleMenuItem and window.CardTitleDialog. Canon's files are not
// touched; its menu item and editor are rendered unmodified wherever an option
// does not change them. Options 01 and 03 need a different editor, so they
// render PgTitleEditor — the canon editor's shell and field, with that option's
// delta. That fork is the rig's cost, named in the handoff.
//
// Every reset goes through canon's circUntitle: it drops the custom title and
// nothing else, so the headline falls back to the stored fetched title or the
// address. Nothing refetches.
// ============================================================================

const PG_TITLE_KEY = 'pg_card_title_removal_v1';
const PG_TITLE_OPTS = [
  { n: '01', name: 'In the editor', line: 'Edit title carries a quiet \u201cUse original title\u201d beside Cancel. One tap resets and closes.' },
  { n: '02', name: 'In the menu', line: 'The kebab gains Remove title on a retitled card of yours. A confirm names what the card goes back to.' },
  { n: '03', name: 'Empty the field', line: 'No named act. The field shows the original as its placeholder; clear it and save to go back.' },
];
const PG_TITLE_CARDS = [
  { id: 'fetched', label: 'Over a fetched title', url: 'https://www.usenix.org/conference/srecon26/presentation/blameless-reviews', custom: 'The blameless reviews talk' },
  { id: 'failed', label: 'Over a failed fetch', url: 'https://claude.ai/artifact/9Kd2mQxV7wTn4BhRpYc3Lf', custom: 'Pricing proposal, first draft' },
];
const pgTitleRead = () => { try { return JSON.parse(localStorage.getItem(PG_TITLE_KEY)) || {}; } catch (e) { return {}; } };
const pgTitleState = { opt: pgTitleRead().opt || '01', card: pgTitleRead().card || 'fetched' };
const pgTitleSave = () => { try { localStorage.setItem(PG_TITLE_KEY, JSON.stringify(pgTitleState)); } catch (e) {} };

const pgApi = () => (window.CircCandidate && window.CircCandidate.api) || null;
const pgUntitle = (item) => { const a = pgApi(); if (a) window.circUntitle(a.setSpaces, item.id); };
// What the card goes back to: the fetched title, or the address.
const pgOriginal = (item) => (item.fetchFailed ? null : (item.title || null));
const pgAddress = (item) => String(item.url || '').replace(/^https?:\/\//, '');

// Stage the picked card: it carries its custom title; the other one does not.
const pgStageCard = () => {
  const a = pgApi(); if (!a) return false;
  a.setSpaces((prev) => prev.map((s) => ({ ...s, items: s.items.map((i) => {
    const c = PG_TITLE_CARDS.find((k) => k.url === i.url);
    if (!c) return i;
    if (c.id === pgTitleState.card) return { ...i, customTitle: c.custom };
    const n = { ...i }; delete n.customTitle; return n;
  }) })));
  return true;
};
// Bring the picked card into view (nearest scroller; never scrollIntoView).
const pgScrollToCard = () => setTimeout(() => {
  const c = PG_TITLE_CARDS.find((k) => k.id === pgTitleState.card);
  const el = [...document.querySelectorAll('article.circ-card')].find((a) => a.textContent.includes(c.custom));
  if (!el) return;
  const sc = document.querySelector('.circ-phone-screen');
  const y = el.getBoundingClientRect().top - 160;
  if (sc) sc.scrollBy({ top: y }); else window.scrollBy({ top: y });
}, 250);

// ---- Option 02: the menu item ------------------------------------------------
const CanonTitleMenuItem = window.CardTitleMenuItem;
const CanonTitleDialog = window.CardTitleDialog;
const pgMenuRow = { display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', background: 'transparent', border: 0, cursor: 'pointer', padding: '11px 10px', minHeight: 44, borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14, color: 'var(--color-fg-1)', whiteSpace: 'nowrap' };
const PgRemoveConfirm = ({ item, onClose }) => {
  const cancelRef = React.useRef(null);
  React.useEffect(() => {
    const id = setTimeout(() => cancelRef.current && cancelRef.current.focus({ preventScroll: true }), 40);
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(id); window.removeEventListener('keydown', onKey); };
  }, []);
  const orig = pgOriginal(item);
  return ReactDOM.createPortal(
    <div className="circ-confirm-scrim" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="circ-confirm-panel" role="alertdialog" aria-modal="true" aria-labelledby="pg-rm-t" aria-describedby="pg-rm-b">
        <h2 id="pg-rm-t" className="circ-confirm-title">Remove your title?</h2>
        <p id="pg-rm-b" className="circ-confirm-sub">
          {orig ? <React.Fragment>The card goes back to <span style={{ color: 'var(--color-fg-1)', fontWeight: 500 }}>{orig}</span>.</React.Fragment>
            : <React.Fragment>The card goes back to its address, <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13.5, color: 'var(--color-fg-1)', wordBreak: 'break-all' }}>{pgAddress(item)}</span>.</React.Fragment>}
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-6)' }}>
          <Button ref={cancelRef} variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => { pgUntitle(item); onClose(); }}>Remove</Button>
        </div>
      </div>
    </div>, document.querySelector('.circ-phone-screen') || document.body);
};
const PgTitleMenuItem = ({ item, onEdit }) => {
  if (!CanonTitleMenuItem) return null;
  const canon = <CanonTitleMenuItem item={item} onEdit={onEdit} />;
  if (pgTitleState.opt !== '02' || !item.customTitle || !window.circCanRetitle(item)) return canon;
  return (
    <React.Fragment>
      {canon}
      <button type="button" role="menuitem" className="circ-menuitem" style={pgMenuRow}
        onClick={() => { window.pgOpenRemove(item); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); }}>
        <Icon name="x" size={16} /> Remove title
      </button>
    </React.Fragment>
  );
};
// Page-level host for option 02's confirm (outside the menu, which closes).
const PgRemoveHost = () => {
  const [item, setItem] = React.useState(null);
  React.useEffect(() => { window.pgOpenRemove = (it) => setItem(it); }, []);
  return item ? <PgRemoveConfirm item={item} onClose={() => setItem(null)} /> : null;
};

// ---- Options 01 and 03: the editor --------------------------------------------
// Canon's CardTitleDialog, forked for the option's delta. Everything else —
// shell, field, cap, help line, Enter/Esc, empty-save statement — is canon's.
const PgTitleEditor = ({ item, onSave, onCancel }) => {
  const opt = pgTitleState.opt;
  const custom = !!item.customTitle;
  const opening = item.customTitle || (item.fetchFailed ? '' : (window.circHeadline(item) || ''));
  const [draft, setDraft] = React.useState(opening);
  const [err, setErr] = React.useState(null);
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    const id = setTimeout(() => { const el = inputRef.current; if (el) { el.focus({ preventScroll: true }); const n = el.value.length; el.setSelectionRange(n, n); } }, 40);
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(id); window.removeEventListener('keydown', onKey); };
  }, []);
  const v = draft.trim();
  const reset = () => { pgUntitle(item); onCancel(); };
  const save = () => {
    if (!v) { if (opt === '03' && custom) { reset(); return; } setErr('Give it a title.'); return; }
    if (v === opening.trim()) { onCancel(); return; }
    onSave(v);
  };
  const orig = pgOriginal(item);
  // 03: an emptied field shows what the card goes back to.
  const placeholder = opt === '03' && custom ? (orig || pgAddress(item)) : 'Give it a title';
  const help = opt === '03' && custom ? 'Everyone in the circle sees this title. Clear it to go back to the original.' : 'Everyone in the circle sees this title.';
  return (
    <div role="dialog" aria-modal="true" aria-label="Edit title"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 130, background: 'var(--color-scrim)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', maxWidth: 400, width: '100%', boxShadow: 'var(--shadow-overlay)' }}>
        <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-2xl)', lineHeight: 1.3, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: '0 0 var(--space-5)' }}>Edit title</h2>
        <input ref={inputRef} value={draft} maxLength={window.CARD_TITLE_CAP} aria-label="Title" aria-describedby="pg-title-help" aria-invalid={!!err}
          placeholder={placeholder}
          onChange={(e) => { setDraft(e.target.value); if (err) setErr(null); }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); save(); } }}
          style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 16, lineHeight: 1.4, color: 'var(--color-fg-1)', border: '1px solid ' + (err ? 'var(--color-destructive)' : 'var(--color-border-1)'), borderRadius: 'var(--radius-md)', padding: '12px 14px', minHeight: 44, background: 'var(--color-surface)' }} />
        {err && (
          <div role="alert" style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 7, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, lineHeight: 1.4, color: 'var(--color-destructive)' }}>
            <span style={{ marginTop: 1, flexShrink: 0 }}><Icon name="x" size={14} /></span><span>{err}</span>
          </div>
        )}
        <p id="pg-title-help" style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, lineHeight: 1.5, color: 'var(--color-fg-3)', margin: '8px 0 0' }}>{help}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-5)', flexWrap: 'wrap' }}>
          {opt === '01' && custom && <Button variant="tertiary" onClick={reset} style={{ marginLeft: -6 }}>Use original title</Button>}
          <span style={{ flex: 1 }}></span>
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" onClick={save}>Save</Button>
        </div>
      </div>
    </div>
  );
};
const PgTitleDialog = (props) => (pgTitleState.opt === '02' || !props.item.customTitle
  ? <CanonTitleDialog {...props} /> : <PgTitleEditor {...props} />);

window.CardTitleMenuItem = PgTitleMenuItem;
window.CardTitleDialog = PgTitleDialog;

// ---- The bar -------------------------------------------------------------------
const PgTitleBar = () => {
  const [, force] = React.useState(0);
  const set = (k, v) => { pgTitleState[k] = v; pgTitleSave(); force((n) => n + 1); pgStageCard(); pgScrollToCard(); };
  React.useEffect(() => {
    let tries = 0;
    // First load: stage the card, then enter Backend Pod the way a member does —
    // by pressing its row on home — if the app opened on home.
    const t = setInterval(() => {
      if (!pgStageCard() && ++tries < 40) return;
      clearInterval(t);
      setTimeout(() => {
        if (document.querySelector('article.circ-card')) { pgScrollToCard(); return; }
        const row = [...document.querySelectorAll('button, a, [role="button"]')].find((b) => /^Backend Pod/.test((b.textContent || '').trim()));
        if (row) { row.click(); setTimeout(pgScrollToCard, 300); }
      }, 150);
    }, 100);
    return () => clearInterval(t);
  }, []);
  const cur = PG_TITLE_OPTS.find((o) => o.n === pgTitleState.opt) || PG_TITLE_OPTS[0];
  return (
    <div className="pg-bar">
      <div className="pg-bar-row">
        <div className="pg-seg" role="radiogroup" aria-label="Option">
          {PG_TITLE_OPTS.map((o) => (
            <button key={o.n} type="button" role="radio" aria-checked={o.n === cur.n} title={o.line}
              className="pg-seg-btn" data-on={o.n === cur.n ? '' : undefined} onClick={() => set('opt', o.n)}>
              <span className="pg-num">{o.n}</span>{o.name}
            </button>
          ))}
        </div>
        <label className="pg-card">
          <span>Card</span>
          <select value={pgTitleState.card} onChange={(e) => set('card', e.target.value)}>
            {PG_TITLE_CARDS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <button type="button" className="pg-restage" onClick={() => { pgStageCard(); pgScrollToCard(); }} title="Put the custom title back on the card">Restage</button>
        </label>
      </div>
      <p className="pg-line">{cur.line}</p>
    </div>
  );
};

Object.assign(window, { PgTitleBar, PgRemoveHost });
