// Session-pages playground: option registry, selection store, URL and localStorage. Plain script, no React.
// Selection = { game, opt (0 = Today, 1..3), states: {game: stateId}, open: {game: bool}, nonce }.
// nonce changes on every pick, so picking the row already showing restages the page (back from a link inside it).
(function () {
  var KEY = 'pg_session-pages_v1';
  var registry = {};
  // pgOption('delve', 2, { name, stance, cost, Component?, css?, shareText? }): see README.md.
  window.pgOption = function (gid, n, def) { registry[gid + '-' + n] = Object.assign({}, def, { gid: gid, n: n }); };
  window.pgGetOption = function (gid, n) {
    if (n === window.PG_SHARE_OPT) return { gid: gid, n: n, name: 'Share text', built: true, stance: 'Three candidate share texts, each as a win and as a loss, in a chat bubble at a real phone width.', cost: 'A whiteboard, not the app. The bubble is a simulation and widths are approximate.' };
    if (n === 0) return { gid: gid, n: 0, name: 'Today', stance: 'The session page as canon ships it, mounted untouched.', cost: 'None. This is the baseline every option is judged against.' };
    var d = registry[gid + '-' + n] || {};
    return Object.assign({ gid: gid, n: n, name: 'Unnamed', stance: 'Not decided yet.', cost: 'Not costed yet.' }, d, { built: !!d.Component });
  };

  var G = window.PG_GAMES, B = window.PG_BY_ID, N = window.PG_OPTION_COUNT;
  var fresh = function () {
    var s = { game: G[0].id, opt: 0, states: {}, open: {}, nonce: 0, dist: 'near' };
    G.forEach(function (g) { s.states[g.id] = g.states[0].id; });
    s.open[s.game] = true; return s;
  };
  var DISTS = ['near', 'middle', 'far'];
  var sel = fresh();
  var listeners = [];

  function valid(g, o, s) {
    if (!B[g]) return null;
    var oo = Number(o); if (!(oo >= 0 && oo <= window.PG_SHARE_OPT) || Math.floor(oo) !== oo || o === null || o === undefined || o === '') oo = 0;
    var st = B[g].states.some(function (x) { return x.id === s; }) ? s : null;
    return { game: g, opt: oo, state: st };
  }
  function fromStorage() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || 'null'); if (!raw) return;
      var v = valid(raw.game, raw.opt, null); if (!v) return;
      sel.game = v.game; sel.opt = v.opt;
      G.forEach(function (g) {
        var ok = raw.states && g.states.some(function (x) { return x.id === raw.states[g.id]; });
        if (ok) sel.states[g.id] = raw.states[g.id];
      });
      sel.open = raw.open || {}; sel.open[sel.game] = true;
      if (DISTS.indexOf(raw.dist) > -1) sel.dist = raw.dist;
    } catch (e) {}
  }
  // Deep link: ?g=delve&o=2&s=finished, or #delve/2/finished. The URL beats storage.
  // Both forms work at any time; a hash, being the newer act, wins over the query. persist() writes the one canonical form back (the query) and drops the hash.
  // Distance: ?d=near|middle|far, read on every load; it never restages the page.
  function distFromUrl() {
    try { var d = (new URLSearchParams(location.search).get('d') || '').toLowerCase(); if (DISTS.indexOf(d) > -1) sel = Object.assign({}, sel, { dist: d }); } catch (e) {}
  }
  function fromUrl() {
    distFromUrl();
    var g = null, o = null, s = null;
    try {

      if (location.hash.length > 1) { var p = decodeURIComponent(location.hash.slice(1)).split('?')[0].split('/'); g = p[0]; o = p[1]; s = p[2]; }
      if (!g || !B[g.toLowerCase()]) { var q = new URLSearchParams(location.search); g = q.get('g'); o = q.get('o'); s = q.get('s'); }
    } catch (e) {}
    var v = g && valid(g.toLowerCase(), o, s && s.toLowerCase()); if (!v) return false;
    sel = Object.assign({}, sel, { game: v.game, opt: v.opt, states: Object.assign({}, sel.states), open: Object.assign({}, sel.open) });
    if (v.state) sel.states[v.game] = v.state;
    sel.open = {}; sel.open[v.game] = true; sel.nonce++; return true;
  }
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify({ game: sel.game, opt: sel.opt, states: sel.states, open: sel.open, dist: sel.dist })); } catch (e) {}
    try {
      var url = location.pathname + '?g=' + sel.game + '&o=' + sel.opt + '&s=' + sel.states[sel.game] + '&d=' + sel.dist;
      history.replaceState(history.state, '', url);
    } catch (e) {}
  }
  function set(next) { sel = Object.assign({}, sel, next); persist(); listeners.slice().forEach(function (l) { l(); }); }

  window.pgStore = {
    get: function () { return sel; },
    subscribe: function (l) { listeners.push(l); return function () { listeners = listeners.filter(function (x) { return x !== l; }); }; },
    select: function (game, opt) { var o = {}; o[game] = true; set({ game: game, opt: opt, open: o, nonce: sel.nonce + 1 }); },
    setState: function (game, stateId) {
      var st = Object.assign({}, sel.states); st[game] = stateId; var o = {}; o[game] = true;
      set({ game: game, states: st, open: o, nonce: sel.nonce + 1 });
    },
    setDist: function (d) { if (DISTS.indexOf(d) > -1) set({ dist: d }); },
    toggle: function (game) { var o = Object.assign({}, sel.open); var cur = o[game] === undefined ? game === sel.game : o[game]; o[game] = !cur; set({ open: o }); },
    isOpen: function (game) { var v = sel.open[game]; return v === undefined ? game === sel.game : v; },
    link: function () { return location.origin + location.pathname + '?g=' + sel.game + '&o=' + sel.opt + '&s=' + sel.states[sel.game] + '&d=' + sel.dist; },
    reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} },
  };
  fromStorage(); fromUrl(); persist();
  window.addEventListener('hashchange', function () { if (fromUrl()) { persist(); listeners.slice().forEach(function (l) { l(); }); } });
})();
