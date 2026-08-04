// ============================================================================
// Discourse v2 — the table.
// A lens over the same library, never a second one: the items the circle is
// still talking about, and the only place a member may speak more than once. Set
// as a page — attribution in the margin, paragraphs in the column. No bubbles,
// no per-line times, nothing that reads as a transcript.
// Reveal-on-read holds here too: an unread item shows its head, never the talk.
// Also here: the tab bar and the empty states.
// ============================================================================

const { Avatar: D2tAvatar } = window;
const { D2Composer, D2Preface, D2Huddle } = window;
const { useState: d2tS } = React;

const D2Turn = ({ turn, cfg }) => (
  <div className="d2-tturn">
    <div className="d2-tby">
      <D2tAvatar name={window.d2Who ? window.d2Who(turn.by) : turn.by} size={22} accent={turn.by === 'You'} />
      {cfg.names !== 'muted' && <span>{turn.by}</span>}
    </div>
    <p className="d2-ttext">{turn.text}</p>
  </div>
);

const D2TableEntry = ({ item, res, cfg, onOpen, onDoor, onSend, onLand }) => {
  const [landing, setLanding] = d2tS(false);
  const [say, setSay] = d2tS(false);
  const turns = (item.table && item.table.turns) || [];
  const open = res.turns === 'open' || cfg.graduate !== 'none';
  const head = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="circ-cardtitle" style={{
        flex: 1, minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--color-fg-2)',
        textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{item.title || item.url.replace(/^https?:\/\//, '')}</a>
      <button type="button" onClick={onDoor} aria-label="How the circle landed" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 0,
        padding: '4px 2px', minHeight: 36, cursor: 'pointer', flexShrink: 0,
      }}><D2Huddle reactions={item.reactions} size={15} /></button>
    </div>
  );

  // You haven't been through it yet — the invitation may show, the talk waits.
  if (res.sealed) {
    return (
      <article className="d2-tentry">
        {head}
        {res.prefaceOnCard && res.preface && (
          <div style={{ marginBottom: 14 }}>
            <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 19, lineHeight: 1.4, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>
              {res.preface.ask || res.preface.text}
            </p>
            <div style={{ marginTop: 8, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-3)' }}>{res.preface.by}</div>
          </div>
        )}
        <div className="d2-note">You haven{'\u2019'}t read this one yet {'\u2014'} what the circle is saying waits until you have. It{'\u2019'}s still in your list.</div>
      </article>
    );
  }

  return (
    <article className="d2-tentry">
      {head}

      {res.landed ? (
        <div style={{ marginBottom: 18 }}>
          <div className="d2-eyebrow" style={{ marginBottom: 6 }}>what the circle took</div>
          <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 19, lineHeight: 1.4, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{res.landed.text}</p>
          <div style={{ marginTop: 8, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-3)' }}>{res.landed.by}</div>
        </div>
      ) : res.preface ? (
        <div style={{ marginBottom: 18 }}>
          <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 19, lineHeight: 1.4, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>
            {res.preface.ask || res.preface.text}
          </p>
          <div style={{ marginTop: 8, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-3)' }}>{res.preface.by}</div>
        </div>
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {res.voices.slice(0, 2).map((v, i) => <D2Turn key={'v' + i} turn={{ by: v.by, text: v.line }} cfg={cfg} />)}
        {turns.map((t, i) => <D2Turn key={'t' + i} turn={t} cfg={cfg} />)}
      </div>

      {!res.landed && !say && !landing && (open || cfg.land) && (
        <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {open && <button type="button" onClick={() => setSay(true)} className="pg-ghost">Add to this</button>}
          {cfg.land && <button type="button" onClick={() => setLanding(true)} className="pg-ghost">Land it</button>}
        </div>
      )}
      {!res.landed && say && (
        <div style={{ marginTop: 20 }}>
          <D2Composer cfg={cfg} rows={3} autoFocus sendLabel="Add to this" skipLabel="Never mind"
            question={res.turns === 'question'} onSkip={() => setSay(false)}
            onSend={(v) => { setSay(false); onSend(v); }} />
        </div>
      )}
      {!res.landed && landing && (
        <div style={{ marginTop: 16 }}>
          <div className="d2-eyebrow" style={{ marginBottom: 8 }}>what the circle takes from this</div>
          <D2Composer cfg={{ ...cfg, limit: 240, prompt: 'placeholder' }} rows={3} autoFocus
            sendLabel="Land it" skipLabel="Not yet" onSkip={() => setLanding(false)}
            onSend={(r) => { setLanding(false); onLand(r); }} />
        </div>
      )}
      {res.landed && (
        <div style={{ marginTop: 18, fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.5, color: 'var(--color-fg-3)' }}>
          Closed. It stays on the card in everyone{'\u2019'}s list, with what the circle took at the top of the record.
        </div>
      )}
    </article>
  );
};

const D2Tabs = ({ active, onChange, table }) => {
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

const D2Empty = ({ primary, supporting }) => (
  <div style={{ textAlign: 'center', padding: '64px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
    <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-2xl)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: 0 }}>{primary}</h2>
    <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: 0, maxWidth: 340 }}>{supporting}</p>
  </div>
);

Object.assign(window, { D2TableEntry, D2Tabs, D2Empty, D2Turn });
