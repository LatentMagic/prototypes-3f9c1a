// Playground: the library game page. Three arrangements, four games, three viewers.
// Mounts the real app; overrides the four game screens' `record` route and the demo bar.
// Prompt: LatentMagic/business-ops work/apps/mcp-game-store/inception/_outputs/playground-library-game-page.md
// Game material: the four draft specs beside it in _outputs/game-specs/ (proposed, not decided).
const LG_KEY = 'pg_library_game_v1';
let lgState = { opt: '1', game: 'delve', viewer: 'pass', open: true, ...(() => { try { return JSON.parse(localStorage.getItem(LG_KEY)) || {}; } catch (e) { return {}; } })() };
const lgSubs = new Set();
const lgSet = (p) => { lgState = { ...lgState, ...p }; try { localStorage.setItem(LG_KEY, JSON.stringify(lgState)); } catch (e) {} lgSubs.forEach((f) => f(lgState)); };
const useLg = () => { const [s, setS] = React.useState(lgState); React.useEffect(() => { lgSubs.add(setS); return () => lgSubs.delete(setS); }, []); return s; };

// ---- Seed: one player, every game ------------------------------------------------
const LG_SQ = { '🟩': 'Hit', '🟨': 'Weak hit', '🟥': 'Miss', '✨': 'Natural 20' };
const lgDelve = (hero, end, ok, sq) => {
  const r = Array.from(sq);
  return { title: hero, end, loss: !ok, figs: [hero, r.length + ' rolls'], list: ['Every roll', r.map((c, i) => ['Roll ' + (i + 1), LG_SQ[c]])],
    share: ['Delve · ' + hero + ' · ' + (ok ? '✅ ' : '❌ ') + end + ' · ' + r.length + ' rolls', sq] };
};
const lgWord = (iso, guesses, hint) => {
  const a = guesses[guesses.length - 1];
  return { title: 'Daily Word', end: 'Solved in ' + guesses.length + ' of 6', figs: [guesses.length + ' of 6 guesses', hint ? '1 hint' : 'No hints'],
    list: ['Every guess', guesses.map((g, i) => ['Guess ' + (i + 1), g, gsWordRow(g, a)])],
    share: ['Daily Word ' + iso + ' ' + guesses.length + '/6' + (hint ? ' · 💡' : ''), ...guesses.map((g) => gsWordRow(g, a))] };
};
const LG_S = {
  'word-1006': lgWord('2026-10-06', ['SLATE', 'TONIC', 'TORCH']),
  'groups-1006': { title: 'Daily Groups', end: 'Solved with 1 mistake', figs: ['1 mistake', '1 hint'],
    list: ['Every set', [['Set 1', 'HARE, CROW, FOX, LION', 'One away'], ['Set 2', 'HARE, CROW, FOX, ANT', 'Right'], ['Set 3', 'BARK, TRUNK, ROOT, LEAF', 'Right'], ['Set 4', 'BOOT, CAP, BONNET, BUMPER', 'Right'], ['Set 5', 'LION, SEA, BRAVE, COLD', 'Right']]],
    share: ['Daily Groups 2026-10-06 · 1 mistake · 💡', '🟩🟩🟦🟩', '🟨🟨🟨🟨', '🟩🟩🟩🟩', '🟦🟦🟦🟦', '🟪🟪🟪🟪'] },
  'mys-1006': { title: 'Daily Mystery', end: null, prog: 'You’ve asked 2 of 5 questions. The accusation is still to make.', bar: [2, 5, '2 of 5 questions'] },
  'word-1005': lgWord('2026-10-05', ['CRANE', 'STORE', 'SPREE', 'SHIRE'], true),
  'groups-1005': { title: 'Daily Groups', end: 'Missed, 4 mistakes', loss: true, figs: ['4 mistakes', 'No hints'],
    share: ['Daily Groups 2026-10-05 · 4 mistakes', '🟨🟨🟨🟨', '🟩🟦🟩🟩', '🟦🟦🟪🟦', '🟩🟪🟩🟩', '🟪🟦🟪🟪'] },
  'mys-1004': { title: 'Daily Mystery', end: 'Case closed', figs: ['2 questions', '1 hint'],
    list: ['Every question', [['Question 1', 'Was the study locked at nine?', 'Yes'], ['Question 2', 'Was the candlestick moved?', 'No'], ['Accusation', 'The cook, in the study, with the rope', 'Right']]],
    share: ['Daily Mystery 2026-10-04 · ✅ Solved · 🔎🔎 · 💡'] },
  'cb-1005': { title: 'The Last Night at Gull Point', end: null, prog: 'You’ve exposed 2 lies. The accusation is still to make.', bar: [7, 16, '7 of 16 turns'] },
  'cb-0928': { title: null, end: 'Solved', figs: ['11 of 16 turns', '4 lies exposed'], list: ['The record', GS_SESSIONS.casebook.lines],
    share: ['Casebook · ✅ solved · 11 of 16 turns · 4 lies exposed'] },
  'cb-0921': { title: null, end: 'Unsolved', loss: true, figs: ['16 of 16 turns', '1 lie exposed'], share: ['Casebook · ❌ unsolved · 16 of 16 turns · 1 lie exposed'] },
  'cb-0907': { title: null, end: 'Solved', figs: ['14 of 16 turns', '2 lies exposed'], share: ['Casebook · ✅ solved · 14 of 16 turns · 2 lies exposed'] },
  'dv-1005': lgDelve('Rogue', 'Elsie rescued', true, '🟩🟨🟥🟩✨'),
  'dv-0928b': lgDelve('Wizard', 'Elsie rescued', true, '🟩🟩🟨🟥🟩🟨🟩🟥🟩'),
  'dv-0928a': lgDelve('Fighter', 'Ritual finished', false, '🟨🟥🟩🟥🟨🟥🟩🟥🟨🟥🟥'),
  'dv-0921': lgDelve('Rogue', 'Health ran out', false, '🟩🟥🟨🟥🟥🟩🟥'),
  'dv-0907': lgDelve('Rogue', 'Elsie rescued', true, '🟩🟨🟩🟥🟩🟨🟩🟩'),
  'hg-3': { title: 'Tuesday 6 October', end: null, prog: 'It’s midday and you’re at the springs. The day is saved where you stopped.' },
  'hg-2': { title: 'Friday 2 October', end: 'Restarted at midday', note: 'A restarted day adds nothing to the achievements that count up.' },
  'hg-1': { title: 'Monday 28 September', end: 'Slept at the fire in camp', summary: [
    ['Set moments', 'Joined the ibex hunt and saw the drawing in the cave. Missed the meeting at the springs.'],
    ['Your companions', 'Aunt and the two young hunters'], ['Quarrels', 'Eased one'], ['What you made', 'A bone needle'],
    ['Big animals seen', 'Ibex and horse'], ['Weather', 'Hot, with a storm at dusk']] },
};
const lgDays = (l) => l.map(([d, v]) => [d, v]);
const LG = {
  daily: { units: 'puzzles', shares: true, latest: 'word-1006',
    current: { label: 'TODAY’S PUZZLES', title: 'Tuesday 6 October', rows: [['Daily Word', 'Solved in 3 of 6'], ['Daily Groups', 'Solved with 1 mistake'], ['Daily Mystery', 'In progress']], next: 'New puzzles tomorrow.' },
    left: { sid: 'mys-1006', title: 'Daily Mystery, today' },
    streak: { n: 3, label: 'DAYS RUNNING', unit: 'days', strip: lgDays([['30 Sep', true], ['1 Oct', true], ['2 Oct', true], ['3 Oct', false], ['4 Oct', true], ['5 Oct', true], ['6 Oct', true]]) },
    editions: [
      { id: 'd6', label: 'TODAY · 6 OCTOBER', sessions: ['word-1006', 'groups-1006', 'mys-1006'] },
      { id: 'd5', label: 'MONDAY 5 OCTOBER', sessions: ['word-1005', 'groups-1005'] },
      { id: 'd4', label: 'SUNDAY 4 OCTOBER', sessions: ['mys-1004'] },
      { id: 'd3', label: 'SATURDAY 3 OCTOBER', sessions: [] }],
    ach: [
      { cls: 'Mastery', items: [{ n: 'Daily Word: Solved', got: true }, { n: 'Daily Groups: Solved', got: true },
        { n: 'Daily Groups: No mistakes', how: 'Find all four groups without a mistake.' }, { n: 'Daily Mystery: Case closed', got: true },
        { n: 'Daily Mystery: Unaided', how: 'Make the accusation without a hint or a question.' }] },
      { cls: 'Completion', items: [{ n: 'Daily Word: Seven days in a row', of: 7, have: 3 }, { n: 'Daily Groups: Seven days in a row', of: 7, have: 2 }, { n: 'Daily Mystery: Seven days in a row', of: 7, have: 1 }] }],
    own: null },
  casebook: { units: 'cases', shares: true, latest: 'cb-0928',
    current: { label: 'THIS WEEK’S CASE', title: 'The Last Night at Gull Point', state: 'In progress', next: 'New case Monday 12 October.' },
    left: { sid: 'cb-1005', title: 'The Last Night at Gull Point' },
    streak: { n: 2, label: 'WEEKS RUNNING', unit: 'weeks', strip: lgDays([['31 Aug', true], ['7 Sep', true], ['14 Sep', false], ['21 Sep', true], ['28 Sep', true], ['5 Oct', false]]) },
    editions: [
      { id: 'c5', label: 'THIS WEEK · 5 OCTOBER', sessions: ['cb-1005'] },
      { id: 'c28', label: 'WEEK OF 28 SEPTEMBER', sessions: ['cb-0928'] },
      { id: 'c21', label: 'WEEK OF 21 SEPTEMBER', sessions: ['cb-0921'] },
      { id: 'c14', label: 'WEEK OF 14 SEPTEMBER', sessions: [] },
      { id: 'c7', label: 'WEEK OF 7 SEPTEMBER', sessions: ['cb-0907'] }],
    ach: [
      { cls: 'Discovery', items: [{ n: 'First lie exposed', got: true }] },
      { cls: 'Mastery', items: [{ n: 'Case solved', got: true }, { n: 'Every lie exposed', how: 'Break every lie in one case.' }, { n: 'Eleven turns or fewer', got: true }] },
      { cls: 'Completion', items: [{ n: 'Five cases solved', of: 5, have: 2 }] }],
    own: null },
  delve: { units: 'scenes', shares: true, latest: 'dv-1005',
    current: { label: 'THIS WEEK’S SCENE', title: 'The goblin warren', state: 'Played · Elsie rescued', next: 'New scene Monday 12 October.' },
    left: null,
    streak: { n: 3, label: 'WEEKS RUNNING', unit: 'weeks', strip: lgDays([['31 Aug', false], ['7 Sep', true], ['14 Sep', false], ['21 Sep', true], ['28 Sep', true], ['5 Oct', true]]) },
    editions: [
      { id: 'v5', label: 'THIS WEEK · 5 OCTOBER', sessions: ['dv-1005'] },
      { id: 'v28', label: 'WEEK OF 28 SEPTEMBER', sessions: ['dv-0928b', 'dv-0928a'] },
      { id: 'v21', label: 'WEEK OF 21 SEPTEMBER', sessions: ['dv-0921'] },
      { id: 'v14', label: 'WEEK OF 14 SEPTEMBER', sessions: [] },
      { id: 'v7', label: 'WEEK OF 7 SEPTEMBER', sessions: ['dv-0907'] }],
    ach: [
      { cls: 'Discovery', items: [{ n: 'Reached the shrine cavern', got: true }] },
      { cls: 'Mastery', items: [{ n: 'Elsie rescued', got: true }, { n: 'Rescued without a miss', how: 'Get her out without a single missed roll.' }] },
      { cls: 'Completion', items: [{ n: 'Won with all three heroes', of: 3, have: 2 }] }],
    own: { title: 'Your heroes', rows: [['Fighter', 'No rescues yet'], ['Rogue', '2 rescues'], ['Wizard', '1 rescue']] } },
  hunter: { units: 'days', shares: false, latest: 'hg-1', current: null, streak: null,
    left: { sid: 'hg-3', title: 'Tuesday 6 October' },
    editions: [{ id: 'h', label: null, sessions: ['hg-3', 'hg-2', 'hg-1'] }],
    ach: [
      { cls: 'Discovery', items: [{ n: 'Fed the Fire', got: true }, { n: 'Dug with Aunt', got: true }, { n: 'One of Us at Dusk', got: true },
        { n: 'Walked with the Hunters', got: true }, { n: 'A Line on the Wall' }, { n: 'The Long Walk' }, { n: 'Met at the Springs' }] },
      { cls: 'Mastery', items: [{ n: 'Home with Full Hands', got: true }, { n: 'Meat Home Whole' }] },
      { cls: 'Completion', items: [{ n: 'The Big Animals' }, { n: 'Hunt, Springs and Wall' }, { n: 'Made Something' }, { n: 'Eased a Quarrel' }] }],
    own: null },
};
const LG_ENDED = '18 September';
const lgMode = (gs) => (gs.view === 'pass' ? 'pass' : gsLapsed(gs) ? 'ended' : 'free');
const lgEds = (id, mode) => LG[id].editions.filter((e) => e.sessions.length || mode === 'pass');
const lgEdOf = (id, sid) => LG[id].editions.find((e) => e.sessions.includes(sid));
const lgLink = (id) => 'https://platform.example/' + GS_GAMES[id].route;
const lgShareLines = (id, sid) => {
  if (!LG[id].shares) return [lgLink(id)];
  const s = sid && LG_S[sid];
  return s && s.share ? [...s.share, lgLink(id)] : null;
};
const lgCase = (l) => l && l.toLowerCase().replace(/(^|\s)([a-z])/g, (m, a, b) => a + b.toUpperCase()).replace(/ Of /g, ' of ');
const lgCopyFallback = (text) => {
  const ta = document.createElement('textarea');
  ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
  document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
  let ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta); return ok;
};
// The preview iframe can refuse the Clipboard API silently; the fallback runs inside the same click.
const lgCopy = (lines) => {
  const text = lines.join('\n');
  const ok = lgCopyFallback(text);
  if (!ok && navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
};
const lgToRecord = (gs, id, extra) => gs.go(GS_GAMES[id].route, { page: 'record', ...(extra || {}) });

// ---- Shared parts ----------------------------------------------------------------
const LgHead = ({ id, children }) => {
  const gs = useGs(); const g = GS_GAMES[id];
  return (
    <section className="rf-head">
      <span><GsCover art={g.art} /></span>
      <div className="gs-stack-sm" style={{ justifyItems: 'start' }}>
        <h1 className="gs-h1">{g.name}</h1>
        <DS.TextLink onClick={() => gs.go(g.route)}>{'About ' + g.name}</DS.TextLink>
        {children}
      </div>
    </section>
  );
};
const LgStreak = ({ id }) => {
  const k = LG[id].streak; if (!k) return null;
  return (
    <div className="gs-stack-sm">
      <span className="gs-label">{k.label}</span>
      <span className="gs-figure">{k.n}</span>
      <div className="gs-days" role="img" aria-label={k.n + ' ' + k.unit + ' running. Last ' + k.strip.length + ' ' + k.unit + ': played ' + k.strip.filter((x) => x[1]).length}>
        {k.strip.map(([d, v]) => <i key={d} title={d} className={v ? 'is-on' : ''} />)}
      </div>
    </div>
  );
};
const LgCurrent = ({ id }) => {
  const c = LG[id].current; if (!c) return null;
  return (
    <div className="gs-stack-sm">
      <span className="gs-label">{c.label}</span>
      <h3 className="mcp-t-card">{c.title}</h3>
      {c.rows ? <ul className="gs-plain">{c.rows.map(([n, v]) => <li key={n} className="pg-kv"><span>{n}</span><span className="gs-strong">{v}</span></li>)}</ul>
        : <div className="gs-tags"><DS.Tag kind="daily">{c.state}</DS.Tag></div>}
      <p className="gs-small">{c.next}</p>
    </div>
  );
};
const LgProg = ({ s }) => <>
  <p className="gs-muted">{s.prog}</p>
  {s.bar && <span className="lg-bar"><DS.ProgressBar label={s.bar[2]} value={s.bar[0]} max={s.bar[1]} showValue={false} /></span>}
</>;
const LgLeftOff = ({ id }) => {
  const l = LG[id].left; if (!l) return null;
  return (
    <div className="gs-stack-sm">
      <span className="gs-label">WHERE YOU LEFT OFF</span>
      <h3 className="mcp-t-card">{l.title}</h3>
      <LgProg s={LG_S[l.sid]} />
    </div>
  );
};
// What happened and how it ended. The ending itself is drawn by each option, at its own size.
const LgResult = ({ sid }) => {
  const s = LG_S[sid];
  if (!s.end) return <div className="gs-stack-sm"><LgProg s={s} /></div>;
  return (
    <div className="gs-stack-md">
      {s.figs && <div className="gs-figs">{s.figs.map((f) => <span key={f} className="gs-fig">{f}</span>)}</div>}
      {s.note && <p className="gs-muted">{s.note}</p>}
      {s.summary && <dl className="lg-dl">{s.summary.map(([k, v]) => <div key={k}><dt className="gs-small">{k}</dt><dd>{v}</dd></div>)}</dl>}
      {s.list && <div className="gs-stack-sm">
        <span className="gs-label">{s.list[0].toUpperCase()}</span>
        <ol className="gs-lines">{s.list[1].map((l, i) => <li key={i}><span className="gs-strong">{l[0]}</span> · {l.slice(1).join(' · ')}</li>)}</ol>
      </div>}
    </div>
  );
};
const LgCopyBtn = ({ lines, link, block }) => {
  const [done, setDone] = React.useState(false);
  return <DS.Button variant="secondary" block={block} done={done} doneLabel="Copied" onClick={() => { lgCopy(lines); setDone(true); }}>{link ? 'Copy link' : 'Copy'}</DS.Button>;
};
const LgShareText = ({ lines }) => <div className="lg-share-text">{lines.map((l, i) => <span key={i}>{l}</span>)}</div>;
const LgShareBlock = ({ id, sid }) => {
  const lines = lgShareLines(id, sid); if (!lines) return null;
  const link = !LG[id].shares;
  return (
    <div className="lg-share">
      <span className="gs-label">{link ? 'LINK TO THE GAME' : 'SHARE'}</span>
      <LgShareText lines={lines} />
      <LgCopyBtn lines={lines} link={link} />
    </div>
  );
};
const LgCopyLink = ({ lines, label }) => {
  const [d, setD] = React.useState(false);
  React.useEffect(() => { if (!d) return undefined; const t = setTimeout(() => setD(false), 2000); return () => clearTimeout(t); }, [d]);
  return <button type="button" className="gs-inlink lg-copy" onClick={() => { lgCopy(lines); setD(true); }}>{d ? <><DS.Icon name="check" size={16} />Copied</> : label}</button>;
};

// Achievements. v picks each option's answer for a Pass that has ended.
const LgAch = ({ id, mode, v, cols }) => {
  const gs = useGs();
  const a = LG[id].ach; const all = a.flatMap((g) => g.items); const got = all.filter((i) => i.got);
  const head = <h2 className="mcp-t-sec">Achievements</h2>;
  if (mode === 'free') return (
    <section className="gs-stack-sm">{head}
      <p className="gs-muted">Achievements come with the Pass. <button type="button" className="gs-inlink" onClick={() => gs.go('pass')}>What’s included</button></p>
    </section>
  );
  if (mode === 'ended' && v === 3) return (
    <section className="gs-stack-sm">{head}
      <DS.Disclosure title={'You earned ' + got.length + ' with the Pass'}>
        <ul className="gs-plain">{got.map((i) => <li key={i.n} className="lg-got"><DS.Icon name="check" size={16} />{i.n}</li>)}</ul>
      </DS.Disclosure>
    </section>
  );
  const frozen = mode === 'ended';
  return (
    <section className="gs-stack-md">
      <div className="gs-sec-head">{head}{mode === 'pass' && <span className="gs-small">{got.length} of {all.length} earned</span>}</div>
      {frozen && <p className="gs-muted">{v === 1 ? 'Your Pass ended on ' + LG_ENDED + '. What you earned stays here.' : 'Your Pass ended on ' + LG_ENDED + '. Your progress stopped there, and what you earned stays.'}</p>}
      <div className={cols ? 'lg-ach-cols' : 'gs-stack-md'}>
        {a.map((g) => {
          const items = frozen && v === 1 ? g.items.filter((i) => i.got) : g.items;
          if (!items.length) return null;
          return (
            <div key={g.cls} className="gs-stack-sm">
              <span className="gs-label">{g.cls.toUpperCase()}</span>
              <ul className="gs-plain">{items.map((i) => (
                <li key={i.n} className="lg-ach">
                  {i.got ? <span className="lg-got"><DS.Icon name="check" size={16} />{i.n}</span>
                    : <span className="gs-stack-xs"><span className={frozen ? 'gs-muted' : ''}>{i.n}</span>{i.how && <span className="gs-small">{i.how}</span>}</span>}
                  {!i.got && i.of && <span className="lg-bar"><DS.ProgressBar label={i.have + ' of ' + i.of} value={i.have} max={i.of} showValue={false} /></span>}
                </li>))}</ul>
            </div>
          );
        })}
      </div>
    </section>
  );
};
const LgOwn = ({ id }) => {
  const o = LG[id].own; if (!o) return null;
  return (
    <section className="gs-stack-md">
      <h2 className="mcp-t-sec">{o.title}</h2>
      <ul className="gs-plain">{o.rows.map(([k, v]) => <li key={k} className="pg-kv"><span>{k}</span><span className="gs-strong">{v}</span></li>)}</ul>
    </section>
  );
};
const LgEnd = ({ s }) => <span className={'gs-strong' + (s.loss ? ' lg-loss' : '')}>{s.end || 'In progress'}</span>;

// ---- 1 · Ledger: one page, a session opens in place, share sits open under it ------
const LgLedger = ({ id }) => {
  const gs = useGs(); const mode = lgMode(gs); const d = LG[id];
  const [open, setOpen] = React.useState(gs.route.sid || d.latest);
  return (
    <main className="gs-wrap gs-main">
      <LgHead id={id} />
      <div className="lg-split">
        <div className="gs-stack-md" style={{ gap: 36 }}>
          {(d.current || d.left) && <DS.Card style={{ gap: 24, justifyItems: 'stretch' }}>
            <LgCurrent id={id} />{d.current && d.left && <div className="gs-rule" />}<LgLeftOff id={id} />
          </DS.Card>}
          <section className="gs-stack-md">
            <h2 className="mcp-t-sec">{'Your ' + d.units}</h2>
            {lgEds(id, mode).map((e) => (
              <div key={e.id} className="gs-stack-sm">
                {e.label && <span className="gs-label">{e.label}</span>}
                <ul className="lg-rows">
                  {e.sessions.map((sid) => {
                    const s = LG_S[sid]; const on = open === sid;
                    return (
                      <li key={sid}>
                        <button type="button" className="lg-row" aria-expanded={on} onClick={() => setOpen(on ? null : sid)}>
                          <span className="gs-stack-xs"><LgEnd s={s} />{s.title && <span className="gs-small">{s.title}</span>}</span>
                          <DS.Icon name="down" size={16} />
                        </button>
                        {on && <div className="lg-open"><LgResult sid={sid} /><LgShareBlock key={sid} id={id} sid={sid} /></div>}
                      </li>
                    );
                  })}
                  {!e.sessions.length && <li className="lg-none gs-muted">Not played</li>}
                </ul>
              </div>
            ))}
          </section>
        </div>
        <aside className="gs-stack-md" style={{ gap: 36 }}>
          <LgStreak id={id} />
          <LgAch id={id} mode={mode} v={1} />
          <LgOwn id={id} />
        </aside>
      </div>
    </main>
  );
};

// ---- 2 · Spotlight: one session large, picked from a list beside it; share in a panel
const LgSpot = ({ id }) => {
  const gs = useGs(); const mode = lgMode(gs); const d = LG[id];
  const [sel, setSel] = React.useState(gs.route.sid || d.latest);
  const [share, setShare] = React.useState(false);
  const s = LG_S[sel]; const ed = lgEdOf(id, sel);
  const lines = lgShareLines(id, sel);
  const pick = (sid) => { setSel(sid); if (gs.width < 900) setTimeout(() => gsScrollToId('lg-spot'), 0); };
  return (
    <main className="gs-wrap gs-main">
      <LgHead id={id} />
      <section className="lg-spot">
        <div id="lg-spot">
          <DS.Card style={{ gap: 24, justifyItems: 'stretch', alignContent: 'start' }}>
            <div className="gs-stack-xs">
              <span className="gs-label">{(ed && ed.label) || (s.title || '').toUpperCase()}</span>
              <h2 className={'mcp-t-sec' + (s.loss ? ' lg-loss' : '')}>{s.end || 'In progress'}</h2>
              {ed && ed.label && s.title && <span className="gs-muted">{s.title}</span>}
            </div>
            <LgResult sid={sel} />
            {lines && <div><DS.Button variant="secondary" onClick={() => setShare(true)}>{d.shares ? 'Share' : 'Share the game'}</DS.Button></div>}
          </DS.Card>
        </div>
        <div className="gs-stack-md" style={{ gap: 24 }}>
          {(d.current || d.left) && <div className="gs-stack-md"><LgCurrent id={id} /><LgLeftOff id={id} /></div>}
          <LgStreak id={id} />
          <nav className="gs-stack-md" aria-label={'Your ' + d.units}>
            <h2 className="mcp-t-card">{'Your ' + d.units}</h2>
            {lgEds(id, mode).map((e) => (
              <div key={e.id} className="gs-stack-sm">
                {e.label && <span className="gs-label">{e.label}</span>}
                <ul className="lg-picks">
                  {e.sessions.map((sid) => { const x = LG_S[sid]; return (
                    <li key={sid}><button type="button" className="lg-pick" aria-pressed={sel === sid} onClick={() => pick(sid)}>
                      <span className="gs-stack-xs"><LgEnd s={x} />{x.title && <span className="gs-small">{x.title}</span>}</span>
                    </button></li>); })}
                  {!e.sessions.length && <li className="lg-none lg-pad gs-muted">Not played</li>}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </section>
      <LgAch id={id} mode={mode} v={2} cols />
      <LgOwn id={id} />
      <DS.Popup open={share} onClose={() => setShare(false)} kind="panel" title={d.shares ? 'Share your result' : 'Share the game'}
        actions={lines && <LgCopyBtn key={sel} lines={lines} link={!d.shares} block />}>
        {lines && <LgShareText lines={lines} />}
        <p className="gs-small">{d.shares ? 'Paste it anywhere. The link at the end opens the game’s page.' : 'Paste it anywhere. It opens the game’s page.'}</p>
      </DS.Popup>
    </main>
  );
};

// ---- 3 · Overview: a summary page; each session has its own page; copy from the list
const LgOverview = ({ id }) => {
  const gs = useGs(); const mode = lgMode(gs); const d = LG[id];
  const rows = lgEds(id, mode).flatMap((e) => (e.sessions.length ? e.sessions.map((sid) => [e, sid]) : [[e, null]]));
  return (
    <main className="gs-wrap gs-main">
      <LgHead id={id}>{!d.shares && <LgCopyLink lines={[lgLink(id)]} label="Copy a link to the game" />}</LgHead>
      <div className="lg-tiles">
        {d.current && <DS.Card style={{ alignContent: 'start' }}><LgCurrent id={id} /></DS.Card>}
        {d.left && <DS.Card style={{ alignContent: 'start' }}><LgLeftOff id={id} /></DS.Card>}
        {d.streak && <DS.Card style={{ alignContent: 'start' }}><LgStreak id={id} /></DS.Card>}
      </div>
      <section className="gs-stack-md">
        <h2 className="mcp-t-sec">{'Your ' + d.units}</h2>
        <ul className="lg-rows">
          {rows.map(([e, sid]) => {
            if (!sid) return <li key={e.id} className="lg-none"><span className="gs-stack-xs"><span className="gs-muted">Not played</span><span className="gs-small">{lgCase(e.label)}</span></span></li>;
            const s = LG_S[sid]; const small = [lgCase(e.label), s.title].filter(Boolean).join(' · ');
            const lines = d.shares && s.share ? lgShareLines(id, sid) : null;
            return (
              <li key={sid} className="lg-trow">
                <button type="button" className="lg-row" onClick={() => lgToRecord(gs, id, { sid })}>
                  <span className="gs-stack-xs"><LgEnd s={s} /><span className="gs-small">{small}</span></span>
                  <DS.Icon name="back" size={16} style={{ transform: 'rotate(180deg)' }} />
                </button>
                {lines ? <LgCopyLink lines={lines} label="Copy result" /> : <span />}
              </li>
            );
          })}
        </ul>
      </section>
      <LgAch id={id} mode={mode} v={3} cols />
      <LgOwn id={id} />
    </main>
  );
};
const LgSessionPage = ({ id, sid }) => {
  const gs = useGs(); const g = GS_GAMES[id]; const s = LG_S[sid]; const ed = lgEdOf(id, sid);
  return (
    <main className="gs-wrap gs-main">
      <div><button type="button" className="lg-back" onClick={() => lgToRecord(gs, id)}><DS.Icon name="back" size={20} />{g.name}</button></div>
      <section className="gs-stack-sm">
        <span className="gs-label">{(ed && ed.label) || (s.title || '').toUpperCase()}</span>
        <h1 className={'gs-h1' + (s.loss ? ' lg-loss' : '')}>{s.end || 'In progress'}</h1>
        {ed && ed.label && s.title && <span className="gs-muted">{s.title}</span>}
      </section>
      <div className="lg-split">
        <LgResult sid={sid} />
        <aside><LgShareBlock id={id} sid={sid} /></aside>
      </div>
    </main>
  );
};

// ---- Mount: the real game screens, with `record` drawn by the chosen option --------
const LG_OPTS = [
  { id: '1', name: 'Ledger', idea: 'One page holds everything. A session opens in place, and its share text sits open under the result, ready to copy.',
    cost: 'The page grows with every edition. Achievements sit beside the list, not above it, so on a phone they come last.',
    detail: 'On this page, opened in place', share: 'Shown open under the session', ended: 'Earned stay listed; what was left to earn becomes one line' },
  { id: '2', name: 'Spotlight', idea: 'Your latest result leads, large. Pick any session from the list beside it and it takes the spotlight. Share is a button that opens the text in a panel.',
    cost: 'One session at a time, so comparing two means switching. On a phone the list sits under the spotlight, and a pick scrolls you back up.',
    detail: 'On this page, in the spotlight', share: 'A button, then a panel', ended: 'The whole list stays, with progress stopped at the end date' },
  { id: '3', name: 'Overview', idea: 'The page is a summary: what’s out now, where you left off and your run, then a short list. Each session opens its own page. Copy a result straight from the list.',
    cost: 'Seeing what happened costs a page change, and text copied from the list is unseen until it’s pasted.',
    detail: 'Its own page', share: 'Copied from the list; shown on the session page', ended: 'Earned folded behind one line; nothing left to earn is shown' },
];
const LG_GAMES = [['daily', 'Puzzles'], ['casebook', 'Casebook'], ['delve', 'Delve'], ['hunter', '36,000']];
const LG_VIEWERS = [['pass', 'Pass'], ['free', 'No Pass'], ['ended', 'Pass ended']];
const lgRouteGame = (name) => (LG_GAMES.find(([k]) => GS_GAMES[k].route === name) || [])[0];

const LgPage = ({ id }) => {
  const gs = useGs(); const st = useLg();
  const k = st.opt + id + gs.view + gs.sub.freeUsed;
  if (st.opt === '3' && gs.route.sid) return <LgSessionPage key={k + gs.route.sid} id={id} sid={gs.route.sid} />;
  if (st.opt === '2') return <LgSpot key={k} id={id} />;
  if (st.opt === '3') return <LgOverview key={k} id={id} />;
  return <LgLedger key={k} id={id} />;
};
const lgOrig = { daily: window.GsPuzzles, casebook: window.GsCasebook, delve: window.GsDelve, hunter: window.GsHunter };
const lgGame = (id) => () => {
  const gs = useGs();
  if (gs.view !== 'out' && gs.route.page === 'record') return <LgPage id={id} />;
  const O = lgOrig[id]; return <O />;
};

let lgBooted = false;
const lgApply = (gs, viewer, game) => {
  gs.setDemoView(viewer === 'pass' ? 'pass' : 'free');
  if (viewer === 'ended') gs.setSub({ freeUsed: true });
  gs.setConnected(true);
  setTimeout(() => lgToRecord(window.gsApi, game), 0);
};
const LgStrip = () => {
  const gs = useGs(); const st = useLg();
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { if (!lgBooted) { lgBooted = true; lgApply(gs, st.viewer, st.game); } }, []);
  const o = LG_OPTS.find((x) => x.id === st.opt) || LG_OPTS[0];
  const here = lgRouteGame(gs.route.name) || st.game;
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {st.open ? (
        <div className="pg-strip-in">
          <div className="pg-strip-row">
            <span className="pg-k">Option</span>
            {LG_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={st.opt === x.id} title={x.name} onClick={() => lgSet({ opt: x.id })}>{x.id}</button>)}
            <span className="pg-name">{o.name}</span>
            <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
            <button type="button" className="gs-demo-opt" onClick={() => lgSet({ open: false })}>Hide</button>
          </div>
          <div className="pg-strip-row">
            <span className="pg-k">Game</span>
            {LG_GAMES.map(([k, l]) => <button key={k} type="button" className="gs-demo-opt" aria-pressed={here === k} onClick={() => { lgSet({ game: k }); lgToRecord(gs, k); }}>{l}</button>)}
          </div>
          <div className="pg-strip-row">
            <span className="pg-k">Viewer</span>
            {LG_VIEWERS.map(([v, l]) => <button key={v} type="button" className="gs-demo-opt" aria-pressed={st.viewer === v} onClick={() => { lgSet({ viewer: v }); lgApply(gs, v, here); }}>{l}</button>)}
          </div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => lgSet({ open: true })}>Show · {o.id} {o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} kind="panel" title={o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>Cost.</b> {o.cost}</p>
          <ul className="gs-plain">
            <li className="pg-kv"><span className="gs-muted">A session’s detail</span><b>{o.detail}</b></li>
            <li className="pg-kv"><span className="gs-muted">Sharing</span><b>{o.share}</b></li>
            <li className="pg-kv"><span className="gs-muted">Pass ended</span><b>{o.ended}</b></li>
          </ul>
          <p className="gs-small">Seed and game detail come from the four draft game specs and are proposed. Only Delve fills the game’s own part; the others leave it empty.</p>
        </div>
      </DS.Popup>
    </div>
  );
};

Object.assign(window, { GsPuzzles: lgGame('daily'), GsCasebook: lgGame('casebook'), GsDelve: lgGame('delve'), GsHunter: lgGame('hunter'), GsDemoBar: LgStrip });
