import React from 'react';
import { Icon } from '../media/Icon.jsx';
// The one game card: picture, text (name and blurb), chips, always in that order and always all three slots. Works anywhere.
// Inside a CardRow the row shares the three lines; each card's chips are centred in the shared chip line (docs/specs/card-chip-alignment/).
export function GameCard({art,pass,title,mark,blurb,tags,className='',style}){
  return <div className={('mcp-card mcp-gcard '+className).trim()} style={style}>
    <div className="mcp-gcard-art">{art}{pass&&<span className="mcp-passmark"><Icon name="lock" size={14}/>Pass</span>}</div>
    <div className="mcp-gcard-text">
      <div className="mcp-gcard-name"><h3 className="mcp-t-card">{title}</h3>{mark}</div>
      <p className="mcp-gcard-blurb">{blurb}</p>
    </div>
    <div className="mcp-gcard-tags">{tags}</div>
  </div>;
}
