// ============================================================================
// Circlists — the device preview (LM-769). A staged view OUTSIDE the app's own
// frame: what the member's phone shows when two circles have news. Not a
// surface of the product, so it is never routed to from inside the app — the
// states register is the only way in, and the way out is the control at the
// top.
//
// Two frames, because the feature has two resting places and they answer
// different questions: the LOCK SCREEN answers "what arrives", the HOME SCREEN
// answers "what is left behind once the moment has passed". One without the
// other leaves half the design unseen. They sit side by side and wrap to a
// column when the canvas is narrow — the preview obeys the same
// responsive-by-default rule as everything else here.
//
// ONE notification per circle, title only, no number in it. The badge is the
// only number, and it counts CIRCLES.
//
// NOT BUILT: nothing. The Android frame renders the brand's own notification
// badge (brand/assets/notification-badge.svg) as supplied — a single-colour
// alpha silhouette, never the full-colour app icon, never recoloured or
// redrawn. The file reads black on transparency; Android keeps only its alpha
// channel and tints it, dark on a light notification header, which is why it
// draws dark here and not white.
// ============================================================================

const PUSH_DESK = {
  minHeight: '100vh', width: '100%', background: '#1c1c1a',
  backgroundImage: 'radial-gradient(circle at 50% 0%, #2a2a27 0%, #161614 70%)',
  padding: 'clamp(20px, 5vh, 56px) 16px 56px',
};
const PUSH_SCREEN = {
  width: 300, height: 620, borderRadius: 42, padding: 10, flexShrink: 0,
  background: '#050505', boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 0 2px #2c2c2c',
};
const PUSH_GLASS = {
  width: '100%', height: '100%', borderRadius: 33, overflow: 'hidden', position: 'relative',
  background: 'linear-gradient(170deg, #2f3b46 0%, #1b232b 48%, #11161b 100%)',
  display: 'flex', flexDirection: 'column',
};
const PUSH_CAPTION = {
  font: '500 12px/1.5 var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.45)', margin: '14px 0 0', textAlign: 'center',
};

const PushAppIcon = ({ size = 20, radius = null }) => (
  <img src="brand/assets/icon-192.png" alt="" width={size} height={size}
    style={{ display: 'block', borderRadius: radius == null ? size * 0.2237 : radius, flexShrink: 0 }} />
);

const PushClock = () => (
  <div style={{ textAlign: 'center', padding: '54px 0 0', color: '#fff', flexShrink: 0 }}>
    <div style={{ font: '400 15px/1 var(--font-sans)', opacity: 0.8 }}>Tuesday 22 September</div>
    <div style={{ font: '300 68px/1.05 var(--font-sans)', letterSpacing: '-0.02em', marginTop: 4 }}>9:41</div>
  </div>
);

// One notification. Title alone — there is no body, no count and no action, and
// the smallest platform (Safari) would discard everything else anyway.
const PushBanner = ({ name, onOpen }) => (
  <button type="button" onClick={onOpen} style={{
    display: 'flex', alignItems: 'center', gap: 9, width: '100%', textAlign: 'left', cursor: 'pointer',
    background: 'rgba(255,255,255,0.82)', border: 0, borderRadius: 18, padding: '11px 13px',
    WebkitBackdropFilter: 'blur(14px)', backdropFilter: 'blur(14px)',
  }}>
    <PushAppIcon size={22} />
    <span style={{ flex: 1, minWidth: 0 }}>
      <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ font: '500 11.5px/1 var(--font-sans)', letterSpacing: '0.02em', color: 'rgba(0,0,0,0.55)' }}>CIRCLISTS</span>
        <span style={{ font: '400 11.5px/1 var(--font-sans)', color: 'rgba(0,0,0,0.45)' }}>now</span>
      </span>
      <span style={{ display: 'block', font: '600 14px/1.35 var(--font-sans)', color: '#000', marginTop: 3 }}>New links in {name}</span>
    </span>
  </button>
);

const PushHomeIcon = ({ badge }) => (
  <div style={{ width: 62, position: 'relative' }}>
    <div style={{ position: 'relative' }}>
      <PushAppIcon size={62} radius={14} />
      {badge > 0 && (
        <span style={{
          position: 'absolute', top: -5, right: -5, minWidth: 22, height: 22, borderRadius: 11,
          background: '#ff3b30', color: '#fff', font: '600 13px/22px var(--font-sans)', textAlign: 'center',
          padding: '0 6px', boxShadow: '0 0 0 2px rgba(0,0,0,0.25)',
        }}>{badge}</span>
      )}
    </div>
    <div style={{ font: '400 11px/1.3 var(--font-sans)', color: '#fff', textAlign: 'center', marginTop: 6, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>Circlists</div>
  </div>
);

const PushBadgeMark = ({ size = 14, opacity = 1 }) => (
  <img src="brand/assets/notification-badge.svg" alt="" width={size} height={size}
    style={{ display: 'block', flexShrink: 0, opacity }} />
);

// Android's notification shade. The badge — not the app icon — is what the OS
// puts in the status bar and in the notification header; it is an alpha
// silhouette the system tints, so it reads dark on this light shade.
const PushAndroidShade = ({ circles, onOpen }) => (
  <div style={{ ...PUSH_GLASS, background: 'linear-gradient(180deg, #e9e8e3 0%, #dedcd6 100%)' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 0', color: 'rgba(0,0,0,0.7)' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <PushBadgeMark size={13} opacity={0.75} /><PushBadgeMark size={13} opacity={0.75} />
      </span>
      <span style={{ font: '500 12px/1 var(--font-sans)' }}>9:41</span>
    </div>
    <div style={{ textAlign: 'center', color: 'rgba(0,0,0,0.85)', padding: '22px 0 20px' }}>
      <div style={{ font: '300 44px/1.05 var(--font-sans)' }}>9:41</div>
      <div style={{ font: '400 13px/1 var(--font-sans)', opacity: 0.7, marginTop: 6 }}>Tue, 22 September</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '0 10px' }}>
      {circles.map((s) => (
        <button type="button" key={s.id} onClick={() => onOpen && onOpen(s.id)} style={{
          display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
          background: '#fff', border: 0, borderRadius: 24, padding: '12px 16px',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <PushBadgeMark size={13} opacity={0.62} />
            <span style={{ font: '400 12px/1 var(--font-sans)', color: 'rgba(0,0,0,0.6)' }}>Circlists</span>
            <span style={{ font: '400 12px/1 var(--font-sans)', color: 'rgba(0,0,0,0.4)' }}>· now</span>
          </span>
          <span style={{ display: 'block', font: '500 14px/1.35 var(--font-sans)', color: '#000' }}>New links in {s.name}</span>
        </button>
      ))}
    </div>
  </div>
);

const CircDevicePreview = ({ spaces = [], onOpenCircle, onExit }) => {
  const circles = spaces.filter((s) => s.funded && !/^TEST\b/i.test(s.name || '')).slice(0, 2);
  return (
    <div style={PUSH_DESK}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 'clamp(20px, 4vh, 40px)' }}>
          <div>
            <div style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>Device preview</div>
            <h1 style={{ font: '600 22px/1.25 var(--font-sans)', letterSpacing: '-0.01em', color: '#fff', margin: '8px 0 0' }}>Two circles with something new</h1>
          </div>
          <button type="button" onClick={onExit} style={{
            minHeight: 44, padding: '0 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
            background: 'transparent', border: '1px solid rgba(255,255,255,0.28)', color: '#fff',
            font: '500 14px/1 var(--font-sans)',
          }}>Back to the app</button>
        </div>
        <div style={{ display: 'flex', gap: 'clamp(20px, 5vw, 56px)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div>
            <div style={PUSH_SCREEN}><div style={PUSH_GLASS}>
              <PushClock />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '28px 12px 0' }}>
                {circles.map((s) => <PushBanner key={s.id} name={s.name} onOpen={() => onOpenCircle && onOpenCircle(s.id)} />)}
              </div>
            </div></div>
            <p style={PUSH_CAPTION}>Lock screen — one per circle</p>
          </div>
          <div>
            <div style={PUSH_SCREEN}><div style={PUSH_GLASS}>
              <div style={{ padding: '62px 22px 0' }}><PushHomeIcon badge={circles.length} /></div>
            </div></div>
            <p style={PUSH_CAPTION}>Home screen — the badge counts circles</p>
          </div>
          <div>
            <div style={PUSH_SCREEN}><PushAndroidShade circles={circles} onOpen={onOpenCircle} /></div>
            <p style={PUSH_CAPTION}>Android — the brand’s notification badge</p>
          </div>
        </div>
        <p style={{ font: '400 14px/1.6 var(--font-sans)', color: 'rgba(255,255,255,0.62)', margin: '32px auto 0', maxWidth: '56ch', textAlign: 'center', textWrap: 'pretty' }}>
          Tap a notification to open that circle. Visiting a circle takes it out of the badge count.
        </p>
      </div>
    </div>
  );
};

Object.assign(window, { CircDevicePreview });
