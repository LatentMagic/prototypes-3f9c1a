// Session-pages playground: mounts the docked rail (1024 and up; CSS hides the dock below). Loads after canon's main.jsx, which mounts the app.
ReactDOM.createRoot(document.getElementById('pg-dock')).render(<window.PgRail />);

// Canon's lbCopy selects a hidden textarea and calls execCommand('copy'), but the Share pop-up's focus handling steals the selection first, so the
// clipboard stays empty while execCommand still returns true. Without forking canon: when a copy is asked for, write the hidden textarea's own value
// with the Clipboard API in the same click, then let the original call run.
(function () {
  if (!navigator.clipboard || document.__pgCopyPatched) return;
  document.__pgCopyPatched = true;
  const orig = document.execCommand.bind(document);
  document.execCommand = function (cmd) {
    if (String(cmd).toLowerCase() === 'copy') {
      const tas = document.body.querySelectorAll(':scope > textarea[readonly]');
      const ta = tas[tas.length - 1];
      if (ta && ta.value) { try { navigator.clipboard.writeText(ta.value).catch(() => {}); } catch (e) {} }
    }
    return orig.apply(document, arguments);
  };
})();
