import React from 'react';
// Small labelled counters. grid lays them out as boxed cells: two across, three when there are three (the Result card uses it).
export function StatRow({items=[],grid=false,label,className=''}){
  return <dl className={('mcp-cb mcp-cb-stats'+(grid?' is-grid':'')+' '+className).trim()} aria-label={label} style={grid?{'--cols':items.length===3?3:Math.min(items.length,2)}:undefined}>
    {items.map((s,i)=><div key={i} className="mcp-cb-stat"><dt>{s.label}</dt><dd>{s.value}</dd></div>)}
  </dl>;
}
