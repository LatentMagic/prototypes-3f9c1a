// ============================================================================
// Kit — an EXAMPLE product section for Config (PROTOTYPE AID). Delete this file
// and its script tag once the product has its own.
//
// config.jsx holds no product rows. A product hangs its review settings on the
// modal by publishing window.ConfigExtra; the modal renders it at its foot and
// hands it { onClose }. Absent ⇒ the modal shows its own rows only. Only one
// file may publish it: the last one loaded wins. A button given the class
// kit-config-btn-secondary runs its handler and then closes the modal.
//
// The one row here holds its setting on the document and
// the placeholder screen's styles in index.html read it.
// ============================================================================
const ConfigExtraExample = () => {
  const [density, setDensity] = React.useState(() => document.documentElement.dataset.kitDensity || 'comfortable');
  const set = (v) => { document.documentElement.dataset.kitDensity = v; setDensity(v); };
  return (
    <React.Fragment>
      <div className="kit-config-eyebrow">Example product section</div>
      <div className="kit-config-row">
        <div className="kit-config-row-label">Density</div>
        <window.ConfigSeg value={density} onChange={set} options={[
          { value: 'comfortable', label: 'Comfortable' }, { value: 'compact', label: 'Compact' },
        ]} />
      </div>
      <div className="kit-config-hint">An example row added through window.ConfigExtra. Compact tightens the placeholder list.</div>
    </React.Fragment>
  );
};

Object.assign(window, { ConfigExtra: ConfigExtraExample });
