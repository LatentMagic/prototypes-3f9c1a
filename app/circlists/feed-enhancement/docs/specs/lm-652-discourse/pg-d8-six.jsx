// ============================================================================
// Discourse v8 — the SIXTH state: return, on its own.
//
// The other five each answer return inside their own idiom, and four of them
// only ever speak on Read. This state asks the narrower question on its own:
// wherever you are inside a circle, how does the circle tell you that a card
// you are part of has moved — and what happens when you go?
//
// The app around it is deliberately plain: a thought on the card, a reflection
// at the read, the record behind the shipped door. NOTHING on the card carries
// a mark. Every signal here is circle-level, so the five ideas are judged
// against each other and against the app's real chrome — the circle name row,
// the tabs, the settings gear, the feed — and never against a card treatment.
//
// This is the one state with a switcher, and the switcher lives in the rig's
// rail, not in the app: the question is now a single narrow axis, and the only
// way to feel five answers to one axis is to swap them in place.
// ============================================================================
const { D8Write: W6, D8Talk: T6, D8Thought: TH6, D8Sheet: S6, D8Watch: WA6, D8Again: AG6,
        D8Door: DR6, D8OnCard: OC6 } = window;

const D8_SIX_VARIANTS = [
  { id: 'name', name: 'On the circle\u2019s name',
    note: 'a mark in the top bar, beside the circle name. It opens what is moving; a row takes you to the card.',
    cost: 'the top bar has been status-only by design \u2014 this is the first thing in it you can press, and it sits next to the gear competing for the same corner.' },
  { id: 'tab', name: 'On the Read tab',
    note: 'the Read tab itself carries the mark. Going to Read is the whole journey: the moved cards are gathered at the top, under the waterline.',
    cost: 'it can only ever say \u201csomething is on Read\u201d \u2014 never what, or who. And it puts a signal on a navigation control that has never carried one.' },
  { id: 'gear', name: 'On the settings gear',
    note: 'the mark sits on the circle\u2019s own control, and what is moving lives at the head of circle settings \u2014 the circle\u2019s state kept with the circle\u2019s controls.',
    cost: 'settings is where you go rarely, and for admin. The liveliest thing in the product ends up behind the dullest door, and the gear now means two things.' },
  { id: 'back', name: 'The card comes back',
    note: 'no mark anywhere. A card you are part of returns to Active while the circle is talking on it, and leaves again once you have been in.',
    cost: 'Active means not yet read. Putting read cards back into it overloads the tab and can read as the app undoing your progress.' },
  { id: 'pill', name: 'On the arrival pill',
    note: 'the app\u2019s own New pill \u2014 the thing that already says come and get it \u2014 carries talk as well as links. Tap it and you land on what moved.',
    cost: 'one signal, two meanings. The liveliness grammar was built so a single mark says a single thing; this is the first place that breaks.' },
];

// ---- decorating an existing control ----------------------------------------
// A mark on a control the APP already owns, put there by touching the DOM
// rather than forking the shell — the tab, the gear. The control keeps its own
// handler: the mark says something is there, the control already goes there.
const d8Control = (kind) => {
  const root = document.querySelector('.circ-phone-screen') || document;
  if (kind === 'settings') return root.querySelector('button[aria-label="Settings"]') || root.querySelector('button[aria-label="Circle settings"]');
  if (kind === 'read-tab') return [...root.querySelectorAll('button[aria-current]')].find(b => b.textContent.trim() === 'Read') || null;
  return null;
};
const D8Dot = ({ target }) => {
  React.useEffect(() => {
    const el = d8Control(target);
    if (!el) return;
    const had = el.style.position;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    const s = document.createElement('span');
    s.setAttribute('data-d8-dot', '');
    s.style.cssText = 'position:absolute;top:' + (target === 'read-tab' ? '11px' : '7px') + ';right:' + (target === 'read-tab' ? '2px' : '7px')
      + ';width:8px;height:8px;border-radius:50%;background:var(--color-sage);box-shadow:0 0 0 2px var(--color-surface);pointer-events:none';
    el.appendChild(s);
    return () => { s.remove(); el.style.position = had; };
  });
  return null;
};

// A control placed INTO the app's top bar, ahead of the gear, so the two can be
// seen competing for the same corner rather than described as competing.
const D8InHeader = ({ children }) => {
  const [host, setHost] = React.useState(null);
  React.useEffect(() => {
    const root = document.querySelector('.circ-phone-screen') || document;
    const h = root.querySelector('header');
    if (!h) return;
    const el = document.createElement('span');
    el.style.cssText = 'display:inline-flex;flex-shrink:0;align-items:center';
    const gear = h.querySelector('button[aria-label="Circle settings"]');
    if (gear) h.insertBefore(el, gear); else h.appendChild(el);
    setHost(el);
    return () => { el.remove(); setHost(null); };
  }, []);
  return host ? ReactDOM.createPortal(children, host) : null;
};

// ---- what is moving, as a list --------------------------------------------
const D8MovedList = ({ wanted, st, onOpen, compact = false }) => {
  if (!wanted.length) return (
    <p style={{ margin: '6px 2px', font: '400 14px/1.6 var(--font-sans)', color: 'var(--color-fg-3)', textWrap: 'pretty' }}>
      Nothing is moving. Cards you are part of come here while the circle is speaking on them.
    </p>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {wanted.map(item => {
        const said = window.d8NewSaid(item, st);
        const last = said[said.length - 1];
        return (
          <button key={item.id} type="button" onClick={() => onOpen(item)} className="circ-d8-row"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 4, width: '100%',
              padding: compact ? '11px 10px' : '13px 12px', margin: compact ? '0 -10px' : 0,
              background: 'transparent', border: 0, borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left' }}>
            <span style={{ font: '600 14.5px/1.35 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{window.d8Title(item)}</span>
            {last && (
              <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ font: '600 12.5px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>{last.by}</span>
                <span style={{ font: '400 11px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{window.circWhen(last.at)}</span>
              </span>
            )}
            {last && (
              <span style={{ font: '400 13.5px/1.5 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{last.text}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// ---- the five, as they render ----------------------------------------------
const D8Six = (p) => {
  const { wanted, st, variant, goTo, tab } = p;
  const [open, setOpen] = React.useState(false);
  const live = wanted.length > 0;

  if (variant === 'name') return (
    <React.Fragment>
      {live && (
        <D8InHeader>
          <button type="button" onClick={() => setOpen(true)} className="circ-d8-barmark"
            aria-haspopup="dialog" aria-label="What the circle is still talking on"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, minHeight: 40, padding: '0 10px', marginRight: 2,
              background: 'transparent', border: 0, borderRadius: 'var(--radius-md)', cursor: 'pointer',
              font: '500 13px/1 var(--font-sans)', color: 'var(--color-fg-2)' }}>
            <span aria-hidden="true" style={{ display: 'inline-flex' }}><window.MicroDot size={9} /></span>
            Talking
          </button>
        </D8InHeader>
      )}
      {open && (
        <S6 title="Still talking" onClose={() => setOpen(false)}>
          <D8MovedList wanted={wanted} st={st} compact onOpen={(it) => { setOpen(false); goTo(it); }} />
        </S6>
      )}
    </React.Fragment>
  );

  if (variant === 'tab') return live ? <D8Dot target="read-tab" /> : null;
  if (variant === 'gear') return live ? <D8Dot target="settings" /> : null;
  if (variant === 'back') return null;   // the arrangement is the whole signal
  if (variant === 'pill') return (live && tab === 'active') ? (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <button type="button" className="circ-newpill" onClick={() => goTo(wanted[0])}
        aria-label="Go to what the circle is still talking on">
        <span aria-hidden="true" style={{ display: 'inline-flex' }}><window.MicroDot size={9} /></span>
        Talking
      </button>
    </div>
  ) : null;
  return null;
};

// ---- the state -------------------------------------------------------------
const D8_SIX = {
  id: 'six',
  name: 'Return, on its own',
  stance: 'A plain app with nothing on the card. Five ways the circle tells you from anywhere inside it, swapped in place \u2014 all of them in chrome that already exists.',
  ret: 'pick one below. Each uses a control the app already has; none of them adds a surface the product does not own.',
  cost: 'Nothing on the card means the card cannot answer for itself \u2014 you are always told somewhere else and sent. And a switcher is a rig, not a product: the real one has to pick.',
  variants: D8_SIX_VARIANTS,
  add: ({ urlField, thought, setThought }) => (
    <React.Fragment>
      {urlField}
      <W6 value={thought} onChange={setThought} lines={3} max={240} label="Your thought, if you have one"
        placeholder="Your own words, whole" />
    </React.Fragment>
  ),
  onCard: (item) => <OC6 item={item} size={14} />,
  // A real door, in the card's own action row, carrying no mark of any kind.
  cardActions: ({ item, tab, ctx }) => tab === 'read'
    ? <DR6 item={item} onOpen={ctx.openRecord} label="What the circle said" />
    : null,
  // On the variant where cards come back to Active, a read card keeps its read
  // treatment wherever it is sitting.
  cardTab: ({ item, tab, variant }) => (variant === 'back' && item.read ? 'read' : tab),
  write: ({ text, setText }) => (
    <div style={{ width: '100%', marginTop: 14 }}>
      <W6 value={text} onChange={setText} lines={3} max={240} placeholder="Your own words, whole — or none" />
    </div>
  ),
  // One arrangement function for all five: what the tab shows, and where the
  // waterline falls.
  arrange: ({ items, tab, variant, wanted }) => {
    const ids = wanted.map(i => i.id);
    if (tab === 'read') {
      const list = items.filter(i => i.read);
      if (variant !== 'tab') return { list, divAt: -1 };
      const up = list.filter(i => ids.includes(i.id));
      const rest = list.filter(i => !ids.includes(i.id));
      return { list: [...up, ...rest], divAt: up.length };
    }
    const active = items.filter(i => !i.read);
    if (variant !== 'back') return { list: active, divAt: -1 };
    return { list: [...wanted, ...active], divAt: wanted.length };
  },
  settingsTop: true,
  returnAbove: (p) => <window.D8Six {...p} />,
  record: ({ item, ctx, onClose }) => <D8SixRecord item={item} ctx={ctx} onClose={onClose} />,
};

const D8SixRecord = ({ item, ctx, onClose }) => {
  const [replyTo, setReplyTo] = React.useState(null);
  return (
    <S6 title="What the circle said" onClose={onClose} wide
      foot={<AG6 item={item} ctx={ctx} lines={3} max={240} replyTo={replyTo} onCancelReply={() => setReplyTo(null)}
        placeholder="Your own words, whole" />}>
      <TH6 item={item} />
      <div style={{ borderTop: '1px solid var(--color-border-2)', margin: '14px 0 16px' }} />
      <T6 item={item} showGlyph onReply={(e) => setReplyTo(e)} gap={20} />
      <div style={{ borderTop: '1px solid var(--color-border-2)', marginTop: 18, paddingTop: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ flex: 1, font: '500 13px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>How it landed</span>
          <window.SwellDoor item={item} />
        </div>
        <WA6 item={item} onToggle={ctx.toggleWatch} />
      </div>
    </S6>
  );
};

// The section that sits at the head of circle settings on the gear variant.
const D8SettingsTop = ({ wanted, st, variant, onOpen }) => variant !== 'gear' ? null : (
  <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', padding: '20px 24px 0', width: '100%' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 2px 8px' }}>
      <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.06em', color: 'var(--color-fg-3)' }}>still talking</span>
      <span aria-hidden="true" style={{ flex: 1, height: 1, background: 'var(--color-border-2)' }} />
    </div>
    <D8MovedList wanted={wanted} st={st} onOpen={onOpen} />
  </div>
);

Object.assign(window, { D8_SIX, D8_SIX_VARIANTS, D8Six, D8Dot, D8InHeader, D8MovedList, D8SettingsTop });
