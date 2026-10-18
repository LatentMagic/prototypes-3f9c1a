// Session pages shared foundation: one outcome function per game. Plain script (no Babel), loads before the kit.
// SsOutcome[game](session) -> { h1, mark, label, lines, link, live, ended }
//   h1     the page title: the share text's outcome line without its emoji (build-rulings 1). Null only if the session has no title yet.
//   mark   '✅' | '❌' | '' : the emoji the share line carries. The page never prints it (no emoji on the page).
//   label  the head's label line text ("Daily Word No. 212").
//   lines  the exact share text as an array of lines, link last. Null while the play is unfinished (no Share).
//   status 'done' | 'live' | 'ended' (ended = abandoned or unfinished and no longer playable). EVERY outcome carries it, for every record shape:
//          a live, abandoned or half-built record never throws and never prints NaN; it returns h1 'In progress' / 'Not finished', lines null.
//   stats  [{label, value}] the head's fact strip for this game and state: only what the h1 does not say (empty array = no strip). One list per game,
//          so options stop computing their own (fix round 1, A3).
// The page's h1 and the Share card both read this, so they cannot drift. Texts: share-shortlist.md B plus fable-steer.md section 4.
// Data not on today's record (marked S in shortlist.md) is derived from the seed; an option's cost line says "needs the engine to send X".
(function () {
  var LINK = 'mcpgames.example/';
  var plural = function (n, one, many) { return n + ' ' + (n === 1 ? one : many); };
  var done = function (s) { return !(s.live || s.unfinished); };
  var count = function (lines, re) { return (lines || []).filter(function (l) { return re.test(l[0]); }).length; };
  var stat = function (label, value) { return { label: label, value: String(value) }; };
  // The two non-finished shapes, the same for every game.
  var notDone = function (s, label, extra) {
    var base = s.unfinished ? { h1: 'Not finished', mark: '', label: label, lines: null, ended: true, status: 'ended' }
      : { h1: 'In progress', mark: '', label: label, lines: null, live: true, status: 'live' };
    for (var k in (extra || {})) base[k] = extra[k];
    return base;
  };

  // ---- Daily Word ----
  // S: per-letter marks. Seeds carry the guessed words and the answer, so the marks are computed the way the engine scores them.
  function wordMarks(guess, answer) {
    var g = guess.toUpperCase().split(''), a = answer.toUpperCase().split(''), m = g.map(function () { return 'x'; }), left = {};
    a.forEach(function (ch, i) { if (g[i] === ch) m[i] = 'h'; else left[ch] = (left[ch] || 0) + 1; });
    g.forEach(function (ch, i) { if (m[i] !== 'h' && left[ch]) { m[i] = 'n'; left[ch]--; } });
    return m.join('');
  }
  // The play as the board needs it: guesses with marks and captions, hints in their place between guesses.
  function wordPlay(s) {
    var rows = [], guesses = [];
    var answer = s.answer || ((s.lines.filter(function (l) { return /^Guess/.test(l[0]); }).pop() || [])[1] || '');
    s.lines.forEach(function (l) {
      if (/^Guess/.test(l[0])) {
        var marks = wordMarks(l[1], answer), h = (marks.match(/h/g) || []).length, n = (marks.match(/n/g) || []).length;
        // At most four words, so a row stays one line on a phone.
        var cap = h === 5 ? 'Solved' : (h ? h + ' in place' : '') + (h && n ? ', ' : '') + (n ? n + ' near' : '') || 'No letters';
        var row = { kind: 'guess', word: l[1].toUpperCase(), marks: marks, caption: cap, n: guesses.length + 1 };
        rows.push(row); guesses.push(row);
      } else if (/^Hint/.test(l[0])) {
        var m = /letter ([A-Z])\b/i.exec(l[1] || ''); var pos = /Letter (\d) is ([A-Z])/i.exec(l[1] || '');
        rows.push({ kind: 'hint', letter: pos ? pos[2].toUpperCase() : (m ? m[1].toUpperCase() : '?'), pos: pos ? Number(pos[1]) - 1 : 0,
          caption: pos ? 'Hint: letter ' + pos[1] + ' is ' + pos[2].toUpperCase() : 'Hint: it has ' + (m ? m[1].toUpperCase() : 'a letter') });
      }
    });
    var hints = rows.filter(function (r) { return r.kind === 'hint'; }).length;
    return { rows: rows, guesses: guesses, hints: hints };
  }
  function word(s) {
    var p = wordPlay(s), n = p.guesses.length, hint = p.hints ? ' · ' + plural(p.hints, 'hint', 'hints') : '';
    var label = 'Daily Word No. ' + s.number;
    if (s.unfinished || s.live) {
      var open = [stat('Guesses', n + ' of 6'), stat('Hints', p.hints ? p.hints : 'None')];
      return notDone(s, label, { play: p, stats: open });
    }
    var won = !s.loss, last = p.guesses[n - 1], off = !won && last && (last.marks.match(/h/g) || []).length === 4;
    var line = won ? (n === 1 ? 'One shot' : n === 6 ? 'Just in time' : 'Solved in ' + n) + hint
      : off ? 'One letter off' : 'Out of guesses';
    var mark = won ? '✅' : '❌';
    var emoji = { h: '🟩', n: '🟨', x: '⬛' };
    var grid = p.guesses.map(function (g) { return g.marks.split('').map(function (c) { return emoji[c]; }).join(''); });
    // The h1 already says guesses and hints on a finished day: no stats.
    return { h1: line, mark: mark, label: label, play: p, link: LINK + 'daily-word', status: 'done', stats: [],
      lines: [label, mark + ' ' + line].concat(grid, ['Six guesses. Your go:', LINK + 'daily-word']) };
  }

  // ---- Daily Mystery ---- (S: which accusation parts were wrong: seed field s.wrong = ['room'] etc.; the victim's short role comes from s.victim)
  // Questions and hints come from the record's own lines when it has any (the deployed shape), else from s.q / s.hints.
  function mystery(s) {
    var label = 'Daily Mystery No. ' + s.number, L = s.lines || [];
    var q = L.length ? count(L, /^Question/) : (s.q != null ? s.q : 0), hn = L.length ? count(L, /^Hint/) : (s.hints || 0);
    var open = [stat('Questions', q + ' of 2'), stat('Hints', hn ? hn + ' of 2' : 'None')];
    if (s.unfinished || s.live) return notDone(s, label, { stats: open, asked: q, hintCount: hn });
    var role = s.victim && s.victim.indexOf(',') > -1 ? s.victim.split(',').pop().trim() : null;
    var ask = role ? ['Who killed ' + role + '?'] : [];
    var parts = ['suspect', 'weapon', 'room'], w = s.wrong || [], line, counts = [];
    if (!s.loss) {
      // A solve with no hints is the specced brag; with hints it says how many (a count of none is left out), and the questions go on their own line.
      line = hn === 0 ? 'Solved, no hints' : 'Solved · ' + plural(hn, 'hint', 'hints');
      if (hn && q) counts = [plural(q, 'question', 'questions')];
    } else {
      if (w.length === 1) line = 'Wrong ' + w[0];
      else if (w.length === 2) line = 'Only the ' + parts.filter(function (x) { return w.indexOf(x) < 0; })[0] + ' right';
      else if (w.length === 3) line = 'Wrong on all three';
      else line = 'Wrong accusation';   // the parts are not on the record: omitted, not faked
      var c = [];
      if (q) c.push(plural(q, 'question', 'questions'));
      if (hn) c.push(plural(hn, 'hint', 'hints'));
      if (c.length) counts = [c.join(' · ')];
    }
    var mark = s.loss ? '❌' : '✅';
    // Stats: only what the h1 does not say. A solve names its hints in the h1.
    var stats = [stat('Questions', q + ' of 2')];
    if (s.loss) stats.push(stat('Hints', hn ? hn + ' of 2' : 'None'));
    return { h1: line, mark: mark, label: label, link: LINK + 'mystery', status: 'done', stats: stats, asked: q, hintCount: hn,
      lines: [label, mark + ' ' + line].concat(counts, ask, ['One accusation. Your go:', LINK + 'mystery']) };
  }

  // ---- Casebook ---- (record shape from cbMake: title, verdict 'right'|'wrong'|null, turns, lies, rec[{c}])
  // A record with no verdict that is not live is an abandoned case: it has no outcome and no Share.
  function casebook(c) {
    var label = c.title || 'Casebook', turns = c.turns || 0, lies = c.lies || 0;
    if (c.live || c.unfinished || !c.verdict) {
      var st = [stat('Turns', turns + ' of 16'), stat('Lies exposed', c.live ? lies : (c.total != null ? lies + ' of ' + c.total : lies))];
      return notDone({ unfinished: !c.live }, label, { stats: st });
    }
    var right = c.verdict === 'right', dawn = turns >= 16;
    var line = right ? (dawn ? 'Solved at dawn' : 'Solved before dawn') : (dawn ? 'Wrong, at dawn' : 'Wrong accusation');
    var mark = right ? '✅' : '❌';
    // Three marks (fable-steer 4): 💥 a lie broken, ⬛ any other turn, ⬜ a turn not used.
    var turnsRec = (c.rec || []).filter(function (x) { return x.c !== 'A'; });   // the accusation is not a turn
    var cells = []; for (var i = 0; i < 16; i++) { var r = i < turns ? turnsRec[i] || { c: 'Q' } : null; cells.push(!r ? 'unused' : r.c === 'B' ? 'break' : 'turn'); }
    var e = { unused: '⬜', break: '💥', turn: '⬛' };
    var rows = [cells.slice(0, 8), cells.slice(8)].map(function (r) { return r.map(function (k) { return e[k]; }).join(''); });
    var stats = [stat('Turns', turns + ' of 16'), stat('Lies exposed', c.total != null ? lies + ' of ' + c.total : lies)];
    return { h1: line, mark: mark, label: label, cells: cells, link: LINK + 'casebook', status: 'done', stats: stats,
      lines: ['Casebook', c.title, mark + ' ' + line, turns + ' turns · ' + plural(lies, 'lie', 'lies') + ' broken'].concat(rows, ['Sixteen turns. Your go:', LINK + 'casebook']) };
  }

  // ---- Escape ---- (S: the room and its par. Neither is on today's record, so both come from the seed (window.PG_SEED.escape); a record's own s.room / s.par win.)
  // The margin is the record's own verdict ("under par" / "over par") with a number only when the seed's par agrees with it; a record that
  // disagrees with the seed's par gets "under par" / "over par" and no invented minutes (fix round 1; fuzz 3).
  var minutesOf = function (txt) {
    var m = /(?:(\d+)\s*h\s*)?(\d+)\s*min/.exec(txt || '');
    return m ? Number(m[1] || 0) * 60 + Number(m[2]) : NaN;
  };
  function escape(s) {
    var seed = (window.PG_SEED && window.PG_SEED.escape) || {};
    var label = s.room || s.edTitle || seed.room || 'Escape', L = s.lines || [];
    var open = { stats: [] };
    if (s.unfinished || s.live) return notDone(s, label, open);
    var min = minutesOf(s.result), par = s.par != null ? Number(s.par) : (seed.par != null ? Number(seed.par) : NaN);
    var side = /under par/i.test(s.result || '') ? 'under' : /over par/i.test(s.result || '') ? 'over' : null;
    if (isNaN(min)) return notDone({ unfinished: true }, label, open);   // no finishing time on the record: nothing to say, and no NaN to print
    var d = Math.abs(min - par), agree = !isNaN(par) && (!side || (side === 'under' ? min < par : side === 'over' ? min > par : true));
    var line = 'Escaped';
    if (agree && !isNaN(par)) line += d === 0 ? ' on par' : ', ' + d + ' min ' + (min < par ? 'under' : 'over') + ' par';
    else if (side) line += ', ' + side + ' par';
    var hints = L.filter(function (l) { return l[0] === 'Hint'; }), given = hints.filter(function (l) { return /given outright/i.test(l[2] || ''); }).length;
    var fig = function (re) { var f = (s.figures || []).filter(function (x) { return re.test(x); })[0]; return f ? Number(re.exec(f)[1]) : null; };
    var wrongN = fig(/(\d+) wrong/); if (wrongN == null) wrongN = L.filter(function (l) { return l[2] === 'Wrong'; }).length;
    var hintN = fig(/(\d+) hint/); if (hintN == null) hintN = hints.length;
    var forcedN = Math.max(L.filter(function (l) { return /^Move/.test(l[0]) && /^Force /.test(l[1] || ''); }).length, fig(/(\d+) locks? forced/) || 0);
    var helpLine = given ? (given === 1 ? 'Given the answer' : given === 2 ? 'Given the answer twice' : 'Given the answer ' + given + ' times') : null;
    var counts = [min + ' min' + (helpLine || !hintN ? '' : ' · ' + plural(hintN, 'hint', 'hints'))];
    if (wrongN) counts.push(plural(wrongN, 'wrong try', 'wrong tries'));
    if (helpLine) counts.push(helpLine);
    if (forcedN) counts.push(plural(forcedN, 'lock', 'locks') + ' forced');
    var stats = [stat('Time', min + ' min'), stat('Hints', hintN || 'None'), stat('Wrong tries', wrongN)];
    return { h1: line, mark: '', label: label, par: isNaN(par) ? null : par, min: min, forced: forcedN, link: LINK + 'escape', status: 'done', stats: stats,
      parSeeded: s.par == null, roomSeeded: !(s.room || s.edTitle),
      lines: ['Escape', label, line].concat(counts, ['Beat par. Your go:', LINK + 'escape']) };
  }

  // ---- Delve ---- (all deployed: the tape and its marks come from the record's own share lines)
  // A record without share lines (live, or abandoned) has no outcome: ended, never a throw.
  function delve(s) {
    var sl = Array.isArray(s.shareLines) ? s.shareLines : null, L = s.lines || [];
    var setting = sl && sl[0] ? sl[0] : 'Delve';
    var fig = function (re) { var f = (s.figures || []).filter(function (x) { return re.test(x); })[0]; return f ? re.exec(f) : null; };
    var rollsN = (fig(/^(\d+) rolls?$/) || [])[1], hp = fig(/^HP (\d+)\/(\d+)$/), nat = fig(/^(\d+) natural 20/);
    if (rollsN == null) rollsN = L.filter(function (l) { return /^d20/.test(l[1] || ''); }).length;
    var stats = [stat('Rolls', rollsN)];
    if (hp) stats.push(stat('HP', hp[1] + '/' + hp[2]));
    if (nat && Number(nat[1])) stats.push(stat('Natural 20s', nat[1]));
    if (s.unfinished || s.live || !sl || !sl[1] || !sl[2]) return notDone({ unfinished: !!s.unfinished || (!s.live) }, setting, { stats: stats });
    var head = sl[1].split(' · '), hero = head[0], tape = Array.from(sl[2]);
    var rolls = Number((/(\d+) rolls?/.exec(sl[1]) || [])[1]) || tape.length, streak = /longest streak (\d+)/.exec(sl[1]);
    var mark = s.loss ? '❌' : '✅', line = s.result || 'Finished';
    var half = Math.ceil(tape.length / 2), rows = [tape.slice(0, half).join(''), tape.slice(half).join('')].filter(Boolean);
    // The hero's name sits in the head's sub-caption and share line 3, and nowhere else (hero.name is for the option to place).
    return { h1: line, mark: mark, label: setting, hero: hero, tape: tape, link: LINK + 'delve', status: 'done', stats: stats,
      lines: ['Delve', setting, hero, mark + ' ' + line, plural(rolls, 'roll', 'rolls') + (streak ? ' · streak of ' + streak[1] : '')].concat(rows, ['A d20 decides. Your go:', LINK + 'delve']) };
  }

  window.SsOutcome = { word: word, mystery: mystery, casebook: casebook, escape: escape, delve: delve, wordPlay: wordPlay, wordMarks: wordMarks, plural: plural };
  window.SsDone = done;
})();
