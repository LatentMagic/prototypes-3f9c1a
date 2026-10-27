import React from 'react';
import {usePress} from '../press.js';
import {Icon} from '../media/Icon.jsx';
export function Card({title,action,children,className='',style,href,onClick,label,chevron=true}){
  const {pressed,handlers}=usePress();
  const live=!!(href||onClick);
  if(!live){
    const head=action?<div className="mcp-card-head">{title?<h3 className="mcp-t-card">{title}</h3>:<span></span>}{action}</div>:title&&<h3 className="mcp-t-card">{title}</h3>;
    return <div className={('mcp-card '+className).trim()} style={style}>{head}{children}</div>;
  }
  const cls=('mcp-card is-link'+(chevron?'':' no-go')+(pressed?' is-pressed':'')+' '+className).trim();
  const inner=<><span className="mcp-card-body">{title&&<h3 className="mcp-t-card">{title}</h3>}{children}</span>{chevron&&<Icon name="next" size={20} className="mcp-card-go"/>}</>;
  return href
    ? <a href={href} onClick={onClick} className={cls} style={style} aria-label={label} {...handlers}>{inner}</a>
    : <button type="button" onClick={onClick} className={cls} style={style} aria-label={label} {...handlers}>{inner}</button>;
}
export function Heading({level='card',children,as}){
  const map={page:['h1','mcp-t-page'],section:['h2','mcp-t-sec'],card:['h3','mcp-t-card']};
  const [tag,cls]=map[level]||map.card;
  const T=as||tag;
  return <T className={cls}>{children}</T>;
}
