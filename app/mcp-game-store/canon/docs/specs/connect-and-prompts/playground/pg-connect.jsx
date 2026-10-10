// Playground: connecting, and the prompts a player copies, options 1 to 5, 2026-10-09.
// Brief: docs/specs/connect-and-prompts/ (handoff). Wraps the app; app/ changes only in one label hook (gs-parts.jsx, GS_AI_ROW).
// Replaces: GsConnect (route 'connect' becomes How it works), GsPlayPopup (every play control), GsPlayBox and GsWeekCard
// (the product page's play controls only), EdLineDialog and edLine (an edition's prompt), GsTopBar (wrapped: How it works and
// gs.play are re-pointed before the bar renders), GsDemoBar (the strip).
const PC_KEY = 'pg_connect_v1';
let pc = { opt: '1', open: true, game: 'delve', ...(() => { try { return JSON.parse(localStorage.getItem(PC_KEY)) || {}; } catch (e) { return {}; } })(), req: null, flash: 0 };
const pcSubs = new Set();
const pcSet = (p) => { pc = { ...pc, ...p }; try { const { req, flash, ...keep } = pc; localStorage.setItem(PC_KEY, JSON.stringify(keep)); } catch (e) {} pcSubs.forEach((f) => f(pc)); };
const usePc = () => { const [s, setS] = React.useState(pc); React.useEffect(() => { pcSubs.add(setS); return () => pcSubs.delete(setS); }, []); return s; };

window.GS_AI_ROW = 'How it works';
// The app's Editions page module is gone (History is the one list); its link helper is kept here so the rig's links still go somewhere.
const edGo = window.edGo || ((gs, id) => gs.go(GS_GAMES[id].route, { page: 'editions' }));
const PC_HOW = 'platform.example/how';
const PC_LOGO = {
  claude: 'm4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z',
  chatgpt: 'M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z',
};
// Placeholder destinations: the store's plugin page in each AI is not known yet.
const PC_PLUGIN = { claude: ['Claude', 'https://claude.ai/settings/connectors'], chatgpt: ['ChatGPT', 'https://chatgpt.com/'] };
const PcLogo = ({ ai, size = 20 }) => <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" focusable="false"><path d={PC_LOGO[ai]} /></svg>;

// ---- The three prompts (drafts). Option 3 adds a line so an AI that isn't connected says so. ----
const pcTail = () => (pc.opt === '3' ? ' If you can’t find the tool, tell me to connect [Platform] first at ' + PC_HOW + '.' : '');
const pcEdName = (e) => GS_GAMES[e.gid].name + ' #' + e.n + (e.title ? ', “' + e.title + '”' : '');
const pcText = (r) => r.kind === 'games' ? 'Load the [Platform] games tool and show me the games it lists, with a line about each.' + pcTail()
  : 'Load the [Platform] games tool and start ' + (r.kind === 'edition' ? pcEdName(r.e) : GS_GAMES[r.gid].name) + '. Run it exactly as the tool says.' + pcTail();
const pcTitle = (r) => r.kind === 'games' ? 'Every game' : r.kind === 'edition' ? pcEdName(r.e) : GS_GAMES[r.gid].name;
const pcGid = (name) => GS_GAME_ORDER.find((k) => GS_GAMES[k].name === name);
// The edition a session belongs to, for Play again.
const pcSessEd = (gs, sid) => {
  const s = GS_SESSIONS[sid]; const gid = s && s.gid; if (!gid || !ED_GAMES.includes(gid)) return null;
  const list = edList(gs, gid);
  if (window.PZ && PZ[gid]) { const x = PZ[gid].all.find((y) => y.sid === sid); if (x) return list.find((e) => e.key === x.id) || list[0]; }
  return sid === 'delve-first' ? list[list.length - 1] : list[0];
};
const pcStart = (req) => { if (pc.opt === '3') lbCopy([pcText(req)]); pcSet({ req, flash: pc.flash + 1 }); };

// ---- Small parts ----
const PcPrompt = ({ text, quiet }) => <div className={'lb-share-text pc-prompt' + (quiet ? ' is-quiet' : '')}>{text}</div>;
const PcCopy = ({ text, label, block, variant }) => {
  const [done, setDone] = React.useState(false);
  React.useEffect(() => { if (!done) return undefined; const t = setTimeout(() => setDone(false), 2400); return () => clearTimeout(t); }, [done]);
  return <DS.Button variant={variant || 'main'} block={block} done={done} doneLabel="Copied" onClick={() => { lbCopy([text]); setDone(true); }}>{label || 'Copy prompt'}</DS.Button>;
};
const PcHowLink = ({ label, after }) => { const gs = useGs(); return <button type="button" className="gs-inlink" onClick={() => { pcSet({ req: null }); after && after(); gs.go('connect'); }}>{label || 'How it works'}</button>; };
const PcAccount = () => { const gs = useGs(); return gs.view === 'out' ? <p className="gs-small">You also need a [Platform] account. <button type="button" className="gs-inlink" onClick={() => { pcSet({ req: null }); gs.go('signup'); }}>Start free</button></p> : null; };
const PcNeed = () => <p className="pc-need"><b>Connect your AI first.</b> Nothing plays until it’s connected and signed in. <PcHowLink /></p>;
const PcPlugins = ({ stack }) => (
  <div className={'pc-plugins' + (stack ? ' is-stack' : '')}>
    {Object.keys(PC_PLUGIN).map((k) => <DS.Button key={k} variant="secondary" onClick={() => window.open(PC_PLUGIN[k][1], '_blank', 'noopener')}><span className="pc-btn-in"><PcLogo ai={k} />{'Connect ' + PC_PLUGIN[k][0]}</span></DS.Button>)}
  </div>
);
const PcAddress = () => {
  const [done, setDone] = React.useState(false);
  return (
    <div className="gs-copy">
      <input className="mcp-in gs-num-text" readOnly value={GS.link} aria-label="The [Platform] address" onFocus={(e) => e.target.select()} />
      <DS.Button variant="secondary" done={done} doneLabel="Copied" onClick={() => { lbCopy([GS.link]); setDone(true); setTimeout(() => setDone(false), 2400); }}>Copy</DS.Button>
    </div>
  );
};
// Other AIs. OpenClaw's steps are unverified placeholders.
const PC_OTHERS = [
  ['openclaw', 'OpenClaw', ['In a terminal, run openclaw mcp add and give it the address as the URL.', 'Approve the connection, then sign in to [Platform] when OpenClaw asks.']],
  ['gemini', 'Gemini', ['In Gemini, open Settings, then Custom apps, and add an app. Paste the address there.', 'Approve the connection, then sign in to [Platform] when Gemini asks.']],
  ['other', 'Other', ['In your AI’s settings, find where it adds MCP connectors or custom apps. Paste the address there.', 'Approve the connection, then sign in to [Platform] when it asks.']],
];
const PcOtherSteps = ({ id }) => { const o = PC_OTHERS.find((x) => x[0] === id); return <GsSteps items={[<div className="gs-stack-sm"><span>Copy the [Platform] address.</span><PcAddress /></div>, ...o[2]]} />; };

// ---- What a play control opens, per option ----
// 1: a dialog with the line about connecting, the prompt and Copy.
const PcSurface1 = ({ r, close }) => (
  <DS.Popup open={!!r.open} onClose={close} title={'Start ' + pcTitle(r)} actions={<PcCopy text={pcText(r)} />}>
    <div className="gs-stack-md"><PcNeed /><PcPrompt text={pcText(r)} /><PcAccount /></div>
  </DS.Popup>
);
// 2: a panel with two steps every time: connect, then paste.
const PcSurface2 = ({ r, close }) => {
  const gs = useGs();
  return (
    <DS.Popup open={!!r.open} onClose={close} kind="panel" title={'Play ' + pcTitle(r)}>
      <ol className="pc-two">
        <li><span className="gs-num">1</span><div className="gs-stack-md">
          <div className="gs-stack-sm"><h3 className="mcp-t-card">Connect your AI</h3><p className="gs-muted">Nothing plays until it’s connected and signed in. You do this once, so skip it if you have.</p></div>
          <PcPlugins stack={gs.narrow} />
          <p className="gs-small">Another AI? <PcHowLink label="See the steps for every AI" /></p>
          <PcAccount />
        </div></li>
        <li><span className="gs-num">2</span><div className="gs-stack-md">
          <div className="gs-stack-sm"><h3 className="mcp-t-card">Paste this prompt into it</h3></div>
          <PcPrompt text={pcText(r)} />
          <div><PcCopy text={pcText(r)} block={gs.narrow} /></div>
        </div></li>
      </ol>
    </DS.Popup>
  );
};
// 3: the press has already copied. The dialog confirms it, shows what was copied, and says what happens if the AI isn't connected.
const PcSurface3 = ({ r, close }) => (
  <DS.Popup open={!!r.open} onClose={close} title="Copied. Paste it into your AI." actions={<PcCopy variant="secondary" text={pcText(r)} label="Copy again" />}>
    <div className="gs-stack-md">
      <PcPrompt text={pcText(r)} quiet />
      <p className="gs-muted">Your AI must be connected to [Platform] to play. If it isn’t yet, it’ll tell you, and <PcHowLink label="How it works" /> shows you what to do.</p>
      <PcAccount />
    </div>
  </DS.Popup>
);
// 4 and 5: one short dialog. The prompt, Copy, and one line that says to connect first and links to how.
const PcNeed4 = () => <p className="pc-need gs-small"><b>Connect your AI first.</b> <PcHowLink label="How to connect" /></p>;
const PcSurface4 = ({ r, close }) => (
  <DS.Popup open={!!r.open} onClose={close} title={'Start ' + pcTitle(r)} actions={<PcCopy text={pcText(r)} />}>
    <div className="gs-stack-md"><PcPrompt text={pcText(r)} /><PcNeed4 /><PcAccount /></div>
  </DS.Popup>
);
// 5: Editions option 1's dialog, without its repeated sentence: the line about connecting, the prompt, Copy.
const PcSurface5 = ({ r, close }) => (
  <DS.Popup open={!!r.open} onClose={close} title={'Start ' + pcTitle(r)} actions={<PcCopy text={pcText(r)} />}>
    <div className="gs-stack-md"><PcNeed4 /><PcPrompt text={pcText(r)} /><PcAccount /></div>
  </DS.Popup>
);
const PC_SURF = { 1: PcSurface1, 2: PcSurface2, 3: PcSurface3, 4: PcSurface4, 5: PcSurface5 };
const pcIs4 = (o) => o === '4' || o === '5';
const PcPlayPopup = () => {
  const s = usePc(); const last = React.useRef(null); if (s.req) last.current = s.req;
  const r = last.current; if (!r) return null; const S = PC_SURF[s.opt] || PcSurface1;
  return <S key={s.opt + ':' + s.flash} r={{ ...r, open: !!s.req }} close={() => pcSet({ req: null })} />;
};

// ---- Product page: the play box and this edition's card, only their play controls change ----
// 4 and 5: the app's play box as it was, with step 1 linking to how, and the play button copying the prompt in one press.
const PcPlayBox4 = ({ id }) => {
  const gs = useGs(); const s = usePc(); const g = GS_GAMES[id]; const b = GS_PAGES[id].box; const paying = gs.view === 'pass';
  const text = pcText({ kind: 'game', gid: id }); const can = b.free || b.first || paying;
  return (
    <DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
      <span className="gs-label">{b.label}</span>
      <h2 className="mcp-t-card">{b.heading}</h2>
      <GsSteps items={[<><b>Connect your AI</b> first. <PcHowLink label="How to connect" /></>, ...b.steps.slice(1).map((x) => gsOr(x))]} />
      {can ? (s.opt === '5' ? <DS.Button block onClick={() => pcStart({ kind: 'game', gid: id })}>Play in your AI</DS.Button> : <PcCopy text={text} block label="Copy to play" />) : <DS.Button block onClick={() => gs.go('pass')}>Get the Pass</DS.Button>}
      {b.small && <p className="gs-small">{b.small}{!b.free && ' ' + GS.purchase}</p>}
      {b.first && !paying && <div><DS.TextLink onClick={() => gs.go('pass')}>Get the Pass</DS.TextLink></div>}
      {!b.free && !b.first && !paying && <div><DS.TextLink onClick={() => gs.go('games')}>Play a free game</DS.TextLink></div>}
      <div className="gs-rule" />
      <div className="gs-stack-sm"><span className="gs-label">WORKS WITH</span><p className="gs-small">{GS.works}</p></div>
    </DS.Card>
  );
};
const PcPlayBox = ({ id }) => {
  const gs = useGs(); const s = usePc();
  if (pcIs4(s.opt)) return <PcPlayBox4 id={id} />; const g = GS_GAMES[id]; const b = GS_PAGES[id].box; const paying = gs.view === 'pass';
  const req = { kind: 'game', gid: id }; const text = pcText(req);
  const [copied, setCopied] = React.useState(false);
  const step1 = s.opt === '1' ? <><b>Connect your AI</b> once. <PcHowLink /></> : s.opt === '2' ? GS_STEP_CONNECT : <><b>Connect your AI</b> once, then paste the prompt. <PcHowLink /></>;
  return (
    <DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
      <span className="gs-label">{b.label}</span>
      <h2 className="mcp-t-card">{b.heading}</h2>
      <GsSteps items={[step1, ...b.steps.slice(1).map((x) => gsOr(x))]} />
      {s.opt === '1' && <div className="gs-stack-md"><PcNeed /><PcPrompt text={text} /><PcCopy text={text} block /></div>}
      {s.opt === '2' && <DS.Button block onClick={() => pcStart(req)}>Play in your AI</DS.Button>}
      {s.opt === '3' && <div className="gs-stack-sm">
        <DS.Button block done={copied} doneLabel="Copied" onClick={() => { lbCopy([text]); setCopied(true); setTimeout(() => setCopied(false), 2400); }}>Copy to play</DS.Button>
        <p className="gs-small pc-said">Paste it into your AI. It must be connected to [Platform]; if it isn’t, it’ll tell you.</p>
        <PcPrompt text={text} quiet />
      </div>}
      {b.small && <p className="gs-small">{b.small}{!b.free && ' ' + GS.purchase}</p>}
      {!b.free && !paying && <div><DS.TextLink onClick={() => gs.go('pass')}>Get the Pass</DS.TextLink></div>}
      <div className="gs-rule" />
      <div className="gs-stack-sm"><span className="gs-label">WORKS WITH</span><p className="gs-small">{GS.works}</p></div>
    </DS.Card>
  );
};
const PcWeekCard = ({ id }) => {
  const gs = useGs(); const s = usePc(); const g = GS_GAMES[id]; const w = GS_PAGES[id].week;
  const paying = gs.view === 'pass'; const can = g.free || paying;
  const sid = g.free ? (GS_TODAY_PLAYED[gs.view] || {})[id] : paying && !w.unmarked ? w.session : null;
  const ss = sid ? GS_SESSIONS[sid] : null; const has = ED_GAMES.includes(id);
  const req = has ? { kind: 'edition', e: edList(gs, id)[0] } : { kind: 'game', gid: id };
  return (
    <section id="gs-today" className="gs-stack-md">
      <div className="gs-sec-head"><h2 className="mcp-t-sec">{w.title}</h2>{has && <DS.TextLink onClick={() => edGo(gs, id)}>All editions</DS.TextLink>}</div>
      <DS.Card style={{ justifyItems: 'stretch' }}>
        <div className="gs-week">
          <GsCover art={g.art} />
          <div className="gs-stack-md" style={{ justifyItems: 'start', alignContent: 'center' }}>
            <h3 className="mcp-t-card">{g.name}</h3>
            <p className="gs-muted">{w.line}</p>
            {!can ? <div className="gs-stack-sm" style={{ justifyItems: 'start' }}>{g.first && <p className="gs-small">{w.title + ' comes with the Pass. The first edition is free.'}</p>}<GsPassTag /></div>
              : ss ? (
                <div className="gs-stack-sm" style={{ justifyItems: 'start' }}>
                  <LbResult s={{ kind: ss.loss ? 'bad' : 'ok', label: ss.result }} />
                  <DS.TextLink onClick={() => gs.go('session', { id: sid })}>See your session page</DS.TextLink>
                </div>
              ) : s.opt === '4' ? <div className="gs-act"><PcCopy text={pcText(req)} label="Copy to play" /></div>
              : s.opt === '5' ? <div className="gs-act"><DS.Button onClick={() => pcStart(req)}>Play in your AI</DS.Button></div>
              : s.opt === '1' ? <div className="gs-stack-md pc-fill"><PcPrompt text={pcText(req)} /><div><PcCopy text={pcText(req)} /></div></div>
              : <div className="gs-act"><DS.Button onClick={() => pcStart(req)}>{s.opt === '3' ? 'Copy to play' : 'Play in your AI'}</DS.Button></div>}
          </div>
        </div>
      </DS.Card>
    </section>
  );
};

// ---- Editions page: a row opens its edition's prompt, through the option's surface ----
const PcEdDialog = ({ e, onClose }) => {
  React.useEffect(() => { if (e) { pcStart({ kind: 'edition', e }); onClose(); } }, [e]);
  return null;
};

// ---- How it works, per option ----
const PcHowFoot = () => (
  <>
    <section className="gs-stack-sm gs-measure"><h2 className="mcp-t-card">Disconnecting</h2><p className="gs-muted">Remove [Platform] in your AI’s settings, where you added it. Your results and history stay.</p></section>
    <section className="gs-stack-sm gs-measure"><h2 className="mcp-t-card">Help</h2><p className="gs-muted">If something doesn’t work, write to <a href={'mailto:' + GS_SUPPORT}>{GS_SUPPORT}</a> and say which AI you use.</p></section>
  </>
);
const PcGamesPrompt = ({ label }) => { const t = pcText({ kind: 'games' }); return <div className="gs-stack-md"><PcPrompt text={t} /><div><PcCopy text={t} label={label} /></div></div>; };
// 1: a document. Plain sections, top to bottom, like the Circlists page, rewritten.
const PcHow1 = () => {
  const gs = useGs(); const [ai, setAi] = React.useState('openclaw');
  return (
    <main className="gs-wrap gs-main pc-doc">
      <header className="gs-stack-md gs-measure">
        <h1 className="gs-h1">How it works</h1>
        <p className="gs-lead">You play every game inside your own AI. Connect it to [Platform] once and sign in, then start any game by pasting its prompt.</p>
        <p className="pc-need"><b>Nothing plays until your AI is connected and signed in.</b> It takes a minute, and you only do it once.</p>
      </header>
      <section className="gs-stack-md gs-measure">
        <h2 className="mcp-t-sec">Connect Claude or ChatGPT</h2>
        <p className="gs-muted">Open [Platform] in your AI, press Connect and sign in.</p>
        <PcPlugins stack={gs.narrow} />
      </section>
      <section className="gs-stack-md gs-measure">
        <h2 className="mcp-t-sec">Connect another AI</h2>
        <div className="pc-seg" role="radiogroup" aria-label="Your AI">
          {PC_OTHERS.map(([id, l]) => <DS.Button key={id} role="radio" aria-checked={ai === id} variant={ai === id ? 'main' : 'secondary'} onClick={() => setAi(id)}>{l}</DS.Button>)}
        </div>
        <PcOtherSteps id={ai} />
      </section>
      <section className="gs-stack-md gs-measure">
        <h2 className="mcp-t-sec">Start playing</h2>
        <p className="gs-muted">Paste this prompt into your AI to see every game. Each game’s page has its own prompt to start it.</p>
        <PcGamesPrompt />
      </section>
      <p className="gs-small gs-measure">{GS.purchase}</p>
      <PcHowFoot />
    </main>
  );
};
// 2: three numbered steps, each one a card. The page is the same sequence the play panel repeats.
const PcHow2 = () => {
  const gs = useGs();
  return (
    <main className="gs-wrap gs-main">
      <header className="gs-stack-md gs-measure">
        <h1 className="gs-h1">How it works</h1>
        <p className="gs-lead">You play inside your own AI. Do these three things and every game is ready to start. Until they’re done, nothing plays.</p>
      </header>
      <ol className="pc-steps3">
        <li><DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
          <span className="gs-num">1</span><h2 className="mcp-t-card">Connect your AI</h2>
          <p className="gs-muted">You do this once. One connection covers every game.</p>
          <PcPlugins stack />
          <div className="pc-discs">{PC_OTHERS.map(([id, l]) => <DS.Disclosure key={id} title={l}><PcOtherSteps id={id} /></DS.Disclosure>)}</div>
        </DS.Card></li>
        <li><DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
          <span className="gs-num">2</span><h2 className="mcp-t-card">Sign in when it asks</h2>
          <p className="gs-muted">The first time you use it, your AI asks you to sign in to [Platform]. Use the account you play with.</p>
          {gs.view === 'out' && <div className="gs-stack-sm" style={{ justifyItems: 'start' }}><p className="gs-small">No account yet? It’s free.</p><DS.Button variant="secondary" onClick={() => gs.go('signup')}>Start free</DS.Button></div>}
        </DS.Card></li>
        <li><DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
          <span className="gs-num">3</span><h2 className="mcp-t-card">Paste a prompt</h2>
          <p className="gs-muted">This one lists every game. Each game’s page has a prompt that starts it.</p>
          <PcGamesPrompt />
        </DS.Card></li>
      </ol>
      <p className="gs-small gs-measure">{GS.purchase}</p>
      <PcHowFoot />
    </main>
  );
};
// 3: the two big AIs as tiles, every other AI a row that opens its steps, then the prompt as the page's last word.
const PcHow3 = () => {
  const [ai, setAi] = React.useState(null); const last = React.useRef(null); if (ai) last.current = ai;
  const o = PC_OTHERS.find((x) => x[0] === last.current);
  return (
    <main className="gs-wrap gs-main">
      <header className="gs-stack-md gs-measure">
        <h1 className="gs-h1">How it works</h1>
        <p className="gs-lead">Your AI must be connected to [Platform] before any game plays. Connect it once, sign in, then paste a prompt.</p>
      </header>
      <section className="gs-grid2">
        {Object.keys(PC_PLUGIN).map((k) => (
          <DS.Card key={k} style={{ gap: 16, justifyItems: 'start', alignContent: 'start' }}>
            <span className="pc-tile-logo"><PcLogo ai={k} size={40} /></span>
            <h2 className="mcp-t-card">{PC_PLUGIN[k][0]}</h2>
            <p className="gs-muted">{'Open [Platform] in ' + PC_PLUGIN[k][0] + ', press Connect and sign in.'}</p>
            <DS.Button onClick={() => window.open(PC_PLUGIN[k][1], '_blank', 'noopener')}>{'Connect ' + PC_PLUGIN[k][0]}</DS.Button>
          </DS.Card>
        ))}
      </section>
      <section className="gs-stack-md">
        <h2 className="mcp-t-sec">Another AI</h2>
        <DS.Card style={{ justifyItems: 'stretch' }}>
          <DS.RowList label="Other AIs">{PC_OTHERS.map(([id, l]) => <DS.ListRow key={id} title={l} meta={id === 'other' ? 'Any AI that takes an MCP address' : 'Steps for ' + l} onClick={() => setAi(id)} />)}</DS.RowList>
        </DS.Card>
      </section>
      <section className="pc-band">
        <div className="gs-stack-sm"><h2 className="mcp-t-sec">Then paste this</h2><p className="gs-muted">It lists every game. If your AI isn’t connected yet, it says so.</p></div>
        <PcGamesPrompt label="Copy to play" />
      </section>
      <p className="gs-small gs-measure">{GS.purchase}</p>
      <PcHowFoot />
      <DS.Popup open={!!ai} onClose={() => setAi(null)} kind="panel" title={o ? 'Connect ' + (o[0] === 'other' ? 'another AI' : o[1]) : ''}>{o && <PcOtherSteps id={o[0]} />}</DS.Popup>
    </main>
  );
};
// 4 and 5 share a head, the Claude and ChatGPT cards, the Start playing card and the foot.
const PcHowHead = () => (
  <header className="gs-stack-md gs-measure">
    <h1 className="gs-h1">How it works</h1>
    <p className="gs-lead">You play every game inside your own AI. Connect it to [Platform] once and sign in, and nothing plays until you have.</p>
  </header>
);
const PcAiCard = ({ k }) => (
  <DS.Card style={{ justifyItems: 'stretch' }}>
    <div className="pc-ai">
      <span className="pc-ai-logo"><PcLogo ai={k} size={28} /></span>
      <div className="pc-ai-tx"><h2 className="mcp-t-card">{PC_PLUGIN[k][0]}</h2><p className="gs-muted">{'Open [Platform] in ' + PC_PLUGIN[k][0] + ', press Connect and sign in.'}</p></div>
      <div className="pc-ai-act"><DS.Button onClick={() => window.open(PC_PLUGIN[k][1], '_blank', 'noopener')}>{'Connect ' + PC_PLUGIN[k][0]}</DS.Button></div>
    </div>
  </DS.Card>
);
const PcStartCard = () => {
  const t = pcText({ kind: 'games' });
  return (
    <section className="pc-band pc-band4">
      <div className="gs-stack-sm"><h2 className="mcp-t-sec">Start playing</h2><p className="gs-muted">Paste this into your AI and it lists every game. Pick one and it starts.</p></div>
      <div className="pc-promptrow"><PcPrompt text={t} /><PcCopy text={t} /></div>
    </section>
  );
};
const PcHowFoot4 = () => (
  <div className="gs-grid2">
    <section className="gs-stack-sm"><h2 className="mcp-t-card">Disconnecting</h2><p className="gs-muted">Remove [Platform] in your AI’s settings, where you added it. Your results and history stay on [Platform].</p></section>
    <section className="gs-stack-sm"><h2 className="mcp-t-card">Help</h2><p className="gs-muted">If something doesn’t work, write to <a href={'mailto:' + GS_SUPPORT}>{GS_SUPPORT}</a> and say which AI you use.</p></section>
  </div>
);
// 4: rig 3's cards made compact, rig 1's switcher for every other AI, steps beside it.
const PcHow4 = () => {
  const [ai, setAi] = React.useState('openclaw');
  return (
    <main className="gs-wrap gs-main">
      <PcHowHead />
      <section className="gs-grid2">{Object.keys(PC_PLUGIN).map((k) => <PcAiCard key={k} k={k} />)}</section>
      <DS.Card style={{ justifyItems: 'stretch' }}>
        <div className="pc-other">
          <div className="gs-stack-md">
            <h2 className="mcp-t-card">Another AI</h2>
            <div className="pc-seg" role="radiogroup" aria-label="Your AI">
              {PC_OTHERS.map(([id, l]) => <DS.Button key={id} role="radio" aria-checked={ai === id} variant={ai === id ? 'main' : 'secondary'} onClick={() => setAi(id)}>{l}</DS.Button>)}
            </div>
          </div>
          <PcOtherSteps id={ai} />
        </div>
      </DS.Card>
      <PcStartCard />
      <PcHowFoot4 />
    </main>
  );
};
// 5: three cards in a row. Another AI is the third, its choices open the steps in a panel.
const PcHow5 = () => {
  const [ai, setAi] = React.useState(null); const last = React.useRef(null); if (ai) last.current = ai;
  const o = PC_OTHERS.find((x) => x[0] === last.current);
  return (
    <main className="gs-wrap gs-main">
      <PcHowHead />
      <section className="gs-grid3">
        {Object.keys(PC_PLUGIN).map((k) => (
          <DS.Card key={k} style={{ justifyItems: 'stretch' }}>
            <div className="pc-tile3">
              <div className="pc-ai-name"><span className="pc-ai-logo"><PcLogo ai={k} size={24} /></span><h2 className="mcp-t-card">{PC_PLUGIN[k][0]}</h2></div>
              <p className="gs-muted">{'Open [Platform] in ' + PC_PLUGIN[k][0] + ', press Connect and sign in.'}</p>
              <div><DS.Button onClick={() => window.open(PC_PLUGIN[k][1], '_blank', 'noopener')}>{'Connect ' + PC_PLUGIN[k][0]}</DS.Button></div>
            </div>
          </DS.Card>
        ))}
        <DS.Card style={{ justifyItems: 'stretch' }}>
          <div className="pc-tile3">
            <div className="pc-ai-name"><h2 className="mcp-t-card">Another AI</h2></div>
            <p className="gs-muted">Any AI that takes an MCP address. Pick yours to see the steps.</p>
            <div className="pc-seg">{PC_OTHERS.map(([id, l]) => <DS.Button key={id} variant="secondary" onClick={() => setAi(id)}>{l}</DS.Button>)}</div>
          </div>
        </DS.Card>
      </section>
      <PcStartCard />
      <PcHowFoot4 />
      <DS.Popup open={!!ai} onClose={() => setAi(null)} kind="panel" title={o ? 'Connect ' + (o[0] === 'other' ? 'another AI' : o[1]) : ''}>{o && <PcOtherSteps id={o[0]} />}</DS.Popup>
    </main>
  );
};
const PC_HOW_PAGES = { 1: PcHow1, 2: PcHow2, 3: PcHow3, 4: PcHow4, 5: PcHow4 };
const PcConnect = () => { const s = usePc(); const P = PC_HOW_PAGES[s.opt] || PcHow1; return <P key={s.opt} />; };

// ---- Top bar, wrapped: How it works goes to its page; every play control goes to the option's surface ----
const PC_BASE_TOP = window.GsTopBar;
const PcTopBar = () => {
  const gs = useGs();
  gs.goHow = () => gs.go('connect');
  gs.play = (name) => {
    const gid = pcGid(name) || 'delve';
    const e = gs.route.name === 'session' ? pcSessEd(gs, gs.route.id) : null;
    pcStart(e ? { kind: 'edition', e } : { kind: 'game', gid });
  };
  return <PC_BASE_TOP />;
};

// ---- Strip ----
const PC_OPTS = [
  { id: '1', name: 'The prompt in plain sight',
    idea: 'Every prompt is printed on the page where its game starts, with Copy beside it, and one line above it says to connect first. How it works is one document, top to bottom. Play controls elsewhere open a dialog with the same line, the prompt and Copy.',
    cost: 'A paragraph of instruction text now sits in the product page’s play box, where a button used to be. The need to connect is one sentence, easy to read past.' },
  { id: '2', name: 'Connect, then paste, every time',
    idea: 'Every play control keeps its button and opens a panel with two numbered steps: connect your AI, with the Claude and ChatGPT buttons, then paste this prompt. How it works is the same steps, three cards across, with sign-in as its own step.',
    cost: 'A connected player sees step 1 on every press, for ever, because the store can’t know they’ve done it. One more press before every game.' },
  { id: '3', name: 'The prompt does the telling',
    idea: 'One press copies. The prompt carries a line telling the AI to send the player to How it works if it can’t find the games tool, so an AI that isn’t connected says so itself. The dialog after the press only confirms. How it works leads with Claude and ChatGPT as tiles; other AIs open their steps from a list.',
    cost: 'The strong warning lives in the AI’s reply, which the store doesn’t control, and every prompt is a sentence longer. The page says less up front.' },
  { id: '4', name: 'Compact cards, switcher',
    idea: 'How it works keeps option 3’s Claude and ChatGPT cards, made compact with the button beside the text, and option 1’s switcher for every other AI, its steps beside it. Start playing is the bordered card, the prompt and Copy on one line. The product page is the app’s play box with step 1 linking to how to connect, and its button copies the prompt in one press. Elsewhere a short dialog shows the prompt, Copy and one line.',
    cost: 'The product page never shows the prompt, only copies it. Someone who presses before connecting finds out from their AI.' },
  { id: '5', name: 'Option 4, with the Editions dialog',
    idea: 'How it works as 4. Every play control, the product page included, says Play in your AI and opens option 1’s Editions dialog, without its repeated sentence: one line saying to connect first, with How to connect, then the prompt and Copy.',
    cost: 'One more press before every game than option 4.' },
];
const PC_GO = [['how', '1 How it works'], ['p', '2 Product page'], ['e', '3 Editions'], ['s', '4 Play again']];
let pcBooted = false;
const PcStrip = () => {
  const gs = useGs(); const s = usePc(); const o = PC_OPTS.find((x) => x.id === s.opt) || PC_OPTS[0];
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { if (!pcBooted) { pcBooted = true; gs.setView('free'); setTimeout(() => window.gsApi.go('connect'), 0); } }, []);
  const rt = gs.route; const gid = gsGameOfRoute(rt.name);
  const here = rt.name === 'connect' ? 'how' : rt.name === 'session' ? 's' : !gid ? null : rt.page === 'editions' ? 'e' : rt.page === 'record' ? null : 'p';
  const sessOf = (g) => (GS_SESSIONS[g] ? g : g === 'word' || g === 'groups' || g === 'mystery' || g === 'escape' ? ((PZ[g] && PZ[g].all.find((x) => x.sid)) || {}).sid || 'delve' : 'delve');
  const to = (k, g) => {
    const id = g || s.game; pcSet({ req: null });
    if (k === 'how') gs.go('connect');
    else if (k === 'e') ED_GAMES.includes(id) ? edGo(gs, id) : gs.go(GS_GAMES[id].route);
    else if (k === 's') gs.go('session', { id: sessOf(id) });
    else gs.go(GS_GAMES[id].route);
  };
  const pickGame = (g) => { pcSet({ game: g }); if (here && here !== 'how') to(here, g); };
  const view = (v) => { gs.setView(v); if (v === 'out' && ['library', 'history', 'account'].includes(rt.name)) gs.go('home'); };
  const seg = (opts, cur, fn) => opts.map(([v, l], i) => (
    <React.Fragment key={v}>{i > 0 && <span aria-hidden="true">/</span>}<button type="button" className="gs-demo-opt" aria-pressed={cur === v} onClick={() => fn(v)}>{l}</button></React.Fragment>
  ));
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {s.open ? (
        <div className="pg-strip-in">
          <div className="pg-strip-row">
            <span className="pg-k">Option</span>
            {PC_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={o.id === x.id} title={x.name} onClick={() => pcSet({ opt: x.id, req: null })}>{x.id}</button>)}
            <span className="pg-name">{o.name}</span>
            <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
            <button type="button" className="gs-demo-opt" onClick={() => pcSet({ open: false })}>Hide</button>
          </div>
          <div className="pg-strip-row"><span className="pg-k">Go</span>{seg(PC_GO, here, (k) => to(k))}</div>
          <div className="pg-strip-row"><span className="pg-k">Game</span>{seg(GS_GAME_ORDER.map((k) => [k, k === 'hunter' ? '36,000' : GS_GAMES[k].name.replace('Daily ', '')]), gid || s.game, pickGame)}</div>
          <div className="pg-strip-row"><span className="pg-k">View</span>{seg([['out', 'signed out'], ['free', 'no Pass'], ['pass', 'Pass']], gs.view, view)}</div>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => pcSet({ open: true })}>{'Show · ' + o.id + ' ' + o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} title={o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>Cost.</b> {o.cost}</p>
          <p className="gs-small">The prompts are drafts. The Claude and ChatGPT buttons open placeholder addresses. The store can’t know whether you’re connected, so no option shows it.</p>
        </div>
      </DS.Popup>
    </div>
  );
};

Object.assign(window, {
  GsConnect: PcConnect, GsPlayPopup: PcPlayPopup, GsPlayBox: PcPlayBox, GsWeekCard: PcWeekCard,
  EdLineDialog: PcEdDialog, GsTopBar: PcTopBar, GsDemoBar: PcStrip,
});
