// ============================================================================
// Config rows for the candidate overlays (PROTOTYPE AID). The one file that
// publishes window.ConfigExtra: it composes the rows each overlay exports
// (CandTalkConfig from app/talk-qa.jsx, PppConfig from app/pricing-states.jsx),
// each built from ConfigGroup / ConfigRow / ConfigAction / ConfigNote. An
// overlay that is not loaded contributes nothing. Only one file may publish
// ConfigExtra, so a new overlay exports its component and is added here.
// ============================================================================
const CircConfigExtra = () => {
  const Ppp = window.PppConfig, Talk = window.CandTalkConfig;
  return (
    <React.Fragment>
      {Ppp && <Ppp />}
      {Talk && <Talk />}
    </React.Fragment>
  );
};
Object.assign(window, { ConfigExtra: CircConfigExtra });
