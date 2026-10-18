// Session page, Escape, option 3: "The room, told". The play as a short story in text: the room's story, then each lock's contents as a quotation,
// the moves between them as a rule, and the way out at the end. No tiles and no cards in the hero (fix round 1, Fable): option 2 is the grid, this is the prose.
// Reads the play model from escape-model.jsx (window.EsModel), which loads first.
(function () {
  const Told = ({ m, story }) => {
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
            ? <blockquote className="es3-quote">{quoted}</blockquote>
            : <p className="es3-forced">{'Forced open with ' + (lk.forced || 'a hint') + '.'}</p>}
          <p className="es3-facts">{EsModel.lockFacts(lk)}{lk.gave ? ' · gave you the ' + lk.gave.toLowerCase() : ''}</p>
        </section>);
    });
    if (!first) parts.push(rule('No lock open yet', 'none'));
    return <div className="es3-flow">{story ? <p className="es3-story">{story}</p> : null}{parts}</div>;
  };

  const OptionThree = ({ gid, session, sid, share, api }) => {
    const m = React.useMemo(() => EsModel.build(session), [session]);
    const out = m.out;
    const sub = m.done && m.forced ? EsModel.plural(m.forced, 'lock forced', 'locks forced') : null;
    const say = m.openCount ? EsModel.plural(m.openCount, 'lock', 'locks') + ' open.' : 'No lock open yet.';
    const story = EsModel.storyOf(session, out);
    const exit = m.done ? m.exitLock : null;
    return (
      <Ss.Page gid={gid}>
        <Ss.Head gid={gid} art="escape" label={out.label} date={session.date} h1={out.h1} mark="" stats={out.stats} sub={sub} />
        <div className="ss-body">
          <section className="ss-hero es3-hero" aria-label="The room, told">
            <Told m={m} story={story} />
            {exit ? (
              <div className="es3-end">
                <p className="es3-out">You got out.</p>
                <p className="es3-facts">{exit.name + ' · move ' + exit.openedN + ' · ' + EsModel.lockFacts(exit)}</p>
              </div>
            ) : m.done ? null : <p className="es3-rule es3-still"><span>{m.ended ? 'You left before the door opened' : 'Still inside'}</span></p>}
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
    stance: 'Tell the play as a short story in text, not tiles: the room’s story, each lock’s contents as a quotation, the moves between as a rule, and the way out last.',
    cost: 'Needs the engine to send the room’s story and each opened lock’s contents as its own field (today they sit inside the move line, beside the typed answer), and tries per lock; the seed reads the story from content. A quotation can carry the next lock’s clue, so a screenshot of this page spoils the room.',
    Component: OptionThree,
    shareText: (session) => window.SsOutcome.escape(session).lines,
    css: `
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
      @container ss (min-width: 680px) {
        :scope .es3-story { font-size: 20px; }
        :scope .es3-quote { font-size: 20px; }
        :scope .es3-forced { font-size: 20px; }
      }
    `,
  });
})();
