// ============================================================================
// Session-pages playground: failure seeds. Playground-only data, never in canon: canon has no lost Delve, Escape or Casebook session.
// Each seed has the shape of the canon record beside it (GS_SESSIONS.delve, GS_SESSIONS['escape-week'], CB_DONE) and holds only what the engine
// records (grounding/<game>.md, "What the engine can express"). Everything here is illustrative: no deployed session looks like it.
// Loads after canon's data modules and before main.jsx.
// ============================================================================
(function () {
  const S = window.GS_SESSIONS;

  // ---- Delve: Wren the Rogue falls in the warren. Ending words are the setting's own (GS_DV_ENDINGS). ----
  // Ten rolls: strong hit, weak hit, miss, weak, miss, strong, miss, weak, miss, natural 1. Misses cost harm; HP 11 to 0 on the last roll.
  // Engine: finished {outcome, damageTaken, longestStreak, rooms}. Marks: 🟩 strong hit, 🟨 weak hit, 🟥 miss, 💀 natural 1.
  const DV_LOST = [
    ['Room', 'Entered The chime run'],
    ['Dexterity', 'd20 15 + 3 = 18 vs 12', 'Hit'],
    ['Dexterity', 'd20 10 + 3 = 13 vs 12', 'Weak hit, HP 9/11'],
    ['Dexterity', 'd20 6 + 3 = 9 vs 12', 'Miss, HP 7/11'],
    ['Room', 'Entered The warren'],
    ['Dexterity', 'd20 12 + 3 = 15 vs 12', 'Weak hit, HP 6/11'],
    ['Dexterity', 'd20 4 + 3 = 7 vs 12', 'Miss, HP 4/11'],
    ['Dexterity', 'd20 16 + 3 = 19 vs 12', 'Hit'],
    ['Room', 'Entered Snaggle\'s den'],
    ['Dexterity', 'd20 5 + 3 = 8 vs 12', 'Miss, HP 2/11'],
    ['Dexterity', 'd20 9 + 3 = 12 vs 12', 'Weak hit'],
    ['Room', 'Doubled back to The warren', 'The ritual +1'],
    ['Dexterity', 'd20 7 + 3 = 10 vs 12', 'Miss, HP 1/11'],
    ['Dexterity', 'd20 1 + 3 = 4 vs 12', 'Climb to the bone stair: natural 1, HP 0/11'],
  ];
  S['delve-lost'] = {
    ...S.delve, result: 'Fell in the warren', reached: 'Fell in the warren', share: 'Fell in the warren', loss: true,
    figures: ['Threat 6/12', '10 rolls', 'HP 0/11'],
    tracks: { progress: 3, rooms: 5, threat: 6, threatMax: 12 },
    lines: DV_LOST,
    shareLines: ['The Goblin Warren beneath Ashford Mill', 'Wren the Rogue · ❌ Fell in the warren · 10 rolls', '🟩🟨🟥🟨🟥🟩🟥🟨🟥💀'],
  };

  // ---- Escape: the engine has one outcome, escaped, and no clock, so the worst finish is a long one: 74 minutes against a par of 30, ----
  // all three hints on the way (nudge, bigger nudge, the answer), 11 wrong tries. The Clockmaker's Study has no forceable lock in its content, so none is shown.
  const E = window.GS_ES1;
  const ES_LOST = [
    ['Move 1', 'Examine the workbench', E.bench],
    ['Move 2', 'Try an answer (4 letters) on the workbench drawer', 'Wrong'],
    ['Move 3', 'Try an answer (4 letters) on the workbench drawer', 'Wrong'],
    ['Move 4', 'Try an answer (4 letters) on the workbench drawer', 'Wrong'],
    ['Hint', 'The workbench drawer', 'Count the gears’ teeth, and read each count as a letter.'],
    ['Move 5', 'Try an answer (4 letters) on the workbench drawer', E.drawer],
    ['Item', 'Brass winding key', 'A small brass key, its bow shaped like a clock face.'],
    ['Move 6', 'Examine the case clock', E.clock],
    ['Move 7', 'Use the brass winding key on the case clock', 'Used up'],
    ['Move 8', 'Examine the glass cabinet', E.cabinet],
    ['Move 9', 'Try an answer (4 digits) on the cabinet lock', 'Wrong'],
    ['Move 10', 'Try an answer (4 digits) on the cabinet lock', 'Wrong'],
    ['Move 11', 'Try an answer (4 digits) on the cabinet lock', 'Wrong'],
    ['Move 12', 'Try an answer (4 digits) on the cabinet lock', 'Wrong'],
    ['Move 13', 'Try an answer (4 digits) on the cabinet lock', 'Wrong'],
    ['Hint', 'The cabinet lock', 'The brass plate gives the code: the hours of the watches, Monday to Thursday.'],
    ['Move 14', 'Try an answer (4 digits) on the cabinet lock', E.diary],
    ['Move 15', 'Set the clock hands to an hour and a minute', 'Wrong'],
    ['Move 16', 'Set the clock hands to an hour and a minute', E.hands],
    ['Move 17', 'Examine the portrait', E.portrait],
    ['Move 18', 'Examine the fireplace', E.fire],
    ['Move 19', 'Examine the oak door', E.door],
    ['Move 20', 'Try an answer (4 letters) on the oak door lock', 'Wrong'],
    ['Move 21', 'Try an answer (4 letters) on the oak door lock', 'Wrong'],
    ['Hint', 'The oak door lock', 'The answer, given outright.'],
    ['Move 22', 'Try an answer (4 letters) on the oak door lock', 'Out'],
  ];
  S['escape-lost'] = {
    ...S['escape-week'], result: 'Escaped in 74 min, over par', loss: true,
    figures: ['74 min, over par', '3 hints', '11 wrong tries'],
    share: 'Escaped in 74 min, over par',
    shareLines: ['Escape No. 1 · escaped in 74 min, over par · 3 hints 💡💡💡 · 11 wrong tries'],
    lines: ES_LOST,
  };

  // ---- Casebook: dawn comes with the case unsolved. All 16 turns used, one lie exposed, five stories that stood, then the wrong name. ----
  // Turn codes as canon's GS_CB_REC: F search found, N search found nothing, Q question, H evidence shown and the story stood, B lie exposed, A the accusation.
  const CB_REC_LOST = [
    { c: 'F', act: 'Search', what: 'Searched the hotel bar', out: 'Found the bar ledger' },
    { c: 'F', act: 'Search', what: 'Searched the harbour noticeboard', out: 'Found the ferry notice' },
    { c: 'F', act: 'Search', what: 'Searched Pike’s office', out: 'Found a letter of dismissal, a partnership deed, Pike’s will' },
    { c: 'Q', act: 'Question', what: 'Asked Tobias Pike about the partnership deed' },
    { c: 'H', act: 'Show evidence', what: 'Showed the partnership deed to Tobias Pike', out: 'Their story stood' },
    { c: 'Q', act: 'Question', what: 'Asked Maeve Doyle about Tobias Pike' },
    { c: 'H', act: 'Show evidence', what: 'Showed the letter of dismissal to Maeve Doyle', out: 'Their story stood' },
    { c: 'Q', act: 'Question', what: 'Asked Tobias Pike about the ferry' },
    { c: 'H', act: 'Show evidence', what: 'Showed the bar ledger to Tobias Pike', out: 'Their story stood' },
    { c: 'B', act: 'Show evidence', what: 'Showed the ferry notice to Tobias Pike', out: 'Lie exposed' },
    { c: 'Q', act: 'Question', what: 'Asked Dr. Celia Rourke about the lighthouse' },
    { c: 'H', act: 'Show evidence', what: 'Showed Pike’s will to Maeve Doyle', out: 'Their story stood' },
    { c: 'N', act: 'Search', what: 'Searched the lighthouse stairs', out: 'Found nothing' },
    { c: 'Q', act: 'Question', what: 'Asked Maeve Doyle about the bar' },
    { c: 'H', act: 'Show evidence', what: 'Showed the ferry notice to Maeve Doyle', out: 'Their story stood' },
    { c: 'Q', act: 'Question', what: 'Asked Tobias Pike about the will' },
    { c: 'A', act: 'Accusation', what: 'Tobias Pike', out: 'Wrong' },
  ];
  if (typeof cbMake === 'function') {
    window.PG_CB_LOST = { ...cbMake('gull', '5 October', 'October', window.CB_DONE.title, true, 'wrong', 4, CB_REC_LOST), cast: window.CB_DONE.cast, places: 4 };
  }
})();
