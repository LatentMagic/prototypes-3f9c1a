// Rig 2 "arrival" (options-v2 §D O2, §F). Frames 2A, 2B on the real Daily Word page; 2C a Library empty state with the receipt.
// DS change, faked: none to the DS. New UI built here from DS tokens/components: the edition line (2A), the receipt card (2C).
// Staging: Joe's free line (2026-10-14). Every number and edition is [placeholder].

// Staging on Joe's free line for the stock "More games" row (rig-only data patch; canon untouched, this page only):
// Escape is first room free with an account (not plain Free); Barrow chapter 2 is out, so the soon card is chapter 3.
Object.assign(window.GS_GAMES.escape, { tags: ['FIRST', 'Weekly', '10 min'], free: false, first: true });
window.GS_SOON.filter((g) => g.name === window.GS_GAMES.barrow.name).forEach((g) => { g.label = 'CHAPTER 3'; });

// Puts a React node into the real play box, just above the Play button (GsPlayBox is one block inside gs-game.jsx; it has no slot).
const PgAboveButton = ({ children }) => {
  const [host, setHost] = React.useState(null);
  React.useLayoutEffect(() => {
    const btn = document.querySelector('.gs-head-split .mcp-btn'); if (!btn) return undefined;
    const el = document.createElement('div'); btn.parentNode.insertBefore(el, btn); setHost(el);
    return () => el.remove();
  }, []);
  return host ? ReactDOM.createPortal(children, host) : null;
};

// 2A: the line sits at body size (16 above, 16 below via the card's 16 gap) and replaces the stock small line, so the page says it once.
const PgEditionLine = () => {
  React.useLayoutEffect(() => {
    const el = [...document.querySelectorAll('.gs-head-split p.gs-small')].find((p) => /free with an account/.test(p.textContent));
    if (!el) return undefined;
    el.style.display = 'none'; return () => { el.style.display = ''; };
  }, []);
  return <PgAboveButton><p style={{ margin: 0, textWrap: 'balance' }}>No. 212 was yesterday’s word. Today’s is yours with an account.</p></PgAboveButton>;
};

// 2C. Receipt: composed from DS Card, gs-label, rows with covers (GpMini). New UI, rig-built.
const PG_RECEIPT = [['word', 'every day'], ['mystery', 'every day'], ['escape', 'the first room'], ['casebook', 'the first case'], ['delve', 'the first scene'], ['barrow', 'chapter 1']];
const PgReceipt = () => {
  const gs = useGs();
  return (
    <DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
      <span className="gs-label">YOUR ACCOUNT OPENS</span>
      <DS.RowList label="Your account opens">
        {PG_RECEIPT.map(([k, what]) => (
          <DS.ListRow key={k} lead={<GpMini art={GS_GAMES[k].art} sm />} title={GS_GAMES[k].name} meta={what} end="Play" onClick={() => gs.go(GS_GAMES[k].route)} />
        ))}
      </DS.RowList>
      <p className="gs-small">Your results, history and achievements stay yours.</p>
      <p className="gs-small"><DS.TextLink onClick={() => gs.go('pass')}>Everything else</DS.TextLink> comes with the Pass.</p>
    </DS.Card>
  );
};
const PgLibraryNew = () => (
  <main className="gs-wrap gs-main" style={{ paddingBottom: 32 }}>
    <h1 className="gs-h1">Library</h1>
    <PgReceipt />
  </main>
);

Object.assign(window, { PgEditionLine, PgLibraryNew });
