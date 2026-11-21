import React from 'react';
// An image the AI shows in a turn, such as the scene of a game. It scrolls with the turns like any other part.
export function Picture({src,alt,className=''}){
  return <img className={('mcp-cb mcp-chat-pic '+className).trim()} src={src} alt={alt}/>;
}
