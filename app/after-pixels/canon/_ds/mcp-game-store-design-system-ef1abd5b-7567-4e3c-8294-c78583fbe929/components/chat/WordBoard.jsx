import React from 'react';
import { cbPress } from './chat-press.js';
const TONES=['amber','teal','orange','lilac'];
// A grid of word chips the player picks from; each solved group becomes a band with its label, above the chips still in play.
export function WordBoard({words=[],solved=[],picked=[],cols=4,onPick,label,className=''}){
  const on=new Set(picked.map(w=>String(w).toUpperCase()));
  return <div className={('mcp-cb mcp-cb-fence mcp-cb-board '+className).trim()} style={{'--cols':cols}} role="group" aria-label={label||'Word board'}>
    {solved.map((g,i)=><div key={'s'+i} className={'mcp-cb-band is-'+(g.tone||TONES[i%4])}><b>{g.label}</b><span>{g.words.join(', ')}</span></div>)}
    {words.length>0&&<div className="mcp-cb-chips">{words.map(w=>{const p=on.has(w.toUpperCase());return cbPress(onPick&&(()=>onPick(w)),{key:w,className:'mcp-cb-chip'+(p?' is-picked':''),'aria-pressed':p},w);})}</div>}
  </div>;
}
