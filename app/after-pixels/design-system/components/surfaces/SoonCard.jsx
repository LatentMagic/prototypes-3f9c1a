import React from 'react';
import {Tag} from '../feedback/Tag.jsx';
// A game, or a game's next chapter, that is not out yet. Cover beside label, name, line, the Coming soon chip.
// The card is not a way in. A chapter of a game that is out adds one pressable chip (Play chapter 1) after Coming soon, on the same row; it wraps under only when the row is too narrow.
export function SoonCard({art,label,title,line,play,onPlay,playHref,className='',style}){
  const P=playHref?'a':'button';
  return <div className={('mcp-card mcp-soon '+className).trim()} style={style}>
    <div className="mcp-soon-art">{art}</div>
    <div className="mcp-soon-body">
      {label&&<span className="mcp-soon-label">{label}</span>}
      <h3 className="mcp-t-card">{title}</h3>
      {line&&<p className="mcp-soon-line">{line}</p>}
      <div className="mcp-soon-tags"><Tag kind="daily">Coming soon</Tag>{play&&<P className="mcp-soon-play" href={playHref} type={playHref?undefined:'button'} onClick={onPlay}><Tag kind="open" icon="play">{play}</Tag></P>}</div>
    </div>
  </div>;
}
