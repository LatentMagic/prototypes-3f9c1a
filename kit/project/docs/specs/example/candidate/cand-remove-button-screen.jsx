// Candidate "remove-button": Home with a Remove button for each item and a count line.
// Wraps the queue's own GsaHome (app/gsa-queue.jsx) rather than replacing it, so the
// shell, tabs and add form stay as they are. It reads the items from the store and
// writes them only through the candidate api (setItems).
const CandEgOriginalHome = window.GsaHome;
const CandEgHome = (props) => {
  const g = useGsa();
  const items = g.items;
  const api = window.KitCandidateApi;
  return (
    <>
      <CandEgOriginalHome {...props} />
      <section className="cand-remove-button-panel" aria-label="Remove items (candidate)">
        <p className="cand-remove-button-count">{items.length === 0 ? 'Nothing left to remove' : items.length + ' left'}</p>
        <ul className="cand-remove-button-list">
          {items.map((it) => (
            <li key={it.id} className="cand-remove-button-row">
              <span>{it.title}</span>
              <button className="cand-remove-button-remove" aria-label={'Remove ' + it.title} onClick={() => api.setItems(items.filter((x) => x.id !== it.id))}>Remove</button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};
Object.assign(window, { GsaHome: CandEgHome });
