// Session page, Casebook, option 2: "Who you pinned it on". The accused card is the hero (build-rulings 3, fable-steer): the suspect you named, large, Right or Wrong beside the name.
// The other suspects follow as smaller cards; the places searched are in the Record (fix round 1: not a card of their own). Reads the case record through PgCb (casebook-model.jsx).
// Spoilers: nothing says who did it. A suspect is never marked cleared (on a wrong accusation that would be the answer); no place is listed beyond the Record.
(function () {
  const lieLine = (s) => {
    const l = s.lies.length, st = s.stood, P = window.PgCb;
    if (!l && !st) return 'No lies exposed';
    // "about the alibi" only when the seed knows the topic of every lie exposed here (Gull Point); another case just says how many.
    const about = l && s.lieTopic ? (l === 1 ? ', about the ' + s.lieTopic : l === 2 ? ', both about the ' + s.lieTopic : ', all about the ' + s.lieTopic) : '';
    const lies = l ? P.plural(l, 'lie', 'lies') + ' exposed' + about : 'No lies exposed';
    return lies + (st ? ' · ' + st + (st === 1 ? ' story' : ' stories') + ' stood' : '');
  };
  const askedLine = (s) => {
    if (!s.asked.length) return 'Not asked anything';
    const t = s.asked.slice(0, 2).join(' and ');
    return 'Asked about ' + t + (s.asked.length > 2 ? ' and ' + (s.asked.length - 2) + ' more' : '');
  };

  const Suspect = ({ s, live, acc }) => {
    const P = window.PgCb;
    if (!s.spent) return <Ss.Card className="cb2-card" kicker={s.role || undefined} title={s.name} facts={['Not questioned yet.']} />;
    return <Ss.Card className="cb2-card" kicker={s.role || undefined} title={s.name} facts={[lieLine(s), askedLine(s), P.plural(s.spent, 'turn', 'turns') + ' spent here']} />;
  };

  const Accused = ({ s, acc }) => {
    const P = window.PgCb;
    const tag = <span className="ss-tag" data-tone={acc.right ? 'success' : 'error'}>{acc.right ? 'Right' : 'Wrong'}</span>;
    const title = <span className="cb2-name"><span>{s.name}</span>{tag}</span>;
    return (
      <Ss.Card className="cb2-card cb2-accused" kicker="You accused" title={title}
        facts={[s.role, s.spent ? lieLine(s) : 'Not questioned before the accusation', s.spent ? askedLine(s) + ' · ' + P.plural(s.spent, 'turn', 'turns') : 'No turns spent here']} />
    );
  };

  const CaseTwo = ({ gid, session, sid, share, api }) => {
    const c = session, P = window.PgCb, d = P.parse(c), out = Ss.useOutcome('casebook', c), H = P.caseHead(c);
    const live = !!c.live, dawn = live && d.used >= 16;
    const accused = d.suspects.find((s) => s.accused);
    const others = d.suspects.filter((s) => !s.accused);
    const say = dawn ? 'Dawn has come. Only the accusation is left.' : (16 - d.used) + ' turns until dawn.';
    return (
      <Ss.Page gid={gid}>
        <Ss.Head gid={gid} art="casebook" label={H.label} date={H.date} h1={out.h1} mark={out.mark} stats={out.stats} />
        <div className="ss-body">
          <section className="ss-hero ss-surface cb2-hero" aria-label="The suspects">
            {accused ? <Accused s={accused} acc={d.acc} /> : null}
            <div className="cb2-others">
              {others.map((s) => <Suspect key={s.name} s={s} live={live} />)}
            </div>
            {dawn ? <p className="ss-caption cb2-note">Only the accusation is left.</p> : null}
          </section>
          <aside className="ss-side">
            <Ss.ShareCard status={live ? 'live' : 'done'} say={say} lines={share.lines} gid={gid} session={P.cardSession(c)} sid={sid} api={api} />
          </aside>
        </div>
        <Ss.Record title="Every turn" lines={P.caseLines(c)} />
      </Ss.Page>
    );
  };

  pgOption('casebook', 2, {
    name: 'Who you pinned it on',
    stance: 'An interrogation ends in a name, so set the suspect you accused large with Right or Wrong beside it, and give the others smaller cards beneath; the places searched stay in the Record.',
    cost: 'Needs the engine to send per-suspect turns and the suspects’ roles from the case file (today the record has them only as words; the seed holds Gull Point’s roles, and another case shows none), and cards must wrap when a later case has more than three suspects; replaces the held page, shows the accusation only as the player made it and never marks anyone cleared.',
    Component: CaseTwo,
    shareText: (session) => window.SsOutcome.casebook(session).lines,
    css: `
      :scope .cb2-hero { gap: 12px; }
      :scope .cb2-card.ss-card { background: color-mix(in srgb, var(--text) 5%, var(--ss-card)); box-shadow: none; }
      :scope .cb2-accused.ss-card { border: 2px solid var(--ss-mark-1); padding: 20px 16px; gap: 14px; }
      :scope .cb2-accused .ss-kicker { text-transform: uppercase; letter-spacing: .08em; }
      :scope .cb2-accused .ss-card-title { font: var(--type-section-title); letter-spacing: var(--tracking-heading); }
      :scope .cb2-name { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; }
      :scope .cb2-name .ss-tag { font: var(--type-small); letter-spacing: 0; }
      :scope .cb2-accused .ss-card-facts li:first-child { color: var(--muted); }
      :scope .cb2-others { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); }
      :scope .cb2-note { margin: 0; }
      @container ss (min-width: 680px) {
        :scope .cb2-hero { gap: 16px; padding: 20px; }
      }
    `,
  });
})();
