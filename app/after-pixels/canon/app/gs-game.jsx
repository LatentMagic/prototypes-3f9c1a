// ============================================================================
// After Pixels — the game page: one template for every game. Delve's page is the model. Order: cover and
// play box; facts band (how long, how often, genre tags); pitch beside who does what; how it looks in
// your chat; more games. Every null is a gap in the record and shows as "—".
// The play box at the top is the page's one Play. GsPlayBox is in gs-pass-game.jsx.
// `week` stays in GS_PAGES: the library game pages read its line.
// ============================================================================
import React from 'react';
import { GS_NAME, DS, useGs, GS_GAMES, GS_BARROW_CREDIT, GS_SOON } from './gs-data.jsx';
import { GsCover, GsWhoCols, GsSoonCard } from './gs-parts.jsx';
import { GsChatRow } from './gs-chats.jsx';
import { GS_HOME_GAMES } from './gs-home.jsx';
import { GsGameCard } from './gs-pass-home.jsx';
import { GsPlayBox } from './gs-pass-game.jsx';

export const GsGap = () => <span className="gs-gap" title="Not decided yet">—</span>;
export const gsOr = (v) => (v == null ? <GsGap /> : v);
// The free games' small line under Play: one template, so every free game says it the same way.
const gsFreeSmall = (edition) => edition + ', your streak and your achievements are free with an account.';
export const GS_STEP_CONNECT = <><b>Connect your AI</b> in about two minutes. ChatGPT, Claude, OpenClaw and others.</>;

export let GS_PAGES;
// How long a play takes: a sized game's size chip, else the game's own text on its page. Read by the product page and the editions panel.
export const gsGameTime = (id) => (GS_GAMES[id].size ? DS.TIME_CHIPS[GS_GAMES[id].size] : GS_PAGES[id].facts.long);
let GS_FACT_LABELS;

const GsFacts = ({ id }) => {
  const p = GS_PAGES[id];
  return (
    <section className="gs-factband" aria-label="Facts">
      <dl className="gs-facts">
        {GS_FACT_LABELS.map(([k, l]) => (
          <div key={k} className="gs-fact"><dt className="gs-label">{l.toUpperCase()}</dt><dd>{gsOr(k === 'long' ? gsGameTime(id) : p.facts[k])}</dd></div>
        ))}
      </dl>
      {p.tags.length > 0 && <div className="gs-tags gs-fact-tags">{p.tags.map((t) => <DS.Tag key={t} kind="daily">{t}</DS.Tag>)}</div>}
    </section>
  );
};

export const GsGamePage = ({ id, top }) => {
  const gs = useGs();
  const g = GS_GAMES[id]; const p = GS_PAGES[id];
  const others = GS_HOME_GAMES.filter((k) => k !== id);   return (
    <main className="gs-wrap gs-main">
      {top}

      <section className="gs-head-split">
        <div className="gs-hero-cover">
          <GsCover art={g.art} fit />
          <div className="gs-cover-over">
            <span className="gs-label">{g.category}</span>
            <h1 className="gs-cover-title">{g.name}</h1>
          </div>
        </div>
        <GsPlayBox id={id} />
      </section>

      <GsFacts id={id} />

      <section className="gs-pitch">
        <div className="gs-stack-md">
          <h2 className="mcp-t-sec">{p.pitch.h}</h2>
          {p.pitch.ps.map((t, i) => <p key={i}>{t}</p>)}
        </div>
        <DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start', alignSelf: 'center' }}>
          <span className="gs-label">HOW IT PLAYS</span>
          <GsWhoCols ai={p.who.ai} server={p.who.server} />
        </DS.Card>
      </section>

      <section className="gs-stack-md">
        <GsChatRow id={id} />
        {id === 'barrow' && <p className="gs-small gs-muted gs-credit" style={{ overflowWrap: 'anywhere', maxWidth: '72ch' }}>{GS_BARROW_CREDIT}</p>}
      </section>

      {/* More games is the home page's card row (GS_HOME_GAMES) without this game, then the soon cards and a link to the store. */}
      <section className="gs-stack-md">
        <DS.CardRow title="More games" className="gs-row4">
          {others.map((k) => <GsGameCard key={k} id={k} />)}
        </DS.CardRow>
        <div className="gs-grid2">{GS_SOON.map((s) => <GsSoonCard key={s.name} g={s} />)}</div>
        <div><DS.TextLink onClick={() => gs.go('games')}>All games</DS.TextLink></div>
      </section>
    </main>
  );
};

// Load-time code, run by main.jsx in index.html's old tag order.
export function initGsGame() {
GS_PAGES = {
  word: {
    box: { label: 'FREE WITH AN ACCOUNT', small: gsFreeSmall('Today’s word'), heading: 'Play it in your own AI chat', button: 'Play today’s word',
      steps: [GS_STEP_CONNECT, <><b>Play today’s word.</b> You get six guesses.</>, <><b>See your result</b> on your session page.</>] },
    facts: { often: 'New every day' }, tags: [],
    pitch: { h: 'One hidden word a day: find it in six guesses.', ps: [
      'The word is five letters long, and you have one hint, which shows you where a letter goes. It can be over on your first guess or come down to your last.',
      'The first word you try is a shot in the dark. Each row after it shrinks the alphabet in your head, until the gaps start to look like words. Then comes the squeeze: four letters sit in place, and light, might, night, sight and tight all fit, with too few guesses left to try them all. Your hint would settle it, unless you spent it earlier.'] },
    who: { ai: 'Draws the whole board after every guess, so you can watch the word take shape.', server: 'Keeps the word secret, marks every letter of every guess, counts your guesses and picks the letter a hint gives you.' },
    week: { title: 'Today’s word', line: 'Five letters. Six guesses.', session: 'word-today' },
  },
  groups: {
    box: { label: 'ONLY WITH THE PASS', small: gsFreeSmall('Today’s groups'), heading: 'New groups every day', button: 'Play today’s groups',
      steps: [GS_STEP_CONNECT, <><b>Find today’s four groups.</b> You can make four mistakes.</>, <><b>See your result</b> on your session page.</>] },
    facts: { long: '10 min', often: 'New every day' }, tags: [],
    pitch: { h: 'Sixteen words hide four groups of four.', ps: [
      'Pick four words you think belong together. You can make four mistakes, and the game tells you when you’re one word away.',
      'Your AI passes on your picks and explains the groups afterwards. The game engine checks every one. Find the first group.'] },
    who: { ai: 'Passes on your picks and explains the groups once you finish.', server: 'Holds the groups, checks every pick and counts your mistakes.' },
    week: { title: 'Today’s groups', line: 'Four groups. Four mistakes to spare.', session: 'groups-today' },
  },
  mystery: {
    box: { label: 'FREE WITH AN ACCOUNT', small: gsFreeSmall('Today’s case'), heading: 'Play it in your own AI chat', button: 'Play today’s case',
      steps: [GS_STEP_CONNECT, <><b>Work it out from the clues</b>, then make one accusation.</>, <><b>See your result</b> on your session page.</>] },
    facts: { often: 'New every day' }, tags: [],
    pitch: { h: 'There’s a body and a story that doesn’t add up.', ps: [
      'You get every clue at the start. Together they leave only one answer: who did it, with what, and where.',
      'Reason it out from the clues. Two hints help when you’re stuck, and you get one accusation.',
      'Your AI sets the scene and gives you every clue, but never solves the case for you. The game engine holds the answer. Make your move.'] },
    who: { ai: 'Sets the scene, gives every clue, and offers a hint when you’re stuck. It never solves the case for you.', server: 'Holds the answer and every clue, works out each hint from the clues itself and checks your accusation part by part.' },
    week: { title: 'Today’s case', line: 'Four suspects, four weapons, four places. One accusation.', session: 'mystery-today' },
  },
  escape: {
    box: { label: 'FIRST ROOM FREE', small: 'The first room is free with an account. Every room after it needs the Pass.', heading: 'A new room every week', button: 'Play the first room',
      steps: [GS_STEP_CONNECT, <><b>Play the first room.</b> Every lock has three hints if you need them.</>, <><b>See your result</b> on your session page.</>] },
    facts: { often: 'A new room every week' }, tags: [],
    pitch: { h: 'The door’s locked and you’re on the wrong side of it.', ps: [
      'Examine what’s in the room and find its locks. Each one opens to an answer you work out from clues around you. Carry what you find, set what moves and choose your way on. The room changes as it opens, and a lock may open onto a second room.',
      'Every lock has three hints, taken in order. The first two point the way and the third gives the answer. A hint costs no try, and it shows on your result.',
      'No clock runs while you play, and every room can be finished. Your time against par shows once you’re out. Say what you examine first.'] },
    who: { ai: 'Describes the room and everything you find in it.', server: 'Decides what each move does and keeps secret what the room hasn’t shown. It records wrong tries, hints and your time.' },
    week: { title: 'This week’s room', line: 'Find the way out.', session: 'escape-week' },
  },
  casebook: {
    box: { label: 'ONLY WITH THE PASS', heading: 'Sixteen turns. One accusation.', session: 'casebook',
      steps: [GS_STEP_CONNECT, <><b>Play one full case</b>, start to ending.</>, <><b>Keep your result.</b> It stays in your history.</>],
      small: GS_NAME.casebook + ' comes only with the After Pixels Pass.' },
    facts: { long: '25–40 min', often: 'One case, ready when you are' },
    tags: ['Mystery', 'One case, sixteen turns, one accusation'],
    pitch: { h: 'Ask the question they haven’t prepared for.', ps: [
      'The suspects have had time to get their stories straight. Your AI plays every one of them, and each has a secret to keep.',
      'Sixteen turns to search, question and confront them. Then one accusation.',
      'The game engine holds every statement word for word, so any story can be checked.'] },
    who: { ai: 'Voices every suspect and narrates what you find.', server: 'Holds every statement and every piece of evidence, counts your turns and keeps the record.' },
    week: { label: 'A CASE', title: 'Sixteen turns, then one accusation', line: 'Ask the question they haven’t prepared for.', session: 'casebook' },
  },
  delve: {
    box: { label: 'FIRST RUN FREE', heading: 'One run every week', session: 'delve', button: 'Play the first run',
      steps: [GS_STEP_CONNECT, <><b>Play this week’s run</b>, from the first room to its ending.</>, <><b>Keep your result.</b> It stays in your history.</>],
      firstStep: <><b>Play the first run</b>, from the first room to its ending.</>,
      small: 'The first run is free with an account. Every run after it needs the Pass.' },
    facts: { often: 'New every week' },
    tags: [],
    pitch: { h: 'A new world every week: fight room by room to the villain at its heart.', ps: [
      'One week it’s a goblin warren, the next a ship adrift in space, then a neon tower or a maze out of Greek myth. Each is a handful of rooms and one villain, won or lost in about half an hour. Pick a hero who can take a blow, slip out of reach, or deal big damage before going down.',
      'Fight whatever stands in your way, and every miss brings the danger a step closer. Say what you try; the die decides. Once a room is clear, the choice is yours: a search might turn up healing or a clue to the villain’s weak spot, but it can cost you. Search a little longer, or push on while you still can.'] },
    who: { ai: 'Tells the story as your Game Master, voices everyone you meet, and never makes a choice for you.', server: 'Rolls every die, yours and your enemies’, and keeps each room hidden until you walk in.' },
    week: { title: 'This week’s run', line: 'Get Elsie out of the warren beneath Ashford Mill before the ritual is complete.', session: 'delve' },
  },
  barrow: {
    box: { label: 'FIRST CHAPTER FREE', heading: 'A campaign in two chapters', button: 'Play Chapter 1',
      steps: [GS_STEP_CONNECT, <><b>Choose a hero</b>, then play at your own pace.</>, <><b>Keep your hero.</b> They carry on into the next chapter.</>],
      small: 'The first chapter is free with an account. Every chapter after it needs the Pass.' },
    facts: { long: 'Several sessions', often: 'Two chapters, played at your own pace over several sessions' },
    tags: ['Adventure', 'Mist, old stone and honest dice'],
    pitch: { h: 'Bring the bell home. Keep the hero.', ps: [
      'Mist lies on the marsh, and the village of Hollowmere has lost its bell to the barrow. Go as a fighter, a rogue or a wizard, through the churchyard and Whisperwood to the old stone and the older things beneath it.',
      'Explore a world that stays put, fight with dice nobody can fudge, and stop whenever you like. Finish the quest and your hero carries on, levelled up, into the second chapter, out across the mere to the drowned abbey.',
      'Your AI is the Game Master and gives the world its voice. The game engine holds the map, rolls every die and keeps the journal. Choose your hero.'] },
    who: { ai: 'Plays the Game Master: narrates the world and turns what you say into moves.', server: 'Holds the map, the hero’s sheet and every enemy, rolls every die and keeps the journal.' },
    week: { label: 'A QUEST', title: 'The bell is in the barrow', line: 'Bring the Bell of Hollowmere home from the barrow, and stop whenever you like.' },
    // Chapter 2's card, for a player past Chapter 1 (label as deployed).
    week2: { label: 'A QUEST', title: 'The chalice is in the abbey', line: 'Bring the Chalice of St. Ebba home from the drowned abbey, and stop whenever you like.' },
  },
  hunter: {
    box: { label: 'ONLY WITH THE PASS', heading: 'A different day every time', session: 'hunter',
      steps: [GS_STEP_CONNECT, <><b>Play the day</b>, from grey dawn to firelight.</>, <><b>Keep your day.</b> It stays in your history.</>],
      small: '36,000 Summers Ago comes only with the After Pixels Pass.' },
    facts: { long: '2 hours', often: 'A different day every time you start' }, tags: [],
    pitch: { h: 'The day goes on whether you join it or not.', ps: [
      'It’s grey dawn, 36,000 years ago, and your band is already moving. Hunters head for the cliffs. Gatherers set out for the plateau.',
      'Join them, or go your own way. Whatever you skip, the day carries on without you. You’ll hear what you missed at the fire.',
      'Your AI tells the day and speaks for everyone in it. The game engine rolls the dice and keeps the record. Say what you do first.'] },
    who: { ai: 'Tells the day, speaks for everyone in it and answers whatever you try.', server: 'Keeps the time, rolls the dice, tracks where everyone is and records what you do.' },
    week: { title: 'The day', line: 'One day, dawn to firelight. Start it over and it goes differently.', session: 'hunter', unmarked: true },
  },
};
GS_FACT_LABELS = [['long', 'How long'], ['often', 'How often']];
}
