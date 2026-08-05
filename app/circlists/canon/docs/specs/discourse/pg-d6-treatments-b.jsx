// ============================================================================
// Discourse v6 — treatments B. Three mechanisms from pg-d6-data.jsx:
//   m5  Pg6HeldLine   The held line   — one line for the whole circle, replaced
//   m6  Pg6Weather    The weather     — no messages; a sentence derived from
//                      the reaction constellation
//   m7  Pg6Handing    The handing on  — a thought given to the next reader,
//                      shown to them before they read
// Each is a SYSTEM (pg-d6-data.jsx dispatch table), not a typographic variant
// of the other twelve. Read ideation-2026-08-05-discourse-v6-mechanics.md
// Part 3, M5/M6/M7, before touching this file.
//
// LOAD ORDER TRAP: this file loads BEFORE pg-d6-data.jsx (the treatments must
// exist before the dispatcher that names them), so anything pg-d6-data.jsx
// defines is not yet on window while this module's top level runs. Read any
// such value through an accessor called at RENDER time, never destructured up
// here. window.PGD4_RESPOND is a partial exception: pg-d4-content.jsx sets the
// base object before this file loads, but pg-d6-data.jsx only MERGES the m5/
// m6/m7 labels into it later — so even that lookup happens inside the
// component body (call time), never at module load.
// ============================================================================

const { useState: p6S } = React;

// ---- Shared bits -------------------------------------------------------------
// Respond-button label for a mechanism, resolved by cfg.treat ('m5'/'m6'/'m7'),
// read at call time so it sees the labels pg-d6-data.jsx merges in after us.
const p6RespondLabel = (treat, fallback) => {
  const map = window.PGD4_RESPOND;
  return (map && map[treat]) || fallback;
};

const P6Respond = ({ label, onRespond }) => (
  <button type="button" onClick={onRespond} className="d4-respond" style={{
    alignSelf: 'flex-start', background: 'transparent', border: '1px solid var(--color-border-1)',
    borderRadius: 'var(--radius-md)', padding: '8px 12px', minHeight: 40, cursor: 'pointer',
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--color-fg-1)',
  }}>{label}</button>
);

// ============================================================================
// M5 — The held line
// The item holds exactly one line for the whole circle. Speaking means
// replacing what is there; the person replaced is named and sees that it
// happened. The card never grows: one line, always. Superseded lines stack
// behind a quiet door, most recent first.
// ============================================================================

// Invented fixture: prior holders of the line, oldest first, keyed by item id
// ('d4-N', matching pg-d4-data.jsx's PGD4_ITEMS ids). Only items that have
// something worth contesting get an entry; everything else falls back to the
// v4 fixture's thought as the seed line, or to silence.
const PGD6_M5_STACK = {
  'd4-0': [ // martinfowler.com/cd-pipeline
    { by: 'Ada L.', text: 'Runbook first — Thursday only if we still have time after.' },
  ],
  'd4-1': [ // pragmaticengineer scaling-on-call
    { by: 'Marcus T.', text: 'Measuring the pod by tickets closed is the wrong yardstick.' },
    { by: 'Dev K.', text: 'The rota only works once the checklist replaces the ticket count.' },
  ],
  'd4-4': [ // go.dev/pipelines
    { by: 'Marcus T.', text: 'Our onboarding is the exact failure he describes in part two.' },
    { by: 'Priya N.', text: 'The onboarding doc is three years old — that is the whole argument.' },
  ],
  'd4-7': [ // go.dev/errors-are-values
    { by: 'Ada L.', text: 'The sentinel-error argument is the one I lost last month.' },
  ],
};

// The chain of everyone who has held the line, oldest first: the sharer's own
// line seeds it (if any), then the invented prior holders, then the current
// viewer's line if they hold it now. Read at call time, keyed by pk.
const p6HeldChain = (res, pk) => {
  const chain = [];
  if (res.thought) chain.push(res.thought);
  chain.push(...(PGD6_M5_STACK[pk] || []));
  if (res.mine) chain.push(res.mine);
  return chain;
};

const Pg6HeldLine = ({ res, cfg, dir, onRespond, pk }) => {
  const [open, setOpen] = p6S(false);
  const chain = p6HeldChain(res, pk);
  const current = chain.length ? chain[chain.length - 1] : null;
  const superseded = chain.slice(0, -1).reverse();
  const label = p6RespondLabel(cfg.treat, 'Replace the line');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {current ? (
        <p style={{
          margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontStyle: 'italic',
          fontSize: 15, lineHeight: 1.4, color: 'var(--color-fg-1)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {current.text}
          {cfg.names !== 'muted' && (
            <span style={{ fontStyle: 'normal', fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-3)' }}>
              {'  — ' + current.by}
            </span>
          )}
        </p>
      ) : (
        <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 400, fontStyle: 'italic', fontSize: 13, color: 'var(--color-fg-3)' }}>
          Nobody has set the line yet.
        </p>
      )}
      {superseded.length > 0 && (
        <div>
          <button type="button" onClick={() => setOpen((o) => !o)} className="d4-quiet" style={{
            background: 'transparent', border: 0, padding: '2px 0', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.03em', color: 'var(--color-fg-3)',
          }}>
            {open ? 'Hide' : (superseded.length === 1 ? '1 replaced' : superseded.length + ' replaced')}
          </button>
          {open && (
            <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 6, borderLeft: '1px solid var(--color-border-1)', paddingLeft: 10 }}>
              {superseded.map((l, i) => (
                <div key={i} style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12.5, lineHeight: 1.4, color: 'var(--color-fg-3)', textDecoration: 'line-through', textWrap: 'pretty' }}>
                  {l.text}
                  {cfg.names !== 'muted' && <span style={{ marginLeft: 6, fontWeight: 600, textDecoration: 'none' }}>{'— ' + l.by}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {res.canRespond && <P6Respond label={label} onRespond={onRespond} />}
    </div>
  );
};

// ============================================================================
// M6 — The weather
// No messages. A word attaches to a glyph as its label, and the card renders
// a sentence DERIVED from the reaction constellation — the only mechanism
// whose card content is computed, not authored. Must never sound composed;
// must never throw when a member has no reaction data at all.
// ============================================================================

// Invented fixture: reaction constellation per item, keyed by id. Not every
// item has one — the empty case renders a calm "quiet so far" line, never
// a crash. { name, intensity: 0..1, label? } — label is the optional word
// a member attached to their own glyph.
const PGD6_M6_CONSTELLATION = {
  'd4-0': [ // martinfowler.com/cd-pipeline
    { name: 'Sam R.', intensity: 0.86 },
    { name: 'Ada L.', intensity: 0.71 },
    { name: 'Marcus T.', intensity: 0.22 },
  ],
  'd4-1': [ // pragmaticengineer scaling-on-call
    { name: 'Priya N.', intensity: 0.94, label: 'the ending caught me off guard' },
    { name: 'Dev K.', intensity: 0.88, label: 'worth trying this week' },
    { name: 'Marcus T.', intensity: 0.62 },
    { name: 'Sam R.', intensity: 0.15 },
  ],
  'd4-4': [ // go.dev/pipelines
    { name: 'Priya N.', intensity: 0.92, label: 'our onboarding, almost line for line' },
    { name: 'Dev K.', intensity: 0.85 },
    { name: 'Ada L.', intensity: 0.58, label: 'the checklist is the fix, not a rewrite' },
    { name: 'Lena P.', intensity: 0.30 },
    { name: 'Sam R.', intensity: 0.12 },
  ],
  'd4-5': [ // jvns.ca/dns-resolvers
    { name: 'Marcus T.', intensity: 0.77 },
    { name: 'Dev K.', intensity: 0.68 },
    { name: 'Lena P.', intensity: 0.65 },
    { name: 'Ada L.', intensity: 0.20 },
  ],
};

const p6Constellation = (pk) => PGD6_M6_CONSTELLATION[pk] || [];

// Even-thirds quantiser — same rung boundaries the Swell's own intensity
// scale is built on (see app/swell-reactions.jsx: a little / moderately /
// deeply, evenly split over 0..1).
const p6Level = (t) => (t >= 2 / 3 ? 3 : t >= 1 / 3 ? 2 : 1);
const P6_VERB = { 3: 'Landed deeply for', 2: 'Landed for', 1: 'Glanced off' };

const p6JoinNames = (names) => {
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  if (names.length === 2) return names[0] + ' and ' + names[1];
  return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
};

// The card's whole claim: a shape, not a transcript. Only the top and bottom
// bands are named — the moderate middle is real in the data and silent in
// the sentence, which is what keeps it to one line regardless of headcount.
const p6WeatherSentence = (reactions) => {
  const withDepth = (reactions || []).filter((r) => r && r.name && r.intensity != null);
  if (!withDepth.length) return null;
  const groups = { 3: [], 2: [], 1: [] };
  withDepth.forEach((r) => groups[p6Level(r.intensity)].push(r.name));
  const present = [3, 2, 1].filter((lvl) => groups[lvl].length > 0);
  if (present.length === 1) {
    const lvl = present[0];
    return P6_VERB[lvl] + ' ' + p6JoinNames(groups[lvl]) + '.';
  }
  const top = present[0];
  const bottom = present[present.length - 1];
  const bottomVerb = top === bottom ? P6_VERB[bottom] : P6_VERB[bottom].charAt(0).toLowerCase() + P6_VERB[bottom].slice(1);
  return P6_VERB[top] + ' ' + p6JoinNames(groups[top]) + '; ' + bottomVerb + ' ' + p6JoinNames(groups[bottom]) + '.';
};

// Two most-intense labels, if any exist — the only authored words on the
// card, and even those are captions on a glyph, never prose about it.
const p6TopLabels = (reactions) => {
  const labeled = (reactions || []).filter((r) => r && r.label);
  labeled.sort((a, b) => (b.intensity || 0) - (a.intensity || 0));
  return labeled.slice(0, 2);
};

const Pg6Weather = ({ res, cfg, dir, onRespond, pk }) => {
  const reactions = p6Constellation(pk);
  const sentence = p6WeatherSentence(reactions);
  const labels = p6TopLabels(reactions);
  const label = p6RespondLabel(cfg.treat, 'Label your glyph');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {sentence ? (
        <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.5, color: 'var(--color-fg-2)', textWrap: 'pretty' }}>
          {sentence}
        </p>
      ) : (
        <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 400, fontStyle: 'italic', fontSize: 13, color: 'var(--color-fg-3)' }}>
          Quiet so far.
        </p>
      )}
      {labels.length > 0 && (
        <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12.5, lineHeight: 1.4, color: 'var(--color-fg-3)' }}>
          {labels.map((l, i) => (
            <span key={i}>
              {cfg.names !== 'muted' && <span style={{ fontWeight: 600 }}>{l.name + ': '}</span>}
              <span style={{ fontStyle: 'italic' }}>{'“' + l.label + '”'}</span>
              {i < labels.length - 1 ? '  ·  ' : ''}
            </span>
          ))}
        </p>
      )}
      {res.canRespond && <P6Respond label={label} onRespond={onRespond} />}
    </div>
  );
};

// ============================================================================
// M7 — The handing on
// A thought is not left on an item; it is given to the next member who reads
// it, and shown to them BEFORE they read — the one deliberate near-exception
// to reveal-on-read. On Active, nothing shows except, for the recipient
// alone, a quiet mono line: "passed to you". After reading it becomes an
// ordinary attributed line, and you may leave one for whoever reads next.
// ============================================================================

// Invented fixture: one pending handoff per item, keyed by id. The playground
// viewer is always "You", so a pending entry always renders for "you alone" —
// the one thing an unread card is allowed to carry here.
const PGD6_M7_HANDOFF = {
  'd4-0': { from: 'Sam R.', text: 'Skip to the rollback section — that’s the part worth arguing about.' },
  'd4-2': { from: 'Ada L.', text: 'Read the migration diagram twice; the caption undersells it.' },
  'd4-5': { from: 'Marcus T.', text: 'Stop after the second resolver diagram and guess the ending first.' },
};

const Pg6Handing = ({ res, cfg, dir, onRespond, pk }) => {
  const pending = PGD6_M7_HANDOFF[pk];
  const label = p6RespondLabel(cfg.treat, 'Hand it on');

  if (res.sealed) {
    // Reveal-on-read's one deliberate near-exception: a waiting handoff is
    // visible to its recipient alone, before they've read the item. Never
    // more than this one mono line, and nothing when nothing is waiting.
    if (!pending) return null;
    return (
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, letterSpacing: '0.03em', color: 'var(--color-fg-3)' }}>
        passed to you
      </div>
    );
  }

  // Read: what you received (if anything) becomes an ordinary attributed
  // line. If nothing was waiting but you already left your own, that's what
  // shows instead — never both, and never more than one line.
  const received = pending ? { by: pending.from, text: pending.text } : (res.mine || null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {received && (
        <div>
          {cfg.names !== 'muted' && (
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-3)', marginBottom: 3 }}>
              {received.by}
            </div>
          )}
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 14, lineHeight: 1.5, color: 'var(--color-fg-1)', textWrap: 'pretty' }}>
            {received.text}
          </div>
        </div>
      )}
      {res.canRespond && <P6Respond label={label} onRespond={onRespond} />}
    </div>
  );
};

Object.assign(window, {
  Pg6HeldLine, Pg6Weather, Pg6Handing,
});
