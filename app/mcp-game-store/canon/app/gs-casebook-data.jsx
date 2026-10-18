// ============================================================================
// [Platform] — Casebook's seed: its one case so far, Case 1 "The Last Night at Gull Point" (deployed content), and its badges.
// Casebook is episodic: cases are its editions, with no schedule, no streak and no next-case line (game-pages-refresh, 2026-10-18).
// The case's turns are GS_CB_REC (gs-data.jsx). `week` is the case's internal edition date, never printed: the play is dated Monday 5 October.
// ============================================================================
const cbMake = (id, week, month, title, played, verdict, total, rec) => {
  const turns = rec.filter((r) => r.c !== 'A');
  const lies = turns.filter((r) => r.c === 'B').length;
  return { id, week, month, title, played, live: played && !verdict, verdict, total, turns: turns.length, lies, searched: turns.filter((r) => r.c === 'F').length, seq: turns.map((r) => r.c).join(''), rec };
};
const CB_ID = 'gull';
const CB_TITLE = 'The Last Night at Gull Point';
const CB_CAST = ['Maeve Doyle', 'Tobias Pike', 'Dr. Celia Rourke'];
// Finished: 11 turns, 4 of 4 lies exposed, the accusation right.
// places: the case's four searchable places (sample).
const CB_DONE = { ...cbMake(CB_ID, '5 October', 'October', CB_TITLE, true, 'right', 4, GS_CB_REC), cast: CB_CAST, places: 4 };
// In progress: the same play after its first six turns (1 lie exposed). The total stays held back while the case is open.
const CB_LIVE = { ...cbMake(CB_ID, '5 October', 'October', CB_TITLE, true, null, 4, GS_CB_REC.filter((r) => r.c !== 'A').slice(0, 6)), cast: CB_CAST };
// Every case, newest first. One so far; its row in the log is the in-progress form, finished by the Config switch (cbWeek).
const CB_ALL = [CB_LIVE];

// Sample achievements (allowed in this prototype; owner, 18 October). The streak and weekly ones are gone: Casebook has no cadence.
// Each is earned by the first play in the record that meets it (src is the case as that play left it); counts count solved cases.
const cbRight = (p) => p.src.verdict === 'right';
const CB_ACH = [
  { k: 'first', n: 'First lie exposed', how: 'Expose a suspect’s lie with proof.', first: true, by: (p) => p.src.lies >= 1 },
  { k: 'solved', n: 'Case solved', how: 'Name the killer.', first: true, by: cbRight },
  { k: 'eleven', n: 'Solved in eleven turns', how: 'Name the killer using eleven turns or fewer.', first: true, by: (p) => cbRight(p) && p.src.turns <= 11 },
  { k: 'every', n: 'Every lie exposed', how: 'Expose every lie in one case.', first: true, by: (p) => p.src.lies === p.src.total },
  { k: 'rooms', n: 'Every room searched', how: 'Search every place in one case.', first: true, by: (p) => p.src.searched >= p.src.places },
  { k: 'quick', n: 'Solved in eight turns', how: 'Name the killer using eight turns or fewer.', first: true, by: (p) => cbRight(p) && p.src.turns <= 8 },
  { k: 'five', n: 'Five cases solved', how: 'Solve five cases.', of: 5, count: (ps) => ps.filter(cbRight) },
  { k: 'ten', n: 'Ten cases solved', how: 'Solve ten cases.', of: 10, count: (ps) => ps.filter(cbRight) },
];
// The system's flat shapes on the cover grounds.
const CB_BADGES = {
  first: ['#1D1B3A', [['path', 'd="M7 40L21 12L35 40Z"', '#F2EBE0'], ['rect', 'x="28" y="7" width="13" height="13"', '#D66847']]],
  solved: ['#163328', [['circle', 'cx="24" cy="20" r="11"', '#4CC38A'], ['rect', 'x="10" y="36" width="28" height="5"', '#F2EBE0']]],
  eleven: ['#1D1B3A', [['rect', 'x="7" y="28" width="7" height="13"', '#328A88'], ['rect', 'x="17" y="20" width="7" height="21"', '#328A88'], ['rect', 'x="27" y="12" width="7" height="29"', '#328A88'], ['circle', 'cx="40" cy="9" r="4"', '#F2EBE0']]],
  every: ['#421A28', [['path', 'd="M7 41V17A24 24 0 0 1 31 41Z"', '#E5A63B'], ['rect', 'x="33" y="7" width="8" height="8"', '#A390B2'], ['rect', 'x="33" y="19" width="8" height="8"', '#A390B2']]],
  five: ['#163328', [5, 13, 21, 29, 37].map((x) => ['rect', 'x="' + x + '" y="12" width="5" height="24"', '#E5A63B'])],
  quick: ['#163328', [['path', 'd="M8 38L24 10L40 38Z"', '#D66847'], ['circle', 'cx="38" cy="10" r="4"', '#F2EBE0']]],
  ten: ['#421A28', [7, 15, 23, 31, 39].flatMap((x) => [['rect', 'x="' + (x - 3) + '" y="14" width="6" height="8"', '#F2EBE0'], ['rect', 'x="' + (x - 3) + '" y="26" width="6" height="8"', '#E5A63B']])],
  rooms: ['#163328', [['circle', 'cx="20" cy="20" r="11"', '#328A88'], ['rect', 'x="29" y="29" width="12" height="12"', '#F2EBE0']]],
};
// Share text as deployed: it never names the culprit or who lied, and counts the lies the record exposed.
const cbLies = (n) => (n === 1 ? '1 lie exposed' : n + ' lies exposed');
const cbShareLines = (c) => ['Casebook: ' + c.title, (c.verdict === 'right' ? '✅ solved' : '❌ wrong accusation') + ' · ' + c.turns + ' of 16 turns · ' + cbLies(c.lies), gsLink('casebook')];
// The case's recap, open and closed.
const cbRecap = (c) => (c.live
  ? 'You’ve used ' + c.turns + ' of 16 turns and exposed ' + (c.lies === 1 ? '1 lie' : c.lies + ' lies') + '. You haven’t named the killer yet.'
  : 'You used ' + c.turns + ' of 16 turns and exposed ' + c.lies + ' of ' + c.total + ' lies.');

Object.assign(window, { CB_ALL, CB_LIVE, CB_DONE, CB_ACH, CB_BADGES, CB_ID, cbShareLines, cbRecap, cbLies });
