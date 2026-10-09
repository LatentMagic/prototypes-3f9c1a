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

// Share text, as it will be pasted: emoji, no letters, nothing of the scene,
// ending with the game's product page. Null where nothing is decided.
const gsWordRow = (guess, answer) => {
  const g = guess.split(''); const res = g.map(() => '⬛'); const left = {};
  answer.split('').forEach((ch, i) => { if (g[i] === ch) res[i] = '🟩'; else left[ch] = (left[ch] || 0) + 1; });
  g.forEach((ch, i) => { if (res[i] !== '🟩' && left[ch]) { res[i] = '🟨'; left[ch] -= 1; } });
  return res.join('');
};
const gsShareText = (s) => {
  if (s.share == null) return null;
  const link = 'https://platform.example/' + GS_GAMES[s.gid].route;
  if (s.number) {
    const guesses = s.lines.map((l) => l[1]); const answer = s.answer || guesses[guesses.length - 1];
    return [s.game + ' #' + s.number + '  ' + (s.loss ? 'X' : guesses.length) + '/6' + (s.hints ? '  💡' + s.hints : ''), ...guesses.map((g) => gsWordRow(g, answer)), link];
  }
  if (s.shareHead) return [s.shareHead, ...(s.rows || []), link];
  if (s.kind === 'delve') return ['Delve 🎲 ' + s.result + ', ' + s.reached.toLowerCase(), '🎲 ' + s.lines.length + ' rolls  ⏳ threat ' + s.tracks.threat + '/6', link];
  if (s.kind === 'case') return [s.game + ' 🔎 ' + s.result, s.figures.join(' · '), link];
  return [s.game + ' · ' + s.share, link];
};
const GsShareText = ({ lines }) => (
  <DS.Card style={{ gap: 4, justifyItems: 'start' }}>
    {lines ? lines.map((l, i) => <span key={i} className="gs-num-text" style={{ overflowWrap: 'anywhere' }}>{l}</span>) : <GsGap />}
  </DS.Card>
);

const GsSession = () => {
  const gs = useGs();
  const s = GS_SESSIONS[gs.route.id] || GS_SESSIONS.delve;
  const [share, setShare] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const text = gsShareText(s);
  const closeShare = () => { setShare(false); setCopied(false); };
  const copy = () => {
    try { navigator.clipboard && navigator.clipboard.writeText(text.join('\n')); } catch (e) {}
    setCopied(true);
  };
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
      <section className="gs-sess-head">
        <GsCover art={s.art} />
        <div className="gs-stack-md" style={{ justifyItems: 'start' }}>
          <span className="mcp-t-card">{s.game}</span>
          <h1 className="gs-h1">{gsOr(s.result)}</h1>
          <div className="gs-figs">
            {(s.figures || []).map((f, i) => <span key={i} className="gs-fig">{gsOr(f)}</span>)}
            <span className="gs-fig gs-fig-quiet">{gsSessDate(s, gs)}</span>
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
        actions={text && <DS.Button done={copied} doneLabel="Copied" onClick={copy}>Copy</DS.Button>}>
        <GsShareText lines={text} />
      </DS.Popup>
    </main>
  );
};

const GsHistory = () => {
  const gs = useGs();
  // Free: plays of the free games only. Pass ended: those plus every Pass-game play.
  const lapsed = gsLapsed(gs);
  const today = Object.values(GS_TODAY_PLAYED[gs.view] || {});
  const rows = gs.view === 'pass' ? GS_HISTORY : GS_HISTORY.filter((id) => {
    const s = GS_SESSIONS[id];
    if (s.date === GS.today) return today.includes(id);
    return lapsed || !!GS_GAMES[s.gid].free;
  }).sort((a, b) => (lapsed ? !!GS_SESSIONS[a].lapsedDate - !!GS_SESSIONS[b].lapsedDate : 0));
  return (
    <main className="gs-wrap gs-main">
      <h1 className="gs-h1">History</h1>
      <ul className="gs-hist">
        {rows.map((id) => {
          const s = GS_SESSIONS[id];
          return (
            <li key={id}>
              <button type="button" className="gs-hrow" onClick={() => gs.go('session', { id })}>
                <GsCover art={s.art} />
                <span className="gs-stack-xs">
                  <span className="gs-strong">{s.game}</span>
                  <span className={s.loss ? 'gs-loss' : 'gs-muted'}>{gsOr(s.result)}</span>
                </span>
                <span className="gs-small gs-hdate">{gsSessDate(s, gs)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </main>
  );
};

Object.assign(window, { GsSession, GsHistory, GsShareCard, gsShareText });
