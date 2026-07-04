// ============================================================================
// LatentPulse — Loop closure. Reaction-reveal at mark-as-read, five variants.
//   RX_VARIANTS        — variant registry (prototype switcher chrome)
//   ReactionFlow       — input step → ephemeral self-fading reveal
//   ReadReactions      — the permanent, quiet record on the Read-tab card
// Active cards never render reactions. Reveal comes strictly AFTER the reader's
// own mark-as-read. Reacting is optional; skipping still reveals. No counts.
// ============================================================================
const { useState: rxState, useEffect: rxEffect, useRef: rxRef, useMemo: rxMemo } = React;

const RX_VARIANTS = [
  { n: 1, key: 'map',       name: 'The Map',       sub: 'Two-axis grid' },
  { n: 2, key: 'glyphs',    name: 'Nine Glyphs',   sub: 'Emoji palette' },
  { n: 3, key: 'lexicon',   name: 'The Lexicon',   sub: 'Word reactions' },
  { n: 4, key: 'pulse',     name: 'The Pulse',     sub: 'Wordless intensity' },
  { n: 5, key: 'gathering', name: 'The Gathering', sub: 'Replay' },
];

// Nine curated glyphs — distinct, warm. Shared by variants 2 and 5.
const RX_GLYPHS = ['\uD83D\uDCA1', '\uD83E\uDD2F', '\uD83D\uDD25', '\u2764\uFE0F', '\uD83D\uDE02', '\uD83E\uDD14', '\uD83E\uDDD8', '\u26A1', '\uD83C\uDF31'];

// Nine curated phrases — shared by variant 3.
const RX_PHRASES = [
  'Changed my mind', 'Needed this', 'Still thinking about it',
  'Made me smile', 'Over my head', 'Knew it',
  'Hit home', 'Read it twice', 'Passed it on',
];

// Phrase → prose fragment for the Lexicon reveal.
const firstName = (n) => (n === 'You' ? 'You' : String(n).replace(/\s+[A-Z]\.$/, ''));
const RX_FRAGMENT = {
  'Changed my mind':        (n) => `It changed ${firstName(n)}\u2019s mind.`,
  'Needed this':            (n) => `${firstName(n)} needed this.`,
  'Still thinking about it':(n) => `${firstName(n)} is still thinking about it.`,
  'Made me smile':          (n) => `It made ${firstName(n)} smile.`,
  'Over my head':           (n) => `It went over ${firstName(n)}\u2019s head.`,
  'Knew it':                (n) => `${firstName(n)} knew it.`,
  'Hit home':               (n) => `It hit home for ${firstName(n)}.`,
  'Read it twice':          (n) => `${firstName(n)} read it twice.`,
  'Passed it on':           (n) => `${firstName(n)} passed it on.`,
};

const FIRST_LINE = 'You\u2019re the first one here.';
const rxOthers = (item) => ((item && item.reactions) || []).filter(r => r.name !== 'You');

// The Pulse carries no vocabulary, so the reception is banded into a felt
// qualitative reading of how hard it landed — still anonymous, still no counts.
const pulseBand = (w) => w < 0.42 ? { key: 'soft', line: 'It landed gently.' }
  : w < 0.72 ? { key: 'mid', line: 'It landed with the circle.' }
  : { key: 'hard', line: 'It landed hard.' };
const pulseWarmth = (list) => list.length ? list.reduce((a, r) => a + (r.intensity || 0.4), 0) / list.length : 0;

// ---------------------------------------------------------------------------
// Reaction dot — the anonymous marker used by The Map.
// ---------------------------------------------------------------------------
const MapField = ({ mine, others, placeable, onPlace, revealOthers, small }) => {
  const [named, setNamed] = rxState(null);
  const box = small ? 56 : 232;
  const dot = (r, i, isMine, shown) => {
    const d = small ? 6 : 12;
    return (
      <button key={(isMine ? 'me' : 'o') + i} type="button"
        onClick={(e) => { if (small) return; e.stopPropagation(); setNamed(named === (isMine ? 'me' : i) ? null : (isMine ? 'me' : i)); }}
        aria-label={isMine ? 'Your reaction' : (r.name + ' reacted')}
        style={{
          position: 'absolute', left: (r.x * 100) + '%', top: (r.y * 100) + '%',
          width: d, height: d, borderRadius: '50%', transform: 'translate(-50%,-50%)',
          background: isMine ? 'var(--color-accent)' : 'var(--color-fg-1)',
          opacity: isMine ? 1 : (shown ? 0.5 : 0),
          border: isMine ? '2px solid var(--color-surface)' : 'none',
          padding: 0, cursor: small ? 'default' : 'pointer',
          transition: 'opacity var(--duration-slow) var(--ease-quiet)',
          transitionDelay: (!isMine && !small ? (i * 300 + 260) : 0) + 'ms',
          boxShadow: isMine && !small ? '0 0 0 6px rgba(4,120,87,0.14)' : 'none',
        }} />
    );
  };
  return (
    <div>
      <div
        onClick={placeable ? (e) => {
          const b = e.currentTarget.getBoundingClientRect();
          onPlace({ x: Math.min(1, Math.max(0, (e.clientX - b.left) / b.width)), y: Math.min(1, Math.max(0, (e.clientY - b.top) / b.height)) });
        } : undefined}
        style={{
          position: 'relative', width: box, height: box, flexShrink: 0,
          background: 'var(--color-surface-sunken)',
          border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-md)',
          cursor: placeable ? 'crosshair' : 'default',
          backgroundImage: 'linear-gradient(var(--color-border-2) 1px, transparent 1px), linear-gradient(90deg, var(--color-border-2) 1px, transparent 1px)',
          backgroundSize: (box / 3) + 'px ' + (box / 3) + 'px',
          backgroundPosition: 'center',
        }}>
        {/* centre crosshair */}
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'var(--color-border-1)', transform: 'translateX(-0.5px)' }} />
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--color-border-1)', transform: 'translateY(-0.5px)' }} />
        {revealOthers && others.map((r, i) => dot(r, i, false, revealOthers))}
        {mine && dot(mine, 0, true, true)}
        {named != null && !small && (() => {
          const r = named === 'me' ? mine : others[named];
          if (!r) return null;
          return (
            <span style={{
              position: 'absolute', left: (r.x * 100) + '%', top: 'calc(' + (r.y * 100) + '% - 14px)',
              transform: 'translate(-50%,-100%)', whiteSpace: 'nowrap', pointerEvents: 'none',
              background: 'var(--color-fg-1)', color: 'var(--color-surface)',
              fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12,
              padding: '4px 8px', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-raised)',
            }}>{named === 'me' ? 'You' : r.name}</span>
          );
        })()}
      </div>
      {!small && (
        <div style={{ position: 'relative', width: box, margin: '0 auto' }}>
          <RxAxisLabels />
        </div>
      )}
    </div>
  );
};
const RxAxisLabels = () => {
  const lab = { position: 'absolute', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 11, color: 'var(--color-fg-3)', letterSpacing: '0.01em' };
  return (
    <>
      <span style={{ ...lab, top: -226, left: '50%', transform: 'translateX(-50%)' }}>Head</span>
      <span style={{ ...lab, top: 6, left: '50%', transform: 'translateX(-50%)' }}>Heart</span>
      <span style={{ ...lab, top: -112, left: -2, transform: 'translateY(-50%) rotate(-90deg)', transformOrigin: 'left center' }}>Agreed</span>
      <span style={{ ...lab, top: -112, right: -2, transform: 'translateY(-50%) rotate(90deg)', transformOrigin: 'right center' }}>Challenged</span>
    </>
  );
};

// ---------------------------------------------------------------------------
// INPUT STEP — variant-specific, always skippable.
// ---------------------------------------------------------------------------
const RxInput = ({ variant, onCommit, onSkip }) => {
  const [placed, setPlaced] = rxState(null);
  const [held, setHeld] = rxState(0);
  const holdRef = rxRef({ raf: 0, start: 0 });

  const prompt = 'How did it land for you?';

  // ---- press & hold (pulse) ----
  const startHold = (e) => {
    e.preventDefault();
    holdRef.current.start = performance.now();
    const tick = () => {
      const ms = performance.now() - holdRef.current.start;
      setHeld(Math.min(1, ms / 1600));
      holdRef.current.raf = requestAnimationFrame(tick);
    };
    holdRef.current.raf = requestAnimationFrame(tick);
  };
  const endHold = () => {
    if (!holdRef.current.start) return;
    cancelAnimationFrame(holdRef.current.raf);
    const v = Math.min(1, (performance.now() - holdRef.current.start) / 1600);
    holdRef.current.start = 0;
    onCommit({ name: 'You', intensity: Math.max(0.12, v) });
  };

  let body = null;
  if (variant === 'map') {
    body = (
      <>
        <MapField mine={placed} others={[]} placeable onPlace={setPlaced} revealOthers={false} />
        <div style={{ height: 8 }} />
        <RxActions onSkip={onSkip} done={placed ? () => onCommit({ name: 'You', x: placed.x, y: placed.y }) : null} />
      </>
    );
  } else if (variant === 'glyphs' || variant === 'gathering') {
    body = (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, width: 232 }}>
          {RX_GLYPHS.map((g) => (
            <button key={g} type="button" onClick={() => onCommit({ name: 'You', glyph: g })}
              className="lp-rx-glyph" style={{
                aspectRatio: '1', minHeight: 60, fontSize: 26, lineHeight: 1,
                background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
                borderRadius: 'var(--radius-md)', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>{g}</button>
          ))}
        </div>
        <div style={{ height: 12 }} />
        <RxActions onSkip={onSkip} done={null} />
      </>
    );
  } else if (variant === 'lexicon') {
    body = (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: 300 }}>
          {RX_PHRASES.map((p) => (
            <button key={p} type="button" onClick={() => onCommit({ name: 'You', phrase: p })}
              className="lp-rx-phrase" style={{
                minHeight: 44, padding: '10px 12px', textAlign: 'left',
                fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13.5, color: 'var(--color-fg-1)',
                background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
                borderRadius: 'var(--radius-md)', cursor: 'pointer', lineHeight: 1.25,
              }}>{p}</button>
          ))}
        </div>
        <div style={{ height: 12 }} />
        <RxActions onSkip={onSkip} done={null} />
      </>
    );
  } else if (variant === 'pulse') {
    body = (
      <>
        <div style={{ position: 'relative', width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{
            position: 'absolute', width: 40 + held * 118, height: 40 + held * 118, borderRadius: '50%',
            background: 'rgba(4,120,87,' + (0.10 + held * 0.22) + ')', transition: 'none',
          }} />
          <button type="button"
            onPointerDown={startHold} onPointerUp={endHold} onPointerLeave={endHold}
            aria-label="Press and hold to pulse"
            style={{
              position: 'relative', width: 84, height: 84, borderRadius: '50%',
              background: 'var(--color-accent)', border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(4,120,87,0.28)', touchAction: 'none',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', opacity: 0.9 }} />
          </button>
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--color-fg-3)', margin: '4px 0 12px' }}>Press and hold — longer if it landed harder.</p>
        <RxActions onSkip={onSkip} done={null} hideHint />
      </>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-xl)', color: 'var(--color-fg-1)', margin: '0 0 4px', letterSpacing: '-0.01em' }}>{prompt}</h2>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--color-fg-3)', margin: '0 0 18px' }}>Optional — a note left for the circle.</p>
      {body}
    </div>
  );
};

const RxActions = ({ onSkip, done, hideHint }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: done ? 'space-between' : 'center', gap: 12, width: '100%' }}>
    <button type="button" onClick={onSkip} className="lp-btn-tertiary" style={{
      background: 'transparent', border: 0, cursor: 'pointer', padding: '10px 6px',
      fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14, color: 'var(--color-fg-2)',
    }}>Skip</button>
    {done && <Button variant="primary" onClick={done}>Leave reaction</Button>}
  </div>
);

// ---------------------------------------------------------------------------
// REVEAL STEP — ephemeral, self-fading. Shows the circle whether or not you
// reacted. First-reader → one graceful line.
// ---------------------------------------------------------------------------
const RxReveal = ({ variant, mine, others, onDone }) => {
  const [fading, setFading] = rxState(false);
  const first = others.length === 0;

  // total on-screen time before the whole pop fades itself out
  const total = first ? 2600
    : variant === 'gathering' ? Math.min(7200, 1400 + (others.length + 1) * 950 + 1600)
    : variant === 'glyphs' ? Math.min(6400, 1200 + others.length * 780 + 1700)
    : variant === 'map' ? 3400 + others.length * 300
    : variant === 'lexicon' ? 3600
    : 4400; // pulse

  rxEffect(() => {
    const f = setTimeout(() => setFading(true), total);
    const d = setTimeout(onDone, total + 480);
    return () => { clearTimeout(f); clearTimeout(d); };
  }, []);

  let inner = null;
  if (first) {
    inner = <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 'var(--text-lg)', color: 'var(--color-fg-1)', margin: 0, textAlign: 'center' }}>{FIRST_LINE}</p>;
  } else if (variant === 'map') {
    inner = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <RxRevealLabel>Where the circle landed</RxRevealLabel>
        <MapField mine={mine} others={others} placeable={false} revealOthers={true} />
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--color-fg-3)', margin: '2px 0 0' }}>Tap a dot for a name.</p>
      </div>
    );
  } else if (variant === 'glyphs') {
    inner = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <RxRevealLabel>How it landed</RxRevealLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 180 }}>
          {others.map((r, i) => (
            <div key={i} className="lp-rx-rise" style={{ animationDelay: (i * 780) + 'ms', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
              <span style={{ fontSize: 26, lineHeight: 1 }}>{r.glyph}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, color: 'var(--color-fg-1)' }}>{r.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (variant === 'lexicon') {
    inner = (
      <div style={{ maxWidth: 340, textAlign: 'center' }}>
        <RxRevealLabel>In the circle</RxRevealLabel>
        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 'var(--text-lg)', lineHeight: 1.5, color: 'var(--color-fg-1)', margin: '12px 0 0', textWrap: 'pretty' }}>
          {others.map((r) => (RX_FRAGMENT[r.phrase] ? RX_FRAGMENT[r.phrase](r.name) : '') + ' ')}
        </p>
      </div>
    );
  } else if (variant === 'pulse') {
    // One felt landing: a disc that beats harder — and echoes farther — the
    // harder it landed for the circle. Fully anonymous; the qualitative line
    // resolves “how hard is hard” without any number.
    const warmth = pulseWarmth(others);
    const band = pulseBand(warmth);
    const disc = 56 + warmth * 46;
    inner = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        <RxRevealLabel>How hard it landed</RxRevealLabel>
        <div style={{ position: 'relative', width: 216, height: 176, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="lp-rx-echo" style={{
              animationDelay: (i * 560) + 'ms', width: disc, height: disc,
              '--reach': (1.35 + warmth * 1.6),
              border: '1.5px solid var(--color-accent)',
            }} />
          ))}
          <span className="lp-rx-beat" style={{
            width: disc, height: disc, borderRadius: '50%',
            background: 'rgba(4,120,87,' + (0.22 + warmth * 0.5) + ')',
            '--peak': (1 + warmth * 0.85),
          }} />
        </div>
        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 'var(--text-md)', color: 'var(--color-fg-1)', margin: 0, textAlign: 'center' }}>{band.line}</p>
      </div>
    );
  } else if (variant === 'gathering') {
    const seq = [...others, ...(mine ? [{ ...mine, when: 'now' }] : [])];
    inner = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <RxRevealLabel>The gathering</RxRevealLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 200 }}>
          {seq.map((r, i) => (
            <div key={i} className="lp-rx-rise" style={{ animationDelay: (700 + i * 950) + 'ms', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22, lineHeight: 1, width: 28, textAlign: 'center' }}>{r.glyph || '\u2022'}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-fg-1)' }}>{r.name}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-fg-3)' }}>· {r.when || ''}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      opacity: fading ? 0 : 1, transition: 'opacity 460ms var(--ease-quiet)',
    }}>
      {inner}
    </div>
  );
};
const RxRevealLabel = ({ children }) => (
  <span style={{
    fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 11, letterSpacing: '0.06em',
    textTransform: 'uppercase', color: 'var(--color-fg-3)',
  }}>{children}</span>
);

// ---------------------------------------------------------------------------
// ReactionFlow — the whole moment. Confirm has already committed the read.
// ---------------------------------------------------------------------------
const ReactionFlow = ({ item, variant, onMarkRead, onClose }) => {
  const [step, setStep] = rxState('input');
  const [mine, setMine] = rxState(null);
  const others = rxMemo(() => rxOthers(item), [item]);

  const commit = (rx) => { onMarkRead(item, rx); setMine(rx); setStep('reveal'); };

  rxEffect(() => {
    if (step !== 'input') return;
    const onKey = (e) => { if (e.key === 'Escape') commit(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  const modal = step === 'input';
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) { if (step === 'reveal') onClose(); } }}
      style={{
        position: 'fixed', inset: 0, zIndex: 135,
        background: modal ? 'var(--color-scrim)' : 'rgba(10,10,10,0.22)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        transition: 'background 460ms var(--ease-quiet)',
      }} className="lp-anim-fade">
      <div style={{
        background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)', boxShadow: 'var(--shadow-overlay)',
        maxWidth: 400, width: 'auto', minWidth: 280,
      }}>
        {step === 'input'
          ? <RxInput variant={variant} onCommit={commit} onSkip={() => commit(null)} />
          : <RxReveal variant={variant} mine={mine} others={others} onDone={onClose} />}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// ReadReactions — the permanent, quiet record on the Read-tab card.
// ---------------------------------------------------------------------------
const ReadReactions = ({ item, variant }) => {
  const all = (item && item.reactions) || [];
  if (variant === 'pulse') {
    if (all.length === 0) return null;
    const warmth = pulseWarmth(all);
    const band = pulseBand(warmth);
    const d = 5 + warmth * 7;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border-2)' }}>
        <span style={{ position: 'relative', width: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid var(--color-accent)', opacity: 0.18 + warmth * 0.32 }} />
          <span style={{ width: d, height: d, borderRadius: '50%', background: 'var(--color-accent)', opacity: 0.4 + warmth * 0.5 }} />
        </span>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-2)', whiteSpace: 'nowrap' }}>{band.line}</span>
      </div>
    );
  }
  if (all.length === 0) return null;

  let body = null;
  if (variant === 'map') {
    const mine = all.find(r => r.name === 'You');
    body = (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <MapField mine={mine || null} others={all.filter(r => r.name !== 'You')} placeable={false} revealOthers={true} small />
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-3)' }}>Where the circle landed</span>
      </div>
    );
  } else if (variant === 'glyphs') {
    body = (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {all.map((r, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px 5px 8px', background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>{r.glyph}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--color-fg-1)' }}>{r.name}</span>
          </span>
        ))}
      </div>
    );
  } else if (variant === 'lexicon') {
    body = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {all.map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13.5, color: 'var(--color-fg-1)' }}>{r.name}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13.5, color: 'var(--color-fg-2)' }}>{r.phrase}</span>
          </div>
        ))}
      </div>
    );
  } else if (variant === 'gathering') {
    body = (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 2, overflowX: 'auto' }}>
        {all.map((r, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ height: 1, flex: '0 0 18px', background: 'var(--color-border-1)', marginTop: 13 }} />}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flexShrink: 0 }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>{r.glyph || '\u2022'}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 11, color: 'var(--color-fg-2)' }}>{r.name === 'You' ? 'You' : firstName(r.name)}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-fg-3)' }}>{r.when || ''}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-border-2)' }}>{body}</div>
  );
};

Object.assign(window, { RX_VARIANTS, ReactionFlow, ReadReactions });
