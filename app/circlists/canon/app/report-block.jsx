// ============================================================================
// Circlists — Report and Block (mobile-readiness delta, 5 Oct).
//
//   Report — someone else's link or comment. The house Form dialog with three
//            optional one-tap reasons; "Something else" opens a field. On
//            Report the button reads "Reported" for Share's 1600ms beat, the
//            dialog closes, focus returns to the menu trigger. The item stays;
//            its menu then reads "Reported" as a plain statement.
//   Block  — another member, from their row on Members. Account-wide: held on
//            the user (`user.blocked`, names), so it reaches every circle the
//            two share. Their cards and words leave this viewer's view; they
//            stay listed on Members as Blocked. Unblock takes no confirmation.
//
// The view is scoped through the app's one choke point, circViewerSpaces
// (main.jsx), the same door LM-666's delete-for-me uses, so a blocked
// member's card cannot show on one surface while gone from another.
// Report state rides the data: item.reported / turn.reported, persisted with
// the circles, so it survives a reload.
//
// DROPPABLE: remove this file's script tag and every Report and Block
// affordance goes; feed.jsx, talk-surface.jsx and spaces.jsx guard on window.
// ============================================================================

if (typeof LP_ICONS !== 'undefined') Object.assign(LP_ICONS, {
  flag: '<path d="M5 21V4"></path><path d="M5 4h11l-2 4 2 4H5"></path>',
  block: '<circle cx="12" cy="12" r="9"></circle><line x1="5.7" y1="5.7" x2="18.3" y2="18.3"></line>',
});

const rbNorm = (s) => String(s || '').trim().replace(/\.+$/, '').toLowerCase();
const rbFirst = (name) => String(name || '').trim().split(/\s+/)[0];
const rbWho = (item) => String((item && item.attribution) || '').replace(/^added by\s+/i, '');

// ---- the view: what a block takes out of THIS viewer's circles -------------
const rbScrubTalk = (item, hit) => {
  const talk = item.talk || [];
  if (!talk.some((t) => hit(t.by))) return item;
  const next = [];
  talk.forEach((t) => {
    if (!hit(t.by)) { next.push(t); return; }
    // A top-level turn of theirs that others answered keeps its row, so the
    // replies keep their place. Its words go; `deleted` keeps it out of every
    // count (returns bar, preview, New words) exactly as a removed turn is.
    const answered = !t.replyTo && talk.some((r) => r.replyTo === t.id && !hit(r.by));
    if (answered) next.push({ ...t, text: '', reactions: [], deleted: true, blockedForMe: true });
  });
  return { ...item, talk: next };
};

const rbBaseView = window.circViewerSpaces;
window.circViewerSpaces = (spaces, user) => {
  const base = rbBaseView ? rbBaseView(spaces, user) : spaces;
  const bl = (user && user.blocked) || [];
  window.__rbBlocked = bl;
  if (!bl.length) return base;
  const hit = (name) => bl.some((b) => rbNorm(b) === rbNorm(name));
  return base.map((s) => {
    const items = s.items.filter((i) => !hit(rbWho(i))).map((i) => rbScrubTalk(i, hit));
    const pending = (s.pending || []).filter((i) => !hit(rbWho(i)));
    const mark = s.lastSeenAt || 0;
    const arrivals = pending.length > 0 || items.some((i) => !i.read && i.at && i.at > mark);
    return { ...s, items, pending, unseen: !!s.unseen && arrivals };
  });
};
// The contributor filter offers members; a blocked one is not offered.
const rbBaseContrib = window.circContributors;
if (rbBaseContrib) window.circContributors = (space) => rbBaseContrib(space)
  .filter((w) => !(window.__rbBlocked || []).some((b) => rbNorm(b) === rbNorm(w)));

// ---- the store: main.jsx binds user + setters each render ------------------
const rbDlg = { open: null, subs: new Set() };
const rbSetDlg = (d) => { rbDlg.open = d; rbDlg.subs.forEach((f) => f()); };
const rbMapItem = (setSpaces, itemId, fn) => setSpaces((prev) => prev.map((s) => (
  s.items.some((i) => i.id === itemId) ? { ...s, items: s.items.map((i) => (i.id === itemId ? fn(i) : i)) } : s)));

window.CircRB = {
  api: null,
  bind(api) { this.api = api; },
  blocked() { const u = this.api && this.api.user; return (u && u.blocked) || []; },
  isBlocked(name) { return this.blocked().some((b) => rbNorm(b) === rbNorm(name)); },
  block(name) { this.api.setUser((u) => ({ ...u, blocked: [...((u.blocked) || []).filter((b) => rbNorm(b) !== rbNorm(name)), name] })); },
  unblock(name) { this.api.setUser((u) => ({ ...u, blocked: ((u.blocked) || []).filter((b) => rbNorm(b) !== rbNorm(name)) })); },
  openReport(d) { rbSetDlg({ ...d, key: Date.now() }); },
  // No failure state is drawn: a report that fails to send changes nothing on screen.
  markReported({ itemId, turnId }) {
    const set = this.api.setSpaces;
    if (turnId) rbMapItem(set, itemId, (i) => ({ ...i, talk: (i.talk || []).map((t) => (t.id === turnId ? { ...t, reported: true } : t)) }));
    else rbMapItem(set, itemId, (i) => ({ ...i, reported: true }));
  },
};

// ---- the menu rows -----------------------------------------------------------
const rbRow = {
  display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
  background: 'transparent', border: 0, cursor: 'pointer', padding: '11px 10px', minHeight: 44,
  borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14,
  color: 'var(--color-fg-1)', whiteSpace: 'nowrap',
};
// Reported: a statement in the slot, never a disabled control. It keeps Report
// link's flag, in the warm tertiary grey (board pg-not-subscribed D.02, owner 5 Oct).
const RbReportedRow = ({ style }) => (
  <div role="menuitem" aria-disabled="true" tabIndex={-1} style={{ ...rbRow, ...style, cursor: 'default', color: 'var(--color-fg-3)' }}>
    <Icon name="flag" size={16} /> Reported
  </div>
);
// In the card's kebab, below the rule and above Delete. Ordinary ink.
const CircReportMenuItem = ({ item, onOpen }) => (item.reported ? <RbReportedRow /> : (
  <button type="button" role="menuitem" className="circ-menuitem" style={rbRow} onClick={onOpen}>
    <Icon name="flag" size={16} /> Report link
  </button>
));

// Someone else's comment: the same quiet glyph your own comments carry, holding one row.
const RB_MENU_W = 180;
const CircReportTurnMenu = ({ item, t }) => {
  const [open, setOpen] = React.useState(false);
  const [flip, setFlip] = React.useState(false);
  const ref = React.useRef(null);
  const btn = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const away = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const key = (e) => { if (e.key === 'Escape') { setOpen(false); btn.current && btn.current.focus({ preventScroll: true }); } };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', key); };
  }, [open]);
  return (
    <span ref={ref} style={{ position: 'relative', flexShrink: 0, alignSelf: 'center' }}>
      <button type="button" ref={btn} className="cand-quiet" aria-haspopup="menu" aria-expanded={open}
        aria-label={'About ' + t.by + '\u2019s comment'} title="More"
        onClick={() => setOpen((o) => {
          if (!o && btn.current) setFlip(btn.current.getBoundingClientRect().left + RB_MENU_W > window.innerWidth - 8);
          return !o;
        })}
        style={{ background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--color-fg-3)',
          minHeight: 44, minWidth: 44, padding: 12, margin: '-12px -10px -12px -6px', borderRadius: 'var(--radius-sm)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" style={{ display: 'block' }}>
          <circle cx="5.5" cy="12" r="1.6" fill="currentColor" /><circle cx="12" cy="12" r="1.6" fill="currentColor" /><circle cx="18.5" cy="12" r="1.6" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <div role="menu" style={{ position: 'absolute', top: 'calc(100% + 4px)', left: flip ? 'auto' : 0, right: flip ? 0 : 'auto', zIndex: 20, minWidth: RB_MENU_W,
          background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-overlay)', padding: 6 }}>
          {t.reported ? <RbReportedRow style={{ padding: '0 14px' }} /> : (
            <button type="button" role="menuitem" className="circ-menuitem" style={{ ...rbRow, padding: '0 14px' }}
              onClick={() => { setOpen(false); btn.current && btn.current.focus({ preventScroll: true }); window.CircRB.openReport({ kind: 'comment', itemId: item.id, turnId: t.id }); }}>
              <Icon name="flag" size={16} /> Report comment
            </button>
          )}
        </div>
      )}
    </span>
  );
};

// ---- the Report dialog: the house Form dialog (Edit title's shell) ---------
const RB_REASONS = ['Spam', 'Offensive or abusive', 'Something else'];
const RB_BEAT = 1600; // Share's "Link copied" beat (app/card-share.jsx)
const RbReportDialog = ({ kind, onReport, onClose }) => {
  const [reason, setReason] = React.useState(null);
  const [note, setNote] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const firstRef = React.useRef(null);
  const noteRef = React.useRef(null);
  const invokerRef = React.useRef(null);
  const timer = React.useRef(null);
  React.useEffect(() => {
    // Captured on the timer: the menu hands focus back to its trigger in the
    // same commit that opens this, and that trigger is where focus returns.
    const id = setTimeout(() => {
      invokerRef.current = document.activeElement;
      firstRef.current && firstRef.current.focus({ preventScroll: true });
    }, 40);
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(id); clearTimeout(timer.current); window.removeEventListener('keydown', onKey);
      const inv = invokerRef.current;
      if (inv && inv.isConnected && inv.focus) inv.focus({ preventScroll: true });
    };
  }, []);
  React.useEffect(() => { if (reason === 'Something else' && noteRef.current) noteRef.current.focus({ preventScroll: true }); }, [reason]);
  const report = () => {
    if (sent) return;
    setSent(true);
    onReport({ reason, note: reason === 'Something else' ? note.trim() : '' });
    timer.current = setTimeout(onClose, RB_BEAT);
  };
  const title = kind === 'comment' ? 'Report this comment?' : 'Report this link?';
  return (
    <div role="dialog" aria-modal="true" aria-label={title}
      onClick={(e) => { if (e.target === e.currentTarget && !sent) onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 130, background: 'var(--color-scrim)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} className="circ-anim-fade">
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', maxWidth: 400, width: '100%', boxShadow: 'var(--shadow-overlay)' }}>
        <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-2xl)', lineHeight: 1.3, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: '0 0 var(--space-5)' }}>{title}</h2>
        <div role="radiogroup" aria-label="Reason" className="circ-rb-reasons">
          {RB_REASONS.map((r, i) => (
            <button key={r} ref={i === 0 ? firstRef : undefined} type="button" role="radio" aria-checked={reason === r}
              className="circ-rb-chip" onClick={() => setReason((cur) => (cur === r ? null : r))}>{r}</button>
          ))}
        </div>
        {reason === 'Something else' && (
          <textarea ref={noteRef} value={note} maxLength={500} rows={3} aria-label="Something else"
            placeholder="Say what it is, or leave it blank." onChange={(e) => setNote(e.target.value)}
            className="circ-rb-note" />
        )}
        <div className="circ-dlg-act" style={{ marginTop: 'var(--space-6)' }}>
          <Button variant="secondary" onClick={() => { if (!sent) onClose(); }}>Cancel</Button>
          <Button variant="primary" onClick={report} icon={sent ? <Icon name="check" size={16} /> : null}>{sent ? 'Reported' : 'Report'}</Button>
        </div>
      </div>
    </div>
  );
};

// Mounted once, in main.jsx's overlay layer, so it sits inside the phone screen.
const CircRBHost = () => {
  const [, force] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => { rbDlg.subs.add(force); return () => { rbDlg.subs.delete(force); }; }, []);
  const d = rbDlg.open;
  if (!d) return null;
  return <RbReportDialog key={d.key} kind={d.kind}
    onReport={() => window.CircRB.markReported({ itemId: d.itemId, turnId: d.turnId })}
    onClose={() => rbSetDlg(null)} />;
};

// ---- the Block confirmation: Remove member's shell -------------------------
// Two named exceptions to rationed confirmation (owner, 5 Oct): Report and Block
// each confirm, and neither offers undo. Block takes the house primary, not red:
// it removes nothing and is undone in one press from the same row.
const CircBlockDialog = ({ member, returnTo, onConfirm, onCancel }) => {
  const cancelRef = React.useRef(null);
  React.useEffect(() => {
    const id = setTimeout(() => cancelRef.current && cancelRef.current.focus(), 40);
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => { clearTimeout(id); window.removeEventListener('keydown', onKey); if (returnTo && returnTo.isConnected) returnTo.focus({ preventScroll: true }); };
  }, []);
  const n = rbFirst(member.name);
  return (
    <div role="alertdialog" aria-modal="true" aria-label={'Block ' + n + '?'}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 130, background: 'var(--color-scrim)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} className="circ-anim-fade">
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', maxWidth: 400, width: '100%', boxShadow: 'var(--shadow-overlay)' }}>
        <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-2xl)', lineHeight: 1.3, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: '0 0 8px' }}>Block {n}?</h2>
        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 15, lineHeight: 1.55, color: 'var(--color-fg-2)', margin: '0 0 var(--space-6)', textWrap: 'pretty' }}>
          You won’t see {n}’s links or comments in any circle you share. {n} won’t be told, and can still see yours.
        </p>
        <div className="circ-dlg-act">
          <Button ref={cancelRef} variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" onClick={onConfirm}>Block</Button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { CircReportMenuItem, CircReportTurnMenu, CircRBHost, CircBlockDialog, rbFirst });
