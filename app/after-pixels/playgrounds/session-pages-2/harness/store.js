// Session pages 2: option registry, selection, address and storage. Plain script, no React.
// Selection = { game, opt (1..3), state: {game: stateId}, nonce }. nonce changes on every pick, so picking the row on screen restages the page.
// Address: ?g=<game>&o=<1..3>&s=<state>. The address beats storage; storage key pg_session-pages-2_v1.
(function () {
  var KEY = 'pg_session-pages-2_v1';
  var registry = {};
  // sp2Option('word', 1, { name, stance, cost, Component }). Component renders the option's own area only (README.md).
  window.sp2Option = function (gid, n, def) { registry[gid + '-' + n] = Object.assign({ gid: gid, n: n }, def); };
  window.sp2GetOption = function (gid, n) { return registry[gid + '-' + n] || { gid: gid, n: n, name: 'Not built', stance: '', cost: '' }; };

  var G = window.SP2.games, B = window.SP2.byId, N = window.SP2.optionCount;
  var fresh = function () {
    var s = { game: G[0].id, opt: 1, state: {}, view: null, nonce: 0 };
    G.forEach(function (g) { s.state[g.id] = g.states[0].id; });
    return s;
  };
  var clean = function (raw) {
    var s = fresh();
    if (!raw) return s;
    if (B[raw.game]) s.game = raw.game;
    var o = Number(raw.opt); if (o >= 1 && o <= N && Math.floor(o) === o) s.opt = o;
    G.forEach(function (g) { var v = raw.state && raw.state[g.id]; if (g.states.some(function (x) { return x.id === v; })) s.state[g.id] = v; });
    // A sheet (a game's comparison view, e.g. Word's backgrounds) shows in place of the page.
    if (raw.view && (B[s.game].sheets || []).some(function (x) { return x.id === raw.view; })) s.view = raw.view;
    return s;
  };
  var load = function () { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } };
  var fromUrl = function (s) {
    var q = new URLSearchParams(location.search);
    var g = q.get('g'); if (!B[g]) return s;
    var next = { game: g, opt: q.has('o') ? q.get('o') : s.opt, state: Object.assign({}, s.state), view: q.get('view') };
    if (q.has('s')) next.state[g] = q.get('s');
    return clean(next);
  };
  var sel = fromUrl(clean(load()));
  var listeners = [];
  var write = function () {
    try { localStorage.setItem(KEY, JSON.stringify({ game: sel.game, opt: sel.opt, state: sel.state, view: sel.view })); } catch (e) {}
    var u = new URL(location.href);
    // A game's own settings (window.sp2ExtraParams, e.g. Word's &pal=) ride along after the selection.
    // Before the game's files load, any other parameter already in the address is kept as it is.
    var extra = {};
    if (window.sp2ExtraParams) extra = window.sp2ExtraParams();
    else new URLSearchParams(location.search).forEach(function (v, k) { if (['g', 'o', 's', 'view'].indexOf(k) < 0) extra[k] = v; });
    if (sel.view) extra.view = sel.view; else delete extra.view;
    u.search = '?g=' + sel.game + '&o=' + sel.opt + '&s=' + sel.state[sel.game] + Object.keys(extra).map(function (k) { return '&' + k + '=' + encodeURIComponent(extra[k]); }).join(''); u.hash = '';
    history.replaceState(history.state, '', u.toString());
  };
  var set = function (patch) {
    sel = Object.assign({}, sel, patch, { nonce: sel.nonce + 1 });
    write(); listeners.forEach(function (f) { f(); });
  };
  window.sp2Store = {
    get: function () { return sel; },
    subscribe: function (f) { listeners.push(f); return function () { listeners = listeners.filter(function (x) { return x !== f; }); }; },
    pick: function (gid, n) { set({ game: gid, opt: n, view: null }); },
    setState: function (gid, st) { var s = Object.assign({}, sel.state); s[gid] = st; set({ game: gid, state: s, view: null }); },
    setView: function (gid, v) { set({ game: gid, view: v }); },
    link: function () { return location.href; },
  };
  write();
})();
