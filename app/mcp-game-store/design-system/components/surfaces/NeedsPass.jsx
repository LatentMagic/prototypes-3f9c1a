import React from 'react';
import {Button} from '../actions/Button.jsx';
// Needs the Pass ("What stays, what returns"): stands where a game's play control would be when the player cannot play without the Pass.
// Every line is built here by rule from platform facts; no game supplies its own wording.
const MON=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const fmt=s=>{const m=/^(\d{4})-(\d{2})-(\d{2})/.exec(s||'');return m?(+m[3])+' '+MON[+m[2]-1]:String(s||'').toUpperCase();};
const count=(n,one,many)=>n+' '+(n===1?one:many);
export function needsPassCopy({game,word,words,record,total}){
  const many=words||(word?word+'s':'');
  const cadence=word?'Play every '+word+' as it comes out.':'Play the whole game.';
  if(!record){
    return {label:null,heading:game+' comes only with the Pass.',foot:null,rightLabel:'WHAT YOU GET',lines:[cadence,total?'Earn '+count(total,'achievement','achievements')+'.':null].filter(Boolean),action:'Get the Pass'};
  }
  const label=!word?'LAST PLAYED · '+fmt(record.last):'YOUR LAST '+word.toUpperCase()+' · '+(record.chapter!=null?record.chapter:fmt(record.last));
  const played=word&&record.played?'played '+count(record.played,word,many):null;
  const earned=record.earned?'earned '+count(record.earned,'achievement','achievements'):null;
  const foot=played||earned?'You '+[played,earned].filter(Boolean).join(' and ')+'.':null;
  return {label,heading:'You stopped here. Everything you earned is still yours.',foot,rightLabel:'WHAT COMES BACK',lines:[cadence,'Pick up where you stopped.'],action:'Get the Pass again'};
}
export function NeedsPass({game,word,words,record,total=0,onGet,className='',style}){
  const c=needsPassCopy({game,word,words,record,total});
  return <section className={('mcp-npass '+className).trim()} style={style} aria-label={c.heading}>
    <div className="mcp-npass-half">
      <span className="mcp-npass-label" aria-hidden={c.label?undefined:true}>{c.label||'\u00a0'}</span>
      <h3 className="mcp-t-sec">{c.heading}</h3>
      <div className="mcp-npass-foot">{c.foot&&<p className="mcp-npass-note">{c.foot}</p>}</div>
    </div>
    <div className="mcp-npass-half">
      <span className="mcp-npass-label">{c.rightLabel}</span>
      {c.lines.map((l,i)=><p key={i} className="mcp-npass-line">{l}</p>)}
      <div className="mcp-npass-foot"><Button variant="secondary" onClick={onGet}>{c.action}</Button></div>
    </div>
  </section>;
}
