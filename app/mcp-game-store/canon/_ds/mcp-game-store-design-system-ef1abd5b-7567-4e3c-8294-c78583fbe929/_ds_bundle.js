/* @ds-bundle: {"format":4,"namespace":"MCPGameStoreDesignSystem_ef1abd","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"ButtonPair","sourcePath":"components/actions/Button.jsx"},{"name":"TextLink","sourcePath":"components/actions/TextLink.jsx"},{"name":"Loader","sourcePath":"components/feedback/Loader.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"StatusMessage","sourcePath":"components/feedback/StatusMessage.jsx"},{"name":"Tag","sourcePath":"components/feedback/Tag.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"TextField","sourcePath":"components/forms/TextField.jsx"},{"name":"SearchField","sourcePath":"components/forms/TextField.jsx"},{"name":"Cover","sourcePath":"components/media/Cover.jsx"},{"name":"ICON_NAMES","sourcePath":"components/media/Icon.jsx"},{"name":"Icon","sourcePath":"components/media/Icon.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"Heading","sourcePath":"components/surfaces/Card.jsx"},{"name":"Disclosure","sourcePath":"components/surfaces/Disclosure.jsx"},{"name":"Popup","sourcePath":"components/surfaces/Popup.jsx"},{"name":"ShapePanel","sourcePath":"components/surfaces/ShapePanel.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"d250968e8e98","components/actions/TextLink.jsx":"c27d39f10f18","components/feedback/Loader.jsx":"c73ab4148abc","components/feedback/ProgressBar.jsx":"4c208225b868","components/feedback/StatusMessage.jsx":"d26f3a1fef7e","components/feedback/Tag.jsx":"f816c78984dc","components/forms/Checkbox.jsx":"855feb3266b9","components/forms/TextField.jsx":"b114099835d3","components/media/Cover.jsx":"a4fb1618559f","components/media/Icon.jsx":"5e6ef54ea41b","components/press.js":"4f94d27dbfac","components/surfaces/Card.jsx":"a5c7c772f3be","components/surfaces/Disclosure.jsx":"e56f91fb306d","components/surfaces/Popup.jsx":"1262ca88192d","components/surfaces/ShapePanel.jsx":"6edec3eab900","ui_kits/shop/Screens.jsx":"2f3d2a278735"},"inlinedExternals":[],"unexposedExports":[{"name":"usePress","sourcePath":"components/press.js"}]} */

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

// components/media/Icon.jsx
try { (() => {
const A = 'fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="miter"';
const LINE = {
  search: '<g ' + A + '><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></g>',
  back: '<g ' + A + '><path d="M20 12H5"/><path d="M11 5L4 12L11 19"/></g>',
  close: '<g ' + A + '><path d="M5 5L19 19M19 5L5 19"/></g>',
  lock: '<g ' + A + '><path d="M4.5 11H19.5V21H4.5Z"/><path d="M8 11V5H16V11"/><path d="M12 15V17"/></g>',
  play: '<g ' + A + '><path d="M7 4L19 12L7 20Z"/></g>',
  settings: '<g ' + A + '><path d="M4 6H11M17 6H20"/><path d="M4 12H6M12 12H20"/><path d="M4 18H13M19 18H20"/><path d="M11 4H17V8H11Z"/><path d="M6 10H12V14H6Z"/><path d="M13 16H19V20H13Z"/></g>'
};
const SOLID = {
  search: '<g fill="currentColor"><path fill-rule="evenodd" d="M10.5 3a7.5 7.5 0 1 0 0 15a7.5 7.5 0 0 0 0-15Z M10.5 6a4.5 4.5 0 1 1 0 9a4.5 4.5 0 0 1 0-9Z"/><path d="M15.2 17.3L17.3 15.2L22.3 20.2L20.2 22.3Z"/></g>',
  back: '<g fill="currentColor"><path d="M11 4L2.5 12L11 20V15H21.5V9H11Z"/></g>',
  close: '<g fill="currentColor"><path d="M4.6 7.4L7.4 4.6L12 9.2L16.6 4.6L19.4 7.4L14.8 12L19.4 16.6L16.6 19.4L12 14.8L7.4 19.4L4.6 16.6L9.2 12Z"/></g>',
  lock: '<g fill="currentColor"><path fill-rule="evenodd" d="M4 10H20V21H4Z M11 13.5H13V17.5H11Z"/><path d="M7 10V4H17V10H14.5V6.5H9.5V10Z"/></g>',
  play: '<g fill="currentColor"><path d="M6 3L20 12L6 21Z"/></g>',
  settings: '<g fill="currentColor"><path d="M4 5H10V7H4Z"/><path d="M11 3H16V9H11Z"/><path d="M17 5H20V7H17Z"/><path d="M4 11H6V13H4Z"/><path d="M7 9H12V15H7Z"/><path d="M13 11H20V13H13Z"/><path d="M4 17H14V19H4Z"/><path d="M15 15H20V21H15Z"/></g>'
};
const UI = {
  check: '<g fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="square" stroke-linejoin="miter"><path d="M4.5 12.5L9.5 17.5L19.5 6.5"/></g>',
  warn: '<g ' + A + '><path d="M12 3L22 20H2Z"/><path d="M12 10V14M12 16.5V17.5"/></g>',
  error: '<g ' + A + '><circle cx="12" cy="12" r="9"/><path d="M12 7V13M12 16V17"/></g>',
  down: '<g ' + A + '><path d="M5 9L12 16L19 9"/></g>'
};
const ICON_NAMES = [...Object.keys(LINE), ...Object.keys(UI)];
function Icon({
  name,
  variant = 'line',
  size = 20,
  className = '',
  style,
  label
}) {
  const body = UI[name] || (variant === 'solid' ? SOLID : LINE)[name];
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
    variant: "solid",
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
  const v = variant === 'secondary' ? 'mcp-btn-secondary' : variant === 'danger' ? 'mcp-btn-danger' : 'mcp-btn-main';
  const cls = ['mcp-btn', v, block && 'is-block', pressed && !disabled && !loading && 'is-pressed', loading && 'is-busy', done && 'is-done', className].filter(Boolean).join(' ');
  let content;
  if (loading) content = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
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
    "aria-busy": loading || undefined,
    onClick: loading ? undefined : onClick
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
function Card({
  title,
  children,
  className = '',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ('mcp-card ' + className).trim(),
    style: style
  }, title && /*#__PURE__*/React.createElement("h3", {
    className: "mcp-t-card"
  }, title), children);
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
  posture = 'auto',
  breakpoint = 640,
  contained = false,
  label
}) {
  const wide = useWide(breakpoint);
  const mode = posture === 'auto' ? wide ? 'window' : 'sheet' : posture;
  const ref = React.useRef(null);
  const opener = React.useRef(null);
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
        if (e.key === 'Escape') onClose && onClose();
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
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: 'mcp-pop is-' + mode,
    role: "dialog",
    "aria-modal": "true",
    "aria-label": label || title
  }, title && /*#__PURE__*/React.createElement("h3", {
    className: "mcp-t-card"
  }, title), children, actions && /*#__PURE__*/React.createElement("div", {
    className: "mcp-btn-pair"
  }, actions)));
}
Object.assign(__ds_scope, { Popup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Popup.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/ShapePanel.jsx
try { (() => {
function ShapePanel({
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
Object.assign(__ds_scope, { ShapePanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/ShapePanel.jsx", error: String((e && e.message) || e) }); }

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
  ShapePanel,
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
  }, "Small games you play by talking to Claude or ChatGPT. New ones every day.")), /*#__PURE__*/React.createElement("section", {
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
    onClick: () => setAdded(true)
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
    onClose: () => setConfirm(false),
    title: "Delete this save?",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => setConfirm(false)
    }, "Keep it"), /*#__PURE__*/React.createElement(Button, {
      variant: "danger",
      onClick: () => {
        setConfirm(false);
        setDeleted(true);
      }
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
  const submit = e => {
    e.preventDefault();
    setTried(true);
    if (!email.includes('@')) setTimeout(() => r.current && r.current.focus(), 0);else onDone();
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
  }, /*#__PURE__*/React.createElement(ShapePanel, {
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
    type: "submit"
  }, "Sign in"), /*#__PURE__*/React.createElement(Button, {
    type: "submit"
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

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Heading = __ds_scope.Heading;

__ds_ns.Disclosure = __ds_scope.Disclosure;

__ds_ns.Popup = __ds_scope.Popup;

__ds_ns.ShapePanel = __ds_scope.ShapePanel;

})();
