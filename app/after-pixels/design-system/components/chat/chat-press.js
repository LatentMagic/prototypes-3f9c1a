import React from 'react';
import { Icon } from '../media/Icon.jsx';
// A chat part's button: a real <button> when the part is live (it was given a handler), an inert span when it is a picture (ChatPicture passes no handlers).
export function cbPress(on,props,children){
  if(on) return React.createElement('button',{type:'button',onClick:on,...props},children);
  const {['aria-pressed']:_p,disabled:_d,...rest}=props;
  return React.createElement('span',rest,children);
}
// **bold** in a string becomes <b>, so block data can stay plain JSON.
export function cbRich(t){
  if(typeof t!=='string') return t;
  return t.split(/\*\*(.+?)\*\*/g).map((s,i)=>i%2?React.createElement('b',{key:i},s):s);
}
// Optional fold for a card-style part: a native <details> (so a ChatPicture, which has no handlers, still opens), its summary the title, a count and a chevron. Always drawn with the summary; `closed` only sets whether the body starts hidden.
export function cbFold({title,count,closed,pad},children){
  return React.createElement('details',{className:'mcp-cb-fold',open:!closed},
    React.createElement('summary',{className:'mcp-cb-fold-s'},
      React.createElement('span',{className:'mcp-cb-fold-t'},title),
      count!=null&&React.createElement('span',{className:'mcp-cb-fold-n'},count),
      React.createElement(Icon,{name:'down',size:16})),
    React.createElement('div',{className:'mcp-cb-fold-b'+(pad?' is-pad':'')},children));
}
