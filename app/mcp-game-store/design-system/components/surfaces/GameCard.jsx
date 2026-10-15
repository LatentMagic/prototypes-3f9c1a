import React from 'react';
// The one game card: picture, text (name and blurb), chips, always in that order and always all three slots. Works anywhere.
// Inside a CardRow the row shares the three lines; each card's chips are centred in the shared chip line (docs/specs/card-chip-alignment/).
export function GameCard({art,title,mark,blurb,tags,className='',style}){
  return <div className={('mcp-card mcp-gcard '+className).trim()} style={style}>
    <div className="mcp-gcard-art">{art}</div>
    <div className="mcp-gcard-text">
      <div className="mcp-gcard-name"><h3 className="mcp-t-card">{title}</h3>{mark}</div>
      <p className="mcp-gcard-blurb">{blurb}</p>
    </div>
    <div className="mcp-gcard-tags">{tags}</div>
  </div>;
}
