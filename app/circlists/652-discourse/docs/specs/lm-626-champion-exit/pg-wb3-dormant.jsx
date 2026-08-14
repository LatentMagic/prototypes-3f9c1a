// ============================================================================
// LM-626 whiteboard, ROUND THREE — the dormant screen's information architecture.
// Round two shipped and broke on mobile. The faults, named:
//
//   1. AN UNBOXED CONTROL IN A BOXED STACK. Leave's 52px target is 18px of empty
//      box above and below its label, so equal gaps LOOK unequal beside a filled
//      button. I compensated with negative margins — which is why hovering Leave
//      (painting that box) makes the spacing wrong. A control whose box appears
//      on hover must OWN its space. No negative margins anywhere in this round.
//   2. A FLOATING CAPTION. "Any member can fund it..." sits under the actions
//      belonging to nothing — the same "floating rule paragraph" the original
//      review rejected, reintroduced. Information below an action group has to
//      be bound to that action or it is litter.
//   3. THE SUBHEADING DOES TWO JOBS. Cause AND reassurance in one sentence, so
//      it can never be short enough to hold one line on a phone. Split the jobs
//      and every line fits: "Its funding ran out." is 20 characters.
//   4. FIXED POSTURE. The layout keyed off a global desktop/mobile attribute, so
//      it only worked at the two widths I looked at. Every direction here is
//      CONTAINER-QUERY driven — it adapts to the width it is given, at 320, at
//      402, in the app frame, at any desktop canvas. No media queries, no
//      posture attribute, no per-posture edit.
// ============================================================================
const D3_ADDR = window.OPERATOR_EMAIL || 'support@circlists.com';
const D3_MAILTO = 'mailto:' + D3_ADDR;

// One copy set, three architectures. Each line does exactly one job, which is
// what lets every one of them hold a single line at 320px.
const D3_COPY = {
  title: 'This circle is asleep.',
  sub: 'Its funding ran out.',
  keep: 'Everything in it is still here.',
  rule: 'Any member can fund it, and whoever does next champions it.',
};

const D3Leave = ({ kind = 'tertiary', full = false }) => (
  kind === 'outline'
    ? <Button variant="ghost" size="lg" full={full} style={{ color: 'var(--color-destructive)', borderColor: 'color-mix(in oklab, var(--color-destructive) 35%, transparent)' }}>Leave this circle</Button>
    : <Button variant="destructive-tertiary" size="lg" full={full}>Leave this circle</Button>
);

// ---- H — One block above, one action, and the exit leaves the stack ---------
// Everything you read is ONE paragraph above the button; below the button there
// is nothing but air. The exit drops to the foot of the canvas on its own row,
// above the address — two quiet things, stacked, never side by side.
const WbD3H = () => (
  <main className="d3">
    <div className="d3-mid"><div className="d3-col">
      <h1 className="d3-title">{D3_COPY.title}</h1>
      <p className="d3-sub">{D3_COPY.sub}</p>
      <p className="d3-sub d3-quiet">{D3_COPY.keep} {D3_COPY.rule}</p>
      <div className="d3-actions d3-actions-one"><Button variant="primary" size="lg" full>Fund this circle</Button></div>
    </div></div>
    <div className="d3-foot">
      <D3Leave />
      <a href={D3_MAILTO} className="circ-textlink d3-addr">{D3_ADDR}</a>
    </div>
  </main>
);

// ---- I — The rule binds to the button; the exit gets a real box -------------
// Two fixes to the same stack. The information below the actions is no longer
// floating: it is the button's own micro-caption, the pattern the funding page
// already owns, so it is bound to what it explains. And Leave gets a container,
// which makes its space honest — equal gaps look equal, and hover paints a box
// that was already there.
const WbD3I = () => (
  <main className="d3">
    <div className="d3-mid"><div className="d3-col">
      <h1 className="d3-title">{D3_COPY.title}</h1>
      <p className="d3-sub">{D3_COPY.sub} {D3_COPY.keep}</p>
      <div className="d3-actions">
        <Button variant="primary" size="lg" full>Fund this circle</Button>
        <D3Leave kind="outline" full />
      </div>
      <p className="d3-cap">{D3_COPY.rule}</p>
    </div></div>
    <div className="d3-foot">
      <a href={D3_MAILTO} className="circ-textlink d3-addr">{D3_ADDR}</a>
    </div>
  </main>
);

// ---- J — The canvas holds the state and the remedy; the exit is chrome ------
// The most structural answer: leaving is not part of this moment. It is a
// circle-level destructive action, so it belongs where circle-level actions
// live — the overflow in the top bar, present on this screen, no settings route
// needed. The canvas becomes one statement and one button, which is the only
// version that cannot go wrong at any width.
const WbD3J = ({ menu = false }) => (
  <main className="d3">
    {menu && (
      <div className="d3-menu">
        <button type="button" className="circ-menuitem d3-menuitem">Circle settings</button>
        <button type="button" className="circ-menuitem d3-menuitem d3-menuitem-danger">Leave this circle</button>
      </div>
    )}
    <div className="d3-mid"><div className="d3-col">
      <h1 className="d3-title">{D3_COPY.title}</h1>
      <p className="d3-sub">{D3_COPY.sub} {D3_COPY.keep}</p>
      <div className="d3-actions d3-actions-one"><Button variant="primary" size="lg" full>Fund this circle</Button></div>
      <p className="d3-cap">{D3_COPY.rule}</p>
    </div></div>
    <div className="d3-foot">
      <a href={D3_MAILTO} className="circ-textlink d3-addr">{D3_ADDR}</a>
    </div>
  </main>
);

Object.assign(window, { WbD3H, WbD3I, WbD3J, D3_COPY });
