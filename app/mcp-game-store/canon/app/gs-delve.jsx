// ============================================================================
// [Platform] — Game page: Delve (screen 4). Wording as the brief gives it.
// ============================================================================
const GsDelve = () => {
  const gs = useGs();
  const paying = gs.view === 'pass';
  return (
    <main className="gs-wrap gs-main">
      {/* A. Breadcrumb */}
      <nav aria-label="Breadcrumb" className="gs-crumb">
        <button type="button" className="gs-inlink" onClick={() => gs.go('games')}>Games</button>
        <span aria-hidden="true">/</span><span>Adventures</span><span aria-hidden="true">/</span>
        <span aria-current="page">Delve</span>
      </nav>

      {/* B. Header: cover beside the play card */}
      <section className="gs-head-split">
        <div className="gs-hero-cover">
          <GsCover art="delve" />
          <div className="gs-cover-over">
            <span className="gs-label">ADVENTURE · ONE SCENE</span>
            <h1 className="gs-cover-title">Delve</h1>
          </div>
        </div>
        <DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
          <span className="gs-label">PART OF THE PASS</span>
          <h2 className="mcp-t-card">A new scene every week</h2>
          <GsSteps items={[
            <><b>Connect your AI</b> in about two minutes. Claude, ChatGPT, Goose and others.</>,
            <><b>Play one full scene</b>, start to ending.</>,
            <><b>Keep your result.</b> It stays in your history.</>,
          ]} />
          {paying
            ? <DS.Button block onClick={() => gs.play('Delve', 'delve')}>Play in your AI</DS.Button>
            : <DS.Button block onClick={() => gs.go('pass')}>Get the Pass</DS.Button>}
          <p className="gs-small">Delve is part of the [Platform] Pass. {GS.purchase}</p>
          {!paying && <div><DS.TextLink onClick={() => gs.go('puzzles')}>Play today’s puzzles free</DS.TextLink></div>}
          <div className="gs-rule" />
          <div className="gs-stack-sm">
            <span className="gs-label">WORKS WITH</span>
            <p className="gs-small">{GS.works}</p>
          </div>
        </DS.Card>
      </section>

      {/* C. Tags */}
      <div className="gs-tags">
        <DS.Tag kind="daily"><span className="gs-dot" aria-hidden="true" />AI-essential: your AI is the Dungeon Master</DS.Tag>
        {['Adventure', '12+ · fantasy peril, no gore', '25–40 min', 'Solo', 'One scene · new warren layout each run'].map((t) => <DS.Tag key={t} kind="daily">{t}</DS.Tag>)}
      </div>

      {/* D. Pitch beside who does what */}
      <section className="gs-pitch">
        <div className="gs-stack-md gs-measure">
          <h2 className="mcp-t-sec">Get her out before the drums stop</h2>
          <p>Goblins have dragged the miller’s daughter into the warren beneath Gallows Hill. When the drums stop, the ritual is complete. You have one scene: sneak, talk, fight or bluff your way through tunnels, fungus galleries and a bone bridge to the ritual chamber, then get back out.</p>
          <p>Every risky move is a d20 roll, made by our server where nobody can fudge it. Two tracks decide the scene: your <b>progress</b> towards the captive, and the <b>threat clock</b> that fills as the warren wakes. Your AI tells the story around the dice.</p>
        </div>
        <DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
          <span className="gs-label">WHO DOES WHAT</span>
          <GsWhoCols
            ai="Narrates the warren, voices the goblins and the captive, and asks what you do next."
            server="Rolls every die, keeps both tracks, decides each outcome and records your session." />
        </DS.Card>
      </section>

      {/* E. How it looks in your chat */}
      <section className="gs-stack-md">
        <h2 className="mcp-t-sec">How it looks in your chat</h2>
        {/* Stand-ins: the Daily Word screenshot in each slot until real Delve ones exist in assets/in-use/ */}
        <div className="gs-chats">
          <GsShot id="dailyWord" caption="The scene opens. The server sets up both tracks." />
          <GsShot id="dailyWord" caption="A weak hit: progress, with a cost the server applies." />
          <GsShot id="dailyWord" caption="The ending, with a link back to your full session." />
        </div>
      </section>

      {/* F. Stat tiles */}
      <section className="gs-grid3">
        <GsStat label="IN A SCENE" figure="6–7 locations" line="Sinkhole to ritual chamber, shuffled each run." />
        <GsStat label="TYPICAL RUN" figure="10–14 rolls" line="Every one listed on your session page afterwards." />
        <GsStat label="ENDINGS" figure="4 ways out" line="Clean rescue, close call, alone, or caught." />
      </section>

      {/* G. If you like Delve */}
      <section className="gs-stack-md">
        <h2 className="mcp-t-sec">If you like Delve</h2>
        <div className="gs-grid2">{GS_SOON.map((g) => <GsSoonCard key={g.name} g={g} />)}</div>
      </section>
    </main>
  );
};

Object.assign(window, { GsDelve });
