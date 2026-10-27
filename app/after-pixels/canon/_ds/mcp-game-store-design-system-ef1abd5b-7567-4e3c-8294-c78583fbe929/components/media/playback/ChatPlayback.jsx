import React from 'react';
import { Icon } from '../Icon.jsx';
import { ChatPicture, chatTurn, chatShell, chatParas } from '../ChatPicture.jsx';
// Default pacing, in ms at speed 1 (type is characters per second). Entering pieces use --time-popup (260ms) on --ease.
const PACE={lead:500,type:32,typeMin:450,typeMax:1600,send:300,enter:260,think:700,call:450,word:55,wordIn:140,gap:300,user:450,read:1400,end:4000};
// cubic-bezier(.16,1,.3,1): the system's --ease, solved here so a time gives the same value everywhere.
function ease(x){
  const cx=.48,bx=3*(.3-.16)-cx,ax=1-cx-bx,cy=3,by=-3,ay=1;
  let t=x; for(let n=0;n<8;n++){const e=((ax*t+bx)*t+cx)*t-x,d=(3*ax*t+2*bx)*t+cx; if(Math.abs(e)<1e-5||Math.abs(d)<1e-6) break; t=Math.min(1,Math.max(0,t-e/d));}
  return ((ay*t+by)*t+cy)*t;
}
const c01=v=>v<0?0:v>1?1:v;
const nWords=s=>String(s).split(/\s+/).filter(Boolean).length;
// Turns -> when every piece starts. Pure: the same turns and pace always give the same times.
function timeline(turns,pace,composer){
  const p={...PACE,...pace}; const sp=p.speed>0?p.speed:1; const d=x=>x/sp;
  let t=d(p.lead), last=0; const out=[];
  const put=(pieces,k,dur)=>{pieces[k]={at:t}; last=Math.max(last,t+d(p.enter)); t+=d(p.enter)+dur;};
  turns.forEach(tu=>{
    const pieces={}; let type=null;
    if(tu.from==='user'){
      if(composer){const text=chatParas(tu.text).join(' '); const dur=d(Math.min(p.typeMax,Math.max(p.typeMin,text.length/p.type*1000))); type={start:t,end:t+dur,text}; t+=dur+d(p.send);}
      put(pieces,'u',d(tu.hold??p.user));
    } else {
      t+=d(p.think);
      if(tu.tool) put(pieces,'c',d(p.call));
      (tu.blocks||[]).forEach((b,k)=>put(pieces,'b'+k,d(p.gap)));
      chatParas(tu.text).forEach((s,k)=>{const n=nWords(s); pieces['p'+k]={at:t,n,word:d(p.word)}; const end=t+Math.max(0,n-1)*d(p.word)+d(p.wordIn); last=Math.max(last,end); t=end+d(p.gap);});
      (tu.after||[]).forEach((b,k)=>put(pieces,'a'+k,d(p.gap)));
      t+=d(tu.hold??p.read)-d(p.gap);
    }
    out.push({pieces,type});
  });
  return {turns:out,total:last,end:d(p.end),enter:d(p.enter),wordIn:d(p.wordIn)};
}
function enter(T,at,dur){
  if(T<at) return null;
  const q=c01((T-at)/dur); const e=q>=1?1:ease(q);
  // Same keys at every time, so a seek leaves the same markup as playing there.
  return {opacity:+e.toFixed(4),transform:'translateY('+((1-e)*4).toFixed(2)+'px)'};
}
// Everything drawn at time T, from the timeline and T alone.
function frame(tl,T){
  const fx={
    piece:(i,k)=>{const p=tl.turns[i]&&tl.turns[i].pieces[k]; return p?enter(T,p.at,tl.enter):{};},
    words:(i,k,text)=>{
      const p=tl.turns[i]&&tl.turns[i].pieces[k]; if(!p||T>=p.at+Math.max(0,p.n-1)*p.word+tl.wordIn) return text;
      let j=0; return String(text).split(/(\s+)/).map((w,x)=>{if(!w||/^\s+$/.test(w)) return w; const o=c01((T-(p.at+(j++)*p.word))/tl.wordIn); return <span key={x} style={{opacity:+o.toFixed(4)}}>{w}</span>;});
    }};
  let typed=null, sent=false;
  tl.turns.forEach(({type,pieces})=>{
    if(!type) return;
    const at=pieces.u.at;
    if(T>=type.start&&T<at){const n=Math.min(type.text.length,Math.floor(c01((T-type.start)/(type.end-type.start))*type.text.length)); typed={text:type.text.slice(0,n),caret:T<type.end||Math.floor((T-type.end)/150)%2===1};}
    if(T>=at&&T<at+120) sent=true;
  });
  return {fx,typed,sent};
}
function useReducedMotion(){
  const q='(prefers-reduced-motion: reduce)';
  const [r,setR]=React.useState(()=>typeof window!=='undefined'&&!!window.matchMedia&&window.matchMedia(q).matches);
  React.useEffect(()=>{
    if(!window.matchMedia) return undefined;
    const m=window.matchMedia(q),f=()=>setR(m.matches);
    if(m.addEventListener) m.addEventListener('change',f); else m.addListener(f);
    return ()=>{if(m.removeEventListener) m.removeEventListener('change',f); else m.removeListener(f);};
  },[]);
  return r;
}
// Follows the newest piece; a reader who scrolls takes over until they scroll back to the bottom. Under a given time it always follows.
function usePlaybackScroll(body,pinned){
  const follow=React.useRef(true), touched=React.useRef(false);
  const [up,setUp]=React.useState(false);
  React.useLayoutEffect(()=>{
    const b=body.current; if(!b) return;
    if(pinned||follow.current) b.scrollTop=b.scrollHeight;
    const u=b.scrollTop>4; b.dataset.more=u?'up':''; setUp(u);
  });
  React.useEffect(()=>{
    const b=body.current; if(!b) return undefined;
    const take=()=>{touched.current=true;};
    const mark=()=>{if(touched.current) follow.current=b.scrollHeight-b.scrollTop-b.clientHeight<8; const u=b.scrollTop>4; b.dataset.more=u?'up':''; setUp(u);};
    b.addEventListener('scroll',mark,{passive:true});
    ['wheel','touchstart','keydown'].forEach(t=>b.addEventListener(t,take,{passive:true}));
    return ()=>{b.removeEventListener('scroll',mark); ['wheel','touchstart','keydown'].forEach(t=>b.removeEventListener(t,take));};
  },[]);
  const toStart=()=>{const b=body.current; if(!b) return; touched.current=true; follow.current=false; b.scrollTo({top:0,behavior:'smooth'});};
  const rejoin=()=>{follow.current=true; touched.current=false;};
  return [up,toStart,rejoin];
}
export function ChatPlayback({turns,time,autoplay=true,loop=false,speed=1,pace,title,toolBy,mark,height=290,width=360,fill=false,composer=true,placeholder='Reply',label,more='Back to the start',pauseLabel='Pause',playLabel='Play',replayLabel='Play again',className=''}){
  const reduced=useReducedMotion();
  const tl=React.useMemo(()=>timeline(turns,{...pace,speed},composer),[turns,JSON.stringify(pace||{}),speed,composer]);
  const given=typeof time==='number'&&isFinite(time);
  const cycle=tl.total+tl.end;
  const [own,setOwn]=React.useState(0);
  const [playing,setPlaying]=React.useState(autoplay);
  const body=React.useRef(null);
  const [up,toStart,rejoin]=usePlaybackScroll(body,given);
  React.useEffect(()=>{
    if(given||reduced||!playing) return undefined;
    let raf,last=null;
    const step=now=>{
      const dt=last==null?0:Math.min(250,now-last); last=now;
      setOwn(t=>{const n=t+dt; if(loop){if(n>=cycle){rejoin(); return n-cycle;} return n;} return Math.min(n,tl.total);});
      raf=requestAnimationFrame(step);
    };
    raf=requestAnimationFrame(step);
    return ()=>cancelAnimationFrame(raf);
  },[given,reduced,playing,loop,tl]);
  const T=given?(loop?((time%cycle)+cycle)%cycle:Math.max(0,Math.min(time,tl.total))):own;
  const done=!loop&&T>=tl.total;
  React.useEffect(()=>{if(!given&&done&&playing) setPlaying(false);},[done]);
  if(reduced) return <ChatPicture turns={turns} title={title} toolBy={toolBy} mark={mark} height={height} width={width} fill={fill} composer={composer} placeholder={placeholder} label={label} more={more} className={className}/>;
  const {fx,typed,sent}=frame(tl,T);
  const press=()=>{if(playing) setPlaying(false); else{if(done){setOwn(0); rejoin();} setPlaying(true);}};
  const ctl=given?null:<button type="button" className="mcp-chat-pause" onClick={press} aria-label={playing?pauseLabel:done?replayLabel:playLabel}><Icon name={playing?'pause':'play'} size={16}/></button>;
  return chatShell({bodyRef:body,up,toStart,title,height,width,fill,label,more,className,extraClass:'is-playback',control:ctl,
    body:turns.map((t,i)=>chatTurn(t,i,{mark,toolBy,fx})),
    comp:composer&&<div className="mcp-chat-comp" aria-hidden="true">{typed?<span className="mcp-chat-typed">{typed.text}<span className="mcp-chat-caret" style={{opacity:typed.caret?1:0}}></span></span>:<span>{placeholder}</span>}<i className={sent?'is-sent':undefined}><Icon name="send" size={16}/></i></div>});
}
// How long the chat takes to play to its finished picture, in ms, for a recorder or a scrubber.
ChatPlayback.duration=(turns,{pace,speed=1,composer=true}={})=>timeline(turns,{...pace,speed},composer).total;
