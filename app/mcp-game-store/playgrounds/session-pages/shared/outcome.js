// Session pages shared foundation: one outcome function per game. Plain script (no Babel), loads before the kit.
// SsOutcome[game](session) -> { h1, mark, label, lines, link, live, ended }
//   h1     the page title: the share text's outcome line without its emoji (build-rulings 1). Null only if the session has no title yet.
//   mark   '✅' | '❌' | '' : the emoji the share line carries. The page never prints it (no emoji on the page).
//   label  the head's label line text ("Daily Word No. 212").
//   lines  the exact share text as an array of lines, link last. Null while the play is unfinished (no Share).
// The page's h1 and the Share card both read this, so they cannot drift. Texts: share-shortlist.md B plus fable-steer.md section 4.
// Data not on today's record (marked S in shortlist.md) is derived from the seed; an option's cost line says "needs the engine to send X".
(function () {
  var LINK = 'mcpgames.example/';
  var plural = function (n, one, many) { return n + ' ' + (n === 1 ? one : many); };
  var done = function (s) { return !(s.live || s.unfinished); };

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
    if (s.unfinished) return { h1: 'Not finished', mark: '', label: label, lines: null, ended: true, play: p };
    if (s.live) return { h1: 'In progress', mark: '', label: label, lines: null, live: true, play: p };
    var won = !s.loss, last = p.guesses[n - 1], off = !won && last && (last.marks.match(/h/g) || []).length === 4;
    var line = won ? (n === 1 ? 'One shot' : n === 6 ? 'Just in time' : 'Solved in ' + n) + hint
      : off ? 'One letter off' : 'Out of guesses';
    var mark = won ? '✅' : '❌';
    var emoji = { h: '🟩', n: '🟨', x: '⬛' };
    var grid = p.guesses.map(function (g) { return g.marks.split('').map(function (c) { return emoji[c]; }).join(''); });
    return { h1: line, mark: mark, label: label, play: p, link: LINK + 'daily-word',
      lines: [label, mark + ' ' + line].concat(grid, ['Six guesses. Your go:', LINK + 'daily-word']) };
  }

  // ---- Daily Mystery ---- (S: which accusation parts were wrong: seed field s.wrong = ['room'] etc.; the victim's short role comes from s.victim)
  function mystery(s) {
    var label = 'Daily Mystery No. ' + s.number;
    if (s.unfinished) return { h1: 'Not finished', mark: '', label: label, lines: null, ended: true };
    if (s.live) return { h1: 'In progress', mark: '', label: label, lines: null, live: true };
    var q = s.q != null ? s.q : s.lines.filter(function (l) { return /^Question/.test(l[0]); }).length;
    var role = s.victim && s.victim.indexOf(',') > -1 ? s.victim.split(',').pop().trim() : null;
    var ask = role ? ['Who killed ' + role + '?'] : [];
    var parts = ['suspect', 'weapon', 'room'], w = s.wrong || [], line, counts = [];
    if (!s.loss) line = (s.hints || 0) === 0 ? 'Solved, no hints' : 'Solved · ' + plural(q, 'question', 'questions');
    else {
      if (w.length === 1) line = 'Wrong ' + w[0];
      else if (w.length === 2) line = 'Only the ' + parts.filter(function (x) { return w.indexOf(x) < 0; })[0] + ' right';
      else if (w.length === 3) line = 'Wrong on all three';
      else line = 'Wrong accusation';   // the parts are not on the record: omitted, not faked
      if (q) counts = [plural(q, 'question', 'questions')];
    }
    var mark = s.loss ? '❌' : '✅';
    return { h1: line, mark: mark, label: label, link: LINK + 'mystery',
      lines: [label, mark + ' ' + line].concat(counts, ask, ['One accusation. Your go:', LINK + 'mystery']) };
  }

  // ---- Casebook ---- (record shape from cbMake: title, verdict 'right'|'wrong'|null, turns, lies, rec[{c}])
  function casebook(c) {
    var label = c.title;
    if (c.live) return { h1: 'In progress', mark: '', label: label, lines: null, live: true };
    var right = c.verdict === 'right', dawn = c.turns >= 16;
    var line = right ? (dawn ? 'Solved at dawn' : 'Solved before dawn') : (dawn ? 'Wrong, at dawn' : 'Wrong accusation');
    var mark = right ? '✅' : '❌';
    // Three marks (fable-steer 4): 💥 a lie broken, ⬛ any other turn, ⬜ a turn not used.
    var turnsRec = (c.rec || []).filter(function (x) { return x.c !== 'A'; });   // the accusation is not a turn
    var cells = []; for (var i = 0; i < 16; i++) { var r = i < c.turns ? turnsRec[i] || { c: 'Q' } : null; cells.push(!r ? 'unused' : r.c === 'B' ? 'break' : 'turn'); }
    var e = { unused: '⬜', break: '💥', turn: '⬛' };
    var rows = [cells.slice(0, 8), cells.slice(8)].map(function (r) { return r.map(function (k) { return e[k]; }).join(''); });
    return { h1: line, mark: mark, label: label, cells: cells, link: LINK + 'casebook',
      lines: ['Casebook', c.title, mark + ' ' + line, c.turns + ' turns · ' + plural(c.lies, 'lie', 'lies') + ' broken'].concat(rows, ['Sixteen turns. Your go:', LINK + 'casebook']) };
  }

  // ---- Escape ---- (S: the margin against par. Par is 30 for The Clockmaker's Study; s.par overrides)
  function escape(s) {
    var label = "The Clockmaker's Study";
    if (s.live) return { h1: 'In progress', mark: '', label: label, lines: null, live: true };
    var min = Number((/(\d+) min/.exec(s.result) || [])[1]), par = s.par || 30, d = Math.abs(min - par);
    var line = 'Escaped' + (d === 0 ? ' on par' : ', ' + d + ' min ' + (min < par ? 'under' : 'over') + ' par');
    var hints = s.lines.filter(function (l) { return l[0] === 'Hint'; }), given = hints.filter(function (l) { return /given outright/i.test(l[2] || ''); }).length;
    var wrong = (s.figures || []).filter(function (f) { return /\d+ wrong/.test(f); });
    var helpLine = given ? (given === 1 ? 'Given the answer' : given === 2 ? 'Given the answer twice' : 'Given the answer ' + given + ' times') : null;
    var counts = [min + ' min' + (helpLine || !hints.length ? '' : ' · ' + plural(hints.length, 'hint', 'hints'))];
    if (wrong.length) counts.push(wrong[0]);
    if (helpLine) counts.push(helpLine);
    return { h1: line, mark: '', label: label, par: par, min: min, link: LINK + 'escape',
      lines: ['Escape', label, line].concat(counts, ['Beat par. Your go:', LINK + 'escape']) };
  }

  // ---- Delve ---- (all deployed: the tape and its marks come from the record's own share lines)
  function delve(s) {
    var setting = s.shareLines ? s.shareLines[0] : 'Delve';
    if (s.live) return { h1: 'In progress', mark: '', label: setting, lines: null, live: true };
    var head = s.shareLines[1].split(' · '), hero = head[0], tape = Array.from(s.shareLines[2]);
    var rolls = Number((/(\d+) rolls/.exec(s.shareLines[1]) || [])[1]) || tape.length, streak = /longest streak (\d+)/.exec(s.shareLines[1]);
    var mark = s.loss ? '❌' : '✅', line = s.result;
    var half = Math.ceil(tape.length / 2), rows = [tape.slice(0, half).join(''), tape.slice(half).join('')].filter(Boolean);
    // The hero's name sits in the head's sub-caption and share line 3, and nowhere else (hero.name is for the option to place).
    return { h1: line, mark: mark, label: setting, hero: hero, tape: tape, link: LINK + 'delve',
      lines: ['Delve', setting, hero, mark + ' ' + line, rolls + ' rolls' + (streak ? ' · streak of ' + streak[1] : '')].concat(rows, ['A d20 decides. Your go:', LINK + 'delve']) };
  }

  window.SsOutcome = { word: word, mystery: mystery, casebook: casebook, escape: escape, delve: delve, wordPlay: wordPlay, wordMarks: wordMarks, plural: plural };
  window.SsDone = done;
})();
