// ============================================================================
// Discourse v6 — treatments A. Four systems, not typography: M1-M4 from
// ideation-2026-08-05-discourse-v6-mechanics.md Part 3.
//   M1 Second pass    a reflection that could only have been written later
//   M2 Change of heart the reaction moving IS the door into words
//   M3 The passage    a marked fragment of the piece, not a comment
//   M4 Standing note  the circle's CURRENT view, one line per member forever
// Each renders only what its own mechanism produces — no shared "note" look.
// Reveal-on-read holds: every one of the four returns null on res.sealed
// (Active tab), because none of this content is legitimately visible before
// you have read the item yourself.
//
// This file loads BEFORE pg-d6-data.jsx (the dispatcher that names these four
// components has to exist first), so nothing pg-d6-data.jsx defines is on
// `window` while this module's top level runs. Nothing here needs it anyway —
// Avatar / Pg4Respond / PGD4_RESPOND / RX_GLYPHS all come from files that load
// well before the v6 layer, so destructuring those at module load is safe;
// the trap is only ever pg-d6-data.jsx's own exports.
//
// Fixture material the v4 set doesn't carry (dateline for a returned pass, a
// glyph-move trail, a marked passage, a "changed at" ordering) is invented
// below, keyed by the item's short id (pk, e.g. 'd4-4') and read at call
// time. Kept small, voices drawn from PGD4_MEMBERS's existing cast.
// ============================================================================

const { Avatar: P6aAvatar, Pg4Respond: P6aRespond, RX_GLYPHS: P6aGlyphs } = window;

// ---- Invented fixtures, keyed by item id (PGD4_ITEMS[i].id === 'd4-' + i) --

// M1 — how long ago the oldest shown reflection was, for the compressed line.
const PGD6_M1_DATES = {
  'd4-4': 'first pass three weeks back',
  'd4-5': 'first pass last month',
  'd4-7': 'first pass a fortnight back',
};

// M2 — at most one trail per member per item. Most items carry none, which is
// the point: quiet is the expected state, not a bug in the fixture.
const PGD6_M2_TRAILS = {
  'd4-4': [{ by: 'Priya N.', from: 1, to: 0, text: 'It went deeper.' }],
  'd4-7': [{ by: 'Ada L.', from: 3, to: 1, text: 'It landed differently.' }],
};

// M3 — the single most-marked passage per item, plus how many members marked
// the same one (drives rule weight, not content).
const PGD6_M3 = {
  'd4-0': { quote: 'measuring platform teams by tickets closed keeps failing us', by: 'Priya N.', words: 'the line that made me stop scrolling and reread', marks: 2 },
  'd4-4': { quote: 'the platform team ends up owning every migration nobody else wants', by: 'Lena P.', words: 'this is the whole argument, one sentence', marks: 3 },
  'd4-5': { quote: 'our onboarding is exactly the failure he describes in part two', by: 'Ada L.', words: 'true of us, uncomfortably so', marks: 1 },
  'd4-7': { quote: 'the bit on sentinel errors is the argument I lost last month', by: 'Dev K.', words: 'the rematch I was not expecting', marks: 1 },
};

// ---- M1 — The second pass ---------------------------------------------------
// Rule: cannot write at the moment of reading. Words become possible only when
// the item comes back around. Legible as "returned to", not "owed": the
// eyebrow names the act as something that already happened to you, past
// tense, never a prompt to go do it.
const Pg6SecondPass = ({ res, cfg, dir, onRespond, pk }) => {
  if (res.sealed) return null; // nothing on Active
  const named = cfg.names !== 'muted';
  const all = [];
  if (res.showThought && res.thought) all.push(res.thought);
  (res.responses || []).forEach((r) => all.push(r));
  if (all.length === 0) {
    return res.canRespond ? <P6aRespond dir={dir} onRespond={onRespond} /> : null;
  }
  const shown = all.slice(-3);
  const compressOldest = shown.length > 1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-fg-3)' }}>
        second pass
      </div>
      {shown.map((l, i) =>
        i === 0 && compressOldest ? (
          <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-fg-3)' }}>
            {(named ? l.by + ' — ' : '') + (PGD6_M1_DATES[pk] || 'from an earlier pass')}
          </div>
        ) : (
          <div key={i}>
            {named && <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-3)', marginBottom: 2 }}>{l.by}</div>}
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.45, color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{l.text}</div>
          </div>
        )
      )}
      {res.canRespond && <P6aRespond dir={dir} onRespond={onRespond} />}
    </div>
  );
};

// ---- M2 — Change of heart ---------------------------------------------------
// Rule: words unlock only when the reaction moves. Legible as a small ghost-
// to-solid glyph trail, never as a comment — the sentence sits on the LINE
// connecting the two positions, not under a name, so the movement itself is
// the subject.
const Pg6ChangeOfHeart = ({ res, cfg, dir, onRespond, pk }) => {
  if (res.sealed) return null;
  const named = cfg.names !== 'muted';
  const trails = PGD6_M2_TRAILS[pk] || [];
  const glyphs = P6aGlyphs || ['❤️', '🔥', '👍', '💡', '😂'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {trails.map((t, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span aria-hidden="true" style={{ fontSize: 15, opacity: 0.32, filter: 'grayscale(1)' }}>{glyphs[t.from]}</span>
          <span aria-hidden="true" style={{ flex: '0 0 20px', height: 1, background: 'var(--color-border-1)' }} />
          <span aria-hidden="true" style={{ fontSize: 17 }}>{glyphs[t.to]}</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, lineHeight: 1.4, color: 'var(--color-fg-2)', marginLeft: 2, textWrap: 'pretty' }}>
            {named && <span style={{ fontWeight: 600, color: 'var(--color-fg-3)' }}>{t.by + ' — '}</span>}
            {t.text}
          </span>
        </div>
      ))}
      {res.canRespond && <P6aRespond dir={dir} onRespond={onRespond} />}
    </div>
  );
};

// ---- M3 — The passage --------------------------------------------------------
// Rule: no prose — a marked fragment plus up to eight words. Legible as
// underlining, not commentary: the quote sits in the source's own register
// (mono-adjacent, hairline rule) rather than as a member's speech bubble, and
// the rule thickens with agreement instead of the card growing.
const Pg6Passage = ({ res, cfg, dir, onRespond, pk }) => {
  if (res.sealed) return null;
  const named = cfg.names !== 'muted';
  const p = PGD6_M3[pk];
  if (!p) return res.canRespond ? <P6aRespond dir={dir} onRespond={onRespond} /> : null;
  const words = p.words.split(' ').slice(0, 8).join(' ');
  const ruleW = Math.min(1 + (p.marks - 1), 4);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <div aria-hidden="true" style={{ flex: '0 0 ' + ruleW + 'px', background: 'var(--color-fg-3)', borderRadius: 1 }} />
        <blockquote style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.5, color: 'var(--color-fg-1)', textWrap: 'pretty' }}>
          {'“' + p.quote + '”'}
        </blockquote>
      </div>
      <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12.5, lineHeight: 1.4, color: 'var(--color-fg-3)', paddingLeft: ruleW + 10 }}>
        {named && <span style={{ fontWeight: 600 }}>{p.by + ' — '}</span>}
        {words}
        {p.marks > 1 && <span>{'  ·  marked by ' + p.marks}</span>}
      </div>
      {res.canRespond && <P6aRespond dir={dir} onRespond={onRespond} />}
    </div>
  );
};

// ---- M4 — The standing note ---------------------------------------------------
// Rule: one line per member, forever, rewritable — the card shows the circle's
// CURRENT view, never its history. Legible as a roster of present-tense
// statements: no dateline, no "edited" mark, nothing that implies a past
// version exists. Ceiling of one line per member is structural (the source
// data already carries no more than one line per name); the card shows only
// the three most recent.
const Pg6Standing = ({ res, cfg, dir, onRespond, pk }) => {
  if (res.sealed) return null;
  const named = cfg.names !== 'muted';
  const all = [];
  if (res.showThought && res.thought) all.push(res.thought);
  (res.responses || []).forEach((r) => all.push(r));
  if (all.length === 0) {
    return res.canRespond ? <P6aRespond dir={dir} onRespond={onRespond} /> : null;
  }
  const shown = all.slice(-3);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {shown.map((l, i) => (
        <div key={i} style={{ fontFamily: 'var(--font-sans)', fontSize: 13, lineHeight: 1.4, textWrap: 'pretty' }}>
          {named && <span style={{ fontWeight: 600, color: 'var(--color-fg-2)' }}>{l.by + ': '}</span>}
          <span style={{ fontWeight: 400, color: 'var(--color-fg-1)' }}>{l.text}</span>
        </div>
      ))}
      {res.canRespond && <P6aRespond dir={dir} onRespond={onRespond} />}
    </div>
  );
};

Object.assign(window, {
  Pg6SecondPass, Pg6ChangeOfHeart, Pg6Passage, Pg6Standing,
});
