// ============================================================================
// LM-626 whiteboard, round two — RESOLVING D.
// D is the direction. Two things are open inside it:
//   1. on desktop the pair sits left-and-right, not stacked — and which side
//      does Leave take?
//   2. the subheading. "Its links, reactions and members are all kept" is out;
//      five replacements, including having none at all.
// Mobile is not in question: stacked, Fund on top. Only the desktop row changes,
// so this is still ONE component with a posture switch, not a fork.
// ============================================================================
const WB2D_ADDR = window.OPERATOR_EMAIL || 'support@circlists.com';

// The D body, parameterised on the two open questions.
//   row      false = mobile stack (Fund over Leave) | true = desktop pair
//   order    'leave-left' | 'fund-left'
//   split    push the pair to the outer edges of the measure instead of centring
//   body     the subheading, or null for none
const WbD2 = ({ row = false, order = 'leave-left', split = false, body = null }) => {
  const fund = <Button variant="primary" size="lg" full={!row}>Fund this circle</Button>;
  const leave = <window.Wb2Leave weight="text" />;
  return (
    <main style={window.wb2.main}>
      <div style={window.wb2.mid}><div style={{ ...window.wb2.col, maxWidth: row ? 420 : 360 }}>
        <window.Wb2Head body={body} />
        {row ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: split ? 0 : 'var(--space-4)', justifyContent: split ? 'space-between' : 'center', width: split ? '100%' : 'auto', marginTop: 'var(--space-8)' }}>
            {order === 'leave-left' ? leave : fund}
            {order === 'leave-left' ? fund : leave}
          </div>
        ) : (
          <React.Fragment>
            <div style={{ width: '100%', marginTop: 'var(--space-8)' }}>{fund}</div>
            <div style={{ marginTop: 4 }}>{leave}</div>
          </React.Fragment>
        )}
        <window.Wb2Rule />
      </div></div>
      <window.Wb2Addr />
    </main>
  );
};

// The subheading itself is the weird part, so read the options as headline +
// subheading, at the real type sizes, with nothing else competing.
const WB2D_COPY = [
  { id: '1', body: null, n: 'None. The caption under the button already carries the only fact that changes behaviour, so a second explanation between the headline and the action may be what feels wrong.' },
  { id: '2', body: 'Nothing in it is lost.', n: 'Present tense, one clause, no inventory. Reassures without listing — but it is a denial, and denials plant the idea they deny.' },
  { id: '3', body: 'Its links and members are still here.', n: 'The original with the list cut from three to two — reactions were the odd item, and a three-item inventory is what made it read like a database receipt.' },
  { id: '4', body: 'Funding it opens it again for everyone.', n: 'Stops reassuring and states the consequence. Verb-led, and it points at the button instead of at the past.' },
  { id: '5', body: 'Nobody can add or read until it is funded.', n: 'The blunt truth of the state. Accurate, and closest to naming a cost — arguably too heavy under a headline that already says asleep.' },
];

const WB2D_ORDERS = [
  { id: 'i', order: 'leave-left', split: false, t: 'Leave left, Fund right, centred', n: 'Reading order ends on the action the screen wants. Matches the platform convention of the affirmative sitting rightmost, and keeps the destructive off the path of a fast click.' },
  { id: 'ii', order: 'fund-left', split: false, t: 'Fund left, Leave right, centred', n: 'Primary first, which is how the product reads its own confirmations. Puts the red under the pointer at the end of the row, which is where the eye rests.' },
  { id: 'iii', order: 'leave-left', split: true, t: 'Pushed to the edges', n: 'Same order, but distance does the ranking as well as colour. The pair stops reading as a pair, which is the point — they are not a choice, they are an action and an exit.' },
];

const Wb2DResolve = ({ Shell, Phone }) => (
  <React.Fragment>
    <section className="wb-sec">
      <div className="wb-sec-h"><span className="wb-badge">D</span>Desktop: the pair, left and right</div>
      <p className="wb-note">Mobile stays stacked, Fund on top &mdash; not in question. Only the desktop row changes, so it is still one component with a posture switch.</p>
      {WB2D_ORDERS.map((o) => (
        <div key={o.id} className="wb-deskwrap">
          <div className="wb-desklabel"><span className="wb-badge">{o.id}</span>{o.t}</div>
          <p className="wb2-wn" style={{ margin: '0 0 8px', maxWidth: '68ch' }}>{o.n}</p>
          <div className="wb-desk" style={{ '--circ-vh': '560px' }}>
            <Shell isMobile={false} Body={WbD2} bodyProps={{ row: true, order: o.order, split: o.split, body: 'Its links and members are still here.' }} />
          </div>
        </div>
      ))}
    </section>

    <section className="wb-sec">
      <div className="wb-sec-h">The subheading</div>
      <p className="wb-note">Headline and subheading at their real sizes, nothing else in the frame. Option 1 is no subheading at all.</p>
      <div className="wb2-copy">
        {WB2D_COPY.map((c) => (
          <div className="wb2-copyrow" key={c.id}>
            <div className="wb2-copystage">
              <div className="wb2-copyh">This circle is asleep.</div>
              {c.body ? <div className="wb2-copyb">{c.body}</div> : <div className="wb2-copynone">no subheading</div>}
            </div>
            <p className="wb2-wn" style={{ margin: 0 }}><span className="wb2-copyn">{c.id}</span>{c.n}</p>
          </div>
        ))}
      </div>
      <p className="wb-note" style={{ margin: '18px 0 0' }}>In place, on the phone, with option 3 &mdash; and with none.</p>
      <div className="wb2-pair" style={{ marginTop: 14 }}>
        <div><div className="wb2-plabel">3 &mdash; links and members</div><Phone Body={WbD2} bodyProps={{ body: 'Its links and members are still here.' }} height={620} /></div>
        <div><div className="wb2-plabel">1 &mdash; none</div><Phone Body={WbD2} bodyProps={{ body: null }} height={620} /></div>
      </div>
    </section>
  </React.Fragment>
);

Object.assign(window, { WbD2, Wb2DResolve });
