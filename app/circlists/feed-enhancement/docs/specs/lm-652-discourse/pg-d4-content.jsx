// ============================================================================
// Discourse v4 — the treatments.
// Ten designed typographic answers to "how does contributed content sit on a
// card", over ONE fixture. This file is the exploration: if two of these
// screenshot the same, the set has one fewer direction than it claims.
//   invite    the sharer's line IS the headline (card inversion, in the card)
//   ledger    paired brackets — a thought and the note answering it, as one unit
//   margin    a narrow gutter outside the measure, initials not names
//   qa        a question a size up; answers stacked and subordinate
//   same      no prose — faces under the sentence they agreed with
//   epigraph  sentence first, attribution after an em dash
//   stem      label-led: the app's words stay, in bold, above yours
//   rows      (record) a member's glyph stands where their avatar would
//   labels    (record) words pinned at their author's glyph on the disc
//   page      (table) attribution in the margin, paragraphs in the column
// ============================================================================

const { Avatar: P4cAvatar } = window;
const { Pg4Same, Pg4SameBtn, p4First } = window;
const { useState: p4cS } = React;

const PGD4_RESPOND = {
  invite: 'Say what you took', notes: 'Pass a note back', margin: 'Add to the margin',
  ask: 'Answer', same: 'Same', prompt: 'Add yours', stems: 'Finish a sentence',
  door: 'Open the door', swell: 'Open the door', table: 'Take it to the table',
};

const Pg4Respond = ({ dir, onRespond, align }) => (
  <button type="button" onClick={onRespond} className="d4-respond" style={{
    alignSelf: align || 'flex-start', background: 'transparent',
    border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-md)',
    padding: '8px 12px', minHeight: 40, cursor: 'pointer',
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--color-fg-1)',
  }}>{PGD4_RESPOND[dir.id] || 'Respond'}</button>
);

const Pg4More = ({ n, onClick, style }) => (
  <button type="button" onClick={onClick} className="d4-quiet" style={{
    alignSelf: 'flex-start', background: 'transparent', border: 0, padding: '4px 0', cursor: 'pointer',
    fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-3)', ...style,
  }}>{n} more</button>
);

// ---- 01 The invitation — the card's headline slot ---------------------------
// Not a block under the card: the sharer's sentence takes the title's place and
// the article drops to a source-and-title line. The biggest type on the card
// belongs to a member.
const Pg4Invite = ({ thought, cfg }) => (
  <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 17, lineHeight: 1.4, letterSpacing: '-0.005em', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{thought.text}</p>
);

// ---- 02 Passing notes — the paired ledger ----------------------------------
const Pg4Pair = ({ head, note, cfg }) => (
  <div style={{ borderLeft: '2px solid var(--color-border-1)', paddingLeft: 13, display: 'flex', flexDirection: 'column', gap: 7 }}>
    {head && (
      <div>
        {cfg.names !== 'muted' && <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-3)', marginBottom: 2 }}>{head.by}</div>}
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 14.5, lineHeight: 1.5, color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{head.text}</div>
      </div>
    )}
    {note && (
      <div style={{ paddingLeft: 15 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginBottom: 2 }}>
          {cfg.names !== 'muted' && <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-3)' }}>{note.by}</span>}
          {note.to && <span className="d4-eyebrow">to {p4First(note.to)}</span>}
        </div>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.5, color: 'var(--color-fg-2)', textWrap: 'pretty' }}>{note.text}</div>
      </div>
    )}
  </div>
);

const Pg4Ledger = ({ res, cfg, dir, onRespond }) => {
  const [all, setAll] = p4cS(false);
  const paired = [];
  const loose = [];
  (res.responses || []).forEach((r) => {
    if (r.to && res.thought && r.to === res.thought.by) paired.push(r); else loose.push(r);
  });
  const pairs = [];
  if (res.showThought && res.thought) pairs.push({ head: res.thought, note: paired.shift() || null });
  paired.forEach((r) => pairs.push({ head: null, note: r }));
  loose.forEach((r) => pairs.push({ head: null, note: r }));
  const shown = all ? pairs : pairs.slice(0, 2);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {shown.map((p, i) => <Pg4Pair key={i} head={p.head} note={p.note} cfg={cfg} />)}
      {pairs.length > shown.length && <Pg4More n={pairs.length - shown.length} onClick={() => setAll(true)} />}
      {res.canRespond && <Pg4Respond dir={dir} onRespond={onRespond} />}
    </div>
  );
};

// ---- 03 Marginalia — a gutter outside the measure ---------------------------
const Pg4Margin = ({ res, cfg, dir, onRespond }) => {
  const notes = [];
  if (res.showThought && res.thought) notes.push(res.thought);
  (res.responses || []).forEach((r) => notes.push(r));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
      {notes.map((n, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <span className="d4-initials" title={n.by}>{String(n.by).split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12.5, lineHeight: 1.5, color: 'var(--color-fg-2)', textWrap: 'pretty' }}>{n.text}</span>
        </div>
      ))}
      {res.canRespond && (
        <button type="button" onClick={onRespond} className="d4-quiet" style={{
          alignSelf: 'flex-start', background: 'transparent', border: 0, padding: '4px 0', cursor: 'pointer',
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-2)',
        }}>Add to the margin</button>
      )}
    </div>
  );
};

// ---- 04 The question — a head, and answers under it ------------------------
const Pg4QA = ({ res, cfg, dir, onRespond }) => {
  const [all, setAll] = p4cS(false);
  const list = res.responses || [];
  const shown = all ? list : list.slice(0, 2);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {res.showThought && res.thought && (
        <div>
          <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 19, lineHeight: 1.35, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{res.thought.ask}</p>
          {cfg.names !== 'muted' && <div style={{ marginTop: 6, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-3)' }}>{res.thought.by} asked</div>}
        </div>
      )}
      {shown.length > 0 && (
        <div style={{ paddingLeft: 16, borderTop: '1px solid var(--color-border-2)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {shown.map((r, i) => (
            <div key={i}>
              {cfg.names !== 'muted' && <div className="d4-eyebrow" style={{ marginBottom: 3 }}>{r.by === 'You' ? 'You' : r.by}</div>}
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: (r.r || 1) > 1 ? 600 : 400, fontSize: 14, lineHeight: 1.5, color: (r.r || 1) > 1 ? 'var(--color-fg-1)' : 'var(--color-fg-2)', textWrap: 'pretty' }}>
                {(r.r || 1) > 1 && r.q ? r.q : r.text}
              </div>
            </div>
          ))}
          {list.length > shown.length && <Pg4More n={list.length - shown.length} onClick={() => setAll(true)} />}
        </div>
      )}
      {res.canRespond && <Pg4Respond dir={dir} onRespond={onRespond} />}
    </div>
  );
};

// ---- 05 Same — pointing, not prose -----------------------------------------
const Pg4SameSet = ({ res, cfg, dir, onRespond, pointed, onPoint, pk }) => {
  const list = res.responses || [];
  const tk = pk + '-t';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      {res.showThought && res.thought && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
            <span style={{ paddingTop: 1 }}><P4cAvatar name={res.thought.by} size={22} accent={res.thought.by === 'You'} /></span>
            <span style={{ minWidth: 0, flex: 1, fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 14.5, lineHeight: 1.5, color: 'var(--color-fg-1)', textWrap: 'pretty' }}>
              {cfg.names !== 'muted' && <span style={{ fontWeight: 600, fontSize: 13, marginRight: 6 }}>{res.thought.by}</span>}
              {res.thought.text}
            </span>
          </div>
          {!res.sealed && (
            <div style={{ paddingLeft: 31, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <Pg4Same names={(pointed || {})[tk] ? [...(res.thought.same || []), 'You'] : (res.thought.same || [])} cfg={cfg} />
              <Pg4SameBtn on={!!(pointed || {})[tk]} cfg={cfg} onClick={() => onPoint(tk)} />
            </div>
          )}
        </div>
      )}
      {list.map((r, i) => (
        <div key={i} style={{ paddingLeft: 31, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <P4cAvatar name={r.by} size={18} accent={r.by === 'You'} />
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--color-fg-1)' }}>{'\u201C' + (r.word || r.text.split(' ').slice(0, 2).join(' ')) + '\u201D'}</span>
          </span>
          {(r.same || []).length > 0 && <span style={{ paddingLeft: 26 }}><Pg4Same names={r.same} cfg={cfg} /></span>}
        </div>
      ))}
    </div>
  );
};

// ---- 06 The vanishing prompt — epigraphs ------------------------------------
const Pg4Epigraphs = ({ res, cfg, dir, onRespond }) => {
  const [all, setAll] = p4cS(false);
  const lines = [];
  if (res.showThought && res.thought) lines.push(res.thought);
  (res.responses || []).forEach((r) => lines.push(r));
  const shown = all ? lines : lines.slice(0, 2);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {res.takeaway && (
        <div>
          <div className="d4-eyebrow" style={{ marginBottom: 5 }}>what the circle took</div>
          <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 16, lineHeight: 1.45, color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{res.takeaway.text}</p>
        </div>
      )}
      {shown.map((l, i) => (
        <div key={i}>
          <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 15, lineHeight: 1.5, color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{l.text}</p>
          <div style={{ marginTop: 5, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-3)' }}>{'\u2014 ' + (cfg.names === 'muted' ? p4First(l.by) : l.by)}</div>
        </div>
      ))}
      {lines.length > shown.length && <Pg4More n={lines.length - shown.length} onClick={() => setAll(true)} />}
      {res.canRespond && <Pg4Respond dir={dir} onRespond={onRespond} />}
    </div>
  );
};

// ---- 07 Guided statements — the stem stays ---------------------------------
const Pg4StemSet = ({ res, cfg, dir, onRespond }) => {
  const lines = [];
  if (res.thought) lines.push(res.thought);
  (res.responses || []).forEach((r) => lines.push(r));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
      {lines.map((l, i) => (
        <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
          <span style={{ paddingTop: 1 }}><P4cAvatar name={l.by} size={22} accent={l.by === 'You'} /></span>
          <span style={{ minWidth: 0, flex: 1, fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.5, textWrap: 'pretty' }}>
            {cfg.names !== 'muted' && <span style={{ fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-3)', display: 'block', marginBottom: 1 }}>{l.by}</span>}
            <span style={{ fontWeight: 600, color: 'var(--color-fg-1)' }}>{l.stem[0]} </span>
            <span style={{ fontWeight: 400, color: 'var(--color-fg-2)' }}>{l.stem[1]}.</span>
          </span>
        </div>
      ))}
      {res.canRespond && <Pg4Respond dir={dir} onRespond={onRespond} />}
    </div>
  );
};

// ---- Dispatch --------------------------------------------------------------
const Pg4Treatment = (props) => {
  const t = props.cfg.treat;
  if (t === 'ledger') return <Pg4Ledger {...props} />;
  if (t === 'margin') return <Pg4Margin {...props} />;
  if (t === 'qa') return <Pg4QA {...props} />;
  if (t === 'same') return <Pg4SameSet {...props} />;
  if (t === 'epigraph') return <Pg4Epigraphs {...props} />;
  if (t === 'stem') return <Pg4StemSet {...props} />;
  return null;
};

Object.assign(window, {
  Pg4Treatment, Pg4Invite, Pg4Ledger, Pg4Margin, Pg4QA, Pg4SameSet,
  Pg4Epigraphs, Pg4StemSet, Pg4Respond, Pg4More, PGD4_RESPOND,
});
