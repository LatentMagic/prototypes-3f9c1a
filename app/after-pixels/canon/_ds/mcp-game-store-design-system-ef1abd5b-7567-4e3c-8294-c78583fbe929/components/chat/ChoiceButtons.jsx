import React from 'react';
import { Icon } from '../media/Icon.jsx';
import { cbPress } from './chat-press.js';
// Moves offered at the foot of an AI turn. Each sends the move it names. Once one is taken (picked), it shows pressed and the rest are spent.
export function ChoiceButtons({items=[],picked,onChoose,label,className=''}){
  const done=picked!=null;
  return <div className={('mcp-cb mcp-cb-choices '+className).trim()} role="group" aria-label={label||'Moves'}>
    {items.map((it,i)=>{const t=typeof it==='string'?it:it.label;const p=done&&(picked===i||picked===t);
      return cbPress(onChoose&&!done&&(()=>onChoose(t,i)),{key:i,className:'mcp-cb-choice'+(p?' is-picked':done?' is-spent':''),'aria-pressed':p},<>{p&&<Icon name="check" size={14}/>}{t}</>);})}
  </div>;
}
