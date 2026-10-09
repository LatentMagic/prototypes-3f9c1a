
// Playground: the play row (Your groups card + History), replay chip, replay filter, time of completion. 2026-10-09.
// Fixed: History stays the one list; "All…" opens it filtered to the game; no new pages. Builds on pg-history.jsx (seed, PhPage, PhHead, PhShow, PhPages, usePhList).
// Overrides LbRecent, GsHistory, GsDemoBar on window. Nothing in app/ changes.
const RP_KEY = 'pg_replays_v1';
let rp = { opt: '1', open: true, ...(() => { try { return JSON.parse(localStorage.getItem(RP_KEY)) || {}; } catch (e) { return {}; } })() };
const rpSubs = new Set();
const rpSet = (p) => { rp = { ...rp, ...p }; try { localStorage.setItem(RP_KEY, JSON.stringify(rp)); } catch (e) {} rpSubs.forEach((f) => f(rp)); };
const useRp = () => { const [s, setS] = React.useState(rp); React.useEffect(() => { rpSubs.add(setS); return () => rpSubs.delete(setS); }, []); return s; };

const RP_FALLBACK = window.LbRow;
// The record page: every play shows its date and time of completion; a replay also carries a Replay chip in the stats row.
(() => { const seen = {}; PH_PLAYS.forEach((p) => { try { p.open({ go: (n, a) => { if (n === 'session' && a && a.id && !seen[a.id]) seen[a.id] = p; } }); } catch (e) {} });
  Object.entries(seen).forEach(([id, p]) => { const s = GS_SESSIONS[id]; if (!s || s.__rp) return; s.__rp = true; s.date = s.date + ', ' + phTime(p.at); if (p.again) s.figures = [<span className="rp-fig">Replay</span>, ...(s.figures || [])]; }); })();
const RpSt = ({ s, full }) => <span className={'rp-st is-' + s.kind}><span className="rp-ico">{s.kind === 'ok' ? <DS.Icon name="check" size={14} /> : s.kind === 'bad' ? <DS.Icon name="error" size={14} /> : null}</span><span className="rp-sl">{full ? s.label : s.short || s.label}</span></span>;

// One play. Three ways to lay out the card (options). The timestamp is gone: a play shows its date, or nothing where a day heading already says it.
// v: { key, title, when, status, chip: 'again'|'first'|null, sub, onOpen, gid? }
const RpRow = ({ v, o, two }) => {
  const on = !!v.onOpen; const T = on ? 'button' : 'div'; const again = v.chip === 'again';
  const R = again ? <span className="rp-r" title="Replay" role="img" aria-label="Replay">R</span> : null;
  const mode = two ? 'two' : o === '2' ? 'one' : o === '3' && v.sub ? 'sub' : 'two';
  const cls = 'rp rp-' + mode + (v.gid ? ' has-cov' : '') + (on ? '' : ' is-off');
  const props = on ? { type: 'button', onClick: v.onOpen } : {};
  const tail = on ? <LbChev /> : <span className="lb-chev-space" />;
  if (mode === 'sub') return <T className={cls} {...props}><span className="rp-g">{R}</span><span className="rp-c"><RpSt s={v.status} full={mode !== 'one'} /></span><span className="rp-d">{v.when}</span>{tail}</T>;
  return (
    <T className={cls} {...props}>
      {v.gid && <PhCov gid={v.gid} />}
      <span className="rp-a"><span className="rp-t" title={v.title}>{v.title}</span></span>
      <span className="rp-c"><RpSt s={v.status} full={mode !== 'one'} /></span>
      {(mode === 'one' || mode === 'two') && <span className="rp-d">{v.when}</span>}
      <span className="rp-m">{o !== '3' && R}</span>
      {tail}
    </T>
  );
};
const rpSh = (gid, s) => { const c = PZ[gid] || {}; return { ...s, short: s.short || (s.kind === 'ok' ? c.short : s.kind === 'bad' ? c.badF : undefined) }; };
const rpViews = (r, gs, o) => {
  const e = PH_EDS[r.key];
  if (!e) return [{ key: r.key, title: r.title.replace(/^Daily [A-Za-z]+ (?=#)/, ''), when: r.date, status: r.status, chip: null, onOpen: r.onOpen }];
  const c = PZ[e.gid] || {}; const sh = (s) => ({ ...s, short: s.short || (s.kind === 'ok' ? c.short : s.kind === 'bad' ? c.badF : undefined) });
  const vs = e.plays.map((p) => ({ key: p.pid, title: r.title.replace(/^Daily [A-Za-z]+ (?=#)/, ''), when: phShort(p.at), status: sh(p.status), chip: p.again ? 'again' : 'first', sub: p.again, onOpen: r.onOpen ? () => p.open(gs) : null }));
  return o === '3' ? [vs[0], ...vs.slice(1).reverse()] : vs.slice().reverse();
};
const rpLimit = (arr, n) => { let k = 0; const out = []; for (const v of arr) { if (!v.sub && k === n) break; if (!v.sub) k += 1; out.push(v); } return out; };

// The library game card (copy of LbRecent, one row per play). "All…" opens History filtered to this game.
const RpRecent = ({ title, allLabel, rows, empty }) => {
  const s = useRp(); const gs = useGs(); const gid = gsGameOfRoute(gs.route.name);
  const onAll = () => gs.go('history', { game: gid, from: gid });
  const card = React.useRef(null); const list = React.useRef(null); const probe = React.useRef(null);
  const [fit, setFit] = React.useState(null);
  const vs = React.useMemo(() => rows.flatMap((r) => (r.figs ? [{ key: r.key, raw: r }] : rpViews(r, gs, s.opt))), [rows, gs, s.opt]);
  React.useLayoutEffect(() => {
    const el = card.current; if (!el || !vs.length) return undefined;
    const pair = el.previousElementSibling; const lay = el.parentElement;
    const measure = () => {
      if (s.opt === '3') { el.style.height = ''; if (pair) pair.style.alignSelf = ''; setFit(null); return; }
      const two = getComputedStyle(lay).gridTemplateColumns.split(' ').length > 1;
      if (!two || !pair) { el.style.height = ''; if (pair) pair.style.alignSelf = ''; setFit(null); return; }
      pair.style.alignSelf = 'start';
      el.style.height = pair.offsetHeight + 'px';
      const room = list.current ? el.clientHeight - list.current.offsetTop : 0;
      const hs = Array.from(probe.current.children).map((x) => x.offsetHeight);
      let k = 0; let sum = 0; while (k < hs.length && sum + hs[k] <= room + 1) { sum += hs[k]; k += 1; }
      if (k < Math.min(4, hs.length)) { el.style.height = ''; pair.style.alignSelf = ''; setFit(null); return; }
      setFit(k);
    };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(pair); ro.observe(lay);
    return () => ro.disconnect();
  }, [vs.length, s.opt]);
  const tw = Math.min(150, Math.max(44, Math.ceil(Math.max(0, ...vs.map((v) => (v.title ? String(v.title).length : 0))) * 9)));
  const lng = s.opt === '2' && vs.some((v) => !v.raw && String(v.title || '').length > 14);
  const shown = fit ? vs.slice(0, fit) : s.opt === '3' ? rpLimit(vs, 4) : vs.slice(0, 4);
  React.useLayoutEffect(() => {
    const ul = list.current; const pr = probe.current; if (s.opt !== '2' || !ul) return undefined;
    const ks = ['a', 'c', 'd']; const all = [ul, pr].filter(Boolean);
    const run = () => {
      // Fit rules, in order. 1 No row is wider than its card. 2 The edition is the only column that gives, but keeps up to 140px. 3 If it can't, the date goes, then the R column goes when no row in the card is a replay, then the result is capped at 84px.
      all.forEach((u) => { ks.forEach((k) => u.style.removeProperty('--w' + k)); u.removeAttribute('data-nodate'); u.removeAttribute('data-nor'); });
      const row = ul.querySelector('.rp-one'); if (!row) return;
      const cs = getComputedStyle(row);
      const inner = ul.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const nat = {}; ks.forEach((k) => { nat[k] = Math.max(0, ...[...ul.querySelectorAll('.rp-' + k)].map((e) => e.getBoundingClientRect().width)); });
      const hasR = !!ul.querySelector('.rp-r');
      const want = Math.min(nat.a, 140);
      const room = (c, d, r) => inner - (c + (d ? d + 8 : 0) + (r ? 28 : 0) + 16 + 16);
      let c = Math.min(nat.c, 104); let d = Math.min(nat.d, 60); let r = hasR; let nd = false;
      if (room(c, d, r) - 8 < want) { nd = true; d = 0; }
      if (room(c, d, r) - 8 < want && !hasR) r = false;
      if (room(c, d, r) - 8 < want) c = Math.min(nat.c, 84);
      const wa = Math.max(56, Math.min(nat.a, room(c, d, r) - 8));
      all.forEach((u) => { if (nd) u.setAttribute('data-nodate', '1'); if (!r) u.setAttribute('data-nor', '1'); u.style.setProperty('--wa', Math.ceil(wa) + 'px'); u.style.setProperty('--wc', Math.ceil(c) + 'px'); u.style.setProperty('--wd', Math.ceil(d) + 'px'); });
    };
    run(); window.addEventListener('resize', run); return () => window.removeEventListener('resize', run);
  }, [vs, fit, s.opt, lng]);
  const cell = (v, probing) => (v.raw ? <RP_FALLBACK r={v.raw} /> : <RpRow v={probing ? { ...v, onOpen: null } : v} o={s.opt} two={lng} />);
  return (
    <section ref={card} className={'lb-card lb-recentcard' + (fit ? ' is-fill' : '')}>
      <div className="lb-sechead"><h2 className="mcp-t-card">{title}</h2>{rows.length > 0 && <DS.TextLink onClick={onAll}>{allLabel}</DS.TextLink>}</div>
      {vs.length ? <ul ref={list} className={'lb-list lb-recent' + (s.opt === '2' && !lng ? ' rp-flex' : '')} style={{ '--rp-t': tw + 'px', ...(fit ? { gridTemplateRows: 'repeat(' + fit + ', minmax(0, 1fr))' } : null) }}>{shown.map((v) => <li key={v.key}>{cell(v)}</li>)}</ul> : <p className="gs-muted">{empty}</p>}
      {vs.length > 0 && <ul ref={probe} className={'lb-list lb-probe' + (s.opt === '2' && !lng ? ' rp-flex' : '')} aria-hidden="true" style={{ '--rp-t': tw + 'px' }}>{vs.map((v) => <li key={v.key}>{cell(v, true)}</li>)}</ul>}
    </section>
  );
};

// Pager: numbers when they fit, "Page 3 of 9" when they don't (container query in the page CSS).
const RpPages = ({ pg, pages, go }) => (pages > 1 ? (
  <nav className="lb-pages rp-pg" aria-label="Pages">
    {pg > 0 ? <button type="button" className="gs-iconbtn" aria-label="Previous page" onClick={() => go(pg - 1)}><DS.Icon name="back" /></button> : <span className="gs-iconbtn-space" />}
    <div className="lb-pagenums rp-pg-nums">{Array.from({ length: pages }, (_, x) => <button key={x} type="button" aria-current={x === pg ? 'page' : undefined} onClick={() => go(x)}>{x + 1}</button>)}</div>
    <span className="rp-pg-of gs-strong gs-num-text">{'Page ' + (pg + 1) + ' of ' + pages}</span>
    {pg < pages - 1 ? <button type="button" className="gs-iconbtn" aria-label="Next page" onClick={() => go(pg + 1)}><DS.Icon name="back" style={{ transform: 'rotate(180deg)' }} /></button> : <span className="gs-iconbtn-space" />}
  </nav>
) : null);

// History: every play under its day, newest first, with the replay filter. Filtered to a game when "All…" opens it.
const RpHistory = () => {
  const gs = useGs(); const s = useRp(); const r = gs.route; const f = usePhList(r.game);
  const [rep, setRep] = React.useState('all');
  const list = f.list.filter((x) => rep === 'all' || (rep === 'again') === x.again);
  const size = 24; const pages = Math.max(1, Math.ceil(list.length / size)); const pg = Math.min(f.pg, pages - 1);
  const groups = [];
  list.slice(pg * size, pg * size + size).forEach((p) => { const k = phDayKey(p.at); const last = groups[groups.length - 1]; if (last && last[0] === k) last[2].push(p); else groups.push([k, phDayLabel(p.at), [p]]); });
  const name = (p) => (p.edTitle.includes(GS_GAMES[p.gid].name) || f.g !== 'all' ? p.edTitle : GS_GAMES[p.gid].name + ' · ' + p.edTitle);
  const view = (p) => ({ key: p.pid, gid: p.gid, title: name(p), when: phTime(p.at), status: rpSh(p.gid, p.status), chip: p.again ? 'again' : 'first', onOpen: () => p.open(gs) });
  return (
    <PhPage>
      {r.from && <LbBack label={GS_GAMES[r.from].name} onClick={() => phLib(gs, r.from)} />}
      <PhHead />
      {!f.all.length ? <PhEmpty /> : (
        <div className="lb-alllay">
          <aside className="lb-tools">
            <LbChoice label="Order" value={f.sort} opts={[['new', 'Newest first'], ['old', 'Oldest first']]} onPick={f.setSort} />
            <LbChoice label="Plays" value={rep} opts={[['all', 'All plays'], ['first', 'First plays'], ['again', 'Replays']]} onPick={(v) => { setRep(v); f.go(0); }} />
            <PhShow f={f} />
          </aside>
          <div className="lb-box lb-results">
            {groups.length ? groups.map(([k, label, ps]) => (
              <React.Fragment key={k + pg}>
                <h2 className="ph-day">{label}</h2>
                <ul className="ph-list">{ps.map((p) => <li key={p.pid}><RpRow v={view(p)} o="2" /></li>)}</ul>
              </React.Fragment>
            )) : <p className="lb-empty gs-muted">No plays match that.</p>}
            <RpPages pg={pg} pages={pages} go={f.go} />
          </div>
        </div>
      )}
    </PhPage>
  );
};

const RP_OPTS = [
  { id: '1', name: 'Two lines, R right', idea: 'Each play is a row. First line: the edition and its date. Second line: the full result. A small R square sits at the right edge of a replay, centred on the row.', cost: 'Four plays fill the card, so replays use up slots.' },
  { id: '2', name: 'Ledger, one line', idea: 'Each play is one line: edition, a one-word result, R. Lines are shorter, so the card lists more plays. Columns: edition, result, date, R. On History the last column is the time of completion, under the day heading.', cost: 'The result is one word (Solved, Missed), so “no mistakes” and “3 mistakes” are only on the record.' },
  { id: '3', name: 'Replays under the edition', idea: 'The edition is a two-line row. Its replays sit under it as short lines with an R in the gutter, the result and the date. The card counts editions, not plays.', cost: 'On History this option shows option 1, because History is a flat list of plays.' },
];
let rpBooted = false;
const RpStrip = () => {
  const gs = useGs(); const s = useRp(); const o = RP_OPTS.find((x) => x.id === s.opt) || RP_OPTS[0];
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { if (!rpBooted) { rpBooted = true; gs.setView('pass'); gs.setConnected(true); setTimeout(() => phLib(window.gsApi, 'groups'), 0); } }, []);
  const view = (v) => { gs.setDemoView(v); gs.setConnected(v !== 'out'); };
  const rt = gs.route; const here = rt.name === 'history' ? (rt.game ? rt.game + '-h' : 'history') : rt.page === 'record' ? gsGameOfRoute(rt.name) : null;
  const to = (k) => (k === 'history' ? gs.go('history') : k === 'groups-h' ? gs.go('history', { game: 'groups', from: 'groups' }) : phLib(gs, k));
  const seg = (opts, cur, fn) => opts.map(([v, l], i) => (
    <React.Fragment key={v}>{i > 0 && <span aria-hidden="true">/</span>}<button type="button" className="gs-demo-opt" aria-pressed={cur === v} onClick={() => fn(v)}>{l}</button></React.Fragment>
  ));
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {s.open ? (
        <div className="pg-strip-in">
          <div className="pg-strip-row">
            <span className="pg-k">Row</span>
            {RP_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={o.id === x.id} title={x.name} onClick={() => rpSet({ opt: x.id })}>{x.id}</button>)}
            <span className="pg-name">{o.name}</span>
            <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
            <button type="button" className="gs-demo-opt" onClick={() => rpSet({ open: false })}>Hide</button>
          </div>
          <div className="pg-strip-row"><span className="pg-k">Go</span>{gs.view === 'out' ? <span className="pg-name">Sign in to reach these</span> : seg([['groups', 'Groups'], ['groups-h', 'Groups in History'], ['history', 'History'], ['escape', 'Escape']], here, to)}</div>
          <div className="pg-strip-row"><span className="pg-k">View</span>{seg([['out', 'signed out'], ['free', 'free'], ['pass', 'Pass']], gs.view, view)}</div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => rpSet({ open: true })}>{'Show · ' + o.id + ' ' + o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} title={o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>Cost.</b> {o.cost}</p>
          <p className="gs-small">Same in all three: the timestamp is gone, a fixed icon slot keeps Solved, Missed and Not played on one left edge, and “All groups” opens History filtered to the game. Wording is draft.</p>
        </div>
      </DS.Popup>
    </div>
  );
};

const RP_Session0 = window.GsSession;
const RpSession = () => {
  const gs = useGs(); const s = GS_SESSIONS[gs.route.id] || {};
  return <>{s.gid && <div className="gs-wrap" style={{ paddingTop: 24 }}><LbBack label={GS_GAMES[s.gid].name} onClick={() => phLib(gs, s.gid)} /></div>}<RP_Session0 /></>;
};
Object.assign(window, { GsSession: RpSession, LbRecent: RpRecent, GsHistory: RpHistory, GsDemoBar: RpStrip });
