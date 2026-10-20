import React from 'react';
export function ProgressBar({label,value=0,max=100,showValue=true}){
  const pct=Math.max(0,Math.min(100,Math.round(value/max*100)));
  return <div className="mcp-prog">
    {(label||showValue)&&<div className="mcp-prog-top"><span>{label}</span>{showValue&&<span>{pct}%</span>}</div>}
    <div className="mcp-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label||'Progress'}><i style={{width:pct+'%'}}></i></div>
  </div>;
}
