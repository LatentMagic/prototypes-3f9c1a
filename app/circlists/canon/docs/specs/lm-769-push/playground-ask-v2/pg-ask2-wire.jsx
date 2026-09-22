// LM-769 · the ask, round two — wiring. ONE override: window.CircPushAsk, which
// app/main.jsx reads per render at the head of the feed column. Option 5 moves
// itself to the foot with `order` rather than needing a second mount point, so
// the app is still untouched.
const PGA_FORMS = {
  block: window.PgaBlock, card: window.PgaCard, banner: window.PgaBanner,
  setting: window.PgaSetting, tail: window.PgaTail,
};

window.CircPushAsk = ({ onTurnOn, onDismiss }) => {
  const s = usePGA();
  const Form = PGA_FORMS[s.opt] || window.PgaBlock;
  return <Form key={s.opt + s.ground + s.width} label={window.PGA_LABEL} ground={s.ground} full={s.width === 'full'}
    onTurnOn={onTurnOn} onDismiss={onDismiss} />;
};

window.PGBAR = {
  eyebrow: 'lm-769 · the ask, round two',
  blurb: 'Five forms of the one-time offer, in a real Active list. Same words, same device dialog. What differs is what kind of thing the ask is — prose, an object in the list, a banner above it, a control, or a footnote at the end.',
  options: window.PGA_OPTIONS,
  get: () => window.PGA.opt,
  set: (id) => window.PGA.set({ opt: id }),
  sub: (f) => window.PGA.sub(f),
  notes: (o) => [['Costs', o.cost]],
  levers: () => [
    { label: 'Width', value: window.PGA.width,
      onChange: (id) => window.PGA.set({ width: id }),
      options: [{ id: 'full', label: 'Full row' }, { id: 'column', label: 'Column' }],
      hint: 'Option 3 only. Full spans the content row; Column stops at the feed’s own edge.' },
    { label: 'Ground', value: window.PGA.ground,
      onChange: (id) => window.PGA.set({ ground: id }),
      options: [{ id: 'sunken', label: 'Sunken' }, { id: 'surface', label: 'White' }, { id: 'accent', label: 'Accent tint' }],
      hint: 'Option 3 only. Every one is a token; the text stays fg-2 on all three.' },
    { label: 'The ask', value: 'x', onChange: () => window.pgaRearm(),
      options: [{ id: 'x', label: 'Put it back' }],
      hint: 'Answering removes the line for good. This re-arms it and reloads.' },
  ],
};
