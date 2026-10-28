// ============================================================================
// After Pixels — Session page (screen 7) with its share pop-up. History (screen 8) is in gs-history.jsx.
// A session in progress (s.live) has no Share: one button carries it on in your AI.
// A finished daily, weekly or fixed-answer play shows GS_ONCE_LINE and nothing that starts it; a finished chapter has Start over (gsStartsOver).
// A session page is one play: it lists no other plays.
// A 36,000 Summers Ago day has no result to share: Share carries the product page link only.
// gsShareText is the one share text for a result, wherever Share is offered (the session page and the game pages).
// ============================================================================
// The line and button a player without the Pass sees on an edition that needs it. Written for that edition, never for the free first one (which never reaches here).
// text: the line where it isn't the edition's own (a kept session).
const GsNeedsPass = ({ gid, text }) => {
  const gs = useGs();
  return (
    <div className="gs-stack-sm" style={{ justifyItems: 'start' }}>
      <span className="gs-muted">{text || 'This ' + GS_GAMES[gid].ed[0] + ' comes with the Pass.'}</span>
      <DS.Button variant="secondary" onClick={() => gs.go('pass')}>Get the Pass</DS.Button>
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
// The session's date box is one button wide, so its weekday is shortened: Tuesday → Tue.
const gsShortDay = (d) => (typeof d === 'string' ? d.replace(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)[a-z]*day\b/, '$1') : d);
const gsShareText = (s) => {
  if (s.share == null) return null;
  const link = gsLink(s.gid);
  // A result whose card is written out in full (Casebook, Escape, Delve, the Barrow), with the product link last.
  if (s.shareLines) return [...s.shareLines, link];
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
// KEEP: a blank share line (Daily Word's, after its head) shows as a blank line while the card's gaps stay one 4px token, and Copy
// still carries it, so what's pasted matches what's shown.
const GsShareText = ({ lines }) => {
  const shown = []; (lines || []).forEach((l) => { if (l === '' && shown.length) shown[shown.length - 1] += '\n'; else shown.push(l); });
  return (
    <DS.Card style={{ gap: 4, justifyItems: 'start' }}>
      {lines ? shown.map((l, i) => <span key={i} className="gs-num-text" style={{ overflowWrap: 'anywhere', whiteSpace: 'pre-line' }}>{/\n$/.test(l) ? l + '\u200b' : l}</span>) : <GsGap />}
    </DS.Card>
  );
};

// The one Share pop-up, opened from the session page and every library game page.
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
  const linkOnly = s.share == null && s.kind === 'day' && !s.live;
  const text = linkOnly ? ['https://afterpixels.com/' + GS_GAMES[s.gid].route] : gsShareText(s);
  const closeShare = () => setShare(false);
  const delve = s.kind === 'delve';
  // A finished chapter can be started over: a new session, no Pass tag or line. Anything else finished is played once.
  const ed = window.gsSessEd ? gsSessEd(gs, gs.route.id) : null;
  const over = !!s.gid && gsStartsOver(s.gid);
  // Controls only where they work: a player without the Pass can carry on or start over only a free game or its free first edition.
  // A Pass-ended player's unfinished Pass-only session is kept: it says so, with the Pass page, and no Play.
  const canPlay = !s.gid || gs.view === 'pass' || GS_GAMES[s.gid].free || (!!window.PH_FIRST && PH_FIRST[s.gid] === (s.phEd || s.edKey));
  const kept = !canPlay && (s.live || (over && s.result === PH_UNF.label));
  const again = over && canPlay ? <DS.Button variant="secondary" onClick={() => gs.play(s.game, gs.route.id)}>Start over</DS.Button> : null;
  const onceLine = !!s.gid && !over && <p>{GS_ONCE_LINE}</p>;
  const back = s.gid && <div className="gs-wrap gs-backbar" style={{ paddingTop: 24 }}><LbBackTo gid={s.gid} /></div>;
  // A game's own session body: window.GS_SESSION_BODY[gid] draws its part under the shared head (Escape's: app/gs-escape.jsx).
  // A game without one shows the plain list.
  const list = (
    <section className="gs-stack-md">
      <h2 className="mcp-t-sec">{gsOr(s.listTitle)}</h2>
      {s.lines.length > 0 && <ol className="gs-lines">
        {s.lines.map((l, i) => <li key={i}><span className="gs-strong">{l[0]}</span> · {l.slice(1).join(' · ')}</li>)}
      </ol>}
    </section>
  );
  const Body = window.GS_SESSION_BODY && window.GS_SESSION_BODY[s.gid];
  // window.GS_SESSION_QUIET[gid](s, ed) gives { label, h1 } for a head that carries no result or figures: the game's body tells them (Escape).
  const quiet = window.GS_SESSION_QUIET && window.GS_SESSION_QUIET[s.gid] ? window.GS_SESSION_QUIET[s.gid](s, ed) : null;
  const body = Body ? <Body s={s} sid={gs.route.id} /> : list;
  const art = s.art;
  // A day or week that ended before the player finished: no result, no score line, no play control. What was played stays.
  if (s.unfinished) return (<>
    {back}
    <main className="gs-wrap gs-main">
      <section className="gs-sess-head">
        <GsCover art={art} />
        <div className="gs-stack-md" style={{ justifyItems: 'start' }}>
          <span className="mcp-t-card">{ed ? edLabel(ed) : s.game}</span>
          <h1 className="gs-h1">Not finished</h1>
          <div className="gs-figs"><span className="gs-fig gs-fig-quiet">{gsShortDay(gsSessDate(s, gs))}</span></div>
          <p>{(gsRhythm(s.gid) === 'daily' ? 'The day' : 'The week') + ' ended before you finished. What you played stays in your history.'}</p>
        </div>
      </section>
      {body}
    </main>
  </>);
  return (<>
    {back}
    <main className="gs-wrap gs-main">
      <section className="gs-sess-head">
        <GsCover art={art} />
        <div className="gs-stack-md" style={{ justifyItems: 'start' }}>
          <span className="mcp-t-card">{quiet ? quiet.label : ed ? edLabel(ed) : s.game}</span>
          <h1 className="gs-h1">{quiet ? quiet.h1 : gsOr(s.result)}</h1>
          <div className="gs-figs">
            <span className="gs-fig gs-fig-quiet">{gsShortDay(gsSessDate(s, gs))}</span>
            {!quiet && (s.figures || []).map((f, i) => <span key={i} className="gs-fig">{gsOr(f)}</span>)}
          </div>
          <div className="gs-pairwrap">
            {kept ? null : s.live ? <DS.Button onClick={() => gs.play(s.game, gs.route.id)}>Play</DS.Button>
              : text ? (again ? <DS.ButtonPair>
                {again}
                <DS.Button onClick={() => setShare(true)}>Share</DS.Button>
              </DS.ButtonPair> : <DS.Button onClick={() => setShare(true)}>Share</DS.Button>)
              : again}
          </div>
          {!s.live && onceLine}
          {kept && <GsNeedsPass gid={s.gid} text="This session is kept. Carrying it on comes with the Pass." />}
        </div>
      </section>

      {delve ? (
        <section className="gs-pitch">
          {list}
          <div className="gs-stack-md">
            <DS.Card style={{ gap: 16, justifyItems: 'stretch' }}>
              <span className="gs-label">{s.live ? 'THE TRACKS SO FAR' : 'THE TRACKS AS THEY ENDED'}</span>
              <GsTrack label="Rooms reached" value={s.tracks.progress} max={s.tracks.rooms || 6} />
              <GsTrack label="Threat" value={s.tracks.threat} max={s.tracks.threatMax || 6} threat />
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
      ) : body}

      {s.credit && <p className="gs-small gs-muted" style={{ overflowWrap: 'anywhere', maxWidth: '72ch' }}>{GS_BARROW_CREDIT}</p>}

      <GsSharePopup open={share} onClose={closeShare} lines={text} linkOnly={linkOnly} />
    </main>
  </>);
};

const GsSession = () => { const r = useGs().route; return GS_SESSIONS[r.id] ? <GsSessionRecord /> : <GsNotFound />; };

Object.assign(window, { GsNeedsPass, GsSession, GsSharePopup, gsShareText });
