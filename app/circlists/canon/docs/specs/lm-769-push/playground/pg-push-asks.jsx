// ============================================================================
// LM-769 · the ask — the three forms. All three stand in the SAME slot (the
// head of the feed column, under the New pill), carry the same words, raise the
// same device dialog and dismiss for good. What differs is what kind of thing
// the ask IS: prose, an object, or furniture. That is the question.
//
// Shipped state: option 1 is what app/push.jsx currently renders. It is in the
// set as the incumbent, not as the favourite.
// ============================================================================
const { Icon, Button } = window;

// 1 — prose. Feed-weight text, offer inline, \u00d7 at the end of the sentence.
const PgpSentence = ({ label, align, onTurnOn, onDismiss }) => (
  <div className="pgp-sentence" data-align={align}>
    <p className="pgp-sentence-text">
      Know when new links land in your circles.{' '}
      <button type="button" className="circ-doorlink pgp-sentence-go" onClick={onTurnOn}>{label}</button>
    </p>
    <button type="button" className="pgp-x" onClick={onDismiss} aria-label="Dismiss"><Icon name="x" size={16} /></button>
  </div>
);

// 2 — an object in the pile. The card's own surface, border, radius and
// padding, so it sits in the column's one existing vocabulary rather than
// inventing a second. The \u00d7 takes the corner a card's actions take.
const PgpCard = ({ label, onTurnOn, onDismiss }) => (
  <div className="pgp-card">
    <button type="button" className="pgp-x pgp-card-x" onClick={onDismiss} aria-label="Dismiss"><Icon name="x" size={16} /></button>
    <div className="pgp-card-title">Notifications</div>
    <p className="pgp-card-body">Know when new links land in your circles. Circlists tells your phone, one message per circle.</p>
    <div className="pgp-card-act"><Button variant="primary" onClick={onTurnOn}>{label}</Button></div>
  </div>
);

// 3 — furniture. A recessed strip across the column: line left, outlined
// secondary right, \u00d7 last. Row when the column has room, stacked when it does
// not \u2014 a container query on the strip, never a posture flag.
const PgpBand = ({ label, onTurnOn, onDismiss }) => (
  <div className="pgp-band">
    <div className="pgp-band-in">
      <p className="pgp-band-text">Know when new links land in your circles.</p>
      <div className="pgp-band-acts">
        <Button variant="secondary" onClick={onTurnOn}>{label}</Button>
        <button type="button" className="pgp-x" onClick={onDismiss} aria-label="Dismiss"><Icon name="x" size={16} /></button>
      </div>
    </div>
  </div>
);

// 4 — the rule, without the rules. Option 3's exact row — line left, outlined
// secondary right, × last — standing on the feed's own ground: no hairlines, no
// border, no fill, no radius, nothing enclosing it. Same container query.
const PgpRow = ({ label, onTurnOn, onDismiss }) => (
  <div className="pgp-row">
    <div className="pgp-band-in">
      <p className="pgp-band-text">Know when new links land in your circles.</p>
      <div className="pgp-band-acts">
        <Button variant="secondary" onClick={onTurnOn}>{label}</Button>
        <button type="button" className="pgp-x" onClick={onDismiss} aria-label="Dismiss"><Icon name="x" size={16} /></button>
      </div>
    </div>
  </div>
);

Object.assign(window, { PgpSentence, PgpCard, PgpBand, PgpRow });
