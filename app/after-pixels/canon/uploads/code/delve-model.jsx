// Delve model, shared by options 1 to 3 (window.DvModel): parsing the run's lines into rolls and rooms, the roll cell, the side cards
// (canon's tracks and endings, mounted), the page frame and the CSS the three options share. Loaded before the options (PG_MODELS).
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
    const dd = /d20s\s+(\d+)\s+and\s+(\d+)/.exec(l[1] || '');
    const colon = t.indexOf(':');
    return { n, stat: l[0], kept: num(crit ? 20 : fumble ? 1 : m[1]), mod: num(m[2]), total: num(m[3]), dc: num(m[4]), tier, crit, fumble,
      two: /d20s/.test(l[1]), dropped: dd ? num(Math.min(dd[1], dd[2])) : null, hp: hp ? num(hp[1]) : null, hpMax: hp ? num(hp[2]) : null, action: colon > 0 ? t.slice(0, colon) : '' };
  }
  const note = (l) => {
    if (l[0] === 'Gear') return l.slice(1).join(' · ');
    if (l[0] === 'Lock') return l[1];
    if (l[0] === 'Turn') return l[2] || 'A turn in the run';
    if (l[0] === 'Oracle') return 'Asked the oracle: ' + String(l[l.length - 1]).toLowerCase();
    if (l[0] === 'Bargain') return l.slice(1).join(' · ');
    return l.slice(1).join(' · ');
  };
  // The setting and the hero come from the record's share lines. A run in progress carries neither. The setting is then read from another record of the
  // same week only (same date), the hero is never borrowed: it stays null and the page says "Hero not sent" (S: needs the engine to send both).
  const FALLBACK = (s) => {
    const S = window.GS_SESSIONS || {}; const sib = Object.keys(S).map((k) => S[k]).find((x) => x && x.gid === 'delve' && x !== s && x.date === s.date && x.shareLines && x.shareLines[0]);
    return { setting: sib ? sib.shareLines[0] : 'Delve', hero: null };
  };
  // Seed supplement: whether the climax foe fell to its weakness is on the engine's finished event (byWeakness) but not on the record. The record's own
  // flag wins; else only canon's seeded won record is given true, here only (S: needs the engine to send finished.byWeakness).
  const BY_WEAKNESS = (s) => (s.byWeakness != null ? !!s.byWeakness : !!(window.GS_SESSIONS && window.GS_SESSIONS.delve === s && !s.live && !s.loss && !s.unfinished));

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
    const fb = FALLBACK(s); const out = window.SsOutcome.delve(s);
    const setting = out.label && out.label !== 'Delve' ? out.label : fb.setting;
    const heroName = out.hero ? String(out.hero) : null;
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

  // The IA pass puts the two tracks under the hero as two short bars; canon's tracks and endings cards leave the side column (Share stays the button).
  const Bars = ({ s, m }) => h('div', { className: 'dv-bars' },
    h(window.GsTrack, { label: 'Rooms reached', value: m.reached, max: m.rooms || 6 }),
    h(window.GsTrack, { label: 'Threat', value: m.threat, max: m.threatMax || 6, threat: true }));

  // The page every Delve option shares: head, the option's hero, the action card with canon's side cards, the Record.
  const Frame = ({ gid, session, sid, share, api, m, out, hero, layout }) => {
    const status = session.unfinished ? 'ended' : session.live ? 'live' : 'done';
    const say = m.reached + ' of ' + m.rooms + ' rooms reached, threat ' + m.threat + ' of ' + m.threatMax + '.';
    return h(Ss.Page, { gid },
      h(Ss.Head, { gid, art: 'delve', label: 'Delve · ' + m.setting, date: session.date, h1: out.h1, mark: out.mark, stats: out.stats, sub: m.hero || 'Hero not sent' }),
      h('div', { className: 'ss-body' }, hero,
        h('aside', { className: 'ss-side' }, h(Ss.ShareCard, { status, say, lines: share.lines, gid, session, sid, api }), layout === 'ia' ? null : h(Side, { s: session, m }))),
      h(Ss.Record, { title: 'Every move', lines: session.lines }));
  };

  // ---- Element stops. Every mark is one roll of the run (kept die, tier, natural 20 or 1, streak, room entered); nothing else is drawn. ----
  const endOf = (s) => (s.live || s.unfinished ? 'live' : s.loss ? 'lost' : 'won');
  const crown = (w, h2) => [[w / 2, 0], [w, h2 * .25], [w, h2 * .75], [w / 2, h2], [0, h2 * .75], [0, h2 * .25]];
  const pts = (a, dx, dy) => a.map((p) => (p[0] + (dx || 0)).toFixed(2) + ',' + (p[1] + (dy || 0)).toFixed(2)).join(' ');

  // Between: the cells become the cover's amber steps. Height gives the tier; the number sits under each step.
  // Natural 20: a coral square on the step (the cover's torch flame). Natural 1: the low step in outline with a slash. Streak: a cream rule under the run.
  const Steps = ({ rolls, size, marks, nums, label }) => {
    const sz = size || 'md';
    return h('div', { className: 'dv-steps is-' + sz, role: 'img', 'aria-label': label }, rolls.map((r, i) => {
      const nx = rolls[i + 1];
      return h('span', { key: i, className: 'dv-step t-' + r.tier + (r.crit ? ' is-crit' : '') + (r.fumble ? ' is-fumble' : '') + (r.inRun ? ' is-streak' : '') + (r.inRun && nx && nx.inRun ? ' is-run' : '') + (marks && marks.indexOf(r.n) > -1 ? ' is-pick' : ''), 'aria-hidden': true },
        h('i', { className: 'dv-step-bar' }, r.crit ? h('b', { className: 'dv-flame' }) : null), nums === false ? null : h('em', { className: 'dv-step-n' }, r.kept));
    }));
  };

  // Game: one d20 as a flat hexagon (cover language). strong: green with the face triangle; weak: amber; miss: coral outline; natural 20: amber rim; natural 1: cracked in two.
  // An advantage roll draws the dropped die behind it as a pale outline with no number. Drawn at 36 x 40, scaled by the viewBox.
  const HEX = crown(36, 40);
  const Die = ({ r, x, y, fs, cracked }) => {
    const split = r.fumble || cracked;
    const g = [];
    const num = (k) => h('text', { key: k, x: 18, y: 20.5, textAnchor: 'middle', dominantBaseline: 'central', className: 'dv-num is-' + r.tier + (split ? ' is-split' : ''), style: { fontSize: fs || 15 } }, r.kept);
    if (r.two && r.dropped != null) g.push(h('polygon', { key: 'dr', className: 'dv-dropped', points: pts(HEX, -6, -6) }));
    if (r.crit) g.push(h('polygon', { key: 'rim', className: 'dv-rim', points: crown(44, 49.5).map((p) => [p[0] - 4, p[1] - 4.75]).map((p) => p.join(',')).join(' ') }));
    if (split) {
      const top = [[0, 10], [18, 0], [36, 10], [36, 30]], bot = [[0, 10], [36, 30], [18, 40], [0, 30]];
      g.push(h('polygon', { key: 'a', className: 'dv-half', points: pts(top, 1.3, -1.3) }), h('polygon', { key: 'b', className: 'dv-half', points: pts(bot, -1.3, 1.3) }));
    } else if (r.tier === 'miss') g.push(h('polygon', { key: 'm', className: 'dv-hex is-miss', points: pts(HEX) }));
    else g.push(h('polygon', { key: 'h', className: 'dv-hex is-' + r.tier, points: pts(HEX) }));
    if (!split && r.tier === 'strong') g.push(h('polyline', { key: 'f', className: 'dv-face', points: '18,9 29,29 7,29 18,9' }));
    g.push(num('n'));
    return h('g', { transform: 'translate(' + x + ',' + y + ')' }, g);
  };

  // Game, option 1: the dice on the cover's descending stair. One step per roll, flights that switch back, a wider landing for each room entered,
  // the arch's dark opening at the foot: lit amber when the run was won, dark when it fell or was overrun, not drawn while the run is open.
  const DX = 46, DY = 14, LAND = 14, DW = 36, DH = 40, TH = 8, FLIGHT_H = 49 + TH, GAP = 14, ARCH_W = 44, ARCH_H = 60;
  function layoutStair(rolls, per) {
    const n = rolls.length, nf = Math.max(1, Math.ceil(n / per)), size = Math.ceil(n / nf);
    const items = []; let W = 0, H = 0;
    for (let f = 0; f < nf; f++) {
      const top = f * (FLIGHT_H + (size - 1) * DY + GAP); let cur = 0;
      const part = rolls.slice(f * size, f * size + size);
      part.forEach((r, k) => {
        const i = f * size + k; const room = i > 0 && r.room !== rolls[i - 1].room;
        if (k > 0 && room) cur += LAND;
        items.push({ r, x: cur, y: top + k * DY, landing: room, k, f, last: k === part.length - 1, nf });
        cur += DX;
      });
      W = Math.max(W, cur - (DX - DW)); H = Math.max(H, top + (part.length - 1) * DY + FLIGHT_H);
    }
    const lastIt = items[items.length - 1];
    const arch = lastIt ? { x: lastIt.x + DX, base: lastIt.y + DY + FLIGHT_H } : null;
    if (arch) { W = Math.max(W, arch.x + ARCH_W); H = Math.max(H, arch.base); }
    return { items, W, H, arch, size };
  }
  const Stair = ({ rolls, end, label }) => {
    const ref = React.useRef(null); const [wide, setWide] = React.useState(false);
    React.useLayoutEffect(() => {
      const el = ref.current; if (!el) return undefined;
      const box = el.parentNode; const fit = () => setWide(box.getBoundingClientRect().width >= 480);
      fit(); const ro = new ResizeObserver(fit); ro.observe(box); return () => ro.disconnect();
    }, []);
    const L = layoutStair(rolls, wide ? 12 : 6);
    const maxW = wide ? 760 : 380;
    const nodes = [];
    L.items.forEach((it, idx) => {
      const { r, x, y } = it;
      const tx = it.landing ? x - LAND - 5 : x - 5;
      nodes.push(h('rect', { key: 't' + idx, className: 'dv-tread' + (it.landing ? ' is-landing' : ''), x: tx, y: y + 49, width: it.landing ? DW + 10 + LAND : DW + 10, height: TH }));
      if (r.inRun && !r.fumble) nodes.push(h('rect', { key: 's' + idx, className: 'dv-streakbar', x, y: y + 44, width: DW, height: 3 }));
      nodes.push(h(Die, { key: 'd' + idx, r, x, y, fs: 15, cracked: end === 'lost' && idx === L.items.length - 1 }));
    });
    if (L.arch && end !== 'live') {
      const { x, base } = L.arch;
      nodes.push(h('g', { key: 'arch', className: 'dv-arch', transform: 'translate(' + x + ',' + (base - ARCH_H) + ')' },
        h('path', { className: 'dv-arch-out', d: 'M0 ' + ARCH_H + ' V22 A22 22 0 0 1 44 22 V' + ARCH_H + ' Z' }),
        h('path', { className: 'dv-arch-in is-' + end, d: 'M9 ' + ARCH_H + ' V24 A13 13 0 0 1 35 24 V' + ARCH_H + ' Z' })));
    }
    return h('div', { className: 'dv-stair', ref, style: { maxWidth: maxW } },
      h('svg', { viewBox: '-6 -6 ' + (L.W + 12) + ' ' + (L.H + 12), width: '100%', style: { display: 'block', margin: '0 auto', maxWidth: (L.W + 12) * (wide ? 1.15 : 1.2) }, role: 'img', 'aria-label': label }, nodes));
  };

  // One big die on its own, for a moment card (Game stop of option 3). Sits in a plain slot, target beside it in the page's type.
  const BigDie = ({ r, size, label }) => h('svg', { className: 'dv-bigdie', viewBox: '-6 -6 48 52', width: size || 96, height: Math.round((size || 96) * 52 / 48), role: 'img', 'aria-label': label }, h(Die, { r, x: 0, y: 0, fs: 14 }));

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

    /* ---- Element stops (additive; every rule below is inert at Store). Flat only: no shadow, glow, dashed line or grain. ---- */
    :scope .dv-bars { display: grid; gap: 12px; }
    :scope .dv-bars .gs-track { grid-template-columns: none; grid-auto-flow: column; grid-auto-columns: 1fr; }
    :scope .dv-steps { display: flex; flex-wrap: wrap; gap: 16px 6px; align-items: flex-end; --w: 36px; --hh: 36px; }
    :scope .dv-steps.is-md { --w: 36px; --hh: 36px; }
    @container dv (min-width: 480px) { :scope .dv-steps.is-md { --w: 44px; } }
    :scope .dv-steps.is-sm { --w: 16px; --hh: 24px; gap: 14px 4px; }
    :scope .dv-steps.is-xl { --w: 72px; --hh: 72px; }
    :scope .dv-step { position: relative; width: var(--w); display: grid; justify-items: center; align-content: end; gap: 3px; padding-bottom: 4px; }
    :scope .dv-step-bar { position: relative; display: block; width: 100%; background: var(--cover-amber); height: var(--hh); }
    :scope .dv-step.t-weak .dv-step-bar { height: calc(var(--hh) * .667); }
    :scope .dv-step.t-miss .dv-step-bar { height: calc(var(--hh) * .333); }
    :scope .dv-step.is-fumble .dv-step-bar { background: transparent; border: 2px solid var(--cover-amber); box-sizing: border-box; background-image: linear-gradient(to top right, transparent calc(50% - 1px), var(--cover-amber) calc(50% - 1px) calc(50% + 1px), transparent calc(50% + 1px)); }
    :scope .dv-flame { position: absolute; left: 50%; top: -10px; width: 8px; height: 8px; margin-left: -4px; background: var(--cover-orange); }
    :scope .dv-step-n { font: 600 13px/1 var(--font-text); font-style: normal; color: var(--text); }
    :scope .dv-steps.is-xl .dv-step-n { font-size: 20px; }
    :scope .dv-step.is-streak::after { content: ''; position: absolute; left: 0; right: -6px; bottom: 0; height: 2px; background: var(--cover-cream); }
    :scope .dv-step.is-streak:not(.is-run)::after { right: 0; }
    :scope .dv-steps.is-sm .dv-step { padding-bottom: 4px; }
    :scope .dv-step.is-pick .dv-step-bar { outline: 2px solid var(--text); outline-offset: 2px; }
    :scope .dv-slot { background: var(--cover-bg-wine); padding: 12px 8px; display: grid; justify-items: center; }
    :scope .dv-stair { width: 100%; }
    :scope .dv-hex.is-strong { fill: var(--cover-green); }
    :scope .dv-hex.is-weak { fill: var(--cover-amber); }
    :scope .dv-hex.is-miss { fill: none; stroke: var(--cover-orange); stroke-width: 2; vector-effect: non-scaling-stroke; }
    :scope .dv-half { fill: none; stroke: var(--cover-orange); stroke-width: 2; vector-effect: non-scaling-stroke; }
    :scope .dv-rim { fill: none; stroke: var(--cover-amber); stroke-width: 3; vector-effect: non-scaling-stroke; }
    :scope .dv-dropped { fill: none; stroke: var(--muted); stroke-width: 1.5; vector-effect: non-scaling-stroke; }
    :scope .dv-face { fill: none; stroke: var(--cover-bg-wine); stroke-width: 1; opacity: 0.3; vector-effect: non-scaling-stroke; }
    :scope .dv-num { font-family: var(--font-text); font-weight: 700; fill: var(--cover-bg-wine); }
    :scope .dv-num.is-strong { stroke: var(--cover-green); stroke-width: 3px; paint-order: stroke; stroke-linejoin: round; }
    :scope .dv-num.is-miss { fill: var(--cover-cream); }
    :scope .dv-tread { fill: color-mix(in srgb, var(--cover-amber) 55%, var(--cover-bg-wine)); }
    :scope .dv-streakbar { fill: var(--cover-amber); }
    :scope .dv-arch-out { fill: var(--cover-lilac); }
    :scope .dv-arch-in.is-won { fill: var(--cover-amber); }
    :scope .dv-arch-in.is-lost { fill: var(--cover-bg-indigo); }
    :scope .dv-momentrow { display: flex; align-items: center; gap: 16px; }
    :scope .dv-target { font: var(--type-card-title); margin: 0; }
    :scope .dv-bigdie { flex: none; }
  `;

  window.DvModel = { build, useModel, cell, rollWord, Side, Frame, Bars, Steps, Stair, Die, BigDie, endOf, baseCss, TIER, STAT3, KIND };
})();
