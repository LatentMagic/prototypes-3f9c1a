// ============================================================================
// Whiteboard 1 — the way-through mark. Six readings of what lies through the
// mark, each drawn in the REAL feed card's meta row (app/feed.jsx FeedCard,
// mounted; window.SwellDoor is re-published here so the card draws the option's
// mark in the slot the door occupies), at rest and inverted.
// Inverted = a card you are watching carries something you have not seen. The
// watching fold (cand-lm652-parts.jsx CandFold) is drawn on the inverted card,
// because that is the only state where both marks are on the card at once.
// ============================================================================
const { WB_ITEM, WB_USER, WbOption, WbSection, WbStrip, CandFold } = window;

// Inverted = unseen words: STATUS, not an active state — so it fills in ink, never accent.
const wbAccent = 'var(--color-fg-2)';
const wbInk = 'currentColor';

// 1 · The disc — the Swell's own shape with what was said held inside it.
const WbMarkDisc = ({ on, size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" style={{ display: 'block' }}>
    <circle cx="12" cy="12" r="8.6" fill={on ? wbAccent : 'none'} stroke={on ? wbAccent : wbInk} />
    {[8.2, 12, 15.8].map((cx) => <circle key={cx} cx={cx} cy="12" r="1.05" fill={on ? 'var(--color-surface)' : 'currentColor'} stroke="none" />)}
  </svg>
);

// 2 · The doorway — a way in, with no claim about what is inside.
const WbMarkDoor = ({ on, size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M6 20V10.5a6 6 0 0 1 12 0V20" fill={on ? wbAccent : 'none'} stroke={on ? wbAccent : wbInk} />
    <line x1="3.6" y1="20" x2="20.4" y2="20" />
  </svg>
);

// 3 · The turned page — more of this card, on the other side of it.
const WbMarkPage = ({ on, size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true" style={{ display: 'block' }}>
    <path d="M5.5 3.8h8.2l4.8 4.8V20.2H5.5Z" fill={on ? wbAccent : 'none'} stroke={on ? wbAccent : wbInk} />
    <path d="M13.7 3.8v4.8h4.8" stroke={on ? 'var(--color-surface)' : wbInk} />
  </svg>
);

// 4 · The stack — there is more of this card behind this one.
const WbMarkStack = ({ on, size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" style={{ display: 'block' }}>
    <rect x="7.4" y="3.6" width="13" height="9.4" rx="2.4" fill={on ? wbAccent : 'none'} stroke={on ? wbAccent : wbInk} />
    <rect x="3.6" y="10.4" width="13" height="9.4" rx="2.4" fill="var(--color-surface)" />
    <rect x="3.6" y="10.4" width="13" height="9.4" rx="2.4" />
  </svg>
);

// 5 · Carry on through — direction, and nothing else. No container at all.
const WbMarkThrough = ({ on, size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: 'block' }}>
    {on
      ? <path d="M9.6 4.8 18 12l-8.4 7.2Z" fill={wbAccent} stroke={wbAccent} />
      : <path d="M9.6 5.6 16.4 12l-6.8 6.4" />}
  </svg>
);

// 6 · The gathering — the people who came to it, and what they left.
const WbMarkGathering = ({ on, size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" style={{ display: 'block' }}>
    {[[12, 6.6], [6.9, 15.4], [17.1, 15.4]].map(([cx, cy]) => (
      <circle key={cx} cx={cx} cy={cy} r="3.3" fill={on ? wbAccent : 'none'} stroke={on ? wbAccent : wbInk} />
    ))}
  </svg>
);

const WB_MARKS = [
  { n: 1, name: 'The disc', Mark: WbMarkDisc, claim: 'how it landed, with what was said inside it' },
  { n: 2, name: 'The doorway', Mark: WbMarkDoor, claim: 'a way in to somewhere else' },
  { n: 3, name: 'The turned page', Mark: WbMarkPage, claim: 'the other side of this card' },
  { n: 4, name: 'The stack', Mark: WbMarkStack, claim: 'more of this card, held behind it' },
  { n: 5, name: 'Carry on through', Mark: WbMarkThrough, claim: 'onward, into the card' },
  { n: 6, name: 'The gathering', Mark: WbMarkGathering, claim: 'the people who came to it' },
];

const WB_MARK_NOTES = [
  { n: 1, name: 'The disc', stance: 'The Swell\u2019s own ring with the turns held inside it — the record and the talk in one shape. Today\u2019s built mark.', cost: 'reads as the reaction record first; the Swell vocabulary has to be known.' },
  { n: 2, name: 'The doorway', stance: 'An opening. Says a place lies through here and promises nothing about its contents.', cost: 'promises nothing, so it also says nothing; the arch is the least familiar glyph of the six.' },
  { n: 3, name: 'The turned page', stance: 'The card has another side, and this turns it. Rhymes with the fold already in the language.', cost: 'the fold already means watching — one metaphor doing two jobs on the same card.' },
  { n: 4, name: 'The stack', stance: 'Depth: this card is more than one sheet, and the rest is behind it.', cost: 'says quantity, not company — nothing in it suggests other people.' },
  { n: 5, name: 'Carry on through', stance: 'Pure direction, no container, the quietest thing on the card.', cost: 'reads as navigation anywhere; its inverted state has the least to work with.' },
  { n: 6, name: 'The gathering', stance: 'The circle around the item — who read it, who spoke, who is watching.', cost: 'people without words: it does not say a conversation is in there.' },
];

// The option's mark, in the slot the shipped door occupies. Pressing it turns
// the state over, so the pair is legible without two cards to compare.
const WbMarkCtx = React.createContext(null);
const WbMarkDoorSlot = () => {
  const c = React.useContext(WbMarkCtx);
  if (!c) return null;
  const { Mark, on, toggle } = c;
  return (
    <button type="button" className="circ-cardaction circ-cardaction-icon" onClick={toggle}
      aria-label={on ? 'Open this card\u2019s conversation \u2014 it has words you have not seen' : 'Open this card\u2019s conversation'}
      title={on ? 'Unseen words' : 'Conversation'} aria-pressed={on}>
      <Mark on={on} size={18} />
    </button>
  );
};
window.SwellDoor = WbMarkDoorSlot;

const WbMarkCard = ({ Mark, seed }) => {
  const [on, setOn] = React.useState(seed);
  return (
    <WbMarkCtx.Provider value={{ Mark, on, toggle: () => setOn(v => !v) }}>
      <div style={{ position: 'relative' }}>
        {on && <CandFold />}
        <FeedCard item={WB_ITEM} tab="read" user={WB_USER} onOpen={() => {}} onMarkRead={() => {}} onDelete={() => {}} />
      </div>
    </WbMarkCtx.Provider>
  );
};

const WbBoardMark = () => (
  <React.Fragment>
    <WbStrip n={1} title="The way-through mark" notes={WB_MARK_NOTES}
      question="Every feed card carries one small mark in its meta row that leads through to the card's own surface — the conversation, the roster of who has read it, and who is watching. It has to read as there is more of this card through here without promising only talk, and it has to invert to say some of it is new to you."
      hint="Left card at rest, right card inverted. Press either mark to turn its state over. The turned corner on the inverted card is the watching signal, already in the language." />
    <WbSection>
      {WB_MARKS.map(({ n, name, Mark, claim }) => (
        <WbOption key={n} n={n} name={name} cols
          aside={<span className="wb-opt-aside"><span className="wb-spec">{React.createElement(Mark, { on: false, size: 22 })}</span><span className="wb-spec">{React.createElement(Mark, { on: true, size: 22 })}</span><span className="wb-claim">{claim}</span></span>}>
          <div className="wb-cardcol"><WbMarkCard Mark={Mark} seed={false} /></div>
          <div className="wb-cardcol"><WbMarkCard Mark={Mark} seed /></div>
        </WbOption>
      ))}
    </WbSection>
  </React.Fragment>
);

Object.assign(window, { WbBoardMark });
