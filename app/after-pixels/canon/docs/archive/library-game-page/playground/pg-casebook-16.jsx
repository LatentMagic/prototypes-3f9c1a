// Playground: Casebook, option 16. Loads after pg-casebook-13-15.jsx and adds 16 to its strip.
// Built from the review of 13 to 15 (review-2-notes.md): 13's layout, streak and case list; 15's This week;
// achievements before your cases; your cases last, lighter, with the same spacing as achievements.

// This week, from 15, written in sentences. Finished keeps the turns bar so both states have the same shape.
// Share and the turns link share one row of actions, so nothing squeezes beside the title on a phone.
const C16Now = ({ c }) => {
  const gs = useGs();
  return (
    <section className="c13-card c16-now">
      <div className="c13-top">
        <div className="gs-stack-xs"><span className="gs-label">THIS WEEK</span><h2 className="mcp-t-sec">{c.title}</h2></div>
        {!c.live && <span className="c13-big"><C13V c={c} /></span>}
      </div>
      <p>{c.live
        ? 'You’ve used ' + c.turns + ' of 16 turns and exposed ' + c.lies + ' lies. You haven’t named the killer yet.'
        : 'You used ' + c.turns + ' of 16 turns and exposed ' + c.lies + ' of ' + c.total + ' lies.'}</p>
      <DS.ProgressBar label={c.turns + ' of 16 turns used'} value={c.turns} max={16} showValue={false} />
      <div className="c16-foot">
        <div className="c16-acts">
          {!c.live && <C7Share c={c} />}
          <DS.TextLink onClick={() => cbGo(gs, c.id)}>{c.live ? 'See your turns so far' : 'See every turn'}</DS.TextLink>
        </div>
        <span className="gs-muted">{'The next case arrives on ' + CB_NEXT + '.'}</span>
      </div>
    </section>
  );
};

// 13's run of weeks. Under 480px it shows the last six, and the first of those carries its month.
const C16Run = () => {
  const ws = c13Weeks(10);
  return (
    <section className="c13-card">
      <div className="c13-streakhead"><span className="gs-figure">{CB_STREAK.n}</span><span className="gs-strong">weeks in a row</span></div>
      <div className="c13-run c16-run" role="img" aria-label={'The last 10 weeks, oldest first: ' + ws.map((w) => w.day + ' ' + w.month + (w.played ? ' played' : ' missed')).join(', ')}>
        {ws.map((w, i) => {
          const join = i > 0 && w.played && ws[i - 1].played;
          const newMon = i === 0 || ws[i - 1].mon !== w.mon;
          return (
            <span key={w.id} className={'c13-wk' + (w.played ? ' is-on' : '') + (join ? ' is-join' : '') + (w.now ? ' is-now' : '') + (i === 4 ? ' is-cut' : '')}>
              <em><b className="c16-mw">{newMon ? w.mon : ''}</b><b className="c16-mn">{newMon || i === 4 ? w.mon : ''}</b></em><i /><span>{w.day}</span>
            </span>
          );
        })}
      </div>
      <C13Legend />
    </section>
  );
};

// Your cases: four, each a title over its date and result. No turns or lies here; the case page has them.
const C16Row = ({ c }) => {
  const gs = useGs();
  const cells = <>
    <span className="c13-title">{c.title}</span>
    <span className="c13-meta"><span className="c13-date">{c13Short(c.week)}</span><span className="c13-res"><CbStatus c={c} /></span></span>
  </>;
  return c.played
    ? <button type="button" className="c13-row c16-row" onClick={() => cbGo(gs, c.id)}>{cells}<CbChev /></button>
    : <div className="c13-row c16-row is-off">{cells}<span className="c13-chev-space" /></div>;
};
const C16Cases = ({ mode }) => {
  const gs = useGs();
  return (
    <section className="c13-card">
      <div className="c13-sechead"><h2 className="mcp-t-card">Your cases</h2><DS.TextLink onClick={() => cbGo(gs, 'all')}>All cases</DS.TextLink></div>
      <ul className="cb-list c16-list">{c10Hist(mode).slice(0, 4).map((c) => <li key={c.id}><C16Row c={c} /></li>)}</ul>
    </section>
  );
};

const C16Lay = ({ c, mode }) => (
  <div className="c16-lay">
    <C16Now c={c} />
    <C16Run />
    <C13Ach mode={mode} fit="two" />
    <C16Cases mode={mode} />
  </div>
);

C13_OPTS.push({ id: '16', name: 'Desk, revised', Body: C16Lay, way: 'pages',
  idea: '13’s layout with 15’s This week, shortened: the result sits beside the title, and Share, the turns link and the next case share one row. Finished keeps the turns bar. Achievements come before your cases at every width; your cases come last and show four, each with its date and result.',
  streak: '13’s timeline of weeks. On a phone it shows the last six.', all: '13’s numbered pages of twelve.' });
try { if (!localStorage.getItem('pg_cb16_seen')) { localStorage.setItem('pg_cb16_seen', '1'); c13Set({ opt: '16' }); } } catch (e) {}
