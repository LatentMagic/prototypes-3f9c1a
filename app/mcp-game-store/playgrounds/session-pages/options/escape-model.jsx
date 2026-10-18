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
  window.EsModel = { numCss, build, sentences, plural, triesText, lockFacts, shortName, cap, storyOf, Num };


})();
