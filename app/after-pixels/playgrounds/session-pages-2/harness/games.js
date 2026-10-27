// Session pages 2: the games, their states and their files. Plain script (no Babel): the loader in index.html reads it first.
// To add a game: add an entry here, put its files under games/<id>/, and register its options with sp2Option (harness/store.js).
// A state's sid is the GS_SESSIONS key the page shows; a game's own files seed it. week is how canon stages the review ('done' or 'live').
window.SP2 = {
  base: '../playgrounds/session-pages-2/',   // from canon/, which index.html sets as <base>
  optionCount: 3,
  games: [
    {
      id: 'word', name: 'Daily Word',
      css: ['games/word/word.css'],
      files: ['games/word/model.jsx', 'games/word/option-1.jsx', 'games/word/option-2.jsx', 'games/word/option-3.jsx'],
      states: [
        { id: 'solved', label: 'Solved', sid: 'sp2-word-solved', week: 'done' },
        { id: 'failed', label: 'Failed', sid: 'sp2-word-failed', week: 'done' },
        { id: 'progress', label: 'In progress', sid: 'sp2-word-live', week: 'live' },
      ],
    },
  ],
};
window.SP2.byId = {};
window.SP2.games.forEach(function (g) { window.SP2.byId[g.id] = g; });
