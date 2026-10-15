// ============================================================================
// Playground: should the streak strip show a failed edition differently from a missed one?
// docs/specs/failed-vs-missed-strip/playground/. Option board: the same 14 seeded days, three treatments,
// each at desktop and phone width. The strip's markup and classes are LbRun's (app/gs-library.jsx);
// the one change every option shares is that a day is a button that opens its edition's record.
// ============================================================================
const DS = window.MCPGameStoreDesignSystem_ef1abd;

// 14 days of Daily Word, oldest first. k: 'ok' completed, 'bad' failed (played and lost), 'none' missed.
const PG_SEQ = ['ok', 'ok', 'bad', 'ok', 'none', 'ok', 'bad', 'ok', 'bad', 'none', 'ok', 'ok', 'ok', 'ok'];
const PG_ANS = ['CHAIN', 'PLANT', 'GHOST', 'FROST', 'BRAVE', 'MOUSE', 'QUILT', 'SHORE', 'VIGOR', 'NYMPH', 'CLOUD', 'TRAIN', 'SPARK', 'STILL'];
const PG_DAYS = PG_SEQ.map((k, i) => {
  const d = new Date(2026, 9, 2 + i);
  const wd = d.toLocaleDateString('en-GB', { weekday: 'long' });
  const month = d.toLocaleDateString('en-GB', { month: 'long' });
  const g = 3 + (i % 4);
  return {
    id: 'd' + i, k, n: 199 + i, day: String(d.getDate()), mon: month.slice(0, 3), month, wd, now: i === PG_SEQ.length - 1,
    label: k === 'ok' ? 'Solved in ' + g + ' of 6' : k === 'bad' ? 'Failed' : 'Not played',
    line: k === 'ok' ? 'You found ' + PG_ANS[i] + ' on guess ' + g + '.' : k === 'bad' ? 'You used all six guesses. The word was ' + PG_ANS[i] + '.' : 'This word ended before you played it.',
  };
});
// The strip shows the last 10 (lbRunOf); under 480px the last six (the app's container rule).
const PG_RUN = PG_DAYS.slice(-10);
const pgStreak = (() => { let n = 0; for (let i = PG_DAYS.length - 1; i >= 0; i--) { if (PG_DAYS[i].k !== 'ok') break; n += 1; } return n; })();

const PG_OPTS = [
  { n: 1, name: 'Two states, as now', legend: [['is-on', 'Completed'], ['', 'Not completed']],
    stance: 'The strip is about the streak, and both failed and missed break it, so it shows only what the streak counts.',
    cost: 'A player can’t tell from the strip which days they played and lost. That lives in History and the record.' },
  { n: 2, name: 'Three states, each its own mark', legend: [['is-on', 'Completed'], ['pg-bad', 'Failed'], ['', 'Not played']],
    stance: 'Every day says what happened: completed, played and lost, or not played.',
    cost: 'A third mark to learn, and the strip starts reporting results as well as the streak. Revised 15 October: no red; the legend’s failed square has a full X through it, the strip keeps its smaller cross.' },
  { n: 3, name: 'Three states, quiet', legend: [['is-on', 'Completed'], ['', 'Not completed'], ['pg-dot', 'Failed']],
    stance: 'Failed and not played share the broken look, as the streak treats them alike; a small dot marks the days you played.',
    cost: 'The dot is small: easy to miss at a glance, and it needs the legend’s third entry to mean anything.' },
];

const pgKindWord = (opt, k) => (k === 'ok' ? 'completed' : opt === 1 ? 'not completed' : opt === 2 ? (k === 'bad' ? 'failed' : 'not played') : (k === 'bad' ? 'not completed, failed' : 'not completed'));

// LbRun's markup, with each day a button and the option's state classes.
const PgRun = ({ opt, onOpen }) => {
  const weeks = PG_RUN; const cut = weeks.length - 6;
  return (
    <section className="lb-card lb-runcard">
      <div className="lb-streakhead"><span className="gs-figure">{pgStreak}</span><span className="gs-strong">days in a row</span></div>
      <div className="lb-runbody">
        <div className="lb-run" role="list" aria-label={'The last ' + weeks.length + ' days, oldest first'} style={{ gridTemplateColumns: 'repeat(' + weeks.length + ', minmax(0, 1fr))' }}>
          {weeks.map((w, i) => {
            const on = w.k === 'ok';
            const join = i > 0 && on && weeks[i - 1].k === 'ok';
            const newMon = i === 0 || weeks[i - 1].mon !== w.mon;
            const st = opt === 2 && w.k === 'bad' ? ' pg-bad' : opt === 3 && w.k === 'bad' ? ' pg-dot' : '';
            return (
              <button type="button" role="listitem" key={w.id} onClick={() => onOpen(w)}
                aria-label={w.wd + ' ' + w.day + ' ' + w.month + ', ' + pgKindWord(opt, w.k) + '. Open the record.'}
                className={'lb-wk pg-wk' + (on ? ' is-on' : '') + st + (join ? ' is-join' : '') + (w.now ? ' is-now' : '') + (i < cut ? ' is-early' : '') + (i === cut ? ' is-cut' : '')}>
                <em><b className="lb-mw">{newMon ? w.mon : ''}</b><b className="lb-mn">{newMon || i === cut ? w.mon : ''}</b></em>
                <i>{opt === 2 && w.k === 'bad' && <DS.Icon name="close" size={14} />}</i>
                <span>{w.day}</span>
              </button>
            );
          })}
        </div>
        <ul className="lb-legend">{PG_OPTS[opt - 1].legend.map(([c, t]) => <li key={t}><i className={c}>{c === 'pg-bad' && <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M0 0L12 12M12 0L0 12" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>}</i>{t}</li>)}</ul>
      </div>
    </section>
  );
};

// The edition's record, in the app's panel (a bottom sheet under 640px).
const PgRecord = ({ w, onClose }) => {
  const last = React.useRef(null); if (w) last.current = w; const e = last.current;
  if (!e) return null;
  const icon = e.k === 'ok' ? 'check' : e.k === 'bad' ? 'error' : null;
  return (
    <DS.Popup kind="panel" open={!!w} onClose={onClose} title={'Daily Word #' + e.n}>
      <div className="gs-stack-md">
        <span className="gs-label">{(e.wd + ' ' + e.day + ' ' + e.month).toUpperCase()}</span>
        <span className={'lb-v is-' + e.k + ' gs-strong'}>{icon && <DS.Icon name={icon} size={20} />}{e.label}</span>
        <p style={{ margin: 0 }}>{e.line}</p>
      </div>
    </DS.Popup>
  );
};

const PgCell = ({ o, onOpen }) => (
  <article className="pg-opt" id={'opt-' + o.n}>
    <header className="gs-stack-xs">
      <h2 className="pg-h2"><span className="pg-num">{o.n}</span>{o.name}</h2>
      <details className="pg-why"><summary>Stance and cost</summary><p>{o.stance}</p><p><b>Cost.</b> {o.cost}</p></details>
    </header>
    <div className="gs-stack-sm"><span className="pg-cap">Desktop</span><div className="pg-scroll"><div className="gs-root pg-frame pg-desk"><PgRun opt={o.n} onOpen={onOpen} /></div></div></div>
    <div className="gs-stack-sm"><span className="pg-cap">Phone, 390 wide</span><div className="gs-root pg-frame pg-phone"><PgRun opt={o.n} onOpen={onOpen} /></div></div>
  </article>
);

const PgApp = () => {
  const [open, setOpen] = React.useState(null);
  return (
    <div className="gs-root pg-page">
      <main className="pg-main">
        <div className="gs-stack-sm pg-lede">
          <h1 className="gs-h1">Failed and not played on the streak strip</h1>
          <p className="gs-muted">Daily Word, 2 to 15 October: two failed days and two not played in view, and a streak of {pgStreak}. The strip shows the last 10 days, and the last 6 on a phone. Tap any day to open its record. Streak rules, History and session labels are unchanged.</p>
        </div>
        <div className="pg-grid">{PG_OPTS.map((o) => <PgCell key={o.n} o={o} onOpen={setOpen} />)}</div>
      </main>
      <PgRecord w={open} onClose={() => setOpen(null)} />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<PgApp />);
