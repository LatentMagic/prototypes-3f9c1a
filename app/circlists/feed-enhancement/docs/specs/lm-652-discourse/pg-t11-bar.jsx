// ============================================================================
// v11 — the rig's own bar. Tooling, unmistakably not product: dark, above the
// app frame, and it collapses to one line so the shelf can be read on a phone
// without it in the way.
//
// Everything the reviewer steers sits here and nowhere else: which option, and
// the four controls the question actually turns on. The option's direction and
// its cost are here too, never inside the app frame.
// ============================================================================
const T11_LENGTHS = [['none', 'None'], ['one', 'One line'], ['para', 'A paragraph'], ['bullets', '+ bullets']];

const T11Seg = ({ label, value, options, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
    <span className="pg-lab">{label}</span>
    <div className="pg-seg">
      {options.map(([v, l]) => (
        <button key={v} type="button" onClick={() => onChange(v)} {...(value === v ? { 'data-on': '' } : {})}>{l}</button>
      ))}
    </div>
  </div>
);

const T11Bar = ({ opts, optId, onPick, cfg, setCfg, viewport, onViewport, open, onToggle }) => {
  const opt = opts.find(o => o.n === optId) || opts[0];
  return (
    <div className="pg-bar">
      <div className="pg-bar-in">
        <div className="pg-bar-top">
          <span className="pg-eyebrow">{'thought on a card \u00b7 v11'}</span>
          <span className="pg-title">Where the words sit, and how they open</span>
          <button type="button" className="pg-collapse" onClick={onToggle} aria-expanded={open}>
            {open ? 'Hide controls' : 'Controls \u00b7 ' + opt.n + ' ' + opt.name}
          </button>
        </div>
        {open && (
          <React.Fragment>
            <div className="pg-opts">
              {opts.map(o => (
                <button key={o.n} type="button" className="pg-opt" {...(o.n === optId ? { 'data-on': '' } : {})}
                  onClick={() => onPick(o.n)}>
                  <span className="pg-opt-n">{o.n}</span>
                  <span className="pg-opt-name">{o.name}</span>
                </button>
              ))}
            </div>
            <div className="pg-say">
              <p>{opt.dir}</p>
              <p className="pg-cost"><b>Costs.</b> {opt.cost}</p>
            </div>
            <div className="pg-ctrls">
              <T11Seg label="Thought length" value={cfg.length} options={T11_LENGTHS} onChange={(v) => setCfg({ ...cfg, length: v })} />
              <T11Seg label="Preview thumbnail" value={cfg.preview ? 'on' : 'off'} options={[['on', 'Present'], ['off', 'Absent']]}
                onChange={(v) => setCfg({ ...cfg, preview: v === 'on' })} />
              <T11Seg label="Density" value={cfg.density} options={[['sparse', 'One in four'], ['all', 'Every card']]}
                onChange={(v) => setCfg({ ...cfg, density: v })} />
              <T11Seg label="Viewport" value={viewport} options={[['auto', 'Auto'], ['mobile', 'Mobile']]} onChange={onViewport} />
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { T11Bar, T11_LENGTHS });
