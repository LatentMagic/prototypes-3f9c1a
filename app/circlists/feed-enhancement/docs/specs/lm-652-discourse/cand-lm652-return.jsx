// ============================================================================
// LM-652 candidate — the return banner (item 6). W4 from pg-return-v12, carried
// over with its copy rewritten for the new destination: it stands at the head
// of BOTH feeds, names who has spoken on cards you are watching (no digit when
// collapsed — the product shows counts nowhere), and expands in place to the
// cards themselves; picking one opens that card's conversation surface.
// The circular chevron target was not carried: no other control in the product
// is a circle, so the house shape (radius-md box) stands instead — flagged.
// ============================================================================
const CandFeedLead = ({ api }) => {
  const [open, setOpen] = React.useState(false);
  const sp = api && api.space;
  if (!sp) return null;
  // Item 2 (ratified 2026-08-19): a watched card is named here only once it has
  // been MARKED READ. Contributing still watches the card — you do not opt in to
  // hear about conversation on a thing you shared — but hearing about it starts
  // at the mark, which keeps whole the rule that a conversation is unreachable on
  // a card you have not read. Nothing is lost, only held until the mark.
  const wanted = sp.items.filter(i => i.watching && i.read && candFresh(i).length > 0);
  if (!wanted.length) return null;
  const names = [];
  wanted.forEach(i => candFresh(i).forEach(t => { if (!names.includes(t.by)) names.push(t.by); }));
  const line = candNames(names) + ' spoke on cards you are watching';
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-raised)', overflow: 'hidden',
      // Restores the New pill's parked geometry when both stand (it cancels the
      // feed's top padding assuming it sits first).
      marginBottom: 'max(0px, calc(var(--circ-feed-pad-top, 16px) - 16px))' }}>
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} className="circ-menuitem"
        style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 56, padding: '0 12px 0 14px',
          background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left' }}>
        <span aria-hidden="true" style={{ width: 3, height: 22, borderRadius: 2, background: 'var(--color-sage)', flexShrink: 0 }} />
        <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: '600 14px/1.35 var(--font-sans)', color: 'var(--color-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{line}</span>
          <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>
            {open ? 'Pick one to open its conversation' : 'See what they said'}
          </span>
        </span>
        <span aria-hidden="true" style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--color-fg-2)', transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform var(--duration-base) var(--ease-quiet)' }}>
          <Icon name="chevron-down" size={16} />
        </span>
      </button>
      {open && (
        <div style={{ borderTop: '1px solid var(--color-border-2)', padding: '4px 6px 6px' }}>
          {wanted.map(i => {
            const who = [];
            candFresh(i).forEach(t => { if (!who.includes(t.by)) who.push(t.by); });
            return (
              <button key={i.id} type="button" className="circ-menuitem"
                onClick={() => { const C = window.CircCandidate; if (C && C.goToCard) C.goToCard(i); }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                  background: 'transparent', border: 0, cursor: 'pointer', minHeight: 48, padding: '7px 8px', borderRadius: 'var(--radius-md)',
                  borderTop: '1px solid var(--color-border-2)', borderTopColor: 'var(--color-border-2)' }}
                data-cand-listrow="">
                <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* No title: the address IS the name, set in mono as the card
                      sets it (app/feed.jsx:134) — one treatment for a title-less
                      link wherever it is named. */}
                  <span style={{ font: i.title ? '600 13.5px/1.35 var(--font-sans)' : '600 12.5px/1.45 var(--font-mono)', color: 'var(--color-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candTitleOf(i)}</span>
                  <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--color-fg-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candNames(who)}</span>
                </span>
                <Icon name="chevron-right" size={16} color="var(--color-fg-3)" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

Object.assign(window, { CandFeedLead });
