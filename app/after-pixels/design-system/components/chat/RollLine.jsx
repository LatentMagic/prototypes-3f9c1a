import React from 'react';
import { StatusTag } from './StatusTag.jsx';
const TONE={hit:'won',weak:'warn',miss:'lost'};
const WORD={hit:'Hit',weak:'Weak hit',miss:'Miss'};
// One roll on one line: what was tried, the die, the bonus, the total against the number needed, and what happened.
export function RollLine({label,die='d20',roll,mod=0,total,target,result='hit',outcome,className=''}){
  const sum=total??(roll+mod);
  const text=outcome||WORD[result]||'';
  const say=(label?label+': ':'')+die+' rolled '+roll+(mod?(mod>0?' plus ':' minus ')+Math.abs(mod):'')+', '+sum+(target!=null?' against '+target:'')+'. '+text+'.';
  return <p className={('mcp-cb mcp-cb-roll '+className).trim()}>
    <span className="mcp-cb-sr">{say}</span>
    <span className="mcp-cb-roll-in" aria-hidden="true">{label&&<b>{label}</b>}<span className="mcp-cb-die">{die}</span><span className="mcp-cb-pip">{roll}</span>{mod!==0&&<span>{mod>0?'+ '+mod:'− '+Math.abs(mod)}</span>}<span>= <b>{sum}</b></span>{target!=null&&<span className="mcp-cb-roll-vs">vs {target}</span>}</span>
    <StatusTag tone={TONE[result]||'idle'} className="mcp-cb-roll-out">{text}</StatusTag>
  </p>;
}
