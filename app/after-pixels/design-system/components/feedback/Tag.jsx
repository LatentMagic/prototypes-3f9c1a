import React from 'react';
import { Icon } from '../media/Icon.jsx';
export function Tag({kind='daily',children,icon,go}){
  const ic=icon||(kind==='locked'?'lock':null);
  const g=go??(kind==='locked'||kind==='open');
  return <span className={'mcp-tag mcp-tag-'+kind+(g?' has-go':'')}>{ic&&<Icon name={ic} size={14}/>}{children}{g&&<Icon name="next" size={14} className="mcp-tag-go"/>}</span>;
}
