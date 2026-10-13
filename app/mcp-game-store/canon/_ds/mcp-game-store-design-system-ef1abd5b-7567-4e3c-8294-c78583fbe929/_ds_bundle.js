/* @ds-bundle: {"format":4,"namespace":"MCPGameStoreDesignSystem_ef1abd","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"ButtonPair","sourcePath":"components/actions/Button.jsx"},{"name":"TextLink","sourcePath":"components/actions/TextLink.jsx"},{"name":"Loader","sourcePath":"components/feedback/Loader.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"StatusMessage","sourcePath":"components/feedback/StatusMessage.jsx"},{"name":"Tag","sourcePath":"components/feedback/Tag.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"TextField","sourcePath":"components/forms/TextField.jsx"},{"name":"SearchField","sourcePath":"components/forms/TextField.jsx"},{"name":"ChatPicture","sourcePath":"components/media/ChatPicture.jsx"},{"name":"Cover","sourcePath":"components/media/Cover.jsx"},{"name":"GameArt","sourcePath":"components/media/GameArt.jsx"},{"name":"ICON_NAMES","sourcePath":"components/media/Icon.jsx"},{"name":"Icon","sourcePath":"components/media/Icon.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"Heading","sourcePath":"components/surfaces/Card.jsx"},{"name":"CardRow","sourcePath":"components/surfaces/CardRow.jsx"},{"name":"Disclosure","sourcePath":"components/surfaces/Disclosure.jsx"},{"name":"FormCard","sourcePath":"components/surfaces/FormCard.jsx"},{"name":"GameCard","sourcePath":"components/surfaces/GameCard.jsx"},{"name":"GamePick","sourcePath":"components/surfaces/GamePick.jsx"},{"name":"GameTile","sourcePath":"components/surfaces/GameTile.jsx"},{"name":"RowList","sourcePath":"components/surfaces/ListRow.jsx"},{"name":"ListRow","sourcePath":"components/surfaces/ListRow.jsx"},{"name":"Menu","sourcePath":"components/surfaces/Menu.jsx"},{"name":"PageGrid","sourcePath":"components/surfaces/PageGrid.jsx"},{"name":"Popup","sourcePath":"components/surfaces/Popup.jsx"},{"name":"SoonCard","sourcePath":"components/surfaces/SoonCard.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"afd1c61a7153","components/actions/TextLink.jsx":"c27d39f10f18","components/feedback/Loader.jsx":"c73ab4148abc","components/feedback/ProgressBar.jsx":"4c208225b868","components/feedback/StatusMessage.jsx":"d26f3a1fef7e","components/feedback/Tag.jsx":"ff0c91ecf52b","components/forms/Checkbox.jsx":"855feb3266b9","components/forms/TextField.jsx":"b114099835d3","components/media/ChatPicture.jsx":"33f766ec48bc","components/media/Cover.jsx":"58ccd29ddc40","components/media/GameArt.jsx":"80ec58299013","components/media/Icon.jsx":"dc8ca13c049f","components/press.js":"4f94d27dbfac","components/surfaces/Card.jsx":"5866138b458a","components/surfaces/CardRow.jsx":"86df9ae7b395","components/surfaces/Disclosure.jsx":"e56f91fb306d","components/surfaces/FormCard.jsx":"8e545dcfdcb5","components/surfaces/GameCard.jsx":"303dd3f2749d","components/surfaces/GamePick.jsx":"5a1ada649278","components/surfaces/GameTile.jsx":"4ba7f7a3efd4","components/surfaces/ListRow.jsx":"47511f5f0d15","components/surfaces/Menu.jsx":"79e87747cff5","components/surfaces/PageGrid.jsx":"276b99e364b1","components/surfaces/Popup.jsx":"b35f2c8c8de7","components/surfaces/SoonCard.jsx":"f4eebe3c025b","docs/archive/rows-and-history/playground/rows.jsx":"9c8ccfd05b69","docs/specs/card-snug-title/playground/pg-card-snug-title.jsx":"bf863143ea04","docs/specs/card-snug-title/playground/pg-data.jsx":"4f51c4b5eb3d","ui_kits/shop/Screens.jsx":"c91dac80697e"},"inlinedExternals":[],"unexposedExports":[{"name":"usePress","sourcePath":"components/press.js"}]} */

(() => {

const __ds_ns = (window.MCPGameStoreDesignSystem_ef1abd = window.MCPGameStoreDesignSystem_ef1abd || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/feedback/Loader.jsx
try { (() => {
function Loader({
  size = 64,
  label = 'Loading'
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "mcp-loader",
    role: "status",
    "aria-label": label,
    style: {
      width: size,
      height: size
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mcp-loader-m",
    style: {
      zoom: size / 120
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "tl"
  }), /*#__PURE__*/React.createElement("i", {
    className: "tr"
  }), /*#__PURE__*/React.createElement("i", {
    className: "br"
  }), /*#__PURE__*/React.createElement("i", {
    className: "bl"
  })));
}
Object.assign(__ds_scope, { Loader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Loader.jsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.jsx
try { (() => {
function ProgressBar({
  label,
  value = 0,
  max = 100,
  showValue = true
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value / max * 100)));
  return /*#__PURE__*/React.createElement("div", {
    className: "mcp-prog"
  }, (label || showValue) && /*#__PURE__*/React.createElement("div", {
    className: "mcp-prog-top"
  }, /*#__PURE__*/React.createElement("span", null, label), showValue && /*#__PURE__*/React.createElement("span", null, pct, "%")), /*#__PURE__*/React.createElement("div", {
    className: "mcp-track",
    role: "progressbar",
    "aria-valuenow": pct,
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    "aria-label": label || 'Progress'
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: pct + '%'
    }
  })));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
  className = '',
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: ('mcp-check ' + className).trim()
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    checked: checked,
    defaultChecked: defaultChecked,
    onChange: onChange
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "mcp-box"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("g", {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.25",
    strokeLinecap: "square",
    strokeLinejoin: "miter"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4.5 12.5L9.5 17.5L19.5 6.5"
  })))), /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/media/Cover.jsx
try { (() => {
// The three example covers from the hand-off, verbatim. How shapes are assembled into a cover is not decided.
const ART = {
  'daily-puzzles': '<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"><rect width="100" height="100" fill="#1D1B3A"/><rect x="14" y="14" width="22" height="22" fill="#E5A63B"/><rect x="39" y="14" width="22" height="22" fill="#328A88"/><rect x="64" y="14" width="22" height="22" fill="#E5A63B"/><rect x="14" y="39" width="22" height="22" fill="#328A88"/><rect x="39" y="39" width="22" height="22" fill="#D66847"/><rect x="64" y="39" width="22" height="22" fill="#328A88"/><rect x="14" y="64" width="22" height="22" fill="#E5A63B"/><rect x="39" y="64" width="22" height="22" fill="#328A88"/><rect x="64" y="64" width="22" height="22" fill="#E5A63B"/></svg>',
  'daily-puzzles-diagonal': '<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"><rect width="100" height="100" fill="#1D1B3A"/><rect x="14" y="14" width="22" height="22" fill="#E5A63B"/><rect x="39" y="39" width="22" height="22" fill="#D66847"/><rect x="64" y="64" width="22" height="22" fill="#328A88"/></svg>',
  'weekly-interrogation': '<svg viewBox="0 0 171 108" preserveAspectRatio="xMidYMid slice"><rect width="171" height="108" fill="#421A28"/><circle cx="72" cy="54" r="36" fill="none" stroke="#D66847" stroke-width="14"/><rect x="104" y="20" width="14" height="68" fill="#F2EBE0"/><rect x="104" y="20" width="14" height="22" fill="#E5A63B"/></svg>',
  'dungeon-quest': '<svg viewBox="0 0 171 108" preserveAspectRatio="xMidYMid slice"><rect width="171" height="108" fill="#163328"/><path d="M20,108 L62,36 L104,108Z" fill="#E5A63B"/><path d="M66,108 L112,22 L158,108Z" fill="#A390B2"/><path d="M66,108 L85,72.5 L104,108Z" fill="#328A88"/></svg>',
  'dungeon-quest-single': '<svg viewBox="0 0 171 108" preserveAspectRatio="xMidYMid slice"><rect width="171" height="108" fill="#163328"/><path d="M66,108 L112,22 L158,108Z" fill="#A390B2"/></svg>'
};
// Each example declares its ground and how it extends (guidelines/game-art-motion.md "Extending a cover").
const META = {
  'daily-puzzles': ['indigo', 'centre'],
  'daily-puzzles-diagonal': ['indigo', 'centre'],
  'weekly-interrogation': ['wine', 'centre'],
  'dungeon-quest': ['forest', 'bottom'],
  'dungeon-quest-single': ['forest', 'bottom']
};
function Cover({
  name,
  art,
  src,
  children,
  onClick,
  fill = false,
  ground,
  extend,
  className = ''
}) {
  const m = META[art] || [];
  const g = ground || m[0] || 'indigo';
  const x = extend || m[1];
  if (fill && !x && typeof console !== 'undefined') console.warn('Cover: fill needs the asset to declare extend ("bottom" or "centre").');
  const cls = 'mcp-cover' + (fill ? ' is-fill is-' + g + ' from-' + (x || 'centre') : '') + (className ? ' ' + className : '');
  const inner = children ? children : src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: ""
  }) : ART[art] ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'contents'
    },
    dangerouslySetInnerHTML: {
      __html: ART[art]
    }
  }) : null;
  const Tag = onClick ? 'button' : 'figure';
  return /*#__PURE__*/React.createElement(Tag, {
    className: cls,
    onClick: onClick,
    type: onClick ? 'button' : undefined,
    style: onClick ? {
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer',
      textAlign: 'left',
      color: 'inherit',
      font: 'inherit'
    } : undefined
  }, !children && !src && ART[art] ? /*#__PURE__*/React.createElement("div", {
    className: "mcp-cover-art",
    "aria-hidden": "true",
    dangerouslySetInnerHTML: {
      __html: ART[art]
    }
  }) : /*#__PURE__*/React.createElement("div", {
    className: "mcp-cover-art",
    "aria-hidden": "true"
  }, inner), name && (onClick ? /*#__PURE__*/React.createElement("span", {
    className: "mcp-cover-name"
  }, name) : /*#__PURE__*/React.createElement("figcaption", {
    className: "mcp-cover-name"
  }, name)));
}
Object.assign(__ds_scope, { Cover });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/Cover.jsx", error: String((e && e.message) || e) }); }

// components/media/GameArt.jsx
try { (() => {
// Game art. It moves only as the hover, focus and press response of the link or button it sits in (a clickable Card, ListRow or Cover, or an <a href>/<button> with class mcp-art-host); anywhere else it is still. Rules and descriptions: guidelines/game-art-motion.md.
const dg = () => /*#__PURE__*/React.createElement("div", {
  className: "mcp-art-dg"
}, [0, 1, 2, 3].map(r => /*#__PURE__*/React.createElement("div", {
  key: r
}, [0, 1, 2, 3].map(c => /*#__PURE__*/React.createElement("b", {
  key: c,
  style: {
    '--s': (r + 3 - c) * 20
  }
})))));
const cb = () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
  className: "mcp-art-cb-bar mcp-art-cb-1"
}), /*#__PURE__*/React.createElement("i", {
  className: "mcp-art-cb-bar mcp-art-cb-2"
}), /*#__PURE__*/React.createElement("i", {
  className: "mcp-art-cb-bar mcp-art-cb-3"
}), /*#__PURE__*/React.createElement("i", {
  className: "mcp-art-cb-sun"
}));
const hu = () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
  className: "mcp-art-hu-sun"
}), /*#__PURE__*/React.createElement("i", {
  className: "mcp-art-hu-peak"
}), /*#__PURE__*/React.createElement("i", {
  className: "mcp-art-hu-teal"
}), /*#__PURE__*/React.createElement("i", {
  className: "mcp-art-hu-cream"
}));
const dm = () => /*#__PURE__*/React.createElement("div", {
  className: "mcp-art-st"
}, /*#__PURE__*/React.createElement("i", {
  className: "mcp-art-dm-ring"
}), /*#__PURE__*/React.createElement("i", {
  className: "mcp-art-dm-bar"
}), /*#__PURE__*/React.createElement("i", {
  className: "mcp-art-dm-cap"
}));
const dw = () => /*#__PURE__*/React.createElement("div", {
  className: "mcp-art-st"
}, /*#__PURE__*/React.createElement("i", {
  className: "mcp-art-dw mcp-art-dw-1"
}), /*#__PURE__*/React.createElement("i", {
  className: "mcp-art-dw mcp-art-dw-2"
}), /*#__PURE__*/React.createElement("i", {
  className: "mcp-art-dw mcp-art-dw-3"
}));
const PIECES = {
  groups: {
    body: dg
  },
  casebook: {
    body: cb
  },
  hunter: {
    body: hu,
    bg: 'forest'
  },
  mystery: {
    body: dm,
    bg: 'wine'
  },
  word: {
    body: dw,
    bg: 'forest'
  }
};
const RATIO = {
  square: 'mcp-art-1',
  landscape: 'mcp-art-43',
  wide: 'mcp-art-3'
};
function GameArt({
  art,
  shape = 'landscape',
  className = ''
}) {
  const p = PIECES[art];
  if (!p) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: ('mcp-art ' + RATIO[shape] + (p.bg ? ' is-' + p.bg + ' ' : ' ') + className).trim(),
    "aria-hidden": "true"
  }, p.body());
}
Object.assign(__ds_scope, { GameArt });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/GameArt.jsx", error: String((e && e.message) || e) }); }

// components/media/Icon.jsx
try { (() => {
const A = 'fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="miter"';
const LINE = {
  search: '<g ' + A + '><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></g>',
  back: '<g ' + A + '><path d="M20 12H5"/><path d="M11 5L4 12L11 19"/></g>',
  close: '<g ' + A + '><path d="M5 5L19 19M19 5L5 19"/></g>',
  lock: '<g ' + A + '><path d="M4.5 11H19.5V21H4.5Z"/><path d="M8 11V5H16V11"/><path d="M12 15V17"/></g>',
  play: '<g ' + A + '><path d="M7 4L19 12L7 20Z"/></g>',
  settings: '<g ' + A + '><path d="M4 6H11M17 6H20"/><path d="M4 12H6M12 12H20"/><path d="M4 18H13M19 18H20"/><path d="M11 4H17V8H11Z"/><path d="M6 10H12V14H6Z"/><path d="M13 16H19V20H13Z"/></g>',
  mail: '<g ' + A + '><path d="M3 5.5H21V18.5H3Z"/><path d="M3.5 6.5L12 13L20.5 6.5"/></g>',
  logout: '<g ' + A + '><path d="M10 4H4V20H10"/><path d="M15 8L19 12L15 16"/><path d="M19 12H9"/></g>',
  card: '<g ' + A + '><path d="M2.5 5.5H21.5V18.5H2.5Z"/><path d="M2.5 10H21.5"/><path d="M6 15H10"/></g>'
};
const UI = {
  check: '<g fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="square" stroke-linejoin="miter"><path d="M4.5 12.5L9.5 17.5L19.5 6.5"/></g>',
  warn: '<g ' + A + '><path d="M12 3L22 20H2Z"/><path d="M12 10V14M12 16.5V17.5"/></g>',
  error: '<g ' + A + '><circle cx="12" cy="12" r="9"/><path d="M12 7V13M12 16V17"/></g>',
  down: '<g ' + A + '><path d="M5 9L12 16L19 9"/></g>',
  send: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5"/></g>',
  next: '<g ' + A + '><path d="M9 5L16 12L9 19"/></g>'
};
const ICON_NAMES = [...Object.keys(LINE), ...Object.keys(UI)];
function Icon({
  name,
  size = 20,
  className = '',
  style,
  label
}) {
  const body = UI[name] || LINE[name];
  if (!body) return null;
  return /*#__PURE__*/React.createElement("svg", {
    className: ('mcp-ico ' + className).trim(),
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    style: {
      width: size,
      height: size,
      ...style
    },
    role: label ? 'img' : undefined,
    "aria-label": label,
    "aria-hidden": label ? undefined : true,
    focusable: "false",
    dangerouslySetInnerHTML: {
      __html: body
    }
  });
}
Object.assign(__ds_scope, { ICON_NAMES, Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/Icon.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StatusMessage.jsx
try { (() => {
const G = {
  success: 'check',
  warning: 'warn',
  error: 'error'
};
function StatusMessage({
  kind = 'success',
  children
}) {
  return /*#__PURE__*/React.createElement("p", {
    className: 'mcp-msg mcp-msg-' + kind,
    role: kind === 'error' ? 'alert' : 'status'
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: G[kind]
  }), /*#__PURE__*/React.createElement("span", null, children));
}
Object.assign(__ds_scope, { StatusMessage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StatusMessage.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tag.jsx
try { (() => {
function Tag({
  kind = 'daily',
  children,
  icon,
  go
}) {
  const ic = icon || (kind === 'locked' ? 'lock' : null);
  const g = go ?? (kind === 'locked' || kind === 'open');
  return /*#__PURE__*/React.createElement("span", {
    className: 'mcp-tag mcp-tag-' + kind + (g ? ' has-go' : '')
  }, ic && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ic,
    size: 14
  }), children, g && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "next",
    size: 14,
    className: "mcp-tag-go"
  }));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextField.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function TextField({
  label,
  id,
  error,
  hint,
  type = 'text',
  value,
  defaultValue,
  placeholder,
  onChange,
  inputRef,
  autoComplete,
  className = '',
  ...rest
}) {
  const auto = React.useId ? React.useId() : 'f';
  const fid = id || 'mcp-' + auto;
  const eid = fid + '-err';
  return /*#__PURE__*/React.createElement("div", {
    className: ('mcp-fld ' + className).trim()
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fid
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    ref: inputRef,
    className: 'mcp-in' + (error ? ' is-bad' : ''),
    id: fid,
    type: type,
    value: value,
    defaultValue: defaultValue,
    placeholder: placeholder,
    onChange: onChange,
    autoComplete: autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? eid : undefined
  }, rest)), error && /*#__PURE__*/React.createElement("span", {
    className: "mcp-fmsg",
    id: eid
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "error"
  }), error), hint && !error && /*#__PURE__*/React.createElement("span", {
    className: "mcp-hint"
  }, hint));
}
function SearchField({
  label,
  id,
  placeholder = 'Find a game',
  value,
  onChange,
  className = '',
  ...rest
}) {
  const auto = React.useId ? React.useId() : 's';
  const fid = id || 'mcp-' + auto;
  return /*#__PURE__*/React.createElement("div", {
    className: ('mcp-fld ' + className).trim()
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fid
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "mcp-srch"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "search"
  }), /*#__PURE__*/React.createElement("input", _extends({
    className: "mcp-in",
    id: fid,
    type: "search",
    placeholder: placeholder,
    value: value,
    onChange: onChange,
    "aria-label": label ? undefined : placeholder
  }, rest))));
}
Object.assign(__ds_scope, { TextField, SearchField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextField.jsx", error: String((e && e.message) || e) }); }

// components/media/ChatPicture.jsx
try { (() => {
const WHO = {
  x: 'not in the word',
  y: 'in the word',
  g: 'right spot'
};
function Tiles({
  rows
}) {
  const label = rows.map(r => r.word + ': ' + r.marks.split('').map((m, i) => r.word[i] + ' ' + WHO[m]).join(', ')).join('. ');
  return /*#__PURE__*/React.createElement("div", {
    className: "mcp-chat-board",
    role: "img",
    "aria-label": label
  }, rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "mcp-chat-row"
  }, r.word.split('').map((c, k) => /*#__PURE__*/React.createElement("span", {
    key: k,
    className: 'is-' + r.marks[k]
  }, c)))));
}
function Block({
  b
}) {
  if (b.type === 'tiles') return /*#__PURE__*/React.createElement(Tiles, {
    rows: b.rows
  });
  if (b.type === 'list') return /*#__PURE__*/React.createElement("ul", {
    className: "mcp-chat-list"
  }, b.items.map((t, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, t)));
  if (b.type === 'mono') return /*#__PURE__*/React.createElement("pre", {
    className: "mcp-chat-mono"
  }, b.text);
  return null;
}
const paras = t => t == null ? [] : Array.isArray(t) ? t : [t];
// Opens on the latest turn and scrolls back to the first. Once scrolled up, the top fades and the pill takes you back to the start.
// Stays at the latest turn while it lays out, until the reader scrolls it themselves.
function useChatScroll(body, turns) {
  const [up, setUp] = React.useState(false);
  React.useEffect(() => {
    const b = body.current;
    if (!b) return undefined;
    let moved = false;
    const mark = () => {
      const u = b.scrollTop > 4;
      b.dataset.more = u ? 'up' : '';
      setUp(u);
    };
    const end = () => {
      if (!moved) b.scrollTop = b.scrollHeight;
      mark();
    };
    const stop = () => {
      moved = true;
    };
    b.addEventListener('scroll', mark, {
      passive: true
    });
    ['wheel', 'touchstart', 'keydown'].forEach(t => b.addEventListener(t, stop, {
      passive: true
    }));
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(end) : null;
    if (ro) {
      ro.observe(b);
      [...b.children].forEach(c => ro.observe(c));
    }
    end();
    const t = setTimeout(end, 600);
    return () => {
      clearTimeout(t);
      if (ro) ro.disconnect();
      b.removeEventListener('scroll', mark);
      ['wheel', 'touchstart', 'keydown'].forEach(t => b.removeEventListener(t, stop));
    };
  }, [turns]);
  const toStart = () => {
    const b = body.current;
    if (b) b.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  };
  return [up, toStart];
}
function ChatPicture({
  turns,
  title,
  toolBy,
  mark,
  height = 290,
  width = 360,
  fill = false,
  composer = true,
  placeholder = 'Reply',
  label,
  more = 'Back to the start',
  className = ''
}) {
  const body = React.useRef(null);
  const [up, toStart] = useChatScroll(body, turns);
  const name = label || 'A game being played in a chat';
  return /*#__PURE__*/React.createElement("div", {
    className: ('mcp-chat' + (fill ? ' is-fill' : '') + ' ' + className).trim(),
    style: fill ? undefined : {
      width: 'min(100%,' + width + 'px)'
    },
    role: "group",
    "aria-label": name
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "mcp-chat-head"
  }, title), /*#__PURE__*/React.createElement("div", {
    ref: body,
    className: "mcp-chat-body",
    style: fill ? undefined : {
      height
    },
    tabIndex: 0,
    role: "region",
    "aria-label": name + ', scrolls'
  }, turns.map((t, i) => t.from === 'user' ? /*#__PURE__*/React.createElement("p", {
    key: i,
    className: "mcp-chat-me"
  }, paras(t.text)) : /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "mcp-chat-ai"
  }, t.tool && /*#__PURE__*/React.createElement("span", {
    className: "mcp-chat-call"
  }, mark && /*#__PURE__*/React.createElement("img", {
    src: mark,
    alt: "",
    width: "16",
    height: "16"
  }), "Called ", t.tool, toolBy && /*#__PURE__*/React.createElement("em", null, toolBy)), (t.blocks || []).map((b, k) => /*#__PURE__*/React.createElement(Block, {
    key: k,
    b: b
  })), paras(t.text).map((p, k) => /*#__PURE__*/React.createElement("p", {
    key: k
  }, p))))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "mcp-chat-up",
    hidden: !up,
    onClick: toStart,
    "aria-label": more
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "down",
    size: 16,
    style: {
      transform: 'rotate(180deg)'
    }
  })), composer && /*#__PURE__*/React.createElement("div", {
    className: "mcp-chat-comp",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", null, placeholder), /*#__PURE__*/React.createElement("i", null, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "send",
    size: 16
  }))));
}
Object.assign(__ds_scope, { ChatPicture });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/ChatPicture.jsx", error: String((e && e.message) || e) }); }

// components/press.js
try { (() => {
// Holds the pressed look for at least 120ms so a quick tap still shows it (from the hand-off).
function usePress() {
  const [pressed, setPressed] = React.useState(false);
  const t = React.useRef(0);
  const down = () => {
    t.current = Date.now();
    setPressed(true);
  };
  const up = () => {
    setTimeout(() => setPressed(false), Math.max(0, 120 - (Date.now() - t.current)));
  };
  return {
    pressed,
    handlers: {
      onPointerDown: down,
      onPointerUp: up,
      onPointerCancel: up,
      onPointerLeave: up
    }
  };
}
Object.assign(__ds_scope, { usePress });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/press.js", error: String((e && e.message) || e) }); }

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Working state: shows at once (a receipt for the press), then holds at least `min` ms so it never flickers.
function useHeld(on, min) {
  const [held, setHeld] = React.useState(on);
  const t0 = React.useRef(on ? Date.now() : 0);
  React.useEffect(() => {
    if (on) {
      t0.current = Date.now();
      setHeld(true);
      return;
    }
    const left = min - (Date.now() - t0.current);
    if (left <= 0) {
      setHeld(false);
      return;
    }
    const id = setTimeout(() => setHeld(false), left);
    return () => clearTimeout(id);
  }, [on]);
  return on || held;
}
function Button({
  variant = 'main',
  children,
  loading = false,
  loadingLabel,
  done = false,
  doneLabel,
  disabled = false,
  block = false,
  icon,
  type = 'button',
  onClick,
  className = '',
  ...rest
}) {
  const {
    pressed,
    handlers
  } = __ds_scope.usePress();
  const [auto, setAuto] = React.useState(false);
  const alive = React.useRef(true);
  React.useEffect(() => () => {
    alive.current = false;
  }, []);
  const busy = useHeld(loading || auto, 400);
  const click = e => {
    if (busy) {
      e.preventDefault();
      return;
    }
    const r = onClick && onClick(e);
    if (r && typeof r.then === 'function') {
      setAuto(true);
      const end = () => {
        alive.current && setAuto(false);
      };
      r.then(end, end);
    }
  };
  const v = variant === 'secondary' ? 'mcp-btn-secondary' : variant === 'danger' ? 'mcp-btn-danger' : 'mcp-btn-main';
  const cls = ['mcp-btn', v, block && 'is-block', pressed && !disabled && !busy && 'is-pressed', busy && 'is-busy', done && !busy && 'is-done', className].filter(Boolean).join(' ');
  let content;
  if (busy) content = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "mcp-spin",
    "aria-hidden": "true"
  }), loadingLabel || children);else if (doneLabel !== undefined) content = /*#__PURE__*/React.createElement("span", {
    className: "mcp-swap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "a"
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon
  }), children), /*#__PURE__*/React.createElement("span", {
    className: "b",
    "aria-hidden": !done
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check"
  }), doneLabel));else content = /*#__PURE__*/React.createElement(React.Fragment, null, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon
  }), children);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    className: cls,
    disabled: disabled,
    "aria-busy": busy || undefined,
    "aria-disabled": busy || undefined,
    onClick: click
  }, handlers, rest), content);
}
function ButtonPair({
  children,
  className = ''
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ('mcp-btn-pair ' + className).trim()
  }, children);
}
Object.assign(__ds_scope, { Button, ButtonPair });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/TextLink.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function TextLink({
  children,
  danger = false,
  href,
  onClick,
  className = '',
  ...rest
}) {
  const {
    pressed,
    handlers
  } = __ds_scope.usePress();
  const cls = ['mcp-lnk', danger && 'is-danger', pressed && 'is-pressed', className].filter(Boolean).join(' ');
  if (href) return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    className: cls,
    onClick: onClick
  }, handlers, rest), children);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: cls,
    onClick: onClick
  }, handlers, rest), children);
}
Object.assign(__ds_scope, { TextLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/TextLink.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  title,
  action,
  children,
  className = '',
  style,
  href,
  onClick,
  label,
  chevron = true
}) {
  const {
    pressed,
    handlers
  } = __ds_scope.usePress();
  const live = !!(href || onClick);
  if (!live) {
    const head = action ? /*#__PURE__*/React.createElement("div", {
      className: "mcp-card-head"
    }, title ? /*#__PURE__*/React.createElement("h3", {
      className: "mcp-t-card"
    }, title) : /*#__PURE__*/React.createElement("span", null), action) : title && /*#__PURE__*/React.createElement("h3", {
      className: "mcp-t-card"
    }, title);
    return /*#__PURE__*/React.createElement("div", {
      className: ('mcp-card ' + className).trim(),
      style: style
    }, head, children);
  }
  const cls = ('mcp-card is-link' + (chevron ? '' : ' no-go') + (pressed ? ' is-pressed' : '') + ' ' + className).trim();
  const inner = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "mcp-card-body"
  }, title && /*#__PURE__*/React.createElement("h3", {
    className: "mcp-t-card"
  }, title), children), chevron && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "next",
    size: 20,
    className: "mcp-card-go"
  }));
  return href ? /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    onClick: onClick,
    className: cls,
    style: style,
    "aria-label": label
  }, handlers), inner) : /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    className: cls,
    style: style,
    "aria-label": label
  }, handlers), inner);
}
function Heading({
  level = 'card',
  children,
  as
}) {
  const map = {
    page: ['h1', 'mcp-t-page'],
    section: ['h2', 'mcp-t-sec'],
    card: ['h3', 'mcp-t-card']
  };
  const [tag, cls] = map[level] || map.card;
  const T = as || tag;
  return /*#__PURE__*/React.createElement(T, {
    className: cls
  }, children);
}
Object.assign(__ds_scope, { Card, Heading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/CardRow.jsx
try { (() => {
// A row of cards that scrolls sideways when they don't fit. Previous and Next sit on the heading's line, only while the row overflows.
function CardRow({
  title,
  sub,
  label,
  as = 'h2',
  kind = 'cards',
  children,
  className = ''
}) {
  const ref = React.useRef(null),
    prev = React.useRef(null),
    next = React.useRef(null),
    pressed = React.useRef(null);
  const [at, setAt] = React.useState({
    over: false,
    start: true,
    end: true
  });
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const read = () => {
      const over = el.scrollWidth > el.clientWidth + 1,
        start = el.scrollLeft <= 1,
        end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      setAt(a => a.over === over && a.start === start && a.end === end ? a : {
        over,
        start,
        end
      });
    };
    read();
    el.addEventListener('scroll', read, {
      passive: true
    });
    const ro = window.ResizeObserver ? new ResizeObserver(read) : null;
    if (ro) ro.observe(el);
    return () => {
      el.removeEventListener('scroll', read);
      if (ro) ro.disconnect();
    };
  }, []);
  // A button that reaches its end hides; focus moves to the other one.
  React.useEffect(() => {
    if (pressed.current === 'next' && at.end && prev.current) {
      prev.current.focus({
        preventScroll: true
      });
      pressed.current = 'prev';
    } else if (pressed.current === 'prev' && at.start && next.current) {
      next.current.focus({
        preventScroll: true
      });
      pressed.current = 'next';
    }
  }, [at.start, at.end]);
  const move = d => {
    const el = ref.current;
    if (!el) return;
    pressed.current = d > 0 ? 'next' : 'prev';
    const c = el.firstElementChild,
      gap = parseFloat(getComputedStyle(el).columnGap) || 24,
      step = c ? c.getBoundingClientRect().width + gap : el.clientWidth * .8;
    const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({
      left: d * step,
      behavior: still ? 'auto' : 'smooth'
    });
  };
  const T = as,
    name = label || (typeof title === 'string' ? title : 'Cards'),
    n = React.Children.count(children);
  return /*#__PURE__*/React.createElement("div", {
    className: ('mcp-crow' + (kind === 'chat' ? ' is-chat' : '') + ' ' + className).trim()
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcp-crow-head"
  }, /*#__PURE__*/React.createElement(T, {
    className: "mcp-t-sec mcp-crow-title"
  }, title), at.over && /*#__PURE__*/React.createElement("div", {
    className: "mcp-crow-nav"
  }, /*#__PURE__*/React.createElement("button", {
    ref: prev,
    type: "button",
    className: "mcp-crow-btn",
    "aria-label": 'Previous, ' + name,
    style: at.start ? {
      visibility: 'hidden'
    } : null,
    onClick: () => move(-1)
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "next",
    style: {
      transform: 'rotate(180deg)'
    }
  })), /*#__PURE__*/React.createElement("button", {
    ref: next,
    type: "button",
    className: "mcp-crow-btn",
    "aria-label": 'Next, ' + name,
    style: at.end ? {
      visibility: 'hidden'
    } : null,
    onClick: () => move(1)
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "next"
  }))), sub && /*#__PURE__*/React.createElement("p", {
    className: "mcp-crow-sub"
  }, sub)), /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "mcp-crow-track",
    role: "region",
    "aria-label": name,
    tabIndex: 0,
    style: {
      '--n': n
    }
  }, children));
}
Object.assign(__ds_scope, { CardRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/CardRow.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Disclosure.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Disclosure({
  title,
  children,
  defaultOpen = false
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const {
    pressed,
    handlers
  } = __ds_scope.usePress();
  const id = (React.useId ? React.useId() : 'd') + '-body';
  return /*#__PURE__*/React.createElement("div", {
    className: "mcp-disc"
  }, /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: 'mcp-disc-btn' + (pressed ? ' is-pressed' : ''),
    "aria-expanded": open,
    "aria-controls": id,
    onClick: () => setOpen(o => !o)
  }, handlers), /*#__PURE__*/React.createElement("span", null, title), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "down"
  })), /*#__PURE__*/React.createElement("div", {
    className: 'mcp-disc-body' + (open ? ' is-open' : ''),
    id: id
  }, /*#__PURE__*/React.createElement("div", null, typeof children === 'string' ? /*#__PURE__*/React.createElement("p", null, children) : children)));
}
Object.assign(__ds_scope, { Disclosure });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Disclosure.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/FormCard.jsx
try { (() => {
function FormCard({
  title,
  children,
  className = '',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ('mcp-panel ' + className).trim(),
    style: style
  }, /*#__PURE__*/React.createElement("svg", {
    className: "mcp-deco",
    viewBox: "0 0 120 76",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "84",
    y: "0",
    width: "36",
    height: "44",
    fill: "#328A88"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "56",
    y: "0",
    width: "28",
    height: "28",
    fill: "#EDE8DF"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "102",
    cy: "58",
    r: "12",
    fill: "#E5A63B"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mcp-panel-in"
  }, title && /*#__PURE__*/React.createElement("h3", {
    className: "mcp-t-card"
  }, title), children));
}
Object.assign(__ds_scope, { FormCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/FormCard.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/GameCard.jsx
try { (() => {
// The one game card: picture, name, blurb, tags, always in that order and always all four slots. Works anywhere.
// Name and blurb sit snug under the picture; tags rest on the card's bottom edge. Cards in a CardRow stretch to one height.
function GameCard({
  art,
  title,
  mark,
  blurb,
  tags,
  className = '',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ('mcp-card mcp-gcard ' + className).trim(),
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcp-gcard-art"
  }, art), /*#__PURE__*/React.createElement("div", {
    className: "mcp-gcard-name"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "mcp-t-card"
  }, title), mark), /*#__PURE__*/React.createElement("p", {
    className: "mcp-gcard-blurb"
  }, blurb), /*#__PURE__*/React.createElement("div", {
    className: "mcp-gcard-tags"
  }, tags));
}
Object.assign(__ds_scope, { GameCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/GameCard.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/GamePick.jsx
try { (() => {
// One of Discover's two picks: a featured game. A 3:1 picture, a label, the name and blurb, tags. Two side by side in .mcp-gpicks line up.
function GamePick({
  art,
  label,
  title,
  blurb,
  tags,
  className = '',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ('mcp-card mcp-gpick ' + className).trim(),
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcp-gpick-art"
  }, art), /*#__PURE__*/React.createElement("div", {
    className: "mcp-gpick-text"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mcp-gpick-label"
  }, label), /*#__PURE__*/React.createElement("h3", {
    className: "mcp-t-card"
  }, title), /*#__PURE__*/React.createElement("p", {
    className: "mcp-gpick-blurb"
  }, blurb)), /*#__PURE__*/React.createElement("div", {
    className: "mcp-gpick-tags"
  }, tags));
}
Object.assign(__ds_scope, { GamePick });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/GamePick.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/GameTile.jsx
try { (() => {
// A game tile for the all-games wall: square picture, name and kind. Smaller and plainer than a GameCard, for scanning and searching the whole catalogue.
function GameTile({
  art,
  title,
  kind,
  className = '',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ('mcp-gtile ' + className).trim(),
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcp-gtile-art"
  }, art), /*#__PURE__*/React.createElement("span", {
    className: "mcp-gtile-name"
  }, title), kind && /*#__PURE__*/React.createElement("span", {
    className: "mcp-gtile-kind"
  }, kind));
}
Object.assign(__ds_scope, { GameTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/GameTile.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/ListRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function RowList({
  children,
  label,
  className = ''
}) {
  return /*#__PURE__*/React.createElement("ul", {
    className: ('mcp-rows ' + className).trim(),
    "aria-label": label
  }, React.Children.map(children, (c, i) => c && /*#__PURE__*/React.createElement("li", {
    key: i
  }, c)));
}
function ListRow({
  title,
  lead,
  result,
  tone = 'none',
  when,
  note,
  meta,
  end,
  sub = false,
  href,
  onClick,
  label,
  muted = false,
  className = ''
}) {
  const {
    pressed,
    handlers
  } = __ds_scope.usePress();
  const live = !!(href || onClick);
  const slots = sub || result != null || when != null || note != null;
  const hasLead = !!lead && !sub;
  const cls = ('mcp-row' + (live ? ' is-link' : '') + (end != null && !sub ? ' has-end' : '') + (hasLead ? ' has-lead' : '') + (slots ? ' is-slots' : '') + (slots && !sub && note == null ? ' no-note' : '') + (sub ? ' is-sub' : '') + (muted ? ' is-muted' : '') + (pressed ? ' is-pressed' : '') + ' ' + className).trim();
  const go = live ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "next",
    size: 20,
    className: "mcp-row-go"
  }) : /*#__PURE__*/React.createElement("span", {
    className: "mcp-row-go",
    "aria-hidden": "true"
  });
  const leadEl = hasLead && /*#__PURE__*/React.createElement("span", {
    className: "mcp-row-lead",
    "aria-hidden": "true"
  }, lead);
  const endEl = end != null && !sub && /*#__PURE__*/React.createElement("span", {
    className: "mcp-row-end"
  }, end);
  const icon = tone === 'ok' ? 'check' : tone === 'bad' ? 'error' : null;
  const inner = slots ? /*#__PURE__*/React.createElement(React.Fragment, null, leadEl, !sub && /*#__PURE__*/React.createElement("span", {
    className: "mcp-row-title"
  }, title), result != null && /*#__PURE__*/React.createElement("span", {
    className: 'mcp-row-st is-' + tone
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  }), /*#__PURE__*/React.createElement("span", null, result)), when != null && /*#__PURE__*/React.createElement("span", {
    className: "mcp-row-when"
  }, when), note != null && /*#__PURE__*/React.createElement("span", {
    className: "mcp-row-note"
  }, note), endEl, go) : /*#__PURE__*/React.createElement(React.Fragment, null, leadEl, /*#__PURE__*/React.createElement("span", {
    className: "mcp-row-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mcp-row-title"
  }, title), meta && /*#__PURE__*/React.createElement("span", {
    className: "mcp-row-meta"
  }, meta)), endEl, go);
  if (!live) return /*#__PURE__*/React.createElement("div", {
    className: cls
  }, inner);
  return href ? /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    onClick: onClick,
    className: cls,
    "aria-label": label
  }, handlers), inner) : /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    className: cls,
    "aria-label": label
  }, handlers), inner);
}
Object.assign(__ds_scope, { RowList, ListRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/ListRow.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Menu.jsx
try { (() => {
function Menu({
  trigger,
  items = [],
  label,
  align = 'start',
  placement = 'below',
  defaultOpen = false
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const wrap = React.useRef(null),
    list = React.useRef(null),
    byUser = React.useRef(false);
  const id = React.useId();
  const opener = () => wrap.current && wrap.current.querySelector('[aria-haspopup]');
  const close = restore => {
    setOpen(false);
    if (restore) {
      const o = opener();
      o && o.focus({
        preventScroll: true
      });
    }
  };
  React.useEffect(() => {
    if (!open) return;
    let t;
    if (byUser.current) {
      t = setTimeout(() => {
        const b = list.current && list.current.querySelector('[role=menuitem]');
        b && b.focus({
          preventScroll: true
        });
      }, 20);
    }
    const out = e => {
      if (wrap.current && !wrap.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', out);
    return () => {
      clearTimeout(t);
      document.removeEventListener('pointerdown', out);
    };
  }, [open]);
  const key = e => {
    const bs = [...list.current.querySelectorAll('[role=menuitem]')];
    const i = bs.indexOf(document.activeElement);
    const go = n => {
      e.preventDefault();
      bs[(n + bs.length) % bs.length].focus();
    };
    if (e.key === 'Escape') {
      e.preventDefault();
      close(true);
    } else if (e.key === 'ArrowDown') go(i + 1);else if (e.key === 'ArrowUp') go(i - 1);else if (e.key === 'Home') go(0);else if (e.key === 'End') go(bs.length - 1);else if (e.key === 'Tab') setOpen(false);
  };
  const t = React.cloneElement(trigger, {
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': id,
    onClick: e => {
      byUser.current = true;
      setOpen(o => !o);
      trigger.props.onClick && trigger.props.onClick(e);
    }
  });
  return /*#__PURE__*/React.createElement("span", {
    className: "mcp-menu-wrap",
    ref: wrap
  }, t, /*#__PURE__*/React.createElement("div", {
    id: id,
    ref: list,
    role: "menu",
    "aria-label": label,
    onKeyDown: key,
    className: 'mcp-menu' + (align === 'end' ? ' is-end' : '') + (placement === 'above' ? ' is-up' : '') + (open ? ' is-open' : '')
  }, items.map((it, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    type: "button",
    role: "menuitem",
    tabIndex: -1,
    className: 'mcp-menu-item' + (it.danger ? ' is-danger' : ''),
    onClick: () => {
      close(true);
      it.onSelect && it.onSelect();
    }
  }, it.icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: it.icon
  }), it.label))));
}
Object.assign(__ds_scope, { Menu });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Menu.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/PageGrid.jsx
try { (() => {
function PageGrid({
  children,
  split = 'main',
  className = '',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mcp-pgrid-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: ('mcp-pgrid is-' + split + ' ' + className).trim(),
    style: style
  }, children));
}
Object.assign(__ds_scope, { PageGrid });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/PageGrid.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Popup.jsx
try { (() => {
function useWide(bp) {
  const q = '(min-width:' + bp + 'px)';
  const get = () => typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(q).matches : true;
  const [w, setW] = React.useState(get);
  React.useEffect(() => {
    if (!window.matchMedia) return;
    const m = window.matchMedia(q);
    const f = () => setW(m.matches);
    f();
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, [q]);
  return w;
}
function Popup({
  open,
  onClose,
  title,
  children,
  actions,
  kind = 'dialog',
  posture = 'auto',
  breakpoint = 640,
  contained = false,
  busy = false,
  label
}) {
  const wide = useWide(breakpoint);
  const panel = kind === 'panel';
  const mode = !panel ? 'window' : posture === 'auto' ? wide ? 'window' : 'sheet' : posture;
  const ref = React.useRef(null);
  const opener = React.useRef(null);
  const dismiss = React.useRef(null);
  dismiss.current = () => {
    if (!busy && onClose) onClose();
  };
  React.useEffect(() => {
    if (open) {
      opener.current = document.activeElement;
      const t = setTimeout(() => {
        const b = ref.current && ref.current.querySelector('button,[href],input,select,textarea');
        b && b.focus({
          preventScroll: true
        });
      }, 30);
      const k = e => {
        if (e.key === 'Escape') dismiss.current();
      };
      document.addEventListener('keydown', k);
      return () => {
        clearTimeout(t);
        document.removeEventListener('keydown', k);
      };
    } else if (opener.current && opener.current.focus) {
      opener.current.focus({
        preventScroll: true
      });
      opener.current = null;
    }
  }, [open]);
  return /*#__PURE__*/React.createElement("div", {
    className: 'mcp-layer' + (contained ? ' is-contained' : '') + (open ? ' is-open' : ''),
    "aria-hidden": !open
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcp-dim",
    onClick: () => dismiss.current()
  }), /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: 'mcp-pop is-' + mode + ' is-' + (panel ? 'panel' : 'dialog'),
    role: panel ? 'dialog' : 'alertdialog',
    "aria-modal": "true",
    "aria-label": label || title,
    "aria-busy": busy || undefined
  }, title && /*#__PURE__*/React.createElement("h3", {
    className: "mcp-t-card"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "mcp-pop-body"
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    className: "mcp-btn-pair"
  }, actions)));
}
Object.assign(__ds_scope, { Popup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Popup.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/SoonCard.jsx
try { (() => {
// A game, or a game's next chapter, that is not out yet. Cover beside label, name, line, the Coming soon chip.
// The card is not a way in. A chapter of a game that is out adds one pressable chip (Play chapter 1) after Coming soon, on the same row; it wraps under only when the row is too narrow.
function SoonCard({
  art,
  label,
  title,
  line,
  play,
  onPlay,
  playHref,
  className = '',
  style
}) {
  const P = playHref ? 'a' : 'button';
  return /*#__PURE__*/React.createElement("div", {
    className: ('mcp-card mcp-soon ' + className).trim(),
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "mcp-soon-art"
  }, art), /*#__PURE__*/React.createElement("div", {
    className: "mcp-soon-body"
  }, label && /*#__PURE__*/React.createElement("span", {
    className: "mcp-soon-label"
  }, label), /*#__PURE__*/React.createElement("h3", {
    className: "mcp-t-card"
  }, title), line && /*#__PURE__*/React.createElement("p", {
    className: "mcp-soon-line"
  }, line), /*#__PURE__*/React.createElement("div", {
    className: "mcp-soon-tags"
  }, /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    kind: "daily"
  }, "Coming soon"), play && /*#__PURE__*/React.createElement(P, {
    className: "mcp-soon-play",
    href: playHref,
    type: playHref ? undefined : 'button',
    onClick: onPlay
  }, /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    kind: "open",
    icon: "play"
  }, play)))));
}
Object.assign(__ds_scope, { SoonCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/SoonCard.jsx", error: String((e && e.message) || e) }); }

// docs/archive/rows-and-history/playground/rows.jsx
try { (() => {
// Rows proposal: seed, the product's rows as they render today (Before), the proposed rows (After), and the scaled frame.
const DSX = window.MCPGameStoreDesignSystem_ef1abd;
const {
  Icon,
  Tag,
  TextLink,
  SearchField,
  Button
} = DSX;

// ---- Frame: renders children at a fixed design width, scaled down to fit ----
function Frame({
  w,
  label,
  children,
  grow
}) {
  const outer = React.useRef(null);
  const inner = React.useRef(null);
  const [s, setS] = React.useState(1);
  const [h, setH] = React.useState(0);
  React.useLayoutEffect(() => {
    const fit = () => {
      const sc = Math.min(1, outer.current.clientWidth / w);
      setS(sc);
      setH(inner.current.offsetHeight * sc);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(outer.current);
    ro.observe(inner.current);
    return () => ro.disconnect();
  }, [w]);
  return /*#__PURE__*/React.createElement("figure", {
    className: 'fr' + (grow ? ' is-grow' : ''),
    style: {
      flexBasis: grow ? 600 : w
    }
  }, /*#__PURE__*/React.createElement("figcaption", {
    className: "fr-cap"
  }, label, s < 1 && /*#__PURE__*/React.createElement("span", {
    className: "fr-scale"
  }, ' · shown at ' + Math.round(s * 100) + '%')), /*#__PURE__*/React.createElement("div", {
    ref: outer,
    className: "fr-box",
    style: {
      height: h
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: inner,
    style: {
      width: w,
      transform: 'scale(' + s + ')',
      transformOrigin: '0 0'
    }
  }, children)));
}

// ---- Seed ----
const G = {
  word: {
    name: 'Daily Word',
    bg: 'wine',
    ink: 'amber',
    sh: 'sq'
  },
  groups: {
    name: 'Daily Groups',
    bg: 'forest',
    ink: 'teal',
    sh: 'sq4'
  },
  mystery: {
    name: 'Daily Mystery',
    bg: 'indigo',
    ink: 'orange',
    sh: 'ci'
  },
  escape: {
    name: 'Escape',
    bg: 'forest',
    ink: 'amber',
    sh: 'door'
  },
  casebook: {
    name: 'Casebook',
    bg: 'indigo',
    ink: 'amber',
    sh: 'bars'
  },
  delve: {
    name: 'Delve',
    bg: 'wine',
    ink: 'lilac',
    sh: 'door'
  }
};
const Cov = ({
  gid,
  cls
}) => {
  const g = G[gid];
  const f = {
    fill: 'var(--cover-' + g.ink + ')'
  };
  const shape = g.sh === 'ci' ? /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "18",
    r: "10",
    style: f
  }) : g.sh === 'door' ? /*#__PURE__*/React.createElement("rect", {
    x: "18",
    y: "8",
    width: "12",
    height: "28",
    style: f
  }) : g.sh === 'bars' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "12",
    y: "14",
    width: "6",
    height: "22",
    style: f
  }), /*#__PURE__*/React.createElement("rect", {
    x: "22",
    y: "8",
    width: "6",
    height: "28",
    style: f
  }), /*#__PURE__*/React.createElement("rect", {
    x: "32",
    y: "18",
    width: "6",
    height: "18",
    style: f
  })) : g.sh === 'sq4' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "12",
    y: "8",
    width: "10",
    height: "10",
    style: f
  }), /*#__PURE__*/React.createElement("rect", {
    x: "26",
    y: "8",
    width: "10",
    height: "10",
    style: {
      fill: 'var(--cover-cream)'
    }
  }), /*#__PURE__*/React.createElement("rect", {
    x: "12",
    y: "20",
    width: "10",
    height: "10",
    style: {
      fill: 'var(--cover-cream)'
    }
  }), /*#__PURE__*/React.createElement("rect", {
    x: "26",
    y: "20",
    width: "10",
    height: "10",
    style: f
  })) : /*#__PURE__*/React.createElement("rect", {
    x: "16",
    y: "10",
    width: "16",
    height: "16",
    style: f
  });
  return /*#__PURE__*/React.createElement("span", {
    className: cls,
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 48 36"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "48",
    height: "36",
    style: {
      fill: 'var(--cover-bg-' + g.bg + ')'
    }
  }), shape));
};
// A play: gid, ed (number for the dailies, a title otherwise), short (the list's word today), full (the record's result), k (ok|bad|none), t, again
const P = (gid, ed, k, short, full, t, again) => ({
  gid,
  ed,
  k,
  short,
  full,
  t,
  again: !!again
});
const PLAYED = [['Today', [P('word', 212, 'ok', 'Solved', 'Solved in 2 of 6', '21:15', 1), P('casebook', 'The Gull Point Lighthouse', 'ok', 'Solved', 'Solved', '20:24'), P('word', 212, 'ok', 'Solved', 'Solved in 1 of 6', '12:40', 1), P('mystery', 64, 'bad', 'Missed', 'Missed', '10:27'), P('groups', 88, 'ok', 'Solved', 'All 4 groups, 1 mistake', '09:16'), P('word', 212, 'ok', 'Solved', 'Solved in 3 of 6', '08:05')]], ['Yesterday', [P('escape', 'The Locked Study', 'ok', 'Escaped', 'Escaped in 5 moves', '19:30', 1), P('delve', 'The Drowned Stair', 'bad', 'Hero fell', 'Hero fell', '18:30'), P('mystery', 63, 'ok', 'Solved', 'Solved', '14:02'), P('groups', 87, 'bad', 'Missed', '2 of 4 groups', '09:41'), P('escape', 'The Locked Study', 'ok', 'Escaped', 'Escaped in 7 moves', '08:12'), P('word', 211, 'bad', 'Missed', 'Missed', '07:22')]]];
// Every edition: [heading, [{ gid, n, title?, latest, k, short, full, reps: [[date, t, k, short, full]] }]]
const E = (gid, n, title, latest, k, short, full, reps) => ({
  gid,
  n,
  title,
  latest,
  k,
  short,
  full,
  reps: reps || []
});
const EDITIONS = [['Today', [E('word', 212, null, 1, 'ok', 'Solved', 'Solved in 3 of 6', [['6 October', '12:40', 'ok', 'Solved', 'Solved in 1 of 6'], ['6 October', '21:15', 'ok', 'Solved', 'Solved in 2 of 6']]), E('groups', 88, null, 1, 'ok', 'Solved', 'All 4 groups, 1 mistake'), E('mystery', 64, null, 1, 'bad', 'Missed', 'Missed')]], ['Yesterday', [E('word', 211, null, 0, 'bad', 'Missed', 'Missed'), E('groups', 87, null, 0, 'bad', 'Missed', '2 of 4 groups'), E('mystery', 63, null, 0, 'ok', 'Solved', 'Solved'), E('escape', 4, 'The Locked Study', 1, 'ok', 'Escaped', 'Escaped in 7 moves', [['5 October', '19:30', 'ok', 'Escaped', 'Escaped in 5 moves']]), E('casebook', 45, 'The Gull Point Lighthouse', 1, 'ok', 'Solved', 'Solved')]], ['Sunday 4 October', [E('word', 210, null, 0, 'none', 'Not played', 'Not played'), E('groups', 86, null, 0, 'ok', 'Solved', 'All 4 groups, no mistakes'), E('mystery', 62, null, 0, 'none', 'Not played', 'Not played')]]];
// The Daily Word library page's plays: one entry per edition, its plays first play first. [n, date, [[k, short, full, again]]]
const WORD_PLAYS = [[212, '6 Oct', [['ok', 'Solved', 'Solved in 3 of 6'], ['ok', 'Solved', 'Solved in 1 of 6', 1], ['ok', 'Solved', 'Solved in 2 of 6', 1]]], [211, '5 Oct', [['bad', 'Missed', 'Missed']]], [209, '3 Oct', [['ok', 'Solved', 'Solved in 4 of 6']]], [208, '2 Oct', [['ok', 'Solved', 'Solved in 5 of 6'], ['ok', 'Solved', 'Solved in 3 of 6', 1]]], [206, '30 Sep', [['ok', 'Solved', 'Solved in 3 of 6']]], [205, '29 Sep', [['bad', 'Missed', 'Missed']]]];
const isPz = gid => ['word', 'groups', 'mystery'].includes(gid);

// ---- Before: the product's markup (gs-history.jsx RpRow, the Every edition row, LbRecent) ----
const LbChev = () => /*#__PURE__*/React.createElement(Icon, {
  name: "back",
  size: 16,
  className: "lb-chev",
  style: {
    transform: 'rotate(180deg)'
  }
});
const ico = k => k === 'ok' ? 'check' : k === 'bad' ? 'error' : null;
const RpSt = ({
  k,
  l
}) => /*#__PURE__*/React.createElement("span", {
  className: 'rp-st is-' + k
}, /*#__PURE__*/React.createElement("span", {
  className: "rp-ico"
}, ico(k) && /*#__PURE__*/React.createElement(Icon, {
  name: ico(k),
  size: 14
})), /*#__PURE__*/React.createElement("span", {
  className: "rp-sl"
}, l));
const PhSt = ({
  k,
  l
}) => /*#__PURE__*/React.createElement("span", {
  className: 'lb-st is-' + k
}, ico(k) && /*#__PURE__*/React.createElement(Icon, {
  name: ico(k),
  size: 14
}), l);
const RpNum = ({
  n,
  name
}) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
  className: "rp-n"
}, '#' + n), " ", name);
const RpRow = ({
  cov,
  title,
  k,
  l,
  when,
  again,
  muted
}) => /*#__PURE__*/React.createElement("button", {
  type: "button",
  className: "rp rp-one"
}, cov && /*#__PURE__*/React.createElement(Cov, {
  gid: cov,
  cls: "ph-cov"
}), /*#__PURE__*/React.createElement("span", {
  className: "rp-a",
  style: muted ? {
    color: 'var(--muted)',
    fontWeight: 400
  } : null
}, /*#__PURE__*/React.createElement("span", {
  className: "rp-t"
}, title)), /*#__PURE__*/React.createElement("span", {
  className: "rp-c"
}, /*#__PURE__*/React.createElement(RpSt, {
  k: k,
  l: l
})), /*#__PURE__*/React.createElement("span", {
  className: "rp-d"
}, when), /*#__PURE__*/React.createElement("span", {
  className: "rp-m"
}, again && /*#__PURE__*/React.createElement("span", {
  className: "rp-r",
  title: "Replay"
}, "R")), /*#__PURE__*/React.createElement(LbChev, null));
const beforeTitle = p => isPz(p.gid) ? /*#__PURE__*/React.createElement(RpNum, {
  n: p.ed,
  name: G[p.gid].name
}) : G[p.gid].name + ' · ' + p.ed;
const HistHead = () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
  className: "gs-stack-sm"
}, /*#__PURE__*/React.createElement("h1", {
  className: "gs-h1"
}, "History"), /*#__PURE__*/React.createElement("p", {
  className: "gs-muted"
}, "A replay doesn\u2019t change your streak or your record.")));
const HistTools = () => /*#__PURE__*/React.createElement("div", {
  className: "lbf-top"
}, /*#__PURE__*/React.createElement("div", {
  className: "lbf-bar"
}, /*#__PURE__*/React.createElement("div", {
  className: "lbf-search"
}, /*#__PURE__*/React.createElement(SearchField, {
  label: "Search",
  placeholder: "A number, name or date",
  value: "",
  onChange: () => {}
})), /*#__PURE__*/React.createElement(Button, {
  variant: "secondary"
}, "Filters")));
function BeforePlayed() {
  return /*#__PURE__*/React.createElement("div", {
    className: "gs-root"
  }, /*#__PURE__*/React.createElement("main", {
    className: "gs-wrap gs-main"
  }, /*#__PURE__*/React.createElement(HistHead, null), /*#__PURE__*/React.createElement("div", {
    className: "lb-alllay"
  }, /*#__PURE__*/React.createElement(HistTools, null), /*#__PURE__*/React.createElement("div", {
    className: "lb-box lb-results"
  }, PLAYED.map(([day, ps]) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: day
  }, /*#__PURE__*/React.createElement("h2", {
    className: "ph-day"
  }, day), /*#__PURE__*/React.createElement("ul", {
    className: "ph-list rp-cols is-cov"
  }, ps.map((p, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement(RpRow, {
    cov: p.gid,
    title: beforeTitle(p),
    k: p.k,
    l: p.short,
    when: p.t,
    again: p.again
  }))))))))));
}
const edBeforeTitle = e => isPz(e.gid) ? /*#__PURE__*/React.createElement(RpNum, {
  n: e.n,
  name: G[e.gid].name
}) : G[e.gid].name + ' #' + e.n + ' · ' + e.title;
function BeforeEditions() {
  return /*#__PURE__*/React.createElement("div", {
    className: "gs-root"
  }, /*#__PURE__*/React.createElement("main", {
    className: "gs-wrap gs-main"
  }, /*#__PURE__*/React.createElement(HistHead, null), /*#__PURE__*/React.createElement("div", {
    className: "lb-alllay"
  }, /*#__PURE__*/React.createElement(HistTools, null), /*#__PURE__*/React.createElement("div", {
    className: "lb-box lb-results"
  }, EDITIONS.map(([day, es]) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: day
  }, /*#__PURE__*/React.createElement("h2", {
    className: "ph-day"
  }, day), /*#__PURE__*/React.createElement("ul", {
    className: "lb-list ph-eds"
  }, es.map((e, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ed-row ph-edcov"
  }, /*#__PURE__*/React.createElement(Cov, {
    gid: e.gid,
    cls: "ph-cov"
  }), /*#__PURE__*/React.createElement("span", {
    className: "ed-t"
  }, edBeforeTitle(e)), /*#__PURE__*/React.createElement("span", {
    className: "ed-slots is-one"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ed-slot"
  }, e.latest ? /*#__PURE__*/React.createElement(Tag, {
    kind: "daily"
  }, "Latest") : null)), /*#__PURE__*/React.createElement("span", {
    className: "ed-r"
  }, /*#__PURE__*/React.createElement(PhSt, {
    k: e.k,
    l: e.short
  })), /*#__PURE__*/React.createElement(LbChev, null))), e.reps.length > 0 && /*#__PURE__*/React.createElement("li", {
    className: "ph-rep-wrap"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "lb-list rp-cols ph-reps"
  }, e.reps.map((r, j) => /*#__PURE__*/React.createElement("li", {
    key: j
  }, /*#__PURE__*/React.createElement(RpRow, {
    title: r[0],
    k: r[2],
    l: r[3],
    when: r[1],
    again: true
  }))))))))))))));
}
const LibSlot = ({
  label
}) => /*#__PURE__*/React.createElement("div", {
  className: "pg-slot"
}, /*#__PURE__*/React.createElement("span", null, label));
function BeforeLibrary({
  wide
}) {
  // newest first: a replay is newer than its first play. Within an edition the plays are listed latest first.
  const order = WORD_PLAYS.flatMap(([n, d, plays]) => plays.slice().reverse().map((p, i) => ({
    key: n + '-' + i,
    n,
    d,
    p
  })));
  const shown = order.slice(0, wide ? 7 : 4);
  return /*#__PURE__*/React.createElement("div", {
    className: "gs-root"
  }, /*#__PURE__*/React.createElement("main", {
    className: "gs-wrap gs-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lb-lay"
  }, wide && /*#__PURE__*/React.createElement(LibSlot, {
    label: "Achievements card (beside the plays card from 900px)"
  }), /*#__PURE__*/React.createElement("section", {
    className: "lb-card lb-recentcard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lb-sechead"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "mcp-t-card"
  }, "Your words"), /*#__PURE__*/React.createElement(TextLink, {
    onClick: () => {}
  }, "All words")), /*#__PURE__*/React.createElement("ul", {
    className: "lb-list lb-recent rp-cols"
  }, shown.map(v => /*#__PURE__*/React.createElement("li", {
    key: v.key
  }, /*#__PURE__*/React.createElement(RpRow, {
    title: '#' + v.n,
    k: v.p[0],
    l: v.p[1],
    when: v.d,
    again: v.p[3]
  }))))))));
}

// ---- After: one row shape ----
const St = ({
  k,
  l
}) => /*#__PURE__*/React.createElement("span", {
  className: 'pr-st is-' + k
}, ico(k) && /*#__PURE__*/React.createElement(Icon, {
  name: ico(k),
  size: 16
}), /*#__PURE__*/React.createElement("span", null, l));
const Go = () => /*#__PURE__*/React.createElement(Icon, {
  name: "next",
  size: 20,
  className: "pr-go"
});
const PrRow = ({
  lead,
  title,
  meta,
  end
}) => /*#__PURE__*/React.createElement("button", {
  type: "button",
  className: 'pr-row' + (lead ? ' has-lead' : '') + (end ? ' has-end' : '')
}, lead && /*#__PURE__*/React.createElement(Cov, {
  gid: lead,
  cls: "pr-lead"
}), /*#__PURE__*/React.createElement("span", {
  className: "pr-body"
}, /*#__PURE__*/React.createElement("span", {
  className: "pr-title"
}, title), /*#__PURE__*/React.createElement("span", {
  className: "pr-meta"
}, meta)), end && /*#__PURE__*/React.createElement("span", {
  className: "pr-end"
}, end), /*#__PURE__*/React.createElement(Go, null));
const PrSub = ({
  k,
  l,
  when,
  lead
}) => /*#__PURE__*/React.createElement("button", {
  type: "button",
  className: 'pr-row is-sub' + (lead ? ' under-lead' : '')
}, /*#__PURE__*/React.createElement("span", {
  className: "pr-subline"
}, /*#__PURE__*/React.createElement("span", {
  className: "pr-again"
}, "Replay"), /*#__PURE__*/React.createElement(St, {
  k: k,
  l: l
}), /*#__PURE__*/React.createElement("span", {
  className: "pr-when"
}, when)), /*#__PURE__*/React.createElement(Go, null));
const afterTitle = (gid, ed) => isPz(gid) ? /*#__PURE__*/React.createElement(React.Fragment, null, G[gid].name, " ", /*#__PURE__*/React.createElement("span", {
  className: "pr-n"
}, '#' + ed)) : G[gid].name + ' · ' + ed;
function AfterPlayed({
  cols
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "gs-root"
  }, /*#__PURE__*/React.createElement("main", {
    className: "gs-wrap gs-main"
  }, /*#__PURE__*/React.createElement(HistHead, null), /*#__PURE__*/React.createElement("div", {
    className: "lb-alllay",
    style: {
      maxWidth: cols ? 960 : 760
    }
  }, /*#__PURE__*/React.createElement(HistTools, null), /*#__PURE__*/React.createElement("div", {
    className: "lb-box"
  }, PLAYED.map(([day, ps]) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: day
  }, /*#__PURE__*/React.createElement("h2", {
    className: "ph-day"
  }, day), /*#__PURE__*/React.createElement("ul", {
    className: 'pr-list' + (cols ? ' pr-cols' : '')
  }, ps.map((p, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement(PrRow, {
    lead: p.gid,
    title: afterTitle(p.gid, p.ed),
    meta: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(St, {
      k: p.k,
      l: p.full
    }), /*#__PURE__*/React.createElement("span", {
      className: "pr-when"
    }, p.t), p.again && /*#__PURE__*/React.createElement("span", {
      className: "pr-again"
    }, "Replay"))
  }))))))))));
}
function AfterEditions() {
  return /*#__PURE__*/React.createElement("div", {
    className: "gs-root"
  }, /*#__PURE__*/React.createElement("main", {
    className: "gs-wrap gs-main"
  }, /*#__PURE__*/React.createElement(HistHead, null), /*#__PURE__*/React.createElement("div", {
    className: "lb-alllay",
    style: {
      maxWidth: 760
    }
  }, /*#__PURE__*/React.createElement(HistTools, null), /*#__PURE__*/React.createElement("div", {
    className: "lb-box"
  }, EDITIONS.map(([day, es]) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: day
  }, /*#__PURE__*/React.createElement("h2", {
    className: "ph-day"
  }, day), /*#__PURE__*/React.createElement("ul", {
    className: "pr-list"
  }, es.map((e, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement(PrRow, {
    lead: e.gid,
    title: isPz(e.gid) ? afterTitle(e.gid, e.n) : /*#__PURE__*/React.createElement(React.Fragment, null, G[e.gid].name, " ", /*#__PURE__*/React.createElement("span", {
      className: "pr-n"
    }, '#' + e.n), ' · ' + e.title),
    meta: /*#__PURE__*/React.createElement(St, {
      k: e.k,
      l: e.full
    }),
    end: e.latest ? /*#__PURE__*/React.createElement(Tag, {
      kind: "daily"
    }, "Latest") : null
  }), e.reps.length > 0 && /*#__PURE__*/React.createElement("ul", {
    className: "pr-sublist"
  }, e.reps.map((r, j) => /*#__PURE__*/React.createElement("li", {
    key: j
  }, /*#__PURE__*/React.createElement(PrSub, {
    lead: true,
    k: r[2],
    l: r[4],
    when: r[0].replace(' October', ' Oct') + ', ' + r[1]
  })))))))))))));
}
function AfterLibrary({
  wide,
  cols
}) {
  const shown = WORD_PLAYS.slice(0, wide ? 6 : 4);
  return /*#__PURE__*/React.createElement("div", {
    className: "gs-root"
  }, /*#__PURE__*/React.createElement("main", {
    className: "gs-wrap gs-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lb-lay"
  }, wide && /*#__PURE__*/React.createElement(LibSlot, {
    label: "Achievements card (beside the plays card from 900px)"
  }), /*#__PURE__*/React.createElement("section", {
    className: "lb-card pr-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lb-sechead"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "mcp-t-card"
  }, "Your words"), /*#__PURE__*/React.createElement(TextLink, {
    onClick: () => {}
  }, "All words")), /*#__PURE__*/React.createElement("ul", {
    className: 'pr-list' + (cols ? ' pr-cols' : '')
  }, shown.map(([n, d, plays]) => {
    const f = plays[0];
    const reps = plays.length - 1;
    return /*#__PURE__*/React.createElement("li", {
      key: n
    }, /*#__PURE__*/React.createElement(PrRow, {
      title: '#' + n,
      meta: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(St, {
        k: f[0],
        l: f[2]
      }), /*#__PURE__*/React.createElement("span", {
        className: "pr-when"
      }, d), reps > 0 && /*#__PURE__*/React.createElement("span", {
        className: cols ? 'pr-again' : ''
      }, reps === 1 ? '1 replay' : reps + ' replays'))
    }));
  }))))));
}

// ---- The system's rows card today (live, from the bundle) and the proposed one ----
function DsCardBefore() {
  const {
    Card,
    ListRow,
    RowList
  } = DSX;
  const meta = (d, r, c) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, d), /*#__PURE__*/React.createElement("span", {
    style: {
      color: c
    }
  }, r));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      background: 'var(--page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
      gap: 16,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Your cases",
    action: /*#__PURE__*/React.createElement(TextLink, {
      onClick: () => {}
    }, "All cases")
  }, /*#__PURE__*/React.createElement(RowList, {
    label: "Your recent cases"
  }, /*#__PURE__*/React.createElement(ListRow, {
    onClick: () => {},
    title: "The Gull Point Lighthouse",
    meta: meta('5 Oct', 'Solved', 'var(--success)')
  }), /*#__PURE__*/React.createElement(ListRow, {
    onClick: () => {},
    title: "The Night Train",
    meta: meta('28 Sep', 'Unsolved', 'var(--error)')
  }), /*#__PURE__*/React.createElement(ListRow, {
    muted: true,
    title: "Not played",
    meta: /*#__PURE__*/React.createElement("span", null, "21 Sep")
  }), /*#__PURE__*/React.createElement(ListRow, {
    onClick: () => {},
    title: "A Death at the Regatta",
    meta: meta('14 Sep', 'Solved', 'var(--success)')
  }))), /*#__PURE__*/React.createElement("span", {
    className: "fr-note"
  }, "Latest four, then All cases opens its own page")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(RowList, null, /*#__PURE__*/React.createElement(ListRow, {
    className: "is-hover",
    onClick: () => {},
    title: "Hover",
    meta: meta('5 Oct', 'Solved', 'var(--success)')
  }), /*#__PURE__*/React.createElement(ListRow, {
    className: "is-pressed",
    onClick: () => {},
    title: "Press",
    meta: meta('5 Oct', 'Solved', 'var(--success)')
  }), /*#__PURE__*/React.createElement(ListRow, {
    className: "is-focus",
    onClick: () => {},
    title: "Focus",
    meta: meta('5 Oct', 'Solved', 'var(--success)')
  }), /*#__PURE__*/React.createElement(ListRow, {
    muted: true,
    title: "Muted: can't be opened",
    meta: /*#__PURE__*/React.createElement("span", null, "21 Sep")
  }))), /*#__PURE__*/React.createElement("span", {
    className: "fr-note"
  }, "Whole row is one target. No inline actions."))));
}
function DsCardAfter() {
  const box = {
    background: 'var(--card)',
    border: '1px solid var(--line)',
    '--lb-pad': '16px'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "gs-root",
    style: {
      padding: 20,
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pr-anat",
    style: {
      ...box,
      padding: '14px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pr-row has-lead has-end",
    style: {
      cursor: 'default'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "data-n": "1",
    style: {
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement(Cov, {
    gid: "casebook",
    cls: "pr-lead"
  })), /*#__PURE__*/React.createElement("span", {
    className: "pr-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pr-title",
    "data-n": "2",
    style: {
      justifySelf: 'start'
    }
  }, "Casebook ", /*#__PURE__*/React.createElement("span", {
    className: "pr-n"
  }, "#44"), " \xB7 The Night Train"), /*#__PURE__*/React.createElement("span", {
    className: "pr-meta",
    "data-n": "3",
    style: {
      justifySelf: 'start'
    }
  }, /*#__PURE__*/React.createElement(St, {
    k: "bad",
    l: "Unsolved"
  }), /*#__PURE__*/React.createElement("span", null, "28 Sep, 20:10"), /*#__PURE__*/React.createElement("span", {
    className: "pr-again"
  }, "Replay"))), /*#__PURE__*/React.createElement("span", {
    className: "pr-end",
    "data-n": "4"
  }, /*#__PURE__*/React.createElement(Tag, {
    kind: "daily"
  }, "Latest")), /*#__PURE__*/React.createElement("span", {
    "data-n": "5",
    style: {
      display: 'grid'
    }
  }, /*#__PURE__*/React.createElement(Go, null)))), /*#__PURE__*/React.createElement("ol", {
    className: "fr-key"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Lead"), ", optional. A 40\xD730 cover when the list mixes games."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Title."), " The name a player would say. The game's name only when the list mixes games."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Meta."), " One line of facts, always in the same order: result, when, marker. It wraps; it never moves."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "End"), ", optional. One short tag about the row."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, "Chevron"), " at rest whenever the row opens.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '300px minmax(0,1fr)',
      gap: 16,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: box
  }, /*#__PURE__*/React.createElement("ul", {
    className: "pr-list"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(PrRow, {
    title: "The Night Train",
    meta: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(St, {
      k: "bad",
      l: "Unsolved"
    }), /*#__PURE__*/React.createElement("span", null, "28 Sep"))
  })), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(PrRow, {
    title: "A Death at the Regatta",
    meta: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(St, {
      k: "none",
      l: "Not played"
    }), /*#__PURE__*/React.createElement("span", null, "21 Sep"))
  })))), /*#__PURE__*/React.createElement("span", {
    className: "fr-note"
  }, "300px wide")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: box
  }, /*#__PURE__*/React.createElement("ul", {
    className: "pr-list"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(PrRow, {
    title: "The Night Train",
    meta: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(St, {
      k: "bad",
      l: "Unsolved"
    }), /*#__PURE__*/React.createElement("span", null, "28 Sep"))
  }), /*#__PURE__*/React.createElement("ul", {
    className: "pr-sublist"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(PrSub, {
    k: "ok",
    l: "Solved",
    when: "2 Oct, 21:00"
  })))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(PrRow, {
    title: "A Death at the Regatta",
    meta: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(St, {
      k: "none",
      l: "Not played"
    }), /*#__PURE__*/React.createElement("span", null, "21 Sep"))
  })))), /*#__PURE__*/React.createElement("span", {
    className: "fr-note"
  }, "Wider: the same shape. A replay hangs under its edition."))));
}
Object.assign(window, {
  Frame,
  BeforePlayed,
  BeforeEditions,
  BeforeLibrary,
  AfterPlayed,
  AfterEditions,
  AfterLibrary,
  DsCardBefore,
  DsCardAfter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "docs/archive/rows-and-history/playground/rows.jsx", error: String((e && e.message) || e) }); }

// docs/specs/card-snug-title/playground/pg-card-snug-title.jsx
try { (() => {
// Card snug title rig: the real design-system CardRow, Tag and GameCard parts with the product's eight Available games.
// Options change only the card's geometry (CSS keyed on data-pgs-opt); Today is the shipped rule.
(() => {
  const DS = window.MCPGameStoreDesignSystem_ef1abd;
  const KEY = 'pg_card_snug_title_v1';
  const OPTS = [{
    n: 0,
    name: 'Today',
    why: 'Four lines shared across the row. The name line is as tall as the tallest name, so a one-line name sits above a blank line.',
    cost: 'The gap you flagged: one two-line name opens a gap under every other title in the row.'
  }, {
    n: 1,
    name: 'Snug, chips bottom',
    why: 'Each card stands alone: picture, then name and blurb together, then chips on the card\u2019s bottom edge. Cards are as tall as the tallest in the row. Spare height sits between blurb and chips.',
    cost: 'Nothing is shared but the picture and the card\u2019s edges. A card with two rows of chips starts its chips higher than one with a single row; their bottom edges stay level.'
  }, {
    n: 2,
    name: 'Block, shared chips',
    why: 'Name and blurb become one block (a text slot added to GameCard). The row shares three lines: picture, block, chips. Chips sit centred in their line as ratified.',
    cost: 'Needs a wrapper in GameCard around name and blurb. One chip row beside a two-row set is centred, so its chips float a little above the bottom edge.'
  }, {
    n: 3,
    name: 'Block, chips floor',
    why: 'As 2, with every chip set sitting on the bottom of its line.',
    cost: 'Needs the same wrapper. A single chip row sits flush with the other card\u2019s last row, but loses the centring ratified earlier.'
  }];
  GS_GAMES.stress = {
    name: 'The Hollow Under the Hill',
    art: 'barrow',
    ed: ['chapter', 'chapters'],
    blurb: 'Something under the hill wants its gold back.',
    tags: ['FIRST', 'Weekly', '45\u201360 min']
  };
  const load = () => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || {};
    } catch (e) {
      return {};
    }
  };
  const save = s => {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch (e) {}
  };
  const init = load();
  const Art = ({
    id
  }) => {
    const a = GS_ART[GS_GAMES[id].art] || {};
    const svg = (a.svg || '').replace('xMidYMid slice', a.extend === 'bottom' ? 'xMidYMax meet' : 'xMidYMid meet').replace('<svg ', '<svg style="width:100%;height:100%;display:block" ');
    return /*#__PURE__*/React.createElement("div", {
      className: 'mcp-art mcp-art-3' + (a.ground && a.ground !== 'indigo' ? ' is-' + a.ground : ''),
      style: {
        position: 'relative'
      },
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'grid'
      },
      dangerouslySetInnerHTML: {
        __html: svg
      }
    }));
  };
  const Tags = ({
    tags,
    ed
  }) => /*#__PURE__*/React.createElement("div", {
    className: "gs-tags"
  }, tags.map((t, i) => t === 'FREE' ? /*#__PURE__*/React.createElement(DS.Tag, {
    key: i,
    kind: "free"
  }, "Free") : t === 'FIRST' ? /*#__PURE__*/React.createElement(DS.Tag, {
    key: i,
    kind: "free"
  }, 'First ' + (ed ? ed[0] : 'edition') + ' free') : t === 'PASS' ? /*#__PURE__*/React.createElement("button", {
    key: i,
    type: "button",
    className: "gs-tagbtn",
    "aria-label": "Pass. See the Pass"
  }, /*#__PURE__*/React.createElement(DS.Tag, {
    kind: "locked"
  }, "Pass")) : /*#__PURE__*/React.createElement(DS.Tag, {
    key: i,
    kind: "daily"
  }, t)));
  const keepLast = s => {
    const i = s.lastIndexOf(' ');
    const j = i > 0 ? s.lastIndexOf(' ', i - 1) : -1;
    return j < 0 ? s : /*#__PURE__*/React.createElement(React.Fragment, null, s.slice(0, j + 1), /*#__PURE__*/React.createElement("span", {
      style: {
        whiteSpace: 'nowrap'
      }
    }, s.slice(j + 1)));
  };
  // GameCard's own markup, plus one wrapper (pgs-text) around name and blurb. It is display:contents except in options 2 and 3.
  const Card = ({
    id
  }) => {
    const g = GS_GAMES[id];
    return /*#__PURE__*/React.createElement("div", {
      className: "mcp-card mcp-gcard mcp-art-host gs-host"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mcp-gcard-art"
    }, /*#__PURE__*/React.createElement(Art, {
      id: id
    })), /*#__PURE__*/React.createElement("div", {
      className: "pgs-text"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mcp-gcard-name"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "mcp-t-card"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "gs-titlebtn mcp-art-link"
    }, g.name))), /*#__PURE__*/React.createElement("p", {
      className: "mcp-gcard-blurb"
    }, keepLast(g.blurb))), /*#__PURE__*/React.createElement("div", {
      className: "mcp-gcard-tags"
    }, /*#__PURE__*/React.createElement(Tags, {
      tags: g.tags,
      ed: g.ed
    })));
  };
  const measure = () => {
    const cards = [...document.querySelectorAll('.mcp-gcard')];
    if (!cards.length) return null;
    const gap = cards.map(c => c.querySelector('.mcp-gcard-blurb').getBoundingClientRect().top - c.querySelector('h3').getBoundingClientRect().bottom);
    const tb = cards.map(c => {
      const t = [...c.querySelectorAll('.mcp-tag')];
      return Math.max(...t.map(x => x.getBoundingClientRect().bottom)) - c.getBoundingClientRect().bottom;
    });
    const hs = cards.map(c => c.getBoundingClientRect().height);
    const sp = a => Math.max(...a) - Math.min(...a);
    const bl = cards.map(c => {
      const t = c.querySelector('.mcp-gcard-tags').firstElementChild;
      const tt = Math.min(...[...c.querySelectorAll('.mcp-tag')].map(x => x.getBoundingClientRect().top));
      return tt - (() => {
        const rg = document.createRange();
        rg.selectNodeContents(c.querySelector('.mcp-gcard-blurb'));
        return Math.max(...[...rg.getClientRects()].map(x => x.bottom));
      })() - 12;
    });
    return {
      gap: Math.max(...gap) - 12,
      tb: sp(tb),
      hs: sp(hs),
      blank: Math.max(...bl)
    };
  };
  const App = () => {
    const [opt, setOpt] = React.useState(Math.min(init.opt ?? 1, 3));
    const [vp, setVp] = React.useState(init.vp || 'auto');
    const [open, setOpen] = React.useState(init.open ?? true);
    const [stress, setStress] = React.useState(init.stress ?? false);
    const [why, setWhy] = React.useState(false);
    const [read, setRead] = React.useState(null);
    const [w, setW] = React.useState(window.innerWidth);
    const ref = React.useRef(null);
    React.useEffect(() => {
      document.documentElement.dataset.pgsOpt = String(opt);
      save({
        opt,
        vp,
        open,
        stress
      });
    }, [opt, vp, open, stress]);
    React.useEffect(() => {
      const t = setInterval(() => setRead(measure()), 500);
      const r = () => setW(window.innerWidth);
      window.addEventListener('resize', r);
      return () => {
        clearInterval(t);
        window.removeEventListener('resize', r);
      };
    }, []);
    React.useEffect(() => {
      const el = ref.current;
      if (!el) return undefined;
      const ro = new ResizeObserver(() => document.documentElement.style.setProperty('--pgs-h', el.offsetHeight + 'px'));
      ro.observe(el);
      return () => ro.disconnect();
    }, []);
    const o = OPTS[opt],
      f = x => Math.round(x);
    const forced = vp === 'mobile';
    const page = /*#__PURE__*/React.createElement("div", {
      className: "gs-root"
    }, /*#__PURE__*/React.createElement("div", {
      className: "gs-wrap",
      style: {
        paddingBlock: 36
      }
    }, /*#__PURE__*/React.createElement(DS.CardRow, {
      title: "Available games",
      className: "gs-row4"
    }, (stress ? ['stress'].concat(GS_GAME_ORDER) : GS_GAME_ORDER).map(k => /*#__PURE__*/React.createElement(Card, {
      key: k,
      id: k
    })))));
    return /*#__PURE__*/React.createElement(React.Fragment, null, forced ? /*#__PURE__*/React.createElement("div", {
      className: "kit-stage"
    }, /*#__PURE__*/React.createElement("div", {
      className: "kit-phone"
    }, /*#__PURE__*/React.createElement("div", {
      className: "kit-phone-clip"
    }, /*#__PURE__*/React.createElement("div", {
      className: "kit-phone-screen"
    }, page)))) : page, /*#__PURE__*/React.createElement("div", {
      ref: ref,
      className: "pgs-strip",
      role: "region",
      "aria-label": "Playground options"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pgs-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "pgs-k"
    }, "OPTION"), OPTS.map(x => /*#__PURE__*/React.createElement("button", {
      key: x.n,
      type: "button",
      className: "pgs-b",
      "aria-pressed": opt === x.n,
      onClick: () => setOpt(x.n)
    }, x.n + ' ' + x.name)), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "pgs-b",
      "aria-expanded": why,
      onClick: () => setWhy(!why)
    }, why ? 'Less' : 'Why \u00b7 cost'), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "pgs-b pgs-fold",
      "aria-expanded": open,
      onClick: () => setOpen(!open)
    }, open ? 'Hide' : 'Show')), why && /*#__PURE__*/React.createElement("p", {
      className: "pgs-why"
    }, /*#__PURE__*/React.createElement("b", null, o.n + ' ' + o.name, "."), " ", o.why, " ", /*#__PURE__*/React.createElement("b", null, "Cost:"), " ", o.cost), open && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "pgs-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "pgs-k"
    }, "VIEWPORT"), [['auto', 'Auto'], ['mobile', 'Mobile']].map(([v, l]) => /*#__PURE__*/React.createElement("button", {
      key: v,
      type: "button",
      className: "pgs-b",
      "aria-pressed": vp === v,
      onClick: () => setVp(v)
    }, l)), /*#__PURE__*/React.createElement("span", {
      className: "pgs-k",
      style: {
        width: 'auto',
        marginLeft: 12
      }
    }, "SEED"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "pgs-b",
      "aria-pressed": stress,
      onClick: () => setStress(!stress)
    }, "Stress: 2-line name + blurb, 3 chips"), /*#__PURE__*/React.createElement("span", {
      className: "pgs-note"
    }, forced ? 'Phone frame' : (w < 1024 ? 'Mobile layout' : 'Desktop layout') + ', ' + w + 'px')), /*#__PURE__*/React.createElement("div", {
      className: "pgs-read"
    }, read ? /*#__PURE__*/React.createElement(React.Fragment, null, "Blank under a title ", /*#__PURE__*/React.createElement("span", {
      className: read.gap > 1 ? 'bad' : ''
    }, f(read.gap), "px"), " ", '\u00b7', " chip bottoms differ from card edge by ", /*#__PURE__*/React.createElement("span", {
      className: read.tb > 1 ? 'bad' : ''
    }, f(read.tb), "px"), " ", '\u00b7', " most blank above chips ", /*#__PURE__*/React.createElement("span", {
      className: read.blank > 24 ? 'bad' : ''
    }, f(read.blank), "px"), " ", '\u00b7', " card heights differ ", /*#__PURE__*/React.createElement("span", {
      className: read.hs > 1 ? 'bad' : ''
    }, f(read.hs), "px")) : '\u2026'))));
  };
  ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "docs/specs/card-snug-title/playground/pg-card-snug-title.jsx", error: String((e && e.message) || e) }); }

// docs/specs/card-snug-title/playground/pg-data.jsx
try { (() => {
// Product data, copied from app/gs-data.jsx (covers, names, the eight Available games).
const GS_SVG = body => '<svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice">' + body + '</svg>';
const GS_ART = {
  delve: {
    ground: 'wine',
    extend: 'bottom',
    svg: GS_SVG('<rect width="160" height="120" fill="#421A28"/><rect x="50" y="40" width="60" height="80" fill="#A390B2"/><circle cx="80" cy="40" r="30" fill="#A390B2"/><rect x="64" y="52" width="32" height="68" fill="#1D1B3A"/><circle cx="80" cy="52" r="16" fill="#1D1B3A"/><rect x="64" y="88" width="32" height="8" fill="#E5A63B"/><rect x="68" y="100" width="24" height="8" fill="#E5A63B"/><rect x="72" y="112" width="16" height="8" fill="#E5A63B"/><rect x="22" y="62" width="6" height="30" fill="#F2EBE0"/><circle cx="25" cy="54" r="8" fill="#D66847"/><rect x="132" y="62" width="6" height="30" fill="#F2EBE0"/><circle cx="135" cy="54" r="8" fill="#D66847"/>')
  },
  escape: {
    ground: 'indigo',
    extend: 'bottom',
    svg: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/><rect x="60" y="26" width="44" height="94" fill="#328A88"/><circle cx="94" cy="76" r="5" fill="#E5A63B"/><rect x="22" y="22" width="16" height="16" fill="#F2EBE0"/>')
  },
  murder: {
    ground: 'wine',
    extend: 'centre',
    svg: GS_SVG('<rect width="160" height="120" fill="#421A28"/><circle cx="72" cy="60" r="30" fill="none" stroke="#D66847" stroke-width="12"/><rect x="114" y="24" width="10" height="72" fill="#F2EBE0"/><rect x="114" y="24" width="10" height="20" fill="#E5A63B"/>')
  },
  // Daily Groups: four rows of four, one colour a group, as a solved board (added 2026-10-09, split-daily-puzzles).
  groups: {
    ground: 'indigo',
    extend: 'centre',
    svg: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/>' + ['#E5A63B', '#328A88', '#D66847', '#A390B2'].map((c, r) => [0, 1, 2, 3].map(k => '<rect x="' + (31 + k * 26) + '" y="' + (11 + r * 26) + '" width="20" height="20" fill="' + c + '"/>').join('')).join(''))
  },
  word: {
    ground: 'forest',
    extend: 'centre',
    svg: GS_SVG('<rect width="160" height="120" fill="#163328"/><rect x="24" y="44" width="32" height="32" fill="#E5A63B"/><rect x="64" y="44" width="32" height="32" fill="#F2EBE0"/><rect x="106" y="46" width="28" height="28" fill="none" stroke="#328A88" stroke-width="4"/>')
  },
  derelict: {
    ground: 'indigo',
    extend: 'centre',
    svg: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/><circle cx="100" cy="56" r="32" fill="none" stroke="#A390B2" stroke-width="10"/><rect x="28" y="74" width="20" height="20" fill="#D66847"/><circle cx="40" cy="30" r="4" fill="#F2EBE0"/>')
  },
  barrow: {
    ground: 'wine',
    extend: 'bottom',
    svg: GS_SVG('<rect width="160" height="120" fill="#421A28"/><path d="M12 120L52 52L92 120Z" fill="#E5A63B"/><path d="M68 120L108 64L148 120Z" fill="#F2EBE0"/><rect x="100" y="20" width="16" height="16" fill="#328A88"/>')
  },
  casebook: {
    ground: 'indigo',
    extend: 'bottom',
    svg: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/><rect x="30" y="40" width="18" height="80" fill="#D66847"/><rect x="62" y="28" width="18" height="92" fill="#A390B2"/><rect x="94" y="46" width="18" height="74" fill="#F2EBE0"/><circle cx="128" cy="26" r="12" fill="#E5A63B"/>')
  },
  hunter: {
    ground: 'forest',
    extend: 'bottom',
    svg: GS_SVG('<rect width="160" height="120" fill="#163328"/><circle cx="52" cy="74" r="26" fill="#E5A63B"/><path d="M40 120L100 50L160 120Z" fill="#A390B2"/><rect x="18" y="104" width="14" height="14" fill="#328A88"/><rect x="128" y="20" width="10" height="10" fill="#F2EBE0"/>')
  }
};
const GS_NAME = {
  casebook: 'Casebook',
  hunter: '36,000 Summers Ago'
};
const GS_GAMES = {
  word: {
    name: 'Daily Word',
    category: 'PUZZLE',
    art: 'word',
    route: 'word',
    ed: ['word', 'words'],
    free: true,
    daily: true,
    once: true,
    blurb: 'Six guesses to find today’s five-letter word.',
    tags: ['FREE', 'Daily', '10 min']
  },
  groups: {
    name: 'Daily Groups',
    category: 'PUZZLE',
    art: 'groups',
    route: 'groups',
    ed: ['groups', 'groups'],
    edLink: 'See all groups',
    edAll: 'All groups',
    free: true,
    daily: true,
    once: true,
    blurb: 'Sixteen words hide four groups. Find all four.',
    tags: ['FREE', 'Daily', '10 min']
  },
  mystery: {
    name: 'Daily Mystery',
    category: 'PUZZLE',
    art: 'murder',
    route: 'mystery',
    ed: ['case', 'cases'],
    free: true,
    daily: true,
    once: true,
    blurb: 'There’s a body and a story that doesn’t add up.',
    tags: ['FREE', 'Daily', '10 min']
  },
  escape: {
    name: 'Escape',
    category: 'PUZZLE',
    art: 'escape',
    route: 'escape',
    ed: ['room', 'rooms'],
    free: true,
    blurb: 'The door’s locked and you’re on the wrong side of it.',
    tags: ['FREE', 'Weekly', '10 min']
  },
  casebook: {
    name: GS_NAME.casebook,
    category: 'MYSTERY',
    art: 'casebook',
    route: 'casebook',
    ed: ['case', 'cases'],
    once: true,
    blurb: 'Ask the question they haven’t prepared for.',
    first: true,
    tags: ['FIRST', 'Weekly', '25–40 min']
  },
  delve: {
    name: 'Delve',
    category: 'ADVENTURE',
    art: 'delve',
    route: 'delve',
    ed: ['scene', 'scenes'],
    first: true,
    blurb: 'Get her out before the drums stop.',
    tags: ['FIRST', 'Weekly', '25–40 min']
  },
  // Added 2026-10-13 (owner asked for it as a new adventure game). Chapters are its editions; a free player gets chapter 1. Content is sample.
  barrow: {
    name: 'The Barrow of Hollowmere',
    category: 'ADVENTURE',
    art: 'barrow',
    route: 'barrow',
    ed: ['chapter', 'chapters'],
    eds: true,
    edLink: 'All chapters',
    edAll: 'All chapters',
    first: true,
    blurb: 'Something under the hill wants its gold back. Go down anyway.',
    tags: ['FIRST', '45–60 min']
  },
  hunter: {
    name: GS_NAME.hunter,
    category: 'LEARNING',
    art: 'hunter',
    route: 'hunter',
    blurb: 'Grey dawn below Chauvet cave. Go where you like.',
    tags: ['PASS', '2 hours']
  }
};
const GS_GAME_ORDER = ['word', 'groups', 'mystery', 'escape', 'casebook', 'delve', 'barrow', 'hunter'];
Object.assign(window, {
  GS_ART,
  GS_NAME,
  GS_GAMES,
  GS_GAME_ORDER
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "docs/specs/card-snug-title/playground/pg-data.jsx", error: String((e && e.message) || e) }); }

// ui_kits/shop/Screens.jsx
try { (() => {
const {
  Button,
  ButtonPair,
  TextLink,
  TextField,
  SearchField,
  Checkbox,
  Tag,
  StatusMessage,
  ProgressBar,
  Card,
  Heading,
  FormCard,
  Popup,
  Disclosure,
  Icon,
  Cover
} = window.MCPGameStoreDesignSystem_ef1abd;
const GAMES = [{
  id: 'dp',
  name: 'Daily Puzzles',
  art: 'daily-puzzles',
  tag: ['daily', 'Daily'],
  blurb: "You already know today's answer. You can't see it yet, so start guessing."
}, {
  id: 'wi',
  name: 'The Weekly Interrogation',
  art: 'weekly-interrogation',
  tag: ['daily', 'Weekly'],
  blurb: "This week's suspects have had time to get their stories straight. Ask the question they haven't prepared for."
}, {
  id: 'dq',
  name: 'Dungeon Quest',
  art: 'dungeon-quest',
  tag: ['locked', 'Locked'],
  blurb: "The way in is open and nobody has told you what's down there. Say what you do first."
}];
function TopBar({
  onHome,
  onSignIn,
  signedIn
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      padding: '12px 0',
      borderBottom: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onHome,
    style: {
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer',
      color: 'var(--text)',
      font: '700 20px/1.2 var(--font-heading)',
      letterSpacing: '-.01em',
      minHeight: 44,
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo.svg",
    width: "32",
    height: "32",
    alt: ""
  }), "MCP Game Store"), signedIn ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-small)',
      color: 'var(--muted)'
    }
  }, "Signed in") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: onSignIn
  }, "Sign in"), /*#__PURE__*/React.createElement(Button, {
    onClick: onSignIn
  }, "Sign up")));
}
function AllGames({
  onOpen
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 36
    }
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      display: 'grid',
      gap: 8,
      maxWidth: 640
    }
  }, /*#__PURE__*/React.createElement(Heading, {
    level: "page"
  }, "Someone's lying to you. Go and find out who."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: 'var(--muted)'
    }
  }, "Play small games by talking to Claude or ChatGPT. New ones arrive every day.")), /*#__PURE__*/React.createElement("section", {
    style: {
      display: 'grid',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 12,
      alignItems: 'end',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(Heading, {
    level: "section"
  }, "All games"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 'min(100%,320px)'
    }
  }, /*#__PURE__*/React.createElement(SearchField, {
    placeholder: "Find a game"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,220px),1fr))',
      gap: 12
    }
  }, GAMES.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.id,
    style: {
      display: 'grid',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Cover, {
    name: g.name,
    art: g.art,
    onClick: () => onOpen(g)
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Tag, {
    kind: g.tag[0]
  }, g.tag[1])))))));
}
function GamePage({
  game,
  onBack
}) {
  const [added, setAdded] = React.useState(false);
  const [confirm, setConfirm] = React.useState(false);
  const [deleted, setDeleted] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const del = () => {
    setDeleting(true);
    setTimeout(() => {
      setDeleting(false);
      setConfirm(false);
      setDeleted(true);
    }, 1200);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TextLink, {
    onClick: onBack
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "back"
  }), "All games"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))',
      gap: 24,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Cover, {
    art: game.art
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement(Heading, {
    level: "page"
  }, game.name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, game.blurb), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    done: added,
    doneLabel: "Added",
    loadingLabel: "Adding",
    onClick: () => new Promise(r => setTimeout(r, 1200)).then(() => setAdded(true))
  }, "Add to Claude"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary"
  }, "See how it plays")), /*#__PURE__*/React.createElement(Disclosure, {
    title: "How it plays"
  }, "Claude deals the puzzle, you answer in the chat, and the game scores it."), deleted ? /*#__PURE__*/React.createElement(StatusMessage, {
    kind: "success"
  }, "Save deleted.") : /*#__PURE__*/React.createElement(Card, {
    title: "Your save"
  }, /*#__PURE__*/React.createElement(ProgressBar, {
    label: "Puzzle 3 of 5",
    value: 60
  }), /*#__PURE__*/React.createElement(TextLink, {
    danger: true,
    onClick: () => setConfirm(true)
  }, "Delete save")))), /*#__PURE__*/React.createElement(Popup, {
    open: confirm,
    busy: deleting,
    onClose: () => setConfirm(false),
    title: "Delete this save?",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => {
        if (!deleting) setConfirm(false);
      }
    }, "Keep it"), /*#__PURE__*/React.createElement(Button, {
      variant: "danger",
      loading: deleting,
      loadingLabel: "Deleting",
      onClick: del
    }, "Delete save"))
  }, /*#__PURE__*/React.createElement("p", null, "Your progress in ", game.name, " is removed.")));
}
function SignIn({
  onDone
}) {
  const [email, setEmail] = React.useState('');
  const [tried, setTried] = React.useState(false);
  const r = React.useRef();
  const bad = tried && !email.includes('@');
  const [busy, setBusy] = React.useState(null);
  const which = React.useRef('in');
  const submit = e => {
    e.preventDefault();
    if (busy) return;
    setTried(true);
    if (!email.includes('@')) setTimeout(() => r.current && r.current.focus(), 0);else {
      setBusy(which.current);
      setTimeout(onDone, 1200);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      placeItems: 'center',
      padding: '24px 0'
    }
  }, /*#__PURE__*/React.createElement("form", {
    noValidate: true,
    onSubmit: submit,
    style: {
      width: 'min(100%,420px)'
    }
  }, /*#__PURE__*/React.createElement(FormCard, {
    title: "Sign in"
  }, /*#__PURE__*/React.createElement(TextField, {
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    value: email,
    onChange: e => setEmail(e.target.value),
    inputRef: r,
    error: bad ? 'Enter an email with an @ in it.' : undefined
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Keep me signed in",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement(ButtonPair, null, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    type: "submit",
    loading: busy === 'in',
    loadingLabel: "Signing in",
    onClick: () => {
      which.current = 'in';
    }
  }, "Sign in"), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    loading: busy === 'up',
    loadingLabel: "Signing up",
    onClick: () => {
      which.current = 'up';
    }
  }, "Sign up")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TextLink, null, "Why sign in?")))));
}
Object.assign(window, {
  TopBar,
  AllGames,
  GamePage,
  SignIn
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/shop/Screens.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.ButtonPair = __ds_scope.ButtonPair;

__ds_ns.TextLink = __ds_scope.TextLink;

__ds_ns.Loader = __ds_scope.Loader;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.StatusMessage = __ds_scope.StatusMessage;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.TextField = __ds_scope.TextField;

__ds_ns.SearchField = __ds_scope.SearchField;

__ds_ns.ChatPicture = __ds_scope.ChatPicture;

__ds_ns.Cover = __ds_scope.Cover;

__ds_ns.GameArt = __ds_scope.GameArt;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Heading = __ds_scope.Heading;

__ds_ns.CardRow = __ds_scope.CardRow;

__ds_ns.Disclosure = __ds_scope.Disclosure;

__ds_ns.FormCard = __ds_scope.FormCard;

__ds_ns.GameCard = __ds_scope.GameCard;

__ds_ns.GamePick = __ds_scope.GamePick;

__ds_ns.GameTile = __ds_scope.GameTile;

__ds_ns.RowList = __ds_scope.RowList;

__ds_ns.ListRow = __ds_scope.ListRow;

__ds_ns.Menu = __ds_scope.Menu;

__ds_ns.PageGrid = __ds_scope.PageGrid;

__ds_ns.Popup = __ds_scope.Popup;

__ds_ns.SoonCard = __ds_scope.SoonCard;

})();
