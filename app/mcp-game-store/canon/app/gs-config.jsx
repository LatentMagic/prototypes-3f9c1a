// ============================================================================
// [Platform] — review settings in Config (PROTOTYPE AID). Published as
// window.ConfigExtra; reads and writes the app through window.gsApi.
// ============================================================================
const GsConfigExtra = () => {
  const api = window.gsApi || {};
  const r = api.review || {};
  const [, bump] = React.useState(0);
  const set = (fn) => { fn(); setTimeout(() => bump((n) => n + 1), 0); };
  const row = (label, value, onChange, options) => (
    <div className="kit-config-row">
      <div className="kit-config-row-label">{label}</div>
      <window.ConfigSeg value={value} onChange={onChange} options={options} />
    </div>
  );
  return (
    <React.Fragment>
      <div className="kit-config-eyebrow">[Platform]</div>
      {row('Your AI', api.connected ? 'yes' : 'no', (v) => set(() => api.setConnected(v === 'yes')),
        [{ value: 'yes', label: 'Connected' }, { value: 'no', label: 'Not connected' }])}
      {row('Google and Apple sign-in', r.providerFail ? 'fail' : 'ok', (v) => set(() => api.setReview({ providerFail: v === 'fail' })),
        [{ value: 'ok', label: 'Works' }, { value: 'fail', label: 'Fails' }])}
      {row('Apple account on sign-in', r.appleNone ? 'none' : 'found', (v) => set(() => api.setReview({ appleNone: v === 'none' })),
        [{ value: 'found', label: 'Found' }, { value: 'none', label: 'None' }])}
      {row('Card at checkout', r.payFail ? 'declined' : 'ok', (v) => set(() => api.setReview({ payFail: v === 'declined' })),
        [{ value: 'ok', label: 'Accepted' }, { value: 'declined', label: 'Declined' }])}
      <div className="kit-config-hint">The plan (signed out, free, Pass) is switched from the demo bar at the foot of every screen.</div>
    </React.Fragment>
  );
};

Object.assign(window, { ConfigExtra: GsConfigExtra });
