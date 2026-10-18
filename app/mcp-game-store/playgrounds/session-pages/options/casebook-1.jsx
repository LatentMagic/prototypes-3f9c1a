// Session page, Casebook, option 1: "Sixteen turns to dawn". The night is the clock: sixteen cells running out to dawn.
// Casebook's Today is canon's own record page (CbCase), so a Casebook option receives the case record (cbWeek / PG_CB_LOST), not a GS_SESSIONS entry. The reader (PgCb) is in casebook-model.jsx.
// Spoilers: only turns the player took. The culprit is in the case file, not the log, so no page here can name it; the accused suspect is the player's own accusation.
(function () {
  // ---------- Option 1 ----------
  const LETTER = { search: 'S', question: 'Q', show: 'E' };
  const cellOf = (t) => ({ t: LETTER[t.kind], sub: String(t.n),
    k: t.result === 'lie' || t.result === 'found' ? 'mark1' : t.result === 'asked' ? 'plain' : 'filled' });

  const Group = ({ turns, from }) => {
    const slice = [];
    for (let i = from; i < from + 8; i++) slice.push(turns[i] ? cellOf(turns[i]) : { t: '', k: 'empty' });
    const label = 'Turns ' + (from + 1) + ' to ' + (from + 8) + ': ' + turns.slice(from, from + 8).map((t) => t.n + ' ' + (t.kind === 'search' ? 'searched ' + t.short : t.kind === 'question' ? 'asked ' + t.short : 'showed evidence to ' + t.short) + (t.result === 'lie' ? ', lie exposed' : t.result === 'stood' ? ', story stood' : t.result === 'found' ? ', found something' : t.result === 'nothing' ? ', found nothing' : '')).join('; ');
    return (
      <div className="cb1-group">
        <Ss.Cells rows={[slice]} cols={8} label={label || 'No turns taken in this row'} />
        <div className="cb1-who" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <span key={i}>{turns[from + i] ? turns[from + i].short : ''}</span>)}</div>
      </div>
    );
  };

  const CaseOne = ({ gid, session, sid, share, api }) => {
    const c = session, P = window.PgCb, d = P.parse(c), out = Ss.useOutcome('casebook', c), H = P.caseHead(c);
    const live = !!c.live, used = d.used, spare = 16 - used, dawn = live && used >= 16;
    const say = dawn ? 'Dawn has come. Only the accusation is left.' : spare + (spare === 1 ? ' turn' : ' turns') + ' until dawn.';
    const col = used > 8 && used < 16 ? used - 8 : 0;
    const spareText = dawn ? '' : live ? spare + (spare === 1 ? ' turn left' : ' turns left') : spare > 0 ? spare + (spare === 1 ? ' turn to spare' : ' turns to spare') : 'Every turn used';
    const kinds = [P.plural(d.counts.search, 'search', 'searches'), P.plural(d.counts.question, 'question', 'questions'), d.counts.show + ' shown'].join(' · ');
    return (
      <Ss.Page gid={gid}>
        <Ss.Head gid={gid} art="casebook" label={H.label} date={H.date} h1={out.h1} mark={out.mark} stats={out.stats} />
        <div className="ss-body">
          <section className="ss-hero ss-surface cb1-hero" aria-label="Your sixteen turns">
            <div className="cb1-strip">
              <Group turns={d.turns} from={0} />
              <Group turns={d.turns} from={8} />
              <div className="cb1-foot" aria-hidden="false">
                <span className="cb1-spare" style={{ '--col': col }}>{spareText}</span>
                <span className="cb1-dawn">Dawn</span>
              </div>
            </div>
            <p className="ss-caption cb1-kinds">{kinds}</p>
            {(d.acc || dawn) && (
              <div className="cb1-acc">
                <Ss.Cells rows={[[d.acc ? { t: 'A', k: 'filled' } : { t: 'A', k: 'empty' }]]} cols={1} label={d.acc ? 'The accusation' : 'The accusation, not yet made'} />
                <div className="cb1-acc-text">
                  <span className="cb1-acc-name">{d.acc ? 'You accused ' + d.acc.who : 'Only the accusation is left.'}</span>
                  {d.acc ? <span className="ss-tag" data-tone={d.acc.right ? 'success' : 'error'}>{d.acc.right ? 'Right' : 'Wrong'}</span> : null}
                </div>
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

  pgOption('casebook', 1, {
    name: 'Sixteen turns to dawn',
    stance: 'The night is the clock, so show the sixteen turns as sixteen cells running out to dawn, with the lies and the finds filled and the turns you saved left empty.',
    cost: 'Needs the engine to send each turn’s kind, target and result (today only words in the record lines; the seed parses them), and built on the shared page, so it replaces the held grouped-by-kind page; it shows only turns taken and never the culprit.',
    Component: CaseOne,
    shareText: (session) => window.SsOutcome.casebook(session).lines,
    css: `
      :scope .cb1-hero { gap: 14px; }
      :scope .cb1-strip { --cb1c: min(64px, calc((100cqi - 32px - 34px - 42px) / 8)); display: grid; gap: 6px; min-width: 0; }
      :scope .cb1-group { display: grid; gap: 4px; }
      :scope .cb1-group .ss-cells { --c: var(--cb1c); }
      :scope .cb1-group .ss-cell { font-size: calc(var(--c) * .36); padding-bottom: calc(var(--c) * .2); }
      :scope .cb1-group .ss-cell-sub { font-size: calc(var(--c) * .26); bottom: calc(var(--c) * .06); }
      :scope .cb1-group .ss-cell[data-k="plain"] { color: var(--text); }
      :scope .cb1-group .ss-cell[data-k="mark1"] .ss-cell-sub { opacity: .75; }
      :scope .cb1-who { display: none; }
      :scope .cb1-foot { width: calc(8 * var(--cb1c) + 42px); max-width: 100%; display: flex; justify-content: space-between; align-items: baseline; gap: 12px; font: var(--type-caption); color: var(--muted); }
      :scope .cb1-spare { margin-left: calc(var(--col, 0) * (var(--cb1c) + 6px)); color: var(--text); }
      :scope .cb1-dawn { text-transform: uppercase; letter-spacing: .08em; font: var(--type-label); color: var(--muted); }
      :scope .cb1-kinds { margin: 0; }
      :scope .cb1-acc { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 12px; align-items: center; padding-top: 12px; border-top: 1px solid var(--ss-line); }
      :scope .cb1-acc .ss-cells { --c: 44px; }
      :scope .cb1-acc-text { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 12px; min-width: 0; }
      :scope .cb1-acc-name { font: var(--type-card-title); letter-spacing: var(--tracking-heading); }
      @container ss (min-width: 680px) {
        :scope .cb1-strip { --cb1c: min(64px, calc((100cqi - 48px - 34px - 42px) / 8)); gap: 10px; }
        :scope .cb1-who { display: grid; grid-template-columns: repeat(8, var(--cb1c)); gap: 6px; font: var(--type-caption); color: var(--muted); text-align: center; }
        :scope .cb1-who span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        :scope .cb1-foot { font: var(--type-body); }
        :scope .cb1-acc .ss-cells { --c: 52px; }
      }
      @container ss (min-width: 960px) {
        :scope .cb1-strip { --cb1c: min(64px, calc(((100cqi - 48px - 36px) * 2 / 3 - 34px - 42px) / 8)); }
      }
    `,
  });
})();
