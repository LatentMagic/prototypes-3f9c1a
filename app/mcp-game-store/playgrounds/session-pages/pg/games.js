// Session-pages playground: the five games, their states, and where the files live.
// Plain script (no Babel): it loads first, so the loader in index.html can read it.
// State ids are the deep-link vocabulary (?g=delve&o=2&s=finished). Every `sid` is a key of canon's GS_SESSIONS (gs-data.jsx and friends);
// Casebook has no session id: canon gives it its own record page (gs-casebook.jsx), whose record is cbWeek(), picked by `week`.
window.PG_BASE = '../playgrounds/session-pages/';   // from canon/, which index.html sets as <base>
window.PG_OPTION_COUNT = 3;
// Games that have an options/<game>-model.jsx (the game's reader, loaded before its options). Add the id here when the file is added; leave it out otherwise.
window.PG_MODELS = [];
window.PG_SHARE_OPT = 4;   // the rail entry after the options: the share-text whiteboard (pg/share.jsx). Seeds for the lost states: seeds/failures.jsx.
window.PG_GAMES = [
  { id: 'casebook', name: 'Casebook', record: true, states: [
    { id: 'finished', label: 'Solved', week: 'done' },
    { id: 'lost', label: 'Lost', week: 'done', cb: 'lost' },
    { id: 'unfinished', label: 'Unfinished', week: 'live' } ] },
  { id: 'escape', name: 'Escape', states: [
    { id: 'finished', label: 'Escaped', sid: 'escape-week', week: 'done' },
    { id: 'lost', label: 'Lost', sid: 'escape-lost', week: 'done' },
    { id: 'unfinished', label: 'Unfinished', sid: 'escape-live', week: 'live' } ] },
  { id: 'delve', name: 'Delve', states: [
    { id: 'finished', label: 'Won', sid: 'delve', week: 'done' },
    { id: 'lost', label: 'Lost', sid: 'delve-lost', week: 'done' },
    { id: 'unfinished', label: 'Unfinished', sid: 'delve-live', week: 'live' } ] },
  { id: 'word', name: 'Daily Word', states: [
    { id: 'finished', label: 'Solved', sid: 'word-today', week: 'done' },
    { id: 'lost', label: 'Failed', sid: 'word-e4', week: 'done' },
    { id: 'unfinished', label: 'Unfinished', sid: 'word-live', week: 'live' },
    { id: 'earlier', label: 'Earlier', sid: 'word-1005', week: 'done' } ] },
  { id: 'mystery', name: 'Daily Mystery', states: [
    { id: 'finished', label: 'Solved', sid: 'mystery-1004', week: 'done' },
    { id: 'lost', label: 'Failed', sid: 'mystery-today', week: 'done' },
    { id: 'unfinished', label: 'Unfinished', sid: 'mystery-live', week: 'live' } ] },
];
window.PG_BY_ID = {};
window.PG_GAMES.forEach((g) => { window.PG_BY_ID[g.id] = g; });
