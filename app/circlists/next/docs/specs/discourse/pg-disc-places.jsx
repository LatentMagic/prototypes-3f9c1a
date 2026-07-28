// ============================================================================
// Discourse playground — the places discourse can live, and the moment it is
// written. Reaction door, the response moment, the Add sheet (where a thought
// is attached), the Table tab, and the tab bar that may carry it.
// ============================================================================

const { PgdSheet, PgdDisc, PgdRoster, PgdComposer, PgdQuote, PgdLine, PgdThoughtBody, PgdResponseBody, PgdStack, PgdGlyphHuddle } = window;
const { Icon: PgpIcon, Avatar: PgpAvatar } = window;
const { PGD_SHARE_STEMS } = window;
const { useState: pgpS } = React;

const PGD_MOMENT = {
  notes: { eyebrow: 'the note that came with it', title: 'Pass one back', send: 'Send note', skip: 'Not this time' },
  margin: { eyebrow: 'the margin', title: 'Add to the margin', send: 'Add note', skip: 'Leave it clean' },
  table: { eyebrow: 'the table', title: 'Take it to the table', send: 'Put it on the table', skip: 'Not this one' },
  stems: { eyebrow: 'your statement', title: 'Finish a sentence', send: 'Add statement', skip: 'Nothing to add' },
  door: { eyebrow: 'reaction door', title: 'Leave an epilogue', send: 'Leave epilogue', skip: 'Close the door' },
  echo: { eyebrow: 'the thought', title: 'Echo it back', send: 'Echo', skip: 'Not this time' },
  ask: { eyebrow: 'the question', title: 'Answer the question', send: 'Answer', skip: 'No answer from me' },
};

const pgpEyebrow = { fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', color: 'var(--color-fg-3)' };
const pgpRule = { height: 1, background: 'var(--color-border-2)', margin: '16px 0' };

// ---- The response moment ---------------------------------------------------
// Opened either inside the Swell (cfg.reveal 'swell' — the reveal step IS the
// exchange) or straight after it. Everything the loop needs in one surface:
// how it landed, what came with it, and your way to answer.
const PgdMoment = ({ item, res, cfg, opt, withDisc, onSend, onClose, glyph }) => {
  const copy = PGD_MOMENT[opt.id] || PGD_MOMENT.notes;
  const t = res.thought;
  return (
    <PgdSheet eyebrow={withDisc ? 'the circle' : copy.eyebrow} title={withDisc ? 'How it landed' : copy.title} onClose={onClose}>
      {withDisc && (
        <React.Fragment>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <PgdDisc reactions={item.reactions} size={188} />
            <PgdRoster reactions={item.reactions} />
          </div>
          <div style={pgpRule} />
          <div style={{ ...pgpEyebrow, marginBottom: 8 }}>{copy.eyebrow}</div>
        </React.Fragment>
      )}
      {t ? <PgdQuote thought={t} opt={opt} cfg={cfg} /> : (
        <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 14.5, lineHeight: 1.5, color: 'var(--color-fg-2)' }}>
          {item.attribution.replace(/^Added by /, '').replace(/\.$/, '')} shared this without a note. Answer the share itself, or leave it.
        </p>
      )}
      <div style={{ height: 14 }} />
      <PgdComposer cfg={cfg} opt={opt} glyph={glyph} thought={t} autoFocus={!withDisc}
        sendLabel={copy.send} skipLabel={copy.skip} onSend={onSend} onSkip={onClose} />
    </PgdSheet>
  );
};

// ---- The reaction door -----------------------------------------------------
// Always the shipped surface: the disc and the roster. When the option puts
// discourse INSIDE the door, the preface and the epilogues stack beneath them.
const PgdDoorSheet = ({ item, res, cfg, opt, onClose, onRespond }) => {
  const inDoor = cfg.home === 'door';
  return (
    <PgdSheet eyebrow="the circle" title="How it landed" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <PgdDisc reactions={item.reactions} size={216} />
        <PgdRoster reactions={item.reactions} />
      </div>
      {inDoor && (res.thought || res.responses.length || res.canRespond) && (
        <React.Fragment>
          <div style={pgpRule} />
          <div style={{ ...pgpEyebrow, marginBottom: 10 }}>{res.thought ? 'preface' : 'epilogues'}</div>
          <PgdStack res={res} cfg={cfg} opt={opt} onRespond={onRespond} />
        </React.Fragment>
      )}
    </PgdSheet>
  );
};

// ---- Add a link — where the thought is attached ----------------------------
const PgdAddSheet = ({ cfg, opt, onClose }) => {
  const [stem, setStem] = pgpS(PGD_SHARE_STEMS[0]);
  const [url, setUrl] = pgpS('');
  const [text, setText] = pgpS('');
  const attach = cfg.attach;
  const limit = cfg.limit || 140;
  const ready = url.trim().length > 3 && (attach !== 'required' || text.trim().length > 0);
  const label = opt.id === 'ask' ? 'Ask the circle one thing' : opt.id === 'door' ? 'Preface' : opt.id === 'stems' ? 'Say why' : 'Say why';
  const hint = attach === 'required'
    ? 'This circle asks for a line with every share.'
    : attach === 'nudge' ? 'One line on why. You can skip it.' : null;
  return (
    <PgdSheet title="Add a link" onClose={onClose}>
      <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="example.com/article" inputMode="url"
        style={{ ...window.pgdInputStyle, fontFamily: 'var(--font-mono)', fontWeight: 500, minHeight: 46, marginBottom: 16 }} />
      {attach !== 'none' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-2)' }}>
              {label}{attach === 'optional' ? ' (optional)' : ''}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-fg-3)' }}>{limit - text.length}</span>
          </div>
          {opt.id === 'stems' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {PGD_SHARE_STEMS.map((s) => (
                <button key={s} type="button" onClick={() => setStem(s)} aria-pressed={stem === s} style={{
                  background: stem === s ? 'var(--color-accent)' : 'var(--color-surface)', color: stem === s ? '#fff' : 'var(--color-fg-1)',
                  border: '1px solid ' + (stem === s ? 'var(--color-accent)' : 'var(--color-border-1)'), borderRadius: 'var(--radius-md)',
                  padding: '7px 11px', minHeight: 36, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13,
                }}>{s + '\u2026'}</button>
              ))}
            </div>
          )}
          <textarea rows={2} maxLength={limit} value={text} onChange={(e) => setText(e.target.value)}
            placeholder={opt.id === 'stems' ? 'finish the sentence' : opt.id === 'ask' ? 'Does this match how we onboard?' : 'Why this mattered to me'}
            style={{ ...window.pgdInputStyle }} />
          {hint && <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, lineHeight: 1.45, color: 'var(--color-fg-3)' }}>{hint}</div>}
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
    </PgdSheet>
  );
};

// ---- The Table -------------------------------------------------------------
// A third place: only the cards something was said about, with the thought as
// the headline and the link demoted to a source line.
const PgdTableEntry = ({ item, res, cfg, opt, onRespond, onDoor }) => (
  <article style={{
    background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
    borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-5)',
    display: 'flex', flexDirection: 'column', gap: 12,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="circ-cardtitle" style={{
        flex: 1, minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12.5, color: 'var(--color-fg-2)',
        textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{item.title || item.url}</a>
      <button type="button" onClick={onDoor} className="circ-swell-door" aria-label="How the circle landed" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 0, padding: '4px 2px',
        minHeight: 36, cursor: 'pointer', flexShrink: 0,
      }}><PgdGlyphHuddle reactions={item.reactions} size={15} /></button>
    </div>
    {res.thought && (
      <PgdLine by={res.thought.by} cfg={{ ...cfg, attrib: 'named' }}>
        <PgdThoughtBody thought={res.thought} opt={opt} cfg={cfg} big />
      </PgdLine>
    )}
    {res.responses.map((r, i) => (
      <PgdLine key={i} by={r.by} cfg={cfg} indent={14}><PgdResponseBody r={r} opt={opt} cfg={cfg} /></PgdLine>
    ))}
    {res.canRespond && (
      <button type="button" onClick={onRespond} className="pgd-respond" style={{
        alignSelf: 'flex-start', background: 'transparent', border: '1px solid var(--color-border-1)',
        borderRadius: 'var(--radius-md)', padding: '8px 12px', minHeight: 40, cursor: 'pointer',
        fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--color-fg-1)',
      }}>Say something</button>
    )}
  </article>
);

// ---- Tabs — Active / Read, plus the Table when an option adds one ----------
const PgdTabs = ({ active, onChange, extra }) => {
  const items = [{ id: 'active', label: 'Active' }, { id: 'read', label: 'Read' }].concat(extra ? [{ id: 'table', label: 'Table' }] : []);
  return (
    <div style={{
      background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-2)',
      padding: '0 16px', display: 'flex', gap: 4, position: 'sticky', top: 'var(--top-bar-height)', zIndex: 49,
    }}>
      {items.map((t) => {
        const on = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} aria-current={on} style={{
            background: 'transparent', border: 0, padding: '15px 14px', cursor: 'pointer',
            fontFamily: 'var(--font-sans)', fontWeight: on ? 600 : 500, fontSize: 14,
            color: on ? 'var(--color-accent)' : 'var(--color-fg-2)',
            borderBottom: '2px solid ' + (on ? 'var(--color-accent)' : 'transparent'),
            marginBottom: -1, display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 48,
          }}>{t.label}</button>
        );
      })}
    </div>
  );
};

// ---- Empty state — the app's own single register ---------------------------
const PgdEmpty = ({ primary, supporting }) => (
  <div style={{ textAlign: 'center', padding: '64px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
    <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-2xl)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: 0 }}>{primary}</h2>
    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: 0, maxWidth: 320 }}>{supporting}</p>
  </div>
);

Object.assign(window, { PgdMoment, PgdDoorSheet, PgdAddSheet, PgdTableEntry, PgdTabs, PgdEmpty, PGD_MOMENT });
