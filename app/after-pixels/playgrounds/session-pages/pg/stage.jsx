// ============================================================================
// Session-pages playground: puts the selected game, option and state on the real app.
// Mounts canon's own page (GsSession, or GsCasebook for Casebook's record page) as "Today", and an option's component in its place.
// Hook used: window.KitCandidate.Screen (main.jsx), which replaces only the routed page; top bar, footer, popups, demo bar stay canon's.
// ============================================================================

// Stage the app the way canon's states register does (app/states.jsx): view, connection, review flags, then go() with asView false.
const pgStage = (api, game, st) => {
  api.setView('pass'); api.setConnected(true);
  api.setReview({ week: st.week, today: 'played', unfinished: false });
  if (game.record) api.go('casebook', { page: 'record', sid: window.CB_ID }, false);
  else api.go('session', { id: st.sid }, false);
};

// The session record the page is showing, and the share text canon would copy for it.
const pgSessionOf = (api, game, st) => (game.record ? (st.cb === 'lost' && window.PG_CB_LOST ? window.PG_CB_LOST : window.cbWeek(api)) : window.GS_SESSIONS[st.sid]);
const pgCanonShare = (game, s) => {
  if (!s || s.live || s.unfinished) return null;   // an abandoned play has no Share (MCPG-030 EF-01)
  try { return game.record ? window.cbShareLines(s) : window.gsShareText(s); } catch (e) { return null; }
};

// Casebook's lost state is a playground seed (seeds/failures.jsx): canon's own case page, given that record.
const PgToday = ({ game, st }) => (game.record
  ? (st && st.cb === 'lost' && window.PG_CB_LOST ? <CbCase c={window.PG_CB_LOST} /> : <window.GsCasebook />)
  : <window.GsSession />);

// A broken option must not take the page down with it.
class PgBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  render() {
    if (!this.state.err) return this.props.children;
    return <main className="gs-wrap gs-main"><p role="alert">This option failed to render: {String(this.state.err.message || this.state.err)}</p></main>;
  }
}

// An option's own CSS lives only while that option is on screen. ":scope" is rewritten to the wrapper's class.
const PgScopedCss = ({ cls, css }) => {
  React.useEffect(() => {
    if (!css) return undefined;
    const el = document.createElement('style'); el.setAttribute('data-pg-option', cls);
    el.textContent = css.replace(/:scope/g, '.' + cls); document.head.appendChild(el);
    return () => el.remove();
  }, [cls, css]);
  return null;
};

// What the two switches resolve to for the option on screen, for the kit (Ss.Page sets data-element / data-layout from it).
window.PgViewCtx = React.createContext({ element: 'store', layout: 'built' });

const isShareOpt = (o) => o === window.PG_SHARE_OPT;
const PgScreen = ({ api }) => {
  const sel = window.usePgSel();
  const game = window.PG_BY_ID[sel.game];
  const st = game.states.find((s) => s.id === sel.states[sel.game]);
  const [staged, setStaged] = React.useState(null);
  React.useEffect(() => { pgStage(api, game, st); setStaged(sel.nonce); }, [sel.nonce]);
  if (staged === null) return null;
  const r = api.route;
  const mine = game.record ? (r.name === 'casebook' && r.page === 'record' && r.sid === window.CB_ID) : (r.name === 'session' && r.id === st.sid);
  // The player followed a link out of the session page: show the real page they went to. Picking a row brings them back.
  if (!mine) return typeof GsScreen !== 'undefined' ? <GsScreen name={r.name} /> : null;

  const def = window.pgGetOption(game.id, sel.opt);
  const session = pgSessionOf(api, game, st);
  const canonLines = pgCanonShare(game, session);
  // An option's shareText is its own code: a throw must never blank the app. It becomes "no Share" plus a visible note, and the option still renders.
  let lines = canonLines, shareErr = null;
  if (sel.opt > 0 && def.shareText) {
    try { lines = def.shareText(session, canonLines, { game: game.id, state: st.id }); }
    catch (e) { lines = null; shareErr = String((e && e.message) || e); }
  }
  const cls = 'pgo-' + game.id + '-' + sel.opt;
  const Comp = sel.opt > 0 && !isShareOpt(sel.opt) && !isNotes ? def.Component : null;
  const isShare = sel.opt === window.PG_SHARE_OPT, isNotes = sel.opt === window.PG_NOTES_OPT;
  const view = window.pgView(def, sel);
  const label = game.name + ' · ' + (isShare ? 'Share text' : isNotes ? 'Notes' : (sel.opt === 0 ? '0 Today' : sel.opt + ' ' + def.name) + ' · ' + st.label);
  const text = label + (!isShare && !isNotes && sel.opt > 0 && !Comp ? ' · not built' : '') + (Comp && view.missing.length ? ' · ' + view.missing.join(', ') + ' not built yet' : '');
  if (isShare) return (
    <>
      {ReactDOM.createPortal(<window.PgShareText game={game} />, document.body)}
      {ReactDOM.createPortal(<div className="pg-now" aria-live="polite" title={text}>{text}</div>, document.body)}
    </>
  );
  if (isNotes) return (
    <>
      {ReactDOM.createPortal(<window.PgNotes game={game} />, document.body)}
      {ReactDOM.createPortal(<div className="pg-now" aria-live="polite" title={text}>{text}</div>, document.body)}
    </>
  );
  return (
    <>
      <div className={'pgo ' + cls} data-pg-game={game.id} data-pg-option={sel.opt} data-pg-state={st.id} data-pg-element={view.element} data-pg-layout={view.layout} style={{ display: 'contents' }}>
        <PgScopedCss cls={cls} css={sel.opt > 0 ? def.css : null} />
        {shareErr && <p role="alert" className="gs-wrap" style={{ margin: '8px auto', maxWidth: 720, padding: '0 16px' }}>This option's share text failed: {shareErr}</p>}
        <PgBoundary key={game.id + sel.opt + st.id + sel.nonce}>
          <window.PgViewCtx.Provider value={view}>
            {Comp
              ? <Comp gid={game.id} game={game.name} optionN={sel.opt} stateId={st.id} stateLabel={st.label} sid={st.sid || null}
                  element={view.element} layout={view.layout}
                  session={session} share={{ lines, canonLines, supported: !!lines }} Today={() => <PgToday game={game} st={st} />} api={api} />
              : <PgToday game={game} st={st} />}
          </window.PgViewCtx.Provider>
        </PgBoundary>
      </div>
      {ReactDOM.createPortal(<div className="pg-now" aria-live="polite" title={text}>{text}</div>, document.body)}
    </>
  );
};

window.KitCandidate = { bind: () => {}, Screen: PgScreen };

// Below 1024 the rail lives in the app's own Config modal (config.jsx renders window.ConfigExtra there). At 1024 and up it is docked, so the modal carries none of it.
const PgConfigExtra = ({ onClose }) => {
  const ref = React.useRef(null);
  const docked = window.matchMedia('(min-width: 1024px)').matches;
  // The modal opens at its top; bring the rail up under the Config title (the nearest scrollable ancestor, never scrollIntoView).
  React.useEffect(() => {
    const el = ref.current; const body = el && el.closest('.kit-config-body');
    if (body) body.scrollTop = Math.max(0, el.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop - 8);
  }, []);
  return docked ? null : <div ref={ref}><window.PgRail onPick={onClose} /></div>;
};
window.ConfigExtra = PgConfigExtra;
