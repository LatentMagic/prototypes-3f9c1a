// ============================================================================
// Discourse v4 — the table (direction 10).
// A LENS over the same library, never a second one: the items the circle is
// still talking about. Nothing is moved out of the feed — the card stays where
// it was and gains one quiet mono line. Graduation is a member's act, not a
// trigger. This is the only place a member may speak more than once, and it
// drains: any member may land it with what the circle took.
// Set as a page — attribution in the margin, paragraphs in the column. No
// bubbles, no per-line times, nothing that reads as a transcript.
// ============================================================================

const { Pg4Composer, Pg4Huddle, Pg4Same } = window;
const { useState: p4tS } = React;

const Pg4Turn = ({ by, text, cfg, lead }) => (
  <div className="d4-tturn">
    <div className="d4-tby">{cfg.names === 'muted' ? window.p4First(by) : by}</div>
    <p className="d4-ttext" style={lead ? { fontSize: 19, fontWeight: 500, lineHeight: 1.4, letterSpacing: '-0.005em' } : null}>{text}</p>
  </div>
);

const Pg4TableEntry = ({ item, res, cfg, onDoor, onSend, onLand, landed }) => {
  const [say, setSay] = p4tS(false);
  const [landing, setLanding] = p4tS(false);
  const close = landed || res.takeaway;
  const turns = [];
  if (res.thought) turns.push({ by: res.thought.by, text: res.thought.text, lead: true });
  (res.responses || []).forEach((r) => turns.push({ by: r.by, text: r.text }));
  (item.turns || []).forEach((t) => turns.push(t));

  return (
    <article className="d4-tentry">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="circ-cardtitle" style={{
          flex: 1, minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--color-fg-2)',
          textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{item.title || item.url.replace(/^https?:\/\//, '')}</a>
        <button type="button" onClick={onDoor} aria-label="How the circle landed" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 0,
          padding: '4px 2px', minHeight: 36, cursor: 'pointer', flexShrink: 0,
        }}><Pg4Huddle reactions={item.reactions} size={15} /></button>
      </div>

      {res.sealed ? (
        <p className="d4-note">You haven{'\u2019'}t been through this one yet. What the circle is saying waits until you have — it is still in your list.</p>
      ) : (
        <React.Fragment>
          {close && (
            <div style={{ marginBottom: 22, paddingBottom: 20, borderBottom: '1px solid var(--color-border-2)' }}>
              <div className="d4-eyebrow" style={{ marginBottom: 6 }}>what the circle took</div>
              <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 19, lineHeight: 1.4, letterSpacing: '-0.005em', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{close.text}</p>
              <div style={{ marginTop: 8, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-3)' }}>{close.by}</div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {turns.map((t, i) => <Pg4Turn key={i} by={t.by} text={t.text} cfg={cfg} lead={t.lead} />)}
          </div>
          {!close && !say && !landing && (
            <div style={{ marginTop: 22, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button type="button" onClick={() => setSay(true)} className="pg-ghost">Add to this</button>
              <button type="button" onClick={() => setLanding(true)} className="pg-ghost">Land it</button>
            </div>
          )}
          {!close && say && (
            <div style={{ marginTop: 20 }}>
              <Pg4Composer cfg={cfg} rows={3} autoFocus sendLabel="Add to this" skipLabel="Never mind"
                onSkip={() => setSay(false)} onSend={(v) => { setSay(false); onSend(v); }} />
            </div>
          )}
          {!close && landing && (
            <div style={{ marginTop: 20 }}>
              <div className="d4-eyebrow" style={{ marginBottom: 8 }}>what the circle takes from this</div>
              <Pg4Composer cfg={{ ...cfg, limit: 240 }} rows={3} autoFocus sendLabel="Land it" skipLabel="Not yet"
                onSkip={() => setLanding(false)} onSend={(r) => { setLanding(false); onLand(r); }} />
            </div>
          )}
          {close && (
            <p className="d4-note" style={{ marginTop: 20 }}>
              Closed. It stays on the card in everyone{'\u2019'}s list, with what the circle took at the top.
            </p>
          )}
        </React.Fragment>
      )}
    </article>
  );
};

const Pg4Tabs = ({ active, onChange, table }) => {
  const items = [{ id: 'active', label: 'Active' }, { id: 'read', label: 'Read' }].concat(table ? [{ id: 'table', label: 'Table' }] : []);
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

const Pg4Empty = ({ primary, supporting }) => (
  <div style={{ textAlign: 'center', padding: '64px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
    <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-2xl)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: 0 }}>{primary}</h2>
    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: 0, maxWidth: 340 }}>{supporting}</p>
  </div>
);

Object.assign(window, { Pg4TableEntry, Pg4Tabs, Pg4Empty, Pg4Turn });
