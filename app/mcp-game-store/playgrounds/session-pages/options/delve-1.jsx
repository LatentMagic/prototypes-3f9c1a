// Session page, Delve, option 1: "The dice". Every risky move is a d20 the game rolled, so the hero is the whole run as a strip of square cells, one per roll.
// This file also holds the Delve model that options 2 and 3 reuse (window.DvModel): parsing the run's lines into rolls and rooms, the roll cell, the
// side cards (canon's tracks and endings, mounted) and the CSS the three options share. Options load in order 1, 2, 3, so 2 and 3 find it.
(function () {
  const h = React.createElement;

  // ---- The model: everything below is read from the session record (canon's seed: lines, figures, tracks, endings, shareLines). ----
  // A roll line is [stat, "d20 15 + 3 = 18 vs 12" (or "d20s 15 and 18, kept 18 + 3 = 21 vs 12"), "Hit" | "Weak hit, HP 9/13" | "Action: natural 20"].
  // Tier is read from the line's words; the share tape (when the record has one) is the cross-check. Structured per-roll data is in the engine's log but the
  // record passes it only as text (grounding delve.md section 5), so the cost line of each option says "needs the engine to send the rolls".
  const num = (x) => (x == null ? null : Number(x));
  function parseRoll(l, n) {
    const t = (l[2] || '') + '';
    const m = /(?:kept|d20)\s+(\d+)\s*\+\s*(-?\d+)\s*=\s*(-?\d+)\s+vs\s+(\d+)/.exec(l[1] || '');
    if (!m) return null;
    const crit = /natural 20/i.test(t), fumble = /natural 1\b/i.test(t);
    const tier = fumble ? 'miss' : /weak hit/i.test(t) ? 'weak' : /\bmiss\b/i.test(t) ? 'miss' : /hit/i.test(t) || crit ? 'strong' : 'miss';
    const hp = /HP\s+(\d+)\/(\d+)/.exec(t);
    const colon = t.indexOf(':');
    return { n, stat: l[0], kept: num(crit ? 20 : fumble ? 1 : m[1]), mod: num(m[2]), total: num(m[3]), dc: num(m[4]), tier, crit, fumble,
      two: /d20s/.test(l[1]), hp: hp ? num(hp[1]) : null, hpMax: hp ? num(hp[2]) : null, action: colon > 0 ? t.slice(0, colon) : '' };
  }
  const note = (l) => {
    if (l[0] === 'Gear') return l.slice(1).join(' · ');
    if (l[0] === 'Lock') return l[1];
    if (l[0] === 'Turn') return l[2] || 'A turn in the run';
    if (l[0] === 'Oracle') return 'Asked the oracle: ' + String(l[l.length - 1]).toLowerCase();
    if (l[0] === 'Bargain') return l.slice(1).join(' · ');
    return l.slice(1).join(' · ');
  };
  // The setting and the hero come from the share lines; a record in progress carries neither, so they are read from the same run's finished records (S: needs the engine to send them).
  const FALLBACK = () => {
    const S = window.GS_SESSIONS || {};
    return { setting: S.delve && S.delve.shareLines ? S.delve.shareLines[0] : 'Delve', hero: S['delve-lost'] && S['delve-lost'].shareLines ? S['delve-lost'].shareLines[1].split(' · ')[0] : null };
  };
  // Seed supplement: whether the climax foe fell to its weakness is on the engine's finished event (byWeakness) but not on the record. The won seed is given true, here only.
  const BY_WEAKNESS = (s) => s.result === 'Elsie rescued' && !s.live && !s.loss;

  function build(s) {
    const lines = s.lines || [];
    const figHp = (s.figures || []).map((f) => /HP\s+(\d+)\/(\d+)/.exec(f)).filter(Boolean)[0];
    const hpMax = figHp ? num(figHp[2]) : (lines.map((l) => /HP\s+\d+\/(\d+)/.exec((l[2] || '') + '')).filter(Boolean)[0] || [0, 0])[1] * 1;
    const chapters = [], rolls = []; let cur = null, prevHp = hpMax, streak = 0, best = { len: 0, from: 0, to: 0 }, run = 0;
    const open = (name, kind, extra) => { cur = { name, kind, rolls: [], notes: [], extra: extra || '' }; chapters.push(cur); return cur; };
    lines.forEach((l) => {
      if (l[0] === 'Room') {
        const p = String(l[1]); const back = /^Doubled back to /.test(p);
        open(p.replace(/^(Entered|Doubled back to) /, ''), back ? 'back' : 'enter', l[2] || ''); return;
      }
      const r = (/^d20/.test(l[1] || '')) ? parseRoll(l, rolls.length + 1) : null;
      if (!cur) open(null, 'start');
      if (!r) { cur.notes.push(note(l)); return; }
      r.room = cur.name; r.gap = r.total - r.dc;
      if (r.hp != null) { r.harm = Math.max(0, prevHp - r.hp); prevHp = r.hp; } else r.harm = 0;
      r.hpNow = prevHp;
      if (r.tier === 'strong') { run += 1; if (run > best.len) best = { len: run, from: r.n - run + 1, to: r.n }; } else run = 0;
      r.inRun = false; rolls.push(r); cur.rolls.push(r);
    });
    rolls.forEach((r) => { if (best.len >= 2 && r.n >= best.from && r.n <= best.to) r.inRun = true; });
    const fb = FALLBACK(); const out = window.SsOutcome.delve(s);
    const setting = out.label && out.label !== 'Delve' ? out.label : fb.setting;
    const heroName = out.hero ? String(out.hero) : fb.hero;
    const tr = s.tracks || {};
    return { rolls, chapters, hpMax, hp: figHp ? num(figHp[1]) : prevHp, streak: best.len >= 2 ? best : null, setting, hero: heroName,
      rooms: tr.rooms || 0, reached: tr.progress || 0, threat: tr.threat || 0, threatMax: tr.threatMax || 0, byWeakness: BY_WEAKNESS(s),
      nat20: rolls.filter((r) => r.crit).length, nat1: rolls.filter((r) => r.fumble).length };
  }
  const useModel = (s) => React.useMemo(() => build(s), [s]);

  const TIER = { strong: 'Strong hit', weak: 'Weak hit', miss: 'Miss' };
  const KIND = { strong: 'hit', weak: 'near', miss: 'miss' };
  const STAT3 = (st) => String(st).slice(0, 3);
  // One roll as a square cell. t: the kept die (or nothing, for a small strip). sub: the stat's three letters (shown only where the cell is large).
  const cell = (r, o) => ({ k: KIND[r.tier], t: h('span', { className: 'dv-d' + (r.crit ? ' is-crit' : r.fumble ? ' is-fumble' : '') + (r.inRun ? ' is-streak' : '') + (o && o.marks && o.marks.indexOf(r.n) > -1 ? ' is-pick' : '') }, o && o.nums === false ? '' : r.kept),
    sub: o && o.sub ? STAT3(r.stat) : null });
  const rollWord = (r) => 'Roll ' + r.n + ' ' + r.stat + ', kept ' + r.kept + ', ' + TIER[r.tier].toLowerCase() + (r.crit ? ', natural 20' : r.fumble ? ', natural 1' : '');

  // Canon's own tracks and endings, mounted: GsTrack for the bars, a DS.Card each; the endings list is the markup of canon's session page (gs-plain / gs-reached).
  const Side = ({ s, m }) => {
    const DS = window.DS;
    return h(React.Fragment, null,
      h(DS.Card, { className: 'dv-sidecard', style: { gap: 16, justifyItems: 'stretch' } },
        h('span', { className: 'gs-label' }, s.live ? 'THE TRACKS SO FAR' : 'THE TRACKS AS THEY ENDED'),
        h(window.GsTrack, { label: 'Rooms reached', value: m.reached, max: m.rooms || 6 }),
        h(window.GsTrack, { label: 'Threat', value: m.threat, max: m.threatMax || 6, threat: true })),
      h(DS.Card, { className: 'dv-sidecard', style: { gap: 12, justifyItems: 'stretch' } },
        h('h2', { className: 'mcp-t-card' }, 'Endings'),
        h('ul', { className: 'gs-plain' }, (s.endings || []).map((e) => h('li', { key: e, className: e === s.reached ? 'gs-reached' : 'gs-muted' },
          e === s.reached ? h(DS.Icon, { name: 'check' }) : null, e, e === s.reached ? h(DS.Tag, { kind: 'daily' }, 'This session') : null)))));
  };

  // The page every Delve option shares: head, the option's hero, the action card with canon's side cards, the Record.
  const Frame = ({ gid, session, sid, share, api, m, out, hero }) => {
    const status = session.unfinished ? 'ended' : session.live ? 'live' : 'done';
    const n = m.rolls.length;
    const stats = [{ label: 'Rolls', value: String(n) }, { label: 'HP', value: m.hp + '/' + m.hpMax }].concat(m.nat20 ? [{ label: 'Natural 20s', value: String(m.nat20) }] : []);
    const say = m.reached + ' of ' + m.rooms + ' rooms reached, threat ' + m.threat + ' of ' + m.threatMax + '.';
    return h(Ss.Page, { gid },
      h(Ss.Head, { gid, art: 'delve', label: 'Delve · ' + m.setting, date: session.date, h1: out.h1, mark: out.mark, stats, sub: m.hero }),
      h('div', { className: 'ss-body' }, hero,
        h('aside', { className: 'ss-side' }, h(Ss.ShareCard, { status, say, lines: share.lines, gid, session, sid, api }), h(Side, { s: session, m }))),
      h(Ss.Record, { title: session.listTitle, lines: session.lines }));
  };

  // ---- CSS the three options share. Cell tiers: strong solid green; weak a low amber bar; miss an outline. A natural 20 has an inner ring, a natural 1 a strike. ----
  const baseCss = `
    :scope .ss-hero { container: dv / inline-size; }
    :scope .dv-cells.ss-cells { --per: 8; --c: min(52px, calc((100cqi - (var(--per) - 1) * 6px) / var(--per))); }
    @container dv (min-width: 480px) { :scope .dv-cells.ss-cells { --per: 12; } }
    :scope .dv-cells .ss-cells-row { grid-template-columns: repeat(var(--per), var(--c)); }
    :scope .dv-mini.ss-cells { --c: 20px; display: block; max-width: 100%; }
    :scope .dv-mini .ss-cells-row { display: flex; flex-wrap: wrap; gap: 4px; }
    :scope .dv-cells .ss-cell, :scope .dv-mini .ss-cell { font-size: calc(var(--c) * .42); }
    :scope .dv-cells .ss-cell[data-k="miss"], :scope .dv-mini .ss-cell[data-k="miss"] { border-color: var(--muted); color: var(--text); }
    :scope .ss-cell[data-k="near"] { background: linear-gradient(to top, var(--cover-amber) 0 30%, var(--ss-cell) 30% 100%); border-color: var(--cover-amber); color: var(--text); padding-bottom: 22%; }
    :scope .dv-mini .ss-cell[data-k="near"] { background: linear-gradient(to top, var(--cover-amber) 0 50%, var(--ss-cell) 50% 100%); padding: 0; }
    :scope .ss-cell:has(> .is-crit) { box-shadow: inset 0 0 0 2.5px var(--page); }
    :scope .ss-cell:has(> .is-fumble) { background-image: linear-gradient(to top right, transparent calc(50% - .9px), var(--text) calc(50% - .9px) calc(50% + .9px), transparent calc(50% + .9px)); }
    :scope .ss-cell:has(> .is-streak)::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 4px; background: var(--off-white); }
    :scope .ss-cell:has(> .is-pick) { outline: 2px solid var(--text); outline-offset: 2px; z-index: 1; }
    :scope .dv-cells .ss-cell-sub { display: none; }
    @container dv (min-width: 560px) {
      :scope .dv-cells .ss-cell-sub { display: block; }
      :scope .dv-cells .ss-cell[data-k="hit"], :scope .dv-cells .ss-cell[data-k="miss"] { padding-bottom: 16%; }
      :scope .dv-cells .ss-cell[data-k="near"] { padding-bottom: 24%; }
    }
    :scope .dv-cells .ss-cell[data-k="near"] .ss-cell-sub { color: var(--warning-on); }
    :scope .dv-sidecard { background: var(--ss-card); border: 1px solid var(--ss-line); box-shadow: var(--shadow-card); }
    :scope .gs-track { grid-template-columns: none; grid-auto-flow: column; grid-auto-columns: 1fr; }
    :scope .dv-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
    :scope .dv-notes { margin: 0; padding: 0; list-style: none; display: grid; gap: 6px; font: var(--type-caption); color: var(--muted); }
    :scope .dv-notes li { display: flex; align-items: center; gap: 8px; }
    :scope .dv-swatch { flex: none; width: 20px; height: 4px; background: var(--off-white); }
    :scope .dv-legend { display: flex; flex-wrap: wrap; gap: 6px 16px; align-items: center; margin: 0; }
    :scope .dv-legend > span { display: inline-flex; align-items: center; gap: 6px; }
    @container ss (min-width: 640px) { :scope .ss-head > .ss-caption { grid-column: 2 !important; } }
    :scope .dv-lg { display: inline-block; width: 12px; height: 12px; flex: none; border: 1px solid var(--muted); box-sizing: border-box; }
    :scope .dv-lg.is-hit { background: var(--cover-green); border-color: var(--cover-green); }
    :scope .dv-lg.is-weak { background: linear-gradient(to top, var(--cover-amber) 0 35%, transparent 35%); border-color: var(--cover-amber); }
  `;

  window.DvModel = { build, useModel, cell, rollWord, Side, Frame, baseCss, TIER, STAT3, KIND };

  // ---- Option 1 ----
  const DelveOne = (props) => {
    const { session } = props;
    const m = useModel(session); const out = Ss.useOutcome('delve', session);
    const cells = m.rolls.map((r) => cell(r, { sub: true }));
    const n = m.rolls.length, crit = m.rolls.filter((r) => r.crit), fum = m.rolls.filter((r) => r.fumble);
    const hero = h('section', { className: 'ss-hero ss-surface dv1-hero', 'aria-label': 'Every roll' },
      h('div', { className: 'dv-head' }, h('span', { className: 'ss-kicker' }, 'Every roll, in order'), h('span', { className: 'ss-caption' }, n + (n === 1 ? ' roll' : ' rolls') + (session.live ? ' so far' : ''))),
      n ? h(Ss.Cells, { className: 'dv-cells', rows: [cells], label: n + ' rolls in order: ' + m.rolls.map(rollWord).join('; ') }) : h('p', { className: 'ss-say' }, 'No rolls yet.'),
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
    cost: 'Needs the engine to send each roll (stat, kept die, total, target, tier) as data; today they arrive only as line text, which the seed is parsed from. The stat letters appear on wide screens only.',
    Component: DelveOne,
    shareText: (session) => window.SsOutcome.delve(session).lines,
    css: baseCss + `
      :scope .dv1-hero { gap: 16px; }
    `,
  });
})();
