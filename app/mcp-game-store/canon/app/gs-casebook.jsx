// ============================================================================
// [Platform] — Casebook's library page, option 16 as ratified 2026-10-08, fitted to an episodic game (game-pages-refresh, 2026-10-18).
// The case card spans the row (Casebook has no streak card), then achievements beside your cases. "See in History" opens History filtered to Casebook;
// the case opens its page, turns grouped by kind. Without the Pass: the first case in the case card's place.
// Seed in gs-casebook-data.jsx; shared parts in gs-library.jsx.
// ============================================================================
const cbGo = (gs, sid) => gs.go('casebook', sid ? { page: 'record', sid } : { page: 'record' });
const cbWeek = (gs) => (lbWeekDone(gs) ? CB_DONE : CB_LIVE);
// Case 1 is both the free first case and the current one: one record, read by its finished form.
const CB_FIRST = CB_DONE;
// The free first case as its one play record stands (phFirstRec): in progress, the case so far; ended, as played; not started, null.
const cbFirstOf = (gs) => {
  const st = window.phFirstSt ? phFirstSt(gs, 'casebook') : 'done';
  if (st === 'none') return null;
  return st === 'live' ? CB_LIVE : CB_DONE;
};
const cbStatus = (c) => (!c.played ? { kind: 'none', label: 'Not played' } : c.live ? { kind: 'live', label: 'In progress' }
  : { kind: c.verdict === 'right' ? 'ok' : 'bad', label: GS_RESULT.casebook({ ok: c.verdict === 'right' }) });

// The case card: the result beside the title once you've named someone; the turns bar stays either way.
const CbNow = ({ c }) => {
  const gs = useGs();
  return (
    <section className="lb-card" style={{ gridColumn: '1 / -1' }}>
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">A CASE</span><h2 className="mcp-t-sec">{c.title}</h2></div>
        {!c.live && <span className="lb-big"><LbResult s={cbStatus(c)} /></span>}
      </div>
      <p>{cbRecap(c)}</p>
      <DS.ProgressBar label={c.turns + ' of 16 turns used'} value={c.turns} max={16} showValue={false} />
      <div className="lb-foot">
        <div className="lb-acts">
          {!c.live && <LbShare lines={cbShareLines(c)} />}
          <DS.TextLink onClick={() => cbGo(gs, c.id)}>{c.live ? 'See your turns so far' : 'See every turn'}</DS.TextLink>
        </div>
      </div>
      {!c.live && window.GsNextLink && <window.GsNextLink />}
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
  // Controls as the shared session page carries them: Play in progress; Share when finished, with the played-once line. A case has a fixed answer, so nothing starts it again.
  const ed = edList(gs, 'casebook').find((x) => x.key === String(c.id));
  const share = !c.live && <LbShare lines={cbShareLines(c)} />;
  const acts = c.live ? <DS.Button onClick={() => gs.playReq({ kind: 'edition', e: ed })}>Play</DS.Button> : share || null;
  return (
    <main className="gs-wrap gs-main">
      <LbBackTo gid="casebook" />
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">A CASE</span><h1 className="gs-h1">{c.title}</h1></div>
        {acts && <div className="gs-pairwrap">{acts}</div>}
      </div>
      {!c.live && <p style={{ margin: 0 }}>{GS_ONCE_LINE}</p>}
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

const CbLibrary = () => {
  const gs = useGs(); const access = lbAccess(gs, 'casebook'); const pass = access === 'all'; const sid = gs.route.sid;
  const k = gs.view + (gs.sub.hadPass ? 'u' : '') + (lbWeekDone(gs) ? 'd' : '');
  // Without the Pass the one case is the free first case; with it, the case as it stands.
  const c = sid && (!pass && sid === CB_FIRST.id ? cbFirstOf(gs) : pass && sid === CB_LIVE.id ? cbWeek(gs) : null);
  if (c) return <CbCase key={k + sid} c={c} />;
  const ach = phAch(gs, 'casebook', CB_ACH);
  return (
    <main key={k} className="gs-wrap gs-main">
      <LbHead id="casebook" />
      <div className="lb-lay">
        {pass ? (gsFresh(gs) ? <LbFreshNow label="A CASE" title={CB_LIVE.title} line="You haven’t opened the case yet. Ask the question they haven’t prepared for." span onPlay={() => gs.play(GS_NAME.casebook)} /> : <CbNow c={cbWeek(gs)} />) : null}
        <LbAch items={ach} badges={CB_BADGES} access={access} ed={GS_GAMES.casebook.ed} />
        <LbRecent title="Your cases" allLabel="See in History" empty="Your cases appear here once you have played one." />
      </div>
    </main>
  );
};

window.GS_LIBRARY.casebook = CbLibrary;
Object.assign(window, { cbGo, cbWeek, cbStatus, cbFirstOf, CB_FIRST });
