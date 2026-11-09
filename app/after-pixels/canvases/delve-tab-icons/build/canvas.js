(function(React$1, client) {
  "use strict";
  (function(React2) {
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
    const A2 = 'fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="miter"';
    const LINE = {
      search: "<g " + A2 + '><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></g>',
      back: "<g " + A2 + '><path d="M20 12H5"/><path d="M11 5L4 12L11 19"/></g>',
      close: "<g " + A2 + '><path d="M5 5L19 19M19 5L5 19"/></g>',
      lock: "<g " + A2 + '><path d="M4.5 11H19.5V21H4.5Z"/><path d="M8 11V5H16V11"/><path d="M12 15V17"/></g>',
      play: "<g " + A2 + '><path d="M7 4L19 12L7 20Z"/></g>',
      pause: "<g " + A2 + '><path d="M8 5V19M16 5V19"/></g>',
      settings: "<g " + A2 + '><path d="M4 6H11M17 6H20"/><path d="M4 12H6M12 12H20"/><path d="M4 18H13M19 18H20"/><path d="M11 4H17V8H11Z"/><path d="M6 10H12V14H6Z"/><path d="M13 16H19V20H13Z"/></g>',
      mail: "<g " + A2 + '><path d="M3 5.5H21V18.5H3Z"/><path d="M3.5 6.5L12 13L20.5 6.5"/></g>',
      logout: "<g " + A2 + '><path d="M10 4H4V20H10"/><path d="M15 8L19 12L15 16"/><path d="M19 12H9"/></g>',
      card: "<g " + A2 + '><path d="M2.5 5.5H21.5V18.5H2.5Z"/><path d="M2.5 10H21.5"/><path d="M6 15H10"/></g>'
    };
    const UI = {
      check: '<g fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="square" stroke-linejoin="miter"><path d="M4.5 12.5L9.5 17.5L19.5 6.5"/></g>',
      warn: "<g " + A2 + '><path d="M12 3L22 20H2Z"/><path d="M12 10V14M12 16.5V17.5"/></g>',
      error: "<g " + A2 + '><circle cx="12" cy="12" r="9"/><path d="M12 7V13M12 16V17"/></g>',
      down: "<g " + A2 + '><path d="M5 9L12 16L19 9"/></g>',
      send: '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5"/></g>',
      next: "<g " + A2 + '><path d="M9 5L16 12L9 19"/></g>',
      out: "<g " + A2 + '><path d="M14 4H20V10"/><path d="M20 4L11 13"/><path d="M17 14V20H4V7H10"/></g>',
      share: "<g " + A2 + '><path d="M12 15V4"/><path d="M7.5 8.5L12 4L16.5 8.5"/><path d="M8 11H5V20H19V11H16"/></g>',
      list: "<g " + A2 + '><path d="M4 5H20V10H4Z"/><path d="M4 14H20V19H4Z"/></g>'
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
    function cbFold({ title, count: count2, closed, pad }, children) {
      return React2.createElement(
        "details",
        { className: "mcp-cb-fold", open: !closed },
        React2.createElement(
          "summary",
          { className: "mcp-cb-fold-s" },
          React2.createElement("span", { className: "mcp-cb-fold-t" }, title),
          count2 != null && React2.createElement("span", { className: "mcp-cb-fold-n" }, React2.createElement("span", { "aria-hidden": "true" }, "·"), count2),
          React2.createElement(Icon, { name: "down", size: 16 })
        ),
        React2.createElement("div", { className: "mcp-cb-fold-b" + (pad ? " is-pad" : "") }, children)
      );
    }
    function ChoiceButtons({ items = [], picked, onChoose, label, className = "" }) {
      const done = picked != null;
      return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-cb mcp-cb-choices " + className).trim(), role: "group", "aria-label": label || "Moves" }, items.map((it, i) => {
        const t = typeof it === "string" ? it : it.label;
        const p = done && (picked === i || picked === t);
        return cbPress(onChoose && !done && (() => onChoose(t, i)), { key: i, className: "mcp-cb-choice" + (p ? " is-picked" : done ? " is-spent" : ""), "aria-pressed": p }, /* @__PURE__ */ React2.createElement(React2.Fragment, null, p && /* @__PURE__ */ React2.createElement(Icon, { name: "check", size: 14 }), t));
      }));
    }
    function ClueCards({ groups = [], newLabel = "New", title, fold, className = "" }) {
      const folded = !!fold, solo = folded && groups.length === 1;
      const sections = groups.map((g2, i) => /* @__PURE__ */ React2.createElement("section", { key: i, className: "mcp-cb-clue", "aria-label": g2.kind }, !solo && /* @__PURE__ */ React2.createElement("p", { className: "mcp-cb-clue-h" }, /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-kind" }, g2.kind), /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-clue-n" }, g2.facts.length)), /* @__PURE__ */ React2.createElement("ul", null, g2.facts.map((f, k) => {
        const t = typeof f === "string" ? { text: f } : f;
        return /* @__PURE__ */ React2.createElement("li", { key: k, className: t.new ? "is-new" : void 0 }, /* @__PURE__ */ React2.createElement("span", null, cbRich(t.text)), t.new && /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-new" }, newLabel));
      }))));
      return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-cb mcp-cb-clues mcp-cb-fence " + className).trim() }, folded ? cbFold({ title: title || (solo ? groups[0].kind : "Clues"), count: groups.reduce((n, g2) => n + g2.facts.length, 0), closed: fold === "closed" }, sections) : sections);
    }
    function FactRows({ items = [], plain = false, label, title, fold, className = "" }) {
      const folded = !!fold;
      const rows = /* @__PURE__ */ React2.createElement("dl", { className: ("mcp-cb mcp-cb-facts" + (plain || folded ? "" : " mcp-cb-fence") + " " + className).trim(), "aria-label": label || title }, items.map((f, i) => /* @__PURE__ */ React2.createElement("div", { key: i }, /* @__PURE__ */ React2.createElement("dt", null, f.label), /* @__PURE__ */ React2.createElement("dd", null, cbRich(f.value)))));
      if (!folded) return rows;
      return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-cb" + (plain ? "" : " mcp-cb-fence") + " " + className).trim() }, cbFold({ title: title || label || "Details", count: items.length, closed: fold === "closed", pad: true }, React2.cloneElement(rows, { className: "mcp-cb-facts" })));
    }
    function ConfirmCard({ title, question, facts, note, confirm = "Confirm", cancel = "Cancel", answer, onConfirm, onCancel, className = "" }) {
      const done = answer === "confirm" || answer === "cancel";
      const btn = (k, text, on, main) => {
        const p = answer === k;
        return cbPress(!done && on, { className: "mcp-cb-choice" + (main ? " is-main" : "") + (p ? " is-picked" : done ? " is-spent" : ""), "aria-pressed": p }, /* @__PURE__ */ React2.createElement(React2.Fragment, null, p && /* @__PURE__ */ React2.createElement(Icon, { name: "check", size: 14 }), text));
      };
      return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-cb mcp-cb-fence mcp-cb-card mcp-cb-confirm " + className).trim(), role: "group", "aria-label": title || "Confirm" }, title && /* @__PURE__ */ React2.createElement("p", { className: "mcp-cb-title" }, title), question && /* @__PURE__ */ React2.createElement("p", { className: "mcp-cb-q" }, cbRich(question)), facts && facts.length > 0 && /* @__PURE__ */ React2.createElement(FactRows, { items: facts, plain: true }), note && /* @__PURE__ */ React2.createElement("p", { className: "mcp-cb-note" }, note), /* @__PURE__ */ React2.createElement("div", { className: "mcp-cb-pair" }, btn("cancel", cancel, onCancel, false), btn("confirm", confirm, onConfirm, true)));
    }
    function EntityCards({ title, items = [], onPick, fold, className = "" }) {
      const folded = !!fold;
      const list = /* @__PURE__ */ React2.createElement("ul", { className: "mcp-cb-ents-list" }, items.map((it, i) => {
        const pic = it.pic ? /* @__PURE__ */ React2.createElement("img", { src: it.pic, alt: "" }) : it.icon ? /* @__PURE__ */ React2.createElement(Icon, { name: it.icon, size: 16 }) : null;
        return /* @__PURE__ */ React2.createElement("li", { key: i }, cbPress(onPick && (() => onPick(it, i)), { className: "mcp-cb-ent" + (it.state ? " is-" + it.state : ""), "aria-pressed": it.state === "picked" }, /* @__PURE__ */ React2.createElement(React2.Fragment, null, pic && /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-ent-pic " + (it.pic ? "is-" + (it.tone || "cream") : "is-icon"), "aria-hidden": "true" }, pic), /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-ent-t" }, /* @__PURE__ */ React2.createElement("b", null, it.name), it.line && /* @__PURE__ */ React2.createElement("small", null, it.line)))));
      }));
      return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-cb mcp-cb-ents" + (folded ? " mcp-cb-fence" : "") + " " + className).trim(), role: "group", "aria-label": title || "In the game" }, folded ? cbFold({ title: title || "In the game", count: items.length, closed: fold === "closed", pad: true }, list) : /* @__PURE__ */ React2.createElement(React2.Fragment, null, title && /* @__PURE__ */ React2.createElement("p", { className: "mcp-cb-kind" }, title), list));
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
        const s = (r.marks || "")[i] === "_" ? "blank" : c ? MARK[(r.marks || "")[i]] || "filled" : "empty";
        return { c, s };
      }));
      const say = label || grid.map((row, i) => "Row " + (i + 1) + (row.every((x) => x.s === "empty" || x.s === "blank") ? " empty" : ": " + row.filter((x) => x.s !== "blank").map((x) => x.c ? x.c + (SAY[x.s] ? " " + SAY[x.s] : "") : "blank").join(", "))).join(". ");
      return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-cb mcp-cb-tiles " + className).trim(), role: "img", "aria-label": say }, /* @__PURE__ */ React2.createElement("div", { className: "mcp-cb-tiles-in" + (all.length > 1 ? " mcp-cb-fence" : ""), style: { "--n": n } }, grid.map((row, i) => /* @__PURE__ */ React2.createElement("div", { key: i, className: "mcp-cb-tiles-row" }, row.map((x, k) => /* @__PURE__ */ React2.createElement("span", { key: k, className: "mcp-cb-tile is-" + x.s, "aria-hidden": x.s === "blank" || void 0 }, x.s === "blank" ? null : x.c))))));
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
      return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-cb mcp-cb-fence mcp-cb-board " + className).trim(), style: { "--cols": cols }, role: "group", "aria-label": label || "Word board" }, solved.map((g2, i) => /* @__PURE__ */ React2.createElement("div", { key: "s" + i, className: "mcp-cb-band is-" + (g2.tone || TONES[i % 4]) }, /* @__PURE__ */ React2.createElement("b", null, g2.label), /* @__PURE__ */ React2.createElement("span", null, g2.words.join(", ")))), words.length > 0 && /* @__PURE__ */ React2.createElement("div", { className: "mcp-cb-chips" }, words.map((w) => {
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
    function StatusMessage({ kind: kind2 = "success", children }) {
      return /* @__PURE__ */ React2.createElement("p", { className: "mcp-msg mcp-msg-" + kind2, role: kind2 === "error" ? "alert" : "status" }, /* @__PURE__ */ React2.createElement(Icon, { name: G[kind2] }), /* @__PURE__ */ React2.createElement("span", null, children));
    }
    const TIME_CHIPS = { tiny: "5–15 min", small: "25–45 min" };
    function Tag({ kind: kind2 = "daily", children, icon, go }) {
      const ic = icon || (kind2 === "locked" ? "lock" : null);
      const g2 = go ?? (kind2 === "locked" || kind2 === "open");
      return /* @__PURE__ */ React2.createElement("span", { className: "mcp-tag mcp-tag-" + kind2 + (g2 ? " has-go" : "") }, ic && /* @__PURE__ */ React2.createElement(Icon, { name: ic, size: 14 }), children, g2 && /* @__PURE__ */ React2.createElement(Icon, { name: "next", size: 14, className: "mcp-tag-go" }));
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
      if (b.type === "mono") return /* @__PURE__ */ React2.createElement("pre", { className: "mcp-chat-mono" }, b.text.split(/(\/(?!\/))/).map((t, i) => t === "/" ? /* @__PURE__ */ React2.createElement(React2.Fragment, { key: i }, "/", /* @__PURE__ */ React2.createElement("wbr", null)) : t));
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
      "weekly-interrogation": '<svg viewBox="0 0 171 108" preserveAspectRatio="xMidYMid slice"><rect width="171" height="108" fill="#421A28"/><circle cx="75" cy="54" r="36" fill="none" stroke="#D66847" stroke-width="14"/><rect x="107" y="20" width="14" height="68" fill="#F2EBE0"/><rect x="107" y="20" width="14" height="22" fill="#E5A63B"/></svg>',
      "dungeon-quest": '<svg viewBox="0 0 171 108" preserveAspectRatio="xMidYMid slice"><rect width="171" height="108" fill="#163328"/><path d="M31.7,108 L64.4,51.8 L97.2,108Z" fill="#E5A63B"/><path d="M67.6,108 L103.4,40.9 L139.3,108Z" fill="#A390B2"/><path d="M67.6,108 L82.4,80.3 L97.2,108Z" fill="#328A88"/></svg>',
      "dungeon-quest-single": '<svg viewBox="0 0 171 108" preserveAspectRatio="xMidYMid slice"><rect width="171" height="108" fill="#163328"/><path d="M47,108 L93,22 L139,108Z" fill="#A390B2"/></svg>'
    };
    const META = { "daily-puzzles": ["indigo", "centre"], "daily-puzzles-diagonal": ["indigo", "centre"], "weekly-interrogation": ["wine", "centre"], "dungeon-quest": ["forest", "bottom"], "dungeon-quest-single": ["forest", "bottom"] };
    function Cover({ name, art, src, children, onClick, fill = false, ground, extend, className = "" }) {
      const m = META[art] || [];
      const g2 = ground || m[0] || "indigo";
      const x = extend || m[1];
      if (fill && !x && typeof console !== "undefined") console.warn('Cover: fill needs the asset to declare extend ("bottom" or "centre").');
      const cls = "mcp-cover" + (fill ? " is-fill is-" + g2 + " from-" + (x || "centre") : "") + (className ? " " + className : "");
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
    function CardRow({ title, sub, label, as = "h2", kind: kind2 = "cards", children, className = "" }) {
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
      return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-crow" + (kind2 === "chat" ? " is-chat" : kind2 === "tiles" ? " is-tiles" : "") + " " + className).trim() }, /* @__PURE__ */ React2.createElement("div", { className: "mcp-crow-head" }, /* @__PURE__ */ React2.createElement(T, { className: "mcp-t-sec mcp-crow-title" }, title), at.over && /* @__PURE__ */ React2.createElement("div", { className: "mcp-crow-nav" }, /* @__PURE__ */ React2.createElement("button", { ref: prev, type: "button", className: "mcp-crow-btn", "aria-label": "Previous, " + name, style: at.start ? { visibility: "hidden" } : null, onClick: () => move(-1) }, /* @__PURE__ */ React2.createElement(Icon, { name: "next", style: { transform: "rotate(180deg)" } })), /* @__PURE__ */ React2.createElement("button", { ref: next, type: "button", className: "mcp-crow-btn", "aria-label": "Next, " + name, style: at.end ? { visibility: "hidden" } : null, onClick: () => move(1) }, /* @__PURE__ */ React2.createElement(Icon, { name: "next" }))), sub && /* @__PURE__ */ React2.createElement("p", { className: "mcp-crow-sub" }, sub)), /* @__PURE__ */ React2.createElement("div", { ref, className: "mcp-crow-track", role: "region", "aria-label": name, tabIndex: 0, style: { "--n": n } }, children));
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
    function gameMark({ soon, pass, onPass, first }) {
      if (soon) return /* @__PURE__ */ React2.createElement("span", { className: "mcp-passmark is-soon" }, "Coming soon");
      if (pass) return onPass ? /* @__PURE__ */ React2.createElement("button", { type: "button", className: "mcp-passmark is-link", onClick: (e) => {
        e.stopPropagation();
        onPass(e);
      } }, /* @__PURE__ */ React2.createElement(Icon, { name: "lock", size: 14 }), "Pass") : /* @__PURE__ */ React2.createElement("span", { className: "mcp-passmark" }, /* @__PURE__ */ React2.createElement(Icon, { name: "lock", size: 14 }), "Pass");
      if (first) return /* @__PURE__ */ React2.createElement("span", { className: "mcp-passmark" }, /* @__PURE__ */ React2.createElement(Icon, { name: "lock", size: 14 }), "First free");
      return null;
    }
    function GameCard({ art, pass, onPass, first, soon, title, mark, blurb, tags, className = "", style }) {
      const m = gameMark({ soon, pass, onPass, first });
      return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-card mcp-gcard " + (soon ? "is-soon " : "") + className).trim(), style }, /* @__PURE__ */ React2.createElement("div", { className: "mcp-gcard-art" }, art, m), /* @__PURE__ */ React2.createElement("div", { className: "mcp-gcard-text" }, /* @__PURE__ */ React2.createElement("div", { className: "mcp-gcard-name" }, /* @__PURE__ */ React2.createElement("h3", { className: "mcp-t-card" }, title), mark), /* @__PURE__ */ React2.createElement("p", { className: "mcp-gcard-blurb" }, blurb)), /* @__PURE__ */ React2.createElement("div", { className: "mcp-gcard-tags" }, tags));
    }
    function GamePick({ art, pass, onPass, first, soon, label, title, blurb, tags, className = "", style }) {
      const m = gameMark({ soon, pass, onPass, first });
      return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-card mcp-gpick " + (soon ? "is-soon " : "") + className).trim(), style }, /* @__PURE__ */ React2.createElement("div", { className: "mcp-gpick-art" }, art, m), /* @__PURE__ */ React2.createElement("div", { className: "mcp-gpick-text" }, /* @__PURE__ */ React2.createElement("span", { className: "mcp-gpick-label" }, label), /* @__PURE__ */ React2.createElement("h3", { className: "mcp-t-card" }, title), /* @__PURE__ */ React2.createElement("p", { className: "mcp-gpick-blurb" }, blurb)), /* @__PURE__ */ React2.createElement("div", { className: "mcp-gpick-tags" }, tags));
    }
    function GameTile({ art, pass, onPass, first, soon, title, kind: kind2, className = "", style }) {
      const m = gameMark({ soon, pass, onPass, first });
      return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-gtile " + (soon ? "is-soon " : "") + className).trim(), style }, /* @__PURE__ */ React2.createElement("div", { className: "mcp-gtile-art" }, art, m), /* @__PURE__ */ React2.createElement("span", { className: "mcp-gtile-name" }, title), kind2 && /* @__PURE__ */ React2.createElement("span", { className: "mcp-gtile-kind" }, kind2));
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
    const fitTitle = (t, n, g2, full) => {
      if (g2) g2.style.display = "";
      n.textContent = full;
      if (!over(t)) return;
      if (g2) {
        g2.style.display = "none";
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
    function Popup({ open, onClose, title, children, actions, kind: kind2 = "dialog", posture = "auto", breakpoint = 640, contained = false, busy = false, label }) {
      const layer = React2.useRef(null);
      const wide = useWide(layer, breakpoint);
      const panel = kind2 === "panel";
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
    ns.TIME_CHIPS = TIME_CHIPS;
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
  const DS = window.MCPGameStoreDesignSystem_ef1abd;
  React$1.createContext(null);
  const GS = {
    today: "Tuesday 6 October"
  };
  const GS_NAME = { casebook: "Casebook", hunter: "36,000 Summers Ago" };
  const GS_GAMES = {
    word: { access: "daily", name: "Guess", category: "PUZZLE", art: "word", route: "word", ed: ["word", "words"], daily: true, once: true, blurb: "One hidden word a day: find it in six guesses.", tags: ["Daily"], size: "tiny" },
    groups: { access: "pass", name: "Daily Groups", category: "PUZZLE", art: "groups", route: "groups", ed: ["puzzle", "puzzles"], edLink: "See all groups", edAll: "All groups", daily: true, once: true, blurb: "Sixteen words hide four groups. Find all four.", tags: ["Daily", "10 min"] },
    mystery: { access: "daily", name: "Accuse", category: "PUZZLE", art: "murder", route: "mystery", ed: ["case", "cases"], daily: true, once: true, blurb: "Four suspects, four weapons, four places. Who do you accuse?", tags: ["Daily"], size: "tiny" },
    escape: { access: "first", soon: true, name: "Escape", category: "PUZZLE", art: "escape", route: "escape", ed: ["room", "rooms"], blurb: "The door’s locked and you’re on the wrong side of it.", tags: ["Weekly"], size: "small" },
    // Casebook is episodic: cases are its editions, with no schedule.
    casebook: { access: "pass", name: GS_NAME.casebook, category: "MYSTERY", art: "casebook", route: "casebook", ed: ["case", "cases"], once: true, blurb: "Ask the question they haven’t prepared for.", tags: ["25–40 min"] },
    delve: { access: "first", name: "Delve", category: "ADVENTURE", art: "delve", route: "delve", ed: ["run", "runs"], blurb: "A new world every week: fight room by room to the villain at its heart.", tags: ["Weekly"], size: "small" },
    // Chapters are its editions; a free player gets chapter 1. Sample content.
    barrow: { access: "first", name: "The Barrow of Hollowmere", category: "ADVENTURE", art: "barrow", route: "barrow", ed: ["chapter", "chapters"], edLink: "All chapters", edAll: "All chapters", blurb: "Bring the lost bell home from the barrow. Your hero carries on.", tags: ["Several sessions"] },
    hunter: { access: "pass", name: GS_NAME.hunter, category: "LEARNING", art: "hunter", route: "hunter", ed: ["summer", "summers"], blurb: "Grey dawn below Chauvet cave. Go where you like.", tags: ["2 hours"] }
  };
  const gsAccess = (g2) => {
    g2.free = g2.access === "daily";
    g2.first = g2.access === "first";
    g2.tags = [{ daily: "FREE", first: "FIRST", pass: "PASS" }[g2.access], ...g2.tags.filter((t) => !["FREE", "FIRST", "PASS"].includes(t)), ...g2.size ? [DS.TIME_CHIPS[g2.size]] : []];
    return g2;
  };
  Object.values(GS_GAMES).forEach(gsAccess);
  const GS_ORD = ["first", "second", "third", "fourth", "fifth", "sixth"];
  const gsJoin = (xs) => xs.length < 2 ? xs.join("") : xs.slice(0, -1).join(", ") + " and " + xs[xs.length - 1];
  const gsGuessParts = (word, answer) => {
    const w = word.split("");
    const a = answer.split("");
    const marks = w.map(() => "miss");
    const left = {};
    a.forEach((ch, i) => {
      if (w[i] === ch) marks[i] = "hit";
      else left[ch] = (left[ch] || 0) + 1;
    });
    w.forEach((ch, i) => {
      if (marks[i] !== "hit" && left[ch]) {
        marks[i] = "near";
        left[ch] -= 1;
      }
    });
    if (marks.every((m) => m === "hit")) return ["Every letter is in place"];
    const name = (ch, i) => w.filter((x) => x === ch).length > 1 ? "the " + GS_ORD[w.slice(0, i + 1).filter((x) => x === ch).length - 1] + " " + ch : ch;
    const say = (kind2, tail) => {
      const n = w.map((ch, i) => marks[i] === kind2 ? name(ch, i) : null).filter(Boolean);
      if (!n.length) return null;
      const t = gsJoin(n) + (n.length === 1 ? " is " : " are ") + tail;
      return t.charAt(0).toUpperCase() + t.slice(1);
    };
    return [say("hit", "in place"), say("near", "in the word"), say("miss", "not in the word")].filter(Boolean);
  };
  const gsWordLines = (answer, seq) => {
    let n = 0;
    return seq.map((x) => typeof x === "string" ? ["Guess " + (n += 1), x, ...gsGuessParts(x, answer)] : x);
  };
  const gsEsLines = (steps) => {
    let n = 0;
    return steps.map((x) => x[0] === "Hint" || x[0] === "Item" ? x : ["Move " + (n += 1), ...x]);
  };
  const gsEsHint = (lock, rung, text) => ["Hint", "The " + lock, "Hint " + rung + " of 3", text];
  const GS_ES_WORDS4 = ["GEAR", "TIME", "HAND", "BELL", "HOUR", "SAND", "WIND", "DUST"];
  const GS_ES_DIG4 = ["1234", "1479", "9147", "4719", "7149", "1947", "4179", "9741", "7491", "1974", "4197", "9471", "7194", "1497", "4917", "9174", "7941", "4971"];
  const GS_ES_WORDS5 = ["TRAIN", "STEAM", "TRACK", "PLATE"];
  const GS_ES_DIG3 = ["123", "482", "907", "256"];
  const GS_DV_TURNCOAT = "As the sentries come at you, a scrawny goblin chained to the wall behind them wrenches at his rusted staple, his back striped from the whip. It gives, and he scrambles free and turns on his masters with murder in his eyes.";
  const GS_DV_WON = [
    ["Wisdom", "Search the lock-keeper's niche", "Failure", "Natural 1", "Rolled 1 + 0 = 1 against DC 12", "HP 12/13"],
    ["Room", "Entered the chime run"],
    ["Dexterity", "Miss", "Rolled 9 + 1 = 10 against DC 12", "HP 11/13"],
    ["Dexterity", "Weak hit", "Rolled 11 + 1 = 12 against DC 12"],
    ["Dexterity", "Strong hit", "Rolled 18 + 1 = 19 against DC 12"],
    ["Room", "Entered the warren"],
    ["Turn", "The turncoat joins", GS_DV_TURNCOAT],
    ["Strength", "Weak hit", "Rolled 9 + 3 = 12 against DC 12"],
    ["Strength", "Weak hit", "Rolled 13 + 3 = 16 against DC 12", "HP 9/13"],
    ["Strength", "Strong hit", "Rolled 17 + 3 = 20 against DC 12"],
    ["Dexterity", "Rifle the stolen sacks", "Success", "Natural 20", "Rolled 20 + 1 = 21 against DC 12"],
    ["Room", "Entered Snaggle's den"],
    ["Gear", "Used a pepper pouch", "Snaggle: track 3 → 1"],
    ["Strength", "Strong hit", "Rolled 18, the higher of 15 and 18, + 3 = 21 against DC 12"],
    ["Gear", "Took the iron key"],
    ["Room", "Doubled back to the warren", "The ritual +1"],
    ["Lock", "Opened the bone gate with the iron key"],
    ["Room", "Entered the shrine cavern"],
    ["Strength", "Strong hit", "Rolled 19, the higher of 11 and 19, + 3 = 22 against DC 12"],
    ["Strength", "Strong hit", "Rolled 17, the higher of 17 and 9, + 3 = 20 against DC 12"]
  ];
  const GS_DV_LIVE = [
    ["Oracle", "Is anyone awake down here?", "Yes", "Rolled d100 23 against 25"],
    ["Room", "Entered the chime run"],
    ["Dexterity", "Weak hit", "Rolled 13 + 3 = 16 against DC 12"],
    ["Dexterity", "Strong hit", "Rolled 16 + 3 = 19 against DC 12"],
    ["Room", "Entered the warren"],
    ["Turn", "The turncoat joins", GS_DV_TURNCOAT],
    ["Dexterity", "Strong hit", "Rolled 14 + 3 = 17 against DC 12"],
    ["Dexterity", "Strong hit", "Rolled 14, the higher of 8 and 14, + 3 = 17 against DC 12"],
    ["Intelligence", "Study the wall scratchings", "Success", "Rolled 19, the higher of 19 and 15, + 1 = 20 against DC 12"],
    ["Room", "Entered Snaggle's den"],
    ["Dexterity", "Strong hit", "Rolled 14, the higher of 14 and 5, + 3 = 17 against DC 12"],
    ["Dexterity", "Strong hit", "Rolled 18, the higher of 18 and 7, + 3 = 21 against DC 12"],
    ["Dexterity", "Climb to the skeleton on the high ledge", "Success", "Natural 20", "Rolled 20, the higher of 20 and 6, + 3 = 23 against DC 12"],
    ["Room", "Doubled back to the warren", "The ritual +1"]
  ];
  const GS_DV_ENDINGS = ["Elsie rescued", "Too late: the ritual was completed", "Fell in the warren"];
  const GS_ES1 = {
    bench: "A workbench scattered with tools. On a tray sits a train of four brass gears with 20, 9, 3 and 11 teeth. The crank turns the 20-tooth gear, which turns the 9, which turns the 3, which turns the 11. The tray reads “One tooth, one letter.” Below it, a drawer with a four-letter lock.",
    clock: "A tall case clock, stopped, its hands stiff. There is a winding hole in its face.",
    cabinet: "A glass cabinet with a four-digit lock. Through the glass, four pocket watches hang on tagged chains: Thursday’s shows nine o’clock, Monday’s seven, Wednesday’s one, Tuesday’s four. A brass plate on the frame: “My code is my watches’ hours, Monday to Thursday.”",
    portrait: "A girl of about ten, reaching up to a tall clock, a locket at her throat lost in the gloom. Beneath, in Ezra’s hand: “Ada.”",
    fire: "Cold ashes in an iron grate. The panelling beside it is carved with tiny gears, too shadowed to make out.",
    door: "A narrow oak door, hidden in the panelling until now, with a four-letter lock.",
    drawer: "Inside the drawer lies a small brass key, its bow shaped like a clock face.",
    diary: "Among the pocket watches lies a page torn from Ezra’s diary: “Ada went to live with her mother across the sea. Her train left at four o’clock. I said goodbye to her on the platform a quarter of an hour before it went, and stood there alone until it had gone. I stopped every clock in the house that day. Set the case clock to the moment I said goodbye, and this room will show you where I am.”",
    clockWound: "A tall case clock, wound but silent. Its hands now turn freely: the hour hand to any hour, the minute hand to the hour, quarter past, half past or quarter to.",
    hands: "The hands click home at a quarter to four, and the case clock begins to tick. The cloud outside breaks."
  };
  const GS_ES1_LINES = gsEsLines([
    ["Examined the workbench", GS_ES1.bench],
    ["Tried GEAR on the workbench drawer", "Wrong"],
    gsEsHint("workbench drawer", 1, "Count the gears’ teeth, and read each count as a letter."),
    ["Tried TICK on the workbench drawer", GS_ES1.drawer],
    ["Item", "Picked up the brass winding key", "A small brass key, its bow shaped like a clock face."],
    ["Examined the case clock", GS_ES1.clock],
    ["Used the brass winding key on the case clock", "Used up", GS_ES1.clockWound],
    ["Examined the glass cabinet", GS_ES1.cabinet],
    ["Tried 1479 on the cabinet lock", "Wrong"],
    ["Tried 7419 on the cabinet lock", GS_ES1.diary],
    ["Set the clock hands: Hour hand 3, Minute hand 45", GS_ES1.hands],
    ["Examined the portrait", GS_ES1.portrait],
    ["Examined the fireplace", GS_ES1.fire],
    ["Examined the oak door", GS_ES1.door],
    ["Tried TOCK on the oak door lock", "Out"]
  ]);
  const GS_CB_REC = [
    { c: "F", act: "Search", what: "Searched the hotel bar", out: "Found the bar ledger" },
    { c: "F", act: "Search", what: "Searched the harbour noticeboard", out: "Found the ferry notice" },
    { c: "F", act: "Search", what: "Searched the lighthouse stairs", out: "Found a green silk scarf, Pike’s broken watch" },
    { c: "F", act: "Search", what: "Searched Pike’s office", out: "Found a letter of dismissal, a partnership deed, Pike’s will" },
    { c: "Q", act: "Question", what: "Asked Maeve Doyle about Tobias Pike" },
    { c: "B", act: "Show evidence", what: "Showed the bar ledger to Maeve Doyle", out: "Lie exposed" },
    { c: "B", act: "Show evidence", what: "Showed the ferry notice to Tobias Pike", out: "Lie exposed" },
    { c: "Q", act: "Question", what: "Asked Dr. Celia Rourke about Pike’s broken watch" },
    { c: "B", act: "Show evidence", what: "Showed a green silk scarf to Dr. Celia Rourke", out: "Lie exposed" },
    { c: "H", act: "Show evidence", what: "Showed Pike’s will to Dr. Celia Rourke", out: "Their story stood" },
    { c: "B", act: "Show evidence", what: "Showed What Tobias heard to Dr. Celia Rourke", out: "Lie exposed" },
    { c: "A", act: "Accusation", what: "Dr. Celia Rourke", out: "Right" }
  ];
  const gsCbLines = (rec) => rec.map((r, i) => r.c === "A" ? ["Accused " + r.what, r.out] : ["Turn " + (i + 1), r.what, ...r.out ? [r.out] : []]);
  const GS_CB_HARD = [
    ...GS_CB_REC.slice(0, 5),
    { c: "H", act: "Show evidence", what: "Showed a letter of dismissal to Maeve Doyle", out: "Their story stood" },
    { c: "Q", act: "Question", what: "Asked Tobias Pike about the ferry" },
    { c: "H", act: "Show evidence", what: "Showed a partnership deed to Tobias Pike", out: "Their story stood" },
    ...GS_CB_REC.slice(5, 11),
    { c: "Q", act: "Question", what: "Asked Maeve Doyle about the harbour" },
    { c: "H", act: "Show evidence", what: "Showed a green silk scarf to Maeve Doyle", out: "Their story stood" },
    GS_CB_REC[11]
  ];
  const GS_CB_FAILED = [...GS_CB_REC.slice(0, 7), { c: "A", act: "Accusation", what: "Tobias Pike", out: "Wrong" }];
  const GS_SESSIONS = {
    // Delve run 1 won, Bryn the Fighter.
    delve: {
      kind: "delve",
      gid: "delve",
      game: "Delve",
      art: "delve",
      result: "Elsie rescued",
      date: "Monday 5 October",
      figures: ["Threat 5/12", "11 rolls", "1 natural 20", "HP 9/13"],
      tracks: { progress: 5, rooms: 5, threat: 5, threatMax: 12 },
      lines: GS_DV_WON,
      endings: GS_DV_ENDINGS,
      reached: "Elsie rescued",
      // What the session page's sheet and run card read (app/gs-delve.jsx): the setting, the hero, the tracks' ends, abilities used, inspiration.
      setting: "The Goblin Warren beneath Ashford Mill",
      end: "won",
      hero: "Bryn the Fighter",
      hpMax: 13,
      threat: 5,
      threatMax: 12,
      sheet: { used: { "Shield bash": 1 }, insp: true },
      share: "Elsie rescued",
      shareLines: ["The Goblin Warren beneath Ashford Mill", "Bryn the Fighter · ✅ Elsie rescued · 11 rolls · longest streak 5", "💀🟥🟨🟩🟨🟨🟩✨🟩🟩🟩"]
    },
    // Guess and Accuse tell one story per game on every surface: today's play, its in-progress form and one earlier play.
    "word-today": {
      kind: "puzzle",
      gid: "word",
      game: "Guess",
      art: "word",
      number: 34,
      answer: "STILL",
      hints: 1,
      result: "Solved in 3 of 6",
      date: GS.today,
      share: "Solved in 3 of 6",
      lines: gsWordLines("STILL", ["CRANE", "SLATE", ["Hint", "Letter 2 is T."], "STILL"])
    },
    // Sample plays for the session page (1236). No. 32, the hard play: solved on the fifth guess with the hint; after ROBOT only
    // letter 4 was green, so the hint gave letter 1. No. 30, lost: the SHA_E trap, four letters in place from guess 2 to 6.
    "word-hard": {
      kind: "puzzle",
      gid: "word",
      game: "Guess",
      art: "word",
      number: 32,
      answer: "FLOOR",
      hints: 1,
      result: "Solved in 5 of 6",
      date: "Sunday 4 October",
      share: "Solved in 5 of 6",
      lines: gsWordLines("FLOOR", ["CRANE", "ROBOT", ["Hint", "Letter 1 is F."], "FROGS", "FLOUR", "FLOOR"])
    },
    "word-failed": {
      kind: "puzzle",
      gid: "word",
      game: "Guess",
      art: "word",
      number: 30,
      answer: "STEAL",
      loss: true,
      hints: 1,
      result: "Failed",
      date: "Friday 2 October",
      share: "Failed",
      lines: gsWordLines("STEAL", ["CRANE", ["Hint", "Letter 4 is A."], "METAL", "PETAL", "DECAL", "SEPAL", "SHOAL"])
    },
    // This week's room, No. 1 The Clockmaker’s Study, played on Tuesday: escaped in 28 min, under par, 1 hint, 2 wrong tries.
    "escape-week": {
      kind: "puzzle",
      gid: "escape",
      game: "Escape",
      art: "escape",
      result: "Escaped in 28 min, under par",
      date: GS.today,
      figures: ["28 min, under par", "1 hint", "2 wrong tries"],
      share: "Escaped in 28 min, under par",
      shareLines: ["Escape No. 1 · escaped in 28 min, under par · 1 hint 💡 · 2 wrong tries"],
      lines: GS_ES1_LINES
    },
    "word-1005": {
      kind: "puzzle",
      gid: "word",
      game: "Guess",
      art: "word",
      number: 33,
      answer: "CHAIN",
      result: "Solved in 4 of 6",
      date: "Monday 5 October",
      share: "Solved in 4 of 6",
      lines: gsWordLines("CHAIN", ["CRANE", "CHANT", "CHAIR", "CHAIN"])
    },
    // Daily Groups. Fish 🟦, weather 🟨, music 🟪, fence 🟩. Share rows hide every word.
    "groups-today": {
      kind: "puzzle",
      gid: "groups",
      game: "Daily Groups",
      art: "groups",
      result: "All 4 groups, 1 mistake",
      date: GS.today,
      figures: ["4 of 4 groups", "1 mistake"],
      share: "All 4 groups, 1 mistake",
      shareHead: "Daily Groups #88 · 1 mistake",
      rows: ["🟪🟦🟦🟦", "🟦🟦🟦🟦", "🟨🟨🟨🟨", "🟪🟪🟪🟪", "🟩🟩🟩🟩"],
      lines: [
        ["Try 1", "BASS · PIKE · CARP · SOLE", "One away"],
        ["Try 2", "PIKE · CARP · SOLE · PERCH", "Found: fish"],
        ["Try 3", "FROST · MIST · HAIL · SLEET", "Found: weather"],
        ["Try 4", "BASS · CHORD · SCALE · NOTE", "Found: music"],
        ["Try 5", "RAIL · GATE · POST · PANEL", "Found: parts of a fence"]
      ]
    },
    "groups-1005": {
      kind: "puzzle",
      gid: "groups",
      game: "Daily Groups",
      art: "groups",
      result: "All 4 groups, no mistakes",
      date: "Monday 5 October",
      figures: ["4 of 4 groups", "No mistakes"],
      share: "All 4 groups, no mistakes",
      shareHead: "Daily Groups #87 · no mistakes",
      rows: ["🟨🟨🟨🟨", "🟦🟦🟦🟦", "🟩🟩🟩🟩", "🟪🟪🟪🟪"],
      lines: [
        ["Try 1", "OAK · ASH · ELM · YEW", "Found: trees"],
        ["Try 2", "JACK · KING · QUEEN · ACE", "Found: playing cards"],
        ["Try 3", "MARS · VENUS · PLUTO · EARTH", "Found: planets"],
        ["Try 4", "BOW · STERN · DECK · HULL", "Found: parts of a ship"]
      ]
    },
    // Case 1, The Last Night at Gull Point, solved.
    casebook: {
      kind: "case",
      gid: "casebook",
      game: GS_NAME.casebook,
      art: "casebook",
      result: "Solved",
      date: "Monday 5 October",
      figures: ["11 of 16 turns", "4 of 4 lies exposed", "You accused Dr. Celia Rourke"],
      share: "Solved",
      shareLines: ["Casebook: The Last Night at Gull Point", "✅ solved · 11 of 16 turns · 4 lies exposed"],
      lines: gsCbLines(GS_CB_REC)
    }
  };
  Object.assign(GS_SESSIONS, {
    "word-today-hard": {
      ...GS_SESSIONS["word-today"],
      result: "Solved in 5 of 6",
      share: "Solved in 5 of 6",
      lines: gsWordLines("STILL", ["CRANE", "SLATE", ["Hint", "Letter 2 is T."], "STOOL", "STALL", "STILL"])
    },
    "word-today-failed": {
      ...GS_SESSIONS["word-today"],
      loss: true,
      result: "Failed",
      share: "Failed",
      lines: gsWordLines("STILL", ["CRANE", "SLATE", ["Hint", "Letter 2 is T."], "STALL", "SPILL", "SKILL", "SWILL"])
    },
    "groups-today-hard": {
      ...GS_SESSIONS["groups-today"],
      now: { line: "You found all four groups with three mistakes, and no hints.", bar: ["4 of 4 groups", 4, 4] },
      result: "All 4 groups, 3 mistakes",
      share: "All 4 groups, 3 mistakes",
      figures: ["4 of 4 groups", "3 mistakes"],
      shareHead: "Daily Groups #88 · 3 mistakes",
      rows: ["🟪🟦🟦🟦", "🟦🟦🟦🟦", "🟨🟨🟨🟪", "🟨🟨🟨🟨", "🟪🟪🟪🟩", "🟪🟪🟪🟪", "🟩🟩🟩🟩"],
      lines: [
        ["Try 1", "BASS · PIKE · CARP · SOLE", "One away"],
        ["Try 2", "PIKE · CARP · SOLE · PERCH", "Found: fish"],
        ["Try 3", "FROST · MIST · HAIL · NOTE", "One away"],
        ["Try 4", "FROST · MIST · HAIL · SLEET", "Found: weather"],
        ["Try 5", "CHORD · SCALE · NOTE · RAIL", "One away"],
        ["Try 6", "BASS · CHORD · SCALE · NOTE", "Found: music"],
        ["Try 7", "RAIL · GATE · POST · PANEL", "Found: parts of a fence"]
      ]
    },
    "groups-today-failed": {
      ...GS_SESSIONS["groups-today"],
      now: { line: "You found 2 of the 4 groups before your fourth mistake.", bar: ["2 of 4 groups", 2, 4] },
      loss: true,
      result: "2 of 4 groups",
      share: "2 of 4 groups",
      figures: ["2 of 4 groups", "4 mistakes"],
      shareHead: "Daily Groups #88 · 4 mistakes",
      rows: ["🟪🟦🟦🟦", "🟦🟦🟦🟦", "🟨🟨🟨🟪", "🟨🟨🟨🟨", "🟪🟪🟪🟩", "🟪🟩🟩🟪"],
      lines: [
        ["Try 1", "BASS · PIKE · CARP · SOLE", "One away"],
        ["Try 2", "PIKE · CARP · SOLE · PERCH", "Found: fish"],
        ["Try 3", "FROST · MIST · HAIL · NOTE", "One away"],
        ["Try 4", "FROST · MIST · HAIL · SLEET", "Found: weather"],
        ["Try 5", "CHORD · SCALE · NOTE · RAIL", "One away"],
        ["Try 6", "NOTE · RAIL · GATE · BASS", "Not a group"]
      ]
    }
  });
  Object.assign(GS_SESSIONS, {
    "casebook-hard": { ...GS_SESSIONS.casebook, figures: ["16 of 16 turns", "4 of 4 lies exposed", "You accused Dr. Celia Rourke"], lines: gsCbLines(GS_CB_HARD) },
    "casebook-failed": {
      ...GS_SESSIONS.casebook,
      loss: true,
      result: "Wrong accusation",
      share: "Wrong accusation",
      figures: ["7 of 16 turns", "2 of 4 lies exposed", "You accused Tobias Pike"],
      shareLines: ["Casebook: The Last Night at Gull Point", "❌ wrong accusation · 7 of 16 turns · 2 lies exposed"],
      lines: gsCbLines(GS_CB_FAILED)
    }
  });
  Object.assign(GS_SESSIONS, {
    "word-live": {
      kind: "puzzle",
      gid: "word",
      game: "Guess",
      art: "word",
      number: 34,
      answer: "STILL",
      live: true,
      result: "In progress",
      date: GS.today,
      share: null,
      lines: gsWordLines("STILL", ["CRANE", "SLATE"])
    },
    "groups-live": {
      kind: "puzzle",
      gid: "groups",
      game: "Daily Groups",
      art: "groups",
      live: true,
      result: "In progress",
      date: GS.today,
      figures: ["2 of 4 groups", "1 mistake"],
      share: null,
      lines: [["Try 1", "BASS · PIKE · CARP · SOLE", "One away"], ["Try 2", "PIKE · CARP · SOLE · PERCH", "Found: fish"], ["Try 3", "FROST · MIST · HAIL · SLEET", "Found: weather"]]
    },
    "escape-live": {
      kind: "puzzle",
      gid: "escape",
      game: "Escape",
      art: "escape",
      live: true,
      result: "In progress",
      date: GS.today,
      share: null,
      lines: GS_SESSIONS["escape-week"].lines.slice(0, 4)
    },
    // Delve run 1 in progress, Wren the Rogue.
    "delve-live": {
      ...GS_SESSIONS.delve,
      live: true,
      result: "In progress",
      figures: ["Threat 3/12", "8 rolls", "1 natural 20", "HP 11/11"],
      tracks: { progress: 4, rooms: 5, threat: 3, threatMax: 12 },
      lines: GS_DV_LIVE,
      reached: null,
      share: null,
      shareLines: null,
      hero: "Wren the Rogue",
      hpMax: 11,
      threat: 3,
      sheet: { used: { Backstab: 1 }, insp: true }
    }
  });
  Object.assign(GS_SESSIONS, {
    "word-begun": { ...GS_SESSIONS["word-live"], lines: [] },
    "groups-begun": { ...GS_SESSIONS["groups-live"], figures: ["0 of 4 groups", "No mistakes"], lines: [] },
    "escape-begun": { ...GS_SESSIONS["escape-live"], lines: [] },
    "delve-begun": { ...GS_SESSIONS["delve-live"], figures: ["Threat 0/12", "0 rolls", "HP 11/11"], tracks: { progress: 0, rooms: 5, threat: 0, threatMax: 12 }, lines: [], threat: 0, sheet: { used: {}, insp: true } }
  });
  GS_SESSIONS["escape-0928"] = GS_SESSIONS["escape-week"];
  const gsMis = (n) => n === 0 ? "no mistakes" : n === 1 ? "1 mistake" : n + " mistakes";
  const GS_RESULT = {
    word: (r) => r.ok ? "Solved in " + r.guesses + " of 6" : "Failed",
    groups: (r) => r.found === 4 ? "All 4 groups, " + gsMis(r.mistakes) : r.found + " of 4 groups",
    mystery: (r) => r.ok ? "Solved" : "Failed",
    // Escape has no lost outcome: every room can be finished. par: 'under par' | 'at par' | 'over par'.
    escape: (r) => "Escaped in " + r.min + " min, " + r.par,
    casebook: (r) => r.ok ? "Solved" : "Wrong accusation",
    // The setting's own ending words (The Goblin Warren beneath Ashford Mill).
    delve: (r) => ({ won: "Elsie rescued", ritual: "Too late: the ritual was completed", fell: "Fell in the warren" })[r.end],
    // A restarted day (no ending) reads Not finished.
    hunter: (r) => r.restarted ? "Not finished" : "Finished"
  };
  GS_SESSIONS["escape-week"].esTimes = { min: 28, opened: [6, 17, 19, 28] };
  GS_SESSIONS["escape-par"] = {
    ...GS_SESSIONS["escape-week"],
    result: GS_RESULT.escape({ min: 30, par: "under par" }),
    share: GS_RESULT.escape({ min: 30, par: "under par" }),
    figures: ["30 min, on par", "1 hint", "2 wrong tries"],
    shareLines: ["Escape No. 1 · escaped in 30 min, on par · 1 hint 💡 · 2 wrong tries"],
    esTimes: { min: 30, opened: [7, 18, 21, 30] }
  };
  GS_SESSIONS["escape-over"] = {
    ...GS_SESSIONS["escape-week"],
    result: GS_RESULT.escape({ min: 41, par: "over par" }),
    share: GS_RESULT.escape({ min: 41, par: "over par" }),
    figures: ["41 min, over par", "4 hints", "7 wrong tries"],
    shareLines: ["Escape No. 1 · escaped in 41 min, over par · 4 hints 💡 · 7 wrong tries"],
    esTimes: { min: 41, opened: [9, 27, 34, 41] },
    esParts: { 12: [1, 2] },
    lines: gsEsLines([
      ["Examined the workbench", GS_ES1.bench],
      ["Tried GEAR on the workbench drawer", "Wrong"],
      ["Tried TIME on the workbench drawer", "Wrong"],
      gsEsHint("workbench drawer", 1, "Count the gears’ teeth, and read each count as a letter."),
      ["Tried TICK on the workbench drawer", GS_ES1.drawer],
      ["Item", "Picked up the brass winding key", "A small brass key, its bow shaped like a clock face."],
      ["Examined the case clock", GS_ES1.clock],
      ["Examined the glass cabinet", GS_ES1.cabinet],
      ["Tried 1479 on the cabinet lock", "Wrong"],
      gsEsHint("cabinet lock", 1, "Each watch has a day on its tag. The plate says what order to read them in."),
      ["Tried 9147 on the cabinet lock", "Wrong"],
      gsEsHint("cabinet lock", 2, "Put the watches in order Monday to Thursday, then read the hour each one shows."),
      ["Tried 4719 on the cabinet lock", "Wrong"],
      gsEsHint("cabinet lock", 3, "Monday 7, Tuesday 4, Wednesday 1, Thursday 9. The answer is 7419."),
      ["Tried 7419 on the cabinet lock", GS_ES1.diary],
      ["Used the brass winding key on the case clock", "Used up", GS_ES1.clockWound],
      ["Set the clock hands: Hour hand 4, Minute hand 45", "1 of 2 hands click into place."],
      ["Set the clock hands: Hour hand 3, Minute hand 45", GS_ES1.hands],
      ["Examined the portrait", GS_ES1.portrait],
      ["Examined the fireplace", GS_ES1.fire],
      ["Examined the oak door", GS_ES1.door],
      ["Tried TICK on the oak door lock", "Wrong"],
      ["Tried TOCK on the oak door lock", "Out"]
    ])
  };
  GS_SESSIONS["escape-hard"] = (() => {
    const L = [];
    const mv = (what, res, more) => L.push(more ? [what, res, more] : [what, res]);
    const tryOn = (lock, list, k, from) => {
      for (let i = 0; i < k; i += 1) mv("Tried " + list[from + i] + " on the " + lock, "Wrong");
    };
    const setHands = (h, m, lit) => mv("Set the clock hands: Hour hand " + h + ", Minute hand " + m, lit + " of 2 hands click into place.");
    mv("Examined the workbench", "Gears of four sizes lie by the drawer.");
    tryOn("workbench drawer", GS_ES_WORDS4, 1, 0);
    mv("Tried TICK on the workbench drawer", "The drawer slides open.");
    L.push(["Item", "Picked up the brass winding key", "A small brass key, its bow shaped like a clock face."]);
    mv("Examined the glass cabinet", "Seven watches behind glass, each stopped.");
    tryOn("cabinet lock", GS_ES_DIG4, 9, 0);
    L.push(gsEsHint("cabinet lock", 1, "Each watch has a day on its tag. The plate says what order to read them in."));
    tryOn("cabinet lock", GS_ES_DIG4, 4, 9);
    L.push(gsEsHint("cabinet lock", 2, "Put the watches in order Monday to Thursday, then read the hour each one shows."));
    tryOn("cabinet lock", GS_ES_DIG4, 4, 13);
    L.push(gsEsHint("cabinet lock", 3, "Monday 7, Tuesday 4, Wednesday 1, Thursday 9. The answer is 7419."));
    mv("Tried 7419 on the cabinet lock", "The cabinet door swings open.");
    mv("Examined the case clock", "Its hands are stopped; the winding hole is empty.");
    mv("Used the brass winding key on the case clock", "Used up", GS_ES1.clockWound);
    setHands(5, 30, 0);
    setHands(3, 30, 1);
    setHands(4, 45, 1);
    L.push(gsEsHint("clock hands", 1, "Ezra’s diary page says which moment to set."));
    setHands(3, 15, 1);
    mv("Set the clock hands: Hour hand 3, Minute hand 45", "Both hands click home.");
    mv("Examined the writing desk", "A three-dial lock on the lid.");
    tryOn("writing desk lock", GS_ES_DIG3, 1, 0);
    mv("Tried 731 on the writing desk lock", "The lid lifts.");
    mv("Examined the map case", "A five-letter lock under the railway map.");
    tryOn("map case lock", GS_ES_WORDS5, 3, 0);
    L.push(gsEsHint("map case lock", 1, "The map marks one station in red."));
    mv("Tried ROUTE on the map case lock", "The drawer opens on a ticket.");
    mv("Examined the oak door", "Four letters, and the ticket fits the slot.");
    tryOn("oak door lock", GS_ES_WORDS4, 1, 1);
    mv("Tried TOCK on the oak door lock", "Out");
    const r = GS_RESULT.escape({ min: 52, par: "over par" });
    return {
      ...GS_SESSIONS["escape-week"],
      result: r,
      share: r,
      figures: ["52 min, over par", "5 hints", "27 wrong tries"],
      shareLines: ["Escape No. 1 · escaped in 52 min, over par · 5 hints 💡 · 27 wrong tries"],
      lines: gsEsLines(L),
      esTimes: { min: 52, opened: [3, 21, 30, 34, 44, 52] },
      esParts: { 25: [0, 2], 26: [1, 2], 27: [1, 2], 28: [1, 2] }
    };
  })();
  const A = 'fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="miter"';
  const FILL = 'fill="currentColor" stroke="none"';
  const g = (d, extra = "") => "<g " + A + ">" + d + "</g>" + extra;
  const NEW = {
    hexPlus: g('<path d="M12 2.5L20.5 7.25V16.75L12 21.5L3.5 16.75V7.25Z"/><path d="M12 9V15M9 12H15"/>'),
    bars: g('<path d="M3.5 14H8V20H3.5Z"/><path d="M9.75 9H14.25V20H9.75Z"/><path d="M16 4H20.5V20H16Z"/>'),
    sparkle: g('<path d="M12 3L14.2 9.8L21 12L14.2 14.2L12 21L9.8 14.2L3 12L9.8 9.8Z"/>'),
    hexSparkle: g('<path d="M12 2.5L20.5 7.25V16.75L12 21.5L3.5 16.75V7.25Z"/><path d="M12 7.5L13.3 10.7L16.5 12L13.3 13.3L12 16.5L10.7 13.3L7.5 12L10.7 10.7Z"/>'),
    chevrons: g('<path d="M5 12.5L12 5.5L19 12.5"/><path d="M5 19L12 12L19 19"/>'),
    flame: g('<path d="M12 3C12.5 7 18 9 18 14.5A6 6 0 0 1 6 14.5C6 12.5 7 11 8.5 9.5C8.8 11.2 9.6 12 10.5 12C11.2 9 10.6 6 12 3Z"/>'),
    satchel: g('<path d="M4.5 9H19.5V20.5H4.5Z"/><path d="M4.5 9L12 15L19.5 9"/><path d="M8.5 9V6.5A3.5 3.5 0 0 1 15.5 6.5V9"/>'),
    backpack: g('<path d="M6 21V10A6 6 0 0 1 18 10V21Z"/><path d="M9 21V15H15V21"/><path d="M9 10.5H15"/>'),
    chest: g('<path d="M4 10H20V20.5H4Z"/><path d="M4 10A8 6 0 0 1 20 10"/><path d="M10.5 10H13.5V14H10.5Z"/>'),
    slots: g('<path d="M4 4H11V11H4Z"/><path d="M13 4H20V11H13Z"/><path d="M4 13H11V20H4Z"/><path d="M13 13H20V20H13Z"/>'),
    shield: g('<path d="M12 3L20 6V12C20 16.5 16.5 19.5 12 21C7.5 19.5 4 16.5 4 12V6Z"/>'),
    bolt: g('<path d="M13.5 3L5 13.5H11.5L10.5 21L19 10H12.5Z"/>'),
    pips: g('<path d="M3 8H11V16H3Z"/>', "<path " + FILL + ' d="M13 8H21V16H13Z"/>'),
    burst: g('<path d="M12 8L16 12L12 16L8 12Z"/><path d="M12 2.5V5M12 19V21.5M2.5 12H5M19 12H21.5"/><path d="M5.5 5.5L7.2 7.2M16.8 16.8L18.5 18.5M18.5 5.5L16.8 7.2M7.2 16.8L5.5 18.5"/>'),
    swords: g('<path d="M4 3L16 15"/><path d="M14.2 16.8L17.8 13.2"/><path d="M16 15L19.5 18.5"/><path d="M20 3L8 15"/><path d="M9.8 16.8L6.2 13.2"/><path d="M8 15L4.5 18.5"/>'),
    sword: g('<path d="M12 2L14 4.5V15.5H10V4.5Z"/><path d="M6.5 15.5H17.5"/><path d="M12 15.5V21"/>'),
    axe: g('<path d="M12 3V21"/><path d="M12 5.5L4 4V12.5L12 9.5"/><path d="M12 5.5L20 4V12.5L12 9.5"/>'),
    slash: g('<path d="M5 21L10 5"/><path d="M10.5 21L15.5 5"/><path d="M16 21L21 5"/>')
  };
  const TABS = [
    { id: "stats", word: "Stats", holds: "the six ability modifiers, Strength to Charisma", opts: [
      { name: "rows", what: "two stacked bars, as a list of values", ds: "list" },
      { name: "sliders", what: "three sliders, as modifiers you adjust by", ds: "settings" },
      { name: "hex with plus", what: "the sheet's own stat hex, carrying a plus", svg: "hexPlus" },
      { name: "bars", what: "three bars rising, a spread of scores", svg: "bars" }
    ] },
    { id: "advantage", word: "Advantage", holds: "Inspiration and the strong-hit Streak", opts: [
      { name: "sparkle", what: "a quiet four-point sparkle, a lift", svg: "sparkle" },
      { name: "hex sparkle", what: "the Inspiration hex with a sparkle in it", svg: "hexSparkle" },
      { name: "chevrons up", what: "two chevrons rising, a streak climbing", svg: "chevrons" },
      { name: "flame", what: "a flame, a streak that is burning", svg: "flame" }
    ] },
    { id: "pack", word: "Pack", holds: "carried gear, such as a Healing draught or a crowbar", opts: [
      { name: "satchel", what: "a flapped bag with a carrying strap", svg: "satchel" },
      { name: "backpack", what: "a rounded pack with a front pocket", svg: "backpack" },
      { name: "chest", what: "a small chest with a hasp", svg: "chest" },
      { name: "slots", what: "four slots, as the sheet draws the pack's room", svg: "slots" }
    ] },
    { id: "ability", word: "Ability", holds: "the Shield bash and any ability a run grants", opts: [
      { name: "shield", what: "a shield, for the Shield bash", svg: "shield" },
      { name: "bolt", what: "a lightning bolt, a power", svg: "bolt" },
      { name: "uses", what: "two square pips, one spent, as the sheet counts uses", svg: "pips" },
      { name: "burst", what: "a diamond with rays, a charge going off", svg: "burst" }
    ] },
    { id: "fight", word: "Fight", holds: "Defence, Armour and Cleave, the heavy attack", opts: [
      { name: "crossed swords", what: "two swords crossed, a fight", svg: "swords" },
      { name: "sword", what: "one sword, point up", svg: "sword" },
      { name: "axe", what: "a double-headed axe, for the heavy Cleave", svg: "axe" },
      { name: "slashes", what: "three slash marks, a heavy blow", svg: "slash" }
    ] }
  ];
  const Glyph = ({ o }) => o.ds ? /* @__PURE__ */ React$1.createElement(DS.Icon, { name: o.ds, size: 24 }) : /* @__PURE__ */ React$1.createElement("svg", { className: "mcp-ico", viewBox: "0 0 24 24", width: "24", height: "24", style: { width: 24, height: 24 }, "aria-hidden": "true", focusable: "false", dangerouslySetInnerHTML: { __html: NEW[o.svg] } });
  const Tab = ({ word, o, open }) => /* @__PURE__ */ React$1.createElement("span", { className: "cv-tab" + (open ? " is-open" : "") + (o ? "" : " is-bare"), role: "img", "aria-label": word + (open ? ", open" : "") }, o && /* @__PURE__ */ React$1.createElement("span", { className: "cv-ico" }, /* @__PURE__ */ React$1.createElement(Glyph, { o })), /* @__PURE__ */ React$1.createElement("span", { className: "cv-word" }, word));
  const kind = (o) => o.ds ? 'design system icon "' + o.ds + '"' : "new";
  const Option = ({ tab, o, n }) => /* @__PURE__ */ React$1.createElement("figure", { className: "cv-opt" }, /* @__PURE__ */ React$1.createElement("figcaption", null, /* @__PURE__ */ React$1.createElement("b", null, tab.word, " ", n, " · ", o.name), /* @__PURE__ */ React$1.createElement("span", null, o.what, " · ", /* @__PURE__ */ React$1.createElement("em", { className: o.ds ? "is-ds" : "is-new" }, kind(o)))), /* @__PURE__ */ React$1.createElement("div", { className: "cv-pair" }, /* @__PURE__ */ React$1.createElement(Tab, { word: tab.word, o }), /* @__PURE__ */ React$1.createElement(Tab, { word: tab.word, o, open: true })));
  const SetRow = ({ n, label, note }) => /* @__PURE__ */ React$1.createElement("figure", { className: "cv-set" }, /* @__PURE__ */ React$1.createElement("figcaption", null, /* @__PURE__ */ React$1.createElement("b", null, label), note && /* @__PURE__ */ React$1.createElement("span", null, note)), /* @__PURE__ */ React$1.createElement("div", { className: "cv-row" }, TABS.map((t, i) => /* @__PURE__ */ React$1.createElement(Tab, { key: t.id, word: t.word, o: n ? t.opts[n - 1] : null, open: i === 1 }))));
  const VERSIONS = [
    {
      id: "current",
      tab: "0 · Current",
      title: "Current: the word only",
      cap: "Today's five tabs, each closed except Advantage (open, to show the inverted state). Every option that follows adds an icon centred above the word and changes nothing else.",
      body: () => /* @__PURE__ */ React$1.createElement(SetRow, { n: 0, label: "Current · word only" })
    },
    ...TABS.map((t, i) => ({
      id: t.id,
      tab: i + 1 + " · " + t.word,
      title: i + 1 + " · " + t.word + ": four icons",
      cap: t.word + " holds " + t.holds + ". Each option is shown closed, then open.",
      body: () => /* @__PURE__ */ React$1.createElement("div", { className: "cv-opts" }, t.opts.map((o, k) => /* @__PURE__ */ React$1.createElement(Option, { key: k, tab: t, o, n: k + 1 })))
    })),
    {
      id: "sets",
      tab: "6 · Sets",
      title: "The sets: one option across all five tabs",
      cap: "Option 1 on every tab, then option 2, and so on, under today's word-only row. Advantage is drawn open in each row.",
      body: () => /* @__PURE__ */ React$1.createElement("div", { className: "cv-sets" }, /* @__PURE__ */ React$1.createElement(SetRow, { n: 0, label: "Current · word only" }), [1, 2, 3, 4].map((n) => /* @__PURE__ */ React$1.createElement(SetRow, { key: n, n, label: "Set " + n, note: TABS.map((t) => t.opts[n - 1].name).join(" · ") })))
    }
  ];
  const App = () => {
    const read = () => {
      const h = (window.location.hash || "").replace("#", "");
      return VERSIONS.some((v2) => v2.id === h) ? h : "current";
    };
    const [id, setId] = React$1.useState(read);
    React$1.useEffect(() => {
      const f = () => setId(read());
      window.addEventListener("hashchange", f);
      return () => window.removeEventListener("hashchange", f);
    }, []);
    const v = VERSIONS.find((x) => x.id === id);
    return /* @__PURE__ */ React$1.createElement("main", { className: "cv" }, /* @__PURE__ */ React$1.createElement("header", { className: "cv-head" }, /* @__PURE__ */ React$1.createElement("h1", null, "Delve sheet tabs: icon options"), /* @__PURE__ */ React$1.createElement("p", null, "Five tabs (Stats, Advantage, Pack, Ability, Fight), four icon options each, drawn as the real tab. Options marked new are drawn here in the design system's line style; the rest are the design system's own icons.")), /* @__PURE__ */ React$1.createElement("nav", { className: "cv-tabs", role: "tablist", "aria-label": "Tabs" }, VERSIONS.map((x) => /* @__PURE__ */ React$1.createElement("button", { key: x.id, type: "button", role: "tab", "aria-selected": x.id === id, className: x.id === id ? "is-on" : "", onClick: () => {
      window.location.hash = x.id;
      setId(x.id);
    } }, x.tab))), /* @__PURE__ */ React$1.createElement("section", { className: "cv-ver", key: id }, /* @__PURE__ */ React$1.createElement("h2", null, v.title), /* @__PURE__ */ React$1.createElement("p", { className: "cv-cap" }, v.cap), v.body()));
  };
  client.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React$1.createElement(App, null));
})(React, ReactDOM);
