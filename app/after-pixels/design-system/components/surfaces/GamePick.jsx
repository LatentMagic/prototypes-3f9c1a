import React from 'react';
import { gameMark } from './game-mark.jsx';
// One of a pair of games featured by hand. A 3:1 picture, a label, the name and blurb, tags. Two side by side in .mcp-gpicks line up.
export function GamePick({art,pass,onPass,first,soon,label,title,blurb,tags,className='',style}){
  const m=gameMark({soon,pass,onPass,first});
  return <div className={('mcp-card mcp-gpick '+(soon?'is-soon ':'')+className).trim()} style={style}>
    <div className="mcp-gpick-art">{art}{m}</div>
    <div className="mcp-gpick-text"><span className="mcp-gpick-label">{label}</span><h3 className="mcp-t-card">{title}</h3><p className="mcp-gpick-blurb">{blurb}</p></div>
    <div className="mcp-gpick-tags">{tags}</div>
  </div>;
}
