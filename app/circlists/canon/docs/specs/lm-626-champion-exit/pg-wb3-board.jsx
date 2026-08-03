// ============================================================================
// LM-626 whiteboard, round three — board frame.
// Every direction is shown at THREE widths: 320 (the floor the product promises
// to hold), 402 (the phone frame), and the desktop canvas. If a direction only
// works at one of them it is not a direction, it is a screenshot.
// ============================================================================
const { seedSpaces: d3Seed, DEFAULT_USER: D3_USER } = window.CircSeed;
const d3Noop = () => {};
const d3Base = d3Seed(D3_USER.email).filter((s) => !/^TEST\b/i.test(s.name));
const d3Space = {
  ...(d3Base.find((s) => s.id === 'sp-book') || d3Base[0]),
  id: 'sp-weekend', name: 'Weekend Reads', funded: false, dormancy: 'terminal',
  champion: null, championEmail: null, unseen: false,
};
const d3Spaces = [d3Base[0], d3Space, d3Base[1]].filter(Boolean);

const D3Shell = ({ isMobile, Body, bodyProps }) => (
  <AppShell isMobile={isMobile} user={D3_USER} spaces={d3Spaces}
    currentId={d3Space.id} space={d3Space} showMembers={false}
    onSelectSpace={d3Noop} onCreateSpace={d3Noop} onMembers={d3Noop}
    onManageAccount={d3Noop} onSignOut={d3Noop}>
    <Body space={d3Space} {...(bodyProps || {})} />
  </AppShell>
);

// A bare screen at an exact width — no bezel, because the question is the
// layout at that width, not the device.
const D3Screen = ({ w, h = 600, Body, bodyProps, label }) => (
  <div className="d3-frame">
    <div className="d3-framelabel">{label || (w + 'px')}</div>
    <div className="d3-screen" style={{ width: w, height: h, '--circ-vh': h + 'px' }}>
      <D3Shell isMobile Body={Body} bodyProps={bodyProps} />
    </div>
  </div>
);

const D3_DIRS = [
  {
    id: 'H', name: 'One block above, one action, the exit leaves the stack',
    Body: window.WbD3H,
    fixes: 'Nothing sits below the button, so there is no floating caption and nothing to space against an unboxed control. Leave drops to the foot of the canvas on its own row, above the address \u2014 stacked, never side by side.',
    cost: 'Three lines of prose in a row above the button is a lot to read before you reach the action, and the exit is far from the thing it acts on.',
  },
  {
    id: 'I', name: 'The rule binds to the button; the exit gets a real box',
    Body: window.WbD3I,
    fixes: 'The information below the actions stops floating \u2014 it becomes the button\u2019s micro-caption, the pattern the funding page already owns. And Leave gets a container, so its space is honest: equal gaps look equal, and hover paints a box that was already there.',
    cost: 'A bordered exit is a peer of the primary, which overstates how often anyone should leave \u2014 the exact thing we rejected in round two.',
  },
  {
    id: 'J', name: 'The canvas is state and remedy; the exit is chrome',
    Body: window.WbD3J,
    fixes: 'Leaving is a circle-level destructive action, so it lives where circle-level actions live: the top-bar overflow, present on this screen, no settings route needed. The canvas becomes one statement and one button \u2014 the only version that cannot go wrong at any width, because there is nothing to rank.',
    cost: 'Discoverability. Someone stuck in a circle they want out of has to open a menu to find the exit, and this screen is exactly where they are most likely to want it.',
  },
];

const D3Board = () => (
  <div className="wb-page">
    <header className="wb-head">
      <div className="wb-eyebrow">LM-626 · whiteboard · round three</div>
      <h1 className="wb-title">The dormant screen — what is actually wrong with it</h1>
      <p className="wb-lede">Round two shipped and broke on a phone. Not a tweak away: four faults, three of them structural. Each direction below is one architecture, shown at 320, 402 and desktop — nothing keys off a posture attribute, and there are no negative margins anywhere.</p>
      <div className="wb2-cols">
        <div className="wb-inv">
          <div className="wb-inv-t">The faults</div>
          <ul className="wb-inv-l wb2-stack">
            <li className="d3-bullet"><strong>Unboxed control in a boxed stack.</strong> Leave&rsquo;s 52px target is 18px of empty box above and below the label, so equal gaps look unequal — and hovering paints the box, which is why the spacing goes wrong on hover. I papered over it with negative margins. That was the mistake.</li>
            <li className="d3-bullet"><strong>A floating caption.</strong> The rule sits under the actions belonging to nothing — the same floating paragraph the first review rejected, reintroduced by me.</li>
            <li className="d3-bullet"><strong>The subheading does two jobs.</strong> Cause and reassurance in one sentence can never hold one line on a phone. Split them and it fits: &ldquo;Its funding ran out.&rdquo; is 20 characters.</li>
            <li className="d3-bullet"><strong>Fixed posture.</strong> The layout keyed off a global desktop/mobile flag, so it worked at the two widths I looked at and nowhere else.</li>
          </ul>
        </div>
        <div className="wb-inv">
          <div className="wb-inv-t">What all three do differently</div>
          <ul className="wb-inv-l wb2-stack">
            <li>container queries, not postures — the screen adapts to the width it is handed</li>
            <li>type scales with the container (<code>cqi</code> units), so 320 is a real layout and not a squeeze</li>
            <li>every line does one job, so every line fits</li>
            <li>no negative margins; every box owns its space</li>
            <li>the rule is bound to something, or it is gone</li>
          </ul>
        </div>
      </div>
    </header>

    {D3_DIRS.map((d) => (
      <section className="wb-sec" key={d.id}>
        <div className="wb-sec-h"><span className="wb-badge">{d.id}</span>{d.name}</div>
        <div className="d3-caps">
          <p className="wb-pitch">{d.fixes}</p>
          <p className="wb-cost"><span>Cost</span>{d.cost}</p>
        </div>
        <div className="d3-row">
          <D3Screen w={320} Body={d.Body} bodyProps={d.id === 'J' ? { menu: true } : null} label="320 — the floor" />
          <D3Screen w={402} Body={d.Body} label="402 — the phone" />
        </div>
        <div className="wb-deskwrap" style={{ marginTop: 22 }}>
          <div className="wb-desklabel">The desktop canvas</div>
          <div className="wb-desk" style={{ '--circ-vh': '520px' }}>
            <D3Shell isMobile={false} Body={d.Body} bodyProps={d.id === 'J' ? { menu: true } : null} />
          </div>
        </div>
      </section>
    ))}

    <section className="wb-sec">
      <div className="wb-sec-h">The copy, split by job</div>
      <p className="wb-note">One set across all three. The split is what makes 320px work: no line is asked to carry two facts.</p>
      <div className="d3-copytable">
        <div><span>Headline</span>This circle is asleep.</div>
        <div><span>Cause</span>Its funding ran out.</div>
        <div><span>Reassurance</span>Everything in it is still here.</div>
        <div><span>The rule</span>Any member can fund it, and whoever does next champions it.</div>
      </div>
    </section>
  </div>
);

ReactDOM.createRoot(document.getElementById('board')).render(<D3Board />);
