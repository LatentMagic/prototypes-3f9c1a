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

// ---- The run: editions played in a row join into one bar. Under 480px the last six show. ----
// weeks: oldest first, [{ id, day, mon, month, played, now }]
const LbRun = ({ n, unit, weeks, locked, figure, legend }) => {
  const gs = useGs();
  const cut = weeks.length - 6;
  return (
    <section className="lb-card lb-runcard">
      <div className="lb-streakhead"><span className="gs-figure">{n}</span><span className="gs-strong">{figure || unit + ' in a row'}</span></div>
      <div className="lb-runbody">
      <div className="lb-run" style={{ gridTemplateColumns: 'repeat(' + weeks.length + ', minmax(0, 1fr))' }} role="img"
        aria-label={'The last ' + weeks.length + ' ' + unit + ', oldest first: ' + weeks.map((w) => w.day + ' ' + w.month + (w.played ? ' played' : ' missed')).join(', ')}>
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
      <ul className="lb-legend"><li><i className="is-on" />Played</li><li><i />{legend || 'Missed'}</li></ul>
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
const lbAchLine = (a) => (a.state === 'locked' ? 'Earned ' + a.got + ' · Locked' : a.got ? 'Earned ' + a.got : a.of ? a.have + ' of ' + a.of : 'Not earned yet');
// items: [{ k, n, how, got?, gotFree?, first?, of?, have? }]; badges: { k: art }; access: 'all' | 'first' | 'none'
const LbAch = ({ items, badges, access, ended }) => {
  const gs = useGs(); const [open, setOpen] = React.useState(null);
  const list = lbAchView(items, access, gs);
  const live = list.filter((a) => a.state !== 'locked'); const earned = live.filter((a) => a.got).length;
  const locked = list.some((a) => a.state === 'locked');
  return (
    <section className="lb-card">
      <div className="lb-sechead"><h2 className="mcp-t-card">Achievements</h2>{live.length > 0 && <span className="gs-muted">{earned + ' of ' + live.length + ' earned'}</span>}</div>
      {access === 'first' && <p className="gs-muted">These are the achievements the first edition can earn. Every other edition comes with the Pass.</p>}
      {locked && <p className="gs-muted">{'Your Pass ended on ' + ended + '. Achievements earned in games you can no longer play stay here, locked. They carry on if the Pass returns.'}</p>}
      <ul className="lb-ach">
        {list.map((a) => (
          <li key={a.k}><button type="button" className="lb-achbtn" onClick={() => setOpen(a)}><LbBadge art={badges[a.k]} got={!!a.got} locked={a.state === 'locked'} />
            <span className="lb-achtx"><span className="lb-ach-n">{a.n}</span><span className="lb-ach-sub">{lbAchLine(a)}</span></span></button></li>
        ))}
      </ul>
      <DS.Popup open={!!open} onClose={() => setOpen(null)} title={open ? open.n : ''} actions={<DS.Button variant="secondary" onClick={() => setOpen(null)}>Close</DS.Button>}>
        {open && <div className="lb-achpop"><LbBadge art={badges[open.k]} got={!!open.got} locked={open.state === 'locked'} /><div className="gs-stack-xs"><p>{open.how}</p><p className="gs-muted">{lbAchLine(open)}</p>{open.state === 'locked' && <p className="gs-muted">It carries on if the Pass returns.</p>}</div></div>}
      </DS.Popup>
    </section>
  );
};

// ---- Your plays: a title over its date and result. On the all page, figures join the row from 600px.
// r: { key, title, date, status, figs?: [[strong, rest], ...], onOpen? }
const LbRow = ({ r }) => {
  const cells = <>
    <span className="lb-title">{r.title}</span>
    <span className="lb-res"><LbStatus s={r.status.short && !r.figs ? { ...r.status, label: r.status.short } : r.status} /></span>
    <span className="lb-meta">
      {r.date && <span className="lb-date">{r.date}</span>}
      {r.figs && r.figs.map(([b, t], i) => <span key={i} className={'lb-n lb-n' + i}>{b != null && <><b>{b}</b><span>{t}</span></>}</span>)}
    </span>
  </>;
  return r.onOpen
    ? <button type="button" className={'lb-row' + (r.inline ? ' is-inline' : '')} onClick={r.onOpen}>{cells}<LbChev /></button>
    : <div className={'lb-row' + (r.probe ? '' : ' is-off') + (r.inline ? ' is-inline' : '')}>{cells}<span className="lb-chev-space" /></div>;
};
// On a phone: the latest four. Beside achievements: as many as fill the card to achievements' height, rows sharing what's left.
const LbRecent = ({ title, allLabel, onAll, rows, empty }) => {
  const card = React.useRef(null); const list = React.useRef(null); const probe = React.useRef(null);
  const [fit, setFit] = React.useState(null);
  React.useLayoutEffect(() => {
    const el = card.current; if (!el || !rows.length) return undefined;
    const pair = el.previousElementSibling; const lay = el.parentElement;
    const measure = () => {
      const two = getComputedStyle(lay).gridTemplateColumns.split(' ').length > 1;
      if (!two || !pair) { el.style.height = ''; if (pair) pair.style.alignSelf = ''; setFit(null); return; }
      pair.style.alignSelf = 'start';
      el.style.height = pair.offsetHeight + 'px';
      const room = list.current ? el.clientHeight - list.current.offsetTop : 0;
      const hs = Array.from(probe.current.children).map((x) => x.offsetHeight);
      let k = 0; let sum = 0; while (k < hs.length && sum + hs[k] <= room + 1) { sum += hs[k]; k += 1; }
      // Never fewer than the phone's four: a short neighbour (few achievements) grows to match instead.
      if (k < Math.min(4, hs.length)) { el.style.height = ''; pair.style.alignSelf = ''; setFit(null); return; }
      setFit(k);
    };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(pair); ro.observe(lay);
    return () => ro.disconnect();
  }, [rows.length]);
  const shown = fit ? rows.slice(0, fit) : rows.slice(0, 4);
  return (
    <section ref={card} className={'lb-card lb-recentcard' + (fit ? ' is-fill' : '')}>
      <div className="lb-sechead"><h2 className="mcp-t-card">{title}</h2>{rows.length > 0 && <DS.TextLink onClick={onAll}>{allLabel}</DS.TextLink>}</div>
      {rows.length ? <ul ref={list} className="lb-list lb-recent" style={fit ? { gridTemplateRows: 'repeat(' + fit + ', minmax(0, 1fr))' } : null}>{shown.map((r) => <li key={r.key}><LbRow r={r} /></li>)}</ul> : <p className="gs-muted">{empty}</p>}
      {rows.length > 0 && <ul ref={probe} className="lb-list lb-probe" aria-hidden="true">{rows.map((r) => <li key={r.key}><LbRow r={{ ...r, onOpen: null, probe: true }} /></li>)}</ul>}
    </section>
  );
};
// Dates for seeds: "5 October", with the year only when it isn't this one.
const lbDate = (d) => d.getDate() + ' ' + d.toLocaleString('en-GB', { month: 'long' }) + (d.getFullYear() !== 2026 ? ' ' + d.getFullYear() : '');
const lbMonth = (d) => d.toLocaleString('en-GB', { month: 'long' }) + (d.getFullYear() !== 2026 ? ' ' + d.getFullYear() : '');
// A run from a list newest first: [{ id, date, played }] → oldest first, with the newest marked as now.
const lbRunOf = (list) => list.slice(0, 10).reverse().map((x, i, a) => { const p = x.date.split(' '); return { id: x.id, day: p[0], mon: p[1].slice(0, 3), month: p[1], played: x.played, now: i === a.length - 1 }; });
const lbStreak = (list) => { let n = 0; for (const x of list) { if (!x.played) break; n += 1; } return n; };

// ---- Every play: search, order and filter in a side column; numbered pages of twelve ----
const LbChoice = ({ label, value, opts, onPick }) => (
  <div className="lb-choicegrp" role="group" aria-label={label}>
    <span className="gs-field-label">{label}</span>
    <div className="lb-choice">{opts.map(([v, l]) => <button key={v} type="button" aria-pressed={value === v} onClick={() => onPick(v)}>{l}</button>)}</div>
  </div>
);
// filters: [[value, label, test]]; text(item) is what search reads; row(item) builds an LbRow.
const LbAll = ({ back, onBack, title, find, hint, filters, items, text, row, empty }) => {
  const [q, setQ] = React.useState(''); const [sort, setSort] = React.useState('new'); const [filt, setFilt] = React.useState(filters[0][0]);
  const [p, setP] = React.useState(0);
  const s = q.trim().toLowerCase();
  React.useEffect(() => setP(0), [s, sort, filt]);
  const test = (filters.find(([v]) => v === filt) || filters[0])[2];
  let list = items.filter(test);
  if (s) list = list.filter((x) => text(x).toLowerCase().includes(s));
  if (sort === 'old') list = [...list].reverse();
  const size = 12; const pages = Math.max(1, Math.ceil(list.length / size)); const pg = Math.min(p, pages - 1);
  const go = (x) => { setP(x); window.scrollTo(0, 0); };
  return (
    <main className="gs-wrap gs-main">
      <LbBack label={back} onClick={onBack} />
      <h1 className="gs-h1">{title}</h1>
      <div className="lb-alllay">
        <aside className="lb-tools">
          <DS.SearchField label={find} placeholder={hint} value={q} onChange={(e) => setQ(e.target.value)} />
          <LbChoice label="Order" value={sort} opts={[['new', 'Newest first'], ['old', 'Oldest first']]} onPick={setSort} />
          <LbChoice label="Show" value={filt} opts={filters.map(([v, l]) => [v, l])} onPick={setFilt} />
        </aside>
        <div className="lb-box lb-results">
          {list.length ? <div className="lb-rows"><ul className="lb-list">{list.slice(pg * size, pg * size + size).map((x) => { const r = row(x); return <li key={r.key}><LbRow r={r} /></li>; })}</ul></div>
            : <p className="lb-empty gs-muted">{empty}</p>}
          {pages > 1 && (
            <nav className="lb-pages" aria-label="Pages">
              {pg > 0 ? <button type="button" className="gs-iconbtn" aria-label="Previous page" onClick={() => go(pg - 1)}><DS.Icon name="back" /></button> : <span className="gs-iconbtn-space" />}
              <div className="lb-pagenums">{Array.from({ length: pages }, (_, x) => <button key={x} type="button" aria-current={x === pg ? 'page' : undefined} onClick={() => go(x)}>{x + 1}</button>)}</div>
              {pg < pages - 1 ? <button type="button" className="gs-iconbtn" aria-label="Next page" onClick={() => go(pg + 1)}><DS.Icon name="back" style={{ transform: 'rotate(180deg)' }} /></button> : <span className="gs-iconbtn-space" />}
            </nav>
          )}
        </div>
      </div>
    </main>
  );
};

// ---- Share: a panel with the text and Copy ------------------------------------------
// The preview iframe can refuse the Clipboard API silently, so the textarea copy runs first, inside the click.
const lbCopy = (lines) => {
  const t = lines.join('\n'); const ta = document.createElement('textarea');
  ta.value = t; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
  document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, t.length);
  let ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta);
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
const lbWeekDone = (gs) => (gs.review && gs.review.week) === 'done';
Object.assign(window, { lbAccess, lbPast, lbOld, lbAchView, lbShort, lbDate, lbMonth, lbRunOf, lbStreak, lbAutoBadges, lbWeekDone, LbBack, LbHead, LbStatus, LbResult, LbRun, LbBadge, LbAch, LbRow, LbRecent, LbAll, LbShare });
