// After Pixels — the Pass upsell's review aids: two Config rows and the Barrow row, and a reset of their store before every state.
// Re-publishes ConfigExtra (these rows above gs-config.jsx's) and buildStates (states.jsx's, with the reset).
// The states themselves are in app/states.jsx (group "Pass upsell"), the walk-through in app/qa.jsx.

// ---- Config. The seed has no played flag per edition, so New for you is empty for most players: New editions stages it full.
// The other row stages a free account's Word and Escape; the Barrow's chapter 1 is GsBarrowConfigRow, in the Barrow's own section.
const GsPassConfigRows = () => {
  const v = useCpr();
  const { ConfigGroup: Group, ConfigRow: Row } = window;
  return (
    <Group title="Pass upsell">
      <Row label="New editions" value={v.newEds} onChange={(x) => GsPassStage.set({ newEds: x })}
        options={[{ value: 'seed', label: 'As seeded' }, { value: 'most', label: 'Most not played' }]}
        hint="Most not played treats every daily but Daily Word as unplayed today. New for you still holds only what the player can play now." />
      <Row label="Free: Word and Escape" value={v.freeNew ? 'new' : 'played'} onChange={(x) => GsPassStage.set({ freeNew: x === 'new' })}
        options={[{ value: 'new', label: 'Not played' }, { value: 'played', label: 'Played' }]}
        hint="A free account's today's Daily Word and Escape's first room. Not played puts both in New for you." />
    </Group>
  );
};
// The Barrow's chapter 1, shown in Config's Barrow section (gs-config.jsx).
const GsBarrowConfigRow = () => {
  const v = useCpr();
  const Row = window.ConfigRow;
  return <Row label="Chapter 1" value={v.bwDone ? 'done' : 'none'} onChange={(x) => GsPassStage.set({ bwDone: x === 'done' })}
    options={[{ value: 'none', label: 'Not played' }, { value: 'done', label: 'Finished' }]} />;
};
const GsPassShippedExtra = window.ConfigExtra;
const GsPassConfigExtra = () => <React.Fragment>{GsPassShippedExtra ? <GsPassShippedExtra /> : null}<GsPassConfigRows /></React.Fragment>;

// ---- Every state starts from the store's defaults; a state that needs more sets it in its stage.
const gsPassShippedBuild = window.buildStates;
const gsPassBuildStates = (api) => {
  const r = gsPassShippedBuild(api);
  r.states.forEach((s) => { const go = s.go; s.go = () => { GsPassStage.set({ ...CPR_DEFAULTS }); go(); }; });
  return r;
};

Object.assign(window, { GsBarrowConfigRow, ConfigExtra: GsPassConfigExtra, buildStates: gsPassBuildStates });
