// [Platform] — the Pass upsell's review aids (1153): two Config rows, and a reset of their store before every state.
// The states themselves are in app/states.jsx (group "Pass upsell"), the walk-through in app/qa.jsx.

// ---- Config: the seed has no played flag per edition, so New for you is empty for most players. This stages it full.
const GsPassConfigRows = () => {
  const v = useCpr();
  return (
    <React.Fragment>
      <div className="kit-config-eyebrow">Pass upsell</div>
      <div className="kit-config-row">
        <div className="kit-config-row-label">New editions</div>
        <window.ConfigSeg value={v.newEds} onChange={(x) => GsPassStage.set({ newEds: x })} options={[{ value: 'seed', label: 'As seeded' }, { value: 'most', label: 'Most not played' }]} />
      </div>
      <div className="kit-config-hint">Most not played treats every daily but Daily Word as unplayed today. New for you still holds only what the player can play now.</div>
      <div className="kit-config-row">
        <div className="kit-config-row-label">Free: Word and Escape</div>
        <window.ConfigSeg value={v.freeNew ? 'new' : 'played'} onChange={(x) => GsPassStage.set({ freeNew: x === 'new' })} options={[{ value: 'new', label: 'Not played' }, { value: 'played', label: 'Played' }]} />
      </div>
      <div className="kit-config-hint">A free account's today's Daily Word and Escape's first room. Not played puts both in New for you.</div>
      <div className="kit-config-row">
        <div className="kit-config-row-label">The Barrow, chapter 1</div>
        <window.ConfigSeg value={v.bwDone ? 'done' : 'none'} onChange={(x) => GsPassStage.set({ bwDone: x === 'done' })} options={[{ value: 'none', label: 'Not played' }, { value: 'done', label: 'Finished' }]} />
      </div>
    </React.Fragment>
  );
};
const GsPassShippedExtra = window.ConfigExtra;
const GsPassConfigExtra = () => <React.Fragment><GsPassConfigRows />{GsPassShippedExtra ? <GsPassShippedExtra /> : null}</React.Fragment>;

// ---- Every state starts from the store's defaults; a state that needs more sets it in its stage.
const gsPassShippedBuild = window.buildStates;
const gsPassBuildStates = (api) => {
  const r = gsPassShippedBuild(api);
  r.states.forEach((s) => { const go = s.go; s.go = () => { GsPassStage.set({ ...CPR_DEFAULTS }); go(); }; });
  return r;
};

Object.assign(window, { ConfigExtra: GsPassConfigExtra, buildStates: gsPassBuildStates });
