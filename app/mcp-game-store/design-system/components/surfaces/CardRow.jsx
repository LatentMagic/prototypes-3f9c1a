import React from 'react';
import {Icon} from '../media/Icon.jsx';
// A row of cards that scrolls sideways when they don't fit. Previous and Next sit on the heading's line, only while the row overflows.
export function CardRow({title,sub,label,as='h2',kind='cards',children,className=''}){
  const ref=React.useRef(null),prev=React.useRef(null),next=React.useRef(null),pressed=React.useRef(null);
  const [at,setAt]=React.useState({over:false,start:true,end:true});
  React.useLayoutEffect(()=>{
    const el=ref.current;if(!el)return undefined;
    const read=()=>{const over=el.scrollWidth>el.clientWidth+1,start=el.scrollLeft<=1,end=el.scrollLeft+el.clientWidth>=el.scrollWidth-1;
      setAt(a=>a.over===over&&a.start===start&&a.end===end?a:{over,start,end});};
    read();el.addEventListener('scroll',read,{passive:true});
    const ro=window.ResizeObserver?new ResizeObserver(read):null;if(ro)ro.observe(el);
    return ()=>{el.removeEventListener('scroll',read);if(ro)ro.disconnect();};
  },[]);
  // A button that reaches its end hides; focus moves to the other one.
  React.useEffect(()=>{
    if(pressed.current==='next'&&at.end&&prev.current){prev.current.focus({preventScroll:true});pressed.current='prev';}
    else if(pressed.current==='prev'&&at.start&&next.current){next.current.focus({preventScroll:true});pressed.current='next';}
  },[at.start,at.end]);
  const move=d=>{const el=ref.current;if(!el)return;pressed.current=d>0?'next':'prev';
    const c=el.firstElementChild,gap=parseFloat(getComputedStyle(el).columnGap)||24,step=c?c.getBoundingClientRect().width+gap:el.clientWidth*.8;
    const still=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({left:d*step,behavior:still?'auto':'smooth'});};
  const T=as,name=label||(typeof title==='string'?title:'Cards'),n=React.Children.count(children);
  return <div className={('mcp-crow'+(kind==='chat'?' is-chat':'')+' '+className).trim()}>
    <div className="mcp-crow-head">
      <T className="mcp-t-sec mcp-crow-title">{title}</T>
      {at.over&&<div className="mcp-crow-nav">
        <button ref={prev} type="button" className="mcp-crow-btn" aria-label={'Previous, '+name} style={at.start?{visibility:'hidden'}:null} onClick={()=>move(-1)}><Icon name="next" style={{transform:'rotate(180deg)'}}/></button>
        <button ref={next} type="button" className="mcp-crow-btn" aria-label={'Next, '+name} style={at.end?{visibility:'hidden'}:null} onClick={()=>move(1)}><Icon name="next"/></button>
      </div>}
      {sub&&<p className="mcp-crow-sub">{sub}</p>}
    </div>
    <div ref={ref} className="mcp-crow-track" role="region" aria-label={name} tabIndex={0} style={{'--n':n}}>{children}</div>
  </div>;
}
