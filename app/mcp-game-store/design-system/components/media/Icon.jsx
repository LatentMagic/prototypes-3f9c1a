import React from 'react';
const A='fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="miter"';
const LINE={
search:'<g '+A+'><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></g>',
back:'<g '+A+'><path d="M20 12H5"/><path d="M11 5L4 12L11 19"/></g>',
close:'<g '+A+'><path d="M5 5L19 19M19 5L5 19"/></g>',
lock:'<g '+A+'><path d="M4.5 11H19.5V21H4.5Z"/><path d="M8 11V5H16V11"/><path d="M12 15V17"/></g>',
play:'<g '+A+'><path d="M7 4L19 12L7 20Z"/></g>',
pause:'<g '+A+'><path d="M8 5V19M16 5V19"/></g>',
settings:'<g '+A+'><path d="M4 6H11M17 6H20"/><path d="M4 12H6M12 12H20"/><path d="M4 18H13M19 18H20"/><path d="M11 4H17V8H11Z"/><path d="M6 10H12V14H6Z"/><path d="M13 16H19V20H13Z"/></g>',
mail:'<g '+A+'><path d="M3 5.5H21V18.5H3Z"/><path d="M3.5 6.5L12 13L20.5 6.5"/></g>',
logout:'<g '+A+'><path d="M10 4H4V20H10"/><path d="M15 8L19 12L15 16"/><path d="M19 12H9"/></g>',
card:'<g '+A+'><path d="M2.5 5.5H21.5V18.5H2.5Z"/><path d="M2.5 10H21.5"/><path d="M6 15H10"/></g>'};
const UI={
check:'<g fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="square" stroke-linejoin="miter"><path d="M4.5 12.5L9.5 17.5L19.5 6.5"/></g>',
warn:'<g '+A+'><path d="M12 3L22 20H2Z"/><path d="M12 10V14M12 16.5V17.5"/></g>',
error:'<g '+A+'><circle cx="12" cy="12" r="9"/><path d="M12 7V13M12 16V17"/></g>',
down:'<g '+A+'><path d="M5 9L12 16L19 9"/></g>',
send:'<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5"/></g>',
next:'<g '+A+'><path d="M9 5L16 12L9 19"/></g>',
out:'<g '+A+'><path d="M14 4H20V10"/><path d="M20 4L11 13"/><path d="M17 14V20H4V7H10"/></g>',
share:'<g '+A+'><path d="M12 15V4"/><path d="M7.5 8.5L12 4L16.5 8.5"/><path d="M8 11H5V20H19V11H16"/></g>',
list:'<g '+A+'><path d="M4 5H20V10H4Z"/><path d="M4 14H20V19H4Z"/></g>'};
export const ICON_NAMES=[...Object.keys(LINE),...Object.keys(UI)];
export function Icon({name,size=20,className='',style,label}){
  const body=UI[name]||LINE[name];
  if(!body) return null;
  return <svg className={('mcp-ico '+className).trim()} viewBox="0 0 24 24" width={size} height={size} style={{width:size,height:size,...style}} role={label?'img':undefined} aria-label={label} aria-hidden={label?undefined:true} focusable="false" dangerouslySetInnerHTML={{__html:body}}/>;
}
