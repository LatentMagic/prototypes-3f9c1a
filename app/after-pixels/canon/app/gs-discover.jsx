// ============================================================================
// After Pixels — Discover (route `games`) and Library (route `library`).
// Discover (GsGames) is in gs-pass-discover.jsx and Library (GsLibrary) in gs-pass-library.jsx.
// Their helpers (gsKind, gsKinds, gsFind, GS_ADDED, GS_LIB_READY) are still read.
// ============================================================================
import { GS_GAME_ORDER, GS_GAMES, gsNorm } from './gs-data.jsx';

export const gsKind = (c) => c.charAt(0) + c.slice(1).toLowerCase();
// Read at render, not load, so a game added later (gs-more-games.jsx) still brings its genre.
export const gsKinds = () => GS_GAME_ORDER.map((k) => GS_GAMES[k].category).filter((c, i, a) => a.indexOf(c) === i);
export const gsFind = (q, k) => { const s = gsNorm(q); return !s || gsNorm(GS_GAMES[k].name).includes(s); };
export let GS_ADDED;
export let GS_LIB_READY;

// Load-time code, run by main.jsx in index.html's old tag order.
export function initGsDiscover() {
// Just added: newest first. Seed (the app has no release dates yet).
GS_ADDED = ['barrow', 'casebook', 'delve', 'escape'];
// ---- Library. GsLibrary is in gs-pass-library.jsx. GS_LIB_READY: each game's ready line, read by its rows.
GS_LIB_READY = { barrow: 'Chapter 1 is ready', word: 'Today’s word is ready', groups: 'Today’s groups are ready', mystery: 'Today’s case is ready', where: 'Today’s country is ready', chain: 'Today’s chain is ready', salvage: 'Today’s sea is ready', escape: 'This week’s room is ready', hunter: 'Today’s hunt is ready' };
}
