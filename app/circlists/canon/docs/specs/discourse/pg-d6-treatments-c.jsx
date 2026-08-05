// ============================================================================
// Discourse v6 — treatments C. Three mechanisms: M8 The baton, M9 The closing,
// M10 Ink. Read ideation-2026-08-05-discourse-v6-mechanics.md Part 3 (M8-M10
// in full) before touching this file — the rule for each comes from there.
//
// LOAD-ORDER TRAP (see pg-d5-treatments-b.jsx header): this file loads BEFORE
// pg-d6-data.jsx, so PGD4_MEMBERS / PGD4_RESPOND exist on window already (they
// come from pg-d4-data.jsx / pg-d4-content.jsx, both earlier), but anything
// pg-d6-data.jsx itself defines is not yet there. Read everything through
// call-time accessor functions below, never destructure at module load.
// ============================================================================

const p6cMembers = () => window.PGD4_MEMBERS || ['You'];
const p6cRespondLabel = (cfg) => (window.PGD4_RESPOND || {})[cfg.treat] || 'Respond';
const { Avatar: P6cAvatar } = window;

// Small deterministic hash so fixtures keyed by item id are stable and plausible
// without needing real randomness or a server.
const p6cHash = (s) => { let h = 0; s = String(s || ''); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };

const P6cRespondBtn = ({ cfg, onRespond, label }) => (
  <button type="button" onClick={onRespond} className="d4-respond" style={{
    alignSelf: 'flex-start', background: 'transparent',
    border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-md)',
    padding: '8px 12px', minHeight: 40, cursor: 'pointer',
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--color-fg-1)',
  }}>{label || p6cRespondLabel(cfg)}</button>
);

// ============================================================================
// M8 — The baton. Only one member may hold the floor on an item at a time.
// Two lines maximum, ever: the spoken line, plus (only when the floor is
// free) a single hairline mark. Nothing on an unread card — reveal-on-read
// holds for this mechanism same as any other; the floor is content, not a
// presence marker.
// ============================================================================

// Fixture: who holds the floor on each item, and the line that's on record.
// Six of the eight v4 seed items get an explicit state; anything else falls
// back to a hashed-but-stable derivation so the treatment never throws.
const PGD6_BATON = {
  'd4-0': { holder: null, line: { by: 'Ada L.', text: 'Worth putting on Thursday, if Marcus is free to open.' } },
  'd4-1': { holder: 'Marcus T.', line: { by: 'Marcus T.', text: 'Still holding this one — want to fold in the on-call rota before I pass it.' } },
  'd4-3': { holder: 'Dev K.', line: { by: 'Dev K.', text: 'Taking this — I want to lay out the migration risk before anyone else jumps in.' } },
  'd4-4': { holder: null, line: { by: 'Lena P.', text: 'Same as our onboarding doc, almost line for line. Floor’s open if anyone wants it.' } },
  'd4-5': { holder: null, line: null },
  'd4-7': { holder: 'You', line: { by: 'You', text: 'Holding this — still deciding if I’d take the sentinel-error side again.' } },
};

const p6cBaton = (pk, res) => {
  if (PGD6_BATON[pk]) return PGD6_BATON[pk];
  const members = p6cMembers().filter((m) => m !== 'You');
  const h = p6cHash(pk);
  const open = h % 3 === 0;
  const speaker = members[h % Math.max(members.length, 1)] || 'A member';
  const fallbackText = (res && res.thought && res.thought.text) || 'Marked it read, nothing added yet.';
  return { holder: open ? null : speaker, line: { by: speaker, text: fallbackText } };
};

const Pg6Baton = ({ res, cfg, dir, onRespond, pk }) => {
  if (res.sealed) return null; // reveal-on-read: floor state is content, not a marker.
  const b = p6cBaton(pk, res);
  const held = !!b.holder;
  const youHold = b.holder === 'You';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {b.line ? (
        <div>
          {cfg.names !== 'muted' && (
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-3)' }}>
              {b.line.by}{held ? '  ·  holding the floor' : ''}
            </span>
          )}
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 14, lineHeight: 1.5, color: 'var(--color-fg-1)', textWrap: 'pretty', marginTop: cfg.names !== 'muted' ? 3 : 0 }}>
            {b.line.text}
          </div>
        </div>
      ) : (
        !held && (
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, fontStyle: 'italic', color: 'var(--color-fg-3)' }}>
            Nobody has taken the floor yet.
          </div>
        )
      )}
      {!held && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span aria-hidden="true" style={{ width: 22, height: 1, background: 'var(--color-border-1)', display: 'inline-block' }} />
          <span className="d4-eyebrow">floor's open</span>
        </div>
      )}
      {res.canRespond && !youHold && (
        <P6cRespondBtn cfg={cfg} onRespond={onRespond} label={held ? undefined : 'Take the floor'} />
      )}
    </div>
  );
};

// ============================================================================
// M9 — The closing. Nothing may be said while the item is live. Absolutely
// nothing on Active, ever — not even a marker; that silence is the whole
// claim on bloat. Once the last member marks it read, the item closes and
// opens exactly one round: everybody's line, revealed together, sealed.
// ============================================================================

// Fixture: which read items have closed (everyone's read it), and the round
// that resolved when they did. Undefined items stay open (no round yet) —
// the honest default, since most items are still being read by somebody.
const PGD6_CLOSING = {
  'd4-4': {
    closed: true,
    round: [
      { by: 'Marcus T.', text: 'Ours, almost exactly — we just never named it.' },
      { by: 'Priya N.', text: 'The checklist should have existed a year ago.' },
      { by: 'Ada L.', text: 'I would hand this to a new starter in week one.' },
      { by: 'Dev K.', text: 'Ownership wearing a documentation costume, and I mean that kindly.' },
      { by: 'You', text: 'Line for line. Uncomfortable to read.' },
    ],
  },
  'd4-7': {
    closed: true,
    round: [
      { by: 'Ada L.', text: 'I lost that argument once and I would lose it again.' },
      { by: 'Dev K.', text: 'Sentinel errors, every time, no regrets.' },
      { by: 'You', text: 'You were right. I would take it again anyway.' },
    ],
  },
};

const p6cClosing = (pk) => PGD6_CLOSING[pk] || { closed: false, round: [] };

const Pg6Closing = ({ res, cfg, dir, onRespond, pk }) => {
  if (res.sealed) return null; // Active: absolutely nothing, ever.
  const c = p6cClosing(pk);
  if (!c.closed) return null; // Read but still live: still silent until it closes.
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="d4-eyebrow">closed · revealed together</div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px 16px',
      }}>
        {c.round.map((l, i) => (
          <div key={i} style={{ minWidth: 0 }}>
            {cfg.names !== 'muted' && (
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 11.5, color: 'var(--color-fg-3)', marginBottom: 2 }}>{l.by}</div>
            )}
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, lineHeight: 1.4, color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{l.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// M10 — Ink. Ordinary attributed lines, capped at two on the card — the card
// is the least interesting part of this one. The real surface is the
// composer, which this playground can't fully render, so the card carries a
// quiet, wordy (never numeric, never a bar) sense of what spending here
// would cost, right beside the respond control.
// ============================================================================

// Fixture: each member's remaining ink, expressed only as a band — never a
// number. Global-ish (ink is a whole-circle budget), keyed by member name so
// it stays stable across cards.
const PGD6_INK_BAND = {
  'You': 'a little ink left',
  'Marcus T.': 'plenty of ink left',
  'Priya N.': 'getting low',
  'Sam R.': 'plenty of ink left',
  'Ada L.': 'a little ink left',
  'Dev K.': 'nearly spent for now',
  'Lena P.': 'plenty of ink left',
};

const p6cInkBand = (who) => PGD6_INK_BAND[who] || 'plenty of ink left';

const Pg6Ink = ({ res, cfg, dir, onRespond }) => {
  const lines = [];
  if (res.showThought && res.thought) lines.push(res.thought);
  (res.responses || []).forEach((r) => lines.push(r));
  const shown = lines.slice(0, 2);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {shown.map((l, i) => (
        <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
          <span style={{ paddingTop: 1 }}><P6cAvatar name={l.by} size={20} accent={l.by === 'You'} /></span>
          <span style={{ minWidth: 0, flex: 1, fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.5, color: 'var(--color-fg-1)', textWrap: 'pretty' }}>
            {cfg.names !== 'muted' && <span style={{ fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-3)', marginRight: 6 }}>{l.by}</span>}
            {l.text}
          </span>
        </div>
      ))}
      {res.canRespond && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
          <P6cRespondBtn cfg={cfg} onRespond={onRespond} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-fg-3)' }}>
            {p6cInkBand('You') + ' · reactions stay free'}
          </span>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { Pg6Baton, Pg6Closing, Pg6Ink });
