// ============================================================================
// C2 playground — the five answers. Each installs by re-publishing three names
// over the candidate: SwellDoor (the action-row slot), CircCandidate.CardRow
// (the card's corner and its edges) and CandWatchControl (the surface's toggle).
// Nothing in app/ or cand-* is edited.
// ============================================================================

// The fold, made operable. Same graphic the candidate draws; a 44px target laid
// over the corner so the mark and the control are one thing. Four of the five
// options rest on this — it is what lets the separate toggle go.
const PGC2Fold = ({ item, api, live }) => {
  const on = !!item.watching;
  if (!on && !live) return null;
  const glyph = (
    <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, display: 'block', pointerEvents: 'none' }}>
      <path d="M0 0 H13 A11 11 0 0 1 24 11 V24 Z" fill={on ? 'color-mix(in oklab, var(--color-accent) 30%, var(--color-surface))' : 'transparent'} />
      {!on && <path d="M2 0 H13 A11 11 0 0 1 24 11 V22" fill="none" stroke="var(--color-border-1)" strokeWidth="1.2" strokeDasharray="2 2.5" />}
    </svg>
  );
  if (!live) return <span style={{ position: 'absolute', top: 0, right: 0, width: 24, height: 24, zIndex: 2, pointerEvents: 'none' }}>{glyph}</span>;
  return (
    <button type="button" onClick={() => candToggleWatch(api, item)} aria-pressed={on}
      aria-label={on ? 'Watching this card' : 'Watch this card'}
      title={on ? 'Watching \u2014 turn the corner back down' : 'Watch this card \u2014 turn the corner down'}
      className="pgc2-fold"
      style={{ position: 'absolute', top: 0, right: 0, width: 44, height: 44, zIndex: 3,
        background: 'transparent', border: 0, padding: 0, cursor: 'pointer' }}>
      {glyph}
    </button>
  );
};

// ---- The action-row slot ----------------------------------------------------
const PGC2Door = ({ item }) => {
  usePGC2();
  const id = PGC2.opt;
  const go = () => { const C = window.CircCandidate; if (C && C.goToCard) C.goToCard(item); };
  if (id === 'm3' || id === 'm4') return null;           // carried by the line / the edge
  const unseen = pgc2Unseen(item);
  if (id === 'm1') {
    const who = pgc2Who(item);
    return (
      <button type="button" className="circ-cardaction" onClick={go}
        style={{ color: unseen ? 'var(--color-fg-1)' : 'var(--color-fg-2)', fontWeight: unseen ? 600 : 500, whiteSpace: 'nowrap' }}>
        {unseen ? candNames(who) + (who.length > 1 ? ' spoke' : ' spoke') : 'Conversation'}
      </button>
    );
  }
  if (id === 'm2' && unseen) {
    return (
      <button type="button" className="circ-cardaction circ-cardaction-icon pgc2-inv" onClick={go}
        aria-label="Open this card\u2019s conversation \u2014 something new has been said" title="Something new has been said">
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28,
          borderRadius: '50%', background: 'var(--color-fg-1)', color: 'var(--color-surface)' }}>
          <CandWayIcon size={16} />
        </span>
      </button>
    );
  }
  return (
    <button type="button" className="circ-cardaction circ-cardaction-icon" onClick={go}
      aria-label="Open this card\u2019s conversation" title="Conversation">
      <CandWayIcon size={18} />
    </button>
  );
};

// ---- The row ----------------------------------------------------------------
const PGC2Row = ({ item, tab, api, children }) => {
  usePGC2();
  const id = PGC2.opt;
  const read = tab === 'read';
  const unseen = read && pgc2Unseen(item);
  const talk = pgc2HasTalk(item);
  // m3 is the one option that answers NO to "can the fold carry watching alone":
  // its foot line is a destination, so the corner stays a display mark and the
  // separate toggle survives on the surface.
  const live = read && id !== 'm3';
  const card = (
    <div style={{ position: 'relative', zIndex: 1, borderRadius: 'var(--radius-lg)',
      boxShadow: (read && talk && (id === 'm4')) ? 'var(--shadow-raised)' : 'none' }}>
      {children}
      {read && <PGC2Fold item={item} api={api} live={live} />}
    </div>
  );
  if (!read || !talk) return card;
  const go = () => { const C = window.CircCandidate; if (C && C.goToCard) C.goToCard(item); };

  if (id === 'm3') {
    const voices = unseen ? pgc2Who(item) : pgc2Voices(item);
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {card}
        <button type="button" onClick={go} className="pgc2-line"
          style={{ marginTop: 6, padding: '10px 2px', minHeight: 44, background: 'transparent', border: 0,
            borderTop: '1px solid var(--color-border-2)', cursor: 'pointer', textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ flex: 1, minWidth: 0, font: (unseen ? '600' : '400') + ' 13px/1.4 var(--font-sans)',
            color: unseen ? 'var(--color-fg-1)' : 'var(--color-fg-3)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {voices.length ? candNames(voices) + (unseen ? ' spoke here' : ' talked about this') : 'You started this one'}
          </span>
          <Icon name="chevron-right" size={15} color={unseen ? 'var(--color-fg-2)' : 'var(--color-fg-3)'} />
        </button>
      </div>
    );
  }
  if (id === 'm4') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {card}
        <button type="button" onClick={go} className="cand-band"
          style={{ margin: '-14px 0 0', padding: '16px 16px 0', height: 44, cursor: 'pointer', textAlign: 'left',
            background: unseen ? '#E7E5DA' : CAND_PAPER.bg, border: '1px solid ' + (unseen ? '#CFCDC2' : CAND_PAPER.bd),
            borderTop: 0, borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
            display: 'flex', alignItems: 'center', gap: 8, font: 'inherit' }}>
          <span style={{ flex: 1, minWidth: 0, font: (unseen ? '600' : '500') + ' 12.5px/1.3 var(--font-sans)',
            color: unseen ? 'var(--color-fg-1)' : 'var(--color-fg-2)' }}>Conversation</span>
          <Icon name="chevron-right" size={15} color="var(--color-fg-3)" />
        </button>
      </div>
    );
  }
  return card;
};

// ---- The surface's watching control ----------------------------------------
// Present only where the option says the fold cannot carry watching on its own.
const PGC2Watch = ({ item, api }) => {
  usePGC2();
  if (PGC2.opt !== 'm3') return null;
  const on = !!item.watching;
  return (
    <button type="button" className="circ-cardaction circ-cardaction-icon cand-watch"
      onClick={() => candToggleWatch(api, item)} aria-pressed={on}
      aria-label={on ? 'Watching this card' : 'Watch this card'}
      title={on ? 'Watching \u2014 turn the corner back down' : 'Watch this card'}
      style={{ color: on ? 'var(--color-accent)' : undefined }}>
      <CandFoldGlyph size={17} filled={on} />
    </button>
  );
};

// ---- The head of the feed ---------------------------------------------------
// m5 is the only option that leaves the card unmarked, so its lead has to carry
// every card holding something unseen — watched or not, on both tabs. The other
// four keep the candidate's own return lead, which is scoped to watched cards.
const PGC2Lead = ({ api, tab }) => {
  usePGC2();
  if (PGC2.opt !== 'm5') return <CandFeedLead api={api} tab={tab} />;
  const sp = api && api.space;
  if (!sp) return null;
  const wanted = sp.items.filter(i => i.read && pgc2Unseen(i));
  if (!wanted.length) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 2 }}>
      <div className="circ-fdiv"><span className="circ-fdiv-label">still talking</span></div>
      {wanted.map(i => (
        <button key={i.id} type="button" className="circ-menuitem"
          onClick={() => { const C = window.CircCandidate; if (C && C.goToCard) C.goToCard(i); }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
            background: 'transparent', border: 0, cursor: 'pointer', minHeight: 48, padding: '7px 8px',
            borderRadius: 'var(--radius-md)' }}>
          <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ font: '600 13.5px/1.35 var(--font-sans)', color: 'var(--color-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candTitleOf(i)}</span>
            <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--color-fg-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candNames(pgc2Who(i))}</span>
          </span>
          <Icon name="chevron-right" size={16} color="var(--color-fg-3)" />
        </button>
      ))}
    </div>
  );
};

Object.assign(window, { PGC2Row, PGC2Door, PGC2Watch, PGC2Lead, PGC2Fold,
  SwellDoor: PGC2Door, CandWatchControl: PGC2Watch });
