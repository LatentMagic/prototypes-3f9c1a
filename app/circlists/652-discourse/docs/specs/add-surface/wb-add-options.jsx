// ============================================================================
// Whiteboard — the five add surfaces. Each is one committed answer.
// Every option: link first-class and required, thought optional, plain text,
// mark-as-read off by default with The Swell collapsed beneath it.
// ============================================================================
const { Grow, Collapse, SwellBlock, ReadRow, Actions, SheetTitle, Shell, WB_URL_RE, wbMono } = window;
const { Icon, Field, Button, Avatar, CandSwitch, CAND_PAPER } = window;
const { useState: oS, useRef: oR, useLayoutEffect: oL } = React;

const Counter = ({ value, max, from }) => (value.length < from ? null : (
  <div style={{ ...wbMono, fontSize: 11, color: 'var(--color-fg-3)', textAlign: 'right', marginTop: 4 }}>{max - value.length} left</div>
));

// ============================================================================
// 1 — One box. The link lands as a chip; the same box becomes the writing space.
// Length: no cap. The box grows, then scrolls inside itself.
// ============================================================================
const OptOneBox = ({ mobile, st }) => {
  const [landed, setLanded] = oS(true);
  const [focus, setFocus] = oS(false);
  const close = () => st.setOpen(false);
  const commit = () => { if (WB_URL_RE.test(String(st.url).trim())) setLanded(true); };
  return (
    <Shell mobile={mobile} open={st.open} onClose={close}>
      <SheetTitle onClose={close}>Add a link</SheetTitle>
      <div onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ border: '1px solid ' + (focus ? 'var(--color-accent)' : 'var(--color-border-1)'), borderRadius: 'var(--radius-md)', padding: '11px 13px', transition: 'border-color var(--duration-base)' }}>
        {landed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 24 }}>
            <span style={{ ...wbMono, fontSize: 12.5, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{st.url}</span>
            <button type="button" onClick={() => setLanded(false)} aria-label="Change the link"
              style={{ background: 'transparent', border: 0, padding: 4, margin: -4, cursor: 'pointer', color: 'var(--color-fg-3)', display: 'inline-flex' }}><Icon name="x" size={14} /></button>
          </div>
        ) : (
          <input value={st.url} onChange={(e) => st.setUrl(e.target.value)} onBlur={commit} inputMode="url" aria-label="The link"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commit(); } }} placeholder="paste a link"
            style={{ width: '100%', border: 0, outline: 'none', background: 'transparent', padding: 0, minHeight: 24, font: '500 15px/1.6 var(--font-mono)', color: 'var(--color-fg-1)' }} />
        )}
        {landed && (
          <React.Fragment>
            <div style={{ height: 1, background: 'var(--color-border-2)', margin: '9px -13px 10px' }} />
            <Grow value={st.text} onChange={st.write} placeholder={'Say why, if you want.'} ariaLabel="A thought to go with it"
              minLines={3} maxPx={mobile ? 250 : 210} />
          </React.Fragment>
        )}
      </div>
      <ReadRow on={st.read} onChange={st.toggleRead} style={{ marginTop: 4 }} />
      <Collapse open={st.read}>
        <div>
          <SwellBlock swell={st.swell} setSwell={st.setSwell} active={st.read} />
        </div>
      </Collapse>
      <Actions onClose={close} />
    </Shell>
  );
};

// ============================================================================
// 2 — The other side. The link face, and a second face that is nothing but room
// to write. Length: no cap; the writing face has its own room and its own scroll.
// ============================================================================
// The returned state: two lines on paper, the cut drawn as a fade into the paper's
// own colour — but only when there IS a cut. Ratified 2026-08-17 from
// pg-wb-returned.html (row 1) and pg-wb-return-ctl.html (arrow only).
const ThoughtRow = ({ words, go }) => {
  const ref = oR(null); const [cut, setCut] = oS(false);
  // The row is two lines at most, and the fade is on whenever the thought runs to a
  // second line — not only when it overruns. One rule, so the row never changes
  // behaviour between a two-line thought and a three-line one.
  oL(() => { const el = ref.current; if (el) setCut(el.scrollHeight > 30); }, [words]);
  return (
    <button type="button" onClick={go}
      style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, minHeight: 48,
        background: words ? CAND_PAPER.bg : 'var(--color-surface)', border: '1px solid ' + (words ? CAND_PAPER.bd : 'var(--color-border-1)'),
        borderRadius: 'var(--radius-md)', padding: '10px 12px', cursor: 'pointer', overflow: 'hidden' }}>
      <span ref={ref} style={{ flex: 1, minWidth: 0, font: (words ? '400' : '500') + ' 13.5px/1.55 var(--font-sans)', color: words ? 'var(--color-fg-1)' : 'var(--color-fg-2)',
        position: 'relative', whiteSpace: words ? 'pre-wrap' : undefined, maxHeight: words ? 42 : undefined, overflow: 'hidden' }}>
        {words || 'Say why you\u2019re sharing it'}
        {words && cut && <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 20,
          background: 'linear-gradient(to bottom, rgba(242,241,235,0), ' + CAND_PAPER.bg + ')' }} />}
      </span>
      <span style={{ color: 'var(--color-fg-3)', display: 'inline-flex', flexShrink: 0 }}><Icon name={words ? 'edit' : 'chevron-right'} size={16} /></span>
    </button>
  );
};

// The link's slot: the surface's own white with the standard border, and a link
// glyph at the head of it so what belongs there is still said after the
// placeholder has gone. Ratified 2026-08-17 from pg-wb-linkslot.html, option 3.
const LinkRow = ({ st }) => {
  const [focus, setFocus] = oS(false);
  return (
    <div onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', minHeight: 46, marginBottom: 'var(--space-4)',
        background: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
        border: '1px solid ' + (focus ? 'var(--color-accent)' : 'var(--color-border-1)'), transition: 'border-color var(--duration-base)' }}>
      <span style={{ color: 'var(--color-fg-3)', display: 'inline-flex', flexShrink: 0 }}><Icon name="link" size={16} /></span>
      <input value={st.url} onChange={(e) => st.setUrl(e.target.value)} inputMode="url" aria-label="The link" placeholder="paste a link"
        style={{ flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent', padding: 0,
          font: '500 14px/1.5 var(--font-mono)', color: 'var(--color-fg-1)' }} />
    </div>
  );
};

const OptOtherSide = ({ mobile, st, LinkSlot }) => {
  const [face, setFace] = oS(0);
  const aRef = oR(null), bRef = oR(null);
  const [h, setH] = oS('auto');
  // Height follows whichever face is showing — observed, not measured once, so a
  // Swell opening on face A carries the sheet with it and nothing is left behind.
  oL(() => {
    const el = face ? bRef.current : aRef.current; if (!el) return;
    const set = () => setH(el.scrollHeight);
    set();
    const ro = new ResizeObserver(set); ro.observe(el);
    return () => ro.disconnect();
  }, [face]);
  const close = () => st.setOpen(false);
  const words = st.text.trim();
  return (
    <Shell mobile={mobile} open={st.open} onClose={close} scroll={false}>
      <div style={{ overflow: 'hidden', height: h, transition: 'height 300ms var(--ease-quiet)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', width: '200%', transform: face ? 'translateX(-50%)' : 'translateX(0)', transition: 'transform 300ms var(--ease-quiet)' }}>
          <div style={{ width: '50%', flexShrink: 0 }}>
            <div ref={aRef}>
              <SheetTitle onClose={close}>Add a link</SheetTitle>
              {LinkSlot ? <LinkSlot st={st} mobile={mobile} /> : <LinkRow st={st} />}
              <ThoughtRow words={words} go={() => setFace(1)} />
              <ReadRow on={st.read} onChange={st.toggleRead} style={{ marginTop: 4 }} />
              <Collapse open={st.read}>
                <div>
                  <SwellBlock swell={st.swell} setSwell={st.setSwell} active={st.read} />
                </div>
              </Collapse>
              <Actions onClose={close} />
            </div>
          </div>
          <div style={{ width: '50%', flexShrink: 0 }}>
            <div ref={bRef}>
              {/* Arrow only, in a 44px row. Nothing is committed on this face — Add commits
                 the whole surface — so there is no Done. Ratified 2026-08-17. */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-3)', minHeight: 44 }}>
                <button type="button" onClick={() => setFace(0)} aria-label="Back to the link" className="wb-glyph"
                  style={{ background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--color-fg-2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: 'var(--radius-md)', marginLeft: -10, flexShrink: 0 }}><Icon name="arrow-left" size={18} /></button>
                <span style={{ ...wbMono, fontSize: 12, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{st.url}</span>
              </div>
              <Grow value={st.text} onChange={st.write} placeholder={'Say why you\u2019re sharing it, or leave it blank.'} ariaLabel="A thought to go with it"
                minLines={6} maxPx={mobile ? 300 : 250} fs={15.5} lh={1.65} />
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
};

// ============================================================================
// 3 — The note. The whole surface is the warm paper the thought lands on, and it
// carries no field boxes at all. Length: capped at 500, counter from 400.
// ============================================================================
const OptNote = ({ mobile, st }) => {
  const close = () => st.setOpen(false);
  return (
    <Shell mobile={mobile} open={st.open} onClose={close} bg={CAND_PAPER.bg} bd={CAND_PAPER.bd} pad={'18px 20px 16px'}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ font: '500 11px/1 var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-fg-3)' }}>adding to Design circle</span>
        <button type="button" onClick={close} aria-label="Close"
          style={{ background: 'transparent', border: 0, padding: 6, margin: '-6px -6px -6px 0', cursor: 'pointer', color: 'var(--color-fg-3)', display: 'inline-flex' }}><Icon name="x" size={17} /></button>
      </div>
      <input value={st.url} onChange={(e) => st.setUrl(e.target.value)} inputMode="url" aria-label="The link" placeholder="paste a link"
        style={{ width: '100%', border: 0, outline: 'none', background: 'transparent', padding: '10px 0 9px', margin: 0,
          font: '500 15px/1.5 var(--font-mono)', color: 'var(--color-fg-1)' }} />
      <div style={{ height: 1, background: CAND_PAPER.bd, margin: '0 -20px' }} />
      <div style={{ padding: '12px 0 0' }}>
        <Grow value={st.text} onChange={st.write} placeholder={'Say why you\u2019re sharing it.'} ariaLabel="A thought to go with it"
          minLines={3} maxPx={mobile ? 230 : 200} fs={14} lh={1.8} max={500} />
        <Counter value={st.text} max={500} from={400} />
      </div>
      <div style={{ height: 1, background: CAND_PAPER.bd, margin: '12px -20px 0' }} />
      <ReadRow on={st.read} onChange={st.toggleRead} />
      <Collapse open={st.read}>
        <div style={{ padding: '10px 0 4px' }}>
          <SwellBlock swell={st.swell} setSwell={st.setSwell} active={st.read} onWhite />
        </div>
      </Collapse>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 4 }}>
        <Button type="button" variant="secondary" onClick={close}>Cancel</Button>
        <Button type="button" variant="primary">Add</Button>
      </div>
    </Shell>
  );
};

// ============================================================================
// 4 — Asked. The surface has no title: the question is the title, and the field
// under it needs no label. Length: capped at 600, counter from 480.
// ============================================================================
const OptAsked = ({ mobile, st }) => {
  const [focus, setFocus] = oS(false);
  const close = () => st.setOpen(false);
  return (
    <Shell mobile={mobile} open={st.open} onClose={close}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '-6px -6px 6px 0' }}>
        <button type="button" onClick={close} aria-label="Close"
          style={{ background: 'transparent', border: 0, padding: 6, cursor: 'pointer', color: 'var(--color-fg-3)', display: 'inline-flex' }}><Icon name="x" size={18} /></button>
      </div>
      <Field name={'u4' + (mobile ? 'm' : 'd')} mono type="text" inputMode="url" placeholder="example.com/article"
        value={st.url} onChange={(e) => st.setUrl(e.target.value)} />
      <div style={{ font: '600 17px/1.35 var(--font-sans)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)', marginBottom: 8 }}>Why this one?</div>
      <div onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ border: '1px solid ' + (focus ? 'var(--color-accent)' : 'var(--color-border-1)'), borderRadius: 'var(--radius-md)', padding: '11px 13px', transition: 'border-color var(--duration-base)' }}>
        <Grow value={st.text} onChange={st.write} ariaLabel="Why this one" minLines={4} maxPx={mobile ? 240 : 200} max={600} />
        <Counter value={st.text} max={600} from={480} />
      </div>
      <div style={{ ...wbMono, fontSize: 12, color: 'var(--color-fg-3)', margin: '7px 0 0' }}>or add it without saying anything</div>
      <ReadRow on={st.read} onChange={st.toggleRead} style={{ marginTop: 4 }} />
      <Collapse open={st.read}>
        <div>
          <SwellBlock swell={st.swell} setSwell={st.setSwell} active={st.read} />
        </div>
      </Collapse>
      <Actions onClose={close} />
    </Shell>
  );
};

// ============================================================================
// 5 — Handed over. A message to the circle with the link attached to it: the
// words lead, the link is the attachment. Length: grows to 200px, then scrolls.
// ============================================================================
const OptHanded = ({ mobile, st }) => {
  const [focus, setFocus] = oS(false);
  const close = () => st.setOpen(false);
  return (
    <Shell mobile={mobile} open={st.open} onClose={close}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex' }}>
          {['Priya N.', 'Ada L.', 'Marcus T.'].map((n, i) => (
            <span key={n} style={{ marginLeft: i ? -7 : 0, borderRadius: '50%', boxShadow: '0 0 0 2px var(--color-surface)', display: 'inline-flex' }}>
              <Avatar name={n} size={24} />
            </span>
          ))}
        </div>
        <span style={{ flex: 1, font: '500 13.5px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>to the Design circle</span>
        <button type="button" onClick={close} aria-label="Close"
          style={{ background: 'transparent', border: 0, padding: 6, margin: -6, cursor: 'pointer', color: 'var(--color-fg-2)', display: 'inline-flex' }}><Icon name="x" size={18} /></button>
      </div>
      <Grow value={st.text} onChange={st.write} placeholder={'Say why you\u2019re sharing it.'} ariaLabel="A thought to go with it"
        minLines={3} maxPx={200} fs={15.5} lh={1.65} />
      <div onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 12, padding: '10px 12px', minHeight: 46,
          background: 'var(--color-surface-sunken)', borderRadius: 'var(--radius-md)',
          border: '1px solid ' + (focus ? 'var(--color-accent)' : 'var(--color-border-2)'), transition: 'border-color var(--duration-base)' }}>
        <span style={{ color: 'var(--color-fg-3)', display: 'inline-flex', flexShrink: 0 }}><Icon name="link" size={16} /></span>
        <input value={st.url} onChange={(e) => st.setUrl(e.target.value)} inputMode="url" aria-label="The link" placeholder="paste a link"
          style={{ flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent', padding: 0,
            font: '500 14px/1.5 var(--font-mono)', color: 'var(--color-fg-1)' }} />
      </div>
      <ReadRow on={st.read} onChange={st.toggleRead} style={{ marginTop: 4 }} />
      <Collapse open={st.read}>
        <div>
          <SwellBlock swell={st.swell} setSwell={st.setSwell} active={st.read} />
        </div>
      </Collapse>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
        <Button type="button" variant="secondary" onClick={close}>Cancel</Button>
        <Button type="button" variant="primary">Hand it over</Button>
      </div>
    </Shell>
  );
};

// ---- the set: number, name, stance, cost, and the length rule it chose ------
const WB_OPTIONS = [
  {
    n: '1', name: 'One box',
    url: 'theatlantic.com/technology/the-quiet-part',
    dir: 'One box that changes role: the link lands in it as a chip, and the same box becomes the space you write in — so there is only ever one thing on the surface to type into.',
    cost: 'Two behaviours in one control. The chip has to be learned, changing the link is a second gesture, and the thought inherits the URL field\u2019s slot rather than earning its own.',
    len: 'No cap. The box grows as you write, then scrolls inside itself; the sheet stops growing.',
    render: (p) => <OptOneBox {...p} />,
  },
  {
    n: '2', name: 'The other side',
    url: 'pragmaticengineer.com/scaling-on-call',
    dir: 'Two faces of one surface. The first is the link and nothing else; the second is nothing but room to write, reached by a door that says what it is for and slides across in place.',
    cost: 'A second step in the fastest act in the app, and the words are out of sight when you commit — you decide to write before you know what you want to say.',
    len: 'No cap. The writing face is its own room, six lines at rest, with its own scroll past that.',
    render: (p) => <OptOtherSide {...p} />,
  },
  {
    n: '3', name: 'The note',
    url: 'newyorker.com/magazine/what-we-lost',
    dir: 'The surface is the paper, not a form on white: warm ground edge to edge, no field boxes anywhere, the link a mono line and the thought written straight onto it under a rule.',
    cost: 'Nothing is boxed, so the required link has the weakest target on the surface — and The Swell needs a white inset to keep its edge on paper, the one seam in the idea.',
    len: 'Capped at 500, the same bound as a turn. The count appears at 400 and never before.',
    render: (p) => <OptNote {...p} />,
  },
  {
    n: '4', name: 'Asked',
    url: 'theatlantic.com/technology/the-quiet-part',
    dir: 'The surface has no title, because the question is the title. "Why this one?" carries the invitation in real type, so the field beneath it needs no label and no placeholder at all.',
    cost: 'A question can read as homework, and it hands the loudest type on the surface to the optional thing. One fixed question also flattens every reason for sharing into one shape.',
    len: 'Capped at 600 — a paragraph and a few lines. Four lines at rest, ten before it scrolls.',
    render: (p) => <OptAsked {...p} />,
  },
  {
    n: '5', name: 'Handed over',
    url: 'pragmaticengineer.com/scaling-on-call',
    dir: 'Adding is handing something to people, so the surface is addressed to them: the words lead, and the link is what is attached underneath them.',
    cost: 'The required thing sits under the optional one, and the idiom is borrowed — the app has a composer nowhere else. Paste-and-go now starts below the fold of your own attention.',
    len: 'No cap. The composer grows to 200px and then scrolls, the way a composer does.',
    render: (p) => <OptHanded {...p} />,
  },
];

Object.assign(window, { WB_OPTIONS, OptOtherSide, ThoughtRow, LinkRow });
