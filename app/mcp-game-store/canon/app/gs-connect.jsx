// ============================================================================
// [Platform] — Connect your AI (screen 3). Checkout lives in gs-billing.jsx.
// ============================================================================
const GS_AIS = [['claude', 'Claude'], ['chatgpt', 'ChatGPT'], ['openclaw', 'OpenClaw'], ['other', 'Other']];
const GS_AI_PASTE = {
  claude: 'In Claude, open Settings, then Connectors, and add a custom connector. Paste the link there.',
  chatgpt: 'In ChatGPT, open Settings, then Connectors, and add a new one. Paste the link there.',
  openclaw: 'In a terminal, run openclaw mcp add and give it the link as the URL.',
  other: 'In your assistant’s settings, find where MCP connectors are added. Paste the link there.',
};

const GsConnect = () => {
  const gs = useGs();
  const [ai, setAi] = React.useState('claude');
  const [copied, setCopied] = React.useState(false);
  const [phase, setPhase] = React.useState(gs.connected ? 'done' : 'steps');
  const name = ai === 'other' ? 'your assistant' : GS_AIS.find((a) => a[0] === ai)[1];
  React.useEffect(() => {
    if (phase !== 'waiting') return undefined;
    const t = setTimeout(() => { setPhase('done'); gs.setConnected(true); }, 3500);
    return () => clearTimeout(t);
  }, [phase]);
  const copy = () => {
    try { navigator.clipboard && navigator.clipboard.writeText(GS.link); } catch (e) {}
    setCopied(true);
    if (phase === 'steps') setPhase('waiting');
  };
  const pick = (id) => { setAi(id); if (phase !== 'done') { setPhase('steps'); setCopied(false); } };
  return (
    <main className="gs-wrap gs-main">
      <section className="gs-pitch">
        <div className="gs-stack-md">
          <h1 className="gs-h1">Connect your AI</h1>
          <p>About two minutes. You do this once.</p>
          <div className="gs-choice" role="radiogroup" aria-label="Your assistant">
            {GS_AIS.map(([id, l]) => (
              <DS.Button key={id} role="radio" aria-checked={ai === id} variant={ai === id ? 'main' : 'secondary'} onClick={() => pick(id)}>{l}</DS.Button>
            ))}
          </div>
        </div>
        <DS.Card style={{ gap: 16, justifyItems: 'stretch' }}>
          <GsSteps items={[
            <div className="gs-stack-sm">
              <span>Copy the shop’s link.</span>
              <div className="gs-copy">
                <input className="mcp-in gs-num-text" readOnly value={GS.link} aria-label="The shop’s link" onFocus={(e) => e.target.select()} />
                <DS.Button variant="secondary" done={copied} doneLabel="Copied" onClick={copy}>Copy</DS.Button>
              </div>
            </div>,
            GS_AI_PASTE[ai],
            'Approve the connection when ' + name + ' asks.',
          ]} />
          {phase === 'waiting' && (
            <div className="gs-waiting" role="status">
              <DS.Loader size={32} label="Waiting" />
              <p>Waiting for {name} to connect.</p>
            </div>
          )}
          {phase === 'done' && (
            <div className="gs-stack-md" style={{ justifyItems: 'start' }}>
              <DS.StatusMessage kind="success">Connected. Tell your AI which game you want to play.</DS.StatusMessage>
              <DS.Button onClick={() => gs.go('games')}>Browse games</DS.Button>
            </div>
          )}
        </DS.Card>
      </section>
    </main>
  );
};

Object.assign(window, { GsConnect });
