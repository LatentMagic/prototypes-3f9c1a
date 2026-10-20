import React from 'react';
export function PageGrid({children,split='main',className='',style}){
  return <div className="mcp-pgrid-wrap"><div className={('mcp-pgrid is-'+split+' '+className).trim()} style={style}>{children}</div></div>;
}
