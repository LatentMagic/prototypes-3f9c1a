import React from 'react';
// Game art. It moves only as the hover, focus and press response of the link or button it sits in (a clickable Card, ListRow or Cover, or an <a href>/<button> with class mcp-art-host); anywhere else it is still. Rules and descriptions: guidelines/game-art-motion.md.
const dg=()=><div className="mcp-art-dg">{[0,1,2,3].map(r=><div key={r}>{[0,1,2,3].map(c=><b key={c} style={{'--s':(r+3-c)*20}}/>)}</div>)}</div>;
const cb=()=><><i className="mcp-art-cb-bar mcp-art-cb-1"/><i className="mcp-art-cb-bar mcp-art-cb-2"/><i className="mcp-art-cb-bar mcp-art-cb-3"/><i className="mcp-art-cb-sun"/></>;
const hu=()=><><i className="mcp-art-hu-sun"/><i className="mcp-art-hu-peak"/><i className="mcp-art-hu-teal"/><i className="mcp-art-hu-cream"/></>;
const dm=()=><div className="mcp-art-st"><i className="mcp-art-dm-ring"/><i className="mcp-art-dm-bar"/><i className="mcp-art-dm-cap"/></div>;
const dw=()=><div className="mcp-art-st"><i className="mcp-art-dw mcp-art-dw-1"/><i className="mcp-art-dw mcp-art-dw-2"/><i className="mcp-art-dw mcp-art-dw-3"/></div>;
const PIECES={groups:{body:dg},casebook:{body:cb},hunter:{body:hu,bg:'forest'},mystery:{body:dm,bg:'wine'},word:{body:dw,bg:'forest'}};
const RATIO={square:'mcp-art-1',landscape:'mcp-art-43',wide:'mcp-art-3'};
export function GameArt({art,shape='landscape',className=''}){
  const p=PIECES[art];if(!p)return null;
  return <div className={('mcp-art '+RATIO[shape]+(p.bg?' is-'+p.bg+' ':' ')+className).trim()} aria-hidden="true">{p.body()}</div>;
}
