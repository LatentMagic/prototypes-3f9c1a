import React from 'react';
import { Icon } from '../media/Icon.jsx';
const G={success:'check',warning:'warn',error:'error'};
export function StatusMessage({kind='success',children}){
  return <p className={'mcp-msg mcp-msg-'+kind} role={kind==='error'?'alert':'status'}><Icon name={G[kind]}/><span>{children}</span></p>;
}
