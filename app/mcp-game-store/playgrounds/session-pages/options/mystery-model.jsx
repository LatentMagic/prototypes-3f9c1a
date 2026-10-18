// Daily Mystery model: window.PgMystery, the one reader of a Mystery session that options 1 to 3 draw from.
// Deployed record (D): lines "Question N · text · Yes/No", "Hint · ...", "Accusation · suspect, with the weapon, in the room · Right/Wrong".
// Not on the record yet (S): the setting and the victim (seed fields), and which accusation parts missed (seed field `wrong`).
// Counts use the same rule as SsOutcome.mystery (the record's lines when it has any, else s.q / s.hints), so a page and its share text cannot disagree.
(function () {
  const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
  const PgMystery = {
    cap,
    read(s) {
      const lines = s.lines || [];
      let setting = s.setting, victim = s.victim;
      // The same edition is the same case: a play with no setting or victim of its own (the live seed) borrows them from the played edition of that number.
      if ((!setting || !victim) && window.GS_SESSIONS) {
        Object.keys(window.GS_SESSIONS).forEach((k) => {
          const o = window.GS_SESSIONS[k];
          if (o && o.gid === 'mystery' && o.number === s.number && o.setting) { setting = setting || o.setting; victim = victim || o.victim; }
        });
      }
      const vi = victim ? victim.indexOf(',') : -1;
      const items = [];
      let acc = null;
      lines.forEach((l) => {
        if (/^Question/.test(l[0])) items.push({ kind: 'q', n: items.filter((x) => x.kind === 'q').length + 1, text: l[1], answer: l[2] });
        else if (l[0] === 'Hint') items.push({ kind: 'hint', text: l.slice(1).join(' · ') });
        else if (l[0] === 'Accusation') {
          const m = /^(.+?), with (.+?), in (.+)$/.exec(l[1] || '');
          acc = { raw: l[1], suspect: m ? m[1] : l[1], weapon: m ? m[2] : '', room: m ? m[3] : '', right: l[2] === 'Right' };
        }
      });
      const qs = items.filter((x) => x.kind === 'q'), hints = items.filter((x) => x.kind === 'hint');
      // Which parts missed: all right on a solve; the seed's `wrong` list on a loss; unknown when the record does not say.
      let verdict = null;
      if (acc) {
        if (acc.right) verdict = { suspect: true, weapon: true, room: true };
        else if (Array.isArray(s.wrong)) verdict = { suspect: s.wrong.indexOf('suspect') < 0, weapon: s.wrong.indexOf('weapon') < 0, room: s.wrong.indexOf('room') < 0 };
      }
      const asked = lines.length ? qs.length : (s.q != null ? s.q : 0);
      const hintCount = lines.length ? hints.length : (s.hints || 0);
      return {
        setting: setting ? cap(setting) : null,
        victimName: victim ? (vi > -1 ? victim.slice(0, vi) : victim) : null,
        victimRole: victim && vi > -1 ? victim.slice(vi + 1).trim() : null,
        items, qs, hints, acc, verdict, asked, hintCount,
        right: verdict ? ['suspect', 'weapon', 'room'].filter((k) => verdict[k]).length : null,
      };
    },
    // The one line the live Share card says about the case still open.
    say(c) {
      const ql = 2 - c.asked, hl = 2 - c.hintCount;
      const q = ql === 0 ? 'No questions left' : ql + (ql === 1 ? ' question left' : ' questions left');
      return q + (hl === 2 ? '' : hl === 0 ? ', no hints left' : ', 1 hint left') + '.';
    },
    // The scene as one sentence ("Storm-bound weekend at X. The victim was Y, the medium."), or null when the record has none.
    scene(c) {
      if (!c.setting) return null;
      return c.setting + (c.victimName ? '. The victim was ' + c.victimName + (c.victimRole ? ', ' + c.victimRole : '') + '.' : '.');
    },
    statusOf(s) { return s.unfinished ? 'ended' : s.live ? 'live' : 'done'; },
    // Record title: the list holds questions, hints and the accusation, so it is "Every move" (canon's "Every question" would count the accusation as one).
    recordTitle: 'Every move',
  };
  window.PgMystery = PgMystery;
})();
