import React from 'react';
import { gameMark } from './game-mark.jsx';
// A game tile for the all-games wall: square picture, name and kind. Smaller and plainer than a GameCard, for scanning and searching the whole catalogue.
export function GameTile({art,pass,onPass,first,soon,title,kind,className='',style}){
  const m=gameMark({soon,pass,onPass,first});
  return <div className={('mcp-gtile '+(soon?'is-soon ':'')+className).trim()} style={style}>
    <div className="mcp-gtile-art">{art}{m}</div>
    <span className="mcp-gtile-name">{title}</span>
    {kind&&<span className="mcp-gtile-kind">{kind}</span>}
  </div>;
}
