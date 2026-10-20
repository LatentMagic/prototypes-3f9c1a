import React from 'react';
import { usePress } from '../press.js';
export function TextLink({children,danger=false,href,onClick,className='',...rest}){
  const {pressed,handlers}=usePress();
  const cls=['mcp-lnk',danger&&'is-danger',pressed&&'is-pressed',className].filter(Boolean).join(' ');
  if(href) return <a href={href} className={cls} onClick={onClick} {...handlers} {...rest}>{children}</a>;
  return <button type="button" className={cls} onClick={onClick} {...handlers} {...rest}>{children}</button>;
}
