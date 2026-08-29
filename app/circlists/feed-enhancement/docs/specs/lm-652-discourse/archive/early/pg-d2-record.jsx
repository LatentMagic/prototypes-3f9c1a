// ============================================================================
// Discourse v2 — the record.
// One surface, two jobs: the door (the permanent artefact) and the moment you
// finish something (the same surface, opened at commit, carrying your line).
// The disc is the shape of how it landed; the list under it is the substance —
// each member's glyph and, when they left one, their sentence. Also here: the
// Add sheet, because that is where the sharer's line is written.
// ============================================================================

const { Icon: D2rIcon, Avatar: D2rAvatar } = window;
const { D2Sheet, D2Disc, D2Preface, D2Pointed, D2PointBtn, D2Composer, D2_PROMPTS } = window;
const { useState: d2rS } = React;

// Avatar identity: the line always reads "You" (the shared-view convention) but
// the avatar uses the account's real name, exactly as the shipped card does.
const d2Who = (n) => (n === 'You' && window.displayName ? window.displayName(window.D2_USER) : n);

const D2ReadRing = ({ me, size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ stroke: me ? 'var(--color-accent)' : 'var(--color-fg-3)', strokeWidth: 1.6, fill: 'none' }}><circle cx="12" cy="12" r="8" /></svg>
);

// The wordless part of the roster — the shipped chips, unchanged.
const D2Chips = ({ rows }) => {
  if (!rows.length) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
      {rows.map((r, i) => {
        const me = r.name === 'You';
        return (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 10px', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', color: me ? 'var(--color-accent)' : 'var(--color-fg-1)' }}>
            {r.rx && r.rx.glyph ? <span style={{ fontSize: 16, lineHeight: 1 }}>{r.rx.glyph}</span> : <D2ReadRing me={me} />}            {r.former ? 'Former member' : r.name}
          </span>
        );
      })}
    </div>
  );
};

// One member's row: their glyph, their name, their sentence, who pointed at it,
// and the ways you may answer it.
const D2Row = ({ row, cfg, res, i, rise, onPoint, onReply, canReply }) => {
  const v = row.voice, me = row.name === 'You';
  const pointed = v.echoes || [];
  const iPointed = pointed.includes('You');
  return (
    <div className={rise ? 'd2-rise' : undefined} style={rise ? { animationDelay: (90 + i * 90) + 'ms' } : undefined}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ flexShrink: 0, width: 26, display: 'inline-flex', justifyContent: 'center', paddingTop: 2 }}>
          {row.rx && row.rx.glyph
            ? <span style={{ fontSize: 19, lineHeight: 1 }} title={row.name}>{row.rx.glyph}</span>
            : <D2rAvatar name={d2Who(row.name)} size={22} accent={me} />}
        </span>
        <div style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div>
            {cfg.names !== 'muted' && <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: me ? 'var(--color-accent)' : 'var(--color-fg-1)', marginRight: 7 }}>{row.name}</span>}
            {res.turns === 'addressed' && v.to && <span className="d2-eyebrow" style={{ marginRight: 7 }}>to {v.to}</span>}
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 14.5, lineHeight: 1.5, color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{v.line}</span>
          </div>
          {(pointed.length > 0 || (cfg.echo !== 'off' && !me) || canReply) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {pointed.length > 0 && <D2Pointed names={pointed} cfg={cfg} />}
              {cfg.echo !== 'off' && !me && <D2PointBtn word={res.echoWord} on={iPointed} onClick={() => onPoint(row.name)} />}
              {canReply && (
                <button type="button" onClick={() => onReply(row.name)} className="d2-point" style={{
                  background: 'transparent', border: '1px solid var(--color-border-1)', color: 'var(--color-fg-2)',
                  borderRadius: 'var(--radius-md)', padding: '5px 10px', minHeight: 32, cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5,
                }}>Answer {row.name.split(' ')[0]}</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const D2_ROUND_WORD = ['', 'one', 'two', 'three', 'four'];

const D2Record = ({ item, res, cfg, opt, moment, onClose, onSend, onPoint, onGraduate, onOpenTable, onLand }) => {
  const [replyTo, setReplyTo] = d2rS(null);
  const [landing, setLanding] = d2rS(false);
  const worded = res.rows.filter((r) => r.voice);
  const bare = res.rows.filter((r) => !r.voice);
  const sectioned = cfg.record === 'sectioned';
  const rounds = res.turns === 'rounds';
  const cap = moment && worded.length > 3 ? 2 : worded.length;
  const [all, setAll] = d2rS(false);
  const shown = all ? worded : worded.slice(0, cap);
  const canReplyTo = (name) => res.addressable.indexOf(name) >= 0;

  const rowsBlock = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {shown.map((r, i) => (
        <React.Fragment key={r.name || i}>
          {rounds && (i === 0 || ((shown[i - 1].voice.r || 1) !== (r.voice.r || 1))) && (
            <div className="d2-eyebrow">round {D2_ROUND_WORD[r.voice.r || 1] || (r.voice.r || 1)}</div>
          )}
          <D2Row row={r} cfg={cfg} res={res} i={i} rise={moment} onPoint={onPoint}
            onReply={setReplyTo} canReply={canReplyTo(r.name)} />
        </React.Fragment>
      ))}
      {worded.length > shown.length && (
        <button type="button" onClick={() => setAll(true)} style={{
          alignSelf: 'flex-start', background: 'transparent', border: 0, padding: '4px 0', cursor: 'pointer',
          fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-3)',
        }}>{worded.length - shown.length} more</button>
      )}
    </div>
  );

  // Your turn. What is offered depends entirely on the continuation direction.
  const yours = () => {
    if (res.landed) return <div className="d2-note">This one landed. {res.landed.by === 'You' ? 'You' : res.landed.by} wrote what the circle took from it.</div>;
    if (replyTo) {
      return <D2Composer cfg={cfg} to={replyTo} autoFocus sendLabel="Answer" skipLabel="Never mind"
        onSkip={() => setReplyTo(null)} onSend={(r) => { setReplyTo(null); onSend(r); }} />;
    }
    if (res.canSpeak) {
      const editing = res.turns === 'living' && res.mine;
      return (
        <D2Composer cfg={cfg} autoFocus={moment} initial={editing ? res.mine.line : ''}
          question={res.turns === 'question' && !!res.mine}
          questionHint={'Turns after your first are questions \u2014 end it with a question mark.'}
          hint={res.turns === 'living' && res.mine ? 'Rewriting replaces your line. It locks once somebody points at it.' : null}
          sendLabel={editing ? 'Replace my line' : moment ? 'Leave it' : 'Add yours'}
          skipLabel={moment ? 'Nothing to add' : null} onSkip={moment ? onClose : null} onSend={onSend} />
      );
    }
    if (res.mine) {
      if (res.turns === 'living') return <div className="d2-note">{'Your line is part of the record now \u2014 it locked when somebody pointed at it.'}</div>;
      if (rounds) return <div className="d2-note">You have spoken in round {D2_ROUND_WORD[res.round] || res.round}. The next one opens when everyone who has read it has spoken.</div>;
      if (res.addressable.length) return null;
      return <div className="d2-note">You have said your piece on this one.</div>;
    }
    return null;
  };

  const graduateReady = cfg.graduate === 'member' && !res.tableOn && res.voices.length >= 2 && !res.landed;
  const landReady = cfg.land && res.turns === 'open' && cfg.graduate === 'none' && !res.landed && res.voices.length >= 1;

  return (
    <D2Sheet eyebrow={moment ? 'you finished it' : 'the circle'} title="How it landed" onClose={onClose} noEnter={moment}>
      {res.landed && (
        <div style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: 16 }}>
          <div className="d2-eyebrow" style={{ marginBottom: 6 }}>what the circle took</div>
          <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 16, lineHeight: 1.45, color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{res.landed.text}</p>
          <div style={{ marginTop: 8, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-3)' }}>{res.landed.by}</div>
        </div>
      )}

      {res.preface && (
        <div className="d2-head" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ flexShrink: 0, paddingTop: 2 }}><D2rAvatar name={d2Who(res.preface.by)} size={26} accent={res.preface.by === 'You'} /></span>
            <span style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-3)', marginBottom: 3 }}>{res.preface.by === 'You' ? 'You shared it' : res.preface.by + ' shared it'}</div>
              <D2Preface preface={res.preface} cfg={cfg} size="record" />
              {res.preface.ask && res.preface.text && <div style={{ marginTop: 5, fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 14, lineHeight: 1.5, color: 'var(--color-fg-2)', textWrap: 'pretty' }}>{res.preface.text}</div>}
            </span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div className={moment ? 'd2-rise' : undefined}><D2Disc reactions={item.reactions} size={moment ? 168 : 216} /></div>
        {sectioned && <D2Chips rows={res.rows} />}
      </div>

      {sectioned && worded.length > 0 && (
        <React.Fragment>
          <div className="d2-rule" />
          <div className="d2-eyebrow" style={{ marginBottom: 12 }}>what was said</div>
        </React.Fragment>
      )}
      {!sectioned && <div style={{ height: 18 }} />}

      {worded.length > 0 ? rowsBlock : (
        <div className="d2-note" style={{ textAlign: 'center' }}>Nobody has put words to this one yet.</div>
      )}
      {!sectioned && bare.length > 0 && <div style={{ marginTop: 14 }}><D2Chips rows={bare} /></div>}

      {(res.canSpeak || res.mine || res.landed || replyTo) && <div className="d2-rule" />}
      {yours()}

      {(graduateReady || res.tableOn || landReady) && (
        <React.Fragment>
          <div className="d2-rule" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {graduateReady && (
              <button type="button" onClick={onGraduate} className="pg-ghost">Take it to the table</button>
            )}
            {res.tableOn && (
              <button type="button" onClick={onOpenTable} className="pg-ghost">{res.landed ? 'See it at the table' : 'Continue at the table'}</button>
            )}
            {landReady && !landing && (
              <button type="button" onClick={() => setLanding(true)} className="pg-ghost">Land it</button>
            )}
          </div>
          {landing && (
            <div style={{ marginTop: 14 }}>
              <div className="d2-eyebrow" style={{ marginBottom: 8 }}>what the circle takes from this</div>
              <D2Composer cfg={{ ...cfg, limit: 240, prompt: 'placeholder' }} bank="respond" autoFocus rows={3}
                sendLabel="Land it" skipLabel="Not yet" onSkip={() => setLanding(false)}
                onSend={(r) => { setLanding(false); onLand(r); }} />
            </div>
          )}
        </React.Fragment>
      )}
    </D2Sheet>
  );
};

// ---- Add a link — where the sharer's line is written -----------------------
const D2AddSheet = ({ cfg, onClose, onAdd }) => {
  const [url, setUrl] = d2rS('');
  const [seal, setSeal] = d2rS(false);
  const [ask, setAsk] = d2rS(false);
  const ready = url.trim().length > 3;
  return (
    <D2Sheet title="Add a link" onClose={onClose}>
      <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="example.com/article" inputMode="url"
        style={{ ...window.d2Input, fontFamily: 'var(--font-mono)', fontWeight: 500, minHeight: 46, marginBottom: 18 }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--color-fg-1)' }}>{ask ? 'Ask the circle one thing' : 'Say why'}</span>
        <button type="button" onClick={() => setAsk(!ask)} className="pg-ghost">{ask ? 'Say why instead' : 'Ask instead'}</button>
      </div>
      <D2Composer cfg={cfg} bank="share" question={ask} seal={seal} onSeal={setSeal} disabled={!ready}
        sendLabel="Add" skipLabel="Add without a line" onSkip={() => onAdd(ready ? { url: url.trim() } : null)}
        onSend={(r) => onAdd({ url: url.trim(), text: r.text, seal, ask })} />
      {!ready && <div style={{ marginTop: 12, fontFamily: 'var(--font-sans)', fontSize: 12.5, lineHeight: 1.45, color: 'var(--color-fg-3)' }}>
        A link is enough on its own {'\u2014'} the line is what makes somebody pick it.
      </div>}
    </D2Sheet>
  );
};

Object.assign(window, { D2Record, D2AddSheet, D2Chips, D2ReadRing, d2Who });
