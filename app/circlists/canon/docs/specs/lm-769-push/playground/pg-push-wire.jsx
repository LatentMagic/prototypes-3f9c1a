// LM-769 · the ask — wiring. ONE override: window.CircPushAsk, which
// app/main.jsx reads per render at the head of the feed column. Nothing else
// in the app is touched, so every option is played inside the real feed, with
// the real cards, the real tabs and the real device dialog behind the offer.
const PGP_FORMS = { sentence: window.PgpSentence, card: window.PgpCard, band: window.PgpBand, pill: window.PgpRow };

window.CircPushAsk = ({ onTurnOn, onDismiss }) => {
  const s = usePGP();
  const Form = PGP_FORMS[s.opt] || window.PgpSentence;
  return <Form label={window.PGP_LABEL} align={s.align} onTurnOn={onTurnOn} onDismiss={onDismiss} />;
};

window.PGBAR = {
  eyebrow: 'lm-769 · the ask',
  blurb: 'Four forms of the one-time line offering notifications, in a real Active list. Same slot, same words, same device dialog — what differs is what kind of thing the ask is: prose, an object, a seam, or that seam with the lines taken off.',
  options: window.PGP_OPTIONS,
  get: () => window.PGP.opt,
  set: (id) => window.PGP.set({ opt: id }),
  sub: (f) => window.PGP.sub(f),
  notes: (o) => [['Costs', o.cost]],
  levers: () => [
    { label: 'Line', value: window.PGP.align,
      onChange: (id) => window.PGP.set({ align: id }),
      options: [{ id: 'centre', label: 'Centred' }, { id: 'left', label: 'Left' }],
      hint: 'Option 1 only. Centred it belongs to the column; left it starts on the cards’ edge.' },
    { label: 'The ask', value: 'x', onChange: () => window.pgpRearm(),
      options: [{ id: 'x', label: 'Put it back' }],
      hint: 'Answering removes the line for good. This re-arms it and reloads.' },
  ],
};
