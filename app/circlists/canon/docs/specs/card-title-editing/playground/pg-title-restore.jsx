// ============================================================================
// Playground — restoring the original title from inside the editor
// (docs/specs/card-title-editing, round two: option 01 of card-title-removal).
//
// Settled by this round: the route back lives in Edit title, and the menu gains
// nothing. The question left is the control's form. Same rig as round one: the
// whole real app, with window.CardTitleDialog swapped on this page only. Canon's
// menu item is untouched. The editor is canon's shell and field, forked for each
// option's delta; every reset goes through canon's circUntitle (no refetch).
// ============================================================================

const PGR_KEY = 'pg_card_title_restore_v1';
const PGR_OPTS = [
  { n: '01', name: 'Beside Cancel', line: 'Round one, as built: \u201cUse original title\u201d in the button row. One tap resets and closes.' },
  { n: '02', name: 'Original, under the field', line: 'A line under the field names the original, with Restore at its end. One tap resets and closes.' },
  { n: '03', name: 'Original, as a fill', line: 'The original sits under the field as a row to tap. It fills the field; Save commits, Cancel undoes.' },
];
const PGR_CARDS = [
  { id: 'fetched', label: 'Over a fetched title', url: 'https://www.usenix.org/conference/srecon26/presentation/blameless-reviews', custom: 'The blameless reviews talk' },
  { id: 'failed', label: 'Over a failed fetch', url: 'https://claude.ai/artifact/9Kd2mQxV7wTn4BhRpYc3Lf', custom: 'Pricing proposal, first draft' },
];
const pgrRead = () => { try { return JSON.parse(localStorage.getItem(PGR_KEY)) || {}; } catch (e) { return {}; } };
const pgrState = { opt: pgrRead().opt || '02', card: pgrRead().card || 'fetched' };
const pgrSave = () => { try { localStorage.setItem(PGR_KEY, JSON.stringify(pgrState)); } catch (e) {} };

const pgrApi = () => (window.CircCandidate && window.CircCandidate.api) || null;
const pgrUntitle = (item) => { const a = pgrApi(); if (a) window.circUntitle(a.setSpaces, item.id); };
const pgrOriginal = (item) => (item.fetchFailed ? null : (item.title || null));
const pgrAddress = (item) => String(item.url || '').replace(/^https?:\/\//, '');

const pgrStage = () => {
  const a = pgrApi(); if (!a) return false;
  a.setSpaces((prev) => prev.map((s) => ({ ...s, items: s.items.map((i) => {
    const c = PGR_CARDS.find((k) => k.url === i.url);
    if (!c) return i;
    if (c.id === pgrState.card) return { ...i, customTitle: c.custom };
    const n = { ...i }; delete n.customTitle; return n;
  }) })));
  return true;
};
const pgrScroll = () => setTimeout(() => {
  const c = PGR_CARDS.find((k) => k.id === pgrState.card);
  const el = [...document.querySelectorAll('article.circ-card')].find((a) => a.textContent.includes(c.custom));
  if (!el) return;
  const sc = document.querySelector('.circ-phone-screen');
  const y = el.getBoundingClientRect().top - 160;
  if (sc) sc.scrollBy({ top: y }); else window.scrollBy({ top: y });
}, 250);

const CanonTitleDialogR = window.CardTitleDialog;

// The original, in its own face: sans for a fetched title, mono for an address.
const PgrOriginalText = ({ item }) => {
  const orig = pgrOriginal(item);
  return orig
    ? <span style={{ color: 'var(--color-fg-2)' }}>{orig}</span>
    : <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--color-fg-2)', wordBreak: 'break-all' }}>{pgrAddress(item)}</span>;
};

const PgrEditor = ({ item, onSave, onCancel }) => {
  const opt = pgrState.opt;
  const opening = item.customTitle;
  const orig = pgrOriginal(item);
  const [draft, setDraft] = React.useState(opening);
  const [filled, setFilled] = React.useState(false);
  const [err, setErr] = React.useState(null);
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    const id = setTimeout(() => { const el = inputRef.current; if (el) { el.focus({ preventScroll: true }); const n = el.value.length; el.setSelectionRange(n, n); } }, 40);
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(id); window.removeEventListener('keydown', onKey); };
  }, []);
  const reset = () => { pgrUntitle(item); onCancel(); };
  const v = draft.trim();
  const save = () => {
    if (filled) { reset(); return; }
    if (!v) { setErr('Give it a title.'); return; }
    if (v === opening.trim()) { onCancel(); return; }
    onSave(v);
  };
  // 03: tapping the row puts the original in the field. A fetched title is
  // editable text; an address is not a title, so the field shows it read-only
  // in mono until the member types, which drops the fill.
  const fill = () => { setFilled(true); setErr(null); setDraft(orig || ''); setTimeout(() => inputRef.current && inputRef.current.focus({ preventScroll: true }), 0); };
  const showAddr = opt === '03' && filled && !orig;
  const quietLine = { fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, lineHeight: 1.5, color: 'var(--color-fg-3)' };
  const restoreLink = { background: 'transparent', border: 0, padding: '0 4px', margin: '0 -4px', minHeight: 44, cursor: 'pointer', font: '600 13px/1.5 var(--font-sans)', flexShrink: 0 };
  return (
    <div role="dialog" aria-modal="true" aria-label="Edit title"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 130, background: 'var(--color-scrim)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', maxWidth: 400, width: '100%', boxShadow: 'var(--shadow-overlay)' }}>
        <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-2xl)', lineHeight: 1.3, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: '0 0 var(--space-5)' }}>Edit title</h2>
        <input ref={inputRef} value={showAddr ? pgrAddress(item) : draft} readOnly={showAddr} maxLength={window.CARD_TITLE_CAP} aria-label="Title" aria-describedby="pgr-help" aria-invalid={!!err}
          placeholder="Give it a title"
          onChange={(e) => { setDraft(e.target.value); setFilled(false); if (err) setErr(null); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); save(); return; }
            if (showAddr && e.key.length === 1) { setFilled(false); setDraft(''); }
          }}
          style={{ width: '100%', boxSizing: 'border-box', fontFamily: showAddr ? 'var(--font-mono)' : 'var(--font-sans)', fontWeight: 400, fontSize: 16, lineHeight: 1.4, color: 'var(--color-fg-1)', border: '1px solid ' + (err ? 'var(--color-destructive)' : 'var(--color-border-1)'), borderRadius: 'var(--radius-md)', padding: '12px 14px', minHeight: 44, background: 'var(--color-surface)', textOverflow: 'ellipsis' }} />
        {err && (
          <div role="alert" style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 7, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, lineHeight: 1.4, color: 'var(--color-destructive)' }}>
            <span style={{ marginTop: 1, flexShrink: 0 }}><Icon name="x" size={14} /></span><span>{err}</span>
          </div>
        )}
        <p id="pgr-help" style={{ ...quietLine, margin: '8px 0 0' }}>Everyone in the circle sees this title.</p>
        {opt === '02' && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border-2)' }}>
            <p style={{ ...quietLine, margin: 0, flex: 1, minWidth: 0 }}>Original: <PgrOriginalText item={item} /></p>
            <button type="button" className="circ-doorlink" onClick={reset} style={restoreLink}>Restore</button>
          </div>
        )}
        {opt === '03' && !filled && (
          <button type="button" className="circ-menuitem" onClick={fill}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, width: '100%', textAlign: 'left', marginTop: 'var(--space-3)', padding: '8px 10px', minHeight: 44, background: 'var(--color-surface-sunken)', border: 0, borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
            <span style={{ font: '500 12px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>Original</span>
            <span style={{ font: '400 14px/1.4 var(--font-sans)' }}><PgrOriginalText item={item} /></span>
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-5)', flexWrap: 'wrap' }}>
          {opt === '01' && <Button variant="tertiary" onClick={reset} style={{ marginLeft: -6 }}>Use original title</Button>}
          <span style={{ flex: 1 }}></span>
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" onClick={save}>Save</Button>
        </div>
      </div>
    </div>
  );
};
window.CardTitleDialog = (props) => (props.item.customTitle ? <PgrEditor {...props} /> : <CanonTitleDialogR {...props} />);

const PgrBar = () => {
  const [, force] = React.useState(0);
  const set = (k, v) => { pgrState[k] = v; pgrSave(); force((n) => n + 1); pgrStage(); pgrScroll(); };
  React.useEffect(() => {
    let tries = 0;
    const t = setInterval(() => {
      if (!pgrStage() && ++tries < 40) return;
      clearInterval(t);
      setTimeout(() => {
        if (document.querySelector('article.circ-card')) { pgrScroll(); return; }
        const row = [...document.querySelectorAll('button, a, [role="button"]')].find((b) => /^Backend Pod/.test((b.textContent || '').trim()));
        if (row) { row.click(); setTimeout(pgrScroll, 300); }
      }, 150);
    }, 100);
    return () => clearInterval(t);
  }, []);
  const cur = PGR_OPTS.find((o) => o.n === pgrState.opt) || PGR_OPTS[0];
  return (
    <div className="pg-bar">
      <div className="pg-bar-row">
        <div className="pg-seg" role="radiogroup" aria-label="Option">
          {PGR_OPTS.map((o) => (
            <button key={o.n} type="button" role="radio" aria-checked={o.n === cur.n} title={o.line}
              className="pg-seg-btn" data-on={o.n === cur.n ? '' : undefined} onClick={() => set('opt', o.n)}>
              <span className="pg-num">{o.n}</span>{o.name}
            </button>
          ))}
        </div>
        <label className="pg-card">
          <span>Card</span>
          <select value={pgrState.card} onChange={(e) => set('card', e.target.value)}>
            {PGR_CARDS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <button type="button" className="pg-restage" onClick={() => { pgrStage(); pgrScroll(); }} title="Put the custom title back on the card">Restage</button>
        </label>
      </div>
      <p className="pg-line">{cur.line}</p>
    </div>
  );
};

Object.assign(window, { PgrBar });
