// Canonical row, round 2: options 11 to 15 (audit-row-content.md). Reuses round 1's seed, surfaces and art (pg-row-data.jsx).
// Short results: the score alone; the tone icon carries the verdict. The product would supply these; here they come from the full form.
const cqShort = (s) => {
  if (!s) return s;
  let m;
  if ((m = s.match(/^Escaped in (\d+) moves?$/))) return m[1] + ' moves';
  if ((m = s.match(/^Solved in (\d+ of \d+)$/))) return m[1];
  if ((m = s.match(/^All 4 groups, (.+)$/))) return m[1][0].toUpperCase() + m[1].slice(1);
  if (s === 'Still locked in') return 'Locked in';
  if (/ (is|are) ready$/.test(s)) return 'Ready';
  if (/^Done (today|this week)$/.test(s)) return 'Done';
  return s;
};
const CQ_PAINS = [['h', 'Same height every row'], ['n', 'No wrap at 320'], ['rp', 'Replay in one place'], ['name', 'Full name on the row'], ['wide', '768 and up']];
const CQ_IDEAS = [
  { n: 0, name: 'Today', cls: 'o0', ds: true,
    stance: 'The shipped ListRow, for reference. Two lines on a narrow list, fixed columns from 640px.',
    cost: 'Titles wrap beside the time, so rows grow and differ. The time centres on rows without Replay and sits on line one on rows with it.',
    adapt: 'Two shapes, switched at 640px of list width.', pains: { h: 'bad', n: 'bad', rp: 'bad', name: 'ok', wide: 'part' } },
  { n: 11, name: 'Clip', cls: 'o11',
    stance: 'Two fixed lines on every row. The title never wraps: if it’s too long it ends in “…”. On a Replay row the time sits on line one and Replay on line two; on any other row the time centres on both lines. Under 440px the result uses its short form (“6 moves”).',
    cost: 'At 320 a mixed-game title is cut, often in the edition’s name (“Escape · The Lo…”). The full name is only on the page the row opens. The time moves between rows with and without Replay.',
    adapt: 'Two lines up to 640px of list width, one line of fixed columns above. Short results under 440.', pains: { h: 'ok', n: 'ok', rp: 'ok', name: 'bad', wide: 'ok' } },
  { n: 12, name: 'Cover names the game', cls: 'o12',
    stance: '11’s slots, but where a row has a cover, the title on a phone drops the game’s name: “The Locked Study”, “#212”. The cover already says which game it is. The full name stays in the row’s accessible name, and comes back from 640px.',
    cost: 'A number alone (“#64”) only means something next to its cover, so players have to know the covers. Two games’ numbers look alike. Long edition names can still be cut at 320.',
    adapt: 'Edition-only title and short results under 640px of list width; full title in one line of columns above.', pains: { h: 'ok', n: 'ok', rp: 'ok', name: 'part', wide: 'ok' } },
  { n: 13, name: 'Replay on the result line', cls: 'o13',
    stance: 'Replay becomes part of what happened: line two reads “Replay · ✓ 6 moves”. The right edge holds only the time, centred on both lines, on every row. No row has an empty slot, and Replay rows are the same shape as the rest.',
    cost: '“Replay ·” takes about 60px of line two, and the centred time takes width from both lines, so at 320 even a short result is cut on a Replay row (“Replay · ✓ 5…”). Titles are cut as in 11.',
    adapt: 'Two lines with the time centred up to 640px. One line of columns above, with Replay in its own column before the result, so results line up.', pains: { h: 'ok', n: 'ok', rp: 'ok', name: 'bad', wide: 'ok' } },
  { n: 14, name: 'One line', cls: 'o14',
    stance: 'One line per row at every width: cover, title, result, time. Replay is an icon before the time. Under 440px the chevron goes, because the whole row is the target. The densest list.',
    cost: 'At 320 the title gets about 80px, so most names are cut hard. The replay icon is a symbol to learn (against ListRow’s rule) and a new icon. Removing the chevron removes the “opens” cue.',
    adapt: 'One line everywhere. Short results under 640px; no chevron under 440.', pains: { h: 'ok', n: 'ok', rp: 'part', name: 'bad', wide: 'ok' } },
  { n: 15, name: 'Fit by width', cls: 'o15',
    stance: '12 and 13 together, with each field changing form by width. Under 440px: edition-only title beside a cover, the time centred on both lines, and “Replay · ✓ 5 moves” on line two. 440 to 639px: the full title and full result, time centred. 640px and up: one line of columns, Replay in its own column.',
    cost: 'Three forms of the same row to check. The product supplies a short result for every outcome. Same cover-recognition cost as 12. At 320 a long edition name is still cut (“The Locked…”); at 390 it fits.',
    adapt: 'Short forms under 440, full forms in two lines to 640, one line above.', pains: { h: 'ok', n: 'ok', rp: 'ok', name: 'part', wide: 'ok' } },
  { n: '15b', name: 'Fit, centre if it fits', cls: 'o15 o15b', fit: true,
    stance: '15, but the row checks line two before it centres the time. If line two would be cut, line two runs under the time and the time moves up to line one. Otherwise the time centres on both lines.',
    cost: 'On one list, some rows centre the time and some put it on line one, depending on how long the result is. Needs a little JS in the shared row, re-checked when the width changes.',
    adapt: 'As 15. The check only applies under 640px.', pains: { h: 'ok', n: 'ok', rp: 'ok', name: 'part', wide: 'ok' } },
  { n: '15c', name: 'Fit, Replay as an icon', cls: 'o15 o15c',
    stance: '15, but under 440px the word “Replay ·” becomes the replay icon at the start of line two. The time always centres on both lines.',
    cost: 'A symbol players have to learn, against the ListRow rule, and a new icon in the system. Long results can still be cut at 320.',
    adapt: 'Icon under 440, the word from 440.', pains: { h: 'ok', n: 'ok', rp: 'part', name: 'part', wide: 'ok' } },
];
Object.assign(window, { cqShort, CQ_PAINS, CQ_IDEAS });
