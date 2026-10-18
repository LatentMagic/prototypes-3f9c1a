// Session page, Casebook, option 1: "Sixteen turns to dawn". The night is the clock: sixteen cells running out to dawn.
// Casebook's Today is canon's own record page (CbCase), so a Casebook option receives the case record (cbWeek / PG_CB_LOST), not a GS_SESSIONS entry.
// This file also holds PgCb, the small reader of the case record that options 2 and 3 use too (Babel scripts share one global scope; every option file is loaded before any renders).
// Spoilers: only turns the player took. The culprit is in the case file, not the log, so no page here can name it; the accused suspect is the player's own accusation.
(function () {
  // ---------- PgCb: the case record -> what the engine would send (events), from Gull Point's content ----------
  const PLACE_SHORT = { 'the hotel bar': 'Bar', 'the harbour noticeboard': 'Harbour', 'the lighthouse stairs': 'Stairs', 'Pike’s office': 'Office' };
  const PLACES = ['The lighthouse stairs', 'Pike’s office', 'The hotel bar', 'The harbour noticeboard'];   // content `locations` (S)
  const SUSP = {
    'Maeve Doyle': { first: 'Maeve', role: 'Hotel manager' },
    'Tobias Pike': { first: 'Tobias', role: 'The victim’s nephew and heir' },
    'Dr. Celia Rourke': { first: 'Celia', role: 'The victim’s former business partner' },
  };
  // The lies a player can break, keyed by suspect + the evidence shown (content `suspects[].lies`: topic, brokenBy, revelation; `statements.alibi` is what they said).
  // `gave` is a verbatim run of the lie's revelation. All four lies are on the topic "alibi".
  const LIES = {
    'Maeve Doyle|the bar ledger': { topic: 'alibi', said: 'I was in my office behind reception all evening, doing the accounts. I didn’t leave it until I heard the shouting.',
      gave: 'I was in the bar. He told me at supper I was finished here, after twenty years, and I wanted a drink, and then another.' },
    'Tobias Pike|the ferry notice': { topic: 'alibi', said: 'I wasn’t even here, old thing. I took the nine o’clock ferry to the mainland and only heard this morning.',
      gave: 'There was no ferry. I’ve been hiding in room twelve since the afternoon: a man from the mainland is looking for me about a debt.' },
    'Dr. Celia Rourke|a green silk scarf': { topic: 'alibi', said: 'After dinner I went to the library and read until the commotion. I never went near the east wing.',
      gave: 'I went up to the lighthouse room at ten to speak to Harlan about the hotel. Five minutes, no more.' },
    'Dr. Celia Rourke|what tobias heard': { topic: 'alibi', said: 'He was alive when I left, and I was back in the library by a quarter past.',
      gave: 'I went back up. He had forged my name on that deed, and he laughed about it.' },
  };
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const plural = (n, a, b) => n + ' ' + (n === 1 ? a : b);

  // c = the case record (cbMake): rec[{c, act, what, out}], cast, verdict, live, total.
  function parse(c) {
    const turns = (c.rec || []).filter((r) => r.c !== 'A').map((r, i) => {
      const t = { n: i + 1, code: r.c, out: r.out || '' };
      let m;
      if (r.act === 'Search' && (m = /^Searched (.+)$/.exec(r.what))) {
        t.kind = 'search'; t.place = cap(m[1]); t.short = PLACE_SHORT[m[1]] || cap(m[1]).split(' ').pop();
        t.found = r.c === 'F' ? r.out.replace(/^Found /, '').split(', ') : []; t.result = r.c === 'F' ? 'found' : 'nothing';
      } else if (r.act === 'Question' && (m = /^Asked (.+?) about (.+)$/.exec(r.what))) {
        t.kind = 'question'; t.who = m[1]; t.topic = m[2]; t.result = 'asked';
      } else if (r.act === 'Show evidence' && (m = /^Showed (.+?) to (.+)$/.exec(r.what))) {
        t.kind = 'show'; t.evidence = cap(m[1]); t.who = m[2]; t.result = r.c === 'B' ? 'lie' : 'stood';
        if (r.c === 'B') t.lie = LIES[m[2] + '|' + m[1].toLowerCase()] || null;
      } else { t.kind = 'question'; t.who = ''; t.result = 'asked'; }
      t.short = t.short || (t.who && SUSP[t.who] ? SUSP[t.who].first : '');
      return t;
    });
    const a = (c.rec || []).find((r) => r.c === 'A');
    const acc = a ? { who: a.what, right: a.out === 'Right' } : null;
    const cast = (c.cast && c.cast.length ? c.cast : Object.keys(SUSP));
    const suspects = cast.map((name) => {
      const mine = turns.filter((t) => t.who === name);
      return { name: name, first: (SUSP[name] || {}).first || name, role: (SUSP[name] || {}).role || '', turns: mine,
        lies: mine.filter((t) => t.result === 'lie'), stood: mine.filter((t) => t.result === 'stood').length,
        asked: mine.filter((t) => t.kind === 'question').map((t) => t.topic), spent: mine.length, accused: !!acc && acc.who === name };
    });
    const searched = turns.filter((t) => t.kind === 'search');
    return { turns: turns, used: turns.length, acc: acc, suspects: suspects, searched: searched, placesTotal: PLACES.length,
      lies: turns.filter((t) => t.result === 'lie'), stood: turns.filter((t) => t.result === 'stood'),
      counts: { search: searched.length, question: turns.filter((t) => t.kind === 'question').length, show: turns.filter((t) => t.kind === 'show').length } };
  }
  const caseHead = (c) => ({ date: (window.GS_SESSIONS && window.GS_SESSIONS.casebook && window.GS_SESSIONS.casebook.date) || 'Monday 5 October', label: 'Casebook · ' + c.title });
  const caseLines = (c) => (window.gsCbLines ? window.gsCbLines(c.rec) : []);
  const cardSession = (c) => Object.assign({}, c, { game: window.GS_NAME ? window.GS_NAME.casebook : 'Casebook' });
  window.PgCb = { parse: parse, caseHead: caseHead, caseLines: caseLines, cardSession: cardSession, PLACES: PLACES, plural: plural, cap: cap };

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
    const stats = [{ label: 'Turns', value: used + ' of 16' }, { label: 'Lies exposed', value: live ? String(d.lies.length) : d.lies.length + ' of ' + c.total }];
    const say = dawn ? 'Dawn has come. Only the accusation is left.' : spare + (spare === 1 ? ' turn' : ' turns') + ' until dawn.';
    const col = used > 8 && used < 16 ? used - 8 : 0;
    const spareText = dawn ? '' : live ? spare + (spare === 1 ? ' turn left' : ' turns left') : spare > 0 ? spare + (spare === 1 ? ' turn to spare' : ' turns to spare') : 'Every turn used';
    const kinds = [P.plural(d.counts.search, 'search', 'searches'), P.plural(d.counts.question, 'question', 'questions'), d.counts.show + ' shown'].join(' · ');
    return (
      <Ss.Page gid={gid}>
        <Ss.Head gid={gid} art="casebook" label={H.label} date={H.date} h1={out.h1} mark={out.mark} stats={stats} />
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
            <p className="ss-legend cb1-legend">S search · Q question · E evidence · filled: it paid off · outlined: it didn’t</p>
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
      :scope .cb1-legend, :scope .cb1-kinds { margin: 0; }
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
