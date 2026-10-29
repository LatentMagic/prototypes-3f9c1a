// Session page, Delve, option 1: "The dice". Every risky move is a d20 the game rolled, so the hero is the whole run as a strip of square cells, one per roll.
// The Delve model (rolls, rooms, the roll cell, canon's side cards, the shared CSS) lives in delve-model.jsx (window.DvModel).
(function () {
  const h = React.createElement;
  const { useModel, cell, rollWord, Frame, Bars, Steps, Stair, endOf, baseCss } = window.DvModel;

  // ---- Option 1 ----
  const DelveOne = (props) => {
    const { session, element, layout } = props; const ia = layout === 'ia', D = window.DvModel;
    const m = useModel(session); const out = Ss.useOutcome('delve', session);
    const cells = m.rolls.map((r) => cell(r));
    const n = m.rolls.length, per = n > 12 ? 8 : 6, crit = m.rolls.filter((r) => r.crit), fum = m.rolls.filter((r) => r.fumble);
    const label = n + ' rolls in order: ' + m.rolls.map(rollWord).join('; ');
    const rows = cells.reduce((a, c, i) => { if (i % per === 0) a.push([]); a[a.length - 1].push(c); return a; }, []);
    const picture = !n ? h('p', { className: 'ss-say' }, 'No rolls yet.')
      : element === 'game' ? h('div', { className: 'dv-slot' }, h(Stair, { rolls: m.rolls, end: endOf(session), label }))
      : element === 'between' ? h(Steps, { rolls: m.rolls, size: 'md', label })
      : h(Ss.Cells, { className: 'dv-cells', size: 'lg', cols: Math.min(per, n), rows, label });
    const hero = h('section', { className: 'ss-hero ss-surface dv1-hero', 'aria-label': 'Every roll' },
      h('div', { className: 'dv-head' }, h('span', { className: 'ss-kicker' }, 'Every roll, in order'), h('span', { className: 'ss-caption' }, n + (n === 1 ? ' roll' : ' rolls') + (session.live ? ' so far' : ''))),
      picture,
      ia ? h(Bars, { s: session, m }) : h('ul', { className: 'dv-notes' },
        m.streak ? h('li', { key: 's' }, h('span', { className: 'dv-swatch' }), 'Streak ' + m.streak.len + ', rolls ' + m.streak.from + ' to ' + m.streak.to) : null,
        crit.map((r) => h('li', { key: 'c' + r.n }, 'Natural 20 at roll ' + r.n)),
        fum.map((r) => h('li', { key: 'f' + r.n }, 'Natural 1 at roll ' + r.n))),
      !ia && element === 'store' ? h('p', { className: 'ss-legend dv-legend' }, h('span', null, h('i', { className: 'dv-lg is-hit' }), 'Strong hit'), h('span', null, h('i', { className: 'dv-lg is-weak' }), 'Weak hit'), h('span', null, h('i', { className: 'dv-lg' }), 'Miss')) : null);
    return h(Frame, Object.assign({}, props, { m, out, hero }));
  };

  pgOption('delve', 1, {
    name: 'The dice',
    stance: 'Every risky move is a d20 the game rolled where nobody could fudge it, so the run is one strip of square cells, a cell per roll with the kept die in it, and only the natural 20 and the natural 1 are marked.',
    cost: 'Between: the cells as the cover\'s amber steps, tier by height. Game: the dice on the cover\'s descending stair, a wider landing per room entered, the arch lit when won and dark when it fell, drawn flat on the cover ground (cover-class art, open under the texture ruling); the dropped die of an advantage roll is parsed from line text. IA pass: the notes and key go, threat and rooms reached become two short bars under the picture, canon\'s tracks and endings cards leave the side column. Needs the engine to send to send each roll (stat, kept die, total, target, tier) as data, and the hero and setting of a run in progress; today the rolls arrive only as line text, which the seed is parsed from, and a live run says Hero not sent.',
    elements: ['store', 'between', 'game'],
    layouts: ['built', 'ia'],
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
