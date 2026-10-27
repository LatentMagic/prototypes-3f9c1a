import React from 'react';
import { usePress } from '../press.js';
import { Icon } from '../media/Icon.jsx';
export function Disclosure({title,children,defaultOpen=false}){
  const [open,setOpen]=React.useState(defaultOpen);
  const {pressed,handlers}=usePress();
  const id=(React.useId?React.useId():'d')+'-body';
  return <div className="mcp-disc">
    <button type="button" className={'mcp-disc-btn'+(pressed?' is-pressed':'')} aria-expanded={open} aria-controls={id} onClick={()=>setOpen(o=>!o)} {...handlers}><span>{title}</span><Icon name="down"/></button>
    <div className={'mcp-disc-body'+(open?' is-open':'')} id={id}><div>{typeof children==='string'?<p>{children}</p>:children}</div></div>
  </div>;
}
