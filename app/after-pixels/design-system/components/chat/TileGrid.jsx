import React from 'react';
const MARK={h:'hit',n:'near',x:'miss'};
const SAY={hit:'right place',near:'in it, wrong place',miss:'not in it',filled:''};
// Squares that hold a letter or nothing. Any length, any number of rows. Two or more rows are fenced as one unit.
export function TileGrid({rows=[],length,count,label,className=''}){
  const n=Math.max(1,length||Math.max(0,...rows.map(r=>(r.letters||'').length)));
  const all=[...rows];while(count&&all.length<count) all.push({letters:''});
  const grid=all.map(r=>Array.from({length:n},(_,i)=>{const c=((r.letters||'')[i]||' ').trim();const s=c?(MARK[(r.marks||'')[i]]||'filled'):'empty';return {c,s};}));
  const say=label||grid.map((row,i)=>'Row '+(i+1)+(row.every(x=>x.s==='empty')?' empty':': '+row.map(x=>x.c?x.c+(SAY[x.s]?' '+SAY[x.s]:''):'blank').join(', '))).join('. ');
  return <div className={('mcp-cb mcp-cb-tiles '+className).trim()} role="img" aria-label={say}>
    <div className={'mcp-cb-tiles-in'+(all.length>1?' mcp-cb-fence':'')} style={{'--n':n}}>
      {grid.map((row,i)=><div key={i} className="mcp-cb-tiles-row">{row.map((x,k)=><span key={k} className={'mcp-cb-tile is-'+x.s}>{x.c}</span>)}</div>)}
    </div>
  </div>;
}
