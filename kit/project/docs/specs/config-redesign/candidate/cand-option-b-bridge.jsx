// Candidate build option-b for config-redesign: the one handle app/main.jsx reads (skills/candidate-build).
// Loads after the app/ files it re-publishes over and before app/main.jsx.
// bind(api) is called each render with the app's state and setters. There is no Screen:
// the candidate changes only the Config modal, by re-publishing window.ConfigLauncher
// (cand-option-b-config.jsx) and window.ConfigExtra (cand-option-b-gsa-config.jsx).
// Nothing here is accepted.
Object.assign(window, {
  KitCandidate: {
    bind(api) { window.KitCandidateApi = api; },
  },
});
