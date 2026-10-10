// Playground: the page your AI opens when you press Connect in it (the MCP sign-in step).
// Route 'authorize' is not one of the app's, so it falls to GsNotFound; this file overrides GsNotFound for that
// route only, and GsDemoBar. Nothing in app/ changes. Brief and handoff: docs/specs/authorize-landing/.
const AZ_KEY = 'pg_authorize_v1';
let az = { opt: '1', open: true, ai: 'claude', ...(() => { try { return JSON.parse(localStorage.getItem(AZ_KEY)) || {}; } catch (e) { return {}; } })() };
const azSubs = new Set();
const azSet = (p) => { az = { ...az, ...p }; try { localStorage.setItem(AZ_KEY, JSON.stringify(az)); } catch (e) {} azSubs.forEach((f) => f(az)); };
const useAz = () => { const [s, setS] = React.useState(az); React.useEffect(() => { azSubs.add(setS); return () => azSubs.delete(setS); }, []); return s; };
const AZ_AI = { claude: 'Claude', chatgpt: 'ChatGPT' };
const azGo = (gs, step) => gs.go('authorize', { step });
const azSignedIn = (gs) => { gs.setView('free'); azGo(gs, 'consent'); };
const AZ_CONSENT = <GsConsent lead="By continuing you accept our" />;

// ---- Parts ----
const AzPair = ({ ai }) => (
  <span className="az-pair" aria-hidden="true"><span className="az-ai"><GsAiLogo ai={ai} size={26} /></span><span className="az-link" /><GsMark size={32} /></span>
);
const AzGame = ({ id, copy }) => {
  const g = GS_GAMES[id];
  return (
    <li className="az-game">
      <PhCov gid={id} />
      <div className="gs-stack-xs"><span className="gs-strong">{g.name}</span><span className="gs-muted">{g.blurb}</span></div>
      <div className="az-game-end">{copy ? <AzCopy text={gsPromptText({ kind: 'game', gid: id })} /> : <GsTagList tags={g.tags.slice(0, 1)} />}</div>
    </li>
  );
};
const AzCopy = ({ text }) => {
  const [done, setDone] = React.useState(false);
  React.useEffect(() => { if (!done) return undefined; const t = setTimeout(() => setDone(false), 2400); return () => clearTimeout(t); }, [done]);
  return <DS.Button variant="secondary" done={done} doneLabel="Copied" onClick={() => { lbCopy([text]); setDone(true); }}>Copy prompt</DS.Button>;
};
const AzPassLine = () => <p className="gs-muted">Some games are free in full. The Pass plays every game and every edition.</p>;
// A provider's sheet returns to a spinner, then the connect step.
const useAzReturn = () => { const [ret, setRet] = React.useState(false); return [ret, () => setRet(true)]; };
const AzReturning = () => { const gs = useGs(); return <GsFullLoader label="Completing sign-in" ms={1500} onDone={() => azSignedIn(gs)} />; };
const AzProviderButtons = ({ onReturn }) => {
  const gs = useGs(); const [failed, setFailed] = React.useState(null);
  return <GsProviders failed={failed} onProvider={(p) => gsProviderTrip(gs, p, setFailed, onReturn)} onEmail={() => { setFailed(null); azGo(gs, 'email'); }} />;
};

// ---- Sign in, as its own step (option 1 after Continue, option 3 on arrival) ----
const AzSignIn = ({ sub, onBack }) => {
  const s = useAz(); const [ret, startRet] = useAzReturn();
  if (ret) return <AzReturning />;
  return (
    <GsAuthFrame title={'Connect ' + AZ_AI[s.ai]} subtitle={sub} onBack={onBack} foot={AZ_CONSENT}>
      <AzProviderButtons onReturn={startRet} />
    </GsAuthFrame>
  );
};
const AzEmail = () => {
  const gs = useGs(); const s = useAz();
  const form = useGsForm({ email: '', pw: '' }, GS_SIGNIN_RULES, () => azSignedIn(gs));
  return (
    <GsAuthFrame title={'Connect ' + AZ_AI[s.ai]} onBack={() => azGo(gs, s.opt === '1' ? 'signin' : 'arrive')} foot={AZ_CONSENT}>
      <form noValidate onSubmit={form.submit} className="gs-stack-md">
        <DS.TextField label="Email" type="email" autoComplete="email" placeholder="you@example.com" autoFocus {...form.bind('email')} />
        <DS.TextField label="Password" type="password" autoComplete="current-password" placeholder="••••••••" {...form.bind('pw')} />
        <DS.Button type="submit" block loading={form.busy}>Continue</DS.Button>
      </form>
    </GsAuthFrame>
  );
};

// ---- Option 1: the home page, with the request on top ----
const AzHome = () => {
  const gs = useGs(); const s = useAz(); const n = AZ_AI[s.ai];
  return (
    <>
      <GsTopBar />
      <div className="gs-wrap az-req-wrap">
        <section className="az-req" aria-label={n + ' is asking to connect'}>
          <AzPair ai={s.ai} />
          <div className="gs-stack-xs"><p className="gs-strong">{n + ' is asking to connect to [Platform].'}</p><p className="gs-muted">{'Sign in or create a free account, then go back to ' + n + ' and play.'}</p></div>
          <DS.Button onClick={() => azGo(gs, 'signin')}>Continue</DS.Button>
        </section>
      </div>
      <GsHome />
      <GsFooter />
    </>
  );
};

// ---- Option 2: the request beside the product ----
const AzSplit = () => {
  const s = useAz(); const n = AZ_AI[s.ai]; const [ret, startRet] = useAzReturn();
  if (ret) return <AzReturning />;
  return (
    <div className="az-page">
      <div className="gs-wrap az-bar"><GsStaticBrand /></div>
      <main className="gs-wrap az-split">
        <section className="az-task">
          <AzPair ai={s.ai} />
          <div className="gs-stack-sm"><h1 className="gs-h1">{'Connect ' + n + ' to [Platform]'}</h1><p className="gs-muted">Sign in or create a free account. Free games need no card.</p></div>
          <AzProviderButtons onReturn={startRet} />
          {AZ_CONSENT}
        </section>
        <section className="az-about" aria-labelledby="az-about-h">
          <div className="gs-stack-sm">
            <h2 className="mcp-t-sec" id="az-about-h">Your AI does the talking. The game keeps the score.</h2>
            <p className="gs-muted">{n + ' tells the story and plays every character. [Platform] holds the rules, the dice and your record.'}</p>
          </div>
          <ul className="az-games">{GS_GAME_ORDER.map((k) => <AzGame key={k} id={k} />)}</ul>
          <AzPassLine />
          <p className="gs-small">{GS.purchase}</p>
        </section>
      </main>
    </div>
  );
};

// ---- Every option: what the AI may do, then Connect or Cancel ----
const AzConsent = () => {
  const gs = useGs(); const s = useAz(); const n = AZ_AI[s.ai]; const [busy, run] = useGsBusy();
  const can = ['Start the games you can play, on your account.', 'Save each result to your history, streak and record.'];
  return (
    <GsAuthFrame title={'Connect ' + n} subtitle={<>You’re signed in as <b>{gs.user.username || 'MonaLaser'}</b>.</>}
      foot={<p>Not you? <button type="button" className="gs-inlink" onClick={() => { gs.setView('out'); azGo(gs, 'arrive'); }}>Use another account</button></p>}>
      <div className="gs-stack-sm">
        <p className="gs-strong">{n + ' will be able to:'}</p>
        <ul className="az-can">{can.map((t) => <li key={t}><DS.Icon name="check" size={20} /><span>{t}</span></li>)}</ul>
      </div>
      <p className="gs-muted">{n + ' can’t buy anything or change your Pass.'}</p>
      <div className="gs-stack-sm">
        <DS.Button block loading={busy} onClick={() => run(() => azGo(gs, s.opt === '3' ? 'done' : 'back'))}>{'Connect ' + n}</DS.Button>
        <DS.Button block variant="secondary" disabled={busy} onClick={() => azGo(gs, 'denied')}>Cancel</DS.Button>
      </div>
    </GsAuthFrame>
  );
};
const AzDenied = () => {
  const gs = useGs(); const n = AZ_AI[useAz().ai];
  return (
    <GsAuthFrame title={n + ' isn’t connected'} subtitle="Nothing was shared. Close this tab, or connect now.">
      <DS.Button block onClick={() => azGo(gs, gs.view === 'out' ? 'arrive' : 'consent')}>{'Connect ' + n}</DS.Button>
    </GsAuthFrame>
  );
};

// ---- Option 3: once connected, what you can play ----
const AzDone = () => {
  const gs = useGs(); const s = useAz(); const n = AZ_AI[s.ai];
  return (
    <div className="az-page">
      <div className="gs-wrap az-bar"><GsStaticBrand /></div>
      <main className="gs-wrap gs-main az-done">
        <header className="gs-stack-md">
          <AzPair ai={s.ai} />
          <h1 className="gs-h1">{n + ' is connected'}</h1>
          <p className="gs-lead">{'Go back to ' + n + ' and say what you want to play. Or copy a game’s prompt and paste it in.'}</p>
          <div className="gs-hero-act"><DS.Button onClick={() => azGo(gs, 'back')}>{'Back to ' + n}</DS.Button></div>
        </header>
        <section className="gs-stack-md" aria-labelledby="az-play-h">
          <h2 className="mcp-t-sec" id="az-play-h">What you can play</h2>
          <ul className="az-games">{GS_GAME_ORDER.map((k) => <AzGame key={k} id={k} copy />)}</ul>
          <p className="gs-muted">Some games are free in full. The Pass plays every game and every edition. <button type="button" className="gs-inlink" onClick={() => gs.go('pass')}>About the Pass</button></p>
        </section>
      </main>
    </div>
  );
};

// ---- Stand-in for the AI taking over again (playground chrome, not product) ----
const AzBack = () => {
  const gs = useGs(); const n = AZ_AI[useAz().ai]; const [shown, setShown] = React.useState(false);
  if (!shown) return <GsFullLoader label={'Returning you to ' + n} ms={1200} onDone={() => setShown(true)} />;
  return (
    <main className="gs-full">
      <div className="az-stand">
        <span className="gs-label">PLAYGROUND</span>
        <p>{'Here the browser hands you back to ' + n + ', connected. [Platform] shows nothing more.'}</p>
        <DS.Button variant="secondary" onClick={() => { gs.setView('out'); azGo(gs, 'arrive'); }}>Start again</DS.Button>
      </div>
    </main>
  );
};

// ---- Routing inside 'authorize' ----
const AZ_BASE = { GsNotFound: window.GsNotFound };
const AzRoute = () => {
  const gs = useGs(); const s = useAz();
  if (gs.route.name !== 'authorize') return <AZ_BASE.GsNotFound />;
  const st = gs.route.step || 'arrive'; const out = gs.view === 'out';
  if (st === 'email') return out ? <AzEmail /> : <AzConsent />;
  if (st === 'denied') return <AzDenied />;
  if (st === 'back') return <AzBack />;
  if (st === 'done') return s.opt === '3' ? <AzDone /> : <AzBack />;
  if (!out) return <AzConsent />;
  if (st === 'signin') return <AzSignIn sub={'Sign in or create a free account to connect ' + AZ_AI[s.ai] + '.'} onBack={() => azGo(gs, 'arrive')} />;
  if (s.opt === '1') return <AzHome />;
  if (s.opt === '2') return <AzSplit />;
  return <AzSignIn sub={'Play games by talking to ' + AZ_AI[s.ai] + '. [Platform] keeps the rules and the score.'} />;
};

// ---- Strip ----
const AZ_OPTS = [
  { id: '1', name: 'The home page, with the request on top',
    idea: 'You land on the home page as it is, with the AI’s request across the top. A stranger reads what [Platform] is the usual way. Continue opens sign-in, then the connect step, then the AI again.',
    cost: 'The request competes with the hero’s Start free and the top bar’s Sign in, which go the usual way and drop the request. The page was written to sell, not to finish a task.',
    signed: 'Signed in, you land straight on the connect step.' },
  { id: '2', name: 'The request beside the product',
    idea: 'One page in two halves: sign-in on one side, what [Platform] is and what you can play on the other. On a phone sign-in comes first and the product follows below it.',
    cost: 'Two jobs on one page, so the sign-in half has to stay the clear first move. The game list grows with the library and will need a cap.',
    signed: 'Signed in, you land straight on the connect step.' },
  { id: '3', name: 'Connect first, the product after',
    idea: 'The sign-in page with one product line. Once connected, a page says what you can play, each game with its prompt, before you go back.',
    cost: 'A stranger makes an account knowing one line. The extra page means pressing Back to the AI instead of being sent back on its own.',
    signed: 'Signed in, you land on the connect step; Connect then opens the page of games.' },
];
let azBooted = false;
const AzStrip = () => {
  const gs = useGs(); const s = useAz(); const o = AZ_OPTS.find((x) => x.id === s.opt) || AZ_OPTS[0];
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { if (!azBooted) { azBooted = true; gs.setView('out'); setTimeout(() => azGo(window.gsApi, 'arrive'), 0); } }, []);
  const out = gs.view === 'out';
  const st = gs.route.name === 'authorize' ? (gs.route.step || 'arrive') : null;
  const here = !st ? null : (st === 'done' || st === 'back') ? 'd' : (st === 'consent' || !out) ? 'c' : 'a';
  const to = (k) => {
    if (k === 'a') { gs.setView('out'); azGo(gs, 'arrive'); }
    else if (k === 'c') { gs.setView('free'); azGo(gs, 'consent'); }
    else { gs.setView('free'); azGo(gs, s.opt === '3' ? 'done' : 'back'); }
  };
  const seg = (opts, cur, fn) => opts.map(([v, l], i) => (
    <React.Fragment key={v}>{i > 0 && <span aria-hidden="true">/</span>}<button type="button" className="gs-demo-opt" aria-pressed={cur === v} onClick={() => fn(v)}>{l}</button></React.Fragment>
  ));
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {s.open ? (
        <div className="pg-strip-in">
          <div className="pg-strip-row">
            <span className="pg-k">Option</span>
            {AZ_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={o.id === x.id} title={x.name} onClick={() => { azSet({ opt: x.id }); gs.setView('out'); azGo(gs, 'arrive'); }}>{x.id}</button>)}
            <span className="pg-name">{o.name}</span>
            <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
            <button type="button" className="gs-demo-opt" onClick={() => azSet({ open: false })}>Hide</button>
          </div>
          <div className="pg-strip-row"><span className="pg-k">Go</span>{seg([['a', '1 Arrive'], ['c', '2 Connect'], ['d', '3 Connected']], here, to)}</div>
          <div className="pg-strip-row">
            <span className="pg-k">Who</span>
            {seg(Object.keys(AZ_AI).map((k) => [k, AZ_AI[k]]), s.ai, (v) => azSet({ ai: v }))}
            <span aria-hidden="true" className="gs-demo-sep" />
            {seg([['out', 'signed out'], ['in', 'signed in']], out ? 'out' : 'in', (v) => { gs.setView(v === 'out' ? 'out' : 'free'); azGo(gs, 'arrive'); })}
          </div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => azSet({ open: true })}>{'Show · ' + o.id + ' ' + o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} title={o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>Cost.</b> {o.cost}</p>
          <p><b>Signed in.</b> {o.signed}</p>
        </div>
      </DS.Popup>
    </div>
  );
};

Object.assign(window, { GsNotFound: AzRoute, GsDemoBar: AzStrip });
