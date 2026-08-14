// ============================================================================
// LM-626 whiteboard — board frame.
// Three candidate dormant screens, each mounted inside the REAL AppShell (rail,
// top bar, canvas) so the comparison includes the chrome that already names the
// circle. Mobile read is framed in the app's own phone frame; the desktop read
// is unframed, at the frozen web posture's own geometry.
// No config, no levers: this rig asks one question — how should this screen be
// organised — and the answer is a reaction, not a setting.
// ============================================================================
const { seedSpaces, DEFAULT_USER } = window.CircSeed;
const wbNoop = () => {};

// A plain, inhabited rail with one dormant circle selected. Named nothing
// remarkable: the dormant screen must name nobody, so neither does the fixture.
const wbSeed = seedSpaces(DEFAULT_USER.email).filter((s) => !/^TEST\b/i.test(s.name));
const wbDormant = {
  ...(wbSeed.find((s) => s.id === 'sp-book') || wbSeed[0]),
  id: 'sp-weekend', name: 'Weekend Reads', funded: false, dormancy: 'terminal',
  champion: null, championEmail: null, unseen: false,
};
const wbSpaces = [wbSeed[0], wbDormant, wbSeed[1]].filter(Boolean);

const WbShell = ({ isMobile, Body }) => (
  <AppShell isMobile={isMobile} user={DEFAULT_USER} spaces={wbSpaces}
    currentId={wbDormant.id} space={wbDormant} showMembers={false}
    onSelectSpace={wbNoop} onCreateSpace={wbNoop} onMembers={wbNoop}
    onManageAccount={wbNoop} onSignOut={wbNoop}>
    <Body space={wbDormant} />
  </AppShell>
);

const WB_VERSIONS = [
  {
    id: 'A', name: 'One sentence, one action',
    Body: window.WbDormantA,
    pitch: 'Four blocks instead of seven. The eyebrow goes because the sentence says the state; the big circle name goes because the top bar already says it; the succession rule folds into the body sentence. The two secondary doors leave the centred column and sit as a quiet footer, so hierarchy comes from distance, not from more structure.',
    cost: 'Succession is stated in a clause rather than in its own line, so it carries less weight. The footer row is a construction this screen does not use today.',
    suspended: 'Suspended: same skeleton, no button — the sentence carries the state and the reason, and the footer keeps the contact address.',
  },
  {
    id: 'B', name: 'The state as an object',
    Body: window.WbDormantB,
    pitch: 'The screen stops being an empty hero and becomes one thing you can act on, borrowing the funding card\u2019s shipped grammar exactly: name, a textual marker, one line beneath, then the action. Because the object is named, no heading repeats the top bar, and the rule sits inside the card as the button\u2019s caption.',
    cost: 'Reads administrative — a settings component carrying a whole-screen moment. A card on a wide canvas can feel smaller than the event deserves.',
    suspended: 'Suspended: the same card with the marker reading Suspended, one line saying why funding is absent, and Get in touch in the action slot.',
  },
  {
    id: 'C', name: 'Ranked, each thing bound to what it serves',
    Body: window.WbDormantC,
    pitch: 'A real hero, but nothing floats. The rule becomes the button\u2019s own caption — the funding page\u2019s existing action-plus-micro-caption pattern — and the two secondary doors collapse into ONE grey sentence with the links inside it, the product\u2019s existing door construction. Three affordances of three kinds become one button and one sentence.',
    cost: 'Leave and contact are text inside a sentence, so both are quieter and less discoverable. The hairline is a device this screen does not otherwise use.',
    suspended: 'Suspended: the hero says the state and the reason, the button and its caption drop out, and Get in touch is promoted out of the door sentence.',
  },
];

const WbBoard = () => (
  <div className="wb-page">
    <header className="wb-head">
      <div className="wb-eyebrow">LM-626 · whiteboard</div>
      <h1 className="wb-title">The dormant circle — three ways to organise it</h1>
      <p className="wb-lede">Every piece of content on this screen is correct. The organisation is not: today it stacks an eyebrow, a heading that repeats the top bar, a two-sentence body, three affordances of three different kinds, and a floating rule paragraph, all centred with the same rhythm. Each direction below keeps the whole inventory and ranks it differently.</p>
      <div className="wb-inv">
        <div className="wb-inv-t">What every version must still carry</div>
        <ul className="wb-inv-l">
          <li>the state — asleep, and recoverable</li>
          <li>what is preserved: links, reactions, members</li>
          <li>Fund, open to any member</li>
          <li>the rule: whoever funds next champions it</li>
          <li>a plain contact route</li>
          <li>Leave</li>
          <li>and no name, anywhere</li>
        </ul>
      </div>
    </header>

    {WB_VERSIONS.map((v) => (
      <section className="wb-sec" key={v.id}>
        <div className="wb-sec-h"><span className="wb-badge">{v.id}</span>{v.name}</div>
        <div className="wb-row">
          <div className="wb-cap">
            <p className="wb-pitch">{v.pitch}</p>
            <p className="wb-cost"><span>Cost</span>{v.cost}</p>
            <p className="wb-susp">{v.suspended}</p>
          </div>
          <div className="circ-phone" style={{ height: 680 }}>
            <div className="circ-phone-clip"><div className="circ-phone-screen">
              <WbShell isMobile Body={v.Body} />
            </div></div>
          </div>
        </div>
      </section>
    ))}

    <section className="wb-sec">
      <div className="wb-sec-h">The desktop read</div>
      <p className="wb-note">The frozen web posture, with the rail and the wide top bar. Same three bodies, no other change — whatever we pick has to hold at both widths without a per-posture edit.</p>
      {WB_VERSIONS.map((v) => (
        <div key={v.id} className="wb-deskwrap">
          <div className="wb-desklabel"><span className="wb-badge">{v.id}</span>{v.name}</div>
          <div className="wb-desk" style={{ '--circ-vh': '560px' }}>
            <WbShell isMobile={false} Body={v.Body} />
          </div>
        </div>
      ))}
    </section>
  </div>
);

ReactDOM.createRoot(document.getElementById('board')).render(<WbBoard />);
