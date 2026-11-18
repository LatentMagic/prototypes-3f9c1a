// ============================================================================
// After Pixels — Home (screen 1). GsHome is replaced by gs-pass-home.jsx (CprHome); GsWhatsNew, GsFeature and
// GS_HOME_GAMES are still read. The Pass page is in gs-pass-pricing.jsx.
// ============================================================================
import React from 'react';
import { DS, GS_GAMES, useGs } from './gs-data.jsx';
import { GsCard } from './gs-pass-home.jsx';
import { chatTurn, chatShell } from '../../design-system/components/media/ChatPicture.jsx';
import { TileGrid } from '../../design-system/components/chat/TileGrid.jsx';
import { ClueCards } from '../../design-system/components/chat/ClueCards.jsx';
import { GS_CHAT_MARK, GS_CHAT_BY } from './gs-chats.jsx';

export const GsFeature = ({ id }) => <GsCard id={id} />;
// NOTE: Available games is NOT meant to hold every game. It is a small, chosen sample so a visitor gets a sense
// of what exists; the whole library is on Discover. A game is added to GS_HOME_GAMES only on the owner's approval: that row is what we highlight.
// It already holds too much and needs revisiting.
export const GS_HOME_GAMES = ['word', 'mystery', 'escape', 'delve', 'barrow', 'hunter'];
// More games on each game's product page is its own list, the ratified launch games, minus the page's own game (gs-game.jsx).
export const GS_MORE_GAMES = ['word', 'chain', 'salvage', 'mystery', 'common', 'where', 'delve'];

// ============================================================================
// The homepage block under Available games: three sample chats, one open at a time, each showing what the AI is for in that game.
// Every sample is an invented, golden chat (never a real edition's): Delve is Delve #40, The Orc Caves under Raven Hill.
// ============================================================================
const HB_HEADING = 'Your AI, cast for each game.';
const HB_SENTENCE = 'Step into a story, crack a puzzle or talk through a mystery.';
const HB_U = (text) => ({ from: 'user', text });
const HB_A = (tool, text, blocks, after) => ({ from: 'ai', tool, text, blocks, after });
const HB_PICTURE = 'assets/home-block-delve.svg';
const HB_TRACK = (advance) => ({ type: 'track', items: [{ label: 'Health', value: 23, max: 23, tone: 'health' }, { label: 'Orcs’ advance', value: advance, max: 12, tone: 'threat' }] });
const HB_BOARD = { type: 'tilegrid', length: 5, count: 6, rows: [{ letters: 'COILS', marks: 'hhxhx' }] };
// OPEN: what Accuse shows beside the chat is not designed. For now it shows the clues the chat talks about, as the chat-parts canvas did.
const HB_CLUES = [{ kind: 'Clues', facts: ['1. Madame Zara handled the brass bugle.', '2. Whoever handled the brass bugle was not in the costume tent.', '3. Coco was in the cook tent.', '4. Ivan the Mighty was in the generator truck.', '5. The killer was in the big top.'] }];
// The three tabs, in their fixed order, with their sample chats. The last turn of a chat types itself in. Swap a chat by replacing its turns.
const HB_GAMES = [
  { id: 'delve', gid: 'delve', part: 'Game Master', intro: 'It sets each scene, plays everyone you meet and asks what you do next.',
    turns: [
      HB_A('Delve', ['Dawn on the ridge above Brackenford. The watchtower burns, and orc tracks run up towards the caves under Raven Hill. A watchman lies pinned beneath an overturned cart.', '“Get this off me. Please.”', 'You can lift the cart with Strength, or follow the tracks to the caves. What do you do?'], [HB_TRACK(0)]),
      HB_U('I lift the cart.'),
      HB_A('Delve', ['You heave the cart up, and he drags his leg free.', '“They went up to the caves. Dozens of them.”', 'The tracks climb towards Raven Hill. What do you do?'], [{ type: 'roll', label: 'Strength', roll: 14, mod: 3, target: 12, result: 'hit', outcome: 'Success' }, HB_TRACK(0)]),
      HB_U('I follow the tracks.'),
      HB_A('Delve', ['The path climbs through the heather to a cave mouth. Two orcs sit by a fire at the entrance, arguing over a sack of grain.', 'You can creep past with Agility, or charge them with Strength. What do you do?'], [HB_TRACK(0)]),
    ] },
  { id: 'guess', gid: 'word', part: 'Host', intro: 'It shows how each guess scored and keeps a hint back until you want it.',
    turns: [
      HB_U('COILS'),
      HB_A('Guess', 'Three in place. Five guesses left. Your hint’s here when you want it.', [HB_BOARD]),
    ] },
  { id: 'accuse', gid: 'mystery', part: 'Thinking partner', intro: 'Stuck? Ask, and it turns the case into smaller questions. The deduction stays yours.',
    turns: [
      HB_U('I keep mixing up Coco, Zara and the weapons. Can we talk through the ringmaster’s murder?'),
      HB_A('Accuse', 'Which clue would you like to start with?', null, [{ type: 'clues', groups: HB_CLUES }]),
      HB_U('Clue 2. “Whoever handled the brass bugle was not in the costume tent.” I keep reading it backwards.'),
      HB_A(null, 'Let’s take that sentence in two parts. What does it tell you about where the person with the bugle was? What does it leave unanswered?'),
    ] },
];
// Where the game sits beside the chat (tablet and desktop), the chat does not repeat it: the board and the clues come out of its turns.
const hbPlain = (t) => ({ ...t, blocks: t.blocks && t.blocks.filter((b) => b.type !== 'tilegrid'), after: t.after && t.after.filter((b) => b.type !== 'clues') });

// The block's layout class follows its own width, so it holds wherever the page sits: phone below 560, tablet to 819, desktop from 820.
const useHbSize = (ref) => {
  const [size, setSize] = React.useState('desktop');
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return undefined;
    const read = () => { const w = el.getBoundingClientRect().width; setSize(w < 560 ? 'phone' : w < 820 ? 'tablet' : 'desktop'); };
    read(); const ro = new ResizeObserver(read); ro.observe(el); return () => ro.disconnect();
  }, []);
  return size;
};

const HbPic = () => <img className="hb-pic" src={HB_PICTURE} alt="A hero in armour on a ridge at dawn, a burning tower behind" />;
// Beside the chat (tablet and desktop) each game's side opens with its edition, in the same place for all three; a phone shows none.
const HB_EDITION = { delve: 'Delve #40', guess: 'Guess #34', accuse: 'Accuse #112' };
// What the AI draws for the game: beside the chat on tablet and desktop, inside it on a phone.
const HbSide = ({ game }) => (
  <div className="mcp-chat hb-sidebox">
    <p className="hb-ed">{HB_EDITION[game]}</p>
    {game === 'delve' && <HbPic />}
    {game === 'guess' && <TileGrid {...HB_BOARD} />}
    {game === 'accuse' && <ClueCards groups={HB_CLUES} />}
  </div>);
const HbReply = ({ onSend }) => (
  <div className="mcp-chat-comp hb-reply" role="group" aria-label="Reply">
    <span>Reply</span>
    <DS.Button onClick={onSend}>Start free</DS.Button>
  </div>);

const HbChat = ({ game, size, onSend }) => {
  const body = React.useRef(null); const phone = size === 'phone'; const g = HB_GAMES.find((x) => x.id === game);
  const turns = phone ? g.turns : g.turns.map(hbPlain);
  const pic = phone && game === 'delve';
  const items = turns.map((t, i) => chatTurn(pic && i === 0 ? { ...t, tool: undefined } : t, i, { mark: GS_CHAT_MARK, toolBy: GS_CHAT_BY }));
  // Delve opens a phone chat with the picture of the scene, the AI's own, with the call that made it.
  if (pic) items.unshift(
    <div key="pic" className="mcp-chat-ai hb-pic-turn"><span className="mcp-chat-call"><img src={GS_CHAT_MARK} alt="" width="16" height="16" />Called Delve<em>{GS_CHAT_BY}</em></span><HbPic /></div>);
  // KEEP: the chat is all there when shown (nothing types in) and opens at its top, whichever tab or width. The chat scrolls; the block never changes height.
  React.useEffect(() => { if (body.current) body.current.scrollTop = 0; }, [game, size]);
  return chatShell({ bodyRef: body, body: items, up: false, toStart: () => {}, start: 'top', height: phone ? 440 : undefined, width: 2000, fill: !phone,
    label: g.id + ' being played in a chat', more: 'Back to the start', className: 'hb-chat', comp: <HbReply onSend={onSend} /> });
};

// KEEP: all three intros share one grid cell and only the open one shows, so the open tab is as tall as the longest and nothing below it moves when a tab is tapped.
const HbIntro = ({ open, go }) => (
  <div className="hb-ins">{HB_GAMES.map((g) => (
    <div key={g.id} className={'hb-intro' + (g.id === open ? '' : ' is-ghost')} aria-hidden={g.id === open ? undefined : true}>
      <p>{g.intro}</p>
      <DS.TextLink onClick={() => go(GS_GAMES[g.gid].route)} tabIndex={g.id === open ? 0 : -1}>See {GS_GAMES[g.gid].name} ›</DS.TextLink>
    </div>))}</div>);
const HbTabs = ({ open, size, pick, go }) => (
  <div className={'hb-tabs is-' + size} role="tablist" aria-label="Games">
    {HB_GAMES.map((g) => {
      const on = g.id === open;
      return (
        <div key={g.id} className={'hb-tab' + (on ? ' is-open' : '')}>
          <button type="button" role="tab" aria-selected={on} className="hb-tab-b" onClick={() => pick(g.id)}><small>{GS_GAMES[g.gid].name}</small><b>{g.part}</b></button>
          {on && size !== 'phone' && <HbIntro open={open} go={go} />}
        </div>);
    })}
    {size === 'phone' && <div className="hb-strip"><HbIntro open={open} go={go} /></div>}
  </div>);

// Shades on trial for the closed tabs (?hbgrey=1, 2 or 3).
const HB_GREYS = { 1: 'var(--card)', 2: 'var(--popup)', 3: 'color-mix(in oklab, var(--popup), var(--control-edge) 30%)' };
export const GsHomeBlock = () => {
  const gs = useGs(); const root = React.useRef(null); const size = useHbSize(root); const [open, setOpen] = React.useState('delve');
  const grey = HB_GREYS[new URLSearchParams(location.search).get('hbgrey')] || HB_GREYS[1];
  return (
    <section ref={root} className={'gs-band hb is-' + size} style={{ '--hb-grey': grey }} aria-labelledby="gs-hb-h">
      <h2 className="mcp-t-sec" id="gs-hb-h">{HB_HEADING}</h2>
      <p className="gs-muted hb-lead">{HB_SENTENCE}</p>
      <div className="hb-set">
        <HbTabs open={open} size={size} pick={setOpen} go={gs.go} />
        <div className="hb-stage" role="tabpanel">
          {size !== 'phone' && <div className="hb-side"><HbSide game={open} /></div>}
          <div className="hb-talk"><HbChat game={open} size={size} onSend={gs.startFree} /></div>
        </div>
      </div>
    </section>);
};

const GS_WHATSNEW = [
  { v: '1.9', d: '1 October 2026', t: 'Copy any result as text', x: 'You can copy any finished result as text and paste it anywhere. The full record of rolls, guesses and statements stays on its session page.' },
  { v: '1.8', d: '24 September 2026', t: 'Streaks carry across devices', x: 'Your daily streak and record now follow your account, so they stay intact wherever you connect your AI.' },
  { v: '1.7', d: '10 September 2026', t: 'Connect in under two minutes', x: 'A single link now connects Claude, ChatGPT and other MCP assistants. No settings to copy between apps.' },
  { v: '1.6', d: '27 August 2026', t: 'Every play, in History', x: 'History lists every play under the day you played it. Find one by its name, number or date.' },
  { v: '1.5', d: '13 August 2026', t: 'Faster results after each play', x: 'The result and record appear as soon as the last turn is made.' },
  { v: '1.4', d: '30 July 2026', t: 'Account page', x: 'Manage your username, email, password, card and Pass from one place.' },
  { v: '1.3', d: '16 July 2026', t: 'History view', x: 'Look back over every play, grouped by day and by game.' },
  { v: '1.2', d: '2 July 2026', t: 'Search and filters in the library', x: 'Find a game by name, genre or how often it releases.' },
  { v: '1.1', d: '18 June 2026', t: 'Free daily puzzles', x: 'Today’s Daily Puzzles are free with an account.' },
];
export const GsWhatsNew = () => {
  const row = (e, i) => (
    <li key={e.v} className={'wn-e' + (i === 0 ? ' is-latest' : '')}>
      <div className="wn-body"><h3 className="wn-t">{e.t}</h3><p className="wn-d">{e.x}</p></div>
      <div className="wn-meta"><time>{e.d}</time></div>
    </li>
  );
  const now = GS_WHATSNEW.slice(0, 3), earlier = GS_WHATSNEW.slice(3);
  return (
    <section className="gs-band" aria-labelledby="gs-wn-h">
      <h2 className="mcp-t-sec" id="gs-wn-h">What’s new</h2>
      <div className="wn-panel">
        <ul className="wn-list has-fold">
          {now.map(row)}
          <li className="wn-e wn-foldrow">
            <details>
              <summary className="wn-sum"><span className="wn-caret"><DS.Icon name="down" size={16} style={{ transform: 'rotate(-90deg)' }} /></span>earlier updates</summary>
              <div className="wn-wrap" tabIndex={0} role="region" aria-label="Earlier updates"><ul className="wn-nest">{earlier.map((e) => row(e, -1))}</ul></div>
            </details>
          </li>
        </ul>
      </div>
    </section>
  );
};
