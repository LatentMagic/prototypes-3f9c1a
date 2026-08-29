// ============================================================================
// Whiteboard — the board. Header strip per option (number, name, direction,
// cost, the length rule it chose, and the length switch), then both widths side
// by side. No app frame, no config panel.
// ============================================================================
const { WB_OPTIONS, WB_LENGTHS, useAdd, Frame, Fab } = window;

const OptionRow = ({ o }) => {
  const st = useAdd(o.url);
  return (
    <section className="wb-opt">
      <div className="wb-bar">
        <span className="wb-n">{o.n}</span>
        <span className="wb-name">{o.name}</span>
        <div className="wb-seg" role="group" aria-label={'Thought length — ' + o.name}>
          {WB_LENGTHS.map(([k, label]) => (
            <button key={k} type="button" data-on={st.len === k ? '1' : undefined} onClick={() => st.pickLen(k)}>{label}</button>
          ))}
        </div>
        <div className="wb-notes">
          <span><b>Direction.</b> {o.dir}</span>
          <span><b>Cost.</b> {o.cost}</span>
          <span className="wb-len">{o.len}</span>
        </div>
      </div>
      <div className="wb-row">
        <Frame mobile label="mobile — bottom sheet, 390">
          <Fab mobile open={st.open} onClick={() => st.setOpen(!st.open)} />
          {o.render({ mobile: true, st })}
        </Frame>
        <Frame label="desktop — popover, anchored near the FAB">
          <Fab open={st.open} onClick={() => st.setOpen(!st.open)} />
          {o.render({ mobile: false, st })}
        </Frame>
      </div>
    </section>
  );
};

const Board = () => (
  <React.Fragment>
    <header className="wb-head">
      <h1>The Add-a-link surface — five answers</h1>
      <p>Five committed directions for the moment a contributor hands over a link and, if they want, the reason they are sharing it. Each is drawn at both widths, from the same state: type into either one and the other follows.</p>
      <p>Every option is live. The thought grows as you write it, the length switch in each strip loads a one-liner, a paragraph, and a paragraph with three bullets, and <b>Mark as read</b> expands The Swell beneath it — the real component, not a picture of it. <b>Add</b> carries the reaction over with the link, which is why The Swell has no Skip or Done here.</p>
      <div className="wb-lever">
        <span className="wb-lever-lbl">The Swell, when it opens</span>
        <span className="wb-lever-note">No heading. One caption under the disc — <b>Optional. Say how it landed, or leave it blank.</b> — carrying both the role and the optionality. Chosen from <b>pg-wb-swell-framing.html</b>, route 1a: anything above the disc reads as a heading whatever register it is set in, so the words go below the thing they describe.</span>
      </div>
    </header>
    {WB_OPTIONS.map(o => <OptionRow key={o.n} o={o} />)}
  </React.Fragment>
);

ReactDOM.createRoot(document.getElementById('root')).render(<Board />);
