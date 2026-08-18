// ============================================================================
// Whiteboard 3 — leaving the writing face. Five committed answers to how a
// contributor exits the pushed thought writer, keeping what they wrote or
// discarding it. Live: the room types and grows exactly as the built one does.
// The face itself is direction 2 as built (cand-lm652-add.jsx): pushed from the
// link face, generous, borderless, the domain optionally at its head. Only the
// way out differs between options.
// ============================================================================
const { WB_DOMAIN, WB_TYPED, WbOption, WbSection, WbStrip, WbSeg, useWbState } = window;

const WB_PARA = WB_TYPED + '\nThe first half is the part I would send to anyone; the last third is where it earns the rest of it. Take it slowly and it repays the patience.';

// The room. Copied from CandRoom (cand-lm652-add.jsx) so each option can own the
// head and the foot around it; the field itself is unchanged.
const WbRoom = ({ value, onChange, maxPx, autoFocus }) => {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    const t = ref.current; if (!t) return;
    t.style.height = 'auto';
    const h = Math.min(t.scrollHeight, maxPx);
    t.style.height = h + 'px';
    t.style.overflowY = t.scrollHeight > maxPx + 1 ? 'auto' : 'hidden';
  }, [value, maxPx]);
  React.useEffect(() => { if (autoFocus && ref.current) ref.current.focus({ preventScroll: true }); }, []);
  return (
    <textarea ref={ref} className="cand-write" value={value} onChange={(e) => onChange(e.target.value)} rows={6} maxLength={500}
      placeholder={'Say why you\u2019re sharing it, or leave it blank.'} aria-label="A thought to go with it"
      style={{ display: 'block', width: '100%', border: 0, outline: 'none', background: 'transparent', resize: 'none', padding: 0, margin: 0,
        fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 15.5, lineHeight: 1.65, color: 'var(--color-fg-1)', minHeight: Math.round(15.5 * 1.65 * 6) }} />
  );
};

const WbGlyphBtn = ({ name, label, onClick, accent, danger }) => (
  <button type="button" onClick={onClick} aria-label={label} title={label} className="cand-glyphbtn"
    style={{ background: 'transparent', border: 0, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 44, height: 44, borderRadius: 'var(--radius-md)', flexShrink: 0,
      color: accent ? 'var(--color-accent)' : danger ? 'var(--color-destructive)' : 'var(--color-fg-2)' }}>
    <Icon name={name} size={18} />
  </button>
);

const WbDomain = ({ show }) => (show
  ? <span style={{ flex: 1, minWidth: 0, font: '500 12px/1.4 var(--font-mono)', color: 'var(--color-fg-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{WB_DOMAIN}</span>
  : <span style={{ flex: 1 }} />);

const WbHeadRow = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-3)', minHeight: 44 }}>{children}</div>
);

// ---- the five faces ---------------------------------------------------------
// 1 · Back, and a tick that commits.
const WbFace1 = ({ words, setWords, domain, maxPx }) => (
  <React.Fragment>
    <WbHeadRow>
      <WbGlyphBtn name="arrow-left" label="Back to the link" />
      <WbDomain show={domain} />
      <WbGlyphBtn name="check" label="Add the link" accent />
    </WbHeadRow>
    <WbRoom value={words} onChange={setWords} maxPx={maxPx} />
  </React.Fragment>
);

// 2 · Two words at the foot.
const WbFace2 = ({ words, setWords, domain, maxPx }) => (
  <React.Fragment>
    {domain && <WbHeadRow><WbDomain show /></WbHeadRow>}
    <WbRoom value={words} onChange={setWords} maxPx={maxPx} />
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 'var(--space-4)' }}>
      <button type="button" className="cand-quiet wb-discard" onClick={() => setWords('')}>Discard</button>
      <Button variant="primary">Add</Button>
    </div>
  </React.Fragment>
);

// 3 · The arrow, and a way to bin it.
const WbFace3 = ({ words, setWords, domain, maxPx }) => (
  <React.Fragment>
    <WbHeadRow>
      <WbGlyphBtn name="arrow-left" label="Back to the link" />
      <WbDomain show={domain} />
      {!!words.trim() && <WbGlyphBtn name="trash" label="Discard what you wrote" onClick={() => setWords('')} danger />}
    </WbHeadRow>
    <WbRoom value={words} onChange={setWords} maxPx={maxPx} />
  </React.Fragment>
);

// 4 · Nothing to leave with.
const WbFace4 = ({ words, setWords, domain, maxPx }) => (
  <React.Fragment>
    {domain
      ? <WbHeadRow><WbDomain show /></WbHeadRow>
      : <div style={{ height: 'var(--space-3)' }} />}
    <WbRoom value={words} onChange={setWords} maxPx={maxPx} />
  </React.Fragment>
);

// 5 · Finish from here.
const WbFace5 = ({ words, setWords, domain, maxPx }) => (
  <React.Fragment>
    {domain && <WbHeadRow><WbDomain show /></WbHeadRow>}
    <WbRoom value={words} onChange={setWords} maxPx={maxPx} />
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
      <Button variant="secondary">Cancel</Button>
      <Button variant="primary">Add</Button>
    </div>
  </React.Fragment>
);

const WB_FACES = { 1: WbFace1, 2: WbFace2, 3: WbFace3, 4: WbFace4, 5: WbFace5 };

const WB_LEAVE_NOTES = [
  { n: 1, name: 'Back, and a tick that commits', stance: 'Two glyphs, two different acts: the arrow returns to the link and keeps the words, the tick adds the link outright without going back for it.', cost: 'the tick commits the whole contribution from a face that is only about the thought.' },
  { n: 2, name: 'Two words at the foot', stance: 'Named acts where the writing ends: Discard quietly on the left, Add as the primary on the right. Nothing is a glyph, nothing is guessed.', cost: 'spends the whitespace the face was liked for, and edges towards reading like a form.' },
  { n: 3, name: 'The arrow, and a way to bin it', stance: 'Leaving always keeps — the arrow is unchanged — and the only second act is throwing the words away, which appears once there are words.', cost: 'puts a destructive glyph on the calmest surface in the app, and still never says done.' },
  { n: 4, name: 'Nothing to leave with', stance: 'No control at all. The words are held continuously and you leave the way you left anything else: back, Escape, or the page behind. The face is only room to write.', cost: 'invisible: the way out is a gesture, and nothing on the face teaches it.' },
  { n: 5, name: 'Finish from here', stance: 'The face carries the same Cancel and Add the link face does, so you never go back — you finish the contribution from wherever you happen to be.', cost: 'two places commit the same add, and the link is out of sight at the moment you do.' },
];

const WbLeaveFace = ({ N, phase, domain, mobile }) => {
  const Face = WB_FACES[N];
  const [words, setWords] = React.useState('');
  React.useEffect(() => { setWords(phase === 'para' ? WB_PARA : ''); }, [phase]);
  return <Face words={words} setWords={setWords} domain={domain} maxPx={mobile ? 300 : 250} />;
};

const WbBoardLeave = () => {
  const [phase, setPhase] = useWbState('leavePhase', 'para');
  const [domain, setDomain] = useWbState('leaveDomain', 'on');
  return (
    <React.Fragment>
      <WbStrip n={3} title="Leaving the writing face" notes={WB_LEAVE_NOTES}
        question="Tapping the thought row pushes into a second, full page that is nothing but room to write. The push is liked and stays. Today that page has one control — a back arrow — and it has to mean both I have finished writing this and I have changed my mind. Those are different acts."
        hint="Every face types. The drivers set all five at once; the thought is optional, so leaving an empty face is a normal outcome, never an error."
        driver={<div className="wb-drivers">
          <WbSeg label="all five" value={phase} onChange={setPhase} options={[{ v: 'empty', t: 'Empty' }, { v: 'para', t: 'A paragraph' }]} />
          <WbSeg label="domain at the head" value={domain} onChange={setDomain} options={[{ v: 'on', t: 'Present' }, { v: 'off', t: 'Absent' }]} />
        </div>} />
      <WbSection>
        {WB_LEAVE_NOTES.map(({ n, name }) => (
          <WbOption key={n} n={n} name={name} cols>
            <WbFrame w={390} label="390 · pushed over the sheet" sheet><WbLeaveFace N={n} phase={phase} domain={domain === 'on'} mobile /></WbFrame>
            <WbFrame w={400} label="desktop · pushed in the popover"><WbLeaveFace N={n} phase={phase} domain={domain === 'on'} /></WbFrame>
          </WbOption>
        ))}
      </WbSection>
    </React.Fragment>
  );
};

Object.assign(window, { WbBoardLeave });
