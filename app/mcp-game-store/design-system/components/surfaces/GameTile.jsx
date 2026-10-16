import React from 'react';
import { Icon } from '../media/Icon.jsx';
// A game tile for the all-games wall: square picture, name and kind. Smaller and plainer than a GameCard, for scanning and searching the whole catalogue.
export function GameTile({art,pass,title,kind,className='',style}){
  return <div className={('mcp-gtile '+className).trim()} style={style}>
    <div className="mcp-gtile-art">{art}{pass&&<span className="mcp-passmark"><Icon name="lock" size={14}/>Pass</span>}</div>
    <span className="mcp-gtile-name">{title}</span>
    {kind&&<span className="mcp-gtile-kind">{kind}</span>}
  </div>;
}
