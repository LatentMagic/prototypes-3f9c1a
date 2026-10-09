// ============================================================================
// [Platform] — Casebook's library page, option 16 as ratified 2026-10-08
// (docs/specs/library-game-page/handoff-2026-10-08-option-16-direction.md).
// This week beside the streak, then achievements beside your cases. "All cases" opens History filtered to Casebook;
// a case opens its page, turns grouped by kind. Without the Pass: the first case and your cases on the left, achievements on the right.
// Seed in gs-casebook-data.jsx; shared parts in gs-library.jsx.
// ============================================================================
const cbGo = (gs, sid) => gs.go('casebook', sid ? { page: 'record', sid } : { page: 'record' });
const cbWeek = (gs) => (lbWeekDone(gs) ? CB_DONE : CB_LIVE);
const CB_FIRST = CB_ALL[CB_ALL.length - 1];
// A free player has the first case; a player whose Pass ended has every case they played before it ended; the Pass has all.
const cbHist = (gs) => CB_ALL.filter((c) => c.id !== CB_LIVE.id && (gs.view === 'pass' ? true : gsLapsed(gs) ? c.played && lbOld(c.week) : c === CB_FIRST));
const cbStatus = (c) => (!c.played ? { kind: 'none', label: 'Not played' } : c.live ? { kind: 'live', label: 'In progress' }
  : c.verdict === 'right' ? { kind: 'ok', label: 'Solved' } : { kind: 'bad', label: 'Unsolved' });
const cbRow = (gs, c) => ({ key: c.id, title: '#' + (CB_ALL.length - CB_ALL.indexOf(c)), date: lbShort(c.week), status: cbStatus(c), onOpen: c.played ? () => cbGo(gs, c.id) : null });
// The last ten weeks, oldest first.
const cbWeeks = () => CB_ALL.slice(0, 10).reverse().map((c) => {
  const p = c.week.split(' ');
  return { id: c.id, day: p[0], mon: p[1].slice(0, 3), month: p[1], played: c.played, now: c.id === CB_LIVE.id };
});

// This week: the result sits beside the title once you've named someone; the turns bar stays either way.
const CbNow = ({ c }) => {
  const gs = useGs();
  return (
    <section className="lb-card">
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">THIS WEEK</span><h2 className="mcp-t-sec">{c.title}</h2></div>
        {!c.live && <span className="lb-big"><LbResult s={cbStatus(c)} /></span>}
      </div>
      <p>{c.live
        ? 'You’ve used ' + c.turns + ' of 16 turns and exposed ' + c.lies + ' lies. You haven’t named the killer yet.'
        : 'You used ' + c.turns + ' of 16 turns and exposed ' + c.lies + ' of ' + c.total + ' lies.'}</p>
      <DS.ProgressBar label={c.turns + ' of 16 turns used'} value={c.turns} max={16} showValue={false} />
      <div className="lb-foot">
        <div className="lb-acts">
          {!c.live && <LbShare lines={cbShareLines(c)} note="It hides the killer and the suspects." />}
          <DS.TextLink onClick={() => cbGo(gs, c.id)}>{c.live ? 'See your turns so far' : 'See every turn'}</DS.TextLink>
        </div>
        <span className="gs-muted">{'Next case: ' + CB_NEXT}</span>
      </div>
    </section>
  );
};

// The case page: turns grouped by kind. Left as built until the game itself is designed further (user, 2026-10-08).
const CB_KINDS = [['Show evidence', 'Evidence shown'], ['Search', 'Searches'], ['Question', 'Questions']];
const cbCap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const CbOut = ({ r }) => {
  if (r.act === 'Show evidence') return <span className={'lb-out' + (r.c === 'B' ? ' is-hit' : '')}>{r.out}</span>;
  if (r.act === 'Search') return <span className={'lb-out' + (r.c === 'F' ? ' is-found' : '')}>{r.out}</span>;
  return null;
};
const CbCase = ({ c }) => {
  const gs = useGs();
  const rec = c.rec.map((r, i) => ({ ...r, n: i + 1 }));
  const acc = rec.find((r) => r.c === 'A');
  return (
    <main className="gs-wrap gs-main">
      <LbBack label={GS_GAMES.casebook.name} onClick={() => cbGo(gs)} />
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">{(c.id === CB_LIVE.id ? 'THIS WEEK' : 'WEEK OF ' + c.week.toUpperCase()) + (c.replayed ? ' · REPLAYED ' + c.replayed.toUpperCase() : '')}</span><h1 className="gs-h1">{c.title}</h1></div>
        {!c.live && <LbShare lines={cbShareLines(c)} note="It hides the killer and the suspects." />}
      </div>
      <section className="lb-card">
        <dl className="lb-figs">
          <div><dt>Result</dt><dd><LbResult s={cbStatus(c)} /></dd></div>
          <div><dt>Turns used</dt><dd>{c.turns}<span className="lb-of"> of 16</span></dd></div>
          <div><dt>Lies exposed</dt><dd>{c.lies}{!c.live && <span className="lb-of">{' of ' + c.total}</span>}</dd></div>
          <div><dt>You accused</dt><dd>{acc ? acc.what : <span className="lb-of">No one yet</span>}</dd></div>
        </dl>
      </section>
      <div className="lb-kinds">
        {CB_KINDS.map(([act, name]) => {
          const rs = rec.filter((r) => r.act === act);
          return (
            <section key={act} className="lb-box">
              <div className="lb-kindhead"><h2 className="mcp-t-card">{name}</h2><span className="gs-muted">{rs.length === 1 ? '1 turn' : rs.length + ' turns'}</span></div>
              {rs.length ? <ol className="lb-turns">
                {rs.map((r) => <li key={r.n}><span className="lb-tn">{'Turn ' + r.n}</span><span className="gs-stack-xs"><span>{cbCap(r.what)}</span><CbOut r={r} /></span></li>)}
              </ol> : <p className="lb-none gs-muted">You haven’t taken one of these yet.</p>}
            </section>
          );
        })}
      </div>
    </main>
  );
};

const CbFirst = () => {
  const gs = useGs(); const c = CB_FIRST; const again = gsLapsed(gs);
  return (
    <section className="lb-card">
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">THE FIRST CASE · FREE</span><h2 className="mcp-t-sec">{c.title}</h2></div>
        {c.played && <span className="lb-big"><LbResult s={cbStatus(c)} /></span>}
      </div>
      <p>{c.played ? 'You used ' + c.turns + ' of 16 turns and exposed ' + c.lies + ' of ' + c.total + ' lies.' : 'The game’s very first case, the same for everyone. Play it free.'}</p>
      {c.played && <DS.ProgressBar label={c.turns + ' of 16 turns used'} value={c.turns} max={16} showValue={false} />}
      <div className="lb-foot">
        <div className="lb-acts">
          {c.played ? <><LbShare lines={cbShareLines(c)} note="It hides the killer and the suspects." /><DS.TextLink onClick={() => cbGo(gs, c.id)}>See every turn</DS.TextLink></>
            : <DS.Button onClick={() => gs.play(GS_NAME.casebook, 'casebook')}>Play in your AI</DS.Button>}
        </div>
        <span className="gs-muted">Every other case comes with the Pass.</span>
      </div>
      <div><DS.Button variant="secondary" onClick={() => gs.go('pass')}>{again ? 'Get the Pass again' : 'Get the Pass'}</DS.Button></div>
    </section>
  );
};
const cbPassRow = (gs) => ({ key: 'with-pass', title: 'Every other case', date: '', status: { kind: 'none', label: 'With the Pass' }, onOpen: () => gs.go('pass') });
const CbLibrary = () => {
  const gs = useGs(); const access = lbAccess(gs, 'casebook'); const pass = access === 'all'; const sid = gs.route.sid;
  const k = gs.view + (gs.sub.freeUsed ? 'u' : '') + (lbWeekDone(gs) ? 'd' : '');
  const rows = cbHist(gs).slice(0, pass ? 8 : 7).map((x) => cbRow(gs, x)).concat(pass ? [] : [cbPassRow(gs)]);
  const c = sid && (sid === CB_LIVE.id ? (pass ? cbWeek(gs) : null) : (window.CB_REPLAYS || {})[sid] || CB_ALL.find((x) => x.id === sid && x.played));
  if (c) return <CbCase key={k + sid} c={c} />;
  return (
    <main key={k} className="gs-wrap gs-main">
      <LbHead id="casebook" />
      <div className={'lb-lay' + (pass ? '' : ' is-three')}>
        {pass ? <CbNow c={cbWeek(gs)} /> : <CbFirst />}
        {pass && <LbRun n={CB_STREAK_N} unit="weeks" weeks={cbWeeks()} />}
        <LbAch items={CB_ACH} badges={CB_BADGES} access={access} ended={CB_ENDED} />
        <LbRecent title="Your cases" allLabel="All cases" rows={rows} />
      </div>
    </main>
  );
};

window.GS_LIBRARY.casebook = CbLibrary;
Object.assign(window, { cbGo, cbWeek, cbStatus });
