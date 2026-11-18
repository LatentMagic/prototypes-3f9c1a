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
import { DS } from '../../canon/app/gs-data.jsx';
import { chatTurn, chatShell } from '../../design-system/components/media/ChatPicture.jsx';
import { TileGrid } from '../../design-system/components/chat/TileGrid.jsx';
import { ClueCards } from '../../design-system/components/chat/ClueCards.jsx';
import './canvas.css';

const MARK = 'logo.svg';
const BY = 'After Pixels';
const WARREN = 'delve-warren.svg';

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
// What the AI itself draws in each game's turn: Delve a picture of the scene, Guess the board, Accuse the clues it is talking about.
const BOARD = { type: 'tilegrid', length: 5, count: 6, rows: [{ letters: 'CRANE', marks: 'xxxxx' }, { letters: 'SLATE', marks: 'hnxnx' }, { letters: 'STAIN', marks: 'hhxnx' }] };
const CLUE_GROUPS = [{ kind: 'Statements', facts: ['Whoever carried the snow shovel was not in the games room.', 'The killer was in the cable car hut.', 'Rick Dawson was in the cellar bar.'] }];
const CHAT = {
  delve: [
    A('Delve', 'Cold air breathes from the warren’s mouth. Two sentries bicker over dice. “Who goes there?” one growls, not looking up.'),
    U('I slip past while they argue'),
    A('Delve', null, [{ type: 'roll', label: 'Agility', roll: 14, mod: 1, target: 12, result: 'hit', outcome: 'Success' }]),
    A('Delve', 'The dice clatter and neither looks up. You are through. The tunnel forks, and a voice in the dark mutters, “Left smells of smoke.” What do you do, Garrick?'),
  ],
  guess: [
    A('Guess', 'Two down, four to go. What’s your next word?'),
    U('STAIN'),
    A('Guess', 'So close. S and T are home, and I is in the word, just not there. Three guesses left.', [BOARD]),
  ],
  accuse: [
    U('I’m stuck on all of it. Help me think?'),
    A('Accuse', 'The whole case is three smaller questions: where, with what, and who. Which one first?'),
    U('where'),
    { ...A('Accuse', 'These three clues name a place. What does each one rule out?'), after: [{ type: 'clues', groups: CLUE_GROUPS }] },
  ],
};

// A turn without the pieces it draws (the board, the clues): where the game sits beside the chat, or where the chat stands alone, the pieces are not repeated in it.
const plain = (t) => ({ ...t, blocks: t.blocks && t.blocks.filter((b) => b.type !== 'tilegrid'), after: t.after && t.after.filter((b) => b.type !== 'clues') });

// ---- NEW: a picture in the AI's turn. Delve's scene drawn flat on the chat's surface, with its small caption (place, then hero and HP). ----
const Pic = () => (
  <figure className="hb-pic">
    <img src={WARREN} alt="A tunnel in the warren that forks" />
    <figcaption><span>The Warren</span><span>Garrick · 14 HP</span></figcaption>
  </figure>);
// The AI's first turn on a phone: it calls Delve and shows the scene, which opens the chat.
const PicTurn = () => (
  <div className="mcp-chat-ai hb-pic-turn">
    <span className="mcp-chat-call"><img src={MARK} alt="" width="16" height="16" />Called Delve<em>{BY}</em></span>
    <Pic />
  </div>);
// The same pieces beside the chat (tablet and desktop), on the chat's own surface: one answer for how a game looks wherever it appears.
const Side = ({ game }) => (
  <div className="mcp-chat hb-sidebox">
    {game === 'delve' && <Pic />}
    {game === 'guess' && <TileGrid {...BOARD} />}
    {game === 'accuse' && <ClueCards groups={CLUE_GROUPS} />}
  </div>);

// ---- NEW: the reply bar. The chat's own reply box (.mcp-chat-comp) with the design system's Button as its send button, reading "Start free". ----
const ReplyBar = () => (
  <div className="mcp-chat-comp hb-reply" role="group" aria-label="Reply">
    <span>Reply</span>
    <DS.Button>Start free</DS.Button>
  </div>);

// ---- The chat: the design system's chat window (chatShell) and turns (chatTurn) with the reply bar under it. It always opens at its top. ----
const Chat = ({ game, size }) => {
  const body = React.useRef(null);
  const phone = size === 'phone';
  const pic = phone && game === 'delve';
  const items = CHAT[game].map((t, i) => chatTurn(pic && i === 0 ? { ...t, tool: undefined } : phone ? t : plain(t), i, { mark: MARK, toolBy: BY }));
  if (pic) items.unshift(<PicTurn key="pic" />);
  // Behaviour the page cannot show: every chat opens scrolled to its top.
  React.useEffect(() => { if (body.current) body.current.scrollTop = 0; }, [game, size]);
  return chatShell({ bodyRef: body, body: items, up: false, toStart: () => {}, start: 'top', height: phone ? 440 : undefined, width: 2000, fill: !phone,
    label: game + ' being played in a chat', more: 'Back to the start', className: 'hb-chat', comp: <ReplyBar /> });
};

// ---- NEW: the tabs. The three games in a fixed order, as plain cells on the block's ground divided by hairlines; the open one is marked by a bright edge and holds the part's name, the intro and "See <game> ›". ----
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
        {size !== 'phone' && <div className="hb-side"><Side game={open} /></div>}
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
        chatTurn(plain(CHAT.guess[2]), 1, { mark: MARK, toolBy: BY }),
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

    <Section n="2" title="The game inside the chat, phone" isNew note="On a phone the game shows up as the AI would draw it in its reply, on the chat’s own surface. Delve’s scene opens the chat. Guess’s board and Accuse’s clues come with the AI’s newest reply. Every chat opens at its top.">
      <div className="cv-row">
        {GAMES.map((g) => (
          <Fig key={g.id} cap={g.name + ' · ' + (g.id === 'delve' ? 'a picture of the scene opens the chat' : g.id === 'guess' ? 'the board in the AI’s reply' : 'the clues in the AI’s reply')} w={390}>
            <div className="hb-pad"><Chat game={g.id} size="phone" /></div>
          </Fig>))}
      </div>
    </Section>

    <Section n="3" title="The tabs" isNew note="The three games in a fixed order, as plain cells divided by hairlines. The open one has a bright edge and holds the part’s name, the intro and “See <game> ›”. The others are closed. Each game open, at each width.">
      <h3 className="cv-sub">Desktop · a column on the left, the open one between the others</h3>
      <div className="cv-row">
        {GAMES.map((g) => <Fig key={g.id} cap={g.name + ' open'} w={300}><div className="hb-set is-solo"><Tabs open={g.id} size="desktop" /></div></Fig>)}
      </div>
      <h3 className="cv-sub">Tablet · a row, the open one wide, the others at a fixed width</h3>
      <div className="cv-col">
        {GAMES.map((g) => <Fig key={g.id} cap={g.name + ' open'} w={768}><div className="hb-set is-solo"><Tabs open={g.id} size="tablet" /></div></Fig>)}
      </div>
      <h3 className="cv-sub">Phone · three equal tabs, the open one marked, its intro in a strip under the row</h3>
      <div className="cv-row">
        {GAMES.map((g) => <Fig key={g.id} cap={g.name + ' open'} w={390}><div className="hb-set is-solo"><Tabs open={g.id} size="phone" /></div></Fig>)}
      </div>
    </Section>

    <Section n="4" title="The block assembled" note="One game open at each width: Delve at desktop, Guess at tablet, Accuse at phone. One surface: the tabs sit on the page’s dark ground, and the game and the chat share the chat’s light surface. At tablet and desktop the same picture the AI draws sits beside the chat; on a phone it is in the chat.">
      <div className="cv-col">
        <Fig cap="Desktop · 1200px · Delve open" w={1200}><Block open="delve" size="desktop" /></Fig>
        <Fig cap="Tablet · 768px · Guess open" w={768}><Block open="guess" size="tablet" /></Fig>
        <Fig cap="Phone · 390px · Accuse open" w={390}><Block open="accuse" size="phone" /></Fig>
      </div>
    </Section>
  </main>);

window.KitCandidate.Screen = Canvas;
