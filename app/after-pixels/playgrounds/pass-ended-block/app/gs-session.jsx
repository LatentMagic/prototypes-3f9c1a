// ============================================================================
// After Pixels — Session page (screen 7) with its share pop-up. History (screen 8) is in gs-history.jsx.
// A session in progress (s.live) has no Share and no Play again: one button carries it on in your AI.
// A replay (s.again) has Share like a first play; its text carries the replay mark (gsReplayMark). It never changes the streak.
// A session page is one play: it lists no other plays.
// A 36,000 Summers Ago day has no result to share: Share carries the product page link only.
// gsShareText is the one share text for a result, wherever Share is offered (the session page and the game pages).
// ============================================================================
// The line and button a player without the Pass sees on an edition that needs it. Written for that edition, never for the free first one (which never reaches here).
const GsNeedsPass = ({ gid }) => {
  const gs = useGs();
  return (
    <div className="gs-stack-sm" style={{ justifyItems: 'start' }}>
      <span className="gs-muted">{'This ' + GS_GAMES[gid].ed[0] + ' comes with the Pass.'}</span>
      <DS.Button variant="secondary" onClick={() => gs.go('pass')}>Get the Pass</DS.Button>
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
// The replay mark: one short tag at the end of the share text's first line.
const gsReplayMark = (lines) => lines && [lines[0] + '  🔁 Replay', ...lines.slice(1)];
// The session's date box is one button wide, so its weekday is shortened: Tuesday → Tue.
const gsShortDay = (d) => (typeof d === 'string' ? d.replace(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)[a-z]*day\b/, '$1') : d);
const gsShareText = (s) => { const t = gsShareBase(s); return s.again ? gsReplayMark(t) : t; };
const gsShareBase = (s) => {
  if (s.share == null) return null;
  const link = 'https://afterpixels.com/' + GS_GAMES[s.gid].route;
  if (s.gid === 'word' && s.number) {
    // A Hint line is not a guess: the tile rows and the count skip it.
    const guesses = s.lines.filter((l) => /^Guess/.test(l[0])).map((l) => l[1]); const answer = s.answer || guesses[guesses.length - 1];
    const h = s.hints || 0;
    const head = 'Daily Word No. ' + s.number + ' · ' + (s.loss ? 'X' : guesses.length) + '/6' + (h ? ' · ' + h + (h === 1 ? ' hint ' : ' hints ') + '💡'.repeat(h) : '');
    return [head, '', ...guesses.map((g) => gsWordRow(g, answer)), link];
  }
  if (s.gid === 'mystery' && s.number) {
    const q = s.q != null ? s.q : s.lines.filter((l) => /^Question/.test(l[0])).length;
    const qn = q === 0 ? 'no questions' : q === 1 ? '1 question' : q + ' questions';
    return ['Daily Mystery No. ' + s.number + ' · ' + (s.loss ? 'wrong accusation' : 'solved') + ' · ' + qn + (q ? ' ' + '🔎'.repeat(q) : ''), s.loss ? '❌' : '✅', link];
  }
  if (s.shareHead) return [s.shareHead, ...(s.rows || []), link];
  if (s.kind === 'delve') return ['Delve 🎲 ' + s.result + ', ' + s.reached.toLowerCase(), '🎲 ' + s.lines.length + ' rolls  ⏳ threat ' + s.tracks.threat + '/6', link];
  if (s.kind === 'case') return [s.game + ' 🔎 ' + s.result, s.figures.join(' · '), link];
  return [s.game + ' · ' + s.share, link];
};
// A blank line stays a blank line (Daily Word's line after its head). It is drawn inside the line above it,
// so the card's gaps stay one token (4px); Copy still carries the empty line.
const GsShareText = ({ lines }) => {
  const shown = []; (lines || []).forEach((l) => { if (l === '' && shown.length) shown[shown.length - 1] += '\n'; else shown.push(l); });
  return (
    <DS.Card style={{ gap: 4, justifyItems: 'start' }}>
      {lines ? shown.map((l, i) => <span key={i} className="gs-num-text" style={{ overflowWrap: 'anywhere', whiteSpace: 'pre-line' }}>{/\n$/.test(l) ? l + '\u200b' : l}</span>) : <GsGap />}
    </DS.Card>
  );
};

// The one Share pop-up, opened from the session page and every library game page (2026-10-11).
// A panel by ui-design.md: it is neither one question nor a short list of commands, so it is a bottom sheet on a phone.
const GsSharePopup = ({ open, onClose, lines, linkOnly }) => {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => { if (!open) setCopied(false); }, [open]);
  const copy = () => {
    if (window.lbCopy) lbCopy(lines);
    else { try { navigator.clipboard && navigator.clipboard.writeText(lines.join('\n')); } catch (e) {} }
    setCopied(true);
  };
  return (
    <DS.Popup open={open} onClose={onClose} kind="panel" title={linkOnly ? 'Share this game' : 'Share this result'}
      actions={lines && <DS.Button done={copied} doneLabel="Copied" onClick={copy}>Copy</DS.Button>}>
      <GsShareText lines={lines} />
    </DS.Popup>
  );
};

const GsSessionRecord = () => {
  const gs = useGs();
  const s = GS_SESSIONS[gs.route.id];
  const [share, setShare] = React.useState(false);
  // A game with no result block (36,000 Summers Ago) shares its product page link only (MCPG-030 AF-04).
  const linkOnly = s.share == null && s.kind === 'day' && !s.live && !s.again;
  const text = linkOnly ? ['https://afterpixels.com/' + GS_GAMES[s.gid].route] : gsShareText(s);
  const closeShare = () => setShare(false);
  const delve = s.kind === 'delve';
  // Play again carries the Pass mark when a player without the Pass would need it for this edition. It still opens the prompt.
  // A game whose finished editions can't be played again (gsCanReplay) has no Play again, and so no Pass line in its place.
  // Play until an edition is finished once, Play again after (ratified 2026-10-11).
  const ed = window.gsSessEd ? gsSessEd(gs, gs.route.id) : null; const g = s.gid && GS_GAMES[s.gid];
  const needsPass = !!g && (ed ? edNeedsPass(gs, ed) : gs.view !== 'pass' && !g.free);
  const held = !!ed && !s.live && needsPass && gsCanReplay(s.gid); // an edition that needs the Pass: the line and button replace Play and Play again
  const again = !gsCanReplay(s.gid) || held ? null : <DS.Button variant="secondary" onClick={() => gs.play(s.game, gs.route.id)}>Play again{needsPass && <DS.Tag kind="locked">Pass</DS.Tag>}</DS.Button>;
  const holdBlock = held && <GsNeedsPass gid={s.gid} />;
  const back = s.gid && <div className="gs-wrap gs-backbar" style={{ paddingTop: 24 }}><LbBackTo gid={s.gid} /></div>;
  const list = (
    <section className="gs-stack-md">
      <h2 className="mcp-t-sec">{gsOr(s.listTitle)}</h2>
      {s.lines.length > 0 && <ol className="gs-lines">
        {s.lines.map((l, i) => <li key={i}><span className="gs-strong">{l[0]}</span> · {l.slice(1).join(' · ')}</li>)}
      </ol>}
    </section>
  );
  // A day or week that ended before the player finished: no result, no score line, no play control. What was played stays.
  if (s.unfinished) return (<>
    {back}
    <main className="gs-wrap gs-main">
      <section className="gs-sess-head">
        <GsCover art={s.art} />
        <div className="gs-stack-md" style={{ justifyItems: 'start' }}>
          <h1 className="gs-h1">{ed ? edLabel(ed) : s.game}</h1>
          <div className="gs-figs"><span className="gs-fig">Not finished</span><span className="gs-fig gs-fig-quiet">{s.date}</span></div>
          <p>{(gsRhythm(s.gid) === 'daily' ? 'The day' : 'The week') + ' ended before you finished. What you played stays in your history.'}</p>
        </div>
      </section>
      {list}
    </main>
  </>);
  return (<>
    {back}
    <main className="gs-wrap gs-main">
      <section className="gs-sess-head">
        <GsCover art={s.art} />
        <div className="gs-stack-md" style={{ justifyItems: 'start' }}>
          <span className="mcp-t-card">{ed ? edLabel(ed) : s.game}</span>
          <h1 className="gs-h1">{gsOr(s.result)}</h1>
          <div className="gs-figs">
            <span className="gs-fig gs-fig-quiet">{gsShortDay(gsSessDate(s, gs))}</span>
            {(s.figures || []).map((f, i) => <span key={i} className="gs-fig">{gsOr(f)}</span>)}
          </div>
          <div className="gs-pairwrap">
            {s.live ? <DS.Button onClick={() => gs.play(s.game, gs.route.id)}>Play</DS.Button>
              : text ? (again ? <DS.ButtonPair>
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

      <GsSharePopup open={share} onClose={closeShare} lines={text} linkOnly={linkOnly} />
    </main>
  </>);
};

const GsSession = () => { const r = useGs().route; return GS_SESSIONS[r.id] ? <GsSessionRecord /> : <GsNotFound />; };

Object.assign(window, { GsNeedsPass, GsSession, GsShareCard, GsSharePopup, gsShareText, gsReplayMark });
