import React from 'react';
import { StatusTag } from './StatusTag.jsx';
import { StatRow } from './StatRow.jsx';
import { NavButtons } from './NavButtons.jsx';
// How a game ended, as one fenced unit you could screenshot: name and status, a line, two to four stats, then Share and Back.
export function ResultCard({title,status,line,stats=[],actions=[],onGo,className=''}){
  const st=typeof status==='string'?{label:status,tone:'won'}:status;
  return <div className={('mcp-cb mcp-cb-fence mcp-cb-card mcp-cb-result '+className).trim()} role="group" aria-label={title||'Result'}>
    <div className="mcp-cb-result-head">{title&&<p className="mcp-cb-title">{title}</p>}{st&&<StatusTag tone={st.tone||'won'}>{st.label}</StatusTag>}</div>
    {line&&<p className="mcp-cb-note">{line}</p>}
    {stats.length>0&&<StatRow items={stats} grid/>}
    {actions.length>0&&<NavButtons items={actions} onGo={onGo} stack/>}
  </div>;
}
