// ============================================================================
// LM-626 whiteboard, ROUND TWO — board frame.
// Same rig as round one: each candidate mounts inside the REAL AppShell so the
// comparison includes the chrome that already names the circle. No config, no
// levers. Round one's A is kept at the end as the reference point, because the
// review said it reads fine on mobile — the argument is about the two actions.
// ============================================================================
const { seedSpaces: wb2Seed, DEFAULT_USER: WB2_USER } = window.CircSeed;
const wb2Noop = () => {};

const wb2Base = wb2Seed(WB2_USER.email).filter((s) => !/^TEST\b/i.test(s.name));
const wb2Dormant = {
  ...(wb2Base.find((s) => s.id === 'sp-book') || wb2Base[0]),
  id: 'sp-weekend', name: 'Weekend Reads', funded: false, dormancy: 'terminal',
  champion: null, championEmail: null, unseen: false,
};
const wb2Spaces = [wb2Base[0], wb2Dormant, wb2Base[1]].filter(Boolean);

const Wb2Shell = ({ isMobile, Body, bodyProps }) => (
  <AppShell isMobile={isMobile} user={WB2_USER} spaces={wb2Spaces}
    currentId={wb2Dormant.id} space={wb2Dormant} showMembers={false}
    onSelectSpace={wb2Noop} onCreateSpace={wb2Noop} onMembers={wb2Noop}
    onManageAccount={wb2Noop} onSignOut={wb2Noop}>
    <Body space={wb2Dormant} {...(bodyProps || {})} />
  </AppShell>
);
const Wb2Phone = ({ Body, bodyProps, height = 660 }) => (
  <div className="circ-phone" style={{ height }}>
    <div className="circ-phone-clip"><div className="circ-phone-screen">
      <Wb2Shell isMobile Body={Body} bodyProps={bodyProps} />
    </div></div>
  </div>
);

const WB2_VERSIONS = [
  {
    id: 'D', name: 'Two actions, stacked, ranked by colour',
    Body: window.WbDormantD,
    pitch: 'The idea that was missing: Fund and Leave are BOTH buttons, so no row mixes a control with a link and no two fonts sit together pretending to be the same thing. Rank comes from fill — green filled, red unfilled — not from kind. The verbs differ, so nothing says "this circle" twice. The rule stays as the pair\u2019s caption; the address is alone at the bottom edge.',
    cost: 'A red word directly under the green button is the first thing the eye finds after the CTA. On a screen whose job is recovery, the exit is now permanently visible.',
    suspended: 'Suspended: the Fund button drops out, the sentence carries the reason, Leave stays exactly where it is, and the address stays at the foot.',
  },
  {
    id: 'E', name: 'Two actions, side by side, true peers',
    Body: window.WbDormantE,
    pitch: 'The same pair given equal footprint — one row, both 52px, one filled and one outlined in the same red. This is the literal reading of "two almost equally appropriate buttons", and it is here so you can see whether that is true. Short verbs on both sides ("Fund it" / "Leave") keep the row from repeating itself.',
    cost: 'Equal footprint reads as equal expectation: the screen stops arguing for the circle. A red outline is also a container this product does not currently own — closer to a new component than D is.',
    suspended: 'Suspended: the row collapses to Leave alone, which then looks like the point of the screen — the weakest degradation of the four.',
  },
  {
    id: 'F', name: 'One action; the exit is a sentence, alone',
    Body: window.WbDormantF,
    pitch: 'Keeps the inline prose the review liked and removes what it disliked: the exit sentence shares its row with NOTHING, and the address lives far below it in its own kind, mono, unaccompanied. Fund is the only button on the screen. The red is in the words, so leaving still reads destructive without becoming furniture.',
    cost: 'Quietest of the four, and the one that most depends on someone reading. The hairline is a device this screen does not otherwise use.',
    suspended: 'Suspended: hero says the state and the reason, the button and its caption drop out, the exit sentence and the address are unchanged.',
  },
  {
    id: 'G', name: 'Two actions, and the confirmation happens in place',
    Body: window.WbDormantG,
    pitch: 'D\u2019s layout, answering the confirmation question with a design instead of an argument. Leaving is destructive enough to need a second touch and too small to need a dialog: pressing Leave arms it where it stands, the cost is stated in one line, and the commit is the house destructive button. Stay is the escape, one tap away. No modal, no new layer, and the screen never leaves.',
    cost: 'The armed state changes the screen under you, which a dialog does not; and the primary dims rather than disappearing, so there is a moment with two competing greens... one live, one not.',
    suspended: 'Suspended: nothing to arm — the exit behaves as in D.',
  },
];

const WB2_WEIGHTS = [
  { w: 'text', t: 'Red text', n: 'Destructive by colour, no container. Reads as an action, not as a peer of the primary.' },
  { w: 'outline', t: 'Red outline', n: 'A true peer. Equal footprint, equal insistence.' },
  { w: 'filled', t: 'Filled destructive', n: 'The house danger button. Almost certainly too much for a resting state.' },
  { w: 'quiet', t: 'Grey text', n: 'Round one\u2019s treatment. Correct weight, wrong meaning: leaving is destructive and this does not say so.' },
];

const WB2_WORDS = [
  { h: 'This circle is asleep.', n: 'Shipped today. Kind, and it implies waking rather than repairing. UI says asleep, code says dormant.' },
  { h: 'This circle is dormant.', n: 'Matches the code and the CHANGELOG. Colder, more accurate about the fact that money is what wakes it.' },
  { h: 'This circle has stopped.', n: 'No metaphor at all. Blunter than the product\u2019s voice usually is, and slightly alarming.' },
];

const Wb2Board = () => (
  <div className="wb-page">
    <header className="wb-head">
      <div className="wb-eyebrow">LM-626 · whiteboard · round two</div>
      <h1 className="wb-title">The dormant circle — ranking the two actions</h1>
      <p className="wb-lede">Round one asked how to organise the screen. The review answered most of that and left one real question behind: <strong>how much weight does Leave get next to Fund?</strong> <strong>D is the answer, in its Di arrangement</strong> — Leave left, Fund right. The top section carries the corrections: Leave as a real tertiary button opening the shipped leave dialog, the mobile stack, and copy that finally says WHY the circle is asleep. Everything below it is the record of how we got here. Nothing here uses a card, and nothing puts a button next to a mailto.</p>
      <div className="wb2-cols">
        <div className="wb-inv">
          <div className="wb-inv-t">Settled in round one — held here</div>
          <ul className="wb-inv-l wb2-stack">
            <li>no card or panel — the wizard already removed those</li>
            <li>no eyebrow, and no circle name in the heading</li>
            <li>never a Leave button beside a mailto link</li>
            <li>Leave is destructive, so it is red</li>
            <li>the address is support@circlists.com, mono, its own thing</li>
            <li>a shorter subtitle: desktop was carrying too much</li>
          </ul>
        </div>
        <div className="wb-inv">
          <div className="wb-inv-t">Open after the D call — react to these first</div>
          <ul className="wb-inv-l wb2-stack">
            <li>which side Leave takes on the desktop row</li>
            <li>the subheading, or no subheading at all</li>
            <li>does Leave need a dialog, or is G enough?</li>
            <li>which red weight — the strip isolates it</li>
            <li>asleep, dormant, or neither</li>
          </ul>
        </div>
      </div>
    </header>

    <window.Wb2DiSection Shell={Wb2Shell} Phone={Wb2Phone} />

    <div className="wb2-divider">How we got to Di — the earlier boards</div>

    <window.Wb2DResolve Shell={Wb2Shell} Phone={Wb2Phone} />

    {WB2_VERSIONS.map((v) => (
      <section className="wb-sec" key={v.id}>
        <div className="wb-sec-h"><span className="wb-badge">{v.id}</span>{v.name}</div>
        <div className="wb-row">
          <div className="wb-cap">
            <p className="wb-pitch">{v.pitch}</p>
            <p className="wb-cost"><span>Cost</span>{v.cost}</p>
            <p className="wb-susp">{v.suspended}</p>
          </div>
          {v.id === 'G'
            ? (<div className="wb2-pair">
                <div><div className="wb2-plabel">Resting</div><Wb2Phone Body={v.Body} bodyProps={{ armed: false }} height={620} /></div>
                <div><div className="wb2-plabel">Armed</div><Wb2Phone Body={v.Body} bodyProps={{ armed: true }} height={620} /></div>
              </div>)
            : <Wb2Phone Body={v.Body} />}
        </div>
      </section>
    ))}

    <section className="wb-sec">
      <div className="wb-sec-h">How much red — the weight, on its own</div>
      <p className="wb-note">D&rsquo;s action zone, four ways. The layout question and the weight question are independent: pick a skeleton above, then pick a weight here.</p>
      <div className="wb2-weights">
        {WB2_WEIGHTS.map((k) => (
          <div className="wb2-weight" key={k.w}>
            <div className="wb2-wt">{k.t}</div>
            <div className="wb2-wstage">
              <div style={{ width: '100%', maxWidth: 240 }}><Button variant="primary" size="lg" full>Fund this circle</Button></div>
              <div style={{ marginTop: 4 }}><window.Wb2Leave weight={k.w} /></div>
              <p className="wb2-wcap">Any member can fund it. Whoever funds it next champions it.</p>
            </div>
            <p className="wb2-wn">{k.n}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="wb-sec">
      <div className="wb-sec-h">The word for the state</div>
      <p className="wb-note">Unresolved from round one, and cheap to settle here. The heading is the only place the word appears.</p>
      <div className="wb2-words">
        {WB2_WORDS.map((w) => (
          <div className="wb2-word" key={w.h}>
            <div className="wb2-wordh">{w.h}</div>
            <p className="wb2-wn">{w.n}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="wb-sec">
      <div className="wb-sec-h">The desktop read</div>
      <p className="wb-note">The frozen web posture, same four bodies, no per-posture edit. This is where round one&rsquo;s subtitle was doing too much work — it is shorter in all four.</p>
      {WB2_VERSIONS.map((v) => (
        <div key={v.id} className="wb-deskwrap">
          <div className="wb-desklabel"><span className="wb-badge">{v.id}</span>{v.name}</div>
          <div className="wb-desk" style={{ '--circ-vh': '560px' }}>
            <Wb2Shell isMobile={false} Body={v.Body} bodyProps={v.id === 'G' ? { armed: true } : null} />
          </div>
        </div>
      ))}
    </section>

    <section className="wb-sec">
      <div className="wb-sec-h">Round one, A — the reference</div>
      <p className="wb-note">Kept for comparison only: the review said it reads fine on mobile. Its footer is the pairing that has been banned since — a button and a mailto in one row.</p>
      <div className="wb-row">
        <div className="wb-cap"><p className="wb-pitch">Unchanged from round one.</p></div>
        <Wb2Phone Body={window.WbDormantA} />
      </div>
    </section>
  </div>
);

ReactDOM.createRoot(document.getElementById('board')).render(<Wb2Board />);
