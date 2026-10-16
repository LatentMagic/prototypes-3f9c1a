// Candidate build pass-upsell-ratified for 1153: the one handle app/main.jsx reads (skills/candidate-build).
// Loads after the app/ files it re-publishes over and before app/main.jsx.
// bind(api) is called each render with the app's context object. Nothing here is accepted.
// After signing in, every player lands on Library, free or Pass (owner, 2026-10-16). Canon lands on Discover.
const CPR_AUTH = ['signup', 'signin', 'verify', 'username', 'recover', 'returning'];
// Demo fill (cand-pass-upsell-ratified-demo.jsx): main.jsx's screen switch can't name the ten demo games' routes, so Screen renders
// their page and hands every other route to canon's GsArrival, keyed and "quick" as main.jsx keys it (a new route object is a new
// page; a history index that didn't rise is a back step). Remove with the demo file.
let cprScrR = null; let cprScrKey = 0; let cprScrQuick = false; let cprScrIdx = -1;
const CprDemoArrival = ({ D, quick }) => {
  const [ready, setReady] = React.useState(!!quick);
  React.useEffect(() => { if (ready) return undefined; const t = setTimeout(() => setReady(true), GS_LOAD_MS); return () => clearTimeout(t); }, []);
  return ready ? <D /> : <main className="gs-wrap gs-main" aria-busy="true"><div className="gs-inplace" style={{ minHeight: '60vh' }}><GsSpin /></div></main>;
};
Object.assign(window, {
  KitCandidate: {
    bind(api) {
      window.KitCandidateApi = api;
      if (!window.__cprDemoRoutes && window.CPR_DEMO_IDS) {
        window.__cprDemoRoutes = true;
        [GS_ROUTES, GS_FOOTER, GS_ARRIVES].forEach((a) => window.CPR_DEMO_IDS.forEach((k) => { if (!a.includes(k)) a.push(k); }));
      }
      const sIn = api.signedIn; api.signedIn = (how, next) => sIn(how, next || 'library');
      const sdv = api.setDemoView;
      api.setDemoView = (v) => {
        if (v !== 'out' && (api.route.name === 'home' || CPR_AUTH.includes(api.route.name))) { api.setView(v); api.go('library', null, v); return; }
        sdv(v);
      };
    },
    Screen: ({ api }) => {
      const r = api.route;
      if (r !== cprScrR) {
        cprScrR = r; cprScrKey += 1;
        let i = null; try { i = (window.history.state || {}).gsIdx; } catch (e) {}
        cprScrQuick = typeof i === 'number' && cprScrIdx >= 0 && !(i > cprScrIdx);
        if (typeof i === 'number') cprScrIdx = i;
      }
      const D = window.CPR_DEMO_SCREENS && window.CPR_DEMO_SCREENS[r.name];
      return D ? <CprDemoArrival key={cprScrKey} D={D} quick={cprScrQuick} /> : <GsArrival key={cprScrKey} name={r.name} quick={cprScrQuick} />;
    },
  },
});
