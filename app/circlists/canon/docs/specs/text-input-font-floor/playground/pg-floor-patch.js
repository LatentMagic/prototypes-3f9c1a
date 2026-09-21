// The font-floor rig's lever, installed before the app's modules run.
//
// It cannot wrap window.CandWrite / window.CandProse — talk-card.jsx and
// talk-surface.jsx resolve those names lexically, not off window — so the size
// is rewritten where every caller passes through: React.createElement. The
// function objects on window ARE the ones those files reference, so identity
// matching is exact. Nothing in app/ is touched.
//
// The URL slot, the add sheet's thought box and the states aid's search field
// carry their size inline with no prop, so those three are lifted by the
// entry's own !important CSS instead.
(function () {
  var KEY = 'pg_font_floor_app_v1';
  var OPTS = {
    '00': { name: 'Today', tag: 'baseline — the failing state',
      sizes: 'card 12.5 · turn 14.5 · URL 14', note: 'Every field is under 16, so iOS zooms in on each one and stays there.',
      card: { w: 12.5, r: 12.5 }, turn: { w: 14.5, r: 14.5 } },
    '01': { name: 'Match up', tag: 'field and words both move',
      sizes: 'card 16/16 · turn 16/16', note: 'Nothing jumps when you start typing, but every thought and turn gets bigger.',
      card: { w: 16, r: 16 }, turn: { w: 16, r: 16 } },
    '02': { name: 'Its own register', tag: 'only the field moves',
      sizes: 'card 16/12.5 · turn 16/14.5', note: 'Reading is unchanged. The box you type in is bigger than the words it replaced.',
      card: { w: 16, r: 12.5 }, turn: { w: 16, r: 14.5 } },
    '03': { name: 'Back on the scale', tag: 'field moves, words go to a token',
      sizes: 'card 16/13 · turn 16/15', note: '02 with a smaller jump, because the read sizes come off the half-pixels.',
      card: { w: 16, r: 13 }, turn: { w: 16, r: 15 } },
  };
  var cur = '00';
  try { cur = localStorage.getItem(KEY) || '00'; } catch (e) {}
  if (!OPTS[cur]) cur = '00';
  document.documentElement.setAttribute('data-floor', cur);
  window.PG_FLOOR = {
    OPTS: OPTS, order: ['00', '01', '02', '03'],
    id: function () { return cur; },
    set: function (id) { try { localStorage.setItem(KEY, id); } catch (e) {} location.reload(); },
  };

  var ce = React.createElement;
  React.createElement = function (type, props) {
    if (props && (type === window.CandWrite || type === window.CandProse)) {
      var write = type === window.CandWrite;
      var s = typeof props.size === 'number' ? props.size : (write ? 15 : null);
      if (s != null) {
        var o = OPTS[cur];
        // 12.5 is the card's thought; 14.5 and the 15 default are the conversation.
        var v = s <= 13 ? (write ? o.card.w : o.card.r) : (s <= 15.4 ? (write ? o.turn.w : o.turn.r) : null);
        if (v != null && v !== s) {
          arguments[1] = Object.assign({}, props, { size: v });
        }
      }
    }
    return ce.apply(this, arguments);
  };
})();
