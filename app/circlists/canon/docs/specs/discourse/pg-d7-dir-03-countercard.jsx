// ============================================================================
// Discourse v7 — direction 03, Countercard.
// ----------------------------------------------------------------------------
// You do not reply to a link. You answer it with another object, and the two
// stand together on the shelf.
//
// A response IS a card: usually another link, otherwise a bare card carrying a
// line you made. Answers hang off their root strictly FLAT — nothing ever hangs
// off an answer, so answering an answer answers the root instead. They live in
// ACTIVE, where new things belong, tethered to the root by a quiet spine; the
// Read tab therefore carries no conversation mass at all.
//
// The card face is a MARK, not a line: the spine, and no author. An answer
// riding Active carries no name — authorship appears only inside the door,
// where the Swell roster already exposes read-state. That is what keeps casting
// from leaking who read the root.
// ============================================================================

const { PGD7, Button, Field, Avatar } = window;
const { useState: ccS, useEffect: ccE } = React;

const CC_DATA = window.PGD7_DATA;

// No author while it rides Active. The rig's card always prints an attribution
// line; a whitespace attribution is the one way to give an answer card none.
const CC_NOAUTHOR = ' ';

// Copied once from URL_RE + its error string in app/feed.jsx, which does not
// export them. PLAYGROUND.md allows the copy; this is the pointer to its
// source. Verbatim — never "improved", or it stops being evidence.
const CC_URL_RE = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i;
const CC_URL_ERROR = 'That doesn’t look like a valid URL. Check it and try again.';

const CC_HOUR = 3600e3;
const ccAgo = (h) => Date.now() - h * CC_HOUR;

// ---- Cluster reading --------------------------------------------------------
const ccCastsOf = (items, rootId) => items
  .filter((i) => i.castOf === rootId)
  .sort((a, b) => (a.at || 0) - (b.at || 0));

// Flatness, enforced at the one place it could break: answering an answer
// answers its root.
const ccRootIdOf = (item) => (item && item.castOf) || (item && item.id) || null;

// ============================================================================
// The seed. Seeded LIVELY, not tidy — a wide cluster is what makes this
// direction's real cost visible, and a two-card cluster would flatter it.
// One root carries five answers, one carries a single answer, one already-read
// root is still producing them, and the sharer of another framed their own
// share with the same gesture everyone else uses.
// ============================================================================
const CC_SEED = [
  // ---- a4 (arXiv, learned indexes) — the lively cluster ---------------------
  {
    id: 'cc-a4-1', castOf: 'a4', castBy: 'marcus', at: ccAgo(21),
    url: 'https://queue.acm.org/detail/learned-indexes-in-production',
    title: 'The Case Against Learned Indexes in Production',
    source: 'ACM Queue',
    // Read, and reacted to as hard as the original — an answer is not a lesser
    // class of object.
    read: true,
    reactions: [
      { name: 'Priya N.', glyph: '🔥', intensity: 0.78 },
      { name: 'Ada L.', glyph: '💡', intensity: 0.51 },
    ],
  },
  {
    id: 'cc-a4-2', castOf: 'a4', castBy: 'priya', at: ccAgo(19), made: true,
    text: 'Their adversarial workload is synthetic. Ours is not.',
  },
  {
    id: 'cc-a4-3', castOf: 'a4', castBy: 'dev', at: ccAgo(16),
    url: 'https://martinfowler.com/articles/patterns-of-distributed-systems/segmented-log.html',
    title: 'Patterns of Distributed Systems: Segmented Log',
    source: 'Martin Fowler',
    image: 'uploads/card-previews/martinfowler-cd-pipeline.png',
    reactions: [{ name: 'Ada L.', glyph: '👍', intensity: 0.44 }],
  },
  {
    // No source, no preview, no favicon — the honest floor, answering.
    id: 'cc-a4-4', castOf: 'a4', castBy: 'ada', at: ccAgo(12),
    url: 'https://danluu.com/benchmarks-nobody-reruns/',
    title: 'Benchmarks Nobody Reruns',
    source: null, hasImage: false, faviconExists: false,
    reactions: [],
  },
  {
    id: 'cc-a4-5', castOf: 'a4', castBy: 'you', at: ccAgo(6),
    url: 'https://arxiv.org/abs/2411.00121',
    title: 'A Replication of Learned Index Benchmarks',
    source: 'arXiv',
    image: 'uploads/card-previews/arxiv-2503-04918.png',
    reactions: [],
  },

  // ---- a1 (on-call) — a cluster of one, beside a cluster of five -----------
  {
    id: 'cc-a1-1', castOf: 'a1', castBy: 'dev', at: ccAgo(2),
    url: 'https://newsletter.pragmaticengineer.com/p/on-call-compensation',
    title: 'What On-Call Should Actually Pay',
    source: 'The Pragmatic Engineer',
    image: 'uploads/card-previews/pragmatic-engineer.jpg',
    reactions: [],
  },

  // ---- a3 (your own share) — framed by casting alongside it ----------------
  {
    id: 'cc-a3-1', castOf: 'a3', castBy: 'you', at: ccAgo(14),
    url: 'https://martinfowler.com/bliki/DeploymentPipeline.html',
    title: 'Deployment Pipeline',
    source: 'Martin Fowler',
    image: 'uploads/card-previews/martinfowler-cd-pipeline.png',
    reactions: [{ name: 'Dev K.', glyph: '👍', intensity: 0.38 }],
  },

  // ---- r1 (READ root) — the early passer, solved outright ------------------
  // You read the root and it left Active. The circle's answers arrive as new
  // Active cards: the surface you already look at. Nothing is held open.
  {
    id: 'cc-r1-1', castOf: 'r1', castBy: 'ada', at: ccAgo(30),
    url: 'https://go.dev/blog/context',
    title: 'Go Concurrency Patterns: Context',
    source: 'The Go Blog',
    image: 'uploads/card-previews/blog-overreacted.png',
    reactions: [{ name: 'Marcus T.', glyph: '💡', intensity: 0.6 }],
  },
  {
    id: 'cc-r1-2', castOf: 'r1', castBy: 'priya', at: ccAgo(4), made: true,
    text: 'Cancellation is ownership, not scheduling.',
  },
];

// A bare card is a thing you made, not a message you sent — so it is a card:
// no favicon, no preview, the circle itself as its source, and the made line
// standing where a headline stands.
const ccBuildSeed = (s) => {
  const base = {
    id: s.id, castOf: s.castOf, castBy: s.castBy, by: s.castBy,
    attribution: CC_NOAUTHOR, at: s.at, read: !!s.read,
    reactions: s.reactions || [], responses: [], pulls: [], prose: [], thought: null,
  };
  if (s.made) {
    const root = CC_DATA.items.find((i) => i.id === s.castOf);
    return {
      ...base, made: true, title: s.text, url: (root && root.url) || '',
      source: CC_DATA.circle.name, hasImage: false, faviconExists: false,
    };
  }
  return {
    ...base, url: s.url, title: s.title, source: s.source,
    image: s.image, hasImage: s.hasImage, faviconExists: s.faviconExists,
  };
};

// A live answer, composed by the reader. Links resolve through the product's
// own extractor, so an unlisted host lands on the honest floor exactly as a
// real add does.
const ccBuildCast = (root, payload) => {
  const base = {
    id: 'cc' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    castOf: root.id, castBy: 'you', by: 'you', attribution: CC_NOAUTHOR,
    at: Date.now(), read: false, reactions: [], responses: [], pulls: [], prose: [], thought: null,
  };
  if (payload.made) {
    return {
      ...base, made: true, title: payload.text, url: root.url || '',
      source: CC_DATA.circle.name, hasImage: false, faviconExists: false,
    };
  }
  const u = /^https?:\/\//i.test(payload.url) ? payload.url : 'https://' + payload.url;
  return { ...base, url: u, ...window.pgd7Extract(u) };
};

// ============================================================================
// The card face: the spine. A mark, never a line — an answer card is a normal
// card carrying no author, tethered to the thing it answers.
// ============================================================================
const ccSpineWrap = {
  display: 'flex', alignItems: 'flex-start', gap: 7,
  margin: '0 0 10px', minWidth: 0,
};
const ccSpineLabel = {
  fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 11.5, lineHeight: '16px',
  color: 'var(--color-fg-3)', flexShrink: 0,
};
const ccSpineRoot = {
  fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12.5, lineHeight: '16px',
  color: 'var(--color-fg-2)', minWidth: 0,
  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
};

const CcCard = ({ ctx, item }) => {
  if (!item.castOf) return null;                       // roots are bare — as shipped
  const root = ctx.itemById(item.castOf);
  const rootName = root ? (root.title || window.pgd7Host(root.url)) : null;
  if (!rootName) return null;

  // The gather. Tapping the spine lifts the root above its answers as one
  // contiguous run; tapping it again lets them disperse back into the queue's
  // own order. It is the direction's single new interaction and it is
  // feed-local and tab-local: no panel, no tab switch, no destination. Where the
  // root has already left Active its answers still gather, on their own, at the
  // top of the tab you are standing in — the run is what the gather is for, and
  // the root is part of it only where the root is.
  const gathered = ctx.state.focus === root.id;
  const go = () => ctx.setState({ focus: gathered ? null : root.id });

  return (
    <div style={ccSpineWrap}>
      <svg width="12" height="16" viewBox="0 0 12 16" aria-hidden="true" style={{ flexShrink: 0, display: 'block' }}>
        <path d="M1.5 -2 V8 a4 4 0 0 0 4 4 H12" fill="none"
          stroke="var(--color-border-1)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <button type="button" onClick={go} className="circ-cardaction" aria-pressed={gathered} style={{
        display: 'flex', alignItems: 'baseline', gap: 6, minWidth: 0, flex: 1,
        background: 'transparent', border: 0, padding: 0, textAlign: 'left', cursor: 'pointer',
      }}>
        <span style={ccSpineLabel}>Answers</span>
        <span style={{ ...ccSpineRoot, color: gathered ? 'var(--color-fg-1)' : ccSpineRoot.color, fontWeight: gathered ? 600 : 500 }}>{rootName}</span>
      </button>
    </div>
  );
};

// ============================================================================
// The composer. ONE primitive, used everywhere an answer is made: alongside
// your own share, at the reveal, and back in the door later.
// ============================================================================
// Field carries its own 16px bottom margin (app/primitives.jsx). The textarea
// branch matches it, so both modes leave the same room above the actions and
// nothing has to be compensated back.
const ccTextarea = {
  width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-sans)',
  fontSize: 16, lineHeight: 1.5, color: 'var(--color-fg-1)', padding: '12px 14px',
  borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-1)',
  background: 'var(--color-surface)', resize: 'vertical', minHeight: 88,
  marginBottom: 'var(--space-4)',
};
const ccActions = {
  display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end',
  alignItems: 'center', gap: 8,
};

const CcComposer = ({ ctx, root, label, onCast, children }) => {
  const [made, setMade] = ccS(false);
  const [url, setUrl] = ccS('');
  const [text, setText] = ccS('');
  const [err, setErr] = ccS(null);

  const ready = made ? text.trim().length > 1 : CC_URL_RE.test(url.trim());

  const cast = () => {
    if (made) {
      if (text.trim().length < 2) return;
      onCast({ made: true, text: text.trim() });
      return;
    }
    const v = url.trim();
    if (!CC_URL_RE.test(v)) { setErr(CC_URL_ERROR); return; }
    setErr(null);
    onCast({ url: v });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {made ? (
        <textarea rows={2} value={text} maxLength={60} onChange={(e) => setText(e.target.value)}
          placeholder="Say it in a line." style={ccTextarea} />
      ) : (
        <Field name={'cc-url-' + root.id} label="Answer with a link" value={url}
          placeholder="Paste a link" inputMode="url" autoComplete="off" mono
          error={err} onChange={(e) => { setUrl(e.target.value); if (err) setErr(null); }} />
      )}
      <div style={ccActions}>
        <Button variant="tertiary" size="sm" onClick={() => { setMade(!made); setErr(null); }}>
          {made ? 'Use a link' : 'Write it here'}
        </Button>
        <div style={{ flex: 1, minWidth: 0 }} />
        {children}
        <Button variant="primary" disabled={!ready} onClick={cast}>{label || 'Answer'}</Button>
      </div>
    </div>
  );
};

// ============================================================================
// The door. Beat 2 (the reveal offers one thing: answer) and beat 3 (opening it
// again) are the same surface, because they are the same act. Authorship lives
// HERE and nowhere else — inside the door the Swell roster already says who
// read this.
// ============================================================================
const ccDoorHead = {
  fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, lineHeight: 1.35,
  letterSpacing: '-0.01em', color: 'var(--color-fg-1)', textWrap: 'pretty',
};
const ccDoorMeta = {
  fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12.5,
  color: 'var(--color-fg-3)', marginTop: 3,
};
const ccShelfRow = {
  // flexShrink 0: the shelf is a capped, scrolling flex column, and a row that
  // shrinks collapses its own text on top of the next one.
  display: 'flex', alignItems: 'flex-start', gap: 10, width: '100%', flexShrink: 0,
  background: 'transparent', border: 0, borderRadius: 'var(--radius-md)',
  padding: '8px 8px 8px 0', textAlign: 'left', cursor: 'pointer', minWidth: 0,
};
const ccShelfWho = {
  fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, lineHeight: 1.3,
  color: 'var(--color-fg-2)',
};
const ccShelfWhat = {
  fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14, lineHeight: 1.4,
  color: 'var(--color-fg-1)', textWrap: 'pretty', marginTop: 2,
};
const ccShelfSrc = {
  fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 11.5, lineHeight: 1.3,
  color: 'var(--color-fg-3)', marginTop: 3,
};

const CcDoor = ({ ctx, item, glyph, close }) => {
  const rootId = ccRootIdOf(item);
  const root = ctx.itemById(rootId) || item;
  const shelf = ccCastsOf(ctx.items, rootId);

  const jump = (c) => {
    close();
    ctx.setTab(c.read ? 'read' : 'active');
    ctx.setState({ focus: rootId });
  };

  // Your answer is an object, so it goes where objects go: the top of Active,
  // still tethered, still carrying no name.
  const commit = (payload) => {
    const cast = ccBuildCast(root, payload);
    ctx.actions.addItem(cast);
    close();
    ctx.setRoute('feed');
    ctx.setTab('active');
    ctx.setState({ focus: cast.id });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div style={{ paddingRight: 34 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={ccDoorHead}>{root.title || window.pgd7Host(root.url)}</div>
            <div style={ccDoorMeta}>{root.source || window.pgd7Host(root.url)}</div>
          </div>
          {glyph && <span aria-hidden="true" style={{ fontSize: 20, lineHeight: '24px', flexShrink: 0 }}>{glyph}</span>}
        </div>
      </div>

      {item.castOf && (
        <div style={{ ...ccDoorMeta, marginTop: 0 }}>
          {ctx.nameOf(item.castBy)} answered it with {item.made ? 'a card of their own' : (item.title || window.pgd7Host(item.url))}
        </div>
      )}

      {shelf.length > 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column',
          borderTop: '1px solid var(--color-border-2)', paddingTop: 4,
          // A wide shelf must not push the answer field off a 720-tall screen.
          maxHeight: '38vh', overflowY: 'auto', overscrollBehavior: 'contain',
        }}>
          {shelf.map((c) => (
            <button key={c.id} type="button" onClick={() => jump(c)} className="circ-cardaction" style={ccShelfRow}>
              <span style={{ marginTop: 2 }}><Avatar name={c.castBy === 'you' ? CC_DATA.me.realName : ctx.nameOf(c.castBy)} size={24} accent={c.castBy === 'you'} /></span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', ...ccShelfWho }}>{ctx.nameOf(c.castBy)}</span>
                <span style={{ display: 'block', ...ccShelfWhat }}>{c.title || window.pgd7Host(c.url)}</span>
                <span style={{ display: 'block', ...ccShelfSrc }}>{c.made ? CC_DATA.circle.name : (c.source || window.pgd7Host(c.url))}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      <div style={{ borderTop: '1px solid var(--color-border-2)', paddingTop: 'var(--space-4)' }}>
        <CcComposer ctx={ctx} root={root} onCast={commit}>
          <Button variant="secondary" onClick={close}>Not now</Button>
        </CcComposer>
      </div>
    </div>
  );
};

// ============================================================================
// Beat 1. Contribution is deliberately dull: the sharer adds a link. If they
// want to frame it they answer alongside their own share — the same gesture
// everybody else uses, not a second primitive. Nothing is attached to the link
// itself, ever.
// ============================================================================
const CcCompose = ({ ctx, item, submit }) => {
  const [open, setOpen] = ccS(false);

  if (!open) {
    return (
      <div style={ccActions}>
        <Button variant="secondary" onClick={() => setOpen(true)}>Answer alongside</Button>
        <Button variant="primary" onClick={() => submit(null)}>Add</Button>
      </div>
    );
  }
  return (
    <CcComposer ctx={ctx} root={item} label="Add and answer"
      onCast={(payload) => { ctx.actions.addItem(ccBuildCast(item, payload)); submit(null); }}>
      <Button variant="secondary" onClick={() => submit(null)}>Add on its own</Button>
    </CcComposer>
  );
};

// ============================================================================
// The queue. Answers stand with their root, strictly flat; an answer whose root
// has already left Active stands on its own, still tethered.
// ============================================================================
const ccOrder = (items, ctx) => {
  const rootIds = {};
  items.forEach((i) => { if (!i.castOf) rootIds[i.id] = true; });
  const castsBy = {};
  items.forEach((i) => { if (i.castOf) (castsBy[i.castOf] = castsBy[i.castOf] || []).push(i); });
  Object.keys(castsBy).forEach((k) => castsBy[k].sort((a, b) => (a.at || 0) - (b.at || 0)));

  const out = [];
  const laid = {};
  items.forEach((i) => {
    if (i.castOf) {
      if (rootIds[i.castOf] || laid[i.castOf]) return;
      laid[i.castOf] = true;
      castsBy[i.castOf].forEach((c) => out.push(c));
      return;
    }
    out.push(i);
    (castsBy[i.id] || []).forEach((c) => out.push(c));
  });

  const f = ctx && ctx.state && ctx.state.focus;
  if (!f) return out;
  const block = out.filter((i) => i.id === f || i.castOf === f);
  if (!block.length) return out;
  return [...block, ...out.filter((i) => i.id !== f && i.castOf !== f)];
};

// The circle arrives already talking. Laying the seed down through the product's
// own add action keeps one code path for every answer that exists.
const CcSeeder = ({ ctx }) => {
  ccE(() => {
    if (ctx.state.seeded) return;
    CC_SEED.forEach((s) => ctx.actions.addItem(ccBuildSeed(s)));
    ctx.setState({ seeded: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.state.seeded]);
  return null;
};

PGD7.register({
  id: 'countercard',
  name: 'Countercard',
  face: { slot: 'above-title' },
  initialState: { seeded: false, focus: null },
  Card: CcCard,
  Banner: CcSeeder,
  Compose: CcCompose,
  Landing: CcDoor,
  Respond: CcDoor,
  order: ccOrder,
  beats: {
    // Land on the root that is already producing objects, so the shelf behind
    // the reveal is a shelf and not a pair.
    land: (api) => {
      const t = api.activeItems.find((i) => !i.castOf && ccCastsOf(api.items, i.id).length >= 3)
        || api.activeItems.find((i) => !i.castOf) || api.firstUnread();
      api.setTab('active');
      if (t) api.openSwell(t);
    },
    // Open a root you have already read. Authorship is inside here and nowhere
    // else.
    respond: (api) => {
      const t = api.readItems.find((i) => !i.castOf && ccCastsOf(api.items, i.id).length)
        || api.readItems.find((i) => !i.castOf) || api.firstRead();
      api.setTab('read');
      if (t) api.openRespond(t);
    },
    // Continuation needs no new place. A root you finished keeps producing
    // answers, and they arrive in Active — the surface you already look at.
    continue: (api) => {
      const t = api.items.find((i) => i.read && !i.castOf
        && ccCastsOf(api.items, i.id).some((c) => !c.read));
      api.closeOverlay();
      api.setRoute('feed');
      api.setTab('active');
      api.setState({ focus: t ? t.id : null });
    },
  },
});
