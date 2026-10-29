// Playground (1236, v8): a canvas of Daily Word's session card. Renders the main build's own body (GS_SESSION_BODY.word) in
// fixed-width frames, each its own `gs` container, so every frame is the app at that width. Phone options only add a class on
// the frame (styles in word-v8.html). Measurements under each frame are read off the rendered DOM.
const PG8_PLAYS = [['word-today', 'Solved, 3 guesses'], ['word-hard', 'Solved, 5 guesses + hint'], ['word-failed', 'Failed, 6 guesses'], ['word-live', 'In progress']];
// In progress shows only the rows played (owner's lean, 2026-10-28): c8-none hides the empty rows, c8-one keeps one.
// In progress shows only the rows played (owner's lean, 2026-10-28): c8-none hides the empty rows, c8-one keeps one.
// Phone: even spacing (owner, 2026-10-28). One step X is the card's padding on every side, chip to rule, and rule to board.
const PG8_PHONE = [
  ['P16', '16 all round (the card’s base padding on a phone)', 'c8-ev c8-x16 c8-none'],
  ['P20', '20 all round', 'c8-ev c8-x20 c8-none'],
  ['P24', '24 all round (the card’s padding on desktop)', 'c8-ev c8-x24 c8-none'],
  ['P32', '32 all round', 'c8-ev c8-x32 c8-none'],
];
// Desktop: the chip beside the board, a faint upright rule between, the same space either side of it.
const PG8_SIDE = [
  ['S', 'as built (32 between, no rule)', ''],
  ['S3', 'faint rule, 24 either side', 'c8-vr c8-vr-24'],
  ['S5', 'faint rule, 32 either side', 'c8-vr c8-vr-32'],
  ['S6', 'faint rule, 40 either side', 'c8-vr c8-vr-40'],
];
const PG8_SHORT = [
  ['N1', 'Full width, as built', ''],
  ['N2', 'Stops a quarter of a tile short of the board’s edges', 'c8-n-inset'],
  ['N3', 'One tile’s run either side of the hint only', 'c8-n-short'],
];
const PG8_DOTS = [
  ['D1', 'Dotted, as built', ''],
  ['D2', 'Dotted, fainter (the rule’s colour)', 'c8-d-faint'],
  ['D3', 'A faint solid line (the rule’s colour)', 'c8-d-solid'],
  ['D4', 'Dashed, as the hint tile’s edge', 'c8-d-dash'],
  ['D5', 'No marks', 'c8-d-none'],
];
const pg8Measure = (el) => {
  if (!el) return '';
  const px = (n) => Math.round(n) + 'px';
  const tile = el.querySelector('.wd-row .wd-t'); const chip = el.querySelector('.wd-tag'); const hint = el.querySelector('.wd-t.is-hint');
  const out = [];
  if (tile) { const r = tile; out.push('Tile ' + px(r.offsetWidth) + ' × ' + px(r.offsetHeight)); }
  if (chip) out.push('Chip ' + px(chip.offsetHeight) + ' high');
  if (hint) { const r = hint; out.push('Hint ' + px(r.offsetWidth) + ' × ' + px(r.offsetHeight)); }
  return out.join(' · ');
};
const Pg8Frame = ({ sid, w, cls, label }) => {
  const ref = React.useRef(null); const [m, setM] = React.useState('');
  React.useEffect(() => { const id = setTimeout(() => setM(pg8Measure(ref.current)), 300); return () => clearTimeout(id); }, []);
  const s = GS_SESSIONS[sid]; const Body = window.GS_SESSION_BODY.word;
  return (
    <figure className="c8-fig">
      <figcaption className="c8-cap"><b>{label}</b><span>{m}</span></figcaption>
      <div ref={ref} className={'c8-frame ' + cls} style={{ width: w }}>
        <div className="c8-page">{s ? <Body s={s} /> : <p>Missing play: {sid}</p>}</div>
      </div>
    </figure>);
};
const Pg8Canvas = () => (
  <main className="c8">
    <header className="c8-head">
      <p className="c8-eyebrow">PLAYGROUND · 1236 · DAILY WORD SESSION CARD · V8</p>
      <h1>Daily Word session card: the chip and its rule</h1>
      <p className="c8-note">Each frame is the main build at that width. The measurements under each label are read from the page.</p>
    </header>
    {PG8_SIDE.map(([id, name, cls]) => (
      <section key={id} className="c8-sec" id={'opt-' + id}>
        <h2><span className="c8-id">{id}</span> Desktop, 1280px: {name}</h2>
        <div className="c8-row"><Pg8Frame sid="word-hard" w={1280} cls={cls + ' c8-none'} label="Solved, 5 guesses + hint" /><Pg8Frame sid="word-live" w={1280} cls={cls + ' c8-none'} label="In progress" /></div>
      </section>))}
    <p className="c8-note c8-gap">Phone: chip above, faint rule under it. Each option uses one step everywhere: the card’s padding on every side, chip to rule, rule to board.</p>
    {PG8_PHONE.map(([id, name, cls]) => (
      <section key={id} className="c8-sec" id={'opt-' + id}>
        <h2><span className="c8-id">{id}</span> {name}</h2>
        <div className="c8-row">{PG8_PLAYS.map(([sid, l]) => <Pg8Frame key={sid} sid={sid} w={390} cls={cls} label={l} />)}</div>
      </section>))}
    <section className="c8-sec" id="opt-live">
      <h2><span className="c8-id">E</span> In progress: the rows played only, or one empty row (on P16)</h2>
      <div className="c8-row">
        <Pg8Frame sid="word-live" w={390} cls="c8-ev c8-x16 c8-none" label="Rows played only" />
        <Pg8Frame sid="word-live" w={390} cls="c8-ev c8-x16 c8-one" label="One empty row" />
        <Pg8Frame sid="word-live" w={390} cls="c8-ev c8-x16" label="Every row left (as built)" />
      </div>
    </section>
    <section className="c8-sec" id="opt-short">
      <h2><span className="c8-id">N</span> The hint row's dots, not the full width</h2>
      <p className="c8-note">Phone on P16; desktop on S5 (faint rule, 32 either side). Dots as built.</p>
      {PG8_SHORT.map(([id, name, cls]) => (
        <div key={id} className="c8-row c8-gap">
          <Pg8Frame sid="word-hard" w={390} cls={'c8-ev c8-x16 ' + cls} label={id + ' · ' + name} />
          <Pg8Frame sid="word-hard" w={390} cls={'c8-ev c8-x16 c8-mid ' + cls} label={id + ' · hint mid-row (letter 3), staged'} />
          <Pg8Frame sid="word-hard" w={1280} cls={'c8-vr c8-vr-32 ' + cls} label={id + ' · desktop'} />
        </div>))}
    </section>
    <section className="c8-sec" id="opt-dots">
      <h2><span className="c8-id">D</span> The hint row's marks either side of the hint tile</h2>
      <p className="c8-note">Phone on P16; desktop on S5 (faint rule, 32 either side).</p>
      {PG8_DOTS.map(([id, name, cls]) => (
        <div key={id} className="c8-row c8-gap">
          <Pg8Frame sid="word-hard" w={390} cls={'c8-ev c8-x16 ' + cls} label={id + ' · ' + name} />
          <Pg8Frame sid="word-hard" w={1280} cls={'c8-vr c8-vr-32 ' + cls} label={id + ' · desktop'} />
        </div>))}
    </section>
  </main>);
{ const r = document.getElementById('root'); r.replaceChildren(); const el = document.createElement('div'); document.body.prepend(el); r.style.display = 'none'; ReactDOM.createRoot(el).render(<Pg8Canvas />); }
