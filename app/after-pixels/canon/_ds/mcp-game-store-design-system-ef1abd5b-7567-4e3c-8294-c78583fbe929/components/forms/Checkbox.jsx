import React from 'react';
export function Checkbox({label,checked,defaultChecked,onChange,className='',...rest}){
  return <label className={('mcp-check '+className).trim()}>
    <input type="checkbox" checked={checked} defaultChecked={defaultChecked} onChange={onChange} {...rest}/>
    <span className="mcp-box"><svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="square" strokeLinejoin="miter"><path d="M4.5 12.5L9.5 17.5L19.5 6.5"/></g></svg></span>
    <span>{label}</span>
  </label>;
}
