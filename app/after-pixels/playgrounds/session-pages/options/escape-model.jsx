// Escape play model (window.EsModel): the reader that options 1 to 3 share, loaded before them (fix round 1; PG_MODELS lists 'escape').
// It reads the seed's move lines the way the engine's events would project them. Room, par, minutes and the stat strip come from SsOutcome.escape
// (the record, else the seed). Everything else it derives that today's record does not send is S:
// per-lock open minute and hint minute (seeded here from the move's place in the play), locks found, tries and hint rungs per lock, the room's story.
(function () {
  const cap = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);
  const norm = (s) => String(s).toLowerCase().replace(/^the\s+/, '').trim();
  // The first n sentences of a text, with a closing quote restored when the cut falls inside one.
  const sentences = (t, n) => {
    const parts = String(t || '').split(/(?<=[.!?])\s+(?=[A-Z“"])/);
    let out = parts.slice(0, n).join(' ');
    if ((out.match(/“/g) || []).length > (out.match(/”/g) || []).length) out += '”';
    return out;
  };
  const plural = (n, a, b) => n + ' ' + (n === 1 ? a : b);

  // build(session) -> the play as the three options need it.
  function build(session) {
    const out = window.SsOutcome.escape(session);
    const lines = session.lines || [];
    const locks = {}, lockOrder = [], objects = [], hints = [], moves = [];
    let lastOpened = null, lastMove = 0;
    const lockFor = (name) => {
      const key = norm(name);
      if (!locks[key]) { locks[key] = { key, name: 'The ' + key, tries: 0, wrong: 0, hints: [], openedN: null, contents: '', exit: false, gave: null, forced: null, obj: null }; lockOrder.push(locks[key]); }
      return locks[key];
    };
    lines.forEach((l) => {
      const label = l[0], what = l[1] || '', res = l[2] || '';
      const mv = /^Move (\d+)$/.exec(label);
      if (mv) {
        const n = Number(mv[1]); lastMove = n; moves.push(n);
        let m;
        if ((m = /^Examine (.+)$/.exec(what))) {
          const key = norm(m[1]);
          if (!objects.some((o) => o.key === key)) objects.push({ key, name: cap(m[1]), desc: res, n });
        } else if ((m = /^Try an answer \(.+\) on (.+)$/.exec(what)) || (m = /^Set (the .+?) to /.exec(what))) {
          const lk = lockFor(m[1]); lk.tries++;
          if (res === 'Wrong') lk.wrong++; else { lk.openedN = n; lk.exit = res === 'Out'; lk.contents = res === 'Out' ? '' : res; lastOpened = lk; }
        } else if ((m = /^Force (.+?) with (.+)$/.exec(what))) {
          const lk = lockFor(m[1]); lk.openedN = n; lk.forced = m[2]; lastOpened = lk;
        }
      } else if (label === 'Hint') {
        const lk = lockFor(what);
        const rung = /given outright|^The answer/i.test(res) ? 3 : Math.min(2, lk.hints.length + 1);
        lk.hints.push(rung); hints.push({ lock: lk, rung, after: lastMove });
      } else if (label === 'Item' && lastOpened && lastOpened.openedN === lastMove) {
        lastOpened.gave = what;
      }
    });
    // Which object a lock sits on: the object whose last word the lock's name carries (content: locks[].on).
    lockOrder.forEach((lk) => {
      const o = objects.find((ob) => lk.key.split(' ').indexOf(ob.key.split(' ').pop()) >= 0);
      lk.obj = o ? o.key : null;
    });
    const live = !!session.live, ended = !live && (!!session.unfinished || out.status === 'ended');
    const min = out.min, par = out.par, done = !live && !ended;
    const opened = lockOrder.filter((lk) => lk.openedN != null).sort((a, b) => a.openedN - b.openedN);
    // S: the minute a move fell on, seeded from its place in the play (the engine has each event's time).
    const at = (n) => (done && lastMove ? Math.max(1, Math.round(min * n / lastMove)) : null);
    opened.forEach((lk, i) => {
      lk.minute = at(lk.openedN);
      const prev = i ? opened[i - 1].openedN : 0;
      lk.between = moves.filter((n) => n > prev && n < lk.openedN).length;
      lk.index = i + 1;
    });
    hints.forEach((h) => { h.minute = at(h.after); });
    const exitLock = opened.find((lk) => lk.exit) || null;
    const sum = (f) => lockOrder.reduce((a, lk) => a + f(lk), 0);
    return { out, live, ended, done, min, par, over: done && par != null && min > par, lastMove, locks: opened, allLocks: lockOrder, objects, hints, exitLock,
      exitObj: exitLock ? exitLock.obj : null, wrong: sum((lk) => lk.wrong), hintCount: hints.length, forced: opened.filter((lk) => lk.forced).length,
      status: ended ? 'ended' : live ? 'live' : 'done', openCount: opened.length };
  }
  const triesText = (lk) => (lk.tries <= 1 ? 'First try' : lk.tries + ' tries');
  const lockFacts = (lk) => [triesText(lk)].concat(lk.hints.length ? [plural(lk.hints.length, 'hint', 'hints')] : []).concat(lk.forced ? ['Forced with ' + lk.forced] : []).join(' · ');
  const shortName = (lk) => lk.name.replace(/^The /, '');
  // S: a room's story paragraph is content (the room's file), not on the session record. A record's or the seed's own `story` wins; this map is the
  // playground's stand-in until the engine sends it, keyed by the room's name so another room never borrows it.
  const STORIES = { "The Clockmaker's Study": 'Ezra Vale, the clockmaker, has not been seen for a week. You let yourself into his study to look for him, and the door locks behind you.' };
  const storyOf = (session, out) => session.story || ((window.PG_SEED && window.PG_SEED.escape && window.PG_SEED.escape.room === out.label && window.PG_SEED.escape.story) || STORIES[out.label] || null);
  // A lock's number. Its own square, not a Ss.Cells mark1 cell: page-coloured text on the teal mark failed AA (4.28:1) at Middle and Far, so the numeral is
  // body text on the cell ground and the game's mark is the outline.
  const Num = ({ n, size }) => <span className="es-num" style={{ '--n': (size || 26) + 'px' }} role="img" aria-label={'Lock ' + n}>{n}</span>;
  const numCss = `
      :scope .es-num { box-sizing: border-box; width: var(--n); height: var(--n); flex: none; display: inline-grid; place-items: center; background: var(--ss-cell); border: 2px solid var(--ss-mark-1); color: var(--text); font: 600 calc(var(--n) * .5)/1 var(--font-text); }
  `;

  // ================================================================ Between and Game: the floor plan and its parts (shared by options 1 to 3)
  // Every mark is one recorded event. Objects, their first examine move, tries, hints and forced are read from the move lines (deployed). Which object a lock sits
  // on, which lock is the exit and the minute a lock opened are S (seeded in build() above). Position on the plan is examine order, never geography: content has no coordinates.
  const lockState = (lk) => (lk.forced ? 'forced' : lk.openedN != null ? 'open' : 'shut');
  const stateWord = (lk) => ({ forced: 'Forced', open: 'Opened', shut: 'Still locked' })[lockState(lk)];
  // The objects the player examined, in the order they examined them, each with the locks found on it.
  const objItems = (m) => m.objects.map((o, i) => {
    const locks = m.allLocks.filter((lk) => lk.obj === o.key);
    return { o, i, locks, n: o.n, exit: !!m.exitObj && m.exitObj === o.key,
      hints: locks.reduce((a, lk) => Math.max(a, lk.hints.length), 0), wrong: locks.reduce((a, lk) => a + lk.wrong, 0) };
  });
  // The first clause of a quotation, for a one-line row.
  const firstClause = (t) => {
    const first = sentences(t, 1).replace(/^[“"]/, '');
    const cut = first.search(/[,;:.]/);
    const c = (cut > 11 ? first.slice(0, cut) : first).replace(/[”"]$/, '');
    return c.length < first.replace(/[”".]$/, '').length ? c + '…' : c;
  };
  // A lock, drawn: closed (body, shackle seated), opened (green body, shackle raised with its right leg free), forced (the closed lock with a diagonal bar).
  const Glyph = ({ state, label }) => (
    <svg className="es-glyph" data-state={state} width="14" height="22" viewBox="0 0 16 26" role="img" aria-label={label || ({ shut: 'Lock, not opened', open: 'Lock, opened', forced: 'Lock, forced' })[state]}>
      <rect className="es-gbody" x="1" y="12" width="14" height="14" />
      <path className="es-gshackle" d={state === 'open' ? 'M4 12V4H12V8' : 'M4 12V6H12V12'} />
      {state === 'forced' ? <path className="es-gbar" d="M1 26L15 12" /> : null}
    </svg>
  );
  // Hint rungs as three small squares, filled up to the rung reached. Colour comes from the parent (currentColor).
  const SqPips = ({ n }) => (
    <span className="es-sqp" role="img" aria-label={'Hints taken: ' + n + ' of 3'}>{[1, 2, 3].map((r) => <i key={r} className={r <= n ? 'on' : ''} />)}</span>
  );
  const useWidth = (ref) => {
    const [w, setW] = React.useState(0);
    React.useLayoutEffect(() => {
      const el = ref.current; if (!el) return undefined;
      const f = () => setW(Math.floor(el.getBoundingClientRect().width));
      f(); const ro = new ResizeObserver(f); ro.observe(el);
      return () => ro.disconnect();
    }, []);
    return w;
  };

  // The reader's text scale: a probe one em wide, set in the slot's own 13px face, is 13px at the default size and wider as text grows.
  const useScale = (ref) => {
    const [k, setK] = React.useState(1);
    React.useLayoutEffect(() => {
      const el = ref.current; if (!el) return undefined;
      const f = () => setK(Math.max(1, Math.round((el.getBoundingClientRect().width / 13) * 100) / 100));
      f(); const ro = new ResizeObserver(f); ro.observe(el);
      return () => ro.disconnect();
    }, []);
    return k;
  };

  // planGeom: where everything sits. Slots run clockwise from the top-left in examine order; the exit object takes the top-centre slot, and the wall opens there once out.
  // Phone holds 8 slots (top 3, right 2, bottom 2, left 1), desktop 10 (top 3, right 2, bottom 3, left 2). Right and left columns include their corner slots, evenly spaced.
  const quad = (a, c, b, t) => [(1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
  // k is the reader's text scale (1 at the default size). A slot holds a two-line name over a 12px footer, so its height, and the room's, grow with k: lettering is never cut to fit.
  // BADGE is the move number's side; ROW_GAP is the clear strip between rows that carries it, so a number never sits on a label.
  const BADGE = 16, ROW_GAP = 22;
  const planGeom = (W, items, escaped, k) => {
    const big = W >= 560, PT = 30, sh = Math.max(big ? 56 : 0, Math.ceil(52 * k));
    const sw = big ? 140 : Math.max(64, Math.min(88, Math.floor((W - 56) / 3)));
    const xL = 22, xR = W - 22 - sw, xC = Math.round((W - sw) / 2);
    const yT = PT + 14, H = Math.max(big ? 400 : 0, yT + 3 * (sh + ROW_GAP) + sh + 22), yB = H - 22 - sh;
    const col = (i) => Math.round(yT + (i * (yB - yT)) / 3), mid = Math.round((yT + yB) / 2);
    const P = big
      ? [[xL, yT], [xC, yT], [xR, yT], [xR, col(1)], [xR, col(2)], [xR, yB], [xC, yB], [xL, yB], [xL, col(2)], [xL, col(1)]]
      : [[xL, yT], [xC, yT], [xR, yT], [xR, col(1)], [xR, col(2)], [xR, yB], [xL, yB], [xL, mid]];
    const exitItem = escaped ? items.find((it) => it.exit) : null;
    const pool = exitItem ? P.filter((_, i) => i !== 1) : P;
    const rest = items.filter((it) => it !== exitItem);
    const slots = rest.slice(0, pool.length).map((it, k) => ({ it, x: pool[k][0], y: pool[k][1] }));
    if (exitItem) slots.push({ it: exitItem, x: P[1][0], y: P[1][1] });
    slots.sort((a, b) => a.it.i - b.it.i);
    const dropped = rest.length - Math.min(rest.length, pool.length);
    const c = [W / 2, (PT + H - 8) / 2], you = { x: 24, y: yB - (big ? 30 : 26) };
    const cen = (s) => [s.x + sw / 2, s.y + sh / 2];
    const seq = slots.map((s) => ({ s, p: cen(s) }));
    const exitSlot = slots.find((s) => s.it === exitItem);
    if (exitSlot && seq[seq.length - 1].s !== exitSlot) seq.push({ s: exitSlot, p: cen(exitSlot) });
    const legs = [], marks = [];
    const obstacles = [];
    slots.forEach((q) => { obstacles.push([q.x - 1, q.y - 1, q.x + sw + 1, q.y + sh + 1]);
      q.it.locks.forEach((_, i) => { const lx = q.x + sw - 7 - i * 17; obstacles.push([lx - 1, q.y - 12, lx + 15, q.y + 12]); }); });
    let prev = [you.x + 5, you.y + 5], prevSlot = null;
    // A leg runs straight from slot to slot, and bows toward the middle of the room only as far as it must to stay clear of a third slot.
    // The exit slot gets a wide berth (its own leg arrives at its foot, with the move number), so a leg that is not going out never reads as going out.
    const hits = (pts, a, b) => slots.some((q) => { if (q === a || q === b) return false; const m = q === exitSlot ? 30 : 5;
      return pts.some((t) => t[0] > q.x - m && t[0] < q.x + sw + m && t[1] > q.y - m && t[1] < q.y + sh + m); });
    seq.forEach(({ s, p }) => {
      const mx = (prev[0] + p[0]) / 2, my = (prev[1] + p[1]) / 2, dx = p[0] - prev[0], dy = p[1] - prev[1];
      const vx = c[0] - mx, vy = c[1] - my, vl = Math.hypot(vx, vy) || 1;
      let ctl = [mx, my];
      // Toward the middle first (as far as 150); only when every such bow still grazes a slot, try the other side of the chord and then wider bows.
      for (const push of [0, 36, 56, 76, 96, 120, 150, -36, -56, -76, -96, -120, -150, 190, 230, -190, -230]) {
        ctl = [mx + (vx / vl) * push, my + (vy / vl) * push];
        const pts = []; for (let k = 0; k <= 30; k++) pts.push(quad(prev, ctl, p, k / 30));
        if (!hits(pts, prevSlot, s)) break;
      }
      legs.push('M' + prev[0].toFixed(1) + ' ' + prev[1].toFixed(1) + 'Q' + ctl[0].toFixed(1) + ' ' + ctl[1].toFixed(1) + ' ' + p[0].toFixed(1) + ' ' + p[1].toFixed(1));
      // The move number rides the route just outside the slot it arrives at: back along the leg until its box clears every slot and lock pin.
      let t = 1; const clear = (q) => obstacles.every((o) => q[0] + BADGE / 2 <= o[0] || q[0] - BADGE / 2 >= o[2] || q[1] + BADGE / 2 <= o[1] || q[1] - BADGE / 2 >= o[3]);
      while (t > 0.05 && !clear(quad(prev, ctl, p, t))) t -= 0.02;
      marks.push({ s, at: quad(prev, ctl, p, Math.max(t, 0)) });
      prev = p; prevSlot = s;
    });
    const gx = W / 2, gl = gx - 28, gr = gx + 28;
    const wall = escaped
      ? 'M' + gl + ' ' + PT + 'H8V' + (H - 8) + 'H' + (W - 8) + 'V' + PT + 'H' + gr
      : 'M8 ' + PT + 'H' + (W - 8) + 'V' + (H - 8) + 'H8Z';
    return { big, W, H, PT, sw, sh, slots, dropped, legs, marks, you, wall, gl, gr, gx, escaped, last: prev };
  };

  // The floor plan. interactive: slots are buttons (selected, onSelect). Lettering is the object's name, also in the Record.
  const Plan = ({ m, interactive, selected, onSelect, caption }) => {
    const ref = React.useRef(null), probe = React.useRef(null);
    const W0 = useWidth(ref), W = Math.min(W0, 640), k = useScale(probe);
    const items = React.useMemo(() => objItems(m), [m]);
    const escaped = m.done && !!m.exitLock;
    const g = W > 0 ? planGeom(W, items, escaped, k) : null;
    return (
      <figure className="es-fig">
        <div className="es-pic" ref={ref} style={g ? null : { minHeight: 290 }}>
          <span className="es-probe" ref={probe} aria-hidden="true" />
          {g ? (
            <div className="es-plan" style={{ width: W, height: g.H, '--es-k': k }} role="group" aria-label={'Floor plan of the room, objects in the order you examined them' + (escaped ? '; the way out is open' : '')}>
              <svg className="es-svg" width={W} height={g.H} viewBox={'0 0 ' + W + ' ' + g.H} aria-hidden="true">
                <path className="es-wall" d={g.wall} />
                {escaped ? <path className="es-leaf" d={'M' + g.gl + ' ' + g.PT + 'L' + (g.gl - 25) + ' ' + (g.PT - 25)} /> : null}
                {g.legs.map((d, i) => <path key={i} className="es-route" d={d} />)}
                {escaped ? <path className="es-route" d={'M' + g.gx + ' ' + (g.slots.some((q) => q.it.exit) ? g.PT + 14 : g.PT) + 'V9'} /> : null}
                {escaped ? <polygon className="es-arrow" points={(g.gx - 5) + ',14 ' + (g.gx + 5) + ',14 ' + g.gx + ',3'} /> : null}
                <rect className="es-you" x={g.you.x} y={g.you.y} width="10" height="10" />
              </svg>
              {g.slots.map((s) => {
                const it = s.it, on = selected === it.o.key;
                const label = it.o.name + (it.locks.length ? ', ' + it.locks.map((lk) => stateWord(lk).toLowerCase()).join(', ') : '') + (it.hints ? ', ' + EsModel.plural(it.hints, 'hint', 'hints') : '') + (it.wrong ? ', ' + EsModel.plural(it.wrong, 'wrong try', 'wrong tries') : '');
                const Tag = interactive ? 'button' : 'div';
                return (
                  <React.Fragment key={it.o.key}>
                    <Tag className="es-slot" data-exit={it.exit && escaped ? 1 : 0} data-sel={on ? 1 : 0} data-foot={it.locks.length ? 1 : 0} {...(interactive ? { type: 'button', 'aria-pressed': on, onClick: () => onSelect && onSelect(on ? null : it.o.key) } : { role: 'img' })}
                      aria-label={label} style={{ left: s.x, top: s.y, width: g.sw, height: g.sh }}>
                      <span className="es-name">{it.o.name}</span>
                      {it.locks.length ? <span className="es-foot"><EsModel.SqPips n={it.hints} />{it.wrong ? <b>{'×' + it.wrong}</b> : null}</span> : null}
                    </Tag>
                    {it.locks.map((lk, k) => (
                      <span key={lk.key} className="es-lockpin" style={{ left: s.x + g.sw - 7 - k * 17, top: s.y - 11 }}><Glyph state={lockState(lk)} /></span>
                    ))}
                  </React.Fragment>
                );
              })}
              {g.marks.map(({ s, at }, i) => (
                s.it.n != null ? <span key={'n' + i} className="es-num16" style={{ left: at[0] - 8, top: at[1] - 8 }} aria-hidden="true">{s.it.n}</span> : null))}
            </div>
          ) : null}
        </div>
        <figcaption className="ss-caption">{caption || 'Placed in the order you examined them.'}{g && g.dropped ? ' ' + g.dropped + ' more in the record.' : ''}</figcaption>
      </figure>
    );
  };
  const planCss = `
      :scope .es-fig { margin: 0; display: grid; gap: 8px; min-width: 0; }
      :scope .es-pic { background: var(--cover-bg-indigo); box-shadow: var(--shadow-card); display: grid; justify-items: center; min-width: 0; overflow: hidden; }
      :scope .es-plan { position: relative; flex: none; }
      :scope .es-probe { position: absolute; left: 0; top: 0; width: 1em; height: 1px; visibility: hidden; pointer-events: none; font: 600 13px/1 var(--font-text); }
      :scope .es-svg { position: absolute; inset: 0; display: block; }
      :scope .es-wall { fill: none; stroke: var(--cover-cream); stroke-width: 3; stroke-linejoin: miter; stroke-linecap: butt; }
      :scope .es-leaf { fill: none; stroke: var(--cover-cream); stroke-width: 2; stroke-linecap: butt; }
      :scope .es-route { fill: none; stroke: var(--cover-amber); stroke-width: 2; stroke-linecap: butt; }
      :scope .es-arrow { fill: var(--cover-amber); }
      :scope .es-you { fill: var(--cover-cream); }
      :scope .es-slot { position: absolute; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; margin: 0; padding: 3px 2px; border-radius: 0; background: color-mix(in srgb, var(--cover-cream) 9%, var(--cover-bg-indigo)); border: 1.5px solid var(--cover-cream); color: var(--cover-cream); font: 600 13px/1.15 var(--font-text); text-align: center; appearance: none; -webkit-appearance: none; cursor: default; overflow: hidden; }
      :scope button.es-slot { cursor: pointer; }
      :scope .es-name { flex: 1; min-height: 0; display: grid; align-items: center; justify-items: center; overflow: hidden; overflow-wrap: anywhere; }
      :scope .es-slot[data-foot="0"] .es-name { flex: none; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
      :scope .es-foot { flex: none; display: flex; justify-content: space-between; align-items: center; height: calc(12px * var(--es-k, 1)); line-height: 1; }
      :scope .es-foot b { font: 600 12px/12px var(--font-text); }
      :scope .es-slot[data-exit="1"] { border-color: var(--cover-amber); border-width: 2px; }
      :scope .es-slot[data-sel="1"] { background: var(--cover-cream); color: var(--cover-bg-indigo); }
      :scope .es-slot:focus-visible { outline: 2px solid var(--cover-amber); outline-offset: 2px; }
      :scope .es-lockpin, :scope .es-num16 { position: absolute; display: block; pointer-events: none; }
      :scope .es-lockpin { line-height: 0; }
      :scope .es-glyph { display: block; }
      :scope .es-gbody { fill: var(--cover-cream); }
      :scope .es-gshackle { fill: none; stroke: var(--cover-cream); stroke-width: 2; stroke-linejoin: miter; stroke-linecap: butt; }
      :scope .es-glyph[data-state="open"] .es-gbody { fill: var(--cover-green); }
      :scope .es-glyph[data-state="open"] .es-gshackle { stroke: var(--cover-green); }
      :scope .es-gbar { stroke: var(--cover-orange); stroke-width: 2.5; }
      :scope .es-sqp { display: inline-flex; gap: 3px; vertical-align: middle; color: var(--cover-amber); }
      :scope .es-sqp i { box-sizing: border-box; width: 6px; height: 6px; border: 1px solid currentColor; }
      :scope .es-sqp i.on { background: currentColor; }
      :scope .es-num16 { width: 16px; height: 16px; background: var(--cover-cream); color: var(--cover-bg-indigo); font: 700 11px/16px var(--font-text); text-align: center; }
  `;
  window.EsModel = { numCss, build, sentences, plural, triesText, lockFacts, shortName, cap, storyOf, Num, lockState, stateWord, objItems, firstClause, Glyph, SqPips, useWidth, Plan, planCss, useScale };


})();
