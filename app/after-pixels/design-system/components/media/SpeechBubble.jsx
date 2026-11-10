import React from 'react';
// Words the player types into their chat, drawn as a sent message inside a sentence. Static, or with `copy` a button that copies them.
// KEEP: it sits on the text's baseline and adds no height to its line (inline padding); the corner at the bottom right is the
// sent message's tail. A short bubble never breaks; with `wrap` a long one that does not fit moves to the next line whole, and
// breaks inside itself only when a line is too narrow for it.
// KEEP: a copying bubble keeps its width through the swap to "Copied" (the words stay in place, unseen, and "Copied" is in the page only while it shows) so the line never reflows,
// and holds "Copied" for 2400ms, as the Copy buttons do. Its touch target is 44px tall whatever the text size (css).
export function SpeechBubble({children,wrap=false,copy=false,edge=false,onCopy,className=''}){
  const [done,setDone]=React.useState(false);
  React.useEffect(()=>{if(!done)return undefined;const t=setTimeout(()=>setDone(false),2400);return()=>clearTimeout(t);},[done]);
  const cls=('mcp-say'+(wrap?' is-wrap':'')+(edge?' is-edge':'')+(copy?' is-copy':'')+(copy&&done?' is-done':'')+' '+className).trim();
  if(!copy) return <span className={cls}>{children}</span>;
  const text=React.Children.toArray(children).filter(c=>typeof c==='string'||typeof c==='number').join('');
  const click=()=>{
    if(onCopy) onCopy(text); else if(navigator.clipboard) navigator.clipboard.writeText(text).catch(()=>{});
    setDone(true);
  };
  return <>
    <button type="button" className={cls} aria-label={'Copy: '+text} onClick={click}>
      <span className="mcp-say-in"><span className="a">{children}</span>{done&&<span className="b" aria-hidden="true">Copied</span>}</span>
    </button>
    <span className="mcp-say-live" role="status">{done?'Copied':''}</span>
  </>;
}
