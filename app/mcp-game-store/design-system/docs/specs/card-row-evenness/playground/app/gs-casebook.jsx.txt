// ============================================================================
// [Platform] — Casebook's library page, option 16 as ratified 2026-10-08
// (docs/specs/library-game-page/handoff-2026-10-08-option-16-direction.md).
// This week beside the streak, then achievements beside your cases. "All cases" opens History filtered to Casebook;
// a case opens its page, turns grouped by kind. Without the Pass: the first case in this week's place, and the streak card in the Pass holder's place (LbRunPass).
// Seed in gs-casebook-data.jsx; shared parts in gs-library.jsx.
// ============================================================================
const cbGo = (gs, sid) => gs.go('casebook', sid ? { page: 'record', sid } : { page: 'record' });
const cbWeek = (gs) => (lbWeekDone(gs) ? CB_DONE : CB_LIVE);
const CB_FIRST = CB_ALL[CB_ALL.length - 1];
// A free player has the first case; a player whose Pass ended has every case they played before it ended, this week's included when it ended today; the Pass has all.
// A new account has none. This week's case is CB_LIVE in the seed; its finished form is cbWeek.
const cbHist = (gs) => (gsFresh(gs) ? [] : CB_ALL.filter((c) => (gs.view === 'pass' ? c.id !== CB_LIVE.id : gsLapsed(gs) ? c.played && lbOld(c.week, gs) : c === CB_FIRST))
  .map((c) => (c.id === CB_LIVE.id ? cbWeek(gs) : c)));
const cbStatus = (c) => (!c.played ? { kind: 'none', label: 'Not played' } : c.live ? { kind: 'live', label: 'In progress' }
  : { kind: c.verdict === 'right' ? 'ok' : 'bad', label: GS_RESULT.casebook({ ok: c.verdict === 'right' }) });
// Every week newest first, done when the case was solved in its first finished play. This week counts once it is solved.
const cbRunList = (gs) => CB_ALL.map((c, i) => ({ ...c, done: gsFresh(gs) ? false : i === 0 ? cbWeek(gs).verdict === 'right' : c.played && c.verdict === 'right' }));
// The last ten weeks, oldest first.
const cbWeeks = (gs) => cbRunList(gs).slice(0, 10).reverse().map((c) => {
  const p = c.week.split(' ');
  return { id: c.id, day: p[0], mon: p[1].slice(0, 3), month: p[1], played: c.done, now: c.id === CB_LIVE.id };
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
          {!c.live && <LbShare lines={cbShareLines(c)} />}
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
  // Controls as the shared session page carries them: Play in progress; Share when finished, and Play again only if the game can be replayed (gsCanReplay);
  // a player without the Pass on a case that needs it gets the line and "Get the Pass" instead of Play again.
  const ed = edList(gs, 'casebook').find((x) => x.key === String(c.id).split('-r')[0]);
  const again = gsCanReplay('casebook');
  const held = !!ed && !c.live && again && edNeedsPass(gs, ed);
  const replay = again && <DS.Button variant="secondary" onClick={() => gs.playReq({ kind: 'edition', e: ed })}>Play again</DS.Button>;
  const share = !c.live && <LbShare lines={cbShareLines(c)} />;
  const acts = held ? null : c.live ? <DS.Button onClick={() => gs.playReq({ kind: 'edition', e: ed })}>Play</DS.Button>
    : share && replay ? <DS.ButtonPair>{replay}{share}</DS.ButtonPair> : share || replay || null;
  return (
    <main className="gs-wrap gs-main">
      <LbBackTo gid="casebook" />
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">{(c.id === CB_LIVE.id ? 'THIS WEEK' : 'WEEK OF ' + c.week.toUpperCase())}</span><h1 className="gs-h1">{c.title}</h1></div>
        {acts && <div className="gs-pairwrap">{acts}</div>}
      </div>
      {held && <div className="gs-stack-sm" style={{ justifyItems: 'start' }}>{share}<GsNeedsPass gid="casebook" /></div>}
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
  const gs = useGs(); const again = gsLapsed(gs); const fresh = gsFresh(gs);
  // A free account's first case half-done (Config: This week, or today: In progress). A new account hasn't played it.
  const c = fresh ? { ...CB_FIRST, played: false } : !again && !lbWeekDone(gs) ? { ...CB_FIRST, live: true, verdict: null, turns: 6 } : CB_FIRST;
  if (c.live) return (
    <section className="lb-card">
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">THE FIRST CASE · FREE</span><h2 className="mcp-t-sec">{c.title}</h2></div>
        <span className="lb-big"><LbResult s={cbStatus(c)} /></span>
      </div>
      <p>{'You’ve used ' + c.turns + ' of 16 turns. Carry on in your AI.'}</p>
      <DS.ProgressBar label={c.turns + ' of 16 turns used'} value={c.turns} max={16} showValue={false} />
      <div className="lb-foot">
        <div className="lb-acts"><DS.Button onClick={() => gs.play(GS_NAME.casebook, 'casebook')}>Play</DS.Button></div>
        <LbPassOffer unit="case" />
      </div>
    </section>
  );
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
          {c.played ? <><LbShare lines={cbShareLines(c)} /><DS.TextLink onClick={() => cbGo(gs, c.id)}>See every turn</DS.TextLink></>
            : <DS.Button onClick={() => gs.play(GS_NAME.casebook, 'casebook')}>Play</DS.Button>}
        </div>
        <LbPassOffer unit="case" />
      </div>
    </section>
  );
};
const CbLibrary = () => {
  const gs = useGs(); const access = lbAccess(gs, 'casebook'); const pass = access === 'all'; const sid = gs.route.sid;
  const k = gs.view + (gs.sub.hadPass ? 'u' : '') + (lbWeekDone(gs) ? 'd' : '');
  // A free account's first case half-done: not solved yet, so its row and its achievements say so.
  const firstLive = !pass && !gsLapsed(gs) && !lbWeekDone(gs) && !gsFresh(gs);
  const ach = gsFresh(gs) ? lbNoAch(CB_ACH) : firstLive ? CB_ACH.map((a) => ({ ...a, gotFree: undefined })) : CB_ACH;
  const c = sid && (sid === CB_LIVE.id ? (pass || (gsLapsed(gs) && lbOld(CB_LIVE.week, gs)) ? cbWeek(gs) : null) : CB_ALL.find((x) => x.id === sid && x.played));
  if (c) return <CbCase key={k + sid} c={c} />;
  return (
    <main key={k} className="gs-wrap gs-main">
      <LbHead id="casebook" />
      <div className="lb-lay">
        {pass ? (gsFresh(gs) ? <LbFreshNow title={CB_LIVE.title} line="You haven’t opened this week’s case yet. Ask the question they haven’t prepared for." next={'Next case: ' + CB_NEXT} onPlay={() => gs.play(GS_NAME.casebook)} /> : <CbNow c={cbWeek(gs)} />) : <CbFirst />}
        {pass && <LbRun n={lbStreak(cbRunList(gs))} unit="weeks" weeks={cbWeeks(gs)} />}
        {!pass && !gsLapsed(gs) && <LbRunPass unit="weeks" weeks={cbWeeks(gs)} />}
        {gsLapsed(gs) && (() => { const f = lbFrozen(cbWeeks(gs), cbRunList(gs), (c) => c.week); return <LbRun n={f.n} unit="weeks" weeks={f.weeks} />; })()}
        <LbAch items={ach} badges={CB_BADGES} access={access} ed={GS_GAMES.casebook.ed} />
        <LbRecent title="Your cases" allLabel="See in History" empty="Your cases appear here once you have played one." />
      </div>
    </main>
  );
};

window.GS_LIBRARY.casebook = CbLibrary;
Object.assign(window, { cbGo, cbWeek, cbStatus });
