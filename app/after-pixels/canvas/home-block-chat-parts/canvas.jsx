// ============================================================================
// Hi-fi canvas: the new chat parts of After Pixels' signed-out homepage block, drawn with the design system's components, then the
// block assembled at phone, tablet and desktop. Four sections: the reply bar with Start free, the game card inside the chat (phone),
// the tabs at three widths, the assembled block. Shapes only: game data is rough and nothing here is ruled. The low-fi shape it takes to
// hi fi is round 12 of the homepage block (concept 1, Mobile first). Canon's app runs underneath (its candidate hook renders this canvas
// in place of the page), so canon's CSS, data and design-system bundle are the real ones.
// ============================================================================
import './candidate.js';
import '../../canon/app/main.jsx';
import React from 'react';
import { DS, gsWordLines } from '../../canon/app/gs-data.jsx';
import { GsArt } from '../../canon/app/gs-parts.jsx';
import { WdBoard } from '../../canon/app/gs-word.jsx';
import { chatTurn, chatShell } from '../../design-system/components/media/ChatPicture.jsx';
import './canvas.css';

const MARK = 'logo.svg';
const BY = 'After Pixels';

// The block's words are the user's, verbatim (the task's Goal). The chat lines are rough sample game data from the low-fi round.
const HEADING = 'Your AI, cast for each game.';
const SENTENCE = 'Step into a story, crack a puzzle or talk through a mystery.';
const GAMES = [
  { id: 'delve', name: 'Delve', part: 'Game Master', intro: 'It sets each scene, plays everyone you meet and asks what you do next.' },
  { id: 'guess', name: 'Guess', part: 'Host', intro: 'It shows how each guess scored and keeps a hint back until you want it.' },
  { id: 'accuse', name: 'Accuse', part: 'Thinking partner', intro: 'Stuck? Ask, and it turns the case into smaller questions. The deduction stays yours.' },
];
const U = (text) => ({ from: 'user', text });
const A = (tool, text, blocks) => ({ from: 'ai', tool, text, blocks });
const CHAT = {
  delve: [
    A('Delve', 'Cold air breathes from the warren’s mouth. Two sentries bicker over dice. “Who goes there?” one growls, not looking up.'),
    U('I slip past while they argue'),
    A('Delve', null, [{ type: 'roll', label: 'Agility', roll: 14, mod: 1, target: 12, result: 'hit', outcome: 'Success' }]),
    A('Delve', 'The dice clatter and neither looks up. You are through. The tunnel forks, and a voice in the dark mutters, “Left smells of smoke.” What do you do, Garrick?'),
  ],
  guess: [
    { ...A('Guess', 'Two down, four to go. What’s your next word?'), wide: true },
    U('STAIN'),
    A('Guess', 'So close. S is home, and T, A, I and N are all in the word, just not there. Three guesses left.'),
  ],
  accuse: [
    U('I’m stuck on all of it. Help me think?'),
    { ...A('Accuse', 'The whole case is three smaller questions: where, with what, and who. Which one first?'), wide: true },
    { ...U('where'), wide: true },
    A('Accuse', 'Which of the clues mention a place? Tell me what each one rules out, and I’ll read any of them back.'),
  ],
};
// Where the game card sits on a phone: Delve's opens the chat; Guess's and Accuse's sit just above the AI's newest message.
const cardAt = (id, n) => (id === 'delve' ? 0 : n - 1);

// ---- Game views. The same three as a card inside the chat (phone) or beside it (tablet, desktop). ----
const WORD = { answer: 'STILL', lines: gsWordLines('STILL', ['CRANE', 'SLATE', 'STAIN']) };
const NB_ICONS = {
  scene: 'M3 21h18M5 21V10l7-6 7 6v11M10 21v-5h4v5',
  suspects: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 21c0-4 3.4-6 7.5-6s7.5 2 7.5 6',
  weapons: 'M5 19L17 7M14 4l6 6M4 20l2-2',
  places: 'M6 21V3.5h12V21M3.5 21h17M14.5 12.5h.01',
  hints: 'M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3zM9.5 19h5M10.5 21.5h3',
};
const CLUES = ['Whoever carried the snow shovel was not in the games room.', 'The killer was in the cable car hut.', 'Anneliese Berger was not in the great hall.',
  'Anneliese Berger carried the snow shovel.', 'Rick Dawson was in the cellar bar.'];
// A still of canon's Accuse notebook (gs-accuse.jsx AccNotebook, which canon does not export): the same classes, so the session page's theme draws it.
// The Clues tab is open on its chips and one clue read.
const NotebookStill = ({ chips, reader }) => {
  const tabs = [['scene', 'Setting', ' '], ['suspects', 'Suspects', ' '], ['weapons', 'Weapons', ' '], ['places', 'Places', ' '], ['clues', 'Clues', 5], ['hints', 'Hints', 0]];
  return (
    <section className="dv4 esx-sheet acc-nb" aria-label="Notebook">
      <span className="gs-sc-cap">Notebook</span>
      <div className="acc-tabs" role="tablist" data-open="y">{tabs.map(([k, head, n]) => (
        <button key={k} type="button" role="tab" aria-selected={k === 'clues'} disabled={n === 0} className={'acc-tab' + (k === 'clues' ? ' is-open' : '')}>
          <span className="acc-tl">{k === 'clues' ? <span className="esx-mk" aria-hidden="true"><i className="esx-slip" /></span>
            : <span className="esx-mk acc-ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter"><path d={NB_ICONS[k]} /></svg></span>}
            <span className="acc-tn">{head}</span></span>
          <b className="esx-num">{n}</b>
        </button>))}</div>
      <div className="acc-folder" role="tabpanel" aria-label="Clues">
        <span className="acc-fh">Clues</span>
        <div className="esx-chips">{CLUES.slice(0, chips).map((c, i) => (
          <button key={i} type="button" className="esx-chip" aria-expanded={i === 1}><span className="esx-mk" aria-hidden="true"><i className="esx-slip" /></span><b>Clue {i + 1}</b></button>))}</div>
        {reader && <div className="esx-read"><span className="esx-nm"><b>Clue 2</b></span><p className="esx-tx">{CLUES[1]}</p></div>}
      </div>
    </section>);
};
// KEEP: Delve's picture is the scene art with a small caption row under it: the place, then the hero and HP.
const GameView = ({ game, where }) => {
  if (game === 'delve') {
    return (
      <div className={'dv4 hb-gv hb-gv-delve is-' + where}>
        <GsArt art="delve" shape={where === 'chat' ? 'wide' : 'banner'} />
        <div className="hb-cap"><span>Delve · The Warren</span><span>Garrick · 14 HP</span></div>
      </div>);
  }
  if (game === 'guess') {
    return <div className={'dv4 hb-gv hb-gv-guess is-' + where} style={{ '--t': where === 'chat' ? '40px' : '46px', '--g': '5px' }}><WdBoard s={WORD} /></div>;
  }
  return <div className={'hb-gv hb-gv-accuse is-' + where}><NotebookStill chips={where === 'chat' ? 4 : 5} reader={where !== 'chat'} /></div>;
};

// ---- NEW: the reply bar. The chat's own reply box (.mcp-chat-comp) with the design system's Button as its send button, reading "Start free". ----
const ReplyBar = () => (
  <div className="mcp-chat-comp hb-reply" role="group" aria-label="Reply">
    <span>Reply</span>
    <DS.Button>Start free</DS.Button>
  </div>);

// ---- The chat: the design system's chat window (chatShell) and turns (chatTurn) with the reply bar under it. On a phone the game card is one of the chat's own items. ----
const Chat = ({ game, size }) => {
  const body = React.useRef(null);
  const phone = size === 'phone';
  const turns = CHAT[game].filter((t) => phone ? !t.wide : true);
  const at = cardAt(game, turns.length);
  const items = turns.map((t, i) => chatTurn(t, i, { mark: MARK, toolBy: BY }));
  if (phone) items.splice(at, 0, <div key="card" className="hb-cin"><GameView game={game} where="chat" /></div>);
  // Behaviour the page cannot show: the chat opens at its top for Delve, whose scene art opens it, and at its newest message for the others.
  React.useEffect(() => { const b = body.current; if (b) b.scrollTop = phone && game === 'delve' ? 0 : b.scrollHeight; }, [game, size]);
  return chatShell({ bodyRef: body, body: items, up: false, toStart: () => {}, height: phone ? 440 : undefined, width: 2000, fill: !phone,
    label: game + ' being played in a chat', more: 'Back to the start', className: 'hb-chat', comp: <ReplyBar /> });
};

// ---- NEW: the tabs. The three games in a fixed order; the open one is the dark one and holds the part's name, the intro and "See <game> ›". ----
// All three intros sit in one grid cell with only the open one showing, so the open tab is as tall as the longest and the block never changes height on a tap.
const Intro = ({ open }) => (
  <div className="hb-ins">{GAMES.map((g) => (
    <div key={g.id} className={'hb-intro' + (g.id === open ? '' : ' is-ghost')} aria-hidden={g.id === open ? undefined : true}>
      <p>{g.intro}</p>
      <DS.TextLink href="#" tabIndex={g.id === open ? 0 : -1}>See {g.name} ›</DS.TextLink>
    </div>))}</div>);
const Tabs = ({ open, size }) => (
  <div className={'hb-tabs is-' + size} role="tablist" aria-label="Games">
    {GAMES.map((g) => {
      const on = g.id === open;
      return (
        <div key={g.id} className={'hb-tab' + (on ? ' is-open' : '')}>
          <button type="button" role="tab" aria-selected={on} className="hb-tab-b"><small>{g.name}</small><b>{g.part}</b></button>
          {on && size !== 'phone' && <Intro open={open} />}
        </div>);
    })}
    {size === 'phone' && <div className="hb-strip"><Intro open={open} /></div>}
  </div>);

// ---- The block: heading and sentence, the tabs, and the stage (game view beside the chat; on a phone the chat alone). ----
const Block = ({ open, size }) => (
  <section className={'hb is-' + size} aria-label="Your AI, cast for each game">
    <DS.Heading level="section">{HEADING}</DS.Heading>
    <p className="hb-lead">{SENTENCE}</p>
    <div className="hb-set">
      <Tabs open={open} size={size} />
      <div className="hb-stage">
        {size !== 'phone' && <div className="hb-side"><GameView game={open} where="side" /></div>}
        <div className="hb-talk"><Chat game={open} size={size} /></div>
      </div>
    </div>
  </section>);

// ---- Canvas furniture ----
// A part drawn at its real width. Where the page is narrower, the frame is scaled down to fit, never scrolled (the scale is measured by script).
const Scaled = ({ w, children, className = '' }) => {
  const outer = React.useRef(null); const inner = React.useRef(null);
  const [k, setK] = React.useState(1); const [h, setH] = React.useState(0);
  React.useLayoutEffect(() => {
    const fit = () => { setK(Math.min(1, outer.current.clientWidth / w)); setH(inner.current.offsetHeight); };
    fit(); const ro = new ResizeObserver(fit); ro.observe(outer.current); ro.observe(inner.current); return () => ro.disconnect();
  }, [w]);
  return (
    <div ref={outer} className="cv-scaled" style={{ maxWidth: w, height: h * k || undefined }}>
      <div ref={inner} className={'cv-frame gs ' + className} style={{ width: w, transform: 'scale(' + k + ')' }}>{children}</div>
    </div>);
};
const Fig = ({ cap, children, w, className }) => (
  <figure className="cv-fig" style={{ maxWidth: w }}>
    <figcaption className="cv-cap">{cap}</figcaption>
    <Scaled w={w} className={className}>{children}</Scaled>
  </figure>);
const NewTag = () => <span className="cv-new"><DS.Tag kind="daily">New to the design system</DS.Tag></span>;
const Section = ({ n, title, note, isNew, children }) => (
  <section className="cv-sec" aria-labelledby={'cv-' + n}>
    <h2 id={'cv-' + n} className="cv-h"><span className="cv-n">{n}</span>{title}{isNew && <NewTag />}</h2>
    <p className="cv-note">{note}</p>
    {children}
  </section>);

// A chat window with two messages, for the reply bar on its own.
const BarInChat = ({ width }) => (
  <div className="hb-solo" style={{ width }}>
    <div className="mcp-chat hb-chat" role="group" aria-label="A chat with the reply bar">
      <div className="mcp-chat-body" style={{ height: 210 }}>{[
        chatTurn(CHAT.guess[1], 0, { mark: MARK, toolBy: BY }),
        chatTurn(CHAT.guess[2], 1, { mark: MARK, toolBy: BY }),
      ]}</div>
      <ReplyBar />
    </div>
  </div>);

const Canvas = () => (
  <main className="cv">
    <h1 className="cv-title">Homepage block: new chat parts</h1>
    <p className="cv-note cv-intro">Hi-fi shapes of the parts the new block brings, drawn with the design system and canon’s session-page themes. Game data is rough. Wide parts are drawn at their real width and scaled down to fit a small screen.</p>
    <p className="cv-note cv-intro"><NewTag /> marks a part the design system does not have yet.</p>

    <Section n="1" title="The reply bar" isNew note="A reply field under the conversation, in the chat. Its send button reads “Start free”.">
      <div className="cv-row">
        <Fig cap="In a chat at phone width, 390px" w={390}><div className="hb-pad"><BarInChat width="100%" /></div></Fig>
        <Fig cap="Beside a game view, 440px" w={440}><div className="hb-pad"><BarInChat width="100%" /></div></Fig>
        <Fig cap="Narrowest phone, 320px" w={320}><div className="hb-pad"><BarInChat width="100%" /></div></Fig>
      </div>
    </Section>

    <Section n="2" title="The game card inside the chat, phone" isNew note="On a phone the game’s own view is a card in the conversation. Delve’s scene opens the chat; Guess’s board and Accuse’s notebook sit just above the AI’s newest message.">
      <div className="cv-row">
        {GAMES.map((g) => (
          <Fig key={g.id} cap={g.name + ' · ' + (g.id === 'delve' ? 'scene art opens the chat' : g.id === 'guess' ? 'board above the newest message' : 'notebook above the newest message')} w={390}>
            <div className="hb-pad"><Chat game={g.id} size="phone" /></div>
          </Fig>))}
      </div>
    </Section>

    <Section n="3" title="The tabs" isNew note="The three games in a fixed order. The open one is the dark one: it holds the part’s name, the intro and “See <game> ›”. The others are closed. Each game open, at each width.">
      <h3 className="cv-sub">Desktop · a column on the left, the open one wrapping the others</h3>
      <div className="cv-row">
        {GAMES.map((g) => <Fig key={g.id} cap={g.name + ' open'} w={300}><Tabs open={g.id} size="desktop" /></Fig>)}
      </div>
      <h3 className="cv-sub">Tablet · a row, the open one wide, the others square at a fixed width</h3>
      <div className="cv-col">
        {GAMES.map((g) => <Fig key={g.id} cap={g.name + ' open'} w={768}><Tabs open={g.id} size="tablet" /></Fig>)}
      </div>
      <h3 className="cv-sub">Phone · three equal tabs, the open one dark, its intro in a dark strip under the row</h3>
      <div className="cv-row">
        {GAMES.map((g) => <Fig key={g.id} cap={g.name + ' open'} w={390}><Tabs open={g.id} size="phone" /></Fig>)}
      </div>
    </Section>

    <Section n="4" title="The block assembled" note="One game open at each width: Delve at desktop, Guess at tablet, Accuse at phone. At tablet and desktop the game view sits beside the chat; on a phone it is inside the chat.">
      <div className="cv-col">
        <Fig cap="Desktop · 1200px · Delve open" w={1200}><Block open="delve" size="desktop" /></Fig>
        <Fig cap="Tablet · 768px · Guess open" w={768}><Block open="guess" size="tablet" /></Fig>
        <Fig cap="Phone · 390px · Accuse open" w={390}><Block open="accuse" size="phone" /></Fig>
      </div>
    </Section>
  </main>);

window.KitCandidate.Screen = Canvas;
