import React from 'react';
import { cbRich, cbFold } from './chat-press.js';
// Labelled facts, one per line: what was named, what the player carries, where the game stands.
// collapsible / collapsed: the rows sit behind a disclosure headed by the title and the row count.
export function FactRows({items=[],plain=false,label,title,collapsible=false,collapsed=false,className=''}){
  const fold=collapsible||collapsed;
  const rows=<dl className={('mcp-cb mcp-cb-facts'+(plain||fold?'':' mcp-cb-fence')+' '+className).trim()} aria-label={label||title}>
    {items.map((f,i)=><div key={i}><dt>{f.label}</dt><dd>{cbRich(f.value)}</dd></div>)}
  </dl>;
  if(!fold) return rows;
  return <div className={('mcp-cb mcp-cb-fence '+className).trim()}>{cbFold({title:title||label||'Details',count:items.length,closed:collapsed,pad:true},React.cloneElement(rows,{className:'mcp-cb-facts'}))}</div>;
}
