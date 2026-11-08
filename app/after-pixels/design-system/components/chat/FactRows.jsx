import React from 'react';
import { cbRich, cbFold } from './chat-press.js';
// Labelled facts, one per line: what was named, what the player carries, where the game stands.
// fold ('open' | 'closed'): the rows sit behind a disclosure headed by the title and the row count.
export function FactRows({items=[],plain=false,label,title,fold,className=''}){
  const folded=!!fold;
  const rows=<dl className={('mcp-cb mcp-cb-facts'+(plain||folded?'':' mcp-cb-fence')+' '+className).trim()} aria-label={label||title}>
    {items.map((f,i)=><div key={i}><dt>{f.label}</dt><dd>{cbRich(f.value)}</dd></div>)}
  </dl>;
  if(!folded) return rows;
  return <div className={('mcp-cb'+(plain?'':' mcp-cb-fence')+' '+className).trim()}>{cbFold({title:title||label||'Details',count:items.length,closed:fold==='closed',pad:true},React.cloneElement(rows,{className:'mcp-cb-facts'}))}</div>;
}
