import React from 'react';
// The move row (1236 session pages): one line of a play's record, from ListRow's look. It opens nothing, so it has no chevron,
// hover or press. A game sends a label and its parts as plain strings, in the order played, and writes each line once.
const said=new Set();
const warn=(m)=>{if(!said.has(m)){said.add(m);console.warn('MoveRow: '+m);}};
const isText=(v)=>typeof v==='string'||typeof v==='number';
export function MoveList({children,label,className=''}){
  return <ol className={('mcp-rows mcp-moves '+className).trim()} aria-label={label}>{React.Children.map(children,(c,i)=>c&&<li key={i}>{c}</li>)}</ol>;
}
export function MoveRow({label,parts,className=''}){
  if(!isText(label))warn('label is plain text: the line\u2019s name ("Dexterity", "Guess 1").');
  const list=(Array.isArray(parts)?parts:parts==null?[]:[parts]).filter((p)=>{if(isText(p))return true;warn('parts are plain strings; a part that isn\u2019t is dropped.');return false;}).map(String);
  if(!list.length)warn('"'+label+'" has no parts; line two is empty.');
  // KEEP: each part is its own unit on line two: parts sit side by side with a 12px gap while they fit, a part that doesn't fit starts a new line, and a long part wraps within itself at spaces, never mid-word, so a long Delve turn and a short guess both read cleanly at 320px.
  // KEEP: between parts a hidden ", " so a screen reader and a copy read "CRANE, 1 in place, 1 elsewhere", not "CRANE1 in place".
  return <div className={('mcp-move '+className).trim()}>
    <span className="mcp-move-label">{label}</span>
    {list.length>0&&<span className="mcp-move-parts">{list.map((p,i)=><span key={i} className={i===0?'mcp-move-lead':'mcp-move-rest'}>{i>0&&<span className="mcp-move-sep">, </span>}{p}</span>)}</span>}
  </div>;
}
