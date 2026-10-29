// The three registries other files fill in their register<File>() functions (called from main.jsx) and screens read.
// This file imports nothing, so every file can import it without a cycle.
export const GS_LIBRARY = {}; // the library game pages, by game id
export const GS_SESSION_BODY = {}; // each game's session body, by game id
export const GS_SESSION_QUIET = {}; // each game's quiet session head, by game id
