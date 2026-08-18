// ============================================================================
// Whiteboard — how The Swell communicates its ROLE and its OPTIONALITY inside
// the add surface. Six routes, one shared host surface.
// ----------------------------------------------------------------------------
// The host is deliberately the BASELINE add surface (URL field + paper thought +
// Mark as read + the block beneath) so the only thing differing between routes
// is the framing. Which of the five add surfaces wins is a separate question.
// The disc is the real component (app/swell-reactions.jsx), mounted.
// ============================================================================
const { SwellPad, SwellPalette, SwellGlyphRadios, levelFromIntensity, intensityFromLevel,
  glyphAngle, glyphIndexOf, SWELL_MAX, Button, Field, CandSwitch, CAND_PAPER,
  Grow, Collapse, Shell, SheetTitle, Actions, Fab, Frame } = window;
const { useState: fS, useRef: fR, useLayoutEffect: fL, useEffect: fE } = React;

const SEED_URL = 'incident.io/blog/handover-notes';
const SEED_TEXT = 'Made me rethink how we do handovers.';
// A committed reaction: the lightbulb, moderately. Seeded so the second frame of
// each row shows the row's framing with the disc already answered.
const SEED_GLYPH = '\uD83D\uDCA1';
const SEED_MARK = (() => {
  const a = glyphAngle(glyphIndexOf(SEED_GLYPH)), r = 0.6 * SWELL_MAX;
  return { glyph: SEED_GLYPH, intensity: 0.6, nx: 0.5 + Math.cos(a) * r, ny: 0.5 + Math.sin(a) * r };
})();

// ---- the disc, mounted -----------------------------------------------------
const Disc = ({ swell, setSwell, box = 232, active = true }) => {
  const level = levelFromIntensity(swell.intensity != null ? swell.intensity : 0.6);
  const apply = (g, L) => {
    const a = glyphAngle(glyphIndexOf(g));
    if (L == null) { setSwell({ glyph: g, intensity: null, nx: 0.5, ny: 0.5 }); return; }
    const r = intensityFromLevel(L) * SWELL_MAX;
    setSwell({ glyph: g, intensity: intensityFromLevel(L), nx: 0.5 + Math.cos(a) * r, ny: 0.5 + Math.sin(a) * r });
  };
  const ins = Math.round(box * 0.1389);
  return (
    <div style={{ position: 'relative', width: box, height: box }}>
      {active && <SwellGlyphRadios live={swell} onPick={(g) => apply(g, swell.intensity != null ? level : null)} />}
      <div style={{ position: 'absolute', inset: ins }}>
        <SwellPad size={box - ins * 2} live={swell} level={level} interactive={active}
          opts={{ centerDot: true, breath: true, snap: true }}
          onChange={setSwell} onDepth={(L) => { if (swell.glyph) apply(swell.glyph, L); }} />
      </div>
      <SwellPalette live={swell} box={box} />
    </div>
  );
};

const Center = ({ children, gap = 14, pad = '6px 0 16px' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap, padding: pad }}>{children}</div>
);
const VH = ({ children }) => <span className="circ-vh">{children}</span>;
const OPTIONAL_VH = 'How did it land? Optional \u2014 leave it blank and the card arrives unmarked.';

// ---- the six routes --------------------------------------------------------
// Each is { n, name, stance, cost, block, readSub? }. `block` draws what sits
// under the Mark-as-read row; `readSub` lets a route put words on that row.
const ROUTES = [
  {
    n: 1, name: 'Said in full',
    stance: 'The reaction dialog\u2019s own heading and caption, verbatim, repeated here. Nothing is invented and nothing is untaught.',
    cost: 'The words cost more vertical room than the control they explain is worth on a sheet that already carries three things. This is the bloat you named.',
    block: ({ swell, setSwell }) => (
      <Center>
        <div style={{ font: '600 14px/1.3 var(--font-sans)', color: 'var(--color-fg-1)' }}>How did it land?</div>
        <Disc swell={swell} setSwell={setSwell} />
        <p style={{ margin: 0, font: '400 12px/1.5 var(--font-sans)', color: 'var(--color-fg-3)', textAlign: 'center', textWrap: 'pretty' }}>
          Optional. Leave it blank and the card arrives unmarked.
        </p>
      </Center>
    ),
  },
  {
    n: 2, name: 'Nothing',
    stance: 'The disc alone, smaller. The glyph words around the rim are the only teaching; the words live in the accessible name.',
    cost: 'Neither message lands. Upstream, \u201coptional\u201d is carried by the Skip button \u2014 this surface has no Skip, so silence drops that message rather than inheriting it.',
    block: ({ swell, setSwell }) => (
      <Center gap={0} pad="2px 0 16px">
        <VH>{OPTIONAL_VH}</VH>
        <Disc swell={swell} setSwell={setSwell} box={208} />
      </Center>
    ),
  },
  {
    n: 3, name: 'The toggle says it',
    stance: 'The block carries no words of its own. The framing moves onto the control you already pressed to get here \u2014 one line of secondary ink under Mark as read.',
    cost: 'Overloads one label with two jobs, and the words sit above the toggle rather than beside the thing they describe. Once the block is open, nothing near the disc explains it.',
    readSub: 'Turning this on lets you add how it landed. Optional.',
    block: ({ swell, setSwell }) => (
      <Center gap={0} pad="2px 0 16px">
        <VH>{OPTIONAL_VH}</VH>
        <Disc swell={swell} setSwell={setSwell} box={216} />
      </Center>
    ),
  },
  {
    n: 4, name: 'Skip, not a caption',
    stance: 'Inherits the upstream vocabulary instead of paraphrasing it: optionality is carried by a control, exactly as the reveal dialog carries it. No caption at all.',
    cost: 'A control whose only job is to decline implies the step was expected. It also adds a second way to say no, since Add already commits nothing.',
    block: ({ swell, setSwell, skipped, setSkipped }) => skipped ? (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 44, padding: '4px 0 12px' }}>
        <span style={{ font: '400 13px/1.4 var(--font-sans)', color: 'var(--color-fg-3)' }}>No reaction</span>
        <button type="button" onClick={() => setSkipped(false)}
          style={{ background: 'transparent', border: 0, padding: '8px 0', cursor: 'pointer', font: '500 13px/1.4 var(--font-sans)', color: 'var(--color-accent)' }}>Add one</button>
      </div>
    ) : (
      <Center gap={2} pad="2px 0 8px">
        <VH>{OPTIONAL_VH}</VH>
        <Disc swell={swell} setSwell={setSwell} box={216} />
        <button type="button" onClick={() => { setSwell({ glyph: null, intensity: null, nx: 0.5, ny: 0.5 }); setSkipped(true); }}
          style={{ background: 'transparent', border: 0, cursor: 'pointer', minHeight: 44, padding: '0 12px', font: '500 13px/1.4 var(--font-sans)', color: 'var(--color-fg-2)' }}>Skip reaction</button>
      </Center>
    ),
  },
  {
    n: 5, name: 'Until you touch it',
    stance: 'One line, at label register, that leaves the moment a glyph is picked. The framing is paid for once, by the people who need it, and never again.',
    cost: 'Something appearing and leaving inside a small box draws the eye to itself. It also means the surface has two resting heights, so the sheet moves under your thumb.',
    block: ({ swell, setSwell }) => (
      <Center gap={0} pad="2px 0 16px">
        <VH>{OPTIONAL_VH}</VH>
        <div style={{ overflow: 'hidden', height: swell.glyph ? 0 : 26, opacity: swell.glyph ? 0 : 1, transition: 'height 260ms var(--ease-quiet), opacity 180ms var(--ease-quiet)' }} aria-hidden="true">
          <div style={{ font: '500 13px/1.4 var(--font-sans)', color: 'var(--color-fg-2)', paddingBottom: 8 }}>How did it land? Optional.</div>
        </div>
        <Disc swell={swell} setSwell={setSwell} box={220} />
      </Center>
    ),
  },
  {
    n: 6, name: 'A section, not a sentence',
    stance: 'The block is labelled the way the rest of the form is labelled \u2014 a row, a word on the left, Optional on the right, a hairline under it. Framing as furniture, not prose.',
    cost: 'Puts an expressive thing inside field furniture, which is the register the disc is trying not to be in. Optional as a stock word teaches less than a sentence does.',
    block: ({ swell, setSwell }) => (
      <div style={{ padding: '2px 0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, paddingBottom: 10, borderBottom: '1px solid var(--color-border-1)' }}>
          <span style={{ font: '500 13px/1.4 var(--font-sans)', color: 'var(--color-fg-2)' }}>How it landed</span>
          <span style={{ font: '400 12px/1.4 var(--font-sans)', color: 'var(--color-fg-3)' }}>Optional</span>
        </div>
        <Center pad="10px 0 0">
          <VH>{OPTIONAL_VH}</VH>
          <Disc swell={swell} setSwell={setSwell} box={216} />
        </Center>
      </div>
    ),
  },
];

// ---- the host surface ------------------------------------------------------
const HostSheet = ({ route, mobile, marked, onMeasure, open, setOpen }) => {
  const [url, setUrl] = fS(SEED_URL);
  const [text, setText] = fS(SEED_TEXT);
  const [read, setRead] = fS(true);
  const [skipped, setSkipped] = fS(false);
  const [swell, setSwell] = fS(() => marked ? SEED_MARK : { glyph: null, intensity: null, nx: 0.5, ny: 0.5 });
  const blockRef = fR(null);
  fL(() => {
    if (!blockRef.current || !onMeasure) return;
    const el = blockRef.current;
    const ro = new ResizeObserver(() => onMeasure(Math.round(el.getBoundingClientRect().height)));
    ro.observe(el); onMeasure(Math.round(el.getBoundingClientRect().height));
    return () => ro.disconnect();
  }, [route.n]);
  const setRead2 = (v) => { setRead(v); if (!v) { setSwell({ glyph: null, intensity: null, nx: 0.5, ny: 0.5 }); setSkipped(false); } };
  return (
    <Shell mobile={mobile} open={open} onClose={() => setOpen(false)}>
      <SheetTitle onClose={() => setOpen(false)}>Add a link</SheetTitle>
      <Field name={'u' + route.n + (mobile ? 'm' : 'd') + (marked ? 'k' : '')} mono type="text" inputMode="url"
        placeholder="example.com/article" value={url} onChange={(e) => setUrl(e.target.value)} />
      <div style={{ marginTop: 'var(--space-3)', background: CAND_PAPER.bg, border: '1px solid ' + CAND_PAPER.bd, borderRadius: 'var(--radius-lg)', padding: '12px 14px' }}>
        <Grow value={text} onChange={setText} placeholder="Why this one? Optional." maxPx={200} ariaLabel="Your thought" fs={14.5} lh={1.6} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 44, marginTop: 'var(--space-2)' }}>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: '500 14px/1.3 var(--font-sans)', color: 'var(--color-fg-1)' }}>Mark as read</span>
          {route.readSub && <span style={{ font: '400 12px/1.45 var(--font-sans)', color: 'var(--color-fg-3)', maxWidth: '30ch', textWrap: 'pretty' }}>{route.readSub}</span>}
        </span>
        <CandSwitch on={read} onChange={setRead2} label="Mark as read" />
      </div>
      <Collapse open={read}>
        <div ref={blockRef}>{route.block({ swell, setSwell, skipped, setSkipped })}</div>
      </Collapse>
      <Actions onClose={() => setOpen(false)} />
    </Shell>
  );
};

// One frame = one width of one state, with its own FAB wired to its own surface.
const RouteFrame = ({ route, mobile, marked, onMeasure, label }) => {
  const [open, setOpen] = fS(true);
  return (
    <Frame mobile={mobile} label={label}>
      <Fab mobile={mobile} open={open} onClick={() => setOpen(!open)} />
      <HostSheet route={route} mobile={mobile} marked={marked} onMeasure={onMeasure} open={open} setOpen={setOpen} />
    </Frame>
  );
};

const RouteRow = ({ route }) => {
  const [px, setPx] = fS(null);
  return (
    <section className="wb-opt">
      <div className="wb-bar">
        <span className="wb-n">{route.n}</span>
        <span className="wb-name">{route.name}</span>
        <span className="wb-px">{px == null ? '' : 'block ' + px + 'px'}</span>
        <div className="wb-notes">
          <span><b>Stance.</b> {route.stance}</span>
          <span><b>Cost.</b> {route.cost}</span>
        </div>
      </div>
      <div className="wb-row">
        <RouteFrame route={route} mobile onMeasure={setPx} label="390 — nothing picked yet" />
        <RouteFrame route={route} mobile marked label="390 — a reaction on it" />
        <RouteFrame route={route} marked label="desktop — popover" />
      </div>
    </section>
  );
};

const FramingBoard = () => (
  <React.Fragment>
    <header className="wb-head">
      <h1>The Swell in the add surface — six ways to say what it is</h1>
      <p>The disc cannot change and Add commits whatever is on it. So the surface has to communicate two things: <b>what the disc is for</b> (how the link landed for you) and <b>that it is optional</b>. Words do both and cost room. Silence costs both messages.</p>
      <p>The load-bearing fact: upstream, optionality is carried by the <b>Skip reaction</b> button. This surface has no Skip, so leaving the block silent does not inherit that message — it drops it.</p>
      <p>Every route is drawn on the <b>same host</b> — the baseline surface, seeded with a link, a one-line thought and the toggle already on — so the only difference between rows is the framing. Which of the five add surfaces wins is a separate question. All of it is live: write in the paper, pick a glyph, drag out from the centre, turn the toggle off and on. <b>block Npx</b> is the measured height of everything under the toggle row, before a reaction is picked.</p>
    </header>
    {ROUTES.map(r => <RouteRow key={r.n} route={r} />)}
  </React.Fragment>
);

ReactDOM.createRoot(document.getElementById('root')).render(<FramingBoard />);
