// Rig 4 daily-day: Daily Word's library page, today's word done, with the two alternatives for what follows the done card.
// Copied from canon (renamed Pg*), because the done card and the page foot are inside gs-puzzles-library.jsx and cannot be swapped from outside:
//   PgNow     <- PzNow     (canon/app/gs-puzzles-library.jsx:125)   gains `after` (a slot under the card's result/share row)
//   PgDailyWord <- pzLibrary('word') (same file, :155)            drops the standing "Playing earlier words comes with the Pass." line (4.3-A)
// Everything else (LbHead, LbRun, LbAch, LbRecent, LbShare, DS.ListRow) is canon's own.

const PgNow = ({ c, after }) => {
  const gs = useGs();
  const lines = window.gsShareText ? window.gsShareText(GS_SESSIONS[c.today]) : null;
  return (
    <section className="lb-card">
      <div className="lb-top">
        <div className="gs-stack-xs"><span className="gs-label">TODAY</span><h2 className="mcp-t-sec">{c.title}</h2></div>
        <span className="lb-big"><LbResult s={c.done.st} /></span>
      </div>
      <p>{c.done.line}</p>
      <DS.ProgressBar label={c.done.bar[0]} value={c.done.bar[1]} max={c.done.bar[2]} showValue={false} />
      <div className="lb-foot">
        <div className="lb-acts">
          {lines && <LbShare lines={lines} />}
          <DS.TextLink onClick={() => gs.go('session', { id: c.today })}>{c.links[0]}</DS.TextLink>
        </div>
        <span className="gs-muted">{c.next}</span>
      </div>
      {after}
    </section>
  );
};

// What follows the done card. variant: 'next' (4A step 1), 'closed' (4A step 2), 'set' (4B).
const PgAfter = ({ variant }) => {
  const gs = useGs();
  if (variant === 'next') return (
    <div className="pg-next">
      <p>Today’s case is ready too.</p>
      <DS.Button onClick={() => gs.playReq({ kind: 'daily', id: 'mystery' })}>Play Daily Mystery</DS.Button>
    </div>
  );
  if (variant === 'closed') return <div className="pg-next"><p>That’s today’s two done. The next word lands at midnight.</p></div>;
  if (variant === 'set') return (
    <div className="pg-set" role="list">
      <DS.ListRow lead={<GpMini art={GS_GAMES.word.art} sm />} title="Daily Word" result="Done" tone="ok" onClick={() => gs.go('word', { page: 'record' })} />
      <DS.ListRow lead={<GpMini art={GS_GAMES.mystery.art} sm />} title="Daily Mystery" result="Ready" onClick={() => gs.go('mystery', { page: 'record' })} />
    </div>
  );
  return null;
};

const PgDailyWord = ({ variant }) => {
  const c = PZ.word;
  const run = c.all.map((x, i) => (i === 0 ? { ...x, played: true, done: true } : x));
  const [recent] = c.plays;
  const n = lbStreak(run);
  const ach = c.ach.map((a) => (a.of ? { ...a, have: Math.min(n, a.of) } : a));
  return (
    <main className="gs-wrap gs-main">
      <LbHead id="word" />
      <div className="lb-lay">
        <PgNow c={c} after={<PgAfter variant={variant} />} />
        <LbRun n={n} unit="days" weeks={lbRunOf(run)} />
        <LbAch items={ach} badges={c.badges} access="all" />
        <LbRecent title={recent} allLabel="See in History" empty={recent + ' appear here once you have played one.'} />
      </div>
    </main>
  );
};

const pgDailyStyle = document.createElement('style');
pgDailyStyle.textContent = `
  .pg-next { display: grid; gap: 12px; justify-items: start; border-top: 1px solid var(--line); padding-top: 16px; }
  .pg-next p { margin: 0; }
  .pg-set { margin: 0 calc(-1 * var(--lb-pad)) calc(-1 * var(--lb-pad)); border-top: 1px solid var(--line); display: grid; }
  .pg-set > * + * { border-top: 1px solid var(--line); }`;
document.head.appendChild(pgDailyStyle);
Object.assign(window, { PgDailyWord });
