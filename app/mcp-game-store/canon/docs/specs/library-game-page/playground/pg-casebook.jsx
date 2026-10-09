// Playground: the library game page, Casebook only. Options 4 to 6 (1 to 3 live in pg-library.jsx).
// Mounts the real app; overrides Casebook's `record` route and the demo bar.
// Ratified 2026-10-08: the history is a plain clickable list; each row opens its session; no action inside a row.
const CB_KEY = 'pg_library_casebook_v1';
let cbState = { opt: '4', viewer: 'pass', open: true, ...(() => { try { return JSON.parse(localStorage.getItem(CB_KEY)) || {}; } catch (e) { return {}; } })() };
const cbSubs = new Set();
const cbSet = (p) => { cbState = { ...cbState, ...p }; try { localStorage.setItem(CB_KEY, JSON.stringify(cbState)); } catch (e) {} cbSubs.forEach((f) => f(cbState)); };
const useCb = () => { const [s, setS] = React.useState(cbState); React.useEffect(() => { cbSubs.add(setS); return () => cbSubs.delete(setS); }, []); return s; };

// ---- Seed: 17 weeks of cases, newest first. Titles and records are invented. ----------
// Turn codes: F search found evidence · N search, nothing new · Q question · H evidence shown, story held · B lie exposed
const CB_POOL = {
  places: ['the boathouse', 'the kitchen', 'the library', 'the guest wing', 'the cellar', 'the garden', 'the study', 'the landing'],
  evidence: ['a wet oilskin', 'the bar ledger', 'a torn letter', 'the ferry notice', 'a green scarf', 'a spare key', 'a muddy boot', 'the guest book'],
  topics: ['where they were at ten', 'the argument at dinner', 'the missing key', 'who they saw on the stairs', 'the will'],
};
const CB_RAW = [
  ['c1005', '5 October', 'October', 'The Widow’s Lantern', ['Ada Quill', 'Rev. Hale', 'Nell Marsh'], 'FQBNQFB', null, 5],
  ['c0928', '28 September', 'September', 'The Night Train to Fort William', ['Iris Crane', 'Major Doyle', 'Felix Rowe'], 'FQBNFBQHBFB', 'right', 5],
  ['c0921', '21 September', 'September', 'A Quiet Week at Hollins Farm', ['Ruth Hollins', 'Sam Dyer', 'Joan Pell'], 'NQFHQNFQHNQFBHQN', 'wrong', 4],
  ['c0914', '14 September', 'September', 'The Bell Ringer’s Fall', null, null, null, 4],
  ['c0907', '7 September', 'September', 'Three Keys to the Vestry', ['Canon Ashe', 'Mary Lusk', 'Tom Brede'], 'FQNHBQFNQFHBQN', 'right', 4],
  ['c0831', '31 August', 'August', 'The Regatta Dinner', ['Lady Vane', 'Kit Morrow', 'Ellis Shaw'], 'FBQFBNQBF', 'right', 4],
  ['c0824', '24 August', 'August', 'Low Tide at Saltcote', ['Peg Tolley', 'Arthur Wick', 'Dina Fold'], 'QFNBQFHQNBFQ', 'wrong', 5],
  ['c0817', '17 August', 'August', 'The Orchard Gate', null, null, null, 4],
  ['c0810', '10 August', 'August', 'The Last Waltz at the Grand', ['Vera Lowe', 'Max Arden', 'Paul Cray'], 'NQFHQFBNQHQFBNQH', 'wrong', 5],
  ['c0803', '3 August', 'August', 'A Death in the Reading Room', ['Prof. Lind', 'Hester Gray', 'Owen Pryce'], 'FQBQNFBHQFBQN', 'wrong', 4],
  ['c0727', '27 July', 'July', 'The Lighthouse Keeper’s Log', null, null, null, 3],
  ['c0720', '20 July', 'July', 'Snowed In at Carrick Lodge', ['Una Carrick', 'Leo Strand', 'Bea Oakes'], 'FBQNFBQHFB', 'wrong', 4],
  ['c0713', '13 July', 'July', 'The Gardener’s Alibi', ['Jem Rook', 'Alice Penn', 'Hugh Tate'], 'QFNQBFHQNFQBNQF', 'wrong', 3],
  ['c0706', '6 July', 'July', 'The Painted Ferry', null, null, null, 4],
  ['c0629', '29 June', 'June', 'Midsummer at Ashby Hall', ['Lord Ashby', 'Cora Finch', 'Ned Pole'], 'NQFQHNQFHQNFBQHN', 'wrong', 4],
  ['c0622', '22 June', 'June', 'The Copper Kettle', null, null, null, 4],
  ['c0615', '15 June', 'June', 'The Last Night at Gull Point', ['Maeve Doyle', 'Tobias Pike', 'Dr. Celia Rourke'], 'FQBNFBQFBHFBN', 'right', 5],
];
const cbRecord = (seq, cast, verdict, k) => {
  const P = CB_POOL; let ev = k % P.evidence.length; let last = P.evidence[ev];
  const rows = Array.from(seq).map((c, i) => {
    const who = cast[(i + k) % 3]; const place = P.places[(i + k) % P.places.length];
    if (c === 'F') { last = P.evidence[ev++ % P.evidence.length]; return { c, act: 'Search', what: place, out: 'Found ' + last }; }
    if (c === 'N') return { c, act: 'Search', what: place, out: 'Nothing new' };
    if (c === 'Q') return { c, act: 'Question', what: who + ', about ' + P.topics[(i + k) % P.topics.length], out: 'Answered' };
    return { c, act: 'Show evidence', what: last + ' to ' + who, out: c === 'B' ? 'Exposed a lie' : 'The story held' };
  });
  if (verdict) rows.push({ c: 'A', act: 'Accusation', what: cast[k % 3], out: verdict === 'right' ? 'Right' : 'Wrong' });
  return rows;
};
const CB_CASES = CB_RAW.map(([id, week, month, title, cast, seq, verdict, total], k) => {
  const played = !!seq;
  return { id, week, month, title, played, live: played && !verdict, verdict, total,
    turns: played ? seq.length : 0, lies: played ? Array.from(seq).filter((c) => c === 'B').length : 0,
    seq: seq || '', rec: played ? cbRecord(seq, cast, verdict, k) : [] };
});
const cbCase = (id) => CB_CASES.find((c) => c.id === id);
const CB_LIVE = CB_CASES[0];
const CB_NEXT = 'Monday 12 October';
const CB_STREAK = { n: 3, strip: [['17 Aug', 0], ['24 Aug', 1], ['31 Aug', 1], ['7 Sep', 1], ['14 Sep', 0], ['21 Sep', 1], ['28 Sep', 1], ['5 Oct', 1]] };
const CB_ENDED = '18 September';
const CB_ACH = [
  { k: 'first', cls: 'Discovery', n: 'First lie exposed', how: 'Expose a suspect’s lie with proof.', got: '15 June' },
  { k: 'solved', cls: 'Mastery', n: 'Case solved', how: 'Name the killer.', got: '15 June' },
  { k: 'eleven', cls: 'Mastery', n: 'Solved in eleven turns', how: 'Name the killer using eleven turns or fewer.', got: '31 August' },
  { k: 'every', cls: 'Mastery', n: 'Every lie exposed', how: 'Expose every lie in one case.' },
  { k: 'five', cls: 'Completion', n: 'Five cases solved', how: 'Solve five cases.', of: 5, have: 4, endedHave: 3 },
];
// Badges: the system's flat shapes on the cover grounds. Still to earn: the same shapes in outline.
const CB_BADGE = {
  first: ['#1D1B3A', [['path', 'd="M7 40L21 12L35 40Z"', '#F2EBE0'], ['rect', 'x="28" y="7" width="13" height="13"', '#D66847']]],
  solved: ['#163328', [['circle', 'cx="24" cy="20" r="11"', '#4CC38A'], ['rect', 'x="10" y="36" width="28" height="5"', '#F2EBE0']]],
  eleven: ['#1D1B3A', [['rect', 'x="7" y="28" width="7" height="13"', '#328A88'], ['rect', 'x="17" y="20" width="7" height="21"', '#328A88'], ['rect', 'x="27" y="12" width="7" height="29"', '#328A88'], ['circle', 'cx="40" cy="9" r="4"', '#F2EBE0']]],
  every: ['#421A28', [['path', 'd="M7 41V17A24 24 0 0 1 31 41Z"', '#E5A63B'], ['rect', 'x="33" y="7" width="8" height="8"', '#A390B2'], ['rect', 'x="33" y="19" width="8" height="8"', '#A390B2']]],
  five: ['#163328', [5, 13, 21, 29, 37].map((x) => ['rect', 'x="' + x + '" y="12" width="5" height="24"', '#E5A63B'])],
};
const cbBadgeSvg = (k, got) => {
  const [bg, shapes] = CB_BADGE[k];
  const body = shapes.map(([t, a, c]) => '<' + t + ' ' + a + (got ? ' fill="' + c + '"' : ' fill="none" stroke="#918B80" stroke-width="1.5"') + '/>').join('');
  return '<svg viewBox="0 0 48 48" aria-hidden="true">' + (got ? '<rect width="48" height="48" fill="' + bg + '"/>' : '') + body + '</svg>';
};
const CbBadge = ({ k, got }) => <span className={'cb-badge' + (got ? '' : ' is-todo')} dangerouslySetInnerHTML={{ __html: cbBadgeSvg(k, got) }} />;

// ---- Share text: three ways to write the same result ------------------------------
const CB_LINK = 'https://platform.example/casebook';
const cbVerdict = (c) => (c.verdict === 'right' ? '✅ Solved' : '❌ Unsolved');
const cbCells = (c, map, unused) => { const a = Array.from(c.seq).map((x) => map[x]); while (a.length < 16) a.push(unused); return a; };
const CB_SHARE = {
  words: (c) => ['Casebook · ' + c.title, cbVerdict(c) + ' · ' + c.turns + ' of 16 turns · ' + c.lies + ' of ' + c.total + ' lies exposed', CB_LINK],
  moves: (c) => { const a = cbCells(c, { F: '🔍', N: '🔍', Q: '💬', H: '🧾', B: '💥' }, '▫️'); return ['Casebook · ' + c.title, a.slice(0, 8).join(''), a.slice(8).join(''), cbVerdict(c) + ' · ' + c.turns + ' of 16 turns · ' + c.lies + ' lies exposed', CB_LINK]; },
  grid: (c) => { const a = cbCells(c, { F: '🟨', N: '⬜', Q: '⬜', H: '⬜', B: '🟩' }, '⬛'); return ['Casebook · ' + c.title, a.slice(0, 8).join(''), a.slice(8).join(''), cbVerdict(c) + ' in ' + c.turns + ' of 16 turns', CB_LINK]; },
};
const cbCopyFallback = (text) => {
  const ta = document.createElement('textarea');
  ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
  document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
  let ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta); return ok;
};
// The preview iframe can refuse the Clipboard API silently; the fallback runs inside the same click.
const cbCopy = (lines) => { const t = lines.join('\n'); if (!cbCopyFallback(t) && navigator.clipboard) navigator.clipboard.writeText(t).catch(() => {}); };
const CbCopyBtn = ({ lines, variant }) => {
  const [done, setDone] = React.useState(false);
  React.useEffect(() => { if (!done) return undefined; const t = setTimeout(() => setDone(false), 2400); return () => clearTimeout(t); }, [done]);
  return <DS.Button variant={variant || 'main'} done={done} doneLabel="Copied" onClick={() => { cbCopy(lines); setDone(true); }}>Copy</DS.Button>;
};
const CbShareText = ({ lines }) => <div className="cb-share-text">{lines.map((l, i) => <span key={i} className={i === lines.length - 1 ? 'cb-share-link' : ''}>{l}</span>)}</div>;

// ---- Shared parts -----------------------------------------------------------------
const cbMode = (gs) => (gs.view === 'pass' ? 'pass' : gsLapsed(gs) ? 'ended' : 'free');
const cbList = (mode) => CB_CASES.filter((c) => c.played || mode === 'pass');
const cbMonths = (list) => list.reduce((a, c) => { const g = a[a.length - 1]; if (g && g.m === c.month) g.cases.push(c); else a.push({ m: c.month, cases: [c] }); return a; }, []);
const cbGo = (gs, sid) => gs.go('casebook', sid ? { page: 'record', sid } : { page: 'record' });
const CbChev = () => <DS.Icon name="back" size={16} className="cb-chev" style={{ transform: 'rotate(180deg)' }} />;

const CbHead = () => {
  const gs = useGs(); const g = GS_GAMES.casebook;
  return (
    <section className="rf-head">
      <span><GsCover art={g.art} /></span>
      <div className="gs-stack-sm" style={{ justifyItems: 'start' }}>
        <h1 className="gs-h1">{g.name}</h1>
        <DS.TextLink onClick={() => gs.go('casebook')}>{'About ' + g.name}</DS.TextLink>
      </div>
    </section>
  );
};
const CbStatus = ({ c }) => {
  if (!c.played) return <span className="cb-st is-none">Not played</span>;
  if (c.live) return <span className="cb-st">In progress</span>;
  return c.verdict === 'right'
    ? <span className="cb-st is-ok"><DS.Icon name="check" size={16} />Solved</span>
    : <span className="cb-st is-bad"><DS.Icon name="error" size={16} />Unsolved</span>;
};
const CbStreak = ({ compact }) => (
  <div className="cb-streak">
    <span className="gs-label">WEEKS IN A ROW</span>
    <span className="cb-streak-n"><span className="gs-figure">{CB_STREAK.n}</span>{!compact && <span className="gs-small">You’ve played every week since 21 September.</span>}</span>
    <div className="gs-days" role="img" aria-label={'Last 8 weeks: played ' + CB_STREAK.strip.filter((x) => x[1]).length}>
      {CB_STREAK.strip.map(([d, v]) => <i key={d} title={d} className={v ? 'is-on' : ''} />)}
    </div>
  </div>
);
const CbThisWeek = ({ onOpen }) => (
  <div className="gs-stack-md">
    <div className="gs-stack-xs">
      <span className="gs-label">THIS WEEK’S CASE</span>
      <h2 className="mcp-t-card">{CB_LIVE.title}</h2>
    </div>
    <DS.ProgressBar label={CB_LIVE.turns + ' of 16 turns used'} value={CB_LIVE.turns} max={16} showValue={false} />
    <p>You’ve exposed {CB_LIVE.lies} lies so far. The accusation is still to make.</p>
    <div className="cb-tw-foot">
      <DS.TextLink onClick={onOpen}>See your turns so far</DS.TextLink>
      <span className="gs-small">{'Next case on ' + CB_NEXT + '.'}</span>
    </div>
  </div>
);
const CbAchFree = () => {
  const gs = useGs();
  return <p className="gs-muted">Achievements come with the Pass. <button type="button" className="gs-inlink" onClick={() => gs.go('pass')}>What’s included</button></p>;
};
const cbGot = (mode) => CB_ACH.filter((a) => a.got);
const CbStrip = ({ c, mini }) => (
  <span className={mini ? 'cb-mini' : 'cb-strip'} aria-hidden={mini || undefined} role={mini ? undefined : 'img'}
    aria-label={mini ? undefined : c.turns + ' of 16 turns used, ' + c.lies + ' lies exposed'}>
    {Array.from({ length: 16 }, (_, i) => { const x = c.seq[i]; return <i key={i} className={!x ? 'is-u' : x === 'B' ? 'is-b' : x === 'F' ? 'is-f' : 'is-o'} />; })}
  </span>
);
const CbLegend = () => (
  <ul className="cb-legend">
    <li><i className="is-b" />Lie exposed</li><li><i className="is-f" />Found evidence</li><li><i className="is-o" />Other turn</li><li><i className="is-u" />Not used</li>
  </ul>
);

// The session itself. `share` is how each option reaches the copy text.
const CbSession = ({ c, share, back, onBack }) => {
  const [open, setOpen] = React.useState(false);
  const lines = !c.live && share !== 'none' ? CB_SHARE[share === 'inline' ? 'grid' : share](c) : null;
  return (
    <div className="gs-stack-md" style={{ gap: 24 }}>
      <div><button type="button" className="lg-back" onClick={onBack}><DS.Icon name="back" size={20} />{back}</button></div>
      <div className="cb-sess-head">
        <div className="gs-stack-xs">
          <span className="gs-label">{c.live ? 'THIS WEEK' : 'WEEK OF ' + c.week.toUpperCase()}</span>
          <h2 className="gs-h1">{c.title}</h2>
        </div>
        {lines && share !== 'inline' && <div><DS.Button variant="secondary" onClick={() => setOpen(true)}>Share</DS.Button></div>}
      </div>
      <DS.Card style={{ gap: 16, justifyItems: 'stretch' }}>
        <dl className="cb-figs">
          <div><dt className="gs-small">Result</dt><dd><CbStatus c={c} /></dd></div>
          <div><dt className="gs-small">Turns used</dt><dd>{c.turns} of 16</dd></div>
          <div><dt className="gs-small">Lies exposed</dt><dd>{c.live ? c.lies + ' so far' : c.lies + ' of ' + c.total}</dd></div>
        </dl>
        <CbStrip c={c} />
        <CbLegend />
      </DS.Card>
      {lines && share === 'inline' && (
        <div className="cb-share">
          <div className="cb-share-top"><span className="gs-label">SHARE</span><span className="gs-small">It hides the killer and the suspects.</span></div>
          <CbShareText lines={lines} />
          <div className="cb-share-foot"><span className="gs-small">The link opens the Casebook page.</span><CbCopyBtn lines={lines} /></div>
        </div>
      )}
      <section className="gs-stack-sm">
        <h3 className="mcp-t-card">{c.live ? 'Your turns so far' : 'Every turn'}</h3>
        <ol className="cb-rec">
          {c.rec.map((r, i) => (
            <li key={i} className={r.c === 'A' ? 'is-acc' : ''}>
              <span className="cb-rec-n">{r.c === 'A' ? '' : i + 1}</span>
              <span className="gs-stack-xs"><span><b>{r.act}</b> · {r.what}</span>
                <span className={'gs-small' + (r.c === 'B' || r.out === 'Right' ? ' cb-rec-hit' : r.out === 'Wrong' ? ' cb-rec-miss' : '')}>{r.out}</span></span>
            </li>
          ))}
        </ol>
      </section>
      {lines && share !== 'inline' && (
        <DS.Popup open={open} onClose={() => setOpen(false)} kind="panel" title="Share your result"
          actions={<><DS.Button variant="secondary" onClick={() => setOpen(false)}>Close</DS.Button><CbCopyBtn key={c.id} lines={lines} /></>}>
          <CbShareText lines={lines} />
          <p className="gs-small">It hides the killer and the suspects. The link opens the Casebook page.</p>
        </DS.Popup>
      )}
    </div>
  );
};

// ---- 4 · Briefing: this week leads; cases beside streak and achievements ----------
const CbAchGrid = ({ mode }) => {
  const items = mode === 'ended' ? cbGot() : CB_ACH;
  return (
    <div className="gs-stack-md">
      {mode === 'ended' && <p className="gs-small">{'Your Pass ended on ' + CB_ENDED + '. What you earned stays.'}</p>}
      <ul className="cb-achgrid">
        {items.map((a) => (
          <li key={a.k}>
            <CbBadge k={a.k} got={!!a.got} />
            <span className="gs-stack-xs">
              <span className="cb-ach-n">{a.n}</span>
              <span className="gs-small">{a.got ? 'Earned ' + a.got : a.of ? a.have + ' of ' + a.of : a.how}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
const CbBriefing = () => {
  const gs = useGs(); const mode = cbMode(gs);
  const [all, setAll] = React.useState(false);
  const list = cbList(mode); const shown = all ? list : list.slice(0, 6);
  return (
    <main className="gs-wrap gs-main">
      <CbHead />
      <div className="cb4">
        <div className="gs-stack-md" style={{ gap: 24 }}>
          <DS.Card style={{ gap: 16, justifyItems: 'stretch' }}><CbThisWeek onOpen={() => cbGo(gs, CB_LIVE.id)} /></DS.Card>
          <section className="cb-box">
            <div className="cb-box-head"><h2 className="mcp-t-card">Your cases</h2></div>
            {cbMonths(shown).map((g) => (
              <div key={g.m}>
                <div className="cb-month gs-label">{g.m.toUpperCase()}</div>
                <ul className="cb-list">
                  {g.cases.map((c) => (
                    <li key={c.id}>{c.played
                      ? <button type="button" className="cb-row" onClick={() => cbGo(gs, c.id)}>
                          <span className="gs-stack-xs"><span className="cb-row-t">{c.title}</span><span className="gs-small">{'Week of ' + c.week}</span></span>
                          <CbStatus c={c} /><CbChev />
                        </button>
                      : <div className="cb-row is-off"><span className="gs-stack-xs"><span className="cb-row-t">{c.title}</span><span className="gs-small">{'Week of ' + c.week}</span></span><CbStatus c={c} /><span /></div>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {!all && list.length > 6 && <div className="cb-box-foot"><DS.Button variant="secondary" onClick={() => setAll(true)}>Show earlier cases</DS.Button></div>}
          </section>
        </div>
        <aside className="cb4-side">
          <DS.Card style={{ gap: 16, justifyItems: 'stretch' }}><CbStreak /></DS.Card>
          <DS.Card style={{ gap: 16, justifyItems: 'stretch' }}>
            <div className="gs-sec-head"><h2 className="mcp-t-card">Achievements</h2>{mode === 'pass' && <span className="gs-small">{cbGot().length + ' of ' + CB_ACH.length}</span>}</div>
            {mode === 'free' ? <CbAchFree /> : <CbAchGrid mode={mode} />}
          </DS.Card>
        </aside>
      </div>
    </main>
  );
};

// ---- 5 · Register: one full-width table of every case; achievements as a row -----
const CbRegister = () => {
  const gs = useGs(); const mode = cbMode(gs); const list = cbList(mode);
  return (
    <main className="gs-wrap gs-main">
      <div className="cb5-top"><CbHead /><div className="cb5-streak"><CbStreak compact /></div></div>
      <section className="gs-stack-md">
        <div className="gs-sec-head"><h2 className="mcp-t-sec">Your cases</h2><span className="gs-small">{'A new case arrives every Monday. The next is on ' + CB_NEXT.replace('Monday ', '') + '.'}</span></div>
        <div className="cb-box">
          <div className="cb5-row cb5-th" aria-hidden="true"><span>Week of</span><span>Case</span><span>Result</span><span>Turns</span><span>Lies exposed</span><span /></div>
          {cbMonths(list).map((g) => (
            <div key={g.m}>
              <div className="cb-month gs-label">{g.m.toUpperCase()}</div>
              <ul className="cb-list">
                {g.cases.map((c) => {
                  const meta = ['Week of ' + c.week, c.played && c.turns + ' of 16 turns', c.played && (c.live ? c.lies + ' lies so far' : c.lies + ' of ' + c.total + ' lies')].filter(Boolean).join(' · ');
                  const cells = <>
                    <span className="cb5-c cb5-wide">{c.week}</span>
                    <span className="gs-stack-xs"><span className="cb-row-t">{c.title}</span><span className="gs-small cb5-narrow">{meta}</span>
                      {c.live && <span className="cb5-bar"><DS.ProgressBar label="" value={c.turns} max={16} showValue={false} /></span>}</span>
                    <CbStatus c={c} />
                    <span className="cb5-c cb5-wide">{c.played ? c.turns + ' of 16' : ''}</span>
                    <span className="cb5-c cb5-wide">{c.played ? (c.live ? c.lies + ' so far' : c.lies + ' of ' + c.total) : ''}</span>
                  </>;
                  return <li key={c.id}>{c.played
                    ? <button type="button" className={'cb5-row' + (c.live ? ' is-live' : '')} onClick={() => cbGo(gs, c.id)}>{cells}<CbChev /></button>
                    : <div className="cb5-row is-off">{cells}<span /></div>}</li>;
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="gs-stack-md">
        <div className="gs-sec-head"><h2 className="mcp-t-sec">Achievements</h2>{mode === 'pass' && <span className="gs-small">{cbGot().length + ' of ' + CB_ACH.length + ' earned'}</span>}</div>
        {mode === 'free' ? <CbAchFree /> : <>
          {mode === 'ended' && <p className="gs-small">{'Your Pass ended on ' + CB_ENDED + '. Your progress stopped there.'}</p>}
          <div className="cb-achrow" tabIndex={0} role="region" aria-label="Achievements">
            {CB_ACH.map((a) => (
              <DS.Card key={a.k} style={{ gap: 12, justifyItems: 'start', alignContent: 'start' }}>
                <CbBadge k={a.k} got={!!a.got} />
                <span className="gs-stack-xs"><span className="gs-small">{a.cls}</span><span className="cb-ach-n">{a.n}</span></span>
                {a.got ? <span className="gs-small">{'Earned ' + a.got}</span>
                  : a.of ? <span className="cb-ach-bar"><DS.ProgressBar label={(mode === 'ended' ? a.endedHave : a.have) + ' of ' + a.of + (mode === 'ended' ? ', stopped' : '')} value={mode === 'ended' ? a.endedHave : a.have} max={a.of} showValue={false} /></span>
                  : <span className="gs-small">{mode === 'ended' ? 'Not earned' : a.how}</span>}
              </DS.Card>
            ))}
          </div>
        </>}
      </section>
    </main>
  );
};

// ---- 6 · Case file: a side file holds the summary; a case opens in place ----------
const CbCaseFile = () => {
  const gs = useGs(); const mode = cbMode(gs); const list = cbList(mode);
  const [sel, setSel] = React.useState(null);
  const pick = (id) => { setSel(id); setTimeout(() => gsScrollToId('cb-main'), 0); };
  const got = cbGot();
  return (
    <main className="gs-wrap gs-main">
      <CbHead />
      <div className="cb6">
        <aside className="cb6-side">
          <div className="cb-box cb6-panel">
            <div className="cb6-sec"><CbThisWeek onOpen={() => pick(CB_LIVE.id)} /></div>
            <div className="cb6-sec"><CbStreak compact /></div>
            <div className="cb6-sec gs-stack-md">
              <div className="gs-sec-head"><h2 className="mcp-t-card">Achievements</h2>{mode !== 'free' && <span className="gs-small">{mode === 'ended' ? got.length + ' earned' : got.length + ' of ' + CB_ACH.length}</span>}</div>
              {mode === 'free' ? <CbAchFree /> : <>
                {mode === 'ended' && <p className="gs-small">{'Your Pass ended on ' + CB_ENDED + '.'}</p>}
                <ul className="cb-achlist">
                  {(mode === 'ended' ? got : CB_ACH).map((a) => (
                    <li key={a.k}><CbBadge k={a.k} got={!!a.got} />
                      <span className="gs-stack-xs"><span className="cb-ach-n">{a.n}</span><span className="gs-small">{a.got ? 'Earned ' + a.got : a.of ? a.have + ' of ' + a.of : a.how}</span></span></li>
                  ))}
                </ul>
              </>}
            </div>
          </div>
        </aside>
        <div id="cb-main" className="cb6-main">
          {sel ? <CbSession key={sel} c={cbCase(sel)} share="inline" back="All your cases" onBack={() => { setSel(null); setTimeout(() => gsScrollToId('cb-main'), 0); }} />
            : <section className="gs-stack-md">
                <h2 className="mcp-t-sec">Your cases</h2>
                <div className="cb-box">
                  {cbMonths(list).map((g) => (
                    <div key={g.m}>
                      <div className="cb-month gs-label">{g.m.toUpperCase()}</div>
                      <ul className="cb-list">
                        {g.cases.map((c) => <li key={c.id}>{c.played
                          ? <button type="button" className="cb-row cb6-row" onClick={() => pick(c.id)}>
                              <span className="gs-stack-sm"><span className="gs-stack-xs"><span className="cb-row-t">{c.title}</span><span className="gs-small">{'Week of ' + c.week}</span></span><CbStrip c={c} mini /></span>
                              <CbStatus c={c} /><CbChev />
                            </button>
                          : <div className="cb-row cb6-row is-off"><span className="gs-stack-xs"><span className="cb-row-t">{c.title}</span><span className="gs-small">{'Week of ' + c.week}</span></span><CbStatus c={c} /><span /></div>}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>}
        </div>
      </div>
    </main>
  );
};

// ---- Mount ------------------------------------------------------------------------
const CB_OPTS = [
  { id: '4', name: 'Briefing', idea: 'This week’s case leads, with your progress. Your cases sit below it in one card; streak and achievements sit beside it in their own cards. A case opens its own page, and Share opens a panel.',
    cost: 'The side column ends before the list does. It stays in view as you scroll, but on a phone it comes after every case.',
    list: 'Latest six, then Show earlier cases', share: 'Panel, written as words only', ach: 'Badge grid', ended: 'Earned badges only' },
  { id: '5', name: 'Register', idea: 'Every case is one row in a full-width table: week, case, result, turns and lies. This week’s case is the first row. Achievements run along one scrolling row of cards.',
    cost: 'The densest page. On a phone the table folds to two lines a row, and the turns and lies move under the title.',
    list: 'Every case, by month', share: 'Panel, one emoji per move', ach: 'Scrolling row of cards', ended: 'Every badge stays; progress stops' },
  { id: '6', name: 'Case file', idea: 'A side file holds this week, the streak and achievements. A case opens in place of the list, with its share text open and ready to copy. Each row shows the shape of the case in a strip of its 16 turns.',
    cost: 'Opening a case replaces the list, so the way back is a link, not the browser’s back button.',
    list: 'Every case, by month, each with its turn strip', share: 'Shown open in the case, as a grid of squares', ach: 'Compact list', ended: 'Earned only, with a count' },
];
const CB_VIEWERS = [['pass', 'Pass'], ['free', 'No Pass'], ['ended', 'Pass ended']];

const CbPage = () => {
  const gs = useGs(); const st = useCb();
  const k = st.opt + gs.view + gs.sub.freeUsed;
  const sid = gs.route.sid; const c = sid && cbCase(sid);
  if (c && st.opt !== '6') return <main className="gs-wrap gs-main"><CbSession key={k + sid} c={c} share={st.opt === '5' ? 'moves' : 'words'} back="Casebook" onBack={() => cbGo(gs)} /></main>;
  if (st.opt === '5') return <CbRegister key={k} />;
  if (st.opt === '6') return <CbCaseFile key={k} />;
  return <CbBriefing key={k} />;
};
const cbOrig = window.GsCasebook;
const CbGame = () => { const gs = useGs(); if (gs.view !== 'out' && gs.route.page === 'record') return <CbPage />; const O = cbOrig; return <O />; };

let cbBooted = false;
const cbApply = (gs, viewer) => {
  gs.setDemoView(viewer === 'pass' ? 'pass' : 'free');
  if (viewer === 'ended') gs.setSub({ freeUsed: true });
  gs.setConnected(true);
  setTimeout(() => cbGo(window.gsApi), 0);
};
const CbStripBar = () => {
  const gs = useGs(); const st = useCb();
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { if (!cbBooted) { cbBooted = true; cbApply(gs, st.viewer); } }, []);
  const o = CB_OPTS.find((x) => x.id === st.opt) || CB_OPTS[0];
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {st.open ? (
        <div className="pg-strip-in">
          <div className="pg-strip-row">
            <span className="pg-k">Option</span>
            {CB_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={st.opt === x.id} title={x.name} onClick={() => { cbSet({ opt: x.id }); cbGo(gs); }}>{x.id}</button>)}
            <span className="pg-name">{o.name}</span>
            <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
            <button type="button" className="gs-demo-opt" onClick={() => cbSet({ open: false })}>Hide</button>
          </div>
          <div className="pg-strip-row">
            <span className="pg-k">Viewer</span>
            {CB_VIEWERS.map(([v, l]) => <button key={v} type="button" className="gs-demo-opt" aria-pressed={st.viewer === v} onClick={() => { cbSet({ viewer: v }); cbApply(gs, v); }}>{l}</button>)}
          </div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => cbSet({ open: true })}>Show · {o.id} {o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} kind="panel" title={o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>Cost.</b> {o.cost}</p>
          <ul className="gs-plain">
            <li className="pg-kv"><span className="gs-muted">Your cases</span><b>{o.list}</b></li>
            <li className="pg-kv"><span className="gs-muted">Sharing</span><b>{o.share}</b></li>
            <li className="pg-kv"><span className="gs-muted">Achievements</span><b>{o.ach}</b></li>
            <li className="pg-kv"><span className="gs-muted">Pass ended</span><b>{o.ended}</b></li>
          </ul>
          <p className="gs-small">Case titles, records and badges are invented for the rig. Casebook leaves the game’s own part empty.</p>
        </div>
      </DS.Popup>
    </div>
  );
};

Object.assign(window, { GsCasebook: CbGame, GsDemoBar: CbStripBar });
