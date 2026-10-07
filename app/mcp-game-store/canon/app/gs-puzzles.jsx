// ============================================================================
// [Platform] — Daily Puzzles parts: puzzle cards, earlier puzzles, streak.
// The page itself is the shared template (gs-game.jsx).
// ============================================================================
const GsResultTag = ({ s }) => <DS.Tag kind={s.loss ? 'error' : 'success'}>{s.result}</DS.Tag>;

const GsPuzzleCard = ({ id, session }) => {
  const gs = useGs(); const p = GS_PUZZLES[id]; const s = session && GS_SESSIONS[session];
  return (
    <DS.Card style={{ gap: 12, justifyItems: 'stretch', alignContent: 'start' }}>
      <GsCover art={p.art} />
      <h3 className="mcp-t-card">{p.name}</h3>
      <p className="gs-muted">{p.open}</p>
      {s ? (
        <div className="gs-stack-sm" style={{ justifyItems: 'start' }}>
          <GsResultTag s={s} />
          <DS.TextLink onClick={() => gs.go('session', { id: session })}>See your session page</DS.TextLink>
        </div>
      ) : (
        <div className="gs-act"><DS.Button onClick={() => gs.play(p.name, id + '-today')}>Play in your AI</DS.Button></div>
      )}
    </DS.Card>
  );
};

const GsEarlier = ({ paying }) => {
  const gs = useGs();
  return (
    <section className="gs-stack-md">
      <h2 className="mcp-t-sec">Earlier puzzles</h2>
      {!paying && <p className="gs-muted">Past puzzles come with the Pass.</p>}
      <div className="gs-rows">
        {GS_EARLIER.map((d) => (
          <div key={d.date} className="gs-day-row">
            <div className="gs-title-row"><span className="gs-strong">{d.date}</span>{!paying && <GsPassTag />}</div>
            {paying ? (
              <div className="gs-pz-items">
                {GS_PUZZLE_ORDER.map((k) => {
                  const sid = d.played[k]; const s = sid && GS_SESSIONS[sid];
                  const open = () => (sid ? gs.go('session', { id: sid }) : gs.play('the ' + GS_PUZZLES[k].name + ' from ' + d.short, k + '-today'));
                  return (
                    <button key={k} type="button" className="gs-pz-item" onClick={open}>
                      <span className="gs-strong">{GS_PUZZLES[k].name}</span>
                      <span className="gs-small">{s ? s.result : 'Not played'}</span>
                    </button>
                  );
                })}
              </div>
            ) : <p className="gs-muted">{GS_PUZZLE_ORDER.map((k) => GS_PUZZLES[k].name).join(' · ')}</p>}
          </div>
        ))}
      </div>
    </section>
  );
};

// Shared with History (screen 8).
const GsStreakPanel = ({ paying }) => (
  <DS.Card style={{ gap: 16, justifyItems: 'stretch' }}>
    {paying ? (
      <div className="gs-streak">
        <div className="gs-stack-sm"><span className="gs-label">YOUR STREAK</span><span className="gs-figure gs-num-text">Streak: 3 days</span></div>
        <div className="gs-stack-sm"><span className="gs-label">YOUR RECORD</span><span className="gs-figure gs-num-text">Record: 41 solved, 6 missed</span></div>
        <div className="gs-stack-sm">
          <span className="gs-label">LAST SEVEN DAYS</span>
          <div className="gs-days" role="img" aria-label="Played on six of the last seven days, missed four days ago">
            {Array.from({ length: 7 }, (_, i) => <i key={i} className={i === 2 ? undefined : 'is-on'} />)}
          </div>
        </div>
      </div>
    ) : (
      <div className="gs-stack-sm" style={{ justifyItems: 'start' }}>
        <div className="gs-title-row"><span className="gs-label">YOUR STREAK · YOUR RECORD</span><GsPassTag /></div>
        <p>Your streak and record are kept with the Pass.</p>
      </div>
    )}
  </DS.Card>
);

Object.assign(window, { GsPuzzleCard, GsEarlier, GsStreakPanel, GsResultTag });
