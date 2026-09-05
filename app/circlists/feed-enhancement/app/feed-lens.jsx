// ============================================================================
// Circlists — The feed lens (BIZ-136, candidate build. NOT ratified.)
//
//   circContributors(space)      — the pickable contributors, from attribution.
//   circFilterItems(items, who)  — the view-only narrowing. Never mutates.
//   FeedLens                     — ONE control holding order and who.
//   LensChips                    — what is applied, shown only when non-default.
//
// WHY ONE CONTROL AND NOT TWO.
// Run 1 shipped sort as a menu button labelled "Newest first" in the tab bar.
// The obvious next move is a second button beside it, which is what industry
// precedent does — sort and filter stay distinct, adjacent controls. That
// precedent is real, and it is drawn from large catalogues where the strip has
// room. It has no answer for the controls still queued behind this one
// (columns, saved, search): two buttons today is six in a 48px strip that
// already carries two tabs, and that strip dies.
//
// So order and who fold into one entry point opening one panel with labelled
// groups. Density (BIZ-136 run 3) has now joined them; columns is still to
// come. Search and saved are a different kind of thing and get their own
// affordance.
//
// WHAT IT COSTS. The current sort order stops being legible at a glance, which
// run 1 deliberately valued. Paid for by LensChips: any non-default lens — an
// order, a contributor, or both — puts a named chip under the tab bar with its
// own clear. Default state shows nothing at all, which is this app's own
// grammar for calm rather than a new one.
//
// NO COUNTS. The conventional signal for an active filter is a count badge on
// the trigger. This product's register forbids it — its feed marks are
// "boolean, wordless, never a count" — so the trigger carries a boolean active
// state and the chips carry the words.
// ============================================================================

const CIRC_LENS_ALL = null; // "Everyone" — the default, no contributor filter.

// The contributor of an item, parsed out of its attribution line. There is no
// contributor identity in this product's model: attribution is a display-name
// snapshot taken at creation, and nothing points back at a user. So the
// filter's whole vocabulary is these strings, and it can be no better than they
// are — which matters in exactly one place, below.
// The trailing full stop is NOT stripped: a display name here is "first name +
// surname initial", so the stop in "Sam R." belongs to the name rather than to
// the sentence. Stripping it renders the lens as "Sam R" beside cards reading
// "Sam R." — and, worse, makes the filter match nothing at all.
const circContributorOf = (item) => {
  const a = (item && item.attribution) || '';
  return a.replace(/^added by\s+/i, '').trim();
};

const circIsYou = (who) => /^you\.?$/i.test(who || '');
// Account deletion rewrites attribution to "Added by former member." for every
// deleted account, so several real people collapse into one indistinguishable
// string. The filter offers that as ONE entry rather than pretending to
// separate them: the data to separate them is irrecoverably gone. It is offered
// at all — rather than omitted — because omitting it would leave those cards
// the only ones in the circle the lens cannot reach. A member who merely left
// or was removed keeps their real name and lists normally.
const circIsFormer = (who) => /^former member\.?$/i.test(who || '');

const circContributorLabel = (who) => {
  if (circIsYou(who)) return 'You';
  if (circIsFormer(who)) return 'Former member';
  return who;
};

// Derived from the WHOLE circle — both tabs — so the list does not change shape
// as the member switches tab. The lens is held across tabs (a question about a
// person is not a question about a tab), and a set that reshuffled underneath
// it would make that feel broken. "You" leads, "Former member" trails, the rest
// alphabetical.
const circContributors = (space) => {
  const items = (space && space.items) || [];
  const seen = [];
  const keys = [];
  for (const it of items) {
    const who = circContributorOf(it);
    // Deduped case-insensitively: persisted state from before the attribution
    // line was normalised carries 'Added by You' while new items write 'Added
    // by you'. Matching on the raw string would offer two identical "You" rows,
    // each hiding the other's links.
    const key = who.toLowerCase();
    if (who && keys.indexOf(key) === -1) { keys.push(key); seen.push(who); }
  }
  return seen.sort((a, b) => {
    if (circIsYou(a) !== circIsYou(b)) return circIsYou(a) ? -1 : 1;
    if (circIsFormer(a) !== circIsFormer(b)) return circIsFormer(a) ? 1 : -1;
    return circContributorLabel(a).localeCompare(circContributorLabel(b));
  });
};

// A view, exactly as the sort is. Stored order and stored membership are never
// touched, so the divider maths, the pill's accept and the seeding all keep
// reading what they always read.
const circFilterItems = (items, who) => {
  if (!who) return items || [];
  // Case-insensitive, to agree with the deduping in circContributors: the two
  // must match on the same key or a legacy 'Added by You' item is offered under
  // a heading it then does not appear beneath.
  const key = String(who).toLowerCase();
  return (items || []).filter((it) => circContributorOf(it).toLowerCase() === key);
};

// The lens is non-default when either half is. That single predicate drives the
// trigger's active state and whether any chip shows at all.
const circLensActive = (order, who) => (order && order !== 'newest') || !!who;

// ---- The control -----------------------------------------------------------

// Rules with knobs on them — the settled mark for "view options". NOT three
// descending rules: that is this app's own `menu` glyph, and at mobile width it
// already sits in the top bar 48px away, so the same mark twice on one screen
// would have meant two different things a glance apart.
//
// The knobs slide when the lens is active, so the state is carried by the shape
// as well as by colour. That matters twice over — the app's rule is hierarchy
// through size and weight rather than colour, and an active state legible only
// as a tint is exactly what that rule exists to catch.
const CircLensIcon = ({ active }) => {
  const w = active ? 2 : 1.6;
  const knob = active ? 3.1 : 2.6;
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}>
      <line x1="3.5" y1="7" x2="20.5" y2="7" stroke="currentColor" strokeWidth={w} strokeLinecap="round" />
      <line x1="3.5" y1="17" x2="20.5" y2="17" stroke="currentColor" strokeWidth={w} strokeLinecap="round" />
      <circle cx={active ? 15.5 : 9} cy="7" r={knob} fill="var(--color-surface)"
        stroke="currentColor" strokeWidth={w} />
      <circle cx={active ? 8.5 : 15} cy="17" r={knob} fill="var(--color-surface)"
        stroke="currentColor" strokeWidth={w} />
    </svg>
  );
};

// Shared APG radio-group keyboard behaviour for both group shapes below:
// arrows move AND select, the checked option is the only tab stop, Escape is
// handled by the panel. A hook rather than two copies of the same twelve
// lines, since a segmented control and a vertical list differ only in layout.
const useLensRadioKeys = (options, value, onPick, refs) => {
  const idx = Math.max(0, options.findIndex((o) => o.id === value));
  return (e) => {
    const last = options.length - 1;
    let next = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = idx === last ? 0 : idx + 1;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = idx === 0 ? last : idx - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    onPick(options[next].id);
    const el = refs.current[next];
    if (el) el.focus({ preventScroll: true });
  };
};

// A plain sentence-case label above a group — no uppercase, no letterspacing,
// no small-caps eyebrow. The thing being fixed here was four encodings of
// "selected" stacked on one row; the label's own job is just to name the
// group once.
const LensLabel = ({ children }) => (
  <div style={{
    fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 500,
    color: 'var(--color-fg-2)', padding: '0 2px 6px',
  }}>{children}</div>
);

// Order / View — both two-option choices, so both are this one horizontal
// segmented control. Selected reads through ONE composite signal — the app's
// own selected-row language: white lifting off the sunken tray, weight,
// accent — never a tick or a ring. Tray padding is fixed at the app's own 3px;
// the explicit minHeight is what gives the ROW a 44px hit area on top of that,
// since 3px padding either side of a 34px segment falls short on its own.
// `caption` (feed-enhancement candidate build, Reading A): an optional quiet
// line under the group's OWN label, not a new signal bolted onto the control.
// Order/View never pass it. Saved does — see feed-saved-readings.jsx — because
// it alone narrows by a fact only this member holds, not one the whole circle
// shares, and that is worth one line of type, not a badge or an accent.
const LensSegmented = ({ label, caption, options, value, onPick }) => {
  const refs = React.useRef([]);
  const onKey = useLensRadioKeys(options, value, onPick, refs);
  // The caption sits OUTSIDE the radiogroup, so without this it is reachable by
  // swipe and never announced with the group it belongs to (BIZ-136 run 7, from
  // the review). For Reading A's Saved group the caption IS the claim — that
  // this narrowing is the member's alone — so a screen-reader user hearing the
  // group without it hears a different group from the one on screen.
  const captionId = caption ? 'circ-lens-cap-' + String(label).toLowerCase().replace(/[^a-z0-9]+/g, '-') : null;
  return (
    <div style={{ padding: '6px 10px' }}>
      <LensLabel>{label}</LensLabel>
      {caption && (
        <p id={captionId} style={{
          margin: '-4px 2px 8px', fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-sm)', color: 'var(--color-fg-2)', lineHeight: 1.4,
        }}>{caption}</p>
      )}
      <div role="radiogroup" aria-label={label} aria-describedby={captionId || undefined} onKeyDown={onKey} style={{
        background: 'var(--color-surface-sunken)', borderRadius: 'var(--radius-md)',
        // 3px tray padding either side of a 44px segment. Putting the floor on
        // the TRAY instead left each segment at 38px — the rows this replaced
        // were 44px, so the redesign would have quietly shrunk the target.
        padding: 3, display: 'flex', gap: 2, width: '100%',
      }}>
        {options.map((o, i) => {
          const on = o.id === value;
          return (
            <button
              key={String(o.id)}
              ref={(el) => { refs.current[i] = el; }}
              type="button" role="radio" aria-checked={on} tabIndex={on ? 0 : -1}
              onClick={() => onPick(o.id)}
              className="circ-lens-seg"
              style={{
                // `flex: 1` alone distributes the SPARE space equally and still
                // sizes each segment from its own content first, which two
                // options hid (Newest/Oldest are near enough the same width)
                // and a third exposed: Comfortable | Compact | Grid measured
                // 93 / 72 / 62px in a track the Order group above divides into
                // two exact halves. Two same-width segmented controls stacked,
                // one even and one jittering, is the kind of break the eye
                // catches without being able to name. `flexBasis: 0` makes the
                // division exact at any count.
                flex: 1, flexBasis: 0, minWidth: 0, border: 0, cursor: 'pointer', textAlign: 'center',
                background: on ? 'var(--color-surface)' : 'transparent',
                // 4px, not 8. `flexBasis: 0` divides the track exactly, which is
                // right — but at three options each segment is ~90px and
                // "Comfortable" needs ~82 for its text, so 8px either side
                // overflowed it. With no `overflow` set the text did not
                // truncate, it SPILLED: at 1280 the View group rendered
                // "ComfortableCompact" as one run with "Grid" floating loose
                // outside the control. Pre-existing since run 5 added Grid, and
                // reproduced on untouched `canon` — fixed here, out of slice,
                // because it renders inside the one state Joe opens to judge
                // Reading A and made that reading look broken rather than the
                // panel. The ellipsis span below is the backstop, so a longer
                // label in future truncates instead of spilling again.
                borderRadius: 'var(--radius-sm)', minHeight: 'var(--tap-target-min)', padding: '0 4px',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)',
                fontWeight: on ? 600 : 500,
                color: on ? 'var(--color-accent)' : 'var(--color-fg-2)',
                boxShadow: on ? 'var(--shadow-raised)' : 'none',
              }}
            ><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>{o.label}</span></button>
          );
        })}
      </div>
    </div>
  );
};

// Added by — stays a vertical list (N contributors, not two options to put
// side by side), bounded so a large circle scrolls the list rather than
// growing the panel. Selected mark is the app's own selected-list-row
// language from shell.jsx (RailBody's active-circle bar): a 2px accent left
// bar plus weight + colour. Unselected rows carry a transparent 2px bar of
// the same width, so nothing shifts horizontally when the selection moves.
const LensList = ({ label, options, value, onPick }) => {
  const refs = React.useRef([]);
  const onKey = useLensRadioKeys(options, value, onPick, refs);
  return (
    // No bottom padding: a half-cut row has to be cut BY the container edge to
    // read as "more below". Ten pixels of white under the slice read as a
    // rendering fault instead.
    <div style={{ padding: '6px 10px 0' }}>
      <LensLabel>{label}</LensLabel>
      <div role="radiogroup" aria-label={label} onKeyDown={onKey} style={{
        display: 'flex', flexDirection: 'column', gap: 1,
        // 4 full 44px rows + a deliberately half-cut fifth, so a circle with more
        // contributors than fit SHOWS that it has more. A round multiple of the
        // row height ends flush and reads as a complete list.
        maxHeight: 202, overflowY: 'auto',
      }}>
        {options.map((o, i) => {
          const on = o.id === value;
          return (
            <button
              key={String(o.id)}
              ref={(el) => { refs.current[i] = el; }}
              type="button" role="radio" aria-checked={on} tabIndex={on ? 0 : -1}
              onClick={() => onPick(o.id)}
              className="circ-lens-seg"
              style={{
                width: '100%', display: 'flex', alignItems: 'center', textAlign: 'left',
                background: 'transparent', border: 0, cursor: 'pointer',
                borderLeft: '2px solid ' + (on ? 'var(--color-accent)' : 'transparent'),
                padding: '0 10px 0 8px', minHeight: 'var(--tap-target-min)',
                fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)',
                fontWeight: on ? 600 : 500,
                // NOT accent text. The rail's selected circle row — this app's
                // own list-selection language — marks itself with an accent bar
                // and weight, and leaves the label in fg-1. Colouring the label
                // too stacked a third signal on the one group that could not
                // become a segmented control, which is the defect the whole
                // rework exists to remove.
                color: 'var(--color-fg-1)',
              }}
            >
              {/* The face sits in the row's leading edge at 24px — the card's
                  avatar, one step down for a dense secondary row. `Everyone` is
                  the ABSENCE of a filter, so it takes the app's own `users`
                  glyph rather than a face: a blank gap there reads as an avatar
                  that failed to load, and a face would imply a person. Same
                  circle chrome either way, so the label column stays aligned. */}
              {o.everyone
                ? <span aria-hidden="true" style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0, marginRight: 8,
                    background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-1)',
                    color: 'var(--color-fg-3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}><Icon name="users" size={13} /></span>
                : <span aria-hidden="true" style={{ marginRight: 8, display: 'inline-flex' }}>
                    {/* NEVER accent, even for your own row. On the card the
                        accent fill means "this is you"; in this list the label
                        already says You, and the fill made the one UNSELECTED
                        row the loudest object in the group — louder than the
                        accent bar marking the row that IS selected. Identity
                        must not out-rank state. */}
                    <Avatar name={o.face} size={24} />
                  </span>}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// The three options density picks between — Comfortable is the product's
// default rhythm, Compact tightens the metrics only, Grid reflows the feed
// into two columns (see feed.jsx). Grid stays in this master list even
// though FeedLens below drops it under 1024px — the stored preference and
// main.jsx's fallback both need the id to exist, only the OFFER narrows.
const CIRC_DENSITY_OPTIONS = [
  { id: 'comfortable', label: 'Comfortable' },
  { id: 'compact', label: 'Compact' },
  { id: 'grid', label: 'Grid' },
];

// `saved`/`onSaved`/`savedMode` (feed-enhancement candidate build, Reading A):
// a deletable aid inside a deletable aid. Absent feed-saved-readings.jsx ⇒ no
// window.CIRC_SAVED_LENS_OPTIONS ⇒ `showSavedGroup` below is false regardless
// of what `savedMode` says, so a stale 'lens' mode degrades to exactly the
// panel that shipped before this reading existed — no throw, no dead group.
const FeedLens = ({ order, who, contributors, onOrder, onWho, density = 'comfortable', onDensity, open, onOpenChange, isMobile, user = null, saved = false, onSaved, savedMode = 'bar' }) => {
  const btnRef = React.useRef(null);
  const panelRef = React.useRef(null);
  // Under Reading A (BIZ-136 run 7) saved IS one of this door's narrowings, so
  // the door has to say so. The design review caught the contradiction by
  // looking: with only Saved applied the trigger sat grey and unmarked while a
  // Saved chip showed directly beneath it — the lens declining to count a
  // narrowing it now owns, which is precisely the claim Reading A is making.
  // `circLensActive` itself is untouched: under 'bar' and 'surface' saved is
  // genuinely not part of this door, and folding it in there would light the
  // trigger for a control that lives somewhere else entirely.
  const active = circLensActive(order, who) || (savedMode === 'lens' && !!saved);
  // Grid is a desktop-only offer (main.jsx's own comment has the why: a
  // two-column grid of these cards is worse at 390). Filtered out of the
  // OPTIONS rather than rendered disabled — an option nobody at this width
  // can ever pick is not a choice, it's clutter with a tooltip.
  const densityOptions = isMobile ? CIRC_DENSITY_OPTIONS.filter((o) => o.id !== 'grid') : CIRC_DENSITY_OPTIONS;
  const showSavedGroup = savedMode === 'lens' && !!onSaved && !!window.CIRC_SAVED_LENS_OPTIONS;

  // Focus the PANEL on open, not the checked option. Focusing the option was
  // correct for the keyboard and wrong on screen: Chromium treats a
  // programmatic .focus() after a pointer click as focus-visible, so opening
  // the panel with a tap drew an accent ring around the already-selected
  // segment — putting back the exact fourth "selected" encoding this rework
  // exists to remove. The panel takes focus as its own dialog does, and the
  // radiogroups keep their arrow-key handling once tabbed into.
  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      if (panelRef.current) panelRef.current.focus({ preventScroll: true });
    }, 20);
    return () => clearTimeout(t);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (btnRef.current && btnRef.current.contains(e.target)) return;
      if (panelRef.current && panelRef.current.contains(e.target)) return;
      onOpenChange(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, onOpenChange]);

  const close = (refocus) => {
    onOpenChange(false);
    if (refocus && btnRef.current) btnRef.current.focus({ preventScroll: true });
  };

  // `face` is what the row's avatar draws (run 4, on Joe's note of 2026-09-01
  // 07:39 and the run-3 design review's independent finding that the list was
  // bare names in ~60% dead width). It is the CARD's own avatar, not a second
  // vocabulary: a former member resolves to null, which is what FeedCard passes
  // for the same person and what renders the two-dot mark. `isYou` picks up the
  // accent fill exactly as the card's does.
  const whoOptions = [{ id: CIRC_LENS_ALL, label: 'Everyone', face: null, everyone: true }].concat(
    (contributors || []).map((w) => ({
      id: w,
      label: circContributorLabel(w),
      // The member's OWN initials, not the word's. Deriving the face from the
      // label rendered 'YO' for a person every card in the same view calls
      // 'SR' — one person, two avatars, one screen apart. displayName(user) is
      // exactly what FeedCard resolves for the same row.
      face: /^former member$/i.test(w) ? null
        : (/^you$/i.test(w) && user ? displayName(user) : circContributorLabel(w)),
    }))
  );
  // A filtered contributor whose last link is read away or deleted drops out of
  // `contributors` while the filter is still on. Without this the group has no
  // checked option, every row is tabIndex -1, and the whole group becomes
  // unreachable by keyboard while the chip still says the lens is applied.
  if (who && !whoOptions.some((o) => o.id === who)) {
    whoOptions.push({ id: who, label: circContributorLabel(who) });
  }

  // The name carries the whole applied state, so a screen reader hears the lens
  // without opening it.
  // Under Reading A the saved narrowing is set behind this door, so it belongs
  // in the door's own spoken state — otherwise a screen-reader user hears
  // "newest first, everyone" over a list narrowed to saved links, which is the
  // audible version of the grey trigger the design review caught.
  const spoken = 'View options: ' + (window.circSortLabel ? window.circSortLabel(order).toLowerCase() : order)
    + ', ' + (who ? 'added by ' + circContributorLabel(who) : 'everyone')
    + (savedMode === 'lens' && saved ? ', saved only' : '');

  return (
    // Stretches to the bar's full height so the border-bottom lands flush with
    // the tab bar's own hairline — exactly how Tabs marks Active/Read, and the
    // panel hangs from this same edge. The 44px button floats centred inside.
    <div style={{
      position: 'relative', display: 'inline-flex', alignItems: 'center', alignSelf: 'stretch',
      borderBottom: '2px solid ' + (active ? 'var(--color-accent)' : 'transparent'),
      marginBottom: -1,
    }}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => onOpenChange(!open)}
        onKeyDown={(e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); onOpenChange(true); } }}
        // The popup is a group of settings, not a menu of commands, so this is
        // "dialog" — `aria-haspopup="true"` is an alias for "menu" and would
        // promise a menu the panel then does not deliver.
        aria-haspopup="dialog"
        aria-controls="circ-lens-panel"
        aria-expanded={open}
        aria-label={spoken}
        className="circ-lens-trigger"
        style={{
          // Transparent at rest AND active — a resting fill on ANY control is
          // this app's hover-only affordance (see --color-surface-sunken's own
          // comment in tokens.css), so a persistent one here read as nothing
          // else in the app does. Active is carried by the wrapper's
          // border-bottom + the icon colour below; hover tint lives in the
          // circ-lens-trigger CSS class.
          background: 'transparent',
          border: 0, cursor: 'pointer', padding: 0,
          // One geometry at both widths — the app's declared 44px touch floor,
          // centred in the bar's 48px.
          height: 'var(--tap-target-min)', width: 'var(--tap-target-min)', flexShrink: 0,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: active ? 'var(--color-accent)' : 'var(--color-fg-2)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <CircLensIcon active={active} />
      </button>

      {open && isMobile && (
        // The panel stays a popover at this size rather than becoming a sheet,
        // but it must not float over live cards with nothing behind it: the
        // scrim says the feed is not the thing being touched. A full bottom
        // sheet is the convention here and is the better answer — recorded for
        // the elegance pass rather than built late in this slice.
        <div onClick={() => close(false)} aria-hidden="true" style={{
          position: 'fixed', inset: 0, background: 'var(--color-scrim)', zIndex: 59,
        }} />
      )}

      {open && (
        <div
          ref={panelRef}
          id="circ-lens-panel"
          role="group"
          tabIndex={-1}
          aria-label="View options"
          onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); close(true); } }}
          // Tab out of the last option and the panel would otherwise stay open
          // over a feed the focus has already moved into.
          onBlur={(e) => {
            if (!panelRef.current) return;
            if (e.relatedTarget && (panelRef.current.contains(e.relatedTarget)
              || (btnRef.current && btnRef.current.contains(e.relatedTarget)))) return;
            if (e.relatedTarget) onOpenChange(false);
          }}
          style={{
            position: 'absolute', top: '100%', right: 0, zIndex: 60, outline: 'none',
            // Wide enough that "Comfortable | Compact | Grid" reads in the
            // segmented control without truncating.
            //
            // 340 on desktop, and that number is a correction rather than a
            // preference. At 300 the three-option View group gave each segment
            // ~90px against "Comfortable"'s ~82px of text plus its padding, so
            // the label spilled out of its own segment and the group rendered
            // as "ComfortableCompact" with "Grid" adrift. Tightening the
            // segment padding stopped the spill and truncated the SELECTED
            // label to "Comfort…" instead, which is not better. The honest fix
            // is the width: the comment above has always claimed this panel is
            // wide enough for three, and since run 5 added Grid it has not been.
            // Desktop only, because `isMobile` filters Grid out entirely, so at
            // 390 the group is still two options in the panel run 3 shipped —
            // untouched, which also keeps this run's own comparison honest.
            // It is the minWidth that has to move, not the max: the panel sizes
            // to its content, and its content never asks for more than 260, so
            // raising the ceiling alone changed nothing on screen.
            minWidth: isMobile ? 260 : 340, maxWidth: isMobile ? 300 : 340,
            background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
            borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-overlay)',
            // No bottom padding either — the contributor list's half-cut row
            // must meet the panel's own edge, or the "there is more" cut reads
            // as clipping. Groups carry their own top spacing.
            padding: '4px 0 0', outline: 'none',
            // 60vh normally, but never floor-to-ceiling at 390 — the same
            // 132px fold margin the trigger's own comment used to reach for.
            maxHeight: 'min(60vh, calc(100vh - 132px))', overflowY: 'auto',
          }}
        >
          {/* Each group is conditional on its own data, so removing an engine
              module leaves a panel that offers only what still works. Density
              (feed.jsx) has no such module to drop, so View is unconditional. */}
          {window.CIRC_SORT_OPTIONS && (
            <LensSegmented label="Order" value={order} onPick={onOrder} options={window.CIRC_SORT_OPTIONS} />
          )}
          <LensSegmented label="View" value={density} onPick={onDensity} options={densityOptions} />
          {/* Reading A (BIZ-136 run 7): the fourth group, ABOVE "Added by" and
              not below it.
              It was built last, after Added by, and the design review caught
              what that cost by looking: this panel scrolls
              (maxHeight 60vh, overflowY auto) and "Added by" carries its own
              202px inner scroller, so a group placed after it lands BELOW the
              panel's clipped edge and is never seen. Worse, it was invisible to
              every check we had — the element is laid out, so
              getBoundingClientRect reports it on screen, and its text is in
              innerText, so a content assertion passes. Only a screenshot showed
              a heading and a caption with no control under them.
              So it sits with the other two short groups, and the one divider
              still separates the fixed controls from the contributor list.
              The "only you" distinction rides on the caption, as ruled — the
              position is about being seen at all, not about emphasis. */}
          {showSavedGroup && (
            <LensSegmented label="Saved" caption={window.CIRC_SAVED_LENS_CAPTION}
              value={saved ? 'only' : 'all'}
              onPick={(id) => onSaved(id === 'only')}
              options={window.CIRC_SAVED_LENS_OPTIONS} />
          )}
          {whoOptions.length > 1 && (
            <React.Fragment>
              <div style={{ height: 1, background: 'var(--color-border-2)', margin: '4px 10px' }} aria-hidden="true" />
              <LensList label="Added by" value={who} onPick={onWho} options={whoOptions} />
            </React.Fragment>
          )}
        </div>
      )}
    </div>
  );
};

// ---- What is applied -------------------------------------------------------
// Shown ONLY when something is non-default; the default feed carries nothing.
// This is what pays for folding the sort label away — and it is the applied-
// lens overview the convention asks for, without a count anywhere in it.
// ONE button, not a label with a small × inside it. The chip's only action is
// "drop this lens", so making the whole thing that action keeps the target at
// the app's declared 44px floor instead of inventing a 24px exception the
// tokens do not grant — and it means a control names its own action.
//
// Not --radius-pill: tokens.css reserves that for content-type badges and says
// explicitly NOT buttons, which this is.
// `onReopen`/`reopenLabel` (feed-enhancement candidate build, Reading A):
// under savedMode 'lens' ONLY, every narrowing this app can name now opens
// from the one door, so the chip that names it reopens that door too. TWO
// real `<button>`s, not one button doing two jobs — the label reopens, the ✕
// still clears, exactly as it always has (`clearLabel` untouched). The outer
// box carries the chip's own look (fill, border, radius); the buttons inside
// it are transparent, so the chip reads as one object with two live regions,
// not two chips glued together. Height stays the chip's own 44px throughout —
// the split adds width, never height, so the row's rhythm is untouched.
// Absent `onReopen` (every other mode), this renders the original one-button
// chip byte for byte — see the branch below.
const LensChip = ({ label, onClear, clearLabel, onReopen, reopenLabel }) => {
  if (onReopen) {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'stretch', cursor: 'default',
        background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-1)',
        borderRadius: 'var(--radius-md)', minHeight: 'var(--tap-target-min)', maxWidth: '100%',
      }}>
        <button type="button" onClick={onReopen}
          aria-label={typeof reopenLabel === 'function' ? reopenLabel(label) : reopenLabel}
          // The lens trigger this reopens carries both of these; the chip that
          // reopens the same panel was announced as a plain button.
          aria-haspopup="dialog" aria-expanded={false}
          style={{
          display: 'inline-flex', alignItems: 'center', cursor: 'pointer', overflow: 'hidden',
          background: 'transparent', border: 0, borderRadius: 'var(--radius-md) 0 0 var(--radius-md)',
          padding: '0 4px 0 10px', minHeight: 'var(--tap-target-min)',
          fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 500,
          color: 'var(--color-fg-1)', maxWidth: '100%',
        }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
        </button>
        {/* The split, drawn. Without it this chip is one plain rounded box with
            slightly loose padding, and the design review said so plainly: the
            label's tap target had NO visual encoding at all, so Reading A's
            second-best idea — the row leading back to the door that set it —
            was invisible in the very state built to show it. An affordance
            nobody can see is not an affordance.
            --color-border-2 is this file's own hairline/separator token, and
            its comment below records that using it as a control BORDER made a
            chip read as a generic tag. As a separator between two halves of one
            control it is exactly what it is for, and it is the conventional
            encoding of a split button rather than a device invented here.
            Inset 9px top and bottom so it never meets the rounded corners. */}
        <span aria-hidden="true" style={{
          width: 1, alignSelf: 'stretch', flexShrink: 0,
          background: 'var(--color-border-2)', margin: '9px 0',
        }} />
        <button type="button" onClick={onClear} aria-label={clearLabel} style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          background: 'transparent', border: 0, borderRadius: '0 var(--radius-md) var(--radius-md) 0',
          minWidth: 'var(--tap-target-min)', minHeight: 'var(--tap-target-min)', padding: '0 10px 0 2px',
          color: 'var(--color-fg-2)', flexShrink: 0,
        }}>
          <Icon name="x" size={13} />
        </button>
      </div>
    );
  }
  return (
    <button type="button" onClick={onClear} aria-label={clearLabel} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
      // --radius-md and --color-border-1, matching the trigger 8px away: the two
      // express the same engaged-lens state, so they cannot disagree on shape.
      // --color-border-2 is the hairline/separator token, and on a control it is
      // what made this read as a generic tag rather than one of this app's.
      background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-1)',
      borderRadius: 'var(--radius-md)', padding: '0 10px',
      minHeight: 'var(--tap-target-min)',
      fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 500,
      color: 'var(--color-fg-1)', maxWidth: '100%',
    }}>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      <span aria-hidden="true" style={{ display: 'inline-flex', flexShrink: 0, color: 'var(--color-fg-2)' }}>
        <Icon name="x" size={13} />
      </span>
    </button>
  );
};

// The chip says what the cards say. "Added by you", not "Added by You" — the
// panel's row is a standalone label and is capitalised; the chip is a sentence
// about the feed, and it sits directly above cards reading the lower-case form.
// At 390 the card's own attribution line drops the "Added by " prefix and shows
// the bare name, so the chip drops it too — the chip echoes whatever the cards
// beneath it are actually saying at that width. The full phrase stays in the
// control's accessible name either way.
const circAttributionName = (who) => (circIsYou(who) ? 'you'
  : circIsFormer(who) ? 'former member' : who);
// Joe's fix, 2026-09 (feed-enhancement candidate build): bare is now sentence
// case at its OWN first letter — 'You', 'Former member' — where the non-bare
// form stays exactly as the paragraph above ruled. The two are not the same
// kind of string any more: "Added by you" is a clause inside a sentence and
// stays lower-case; standing alone as the WHOLE label (the 390px chip), bare
// is a fragment on its own line, and a fragment opens capitalised the way any
// other label in this panel does (LensList's own row labels: 'You', 'Former
// member'). Only the first character changes — a contributor's own name
// ('Sam R.') already opens capitalised and is untouched either way.
const circAttributionPhrase = (who, bare) => {
  const name = circAttributionName(who);
  if (!bare) return 'Added by ' + name;
  return name.charAt(0).toUpperCase() + name.slice(1);
};

// `saved`/`onSaved` (feed-enhancement candidate build): a third, independent
// chip. It is not folded into circLensActive — saved is not part of the lens
// panel and must not light the lens trigger (see feed-saved.jsx's own header
// and the render-site note in main.jsx) — so this component's OWN render
// condition below is widened to `active || saved` rather than touching that
// shared predicate.
const LensChips = ({ order, who, onOrder, onWho, saved, onSaved, isMobile,
  // Search (feed-enhancement candidate build): `searchOpen` is already the
  // COMPOSITE flag main.jsx computes ("field open OR a query is already
  // typed") — this component does not re-derive it, it only asks whether
  // `window.SearchField` exists to draw it with.
  searchOpen, searchQuery, onSearchChange, onSearchClear,
  // Reading A / Reading B (feed-enhancement candidate build, run 7):
  // `savedMode` decides two independent things here. Under 'surface' the
  // Saved chip never renders at all — saved is a tab now, not a narrowing,
  // so it has nothing to disclose (main.jsx still narrows the list itself;
  // this component just stops naming it). Under 'lens' every chip gains a
  // second target that reopens the one door all of them now share.
  // `onReopenLens` is main.jsx's own `setSortMenuOpen(true)` — opened at
  // rest, never scrolled to a group.
  savedMode = 'bar', onReopenLens }) => {
  const active = circLensActive(order, who);
  const Field = window.SearchField || null;
  const showField = !!Field && !!searchOpen;
  const savedChipOn = savedMode === 'surface' ? false : !!saved;
  const anyChips = !!(who || (order && order !== 'newest') || savedChipOn);
  if (!active && !savedChipOn && !showField) return null;
  // `reopenLabel` is a FUNCTION of the chip's own label, not one fixed string
  // (BIZ-136 run 7, from the review). It was 'Change filters' on every chip, and
  // aria-label overrides a button's own text — so with two chips applied a
  // screen-reader user met two controls with identical names and neither said
  // which filter it would change. The visible words "Priya N." and "Saved"
  // appeared in neither name, which is WCAG 2.5.3 Label in Name failing on the
  // one word that carries the meaning. The visible label now leads, so the
  // accessible name starts with what is on screen.
  const reopen = savedMode === 'lens'
    ? { onReopen: onReopenLens, reopenLabel: (l) => l + '. Change filters' }
    : {};
  return (
    // Two nested boxes, deliberately. The OUTER one is full-bleed and carries
    // the sticky, the ground and the rule — so its edge lines up with the tab
    // bar's own rule directly above it, which is also full-bleed. The INNER one
    // holds the feed column's width and padding, so the chips line up with the
    // cards they describe. One box could not do both: it either floated its
    // rule 24px inside the pane or pushed the chips off the card edge.
    //
    // Sticky because in the scroll flow the row left the screen after one
    // swipe, and the chip is the whole reason folding the sort label away was
    // affordable — it cannot be a thing that only exists above the fold.
    <div style={{
      position: 'sticky', top: 'calc(var(--top-bar-height) + 48px)', zIndex: 48,
      background: 'var(--color-canvas)',
      borderBottom: '1px solid var(--color-border-2)', width: '100%',
    }}>
    <div style={{
      // Column now, not row: the field (when present) is its OWN full-width
      // row at the top, and the chips wrap on a row beneath it — same at both
      // widths, per the field's own no-adaptive-exception rule. When the field
      // is absent this collapses to exactly the single wrapping row it always
      // was; `gap: 8` reads the same either way.
      display: 'flex', flexDirection: 'column', gap: 8,
      padding: isMobile ? '8px 16px' : '8px 24px',
      maxWidth: 'var(--max-feed-width)', margin: '0 auto', width: '100%',
    }}>
      {/* THE DISCLOSURE, not a chip. A search chip would have to be both a
          label (what's typed) and an edit affordance (tap to change it),
          which LensChip's one-button-one-action design deliberately cannot
          be — see feed-search.jsx's own header for why the field lives here
          instead. */}
      {showField && <Field value={searchQuery} onChange={onSearchChange} onClear={onSearchClear} />}
      {anyChips && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {who && (
            <LensChip
              label={circAttributionPhrase(who, isMobile)}
              clearLabel={'Showing links added by ' + circContributorLabel(who) + '. Show links from everyone'}
              onClear={() => onWho(CIRC_LENS_ALL)} {...reopen} />
          )}
          {order && order !== 'newest' && (
            <LensChip
              label={window.circSortLabel ? window.circSortLabel(order) : order}
              clearLabel="Sorted oldest first. Sort newest first"
              onClear={() => onOrder('newest')} {...reopen} />
          )}
          {savedChipOn && (
            <LensChip
              label="Saved"
              clearLabel="Showing saved links. Show all read links"
              onClear={() => onSaved(false)} {...reopen} />
          )}
        </div>
      )}
    </div>
    </div>
  );
};

// ---- Nothing matched -------------------------------------------------------
// ONE component for every zero-match combination of who / saved / query
// (feed-enhancement candidate build, search half). Replaces THREE call sites
// in main.jsx — LensNoMatch below, plus feed-saved.jsx's SavedNoMatch and
// SavedLensNoMatch — with a single one that knows about all four narrowings
// at once, because search composes with the other two and the old
// one-component-per-combination approach does not scale past three. It lives
// HERE, in feed-lens.jsx (not feed-search.jsx), so that dropping
// feed-search.jsx alone leaves this component intact and degrading correctly:
// `query` is simply never set by anything, so its four search branches below
// never fire and the three original cases render exactly as they always did.
//
// REGRESSION CONTRACT: the three inputs that shipped before search — who
// alone, saved alone, who+saved — must emit what LensNoMatch / SavedNoMatch /
// SavedLensNoMatch emit today, character for character. Those three branches
// below are copied verbatim from those components; do not "tidy" the strings.
//
// SUPPORTING LINE RULE: write a line only where it is TRUE for the exact
// combination on screen; a missing line beats a false one. This is the whole
// reason the who+saved pair (run 4's SavedLensNoMatch) exists rather than
// reusing LensNoMatch's copy under the saved filter — "You have not read
// anything they added" is simply false there, since the member may have read
// plenty of the contributor's links and saved none of them.
//
// ESCAPE PRECEDENCE: search > contributor > saved. The button drops whichever
// narrowing was applied most recently and most transiently, and keeps the one
// the member deliberately walked into. A typed query is seconds old and the
// first thing a member forgets is on screen; the contributor lens is a
// standing view they return to; Saved is a shelf they went to on purpose, and
// least deserves being undone by a button that was really about something
// else.
const FeedNoMatch = ({ who, tab, saved, query, onClearWho, onClearSaved, onClearSearch }) => {
  const label = who ? circContributorLabel(who) : '';
  const q = String(query || '').trim();
  let headline, support;
  if (q) {
    // The four search combinations. The headline names EVERY active
    // narrowing, so nothing sitting in the chip row is missing from the
    // sentence — a member reading it should never have to check the chips to
    // know what "nothing" means here.
    headline = who && saved ? 'Nothing saved from ' + label + ' matches “' + q + '”'
      : who ? 'Nothing from ' + label + ' matches “' + q + '”'
      : saved ? 'Nothing saved matches “' + q + '”'
      : 'Nothing matches “' + q + '”';
    // True in every one of the four cases — it says where the search ceiling
    // is, which is this file's own index rule restated for the member reading
    // it, not the engineer reading feed-search.jsx's header.
    //
    // It must name ALL of the index and not most of it. It first read "title,
    // source and address", which omitted the contributor label — so a member
    // who had just found cards by typing a name was told search does not look
    // there. That is the same defect class this whole component exists to end
    // (a zero state asserting something untrue about the search), arriving as
    // an understatement instead of an overstatement. "Title or address"
    // because those are one field: a card headed by its URL has no title.
    support = 'Search looks at what a card shows — its title or address, its source, and who added it.';
  } else if (who && saved) {
    // REGRESSION: feed-saved.jsx's SavedLensNoMatch, verbatim.
    headline = 'Nothing saved from ' + label;
    support = 'Your saved links don’t include anything they added.';
  } else if (saved) {
    // REGRESSION: feed-saved.jsx's SavedNoMatch, verbatim.
    headline = 'No saved links here';
    support = 'Nothing in this circle is saved.';
  } else {
    // REGRESSION: this file's own LensNoMatch, verbatim.
    headline = 'Nothing here from ' + label;
    support = tab === 'read'
      ? 'You have not read anything they added.'
      : 'They have not added anything you have left to read.';
  }
  // Button label/colour/action all key off the SAME branch as the escape
  // precedence above — search wins, then contributor, then saved. The colour
  // split (accent vs fg-1) is run 4's own ruling, preserved exactly: a
  // recovery action is neutral UNLESS it also clears a lens or a search, both
  // of which stay accent (see feed-saved.jsx's SavedNoMatch/SavedLensNoMatch
  // comments for the reasoning, not repeated here).
  //
  // ONE EXCEPTION, and it is the design review's finding rather than a
  // preference: where a query sits ON TOP of another narrowing, clearing only
  // the query lands the member in a second filtered view that may also be
  // empty. They pressed the one calm action the screen offered and are still
  // looking at nothing. So when a query is combined with a contributor or with
  // saved, the escape clears ALL of them and says so.
  //
  // It applies only where a query is involved. The contributor+saved pair
  // WITHOUT a query is shipped behaviour under this component's regression
  // contract — it must keep emitting "Show everyone" and clearing only the
  // contributor — so that case is deliberately left alone, dead end and all,
  // and stays recorded as run 5's own ruling rather than quietly reversed here.
  let onClear, buttonLabel, buttonColor;
  if (q && (who || saved)) {
    onClear = () => { onClearSearch && onClearSearch(); onClearWho && onClearWho(); onClearSaved && onClearSaved(); };
    buttonLabel = 'Show all read links'; buttonColor = 'var(--color-accent)';
  } else if (q) {
    onClear = onClearSearch; buttonLabel = 'Clear search'; buttonColor = 'var(--color-accent)';
  } else if (who) {
    onClear = onClearWho; buttonLabel = 'Show everyone'; buttonColor = 'var(--color-accent)';
  } else {
    onClear = onClearSaved; buttonLabel = 'Show all read links'; buttonColor = 'var(--color-fg-1)';
  }
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '56px 24px', gap: 6,
    }}>
      <p style={{
        margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)',
        fontWeight: 600, color: 'var(--color-fg-1)',
      }}>{headline}</p>
      <p style={{
        margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)',
        color: 'var(--color-fg-2)', maxWidth: 320, lineHeight: 1.5,
      }}>{support}</p>
      <button type="button" onClick={onClear} style={{
        marginTop: 10, background: 'transparent', cursor: 'pointer',
        border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 600,
        color: buttonColor, minHeight: 'var(--tap-target-min)', padding: '0 16px',
      }}>{buttonLabel}</button>
    </div>
  );
};

// The three components below are SUPERSEDED by FeedNoMatch above and no
// longer called from main.jsx. Left defined and exported — deletable-aid
// idiom, same as every other module in this app: harmless to keep, and it
// means dropping just feed-lens.jsx (an edge case FeedNoMatch's own header
// does not promise to cover) does not also delete code some other caller
// might still reach for.
const LensNoMatch = ({ who, tab, onClear }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', padding: '56px 24px', gap: 6,
  }}>
    <p style={{
      margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)',
      fontWeight: 600, color: 'var(--color-fg-1)',
    }}>
      {'Nothing here from ' + circContributorLabel(who)}
    </p>
    <p style={{
      margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)',
      color: 'var(--color-fg-2)', maxWidth: 320, lineHeight: 1.5,
    }}>
      {tab === 'read'
        ? 'You have not read anything they added.'
        : 'They have not added anything you have left to read.'}
    </p>
    <button type="button" onClick={onClear} style={{
      marginTop: 10, background: 'transparent', cursor: 'pointer',
      // A bordered ghost control, not accent-coloured text. As bare text it was
      // carried by colour alone — and less marked than an ordinary link, since
      // the stylesheet underlines those.
      border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 600,
      color: 'var(--color-accent)', minHeight: 'var(--tap-target-min)', padding: '0 16px',
    }}>Show everyone</button>
  </div>
);

Object.assign(window, {
  FeedLens, LensChips, LensNoMatch, FeedNoMatch,
  circContributors, circContributorOf, circContributorLabel, circAttributionPhrase,
  circFilterItems, circLensActive, CIRC_LENS_ALL,
});
