import React from 'react';
import { Icon } from '../media/Icon.jsx';
// The one chip in a game picture's top-right corner, shared by GameCard, GamePick and GameTile. At most one shows:
// Coming soon first, then the Pass, then First free. A card's tag row holds two chips at most, so these never go there.
// - soon: "Coming soon", no lock. The card is dimmed behind it and cannot be pressed (is-soon on the card).
// - pass: lock and "Pass". With onPass it is its own button and opens the Pass page.
// - first: lock and "First free": only the game's first edition is free. Plain, never a control: the card itself opens the game.
export function gameMark({ soon, pass, onPass, first }) {
  if (soon) return <span className="mcp-passmark is-soon">Coming soon</span>;
  if (pass) return onPass
    ? <button type="button" className="mcp-passmark is-link" onClick={(e) => { e.stopPropagation(); onPass(e); }}><Icon name="lock" size={14} />Pass</button>
    : <span className="mcp-passmark"><Icon name="lock" size={14} />Pass</span>;
  if (first) return <span className="mcp-passmark"><Icon name="lock" size={14} />First free</span>;
  return null;
}
