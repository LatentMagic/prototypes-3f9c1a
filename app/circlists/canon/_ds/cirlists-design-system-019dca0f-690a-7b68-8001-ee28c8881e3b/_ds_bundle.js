/* @ds-bundle: {"format":4,"namespace":"LatentPulseDesignSystemV010_019dca","components":[{"name":"Avatar","sourcePath":"components/avatar/Avatar.jsx"},{"name":"Ring","sourcePath":"components/button/Button.jsx"},{"name":"Button","sourcePath":"components/button/Button.jsx"},{"name":"Spinner","sourcePath":"components/button/Button.jsx"},{"name":"Field","sourcePath":"components/field/Field.jsx"},{"name":"ICONS","sourcePath":"components/icon/Icon.jsx"},{"name":"Icon","sourcePath":"components/icon/Icon.jsx"},{"name":"LogoMark","sourcePath":"components/logo-mark/LogoMark.jsx"},{"name":"Overlay","sourcePath":"components/overlay/Overlay.jsx"},{"name":"Dialog","sourcePath":"components/overlay/Overlay.jsx"},{"name":"Menu","sourcePath":"components/overlay/Overlay.jsx"},{"name":"MenuItem","sourcePath":"components/overlay/Overlay.jsx"},{"name":"MenuSeparator","sourcePath":"components/overlay/Overlay.jsx"},{"name":"Panel","sourcePath":"components/overlay/Overlay.jsx"}],"sourceHashes":{"components/avatar/Avatar.jsx":"fd297aebd7da","components/button/Button.jsx":"153737f985ed","components/field/Field.jsx":"674e8252e4dc","components/icon/Icon.jsx":"06e74568c82f","components/logo-mark/LogoMark.jsx":"abbea239e2ee","components/overlay/Overlay.jsx":"a84ebea75e5c"},"inlinedExternals":[],"unexposedExports":[{"name":"initialsOf","sourcePath":"components/avatar/Avatar.jsx"}]} */

(() => {

const __ds_ns = (window.LatentPulseDesignSystemV010_019dca = window.LatentPulseDesignSystemV010_019dca || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/avatar/Avatar.jsx
try { (() => {
// Lifted from the Circlists prototype, app/primitives.jsx (Avatar + initialsOf).
function initialsOf(name) {
  if (!name) return '··';
  const parts = name.trim().replace(/\.$/, '').split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
function Avatar({
  name,
  size = 34,
  accent = false
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      flexShrink: 0,
      background: accent ? 'var(--color-accent)' : 'var(--color-surface-sunken)',
      color: accent ? '#fff' : 'var(--color-fg-1)',
      border: accent ? 'none' : '1px solid var(--color-border-1)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      fontFamily: 'var(--font-sans)',
      fontWeight: 600,
      fontSize: size * 0.36,
      letterSpacing: '0.01em'
    }
  }, initialsOf(name));
}
Object.assign(__ds_scope, { initialsOf, Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/avatar/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/button/Button.jsx
try { (() => {
// Lifted from the Circlists prototype, app/primitives.jsx (Button + Spinner, here named Ring).
// Hover/press states live in components/components.css (.circ-btn-*).
// Working state (`loading`): from the press until the result the button shows a ring and
// cannot be pressed again. It stays focusable (aria-disabled, not disabled) so focus is not
// dumped to the page, and announces itself busy. The brand spinner never sits in a button.
// Ring: the plain in-button ring. Not the brand spinner (assets/brand/motion/circlists-spinner.svg).
function Ring({
  size = 14,
  light = true
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "circ-spin",
    "aria-hidden": "true",
    style: {
      width: size,
      height: size,
      borderColor: light ? 'rgba(255,255,255,0.4)' : 'rgba(10,10,10,0.18)',
      borderTopColor: light ? '#fff' : 'var(--color-fg-1)'
    }
  });
}
function Button({
  variant = 'primary',
  loading = false,
  icon,
  children,
  full = false,
  size = 'md',
  type = 'button',
  onClick,
  disabled,
  style,
  title,
  autoFocus,
  name,
  ...rest
}) {
  const pad = size === 'lg' ? '14px 22px' : size === 'sm' ? '8px 12px' : '11px 18px';
  const minH = size === 'lg' ? 52 : size === 'sm' ? 36 : 44;
  const base = {
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    fontSize: size === 'lg' ? 16 : 14,
    lineHeight: 1,
    padding: pad,
    borderRadius: 'var(--radius-md)',
    border: 0,
    minHeight: minH,
    width: full ? '100%' : 'auto',
    cursor: loading || disabled ? 'default' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'background var(--duration-base) var(--ease-quiet)',
    opacity: disabled && !loading ? 0.45 : 1,
    whiteSpace: 'nowrap'
  };
  const variants = {
    primary: {
      background: 'var(--color-accent)',
      color: '#fff'
    },
    secondary: {
      background: 'var(--color-surface)',
      color: 'var(--color-fg-1)',
      border: '1px solid var(--color-border-1)',
      fontWeight: 500
    },
    tertiary: {
      background: 'transparent',
      color: 'var(--color-fg-1)',
      fontWeight: 500,
      padding: size === 'sm' ? '8px 6px' : '11px 6px',
      minHeight: minH
    },
    'destructive-secondary': {
      background: 'var(--color-surface)',
      color: 'var(--color-destructive)',
      border: '1px solid var(--color-border-1)',
      fontWeight: 500
    },
    destructive: {
      background: 'var(--color-destructive)',
      color: '#fff'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-fg-2)',
      fontWeight: 500,
      border: '1px solid var(--color-border-1)'
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled && !loading,
    title: title,
    autoFocus: autoFocus,
    name: name,
    onClick: e => {
      if (loading) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onClick && onClick(e);
    },
    "aria-disabled": loading || undefined,
    "aria-busy": loading || undefined,
    "aria-label": rest['aria-label'],
    "aria-expanded": rest['aria-expanded'],
    "aria-haspopup": rest['aria-haspopup'],
    "aria-controls": rest['aria-controls'],
    className: 'circ-btn circ-btn-' + variant,
    style: {
      ...base,
      ...variants[variant],
      ...(style || {})
    }
  }, loading && /*#__PURE__*/React.createElement(Ring, {
    light: variant === 'primary' || variant === 'destructive'
  }), !loading && icon, children && /*#__PURE__*/React.createElement("span", null, children));
}

/** @deprecated Use Ring. */
const Spinner = Ring;
Object.assign(__ds_scope, { Ring, Button, Spinner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/button/Button.jsx", error: String((e && e.message) || e) }); }

// components/field/Field.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Lifted from the Circlists prototype, app/primitives.jsx (Field).
// Input text is 16px (governance text-input floor). Errors sit inline, under the field.
function Field({
  label,
  hint,
  error,
  mono = false,
  suffix,
  ...rest
}) {
  const id = rest.id || rest.name;
  const xPath = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 'var(--space-4)'
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      display: 'block',
      marginBottom: 6,
      fontFamily: 'var(--font-sans)',
      fontWeight: 500,
      fontSize: 13,
      color: 'var(--color-fg-2)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: id
  }, rest, {
    "aria-invalid": error ? true : undefined,
    style: {
      width: '100%',
      boxSizing: 'border-box',
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
      fontWeight: mono ? 500 : 400,
      fontSize: 16,
      color: 'var(--color-fg-1)',
      border: '1px solid ' + (error ? 'var(--color-destructive)' : 'var(--color-border-1)'),
      borderRadius: 'var(--radius-md)',
      padding: '12px 14px',
      minHeight: 44,
      background: 'var(--color-surface)',
      transition: 'border-color var(--duration-base)',
      ...(rest.style || {})
    }
  })), suffix), error && /*#__PURE__*/React.createElement("div", {
    role: "alert",
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 6,
      marginTop: 7,
      fontFamily: 'var(--font-sans)',
      fontWeight: 500,
      fontSize: 13,
      lineHeight: 1.4,
      color: 'var(--color-destructive)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 1,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    style: {
      display: 'block'
    },
    "aria-hidden": "true",
    dangerouslySetInnerHTML: {
      __html: xPath
    }
  })), /*#__PURE__*/React.createElement("span", null, error)), hint && !error && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 7,
      fontFamily: 'var(--font-sans)',
      fontWeight: 400,
      fontSize: 13,
      lineHeight: 1.4,
      color: 'var(--color-fg-3)'
    }
  }, hint));
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/field/Field.jsx", error: String((e && e.message) || e) }); }

// components/icon/Icon.jsx
try { (() => {
// Lifted from the Circlists prototype, app/primitives.jsx (LP_ICONS + Icon).
// 24px viewBox, 1.5px stroke, round caps/joins, currentColor.
const ICONS = {
  plus: '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>',
  check: '<polyline points="20 6 9 17 4 12"></polyline>',
  x: '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>',
  trash: '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>',
  'external-link': '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>',
  'arrow-left': '<line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>',
  'arrow-right': '<line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>',
  menu: '<line x1="4" y1="7" x2="20" y2="7"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="17" x2="14" y2="17"></line>',
  'menu-open': '<line x1="4" y1="7" x2="20" y2="7"></line><line x1="10" y1="12" x2="20" y2="12"></line><line x1="4" y1="17" x2="20" y2="17"></line><polyline points="7 9 4 12 7 15"></polyline>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
  share: '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line>',
  'chevron-right': '<polyline points="9 18 15 12 9 6"></polyline>',
  'chevron-down': '<polyline points="6 9 12 15 18 9"></polyline>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>',
  link: '<path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5"></path><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5"></path>',
  settings: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.830-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line>',
  crown: '<path d="m2 20 1.7-11L8 13l4-7 4 7 4.3-4L22 20z"></path><line x1="2" y1="20" x2="22" y2="20"></line>',
  edit: '<path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>',
  'more-vertical': '<circle cx="12" cy="5" r="1.6" fill="currentColor" stroke="none"></circle><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"></circle><circle cx="12" cy="19" r="1.6" fill="currentColor" stroke="none"></circle>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-10 6L2 7"></path>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>',
  feed: '<line x1="9" y1="6" x2="20" y2="6"></line><line x1="9" y1="12" x2="20" y2="12"></line><line x1="9" y1="18" x2="20" y2="18"></line><circle cx="4.5" cy="6" r="1.2" fill="currentColor" stroke="none"></circle><circle cx="4.5" cy="12" r="1.2" fill="currentColor" stroke="none"></circle><circle cx="4.5" cy="18" r="1.2" fill="currentColor" stroke="none"></circle>',
  circles: '<circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="3.5"></circle>',
  home: '<path d="M3 10.5 12 3l9 7.5"></path><path d="M5.5 9.2V20a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.2"></path>',
  sparkle: '<path d="M12 3v6"></path><path d="M12 15v6"></path><path d="M3 12h6"></path><path d="M15 12h6"></path>',
  bookmark: '<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"></path>',
  'bookmark-filled': '<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" fill="currentColor" stroke="none"></path>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>',
  'bell-filled': '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" fill="currentColor"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>',
  search: '<circle cx="11" cy="11" r="7"></circle><line x1="20" y1="20" x2="16.65" y2="16.65"></line>'
};
function Icon({
  name,
  size = 20,
  color = 'currentColor',
  style = {},
  strokeWidth = 1.5
}) {
  if (name === 'google') {
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      style: {
        display: 'block',
        ...style
      },
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("path", {
      fill: "#4285F4",
      d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
    }), /*#__PURE__*/React.createElement("path", {
      fill: "#34A853",
      d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.930-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
    }), /*#__PURE__*/React.createElement("path", {
      fill: "#FBBC05",
      d: "M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
    }), /*#__PURE__*/React.createElement("path", {
      fill: "#EA4335",
      d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
    }));
  }
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      display: 'block',
      ...style
    },
    "aria-hidden": "true",
    dangerouslySetInnerHTML: {
      __html: ICONS[name] || ''
    }
  });
}
Object.assign(__ds_scope, { ICONS, Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icon/Icon.jsx", error: String((e && e.message) || e) }); }

// components/logo-mark/LogoMark.jsx
try { (() => {
// Lifted from the Circlists prototype, app/primitives.jsx (LogoMark).
// Brand pack §2: opaque sage halo r22.5, emerald disc r14.25, white ring r14.925 / 1.35.
function LogoMark({
  size = 24
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 48 48",
    role: "img",
    "aria-label": "Circlists",
    style: {
      display: 'block',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "24",
    r: "22.5",
    fill: "var(--color-sage, #8BBFAD)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "24",
    r: "14.25",
    fill: "var(--color-accent, #047857)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "24",
    cy: "24",
    r: "14.925",
    fill: "none",
    stroke: "#ffffff",
    strokeWidth: 1.35
  }));
}
Object.assign(__ds_scope, { LogoMark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/logo-mark/LogoMark.jsx", error: String((e && e.message) || e) }); }

// components/overlay/Overlay.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// The three overlay kinds of ui-design.md § Responsive and adaptive design.
// Dialog and Menu keep one shape at every width; only Panel changes shape on a phone.
// Motion and pseudo-states live in components/components.css (.circ-ov-*).

const FOCUSABLE = 'button:not([disabled]),[href],input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';

// Focus contract shared by every kind: take focus on open, trap Tab (modal kinds),
// Escape closes, focus returns to the opener on close (ui-design.md § Focus restoration).
function useOverlayFocus(ref, open, onClose, {
  initialFocusRef,
  trap = true,
  restoreTo
} = {}) {
  React.useEffect(() => {
    if (!open) return;
    const opener = restoreTo && restoreTo.current || document.activeElement;
    const el = ref.current;
    const first = initialFocusRef && initialFocusRef.current || el && el.querySelector(FOCUSABLE) || el;
    first && first.focus && first.focus();
    function onKey(e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose && onClose();
        return;
      }
      if (trap && e.key === 'Tab' && el) {
        const f = [...el.querySelectorAll(FOCUSABLE)];
        if (!f.length) return;
        const a = f[0],
          z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          z.focus();
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault();
          a.focus();
        }
      }
    }
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      if (opener && opener.focus && document.contains(opener)) opener.focus();
    };
  }, [open]);
}
function useOutsidePress(open, refs, onClose) {
  React.useEffect(() => {
    if (!open) return;
    function onDown(e) {
      if (!refs.some(r => r && r.current && r.current.contains(e.target))) onClose && onClose();
    }
    document.addEventListener('pointerdown', onDown, true);
    return () => document.removeEventListener('pointerdown', onDown, true);
  }, [open]);
}
function useWide(breakpoint, force) {
  const q = '(min-width: ' + breakpoint + 'px)';
  const [wide, setWide] = React.useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  React.useEffect(() => {
    const m = window.matchMedia(q);
    const f = () => setWide(m.matches);
    m.addEventListener('change', f);
    f();
    return () => m.removeEventListener('change', f);
  }, [q]);
  return force === 'sheet' ? false : force === 'desktop' ? true : wide;
}
const titleStyle = {
  font: '600 var(--text-2xl)/1.3 var(--font-sans)',
  letterSpacing: '-0.01em',
  color: 'var(--color-fg-1)',
  margin: 0,
  textWrap: 'balance'
};
const bodyStyle = {
  font: '400 15px/1.55 var(--font-sans)',
  color: 'var(--color-fg-2)',
  margin: '8px 0 0',
  textWrap: 'pretty'
};
function Scrim({
  contained,
  onPress,
  align = 'center',
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "circ-ov-fade",
    onPointerDown: e => {
      if (e.target === e.currentTarget) onPress && onPress();
    },
    style: {
      position: contained ? 'absolute' : 'fixed',
      inset: 0,
      background: 'var(--color-scrim)',
      zIndex: 50,
      display: 'flex',
      justifyContent: 'center',
      alignItems: align === 'bottom' ? 'flex-end' : 'center',
      padding: align === 'bottom' ? 0 : 'var(--space-4)'
    }
  }, children);
}

/** One entry point with the kind as its input. Only kind="panel" ever swaps to a sheet. */
function Overlay({
  kind = 'dialog',
  ...props
}) {
  return kind === 'menu' ? /*#__PURE__*/React.createElement(Menu, props) : kind === 'panel' ? /*#__PURE__*/React.createElement(Panel, props) : /*#__PURE__*/React.createElement(Dialog, props);
}
let uid = 0;
function useId(p) {
  const r = React.useRef(null);
  if (!r.current) r.current = p + '-' + ++uid;
  return r.current;
}

/** Dialog: one question or one short edit. Centred at every width, never scrolls, never a sheet. */
function Dialog({
  open = true,
  onClose,
  title,
  description,
  children,
  actions,
  initialFocusRef,
  width = 400,
  contained = false,
  style
}) {
  const ref = React.useRef(null);
  const tid = useId('circ-dlg-t'),
    did = useId('circ-dlg-d');
  useOverlayFocus(ref, open, onClose, {
    initialFocusRef
  });
  if (!open) return null;
  return /*#__PURE__*/React.createElement(Scrim, {
    contained: contained,
    onPress: onClose
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": tid,
    "aria-describedby": description ? did : undefined,
    className: "circ-ov-pop",
    tabIndex: -1,
    style: {
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-overlay)',
      padding: 'var(--space-6)',
      width: '100%',
      maxWidth: width,
      boxSizing: 'border-box',
      overflow: 'hidden',
      outline: 'none',
      ...(style || {})
    }
  }, /*#__PURE__*/React.createElement("h2", {
    id: tid,
    style: titleStyle
  }, title), description && /*#__PURE__*/React.createElement("p", {
    id: did,
    style: bodyStyle
  }, description), children && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)'
    }
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
      gap: 'var(--space-2)',
      marginTop: 'var(--space-5)'
    }
  }, actions)));
}

/** Menu: a short list of commands at its control. Place it beside the trigger inside a
 *  position:relative wrapper; it opens there at every width. Choosing an item closes it. */
function Menu({
  open = true,
  onClose,
  anchorRef,
  label,
  align = 'end',
  children,
  width = 220,
  style
}) {
  const ref = React.useRef(null);
  useOverlayFocus(ref, open, onClose, {
    trap: false,
    restoreTo: anchorRef
  });
  useOutsidePress(open, [ref, anchorRef], onClose);
  if (!open) return null;
  function onKey(e) {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const items = [...ref.current.querySelectorAll('[role^="menuitem"]')];
    const i = items.indexOf(document.activeElement);
    const n = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    items[n] && items[n].focus();
  }
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    role: "menu",
    "aria-label": label,
    onKeyDown: onKey,
    className: "circ-ov-pop",
    onClick: e => {
      if (e.target.closest('[role^="menuitem"]')) onClose && onClose();
    },
    style: {
      position: 'absolute',
      top: 'calc(100% + 4px)',
      [align === 'end' ? 'right' : 'left']: 0,
      zIndex: 40,
      width,
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border-1)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-raised)',
      padding: 4,
      boxSizing: 'border-box',
      ...(style || {})
    }
  }, children);
}
function MenuItem({
  icon,
  destructive = false,
  onClick,
  children,
  checked
}) {
  const role = checked === undefined ? 'menuitem' : 'menuitemcheckbox';
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: role,
    "aria-checked": checked,
    onClick: onClick,
    className: "circ-ov-item",
    tabIndex: -1,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      width: '100%',
      minHeight: 44,
      padding: '0 12px',
      border: 0,
      background: 'transparent',
      borderRadius: 'var(--radius-md)',
      font: '500 14px var(--font-sans)',
      cursor: 'pointer',
      textAlign: 'left',
      color: destructive ? 'var(--color-destructive)' : 'var(--color-fg-1)'
    }
  }, icon, children);
}
function MenuSeparator() {
  return /*#__PURE__*/React.createElement("div", {
    role: "separator",
    style: {
      height: 1,
      background: 'var(--color-border-2)',
      margin: '4px 8px'
    }
  });
}

/** Panel: anything the user stays in and works with. A bottom sheet below `breakpoint`;
 *  at and above it, anchored to its control (popover, no scrim) or centred (modal, scrim). */
function Panel({
  open = true,
  onClose,
  title,
  children,
  footer,
  breakpoint = 640,
  desktop = 'centred',
  anchorRef,
  force = 'auto',
  width = 400,
  contained = false,
  align = 'end',
  style
}) {
  const ref = React.useRef(null);
  const tid = useId('circ-pnl-t');
  const wide = useWide(breakpoint, force);
  const anchored = wide && desktop === 'anchored';
  useOverlayFocus(ref, open, onClose, {
    trap: !anchored,
    restoreTo: anchorRef
  });
  useOutsidePress(open && anchored, [ref, anchorRef], onClose);
  React.useEffect(() => {
    if (!open || contained || anchored) return;
    const o = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = o;
    };
  }, [open, contained, anchored]);
  if (!open) return null;
  const head = title && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5) var(--space-6) 0'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    id: tid,
    style: {
      ...titleStyle,
      fontSize: 'var(--text-xl)'
    }
  }, title));
  const body = /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4) var(--space-6)',
      overflowY: 'auto',
      flex: '1 1 auto',
      minHeight: 0
    }
  }, children);
  const foot = footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
      gap: 'var(--space-2)',
      padding: '0 var(--space-6) var(--space-5)'
    }
  }, footer);
  const box = {
    background: 'var(--color-surface)',
    boxShadow: 'var(--shadow-overlay)',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    outline: 'none',
    overflow: 'hidden'
  };
  const a11y = {
    role: 'dialog',
    'aria-labelledby': title ? tid : undefined,
    tabIndex: -1
  };
  if (anchored) {
    return /*#__PURE__*/React.createElement("div", _extends({
      ref: ref
    }, a11y, {
      className: "circ-ov-pop",
      style: {
        ...box,
        position: 'absolute',
        top: 'calc(100% + 8px)',
        [align === 'end' ? 'right' : 'left']: 0,
        zIndex: 40,
        width,
        maxHeight: 'min(560px, 70vh)',
        border: '1px solid var(--color-border-1)',
        borderRadius: 'var(--radius-lg)',
        ...(style || {})
      }
    }), head, body, foot);
  }
  return /*#__PURE__*/React.createElement(Scrim, {
    contained: contained,
    onPress: onClose,
    align: wide ? 'center' : 'bottom'
  }, /*#__PURE__*/React.createElement("div", _extends({
    ref: ref
  }, a11y, {
    "aria-modal": "true",
    className: wide ? 'circ-ov-pop' : 'circ-ov-sheet',
    style: wide ? {
      ...box,
      width: '100%',
      maxWidth: width,
      maxHeight: '85%',
      borderRadius: 'var(--radius-lg)',
      ...(style || {})
    } : {
      ...box,
      width: '100%',
      maxHeight: '85%',
      borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
      paddingBottom: 'env(safe-area-inset-bottom)',
      ...(style || {})
    }
  }), head, body, foot));
}
Object.assign(__ds_scope, { Overlay, Dialog, Menu, MenuItem, MenuSeparator, Panel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/Overlay.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Ring = __ds_scope.Ring;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Spinner = __ds_scope.Spinner;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.ICONS = __ds_scope.ICONS;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.LogoMark = __ds_scope.LogoMark;

__ds_ns.Overlay = __ds_scope.Overlay;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Menu = __ds_scope.Menu;

__ds_ns.MenuItem = __ds_scope.MenuItem;

__ds_ns.MenuSeparator = __ds_scope.MenuSeparator;

__ds_ns.Panel = __ds_scope.Panel;

})();
