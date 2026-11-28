import React from 'react';
import {CardRow} from './CardRow.jsx';
// Options as tiles, one picked at a time, and the panel the picked one controls, with a notch on the panel's edge pointing at the picked tile.
// The picker owns which option is picked, the pointer, and coping with more options than fit in the row. A page owns its own arrangement and content: it may draw the tiles itself (renderTile), put a box between tiles and panel (aside), and choose where the pointer lands.
// A group of toggle buttons (aria-pressed), not ARIA tabs: a tablist may own only tabs, and a tile can hold an icon and a name.
// the notch is placed by measuring the picked tile (or the aside) against the panel, so it follows any arrangement, glides to a newly picked tile, tracks a row that scrolls sideways without trailing it, and hides once its tile is out of view.
const reveal=(el)=>{
  const tile=el.closest('[data-np-tile]')||el,track=tile.parentElement;
  if(!track||track.scrollWidth<=track.clientWidth+1)return;
  const r=tile.getBoundingClientRect(),b=track.getBoundingClientRect();
  const d=r.left<b.left?r.left-b.left-4:r.right>b.right?r.right-b.right+4:0;
  const still=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(d)track.scrollBy({left:d,behavior:still?'auto':'smooth'});
};
export function NotchPicker({label,options,value,defaultValue=null,onChange,children,closable=false,row,renderTile,tilesClassName='',tilesStyle,aside,pointer='top',target='tile',panelProps,className='',style}){
  const [own,setOwn]=React.useState(defaultValue);
  const picked=value===undefined?own:value;
  const at=options.findIndex(o=>o.id===picked);
  const base=(React.useId?React.useId():'np').replace(/:/g,'');
  const panelId=base+'-panel';
  const root=React.useRef(null),notch=React.useRef(null),last=React.useRef({id:null,mode:null});
  const mode=pointer+':'+target;
  const press=(id,el)=>{
    if(id===picked&&!closable)return;
    const next=id===picked?null:id;
    if(value===undefined)setOwn(next);
    if(onChange)onChange(next);
    if(next!==null)reveal(el);
  };
  React.useLayoutEffect(()=>{
    const r=root.current,n=notch.current;if(!r||!n)return undefined;
    const btn=r.querySelector('[aria-pressed="true"][aria-controls="'+panelId+'"]');if(!btn)return undefined;
    const tile=btn.closest('[data-np-tile]')||btn,track=tile.parentElement;
    const place=(glide)=>{
      const pointed=target==='aside'?r.querySelector('[data-np-aside]'):tile;if(!pointed)return;
      const pr=n.parentElement.getBoundingClientRect(),tr=pointed.getBoundingClientRect();
      n.style.transition=glide?'':'none';
      if(pointer==='side'){n.style.left='';n.style.visibility='';n.style.top=(tr.top+Math.min(tr.height/2,40)-pr.top)+'px';}
      else{const x=tr.left+tr.width/2-pr.left;n.style.top='';n.style.visibility=x<16||x>pr.width-16?'hidden':'';n.style.left=x+'px';}
    };
    place(last.current.id!==null&&last.current.id!==picked&&last.current.mode===mode);
    last.current={id:picked,mode};
    const follow=()=>place(false);
    if(track)track.addEventListener('scroll',follow,{passive:true});
    const ro=window.ResizeObserver?new ResizeObserver(follow):null;if(ro){ro.observe(r);ro.observe(tile);}
    return ()=>{if(track)track.removeEventListener('scroll',follow);if(ro)ro.disconnect();};
  },[picked,mode,options.length,panelId,pointer,target]);
  const icons=options.some(o=>o.icon);
  const scrolls=!!row||options.length>4;
  const tiles=options.map(o=>{
    const on=o.id===picked;
    const buttonProps={id:base+'-'+o.id,type:'button','aria-pressed':on,'aria-controls':panelId,...(closable?{'aria-expanded':on}:null),onClick:(e)=>press(o.id,e.currentTarget)};
    if(renderTile)return <React.Fragment key={o.id}>{renderTile(o,{on,buttonProps})}</React.Fragment>;
    return <button key={o.id} {...buttonProps} className="mcp-np-tile" data-np-tile="">
      {o.icon&&<span className="mcp-np-icon" aria-hidden="true">{o.icon}</span>}
      <span className="mcp-np-name">{o.label}</span>
    </button>;
  });
  const {className:panelClass='',...panelRest}=panelProps||{};
  return <div ref={root} className={('mcp-np'+(icons?' has-icons':'')+(scrolls?' is-scroll':'')+(row?' has-row':'')+' '+className).trim()} data-pointer={pointer} style={{'--np-n':options.length,...style}}>
    {row?<CardRow title={row.title} sub={row.sub} label={row.label||label}>{tiles}</CardRow>
      :<div className={('mcp-np-tiles '+tilesClassName).trim()} role="group" aria-label={label} style={tilesStyle}>{tiles}</div>}
    {aside}
    <div {...panelRest} className={('mcp-np-panel '+panelClass).trim()} id={panelId} role="region" aria-labelledby={at<0?undefined:base+'-'+picked} hidden={at<0}>
      <i ref={notch} className="mcp-np-notch" aria-hidden="true"/>
      <div className="mcp-np-body">{at<0?null:typeof children==='function'?children(picked):children}</div>
    </div>
  </div>;
}
