// Session page, Casebook, option 3: "The lies you broke". Catching a lie is the moment that feels like winning, so replay each one: their words, what you showed, what it gave away.
// Three lines per card (fable-steer): the lie as a quotation, "You showed", "It gave away". The accusation card is last and the only card with a status tag.
// The reader (PgCb) is in casebook-model.jsx. Spoilers: only lies the player exposed, in the suspect's own words as the player heard them. Never the culprit, never an unexposed lie.
(function () {
  const Lie = ({ t }) => {
    const L = t.lie, P = window.PgCb;
    return (
      <Ss.Card className="cb3-card" kicker={'Turn ' + t.n + ' · ' + t.who} title={L ? '“' + L.said + '”' : 'A lie, exposed'}
        facts={['You showed: ' + t.evidence]}>
        {L ? <p className="cb3-gave"><span className="cb3-gave-k">It gave away</span> {L.gave}</p> : null}
      </Ss.Card>
    );
  };
  // Fallback when no lie was exposed: the confrontations where their story stood.
  const Stood = ({ t }) => (
    <Ss.Card className="cb3-card" kicker={'Turn ' + t.n + ' · ' + t.who} title="Their story stood" facts={['You showed: ' + t.evidence]} />
  );

  const CaseThree = ({ gid, session, sid, share, api }) => {
    const c = session, P = window.PgCb, d = P.parse(c), out = Ss.useOutcome('casebook', c), H = P.caseHead(c);
    const live = !!c.live, dawn = live && d.used >= 16;
    const say = dawn ? 'Dawn has come. Only the accusation is left.' : (16 - d.used) + ' turns until dawn.';
    const cards = d.lies.length ? d.lies : d.stood;
    const accTag = d.acc ? { text: d.acc.right ? 'Right' : 'Wrong', tone: d.acc.right ? 'success' : 'error' } : null;
    // On a loss the lies are few; the stories that stood get their own card (fix round 1), one fact per suspect whose story stood.
    const stoodFacts = d.suspects.filter((s) => s.stood).slice(0, 3).map((s) => s.name + ': ' + s.stood + (s.stood === 1 ? ' story stood' : ' stories stood'));
    const elsewhere = d.lies.length && d.stood.length ? <Ss.Card className="cb3-card cb3-else" kicker="Not caught" title={d.stood.length + (d.stood.length === 1 ? ' other story stood' : ' other stories stood')} facts={stoodFacts} /> : null;
    return (
      <Ss.Page gid={gid}>
        <Ss.Head gid={gid} art="casebook" label={H.label} date={H.date} h1={out.h1} mark={out.mark} stats={out.stats} />
        <div className="ss-body">
          <section className="ss-hero ss-surface cb3-hero" aria-label="The lies you broke">
            {cards.length ? (
              <div className="cb3-grid">
                {d.lies.length ? d.lies.map((t) => <Lie key={t.n} t={t} />) : d.stood.map((t) => <Stood key={t.n} t={t} />)}
                {elsewhere}
                {d.acc ? <Ss.Card className="cb3-card cb3-acc" kicker="The accusation" tag={accTag} title={'You accused ' + d.acc.who} /> : null}
                {dawn ? <Ss.Card className="cb3-card cb3-acc" kicker="Dawn" title="Only the accusation is left." /> : null}
              </div>
            ) : (
              <div className="cb3-grid">
                <p className="cb3-none">{live ? 'No lie caught yet.' : 'You didn’t catch a lie this time.'}</p>
                {d.acc ? <Ss.Card className="cb3-card cb3-acc" kicker="The accusation" tag={accTag} title={'You accused ' + d.acc.who} /> : null}
              </div>
            )}
          </section>
          <aside className="ss-side">
            <Ss.ShareCard status={live ? 'live' : 'done'} say={say} lines={share.lines} gid={gid} session={P.cardSession(c)} sid={sid} api={api} />
          </aside>
        </div>
        <Ss.Record title="Every turn" lines={P.caseLines(c)} />
      </Ss.Page>
    );
  };

  pgOption('casebook', 3, {
    name: 'The lies you broke',
    stance: 'Catching a lie is the one moment that feels like winning, so replay each one as the suspect’s own words, the evidence you showed, and what it gave away.',
    cost: 'Needs the engine to send each lie’s statement, the evidence shown and the revelation (the events carry the revelation; the statement comes from the case file; the seed holds Gull Point’s), text-heavy on a phone, and it replaces the held page; it shows only lies the player exposed and never the culprit.',
    Component: CaseThree,
    shareText: (session) => window.SsOutcome.casebook(session).lines,
    css: `
      :scope .cb3-grid { display: grid; gap: 12px; }
      :scope .cb3-card.ss-card { background: color-mix(in srgb, var(--text) 5%, var(--ss-card)); box-shadow: none; }
      :scope .cb3-card .ss-card-title { font-weight: 500; text-wrap: pretty; }
      :scope .cb3-card .ss-card-facts li { color: var(--ss-mark-1); font: var(--type-label); }
      :scope .cb3-gave { margin: 0; font: var(--type-body); color: var(--muted); }
      :scope .cb3-gave-k { color: var(--text); font: var(--type-label); }
      :scope .cb3-acc.ss-card { border: 2px solid var(--ss-mark-1); }
      :scope .cb3-acc .ss-card-title { font-weight: 600; }
      :scope .cb3-none { margin: 0; font: var(--type-card-title); }
      :scope .cb3-else .ss-card-title { font-weight: 500; }
      :scope .cb3-else .ss-card-facts li { color: var(--muted); font: var(--type-body); }
      @container ss (min-width: 680px) {
        :scope .cb3-hero { padding: 20px; gap: 16px; }
        :scope .cb3-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        :scope .cb3-acc, :scope .cb3-none { grid-column: 1 / -1; }
      }
    `,
  });
})();
