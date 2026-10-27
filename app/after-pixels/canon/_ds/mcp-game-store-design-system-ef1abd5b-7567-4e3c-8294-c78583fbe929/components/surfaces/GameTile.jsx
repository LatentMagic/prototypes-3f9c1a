import React from 'react';
import { Icon } from '../media/Icon.jsx';
// A game tile for the all-games wall: square picture, name and kind. Smaller and plainer than a GameCard, for scanning and searching the whole catalogue.
export function GameTile({art,pass,onPass,title,kind,className='',style}){
  const m=pass&&(onPass?<button type="button" className="mcp-passmark is-link" onClick={e=>{e.stopPropagation();onPass(e);}}><Icon name="lock" size={14}/>Pass</button>:<span className="mcp-passmark"><Icon name="lock" size={14}/>Pass</span>);
  return <div className={('mcp-gtile '+className).trim()} style={style}>
    <div className="mcp-gtile-art">{art}{m}</div>
    <span className="mcp-gtile-name">{title}</span>
    {kind&&<span className="mcp-gtile-kind">{kind}</span>}
  </div>;
}
