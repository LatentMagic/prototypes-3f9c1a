import React from 'react';
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
