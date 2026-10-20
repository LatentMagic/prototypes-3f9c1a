// Session page, Escape, option 3: "The room, told". The play as a short story in text: the room's story, then each lock's contents as a quotation,
// the moves between them as a rule, and the way out at the end. No tiles and no cards in the hero (fix round 1, Fable): option 2 is the grid, this is the prose.
// Reads the play model from escape-model.jsx (window.EsModel), which loads first.
(function () {
  const Told = ({ m, story, element }) => {
    const first = m.locks[0];
    const rule = (text, key) => <p key={key} className="es3-rule"><span>{text}</span></p>;
    const parts = [];
    m.locks.forEach((lk, i) => {
      const n = lk.between;
      const text = i
        ? (n === 0 ? 'Straight on' : EsModel.plural(n, 'move', 'moves') + ' between')
        : (n === 0 ? 'Straight in' : EsModel.plural(n, 'move', 'moves') + ' in');
      parts.push(rule(text, 'r' + i));
      if (lk.exit) return;
      const quoted = lk.contents ? EsModel.sentences(lk.contents, 2) : '';
      parts.push(
        <section key={lk.key} className="es3-lock" aria-label={lk.name}>
          <p className="es3-where">{'Move ' + lk.openedN + ' · ' + lk.name}</p>
          {quoted
            ? (element === 'game'
              ? <blockquote className="es3-note"><span className="es3-pin" aria-hidden="true" /><EsModel.Glyph state={EsModel.lockState(lk)} /><span>{quoted}</span></blockquote>
              : <blockquote className="es3-quote">{element === 'between' ? <Door lk={lk} /> : null}{quoted}</blockquote>)
            : <p className="es3-forced">{'Forced open with ' + (lk.forced || 'a hint') + '.'}</p>}
          <p className="es3-facts">{EsModel.lockFacts(lk)}{lk.gave ? ' · gave you the ' + lk.gave.toLowerCase() : ''}</p>
        </section>);
    });
    if (!first) parts.push(rule('No lock open yet', 'none'));
    return <div className="es3-flow">{story && element !== 'game' ? <p className="es3-story">{story}</p> : null}{parts}</div>;
  };

  // Between: the cover's door down the quotation's left edge with its amber knob (filled: the lock is open).
  const Door = ({ lk }) => <span className="es3-band" aria-hidden="true"><i data-state={EsModel.lockState(lk)} /></span>;

  // IA pass: each lock one row (its mark, minute, hint squares, the quotation's first clause); the quotation and its facts open with a tap.
  const IaRows = ({ m, element }) => {
    const game = element === 'game', between = element === 'between';
    return (
      <ol className="es3-rows" aria-label="Locks in the order they opened">
        {m.locks.map((lk) => {
          const quoted = lk.contents ? EsModel.sentences(lk.contents, 2) : '';
          const clause = lk.exit ? 'You got out' : lk.forced && !quoted ? 'Forced open with ' + lk.forced : EsModel.firstClause(lk.contents);
          const hints = lk.hints.length ? Math.max.apply(null, lk.hints) : 0;
          return (
            <li key={lk.key}>
              <details className={'es3-row' + (between ? ' es3-banded' : '')}>
                <summary>
                  {between ? <Door lk={lk} /> : null}
                  {game ? <EsModel.Glyph state={EsModel.lockState(lk)} /> : <EsModel.Num n={lk.index} size={24} />}
                  <span className="es3-min">{lk.minute != null ? lk.minute + ' min' : 'Move ' + lk.openedN}</span>
                  <span className="es3-pips">{hints ? <EsModel.SqPips n={hints} /> : null}</span>
                  <span className="es3-clause">{clause}</span>
                </summary>
                <div className="es3-more">
                  <p className="es3-where">{lk.name}</p>
                  {quoted ? <blockquote className="es3-quote">{quoted}</blockquote> : null}
                  <p className="es3-facts">{EsModel.lockFacts(lk)}{lk.gave ? ' · gave you the ' + lk.gave.toLowerCase() : ''}</p>
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    );
  };

  const OptionThree = ({ gid, session, sid, share, api, element, layout }) => {
    const m = React.useMemo(() => EsModel.build(session), [session]);
    const out = m.out;
    const sub = m.done && m.forced ? EsModel.plural(m.forced, 'lock forced', 'locks forced') : null;
    const say = m.openCount ? EsModel.plural(m.openCount, 'lock', 'locks') + ' open.' : 'No lock open yet.';
    const story = EsModel.storyOf(session, out);
    const exit = m.done ? m.exitLock : null;
    const ia = layout === 'ia', game = element === 'game';
    const stats = ia && m.done && m.par != null ? (out.stats || []).concat([{ label: 'Par', value: m.par + ' min' }]) : out.stats;
    const oneLine = story ? EsModel.sentences(story, 1) : null;
    return (
      <Ss.Page gid={gid}>
        <Ss.Head gid={gid} art="escape" label={out.label} date={session.date} h1={out.h1} mark="" stats={stats} sub={sub} />
        <div className="ss-body">
          <section className="ss-hero es3-hero" aria-label="The room, told">
            {ia && oneLine ? <p className="es3-line">{oneLine}</p> : null}
            {game ? <EsModel.Plan m={m} /> : null}
            {ia ? (
              <React.Fragment>
                {m.locks.length ? <IaRows m={m} element={element} /> : <p className="es3-rule es3-still"><span>No lock open yet</span></p>}
                {m.done ? null : <p className="es3-rule es3-still"><span>{m.ended ? 'You left before the door opened' : 'Still inside'}</span></p>}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Told m={m} story={story} element={element} />
                {exit ? (
                  <div className="es3-end">
                    <p className="es3-out">You got out.</p>
                    <p className="es3-facts">{exit.name + ' · move ' + exit.openedN + ' · ' + EsModel.lockFacts(exit)}</p>
                  </div>
                ) : m.done ? null : <p className="es3-rule es3-still"><span>{m.ended ? 'You left before the door opened' : 'Still inside'}</span></p>}
              </React.Fragment>
            )}
          </section>
          <aside className="ss-side">
            <Ss.ShareCard status={m.status} say={say} lines={share.lines} gid={gid} session={session} sid={sid} api={api} />
          </aside>
        </div>
        <Ss.Record title={session.listTitle} lines={session.lines} />
      </Ss.Page>
    );
  };

  pgOption('escape', 3, {
    name: 'The room, told',
    stance: 'Tell the play as a short story in text, not tiles: the room’s story, each lock’s contents as a quotation, the moves between as a rule, and the way out last. IA pass: the story is one line and each lock one row (mark, minute, hint squares, the quotation’s first clause) with the rest behind a tap; if this converges on option 1, say so. Between: each quotation sits on the cover’s teal door with an amber knob. Game: the floor plan of the room leads, and the quotations become flat paper notes pinned beside it.',
    cost: 'Needs the engine to send the room’s story and each opened lock’s contents as its own field (today they sit inside the move line, beside the typed answer), and tries per lock; the seed reads the story from content. A quotation can carry the next lock’s clue, so a screenshot of this page spoils the room. Game: the plan needs the engine to send which object each lock sits on and which lock is the exit (read here from the lock’s name and the last opening); position is examine order, not geography; no seed has a forced lock.',
    elements: ['store', 'between', 'game'],
    layouts: ['built', 'ia'],
    Component: OptionThree,
    shareText: (session) => window.SsOutcome.escape(session).lines,
    css: EsModel.numCss + EsModel.planCss + `
      :scope .es3-hero { display: block; min-width: 0; }
      :scope .es3-flow { max-width: 62ch; }
      :scope .es3-story { margin: 0 0 4px; font: var(--type-body); font-size: 18px; line-height: 1.55; color: var(--text); }
      :scope .es3-rule { display: flex; align-items: center; gap: 12px; margin: 20px 0; font: var(--type-caption); color: var(--muted); }
      :scope .es3-rule::before, :scope .es3-rule::after { content: ''; flex: 1; border-top: 1px solid var(--ss-line); }
      :scope .es3-lock { display: grid; gap: 6px; }
      :scope .es3-where { margin: 0; font: var(--type-label); color: var(--muted); }
      :scope .es3-quote { margin: 0; padding: 0 0 0 14px; border-left: 3px solid var(--ss-mark-1); font: var(--type-body); font-size: 18px; line-height: 1.5; font-style: italic; color: var(--text); }
      :scope .es3-forced { margin: 0; font: var(--type-body); font-size: 18px; line-height: 1.5; color: var(--text); }
      :scope .es3-facts { margin: 0; font: var(--type-caption); color: var(--muted); }
      :scope .es3-end { max-width: 62ch; display: grid; gap: 6px; }
      :scope .es3-out { margin: 0; font: var(--type-section-title); color: var(--text); }
      :scope .es3-still { max-width: 62ch; }
      :scope .es3-hero .es3-end { margin-top: 0; }

      :scope .ss-page[data-layout="ia"] .es3-hero, :scope .ss-page[data-element="game"] .es3-hero { display: grid; gap: 16px; }
      :scope .es3-line { margin: 0; font: var(--type-small); color: var(--muted); display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
      :scope .es3-rows { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
      :scope .es3-row { background: var(--ss-cell); border: 1px solid var(--ss-cell-line); position: relative; }
      :scope .es3-row summary { list-style: none; cursor: pointer; display: grid; grid-template-columns: 24px 48px 34px minmax(0, 1fr); align-items: center; gap: 8px; min-height: 48px; padding: 0 12px; font: var(--type-small); }
      :scope .es3-row summary::-webkit-details-marker { display: none; }
      :scope .es3-row summary:focus-visible { outline: 2px solid var(--text); outline-offset: 2px; }
      :scope .es3-min { color: var(--muted); font-variant-numeric: tabular-nums; white-space: nowrap; }
      :scope .es3-pips .es-sqp { color: var(--text); }
      :scope .es3-pips .es-sqp i { width: 6px; height: 6px; }
      :scope .es3-clause { min-width: 0; color: var(--text); display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; line-height: 1.25; padding: 6px 0; }
      :scope .es3-more { display: grid; gap: 6px; padding: 0 12px 12px 12px; border-top: 1px solid var(--ss-line); padding-top: 10px; }
      :scope .es3-more .es3-quote { font-size: 16px; }
      :scope .es3-row .es-glyph { justify-self: center; }
      :scope .es3-row .es-gbody { fill: var(--text); } :scope .es3-row .es-gshackle { stroke: var(--text); }
      :scope .es3-row .es-glyph[data-state="open"] .es-gbody { fill: var(--cover-green); } :scope .es3-row .es-glyph[data-state="open"] .es-gshackle { stroke: var(--cover-green); }
      /* Between: the cover's door and knob */
      :scope .es3-band { position: absolute; left: 0; top: 0; bottom: 0; width: 12px; background: var(--cover-teal); }
      :scope .es3-band i { position: absolute; right: 1px; top: 56%; width: 8px; height: 8px; box-sizing: border-box; border: 1.5px solid var(--cover-amber); }
      :scope .es3-band i[data-state="open"] { background: var(--cover-amber); }
      :scope .es3-band i[data-state="forced"]::after { content: ''; position: absolute; left: -3px; top: 2.2px; width: 12px; height: 2px; background: var(--cover-orange); transform: rotate(-45deg); }
      :scope .es3-banded summary { padding-left: 24px; }
      :scope .ss-page[data-element="between"] .es3-quote { position: relative; }
      :scope .ss-page[data-element="between"] .es3-quote { border-left: 0; padding: 4px 0 4px 28px; }
      :scope .ss-page[data-element="between"] .es3-more .es3-quote { padding-left: 0; }
      /* Game: the quotation as a flat paper note, a small amber pin square at its head */
      :scope .es3-note { position: relative; margin: 6px 0 0; padding: 18px 14px 14px; display: grid; grid-template-columns: 14px minmax(0, 1fr); gap: 10px; align-items: start; background: var(--cover-cream); color: var(--cover-bg-indigo); font: var(--type-body); font-size: 17px; line-height: 1.45; font-style: italic; transform: rotate(-.5deg); }
      :scope .es3-flow > .es3-lock:nth-of-type(even) .es3-note { transform: rotate(.6deg); }
      :scope .es3-note .es-gbody { fill: var(--cover-bg-indigo); } :scope .es3-note .es-gshackle { stroke: var(--cover-bg-indigo); }
      :scope .es3-note .es-glyph[data-state="open"] .es-gbody { fill: #1f7a4d; } :scope .es3-note .es-glyph[data-state="open"] .es-gshackle { stroke: #1f7a4d; }
      :scope .es3-pin { position: absolute; left: 50%; top: 5px; width: 8px; height: 8px; margin-left: -4px; background: var(--cover-amber); }
      @container ss (min-width: 680px) {
        :scope .es3-story { font-size: 20px; }
        :scope .es3-quote { font-size: 20px; }
        :scope .es3-forced { font-size: 20px; }
      }
    `,
  });
})();
