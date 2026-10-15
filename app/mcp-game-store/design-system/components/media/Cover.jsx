import React from 'react';
// The three example covers from the hand-off, verbatim. How shapes are assembled into a cover is not decided.
const ART={
'daily-puzzles':'<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"><rect width="100" height="100" fill="#1D1B3A"/><rect x="14" y="14" width="22" height="22" fill="#E5A63B"/><rect x="39" y="14" width="22" height="22" fill="#328A88"/><rect x="64" y="14" width="22" height="22" fill="#E5A63B"/><rect x="14" y="39" width="22" height="22" fill="#328A88"/><rect x="39" y="39" width="22" height="22" fill="#D66847"/><rect x="64" y="39" width="22" height="22" fill="#328A88"/><rect x="14" y="64" width="22" height="22" fill="#E5A63B"/><rect x="39" y="64" width="22" height="22" fill="#328A88"/><rect x="64" y="64" width="22" height="22" fill="#E5A63B"/></svg>',
'daily-puzzles-diagonal':'<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"><rect width="100" height="100" fill="#1D1B3A"/><rect x="14" y="14" width="22" height="22" fill="#E5A63B"/><rect x="39" y="39" width="22" height="22" fill="#D66847"/><rect x="64" y="64" width="22" height="22" fill="#328A88"/></svg>',
'weekly-interrogation':'<svg viewBox="0 0 171 108" preserveAspectRatio="xMidYMid slice"><rect width="171" height="108" fill="#421A28"/><circle cx="72" cy="54" r="36" fill="none" stroke="#D66847" stroke-width="14"/><rect x="104" y="20" width="14" height="68" fill="#F2EBE0"/><rect x="104" y="20" width="14" height="22" fill="#E5A63B"/></svg>',
'dungeon-quest':'<svg viewBox="0 0 171 108" preserveAspectRatio="xMidYMid slice"><rect width="171" height="108" fill="#163328"/><path d="M20,108 L62,36 L104,108Z" fill="#E5A63B"/><path d="M66,108 L112,22 L158,108Z" fill="#A390B2"/><path d="M66,108 L85,72.5 L104,108Z" fill="#328A88"/></svg>',
'dungeon-quest-single':'<svg viewBox="0 0 171 108" preserveAspectRatio="xMidYMid slice"><rect width="171" height="108" fill="#163328"/><path d="M66,108 L112,22 L158,108Z" fill="#A390B2"/></svg>'};
// Each example declares its ground and how it extends (guidelines/game-art-motion.md "Extending a cover").
const META={'daily-puzzles':['indigo','centre'],'daily-puzzles-diagonal':['indigo','centre'],'weekly-interrogation':['wine','centre'],'dungeon-quest':['forest','bottom'],'dungeon-quest-single':['forest','bottom']};
export function Cover({name,art,src,children,onClick,fill=false,ground,extend,className=''}){
  const m=META[art]||[];const g=ground||m[0]||'indigo';const x=extend||m[1];
  if(fill&&!x&&typeof console!=='undefined')console.warn('Cover: fill needs the asset to declare extend ("bottom" or "centre").');
  const cls='mcp-cover'+(fill?' is-fill is-'+g+' from-'+(x||'centre'):'')+(className?' '+className:'');
  const inner=children?children:src?<img src={src} alt=""/>:ART[art]?<span style={{display:'contents'}} dangerouslySetInnerHTML={{__html:ART[art]}}/>:null;
  const Tag=onClick?'button':'figure';
  return <Tag className={cls} onClick={onClick} type={onClick?'button':undefined} style={onClick?{background:'none',border:0,padding:0,cursor:'pointer',textAlign:'left',color:'inherit',font:'inherit'}:undefined}>
    {!children&&!src&&ART[art]?<div className="mcp-cover-art" aria-hidden="true" dangerouslySetInnerHTML={{__html:ART[art]}}/>:<div className="mcp-cover-art" aria-hidden="true">{inner}</div>}
    {name&&(onClick?<span className="mcp-cover-name">{name}</span>:<figcaption className="mcp-cover-name">{name}</figcaption>)}
  </Tag>;
}
