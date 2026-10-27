import React from 'react';
/* Measures the layer, which fills whatever it renders in: the viewport on a real device, or a phone frame (a transformed or contained ancestor) in a prototype. */
function useWide(ref,bp){
  const [w,setW]=React.useState(()=>typeof window!=='undefined'?window.innerWidth>=bp:true);
  React.useLayoutEffect(()=>{const el=ref.current;if(!el)return;
    const f=()=>{const x=el.offsetWidth;if(x)setW(x>=bp);};f();
    if(typeof ResizeObserver==='undefined'){window.addEventListener('resize',f);return()=>window.removeEventListener('resize',f);}
    const ro=new ResizeObserver(f);ro.observe(el);return()=>ro.disconnect();},[bp]);
  return w;
}
export function Popup({open,onClose,title,children,actions,kind='dialog',posture='auto',breakpoint=640,contained=false,busy=false,label}){
  const layer=React.useRef(null);
  const wide=useWide(layer,breakpoint);
  const panel=kind==='panel';
  const mode=!panel?'window':posture==='auto'?(wide?'window':'sheet'):posture;
  const ref=React.useRef(null);
  const opener=React.useRef(null);
  const dismiss=React.useRef(null);
  dismiss.current=()=>{if(!busy&&onClose)onClose();};
  React.useEffect(()=>{
    if(open){
      opener.current=document.activeElement;
      const t=setTimeout(()=>{const b=ref.current&&ref.current.querySelector('button,[href],input,select,textarea');b&&b.focus({preventScroll:true});},30);
      const k=e=>{if(e.key==='Escape')dismiss.current();};
      document.addEventListener('keydown',k);
      return()=>{clearTimeout(t);document.removeEventListener('keydown',k);};
    } else if(opener.current&&opener.current.focus){opener.current.focus({preventScroll:true});opener.current=null;}
  },[open]);
  return <div ref={layer} className={'mcp-layer'+(contained?' is-contained':'')+(open?' is-open':'')} aria-hidden={!open}>
    <div className="mcp-dim" onClick={()=>dismiss.current()}></div>
    <div ref={ref} className={'mcp-pop is-'+mode+' is-'+(panel?'panel':'dialog')} role={panel?'dialog':'alertdialog'} aria-modal="true" aria-label={label||title} aria-busy={busy||undefined}>
      {title&&<h3 className="mcp-t-card">{title}</h3>}
      <div className="mcp-pop-body">{children}</div>
      {actions&&<div className="mcp-btn-pair">{actions}</div>}
    </div>
  </div>;
}
