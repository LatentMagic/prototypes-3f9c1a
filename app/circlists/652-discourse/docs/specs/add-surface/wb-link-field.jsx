// ============================================================================
// Whiteboard — the link's slot on direction 2. The direction is settled and so is
// everything else on it: this board mounts the REAL direction 2 (OptOtherSide,
// wb-add-options.jsx) three times and swaps only what the link is typed into.
// No auto-paste anywhere — the clipboard is a separate question.
// ============================================================================
const { useAdd, Frame, Fab, Shell, WB_LENGTHS, OptOtherSide, wbMono } = window;
const { Icon, Field } = window;
const { useState: lS, useLayoutEffect: lL } = React;

// 1 · the shipped Field, kept as the baseline now that the host's own default is 3.
const SlotField = ({ st, mobile }) => (
  <Field name={'lf1' + (mobile ? 'm' : 'd')} mono type="text" inputMode="url" placeholder="example.com/article"
    value={st.url} onChange={(e) => st.setUrl(e.target.value)} />
);

// ---- 2 · A sunken row with the link glyph (option 5's treatment) ------------
const SlotSunken = ({ st }) => {
  const [focus, setFocus] = lS(false);
  return (
    <div onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', minHeight: 46, marginBottom: 'var(--space-4)',
        background: 'var(--color-surface-sunken)', borderRadius: 'var(--radius-md)',
        border: '1px solid ' + (focus ? 'var(--color-accent)' : 'var(--color-border-2)'), transition: 'border-color var(--duration-base)' }}>
      <span style={{ color: 'var(--color-fg-3)', display: 'inline-flex', flexShrink: 0 }}><Icon name="link" size={16} /></span>
      <input value={st.url} onChange={(e) => st.setUrl(e.target.value)} inputMode="url" aria-label="The link" placeholder="paste a link"
        style={{ flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent', padding: 0,
          font: '500 14px/1.5 var(--font-mono)', color: 'var(--color-fg-1)' }} />
    </div>
  );
};

// ---- 3 · The glyph, on the surface's own white ------------------------------
const SlotWhite = ({ st }) => {
  const [focus, setFocus] = lS(false);
  return (
    <div onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', minHeight: 46, marginBottom: 'var(--space-4)',
        background: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
        border: '1px solid ' + (focus ? 'var(--color-accent)' : 'var(--color-border-1)'), transition: 'border-color var(--duration-base)' }}>
      <span style={{ color: 'var(--color-fg-3)', display: 'inline-flex', flexShrink: 0 }}><Icon name="link" size={16} /></span>
      <input value={st.url} onChange={(e) => st.setUrl(e.target.value)} inputMode="url" aria-label="The link" placeholder="paste a link"
        style={{ flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent', padding: 0,
          font: '500 14px/1.5 var(--font-mono)', color: 'var(--color-fg-1)' }} />
    </div>
  );
};

const L_OPTIONS = [
  { n: 1, name: 'The field it has', Slot: SlotField,
    stance: 'The shipped Field: a bordered white input on the surface\u2019s own white, mono value, the same control every other form in the product uses.',
    cost: 'It reads as a form field, so the surface opens looking like a form. Nothing in it says what belongs there \u2014 the placeholder does all the work, and it disappears the moment you type.' },
  { n: 2, name: 'Sunken, with the link glyph', Slot: SlotSunken,
    stance: 'Option 5\u2019s treatment: a recessed row, a link glyph at the head of it, mono value. It reads as a slot the link goes into rather than a field you fill in, and the glyph keeps saying so after the placeholder has gone.',
    cost: 'A second surface colour on a small sheet, and a glyph that can read as copy rather than link. Recessed also reads as less editable than it is.' },
  { n: 3, name: 'The glyph, on white', Slot: SlotWhite,
    stance: 'The middle: the glyph earns its place, but the row stays the surface\u2019s own white with the standard border, so no new colour is introduced.',
    cost: 'Without the recess it is a field with an icon in it, which is a smaller idea \u2014 close enough to 1 that the glyph may not be worth the exception.' },
];

const LBoard = () => {
  const st = useAdd('theverge.com/on-call-rotas');
  lL(() => { if (!st.text) st.pickLen('one'); }, []);
  return (
    <React.Fragment>
      <header className="wb-head">
        <h1>The link&rsquo;s slot — three answers</h1>
        <p>Direction 2, mounted as it now stands: the second face, the arrow-only return, the two-line returned row with the fade, the placeholder that says you can leave it blank. The only thing that varies down this board is what the link itself is typed into.</p>
        <p><b>Nothing here reads your clipboard.</b> Auto-paste is a separate question — it needs permission on the web and it can fill the field with something you did not mean.</p>
        <div className="wb-lever">
          <span className="wb-lever-lbl">The thought, as written</span>
          <div className="wb-seg" role="group" aria-label="Thought length">
            {WB_LENGTHS.map(([k, label]) => (
              <button key={k} type="button" data-on={st.len === k ? '1' : undefined} onClick={() => st.pickLen(k)}>{label}</button>
            ))}
          </div>
          <span className="wb-lever-note">Clear the link to see each slot empty — that is where the difference is loudest, because it is the state you open on.</span>
        </div>
      </header>
      {L_OPTIONS.map(o => (
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
              <OptOtherSide mobile st={st} LinkSlot={o.Slot} />
            </Frame>
            <Frame label="desktop — popover, anchored near the FAB">
              <Fab open={st.open} onClick={() => st.setOpen(!st.open)} />
              <OptOtherSide st={st} LinkSlot={o.Slot} />
            </Frame>
          </div>
        </section>
      ))}
    </React.Fragment>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<LBoard />);
