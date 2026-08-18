// ============================================================================
// Discourse v8 — RETURN: the half that gathers, and carries you there.
//
// The first half is the MARK: a watched card says something has been said on
// it. A mark only works if you are already looking at the card — and the Read
// tab silts up. A fortnight in, the card you were part of is a hundred down and
// you cannot find it again. So the mark alone leaves the member hunting, which
// is exactly what the rule forbids.
//
// This file is the other half: what gathers the watched cards with something
// new, and what carries the member to one of them. Five answers, one per state,
// spanning where the gathering sits and how loud it is:
//
//   1  disc   a pill under the tabs; tap it and you travel to the next one
//   2  back   the changed cards held out of the pile, as a stack you open
//   3  lift   nothing at all — the order does it, under one hairline
//   4  line   a strip that speaks the newest line, on both tabs
//   5  page   a doorway to a small screen of the pages still moving
//
// Every one of them: no count, no badge, no tally. Clears on arrival. One
// affordance for every member. Reachable by hand as well as by the driver.
// ============================================================================
const { d8Watching: rtWatching, d8HasNew: rtHasNew, d8New: rtNew } = window;

const d8Title = (item) => item.title || window.d8DeriveTitle(item.url) || window.d8HostOf(item.url);
// The gathered set: cards you have read, are part of, and that have moved since
// you last looked. Never the circle's activity at large.
const d8Wanted = (items, st) => (items || []).filter(i => i.read && rtWatching(i) && rtHasNew(i, st && st.countBareReactions));
const d8NewSaid = (item, st) => rtNew(item, st && st.countBareReactions).filter(e => e && e.text);
const d8NewGlyphs = (wanted, st) => {
  const out = [];
  (wanted || []).forEach(i => rtNew(i, st && st.countBareReactions).forEach(e => {
    if (e.glyph && !out.includes(e.glyph)) out.push(e.glyph);
  }));
  return out.slice(0, 3);
};
const d8Spoke = (wanted, st) => {
  const out = [];
  (wanted || []).forEach(i => d8NewSaid(i, st).forEach(e => { if (!out.includes(e.by)) out.push(e.by); }));
  return out;
};

// ============================================================================
// 1 — HELD IN THE DISC → the pill that walks you through them
// The app already owns this shape: NewPill, parked under the tabs, sticky, no
// count. Here it carries the glyphs of what was said and takes you to the next
// card each time you tap it — travel, not a list. When there is nothing left to
// go to, the pill is not there.
// ============================================================================
const D8DiscPill = ({ wanted, st, goTo }) => {
  if (!wanted.length) return null;
  const glyphs = d8NewGlyphs(wanted, st);
  return (
    <button type="button" className="circ-newpill" onClick={() => goTo(wanted[0])}
      aria-label="Go to the next card the circle is still talking on">
      {glyphs.length
        ? <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center' }}>
            {glyphs.map((g, i) => <span key={i} style={{ fontSize: 14, lineHeight: 1, marginLeft: i ? -3 : 0 }}>{g}</span>)}
          </span>
        : <span aria-hidden="true" style={{ display: 'inline-flex' }}><window.MicroDot size={9} /></span>}
      Still talking
    </button>
  );
};

// ============================================================================
// 2 — THE BACK OF THE CARD → held out of the pile
// The state's grammar is physical cards, so the gathering is physical too: the
// cards whose backs have changed are held out of the pile as a short stack.
// Open it and Read shows only those, until you put them back. The set is frozen
// as you open it, so turning a card does not make the pile shuffle under you.
// ============================================================================
const D8HeldOut = ({ wanted, held, setHeld }) => {
  if (held) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 2px 2px' }}>
      <span style={{ flex: 1, minWidth: 0, font: '500 11px/1 var(--font-mono)', letterSpacing: '0.06em', color: 'var(--color-fg-3)' }}>held out of the pile</span>
      <button type="button" onClick={() => setHeld(null)} className="circ-textlink" style={{
        background: 'transparent', border: 0, padding: '8px 0', margin: '-8px 0', minHeight: 40, cursor: 'pointer',
        font: '500 13px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>Put them back</button>
    </div>
  );
  if (!wanted.length) return null;
  const n = Math.min(3, wanted.length);
  return (
    <button type="button" onClick={() => setHeld(wanted.map(i => i.id))} className="circ-d8-heldout" style={{
      display: 'flex', alignItems: 'center', gap: 14, width: '100%', minHeight: 56, padding: '10px 14px', cursor: 'pointer',
      background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)', textAlign: 'left' }}>
      <span aria-hidden="true" style={{ position: 'relative', width: 44, height: 30, flexShrink: 0 }}>
        {[2, 1, 0].filter(k => k < n).map(k => (
          <span key={k} style={{ position: 'absolute', left: k * 6, top: k * 3, width: 32, height: 24, borderRadius: 6,
            background: 'var(--color-surface)', border: '1px solid var(--color-border-1)' }}>
            {k === 0 && <span style={{ position: 'absolute', top: -1, right: -1, width: 0, height: 0,
              borderTop: '10px solid var(--color-sage)', borderLeft: '10px solid transparent', borderTopRightRadius: 6 }} />}
          </span>
        ))}
      </span>
      <span style={{ flex: 1, minWidth: 0, font: '600 14px/1.35 var(--font-sans)', color: 'var(--color-fg-1)' }}>Backs that have changed</span>
      <window.Icon name="chevron-right" size={16} color="var(--color-fg-3)" />
    </button>
  );
};

// ============================================================================
// 3 — TALK LIFTS THE CARD → nothing, and one hairline
// The order is the whole answer: cards you are part of that are still moving
// are already at the top of Read. All that is added is the app's own waterline
// beneath them, so you can see where the moving ones stop. Nothing anywhere
// else — from Active you learn nothing, by design.
// ============================================================================
const D8Moving = ({ wanted }) => wanted.length ? (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 2px' }}>
    <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.06em', color: 'var(--color-fg-3)' }}>still moving</span>
    <span aria-hidden="true" style={{ flex: 1, height: 1, background: 'var(--color-border-2)' }} />
  </div>
) : null;

// ============================================================================
// 4 — THE LINE → the strip that speaks
// The loudest of the five and the only one that reaches you on Active: a strip
// under the tabs carrying the newest thing said, in words, by name. Open it for
// everything said since you looked; a row takes you straight into that card's
// record, past the feed entirely. This is a notifications inbox in all but
// name, built so it can be judged rather than argued about.
// ============================================================================
const D8Ticker = ({ wanted, st, openRecord }) => {
  const [open, setOpen] = React.useState(false);
  const rows = [];
  (wanted || []).forEach(i => d8NewSaid(i, st).forEach(e => rows.push({ item: i, entry: e })));
  rows.sort((a, b) => b.entry.at - a.entry.at);
  if (!rows.length) return null;
  const top = rows[0];
  return (
    <React.Fragment>
      <div style={{ position: 'sticky', top: 'calc(var(--top-bar-height) + 49px)', zIndex: 45,
        background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-2)' }}>
        <button type="button" onClick={() => setOpen(true)} className="circ-d8-ticker"
          aria-haspopup="dialog" aria-label="What has been said since you looked"
          style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', minHeight: 44, padding: '9px 16px',
            background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left' }}>
          <span aria-hidden="true" style={{ display: 'inline-flex', flexShrink: 0, color: 'var(--color-fg-2)' }}><window.D8Bubble size={15} filled /></span>
          <span style={{ flex: 1, minWidth: 0, font: '400 13px/1.4 var(--font-sans)', color: 'var(--color-fg-2)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-fg-1)' }}>{top.entry.by}</span>{' on '}{d8Title(top.item)}
          </span>
          <window.Icon name="chevron-right" size={15} color="var(--color-fg-3)" />
        </button>
      </div>
      {open && (
        <window.D8Sheet title="Said since you looked" onClose={() => setOpen(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 2 }}>
            {rows.map((r, i) => (
              <button key={r.entry.id + i} type="button" onClick={() => { setOpen(false); openRecord(r.item); }}
                className="circ-d8-row" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 4,
                  width: '100%', padding: '12px 10px', margin: '0 -10px', background: 'transparent', border: 0,
                  borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  {r.entry.glyph && <span aria-hidden="true" style={{ fontSize: 14, lineHeight: 1 }}>{r.entry.glyph}</span>}
                  <span style={{ font: '600 14px/1.3 var(--font-sans)', color: 'var(--color-fg-1)' }}>{r.entry.by}</span>
                  <span style={{ font: '400 11px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{window.circWhen(r.entry.at)}</span>
                </span>
                <span style={{ font: '400 14px/1.5 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.entry.text}</span>
                <span style={{ font: '500 12px/1.4 var(--font-sans)', color: 'var(--color-fg-2)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>on {d8Title(r.item)}</span>
              </button>
            ))}
          </div>
        </window.D8Sheet>
      )}
    </React.Fragment>
  );
};

// ============================================================================
// 5 — THE CARD'S PAGE → a doorway, and a small screen
// The one state whose grammar already says destinations are fine. So the
// gathering is a destination too — kept as small as a destination can be: no
// tab, no nav slot, one doorway that is only there while something is moving,
// and a screen that empties itself out of existence as you visit the pages.
// ============================================================================
const D8Doorway = ({ wanted, st, openReturn }) => {
  if (!wanted.length) return null;
  const who = d8Spoke(wanted, st).slice(0, 3);
  return (
    <div style={{ padding: '12px 16px 0' }}>
      <button type="button" onClick={openReturn} className="circ-d8-doorway"
        aria-label="Open the pages the circle is still talking on"
        style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 52, padding: '11px 14px',
          background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)',
          cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ flex: 1, minWidth: 0, font: '600 14px/1.35 var(--font-sans)', color: 'var(--color-fg-1)' }}>Still talking</span>
        <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
          {who.map((n, i) => (
            <span key={n} style={{ marginLeft: i ? -7 : 0, display: 'inline-flex', borderRadius: '50%', boxShadow: '0 0 0 2px var(--color-surface)' }}>
              <window.Avatar name={n} size={22} />
            </span>
          ))}
        </span>
        <window.Icon name="chevron-right" size={16} color="var(--color-fg-3)" />
      </button>
    </div>
  );
};

const D8StillTalking = ({ wanted, st, onOpen }) => (
  <main style={{ flex: 1, width: '100%' }}>
    <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', padding: '16px 16px 96px',
      display: 'flex', flexDirection: 'column', gap: 2 }}>
      {!wanted.length ? (
        <p style={{ margin: '8px 2px', font: '400 14px/1.6 var(--font-sans)', color: 'var(--color-fg-3)', textWrap: 'pretty' }}>
          Nothing is moving. Pages you are part of come here while the circle is speaking on them.
        </p>
      ) : wanted.map(item => {
        const said = d8NewSaid(item, st);
        const last = said[said.length - 1];
        return (
          <button key={item.id} type="button" onClick={() => onOpen(item)} className="circ-d8-row"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 5, width: '100%',
              padding: '14px 12px', background: 'transparent', border: 0, borderRadius: 'var(--radius-md)',
              cursor: 'pointer', textAlign: 'left' }}>
            <span style={{ font: '600 15px/1.35 var(--font-sans)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)',
              textWrap: 'pretty', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{d8Title(item)}</span>
            {last && (
              <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ font: '600 13px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>{last.by}</span>
                <span style={{ font: '400 11px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{window.circWhen(last.at)}</span>
              </span>
            )}
            {last && (
              <span style={{ font: '400 14px/1.5 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{last.text}</span>
            )}
          </button>
        );
      })}
    </div>
  </main>
);

Object.assign(window, { d8Title, d8Wanted, d8NewSaid, d8NewGlyphs, d8Spoke, D8DiscPill, D8HeldOut, D8Moving, D8Ticker, D8Doorway, D8StillTalking });
