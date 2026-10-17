// ============================================================================
// Golden Sample App - connecting an AI app: Connect page (S21, GSA-026) and the
// pictured AI-app replies (S22, GSA-026 / 027 / 015). Styles: gsa-people.css.
// The web build shows no list of connected AI apps and no connection state.
// ============================================================================

const GSA_CONNECT_START = { 'ai-app-a': 'https://ai-app-a.example/add?server=' };

// ---- Connect page (S21) ------------------------------------------------------
function GsaConnectSteps({ app }) {
  const g = useGsa();
  const [copy, setCopy] = React.useState(null);
  const field = React.useRef(null);
  const refuse = () => { setCopy('refused'); if (field.current) { field.current.focus({ preventScroll: true }); field.current.select(); } };
  const copyAddress = () => {
    if (g.review.clipboard === 'refused') { refuse(); return; }
    try {
      Promise.resolve(navigator.clipboard.writeText(GSA_MCP_ADDRESS)).then(() => setCopy('copied'), refuse);
    } catch (err) { refuse(); }
  };
  return (
    <ol className="gsa-people-steps" aria-label={'Steps to add the app in ' + app.name}>
      <li>
        <span>Copy the address of the app.</span>
        <div className="gsa-people-link-row">
          <input ref={field} className="gsa-field-input gsa-people-link-url" readOnly value={GSA_MCP_ADDRESS} aria-label="Address of the app" onFocus={(e) => e.target.select()} />
          <GsaButton kind="secondary" onClick={copyAddress}>Copy address</GsaButton>
        </div>
        {copy === 'copied' ? <GsaStatusLine tone="success">Copied.</GsaStatusLine> : null}
        {copy === 'refused' ? <GsaStatusLine tone="warning">This device would not copy it. The address is selected: copy it by hand.</GsaStatusLine> : null}
      </li>
      <li>In {app.name}, add a new app by its address and paste the address there.</li>
      <li>Approve the connection, then sign in when {app.name} asks.</li>
    </ol>
  );
}

function GsaConnect() {
  const [open, setOpen] = React.useState(null);
  return (
    <main className="gsa-page gsa-people-page">
      <h1 className="gsa-heading">Connect your AI app</h1>
      <p className="gsa-text">Add this app to your AI app once, and sign in there. Your AI app then uses your account and follows the same rules as this website.</p>
      <div className="gsa-people-block">
        <GsaSlot>the AI apps named here, their order and their steps are each app's own content.</GsaSlot>
      </div>
      <div className="gsa-people-apps">
        {window.GSA_AI_APPS.map((app) => (
          <GsaCard key={app.id}>
            <h2 className="gsa-card-title"><GsaPick>{app.name}</GsaPick></h2>
            {app.how === 'link' ? (
              <>
                <p className="gsa-text">Start the connection from here, then sign in when asked.</p>
                <a className="gsa-btn gsa-people-start" data-kind="primary" href={(GSA_CONNECT_START[app.id] || 'https://gsa.example/') + encodeURIComponent(GSA_MCP_ADDRESS)} target="_blank" rel="noopener noreferrer">
                  Connect {app.name}
                </a>
              </>
            ) : (
              <>
                <p className="gsa-text">{app.name} has no link that starts the connection. Add the app by its address.</p>
                <GsaButton kind="secondary" aria-expanded={open === app.id ? 'true' : 'false'} onClick={() => setOpen(open === app.id ? null : app.id)}>
                  {open === app.id ? 'Hide the steps' : 'Show the steps'}
                </GsaButton>
                {open === app.id ? <GsaConnectSteps app={app} /> : null}
              </>
            )}
          </GsaCard>
        ))}
      </div>
    </main>
  );
}

// ---- AI-app replies (S22): a pictured chat, outside the app -------------------
const GSA_REPLIES = [
  { id: 'sign-in-needed', label: 'Not signed in: the AI app starts the sign-in' },
  { id: 'no-account', label: 'Signed in, but no account' },
  { id: 'refused-call', label: 'A refused request, with a reason' },
  { id: 'no-sale', label: 'Needs a Subscription (No-sale reply)' },
  { id: 'signed-in', label: 'Signed in from the AI app' },
  { id: 'not-completed', label: 'Sign-in not completed' },
  { id: 'expired', label: 'Sign-in expired, then signed in again' },
  { id: 'free-answered', label: 'A free request is answered' },
  { id: 'after-subscribing', label: 'After subscribing, no reconnect' },
  { id: 'retry-window', label: 'Payment failed, retry window open' },
  { id: 'deleted', label: 'Account deleted, request refused' },
];

function gsaReplyTurns(id, items) {
  const active = items.filter((i) => i.status === 'active').length;
  const done = items.length - active;
  const list = 'You have ' + active + ' active and ' + done + ' done links.';
  const ask = { from: 'user', text: 'What have I saved?' };
  const paid = { from: 'user', text: 'Slot: a request that needs the paid feature' };
  const goPlans = { label: 'See the plans', to: 'plans' };
  switch (id) {
    case 'no-account':
      return [ask, { from: 'ai', text: 'You are signed in, but this app holds no account for you, so I did nothing. You need an account first.', link: { label: 'Sign in', to: 'sign-in' } }];
    case 'refused-call':
      return [{ from: 'user', text: 'Slot: a request the app refuses' },
        { from: 'ai', text: 'The app refused this request and changed nothing. The reason it gave:', slot: 'the reason each app gives for a refusal.' }];
    case 'no-sale':
      return [paid, { from: 'ai', text: 'That needs a Subscription, so I did nothing.', link: goPlans }];
    case 'signed-in':
      return [{ from: 'user', text: 'Connect to the app.' }, { from: 'ai', text: 'Signed in. I can reach your account.' }, ask, { from: 'ai', text: list }];
    case 'not-completed':
      return [ask, { from: 'ai', text: 'The sign-in was not finished, so I cannot reach your account.' }];
    case 'expired':
      return [ask, { from: 'ai', text: 'Your sign-in has expired. Please sign in again.' }, { from: 'user', text: 'Signed in again.' }, { from: 'ai', text: list }];
    case 'free-answered':
      return [ask, { from: 'ai', text: list }];
    case 'after-subscribing':
      return [paid, { from: 'ai', text: 'That needs a Subscription, so I did nothing.', link: goPlans },
        { from: 'user', text: 'I have subscribed on the website. Try again.' }, { from: 'ai', text: 'Done. You did not need to connect again.' }];
    case 'retry-window':
      return [paid, { from: 'ai', text: 'Done.' }];
    case 'deleted':
      return [ask, { from: 'ai', text: 'The app did not accept this request. The connection no longer works, and nothing was changed.' }];
    case 'sign-in-needed':
    default:
      return [ask, { from: 'ai', text: 'The app did not accept this request because you are not signed in. I will start the sign-in now.' }];
  }
}

function GsaAiApp({ route }) {
  const g = useGsa();
  const current = GSA_REPLIES.some((r) => r.id === (route && route.reply)) ? route.reply : 'sign-in-needed';
  const turns = gsaReplyTurns(current, g.items);
  return (
    <main className="gsa-people-ai">
      <div className="gsa-people-ai-bar">
        <span className="gsa-people-ai-tag">Outside the app</span>
        <GsaButton kind="link" onClick={() => GsaStore.back()}>Back to the app</GsaButton>
      </div>
      <div className="gsa-people-ai-pick">
        <label className="gsa-field-label" htmlFor="gsa-people-reply">Case shown</label>
        <select id="gsa-people-reply" className="gsa-field-input" value={current} onChange={(e) => GsaStore.replace('ai-app', { reply: e.target.value })}>
          {GSA_REPLIES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
      </div>
      <section className="gsa-people-chat" aria-label="A conversation in an AI app">
        <div className="gsa-people-chat-head"><GsaPick>AI app</GsaPick></div>
        <div className="gsa-people-chat-body">
          {turns.map((t, i) => (
            <div key={i} className="gsa-people-turn" data-from={t.from}>
              <p className="gsa-people-bubble">{t.text}</p>
              {t.slot ? <div className="gsa-people-turn-slot"><GsaSlot>{t.slot}</GsaSlot></div> : null}
              {t.link ? <GsaButton kind="link" className="gsa-people-chat-link" onClick={() => GsaStore.go(t.link.to)}>{t.link.label}</GsaButton> : null}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

Object.assign(window, { GsaConnect, GsaAiApp });
