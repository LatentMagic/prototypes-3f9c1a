/* @ds-bundle: {"format":4,"namespace":"MCPGameStoreDesignSystem_ef1abd","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"ButtonPair","sourcePath":"components/actions/Button.jsx"},{"name":"TextLink","sourcePath":"components/actions/TextLink.jsx"},{"name":"Loader","sourcePath":"components/feedback/Loader.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"StatusMessage","sourcePath":"components/feedback/StatusMessage.jsx"},{"name":"Tag","sourcePath":"components/feedback/Tag.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"TextField","sourcePath":"components/forms/TextField.jsx"},{"name":"SearchField","sourcePath":"components/forms/TextField.jsx"},{"name":"Cover","sourcePath":"components/media/Cover.jsx"},{"name":"GameArt","sourcePath":"components/media/GameArt.jsx"},{"name":"ICON_NAMES","sourcePath":"components/media/Icon.jsx"},{"name":"Icon","sourcePath":"components/media/Icon.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"Heading","sourcePath":"components/surfaces/Card.jsx"},{"name":"Disclosure","sourcePath":"components/surfaces/Disclosure.jsx"},{"name":"FormCard","sourcePath":"components/surfaces/FormCard.jsx"},{"name":"RowList","sourcePath":"components/surfaces/ListRow.jsx"},{"name":"ListRow","sourcePath":"components/surfaces/ListRow.jsx"},{"name":"Menu","sourcePath":"components/surfaces/Menu.jsx"},{"name":"PageGrid","sourcePath":"components/surfaces/PageGrid.jsx"},{"name":"Popup","sourcePath":"components/surfaces/Popup.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"afd1c61a7153","components/actions/TextLink.jsx":"c27d39f10f18","components/feedback/Loader.jsx":"c73ab4148abc","components/feedback/ProgressBar.jsx":"4c208225b868","components/feedback/StatusMessage.jsx":"d26f3a1fef7e","components/feedback/Tag.jsx":"cbb4e0e379c0","components/forms/Checkbox.jsx":"855feb3266b9","components/forms/TextField.jsx":"b114099835d3","components/media/Cover.jsx":"a4fb1618559f","components/media/GameArt.jsx":"f093a4c9f665","components/media/Icon.jsx":"f4b3f674bbcf","components/press.js":"4f94d27dbfac","components/surfaces/Card.jsx":"5866138b458a","components/surfaces/Disclosure.jsx":"e56f91fb306d","components/surfaces/FormCard.jsx":"8e545dcfdcb5","components/surfaces/ListRow.jsx":"72a0643082bb","components/surfaces/Menu.jsx":"79e87747cff5","components/surfaces/PageGrid.jsx":"276b99e364b1","components/surfaces/Popup.jsx":"b35f2c8c8de7","ui_kits/shop/Screens.jsx":"c91dac80697e"},"inlinedExternals":[],"unexposedExports":[{"name":"usePress","sourcePath":"components/press.js"}]} */

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
function Cover({
  name,
  art,
  src,
  children,
  onClick,
  className = ''
}) {
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
    className: ('mcp-cover ' + className).trim(),
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
  }, /*#__PURE__*/React.createElement("div", {
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
// Game art that answers a hover. Place inside an element with class mcp-art-host (the whole card or link). Descriptions live in guidelines/game-art-motion.md.
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
const PIECES = {
  groups: {
    body: dg
  },
  casebook: {
    body: cb
  },
  hunter: {
    body: hu,
    forest: true
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
    className: ('mcp-art ' + RATIO[shape] + (p.forest ? ' is-forest ' : ' ') + className).trim(),
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
  icon
}) {
  const ic = icon || (kind === 'locked' ? 'lock' : null);
  return /*#__PURE__*/React.createElement("span", {
    className: 'mcp-tag mcp-tag-' + kind
  }, ic && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ic,
    size: 14
  }), children);
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
  meta,
  end,
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
  const cls = ('mcp-row' + (live ? ' is-link' : '') + (end != null ? ' has-end' : '') + (muted ? ' is-muted' : '') + (pressed ? ' is-pressed' : '') + ' ' + className).trim();
  const inner = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "mcp-row-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mcp-row-title"
  }, title), meta && /*#__PURE__*/React.createElement("span", {
    className: "mcp-row-meta"
  }, meta)), end != null && /*#__PURE__*/React.createElement("span", {
    className: "mcp-row-end"
  }, end), live ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "next",
    size: 20,
    className: "mcp-row-go"
  }) : /*#__PURE__*/React.createElement("span", {
    className: "mcp-row-go",
    "aria-hidden": "true"
  }));
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

__ds_ns.Cover = __ds_scope.Cover;

__ds_ns.GameArt = __ds_scope.GameArt;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Heading = __ds_scope.Heading;

__ds_ns.Disclosure = __ds_scope.Disclosure;

__ds_ns.FormCard = __ds_scope.FormCard;

__ds_ns.RowList = __ds_scope.RowList;

__ds_ns.ListRow = __ds_scope.ListRow;

__ds_ns.Menu = __ds_scope.Menu;

__ds_ns.PageGrid = __ds_scope.PageGrid;

__ds_ns.Popup = __ds_scope.Popup;

})();
