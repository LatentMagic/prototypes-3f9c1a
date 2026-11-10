import React from 'react';
// A step of how something goes, as a card: picture (2:1), name, one line. Built from GameCard's parts so it looks like one,
// but never a game: no chips, no Pass mark, no link, never pressable, so its art stays still.
export function StepCard({art,title,line,className='',style}){
  return <li className={('mcp-card mcp-scard '+className).trim()} style={style}>
    <div className="mcp-scard-art">{art}</div>
    <h3 className="mcp-t-card mcp-scard-name">{title}</h3>
    <p className="mcp-scard-line">{line}</p>
  </li>;
}
// The steps in order, in one plain grid that never scrolls sideways: two by two in a narrow row, four across from a 520px row.
// KEEP: the cards share three lines (picture, name, line) so each part starts level and every card is one height; the picture never stretches.
export function StepCards({label,children,className='',style}){
  return <div className={('mcp-scards-wrap '+className).trim()} style={style}><ol className="mcp-scards" aria-label={label}>{children}</ol></div>;
}
