// Frame 5A: Library as landing (options-v2 §D O5, row 5.1-A + 5.2-A). RIG-ONLY composition of canon's own parts.
// Canon source mirrored: GsLibrary in canon/app/gs-discover.jsx (h1 + .lb-box + DS.RowList/DS.ListRow + GpMini lead).
// What is new: a TODAY group on top, "Your games" rows that say state only, a "Find another game" link. No Pass line (B3.2).
// Fake data only: this is a staged free player (Joe's free line, 2026-10-14). Daily Groups is hidden; only two dailies exist.
const PG_TODAY = [['word', 'Today’s word is ready', null], ['mystery', 'Done today', 'ok']];
const PG_YOURS = [['barrow', 'Chapter 1 done', 'ok'], ['casebook', 'Case 1 done', 'ok'], ['escape', 'Room 1 done', 'ok'], ['delve', 'Not started', null]];

const PgLibRows = ({ label, rows }) => {
  const gs = useGs();
  return (
    <div className="lb-box">
      <DS.RowList label={label}>{rows.map(([k, result, tone]) => { const g = GS_GAMES[k]; return (
        <DS.ListRow key={k} lead={<GpMini art={g.art} sm />} title={g.name} result={result} tone={tone || undefined} onClick={() => gs.go(g.route, { page: 'record' })} />
      ); })}</DS.RowList>
    </div>
  );
};

const PgLanding5A = () => {
  const gs = useGs();
  return (
    <main className="gs-wrap gs-main">
      <h1 className="gs-h1">Library</h1>
      <div style={{ display: 'grid', gap: 'var(--space-6, 32px)' }}>
        <section className="dc-sec">
          <h2 className="mcp-t-sec">Today</h2>
          <PgLibRows label="Today" rows={PG_TODAY} />
        </section>
        <section className="dc-sec">
          <h2 className="mcp-t-sec">Your games</h2>
          <PgLibRows label="Your games" rows={PG_YOURS} />
        </section>
        <div><DS.TextLink onClick={() => gs.go('games')}>Find another game</DS.TextLink></div>
      </div>
    </main>
  );
};
Object.assign(window, { PgLanding5A });
