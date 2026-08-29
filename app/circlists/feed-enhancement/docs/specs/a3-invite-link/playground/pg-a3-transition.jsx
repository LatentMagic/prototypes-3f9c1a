// ============================================================================
// A3 — the swap. Four treatments of ONE moment: the card going from asking for
// an address to handing back a link.
//
// The question this rig answers: the two faces are now the same shape (label →
// box + primary beside it), and that parity is exactly what makes the swap feel
// uncanny — the input appears to mutate into a URL and the button to relabel
// itself, while the geometry shifts underneath. Four stances on that, from
// "never swap at all" to "there is no event to swap on".
//
// Re-publishes window.InviteForm as a dispatcher over app/spaces.jsx, so this
// IS the app. It opens on the card (gear → Members → Invite a member is the
// long way round; the rig stages that landing itself — see below).
// Everything around the card is the shipped surface, untouched.
// ============================================================================
const PG_A3_KEY = 'pg_a3_transition_v1';
const PG_A3_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PG_A3_BASE = 'https://circlists.com/join/';

// The rig has ONE destination, so it must not depend on the URL carrying
// ?state=members-champion. main.jsx reads window.circResolveState once at mount
// (app/main.jsx:132); wrapping that name is the same droppable-module move as
// re-publishing InviteForm, and needs no app/ edit.
//
// This is also the defect the first look hit: a query string that arrives
// mangled (or not at all) resolves to `unresolved`, and an unresolved name
// lands the reader on the STATES INDEX — a full-page catalogue of state names,
// which reads as some unrelated tip screen. An explicit, resolvable ?state=
// still wins; everything else now opens on the card.
const pgA3Resolve = window.circResolveState;
window.circResolveState = () => {
  const r = pgA3Resolve ? pgA3Resolve() : null;
  if (r && (r.kind === 'state' || r.kind === 'index')) return r;
  return { kind: 'state', id: 'members-champion' };
};

// Same token as the candidate: a pure function of address + circle, so the same
// address always mints the same link. Option 04 leans on this — a link that is
// derived rather than issued is only honest if it is deterministic.
const pgA3Token = (email, spaceId) => {
  const s = String(email || '').trim().toLowerCase() + '|' + String(spaceId || '');
  let a = 2166136261, b = 5381;
  for (let i = 0; i < s.length; i++) {
    a = ((a ^ s.charCodeAt(i)) * 16777619) >>> 0;
    b = (((b * 33) >>> 0) ^ s.charCodeAt(i)) >>> 0;
  }
  const chunk = (n) => ('000' + n.toString(36)).slice(-4);
  return chunk(a) + '-' + chunk(b);
};
const pgA3Url = (email, space) => PG_A3_BASE + pgA3Token(email, space.id);
const pgA3Check = (space, v) => {
  if (!PG_A3_RE.test(v)) return 'Enter a valid email address.';
  if (space.members.some(m => (m.email || '').toLowerCase() === v)) return 'That person is already a member of this circle.';
  return null;
};

const pgA3 = {
  title: { fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-fg-1)', marginBottom: 4 },
  helper: { fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: '0 0 var(--space-4)' },
  label: { display: 'block', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-2)', marginBottom: 6 },
  bind: { fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: 'var(--space-4) 0 0' },
  againRow: { display: 'flex', margin: 'var(--space-4) 0 0' },
};

const PgA3Link = ({ url, one, boxRef, dim }) => (
  <div className="cand-a3-linkrow" data-dim={dim ? '' : undefined}>
    <span style={{ display: 'inline-flex', flexShrink: 0 }}><Icon name="link" size={15} color="var(--color-fg-3)" /></span>
    <span ref={boxRef} className={one ? 'cand-a3-linkval pg-one' : 'cand-a3-linkval'}>{url}</span>
  </div>
);

// Clipboard with the candidate's fallback (select the span, execCommand) — the
// link is a <span>, never a readonly input, so nothing is ever hidden behind a
// scroll at phone width.
const usePgA3Copy = (boxRef) => {
  const [copied, setCopied] = React.useState(null);
  React.useEffect(() => {
    if (copied !== 'ok') return;
    const t = setTimeout(() => setCopied(null), 2400);
    return () => clearTimeout(t);
  }, [copied]);
  const copy = async (url) => {
    let ok = false;
    try { await navigator.clipboard.writeText(url); ok = true; } catch (e) {
      try {
        const el = boxRef.current;
        if (el) {
          const sel = window.getSelection(); const range = document.createRange();
          range.selectNodeContents(el); sel.removeAllRanges(); sel.addRange(range);
          ok = document.execCommand('copy');
        }
      } catch (e2) { ok = false; }
    }
    setCopied(ok ? 'ok' : 'manual');
  };
  return { copied, copy, setCopied };
};

const PgA3Status = ({ copied }) => (
  <span className="circ-vh" role="status" aria-live="polite">{copied === 'ok' ? 'Link copied.' : ''}</span>
);

// ---- 01 Grows --------------------------------------------------------------
// The ask never leaves. The link opens BENEATH the field it came from, so
// nothing morphs and nothing is replaced: the address stays visible, editable,
// and is its own answer to "who is this for". Editing it shuts the link again.
// One primary at all times — Get a link demotes to secondary while the link on
// screen matches the address in the field.
const PgA3Grows = ({ space }) => {
  const [email, setEmail] = React.useState('');
  const [err, setErr] = React.useState(null);
  const [minted, setMinted] = React.useState(null);
  const fieldRef = React.useRef(null); const boxRef = React.useRef(null);
  const { copied, copy } = usePgA3Copy(boxRef);
  React.useEffect(() => { const t = setTimeout(() => fieldRef.current && fieldRef.current.focus(), 60); return () => clearTimeout(t); }, []);
  const v = email.trim().toLowerCase();
  const live = !!minted && minted.email === v;
  const submit = (e) => {
    e.preventDefault();
    const bad = pgA3Check(space, v);
    if (bad) { setErr(bad); return; }
    setErr(null); setMinted({ email: v, url: pgA3Url(v, space) });
  };
  return (
    <div className="cand-a3-card">
      <div style={pgA3.title}>Invite a member</div>
      <form onSubmit={submit} noValidate>
        <p style={pgA3.helper}>Enter their email address and copy the link. Send it to them yourself — they join free.</p>
        <label htmlFor="invite-email" style={pgA3.label}>Email</label>
        <div className="cand-a3-out">
          <div className="cand-a3-field">
            <Field ref={fieldRef} name="invite-email" type="email" placeholder="name@example.com" value={email}
              onChange={(e) => { setEmail(e.target.value); if (err) setErr(null); }} error={err} />
          </div>
          <div className="cand-a3-act">
            <Button type="submit" variant={live ? 'secondary' : 'primary'} style={{ width: 'var(--cand-a3-copyw, 100%)' }}
              icon={<Icon name="link" size={16} color={live ? 'var(--color-fg-2)' : '#fff'} />}>Get a link</Button>
          </div>
        </div>
      </form>
      <div className="pg-grow" data-open={live ? '' : undefined}>
        <div className="pg-grow-in">
          {live && (
            <div>
              <div className="cand-a3-out" style={{ paddingTop: 'var(--space-4)' }}>
                <PgA3Link url={minted.url} boxRef={boxRef} />
                <div className="cand-a3-act">
                  <Button variant="primary" onClick={() => copy(minted.url)} style={{ width: 'var(--cand-a3-copyw, 100%)' }}
                    icon={<Icon name={copied === 'ok' ? 'check' : 'copy'} size={16} color="#fff" />}>{copied === 'ok' ? 'Copied' : 'Copy'}</Button>
                </div>
              </div>
              {copied === 'manual' && <p style={pgA3.bind}>Copy it by hand — the link is selected.</p>}
              <p style={pgA3.bind}>It only works for that address, and it takes them straight into {space.name}.</p>
            </div>
          )}
        </div>
      </div>
      <PgA3Status copied={copied} />
    </div>
  );
};

// ---- 02 One frame ----------------------------------------------------------
// Parity carried to its end: the box and the button hold their exact geometry
// and only their CONTENTS cross-fade. The two faces are stacked in one cell, so
// nothing can move — the URL is therefore one line and truncates. The label
// swaps in place. The button's width is locked so it cannot resize under its
// own label.
const PgA3OneFrame = ({ space }) => {
  const [email, setEmail] = React.useState('');
  const [err, setErr] = React.useState(null);
  const [minted, setMinted] = React.useState(null);
  const fieldRef = React.useRef(null); const boxRef = React.useRef(null); const actRef = React.useRef(null);
  const { copied, copy, setCopied } = usePgA3Copy(boxRef);
  React.useEffect(() => { const t = setTimeout(() => { const el = minted ? actRef.current : fieldRef.current; if (el) el.focus(); }, 60); return () => clearTimeout(t); }, [minted]);
  const submit = (e) => {
    e.preventDefault();
    const v = email.trim().toLowerCase();
    const bad = pgA3Check(space, v);
    if (bad) { setErr(bad); return; }
    setErr(null); setCopied(null); setMinted({ email: v, url: pgA3Url(v, space) });
  };
  const again = () => { setMinted(null); setCopied(null); setErr(null); setEmail(''); };
  return (
    <div className="cand-a3-card">
      <div style={pgA3.title}>Invite a member</div>
      <form onSubmit={submit} noValidate>
        <p style={pgA3.helper}>Enter their email address and copy the link. Send it to them yourself — they join free.</p>
        <label htmlFor="invite-email" style={pgA3.label}>
          <span className="pg-swap" key={minted ? 'b' : 'a'}>{minted ? minted.email : 'Email'}</span>
        </label>
        <div className="cand-a3-out">
          <div className="pg-frame">
            <div className="pg-face" data-on={!minted ? '' : undefined}>
              <Field ref={fieldRef} name="invite-email" type="email" placeholder="name@example.com" value={email}
                onChange={(e) => { setEmail(e.target.value); if (err) setErr(null); }} error={err} />
            </div>
            <div className="pg-face pg-face-b" data-on={minted ? '' : undefined} aria-hidden={!minted}>
              <PgA3Link url={minted ? minted.url : ''} one boxRef={boxRef} />
            </div>
          </div>
          <div className="cand-a3-act">
            <Button ref={actRef} type={minted ? 'button' : 'submit'} variant="primary"
              onClick={minted ? () => copy(minted.url) : undefined}
              style={{ width: 'var(--cand-a3-copyw, 100%)', minWidth: 136 }}
              icon={<Icon name={minted ? (copied === 'ok' ? 'check' : 'copy') : 'link'} size={16} color="#fff" />}>
              <span className="pg-swap" key={minted ? (copied === 'ok' ? 'c' : 'b') : 'a'}>{minted ? (copied === 'ok' ? 'Copied' : 'Copy') : 'Get a link'}</span>
            </Button>
          </div>
        </div>
        {minted && (
          <div>
            {copied === 'manual' && <p style={pgA3.bind}>Copy it by hand — the link is selected.</p>}
            <p style={pgA3.bind}>It only works for that address, and it takes them straight into {space.name}.</p>
            <div style={pgA3.againRow}><Button variant="secondary" size="sm" onClick={again}>Invite someone else</Button></div>
          </div>
        )}
      </form>
      <PgA3Status copied={copied} />
    </div>
  );
};

// ---- 03 Settles ------------------------------------------------------------
// The candidate's two faces, given the app's own arrival grammar instead of a
// bare swap: the leaving face fades (150ms), the card's height eases to the new
// one (420ms, ease-quiet), the arriving face rises in on .circ-rise — the same
// motion a new card plays in the feed. The card reads as ONE object settling
// rather than two controls trading places. Height is measured before paint, the
// way .cand-barslot does it, because a height cannot transition to auto.
const PgA3Settles = ({ space }) => {
  const [email, setEmail] = React.useState('');
  const [err, setErr] = React.useState(null);
  const [minted, setMinted] = React.useState(null);
  const [leaving, setLeaving] = React.useState(false);
  const fieldRef = React.useRef(null); const boxRef = React.useRef(null); const actRef = React.useRef(null);
  const wrapRef = React.useRef(null); const lastH = React.useRef(null);
  const { copied, copy, setCopied } = usePgA3Copy(boxRef);
  React.useEffect(() => { const t = setTimeout(() => { const el = minted ? actRef.current : fieldRef.current; if (el) el.focus(); }, 260); return () => clearTimeout(t); }, [minted]);
  React.useLayoutEffect(() => {
    const el = wrapRef.current; if (!el) return;
    el.style.transition = ''; el.style.height = 'auto';
    const next = el.offsetHeight; const prev = lastH.current; lastH.current = next;
    if (prev == null || prev === next) return;
    el.style.height = prev + 'px';
    el.getBoundingClientRect();
    el.style.transition = 'height 420ms var(--ease-quiet)';
    el.style.height = next + 'px';
    const done = (e) => { if (e.target !== el) return; el.style.transition = ''; el.style.height = 'auto'; el.removeEventListener('transitionend', done); };
    el.addEventListener('transitionend', done);
  }, [minted]);
  const turn = (next) => { setLeaving(true); setTimeout(() => { setMinted(next); setLeaving(false); }, 150); };
  const submit = (e) => {
    e.preventDefault();
    const v = email.trim().toLowerCase();
    const bad = pgA3Check(space, v);
    if (bad) { setErr(bad); return; }
    setErr(null); setCopied(null); turn({ email: v, url: pgA3Url(v, space) });
  };
  const again = () => { setCopied(null); setErr(null); setEmail(''); turn(null); };
  return (
    <div className="cand-a3-card">
      <div style={pgA3.title}>Invite a member</div>
      <div className="pg-settle" ref={wrapRef}>
        <div className={leaving ? 'pg-settle-face pg-leaving' : 'pg-settle-face circ-rise'} key={minted ? 'b' : 'a'}>
          {minted ? (
            <div>
              <div style={pgA3.label}>{minted.email}</div>
              <div className="cand-a3-out">
                <PgA3Link url={minted.url} boxRef={boxRef} />
                <div className="cand-a3-act">
                  <Button ref={actRef} variant="primary" onClick={() => copy(minted.url)} style={{ width: 'var(--cand-a3-copyw, 100%)' }}
                    icon={<Icon name={copied === 'ok' ? 'check' : 'copy'} size={16} color="#fff" />}>{copied === 'ok' ? 'Copied' : 'Copy'}</Button>
                </div>
              </div>
              {copied === 'manual' && <p style={pgA3.bind}>Copy it by hand — the link is selected.</p>}
              <p style={pgA3.bind}>It only works for that address, and it takes them straight into {space.name}.</p>
              <div style={pgA3.againRow}><Button variant="secondary" size="sm" onClick={again}>Invite someone else</Button></div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <p style={pgA3.helper}>Enter their email address and copy the link. Send it to them yourself — they join free.</p>
              <label htmlFor="invite-email" style={pgA3.label}>Email</label>
              <div className="cand-a3-out">
                <div className="cand-a3-field">
                  <Field ref={fieldRef} name="invite-email" type="email" placeholder="name@example.com" value={email}
                    onChange={(e) => { setEmail(e.target.value); if (err) setErr(null); }} error={err} />
                </div>
                <div className="cand-a3-act">
                  <Button type="submit" variant="primary" style={{ width: 'var(--cand-a3-copyw, 100%)' }}
                    icon={<Icon name="link" size={16} color="#fff" />}>Get a link</Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
      <PgA3Status copied={copied} />
    </div>
  );
};

// ---- 04 No moment ---------------------------------------------------------
// There is no transition because there is no event. The link is DERIVED from
// the address as it is typed — which is literally true of the token — so the
// card has one state and one shape for its whole life. The answer's box is
// present from the start, holding the stem of the address it will complete, so
// nothing ever appears from nowhere. Copy is the only primary; there is no
// mint. Nothing to press means nothing to validate: a typo leaves the box dim
// rather than raising an error.
const PgA3Derived = ({ space }) => {
  const [email, setEmail] = React.useState('');
  const fieldRef = React.useRef(null); const boxRef = React.useRef(null);
  const { copied, copy } = usePgA3Copy(boxRef);
  React.useEffect(() => { const t = setTimeout(() => fieldRef.current && fieldRef.current.focus(), 60); return () => clearTimeout(t); }, []);
  const v = email.trim().toLowerCase();
  const dup = PG_A3_RE.test(v) && space.members.some(m => (m.email || '').toLowerCase() === v);
  const url = PG_A3_RE.test(v) && !dup ? pgA3Url(v, space) : null;
  return (
    <div className="cand-a3-card">
      <div style={pgA3.title}>Invite a member</div>
      <p style={pgA3.helper}>Enter their email address and copy the link. Send it to them yourself — they join free.</p>
      <label htmlFor="invite-email" style={pgA3.label}>Email</label>
      <div className="cand-a3-field">
        <Field ref={fieldRef} name="invite-email" type="email" placeholder="name@example.com" value={email}
          onChange={(e) => setEmail(e.target.value)} error={dup ? 'That person is already a member of this circle.' : null} />
      </div>
      <div style={{ ...pgA3.label, marginTop: 'var(--space-4)' }}>Their link</div>
      <div className="cand-a3-out">
        <PgA3Link url={url || PG_A3_BASE} one={!url} dim={!url} boxRef={boxRef} />
        <div className="cand-a3-act">
          <Button variant="primary" disabled={!url} onClick={() => url && copy(url)} style={{ width: 'var(--cand-a3-copyw, 100%)' }}
            icon={<Icon name={copied === 'ok' ? 'check' : 'copy'} size={16} color="#fff" />}>{copied === 'ok' ? 'Copied' : 'Copy'}</Button>
        </div>
      </div>
      {copied === 'manual' && <p style={pgA3.bind}>Copy it by hand — the link is selected.</p>}
      <p style={pgA3.bind}>It only works for that address, and it takes them straight into {space.name}.</p>
      <PgA3Status copied={copied} />
    </div>
  );
};

// ---- the four, and the strip ----------------------------------------------
const PG_A3_OPTS = [
  { id: 'grows', n: '01', name: 'Grows', C: PgA3Grows,
    stance: 'No swap at all. The ask stays put and the link opens beneath the field it came from; editing the address shuts it again.',
    cost: 'The tallest card of the four — two boxes and two controls on screen at once.' },
  { id: 'frame', n: '02', name: 'One frame', C: PgA3OneFrame,
    stance: 'Parity finished: box and button hold their exact geometry and only their contents cross-fade. Nothing can move.',
    cost: 'The link is one line and truncates, so you never see all of it — and it reads as the field turning read-only.' },
  { id: 'settles', n: '03', name: 'Settles', C: PgA3Settles,
    stance: "The candidate's two faces, given the app's arrival grammar: the old face fades, the height eases, the new one rises in.",
    cost: 'Motion on a settings surface, and it is still a swap — a smoother one, roughly 700ms end to end.' },
  { id: 'derived', n: '04', name: 'No moment', C: PgA3Derived,
    stance: 'No transition because there is no event: the link is derived from the address as you type, and the box is there from the start.',
    cost: 'No moment of commitment, and nothing to validate — a typo just leaves the box dim.' },
];

let pgA3Sel = (() => { try { return localStorage.getItem(PG_A3_KEY) || 'grows'; } catch (e) { return 'grows'; } })();
const pgA3Subs = new Set();
const pgA3Pick = (id) => { pgA3Sel = id; try { localStorage.setItem(PG_A3_KEY, id); } catch (e) {} pgA3Subs.forEach(f => f(id)); };
const usePgA3Sel = () => {
  const [s, set] = React.useState(pgA3Sel);
  React.useEffect(() => { pgA3Subs.add(set); return () => pgA3Subs.delete(set); }, []);
  return s;
};

// The dispatcher is what app/spaces.jsx renders, so the app never re-mounts when
// the option changes; the variant is keyed, so switching always returns you to
// the ask face with the transition unplayed.
const PgA3Dispatch = ({ space }) => {
  const sel = usePgA3Sel();
  const opt = PG_A3_OPTS.find(o => o.id === sel) || PG_A3_OPTS[0];
  return <opt.C key={opt.id} space={space} />;
};

const PgA3Strip = () => {
  const sel = usePgA3Sel();
  const [open, setOpen] = React.useState(true);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const set = (h) => document.documentElement.style.setProperty('--pg-strip-h', h + 'px');
    if (!open) { set(0); return; }
    const el = ref.current; if (!el) return;
    const apply = () => set(el.offsetHeight);
    apply();
    const ro = new ResizeObserver(apply); ro.observe(el);
    return () => ro.disconnect();
  }, [open, sel]);
  if (!open) return <button className="pg-reopen" onClick={() => setOpen(true)}>Transitions</button>;
  const opt = PG_A3_OPTS.find(o => o.id === sel) || PG_A3_OPTS[0];
  return (
    <div className="pg-strip" ref={ref}>
      <div className="pg-strip-top">
        <span className="pg-eyebrow">A3 · the swap</span>
        <div className="pg-opts">
          {PG_A3_OPTS.map(o => (
            <button key={o.id} className="pg-opt" data-on={o.id === sel ? '' : undefined} onClick={() => pgA3Pick(o.id)}>
              <span className="pg-opt-n">{o.n}</span>{o.name}
            </button>
          ))}
        </div>
        <button className="pg-hide" onClick={() => setOpen(false)}>Hide</button>
      </div>
      <p className="pg-why">{opt.stance} <span className="pg-cost">Cost: {opt.cost}</span></p>
    </div>
  );
};

const pgA3Host = document.getElementById('pg-strip');
if (pgA3Host) ReactDOM.createRoot(pgA3Host).render(<PgA3Strip />);

Object.assign(window, { InviteForm: PgA3Dispatch });
