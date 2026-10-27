import React from 'react';
import { Icon } from '../media/Icon.jsx';
// The one game card: picture, text (name and blurb), chips, always in that order and always all three slots. Works anywhere.
// Inside a CardRow the row shares the three lines; each card's chips are centred in the shared chip line.
export function GameCard({art,pass,onPass,title,mark,blurb,tags,className='',style}){
  // The Pass mark is its own control when onPass is set (it opens the Pass page), sitting above the card's stretched link.
  const m=pass&&(onPass?<button type="button" className="mcp-passmark is-link" onClick={e=>{e.stopPropagation();onPass(e);}}><Icon name="lock" size={14}/>Pass</button>:<span className="mcp-passmark"><Icon name="lock" size={14}/>Pass</span>);
  return <div className={('mcp-card mcp-gcard '+className).trim()} style={style}>
    <div className="mcp-gcard-art">{art}{m}</div>
    <div className="mcp-gcard-text">
      <div className="mcp-gcard-name"><h3 className="mcp-t-card">{title}</h3>{mark}</div>
      <p className="mcp-gcard-blurb">{blurb}</p>
    </div>
    <div className="mcp-gcard-tags">{tags}</div>
  </div>;
}
