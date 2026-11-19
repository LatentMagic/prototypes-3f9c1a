// ============================================================================
// After Pixels — Home (screen 1). GsHome is replaced by gs-pass-home.jsx (CprHome); GsWhatsNew, GsFeature and
// GS_HOME_GAMES are still read. The Pass page is in gs-pass-pricing.jsx.
// ============================================================================
import React from 'react';
import { DS, GS_GAMES, useGs } from './gs-data.jsx';
import { GsCard } from './gs-pass-home.jsx';
import { chatTurn, chatShell, useChatScroll, chatReply } from '../../design-system/components/media/ChatPicture.jsx';
const Reply = chatReply;
import { ChatSide } from '../../design-system/components/media/ChatSide.jsx';
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
// The scene the AI shows in Delve's chat: a picture turn of the chat on a phone, the side panel beside it.
const HB_PICTURE = { type: 'picture', src: 'assets/home-block-delve.svg', alt: 'A hero in armour on a ridge at dawn, a burning tower behind' };
// KEEP: the threat track's tone is the design system's `threat`; the platform's ChatBlock names that tone `danger`, so the platform record uses `danger`.
const HB_TRACK = (advance) => ({ type: 'track', items: [{ label: 'Garrick’s health', value: 23, max: 23, tone: 'health' }, { label: 'The drums', value: advance, max: 12, tone: 'threat' }] });
const HB_ROWS = [{ letters: 'COILS', marks: 'hhxhx' }, { letters: 'CLOUD', marks: 'hnnnh' }];
const HB_BOARD = { type: 'tilegrid', length: 5, count: 6, rows: HB_ROWS };
// In the chat the board grows with the guesses, as on Guess's product page.
const HB_PLAYED = (n) => ({ type: 'tilegrid', length: 5, count: n, rows: HB_ROWS.slice(0, n) });
// Beside the chat, Accuse's panel shows the clues the chat talks about, the same clue cards as its product page.
const HB_CLUES = [{ kind: 'Clues', facts: ['1. Madame Zara handled the brass bugle.', '2. Whoever handled the brass bugle was not in the costume tent.', '3. Coco was in the cook tent.', '4. Ivan the Mighty was in the generator truck.', '5. The killer was in the big top.'] }];
// The three tabs, in their fixed order, with their sample chats. Swap a chat by replacing its turns.
const HB_GAMES = [
  { id: 'delve', gid: 'delve', part: 'Game Master', intro: 'It sets each scene, plays everyone you meet and asks what you do next.',
    turns: [
      HB_A('Delve', ['Before dawn on the ridge above Brackenford. The watchtower burns, and orc tracks run up towards the caves under Raven Hill. A watchman lies pinned beneath an overturned cart.', '“Get this off me. Please.”', 'You can lift the cart with Strength, or follow the tracks to the caves. What do you do?'], [HB_TRACK(0)]),
      HB_U('I lift the cart.'),
      HB_A('Delve', ['You heave the cart up, and he drags his leg free.', '“They went up to the caves. Dozens of them.”', 'The tracks climb towards Raven Hill. What do you do?'], [{ type: 'roll', label: 'Strength', roll: 14, mod: 3, target: 12, result: 'hit', outcome: 'Success' }, HB_TRACK(0)]),
    ] },
  { id: 'guess', gid: 'word', part: 'Host', intro: 'It shows how each guess scored and keeps a hint back until you want it.',
    turns: [
      HB_U('COILS'),
      HB_A('Guess', 'Three in place. Five guesses left. Your hint’s here when you want it.', null, [HB_PLAYED(1)]),
      HB_U('CLOUD'),
      HB_A('Guess', 'Two in place, three elsewhere. Four guesses left.', null, [HB_PLAYED(2)]),
    ] },
  { id: 'accuse', gid: 'mystery', part: 'Thinking partner', intro: 'It helps you think through the clues without solving the case for you.',
    turns: [
      HB_U('I keep mixing up Coco, Zara and the weapons. Can we talk through the ringmaster’s murder?'),
      HB_A('Accuse', 'Which clue would you like to start with?', null, [{ type: 'clues', groups: HB_CLUES }]),
      HB_U('Clue 2. “Whoever handled the brass bugle was not in the costume tent.” I keep reading it backwards.'),
      HB_A(null, 'Let’s take that sentence in two parts. What does it tell you about where the person with the bugle was? What does it leave unanswered?'),
    ] },
];
// Where the game sits beside the chat (tablet and desktop), the chat does not repeat it: the board and the clues come out of its turns.
const hbPlain = (t) => ({ ...t, blocks: t.blocks && t.blocks.filter((b) => b.type !== 'tilegrid'), after: t.after && t.after.filter((b) => b.type !== 'clues' && b.type !== 'tilegrid') });

// The block's layout follows its own width, so it holds wherever the page sits.
// KEEP: four bands of the block's width. Under 400px (a 432px screen) the games are a list beside one description box; from 400px the three tabs sit in a row with the chosen one widened to half the row and holding its description; from 640px the game sits beside the chat; from 960px the tabs are a vertical column. The chat column never drops under 300px, where the Track's count would overlap its steps.
const useHbSize = (ref) => {
  const [size, setSize] = React.useState('desktop');
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return undefined;
    const read = () => { const w = el.getBoundingClientRect().width; setSize(w < 400 ? 'list' : w < 640 ? 'phone' : w < 960 ? 'tablet' : 'desktop'); };
    read(); const ro = new ResizeObserver(read); ro.observe(el); return () => ro.disconnect();
  }, []);
  return size;
};

// Beside the chat (tablet and desktop) each game's side opens with its edition, in the same place for all three; a phone shows none.
// KEEP: the edition numbers are invented, so no real edition is shown: #40 is Delve's product page sample, #112 is Accuse's, and Guess's #33 is one before that page's No. 34, so the two never contradict.
const HB_EDITION = { delve: 'Delve #40', guess: 'Guess #33', accuse: 'Accuse #112' };
// What the AI draws for the game: beside the chat on tablet and desktop, inside it on a phone.
const HB_SIDE = { delve: [HB_PICTURE], guess: [HB_BOARD], accuse: [{ type: 'clues', groups: HB_CLUES }] };
const HbSide = ({ game }) => <ChatSide label={HB_EDITION[game]} blocks={HB_SIDE[game]} name={GS_GAMES[HB_GAMES.find((x) => x.id === game).gid].name + ' beside the chat'} />;
// KEEP: Start free is the demo chat's own reply action, drawn black so it reads as the thing to press, never the chat's grey send button (the user, 2026-11-18).
const HB_ACTION = (onSend) => <DS.Button onClick={onSend}>Start free</DS.Button>;

const HbChat = ({ game, size, onSend }) => {
  const body = React.useRef(null); const phone = size === 'list' || size === 'phone'; const g = HB_GAMES.find((x) => x.id === game);
  const turns = phone ? g.turns : g.turns.map(hbPlain);
  // Delve opens a phone chat with the picture of the scene, the AI's own, with the call that made it; that call stands for the first turn's.
  const pic = phone && game === 'delve';
  const shown = pic ? [{ from: 'ai', tool: 'Delve', blocks: [HB_PICTURE] }, { ...turns[0], tool: undefined }, ...turns.slice(1)] : turns;
  const items = shown.map((t, i) => chatTurn(t, i, { mark: GS_CHAT_MARK, toolBy: GS_CHAT_BY }));
  // KEEP: the chat is all there when shown (nothing types in) and opens at its top, whichever tab or width. The chat scrolls; the block never changes height.
  // While more of the chat sits below, the design system's down pill shows above the reply bar, as on the hero chat (the user, 2026-11-18).
  const [more, toEnd] = useChatScroll(body, game + size, 'top');
  return chatShell({ bodyRef: body, body: items, up: more, toStart: toEnd, start: 'top', height: phone ? 300 : undefined, width: 2000, fill: !phone,
    label: GS_GAMES[g.gid].name + ' being played in a chat', more: 'On to the latest', className: 'hb-chat', comp: <Reply action={HB_ACTION(onSend)} /> });
};

// KEEP: all three descriptions share one grid cell and only the chosen one shows (the others are visibility:hidden), so the block is as tall as the longest and nothing below it moves when a tab is tapped.
const HbIntro = ({ open, go, role }) => (
  <div className="hb-ins">{HB_GAMES.map((g) => (
    <div key={g.id} className={'hb-intro' + (g.id === open ? '' : ' is-ghost')} aria-hidden={g.id === open ? undefined : true}>
      {role && <b className="hb-role">{g.part}</b>}
      <p>{g.intro}</p>
      <DS.TextLink onClick={() => go(GS_GAMES[g.gid].route)} tabIndex={g.id === open ? 0 : -1}>See {GS_GAMES[g.gid].name} <span aria-hidden="true">›</span></DS.TextLink>
    </div>))}</div>);
// The games are the design system's NotchPicker (a group of toggle buttons, not ARIA tabs: a tablist may own only tabs). The picker owns which game is chosen and the notch; this block owns how the tabs are laid out and what each holds.
// From 400px the chosen tab holds the description, so the tab is a button plus the description beside it, never a link inside a button.
const HbTab = ({ g, on, buttonProps, inTab, go }) => (
  <div className={'hb-tab' + (on ? ' is-open' : '')} data-np-tile="">
    <button {...buttonProps} className="hb-tab-b"><small>{GS_GAMES[g.gid].name}</small><b>{g.part}</b></button>
    {on && inTab && <HbIntro open={g.id} go={go} />}
  </div>
);

export const GsHomeBlock = () => {
  const gs = useGs(); const root = React.useRef(null); const size = useHbSize(root); const [open, setOpen] = React.useState('delve');
  const inTab = size !== 'list'; const at = HB_GAMES.findIndex((g) => g.id === open);
  const cols = size === 'phone' || size === 'tablet' ? { gridTemplateColumns: HB_GAMES.map((_, i) => (i === at ? 'minmax(0, 2fr)' : 'minmax(0, 1fr)')).join(' ') } : undefined;
  // KEEP: the notch sits on the grey panel's edge and points at the chosen game: at the box's centre under it (list), the tab's centre (row), or level with the tab on the panel's left edge (column). It glides to a newly chosen tab and follows a resize at once.
  return (
    <section ref={root} className={'gs-band hb is-' + size} aria-labelledby="gs-hb-h">
      <h2 className="mcp-t-sec" id="gs-hb-h">{HB_HEADING}</h2>
      <p className="gs-muted hb-lead">{HB_SENTENCE}</p>
      <DS.NotchPicker className="hb-set" label="Games" value={open} onChange={setOpen}
        options={HB_GAMES.map((g) => ({ id: g.id, label: GS_GAMES[g.gid].name }))}
        tilesClassName="hb-tabs" tilesStyle={cols}
        renderTile={(o, { on, buttonProps }) => <HbTab g={HB_GAMES.find((g) => g.id === o.id)} on={on} buttonProps={buttonProps} inTab={inTab} go={gs.go} />}
        aside={size === 'list' ? <div className="hb-desc" data-np-aside=""><HbIntro open={open} go={gs.go} role /></div> : null}
        pointer={size === 'desktop' ? 'side' : 'top'} target={size === 'list' ? 'aside' : 'tile'}
        panelProps={{ className: 'hb-panel' }}>
        <div className="hb-stage">
          {size !== 'list' && size !== 'phone' && <div className="hb-side"><HbSide game={open} /></div>}
          <div className="hb-talk"><HbChat game={open} size={size} onSend={gs.startFree} /></div>
        </div>
      </DS.NotchPicker>
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
