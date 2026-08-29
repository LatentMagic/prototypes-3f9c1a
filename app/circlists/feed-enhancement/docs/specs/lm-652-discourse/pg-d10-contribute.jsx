// ============================================================================
// Discourse v10 — CHAPTER C: what it means to contribute a link.
//
// v9's five "surfaces" were one idea five times: a URL field, a thought field
// under it, different frames. None of them asked what contributing IS.
//
// Five here that disagree about that. They change the act, not the frame: where
// the link comes from · what you are editing · whether a link must be a new card
// at all · whether adding and reacting are one gesture · whether the words have
// to arrive with the link.
//
// Two of them need something back from the app when you commit (a reaction, a
// conversation to answer). The add surface is the shipped popover/sheet and its
// submit only carries url + thought, so the extra rides on a pending slot that
// the app reads and clears — a rig mechanism, not a proposed data model.
// ============================================================================
const { D9Write: CW, SwellPad: CPad, SwellPalette: CPalette, SwellGlyphRadios: CRadios,
        glyphAngle: cAngle, glyphIndexOf: cGlyphIdx, SWELL_MAX: C_MAX,
        levelFromIntensity: cLevel, intensityFromLevel: cFromLevel,
        d9Title: cTtl, d9HostOf: cHost, d9Talking: cTalking } = window;

window.D10_PENDING = { rx: null, answers: null, meta: null };
const c10Clear = () => { window.D10_PENDING = { rx: null, answers: null, meta: null }; };
// The same normalisation the shipped add surface applies at submit, so a title
// resolves WHILE you type rather than only after the card exists.
const c10Url = (v) => { const s = (v || '').trim(); return s && !/^https?:\/\//i.test(s) ? 'https://' + s : s; };

const c10Eyebrow = (children, style) => (
  <span style={{ font: '500 10.5px/1 var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase',
    color: 'var(--color-fg-3)', ...(style || {}) }}>{children}</span>
);

// ============================================================================
// C1 · IT ARRIVES FROM WHERE YOU WERE READING
// Nobody types a URL. You are in the browser, you push the page to a circle, and
// the surface opens with the thing already in it — resolved, titled, settled.
// There is no link field to get wrong, and the only thing left to do is the part
// that is actually yours: whether to say anything.
// ============================================================================
const C1_SHARED = { url: 'https://longreads.com/2026/01/the-long-walk-home/', title: 'The Long Walk Home', source: 'Longreads', via: 'Safari' };

const C1Add = ({ url, setUrl, thought, setThought }) => {
  // The share brought the resolved page with it, so the card must land with the
  // title and source it was shown with — not re-derived from the URL.
  React.useEffect(() => {
    if (!url) setUrl(C1_SHARED.url);
    window.D10_PENDING.meta = { title: C1_SHARED.title, source: C1_SHARED.source };
  }, []);
  return (
    <React.Fragment>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <window.Icon name="external-link" size={13} color="var(--color-fg-3)" />
        {c10Eyebrow('shared from ' + C1_SHARED.via)}
      </div>
      <div style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--color-border-1)', borderRadius: 'var(--radius-lg)',
        background: 'var(--color-surface-sunken)', padding: '12px 13px', display: 'flex', gap: 11, alignItems: 'flex-start' }}>
        <span aria-hidden="true" style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: 'var(--color-surface)',
          borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--color-border-2)', display: 'inline-flex',
          alignItems: 'center', justifyContent: 'center', font: '600 13px/1 var(--font-sans)', color: 'var(--color-fg-2)' }}>
          {C1_SHARED.source.charAt(0)}
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', font: '600 12px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>{C1_SHARED.source}</span>
          <span style={{ display: 'block', marginTop: 3, font: '600 14.5px/1.35 var(--font-sans)', letterSpacing: '-0.01em',
            color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{C1_SHARED.title}</span>
        </span>
      </div>
      <div style={{ marginTop: 14 }}>
        <CW value={thought} onChange={setThought} lines={3} max={240} frame="box"
          placeholder="Say why you are handing it over, or hand it over as it is." />
      </div>
    </React.Fragment>
  );
};

// ============================================================================
// C2 · YOU COMPOSE THE CARD
// There is no form. The thing on screen is the card the circle will get, and you
// type into it: the source line is where the link goes, the margin is where your
// words go. What you are doing is making the object, not filling in a request
// for one — so there is nothing to preview, because you are looking at it.
// ============================================================================
const C2Add = ({ url, setUrl, thought, setThought, error, inputRef }) => {
  const norm = c10Url(url);
  const host = norm ? cHost(norm) : null;
  const derived = norm ? window.d9DeriveTitle(norm) : null;
  return (
    <div style={{ borderWidth: 1, borderStyle: 'solid', borderColor: error ? 'var(--color-destructive)' : 'var(--color-border-1)',
      borderRadius: 'var(--radius-lg)', background: 'var(--color-surface)', padding: '14px 15px', boxShadow: 'var(--shadow-raised)' }}>
      <input ref={inputRef} value={url} inputMode="url" placeholder="paste the link"
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: '100%', boxSizing: 'border-box', borderWidth: 0, background: 'transparent', padding: 0,
          font: '500 12.5px/1.3 var(--font-mono)', color: host ? 'var(--color-fg-2)' : 'var(--color-fg-3)' }} />
      <span style={{ display: 'block', marginTop: 6, font: '600 17px/1.3 var(--font-sans)', letterSpacing: '-0.015em',
        color: derived ? 'var(--color-fg-1)' : 'var(--color-fg-3)', textWrap: 'pretty' }}>
        {derived || 'The page\u2019s title, once it has a link'}
      </span>
      <div style={{ marginTop: 11, borderLeftWidth: 2, borderLeftStyle: 'solid',
        borderLeftColor: thought.trim() ? 'var(--color-sage)' : 'var(--color-border-2)', paddingLeft: 12 }}>
        <CW value={thought} onChange={setThought} lines={2} max={200} frame="plain" placeholder="Your words, here on the card" />
        <span style={{ display: 'block', marginTop: 2, font: '600 12.5px/1.3 var(--font-sans)',
          color: thought.trim() ? 'var(--color-fg-2)' : 'var(--color-fg-3)' }}>You</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 13, paddingTop: 11,
        borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)' }}>
        <window.Avatar name={window.d9MyName()} size={20} accent />
        <span style={{ flex: 1, font: '400 12px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>Added by you, just now</span>
      </div>
      {error && (
        <div role="alert" style={{ display: 'flex', gap: 6, marginTop: 10, font: '500 13px/1.4 var(--font-sans)', color: 'var(--color-destructive)' }}>
          <window.Icon name="x" size={14} /><span>{error}</span>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// C3 · A LINK CAN BE AN ANSWER
// Not every link is a new subject. Sometimes the honest thing to do with a piece
// is to put it into a conversation that is already running — "this is the thing
// that answers what Dev said". So the surface asks where it goes before it asks
// anything else: its own card, or into one of the live conversations, where it
// arrives as an answer and shows as one at both ends.
// ============================================================================
// `items` is not in the shipped add surface's callback signature, so the app
// publishes the live shelf on a window slot for the two options that need it.
const C3Add = ({ urlField, thought, setThought }) => {
  const live = (window.D10_ITEMS || []).filter(i => cTalking(i) && i.read).slice(0, 3);
  const [target, setTarget] = React.useState(null);
  React.useEffect(() => {
    const t = target ? live.find(i => i.id === target) : null;
    const last = t ? (t.talk || []).filter(x => x.by !== 'You').slice(-1)[0] : null;
    window.D10_PENDING.answers = t ? { itemId: t.id, title: cTtl(t), by: last ? last.by : (t.thought ? t.thought.by : 'the circle'), text: last ? last.text : null } : null;
  }, [target]);
  const opt = (id, label, sub) => {
    const on = target === id;
    return (
      <button key={String(id)} type="button" onClick={() => setTarget(id)} className="circ-d9-row"
        style={{ display: 'flex', gap: 10, alignItems: 'flex-start', width: '100%', textAlign: 'left', cursor: 'pointer',
          minHeight: 44, padding: '10px 11px', background: on ? 'var(--color-surface-sunken)' : 'transparent',
          borderWidth: 1, borderStyle: 'solid', borderColor: on ? 'var(--color-border-strong)' : 'var(--color-border-2)',
          borderRadius: 'var(--radius-md)' }}>
        <span aria-hidden="true" style={{ width: 15, height: 15, borderRadius: '50%', flexShrink: 0, marginTop: 2,
          borderWidth: 2, borderStyle: 'solid', borderColor: on ? 'var(--color-accent)' : 'var(--color-fg-3)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          {on && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)' }} />}
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', font: '600 13.5px/1.35 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{label}</span>
          {sub && <span style={{ marginTop: 2, font: '400 12.5px/1.45 var(--font-sans)', color: 'var(--color-fg-3)', textWrap: 'pretty',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{sub}</span>}
        </span>
      </button>
    );
  };
  const t = target ? live.find(i => i.id === target) : null;
  const last = t ? (t.talk || []).filter(x => x.by !== 'You').slice(-1)[0] : null;
  return (
    <React.Fragment>
      {c10Eyebrow('where it goes', { display: 'block', marginBottom: 9 })}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
        {opt(null, 'Its own card', 'A new subject on the shelf.')}
        {live.map(i => {
          const l = (i.talk || []).filter(x => x.by !== 'You').slice(-1)[0];
          return opt(i.id, 'Into \u201c' + cTtl(i) + '\u201d', l ? l.by + ': ' + l.text : 'The conversation already running there.');
        })}
      </div>
      {urlField}
      <div style={{ marginTop: 14 }}>
        {t && last ? (
          <div style={{ marginBottom: 10, display: 'flex', gap: 9, alignItems: 'flex-start' }}>
            <span aria-hidden="true" style={{ width: 3, alignSelf: 'stretch', borderRadius: 2, background: 'var(--color-accent)', flexShrink: 0 }} />
            <span style={{ minWidth: 0, font: '400 12.5px/1.5 var(--font-sans)', color: 'var(--color-fg-2)', textWrap: 'pretty' }}>
              Answering <span style={{ fontWeight: 600, color: 'var(--color-fg-1)' }}>{last.by}</span>. The link goes in with your words.
            </span>
          </div>
        ) : null}
        <CW value={thought} onChange={setThought} lines={2} max={220} frame="box"
          placeholder={t && last ? 'Answer ' + last.by : 'Say what made you add it, if anything'} />
      </div>
    </React.Fragment>
  );
};

// The answer, on the new card's face: where it came from and what it answers.
const C3Card = ({ item, ctx }) => (
  <React.Fragment>
    {item.answers ? (
      <button type="button" onClick={() => ctx.goToItem && ctx.goToItem(item.answers.itemId)} className="circ-d9-row"
        style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%', textAlign: 'left', cursor: 'pointer',
          minHeight: 40, margin: '2px 0 4px', padding: '0 8px 0 0', background: 'transparent', borderWidth: 0, borderRadius: 'var(--radius-md)' }}>
        <span aria-hidden="true" style={{ width: 3, height: 15, borderRadius: 2, background: 'var(--color-accent)', flexShrink: 0 }} />
        <span style={{ minWidth: 0, font: '500 12.5px/1.4 var(--font-sans)', color: 'var(--color-fg-2)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Answers {item.answers.by} on {item.answers.title}
        </span>
      </button>
    ) : null}
    <window.D9ThoughtMargin item={item} />
  </React.Fragment>
);

// ============================================================================
// C4 · IT ARRIVES WITH YOUR MARK ON IT
// Adding and reacting are the same act here: you have read the thing, you felt
// something about it, and both go over together. The card is never neutral on
// arrival, and the reaction you gave is already in the door before anybody else
// has opened it.
// ============================================================================
const C4Add = ({ urlField, thought, setThought }) => {
  const narrow = (typeof window !== 'undefined' && window.innerWidth < 520)
    || (typeof document !== 'undefined' && !!document.querySelector('.circ-phone-screen'));
  const [swell, setSwell] = React.useState({ glyph: null, intensity: null, nx: 0.5, ny: 0.5 });
  const level = cLevel(swell.intensity != null ? swell.intensity : 0.6);
  const applyGlyphLevel = (g, L) => {
    const a = cAngle(cGlyphIdx(g));
    if (L == null) { setSwell({ glyph: g, intensity: null, nx: 0.5, ny: 0.5 }); return; }
    const r = cFromLevel(L) * C_MAX;
    setSwell({ glyph: g, intensity: cFromLevel(L), nx: 0.5 + Math.cos(a) * r, ny: 0.5 + Math.sin(a) * r });
  };
  React.useEffect(() => {
    window.D10_PENDING.rx = swell.glyph
      ? { name: 'You', glyph: swell.glyph, intensity: swell.intensity, nx: swell.nx, ny: swell.ny, at: Date.now() }
      : null;
  }, [swell]);
  const box = narrow ? 236 : 246;
  const inset = Math.round(box * 0.1389);
  return (
    <React.Fragment>
      {urlField}
      <div style={{ marginTop: 14 }}>
        <CW value={thought} onChange={setThought} lines={2} max={200} frame="box"
          placeholder="Say why you are adding it, if you want to" />
      </div>
      <div style={{ marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)' }}>
        {c10Eyebrow('and how it landed for you', { display: 'block', marginBottom: 4 })}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: box, height: box }}>
            <CRadios live={swell} onPick={(g) => applyGlyphLevel(g, swell.intensity != null ? level : null)} />
            <div style={{ position: 'absolute', inset }}>
              <CPad size={box - inset * 2} live={swell} level={level} interactive
                opts={{ centerDot: true, breath: true, snap: true }}
                onChange={setSwell} onDepth={(L) => { if (swell.glyph) applyGlyphLevel(swell.glyph, L); }} />
            </div>
            <CPalette live={swell} box={box} />
          </div>
        </div>
        <p style={{ margin: '2px 0 0', font: '400 12px/1.5 var(--font-sans)', color: 'var(--color-fg-3)', textAlign: 'center', textWrap: 'pretty' }}>
          Optional. Leave it blank and the card arrives unmarked.
        </p>
      </div>
    </React.Fragment>
  );
};

// ============================================================================
// C5 · THE LINK NOW, THE WORDS WHEN YOU HAVE THEM
// Finding something and being able to say why are two different moments, and
// forcing them together is how a thought gets written badly or not at all. So
// the link goes over on its own, and the card keeps a leaf open that only you
// can write on. It waits. It never asks twice, and it never tells the circle it
// is waiting.
// ============================================================================
const C5Add = ({ urlField }) => (
  <React.Fragment>
    {urlField}
    <p style={{ margin: '12px 0 0', font: '400 13px/1.6 var(--font-sans)', color: 'var(--color-fg-3)', textWrap: 'pretty' }}>
      It goes over as it is. The card keeps a leaf open for your words, and only you can see that it is empty.
    </p>
  </React.Fragment>
);

// The open leaf, on your own card, until it is written on. Nobody else sees it.
const C5Leaf = ({ item, ctx }) => {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');
  const mine = /^added by you$/i.test(item.attribution || '');
  if (item.thought) return <window.D9ThoughtMargin item={item} />;
  if (!mine) return null;
  return (
    <React.Fragment>
      <button type="button" onClick={() => setOpen(true)} className="circ-d9-row"
        style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', textAlign: 'left', cursor: 'pointer',
          minHeight: 44, margin: '6px 0 0', padding: '0 10px 0 0', background: 'transparent',
          borderWidth: 0, borderRadius: 'var(--radius-md)' }}>
        <span aria-hidden="true" style={{ width: 2, height: 22, borderRadius: 2, background: 'var(--color-border-1)', flexShrink: 0 }} />
        <span style={{ font: '500 13.5px/1.4 var(--font-sans)', color: 'var(--color-fg-3)' }}>Say why you added this</span>
      </button>
      {open && (
        <window.D9Sheet title="Your words on it" onClose={() => setOpen(false)}
          foot={<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <window.Button variant="primary" disabled={!text.trim()}
              onClick={() => { ctx.setThought(item, text.trim()); setOpen(false); }}>Put it on the card</window.Button>
          </div>}>
          <p style={{ margin: '0 0 12px', font: '400 13.5px/1.6 var(--font-sans)', color: 'var(--color-fg-3)', textWrap: 'pretty' }}>
            {cTtl(item)}
          </p>
          <CW value={text} onChange={setText} lines={3} max={240} frame="box" autoFocus
            placeholder="What made you add it." />
        </window.D9Sheet>
      )}
    </React.Fragment>
  );
};

// ---- the chapter ----------------------------------------------------------
const D10_CONTRIBUTE = [
  {
    id: 'c1', n: 'C1', name: 'It arrives from where you were reading',
    stance: 'Nobody types a URL. You are in the browser, you push the page to a circle, and the surface opens with the thing already resolved and titled. The only thing left to decide is whether to say anything about it.',
    cost: 'Depends on the share sheet, so it is the one route that is not entirely ours \u2014 and on the web there is no share target at all, which means this cannot be the only way in.',
    patch: { addTitle: 'Hand it to Backend Pod', addSub: null, addSubmit: 'Hand it over', add: (p) => <C1Add {...p} /> },
  },
  {
    id: 'c2', n: 'C2', name: 'You compose the card',
    stance: 'There is no form: the thing on screen is the card the circle will get, and you type into it \u2014 the source line takes the link, the margin takes your words. Nothing to preview, because you are looking at it.',
    cost: 'An editable card is a card that can look broken while it is half-made, and the link line is a mono field that does not announce itself as one. Errors have nowhere natural to sit.',
    patch: { addTitle: 'Make the card', addSub: null, addSubmit: 'Put it on the shelf', add: (p) => <C2Add {...p} /> },
  },
  {
    id: 'c3', n: 'C3', name: 'A link can be an answer',
    stance: 'Not every link is a new subject. This one asks where it goes before anything else: its own card, or into a conversation already running \u2014 where it lands as an answer to a person and reads as one at both ends.',
    cost: 'Bends what a card is, and a link inside a conversation is a link that will be harder to find later. It also makes the fastest act in the app \u2014 paste, done \u2014 into a decision.',
    patch: { addTitle: 'Add a link', addSub: 'It can start something or answer something.', addSubmit: 'Add', add: (p) => <C3Add {...p} />, addQuietUrl: true, onCard: (item, ctx) => <C3Card item={item} ctx={ctx} /> },
  },
  {
    id: 'c4', n: 'C4', name: 'It arrives with your mark on it',
    stance: 'Adding and reacting are one act: you have read the thing and you felt something, and both go over together. The card is never neutral on arrival \u2014 your glyph is in its door before anyone else has opened it.',
    cost: 'A reaction before anybody has read it, which is the thing that has been turned down before: the contributor\u2019s feeling is now the frame everyone reads through. It is also the longest surface of the five.',
    patch: { addTitle: 'Add a link', addSub: 'Your words and how it landed, in one go.', addSubmit: 'Add', add: (p) => <C4Add {...p} />, addQuietUrl: true },
  },
  {
    id: 'c5', n: 'C5', name: 'The link now, the words when you have them',
    stance: 'Finding something and being able to say why are two moments. The link goes over on its own and the card keeps a leaf open that only you can write on. It waits, it never asks twice, and the circle is never told it is empty.',
    cost: 'Cards live half-said, and a leaf that waits is a small debt on your own shelf. Most of them will never be written on \u2014 which may be the honest outcome, or may be a feature nobody uses.',
    patch: { addTitle: 'Add a link', addSub: null, addSubmit: 'Hand it over', add: (p) => <C5Add {...p} />, onCard: (item, ctx) => <C5Leaf item={item} ctx={ctx} /> },
  },
];

Object.assign(window, { D10_CONTRIBUTE, C1Add, C2Add, C3Add, C3Card, C4Add, C5Add, C5Leaf, c10Clear, c10Url, C1_SHARED });
