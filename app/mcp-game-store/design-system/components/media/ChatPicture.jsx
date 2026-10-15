import React from 'react';
import { Icon } from './Icon.jsx';
import { TileGrid } from '../chat/TileGrid.jsx';
import { WordBoard } from '../chat/WordBoard.jsx';
import { ChoiceButtons } from '../chat/ChoiceButtons.jsx';
import { ConfirmCard } from '../chat/ConfirmCard.jsx';
import { FactRows } from '../chat/FactRows.jsx';
import { StatRow } from '../chat/StatRow.jsx';
import { StatusTag } from '../chat/StatusTag.jsx';
import { EntityCards } from '../chat/EntityCards.jsx';
import { ClueCards } from '../chat/ClueCards.jsx';
import { ResultCard } from '../chat/ResultCard.jsx';
import { Track } from '../chat/Track.jsx';
import { RollLine } from '../chat/RollLine.jsx';
import { NavButtons } from '../chat/NavButtons.jsx';
import { MenuRows } from '../chat/MenuRows.jsx';
// Block type -> chat part. A block is the part's props plus its type, so a turn stays plain data.
const PARTS={tilegrid:TileGrid,wordboard:WordBoard,choices:ChoiceButtons,confirm:ConfirmCard,facts:FactRows,stats:StatRow,status:StatusTag,entities:EntityCards,clues:ClueCards,result:ResultCard,track:Track,roll:RollLine,nav:NavButtons,menu:MenuRows};
const WHO={x:'not in the word',y:'in the word',g:'right spot'};
function Tiles({rows}){
  const label=rows.map(r=>r.word+': '+r.marks.split('').map((m,i)=>r.word[i]+' '+WHO[m]).join(', ')).join('. ');
  return <div className="mcp-chat-board" role="img" aria-label={label}>{rows.map((r,i)=><div key={i} className="mcp-chat-row">{r.word.split('').map((c,k)=><span key={k} className={'is-'+r.marks[k]}>{c}</span>)}</div>)}</div>;
}
function Block({b}){
  if(b.type==='tiles') return <Tiles rows={b.rows}/>;
  if(b.type==='list') return <ul className="mcp-chat-list">{b.items.map((t,i)=><li key={i}>{t}</li>)}</ul>;
  if(b.type==='mono') return <pre className="mcp-chat-mono">{b.text}</pre>;
  const P=PARTS[b.type];
  if(P){const {type,...p}=b; return <P {...p}/>;}
  return null;
}
const paras=t=>t==null?[]:Array.isArray(t)?t:[t];
// Opens on the latest turn and scrolls back to the first. Once scrolled up, the top fades and the pill takes you back to the start.
// Stays at the latest turn while it lays out, until the reader scrolls it themselves.
function useChatScroll(body,turns){
  const [up,setUp]=React.useState(false);
  React.useEffect(()=>{
    const b=body.current; if(!b) return undefined;
    let moved=false;
    const mark=()=>{const u=b.scrollTop>4; b.dataset.more=u?'up':''; setUp(u);};
    const end=()=>{if(!moved) b.scrollTop=b.scrollHeight; mark();};
    const stop=()=>{moved=true;};
    b.addEventListener('scroll',mark,{passive:true});
    ['wheel','touchstart','keydown'].forEach(t=>b.addEventListener(t,stop,{passive:true}));
    const ro=typeof ResizeObserver!=='undefined'?new ResizeObserver(end):null;
    if(ro){ro.observe(b);[...b.children].forEach(c=>ro.observe(c));}
    end(); const t=setTimeout(end,600);
    return ()=>{clearTimeout(t); if(ro) ro.disconnect(); b.removeEventListener('scroll',mark); ['wheel','touchstart','keydown'].forEach(t=>b.removeEventListener(t,stop));};
  },[turns]);
  const toStart=()=>{const b=body.current; if(b) b.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});};
  return [up,toStart];
}
export function ChatPicture({turns,title,toolBy,mark,height=290,width=360,fill=false,composer=true,placeholder='Reply',label,more='Back to the start',className=''}){
  const body=React.useRef(null);
  const [up,toStart]=useChatScroll(body,turns);
  const name=label||'A game being played in a chat';
  return <div className={('mcp-chat'+(fill?' is-fill':'')+' '+className).trim()} style={fill?undefined:{width:'min(100%,'+width+'px)'}} role="group" aria-label={name}>
    {title&&<div className="mcp-chat-head">{title}</div>}
    <div ref={body} className={'mcp-chat-body'+(height==='auto'&&!fill?' is-auto':'')} style={fill||height==='auto'?undefined:{height}} tabIndex={0} role="region" aria-label={name+', scrolls'}>
      {turns.map((t,i)=>t.from==='user'
        ? <p key={i} className="mcp-chat-me">{paras(t.text)}</p>
        : <div key={i} className="mcp-chat-ai">
            {t.tool&&<span className="mcp-chat-call">{mark&&<img src={mark} alt="" width="16" height="16"/>}Called {t.tool}{toolBy&&<em>{toolBy}</em>}</span>}
            {(t.blocks||[]).map((b,k)=><Block key={k} b={b}/>)}
            {paras(t.text).map((p,k)=><p key={k}>{p}</p>)}
            {(t.after||[]).map((b,k)=><Block key={'a'+k} b={b}/>)}
          </div>)}
    </div>
    <button type="button" className="mcp-chat-up" hidden={!up} onClick={toStart} aria-label={more}><Icon name="down" size={16} style={{transform:'rotate(180deg)'}}/></button>
    {composer&&<div className="mcp-chat-comp" aria-hidden="true"><span>{placeholder}</span><i><Icon name="send" size={16}/></i></div>}
  </div>;
}
