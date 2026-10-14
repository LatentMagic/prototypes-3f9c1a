// Frame 5B: the games hub (options-v2 §D O6 row 6.1-A). RIG-ONLY recomposition of Discover (canon/app/gs-discover.jsx, DcBody).
// DS change, faked: a game card with two doors. DS.GameCard has no door slot, so the doors sit inside its tag slot
// (canon source of the card: GsCard in canon/app/gs-parts.jsx:142). Doors carry no lock and no Pass mark.
// Staged on Joe's free line: Daily Groups is hidden; 36,000 Summers Ago (Pass-only, not on the free line) is not shown.
const PG_HUB = [
  ['Every day', [['word', 'Play today’s word', 'Every word'], ['mystery', 'Play today’s case', 'Every case']]],
  ['Every week', [['escape', 'Play the first room', 'Every room'], ['casebook', 'Play the first case', 'Every case'], ['delve', 'Play the first scene', 'Every scene']]],
  ['In chapters', [['barrow', 'Play chapter 1', 'Every chapter']]],
];
const PG_HUB_MARK = { mystery: 'Played today' };

const PgDoorCard = ({ id, play, all }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const host = useGsArtHost();
  return (
    <DS.GameCard className="mcp-art-host gs-host"
      art={<div ref={host}><GsArt art={g.art} shape="wide" /></div>}
      title={<button type="button" className="gs-titlebtn mcp-art-link" onClick={() => gs.go(g.route)}>{g.name}</button>}
      mark={PG_HUB_MARK[id] && <DS.Tag kind="daily" icon="check">{PG_HUB_MARK[id]}</DS.Tag>}
      blurb={gsKeepLast(g.blurb)}
      tags={<div style={{ display: 'grid', gap: 'var(--space-3)', flexBasis: '100%' }}>
        <GsTagList tags={g.tags} ed={g.ed} />
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-3) var(--space-5)' }}>
          <DS.Button variant="secondary" onClick={() => gs.go(g.route)}>{play}</DS.Button>
          <DS.TextLink onClick={() => gs.go(g.route, { page: 'editions' })}>{all}</DS.TextLink>
        </div>
      </div>} />
  );
};

const PgLanding5B = () => {
  const [q, setQ] = React.useState('');
  const groups = PG_HUB.map(([h, rows]) => [h, rows.filter(([k]) => gsFind(q, k))]).filter(([, rows]) => rows.length);
  return (
    <main className="gs-wrap gs-main">
      <h1 className="gs-h1">Discover</h1>
      <div style={{ display: 'grid', gap: 'var(--space-6, 32px)' }}>
        <DS.SearchField label="Search" placeholder="Name" value={q} onChange={(e) => setQ(e.target.value)} />
        {groups.length ? groups.map(([h, rows]) => (
          <section key={h} className="dc-sec">
            <h2 className="mcp-t-sec">{h}</h2>
            <div style={{ display: 'grid', gap: 'var(--space-5)' }}>{rows.map(([k, p, a]) => <PgDoorCard key={k} id={k} play={p} all={a} />)}</div>
          </section>
        )) : <div className="dc-empty"><p>No game matches that.</p><DS.TextLink onClick={() => setQ('')}>Show every game</DS.TextLink></div>}
      </div>
    </main>
  );
};
Object.assign(window, { PgLanding5B });
