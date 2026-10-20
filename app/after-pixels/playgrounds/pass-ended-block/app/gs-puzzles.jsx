// ============================================================================
// After Pixels — the result tag a product page shows for this edition's play.
// The Daily Puzzles parts (puzzle cards, earlier puzzles, the shared streak panel)
// went when Daily Puzzles split into separate games.
// ============================================================================
const GsResultTag = ({ s }) => <DS.Tag kind={s.loss ? 'error' : 'success'}>{s.result}</DS.Tag>;

Object.assign(window, { GsResultTag });
