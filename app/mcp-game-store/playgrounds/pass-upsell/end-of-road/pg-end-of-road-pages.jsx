// Rig 3 end-of-road: the pages. Real canon parts (LbHead, LbRunPass, LbAch, LbRecent, LbShare, LbPassOffer, DS.*) mounted
// under the rig's context; only the card that carries the Pass line is the rig's own.
// Source of each copy (canon, read only): CbFirst + CbLibrary = canon/app/gs-casebook.jsx:116-162, BwChapter + BwLibrary = canon/app/gs-barrow-library.jsx:23-43,
// LbPassOffer = canon/app/gs-library.jsx:281. Spec: pass-upsell/_resources/ideation/options-v2.md §D O3 rows 3.1-3.2, O7 "Game page", §F Rig 3.

// ---- hides a canon line without touching canon (display none; React keeps the node) -------------------------------------
const PgHide = ({ match, children }) => {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return undefined;
    const run = () => el.querySelectorAll('p').forEach((p) => { if (p.textContent.includes(match)) p.style.display = 'none'; });
    run(); const mo = new MutationObserver(run); mo.observe(el, { childList: true, subtree: true, characterData: true });
    return () => mo.disconnect();
  }, []);
  return <div ref={ref} style={{ display: 'contents' }}>{children}</div>;
};

// ---- Casebook: the first case's card. state: mid | s1 | s2 | s3 | mon (rig 3A) · o7mid | o7done (rig 3C) -----------------
// mid     Play only                                          s1  full line + button (first showing)
// s2      muted text link only (second showing)              s3  result only (third onward: gone)
// mon     Monday, this week's case out: one fresh first showing
const PgCbFirst = ({ state }) => {
  const gs = useGs();
  const mid = state === 'mid' || state === 'o7mid';
  const c = mid ? { ...CB_FIRST, live: true, verdict: null, turns: 6 } : CB_FIRST;
  const play = () => gs.play(GS_NAME.casebook, 'casebook');
  const getPass = (variant) => <DS.Button variant={variant} onClick={() => gs.go('pass')}>Get the Pass</DS.Button>;
  const label = mid ? 'THE FIRST CASE · FREE' : 'THE FIRST CASE · DONE';
  let acts; let tail = null;
  if (mid) acts = <><DS.Button onClick={play}>Play</DS.Button>{state === 'o7mid' && getPass('secondary')}</>;
  else if (state === 'o7done') acts = <>{getPass('main')}<PgShareBtn lines={cbShareLines(c)} /></>;
  else acts = <><LbShare lines={cbShareLines(c)} /><DS.TextLink onClick={() => cbGo(gs, c.id)}>See every turn</DS.TextLink>{state === 's2' && <DS.TextLink className="pg-muted-link" onClick={() => gs.go('pass')}>Get the Pass</DS.TextLink>}</>;
  if (state === 's1') tail = <PgPatch patches={[['Every other case comes with the Pass.', 'This week’s case comes with the Pass.']]}><LbPassOffer unit="case" /></PgPatch>;
  if (state === 'mon') tail = <div className="lb-pass">{getPass('secondary')}<span className="gs-muted">This week’s case is out. It comes with the Pass.</span></div>;
  return (
    <section className="lb-card">
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">{label}</span><h2 className="mcp-t-sec">{c.title}</h2></div>
        <span className="lb-big"><LbResult s={cbStatus(c)} /></span>
      </div>
      <p>{mid ? 'You’ve used ' + c.turns + ' of 16 turns. Carry on in your AI.' : 'You used ' + c.turns + ' of 16 turns and exposed ' + c.lies + ' of ' + c.total + ' lies.'}</p>
      <DS.ProgressBar label={c.turns + ' of 16 turns used'} value={c.turns} max={16} showValue={false} />
      {state === 'o7done' && <div className="gs-stack-xs"><span className="gs-label">THIS WEEK’S CASE</span><p>It’s out. It comes with the Pass.</p></div>}
      <div className="lb-foot">
        <div className={'lb-acts' + (state === 'o7mid' || state === 'o7done' || state === 's2' ? ' pg-acts-wrap' : '')}>{acts}</div>
        {tail}
      </div>
    </section>
  );
};
// O7 finished card: Share steps down to secondary because Get the Pass is now the main button (same popup as canon's LbShare).
const PgShareBtn = ({ lines }) => {
  const [open, setOpen] = React.useState(false);
  return <><DS.Button variant="secondary" onClick={() => setOpen(true)}>Share</DS.Button><GsSharePopup open={open} onClose={() => setOpen(false)} lines={lines} /></>;
};

// Mid-case plays card: canon's LbRecent would list the case as solved (play-history seed). Same shape as PgBwPlays, row says In progress.
const PgCbPlaysLive = () => {
  const gs = useGs();
  return (
    <section className="lb-card lb-recentcard">
      <div className="lb-sechead"><h2 className="mcp-t-card">Your cases</h2><DS.TextLink onClick={() => gs.go('history', { game: 'casebook', from: 'casebook' })}>See in History</DS.TextLink></div>
      <div className="lb-recent"><DS.RowList label="Your cases"><DS.ListRow lead={<PhLead gid="casebook" />} title={CB_FIRST.title} result="In progress" when="Today" onClick={() => gs.go('history', { game: 'casebook', from: 'casebook' })} /></DS.RowList></div>
    </section>
  );
};

// The page: canon's CbLibrary free branch with PgCbFirst in place of CbFirst. introGone removes the achievements' "Every other case…" line (3A).
const PgCbLibrary = ({ state, introGone }) => {
  const gs = useGs(); const mid = state === 'mid' || state === 'o7mid';
  // Finished: 3 of 3 lies exposed, so "Every lie exposed" is earned (canon leaves it unearned: rig override).
  const ach = mid ? CB_ACH.map((a) => ({ ...a, gotFree: undefined })) : CB_ACH.map((a) => (a.k === 'every' ? { ...a, gotFree: '3 December 2025' } : a));
  const page = (
    <main className="gs-wrap gs-main">
      <LbHead id="casebook" />
      <div className="lb-lay">
        <PgCbFirst state={state} />
        <LbRunPass unit="weeks" weeks={cbWeeks(gs)} />
        <LbAch items={ach} badges={CB_BADGES} access="first" ed={GS_GAMES.casebook.ed} />
        {mid ? <PgCbPlaysLive /> : <LbRecent title="Your cases" allLabel="See in History" empty="Your cases appear here once you have played one." />}
      </div>
    </main>
  );
  return introGone ? <PgHide match="Every other case comes with the Pass.">{page}</PgHide> : page;
};

// ---- The Barrow of Hollowmere, chapter 1 finished, chapter 2 out (rig 3B) --------------------------------------------
// Staged: finished chapter 1, hero level 4 [placeholder], three achievements earned [placeholder dates].
const PG_BW_ACH = BW_ACH.map((a) => (['seal', 'ring', 'deep'].includes(a.k) ? { ...a, gotFree: '13 October' } : a.k === 'heavy' ? { ...a, have: 6 } : a));
const PgBwChapter = () => (
  <section className="lb-card" style={{ gridColumn: '1 / -1' }}>
    <div className="lb-top"><div className="gs-stack-xs"><span className="gs-label">CHAPTER 1 · DONE</span><h2 className="mcp-t-sec">{BW_CH1.title}</h2></div></div>
    <p className="lb-big">Your hero reached level 4.</p>
    <div className="lb-foot">
      <PgPatch patches={[['Every other chapter comes with the Pass.', 'Chapter 2 comes with the Pass.']]}><LbPassOffer unit="chapter" /></PgPatch>
    </div>
  </section>
);
// Same shape as canon's LbRecentList (gs-history.jsx:216): "See in History" link in the head, rows with a chevron (onClick). Canon's own
// list reads the play-history store, which has no staged play here, so the one row is faked.
const PgBwPlays = () => {
  const gs = useGs();
  return (
    <section className="lb-card lb-recentcard">
      <div className="lb-sechead"><h2 className="mcp-t-card">Your chapters</h2><DS.TextLink onClick={() => gs.go('history', { game: 'barrow', from: 'barrow' })}>See in History</DS.TextLink></div>
      <div className="lb-recent"><DS.RowList label="Your chapters"><DS.ListRow lead={<PhLead gid="barrow" />} title={'Chapter 1 · ' + BW_CH1.title} result="Finished" tone="ok" when="13 Oct" onClick={() => gs.go('history', { game: 'barrow', from: 'barrow' })} /></DS.RowList></div>
    </section>
  );
};
const PgBwLibrary = () => (
  <PgHide match="Every other chapter comes with the Pass."><main className="gs-wrap gs-main">
    <LbHead id="barrow" />
    <div className="lb-lay">
      <PgBwChapter />
      <LbAch items={PG_BW_ACH} badges={BW_BADGES} access="first" ed={GS_GAMES.barrow.ed} />
      <PgBwPlays />
    </div>
  </main></PgHide>
);

Object.assign(window, { PgHide, PgCbFirst, PgCbLibrary, PgBwLibrary });
