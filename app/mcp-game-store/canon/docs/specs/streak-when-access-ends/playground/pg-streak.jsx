// Casebook's weekly run, Pass ended 18 September. s: on = completed, off = not completed, fz = frozen week.
// Weeks use the build's seed: streak 3 (CB_STREAK_N), Pass ended CB_ENDED; weeks after it have no edition the player can play.
const PG_W = [
  ['3', 'Aug', 'on'], ['10', 'Aug', 'on'], ['17', 'Aug', 'off'], ['24', 'Aug', 'off'], ['31', 'Aug', 'on'],
  ['7', 'Sep', 'on'], ['14', 'Sep', 'on'], ['21', 'Sep', 'fz'], ['28', 'Sep', 'fz'], ['5', 'Oct', 'fz'],
].map(([day, mon, s]) => ({ id: mon + day, day, mon, month: mon, s, played: s === 'on' }));

const PgLock = ({ children }) => <span className="pg-lock"><DS.Icon name="lock" size={14} />{children}</span>;

const PgWeeks = ({ weeks, mode, legend, extra }) => {
  const cut = weeks.length - 6;
  return (
    <div className="lb-runbody" style={{ maxHeight: 'none' }}>
      <div className="lb-run" style={{ position: 'relative', gridTemplateColumns: 'repeat(' + weeks.length + ', minmax(0, 1fr))' }}>
        {weeks.map((w, i) => {
          const on = w.s === 'on'; const f = w.s === 'fz'; const prev = weeks[i - 1];
          const join = i > 0 && (on || f) && prev && (prev.s === 'on' || (prev.s === 'fz' && f));
          const newMon = i === 0 || prev.mon !== w.mon;
          return (
            <span key={w.id} className={'lb-wk' + (on ? ' is-on' : '') + (f ? ' is-' + mode : '') + (join ? ' is-join' : '') + (i < cut ? ' is-early' : '') + (i === cut ? ' is-cut' : '')}>
              <em><b className="lb-mw">{newMon ? w.mon : ''}</b><b className="lb-mn">{newMon || i === cut ? w.mon : ''}</b></em>
              <i>{f && mode === 'lock' ? <DS.Icon name="lock" size={14} /> : null}</i><span>{w.day}</span>
            </span>
          );
        })}
        {extra}
      </div>
      <ul className="lb-legend"><li><i className="is-on" />Completed</li><li><i />Not completed</li>{legend}</ul>
    </div>
  );
};
const Head = () => <div className="lb-streakhead"><span className="gs-figure">3</span><span className="gs-strong">weeks in a row</span></div>;
const Card = () => (
  <section className="lb-card lb-runcard"><Head />
    <PgWeeks weeks={PG_W} mode="tone" legend={<li><i className="pg-k-tone" />Not playable</li>} />
  </section>
);
const PgApp = () => (
  <GsCtx.Provider value={{}}>
    <div className="gs-root pg" style={{ minHeight: 0, paddingBottom: 72 }}>
      <div className="gs-stack-sm">
        <h1>Streak when access ends</h1>
        <p className="gs-muted gs-measure">Casebook, Pass ended 18 September, streak of 3. Weeks since the Pass ended are grey, as “Not playable”.</p>
      </div>
      <div className="pg-grid">
        <div className="pg-opt"><h2>Now, with the Pass</h2>
          <LbRun n={3} unit="weeks" weeks={PG_W.slice(0, 7).map((w, i, a) => ({ ...w, now: i === a.length - 1 }))} /></div>
        <div className="pg-opt"><h2>Pass ended</h2><Card /></div>
      </div>
    </div>
  </GsCtx.Provider>
);
ReactDOM.createRoot(document.getElementById('root')).render(<PgApp />);
