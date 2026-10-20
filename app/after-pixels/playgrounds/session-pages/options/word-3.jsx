// Session page, Daily Word, option 3: "Your board beside the message". Daily Word's ritual is posting the grid,
// so the player's board sits beside the letterless message their friends will get, and Copy sits under the message.
// Built on the kit (Page, Head, Cells, Record, DS.Button). The kit's ShareCard is not used: here the action card IS the right half of the hero,
// so it is drawn inside this file (named in the build report as something the kit lacked). The Side column is not used.
(function () {
  const KIND = { h: 'hit', n: 'near', x: 'miss' };
  const BLANK = () => Array.from({ length: 5 }, () => ({ t: '', k: 'empty' }));

  const WordThree = ({ gid, session, sid, share, api, element, layout }) => {
    const out = Ss.useOutcome('word', session);
    const status = session.unfinished ? 'ended' : session.live ? 'live' : 'done';
    const guesses = out.play.guesses, played = guesses.length, hints = out.play.hints;
    const [copied, setCopied] = React.useState(false);
    React.useEffect(() => { if (!copied) return undefined; const t = setTimeout(() => setCopied(false), 2400); return () => clearTimeout(t); }, [copied]);
    const B = window.DS.Button;

    const spare = status === 'done' ? 0 : Math.max(0, 6 - played);
    const yours = guesses.map((g) => g.word.split('').map((ch, i) => ({ t: ch, k: KIND[g.marks[i]] }))).concat(Array.from({ length: spare }, BLANK));
    // Their grid: the same marks, no letters. Until the day is finished it is an empty frame (nothing to send yet).
    const theirs = status === 'done' ? guesses.map((g) => g.marks.split('').map((m) => ({ t: '', k: KIND[m] }))) : Array.from({ length: 6 }, BLANK);
    const lines = status === 'done' ? share.lines : null;
    // share.lines = [label, "mark outcome", ...grid, lead-in, link]; the grid is drawn as cells, the rest is shown as it will paste.
    const head = lines ? lines.slice(0, 2) : [out.label, status === 'live' ? 'In progress' : 'Not finished'];
    const lead = lines ? lines[lines.length - 2] : null, link = lines ? lines[lines.length - 1] : null;
    const stats = out.stats;
    const drawn = element === 'between' || element === 'game', ia = layout === 'ia';
    const spareN = status === 'done' ? 0 : Math.max(0, 6 - played);
    const yoursLabel = 'Your board: ' + guesses.map((g) => g.word + ', ' + g.caption).join('; ');

    // IA pass: the message is one compact bubble (its text lines, a small colour grid, Copy). No ghost grid on a day that is not finished.
    const msgBody = ia ? (status === 'done' ? <React.Fragment>
        <div className="w3-head w3-mono">{head.map((l, i) => <span key={i}>{l}</span>)}</div>
        <Ss.Cells rows={theirs} cols={5} size="md" className="w3-cells w3-mini" label="The grid your friends will see: the same colours, no letters" />
        <div className="w3-foot">
          <span className="w3-mono">{lead}</span><span className="w3-mono w3-link">{link.replace(/\/(?=.)/g, "/\u200b")}</span>
          <B done={copied} doneLabel="Copied" onClick={() => { Ss.copyText(lines.join('\n')); setCopied(true); }}>Copy</B>
          <Ss.OnceLine />
        </div>
      </React.Fragment> : <React.Fragment>
        <div className="w3-head w3-mono">{head.map((l, i) => <span key={i} className={i ? 'w3-dim' : ''}>{l}</span>)}</div>
        <div className="w3-foot">
          {status === 'live' ? <React.Fragment><p className="ss-say">Your grid is ready to share when you finish.</p><B onClick={() => api.play(session.game, sid)}>Play</B></React.Fragment>
            : <p className="ss-say">The day ended before you finished. What you played stays in your history.</p>}
        </div>
      </React.Fragment>) : null;

    return (
      <Ss.Page gid={gid}>
        <Ss.Head gid={gid} art="word" label={out.label} date={session.date} h1={out.h1} mark={out.mark} stats={stats} />
        <section className="ss-hero w3-hero" aria-label="Your board beside the message you send">
          <div className="w3-grid">
            <div className={'w3-panel ss-surface w3-yours' + (element === 'game' ? ' wd-slot' : '')}>
              <div className="w3-head"><span className="ss-kicker">Your board</span>{ia ? null : <span className="ss-caption">The chat gets the colours, never the letters.</span>}</div>
              {drawn ? <PgWord.Board out={out} session={session} status={status} spare={spareN} label={yoursLabel} className="w3-board" />
                : <Ss.Cells rows={yours} cols={5} size="md" className="w3-cells" label={yoursLabel} />}
              <div className="w3-foot" />
            </div>
            <div className="w3-panel ss-card w3-msg" data-status={status}>
              {ia ? msgBody : <React.Fragment>
              <div className="w3-head w3-mono">{head.map((l, i) => <span key={i} className={i && status !== 'done' ? 'w3-dim' : ''}>{l}</span>)}</div>
              <Ss.Cells rows={theirs} cols={5} size="md" className="w3-cells"
                label={status === 'done' ? 'The grid your friends will see: the same colours, no letters' : 'The grid you can share once the day is finished (empty)'} />
              <div className="w3-foot">
                {status === 'done' ? <React.Fragment>
                  <span className="w3-mono">{lead}</span><span className="w3-mono w3-link">{link.replace(/\/(?=.)/g, "/\u200b")}</span>
                  <B done={copied} doneLabel="Copied" onClick={() => { Ss.copyText(lines.join('\n')); setCopied(true); }}>Copy</B>
                  <Ss.OnceLine />
                </React.Fragment> : status === 'live' ? <React.Fragment>
                  <p className="ss-say">Your grid is ready to share when you finish.</p>
                  <B onClick={() => api.play(session.game, sid)}>Play</B>
                </React.Fragment> : <p className="ss-say">The day ended before you finished. What you played stays in your history.</p>}
              </div>
              </React.Fragment>}
            </div>
          </div>
        </section>
        <Ss.Record title={session.listTitle} lines={session.lines} />
      </Ss.Page>
    );
  };

  pgOption('word', 3, {
    name: 'Your board beside the message',
    stance: 'Daily Word is posted, not just played, so the board you stared at sits beside the letterless message your friends will get, and Copy sits under that message. IA pass: the message is one compact bubble (its colours as a small grid, one lead-in line, the link, Copy), the board gets a tighter size on a phone, and an unfinished day has no ghost grid. Between and Game: your board in the cover\'s own squares.',
    cost: 'Needs the engine to send per-letter marks (guess-scored); the seed computes them. It drops the reading of each guess and the hint row, has no Side column, and a lost day shows no answer because no engine field holds it. Between and Game: only your board is drawn (the message stays a message); each mark is one guess-scored mark, the hint square one hint-given event, the seed\'s "contains" hint sits left of the board.',
    elements: ['store', 'between', 'game'], layouts: ['built', 'ia'],
    Component: WordThree,
    shareText: (session) => window.SsOutcome.word(session).lines,
    css: PgWord.css + `
      :scope .w3-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 12px; }
      :scope .w3-panel { display: grid; align-content: start; padding: 16px; row-gap: 12px; }
      :scope .w3-msg { background: color-mix(in srgb, var(--text) 6%, var(--ss-card)); }
      :scope .w3-head { display: grid; gap: 2px; align-content: start; min-width: 0; }
      :scope .w3-mono { font: 400 11.5px/1.4 ui-monospace, "SF Mono", Menlo, Consolas, "Apple Color Emoji", "Segoe UI Emoji", monospace; color: var(--text); overflow-wrap: break-word; }
      :scope .w3-msg { --w3-muted: color-mix(in srgb, var(--muted) 60%, var(--text)); }
      :scope .w3-msg .ss-caption, :scope .w3-msg .w3-dim { color: var(--w3-muted); }
      :scope .w3-dim { color: var(--muted); }
      :scope .w3-foot { display: grid; gap: 8px; align-content: start; min-width: 0; }
      :scope .w3-cells { --c: min(52px, calc((100cqi - 32px - 32px - 4 * 4px) / 5)); gap: 4px; justify-content: center; }
      :scope .w3-cells .ss-cells-row { gap: 4px; }
      :scope .w3-yours .w3-foot, :scope .w3-yours .ss-caption { align-self: start; }
      :scope .w3-msg .ss-caption { font: var(--type-caption); }
      :scope .w3-msg .mcp-btn { width: 100%; }
      @container ss (min-width: 640px) {
        :scope .w3-grid { gap: 16px; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: auto auto auto; }
        :scope .w3-panel { grid-row: 1 / span 3; grid-template-rows: subgrid; align-content: normal; padding: 20px; row-gap: 16px; }
        :scope .w3-mono { font-size: 14px; }
        :scope .w3-cells { --c: 46px; gap: 4px; }
        :scope .w3-cells .ss-cells-row { gap: 4px; }
        :scope .w3-msg .mcp-btn { width: auto; justify-self: start; }
      }
      /* The drawn board fills its panel: the panel, not the page, sets the tile size (word-model.jsx). */
      :scope .ss-page[data-element="game"] .w3-yours.wd-slot { padding: 16px; }
      /* IA pass: a compact bubble. Mini colour grid, tighter board on a phone. */
      :scope .ss-page[data-layout="ia"] .w3-mini { --c: 18px; gap: 3px; justify-content: start; align-content: start; align-self: start; }
      :scope .ss-page[data-layout="ia"] .w3-mini .ss-cells-row { gap: 3px; }
      :scope .ss-page[data-layout="ia"] .w3-msg { row-gap: 10px; }
      @container ss (max-width: 639px) {
        :scope .ss-page[data-layout="ia"] .w3-yours { padding: 12px; row-gap: 8px; }
        :scope .ss-page[data-layout="ia"] .w3-yours .w3-cells { --c: 40px; }
        :scope .ss-page[data-layout="ia"] .w3-yours .wd-board { --wd-max: 40px; }
        :scope .ss-page[data-layout="ia"] .w3-yours .wd-tiles { --wd-gap: 4px; }
        :scope .ss-page[data-layout="ia"] .w3-yours .w3-foot { display: none; }
      }
      @container ss (min-width: 960px) {
        :scope .w3-cells { --c: 56px; gap: 6px; }
        :scope .w3-cells .ss-cells-row { gap: 6px; }
      }
    `,
  });
})();
