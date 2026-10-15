import React from 'react';
// One of Discover's two picks: a featured game. A 3:1 picture, a label, the name and blurb, tags. Two side by side in .mcp-gpicks line up.
export function GamePick({art,label,title,blurb,tags,className='',style}){
  return <div className={('mcp-card mcp-gpick '+className).trim()} style={style}>
    <div className="mcp-gpick-art">{art}</div>
    <div className="mcp-gpick-text"><span className="mcp-gpick-label">{label}</span><h3 className="mcp-t-card">{title}</h3><p className="mcp-gpick-blurb">{blurb}</p></div>
    <div className="mcp-gpick-tags">{tags}</div>
  </div>;
}
