// Rig 2 "arrival" (options-v2 §D O2, §F). Frames 2A, 2B on the real Daily Word page; 2C a Library empty state with the receipt.
// DS change, faked: none to the DS. New UI built here from DS tokens/components: the edition line (2A), the receipt card (2C).
// Staging: Joe's free line (2026-10-14). Every number and edition is [placeholder].

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

const PgEditionLine = () => (
  <PgAboveButton><p className="gs-small" style={{ color: 'var(--mcp-text, inherit)', margin: 0 }}>No. 212 was yesterday’s word. Today’s is yours with an account.</p></PgAboveButton>
);

// 2C. Receipt: composed from DS Card, gs-label, rows with covers (GpMini). New UI, rig-built.
const PG_RECEIPT = [['word', 'every day'], ['mystery', 'every day'], ['escape', 'the first room'], ['casebook', 'the first case'], ['delve', 'the first scene'], ['barrow', 'chapter 1']];
const PgReceipt = () => {
  const gs = useGs();
  return (
    <DS.Card style={{ gap: 16, justifyItems: 'stretch', alignContent: 'start' }}>
      <span className="gs-label">YOUR ACCOUNT OPENS</span>
      <div style={{ display: 'grid', gap: 0 }}>
        {PG_RECEIPT.map(([k, what], i) => (
          <div key={k} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: i ? '1px solid var(--mcp-border, rgba(128,128,128,.25))' : 0 }}>
            <GpMini art={GS_GAMES[k].art} sm />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, overflowWrap: 'anywhere' }}>{GS_GAMES[k].name}</div>
              <div className="gs-small">{what}</div>
            </div>
            <DS.TextLink onClick={() => gs.go(GS_GAMES[k].route)}>Play</DS.TextLink>
          </div>
        ))}
      </div>
      <p className="gs-small">Your results, history and achievements stay yours.</p>
      <p className="gs-small"><DS.TextLink onClick={() => gs.go('pass')}>Everything else</DS.TextLink> comes with the Pass.</p>
    </DS.Card>
  );
};
const PgLibraryNew = () => (
  <main className="gs-wrap gs-main">
    <h1 className="gs-h1">Library</h1>
    <PgReceipt />
  </main>
);

Object.assign(window, { PgEditionLine, PgLibraryNew });
