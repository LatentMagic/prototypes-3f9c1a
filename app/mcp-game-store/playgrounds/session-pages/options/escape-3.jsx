// Session page, Escape, option 3: "What each lock gave you". The room's story told by what each lock held, in the order they opened.
// Reads the play model from escape-1.jsx (window.EsModel), which loads first.
(function () {
  // S: the room's story paragraph is content (locks and story ship in the room's file, not on the session record). Seeded for the Clockmaker's Study.
  const STORY = { "The Clockmaker's Study": 'Ezra Vale, the clockmaker, has not been seen for a week. You let yourself into his study to look for him, and the door locks behind you.' };

    const OptionThree = ({ gid, session, sid, share, api }) => {
    const m = React.useMemo(() => EsModel.build(session), [session]);
    const out = m.out;
    const stats = m.done ? [
      { label: 'Time', value: m.min + ' min' }, { label: 'Par', value: m.par + ' min' },
      { label: 'Hints', value: m.hintCount ? String(m.hintCount) : 'None' }, { label: 'Wrong tries', value: String(m.wrong) }] : null;
    const sub = m.done && m.forced ? EsModel.plural(m.forced, 'lock forced', 'locks forced') : null;
    const say = m.openCount ? EsModel.plural(m.openCount, 'lock', 'locks') + ' open.' : 'No lock open yet.';
    const story = STORY[out.label];
    const cards = [];
    m.locks.forEach((lk, i) => {
      if (i) cards.push(<p key={'b' + i} className="es3-between">{lk.between === 0 ? 'Straight on' : EsModel.plural(lk.between, 'move', 'moves') + ' between'}</p>);
      cards.push(lk.exit
        ? (
          <Ss.Card key={lk.key} className="es3-card es3-door" kicker={'Move ' + lk.openedN + ' · ' + lk.name} title="You got out">
            <p className="es3-body">{EsModel.lockFacts(lk) + ' · ' + m.min + ' min against par ' + m.par}</p>
          </Ss.Card>)
        : (
          <Ss.Card key={lk.key} className="es3-card" kicker={'Move ' + lk.openedN + ' · ' + lk.name}>
            <p className="es3-body">{EsModel.sentences(lk.contents, 2)}</p>
            <p className="es3-facts">{EsModel.lockFacts(lk)}{lk.gave ? ' · gave you the ' + lk.gave.toLowerCase() : ''}</p>
          </Ss.Card>));
    });
    return (
      <Ss.Page gid={gid}>
        <Ss.Head gid={gid} art="escape" label={out.label} date={session.date} h1={out.h1} mark="" stats={stats} sub={sub} />
        <div className="ss-body">
          <section className="ss-hero ss-surface" aria-label="What each lock gave you">
            {story ? <p className="es3-story">{story}</p> : null}
            <div className="es3-flow">
              {cards.length ? cards : <p className="es3-between">No lock open yet.</p>}
              {m.done ? null : <p className="es3-between">Still inside.</p>}
            </div>
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
    name: 'What each lock gave you',
    stance: 'The room’s story is told by what its locks held, so show each opening as a moment: what it said, what it took, and how many moves came between.',
    cost: 'Needs the engine to send each opened lock’s contents as its own field (today they sit inside the move line, beside the typed answer), the room’s story and tries per lock; the seed reads the story from content. A card can carry the next lock’s clue, so a screenshot of this page spoils the room.',
    Component: OptionThree,
    shareText: (session) => window.SsOutcome.escape(session).lines,
    css: `
      :scope .es3-story { margin: 0; font: var(--type-body); color: var(--muted); max-width: 62ch; padding-bottom: 12px; border-bottom: 1px solid var(--ss-line); }
      :scope .es3-flow { display: grid; gap: 0; max-width: 680px; }
      :scope .es3-card { background: var(--ss-cell); border: 1px solid var(--ss-cell-line); box-shadow: none; padding: 16px; gap: 8px; }
      :scope .es3-body { margin: 0; font: var(--type-body); }
      :scope .es3-facts { margin: 0; font: var(--type-caption); color: var(--muted); }
      :scope .es3-between { margin: 0; padding: 10px 0 10px 16px; font: var(--type-caption); color: var(--muted); border-left: 2px solid var(--ss-cell-line); margin-left: 12px; }
      :scope .es3-door { border-left: 6px solid var(--ss-mark-1); }
      :scope .es3-door .ss-card-title { font: var(--type-section-title); }
    `,
  });
})();
