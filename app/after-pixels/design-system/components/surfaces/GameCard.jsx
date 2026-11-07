import React from 'react';
import { gameMark } from './game-mark.jsx';
// The one game card: picture, text (name and blurb), chips, always in that order and always all three slots. Works anywhere.
// Inside a CardRow the row shares the three lines; each card's chips are centred in the shared chip line.
export function GameCard({art,pass,onPass,first,soon,title,mark,blurb,tags,className='',style}){
  // The Pass mark is its own control when onPass is set (it opens the Pass page), sitting above the card's stretched link.
  const m=gameMark({soon,pass,onPass,first});
  return <div className={('mcp-card mcp-gcard '+(soon?'is-soon ':'')+className).trim()} style={style}>
    <div className="mcp-gcard-art">{art}{m}</div>
    <div className="mcp-gcard-text">
      <div className="mcp-gcard-name"><h3 className="mcp-t-card">{title}</h3>{mark}</div>
      <p className="mcp-gcard-blurb">{blurb}</p>
    </div>
    <div className="mcp-gcard-tags">{tags}</div>
  </div>;
}
