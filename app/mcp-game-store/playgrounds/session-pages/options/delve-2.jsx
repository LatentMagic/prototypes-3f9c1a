// Session page, Delve, option 2: "Room by room". The run told as a walk through a small map: one chapter per room, ending at the climax.
// Reuses window.DvModel from delve-model.jsx (the run parsed into rolls and rooms, the roll cell, canon's tracks and endings cards, the shared CSS).
(function () {
  const h = React.createElement;
  const M = () => window.DvModel;
  const plural = (n, w) => n + ' ' + w + (n === 1 ? '' : 's');

  const Chapter = ({ c, no, last, session, m }) => {
    const { cell } = M();
    const rolls = c.rolls, misses = rolls.filter((r) => r.tier === 'miss').length, harm = rolls.reduce((a, r) => a + r.harm, 0);
    const sum = [rolls.length ? plural(rolls.length, 'roll') : 'No rolls'];
    if (rolls.length) sum.push(misses ? plural(misses, 'miss').replace('misss', 'misses') : 'no misses');
    if (harm) sum.push('took ' + harm + ' harm');
    const ended = last && session.loss;
    if (ended) sum.push(session.result);
    const facts = (c.extra ? [c.extra] : []).concat(c.notes).slice(0, 3);
    const title = c.kind === 'back' ? 'Back in ' + c.name : c.name || 'Where you began';
    const climax = last && !session.live && !session.loss && m.byWeakness;
    return h(Ss.Card, { className: 'dv2-card' + (last ? ' is-last' : ''), kicker: c.kind === 'back' ? 'Doubled back' : 'Room ' + no, title, tag: last && session.live ? { text: 'You are here' } : null },
      h('div', { className: 'dv2-sum' },
        h('p', { className: 'dv2-line' }, sum.join(' · ')),
        rolls.length ? h(Ss.Cells, { className: 'dv-mini', rows: [rolls.map((r) => cell(r, { nums: false }))], label: rolls.map(M().rollWord).join('; ') }) : null),
      facts.length ? h('ul', { className: 'ss-card-facts' }, facts.map((f, i) => h('li', { key: i }, f))) : null,
      climax ? h('p', { className: 'dv2-climax' }, 'The foe fell to its weakness') : null);
  };

  const DelveTwo = (props) => {
    const { session } = props; const D = M();
    const m = D.useModel(session); const out = Ss.useOutcome('delve', session);
    let no = 0;
    const cards = m.chapters.map((c, i) => { if (c.kind !== 'back') no += 1; return h(Chapter, { key: i, c, no, last: i === m.chapters.length - 1, session, m }); });
    const unreached = Math.max(0, m.rooms - m.reached);
    const hero = h('section', { className: 'ss-hero dv2-hero', 'aria-label': 'The run, room by room' },
      cards.length ? cards : h('p', { className: 'ss-say' }, 'No rooms yet.'),
      unreached ? h('p', { className: 'ss-caption' }, plural(unreached, 'room') + ' not reached.') : null);
    return h(D.Frame, Object.assign({}, props, { m, out, hero }));
  };

  pgOption('delve', 2, {
    name: 'Room by room',
    stance: 'A run is a walk through a small map, so it is told as chapters, one card per room in the order you met them, each with its own little strip of dice and what you took, and the climax last.',
    cost: 'Needs the engine to send moved (room, first or doubled back), taken and the rolls between them as data, and finished.byWeakness; today rooms and gear arrive as line text, and the record does not carry byWeakness, so the won seed is given it here to show the climax line. The room you began in is not named on the record.',
    Component: DelveTwo,
    shareText: (session) => window.SsOutcome.delve(session).lines,
    css: M().baseCss + `
      :scope .dv2-hero { display: grid; gap: 12px; }
      :scope .dv2-card { gap: 10px; }
      :scope .dv2-card.is-last { border-color: var(--cover-amber); }
      :scope .dv2-sum { display: grid; gap: 10px; align-content: start; }
      :scope .dv2-line { margin: 0; font: var(--type-body); color: var(--muted); }
      :scope .dv2-climax { margin: 4px 0 0; font: var(--type-card-title); letter-spacing: var(--tracking-heading); }
      @container ss (min-width: 680px) {
        :scope .dv2-sum { grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 16px; }
        :scope .dv2-sum .dv-mini { justify-self: end; max-width: 280px; }
      }
    `,
  });
})();
