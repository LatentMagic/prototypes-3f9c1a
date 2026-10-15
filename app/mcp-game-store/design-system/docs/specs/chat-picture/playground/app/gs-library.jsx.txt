// ============================================================================
// [Platform] — the library game page: the parts every game's page is built from.
// From option 16, ratified 2026-10-08 (docs/specs/library-game-page/handoff-2026-10-08-option-16-direction.md).
// Order at every width: the now card, the run of editions, achievements, your plays. Two columns from 900px.
// A game's own file holds its seed and its now card, and registers its page on window.GS_LIBRARY.
// ============================================================================
// What this player can play of a game (free-and-pass, 2026-10-09): 'all' every edition; 'first' the game's one first edition; 'none' nothing.
// The three dailies and Escape are free in full; Casebook and Delve give a free player their first edition; 36,000 Summers Ago is only with the Pass.
const lbAccess = (gs, id) => (gs.view === 'pass' || GS_GAMES[id].free ? 'all' : id === 'hunter' ? 'none' : 'first');
// Has the player ever held the Pass (now, or until 18 September)?
const lbPast = (gs) => gs.view === 'pass' || gsLapsed(gs);
// An edition dated before the Pass ended.
const lbOld = (s) => new Date(/\d{4}$/.test(s) ? s : s + ' 2026') < new Date(2026, 8, 18);
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
const LbHead = ({ id }) => {
  const gs = useGs(); const g = GS_GAMES[id];
  return (
    <section className="rf-head">
      <span><GsCover art={g.art} /></span>
      <div className="gs-stack-xs" style={{ justifyItems: 'start' }}>
        <h1 className="gs-h1">{g.name}</h1>
        <DS.TextLink style={{ marginTop: -8 }} onClick={() => gs.go(g.route)}>{'About ' + g.name}</DS.TextLink>
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
// on / legend: the two legend entries. A streak game says Completed / Not completed; 36,000 Summers Ago counts days played.
const LbRun = ({ n, unit, weeks, locked, figure, on = 'Completed', legend = 'Not completed' }) => {
  const gs = useGs();
  const cut = weeks.length - 6;
  return (
    <section className="lb-card lb-runcard">
      <div className="lb-streakhead"><span className="gs-figure">{n}</span><span className="gs-strong">{figure || (n === 1 ? unit.replace(/s$/, '') : unit) + ' in a row'}</span></div>
      <div className="lb-runbody">
      <div className="lb-run" style={{ gridTemplateColumns: 'repeat(' + weeks.length + ', minmax(0, 1fr))' }} role="img"
        aria-label={'The last ' + weeks.length + ' ' + unit + ', oldest first: ' + weeks.map((w) => w.day + ' ' + w.month + ' ' + (w.played ? on : legend).toLowerCase()).join(', ')}>
        {weeks.map((w, i) => {
          const join = i > 0 && w.played && weeks[i - 1].played;
          const newMon = i === 0 || weeks[i - 1].mon !== w.mon;
          return (
            <span key={w.id} className={'lb-wk' + (w.played ? ' is-on' : '') + (join ? ' is-join' : '') + (w.now ? ' is-now' : '') + (i < cut ? ' is-early' : '') + (i === cut ? ' is-cut' : '')}>
              <em><b className="lb-mw">{newMon ? w.mon : ''}</b><b className="lb-mn">{newMon || i === cut ? w.mon : ''}</b></em><i /><span>{w.day}</span>
            </span>
          );
        })}
      </div>
      <ul className="lb-legend"><li><i className="is-on" />{on}</li><li><i />{legend}</li></ul>
      </div>
    </section>
  );
};

// ---- Achievements: badges coloured when earned, outlined while still to earn ----------
// A badge is [ground, [[tag, attrs, fill], ...]] drawn on a 48 grid.
const lbBadgeSvg = ([bg, shapes], got) => '<svg viewBox="0 0 48 48" aria-hidden="true">' + (got ? '<rect width="48" height="48" fill="' + bg + '"/>' : '')
  + shapes.map(([t, a, c]) => '<' + t + ' ' + a + (got ? ' fill="' + c + '"' : ' fill="none" stroke="#918B80" stroke-width="1.5"') + '/>').join('') + '</svg>';
// Locked: still the earned badge, dimmed, with a lock at its corner.
const LbBadge = ({ art, got, locked }) => (
  <span className={'lb-badge' + (got ? '' : ' is-todo') + (locked ? ' is-locked' : '')}>
    <span className="lb-badge-art" dangerouslySetInnerHTML={{ __html: lbBadgeSvg(art, got) }} />
    {locked && <span className="lb-lock"><DS.Icon name="lock" size={12} /></span>}
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
      {locked && <div className="gs-stack-xs"><p className="gs-muted">{'Your Pass ended on ' + ended + '. Achievements earned in games you can no longer play stay here, frozen. They carry on if the Pass returns.'}</p>
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
const lbRunOf = (list) => list.slice(0, 10).reverse().map((x, i, a) => { const p = x.date.split(' '); return { id: x.id, day: p[0], mon: p[1].slice(0, 3), month: p[1], played: x.done != null ? x.done : x.played, now: i === a.length - 1 }; });
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
// Search and filters above a long list (History, Library), from docs/specs/filters-on-a-phone/ (option 1b, 2026-10-10).
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
  const [q, setQ] = React.useState(''); const s = q.trim().toLowerCase();
  const rows = [['all', 'All games']].concat(list).filter(([, l], i) => i === 0 || !s || l.toLowerCase().includes(s));
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
const LbFilters = ({ children }) => {
  const { search, choices } = lbfParts(children);
  const [open, setOpen] = React.useState(false); const [deep, setDeep] = React.useState(false);
  const on = choices.filter(lbfOn); const g = choices.find((c) => c.label === 'Game');
  const close = () => { setOpen(false); setDeep(false); };
  return (
    <div className="lbf-top">
      <div className="lbf-bar">
        <div className="lbf-search">{search}</div>
        <DS.Button variant="secondary" onClick={() => setOpen(true)}>{on.length ? 'Filters · ' + on.length : 'Filters'}</DS.Button>
      </div>
      {on.length > 0 && <p className="lbf-sum">{on.map(lbfLabel).join(' · ')}</p>}
      <DS.Popup kind="panel" open={open} onClose={close} title="Filters" actions={<DS.Button onClick={close}>Done</DS.Button>}>
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
const LbShare = ({ lines, note }) => {
  const [open, setOpen] = React.useState(false);
  return <>
    <DS.Button variant="main" onClick={() => setOpen(true)}>Share</DS.Button>
    <DS.Popup open={open} onClose={() => setOpen(false)} kind="panel" title="Share your result"
      actions={<LbCopyBtn lines={lines} />}>
      <div className="lb-share-text">{lines.map((l, i) => <span key={i} className={i === lines.length - 1 ? 'lb-share-link' : ''}>{l}</span>)}</div>
      {note && <p className="gs-muted">{note}</p>}
    </DS.Popup>
  </>;
};

window.GS_LIBRARY = window.GS_LIBRARY || {};
// This edition (today's for a daily, this week's for a weekly) is finished unless Config or the demo bar says in progress.
const lbWeekDone = (gs) => (gs.review && gs.review.week) !== 'live';
// This edition's play of a game for this player, the same on every screen: { status, open } or null when not played (or not playable).
const lbNow = (gs, id) => {
  const done = lbWeekDone(gs);
  if (id === 'casebook') return gs.view === 'pass' ? { status: cbStatus(cbWeek(gs)), open: () => cbGo(gs, CB_LIVE.id) } : null;
  if (id === 'delve') return gs.view === 'pass' ? { status: dvStatus(done ? DV_DONE : DV_LIVE), open: () => gs.go('session', { id: done ? 'delve' : 'delve-live' }) } : null;
  const c = window.PZ && PZ[id]; if (!c || !gsTodayPlayed(gs)[id]) return null;
  if (!done) return { status: { kind: 'live', label: 'In progress' }, open: () => gs.go('session', { id: c.liveSid }) };
  const s = GS_SESSIONS[c.today];
  return { status: s.loss ? { kind: 'bad', label: s.result, short: c.badF } : { kind: 'ok', label: s.result, short: c.short }, open: () => gs.go('session', { id: c.today }) };
};
Object.assign(window, { lbAccess, lbPast, lbOld, lbAchView, lbShort, lbDate, lbMonth, lbRunOf, lbStreak, lbAutoBadges, lbWeekDone, lbNow, LbBack, LbBackTo, LbHead, LbStatus, LbResult, LbRun, LbBadge, LbAch, LbChoice, LbShare });
