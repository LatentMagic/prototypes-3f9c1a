// ============================================================================
// C4 playground — the Add popover's thought field. The question is length: how a
// contributor fits more than a sentence in without the popover falling apart.
// Installed by re-publishing ONE name, CandWrite, and branching on the field's
// own aria-label — every other writing field in the product (turns, replies,
// edits) keeps the shipped component untouched.
// Copy is left exactly as the build carries it; the words are Part B, not this.
// ============================================================================
const PGC4_KEY = 'pg_c4_v1';
const pgc4Saved = (() => { try { return JSON.parse(localStorage.getItem(PGC4_KEY) || 'null') || {}; } catch (e) { return {}; } })();
const PGC4 = {
  opt: pgc4Saved.opt || 'w1',
  subs: new Set(),
  set(p) { Object.assign(this, p); try { localStorage.setItem(PGC4_KEY, JSON.stringify({ opt: this.opt })); } catch (e) {} this.subs.forEach(f => f()); },
  sub(f) { this.subs.add(f); return () => this.subs.delete(f); },
};
const usePGC4 = () => { const [, b] = React.useReducer(x => x + 1, 0); React.useEffect(() => PGC4.sub(b), []); return PGC4; };

const PGC4_OPTIONS = [
  { id: 'w1', n: '1', name: 'Grow',
    dir: 'The field simply grows, line for line, with no ceiling. When the popover runs out of room the popover scrolls, and the Add button stays pinned at its foot.',
    cost: 'The dialog changes height under the writer\u2019s hands, and on a short screen the URL scrolls out of sight while they write.' },
  { id: 'w2', n: '2', name: 'Cap and scroll',
    dir: 'A fixed five-line window with the text scrolling inside it, and a soft fade at the top edge so it is obvious there is more above. The popover never changes size.',
    cost: 'You can never see the whole of a long thought while writing it, which is exactly when you most want to.' },
  { id: 'w3', n: '3', name: 'Grow, then lift',
    dir: 'Grows like 1 up to six lines, then LIFTS: the field detaches into a taller sheet over the popover, carrying the link along its head so the writer keeps their bearings.',
    cost: 'A container change mid-sentence. The writer did nothing to ask for it and the ground moves once.' },
  { id: 'w4', n: '4', name: 'Two steps',
    dir: 'The popover holds the URL and nothing else. A quiet line under it opens a full-height writing surface; Done brings the words back as a line the writer can reopen.',
    cost: 'Two steps to say one sentence, and the thought stops being something you fall into while pasting a link.' },
  { id: 'w5', n: '5', name: 'Room from the start',
    dir: 'The field opens at its full height and never moves \u2014 eight lines on the desk, most of the sheet on the phone. Nothing grows, nothing lifts, nothing scrolls.',
    cost: 'A large empty box asks to be filled. The invitation becomes a demand for most contributors, who only wanted to paste a link.' },
];
const pgc4Opt = () => PGC4_OPTIONS.find(o => o.id === PGC4.opt) || PGC4_OPTIONS[0];

// The shipped field, kept — every writing surface that is not the Add popover's
// thought goes on using it unchanged.
const PGC4_BASE = window.CandWrite;
const PGC4_MINE = 'A thought to go with it';

const pgc4Box = (focus) => ({
  background: CAND_PAPER.bg, border: '1px solid ' + (focus ? 'var(--color-accent)' : CAND_PAPER.bd),
  borderRadius: 'var(--radius-md)', transition: 'border-color var(--duration-base)',
});
const pgc4Area = { display: 'block', width: '100%', border: 0, outline: 'none', background: 'transparent',
  resize: 'none', padding: 0, font: '400 15px/1.6 var(--font-sans)', color: 'var(--color-fg-1)' };
const PGC4Left = ({ left }) => (
  <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'flex-end', minHeight: 15 }}>
    {left <= 60 && <span style={{ font: '400 11.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{left} left</span>}
  </div>
);

const PGC4Field = (props) => {
  usePGC4();
  const { value, onChange, placeholder, max = 500, ariaLabel } = props;
  const id = PGC4.opt;
  const ref = React.useRef(null);
  const [focus, setFocus] = React.useState(false);
  const [lifted, setLifted] = React.useState(false);
  const [sheet, setSheet] = React.useState(false);
  const left = max - String(value || '').length;
  const grow = (cap) => {
    const el = ref.current; if (!el) return;
    el.style.height = 'auto';
    el.style.height = (cap ? Math.min(el.scrollHeight, cap) : el.scrollHeight) + 'px';
  };

  // 1 · Grow — no ceiling. The popover's own overflow takes over.
  React.useLayoutEffect(() => { if (id === 'w1' || id === 'w3') grow(id === 'w3' ? 6 * 24 : 0); }, [value, id]);
  // 3 · lift once the sixth line is passed, and never come back down on its own.
  React.useEffect(() => {
    if (id !== 'w3') { setLifted(false); return; }
    const el = ref.current;
    if (el && el.scrollHeight > 6 * 24 + 2) setLifted(true);
  }, [value, id]);

  if (id === 'w1') {
    return (
      <div style={pgc4Box(focus)}>
        <div style={{ padding: '10px 12px 4px' }}>
          <textarea ref={ref} className="cand-write" value={value} maxLength={max} placeholder={placeholder} aria-label={ariaLabel}
            onChange={(e) => onChange(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
            style={{ ...pgc4Area, minHeight: 48, overflow: 'hidden' }} />
          <PGC4Left left={left} />
        </div>
      </div>
    );
  }

  if (id === 'w2') {
    return (
      <div style={pgc4Box(focus)}>
        <div style={{ position: 'relative', padding: '10px 12px 4px' }}>
          <textarea ref={ref} className="cand-write" value={value} maxLength={max} placeholder={placeholder} aria-label={ariaLabel}
            onChange={(e) => onChange(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
            style={{ ...pgc4Area, height: 5 * 24, overflowY: 'auto' }} />
          <span aria-hidden="true" style={{ position: 'absolute', left: 1, right: 1, top: 1, height: 18, borderRadius: '7px 7px 0 0',
            background: 'linear-gradient(' + CAND_PAPER.bg + ', rgba(242,241,235,0))', pointerEvents: 'none' }} />
          <PGC4Left left={left} />
        </div>
      </div>
    );
  }

  if (id === 'w3') {
    const body = (
      <React.Fragment>
        <textarea ref={ref} className="cand-write" value={value} maxLength={max} placeholder={placeholder} aria-label={ariaLabel}
          onChange={(e) => onChange(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ ...pgc4Area, minHeight: 48, height: lifted ? '100%' : undefined, flex: lifted ? 1 : undefined, overflowY: lifted ? 'auto' : 'hidden' }} />
        <PGC4Left left={left} />
      </React.Fragment>
    );
    if (!lifted) return <div style={pgc4Box(focus)}><div style={{ padding: '10px 12px 4px' }}>{body}</div></div>;
    return (
      <React.Fragment>
        <div style={{ ...pgc4Box(false), height: 48, display: 'flex', alignItems: 'center', padding: '0 12px' }}>
          <span style={{ font: '400 13px/1.4 var(--font-sans)', color: 'var(--color-fg-3)' }}>Writing…</span>
        </div>
        <div style={{ position: 'fixed', inset: 0, zIndex: 140, background: 'var(--color-scrim)' }} onClick={() => setLifted(false)} />
        <div style={{ position: 'fixed', zIndex: 141, left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
          width: 'min(560px, calc(100% - 32px))', height: 'min(70%, 520px)', background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-overlay)', padding: 18,
          display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ flex: 1, minWidth: 0, font: '400 11px/1.4 var(--font-mono)', letterSpacing: '0.03em', color: 'var(--color-fg-3)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>with the link</span>
            <button type="button" className="cand-altclose" onClick={() => setLifted(false)} aria-label="Done"
              style={{ background: 'transparent', border: 0, cursor: 'pointer', width: 34, height: 34, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <CloseX />
            </button>
          </div>
          <div style={{ ...pgc4Box(true), flex: 1, minHeight: 0, padding: '12px 14px 4px', display: 'flex', flexDirection: 'column' }}>{body}</div>
        </div>
      </React.Fragment>
    );
  }

  if (id === 'w4') {
    const has = !!String(value || '').trim();
    return (
      <React.Fragment>
        <button type="button" onClick={() => setSheet(true)} className="cand-quiet"
          style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', minHeight: 44, padding: '0 2px',
            background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left' }}>
          <span style={{ flex: 1, minWidth: 0, font: '400 13.5px/1.4 var(--font-sans)',
            color: has ? 'var(--color-fg-1)' : 'var(--color-fg-3)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {has ? String(value).split('\n')[0] : 'Add a thought'}
          </span>
          <Icon name="chevron-right" size={15} color="var(--color-fg-3)" />
        </button>
        {sheet && (
          <React.Fragment>
            <div style={{ position: 'fixed', inset: 0, zIndex: 140, background: 'var(--color-scrim)' }} onClick={() => setSheet(false)} />
            <div style={{ position: 'fixed', zIndex: 141, inset: 0, display: 'flex', flexDirection: 'column',
              background: 'var(--color-surface)', padding: '18px 18px calc(18px + env(safe-area-inset-bottom, 0px))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ flex: 1, minWidth: 0, font: '600 15px/1.3 var(--font-sans)', color: 'var(--color-fg-1)' }}>A thought to go with it</span>
                <Button size="sm" variant="primary" onClick={() => setSheet(false)}>Done</Button>
              </div>
              <div style={{ ...pgc4Box(true), flex: 1, minHeight: 0, padding: '12px 14px 4px', display: 'flex', flexDirection: 'column' }}>
                <textarea autoFocus className="cand-write" value={value} maxLength={max} placeholder={placeholder} aria-label={ariaLabel}
                  onChange={(e) => onChange(e.target.value)} style={{ ...pgc4Area, flex: 1, overflowY: 'auto' }} />
                <PGC4Left left={left} />
              </div>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  return (
    <div style={pgc4Box(focus)}>
      <div style={{ padding: '12px 14px 4px' }}>
        <textarea ref={ref} className="cand-write" value={value} maxLength={max} placeholder={placeholder} aria-label={ariaLabel}
          onChange={(e) => onChange(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ ...pgc4Area, height: 8 * 24, overflowY: 'auto' }} />
        <PGC4Left left={left} />
      </div>
    </div>
  );
};

// Only the Add popover's thought goes through the option set.
const PGC4Write = (props) => (props.ariaLabel === PGC4_MINE ? <PGC4Field {...props} /> : <PGC4_BASE {...props} />);

Object.assign(window, { PGC4, usePGC4, PGC4_OPTIONS, pgc4Opt, CandWrite: PGC4Write });
