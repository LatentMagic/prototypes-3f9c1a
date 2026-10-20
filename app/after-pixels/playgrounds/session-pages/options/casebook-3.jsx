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

  // ---------- IA pass: one hero quote, one tapped-open row per other lie, the accusation up under the head ----------
  const fourWords = (t) => (t.lie ? t.lie.gave.split(/\s+/).slice(0, 4).join(' ').replace(/[.,;:]$/, '') + '…' : 'A lie, exposed');
  const Quote = ({ t }) => (t.lie ? (
    <div className="cb3i-quote"><p className="cb3i-said">“{t.lie.said}”</p><p className="cb3i-gave"><span className="cb3-gave-k">It gave away</span> {t.lie.gave}</p></div>
  ) : null);
  const LieRow = ({ t }) => {
    const [open, setOpen] = React.useState(false);
    const id = 'cb3i-' + t.n;
    return (
      <li className="cb3i-row">
        <button type="button" className="cb3i-rowbtn" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)} disabled={!t.lie}>
          <span className="cb3i-who">{t.short}</span>
          <span className="cb3i-chip">{t.evidence}</span>
          <span className="cb3i-gist">{fourWords(t)}</span>
          {t.lie ? <span className="cb3i-caret" aria-hidden="true">{open ? '−' : '+'}</span> : null}
        </button>
        {open && t.lie ? <div id={id}><Quote t={t} /></div> : null}
      </li>
    );
  };
  const StoodRow = ({ t }) => (
    <li className="cb3i-row"><div className="cb3i-rowbtn" role="presentation"><span className="cb3i-who">{t.short}</span><span className="cb3i-chip">{t.evidence}</span><span className="cb3i-gist">Their story stood</span></div></li>
  );
  const HeroLie = ({ t }) => {
    const [open, setOpen] = React.useState(false);
    return (
      <Ss.Card className="cb3-card cb3i-hero" kicker={'Last lie you broke · turn ' + t.n + ' · ' + t.who} title={t.lie ? '“' + t.lie.said + '”' : 'A lie, exposed'} facts={['You showed: ' + t.evidence]}>
        {t.lie ? <button type="button" className="cb3i-more" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Hide what it gave away' : 'What it gave away'}</button> : null}
        {open && t.lie ? <p className="cb3-gave">{t.lie.gave}</p> : null}
      </Ss.Card>
    );
  };
  const CaseThreeIA = ({ gid, session, sid, share, api }) => {
    const c = session, P = window.PgCb, d = P.parse(c), out = Ss.useOutcome('casebook', c), H = P.caseHead(c);
    const live = !!c.live, dawn = live && d.used >= 16;
    const say = dawn ? 'Dawn has come. Only the accusation is left.' : (16 - d.used) + ' turns until dawn.';
    const accTag = d.acc ? { text: d.acc.right ? 'Right' : 'Wrong', tone: d.acc.right ? 'success' : 'error' } : null;
    const hero = d.lies.length ? d.lies[d.lies.length - 1] : null;
    const rest = hero ? d.lies.filter((t) => t !== hero) : [];
    const stoodN = d.lies.length ? d.stood.length : 0;
    return (
      <Ss.Page gid={gid}>
        <Ss.Head gid={gid} art="casebook" label={H.label} date={H.date} h1={out.h1} mark={out.mark} stats={out.stats} />
        <div className="ss-body">
          <section className="ss-hero ss-surface cb3-hero cb3i" aria-label="The lies you broke">
            {d.acc ? <Ss.Card className="cb3-card cb3-acc" kicker="The accusation" tag={accTag} title={'You accused ' + d.acc.who} /> : null}
            {dawn ? <Ss.Card className="cb3-card cb3-acc" kicker="Dawn" title="Only the accusation is left." /> : null}
            {hero ? <HeroLie t={hero} /> : <p className="cb3-none">{live ? 'No lie caught yet.' : 'You didn’t catch a lie this time.'}</p>}
            {rest.length ? <ul className="cb3i-rows" aria-label="The other lies you broke">{rest.map((t) => <LieRow key={t.n} t={t} />)}</ul> : null}
            {!hero && d.stood.length ? <ul className="cb3i-rows" aria-label="Stories that stood">{d.stood.map((t) => <StoodRow key={t.n} t={t} />)}</ul> : null}
            {stoodN ? <p className="ss-caption cb3i-stood">{stoodN === 1 ? '1 other story stood' : stoodN + ' other stories stood'}</p> : null}
          </section>
          <aside className="ss-side">
            <Ss.ShareCard status={live ? 'live' : 'done'} say={say} lines={share.lines} gid={gid} session={P.cardSession(c)} sid={sid} api={api} />
          </aside>
        </div>
        <Ss.Record title="Every turn" lines={P.caseLines(c)} />
      </Ss.Page>
    );
  };

  const CaseThree = ({ gid, session, sid, share, api, layout, element }) => {
    if (layout === 'ia') return <CaseThreeIA gid={gid} session={session} sid={sid} share={share} api={api} />;
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
    layouts: ['built', 'ia'],
    name: 'The lies you broke',
    stance: 'Catching a lie is the one moment that feels like winning, so replay each one as the suspect’s own words, the evidence you showed, and what it gave away.',
    cost: 'Needs the engine to send each lie’s statement, the evidence shown and the revelation (the events carry the revelation; the statement comes from the case file; the seed holds Gull Point’s), text-heavy on a phone, and it replaces the held page; it shows only lies the player exposed and never the culprit. IA pass: the accusation moves up under the head, the last lie exposed is the one hero quote (the record does not say which lie unlocked the accusation, so it is the latest), and every other lie is one row (suspect, the evidence shown as a chip, the first four words of what it gave away) that opens on a tap to the quote and the reveal; no element stops (the torn statement page is not specified yet).',
    Component: CaseThree,
    shareText: (session) => window.SsOutcome.casebook(session).lines,
    css: `
      :scope .cb3-grid { display: grid; gap: 12px; }
      :scope .cb3i { gap: 12px; }
      :scope .cb3i-hero .ss-card-title { font-weight: 500; }
      :scope .cb3i-more { justify-self: start; min-height: 44px; padding: 0; background: none; border: 0; color: var(--text); font: var(--type-label); text-decoration: underline; cursor: pointer; }
      :scope .cb3i-rows { list-style: none; margin: 0; padding: 0; display: grid; }
      :scope .cb3i-row { border-top: 1px solid var(--ss-line); min-width: 0; }
      :scope .cb3i-rowbtn { display: grid; grid-template-columns: auto auto minmax(0, 1fr) auto; align-items: center; gap: 8px 10px; width: 100%; min-height: 48px; padding: 6px 0; background: none; border: 0; color: var(--text); font: var(--type-body); text-align: left; cursor: pointer; }
      :scope .cb3i-rowbtn:disabled { cursor: default; color: var(--text); opacity: 1; }
      :scope .cb3i-who { font: var(--type-label); }
      :scope .cb3i-chip { justify-self: start; display: inline-flex; align-items: center; min-height: 24px; max-width: 100%; padding: 0 8px; font: var(--type-small); background: color-mix(in srgb, var(--text) 14%, var(--page)); color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      :scope .cb3i-gist { color: var(--muted); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      :scope .cb3i-caret { font: var(--type-label); }
      :scope .cb3i-quote { display: grid; gap: 8px; padding: 0 0 12px; }
      :scope .cb3i-said, :scope .cb3i-gave { margin: 0; font: var(--type-body); }
      :scope .cb3i-gave { color: var(--muted); }
      :scope .cb3i-stood { margin: 0; }
      @media (max-width: 479px) { :scope .cb3i-rowbtn { grid-template-columns: auto minmax(0, 1fr) auto; } :scope .cb3i-gist { grid-column: 1 / -1; order: 4; white-space: normal; } }
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
