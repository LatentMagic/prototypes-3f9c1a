// ============================================================================
// [Platform] — the library game page: the parts every game's page is built from.
// From option 16, ratified 2026-10-08.
// Order at every width: the now card, the run of editions, achievements, your plays. Two columns from 900px.
// A game's own file holds its seed and its now card, and registers its page on window.GS_LIBRARY.
// ============================================================================
// What this player can play of a game (free-and-pass, 2026-10-09): 'all' everything the game offers; 'first' the game's one first edition; 'none' nothing.
// The three dailies and Escape are free in full; Casebook and Delve give a free player their first edition; 36,000 Summers Ago is only with the Pass.
const lbAccess = (gs, id) => (gs.view === 'pass' || GS_GAMES[id].free ? 'all' : id === 'hunter' ? 'none' : 'first');
// Has the player ever held the Pass (now, or until it ended: gsEndedOn)?
const lbPast = (gs) => gs.view === 'pass' || gsLapsed(gs);
// An edition dated before the Pass ended.
const lbOld = (s, gs) => new Date(/\d{4}$/.test(s) ? s : s + ' 2026') < gsEndedOn(gs);
// Achievements by what the player can do now: earned or still to earn when they can earn it; earned and locked when they can't play the game any more.
const lbAchView = (items, access, gs) => {
  const past = lbPast(gs); const out = [];
  items.forEach((a) => {
    const earn = access === 'all' || (access === 'first' && a.first);
    const got = access === 'first' && !past ? a.gotFree : a.got;
    if (earn) out.push({ ...a, got, state: got ? 'earned' : 'todo' });
    else if (got && past) out.push({ ...a, got, state: 'locked' });
  });
  return out;
};
const lbShort = (d) => { const p = d.split(' '); return p[0] + ' ' + p[1].slice(0, 3) + (p[2] ? ' ' + p[2] : ''); };
const LbChev = () => <DS.Icon name="back" size={16} className="lb-chev" style={{ transform: 'rotate(180deg)' }} />;
const LbBack = ({ label, onClick }) => <div><button type="button" className="lb-back" onClick={onClick}><DS.Icon name="back" size={20} />{label}</button></div>;
// Back to where the player came from: History, or the game's library game page. Opened with no earlier page
// (a states address, a pasted link) or from anywhere else, it goes to the game's library game page.
const LbBackTo = ({ gid }) => {
  const gs = useGs(); const p = gs.route.prev; const g = GS_GAMES[gid];
  if (p && p.name === 'history') return <LbBack label="History" onClick={gs.back} />;
  const fromLib = p && p.name === g.route && p.page === 'record';
  return <LbBack label={g.name} onClick={() => (fromLib ? gs.back() : gs.go(g.route, { page: 'record' }))} />;
};
// The library game page head: the design system's cover beside a heading (Cover.prompt.md, ratified 2026-10-12; game-editions-list 2g).
// The cover fills to the text's height, never below 4:3; the art keeps its scale, placed by its declared extend, on its ground.
// name and more: a seam for playgrounds (a test name, extra links).
const LbHead = ({ id, name, more }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const a = GS_ART[g.art] || {};
  // Escape, Casebook and Delve: the way in to the game's editions (app/gs-editions.jsx).
  const eds = !more && gs.view !== 'out' && window.ED3 && window.ED3.includes(id);
  return (
    <section className="mcp-cover-head lb-head">
      <DS.Cover fill ground={a.ground} extend={a.extend}><span dangerouslySetInnerHTML={{ __html: a.svg || '' }} /></DS.Cover>
      <div className="mcp-cover-head-text">
        <h1 className="gs-h1">{name || g.name}</h1>
        <div className="mcp-cover-head-links"><DS.TextLink onClick={() => gs.go(g.route)}>About this game</DS.TextLink>{more}{eds && <DS.TextLink onClick={() => window.pgeList(gs, id, { fromLib: true })}>{g.edLink || 'Every ' + g.ed[0]}</DS.TextLink>}</div>
      </div>
    </section>
  );
};

// A result: { kind: 'ok' | 'bad' | 'live' | 'none', label }.
const lbIcon = (k) => (k === 'ok' ? 'check' : k === 'bad' ? 'error' : null);
const LbStatus = ({ s }) => (
  <span className={'lb-st is-' + s.kind}>{lbIcon(s.kind) && <DS.Icon name={lbIcon(s.kind)} size={14} />}{s.label}</span>
);
const LbResult = ({ s }) => (
  <span className={'lb-v is-' + s.kind}>{lbIcon(s.kind) && <DS.Icon name={lbIcon(s.kind)} size={20} />}{s.label}</span>
);

// ---- The run: editions completed in a row join into one bar. Under 480px the last six show. ----
// weeks: oldest first, [{ id, day, mon, month, played, now }]; played here means completed (lbRunOf).
// on / legend: the legend entries. A streak game says Completed / Failed / Not played (failed-vs-missed-strip option 2, owner 2026-10-15);
// 36,000 Summers Ago passes its own two (Played / Not played). failed: played and lost; it breaks the streak as a day not played does.
const LbRun = ({ n, unit, weeks, locked, figure, pass, on = 'Completed', legend }) => {
  const gs = useGs();
  const cut = weeks.length - 6;
  const streak = on === 'Completed';
  const off = legend || (streak ? 'Not played' : 'Not completed');
  const word = (w) => (w.frozen ? 'frozen' : w.played ? on : streak && w.failed ? 'Failed' : off).toLowerCase();
  return (
    <section className={'lb-card lb-runcard' + (pass ? ' is-pass' : '')}>
      {pass ? <div className="lb-sechead"><h2 className="mcp-t-card">{c13CapLb(unit) + ' in a row'}</h2></div> : <div className="lb-streakhead"><span className="gs-figure">{n}</span><span className="gs-strong">{figure || (n === 1 ? unit.replace(/s$/, '') : unit) + ' in a row'}</span>{weeks.some((w) => w.frozen) && <span className="gs-muted gs-strong">· Frozen</span>}</div>}
      <div className="lb-runbody">
      <div className="lb-run" style={{ gridTemplateColumns: 'repeat(' + weeks.length + ', minmax(0, 1fr))' }} role="img"
        aria-label={pass ? 'The last ' + weeks.length + ' ' + unit + ', oldest first: ' + weeks.map((w) => w.day + ' ' + w.month).join(', ') : 'The last ' + weeks.length + ' ' + unit + ', oldest first: ' + weeks.map((w) => w.day + ' ' + w.month + ' ' + word(w)).join(', ')}>
        {weeks.map((w, i) => {
          const join = i > 0 && (w.played || w.frozen) && (weeks[i - 1].played || (weeks[i - 1].frozen && w.frozen));
          const newMon = i === 0 || weeks[i - 1].mon !== w.mon;
          const fail = streak && !w.played && !w.frozen && !!w.failed;
          const cls = 'lb-wk' + (w.played ? ' is-on' : '') + (w.frozen ? ' is-fz' : '') + (fail ? ' is-fail' : '') + (join ? ' is-join' : '') + (w.now ? ' is-now' : '') + (i < cut ? ' is-early' : '') + (i === cut ? ' is-cut' : '');
          const body = <><em><b className="lb-mw">{newMon ? w.mon : ''}</b><b className="lb-mn">{newMon || i === cut ? w.mon : ''}</b></em><i>{fail && <DS.Icon name="close" size={14} />}</i><span>{w.day}</span></>;
          return <span key={w.id} className={cls}>{body}</span>;
        })}
      </div>
      {pass ? <p className="gs-muted gs-small">Your streak comes with the Pass.</p> : <ul className="lb-legend"><li><i className="is-on" />{on}</li>{streak && <li><i className="is-fail"><svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M0 0L12 12M12 0L0 12" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg></i>Failed</li>}<li><i />{off}</li>{weeks.some((w) => w.frozen) && <li><i className="is-fz" />Frozen</li>}</ul>}
      </div>
    </section>
  );
};

// The streak card for a free player on a game whose streak comes with the Pass (Casebook, Delve): the same card and place as a Pass holder's, so the page keeps one layout.
// Its weeks are drawn as the frozen ones are (not playable), and the line replaces the legend.
const LbRunPass = ({ unit, weeks }) => <LbRun unit={unit} weeks={weeks.map((w) => ({ ...w, played: false, frozen: true, now: false }))} pass />;

// ---- Achievements: badges coloured when earned, outlined while still to earn ----------
// A badge is [ground, [[tag, attrs, fill], ...]] drawn on a 48 grid.
const lbBadgeSvg = ([bg, shapes], got) => '<svg viewBox="0 0 48 48" aria-hidden="true">' + (got ? '<rect width="48" height="48" fill="' + bg + '"/>' : '')
  + shapes.map(([t, a, c]) => '<' + t + ' ' + a + (got ? ' fill="' + c + '"' : ' fill="none" stroke="#918B80" stroke-width="1.5"') + '/>').join('') + '</svg>';
// Locked: still the earned badge, dimmed, with a lock at its corner.
const LbBadge = ({ art, got, locked }) => (
  <span className={'lb-badge' + (got ? '' : ' is-todo') + (locked ? ' is-locked' : '')}>
    <span className="lb-badge-art" dangerouslySetInnerHTML={{ __html: lbBadgeSvg(art, got) }} />
    {locked && <span className="lb-lock"><DS.Icon name="lock" size={14} /></span>}
  </span>
);
const c13CapLb = (s) => s.charAt(0).toUpperCase() + s.slice(1);
// Badges for games with no drawn set yet: the system's shapes, cycled over the three cover grounds.
const LB_GROUNDS = ['#1D1B3A', '#421A28', '#163328'];
const LB_SHAPES = [
  (c) => [['rect', 'x="10" y="10" width="20" height="20"', c], ['circle', 'cx="34" cy="34" r="7"', '#F2EBE0']],
  (c) => [['path', 'd="M8 40L24 10L40 40Z"', c]],
  (c) => [['circle', 'cx="24" cy="24" r="13"', c], ['rect', 'x="8" y="38" width="32" height="4"', '#F2EBE0']],
  (c) => [8, 18, 28, 38].map((x) => ['rect', 'x="' + (x - 3) + '" y="14" width="6" height="20"', c]),
];
const LB_INKS = ['#E5A63B', '#328A88', '#D66847', '#A390B2', '#4CC38A'];
const lbAutoBadges = (items) => Object.fromEntries(items.map((a, i) => [a.k, [LB_GROUNDS[i % 3], LB_SHAPES[i % 4](LB_INKS[i % 5])]]));
const lbAchLine = (a) => (a.state === 'locked' ? 'Earned ' + a.got + ' · Frozen' : a.got ? 'Earned ' + a.got : a.of ? a.have + ' of ' + a.of : 'Not earned yet');
// items: [{ k, n, how, got?, gotFree?, first?, of?, have? }]; badges: { k: art }; access: 'all' | 'first' | 'none'
const LbAch = ({ items, badges, access, ended, ed }) => {
  const gs = useGs(); const [open, setOpen] = React.useState(null);
  const list = lbAchView(items, access, gs);
  const live = list.filter((a) => a.state !== 'locked'); const earned = live.filter((a) => a.got).length;
  const locked = list.some((a) => a.state === 'locked');
  return (
    <section className="lb-card">
      <div className="lb-sechead"><h2 className="mcp-t-card">Achievements</h2>{live.length > 0 && <span className="gs-muted">{earned + ' of ' + live.length + ' earned'}</span>}</div>
      {access === 'first' && <p className="gs-muted">{'These are the achievements the first ' + (ed || ['edition'])[0] + ' can earn. Every other ' + (ed || ['edition'])[0] + ' comes with the Pass.'}</p>}
      {locked && <div className="gs-stack-xs"><p className="gs-muted">{'Your Pass ended on ' + lbDate(gsEndedOn(gs)) + '. Achievements earned in games you can no longer play stay here, frozen. They carry on if the Pass returns.'}</p>
        <p className="gs-muted">You can’t earn any more of the frozen ones until the Pass returns.</p></div>}
      <ul className="lb-ach">
        {list.map((a) => (
          <li key={a.k}><button type="button" className="lb-achbtn" onClick={() => setOpen(a)}><LbBadge art={badges[a.k]} got={!!a.got} locked={a.state === 'locked'} />
            <span className="lb-achtx"><span className="lb-ach-n">{a.n}</span><span className="lb-ach-sub">{a.how}</span><span className="lb-ach-sub">{lbAchLine(a)}</span></span></button></li>
        ))}
      </ul>
      <DS.Popup open={!!open} onClose={() => setOpen(null)} title={open ? open.n : ''} actions={<DS.Button variant="secondary" onClick={() => setOpen(null)}>Close</DS.Button>}>
        {open && <div className="lb-achpop"><LbBadge art={badges[open.k]} got={!!open.got} locked={open.state === 'locked'} /><div className="gs-stack-xs"><p>{open.how}</p><p className="gs-muted">{lbAchLine(open)}</p>{open.state === 'locked' && <p className="gs-muted">It carries on if the Pass returns.</p>}</div></div>}
      </DS.Popup>
    </section>
  );
};

// Dates for seeds: "5 October", with the year only when it isn't this one.
const lbDate = (d) => d.getDate() + ' ' + d.toLocaleString('en-GB', { month: 'long' }) + (d.getFullYear() !== 2026 ? ' ' + d.getFullYear() : '');
const lbMonth = (d) => d.toLocaleString('en-GB', { month: 'long' }) + (d.getFullYear() !== 2026 ? ' ' + d.getFullYear() : '');
// A run from a list newest first: [{ id, date, played, done }] → oldest first, with the newest marked as now.
// A mark is filled only for an edition completed in its first finished play (done); a list without done marks plays.
const lbRunOf = (list) => list.slice(0, 10).reverse().map((x, i, a) => { const p = x.date.split(' '); return { id: x.id, day: p[0], mon: p[1].slice(0, 3), month: p[1], played: x.done != null ? x.done : x.played, failed: !!x.failed, now: i === a.length - 1 }; });
// A player whose Pass ended: weeks dated after it are frozen (not playable), and the streak counts only the weeks before.
// get(x) gives an edition's date text; returns the run's weeks (oldest first, with frozen set) and the frozen streak.
const lbFrozen = (weeks, list, get) => ({ weeks: weeks.map((w) => { const frozen = !lbOld(w.day + ' ' + w.month + ' 2026'); return { ...w, frozen, now: frozen ? false : w.now }; }), n: lbStreak(list.filter((x) => lbOld(get(x)))) });
// The streak, newest first: editions completed in their first finished play, each in its own day or week.
// This edition adds only once completed; until its day or week ends it breaks nothing. A replay never counts.
const lbStreak = (list) => { let n = 0; const l = list[0] && !list[0].done ? list.slice(1) : list; for (const x of l) { if (!x.done) break; n += 1; } return n; };

// ---- A row of choices (History's side column) ----
const LbChoice = ({ label, value, opts, onPick }) => (
  <div className="lb-choicegrp" role="group" aria-label={label}>
    <span className="gs-field-label">{label}</span>
    <div className="lb-choice">{opts.map(([v, l]) => <button key={v} type="button" aria-pressed={value === v} onClick={() => onPick(v)}>{l}</button>)}</div>
  </div>
);
// Search and filters above a long list (History, Library), from filters-on-a-phone (option 1b, 2026-10-10).
// Search stays on the page; every LbChoice moves into one Filters panel. The Game choice is a row that opens a search and
// a list of games narrowed by Genre and Schedule, so the panel keeps its size however many games there are.
// A seam: a playground may replace window.LbTools.
const lbfParts = (children) => {
  let search = null; const choices = [];
  React.Children.toArray(children).forEach((k) => { if (!React.isValidElement(k)) return; if (k.type === LbChoice) choices.push(k.props); else if (k.type === DS.SearchField) search = k; });
  return { search, choices };
};
const lbfLabel = (c) => (c.opts.find(([v]) => v === c.value) || c.opts[0])[1];
const lbfOn = (c) => c.value !== c.opts[0][0];
const lbfGames = (g, choices) => {
  const pick = (l) => { const c = choices.find((x) => x.label === l); return c ? c.value : 'all'; };
  const cat = pick('Genre'); const rhy = pick('Schedule');
  return g.opts.slice(1).filter(([v]) => v === g.value || ((cat === 'all' || GS_GAMES[v].category === cat) && (rhy === 'all' || gsRhythm(v) === rhy)));
};
const LbGamePick = ({ g, list, onBack }) => {
  const [q, setQ] = React.useState(''); const s = gsNorm(q);
  const rows = [['all', 'All games']].concat(list).filter(([, l], i) => i === 0 || !s || gsNorm(l).includes(s));
  return (
    <div className="lbf-pick">
      <button type="button" className="lbf-back" onClick={onBack}><DS.Icon name="back" size={16} />Filters</button>
      <DS.SearchField label="Find a game" placeholder="Name" value={q} onChange={(e) => setQ(e.target.value)} />
      <ul className="lbf-plist" role="list">
        {rows.map(([v, l]) => (
          <li key={v}><button type="button" className="lbf-prow" aria-pressed={v === g.value} onClick={() => { g.onPick(v); onBack(); }}>
            <span>{l}</span>{v === g.value ? <DS.Icon name="check" size={16} /> : <span className="lbf-pgap" />}
          </button></li>
        ))}
        {rows.length === 1 && s && <li className="lbf-pnone">No game called that.</li>}
      </ul>
    </div>
  );
};
// Nothing sits under the bar: the button counts what is set, and the panel shows it and clears it (2026-10-12).
const LbFilters = ({ children }) => {
  const { search, choices } = lbfParts(children);
  const [open, setOpen] = React.useState(false); const [deep, setDeep] = React.useState(false);
  const on = choices.filter(lbfOn); const g = choices.find((c) => c.label === 'Game');
  const close = () => { setOpen(false); setDeep(false); };
  const clear = () => { on.forEach((c) => c.onPick(c.opts[0][0])); setDeep(false); };
  const done = <DS.Button onClick={close}>Done</DS.Button>;
  return (
    <div className="lbf-top">
      <div className="lbf-bar">
        <div className="lbf-search">{search}</div>
        <DS.Button variant="secondary" onClick={() => setOpen(true)}>{on.length ? 'Filters · ' + on.length : 'Filters'}</DS.Button>
      </div>
      <DS.Popup kind="panel" open={open} onClose={close} title="Filters" actions={on.length ? <DS.ButtonPair><DS.Button variant="secondary" onClick={clear}>Clear</DS.Button>{done}</DS.ButtonPair> : done}>
        {deep && g ? <LbGamePick g={g} list={lbfGames(g, choices)} onBack={() => setDeep(false)} /> : (
          <div className="lbf-groups">{choices.map((c) => (c === g ? (
            <div key={c.label} className="lbf-grow">
              <span className="gs-field-label">Game</span>
              <button type="button" className="lbf-prow is-open" onClick={() => setDeep(true)}><span>{lbfLabel(c)}</span><LbChev /></button>
            </div>
          ) : <LbChoice key={c.label} {...c} />))}</div>
        )}
      </DS.Popup>
    </div>
  );
};
window.LbTools = LbFilters;
window.LbToolsColumn = ({ children }) => <aside className="lb-tools">{children}</aside>;
// ---- Share: a panel with the text and Copy ------------------------------------------
// The preview iframe can refuse the Clipboard API silently, so the textarea copy runs first, inside the click.
const lbCopy = (lines) => {
  // The textarea takes focus to copy; focus goes back to the control pressed, never the page root.
  const was = document.activeElement;
  const t = lines.join('\n'); const ta = document.createElement('textarea');
  ta.value = t; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
  document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, t.length);
  let ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta);
  if (was && was !== document.body && was.focus) was.focus({ preventScroll: true });
  if (!ok && navigator.clipboard) navigator.clipboard.writeText(t).catch(() => {});
};
const LbCopyBtn = ({ lines }) => {
  const [done, setDone] = React.useState(false);
  React.useEffect(() => { if (!done) return undefined; const t = setTimeout(() => setDone(false), 2400); return () => clearTimeout(t); }, [done]);
  return <DS.Button variant="main" done={done} doneLabel="Copied" onClick={() => { lbCopy(lines); setDone(true); }}>Copy</DS.Button>;
};
// Share on a library game page: the page's own button, the session page's pop-up (GsSharePopup).
const LbShare = ({ lines }) => {
  const [open, setOpen] = React.useState(false);
  return <>
    <DS.Button variant="main" onClick={() => setOpen(true)}>Share</DS.Button>
    <GsSharePopup open={open} onClose={() => setOpen(false)} lines={lines} />
  </>;
};

// This week's card for a game never played (a new account with the Pass): the edition, a line, Play, and when the next one comes.
const LbFreshNow = ({ title, line, next, onPlay }) => (
  <section className="lb-card">
    <div className="lb-top"><div className="gs-stack-xs"><span className="gs-label">THIS WEEK</span><h2 className="mcp-t-sec">{title}</h2></div></div>
    <p>{line}</p>
    <div className="lb-foot">
      <div className="lb-acts"><DS.Button onClick={onPlay}>Play</DS.Button></div>
      {next && <span className="gs-muted">{next}</span>}
    </div>
  </section>
);
// A new account has earned nothing yet.
const lbNoAch = (items) => items.map((a) => ({ ...a, got: undefined, gotFree: undefined, have: a.of ? 0 : a.have }));

window.GS_LIBRARY = window.GS_LIBRARY || {};
// This edition (today's for a daily, this week's for a weekly) is finished unless Config or the demo bar says in progress.
const lbWeekDone = (gs) => (gs.review && gs.review.week) !== 'live';
// This edition's play of a game for this player, the same on every screen: { status, open } or null when not played (or not playable).
const lbNow = (gs, id) => {
  const done = lbWeekDone(gs); if (gsFresh(gs)) return null;
  if (id === 'casebook') return gs.view === 'pass' ? { status: cbStatus(cbWeek(gs)), open: () => cbGo(gs, CB_LIVE.id) } : null;
  if (id === 'delve') return gs.view === 'pass' ? { status: dvStatus(done ? DV_DONE : DV_LIVE), open: () => gs.go('session', { id: done ? 'delve' : 'delve-live' }) } : null;
  const c = window.PZ && PZ[id]; if (!c || !gsTodayPlayed(gs)[id]) return null;
  if (!done) return { status: { kind: 'live', label: 'In progress' }, open: () => gs.go('session', { id: c.liveSid }) };
  const s = GS_SESSIONS[c.today];
  return { status: { kind: s.loss ? 'bad' : 'ok', label: s.result }, open: () => gs.go('session', { id: c.today }) };
};
// The Pass offer on a free first-edition card (Casebook, Delve): its line wraps beside Get the Pass, on the actions' row when there is room.
const LbPassOffer = ({ unit }) => {
  const gs = useGs();
  return <div className="lb-pass"><DS.Button variant="secondary" onClick={() => gs.go('pass')}>Get the Pass</DS.Button><span className="gs-muted">{'Every other ' + unit + ' comes with the Pass.'}</span></div>;
};
Object.assign(window, { LbRunPass, LbPassOffer, LbFreshNow, lbNoAch, lbFrozen, lbAccess, lbPast, lbOld, lbAchView, lbShort, lbDate, lbMonth, lbRunOf, lbStreak, lbAutoBadges, lbWeekDone, lbNow, LbBack, LbBackTo, LbHead, LbStatus, LbResult, LbRun, LbBadge, LbAch, LbChoice, LbShare });
