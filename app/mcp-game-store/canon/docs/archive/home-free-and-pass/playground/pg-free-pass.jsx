// Playground: free and the Pass. Ratified 2026-10-07: the home block goes, How it
// works step 3 links to the Pass page, and the comparison lives only there.
// Slots in app/: GsHomeFreePass (gs-home), GsHowPassStep (gs-home), GsPassCompare (gs-billing).
const PG_FP_KEY = 'pg_free_pass_v2';
const PG_FP = [
  { id: 'current', n: '0', name: 'Current' },
  { id: 'ruled', n: '1', name: 'Ruled table' },
  { id: 'card', n: '2', name: 'Table in a card' },
  { id: 'adds', n: '3', name: 'What the Pass adds' },
  { id: 'words', n: '4', name: 'Said in words' },
];
const pgFpLoad = () => { try { return JSON.parse(localStorage.getItem(PG_FP_KEY)) || {}; } catch (e) { return {}; } };
const PgFpCtx = React.createContext(null);
const usePgFp = () => {
  const [st, setSt] = React.useState(() => ({ pick: 'ruled', open: true, ...pgFpLoad() }));
  React.useEffect(() => { try { localStorage.setItem(PG_FP_KEY, JSON.stringify(st)); } catch (e) {} }, [st]);
  return [st, setSt];
};

const PG_TICK_ROWS = [
  ['Today’s three puzzles', true],
  ['Delve, a new adventure each week', false],
  ['Past puzzles', false],
  ['Your results and streak, kept', false],
];
const PgMark = ({ on }) => on
  ? <span className="pg-cell"><DS.Icon name="check" /><span className="gs-vh">Included</span></span>
  : <span className="pg-cell gs-muted"><span aria-hidden="true">–</span><span className="gs-vh">Not included</span></span>;

// 1 · Hairline rows; the Pass column is a quiet band of card fill.
const PgRuled = () => (
  <section className="gs-stack-md" aria-labelledby="pg-h">
    <h2 id="pg-h" className="mcp-t-sec">Free, or with the Pass</h2>
    <div role="table" aria-labelledby="pg-h" className="pg-t">
      <div role="row" className="pg-tr is-head">
        <span role="columnheader"><span className="gs-vh">What you get</span></span>
        <span role="columnheader" className="pg-cell mcp-t-card">Free</span>
        <span role="columnheader" className="pg-cell pg-band mcp-t-card">Pass</span>
      </div>
      {PG_TICK_ROWS.map(([l, free]) => (
        <div role="row" key={l} className="pg-tr">
          <span role="cell" className="pg-label">{l}</span>
          <span role="cell"><PgMark on={free} /></span>
          <span role="cell" className="pg-band"><PgMark on /></span>
        </div>
      ))}
      <div className="pg-tr is-foot" aria-hidden="true"><span /><span /><span className="pg-band" /></div>
    </div>
  </section>
);

// 2 · The same table as one card, with the price in the Pass column's head.
const PgCard = () => (
  <section className="gs-stack-md" aria-labelledby="pg-h">
    <h2 id="pg-h" className="mcp-t-sec">Free, or with the Pass</h2>
    <DS.Card style={{ justifyItems: 'stretch', padding: 0, maxWidth: 640 }}>
      <div role="table" aria-labelledby="pg-h" className="pg-t is-card">
        <div role="row" className="pg-tr is-head">
          <span role="columnheader"><span className="gs-vh">What you get</span></span>
          <span role="columnheader" className="pg-cell pg-headcell"><span className="mcp-t-card">Free</span><span className="gs-small">No card</span></span>
          <span role="columnheader" className="pg-cell pg-headcell"><span className="mcp-t-card">Pass</span><span className="gs-small gs-num-text">£— a month</span></span>
        </div>
        {PG_TICK_ROWS.map(([l, free]) => (
          <div role="row" key={l} className="pg-tr">
            <span role="cell" className="pg-label">{l}</span>
            <span role="cell"><PgMark on={free} /></span>
            <span role="cell"><PgMark on /></span>
          </div>
        ))}
      </div>
    </DS.Card>
  </section>
);

// 3 · No grid. What everyone gets, then what the Pass adds.
const PgAdds = () => (
  <section className="pg-adds">
    <div className="gs-stack-sm">
      <span className="gs-label">FREE</span>
      <ul className="gs-plain"><li>Today’s three puzzles</li></ul>
    </div>
    <div className="gs-stack-sm">
      <span className="gs-label">THE PASS ADDS</span>
      <ul className="gs-plain">
        <li>Delve, a new adventure each week</li>
        <li>Past puzzles</li>
        <li>Your results and streak, kept</li>
      </ul>
    </div>
  </section>
);

// 4 · Each cell says what you get, so nothing needs a tick to be read.
const PG_WORD_ROWS = [
  ['Daily Puzzles', 'Today’s three', 'Today’s, and every past day'],
  ['Delve', null, 'A new adventure each week'],
  ['Results and streak', 'Gone tomorrow', 'Kept'],
];
const PgWords = () => (
  <section className="gs-stack-md" aria-labelledby="pg-h">
    <h2 id="pg-h" className="mcp-t-sec">Free, or with the Pass</h2>
    <div role="table" aria-labelledby="pg-h" className="pg-w">
      <div role="row" className="pg-wr is-head">
        <span role="columnheader"><span className="gs-vh">Game</span></span>
        <span role="columnheader" className="gs-label">FREE</span>
        <span role="columnheader" className="gs-label">PASS</span>
      </div>
      {PG_WORD_ROWS.map(([l, f, p]) => (
        <div role="row" key={l} className="pg-wr">
          <span role="rowheader" className="pg-wl">{l}</span>
          <span role="cell" className={f ? '' : 'gs-muted'}><span className="pg-wtag gs-label">FREE</span>{f || 'Not included'}</span>
          <span role="cell"><span className="pg-wtag gs-label">PASS</span>{p}</span>
        </div>
      ))}
    </div>
  </section>
);

const PG_FP_VIEW = { ruled: PgRuled, card: PgCard, adds: PgAdds, words: PgWords };

// Switcher: a prototype strip in the demo bar's style, sitting just above it.
const PgStrip = ({ st, setSt }) => {
  const gs = useGs();
  const sel = PG_FP.find((o) => o.id === st.pick) || PG_FP[0];
  const pick = (id) => {
    setSt((s) => ({ ...s, pick: id }));
    if (gs.route.name !== 'pass') gs.go('pass');
    setTimeout(() => gsScrollToId('pg-fp'), 60);
  };
  return (
    <div className="gs-demo" style={{ bottom: 44 }} role="group" aria-label="Playground options, not part of the product">
      {st.open ? (
        <div className="gs-demo-in" style={{ flexWrap: 'wrap', whiteSpace: 'normal', rowGap: 0 }}>
          {PG_FP.map((o) => (
            <button key={o.id} type="button" className="gs-demo-opt" title={o.n + ' · ' + o.name} aria-label={o.n + ' · ' + o.name} aria-pressed={gs.route.name === 'pass' && st.pick === o.id} onClick={() => pick(o.id)}>{o.n}</button>
          ))}
          <span style={{ color: 'var(--text)', padding: '0 8px' }}>{gs.route.name === 'pass' ? sel.name : 'Pass page'}</span>
          <button type="button" className="gs-demo-opt" onClick={() => setSt((s) => ({ ...s, open: false }))}>Hide</button>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => setSt((s) => ({ ...s, open: true }))}>Options · {sel.n} {sel.name}</button></div>
      )}
    </div>
  );
};

// Home: the block is gone; the strip stays so the Pass page is one tap away.
const GsHomeFreePass = () => { const [st, setSt] = usePgFp(); return <PgStrip st={st} setSt={setSt} />; };
const GsHowPassStep = () => {
  const gs = useGs();
  return <p><b>The Pass keeps</b> your results and your streak. <button type="button" className="gs-inlink" onClick={() => gs.go('pass')}>See the Pass</button></p>;
};
const GsPassCompare = ({ current }) => {
  const [st, setSt] = usePgFp();
  const View = PG_FP_VIEW[st.pick];
  return <><div id="pg-fp">{View ? <View /> : current}</div><PgStrip st={st} setSt={setSt} /></>;
};

Object.assign(window, { GsHomeFreePass, GsHowPassStep, GsPassCompare });
