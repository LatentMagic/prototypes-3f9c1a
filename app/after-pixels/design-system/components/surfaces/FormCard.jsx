import React from 'react';
export function FormCard({title,children,className='',style}){
  return <div className={('mcp-panel '+className).trim()} style={style}>
    <svg className="mcp-deco" viewBox="0 0 120 76" aria-hidden="true"><rect x="84" y="0" width="36" height="44" fill="#328A88"/><rect x="56" y="0" width="28" height="28" fill="#EDE8DF"/><circle cx="102" cy="58" r="12" fill="#E5A63B"/></svg>
    <div className="mcp-panel-in">{title&&<h3 className="mcp-t-card">{title}</h3>}{children}</div>
  </div>;
}
