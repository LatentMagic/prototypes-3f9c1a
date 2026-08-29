// ============================================================================
// C5 — the three openings. Each replaces the candidate's own eyebrow + thought
// block via window.CandOpening; option 3 also draws under the head card via
// window.CandHeadExtra. Nothing else on the surface changes, so the three are
// judged on the opening alone.
// ============================================================================

// Who spoke, in whatever register the option calls for.
const PGC5Who = ({ item, api, nameSize, gap }) => {
  const t = item.thought;
  const by = /^you$/i.test(t.by) ? 'You' : t.by;
  const isYou = by === 'You';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: gap || 9, minWidth: 0 }}>
      <Avatar name={isYou ? displayName(api.user) : by} size={26} accent={isYou} />
      <span style={{ font: '600 ' + nameSize + 'px/1.3 var(--font-sans)', color: 'var(--color-fg-1)' }}>{by}</span>
      <span style={{ font: '400 11.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>
        with the link{candWhen(t.at) ? ' \u00b7 ' + candWhen(t.at) : ''}
      </span>
    </div>
  );
};

// ---- 1 · First turn --------------------------------------------------------
// The thought takes the turn's own anatomy exactly: 26px avatar, 13.5px name,
// the body indented into the same column as every other turn's body. There is
// no eyebrow and no rule — the thread starts because a person spoke, and the
// only thing marking this one out is the words "with the link".
const PGC5Turn = ({ item, api }) => {
  if (!item.thought) return null;
  const t = item.thought;
  const by = /^you$/i.test(t.by) ? 'You' : t.by;
  const isYou = by === 'You';
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      <Avatar name={isYou ? displayName(api.user) : by} size={26} accent={isYou} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, flexWrap: 'wrap' }}>
          <span style={{ font: '600 13.5px/1.3 var(--font-sans)', color: 'var(--color-fg-1)' }}>{by}</span>
          <span style={{ font: '400 11.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>
            with the link{candWhen(t.at) ? ' \u00b7 ' + candWhen(t.at) : ''}
          </span>
        </div>
        <CandProse text={t.text} size={14.5} lh={1.55} />
      </div>
    </div>
  );
};

// ---- 2 · The opening, set apart --------------------------------------------
// The thought gets presence rather than volume: the card's own warm paper, full
// width, the words at 14px in primary ink. Below it the thread's start is
// LABELLED — a rule with the words sitting on it — so the opening and the talk
// read as two beats instead of one list.
const PGC5Apart = ({ item, api }) => {
  if (!item.thought) return null;
  return (
    <React.Fragment>
      <div style={{ background: CAND_PAPER.bg, border: '1px solid ' + CAND_PAPER.bd,
        borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-5)',
        display: 'flex', flexDirection: 'column', gap: 10, margin: '0 -4px' }}>
        <PGC5Who item={item} api={api} nameSize={14} />
        <CandProse text={item.thought.text} size={14} lh={1.7} color="var(--color-fg-1)" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0 -2px' }}>
        <CandEyebrow style={{ flexShrink: 0 }}>the conversation</CandEyebrow>
        <span aria-hidden="true" style={{ flex: 1, height: 1, background: 'var(--color-border-2)' }} />
      </div>
    </React.Fragment>
  );
};

// ---- 3 · Attached to the card ----------------------------------------------
// No renderer here: option 3 mounts the shipped CandCardRow at tab="active"
// (see pg-c5-wire.jsx), so the thought arrives on the card exactly as it does
// in the Active feed — same band, same swap, same mark.

const PGC5Eyebrow = () => <CandEyebrow>the conversation</CandEyebrow>;

Object.assign(window, { PGC5Turn, PGC5Apart, PGC5Eyebrow });
