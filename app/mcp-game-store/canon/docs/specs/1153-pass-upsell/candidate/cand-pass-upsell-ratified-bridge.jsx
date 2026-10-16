// Candidate build pass-upsell-ratified for 1153: the one handle app/main.jsx reads (skills/candidate-build).
// Loads after the app/ files it re-publishes over and before app/main.jsx.
// bind(api) is called each render with the app's context object. Nothing here is accepted.
// After signing in, every player lands on Library, free or Pass (owner, 2026-10-16). Canon lands on Discover.
const CPR_AUTH = ['signup', 'signin', 'verify', 'username', 'recover', 'returning'];
Object.assign(window, {
  KitCandidate: {
    bind(api) {
      window.KitCandidateApi = api;
      const sIn = api.signedIn; api.signedIn = (how, next) => sIn(how, next || 'library');
      const sdv = api.setDemoView;
      api.setDemoView = (v) => {
        if (v !== 'out' && (api.route.name === 'home' || CPR_AUTH.includes(api.route.name))) { api.setView(v); api.go('library', null, v); return; }
        sdv(v);
      };
    },
  },
});
