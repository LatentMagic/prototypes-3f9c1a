import React from 'react';
// Words the player types into their chat, drawn as a sent message inside a sentence. Not a control.
// KEEP: it sits on the text's baseline and adds no height to its line (inline padding); the corner at the bottom right is the
// sent message's tail. A short bubble never breaks; `wrap` lets a long one break inside itself on a narrow phone.
export function SpeechBubble({children,wrap=false,className=''}){
  return <span className={('mcp-say'+(wrap?' is-wrap':'')+' '+className).trim()}>{children}</span>;
}
