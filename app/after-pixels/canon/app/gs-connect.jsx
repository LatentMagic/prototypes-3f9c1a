// ============================================================================
// After Pixels — How it works (route 'connect'), and the play dialog every play control opens.
// The store can't know whether your AI is connected, so nothing here shows it.
// ============================================================================
import React from 'react';
import { GS_GAMES, GS_SESSIONS, GS_GAME_ORDER, GS_ART, DS, useGs, GS, gsStartsOver, GS_ONCE_LINE } from './gs-data.jsx';
import { GS_SUPPORT } from './gs-site.jsx';
import { GsSteps } from './gs-parts.jsx';
import { lbCopy } from './gs-library.jsx';
import { DV_ALL, dvSid } from './gs-delve-library.jsx';
import { PZ } from './gs-puzzles-library.jsx';
import { bwEds } from './gs-barrow-library.jsx';
import { edList } from './gs-history.jsx';

// The app picker on How it works, in the owner's order: ChatGPT first, Other last. Each app sets up one of three ways
// (route): in its settings, by asking in a chat, or by a command. `noun` is the app's own word for where a custom server goes;
// `look` is the button to look for; `first` is a command run before the one that adds After Pixels. Grok is one tile whose card switches between the Grok app and Grok Bot (an AI's agent
// version sits under its AI this way). The Grok app's steps are untried; the commands are from each app's docs.
const GS_APPS = [
  { id: 'chatgpt', name: 'ChatGPT', route: 'settings', noun: 'plugin', look: 'Add custom MCP server' },
  { id: 'claude', name: 'Claude', route: 'settings', noun: 'custom connector', look: 'Add custom connector' },
  // Gemini's form has no name field, so it skips "name it After Pixels" (checked by the user, 2026-11-11).
  { id: 'gemini', name: 'Gemini', route: 'settings', noun: 'custom app', look: 'Custom', via: 'Connected apps', noName: true },
  { id: 'grok', name: 'Grok', route: 'settings', noun: 'custom connector', look: 'Custom', via: 'New Connector', subs: ['grok', 'grokbot'] },
  { id: 'grokbot', name: 'Grok Bot', route: 'chat', sub: true },
  { id: 'muse', name: 'Muse', route: 'chat' },
  // OpenClaw signs in only with its Gateway stopped, so stopping it is the first command and starting it again the last.
  { id: 'openclaw', name: 'OpenClaw', route: 'command', first: 'openclaw gateway stop', last: 'openclaw gateway start', cmd: (url) => 'openclaw mcp add after-pixels --url ' + url + ' --transport streamable-http --auth oauth', login: 'openclaw mcp login after-pixels' },
  { id: 'hermes', name: 'Hermes Agent', tile: 'Hermes', route: 'command', remote: true, cmd: (url) => 'hermes mcp add after-pixels --url ' + url + ' --auth oauth', retry: 'hermes mcp login after-pixels' },
  { id: 'other', name: 'Other', route: 'settings' },
];
const gsApp = (id) => GS_APPS.find((a) => a.id === id);
const GS_SUB_LABEL = { grok: 'Grok app', grokbot: 'Grok Bot' };
// KEEP: each app shows a mark of our own, never its real logo: the owners' terms need permission we are not asking for
// (the user, 2026-11-11). A mark is one cover shape, every app's different and none copying its logo, drawn in the tile's
// text colour with no box, so the picker carries no colour of its own (the user, 2026-11-11: "one colour is aboslute bloody
// perfection"). Other is the only outline. A tile shows `tile` in place of `name` where the full name would wrap (the user:
// "make hermes agent say hermes").
const GS_AI_MARK = {
  chatgpt: <circle cx="20" cy="20" r="10" />,
  claude: <path d="M20 8 L32 20 L20 32 L8 20 Z" />,
  gemini: <path d="M8 28 A12 12 0 0 1 32 28 Z" />,
  grok: <rect x="11" y="11" width="18" height="18" />,
  muse: <path d="M10 10 L30 10 A20 20 0 0 1 10 30 Z" />,
  openclaw: <path d="M9 31 L31 31 L31 9 Z" />,
  hermes: <path d="M16 9 L28 9 L24 31 L12 31 Z" />,
};
const GsAiLogo = ({ ai, size = 20 }) => (
  <svg className="hw-mark" viewBox="6 6 28 28" width={size} height={size} aria-hidden="true" focusable="false">
    {GS_AI_MARK[ai] ? <g fill="currentColor">{GS_AI_MARK[ai]}</g>
      : <circle cx="20" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" />}
  </svg>
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
  return <DS.Button block={block} done={done} doneLabel="Copied" onClick={() => { Promise.resolve(lbCopy([text])).then((ok) => ok && setDone(true)); }}>{label || 'Copy prompt'}</DS.Button>;
};
export const GsHowLink = ({ label }) => { const gs = useGs(); return <button type="button" className="gs-inlink" onClick={() => (gs.playing ? gs.howFromPlay() : gs.go('connect'))}>{label || 'How it works'}</button>; };
// KEEP: the text (the address, a message to send, a command) scrolls sideways under a finger so the whole of it can be read;
// focus or a tap selects it for copying by hand. A box, not an input: an input's select-on-focus stops the swipe.
const gsSelectAll = (el) => { const r = document.createRange(); r.selectNodeContents(el); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); };
// KEEP: a copy box is one line at every width, with Copy beside it at its normal size: a long command scrolls sideways inside the box
// (no wrapping, no ellipsis), with a soft fade at the right edge while there is more to see. Copy copies the whole text.
// KEEP: the address is short and must be read whole to be checked, so under 420px its box takes the full row with Copy under it.
// The refused-copy line, as deployed (connect-layout): the control never says "Copied", the text is selected so it can be copied by hand.
const gsRefusedLine = (what) => 'Copy didn’t work. Select the ' + what + ' and copy it yourself.';
const GsCopyBox = ({ text, label, address, what = 'command' }) => {
  const [done, setDone] = React.useState(false);
  const [refused, setRefused] = React.useState(false);
  React.useEffect(() => setRefused(false), [text]);
  const [more, setMore] = React.useState(false);
  const box = React.useRef(null);
  React.useLayoutEffect(() => {
    const el = box.current; if (!el) return undefined;
    const read = () => setMore(el.scrollWidth - el.clientWidth - el.scrollLeft > 2);
    read(); el.addEventListener('scroll', read, { passive: true });
    const ro = window.ResizeObserver ? new ResizeObserver(read) : null; if (ro) ro.observe(el);
    return () => { el.removeEventListener('scroll', read); if (ro) ro.disconnect(); };
  }, [text]);
  return (
    <div className={'gs-copy' + (address ? ' is-address' : '')}>
      <div className={'gs-copy-field' + (more ? ' has-more' : '')}>
        <div ref={box} className="mcp-in gs-num-text gs-copy-addr" role="textbox" aria-readonly="true" tabIndex={0} aria-label={label} onFocus={(e) => gsSelectAll(e.currentTarget)} onClick={(e) => gsSelectAll(e.currentTarget)}>{text}</div>
      </div>
      <DS.Button variant="secondary" done={done} doneLabel="Copied" onClick={() => {
        Promise.resolve(lbCopy([text])).then((ok) => {
          setRefused(!ok); setDone(!!ok);
          if (ok) setTimeout(() => setDone(false), 2400); else if (box.current) gsSelectAll(box.current);
        });
      }}>Copy</DS.Button>
      <p className="gs-small gs-copy-refused" role="status">{refused ? gsRefusedLine(what) : ''}</p>
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
        <p className="hw-need gs-small"><b>Add After Pixels to your app first.</b> <GsHowLink label="How to set up" /></p>
        <GsPrompt text={gsPromptText(r)} />
        {gs.view === 'out' && <p className="gs-small">You also need a free After Pixels account. <button type="button" className="gs-inlink" onClick={() => { gs.closePlay(); gs.go('signup'); }}>Start free</button></p>}
      </div>
    </DS.Popup>
  );
};

// ---- How it works ----
// The cover band, then Setup, Start and Playing, then who does what, with Disconnecting and Help at the foot. No numbers on the
// section headings, and no jumps at the top: Setup follows straight after. Each section is a 24px heading and one surface under it.
// The section ids stay, so other pages can link to one (scroll-margin-top 80px, plus the app posture's top inset).
// The words a player types, drawn as a sent message. A non-breaking space joins it to the word before, so "type" and the
// bubble never split.
// Every bubble on this page copies (`copy`).
// KEEP: a copying bubble shows no refused line: on a refused copy it simply doesn't say "Copied" (the user, 2026-11-11). Its words stay unselectable, since a tap copies.
const GsCopyBubble = ({ children, wrap, edge }) => <DS.SpeechBubble wrap={wrap} copy edge={edge} onCopy={(t) => lbCopy([t])}>{children}</DS.SpeechBubble>;
// Every route's last step: the app may ask before each move, and the player may be able to stop that.
const gsPermStep = (a) => 'If ' + (a.id === 'other' ? 'your AI' : a.name) + ' asks before each move, you may be able to change that in its permissions.';
const GS_SIGN_IN = 'sign in with your After Pixels account.';
// The thing to copy before leaving for the other app: the address, the message or the first command. It sits beside the steps,
// so a step that uses it names it by its label's noun.
const gsAppCopy = (a) => a.route === 'settings' ? ['The address to paste', GS.link]
  : a.route === 'chat' ? ['The message to send', 'Add this MCP server: ' + GS.link]
  : ['The command to run', a.first || a.cmd(GS.link)];
const gsAppSteps = (a) => [
  ...(a.route === 'settings' ? [
    a.id === 'other' ? 'In your app, find where you add a connector, plugin or MCP server.' : <>{'Add a ' + a.noun + ' in ' + a.name + '. Look for '}{a.via && <><b>{a.via}</b>, then </>}<b>{a.look}</b>.</>,
    a.noName ? 'Paste the address.' : <>Paste the address and name it <b>After Pixels</b>.</>,
    // The step before names it After Pixels, so the name isn't repeated; Gemini's step before has no name, so its step says it (the user, 2026-11-11).
    a.noName ? 'Connect, then sign in to your After Pixels account.' : 'Connect, then sign in to your account.',
  ] : a.route === 'chat' ? [
    'In a chat with ' + a.name + ', send the message.',
    'Open the link ' + a.name + ' sends, and ' + GS_SIGN_IN,
  ] : [
    a.first ? <div className="gs-stack-sm"><span>Stop {a.name}’s Gateway.</span><GsCopyBox text={a.first} label="The command to stop the Gateway" /></div> : 'Run the command.',
    ...(a.first ? [<div className="gs-stack-sm"><span>Run this command.</span><GsCopyBox text={a.cmd(GS.link)} label="The command to run" /></div>] : []),
    a.login ? <div className="gs-stack-sm"><span>Run this to sign in, then open the link it prints.</span><GsCopyBox text={a.login} label="The sign-in command" /></div>
      : 'Open the link it prints, and ' + GS_SIGN_IN,
    ...(a.remote ? ['On a remote machine, copy the address the browser ends on back into the terminal.'] : []),
    // Hermes's docs: its wait for sign-in can run out before the player finishes; its login command waits longer.
    ...(a.retry ? [<div className="gs-stack-sm"><span>If the sign-in times out, run this, then open the link it prints.</span><GsCopyBox text={a.retry} label="The sign-in command" /></div>] : []),
    ...(a.last ? [<div className="gs-stack-sm"><span>Start {a.name}’s Gateway again.</span><GsCopyBox text={a.last} label="The command to start the Gateway" /></div>] : []),
  ]),
  gsPermStep(a),
];

// Setup: one CardRow, its heading the section's and its sentence asking for the app; the picked app's card under it.
// KEEP: the tiles fill the row when all fit (about 700px and up); narrower, about 4½ show and the row swipes, with Previous
// and Next, so the half tile says there is more. Every tile keeps its name at every width: our own marks don't name the app
// (the user, 2026-11-11: "we can't lose the words anymore"). A tile picked while partly off the row's edge scrolls fully into view. The card's notch points at the picked tile and
// follows it as the row scrolls, and hides once that tile is out of view. Pressing the picked tile again closes the card and
// leaves no tile picked; the page opens with the first app picked.
const gsRevealTile = (el) => {
  const tr = el.parentElement, r = el.getBoundingClientRect(), b = tr.getBoundingClientRect();
  const d = r.left < b.left ? r.left - b.left - 4 : r.right > b.right ? r.right - b.right + 4 : 0;
  const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (d) tr.scrollBy({ left: d, behavior: still ? 'auto' : 'smooth' });
};
const GsSetup = () => {
  const gs = useGs();
  const [tile, setTile] = React.useState('chatgpt');
  const [sub, setSub] = React.useState('grok');
  const t = gsApp(tile || 'chatgpt'); const a = gsApp(t.subs ? sub : t.id);
  const [copyLabel, copyText] = gsAppCopy(a);
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
  // KEEP: no account sentence. The sign-in an AI app opens also offers sign-up, so a player with no account makes one while connecting (the user, 2026-11-11).
  const ask = 'Which app do you use?';
  return (
    <div className="gs-stack-md" ref={wrap}>
      <DS.CardRow title="Setup" sub={ask} label="Which app do you use?" className="hw-apps">
        {GS_APPS.filter((x) => !x.sub).map((x) => (
          <button key={x.id} type="button" className="hw-app" aria-pressed={tile === x.id} aria-expanded={tile === x.id} aria-controls="hw-pick" aria-label={x.name} onClick={(e) => { setTile(tile === x.id ? null : x.id); if (tile !== x.id) gsRevealTile(e.currentTarget); }}>
            <GsAiLogo ai={x.id} size={32} /><span>{x.tile || x.name}</span>
          </button>
        ))}
      </DS.CardRow>
      <div className="hw-pick" id="hw-pick" ref={card} aria-live="polite" hidden={!tile}>
        <i className="hw-notch" ref={notch} aria-hidden="true" />
        <DS.Card className="hw-pick-card">
          <div className="hw-pick-head">
            <h3 className="mcp-t-card"><span className="hw-soft">Add</span> After Pixels <span className="hw-soft">to</span> {a.id === 'other' ? 'your app' : a.name}</h3>
            {t.subs && (
              <div className="hw-seg" role="group" aria-label="Which Grok">
                {t.subs.map((id) => <DS.Button key={id} aria-pressed={sub === id} variant={sub === id ? 'main' : 'secondary'} onClick={() => setSub(id)}>{GS_SUB_LABEL[id]}</DS.Button>)}
              </div>
            )}
          </div>
          <div className="hw-pick-body">
            {/* An app with a first command (OpenClaw) has every command under the step that runs it, so it has no box up top. */}
            {!a.first && <div className="gs-stack-sm hw-pick-copy"><p className="gs-label hw-eyebrow">{copyLabel}</p><GsCopyBox text={copyText} label={copyLabel} address={a.route === 'settings'} what={a.route === 'settings' ? 'address' : a.route === 'chat' ? 'message' : 'command'} /></div>}
            <GsSteps items={gsAppSteps(a)} />
            {a.route === 'settings' && <p className="gs-small gs-muted">Don’t see {a.look ? <b>{a.look}</b> : 'this option'}? Not every plan or country offers it yet.</p>}
          </div>
        </DS.Card>
      </div>
    </div>
  );
};

// Start: two chat windows in one CardRow. The first types "Play After Pixels" and the AI lists the games; the second types
// "Play Delve on After Pixels" and Delve opens. The replies are examples of what the AI sends: the game rows and their tags
// are the deployed catalogue's; Delve's run is the product page's made-up edition.
// KEEP: from 640px the two pictures share the row equally, side by side;
// narrower, the CardRow scrolls sideways with the next chat peeking. The row's own Previous and Next move it.
// KEEP: each picture opens on its first turn, the typed line (ChatPicture start="top"), at the system's height, and scrolls to the reply.
// KEEP: each chat's typed line is a copying SpeechBubble; the chat itself is inert, a picture.
// KEEP: these four are a picture of the games list, not the live one: the real reply lists every game with the player's progress (games_library), so the build takes the list from there.
const GS_START_GAMES = ['word', 'mystery', 'delve', 'salvage'];
// KEEP: Start's Delve chat plays the product page's made-up edition, Delve #5, The Labyrinth of Crete (gs-chats.jsx, delve's first two chats), never a live run: the shop voice gives away no edition's story (the user, 2026-11-11: take the product page's).
const GS_START_DELVE = {
  title: 'Delve #5: The Labyrinth of Crete',
  first: 'Every year King Minos of Crete makes Athens send young people to feed the Minotaur, a monster half man and half bull, kept in a maze called the Labyrinth.',
  rest: ' This year you are one of them.',
  heroes: [{ name: 'Leon', line: 'Wrestler' }, { name: 'Ione', line: 'Bull-leaper' }, { name: 'Mira', line: 'Temple scholar' }],
  more: [
    { from: 'user', text: 'Ione' },
    { from: 'ai', text: 'You are Ione, a bull-leaper, quick and light and very hard to hit.' },
    { from: 'user', text: 'I wait for a gap in the moving walls, then dart through' },
    { from: 'ai', text: 'You watch the stone slide and pick your gap. You dart for it, but it’s the wrong one. A wall swings shut and catches you across the ribs.', after: [{ type: 'roll', label: 'Agility', roll: 7, mod: 3, target: 12, result: 'miss', outcome: 'Failure · 4 damage' }, { type: 'track', items: [{ label: 'Ione’s health', value: 17, max: 21, tone: 'health' }] }] },
    { from: 'user', text: 'I try again and spend my inspiration' },
    { from: 'ai', text: 'The stone shudders and then stops, with a straight path laid down the hall.', after: [{ type: 'roll', label: 'Agility', roll: 15, mod: 3, target: 12, result: 'hit', outcome: 'Success · inspiration spent' }] },
  ],
};
const gsStartTag = (g) => {
  const t = g.tags[0];
  // The user, 2026-11-10/11: Pass and the first-run chip alike, filled, no lock and no arrow; Free outlined.
  return t === 'FREE' ? <DS.Tag kind="free">Free</DS.Tag> : <DS.Tag kind="open" go={false}>{t === 'FIRST' ? 'First ' + g.ed[0] + ' free' : 'Pass'}</DS.Tag>;
};
// Each chat is the design system's ChatPicture, light as everywhere else, in a CardRow kind="chat" with its caption under it.
// The two overlays on it: the typed line is a copying SpeechBubble (edge, for the light ground) in place of ChatPicture's own
// user message, and each game's art is canon's, cropped square by the menu row.
const gsTyped = (say) => <GsCopyBubble wrap edge>{say}</GsCopyBubble>;
const GsStartChat = ({ title, say, turns, caption }) => (
  <figure className="mcp-chatfig hw-chatfig">
    <h3 className="mcp-t-card">{title}</h3>
    <DS.ChatPicture start="top" turns={[{ from: 'user', text: gsTyped(say) }, ...turns]} label={title + ' ' + say} />
    <figcaption>{caption}</figcaption>
  </figure>
);
const GsStart = () => {
  const gs = useGs();
  const d = GS_START_DELVE;
  return (
    <>
      <DS.CardRow kind="chat" title="Start" className="hw-start">
        <GsStartChat title="In any chat, type" say={gsPromptText({ kind: 'games' })}
          caption={<>Your AI shows you the games, and you pick one to play. <button type="button" className="gs-inlink" onClick={() => gs.go('games')}>See the games</button></>}
          turns={[{ from: 'ai', text: 'Here are today’s games. Pick one, or type a game’s name.', after: [{ type: 'menu', label: 'Today’s games', items: GS_START_GAMES.map((gid) => {
            const g = GS_GAMES[gid];
            return { name: g.name, line: g.blurb, art: GS_ART[g.art].svg, meta: gsStartTag(g) };
          }) }] }]} />
        <GsStartChat title="To go straight to one, type" say={gsPromptText({ kind: 'game', gid: 'delve' })}
          caption={<>Name a game, or a past edition, and your AI starts it. <button type="button" className="gs-inlink" onClick={() => gs.go(GS_GAMES.delve.route)}>Go to Delve</button></>}
          turns={[{ from: 'ai', text: [<b>{d.title}</b>, d.first + d.rest], after: [{ type: 'entities', items: d.heroes, className: 'hw-heroes' }] }, ...d.more]} />
      </DS.CardRow>
      <p className="hw-chg"><GsAgainGlyph /><span>Change games whenever you like. In a new chat, type <b>Play After Pixels</b> again to pick up an unfinished game where you left off.</span></p>
    </>
  );
};
// The change-games line's mark, drawn like the system's line icons (1.75 stroke, square caps, mitred joins).
const GsAgainGlyph = () => (
  <svg className="mcp-ico hw-chg-ic" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M19 12a7 7 0 1 1-2.1-5" /><path d="M17.5 3v4.2h-4.2" />
  </svg>
);

// Playing: a game from start to end, one StepCard a step, each with its still picture.
const GS_HW_PLAY = [
  ['Pick a game', 'Choose from your AI’s list, or ask by name.'],
  ['Play in the chat', 'Tell your AI your move. The game plays it out.'],
  ['Stop any time', 'Your game saves as you go. Come back later and carry on.'],
  ['Finish & share', 'The game keeps your record. Share it, or pick another game.'],
];

// ---- The page's top: the first thing a visitor lands on, so it shows the games rather than describing them. ----
// A band of game covers with the phrase to copy on it. No links: Setup follows straight after.
// KEEP: no two neighbouring covers share a ground (forest, indigo, wine), across the repeat too; the first three are what a phone shows, so they lead with the strongest (Guess, Delve either side of the bubble).
const GS_TOP_ART = ['word', 'escape', 'delve', 'casebook', 'where', 'barrow', 'derelict', 'hunter', 'murder'];
// KEEP: the band is one row of square covers, as many as fit; the row is cut at its edge, never squeezed or wrapped.
const GsBandCovers = () => <span className="hw-band-covers" aria-hidden="true">{[...GS_TOP_ART, ...GS_TOP_ART].map((a, i) => GS_ART[a] ? <span key={i} className="hw-band-cover" dangerouslySetInnerHTML={{ __html: GS_ART[a].svg }} /> : null)}</span>;
const GsTop = () => (
  <header className="hw-top2">
    <h1 className="gs-h1">How it works</h1>
    <p className="gs-lead">Add <b>After Pixels</b> once to ChatGPT, Claude or another AI app. Then, in any chat, type</p>
    <div className="hw-band">
      <span className="hw-band-games"><GsBandCovers /><span className="hw-band-on"><GsCopyBubble>{gsPromptText({ kind: 'games' })}</GsCopyBubble></span></span>
    </div>
    <p className="hw-t-after">Pick a game, and your AI plays it with you.</p>
  </header>
);
export const GsConnect = () => {
  const gs = useGs();
  return (
    <main className="gs-wrap gs-main">
      <GsTop />

      <section id="hw-setup" className="hw-sec">
        <GsSetup />
      </section>
      <section id="hw-start" className="hw-sec gs-stack-md">
        <GsStart />
      </section>
      <section id="hw-playing" className="hw-sec gs-stack-md">
        <h2 className="mcp-t-sec" tabIndex={-1}>Playing</h2>
        <DS.StepCards>
          {GS_HW_PLAY.map(([title, line], i) => <DS.StepCard key={title} art={<img src={'assets/how-it-works/step-' + (i + 1) + '.svg'} alt="" />} title={title} line={line} />)}
        </DS.StepCards>
        {/* The editions sentence and the Pass sentence stay in one paragraph: the first alone reads as all free. */}
        <p className="hw-more">Fresh games daily and weekly, and every past edition is there to play. Some games are free, and others give you their first edition free. Everything else comes with <button type="button" className="gs-inlink" onClick={() => gs.go('pass')}>the Pass</button>.</p>
      </section>
      <section className="hw-sec gs-stack-md" aria-labelledby="hw-who">
        <h2 id="hw-who" className="mcp-t-sec">Who does what</h2>
        <DS.Card className="hw-who">
          <div className="hw-who-row"><h3 className="mcp-t-card">Your AI</h3><p className="gs-muted">Your AI does the talking, and the game relies on it to pass each move on accurately. If your app lets you choose a model, a mid-range one does that reliably. The lightest may lose track of the game, and the top ones aren’t needed.</p></div>
          <div className="hw-who-row"><h3 className="mcp-t-card">The game engine</h3><p className="gs-muted">The game sets the rules, throws the dice and keeps your record. If your AI ever says otherwise, the game’s record is the one that counts.</p></div>
        </DS.Card>
        <p className="gs-small">Your AI never asks you to pay. Playing uses your own AI plan and counts towards its usage limits. We never charge for that usage.</p>
      </section>
      <div className="gs-band">
        <div className="gs-grid2">
          <section className="gs-stack-sm"><h2 className="mcp-t-card">Disconnecting</h2><p className="gs-muted">To disconnect, remove <b>After Pixels</b> where you added it. Your results and history stay in your account.</p></section>
          <section className="gs-stack-sm"><h2 className="mcp-t-card">Help</h2><p className="gs-muted">Stuck? Write to <a href={'mailto:' + GS_SUPPORT}>{GS_SUPPORT}</a> and tell us which app you use.</p></section>
        </div>
      </div>
    </main>
  );
};
