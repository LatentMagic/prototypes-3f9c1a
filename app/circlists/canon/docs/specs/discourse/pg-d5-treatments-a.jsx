// ============================================================================
// Discourse v5 — treatments, set A.
// Four of the seven new directions from pg-d5-data.jsx: standfirst, bracket,
// chorus, shelf. Each commits to one "ongoing without a thread" mechanism and
// carries a card treatment no v4 or other v5 direction uses.
//   standfirst  the deck under a headline — one line, held by whoever is most
//               pointed at, title never demoted (contrast: v4 invite)
//   bracket     translator's-note asides, inline, appending into one paragraph
//   chorus      name-led one-liners stacked as a list, capped at three
//   shelf       a nested shelf-talker card, narrower than the measure
// ============================================================================

const { Pg4Respond: P5aRespond, Pg4More: P5aMore } = window;
const { useState: p5aS } = React;

// ---- 11 The standfirst — the deck under the headline ------------------------
const Pg5Standfirst = ({ res, cfg, dir, onRespond, pk, pointed, onPoint }) => {
  const t = res.showThought ? res.thought : null;
  const count = (res.responses || []).length + (t ? 1 : 0);
  const points = t && t.same ? t.same.length : 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {t && (
        <p style={{
          margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 400, fontStyle: 'italic',
          fontSize: 13, lineHeight: 1.5, color: 'var(--color-fg-2)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textWrap: 'nowrap',
        }}>
          {t.text}
        </p>
      )}
      {/* Attribution sits OUTSIDE the clamped line. Inside it, the ellipsis ate
          the name on every fixture longer than the measure — a deck nobody can
          attribute is worse than no deck. */}
      {(t || count > 0) && (
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12, color: 'var(--color-fg-3)' }}>
          {t && cfg.names !== 'muted' && <span style={{ fontWeight: 600 }}>{'— ' + t.by}</span>}
          {t && cfg.names !== 'muted' && count > 0 && <span>{'  ·  '}</span>}
          {count > 0 && (points > 0
            ? `${points === 1 ? 'one' : points} ${points === 1 ? 'person points' : 'people point'} to this line`
            : `${count} ${count === 1 ? 'line offered' : 'lines offered'}`)}
        </div>
      )}
      {res.canRespond && <P5aRespond dir={dir} onRespond={onRespond} />}
    </div>
  );
};

// ---- 12 The aside — square brackets, inline, one paragraph ------------------
const Pg5Bracket = ({ res, cfg, dir, onRespond }) => {
  const list = [];
  if (res.showThought && res.thought) list.push(res.thought);
  (res.responses || []).forEach((r) => list.push(r));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {list.length > 0 && (
        <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, lineHeight: 1.6, textWrap: 'pretty' }}>
          {list.map((n, i) => (
            <span key={i}>
              <span style={{ color: 'var(--color-border-1)' }}>[</span>
              <span style={{ color: 'var(--color-fg-1)' }}>{n.text}</span>
              <span style={{ color: 'var(--color-fg-3)' }}>{' — ' + n.by}</span>
              <span style={{ color: 'var(--color-border-1)' }}>]</span>
              {i < list.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
      )}
      {res.canRespond && <P5aRespond dir={dir} onRespond={onRespond} />}
    </div>
  );
};

// ---- 13 The chorus — name-led one-liners, capped at three -------------------
const Pg5Chorus = ({ res, cfg, dir, onRespond }) => {
  const [all, setAll] = p5aS(false);
  const list = [];
  if (res.showThought && res.thought) list.push(res.thought);
  (res.responses || []).forEach((r) => list.push(r));
  const shown = all ? list : list.slice(0, 3);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {shown.map((l, i) => (
        <div key={i} style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, lineHeight: 1.4, textWrap: 'pretty' }}>
          {cfg.names !== 'muted' && (
            <span style={{
              fontVariant: 'small-caps', letterSpacing: '0.04em', fontWeight: 600,
              fontSize: 11, color: 'var(--color-fg-3)', marginRight: 7,
            }}>{l.by}</span>
          )}
          <span style={{ fontWeight: 400, color: 'var(--color-fg-1)' }}>{l.text}</span>
        </div>
      ))}
      {list.length > shown.length && <P5aMore n={list.length - shown.length} onClick={() => setAll(true)} />}
      {res.canRespond && <P5aRespond dir={dir} onRespond={onRespond} />}
    </div>
  );
};

// ---- 16 The shelf talker — a nested small card, pinned left ------------------
const Pg5ShelfTalker = ({ n }) => (
  <div style={{
    background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-2)',
    borderRadius: 'var(--radius-md)', padding: '10px 12px', maxWidth: 300,
  }}>
    <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, lineHeight: 1.4, color: 'var(--color-fg-1)', textWrap: 'pretty' }}>
      {n.text}
    </div>
    <div style={{ marginTop: 6, textAlign: 'right', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 11, color: 'var(--color-fg-3)' }}>
      {n.by}
    </div>
  </div>
);

const Pg5Shelf = ({ res, cfg, dir, onRespond }) => {
  const [all, setAll] = p5aS(false);
  const list = [];
  if (res.showThought && res.thought) list.push(res.thought);
  (res.responses || []).forEach((r) => list.push(r));
  const shown = all ? list : list.slice(0, 2);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {shown.map((n, i) => <Pg5ShelfTalker key={i} n={n} />)}
      {list.length > shown.length && <P5aMore n={list.length - shown.length} onClick={() => setAll(true)} />}
      {res.canRespond && <P5aRespond dir={dir} onRespond={onRespond} />}
    </div>
  );
};

Object.assign(window, {
  Pg5Standfirst, Pg5Bracket, Pg5Chorus, Pg5ShelfTalker, Pg5Shelf,
});
