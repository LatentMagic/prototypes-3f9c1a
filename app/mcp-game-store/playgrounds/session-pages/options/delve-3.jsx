// Session page, Delve, option 3: "The moments". Three things a player retells, picked by a fixed rule and set large; the whole run sits small beneath them.
// Reuses window.DvModel from delve-model.jsx (the run parsed into rolls, the roll cell, canon's tracks and endings cards, the shared CSS).
(function () {
  const h = React.createElement;
  const M = () => window.DvModel;

  // The pick rules, in order; a roll is used once. The last roll is the end, so the first two are picked from the rolls before it.
  //   1 the big roll: the first natural 20, else the highest total.  2 the near thing: the smallest gap between total and target, either way (a miss wins a tie).  3 the end: the last roll.
  function pick(m, session) {
    const R = m.rolls; if (!R.length) return [];
    const last = R[R.length - 1], pool = R.length > 1 ? R.slice(0, -1) : [];
    const out = [];
    if (pool.length) {
      const big = pool.find((r) => r.crit) || pool.reduce((a, r) => (r.total > a.total ? r : a), pool[0]);
      out.push({ r: big, kicker: 'Roll ' + big.n + ' · ' + big.stat, title: big.crit ? 'A natural 20' : 'The highest roll' });
      const rest = pool.filter((r) => r !== big);
      if (rest.length) {
        const near = rest.reduce((a, r) => { const d = Math.abs(r.gap), e = Math.abs(a.gap); return d < e || (d === e && r.gap < a.gap) ? r : a; }, rest[0]);
        out.push({ r: near, kicker: 'Roll ' + near.n + ' · ' + near.stat, title: near.gap < 0 ? 'Missed by ' + -near.gap : near.gap === 0 ? 'Made it exactly' : 'Made it by ' + near.gap });
      }
    }
    const end = session.live ? 'The latest roll' : session.unfinished ? 'The week ended here' : 'The last roll';
    out.push({ r: last, kicker: (session.loss ? session.result + ' · ' : '') + 'Roll ' + last.n + ' · ' + last.stat, title: end });
    return out;
  }
  const facts = (r) => {
    const f = ['Kept ' + r.kept + ' + ' + r.mod + ' = ' + r.total + ' vs ' + r.dc + ' · ' + M().TIER[r.tier] + (r.fumble ? ' · Natural 1' : r.crit ? ' · Natural 20' : '')];
    if (r.action) f.push(r.action);
    f.push('In ' + (r.room || 'the room you began in') + (r.harm ? ' · took ' + r.harm + ' harm' : ''));
    return f;
  };

  const DelveThree = (props) => {
    const { session } = props; const D = M();
    const m = D.useModel(session); const out = Ss.useOutcome('delve', session);
    const picks = pick(m, session);
    const marks = picks.map((p) => p.r.n);
    const hero = h('section', { className: 'ss-hero dv3-hero', 'aria-label': 'Three moments' },
      picks.length ? h('div', { className: 'dv3-moments' }, picks.map((p, i) => h(Ss.Card, { key: i, className: 'dv3-card', kicker: p.kicker, title: p.title, facts: facts(p.r) })))
        : h('p', { className: 'ss-say' }, 'No rolls yet.'),
      m.rolls.length ? h(Ss.Card, { className: 'dv3-run', kicker: 'The whole run' },
        h(Ss.Cells, { className: 'dv-mini', rows: [m.rolls.map((r) => D.cell(r, { nums: false, marks }))], label: m.rolls.length + ' rolls; the moments above are rolls ' + marks.join(', ') })) : null);
    return h(D.Frame, Object.assign({}, props, { m, out, hero }));
  };

  pgOption('delve', 3, {
    name: 'The moments',
    stance: 'Players retell three things, the big roll, the near thing and the end, so the page picks those by a fixed rule and sets them large, with the whole run as a small strip beneath.',
    cost: 'Needs the engine to send each roll (stat, kept die, total, target, tier, the room it was in) as data, and the action it was made for; today they arrive only as line text, which the seed is parsed from. The pick rule is mine to name and the owner to rule on.',
    Component: DelveThree,
    shareText: (session) => window.SsOutcome.delve(session).lines,
    css: M().baseCss + `
      :scope .dv3-hero { display: grid; gap: 12px; }
      :scope .dv3-moments { display: grid; gap: 12px; }
      :scope .dv3-card { gap: 8px; }
      :scope .dv3-card .ss-card-title { font: var(--type-section-title); letter-spacing: var(--tracking-heading); }
      :scope .dv3-card .ss-card-facts { font: var(--type-caption); color: var(--muted); }
      :scope .dv3-card .ss-card-facts li { color: var(--muted); }
      :scope .dv3-run { gap: 12px; }
      @container ss (min-width: 680px) { :scope .dv3-moments { grid-template-columns: repeat(3, minmax(0, 1fr)); } :scope .dv3-moments:has(> :nth-child(2):last-child) { grid-template-columns: repeat(2, minmax(0, 1fr)); } :scope .dv3-moments:has(> :only-child) { grid-template-columns: minmax(0, 1fr); } }
    `,
  });
})();
