import React from 'react';
// KEEP: Holds the pressed look for at least 120ms so a quick tap still shows it (from the hand-off).
export function usePress(){
  const [pressed,setPressed]=React.useState(false);
  const t=React.useRef(0);
  const down=()=>{t.current=Date.now();setPressed(true);};
  const up=()=>{setTimeout(()=>setPressed(false),Math.max(0,120-(Date.now()-t.current)));};
  return {pressed,handlers:{onPointerDown:down,onPointerUp:up,onPointerCancel:up,onPointerLeave:up}};
}
