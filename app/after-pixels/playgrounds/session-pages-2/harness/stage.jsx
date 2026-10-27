// ============================================================================
// Session pages 2: puts the selected game, option and state on the real app, through canon's candidate hook
// (window.KitCandidate.Screen, main.jsx), which replaces only the routed page: top bar, footer, popups and demo bar stay canon's.
// ============================================================================

// Staged the way canon's states register does it (app/states.jsx): view, connection, review, then go() without a history entry.
const sp2Stage = (api, st) => {
  api.setView('pass'); api.setConnected(true);
  api.setReview({ week: st.week, today: 'played', unfinished: false });
  api.go('session', { id: st.sid }, false);
};

class Sp2Boundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  render() {
    if (!this.state.err) return this.props.children;
    return <p role="alert">This option failed to render: {String(this.state.err.message || this.state.err)}</p>;
  }
}

const Sp2Screen = ({ api }) => {
  const sel = window.useSp2Sel();
  const game = window.SP2.byId[sel.game];
  const st = game.states.find((s) => s.id === sel.state[game.id]);
  const [staged, setStaged] = React.useState(null);
  React.useEffect(() => { sp2Stage(api, st); setStaged(sel.nonce); }, [sel.nonce]);
  if (staged === null) return null;
  const r = api.route;
  // A link followed out of the page shows canon's real page; picking a row brings the session page back.
  if (!(r.name === 'session' && r.id === st.sid)) return <GsScreen name={r.name} />;
  const s = GS_SESSIONS[st.sid];
  const def = window.sp2GetOption(game.id, sel.opt);
  const Comp = def.Component;
  const label = game.name + ' · ' + sel.opt + ' ' + def.name + ' · ' + st.label;
  return (
    <>
      <Sp2Page s={s} sid={st.sid}>
        <Sp2Boundary key={game.id + sel.opt + st.id + sel.nonce}>
          {Comp ? <Comp s={s} sid={st.sid} stateId={st.id} /> : <p>Not built.</p>}
        </Sp2Boundary>
      </Sp2Page>
      {ReactDOM.createPortal(<div className="sp2-now" aria-live="polite">{label}</div>, document.body)}
    </>
  );
};

window.KitCandidate = { bind: () => {}, Screen: Sp2Screen };

// Below 1024 the rail lives in the app's own Config modal (config.jsx renders window.ConfigExtra there). At 1024 and up it is docked.
const Sp2ConfigExtra = ({ onClose }) => {
  const docked = window.matchMedia('(min-width: 1024px)').matches;
  return docked ? null : <window.Sp2Rail onPick={onClose} />;
};
window.ConfigExtra = Sp2ConfigExtra;
