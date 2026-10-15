// Canonical row, round 3: options 16 to 18. Takes two things as settled from the owner's reviews (one row height per list; the trailing
// column centres a lone time and gives Replay its own line) and asks what a phone row spends, since cover, chevron, time column and
// full words don't all fit in the 154px a 320 frame leaves. Reuses round 1's seed, surfaces and art and round 2's short forms.
const CQ3_PAINS = [['h', 'Same height every row'], ['r320', 'Works at 320'], ['name', 'Full name on the row'], ['once', 'Says the game once'], ['open', '“Opens” cue on a phone'], ['art', 'Art on every surface']];
const CQ3_IDEAS = [
  { n: 0, name: 'Today', cls: 'o0', ds: true,
    stance: 'The shipped ListRow, for reference. Two lines on a narrow list, fixed columns from 640px.',
    cost: 'Titles wrap beside the time, so rows grow and differ. The time centres on rows without Replay and sits on line one on rows with it.',
    adapt: 'Two shapes, switched at 640px of list width.', pains: { h: 'bad', r320: 'part', name: 'ok', once: 'part', open: 'ok', art: 'ok' } },
  { n: 16, name: 'Words give way', cls: 'o16',
    stance: 'Keeps the cover, the chevron and the time column at every width, and pays with words. Under 440px of list width a title beside a cover drops the game’s name (the cover says it: “The Locked Study”, “#212”) and the result takes its short form (“5 moves”). The time sits top right; on a Replay row, Replay sits under it; on any other row the time centres on both lines.',
    cost: 'Players have to know the covers: “#64” only means something beside its art, and two games’ numbers look alike. At 320 a long edition name is still cut (“The Locked St…”); from 360 the usual ones fit, and the longest (“The Night Train to Fort William”) is cut until 640. The product supplies a short result for every outcome.',
    adapt: 'The title says as much as fits at any width: game · edition, then edition alone beside a cover, then the edition cut. Short results under 440, full from 440. One line of fixed columns from 640, cover 40×30.', pains: { h: 'ok', r320: 'ok', name: 'part', once: 'ok', open: 'ok', art: 'ok' } },
  { n: 17, name: 'Chevron gives way', cls: 'o17',
    stance: 'Under 640px the chevron goes: every row opens, the list is the page, and the whole row is the target. Its 32px go to the words, so the game’s name and the full result stay down to 400px of list width (a 432 frame), and the cover stays everywhere. Same trailing column as 16.',
    cost: 'No “opens” cue on a phone, against the ListRow rule; the row’s right edge is a time, not a mark. Under 400 the words give way as in 16, so a 390 phone sees 16’s titles with more room. At 320 a long edition name is cut.',
    adapt: 'No chevron under 640. Full words to 400; edition-only titles and short results under 400. One line of columns, chevron back, from 640.', pains: { h: 'ok', r320: 'ok', name: 'part', once: 'part', open: 'bad', art: 'ok' } },
  { n: 18, name: 'Picture gives way', cls: 'o18',
    stance: 'A phone row names the game once. Where the title already says it (“Escape · The Locked Study”), the cover goes under 440px of list width and the words take its 68px; where the row is the game (Library), the cover stays and the title is the name. The full result holds down to 360 (“Escaped in 5 moves” at 320).',
    cost: 'History on a phone has no art, so a mixed list loses its colour and its quickest scan, and History and Library look unlike on a phone. At 320 a mixed title is cut in the edition’s name (“Escape · The Locked St…”); from 360 it fits. Changes the Cover rule for rows: art only where the words don’t already say the game.',
    adapt: 'No cover on titled rows under 440; short results under 360. From 440 the cover returns beside two lines. One line of columns from 640.', pains: { h: 'ok', r320: 'ok', name: 'ok', once: 'ok', open: 'ok', art: 'part' } },
  { n: 19, name: 'Words give way, quiet result', cls: 'o19',
    stance: '16 with the result in the quiet voice. The words of the result go muted; the icon keeps its green or red; the title’s edition name and Replay are the only ink on the row, so Replay reads as the one thing to press. Everything else is 16.',
    cost: '16’s costs. The result is read second, after the icon, which is the point; a muted result beside a muted time makes line two mostly grey on rows without Replay.',
    adapt: 'As 16: the title says as much as fits, short results under 440, full words from 440, one line of columns from 640.', pains: { h: 'ok', r320: 'ok', name: 'part', once: 'ok', open: 'ok', art: 'ok' } },
];
Object.assign(window, { CQ3_PAINS, CQ3_IDEAS });
