import React from 'react';
import { cbRich } from './chat-press.js';
// Labelled facts, one per line: what was named, what the player carries, where the game stands.
export function FactRows({items=[],plain=false,label,className=''}){
  return <dl className={('mcp-cb mcp-cb-facts'+(plain?'':' mcp-cb-fence')+' '+className).trim()} aria-label={label}>
    {items.map((f,i)=><div key={i}><dt>{f.label}</dt><dd>{cbRich(f.value)}</dd></div>)}
  </dl>;
}
