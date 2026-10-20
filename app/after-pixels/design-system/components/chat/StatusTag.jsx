import React from 'react';
// One game status, one or two words. live: in progress. won: solved, escaped. lost: out of guesses. warn: a partial outcome. idle: not started.
export function StatusTag({tone='live',label,children,className=''}){
  return <span className={('mcp-cb mcp-cb-status is-'+tone+' '+className).trim()}>{label??children}</span>;
}
