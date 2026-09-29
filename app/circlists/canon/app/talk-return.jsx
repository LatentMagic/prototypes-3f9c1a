
// ============================================================================
// LM-652 — the returns bar. It stands at the head of BOTH feeds, collapsed, and
// expands in place to the cards themselves; picking one opens that card's
// conversation surface. Its presence is its state: there when there is unseen
// talk on a watched card, absent when there is not.
//
// This file owns three things the delta named:
//   the ARRIVAL   — the slot opens its own height while the strip travels up into
//                   it, once, in the New pill's grammar (.cand-barslot-in).
//   the REMOVAL   — the same motion reversed and quicker (.cand-barslot-out).
//                   Chosen over a fade or a collapse-in-place: the arrival is the
//                   only thing besides the pill that moves this feed, so the way
//                   out reads as that same displacement being given back. A fade
//                   would leave the space open and then snap it shut; a shorter
//                   reverse closes it under the same curve, and leaving is not an
//                   announcement, so it does not take the arrival's full time.
//   the HOLD      — while expanded, the rows and their words do not move. What is
//                   drawn is frozen at the moment it opened, and talk arriving in
//                   the meantime lands on collapse. Nothing marks the hold.
// The circular chevron target was not carried: no other control in the product
// is a circle, so the house shape (radius-md box) stands instead — flagged.
// ============================================================================
const CAND_BAR_IN_MS = 560, CAND_BAR_OUT_MS = 400;

// The bar's rows: watched cards, MARKED READ (ratified 2026-08-19 — hearing about
// a card starts at the mark), carrying words the member has not seen. Newest
// first, so the head line's names — taken in row order — read newest first too.
// Comment reactions reach the bar (docs/specs/comment-reactions/
// handoff-returns-bar.md): reactions OTHERS placed on YOUR words since your
// mark. Author-only by construction — only turns by 'You' are read, and your
// own reaction is never counted. The list is what stands now: a reaction taken
// back is gone from it, a swap keeps its time and shows its new glyph, so a
// reaction-only row left with nothing drops out on its own. No push reads this.
const candFreshRx = (item) => {
  const m = item && item.talkSeenAt;
  if (!m) return [];
  const out = [];
  candTurns(item).forEach(t => {
    if (t.deleted || t.by !== 'You') return;
    (t.reactions || []).forEach(r => { if (r.who !== 'You' && r.at > m) out.push(r); });
  });
  return out.sort((a, b) => a.at - b.at);
};
const candBarAt = (i) => Math.max(0, ...candFresh(i).map(t => t.at), ...candFreshRx(i).map(r => r.at));
const candBarRows = (sp) => {
  if (!sp) return [];
  return sp.items
    .filter(i => i.watching && i.read && (candFresh(i).length > 0 || candFreshRx(i).length > 0))
    .map(i => ({ i, at: candBarAt(i) }))
    .sort((a, b) => b.at - a.at)
    .map(r => r.i);
};
const candRxName = (who) => { const n = String(window.circContributorLabel ? window.circContributorLabel(who) : who); return n === 'Former member.' ? 'Former member' : n; };
const candBarRx = (item) => {
  const who = [], glyphs = [];
  candFreshRx(item).forEach(r => {
    const n = candRxName(r.who);
    if (!who.includes(n)) who.push(n);
    if (r.glyph && !glyphs.includes(r.glyph) && glyphs.length < 3) glyphs.push(r.glyph);
  });
  return { who, glyphs };
};
// A row's one line: the repliers, and only them — a name in the bar only ever
// means someone who wrote (comment-reactions, option E, ratified). Reactors stay
// in the data for their glyphs and never reach the words. A reaction-only row
// has no line: its title alone, centred in the row's fixed height.
const candBarLine = (r) => (r.who && r.who.length ? candNames(r.who) : '');
// The head's roll-up of glyphs across the rows, the way the names roll up.
const candBarGlyphs = (snap) => {
  const g = [];
  snap.forEach(r => (r.glyphs || []).forEach(x => { if (!g.includes(x) && g.length < 3) g.push(x); }));
  return g;
};
// The stack: up to three distinct glyphs, bare, at the row's end. Outside the
// text column, so reactions never lengthen the row's words.
const CandRxStack = ({ glyphs }) => {
  if (!glyphs || !glyphs.length) return null;
  // Spoken as what it means — reactions to you — never as a list of emojis.
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
      <span className="circ-vh">Reactions to you.</span>
      {glyphs.map((g, k) => (
        <span key={g} aria-hidden="true" style={{ width: 16, height: 16, fontSize: 14, lineHeight: 1, marginLeft: k ? -2 : 0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{g}</span>
      ))}
    </span>
  );
};
const candBarWho = (item) => {
  const who = [];
  candFresh(item).forEach(t => { if (!who.includes(t.by)) who.push(t.by); });
  return who;
};
// A row, frozen. Everything the open bar draws is taken from this snapshot, so a
// turn arriving while it is open cannot move a row, reorder the list, or add a
// name to a subline.
const candBarSnap = (rows) => rows.map(i => {
  const rx = candBarRx(i);
  return { id: i.id, title: candTitleOf(i), titled: !!i.title, who: candBarWho(i), rx: rx.who, glyphs: rx.glyphs };
});

// ---- clearing the bar (ratified 2026-09-21; the study is
// docs/specs/lm-652-discourse/playground-clear-in-circle/, the reasoning
// note-2026-09-21-clear-in-circle.md) -----------------------------------------
//
// WHAT CLEARING IS. It moves `talkSeenAt` forward on every card the bar stands
// for — the same write the conversation surface makes when you leave it
// (app/talk-surface.jsx). Nothing is deleted, nothing is marked read, and
// nobody else's view moves; a new reply brings the row back.
//
// WHY IT IS A FOOTNOTE AND NOT A ROW, A BAND OR A BUTTON. Four shapes were
// played and rejected — a sunken band with a bordered control (bloat), the
// head's freed second line (a hover-filled control has no business in the
// head), a bare cross in the card's corner (reads "hide this bar"), and this
// same act drawn in the LIST's register at 13px/500/fg-2, which read as a fifth
// conversation that had lost its subtitle. The finding that settled it: the
// register has to change, not the placement. So the act takes the voice the
// product already uses for a footnote at the foot of a panel — "More in the
// circles below." on home — 12px, 400, fg-3, no fill, an underline on hover,
// with the rows' own hairline above it as the boundary between registers.
//
// NO TEACHING LINE, deliberately: MICROCOPY TEACHES WHERE THE ACT HAS A
// CONSEQUENCE THE MEMBER CANNOT SEE. Mark-as-read has one (it moves in your
// view and not in theirs). Clearing has none, so a sentence explaining it is
// bloat in the place the product is meant to be calmest.
//
// NO UNDO, for now: reversal is a separate question and is not ratified.
//
// IT CLEARS ONLY WHAT THE MEMBER COULD SEE: the ids come from the open list's
// own frozen snapshot, and the mark is set to the moment that snapshot was
// taken — so a turn that arrived while the bar was held open, on a listed card
// or a new one, is untouched and brings the bar back naming only itself.
const candBarClear = (api, sp, ids, at) => {
  if (!api || !sp) return;
  if (!ids || !ids.length) return;
  const when = at || Date.now();
  api.setSpaces(prev => prev.map(s => s.id !== sp.id ? s : ({
    ...s, items: s.items.map(i => ids.includes(i.id) ? { ...i, talkSeenAt: when } : i),
  })));
};

const CandFeedLead = ({ api }) => {
  const [open, setOpen] = React.useState(false);
  const [held, setHeld] = React.useState(null);
  const [phase, setPhase] = React.useState('rest');
  const [barH, setBarH] = React.useState(null);
  const sp = api && api.space;
  const spaceId = sp ? sp.id : null;
  const rows = candBarRows(sp);
  const live = rows.length > 0;
  const [shown, setShown] = React.useState(live);
  const box = React.useRef(null);
  const first = React.useRef(true);
  const where = React.useRef(spaceId);
  const lastSnap = React.useRef([]);
  // When the open list was frozen. The clear's mark is set to this, not to the
  // press, so words that landed during the hold stay unseen.
  const heldAt = React.useRef(0);
  // Staged states open the bar with `cand-bar-open` (app/states.jsx).
  const rowsRef = React.useRef(rows);
  rowsRef.current = rows;
  // A pending flag, consumed once rows exist and the circle has settled, so a
  // space-change reset cannot close it after it opens.
  const [pend, setPend] = React.useState(0);
  React.useEffect(() => {
    const go = () => { window.__candBarOpen = true; setPend(p => p + 1); };
    window.addEventListener('cand-bar-open', go);
    return () => window.removeEventListener('cand-bar-open', go);
  }, []);
  React.useEffect(() => {
    if (!window.__candBarOpen || !rows.length || where.current !== spaceId) return;
    const t = setTimeout(() => {
      const r = rowsRef.current;
      if (!window.__candBarOpen || !r.length) return;
      window.__candBarOpen = false;
      heldAt.current = Date.now(); setHeld(candBarSnap(r)); setOpen(true);
    }, 60);
    return () => clearTimeout(t);
  }, [pend, rows.length, spaceId]);

  // Arrival and removal. A change of circle is navigation, not the bar coming or
  // going, so the new circle's state is taken as it stands, unanimated. A removal
  // is held while the bar is open (an expanded bar holds still) and plays when the
  // member collapses it.
  React.useEffect(() => {
    if (first.current || where.current !== spaceId) {
      first.current = false; where.current = spaceId;
      setShown(live); setPhase('rest'); setBarH(null); setOpen(false); setHeld(null);
      return;
    }
    if (live && !shown) { setShown(true); setPhase('in'); setBarH(null); }
    else if (live && shown && phase === 'out') { setPhase('rest'); setBarH(null); }
    else if (!live && shown && !open && phase !== 'out') { setPhase('out'); setBarH(null); }
  }, [live, spaceId, shown, open, phase]);

  // The motion's own end: the arrival returns the slot to auto height (so it can
  // expand), the removal takes the bar out of the feed.
  React.useEffect(() => {
    if (phase === 'rest') return;
    const out = phase === 'out';
    const t = setTimeout(() => {
      if (out) setShown(false);
      setPhase('rest'); setBarH(null);
    }, out ? CAND_BAR_OUT_MS : CAND_BAR_IN_MS);
    return () => clearTimeout(t);
  }, [phase]);

  // Measured before paint, so the keyframe has a real height to travel to and the
  // feed below makes ONE move rather than a jump and then a slide.
  React.useLayoutEffect(() => {
    if (phase !== 'rest' && barH == null && box.current) setBarH(box.current.offsetHeight);
  }, [phase, barH]);

  if (!shown || !sp) return null;

  let snap = open && held ? held : candBarSnap(rows);
  if (!snap.length) snap = lastSnap.current; else lastSnap.current = snap;
  if (!snap.length) return null;

  // Repliers only, verb "replied" only. Reactions are the head's glyph stack;
  // when only reactions moved there is no second line at all.
  const names = [];
  snap.forEach(r => r.who.forEach(n => { if (!names.includes(n)) names.push(n); }));
  const headGlyphs = candBarGlyphs(snap);
  // The head adapts from mobile: on a phone it names ONE person and "others"
  // so it fits; wider, it takes the usual two names. Every row restates its own.
  const narrow = window.innerWidth < 520 || !!document.querySelector('.circ-phone-screen');
  const headNames = narrow && names.length > 1 ? names[0] + ' and others' : candNames(names);
  const n = snap.length;
  // Two lines, each parsing on its own. The head is the count — fixed-length by
  // construction, so it never truncates at any width. The names are the subline
  // and are the half allowed to truncate: every row restates them.
  const head = open ? 'Pick one to open its conversation'
    : n + (n === 1 ? ' conversation' : ' conversations') + ' you are watching';
  const sub = names.length ? headNames + ' replied' : '';
  const toggle = () => {
    if (open) { setOpen(false); setHeld(null); }
    else { heldAt.current = Date.now(); setHeld(candBarSnap(rows)); setOpen(true); }
  };
  // The panel closes first: the rows it is listing are about to not exist, and
  // an open panel playing its removal full of rows is the bar arguing with
  // itself. Collapsing also releases the held removal, so the bar leaves in its
  // ordinary motion rather than needing one of its own.
  const clear = () => { setOpen(false); setHeld(null); candBarClear(api, sp, snap.map(r => r.id), heldAt.current); };

  const slot = { '--cand-bar-mb': 'max(0px, calc(var(--circ-feed-pad-top, 16px) - 16px))', marginBottom: 'var(--cand-bar-mb)' };
  if (barH != null) slot['--cand-bar-h'] = barH + 'px';
  else if (phase === 'in') { slot.height = 0; slot.overflow = 'hidden'; }
  const cls = barH == null ? undefined
    : phase === 'in' ? 'cand-barslot cand-barslot-in'
    : phase === 'out' ? 'cand-barslot cand-barslot-out' : undefined;

  return (
    <div className={cls} style={slot}>
      <div ref={box} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-raised)', overflow: 'hidden' }}>
        <button type="button" onClick={toggle} aria-expanded={open} className="circ-menuitem"
          style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: 56, padding: '8px 12px 8px 14px',
            background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left' }}>
          <span aria-hidden="true" style={{ width: 3, height: 22, borderRadius: 2, background: 'var(--color-new-words)', flexShrink: 0 }} />
          <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ font: '600 14px/1.35 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty', overflowWrap: 'break-word' }}>{head}</span>
            {sub && <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--color-fg-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</span>}
          </span>
          <CandRxStack glyphs={headGlyphs} />
          <span aria-hidden="true" style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-fg-2)', transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform var(--duration-base) var(--ease-quiet)' }}>
            <Icon name="chevron-down" size={16} />
          </span>
        </button>
        {open && (
          <div style={{ borderTop: '1px solid var(--color-border-2)', padding: '3px 6px', display: 'flex', flexDirection: 'column' }}>
            {snap.map((r, i) => (
              <React.Fragment key={r.id}>
                {/* BETWEEN rows and nowhere else (fixed 2026-09-21, with the
                    home strip's own composition — LM-652). Every row used to
                    carry a `borderTop`, so a hairline landed a few pixels under
                    the card's head seam and the two read as one smudged double
                    rule; the first row's border was then made transparent from
                    the stylesheet, which kept its 1px of offset and left the
                    list unevenly spaced. Inset to the text rather than
                    full-bleed, so the rule belongs to the list instead of
                    cutting the card in half. */}
                {i > 0 && <span role="separator" style={{ height: 1, margin: '3px 0', background: 'var(--color-border-2)' }} />}
                <button type="button" className="circ-menuitem"
                  onClick={() => { const C = window.CircCandidate; if (C && C.goToCard) C.goToCard({ id: r.id }); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                    background: 'transparent', border: 0, cursor: 'pointer', height: 60, boxSizing: 'border-box', padding: '0 8px 0 10px', borderRadius: 'var(--radius-md)' }}
                  data-cand-listrow="">
                  <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* No title: the address IS the name, set in mono as the card
                        sets it (app/feed.jsx:134) — one treatment for a title-less
                        link wherever it is named. */}
                    <span style={{ font: r.titled ? '600 13.5px/1.35 var(--font-sans)' : '600 12.5px/1.45 var(--font-mono)', color: 'var(--color-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</span>
                    {candBarLine(r) && <span style={{ font: '400 12px/1.3 var(--font-sans)', color: 'var(--color-fg-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{candBarLine(r)}</span>}
                  </span>
                  <CandRxStack glyphs={r.glyphs} />
                  <Icon name="chevron-right" size={16} color="var(--color-fg-3)" />
                </button>
              </React.Fragment>
            ))}
            {/* The act, last in the panel. The hairline is the rows' own rule, so
                the boundary between the list and the footnote introduces nothing
                new; the hit area is 44px while the type is 12px (governance
                standards/ui-design.md, touch floor — padding carries the target,
                not the type size). */}
            <span role="separator" style={{ height: 1, margin: '3px 0', background: 'var(--color-border-2)' }} />
            <span style={{ display: 'flex' }}>
              <button type="button" onClick={clear} className="circ-btn-tertiary"
                style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, padding: '0 10px',
                  background: 'transparent', border: 0, cursor: 'pointer',
                  font: '400 var(--text-xs)/1.4 var(--font-sans)', color: 'var(--color-fg-3)' }}>Clear</button>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { CandFeedLead, candBarRows, candBarWho, candBarAt, candBarLine, candBarGlyphs, candFreshRx, CandRxStack });
