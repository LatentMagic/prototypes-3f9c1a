import React from 'react';
import { usePress } from '../press.js';
import { Icon } from '../media/Icon.jsx';
// Working state: shows at once (a receipt for the press), then holds at least `min` ms so it never flickers.
function useHeld(on,min){
  const [held,setHeld]=React.useState(on);
  const t0=React.useRef(on?Date.now():0);
  React.useEffect(()=>{
    if(on){t0.current=Date.now();setHeld(true);return;}
    const left=min-(Date.now()-t0.current);
    if(left<=0){setHeld(false);return;}
    const id=setTimeout(()=>setHeld(false),left);return()=>clearTimeout(id);
  },[on]);
  return on||held;
}
export function Button({variant='main',children,loading=false,loadingLabel,done=false,doneLabel,disabled=false,block=false,icon,type='button',onClick,className='',...rest}){
  const {pressed,handlers}=usePress();
  const [auto,setAuto]=React.useState(false);
  const alive=React.useRef(true);
  React.useEffect(()=>()=>{alive.current=false;},[]);
  const busy=useHeld(loading||auto,400);
  const click=e=>{
    if(busy){e.preventDefault();return;}
    const r=onClick&&onClick(e);
    if(r&&typeof r.then==='function'){setAuto(true);const end=()=>{alive.current&&setAuto(false);};r.then(end,end);}
  };
  const v=variant==='secondary'?'mcp-btn-secondary':variant==='danger'?'mcp-btn-danger':'mcp-btn-main';
  const cls=['mcp-btn',v,block&&'is-block',pressed&&!disabled&&!busy&&'is-pressed',busy&&'is-busy',done&&!busy&&'is-done',className].filter(Boolean).join(' ');
  let content;
  if(busy) content=<><span className="mcp-spin" aria-hidden="true"></span>{loadingLabel||children}</>;
  else if(doneLabel!==undefined) content=<span className="mcp-swap"><span className="a">{icon&&<Icon name={icon}/>}{children}</span><span className="b" aria-hidden={!done}><Icon name="check"/>{doneLabel}</span></span>;
  else content=<>{icon&&<Icon name={icon}/>}{children}</>;
  return <button type={type} className={cls} disabled={disabled} aria-busy={busy||undefined} aria-disabled={busy||undefined} onClick={click} {...handlers} {...rest}>{content}</button>;
}
export function ButtonPair({children,className=''}){return <div className={('mcp-btn-pair '+className).trim()}>{children}</div>;}
