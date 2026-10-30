/* @ds-bundle: {"format":4,"namespace":"MCPGameStoreDesignSystem_ef1abd","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"ButtonPair","sourcePath":"components/actions/Button.jsx"},{"name":"TextLink","sourcePath":"components/actions/TextLink.jsx"},{"name":"ChoiceButtons","sourcePath":"components/chat/ChoiceButtons.jsx"},{"name":"ClueCards","sourcePath":"components/chat/ClueCards.jsx"},{"name":"ConfirmCard","sourcePath":"components/chat/ConfirmCard.jsx"},{"name":"EntityCards","sourcePath":"components/chat/EntityCards.jsx"},{"name":"FactRows","sourcePath":"components/chat/FactRows.jsx"},{"name":"MenuRows","sourcePath":"components/chat/MenuRows.jsx"},{"name":"NavButtons","sourcePath":"components/chat/NavButtons.jsx"},{"name":"ResultCard","sourcePath":"components/chat/ResultCard.jsx"},{"name":"RollLine","sourcePath":"components/chat/RollLine.jsx"},{"name":"StatRow","sourcePath":"components/chat/StatRow.jsx"},{"name":"StatusTag","sourcePath":"components/chat/StatusTag.jsx"},{"name":"TileGrid","sourcePath":"components/chat/TileGrid.jsx"},{"name":"Track","sourcePath":"components/chat/Track.jsx"},{"name":"WordBoard","sourcePath":"components/chat/WordBoard.jsx"},{"name":"Loader","sourcePath":"components/feedback/Loader.jsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.jsx"},{"name":"StatusMessage","sourcePath":"components/feedback/StatusMessage.jsx"},{"name":"Tag","sourcePath":"components/feedback/Tag.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"TextField","sourcePath":"components/forms/TextField.jsx"},{"name":"SearchField","sourcePath":"components/forms/TextField.jsx"},{"name":"ChatPicture","sourcePath":"components/media/ChatPicture.jsx"},{"name":"Cover","sourcePath":"components/media/Cover.jsx"},{"name":"GameArt","sourcePath":"components/media/GameArt.jsx"},{"name":"ICON_NAMES","sourcePath":"components/media/Icon.jsx"},{"name":"Icon","sourcePath":"components/media/Icon.jsx"},{"name":"ChatPlayback","sourcePath":"components/media/playback/ChatPlayback.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"Heading","sourcePath":"components/surfaces/Card.jsx"},{"name":"CardRow","sourcePath":"components/surfaces/CardRow.jsx"},{"name":"Disclosure","sourcePath":"components/surfaces/Disclosure.jsx"},{"name":"FormCard","sourcePath":"components/surfaces/FormCard.jsx"},{"name":"GameCard","sourcePath":"components/surfaces/GameCard.jsx"},{"name":"GamePick","sourcePath":"components/surfaces/GamePick.jsx"},{"name":"GameTile","sourcePath":"components/surfaces/GameTile.jsx"},{"name":"RowList","sourcePath":"components/surfaces/ListRow.jsx"},{"name":"ListRow","sourcePath":"components/surfaces/ListRow.jsx"},{"name":"Menu","sourcePath":"components/surfaces/Menu.jsx"},{"name":"MoveList","sourcePath":"components/surfaces/MoveRow.jsx"},{"name":"MoveRow","sourcePath":"components/surfaces/MoveRow.jsx"},{"name":"NeedsPass","sourcePath":"components/surfaces/NeedsPass.jsx"},{"name":"PageGrid","sourcePath":"components/surfaces/PageGrid.jsx"},{"name":"Popup","sourcePath":"components/surfaces/Popup.jsx"},{"name":"SoonCard","sourcePath":"components/surfaces/SoonCard.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"e9b7de29de70","components/actions/TextLink.jsx":"c27d39f10f18","components/chat/chat-press.js":"6e03f8f25294","components/chat/ChoiceButtons.jsx":"ef1432be3495","components/chat/ClueCards.jsx":"1076011d15a4","components/chat/ConfirmCard.jsx":"ed2c0356d5eb","components/chat/EntityCards.jsx":"82d661b65f58","components/chat/FactRows.jsx":"d31d5aaa8b25","components/chat/MenuRows.jsx":"38eb18d06fe3","components/chat/NavButtons.jsx":"805ce76faf8d","components/chat/ResultCard.jsx":"a466c8c49d2f","components/chat/RollLine.jsx":"6729394a122f","components/chat/StatRow.jsx":"0486006e5409","components/chat/StatusTag.jsx":"24ff23fd885b","components/chat/TileGrid.jsx":"b4c102af5f53","components/chat/Track.jsx":"52e742e598c4","components/chat/WordBoard.jsx":"ba79db7b917b","components/feedback/Loader.jsx":"c73ab4148abc","components/feedback/ProgressBar.jsx":"4c208225b868","components/feedback/StatusMessage.jsx":"d26f3a1fef7e","components/feedback/Tag.jsx":"ff0c91ecf52b","components/forms/Checkbox.jsx":"855feb3266b9","components/forms/TextField.jsx":"b114099835d3","components/media/ChatPicture.jsx":"953868a55bdb","components/media/Cover.jsx":"58ccd29ddc40","components/media/GameArt.jsx":"80ec58299013","components/media/Icon.jsx":"d86f4e425ed0","components/media/playback/ChatPlayback.jsx":"2b754c72f7ec","components/press.js":"894b196527ca","components/surfaces/Card.jsx":"5866138b458a","components/surfaces/CardRow.jsx":"45163922cc67","components/surfaces/Disclosure.jsx":"e56f91fb306d","components/surfaces/FormCard.jsx":"8e545dcfdcb5","components/surfaces/GameCard.jsx":"41cfed219103","components/surfaces/GamePick.jsx":"dd0548e5be10","components/surfaces/GameTile.jsx":"23c6af665050","components/surfaces/ListRow.jsx":"43f5ddb69d8e","components/surfaces/Menu.jsx":"79e87747cff5","components/surfaces/MoveRow.jsx":"2861e1d636c0","components/surfaces/NeedsPass.jsx":"2f0af79b834e","components/surfaces/PageGrid.jsx":"276b99e364b1","components/surfaces/Popup.jsx":"f0715a8a576a","components/surfaces/SoonCard.jsx":"f4eebe3c025b"},"inlinedExternals":[],"unexposedExports":[{"name":"cbPress","sourcePath":"components/chat/chat-press.js"},{"name":"cbRich","sourcePath":"components/chat/chat-press.js"},{"name":"chatParas","sourcePath":"components/media/ChatPicture.jsx"},{"name":"chatShell","sourcePath":"components/media/ChatPicture.jsx"},{"name":"chatTurn","sourcePath":"components/media/ChatPicture.jsx"},{"name":"needsPassCopy","sourcePath":"components/surfaces/NeedsPass.jsx"},{"name":"usePress","sourcePath":"components/press.js"}]} */
(function(React2) {
  "use strict";
  function usePress() {
    const [pressed, setPressed] = React2.useState(false);
    const t = React2.useRef(0);
    const down = () => {
      t.current = Date.now();
      setPressed(true);
    };
    const up = () => {
      setTimeout(() => setPressed(false), Math.max(0, 120 - (Date.now() - t.current)));
    };
    return { pressed, handlers: { onPointerDown: down, onPointerUp: up, onPointerCancel: up, onPointerLeave: up } };
  }
  const A = 'fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="miter"';
  const LINE = {
    search: "<g " + A + '><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></g>',
    back: "<g " + A + '><path d="M20 12H5"/><path d="M11 5L4 12L11 19"/></g>',
    close: "<g " + A + '><path d="M5 5L19 19M19 5L5 19"/></g>',
    lock: "<g " + A + '><path d="M4.5 11H19.5V21H4.5Z"/><path d="M8 11V5H16V11"/><path d="M12 15V17"/></g>',
    play: "<g " + A + '><path d="M7 4L19 12L7 20Z"/></g>',
    pause: "<g " + A + '><path d="M8 5V19M16 5V19"/></g>',
    settings: "<g " + A + '><path d="M4 6H11M17 6H20"/><path d="M4 12H6M12 12H20"/><path d="M4 18H13M19 18H20"/><path d="M11 4H17V8H11Z"/><path d="M6 10H12V14H6Z"/><path d="M13 16H19V20H13Z"/></g>',
    mail: "<g " + A + '><path d="M3 5.5H21V18.5H3Z"/><path d="M3.5 6.5L12 13L20.5 6.5"/></g>',
    logout: "<g " + A + '><path d="M10 4H4V20H10"/><path d="M15 8L19 12L15 16"/><path d="M19 12H9"/></g>',
    card: "<g " + A + '><path d="M2.5 5.5H21.5V18.5H2.5Z"/><path d="M2.5 10H21.5"/><path d="M6 15H10"/></g>'
  };
  const UI = {
    check: '<g fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="square" stroke-linejoin="miter"><path d="M4.5 12.5L9.5 17.5L19.5 6.5"/></g>',
    warn: "<g " + A + '><path d="M12 3L22 20H2Z"/><path d="M12 10V14M12 16.5V17.5"/></g>',
    error: "<g " + A + '><circle cx="12" cy="12" r="9"/><path d="M12 7V13M12 16V17"/></g>',
    down: "<g " + A + '><path d="M5 9L12 16L19 9"/></g>',
    send: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5"/></g>',
    next: "<g " + A + '><path d="M9 5L16 12L9 19"/></g>',
    out: "<g " + A + '><path d="M14 4H20V10"/><path d="M20 4L11 13"/><path d="M17 14V20H4V7H10"/></g>',
    share: "<g " + A + '><path d="M12 15V4"/><path d="M7.5 8.5L12 4L16.5 8.5"/><path d="M8 11H5V20H19V11H16"/></g>',
    list: "<g " + A + '><path d="M4 5H20V10H4Z"/><path d="M4 14H20V19H4Z"/></g>'
  };
  const ICON_NAMES = [...Object.keys(LINE), ...Object.keys(UI)];
  function Icon({ name, size = 20, className = "", style, label }) {
    const body = UI[name] || LINE[name];
    if (!body) return null;
    return /* @__PURE__ */ React2.createElement("svg", { className: ("mcp-ico " + className).trim(), viewBox: "0 0 24 24", width: size, height: size, style: { width: size, height: size, ...style }, role: label ? "img" : void 0, "aria-label": label, "aria-hidden": label ? void 0 : true, focusable: "false", dangerouslySetInnerHTML: { __html: body } });
  }
  function useHeld(on, min) {
    const [held, setHeld] = React2.useState(on);
    const t0 = React2.useRef(on ? Date.now() : 0);
    React2.useEffect(() => {
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
  function Button({ variant = "main", children, loading = false, loadingLabel, done = false, doneLabel, disabled = false, block = false, icon, type = "button", onClick, className = "", ...rest }) {
    const { pressed, handlers } = usePress();
    const [auto, setAuto] = React2.useState(false);
    const alive = React2.useRef(true);
    React2.useEffect(() => () => {
      alive.current = false;
    }, []);
    const busy = useHeld(loading || auto, 400);
    const click = (e) => {
      if (busy) {
        e.preventDefault();
        return;
      }
      const r = onClick && onClick(e);
      if (r && typeof r.then === "function") {
        setAuto(true);
        const end = () => {
          alive.current && setAuto(false);
        };
        r.then(end, end);
      }
    };
    const v = variant === "secondary" ? "mcp-btn-secondary" : variant === "danger" ? "mcp-btn-danger" : "mcp-btn-main";
    const cls = ["mcp-btn", v, block && "is-block", pressed && !disabled && !busy && "is-pressed", busy && "is-busy", done && !busy && "is-done", className].filter(Boolean).join(" ");
    let content;
    if (busy) content = /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement("span", { className: "mcp-spin", "aria-hidden": "true" }), loadingLabel || children);
    else if (doneLabel !== void 0) content = /* @__PURE__ */ React2.createElement("span", { className: "mcp-swap" }, /* @__PURE__ */ React2.createElement("span", { className: "a" }, icon && /* @__PURE__ */ React2.createElement(Icon, { name: icon }), children), /* @__PURE__ */ React2.createElement("span", { className: "b", "aria-hidden": !done }, /* @__PURE__ */ React2.createElement(Icon, { name: "check" }), doneLabel));
    else content = /* @__PURE__ */ React2.createElement(React2.Fragment, null, icon && /* @__PURE__ */ React2.createElement(Icon, { name: icon }), children);
    return /* @__PURE__ */ React2.createElement("button", { type, className: cls, disabled, "aria-busy": busy || void 0, "aria-disabled": busy || void 0, onClick: click, ...handlers, ...rest }, content);
  }
  function ButtonPair({ children, className = "" }) {
    return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-btn-pair " + className).trim() }, children);
  }
  function TextLink({ children, danger = false, href, onClick, className = "", ...rest }) {
    const { pressed, handlers } = usePress();
    const cls = ["mcp-lnk", danger && "is-danger", pressed && "is-pressed", className].filter(Boolean).join(" ");
    if (href) return /* @__PURE__ */ React2.createElement("a", { href, className: cls, onClick, ...handlers, ...rest }, children);
    return /* @__PURE__ */ React2.createElement("button", { type: "button", className: cls, onClick, ...handlers, ...rest }, children);
  }
  function cbPress(on, props, children) {
    if (on) return React2.createElement("button", { type: "button", onClick: on, ...props }, children);
    const { ["aria-pressed"]: _p, disabled: _d, ...rest } = props;
    return React2.createElement("span", rest, children);
  }
  function cbRich(t) {
    if (typeof t !== "string") return t;
    return t.split(/\*\*(.+?)\*\*/g).map((s, i) => i % 2 ? React2.createElement("b", { key: i }, s) : s);
  }
  function ChoiceButtons({ items = [], picked, onChoose, label, className = "" }) {
    const done = picked != null;
    return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-cb mcp-cb-choices " + className).trim(), role: "group", "aria-label": label || "Moves" }, items.map((it, i) => {
      const t = typeof it === "string" ? it : it.label;
      const p = done && (picked === i || picked === t);
      return cbPress(onChoose && !done && (() => onChoose(t, i)), { key: i, className: "mcp-cb-choice" + (p ? " is-picked" : done ? " is-spent" : ""), "aria-pressed": p }, /* @__PURE__ */ React2.createElement(React2.Fragment, null, p && /* @__PURE__ */ React2.createElement(Icon, { name: "check", size: 14 }), t));
    }));
  }
  function ClueCards({ groups = [], newLabel = "New", className = "" }) {
    return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-cb mcp-cb-clues mcp-cb-fence " + className).trim() }, groups.map((g, i) => /* @__PURE__ */ React2.createElement("section", { key: i, className: "mcp-cb-clue", "aria-label": g.kind }, /* @__PURE__ */ React2.createElement("p", { className: "mcp-cb-clue-h" }, /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-kind" }, g.kind), /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-clue-n" }, g.facts.length)), /* @__PURE__ */ React2.createElement("ul", null, g.facts.map((f, k) => {
      const t = typeof f === "string" ? { text: f } : f;
      return /* @__PURE__ */ React2.createElement("li", { key: k, className: t.new ? "is-new" : void 0 }, /* @__PURE__ */ React2.createElement("span", null, cbRich(t.text)), t.new && /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-new" }, newLabel));
    })))));
  }
  function FactRows({ items = [], plain = false, label, className = "" }) {
    return /* @__PURE__ */ React2.createElement("dl", { className: ("mcp-cb mcp-cb-facts" + (plain ? "" : " mcp-cb-fence") + " " + className).trim(), "aria-label": label }, items.map((f, i) => /* @__PURE__ */ React2.createElement("div", { key: i }, /* @__PURE__ */ React2.createElement("dt", null, f.label), /* @__PURE__ */ React2.createElement("dd", null, cbRich(f.value)))));
  }
  function ConfirmCard({ title, question, facts, note, confirm = "Confirm", cancel = "Cancel", answer, onConfirm, onCancel, className = "" }) {
    const done = answer === "confirm" || answer === "cancel";
    const btn = (k, text, on, main) => {
      const p = answer === k;
      return cbPress(!done && on, { className: "mcp-cb-choice" + (main ? " is-main" : "") + (p ? " is-picked" : done ? " is-spent" : ""), "aria-pressed": p }, /* @__PURE__ */ React2.createElement(React2.Fragment, null, p && /* @__PURE__ */ React2.createElement(Icon, { name: "check", size: 14 }), text));
    };
    return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-cb mcp-cb-fence mcp-cb-card mcp-cb-confirm " + className).trim(), role: "group", "aria-label": title || "Confirm" }, title && /* @__PURE__ */ React2.createElement("p", { className: "mcp-cb-title" }, title), question && /* @__PURE__ */ React2.createElement("p", { className: "mcp-cb-q" }, cbRich(question)), facts && facts.length > 0 && /* @__PURE__ */ React2.createElement(FactRows, { items: facts, plain: true }), note && /* @__PURE__ */ React2.createElement("p", { className: "mcp-cb-note" }, note), /* @__PURE__ */ React2.createElement("div", { className: "mcp-cb-pair" }, btn("cancel", cancel, onCancel, false), btn("confirm", confirm, onConfirm, true)));
  }
  function EntityCards({ title, items = [], onPick, className = "" }) {
    return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-cb mcp-cb-ents " + className).trim(), role: "group", "aria-label": title || "In the game" }, title && /* @__PURE__ */ React2.createElement("p", { className: "mcp-cb-kind" }, title), /* @__PURE__ */ React2.createElement("ul", { className: "mcp-cb-ents-list" }, items.map((it, i) => {
      const pic = it.pic ? /* @__PURE__ */ React2.createElement("img", { src: it.pic, alt: "" }) : it.icon ? /* @__PURE__ */ React2.createElement(Icon, { name: it.icon, size: 16 }) : null;
      return /* @__PURE__ */ React2.createElement("li", { key: i }, cbPress(onPick && (() => onPick(it, i)), { className: "mcp-cb-ent" + (it.state ? " is-" + it.state : ""), "aria-pressed": it.state === "picked" }, /* @__PURE__ */ React2.createElement(React2.Fragment, null, pic && /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-ent-pic " + (it.pic ? "is-" + (it.tone || "cream") : "is-icon"), "aria-hidden": "true" }, pic), /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-ent-t" }, /* @__PURE__ */ React2.createElement("b", null, it.name), it.line && /* @__PURE__ */ React2.createElement("small", null, it.line)))));
    })));
  }
  function StatusTag({ tone = "live", label, children, className = "" }) {
    return /* @__PURE__ */ React2.createElement("span", { className: ("mcp-cb mcp-cb-status is-" + tone + " " + className).trim() }, label ?? children);
  }
  const Art = ({ art, icon }) => typeof art === "string" ? art.trim().startsWith("<svg") ? /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-mart", "aria-hidden": "true", dangerouslySetInnerHTML: { __html: art } }) : /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-mart", "aria-hidden": "true" }, /* @__PURE__ */ React2.createElement("img", { src: art, alt: "" })) : /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-mart" + (art ? "" : " is-icon"), "aria-hidden": "true" }, art || icon && /* @__PURE__ */ React2.createElement(Icon, { name: icon, size: 18 }));
  function MenuRows({ items = [], search, onGo, onSearch, label, className = "" }) {
    return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-cb mcp-cb-fence mcp-cb-menu " + className).trim(), role: "group", "aria-label": label || "Menu" }, search && /* @__PURE__ */ React2.createElement("label", { className: "mcp-cb-search" }, /* @__PURE__ */ React2.createElement(Icon, { name: "search", size: 16 }), /* @__PURE__ */ React2.createElement("input", { type: "search", placeholder: search, "aria-label": search, readOnly: !onSearch, tabIndex: onSearch ? void 0 : -1, onChange: onSearch ? ((e) => onSearch(e.target.value)) : void 0 })), /* @__PURE__ */ React2.createElement("ul", null, items.map((it, i) => {
      const act = typeof it.action === "string" ? { label: it.action } : it.action;
      const st = typeof it.status === "string" ? { label: it.status, tone: "idle" } : it.status;
      return /* @__PURE__ */ React2.createElement("li", { key: i, className: "mcp-cb-mrow" }, /* @__PURE__ */ React2.createElement(Art, { art: it.art, icon: it.icon }), /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-mtext" }, /* @__PURE__ */ React2.createElement("b", null, it.name), it.line && /* @__PURE__ */ React2.createElement("small", null, it.line), (st || it.meta) && /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-mmeta" }, st && /* @__PURE__ */ React2.createElement(StatusTag, { tone: st.tone || "idle" }, st.label), it.meta && /* @__PURE__ */ React2.createElement("span", null, it.meta))), act && cbPress(onGo && (() => onGo(it, i)), { className: "mcp-cb-go" }, /* @__PURE__ */ React2.createElement(React2.Fragment, null, act.icon && /* @__PURE__ */ React2.createElement(Icon, { name: act.icon, size: 16 }), /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-go-t" }, act.label))));
    })));
  }
  function NavButtons({ items = [], stack = false, onGo, label, className = "" }) {
    return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-cb mcp-cb-nav" + (stack ? " is-stack" : "") + " " + className).trim(), role: "group", "aria-label": label || "Go to" }, items.map((it, i) => {
      const cls = "mcp-cb-go" + (it.out ? " is-out" : "");
      const body = /* @__PURE__ */ React2.createElement(React2.Fragment, null, it.icon && /* @__PURE__ */ React2.createElement(Icon, { name: it.icon, size: 16 }), /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-go-t" }, it.label, it.out && /* @__PURE__ */ React2.createElement("small", null, it.note || "Opens in your browser")), it.out && /* @__PURE__ */ React2.createElement(Icon, { name: "out", size: 16, className: "mcp-cb-go-out" }));
      if (it.href) return /* @__PURE__ */ React2.createElement("a", { key: i, className: cls, href: it.href, target: it.out ? "_blank" : void 0, rel: it.out ? "noopener" : void 0 }, body);
      return cbPress(onGo && (() => onGo(it, i)), { key: i, className: cls }, body);
    }));
  }
  function StatRow({ items = [], grid = false, label, className = "" }) {
    return /* @__PURE__ */ React2.createElement("dl", { className: ("mcp-cb mcp-cb-stats" + (grid ? " is-grid" : "") + " " + className).trim(), "aria-label": label, style: grid ? { "--cols": items.length === 3 ? 3 : Math.min(items.length, 2) } : void 0 }, items.map((s, i) => /* @__PURE__ */ React2.createElement("div", { key: i, className: "mcp-cb-stat" }, /* @__PURE__ */ React2.createElement("dt", null, s.label), /* @__PURE__ */ React2.createElement("dd", null, s.value))));
  }
  function ResultCard({ title, status, line, stats = [], actions = [], onGo, className = "" }) {
    const st = typeof status === "string" ? { label: status, tone: "won" } : status;
    return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-cb mcp-cb-fence mcp-cb-card mcp-cb-result " + className).trim(), role: "group", "aria-label": title || "Result" }, /* @__PURE__ */ React2.createElement("div", { className: "mcp-cb-result-head" }, title && /* @__PURE__ */ React2.createElement("p", { className: "mcp-cb-title" }, title), st && /* @__PURE__ */ React2.createElement(StatusTag, { tone: st.tone || "won" }, st.label)), line && /* @__PURE__ */ React2.createElement("p", { className: "mcp-cb-note" }, line), stats.length > 0 && /* @__PURE__ */ React2.createElement(StatRow, { items: stats, grid: true }), actions.length > 0 && /* @__PURE__ */ React2.createElement(NavButtons, { items: actions, onGo, stack: true }));
  }
  const TONE = { hit: "won", weak: "warn", miss: "lost" };
  const WORD = { hit: "Hit", weak: "Weak hit", miss: "Miss" };
  function RollLine({ label, die = "d20", roll, mod = 0, total, target, result = "hit", outcome, className = "" }) {
    const sum = total ?? roll + mod;
    const text = outcome || WORD[result] || "";
    const say = (label ? label + ": " : "") + die + " rolled " + roll + (mod ? (mod > 0 ? " plus " : " minus ") + Math.abs(mod) : "") + ", " + sum + (target != null ? " against " + target : "") + ". " + text + ".";
    return /* @__PURE__ */ React2.createElement("p", { className: ("mcp-cb mcp-cb-roll " + className).trim() }, /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-sr" }, say), /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-roll-in", "aria-hidden": "true" }, label && /* @__PURE__ */ React2.createElement("b", null, label), /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-die" }, die), /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-pip" }, roll), mod !== 0 && /* @__PURE__ */ React2.createElement("span", null, mod > 0 ? "+ " + mod : "− " + Math.abs(mod)), /* @__PURE__ */ React2.createElement("span", null, "= ", /* @__PURE__ */ React2.createElement("b", null, sum)), target != null && /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-roll-vs" }, "vs ", target)), /* @__PURE__ */ React2.createElement(StatusTag, { tone: TONE[result] || "idle", className: "mcp-cb-roll-out" }, text));
  }
  const MARK = { h: "hit", n: "near", x: "miss" };
  const SAY = { hit: "right place", near: "in it, wrong place", miss: "not in it", filled: "" };
  function TileGrid({ rows = [], length, count: count2, label, className = "" }) {
    const n = Math.max(1, length || Math.max(0, ...rows.map((r) => (r.letters || "").length)));
    const all = [...rows];
    while (count2 && all.length < count2) all.push({ letters: "" });
    const grid = all.map((r) => Array.from({ length: n }, (_, i) => {
      const c = ((r.letters || "")[i] || " ").trim();
      const s = c ? MARK[(r.marks || "")[i]] || "filled" : "empty";
      return { c, s };
    }));
    const say = label || grid.map((row, i) => "Row " + (i + 1) + (row.every((x) => x.s === "empty") ? " empty" : ": " + row.map((x) => x.c ? x.c + (SAY[x.s] ? " " + SAY[x.s] : "") : "blank").join(", "))).join(". ");
    return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-cb mcp-cb-tiles " + className).trim(), role: "img", "aria-label": say }, /* @__PURE__ */ React2.createElement("div", { className: "mcp-cb-tiles-in" + (all.length > 1 ? " mcp-cb-fence" : ""), style: { "--n": n } }, grid.map((row, i) => /* @__PURE__ */ React2.createElement("div", { key: i, className: "mcp-cb-tiles-row" }, row.map((x, k) => /* @__PURE__ */ React2.createElement("span", { key: k, className: "mcp-cb-tile is-" + x.s }, x.c))))));
  }
  function Track({ items = [], className = "" }) {
    return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-cb mcp-cb-track " + className).trim() }, items.map((t, i) => {
      const max = t.max || 6;
      const v = Math.max(0, Math.min(max, t.value || 0));
      const steps = t.steps ?? max <= 12;
      return /* @__PURE__ */ React2.createElement("div", { key: i, className: "mcp-cb-track-row is-" + (t.tone || "progress"), role: "meter", "aria-label": t.label, "aria-valuemin": 0, "aria-valuemax": max, "aria-valuenow": v, "aria-valuetext": v + " of " + max }, /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-track-l" }, t.label), steps ? /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-steps", "aria-hidden": "true" }, Array.from({ length: max }, (_, k) => /* @__PURE__ */ React2.createElement("i", { key: k, className: k < v ? "is-on" : void 0 }))) : /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-bar", "aria-hidden": "true" }, /* @__PURE__ */ React2.createElement("i", { style: { width: v / max * 100 + "%" } })), /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-track-n" }, v, " of ", max));
    }));
  }
  const TONES = ["amber", "teal", "orange", "lilac"];
  function WordBoard({ words = [], solved = [], picked = [], cols = 4, onPick, label, className = "" }) {
    const on = new Set(picked.map((w) => String(w).toUpperCase()));
    return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-cb mcp-cb-fence mcp-cb-board " + className).trim(), style: { "--cols": cols }, role: "group", "aria-label": label || "Word board" }, solved.map((g, i) => /* @__PURE__ */ React2.createElement("div", { key: "s" + i, className: "mcp-cb-band is-" + (g.tone || TONES[i % 4]) }, /* @__PURE__ */ React2.createElement("b", null, g.label), /* @__PURE__ */ React2.createElement("span", null, g.words.join(", ")))), words.length > 0 && /* @__PURE__ */ React2.createElement("div", { className: "mcp-cb-chips" }, words.map((w) => {
      const p = on.has(w.toUpperCase());
      return cbPress(onPick && (() => onPick(w)), { key: w, className: "mcp-cb-chip" + (p ? " is-picked" : ""), "aria-pressed": p }, w);
    })));
  }
  function Loader({ size = 64, label = "Loading" }) {
    return /* @__PURE__ */ React2.createElement("span", { className: "mcp-loader", role: "status", "aria-label": label, style: { width: size, height: size } }, /* @__PURE__ */ React2.createElement("span", { className: "mcp-loader-m", style: { zoom: size / 120 } }, /* @__PURE__ */ React2.createElement("i", { className: "tl" }), /* @__PURE__ */ React2.createElement("i", { className: "tr" }), /* @__PURE__ */ React2.createElement("i", { className: "br" }), /* @__PURE__ */ React2.createElement("i", { className: "bl" })));
  }
  function ProgressBar({ label, value = 0, max = 100, showValue = true }) {
    const pct = Math.max(0, Math.min(100, Math.round(value / max * 100)));
    return /* @__PURE__ */ React2.createElement("div", { className: "mcp-prog" }, (label || showValue) && /* @__PURE__ */ React2.createElement("div", { className: "mcp-prog-top" }, /* @__PURE__ */ React2.createElement("span", null, label), showValue && /* @__PURE__ */ React2.createElement("span", null, pct, "%")), /* @__PURE__ */ React2.createElement("div", { className: "mcp-track", role: "progressbar", "aria-valuenow": pct, "aria-valuemin": 0, "aria-valuemax": 100, "aria-label": label || "Progress" }, /* @__PURE__ */ React2.createElement("i", { style: { width: pct + "%" } })));
  }
  const G = { success: "check", warning: "warn", error: "error" };
  function StatusMessage({ kind = "success", children }) {
    return /* @__PURE__ */ React2.createElement("p", { className: "mcp-msg mcp-msg-" + kind, role: kind === "error" ? "alert" : "status" }, /* @__PURE__ */ React2.createElement(Icon, { name: G[kind] }), /* @__PURE__ */ React2.createElement("span", null, children));
  }
  function Tag({ kind = "daily", children, icon, go }) {
    const ic = icon || (kind === "locked" ? "lock" : null);
    const g = go ?? (kind === "locked" || kind === "open");
    return /* @__PURE__ */ React2.createElement("span", { className: "mcp-tag mcp-tag-" + kind + (g ? " has-go" : "") }, ic && /* @__PURE__ */ React2.createElement(Icon, { name: ic, size: 14 }), children, g && /* @__PURE__ */ React2.createElement(Icon, { name: "next", size: 14, className: "mcp-tag-go" }));
  }
  function Checkbox({ label, checked, defaultChecked, onChange, className = "", ...rest }) {
    return /* @__PURE__ */ React2.createElement("label", { className: ("mcp-check " + className).trim() }, /* @__PURE__ */ React2.createElement("input", { type: "checkbox", checked, defaultChecked, onChange, ...rest }), /* @__PURE__ */ React2.createElement("span", { className: "mcp-box" }, /* @__PURE__ */ React2.createElement("svg", { viewBox: "0 0 24 24", "aria-hidden": "true" }, /* @__PURE__ */ React2.createElement("g", { fill: "none", stroke: "currentColor", strokeWidth: "2.25", strokeLinecap: "square", strokeLinejoin: "miter" }, /* @__PURE__ */ React2.createElement("path", { d: "M4.5 12.5L9.5 17.5L19.5 6.5" })))), /* @__PURE__ */ React2.createElement("span", null, label));
  }
  function TextField({ label, id, error, hint, type = "text", value, defaultValue, placeholder, onChange, inputRef, autoComplete, className = "", ...rest }) {
    const auto = React2.useId ? React2.useId() : "f";
    const fid = id || "mcp-" + auto;
    const eid = fid + "-err";
    return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-fld " + className).trim() }, label && /* @__PURE__ */ React2.createElement("label", { htmlFor: fid }, label), /* @__PURE__ */ React2.createElement("input", { ref: inputRef, className: "mcp-in" + (error ? " is-bad" : ""), id: fid, type, value, defaultValue, placeholder, onChange, autoComplete, "aria-invalid": error ? true : void 0, "aria-describedby": error ? eid : void 0, ...rest }), error && /* @__PURE__ */ React2.createElement("span", { className: "mcp-fmsg", id: eid }, /* @__PURE__ */ React2.createElement(Icon, { name: "error" }), error), hint && !error && /* @__PURE__ */ React2.createElement("span", { className: "mcp-hint" }, hint));
  }
  function SearchField({ label, id, placeholder = "Find a game", value, onChange, className = "", ...rest }) {
    const auto = React2.useId ? React2.useId() : "s";
    const fid = id || "mcp-" + auto;
    return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-fld " + className).trim() }, label && /* @__PURE__ */ React2.createElement("label", { htmlFor: fid }, label), /* @__PURE__ */ React2.createElement("div", { className: "mcp-srch" }, /* @__PURE__ */ React2.createElement(Icon, { name: "search" }), /* @__PURE__ */ React2.createElement("input", { className: "mcp-in", id: fid, type: "search", placeholder, value, onChange, "aria-label": label ? void 0 : placeholder, ...rest })));
  }
  const PARTS = { tilegrid: TileGrid, wordboard: WordBoard, choices: ChoiceButtons, confirm: ConfirmCard, facts: FactRows, stats: StatRow, status: StatusTag, entities: EntityCards, clues: ClueCards, result: ResultCard, track: Track, roll: RollLine, nav: NavButtons, menu: MenuRows };
  const WHO = { x: "not in the word", y: "in the word", g: "right spot" };
  function Tiles({ rows }) {
    const label = rows.map((r) => r.word + ": " + r.marks.split("").map((m, i) => r.word[i] + " " + WHO[m]).join(", ")).join(". ");
    return /* @__PURE__ */ React2.createElement("div", { className: "mcp-chat-board", role: "img", "aria-label": label }, rows.map((r, i) => /* @__PURE__ */ React2.createElement("div", { key: i, className: "mcp-chat-row" }, r.word.split("").map((c, k) => /* @__PURE__ */ React2.createElement("span", { key: k, className: "is-" + r.marks[k] }, c)))));
  }
  function Block({ b }) {
    if (b.type === "tiles") return /* @__PURE__ */ React2.createElement(Tiles, { rows: b.rows });
    if (b.type === "list") return /* @__PURE__ */ React2.createElement("ul", { className: "mcp-chat-list" }, b.items.map((t, i) => /* @__PURE__ */ React2.createElement("li", { key: i }, t)));
    if (b.type === "mono") return /* @__PURE__ */ React2.createElement("pre", { className: "mcp-chat-mono" }, b.text);
    const P = PARTS[b.type];
    if (P) {
      const { type, ...p } = b;
      return /* @__PURE__ */ React2.createElement(P, { ...p });
    }
    return null;
  }
  const paras = (t) => t == null ? [] : Array.isArray(t) ? t : [t];
  function useChatScroll(body, turns) {
    const [up, setUp] = React2.useState(false);
    React2.useEffect(() => {
      const b = body.current;
      if (!b) return void 0;
      let moved = false;
      const mark = () => {
        const u = b.scrollTop > 4;
        b.dataset.more = u ? "up" : "";
        setUp(u);
      };
      const end = () => {
        if (!moved) b.scrollTop = b.scrollHeight;
        mark();
      };
      const stop = () => {
        moved = true;
      };
      b.addEventListener("scroll", mark, { passive: true });
      ["wheel", "touchstart", "keydown"].forEach((t2) => b.addEventListener(t2, stop, { passive: true }));
      const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(end) : null;
      if (ro) {
        ro.observe(b);
        [...b.children].forEach((c) => ro.observe(c));
      }
      end();
      const t = setTimeout(end, 600);
      return () => {
        clearTimeout(t);
        if (ro) ro.disconnect();
        b.removeEventListener("scroll", mark);
        ["wheel", "touchstart", "keydown"].forEach((t2) => b.removeEventListener(t2, stop));
      };
    }, [turns]);
    const toStart = () => {
      const b = body.current;
      if (b) b.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    };
    return [up, toStart];
  }
  function chatTurn(t, i, { mark, toolBy, fx }) {
    if (t.from === "user") {
      if (!fx) return /* @__PURE__ */ React2.createElement("p", { key: i, className: "mcp-chat-me" }, paras(t.text));
      const st = fx.piece(i, "u");
      return st && /* @__PURE__ */ React2.createElement("p", { key: i, className: "mcp-chat-me", style: st }, paras(t.text));
    }
    if (!fx) return /* @__PURE__ */ React2.createElement("div", { key: i, className: "mcp-chat-ai" }, t.tool && /* @__PURE__ */ React2.createElement("span", { className: "mcp-chat-call" }, mark && /* @__PURE__ */ React2.createElement("img", { src: mark, alt: "", width: "16", height: "16" }), "Called ", t.tool, toolBy && /* @__PURE__ */ React2.createElement("em", null, toolBy)), (t.blocks || []).map((b, k) => /* @__PURE__ */ React2.createElement(Block, { key: k, b })), paras(t.text).map((p, k) => /* @__PURE__ */ React2.createElement("p", { key: k }, p)), (t.after || []).map((b, k) => /* @__PURE__ */ React2.createElement(Block, { key: "a" + k, b })));
    const blk = (list, pre) => (list || []).map((b, k) => {
      const st = fx.piece(i, pre + k);
      return st && /* @__PURE__ */ React2.createElement("div", { key: pre + k, className: "mcp-chat-fx", style: st }, /* @__PURE__ */ React2.createElement(Block, { b }));
    });
    const call = t.tool && fx.piece(i, "c");
    const kids = [
      call && /* @__PURE__ */ React2.createElement("span", { key: "c", className: "mcp-chat-call", style: call }, mark && /* @__PURE__ */ React2.createElement("img", { src: mark, alt: "", width: "16", height: "16" }), "Called ", t.tool, toolBy && /* @__PURE__ */ React2.createElement("em", null, toolBy)),
      ...blk(t.blocks, "b"),
      ...paras(t.text).map((p, k) => {
        const st = fx.piece(i, "p" + k);
        return st && /* @__PURE__ */ React2.createElement("p", { key: "p" + k, style: st }, fx.words(i, "p" + k, p));
      }),
      ...blk(t.after, "a")
    ].filter(Boolean);
    return kids.length ? /* @__PURE__ */ React2.createElement("div", { key: i, className: "mcp-chat-ai" }, kids) : null;
  }
  function chatShell({ body, bodyRef, up, toStart, title, height, width, fill, label, more, className, comp, control, extraClass }) {
    const name = label || "A game being played in a chat";
    return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-chat" + (fill ? " is-fill" : "") + (extraClass ? " " + extraClass : "") + " " + className).trim(), style: fill ? void 0 : { width: "min(100%," + width + "px)" }, role: "group", "aria-label": name }, title && /* @__PURE__ */ React2.createElement("div", { className: "mcp-chat-head" }, title), /* @__PURE__ */ React2.createElement("div", { ref: bodyRef, className: "mcp-chat-body" + (height === "auto" && !fill ? " is-auto" : ""), style: fill || height === "auto" ? void 0 : { height }, tabIndex: 0, role: "region", "aria-label": name + ", scrolls" }, body), /* @__PURE__ */ React2.createElement("button", { type: "button", className: "mcp-chat-up", hidden: !up, onClick: toStart, "aria-label": more }, /* @__PURE__ */ React2.createElement(Icon, { name: "down", size: 16, style: { transform: "rotate(180deg)" } })), control, comp);
  }
  const chatParas = paras;
  function ChatPicture({ turns, title, toolBy, mark, height = 290, width = 360, fill = false, composer = true, placeholder = "Reply", label, more = "Back to the start", className = "" }) {
    const body = React2.useRef(null);
    const [up, toStart] = useChatScroll(body, turns);
    return chatShell({
      bodyRef: body,
      up,
      toStart,
      title,
      height,
      width,
      fill,
      label,
      more,
      className,
      body: turns.map((t, i) => chatTurn(t, i, { mark, toolBy })),
      comp: composer && /* @__PURE__ */ React2.createElement("div", { className: "mcp-chat-comp", "aria-hidden": "true" }, /* @__PURE__ */ React2.createElement("span", null, placeholder), /* @__PURE__ */ React2.createElement("i", null, /* @__PURE__ */ React2.createElement(Icon, { name: "send", size: 16 })))
    });
  }
  const ART = {
    "daily-puzzles": '<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"><rect width="100" height="100" fill="#1D1B3A"/><rect x="14" y="14" width="22" height="22" fill="#E5A63B"/><rect x="39" y="14" width="22" height="22" fill="#328A88"/><rect x="64" y="14" width="22" height="22" fill="#E5A63B"/><rect x="14" y="39" width="22" height="22" fill="#328A88"/><rect x="39" y="39" width="22" height="22" fill="#D66847"/><rect x="64" y="39" width="22" height="22" fill="#328A88"/><rect x="14" y="64" width="22" height="22" fill="#E5A63B"/><rect x="39" y="64" width="22" height="22" fill="#328A88"/><rect x="64" y="64" width="22" height="22" fill="#E5A63B"/></svg>',
    "daily-puzzles-diagonal": '<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"><rect width="100" height="100" fill="#1D1B3A"/><rect x="14" y="14" width="22" height="22" fill="#E5A63B"/><rect x="39" y="39" width="22" height="22" fill="#D66847"/><rect x="64" y="64" width="22" height="22" fill="#328A88"/></svg>',
    "weekly-interrogation": '<svg viewBox="0 0 171 108" preserveAspectRatio="xMidYMid slice"><rect width="171" height="108" fill="#421A28"/><circle cx="72" cy="54" r="36" fill="none" stroke="#D66847" stroke-width="14"/><rect x="104" y="20" width="14" height="68" fill="#F2EBE0"/><rect x="104" y="20" width="14" height="22" fill="#E5A63B"/></svg>',
    "dungeon-quest": '<svg viewBox="0 0 171 108" preserveAspectRatio="xMidYMid slice"><rect width="171" height="108" fill="#163328"/><path d="M20,108 L62,36 L104,108Z" fill="#E5A63B"/><path d="M66,108 L112,22 L158,108Z" fill="#A390B2"/><path d="M66,108 L85,72.5 L104,108Z" fill="#328A88"/></svg>',
    "dungeon-quest-single": '<svg viewBox="0 0 171 108" preserveAspectRatio="xMidYMid slice"><rect width="171" height="108" fill="#163328"/><path d="M66,108 L112,22 L158,108Z" fill="#A390B2"/></svg>'
  };
  const META = { "daily-puzzles": ["indigo", "centre"], "daily-puzzles-diagonal": ["indigo", "centre"], "weekly-interrogation": ["wine", "centre"], "dungeon-quest": ["forest", "bottom"], "dungeon-quest-single": ["forest", "bottom"] };
  function Cover({ name, art, src, children, onClick, fill = false, ground, extend, className = "" }) {
    const m = META[art] || [];
    const g = ground || m[0] || "indigo";
    const x = extend || m[1];
    if (fill && !x && typeof console !== "undefined") console.warn('Cover: fill needs the asset to declare extend ("bottom" or "centre").');
    const cls = "mcp-cover" + (fill ? " is-fill is-" + g + " from-" + (x || "centre") : "") + (className ? " " + className : "");
    const inner = children ? children : src ? /* @__PURE__ */ React2.createElement("img", { src, alt: "" }) : ART[art] ? /* @__PURE__ */ React2.createElement("span", { style: { display: "contents" }, dangerouslySetInnerHTML: { __html: ART[art] } }) : null;
    const Tag2 = onClick ? "button" : "figure";
    return /* @__PURE__ */ React2.createElement(Tag2, { className: cls, onClick, type: onClick ? "button" : void 0, style: onClick ? { background: "none", border: 0, padding: 0, cursor: "pointer", textAlign: "left", color: "inherit", font: "inherit" } : void 0 }, !children && !src && ART[art] ? /* @__PURE__ */ React2.createElement("div", { className: "mcp-cover-art", "aria-hidden": "true", dangerouslySetInnerHTML: { __html: ART[art] } }) : /* @__PURE__ */ React2.createElement("div", { className: "mcp-cover-art", "aria-hidden": "true" }, inner), name && (onClick ? /* @__PURE__ */ React2.createElement("span", { className: "mcp-cover-name" }, name) : /* @__PURE__ */ React2.createElement("figcaption", { className: "mcp-cover-name" }, name)));
  }
  const dg = () => /* @__PURE__ */ React2.createElement("div", { className: "mcp-art-dg" }, [0, 1, 2, 3].map((r) => /* @__PURE__ */ React2.createElement("div", { key: r }, [0, 1, 2, 3].map((c) => /* @__PURE__ */ React2.createElement("b", { key: c, style: { "--s": (r + 3 - c) * 20 } })))));
  const cb = () => /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement("i", { className: "mcp-art-cb-bar mcp-art-cb-1" }), /* @__PURE__ */ React2.createElement("i", { className: "mcp-art-cb-bar mcp-art-cb-2" }), /* @__PURE__ */ React2.createElement("i", { className: "mcp-art-cb-bar mcp-art-cb-3" }), /* @__PURE__ */ React2.createElement("i", { className: "mcp-art-cb-sun" }));
  const hu = () => /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement("i", { className: "mcp-art-hu-sun" }), /* @__PURE__ */ React2.createElement("i", { className: "mcp-art-hu-peak" }), /* @__PURE__ */ React2.createElement("i", { className: "mcp-art-hu-teal" }), /* @__PURE__ */ React2.createElement("i", { className: "mcp-art-hu-cream" }));
  const dm = () => /* @__PURE__ */ React2.createElement("div", { className: "mcp-art-st" }, /* @__PURE__ */ React2.createElement("i", { className: "mcp-art-dm-ring" }), /* @__PURE__ */ React2.createElement("i", { className: "mcp-art-dm-bar" }), /* @__PURE__ */ React2.createElement("i", { className: "mcp-art-dm-cap" }));
  const dw = () => /* @__PURE__ */ React2.createElement("div", { className: "mcp-art-st" }, /* @__PURE__ */ React2.createElement("i", { className: "mcp-art-dw mcp-art-dw-1" }), /* @__PURE__ */ React2.createElement("i", { className: "mcp-art-dw mcp-art-dw-2" }), /* @__PURE__ */ React2.createElement("i", { className: "mcp-art-dw mcp-art-dw-3" }));
  const PIECES = { groups: { body: dg }, casebook: { body: cb }, hunter: { body: hu, bg: "forest" }, mystery: { body: dm, bg: "wine" }, word: { body: dw, bg: "forest" } };
  const RATIO = { square: "mcp-art-1", landscape: "mcp-art-43", wide: "mcp-art-3" };
  function GameArt({ art, shape = "landscape", className = "" }) {
    const p = PIECES[art];
    if (!p) return null;
    return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-art " + RATIO[shape] + (p.bg ? " is-" + p.bg + " " : " ") + className).trim(), "aria-hidden": "true" }, p.body());
  }
  const PACE = { lead: 500, type: 32, typeMin: 450, typeMax: 1600, send: 300, enter: 260, think: 700, call: 450, word: 55, wordIn: 140, gap: 300, user: 450, read: 1400, end: 4e3 };
  function ease(x) {
    const cx = 0.48, bx = 3 * (0.3 - 0.16) - cx, ax = 1 - cx - bx, cy = 3, by = -3, ay = 1;
    let t = x;
    for (let n = 0; n < 8; n++) {
      const e = ((ax * t + bx) * t + cx) * t - x, d = (3 * ax * t + 2 * bx) * t + cx;
      if (Math.abs(e) < 1e-5 || Math.abs(d) < 1e-6) break;
      t = Math.min(1, Math.max(0, t - e / d));
    }
    return ((ay * t + by) * t + cy) * t;
  }
  const c01 = (v) => v < 0 ? 0 : v > 1 ? 1 : v;
  const nWords = (s) => String(s).split(/\s+/).filter(Boolean).length;
  function timeline(turns, pace, composer) {
    const p = { ...PACE, ...pace };
    const sp = p.speed > 0 ? p.speed : 1;
    const d = (x) => x / sp;
    let t = d(p.lead), last = 0;
    const out = [];
    const put = (pieces, k, dur) => {
      pieces[k] = { at: t };
      last = Math.max(last, t + d(p.enter));
      t += d(p.enter) + dur;
    };
    turns.forEach((tu) => {
      const pieces = {};
      let type = null;
      if (tu.from === "user") {
        if (composer) {
          const text = chatParas(tu.text).join(" ");
          const dur = d(Math.min(p.typeMax, Math.max(p.typeMin, text.length / p.type * 1e3)));
          type = { start: t, end: t + dur, text };
          t += dur + d(p.send);
        }
        put(pieces, "u", d(tu.hold ?? p.user));
      } else {
        t += d(p.think);
        if (tu.tool) put(pieces, "c", d(p.call));
        (tu.blocks || []).forEach((b, k) => put(pieces, "b" + k, d(p.gap)));
        chatParas(tu.text).forEach((s, k) => {
          const n = nWords(s);
          pieces["p" + k] = { at: t, n, word: d(p.word) };
          const end = t + Math.max(0, n - 1) * d(p.word) + d(p.wordIn);
          last = Math.max(last, end);
          t = end + d(p.gap);
        });
        (tu.after || []).forEach((b, k) => put(pieces, "a" + k, d(p.gap)));
        t += d(tu.hold ?? p.read) - d(p.gap);
      }
      out.push({ pieces, type });
    });
    return { turns: out, total: last, end: d(p.end), enter: d(p.enter), wordIn: d(p.wordIn) };
  }
  function enter(T, at, dur) {
    if (T < at) return null;
    const q = c01((T - at) / dur);
    const e = q >= 1 ? 1 : ease(q);
    return { opacity: +e.toFixed(4), transform: "translateY(" + ((1 - e) * 4).toFixed(2) + "px)" };
  }
  function frame(tl, T) {
    const fx = {
      piece: (i, k) => {
        const p = tl.turns[i] && tl.turns[i].pieces[k];
        return p ? enter(T, p.at, tl.enter) : {};
      },
      words: (i, k, text) => {
        const p = tl.turns[i] && tl.turns[i].pieces[k];
        if (!p || T >= p.at + Math.max(0, p.n - 1) * p.word + tl.wordIn) return text;
        let j = 0;
        return String(text).split(/(\s+)/).map((w, x) => {
          if (!w || /^\s+$/.test(w)) return w;
          const o = c01((T - (p.at + j++ * p.word)) / tl.wordIn);
          return /* @__PURE__ */ React2.createElement("span", { key: x, style: { opacity: +o.toFixed(4) } }, w);
        });
      }
    };
    let typed = null, sent = false;
    tl.turns.forEach(({ type, pieces }) => {
      if (!type) return;
      const at = pieces.u.at;
      if (T >= type.start && T < at) {
        const n = Math.min(type.text.length, Math.floor(c01((T - type.start) / (type.end - type.start)) * type.text.length));
        typed = { text: type.text.slice(0, n), caret: T < type.end || Math.floor((T - type.end) / 150) % 2 === 1 };
      }
      if (T >= at && T < at + 120) sent = true;
    });
    return { fx, typed, sent };
  }
  function useReducedMotion() {
    const q = "(prefers-reduced-motion: reduce)";
    const [r, setR] = React2.useState(() => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia(q).matches);
    React2.useEffect(() => {
      if (!window.matchMedia) return void 0;
      const m = window.matchMedia(q), f = () => setR(m.matches);
      if (m.addEventListener) m.addEventListener("change", f);
      else m.addListener(f);
      return () => {
        if (m.removeEventListener) m.removeEventListener("change", f);
        else m.removeListener(f);
      };
    }, []);
    return r;
  }
  function usePlaybackScroll(body, pinned) {
    const follow = React2.useRef(true), touched = React2.useRef(false);
    const [up, setUp] = React2.useState(false);
    React2.useLayoutEffect(() => {
      const b = body.current;
      if (!b) return;
      if (pinned || follow.current) b.scrollTop = b.scrollHeight;
      const u = b.scrollTop > 4;
      b.dataset.more = u ? "up" : "";
      setUp(u);
    });
    React2.useEffect(() => {
      const b = body.current;
      if (!b) return void 0;
      const take = () => {
        touched.current = true;
      };
      const mark = () => {
        if (touched.current) follow.current = b.scrollHeight - b.scrollTop - b.clientHeight < 8;
        const u = b.scrollTop > 4;
        b.dataset.more = u ? "up" : "";
        setUp(u);
      };
      b.addEventListener("scroll", mark, { passive: true });
      ["wheel", "touchstart", "keydown"].forEach((t) => b.addEventListener(t, take, { passive: true }));
      return () => {
        b.removeEventListener("scroll", mark);
        ["wheel", "touchstart", "keydown"].forEach((t) => b.removeEventListener(t, take));
      };
    }, []);
    const toStart = () => {
      const b = body.current;
      if (!b) return;
      touched.current = true;
      follow.current = false;
      b.scrollTo({ top: 0, behavior: "smooth" });
    };
    const rejoin = () => {
      follow.current = true;
      touched.current = false;
    };
    return [up, toStart, rejoin];
  }
  function ChatPlayback({ turns, time, autoplay = true, loop = false, speed = 1, pace, title, toolBy, mark, height = 290, width = 360, fill = false, composer = true, placeholder = "Reply", label, more = "Back to the start", pauseLabel = "Pause", playLabel = "Play", replayLabel = "Play again", className = "" }) {
    const reduced = useReducedMotion();
    const tl = React2.useMemo(() => timeline(turns, { ...pace, speed }, composer), [turns, JSON.stringify(pace || {}), speed, composer]);
    const given = typeof time === "number" && isFinite(time);
    const cycle = tl.total + tl.end;
    const [own, setOwn] = React2.useState(0);
    const [playing, setPlaying] = React2.useState(autoplay);
    const body = React2.useRef(null);
    const [up, toStart, rejoin] = usePlaybackScroll(body, given);
    React2.useEffect(() => {
      if (given || reduced || !playing) return void 0;
      let raf, last = null;
      const step = (now) => {
        const dt = last == null ? 0 : Math.min(250, now - last);
        last = now;
        setOwn((t) => {
          const n = t + dt;
          if (loop) {
            if (n >= cycle) {
              rejoin();
              return n - cycle;
            }
            return n;
          }
          return Math.min(n, tl.total);
        });
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
    }, [given, reduced, playing, loop, tl]);
    const T = given ? loop ? (time % cycle + cycle) % cycle : Math.max(0, Math.min(time, tl.total)) : own;
    const done = !loop && T >= tl.total;
    React2.useEffect(() => {
      if (!given && done && playing) setPlaying(false);
    }, [done]);
    if (reduced) return /* @__PURE__ */ React2.createElement(ChatPicture, { turns, title, toolBy, mark, height, width, fill, composer, placeholder, label, more, className });
    const { fx, typed, sent } = frame(tl, T);
    const press = () => {
      if (playing) setPlaying(false);
      else {
        if (done) {
          setOwn(0);
          rejoin();
        }
        setPlaying(true);
      }
    };
    const ctl = given ? null : /* @__PURE__ */ React2.createElement("button", { type: "button", className: "mcp-chat-pause", onClick: press, "aria-label": playing ? pauseLabel : done ? replayLabel : playLabel }, /* @__PURE__ */ React2.createElement(Icon, { name: playing ? "pause" : "play", size: 16 }));
    return chatShell({
      bodyRef: body,
      up,
      toStart,
      title,
      height,
      width,
      fill,
      label,
      more,
      className,
      extraClass: "is-playback",
      control: ctl,
      body: turns.map((t, i) => chatTurn(t, i, { mark, toolBy, fx })),
      comp: composer && /* @__PURE__ */ React2.createElement("div", { className: "mcp-chat-comp", "aria-hidden": "true" }, typed ? /* @__PURE__ */ React2.createElement("span", { className: "mcp-chat-typed" }, typed.text, /* @__PURE__ */ React2.createElement("span", { className: "mcp-chat-caret", style: { opacity: typed.caret ? 1 : 0 } })) : /* @__PURE__ */ React2.createElement("span", null, placeholder), /* @__PURE__ */ React2.createElement("i", { className: sent ? "is-sent" : void 0 }, /* @__PURE__ */ React2.createElement(Icon, { name: "send", size: 16 })))
    });
  }
  ChatPlayback.duration = (turns, { pace, speed = 1, composer = true } = {}) => timeline(turns, { ...pace, speed }, composer).total;
  function Card({ title, action, children, className = "", style, href, onClick, label, chevron = true }) {
    const { pressed, handlers } = usePress();
    const live = !!(href || onClick);
    if (!live) {
      const head = action ? /* @__PURE__ */ React2.createElement("div", { className: "mcp-card-head" }, title ? /* @__PURE__ */ React2.createElement("h3", { className: "mcp-t-card" }, title) : /* @__PURE__ */ React2.createElement("span", null), action) : title && /* @__PURE__ */ React2.createElement("h3", { className: "mcp-t-card" }, title);
      return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-card " + className).trim(), style }, head, children);
    }
    const cls = ("mcp-card is-link" + (chevron ? "" : " no-go") + (pressed ? " is-pressed" : "") + " " + className).trim();
    const inner = /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement("span", { className: "mcp-card-body" }, title && /* @__PURE__ */ React2.createElement("h3", { className: "mcp-t-card" }, title), children), chevron && /* @__PURE__ */ React2.createElement(Icon, { name: "next", size: 20, className: "mcp-card-go" }));
    return href ? /* @__PURE__ */ React2.createElement("a", { href, onClick, className: cls, style, "aria-label": label, ...handlers }, inner) : /* @__PURE__ */ React2.createElement("button", { type: "button", onClick, className: cls, style, "aria-label": label, ...handlers }, inner);
  }
  function Heading({ level = "card", children, as }) {
    const map = { page: ["h1", "mcp-t-page"], section: ["h2", "mcp-t-sec"], card: ["h3", "mcp-t-card"] };
    const [tag, cls] = map[level] || map.card;
    const T = as || tag;
    return /* @__PURE__ */ React2.createElement(T, { className: cls }, children);
  }
  function CardRow({ title, sub, label, as = "h2", kind = "cards", children, className = "" }) {
    const ref = React2.useRef(null), prev = React2.useRef(null), next = React2.useRef(null), pressed = React2.useRef(null);
    const [at, setAt] = React2.useState({ over: false, start: true, end: true });
    React2.useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return void 0;
      const read = () => {
        const over2 = el.scrollWidth > el.clientWidth + 1, start = el.scrollLeft <= 1, end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
        setAt((a) => a.over === over2 && a.start === start && a.end === end ? a : { over: over2, start, end });
      };
      read();
      el.addEventListener("scroll", read, { passive: true });
      const ro = window.ResizeObserver ? new ResizeObserver(read) : null;
      if (ro) ro.observe(el);
      return () => {
        el.removeEventListener("scroll", read);
        if (ro) ro.disconnect();
      };
    }, []);
    React2.useEffect(() => {
      if (pressed.current === "next" && at.end && prev.current) {
        prev.current.focus({ preventScroll: true });
        pressed.current = "prev";
      } else if (pressed.current === "prev" && at.start && next.current) {
        next.current.focus({ preventScroll: true });
        pressed.current = "next";
      }
    }, [at.start, at.end]);
    const move = (d) => {
      const el = ref.current;
      if (!el) return;
      pressed.current = d > 0 ? "next" : "prev";
      const c = el.firstElementChild, gap = parseFloat(getComputedStyle(el).columnGap) || 24, step = c ? c.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
      const still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollBy({ left: d * step, behavior: still ? "auto" : "smooth" });
    };
    const T = as, name = label || (typeof title === "string" ? title : "Cards"), n = React2.Children.count(children);
    return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-crow" + (kind === "chat" ? " is-chat" : kind === "tiles" ? " is-tiles" : "") + " " + className).trim() }, /* @__PURE__ */ React2.createElement("div", { className: "mcp-crow-head" }, /* @__PURE__ */ React2.createElement(T, { className: "mcp-t-sec mcp-crow-title" }, title), at.over && /* @__PURE__ */ React2.createElement("div", { className: "mcp-crow-nav" }, /* @__PURE__ */ React2.createElement("button", { ref: prev, type: "button", className: "mcp-crow-btn", "aria-label": "Previous, " + name, style: at.start ? { visibility: "hidden" } : null, onClick: () => move(-1) }, /* @__PURE__ */ React2.createElement(Icon, { name: "next", style: { transform: "rotate(180deg)" } })), /* @__PURE__ */ React2.createElement("button", { ref: next, type: "button", className: "mcp-crow-btn", "aria-label": "Next, " + name, style: at.end ? { visibility: "hidden" } : null, onClick: () => move(1) }, /* @__PURE__ */ React2.createElement(Icon, { name: "next" }))), sub && /* @__PURE__ */ React2.createElement("p", { className: "mcp-crow-sub" }, sub)), /* @__PURE__ */ React2.createElement("div", { ref, className: "mcp-crow-track", role: "region", "aria-label": name, tabIndex: 0, style: { "--n": n } }, children));
  }
  function Disclosure({ title, children, defaultOpen = false }) {
    const [open, setOpen] = React2.useState(defaultOpen);
    const { pressed, handlers } = usePress();
    const id = (React2.useId ? React2.useId() : "d") + "-body";
    return /* @__PURE__ */ React2.createElement("div", { className: "mcp-disc" }, /* @__PURE__ */ React2.createElement("button", { type: "button", className: "mcp-disc-btn" + (pressed ? " is-pressed" : ""), "aria-expanded": open, "aria-controls": id, onClick: () => setOpen((o) => !o), ...handlers }, /* @__PURE__ */ React2.createElement("span", null, title), /* @__PURE__ */ React2.createElement(Icon, { name: "down" })), /* @__PURE__ */ React2.createElement("div", { className: "mcp-disc-body" + (open ? " is-open" : ""), id }, /* @__PURE__ */ React2.createElement("div", null, typeof children === "string" ? /* @__PURE__ */ React2.createElement("p", null, children) : children)));
  }
  function FormCard({ title, children, className = "", style }) {
    return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-panel " + className).trim(), style }, /* @__PURE__ */ React2.createElement("svg", { className: "mcp-deco", viewBox: "0 0 120 76", "aria-hidden": "true" }, /* @__PURE__ */ React2.createElement("rect", { x: "84", y: "0", width: "36", height: "44", fill: "#328A88" }), /* @__PURE__ */ React2.createElement("rect", { x: "56", y: "0", width: "28", height: "28", fill: "#EDE8DF" }), /* @__PURE__ */ React2.createElement("circle", { cx: "102", cy: "58", r: "12", fill: "#E5A63B" })), /* @__PURE__ */ React2.createElement("div", { className: "mcp-panel-in" }, title && /* @__PURE__ */ React2.createElement("h3", { className: "mcp-t-card" }, title), children));
  }
  function GameCard({ art, pass, onPass, title, mark, blurb, tags, className = "", style }) {
    const m = pass && (onPass ? /* @__PURE__ */ React2.createElement("button", { type: "button", className: "mcp-passmark is-link", onClick: (e) => {
      e.stopPropagation();
      onPass(e);
    } }, /* @__PURE__ */ React2.createElement(Icon, { name: "lock", size: 14 }), "Pass") : /* @__PURE__ */ React2.createElement("span", { className: "mcp-passmark" }, /* @__PURE__ */ React2.createElement(Icon, { name: "lock", size: 14 }), "Pass"));
    return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-card mcp-gcard " + className).trim(), style }, /* @__PURE__ */ React2.createElement("div", { className: "mcp-gcard-art" }, art, m), /* @__PURE__ */ React2.createElement("div", { className: "mcp-gcard-text" }, /* @__PURE__ */ React2.createElement("div", { className: "mcp-gcard-name" }, /* @__PURE__ */ React2.createElement("h3", { className: "mcp-t-card" }, title), mark), /* @__PURE__ */ React2.createElement("p", { className: "mcp-gcard-blurb" }, blurb)), /* @__PURE__ */ React2.createElement("div", { className: "mcp-gcard-tags" }, tags));
  }
  function GamePick({ art, pass, onPass, label, title, blurb, tags, className = "", style }) {
    const m = pass && (onPass ? /* @__PURE__ */ React2.createElement("button", { type: "button", className: "mcp-passmark is-link", onClick: (e) => {
      e.stopPropagation();
      onPass(e);
    } }, /* @__PURE__ */ React2.createElement(Icon, { name: "lock", size: 14 }), "Pass") : /* @__PURE__ */ React2.createElement("span", { className: "mcp-passmark" }, /* @__PURE__ */ React2.createElement(Icon, { name: "lock", size: 14 }), "Pass"));
    return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-card mcp-gpick " + className).trim(), style }, /* @__PURE__ */ React2.createElement("div", { className: "mcp-gpick-art" }, art, m), /* @__PURE__ */ React2.createElement("div", { className: "mcp-gpick-text" }, /* @__PURE__ */ React2.createElement("span", { className: "mcp-gpick-label" }, label), /* @__PURE__ */ React2.createElement("h3", { className: "mcp-t-card" }, title), /* @__PURE__ */ React2.createElement("p", { className: "mcp-gpick-blurb" }, blurb)), /* @__PURE__ */ React2.createElement("div", { className: "mcp-gpick-tags" }, tags));
  }
  function GameTile({ art, pass, onPass, title, kind, className = "", style }) {
    const m = pass && (onPass ? /* @__PURE__ */ React2.createElement("button", { type: "button", className: "mcp-passmark is-link", onClick: (e) => {
      e.stopPropagation();
      onPass(e);
    } }, /* @__PURE__ */ React2.createElement(Icon, { name: "lock", size: 14 }), "Pass") : /* @__PURE__ */ React2.createElement("span", { className: "mcp-passmark" }, /* @__PURE__ */ React2.createElement(Icon, { name: "lock", size: 14 }), "Pass"));
    return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-gtile " + className).trim(), style }, /* @__PURE__ */ React2.createElement("div", { className: "mcp-gtile-art" }, art, m), /* @__PURE__ */ React2.createElement("span", { className: "mcp-gtile-name" }, title), kind && /* @__PURE__ */ React2.createElement("span", { className: "mcp-gtile-kind" }, kind));
  }
  const said$1 = /* @__PURE__ */ new Set();
  const warn$1 = (m) => {
    if (!said$1.has(m)) {
      said$1.add(m);
      console.warn("ListRow: " + m);
    }
  };
  const isText$1 = (v) => typeof v === "string" || typeof v === "number";
  const toForms = (v) => {
    if (isText$1(v)) return [String(v)];
    if (Array.isArray(v) && v.length && v.every(isText$1)) return v.map(String);
    return null;
  };
  const over = (el) => el.scrollWidth > el.clientWidth + 0.5;
  const pick = (el, forms, what) => {
    for (const f of forms) {
      el.textContent = f;
      if (!over(el)) return;
    }
    warn$1(what + ' "' + forms[forms.length - 1] + '" doesn’t fit even in its shortest form; pass a shorter form last.');
  };
  const fitTitle = (t, n, g, full) => {
    if (g) g.style.display = "";
    n.textContent = full;
    if (!over(t)) return;
    if (g) {
      g.style.display = "none";
      if (!over(t)) return;
    }
    const at = (k) => full.slice(0, k).replace(/[\s\u00b7,\u2013-]+$/, "") + "…";
    let lo = 0, hi = full.length;
    while (lo < hi) {
      const m = lo + hi + 1 >> 1;
      n.textContent = at(m);
      if (!over(t)) lo = m;
      else hi = m - 1;
    }
    n.textContent = at(lo);
  };
  function RowList({ children, label, className = "" }) {
    return /* @__PURE__ */ React2.createElement("ul", { className: ("mcp-rows " + className).trim(), "aria-label": label }, React2.Children.map(children, (c, i) => c && /* @__PURE__ */ React2.createElement("li", { key: i }, c)));
  }
  function ListRow({ title, game, lead, result, tone = "none", when, replay, note, meta, end, sub = false, href, onClick, label, muted = false, className = "" }) {
    const { pressed, handlers } = usePress();
    const row = React2.useRef(null), tRef = React2.useRef(null), nRef = React2.useRef(null), gRef = React2.useRef(null), sRef = React2.useRef(null), wRef = React2.useRef(null);
    if (note != null && note !== "Replay") warn$1('note is gone; Replay is on or off (replay). "' + note + '" is shown as Replay.');
    const rep = !!replay || note != null;
    const rF = toForms(result), wF = toForms(when);
    const live = !!(href || onClick);
    const slots = sub || result != null || when != null || rep;
    const hasLead = !!lead && !sub;
    if (game && !sub && !hasLead) warn$1('game shows only beside a cover, in a list that mixes games; "' + game + '" is dropped.');
    const gameOn = !!game && hasLead && slots;
    const tText = isText$1(title);
    const fitKey = JSON.stringify([slots, tText && String(title), gameOn && game, rF, wF]);
    React2.useLayoutEffect(() => {
      const r = row.current;
      if (!r || !slots) return void 0;
      const run = () => {
        const narrow = r.clientWidth < 440;
        if (wRef.current && wF) pick(wRef.current, narrow ? wF.slice(-1) : wF, "when");
        if (sRef.current && rF) pick(sRef.current, narrow ? rF.slice(-1) : rF, "result");
        if (tRef.current && nRef.current) fitTitle(tRef.current, nRef.current, gRef.current, String(title));
      };
      run();
      if (document.fonts) document.fonts.ready.then(run);
      const ro = new ResizeObserver(run);
      ro.observe(r);
      return () => ro.disconnect();
    }, [fitKey]);
    if (end != null && slots) warn$1("a row with a result, when or Replay takes no end Tag; it is dropped.");
    const cls = ("mcp-row" + (live ? " is-link" : "") + (end != null && !sub && !slots ? " has-end" : "") + (hasLead ? " has-lead" : "") + (slots ? " is-slots" : "") + (slots && result != null ? " has-result" : "") + (slots && rep ? " has-note" : "") + (sub ? " is-sub" : "") + (muted ? " is-muted" : "") + (pressed ? " is-pressed" : "") + " " + className).trim();
    const go = live ? /* @__PURE__ */ React2.createElement(Icon, { name: "next", size: 20, className: "mcp-row-go" }) : /* @__PURE__ */ React2.createElement("span", { className: "mcp-row-go", "aria-hidden": "true" });
    const leadEl = hasLead && /* @__PURE__ */ React2.createElement("span", { className: "mcp-row-lead", "aria-hidden": "true" }, lead);
    const endEl = end != null && !sub && /* @__PURE__ */ React2.createElement("span", { className: "mcp-row-end" }, end);
    const icon = tone === "ok" ? "check" : tone === "bad" ? "error" : null;
    const gameEl = gameOn && /* @__PURE__ */ React2.createElement("span", { className: "mcp-row-game", ref: gRef }, " · " + game);
    const inner = slots ? /* @__PURE__ */ React2.createElement(React2.Fragment, null, leadEl, !sub && /* @__PURE__ */ React2.createElement("span", { className: "mcp-row-head" }, /* @__PURE__ */ React2.createElement("span", { className: "mcp-row-title", ref: tRef }, tText ? /* @__PURE__ */ React2.createElement("span", { ref: nRef }) : title, gameEl)), result != null && /* @__PURE__ */ React2.createElement("span", { className: "mcp-row-st is-" + tone }, icon && /* @__PURE__ */ React2.createElement(Icon, { name: icon, size: 16 }), /* @__PURE__ */ React2.createElement("span", { ref: sRef }, rF ? null : result)), when != null && /* @__PURE__ */ React2.createElement("span", { className: "mcp-row-when", ref: wRef }, wF ? null : when), rep && /* @__PURE__ */ React2.createElement("span", { className: "mcp-row-note" }, "Replay"), go) : /* @__PURE__ */ React2.createElement(React2.Fragment, null, leadEl, /* @__PURE__ */ React2.createElement("span", { className: "mcp-row-body" }, /* @__PURE__ */ React2.createElement("span", { className: "mcp-row-title" }, title), meta && /* @__PURE__ */ React2.createElement("span", { className: "mcp-row-meta" }, meta)), endEl, go);
    const name = label || (slots && (tText || sub) ? [!sub && String(title), gameOn && game, rep && "Replay", rF && rF[0], wF && wF[0]].filter(Boolean).join(", ") : void 0);
    if (!live) return /* @__PURE__ */ React2.createElement("div", { ref: row, className: cls, "aria-label": slots ? name : void 0, role: slots && name ? "group" : void 0 }, inner);
    return href ? /* @__PURE__ */ React2.createElement("a", { ref: row, href, onClick, className: cls, "aria-label": name, ...handlers }, inner) : /* @__PURE__ */ React2.createElement("button", { ref: row, type: "button", onClick, className: cls, "aria-label": name, ...handlers }, inner);
  }
  function Menu({ trigger, items = [], label, align = "start", placement = "below", defaultOpen = false }) {
    const [open, setOpen] = React2.useState(defaultOpen);
    const wrap = React2.useRef(null), list = React2.useRef(null), byUser = React2.useRef(false);
    const id = React2.useId();
    const opener = () => wrap.current && wrap.current.querySelector("[aria-haspopup]");
    const close = (restore) => {
      setOpen(false);
      {
        const o = opener();
        o && o.focus({ preventScroll: true });
      }
    };
    React2.useEffect(() => {
      if (!open) return;
      let t2;
      if (byUser.current) {
        t2 = setTimeout(() => {
          const b = list.current && list.current.querySelector("[role=menuitem]");
          b && b.focus({ preventScroll: true });
        }, 20);
      }
      const out = (e) => {
        if (wrap.current && !wrap.current.contains(e.target)) setOpen(false);
      };
      document.addEventListener("pointerdown", out);
      return () => {
        clearTimeout(t2);
        document.removeEventListener("pointerdown", out);
      };
    }, [open]);
    const key = (e) => {
      const bs = [...list.current.querySelectorAll("[role=menuitem]")];
      const i = bs.indexOf(document.activeElement);
      const go = (n) => {
        e.preventDefault();
        bs[(n + bs.length) % bs.length].focus();
      };
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowDown") go(i + 1);
      else if (e.key === "ArrowUp") go(i - 1);
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(bs.length - 1);
      else if (e.key === "Tab") setOpen(false);
    };
    const t = React2.cloneElement(trigger, { "aria-haspopup": "menu", "aria-expanded": open, "aria-controls": id, onClick: (e) => {
      byUser.current = true;
      setOpen((o) => !o);
      trigger.props.onClick && trigger.props.onClick(e);
    } });
    return /* @__PURE__ */ React2.createElement("span", { className: "mcp-menu-wrap", ref: wrap }, t, /* @__PURE__ */ React2.createElement("div", { id, ref: list, role: "menu", "aria-label": label, onKeyDown: key, className: "mcp-menu" + (align === "end" ? " is-end" : "") + (placement === "above" ? " is-up" : "") + (open ? " is-open" : "") }, items.map((it, i) => /* @__PURE__ */ React2.createElement("button", { key: i, type: "button", role: "menuitem", tabIndex: -1, className: "mcp-menu-item" + (it.danger ? " is-danger" : ""), onClick: () => {
      close();
      it.onSelect && it.onSelect();
    } }, it.icon && /* @__PURE__ */ React2.createElement(Icon, { name: it.icon }), it.label))));
  }
  const said = /* @__PURE__ */ new Set();
  const warn = (m) => {
    if (!said.has(m)) {
      said.add(m);
      console.warn("MoveRow: " + m);
    }
  };
  const isText = (v) => typeof v === "string" || typeof v === "number";
  function MoveList({ children, label, className = "" }) {
    return /* @__PURE__ */ React2.createElement("ol", { className: ("mcp-rows mcp-moves " + className).trim(), "aria-label": label }, React2.Children.map(children, (c, i) => c && /* @__PURE__ */ React2.createElement("li", { key: i }, c)));
  }
  function MoveRow({ label, parts, className = "" }) {
    if (!isText(label)) warn('label is plain text: the line’s name ("Dexterity", "Guess 1").');
    const list = (Array.isArray(parts) ? parts : parts == null ? [] : [parts]).filter((p) => {
      if (isText(p)) return true;
      warn("parts are plain strings; a part that isn’t is dropped.");
      return false;
    }).map(String);
    if (!list.length) warn('"' + label + '" has no parts; line two is empty.');
    return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-move " + className).trim() }, /* @__PURE__ */ React2.createElement("span", { className: "mcp-move-label" }, label), list.length > 0 && /* @__PURE__ */ React2.createElement("span", { className: "mcp-move-parts" }, list.map((p, i) => /* @__PURE__ */ React2.createElement("span", { key: i, className: i === 0 ? "mcp-move-lead" : "mcp-move-rest" }, i > 0 && /* @__PURE__ */ React2.createElement("span", { className: "mcp-move-sep" }, ", "), p))));
  }
  const MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const fmt = (s) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s || "");
    return m ? +m[3] + " " + MON[+m[2] - 1] : String(s || "").toUpperCase();
  };
  const count = (n, one, many) => n + " " + (n === 1 ? one : many);
  function needsPassCopy({ game, word, words, record, total }) {
    const many = words || (word ? word + "s" : "");
    const cadence = word ? "Play every " + word + " as it comes out." : "Play the whole game.";
    if (!record) {
      return { label: null, heading: game + " comes only with the Pass.", foot: null, rightLabel: "WHAT YOU GET", lines: [cadence, total ? "Earn " + count(total, "achievement", "achievements") + "." : null].filter(Boolean), action: "Get the Pass" };
    }
    const label = !word ? "LAST PLAYED · " + fmt(record.last) : "YOUR LAST " + word.toUpperCase() + " · " + (record.chapter != null ? record.chapter : fmt(record.last));
    const played = word && record.played ? "played " + count(record.played, word, many) : null;
    const earned = record.earned ? "earned " + count(record.earned, "achievement", "achievements") : null;
    const foot = played || earned ? "You " + [played, earned].filter(Boolean).join(" and ") + "." : null;
    return { label, heading: "You stopped here. Everything you earned is still yours.", foot, rightLabel: "WHAT COMES BACK", lines: [cadence, "Pick up where you stopped."], action: "Get the Pass again" };
  }
  function NeedsPass({ game, word, words, record, total = 0, onGet, className = "", style }) {
    const c = needsPassCopy({ game, word, words, record, total });
    return /* @__PURE__ */ React2.createElement("section", { className: ("mcp-npass " + className).trim(), style, "aria-label": c.heading }, /* @__PURE__ */ React2.createElement("div", { className: "mcp-npass-half" }, /* @__PURE__ */ React2.createElement("span", { className: "mcp-npass-label", "aria-hidden": c.label ? void 0 : true }, c.label || " "), /* @__PURE__ */ React2.createElement("h3", { className: "mcp-t-sec" }, c.heading), /* @__PURE__ */ React2.createElement("div", { className: "mcp-npass-foot" }, c.foot && /* @__PURE__ */ React2.createElement("p", { className: "mcp-npass-note" }, c.foot))), /* @__PURE__ */ React2.createElement("div", { className: "mcp-npass-half" }, /* @__PURE__ */ React2.createElement("span", { className: "mcp-npass-label" }, c.rightLabel), c.lines.map((l, i) => /* @__PURE__ */ React2.createElement("p", { key: i, className: "mcp-npass-line" }, l)), /* @__PURE__ */ React2.createElement("div", { className: "mcp-npass-foot" }, /* @__PURE__ */ React2.createElement(Button, { variant: "secondary", onClick: onGet }, c.action))));
  }
  function PageGrid({ children, split = "main", className = "", style }) {
    return /* @__PURE__ */ React2.createElement("div", { className: "mcp-pgrid-wrap" }, /* @__PURE__ */ React2.createElement("div", { className: ("mcp-pgrid is-" + split + " " + className).trim(), style }, children));
  }
  function useWide(ref, bp) {
    const [w, setW] = React2.useState(() => typeof window !== "undefined" ? window.innerWidth >= bp : true);
    React2.useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;
      const f = () => {
        const x = el.offsetWidth;
        if (x) setW(x >= bp);
      };
      f();
      if (typeof ResizeObserver === "undefined") {
        window.addEventListener("resize", f);
        return () => window.removeEventListener("resize", f);
      }
      const ro = new ResizeObserver(f);
      ro.observe(el);
      return () => ro.disconnect();
    }, [bp]);
    return w;
  }
  function Popup({ open, onClose, title, children, actions, kind = "dialog", posture = "auto", breakpoint = 640, contained = false, busy = false, label }) {
    const layer = React2.useRef(null);
    const wide = useWide(layer, breakpoint);
    const panel = kind === "panel";
    const mode = !panel ? "window" : posture === "auto" ? wide ? "window" : "sheet" : posture;
    const ref = React2.useRef(null);
    const opener = React2.useRef(null);
    const dismiss = React2.useRef(null);
    dismiss.current = () => {
      if (!busy && onClose) onClose();
    };
    React2.useEffect(() => {
      if (open) {
        opener.current = document.activeElement;
        const t = setTimeout(() => {
          const b = ref.current && ref.current.querySelector("button,[href],input,select,textarea");
          b && b.focus({ preventScroll: true });
        }, 30);
        const k = (e) => {
          if (e.key === "Escape") dismiss.current();
        };
        document.addEventListener("keydown", k);
        return () => {
          clearTimeout(t);
          document.removeEventListener("keydown", k);
        };
      } else if (opener.current && opener.current.focus) {
        opener.current.focus({ preventScroll: true });
        opener.current = null;
      }
    }, [open]);
    return /* @__PURE__ */ React2.createElement("div", { ref: layer, className: "mcp-layer" + (contained ? " is-contained" : "") + (open ? " is-open" : ""), "aria-hidden": !open }, /* @__PURE__ */ React2.createElement("div", { className: "mcp-dim", onClick: () => dismiss.current() }), /* @__PURE__ */ React2.createElement("div", { ref, className: "mcp-pop is-" + mode + " is-" + (panel ? "panel" : "dialog"), role: panel ? "dialog" : "alertdialog", "aria-modal": "true", "aria-label": label || title, "aria-busy": busy || void 0 }, title && /* @__PURE__ */ React2.createElement("h3", { className: "mcp-t-card" }, title), /* @__PURE__ */ React2.createElement("div", { className: "mcp-pop-body" }, children), actions && /* @__PURE__ */ React2.createElement("div", { className: "mcp-btn-pair" }, actions)));
  }
  function SoonCard({ art, label, title, line, play, onPlay, playHref, className = "", style }) {
    const P = playHref ? "a" : "button";
    return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-card mcp-soon " + className).trim(), style }, /* @__PURE__ */ React2.createElement("div", { className: "mcp-soon-art" }, art), /* @__PURE__ */ React2.createElement("div", { className: "mcp-soon-body" }, label && /* @__PURE__ */ React2.createElement("span", { className: "mcp-soon-label" }, label), /* @__PURE__ */ React2.createElement("h3", { className: "mcp-t-card" }, title), line && /* @__PURE__ */ React2.createElement("p", { className: "mcp-soon-line" }, line), /* @__PURE__ */ React2.createElement("div", { className: "mcp-soon-tags" }, /* @__PURE__ */ React2.createElement(Tag, { kind: "daily" }, "Coming soon"), play && /* @__PURE__ */ React2.createElement(P, { className: "mcp-soon-play", href: playHref, type: playHref ? void 0 : "button", onClick: onPlay }, /* @__PURE__ */ React2.createElement(Tag, { kind: "open", icon: "play" }, play)))));
  }
  const ns = window.MCPGameStoreDesignSystem_ef1abd = window.MCPGameStoreDesignSystem_ef1abd || {};
  ns.__errors = ns.__errors || [];
  ns.Button = Button;
  ns.ButtonPair = ButtonPair;
  ns.TextLink = TextLink;
  ns.ChoiceButtons = ChoiceButtons;
  ns.ClueCards = ClueCards;
  ns.ConfirmCard = ConfirmCard;
  ns.EntityCards = EntityCards;
  ns.FactRows = FactRows;
  ns.MenuRows = MenuRows;
  ns.NavButtons = NavButtons;
  ns.ResultCard = ResultCard;
  ns.RollLine = RollLine;
  ns.StatRow = StatRow;
  ns.StatusTag = StatusTag;
  ns.TileGrid = TileGrid;
  ns.Track = Track;
  ns.WordBoard = WordBoard;
  ns.Loader = Loader;
  ns.ProgressBar = ProgressBar;
  ns.StatusMessage = StatusMessage;
  ns.Tag = Tag;
  ns.Checkbox = Checkbox;
  ns.TextField = TextField;
  ns.SearchField = SearchField;
  ns.ChatPicture = ChatPicture;
  ns.Cover = Cover;
  ns.GameArt = GameArt;
  ns.ICON_NAMES = ICON_NAMES;
  ns.Icon = Icon;
  ns.ChatPlayback = ChatPlayback;
  ns.Card = Card;
  ns.Heading = Heading;
  ns.CardRow = CardRow;
  ns.Disclosure = Disclosure;
  ns.FormCard = FormCard;
  ns.GameCard = GameCard;
  ns.GamePick = GamePick;
  ns.GameTile = GameTile;
  ns.RowList = RowList;
  ns.ListRow = ListRow;
  ns.Menu = Menu;
  ns.MoveList = MoveList;
  ns.MoveRow = MoveRow;
  ns.NeedsPass = NeedsPass;
  ns.PageGrid = PageGrid;
  ns.Popup = Popup;
  ns.SoonCard = SoonCard;
})(React);
