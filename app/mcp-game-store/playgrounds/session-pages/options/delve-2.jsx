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

  // IA pass: the run as one path of room nodes. A node is its number, the room's name, a mini strip of its dice and a harm notch; a tap opens what was taken there.
  // The doubled-back node says so with an arrow; the last node is the climax (a fell-to-its-weakness mark when won, the fumble mark on the roll that ended a lost run).
  const Node = ({ c, no, last, session, m }) => {
    const { cell } = M(); const rolls = c.rolls;
    const harm = rolls.reduce((a, r) => a + r.harm, 0), fell = last && session.loss, won = last && !session.live && !session.loss && m.byWeakness;
    const facts = (c.extra ? [c.extra] : []).concat(c.notes).slice(0, 4);
    const title = c.name || 'Where you began';
    const head = h('div', { className: 'dv2-nodehead' },
      h('span', { className: 'dv2-pin' + (last ? ' is-last' : '') + (fell ? ' is-fell' : '') }, c.kind === 'back' ? '\u21A9' : no),
      h('span', { className: 'dv2-name' }, title),
      harm ? h('span', { className: 'dv2-harm', 'aria-label': 'took ' + harm + ' harm' }, '\u2212' + harm) : null,
      won ? h('span', { className: 'dv2-flag' }, 'Foe fell') : null,
      fell ? h('span', { className: 'dv2-flag is-bad' }, 'Run ended') : null);
    const strip = rolls.length ? h(Ss.Cells, { className: 'dv-mini', rows: [rolls.map((r) => cell(r, { nums: false }))], label: rolls.map(M().rollWord).join('; ') }) : null;
    return h('li', { className: 'dv2-node' + (last ? ' is-last' : '') },
      facts.length ? h('details', { className: 'dv2-det' }, h('summary', null, head, strip), h('ul', { className: 'dv2-facts' }, facts.map((f, i) => h('li', { key: i }, f))))
        : h('div', { className: 'dv2-det' }, h('div', { className: 'dv2-sum2' }, head, strip)));
  };

  const DelveTwo = (props) => {
    const { session, layout } = props; const D = M();
    const m = D.useModel(session); const out = Ss.useOutcome('delve', session);
    let no = 0;
    const cards = m.chapters.map((c, i) => { if (c.kind !== 'back') no += 1; return h(Chapter, { key: i, c, no, last: i === m.chapters.length - 1, session, m }); });
    const unreached = Math.max(0, m.rooms - m.reached);
    let n2 = 0;
    const hero = layout === 'ia' ? h('section', { className: 'ss-hero ss-surface dv2-hero dv2-path', 'aria-label': 'The run, room by room' },
      h('ol', { className: 'dv2-pathlist' }, m.chapters.length ? m.chapters.map((c, i) => { if (c.kind !== 'back') n2 += 1; return h(Node, { key: i, c, no: n2, last: i === m.chapters.length - 1, session, m }); }) : h('li', { className: 'ss-say' }, 'No rooms yet.')),
      h(D.Bars, { s: session, m })) : h('section', { className: 'ss-hero dv2-hero', 'aria-label': 'The run, room by room' },
      cards.length ? cards : h('p', { className: 'ss-say' }, 'No rooms yet.'),
      unreached ? h('p', { className: 'ss-caption' }, plural(unreached, 'room') + ' not reached.') : null);
    return h(D.Frame, Object.assign({}, props, { m, out, hero }));
  };

  pgOption('delve', 2, {
    name: 'Room by room',
    stance: 'A run is a walk through a small map, so it is told as chapters, one card per room in the order you met them, each with its own little strip of dice and what you took, and the climax last.',
    cost: 'IA pass: the stacked cards become one path of room nodes (number, name, mini strip, harm notch; a tap opens the gear and notes), the foe-fell and run-ended marks on the last node, and threat and rooms reached as two short bars; no Between or Game stop (the hand-inked map is not built). Needs the engine to send moved (room, first or doubled back), taken and the rolls between them as data, and finished.byWeakness; today rooms and gear arrive as line text, and the record does not carry byWeakness, so the won seed is given it here to show the climax line. The room you began in is not named on the record.',
    layouts: ['built', 'ia'],
    Component: DelveTwo,
    shareText: (session) => window.SsOutcome.delve(session).lines,
    css: M().baseCss + `
      :scope .dv2-hero { display: grid; gap: 12px; }
      :scope .dv2-card { gap: 10px; }
      :scope .dv2-card.is-last { border-color: var(--cover-amber); }
      :scope .dv2-sum { display: grid; gap: 10px; align-content: start; }
      :scope .dv2-line { margin: 0; font: var(--type-body); color: var(--muted); }
      :scope .dv2-climax { margin: 4px 0 0; font: var(--type-card-title); letter-spacing: var(--tracking-heading); }
      :scope .dv2-path { gap: 16px; }
      :scope .dv2-pathlist { list-style: none; margin: 0; padding: 0; display: grid; gap: 0; }
      :scope .dv2-node { position: relative; padding: 0 0 12px 36px; }
      :scope .dv2-node::before { content: ''; position: absolute; left: 13px; top: 28px; bottom: 0; width: 2px; background: var(--ss-line); }
      :scope .dv2-node:last-child { padding-bottom: 0; }
      :scope .dv2-node:last-child::before { display: none; }
      :scope .dv2-det > summary { list-style: none; cursor: pointer; display: grid; gap: 8px; }
      :scope .dv2-det > summary::-webkit-details-marker { display: none; }
      :scope .dv2-nodehead { display: flex; align-items: center; gap: 10px; min-width: 0; margin-left: -36px; }
      :scope .dv2-pin { flex: none; width: 28px; height: 28px; box-sizing: border-box; display: grid; place-items: center; border: 2px solid var(--off-white); border-radius: 50%; font: 600 13px/1 var(--font-text); color: var(--text); background: var(--ss-card); position: relative; z-index: 1; }
      :scope .dv2-pin.is-last { border-color: var(--cover-amber); }
      :scope .dv2-pin.is-fell { border-color: var(--error); }
      :scope .dv2-name { font: var(--type-card-title); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      :scope .dv2-harm { font: 600 13px/1 var(--font-text); color: var(--error); }
      :scope .dv2-flag { margin-left: auto; font: var(--type-small); color: var(--cover-amber); white-space: nowrap; }
      :scope .dv2-flag.is-bad { color: var(--error); }
      :scope .dv2-sum2 { display: grid; gap: 8px; }
      :scope .dv2-facts { margin: 8px 0 0; padding: 0; list-style: none; display: grid; gap: 4px; font: var(--type-caption); color: var(--muted); }
      @container ss (min-width: 680px) {
        :scope .dv2-pathlist { grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); gap: 16px; }
        :scope .dv2-node { padding: 28px 0 0; }
        :scope .dv2-node::before { left: 0; right: -16px; top: 13px; bottom: auto; width: auto; height: 2px; }
        :scope .dv2-nodehead { margin-left: 0; position: absolute; top: 0; left: 0; right: 0; }
        :scope .dv2-det > summary, :scope .dv2-sum2 { padding-top: 0; }
        :scope .dv2-sum2 .dv-mini, :scope .dv2-det > summary .dv-mini { margin-top: 36px; }
        :scope .dv2-sum { grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 16px; }
        :scope .dv2-sum .dv-mini { justify-self: end; max-width: 280px; }
      }
    `,
  });
})();
