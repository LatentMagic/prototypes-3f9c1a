// ============================================================================
// Session pages: the shared foundation. Loads after canon's modules, before the options.
// Exposes window.Ss = { Page, Head, Stats, Cells, Strip, Card, ShareCard, Record, GameLink, OnceLine, useOutcome, copyText, shortDay }.
// Built from canon's parts, mounted not copied: DS.Button, DS.TextLink, DS.Disclosure, DS.Tag, GsCover, LbBackTo, GsNeedsPass, GS_ONCE_LINE.
// The one new thing is the square cell (the design system's TileGrid is chat-only: light ground, 32px cap). Surfaces read --ss-* tokens (game-tokens.css).
// Babel scripts share one global scope: everything is inside this function.
// ============================================================================
(function () {
  const D = () => window.DS;
  const h = React.createElement;

  // The distance (near | middle | far) from the rail's switch. Pages never read it directly: they read the tokens it sets on .ss-page.
  const useDist = () => (window.usePgSel().dist || 'near');
  const shortDay = (d) => (typeof d === 'string' ? d.replace(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)[a-z]*day\b/, '$1') : d);

  // Copy as canon's lbCopy does: the textarea path first (inside the click), the Clipboard API as the fallback.
  function copyText(text) {
    const was = document.activeElement; let ok = false;
    try {
      const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
      document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
      ok = document.execCommand('copy'); document.body.removeChild(ta);
    } catch (e) {}
    if (was && was !== document.body && was.focus) was.focus({ preventScroll: true });
    if (!ok && navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
    window.__ssCopied = text;   // read by the playground's checks
  }

  // useOutcome(gid, session) -> the outcome record (h1, mark, label, lines, play, ...). One function per game, shared by the h1 and the Share card.
  function useOutcome(gid, session) { return React.useMemo(() => window.SsOutcome[gid](session), [gid, session]); }

  // ---- Page: ground wrapper (the Far ground), back link, container. children = Head, then .ss-body (Hero + Side), then Record. ----
  function Page({ gid, children }) {
    const dist = useDist();
    return h('div', { className: 'ss-page', 'data-game': gid, 'data-dist': dist },
      h('main', { className: 'ss-main' }, h('div', null, h(window.LbBackTo, { gid })), children));
  }

  // ---- Head: cover beside the label line (game name links to the game page, date beside it), the h1 (the outcome line), one-line stat row. ----
  // props: gid, art, label ("Daily Word No. 212"), date, h1, stats [{label, value}] (2 to 4; one line, never a second row), sub (optional caption under the h1)
  function Head({ gid, art, label, date, h1, stats, sub }) {
    const gs = window.useGs(); const g = window.GS_GAMES[gid];
    const starts = label.indexOf(g.name) === 0;
    const rest = starts ? label.slice(g.name.length).trim() : label;
    return h('section', { className: 'ss-head' },
      h(window.GsCover, { art: art || g.art }),
      h('div', { className: 'ss-head-label' },
        h('span', { className: 'ss-head-name' }, h(D().TextLink, { onClick: () => gs.go(g.route, { page: 'record' }) }, g.name), rest ? (starts ? ' ' : ' · ') + rest : null),
        date ? h('span', { className: 'ss-head-date' }, shortDay(date)) : null),
      h('h1', { className: 'ss-h1' }, h1),
      sub ? h('p', { className: 'ss-caption', style: { gridColumn: '1 / -1', margin: 0 } }, sub) : null,
      stats && stats.length ? h(Stats, { items: stats.slice(0, 4) }) : null);
  }
  function Stats({ items }) {
    return h('dl', { className: 'ss-stats' }, items.map((s, i) => h('div', { className: 'ss-stat', key: i }, h('dt', null, s.label), h('dd', null, s.value))));
  }

  // ---- Cells: the one square-cell component (MarkStrip and TileGrid as one family). ----
  // rows: array of rows; a row is an array of cells { t (text in the square), k (kind), sub (small text inside the foot) }.
  // kinds: hit | near | miss (tile marks, DS cover green/amber), filled, empty, hint, mark1|mark2|mark3 (the game's marks; shapes only at Near they are neutral), plain.
  // cols: cells per row (default: longest row). size: 'md' 52px (default), 'lg' 64px, 'fit' fills the column up to 66px. label: the accessible text.
  function Cells({ rows, cols, size, label, className }) {
    const n = cols || Math.max.apply(null, rows.map((r) => r.length));
    return h('div', { className: 'ss-cells ' + (className || ''), role: 'img', 'aria-label': label, 'data-size': size || 'md', style: { '--cols': n } },
      rows.map((r, i) => h('div', { className: 'ss-cells-row', key: i }, r.map((c, j) => h('span', { className: 'ss-cell', key: j, 'data-k': c.k || 'plain', 'aria-hidden': true }, c.t, c.sub ? h('i', { className: 'ss-cell-sub' }, c.sub) : null)))));
  }
  // A strip: one run of cells wrapped at perRow.
  function Strip({ cells, perRow, size, label }) {
    const n = perRow || cells.length, rows = []; for (let i = 0; i < cells.length; i += n) rows.push(cells.slice(i, i + n));
    return h(Cells, { rows, cols: n, size, label });
  }

  // ---- Card: the one card kind. kicker, title, up to three facts, an optional status tag. ----
  function Card({ kicker, title, facts, tag, children, className }) {
    return h('article', { className: 'ss-card ' + (className || '') },
      kicker || tag ? h('div', { className: 'ss-card-head' }, h('span', { className: 'ss-kicker' }, kicker), tag ? h('span', { className: 'ss-tag', 'data-tone': tag.tone }, tag.text) : null) : null,
      title ? h('h3', { className: 'ss-card-title' }, title) : null,
      facts && facts.length ? h('ul', { className: 'ss-card-facts' }, facts.slice(0, 3).map((f, i) => h('li', { key: i }, f))) : null,
      children);
  }

  // ---- OnceLine: the played-once line (daily and weekly games); a chapter game gets Start over instead (gsStartsOver). ----
  function OnceLine() { return h('p', { className: 'ss-caption' }, window.GS_ONCE_LINE); }
  // GameLink: the way back to the game's own page, as a TextLink (the head's game name does the same; this is for a hero or card that wants one).
  function GameLink({ gid, children }) {
    const gs = window.useGs(); const g = window.GS_GAMES[gid];
    return h(D().TextLink, { onClick: () => gs.go(g.route, { page: 'record' }) }, children || 'Back to ' + g.name);
  }

  // ---- ShareCard: the action card (shortlist 2.2). One card, one place; its content changes with the state, its shape does not. ----
  // props: status 'done' | 'live' | 'ended' | 'kept';  lines (the exact share text, from the outcome function; null unless done);
  //        gid, session, sid, api (for Play / Start over). The share text is shown as it will paste, with Copy inside it. No pop-up, never floats.
  function ShareCard({ status, lines, gid, session, sid, api }) {
    const [copied, setCopied] = React.useState(false);
    React.useEffect(() => { if (!copied) return undefined; const t = setTimeout(() => setCopied(false), 2400); return () => clearTimeout(t); }, [copied]);
    const B = D().Button;
    if (status === 'live') return h('section', { className: 'ss-card ss-side-card', 'aria-label': 'In progress' },
      h('h3', { className: 'ss-card-title' }, 'In progress'), h('p', { className: 'ss-say' }, 'No result yet.'),
      h(B, { onClick: () => api.play(session.game, sid) }, 'Play'));
    if (status === 'kept') return h('section', { className: 'ss-card ss-side-card', 'aria-label': 'In progress' },
      h('h3', { className: 'ss-card-title' }, 'In progress'),
      h(window.GsNeedsPass, { gid, text: 'We’ve kept this session. Playing it needs the Pass.' }));
    if (status === 'ended') return h('section', { className: 'ss-card ss-side-card', 'aria-label': 'Not finished' },
      h('h3', { className: 'ss-card-title' }, 'Not finished'),
      h('p', { className: 'ss-say' }, (window.gsRhythm && window.gsRhythm(gid) === 'weekly' ? 'The week' : 'The day') + ' ended before you finished. What you played stays in your history.'));
    const startOver = window.gsStartsOver && window.gsStartsOver(gid);
    return h('section', { className: 'ss-card ss-side-card', 'aria-label': 'Share this result' },
      h('h3', { className: 'ss-card-title' }, 'Share this result'),
      h('pre', { className: 'ss-sharetext', 'data-testid': 'share-text' }, lines.join('\n')),
      h(B, { done: copied, doneLabel: 'Copied', onClick: () => { copyText(lines.join('\n')); setCopied(true); } }, 'Copy'),
      startOver ? h(B, { variant: 'secondary', onClick: () => api.play(session.game, sid) }, 'Start over') : h(OnceLine));
  }

  // ---- Record: the ruled list as deployed (list title, lines "label · parts"). A Disclosure titled with the count on a phone, open on desktop. 200-line paging. ----
  function Record({ title, lines }) {
    const wide = React.useState(() => window.matchMedia('(min-width: 1024px)').matches)[0];
    const [limit, setLimit] = React.useState(200);
    if (!lines || !lines.length) return null;
    const list = h('ol', { className: 'ss-lines' }, lines.slice(0, limit).map((l, i) => h('li', { key: i }, h('span', { className: 'gs-strong' }, l[0]), ' · ' + l.slice(1).join(' · '))));
    const more = lines.length > limit ? h(D().TextLink, { onClick: () => setLimit(limit + 200) }, 'Show more') : null;
    return h('section', { className: 'ss-record' },
      wide ? h(React.Fragment, null, h('h2', { className: 'ss-record-title' }, title), list, more)
        : h(D().Disclosure, { title: title + ' (' + lines.length + ')' }, h(React.Fragment, null, list, more)));
  }

  window.Ss = { Page, Head, Stats, Cells, Strip, Card, ShareCard, Record, GameLink, OnceLine, useOutcome, useDist, copyText, shortDay };
})();
