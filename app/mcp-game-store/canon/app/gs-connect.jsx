// ============================================================================
// [Platform] — How it works (route 'connect'), and the play dialog every play control opens.
// Ratified 2026-10-09 from docs/specs/connect-and-prompts/ (option 4's page, option 5's play dialog).
// The store can't know whether your AI is connected, so nothing here shows it.
// ============================================================================
const GS_AI_LOGO = {
  claude: 'm4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z',
  chatgpt: 'M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z',
};
// Placeholder destinations: the store's plugin page in each AI is not known yet.
const GS_AI_PLUGIN = { claude: ['Claude', 'https://claude.ai/settings/connectors'], chatgpt: ['ChatGPT', 'https://chatgpt.com/'] };
// Other AIs. OpenClaw's steps are unverified placeholders.
const GS_AI_OTHERS = [
  ['openclaw', 'OpenClaw', ['In a terminal, run openclaw mcp add and give it the address as the URL.', 'Approve the connection, then sign in to [Platform] when OpenClaw asks.']],
  ['gemini', 'Gemini', ['In Gemini, open Settings, then Custom apps, and add an app. Paste the address there.', 'Approve the connection, then sign in to [Platform] when Gemini asks.']],
  ['other', 'Other', ['In your AI’s settings, find where it adds MCP connectors or custom apps. Paste the address there.', 'Approve the connection, then sign in to [Platform] when it asks.']],
];
const GsAiLogo = ({ ai, size = 20 }) => <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" focusable="false"><path d={GS_AI_LOGO[ai]} /></svg>;

// ---- Prompts (drafts, not ratified). A request is { kind: 'games' } | { kind: 'game', gid } | { kind: 'edition', e }. ----
const gsEdPromptName = (e) => GS_GAMES[e.gid].name + ' #' + e.n + (e.title ? ', “' + e.title + '”' : '');
const gsPromptText = (r) => r.kind === 'games' ? 'Load the [Platform] games tool and show me the games it lists, with a line about each.'
  : 'Load the [Platform] games tool and start ' + (r.kind === 'edition' ? gsEdPromptName(r.e) : GS_GAMES[r.gid].name) + '. Run it exactly as the tool says.';
const gsPromptTitle = (r) => r.kind === 'edition' ? gsEdPromptName(r.e) : GS_GAMES[r.gid].name;
// What a play control starts: on a session's page, the edition that session belongs to; elsewhere the game.
const gsSessEd = (gs, sid) => {
  const s = GS_SESSIONS[sid]; const gid = s && s.gid; if (!gid || !window.ED_GAMES || !ED_GAMES.includes(gid)) return null;
  const list = edList(gs, gid);
  if (window.PZ && PZ[gid]) { const x = PZ[gid].all.find((y) => y.sid === sid); if (x) return list.find((e) => e.key === x.id) || list[0]; }
  return sid === 'delve-first' ? list[list.length - 1] : list[0];
};
const gsPlayReq = (gs, name) => {
  const gid = GS_GAME_ORDER.find((k) => GS_GAMES[k].name === name) || 'delve';
  const e = gs.route.name === 'session' ? gsSessEd(gs, gs.route.id) : null;
  return e ? { kind: 'edition', e } : { kind: 'game', gid };
};

// ---- Small parts ----
const GsPrompt = ({ text }) => <div className="lb-share-text hw-prompt">{text}</div>;
const GsCopyPrompt = ({ text, label, block }) => {
  const [done, setDone] = React.useState(false);
  React.useEffect(() => { if (!done) return undefined; const t = setTimeout(() => setDone(false), 2400); return () => clearTimeout(t); }, [done]);
  return <DS.Button block={block} done={done} doneLabel="Copied" onClick={() => { lbCopy([text]); setDone(true); }}>{label || 'Copy prompt'}</DS.Button>;
};
const GsHowLink = ({ label }) => { const gs = useGs(); return <button type="button" className="gs-inlink" onClick={() => { gs.closePlay(); gs.go('connect'); }}>{label || 'How it works'}</button>; };
const GsAddress = () => {
  const [done, setDone] = React.useState(false);
  return (
    <div className="gs-copy">
      <input className="mcp-in gs-num-text" readOnly value={GS.link} aria-label="The [Platform] address" onFocus={(e) => e.target.select()} />
      <DS.Button variant="secondary" done={done} doneLabel="Copied" onClick={() => { lbCopy([GS.link]); setDone(true); setTimeout(() => setDone(false), 2400); }}>Copy</DS.Button>
    </div>
  );
};
const GsOtherSteps = ({ id }) => { const o = GS_AI_OTHERS.find((x) => x[0] === id); return <GsSteps items={[<div className="gs-stack-sm"><span>Copy the [Platform] address.</span><GsAddress /></div>, ...o[2]]} />; };

// ---- The play dialog: one line about connecting, the prompt, Copy ----
const GsPlayDialog = () => {
  const gs = useGs(); const last = React.useRef(null); if (gs.playing) last.current = gs.playing; const r = last.current;
  if (!r) return null;
  return (
    <DS.Popup open={!!gs.playing} onClose={gs.closePlay} title={'Start ' + gsPromptTitle(r)} actions={<GsCopyPrompt text={gsPromptText(r)} />}>
      <div className="gs-stack-md">
        <p className="hw-need gs-small"><b>Connect your AI first.</b> <GsHowLink label="How to connect" /></p>
        <GsPrompt text={gsPromptText(r)} />
        {gs.view === 'out' && <p className="gs-small">You also need a [Platform] account. <button type="button" className="gs-inlink" onClick={() => { gs.closePlay(); gs.go('signup'); }}>Start free</button></p>}
      </div>
    </DS.Popup>
  );
};

// ---- How it works ----
const GsAiCard = ({ k }) => (
  <DS.Card style={{ justifyItems: 'stretch' }}>
    <div className="hw-ai">
      <span className="hw-ai-logo"><GsAiLogo ai={k} size={28} /></span>
      <div className="hw-ai-tx"><h2 className="mcp-t-card">{GS_AI_PLUGIN[k][0]}</h2><p className="gs-muted">{'Open [Platform] in ' + GS_AI_PLUGIN[k][0] + ', press Connect and sign in.'}</p></div>
      <div className="hw-ai-act"><DS.Button onClick={() => window.open(GS_AI_PLUGIN[k][1], '_blank', 'noopener')}>{'Connect ' + GS_AI_PLUGIN[k][0]}</DS.Button></div>
    </div>
  </DS.Card>
);
const GsConnect = () => {
  const [ai, setAi] = React.useState('openclaw');
  const t = gsPromptText({ kind: 'games' });
  return (
    <main className="gs-wrap gs-main">
      <header className="gs-stack-md gs-measure">
        <h1 className="gs-h1">How it works</h1>
        <p className="gs-lead">You play every game inside your own AI. Connect it to [Platform] once and sign in, and nothing plays until you have.</p>
      </header>
      <section className="gs-grid2">{Object.keys(GS_AI_PLUGIN).map((k) => <GsAiCard key={k} k={k} />)}</section>
      <DS.Card style={{ justifyItems: 'stretch' }}>
        <div className="hw-other">
          <div className="gs-stack-md">
            <h2 className="mcp-t-card">Another AI</h2>
            <div className="hw-seg" role="radiogroup" aria-label="Your AI">
              {GS_AI_OTHERS.map(([id, l]) => <DS.Button key={id} role="radio" aria-checked={ai === id} variant={ai === id ? 'main' : 'secondary'} onClick={() => setAi(id)}>{l}</DS.Button>)}
            </div>
          </div>
          <GsOtherSteps id={ai} />
        </div>
      </DS.Card>
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

Object.assign(window, { GsConnect, GsPlayDialog, gsPlayReq, gsPromptText, GsHowLink });
