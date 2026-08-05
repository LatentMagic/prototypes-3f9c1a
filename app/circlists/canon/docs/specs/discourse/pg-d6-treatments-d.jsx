// ============================================================================
// Discourse v6 — treatments D. The last three systems: M11-M13 from
// ideation-2026-08-05-discourse-v6-mechanics.md Part 3.
//   M11 The quorum        words held from everyone until the circle reaches a
//                         threshold, then the full set arrives at once
//   M12 The second reader nothing on the card, ever — the record is a set of
//                         private paired exchanges, letters not posts
//   M13 The gathering     discourse does not attach to items at all — it lives
//                         in a periodic spread entered deliberately
// These are the two of the thirteen that put nothing on the card by design
// (M12, M13) plus the one that puts NOTHING until a threshold crosses (M11).
// Rendering the absence itself legibly is the job here, not the content.
//
// This file loads BEFORE pg-d6-data.jsx (the dispatcher that names these three
// components has to exist first), so nothing pg-d6-data.jsx defines is on
// `window` while this module's top level runs. Pg4Respond is safe to
// destructure directly — it comes from pg-d4-parts.jsx, which loads well
// before the v6 layer. PGD4_ITEMS / PGD4_MEMBERS are read through accessor
// functions anyway, at call time, since M13's spread needs the live fixture
// set and there is no reason to trust load order for data it does not have
// to trust it for.
//
// Fixture material the v4 set doesn't carry (a quorum-met flag per item, a
// gathering spread across several items) is invented below, kept small,
// voices drawn from PGD4_MEMBERS's existing cast, and for M13 drawn from the
// real PGD4_ITEMS so the spread reads as this circle's actual reading.
// ============================================================================

const { Pg4Respond: P6dRespond } = window;
const P6dItems = () => window.PGD4_ITEMS || [];
const P6dMembers = () => window.PGD4_MEMBERS || [];
const { useState: p6dS } = React;

const P6dMono = { fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-fg-3)' };
const P6dLink = { alignSelf: 'flex-start', background: 'transparent', border: 0, padding: '4px 0', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-2)' };

// ---- M11 — The quorum --------------------------------------------------------
// Rule: written freely, revealed to nobody until enough of the circle has
// read. Whether an item has reached quorum is invented per item id, so the
// eight fixture cards split between held and released rather than all one
// state. Kept as a plain boolean, never a count — a count reads as a progress
// bar toward a goal, which is exactly the pressure calm rules out.
const PGD6_M11_MET = { 'd4-0': true, 'd4-4': true, 'd4-7': true };

const Pg6Quorum = ({ res, cfg, dir, onRespond, pk }) => {
  // Reveal-on-read holds even for the circle's reveal: an unread item shows
  // nothing about where the room stands, same as every other mechanism.
  if (res.sealed) return <div style={P6dMono}>held</div>;

  const named = cfg.names !== 'muted';
  const met = !!PGD6_M11_MET[pk];
  const all = [];
  if (res.thought) all.push(res.thought);
  (res.responses || []).forEach((r) => all.push(r));

  if (!met || all.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={P6dMono}>held</div>
        {res.canRespond && <P6dRespond dir={dir} onRespond={onRespond} />}
      </div>
    );
  }

  // Released: the whole set, together, no per-line stagger and no dateline —
  // that absence of sequence is what makes it read as arrived rather than
  // accumulated. The heavier "released" label plus a hairline rule is the
  // only signal that a threshold was crossed at all.
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      <div style={{ ...P6dMono, color: 'var(--color-fg-2)' }}>released</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, borderTop: '1px solid var(--color-border-2)', paddingTop: 8 }}>
        {all.map((l, i) => (
          <div key={i} style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, lineHeight: 1.4, color: 'var(--color-fg-1)', textWrap: 'pretty' }}>
            {named && <span style={{ fontWeight: 600, color: 'var(--color-fg-2)' }}>{l.by + ': '}</span>}
            {l.text}
          </div>
        ))}
      </div>
      {res.canRespond && <P6dRespond dir={dir} onRespond={onRespond} />}
    </div>
  );
};

// ---- M12 — The second reader --------------------------------------------------
// Rule: the sharer's thought is sealed and released to each reader alone; only
// they can answer it, once, privately, back to the sharer. Nothing here is
// public, so nothing here shows on the card except the fact that it is
// happening elsewhere — the one honest line the binding constraints call for.
// The paired-exchange view is the real surface; it lives one tap in, styled
// as a set of small letters (sharer's line, one reader's answer), never a
// thread. Reuses res.thought as the sharer's sealed line and res.responses as
// each reader's private answer to it — the same fixture data, read as a
// different shape than every other mechanism reads it.
const Pg6SecondReader = ({ res, cfg, dir, onRespond }) => {
  const [open, setOpen] = p6dS(false);
  const named = cfg.names !== 'muted';
  const sharer = res.thought ? res.thought.by : null;
  const sharerLine = res.thought ? res.thought.text : null;
  const pairs = (res.responses || []).map((r) => ({ member: r.by, answer: r.text }));

  if (!sharerLine && pairs.length === 0) {
    return res.canRespond ? <P6dRespond dir={dir} onRespond={onRespond} /> : null;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={P6dMono}>sealed — answered privately, not shown here</div>
      {pairs.length > 0 && (
        <button type="button" onClick={() => setOpen((o) => !o)} className="d4-quiet" style={P6dLink}>
          {open ? 'Close the exchanges' : 'Open the exchanges'}
        </button>
      )}
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid var(--color-border-2)', paddingTop: 10 }}>
          {pairs.map((p, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 3, paddingBottom: 9, borderBottom: i < pairs.length - 1 ? '1px solid var(--color-border-1)' : 'none' }}>
              {named && sharer && <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 11.5, color: 'var(--color-fg-3)' }}>{sharer}</div>}
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontStyle: 'italic', fontSize: 13, lineHeight: 1.4, color: 'var(--color-fg-2)', textWrap: 'pretty' }}>{sharerLine}</div>
              {named && <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 11.5, color: 'var(--color-fg-3)', marginTop: 3 }}>{p.member}</div>}
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, lineHeight: 1.4, color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{p.answer}</div>
            </div>
          ))}
        </div>
      )}
      {res.canRespond && <P6dRespond dir={dir} onRespond={onRespond} />}
    </div>
  );
};

// ---- M13 — The gathering ------------------------------------------------------
// Rule: discourse does not attach to items. It gathers periodically into one
// spread, one line per item, landed by a single member. On the card this is
// the flattest treatment in the set: a mono line naming where discourse
// actually lives, and a quiet door into that week's spread — built as a real
// composed object, drawn from the circle's own reading (PGD4_ITEMS), not a
// per-item fixture, because the mechanism's whole point is that it is not
// per-item.
const p6dSpread = () => {
  const items = P6dItems();
  if (!items.length) return null;
  const members = P6dMembers();
  const chosen = items.slice(0, 5).map((it) => ({
    title: it.title || (it.url || '').replace(/^https?:\/\//, ''),
    line: (it.thought && it.thought.text) || (it.responses && it.responses[0] && it.responses[0].text) || 'Read, no line left behind.',
    by: (it.thought && it.thought.by) || it.sharer,
  }));
  const landedBy = members.find((m) => m !== 'You') || 'a member';
  return { chosen, landedBy };
};

const Pg6Spread = ({ named }) => {
  const spread = p6dSpread();
  if (!spread) return null;
  return (
    <div style={{
      background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-2)',
      borderRadius: 'var(--radius-md)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={P6dMono}>this week’s gathering</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {spread.chosen.map((row, i) => (
          <div key={i} style={{ paddingBottom: 8, borderBottom: i < spread.chosen.length - 1 ? '1px solid var(--color-border-1)' : 'none' }}>
            <div style={{
              fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-2)', marginBottom: 2,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{row.title}</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, lineHeight: 1.4, color: 'var(--color-fg-1)', textWrap: 'pretty' }}>
              {named && row.by && <span style={{ fontWeight: 600, color: 'var(--color-fg-3)' }}>{row.by + ': '}</span>}
              {row.line}
            </div>
          </div>
        ))}
      </div>
      {named && <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12, color: 'var(--color-fg-3)', textAlign: 'right' }}>{'Landed by ' + spread.landedBy}</div>}
    </div>
  );
};

const Pg6Gathering = ({ res, cfg, dir, onRespond }) => {
  const [open, setOpen] = p6dS(false);
  const named = cfg.names !== 'muted';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={P6dMono}>discourse gathers elsewhere, not on this card</div>
      <button type="button" onClick={() => setOpen((o) => !o)} className="d4-quiet" style={P6dLink}>
        {open ? 'Close the gathering' : 'Open this week’s gathering'}
      </button>
      {open && <Pg6Spread named={named} />}
      {res.canRespond && <P6dRespond dir={dir} onRespond={onRespond} />}
    </div>
  );
};

Object.assign(window, {
  Pg6Quorum, Pg6SecondReader, Pg6Gathering,
});
