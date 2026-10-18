// Session page, Daily Mystery, option 1: "The case file". Also defines window.PgMystery, the one reader of a Mystery session that options 2 and 3 use.
// Shape: Ss.Page > Ss.Head, then .ss-body (Hero, then .ss-side with the Share card). No Record: the case file is the whole record (at most five rows).
(function () {
  // ---- PgMystery: reads a Mystery session into the parts the three options draw. ----
  // Deployed record (D): lines "Question N · text · Yes/No", "Hint · ...", "Accusation · suspect, with the weapon, in the room · Right/Wrong".
  // Not on the record yet (S): the setting and the victim (seed fields), and which accusation parts missed (seed field `wrong`).
  const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
  const PgMystery = {
    cap,
    read(s) {
      const lines = s.lines || [];
      let setting = s.setting, victim = s.victim;
      // The same edition is the same case: a play with no setting or victim of its own (the live seed) borrows them from the finished play of that number.
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
      return {
        setting: setting ? cap(setting) : null,
        victimName: victim ? (vi > -1 ? victim.slice(0, vi) : victim) : null,
        victimRole: victim && vi > -1 ? victim.slice(vi + 1).trim() : null,
        items, qs, hints, acc, verdict,
        asked: qs.length, hintCount: hints.length,
        right: verdict ? ['suspect', 'weapon', 'room'].filter((k) => verdict[k]).length : null,
      };
    },
    // The one line the live Share card says about the case still open.
    say(c) {
      const ql = 2 - c.asked, hl = 2 - c.hintCount;
      const q = ql === 0 ? 'No questions left' : ql + (ql === 1 ? ' question left' : ' questions left');
      return q + (hl === 2 ? '' : hl === 0 ? ', no hints left' : ', 1 hint left') + '.';
    },
    // Head stats: only what the h1 does not say (the h1 names no-hint wins; the others never carry counts).
    stats(out, c, status) {
      const hOut = status === 'done' && /no hints/i.test(out.h1);
      const row = [{ label: 'Questions', value: c.asked + ' of 2' }];
      if (!hOut) row.push({ label: 'Hints', value: c.hintCount ? c.hintCount + ' of 2' : 'None' });
      return row;
    },
    statusOf(s) { return s.unfinished ? 'ended' : s.live ? 'live' : 'done'; },
  };
  window.PgMystery = PgMystery;

  const Answer = ({ a }) => <span className={'m1-ans ' + (a === 'Yes' ? 'is-yes' : 'is-no')}>{a}</span>;

  const MysteryOne = ({ gid, session, sid, share, api }) => {
    const out = Ss.useOutcome('mystery', session);
    const c = React.useMemo(() => PgMystery.read(session), [session]);
    const status = PgMystery.statusOf(session);
    const acc = c.acc;
    const D = window.DS;
    return (
      <Ss.Page gid={gid}>
        <Ss.Head gid={gid} art="murder" label={out.label} date={session.date} h1={out.h1} mark={out.mark} stats={PgMystery.stats(out, c, status)} />
        <div className="ss-body">
          <section className="ss-hero ss-surface m1-file" aria-label="The case file">
            <header className="m1-scene">
              <span className="ss-kicker">The case</span>
              {c.setting ? <h2 className="m1-setting">{c.setting}</h2> : null}
              {c.victimName ? <p className="m1-victim">The victim: {c.victimName}{c.victimRole ? ', ' + c.victimRole : ''}</p> : null}
            </header>
            <ol className="m1-rows">
              {c.items.map((it, i) => it.kind === 'q' ? (
                <li className="m1-row" key={i}>
                  <span className="m1-lab">Question {it.n}</span>
                  <span className="m1-text">{it.text}</span>
                  <Answer a={it.answer} />
                </li>
              ) : (
                <li className="m1-row is-hint" key={i}>
                  <span className="m1-lab">Hint</span>
                  <span className="m1-text">{it.text}</span>
                </li>
              ))}
              {Array.from({ length: Math.max(0, 2 - c.asked) }).map((_, i) => (
                <li className="m1-row is-empty" key={'u' + i}>
                  <span className="m1-lab">Question {c.asked + i + 1}</span>
                  <span className="m1-text">{status === 'done' ? 'Not asked' : 'Not asked yet'}</span>
                </li>
              ))}
              <li className="m1-row m1-final">
                <span className="m1-lab">{acc ? 'Your accusation' : 'Accusation'}</span>
                {acc ? (
                  <>
                    <span className="m1-text m1-acc">{acc.raw}</span>
                    <span className="ss-tag" data-tone={acc.right ? 'success' : 'error'}>{acc.right ? 'Right' : 'Wrong'}</span>
                  </>
                ) : <span className="m1-text">{status === 'ended' ? 'Not made' : 'Not accused yet'}</span>}
              </li>
            </ol>
          </section>
          <aside className="ss-side">
            <Ss.ShareCard status={status} say={PgMystery.say(c)} lines={share.lines} gid={gid} session={session} sid={sid} api={api} />
          </aside>
        </div>
      </Ss.Page>
    );
  };

  pgOption('mystery', 1, {
    name: 'The case file',
    stance: 'Today\'s page drops the scene, so open with the setting and the victim, then the inspector\'s answers in the order they came, then the accusation, as the case was played.',
    cost: 'Low. Needs the engine to send the case\'s setting and victim (the seed carries them); the questions, hints and accusation are on the record today.',
    Component: MysteryOne,
    shareText: (session) => window.SsOutcome.mystery(session).lines,
    css: `
      :scope .m1-file { gap: 20px; }
      :scope .m1-scene { display: grid; gap: 6px; }
      :scope .m1-setting { margin: 0; font: var(--type-card-title); letter-spacing: var(--tracking-heading); text-wrap: balance; }
      :scope .m1-victim { margin: 0; font: var(--type-body); color: var(--muted); }
      :scope .m1-rows { list-style: none; margin: 0; padding: 0; display: grid; }
      :scope .m1-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 4px 12px; align-items: start; padding: 14px 0; border-top: 1px solid var(--ss-line); }
      :scope .m1-lab { grid-column: 1 / -1; font: var(--type-label); color: var(--muted); }
      :scope .m1-text { font: var(--type-body); min-width: 0; overflow-wrap: anywhere; }
      :scope .m1-row > .ss-tag, :scope .m1-ans { grid-column: 2; grid-row: 2; align-self: start; }
      :scope .m1-ans { display: inline-flex; align-items: center; min-height: 24px; padding: 0 10px; font: var(--type-small); border: 1.5px solid var(--ss-mark-2); color: var(--text); white-space: nowrap; }
      :scope .m1-ans.is-yes { background: var(--ss-mark-1); border-color: var(--ss-mark-1); color: var(--page); }
      :scope .m1-row.is-hint .m1-text { color: var(--muted); }
      :scope .m1-row.is-empty .m1-text { color: var(--muted); }
      :scope .m1-final { padding-bottom: 0; }
      :scope .m1-acc { font: var(--type-card-title); letter-spacing: var(--tracking-heading); text-wrap: balance; }
      @container ss (min-width: 680px) {
        :scope .m1-file { padding: 24px; }
        :scope .m1-row { grid-template-columns: 150px minmax(0, 1fr) auto; align-items: baseline; gap: 16px; padding: 16px 0; }
        :scope .m1-lab { grid-column: 1; }
        :scope .m1-row > .ss-tag, :scope .m1-ans { grid-column: 3; grid-row: 1; }
        :scope .m1-row.is-hint .m1-text, :scope .m1-row.is-empty .m1-text { grid-column: 2 / -1; }
        :scope .m1-final .m1-text:last-child { grid-column: 2 / -1; }
      }
    `,
  });
})();
