// Candidate "remove-button": the placeholder screen with a Remove button on each item
// and a count line. Reads and writes the app's items only through the api.
const CandEgScreen = ({ api }) => {
  const { items, setItems, isMobile } = api;
  return (
    <main className="kit-placeholder">
      <div className="kit-placeholder-eyebrow">Candidate · remove-button</div>
      <h1 className="kit-placeholder-title">{items.length === 0 ? 'All cleared' : 'Your items'}</h1>
      <p className="kit-placeholder-lede">Each item can now be removed. This change is not accepted.</p>
      {items.length === 0
        ? <div className="kit-placeholder-empty">Nothing left. Open States and pick “The screen with items”.</div>
        : <>
            <p className="cand-remove-button-count">{items.length} left</p>
            <ul className="kit-placeholder-items" data-mobile={isMobile ? '1' : undefined}>
              {items.map((it) => (
                <li key={it}>
                  <span className="cand-remove-button-row">
                    <span>{it}</span>
                    <button className="cand-remove-button-remove" onClick={() => setItems(items.filter((x) => x !== it))}>Remove</button>
                  </span>
                </li>
              ))}
            </ul>
          </>}
    </main>
  );
};
Object.assign(window, { CandEgScreen });
