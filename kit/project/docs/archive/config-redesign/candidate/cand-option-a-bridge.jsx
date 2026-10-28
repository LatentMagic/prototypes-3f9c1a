// Candidate build option-a for config-redesign: the one handle app/main.jsx reads (skills/candidate-build).
// Loads after the app/ files it re-publishes over and before app/main.jsx.
// bind(api) is called each render with the app's state and setters; Screen, if set,
// is rendered in place of the app's screen. Nothing here is accepted.
Object.assign(window, {
  KitCandidate: {
    bind(api) { window.KitCandidateApi = api; },
    // Screen: ({ api }) => <CandidateScreen api={api} />,
  },
});
