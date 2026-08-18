// ============================================================================
// Whiteboard 2 — how you send a message. Five committed answers to committing
// and abandoning a written message, each drawn on BOTH of the surface's typing
// boxes (the inline reply box and the foot box) and live: the field grows, the
// control behaves as the option says, and sending actually posts the turn.
// The warm-paper borderless field is the shipped one (cand-lm652-parts.jsx
// CandWrite); each option owns only what surrounds it.
// ============================================================================
const { WB_PAPER, WB_TURNS, WB_TYPED, WB_TYPED_PART, WbOption, WbSection, WbStrip, WbSeg, WbTurn, WbGroup, WbThreadHead, useWbState } = window;

// The send glyph: the up arrow. It sits on the house radius-md control shape,
// never a circle (the app's only circles are avatars and the Swell's disc).
const WbSendGlyph = ({ size = 17 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: 'block' }}>
    <line x1="12" y1="19.5" x2="12" y2="5.5" /><polyline points="6 11.5 12 5.5 18 11.5" />
  </svg>
);

// The field itself — paper, borderless, auto-growing. Copied from CandWrite
// (cand-lm652-parts.jsx) because each option needs to own what sits inside and
// under the box; not to be "improved".
const WbField = ({ value, onChange, placeholder, ariaLabel, onKeyDown, autoFocus, size = 14.5, maxPx = 190, inside, foot, padRight = 12 }) => {
  const ref = React.useRef(null);
  const [focus, setFocus] = React.useState(false);
  React.useLayoutEffect(() => { const el = ref.current; if (!el) return; el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, maxPx) + 'px'; }, [value, maxPx]);
  React.useEffect(() => { if (autoFocus && ref.current) ref.current.focus({ preventScroll: true }); }, []);
  return (
    <div style={{ position: 'relative', background: WB_PAPER.bg, border: '1px solid ' + (focus ? 'var(--color-accent)' : WB_PAPER.bd), borderRadius: 'var(--radius-md)', padding: '10px 12px ' + (foot ? '4px' : '10px'), transition: 'border-color var(--duration-base)' }}>
      <textarea ref={ref} className="cand-write" value={value} maxLength={500} placeholder={placeholder} aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)} onKeyDown={onKeyDown} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ display: 'block', width: '100%', border: 0, outline: 'none', background: 'transparent', resize: 'none', padding: 0, paddingRight: padRight - 12,
          font: '400 ' + size + 'px/1.6 var(--font-sans)', color: 'var(--color-fg-1)', minHeight: Math.round(size * 1.6), overflowY: 'auto' }} />
      {inside}
      {foot}
    </div>
  );
};

const wbLeft = (v) => 500 - String(v || '').length;
const WbCount = ({ value }) => (wbLeft(value) <= 60
  ? <span style={{ font: '400 11.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{wbLeft(value)} left</span> : null);

// ---- 1 · Arrives with the words --------------------------------------------
const WbSend1 = ({ value, onChange, onSend, placeholder, ariaLabel, autoFocus }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <WbField value={value} onChange={onChange} placeholder={placeholder} ariaLabel={ariaLabel} autoFocus={autoFocus} />
    {!!value.trim() && (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
        <WbCount value={value} />
        <Button size="sm" variant="primary" onClick={onSend}>Send</Button>
      </div>
    )}
  </div>
);

// ---- 2 · Inside the field ---------------------------------------------------
const WbSend2 = ({ value, onChange, onSend, placeholder, ariaLabel, autoFocus }) => {
  const live = !!value.trim();
  return (
    <WbField value={value} onChange={onChange} placeholder={placeholder} ariaLabel={ariaLabel} autoFocus={autoFocus} padRight={46}
      inside={
        <button type="button" className="wb-inbtn" data-live={live ? '' : undefined} onClick={onSend} aria-label="Send"
          style={{ position: 'absolute', right: 7, bottom: 7 }}>
          <WbSendGlyph />
        </button>
      } />
  );
};

// ---- 3 · Always there, quiet -----------------------------------------------
const WbSend3 = ({ value, onChange, onSend, placeholder, ariaLabel, autoFocus }) => {
  const live = !!value.trim();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <WbField value={value} onChange={onChange} placeholder={placeholder} ariaLabel={ariaLabel} autoFocus={autoFocus} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, minHeight: 30 }}>
        <WbCount value={value} />
        <button type="button" onClick={onSend} className="wb-quietsend" data-live={live ? '' : undefined}>Send</button>
      </div>
    </div>
  );
};

// ---- 4 · The return key ----------------------------------------------------
const WbSend4 = ({ value, onChange, onSend, placeholder, ariaLabel, autoFocus }) => {
  const [focus, setFocus] = React.useState(!!autoFocus);
  const key = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}>
      <WbField value={value} onChange={onChange} placeholder={placeholder} ariaLabel={ariaLabel} autoFocus={autoFocus} onKeyDown={key} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 18 }}>
        <span style={{ font: '400 11px/1.4 var(--font-mono)', color: 'var(--color-fg-3)', opacity: (focus || value) ? 1 : 0, transition: 'opacity var(--duration-base)' }}>return sends · shift return for a line</span>
        <WbCount value={value} />
      </div>
    </div>
  );
};

// ---- 5 · The row commits ---------------------------------------------------
const WbSend5 = ({ value, onChange, onSend, onDiscard, placeholder, ariaLabel, autoFocus }) => {
  const live = !!value.trim();
  const worth = value.trim().length > 40;
  return (
    <WbField value={value} onChange={onChange} placeholder={placeholder} ariaLabel={ariaLabel} autoFocus={autoFocus} foot={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 34 }}>
        <span>{worth && <button type="button" className="cand-quiet wb-discard" onClick={onDiscard}>Discard</button>}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
          <WbCount value={value} />
          {live && <button type="button" className="wb-rowadd" onClick={onSend}>Add</button>}
        </span>
      </div>
    } />
  );
};

const WB_SENDERS = { 1: WbSend1, 2: WbSend2, 3: WbSend3, 4: WbSend4, 5: WbSend5 };

const WB_SEND_NOTES = [
  { n: 1, name: 'Arrives with the words', stance: 'Nothing is drawn until there is something to send; the first character brings one Send, and both boxes behave alike. Abandoning has no control — an empty field is already abandoned.', cost: 'a half-written reply has no visible way out, so leaving it depends on the member emptying it or moving on.' },
  { n: 2, name: 'Inside the field', stance: 'One glyph on the field\u2019s own edge, always there, quiet until there are words. Sending is part of the box you wrote in.', cost: 'the closest thing here to a chat app, and the glyph sits inside the reading measure.' },
  { n: 3, name: 'Always there, quiet', stance: 'The word Send is permanently drawn in secondary ink and inks up when it has something to carry. Nothing appears or moves, ever.', cost: 'a control that does nothing for most of its life, which the app\u2019s own rules argue against.' },
  { n: 4, name: 'The return key', stance: 'No control at all: return sends, shift-return makes a line, and a mono hint says so while you write. The calmest field on the page.', cost: 'it has to be told to you once, and a member who wants a paragraph must know the trick.' },
  { n: 5, name: 'The row commits', stance: 'The field\u2019s own foot row holds the acts: Add when there are words, and Discard once there is enough written to be worth losing.', cost: 'brings two controls back — but only in the case where losing the words would actually matter.' },
];

// One thread fragment per option: the turn being answered, the reply box open
// beneath it, and the surface's foot box under the hairline.
const WbSendFragment = ({ N, phase, mobile }) => {
  const Sender = WB_SENDERS[N];
  const [reply, setReply] = React.useState('');
  const [foot, setFoot] = React.useState('');
  const [posted, setPosted] = React.useState([]);
  React.useEffect(() => {
    const t = phase === 'full' ? WB_TYPED : phase === 'part' ? WB_TYPED_PART : '';
    setReply(t); setFoot(t); setPosted([]);
  }, [phase]);
  const post = (text, replyTo) => { if (!text.trim()) return; setPosted(p => [...p, { id: 'p' + Date.now(), by: 'You', at: Date.now(), text: text.trim(), replyTo }]); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <WbThreadHead name="the conversation" />
      <WbTurn t={WB_TURNS[0]}>
        <WbGroup>
          {posted.filter(p => p.replyTo).map(p => <WbTurn key={p.id} t={p} reply />)}
          <div style={{ paddingTop: 6 }}>
            <Sender value={reply} onChange={setReply} onSend={() => { post(reply, 't1'); setReply(''); }} onDiscard={() => setReply('')}
              placeholder={'Reply to ' + WB_TURNS[0].by} ariaLabel={'Reply to ' + WB_TURNS[0].by} size={14.5} />
          </div>
        </WbGroup>
      </WbTurn>
      {posted.filter(p => !p.replyTo).map(p => <WbTurn key={p.id} t={p} />)}
      <div style={{ height: 1, background: 'var(--color-border-2)' }} />
      <Sender value={foot} onChange={setFoot} onSend={() => { post(foot); setFoot(''); }} onDiscard={() => setFoot('')}
        placeholder="Add to the conversation" ariaLabel="Add to the conversation" />
    </div>
  );
};

const WbBoardSend = () => {
  const [phase, setPhase] = useWbState('sendPhase', 'part');
  return (
    <React.Fragment>
      <WbStrip n={2} title="How you send a message" notes={WB_SEND_NOTES}
        question="The surface has two typing boxes and neither behaviour was chosen: the reply box draws Cancel and a greyed-out Send before a character is typed, the foot box draws nothing until you type. The question underneath is how you commit a message here at all — and how you get out of one you have started and do not want."
        hint="Every field is live: type in it, and send actually posts the turn. The driver sets all five options at once so a state can be compared across them."
        driver={<WbSeg label="all five at" value={phase} onChange={setPhase} options={[{ v: 'empty', t: 'Empty' }, { v: 'part', t: 'Mid-typing' }, { v: 'full', t: 'Ready to send' }]} />} />
      <WbSection>
        {WB_SEND_NOTES.map(({ n, name }) => (
          <WbOption key={n} n={n} name={name} cols>
            <WbFrame w={390} label="390"><WbSendFragment N={n} phase={phase} mobile /></WbFrame>
            <WbFrame label="desktop"><WbSendFragment N={n} phase={phase} /></WbFrame>
          </WbOption>
        ))}
      </WbSection>
    </React.Fragment>
  );
};

Object.assign(window, { WbBoardSend });
