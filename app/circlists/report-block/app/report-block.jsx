// ---- Candidate: report and block (mobile readiness M5) ----------------------
// Not ratified. Built outside Claude Design as a candidate rail node, to put the
// options on the business-ops design-areas proposal in front of the owner.
//
// What it adds, all for the viewer only:
//   - "Report link" in the card menu on someone else's link, and a new ⋯ on
//     someone else's comment holding "Report comment".
//   - A report panel: optional one-tap reason, then the link or comment is
//     hidden for the reporter. A note confirms, offers Undo, and offers to hide
//     all of that member's links.
//   - "Hide their links": that member's links and comments disappear for you in
//     every circle you share. They are not told. Undo from the Members screen.
//   - Variant "members-only" (the page's alternative): no item report; a single
//     "Report <name>" on the Members screen.
//
// State is a small store on window, read through useRB() so every surface
// re-renders when it changes. The feed reads it through CircViewerSpaces, the
// one viewer-scope bridge main.jsx already offers.

LP_ICONS.flag = '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>';
LP_ICONS['eye-off'] = '<path d="M3 3l18 18"/><path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c5 0 9 6 9 6a16 16 0 0 1-2.6 3.2"/><path d="M6.6 6.6C4.3 8.1 3 12 3 12s4 6 9 6a8.6 8.6 0 0 0 4.4-1.2"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>';
LP_ICONS.eye = '<path d="M3 12s4-6 9-6 9 6 9 6-4 6-9 6-9-6-9-6z"/><circle cx="12" cy="12" r="3"/>';

const RB_EMPTY = { variant: 'item', hidden: [], hiddenItems: [], hiddenTurns: [], panel: null, note: null };
const RB = { s: { ...RB_EMPTY }, subs: new Set() };
const rbSet = (patch) => { RB.s = { ...RB.s, ...(typeof patch === 'function' ? patch(RB.s) : patch) }; RB.subs.forEach((f) => f()); };
const rbReset = (patch) => { RB.s = { ...RB_EMPTY, ...(patch || {}) }; RB.subs.forEach((f) => f()); };
const useRB = () => React.useSyncExternalStore((f) => { RB.subs.add(f); return () => RB.subs.delete(f); }, () => RB.s);

const rbWho = (item) => ((item && item.attribution) || '').replace(/^added by\s+/i, '').replace(/\.$/, '.').trim();
const rbFirst = (name) => (name || '').split(' ')[0];
const rbIsYou = (name) => /^you$/i.test(name || '');

// Viewer scope: base rule (delete for me) first, then this candidate's hides.
const rbViewerSpaces = (spaces, user) => {
  const base = window.circViewerSpaces ? window.circViewerSpaces(spaces, user) : spaces;
  const { hidden, hiddenItems, hiddenTurns } = RB.s;
  if (!hidden.length && !hiddenItems.length && !hiddenTurns.length) return base;
  const keep = (i) => !hiddenItems.includes(i.id) && !hidden.includes(rbWho(i));
  return base.map((s) => ({
    ...s,
    items: s.items.filter(keep).map((i) => (i.talk
      ? { ...i, talk: i.talk.filter((t) => !hidden.includes(t.by) && !hiddenTurns.includes(t.id)) } : i)),
    pending: (s.pending || []).filter(keep),
  }));
};
window.CircViewerSpaces = rbViewerSpaces;

const rbItemBase = {
  display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
  background: 'transparent', border: 0, cursor: 'pointer', padding: '11px 10px', minHeight: 44,
  borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14,
  color: 'var(--color-fg-1)', whiteSpace: 'nowrap',
};

// Card menu row, someone else's link only. Absent under the members-only variant.
const RBReportMenuItem = ({ item, onDone }) => {
  const rb = useRB();
  const who = rbWho(item);
  if (rb.variant !== 'item' || rbIsYou(who)) return null;
  return (
    <button role="menuitem" className="circ-menuitem" style={rbItemBase}
      onClick={() => { onDone && onDone(); rbSet({ panel: { kind: 'link', id: item.id, who } }); }}>
      <Icon name="flag" size={16} style={{ color: 'var(--color-fg-2)' }} /> Report link
    </button>
  );
};

// The ⋯ on someone else's comment. Today only your own comments carry one.
const RBTurnMenu = ({ t }) => {
  const rb = useRB();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const away = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', away);
    return () => document.removeEventListener('mousedown', away);
  }, [open]);
  if (rb.variant !== 'item') return null;
  return (
    <span ref={ref} style={{ position: 'relative', flexShrink: 0, alignSelf: 'center' }}>
      <button type="button" className="cand-quiet" aria-haspopup="menu" aria-expanded={open}
        aria-label={'More for ' + t.by + '’s comment'} onClick={() => setOpen((o) => !o)}
        style={{ background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--color-fg-3)',
          minHeight: 44, minWidth: 44, padding: 12, margin: '-12px -10px -12px -6px', borderRadius: 'var(--radius-sm)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" style={{ display: 'block' }}>
          <circle cx="5.5" cy="12" r="1.6" fill="currentColor" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" />
          <circle cx="18.5" cy="12" r="1.6" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <div role="menu" style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 20, minWidth: 180,
          background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-overlay)', padding: 6 }}>
          <button type="button" role="menuitem" className="circ-menuitem" style={rbItemBase}
            onClick={() => { setOpen(false); rbSet({ panel: { kind: 'comment', id: t.id, who: t.by } }); }}>
            <Icon name="flag" size={16} style={{ color: 'var(--color-fg-2)' }} /> Report comment
          </button>
        </div>
      )}
    </span>
  );
};

const RB_REASONS = ['Spam', 'Offensive or abusive', 'Something else'];

// Report panel and the hide-their-links confirm. House confirm shell.
const RBPanel = ({ panel }) => {
  const [reason, setReason] = React.useState(null);
  const close = () => rbSet({ panel: null });
  const first = rbFirst(panel.who);
  if (panel.kind === 'hide') {
    return (
      <div className="circ-confirm-scrim" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
        <div className="circ-confirm-panel" role="alertdialog" aria-modal="true" aria-labelledby="rb-title">
          <h2 id="rb-title" className="circ-confirm-title">Hide {panel.who}{'’'}s links?</h2>
          <p className="circ-confirm-sub">Their links and comments disappear for you, in every circle you share with them. {first} isn{'’'}t told. You can show them again from Members.</p>
          <div className="circ-confirm-stack">
            <Button variant="destructive-secondary" full onClick={() => rbSet((s) => ({
              panel: null, hidden: [...s.hidden, panel.who], note: { kind: 'hidden', who: panel.who } }))}>Hide their links</Button>
            <Button variant="secondary" full onClick={close}>Cancel</Button>
          </div>
        </div>
      </div>
    );
  }
  const noun = panel.kind === 'member' ? first : (panel.kind === 'comment' ? 'this comment' : 'this link');
  const submit = () => rbSet((s) => {
    if (panel.kind === 'link') return { panel: null, hiddenItems: [...s.hiddenItems, panel.id], note: { kind: 'reported', what: 'link', id: panel.id, who: panel.who } };
    if (panel.kind === 'comment') return { panel: null, hiddenTurns: [...s.hiddenTurns, panel.id], note: { kind: 'reported', what: 'comment', id: panel.id, who: panel.who } };
    return { panel: null, note: { kind: 'reported', what: 'member', who: panel.who } };
  });
  return (
    <div className="circ-confirm-scrim" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="circ-confirm-panel" role="dialog" aria-modal="true" aria-labelledby="rb-title">
        <h2 id="rb-title" className="circ-confirm-title">Report {noun}?</h2>
        <p className="circ-confirm-sub">
          {panel.kind === 'member'
            ? <>It goes to the Circlists team. {first} isn{'’'}t told, and nothing changes in the circle.</>
            : <>It goes to the Circlists team and is hidden for you. {first} isn{'’'}t told, and everyone else still sees it.</>}
        </p>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--color-fg-2)', margin: 'var(--space-4) 0 var(--space-2)' }}>
          Why? <span style={{ fontWeight: 400, color: 'var(--color-fg-3)' }}>Optional</span>
        </div>
        <div role="radiogroup" aria-label="Reason" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {RB_REASONS.map((r) => (
            <button key={r} type="button" role="radio" aria-checked={reason === r} onClick={() => setReason(reason === r ? null : r)}
              style={{ minHeight: 36, padding: '0 14px', borderRadius: 999, cursor: 'pointer',
                fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13.5,
                border: '1px solid ' + (reason === r ? 'var(--color-fg-1)' : 'var(--color-border-1)'),
                background: reason === r ? 'var(--color-fg-1)' : 'var(--color-surface)',
                color: reason === r ? 'var(--color-surface)' : 'var(--color-fg-1)' }}>{r}</button>
          ))}
        </div>
        <div className="circ-confirm-stack">
          <Button variant="primary" full onClick={submit}>Report</Button>
          <Button variant="secondary" full onClick={close}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

// The note after an act. Held until closed, so the undo stays in reach.
const RBNote = ({ note }) => {
  const done = () => rbSet({ note: null });
  const undo = () => rbSet((s) => {
    if (note.kind === 'hidden') return { note: null, hidden: s.hidden.filter((n) => n !== note.who) };
    if (note.what === 'link') return { note: null, hiddenItems: s.hiddenItems.filter((i) => i !== note.id) };
    if (note.what === 'comment') return { note: null, hiddenTurns: s.hiddenTurns.filter((i) => i !== note.id) };
    return { note: null };
  });
  const first = rbFirst(note.who);
  const text = note.kind === 'hidden'
    ? <>{note.who}{'’'}s links are hidden for you.</>
    : note.what === 'member' ? <>Reported. Thanks for telling us.</>
    : <>Reported. The {note.what} is hidden for you.</>;
  const link = { background: 'transparent', border: 0, cursor: 'pointer', padding: '0 4px', minHeight: 44,
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--color-accent-on-dark, #9fd3b4)' };
  return ReactDOM.createPortal(
    <div role="status" style={{ position: 'fixed', left: 12, right: 12, bottom: 'calc(16px + env(safe-area-inset-bottom))', zIndex: 200,
      background: 'var(--color-fg-1)', color: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-overlay)', padding: '6px 8px 6px 16px', fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ flex: 1, padding: '10px 0' }}>{text}</span>
        {note.what !== 'member' && <button type="button" style={link} onClick={undo}>Undo</button>}
        <button type="button" aria-label="Close" onClick={done} style={{ ...link, minWidth: 40, color: 'inherit', opacity: 0.7 }}>
          <Icon name="x" size={16} />
        </button>
      </div>
      {note.kind === 'reported' && note.what !== 'member' && !RB.s.hidden.includes(note.who) && (
        <div style={{ borderTop: '1px solid color-mix(in srgb, var(--color-surface) 20%, transparent)', marginTop: 2 }}>
          <button type="button" style={{ ...link, padding: '0', color: 'inherit', fontWeight: 500 }}
            onClick={() => rbSet({ note: null, panel: { kind: 'hide', who: note.who } })}>
            Hide all of {first}{'’'}s links and comments{'…'}
          </button>
        </div>
      )}
    </div>,
    document.querySelector('.circ-phone-screen') || document.body
  );
};

const RBLayer = () => {
  const rb = useRB();
  return <>{rb.panel && <RBPanel key={rb.panel.kind + rb.panel.id} panel={rb.panel} />}{rb.note && !rb.panel && <RBNote note={rb.note} />}</>;
};

// Members screen: what a row says and holds once the viewer can hide a member.
const RBMemberLine = ({ name }) => {
  const rb = useRB();
  if (!rb.hidden.includes(name)) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--color-fg-3)' }}>
      <Icon name="eye-off" size={13} /> Links hidden for you
    </div>
  );
};
const RBMemberMenuItems = ({ m, onDone }) => {
  const rb = useRB();
  const isHidden = rb.hidden.includes(m.name);
  return (
    <>
      {rb.variant === 'members-only' && (
        <button role="menuitem" className="circ-menuitem" style={{ ...rbItemBase, padding: '9px 10px', minHeight: 40 }}
          onClick={() => { onDone(); rbSet({ panel: { kind: 'member', who: m.name } }); }}>
          <Icon name="flag" size={16} style={{ color: 'var(--color-fg-2)' }} /> Report {rbFirst(m.name)}
        </button>
      )}
      <button role="menuitem" className="circ-menuitem" style={{ ...rbItemBase, padding: '9px 10px', minHeight: 40 }}
        onClick={() => { onDone(); isHidden
          ? rbSet((s) => ({ hidden: s.hidden.filter((n) => n !== m.name), note: null }))
          : rbSet({ panel: { kind: 'hide', who: m.name } }); }}>
        <Icon name={isHidden ? 'eye' : 'eye-off'} size={16} style={{ color: 'var(--color-fg-2)' }} /> {isHidden ? 'Show their links' : 'Hide their links'}
      </button>
    </>
  );
};

Object.assign(window, { RB, rbSet, rbReset, useRB, RBReportMenuItem, RBTurnMenu, RBLayer, RBMemberLine, RBMemberMenuItems });
