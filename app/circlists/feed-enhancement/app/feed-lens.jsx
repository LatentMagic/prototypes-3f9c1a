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
// room. It has no answer for the four controls still queued behind this one
// (density, columns, saved, search): two buttons today is six in a 48px strip
// that already carries two tabs, and that strip dies.
//
// So order and who fold into one entry point opening one panel with two
// labelled groups. Density and columns join the same panel later; search and
// saved are a different kind of thing and get their own affordance.
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

// One radio group inside the panel. APG radio-group semantics: arrows move AND
// select, the checked option is the only tab stop, Escape is handled by the
// panel. Used rather than a menu because the panel is a set of settings that
// stays open while you read it, not a list of commands that closes on pick.
const LensGroup = ({ label, options, value, onPick }) => {
  const refs = React.useRef([]);
  const idx = Math.max(0, options.findIndex((o) => o.id === value));

  const onKey = (e) => {
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

  return (
    <div style={{ padding: '4px 0' }}>
      <div style={{
        padding: '6px 12px 4px', fontFamily: 'var(--font-sans)', fontSize: 11,
        fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
        color: 'var(--color-fg-3, var(--color-fg-2))',
      }}>{label}</div>
      <div role="radiogroup" aria-label={label} onKeyDown={onKey}>
        {options.map((o, i) => {
          const on = o.id === value;
          return (
            <button
              key={String(o.id)}
              ref={(el) => { refs.current[i] = el; }}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              onClick={() => onPick(o.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left',
                // The app declares its own touch-target floor and a menu row is one.
                padding: '0 12px', minHeight: 'var(--tap-target-min)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)',
                fontWeight: on ? 600 : 500,
                color: on ? 'var(--color-accent)' : 'var(--color-fg-1)',
              }}
            >
              {/* The tick is the checked mark, and the slot is held either way so
                  every label sits on one left edge. Never colour alone. */}
              <span style={{ width: 16, flexShrink: 0, display: 'inline-flex' }} aria-hidden="true">
                {on && <Icon name="check" size={16} />}
              </span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const FeedLens = ({ order, who, contributors, onOrder, onWho, open, onOpenChange, isMobile }) => {
  const btnRef = React.useRef(null);
  const panelRef = React.useRef(null);
  const active = circLensActive(order, who);

  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      const first = panelRef.current && panelRef.current.querySelector('[role="radio"][aria-checked="true"]');
      if (first) first.focus({ preventScroll: true });
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

  const whoOptions = [{ id: CIRC_LENS_ALL, label: 'Everyone' }].concat(
    (contributors || []).map((w) => ({ id: w, label: circContributorLabel(w) }))
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
  const spoken = 'View options: ' + (window.circSortLabel ? window.circSortLabel(order).toLowerCase() : order)
    + ', ' + (who ? 'added by ' + circContributorLabel(who) : 'everyone');

  return (
    // Stretches to the bar's full height so the panel hangs from the bar's own
    // edge, while the button inside it stays at the 44px floor.
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', alignSelf: 'stretch' }}>
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
        style={{
          // NOT --color-accent-soft: tokens.css reserves that for focus-ring
          // backgrounds. The sunken surface is the app's own resting tint.
          background: active ? 'var(--color-surface-sunken)' : 'transparent',
          border: 0, cursor: 'pointer', padding: 0,
          // One geometry at both widths — the app's declared 44px touch floor,
          // centred in the bar's 48px, so the tint never reads as a third
          // pressed tab at mobile the way a full-height one did.
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
            position: 'absolute', top: '100%', right: 0, zIndex: 60,
            minWidth: 196, maxWidth: 260,
            background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
            borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-overlay)',
            // Horizontal padding so a focus ring on a row lands inside the
            // panel rather than flush against its border.
            padding: '4px 6px', outline: 'none',
            // Reaches down to the fold rather than stopping at 60vh, which cut
            // the last option in half at 390 with 240px of viewport to spare.
            maxHeight: 'calc(100vh - 132px)', overflowY: 'auto',
          }}
        >
          {/* Each group is conditional on its own data, so removing either
              engine module leaves a panel that offers only what still works. */}
          {window.CIRC_SORT_OPTIONS && (
            <LensGroup label="Sort" value={order} onPick={onOrder} options={window.CIRC_SORT_OPTIONS} />
          )}
          {whoOptions.length > 1 && (
            <React.Fragment>
              <div style={{ height: 1, background: 'var(--color-border-2)', margin: '4px 8px' }} aria-hidden="true" />
              <LensGroup label="Added by" value={who} onPick={onWho} options={whoOptions} />
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
const LensChip = ({ label, onClear, clearLabel }) => (
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

// The chip says what the cards say. "Added by you", not "Added by You" — the
// panel's row is a standalone label and is capitalised; the chip is a sentence
// about the feed, and it sits directly above cards reading the lower-case form.
// At 390 the card's own attribution line drops the "Added by " prefix and shows
// the bare name, so the chip drops it too — the chip echoes whatever the cards
// beneath it are actually saying at that width. The full phrase stays in the
// control's accessible name either way.
const circAttributionName = (who) => (circIsYou(who) ? 'you'
  : circIsFormer(who) ? 'former member' : who);
const circAttributionPhrase = (who, bare) => (bare ? '' : 'Added by ') + circAttributionName(who);

const LensChips = ({ order, who, onOrder, onWho, isMobile }) => {
  if (!circLensActive(order, who)) return null;
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
      display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap',
      padding: isMobile ? '8px 16px' : '8px 24px',
      maxWidth: 'var(--max-feed-width)', margin: '0 auto', width: '100%',
    }}>
      {who && (
        <LensChip
          label={circAttributionPhrase(who, isMobile)}
          clearLabel={'Showing links added by ' + circContributorLabel(who) + '. Show links from everyone'}
          onClear={() => onWho(CIRC_LENS_ALL)} />
      )}
      {order && order !== 'newest' && (
        <LensChip
          label={window.circSortLabel ? window.circSortLabel(order) : order}
          clearLabel="Sorted oldest first. Sort newest first"
          onClear={() => onOrder('newest')} />
      )}
    </div>
    </div>
  );
};

// ---- Nothing matched -------------------------------------------------------
// A third empty register the spec does not contemplate: not "you have no
// links", but "none of yours match this lens". It follows the two registers
// that do exist — one calm centred typographic block, no illustration — and
// names what was filtered, then offers the way out, which is what an empty
// state is required to do.
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
  FeedLens, LensChips, LensNoMatch,
  circContributors, circContributorOf, circContributorLabel, circAttributionPhrase,
  circFilterItems, circLensActive, CIRC_LENS_ALL,
});
