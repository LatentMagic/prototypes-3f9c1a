// ============================================================================
// Discourse v5 — treatments B. Three of the seven v5 directions: the ones that
// answer the review's "what makes a conversation feel ONGOING" gap directly.
//   slot       visible incompleteness — the empty shape of the next line
//   returned   revivability — time as typography, a dateline on the late entry
//   descend    lineage, not tally — a response becomes the next share
// Each commits to ONE researched mechanism (see pg-d5-data.jsx header) and each
// carries a visual idea none of the others use.
// ============================================================================

const { Avatar: P5bAvatar } = window;
const { Pg4Respond: P5bRespond, Pg4More: P5bMore, PGD4_RESPOND: P5bRespondLabels } = window;
// Read at CALL time, not module-load time: this file loads before pg-d5-data.jsx
// (the treatments must exist before the dispatcher that names them), so these
// three are still undefined while this module's top level runs.
const P5bLate = () => window.PGD5_LATE || {};
const P5bDescendants = () => window.PGD5_DESCENDANTS || {};
const P5bItems = () => window.PGD4_ITEMS || [];
const { useState: p5bS } = React;

// ---- 14 The open slot — visible incompleteness ------------------------------
// Every line is a slot — filled ones just have words on them. Each line sits on
// the same 1px baseline rule; the empty one at the end is visibly the same
// object as the filled ones, nothing written on it yet.
const P5xSlotLine = {
  name: { fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-3)', marginBottom: 3 },
  text: { fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.4, color: 'var(--color-fg-1)', textWrap: 'pretty' },
};
// Height of one filled line's text row, so the empty slot reserves exactly
// that much space: 13.5px * 1.4 line-height.
const P5xSlotTextH = 13.5 * 1.4;

const Pg5Slot = ({ res, cfg, dir, onRespond }) => {
  const lines = [];
  if (res.showThought && res.thought) lines.push(res.thought);
  (res.responses || []).forEach((r) => lines.push(r));
  const slotH = 12.5 + 3 + P5xSlotTextH + 6;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {lines.map((l, i) => (
        <div key={i} style={{ borderBottom: '1px solid var(--color-border-1)', paddingBottom: 6 }}>
          {cfg.names !== 'muted' && <div style={P5xSlotLine.name}>{l.by}</div>}
          <div style={P5xSlotLine.text}>{l.text}</div>
        </div>
      ))}
      {res.canRespond ? (
        <button type="button" onClick={onRespond} className="d5-slot" style={{
          display: 'block', width: '100%', textAlign: 'left', background: 'transparent',
          border: 0, padding: 0, cursor: 'pointer', height: slotH, boxSizing: 'border-box',
          borderBottom: '1px solid var(--color-border-1)', paddingBottom: 6,
        }}>
          <div style={P5xSlotLine.name}>You</div>
          <div style={{ width: '100%', height: P5xSlotTextH }} />
        </button>
      ) : (
        !res.sealed && lines.length > 0 && (
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12.5, color: 'var(--color-fg-3)', fontStyle: 'italic' }}>
            The slot passes to whoever reads next.
          </div>
        )
      )}
    </div>
  );
};

// ---- 15 The long return — revivability, time as typography ------------------
const P5xReturnedDate = {
  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', color: 'var(--color-fg-3)',
  textTransform: 'uppercase',
};

const Pg5Returned = ({ res, cfg, dir, onRespond }) => {
  const lines = [];
  if (res.showThought && res.thought) lines.push(res.thought);
  (res.responses || []).forEach((r) => lines.push(r));
  const hasReturn = lines.length > 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* The record so far — compressed, inline, settled. Time already passed here. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {lines.map((l, i) => (
          <div key={i}>
            {cfg.names !== 'muted'
              ? <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-2)' }}>{l.by + ': '}</span>
              : null}
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12.5, lineHeight: 1.4, color: 'var(--color-fg-2)', textWrap: 'pretty' }}>{l.text}</span>
          </div>
        ))}
      </div>
      {hasReturn && (
        <div>
          <div style={{ borderTop: '1px solid var(--color-border-2)', paddingTop: 10 }}>
            <div style={{ ...P5xReturnedDate, marginBottom: 5 }}>{'Returned · ' + P5bLate().late + ' days later'}</div>
            {cfg.names !== 'muted' && <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-3)', marginBottom: 3 }}>{P5bLate().laterBy}</div>}
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 14, lineHeight: 1.5, color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{P5bLate().laterText}</div>
          </div>
        </div>
      )}
      {res.canRespond && <P5bRespond dir={dir} onRespond={onRespond} />}
    </div>
  );
};

// ---- 17 Reading on — lineage, fork-not-reply ---------------------------------
const P5xDescendRef = {
  wrap: { paddingLeft: 12, borderLeft: '1px solid var(--color-border-1)', display: 'flex', flexDirection: 'column', gap: 4, padding: '2px 0 2px 12px' },
  title: { fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--color-fg-1)' },
  source: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-fg-3)' },
};

// pk is the item's short id ('d4-N'); the descendant fixture is keyed by the
// item's full url. res carries no url, so resolve it the same way the card
// does: look the item up on PGD4_ITEMS by id. A miss (or no descendant for
// that url) renders no lineage — never a gap, never an error.
const p5xDescendant = (res, pk) => {
  const url = (res && res.url) || (P5bItems().find((i) => i.id === pk) || {}).url;
  return url ? P5bDescendants()[url] : null;
};

const Pg5Descend = ({ res, cfg, dir, onRespond, pk }) => {
  const desc = p5xDescendant(res, pk);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Context, not the subject — clamped to one line, quiet. */}
      {res.showThought && res.thought && (
        <div style={{
          fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, lineHeight: 1.4,
          color: 'var(--color-fg-2)', display: '-webkit-box', WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {cfg.names !== 'muted' && <span style={{ fontWeight: 600 }}>{res.thought.by + ': '}</span>}
          {res.thought.text}
        </div>
      )}
      {/* The lineage — what this led to. Visual centre of the card. */}
      {desc && (
        <div style={{ padding: '4px 0' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12.5, color: 'var(--color-fg-3)', marginBottom: 8 }}>
            {desc.by + ' read this and shared what it led to.'}
          </div>
          <div style={P5xDescendRef.wrap}>
            <div style={P5xDescendRef.title}>{desc.title}</div>
            <div style={P5xDescendRef.source}>{desc.source}</div>
          </div>
        </div>
      )}
      {res.canRespond && <P5bRespond dir={dir} onRespond={onRespond} />}
    </div>
  );
};

Object.assign(window, {
  Pg5Slot, Pg5Returned, Pg5Descend,
});
