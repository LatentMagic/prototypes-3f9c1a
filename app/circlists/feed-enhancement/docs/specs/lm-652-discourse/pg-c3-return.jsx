// ============================================================================
// C3 — the five return affordances. One component, five bodies, each fed the
// same data the candidate's own lead is fed: the cards being watched that have
// moved, and who spoke on each.
// ============================================================================
const pgc3Go = (i) => { const C = window.CircCandidate; if (C && C.goToCard) C.goToCard(i); };
const pgc3Who = (i) => { const n = []; candFresh(i).forEach(t => { if (!n.includes(t.by)) n.push(t.by); }); return n; };

// 1 · One line. The names of the cards are the affordance; there is nothing else.
const PGC3One = ({ wanted, names }) => (
  <p style={{ margin: '2px 2px 0', font: '400 13.5px/1.6 var(--font-sans)', color: 'var(--color-fg-2)', textWrap: 'pretty' }}>
    <span style={{ fontWeight: 600, color: 'var(--color-fg-1)' }}>{candNames(names)}</span> spoke on{' '}
    {wanted.map((i, n) => (
      <React.Fragment key={i.id}>
        {n > 0 && (n === wanted.length - 1 ? ' and ' : ', ')}
        <button type="button" className="circ-doorlink pgc3-inline" onClick={() => pgc3Go(i)}
          style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer', font: 'inherit', fontWeight: 600 }}>
          {candTitleOf(i)}
        </button>
      </React.Fragment>
    ))}.
  </p>
);

// 2 · Rule. The waterline's own grammar — a label on a hairline, and the cards
// beneath it as plain rows. No open and closed state to design.
const PGC3Rule = ({ wanted }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <div className="circ-fdiv"><span className="circ-fdiv-label">spoken on since you looked</span></div>
    {wanted.map(i => (
      <button key={i.id} type="button" className="circ-menuitem pgc3-row" onClick={() => pgc3Go(i)}
        style={{ display: 'flex', alignItems: 'baseline', gap: 10, width: '100%', textAlign: 'left', background: 'transparent',
          border: 0, cursor: 'pointer', minHeight: 44, padding: '8px 8px 8px 0', borderRadius: 'var(--radius-md)' }}>
        <span style={{ flex: 1, minWidth: 0, font: '600 13.5px/1.4 var(--font-sans)', color: 'var(--color-fg-1)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candTitleOf(i)}</span>
        <span style={{ flexShrink: 0, font: '400 12px/1.4 var(--font-sans)', color: 'var(--color-fg-3)' }}>{candNames(pgc3Who(i))}</span>
      </button>
    ))}
  </div>
);

// 3 · Card, tightened. The same object, with the sub-line gone, the chevron
// unboxed, and the names said ONCE — at the head, so the rows carry only titles.
const PGC3Card = ({ wanted, names }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-raised)', overflow: 'hidden',
      marginBottom: 'max(0px, calc(var(--circ-feed-pad-top, 16px) - 16px))' }}>
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} className="circ-menuitem"
        style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 52, padding: '0 14px',
          background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left' }}>
        <span aria-hidden="true" style={{ width: 3, height: 20, borderRadius: 2, background: 'var(--color-sage)', flexShrink: 0 }} />
        <span style={{ flex: 1, minWidth: 0, font: '600 14px/1.35 var(--font-sans)', color: 'var(--color-fg-1)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {candNames(names)} spoke on cards you are watching
        </span>
        <span aria-hidden="true" style={{ flexShrink: 0, color: 'var(--color-fg-3)', display: 'inline-flex',
          transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base) var(--ease-quiet)' }}>
          <Icon name="chevron-down" size={18} />
        </span>
      </button>
      {open && (
        <div style={{ borderTop: '1px solid var(--color-border-2)', padding: '4px 6px 6px' }}>
          {wanted.map(i => (
            <button key={i.id} type="button" className="circ-menuitem" onClick={() => pgc3Go(i)}
              style={{ display: 'flex', alignItems: 'center', width: '100%', textAlign: 'left', background: 'transparent',
                border: 0, cursor: 'pointer', minHeight: 44, padding: '8px 8px', borderRadius: 'var(--radius-md)' }}>
              <span style={{ flex: 1, minWidth: 0, font: '500 13.5px/1.4 var(--font-sans)', color: 'var(--color-fg-1)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candTitleOf(i)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// 4 · Bar. Chrome, not content: full-bleed on the sunken ground, flush under the
// tabs, and it pushes the feed down rather than sitting in the column with it.
const PGC3Bar = ({ wanted, names }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ margin: 'calc(var(--circ-feed-pad-top, 16px) * -1) -100vw 0', padding: '0 100vw',
      background: 'var(--color-surface-sunken)', borderBottom: '1px solid var(--color-border-2)' }}>
      <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto' }}>
        <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} className="pgc3-bar"
          style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', minHeight: 46, padding: '0 2px',
            background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left' }}>
          <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-sage)', flexShrink: 0 }} />
          <span style={{ flex: 1, minWidth: 0, font: '500 13px/1.35 var(--font-sans)', color: 'var(--color-fg-2)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-fg-1)' }}>{candNames(names)}</span> spoke on cards you are watching
          </span>
          <span aria-hidden="true" style={{ flexShrink: 0, color: 'var(--color-fg-3)', display: 'inline-flex',
            transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base) var(--ease-quiet)' }}>
            <Icon name="chevron-down" size={16} />
          </span>
        </button>
        {open && (
          <div style={{ paddingBottom: 6 }}>
            {wanted.map(i => (
              <button key={i.id} type="button" className="pgc3-bar" onClick={() => pgc3Go(i)}
                style={{ display: 'flex', alignItems: 'baseline', gap: 10, width: '100%', textAlign: 'left', background: 'transparent',
                  border: 0, borderTop: '1px solid var(--color-border-2)', cursor: 'pointer', minHeight: 44, padding: '9px 2px' }}>
                <span style={{ flex: 1, minWidth: 0, font: '500 13px/1.4 var(--font-sans)', color: 'var(--color-fg-1)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candTitleOf(i)}</span>
                <span style={{ flexShrink: 0, font: '400 12px/1.4 var(--font-sans)', color: 'var(--color-fg-3)' }}>{candNames(pgc3Who(i))}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 5 · The cards themselves. Nothing is summarised: the rows that moved are
// lifted, drawn as cards, each saying who spoke and going where they say.
const PGC3Lifted = ({ wanted }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div className="circ-fdiv"><span className="circ-fdiv-label">spoken on</span></div>
    {wanted.map(i => (
      <button key={i.id} type="button" onClick={() => pgc3Go(i)} className="pgc3-lift"
        style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', textAlign: 'left', cursor: 'pointer',
          background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)',
          padding: '13px 15px 14px' }}>
        <span style={{ font: '600 14.5px/1.35 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{candTitleOf(i)}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
          <Avatar name={pgc3Who(i)[0]} size={20} />
          <span style={{ flex: 1, minWidth: 0, font: '400 12.5px/1.4 var(--font-sans)', color: 'var(--color-fg-3)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {candNames(pgc3Who(i))} spoke
          </span>
        </span>
      </button>
    ))}
  </div>
);

const PGC3_BODIES = { r1: PGC3One, r2: PGC3Rule, r3: PGC3Card, r4: PGC3Bar, r5: PGC3Lifted };

const PGC3Lead = ({ api }) => {
  usePGC3();
  const sp = api && api.space;
  if (!sp) return null;
  const wanted = sp.items.filter(i => i.watching && candFresh(i).length > 0);
  if (!wanted.length) return null;
  const names = [];
  wanted.forEach(i => candFresh(i).forEach(t => { if (!names.includes(t.by)) names.push(t.by); }));
  const Body = PGC3_BODIES[PGC3.opt] || PGC3One;
  return <Body key={PGC3.opt} wanted={wanted} names={names} api={api} />;
};

Object.assign(window, { PGC3Lead, PGC3_BODIES });
