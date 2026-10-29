// After Pixels — nine more games, all Pass-only.
// Loads after gs-pass-store.jsx (reads CPR_STAGE, CPR_SHOWN) and before the other gs-pass-* files. main.jsx adds GS_MORE_IDS to its route lists.
// Each game: card (GS_GAMES), cover (GS_ART), product page (GS_PAGES), one chat (GS_CHATS), Library row text, player page units.
import React from 'react';
import { GS_ART, GS_SVG, GS_GAMES, gsAccess, GS_GAME_ORDER } from './gs-data.jsx';
import { GS_CHATS, gscU, gscAi } from './gs-chats.jsx';
import { GS_PAGES, GS_STEP_CONNECT } from './gs-game.jsx';
import { GP_CFG, gpGame } from './gs-player.jsx';
import { GS_LIB_READY } from './gs-discover.jsx';
import { CPR_STAGE, CPR_SHOWN } from './gs-pass-store.jsx';

const cprStep = (b, rest) => <><b>{b}</b>{rest}</>;
const GS_MORE = [
  { k: 'cipher', name: 'Daily Cipher', category: 'PUZZLE', when: 'Daily', ed: ['cipher', 'ciphers'], long: '10 min', units: 'ciphers', once: true,
    blurb: 'One line in code. Crack it before midnight.', ready: 'Today’s cipher is ready',
    art: ['indigo', 'centre', '<rect width="160" height="120" fill="#1D1B3A"/><circle cx="80" cy="60" r="38" fill="none" stroke="#A390B2" stroke-width="12"/><circle cx="80" cy="60" r="16" fill="#E5A63B"/><rect x="74" y="10" width="12" height="12" fill="#F2EBE0"/>'],
    page: { rhythm: 'NEW EVERY DAY', heading: 'A new cipher every day', step: cprStep('Crack today’s cipher.', ' Ask for a letter if you’re stuck.'),
      often: 'New every day', h: 'One line in code. Crack it before midnight.',
      ps: ['Every letter stands for another. Guess a few, test them on the line, and watch the words come through.', 'Your AI takes your guesses and reads back the line as it stands. The game engine holds the key. Name your first letter.'],
      ai: 'Takes your letter swaps and reads the line back to you.', server: 'Holds the key, checks every swap and counts your hints.' },
    chat: ['Swap a letter and the whole line changes.', 'I want to play Daily Cipher.', ['Daily Cipher No. 41. One line, every letter swapped for another.', 'QEB NRFZH YOLTK CLU. Which letter first?']] },
  { k: 'nighttrain', name: 'The Night Train', category: 'MYSTERY', when: 'Weekly', ed: ['case', 'cases'], long: '25–40 min', units: 'cases', once: true,
    blurb: 'Someone left the sleeper car and never reached the next one.', ready: 'This week’s case is ready',
    art: ['indigo', 'bottom', '<rect width="160" height="120" fill="#1D1B3A"/><rect x="14" y="62" width="132" height="36" fill="#D66847"/><rect x="26" y="70" width="16" height="12" fill="#F2EBE0"/><rect x="54" y="70" width="16" height="12" fill="#F2EBE0"/><rect x="82" y="70" width="16" height="12" fill="#1D1B3A"/><rect x="110" y="70" width="16" height="12" fill="#F2EBE0"/><rect x="0" y="106" width="160" height="6" fill="#E5A63B"/><circle cx="128" cy="28" r="10" fill="#A390B2"/>'],
    page: { rhythm: 'A NEW CASE EVERY WEEK', heading: 'A new case every week', step: cprStep('Work one full case', ', from the first stop to the last.'),
      often: 'A new case every week', h: 'Someone left the sleeper car and never reached the next one.',
      ps: ['Eight passengers, one corridor and a train that doesn’t stop until dawn. Everyone saw something. Nobody saw all of it.', 'Your AI plays every passenger. The game engine keeps what each one said and where they were. Knock on the first door.'],
      ai: 'Plays every passenger and the guard, and narrates the train.', server: 'Holds every statement and timetable, counts your stops and checks your accusation.' },
    chat: ['Eight passengers, one corridor, no stops until dawn.', 'Knock on compartment 4.', ['A tired voice: “I was asleep by eleven. I heard nothing.”', 'Her shoes are wet. It hasn’t rained since the last station.']] },
  { k: 'saltmarsh', name: 'Saltmarsh', category: 'ADVENTURE', when: 'Weekly', ed: ['voyage', 'voyages'], long: '30–45 min', units: 'voyages',
    blurb: 'Run the cargo through the marsh before the tide turns.', ready: 'This week’s voyage is ready',
    art: ['forest', 'bottom', '<rect width="160" height="120" fill="#163328"/><path d="M76 24L76 84L40 84Z" fill="#F2EBE0"/><rect x="34" y="88" width="72" height="12" fill="#D66847"/><rect x="0" y="104" width="160" height="16" fill="#328A88"/><circle cx="126" cy="34" r="14" fill="#E5A63B"/>'],
    page: { rhythm: 'A NEW VOYAGE EVERY WEEK', heading: 'A new voyage every week', step: cprStep('Sail one voyage', ', from the quay to the drop.'),
      often: 'A new voyage every week', h: 'Run the cargo through the marsh before the tide turns.',
      ps: ['The channels shift every week, the excise cutter knows half of them, and the tide waits for nobody. Pick your route, read the water, and keep the hold dry.', 'Your AI tells the crossing and voices the crew. The game engine rolls every die and keeps the tide clock. Cast off.'],
      ai: 'Tells the crossing, voices your crew and the excise men.', server: 'Rolls every die, keeps the tide clock and the cargo, and records your voyage.' },
    chat: ['Every channel is a roll against the tide.', 'Take the north channel.', ['You slip past the reed bank. The cutter’s lamp swings your way, then on.', 'Tide: 3 of 6. Two channels to the drop.']] },
  { k: 'heist', name: 'Heist', category: 'PUZZLE', when: 'Weekly', ed: ['job', 'jobs'], long: '20 min', units: 'jobs',
    blurb: 'Plan the job. Then make it work when it goes wrong.', ready: 'This week’s job is ready',
    art: ['wine', 'centre', '<rect width="160" height="120" fill="#421A28"/><rect x="44" y="24" width="72" height="72" fill="#A390B2"/><circle cx="80" cy="60" r="20" fill="#F2EBE0"/><rect x="76" y="44" width="8" height="32" fill="#E5A63B"/>'],
    page: { rhythm: 'A NEW JOB EVERY WEEK', heading: 'A new job every week', step: cprStep('Plan this week’s job', ', then pull it off.'),
      often: 'A new job every week', h: 'Plan the job. Then make it work when it goes wrong.',
      ps: ['You get the floor plan, the guard rota and a crew of three. Decide who goes where and when. Something will slip, and you’ll have one move to fix it.', 'Your AI briefs you and plays the crew. The game engine runs the guards to the second. Pick your way in.'],
      ai: 'Briefs you on the job and plays your crew.', server: 'Runs the guards and the clock, and decides what each move does.' },
    chat: ['One floor plan, three crew, one way out.', 'Send Ines to the loading bay at 2.10.', ['Ines is in. The guard is early: he’s back at 2.14, not 2.20.', 'You have one move before he turns the corner.']] },
  { k: 'winter', name: 'The Long Winter', category: 'ADVENTURE', eds: true, ed: ['chapter', 'chapters'], long: '45–60 min', units: 'chapters',
    blurb: 'Keep the settlement fed until the thaw.', ready: 'Chapter 1 is ready',
    art: ['indigo', 'bottom', '<rect width="160" height="120" fill="#1D1B3A"/><rect x="0" y="92" width="160" height="28" fill="#F2EBE0"/><rect x="58" y="60" width="44" height="32" fill="#D66847"/><path d="M52 62L80 38L108 62Z" fill="#E5A63B"/><circle cx="30" cy="30" r="4" fill="#A390B2"/><circle cx="130" cy="22" r="4" fill="#A390B2"/><circle cx="118" cy="48" r="4" fill="#A390B2"/>'],
    page: { rhythm: 'ONE CHAPTER', heading: 'A winter told in chapters', step: cprStep('Play chapter 1', ', from first snow to the frozen river.'),
      often: 'At your own pace', h: 'Keep the settlement fed until the thaw.',
      ps: ['Twelve families, one store of grain and a winter that came a month early. Each chapter is a stretch of weeks: who hunts, who mends, who goes without.', 'Your AI speaks for the settlement. The game engine keeps the stores, the weather and everyone’s strength. Open the grain store.'],
      ai: 'Speaks for the settlement and tells you how each week went.', server: 'Keeps the stores, the weather and everyone’s strength, and carries them between chapters.' },
    chat: ['What you ration now decides who sees the thaw.', 'Send the two eldest sons to hunt.', ['They come back on the third day with a deer and frostbitten hands.', 'Grain: 41 days. Firewood: 18 days.']] },
  { k: 'farside', name: 'Far Side', category: 'LEARNING', eds: true, ed: ['mission', 'missions'], long: '30 min', units: 'missions',
    blurb: 'Bring the crew home from behind the Moon.', ready: 'Mission 1 is ready',
    art: ['indigo', 'centre', '<rect width="160" height="120" fill="#1D1B3A"/><circle cx="62" cy="66" r="38" fill="#F2EBE0"/><circle cx="128" cy="28" r="12" fill="#328A88"/><rect x="108" y="74" width="12" height="12" fill="#E5A63B"/>'],
    page: { rhythm: 'ONE MISSION', heading: 'A flight told in missions', step: cprStep('Fly mission 1', ', from launch to splashdown.'),
      often: 'At your own pace', h: 'Bring the crew home from behind the Moon.',
      ps: ['Burn too long and you miss the window. Burn too short and you never leave orbit. Each mission teaches one piece of the flight, and the next one leans on it.', 'Your AI is mission control and explains each decision. The game engine flies the spacecraft. Call your first burn.'],
      ai: 'Plays mission control and explains the why behind each burn.', server: 'Flies the spacecraft, keeps the fuel and the clock, and records your mission.' },
    chat: ['Every burn is worked out by the engine.', 'Burn for 40 seconds.', ['Good burn. You’re on the way out of Earth orbit.', 'Fuel: 72%. Next window in 3 hours.']] },
  { k: 'ashcourt', name: 'The Court of Ash', category: 'MYSTERY', long: '90 min', units: 'plays',
    blurb: 'The king is dead, and the whole court had a reason.', ready: 'The court is ready',
    art: ['wine', 'bottom', '<rect width="160" height="120" fill="#421A28"/><rect x="56" y="30" width="48" height="90" fill="#A390B2"/><path d="M50 56L50 34L64 46L80 28L96 46L110 34L110 56Z" fill="#E5A63B"/><rect x="72" y="70" width="16" height="16" fill="#F2EBE0"/>'],
    page: { rhythm: 'ONE NIGHT', heading: 'A different court every time', step: cprStep('Play the night', ', from the bell to the dawn.'),
      often: 'A different culprit every time you start', h: 'The king is dead, and the whole court had a reason.',
      ps: ['The queen, the chancellor, the bishop and the king’s brother were all in the castle. By dawn the court picks a culprit, with your help or without it.', 'Your AI plays the court. The game engine decides who did it and keeps every word. Ask your first question.'],
      ai: 'Plays the whole court and narrates the castle.', server: 'Picks the culprit, keeps every statement and checks your verdict.' },
    chat: ['Everyone at court has something to hide.', 'Ask the chancellor where he was at midnight.', ['“In the chapel, praying for His Majesty.”', 'The bishop says the chapel was locked at eleven.']] },
  { k: 'tidepool', name: 'Low Tide', category: 'LEARNING', long: '1 hour', units: 'tides',
    blurb: 'One low tide on a rocky shore. Turn over every stone.', ready: 'Low tide is ready',
    art: ['forest', 'bottom', '<rect width="160" height="120" fill="#163328"/><rect x="0" y="84" width="160" height="36" fill="#328A88"/><rect x="24" y="66" width="40" height="22" fill="#A390B2"/><circle cx="104" cy="96" r="12" fill="#D66847"/><circle cx="132" cy="24" r="14" fill="#E5A63B"/>'],
    page: { rhythm: 'ONE TIDE', heading: 'A different shore every time', step: cprStep('Explore the shore', ' until the water comes back.'),
      often: 'A different shore every time you start', h: 'One low tide on a rocky shore.',
      ps: ['You have an hour before the sea returns. Lift stones, wade the pools and see what lives where the water just was.', 'Your AI describes everything you find and answers what you ask about it. The game engine keeps the tide and what each pool holds. Lift the first stone.'],
      ai: 'Describes what you find and answers your questions about it.', server: 'Keeps the tide, decides what each pool holds and records what you found.' },
    chat: ['Every pool holds something different.', 'Lift the flat stone by the big pool.', ['Two shore crabs scatter sideways. Under them, a cluster of tiny white eggs.', 'Tide: 40 minutes until it turns.']] },
  { k: 'clockwork', name: 'Clockwork', category: 'PUZZLE', long: '45 min', units: 'machines',
    blurb: 'Build the machine that opens the vault.', ready: 'The workshop is ready',
    art: ['indigo', 'centre', '<rect width="160" height="120" fill="#1D1B3A"/><circle cx="64" cy="64" r="28" fill="none" stroke="#E5A63B" stroke-width="10"/><circle cx="110" cy="44" r="16" fill="none" stroke="#328A88" stroke-width="8"/><circle cx="64" cy="64" r="6" fill="#F2EBE0"/><circle cx="110" cy="44" r="4" fill="#F2EBE0"/>'],
    page: { rhythm: 'ONE MACHINE', heading: 'A different vault every time', step: cprStep('Build the machine', ', one part at a time.'),
      often: 'A different vault every time you start', h: 'Build the machine that opens the vault.',
      ps: ['Gears, springs, levers and a lock that wants turning eleven times. Fit the parts, set it going and see how far it gets.', 'Your AI describes the workbench and what the machine does. The game engine runs every turn of every gear. Pick your first part.'],
      ai: 'Describes the workbench and what your machine does when it runs.', server: 'Runs every gear and spring, and decides whether the vault opens.' },
    chat: ['Fit a part, set it going, see what moves.', 'Put the large gear on the left spindle and wind it.', ['The large gear turns the small one three times. The lock moves one notch.', 'Ten notches to go.']] },
];
export const GS_MORE_IDS = GS_MORE.map((d) => d.k);
export const GS_MORE_SCREENS = {};

// Load-time code, run by main.jsx in index.html's old tag order.
export function initGsMoreGames() {
GS_MORE.forEach((d) => {
  const tags = [d.when, d.long].filter(Boolean);
  GS_ART[d.k] = { ground: d.art[0], extend: d.art[1], svg: GS_SVG(d.art[2]) };
  GS_GAMES[d.k] = gsAccess({ access: 'pass', name: d.name, category: d.category, art: d.k, route: d.k, ed: d.ed, eds: d.eds, once: d.once, added: true, blurb: d.blurb, tags });
  GS_PAGES[d.k] = {
    rhythm: d.page.rhythm,
    box: { label: 'ONLY WITH THE PASS', heading: d.page.heading, session: null,
      steps: [GS_STEP_CONNECT, d.page.step, <><b>Keep your result.</b> It stays in your history.</>],
      small: d.name + ' comes only with the After Pixels Pass.' },
    facts: { long: d.long, often: d.page.often }, tags: [],
    pitch: { h: d.page.h, ps: d.page.ps },
    who: { ai: d.page.ai, server: d.page.server },
    week: { title: d.page.heading, line: d.blurb },
  };
  GS_CHATS[d.k] = [{ cap: d.chat[0], turns: [gscU(d.chat[1]), gscAi(d.k, d.chat[2])] }];
  GS_LIB_READY[d.k] = d.ready;
  GP_CFG[d.k] = { units: d.units, run: null, strip: null, ends: null, recent: [] };
  GS_GAME_ORDER.push(d.k);
  CPR_STAGE[d.k] = GS_GAMES[d.k].access;
  CPR_SHOWN.push(d.k);
  GS_MORE_SCREENS[d.k] = gpGame(d.k);
});
}
