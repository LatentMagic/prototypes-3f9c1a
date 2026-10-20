import React from 'react';
import {usePress} from '../press.js';
import {Icon} from '../media/Icon.jsx';
// The canonical row (canonical-row 19E, approved 2026-10-15). A slotted row is two 20px lines at every width. The row enforces its
// rules instead of trusting the screen: it builds the title from its parts, picks each text's form to fit, and warns once per problem.
const said=new Set();
const warn=(m)=>{if(!said.has(m)){said.add(m);console.warn('ListRow: '+m);}};
const isText=(v)=>typeof v==='string'||typeof v==='number';
const toForms=(v)=>{if(isText(v))return [String(v)];if(Array.isArray(v)&&v.length&&v.every(isText))return v.map(String);return null;};
const over=(el)=>el.scrollWidth>el.clientWidth+0.5;
// The longest form that fits; the last form if none does (CSS cuts it with "…").
const pick=(el,forms,what)=>{for(const f of forms){el.textContent=f;if(!over(el))return;}warn(what+' "'+forms[forms.length-1]+'" doesn\u2019t fit even in its shortest form; pass a shorter form last.');};
// Title: name, then " · game". Too long: the game goes first, whole; then the name is cut, with no space or dot before the "…".
const fitTitle=(t,n,g,full)=>{
  if(g)g.style.display='';
  n.textContent=full;if(!over(t))return;
  if(g){g.style.display='none';if(!over(t))return;}
  const at=(k)=>full.slice(0,k).replace(/[\s\u00b7,\u2013-]+$/,'')+'\u2026';
  let lo=0,hi=full.length;
  while(lo<hi){const m=(lo+hi+1)>>1;n.textContent=at(m);if(!over(t))lo=m;else hi=m-1;}
  n.textContent=at(lo);
};
export function RowList({children,label,className=''}){
  return <ul className={('mcp-rows '+className).trim()} aria-label={label}>{React.Children.map(children,(c,i)=>c&&<li key={i}>{c}</li>)}</ul>;
}
export function ListRow({title,game,lead,result,tone='none',when,replay,note,meta,end,sub=false,href,onClick,label,muted=false,className=''}){
  const {pressed,handlers}=usePress();
  const row=React.useRef(null),tRef=React.useRef(null),nRef=React.useRef(null),gRef=React.useRef(null),sRef=React.useRef(null),wRef=React.useRef(null);
  if(note!=null&&note!=='Replay')warn('note is gone; Replay is on or off (replay). "'+note+'" is shown as Replay.');
  const rep=!!replay||note!=null;
  const rF=toForms(result),wF=toForms(when);
  const live=!!(href||onClick);
  const slots=sub||result!=null||when!=null||rep;
  const hasLead=!!lead&&!sub;
  if(game&&!sub&&!hasLead)warn('game shows only beside a cover, in a list that mixes games; "'+game+'" is dropped.');
  const gameOn=!!game&&hasLead&&slots;
  const tText=isText(title);
  const fitKey=JSON.stringify([slots,tText&&String(title),gameOn&&game,rF,wF]);
  React.useLayoutEffect(()=>{
    const r=row.current;if(!r||!slots)return undefined;
    const run=()=>{
      const narrow=r.clientWidth<440;
      if(wRef.current&&wF)pick(wRef.current,narrow?wF.slice(-1):wF,'when');
      if(sRef.current&&rF)pick(sRef.current,narrow?rF.slice(-1):rF,'result');
      if(tRef.current&&nRef.current)fitTitle(tRef.current,nRef.current,gRef.current,String(title));
    };
    run();if(document.fonts)document.fonts.ready.then(run);
    const ro=new ResizeObserver(run);ro.observe(r);return()=>ro.disconnect();
  },[fitKey]);
  if(end!=null&&slots)warn('a row with a result, when or Replay takes no end Tag; it is dropped.');
  const cls=('mcp-row'+(live?' is-link':'')+(end!=null&&!sub&&!slots?' has-end':'')+(hasLead?' has-lead':'')+(slots?' is-slots':'')+(slots&&result!=null?' has-result':'')+(slots&&rep?' has-note':'')+(sub?' is-sub':'')+(muted?' is-muted':'')+(pressed?' is-pressed':'')+' '+className).trim();
  const go=live?<Icon name="next" size={20} className="mcp-row-go"/>:<span className="mcp-row-go" aria-hidden="true"></span>;
  const leadEl=hasLead&&<span className="mcp-row-lead" aria-hidden="true">{lead}</span>;
  const endEl=end!=null&&!sub&&<span className="mcp-row-end">{end}</span>;
  const icon=tone==='ok'?'check':tone==='bad'?'error':null;
  const gameEl=gameOn&&<span className="mcp-row-game" ref={gRef}>{' \u00b7 '+game}</span>;
  const inner=slots
    ?<>{leadEl}{!sub&&<span className="mcp-row-head"><span className="mcp-row-title" ref={tRef}>{tText?<span ref={nRef}></span>:title}{gameEl}</span></span>}{result!=null&&<span className={'mcp-row-st is-'+tone}>{icon&&<Icon name={icon} size={16}/>}<span ref={sRef}>{rF?null:result}</span></span>}{when!=null&&<span className="mcp-row-when" ref={wRef}>{wF?null:when}</span>}{rep&&<span className="mcp-row-note">Replay</span>}{go}</>
    :<>{leadEl}<span className="mcp-row-body"><span className="mcp-row-title">{title}</span>{meta&&<span className="mcp-row-meta">{meta}</span>}</span>{endEl}{go}</>;
  // Text the row hides to fit (the game's name, longer forms) stays in the accessible name.
  const name=label||(slots&&(tText||sub)?[!sub&&String(title),gameOn&&game,rep&&'Replay',rF&&rF[0],wF&&wF[0]].filter(Boolean).join(', '):undefined);
  if(!live) return <div ref={row} className={cls} aria-label={slots?name:undefined} role={slots&&name?'group':undefined}>{inner}</div>;
  return href
    ? <a ref={row} href={href} onClick={onClick} className={cls} aria-label={name} {...handlers}>{inner}</a>
    : <button ref={row} type="button" onClick={onClick} className={cls} aria-label={name} {...handlers}>{inner}</button>;
}
