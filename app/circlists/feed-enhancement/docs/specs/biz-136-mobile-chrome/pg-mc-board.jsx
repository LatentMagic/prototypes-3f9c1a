// ============================================================================
// BIZ-136 whiteboard — the board frame.
// Four directions, each drawn twice (home beside inside-a-circle) at three
// widths: 320 (the floor the product promises to hold), 402 (the phone), and
// the desktop canvas. A direction that only works at one of them is a
// screenshot, not a direction. Laid out down the page, static: no switcher, no
// config, no levers, no phone bezel.
// ============================================================================
const MC_PHONE_H = 720;
const MC_DESK_H = 620;

// A bare screen at an exact width. Two layers, and the reason is GOTCHA.md #5:
// the outer box carries the transform (so a position:fixed FAB inside pins to
// the screen and not to the page) and does not scroll; the inner layer is the
// scroller, which is where a sticky bottom bar resolves against.
const MCScreen = ({ w, h = MC_PHONE_H, Dir, place, label }) => (
  <div className="mc-frame">
    <div className="mc-framelabel">{label}</div>
    <div className="mc-screen" style={{ width: w, height: h, '--circ-vh': h + 'px' }}>
      <div className="mc-scroll"><Dir place={place} /></div>
    </div>
  </div>
);

const MCDeskScreen = ({ place, label }) => (
  <div className="mc-frame mc-frame-wide">
    <div className="mc-framelabel">{label}</div>
    <div className="mc-screen mc-screen-desk" style={{ height: MC_DESK_H, '--circ-vh': MC_DESK_H + 'px' }}>
      <div className="mc-scroll"><MCDesk place={place} /></div>
    </div>
  </div>
);

const MC_DIRS = [
  {
    id: '0',
    name: 'Docked — the bar is the circle',
    Dir: window.MCDir0,
    swapped: 'Nothing. This is today’s chrome, mounting the real app/app-shell.jsx.',
    stance: 'The bar never appears outside a circle, so the bar IS the circle scope and no slot has to prove whose it is. Home is the root and account hangs off the avatar, because you are already at account level. Add is the centre-docked puck, the one action the screen is for.',
    cost: 'Home is now a real surface with conversations on it, and it has nothing in the thumb zone at all — the member’s hand has to travel to the top of the screen for every single thing home offers. The chrome also changes shape at the boundary, so the foot of the screen is furniture in one place and empty in the other.',
  },
  {
    id: '1',
    name: 'The bar mirrors the level',
    Dir: window.MCDir1,
    swapped: 'The bar’s presence and its third slot. The bar now renders on home too, and every slot answers to the level you are standing on.',
    stance: 'A bar at both levels, three slots at both, and never a mixed set: slot three is the level’s own settings — Account on home, the circle’s gear inside a circle — and the puck adds the thing the level is made of, a circle on home and a link in a circle. Scope is told by the bar only ever describing one level at a time. Account leaves the avatar, so the top bar carries no control the bar does not account for.',
    cost: 'The gear and the avatar occupy the same pixel and do different jobs, so a habit learned inside a circle opens the wrong destination from home. And one glyph carries two nouns: the puck that adds a link also creates a circle, which is the more expensive mis-tap of the two.',
  },
  {
    id: '2',
    name: 'One permanent bar, the action floats',
    Dir: window.MCDir2,
    swapped: 'Add — out of the bar and into a floating FAB — and the bar itself, which becomes account-scoped and permanent. Circle settings moves to the top bar.',
    stance: 'The TickTick shape translated rather than copied. One bar, identical everywhere, carrying only the places the member can stand; it never says anything about a circle, so the scope question never arises inside it. Circle scope lives entirely above the bar — the gear at the top, Add floating at the bottom right — and is simply absent on home, where there is no circle to act on.',
    cost: 'Circlists has two account-level destinations, so a permanent bar is two slots of furniture across the full width of the screen, present on every screen, pressed rarely. It also takes the thumb zone the FAB wants, pushing Add higher up the screen than it sits on the web — the FAB is raised to clear a bar that is mostly empty space.',
  },
  {
    id: '3',
    name: 'No bar — the scopes go to opposite edges',
    Dir: window.MCDir3,
    swapped: 'The bar, removed entirely. Home and circle settings go to the top bar; Add becomes the floating FAB the web app already has.',
    stance: 'Nothing persistent at the foot of either screen. Navigation and settings sit at the top, where scope is unambiguous because the top bar already names where you are — the wordmark on home, the circle’s name inside one. The single action the member repeats floats exactly where the web app floats it, which is the whole of what the phone needs in the thumb zone. The bottom of the screen is content.',
    cost: 'Reach. Getting home and opening circle settings both become top-bar taps, the two hardest targets on a 402px phone, and they are the two things pressed most after Add. The app also loses its one piece of persistent orientation: with no bar, nothing on screen tells the member the app has a level above this one until they look at the top-left.',
  },
];

const MCSection = ({ d }) => (
  <section className="mc-sec">
    <div className="mc-sec-h"><span className="mc-badge">{d.id}</span>{d.name}</div>
    <div className="mc-caps">
      <p className="mc-stance"><span>Stance</span>{d.stance}</p>
      <p className="mc-cost"><span>Cost</span>{d.cost}</p>
    </div>
    <p className="mc-swapped"><span>Swapped</span>{d.swapped}</p>

    <div className="mc-widthband">
      <div className="mc-widthlabel">320 — the floor</div>
      <div className="mc-row">
        <MCScreen w={320} Dir={d.Dir} place="home" label="Home" />
        <MCScreen w={320} Dir={d.Dir} place="circle" label="Inside a circle" />
      </div>
    </div>

    <div className="mc-widthband">
      <div className="mc-widthlabel">402 — the phone</div>
      <div className="mc-row">
        <MCScreen w={402} Dir={d.Dir} place="home" label="Home" />
        <MCScreen w={402} Dir={d.Dir} place="circle" label="Inside a circle" />
      </div>
    </div>

    <div className="mc-widthband">
      <div className="mc-widthlabel">The desktop canvas</div>
      <p className="mc-note">
        The web posture, mounted as it ships. It does not change with the direction — it is the read
        each one is measured against, and it is the reason the FAB is back on the table: directions 2
        and 3 put Add where this screen already puts it, and directions 0 and 1 do not.
      </p>
      <div className="mc-deskstack">
        <MCDeskScreen place="home" label="Home" />
        <MCDeskScreen place="circle" label="Inside a circle" />
      </div>
    </div>
  </section>
);

const MCBoard = () => (
  <div className="mc-page">
    <header className="mc-head">
      <div className="mc-eyebrow">BIZ-136 · whiteboard · the phone&rsquo;s chrome</div>
      <h1 className="mc-title">Where the member reaches, now that home is a real surface</h1>
      <p className="mc-lede">
        July settled the phone&rsquo;s chrome as IA direction 08: a three-slot bar rendered only inside a
        circle, Add docked into it as a puck. Two things have moved. Home stopped being chrome — it now
        carries a cross-circle returns strip that exists nowhere else, which is exactly the condition
        MOBILE.md named for the flip. And the floating FAB is wanted back on the table, because it reads
        closer to the web app. The scope rule is not repealed, it is softened: a bar may carry both
        scopes where the treatment makes it unmistakable which is which.
      </p>
      <div className="mc-cols">
        <div className="mc-inv">
          <div className="mc-inv-t">What every direction keeps</div>
          <ul className="mc-inv-l">
            <li>The feed&rsquo;s own control row does not move — search and the lens door stay where <code>main.jsx</code> composes them, on the tab bar&rsquo;s right.</li>
            <li>Circle settings is reachable from inside the circle in all four, and live in all four. Which control opens it is what varies.</li>
            <li>Home&rsquo;s content is <code>app/home.jsx</code> as it stands — the returns strip open, the circles list beneath, no counts anywhere.</li>
            <li>One component per surface. Only the chrome differs; nothing inside it is redrawn or forked.</li>
          </ul>
        </div>
        <div className="mc-inv">
          <div className="mc-inv-t">What the four are actually arguing about</div>
          <ul className="mc-inv-l">
            <li><strong>Does a persistent bar earn the foot of the screen?</strong> 0 says only inside a circle, 1 says at both levels, 2 says always and identically, 3 says never.</li>
            <li><strong>Where does Add live?</strong> Docked in the bar (0, 1) or floating free of it (2, 3).</li>
            <li><strong>How is scope told?</strong> By the bar being absent above a circle (0) · by the bar describing the level (1) · by the bar never mentioning a circle at all (2, 3).</li>
            <li><strong>Where does Account sit?</strong> On the avatar (0, 3) or in the bar (1, 2) — a control is live or it is absent, so the two cannot both hold it.</li>
          </ul>
        </div>
      </div>
      <p className="mc-note mc-note-top">
        Everything here is the real app with real seed data: three circles, one with links waiting and
        conversation returned, one caught up, one asleep. The tabs, the lens door and the search field
        are the shipped components and still work — tap Read on any in-circle screen and the search
        trigger appears, exactly where the app puts it today.
      </p>
    </header>

    {MC_DIRS.map((d) => <MCSection d={d} key={d.id} />)}

    <section className="mc-ref">
      <div className="mc-refmark">For context, not an option</div>
      <div className="mc-sec-h mc-sec-h-ref">TickTick — a persistent bar with a FAB floating above it</div>
      <div className="mc-refwrap">
        <MCTickTick />
        <p className="mc-note mc-note-ref">
          The pattern that prompted the question. Five global destinations in a bar that never changes,
          and a create action floating clear of it — so the bar is only ever navigation and the FAB is
          only ever the action. It works there because the bar has five things worth reaching for.
          Circlists has two, which is the whole of what direction 2 has to survive. Drawn from memory,
          not mounted: this is another product&rsquo;s chrome and there is nothing of ours in it.
        </p>
      </div>
    </section>
  </div>
);

ReactDOM.createRoot(document.getElementById('board')).render(<MCBoard />);
