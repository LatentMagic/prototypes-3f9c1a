// ============================================================================
// Discourse v4 — the record surfaces (what the door holds, and the moment).
//   Pg4RecordSheet  one sheet, four records, chosen by the direction:
//     rows    (08) reactions and words as ONE artefact — a member's glyph
//             stands where their avatar would, their sentence beside it.
//             Opened at commit as the moment; dismissed by YOU, no timer.
//     labels  (09) words pinned at their author's glyph on the disc, then gone.
//     invite  (01) the shipped door, plus the reflections, plus the living line.
//     else         the shipped door exactly as it ships — disc and roster.
//   Pg4Moment       the response beat for directions that follow the Swell.
//   Pg4AddSheet     where the thought is attached.
// ============================================================================

const { Avatar: P4rAvatar } = window;
const { Pg4Sheet, Pg4Disc, Pg4Roster, Pg4Composer, Pg4Same, Pg4SameBtn, p4Layout, p4First, PGD4_GLYPHS, PGD4_SHARE_STEMS, pg4Input } = window;
const { useState: p4rS } = React;

const P4R_ROUND = ['', 'one', 'two', 'three', 'four'];
const p4rRule = { height: 1, background: 'var(--color-border-2)', margin: '16px 0' };

// ---- 08 rows: the glyph IS the avatar --------------------------------------
const Pg4Row = ({ row, cfg, i, rise, onAnswer, canAnswer, pointed, onPoint, pk }) => {
  const me = row.by === 'You';
  const key = pk + '-r-' + row.by;
  const names = pointed && pointed[key] ? [...(row.same || []), 'You'] : (row.same || []);
  return (
    <div className={rise ? 'd4-rise' : undefined} style={rise ? { animationDelay: (90 + i * 90) + 'ms' } : undefined}>
      <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
        <span style={{ flexShrink: 0, width: 26, display: 'inline-flex', justifyContent: 'center', paddingTop: 1 }}>
          {row.glyph
            ? <span style={{ fontSize: 20, lineHeight: 1 }} title={row.by}>{row.glyph}</span>
            : <P4rAvatar name={row.by} size={22} accent={me} />}
        </span>
        <div style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div>
            {cfg.names !== 'muted' && <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: me ? 'var(--color-accent)' : 'var(--color-fg-1)', marginRight: 7 }}>{row.by}</span>}
            {row.to && <span className="d4-eyebrow" style={{ marginRight: 7 }}>to {p4First(row.to)}</span>}
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 14.5, lineHeight: 1.5, color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{row.text}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <Pg4Same names={names} cfg={cfg} />
            {!me && <Pg4SameBtn on={!!(pointed && pointed[key])} cfg={cfg} onClick={() => onPoint(key)} />}
            {canAnswer && !me && (
              <button type="button" onClick={() => onAnswer(row.by)} className="d4-point" style={{
                background: 'transparent', border: '1px solid var(--color-border-1)', color: 'var(--color-fg-2)',
                borderRadius: 'var(--radius-md)', padding: '6px 11px', minHeight: 36, cursor: 'pointer',
                fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5,
              }}>Answer {p4First(row.by)}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---- 09 labels: the record is a diagram ------------------------------------
// Built from the WORDS, not from the disc. Slots are fixed — half the lines
// flank the disc on each side — so labels can never collide, and the record
// reads as a diagram rather than a list. Stacks under the disc on a phone.
const Pg4Labels = ({ item, res, cfg }) => {
  const said = [];
  if (res.thought) said.push({ by: res.thought.by, text: res.thought.text });
  (res.responses || []).forEach((r) => said.push({ by: r.by, text: r.text }));
  const glyphOf = (n) => { const r = (item.reactions || []).find((x) => x.name === n && x.glyph); return r && r.glyph; };
  const half = Math.ceil(said.length / 2);
  const col = (rows, side) => (
    <div className={'d4-lcol d4-lcol-' + side}>
      {rows.map((s, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span className="d4-lhead">
            {glyphOf(s.by) && <span style={{ fontSize: 13, lineHeight: 1 }}>{glyphOf(s.by)}</span>}
            <span className="d4-eyebrow">{cfg.names === 'muted' ? p4First(s.by) : s.by}</span>
          </span>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12.5, lineHeight: 1.45, color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{s.text}</span>
        </div>
      ))}
    </div>
  );
  return (
    <div className="d4-labels">
      {col(said.slice(0, half), 'right')}
      <Pg4Disc reactions={item.reactions} size={132} />
      {col(said.slice(half), 'left')}
    </div>
  );
};

// ---- The sheet -------------------------------------------------------------
const Pg4RecordSheet = ({ item, res, cfg, dir, moment, glyph, pointed, onPoint, onClose, onSend, onTable }) => {
  const [answerTo, setAnswerTo] = p4rS(null);
  const [editing, setEditing] = p4rS(false);
  const [all, setAll] = p4rS(false);
  const treat = cfg.treat;

  const rows = [];
  if (res.showThought || (!res.sealed && res.thought)) {
    if (res.thought) rows.push({ ...res.thought, head: true, glyph: null });
  }
  (res.responses || []).forEach((r) => {
    const rx = (item.reactions || []).find((x) => x.name === r.by);
    rows.push({ ...r, glyph: rx && rx.glyph });
  });
  const body = rows.filter((r) => !r.head);
  const shown = moment && !all && body.length > 3 ? body.slice(0, 2) : body;
  const head = rows.find((r) => r.head);
  const locked = res.mine && (res.mine.same || []).length > 0;

  const composer = () => {
    if (answerTo) return (
      <Pg4Composer cfg={cfg} glyph={glyph} autoFocus sendLabel={'Answer ' + p4First(answerTo)} skipLabel="Never mind"
        onSkip={() => setAnswerTo(null)} onSend={(r) => { setAnswerTo(null); onSend({ ...r, to: answerTo }); }} />
    );
    if (treat === 'invite' && res.mine) {
      if (locked) return <p className="d4-note">Your line is part of the record now — it locked when somebody pointed at it.</p>;
      if (!editing) return (
        <button type="button" onClick={() => setEditing(true)} className="pg-ghost">Rewrite my line</button>
      );
      return (
        <Pg4Composer cfg={cfg} glyph={glyph} autoFocus initial={res.mine.text} sendLabel="Replace my line"
          skipLabel="Keep it" hint="Rewriting replaces your line. It locks once somebody points at it."
          onSkip={() => setEditing(false)} onSend={(r) => { setEditing(false); onSend(r); }} />
      );
    }
    if (res.canRespond) return (
      <Pg4Composer cfg={cfg} glyph={glyph} bank="respond" autoFocus={moment}
        sendLabel={moment ? 'Leave it' : 'Add yours'} skipLabel={moment ? 'Nothing to add' : null}
        onSkip={moment ? onClose : null} onSend={onSend} />
    );
    if (res.mine && !moment) return <p className="d4-note">You have said your piece on this one.</p>;
    return null;
  };

  // 09 — momentary: the words are part of the gesture and do not persist.
  if (treat === 'labels') {
    return (
      <Pg4Sheet wide eyebrow={moment ? 'you finished it' : 'the circle'} title="How it landed" onClose={onClose}>
        {moment || res.count > 0
          ? <Pg4Labels item={item} res={res} cfg={cfg} />
          : <div style={{ display: 'flex', justifyContent: 'center' }}><Pg4Disc reactions={item.reactions} size={200} /></div>}
        {!moment && res.count > 0 && (
          <p className="d4-note" style={{ textAlign: 'center', marginTop: 14 }}>These fade. Only the shape is kept.</p>
        )}
        <div style={p4rRule} />
        {composer()}
      </Pg4Sheet>
    );
  }

  // 08 — one artefact: the disc is the shape, the rows are the substance.
  if (treat === 'rows') {
    return (
      <Pg4Sheet eyebrow={moment ? 'you finished it' : 'the circle'} title="How it landed" onClose={onClose}>
        {head && (
          <div style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', padding: '13px 15px', marginBottom: 16 }}>
            <div className="d4-eyebrow" style={{ marginBottom: 5 }}>{head.by === 'You' ? 'you shared it' : head.by + ' shared it'}</div>
            <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 16, lineHeight: 1.45, color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{head.text}</p>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className={moment ? 'd4-rise' : undefined}><Pg4Disc reactions={item.reactions} size={moment ? 168 : 216} /></div>
        </div>
        <div style={p4rRule} />
        {body.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {shown.map((r, i) => (
              <React.Fragment key={r.by + i}>
                {(i === 0 || (shown[i - 1].r || 1) !== (r.r || 1)) && res.rounds > 1 && (
                  <div className="d4-eyebrow">round {P4R_ROUND[r.r || 1] || (r.r || 1)}</div>
                )}
                <Pg4Row row={r} cfg={cfg} i={i} rise={moment} pointed={pointed} onPoint={onPoint} pk={item.id}
                  canAnswer={!res.mine || (res.mine.r || 1) < res.rounds} onAnswer={setAnswerTo} />
              </React.Fragment>
            ))}
            {body.length > shown.length && (
              <button type="button" onClick={() => setAll(true)} className="d4-quiet" style={{ alignSelf: 'flex-start', background: 'transparent', border: 0, padding: '4px 0', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-3)' }}>{body.length - shown.length} more</button>
            )}
          </div>
        ) : <p className="d4-note" style={{ textAlign: 'center' }}>Nobody has put words to this one yet.</p>}
        <div style={p4rRule} />
        {composer()}
      </Pg4Sheet>
    );
  }

  // 01 — the shipped door, holding the reflections the card refuses to carry.
  if (treat === 'invite') {
    return (
      <Pg4Sheet eyebrow={moment ? 'you finished it' : 'the circle'} title="How it landed" onClose={onClose}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <Pg4Disc reactions={item.reactions} size={moment ? 168 : 216} />
          <Pg4Roster reactions={item.reactions} />
        </div>
        <div style={p4rRule} />
        <div className="d4-eyebrow" style={{ marginBottom: 10 }}>what people took from it</div>
        {body.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {body.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ paddingTop: 1 }}><P4rAvatar name={r.by} size={22} accent={r.by === 'You'} /></span>
                <span style={{ minWidth: 0, flex: 1 }}>
                  {cfg.names !== 'muted' && <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--color-fg-1)', marginRight: 6 }}>{r.by}</span>}
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 14.5, lineHeight: 1.5, color: 'var(--color-fg-2)', textWrap: 'pretty' }}>{r.text}</span>
                  {(r.same || []).length > 0 && <div style={{ marginTop: 6 }}><Pg4Same names={r.same} cfg={cfg} /></div>}
                </span>
              </div>
            ))}
          </div>
        ) : <p className="d4-note">Nobody has left a reflection yet.</p>}
        <div style={p4rRule} />
        {composer()}
      </Pg4Sheet>
    );
  }

  // Everything else keeps the door exactly as it ships.
  return (
    <Pg4Sheet eyebrow="the circle" title="How it landed" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <Pg4Disc reactions={item.reactions} size={216} />
        <Pg4Roster reactions={item.reactions} />
      </div>
      {treat === 'page' && item.onTable && (
        <React.Fragment>
          <div style={p4rRule} />
          <button type="button" onClick={onTable} className="pg-ghost">Continue at the table</button>
        </React.Fragment>
      )}
    </Pg4Sheet>
  );
};

// ---- The response beat for directions that FOLLOW the Swell ----------------
const P4R_MOMENT = {
  notes: { eyebrow: 'the note that came with it', title: 'Pass one back', send: 'Send note', skip: 'Not this time' },
  margin: { eyebrow: 'the margin', title: 'Add to the margin', send: 'Add note', skip: 'Leave it clean' },
  ask: { eyebrow: 'the question', title: 'Answer the question', send: 'Answer', skip: 'No answer from me' },
  prompt: { eyebrow: 'what came with it', title: 'Add yours', send: 'Add it', skip: 'Nothing to add' },
  table: { eyebrow: 'what came with it', title: 'Say something', send: 'Add it', skip: 'Not this one' },
  stems: { eyebrow: 'your statement', title: 'Finish a sentence', send: 'Add statement', skip: 'Nothing to add' },
  same: { eyebrow: 'the thought', title: 'Point at it', send: 'Leave it', skip: 'Not this time' },
};

const Pg4Moment = ({ item, res, cfg, dir, glyph, pointed, onPoint, onClose, onSend }) => {
  const copy = P4R_MOMENT[dir.id] || P4R_MOMENT.notes;
  const t = res.thought;
  const question = cfg.respond === 'answer' ? false : false;
  return (
    <Pg4Sheet eyebrow={copy.eyebrow} title={copy.title} onClose={onClose}>
      {t ? (
        <div style={{ background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', padding: '13px 15px' }}>
          <div className="d4-eyebrow" style={{ marginBottom: 5 }}>{t.by === 'You' ? 'you shared it' : t.by + ' shared it'}</div>
          <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: cfg.treat === 'qa' ? 600 : 400, fontSize: cfg.treat === 'qa' ? 17 : 15, lineHeight: 1.45, color: 'var(--color-fg-1)', textWrap: 'pretty' }}>
            {cfg.treat === 'qa' ? t.ask : cfg.treat === 'stem' ? t.stem[0] + ' ' + t.stem[1] + '.' : t.text}
          </p>
        </div>
      ) : (
        <p className="d4-note">{item.attribution.replace(/^Added by /, '').replace(/\.$/, '')} shared this without a line. Answer the share itself, or leave it.</p>
      )}
      <div style={{ height: 14 }} />
      <Pg4Composer cfg={cfg} glyph={glyph} bank="respond" autoFocus question={question}
        pointed={!!(pointed && pointed['moment-' + item.id])} onPoint={() => onPoint('moment-' + item.id)}
        sendLabel={copy.send} skipLabel={copy.skip} onSend={onSend} onSkip={onClose} />
    </Pg4Sheet>
  );
};

// ---- Add a link — where the thought is attached ----------------------------
const Pg4AddSheet = ({ cfg, dir, onClose }) => {
  const [url, setUrl] = p4rS('');
  const [text, setText] = p4rS('');
  const [stem, setStem] = p4rS(PGD4_SHARE_STEMS[0]);
  const limit = cfg.limit || 140;
  const ready = url.trim().length > 3;
  const label = cfg.treat === 'qa' ? 'Ask the circle one thing'
    : cfg.treat === 'rows' ? 'A line that unseals when they finish it'
    : cfg.treat === 'invite' ? 'Why they should pick this one'
    : 'Say why';
  const ph = cfg.treat === 'qa' ? 'Does this match how we onboard?'
    : cfg.treat === 'epigraph' ? window.PGD4_PROMPTS.share[0]
    : 'Why this mattered to me';
  return (
    <Pg4Sheet title="Add a link" onClose={onClose}>
      <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="example.com/article" inputMode="url"
        style={{ ...pg4Input, fontFamily: 'var(--font-mono)', fontWeight: 500, minHeight: 46, marginBottom: 16 }} />
      {cfg.respond !== 'none' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-2)' }}>{label}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-fg-3)' }}>{limit - text.length}</span>
          </div>
          {cfg.treat === 'stem' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {PGD4_SHARE_STEMS.map((s) => (
                <button key={s} type="button" onClick={() => setStem(s)} aria-pressed={stem === s} className="d4-chip" style={{
                  background: stem === s ? 'var(--color-accent)' : 'var(--color-surface)', color: stem === s ? '#fff' : 'var(--color-fg-1)',
                  border: '1px solid ' + (stem === s ? 'var(--color-accent)' : 'var(--color-border-1)'), borderRadius: 'var(--radius-md)',
                  padding: '7px 11px', minHeight: 36, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13,
                }}>{s + '\u2026'}</button>
              ))}
            </div>
          )}
          <textarea rows={2} maxLength={limit} value={text} onChange={(e) => setText(e.target.value)}
            placeholder={cfg.treat === 'stem' ? 'finish the sentence' : ph} style={{ ...pg4Input }} />
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, lineHeight: 1.45, color: 'var(--color-fg-3)' }}>
            {cfg.pre === 'up'
              ? 'This shows on the card before anyone has read it.'
              : 'This stays sealed until each member has read it themselves.'}
          </div>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
        <button type="button" onClick={onClose} className="circ-btn circ-btn-secondary" style={{
          background: 'var(--color-surface)', color: 'var(--color-fg-1)', border: '1px solid var(--color-border-1)',
          borderRadius: 'var(--radius-md)', padding: '11px 18px', minHeight: 44, cursor: 'pointer',
          fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14,
        }}>Cancel</button>
        <button type="button" onClick={onClose} disabled={!ready} className="circ-btn circ-btn-primary" style={{
          background: 'var(--color-accent)', color: '#fff', border: 0, borderRadius: 'var(--radius-md)',
          padding: '11px 18px', minHeight: 44, cursor: ready ? 'pointer' : 'default', opacity: ready ? 1 : 0.45,
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14,
        }}>Add</button>
      </div>
    </Pg4Sheet>
  );
};

Object.assign(window, { Pg4RecordSheet, Pg4Moment, Pg4AddSheet, Pg4Labels, Pg4Row });
