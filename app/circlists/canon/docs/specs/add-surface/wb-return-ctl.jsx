// ============================================================================
// Whiteboard — the way back off the writing face. Direction 2's second face has
// carried both a back arrow (top-left) and a Done button (bottom-right) since it
// was built; four answers here, on one host. Only the return control varies:
// the shell, the textarea, the link line and the returned row are identical.
// ============================================================================
const { useAdd, Grow, Collapse, SwellBlock, ReadRow, Actions, SheetTitle, Shell, Frame, Fab,
  WB_LENGTHS, wbMono, CAND_PAPER } = window;
const { Icon, Field, Button } = window;
const { useState: cS, useRef: cR, useLayoutEffect: cL } = React;

// ---- the returned row (ratified: row 1, clamped with the cut drawn) ---------
const ReturnedRow = ({ words, go }) => (
  <button type="button" onClick={go}
    style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: words ? 'flex-start' : 'center', gap: 10, minHeight: 48,
      background: words ? CAND_PAPER.bg : 'var(--color-surface)', border: '1px solid ' + (words ? CAND_PAPER.bd : 'var(--color-border-1)'),
      borderRadius: 'var(--radius-md)', padding: '10px 12px', cursor: 'pointer', overflow: 'hidden' }}>
    <span style={{ flex: 1, minWidth: 0, font: (words ? '400' : '500') + ' 13.5px/1.55 var(--font-sans)', color: words ? 'var(--color-fg-1)' : 'var(--color-fg-2)',
      position: 'relative', whiteSpace: words ? 'pre-wrap' : undefined, maxHeight: words ? 42 : undefined, overflow: 'hidden' }}>
      {words || 'Say why you\u2019re sharing it'}
      {words && <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 20,
        background: 'linear-gradient(to bottom, rgba(242,241,235,0), ' + CAND_PAPER.bg + ')' }} />}
    </span>
    <span style={{ color: 'var(--color-fg-3)', display: 'inline-flex', flexShrink: 0 }}><Icon name={words ? 'edit' : 'chevron-right'} size={16} /></span>
  </button>
);

// ---- shared controls -------------------------------------------------------
const glyphBtn = { background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--color-fg-2)',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 'var(--radius-md)', flexShrink: 0 };
const Arrow = ({ back }) => (
  <button type="button" onClick={back} aria-label="Back to the link" className="wb-glyph" style={{ ...glyphBtn, marginLeft: -10 }}>
    <Icon name="arrow-left" size={18} />
  </button>
);
const Tick = ({ back }) => (
  <button type="button" onClick={back} aria-label="Keep this and go back" className="wb-glyph" style={{ ...glyphBtn, marginRight: -10, color: 'var(--color-accent)' }}>
    <Icon name="check" size={19} />
  </button>
);
const UrlLine = ({ url, style }) => (
  <span style={{ ...wbMono, fontSize: 12, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...(style || {}) }}>{url}</span>
);

// ---- the four heads / feet -------------------------------------------------
// 1 · Arrow only.
const C1 = ({ st, back }) => ({
  head: <React.Fragment><Arrow back={back} /><UrlLine url={st.url} /></React.Fragment>, foot: null });
// 2 · A tick on the top bar, and nothing else.
const C2 = ({ st, back }) => ({
  head: <React.Fragment><UrlLine url={st.url} style={{ paddingLeft: 2 }} /><Tick back={back} /></React.Fragment>, foot: null });
// 3 · Arrow out, tick in — both on the top bar.
const C3 = ({ st, back }) => ({
  head: <React.Fragment><Arrow back={back} /><UrlLine url={st.url} /><Tick back={back} /></React.Fragment>, foot: null });
// 4 · As built: arrow up top, Done in the footer.
const C4 = ({ st, back }) => ({
  head: <React.Fragment><Arrow back={back} /><UrlLine url={st.url} /></React.Fragment>,
  foot: <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
    <Button type="button" variant="primary" onClick={back}>Done</Button></div> });

const C_OPTIONS = [
  { n: 1, name: 'Arrow only', build: C1,
    stance: 'The face has one way off it, in the position every other back in the product uses. Nothing is committed here, so nothing needs a commit control \u2014 the words are already kept, and the row you land on shows them.',
    cost: 'The only confirmation is the row on the other face. On a phone the control is top-left, the furthest point from the thumb that just finished typing.' },
  { n: 2, name: 'A tick, and nothing else', build: C2,
    stance: 'One control, and it is the affirmative one: the tick says the words are kept and takes you back. Top-right, where the thumb is, and the same gesture the app uses to accept.',
    cost: 'A tick implies its opposite \u2014 that leaving another way discards the words, which is not true. And the face loses the standard back, so the arrow is missing from a place it is expected.' },
  { n: 3, name: 'Arrow out, tick in', build: C3,
    stance: 'Both readings on one row: leave it as it was, or keep it and go. No footer at all, so the writing space runs to the bottom of the sheet.',
    cost: 'The two controls do the same thing here \u2014 both return, both keep \u2014 so the row promises a choice it does not have. Two glyphs framing a URL is also a busy header for a face whose whole point is quiet room to write.' },
  { n: 4, name: 'As built \u2014 arrow and Done', build: C4,
    stance: 'The baseline, kept honestly in the set: standard back at the top, an explicit primary commit at the bottom where every other commit in the surface sits.',
    cost: 'Two controls for one job, and Done is a loud primary button for something optional \u2014 it reads as if the note has to be completed before you can carry on.' },
];

// ---- the host: direction 2, with the head and foot injected -----------------
const Face = ({ mobile, st, build, keyId }) => {
  const [face, setFace] = cS(1);
  const aRef = cR(null), bRef = cR(null);
  const [h, setH] = cS('auto');
  cL(() => {
    const el = face ? bRef.current : aRef.current; if (!el) return;
    const set = () => setH(el.scrollHeight);
    set();
    const ro = new ResizeObserver(set); ro.observe(el);
    return () => ro.disconnect();
  }, [face]);
  const close = () => st.setOpen(false);
  const words = st.text.trim();
  const { head, foot } = build({ st, back: () => setFace(0) });
  return (
    <Shell mobile={mobile} open={st.open} onClose={close} scroll={false}>
      <div style={{ overflow: 'hidden', height: h, transition: 'height 300ms var(--ease-quiet)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', width: '200%', transform: face ? 'translateX(-50%)' : 'translateX(0)', transition: 'transform 300ms var(--ease-quiet)' }}>
          <div style={{ width: '50%', flexShrink: 0 }}>
            <div ref={aRef}>
              <SheetTitle onClose={close}>Add a link</SheetTitle>
              <Field name={'cu' + keyId + (mobile ? 'm' : 'd')} mono type="text" inputMode="url" placeholder="example.com/article"
                value={st.url} onChange={(e) => st.setUrl(e.target.value)} />
              <ReturnedRow words={words} go={() => setFace(1)} />
              <ReadRow on={st.read} onChange={st.toggleRead} style={{ marginTop: 4 }} />
              <Collapse open={st.read}>
                <div><SwellBlock swell={st.swell} setSwell={st.setSwell} active={st.read} /></div>
              </Collapse>
              <Actions onClose={close} />
            </div>
          </div>
          <div style={{ width: '50%', flexShrink: 0 }}>
            <div ref={bRef}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-3)', minHeight: 44 }}>{head}</div>
              <Grow value={st.text} onChange={st.write} placeholder={'Why you\u2019re sharing it.'} ariaLabel="A thought to go with it"
                minLines={6} maxPx={mobile ? 300 : 250} fs={15.5} lh={1.65} />
              {foot}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
};

const CBoard = () => {
  const st = useAdd('theverge.com/on-call-rotas');
  cL(() => { if (!st.text) st.pickLen('para'); }, []);
  return (
    <React.Fragment>
      <header className="wb-head">
        <h1>The way back off the writing face — four answers</h1>
        <p>Everything else on direction 2 is settled: the second face, the transition, and the returned row (clamped, with the cut drawn as a fade). This board varies only the control that gets you off the writing face and back to the link.</p>
        <p>Every frame opens on the writing face, so the control is the first thing in front of you. Press it, read the row you land on, then press the row to come back. The state is shared across all four rows and both widths.</p>
        <div className="wb-lever">
          <span className="wb-lever-lbl">The thought, as written</span>
          <div className="wb-seg" role="group" aria-label="Thought length">
            {WB_LENGTHS.map(([k, label]) => (
              <button key={k} type="button" data-on={st.len === k ? '1' : undefined} onClick={() => st.pickLen(k)}>{label}</button>
            ))}
          </div>
          <span className="wb-lever-note">The question underneath: nothing is saved or discarded here — <b>Add</b> commits the whole surface — so the control is only ever saying <i>go back</i>, and the argument is over how much it should look like it is saying <i>kept</i>.</span>
        </div>
      </header>
      {C_OPTIONS.map(o => (
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
              <Face mobile st={st} build={o.build} keyId={o.n} />
            </Frame>
            <Frame label="desktop — popover, anchored near the FAB">
              <Fab open={st.open} onClick={() => st.setOpen(!st.open)} />
              <Face st={st} build={o.build} keyId={o.n} />
            </Frame>
          </div>
        </section>
      ))}
    </React.Fragment>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<CBoard />);
