// Candidate build remove-button for example: the one handle app/main.jsx reads (skills/candidate-build).
// Loads after the app/ files it re-publishes over and before app/main.jsx.
// bind(api) is called each render with the app's state and setters. There is no Screen:
// that would replace the whole app (shell, tabs, add form). The candidate re-publishes
// window.GsaHome instead (cand-remove-button-screen.jsx). Nothing here is accepted.
Object.assign(window, {
  KitCandidate: {
    bind(api) { window.KitCandidateApi = api; },
  },
});
