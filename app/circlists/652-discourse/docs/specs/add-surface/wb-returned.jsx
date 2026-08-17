// ============================================================================
// Whiteboard — the returned state. Direction 2 ("The other side") is ratified;
// the open defect is the row on the link face AFTER you have written on the
// second face. Four answers, one per row, all on the same host: the same shell,
// the same second face, the same Swell. Only the row varies.
// ============================================================================
const { useAdd, Grow, Collapse, SwellBlock, ReadRow, Actions, SheetTitle, Shell, Frame, Fab,
  WB_LENGTHS, wbMono, CAND_PAPER } = window;
const { Icon, Field, Button } = window;
const { useState: rS, useRef: rR, useLayoutEffect: rL } = React;

// ---- the host: direction 2, with the returned row injected ------------------
const Face2 = ({ mobile, st, Row, keyId }) => {
  const [face, setFace] = rS(0);
  const aRef = rR(null), bRef = rR(null);
  const [h, setH] = rS('auto');
  rL(() => {
    const el = face ? bRef.current : aRef.current; if (!el) return;
    const set = () => setH(el.scrollHeight);
    set();
    const ro = new ResizeObserver(set); ro.observe(el);
    return () => ro.disconnect();
  }, [face]);
  const close = () => st.setOpen(false);
  const words = st.text.trim();
  return (
    <Shell mobile={mobile} open={st.open} onClose={close} scroll={false}>
      <div style={{ overflow: 'hidden', height: h, transition: 'height 300ms var(--ease-quiet)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', width: '200%', transform: face ? 'translateX(-50%)' : 'translateX(0)', transition: 'transform 300ms var(--ease-quiet)' }}>
          <div style={{ width: '50%', flexShrink: 0 }}>
            <div ref={aRef}>
              <SheetTitle onClose={close}>Add a link</SheetTitle>
              <Field name={'ru' + keyId + (mobile ? 'm' : 'd')} mono type="text" inputMode="url" placeholder="example.com/article"
                value={st.url} onChange={(e) => st.setUrl(e.target.value)} />
              <Row words={words} go={() => setFace(1)} />
              <ReadRow on={st.read} onChange={st.toggleRead} style={{ marginTop: 4 }} />
              <Collapse open={st.read}>
                <div><SwellBlock swell={st.swell} setSwell={st.setSwell} active={st.read} /></div>
              </Collapse>
              <Actions onClose={close} />
            </div>
          </div>
          <div style={{ width: '50%', flexShrink: 0 }}>
            <div ref={bRef}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-4)' }}>
                <button type="button" onClick={() => setFace(0)} aria-label="Back to the link"
                  style={{ background: 'transparent', border: 0, padding: 8, margin: '-8px -4px -8px -8px', cursor: 'pointer', color: 'var(--color-fg-2)', display: 'inline-flex' }}><Icon name="arrow-left" size={18} /></button>
                <span style={{ ...wbMono, fontSize: 12, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{st.url}</span>
              </div>
              <Grow value={st.text} onChange={st.write} placeholder={'Why you\u2019re sharing it.'} ariaLabel="A thought to go with it"
                minLines={6} maxPx={mobile ? 300 : 250} fs={15.5} lh={1.65} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                <Button type="button" variant="primary" onClick={() => setFace(0)}>Done</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
};

// ---- shared row furniture --------------------------------------------------
const rowBase = (written) => ({ width: '100%', textAlign: 'left', display: 'flex', gap: 10, minHeight: 48,
  background: written ? CAND_PAPER.bg : 'var(--color-surface)',
  border: '1px solid ' + (written ? CAND_PAPER.bd : 'var(--color-border-1)'),
  borderRadius: 'var(--radius-md)', padding: '10px 12px', cursor: 'pointer' });
const empty = { flex: 1, minWidth: 0, font: '500 13.5px/1.5 var(--font-sans)', color: 'var(--color-fg-2)' };
const body = { flex: 1, minWidth: 0, font: '400 13.5px/1.55 var(--font-sans)', color: 'var(--color-fg-1)', whiteSpace: 'pre-wrap' };
const chev = (name) => <span style={{ color: 'var(--color-fg-3)', display: 'inline-flex', flexShrink: 0 }}><Icon name={name} size={16} /></span>;
const Prompt = ({ go }) => (
  <button type="button" onClick={go} style={{ ...rowBase(false), alignItems: 'center' }}>
    <span style={empty}>Say why you&rsquo;re sharing it</span>{chev('chevron-right')}
  </button>
);

// ---- 1 · Clamped, and the cut is drawn -------------------------------------
const RowFade = ({ words, go }) => {
  if (!words) return <Prompt go={go} />;
  return (
    <button type="button" onClick={go} style={{ ...rowBase(true), alignItems: 'flex-start', position: 'relative', overflow: 'hidden' }}>
      <span style={{ ...body, maxHeight: 42, overflow: 'hidden', position: 'relative' }}>
        {words}
        <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 20,
          background: 'linear-gradient(to bottom, rgba(242,241,235,0), ' + CAND_PAPER.bg + ')' }} />
      </span>
      {chev('edit')}
    </button>
  );
};

// ---- 2 · Shown whole -------------------------------------------------------
const RowWhole = ({ words, go }) => {
  if (!words) return <Prompt go={go} />;
  return (
    <button type="button" onClick={go} style={{ ...rowBase(true), alignItems: 'flex-start' }}>
      <span style={body}>{words}</span>{chev('edit')}
    </button>
  );
};

// ---- 3 · One line, and a tell ----------------------------------------------
const RowLine = ({ words, go }) => {
  if (!words) return <Prompt go={go} />;
  return (
    <button type="button" onClick={go} style={{ ...rowBase(true), alignItems: 'center' }}>
      <span style={{ ...body, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{words.replace(/\s*\n+\s*/g, ' ')}</span>
      <span style={{ ...wbMono, fontSize: 11.5, color: 'var(--color-fg-3)', flexShrink: 0, alignSelf: 'center' }}>Edit</span>
    </button>
  );
};

// ---- 4 · No words on this face ---------------------------------------------
const RowState = ({ words, go }) => (
  <button type="button" onClick={go} style={{ ...rowBase(!!words), alignItems: 'center' }}>
    <span style={words ? { ...empty, color: 'var(--color-fg-1)', fontWeight: 400 } : empty}>
      {words ? 'Your thought is attached' : 'Say why you\u2019re sharing it'}
    </span>
    {chev(words ? 'edit' : 'chevron-right')}
  </button>
);

const R_OPTIONS = [
  { n: 1, name: 'Clamped, and the cut is drawn', Row: RowFade,
    stance: 'Two lines of the thought on the paper, with the last of it fading into the paper\u2019s own colour, so the words visibly continue rather than stopping mid-sentence.',
    cost: 'A fade is a soft signal: it says there is more without saying how much. Line breaks still land inside the visible band, so a bulleted thought shows a fragment of its first bullet.' },
  { n: 2, name: 'Shown whole', Row: RowWhole,
    stance: 'The row is the thought, all of it, on paper. Nothing is hidden and nothing needs a signal \u2014 the same rule the card already follows.',
    cost: 'A long thought pushes Mark as read, The Swell and Add off the sheet, which is the space problem the second face was built to solve, arriving at the other end.' },
  { n: 3, name: 'One line, and a tell', Row: RowLine,
    stance: 'One line, breaks flattened to spaces, ellipsised, with Edit set as a word at the end of the row. A fixed-height receipt: what you wrote is in there, this is the way back to it.',
    cost: 'One line of a paragraph is barely a preview, and flattening the breaks misrepresents what you wrote. Edit as a word puts interface language in a surface with none.' },
  { n: 4, name: 'No words on this face', Row: RowState,
    stance: 'The link face stops previewing the thought at all: it states that one is attached, and the words live on the face that is nothing but room to write them.',
    cost: 'You cannot re-read what you wrote without leaving the face you are committing from, and the row can no longer tell a one-liner from three paragraphs.' },
];

// ---- the board -------------------------------------------------------------
const RBoard = () => {
  const st = useAdd('theverge.com/on-call-rotas');
  rL(() => { if (!st.text) st.pickLen('para'); }, []);
  return (
    <React.Fragment>
      <header className="wb-head">
        <h1>The returned state — four answers</h1>
        <p>Direction 2 is the direction. This board holds the one thing it left unsolved: the row on the link face once you have come back from writing. Everything else is held constant — same shell, same second face, same Swell — so only the row is being judged.</p>
        <p>All four are live. Write on the second face and come back, or use the length switch to load a one-liner, a paragraph, and a paragraph with three bullets. The state is shared across every row and both widths, so all eight frames carry the same words.</p>
        <div className="wb-lever">
          <span className="wb-lever-lbl">The thought, as written</span>
          <div className="wb-seg" role="group" aria-label="Thought length">
            {WB_LENGTHS.map(([k, label]) => (
              <button key={k} type="button" data-on={st.len === k ? '1' : undefined} onClick={() => st.pickLen(k)}>{label}</button>
            ))}
          </div>
          <span className="wb-lever-note">Not on this board: whether the back arrow and <b>Done</b> are both needed on the second face, and how the optionality of the thought is said. Both are open, both are next.</span>
        </div>
      </header>
      {R_OPTIONS.map(o => (
        <section className="wb-opt" key={o.n}>
          <div className="wb-bar">
            <span className="wb-n">{o.n}</span>
            <span className="wb-name">{o.name}</span>
            <div className="wb-notes">
              <span><b>Stance.</b> {o.stance}</span>
              <span><b>Cost.</b> {o.cost}</span>
            </div>
          </div>
          <div className="wb-row">
            <Frame mobile label="mobile — bottom sheet, 390">
              <Fab mobile open={st.open} onClick={() => st.setOpen(!st.open)} />
              <Face2 mobile st={st} Row={o.Row} keyId={o.n} />
            </Frame>
            <Frame label="desktop — popover, anchored near the FAB">
              <Fab open={st.open} onClick={() => st.setOpen(!st.open)} />
              <Face2 st={st} Row={o.Row} keyId={o.n} />
            </Frame>
          </div>
        </section>
      ))}
    </React.Fragment>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<RBoard />);
