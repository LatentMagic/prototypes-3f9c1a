// ============================================================================
// [Platform] — Session page (screen 7) with its share pop-up, and History
// (screen 8).
// ============================================================================
const GsShareCard = ({ s }) => {
  const gs = useGs();
  return (
    <div className="gs-share-card">
      <GsCover art={s.art} />
      <div className="gs-stack-xs">
        <span className="mcp-t-card">{s.game}</span>
        <span className="gs-num-text gs-share-line">{gsOr(s.share)}</span>
        <span className="gs-small">{gs.user.username}</span>
      </div>
    </div>
  );
};

const GsSession = () => {
  const gs = useGs();
  const s = GS_SESSIONS[gs.route.id] || GS_SESSIONS.delve;
  const [share, setShare] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const notKept = s.kind === 'puzzle' && gs.view !== 'pass';
  const closeShare = () => { setShare(false); setCopied(false); setSaved(false); };
  const delve = s.kind === 'delve';
  const list = (
    <section className="gs-stack-md">
      <h2 className="mcp-t-sec">{gsOr(s.listTitle)}</h2>
      {s.lines.length > 0 && <ol className="gs-lines">
        {s.lines.map((l, i) => <li key={i}><span className="gs-strong">{l[0]}</span> · {l[1]} · {l[2]}</li>)}
      </ol>}
    </section>
  );
  return (
    <main className="gs-wrap gs-main">
      {notKept && <p className="gs-note">This result isn’t kept. The Pass keeps your history.</p>}

      <section className="gs-sess-head">
        <GsCover art={s.art} />
        <div className="gs-stack-md" style={{ justifyItems: 'start' }}>
          <span className="mcp-t-card">{s.game}</span>
          <h1 className="gs-h1">{gsOr(s.result)}</h1>
          <div className="gs-figs">
            {(s.figures || []).map((f, i) => <span key={i} className="gs-fig">{gsOr(f)}</span>)}
            <span className="gs-fig gs-fig-quiet">{s.date}</span>
          </div>
          <div className="gs-pairwrap">
            <DS.ButtonPair>
              <DS.Button variant="secondary" onClick={() => gs.play(s.game, gs.route.id)}>Play again</DS.Button>
              <DS.Button onClick={() => setShare(true)}>Share</DS.Button>
            </DS.ButtonPair>
          </div>
        </div>
      </section>

      {delve ? (
        <section className="gs-pitch">
          {list}
          <div className="gs-stack-md">
            <DS.Card style={{ gap: 16, justifyItems: 'stretch' }}>
              <span className="gs-label">THE TRACKS AS THEY ENDED</span>
              <GsTrack label="Progress" value={s.tracks.progress} />
              <GsTrack label="Threat" value={s.tracks.threat} threat />
            </DS.Card>
            <DS.Card style={{ gap: 12, justifyItems: 'stretch' }}>
              <h2 className="mcp-t-card">Endings</h2>
              <ul className="gs-plain">
                {s.endings.map((e) => (
                  <li key={e} className={e === s.reached ? 'gs-reached' : 'gs-muted'}>
                    {e === s.reached && <DS.Icon name="check" />}{e}{e === s.reached && <DS.Tag kind="daily">This session</DS.Tag>}
                  </li>
                ))}
              </ul>
            </DS.Card>
          </div>
        </section>
      ) : list}

      <DS.Popup open={share} onClose={closeShare} title="Share this result" posture={gs.narrow ? 'sheet' : 'window'}
        actions={<>
          <DS.Button variant="secondary" done={saved} doneLabel="Downloaded" onClick={() => setSaved(true)}>Download image</DS.Button>
          <DS.Button done={copied} doneLabel="Link copied" onClick={() => setCopied(true)}>Copy link</DS.Button>
        </>}>
        <GsShareCard s={s} />
      </DS.Popup>
    </main>
  );
};

const GsHistory = () => {
  const gs = useGs();
  if (gs.view !== 'pass') return (
    <main className="gs-wrap gs-main">
      <h1 className="gs-h1">History</h1>
      <DS.Card style={{ gap: 16, justifyItems: 'stretch' }}>
        <p className="gs-measure">Nothing is kept on the free plan. Play today’s puzzles as often as you like; the Pass keeps your results, your streak and your record.</p>
        <div className="gs-act gs-act-end"><DS.Button onClick={() => gs.go('pass')}>See the Pass</DS.Button></div>
      </DS.Card>
    </main>
  );
  return (
    <main className="gs-wrap gs-main">
      <h1 className="gs-h1">History</h1>
      <GsStreakPanel paying />
      <ul className="gs-hist">
        {GS_HISTORY.map((id) => {
          const s = GS_SESSIONS[id];
          return (
            <li key={id}>
              <button type="button" className="gs-hrow" onClick={() => gs.go('session', { id })}>
                <GsCover art={s.art} />
                <span className="gs-stack-xs">
                  <span className="gs-strong">{s.game}</span>
                  <span className={s.loss ? 'gs-loss' : 'gs-muted'}>{gsOr(s.result)}</span>
                </span>
                <span className="gs-small gs-hdate">{s.date}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </main>
  );
};

Object.assign(window, { GsSession, GsHistory, GsShareCard });
