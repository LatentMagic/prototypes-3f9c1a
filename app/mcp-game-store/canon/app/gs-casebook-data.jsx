// ============================================================================
// [Platform] — Casebook's seed for its library page: 45 weeks of cases, newest first, plus its badges.
// Titles, suspects and records are invented. From the option 16 playground (docs/specs/library-game-page/).
// Turn codes: F search found evidence · N search, nothing new · Q question · H evidence shown, story held · B lie exposed
// ============================================================================
const CB_POOL = {
  places: ['the boathouse', 'the kitchen', 'the library', 'the guest wing', 'the cellar', 'the garden', 'the study', 'the landing'],
  evidence: ['a wet oilskin', 'the bar ledger', 'a torn letter', 'the ferry notice', 'a green scarf', 'a spare key', 'a muddy boot', 'the guest book'],
  topics: ['where they were at ten', 'the argument at dinner', 'the missing key', 'who they saw on the stairs', 'the will'],
};
const CB_RAW = [
  ['c1005', '5 October', 'October', 'The Widow’s Lantern', ['Ada Quill', 'Rev. Hale', 'Nell Marsh'], 'FQBNQFB', null, 5],
  ['c0928', '28 September', 'September', 'The Night Train to Fort William', ['Iris Crane', 'Major Doyle', 'Felix Rowe'], 'FQBNFBQHBFB', 'right', 5],
  ['c0921', '21 September', 'September', 'A Quiet Week at Hollins Farm', ['Ruth Hollins', 'Sam Dyer', 'Joan Pell'], 'NQFHQNFQHNQFBHQN', 'wrong', 4],
  ['c0914', '14 September', 'September', 'The Bell Ringer’s Fall', null, null, null, 4],
  ['c0907', '7 September', 'September', 'Three Keys to the Vestry', ['Canon Ashe', 'Mary Lusk', 'Tom Brede'], 'FQNHBQFNQFHBQN', 'right', 4],
  ['c0831', '31 August', 'August', 'The Regatta Dinner', ['Lady Vane', 'Kit Morrow', 'Ellis Shaw'], 'FBQFBNQBF', 'right', 4],
  ['c0824', '24 August', 'August', 'Low Tide at Saltcote', ['Peg Tolley', 'Arthur Wick', 'Dina Fold'], 'QFNBQFHQNBFQ', 'wrong', 5],
  ['c0817', '17 August', 'August', 'The Orchard Gate', null, null, null, 4],
  ['c0810', '10 August', 'August', 'The Last Waltz at the Grand', ['Vera Lowe', 'Max Arden', 'Paul Cray'], 'NQFHQFBNQHQFBNQH', 'wrong', 5],
  ['c0803', '3 August', 'August', 'A Death in the Reading Room', ['Prof. Lind', 'Hester Gray', 'Owen Pryce'], 'FQBQNFBHQFBQN', 'wrong', 4],
  ['c0727', '27 July', 'July', 'The Lighthouse Keeper’s Log', null, null, null, 3],
  ['c0720', '20 July', 'July', 'Snowed In at Carrick Lodge', ['Una Carrick', 'Leo Strand', 'Bea Oakes'], 'FBQNFBQHFB', 'wrong', 4],
  ['c0713', '13 July', 'July', 'The Gardener’s Alibi', ['Jem Rook', 'Alice Penn', 'Hugh Tate'], 'QFNQBFHQNFQBNQF', 'wrong', 3],
  ['c0706', '6 July', 'July', 'The Painted Ferry', null, null, null, 4],
  ['c0629', '29 June', 'June', 'Midsummer at Ashby Hall', ['Lord Ashby', 'Cora Finch', 'Ned Pole'], 'NQFQHNQFHQNFBQHN', 'wrong', 4],
  ['c0622', '22 June', 'June', 'The Copper Kettle', null, null, null, 4],
  ['c0615', '15 June', 'June', 'The Last Night at Gull Point', ['Maeve Doyle', 'Tobias Pike', 'Dr. Celia Rourke'], 'FQBNFBQFBHFBN', 'right', 5],
];
const cbRecord = (seq, cast, verdict, k) => {
  const P = CB_POOL; let ev = k % P.evidence.length; let last = P.evidence[ev];
  const rows = Array.from(seq).map((c, i) => {
    const who = cast[(i + k) % 3]; const place = P.places[(i + k) % P.places.length];
    if (c === 'F') { last = P.evidence[ev++ % P.evidence.length]; return { c, act: 'Search', what: place, out: 'Found: ' + last }; }
    if (c === 'N') return { c, act: 'Search', what: place, out: 'Nothing' };
    if (c === 'Q') return { c, act: 'Question', what: who + ', about ' + P.topics[(i + k) % P.topics.length], out: 'Answered' };
    return { c, act: 'Show evidence', what: last + ' to ' + who, out: c === 'B' ? 'Lie exposed' : 'Held' };
  });
  if (verdict) rows.push({ c: 'A', act: 'Accusation', what: cast[k % 3], out: verdict === 'right' ? 'Right' : 'Wrong' });
  return rows;
};
const cbMake = (id, week, month, title, played, verdict, total, seq, rec) => {
  const lies = Array.from(seq).filter((c) => c === 'B').length;
  return { id, week, month, title, played, live: played && !verdict, verdict, total: Math.max(total, lies), turns: seq.length, lies, seq, rec };
};
const CB_RECENT = CB_RAW.map(([id, week, month, title, cast, seq, verdict, total], k) =>
  cbMake(id, week, month, title, !!seq, verdict, total, seq || '', seq ? cbRecord(seq, cast, verdict, k) : []));
// 28 older weeks behind those 17.
const CB_A = ['The Silent', 'The Broken', 'The Last', 'A Cold', 'The Second', 'The Hollow', 'The Drowned', 'The Borrowed'];
const CB_B = ['Bell', 'Lantern', 'Orchard', 'Letter', 'Mill', 'Chapel', 'Ferry', 'Clock', 'Garden', 'Key', 'Pier', 'Ledger', 'Window', 'Harbour'];
const CB_SEQ = 'FQBNQFHBQNFQBHQN';
const CB_OLD = Array.from({ length: 28 }, (_, i) => {
  const d = new Date(2026, 5, 15 - 7 * (i + 1));
  const mName = d.toLocaleString('en-GB', { month: 'long' }); const yr = d.getFullYear() !== 2026 ? ' ' + d.getFullYear() : '';
  const played = i % 5 !== 2 || i === 27; const r = (i * 3) % 16;
  const seq = played ? (CB_SEQ.slice(r) + CB_SEQ.slice(0, r)).slice(0, 9 + ((i * 5) % 8)) : '';
  const verdict = played ? (i % 3 === 0 ? 'right' : 'wrong') : null;
  return cbMake('o' + i, d.getDate() + ' ' + mName + yr, mName + yr, CB_A[i % 8] + ' ' + CB_B[(i * 3) % 14], played, verdict, 3 + (i % 3), seq,
    played ? cbRecord(seq, ['Ivy Marsh', 'Col. Brand', 'Ottoline Fay'], verdict, i) : []);
});
const CB_ALL = [...CB_RECENT, ...CB_OLD];
const CB_LIVE = CB_ALL[0];
// The same week, finished (Config: Casebook this week).
const CB_DONE_SEQ = 'FQBNQFBQFBH';
const CB_DONE = { ...CB_LIVE, live: false, verdict: 'right', seq: CB_DONE_SEQ, turns: CB_DONE_SEQ.length, lies: 4, total: 5,
  rec: cbRecord(CB_DONE_SEQ, ['Ada Quill', 'Rev. Hale', 'Nell Marsh'], 'right', 0) };
const CB_NEXT = 'Monday 12 October';
const CB_STREAK_N = 3;
const CB_ENDED = '18 September';

const CB_ACH = [
  { k: 'first', n: 'First lie exposed', how: 'Expose a suspect’s lie with proof.', got: '15 June', gotFree: '3 December 2025', first: true },
  { k: 'solved', n: 'Case solved', how: 'Name the killer.', got: '15 June', gotFree: '3 December 2025', first: true },
  { k: 'eleven', n: 'Solved in eleven turns', how: 'Name the killer using eleven turns or fewer.', got: '31 August', first: true },
  { k: 'every', n: 'Every lie exposed', how: 'Expose every lie in one case.', first: true },
  { k: 'rooms', n: 'Every room searched', how: 'Search every place in one case.', got: '7 September', first: true },
  { k: 'clean', n: 'Three solved in a row', how: 'Solve three cases running.', got: '14 September' },
  { k: 'quick', n: 'Solved in eight turns', how: 'Name the killer using eight turns or fewer.', first: true },
  { k: 'five', n: 'Five cases solved', how: 'Solve five cases.', of: 5, have: 4, endedHave: 3 },
  { k: 'row4', n: 'Four weeks in a row', how: 'Play four weeks running.', of: 4, have: 3, endedHave: 2 },
  { k: 'ten', n: 'Ten cases solved', how: 'Solve ten cases.', of: 10, have: 4, endedHave: 3 },
];
// The system's flat shapes on the cover grounds.
const CB_BADGES = {
  first: ['#1D1B3A', [['path', 'd="M7 40L21 12L35 40Z"', '#F2EBE0'], ['rect', 'x="28" y="7" width="13" height="13"', '#D66847']]],
  solved: ['#163328', [['circle', 'cx="24" cy="20" r="11"', '#4CC38A'], ['rect', 'x="10" y="36" width="28" height="5"', '#F2EBE0']]],
  eleven: ['#1D1B3A', [['rect', 'x="7" y="28" width="7" height="13"', '#328A88'], ['rect', 'x="17" y="20" width="7" height="21"', '#328A88'], ['rect', 'x="27" y="12" width="7" height="29"', '#328A88'], ['circle', 'cx="40" cy="9" r="4"', '#F2EBE0']]],
  every: ['#421A28', [['path', 'd="M7 41V17A24 24 0 0 1 31 41Z"', '#E5A63B'], ['rect', 'x="33" y="7" width="8" height="8"', '#A390B2'], ['rect', 'x="33" y="19" width="8" height="8"', '#A390B2']]],
  five: ['#163328', [5, 13, 21, 29, 37].map((x) => ['rect', 'x="' + x + '" y="12" width="5" height="24"', '#E5A63B'])],
  row4: ['#421A28', [5, 15, 25, 35].map((x) => ['rect', 'x="' + x + '" y="20" width="8" height="8"', '#E5A63B'])],
  quick: ['#163328', [['path', 'd="M8 38L24 10L40 38Z"', '#D66847'], ['circle', 'cx="38" cy="10" r="4"', '#F2EBE0']]],
  clean: ['#1D1B3A', [['circle', 'cx="24" cy="24" r="14"', '#A390B2'], ['rect', 'x="19" y="19" width="10" height="10"', '#F2EBE0']]],
  ten: ['#421A28', [7, 15, 23, 31, 39].flatMap((x) => [['rect', 'x="' + (x - 3) + '" y="14" width="6" height="8"', '#F2EBE0'], ['rect', 'x="' + (x - 3) + '" y="26" width="6" height="8"', '#E5A63B']])],
  rooms: ['#163328', [['circle', 'cx="20" cy="20" r="11"', '#328A88'], ['rect', 'x="29" y="29" width="12" height="12"', '#F2EBE0']]],
};
// Share text, per the spec: it hides the killer, the suspects and what they admitted.
const cbShareLines = (c) => ['Casebook · ' + c.title, (c.verdict === 'right' ? '✅ Solved' : '❌ Unsolved') + ' · ' + c.turns + ' of 16 turns · ' + c.lies + ' of ' + c.total + ' lies exposed', 'https://platform.example/casebook'];

Object.assign(window, { CB_ALL, CB_LIVE, CB_DONE, CB_NEXT, CB_STREAK_N, CB_ENDED, CB_ACH, CB_BADGES, cbShareLines });
