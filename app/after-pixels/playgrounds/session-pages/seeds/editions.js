// Session-pages playground: seeded edition facts the engine does not send to the web yet (label S). Playground-only; canon is untouched.
// Plain script, loads before shared/outcome.js. A record's own field always wins over a seed; a page that reads a seed says so in its cost line
// ("needs the engine to send X"). Add facts here, never hard-coded inside an option.
window.PG_SEED = {
  // The Clockmaker's Study is the only Escape room in canon's content. Its room name and par are not on the session record.
  escape: { room: "The Clockmaker's Study", par: 30 },
};
