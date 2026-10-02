// Create form: three heading + button pairs, on the real CreateSpace (app/spaces.jsx)
// via its title / submitLabel props. Lede and no-dots come from the candidate's hook,
// mirrored here so cand-ppp-main.jsx (which boots the app) is not loaded.
window.CircPricing = { createFlow: () => null, createLede: (cap) => 'A shared list for up to ' + cap + ' people. You champion it; everyone joins free.' };

const PG_NAMES = [['short', 'Backend Pod'], ['long', 'Thursday night reading group'], ['empty', 'Empty']];
const pgName = (k) => (k === 'empty' ? '' : PG_NAMES.find((n) => n[0] === k)[1]);

const PgForm = ({ name, title, label }) => (
  <div style={{ '--circ-vh': '640px' }}>
    <CreateSpace key={name} initialName={name} onCreate={() => {}} onCancel={() => {}} title={title} submitLabel={label} />
  </div>
);
const PgWidths = (p) => (
  <>
    <PgFrame cap="Phone · 320" width={320}><PgForm {...p} /></PgFrame>
    <PgFrame cap="Phone · 390" width={390}><PgForm {...p} /></PgFrame>
    <PgFrame cap="Desktop" width={720} posture="desktop"><PgForm {...p} /></PgFrame>
  </>
);

const PgCreateBoard = () => {
  React.useEffect(() => { const t = setTimeout(() => { if (document.activeElement) document.activeElement.blur(); window.scrollTo(0, 0); }, 120); return () => clearTimeout(t); });
  const [k, setK] = usePgSaved('pg_ppp_create_v1', 'short');
  const name = pgName(k);
  return (
    <PgBoard eyebrow="Per-person pricing · option board" title="The create form's heading and button"
      lede="The real create form, as reached after checkout or by a subscriber tapping New circle. Lede, fields and layout are held fixed; only the heading and the button label change. Pick a name below to see the button with a short name, a long one, or none."
      controls={<PgSeg label="Name" value={k} options={PG_NAMES} onChange={setK} />}>
      <PgOpt num="00" name="As built" claim="Heading Create a circle, button Create. On trial since 2 Oct.">
        <PgWidths name={name} title="Create a circle" label="Create" />
      </PgOpt>
      <PgOpt num="01" name="New circle / Create circle" claim="The heading names the thing, matching the New circle button that opens the page. The button names the act and its object."
        cost="Create a circle stops being the page's name. Heading and button still share the word circle.">
        <PgWidths name={name} title="New circle" label="Create circle" />
      </PgOpt>
      <PgOpt num="02" name="Create a circle / Create [name]" claim="The heading keeps the flow's name. The button carries what you typed, so it names this circle and not circles in general. With no name it reads Create circle and stays disabled."
        cost="The label changes as you type, and a long name makes a long button (it wraps at 320 with the long name).">
        <PgWidths name={name} title="Create a circle" label={(n) => (n ? 'Create ' + n : 'Create circle')} />
      </PgOpt>
      <PgOpt num="03" name="Create a circle / Start circle" claim="The heading keeps the flow's name. The button uses a different verb for the same act, so the two never echo."
        cost="Two verbs for one act. Start is not used for this anywhere else in the app.">
        <PgWidths name={name} title="Create a circle" label="Start circle" />
      </PgOpt>
    </PgBoard>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<PgCreateBoard />);
