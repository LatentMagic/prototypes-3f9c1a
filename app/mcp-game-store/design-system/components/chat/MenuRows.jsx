import React from 'react';
import { Icon } from '../media/Icon.jsx';
import { cbPress } from './chat-press.js';
import { StatusTag } from './StatusTag.jsx';
const Art=({art,icon})=>typeof art==='string'?(art.trim().startsWith('<svg')?<span className="mcp-cb-mart" aria-hidden="true" dangerouslySetInnerHTML={{__html:art}}/>:<span className="mcp-cb-mart" aria-hidden="true"><img src={art} alt=""/></span>):<span className={'mcp-cb-mart'+(art?'':' is-icon')} aria-hidden="true">{art||(icon&&<Icon name={icon} size={18}/>)}</span>;
// One row per entry (a game, a saved run): art, name, one line, its status, and an action that goes there. The one part that may hold a text field.
export function MenuRows({items=[],search,onGo,onSearch,label,className=''}){
  return <div className={('mcp-cb mcp-cb-fence mcp-cb-menu '+className).trim()} role="group" aria-label={label||'Menu'}>
    {search&&<label className="mcp-cb-search"><Icon name="search" size={16}/><input type="search" placeholder={search} aria-label={search} readOnly={!onSearch} tabIndex={onSearch?undefined:-1} onChange={onSearch?(e=>onSearch(e.target.value)):undefined}/></label>}
    <ul>{items.map((it,i)=>{
      const act=typeof it.action==='string'?{label:it.action}:it.action;
      const st=typeof it.status==='string'?{label:it.status,tone:'idle'}:it.status;
      return <li key={i} className="mcp-cb-mrow">
        <Art art={it.art} icon={it.icon}/>
        <span className="mcp-cb-mtext"><b>{it.name}</b>{it.line&&<small>{it.line}</small>}{(st||it.meta)&&<span className="mcp-cb-mmeta">{st&&<StatusTag tone={st.tone||'idle'}>{st.label}</StatusTag>}{it.meta&&<span>{it.meta}</span>}</span>}</span>
        {act&&cbPress(onGo&&(()=>onGo(it,i)),{className:'mcp-cb-go'},<>{act.icon&&<Icon name={act.icon} size={16}/>}<span className="mcp-cb-go-t">{act.label}</span></>)}
      </li>;})}</ul>
  </div>;
}
