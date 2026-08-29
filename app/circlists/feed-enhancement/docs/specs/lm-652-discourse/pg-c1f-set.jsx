// ============================================================================
// C1 playground — THE SETTING. How the thought is set as type.
//
// The five faces answer what FURNITURE comes over from the link card. They all
// set the words identically, which left the actual question — does this read as
// somebody's words? — untested. This lever is that question: family, size,
// weight, colour, leading, tracking and measure, varied deliberately and applied
// across whichever face is selected.
//
// The renderer is the playground's own, not CandProse, because CandProse fixes
// weight and family in a font shorthand — and those are exactly what is under
// test here. Parsing rules are identical: line breaks kept, a leading dash is a
// bullet, nothing else parsed.
// ============================================================================

const PGC1F_SETS = [
  { id: 's1', label: 'Secondary',
    css: { family: 'var(--font-sans)', size: 15, lh: 1.7, weight: 400, color: 'var(--color-fg-2)', track: 0 },
    dir: 'What the build carries. Body-grey, one step down from the title, at the size the card uses for everything else.',
    cost: 'The thought is styled as support for the link, and it is the one thing on this face that is not support.' },
  { id: 's2', label: 'Matter',
    css: { family: 'var(--font-sans)', size: 15.5, lh: 1.7, weight: 400, color: 'var(--color-fg-1)', track: '-0.006em' },
    dir: 'The same setting brought to full ink. Nothing else changes; the words simply stop being secondary.',
    cost: 'Title and thought are now the same colour, so weight and size are the only hierarchy left.' },
  { id: 's3', label: 'Measure',
    css: { family: 'var(--font-sans)', size: 17, lh: 1.75, weight: 400, color: 'var(--color-fg-1)', track: '-0.004em', measure: '33ch' },
    dir: 'Set to be read rather than scanned: larger, looser, and wrapped at a reading measure instead of at the card\u2019s width.',
    cost: 'A capped measure leaves white space at the right on desktop, which can read as a layout mistake rather than a choice.' },
  { id: 's4', label: 'Typed',
    css: { family: 'var(--font-mono)', size: 13.5, lh: 1.65, weight: 400, color: 'var(--color-fg-1)', track: '-0.01em' },
    dir: 'The product\u2019s mono — the face already used for domains and badges — so the thought reads as something a person typed, not as published copy.',
    cost: 'Mono carries a technical register, and at 500 characters it is a lot of it. The family is currently a metadata voice.' },
  { id: 's5', label: 'Said',
    css: { family: 'var(--font-sans)', size: 16, lh: 1.55, weight: 500, color: 'var(--color-fg-1)', track: '-0.012em' },
    dir: 'Tighter leading and a medium weight: the cadence of a remark rather than a paragraph. Speech given presence by weight, not by quote marks.',
    cost: 'Medium weight at 16px competes with the title above it, and long thoughts get heavy fast.' },
  { id: 's6', label: 'Warm ink',
    css: { family: 'var(--font-sans)', size: 15, lh: 1.85, weight: 400, color: '#2A2721', track: '0.004em' },
    dir: 'A warm near-black on the warm paper, set generously — ink on a page rather than text on a surface. Answers the colour question without touching the accent.',
    cost: '#2A2721 is not a token, and a second near-black in the product needs a reason that survives outside this card.' },
];
const pgc1fSet = () => PGC1F_SETS.find(o => o.id === PGC1F.type) || PGC1F_SETS[0];

// The thought, set. `flat` drops the measure cap for faces whose own column is
// already narrow (Said's gutter, Inset's paper) — a cap inside a cap is neither.
const PGC1FThought = ({ text, flat }) => {
  const s = pgc1fSet().css;
  const out = [];
  let list = null;
  String(text || '').split('\n').forEach((ln) => {
    const m = /^\s*-\s+(.*)$/.exec(ln);
    if (m) { if (!list) { list = []; out.push({ k: 'ul', items: list }); } list.push(m[1]); return; }
    list = null;
    if (!ln.trim()) { out.push({ k: 'gap' }); return; }
    out.push({ k: 'p', t: ln });
  });
  const f = { font: s.weight + ' ' + s.size + 'px/' + s.lh + ' ' + s.family, color: s.color,
    letterSpacing: s.track || 'normal', margin: 0, textWrap: 'pretty', overflowWrap: 'break-word' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: (!flat && s.measure) || 'none' }}>
      {out.map((b, i) => b.k === 'gap'
        ? <span key={i} aria-hidden="true" style={{ height: 6 }} />
        : b.k === 'ul'
          ? <ul key={i} style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 3 }}>{b.items.map((it, j) => <li key={j} style={f}>{it}</li>)}</ul>
          : <p key={i} style={f}>{b.t}</p>)}
    </div>
  );
};

Object.assign(window, { PGC1F_SETS, pgc1fSet, PGC1FThought });
