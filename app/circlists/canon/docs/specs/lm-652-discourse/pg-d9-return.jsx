// ============================================================================
// Discourse v9 — return. Five answers, each one a whole route: something tells
// you, you SEE WHAT before you commit to it, you travel, and you arrive
// somewhere unmistakable with the article still one tap away.
//
// What the last round established:
//   · never a micro dot — the app already spends that mark on the rail and on
//     arrival, and a third one freckles the page;
//   · never on the circle's name and never in circle settings;
//   · nothing in the Active feed: the loading pill lives there and the queue is
//     not where you go to catch up;
//   · a LIST before the jump. Being thrown at a card chosen for you is worse
//     than choosing, even when the choice is easy;
//   · Read may re-order, but it may not house a second list you have to get out
//     of.
// So every affordance here sits on Read, above the shelf, and says WHO and WHAT.
// ============================================================================
const { d9Watching: rWatching, d9HasNew: rHasNew, d9New: rNew, d9NewSaid: rSaid, d9Title: rTitle,
        d9Spoke: rSpoke, d9AnsweredYou: rAnswered } = window;

const d9Latest = (item, st) => {
  const said = rSaid(item, st);
  return said.length ? said[said.length - 1] : null;
};
const d9Names = (list) => list.length === 1 ? list[0]
  : list.length === 2 ? list[0] + ' and ' + list[1]
  : list.slice(0, 2).join(', ') + ' and others';

// ---- the eyebrow every route shares ---------------------------------------
const D9Eyebrow = ({ children }) => (
  <span style={{ font: '500 10.5px/1 var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-fg-3)', flexShrink: 0 }}>{children}</span>
);

// ---- the list row: this is where the signal actually lives -----------------
// v8's return told you something had happened and then handed you a card. A row
// here carries the source, the card, who spoke and the words themselves, so the
// jump is a decision rather than a surprise.
const D9WantRow = ({ item, st, onGo, current }) => {
  const last = d9Latest(item, st);
  return (
    <button type="button" onClick={() => onGo(item)} className="circ-d9-row" aria-current={current ? 'true' : undefined}
      style={{ display: 'flex', gap: 11, alignItems: 'flex-start', width: '100%', textAlign: 'left', cursor: 'pointer',
        background: current ? 'var(--color-surface-sunken)' : 'transparent', borderWidth: 0,
        borderRadius: 'var(--radius-md)', padding: '10px 10px 11px', minHeight: 44 }}>
      <span style={{ flexShrink: 0, marginTop: 1 }}><window.Avatar name={(last && last.by) || 'Circle'} size={26} /></span>
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ font: '600 13.5px/1.35 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty',
          display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{rTitle(item)}</span>
        {last && (
          <span style={{ font: '400 13px/1.5 var(--font-sans)', color: 'var(--color-fg-2)', textWrap: 'pretty',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-fg-1)' }}>{last.by === 'You' ? 'You' : last.by}{(last.replyTo && (item.talk || []).some(t => t.id === last.replyTo && t.by === 'You')) ? ', answering you' : ''}: </span>
            {last.text}
          </span>
        )}
      </span>
      <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', height: 26, gap: 8 }}>
        <span style={{ font: '400 11px/1.3 var(--font-sans)', color: 'var(--color-fg-3)', whiteSpace: 'nowrap' }}>{last ? window.circWhen(last.at) : ''}</span>
        <window.Icon name="chevron-right" size={15} color="var(--color-fg-3)" />
      </span>
    </button>
  );
};

const D9WantList = ({ wanted, st, onGo, currentId }) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    {wanted.map((i, n) => (
      <React.Fragment key={i.id}>
        {n > 0 && <span aria-hidden="true" style={{ height: 1, background: 'var(--color-border-2)', margin: '0 10px' }} />}
        <D9WantRow item={i} st={st} onGo={onGo} current={i.id === currentId} />
      </React.Fragment>
    ))}
  </div>
);

// Position through a traversal, as dots — where you are in a walk, never a
// tally of what you have not read.
const D9Dots = ({ total, at }) => (
  <span aria-hidden="true" style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
    {Array.from({ length: Math.min(total, 6) }).map((_, i) => (
      <span key={i} style={{ width: 5, height: 5, borderRadius: '50%',
        background: i === at ? 'var(--color-accent)' : 'var(--color-border-1)' }} />
    ))}
  </span>
);

// ============================================================================
// R1 · THE STRIP  (state 1 — the door opens a room)
// One quiet row above the shelf that names who spoke. It opens into the list in
// place, and walks you card to card without ever leaving Read.
// ============================================================================
const D9Strip = ({ wanted, st, goTo, travelId }) => {
  const [open, setOpen] = React.useState(false);
  if (!wanted.length) return null;
  const who = rSpoke(wanted, st);
  const at = Math.max(0, wanted.findIndex(i => i.id === travelId));
  return (
    <div style={{ background: 'var(--color-surface)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--color-border-1)',
      borderRadius: 'var(--radius-lg)', boxShadow: open ? 'var(--shadow-raised)' : 'none', overflow: 'hidden' }}>
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} className="circ-d9-row"
        style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', minHeight: 48, padding: '0 12px 0 14px',
          background: 'transparent', borderWidth: 0, cursor: 'pointer', textAlign: 'left' }}>
        <span aria-hidden="true" style={{ width: 3, height: 18, borderRadius: 2, background: 'var(--color-sage)', flexShrink: 0 }} />
        <span style={{ flex: 1, minWidth: 0, font: '500 13.5px/1.4 var(--font-sans)', color: 'var(--color-fg-1)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {d9Names(who)} {who.length === 1 ? 'spoke' : 'spoke'} on cards you are part of
        </span>
        {travelId && wanted.length > 1 && <D9Dots total={wanted.length} at={at} />}
        <span style={{ display: 'inline-flex', flexShrink: 0, color: 'var(--color-fg-3)',
          transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base) var(--ease-quiet)' }}>
          <window.Icon name="chevron-down" size={16} />
        </span>
      </button>
      {open && (
        <div style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)', padding: '4px 2px' }}>
          <D9WantList wanted={wanted} st={st} onGo={goTo} currentId={travelId} />
        </div>
      )}
    </div>
  );
};

// ============================================================================
// R2 · WHO ANSWERED, THEN PAGE TO PAGE  (state 2 — the card has a page)
// Above the shelf: the one line that matters, and it is about people. Then the
// walk continues ON the pages themselves, so catching up never returns you to
// the feed to find the next one.
// ============================================================================
const D9Answered = ({ wanted, st, goTo }) => {
  if (!wanted.length) return null;
  const answering = wanted.filter(i => rAnswered(i, st));
  const rest = wanted.filter(i => !rAnswered(i, st));
  const line = (list, verb) => list.length ? d9Names(rSpoke(list, st)) + ' ' + verb : null;
  const parts = [line(answering, 'answered you'), line(rest, 'spoke')].filter(Boolean);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, background: 'var(--color-surface)',
      borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--color-border-1)', borderRadius: 'var(--radius-lg)', padding: '4px 2px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px 4px' }}>
        <D9Eyebrow>since you looked</D9Eyebrow>
        <span style={{ flex: 1, minWidth: 0, font: '500 13px/1.4 var(--font-sans)', color: 'var(--color-fg-1)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{parts.join(' \u00b7 ')}</span>
      </div>
      <D9WantList wanted={wanted} st={st} onGo={goTo} />
    </div>
  );
};

// The walk, carried on the card's own page: the next card that moved, named, at
// the foot of the page you are reading.
const D9PageNext = ({ wanted, st, item, goTo }) => {
  const rest = wanted.filter(i => i.id !== item.id);
  if (!rest.length) return null;
  const next = rest[0];
  const last = d9Latest(next, st);
  return (
    <div style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)', paddingTop: 14, marginTop: 22 }}>
      <D9Eyebrow>also moved</D9Eyebrow>
      <button type="button" onClick={() => goTo(next)} className="circ-d9-row"
        style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', marginTop: 8,
          background: 'transparent', borderWidth: 0, borderRadius: 'var(--radius-md)', padding: '10px', cursor: 'pointer', minHeight: 44 }}>
        <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: '600 13.5px/1.35 var(--font-sans)', color: 'var(--color-fg-1)' }}>{rTitle(next)}</span>
          {last && <span style={{ font: '400 12.5px/1.4 var(--font-sans)', color: 'var(--color-fg-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{last.by} spoke {window.circWhen(last.at)}</span>}
        </span>
        <window.Icon name="chevron-right" size={16} color="var(--color-fg-3)" />
      </button>
    </div>
  );
};

// ============================================================================
// R3 · THE RISE  (state 3 — talk in the feed)
// No affordance at all: the cards the circle is talking about are simply at the
// top of Read, above a hairline, with their talk already showing on them. The
// list IS the feed, so there is nothing to open and nothing to get out of.
// ============================================================================
const D9Rise = ({ wanted, st }) => wanted.length ? (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 2px' }}>
    <D9Eyebrow>still talking</D9Eyebrow>
    <span style={{ flex: 1, minWidth: 0, font: '400 12.5px/1.4 var(--font-sans)', color: 'var(--color-fg-3)',
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d9Names(rSpoke(wanted, st))} spoke since you looked</span>
  </div>
) : null;

// ============================================================================
// R4 · THE PILL, WHICH OPENS AS A LIST  (state 4 — talk rides the Swell)
// The pill is the app's own returning-to-something shape. Tapping it does NOT
// jump: it opens the list beneath itself, in place. You pick, you travel, and
// the card you have seen leaves the list behind you.
// ============================================================================
const D9Pill = ({ wanted, st, goTo, travelId }) => {
  const [open, setOpen] = React.useState(false);
  if (!wanted.length) return null;
  const glyphs = [];
  wanted.forEach(i => rNew(i, st && st.countBareReactions).forEach(e => {
    const g = e.glyph; if (g && !glyphs.includes(g) && glyphs.length < 3) glyphs.push(g);
  }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open}
        style={{ alignSelf: 'center', display: 'inline-flex', alignItems: 'center', gap: 9, minHeight: 44,
          padding: '0 16px', cursor: 'pointer', background: 'var(--color-surface)',
          borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--color-border-1)',
          borderRadius: 'var(--radius-pill)', boxShadow: 'var(--shadow-raised)',
          font: '600 13px/1 var(--font-sans)', color: 'var(--color-fg-1)' }}>
        {glyphs.length > 0 && (
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            {glyphs.map((g, i) => <span key={i} style={{ fontSize: 15, lineHeight: 1, marginLeft: i ? -4 : 0 }}>{g}</span>)}
          </span>
        )}
        <span>Still talking</span>
        {travelId && wanted.length > 1 && <D9Dots total={wanted.length} at={Math.max(0, wanted.findIndex(i => i.id === travelId))} />}
        <span style={{ display: 'inline-flex', color: 'var(--color-fg-3)', transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform var(--duration-base) var(--ease-quiet)' }}><window.Icon name="chevron-down" size={15} /></span>
      </button>
      {open && (
        <div style={{ background: 'var(--color-surface)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--color-border-1)',
          borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-raised)', padding: '4px 2px' }}>
          <D9WantList wanted={wanted} st={st} onGo={(it) => { setOpen(false); goTo(it); }} currentId={travelId} />
        </div>
      )}
    </div>
  );
};

// ============================================================================
// R5 · THE PEOPLE  (state 5 — the thought is the spine)
// Return is about who, not how many and not which card. Faces and names above
// the shelf; touching a person takes you to what they said. The card is a
// consequence of the person, which is the right way round for a circle.
// ============================================================================
const D9People = ({ wanted, st, goTo }) => {
  if (!wanted.length) return null;
  const rows = [];
  wanted.forEach(i => rSaid(i, st).forEach(e => {
    if (!rows.some(r => r.by === e.by)) rows.push({ by: e.by, item: i, entry: e, answering: !!(e.replyTo && (i.talk || []).some(t => t.id === e.replyTo && t.by === 'You')) });
  }));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 2px' }}>
      <D9Eyebrow>who spoke</D9Eyebrow>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {rows.map(r => (
          <button key={r.by + r.item.id} type="button" onClick={() => goTo(r.item, r.entry)} className="circ-d9-person"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minHeight: 44, padding: '0 14px 0 6px',
              background: 'var(--color-surface)', borderWidth: 1, borderStyle: 'solid',
              borderColor: r.answering ? 'var(--color-accent)' : 'var(--color-border-1)',
              borderRadius: 'var(--radius-lg)', cursor: 'pointer' }}>
            <window.Avatar name={r.by} size={30} />
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ font: '600 13px/1.25 var(--font-sans)', color: 'var(--color-fg-1)' }}>{r.by}</span>
              <span style={{ font: '400 11.5px/1.25 var(--font-sans)', color: r.answering ? 'var(--color-accent)' : 'var(--color-fg-3)' }}>
                {r.answering ? 'answered you' : 'spoke'}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { d9Latest, d9Names, D9Eyebrow, D9WantRow, D9WantList, D9Dots, D9Strip, D9Answered, D9PageNext, D9Rise, D9Pill, D9People });
