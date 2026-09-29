// ============================================================================
// Playground — clearing the field restores the original title
// (docs/specs/card-title-editing, round three).
//
// No new control. The field is the only thing a member touches: clear it and
// save, and the card goes back to its fetched title, or its address on a failed
// fetch. Every option says so BEFORE the act, from the moment the editor opens;
// what they vary is where that line sits and whether it names the original.
// The emptied field shows the original as its placeholder in all three.
// Same rig: the real app, window.CardTitleDialog swapped on this page only.
// The canon help line ("Everyone in the circle sees this title.") is left out
// here in every option; dropping it from canon is still pending Joe's word.
// Every reset goes through canon's circUntitle — no refetch.
// ============================================================================

const PGC_KEY = 'pg_card_title_clear_v1';
const PGC_OPTS = [
  { n: '01', name: 'Under the field', line: 'From the moment it opens, one line under the field: “Clear to restore.” Ratified 2026-09-29.' },
  { n: '02', name: 'Under, naming it', line: 'As 01, and the line names what the card goes back to.' },
  { n: '03', name: 'Above, naming it', line: 'The same line as 02, above the field, under the dialog title.' },
];
const PGC_CARDS = [
  { id: 'fetched', label: 'Over a fetched title', url: 'https://www.usenix.org/conference/srecon26/presentation/blameless-reviews', custom: 'The blameless reviews talk' },
  { id: 'failed', label: 'Over a failed fetch', url: 'https://claude.ai/artifact/9Kd2mQxV7wTn4BhRpYc3Lf', custom: 'Pricing proposal, first draft' },
];
const pgcRead = () => { try { return JSON.parse(localStorage.getItem(PGC_KEY)) || {}; } catch (e) { return {}; } };
const pgcState = { opt: pgcRead().opt || '01', card: pgcRead().card || 'fetched' };
const pgcSave = () => { try { localStorage.setItem(PGC_KEY, JSON.stringify(pgcState)); } catch (e) {} };

const pgcApi = () => (window.CircCandidate && window.CircCandidate.api) || null;
const pgcStage = () => {
  const a = pgcApi(); if (!a) return false;
  a.setSpaces((prev) => prev.map((s) => ({ ...s, items: s.items.map((i) => {
    const c = PGC_CARDS.find((k) => k.url === i.url);
    if (!c) return i;
    if (c.id === pgcState.card) return { ...i, customTitle: c.custom };
    const n = { ...i }; delete n.customTitle; return n;
  }) })));
  return true;
};
const pgcScroll = () => setTimeout(() => {
  const c = PGC_CARDS.find((k) => k.id === pgcState.card);
  const el = [...document.querySelectorAll('article.circ-card')].find((a) => a.textContent.includes(c.custom));
  if (!el) return;
  const sc = document.querySelector('.circ-phone-screen');
  const y = el.getBoundingClientRect().top - 160;
  if (sc) sc.scrollBy({ top: y }); else window.scrollBy({ top: y });
}, 250);

const CanonTitleDialogC = window.CardTitleDialog;

const PgcEditor = ({ item, onSave, onCancel }) => {
  const opt = pgcState.opt;
  const opening = item.customTitle;
  const address = String(item.url || '').replace(/^https?:\/\//, '');
  const original = item.fetchFailed ? address : (item.title || address);
  const [draft, setDraft] = React.useState(opening);
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    const id = setTimeout(() => { const el = inputRef.current; if (el) { el.focus({ preventScroll: true }); const n = el.value.length; el.setSelectionRange(n, n); } }, 40);
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(id); window.removeEventListener('keydown', onKey); };
  }, []);
  const v = draft.trim();
  const empty = !v;
  const save = () => {
    if (empty) { const a = pgcApi(); if (a) window.circUntitle(a.setSpaces, item.id); onCancel(); return; }
    if (v === opening.trim()) { onCancel(); return; }
    onSave(v);
  };
  // The hint is there before any act: it tells the member how to go back.
  const named = item.fetchFailed
    ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'var(--color-fg-2)', wordBreak: 'break-all' }}>{address}</span>
    : <span style={{ color: 'var(--color-fg-2)' }}>{original}</span>;
  const hint = (margin) => (
    <p id="pgc-line" style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, lineHeight: 1.5, color: 'var(--color-fg-3)', margin, textWrap: 'pretty' }}>
      {opt === '01'
        ? 'Clear to restore.'
        : <React.Fragment>Clear it to go back to {named}.</React.Fragment>}
    </p>
  );
  return (
    <div role="dialog" aria-modal="true" aria-label="Edit title"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 130, background: 'var(--color-scrim)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', maxWidth: 400, width: '100%', boxShadow: 'var(--shadow-overlay)' }}>
        <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-2xl)', lineHeight: 1.3, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: '0 0 var(--space-5)' }}>Edit title</h2>
        {opt === '03' && hint('-12px 0 var(--space-4)')}
        <input ref={inputRef} value={draft} maxLength={window.CARD_TITLE_CAP} aria-label="Title"
          aria-describedby="pgc-line"
          placeholder={original} className={item.fetchFailed ? 'pgc-addr' : undefined}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); save(); } }}
          style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 16, lineHeight: 1.4, color: 'var(--color-fg-1)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-md)', padding: '12px 14px', minHeight: 44, background: 'var(--color-surface)', textOverflow: 'ellipsis' }} />
        {opt !== '03' && hint('8px 0 0')}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-5)' }}>
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" onClick={save}>Save</Button>
        </div>
      </div>
    </div>
  );
};
window.CardTitleDialog = (props) => (props.item.customTitle ? <PgcEditor {...props} /> : <CanonTitleDialogC {...props} />);

const PgcBar = () => {
  const [, force] = React.useState(0);
  const set = (k, v) => { pgcState[k] = v; pgcSave(); force((n) => n + 1); pgcStage(); pgcScroll(); };
  React.useEffect(() => {
    let tries = 0;
    const t = setInterval(() => {
      if (!pgcStage() && ++tries < 40) return;
      clearInterval(t);
      setTimeout(() => {
        if (document.querySelector('article.circ-card')) { pgcScroll(); return; }
        const row = [...document.querySelectorAll('button, a, [role="button"]')].find((b) => /^Backend Pod/.test((b.textContent || '').trim()));
        if (row) { row.click(); setTimeout(pgcScroll, 300); }
      }, 150);
    }, 100);
    return () => clearInterval(t);
  }, []);
  const cur = PGC_OPTS.find((o) => o.n === pgcState.opt) || PGC_OPTS[0];
  return (
    <div className="pg-bar">
      <div className="pg-bar-row">
        <div className="pg-seg" role="radiogroup" aria-label="Option">
          {PGC_OPTS.map((o) => (
            <button key={o.n} type="button" role="radio" aria-checked={o.n === cur.n} title={o.line}
              className="pg-seg-btn" data-on={o.n === cur.n ? '' : undefined} onClick={() => set('opt', o.n)}>
              <span className="pg-num">{o.n}</span>{o.name}
            </button>
          ))}
        </div>
        <label className="pg-card">
          <span>Card</span>
          <select value={pgcState.card} onChange={(e) => set('card', e.target.value)}>
            {PGC_CARDS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <button type="button" className="pg-restage" onClick={() => { pgcStage(); pgcScroll(); }} title="Put the custom title back on the card">Restage</button>
        </label>
      </div>
      <p className="pg-line">{cur.line}</p>
    </div>
  );
};

Object.assign(window, { PgcBar });
