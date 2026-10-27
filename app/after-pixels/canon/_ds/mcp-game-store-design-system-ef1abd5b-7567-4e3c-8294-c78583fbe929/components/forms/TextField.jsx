import React from 'react';
import { Icon } from '../media/Icon.jsx';
export function TextField({label,id,error,hint,type='text',value,defaultValue,placeholder,onChange,inputRef,autoComplete,className='',...rest}){
  const auto=React.useId?React.useId():'f';
  const fid=id||('mcp-'+auto);
  const eid=fid+'-err';
  return <div className={('mcp-fld '+className).trim()}>
    {label&&<label htmlFor={fid}>{label}</label>}
    <input ref={inputRef} className={'mcp-in'+(error?' is-bad':'')} id={fid} type={type} value={value} defaultValue={defaultValue} placeholder={placeholder} onChange={onChange} autoComplete={autoComplete} aria-invalid={error?true:undefined} aria-describedby={error?eid:undefined} {...rest}/>
    {error&&<span className="mcp-fmsg" id={eid}><Icon name="error"/>{error}</span>}
    {hint&&!error&&<span className="mcp-hint">{hint}</span>}
  </div>;
}
export function SearchField({label,id,placeholder='Find a game',value,onChange,className='',...rest}){
  const auto=React.useId?React.useId():'s';
  const fid=id||('mcp-'+auto);
  return <div className={('mcp-fld '+className).trim()}>
    {label&&<label htmlFor={fid}>{label}</label>}
    <div className="mcp-srch"><Icon name="search"/><input className="mcp-in" id={fid} type="search" placeholder={placeholder} value={value} onChange={onChange} aria-label={label?undefined:placeholder} {...rest}/></div>
  </div>;
}
