// ============================================================================
// [Platform] — Session page (screen 7) with its share pop-up. History (screen 8) is in gs-history.jsx.
// A session in progress (s.live) has no Share and no Play again: one button carries it on in your AI.
// A replay (s.again) has no Share: it never changes the streak and is never shared.
// A 36,000 Summers Ago day has no result to share: Share carries the product page link only.
// gsShareText is the one share text for a result, wherever Share is offered (the session page and the game pages).
// ============================================================================
// The line and button a player without the Pass sees on an edition that needs it (the library game pages' own words).
const GsNeedsPass = ({ gid }) => {
  const gs = useGs(); const lapsed = gsLapsed(gs);
  return (
    <div className="gs-stack-sm" style={{ justifyItems: 'start' }}>
      <span className="gs-muted">{'Every other ' + GS_GAMES[gid].ed[0] + ' comes with the Pass.'}</span>
      <DS.Button variant="secondary" onClick={() => gs.go('pass')}>{lapsed ? 'Get the Pass again' : 'Get the Pass'}</DS.Button>
    </div>
  );
};
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

const GsSessionRecord = () => {
  const gs = useGs();
  const s = GS_SESSIONS[gs.route.id] || GS_SESSIONS.delve;
  const [share, setShare] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  // A game with no result block (36,000 Summers Ago) shares its product page link only (MCPG-030 AF-04).
  const linkOnly = s.share == null && s.kind === 'day' && !s.live && !s.again;
  const text = linkOnly ? ['https://platform.example/' + GS_GAMES[s.gid].route] : gsShareText(s);
  const closeShare = () => { setShare(false); setCopied(false); };
  const copy = () => {
    try { navigator.clipboard && navigator.clipboard.writeText(text.join('\n')); } catch (e) {}
    setCopied(true);
  };
  const delve = s.kind === 'delve';
  // Play again carries the Pass mark when a player without the Pass would need it for this edition. It still opens the prompt.
  // An edition that can't be played at all (edClosed) has no Play again.
  const ed = window.gsSessEd ? gsSessEd(gs, gs.route.id) : null; const g = s.gid && GS_GAMES[s.gid];
  const needsPass = !!g && (ed ? edNeedsPass(gs, ed) : gs.view !== 'pass' && !g.free);
  const held = !!ed && !s.live && needsPass; // an edition that needs the Pass: the line and button replace Play and Replay
  const again = (ed && edClosed(ed)) || held ? null : <DS.Button variant="secondary" onClick={() => gs.play(s.game, gs.route.id)}>Replay{needsPass && <DS.Tag kind="locked">Pass</DS.Tag>}</DS.Button>;
  const holdBlock = held && <GsNeedsPass gid={s.gid} />;
  const back = s.gid && <div className="gs-wrap" style={{ paddingTop: 24 }}><LbBackTo gid={s.gid} /></div>;
  const list = (
    <section className="gs-stack-md">
      <h2 className="mcp-t-sec">{gsOr(s.listTitle)}</h2>
      {s.lines.length > 0 && <ol className="gs-lines">
        {s.lines.map((l, i) => <li key={i}><span className="gs-strong">{l[0]}</span> · {l.slice(1).join(' · ')}</li>)}
      </ol>}
    </section>
  );
  return (<>
    {back}
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
            {s.live ? <DS.Button onClick={() => gs.play(s.game, gs.route.id)}>Play</DS.Button>
              : text && !s.again ? (again ? <DS.ButtonPair>
                {again}
                <DS.Button onClick={() => setShare(true)}>Share</DS.Button>
              </DS.ButtonPair> : <DS.Button onClick={() => setShare(true)}>Share</DS.Button>)
              : again}
          </div>
          {holdBlock}
        </div>
      </section>

      {delve ? (
        <section className="gs-pitch">
          {list}
          <div className="gs-stack-md">
            <DS.Card style={{ gap: 16, justifyItems: 'stretch' }}>
              <span className="gs-label">{s.live ? 'THE TRACKS SO FAR' : 'THE TRACKS AS THEY ENDED'}</span>
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

      <DS.Popup open={share} onClose={closeShare} title={linkOnly ? 'Share this game' : 'Share this result'} posture={gs.narrow ? 'sheet' : 'window'}
        actions={text && <DS.Button done={copied} doneLabel="Copied" onClick={copy}>Copy</DS.Button>}>
        <GsShareText lines={text} />
      </DS.Popup>
    </main>
  </>);
};

// ---- The session page's empty state: an edition this player never played (route session { gid, ed }, opened from History) ----
// No result and no turns. Three forms, as the product page's edition card: playable (Play, the play pop-up), needs the Pass (the Pass tag only), can't be played (a line and a link).
const GsSessionNew = (p) => {
  const gs = useGs(); const r = { gid: p.gid || gs.route.gid, ed: p.ed || gs.route.ed }; const gid = GS_GAMES[r.gid] ? r.gid : 'delve'; const g = GS_GAMES[gid];
  const list = edList(gs, gid); const e = list.find((x) => x.key === r.ed) || list[0];
  const closed = edClosed(e); const pass = edNeedsPass(gs, e);
  const day = gsRhythm(gid) === 'weekly' ? 'Week of ' + e.date : pzLong(phParse(e.date));
  return (<>
    <div className="gs-wrap" style={{ paddingTop: 24 }}><LbBackTo gid={gid} /></div>
    <main className="gs-wrap gs-main">
      <section className="gs-sess-head">
        <GsCover art={g.art} />
        <div className="gs-stack-md" style={{ justifyItems: 'start' }}>
          <span className="mcp-t-card">{g.name}</span>
          <h1 className="gs-h1">{edName(e)}</h1>
          <div className="gs-figs">
            <span className="gs-fig">Not played</span>
            <span className="gs-fig gs-fig-quiet">{day}</span>
          </div>
          {closed ? (
            <div className="gs-stack-sm" style={{ justifyItems: 'start' }}>
              <p>{'Only the latest ' + g.name + ' can be played. This one stays in your History.'}</p>
              <DS.TextLink onClick={() => gs.go(g.route, { page: 'record' })}>{'Go to your ' + g.name}</DS.TextLink>
            </div>
          ) : pass ? <GsNeedsPass gid={gid} />
            : <div className="gs-act"><DS.Button onClick={() => gs.playReq({ kind: 'edition', e })}>Play</DS.Button></div>}
        </div>
      </section>
    </main>
  </>);
};
const GsSession = () => (useGs().route.ed ? <GsSessionNew /> : <GsSessionRecord />);

Object.assign(window, { GsNeedsPass, GsSession, GsShareCard, gsShareText });
