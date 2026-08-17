// ============================================================================
// C1 playground — the five faces, and the row that installs them.
//
// The row is the CANDIDATE'S row, mounted with two props. The mechanic, the
// motion, the geometry and the band are all the build's own; nothing here
// reimplements them. Only the face that comes forward, and the mark on the band,
// are the playground's.
//
// One rule bounds every face: NOTHING SITS ABOVE THE TITLE. Whatever a face
// carries over from the link card comes after the title, never before it.
// ============================================================================

// The item as the length lever says it should read. Never mutates state.
const pgc1fItem = (item) => {
  const t = PGC1F_TEXT[PGC1F.len];
  if (!t || !item || !item.thought) return item;
  return { ...item, thought: { ...item.thought, text: t } };
};

// ---- shared parts ----------------------------------------------------------

// The title, and the way back. The title keeps its own behaviour: it opens the
// link. The control beside it puts the link card back in front.
const PGC1FHead = ({ item, onClose, mark, children }) => (
  <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
    <a href={item.url} target="_blank" rel="noopener noreferrer" className="circ-cardtitle"
      style={{ flex: 1, minWidth: 0, font: '600 16px/1.3 var(--font-sans)', letterSpacing: '-0.01em',
        color: 'var(--color-fg-1)', textDecoration: 'none', textWrap: 'pretty', overflowWrap: 'break-word' }}>{candTitleOf(item)}</a>
    {children}
    <button type="button" onClick={onClose} aria-label="Back to the link" title="Back to the link" className="cand-altclose"
      style={{ flexShrink: 0, background: 'transparent', border: 0, cursor: 'pointer',
        borderRadius: 'var(--radius-md)', width: 36, height: 36, margin: '-6px -10px 0 0',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      {mark === 'chevron' ? <CandSwapChev /> : <CandCross />}
    </button>
  </div>
);

// The link's identity, in the card's own vocabulary, sat UNDER the title.
const PGC1FSource = ({ item }) => {
  const [broke, setBroke] = React.useState(false);
  const host = pgc1fHost(item.url);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, marginTop: -6 }}>
      {host && !broke && (
        <span style={{ width: 15, height: 15, borderRadius: 3, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--color-border-2)', display: 'inline-flex' }}>
          <img src={'https://www.google.com/s2/favicons?domain=' + host + '&sz=64'} alt="" onError={() => setBroke(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </span>
      )}
      <span style={{ font: '600 13px/1.3 var(--font-sans)', color: 'var(--color-fg-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{pgc1fSource(item)}</span>
    </div>
  );
};

const PGC1FThumb = ({ item }) => (
  <span aria-hidden="true" style={{ flexShrink: 0, display: 'block', width: 60, height: 60, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border-2)', background: 'var(--color-surface-sunken)' }}>
    {item.image && <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
  </span>
);

// Who wrote it and when, then the card's own actions. One row, no rule.
const PGC1FFoot = ({ item, api, onClose, showWho = true, white }) => {
  const t = item.thought;
  const by = pgc1fBy(t);
  const isYou = by === 'You';
  const cls = 'circ-cardaction circ-cardaction-icon' + (white ? '' : ' cand-altaction');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: -4, marginRight: -13 }}>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        {showWho && <Avatar name={isYou ? displayName(api.user) : by} size={22} accent={isYou} />}
        {showWho && <span style={{ font: '600 13px/1.3 var(--font-sans)', color: 'var(--color-fg-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{by}</span>}
        {candWhen(t.at) && <span style={{ flexShrink: 0, font: '400 11.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{candWhen(t.at)}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button className={cls} aria-label="Mark as read" title="Mark as read"
          onClick={() => { onClose(); api.requestMarkRead(item); }}><Icon name="check" size={18} /></button>
        <button className={cls} aria-label="Delete this link" title="Delete"
          onClick={() => { onClose(); api.requestDelete(item); }}><Icon name="trash" size={17} /></button>
      </div>
    </div>
  );
};

const PGC1F_SHELL = { padding: 'var(--space-4) var(--space-5) var(--space-3)', display: 'flex', flexDirection: 'column', gap: 14 };

// ---- 1 · Bare — the title, the words, the signature -------------------------
const PGC1FBare = ({ item, api, onClose, innerRef, mark }) => (
  <div ref={innerRef} style={PGC1F_SHELL}>
    <PGC1FHead item={item} onClose={onClose} mark={mark} />
    <PGC1FThought text={item.thought.text} />
    <PGC1FFoot item={item} api={api} onClose={onClose} />
  </div>
);

// ---- 2 · Source line — the link's identity, in words ------------------------
const PGC1FSourceLine = ({ item, api, onClose, innerRef, mark }) => (
  <div ref={innerRef} style={{ ...PGC1F_SHELL, gap: 12 }}>
    <PGC1FHead item={item} onClose={onClose} mark={mark} />
    <PGC1FSource item={item} />
    <PGC1FThought text={item.thought.text} />
    <PGC1FFoot item={item} api={api} onClose={onClose} />
  </div>
);

// ---- 3 · Thumbnail kept — the link's identity, as the picture ---------------
const PGC1FThumbKept = ({ item, api, onClose, innerRef, mark }) => (
  <div ref={innerRef} style={PGC1F_SHELL}>
    <PGC1FHead item={item} onClose={onClose} mark={mark}><PGC1FThumb item={item} /></PGC1FHead>
    <PGC1FThought text={item.thought.text} />
    <PGC1FFoot item={item} api={api} onClose={onClose} />
  </div>
);

// ---- 4 · Said — the thought set as speech, in a gutter ----------------------
const PGC1FSaid = ({ item, api, onClose, innerRef, mark }) => {
  const t = item.thought;
  const by = pgc1fBy(t);
  const isYou = by === 'You';
  return (
    <div ref={innerRef} className="pgc1f-said" style={{ ...PGC1F_SHELL, gap: 12, containerType: 'inline-size' }}>
      <PGC1FHead item={item} onClose={onClose} mark={mark} />
      <PGC1FSource item={item} />
      <div className="pgc1f-saidrow" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span className="pgc1f-saidgutter" style={{ flexShrink: 0, paddingTop: 1 }}>
          <Avatar name={isYou ? displayName(api.user) : by} size={28} accent={isYou} />
        </span>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ font: '600 13.5px/1.3 var(--font-sans)', color: 'var(--color-fg-1)' }}>{by}</span>
            {candWhen(t.at) && <span style={{ font: '400 11.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{candWhen(t.at)}</span>}
          </span>
          <PGC1FThought text={t.text} flat />
        </div>
      </div>
      <PGC1FFoot item={item} api={api} onClose={onClose} showWho={false} />
    </div>
  );
};

// ---- 5 · Inset — the card stays white; the THOUGHT takes the paper ----------
const PGC1FInset = ({ item, api, onClose, innerRef, mark }) => {
  const t = item.thought;
  const by = pgc1fBy(t);
  const isYou = by === 'You';
  return (
    <div ref={innerRef} style={PGC1F_SHELL}>
      <PGC1FHead item={item} onClose={onClose} mark={mark}><PGC1FThumb item={item} /></PGC1FHead>
      <PGC1FSource item={item} />
      <div style={{ background: CAND_PAPER.bg, border: '1px solid ' + CAND_PAPER.bd, borderRadius: 'var(--radius-md)',
        padding: '14px 16px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PGC1FThought text={t.text} flat />
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar name={isYou ? displayName(api.user) : by} size={20} accent={isYou} />
          <span style={{ font: '600 12.5px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>{by}</span>
          {candWhen(t.at) && <span style={{ font: '400 11.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{candWhen(t.at)}</span>}
        </span>
      </div>
      <PGC1FFoot item={item} api={api} onClose={onClose} showWho={false} white />
    </div>
  );
};

const PGC1F_FACE_COMPONENTS = { f1: PGC1FBare, f2: PGC1FSourceLine, f3: PGC1FThumbKept, f4: PGC1FSaid, f5: PGC1FInset };
const PGC1F_WHITE = { bg: 'var(--color-surface)', bd: 'var(--color-border-1)' };

// The row. The candidate's own, with the face and the mark handed in — so the
// swap the reviewer is looking at IS the build's swap, not a copy of it.
const PGC1FRow = (props) => {
  const st = usePGC1F();
  return (
    <CandCardRow {...props} item={pgc1fItem(props.item)}
      Face={PGC1F_FACE_COMPONENTS[st.face] || PGC1FBare}
      mark={st.mark}
      openPaper={st.face === 'f5' ? PGC1F_WHITE : null} />
  );
};

Object.assign(window, { PGC1FRow, PGC1F_FACE_COMPONENTS, pgc1fItem, PGC1FHead, PGC1FSource, PGC1FThumb, PGC1FFoot });
