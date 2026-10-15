import React from 'react';
// A game tile for the all-games wall: square picture, name and kind. Smaller and plainer than a GameCard, for scanning and searching the whole catalogue.
export function GameTile({art,title,kind,className='',style}){
  return <div className={('mcp-gtile '+className).trim()} style={style}>
    <div className="mcp-gtile-art">{art}</div>
    <span className="mcp-gtile-name">{title}</span>
    {kind&&<span className="mcp-gtile-kind">{kind}</span>}
  </div>;
}
