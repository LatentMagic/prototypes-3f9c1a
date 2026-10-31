// The registries other files fill in their register<File>() functions (called from main.jsx) and screens read.
// This file imports nothing, so every file can import it without a cycle.
export const GS_LIBRARY = {}; // the library game pages, by game id
export const GS_EDITIONS = {}; // each game's editions, by game id: (gs) => rows, newest first (edList in gs-history.jsx)
export const GS_SESSION_BODY = {}; // each game's session body, by game id
export const GS_SESSION_QUIET = {}; // each game's quiet session head, by game id
export const GS_NOW = {}; // a game's own now card, by game id (Where's; a playground may set one under ?pg=): a component given the card's props, and the default card as children
