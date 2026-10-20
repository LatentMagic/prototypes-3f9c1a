import React from 'react';
export function Loader({size=64,label='Loading'}){
  return <span className="mcp-loader" role="status" aria-label={label} style={{width:size,height:size}}>
    <span className="mcp-loader-m" style={{zoom:size/120}}><i className="tl"></i><i className="tr"></i><i className="br"></i><i className="bl"></i></span>
  </span>;
}
