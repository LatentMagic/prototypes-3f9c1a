import React from 'react';
import { Icon } from '../media/Icon.jsx';
export function Menu({trigger,items=[],label,align='start',placement='below',defaultOpen=false}){
  const [open,setOpen]=React.useState(defaultOpen);
  const wrap=React.useRef(null),list=React.useRef(null),byUser=React.useRef(false);
  const id=React.useId();
  const opener=()=>wrap.current&&wrap.current.querySelector('[aria-haspopup]');
  const close=restore=>{setOpen(false);if(restore){const o=opener();o&&o.focus({preventScroll:true});}};
  React.useEffect(()=>{
    if(!open)return;
    let t;
    if(byUser.current){t=setTimeout(()=>{const b=list.current&&list.current.querySelector('[role=menuitem]');b&&b.focus({preventScroll:true});},20);}
    const out=e=>{if(wrap.current&&!wrap.current.contains(e.target))setOpen(false);};
    document.addEventListener('pointerdown',out);
    return()=>{clearTimeout(t);document.removeEventListener('pointerdown',out);};
  },[open]);
  const key=e=>{
    const bs=[...list.current.querySelectorAll('[role=menuitem]')];const i=bs.indexOf(document.activeElement);const go=n=>{e.preventDefault();bs[(n+bs.length)%bs.length].focus();};
    if(e.key==='Escape'){e.preventDefault();close(true);}
    else if(e.key==='ArrowDown')go(i+1);else if(e.key==='ArrowUp')go(i-1);else if(e.key==='Home')go(0);else if(e.key==='End')go(bs.length-1);
    else if(e.key==='Tab')setOpen(false);
  };
  const t=React.cloneElement(trigger,{'aria-haspopup':'menu','aria-expanded':open,'aria-controls':id,onClick:e=>{byUser.current=true;setOpen(o=>!o);trigger.props.onClick&&trigger.props.onClick(e);}});
  return <span className="mcp-menu-wrap" ref={wrap}>{t}
    <div id={id} ref={list} role="menu" aria-label={label} onKeyDown={key} className={'mcp-menu'+(align==='end'?' is-end':'')+(placement==='above'?' is-up':'')+(open?' is-open':'')}>
      {items.map((it,i)=><button key={i} type="button" role="menuitem" tabIndex={-1} className={'mcp-menu-item'+(it.danger?' is-danger':'')} onClick={()=>{close(true);it.onSelect&&it.onSelect();}}>{it.icon&&<Icon name={it.icon}/>}{it.label}</button>)}
    </div>
  </span>;
}
