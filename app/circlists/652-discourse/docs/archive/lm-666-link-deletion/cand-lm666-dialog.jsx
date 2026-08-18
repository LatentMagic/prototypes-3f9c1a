// ============================================================================
// LM-666 candidate — the delete dialog offers two reaches.
//
// FORM (playground pg-lm666-dialogs, shape 2b): the house confirm, with its
// single primary replaced by a stack of the app's own full-width buttons. Not a
// bottom sheet — every confirm here is a centred dialog, and the app posture
// reserves the sheet for Add alone (MOBILE.md), so a sheet would split the
// confirm pattern three ways to buy nothing.
//
// NO DEFAULT ACT, and this is the load-bearing decision: Windows, macOS and
// GNOME all hold that the default button must be the safest option when the act
// is destructive — the default must never be the one that performs it, and where
// no button is fit to be default, none is set. So neither reach is filled: both
// are the house destructive-secondary (outlined, danger in the label), Cancel is
// the plain secondary beneath them and holds the focus, so Return dismisses.
// Nothing in the panel is ranked; the words carry the difference in reach.
//
// ONE SHAPE, TWO CASES: a member who holds only "Delete for me" gets the same
// panel with one act instead of two, and the body line changes from the choice
// ("Choose how far this goes.") to the consequence — which lands them on the
// house confirm exactly, with the ratified label on the button.
//
// The other confirms in the app (leave, cancel-funding, delete-account) are
// single-outcome and untouched: every other kind delegates to the primitive.
// ============================================================================
const Lm666ShippedConfirm = window.ConfirmDialog;

// Labels are ratified and fixed. The two lines are mine: the reach first, then
// what remains, so the pair differ on the one axis being chosen on.
const LM666_COPY = {
  title: 'Delete this link?',
  choose: 'Choose how far this goes.',
  me: { label: 'Delete for me', line: 'It goes from your list. Everyone else keeps it.' },
  all: { label: 'Delete for everyone', line: 'It goes from the whole circle, for good.' },
};

const Lm666DeleteDialog = ({ item, onDeleteForEveryone, onClose }) => {
  const api = (window.CAND666 && window.CAND666.api) || {};
  // Absent, never disabled: the act is simply not rendered for a member who does
  // not hold it.
  const wide = window.cand666HoldsForEveryone(item, api.space);
  const panelRef = React.useRef(null);
  const cancelRef = React.useRef(null);
  const invokerRef = React.useRef(null);
  const committed = React.useRef(false);

  React.useEffect(() => {
    invokerRef.current = document.activeElement;
    const id = setTimeout(() => cancelRef.current && cancelRef.current.focus({ preventScroll: true }), 40);
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const p = panelRef.current;
      if (!p) return;
      const f = p.querySelectorAll('button');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus({ preventScroll: true }); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus({ preventScroll: true }); }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(id);
      window.removeEventListener('keydown', onKey);
      // Dismissed → focus returns to the trigger. Taken → the trigger went with
      // the card, so focus lands on the feed rather than falling to the document.
      if (committed.current) {
        const m = document.querySelector('main');
        if (m) { m.setAttribute('tabindex', '-1'); m.focus({ preventScroll: true }); }
      } else if (invokerRef.current && invokerRef.current.focus) {
        invokerRef.current.focus({ preventScroll: true });
      }
    };
  }, []);

  const take = (fn) => { committed.current = true; fn(); };

  return (
    <div className="cand666-scrim" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={panelRef} className="cand666-panel" role="alertdialog" aria-modal="true"
        aria-labelledby="cand666-title" aria-describedby="cand666-sub">
        <h2 id="cand666-title" className="cand666-title">{LM666_COPY.title}</h2>
        <p id="cand666-sub" className="cand666-sub">{wide ? LM666_COPY.choose : LM666_COPY.me.line}</p>
        <div className="cand666-stack">
          <Button variant="destructive-secondary" full
            onClick={() => take(() => { window.cand666DeleteForMe(item); onClose(); })}>{LM666_COPY.me.label}</Button>
          {wide && <Button variant="destructive-secondary" full
            onClick={() => take(() => onDeleteForEveryone())}>{LM666_COPY.all.label}</Button>}
          <Button ref={cancelRef} variant="secondary" full onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

// Re-published over the shipped name: only the delete kind changes shape, every
// other confirm in the app renders the primitive verbatim.
const Cand666Confirm = (props) => {
  if (props.kind !== 'delete' || !props.item) return <Lm666ShippedConfirm {...props} />;
  return <Lm666DeleteDialog item={props.item} onDeleteForEveryone={props.onConfirm} onClose={props.onCancel} />;
};

Object.assign(window, { ConfirmDialog: Cand666Confirm, Lm666DeleteDialog });
