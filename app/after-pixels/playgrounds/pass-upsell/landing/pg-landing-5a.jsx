// Frame 5A: Library as landing (options-v2 §D O5, row 5.1-A + 5.2-A). RIG-ONLY composition of canon's own parts.
// Canon source mirrored: GsLibrary in canon/app/gs-discover.jsx (h1 + .lb-box + DS.RowList/DS.ListRow + GpMini lead).
// What is new: a TODAY group on top, "Your games" rows that say state only, a "Find another game" link. No Pass line (B3.2).
// Fake data only: this is a staged free player (Joe's free line, 2026-10-14). Daily Groups is hidden; only two dailies exist.
// ONE data state for 5A and 5B (fix round): what this free player has played. 5B's doors read PG_STATE too.
// [result text, tone, date shown in the row's `when` slot (fake)]
// FIXTURES, NOT CANON (fix round 3, options-v2 L(b)): canon has no The Drowned Light and no The Lantern Keepers. Both are added here at runtime, to this rig's page only.
// The Drowned Light: a second chaptered campaign, chapter 1 free with an account, nothing past chapter 1 out. Its cover is drawn from the DS's own palette (a lit lantern over water).
// The Lantern Keepers: the one game with no free part on Joe's line. Own cover from DS tokens (same as home-window's rig). Drowned Light and Lantern Keepers copy and length match home-window/pg-home.jsx (PG_FIX_GAMES).
window.GS_ART.drowned = { ground: 'indigo', extend: 'bottom', svg: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/><rect x="70" y="30" width="20" height="90" fill="#F2EBE0"/><rect x="66" y="22" width="28" height="12" fill="#E5A63B"/><rect x="0" y="86" width="160" height="34" fill="#328A88"/><circle cx="30" cy="40" r="8" fill="#A390B2"/>') };
window.GS_ART.lantern = { ground: 'forest', extend: 'bottom', svg: GS_SVG('<rect width="160" height="120" fill="#163328"/><rect x="60" y="48" width="40" height="72" fill="#D66847"/><rect x="68" y="30" width="24" height="22" fill="#E5A63B"/><circle cx="130" cy="28" r="10" fill="#F2EBE0"/><rect x="14" y="96" width="30" height="24" fill="#A390B2"/>') };
window.GS_GAMES.drowned = { name: 'The Drowned Light', category: 'ADVENTURE', art: 'drowned', route: 'barrow', ed: ['chapter', 'chapters'], eds: true, edLink: 'All chapters', edAll: 'All chapters', first: true, blurb: 'The light on Gull Rock is dark. Carry it up from the sea.', tags: ['FIRST', 'Several sessions'] };
window.GS_GAMES.lantern = { name: 'The Lantern Keepers', category: 'ADVENTURE', art: 'lantern', route: 'hunter', blurb: 'A storm on Gull Rock, and everyone remembers what you chose.', tags: ['PASS', '20–30 min'] };
if (!window.GS_GAME_ORDER.includes('drowned')) window.GS_GAME_ORDER.splice(window.GS_GAME_ORDER.indexOf('barrow') + 1, 0, 'drowned');
if (!window.GS_GAME_ORDER.includes('lantern')) window.GS_GAME_ORDER.splice(window.GS_GAME_ORDER.indexOf('drowned') + 1, 0, 'lantern');
const PG_STATE = {
  word: ['Today’s word is ready', null, 'Today'], mystery: ['Done today', 'ok', 'Today'],
  barrow: ['Chapter 1 done', 'ok', '6 Oct'], casebook: ['Case 1 done', 'ok', '4 Oct'], escape: ['Room 1 done', 'ok', '2 Oct'], delve: ['Not started', null, null],
  drowned: ['Not started', null, null], lantern: ['Not started', null, null],   // state only, no Pass word (5.2-A)
};
const PG_TODAY = ['word', 'mystery'];
const PG_YOURS = ['barrow', 'drowned', 'casebook', 'escape', 'delve', 'lantern'];
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
