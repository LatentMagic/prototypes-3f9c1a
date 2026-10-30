import { GS_SESSIONS, GS_GAMES } from './gs-data.jsx';
import { GS_PAGES } from './gs-game.jsx';
import { lbAutoBadges } from './gs-library.jsx';
import { phVisible } from './gs-history.jsx';
import { GS_EDITIONS } from './registry.js';

export let BW_CH1;
export let BW_CH2;
export let BW_T1;
let BW_T2;
export let BW_REC1;
// The chapters out so far, newest first, in edList's shape (gs-history.jsx). No dates are printed (nodate).
// Each chapter's status is its play in the record (phVisible); nobody has played Chapter 2.
export const bwEds = (gs) => {
  const out = gs.view === 'out'; const plays = out || !phVisible ? [] : phVisible(gs).filter((p) => p.gid === 'barrow');
  const st = (key) => { const p = plays.find((x) => x.ed === key); return out ? null : p ? p.status : { kind: 'none', label: 'Not played' }; };
  const open = (key) => { const p = plays.find((x) => x.ed === key); return p ? () => p.open(gs) : null; };
  return [
    { key: 'bw2', gid: 'barrow', n: 2, title: BW_T2, date: '', nodate: true, month: 'October', free: false, now: true, status: st('bw2'), open: open('bw2') },
    { key: 'bw1', gid: 'barrow', n: 1, title: BW_T1, date: '', nodate: true, month: 'October', free: true, now: false, status: st('bw1'), open: open('bw1') },
  ];
};
export const registerBarrowLibrary = () => { GS_EDITIONS.barrow = bwEds; };
let CPR_BW_JOURNAL;


export let BW_ACH;
export let BW_BADGES;

// Load-time code, run by main.jsx in index.html's old tag order.
export function initGsBarrowLibrary() {
// ============================================================================
// After Pixels — The Barrow of Hollowmere's library page. A campaign told in chapters: chapters are its editions.
// Chapter 1 is free with an account; Chapter 2 is out and comes with the Pass. No Chapter 2 play is staged.
// Chapter titles are authored; achievements are sample content.
// ============================================================================
BW_CH1 = { title: GS_PAGES.barrow.week.title, line: GS_PAGES.barrow.week.line };
BW_CH2 = { title: GS_PAGES.barrow.week2.title, line: GS_PAGES.barrow.week2.line };
BW_T1 = 'The Barrow of Hollowmere';
// The authored title, written exactly so even though it repeats the game's name.
BW_T2 = 'The Barrow of Hollowmere — Chapter 2: The Abbey on the Mere';
// Chapter 1's play record: what the finished chapter earned (the barrow door opened, the crypt reached). The log holds the play.
BW_REC1 = { earns: ['seal', 'deep'] };
// The Barrow's finished Chapter 1: Wren the Rogue's journal, every line one of the engine's own templates (deployed), played over three sessions.
// Its date is its play's, from the play log (gs-history.jsx). The Bell's line reads "Took the Bell of Hollowmere.", not the engine's doubled "the The".
CPR_BW_JOURNAL = [
  [1, 'Wren the Rogue took up Elder Maud’s quest: Recover the Bell of Hollowmere from the barrow and bring it home to the village.'],
  [1, 'Reached St. Ebba’s churchyard.'], [1, 'Took the Storm lantern.'], [1, 'Forced a way through the lodge door.'], [1, 'Reached The sexton’s lodge.'],
  [1, 'Took the Iron key.'], [1, 'Rested and recovered. Session 1 ended.'],
  [2, 'Reached Whisperwood.'], [2, 'Defeated Grey wolf in Whisperwood.'], [2, 'Defeated Grey wolf in Whisperwood.'], [2, 'Reached The barrow mound.'],
  [2, 'Opened the barrow door with the Iron key.'], [2, 'Rested and recovered. Session 2 ended.'],
  [3, 'Reached The barrow hall.'], [3, 'Defeated Barrow skeleton in The barrow hall.'], [3, 'Defeated Barrow skeleton in The barrow hall.'],
  [3, 'Reached The wight’s crypt.'], [3, 'Defeated The barrow wight in The wight’s crypt.'], [3, 'Wren reached level 2.'], [3, 'Took the Bell of Hollowmere.'],
  [3, 'Rang the Bell of Hollowmere in the chapel tower again. The mist drew back from the marsh. Quest complete.'],
];
GS_SESSIONS['gs-pu-barrow-ch1'] = { kind: 'chapter', gid: 'barrow', edKey: 'bw1', game: GS_GAMES.barrow.name, art: 'barrow', result: 'Quest complete',
  figures: ['3 sessions', 'Level 2'], listTitle: 'The story', lines: CPR_BW_JOURNAL.map(([n, t]) => ['Session ' + n, t]), share: 'Quest complete',
  shareLines: ['Adventure: The Barrow of Hollowmere', 'Wren the Rogue, level 2 · ✅ Bell returned · 3 sessions'], credit: true };
// Sample achievements. Those naming cut content (the seal, loot, the bronze ring, five levels, the sheep) are cut or reworded to the authored world.
BW_ACH = [
  { k: 'seal', n: 'Into the barrow', how: 'Open the barrow door.', first: true, by: (p) => p.src.earns.includes('seal') },
  { k: 'deep', n: 'The wight’s crypt', how: 'Reach the wight’s crypt.', first: true, by: (p) => p.src.earns.includes('deep') },
  { k: 'unhurt', n: 'Out without a scratch', how: 'Finish Chapter 1 with full HP.', first: true, by: (p) => p.src.earns.includes('unhurt') },
];
BW_BADGES = lbAutoBadges(BW_ACH);
}
