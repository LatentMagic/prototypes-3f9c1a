import React from 'react';
import { ChatPart } from './ChatPicture.jsx';
// The game shown beside a chat on a wide page: an edition label, then what the AI draws (the same parts as in the chat).
// The caller sets its height and padding to fit the stage it sits in.
export function ChatSide({label,blocks,name,className=''}){
  return <div className={('mcp-chat mcp-chat-side '+className).trim()} role="group" aria-label={name||'The game beside the chat'}>
    {label&&<p className="mcp-chat-side-ed">{label}</p>}
    <div className="mcp-chat-side-body">{blocks.map((b,k)=><ChatPart key={k} b={b}/>)}</div>
  </div>;
}
