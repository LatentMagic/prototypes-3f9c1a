import React from 'react';
// Progress, danger or health as a row of steps (12 or fewer) or a short bar, with the count beside it. Several tracks line up.
export function Track({items=[],className=''}){
  return <div className={('mcp-cb mcp-cb-track '+className).trim()}>
    {items.map((t,i)=>{const max=t.max||6;const v=Math.max(0,Math.min(max,t.value||0));const steps=t.steps??max<=12;
      return <div key={i} className={'mcp-cb-track-row is-'+(t.tone||'progress')} role="meter" aria-label={t.label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={v} aria-valuetext={v+' of '+max}>
        <span className="mcp-cb-track-l">{t.label}</span>
        {steps?<span className="mcp-cb-steps" aria-hidden="true">{Array.from({length:max},(_,k)=><i key={k} className={k<v?'is-on':undefined}></i>)}</span>
          :<span className="mcp-cb-bar" aria-hidden="true"><i style={{width:(v/max*100)+'%'}}></i></span>}
        <span className="mcp-cb-track-n">{v} of {max}</span>
      </div>;})}
  </div>;
}
