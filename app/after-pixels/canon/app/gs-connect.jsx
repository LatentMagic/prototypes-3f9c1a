// ============================================================================
// After Pixels — How it works (route 'connect'), and the play dialog every play control opens.
// The store can't know whether your AI is connected, so nothing here shows it.
// ============================================================================
import React from 'react';
import { GS_GAMES, GS_SESSIONS, GS_GAME_ORDER, DS, useGs, GS, gsStartsOver, GS_ONCE_LINE } from './gs-data.jsx';
import { GS_SUPPORT } from './gs-site.jsx';
import { GsSteps } from './gs-parts.jsx';
import { lbCopy } from './gs-library.jsx';
import { DV_ALL, dvSid } from './gs-delve-library.jsx';
import { PZ } from './gs-puzzles-library.jsx';
import { bwEds } from './gs-barrow-library.jsx';
import { edList } from './gs-history.jsx';

const GS_AI_LOGO = {
  claude: 'm4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z',
  chatgpt: 'M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z',
  gemini: 'M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81',
};
// The app picker on How it works, in the owner's order: ChatGPT first, Other last. Each app sets up one of three ways
// (route): in its settings, by asking in a chat, or by a command. `noun` is the app's own word for where a custom server goes;
// `look` is the button to look for. Grok is one tile whose card switches between the Grok app and Grok Bot (an AI's agent
// version sits under its AI this way). The Grok app's steps are untried; the commands are from each app's docs.
const GS_APPS = [
  { id: 'chatgpt', name: 'ChatGPT', route: 'settings', noun: 'plugin', look: 'Add custom MCP server' },
  { id: 'claude', name: 'Claude', route: 'settings', noun: 'custom connector', look: 'Add custom connector' },
  { id: 'gemini', name: 'Gemini', route: 'settings', noun: 'custom app', look: 'Add' },
  { id: 'grok', name: 'Grok', route: 'settings', noun: 'custom connector', look: 'Add custom connector', subs: ['grok', 'grokbot'] },
  { id: 'grokbot', name: 'Grok Bot', route: 'chat', sub: true },
  { id: 'muse', name: 'Muse', route: 'chat' },
  { id: 'openclaw', name: 'OpenClaw', route: 'command', cmd: (url) => 'openclaw mcp add after-pixels --url ' + url + ' --transport streamable-http --auth oauth', login: 'openclaw mcp login after-pixels' },
  { id: 'hermes', name: 'Hermes Agent', route: 'command', cmd: (url) => 'hermes mcp add after-pixels --url ' + url + ' --auth oauth' },
  { id: 'other', name: 'Other', route: 'settings', noun: 'custom connector or MCP server' },
];
const gsApp = (id) => GS_APPS.find((a) => a.id === id);
const GS_SUB_LABEL = { grok: 'Grok app', grokbot: 'Grok Bot' };
// Grok, Muse, OpenClaw and Hermes Agent have no logo file yet: a marked placeholder ring stands in, at the logo's size.
const GsAiLogo = ({ ai, size = 20 }) => (
  ai === 'other' ? <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" /></svg>
  : GS_AI_LOGO[ai] ? <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" focusable="false"><path d={GS_AI_LOGO[ai]} /></svg>
  : <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" focusable="false" className="hw-nologo"><circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" /><text x="16" y="19" textAnchor="middle" fontSize="7" fill="currentColor">no file</text></svg>
);

// ---- Prompts (drafts, not ratified). A request is { kind: 'games' } | { kind: 'game', gid } | { kind: 'edition', e }. ----
const gsEdPromptName = (e) => (e.title ? GS_GAMES[e.gid].name + ', “' + e.title + '”' : GS_GAMES[e.gid].name + ' #' + e.n + (e.title ? ', “' + e.title + '”' : ''));
export const gsPromptText = (r) => r.kind === 'games' ? 'Play After Pixels'
  : 'Play ' + (r.kind === 'edition' ? gsEdPromptName(r.e) : GS_GAMES[r.gid].name) + ' on After Pixels';
const gsPromptTitle = (r) => r.kind === 'edition' ? gsEdPromptName(r.e) : GS_GAMES[r.gid].name;
// What a play control starts: on a session's page, the edition that session belongs to; elsewhere, or for a session that names
// no edition (noEd), the game.
export const gsSessEd = (gs, sid) => {
  const s = GS_SESSIONS[sid]; const gid = s && s.gid;
  if (gid === 'barrow' && bwEds) { const l = bwEds(gs); return l.find((e) => e.key === (s.edKey || 'bw1')) || l[l.length - 1]; }
  if (!gid || s.noEd) return null;
  const list = edList(gs, gid);
  if (s.edKey) return list.find((e) => e.key === s.edKey) || list[0];
  if (PZ && PZ[gid]) { const x = PZ[gid].all.find((y) => y.sid === sid); if (x) return list.find((e) => e.key === x.id) || list[0]; }
  if (gid === 'delve' && DV_ALL) { const x = DV_ALL.find((y) => dvSid(y) === sid); if (x) return list.find((e) => e.key === x.id) || list[0]; }
  if (s.number != null) { const m = list.find((e) => e.n === s.number); if (m) return m; }
  return list[0];
};
export const gsPlayReq = (gs, name) => {
  const gid = GS_GAME_ORDER.find((k) => GS_GAMES[k].name === name) || 'delve';
  const e = gs.route.name === 'session' ? gsSessEd(gs, gs.route.id) : null;
  return e ? { kind: 'edition', e } : { kind: 'game', gid };
};

// ---- Small parts ----
export const GsPrompt = ({ text }) => <div className="lb-share-text hw-prompt">{text}</div>;
export const GsCopyPrompt = ({ text, label, block }) => {
  const [done, setDone] = React.useState(false);
  React.useEffect(() => { if (!done) return undefined; const t = setTimeout(() => setDone(false), 2400); return () => clearTimeout(t); }, [done]);
  return <DS.Button block={block} done={done} doneLabel="Copied" onClick={() => { lbCopy([text]); setDone(true); }}>{label || 'Copy prompt'}</DS.Button>;
};
export const GsHowLink = ({ label }) => { const gs = useGs(); return <button type="button" className="gs-inlink" onClick={() => (gs.playing ? gs.howFromPlay() : gs.go('connect'))}>{label || 'How it works'}</button>; };
// KEEP: the text (the address, a message to send, a command) scrolls sideways under a finger so the whole of it can be read;
// focus or a tap selects it for copying by hand. A box, not an input: an input's select-on-focus stops the swipe.
const gsSelectAll = (el) => { const r = document.createRange(); r.selectNodeContents(el); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); };
const GsCopyBox = ({ text, label }) => {
  const [done, setDone] = React.useState(false);
  return (
    <div className="gs-copy">
      <div className="mcp-in gs-num-text gs-copy-addr" role="textbox" aria-readonly="true" tabIndex={0} aria-label={label} onFocus={(e) => gsSelectAll(e.currentTarget)} onClick={(e) => gsSelectAll(e.currentTarget)}>{text}</div>
      <DS.Button variant="secondary" done={done} doneLabel="Copied" onClick={() => { lbCopy([text]); setDone(true); setTimeout(() => setDone(false), 2400); }}>Copy</DS.Button>
    </div>
  );
};

// ---- The play dialog: one line about connecting, the prompt, Copy ----
// A finished edition of a game played once starts nothing: the dialog says so, with no prompt and no Copy. The product page's
// Play is the one exception: its request carries page: true and always opens the prompt.
const gsReqEd = (gs, r) => r.page ? null : r.e || (r.kind === 'game' && gs.view !== 'out' ? edList(gs, r.gid)[0] : null);
const gsReqDone = (gs, r) => { const e = gsReqEd(gs, r); return !!e && !gsStartsOver(e.gid) && !!e.status && e.status.kind !== 'none' && e.status.kind !== 'live'; };
export const GsPlayDialog = () => {
  const gs = useGs(); const last = React.useRef(null); if (gs.playing) last.current = gs.playing; const r = last.current;
  if (!r) return null;
  if (r.kind !== 'games' && gsReqDone(gs, r)) return (
    <DS.Popup open={!!gs.playing} onClose={gs.closePlay} title={gsPromptTitle(r)}>
      <p>{GS_ONCE_LINE}</p>
    </DS.Popup>
  );
  return (
    <DS.Popup open={!!gs.playing} onClose={gs.closePlay} title={'Start ' + gsPromptTitle(r)} actions={<GsCopyPrompt text={gsPromptText(r)} />}>
      <div className="gs-stack-md">
        <p className="hw-need gs-small"><b>Connect your AI first.</b> <GsHowLink label="How to connect" /></p>
        <GsPrompt text={gsPromptText(r)} />
        {gs.view === 'out' && <p className="gs-small">You also need a After Pixels account. <button type="button" className="gs-inlink" onClick={() => { gs.closePlay(); gs.go('signup'); }}>Start free</button></p>}
      </div>
    </DS.Popup>
  );
};

// ---- How it works ----
// Overview, then Setup, Start and Playing (each Overview box jumps to its section), then who does what, Disconnecting and Help.
// No numbers on the Overview boxes or the section headings.
// KEEP: a jump lands the section's heading just under the sticky top bar (scroll-margin-top 80px, plus the app posture's top inset) and moves focus to it, so a
// keyboard or screen-reader user carries on from there; with reduced motion it jumps instead of gliding.
const gsJump = (id) => {
  const el = document.getElementById(id); if (!el) return;
  const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
  const h = el.querySelector('h2'); if (h) h.focus({ preventScroll: true });
};
// The words a player types to start, drawn as a message in a chat.
const GsSay = () => <span className="hw-say">{gsPromptText({ kind: 'games' })}</span>;
const GS_HW_JUMPS = [
  ['hw-setup', <>Add the game and sign in, once</>],
  ['hw-start', <>Type <GsSay /></>],
  ['hw-playing', <>Pick a game and play</>],
];

const gsAppSteps = (a) => a.route === 'settings' ? [
  <>{'Add a ' + a.noun + ' to ' + (a.id === 'other' ? 'your app' : a.name)}{a.look && <> <span className="gs-muted">Look for <b>{a.look}</b></span></>}</>,
  <>Paste the address, and name it <b>After Pixels</b></>,
  'Connect, then sign in',
] : a.route === 'chat' ? [
  <div className="gs-stack-sm"><span>{'In a chat with ' + a.name + ', send'}</span><GsCopyBox text={'Add this MCP server: ' + GS.link} label="The message to send" /></div>,
  'Sign in when it gives you a link',
] : [
  <div className="gs-stack-sm"><span>Run</span><GsCopyBox text={a.cmd(GS.link)} label="The command to run" /></div>,
  a.login ? <div className="gs-stack-sm"><span>Run</span><GsCopyBox text={a.login} label="The sign-in command" /><span>and open the link it prints</span></div> : 'Open the sign-in link it prints',
];

// The app picker (a CardRow of logo tiles) and the picked app's card under it.
// KEEP: the tiles fill the row when all fit (about 700px and up); narrower, about 4½ show and the row swipes, with Previous
// and Next, so the half tile says there is more. At 420px and under each tile is its logo alone; the card's heading names the
// pick. A tile picked while partly off the row's edge scrolls fully into view. The card's notch points at the picked tile and
// follows it as the row scrolls, and hides once that tile is out of view.
const gsRevealTile = (el) => {
  const tr = el.parentElement, r = el.getBoundingClientRect(), b = tr.getBoundingClientRect();
  const d = r.left < b.left ? r.left - b.left - 4 : r.right > b.right ? r.right - b.right + 4 : 0;
  const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (d) tr.scrollBy({ left: d, behavior: still ? 'auto' : 'smooth' });
};
const GsSetup = () => {
  const [tile, setTile] = React.useState('chatgpt');
  const [sub, setSub] = React.useState('grok');
  const t = gsApp(tile); const a = gsApp(t.subs ? sub : tile);
  const wrap = React.useRef(null), card = React.useRef(null), notch = React.useRef(null), placed = React.useRef(false);
  React.useLayoutEffect(() => {
    const w = wrap.current; if (!w) return undefined;
    const track = w.querySelector('.mcp-crow-track');
    // KEEP: the notch glides to a newly picked tile, but tracks a scrolling row directly, so it never trails the tile.
    const place = (glide) => {
      const p = w.querySelector('.hw-app[aria-pressed="true"]'), c = card.current, n = notch.current; if (!p || !c || !n) return;
      const r = p.getBoundingClientRect(), cr = c.getBoundingClientRect(), x = r.left + r.width / 2 - cr.left;
      if (glide !== undefined) n.style.transition = glide && placed.current ? '' : 'none';
      n.style.visibility = x < 16 || x > cr.width - 16 ? 'hidden' : '';
      n.style.left = x + 'px';
    };
    const follow = () => place(false), refit = () => place();
    place(true); placed.current = true;
    if (track) track.addEventListener('scroll', follow, { passive: true });
    const ro = window.ResizeObserver ? new ResizeObserver(refit) : null; if (ro) ro.observe(w);
    return () => { if (track) track.removeEventListener('scroll', follow); if (ro) ro.disconnect(); };
  }, [tile]);
  return (
    <div className="gs-stack-md" ref={wrap}>
      <DS.CardRow title="Which app do you play in?" as="h3" label="Apps" className="hw-apps">
        {GS_APPS.filter((x) => !x.sub).map((x) => (
          <button key={x.id} type="button" className="hw-app" aria-pressed={tile === x.id} aria-label={x.name} onClick={(e) => { setTile(x.id); gsRevealTile(e.currentTarget); }}>
            <GsAiLogo ai={x.id} size={32} /><span>{x.name}</span>
          </button>
        ))}
      </DS.CardRow>
      <div className="hw-pick" ref={card} aria-live="polite">
        <i className="hw-notch" ref={notch} aria-hidden="true" />
        <DS.Card style={{ justifyItems: 'stretch' }}>
          <div className="gs-stack-md">
            {t.subs && (
              <div className="hw-seg" role="group" aria-label="Which Grok">
                {t.subs.map((id) => <DS.Button key={id} aria-pressed={sub === id} variant={sub === id ? 'main' : 'secondary'} onClick={() => setSub(id)}>{GS_SUB_LABEL[id]}</DS.Button>)}
              </div>
            )}
            <h3 className="mcp-t-card">{'Add it in ' + a.name}</h3>
            {a.route === 'settings' && <GsCopyBox text={GS.link} label="The After Pixels address" />}
            <GsSteps items={gsAppSteps(a)} />
            <p className="gs-small">You need a free After Pixels account.</p>
          </div>
        </DS.Card>
      </div>
      <p className="gs-small">Don’t see this option? Not every plan or country offers it yet.</p>
    </div>
  );
};

// Playing: a game from start to end. Each step's picture is a new asset still to be made; a marked placeholder holds its place.
const GS_HW_PLAY = [
  ['Pick a game', 'Your AI lists them, or name one.'],
  ['Play it in the chat', 'Your AI runs it; the game keeps the rules and dice.'],
  ['It saves as you go', 'Stop any time; say it again later and it carries on.'],
  ['When it ends', 'Your record updates on After Pixels. Share it, see your game page, or go back to the games.'],
];
const GsHwPic = () => <div className="hw-pic" role="img" aria-label="Picture to come"><span>Picture to come</span></div>;
const GS_HW_TRUST = ['Your AI runs the chat', 'The game keeps the rules', 'The game throws the dice', 'The game keeps your record'];

export const GsConnect = () => {
  const gs = useGs();
  return (
    <main className="gs-wrap gs-main">
      <header className="gs-stack-md hw-head">
        <h1 className="gs-h1">How it works</h1>
        <p className="gs-lead">You play every game inside your own AI. Connect it to After Pixels once and sign in, and nothing plays until you have.</p>
      </header>
      <nav className="hw-jumps" aria-label="On this page">
        {GS_HW_JUMPS.map(([id, body]) => <DS.Card key={id} onClick={() => gsJump(id)}><span className="hw-jump">{body}</span></DS.Card>)}
      </nav>
      <section id="hw-setup" className="hw-sec gs-stack-md">
        <h2 className="mcp-t-sec" tabIndex={-1}>Setup: add the game and sign in, once</h2>
        <GsSetup />
      </section>
      <section id="hw-start" className="hw-sec gs-stack-md">
        <h2 className="mcp-t-sec" tabIndex={-1}>Start</h2>
        <p className="hw-start">In any chat, type <GsSay /></p>
        <p className="gs-muted">Your AI lists the games, and you pick one. Or name one straight away: <b>“Play Delve on After Pixels”</b>. <button type="button" className="gs-inlink" onClick={() => gs.go('games')}>See the games</button></p>
        <p className="gs-muted">Switch games whenever you like. Say it again in any new chat, and it carries on an unfinished game.</p>
      </section>
      <section id="hw-playing" className="hw-sec gs-stack-md">
        <h2 className="mcp-t-sec" tabIndex={-1}>Playing</h2>
        <ol className="hw-life">
          {GS_HW_PLAY.map(([title, line]) => (
            <li key={title}><DS.Card className="hw-life-card"><GsHwPic /><div className="gs-stack-xs"><h3 className="mcp-t-card">{title}</h3><p className="gs-muted">{line}</p></div></DS.Card></li>
          ))}
        </ol>
        <p><b>Fresh games daily and weekly, and every past edition is there to play.</b></p>
        <p>Some games are free. The rest come with the Pass. <button type="button" className="gs-inlink" onClick={() => gs.go('pass')}>See Pricing</button></p>
      </section>
      <section className="gs-stack-md" aria-label="Who does what">
        <ul className="hw-trust">{GS_HW_TRUST.map((x) => <li key={x}><DS.Card><span className="hw-fact">{x}</span></DS.Card></li>)}</ul>
        <p className="gs-muted">Your AI never asks you to pay. Your AI plan pays for play, and a capable model plays better.</p>
      </section>
      <div className="gs-grid2">
        <section className="gs-stack-sm"><h2 className="mcp-t-card">Disconnecting</h2><p className="gs-muted">Remove After Pixels in your AI’s settings, where you added it. Your results and history stay on After Pixels.</p></section>
        <section className="gs-stack-sm"><h2 className="mcp-t-card">Help</h2><p className="gs-muted">If something doesn’t work, write to <a href={'mailto:' + GS_SUPPORT}>{GS_SUPPORT}</a> and say which AI you use.</p></section>
      </div>
    </main>
  );
};
