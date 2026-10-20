const {Button,ButtonPair,TextLink,TextField,SearchField,Checkbox,Tag,StatusMessage,ProgressBar,Card,Heading,FormCard,Popup,Disclosure,Icon,Cover}=window.MCPGameStoreDesignSystem_ef1abd;
const GAMES=[
{id:'dp',name:'Daily Puzzles',art:'daily-puzzles',tag:['daily','Daily'],blurb:"You already know today's answer. You can't see it yet, so start guessing."},
{id:'wi',name:'The Weekly Interrogation',art:'weekly-interrogation',tag:['daily','Weekly'],blurb:"This week's suspects have had time to get their stories straight. Ask the question they haven't prepared for."},
{id:'dq',name:'Dungeon Quest',art:'dungeon-quest',tag:['locked','Locked'],blurb:"The way in is open and nobody has told you what's down there. Say what you do first."}];
function TopBar({onHome,onSignIn,signedIn}){
  return <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,padding:'12px 0',borderBottom:'1px solid var(--line)'}}>
    <button onClick={onHome} style={{background:'none',border:0,padding:0,cursor:'pointer',color:'var(--text)',font:'700 20px/1.2 var(--font-heading)',letterSpacing:'-.01em',minHeight:44,display:'flex',alignItems:'center',gap:10}}><img src="../../assets/logo.svg" width="32" height="32" alt=""/>After Pixels</button>
    {signedIn?<span style={{font:'var(--type-small)',color:'var(--muted)'}}>Signed in</span>:
    <div style={{display:'flex',gap:12}}><Button variant="secondary" onClick={onSignIn}>Sign in</Button><Button onClick={onSignIn}>Sign up</Button></div>}
  </header>;
}
function AllGames({onOpen}){
  return <div style={{display:'grid',gap:36}}>
    <section style={{display:'grid',gap:8,maxWidth:640}}>
      <Heading level="page">Someone's lying to you. Go and find out who.</Heading>
      <p style={{margin:0,color:'var(--muted)'}}>Play small games by talking to Claude or ChatGPT. New ones arrive every day.</p>
    </section>
    <section style={{display:'grid',gap:16}}>
      <div style={{display:'flex',flexWrap:'wrap',gap:12,alignItems:'end',justifyContent:'space-between'}}><Heading level="section">All games</Heading><div style={{width:'min(100%,320px)'}}><SearchField placeholder="Find a game"/></div></div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,220px),1fr))',gap:12}}>
        {GAMES.map(g=><div key={g.id} style={{display:'grid',gap:8}}><Cover name={g.name} art={g.art} onClick={()=>onOpen(g)}/><div><Tag kind={g.tag[0]}>{g.tag[1]}</Tag></div></div>)}
      </div>
    </section>
  </div>;
}
function GamePage({game,onBack}){
  const [added,setAdded]=React.useState(false);
  const [confirm,setConfirm]=React.useState(false);
  const [deleted,setDeleted]=React.useState(false);
  const [deleting,setDeleting]=React.useState(false);
  const del=()=>{setDeleting(true);setTimeout(()=>{setDeleting(false);setConfirm(false);setDeleted(true);},1200);};
  return <div style={{display:'grid',gap:24}}>
    <div><TextLink onClick={onBack}><span style={{display:'inline-flex',gap:8,alignItems:'center'}}><Icon name="back"/>All games</span></TextLink></div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,300px),1fr))',gap:24,alignItems:'start'}}>
      <Cover art={game.art}/>
      <div style={{display:'grid',gap:16,alignContent:'start'}}>
        <Heading level="page">{game.name}</Heading>
        <p style={{margin:0}}>{game.blurb}</p>
        <div style={{display:'flex',flexWrap:'wrap',gap:12}}><Button done={added} doneLabel="Added" loadingLabel="Adding" onClick={()=>new Promise(r=>setTimeout(r,1200)).then(()=>setAdded(true))}>Add to Claude</Button><Button variant="secondary">See how it plays</Button></div>
        <Disclosure title="How it plays">Claude deals the puzzle, you answer in the chat, and the game scores it.</Disclosure>
        {deleted?<StatusMessage kind="success">Save deleted.</StatusMessage>:<Card title="Your save"><ProgressBar label="Puzzle 3 of 5" value={60}/><TextLink danger onClick={()=>setConfirm(true)}>Delete save</TextLink></Card>}
      </div>
    </div>
    <Popup open={confirm} busy={deleting} onClose={()=>setConfirm(false)} title="Delete this save?" actions={<><Button variant="secondary" onClick={()=>{if(!deleting)setConfirm(false);}}>Keep it</Button><Button variant="danger" loading={deleting} loadingLabel="Deleting" onClick={del}>Delete save</Button></>}>
      <p>Your progress in {game.name} is removed.</p>
    </Popup>
  </div>;
}
function SignIn({onDone}){
  const [email,setEmail]=React.useState('');const [tried,setTried]=React.useState(false);const r=React.useRef();
  const bad=tried&&!email.includes('@');
  const [busy,setBusy]=React.useState(null);const which=React.useRef('in');
  const submit=e=>{e.preventDefault();if(busy)return;setTried(true);if(!email.includes('@'))setTimeout(()=>r.current&&r.current.focus(),0);else{setBusy(which.current);setTimeout(onDone,1200);}};
  return <div style={{display:'grid',placeItems:'center',padding:'24px 0'}}>
    <form noValidate onSubmit={submit} style={{width:'min(100%,420px)'}}>
      <FormCard title="Sign in">
        <TextField label="Email" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} inputRef={r} error={bad?'Enter an email with an @ in it.':undefined}/>
        <Checkbox label="Keep me signed in" defaultChecked/>
        <ButtonPair><Button variant="secondary" type="submit" loading={busy==='in'} loadingLabel="Signing in" onClick={()=>{which.current='in';}}>Sign in</Button><Button type="submit" loading={busy==='up'} loadingLabel="Signing up" onClick={()=>{which.current='up';}}>Sign up</Button></ButtonPair>
        <div><TextLink>Why sign in?</TextLink></div>
      </FormCard>
    </form>
  </div>;
}
Object.assign(window,{TopBar,AllGames,GamePage,SignIn});
