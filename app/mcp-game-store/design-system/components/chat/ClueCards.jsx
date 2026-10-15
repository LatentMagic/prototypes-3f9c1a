import React from 'react';
import { cbRich } from './chat-press.js';
// What the player knows: one notebook card, a section per kind with its name and count, each fact its own ruled line. A fact learnt this turn is tinted and marked New.
export function ClueCards({groups=[],newLabel='New',className=''}){
  return <div className={('mcp-cb mcp-cb-clues mcp-cb-fence '+className).trim()}>
    {groups.map((g,i)=><section key={i} className="mcp-cb-clue" aria-label={g.kind}>
      <p className="mcp-cb-clue-h"><span className="mcp-cb-kind">{g.kind}</span><span className="mcp-cb-clue-n">{g.facts.length}</span></p>
      <ul>{g.facts.map((f,k)=>{const t=typeof f==='string'?{text:f}:f;return <li key={k} className={t.new?'is-new':undefined}><span>{cbRich(t.text)}</span>{t.new&&<span className="mcp-cb-new">{newLabel}</span>}</li>;})}</ul>
    </section>)}
  </div>;
}
