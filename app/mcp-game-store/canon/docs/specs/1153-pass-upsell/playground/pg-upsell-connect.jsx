// ============================================================================
// Playground (pass-upsell-proposal): connecting (G). Re-publishes GsConnect in this page only: canon's How it works
// (app/gs-connect.jsx) with the two connect cards replaced by one-click installs (two designs) and the lead line per variation.
// Other assistants keep the address and their steps; Start playing, Disconnecting and Help stay. Install opens GS_AI_PLUGIN (placeholders).
// ============================================================================
const pguInstall = (k) => window.open(GS_AI_PLUGIN[k][1], '_blank', 'noopener');
const PguOthers = ({ title }) => {
  const [ai, setAi] = React.useState('openclaw');
  return (
    <DS.Card style={{ justifyItems: 'stretch' }}>
      <div className="hw-other">
        <div className="gs-stack-md">
          <h2 className="mcp-t-card">{title}</h2>
          <div className="hw-seg" role="radiogroup" aria-label="Your AI">
            {GS_AI_OTHERS.map(([id, l]) => <DS.Button key={id} role="radio" aria-checked={ai === id} variant={ai === id ? 'main' : 'secondary'} onClick={() => setAi(id)}>{l}</DS.Button>)}
          </div>
        </div>
        <GsOtherSteps id={ai} />
      </div>
    </DS.Card>
  );
};
const PguConnect = () => {
  const v = usePgu(); const [more, setMore] = React.useState(false);
  const t = gsPromptText({ kind: 'games' });
  const keys = Object.keys(GS_AI_PLUGIN);
  return (
    <main className="gs-wrap gs-main">
      <header className="gs-stack-md hw-head">
        <h1 className="gs-h1">How it works</h1>
        <p className="gs-lead pgu-Glead pgu-wrap">{PGU_G_LEAD[v.Glead]}</p>
      </header>
      {v.G === 1 ? <>
        <section className="pgu-install pgu-G">
          {keys.map((k) => <DS.Button key={k} onClick={() => pguInstall(k)}><GsAiLogo ai={k} size={20} />{'Add to ' + GS_AI_PLUGIN[k][0]}</DS.Button>)}
        </section>
        <PguOthers title="Other assistants" />
      </> : <>
        <section className="lb-box pgu-G">
          <ul className="pgu-dirs">{keys.map((k) => (
            <li key={k} className="pgu-dir">
              <span className="hw-ai-logo"><GsAiLogo ai={k} size={24} /></span>
              <span className="gs-stack-xs"><span className="gs-strong">{GS_AI_PLUGIN[k][0]}</span><span className="gs-small">{GS_AI_PLUGIN[k][0] + ' directory'}</span></span>
              <DS.Button variant="secondary" onClick={() => pguInstall(k)}>Install</DS.Button>
            </li>
          ))}</ul>
        </section>
        <div><DS.TextLink aria-expanded={more} onClick={() => setMore((m) => !m)}>{more ? 'Hide other assistants' : 'Other assistants'}</DS.TextLink></div>
        {more && <PguOthers title="Other assistants" />}
      </>}
      <section className="hw-band">
        <div className="gs-stack-sm"><h2 className="mcp-t-sec">Start playing</h2><p className="gs-muted">Paste this into your AI and it lists every game. Pick one and it starts.</p></div>
        <div className="hw-promptrow"><GsPrompt text={t} /><GsCopyPrompt text={t} /></div>
      </section>
      <div className="gs-grid2">
        <section className="gs-stack-sm"><h2 className="mcp-t-card">Disconnecting</h2><p className="gs-muted">Remove [Platform] in your AI’s settings, where you added it. Your results and history stay on [Platform].</p></section>
        <section className="gs-stack-sm"><h2 className="mcp-t-card">Help</h2><p className="gs-muted">If something doesn’t work, write to <a href={'mailto:' + GS_SUPPORT}>{GS_SUPPORT}</a> and say which AI you use.</p></section>
      </div>
    </main>
  );
};
Object.assign(window, { GsConnect: PguConnect });
