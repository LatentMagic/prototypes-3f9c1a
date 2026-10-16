// Playground "example": how should the queue lay out its item list?
// The real app runs unchanged (app/main.jsx and the queue); this strip only sets which layout CSS
// applies, via data-pg-example on <html>. The CSS is in the entry's style block.
// Selection persists under pg_example_v1.
const PG_EG_OPTIONS = [
  { id: 'one', name: 'One column', stance: 'Today. Cards stacked, one reading order.', cost: 'A long list needs a lot of scrolling on desktop.' },
  { id: 'grid', name: 'Two columns', stance: 'Fits a long list on one screen.', cost: 'On a phone it is one column anyway, so this option only differs on desktop.' },
  { id: 'rows', name: 'Joined rows', stance: 'The cards fused into one list. The densest read.', cost: 'Items stop reading as separate things.' },
];

const PgExampleStrip = () => {
  const [pick, setPick] = React.useState(() => {
    try { return localStorage.getItem('pg_example_v1') || 'one'; } catch (e) { return 'one'; }
  });
  const [open, setOpen] = React.useState(true);
  React.useEffect(() => {
    document.documentElement.setAttribute('data-pg-example', pick);
    try { localStorage.setItem('pg_example_v1', pick); } catch (e) {}
  }, [pick]);
  const ref = React.useRef(null);
  React.useEffect(() => {
    // Lift the app's own Config pill clear of the strip, and keep the page's end reachable.
    document.documentElement.style.setProperty('--pg-strip-h', open && ref.current ? ref.current.offsetHeight + 'px' : '0px');
  });
  const cur = PG_EG_OPTIONS.find((o) => o.id === pick);
  if (!open) return <button className="pg-strip-tab" onClick={() => setOpen(true)}>Layouts</button>;
  return (
    <div ref={ref} className="pg-strip" role="region" aria-label="Playground: queue layout">
      <div className="pg-strip-row">
        {PG_EG_OPTIONS.map((o, i) => (
          <button key={o.id} data-active={o.id === pick ? '1' : undefined} onClick={() => setPick(o.id)}>{i + 1} · {o.name}</button>
        ))}
        <button className="pg-strip-hide" onClick={() => setOpen(false)}>Hide</button>
      </div>
      <div className="pg-strip-note">{cur.stance} Cost: {cur.cost}</div>
    </div>
  );
};

const pgEgHost = document.createElement('div');
document.body.appendChild(pgEgHost);
ReactDOM.createRoot(pgEgHost).render(<PgExampleStrip />);
