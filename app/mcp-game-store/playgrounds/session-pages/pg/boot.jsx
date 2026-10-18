// Session-pages playground: mounts the docked rail (1024 and up; CSS hides the dock below). Loads after canon's main.jsx, which mounts the app.
ReactDOM.createRoot(document.getElementById('pg-dock')).render(<window.PgRail />);
