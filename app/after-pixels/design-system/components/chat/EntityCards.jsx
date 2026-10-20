import React from 'react';
import { Icon } from '../media/Icon.jsx';
import { cbPress } from './chat-press.js';
// Things in the game (suspects, items, rooms, characters): a name and one line, in a compact grid. A picture only when there is real art or an icon.
export function EntityCards({title,items=[],onPick,className=''}){
  return <div className={('mcp-cb mcp-cb-ents '+className).trim()} role="group" aria-label={title||'In the game'}>
    {title&&<p className="mcp-cb-kind">{title}</p>}
    <ul className="mcp-cb-ents-list">{items.map((it,i)=>{
      const pic=it.pic?<img src={it.pic} alt=""/>:it.icon?<Icon name={it.icon} size={16}/>:null;
      return <li key={i}>{cbPress(onPick&&(()=>onPick(it,i)),{className:'mcp-cb-ent'+(it.state?' is-'+it.state:''),'aria-pressed':it.state==='picked'},<>
        {pic&&<span className={'mcp-cb-ent-pic '+(it.pic?'is-'+(it.tone||'cream'):'is-icon')} aria-hidden="true">{pic}</span>}
        <span className="mcp-cb-ent-t"><b>{it.name}</b>{it.line&&<small>{it.line}</small>}</span></>)}</li>;})}</ul>
  </div>;
}
