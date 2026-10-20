import React from 'react';
import { Icon } from '../media/Icon.jsx';
import { cbPress } from './chat-press.js';
// Buttons that go somewhere instead of playing: Show games, Back to games, Play again, Open in browser. out: leaves the chat, and says so.
export function NavButtons({items=[],stack=false,onGo,label,className=''}){
  return <div className={('mcp-cb mcp-cb-nav'+(stack?' is-stack':'')+' '+className).trim()} role="group" aria-label={label||'Go to'}>
    {items.map((it,i)=>{
      const cls='mcp-cb-go'+(it.out?' is-out':'');
      const body=<>{it.icon&&<Icon name={it.icon} size={16}/>}<span className="mcp-cb-go-t">{it.label}{it.out&&<small>{it.note||'Opens in your browser'}</small>}</span>{it.out&&<Icon name="out" size={16} className="mcp-cb-go-out"/>}</>;
      if(it.href) return <a key={i} className={cls} href={it.href} target={it.out?'_blank':undefined} rel={it.out?'noopener':undefined}>{body}</a>;
      return cbPress(onGo&&(()=>onGo(it,i)),{key:i,className:cls},body);})}
  </div>;
}
