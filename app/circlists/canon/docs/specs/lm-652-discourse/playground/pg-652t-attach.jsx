// ============================================================================
// LM-652 · attaching a thought — the pieces every option is drawn from.
//   PG652Row    — the row wrapper. Your own thoughtless card gets the option's
//                 affordance; every other card falls straight through to the
//                 shipped CandCardRow, untouched.
//   PG652Paper  — what rests under the card (a band, a bare edge, a field, or
//                 nothing) and the writing field it opens into.
//   PG652FootCtl — the foot-row pen (option 2) and menu (option 5).
// The card itself is the shipped FeedCard, handed in as children. Nothing here
// redraws it.
// ============================================================================

// Your own card, carrying no thought. Nobody else's card ever shows any of this.
const pg652Mine = (item) => !!item && /^added by you\b/i.test(item.attribution || '') && !item.thought && !item.pending;

// look, by option and surface. 'off' = nothing at all; 'none' = nothing at rest,
// the paper appears only once you are writing.
const PG652_LOOK = {
  band: { feed: 'band', surface: 'band' },
  pen: { feed: 'none', surface: 'none' },
  field: { feed: 'off', surface: 'field' },
  sliver: { feed: 'sliver', surface: 'sliver' },
  menu: { feed: 'none', surface: 'none' },
};

const pg652Attach = (api, item, text) => candUpdateItem(api, item.id, (i) => {
  const next = { ...i, thought: { by: 'You', text, at: Date.now() } };
  delete next.pg652Deleted;
  return next;
});

// ---- The paper -------------------------------------------------------------
// Tucked under the card exactly as the thought's band is: pulled up by the
// candidate's own overlap, inset by its own inset. Open, it is the app's writing
// field — the same field the Add popover and every turn use — at full width.
const PG652Paper = ({ item, api, look, writing, onOpen, onClose }) => {
  const [draft, setDraft] = React.useState('');
  if (look === 'off') return null;
  const open = writing || look === 'field';
  const send = () => { const t = draft.trim(); if (!t) return; pg652Attach(api, item, t); setDraft(''); onClose && onClose(); };
  if (open) {
    return (
      <div style={{ position: 'relative', zIndex: 0, margin: (-PG652_OVERLAP) + 'px 0 0', paddingTop: PG652_OVERLAP + 8,
        display: 'flex', alignItems: 'flex-start', gap: 6 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <CandWrite value={draft} onChange={setDraft} placeholder="Add a thought" ariaLabel="Add a thought"
            size={13.5} minLines={2} autoFocus={look !== 'field'} onSend={send} />
        </div>
        {look !== 'field' && (
          <button type="button" onClick={() => { setDraft(''); onClose(); }} className="cand-altclose" aria-label="Close" title="Close"
            style={{ flexShrink: 0, width: 34, height: 34, marginTop: 2, background: 'transparent', border: 0, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <CandCross size={15} />
          </button>
        )}
      </div>
    );
  }
  if (look === 'none') return null;
  const box = { position: 'relative', zIndex: 0, width: 'auto', textAlign: 'left',
    background: CAND_PAPER.bg, border: '1px solid ' + CAND_PAPER.bd, borderRadius: 'var(--radius-lg)',
    margin: (-PG652_OVERLAP) + 'px ' + PG652_INSET + 'px 0', cursor: 'pointer' };
  if (look === 'sliver') {
    return (
      <button type="button" className="cand-bandbtn" onClick={onOpen} aria-label="Add a thought" title="Add a thought"
        style={{ ...box, height: PG652_OVERLAP + 15, padding: 0 }} />
    );
  }
  return (
    <button type="button" className="cand-bandbtn" onClick={onOpen} aria-label="Add a thought"
      style={{ ...box, display: 'flex', alignItems: 'center', gap: 12, font: 'inherit',
        padding: (PG652_OVERLAP + 5) + 'px 16px 9px' }}>
      <span style={{ flex: 1, minWidth: 0, font: '400 12.5px/1.5 var(--font-sans)', color: 'var(--color-fg-2)' }}>Add a thought</span>
      <span className="cand-bandlines" style={{ display: 'inline-flex', flexShrink: 0 }}><Icon name="edit" size={14} /></span>
    </button>
  );
};

// ---- The foot-row controls -------------------------------------------------
// The shipped card's foot row is two 44px controls whose optical edge is pulled
// onto the card's content edge. These take the next slot to their left, so
// nothing shipped moves.
const PG652_FOOT = { position: 'absolute', right: 95, bottom: 16, zIndex: 3 };

const PG652FootPen = ({ on, onClick }) => (
  <button type="button" className="circ-cardaction circ-cardaction-icon" onClick={onClick}
    aria-label="Add a thought" aria-pressed={on} title="Add a thought"
    style={{ ...PG652_FOOT, color: on ? 'var(--color-fg-1)' : undefined }}>
    <Icon name="edit" size={17} />
  </button>
);

const PG652FootMenu = ({ onPick }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const away = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const key = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', key); };
  }, [open]);
  return (
    <div ref={ref} style={{ ...PG652_FOOT }}>
      <button type="button" className="circ-cardaction circ-cardaction-icon" onClick={() => setOpen(v => !v)}
        aria-haspopup="menu" aria-expanded={open} aria-label="This card" title="This card">
        <Icon name="more-vertical" size={17} />
      </button>
      {open && (
        <div role="menu" style={{ position: 'absolute', right: 0, bottom: 'calc(100% + 6px)', width: 190, zIndex: 60,
          background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-overlay)', padding: 4 }}>
          <button type="button" role="menuitem" className="circ-menuitem" onClick={() => { setOpen(false); onPick(); }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', background: 'transparent',
              border: 0, cursor: 'pointer', borderRadius: 'var(--radius-sm)', padding: '10px 10px', minHeight: 44,
              font: '500 13.5px/1.3 var(--font-sans)', color: 'var(--color-fg-1)' }}>
            <Icon name="edit" size={16} />Add a thought
          </button>
        </div>
      )}
    </div>
  );
};

// ---- The row ---------------------------------------------------------------
const PG652Row = ({ item, api, place, children }) => {
  const st = usePG652();
  const [writing, setWriting] = React.useState(false);
  React.useEffect(() => { setWriting(false); }, [st.opt, st.state]);
  const opt = st.opt;
  const deleted = st.state === 'deleted';
  // Option 4 is the one that draws its two states differently: a bare edge when
  // there has never been a thought, the same edge carrying one line when one was
  // just removed.
  const look = (opt === 'sliver' && deleted) ? 'band' : PG652_LOOK[opt][place];
  const ctl = opt === 'pen' ? 'pen' : opt === 'menu' ? 'menu' : null;
  const paper = look !== 'off' && (look !== 'none' || writing);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ position: 'relative', zIndex: 1, borderRadius: 'var(--radius-lg)',
        boxShadow: paper ? 'var(--shadow-raised)' : 'none' }}>
        {children}
        {ctl === 'pen' && <PG652FootPen on={writing} onClick={() => setWriting(v => !v)} />}
        {ctl === 'menu' && <PG652FootMenu onPick={() => setWriting(true)} />}
      </div>
      <PG652Paper item={item} api={api} look={look} writing={writing}
        onOpen={() => setWriting(true)} onClose={() => setWriting(false)} />
    </div>
  );
};

Object.assign(window, { pg652Mine, pg652Attach, PG652_LOOK, PG652Paper, PG652FootPen, PG652FootMenu, PG652Row });
