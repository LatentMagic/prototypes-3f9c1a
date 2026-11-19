import React from 'react';
// A few options as tiles, one pressed at a time, and the panel the pressed one controls, with a notch on the panel's top edge under the pressed tile.
// A group of toggle buttons (aria-pressed), not ARIA tabs: a tablist may own only tabs, and a tile can hold an icon and a name.
// KEEP: the notch is placed in CSS from the tile count and the pressed tile's place (--np-n, --np-i), not measured, so it follows a resize with no script and glides to a newly pressed tile.
export function NotchPicker({label,options,value,defaultValue=null,onChange,children,className='',style}){
  const [own,setOwn]=React.useState(defaultValue);
  const picked=value===undefined?own:value;
  const at=options.findIndex(o=>o.id===picked);
  const base=(React.useId?React.useId():'np').replace(/:/g,'');
  const panelId=base+'-panel';
  const press=(id)=>{if(id===picked)return;if(value===undefined)setOwn(id);if(onChange)onChange(id);};
  const icons=options.some(o=>o.icon);
  return <div className={('mcp-np'+(icons?' has-icons':'')+' '+className).trim()} style={{'--np-n':options.length,'--np-i':Math.max(at,0),...style}}>
    <div className="mcp-np-tiles" role="group" aria-label={label}>
      {options.map(o=><button key={o.id} type="button" id={base+'-'+o.id} className="mcp-np-tile" aria-pressed={o.id===picked} aria-controls={panelId} onClick={()=>press(o.id)}>
        {o.icon&&<span className="mcp-np-icon" aria-hidden="true">{o.icon}</span>}
        <span className="mcp-np-name">{o.label}</span>
      </button>)}
    </div>
    <div className="mcp-np-panel" id={panelId} role="region" aria-labelledby={at<0?undefined:base+'-'+picked} hidden={at<0}>
      <i className="mcp-np-notch" aria-hidden="true"/>
      <div className="mcp-np-body">{typeof children==='function'?children(picked):children}</div>
    </div>
  </div>;
}
