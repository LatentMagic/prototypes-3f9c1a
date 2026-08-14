// ============================================================================
// Discourse v10 — CHAPTER N: how the circle tells you it has moved.
//
// v9 built five routes and put every one of them on the Read tab, because an
// earlier round had ruled out the circle's name and circle settings. That ruling
// was about two specific PLACES; it was read as "nothing above the tab", and the
// whole circle scope went with it. Restored here as three more options.
//
// N1–N5 are v9's five, kept exactly as they were — nothing is lost.
// N6–N8 are circle-scope: they sit above the tabs, so being on Active, or having
// just walked in, is no longer a way to miss the fact that people are talking.
//
// Every option still has to say WHO and WHAT before it moves you, and every
// route ends on the card with the article one tap away (rule 9).
// ============================================================================
const { d9Names: nNames, d9Spoke: nSpoke, d9AnsweredYou: nAnswered, D9WantList: NLIST,
        D9Dots: NDOTS, D9Eyebrow: NEYE, d9Title: nTtl, d9NewSaid: nSaid, d9Latest: nLatest } = window;

// Who, and what they did — answering you is a different fact from speaking, so
// the two clauses are built separately and only the true one is claimed.
const n10Line = (wanted, st) => {
  const ans = wanted.filter(i => nAnswered(i, st));
  const rest = wanted.filter(i => !nAnswered(i, st));
  const clause = (list, verb) => list.length ? nNames(nSpoke(list, st)) + ' ' + verb : null;
  return [clause(ans, 'answered you'), clause(rest, 'spoke')].filter(Boolean).join(' \u00b7 ');
};

// ============================================================================
// N6 · UNDER THE CIRCLE'S NAME
// A band directly beneath the circle's own name, so it belongs to the circle and
// not to a tab: you see it on Active, you see it on Read, you see it the moment
// you walk in. It opens the list in place and walks you card to card; when the
// list is empty the band is not there at all.
// ============================================================================
const D10CircleBar = ({ wanted, st, goTo, travelId, isApp }) => {
  const [open, setOpen] = React.useState(false);
  if (!wanted.length) return null;
  const at = Math.max(0, wanted.findIndex(i => i.id === travelId));
  return (
    <div style={{ background: 'var(--color-surface)', borderBottomWidth: 1, borderBottomStyle: 'solid',
      borderBottomColor: 'var(--color-border-2)' }}>
      <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', width: '100%', padding: isApp ? '0 8px' : '0 16px' }}>
        <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} className="circ-d9-row"
          style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', minHeight: 46, padding: '0 8px',
            background: 'transparent', borderWidth: 0, cursor: 'pointer', textAlign: 'left' }}>
          <span aria-hidden="true" style={{ width: 3, height: 16, borderRadius: 2, background: 'var(--color-sage)', flexShrink: 0 }} />
          <span style={{ flex: 1, minWidth: 0, font: '500 13px/1.4 var(--font-sans)', color: 'var(--color-fg-1)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n10Line(wanted, st)}</span>
          {travelId && wanted.length > 1 && <NDOTS total={wanted.length} at={at} />}
          <span style={{ display: 'inline-flex', flexShrink: 0, color: 'var(--color-fg-3)',
            transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base) var(--ease-quiet)' }}>
            <window.Icon name="chevron-down" size={16} />
          </span>
        </button>
        {open && (
          <div style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)', padding: '4px 0 8px' }}>
            <NLIST wanted={wanted} st={st} onGo={(it) => { setOpen(false); goTo(it); }} currentId={travelId} />
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// N7 · ON THE WAY IN
// The circle says it once, as you arrive, with the words already in it — then it
// is gone and there is nothing left to clear. Nothing accumulates, nothing wears
// a count, and if you ignore it the cards are still on the shelf where they were.
// ============================================================================
const D10Arrival = ({ wanted, st, goTo, onDismiss, isApp }) => {
  if (!wanted.length) return null;
  const rows = wanted.slice(0, 2);
  return (
    <div className="circ-anim-fade" style={{ background: 'var(--color-surface-sunken)',
      borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: 'var(--color-border-2)' }}>
      <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', width: '100%',
        padding: isApp ? '12px 14px 10px' : '16px 24px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <span style={{ flex: 1, minWidth: 0, font: '500 14px/1.45 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>
            While you were away, {n10Line(wanted, st)}.
          </span>
          <button type="button" onClick={onDismiss} className="circ-d9-answer" aria-label="Dismiss"
            style={{ flexShrink: 0, minHeight: 40, padding: '0 10px', margin: '-8px -10px 0 0', background: 'transparent',
              borderWidth: 0, borderRadius: 'var(--radius-md)', cursor: 'pointer',
              font: '500 12.5px/1 var(--font-sans)', color: 'var(--color-fg-3)' }}>Not now</button>
        </div>
        <div style={{ marginTop: 4 }}>
          <NLIST wanted={rows} st={st} onGo={goTo} />
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// N8 · ON THE CIRCLE, BEFORE YOU ARE IN IT
// The signal belongs to the circle in the circles list: you know which circle is
// talking, and who, before you enter it — and entering IS the way in, so there
// is no second affordance anywhere inside.
//
// Copy, not a fork: the row's geometry, tile and summary line are CirclesHome's
// (app/home.jsx), unchanged, with one line added under the summary. The shipped
// component takes only `spaces`, and its signal slot is documented as exclusive
// ("a circle never wears two signals"), so the discourse line cannot be passed
// in without changing the app. See skills/build-playground — copying is
// allowed once.
// ============================================================================
const d10Summary = (s) => {
  const members = (s.members ? s.members.length : 0) + ' member' + ((s.members || []).length === 1 ? '' : 's');
  const unread = (s.items || []).filter(i => !i.read).length;
  return (unread ? unread + ' unread' : 'All read') + ' \u00b7 ' + members;
};

const D10CircleRow = ({ space, wanted, st, onEnter, rail = false }) => {
  const talking = wanted.length > 0;
  const last = talking ? nLatest(wanted[0], st) : null;
  return (
    <button type="button" onClick={onEnter} className="circ-appsheet-row"
      style={{ display: 'flex', alignItems: 'flex-start', gap: 12, width: '100%', textAlign: 'left', cursor: 'pointer',
        background: 'var(--color-surface)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--color-border-1)',
        borderRadius: 'var(--radius-lg)', padding: rail ? '11px 12px' : '13px 14px', minHeight: 64,
        boxShadow: 'var(--shadow-raised)', fontFamily: 'var(--font-sans)' }}>
      <span aria-hidden="true" style={{ width: 38, height: 38, borderRadius: 12, flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
        background: 'var(--color-surface-sunken)', color: 'var(--color-fg-2)',
        font: '600 16px/1 var(--font-sans)' }}>{(space.name || '?').trim().charAt(0).toUpperCase()}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', font: '600 15.5px/1.3 var(--font-sans)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{space.name}</span>
        <span style={{ display: 'block', marginTop: 3, font: '500 12.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{d10Summary(space)}</span>
        {talking && (
          <span style={{ display: 'flex', gap: 7, alignItems: 'flex-start', marginTop: 8 }}>
            <span aria-hidden="true" style={{ width: 3, alignSelf: 'stretch', borderRadius: 2, background: 'var(--color-sage)', flexShrink: 0 }} />
            <span style={{ minWidth: 0, font: '400 13px/1.5 var(--font-sans)', color: 'var(--color-fg-2)', textWrap: 'pretty',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-fg-1)' }}>{nNames(nSpoke(wanted, st))} on {nTtl(wanted[0])}{wanted.length > 1 ? ' and ' + (wanted.length - 1) + ' more' : ''}: </span>
              {last ? last.text : ''}
            </span>
          </span>
        )}
      </span>
      <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', height: 38 }}>
        <window.Icon name="chevron-right" size={18} color="var(--color-fg-3)" />
      </span>
    </button>
  );
};

const D10Circles = ({ space, wanted, st, onEnter, rail = false }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span style={{ font: '600 11px/1 var(--font-sans)', letterSpacing: '0.06em', textTransform: 'uppercase',
      color: 'var(--color-fg-3)', padding: '0 4px 2px' }}>Your circles</span>
    <D10CircleRow space={space} wanted={wanted} st={st} onEnter={onEnter} rail={rail} />
  </div>
);

// ---- the chapter ----------------------------------------------------------
// N1–N5: v9's five, unchanged. N6–N8: circle scope.
const D10_RETURN = [
  {
    id: 'n1', n: 'N1', name: 'A strip above the shelf',
    stance: 'On Read, one quiet row names who spoke. It opens into the list in place \u2014 the cards, with the words in them \u2014 and walks you card to card without ever leaving the shelf.',
    cost: 'Only speaks on Read. Sitting on Active, or walking in and going nowhere near the shelf, you never learn anything at all.',
    patch: { returnFeedTop: (p) => <window.D9Strip {...p} /> },
  },
  {
    id: 'n2', n: 'N2', name: 'Who answered you',
    stance: 'One line above the shelf, and it is about people: who answered you, then who spoke. The list opens each card, and each card offers the next one that moved, so catching up never sends you back to the feed.',
    cost: 'Read-only, again \u2014 and \u201canswered you\u201d makes the first read of the line about you rather than about the circle.',
    patch: { returnAbove: (p) => <window.D9Answered {...p} /> },
  },
  {
    id: 'n3', n: 'N3', name: 'The cards simply rise',
    stance: 'No affordance whatsoever. Cards the circle is still talking about sit at the top of Read above a hairline, with their talk already showing on them. Nothing to open, nothing to clear, nothing to get out of.',
    cost: 'A silent signal: nothing ever tells you to look, so a fortnight away and a fortnight of quiet look identical from anywhere else in the app.',
    patch: { returnFeedTop: (p) => <window.D9Rise {...p} />, divideRead: true,
      sortRead: (list) => (window.D9_FEED && window.D9_FEED.sortRead ? window.D9_FEED.sortRead(list) : list) },
  },
  {
    id: 'n4', n: 'N4', name: 'The pill, which opens as a list',
    stance: 'The app\u2019s own returning-to-something shape, carrying the glyphs of whoever spoke. Tapping does not jump: it opens the list beneath itself, you pick, and the card you have seen leaves the list behind you.',
    cost: 'The pill is the loading shape too, so one form now means two things. Floating chrome on the shelf, and still only on Read.',
    patch: { returnFeedTop: (p) => <window.D9Pill {...p} /> },
  },
  {
    id: 'n5', n: 'N5', name: 'The people',
    stance: 'Return is about who, not how many and not which card. Faces above the shelf; touch a person and you land on what they said. The card is a consequence of the person, which is the right way round for a circle.',
    cost: 'One person speaking on three cards is one face and three destinations, so the row cannot tell you how much is waiting. Faces wrap into a block at nine members.',
    patch: { returnAbove: (p) => <window.D9People {...p} /> },
  },
  {
    id: 'n6', n: 'N6', name: 'Under the circle\u2019s name',
    stance: 'Circle scope: a band directly beneath the circle\u2019s own name, present on Active and on Read alike, so the fact that people are talking is not something only the shelf knows. It opens the list in place and walks you through.',
    cost: 'A permanent band above both tabs is the loudest thing in the circle, and it is one row of chrome the app does not have today. It says nothing until something moves \u2014 then it is always in the eyeline.',
    patch: { circleBar: (p) => <D10CircleBar {...p} /> },
  },
  {
    id: 'n7', n: 'N7', name: 'On the way in',
    stance: 'Circle scope, said once. Walking into the circle, it tells you what moved and shows the words; dismiss it, or use it, and it is gone. Nothing accumulates and there is never a count to clear.',
    cost: 'Miss it and it is missed \u2014 the one thing L1 tolerates least well. It also puts a block of talk between you and the feed at the exact moment you arrive.',
    patch: { arrival: (p) => <D10Arrival {...p} /> },
  },
  {
    id: 'n8', n: 'N8', name: 'On the circle, before you are in it',
    stance: 'The signal belongs to the circle in the circles list: which circle is talking, who, and about what \u2014 read before you enter. Entering is the way in, so nothing inside the circle carries a mark at all. Home in the app posture; the rail\u2019s own circle row on the web.',
    cost: 'One circle in the seed, so the list is short \u2014 with six circles this row is the thing that scales, and the summary line has to compete with unread counts. Inside the circle, nothing tells you anything.',
    patch: { homeCircles: true },
  },
];

Object.assign(window, { D10_RETURN, D10CircleBar, D10Arrival, D10Circles, D10CircleRow, n10Line });
