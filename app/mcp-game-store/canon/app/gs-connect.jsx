// ============================================================================
// [Platform] — Connect your AI (screen 3), and the payment provider's checkout
// (a stand-in for the third party, reached from "Get the Pass").
// ============================================================================
const GS_AIS = [['claude', 'Claude'], ['chatgpt', 'ChatGPT'], ['goose', 'Goose'], ['other', 'Other']];
const GS_AI_PASTE = {
  claude: 'In Claude, open Settings, then Connectors, and add a custom connector. Paste the link there.',
  chatgpt: 'In ChatGPT, open Settings, then Connectors, and add a new one. Paste the link there.',
  goose: 'In Goose, open Extensions and add a remote extension. Paste the link there.',
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
              <DS.StatusMessage kind="success">Connected. Tell your AI you want to play today’s puzzles.</DS.StatusMessage>
              <DS.Button onClick={() => gs.go('games')}>Browse games</DS.Button>
            </div>
          )}
        </DS.Card>
      </section>
    </main>
  );
};

// ---- Payment provider (stand-in) -------------------------------------------------
// The third party's own page: you have left [Platform] while you are on it. It
// carries the provider's frame, not the shop's top bar, and returns to the Pass
// screen either way.
const GsCheckout = () => {
  const gs = useGs();
  const [phase, setPhase] = React.useState('leaving'); // leaving | form | paying
  const [declined, setDeclined] = React.useState(false);
  const [f, setF] = React.useState({ card: '', exp: '', cvc: '' });
  const [tried, setTried] = React.useState(false);
  const refs = React.useRef({});
  React.useEffect(() => { const t = setTimeout(() => setPhase('form'), 1100); return () => clearTimeout(t); }, []);
  const rules = [
    ['card', (v) => v.replace(/\D/g, '').length === 16, 'Enter the 16-digit card number.'],
    ['exp', (v) => /^\d{2}\/\d{2}$/.test(v), 'Enter the expiry as MM/YY.'],
    ['cvc', (v) => /^\d{3,4}$/.test(v), 'Enter the 3 or 4 digits on the back.'],
  ];
  const errs = tried ? gsCheck(rules, f) : {};
  const fmt = {
    card: (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim(),
    exp: (v) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; },
    cvc: (v) => v.replace(/\D/g, '').slice(0, 4),
  };
  const bind = (k) => ({ value: f[k], error: errs[k], inputRef: (el) => { refs.current[k] = el; }, onChange: (e) => setF((s) => ({ ...s, [k]: fmt[k](e.target.value) })) });
  const pay = (e) => {
    e.preventDefault(); setTried(true);
    const bad = rules.map((r) => r[0]).find((k) => gsCheck(rules, f)[k]);
    if (bad) { setTimeout(() => refs.current[bad] && refs.current[bad].focus(), 0); return; }
    setDeclined(false); setPhase('paying');
    setTimeout(() => { if (gs.review.payFail) { setDeclined(true); setPhase('form'); } else gs.paid(); }, 1400);
  };
  if (phase === 'leaving') return (
    <div className="gs-wait" role="status">
      <DS.Loader size={64} label="Opening secure payment" />
      <p className="gs-muted">Opening secure payment</p>
    </div>
  );
  return (
    <div className="gs-auth">
      <header className="gs-top"><div className="gs-wrap gs-top-in">
        <span className="gs-ico-row gs-strong"><DS.Icon name="lock" />Secure payment · [Platform]</span>
        <span className="gs-small">Payment provider (stand-in)</span>
      </div></header>
      <main className="gs-auth-col">
        <DS.Card style={{ gap: 24, justifyItems: 'stretch', padding: 24 }}>
          <div className="gs-stack-xs">
            <span className="gs-muted">[Platform] Pass</span>
            <span className="gs-figure gs-num-text">£—</span>
          </div>
          <form noValidate onSubmit={pay} className="gs-stack-md">
            <DS.TextField label="Email" value={GS.email} readOnly />
            <DS.TextField label="Card number" inputMode="numeric" placeholder="1234 1234 1234 1234" autoComplete="cc-number" className="gs-num-text" {...bind('card')} />
            <div className="gs-name-pair">
              <DS.TextField label="Expiry" inputMode="numeric" placeholder="MM/YY" autoComplete="cc-exp" {...bind('exp')} />
              <DS.TextField label="CVC" inputMode="numeric" placeholder="123" autoComplete="cc-csc" {...bind('cvc')} />
            </div>
            {declined && <DS.StatusMessage kind="error">Your card was declined and nothing has been charged.</DS.StatusMessage>}
            <DS.Button type="submit" block loading={phase === 'paying'} loadingLabel="Processing">{declined ? 'Try again' : 'Pay and get the Pass'}</DS.Button>
          </form>
          <div className="gs-center"><DS.TextLink onClick={() => gs.go('pass')}>Cancel and return to [Platform]</DS.TextLink></div>
        </DS.Card>
      </main>
    </div>
  );
};

Object.assign(window, { GsConnect, GsCheckout });
