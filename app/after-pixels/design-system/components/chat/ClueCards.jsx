import React from 'react';
import { cbRich, cbFold } from './chat-press.js';
// What the player knows: one notebook card, a section per kind with its name and count, each fact its own ruled line. A fact learnt this turn is tinted and marked New.
// collapsible / collapsed: the card sits behind a disclosure headed by its title and the fact count; with one kind the title stands for it and the section heading is dropped.
export function ClueCards({groups=[],newLabel='New',title,collapsible=false,collapsed=false,className=''}){
  const fold=collapsible||collapsed, solo=fold&&groups.length===1;
  const sections=groups.map((g,i)=><section key={i} className="mcp-cb-clue" aria-label={g.kind}>
    {!solo&&<p className="mcp-cb-clue-h"><span className="mcp-cb-kind">{g.kind}</span><span className="mcp-cb-clue-n">{g.facts.length}</span></p>}
    <ul>{g.facts.map((f,k)=>{const t=typeof f==='string'?{text:f}:f;return <li key={k} className={t.new?'is-new':undefined}><span>{cbRich(t.text)}</span>{t.new&&<span className="mcp-cb-new">{newLabel}</span>}</li>;})}</ul>
  </section>);
  return <div className={('mcp-cb mcp-cb-clues mcp-cb-fence '+className).trim()}>
    {fold?cbFold({title:title||(solo?groups[0].kind:'Clues'),count:groups.reduce((n,g)=>n+g.facts.length,0),closed:collapsed},sections):sections}
  </div>;
}
