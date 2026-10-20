import React from 'react';
import { Icon } from '../media/Icon.jsx';
import { cbPress, cbRich } from './chat-press.js';
import { FactRows } from './FactRows.jsx';
// A final move asked back before it lands. Cancel first, Confirm second. answer shows which one the player gave.
export function ConfirmCard({title,question,facts,note,confirm='Confirm',cancel='Cancel',answer,onConfirm,onCancel,className=''}){
  const done=answer==='confirm'||answer==='cancel';
  const btn=(k,text,on,main)=>{const p=answer===k;return cbPress(!done&&on,{className:'mcp-cb-choice'+(main?' is-main':'')+(p?' is-picked':done?' is-spent':''),'aria-pressed':p},<>{p&&<Icon name="check" size={14}/>}{text}</>);};
  return <div className={('mcp-cb mcp-cb-fence mcp-cb-card mcp-cb-confirm '+className).trim()} role="group" aria-label={title||'Confirm'}>
    {title&&<p className="mcp-cb-title">{title}</p>}
    {question&&<p className="mcp-cb-q">{cbRich(question)}</p>}
    {facts&&facts.length>0&&<FactRows items={facts} plain/>}
    {note&&<p className="mcp-cb-note">{note}</p>}
    <div className="mcp-cb-pair">{btn('cancel',cancel,onCancel,false)}{btn('confirm',confirm,onConfirm,true)}</div>
  </div>;
}
