// ============================================================================
// Whiteboard 4 — what the surface is called. Eight candidate names, each drawn
// in place: the real eyebrow at the head of a real thread, so the words are read
// where they will be read. Static. Only the words change — same position, same
// mono treatment, same scale, and the watching control still at the row's end.
// ============================================================================
const { WB_TURNS, WbOption, WbSection, WbStrip, WbTurn, WbGroup, WbThreadHead } = window;

const WB_NAMES = [
  { n: 1, name: 'the conversation', claim: 'what is here is talk (today\u2019s name, and the baseline)', base: true },
  { n: 2, name: 'this card', claim: 'the object: everything on this page belongs to the item' },
  { n: 3, name: 'where it landed', claim: 'the circle\u2019s response to it, in the Swell\u2019s own words' },
  { n: 4, name: 'the room', claim: 'a place, with the people who are in it' },
  { n: 5, name: 'around this', claim: 'whatever gathered around the item after it was shared' },
  { n: 6, name: 'what happened here', claim: 'the record: read, reacted, said, watched' },
  { n: 7, name: 'the record', claim: 'the account of it, kept for anyone who comes late' },
  { n: 8, name: 'since it arrived', claim: 'time: everything that has come since the link was added' },
];

const WB_NAME_NOTES = WB_NAMES.map(({ n, name, claim, base }) => ({
  n, name: '\u201C' + name + '\u201D',
  stance: 'Claims the surface is ' + claim + '.',
  cost: base
    ? 'names one third of what is here \u2014 the family is treated as spent.'
    : n === 2 ? 'says nothing about people, and repeats a word the feed already owns.'
    : n === 3 ? 'leans on reactions, so the talk becomes the secondary thing.'
    : n === 4 ? 'the softest of the eight; a room is not a word this app has used before.'
    : n === 5 ? 'vague on purpose \u2014 covers everything by naming nothing.'
    : n === 6 ? 'four words, and the past tense closes off what is still going on.'
    : n === 7 ? 'accurate and cold; it makes a conversation sound like an audit.'
    : 'puts the emphasis on when rather than what, so a quiet card reads as empty.',
}));

const WbNameThread = ({ name }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <WbThreadHead name={name} />
    <WbTurn t={WB_TURNS[0]}>
      <WbGroup><WbTurn t={WB_TURNS[2]} reply /></WbGroup>
    </WbTurn>
    <WbTurn t={WB_TURNS[1]} />
  </div>
);

const WbBoardName = () => (
  <React.Fragment>
    <WbStrip n={4} title="What the surface is called" notes={WB_NAME_NOTES}
      question="Open a card and you land on its own surface. At the head of the thread sits an eyebrow reading the conversation — never decided, simply what got built. The surface holds the conversation, the roster of who has read the item, and who is watching it, so a name that says only conversation undersells it."
      hint="Eight names in the same place, same treatment. Read the eyebrow, not the list." />
    <WbSection>
      {WB_NAMES.map(({ n, name, claim, base }) => (
        <WbOption key={n} n={n} name={'\u201C' + name + '\u201D'}
          aside={<span className="wb-opt-aside"><span className="wb-claim">{base ? 'baseline · ' : ''}{claim}</span></span>}>
          <div className="wb-surface" style={{ maxWidth: 620 }}><WbNameThread name={name} /></div>
        </WbOption>
      ))}
    </WbSection>
  </React.Fragment>
);

Object.assign(window, { WbBoardName });
