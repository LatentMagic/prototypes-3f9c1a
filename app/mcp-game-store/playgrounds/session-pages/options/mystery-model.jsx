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

  // ==========================================================================================================================
  // Additionals (Element = Between / Game, Layout = IA pass). Shared by options 1 to 3, built here so no other file is touched.
  // The accusation is the one element: three parts (suspect, weapon, room). Its state:
  //   solved   the accusation was right: every part right.
  //   known    wrong, and the seed's `wrong` says which part(s) missed (S: the engine records it, the web is not sent it).
  //   unknown  wrong, deployed today: the record does not say which part missed.
  //   none     no accusation (in progress, or the day ended).
  // Every mark is one recorded fact: names and Right/Wrong from the `Accusation` line, the missed part from `wrong`, answers from the `Question N` lines.
  // ==========================================================================================================================
  const PARTS = [['suspect', 'Suspect'], ['weapon', 'Weapon'], ['room', 'Room']];
  const nice = (v) => (v ? cap(String(v).replace(/^(the|a|an) /i, '')) : v);
  PgMystery.parts = (c) => PARTS.map(([k, label]) => ({ k, label, name: c.acc ? nice(c.acc[k]) : null, ok: c.acc ? (c.verdict ? c.verdict[k] : null) : null }));
  PgMystery.accState = (c) => (!c.acc ? 'none' : c.acc.right ? 'solved' : c.verdict ? 'known' : 'unknown');
  const partLabel = (p) => p.label + ': ' + (p.name || 'not named') + (p.ok == null ? '' : p.ok ? ', right' : ', wrong');

  // The inked tick and cross (flat strokes, current colour).
  const Ink = ({ yes, size }) => (
    <svg className="mx-ink" width={size || 16} height={size || 16} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      {yes ? <path d="M2 8.5 6 12.5 14 3.5" /> : <path d="M3 3 13 13M13 3 3 13" />}
    </svg>
  );
  PgMystery.Ink = Ink;

  // The line under the drawing: the overall Wrong tag when the record does not say which part missed; the plain line when nothing was accused.
  const Foot = ({ st, status }) => {
    if (st === 'unknown') return <p className="mx-foot"><span className="ss-tag" data-tone="error">Wrong</span></p>;
    if (st === 'none') return <p className="mx-foot">{status === 'ended' ? 'No accusation was made.' : 'No accusation yet.'}</p>;
    return null;
  };

  // ---- Game: three evidence tags on one string, on the wine cover ground, in a fenced slot. ----
  const Slot = ({ c, status, withQ }) => {
    const st = PgMystery.accState(c), parts = PgMystery.parts(c);
    const okA = parts.map((p) => st === 'solved' || (st === 'known' && p.ok === true));
    const miss = parts.map((p) => st === 'known' && p.ok === false);
    const attached = st === 'unknown' || st === 'none';
    const label = st === 'solved' ? 'Your accusation, all three right' : st === 'known' ? 'Your accusation, ' + parts.filter((p) => p.ok).length + ' of 3 right' : st === 'unknown' ? 'Your accusation, wrong' : 'No accusation yet';
    const rots = ['8deg', '5deg', '-8deg'], shifts = ['4px', '0px', '-4px'];
    return (
      <div className="mx-slot" data-state={st} role="group" aria-label={label}>
        <div className="mx-in">
          <div className="mx-tags">
            {st === 'none' ? (
              <svg className="mx-slack" viewBox="0 0 300 40" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 18 Q150 46 300 18" /></svg>
            ) : null}
            {(okA[0] || attached) ? <i className="mx-pin mx-pin-l" aria-hidden="true" /> : null}
            {(okA[2] || attached) ? <i className="mx-pin mx-pin-r" aria-hidden="true" /> : null}
            {parts.map((p, i) => {
              const ext = (side) => (side === 'l' ? (i === 0 ? 'pin' : (okA[i - 1] || attached) ? 'link' : 'edge') : (i === 2 ? 'pin' : (okA[i + 1] || attached) ? 'link' : 'edge'));
              const strung = okA[i] || (st === 'unknown');
              const snap = st === 'unknown' && i === 1;
              return (
                <div className="mx-tag" key={p.k} data-miss={miss[i] ? '1' : undefined} data-empty={st === 'none' ? '1' : undefined} role="img" aria-label={st === 'none' ? p.label + ': not named yet' : partLabel(p)}
                  style={miss[i] ? { '--rot': rots[i], '--sh': shifts[i] } : undefined}>
                  {strung ? <i className="mx-str" data-h="l" data-e={ext('l')} data-snap={snap ? '1' : undefined} /> : null}
                  {strung ? <i className="mx-str" data-h="r" data-e={ext('r')} data-snap={snap ? '1' : undefined} /> : null}
                  {miss[i] ? <i className="mx-pin mx-pin-own" /> : null}
                  <div className="mx-card" aria-hidden="true">
                    <i className="mx-hole" />
                    <span className="mx-kick">{p.label}</span>
                    {st === 'none' ? null : <span className="mx-nm">{p.name}</span>}
                    {okA[i] ? <span className="mx-tick"><Ink yes size={16} /></span> : null}
                    {miss[i] ? <i className="mx-strike" /> : null}
                  </div>
                </div>
              );
            })}
          </div>
          <Foot st={st} status={status} />
          {withQ && c.qs.length ? (
            <ul className="mx-qrows">
              {c.qs.map((q, i) => (
                <li className="mx-qr" key={i}><span>{q.text}</span><span className="mx-qs" role="img" aria-label={'The inspector said ' + q.answer}><Ink yes={q.answer === 'Yes'} size={14} /></span></li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    );
  };

  // ---- Between: the three design-system cards, each with the cover's coral ring (right) or the closed ring, a disc (missed), and a text tag. ----
  const Between = ({ c, status }) => {
    const st = PgMystery.accState(c), parts = PgMystery.parts(c);
    return (
      <div className="mx-bwrap">
        <div className="mx-bt" data-state={st}>
          {parts.map((p) => (
            <article className="ss-card mx-bc" key={p.k} aria-label={st === 'none' ? p.label + ': not named yet' : partLabel(p)}>
              {p.ok === true ? <i className="mx-ring" aria-hidden="true" /> : p.ok === false ? <i className="mx-disc" aria-hidden="true" /> : null}
              <span className="ss-kicker">{p.label}</span>
              <h3 className={'mx-bname' + (p.name ? '' : ' is-none')}>{p.name || 'Not named yet'}</h3>
              {p.ok != null ? <span className="ss-tag" data-tone={p.ok ? 'success' : 'error'}>{p.ok ? 'Right' : 'Wrong'}</span> : null}
            </article>
          ))}
        </div>
        <Foot st={st} status={status} />
      </div>
    );
  };

  // ---- Store, for the IA pass: the same three cards as option 3's verdict, one glyph square each (no tag, no sentence). ----
  const Squares = ({ c, status }) => {
    const st = PgMystery.accState(c), parts = PgMystery.parts(c), D = window.DS;
    return (
      <div className="mx-bwrap">
        <div className="mx-bt mx-st" data-state={st}>
          {parts.map((p) => (
            <article className="ss-card mx-bc" key={p.k} aria-label={st === 'none' ? p.label + ': not named yet' : partLabel(p)}>
              {st === 'none' ? <span className="mx-sq is-empty" aria-hidden="true" />
                : p.ok == null ? <span className="mx-sq is-none" aria-hidden="true">?</span>
                : <span className={'mx-sq ' + (p.ok ? 'is-ok' : 'is-bad')} aria-hidden="true"><D.Icon name={p.ok ? 'check' : 'error'} size={32} /></span>}
              <span className="ss-kicker">{p.label}</span>
              <h3 className={'mx-bname' + (p.name ? '' : ' is-none')}>{p.name || 'Not named yet'}</h3>
            </article>
          ))}
        </div>
        <Foot st={st} status={status} />
      </div>
    );
  };

  // The accusation at the asked stop. withQ: the Game slot carries the (at most two) question rows with their inked tick or cross.
  PgMystery.Accusation = ({ c, status, element, withQ }) => (element === 'game' ? <Slot c={c} status={status} withQ={withQ} /> : element === 'between' ? <Between c={c} status={status} /> : <Squares c={c} status={status} />);

  // ---- IA pass: the play as small tiles, in order. A tap opens the question; nothing but the answer is on the face. ----
  PgMystery.QTiles = ({ c, status }) => {
    const [sel, setSel] = React.useState(-1);
    let qn = 0;
    const tiles = c.items.map((it, i) => it.kind === 'q'
      ? { key: i, label: 'Question ' + (++qn), text: it.text, cell: { t: it.answer, k: it.answer === 'Yes' ? 'mark1' : 'filled' }, say: 'The inspector said ' + it.answer }
      : { key: i, label: 'Hint', text: it.text, cell: { t: 'H', k: 'hint' }, say: 'A hint' });
    for (let i = c.asked; i < 2; i++) tiles.push({ key: 'e' + i, label: status === 'done' ? 'Not asked' : 'Not asked yet', cell: { t: '', k: 'empty' }, say: 'Not asked', none: true });
    const open = sel > -1 && tiles[sel] && tiles[sel].text ? tiles[sel] : null;
    return (
      <div className="mx-qt">
        <div className="mx-qt-row">
          {tiles.map((t, i) => t.none ? (
            <div className="mx-qt-b is-none" key={t.key}><Ss.Cells size="lg" label={t.say} rows={[[t.cell]]} /><span className="ss-kicker">{t.label}</span></div>
          ) : (
            <button type="button" className="mx-qt-b" key={t.key} aria-expanded={sel === i} onClick={() => setSel(sel === i ? -1 : i)}>
              <Ss.Cells size="lg" label={t.say} rows={[[t.cell]]} /><span className="ss-kicker">{t.label}</span>
            </button>
          ))}
        </div>
        {open ? <p className="mx-qt-open" role="status"><span className="ss-kicker">{open.label}</span> {open.text}</p> : null}
      </div>
    );
  };

  // ---- IA pass, option 3: the play as chips under the verdict. ----
  PgMystery.QChips = ({ c }) => {
    let qn = 0;
    const chips = c.items.map((it, i) => it.kind === 'q' ? 'Question ' + (++qn) + ' · ' + it.answer : 'Hint');
    return chips.length ? <ul className="mx-chips">{chips.map((t, i) => <li key={i} className="ss-tag">{t}</li>)}</ul> : null;
  };

  // The shared CSS, included in each option's css (`:scope` becomes that option's root).
  PgMystery.css = `
      :scope .mx-ink path { fill: none; stroke: currentColor; stroke-width: 2.4; }
      /* Game: the slot. Cover ground, cover tokens, flat fills, no texture; --shadow-card is the card's own. */
      :scope .mx-slot { container: mxs / inline-size; background: var(--cover-bg-wine); color: var(--cover-cream); box-shadow: var(--shadow-card); margin-inline: calc(var(--hp, 0px) * -1); min-width: 0; }
      :scope .mx-in { --pad: 16px; --g: 13px; --twmax: 100px; --th: 140px; --tw: min(var(--twmax), calc((100cqw - 2 * var(--pad) - 2 * var(--g)) / 3));
        padding: 24px var(--pad) 16px; display: grid; gap: 16px; justify-items: center; min-width: 0; }
      @container mxs (min-width: 480px) { :scope .mx-in { --pad: 24px; --g: 24px; --twmax: 180px; --th: 150px; padding-top: 32px; } }
      :scope .mx-tags { position: relative; display: grid; grid-template-columns: repeat(3, var(--tw)); gap: var(--g); }
      :scope .mx-tag { position: relative; height: var(--th); z-index: 1; }
      :scope .mx-card { position: absolute; inset: 0; background: var(--cover-cream); color: var(--page); display: grid; gap: 4px; align-content: start; padding: 28px 4px 8px; overflow: hidden;
        clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%, 0 12px); transform-origin: 50% 6px; }
      :scope .mx-tag[data-miss] .mx-card { transform: translateX(var(--sh)) rotate(var(--rot)); }
      :scope .mx-hole { position: absolute; left: 50%; top: 14px; width: 8px; height: 8px; margin-left: -4px; border-radius: 50%; background: var(--cover-bg-wine); }
      :scope .mx-kick { font: 600 13px/1.2 var(--font-text); color: color-mix(in srgb, var(--page) 72%, var(--cover-cream)); }
      :scope .mx-nm { font: 700 min(15px, calc(var(--tw) / 7.4))/1.2 var(--font-heading); letter-spacing: -0.02em; overflow-wrap: normal; word-break: normal; hyphens: none; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; }
      :scope .mx-tick { position: absolute; right: 8px; bottom: 8px; width: 16px; height: 16px; color: var(--cover-bg-wine); display: block; }
      :scope .mx-strike { position: absolute; left: -25%; width: 150%; top: calc(50% - 1.5px); height: 3px; background: var(--cover-orange); transform: rotate(-45deg); transform: rotate(calc(-1 * atan2(var(--th), var(--tw)))); }
      :scope .mx-tag[data-empty] .mx-card::before { content: ''; position: absolute; inset: 0; background: var(--cover-bg-wine);
        clip-path: polygon(calc(12px + 0.42px) 1px, calc(100% - 12px - 0.42px) 1px, calc(100% - 1px) calc(12px + 0.42px), calc(100% - 1px) calc(100% - 1px), 1px calc(100% - 1px), 1px calc(12px + 0.42px)); }
      :scope .mx-tag[data-empty] .mx-kick { position: relative; color: var(--cover-cream); }
      :scope .mx-tag[data-empty] .mx-hole { background: transparent; border: 1px solid var(--cover-cream); box-sizing: border-box; }
      /* The string: halves through each hole; pins at the ends. A broken string is two tails (snap) or a tag on its own pin. */
      :scope .mx-str { position: absolute; top: 17px; height: 2px; background: var(--cover-cream); z-index: 2; }
      :scope .mx-str[data-h="l"] { left: 0; right: 50%; }
      :scope .mx-str[data-h="r"] { right: 0; left: 50%; }
      :scope .mx-str[data-h="l"][data-e="link"] { left: calc(var(--g) / -2); }
      :scope .mx-str[data-h="r"][data-e="link"] { right: calc(var(--g) / -2); }
      :scope .mx-str[data-h="l"][data-e="pin"] { left: calc(6px - var(--pad)); }
      :scope .mx-str[data-h="r"][data-e="pin"] { right: calc(6px - var(--pad)); }
      :scope .mx-str[data-h="l"][data-snap] { right: 65%; }
      :scope .mx-str[data-h="r"][data-snap] { left: 65%; }
      :scope .mx-pin { position: absolute; width: 4px; height: 4px; top: 16px; background: var(--cover-cream); z-index: 2; }
      :scope .mx-pin-l { left: calc(4px - var(--pad)); }
      :scope .mx-pin-r { right: calc(4px - var(--pad)); }
      :scope .mx-tags > .mx-pin { top: 16px; }
      :scope .mx-pin-own { top: 4px; left: 50%; margin-left: -2px; }
      :scope .mx-slack { position: absolute; left: calc(6px - var(--pad)); right: calc(6px - var(--pad)); top: 0; height: 44px; width: auto; z-index: 0; overflow: visible; }
      :scope .mx-slack path { fill: none; stroke: var(--cover-cream); stroke-width: 2; vector-effect: non-scaling-stroke; }
      :scope .mx-foot { margin: 0; font: var(--type-body); }
      :scope .mx-qrows { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; width: calc(3 * var(--tw) + 2 * var(--g)); }
      :scope .mx-qr { display: grid; grid-template-columns: minmax(0, 1fr) 20px; gap: 12px; align-items: center; font: 400 13px/1.35 var(--font-text); color: var(--cover-cream); }
      :scope .mx-qs { width: 20px; height: 20px; background: var(--cover-cream); color: var(--cover-bg-wine); display: grid; place-items: center; }
      /* Between and the IA Store cards. */
      :scope .mx-bwrap { display: grid; gap: 12px; min-width: 0; }
      :scope .mx-bt { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; min-width: 0; }
      :scope .mx-bc { position: relative; padding: 10px; gap: 8px; justify-items: start; align-content: start; }
      :scope .mx-ring, :scope .mx-disc { position: absolute; top: 10px; right: 10px; width: 16px; height: 16px; box-sizing: border-box; border-radius: 50%; }
      :scope .mx-ring { border: 3px solid var(--cover-orange); }
      :scope .mx-disc { background: var(--cover-orange); }
      :scope .mx-bname { margin: 0; font: 600 15px/1.25 var(--font-text); letter-spacing: var(--tracking-heading); overflow-wrap: anywhere; text-wrap: balance; color: var(--text); }
      :scope .mx-bname.is-none { color: var(--muted); font-weight: 400; }
      :scope .mx-sq { box-sizing: border-box; width: 100%; aspect-ratio: 1; display: grid; place-items: center; border: 1px solid transparent; font: 700 28px/1 var(--font-text); }
      :scope .mx-sq.is-ok { background: var(--success); color: var(--success-on); }
      :scope .mx-sq.is-bad { background: var(--error); color: var(--error-on); }
      :scope .mx-sq.is-none, :scope .mx-sq.is-empty { background: transparent; border: 1.5px solid var(--ss-line); color: var(--muted); }
      @container ss (min-width: 680px) {
        :scope .mx-bt { gap: 16px; }
        :scope .mx-bc { padding: 20px; gap: 12px; }
        :scope .mx-ring, :scope .mx-disc { top: 20px; right: 20px; }
        :scope .mx-bname { font: var(--type-section-title); letter-spacing: var(--tracking-heading); }
        :scope .mx-sq { max-width: 120px; }
      }
      /* IA tiles and chips. */
      :scope .mx-qt { display: grid; gap: 12px; min-width: 0; }
      :scope .mx-qt-row { display: flex; flex-wrap: wrap; gap: 12px 16px; align-items: start; }
      :scope .mx-qt-b { background: none; border: 0; padding: 0; margin: 0; color: inherit; font: inherit; text-align: left; display: grid; gap: 6px; justify-items: start; }
      :scope button.mx-qt-b { cursor: pointer; }
      :scope button.mx-qt-b:focus-visible { outline: 2px solid var(--off-white); outline-offset: 3px; }
      :scope button.mx-qt-b .ss-kicker { text-decoration: underline; text-underline-offset: 3px; }
      :scope .mx-qt-b.is-none .ss-kicker { color: var(--muted); }
      :scope .mx-qt-open { margin: 0; font: var(--type-body); }
      :scope .mx-qt-open .ss-kicker { margin-right: 6px; }
      :scope .mx-chips { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
  `;
  window.PgMystery = PgMystery;
})();
