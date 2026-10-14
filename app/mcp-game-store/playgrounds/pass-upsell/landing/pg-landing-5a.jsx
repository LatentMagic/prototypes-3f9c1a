// Frame 5A: Library as landing (options-v2 §D O5, row 5.1-A + 5.2-A). RIG-ONLY composition of canon's own parts.
// Canon source mirrored: GsLibrary in canon/app/gs-discover.jsx (h1 + .lb-box + DS.RowList/DS.ListRow + GpMini lead).
// What is new: a TODAY group on top, "Your games" rows that say state only, a "Find another game" link. No Pass line (B3.2).
// Fake data only: this is a staged free player (Joe's free line, 2026-10-14). Daily Groups is hidden; only two dailies exist.
// ONE data state for 5A and 5B (fix round): what this free player has played. 5B's doors read PG_STATE too.
// [result text, tone, date shown in the row's `when` slot (fake)]
const PG_STATE = {
  word: ['Today’s word is ready', null, 'Today'], mystery: ['Done today', 'ok', 'Today'],
  barrow: ['Chapter 1 done', 'ok', '6 Oct'], casebook: ['Case 1 done', 'ok', '4 Oct'], escape: ['Room 1 done', 'ok', '2 Oct'], delve: ['Not started', null, null],
};
const PG_TODAY = ['word', 'mystery'];
const PG_YOURS = ['barrow', 'casebook', 'escape', 'delve'];
// A text link with a 48px hit area (review polish).
const PgLink48 = ({ onClick, children }) => <div style={{ minHeight: 48, display: 'flex', alignItems: 'center' }}><DS.TextLink onClick={onClick}>{children}</DS.TextLink></div>;

const PgLibRows = ({ label, rows }) => {
  const gs = useGs();
  return (
    <div className="lb-box">
      <DS.RowList label={label}>{rows.map((k) => { const [result, tone, when] = PG_STATE[k]; const g = GS_GAMES[k]; return (
        <DS.ListRow key={k} lead={<GpMini art={g.art} sm />} title={g.name} result={result} when={when || undefined} tone={tone || undefined} onClick={() => gs.go(g.route, { page: 'record' })} />
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
        <PgLink48 onClick={() => gs.go('games')}>Find another game</PgLink48>
      </div>
    </main>
  );
};
Object.assign(window, { PgLanding5A });
