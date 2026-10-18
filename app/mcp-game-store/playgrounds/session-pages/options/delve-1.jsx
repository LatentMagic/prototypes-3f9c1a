// Session page, Delve, option 1: "The dice". Every risky move is a d20 the game rolled, so the hero is the whole run as a strip of square cells, one per roll.
// The Delve model (rolls, rooms, the roll cell, canon's side cards, the shared CSS) lives in delve-model.jsx (window.DvModel).
(function () {
  const h = React.createElement;
  const { useModel, cell, rollWord, Frame, baseCss } = window.DvModel;

  // ---- Option 1 ----
  const DelveOne = (props) => {
    const { session } = props;
    const m = useModel(session); const out = Ss.useOutcome('delve', session);
    const cells = m.rolls.map((r) => cell(r));
    const n = m.rolls.length, per = n > 12 ? 8 : 6, crit = m.rolls.filter((r) => r.crit), fum = m.rolls.filter((r) => r.fumble);
    const hero = h('section', { className: 'ss-hero ss-surface dv1-hero', 'aria-label': 'Every roll' },
      h('div', { className: 'dv-head' }, h('span', { className: 'ss-kicker' }, 'Every roll, in order'), h('span', { className: 'ss-caption' }, n + (n === 1 ? ' roll' : ' rolls') + (session.live ? ' so far' : ''))),
      n ? h(Ss.Cells, { className: 'dv-cells', size: 'lg', cols: Math.min(per, n), rows: cells.reduce((a, c, i) => { if (i % per === 0) a.push([]); a[a.length - 1].push(c); return a; }, []), label: n + ' rolls in order: ' + m.rolls.map(rollWord).join('; ') }) : h('p', { className: 'ss-say' }, 'No rolls yet.'),
      h('ul', { className: 'dv-notes' },
        m.streak ? h('li', { key: 's' }, h('span', { className: 'dv-swatch' }), 'Streak ' + m.streak.len + ', rolls ' + m.streak.from + ' to ' + m.streak.to) : null,
        crit.map((r) => h('li', { key: 'c' + r.n }, 'Natural 20 at roll ' + r.n)),
        fum.map((r) => h('li', { key: 'f' + r.n }, 'Natural 1 at roll ' + r.n))),
      h('p', { className: 'ss-legend dv-legend' }, h('span', null, h('i', { className: 'dv-lg is-hit' }), 'Strong hit'), h('span', null, h('i', { className: 'dv-lg is-weak' }), 'Weak hit'), h('span', null, h('i', { className: 'dv-lg' }), 'Miss')));
    return h(Frame, Object.assign({}, props, { m, out, hero }));
  };

  pgOption('delve', 1, {
    name: 'The dice',
    stance: 'Every risky move is a d20 the game rolled where nobody could fudge it, so the run is one strip of square cells, a cell per roll with the kept die in it, and only the natural 20 and the natural 1 are marked.',
    cost: 'Needs the engine to send each roll (stat, kept die, total, target, tier) as data, and the hero and setting of a run in progress; today the rolls arrive only as line text, which the seed is parsed from, and a live run says Hero not sent.',
    Component: DelveOne,
    shareText: (session) => window.SsOutcome.delve(session).lines,
    css: baseCss + `
      :scope .dv1-hero { gap: 16px; }
      :scope .dv1-hero .dv-cells.ss-cells { --c: min(64px, calc((100cqi - (var(--cols) - 1) * 6px) / var(--cols))); }
      :scope .dv1-hero .dv-cells .ss-cells-row { grid-template-columns: repeat(var(--cols), var(--c)); }
      :scope .dv1-hero .dv-cells .ss-cell { font-size: calc(var(--c) * .4); }
    `,
  });
})();
