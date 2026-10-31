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
    function Icon2({ name, size = 20, className = "", style, label }) {
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
      else if (doneLabel !== void 0) content = /* @__PURE__ */ React2.createElement("span", { className: "mcp-swap" }, /* @__PURE__ */ React2.createElement("span", { className: "a" }, icon && /* @__PURE__ */ React2.createElement(Icon2, { name: icon }), children), /* @__PURE__ */ React2.createElement("span", { className: "b", "aria-hidden": !done }, /* @__PURE__ */ React2.createElement(Icon2, { name: "check" }), doneLabel));
      else content = /* @__PURE__ */ React2.createElement(React2.Fragment, null, icon && /* @__PURE__ */ React2.createElement(Icon2, { name: icon }), children);
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
        return cbPress(onChoose && !done && (() => onChoose(t, i)), { key: i, className: "mcp-cb-choice" + (p ? " is-picked" : done ? " is-spent" : ""), "aria-pressed": p }, /* @__PURE__ */ React2.createElement(React2.Fragment, null, p && /* @__PURE__ */ React2.createElement(Icon2, { name: "check", size: 14 }), t));
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
        return cbPress(!done && on, { className: "mcp-cb-choice" + (main ? " is-main" : "") + (p ? " is-picked" : done ? " is-spent" : ""), "aria-pressed": p }, /* @__PURE__ */ React2.createElement(React2.Fragment, null, p && /* @__PURE__ */ React2.createElement(Icon2, { name: "check", size: 14 }), text));
      };
      return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-cb mcp-cb-fence mcp-cb-card mcp-cb-confirm " + className).trim(), role: "group", "aria-label": title || "Confirm" }, title && /* @__PURE__ */ React2.createElement("p", { className: "mcp-cb-title" }, title), question && /* @__PURE__ */ React2.createElement("p", { className: "mcp-cb-q" }, cbRich(question)), facts && facts.length > 0 && /* @__PURE__ */ React2.createElement(FactRows, { items: facts, plain: true }), note && /* @__PURE__ */ React2.createElement("p", { className: "mcp-cb-note" }, note), /* @__PURE__ */ React2.createElement("div", { className: "mcp-cb-pair" }, btn("cancel", cancel, onCancel, false), btn("confirm", confirm, onConfirm, true)));
    }
    function EntityCards({ title, items = [], onPick, className = "" }) {
      return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-cb mcp-cb-ents " + className).trim(), role: "group", "aria-label": title || "In the game" }, title && /* @__PURE__ */ React2.createElement("p", { className: "mcp-cb-kind" }, title), /* @__PURE__ */ React2.createElement("ul", { className: "mcp-cb-ents-list" }, items.map((it, i) => {
        const pic = it.pic ? /* @__PURE__ */ React2.createElement("img", { src: it.pic, alt: "" }) : it.icon ? /* @__PURE__ */ React2.createElement(Icon2, { name: it.icon, size: 16 }) : null;
        return /* @__PURE__ */ React2.createElement("li", { key: i }, cbPress(onPick && (() => onPick(it, i)), { className: "mcp-cb-ent" + (it.state ? " is-" + it.state : ""), "aria-pressed": it.state === "picked" }, /* @__PURE__ */ React2.createElement(React2.Fragment, null, pic && /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-ent-pic " + (it.pic ? "is-" + (it.tone || "cream") : "is-icon"), "aria-hidden": "true" }, pic), /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-ent-t" }, /* @__PURE__ */ React2.createElement("b", null, it.name), it.line && /* @__PURE__ */ React2.createElement("small", null, it.line)))));
      })));
    }
    function StatusTag({ tone = "live", label, children, className = "" }) {
      return /* @__PURE__ */ React2.createElement("span", { className: ("mcp-cb mcp-cb-status is-" + tone + " " + className).trim() }, label ?? children);
    }
    const Art = ({ art, icon }) => typeof art === "string" ? art.trim().startsWith("<svg") ? /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-mart", "aria-hidden": "true", dangerouslySetInnerHTML: { __html: art } }) : /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-mart", "aria-hidden": "true" }, /* @__PURE__ */ React2.createElement("img", { src: art, alt: "" })) : /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-mart" + (art ? "" : " is-icon"), "aria-hidden": "true" }, art || icon && /* @__PURE__ */ React2.createElement(Icon2, { name: icon, size: 18 }));
    function MenuRows({ items = [], search, onGo, onSearch, label, className = "" }) {
      return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-cb mcp-cb-fence mcp-cb-menu " + className).trim(), role: "group", "aria-label": label || "Menu" }, search && /* @__PURE__ */ React2.createElement("label", { className: "mcp-cb-search" }, /* @__PURE__ */ React2.createElement(Icon2, { name: "search", size: 16 }), /* @__PURE__ */ React2.createElement("input", { type: "search", placeholder: search, "aria-label": search, readOnly: !onSearch, tabIndex: onSearch ? void 0 : -1, onChange: onSearch ? ((e) => onSearch(e.target.value)) : void 0 })), /* @__PURE__ */ React2.createElement("ul", null, items.map((it, i) => {
        const act = typeof it.action === "string" ? { label: it.action } : it.action;
        const st = typeof it.status === "string" ? { label: it.status, tone: "idle" } : it.status;
        return /* @__PURE__ */ React2.createElement("li", { key: i, className: "mcp-cb-mrow" }, /* @__PURE__ */ React2.createElement(Art, { art: it.art, icon: it.icon }), /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-mtext" }, /* @__PURE__ */ React2.createElement("b", null, it.name), it.line && /* @__PURE__ */ React2.createElement("small", null, it.line), (st || it.meta) && /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-mmeta" }, st && /* @__PURE__ */ React2.createElement(StatusTag, { tone: st.tone || "idle" }, st.label), it.meta && /* @__PURE__ */ React2.createElement("span", null, it.meta))), act && cbPress(onGo && (() => onGo(it, i)), { className: "mcp-cb-go" }, /* @__PURE__ */ React2.createElement(React2.Fragment, null, act.icon && /* @__PURE__ */ React2.createElement(Icon2, { name: act.icon, size: 16 }), /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-go-t" }, act.label))));
      })));
    }
    function NavButtons({ items = [], stack = false, onGo, label, className = "" }) {
      return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-cb mcp-cb-nav" + (stack ? " is-stack" : "") + " " + className).trim(), role: "group", "aria-label": label || "Go to" }, items.map((it, i) => {
        const cls = "mcp-cb-go" + (it.out ? " is-out" : "");
        const body = /* @__PURE__ */ React2.createElement(React2.Fragment, null, it.icon && /* @__PURE__ */ React2.createElement(Icon2, { name: it.icon, size: 16 }), /* @__PURE__ */ React2.createElement("span", { className: "mcp-cb-go-t" }, it.label, it.out && /* @__PURE__ */ React2.createElement("small", null, it.note || "Opens in your browser")), it.out && /* @__PURE__ */ React2.createElement(Icon2, { name: "out", size: 16, className: "mcp-cb-go-out" }));
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
      return /* @__PURE__ */ React2.createElement("p", { className: "mcp-msg mcp-msg-" + kind, role: kind === "error" ? "alert" : "status" }, /* @__PURE__ */ React2.createElement(Icon2, { name: G[kind] }), /* @__PURE__ */ React2.createElement("span", null, children));
    }
    function Tag({ kind = "daily", children, icon, go }) {
      const ic = icon || (kind === "locked" ? "lock" : null);
      const g = go ?? (kind === "locked" || kind === "open");
      return /* @__PURE__ */ React2.createElement("span", { className: "mcp-tag mcp-tag-" + kind + (g ? " has-go" : "") }, ic && /* @__PURE__ */ React2.createElement(Icon2, { name: ic, size: 14 }), children, g && /* @__PURE__ */ React2.createElement(Icon2, { name: "next", size: 14, className: "mcp-tag-go" }));
    }
    function Checkbox({ label, checked, defaultChecked, onChange, className = "", ...rest }) {
      return /* @__PURE__ */ React2.createElement("label", { className: ("mcp-check " + className).trim() }, /* @__PURE__ */ React2.createElement("input", { type: "checkbox", checked, defaultChecked, onChange, ...rest }), /* @__PURE__ */ React2.createElement("span", { className: "mcp-box" }, /* @__PURE__ */ React2.createElement("svg", { viewBox: "0 0 24 24", "aria-hidden": "true" }, /* @__PURE__ */ React2.createElement("g", { fill: "none", stroke: "currentColor", strokeWidth: "2.25", strokeLinecap: "square", strokeLinejoin: "miter" }, /* @__PURE__ */ React2.createElement("path", { d: "M4.5 12.5L9.5 17.5L19.5 6.5" })))), /* @__PURE__ */ React2.createElement("span", null, label));
    }
    function TextField({ label, id, error, hint, type = "text", value, defaultValue, placeholder, onChange, inputRef, autoComplete, className = "", ...rest }) {
      const auto = React2.useId ? React2.useId() : "f";
      const fid = id || "mcp-" + auto;
      const eid = fid + "-err";
      return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-fld " + className).trim() }, label && /* @__PURE__ */ React2.createElement("label", { htmlFor: fid }, label), /* @__PURE__ */ React2.createElement("input", { ref: inputRef, className: "mcp-in" + (error ? " is-bad" : ""), id: fid, type, value, defaultValue, placeholder, onChange, autoComplete, "aria-invalid": error ? true : void 0, "aria-describedby": error ? eid : void 0, ...rest }), error && /* @__PURE__ */ React2.createElement("span", { className: "mcp-fmsg", id: eid }, /* @__PURE__ */ React2.createElement(Icon2, { name: "error" }), error), hint && !error && /* @__PURE__ */ React2.createElement("span", { className: "mcp-hint" }, hint));
    }
    function SearchField({ label, id, placeholder = "Find a game", value, onChange, className = "", ...rest }) {
      const auto = React2.useId ? React2.useId() : "s";
      const fid = id || "mcp-" + auto;
      return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-fld " + className).trim() }, label && /* @__PURE__ */ React2.createElement("label", { htmlFor: fid }, label), /* @__PURE__ */ React2.createElement("div", { className: "mcp-srch" }, /* @__PURE__ */ React2.createElement(Icon2, { name: "search" }), /* @__PURE__ */ React2.createElement("input", { className: "mcp-in", id: fid, type: "search", placeholder, value, onChange, "aria-label": label ? void 0 : placeholder, ...rest })));
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
      return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-chat" + (fill ? " is-fill" : "") + (extraClass ? " " + extraClass : "") + " " + className).trim(), style: fill ? void 0 : { width: "min(100%," + width + "px)" }, role: "group", "aria-label": name }, title && /* @__PURE__ */ React2.createElement("div", { className: "mcp-chat-head" }, title), /* @__PURE__ */ React2.createElement("div", { ref: bodyRef, className: "mcp-chat-body" + (height === "auto" && !fill ? " is-auto" : ""), style: fill || height === "auto" ? void 0 : { height }, tabIndex: 0, role: "region", "aria-label": name + ", scrolls" }, body), /* @__PURE__ */ React2.createElement("button", { type: "button", className: "mcp-chat-up", hidden: !up, onClick: toStart, "aria-label": more }, /* @__PURE__ */ React2.createElement(Icon2, { name: "down", size: 16, style: { transform: "rotate(180deg)" } })), control, comp);
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
        comp: composer && /* @__PURE__ */ React2.createElement("div", { className: "mcp-chat-comp", "aria-hidden": "true" }, /* @__PURE__ */ React2.createElement("span", null, placeholder), /* @__PURE__ */ React2.createElement("i", null, /* @__PURE__ */ React2.createElement(Icon2, { name: "send", size: 16 })))
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
      const ctl = given ? null : /* @__PURE__ */ React2.createElement("button", { type: "button", className: "mcp-chat-pause", onClick: press, "aria-label": playing ? pauseLabel : done ? replayLabel : playLabel }, /* @__PURE__ */ React2.createElement(Icon2, { name: playing ? "pause" : "play", size: 16 }));
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
        comp: composer && /* @__PURE__ */ React2.createElement("div", { className: "mcp-chat-comp", "aria-hidden": "true" }, typed ? /* @__PURE__ */ React2.createElement("span", { className: "mcp-chat-typed" }, typed.text, /* @__PURE__ */ React2.createElement("span", { className: "mcp-chat-caret", style: { opacity: typed.caret ? 1 : 0 } })) : /* @__PURE__ */ React2.createElement("span", null, placeholder), /* @__PURE__ */ React2.createElement("i", { className: sent ? "is-sent" : void 0 }, /* @__PURE__ */ React2.createElement(Icon2, { name: "send", size: 16 })))
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
      const inner = /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement("span", { className: "mcp-card-body" }, title && /* @__PURE__ */ React2.createElement("h3", { className: "mcp-t-card" }, title), children), chevron && /* @__PURE__ */ React2.createElement(Icon2, { name: "next", size: 20, className: "mcp-card-go" }));
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
      return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-crow" + (kind === "chat" ? " is-chat" : kind === "tiles" ? " is-tiles" : "") + " " + className).trim() }, /* @__PURE__ */ React2.createElement("div", { className: "mcp-crow-head" }, /* @__PURE__ */ React2.createElement(T, { className: "mcp-t-sec mcp-crow-title" }, title), at.over && /* @__PURE__ */ React2.createElement("div", { className: "mcp-crow-nav" }, /* @__PURE__ */ React2.createElement("button", { ref: prev, type: "button", className: "mcp-crow-btn", "aria-label": "Previous, " + name, style: at.start ? { visibility: "hidden" } : null, onClick: () => move(-1) }, /* @__PURE__ */ React2.createElement(Icon2, { name: "next", style: { transform: "rotate(180deg)" } })), /* @__PURE__ */ React2.createElement("button", { ref: next, type: "button", className: "mcp-crow-btn", "aria-label": "Next, " + name, style: at.end ? { visibility: "hidden" } : null, onClick: () => move(1) }, /* @__PURE__ */ React2.createElement(Icon2, { name: "next" }))), sub && /* @__PURE__ */ React2.createElement("p", { className: "mcp-crow-sub" }, sub)), /* @__PURE__ */ React2.createElement("div", { ref, className: "mcp-crow-track", role: "region", "aria-label": name, tabIndex: 0, style: { "--n": n } }, children));
    }
    function Disclosure({ title, children, defaultOpen = false }) {
      const [open, setOpen] = React2.useState(defaultOpen);
      const { pressed, handlers } = usePress();
      const id = (React2.useId ? React2.useId() : "d") + "-body";
      return /* @__PURE__ */ React2.createElement("div", { className: "mcp-disc" }, /* @__PURE__ */ React2.createElement("button", { type: "button", className: "mcp-disc-btn" + (pressed ? " is-pressed" : ""), "aria-expanded": open, "aria-controls": id, onClick: () => setOpen((o) => !o), ...handlers }, /* @__PURE__ */ React2.createElement("span", null, title), /* @__PURE__ */ React2.createElement(Icon2, { name: "down" })), /* @__PURE__ */ React2.createElement("div", { className: "mcp-disc-body" + (open ? " is-open" : ""), id }, /* @__PURE__ */ React2.createElement("div", null, typeof children === "string" ? /* @__PURE__ */ React2.createElement("p", null, children) : children)));
    }
    function FormCard({ title, children, className = "", style }) {
      return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-panel " + className).trim(), style }, /* @__PURE__ */ React2.createElement("svg", { className: "mcp-deco", viewBox: "0 0 120 76", "aria-hidden": "true" }, /* @__PURE__ */ React2.createElement("rect", { x: "84", y: "0", width: "36", height: "44", fill: "#328A88" }), /* @__PURE__ */ React2.createElement("rect", { x: "56", y: "0", width: "28", height: "28", fill: "#EDE8DF" }), /* @__PURE__ */ React2.createElement("circle", { cx: "102", cy: "58", r: "12", fill: "#E5A63B" })), /* @__PURE__ */ React2.createElement("div", { className: "mcp-panel-in" }, title && /* @__PURE__ */ React2.createElement("h3", { className: "mcp-t-card" }, title), children));
    }
    function GameCard({ art, pass, onPass, title, mark, blurb, tags, className = "", style }) {
      const m = pass && (onPass ? /* @__PURE__ */ React2.createElement("button", { type: "button", className: "mcp-passmark is-link", onClick: (e) => {
        e.stopPropagation();
        onPass(e);
      } }, /* @__PURE__ */ React2.createElement(Icon2, { name: "lock", size: 14 }), "Pass") : /* @__PURE__ */ React2.createElement("span", { className: "mcp-passmark" }, /* @__PURE__ */ React2.createElement(Icon2, { name: "lock", size: 14 }), "Pass"));
      return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-card mcp-gcard " + className).trim(), style }, /* @__PURE__ */ React2.createElement("div", { className: "mcp-gcard-art" }, art, m), /* @__PURE__ */ React2.createElement("div", { className: "mcp-gcard-text" }, /* @__PURE__ */ React2.createElement("div", { className: "mcp-gcard-name" }, /* @__PURE__ */ React2.createElement("h3", { className: "mcp-t-card" }, title), mark), /* @__PURE__ */ React2.createElement("p", { className: "mcp-gcard-blurb" }, blurb)), /* @__PURE__ */ React2.createElement("div", { className: "mcp-gcard-tags" }, tags));
    }
    function GamePick({ art, pass, onPass, label, title, blurb, tags, className = "", style }) {
      const m = pass && (onPass ? /* @__PURE__ */ React2.createElement("button", { type: "button", className: "mcp-passmark is-link", onClick: (e) => {
        e.stopPropagation();
        onPass(e);
      } }, /* @__PURE__ */ React2.createElement(Icon2, { name: "lock", size: 14 }), "Pass") : /* @__PURE__ */ React2.createElement("span", { className: "mcp-passmark" }, /* @__PURE__ */ React2.createElement(Icon2, { name: "lock", size: 14 }), "Pass"));
      return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-card mcp-gpick " + className).trim(), style }, /* @__PURE__ */ React2.createElement("div", { className: "mcp-gpick-art" }, art, m), /* @__PURE__ */ React2.createElement("div", { className: "mcp-gpick-text" }, /* @__PURE__ */ React2.createElement("span", { className: "mcp-gpick-label" }, label), /* @__PURE__ */ React2.createElement("h3", { className: "mcp-t-card" }, title), /* @__PURE__ */ React2.createElement("p", { className: "mcp-gpick-blurb" }, blurb)), /* @__PURE__ */ React2.createElement("div", { className: "mcp-gpick-tags" }, tags));
    }
    function GameTile({ art, pass, onPass, title, kind, className = "", style }) {
      const m = pass && (onPass ? /* @__PURE__ */ React2.createElement("button", { type: "button", className: "mcp-passmark is-link", onClick: (e) => {
        e.stopPropagation();
        onPass(e);
      } }, /* @__PURE__ */ React2.createElement(Icon2, { name: "lock", size: 14 }), "Pass") : /* @__PURE__ */ React2.createElement("span", { className: "mcp-passmark" }, /* @__PURE__ */ React2.createElement(Icon2, { name: "lock", size: 14 }), "Pass"));
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
      const go = live ? /* @__PURE__ */ React2.createElement(Icon2, { name: "next", size: 20, className: "mcp-row-go" }) : /* @__PURE__ */ React2.createElement("span", { className: "mcp-row-go", "aria-hidden": "true" });
      const leadEl = hasLead && /* @__PURE__ */ React2.createElement("span", { className: "mcp-row-lead", "aria-hidden": "true" }, lead);
      const endEl = end != null && !sub && /* @__PURE__ */ React2.createElement("span", { className: "mcp-row-end" }, end);
      const icon = tone === "ok" ? "check" : tone === "bad" ? "error" : null;
      const gameEl = gameOn && /* @__PURE__ */ React2.createElement("span", { className: "mcp-row-game", ref: gRef }, " · " + game);
      const inner = slots ? /* @__PURE__ */ React2.createElement(React2.Fragment, null, leadEl, !sub && /* @__PURE__ */ React2.createElement("span", { className: "mcp-row-head" }, /* @__PURE__ */ React2.createElement("span", { className: "mcp-row-title", ref: tRef }, tText ? /* @__PURE__ */ React2.createElement("span", { ref: nRef }) : title, gameEl)), result != null && /* @__PURE__ */ React2.createElement("span", { className: "mcp-row-st is-" + tone }, icon && /* @__PURE__ */ React2.createElement(Icon2, { name: icon, size: 16 }), /* @__PURE__ */ React2.createElement("span", { ref: sRef }, rF ? null : result)), when != null && /* @__PURE__ */ React2.createElement("span", { className: "mcp-row-when", ref: wRef }, wF ? null : when), rep && /* @__PURE__ */ React2.createElement("span", { className: "mcp-row-note" }, "Replay"), go) : /* @__PURE__ */ React2.createElement(React2.Fragment, null, leadEl, /* @__PURE__ */ React2.createElement("span", { className: "mcp-row-body" }, /* @__PURE__ */ React2.createElement("span", { className: "mcp-row-title" }, title), meta && /* @__PURE__ */ React2.createElement("span", { className: "mcp-row-meta" }, meta)), endEl, go);
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
      } }, it.icon && /* @__PURE__ */ React2.createElement(Icon2, { name: it.icon }), it.label))));
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
      const played2 = word && record.played ? "played " + count(record.played, word, many) : null;
      const earned = record.earned ? "earned " + count(record.earned, "achievement", "achievements") : null;
      const foot = played2 || earned ? "You " + [played2, earned].filter(Boolean).join(" and ") + "." : null;
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
    ns.Icon = Icon2;
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
  const KIT_ICONS = {
    check: '<polyline points="20 6 9 17 4 12"></polyline>',
    x: '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>',
    "chevron-down": '<polyline points="6 9 12 15 18 9"></polyline>',
    link: '<path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5"></path><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5"></path>',
    settings: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>',
    list: '<line x1="9" y1="6" x2="20" y2="6"></line><line x1="9" y1="12" x2="20" y2="12"></line><line x1="9" y1="18" x2="20" y2="18"></line><circle cx="4.5" cy="6" r="1.2" fill="currentColor" stroke="none"></circle><circle cx="4.5" cy="12" r="1.2" fill="currentColor" stroke="none"></circle><circle cx="4.5" cy="18" r="1.2" fill="currentColor" stroke="none"></circle>'
  };
  const Icon = ({ name, size = 20, color = "currentColor", style = {}, strokeWidth = 1.5 }) => {
    return /* @__PURE__ */ React$1.createElement(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        style: { display: "block", ...style },
        "aria-hidden": "true",
        dangerouslySetInnerHTML: { __html: KIT_ICONS[name] || "" }
      }
    );
  };
  const kitScrollLocks = /* @__PURE__ */ new Map();
  const kitLockScroll = () => {
    const scroller = document.querySelector(".kit-phone-screen") || document.scrollingElement || document.documentElement;
    const held = kitScrollLocks.get(scroller) || { count: 0, prevOverflow: scroller.style.overflow };
    held.count += 1;
    kitScrollLocks.set(scroller, held);
    scroller.style.overflow = "hidden";
    return () => {
      held.count -= 1;
      if (held.count > 0) return;
      scroller.style.overflow = held.prevOverflow;
      kitScrollLocks.delete(scroller);
    };
  };
  const DS = window.MCPGameStoreDesignSystem_ef1abd;
  const GsCtx = React$1.createContext(null);
  const useGs = () => React$1.useContext(GsCtx);
  const GS = {
    today: "Tuesday 6 October",
    link: "https://afterpixels.com/mcp",
    purchase: "Purchases only ever happen on this site; your AI will never ask you to pay.",
    works: "ChatGPT · Claude · Gemini · OpenClaw · any assistant that supports MCP connectors"
  };
  const GS_SVG = (body) => '<svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice">' + body + "</svg>";
  const GS_ART = {
    delve: { ground: "wine", extend: "bottom", svg: GS_SVG('<rect width="160" height="120" fill="#421A28"/><rect x="50" y="40" width="60" height="80" fill="#A390B2"/><circle cx="80" cy="40" r="30" fill="#A390B2"/><rect x="64" y="52" width="32" height="68" fill="#1D1B3A"/><circle cx="80" cy="52" r="16" fill="#1D1B3A"/><rect x="64" y="88" width="32" height="8" fill="#E5A63B"/><rect x="68" y="100" width="24" height="8" fill="#E5A63B"/><rect x="72" y="112" width="16" height="8" fill="#E5A63B"/><rect x="22" y="62" width="6" height="30" fill="#F2EBE0"/><circle cx="25" cy="54" r="8" fill="#D66847"/><rect x="132" y="62" width="6" height="30" fill="#F2EBE0"/><circle cx="135" cy="54" r="8" fill="#D66847"/>') },
    escape: { ground: "indigo", extend: "bottom", svg: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/><rect x="60" y="26" width="44" height="94" fill="#328A88"/><circle cx="94" cy="76" r="5" fill="#E5A63B"/><rect x="22" y="22" width="16" height="16" fill="#F2EBE0"/>') },
    murder: { ground: "wine", extend: "centre", svg: GS_SVG('<rect width="160" height="120" fill="#421A28"/><circle cx="72" cy="60" r="30" fill="none" stroke="#D66847" stroke-width="12"/><rect x="114" y="24" width="10" height="72" fill="#F2EBE0"/><rect x="114" y="24" width="10" height="20" fill="#E5A63B"/>') },
    // Daily Groups: four rows of four, one colour a group, as a solved board.
    groups: { ground: "indigo", extend: "centre", svg: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/>' + ["#E5A63B", "#328A88", "#D66847", "#A390B2"].map((c, r) => [0, 1, 2, 3].map((k) => '<rect x="' + (31 + k * 26) + '" y="' + (11 + r * 26) + '" width="20" height="20" fill="' + c + '"/>').join("")).join("")) },
    word: { ground: "forest", extend: "centre", svg: '<svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice"><rect width="160" height="120" fill="#163328"/><rect x="24" y="44" width="32" height="32" fill="#4CC38A"/><rect x="64" y="44" width="32" height="32" fill="#E5A63B"/><rect class="wd-cover-miss" x="104" y="44" width="32" height="32" fill="#918B80" stroke="#918B80"/></svg>' },
    derelict: { ground: "indigo", extend: "centre", svg: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/><circle cx="100" cy="56" r="32" fill="none" stroke="#A390B2" stroke-width="10"/><rect x="28" y="74" width="20" height="20" fill="#D66847"/><circle cx="40" cy="30" r="4" fill="#F2EBE0"/>') },
    barrow: { ground: "wine", extend: "bottom", svg: GS_SVG('<rect width="160" height="120" fill="#421A28"/><path d="M12 120L52 52L92 120Z" fill="#E5A63B"/><path d="M68 120L108 64L148 120Z" fill="#328A88"/><rect x="100" y="20" width="16" height="16" fill="#F2EBE0"/>') },
    casebook: { ground: "indigo", extend: "bottom", svg: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/><rect x="30" y="40" width="18" height="80" fill="#D66847"/><rect x="62" y="28" width="18" height="92" fill="#A390B2"/><rect x="94" y="46" width="18" height="74" fill="#F2EBE0"/><circle cx="128" cy="26" r="12" fill="#E5A63B"/>') },
    hunter: { ground: "forest", extend: "bottom", svg: GS_SVG('<rect width="160" height="120" fill="#163328"/><circle cx="52" cy="74" r="26" fill="#E5A63B"/><path d="M40 120L100 50L160 120Z" fill="#A390B2"/><rect x="18" y="104" width="14" height="14" fill="#328A88"/><rect x="128" y="20" width="10" height="10" fill="#F2EBE0"/>') }
  };
  const GS_NAME = { casebook: "Casebook", hunter: "36,000 Summers Ago" };
  const GS_GAMES = {
    word: { access: "daily", name: "Daily Word", category: "PUZZLE", art: "word", route: "word", ed: ["word", "words"], edLine: "Five letters. Six guesses.", daily: true, once: true, blurb: "Six guesses to find today’s five-letter word.", tags: ["Daily", "10 min"] },
    groups: { access: "pass", name: "Daily Groups", category: "PUZZLE", art: "groups", route: "groups", ed: ["puzzle", "puzzles"], edLink: "See all groups", edAll: "All groups", edLine: "Sixteen words hide four groups. Find all four.", daily: true, once: true, blurb: "Sixteen words hide four groups. Find all four.", tags: ["Daily", "10 min"] },
    mystery: { access: "daily", name: "Daily Mystery", category: "PUZZLE", art: "murder", route: "mystery", ed: ["case", "cases"], edLine: "One suspect, one weapon, one room. One accusation.", daily: true, once: true, blurb: "There’s a body and a story that doesn’t add up.", tags: ["Daily", "10 min"] },
    escape: { access: "first", name: "Escape", category: "PUZZLE", art: "escape", route: "escape", ed: ["room", "rooms"], blurb: "The door’s locked and you’re on the wrong side of it.", tags: ["Weekly", "About 30 min"] },
    // Casebook is episodic: cases are its editions, with no schedule.
    casebook: { access: "pass", name: GS_NAME.casebook, category: "MYSTERY", art: "casebook", route: "casebook", ed: ["case", "cases"], once: true, blurb: "Ask the question they haven’t prepared for.", tags: ["25–40 min"] },
    delve: { access: "first", name: "Delve", category: "ADVENTURE", art: "delve", route: "delve", ed: ["run", "runs"], blurb: "Get her out before the ritual is complete.", tags: ["Weekly", "25–40 min"] },
    // Chapters are its editions; a free player gets chapter 1. Sample content.
    barrow: { access: "first", name: "The Barrow of Hollowmere", category: "ADVENTURE", art: "barrow", route: "barrow", ed: ["chapter", "chapters"], edLink: "All chapters", edAll: "All chapters", blurb: "Bring the lost bell home from the barrow. Your hero carries on.", tags: ["Several sessions"] },
    hunter: { access: "pass", name: GS_NAME.hunter, category: "LEARNING", art: "hunter", route: "hunter", ed: ["summer", "summers"], blurb: "Grey dawn below Chauvet cave. Go where you like.", tags: ["2 hours"] }
  };
  const gsAccess = (g) => {
    g.free = g.access === "daily";
    g.first = g.access === "first";
    g.tags = [{ daily: "FREE", first: "FIRST", pass: "PASS" }[g.access], ...g.tags.filter((t) => !["FREE", "FIRST", "PASS"].includes(t))];
    return g;
  };
  Object.values(GS_GAMES).forEach(gsAccess);
  const GS_GAME_ORDER = ["word", "groups", "mystery", "escape", "casebook", "delve", "barrow", "hunter"];
  const gsRhythm = (k) => {
    const t = GS_GAMES[k].tags;
    return t.includes("Daily") ? "daily" : t.includes("Weekly") ? "weekly" : null;
  };
  const GS_RHYTHMS = [["daily", "Daily"], ["weekly", "Weekly"]];
  const gsStartsOver = (k) => !!k && !!GS_GAMES[k] && !gsRhythm(k) && !GS_GAMES[k].once;
  const GS_ONCE_LINE = "You’ve played this one. It can’t be played again.";
  const gsGameOfRoute = (route) => GS_GAME_ORDER.find((k) => GS_GAMES[k].route === route) || null;
  const GS_TODAY_PLAYED = {
    out: {},
    free: { word: "word-today", mystery: "mystery-today" },
    pass: { word: "word-today", groups: "groups-today", mystery: "mystery-today", escape: "escape-week" }
  };
  const gsTodayPlayed = (gs) => gsFresh(gs) || gs.view === "free" && gs.review && gs.review.today === "none" ? {} : GS_TODAY_PLAYED[gs.view] || {};
  const gsFresh = (gs) => {
    gs = gs || window.gsApi;
    return !!(gs && gs.user && gs.user.fresh);
  };
  const GS_ENDED_SAMPLE = new Date(2026, 8, 18);
  const gsEndedOn = (gs) => {
    gs = gs || window.gsApi;
    return gs && gs.sub && gs.sub.endedOn ? new Date(gs.sub.endedOn) : GS_ENDED_SAMPLE;
  };
  const gsNorm = (s) => (s || "").toLowerCase().replace(/(\d),(?=\d)/g, "$1").replace(/[’'‘]/g, "").trim();
  const GS_SOON = [
    { name: "Derelict", art: "derelict", line: "The same game, in science fiction" },
    { name: GS_GAMES.barrow.name, art: "barrow", line: GS_GAMES.barrow.blurb, label: "CHAPTER 3", play: "Play chapter 1", route: "barrow" }
  ];
  const gsLink = (gid) => "https://afterpixels.com/" + (["casebook", "escape", "delve", "barrow"].includes(gid) ? "discover/" : "") + GS_GAMES[gid].route;
  const GS_BARROW_CREDIT = "Rules material from the System Reference Document 5.2.1 by Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd, licensed under the Creative Commons Attribution 4.0 International License (https://creativecommons.org/licenses/by/4.0/legalcode).";
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
    const say = (kind, tail) => {
      const n = w.map((ch, i) => marks[i] === kind ? name(ch, i) : null).filter(Boolean);
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
  const GS_MYSTERY_QS = [["Question 1", "Was Delphine Rooke in the study?", "The inspector said yes"], ["Question 2", "Did Arthur Penhallow have the paper knife?", "The inspector said yes"]];
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
      listTitle: "Every roll",
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
    // Daily Word and Daily Mystery tell one story per game on every surface: today's play, its in-progress form and one earlier play.
    "word-today": {
      kind: "puzzle",
      gid: "word",
      game: "Daily Word",
      art: "word",
      number: 212,
      answer: "STILL",
      hints: 1,
      result: "Solved in 3 of 6",
      date: GS.today,
      listTitle: "Every guess",
      share: "Solved in 3 of 6",
      lines: gsWordLines("STILL", ["CRANE", "SLATE", ["Hint", "Letter 2 is T."], "STILL"])
    },
    // Sample plays for the session page (1236). No. 210, the hard play: solved on the fifth guess with the hint; after ROBOT only
    // letter 4 was green, so the hint gave letter 1. No. 208, lost: the SHA_E trap, four letters in place from guess 2 to 6.
    "word-hard": {
      kind: "puzzle",
      gid: "word",
      game: "Daily Word",
      art: "word",
      number: 210,
      answer: "FLOOR",
      hints: 1,
      result: "Solved in 5 of 6",
      date: "Sunday 4 October",
      listTitle: "Every guess",
      share: "Solved in 5 of 6",
      lines: gsWordLines("FLOOR", ["CRANE", "ROBOT", ["Hint", "Letter 1 is F."], "FROGS", "FLOUR", "FLOOR"])
    },
    "word-failed": {
      kind: "puzzle",
      gid: "word",
      game: "Daily Word",
      art: "word",
      number: 208,
      answer: "STEAL",
      loss: true,
      hints: 1,
      result: "Failed",
      date: "Friday 2 October",
      listTitle: "Every guess",
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
      listTitle: "Every move",
      share: "Escaped in 28 min, under par",
      shareLines: ["Escape No. 1 · escaped in 28 min, under par · 1 hint 💡 · 2 wrong tries"],
      lines: GS_ES1_LINES
    },
    "mystery-today": {
      kind: "puzzle",
      gid: "mystery",
      game: "Daily Mystery",
      art: "murder",
      number: 64,
      q: 2,
      hints: 0,
      result: "Failed",
      loss: true,
      date: GS.today,
      setting: "a storm-bound weekend at Hollowmere House",
      victim: "Madame Odette Varga, the medium",
      figures: ["2 questions", "No hints"],
      listTitle: "Every question",
      share: "Failed",
      lines: [...GS_MYSTERY_QS, ["Accusation", "Sebastian Wyle, with the iron poker, in the dining room", "Wrong", "The suspect, the weapon and the room were all wrong"]]
    },
    "word-1005": {
      kind: "puzzle",
      gid: "word",
      game: "Daily Word",
      art: "word",
      number: 211,
      answer: "CHAIN",
      result: "Solved in 4 of 6",
      date: "Monday 5 October",
      listTitle: "Every guess",
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
      listTitle: "Every try",
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
      listTitle: "Every try",
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
      listTitle: "Every turn",
      share: "Solved",
      shareLines: ["Casebook: The Last Night at Gull Point", "✅ solved · 11 of 16 turns · 4 lies exposed"],
      lines: gsCbLines(GS_CB_REC)
    },
    "mystery-1004": {
      kind: "puzzle",
      gid: "mystery",
      game: "Daily Mystery",
      art: "murder",
      number: 62,
      q: 2,
      hints: 0,
      result: "Solved",
      date: "Sunday 4 October",
      setting: "the annual gala of the Royal Botanical Society",
      victim: "Dr Ambrose Kell, the collector",
      figures: ["2 questions", "No hints"],
      listTitle: "Every question",
      share: "Solved",
      lines: [
        ["Question 1", "Was Mr Graves in the study?", "The inspector said yes"],
        ["Question 2", "Did Dr Helena Strand have the curtain cord?", "The inspector said yes"],
        ["Accusation", "Ivy Marchbank, with the vial of foxglove, in the wine cellar", "Right"]
      ]
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
    },
    // Daily Mystery asks at most two questions. Today's culprit is a SAMPLE: the seeded play accused the wrong person.
    "mystery-today-avg": {
      ...GS_SESSIONS["mystery-today"],
      loss: false,
      q: 1,
      result: "Solved",
      share: "Solved",
      figures: ["1 question", "No hints"],
      lines: [GS_MYSTERY_QS[0], ["Accusation", "Delphine Rooke, with the curtain cord, in the conservatory", "Right"]]
    },
    "mystery-today-hard": {
      ...GS_SESSIONS["mystery-today"],
      loss: false,
      result: "Solved",
      share: "Solved",
      lines: [...GS_MYSTERY_QS, ["Accusation", "Delphine Rooke, with the curtain cord, in the conservatory", "Right"]]
    }
  });
  const GS_ED_SIDS = {
    word: { average: "word-today", hard: "word-today-hard", failed: "word-today-failed" },
    groups: { average: "groups-today", hard: "groups-today-hard", failed: "groups-today-failed" },
    mystery: { average: "mystery-today-avg", hard: "mystery-today-hard", failed: "mystery-today" },
    escape: { hard: "escape-hard" },
    delve: { hard: "delve-hard" }
  };
  const gsEdPick = (gid, gs) => {
    gs = gs || window.gsApi;
    const e = gs && gs.review && gs.review.ed;
    return e && GS_ED_SIDS[gid] && GS_ED_SIDS[gid][e] || null;
  };
  Object.assign(GS_SESSIONS, {
    "word-live": {
      kind: "puzzle",
      gid: "word",
      game: "Daily Word",
      art: "word",
      number: 212,
      answer: "STILL",
      live: true,
      result: "In progress",
      date: GS.today,
      listTitle: "Every guess",
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
      listTitle: "Every try",
      share: null,
      lines: [["Try 1", "BASS · PIKE · CARP · SOLE", "One away"], ["Try 2", "PIKE · CARP · SOLE · PERCH", "Found: fish"], ["Try 3", "FROST · MIST · HAIL · SLEET", "Found: weather"]]
    },
    "mystery-live": {
      kind: "puzzle",
      gid: "mystery",
      game: "Daily Mystery",
      art: "murder",
      number: 64,
      q: 2,
      hints: 0,
      live: true,
      result: "In progress",
      date: GS.today,
      figures: ["2 questions", "No hints"],
      listTitle: "Every question",
      share: null,
      lines: GS_MYSTERY_QS.slice()
    },
    "escape-live": {
      kind: "puzzle",
      gid: "escape",
      game: "Escape",
      art: "escape",
      live: true,
      result: "In progress",
      date: GS.today,
      listTitle: "Every move",
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
  GS_SESSIONS["escape-0928"] = GS_SESSIONS["escape-week"];
  const gsLapsed = (gs) => gs.view !== "pass" && !!gs.sub.hadPass;
  const gsSessDate = (s) => s.date;
  const gsScroller = () => document.querySelector(".kit-phone-screen") || document.scrollingElement || document.documentElement;
  const gsScrollTop = () => {
    gsScroller().scrollTop = 0;
  };
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
    // A day that ended without an ending reads as the app's unfinished status.
    hunter: (r) => r.restarted ? "Not finished" : "Finished"
  };
  const GS_ES1_PAR = 30;
  const GS_ES1_CLOSED = { "oak door lock": "The chimney hatch" };
  const GS_ES_PARTS = { "clock hands": 2 };
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
  const gsForms = (s) => {
    let m;
    if (!s) return s;
    if (m = /^(?:Solved|Escaped) in (.+)$/.exec(s)) return [s, m[1]];
    if (m = /^All 4 groups, (.+)$/.exec(s)) return [s, m[1][0].toUpperCase() + m[1].slice(1)];
    if ((m = /^Found in (.+)$/.exec(s)) || (m = /^All 5 wrecks, (.+)$/.exec(s))) return [s, m[1]];
    if (m = /^Solved, (.+)$/.exec(s)) return [s, m[1][0].toUpperCase() + m[1].slice(1)];
    if (/ (is|are) ready$/.test(s)) return [s, "Ready"];
    if (/^Done (today|this week)$/.test(s) || /^(Every|Free) \w+ done$/.test(s)) return [s, "Done"];
    return s;
  };
  const GS_GLYPH_A = 'fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="miter"';
  const GS_GLYPHS = {
    mail: "<g " + GS_GLYPH_A + '><path d="M3 5.5H21V18.5H3Z"/><path d="M3.5 6.5L12 13L20.5 6.5"/></g>',
    logout: "<g " + GS_GLYPH_A + '><path d="M10 4H4V20H10"/><path d="M15 8L19 12L15 16"/><path d="M19 12H9"/></g>',
    card: "<g " + GS_GLYPH_A + '><path d="M2.5 5.5H21.5V18.5H2.5Z"/><path d="M2.5 10H21.5"/><path d="M6 15H10"/></g>',
    pass: "<g " + GS_GLYPH_A + '><path d="M3 6.5H21V10H19V14H21V17.5H3V14H5V10H3Z"/><path d="M9.5 6.5V8M9.5 11V13M9.5 16V17.5"/></g>',
    account: "<g " + GS_GLYPH_A + '><path d="M8 4H16V12H8Z"/><path d="M4 20.5V16H20V20.5"/></g>',
    x: '<g fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="square"><path d="M6 6L18 18M18 6L6 18"/></g>',
    arrow: "<g " + GS_GLYPH_A + '><path d="M4 12H19"/><path d="M13 6L19 12L13 18"/></g>',
    apple: '<path fill="currentColor" d="M16.37 12.62c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.74-.78-2.87-.76-1.47.02-2.83.86-3.59 2.18-1.54 2.66-.39 6.6 1.1 8.76.73 1.06 1.6 2.24 2.73 2.2 1.1-.05 1.51-.71 2.84-.71 1.32 0 1.7.71 2.86.69 1.18-.02 1.93-1.07 2.65-2.13.84-1.23 1.18-2.42 1.2-2.48-.03-.01-2.29-.88-2.31-3.5zM14.2 6.16c.6-.73 1.01-1.75.9-2.76-.87.04-1.92.58-2.54 1.31-.56.64-1.05 1.67-.92 2.66.97.07 1.96-.49 2.56-1.21z"/>',
    google: '<g transform="scale(.5)"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></g>'
  };
  const GsGlyph = ({ name, size = 20, style }) => /* @__PURE__ */ React$1.createElement("svg", { className: "mcp-ico", viewBox: "0 0 24 24", width: size, height: size, style: { width: size, height: size, ...style }, "aria-hidden": "true", focusable: "false", dangerouslySetInnerHTML: { __html: GS_GLYPHS[name] } });
  const GsMark = ({ size = 32 }) => /* @__PURE__ */ React$1.createElement("span", { className: "gs-brand-mark", "aria-hidden": "true", style: { width: size, height: size } }, /* @__PURE__ */ React$1.createElement("span", { className: "mcp-loader-m", style: { transform: `scale(${size / 120})`, transformOrigin: "0 0" } }, /* @__PURE__ */ React$1.createElement("i", { className: "tl" }), /* @__PURE__ */ React$1.createElement("i", { className: "tr" }), /* @__PURE__ */ React$1.createElement("i", { className: "br" }), /* @__PURE__ */ React$1.createElement("i", { className: "bl" })));
  const GsStaticBrand = () => /* @__PURE__ */ React$1.createElement("span", { className: "gs-brand", style: { cursor: "default", pointerEvents: "none" } }, /* @__PURE__ */ React$1.createElement(GsMark, null), /* @__PURE__ */ React$1.createElement("span", null, "After Pixels"));
  const GsWordmark = () => {
    const gs = useGs();
    return /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "gs-brand", "aria-label": "After Pixels, home", onClick: () => gs.go("home") }, /* @__PURE__ */ React$1.createElement(GsMark, null), /* @__PURE__ */ React$1.createElement("span", null, "After Pixels"));
  };
  const GS_LOADER = { withhold: 300 };
  const GS_WORK_MS = 900;
  const useGsBusy = (ms = GS_WORK_MS) => {
    const [busy, setBusy] = React$1.useState(false);
    const live = React$1.useRef(true);
    const held = React$1.useRef(false);
    const t = React$1.useRef(null);
    React$1.useEffect(() => {
      live.current = true;
      return () => {
        live.current = false;
        clearTimeout(t.current);
      };
    }, []);
    const run = (fn) => {
      if (held.current) return;
      held.current = true;
      setBusy(true);
      t.current = setTimeout(() => {
        held.current = false;
        if (!live.current) return;
        setBusy(false);
        fn();
      }, ms);
    };
    const cancel = () => {
      clearTimeout(t.current);
      held.current = false;
      setBusy(false);
    };
    return [busy, run, cancel];
  };
  const GsInkSpin = () => /* @__PURE__ */ React$1.createElement("span", { className: "mcp-spin gs-spin-ink", "aria-hidden": "true" });
  const GsSpin = ({ label = "Loading" }) => {
    const [shown, setShown] = React$1.useState(false);
    React$1.useEffect(() => {
      const t = setTimeout(() => setShown(true), GS_LOADER.withhold);
      return () => clearTimeout(t);
    }, []);
    return /* @__PURE__ */ React$1.createElement("div", { className: "gs-spin-slot", role: "status", "aria-label": label }, shown && /* @__PURE__ */ React$1.createElement(DS.Loader, { size: 100, label }));
  };
  const GsFullLoader = ({ label, ms, onDone }) => {
    React$1.useEffect(() => {
      if (!ms || !onDone) return void 0;
      const t = setTimeout(onDone, ms);
      return () => clearTimeout(t);
    }, []);
    return /* @__PURE__ */ React$1.createElement("main", { className: "gs-full" }, /* @__PURE__ */ React$1.createElement(GsSpin, { label }));
  };
  const GS_LOAD_MS = /[?&]fast(?:[=&]|$)/.test(window.location.search) ? 0 : 1200;
  const useGsPart = (deps) => {
    const gs = useGs();
    const [on, setOn] = React$1.useState(false);
    const first = React$1.useRef(true);
    React$1.useEffect(() => {
      if (first.current) {
        first.current = false;
        return void 0;
      }
      setOn(true);
      const t = setTimeout(() => setOn(false), GS_LOAD_MS);
      return () => clearTimeout(t);
    }, deps);
    return on || gs.route.hold === "part";
  };
  const GsPart = ({ label }) => /* @__PURE__ */ React$1.createElement("div", { className: "gs-inplace", "aria-busy": "true" }, /* @__PURE__ */ React$1.createElement(GsSpin, { label }));
  const GsLoadFailed = ({ full, onRetry }) => {
    const [busy, run] = useGsBusy(GS_LOAD_MS);
    return /* @__PURE__ */ React$1.createElement("div", { className: full ? "gs-full" : "gs-inplace" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-failed" }, /* @__PURE__ */ React$1.createElement("p", { className: "gs-strong" }, "This didn’t load."), !full && /* @__PURE__ */ React$1.createElement("p", { className: "gs-muted" }, "Something went wrong fetching the games."), /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "secondary", loading: busy, onClick: () => run(onRetry) }, "Try again")));
  };
  const GsOffline = () => {
    const gs = useGs();
    return /* @__PURE__ */ React$1.createElement(GsLoadFailed, { full: true, onRetry: () => gs.go("games") });
  };
  const GS_SUPPORT = "support@afterpixels.com";
  const GS_HELLO = "hello@afterpixels.com";
  const GS_LEGAL_LINKS = [["privacy", "Privacy"], ["terms", "Terms"], ["refunds", "Refunds"]];
  const GsFooter = () => {
    const gs = useGs();
    const legal = (doc) => gs.go("legal", { doc });
    const mail = /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "gs-ft-link", onClick: () => legal("contact") }, "Get in touch");
    return /* @__PURE__ */ React$1.createElement("footer", { className: "gs-ft" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-wrap" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-ft-wide" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-ft-brand" }, /* @__PURE__ */ React$1.createElement(GsStaticBrand, null), /* @__PURE__ */ React$1.createElement("div", { className: "gs-ft-legalese" }, /* @__PURE__ */ React$1.createElement("p", { className: "gs-ft-copy" }, "© 2026 Harness Intent Ltd"), /* @__PURE__ */ React$1.createElement("p", { className: "gs-ft-reg" }, "Registered in England and Wales, No. 17277971"))), /* @__PURE__ */ React$1.createElement("div", { className: "gs-ft-col" }, /* @__PURE__ */ React$1.createElement("h2", { className: "gs-ft-h" }, "contact"), mail), /* @__PURE__ */ React$1.createElement("div", { className: "gs-ft-col" }, /* @__PURE__ */ React$1.createElement("h2", { className: "gs-ft-h" }, "legal"), GS_LEGAL_LINKS.map(([d, l]) => /* @__PURE__ */ React$1.createElement("button", { key: d, type: "button", className: "gs-ft-link", onClick: () => legal(d) }, l)))), /* @__PURE__ */ React$1.createElement("div", { className: "gs-ft-narrow" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-ft-top" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-ft-mark" }, /* @__PURE__ */ React$1.createElement(GsStaticBrand, null)), mail), /* @__PURE__ */ React$1.createElement("div", { className: "gs-ft-bottom" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-ft-run" }, GS_LEGAL_LINKS.map(([d, l], i) => /* @__PURE__ */ React$1.createElement(React$1.Fragment, { key: d }, i > 0 && /* @__PURE__ */ React$1.createElement("span", { className: "gs-ft-dot", "aria-hidden": "true" }, "·"), /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "gs-ft-link", onClick: () => legal(d) }, l)))), /* @__PURE__ */ React$1.createElement("div", { className: "gs-ft-legalese" }, /* @__PURE__ */ React$1.createElement("p", { className: "gs-ft-copy" }, "© 2026 Harness Intent Ltd"), /* @__PURE__ */ React$1.createElement("p", { className: "gs-ft-reg" }, "Registered in England and Wales, No. 17277971"))))));
  };
  const GS_LEGAL = {
    terms: { title: "Terms and Conditions", sections: ["Who we are", "What After Pixels is", "Your account", "Payments", "When the Pass ends", "Support", "Your content", "Ending things", "Our liability", "Changes to these terms", "Governing law"] },
    privacy: { title: "Privacy", opening: "This page isn’t written yet.", sections: ["On the website", ["In the app", ["Your account", "Your play history", "Payments", "App analytics", "Server logs"]], "Where your data lives", "Cookies and storage", "Children", "Keeping and deleting your data", "Contact", "Updates"] },
    refunds: { title: "Refund Policy", sections: ["The short version", "How refunds work", "Your legal rights", "Complaints"] }
  };
  const GS_UNWRITTEN = "This section isn’t written yet.";
  const GsContact = () => /* @__PURE__ */ React$1.createElement("main", { className: "gs-wrap gs-legal" }, /* @__PURE__ */ React$1.createElement("article", { className: "gs-legal-col" }, /* @__PURE__ */ React$1.createElement("header", { className: "gs-stack-sm" }, /* @__PURE__ */ React$1.createElement("h1", { className: "gs-legal-h1" }, "Get in touch")), /* @__PURE__ */ React$1.createElement("section", { className: "gs-legal-sec" }, /* @__PURE__ */ React$1.createElement("h2", { className: "gs-legal-h2" }, "Get help"), /* @__PURE__ */ React$1.createElement("p", null, "Email support about anything to do with a game, your account or the Pass. Say where you got stuck."), /* @__PURE__ */ React$1.createElement("p", null, /* @__PURE__ */ React$1.createElement("a", { href: "mailto:" + GS_SUPPORT }, GS_SUPPORT))), /* @__PURE__ */ React$1.createElement("section", { className: "gs-legal-sec" }, /* @__PURE__ */ React$1.createElement("h2", { className: "gs-legal-h2" }, "Talk to the team"), /* @__PURE__ */ React$1.createElement("p", null, "If you’d like to contribute, or have anything else in mind, email the team."), /* @__PURE__ */ React$1.createElement("p", null, /* @__PURE__ */ React$1.createElement("a", { href: "mailto:" + GS_HELLO }, GS_HELLO))), /* @__PURE__ */ React$1.createElement("p", { className: "gs-legal-foot" }, "After Pixels is made by ", /* @__PURE__ */ React$1.createElement("a", { href: "https://www.harnessintent.com/", target: "_blank", rel: "noopener" }, "Harness Intent"), ".")));
  const GsLegal = () => {
    const gs = useGs();
    if (gs.route.doc === "contact") return /* @__PURE__ */ React$1.createElement(GsContact, null);
    const doc = GS_LEGAL[gs.route.doc] || GS_LEGAL.terms;
    return /* @__PURE__ */ React$1.createElement("main", { className: "gs-wrap gs-legal" }, /* @__PURE__ */ React$1.createElement("article", { className: "gs-legal-col" }, /* @__PURE__ */ React$1.createElement("header", { className: "gs-stack-sm" }, /* @__PURE__ */ React$1.createElement("h1", { className: "gs-legal-h1" }, doc.title), /* @__PURE__ */ React$1.createElement("p", { className: "gs-legal-rev" }, "Last revised · [date]")), doc.opening && /* @__PURE__ */ React$1.createElement("p", null, doc.opening), doc.sections.map((s) => Array.isArray(s) ? /* @__PURE__ */ React$1.createElement("section", { key: s[0], className: "gs-legal-sec" }, /* @__PURE__ */ React$1.createElement("h2", { className: "gs-legal-h2" }, s[0]), s[1].map((h) => /* @__PURE__ */ React$1.createElement("div", { key: h, className: "gs-legal-sub" }, /* @__PURE__ */ React$1.createElement("h3", { className: "gs-legal-h3" }, h), /* @__PURE__ */ React$1.createElement("p", null, GS_UNWRITTEN)))) : /* @__PURE__ */ React$1.createElement("section", { key: s, className: "gs-legal-sec" }, /* @__PURE__ */ React$1.createElement("h2", { className: "gs-legal-h2" }, s), /* @__PURE__ */ React$1.createElement("p", null, GS_UNWRITTEN)))));
  };
  const gsAnnounce = (msg) => {
    const el = document.getElementById("gs-announce");
    if (!el) return;
    el.textContent = "";
    setTimeout(() => {
      el.textContent = msg;
    }, 60);
  };
  (() => {
    if (window.__gsTrap) return;
    window.__gsTrap = true;
    const SEL = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const top = () => {
      const l = document.querySelectorAll(".mcp-layer.is-open > .mcp-pop");
      return l.length ? l[l.length - 1] : null;
    };
    const items = (p) => Array.from(p.querySelectorAll(SEL)).filter((el) => el.getClientRects().length > 0);
    const aid = (el) => !!(el && el.closest && el.closest('[class^="kit-"],[class*=" kit-"]'));
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const p = top();
      if (!p || aid(document.activeElement)) return;
      const l = items(p);
      if (!l.length) {
        e.preventDefault();
        return;
      }
      const i = l.indexOf(document.activeElement);
      if (i === -1) {
        e.preventDefault();
        (e.shiftKey ? l[l.length - 1] : l[0]).focus();
      } else if (e.shiftKey && i === 0) {
        e.preventDefault();
        l[l.length - 1].focus();
      } else if (!e.shiftKey && i === l.length - 1) {
        e.preventDefault();
        l[0].focus();
      }
    }, true);
    document.addEventListener("focusin", (e) => {
      const p = top();
      if (!p || p.contains(e.target) || aid(e.target)) return;
      const l = items(p);
      if (l.length) l[0].focus({ preventScroll: true });
    });
  })();
  const GsNotFound = () => {
    const gs = useGs();
    return /* @__PURE__ */ React$1.createElement("main", { className: "gs-nf" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-nf-mark" }, /* @__PURE__ */ React$1.createElement(GsWordmark, null)), /* @__PURE__ */ React$1.createElement("div", { className: "gs-nf-col" }, /* @__PURE__ */ React$1.createElement("h1", { className: "gs-h1" }, "Page not found."), /* @__PURE__ */ React$1.createElement("p", { className: "gs-muted" }, "Either this address doesn’t exist, or it isn’t available to you."), /* @__PURE__ */ React$1.createElement(DS.Button, { onClick: () => gs.go("home") }, "Go home")));
  };
  const GS_CHAT_BY = "After Pixels";
  const GS_CHAT_MARK = "assets/logo.svg";
  const gscU = (text) => ({ from: "user", text });
  const gscAi = (tool, text, blocks, after) => ({ from: "ai", tool, text, blocks, after });
  const GSC_WIN = [{ label: "Share result", icon: "share" }, { label: "Back to the games", icon: "list" }];
  const GSC_CB_SEARCH = [
    gscU("Ask Maeve Doyle where she was at ten."),
    gscAi("casebook", "“In the bar, all evening. Ask anyone.” Maeve doesn’t look up from her glass."),
    gscU("Search the bar."),
    gscAi("casebook", "The last drink on Maeve’s tab was poured at 9.40.", [{ type: "clues", groups: [{ kind: "Evidence", facts: [{ text: "The bar ledger", new: true }] }] }, { type: "stats", items: [{ label: "Turn", value: "4 of 16" }] }])
  ];
  const GSC_CB_LIE = [
    gscU("Show Maeve the bar ledger."),
    gscAi("casebook", "“Fine. I stepped out at quarter to ten. I went to the cliff stair, but he was already gone.”", [{ type: "clues", groups: [{ kind: "Evidence", facts: ["The bar ledger"] }, { kind: "Statements", facts: [{ text: "Maeve Doyle: lie exposed", new: true }] }] }, { type: "stats", items: [{ label: "Turn", value: "5 of 16" }] }])
  ];
  let GS_CHATS;
  let GS_HERO_CHAT;
  const GsChatPic = ({ turns, height, width, label }) => /* @__PURE__ */ React$1.createElement(DS.ChatPicture, { turns, mark: GS_CHAT_MARK, toolBy: GS_CHAT_BY, height, width, label });
  const GsChatRow = ({ id }) => {
    const name = GS_GAMES[id].name;
    return /* @__PURE__ */ React$1.createElement(DS.CardRow, { kind: "chat", title: "In your chat" }, (GS_CHATS[id] || []).map((x, i) => /* @__PURE__ */ React$1.createElement("figure", { key: i, className: "mcp-chatfig" }, /* @__PURE__ */ React$1.createElement(GsChatPic, { turns: x.turns, label: name + " being played in a chat" }), /* @__PURE__ */ React$1.createElement("figcaption", null, x.cap))));
  };
  function initGsChats() {
    GS_CHATS = {
      word: [
        { cap: "Say you want to play. Everyone gets the same word today.", turns: [
          gscU("I want to play Daily Word."),
          gscAi("daily-word", ["Daily Word No. 212 is ready. You have six tries to find the hidden five-letter word.", "What’s your first guess?"])
        ] },
        { cap: "Green: right place. Amber: in the word, wrong place. Grey: not in it.", turns: [
          gscU("crane"),
          gscAi("daily-word", "No letters in the word. 5 guesses left."),
          gscU("slate"),
          gscAi("daily-word", "S is in place. L and T are in the word. 4 guesses left.", [{ type: "tilegrid", length: 5, count: 6, rows: [{ letters: "CRANE", marks: "xxxxx" }, { letters: "SLATE", marks: "hnxnx" }] }])
        ] },
        { cap: "Ask for a hint and the engine gives one. Two a day.", turns: [
          gscU("Give me a hint."),
          gscAi("daily-word", "The word contains the letter I. One hint left today.")
        ] }
      ],
      groups: [
        { cap: "Sixteen words hide four groups of four.", turns: [
          gscU("I want to play Daily Groups."),
          gscAi("daily-groups", "Find four groups of four. You can make four mistakes.", [{ type: "wordboard", words: ["BASS", "PIKE", "FROST", "RAIL", "CARP", "CHORD", "MIST", "GATE", "SOLE", "SCALE", "HAIL", "POST", "PERCH", "NOTE", "SLEET", "PANEL"] }])
        ] },
        { cap: "Each set of four goes to the engine, which checks it and counts your mistakes.", turns: [
          gscU("Bass, pike, carp, sole."),
          gscAi("daily-groups", "One away. 3 mistakes left."),
          gscU("Pike, carp, sole, perch."),
          gscAi("daily-groups", "Three groups to go.", [{ type: "wordboard", solved: [{ label: "Fish", words: ["PIKE", "CARP", "SOLE", "PERCH"] }], words: ["BASS", "FROST", "RAIL", "CHORD", "MIST", "GATE", "SCALE", "HAIL", "POST", "NOTE", "SLEET", "PANEL"] }])
        ] },
        { cap: "Afterwards, your AI explains the groups.", turns: [
          gscU("Rail, gate, post, panel."),
          gscAi("daily-groups", ["All four groups, one mistake.", "BASS was the trap: a fish, and a note."], [{ type: "wordboard", solved: [{ label: "Fish", words: ["PIKE", "CARP", "SOLE", "PERCH"] }, { label: "Weather", words: ["FROST", "MIST", "HAIL", "SLEET"] }, { label: "Music", words: ["BASS", "CHORD", "SCALE", "NOTE"] }, { label: "Parts of a fence", words: ["RAIL", "GATE", "POST", "PANEL"] }], words: [] }])
        ] }
      ],
      mystery: [
        { cap: "A body, four suspects and an inspector who answers yes or no.", turns: [
          gscU("I want to play Daily Mystery."),
          gscAi("mystery", ["Daily Mystery No. 64. A storm-bound weekend at Hollowmere House. Madame Odette Varga, the medium, is dead.", "The body was found in the dining room. Read the clues, ask the inspector, then make one accusation."])
        ] },
        { cap: "Two questions a day: was a suspect in a room, or did they have a weapon?", turns: [
          gscU("Was Delphine Rooke in the study?"),
          gscAi("mystery", "The inspector says yes. One question left today."),
          gscU("Did Arthur Penhallow have the paper knife?"),
          gscAi("mystery", "Yes. That was your last question.")
        ] },
        { cap: "One accusation, checked by the engine.", turns: [
          gscU("It was Sebastian Wyle, with the iron poker, in the dining room."),
          gscAi("mystery", null, [{ type: "confirm", title: "Confirm your accusation", question: "Accuse **Sebastian Wyle** of the murder, with the **iron poker**, in the **dining room**?", facts: [{ label: "Suspect", value: "Sebastian Wyle" }, { label: "Weapon", value: "Iron poker" }, { label: "Room", value: "Dining room" }], note: "This is the one accusation today.", confirm: "Confirm accusation", cancel: "Cancel" }])
        ] }
      ],
      // Escape No. 1 as played in the staged record (gs-data.jsx GS_ES1). No answer is ever printed.
      escape: [
        { cap: "The door locks behind you. Look around.", turns: [
          gscU("I want to play Escape."),
          gscAi("escape", ["Escape No. 1, The Clockmaker’s Study. Ezra Vale, the clockmaker, has not been seen for a week. You let yourself into his study to look for him, and the door locks behind you.", "What do you examine first?"])
        ] },
        { cap: "Every lock has three hints. A hint never costs a try.", turns: [
          gscU("Examine the workbench."),
          gscAi("escape", GS_ES1.bench),
          gscU("Give me a hint for the drawer."),
          gscAi("escape", "Count the gears’ teeth, and read each count as a letter.", [{ type: "facts", items: [{ label: "Lock", value: "The workbench drawer" }, { label: "Hint", value: "1 of 3" }] }])
        ] },
        { cap: "Out, with your time against par.", turns: [
          gscU("I try my answer on the oak door lock."),
          gscAi("escape", "The lock gives and the oak door swings open. Escaped in 28 min, under par, with 1 hint and 2 wrong tries.", null, [{ type: "result", title: "The Clockmaker’s Study", status: "Escaped", stats: [{ label: "Time", value: "28 min, under par" }, { label: "Hints", value: 1 }, { label: "Wrong tries", value: 2 }], actions: GSC_WIN }])
        ] }
      ],
      casebook: [
        { cap: "Three guests were still up. Sixteen turns to find out why.", turns: [
          gscU("I want to play Casebook."),
          gscAi("casebook", ["The Last Night at Gull Point. The hotel’s owner was found at the foot of the cliff stair at midnight. Three guests were still up.", "You have sixteen turns. Where do you start?"])
        ] },
        { cap: "Every statement is kept word for word, so any story can be checked.", turns: GSC_CB_SEARCH },
        { cap: "The evidence breaks her story.", turns: GSC_CB_LIE }
      ],
      // Delve: the deployed product page's chats. Each block is the design system's mono block, one line per row.
      delve: [
        { cap: "The run opens: the first room, its ways on, and the numbers.", turns: [
          gscU("Delve, as Bryn the Fighter."),
          gscAi("delve", "Knee-deep water, a chant far off. Crawl upstream, or search the niche first?", [{ type: "mono", text: "The flooded tunnel\nWays on    Upstream crawl\nThe ritual 0/12 (low)\nBryn       13/13 hit points" }])
        ] },
        { cap: "A weak hit: the sentries give ground, at a cost the game draws.", turns: [
          gscU("I charge the sentries, sword first."),
          gscAi("delve", "One sentry tumbles, but his friend squeals for help. The ritual is at 2 of 12.", [{ type: "mono", text: "d20 10+3 = 13 vs DC 12\nWeak hit\nGoblin sentries: 4 → 3\nCost: an alarm · ritual +1" }])
        ] },
        { cap: "The ending, with a link back to your full session.", turns: [
          gscU("I hurl the lamp oil into his brazier."),
          gscAi("delve", "Grizzletooth flees, and you lead Elsie out into the moonlight. Every roll is on your session page.", [{ type: "mono", text: "Grizzletooth: defeated\nBryn the Fighter\n✅ Elsie rescued · 13 rolls" }])
        ] }
      ],
      barrow: [
        { cap: "Choose a hero. The engine sets the world.", turns: [
          gscU("I want to play The Barrow of Hollowmere."),
          gscAi("hollowmere", ["Mist lies on the marsh, and the village of Hollowmere has lost its bell to the barrow. Elder Maud is asking for help.", "Will you go as a fighter, a rogue or a wizard?"])
        ] },
        { cap: "Every attack is a roll the engine makes, and the dice are the truth.", turns: [
          gscU("I attack the skeleton with my longsword."),
          gscAi("hollowmere", "Your blade bites through old bone. The barrow skeleton falls apart on the stone.", [{ type: "mono", text: "Attack  d20 14 + 5 = 19 vs 13\nHit, 8 damage" }])
        ] },
        { cap: "Stop when you like. Your hero carries on to the next chapter.", turns: [
          gscU("I ring the bell in the chapel tower."),
          gscAi("hollowmere", "The Bell of Hollowmere is home. The mist draws back from the marsh. Your hero is ready for the next chapter.", [{ type: "mono", text: "Quest complete\n+100 XP" }])
        ] }
      ],
      hunter: [
        { cap: "Grey dawn. The band sets out without waiting.", turns: [
          gscU("I want to play 36,000 Summers Ago."),
          gscAi("summers", ["Grey dawn. The fire is ash and the band is already moving. Hunters head for the cliffs; gatherers set out for the plateau.", "What do you do?"])
        ] },
        { cap: "The engine rolls the dice and keeps the time.", turns: [
          gscU("I follow the gatherers up to the plateau."),
          gscAi("summers", "Ren shows you where wild onions grow under the scree. By midday your bag is heavy.", [{ type: "roll", label: "Foraging", roll: 14, mod: 2, target: 12, result: "hit" }])
        ] },
        { cap: "At the fire you hear what you missed.", turns: [
          gscU("I head back to the fire at dusk."),
          gscAi("summers", ["The hunters are back with one ibex and a story: the young ones lost the herd at the river.", "You weren’t at the river. Next time, you might be."])
        ] }
      ]
    };
    GS_HERO_CHAT = GS_CHATS.casebook.flatMap((c) => c.turns);
  }
  const GS_TAKEN = "That username is taken";
  const gsUsernameRules = (current) => {
    const t = (v) => v.trim();
    return [
      ["name", (v) => t(v).length >= 3 && t(v).length <= 16, "Use 3 to 16 characters."],
      ["name", (v) => /^[A-Za-z0-9_]*$/.test(t(v)), "Use letters, numbers and underscores only."],
      ["name", (v) => /^[A-Za-z]/.test(t(v)), "Start with a letter."],
      ["name", (v) => t(v) === current || t(v).toLowerCase() !== "taken", GS_TAKEN],
      // The current name, unchanged, answered as the email card answers its own case.
      ...current ? [["name", (v) => t(v) !== current, "That’s already your username. Enter a different one."]] : []
    ];
  };
  const gsUsernameNext = (u) => lbDate(gsAddDays(new Date(u.since || GS_DAY0.getTime()), 30));
  const GS_USERNAME_HINT = "Use 3 to 16 letters, numbers or underscores, starting with a letter. You can change it once every 30 days.";
  const GsUsernameField = ({ form, aside, autoFocus, label = "Username", placeholder, hint }) => {
    const b = form.bind("name");
    return aside ? /* @__PURE__ */ React$1.createElement(GsLabelled, { label, aside }, /* @__PURE__ */ React$1.createElement(DS.TextField, { "aria-label": label, placeholder, hint, autoComplete: "username", autoCapitalize: "none", spellCheck: false, autoFocus, ...b })) : /* @__PURE__ */ React$1.createElement(DS.TextField, { label, placeholder, hint, autoComplete: "username", autoCapitalize: "none", spellCheck: false, autoFocus, ...b });
  };
  const GsUsername = () => {
    const gs = useGs();
    const { next, provider, preset } = gs.route;
    const form = useGsForm({ name: preset === "taken" ? "taken" : "" }, gsUsernameRules(null), (f) => gs.accountMade(f.name.trim(), provider || "google", next), { tried: preset === "taken" });
    return /* @__PURE__ */ React$1.createElement(GsAuthFrame, { title: "Your username", onBack: () => gs.go("signup", { next }) }, /* @__PURE__ */ React$1.createElement("form", { noValidate: true, onSubmit: form.submit, className: "gs-stack-md" }, /* @__PURE__ */ React$1.createElement(GsUsernameField, { form, autoFocus: true, hint: GS_USERNAME_HINT }), /* @__PURE__ */ React$1.createElement(DS.Button, { type: "submit", block: true, loading: form.busy }, "Continue")));
  };
  const GsUsernameForm = ({ current }) => {
    const gs = useGs();
    const form = useGsForm({ name: "" }, gsUsernameRules(current), (f) => {
      const n = f.name.trim();
      if (n !== current) gs.setUser({ username: n, locked: true, since: GS_DAY0.getTime() });
    });
    return /* @__PURE__ */ React$1.createElement("form", { noValidate: true, onSubmit: form.submit, className: "gs-stack-md" }, /* @__PURE__ */ React$1.createElement(GsUsernameField, { form, label: "New username", placeholder: "Enter a new username" }), /* @__PURE__ */ React$1.createElement("div", { className: "gs-card-acts" }, /* @__PURE__ */ React$1.createElement(DS.Button, { type: "submit", loading: form.busy }, "Update username")));
  };
  const GsUsernameCard = () => {
    const gs = useGs();
    const u = gs.user;
    return /* @__PURE__ */ React$1.createElement(DS.Card, { style: { gap: 16, justifyItems: "stretch", alignContent: "start" } }, /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-card" }, "Username"), /* @__PURE__ */ React$1.createElement("p", null, /* @__PURE__ */ React$1.createElement("b", null, u.username), " is your username.", u.locked ? "" : " You can change it once every 30 days."), u.locked ? /* @__PURE__ */ React$1.createElement("p", { className: "gs-muted" }, "You can change it again on " + gsUsernameNext(u) + ".") : /* @__PURE__ */ React$1.createElement(GsUsernameForm, { current: u.username }));
  };
  const GS_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const GsAuthFrame = ({ title, subtitle, onBack, children, foot }) => /* @__PURE__ */ React$1.createElement("div", { className: "gs-auth" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-auth-bar" }, onBack ? /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "gs-iconbtn", "aria-label": "Back", onClick: onBack }, /* @__PURE__ */ React$1.createElement(DS.Icon, { name: "back" })) : /* @__PURE__ */ React$1.createElement("span", { className: "gs-iconbtn-space" }), /* @__PURE__ */ React$1.createElement("span", { className: "gs-iconbtn-space" })), /* @__PURE__ */ React$1.createElement("main", { className: "gs-auth-col" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-auth-head" }, /* @__PURE__ */ React$1.createElement("h1", { className: "gs-auth-h1" }, /* @__PURE__ */ React$1.createElement(GsMark, { size: 28 }), /* @__PURE__ */ React$1.createElement("span", null, title)), subtitle && /* @__PURE__ */ React$1.createElement("p", { className: "gs-muted" }, subtitle)), children, /* @__PURE__ */ React$1.createElement("div", { className: "gs-auth-foot" }, foot || /* @__PURE__ */ React$1.createElement(GsConsent, { lead: "Your use of After Pixels is covered by our" }))));
  const GsConsent = ({ lead }) => {
    const gs = useGs();
    const l = (doc, t) => /* @__PURE__ */ React$1.createElement("a", { href: "#", onClick: (e) => {
      e.preventDefault();
      gs.go("legal", { doc });
    } }, t);
    return /* @__PURE__ */ React$1.createElement("p", { className: "gs-small" }, lead, " ", l("terms", "Terms"), ", ", l("privacy", "Privacy"), " and ", l("refunds", "Refund Policy"), ".");
  };
  const GsXLine = ({ children, center }) => /* @__PURE__ */ React$1.createElement("p", { className: "gs-xline" + (center ? " is-center" : ""), role: "alert" }, /* @__PURE__ */ React$1.createElement(GsGlyph, { name: "x", size: 18, style: { color: "var(--error)" } }), /* @__PURE__ */ React$1.createElement("span", null, children));
  const GsProviders = ({ onProvider, onEmail, failed }) => /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-sm" }, /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "secondary", block: true, onClick: () => onProvider("Google") }, /* @__PURE__ */ React$1.createElement(GsGlyph, { name: "google" }), "Continue with Google"), /* @__PURE__ */ React$1.createElement(DS.Button, { id: "gs-apple-btn", variant: "secondary", block: true, className: "gs-btn-apple", onClick: () => onProvider("Apple") }, /* @__PURE__ */ React$1.createElement(GsGlyph, { name: "apple" }), "Continue with Apple"), /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "secondary", block: true, className: "gs-btn-email", onClick: onEmail }, /* @__PURE__ */ React$1.createElement(GsGlyph, { name: "mail" }), "Continue with email"), failed && /* @__PURE__ */ React$1.createElement(GsXLine, { center: true }, "Couldn’t continue with ", failed, ". Try again."));
  const gsCheck = (rules, f) => {
    const out = {};
    rules.forEach(([k, ok, msg]) => {
      if (!out[k] && !ok(f[k] || "", f)) out[k] = msg;
    });
    return out;
  };
  const useGsForm = (initial, rules, onValid, opts) => {
    const [f, setF] = React$1.useState(initial);
    const [tried, setTried] = React$1.useState(!!(opts && opts.tried));
    const refs = React$1.useRef({});
    const [busy, run] = useGsBusy();
    const errs = tried ? gsCheck(rules, f) : {};
    const bind = (k) => ({
      value: f[k],
      error: errs[k],
      inputRef: (el) => {
        refs.current[k] = el;
      },
      onChange: (e) => setF((s) => ({ ...s, [k]: e.target.value }))
    });
    const submit = (e) => {
      e && e.preventDefault();
      if (busy) return;
      setTried(true);
      const er = gsCheck(rules, f);
      const bad = rules.map((r) => r[0]).find((k) => er[k]);
      if (bad) {
        setTimeout(() => refs.current[bad] && refs.current[bad].focus(), 0);
        return;
      }
      if (opts && opts.instant) onValid(f);
      else run(() => onValid(f));
    };
    const clear = () => {
      setF(initial);
      setTried(false);
    };
    const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
    const focus = (k) => setTimeout(() => refs.current[k] && refs.current[k].focus(), 0);
    return { f, bind, submit, busy, reset: () => setTried(false), clear, set, focus };
  };
  const useGsStep = () => {
    const [step, setStepState] = React$1.useState(() => window.history.state && window.history.state.gsStep || 1);
    React$1.useEffect(() => {
      const onPop = (e) => setStepState(e.state && e.state.gsStep || 1);
      window.addEventListener("popstate", onPop);
      return () => window.removeEventListener("popstate", onPop);
    }, []);
    const toEmail = () => {
      try {
        window.history.pushState({ ...window.history.state || {}, gsStep: 2 }, "");
      } catch (e) {
      }
      setStepState(2);
    };
    const back = () => {
      if (window.history.state && window.history.state.gsStep === 2) window.history.back();
      else setStepState(1);
    };
    return [step, toEmail, back];
  };
  const gsProviderTrip = (gs, provider, setFailed, onOk) => {
    setFailed(null);
    if (gs.review.providerFail) {
      setFailed(provider);
      return;
    }
    if (gs.review.sheet === "cancelled") return;
    onOk();
  };
  const gsSignupRules = () => [
    ["first", (v) => v.trim().length > 0, "Enter your first name."],
    ["last", (v) => v.trim().length > 0, "Enter your last name."],
    ["email", (v) => GS_EMAIL_RE.test(v.trim()), "Enter a valid email address."],
    ...gsUsernameRules(null),
    ["pw", (v) => v.length >= 8, "Use at least 8 characters."]
  ];
  const GsSignUp = () => {
    const gs = useGs();
    const next = gs.route.next;
    const [step, toEmail, back] = useGsStep();
    const [failed, setFailed] = React$1.useState(null);
    const d = gs.route.draft || {};
    const form = useGsForm({ first: d.first || "", last: d.last || "", email: d.email || "", name: d.name || "", pw: "" }, gsSignupRules(), (f) => {
      gs.setUser({ email: f.email.trim() });
      gs.keep({ draft: { first: f.first.trim(), last: f.last.trim(), email: f.email.trim(), name: f.name.trim() } });
      gs.go("verify", { ctx: "signup", email: f.email.trim(), username: f.name.trim(), first: f.first.trim(), last: f.last.trim(), next });
    });
    const foot = /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement(GsConsent, { lead: "By creating an account you accept our" }), step === 1 && /* @__PURE__ */ React$1.createElement("p", null, "Already have an account? ", /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "gs-inlink", onClick: () => gs.go("signin", next === "checkout" ? { next: "subscribe" } : void 0) }, "Sign in"), " or ", /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "gs-inlink", onClick: () => gs.go("home") }, "learn more")));
    if (step === 1) return /* @__PURE__ */ React$1.createElement(GsAuthFrame, { title: "Create your account", subtitle: "One account for every game you play.", foot }, /* @__PURE__ */ React$1.createElement(
      GsProviders,
      {
        failed,
        onProvider: (p) => gsProviderTrip(gs, p, setFailed, () => gs.go("returning", { mode: "signup", provider: p.toLowerCase(), next })),
        onEmail: () => {
          setFailed(null);
          toEmail();
        }
      }
    ));
    return /* @__PURE__ */ React$1.createElement(GsAuthFrame, { title: "Create your account", onBack: () => {
      form.reset();
      back();
    }, foot }, /* @__PURE__ */ React$1.createElement("form", { noValidate: true, onSubmit: form.submit, className: "gs-stack-md" }, /* @__PURE__ */ React$1.createElement(DS.TextField, { label: "First name", autoComplete: "given-name", autoFocus: true, ...form.bind("first") }), /* @__PURE__ */ React$1.createElement(DS.TextField, { label: "Last name", autoComplete: "family-name", ...form.bind("last") }), /* @__PURE__ */ React$1.createElement(DS.TextField, { label: "Email", type: "email", autoComplete: "email", placeholder: "you@example.com", ...form.bind("email") }), /* @__PURE__ */ React$1.createElement(GsUsernameField, { form, hint: GS_USERNAME_HINT }), /* @__PURE__ */ React$1.createElement(GsLabelled, { label: "Password", aside: "At least 8 characters" }, /* @__PURE__ */ React$1.createElement(DS.TextField, { type: "password", autoComplete: "new-password", "aria-label": "Password", ...form.bind("pw") })), /* @__PURE__ */ React$1.createElement(DS.Button, { type: "submit", block: true, loading: form.busy }, "Create account")));
  };
  const GsLabelled = ({ label, aside, children }) => /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-sm" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-label-row" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-field-label", "aria-hidden": "true" }, label), /* @__PURE__ */ React$1.createElement("span", { className: "gs-small" }, aside)), children);
  const GsCodeField = ({ value, onChange, error, inputRef }) => /* @__PURE__ */ React$1.createElement(
    DS.TextField,
    {
      "aria-label": "6-digit code",
      inputMode: "numeric",
      maxLength: 6,
      placeholder: "000000",
      autoComplete: "one-time-code",
      autoFocus: true,
      className: "gs-code",
      value,
      error,
      inputRef,
      onChange: (e) => onChange(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
    }
  );
  const GsVerify = () => {
    const gs = useGs();
    const { ctx, provider } = gs.route;
    const device = ctx !== "signup";
    const email = gs.route.email || gs.user.email;
    const preset = gs.route.preset;
    const [code, setCode] = React$1.useState(preset === "expired" ? "000000" : preset === "wrong" ? "111111" : "");
    const [err, setErr] = React$1.useState(preset || null);
    const [resent, setResent] = React$1.useState(false);
    const ref = React$1.useRef(null);
    const [busy, run] = useGsBusy();
    const [sending, runSend] = useGsBusy();
    React$1.useEffect(() => {
      if (!resent) return void 0;
      const t = setTimeout(() => setResent(false), 2600);
      return () => clearTimeout(t);
    }, [resent]);
    const refocus = () => setTimeout(() => ref.current && ref.current.focus(), 0);
    const submit = (e) => {
      e.preventDefault();
      if (busy) return;
      if (code.length < 6) {
        setErr("wrong");
        refocus();
        return;
      }
      run(() => {
        if (code === "000000") setErr("expired");
        else if (code === "111111") setErr("wrong");
        else {
          setErr(null);
          if (ctx === "device") gs.signedIn(provider || "email", gs.route.next);
          else gs.accountMade(gs.route.username, "email", gs.route.next, { first: gs.route.first, last: gs.route.last });
          return;
        }
        refocus();
      });
    };
    const resend = () => runSend(() => {
      setResent(true);
      setErr(null);
      setCode("");
      refocus();
    });
    return /* @__PURE__ */ React$1.createElement(
      GsAuthFrame,
      {
        title: device ? "Verify this device" : "Verify your email",
        subtitle: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, "Enter the 6-digit code sent to ", /* @__PURE__ */ React$1.createElement("b", null, email), "."),
        onBack: () => ctx === "device" ? gs.go("signin", gs.route.next ? { next: gs.route.next } : void 0) : gs.route.prev && gs.route.prev.name === "signup" ? gs.back() : gs.go("signup", { next: gs.route.next })
      },
      /* @__PURE__ */ React$1.createElement("form", { noValidate: true, onSubmit: submit, className: "gs-stack-md" }, /* @__PURE__ */ React$1.createElement(
        GsCodeField,
        {
          value: code,
          error: err === "wrong" ? "That code’s not right. Check and re-enter." : null,
          inputRef: (el) => {
            ref.current = el;
          },
          onChange: (v) => {
            setCode(v);
            setErr(null);
          }
        }
      ), err === "expired" && /* @__PURE__ */ React$1.createElement(GsXLine, null, "That code’s expired. Request a fresh one."), /* @__PURE__ */ React$1.createElement(DS.Button, { type: "submit", block: true, loading: busy }, "Verify"), /* @__PURE__ */ React$1.createElement("div", { className: "gs-center gs-link-slot" }, resent ? /* @__PURE__ */ React$1.createElement("span", { className: "gs-ico-row", role: "status" }, /* @__PURE__ */ React$1.createElement(DS.Icon, { name: "check" }), "A fresh code is on its way.") : /* @__PURE__ */ React$1.createElement(DS.TextLink, { onClick: resend, "aria-busy": sending || void 0 }, sending && /* @__PURE__ */ React$1.createElement(GsInkSpin, null), "Resend code")))
    );
  };
  const GsReturning = () => {
    const gs = useGs();
    const { mode, next, provider } = gs.route;
    return /* @__PURE__ */ React$1.createElement(
      GsFullLoader,
      {
        label: "Completing sign-in",
        ms: 1500,
        onDone: () => mode === "signup" ? gs.go("username", { next, provider }) : gs.review.device === "new" ? gs.go("verify", { ctx: "device", provider, next }) : gs.signedIn(provider, next)
      }
    );
  };
  const GS_SIGNIN_RULES = [
    ["email", (v) => GS_EMAIL_RE.test(v.trim()), "Enter a valid email address."],
    ["pw", (v) => v.length > 0, "Enter your password."]
  ];
  const GsSignIn = () => {
    const gs = useGs();
    const [step, toEmail, back] = useGsStep();
    const [failed, setFailed] = React$1.useState(null);
    const next = gs.route.next;
    const form = useGsForm({ email: "", pw: "" }, GS_SIGNIN_RULES, (f) => gs.review.device === "new" ? gs.go("verify", { ctx: "device", email: f.email.trim(), next }) : gs.signedIn("email", next));
    const onProvider = (p) => gsProviderTrip(gs, p, setFailed, () => gs.go("returning", { mode: "signin", provider: p.toLowerCase(), next }));
    const consent = /* @__PURE__ */ React$1.createElement(GsConsent, { lead: "Your use of After Pixels is covered by our" });
    const subtitle = "Pick up where you left off.";
    if (step === 1) return /* @__PURE__ */ React$1.createElement(GsAuthFrame, { title: "Sign in", subtitle, foot: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, consent, /* @__PURE__ */ React$1.createElement("p", null, "New here? ", /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "gs-inlink", onClick: () => gs.go("signup") }, "Create an account"), " or ", /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "gs-inlink", onClick: () => gs.go("home") }, "learn more"))) }, /* @__PURE__ */ React$1.createElement(GsProviders, { failed, onProvider, onEmail: () => {
      setFailed(null);
      toEmail();
    } }));
    return /* @__PURE__ */ React$1.createElement(GsAuthFrame, { title: "Sign in", onBack: () => {
      form.reset();
      back();
    }, foot: consent }, /* @__PURE__ */ React$1.createElement("form", { noValidate: true, onSubmit: form.submit, className: "gs-stack-md" }, /* @__PURE__ */ React$1.createElement(DS.TextField, { label: "Email", type: "email", autoComplete: "email", placeholder: "you@example.com", autoFocus: true, ...form.bind("email") }), /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-xs" }, /* @__PURE__ */ React$1.createElement(DS.TextField, { label: "Password", type: "password", autoComplete: "current-password", placeholder: "••••••••", ...form.bind("pw") }), /* @__PURE__ */ React$1.createElement("div", { className: "gs-act gs-act-end" }, /* @__PURE__ */ React$1.createElement(DS.TextLink, { onClick: () => gs.go("recover") }, "Forgot password?"))), /* @__PURE__ */ React$1.createElement(DS.Button, { type: "submit", block: true, loading: form.busy }, "Sign in")));
  };
  const GS_NEWPW_RULES = [
    ["pw", (v) => v.length >= 8, "Use at least 8 characters."],
    ["pw2", (v, f) => v === f.pw, "Passwords don’t match. Re-enter to confirm."]
  ];
  const GsRecover = () => {
    const gs = useGs();
    const [step, setStep] = React$1.useState(gs.route.step || "email");
    const [email, setEmail] = React$1.useState(gs.route.email || "");
    const [code, setCode] = React$1.useState("");
    const [codeErr, setCodeErr] = React$1.useState(false);
    const codeRef = React$1.useRef(null);
    const [codeBusy, runCode] = useGsBusy();
    const [resent, setResent] = React$1.useState(false);
    const [sending, runSend] = useGsBusy();
    React$1.useEffect(() => {
      if (!resent) return void 0;
      const t = setTimeout(() => setResent(false), 2600);
      return () => clearTimeout(t);
    }, [resent]);
    const resend = () => runSend(() => {
      setResent(true);
      setCodeErr(false);
      setCode("");
      setTimeout(() => codeRef.current && codeRef.current.focus(), 0);
    });
    const emailForm = useGsForm({ email: "" }, [["email", (v) => GS_EMAIL_RE.test(v.trim()), "Enter a valid email address."]], (f) => {
      setEmail(f.email.trim());
      setStep("sent");
    });
    const pwForm = useGsForm({ pw: "", pw2: "" }, GS_NEWPW_RULES, () => gs.signedIn("email"));
    if (step === "email") return /* @__PURE__ */ React$1.createElement(GsAuthFrame, { title: "Reset your password", subtitle: "Enter your email and we’ll send a code.", onBack: () => gs.go("signin") }, /* @__PURE__ */ React$1.createElement("form", { noValidate: true, className: "gs-stack-md", onSubmit: emailForm.submit }, /* @__PURE__ */ React$1.createElement(DS.TextField, { label: "Email", type: "email", placeholder: "you@example.com", autoFocus: true, ...emailForm.bind("email") }), /* @__PURE__ */ React$1.createElement(DS.Button, { type: "submit", block: true, loading: emailForm.busy }, "Send code")));
    if (step === "sent") return /* @__PURE__ */ React$1.createElement(GsAuthFrame, { title: "Check your email", subtitle: "If an account exists for that email, a code is on its way.", onBack: () => setStep("email") }, /* @__PURE__ */ React$1.createElement(DS.Button, { block: true, onClick: () => setStep("code") }, "Enter code"), /* @__PURE__ */ React$1.createElement("div", { className: "gs-center" }, /* @__PURE__ */ React$1.createElement(DS.TextLink, { onClick: () => setStep("email") }, "Use a different email")));
    if (step === "code") return /* @__PURE__ */ React$1.createElement(GsAuthFrame, { title: "Enter your code", subtitle: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, "Enter the 6-digit code sent to ", /* @__PURE__ */ React$1.createElement("b", null, email), "."), onBack: () => setStep("sent") }, /* @__PURE__ */ React$1.createElement("form", { noValidate: true, className: "gs-stack-md", onSubmit: (e) => {
      e.preventDefault();
      if (codeBusy) return;
      const wrong = () => {
        setCodeErr(true);
        setTimeout(() => codeRef.current && codeRef.current.focus(), 0);
      };
      if (code.length < 6) {
        wrong();
        return;
      }
      runCode(() => code === "111111" ? wrong() : setStep("new"));
    } }, /* @__PURE__ */ React$1.createElement(
      GsCodeField,
      {
        value: code,
        error: codeErr ? "That code’s not right. Check and re-enter." : null,
        inputRef: (el) => {
          codeRef.current = el;
        },
        onChange: (v) => {
          setCode(v);
          setCodeErr(false);
        }
      }
    ), /* @__PURE__ */ React$1.createElement(DS.Button, { type: "submit", block: true, loading: codeBusy }, "Verify"), /* @__PURE__ */ React$1.createElement("div", { className: "gs-center gs-link-slot" }, resent ? /* @__PURE__ */ React$1.createElement("span", { className: "gs-ico-row", role: "status" }, /* @__PURE__ */ React$1.createElement(DS.Icon, { name: "check" }), "A fresh code is on its way.") : /* @__PURE__ */ React$1.createElement(DS.TextLink, { onClick: resend, "aria-busy": sending || void 0 }, sending && /* @__PURE__ */ React$1.createElement(GsInkSpin, null), "Resend code"))));
    return /* @__PURE__ */ React$1.createElement(GsAuthFrame, { title: "Set a new password", subtitle: "Choose a password you haven’t used here before." }, /* @__PURE__ */ React$1.createElement("form", { noValidate: true, className: "gs-stack-md", onSubmit: pwForm.submit }, /* @__PURE__ */ React$1.createElement(DS.TextField, { label: "New password", type: "password", autoComplete: "new-password", placeholder: "At least 8 characters", autoFocus: true, ...pwForm.bind("pw") }), /* @__PURE__ */ React$1.createElement(DS.TextField, { label: "Confirm new password", type: "password", autoComplete: "new-password", placeholder: "Re-enter password", ...pwForm.bind("pw2") }), /* @__PURE__ */ React$1.createElement(DS.Button, { type: "submit", block: true, loading: pwForm.busy }, "Update password")));
  };
  const GS_NB = " ";
  const GS_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const GS_DAY0 = new Date(2026, 9, 6);
  const gsAddDays = (d, n) => {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
  };
  const gsAddMonths = (d, n) => {
    const x = new Date(d);
    x.setMonth(x.getMonth() + n);
    return x;
  };
  const gsLong = (d) => [d.getDate(), GS_MONTHS[d.getMonth()], d.getFullYear()].join(GS_NB);
  const gsShort = (d) => d.getDate() + GS_NB + GS_MONTHS[d.getMonth()].slice(0, 3);
  const gsNb = (s) => s.replace(/ /g, GS_NB);
  const GS_PLAN = {
    monthly: { name: "Monthly", price: gsNb("£3 a month"), per: gsNb("£3 / month"), due: "£3.00", months: 1 },
    yearly: { name: "Yearly", price: gsNb("£30 a year"), per: gsNb("£30 / year"), due: "£30.00", months: 12 }
  };
  const GS_YEAR_MONTH = gsNb("£2.50 a month");
  const gsOther = (plan) => plan === "yearly" ? "monthly" : "yearly";
  const gsSubDate = (sub) => {
    if (sub.renew) return new Date(sub.renew);
    return sub.plan === "yearly" ? new Date(2027, 8, 18) : new Date(2026, 9, 18);
  };
  const GS_SUB_HOLDS = ["active", "failed", "ending"];
  const GsRows = ({ rows }) => /* @__PURE__ */ React$1.createElement("dl", { className: "gs-rows-dl" }, rows.map(([k, v]) => /* @__PURE__ */ React$1.createElement("div", { key: k, className: "gs-row-kv" }, /* @__PURE__ */ React$1.createElement("dt", { className: "gs-muted" }, k), /* @__PURE__ */ React$1.createElement("dd", { className: "gs-num-text" }, v))));
  const GsActs = ({ children }) => /* @__PURE__ */ React$1.createElement("div", { className: "gs-acts" }, children);
  const GsPopTitle = ({ children }) => /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-card" }, children);
  const GsKeepLock = ({ lead }) => /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-sm" }, /* @__PURE__ */ React$1.createElement("p", null, lead), /* @__PURE__ */ React$1.createElement("p", null, /* @__PURE__ */ React$1.createElement("b", null, "You keep"), " your results, your history and the achievements you earned."), /* @__PURE__ */ React$1.createElement("p", null, /* @__PURE__ */ React$1.createElement("b", null, "What freezes:"), " your streaks, and progress toward achievements you haven’t earned yet."));
  const gsPassFails = (gs) => !!(gs.review && gs.review.passFail);
  const GsPassCard = () => {
    const gs = useGs();
    const { sub } = gs;
    const [sheet, setSheet] = React$1.useState(gs.route.sheet || null);
    const [busy, run] = useGsBusy();
    const [failed, setFailed] = React$1.useState(null);
    const want = React$1.useRef(null);
    React$1.useEffect(() => {
      const k = want.current;
      if (!k) return;
      want.current = null;
      const el = document.querySelector('[data-gs-focus="' + k + '"]');
      if (el) el.focus({ preventScroll: true });
    });
    const done = (k, msg) => {
      want.current = k;
      gsAnnounce(msg);
    };
    const date = gsLong(gsSubDate(sub));
    const plan = GS_PLAN[sub.plan];
    const other = gsOther(sub.plan);
    const card = { gap: 16, justifyItems: "stretch", alignContent: "start" };
    const update = /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "secondary", onClick: () => gs.go("update-card") }, /* @__PURE__ */ React$1.createElement(GsGlyph, { name: "card" }), "Update payment card");
    if (!GS_SUB_HOLDS.includes(sub.status)) return /* @__PURE__ */ React$1.createElement(DS.Card, { style: card }, /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-card" }, "Pass"), sub.hadPass ? /* @__PURE__ */ React$1.createElement(GsKeepLock, { lead: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, "Your Pass ended on ", gsLong(gsEndedOn(gs)), ".") }) : /* @__PURE__ */ React$1.createElement("p", null, "You have a free account. Free play needs no card, and your results and history are kept. The Pass opens every game in full."), /* @__PURE__ */ React$1.createElement("div", { className: "gs-card-acts" }, /* @__PURE__ */ React$1.createElement(DS.Button, { "data-gs-focus": "getpass", variant: "secondary", onClick: () => gs.go("pass") }, sub.hadPass ? "Get the Pass again" : "Get the Pass")));
    const marker = sub.status === "failed" ? /* @__PURE__ */ React$1.createElement("span", { className: "gs-marker is-bad" }, "Payment failed") : sub.status === "ending" ? /* @__PURE__ */ React$1.createElement("span", { className: "gs-marker" }, "Ending") : /* @__PURE__ */ React$1.createElement("span", { className: "gs-marker" }, /* @__PURE__ */ React$1.createElement(DS.Icon, { name: "check" }), "Active");
    let rows = [["Plan", plan.name + " · " + plan.price]];
    let body = null;
    if (sub.status === "active") {
      rows.push(["Next renewal", date]);
      if (sub.pending) rows.push(["From " + date, GS_PLAN[sub.pending].name + " · " + GS_PLAN[sub.pending].price]);
      body = /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-sm" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-pair-even" }, update, sub.pending ? /* @__PURE__ */ React$1.createElement(DS.Button, { "data-gs-focus": "keep", variant: "secondary", loading: busy, onClick: () => {
        setFailed(null);
        run(() => {
          if (gsPassFails(gs)) {
            setFailed("keep");
            return;
          }
          done("switch", "Your switch is undone. You stay on " + plan.name.toLowerCase() + ".");
          gs.setSub({ pending: null });
        });
      } }, "Keep ", plan.name.toLowerCase()) : /* @__PURE__ */ React$1.createElement(DS.Button, { "data-gs-focus": "switch", variant: "secondary", onClick: () => setSheet("switch") }, "Switch to ", other)), failed === "keep" && sub.pending && /* @__PURE__ */ React$1.createElement(GsXLine, null, "Your switch to ", sub.pending, " is still set. Try again."));
    } else if (sub.status === "failed") {
      if (sub.pending) rows.push(["From " + date, GS_PLAN[sub.pending].name + " · " + GS_PLAN[sub.pending].price]);
      body = /* @__PURE__ */ React$1.createElement("div", { className: "gs-line-act" }, /* @__PURE__ */ React$1.createElement("p", null, "Update the card within 30 days to keep your Pass."), update);
    } else {
      rows.push(["Ends on", date]);
      body = /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-md" }, /* @__PURE__ */ React$1.createElement(GsKeepLock, { lead: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, "Your Pass ends on that date. You can resume any time before then.") }), /* @__PURE__ */ React$1.createElement("div", { className: "gs-pair-even" }, update, /* @__PURE__ */ React$1.createElement(DS.Button, { "data-gs-focus": "resume", variant: "secondary", loading: busy, onClick: () => {
        setFailed(null);
        run(() => {
          if (gsPassFails(gs)) {
            setFailed("resume");
            return;
          }
          done("cancel", "Your subscription is resumed.");
          gs.setSub({ status: "active" });
        });
      } }, "Resume subscription")), failed === "resume" && /* @__PURE__ */ React$1.createElement(GsXLine, null, "Your subscription wasn’t resumed. Try again."));
    }
    return /* @__PURE__ */ React$1.createElement(DS.Card, { style: card }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-title-row" }, /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-card" }, "Pass"), marker), /* @__PURE__ */ React$1.createElement(GsRows, { rows }), body, /* @__PURE__ */ React$1.createElement("div", { className: "gs-card-foot gs-small" }, /* @__PURE__ */ React$1.createElement("span", null, "Billed to ", gs.user.email), /* @__PURE__ */ React$1.createElement("span", null, "Card ending 4242")), sub.status !== "ending" && /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("div", { className: "gs-rule" }), /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement(DS.TextLink, { "data-gs-focus": "cancel", danger: true, onClick: () => setSheet("cancel") }, "Cancel subscription"))), /* @__PURE__ */ React$1.createElement(GsSwitchSheet, { open: sheet === "switch", onClose: () => setSheet(null), onDone: done }), /* @__PURE__ */ React$1.createElement(GsCancelSheet, { open: sheet === "cancel", onClose: () => setSheet(null), onDone: done }));
  };
  const GsBeforeAfter = ({ now, then }) => /* @__PURE__ */ React$1.createElement("div", { className: "gs-ba" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-ba-side" }, now.map((l, i) => /* @__PURE__ */ React$1.createElement("span", { key: i, className: i === 0 ? "gs-small" : i === 1 ? "gs-strong" : "gs-num-text" }, l))), /* @__PURE__ */ React$1.createElement(GsGlyph, { name: "arrow" }), /* @__PURE__ */ React$1.createElement("div", { className: "gs-ba-side is-hi" }, then.map((l, i) => /* @__PURE__ */ React$1.createElement("span", { key: i, className: i === 0 ? "gs-small" : i === 1 ? "gs-strong" : "gs-num-text" }, l))));
  const GsSwitchSheet = ({ open, onClose, onDone }) => {
    const gs = useGs();
    const { sub } = gs;
    const to = gsOther(sub.plan);
    const last = React$1.useRef(null);
    if (open) last.current = { from: sub.plan, to, date: gsShort(gsSubDate(sub)), long: gsLong(gsSubDate(sub)) };
    const p = last.current || { from: sub.plan, to, date: "", long: "" };
    const [busy, run, cancel] = useGsBusy();
    const [failed, setFailed] = React$1.useState(false);
    React$1.useEffect(() => {
      if (open) setFailed(false);
    }, [open]);
    const close = () => {
      cancel();
      onClose();
    };
    const go = () => {
      setFailed(false);
      run(() => {
        if (gsPassFails(gs)) {
          setFailed(true);
          return;
        }
        onDone && onDone("keep", "You switch to " + p.to + " from " + p.long + ".");
        gs.setSub({ pending: p.to });
        onClose();
      });
    };
    return /* @__PURE__ */ React$1.createElement(DS.Popup, { open, onClose: close, posture: "window", label: "Switch to " + p.to + "?" }, /* @__PURE__ */ React$1.createElement(GsPopTitle, null, "Switch to ", p.to, "?"), /* @__PURE__ */ React$1.createElement(GsBeforeAfter, { now: ["Now", GS_PLAN[p.from].name, GS_PLAN[p.from].price], then: ["From " + p.date, GS_PLAN[p.to].name, GS_PLAN[p.to].price] }), /* @__PURE__ */ React$1.createElement("p", null, "Nothing is paid now."), failed && /* @__PURE__ */ React$1.createElement(GsXLine, null, "Your plan wasn’t switched. Try again."), /* @__PURE__ */ React$1.createElement(GsActs, null, /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "secondary", onClick: close }, "Cancel"), /* @__PURE__ */ React$1.createElement(DS.Button, { onClick: go, loading: busy }, "Switch to ", p.to)));
  };
  const GsCancelSheet = ({ open, onClose, onDone }) => {
    const gs = useGs();
    const { sub } = gs;
    const last = React$1.useRef(null);
    if (open) last.current = { failed: sub.status === "failed", plan: sub.plan, date: gsShort(gsSubDate(sub)), long: gsLong(gsSubDate(sub)) };
    const p = last.current || { failed: false, plan: sub.plan, date: "" };
    const now = ["Now", GS_PLAN[p.plan].name, GS_PLAN[p.plan].price];
    const [busy, run, cancel] = useGsBusy();
    const [failed, setFailed] = React$1.useState(false);
    React$1.useEffect(() => {
      if (open) setFailed(false);
    }, [open]);
    const close = () => {
      cancel();
      onClose();
    };
    const go = () => {
      setFailed(false);
      run(() => {
        if (gsPassFails(gs)) {
          setFailed(true);
          return;
        }
        if (p.failed) {
          onDone && onDone("getpass", "Your subscription is cancelled. Your Pass has ended.");
          gs.setSub({ status: "none", pending: null, hadPass: true, endedOn: GS_DAY0.getTime() });
        } else {
          onDone && onDone("resume", "Your subscription is cancelled. Your Pass ends on " + p.long + ".");
          gs.setSub({ status: "ending", pending: null });
        }
        onClose();
      });
    };
    return /* @__PURE__ */ React$1.createElement(DS.Popup, { open, onClose: close, posture: "window", label: "Cancel your subscription?" }, /* @__PURE__ */ React$1.createElement(GsPopTitle, null, "Cancel your subscription?"), /* @__PURE__ */ React$1.createElement(GsBeforeAfter, { now, then: [p.failed ? "Today" : "From " + p.date, "Ends", "Nothing charged"] }), /* @__PURE__ */ React$1.createElement(GsKeepLock, { lead: p.failed ? "Your Pass ends today." : "You keep the Pass until it ends." }), failed && /* @__PURE__ */ React$1.createElement(GsXLine, null, "Your subscription wasn’t cancelled. Try again."), /* @__PURE__ */ React$1.createElement(GsActs, null, /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "secondary", onClick: close }, "Keep subscription"), /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "danger", onClick: go, loading: busy }, "Cancel subscription")));
  };
  const GsSubscribe = () => {
    const gs = useGs();
    const plan = GS_PLAN[gs.choice];
    return /* @__PURE__ */ React$1.createElement("main", { className: "gs-wrap gs-main" }, /* @__PURE__ */ React$1.createElement("section", { className: "gs-buy-block", "aria-labelledby": "gs-buy-h" }, /* @__PURE__ */ React$1.createElement("h1", { id: "gs-buy-h", className: "mcp-t-sec gs-buy-head" }, "Start your Pass"), /* @__PURE__ */ React$1.createElement("fieldset", { className: "gs-plans" }, /* @__PURE__ */ React$1.createElement("legend", { className: "gs-vh" }, "Plan"), ["yearly", "monthly"].map((k) => /* @__PURE__ */ React$1.createElement("label", { key: k, className: "gs-plan" + (gs.choice === k ? " is-on" : "") }, /* @__PURE__ */ React$1.createElement("input", { type: "radio", name: "gs-plan", value: k, checked: gs.choice === k, onChange: () => gs.setChoice(k) }), /* @__PURE__ */ React$1.createElement("span", { className: "gs-plan-dot", "aria-hidden": "true" }), /* @__PURE__ */ React$1.createElement("span", { className: "gs-plan-name" }, GS_PLAN[k].name), k === "yearly" && /* @__PURE__ */ React$1.createElement(DS.Tag, { kind: "success" }, GS_YEAR_MONTH), /* @__PURE__ */ React$1.createElement("span", { className: "gs-plan-price gs-num-text" }, GS_PLAN[k].per)))), /* @__PURE__ */ React$1.createElement(GsRows, { rows: [["Due today", plan.due], ["Renews", gsLong(gsAddMonths(GS_DAY0, plan.months))]] }), /* @__PURE__ */ React$1.createElement(DS.Button, { block: true, onClick: gs.getPass }, "Get the Pass")));
  };
  const GsProviderFrame = ({ merchant, children }) => /* @__PURE__ */ React$1.createElement("div", { className: "gs-auth" }, /* @__PURE__ */ React$1.createElement("main", { className: "gs-auth-col" }, children, /* @__PURE__ */ React$1.createElement("p", { className: "gs-small gs-center" }, "This is a simulated provider boundary.")));
  const gsFmt = {
    card: (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim(),
    exp: (v) => {
      const d = v.replace(/\D/g, "").slice(0, 4);
      return d.length > 2 ? d.slice(0, 2) + " / " + d.slice(2) : d;
    },
    cvc: (v) => v.replace(/\D/g, "").slice(0, 4)
  };
  const GsCardInputs = () => {
    const [f, setF] = React$1.useState({ card: "", exp: "", cvc: "" });
    const bind = (k) => ({ value: f[k], onChange: (e) => setF((s) => ({ ...s, [k]: gsFmt[k](e.target.value) })) });
    return /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-sm", role: "group", "aria-labelledby": "gs-card-info" }, /* @__PURE__ */ React$1.createElement("span", { id: "gs-card-info", className: "gs-field-label" }, "Card information"), /* @__PURE__ */ React$1.createElement("div", { className: "gs-cardin" }, /* @__PURE__ */ React$1.createElement("input", { className: "mcp-in gs-num-text", inputMode: "numeric", placeholder: "1234 1234 1234 1234", autoComplete: "cc-number", "aria-label": "Card number", ...bind("card") }), /* @__PURE__ */ React$1.createElement("div", { className: "gs-cardin-row" }, /* @__PURE__ */ React$1.createElement("input", { className: "mcp-in gs-num-text", inputMode: "numeric", placeholder: "MM / YY", autoComplete: "cc-exp", "aria-label": "Expiry, MM / YY", ...bind("exp") }), /* @__PURE__ */ React$1.createElement("input", { className: "mcp-in gs-num-text", inputMode: "numeric", placeholder: "CVC", autoComplete: "cc-csc", "aria-label": "CVC", ...bind("cvc") }))));
  };
  const GsCheckout = () => {
    const gs = useGs();
    const plan = GS_PLAN[gs.choice];
    const [paying, setPaying] = React$1.useState(false);
    const pay = (e) => {
      e.preventDefault();
      if (paying) return;
      setPaying(true);
      setTimeout(() => gs.paid(), 1400);
    };
    return /* @__PURE__ */ React$1.createElement(GsProviderFrame, { merchant: "After Pixels" }, /* @__PURE__ */ React$1.createElement(DS.Card, { style: { gap: 24, justifyItems: "stretch", padding: 24 } }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-xs" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-small" }, "After Pixels · ", plan.name, " plan"), /* @__PURE__ */ React$1.createElement("span", { className: "gs-ico-row" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-figure gs-num-text" }, plan.due), /* @__PURE__ */ React$1.createElement("span", { className: "gs-muted" }, "due today")), /* @__PURE__ */ React$1.createElement("p", { className: "gs-small" }, "Then ", plan.price, " from ", gsLong(gsAddMonths(GS_DAY0, plan.months)), ".")), /* @__PURE__ */ React$1.createElement("form", { noValidate: true, onSubmit: pay, className: "gs-stack-md" }, /* @__PURE__ */ React$1.createElement(DS.TextField, { label: "Email", value: gs.user.email, readOnly: true }), /* @__PURE__ */ React$1.createElement(GsCardInputs, null), /* @__PURE__ */ React$1.createElement(DS.Button, { type: "submit", block: true, loading: paying, loadingLabel: "Processing…" }, "Pay and subscribe")), /* @__PURE__ */ React$1.createElement("div", { className: "gs-center" }, /* @__PURE__ */ React$1.createElement(DS.TextLink, { onClick: gs.afterCheckout }, "Cancel and return"))));
  };
  const GsUpdateCard = () => {
    const gs = useGs();
    const [busy, run] = useGsBusy();
    const save = (e) => {
      e.preventDefault();
      run(() => {
        if (gs.sub.status === "failed") gs.setSub({ status: "active" });
        gs.go("account");
      });
    };
    return /* @__PURE__ */ React$1.createElement(GsProviderFrame, { merchant: "After Pixels · Billing" }, /* @__PURE__ */ React$1.createElement(DS.Card, { style: { gap: 24, justifyItems: "stretch", padding: 24 } }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-xs" }, /* @__PURE__ */ React$1.createElement("h1", { className: "mcp-t-sec" }, "Update your card"), /* @__PURE__ */ React$1.createElement("p", { className: "gs-muted" }, gs.user.email)), /* @__PURE__ */ React$1.createElement("form", { noValidate: true, onSubmit: save, className: "gs-stack-md" }, /* @__PURE__ */ React$1.createElement(GsCardInputs, null), /* @__PURE__ */ React$1.createElement(DS.Button, { type: "submit", block: true, loading: busy }, "Save card")), /* @__PURE__ */ React$1.createElement("div", { className: "gs-center" }, /* @__PURE__ */ React$1.createElement(DS.TextLink, { onClick: () => gs.go("account") }, "Cancel and return"))));
  };
  const CPR_DEFAULTS = { bwDone: false, newEds: "seed", lapsed: "seed", freeNew: true };
  let CPR_WORD_PLAY;
  const cprSyncSeed = (v) => {
    if (v.freeNew) delete GS_TODAY_PLAYED.free.word;
    else GS_TODAY_PLAYED.free.word = CPR_WORD_PLAY;
  };
  let cprStore;
  const useCpr = () => {
    const [, bump] = React$1.useState(0);
    React$1.useEffect(() => {
      const f = () => bump((n) => n + 1);
      cprStore.subs.add(f);
      return () => cprStore.subs.delete(f);
    }, []);
    return cprStore.v;
  };
  let CPR_STAGE;
  let CPR_SHOWN;
  const cprLocked = (gs, k) => CPR_STAGE[k] === "pass" && gs.view !== "pass";
  let CPR_LAPSED;
  const cprLapsedOf = (id) => (CPR_LAPSED[cprStore.get().lapsed] || CPR_LAPSED.seed)[id] || { used: true, pass: true };
  const cprFirstState = (gs, id) => {
    if (gs.view === "pass") return id === "barrow" && cprStore.get().bwDone ? "done" : "pass";
    if (gsLapsed(gs)) return cprLapsedOf(id).used ? "done" : "none";
    if (gsFresh(gs)) return "none";
    if (id === "barrow") return cprStore.get().bwDone ? "done" : "none";
    if (id === "escape" && cprStore.get().freeNew) return "none";
    if (!lbWeekDone(gs)) return "live";
    return "done";
  };
  const cprPlayed = (gs, k) => {
    if (GS_GAMES[k].added) return false;
    if (cprStore.get().newEds === "most" && !gsFresh(gs)) return k === "word";
    if (gsFresh(gs)) return false;
    if (k === "barrow") {
      const s = cprFirstState(gs, "barrow");
      return s === "live" || s === "done";
    }
    if (k === "hunter") return gs.view === "pass" || gsLapsed(gs);
    return true;
  };
  let CPR_NUM;
  const cprPassLine = () => {
    const st = Object.values(CPR_STAGE);
    const n = st.filter((k) => k === "daily").length;
    const first = st.includes("first");
    const parts = [];
    if (n) parts.push((CPR_NUM[n] || String(n)) + " daily puzzle" + (n > 1 ? "s" : ""));
    if (first) parts.push(parts.length ? "the start of select games" : "The start of select games");
    const p1 = parts.length ? parts.join(" and ") + (parts.length > 1 || n > 1 ? " come" : " comes") + " with your account. " : "";
    return { p1, lead: (parts.length ? "Everything else" : "Everything") + " comes with " };
  };
  const cprBoxCopy = (id) => {
    const k = CPR_STAGE[id];
    const u = GS_GAMES[id].ed[0];
    const U = u.toUpperCase();
    if (k === "daily" && id === "groups") return null;
    if (k === "daily") {
      const no = { word: 212, mystery: 64 }[id];
      return ["TODAY’S " + U + " · #" + no, "Free with an account. A new " + u + " every day."];
    }
    if (k === "first") return [id === "barrow" ? "CHAPTER 1" : "THE FIRST " + U, "Free with an account. Every other " + u + " comes with the Pass."];
    if (k === "pass") return ["WITH THE PASS", (GS_NAME[id] || GS_GAMES[id].name) + " comes with the Pass."];
    return null;
  };
  let GsPassStage;
  function initGsPassStore() {
    CPR_WORD_PLAY = GS_TODAY_PLAYED.free.word;
    cprStore = {
      v: { ...CPR_DEFAULTS },
      subs: /* @__PURE__ */ new Set(),
      get() {
        return this.v;
      },
      set(p) {
        this.v = { ...this.v, ...p };
        cprSyncSeed(this.v);
        this.subs.forEach((f) => f());
      }
    };
    cprSyncSeed(cprStore.v);
    CPR_STAGE = Object.fromEntries(GS_GAME_ORDER.map((k) => [k, GS_GAMES[k].access]));
    CPR_SHOWN = GS_GAME_ORDER.filter((k) => !!CPR_STAGE[k]);
    CPR_LAPSED = {
      seed: { escape: { used: true, pass: false }, delve: { used: true, pass: true }, barrow: { used: true, pass: true } },
      every: { escape: { used: false, pass: true }, barrow: { used: true, pass: true }, delve: { used: true, pass: false } }
    };
    CPR_NUM = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
    GsPassStage = cprStore;
  }
  const cprTags = (k) => GS_GAMES[k].tags.filter((t) => t !== "FREE" && t !== "FIRST" && t !== "PASS");
  const CprArt = ({ host, id, shape }) => /* @__PURE__ */ React$1.createElement("div", { ref: host }, /* @__PURE__ */ React$1.createElement(GsArt, { art: GS_GAMES[id].art, shape }));
  const GsCard = ({ id, mark }) => {
    const gs = useGs();
    const host = useGsArtHost();
    const g = GS_GAMES[id];
    return /* @__PURE__ */ React$1.createElement(
      DS.GameCard,
      {
        className: "mcp-art-host gs-host",
        art: /* @__PURE__ */ React$1.createElement(CprArt, { host, id, shape: "wide" }),
        pass: cprLocked(gs, id),
        onPass: () => gs.go("pass"),
        title: /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "gs-titlebtn mcp-art-link", onClick: () => gs.go(g.route) }, g.name),
        mark: mark && /* @__PURE__ */ React$1.createElement(DS.Tag, { kind: "daily", icon: "check" }, mark),
        blurb: gsKeepLast(g.blurb),
        tags: /* @__PURE__ */ React$1.createElement(GsTagList, { tags: cprTags(id), ed: g.ed })
      }
    );
  };
  const GsGameCard = GsCard;
  const GsPick = ({ id, label }) => {
    const gs = useGs();
    const host = useGsArtHost();
    const g = GS_GAMES[id];
    return /* @__PURE__ */ React$1.createElement(
      DS.GamePick,
      {
        className: "mcp-art-host gs-host",
        art: /* @__PURE__ */ React$1.createElement(CprArt, { host, id, shape: "wide" }),
        pass: cprLocked(gs, id),
        onPass: () => gs.go("pass"),
        label,
        title: /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "gs-titlebtn mcp-art-link", onClick: () => gs.go(g.route) }, g.name),
        blurb: gsKeepLast(g.blurb),
        tags: /* @__PURE__ */ React$1.createElement(GsTagList, { tags: cprTags(id), ed: g.ed })
      }
    );
  };
  const CprHomeLine = () => {
    const gs = useGs();
    const c = cprPassLine();
    return /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, c.p1.replace(/ with your account\. $/, " free. "), c.p1 ? "Everything else" : "Everything", " with ", /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "gs-inlink", onClick: () => gs.go("pass") }, "the Pass"), ".");
  };
  const cprMix = (ids) => {
    const ground = (k) => (GS_ART[GS_GAMES[k].art] || {}).ground;
    const out = [];
    const used = ids.map(() => false);
    const ok = (k, i) => !(i % 4 && ground(out[i - 1]) === ground(k) || i >= 4 && ground(out[i - 4]) === ground(k));
    const fill = (i) => {
      if (i === ids.length) return true;
      for (let j = 0; j < ids.length; j++) if (!used[j] && ok(ids[j], i)) {
        used[j] = true;
        out[i] = ids[j];
        if (fill(i + 1)) return true;
        used[j] = false;
      }
      return false;
    };
    return fill(0) ? out.slice() : ids;
  };
  let CPR_MOSAIC;
  const CprPassCard = () => {
    const gs = useGs();
    const host = useGsArtHost();
    const go = () => gs.go("pass");
    return /* @__PURE__ */ React$1.createElement(
      DS.GameCard,
      {
        className: "mcp-art-host gs-host cpr-pcard",
        art: /* @__PURE__ */ React$1.createElement("div", { ref: host, className: "cpr-mosaic", "aria-hidden": "true", onClick: go }, CPR_MOSAIC.map((k) => /* @__PURE__ */ React$1.createElement(GsArt, { key: k, art: GS_GAMES[k].art, shape: "square" }))),
        title: /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "gs-titlebtn mcp-art-link", onClick: go }, /* @__PURE__ */ React$1.createElement(DS.Icon, { name: "lock", size: 18, className: "cpr-lock" }), "The Pass", /* @__PURE__ */ React$1.createElement("span", { className: "cpr-chev", "aria-hidden": "true" }, /* @__PURE__ */ React$1.createElement(DS.Icon, { name: "down", size: 18, style: { transform: "rotate(-90deg)" } }))),
        blurb: "Every game, every edition.",
        tags: /* @__PURE__ */ React$1.createElement("span", { className: "cpr-price" }, /* @__PURE__ */ React$1.createElement("span", null, GS_PLAN.monthly.price), " or ", /* @__PURE__ */ React$1.createElement("span", null, GS_PLAN.yearly.price))
      }
    );
  };
  const GsHome = () => {
    const gs = useGs();
    const field = React$1.useRef(null);
    React$1.useEffect(() => {
      const f = field.current;
      if (!f) return void 0;
      const on = (e) => {
        if (e.pointerType !== "mouse" && e.target.closest(".gs-hero-name, .gs-hero-shapes4")) f.classList.add("is-on");
      };
      const off = () => f.classList.remove("is-on");
      const ends = ["pointerup", "pointercancel", "pointerleave"];
      f.addEventListener("pointerdown", on);
      ends.forEach((t) => f.addEventListener(t, off));
      return () => {
        f.removeEventListener("pointerdown", on);
        ends.forEach((t) => f.removeEventListener(t, off));
      };
    }, []);
    return /* @__PURE__ */ React$1.createElement("main", { className: "gs-wrap gs-main gs-home" }, /* @__PURE__ */ React$1.createElement("section", { className: "gs-hero3" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-hero-copy" }, /* @__PURE__ */ React$1.createElement("h1", { className: "gs-h1 gs-h1-home" }, /* @__PURE__ */ React$1.createElement("span", null, "Your AI does the talking."), " ", /* @__PURE__ */ React$1.createElement("span", null, "The game keeps the score.")), /* @__PURE__ */ React$1.createElement("p", { className: "gs-hero-sub" }, "Play small games by talking to Claude or ChatGPT. The game holds the rules, the dice and your record."), /* @__PURE__ */ React$1.createElement("div", { className: "gs-hero-act" }, /* @__PURE__ */ React$1.createElement(DS.Button, { onClick: gs.startFree }, "Start free"), /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "secondary", onClick: gs.goHow }, "See how it works")), /* @__PURE__ */ React$1.createElement("div", { className: "gs-works" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-label" }, "WORKS WITH"), /* @__PURE__ */ React$1.createElement("p", { className: "gs-muted" }, GS.works))), /* @__PURE__ */ React$1.createElement("div", { className: "gs-hero-field", ref: field }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-hero-shapes4", "aria-hidden": "true", onClick: () => gs.go(GS_GAMES.casebook.route) }, /* @__PURE__ */ React$1.createElement("i", { style: { background: "#D66847", "--h": "62%", "--rise": "12px" } }), /* @__PURE__ */ React$1.createElement("i", { style: { background: "#A390B2", "--h": "86%", "--rise": "6px" } }), /* @__PURE__ */ React$1.createElement("i", { style: { background: "#F2EBE0", "--h": "66%", "--rise": "18px" } }), /* @__PURE__ */ React$1.createElement("b", null)), /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "gs-hero-name", onClick: () => gs.go(GS_GAMES.casebook.route) }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-label" }, "A NEW CASE EVERY WEEK"), /* @__PURE__ */ React$1.createElement("span", { className: "gs-hero-name-t" }, GS_NAME.casebook, " ", /* @__PURE__ */ React$1.createElement(DS.Icon, { name: "down", size: 20, style: { transform: "rotate(-90deg)" } }))), /* @__PURE__ */ React$1.createElement(DS.ChatPlayback, { turns: GS_HERO_CHAT, loop: true, mark: GS_CHAT_MARK, toolBy: GS_CHAT_BY, height: 340, width: 480, label: "A Casebook case being played in a chat" }))), /* @__PURE__ */ React$1.createElement("section", { className: "gs-band" }, /* @__PURE__ */ React$1.createElement(DS.CardRow, { title: "Available games", sub: /* @__PURE__ */ React$1.createElement(CprHomeLine, null), className: "gs-row4" }, [/* @__PURE__ */ React$1.createElement(CprPassCard, { key: "pass" }), ...GS_HOME_GAMES.map((k) => /* @__PURE__ */ React$1.createElement(GsFeature, { key: k, id: k }))]), /* @__PURE__ */ React$1.createElement("div", { className: "gs-grid2" }, GS_SOON.map((g) => /* @__PURE__ */ React$1.createElement(GsSoonCard, { key: g.name, g }))), /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-sm" }, /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement(DS.TextLink, { onClick: () => gs.go("games") }, "All games")), /* @__PURE__ */ React$1.createElement("p", { className: "gs-small gs-pu-wrap" }, GS.purchase))), /* @__PURE__ */ React$1.createElement(GsWhatsNew, null));
  };
  function initGsPassHome() {
    CPR_MOSAIC = cprMix(CPR_SHOWN.filter((k) => CPR_STAGE[k] === "pass").map((k) => k === "salvage" ? "word" : k).slice(0, 8));
  }
  const GsFeature = ({ id }) => /* @__PURE__ */ React$1.createElement(GsCard, { id });
  const GS_HOME_GAMES = ["word", "mystery", "escape", "delve", "barrow", "hunter"];
  const GS_WHATSNEW = [
    { v: "1.9", d: "1 October 2026", t: "Copy any result as text", x: "You can copy any finished result as text and paste it anywhere. The full record of rolls, guesses and statements stays on its session page." },
    { v: "1.8", d: "24 September 2026", t: "Streaks carry across devices", x: "Your daily streak and record now follow your account, so they stay intact wherever you connect your AI." },
    { v: "1.7", d: "10 September 2026", t: "Connect in under two minutes", x: "A single link now connects Claude, ChatGPT and other MCP assistants. No settings to copy between apps." },
    { v: "1.6", d: "27 August 2026", t: "Every play, in History", x: "History lists every play under the day you played it. Find one by its name, number or date." },
    { v: "1.5", d: "13 August 2026", t: "Faster results after each play", x: "The result and record appear as soon as the last turn is made." },
    { v: "1.4", d: "30 July 2026", t: "Account page", x: "Manage your username, email, password, card and Pass from one place." },
    { v: "1.3", d: "16 July 2026", t: "History view", x: "Look back over every play, grouped by day and by game." },
    { v: "1.2", d: "2 July 2026", t: "Search and filters in the library", x: "Find a game by name, genre or how often it releases." },
    { v: "1.1", d: "18 June 2026", t: "Free daily puzzles", x: "Today’s Daily Puzzles are free with an account." }
  ];
  const GsWhatsNew = () => {
    const row = (e, i) => /* @__PURE__ */ React$1.createElement("li", { key: e.v, className: "wn-e" + (i === 0 ? " is-latest" : "") }, /* @__PURE__ */ React$1.createElement("div", { className: "wn-body" }, /* @__PURE__ */ React$1.createElement("h3", { className: "wn-t" }, e.t), /* @__PURE__ */ React$1.createElement("p", { className: "wn-d" }, e.x)), /* @__PURE__ */ React$1.createElement("div", { className: "wn-meta" }, /* @__PURE__ */ React$1.createElement("time", null, e.d)));
    const now = GS_WHATSNEW.slice(0, 3), earlier = GS_WHATSNEW.slice(3);
    return /* @__PURE__ */ React$1.createElement("section", { className: "gs-band", "aria-labelledby": "gs-wn-h" }, /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-sec", id: "gs-wn-h" }, "What’s new"), /* @__PURE__ */ React$1.createElement("div", { className: "wn-panel" }, /* @__PURE__ */ React$1.createElement("ul", { className: "wn-list has-fold" }, now.map(row), /* @__PURE__ */ React$1.createElement("li", { className: "wn-e wn-foldrow" }, /* @__PURE__ */ React$1.createElement("details", null, /* @__PURE__ */ React$1.createElement("summary", { className: "wn-sum" }, /* @__PURE__ */ React$1.createElement("span", { className: "wn-caret" }, /* @__PURE__ */ React$1.createElement(DS.Icon, { name: "down", size: 16, style: { transform: "rotate(-90deg)" } })), "earlier updates"), /* @__PURE__ */ React$1.createElement("div", { className: "wn-wrap", tabIndex: 0, role: "region", "aria-label": "Earlier updates" }, /* @__PURE__ */ React$1.createElement("ul", { className: "wn-nest" }, earlier.map((e) => row(e, -1)))))))));
  };
  const cbMake = (id, week, month, title, played2, verdict, total, rec) => {
    const turns = rec.filter((r) => r.c !== "A");
    const lies = turns.filter((r) => r.c === "B").length;
    return { id, week, month, title, played: played2, live: played2 && !verdict, verdict, total, turns: turns.length, lies, searched: turns.filter((r) => r.c === "F").length, seq: turns.map((r) => r.c).join(""), rec };
  };
  const CB_ID = "gull";
  const CB_TITLE = "The Last Night at Gull Point";
  const CB_CAST = ["Maeve Doyle", "Tobias Pike", "Dr. Celia Rourke"];
  let CB_DONE;
  let CB_LIVE;
  let CB_ALL;
  const cbRight = (p) => p.src.verdict === "right";
  let CB_ACH;
  let CB_BADGES;
  const cbLies = (n) => n === 1 ? "1 lie exposed" : n + " lies exposed";
  const cbShareLines = (c) => ["Casebook: " + c.title, (c.verdict === "right" ? "✅ solved" : "❌ wrong accusation") + " · " + c.turns + " of 16 turns · " + cbLies(c.lies), gsLink("casebook")];
  const cbRecap = (c) => c.live ? "You’ve used " + c.turns + " of 16 turns and exposed " + (c.lies === 1 ? "1 lie" : c.lies + " lies") + ". You haven’t named the killer yet." : "You used " + c.turns + " of 16 turns and exposed " + c.lies + " of " + c.total + " lies.";
  function initGsCasebookData() {
    CB_DONE = { ...cbMake(CB_ID, "5 October", "October", CB_TITLE, true, "right", 4, GS_CB_REC), cast: CB_CAST, places: 4 };
    CB_LIVE = { ...cbMake(CB_ID, "5 October", "October", CB_TITLE, true, null, 4, GS_CB_REC.filter((r) => r.c !== "A").slice(0, 6)), cast: CB_CAST };
    CB_ALL = [CB_LIVE];
    CB_ACH = [
      { k: "first", n: "First lie exposed", how: "Expose a suspect’s lie with proof.", first: true, by: (p) => p.src.lies >= 1 },
      { k: "solved", n: "Case solved", how: "Name the killer.", first: true, by: cbRight },
      { k: "eleven", n: "Solved in eleven turns", how: "Name the killer using eleven turns or fewer.", first: true, by: (p) => cbRight(p) && p.src.turns <= 11 },
      { k: "every", n: "Every lie exposed", how: "Expose every lie in one case.", first: true, by: (p) => p.src.lies === p.src.total },
      { k: "rooms", n: "Every room searched", how: "Search every place in one case.", first: true, by: (p) => p.src.searched >= p.src.places },
      { k: "quick", n: "Solved in eight turns", how: "Name the killer using eight turns or fewer.", first: true, by: (p) => cbRight(p) && p.src.turns <= 8 },
      { k: "five", n: "Five cases solved", how: "Solve five cases.", of: 5, count: (ps) => ps.filter(cbRight) },
      { k: "ten", n: "Ten cases solved", how: "Solve ten cases.", of: 10, count: (ps) => ps.filter(cbRight) }
    ];
    CB_BADGES = {
      first: ["#1D1B3A", [["path", 'd="M7 40L21 12L35 40Z"', "#F2EBE0"], ["rect", 'x="28" y="7" width="13" height="13"', "#D66847"]]],
      solved: ["#163328", [["circle", 'cx="24" cy="20" r="11"', "#4CC38A"], ["rect", 'x="10" y="36" width="28" height="5"', "#F2EBE0"]]],
      eleven: ["#1D1B3A", [["rect", 'x="7" y="28" width="7" height="13"', "#328A88"], ["rect", 'x="17" y="20" width="7" height="21"', "#328A88"], ["rect", 'x="27" y="12" width="7" height="29"', "#328A88"], ["circle", 'cx="40" cy="9" r="4"', "#F2EBE0"]]],
      every: ["#421A28", [["path", 'd="M7 41V17A24 24 0 0 1 31 41Z"', "#E5A63B"], ["rect", 'x="33" y="7" width="8" height="8"', "#A390B2"], ["rect", 'x="33" y="19" width="8" height="8"', "#A390B2"]]],
      five: ["#163328", [5, 13, 21, 29, 37].map((x) => ["rect", 'x="' + x + '" y="12" width="5" height="24"', "#E5A63B"])],
      quick: ["#163328", [["path", 'd="M8 38L24 10L40 38Z"', "#D66847"], ["circle", 'cx="38" cy="10" r="4"', "#F2EBE0"]]],
      ten: ["#421A28", [7, 15, 23, 31, 39].flatMap((x) => [["rect", 'x="' + (x - 3) + '" y="14" width="6" height="8"', "#F2EBE0"], ["rect", 'x="' + (x - 3) + '" y="26" width="6" height="8"', "#E5A63B"]])],
      rooms: ["#163328", [["circle", 'cx="20" cy="20" r="11"', "#328A88"], ["rect", 'x="29" y="29" width="12" height="12"', "#F2EBE0"]]]
    };
  }
  const GS_LIBRARY = {};
  const GS_EDITIONS = {};
  const GS_SESSION_BODY = {};
  const GS_NOW = {};
  const cbGo = (gs, sid) => gs.go("casebook", sid ? { page: "record", sid } : { page: "record" });
  const cbWeek = (gs) => lbWeekDone(gs) ? CB_DONE : CB_LIVE;
  let CB_FIRST;
  const cbFirstOf = (gs) => {
    const st = phFirstSt ? phFirstSt(gs, "casebook") : "done";
    if (st === "none") return null;
    return st === "live" ? CB_LIVE : CB_DONE;
  };
  const cbStatus = (c) => !c.played ? { kind: "none", label: "Not played" } : c.live ? { kind: "live", label: "In progress" } : { kind: c.verdict === "right" ? "ok" : "bad", label: GS_RESULT.casebook({ ok: c.verdict === "right" }) };
  let CB_KINDS;
  const cbCap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const CbOut = ({ r }) => {
    if (r.act === "Show evidence") return /* @__PURE__ */ React$1.createElement("span", { className: "lb-out" + (r.c === "B" ? " is-hit" : "") }, r.out);
    if (r.act === "Search") return /* @__PURE__ */ React$1.createElement("span", { className: "lb-out" + (r.c === "F" ? " is-found" : "") }, r.out);
    return null;
  };
  const CbCase = ({ c }) => {
    const gs = useGs();
    const rec = c.rec.map((r, i) => ({ ...r, n: i + 1 }));
    const acc = rec.find((r) => r.c === "A");
    const ed = edList(gs, "casebook").find((x) => x.key === String(c.id));
    const share = !c.live && /* @__PURE__ */ React$1.createElement(LbShare, { lines: cbShareLines(c) });
    const acts = c.live ? /* @__PURE__ */ React$1.createElement(DS.Button, { onClick: () => gs.playReq({ kind: "edition", e: ed }) }, "Play") : share || null;
    return /* @__PURE__ */ React$1.createElement("main", { className: "gs-wrap gs-main" }, /* @__PURE__ */ React$1.createElement(LbBackTo, { gid: "casebook" }), /* @__PURE__ */ React$1.createElement("div", { className: "lb-top" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-xs" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-label" }, "A CASE"), /* @__PURE__ */ React$1.createElement("h1", { className: "gs-h1" }, c.title)), acts && /* @__PURE__ */ React$1.createElement("div", { className: "gs-pairwrap" }, acts)), !c.live && /* @__PURE__ */ React$1.createElement("p", { style: { margin: 0 } }, GS_ONCE_LINE), /* @__PURE__ */ React$1.createElement("section", { className: "lb-card" }, /* @__PURE__ */ React$1.createElement("dl", { className: "lb-figs" }, /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement("dt", null, "Result"), /* @__PURE__ */ React$1.createElement("dd", null, /* @__PURE__ */ React$1.createElement(LbResult, { s: cbStatus(c) }))), /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement("dt", null, "Turns used"), /* @__PURE__ */ React$1.createElement("dd", null, c.turns, /* @__PURE__ */ React$1.createElement("span", { className: "lb-of" }, " of 16"))), /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement("dt", null, "Lies exposed"), /* @__PURE__ */ React$1.createElement("dd", null, c.lies, !c.live && /* @__PURE__ */ React$1.createElement("span", { className: "lb-of" }, " of " + c.total))), /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement("dt", null, "You accused"), /* @__PURE__ */ React$1.createElement("dd", null, acc ? acc.what : /* @__PURE__ */ React$1.createElement("span", { className: "lb-of" }, "No one yet"))))), /* @__PURE__ */ React$1.createElement("div", { className: "lb-kinds" }, CB_KINDS.map(([act, name]) => {
      const rs = rec.filter((r) => r.act === act);
      return /* @__PURE__ */ React$1.createElement("section", { key: act, className: "lb-box" }, /* @__PURE__ */ React$1.createElement("div", { className: "lb-kindhead" }, /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-card" }, name), /* @__PURE__ */ React$1.createElement("span", { className: "gs-muted" }, rs.length === 1 ? "1 turn" : rs.length + " turns")), rs.length ? /* @__PURE__ */ React$1.createElement("ol", { className: "lb-turns" }, rs.map((r) => /* @__PURE__ */ React$1.createElement("li", { key: r.n }, /* @__PURE__ */ React$1.createElement("span", { className: "lb-tn" }, "Turn " + r.n), /* @__PURE__ */ React$1.createElement("span", { className: "gs-stack-xs" }, /* @__PURE__ */ React$1.createElement("span", null, cbCap(r.what)), /* @__PURE__ */ React$1.createElement(CbOut, { r }))))) : /* @__PURE__ */ React$1.createElement("p", { className: "lb-none gs-muted" }, "You haven’t taken one of these yet."));
    })));
  };
  const CbLibrary = () => {
    const gs = useGs();
    const access = lbAccess(gs, "casebook");
    const pass = access === "all";
    const sid = gs.route.sid;
    const k = gs.view + (gs.sub.hadPass ? "u" : "") + (lbWeekDone(gs) ? "d" : "");
    const c = sid && (!pass && sid === CB_FIRST.id ? cbFirstOf(gs) : pass && sid === CB_LIVE.id ? cbWeek(gs) : null);
    if (c) return /* @__PURE__ */ React$1.createElement(CbCase, { key: k + sid, c });
    const ach = phAch(gs, "casebook", CB_ACH);
    return /* @__PURE__ */ React$1.createElement("main", { key: k, className: "gs-wrap gs-main" }, /* @__PURE__ */ React$1.createElement(LbHead, { id: "casebook" }), /* @__PURE__ */ React$1.createElement("div", { className: "lb-lay" }, pass ? gsFresh(gs) ? /* @__PURE__ */ React$1.createElement(LbFreshNow, { gid: "casebook", title: CB_LIVE.title, line: "You haven’t opened the case yet. Ask the question they haven’t prepared for.", span: true, onPlay: () => gs.play(GS_NAME.casebook) }) : /* @__PURE__ */ React$1.createElement(CbNow, { c: cbWeek(gs) }) : null, /* @__PURE__ */ React$1.createElement(LbAch, { items: ach, badges: CB_BADGES, access, ed: GS_GAMES.casebook.ed }), /* @__PURE__ */ React$1.createElement(LbRecent, { title: "Your cases", allLabel: "See in History", empty: "Your cases appear here once you have played one." })));
  };
  const registerCasebook = () => {
    GS_LIBRARY.casebook = CbLibrary;
    GS_EDITIONS.casebook = (gs) => edRuns(gs, "casebook", { all: CB_ALL, done: CB_DONE, status: cbStatus, openCur: (g, x) => cbGo(g, x.id), open: (g, x) => cbGo(g, x.id) });
  };
  function initGsCasebook() {
    CB_FIRST = CB_DONE;
    CB_KINDS = [["Show evidence", "Evidence shown"], ["Search", "Searches"], ["Question", "Questions"]];
  }
  let BW_CH1;
  let BW_CH2;
  let BW_T1;
  let BW_T2;
  let BW_REC1;
  const bwEds = (gs) => {
    const out = gs.view === "out";
    const plays = out || !phVisible ? [] : phVisible(gs).filter((p) => p.gid === "barrow");
    const st = (key) => {
      const p = plays.find((x) => x.ed === key);
      return out ? null : p ? p.status : { kind: "none", label: "Not played" };
    };
    const open = (key) => {
      const p = plays.find((x) => x.ed === key);
      return p ? () => p.open(gs) : null;
    };
    return [
      { key: "bw2", gid: "barrow", n: 2, title: BW_T2, date: "", nodate: true, month: "October", free: false, now: true, status: st("bw2"), open: open("bw2") },
      { key: "bw1", gid: "barrow", n: 1, title: BW_T1, date: "", nodate: true, month: "October", free: true, now: false, status: st("bw1"), open: open("bw1") }
    ];
  };
  const registerBarrowLibrary = () => {
    GS_EDITIONS.barrow = bwEds;
  };
  let CPR_BW_JOURNAL;
  let BW_ACH;
  let BW_BADGES;
  function initGsBarrowLibrary() {
    BW_CH1 = { title: GS_PAGES.barrow.week.title, line: GS_PAGES.barrow.week.line };
    BW_CH2 = { title: GS_PAGES.barrow.week2.title, line: GS_PAGES.barrow.week2.line };
    BW_T1 = "The Barrow of Hollowmere";
    BW_T2 = "The Barrow of Hollowmere — Chapter 2: The Abbey on the Mere";
    BW_REC1 = { earns: ["seal", "deep"] };
    CPR_BW_JOURNAL = [
      [1, "Wren the Rogue took up Elder Maud’s quest: Recover the Bell of Hollowmere from the barrow and bring it home to the village."],
      [1, "Reached St. Ebba’s churchyard."],
      [1, "Took the Storm lantern."],
      [1, "Forced a way through the lodge door."],
      [1, "Reached The sexton’s lodge."],
      [1, "Took the Iron key."],
      [1, "Rested and recovered. Session 1 ended."],
      [2, "Reached Whisperwood."],
      [2, "Defeated Grey wolf in Whisperwood."],
      [2, "Defeated Grey wolf in Whisperwood."],
      [2, "Reached The barrow mound."],
      [2, "Opened the barrow door with the Iron key."],
      [2, "Rested and recovered. Session 2 ended."],
      [3, "Reached The barrow hall."],
      [3, "Defeated Barrow skeleton in The barrow hall."],
      [3, "Defeated Barrow skeleton in The barrow hall."],
      [3, "Reached The wight’s crypt."],
      [3, "Defeated The barrow wight in The wight’s crypt."],
      [3, "Wren reached level 2."],
      [3, "Took the Bell of Hollowmere."],
      [3, "Rang the Bell of Hollowmere in the chapel tower again. The mist drew back from the marsh. Quest complete."]
    ];
    GS_SESSIONS["gs-pu-barrow-ch1"] = {
      kind: "chapter",
      gid: "barrow",
      edKey: "bw1",
      game: GS_GAMES.barrow.name,
      art: "barrow",
      result: "Quest complete",
      figures: ["3 sessions", "Level 2"],
      listTitle: "The story",
      lines: CPR_BW_JOURNAL.map(([n, t]) => ["Session " + n, t]),
      share: "Quest complete",
      shareLines: ["Adventure: The Barrow of Hollowmere", "Wren the Rogue, level 2 · ✅ Bell returned · 3 sessions"],
      credit: true
    };
    BW_ACH = [
      { k: "seal", n: "Into the barrow", how: "Open the barrow door.", first: true, by: (p) => p.src.earns.includes("seal") },
      { k: "deep", n: "The wight’s crypt", how: "Reach the wight’s crypt.", first: true, by: (p) => p.src.earns.includes("deep") },
      { k: "unhurt", n: "Out without a scratch", how: "Finish Chapter 1 with full HP.", first: true, by: (p) => p.src.earns.includes("unhurt") }
    ];
    BW_BADGES = lbAutoBadges(BW_ACH);
  }
  const gsKind = (c) => c.charAt(0) + c.slice(1).toLowerCase();
  const gsKinds = () => GS_GAME_ORDER.map((k) => GS_GAMES[k].category).filter((c, i, a) => a.indexOf(c) === i);
  const gsFind = (q, k) => {
    const s = gsNorm(q);
    return !s || gsNorm(GS_GAMES[k].name).includes(s);
  };
  let GS_ADDED;
  let GS_LIB_READY;
  function initGsDiscover() {
    GS_ADDED = ["barrow", "casebook", "delve", "escape"];
    GS_LIB_READY = { barrow: "Chapter 1 is ready", word: "Today’s word is ready", groups: "Today’s groups are ready", mystery: "Today’s case is ready", where: "Today’s country is ready", chain: "Today’s chain is ready", salvage: "Today’s sea is ready", escape: "This week’s room is ready", hunter: "Today’s hunt is ready" };
  }
  const ES_SIDS = { under: "escape-week", par: "escape-par", over: "escape-over", hard: "escape-hard" };
  const esFinished = (gs) => gsEdPick("escape", gs) || ES_SIDS[gs.review.escape] || "escape-week";
  const esSid = (gs) => gs.review.week === "live" ? "escape-live" : esFinished(gs);
  const esPlural = (n, a, b) => n + " " + (n === 1 ? a : b);
  const esBuild = (s) => {
    const t = s.esTimes || null;
    const live = !!s.live || !t;
    const parts = s.esParts || {};
    const byKey = {};
    const locks = [];
    let moves = 0;
    let wrong = 0;
    const lockFor = (name) => {
      const k = String(name).toLowerCase().replace(/^the\s+/, "").trim();
      if (!byKey[k]) byKey[k] = { key: k, name: "The " + k, short: k.charAt(0).toUpperCase() + k.slice(1), tries: 0, hints: 0, rows: [] };
      return byKey[k];
    };
    (s.lines || []).forEach(([label, what = "", res = ""]) => {
      const mv = /^Move (\d+)$/.exec(label);
      if (label === "Hint") {
        const lk2 = lockFor(what);
        lk2.hints = Math.min(3, lk2.hints + 1);
        lk2.rows.push({ k: "hint", rung: lk2.hints });
        return;
      }
      if (!mv) return;
      moves += 1;
      const n = Number(mv[1]);
      let m;
      let lk;
      let kind;
      let slots;
      if (m = /^Tried (\S+) on (.+)$/.exec(what)) {
        lk = lockFor(m[2]);
        kind = "typed";
        slots = m[1].length;
      } else if (m = /^Set (the .+?): /.exec(what)) {
        lk = lockFor(m[1]);
        kind = "mech";
        slots = GS_ES_PARTS[lockFor(m[1]).key] || 2;
      }
      if (!lk) return;
      const ok = !(res === "Wrong" || /^\d+ of \d+ .* into place\.$/.test(res));
      lk.tries += 1;
      if (!ok) wrong += 1;
      const lit = ok ? slots : kind === "mech" && parts[n] ? parts[n][0] : 0;
      lk.rows.push({ k: "try", n, kind, slots, lit, ok });
      if (ok) {
        lk.exit = res === "Out";
        lk.index = locks.push(lk);
        lk.closed = GS_ES1_CLOSED[lk.key] || null;
      }
    });
    const at = live ? GS_SESSIONS["escape-week"].esTimes.opened : t.opened;
    locks.forEach((lk, i) => {
      lk.minute = at[i];
    });
    const par = GS_ES1_PAR;
    const min = live ? null : t.min;
    return {
      live,
      min,
      par,
      over: !live && min > par,
      locks,
      moves,
      wrong,
      hints: locks.reduce((a, l) => a + l.hints, 0),
      end: live ? locks.length ? locks[locks.length - 1].minute : 0 : min
    };
  };
  const esFacts = (l) => [l.tries <= 1 ? "First try" : l.tries + " tries", l.hints ? esPlural(l.hints, "hint", "hints") : null, l.exit && l.closed ? l.closed + " closed" : null].filter(Boolean).join(" · ");
  const esFigs = (m) => m.live ? [esPlural(m.locks.length, "lock", "locks") + " open", esPlural(m.moves, "move", "moves") + " so far"] : [esPlural(m.moves, "move", "moves"), m.hints ? esPlural(m.hints, "hint", "hints") : "No hints", m.wrong ? esPlural(m.wrong, "wrong try", "wrong tries") : "No wrong tries"];
  const esSpare = (m) => m.over ? m.min - m.par + " min over par" : m.min === m.par ? "On par" : m.par - m.min + " min under par";
  const esWord = (r) => r.ok ? "Open" : r.kind === "mech" ? r.lit + " of " + r.slots : "Wrong";
  const EsDoor = ({ w = 12, h = 20 }) => /* @__PURE__ */ React$1.createElement("span", { className: "es-door", "aria-hidden": "true", style: { width: w, height: h } }, /* @__PURE__ */ React$1.createElement("i", null));
  const EsOpen = ({ w, h }) => /* @__PURE__ */ React$1.createElement("span", { className: "es-od", style: { width: w, height: h }, "aria-hidden": "true" }, /* @__PURE__ */ React$1.createElement("i", null, /* @__PURE__ */ React$1.createElement("b", null)));
  const EsNum = ({ n, size = 24 }) => /* @__PURE__ */ React$1.createElement("span", { className: "es-num", style: { "--n": size + "px" }, "aria-hidden": "true" }, n);
  const EsMark = ({ r, size }) => /* @__PURE__ */ React$1.createElement("span", { className: "es-mk" + (r.ok ? " is-on" : ""), style: { "--t": size + "px" }, "aria-hidden": "true" }, r.kind === "mech" && !r.ok ? Array.from({ length: r.slots }, (_, j) => /* @__PURE__ */ React$1.createElement("i", { key: j, className: j < r.lit ? "is-on" : "" })) : null);
  const useEsWidth = (ref) => {
    const [w, setW] = React$1.useState(0);
    React$1.useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return void 0;
      const f = () => setW(Math.floor(el.getBoundingClientRect().width));
      f();
      const ro = new ResizeObserver(f);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);
    return w;
  };
  const esCanvas = document.createElement("canvas");
  const esMeasure = (text, font) => {
    const c = esCanvas.getContext("2d");
    c.font = font;
    return Math.ceil(c.measureText(text).width);
  };
  const ES_FONT = '"Hanken Grotesk", system-ui, sans-serif';
  const esRows = (items) => {
    const ends = [];
    return items.map((it) => {
      let r = 0;
      while (ends[r] != null && ends[r] + 12 > it.l) r += 1;
      ends[r] = it.l + it.w;
      return r;
    });
  };
  const EsLine = ({ m, sel, onSel, card }) => {
    const ref = React$1.useRef(null);
    const W = useEsWidth(ref);
    const [hov, setHov] = React$1.useState(null);
    const hp = (k) => ({ onMouseEnter: () => setHov(k), onMouseLeave: () => setHov((h) => h === k ? null : h), onFocus: () => setHov(k), onBlur: () => setHov((h) => h === k ? null : h) });
    const [BAR, OH, DW, NUM, ROW] = card ? [20, 6, 12, 20, 24] : [28, 8, 14, 24, 32];
    const TOP = 20;
    const R = 10;
    const inner = W - R;
    const parText = "Par " + m.par + " min";
    const parW = esMeasure(parText, "400 13px " + ES_FONT);
    const outText = "Out " + m.min + " min";
    const outW = esMeasure(outText, "600 14px " + ES_FONT) + 8;
    const end = m.end;
    const fit = (t, w) => t * inner / Math.max(1, W - w / 2 - 2);
    const span = Math.max(Math.max(end || 0, m.par) + (m.live ? 3 : 0), fit(m.par, parW), m.live ? 0 : fit(m.min, outW));
    const x = (t) => Math.round(t / span * inner);
    const barT = TOP + 6 + OH;
    const barB = barT + BAR;
    const parX = x(m.par);
    const endX = x(end);
    const onPar = !m.live && m.min === m.par;
    const GAP = 32;
    const dx = m.locks.map((lk) => x(lk.minute));
    const nd = dx.length;
    if (nd > 1 && dx.some((c, i) => i && c - dx[i - 1] < GAP)) {
      const t0 = m.locks[0].minute;
      const tl = m.locks[nd - 1].minute;
      const k = (dx[nd - 1] - dx[0] - GAP * (nd - 1)) / Math.max(1, tl - t0);
      if (k >= 0) {
        const x0 = dx[0];
        m.locks.forEach((lk, i) => {
          dx[i] = Math.round(x0 + GAP * i + (lk.minute - t0) * k);
        });
      } else {
        for (let i = 1; i < nd; i += 1) dx[i] = Math.max(dx[i], dx[i - 1] + GAP);
      }
    }
    const labs = m.locks.map((lk, i) => {
      const out = lk.exit && !m.live;
      const w = out ? outW : NUM;
      return { lk, xx: dx[i], w, l: Math.max(0, Math.min(dx[i] - w / 2, W - w)), out };
    });
    const ls = labs.slice().sort((a, b) => a.l - b.l);
    esRows(ls).forEach((r, i) => {
      ls[i].r = r;
    });
    const nRows = labs.length ? Math.max(...labs.map((b) => b.r)) + 1 : 1;
    const labT = barB + OH + 8;
    const H = labT + nRows * ROW;
    const label = m.live ? "In progress. " + esPlural(m.locks.length, "lock", "locks") + " open." : "Out at minute " + m.min + ", par " + m.par + ".";
    return /* @__PURE__ */ React$1.createElement("div", { className: "es-line" + (card ? " is-card" : ""), ref, style: { height: H }, "aria-label": label, role: "group" }, W > 0 && /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("span", { className: "es-ptxt", style: { left: Math.round(parX - parW / 2), top: 0 } }, parText), /* @__PURE__ */ React$1.createElement("span", { className: "es-ptk", style: { left: parX - 1, top: TOP, height: onPar ? Math.max(2, barT - OH - TOP - 10) : barT - TOP - 2 } }), !onPar && /* @__PURE__ */ React$1.createElement("span", { className: "es-ptk", style: { left: parX - 1, top: barB + 2, height: OH + 2 } }), /* @__PURE__ */ React$1.createElement("span", { className: "es-track", style: { top: barT, height: BAR, width: inner } }), /* @__PURE__ */ React$1.createElement("span", { className: "es-fill", style: { top: barT, height: BAR, width: m.over ? parX : endX } }), m.over && /* @__PURE__ */ React$1.createElement("span", { className: "es-fill is-over", style: { top: barT, height: BAR, left: parX, width: endX - parX } }), m.live && /* @__PURE__ */ React$1.createElement("span", { className: "es-edge", style: { top: barT - 4, height: BAR + 8, left: endX - 1 } }), m.locks.map((lk, i) => {
      const out = lk.exit && !m.live;
      return /* @__PURE__ */ React$1.createElement(
        "button",
        {
          key: lk.key,
          type: "button",
          className: "es-dr" + (sel === lk.key ? " is-sel" : "") + (hov === lk.key ? " is-hov" : ""),
          ...hp(lk.key),
          style: { left: dx[i] - GAP / 2, width: GAP, top: barT - OH, height: BAR + OH * 2 },
          "aria-pressed": card ? void 0 : sel === lk.key,
          "aria-label": lk.name + (m.live ? "" : ", minute " + lk.minute),
          onClick: () => onSel(lk.key)
        },
        out ? /* @__PURE__ */ React$1.createElement(EsOpen, { w: DW, h: BAR + OH * 2 }) : /* @__PURE__ */ React$1.createElement(EsDoor, { w: DW, h: BAR + OH * 2 })
      );
    }), labs.map((b) => {
      const top = labT + b.r * ROW;
      return /* @__PURE__ */ React$1.createElement(React$1.Fragment, { key: b.lk.key }, b.r > 0 && /* @__PURE__ */ React$1.createElement("span", { className: "es-lead", style: { left: b.xx, top: barB + OH, height: top - barB - OH } }), /* @__PURE__ */ React$1.createElement(
        "button",
        {
          type: "button",
          className: "es-lab" + (b.out ? " is-out" : "") + (sel === b.lk.key ? " is-sel" : "") + (hov === b.lk.key ? " is-hov" : ""),
          ...hp(b.lk.key),
          style: { left: b.l, top, width: b.w, height: NUM },
          "aria-hidden": "true",
          tabIndex: -1,
          onClick: () => onSel(b.lk.key)
        },
        b.out ? outText : /* @__PURE__ */ React$1.createElement(EsNum, { n: b.lk.index, size: NUM })
      ));
    })));
  };
  const EsResult = ({ m, card }) => /* @__PURE__ */ React$1.createElement("div", { className: "es-res" + (card ? " is-card" : "") }, m.live ? /* @__PURE__ */ React$1.createElement(EsDoor, { w: card ? 20 : 40, h: card ? 34 : 68 }) : /* @__PURE__ */ React$1.createElement(EsOpen, { w: card ? 20 : 40, h: card ? 34 : 68 }), /* @__PURE__ */ React$1.createElement("div", { className: "es-rest" }, /* @__PURE__ */ React$1.createElement("div", { className: "es-resh" }, card ? /* @__PURE__ */ React$1.createElement("p", { className: "es-h" }, m.live ? "Still inside" : "Escaped") : /* @__PURE__ */ React$1.createElement("h2", { className: "es-h" }, m.live ? "Still inside" : "Escaped"), !m.live && /* @__PURE__ */ React$1.createElement("p", { className: "gs-vd is-" + (m.over ? "over" : "ok") }, /* @__PURE__ */ React$1.createElement(DS.Icon, { name: m.over ? "close" : "check", size: 20 }), esSpare(m))), !card && /* @__PURE__ */ React$1.createElement("p", { className: "es-cap" }, esFigs(m).join(" · "))));
  const esNowResult = (m) => m.live ? { kind: "live", label: "In progress" } : { kind: m.over ? "bad" : "ok", label: "Escaped" };
  const EsLanes = ({ m, sel, onSel }) => /* @__PURE__ */ React$1.createElement("div", { className: "es-lanes" }, m.locks.map((l) => /* @__PURE__ */ React$1.createElement("button", { key: l.key, type: "button", className: "es-lane" + (sel === l.key ? " is-sel" : ""), "aria-pressed": sel === l.key, onClick: () => onSel(l.key) }, /* @__PURE__ */ React$1.createElement("span", { className: "es-lnh" }, /* @__PURE__ */ React$1.createElement("span", { className: "es-lname" }, /* @__PURE__ */ React$1.createElement(EsNum, { n: l.index, size: 24 }), /* @__PURE__ */ React$1.createElement("b", null, l.short)), /* @__PURE__ */ React$1.createElement("span", { className: "es-cap" }, esFacts(l))), /* @__PURE__ */ React$1.createElement("span", { className: "es-steps" }, l.rows.map((r, i) => r.k === "hint" ? /* @__PURE__ */ React$1.createElement("span", { key: "h" + i, className: "es-step is-hint" }, /* @__PURE__ */ React$1.createElement("i", { className: "es-hm" }), /* @__PURE__ */ React$1.createElement("small", null, "Hint " + r.rung)) : /* @__PURE__ */ React$1.createElement("span", { key: r.n, className: "es-step" }, /* @__PURE__ */ React$1.createElement(EsMark, { r, size: 24 }), /* @__PURE__ */ React$1.createElement("small", null, !r.ok && r.kind === "typed" ? " " : esWord(r)))), /* @__PURE__ */ React$1.createElement("span", { className: "es-step is-door" }, l.exit && !m.live ? /* @__PURE__ */ React$1.createElement(EsOpen, { w: 12, h: 24 }) : /* @__PURE__ */ React$1.createElement(EsDoor, { w: 12, h: 24 }), /* @__PURE__ */ React$1.createElement("small", null, l.exit && !m.live ? "Out" : " "))))));
  const EsBody = ({ s, sid }) => {
    const gs = useGs();
    const m = React$1.useMemo(() => esBuild(s), [s]);
    const def = (m.locks.find((l) => l.exit) || m.locks[m.locks.length - 1] || {}).key;
    const [sel, setSel] = React$1.useState(() => m.locks.some((l) => l.key === gs.route.lock) ? gs.route.lock : def);
    return /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("section", { className: "es-card", "aria-label": "How you got out" }, /* @__PURE__ */ React$1.createElement(EsResult, { m }), /* @__PURE__ */ React$1.createElement(EsLine, { m, sel, onSel: setSel }), m.locks.length > 0 && /* @__PURE__ */ React$1.createElement("div", { className: "es-detail", "aria-label": "The locks" }, /* @__PURE__ */ React$1.createElement(EsLanes, { m, sel, onSel: setSel }))), /* @__PURE__ */ React$1.createElement(GsMoves, { s }));
  };
  const EsSessBody = (props) => /* @__PURE__ */ React$1.createElement(EsBody, { key: props.sid, ...props });
  const EsNow = ({ label, title, next, pass }) => {
    const gs = useGs();
    const sid = esSid(gs);
    const s = GS_SESSIONS[sid];
    const m = React$1.useMemo(() => esBuild(s), [s]);
    const open = (lock) => gs.go("session", lock ? { id: sid, lock } : { id: sid });
    return /* @__PURE__ */ React$1.createElement(LbNowCard, { gid: "escape", className: "es-now", label, title, result: esNowResult(m), open: () => open(), next, pass }, /* @__PURE__ */ React$1.createElement(EsLine, { m, onSel: open, card: true }));
  };
  const registerEscape = () => {
    GS_SESSION_BODY.escape = EsSessBody;
  };
  const wdScore = (word, answer) => {
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
    return marks;
  };
  const wdRead = (s) => {
    const events = [];
    let n = 0;
    (s.lines || []).forEach((l) => {
      if (/^Guess/.test(l[0])) {
        n += 1;
        events.push({ kind: "guess", n, word: l[1], marks: wdScore(l[1], s.answer || l[1]) });
      } else if (l[0] === "Hint") {
        const m = /Letter (\d) is ([A-Z])/.exec(l[1]);
        if (m) events.push({ kind: "hint", pos: Number(m[1]) - 1, letter: m[2], text: l[1], after: n });
      }
    });
    return { events };
  };
  const WD_SAY = { hit: "in place", near: "in the word", miss: "not in the word" };
  const WdRow = ({ g }) => /* @__PURE__ */ React$1.createElement("div", { className: "wd-row", role: "img", "aria-label": "Guess " + g.n + ", " + g.word + ": " + g.word.split("").map((ch, i) => ch + " " + WD_SAY[g.marks[i]]).join(", ") }, g.word.split("").map((ch, i) => /* @__PURE__ */ React$1.createElement("span", { key: i, className: "wd-t is-" + g.marks[i], "aria-hidden": "true" }, ch)));
  const WdHint = ({ h }) => /* @__PURE__ */ React$1.createElement("div", { className: "wd-hrow", role: "img", "aria-label": "Hint, after guess " + h.after + ": " + h.text, style: { "--p": h.pos } }, h.pos > 0 && /* @__PURE__ */ React$1.createElement("span", { className: "wd-dots is-l", "aria-hidden": "true" }), /* @__PURE__ */ React$1.createElement("span", { className: "wd-t is-hint", "aria-hidden": "true" }, h.letter), /* @__PURE__ */ React$1.createElement("span", { className: "wd-dots", "aria-hidden": "true" }));
  const WdBoard = ({ s, guessesOnly }) => {
    const p = React$1.useMemo(() => wdRead(s), [s]);
    const rows = p.events.filter((e) => !guessesOnly || e.kind === "guess").map((e, i) => [e.kind === "guess" ? e.n : null, e.kind === "guess" ? /* @__PURE__ */ React$1.createElement(WdRow, { g: e }) : /* @__PURE__ */ React$1.createElement(WdHint, { h: e }), i]);
    return /* @__PURE__ */ React$1.createElement("div", { className: "wd-board" }, rows.map(([num, el, key]) => /* @__PURE__ */ React$1.createElement("div", { key, className: "wd-nrow" }, /* @__PURE__ */ React$1.createElement("span", { className: "wd-n", "aria-hidden": "true" }, num), el, /* @__PURE__ */ React$1.createElement("span", { "aria-hidden": "true" }))));
  };
  const wdResult = (s) => s.live ? { tone: "live", word: "In progress" } : s.loss ? { tone: "bad", word: "Failed" } : { tone: "ok", word: "Solved" };
  const WdResult = ({ s }) => {
    const r = wdResult(s);
    return /* @__PURE__ */ React$1.createElement("div", { className: "wd-res" }, /* @__PURE__ */ React$1.createElement("h2", { className: "wd-tag is-" + r.tone }, r.tone !== "live" && /* @__PURE__ */ React$1.createElement(DS.Icon, { name: r.tone === "ok" ? "check" : "close", size: 24 }), r.word));
  };
  const WdSessBody = ({ s }) => /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("div", { className: "wd-play" }, /* @__PURE__ */ React$1.createElement("section", { className: "wd-card", "aria-label": "How it went" }, /* @__PURE__ */ React$1.createElement(WdBoard, { s }), /* @__PURE__ */ React$1.createElement(WdResult, { s }))), /* @__PURE__ */ React$1.createElement(GsMoves, { s }));
  const registerWord = () => {
    GS_SESSION_BODY.word = WdSessBody;
  };
  const wdSay = (g) => "Guess " + g.n + ", " + g.word + ": " + g.word.split("").map((ch, i) => ch + " " + WD_SAY[g.marks[i]]).join(", ");
  const WdTr = ({ e }) => e.kind === "guess" ? /* @__PURE__ */ React$1.createElement("div", { className: "wd-tr" }, e.marks.map((m, j) => /* @__PURE__ */ React$1.createElement("i", { key: j, className: "is-" + m }))) : e.kind === "hint" ? /* @__PURE__ */ React$1.createElement("div", { className: "wd-tr" }, [0, 1, 2, 3, 4].map((j) => /* @__PURE__ */ React$1.createElement("i", { key: j, className: j === e.pos ? "is-hint" : "is-none" }))) : /* @__PURE__ */ React$1.createElement("div", { className: "wd-tr" }, [0, 1, 2, 3, 4].map((j) => /* @__PURE__ */ React$1.createElement("i", { key: j, className: "is-empty" })));
  const WdNow = ({ c, done }) => {
    const gs = useGs();
    const sid = done ? c.today : c.liveSid;
    const s = GS_SESSIONS[sid];
    const ev = React$1.useMemo(() => wdRead(s).events, [s]);
    const gsv = ev.filter((e) => e.kind === "guess");
    const last = gsv[gsv.length - 1];
    const trail = last ? [...ev.filter((e) => e !== last), ...Array.from({ length: 6 - gsv.length }, () => ({ kind: "empty" }))] : [];
    const said = trail.map((e) => e.kind === "guess" ? wdSay(e) : e.kind === "hint" ? "Hint, " + e.text : "Not used").join(". ");
    const r = wdResult(s);
    return /* @__PURE__ */ React$1.createElement(LbNowCard, { gid: "word", className: "wd-now", title: "#" + s.number, result: { kind: r.tone, label: r.word }, open: () => gs.go("session", { id: sid }), next: c.next }, last && /* @__PURE__ */ React$1.createElement("div", { className: "wd-now-pic" }, /* @__PURE__ */ React$1.createElement("div", { className: "wd-now-line" }, /* @__PURE__ */ React$1.createElement("div", { className: "wd-trail", role: "img", "aria-label": said }, trail.map((e, i) => /* @__PURE__ */ React$1.createElement(WdTr, { key: i, e }))), /* @__PURE__ */ React$1.createElement("div", { className: "wd-now-row", role: "img", "aria-label": wdSay(last) }, last.word.split("").map((ch, j) => /* @__PURE__ */ React$1.createElement("span", { key: j, className: "wd-t is-" + last.marks[j], "aria-hidden": "true" }, ch))))));
  };
  const DL_CARRY = 3;
  const DL_HEROES = {
    "Bryn the Fighter": {
      name: "Bryn",
      cls: "Fighter",
      stats: { Strength: 3, Dexterity: 1, Constitution: 2, Intelligence: 0, Wisdom: 0, Charisma: -1 },
      abilities: [{ name: "Shield bash", of: 2, does: "Strikes at once, no roll" }],
      gear: [{ name: "Chain shirt", kind: "armour", does: "Every hit on you costs one less" }, { name: "Pepper pouch", kind: "once", does: "Flung in a face, it blinds for a blow" }]
    },
    "Wren the Rogue": {
      name: "Wren",
      cls: "Rogue",
      stats: { Strength: 0, Dexterity: 3, Constitution: 0, Intelligence: 1, Wisdom: 1, Charisma: 2 },
      abilities: [{ name: "Backstab", of: 2, does: "Strikes from behind at once, no roll" }],
      gear: [{ name: "Leather coat", kind: "armour", does: "Every hit on you costs one less" }, { name: "Smoke pellet", kind: "once", does: "Burst underfoot, it hides you for a breath" }]
    }
  };
  const DL_GEAR_DOES = { "Iron key": "Opens the lock it fits" };
  const DL_TIER = { strong: "Strong hit", weak: "Weak hit", miss: "Miss" };
  const DL_GRADE = /^(Strong hit|Weak hit|Miss|Success|Partial success|Failure)$/;
  const dlRoll = (l) => {
    const parts = l.slice(1).map(String);
    const t = parts.join(" · ");
    const m = /Rolled (?:(\d+), the higher of (\d+) and (\d+), |(\d+) )\+ (-?\d+) = (-?\d+) against DC (\d+)/.exec(t);
    if (!m) return null;
    const kept = +(m[1] || m[4]);
    const two = m[1] != null;
    const other = two ? +m[2] === kept ? +m[3] : +m[2] : null;
    const crit = /Natural 20/.test(t);
    const fumble = /Natural 1\b/.test(t);
    const tier = fumble ? "miss" : /Weak hit|Partial success/.test(t) ? "weak" : /\bMiss\b|Failure/.test(t) ? "miss" : /Strong hit|\bSuccess\b/.test(t) || crit ? "strong" : "miss";
    const hp = /HP\s+(\d+)\/(\d+)/.exec(t);
    return { stat: l[0], kept, other, mod: +m[5], total: +m[6], dc: +m[7], gap: +m[6] - +m[7], tier, crit, fumble, two, hp: hp ? +hp[1] : null, action: DL_GRADE.test(parts[0]) ? "" : parts[0] };
  };
  const DL_END = { won: "The winning blow", fallen: "The last blow", overrun: "The last roll", live: "Latest roll", ended: "Last roll played" };
  const dlMoments = (R, end) => {
    if (!R.length) return [];
    const last = R[R.length - 1];
    const pool = R.slice(0, -1);
    const used = /* @__PURE__ */ new Set([last.n]);
    const out = [];
    const take = (r, kicker) => {
      if (r && !used.has(r.n)) {
        used.add(r.n);
        out.push({ r, kicker });
      }
    };
    const crit = pool.find((r) => r.crit);
    take(crit || pool.filter((r) => r.tier === "strong").sort((a, b) => b.gap - a.gap)[0], "Best roll");
    take(pool.find((r) => r.gap === 0 && !used.has(r.n)), "Closest call");
    const fum = pool.find((r) => r.fumble && !used.has(r.n));
    take(fum || pool.filter((r) => r.tier === "miss" && !used.has(r.n)).sort((a, b) => a.gap - b.gap)[0], "Worst roll");
    out.push({ r: last, kicker: DL_END[end] });
    return out.sort((a, b) => a.r.n - b.r.n);
  };
  const dlCap = (x) => x.charAt(0).toUpperCase() + x.slice(1);
  const dlBuild = (s) => {
    const stops = [];
    const rolls = [];
    const order = [];
    let cur = null;
    let hp = s.hpMax;
    const open = (name, back) => {
      name = name && dlCap(name);
      const key = name || "_first";
      if (!order.includes(key)) order.push(key);
      cur = { i: stops.length, key, name: name || "First room", back, num: order.indexOf(key) + 1, rolls: [] };
      stops.push(cur);
    };
    (s.lines || []).forEach((l) => {
      if (l[0] === "Room") {
        const p = String(l[1]);
        open(p.replace(/^(Entered|Doubled back to) /, ""), /^Doubled back to /.test(p));
        return;
      }
      if (!cur) open(null, false);
      const r = dlRoll(l);
      if (!r) return;
      r.n = rolls.length + 1;
      r.stop = cur.i;
      r.room = cur.name;
      r.back = cur.back;
      r.harm = r.hp != null ? Math.max(0, hp - r.hp) : 0;
      if (r.hp != null) hp = r.hp;
      rolls.push(r);
      cur.rolls.push(r);
    });
    let run = 0;
    rolls.forEach((r) => {
      run = r.tier === "strong" ? run + 1 : 0;
    });
    const end = s.unfinished ? "ended" : s.live ? "live" : s.end;
    const moments = dlMoments(rolls, end);
    return { stops, rolls, hp, run, end, mom: Object.fromEntries(moments.map((x) => [x.r.n, x])) };
  };
  const dlSay = (r) => "Roll " + r.n + ", " + r.room + ": " + (r.action ? r.action + ", " : "") + r.stat + " " + r.total + " against " + r.dc + ", " + DL_TIER[r.tier].toLowerCase() + (r.crit ? ", natural 20" : r.fumble ? ", natural 1" : "") + (r.two ? ", two dice, the higher kept" : "");
  const DL_HEX = "18,0 36,10 36,30 18,40 0,30 0,10";
  const DL_RIM = "18,-3.5 39,8 39,32 18,43.5 -3,32 -3,8";
  const DlDie = ({ r, size = 36, sel }) => /* @__PURE__ */ React$1.createElement("svg", { className: "dv2-die is-" + r.tier + (r.crit ? " is-crit" : "") + (r.fumble ? " is-fumble" : "") + (sel ? " is-sel" : ""), viewBox: "-5 -5 46 50", width: size, height: Math.round(size * 50 / 46), "aria-hidden": "true" }, r.two && size < 64 && !sel && /* @__PURE__ */ React$1.createElement("polygon", { className: "gh", points: DL_HEX, transform: r.crit ? "translate(-7 -6.5)" : "translate(-3.5 -3)" }), /* @__PURE__ */ React$1.createElement("polygon", { className: "hx", points: DL_HEX }), r.crit && /* @__PURE__ */ React$1.createElement("polygon", { className: "rim", points: DL_RIM }), /* @__PURE__ */ React$1.createElement("text", { className: "nm", x: "18", y: "20.5" }, r.kept), r.two && size >= 64 && /* @__PURE__ */ React$1.createElement("g", { className: "tw", transform: "translate(25 28) scale(.42)" }, /* @__PURE__ */ React$1.createElement("polygon", { points: DL_HEX }), /* @__PURE__ */ React$1.createElement("text", { x: "18", y: "21" }, r.other)), /* @__PURE__ */ React$1.createElement("polygon", { className: "sl", points: DL_RIM }));
  const DlDieBtn = ({ r, size, act, on }) => /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "dv2-dbtn", "aria-pressed": act === r.n, "aria-label": dlSay(r), onClick: () => on.sel(r.n), onMouseEnter: () => on.hov(r.n), onMouseLeave: () => on.hov(null) }, /* @__PURE__ */ React$1.createElement(DlDie, { r, size, sel: act === r.n }));
  const dlWord = (m) => ({ live: "In progress", ended: "Unfinished", fallen: "Fallen", won: "Triumphed", overrun: "Overwhelmed" })[m.end];
  const dlTone = (m) => m.end === "won" ? "ok" : m.end === "live" ? "live" : "bad";
  const DlResult = ({ s, m }) => {
    const line = m.end === "live" ? null : m.end === "ended" ? "The week ended first" : s.result;
    return /* @__PURE__ */ React$1.createElement("div", { className: "dv7r-band" }, /* @__PURE__ */ React$1.createElement("h2", { className: "dv7r-word is-" + dlTone(m) }, dlWord(m)), line && /* @__PURE__ */ React$1.createElement("p", { className: "dv7r-line" }, line));
  };
  const DlHeld = ({ m, act }) => {
    const r = act ? m.rolls[act - 1] : null;
    if (!r) return null;
    const x = m.mom[r.n];
    const tcls = r.fumble ? "fumble" : r.tier;
    return /* @__PURE__ */ React$1.createElement("div", { className: "dv3-live", "aria-live": "polite" }, /* @__PURE__ */ React$1.createElement("div", { className: "dv3-held is-ledger" + (x ? " is-mo" : "") }, x && /* @__PURE__ */ React$1.createElement("i", { className: "dv3-mk", role: "img", "aria-label": "Key moment" }), /* @__PURE__ */ React$1.createElement("div", { className: "dv3-lh" }, /* @__PURE__ */ React$1.createElement(DlDie, { r, size: 72 }), /* @__PURE__ */ React$1.createElement("div", { className: "dv3-lht" }, /* @__PURE__ */ React$1.createElement("div", { className: "dv3-hk" }, /* @__PURE__ */ React$1.createElement("p", { className: "dv3-k" }, x ? x.kicker : "Roll " + r.n), x && /* @__PURE__ */ React$1.createElement("p", { className: "dv3-n" }, "Roll ", r.n)))), /* @__PURE__ */ React$1.createElement("dl", { className: "dv3-dl" }, /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement("dt", null, "Room"), /* @__PURE__ */ React$1.createElement("dd", null, (r.back ? "Back in " : "") + r.room)), r.action && /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement("dt", null, "Action"), /* @__PURE__ */ React$1.createElement("dd", null, r.action)), /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement("dt", null, "Roll"), /* @__PURE__ */ React$1.createElement("dd", null, r.stat, " ", r.total, " ", /* @__PURE__ */ React$1.createElement("span", null, "vs ", r.dc))), /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement("dt", null, "Outcome"), /* @__PURE__ */ React$1.createElement("dd", { className: "is-" + tcls }, DL_TIER[r.tier])), r.harm > 0 && /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement("dt", null, "Cost"), /* @__PURE__ */ React$1.createElement("dd", null, "Lost ", r.harm, " HP")))));
  };
  const DlBackArrow = () => /* @__PURE__ */ React$1.createElement("svg", { className: "dv2-back", viewBox: "0 0 12 12", "aria-hidden": "true", focusable: "false" }, /* @__PURE__ */ React$1.createElement("path", { d: "M4.5 10.5 1.5 7.5l3-3M1.5 7.5h6a3 3 0 0 0 0-6H5", fill: "none", stroke: "currentColor", strokeWidth: "1.5" }));
  const DlStopHead = ({ st, named }) => /* @__PURE__ */ React$1.createElement("span", { className: "dvA2-head", "aria-label": (st.back ? "Back to " : "Room " + st.num + ", ") + st.name }, /* @__PURE__ */ React$1.createElement("span", { className: "dv2-num" + (st.back ? " is-back" : "") }, st.back && /* @__PURE__ */ React$1.createElement(DlBackArrow, null), st.num), named && /* @__PURE__ */ React$1.createElement("span", { className: "dv2-sname" }, st.name));
  const DlRoute = ({ m, act, on }) => {
    const sel = act ? m.rolls[act - 1].stop : null;
    return /* @__PURE__ */ React$1.createElement("div", { className: "dvE-main" }, /* @__PURE__ */ React$1.createElement("div", { className: "dvA2-route is-e is-cols-between", "aria-label": "The way you went" }, m.stops.map((st) => /* @__PURE__ */ React$1.createElement("div", { key: st.i, className: "dvA2-stop" + (sel === st.i ? " is-on" : "") }, /* @__PURE__ */ React$1.createElement(DlStopHead, { st, named: true }), /* @__PURE__ */ React$1.createElement("div", { className: "dvA2-dice" }, st.rolls.length ? st.rolls.map((r) => m.mom[r.n] ? /* @__PURE__ */ React$1.createElement("span", { key: r.n, className: "dvE-mom" }, /* @__PURE__ */ React$1.createElement(DlDieBtn, { r, act, on, size: 52 })) : /* @__PURE__ */ React$1.createElement(DlDieBtn, { key: r.n, r, act, on, size: 30 })) : /* @__PURE__ */ React$1.createElement("i", { className: "dv2-pass", "aria-label": "No rolls" }))))), /* @__PURE__ */ React$1.createElement("div", { className: "dvE-side" }, /* @__PURE__ */ React$1.createElement(DlHeld, { m, act })));
  };
  const DlCard = ({ s, m, roll }) => {
    const [sel, setSel] = React$1.useState(() => roll && m.rolls[roll - 1] ? roll : m.rolls.length ? m.rolls.length : null);
    const [hov, setHov] = React$1.useState(null);
    const act = hov || sel;
    return /* @__PURE__ */ React$1.createElement("section", { className: "dv2 dv7r is-3", "aria-label": "How the run went" }, /* @__PURE__ */ React$1.createElement(DlResult, { s, m }), /* @__PURE__ */ React$1.createElement(DlRoute, { m, act, on: { sel: setSel, hov: setHov } }));
  };
  const DL_STATE = { worn: "Worn", held: "Held", used: "Used" };
  const dlSheet = (s, m) => {
    const h = DL_HEROES[s.hero] || DL_HEROES["Wren the Rogue"];
    const sh = s.sheet || {};
    const used = sh.used || {};
    const gear = h.gear.map((g) => ({ ...g, state: g.kind === "armour" ? "worn" : "held" }));
    const find = (name) => {
      const n = dlCap(name.replace(/^(a|an|the)\s+/i, ""));
      let g = gear.find((x) => x.name === n);
      if (!g) {
        g = { name: n, kind: /key/i.test(n) ? "key" : "once", does: DL_GEAR_DOES[n] || "", state: "held" };
        gear.push(g);
      }
      return g;
    };
    (s.lines || []).forEach((l) => {
      if (l[0] === "Gear") {
        const t = String(l[1]);
        if (/^Took /.test(t)) find(t.replace(/^Took /, ""));
        else if (/^Used /.test(t)) find(t.replace(/^Used /, "")).state = "used";
      }
      if (l[0] === "Lock") {
        const w = /^Opened (.+) with (.+)$/.exec(String(l[1]));
        if (w) find(w[2]).note = "Opened " + w[1];
      }
    });
    gear.forEach((g) => {
      g.label = g.note || DL_STATE[g.state];
    });
    return {
      name: h.name,
      cls: h.cls,
      hp: m.hp,
      hpMax: s.hpMax,
      threat: s.threat,
      threatMax: s.threatMax,
      carry: DL_CARRY,
      gear,
      abilities: h.abilities.map((a) => ({ ...a, left: Math.max(0, a.of - (used[a.name] || 0)) })),
      insp: !!sh.insp,
      stats: Object.entries(h.stats).map(([k, n]) => ({ k, ab: k.slice(0, 3).toUpperCase(), say: (n < 0 ? "−" : "+") + Math.abs(n) }))
    };
  };
  const DL_G = { armour: "M5 4h14v8l-7 8-7-8z", once: "M9 3h6M10 3v6l-5 11h14l-5-11V3", key: "M3 9h7v6H3zM10 12h11M17 12v4M20 12v3" };
  const DlBox = ({ k, state }) => /* @__PURE__ */ React$1.createElement("span", { className: "dv4-g" + (state === "used" ? " is-used" : "") + (!k ? " is-empty" : "") }, k && /* @__PURE__ */ React$1.createElement("svg", { viewBox: "0 0 24 24", width: "20", height: "20", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "square", strokeLinejoin: "miter", "aria-hidden": "true" }, /* @__PURE__ */ React$1.createElement("path", { d: DL_G[k] })));
  const DlUses = ({ left, of }) => /* @__PURE__ */ React$1.createElement("span", { className: "dv4-uses", role: "img", "aria-label": left + " of " + of + " left" }, Array.from({ length: of }, (_, i) => /* @__PURE__ */ React$1.createElement("i", { key: i, className: i < left ? "is-on" : "" })));
  const DlInsp = ({ on }) => /* @__PURE__ */ React$1.createElement("span", { className: "dv5-insw", role: "img", "aria-label": "Inspiration, " + (on ? "ready" : "spent") }, /* @__PURE__ */ React$1.createElement("svg", { className: "dv4-insp" + (on ? " is-on" : ""), viewBox: "-5 -5 46 50", width: "28", height: "30", "aria-hidden": "true" }, /* @__PURE__ */ React$1.createElement("polygon", { className: "hx", points: DL_HEX }), on && /* @__PURE__ */ React$1.createElement("polygon", { className: "rim", points: DL_RIM })));
  const DlHex = ({ x }) => /* @__PURE__ */ React$1.createElement("svg", { className: "dv4-sx", viewBox: "-5 -5 46 50", width: "32", height: "35", role: "img", "aria-label": x.say }, /* @__PURE__ */ React$1.createElement("polygon", { className: "hx", points: DL_HEX }), /* @__PURE__ */ React$1.createElement("text", { x: "18", y: "20.5" }, x.say));
  const DlCell = ({ label, used, title, children }) => /* @__PURE__ */ React$1.createElement("div", { className: "dv7-cell" + (used ? " is-used" : ""), title }, /* @__PURE__ */ React$1.createElement("span", { className: "dv7-fig" }, children), /* @__PURE__ */ React$1.createElement("span", { className: "dv7-lb" }, label));
  const DlGrp = ({ k, head, children }) => /* @__PURE__ */ React$1.createElement("div", { className: "dv7-grp" + (k ? " " + k : "") }, /* @__PURE__ */ React$1.createElement("div", { className: "dv7-h" }, /* @__PURE__ */ React$1.createElement("span", null, head)), /* @__PURE__ */ React$1.createElement("div", { className: "dv7-cells" }, children));
  const DlMeter = ({ label, n, of }) => /* @__PURE__ */ React$1.createElement("div", { className: "dv6-bar" }, /* @__PURE__ */ React$1.createElement("span", null, label), /* @__PURE__ */ React$1.createElement(DS.ProgressBar, { label, value: n, max: of, showValue: false }), /* @__PURE__ */ React$1.createElement("small", null, n + "/" + of));
  const DlSheet = ({ c, streak }) => {
    const [open, setOpen] = React$1.useState(false);
    const slots = Array.from({ length: Math.max(c.carry, c.gear.length) }, (_, i) => c.gear[i] || null);
    return /* @__PURE__ */ React$1.createElement("section", { className: "dv4 dv5 is-tight dv7 is-band fold-none dv8 is-3b" + (open ? "" : " is-shut"), "aria-label": "Character sheet" }, /* @__PURE__ */ React$1.createElement("div", { className: "dv8-rows" }, /* @__PURE__ */ React$1.createElement("div", { className: "dv7-band" }, /* @__PURE__ */ React$1.createElement("div", { className: "dv7-grp is-hero" }, /* @__PURE__ */ React$1.createElement("p", { className: "dv7-hero" }, /* @__PURE__ */ React$1.createElement("b", null, c.name), /* @__PURE__ */ React$1.createElement("span", null, c.cls))), /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "dv8-tog", "aria-expanded": open, "aria-label": open ? "Fold the character sheet" : "Show the whole character sheet", onClick: () => setOpen((o) => !o) }, /* @__PURE__ */ React$1.createElement(DS.Icon, { name: "next", size: 20 })), /* @__PURE__ */ React$1.createElement("div", { className: "dv7-grp dv8-meters" }, /* @__PURE__ */ React$1.createElement(DlMeter, { label: "Hit points", n: c.hp, of: c.hpMax }), /* @__PURE__ */ React$1.createElement(DlMeter, { label: "Threat", n: c.threat, of: c.threatMax })), /* @__PURE__ */ React$1.createElement(DlGrp, { k: "dv8-stats", head: "Stats" }, c.stats.map((x) => /* @__PURE__ */ React$1.createElement(DlCell, { key: x.k, label: x.ab, title: x.k }, /* @__PURE__ */ React$1.createElement(DlHex, { x })))), /* @__PURE__ */ React$1.createElement(DlGrp, { k: "dv8-pack", head: "Pack" }, slots.map((g, i) => g ? /* @__PURE__ */ React$1.createElement(DlCell, { key: g.name, label: g.name, used: g.state === "used", title: g.name + " · " + g.label }, /* @__PURE__ */ React$1.createElement(DlBox, { k: g.kind, state: g.state }), g.kind === "armour" && /* @__PURE__ */ React$1.createElement("i", { className: "dv7-arm", "aria-label": "Armour plus 1" }, "+1")) : /* @__PURE__ */ React$1.createElement(DlCell, { key: "free" + i, label: "Free", used: true, title: "Room for one more" }, /* @__PURE__ */ React$1.createElement(DlBox, { k: null })))), /* @__PURE__ */ React$1.createElement(DlGrp, { k: "is-r", head: c.abilities.length > 1 ? "Abilities" : "Ability" }, c.abilities.map((a) => /* @__PURE__ */ React$1.createElement(DlCell, { key: a.name, label: a.name, used: !a.left, title: a.left + " of " + a.of + " left. " + a.does }, /* @__PURE__ */ React$1.createElement(DlUses, { left: a.left, of: a.of })))), /* @__PURE__ */ React$1.createElement(DlGrp, { k: "dv8-adv", head: "Advantage" }, /* @__PURE__ */ React$1.createElement(DlCell, { label: "Inspiration", used: !c.insp, title: c.insp ? "Ready" : "Spent" }, /* @__PURE__ */ React$1.createElement(DlInsp, { on: c.insp })), /* @__PURE__ */ React$1.createElement(DlCell, { label: "Streak", title: "Strong hits in a row" }, /* @__PURE__ */ React$1.createElement("span", { className: "dv8-num" }, streak))))));
  };
  const DlBody = ({ s }) => {
    const gs = useGs();
    const m = React$1.useMemo(() => dlBuild(s), [s]);
    const c = React$1.useMemo(() => dlSheet(s, m), [s, m]);
    return /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("div", { className: "dv4-lay" }, /* @__PURE__ */ React$1.createElement(DlSheet, { c, streak: m.run }), /* @__PURE__ */ React$1.createElement(DlCard, { s, m, roll: gs.route && gs.route.roll })), /* @__PURE__ */ React$1.createElement(GsMoves, { s }));
  };
  const DL_NO_HOVER = () => {
  };
  const DL_NOW_COL = 44;
  const useDlNowCols = (n) => {
    const ref = React$1.useRef(null);
    const [cols, setCols] = React$1.useState(n);
    React$1.useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;
      const read = () => {
        const fit = Math.max(1, Math.floor(el.clientWidth / DL_NOW_COL));
        setCols(n <= fit ? n : Math.ceil(n / Math.ceil(n / fit)));
      };
      read();
      const ro = new ResizeObserver(read);
      ro.observe(el);
      return () => ro.disconnect();
    }, [n]);
    return [ref, cols];
  };
  const dlMarkCols = (n) => n <= 3 ? n : Math.ceil(n / Math.ceil(n / 3));
  const DlNowRoute = ({ m, open }) => {
    const on = { sel: open, hov: DL_NO_HOVER };
    const [ref, cols] = useDlNowCols(m.stops.length);
    return /* @__PURE__ */ React$1.createElement("div", { className: "dl-now-stops", ref, style: { "--dl-cols": cols }, "aria-label": "The way you went" }, m.stops.map((st, i) => {
      const keys = st.rolls.filter((r) => m.mom[r.n]);
      const rest = st.rolls.filter((r) => !m.mom[r.n]);
      const edge = (i % cols === 0 ? " is-row-start" : "") + (i % cols === cols - 1 || i === m.stops.length - 1 ? " is-row-end" : "");
      return /* @__PURE__ */ React$1.createElement("div", { key: st.i, className: "dl-now-stop" + edge }, /* @__PURE__ */ React$1.createElement(DlStopHead, { st }), !st.rolls.length && /* @__PURE__ */ React$1.createElement("i", { className: "dv2-pass", "aria-label": "No rolls" }), keys.length > 0 && /* @__PURE__ */ React$1.createElement("div", { className: "dl-now-keys" }, keys.map((r) => /* @__PURE__ */ React$1.createElement(DlDieBtn, { key: r.n, r, act: null, on, size: 34 }))), rest.length > 0 && /* @__PURE__ */ React$1.createElement("span", { className: "dl-now-marks", style: { "--dl-marks": dlMarkCols(rest.length) }, role: "img", "aria-label": rest.length + (rest.length === 1 ? " other roll: " : " other rolls: ") + rest.map((r) => DL_TIER[r.tier].toLowerCase()).join(", ") }, rest.map((r) => /* @__PURE__ */ React$1.createElement("i", { key: r.n, className: "dl-now-mark is-" + r.tier }))));
    }));
  };
  const DlNow = ({ s: wk, label, sids = ["delve", "delve-live"], next = "Next run: " + DV_NEXT, pass }) => {
    const gs = useGs();
    const sid = wk.end ? gsEdPick("delve", gs) || sids[0] : sids[1];
    const s = GS_SESSIONS[sid];
    const m = React$1.useMemo(() => dlBuild(s), [s]);
    const open = (roll) => gs.go("session", roll ? { id: sid, roll } : { id: sid });
    const result = m.end === "live" ? { kind: "live", label: "In progress" } : { kind: m.end === "won" ? "ok" : "bad", label: dlWord(m) };
    return /* @__PURE__ */ React$1.createElement(LbNowCard, { gid: "delve", className: "dl-now", label, title: wk.title, result, open: () => open(), next, pass }, /* @__PURE__ */ React$1.createElement("div", { className: "dl-now-route" }, /* @__PURE__ */ React$1.createElement(DlNowRoute, { m, open })));
  };
  const registerDelve = () => {
    GS_SESSION_BODY.delve = (p) => /* @__PURE__ */ React$1.createElement(DlBody, { key: p.sid, ...p });
  };
  function initGsDelve() {
    GS_SESSIONS["delve-fallen"] = {
      ...GS_SESSIONS.delve,
      end: "fallen",
      result: "Fell in the warren",
      reached: "Fell in the warren",
      share: "Fell in the warren",
      shareLines: null,
      threat: 7,
      sheet: { used: { "Shield bash": 2 }, insp: false },
      lines: [
        ["Wisdom", "Search the lock-keeper's niche", "Success", "Rolled 14 + 0 = 14 against DC 12"],
        ["Room", "Entered the chime run"],
        ["Dexterity", "Miss", "Rolled 5 + 1 = 6 against DC 12", "HP 11/13"],
        ["Dexterity", "Weak hit", "Rolled 12 + 1 = 13 against DC 12", "HP 10/13"],
        ["Dexterity", "Strong hit", "Rolled 19 + 1 = 20 against DC 12"],
        ["Room", "Entered the warren"],
        ["Turn", "The turncoat joins", GS_DV_TURNCOAT],
        ["Strength", "Miss", "Rolled 3 + 3 = 6 against DC 12", "HP 7/13"],
        ["Strength", "Weak hit", "Rolled 9 + 3 = 12 against DC 12", "HP 5/13"],
        ["Strength", "Miss", "Natural 1", "Rolled 1 + 3 = 4 against DC 12", "HP 2/13"],
        ["Strength", "Strong hit", "Rolled 15 + 3 = 18 against DC 12"],
        ["Strength", "Miss", "Rolled 7 + 3 = 10 against DC 12", "HP 0/13"]
      ]
    };
    GS_SESSIONS["delve-hard"] = {
      ...GS_SESSIONS.delve,
      end: "overrun",
      result: "Too late: the ritual was completed",
      reached: "Too late: the ritual was completed",
      share: "Too late: the ritual was completed",
      shareLines: null,
      hero: "Wren the Rogue",
      hpMax: 11,
      threat: 12,
      sheet: { used: { Backstab: 2 }, insp: false },
      lines: [
        ["Wisdom", "Search the lock-keeper's niche", "Failure", "Natural 1", "Rolled 1 + 1 = 2 against DC 12", "HP 10/11"],
        ["Room", "Entered the chime run"],
        ["Dexterity", "Miss", "Rolled 8 + 3 = 11 against DC 12", "HP 9/11"],
        ["Dexterity", "Weak hit", "Rolled 9 + 3 = 12 against DC 12"],
        ["Dexterity", "Strong hit", "Rolled 16 + 3 = 19 against DC 12"],
        ["Room", "Entered the warren"],
        ["Turn", "The turncoat joins", GS_DV_TURNCOAT],
        ["Dexterity", "Strong hit", "Rolled 14 + 3 = 17 against DC 12"],
        ["Dexterity", "Strong hit", "Rolled 15, the higher of 6 and 15, + 3 = 18 against DC 12"],
        ["Dexterity", "Miss", "Rolled 4, the higher of 4 and 2, + 3 = 7 against DC 12", "HP 7/11"],
        ["Strength", "Weak hit", "Rolled 12 + 0 = 12 against DC 12", "HP 6/11"],
        ["Dexterity", "Strong hit", "Rolled 15 + 3 = 18 against DC 12"],
        ["Room", "Doubled back to the chime run", "The ritual +1"],
        ["Intelligence", "Read the chime wires", "Partial success", "Rolled 13 + 1 = 14 against DC 12"],
        ["Room", "Doubled back to the warren", "The ritual +1"],
        ["Room", "Entered Snaggle's den"],
        ["Dexterity", "Miss", "Rolled 7 + 3 = 10 against DC 12", "HP 5/11"],
        ["Dexterity", "Strong hit", "Natural 20", "Rolled 20 + 3 = 23 against DC 12"],
        ["Dexterity", "Strong hit", "Rolled 12, the higher of 12 and 3, + 3 = 15 against DC 12"],
        ["Room", "Doubled back to the warren", "The ritual +1"],
        ["Strength", "Force the bone gate", "Failure", "Rolled 6 + 0 = 6 against DC 12"],
        ["Strength", "Force the bone gate", "Failure", "Rolled 11 + 0 = 11 against DC 12"],
        ["Strength", "Force the bone gate", "Success", "Rolled 14 + 0 = 14 against DC 12"],
        ["Lock", "Forced the bone gate"],
        ["Room", "Entered the shrine cavern"],
        ["Dexterity", "Weak hit", "Rolled 10 + 3 = 13 against DC 12", "HP 3/11"],
        ["Dexterity", "Strong hit", "Rolled 17 + 3 = 20 against DC 12"],
        ["Dexterity", "Strong hit", "Rolled 18 + 3 = 21 against DC 12"],
        ["Dexterity", "Miss", "Rolled 7, the higher of 5 and 7, + 3 = 10 against DC 12", "HP 2/11"],
        ["Dexterity", "Weak hit", "Rolled 11 + 3 = 14 against DC 12"],
        ["Dexterity", "Miss", "Rolled 8 + 3 = 11 against DC 12", "HP 1/11"]
      ]
    };
  }
  const cnRead = (P, live) => {
    const end = P.w.length - 1;
    const w = P.w.map((word, i) => ({ i, word, state: i === 0 || i === end ? "end" : "hidden", shown: i === 0 || i === end ? word.length : 1 }));
    let last = null;
    const g = P.p.map(([guess, k], j) => {
      const x = w[k];
      let res;
      if (guess === x.word) {
        res = "right";
        x.state = "found";
        last = k;
      } else {
        x.shown += 1;
        res = x.shown >= x.word.length ? "given" : "wrong";
        if (res === "given") {
          x.state = "given";
          x.shown = x.word.length;
          last = k;
        }
      }
      return { n: j + 1, res };
    });
    const mid = w.slice(1, end);
    const r = live ? { kind: "live", label: "In progress" } : mid.some((x) => x.state === "given") ? { kind: "bad", label: "Failed" } : { kind: "ok", label: "Solved" };
    return { w, g, r, last, mid, found: mid.filter((x) => x.state === "found").length };
  };
  const CnWord = ({ x, n }) => n ? /* @__PURE__ */ React$1.createElement("span", { className: "cn-word", "aria-hidden": "true" }, Array.from({ length: n }, (_, j) => /* @__PURE__ */ React$1.createElement("span", { key: j, className: "wd-t cn-t is-more" }))) : x.state === "hidden" ? /* @__PURE__ */ React$1.createElement("span", { className: "cn-word", role: "img", "aria-label": "Starts " + x.word.slice(0, x.shown) }, x.word.slice(0, x.shown).split("").map((ch, j) => /* @__PURE__ */ React$1.createElement("span", { key: j, className: "wd-t cn-t is-shown", "aria-hidden": "true" }, ch)), /* @__PURE__ */ React$1.createElement("span", { className: "wd-t cn-t is-more", "aria-hidden": "true" })) : /* @__PURE__ */ React$1.createElement("span", { className: "cn-word", role: "img", "aria-label": x.word + (x.state === "given" ? ", given away" : "") }, x.word.split("").map((ch, j) => /* @__PURE__ */ React$1.createElement(
    "span",
    {
      key: j,
      "aria-hidden": "true",
      className: "wd-t cn-t is-" + (x.state === "end" ? "end" : x.state === "given" ? "given" : j < x.shown ? "shown" : "found")
    },
    ch
  )));
  const CnJoint = () => /* @__PURE__ */ React$1.createElement("span", { className: "cn-joint", "aria-hidden": "true" }, /* @__PURE__ */ React$1.createElement("svg", { width: "22", height: "16", viewBox: "0 0 22 16" }, /* @__PURE__ */ React$1.createElement("rect", { x: "1.5", y: "1.5", width: "12", height: "8", rx: "4" }), /* @__PURE__ */ React$1.createElement("rect", { x: "8.5", y: "6.5", width: "12", height: "8", rx: "4" })));
  const CN_W = 16;
  const CN_H = 30;
  const CN_STEP = CN_H + 8;
  const CN_GAP = { wrong: 14, given: 8 };
  const cnLoop = (res, len, th) => {
    const per = 2 * (len - th) + Math.PI * th;
    const gap = CN_GAP[res];
    return res === "right" ? {} : { strokeDasharray: (res === "given" ? per / 2 - gap : per - gap) + " " + gap, strokeDashoffset: per - gap / 2 - (len - th) / 2 };
  };
  const CN_SAY = { right: "right", wrong: "wrong", given: "given away" };
  const CnLinkRow = ({ items }) => {
    const len = 8 + (items.length - 1) * CN_STEP + CN_H;
    return /* @__PURE__ */ React$1.createElement("svg", { width: len, height: "48", viewBox: "0 0 " + len + " 48", "aria-hidden": "true" }, items.slice(1).map((t, i) => /* @__PURE__ */ React$1.createElement("line", { key: "b" + i, className: "cn-bar", x1: 4 + i * CN_STEP + CN_H, y1: 4 + CN_W / 2, x2: 4 + (i + 1) * CN_STEP, y2: 4 + CN_W / 2 })), items.map((t, i) => /* @__PURE__ */ React$1.createElement("rect", { key: i, x: 4 + i * CN_STEP, y: 4, width: CN_H, height: CN_W, rx: CN_W / 2, className: "cn-loop is-" + t.res, ...cnLoop(t.res, CN_H, CN_W) })), items.map((t, i) => /* @__PURE__ */ React$1.createElement("text", { key: "n" + i, x: 4 + i * CN_STEP + CN_H / 2, y: "44", textAnchor: "middle" }, t.n)));
  };
  const cnFold = (g, per) => {
    const rows = Math.ceil(g.length / per);
    const size = Math.ceil(g.length / rows);
    const out = [];
    for (let i = 0; i < g.length; i += size) out.push(g.slice(i, i + size));
    return out;
  };
  const CnLinks = ({ g }) => {
    const ref = React$1.useRef(null);
    const [per, setPer] = React$1.useState(8);
    React$1.useLayoutEffect(() => {
      const me = ref.current;
      const pic = me.closest(".cn-pic");
      if (!pic) return void 0;
      const fit = () => {
        let room = pic.clientWidth;
        const par = me.parentElement;
        if (getComputedStyle(par).flexDirection === "row") room -= [...par.children].filter((c) => c !== me).reduce((n, c) => n + c.offsetWidth + 24, 0);
        setPer(Math.max(1, Math.floor((room - 8 - CN_H) / CN_STEP) + 1));
      };
      fit();
      const ro = new ResizeObserver(fit);
      ro.observe(pic);
      return () => ro.disconnect();
    }, []);
    return /* @__PURE__ */ React$1.createElement("span", { ref, className: "cn-links", role: "img", "aria-label": g.length + (g.length === 1 ? " guess: " : " guesses: ") + g.map((t) => CN_SAY[t.res]).join(", ") }, cnFold(g, per).map((row, r) => /* @__PURE__ */ React$1.createElement(CnLinkRow, { key: r, items: row })));
  };
  const CnCount = ({ p }) => /* @__PURE__ */ React$1.createElement("span", { className: "cn-cap", role: "img", "aria-label": p.found + " of " + p.mid.length + " words" }, /* @__PURE__ */ React$1.createElement("b", { "aria-hidden": "true" }, p.found), /* @__PURE__ */ React$1.createElement("span", { "aria-hidden": "true" }, " of " + p.mid.length + " words"));
  const CnPic = ({ p }) => {
    const solved = p.r.kind === "ok";
    const k = p.last == null ? 1 : p.last;
    const x = p.w[k];
    return /* @__PURE__ */ React$1.createElement("div", { className: "cn-pic cn-stack" }, solved ? /* @__PURE__ */ React$1.createElement("div", { className: "cn-focus is-ends" }, /* @__PURE__ */ React$1.createElement(CnWord, { x: p.w[0] }), /* @__PURE__ */ React$1.createElement("span", { className: "cn-joints", role: "img", "aria-label": p.mid.length + " words between" }, p.mid.map((m) => /* @__PURE__ */ React$1.createElement(CnJoint, { key: m.i }))), /* @__PURE__ */ React$1.createElement(CnWord, { x: p.w[p.w.length - 1] })) : /* @__PURE__ */ React$1.createElement("div", { className: "cn-focus" }, /* @__PURE__ */ React$1.createElement(CnWord, { x })), /* @__PURE__ */ React$1.createElement("div", { className: "cn-under" }, p.g.length > 0 && /* @__PURE__ */ React$1.createElement(CnLinks, { g: p.g }), /* @__PURE__ */ React$1.createElement(CnCount, { p })));
  };
  const CN_FRESH = { found: 0, mid: [0, 1, 2, 3] };
  const CnFresh = () => /* @__PURE__ */ React$1.createElement("div", { className: "cn-pic cn-stack" }, /* @__PURE__ */ React$1.createElement("div", { className: "cn-focus" }, /* @__PURE__ */ React$1.createElement(CnWord, { n: 5 })), /* @__PURE__ */ React$1.createElement("div", { className: "cn-under" }, /* @__PURE__ */ React$1.createElement(CnCount, { p: CN_FRESH })));
  const cnStaged = (k) => ({ failed: CH_FAIL, hard: CH_HARD })[k];
  const ChNow = ({ c, done, none }) => {
    const gs = useGs();
    const staged = cnStaged(gs.review.chain);
    const title = "#" + GS_SESSIONS[c.today].number;
    if (none) return /* @__PURE__ */ React$1.createElement(LbNowCard, { gid: "chain", title, play: () => gs.playReq({ kind: "edition", e: edList(gs, "chain")[0] }), next: c.next, className: "cn" }, /* @__PURE__ */ React$1.createElement(CnFresh, null));
    const sid = staged ? Object.keys(GS_SESSIONS).find((k) => GS_SESSIONS[k].gid === "chain" && / found/.test(GS_SESSIONS[k].result || "")) || c.today : done ? c.today : c.liveSid;
    const s = GS_SESSIONS[sid];
    const p = cnRead(staged || s.play, !staged && !done);
    return /* @__PURE__ */ React$1.createElement(LbNowCard, { gid: "chain", title, result: p.r, open: () => gs.go("session", { id: sid }), next: c.next, className: "cn" }, /* @__PURE__ */ React$1.createElement(CnPic, { p }));
  };
  const CPR_SHIP_LIB = {};
  const cprEscFirst = () => PZ.escape.all[PZ.escape.all.length - 1];
  let CPR_FIRST;
  const CprFirst = ({ id }) => {
    const gs = useGs();
    useCpr();
    const f = CPR_FIRST[id](gs);
    const st = cprFirstState(gs, id);
    const done = st === "done";
    const pass = done && gs.view !== "pass";
    if (id === "escape" && st !== "none") return /* @__PURE__ */ React$1.createElement(EsNow, { label: f.label, title: f.title, pass });
    if (id === "delve" && st !== "none") return /* @__PURE__ */ React$1.createElement(DlNow, { s: done ? DV_DONE : DV_LIVE, label: f.label, sids: ["delve-first", "delve-first-live"], next: null, pass });
    const bar = st === "live" ? f.liveBar : done ? f.doneBar : null;
    const soon = id === "barrow" && gs.view === "pass" ? "Chapter 3: coming soon" : null;
    if (id === "barrow" && gs.view === "pass" && done) return /* @__PURE__ */ React$1.createElement(LbNowCard, { gid: "barrow", label: GS_PAGES.barrow.week2.label, title: BW_CH2.title, play: () => gs.playReq({ kind: "edition", e: bwEds(gs)[0] }), next: soon, span: true }, /* @__PURE__ */ React$1.createElement("p", null, BW_CH2.line));
    return /* @__PURE__ */ React$1.createElement(
      LbNowCard,
      {
        gid: id,
        label: f.label,
        title: f.title,
        result: st === "live" ? { kind: "live", label: "In progress" } : done ? f.result : null,
        tag: f.tag,
        play: st === "none" ? f.play : null,
        open: f.open,
        next: soon,
        pass,
        span: id === "barrow" || id === "casebook"
      },
      /* @__PURE__ */ React$1.createElement("p", null, st === "live" ? f.live : done ? f.done : f.none),
      bar && /* @__PURE__ */ React$1.createElement(DS.ProgressBar, { label: bar[0], value: bar[1], max: bar[2], showValue: false })
    );
  };
  const cprIso = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const LbNeedsPass = ({ id, had, ach, access }) => {
    const gs = useGs();
    const g = GS_GAMES[id];
    const items = ach || [];
    let word = g.ed[0];
    let words = g.ed[1];
    let record = null;
    if (had) {
      const earned = lbAchEarned(lbAchView(items, access || lbAccess(gs, id), gs));
      const keys = new Set(edList(gs, id).map((e) => e.key));
      const plays = phVisible(gs).filter((p) => p.gid === id);
      const eds = new Set(plays.map((p) => p.ed).filter((k) => keys.has(k)));
      if (id === "barrow") {
        const ch = Math.max(1, ...plays.map((p) => +p.ed.replace(/\D/g, "") || 1));
        record = { chapter: ch, played: eds.size, earned };
      } else record = { last: plays[0] ? cprIso(plays[0].at) : "", played: eds.size, earned };
      if (!eds.size) {
        word = void 0;
        words = void 0;
      }
    }
    return /* @__PURE__ */ React$1.createElement(DS.NeedsPass, { game: GS_NAME[id] || g.name, word, words, record, total: items.length, onGet: () => gs.go("pass"), style: id === "barrow" || id === "casebook" ? { gridColumn: "1 / -1" } : void 0 });
  };
  const cprNowCard = (gs, id, ach) => {
    const f = cprLapsedOf(id);
    return gsLapsed(gs) && f.used && f.pass ? /* @__PURE__ */ React$1.createElement(LbNeedsPass, { id, had: true, ach }) : /* @__PURE__ */ React$1.createElement(CprFirst, { id });
  };
  const cprKey = (gs) => gs.view + (gs.sub.hadPass ? "u" : "") + (lbWeekDone(gs) ? "d" : "") + (gsFresh(gs) ? "f" : "") + cprStore.get().lapsed;
  const CprCbLibrary = () => {
    const gs = useGs();
    if (gs.view === "pass" || gs.route.sid) return /* @__PURE__ */ React$1.createElement(CPR_SHIP_LIB.casebook, null);
    const had = gsLapsed(gs) && phVisible(gs).some((p) => p.gid === "casebook");
    const ach = phAch(gs, "casebook", CB_ACH);
    if (!had) return /* @__PURE__ */ React$1.createElement("main", { key: cprKey(gs), className: "gs-wrap gs-main" }, /* @__PURE__ */ React$1.createElement(LbHead, { id: "casebook" }), /* @__PURE__ */ React$1.createElement("div", { className: "lb-lay" }, /* @__PURE__ */ React$1.createElement(LbNeedsPass, { id: "casebook", ach: CB_ACH, access: "all" })));
    return /* @__PURE__ */ React$1.createElement("main", { key: cprKey(gs), className: "gs-wrap gs-main" }, /* @__PURE__ */ React$1.createElement(LbHead, { id: "casebook" }), /* @__PURE__ */ React$1.createElement("div", { className: "lb-lay" }, /* @__PURE__ */ React$1.createElement(LbNeedsPass, { id: "casebook", had: true, ach, access: "all" }), /* @__PURE__ */ React$1.createElement(LbAch, { items: ach, badges: CB_BADGES, access: "all", ed: GS_GAMES.casebook.ed }), /* @__PURE__ */ React$1.createElement(LbRecent, { title: "Your cases", allLabel: "See in History", empty: "Your cases appear here once you have played one." })));
  };
  const CprDvLibrary = () => {
    const gs = useGs();
    if (gs.view === "pass") return /* @__PURE__ */ React$1.createElement(CPR_SHIP_LIB.delve, null);
    const access = lbAccess(gs, "delve");
    const lapsed = gsLapsed(gs);
    gsFresh(gs);
    const ach = phAch(gs, "delve", DV_ACH);
    return /* @__PURE__ */ React$1.createElement("main", { key: cprKey(gs), className: "gs-wrap gs-main" }, /* @__PURE__ */ React$1.createElement(LbHead, { id: "delve" }), /* @__PURE__ */ React$1.createElement("div", { className: "lb-lay" }, cprNowCard(gs, "delve", ach), !lapsed && /* @__PURE__ */ React$1.createElement(LbRunPass, { unit: "weeks", weeks: lbRunOf(DV_ALL) }), lapsed && (() => {
      const list = dvRun(gs);
      const f = lbFrozen(lbRunOf(list), list, (s) => s.date);
      return /* @__PURE__ */ React$1.createElement(LbRun, { n: f.n, unit: "weeks", weeks: f.weeks });
    })(), /* @__PURE__ */ React$1.createElement(LbAch, { items: ach, badges: DV_BADGES, access, ed: GS_GAMES.delve.ed }), /* @__PURE__ */ React$1.createElement(LbRecent, { title: "Your runs", allLabel: "See in History", empty: "Your runs appear here once you have played one." })), /* @__PURE__ */ React$1.createElement(CprPassEnd, { className: "gs-muted gs-pu-wrap", text: "Playing earlier " + GS_GAMES.delve.ed[1] + " comes with the Pass." }));
  };
  const CprEsLibrary = () => {
    const gs = useGs();
    if (gs.view === "pass") return /* @__PURE__ */ React$1.createElement(CPR_SHIP_LIB.escape, null);
    const c = PZ.escape;
    const lapsed = gsLapsed(gs);
    const items = phAch(gs, "escape", c.ach.map((a) => ({ ...a, first: !a.of })));
    return /* @__PURE__ */ React$1.createElement("main", { key: cprKey(gs), className: "gs-wrap gs-main" }, /* @__PURE__ */ React$1.createElement(LbHead, { id: "escape" }), /* @__PURE__ */ React$1.createElement("div", { className: "lb-lay" }, cprNowCard(gs, "escape", items), !lapsed && /* @__PURE__ */ React$1.createElement(LbRunPass, { unit: "weeks", weeks: lbRunOf(c.all) }), lapsed && (() => {
      const run = pzRun(gs, "escape");
      const f = lbFrozen(lbRunOf(run), run, (y) => y.date);
      return /* @__PURE__ */ React$1.createElement(LbRun, { n: f.n, unit: "weeks", weeks: f.weeks });
    })(), /* @__PURE__ */ React$1.createElement(LbAch, { items, badges: c.badges, access: lbAccess(gs, "escape"), ed: GS_GAMES.escape.ed }), /* @__PURE__ */ React$1.createElement(LbRecent, { title: "Your rooms", allLabel: "See in History", empty: "Your rooms appear here once you have played one." })), /* @__PURE__ */ React$1.createElement(CprPassEnd, { className: "gs-muted gs-pu-wrap", text: "Playing earlier " + GS_GAMES.escape.ed[1] + " comes with the Pass." }));
  };
  const CprBwLibrary = () => {
    const gs = useGs();
    useCpr();
    const st = cprFirstState(gs, "barrow");
    const ach = phAch(gs, "barrow", BW_ACH);
    return /* @__PURE__ */ React$1.createElement("main", { key: cprKey(gs) + st, className: "gs-wrap gs-main" }, /* @__PURE__ */ React$1.createElement(LbHead, { id: "barrow" }), /* @__PURE__ */ React$1.createElement("div", { className: "lb-lay" }, gs.view === "pass" ? /* @__PURE__ */ React$1.createElement(CprFirst, { id: "barrow" }) : cprNowCard(gs, "barrow", ach), /* @__PURE__ */ React$1.createElement(LbAch, { items: ach, badges: BW_BADGES, access: lbAccess(gs, "barrow"), ed: GS_GAMES.barrow.ed }), /* @__PURE__ */ React$1.createElement(LbRecent, { title: "Your chapters", allLabel: "See in History", empty: "Your chapters appear here once you have played one." })));
  };
  const cprPzLibrary = (id) => () => {
    const gs = useGs();
    gs.route;
    const c = PZ[id];
    const k = gs.view + (gs.sub.hadPass ? "u" : "") + (lbWeekDone(gs) ? "d" : "") + (gs.review.today || "");
    const { recent } = c;
    const locked = cprLocked(gs, id);
    const had = locked && gsLapsed(gs) && phVisible(gs).some((p) => p.gid === id);
    if (locked && !had) return /* @__PURE__ */ React$1.createElement("main", { key: k, className: "gs-wrap gs-main" }, /* @__PURE__ */ React$1.createElement(LbHead, { id }), /* @__PURE__ */ React$1.createElement("div", { className: "lb-lay" }, /* @__PURE__ */ React$1.createElement(LbNeedsPass, { id, ach: c.ach, access: "all" })));
    const never = gs.review.never === id || gsFresh(gs);
    const now = never ? null : lbNow(gs, id);
    const none = !now;
    const run = pzRun(gs, id);
    const fz = had ? lbFrozen(lbRunOf(run), run, (x) => x.date) : null;
    const n = fz ? fz.n : lbStreak(run);
    const ach = phAch(gs, id, c.ach, n);
    return /* @__PURE__ */ React$1.createElement("main", { key: k, className: "gs-wrap gs-main" }, /* @__PURE__ */ React$1.createElement(LbHead, { id }), /* @__PURE__ */ React$1.createElement("div", { className: "lb-lay" }, locked ? /* @__PURE__ */ React$1.createElement(LbNeedsPass, { id, had: true, ach, access: "all" }) : /* @__PURE__ */ React$1.createElement(PzNow, { c, done: lbWeekDone(gs), none, id }), /* @__PURE__ */ React$1.createElement(LbRun, { n, unit: c.weekly ? "weeks" : "days", weeks: fz ? fz.weeks : lbRunOf(run) }), /* @__PURE__ */ React$1.createElement(LbAch, { items: ach, badges: c.badges, access: "all" }), /* @__PURE__ */ React$1.createElement(LbRecent, { title: recent, allLabel: "See in History", empty: recent + " appear here once you have played one." })), gs.view !== "pass" && !locked && /* @__PURE__ */ React$1.createElement(CprPassEnd, { className: "gs-muted gs-pu-wrap", text: "Playing earlier " + GS_GAMES[id].ed[1] + " comes with the Pass." }));
  };
  const cprRow = (result, tone, when, at) => ({ result, tone, when, at });
  let CPR_FREE_READY;
  let CPR_PASS_READY;
  const gsLibRow = (gs, k) => {
    const pass = gs.view === "pass";
    if (GS_GAMES[k].added) return cprRow(pass ? GS_LIB_READY[k] : "Pass only", null, "", 0);
    const p = phVisible(gs).find((x) => x.gid === k);
    const row = (result, tone) => cprRow(result, tone || null, p ? phWhen(p.at) : "", p ? p.at.getTime() : 0);
    if (p && p.status.kind === "live") return row("In progress");
    if (!pass && CPR_STAGE[k] === "first") {
      if (p && PH_FIRST[k] === p.ed) return row("Free " + GS_GAMES[k].ed[0] + " done", "ok");
      return row(cprFirstState(gs, k) === "none" ? CPR_FREE_READY[k] : "Pass only");
    }
    if (cprLocked(gs, k) || lbAccess(gs, k) === "none") return row("Pass only");
    if (k === "barrow") return row(p ? "Chapter 2 is ready" : GS_LIB_READY.barrow);
    if (k === "hunter") return row(GS_LIB_READY.hunter);
    if (p && p.cur) return row(k === "casebook" ? "Every case done" : PZ[k] && !PZ[k].weekly ? "Done today" : "Done this week", "ok");
    return row(GS_LIB_READY[k] || CPR_PASS_READY[k] || null);
  };
  const cprNewFor = (gs, k) => {
    if (cprLocked(gs, k)) return false;
    if (gs.view === "pass") return !cprPlayed(gs, k);
    if (CPR_STAGE[k] === "daily") return gsFresh(gs) || (cprStore.get().newEds === "most" ? k !== "word" : !gsTodayPlayed(gs)[k]);
    if (CPR_STAGE[k] === "first") return cprFirstState(gs, k) === "none";
    return false;
  };
  const GsLibrary = () => {
    const gs = useGs();
    useCpr();
    const [q, setQ] = React$1.useState("");
    const [cat, setCat] = React$1.useState(gs.route.kind || "all");
    const [sort, setSort] = React$1.useState("last");
    const [rhy, setRhy] = React$1.useState(gs.route.rhythm || "all");
    React$1.useEffect(() => {
      setCat(gs.route.kind || "all");
      setRhy(gs.route.rhythm || "all");
    }, [gs.route]);
    const wait = useGsPart([q, cat, rhy, sort]);
    const lay = React$1.useRef(null);
    const showAll = () => {
      setQ("");
      setCat("all");
      setRhy("all");
      setTimeout(() => {
        const i = lay.current && lay.current.querySelector("input");
        if (i) i.focus({ preventScroll: true });
      }, 0);
    };
    const rows = {};
    CPR_SHOWN.forEach((k) => {
      rows[k] = gsLibRow(gs, k);
    });
    const az = (a, b) => GS_GAMES[a].name.localeCompare(GS_GAMES[b].name);
    const listed = CPR_SHOWN.filter((k) => lbAccess(gs, k) !== "none" && !cprLocked(gs, k) || lbPast(gs));
    const ids = listed.filter((k) => (cat === "all" || GS_GAMES[k].category === cat) && (rhy === "all" || gsRhythm(k) === rhy) && gsFind(q, k)).sort((a, b) => sort === "az" ? az(a, b) : rows[b].at - rows[a].at || CPR_SHOWN.indexOf(a) - CPR_SHOWN.indexOf(b));
    const fresh = ids.filter((k) => cprNewFor(gs, k));
    const mine = ids.filter((k) => !fresh.includes(k));
    const row = (k) => {
      const g = GS_GAMES[k];
      const me = rows[k];
      return /* @__PURE__ */ React$1.createElement(DS.ListRow, { key: k, lead: /* @__PURE__ */ React$1.createElement(PhLead, { gid: k }), title: g.name, result: gsForms(me.result), tone: me.tone || void 0, when: me.when || void 0, onClick: () => gs.go(g.route, { page: "record" }) });
    };
    const list = (ks) => /* @__PURE__ */ React$1.createElement("div", { className: "lb-box" }, /* @__PURE__ */ React$1.createElement(DS.RowList, { label: "Library" }, ks.map(row)));
    const tile = (k) => /* @__PURE__ */ React$1.createElement(GsTile, { key: k, id: k, pass: cprLocked(gs, k), page: "record" });
    const empty = /* @__PURE__ */ React$1.createElement("div", { className: "gs-nomatch" }, /* @__PURE__ */ React$1.createElement("p", null, "Nothing matches that."), /* @__PURE__ */ React$1.createElement(DS.TextLink, { onClick: showAll }, "Clear all"));
    const free = gs.view === "free";
    return /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("main", { className: "gs-wrap gs-main" }, /* @__PURE__ */ React$1.createElement("h1", { className: "gs-h1" }, "Library"), /* @__PURE__ */ React$1.createElement("div", { className: "lb-alllay", ref: lay }, /* @__PURE__ */ React$1.createElement(LbTools, null, /* @__PURE__ */ React$1.createElement(DS.SearchField, { label: "Find a game", placeholder: "Name", value: q, onChange: (e) => setQ(e.target.value) }), /* @__PURE__ */ React$1.createElement(LbChoice, { label: "Genre", value: cat, opts: [["all", "All games"], ...gsKinds().map((c) => [c, gsKind(c)])], onPick: setCat }), /* @__PURE__ */ React$1.createElement(LbChoice, { label: "Schedule", value: rhy, opts: [["all", "All games"], ...GS_RHYTHMS], onPick: setRhy }), /* @__PURE__ */ React$1.createElement(LbChoice, { label: "Order", value: sort, opts: [["last", "Last played"], ["az", "A to Z"]], onPick: setSort })), /* @__PURE__ */ React$1.createElement("div", { className: "gs-pu-libbody" }, wait ? /* @__PURE__ */ React$1.createElement(GsPart, { label: "Loading games" }) : !ids.length ? empty : fresh.length ? /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("section", { className: "gs-pu-libgrp" }, /* @__PURE__ */ React$1.createElement(DS.CardRow, { title: "New for you", kind: "tiles" }, fresh.map(tile))), mine.length > 0 && /* @__PURE__ */ React$1.createElement("section", { className: "gs-pu-libgrp" }, /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-sec" }, "Your games"), list(mine))) : list(ids)), free && !wait && ids.length > 0 && /* @__PURE__ */ React$1.createElement(CprPassEnd, { className: "gs-muted gs-pu-wrap", text: "Everything else comes with the Pass." }))));
  };
  const CprPzNow = ({ c, done, none, id }) => {
    const gs = useGs();
    const st = done ? c.done : c.live;
    if (none) return /* @__PURE__ */ React$1.createElement(LbNowCard, { gid: id, title: c.title, play: () => gs.playReq({ kind: "edition", e: edList(gs, id)[0] }), next: c.next }, /* @__PURE__ */ React$1.createElement("p", null, GS_PAGES[id].week.line));
    return /* @__PURE__ */ React$1.createElement(LbNowCard, { gid: id, title: c.title, result: done ? c.done.st : !c.tag && { kind: "live", label: "In progress" }, tag: c.tag, open: () => gs.go("session", { id: done ? c.today : c.liveSid }), next: c.next }, /* @__PURE__ */ React$1.createElement("p", null, st.line), st.bar && /* @__PURE__ */ React$1.createElement(DS.ProgressBar, { label: st.bar[0], value: st.bar[1], max: st.bar[2], showValue: false }));
  };
  const CbNow = ({ c }) => {
    const gs = useGs();
    return /* @__PURE__ */ React$1.createElement(LbNowCard, { gid: "casebook", title: c.title, result: !c.live && cbStatus(c), tag: true, open: () => cbGo(gs, c.id), span: true }, /* @__PURE__ */ React$1.createElement("p", null, cbRecap(c)), /* @__PURE__ */ React$1.createElement(DS.ProgressBar, { label: c.turns + " of 16 turns used", value: c.turns, max: 16, showValue: false }));
  };
  const PzNow = (props) => {
    const own = props.id === "word" && !props.none ? /* @__PURE__ */ React$1.createElement(WdNow, { c: props.c, done: props.done }) : props.id === "escape" && !props.none ? /* @__PURE__ */ React$1.createElement(EsNow, { title: props.c.title, next: props.c.next }) : props.id === "chain" ? /* @__PURE__ */ React$1.createElement(ChNow, { c: props.c, done: props.done, none: props.none }) : /* @__PURE__ */ React$1.createElement(CprPzNow, { ...props });
    const Pg = GS_NOW[props.id];
    return Pg ? /* @__PURE__ */ React$1.createElement(Pg, { ...props }, own) : own;
  };
  const registerPassLibrary = () => {
    Object.assign(CPR_SHIP_LIB, GS_LIBRARY);
    Object.assign(GS_LIBRARY, { casebook: CprCbLibrary, delve: CprDvLibrary, escape: CprEsLibrary, barrow: CprBwLibrary });
    ["word", "groups", "mystery", ...DP_IDS].forEach((id) => {
      GS_LIBRARY[id] = cprPzLibrary(id);
    });
  };
  function initGsPassLibrary() {
    CPR_FIRST = {
      // Delve's and Escape's first parts: this card only before a play (Play); once played or started, DlNow and EsNow take over.
      delve: (gs) => ({
        label: "THE FIRST RUN · FREE",
        title: DV_FIRST.title,
        none: "The game’s very first run, the same for everyone. Play it free.",
        play: () => gs.play("Delve")
      }),
      escape: (gs) => ({
        label: "THE FIRST ROOM · FREE",
        title: cprEscFirst().title,
        none: "The game’s very first room, the same for everyone. Play it free.",
        play: () => gs.play("Escape")
      }),
      // The Barrow: Chapter 1's card. A Pass holder's reads A QUEST, a free player's keeps its free label. Finished, it shows the
      // chapter's now line (the record holds no recap of its own) and no bar.
      barrow: (gs) => ({
        label: gs.view === "pass" ? GS_PAGES.barrow.week.label : "CHAPTER 1 · FREE",
        title: BW_CH1.title,
        none: BW_CH1.line,
        done: BW_CH1.line,
        result: { kind: "ok", label: "Quest complete" },
        tag: true,
        open: () => gs.go("session", { id: "gs-pu-barrow-ch1" }),
        play: () => gs.playReq({ kind: "edition", e: bwEds(gs)[1] })
      })
    };
    CPR_FREE_READY = { escape: "Your free room is ready", barrow: "Chapter 1 is ready", delve: "Your free run is ready" };
    CPR_PASS_READY = { casebook: "Case 1 is ready", delve: "This week’s run is ready" };
  }
  let pzMis;
  let PZ;
  let PZ_WORDS;
  let PZ_OPEN;
  let PZ_GROUPS;
  let PZ_SUS;
  let PZ_WPN;
  let PZ_RMS;
  const pzQn = (q) => q === 0 ? "No questions" : q === 1 ? "1 question" : q + " questions";
  const pzAcc = (s, w, r) => s + ", with the " + w + ", in the " + r;
  const pzLong = (d) => d.toLocaleString("en-GB", { weekday: "long" }) + " " + lbDate(d);
  const pzSession = (id, c, x) => {
    const i = x.i;
    const sid = id + "-e" + i;
    const base = { kind: "puzzle", gid: id, game: GS_GAMES[id].name, art: GS_GAMES[id].art, date: pzLong(x.d), result: x.line, loss: !x.ok };
    let s;
    if (DP_PZ[id]) s = dpSession(id, c, x, base);
    else if (id === "word") {
      const answer = PZ_WORDS[i % PZ_WORDS.length];
      const n = x.ok ? 3 + i % 4 : 6;
      const guesses = Array.from({ length: n }, (_, k) => x.ok && k === n - 1 ? answer : k === 0 ? PZ_OPEN[i % PZ_OPEN.length] : PZ_WORDS[(i + k * 5) % PZ_WORDS.length] === answer ? PZ_OPEN[(i + k) % PZ_OPEN.length] : PZ_WORDS[(i + k * 5) % PZ_WORDS.length]);
      s = { ...base, number: 212 - i, answer, listTitle: "Every guess", share: x.line, lines: guesses.map((g, k) => ["Guess " + (k + 1), g, ...gsGuessParts(g, answer)]) };
    } else if (id === "groups") {
      const mis = x.ok ? i === 1 ? 0 : i % 4 : 4;
      const found = x.ok ? 4 : 2;
      const lines = [];
      const rows = [];
      for (let k = 0, f = 0, m = 0; f < found || m < mis; k++) {
        if (m < mis && (k % 2 === 1 || f >= found)) {
          const g = PZ_GROUPS[f % 4][0];
          const o = PZ_GROUPS[(f + 1) % 4][0];
          rows.push(g + g + g + o);
          lines.push(["Try " + (k + 1), "Mixed four", m === 0 ? "One away" : "Not a group"]);
          m++;
        } else {
          const [g, w] = PZ_GROUPS[f];
          rows.push(g + g + g + g);
          lines.push(["Try " + (k + 1), w.split(": ")[1], "Found: " + w.split(": ")[0]]);
          f++;
        }
      }
      s = {
        ...base,
        figures: [found + " of 4 groups", mis ? pzMis(mis).replace(/^./, (ch) => ch.toUpperCase()) : "No mistakes"],
        listTitle: "Every try",
        share: x.line,
        shareHead: "Daily Groups #" + (88 - i) + " · " + pzMis(mis),
        rows,
        lines
      };
    } else if (id === "mystery") {
      const cs = i * 3 % 8;
      const cw = (i * 5 + 1) % 8;
      const cr = (i * 7 + 2) % 8;
      const q = i % 3;
      const qs = Array.from({ length: q }, (_, k) => k === 0 ? ["Question 1", "Was " + PZ_SUS[(i + 1) % 8] + " in the " + PZ_RMS[(i + 4) % 8] + "?", i % 2 ? "The inspector said yes" : "The inspector said no"] : ["Question 2", "Did " + PZ_SUS[(i + 5) % 8] + " have the " + PZ_WPN[(i + 3) % 8] + "?", i % 3 === 1 ? "The inspector said yes" : "The inspector said no"]);
      const part = i % 3;
      const acc = x.ok ? pzAcc(PZ_SUS[cs], PZ_WPN[cw], PZ_RMS[cr]) : pzAcc(PZ_SUS[part === 0 ? (cs + 1) % 8 : cs], PZ_WPN[part === 1 ? (cw + 1) % 8 : cw], PZ_RMS[part === 2 ? (cr + 1) % 8 : cr]);
      s = {
        ...base,
        number: 64 - i,
        q,
        hints: 0,
        listTitle: "Every question",
        share: x.line,
        figures: [pzQn(q), "No hints"],
        lines: [...qs, x.ok ? ["Accusation", acc, "Right"] : ["Accusation", acc, "Wrong", ["The suspect was wrong", "The weapon was wrong", "The room was wrong"][part]]]
      };
    } else {
      s = { ...GS_SESSIONS["escape-week"], date: base.date };
    }
    GS_SESSIONS[sid] = s;
    return sid;
  };
  const pzStatus = (c, x) => !x.played ? { kind: "none", label: "Not played" } : x.ok ? { kind: "ok", label: x.line } : { kind: "bad", label: x.line };
  const pzRun = (gs, id) => {
    const by = {};
    phVisible(gs).forEach((p) => {
      if (p.gid === id && !by[p.ed]) by[p.ed] = p;
    });
    return PZ[id].all.map((x) => {
      const p = by[x.id];
      const k = p ? p.status.kind : "none";
      return { ...x, played: !!p, done: k === "ok", failed: k === "bad" };
    });
  };
  const pzLibrary = (id) => () => {
    const gs = useGs();
    const c = PZ[id];
    const k = gs.view + (gs.sub.hadPass ? "u" : "") + (lbWeekDone(gs) ? "d" : "") + (gs.review.today || "");
    const { recent } = c;
    const allLabel = "See in History";
    const never = gs.review.never === id || gsFresh(gs);
    const now = never ? null : lbNow(gs, id);
    const none = !now;
    const run = pzRun(gs, id);
    const n = lbStreak(run);
    const ach = phAch(gs, id, c.ach, n);
    return /* @__PURE__ */ React$1.createElement("main", { key: k, className: "gs-wrap gs-main" }, /* @__PURE__ */ React$1.createElement(LbHead, { id }), /* @__PURE__ */ React$1.createElement("div", { className: "lb-lay" }, /* @__PURE__ */ React$1.createElement(PzNow, { c, done: lbWeekDone(gs), none, id }), /* @__PURE__ */ React$1.createElement(LbRun, { n, unit: c.weekly ? "weeks" : "days", weeks: lbRunOf(run) }), /* @__PURE__ */ React$1.createElement(LbAch, { items: ach, badges: c.badges, access: "all" }), /* @__PURE__ */ React$1.createElement(
      LbRecent,
      {
        title: recent,
        allLabel,
        empty: recent + " appear here once you have played one."
      }
    )));
  };
  const registerPuzzlesLibrary = () => {
    ["word", "groups", "mystery", "escape", ...DP_IDS].forEach((id) => {
      GS_LIBRARY[id] = pzLibrary(id);
      GS_EDITIONS[id] = (gs) => edPuzzle(gs, id);
    });
  };
  function initGsPuzzlesLibrary() {
    pzMis = gsMis;
    PZ = {
      word: {
        no: (i) => "Daily Word #" + (212 - i),
        salt: 0,
        keep: { 1: true },
        pin: { 2: "word-hard", 4: "word-failed" },
        past: "word-1005",
        today: "word-today",
        liveSid: "word-live",
        ok: (i) => GS_RESULT.word({ ok: true, guesses: 3 + i % 4 }),
        bad: GS_RESULT.word({ ok: false }),
        title: "Today’s word",
        next: "Next word: tomorrow",
        live: { line: "You’ve used 2 of your 6 guesses. One letter is in place and two more are in the word.", bar: ["Guess 2 of 6", 2, 6] },
        done: { st: { kind: "ok", label: GS_RESULT.word({ ok: true, guesses: 3 }) }, line: "You found the word on your third guess, with one hint.", bar: ["Guess 3 of 6", 3, 6] },
        recent: "Your words",
        ach: [
          { k: "w1", n: "Solved", how: "Solve a Daily Word.", by: (p) => p.status.kind === "ok" },
          { k: "w2", n: "Solved in two", how: "Solve a Daily Word in two guesses.", by: (p) => p.status.label === GS_RESULT.word({ ok: true, guesses: 2 }) },
          { k: "w7", n: "Seven days in a row", how: "Solve Daily Word seven days running.", of: 7 }
        ]
      },
      groups: {
        no: (i) => "Daily Groups #" + (88 - i),
        salt: 1,
        keep: { 1: true },
        past: "groups-1005",
        today: "groups-today",
        liveSid: "groups-live",
        ok: (i) => GS_RESULT.groups({ found: 4, mistakes: i === 1 ? 0 : i % 4 }),
        bad: GS_RESULT.groups({ found: 2 }),
        // tag: not a launch game, so its now card keeps the finished result as the tag with its icon.
        title: "Today’s groups",
        next: "Next groups: tomorrow",
        tag: true,
        live: { line: "You’ve found 2 of the 4 groups, with 1 mistake so far.", bar: ["2 of 4 groups", 2, 4] },
        done: { st: { kind: "ok", label: GS_RESULT.groups({ found: 4, mistakes: 1 }) }, line: "You found all four groups with one mistake, and no hints.", bar: ["4 of 4 groups", 4, 4] },
        recent: "Your groups",
        ach: [
          { k: "g1", n: "Solved", how: "Find all four groups in a Daily Groups.", by: (p) => p.status.kind === "ok" },
          { k: "g0", n: "Solved with no mistakes", how: "Find all four groups without a mistake.", by: (p) => p.status.label === GS_RESULT.groups({ found: 4, mistakes: 0 }) },
          { k: "g7", n: "Seven days in a row", how: "Play Daily Groups seven days running.", of: 7 }
        ]
      },
      mystery: {
        no: (i) => "Daily Mystery #" + (64 - i),
        salt: 2,
        keep: { 2: true },
        past: "mystery-1004",
        today: "mystery-today",
        liveSid: "mystery-live",
        ok: () => GS_RESULT.mystery({ ok: true }),
        bad: GS_RESULT.mystery({ ok: false }),
        title: "Today’s case",
        next: "Next case: tomorrow",
        live: { line: "You’ve asked the inspector two questions. You haven’t accused anyone yet." },
        done: { st: { kind: "bad", label: GS_RESULT.mystery({ ok: false }) }, line: "You accused after two questions, and the weapon was wrong." },
        recent: "Your cases",
        ach: [
          { k: "m1", n: "Case closed", how: "Solve a Daily Mystery case.", by: (p) => p.status.kind === "ok" },
          { k: "m0", n: "Closed with no hints and no questions", how: "Close a Daily Mystery without a hint or a question.", by: (p) => {
            const s = GS_SESSIONS[p.sid];
            return p.status.kind === "ok" && !!s && s.q === 0 && !s.hints;
          } },
          { k: "m7", n: "Seven days in a row", how: "Solve a case seven days running.", of: 7 }
        ]
      },
      // Escape: this week's room is No. 1 The Clockmaker’s Study; its finished play is escape-week. Earlier rooms: the foot of this file.
      escape: {
        weekly: true,
        count: 1,
        rooms: ["The Clockmaker’s Study"],
        no: (i) => PZ.escape.rooms[i] || PZ.escape.rooms[0],
        salt: 3,
        keep: {},
        past: "escape-week",
        today: "escape-week",
        liveSid: "escape-live",
        ok: () => GS_RESULT.escape({ min: 28, par: "under par" }),
        bad: GS_RESULT.escape({ min: 28, par: "under par" }),
        title: "The Clockmaker’s Study",
        next: "Next room: Monday 12 October",
        live: { line: "You’ve made three moves." },
        done: { st: { kind: "ok", label: GS_RESULT.escape({ min: 28, par: "under par" }) }, line: "You got out in 13 moves, with one hint." },
        recent: "Your rooms",
        // The game's five achievements (verbatim). This room's finished play (1 hint, 2 wrong tries, under par) meets Beat the Clock only.
        ach: [
          { k: "e1", n: "Clean Getaway", how: "Escape without a hint or a wrong try.", by: (p) => {
            const s = GS_SESSIONS[p.sid];
            return !!s && (s.figures || []).includes("No hints") && (s.figures || []).includes("No wrong tries");
          } },
          { k: "e2", n: "Beat the Clock", how: "Escape under par.", by: (p) => /under par/.test(p.status.label) },
          { k: "e3", n: "Not So Fast", how: "Discover there’s more than one door to get through." },
          { k: "e4", n: "Regular", how: "Escape four weeks in a row.", of: 4, count: (ps) => ps.filter((p) => p.status.kind === "ok") },
          { k: "e5", n: "Ten Rooms", how: "Escape ten rooms.", of: 10, count: (ps) => ps.filter((p) => p.status.kind === "ok") }
        ]
      },
      // Where, Chain and Salvage (app/gs-where-chain-salvage.jsx).
      ...DP_PZ
    };
    PZ_WORDS = ["TORCH", "SHIRE", "GLOVE", "PLANK", "CRISP", "BLOOM", "FROST", "NERVE", "QUILT", "SPOKE", "CHALK", "DRIFT"];
    PZ_OPEN = ["SLATE", "CRANE", "AUDIO", "ROUTE", "MOIST", "PRISM"];
    PZ_GROUPS = [["🟦", "colours: TEAL · RUBY · JADE · AMBER"], ["🟨", "birds: WREN · KITE · ROOK · TERN"], ["🟩", "card games: SNAP · BRAG · RUMMY · WHIST"], ["🟪", "things with keys: PIANO · MAP · LOCK · CODE"]];
    PZ_SUS = ["Ivy Marchbank", "Colonel Rufus Hale", "Delphine Rooke", "Arthur Penhallow", "Mr Graves", "Sebastian Wyle", "Dr Helena Strand", "Nell Okafor"];
    PZ_WPN = ["brass candlestick", "vial of foxglove", "antique pistol", "iron poker", "curtain cord", "paper knife", "marble bust", "hatpin"];
    PZ_RMS = ["library", "conservatory", "butler’s pantry", "billiard room", "wine cellar", "dining room", "morning room", "study"];
    Object.entries(PZ).forEach(([id, c]) => {
      c.gid = id;
      c.all = Array.from({ length: c.count || (c.weekly ? 30 : 40) }, (_, i) => {
        const d = new Date(2026, 9, c.weekly ? 5 - 7 * i : 6 - i);
        const played2 = i === 0 || !!c.keep[i] || (i + c.salt) % 6 !== 5 && (i + c.salt) % 9 !== 6;
        const ok = played2 && (!!c.keep[i] || (i + 2 * c.salt) % 5 !== 4);
        return { id: id + i, i, d, date: lbDate(d), month: lbMonth(d), title: c.no(i), played: played2, ok, done: played2 && ok, line: ok ? c.ok(i) : c.bad };
      });
      c.all.slice(1).forEach((x) => {
        if (x.played) x.sid = c.keep[x.i] ? c.past : pzSession(id, c, x);
      });
      c.badges = lbAutoBadges(c.ach);
      Object.entries(c.pin || {}).forEach(([i, sid]) => {
        const x = c.all[+i];
        const s = GS_SESSIONS[sid];
        Object.assign(x, { played: true, ok: !s.loss, done: !s.loss, line: s.result, sid });
      });
      const base = c.today;
      c.todayBase = base;
      Object.defineProperty(c, "today", { configurable: true, get: () => id === "escape" && window.gsApi && typeof esFinished === "function" ? esFinished(window.gsApi) : gsEdPick(id) || base });
    });
    (() => {
      const c = PZ.word;
      const y = c.all[1];
      const keep = GS_SESSIONS["word-e1"];
      pzSession("word", c, { ...y, ok: false, line: c.bad });
      GS_SESSIONS["word-broken-first"] = GS_SESSIONS["word-e1"];
      if (keep) GS_SESSIONS["word-e1"] = keep;
      else delete GS_SESSIONS["word-e1"];
    })();
    (() => {
      const c = PZ.escape;
      const PAST = [
        // [room, played, minutes, par word, wrong tries, hints]
        ["The Botanist’s Glasshouse", true, 24, "under par", 1, 0],
        ["The Signal Box", true, 33, "over par", 3, 2],
        ["The Bell Foundry", true, 27, "under par", 0, 1],
        ["The Map Room", true, 22, "under par", 2, 0],
        ["The Printer’s Shop", true, 30, "under par", 1, 1],
        ["The Ice House", false],
        ["The Observatory", true, 36, "over par", 4, 2],
        ["The Toy Maker’s Attic", false],
        ["The Night Ferry", true, 26, "under par", 1, 0]
      ];
      c.rooms = [c.rooms[0], ...PAST.map((p) => p[0])];
      c.count = c.rooms.length;
      const cur = c.all[0];
      const fig = (n, one, many, none) => n ? n + " " + (n === 1 ? one : many) : none;
      c.all = [cur, ...PAST.map((p, k) => {
        const i = k + 1;
        const d = new Date(2026, 9, 5 - 7 * i);
        const [title, played2, min, par, wrong, hints] = p;
        const line = played2 ? GS_RESULT.escape({ min, par }) : c.bad;
        const x = { id: "escape" + i, i, d, date: lbDate(d), month: lbMonth(d), title, played: played2, ok: played2, done: played2, line };
        if (played2) {
          const sid = "escape-e" + i;
          const lines = [["Move 1", "Examined the room", "Two locks stand between you and the way out."]];
          let n = 1;
          for (let w = 0; w < wrong; w += 1) lines.push(["Move " + ++n, "Tried " + GS_ES_WORDS4[w % GS_ES_WORDS4.length] + " on the iron box", "Wrong"]);
          for (let h = 0; h < hints; h += 1) lines.push(gsEsHint("iron box", Math.min(h + 1, 3), "Sample hint."));
          lines.push(["Move " + ++n, "Tried KEYS on the iron box", "The lid lifts."]);
          lines.push(["Move " + ++n, "Tried EXIT on the door lock", "Out"]);
          GS_SESSIONS[sid] = {
            kind: "puzzle",
            gid: "escape",
            game: "Escape",
            art: "escape",
            date: pzLong(d),
            result: line,
            share: line,
            figures: [min + " min, " + par, fig(hints, "hint", "hints", "No hints"), fig(wrong, "wrong try", "wrong tries", "No wrong tries")],
            shareLines: ["Escape · " + title + " · escaped in " + min + " min, " + par],
            listTitle: "Every move",
            lines,
            esTimes: { min, opened: [Math.round(min * 0.55), min] }
          };
          x.sid = sid;
        }
        return x;
      })];
    })();
  }
  const DP_IDS = ["where", "chain", "salvage"];
  const DP_NO = 21;
  const dpWrong = (n) => n === 0 ? "no wrong guesses" : n === 1 ? "1 wrong guess" : n + " wrong guesses";
  const dpKm = (n) => n.toLocaleString("en-GB") + " km";
  const dpWhMark = (km) => km >= 1e3 ? "○" : km >= 100 ? "◐" : "●";
  const dpWhere = (t, ok) => {
    const rows = t.g.map(([c, km]) => [c, km, dpWhMark(km)]);
    if (ok) rows.push([t.a, null, "◉"]);
    const far = (km) => km === null ? "Found it" : km === 0 ? "Shares a border with the hidden country" : dpKm(km) + " from the hidden country, border to border";
    const lines = rows.map((r, k) => ["Guess " + (k + 1), r[0], far(r[1])]);
    const h = t.hint && /^From (.+), the country lies (.+)$/.exec(t.hint);
    if (h) lines.splice(lines.length - 1, 0, ["Hint", "The hidden country lies " + h[2] + " of " + h[1]]);
    if (!ok) lines.push(["Answer", t.a]);
    return { lines, guesses: rows.length, hints: t.hint ? 1 : 0, marks: rows.map((r) => r[2]).join(" ") };
  };
  const dpWhHead = (n, r, ok) => "Where #" + n + " · " + (ok ? "found in " + r.guesses + " of 6" : "not found") + (r.hints ? " · 1 hint" : "");
  let WH_TODAY;
  let WH_OK;
  let WH_FAIL;
  let DP_NUM;
  const dpChain = (t) => {
    const last = t.w.length - 1;
    const pre = t.w.map(() => 1);
    const res = t.w.map(() => null);
    const miss = t.w.map(() => 0);
    const lines = [["Ends", t.w[0] + " to " + t.w[last], DP_NUM[t.w.length] + " words in all"]];
    t.p.forEach(([guess, k], j) => {
      let note;
      if (guess === t.w[k]) {
        res[k] = "found";
        note = ["Right"];
      } else {
        miss[k] += 1;
        pre[k] += 1;
        note = pre[k] >= t.w[k].length ? (res[k] = "given", ["Wrong, so it was given away", "The word was " + t.w[k]]) : ["Wrong", "Now shows " + t.w[k].slice(0, pre[k])];
      }
      lines.push(["Guess " + (j + 1), guess, "Word " + (k + 1), ...note]);
    });
    const hidden = t.w.length - 2;
    const given = res.filter((r) => r === "given").length;
    const found = res.filter((r) => r === "found").length;
    const marks = t.w.map((_, k) => res[k] === "given" ? "○" : miss[k] ? "◐" : "●").join("—");
    return { lines, words: t.w.length, hidden, found, given, wrong: miss.reduce((a, b) => a + b, 0), marks };
  };
  const dpChResult = (r) => GS_RESULT.chain(r.given ? { given: true, found: r.found, of: r.hidden } : { wrong: r.wrong });
  const dpChHead = (n, r) => "Chain #" + n + " · " + (r.given ? r.found + " of " + r.hidden + " words found" : "solved · " + dpWrong(r.wrong));
  let CH_TODAY;
  let CH_OK;
  let CH_FAIL;
  let CH_HARD;
  let SV_COLS;
  const svCell = ([x, y]) => SV_COLS[x] + (y + 1);
  const svAt = (ships) => {
    const at = {};
    ships.forEach((s, i) => s.forEach(([x, y]) => {
      at[x + "," + y] = i;
    }));
    return at;
  };
  const svReplay = (ships, order) => {
    const at = svAt(ships);
    const hits = ships.map(() => 0);
    return order.map((c) => {
      const i = at[c[0] + "," + c[1]];
      if (i == null) return [c, "miss"];
      hits[i] += 1;
      return hits[i] === ships[i].length ? [c, "sunk", ships[i].length] : [c, "hit"];
    });
  };
  const svLines = (log, hint) => {
    const lines = log.map(([c, r, n], k) => ["Dive " + (k + 1), svCell(c), r === "miss" ? "Miss" : r === "hit" ? "Hit" : "Sunk: the wreck of " + n]);
    if (hint) lines.splice(hint.at, 0, ["Hint", hint.what, hint.said]);
    return lines;
  };
  const svMarks = (log) => {
    const m = log.map(([, r]) => r === "miss" ? "○" : r === "hit" ? "✕" : "■").join("");
    const out = [];
    for (let k = 0; k < m.length; k += 10) out.push(m.slice(k, k + 10));
    return out;
  };
  const svBoard = (ships, log) => {
    const at = svAt(ships);
    const mark = {};
    const sunk = /* @__PURE__ */ new Set();
    log.forEach(([[x, y], r]) => {
      mark[x + "," + y] = r === "miss" ? "○" : "✕";
      if (r === "sunk") sunk.add(at[x + "," + y]);
    });
    ships.forEach((s, i) => {
      if (sunk.has(i)) s.forEach(([x, y]) => {
        mark[x + "," + y] = "■";
      });
    });
    return ["  A B C D E F G H", ...[0, 1, 2, 3, 4, 5, 6, 7].map((y) => y + 1 + " " + [0, 1, 2, 3, 4, 5, 6, 7].map((x) => mark[x + "," + y] || "·").join(" "))].join("\n");
  };
  const svSunk = (log) => log.filter((l) => l[1] === "sunk").length;
  const dpSvHead = (n, log, hint) => "Salvage #" + n + " · " + (svSunk(log) === 5 ? "all 5 wrecks" : svSunk(log) + " of 5 wrecks") + " · " + log.length + " of 30 dives" + (hint ? " · 1 hint" : "");
  let SV_TODAY;
  let SV_TODAY_DIVES;
  let SV_TODAY_HINT;
  const svRng = (seed) => {
    let s = seed * 9301 + 49297;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  };
  const svLayout = (seed) => {
    const r = svRng(seed);
    for (let t = 0; t < 500; t++) {
      const near = /* @__PURE__ */ new Set();
      const ships = [];
      let ok = true;
      for (const len of [4, 3, 3, 2, 2]) {
        let placed = false;
        for (let a = 0; a < 200 && !placed; a++) {
          const h = r() < 0.5;
          const c = Math.floor(r() * (h ? 9 - len : 8));
          const rw = Math.floor(r() * (h ? 8 : 9 - len));
          const cells = Array.from({ length: len }, (_, k) => h ? [c + k, rw] : [c, rw + k]);
          if (cells.some(([x, y]) => near.has(x + "," + y))) continue;
          cells.forEach(([x, y]) => {
            for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) near.add(x + dx + "," + (y + dy));
          });
          ships.push(cells);
          placed = true;
        }
        if (!placed) {
          ok = false;
          break;
        }
      }
      if (ok) return ships;
    }
    return SV_TODAY;
  };
  const svPlay = (ships, seed) => {
    const r = svRng(seed + 77);
    const at = svAt(ships);
    const tried = /* @__PURE__ */ new Set();
    const clear = /* @__PURE__ */ new Set();
    const hits = ships.map(() => []);
    const log = [];
    let sunk = 0;
    let queue = [];
    const par = Math.floor(r() * 2);
    const first = [];
    const rest = [];
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) ((x + y) % 2 === par ? first : rest).push([x, y]);
    for (let i = first.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [first[i], first[j]] = [first[j], first[i]];
    }
    const hunt = first.concat(rest);
    const open = ([x, y]) => x >= 0 && y >= 0 && x < 8 && y < 8 && !tried.has(x + "," + y) && !clear.has(x + "," + y);
    const around = ([x, y]) => [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
    while (log.length < 30 && sunk < 5) {
      let cell = null;
      while (queue.length && !cell) {
        const q = queue.shift();
        if (open(q)) cell = q;
      }
      if (!cell) cell = hunt.find(open);
      const k = cell[0] + "," + cell[1];
      tried.add(k);
      const si = at[k];
      if (si == null) {
        log.push([cell, "miss"]);
        continue;
      }
      hits[si].push(cell);
      if (hits[si].length === ships[si].length) {
        sunk += 1;
        log.push([cell, "sunk", ships[si].length]);
        queue = [];
        ships[si].forEach(([x, y]) => {
          for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) clear.add(x + dx + "," + (y + dy));
        });
        hits.forEach((h, j) => {
          if (j !== si && h.length && h.length < ships[j].length) h.forEach((c) => queue.push(...around(c)));
        });
      } else {
        log.push([cell, "hit"]);
        const h = hits[si];
        if (h.length >= 2) {
          const xs = h.map((c) => c[0]);
          const ys = h.map((c) => c[1]);
          queue = (h[0][1] === h[1][1] ? [[Math.min(...xs) - 1, h[0][1]], [Math.max(...xs) + 1, h[0][1]]] : [[h[0][0], Math.min(...ys) - 1], [h[0][0], Math.max(...ys) + 1]]).concat(queue);
        } else queue = around(cell).concat(queue);
      }
    }
    return log;
  };
  let dpSvDay;
  let dpWhT;
  let dpChT;
  let dpChL;
  let dpSvL;
  const dpSession = (id, c, x, base) => {
    const n = DP_NO - x.i;
    const i = x.i;
    if (id === "where") {
      const r = dpWhere(x.ok ? WH_OK[i % WH_OK.length] : WH_FAIL, x.ok);
      return { ...base, number: n, hints: r.hints, figures: [r.guesses + " of 6 guesses", r.hints ? "1 hint" : "No hints"], listTitle: "Every guess", share: x.line, shareLines: [dpWhHead(n, r, x.ok), r.marks], lines: r.lines };
    }
    if (id === "chain") {
      const play = x.ok ? CH_OK[i % CH_OK.length] : CH_FAIL;
      const r = dpChain(play);
      return { ...base, number: n, play, figures: [r.words + " words", dpWrong(r.wrong).replace(/^./, (ch) => ch.toUpperCase())], listTitle: "Every guess", share: x.line, shareLines: [dpChHead(n, r), r.marks], lines: r.lines };
    }
    const d = dpSvDay(i, x.ok);
    return { ...base, number: n, figures: [svSunk(d.log) + " of 5 wrecks", d.log.length + " of 30 dives"], listTitle: "Every dive", share: x.line, shareLines: [dpSvHead(n, d.log), ...svMarks(d.log)], lines: svLines(d.log) };
  };
  let DP_PZ;
  const dpStep = (b, rest) => /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("b", null, b), rest);
  let dpSeeResult;
  const dpMono = (text) => ({ type: "mono", text });
  const dpChEnds = (t) => [t.w[0], ...t.w.slice(1, -1).map((w) => w[0] + " …"), t.w[t.w.length - 1]].join("\n");
  const dpSessAt = (k) => k === "chain" ? ["Screens", "7. Session page: "] : ["Daily puzzles 1213", "Session page: "];
  const dpEarlier = (k, ok) => () => {
    const x = PZ[k].all.find((e) => e.i > 0 && e.played && e.ok === ok);
    return x.sid;
  };
  let DP_SESSION_STATES;
  let DP_PZ_STATES;
  let DP_STATES;
  function initGsWhereChainSalvage() {
    Object.assign(GS_NAME, { where: "Where", chain: "Chain", salvage: "Salvage" });
    Object.assign(GS_GAMES, {
      where: gsAccess({
        access: "pass",
        name: GS_NAME.where,
        category: "PUZZLE",
        art: "where",
        route: "where",
        ed: ["country", "countries"],
        edLine: "You get six guesses to find the country.",
        daily: true,
        once: true,
        blurb: "Today’s country is somewhere on the map. Find it in six guesses.",
        tags: ["Daily", "5 min"]
      }),
      chain: gsAccess({
        access: "pass",
        name: GS_NAME.chain,
        category: "PUZZLE",
        art: "chain",
        route: "chain",
        ed: ["chain", "chains"],
        edLine: "You get both ends. Find the words between.",
        daily: true,
        once: true,
        blurb: "Every word in the line joins the next. Find the ones in between.",
        tags: ["Daily", "10 min"]
      }),
      salvage: gsAccess({
        access: "pass",
        name: GS_NAME.salvage,
        category: "PUZZLE",
        art: "salvage",
        route: "salvage",
        ed: ["sea", "seas"],
        edLine: "You get thirty dives to find five wrecks.",
        daily: true,
        once: true,
        blurb: "Five wrecks lie under today’s sea. Find them in thirty dives.",
        tags: ["Daily", "15 min"]
      })
    });
    GS_GAME_ORDER.splice(GS_GAME_ORDER.indexOf("mystery") + 1, 0, ...DP_IDS);
    Object.assign(GS_ART, {
      where: { ground: "forest", extend: "centre", svg: GS_SVG('<rect width="160" height="120" fill="#163328"/><g transform="rotate(45 52 60)"><path d="M52 32L60 60L44 60Z" fill="#D66847"/><path d="M44 60L60 60L52 88Z" fill="#F2EBE0"/></g><rect x="96" y="44" width="32" height="32" fill="#E5A63B"/>') },
      chain: { ground: "wine", extend: "centre", svg: GS_SVG('<rect width="160" height="120" fill="#421A28"/><rect x="20" y="57" width="21" height="6" fill="#F2EBE0"/><rect x="119" y="57" width="21" height="6" fill="#F2EBE0"/><rect x="11" y="51" width="18" height="18" fill="#F2EBE0"/><rect x="131" y="51" width="18" height="18" fill="#F2EBE0"/><rect x="42.5" y="52.5" width="15" height="15" fill="none" stroke="#D66847" stroke-width="3"/><rect x="72.5" y="52.5" width="15" height="15" fill="none" stroke="#E5A63B" stroke-width="3"/><rect x="102.5" y="52.5" width="15" height="15" fill="none" stroke="#A390B2" stroke-width="3"/>') },
      salvage: { ground: "indigo", extend: "centre", svg: GS_SVG('<rect width="160" height="120" fill="#1D1B3A"/><circle cx="32" cy="60" r="6" fill="#F2EBE0"/><circle cx="104" cy="36" r="6" fill="#F2EBE0"/><circle cx="56" cy="84" r="6" fill="#F2EBE0"/><circle cx="128" cy="84" r="6" fill="#F2EBE0"/><circle cx="56" cy="60" r="6" fill="#D66847"/><circle cx="80" cy="60" r="6" fill="#D66847"/>') }
    });
    Object.assign(GS_ART_LOCAL, {
      where: { bg: "is-forest", body: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, I("ga-wh-needle"), I("ga-wh-ans")) },
      chain: { bg: "is-wine", body: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, I("ga-ch-l ga-ch-l1"), I("ga-ch-l ga-ch-l2"), I("ga-ch ga-ch-1"), I("ga-ch ga-ch-o ga-ch-2"), I("ga-ch ga-ch-o ga-ch-3"), I("ga-ch ga-ch-o ga-ch-4"), I("ga-ch ga-ch-5")) },
      salvage: { bg: "", body: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, I("ga-sv-p ga-sv-miss ga-sv-m1"), I("ga-sv-p ga-sv-miss ga-sv-m2"), I("ga-sv-p ga-sv-miss ga-sv-m3"), I("ga-sv-p ga-sv-miss ga-sv-m4"), I("ga-sv-hull"), I("ga-sv-p ga-sv-hit ga-sv-h1"), I("ga-sv-p ga-sv-hit ga-sv-h2"), I("ga-sv-p ga-sv-hit ga-sv-h3")) }
    });
    Object.assign(GS_RESULT, {
      where: (r) => r.ok ? "Found in " + r.guesses + " of 6" : "Not found",
      chain: (r) => r.given ? r.found + " of " + r.of + " words found" : "Solved, " + dpWrong(r.wrong),
      salvage: (r) => r.found === 5 ? "All 5 wrecks, " + r.dives + " of 30 dives" : r.found + " of 5 wrecks found"
    });
    WH_TODAY = { a: "Hungary", g: [["Spain", 1110], ["Poland", 80]], hint: "From Poland, the country lies south" };
    WH_OK = [
      { a: "Portugal", g: [["Italy", 1020], ["France", 400], ["Spain", 0]], hint: "From Spain, the country lies west" },
      { a: "Belgium", g: [["Spain", 810], ["Germany", 0]] },
      { a: "Austria", g: [["Poland", 170], ["Italy", 0]], hint: "From Italy, the country lies north" },
      { a: "Finland", g: [["Greece", 2e3], ["Estonia", 60], ["Sweden", 0]] },
      { a: "Czechia", g: [["Hungary", 60], ["Germany", 0]] },
      { a: "Ireland", g: [["France", 410], ["United Kingdom", 0]], hint: "From the United Kingdom, the country lies west" }
    ];
    WH_FAIL = { a: "Slovenia", g: [["Greece", 720], ["Serbia", 200], ["Hungary", 0], ["Austria", 0], ["Croatia", 0], ["Italy", 0]], hint: "From Croatia, the country lies north" };
    DP_NUM = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight"];
    CH_TODAY = { w: ["SNOW", "BALL", "ROOM", "SERVICE", "STATION", "WAGON"], p: [["BALL", 1], ["RACE", 2], ["ROOM", 2], ["STATION", 4], ["SUITE", 3], ["SERVICE", 3]] };
    CH_OK = [
      { w: ["RAIN", "BOW", "TIE", "BREAK", "FAST", "FOOD"], p: [["BOW", 1], ["TIE", 2], ["FROZEN", 4], ["FAST", 4], ["BREAK", 3]] },
      { w: ["SEA", "SHELL", "FISH", "CAKE", "WALK"], p: [["SHORE", 1], ["SHELL", 1], ["FISH", 2], ["CAT", 3], ["CAKE", 3]] },
      { w: ["HEAD", "LINE", "UP", "TOWN", "HALL"], p: [["LIGHT", 1], ["LINE", 1], ["TOWN", 3], ["UP", 2]] },
      { w: ["MOON", "LIGHT", "HOUSE", "BOAT", "YARD"], p: [["LIGHT", 1], ["BOAT", 3], ["HOUSE", 2]] },
      { w: ["KEY", "BOARD", "WALK", "WAY", "SIDE", "CAR"], p: [["BOARD", 1], ["SIDE", 4], ["WAY", 3], ["WAR", 2], ["WALK", 2]] },
      { w: ["HAND", "BAG", "PIPE", "LINE", "DANCE"], p: [["BALL", 1], ["BAG", 1], ["LINE", 3], ["PIPE", 2]] }
    ];
    CH_HARD = { w: ["SNOW", "BALL", "ROOM", "SERVICE", "STATION", "TRAIN", "WAGON"], p: [
      ["BELL", 1],
      ["BULL", 1],
      ["BAIL", 1],
      ["BALL", 1],
      ["ROAM", 2],
      ["ROOF", 2],
      ["ROBE", 2],
      ["SERVER", 3],
      ["SURVEY", 3],
      ["SURFACE", 3],
      ["SERVING", 3],
      ["SERVANT", 3],
      ["SEVERE", 3],
      ["STATE", 4],
      ["STAGE", 4],
      ["STATUS", 4],
      ["STATIC", 4],
      ["STATION", 4],
      ["TRAM", 5],
      ["TRAIL", 5],
      ["TRAIN", 5]
    ] };
    CH_FAIL = { w: ["GOLD", "FISH", "BONE", "DRY", "CLEAN"], p: [["FINCH", 1], ["FISH", 1], ["DUST", 3], ["DRY", 3], ["BALL", 2], ["BOWL", 2], ["BOAT", 2]] };
    SV_COLS = "ABCDEFGH";
    SV_TODAY = [[[1, 1], [2, 1], [3, 1], [4, 1]], [[6, 0], [6, 1], [6, 2]], [[0, 4], [0, 5], [0, 6]], [[3, 4], [4, 4]], [[6, 6], [7, 6]]];
    SV_TODAY_DIVES = svReplay(SV_TODAY, ["D4", "E2", "E3", "E1", "F2", "D2", "C2", "B2", "G2", "G3", "G1", "A6", "A5", "A7", "E6", "E5", "F5", "D5", "G6", "H8", "G7", "H7"].map((s) => [SV_COLS.indexOf(s[0]), +s.slice(1) - 1]));
    SV_TODAY_HINT = { at: 11, what: "Sonar on column A", said: "3 wreck squares" };
    dpSvDay = /* @__PURE__ */ (() => {
      const memo = {};
      return (i, ok) => {
        const k = i + (ok ? "y" : "n");
        if (memo[k]) return memo[k];
        for (let s = i * 13 + 1; s < i * 13 + 3e3; s++) {
          const ships = svLayout(s);
          const log = svPlay(ships, s);
          if (svSunk(log) === (ok ? 5 : 3)) return memo[k] = { ships, log };
        }
        return memo[k] = { ships: SV_TODAY, log: SV_TODAY_DIVES };
      };
    })();
    dpWhT = dpWhere(WH_TODAY, true);
    dpChT = dpChain(CH_TODAY);
    dpChL = dpChain({ ...CH_TODAY, p: CH_TODAY.p.slice(0, 3) });
    dpSvL = SV_TODAY_DIVES.slice(0, 11);
    Object.assign(GS_SESSIONS, {
      "where-today": {
        kind: "puzzle",
        gid: "where",
        game: GS_NAME.where,
        art: "where",
        number: DP_NO,
        hints: 1,
        result: GS_RESULT.where({ ok: true, guesses: dpWhT.guesses }),
        date: GS.today,
        figures: [dpWhT.guesses + " of 6 guesses", "1 hint"],
        listTitle: "Every guess",
        share: GS_RESULT.where({ ok: true, guesses: dpWhT.guesses }),
        shareLines: [dpWhHead(DP_NO, dpWhT, true), dpWhT.marks],
        lines: dpWhT.lines
      },
      "where-live": {
        kind: "puzzle",
        gid: "where",
        game: GS_NAME.where,
        art: "where",
        number: DP_NO,
        hints: 0,
        live: true,
        result: "In progress",
        date: GS.today,
        figures: ["2 of 6 guesses", "No hints"],
        listTitle: "Every guess",
        share: null,
        lines: dpWhT.lines.slice(0, 2)
      },
      "chain-today": {
        kind: "puzzle",
        gid: "chain",
        game: GS_NAME.chain,
        art: "chain",
        number: DP_NO,
        play: CH_TODAY,
        result: dpChResult(dpChT),
        date: GS.today,
        figures: [dpChT.words + " words", dpWrong(dpChT.wrong).replace(/^./, (c) => c.toUpperCase())],
        listTitle: "Every guess",
        share: dpChResult(dpChT),
        shareLines: [dpChHead(DP_NO, dpChT), dpChT.marks],
        lines: dpChT.lines
      },
      "chain-live": {
        kind: "puzzle",
        gid: "chain",
        game: GS_NAME.chain,
        art: "chain",
        number: DP_NO,
        play: { ...CH_TODAY, p: CH_TODAY.p.slice(0, 3) },
        live: true,
        result: "In progress",
        date: GS.today,
        figures: [dpChL.found + " of " + dpChL.hidden + " words", dpWrong(dpChL.wrong).replace(/^./, (c) => c.toUpperCase())],
        listTitle: "Every guess",
        share: null,
        lines: dpChL.lines
      },
      "salvage-today": {
        kind: "puzzle",
        gid: "salvage",
        game: GS_NAME.salvage,
        art: "salvage",
        number: DP_NO,
        hints: 1,
        result: GS_RESULT.salvage({ found: 5, dives: SV_TODAY_DIVES.length }),
        date: GS.today,
        figures: ["5 of 5 wrecks", SV_TODAY_DIVES.length + " of 30 dives", "1 hint"],
        listTitle: "Every dive",
        share: GS_RESULT.salvage({ found: 5, dives: SV_TODAY_DIVES.length }),
        shareLines: [dpSvHead(DP_NO, SV_TODAY_DIVES, true), ...svMarks(SV_TODAY_DIVES)],
        lines: svLines(SV_TODAY_DIVES, SV_TODAY_HINT)
      },
      "salvage-live": {
        kind: "puzzle",
        gid: "salvage",
        game: GS_NAME.salvage,
        art: "salvage",
        number: DP_NO,
        live: true,
        result: "In progress",
        date: GS.today,
        figures: [svSunk(dpSvL) + " of 5 wrecks", dpSvL.length + " of 30 dives"],
        listTitle: "Every dive",
        share: null,
        lines: svLines(dpSvL)
      }
    });
    DP_IDS.forEach((k) => {
      GS_TODAY_PLAYED.pass[k] = k + "-today";
    });
    DP_PZ = {
      where: {
        count: DP_NO,
        no: (i) => GS_NAME.where + " #" + (DP_NO - i),
        salt: 7,
        keep: {},
        today: "where-today",
        liveSid: "where-live",
        ok: (i) => GS_RESULT.where({ ok: true, guesses: dpWhere(WH_OK[i % WH_OK.length], true).guesses }),
        bad: GS_RESULT.where({ ok: false }),
        title: "Today’s country",
        next: "Next country: tomorrow",
        live: { line: "You’ve used 2 of your 6 guesses. The closer one was " + dpKm(WH_TODAY.g[1][1]) + " away.", bar: ["Guess 2 of 6", 2, 6] },
        done: { st: { kind: "ok", label: GS_SESSIONS["where-today"].result }, line: "You found the country on your third guess, with the hint.", bar: ["Guess " + dpWhT.guesses + " of 6", dpWhT.guesses, 6] },
        recent: "Your countries",
        ach: [
          { k: "wh1", n: "Found", how: "Find the country in a Where.", by: (p) => p.status.kind === "ok" },
          { k: "wh0", n: "Found without the hint", how: "Find the country without taking the hint.", by: (p) => {
            const s = GS_SESSIONS[p.sid];
            return p.status.kind === "ok" && !!s && !s.hints;
          } },
          { k: "wh7", n: "Seven days in a row", how: "Find the country seven days running.", of: 7 }
        ]
      },
      chain: {
        count: DP_NO,
        no: (i) => GS_NAME.chain + " #" + (DP_NO - i),
        salt: 8,
        keep: {},
        today: "chain-today",
        liveSid: "chain-live",
        ok: (i) => dpChResult(dpChain(CH_OK[i % CH_OK.length])),
        bad: dpChResult(dpChain(CH_FAIL)),
        title: "Today’s chain",
        next: "Next chain: tomorrow",
        live: { line: "You’ve found " + dpChL.found + " of the " + dpChL.hidden + " words, with " + dpWrong(dpChL.wrong).replace(/^1 /, "one ") + ".", bar: [dpChL.found + " of " + dpChL.hidden + " words", dpChL.found, dpChL.hidden] },
        done: { st: { kind: "ok", label: GS_SESSIONS["chain-today"].result }, line: "You found all " + dpChT.hidden + " words with two wrong guesses.", bar: [dpChT.hidden + " of " + dpChT.hidden + " words", dpChT.hidden, dpChT.hidden] },
        recent: "Your chains",
        ach: [
          { k: "ch1", n: "Solved", how: "Find every word in a Chain.", by: (p) => p.status.kind === "ok" },
          { k: "ch0", n: "Solved with no wrong guesses", how: "Find every word in a Chain without a wrong guess.", by: (p) => p.status.label === GS_RESULT.chain({ wrong: 0 }) },
          { k: "ch7", n: "Seven days in a row", how: "Solve Chain seven days running.", of: 7 }
        ]
      },
      salvage: {
        count: DP_NO,
        no: (i) => GS_NAME.salvage + " #" + (DP_NO - i),
        salt: 12,
        keep: {},
        today: "salvage-today",
        liveSid: "salvage-live",
        ok: (i) => GS_RESULT.salvage({ found: 5, dives: dpSvDay(i, true).log.length }),
        bad: GS_RESULT.salvage({ found: 3 }),
        // tag: not a launch game, so its now card keeps the finished result as the tag with its icon.
        title: "Today’s sea",
        next: "Next sea: tomorrow",
        tag: true,
        live: { line: "You’ve found " + svSunk(dpSvL) + " of the 5 wrecks in " + dpSvL.length + " dives.", bar: [dpSvL.length + " of 30 dives", dpSvL.length, 30] },
        done: { st: { kind: "ok", label: GS_SESSIONS["salvage-today"].result }, line: "You found all five wrecks with " + (30 - SV_TODAY_DIVES.length) + " dives to spare, and one hint.", bar: [SV_TODAY_DIVES.length + " of 30 dives", SV_TODAY_DIVES.length, 30] },
        recent: "Your seas",
        ach: [
          { k: "sv1", n: "Every wreck found", how: "Find all five wrecks in a Salvage.", by: (p) => p.status.kind === "ok" },
          { k: "sv5", n: "Five dives to spare", how: "Find all five wrecks in 25 dives or fewer.", by: (p) => {
            const m = /^All 5 wrecks, (\d+) of 30/.exec(p.status.label);
            return !!m && +m[1] <= 25;
          } },
          { k: "sv7", n: "Seven days in a row", how: "Find every wreck seven days running.", of: 7 }
        ]
      }
    };
    dpSeeResult = /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("b", null, "See your result"), " on your session page.");
    Object.assign(GS_PAGES, {
      where: {
        rhythm: "NEW EVERY DAY",
        box: {
          label: "ONLY WITH THE PASS",
          heading: "A new country every day",
          button: "Play today’s country",
          steps: [GS_STEP_CONNECT, dpStep("Find today’s country.", " You get six guesses."), dpSeeResult],
          small: GS_NAME.where + " comes only with the After Pixels Pass."
        },
        facts: { long: "5 min", often: "New every day" },
        tags: [],
        pitch: { h: "Today’s country is out there. Find it in six guesses.", ps: [
          "Name any country. The game tells you how far it lies from today’s, border to border. Zero means the two touch.",
          "You get one hint: the compass direction from your last guess. Your AI isn’t told the answer until you finish. Name your first country."
        ] },
        who: { ai: "Passes on your guesses and tells you about the country once you’ve found it.", server: "Holds the country, measures every distance and counts your guesses." },
        week: { title: "Today’s country", line: "You get six guesses and one hint.", session: "where-today" }
      },
      chain: {
        rhythm: "NEW EVERY DAY",
        box: {
          label: "ONLY WITH THE PASS",
          heading: "A new chain every day",
          button: "Play today’s chain",
          steps: [GS_STEP_CONNECT, dpStep("Fill in today’s chain", ", working in from either end."), dpSeeResult],
          small: GS_NAME.chain + " comes only with the After Pixels Pass."
        },
        facts: { long: "10 min", often: "New every day" },
        tags: [],
        pitch: { h: "Fire joins house, and house joins plant. Find the words in between.", ps: [
          "You see both ends of the line and the first letter of every word between. Guess inward from either end, one word at a time.",
          "A wrong guess shows you the next letter of that word. Run out of letters and the word is given away. Make your first guess."
        ] },
        who: { ai: "Passes on your guesses and explains every link once the chain is done.", server: "Holds the chain, checks every guess and shows a letter for each miss." },
        week: { title: "Today’s chain", line: "You get both ends and every first letter.", session: "chain-today" }
      },
      salvage: {
        rhythm: "NEW EVERY DAY",
        box: {
          label: "ONLY WITH THE PASS",
          heading: "A new sea every day",
          button: "Play today’s sea",
          steps: [GS_STEP_CONNECT, dpStep("Find today’s five wrecks.", " You get thirty dives."), dpSeeResult],
          small: GS_NAME.salvage + " comes only with the After Pixels Pass."
        },
        facts: { long: "15 min", often: "New every day" },
        tags: [],
        pitch: { h: "Five wrecks lie somewhere under you. Find them in thirty dives.", ps: [
          "Call a square from A1 to H8 and dive. Each dive comes back as a hit, a miss or sunk.",
          "Your AI reads the sea back to you after every dive, row by row. The game engine holds the wrecks. Call your first square."
        ] },
        who: { ai: "Reads the sea back to you after every dive, row by row.", server: "Holds the wrecks, answers every dive and counts the dives you have left." },
        week: { title: "Today’s sea", line: "You get thirty dives to find five wrecks.", session: "salvage-today" }
      }
    });
    Object.assign(GS_CHATS, {
      where: [
        { cap: "Name a country. Everyone hunts the same one today.", turns: [
          gscU("I want to play Where."),
          gscAi("where", ["Where #" + DP_NO + ". Today’s country is hidden, and you have six guesses.", "Each miss tells you how far it is from today’s country, border to border. Name your first country."])
        ] },
        { cap: "Every miss comes back as a distance, measured border to border.", turns: [
          gscU("Spain."),
          gscAi("where", "Spain is " + dpKm(1110) + " from today’s country. 5 guesses left."),
          gscU("Poland."),
          gscAi("where", "Poland is " + dpKm(80) + " away. 4 guesses left.")
        ] },
        { cap: "You get one hint: the compass direction from your last guess.", turns: [
          gscU("Give me the hint."),
          gscAi("where", "From Poland, today’s country lies south. That was your one hint."),
          gscU("Hungary."),
          gscAi("where", ["Found in 3 of 6, with the hint.", "Hungary sits in the Carpathian Basin, and the Danube runs through Budapest."])
        ] }
      ],
      chain: [
        { cap: "You get both ends of the line and every first letter.", turns: [
          gscU("I want to play Chain."),
          gscAi("chain", ["Chain #" + DP_NO + ". Six words, each joined to the next. Guess inward from either end."], null, [dpMono(dpChEnds(CH_TODAY))])
        ] },
        { cap: "A wrong guess shows you the next letter.", turns: [
          gscU("Ball."),
          gscAi("chain", "Ball is right: snowball."),
          gscU("Race."),
          gscAi("chain", "Not race. The next word starts RO.")
        ] },
        { cap: "Afterwards, your AI explains every link.", turns: [
          gscU("Service."),
          gscAi("chain", ["Service is right. The chain is done, with 2 wrong guesses.", "Snowball, ballroom, room service, service station, station wagon."])
        ] }
      ],
      salvage: [
        { cap: "Five wrecks lie somewhere under an eight-by-eight sea.", turns: [
          gscU("I want to play Salvage."),
          gscAi("salvage", ["Salvage #" + DP_NO + ". Five wrecks lie below: one of 4 squares, two of 3 and two of 2. None of them touch.", "You have 30 dives. Call your first square."], null, [dpMono(svBoard(SV_TODAY, []))])
        ] },
        { cap: "Each dive comes back as a hit, a miss or sunk.", turns: [
          gscU("E2."),
          gscAi("salvage", "Hit. 29 dives left."),
          gscU("E3."),
          gscAi("salvage", "Miss. 28 dives left.")
        ] },
        { cap: "The board is redrawn after every dive, so your AI can read it aloud.", turns: [
          gscU("B2."),
          gscAi("salvage", "Sunk: the wreck of 4. " + (30 - 8) + " dives left.", null, [dpMono(svBoard(SV_TODAY, SV_TODAY_DIVES.slice(0, 8)))])
        ] }
      ]
    });
    DP_SESSION_STATES = ["where", "chain"].flatMap((k) => {
      const n = GS_NAME[k];
      const [g, sp] = dpSessAt(k);
      const open = (id, extra) => (c) => {
        c.setView("pass");
        c.setConnected(true);
        if (extra) c.setReview(extra);
        c.go("session", { id: typeof id === "function" ? id() : id });
      };
      return [
        { group: g, id: "session-" + k + "-in-progress", label: sp + n + " in progress", stage: open(k + "-live", { week: "live" }) },
        { group: g, id: "session-" + k + "-failed", label: sp + n + ", an earlier play that failed", stage: open(dpEarlier(k, false)) },
        { group: g, id: "session-" + k + "-earlier", label: sp + n + ", an earlier play (played once)", stage: open(dpEarlier(k, true)) }
      ];
    });
    DP_PZ_STATES = DP_IDS.flatMap((k) => {
      const n = GS_NAME[k];
      const g = "Daily puzzles 1213";
      return [
        { group: g, id: k + "-signed-out", label: n + ", signed out", stage: (c) => c.go(k) },
        { group: g, id: k + "-free", label: n + ", free account (Get the Pass)", stage: (c) => {
          c.setView("free");
          c.setConnected(true);
          c.go(k);
        } },
        { group: g, id: k + "-pass", label: n + ", with the Pass (played today)", stage: (c) => {
          c.setView("pass");
          c.setConnected(true);
          c.go(k);
        } },
        { group: g, id: "library-" + k, label: n + " in your library, with the Pass", stage: (c) => {
          c.setView("pass");
          c.setConnected(true);
          c.go(k, { page: "record" });
        } },
        { group: g, id: "library-" + k + "-in-progress", label: n + " in your library, today in progress", stage: (c) => {
          c.setView("pass");
          c.setConnected(true);
          c.setReview({ week: "live" });
          c.go(k, { page: "record" });
        } },
        { group: g, id: "library-" + k + "-free", label: n + " in your library, free account (Needs the Pass)", stage: (c) => {
          c.setView("free");
          c.setConnected(true);
          c.go(k, { page: "record" });
        } },
        { group: g, id: "library-" + k + "-editions", label: n + ": every " + GS_GAMES[k].ed[0] + " (the editions list)", stage: (c) => {
          c.setView("pass");
          c.setConnected(true);
          c.go(k, { page: "record", list: true });
        } },
        ...k === "chain" ? [
          { group: g, id: "library-chain-never-played", label: "Chain in your library, with the Pass, not yet played", stage: (c) => {
            c.setView("pass");
            c.setConnected(true);
            c.setReview({ never: "chain" });
            c.go(k, { page: "record" });
          } },
          { group: g, id: "library-chain-failed", label: "Chain in your library, today failed (a word given away)", stage: (c) => {
            c.setView("pass");
            c.setConnected(true);
            c.setReview({ chain: "failed" });
            c.go(k, { page: "record" });
          } },
          { group: g, id: "library-chain-hard", label: "Chain in your library, a hard day (21 guesses)", stage: (c) => {
            c.setView("pass");
            c.setConnected(true);
            c.setReview({ chain: "hard" });
            c.go(k, { page: "record" });
          } }
        ] : [],
        { group: dpSessAt(k)[0], id: "session-" + k, label: k === "chain" ? dpSessAt(k)[1] + n : "Session page: " + n + " today, with Share", stage: (c) => {
          c.setView("pass");
          c.setConnected(true);
          c.go("session", { id: k + "-today" });
        } }
      ];
    });
    DP_STATES = [...DP_PZ_STATES, ...DP_SESSION_STATES];
  }
  const HG_ENDS = ["Home by the fire", "Slept at the springs", "Slept in the cave mouth", "Home with full hands", "Slept out on the plain"];
  const HG_POOL = {
    Slept: ["At the fire, by Aunt", "At the springs", "In the cave mouth", "At the fire, with the band", "Out on the plain"],
    Joined: ["The ibex hunt, and the meeting of the bands", "The walk to the springs", "Digging roots with Aunt", "The reindeer watch", "Painting at the wall"],
    With: ["Aunt and the two hunters", "The gatherers", "Aunt", "The whole band", "The old storyteller"],
    Made: ["A bone needle", "A flint scraper", "A carrying bag", "Nothing", "A shell bead"],
    Saw: ["Ibex and a cave lion", "Horses at the river", "A herd of reindeer", "A woolly rhino, far off", "Cave bears asleep"],
    Weather: ["Hot, then thunder at dusk", "Cold wind all day", "Clear and dry", "Rain until midday", "Mist over the river"]
  };
  const HG_EARNS = { 6: ["fire"], 7: ["dusk", "hunters"], 9: ["aunt"], 10: ["springs"], 11: ["hands"] };
  let HG_DAYS;
  let HG_LATEST;
  const hgSid = (x) => "hunter-" + x.id;
  const hgStatus = (x) => ({ kind: x.restarted ? "none" : "ok", label: GS_RESULT.hunter({ restarted: !!x.restarted }) });
  const hgFact = (p, k) => {
    const f = p.src.facts.find(([n]) => n === k);
    return f ? f[1] : null;
  };
  let HG_ACH;
  let HG_BADGES;
  const HgLatest = ({ day, last }) => {
    const gs = useGs();
    const facts = day.facts.filter(([k]) => ["Slept", "With", "Made"].includes(k));
    return /* @__PURE__ */ React$1.createElement("section", { className: "lb-card" }, /* @__PURE__ */ React$1.createElement("div", { className: "lb-top" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-xs" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-label" }, (last ? "YOUR LAST DAY · " : "YOUR LATEST DAY · ") + day.date.toUpperCase()), /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-sec" }, day.end || hgStatus(day).label)), /* @__PURE__ */ React$1.createElement(DS.TextLink, { onClick: () => gs.go("session", { id: hgSid(day) }) }, "See the whole day")), /* @__PURE__ */ React$1.createElement("dl", { className: "lb-facts" }, facts.map(([k, v]) => /* @__PURE__ */ React$1.createElement("div", { key: k }, /* @__PURE__ */ React$1.createElement("dt", null, k), /* @__PURE__ */ React$1.createElement("dd", null, v)))));
  };
  const hgWeeks = (plays) => Array.from({ length: 10 }, (_, i) => {
    const end = new Date(2026, 9, 11 - 7 * i);
    const start = new Date(2026, 9, 5 - 7 * i);
    return { id: "hw" + i, date: lbDate(start), played: plays.some((p) => p.src.d >= start && p.src.d < end) };
  });
  const HgLeft = ({ plays }) => /* @__PURE__ */ React$1.createElement(LbRun, { n: plays.filter((p) => p.status.kind === "ok").length, unit: "weeks", figure: "days played", on: "Played", legend: "Not played", weeks: lbRunOf(hgWeeks(plays)) });
  const HgNone = () => {
    const gs = useGs();
    return /* @__PURE__ */ React$1.createElement("section", { className: "lb-card" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-xs" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-label" }, "YOUR FIRST DAY"), /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-sec" }, "Grey dawn below Chauvet cave")), /* @__PURE__ */ React$1.createElement("p", null, "Start your first day at camp in any chat, and go where you like."), /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement(DS.Button, { onClick: () => gs.play(GS_NAME.hunter) }, "Play")));
  };
  const HgLibrary = () => {
    const gs = useGs();
    const access = lbAccess(gs, "hunter");
    const pass = access === "all";
    const past = lbPast(gs);
    const k = gs.view + (gs.sub.hadPass ? "u" : "");
    if (!pass && !past) return /* @__PURE__ */ React$1.createElement("main", { key: k, className: "gs-wrap gs-main" }, /* @__PURE__ */ React$1.createElement(LbHead, { id: "hunter" }), /* @__PURE__ */ React$1.createElement("div", { className: "lb-lay" }, /* @__PURE__ */ React$1.createElement(LbNeedsPass, { id: "hunter", ach: HG_ACH, access })));
    const plays = phVisible(gs).filter((p) => p.gid === "hunter");
    const latest = plays[0] ? plays[0].src : null;
    const ach = phAch(gs, "hunter", HG_ACH);
    return /* @__PURE__ */ React$1.createElement("main", { key: k, className: "gs-wrap gs-main" }, /* @__PURE__ */ React$1.createElement(LbHead, { id: "hunter" }), /* @__PURE__ */ React$1.createElement("div", { className: "lb-lay" }, !pass && /* @__PURE__ */ React$1.createElement(LbNeedsPass, { id: "hunter", had: true, ach, access }), !latest ? /* @__PURE__ */ React$1.createElement(HgNone, null) : /* @__PURE__ */ React$1.createElement(HgLatest, { day: latest, last: !pass }), pass && /* @__PURE__ */ React$1.createElement(HgLeft, { plays }), /* @__PURE__ */ React$1.createElement(LbAch, { items: ach, badges: HG_BADGES, access }), /* @__PURE__ */ React$1.createElement(LbRecent, { title: "Your days", allLabel: "See in History", empty: "Your days appear here once you have played one." })));
  };
  const HG_EDITIONS = [["The Reindeer Summer", "5 October"], ["The Summer at the Springs", "28 September"], ["The Summer of the Ibex", "21 September"]];
  const registerHunterLibrary = () => {
    GS_LIBRARY.hunter = HgLibrary;
    GS_EDITIONS.hunter = (gs) => edSample(gs, "hunter", HG_EDITIONS);
  };
  function initGsHunterLibrary() {
    HG_DAYS = Array.from({ length: 18 }, (_, i) => {
      const d = new Date(2026, 9, 5 - 3 * i - i % 2);
      const restarted = i % 5 === 3;
      return {
        id: "hg" + i,
        d,
        date: lbDate(d),
        month: lbMonth(d),
        played: true,
        restarted,
        title: "Day " + (18 - i),
        end: restarted ? null : HG_ENDS[i % 5],
        earns: HG_EARNS[i] || [],
        // Where you slept agrees with how the day ended (HG_ENDS and HG_POOL.Slept share an order).
        facts: Object.entries(HG_POOL).map(([k, v], n) => [k, k === "Slept" ? v[i % 5] : v[i * (n + 2) % v.length]])
      };
    });
    HG_LATEST = HG_DAYS[0];
    HG_DAYS.forEach((x) => {
      GS_SESSIONS[hgSid(x)] = {
        kind: "day",
        gid: "hunter",
        noEd: true,
        game: GS_NAME.hunter,
        art: "hunter",
        title: x.title,
        result: hgStatus(x).label,
        date: x.d.toLocaleString("en-GB", { weekday: "long" }) + " " + x.date,
        figures: x.end ? [x.title, x.end] : [x.title],
        listTitle: "The day",
        share: null,
        lines: x.facts
      };
    });
    GS_SESSIONS.hunter = GS_SESSIONS[hgSid(HG_LATEST)];
    HG_ACH = [
      ["fire", "Fed the Fire"],
      ["aunt", "Dug with Aunt"],
      ["dusk", "One of Us at Dusk"],
      ["hunters", "Walked with the Hunters"],
      ["wall", "A Line on the Wall"],
      ["walk", "The Long Walk"],
      ["springs", "Met at the Springs"],
      ["hands", "Home with Full Hands"],
      ["meat", "Meat Home Whole"]
    ].map(([k, n]) => ({ k, n, how: "Earn it in a day at camp.", by: (p) => p.src.earns.includes(k) })).concat([
      { k: "big", n: "The Big Animals", how: "See every big animal, over many days.", of: 6, count: lbDistinct((p) => hgFact(p, "Saw")) },
      { k: "three", n: "Hunt, Springs and Wall", how: "Join all three set moments, over many days.", of: 3, count: lbDistinct((p) => {
        const j = hgFact(p, "Joined") || "";
        return /hunt/.test(j) ? "hunt" : /springs/.test(j) ? "springs" : /wall/.test(j) ? "wall" : null;
      }) },
      { k: "made", n: "Made Something", how: "Make things in camp, over many days.", of: 5, count: lbDistinct((p) => {
        const m = hgFact(p, "Made");
        return m === "Nothing" ? null : m;
      }) },
      { k: "quarrel", n: "Eased a Quarrel", how: "Ease quarrels in the band, over many days.", of: 3, count: () => [] }
    ]);
    HG_BADGES = lbAutoBadges(HG_ACH);
  }
  const PH_TODAY = new Date(2026, 9, 6);
  const PH_MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const phParse = (s) => {
    const [d, m, y] = s.split(" ");
    return new Date(+(y || 2026), PH_MON.indexOf(m), +d);
  };
  const phAt = (d, h, m, plus = 0) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + plus, h, m);
  const phDay0 = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const phDayKey = (d) => d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
  const phDayLabel = (d) => {
    const n = Math.round((phDay0(d) - PH_TODAY) / 864e5);
    return n === 0 ? "Today" : n === -1 ? "Yesterday" : d.toLocaleString("en-GB", { weekday: "long" }) + " " + lbDate(d);
  };
  const phTime = (d) => String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  const phShort = (d) => lbShort(lbDate(d));
  const edName = (e) => e.title ? e.title : "#" + e.n;
  const edLabel = (e) => GS_GAMES[e.gid].name + (e.title ? " · " + e.title : " #" + e.n);
  let ED_NONE;
  const edList = (gs, gid) => edMore(gs, gid, GS_EDITIONS[gid](gs));
  const edPuzzle = (gs, gid) => {
    const signed = gs.view !== "out";
    const now = signed ? lbNow(gs, gid) : null;
    const c = PZ[gid];
    const fe = (x) => !!phFirstSt(gs, gid) && PH_FIRST[gid] === x.id;
    return c.all.map((x) => ({
      key: x.id,
      gid,
      n: c.weekly ? c.all.length - x.i : +c.no(x.i).split("#")[1],
      title: c.weekly ? x.title : null,
      date: x.date,
      month: x.month,
      free: true,
      now: x.i === 0,
      status: !signed ? null : fe(x) ? phFirstRec(gs, gid).status : x.i === 0 ? now ? now.status : ED_NONE : gsFresh(gs) ? ED_NONE : phUnf(gs, x.id) ? PH_UNF : pzStatus(c, x),
      open: !signed || gsFresh(gs) ? null : phUnf(gs, x.id) ? () => gs.go("session", { id: PH_UNF_EDS[x.id].sid }) : fe(x) ? phFirstRec(gs, gid).open && (() => phFirstRec(gs, gid).open(gs)) : x.i === 0 ? now ? now.open : null : x.sid ? () => gs.go("session", { id: x.sid }) : null
    }));
  };
  const edRuns = (gs, gid, src) => {
    const pass = gs.view === "pass";
    const signed = gs.view !== "out";
    const now = signed ? lbNow(gs, gid) : null;
    const all = src.all;
    const first = all[all.length - 1];
    const lapsed = gsLapsed(gs);
    const fresh = gsFresh(gs);
    const mine = (x) => !fresh && x.played && (pass || x === first && !!PH_FIRST[gid] || lapsed && lbOld(x.week || x.date, gs));
    return all.map((x, i) => {
      const curOld = i === 0 && !now && signed && lapsed && mine(x);
      const unf = signed && i > 0 && phUnf(gs, x.id);
      const played2 = i === 0 ? !!now || curOld : signed && mine(x);
      let st = !signed ? null : unf ? PH_UNF : i === 0 ? now ? now.status : curOld ? src.status(src.done) : ED_NONE : played2 ? src.status(x) : ED_NONE;
      const fr = x === first && phFirstSt(gs, gid) ? phFirstRec(gs, gid) : null;
      if (fr && !fresh) {
        st = fr.status;
        return { key: x.id, gid, n: all.length - i, title: x.title, date: x.week || x.date, month: x.month, free: true, now: false, status: st, open: fr.open && (() => fr.open(gs)) };
      }
      return {
        key: x.id,
        gid,
        n: all.length - i,
        title: x.title,
        date: x.week || x.date,
        month: x.month,
        free: x === first && !!PH_FIRST[gid],
        now: i === 0,
        status: st,
        open: unf ? () => gs.go("session", { id: PH_UNF_EDS[x.id].sid }) : !played2 ? null : i === 0 ? now ? now.open : () => src.openCur(gs, x) : () => src.open(gs, x)
      };
    });
  };
  const edSample = (gs, gid, list) => list.map(([title, date], i) => {
    const n = list.length - i;
    const d = phParse(date);
    return { key: gid + "-" + n, gid, n, title, date, month: PH_MON[d.getMonth()], free: false, now: i === 0, status: gs.view === "out" ? null : ED_NONE, open: null };
  });
  const edNeedsPass = (gs, e) => gs.view !== "pass" && (GS_GAMES[e.gid].free ? !e.now : !e.free);
  let PH_UNF;
  let PH_UNF_EDS;
  const phUnf = (gs, key) => {
    const u = PH_UNF_EDS[key];
    return !!u && !!(gs && gs.review && gs.review.unfinished) && !gsFresh(gs) && (GS_GAMES[u.gid].free || gs.view === "pass");
  };
  const phNorm = (q) => (q || "").trim().toLowerCase().replace(/^#/, "");
  const phWords = (s) => s.toLowerCase().replace(/(\d),(?=\d)/g, "$1").replace(/[’'‘]/g, "").split(/[^a-z0-9]+/).filter(Boolean);
  const phIsDate = (s) => phWords(s).some((w) => w.length >= 3 && PH_MON.some((m) => m.toLowerCase().startsWith(w)));
  const phMatch = (hay, s) => {
    if (!s) return true;
    hay = hay.toLowerCase();
    if (phIsDate(s)) return new RegExp("(^|[^0-9a-z])" + s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).test(hay);
    const hw = phWords(hay);
    return phWords(s).every((w) => /^\d+$/.test(w) ? hw.includes(w) : hw.some((h) => h.startsWith(w)));
  };
  let PH_META;
  const phMeta = () => {
    if (!PH_META) {
      PH_META = {};
      GS_GAME_ORDER.forEach((k) => edList({ view: "out", sub: {} }, k).forEach((e) => {
        PH_META[e.key] = e;
      }));
    }
    return PH_META;
  };
  const phHay = (gid, ed, title, d) => {
    const m = phMeta()[ed];
    return [GS_GAMES[gid].name, title || "", m ? m.n + " " + (m.title || "") : "", d ? lbDate(d) + " " + PH_MON[d.getMonth()] : ""].join(" ").toLowerCase();
  };
  let PH_EDS;
  let PH_PLAYS;
  const phEd = (gid, ed, edTitle, edDate, plays, cur) => {
    const e = { gid, ed, edTitle, edDate, plays: plays.map((p, n) => ({ ...p, gid, ed, edTitle, edDate, n, cur: !!cur, pid: ed + "-" + n })) };
    PH_EDS[ed] = e;
    PH_PLAYS.push(...e.plays);
  };
  const phSess = (id) => (gs) => gs.go("session", { id });
  let PH_LIVE;
  let PH_LIVE_SID;
  let PH_MORE;
  const phMoreOn = (gs) => !!(gs && gs.review && gs.review.several) && gs.view === "pass";
  let PH_MORE_PLAYS;
  const edMore = (gs, gid, list) => {
    const m = phMoreOn(gs) && PH_MORE[gid];
    if (!m) return list;
    return list.map((e) => ({ ...e, n: e.n + 1 })).concat([{ key: m.id, gid, n: 1, title: m.title, date: lbDate(m.d), month: lbMonth(m.d), free: false, now: false, status: PH_LIVE, open: () => gs.go("session", { id: m.sid }) }]);
  };
  let PH_ALL;
  let PH_BROKEN;
  let PH_UNF_PLAYS;
  const phCur = (p) => {
    const c = PZ[p.gid];
    if (!p.cur || !c || !p.now || c.today === p.sid) return p;
    const s = GS_SESSIONS[c.today];
    return { ...p, sid: c.today, status: { kind: s.loss ? "bad" : "ok", label: s.result }, open: phSess(c.today) };
  };
  const phLog = (gs) => {
    const l = (gs.review && gs.review.broken ? PH_ALL.filter((p) => p.ed !== "word1").concat(PH_BROKEN) : PH_ALL).map(phCur);
    const u = gs.review && gs.review.unfinished ? l.concat(PH_UNF_PLAYS.filter((p) => phUnf(gs, p.ed))) : l;
    return (phMoreOn(gs) ? u.concat(PH_MORE_PLAYS) : u).slice().sort((a, b) => b.at - a.at);
  };
  let PH_FIRST;
  let PH_FIRST_LIVE;
  const phFirstSt = (gs, gid) => PH_FIRST[gid] && GS_GAMES[gid].first && gs && gs.view && gs.view !== "pass" && gs.view !== "out" && cprFirstState ? cprFirstState(gs, gid) : null;
  const phFirstRec = (gs, gid) => {
    const e = PH_EDS[PH_FIRST[gid]];
    if (!e) return null;
    const p = e.plays[0];
    const st = phFirstSt(gs, gid);
    return { gid, ed: e.ed, st, at: p.at, date: lbDate(p.at), status: st === "live" ? PH_LIVE : st === "none" ? ED_NONE : p.status, open: st === "live" ? PH_FIRST_LIVE[gid] : st === "none" ? null : p.open };
  };
  const phVisible = (gs) => {
    if (gsFresh(gs)) return [];
    const live = !lbWeekDone(gs);
    const never = gs.review && gs.review.never;
    const bw = !!(cprFirstState && cprFirstState(gs, "barrow") === "done");
    let all = phLog(gs).filter((p) => (p.gid !== "barrow" || bw) && p.gid !== never).map((p) => live && p.now ? { ...p, ...p.now } : p);
    if (gs.view === "pass") return all;
    all = all.filter((p) => !(PH_FIRST[p.gid] === p.ed && phFirstSt(gs, p.gid) === "none")).map((p) => PH_FIRST[p.gid] === p.ed && phFirstSt(gs, p.gid) === "live" ? { ...p, status: PH_LIVE, open: PH_FIRST_LIVE[p.gid] } : p);
    const lapsed = gsLapsed(gs);
    const end = gsEndedOn(gs);
    return all.filter((p) => {
      const g = GS_GAMES[p.gid];
      if (g.free) return p.cur ? !!gsTodayPlayed(gs)[p.gid] : true;
      if (PH_FIRST[p.gid] === p.ed) return true;
      return lapsed && p.at < end;
    });
  };
  const phWhen = (d) => phDayKey(d) === phDayKey(PH_TODAY) ? "Today" : phShort(d);
  const phAch = (gs, gid, items, streak) => {
    const plays = phVisible(gs).filter((p) => p.gid === gid && p.status.kind !== "live" && !p.restart).reverse();
    return items.map((a) => {
      let got;
      let have = a.have;
      if (a.by) {
        const p = plays.find(a.by);
        got = p ? lbDate(p.at) : void 0;
      } else if (a.count) {
        const l = a.count(plays);
        have = Math.min(l.length, a.of);
        got = l.length >= a.of ? lbDate(l[a.of - 1].at) : void 0;
      } else if (a.of) {
        have = Math.min(streak || 0, a.of);
        const p = have >= a.of && plays[plays.length - 1];
        got = p ? lbDate(p.at) : void 0;
      }
      return { ...a, have, got };
    });
  };
  const phLib = (gs, id) => gs.go(GS_GAMES[id].route, { page: "record" });
  const PhHead = ({ title }) => /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-sm" }, /* @__PURE__ */ React$1.createElement("h1", { className: "gs-h1" }, title || "History"));
  const PhEmpty = () => {
    const gs = useGs();
    return /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-md", style: { justifyItems: "start" } }, /* @__PURE__ */ React$1.createElement("p", null, "You haven’t played anything yet. Pick one and see what it does when you talk back."), /* @__PURE__ */ React$1.createElement(DS.Button, { onClick: () => gs.go("games") }, "Choose a game"));
  };
  const usePhList = (initial, k0) => {
    const gs = useGs();
    const all = phVisible(gs);
    k0 = k0 || {};
    const [g, setG0] = React$1.useState(initial && (all.some((p) => p.gid === initial) || !!GS_GAMES[initial]) ? initial : "all");
    const [pg, setPg] = React$1.useState(k0.pg || 0);
    const games = GS_GAME_ORDER.filter((k) => all.some((p) => p.gid === k));
    const setG = (v) => {
      setG0(v);
      setPg(0);
    };
    const go = (x) => {
      setPg(x);
      gsScrollTop();
    };
    const [sort, setSort0] = React$1.useState(k0.sort || "new");
    const setSort = (v) => {
      setSort0(v);
      setPg(0);
    };
    const shown = g === "all" ? all : all.filter((p) => p.gid === g);
    return { all, g, setG, pg, go, games, sort, setSort, list: sort === "old" ? [...shown].reverse() : shown };
  };
  const phTone = (s) => s.kind === "ok" || s.kind === "bad" ? s.kind : "none";
  const PhLead = ({ gid }) => /* @__PURE__ */ React$1.createElement(GsArt, { art: GS_GAMES[gid].art, shape: "landscape" });
  const phRow = (v) => /* @__PURE__ */ React$1.createElement(
    DS.ListRow,
    {
      key: v.key,
      sub: !!v.sub,
      lead: v.gid ? /* @__PURE__ */ React$1.createElement(PhLead, { gid: v.gid }) : void 0,
      title: v.title,
      game: v.gid ? v.game : void 0,
      result: gsForms(v.status.label),
      tone: phTone(v.status),
      when: v.when,
      onClick: v.onOpen || void 0
    }
  );
  const phRecent = (gs, gid) => phVisible(gs).filter((p) => p.gid === gid).slice(0, 8).map((p) => ({ key: p.pid, title: phParts(p, true).title, when: [phWhen(p.at) + ", " + phTime(p.at), phWhen(p.at)], status: p.status, onOpen: () => p.open(gs) }));
  const LbRecent = (p) => {
    const gs = useGs();
    const gid = gsGameOfRoute(gs.route.name);
    if (gs.review && gs.review.never === gid) return /* @__PURE__ */ React$1.createElement("section", { className: "lb-card lb-recentcard" }, /* @__PURE__ */ React$1.createElement("div", { className: "lb-sechead" }, /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-card" }, p.title)), /* @__PURE__ */ React$1.createElement("p", { className: "gs-muted" }, p.empty));
    return /* @__PURE__ */ React$1.createElement(LbRecentList, { ...p });
  };
  const LbRecentList = ({ title, allLabel, empty }) => {
    const gs = useGs();
    const gid = gsGameOfRoute(gs.route.name);
    const card = React$1.useRef(null);
    const list = React$1.useRef(null);
    const probe = React$1.useRef(null);
    const [fit, setFit2] = React$1.useState(null);
    const vs = React$1.useMemo(() => phRecent(gs, gid), [gs, gid]);
    React$1.useLayoutEffect(() => {
      const el = card.current;
      if (!el || !vs.length) return void 0;
      const pair = el.previousElementSibling;
      const lay = el.parentElement;
      const reset = () => {
        el.style.height = "";
        if (pair) pair.style.alignSelf = "";
        setFit2(null);
      };
      const measure = () => {
        const two = getComputedStyle(lay).gridTemplateColumns.split(" ").length > 1;
        if (!two || !pair) return reset();
        pair.style.alignSelf = "start";
        el.style.height = pair.offsetHeight + "px";
        const room = list.current ? el.clientHeight - list.current.offsetTop : 0;
        if (list.current) {
          probe.current.style.right = "auto";
          probe.current.style.width = list.current.offsetWidth + "px";
        }
        const hs = Array.from(probe.current.firstElementChild.children).map((x) => x.offsetHeight);
        let k = 0;
        let sum = 0;
        while (k < hs.length && sum + hs[k] <= room + 1) {
          sum += hs[k];
          k += 1;
        }
        if (k < Math.min(4, hs.length)) return reset();
        setFit2(k);
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(pair);
      ro.observe(lay);
      return () => ro.disconnect();
    }, [vs.length]);
    const shown = fit ? vs.slice(0, fit) : vs.slice(0, 4);
    return /* @__PURE__ */ React$1.createElement("section", { ref: card, className: "lb-card lb-recentcard" + (fit ? " is-fill" : "") }, /* @__PURE__ */ React$1.createElement("div", { className: "lb-sechead" }, /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-card" }, title), vs.length > 0 && /* @__PURE__ */ React$1.createElement(DS.TextLink, { onClick: () => gs.go("history", { game: gid, from: gid }) }, allLabel)), vs.length ? /* @__PURE__ */ React$1.createElement("div", { ref: list, className: "lb-recent", style: fit ? { "--fit": fit } : null }, /* @__PURE__ */ React$1.createElement(DS.RowList, { label: title }, shown.map(phRow))) : /* @__PURE__ */ React$1.createElement("p", { className: "gs-muted" }, empty), vs.length > 0 && /* @__PURE__ */ React$1.createElement("div", { ref: probe, className: "lb-recent lb-probe", "aria-hidden": "true" }, /* @__PURE__ */ React$1.createElement(DS.RowList, null, vs.map((v) => phRow({ ...v, onOpen: () => {
    } })))));
  };
  const PhPages = ({ pg, pages, go }) => pages > 1 ? /* @__PURE__ */ React$1.createElement("nav", { className: "lb-pages rp-pg", "aria-label": "Pages" }, pg > 0 ? /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "gs-iconbtn", "aria-label": "Previous page", onClick: () => go(pg - 1) }, /* @__PURE__ */ React$1.createElement(DS.Icon, { name: "next", style: { transform: "rotate(180deg)" } })) : /* @__PURE__ */ React$1.createElement("span", { className: "gs-iconbtn-space" }), /* @__PURE__ */ React$1.createElement("div", { className: "lb-pagenums rp-pg-nums" }, Array.from({ length: pages }, (_, x) => /* @__PURE__ */ React$1.createElement("button", { key: x, type: "button", "aria-current": x === pg ? "page" : void 0, onClick: () => go(x) }, x + 1))), /* @__PURE__ */ React$1.createElement("span", { className: "rp-pg-of gs-strong gs-num-text" }, "Page " + (pg + 1) + " of " + pages), pg < pages - 1 ? /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "gs-iconbtn", "aria-label": "Next page", onClick: () => go(pg + 1) }, /* @__PURE__ */ React$1.createElement(DS.Icon, { name: "next" })) : /* @__PURE__ */ React$1.createElement("span", { className: "gs-iconbtn-space" })) : null;
  const phTitle = (p, one) => {
    const m = phMeta()[p.ed];
    if (m) return one ? edName(m) : edLabel(m);
    return one || p.edTitle.includes(GS_GAMES[p.gid].name) && p.gid !== "barrow" ? p.edTitle : GS_GAMES[p.gid].name + " · " + p.edTitle;
  };
  const phParts = (p, one) => {
    const m = phMeta()[p.ed];
    const name = GS_GAMES[p.gid].name;
    const t = m ? edName(m) : p.edTitle;
    return { title: t, game: one ? void 0 : p.gid === "barrow" ? name : t.includes(name) ? void 0 : name };
  };
  const GsHistory = () => {
    const gs = useGs();
    const r = gs.route;
    const k0 = r.keep || {};
    const f = usePhList(k0.g || r.game, k0);
    const [rhy, setRhy] = React$1.useState(k0.rhy || r.rhythm || "all");
    const [cat, setCat] = React$1.useState(k0.cat || r.kind || "all");
    const [q, setQ] = React$1.useState(k0.q != null ? k0.q : r.q || "");
    React$1.useEffect(() => {
      gs.keep({ keep: { g: f.g, pg: f.pg, sort: f.sort, rhy, cat, q } });
    }, [f.g, f.pg, f.sort, rhy, cat, q]);
    const wait = useGsPart([f.sort, rhy, cat, f.g, f.pg, q]);
    const one = f.g !== "all";
    const s = phNorm(q);
    const okG = (gid) => (rhy === "all" || gsRhythm(gid) === rhy) && (cat === "all" || GS_GAMES[gid].category === cat);
    const items = f.list.filter((x) => okG(x.gid) && (!s || phMatch(phHay(x.gid, x.ed, x.edTitle, x.at) + " " + phTitle(x, one), s)));
    const size = 24;
    const pages = Math.max(1, Math.ceil(items.length / size));
    const pg = Math.min(f.pg, pages - 1);
    const groups = [];
    items.slice(pg * size, pg * size + size).forEach((p) => {
      const k = phDayKey(p.at);
      const last = groups[groups.length - 1];
      if (last && last[0] === k) last[2].push(p);
      else groups.push([k, phDayLabel(p.at), [p]]);
    });
    const view = (p) => ({ key: p.pid, gid: one ? void 0 : p.gid, ...phParts(p, one), when: phTime(p.at), status: p.status, onOpen: () => p.open(gs) });
    const games = GS_GAME_ORDER.filter((k) => k === f.g || f.games.includes(k));
    const reset = (fn) => (v) => {
      fn(v);
      f.go(0);
    };
    const anySet = one || cat !== "all" || rhy !== "all" || f.sort !== "new" || !!q;
    const clearAll = () => {
      f.setG("all");
      setCat("all");
      setRhy("all");
      f.setSort("new");
      setQ("");
    };
    return /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("main", { className: "gs-wrap gs-main" }, r.from && /* @__PURE__ */ React$1.createElement(LbBack, { label: GS_GAMES[r.from].name, onClick: () => phLib(gs, r.from) }), /* @__PURE__ */ React$1.createElement(PhHead, null), !f.all.length ? /* @__PURE__ */ React$1.createElement(PhEmpty, null) : /* @__PURE__ */ React$1.createElement("div", { className: "lb-alllay" }, /* @__PURE__ */ React$1.createElement(LbTools, null, /* @__PURE__ */ React$1.createElement(DS.SearchField, { label: "Search", placeholder: "A number, name or date", value: q, onChange: (e) => reset(setQ)(e.target.value) }), /* @__PURE__ */ React$1.createElement(LbChoice, { label: "Genre", value: cat, opts: [["all", "All games"], ...gsKinds().map((c) => [c, gsKind(c)])], onPick: reset(setCat) }), /* @__PURE__ */ React$1.createElement(LbChoice, { label: "Schedule", value: rhy, opts: [["all", "All games"], ...GS_RHYTHMS], onPick: reset(setRhy) }), /* @__PURE__ */ React$1.createElement(LbChoice, { label: "Game", value: f.g, opts: [["all", "All games"], ...games.map((k) => [k, GS_GAMES[k].name])], onPick: f.setG }), /* @__PURE__ */ React$1.createElement(LbChoice, { label: "Order", value: f.sort, opts: [["new", "Newest first"], ["old", "Oldest first"]], onPick: f.setSort })), !wait && !groups.length ? /* @__PURE__ */ React$1.createElement("div", { className: "gs-nomatch" }, /* @__PURE__ */ React$1.createElement("p", null, "Nothing matches that."), anySet && /* @__PURE__ */ React$1.createElement(DS.TextLink, { onClick: clearAll }, "Clear all")) : /* @__PURE__ */ React$1.createElement("div", { className: "lb-box lb-results", style: { maxWidth: 960 } }, wait ? /* @__PURE__ */ React$1.createElement(GsPart, { label: "Loading plays" }) : /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, groups.map(([k, label, ps]) => /* @__PURE__ */ React$1.createElement(React$1.Fragment, { key: k + pg }, /* @__PURE__ */ React$1.createElement("h2", { className: "ph-day" }, label), /* @__PURE__ */ React$1.createElement(DS.RowList, { label }, ps.map((p) => phRow(view(p)))))), /* @__PURE__ */ React$1.createElement(PhPages, { pg, pages, go: f.go }))))));
  };
  function initGsHistory() {
    ED_NONE = { kind: "none", label: "Not played" };
    PH_UNF = { kind: "none", label: "Not finished" };
    PH_UNF_EDS = (() => {
      const g = PZ.groups.all.filter((x) => x.i > 0 && !x.played)[1];
      const gAt = phAt(g.d, 21, 40);
      GS_SESSIONS["groups-unfinished"] = {
        kind: "puzzle",
        gid: "groups",
        game: "Daily Groups",
        art: "groups",
        unfinished: true,
        edKey: g.id,
        result: null,
        date: pzLong(gAt) + ", 21:40",
        listTitle: "Every try",
        share: null,
        lines: [["Try 1", "OAK · ASH · ELM · YEW", "Found: trees"], ["Try 2", "BASS · CHORD · SCALE · PIKE", "One away"]]
      };
      GS_SESSIONS["delve-unfinished"] = GS_SESSIONS["delve-live"];
      return { [g.id]: { gid: "groups", x: g, sid: "groups-unfinished", at: gAt } };
    })();
    PH_META = null;
    PH_EDS = {};
    PH_PLAYS = [];
    PH_LIVE = { kind: "live", label: "In progress" };
    PH_LIVE_SID = { word: "word-live", groups: "groups-live", mystery: "mystery-live", escape: "escape-live", ...Object.fromEntries(DP_IDS.map((k) => [k, k + "-live"])) };
    PH_MORE = {
      escape: { id: "escape-r0", gid: "escape", d: new Date(2026, 8, 28), title: "The Lighthouse Keeper’s Log", sid: "escape-r0-live", at: phAt(new Date(2026, 9, 3), 20, 15) },
      delve: { id: "dv-r0", gid: "delve", d: new Date(2026, 8, 28), title: "The Drowned Chapel under Fenwick Marsh", sid: "delve-r0-live", at: phAt(new Date(2026, 9, 4), 21, 5) }
    };
    GS_SESSIONS["escape-r0-live"] = {
      ...GS_SESSIONS["escape-live"],
      edKey: "escape-r0",
      __dated: true,
      date: pzLong(PH_MORE.escape.at) + ", " + phTime(PH_MORE.escape.at),
      lines: [["Move 1", "Examined the logbook on the desk", "The last entry stops mid-sentence, three nights before the storm."], ["Move 2", "Examined the lamp room hatch", "The hatch is bolted from above."]]
    };
    GS_SESSIONS["delve-r0-live"] = {
      ...GS_SESSIONS["delve-live"],
      edKey: "dv-r0",
      __dated: true,
      date: pzLong(PH_MORE.delve.at) + ", " + phTime(PH_MORE.delve.at),
      figures: ["Threat 2/12", "4 rolls", "HP 10/11"],
      threat: 2,
      setting: "The Drowned Chapel under Fenwick Marsh",
      tracks: { progress: 2, rooms: 5, threat: 2, threatMax: 12 },
      endings: null,
      reached: null,
      shareLines: null,
      lines: [["Room", "Entered the flooded nave"], ["Dexterity", "Cross the sunken pews", "Success", "Rolled 14 + 2 = 16 against DC 12"], ["Room", "Entered the bell loft"]]
    };
    PH_MORE_PLAYS = Object.values(PH_MORE).map((m) => ({ gid: m.gid, ed: m.id, edTitle: m.title, edDate: m.d, n: 0, cur: false, pid: m.id + "-0", at: m.at, status: PH_LIVE, sid: m.sid, src: {}, open: phSess(m.sid) }));
    Object.entries(PZ).forEach(([id, c]) => c.all.forEach((x) => {
      if (!x.played) return;
      const cur = x.i === 0;
      const sid = cur ? c.today : x.sid;
      let first;
      if (cur) {
        const s = GS_SESSIONS[c.today];
        first = { at: phAt(PH_TODAY, 8 + c.salt, 5 + c.salt * 11), status: { kind: s.loss ? "bad" : "ok", label: s.result }, now: { status: PH_LIVE, open: phSess(PH_LIVE_SID[id]) } };
      } else first = { at: phAt(x.d, 7 + (x.i * 5 + c.salt * 3) % 15, (x.i * 17 + c.salt * 7) % 60, c.weekly ? x.i % 4 : 0), status: { kind: x.ok ? "ok" : "bad", label: x.line } };
      first.open = phSess(sid);
      first.sid = sid;
      first.src = x;
      phEd(id, x.id, x.title, x.d, [first], cur);
    }));
    CB_ALL.forEach((cb, k) => {
      if (!cb.played) return;
      const ed = phParse(cb.week);
      const cur = cb === CB_LIVE;
      const first = cur ? { at: phAt(ed, 20, 10 + k % 40), status: cbStatus(CB_DONE), src: CB_DONE, open: (gs) => cbGo(gs, cb.id), now: { status: PH_LIVE, open: (gs) => cbGo(gs, cb.id) } } : { at: phAt(ed, 20, 10 + k % 40, k % 3), status: cbStatus(cb), src: cb, open: (gs) => cbGo(gs, cb.id) };
      phEd("casebook", cb.id, cb.title, ed, [first], cur);
    });
    DV_ALL.forEach((s, i) => {
      if (!s.played) return;
      const ed = phParse(s.date);
      const cur = i === 0;
      const first = cur ? { at: phAt(ed, 18, 30), status: DV_END.won, src: DV_DONE, sid: "delve", open: phSess("delve"), now: { status: PH_LIVE, open: phSess("delve-live") } } : { at: phAt(ed, 18, 30, i % 3), status: DV_END[s.end], src: s, sid: dvSid(s), open: phSess(dvSid(s)) };
      phEd("delve", s.id, s.title, ed, [first], cur);
    });
    HG_DAYS.forEach((x, i) => {
      const d = phParse(x.date);
      phEd("hunter", x.id, x.title, d, [{ at: phAt(d, 9 + i % 4, 15), status: hgStatus(x), src: x, sid: hgSid(x), open: phSess(hgSid(x)) }]);
    });
    phEd("barrow", "bw1", BW_T1, PH_TODAY, [{ at: phAt(PH_TODAY, 19, 45), status: { kind: "ok", label: "Quest complete" }, src: BW_REC1, sid: "gs-pu-barrow-ch1", open: phSess("gs-pu-barrow-ch1") }]);
    PH_ALL = PH_PLAYS.slice().sort((a, b) => b.at - a.at);
    PH_BROKEN = (() => {
      const e = PH_EDS.word1;
      if (!e) return [];
      const f = e.plays[0];
      const c = PZ.word;
      return [{ ...f, pid: "word1-broken-0", status: { kind: "bad", label: c.bad }, open: phSess("word-broken-first") }];
    })();
    PH_UNF_PLAYS = Object.entries(PH_UNF_EDS).map(([ed, u]) => ({ gid: u.gid, ed, edTitle: u.x.title, edDate: u.x.d, n: 0, cur: false, pid: ed + "-unf", at: u.at, status: PH_UNF, open: phSess(u.sid) }));
    PH_FIRST = { delve: DV_ALL[DV_ALL.length - 1].id, escape: PZ.escape.all[PZ.escape.all.length - 1].id, barrow: "bw1" };
    PH_FIRST_LIVE = { delve: phSess("delve-first-live"), escape: phSess("escape-first-live") };
    PH_PLAYS.concat(PH_BROKEN).forEach((p) => [p, p.now && { ...p, ...p.now }].filter(Boolean).forEach((q) => {
      let id = null;
      try {
        q.open({ go: (n, a) => {
          if (n === "session" && a) id = a.id;
        } });
      } catch (e) {
      }
      const s = id && GS_SESSIONS[id];
      if (!s || s.__dated) return;
      s.__dated = true;
      s.phEd = q.ed;
      s.date = pzLong(q.at) + ", " + phTime(q.at);
    }));
    (() => {
      const dv = GS_SESSIONS.delve;
      GS_SESSIONS["delve-first-live"] = { ...GS_SESSIONS["delve-live"], date: dv.date, __dated: true };
      const es = GS_SESSIONS["escape-week"];
      GS_SESSIONS["escape-first-live"] = { ...GS_SESSIONS["escape-live"], date: es.date, lines: es.lines.slice(0, 4), __dated: true };
    })();
  }
  let DV_END;
  let DV_RUN1;
  let DV_ALL;
  let DV_LIVE;
  let DV_DONE;
  let DV_NEXT;
  const dvEnded = (ps) => ps.filter((p) => !!p.src.end);
  let DV_ACH;
  let DV_BADGES;
  const dvStatus = (s) => !s.played ? { kind: "none", label: "Not played" } : !s.end ? { kind: "live", label: "In progress" } : DV_END[s.end];
  let DV_FIRST;
  const dvSid = (s) => s === DV_FIRST || s && s.id === DV_FIRST.id ? "delve-first" : "delve-" + s.id;
  const dvRun = (gs) => {
    const by = {};
    phVisible(gs).forEach((p) => {
      if (p.gid === "delve" && p.status.kind !== "live") by[p.ed] = true;
    });
    return DV_ALL.map((s) => ({ ...s, played: !!by[s.id], done: !!by[s.id], failed: false }));
  };
  const DvLibrary = () => {
    const gs = useGs();
    const access = lbAccess(gs, "delve");
    const k = gs.view + (gs.sub.hadPass ? "u" : "") + (lbWeekDone(gs) ? "d" : "");
    const fresh = gsFresh(gs);
    const ach = phAch(gs, "delve", DV_ACH);
    const list = dvRun(gs);
    return /* @__PURE__ */ React$1.createElement("main", { key: k, className: "gs-wrap gs-main" }, /* @__PURE__ */ React$1.createElement(LbHead, { id: "delve" }), /* @__PURE__ */ React$1.createElement("div", { className: "lb-lay" }, fresh ? /* @__PURE__ */ React$1.createElement(LbFreshNow, { gid: "delve", title: DV_RUN1.title, line: "You haven’t started this week’s run yet. Get her out before the ritual is complete.", next: "Next run: " + DV_NEXT, onPlay: () => gs.play("Delve") }) : /* @__PURE__ */ React$1.createElement(DlNow, { s: lbWeekDone(gs) ? DV_DONE : DV_LIVE }), /* @__PURE__ */ React$1.createElement(LbRun, { n: lbStreak(list), unit: "weeks", weeks: lbRunOf(list) }), /* @__PURE__ */ React$1.createElement(LbAch, { items: ach, badges: DV_BADGES, access, ed: GS_GAMES.delve.ed }), /* @__PURE__ */ React$1.createElement(LbRecent, { title: "Your runs", allLabel: "See in History", empty: "Your runs appear here once you have played one." })));
  };
  const registerDelveLibrary = () => {
    GS_LIBRARY.delve = DvLibrary;
    GS_EDITIONS.delve = (gs) => edRuns(gs, "delve", { all: DV_ALL, done: DV_DONE, status: dvStatus, openCur: (g) => g.go("session", { id: "delve" }), open: (g, x) => g.go("session", { id: dvSid(x) }) });
  };
  function initGsDelveLibrary() {
    DV_END = { won: { kind: "ok", label: GS_RESULT.delve({ end: "won" }) }, ritual: { kind: "bad", label: GS_RESULT.delve({ end: "ritual" }) }, fell: { kind: "bad", label: GS_RESULT.delve({ end: "fell" }) } };
    DV_RUN1 = { id: "dv0", d: new Date(2026, 9, 5), date: "5 October", month: "October", title: "The Goblin Warren beneath Ashford Mill", played: true, end: null };
    DV_ALL = [DV_RUN1];
    DV_LIVE = { ...DV_RUN1, hero: "Wren", heroFull: "Wren the Rogue", rolls: 8, rooms: 4, ritual: 3 };
    DV_DONE = { ...DV_RUN1, hero: "Bryn", heroFull: "Bryn the Fighter", end: "won", rolls: 11, rooms: 5, ritual: 5, streak: 5 };
    DV_NEXT = "Monday 12 October";
    DV_ACH = [
      { k: "untouched", n: "Untouched", how: "Win a run without losing a hit point.", first: true, by: (p) => p.src.end === "won" && !!p.src.unhurt },
      { k: "streak", n: "Hot Streak", how: "Land three strong hits in a row.", first: true, by: (p) => (p.src.streak || 0) >= 3 },
      { k: "enemy", n: "Know Thy Enemy", how: "Bring down a foe by what it fears.", first: true },
      { k: "regular", n: "Regular", how: "Complete four weeks in a row.", of: 4, count: dvEnded },
      { k: "ten", n: "Ten Runs", how: "Complete ten runs.", of: 10, count: dvEnded }
    ];
    DV_BADGES = lbAutoBadges(DV_ACH);
    DV_FIRST = DV_RUN1;
    GS_SESSIONS["delve-first"] = GS_SESSIONS.delve;
  }
  const GS_AI_LOGO = {
    claude: "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z",
    chatgpt: "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"
  };
  const GS_AI_PLUGIN = { claude: ["Claude", "https://claude.ai/settings/connectors"], chatgpt: ["ChatGPT", "https://chatgpt.com/"] };
  const GS_AI_OTHERS = [
    ["openclaw", "OpenClaw", ["In a terminal, run openclaw mcp add and give it the address as the URL.", "Approve the connection, then sign in to After Pixels when OpenClaw asks."]],
    ["gemini", "Gemini", ["In Gemini, open Settings, then Custom apps, and add an app. Paste the address there.", "Approve the connection, then sign in to After Pixels when Gemini asks."]],
    ["other", "Other", ["In your AI’s settings, find where it adds MCP connectors or custom apps. Paste the address there.", "Approve the connection, then sign in to After Pixels when it asks."]]
  ];
  const GsAiLogo = ({ ai, size = 20 }) => /* @__PURE__ */ React$1.createElement("svg", { viewBox: "0 0 24 24", width: size, height: size, fill: "currentColor", "aria-hidden": "true", focusable: "false" }, /* @__PURE__ */ React$1.createElement("path", { d: GS_AI_LOGO[ai] }));
  const gsEdPromptName = (e) => e.title ? GS_GAMES[e.gid].name + ", “" + e.title + "”" : GS_GAMES[e.gid].name + " #" + e.n + (e.title ? ", “" + e.title + "”" : "");
  const gsPromptText = (r) => r.kind === "games" ? "Load the After Pixels games tool and show me the games it lists, with a line about each." : "Load the After Pixels games tool and start " + (r.kind === "edition" ? gsEdPromptName(r.e) : GS_GAMES[r.gid].name) + ". Run it exactly as the tool says.";
  const gsPromptTitle = (r) => r.kind === "edition" ? gsEdPromptName(r.e) : GS_GAMES[r.gid].name;
  const gsSessEd = (gs, sid) => {
    const s = GS_SESSIONS[sid];
    const gid = s && s.gid;
    if (gid === "barrow" && bwEds) {
      const l = bwEds(gs);
      return l.find((e) => e.key === (s.edKey || "bw1")) || l[l.length - 1];
    }
    if (!gid || s.noEd) return null;
    const list = edList(gs, gid);
    if (s.edKey) return list.find((e) => e.key === s.edKey) || list[0];
    if (PZ && PZ[gid]) {
      const x = PZ[gid].all.find((y) => y.sid === sid);
      if (x) return list.find((e) => e.key === x.id) || list[0];
    }
    if (gid === "delve" && DV_ALL) {
      const x = DV_ALL.find((y) => dvSid(y) === sid);
      if (x) return list.find((e) => e.key === x.id) || list[0];
    }
    if (s.number != null) {
      const m = list.find((e) => e.n === s.number);
      if (m) return m;
    }
    return list[0];
  };
  const gsPlayReq = (gs, name) => {
    const gid = GS_GAME_ORDER.find((k) => GS_GAMES[k].name === name) || "delve";
    const e = gs.route.name === "session" ? gsSessEd(gs, gs.route.id) : null;
    return e ? { kind: "edition", e } : { kind: "game", gid };
  };
  const GsPrompt = ({ text }) => /* @__PURE__ */ React$1.createElement("div", { className: "lb-share-text hw-prompt" }, text);
  const GsCopyPrompt = ({ text, label, block }) => {
    const [done, setDone] = React$1.useState(false);
    React$1.useEffect(() => {
      if (!done) return void 0;
      const t = setTimeout(() => setDone(false), 2400);
      return () => clearTimeout(t);
    }, [done]);
    return /* @__PURE__ */ React$1.createElement(DS.Button, { block, done, doneLabel: "Copied", onClick: () => {
      lbCopy([text]);
      setDone(true);
    } }, label || "Copy prompt");
  };
  const GsHowLink = ({ label }) => {
    const gs = useGs();
    return /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "gs-inlink", onClick: () => gs.playing ? gs.howFromPlay() : gs.go("connect") }, label || "How it works");
  };
  const gsSelectAll = (el) => {
    const r = document.createRange();
    r.selectNodeContents(el);
    const s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
  };
  const GsAddress = () => {
    const [done, setDone] = React$1.useState(false);
    return /* @__PURE__ */ React$1.createElement("div", { className: "gs-copy" }, /* @__PURE__ */ React$1.createElement("div", { className: "mcp-in gs-num-text gs-copy-addr", role: "textbox", "aria-readonly": "true", tabIndex: 0, "aria-label": "The After Pixels address", onFocus: (e) => gsSelectAll(e.currentTarget), onClick: (e) => gsSelectAll(e.currentTarget) }, GS.link), /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "secondary", done, doneLabel: "Copied", onClick: () => {
      lbCopy([GS.link]);
      setDone(true);
      setTimeout(() => setDone(false), 2400);
    } }, "Copy"));
  };
  const GsOtherSteps = ({ id }) => {
    const o = GS_AI_OTHERS.find((x) => x[0] === id);
    return /* @__PURE__ */ React$1.createElement(GsSteps, { items: [/* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-sm" }, /* @__PURE__ */ React$1.createElement("span", null, "Copy the After Pixels address."), /* @__PURE__ */ React$1.createElement(GsAddress, null)), ...o[2]] });
  };
  const gsReqEd = (gs, r) => r.page ? null : r.e || (r.kind === "game" && gs.view !== "out" ? edList(gs, r.gid)[0] : null);
  const gsReqDone = (gs, r) => {
    const e = gsReqEd(gs, r);
    return !!e && !gsStartsOver(e.gid) && !!e.status && e.status.kind !== "none" && e.status.kind !== "live";
  };
  const GsPlayDialog = () => {
    const gs = useGs();
    const last = React$1.useRef(null);
    if (gs.playing) last.current = gs.playing;
    const r = last.current;
    if (!r) return null;
    if (r.kind !== "games" && gsReqDone(gs, r)) return /* @__PURE__ */ React$1.createElement(DS.Popup, { open: !!gs.playing, onClose: gs.closePlay, title: gsPromptTitle(r) }, /* @__PURE__ */ React$1.createElement("p", null, GS_ONCE_LINE));
    return /* @__PURE__ */ React$1.createElement(DS.Popup, { open: !!gs.playing, onClose: gs.closePlay, title: "Start " + gsPromptTitle(r), actions: /* @__PURE__ */ React$1.createElement(GsCopyPrompt, { text: gsPromptText(r) }) }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-md" }, /* @__PURE__ */ React$1.createElement("p", { className: "hw-need gs-small" }, /* @__PURE__ */ React$1.createElement("b", null, "Connect your AI first."), " ", /* @__PURE__ */ React$1.createElement(GsHowLink, { label: "How to connect" })), /* @__PURE__ */ React$1.createElement(GsPrompt, { text: gsPromptText(r) }), gs.view === "out" && /* @__PURE__ */ React$1.createElement("p", { className: "gs-small" }, "You also need a After Pixels account. ", /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "gs-inlink", onClick: () => {
      gs.closePlay();
      gs.go("signup");
    } }, "Start free"))));
  };
  const GsAiCard = ({ k }) => /* @__PURE__ */ React$1.createElement(DS.Card, { style: { justifyItems: "stretch" } }, /* @__PURE__ */ React$1.createElement("div", { className: "hw-ai" }, /* @__PURE__ */ React$1.createElement("span", { className: "hw-ai-logo" }, /* @__PURE__ */ React$1.createElement(GsAiLogo, { ai: k, size: 28 })), /* @__PURE__ */ React$1.createElement("div", { className: "hw-ai-tx" }, /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-card" }, GS_AI_PLUGIN[k][0]), /* @__PURE__ */ React$1.createElement("p", { className: "gs-muted" }, "Open After Pixels in " + GS_AI_PLUGIN[k][0] + ", press Connect and sign in.")), /* @__PURE__ */ React$1.createElement("div", { className: "hw-ai-act" }, /* @__PURE__ */ React$1.createElement(DS.Button, { onClick: () => window.open(GS_AI_PLUGIN[k][1], "_blank", "noopener") }, "Connect " + GS_AI_PLUGIN[k][0]))));
  const GsConnect = () => {
    const [ai, setAi] = React$1.useState("openclaw");
    const t = gsPromptText({ kind: "games" });
    return /* @__PURE__ */ React$1.createElement("main", { className: "gs-wrap gs-main" }, /* @__PURE__ */ React$1.createElement("header", { className: "gs-stack-md hw-head" }, /* @__PURE__ */ React$1.createElement("h1", { className: "gs-h1" }, "How it works"), /* @__PURE__ */ React$1.createElement("p", { className: "gs-lead" }, "You play every game inside your own AI. Connect it to After Pixels once and sign in, and nothing plays until you have.")), /* @__PURE__ */ React$1.createElement("section", { className: "gs-grid2" }, Object.keys(GS_AI_PLUGIN).map((k) => /* @__PURE__ */ React$1.createElement(GsAiCard, { key: k, k }))), /* @__PURE__ */ React$1.createElement(DS.Card, { style: { justifyItems: "stretch" } }, /* @__PURE__ */ React$1.createElement("div", { className: "hw-other" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-md" }, /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-card" }, "Another AI"), /* @__PURE__ */ React$1.createElement("div", { className: "hw-seg", role: "radiogroup", "aria-label": "Your AI" }, GS_AI_OTHERS.map(([id, l]) => /* @__PURE__ */ React$1.createElement(DS.Button, { key: id, role: "radio", "aria-checked": ai === id, variant: ai === id ? "main" : "secondary", onClick: () => setAi(id) }, l)))), /* @__PURE__ */ React$1.createElement(GsOtherSteps, { id: ai }))), /* @__PURE__ */ React$1.createElement("section", { className: "hw-band" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-sm" }, /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-sec" }, "Start playing"), /* @__PURE__ */ React$1.createElement("p", { className: "gs-muted" }, "Paste this into your AI and it lists every game. Pick one and it starts.")), /* @__PURE__ */ React$1.createElement("div", { className: "hw-promptrow" }, /* @__PURE__ */ React$1.createElement(GsPrompt, { text: t }), /* @__PURE__ */ React$1.createElement(GsCopyPrompt, { text: t }))), /* @__PURE__ */ React$1.createElement("div", { className: "gs-grid2" }, /* @__PURE__ */ React$1.createElement("section", { className: "gs-stack-sm" }, /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-card" }, "Disconnecting"), /* @__PURE__ */ React$1.createElement("p", { className: "gs-muted" }, "Remove After Pixels in your AI’s settings, where you added it. Your results and history stay on After Pixels.")), /* @__PURE__ */ React$1.createElement("section", { className: "gs-stack-sm" }, /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-card" }, "Help"), /* @__PURE__ */ React$1.createElement("p", { className: "gs-muted" }, "If something doesn’t work, write to ", /* @__PURE__ */ React$1.createElement("a", { href: "mailto:" + GS_SUPPORT }, GS_SUPPORT), " and say which AI you use."))));
  };
  const GsPlayBox = ({ id }) => {
    const gs = useGs();
    const g = GS_GAMES[id];
    const b = GS_PAGES[id].box;
    const paying = gs.view === "pass";
    const mine = !paying ? cprBoxCopy(id) : null;
    const passOnly = CPR_STAGE[id] === "pass" && !paying;
    const label = g.first && !paying ? b.button : "Play";
    const small = paying || passOnly ? null : mine ? mine[1] : b.small;
    return /* @__PURE__ */ React$1.createElement(DS.Card, { className: "gs-pu-box", style: { gap: 16, justifyItems: "stretch", alignContent: "start" } }, !paying && /* @__PURE__ */ React$1.createElement("span", { className: "gs-label" }, mine ? mine[0] : b.label), /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-card" }, b.heading), /* @__PURE__ */ React$1.createElement(GsSteps, { items: [/* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("b", null, "Connect your AI"), " first. ", /* @__PURE__ */ React$1.createElement(GsHowLink, { label: "How to connect" })), ...b.steps.slice(1).map((s) => gsOr(s))] }), passOnly ? /* @__PURE__ */ React$1.createElement(DS.Button, { block: true, onClick: () => gs.go("pass") }, "Get the Pass") : /* @__PURE__ */ React$1.createElement(DS.Button, { block: true, onClick: () => gs.playReq({ ...gsPlayReq(gs, g.name), page: true }) }, label), small && (small.endsWith(" comes with the Pass.") ? /* @__PURE__ */ React$1.createElement(CprPassEnd, { className: "gs-small gs-pu-wrap", text: small }) : /* @__PURE__ */ React$1.createElement("p", { className: "gs-small gs-pu-wrap" }, small)), /* @__PURE__ */ React$1.createElement("div", { className: "gs-rule" }), /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-sm" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-label" }, "WORKS WITH"), /* @__PURE__ */ React$1.createElement("p", { className: "gs-small" }, GS.works)));
  };
  const GsGap = () => /* @__PURE__ */ React$1.createElement("span", { className: "gs-gap", title: "Not decided yet" }, "—");
  const gsOr = (v) => v == null ? /* @__PURE__ */ React$1.createElement(GsGap, null) : v;
  const gsFreeSmall = (edition) => edition + ", your streak and your achievements are free with an account.";
  const GS_STEP_CONNECT = /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("b", null, "Connect your AI"), " in about two minutes. ChatGPT, Claude, OpenClaw and others.");
  let GS_PAGES;
  let GS_FACT_LABELS;
  const GsFacts = ({ id }) => {
    const p = GS_PAGES[id];
    return /* @__PURE__ */ React$1.createElement("section", { className: "gs-factband", "aria-label": "Facts" }, /* @__PURE__ */ React$1.createElement("dl", { className: "gs-facts" }, GS_FACT_LABELS.map(([k, l]) => /* @__PURE__ */ React$1.createElement("div", { key: k, className: "gs-fact" }, /* @__PURE__ */ React$1.createElement("dt", { className: "gs-label" }, l.toUpperCase()), /* @__PURE__ */ React$1.createElement("dd", null, gsOr(p.facts[k]))))), p.tags.length > 0 && /* @__PURE__ */ React$1.createElement("div", { className: "gs-tags gs-fact-tags" }, p.tags.map((t) => /* @__PURE__ */ React$1.createElement(DS.Tag, { key: t, kind: "daily" }, t))));
  };
  const GsGamePage = ({ id, top }) => {
    const gs = useGs();
    const g = GS_GAMES[id];
    const p = GS_PAGES[id];
    const others = GS_HOME_GAMES.filter((k) => k !== id);
    return /* @__PURE__ */ React$1.createElement("main", { className: "gs-wrap gs-main" }, top, /* @__PURE__ */ React$1.createElement("section", { className: "gs-head-split" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-hero-cover" }, /* @__PURE__ */ React$1.createElement(GsCover, { art: g.art, fit: true }), /* @__PURE__ */ React$1.createElement("div", { className: "gs-cover-over" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-label" }, g.category + " · " + p.rhythm), /* @__PURE__ */ React$1.createElement("h1", { className: "gs-cover-title" }, g.name))), /* @__PURE__ */ React$1.createElement(GsPlayBox, { id })), /* @__PURE__ */ React$1.createElement(GsFacts, { id }), /* @__PURE__ */ React$1.createElement("section", { className: "gs-pitch" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-md gs-measure" }, /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-sec" }, p.pitch.h), p.pitch.ps.map((t, i) => /* @__PURE__ */ React$1.createElement("p", { key: i }, t))), /* @__PURE__ */ React$1.createElement(DS.Card, { style: { gap: 16, justifyItems: "stretch", alignContent: "start", alignSelf: "center" } }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-label" }, "HOW IT PLAYS"), /* @__PURE__ */ React$1.createElement(GsWhoCols, { ai: p.who.ai, server: p.who.server }))), /* @__PURE__ */ React$1.createElement("section", { className: "gs-stack-md" }, /* @__PURE__ */ React$1.createElement(GsChatRow, { id }), id === "barrow" && /* @__PURE__ */ React$1.createElement("p", { className: "gs-small gs-muted gs-credit", style: { overflowWrap: "anywhere", maxWidth: "72ch" } }, GS_BARROW_CREDIT)), id === "delve" && /* @__PURE__ */ React$1.createElement("section", { className: "gs-grid3" }, /* @__PURE__ */ React$1.createElement(GsStat, { label: "IN A RUN", figure: "5 rooms", line: "This week: flooded tunnel to shrine cavern." }), /* @__PURE__ */ React$1.createElement(GsStat, { label: "TYPICAL RUN", figure: "10–14 rolls", line: "Every one listed on your session page afterwards." }), /* @__PURE__ */ React$1.createElement(GsStat, { label: "ENDINGS", figure: "4 ways out", line: "Win, turn back early, fall, or run out of time." })), /* @__PURE__ */ React$1.createElement("section", { className: "gs-stack-md" }, /* @__PURE__ */ React$1.createElement(DS.CardRow, { title: "More games", className: "gs-row4" }, others.map((k) => /* @__PURE__ */ React$1.createElement(GsGameCard, { key: k, id: k }))), /* @__PURE__ */ React$1.createElement("div", { className: "gs-grid2" }, GS_SOON.map((s) => /* @__PURE__ */ React$1.createElement(GsSoonCard, { key: s.name, g: s }))), /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement(DS.TextLink, { onClick: () => gs.go("games") }, "All games"))));
  };
  function initGsGame() {
    GS_PAGES = {
      word: {
        rhythm: "NEW EVERY DAY",
        box: {
          label: "FREE WITH AN ACCOUNT",
          small: gsFreeSmall("Today’s word"),
          heading: "Play it in your own AI chat",
          button: "Play today’s word",
          steps: [GS_STEP_CONNECT, /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("b", null, "Play today’s word."), " You get six guesses."), /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("b", null, "See your result"), " on your session page.")]
        },
        facts: { long: "10 min", often: "New every day" },
        tags: [],
        pitch: { h: "Six guesses to find today’s five-letter word.", ps: [
          "Each guess comes back marked letter by letter: right place, wrong place, or not in the word. Stuck? You get two hints a day.",
          "Your AI runs the game but isn’t told the word until it’s over, so it can’t give it away. Solve it to keep your streak, then share your grid."
        ] },
        who: { ai: "Takes your guesses and shows you how each one scored.", server: "Holds the word, marks every guess and keeps the count." },
        week: { title: "Today’s word", line: "Five letters. Six guesses.", session: "word-today" }
      },
      groups: {
        rhythm: "NEW EVERY DAY",
        box: {
          label: "ONLY WITH THE PASS",
          small: gsFreeSmall("Today’s groups"),
          heading: "New groups every day",
          button: "Play today’s groups",
          steps: [GS_STEP_CONNECT, /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("b", null, "Find today’s four groups."), " You can make four mistakes."), /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("b", null, "See your result"), " on your session page.")]
        },
        facts: { long: "10 min", often: "New every day" },
        tags: [],
        pitch: { h: "Sixteen words hide four groups of four.", ps: [
          "Pick four words you think belong together. You can make four mistakes, and the game tells you when you’re one word away.",
          "Your AI passes on your picks and explains the groups afterwards. The game engine checks every one. Find the first group."
        ] },
        who: { ai: "Passes on your picks and explains the groups once you finish.", server: "Holds the groups, checks every pick and counts your mistakes." },
        week: { title: "Today’s groups", line: "Four groups. Four mistakes to spare.", session: "groups-today" }
      },
      mystery: {
        rhythm: "NEW EVERY DAY",
        box: {
          label: "FREE WITH AN ACCOUNT",
          small: gsFreeSmall("Today’s case"),
          heading: "Play it in your own AI chat",
          button: "Play today’s case",
          steps: [GS_STEP_CONNECT, /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("b", null, "Question the inspector"), ", then make one accusation."), /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("b", null, "See your result"), " on your session page.")]
        },
        facts: { long: "10 min", often: "New every day" },
        tags: [],
        pitch: { h: "There’s a body and a story that doesn’t add up.", ps: [
          "The clues point to one suspect, one weapon and one room. Ask the inspector two yes-or-no questions, then make one accusation.",
          "Your AI sets the scene, voices the cast and reads you the clues. The game engine holds the answer until you accuse. Make your move."
        ] },
        who: { ai: "Voices the suspects and the inspector, and takes your questions.", server: "Holds the answer, counts your questions and checks your accusation." },
        week: { title: "Today’s case", line: "One suspect, one weapon, one room. One accusation.", session: "mystery-today" }
      },
      escape: {
        rhythm: "A NEW ROOM EVERY WEEK",
        box: {
          label: "FIRST ROOM FREE",
          small: "The first room is free with an account. Every other room comes with the After Pixels Pass.",
          heading: "A new room every week",
          button: "Play the first room",
          steps: [GS_STEP_CONNECT, /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("b", null, "Play the first room."), " Every lock has three hints if you need them."), /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("b", null, "See your result"), " on your session page.")]
        },
        facts: { long: "About 30 min", often: "A new room every week" },
        tags: [],
        pitch: { h: "The door’s locked and you’re on the wrong side of it.", ps: [
          "Examine what’s in the room and find its locks. Each one opens to an answer you work out from clues around you. Carry what you find, set what moves and choose your way on. The room changes as it opens, and a lock may open onto a second room.",
          "Every lock has three hints, taken in order. The first two point the way and the third gives the answer. A hint costs no try, and it shows on your result.",
          "No clock runs while you play, and every room can be finished. Your time against par shows once you’re out. Say what you examine first."
        ] },
        who: { ai: "Describes the room and everything you find in it.", server: "Decides what each move does and keeps secret what the room hasn’t shown. It records wrong tries, hints and your time." },
        week: { title: "This week’s room", line: "Find the way out.", session: "escape-week" }
      },
      casebook: {
        rhythm: "ONE CASE",
        box: {
          label: "ONLY WITH THE PASS",
          heading: "Sixteen turns. One accusation.",
          session: "casebook",
          steps: [GS_STEP_CONNECT, /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("b", null, "Play one full case"), ", start to ending."), /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("b", null, "Keep your result."), " It stays in your history.")],
          small: GS_NAME.casebook + " comes only with the After Pixels Pass."
        },
        facts: { long: "25–40 min", often: "One case, ready when you are" },
        tags: ["Mystery", "One case, sixteen turns, one accusation"],
        pitch: { h: "Ask the question they haven’t prepared for.", ps: [
          "The suspects have had time to get their stories straight. Your AI plays every one of them, and each has a secret to keep.",
          "Sixteen turns to search, question and confront them. Then one accusation.",
          "The game engine holds every statement word for word, so any story can be checked."
        ] },
        who: { ai: "Voices every suspect and narrates what you find.", server: "Holds every statement and every piece of evidence, counts your turns and keeps the record." },
        week: { label: "A CASE", title: "Sixteen turns, then one accusation", line: "Ask the question they haven’t prepared for.", session: "casebook" }
      },
      delve: {
        rhythm: "ONE RUN A WEEK",
        box: {
          label: "FIRST RUN FREE",
          heading: "One run every week",
          session: "delve",
          button: "Play the first run",
          steps: [GS_STEP_CONNECT, /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("b", null, "Play this week’s run"), ", from the first room to its ending."), /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("b", null, "Keep your result."), " It stays in your history.")],
          small: "The first run is free with an account. Every other run comes with the After Pixels Pass."
        },
        facts: { long: "25–40 min", often: "One run every week" },
        tags: ["Adventure", "One run a week · five rooms"],
        pitch: { h: "Get her out before the ritual is complete", ps: [
          "Goblins have dragged the miller’s daughter into the tunnels beneath Ashford Mill, and their shaman means to offer her to his idol at moonrise. Pick a fighter, a rogue or a wizard and make your way room by room: past bone chimes and goblin sentries, through choices about what to search and what to carry, to the shrine where the ritual is under way.",
          "Every risky move is a d20 roll, made by the game where nobody can fudge it. Each foe has a track you wear down, your hit points run out if you are careless, and the ritual creeps on with every slip. Your AI tells the story around the dice."
        ] },
        who: { ai: "Narrates the warren, voices the goblins and the captive, and asks what you do next.", server: "Rolls every die, keeps the score of foes, hit points and threat, decides each outcome and records your session." },
        week: { title: "This week’s run", line: "Get Elsie out of the warren beneath Ashford Mill before the ritual is complete.", session: "delve" }
      },
      barrow: {
        rhythm: "A BARROW CAMPAIGN",
        box: {
          label: "FIRST CHAPTER FREE",
          heading: "A campaign in two chapters",
          button: "Play Chapter 1",
          steps: [GS_STEP_CONNECT, /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("b", null, "Choose a hero"), ", then play at your own pace."), /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("b", null, "Keep your hero."), " They carry on into the next chapter.")],
          small: "The first chapter is free with an account. Every other chapter comes with the After Pixels Pass."
        },
        facts: { long: "Several sessions", often: "Two chapters, played at your own pace over several sessions" },
        tags: ["Adventure", "Mist, old stone and honest dice"],
        pitch: { h: "Bring the bell home. Keep the hero.", ps: [
          "Mist lies on the marsh, and the village of Hollowmere has lost its bell to the barrow. Go as a fighter, a rogue or a wizard, through the churchyard and Whisperwood to the old stone and the older things beneath it.",
          "Explore a world that stays put, fight with dice nobody can fudge, and stop whenever you like. Finish the quest and your hero carries on, levelled up, into the second chapter, out across the mere to the drowned abbey.",
          "Your AI is the Game Master and gives the world its voice. The game engine holds the map, rolls every die and keeps the journal. Choose your hero."
        ] },
        who: { ai: "Plays the Game Master: narrates the world and turns what you say into moves.", server: "Holds the map, the hero’s sheet and every enemy, rolls every die and keeps the journal." },
        week: { label: "A QUEST", title: "The bell is in the barrow", line: "Bring the Bell of Hollowmere home from the barrow, and stop whenever you like." },
        // Chapter 2's card, for a player past Chapter 1 (label as deployed).
        week2: { label: "A QUEST", title: "The chalice is in the abbey", line: "Bring the Chalice of St. Ebba home from the drowned abbey, and stop whenever you like." }
      },
      hunter: {
        rhythm: "ONE DAY",
        box: {
          label: "ONLY WITH THE PASS",
          heading: "A different day every time",
          session: "hunter",
          steps: [GS_STEP_CONNECT, /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("b", null, "Play the day"), ", from grey dawn to firelight."), /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("b", null, "Keep your day."), " It stays in your history.")],
          small: "36,000 Summers Ago comes only with the After Pixels Pass."
        },
        facts: { long: "2 hours", often: "A different day every time you start" },
        tags: [],
        pitch: { h: "The day goes on whether you join it or not.", ps: [
          "It’s grey dawn, 36,000 years ago, and your band is already moving. Hunters head for the cliffs. Gatherers set out for the plateau.",
          "Join them, or go your own way. Whatever you skip, the day carries on without you. You’ll hear what you missed at the fire.",
          "Your AI tells the day and speaks for everyone in it. The game engine rolls the dice and keeps the record. Say what you do first."
        ] },
        who: { ai: "Tells the day, speaks for everyone in it and answers whatever you try.", server: "Keeps the time, rolls the dice, tracks where everyone is and records what you do." },
        week: { title: "The day", line: "One day, dawn to firelight. Start it over and it goes differently.", session: "hunter", unmarked: true }
      }
    };
    GS_FACT_LABELS = [["long", "How long"], ["often", "How often"]];
  }
  const GsNeedsPass = ({ gid, text }) => {
    const gs = useGs();
    return /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-sm", style: { justifyItems: "start" } }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-muted" }, text || "This " + GS_GAMES[gid].ed[0] + " comes with the Pass."), /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "secondary", onClick: () => gs.go("pass") }, "Get the Pass"));
  };
  const gsWordRow = (guess, answer) => {
    const g = guess.split("");
    const res = g.map(() => "⬛");
    const left = {};
    answer.split("").forEach((ch, i) => {
      if (g[i] === ch) res[i] = "🟩";
      else left[ch] = (left[ch] || 0) + 1;
    });
    g.forEach((ch, i) => {
      if (res[i] !== "🟩" && left[ch]) {
        res[i] = "🟨";
        left[ch] -= 1;
      }
    });
    return res.join("");
  };
  const gsShortDay = (d) => typeof d === "string" ? d.replace(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)[a-z]*day\b/, "$1") : d;
  const gsShareText = (s) => {
    if (s.share == null) return null;
    const link = gsLink(s.gid);
    if (s.shareLines) return [...s.shareLines, link];
    if (s.gid === "word" && s.number) {
      const guesses = s.lines.filter((l) => /^Guess/.test(l[0])).map((l) => l[1]);
      const answer = s.answer || guesses[guesses.length - 1];
      const h = s.hints || 0;
      const head = "Daily Word No. " + s.number + " · " + (s.loss ? "X" : guesses.length) + "/6" + (h ? " · " + h + (h === 1 ? " hint " : " hints ") + "💡".repeat(h) : "");
      return [head, "", ...guesses.map((g) => gsWordRow(g, answer)), link];
    }
    if (s.gid === "mystery" && s.number) {
      const q = s.q != null ? s.q : s.lines.filter((l) => /^Question/.test(l[0])).length;
      const qn = q === 0 ? "no questions" : q === 1 ? "1 question" : q + " questions";
      return ["Daily Mystery No. " + s.number + " · " + (s.loss ? "wrong accusation" : "solved") + " · " + qn + (q ? " " + "🔎".repeat(q) : ""), s.loss ? "❌" : "✅", link];
    }
    if (s.shareHead) return [s.shareHead, ...s.rows || [], link];
    if (s.kind === "delve") return ["Delve 🎲 " + s.result + ", " + s.reached.toLowerCase(), "🎲 " + s.lines.length + " rolls  ⏳ threat " + s.tracks.threat + "/6", link];
    if (s.kind === "case") return [s.game + " 🔎 " + s.result, s.figures.join(" · "), link];
    return [s.game + " · " + s.share, link];
  };
  const GsShareText = ({ lines }) => {
    const shown = [];
    (lines || []).forEach((l) => {
      if (l === "" && shown.length) shown[shown.length - 1] += "\n";
      else shown.push(l);
    });
    return /* @__PURE__ */ React$1.createElement(DS.Card, { style: { gap: 4, justifyItems: "start" } }, lines ? shown.map((l, i) => /* @__PURE__ */ React$1.createElement("span", { key: i, className: "gs-num-text", style: { overflowWrap: "anywhere", whiteSpace: "pre-line" } }, /\n$/.test(l) ? l + "​" : l)) : /* @__PURE__ */ React$1.createElement(GsGap, null));
  };
  const GsSharePopup = ({ open, onClose, lines, linkOnly }) => {
    const [copied, setCopied] = React$1.useState(false);
    React$1.useEffect(() => {
      if (!open) setCopied(false);
    }, [open]);
    const copy = () => {
      if (lbCopy) lbCopy(lines);
      else {
        try {
          navigator.clipboard && navigator.clipboard.writeText(lines.join("\n"));
        } catch (e) {
        }
      }
      setCopied(true);
    };
    return /* @__PURE__ */ React$1.createElement(
      DS.Popup,
      {
        open,
        onClose,
        kind: "panel",
        title: linkOnly ? "Share this game" : "Share this result",
        actions: lines && /* @__PURE__ */ React$1.createElement(DS.Button, { done: copied, doneLabel: "Copied", onClick: copy }, "Copy")
      },
      /* @__PURE__ */ React$1.createElement(GsShareText, { lines })
    );
  };
  const GsMoves = ({ s }) => /* @__PURE__ */ React$1.createElement("section", { className: "gs-moves" }, /* @__PURE__ */ React$1.createElement(DS.Disclosure, { title: gsOr(s.listTitle) + " (" + s.lines.length + ")" }, /* @__PURE__ */ React$1.createElement(DS.MoveList, { label: gsOr(s.listTitle) }, s.lines.map((l, i) => /* @__PURE__ */ React$1.createElement(DS.MoveRow, { key: i, label: l[0], parts: l.slice(1) })))));
  const gsHeadGame = (s) => s.gid === "word" ? "Guess" : s.gid && GS_GAMES[s.gid] ? GS_GAMES[s.gid].name : s.game;
  const gsHeadDay = (d) => typeof d === "string" ? gsShortDay(d.split(",")[0]).replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*/, "$1") : d;
  const gsHeadTitle = (s, ed) => ed ? ed.title || "No. " + ed.n : s.title || (s.number != null ? "No. " + s.number : null);
  const GsSessHead = ({ art, label, title, actions }) => /* @__PURE__ */ React$1.createElement("section", { className: "gs-sess-head" }, /* @__PURE__ */ React$1.createElement(GsCover, { art, fill: true }), /* @__PURE__ */ React$1.createElement("div", { className: "gs-sess-text" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-sess-label" }, label), /* @__PURE__ */ React$1.createElement("h1", { className: "gs-h1 gs-sess-title" }, title), actions && /* @__PURE__ */ React$1.createElement("div", { className: "gs-sess-acts" }, actions)));
  const GsSessResult = ({ s, title }) => /* @__PURE__ */ React$1.createElement("section", { className: "gs-stack-md", style: { justifyItems: "start" } }, /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-sec" }, gsOr(s.result)), (s.figures || []).filter((f) => f !== title).length > 0 && /* @__PURE__ */ React$1.createElement("div", { className: "gs-figs" }, s.figures.filter((f) => f !== title).map((f, i) => /* @__PURE__ */ React$1.createElement("span", { key: i, className: "gs-fig" }, gsOr(f)))));
  const gsThisEdSid = (gs, sid) => {
    const s = GS_SESSIONS[sid];
    const gid = s && s.gid;
    const live = gs.review && gs.review.week === "live";
    if (gid === "delve") return sid === "delve" || sid === "delve-live" ? live ? "delve-live" : "delve" : sid;
    const c = gid && (typeof PZ !== "undefined" && PZ[gid] || typeof DP_PZ !== "undefined" && DP_PZ[gid]);
    if (!c) return sid;
    const mine = [c.todayBase || c.today, c.liveSid, ...Object.values((GS_ED_SIDS || {})[gid] || {}), ...gid === "escape" && typeof ES_SIDS !== "undefined" ? Object.values(ES_SIDS) : []];
    if (!mine.includes(sid)) return sid;
    const to = live ? c.liveSid : c.today;
    return GS_SESSIONS[to] ? to : sid;
  };
  const GsSessionRecord = () => {
    const gs = useGs();
    const sid = gsThisEdSid(gs, gs.route.id);
    const s = GS_SESSIONS[sid];
    const [share, setShare] = React$1.useState(false);
    const linkOnly = s.share == null && s.kind === "day" && !s.live;
    const text = linkOnly ? ["https://afterpixels.com/" + GS_GAMES[s.gid].route] : gsShareText(s);
    const closeShare = () => setShare(false);
    const ed = gsSessEd ? gsSessEd(gs, sid) : null;
    const over = !!s.gid && gsStartsOver(s.gid);
    const canPlay = !s.gid || gs.view === "pass" || GS_GAMES[s.gid].free || !!PH_FIRST && PH_FIRST[s.gid] === (s.phEd || s.edKey);
    const kept = !canPlay && (s.live || over && s.result === PH_UNF.label);
    const again = over && canPlay ? /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "secondary", onClick: () => gs.play(s.game, sid) }, "Play again") : null;
    const back = s.gid && /* @__PURE__ */ React$1.createElement("div", { className: "gs-wrap gs-backbar", style: { paddingTop: 24 } }, /* @__PURE__ */ React$1.createElement(LbBackTo, { gid: s.gid }));
    const list = s.lines.length > 0 ? /* @__PURE__ */ React$1.createElement(GsMoves, { s }) : null;
    const Body = GS_SESSION_BODY && GS_SESSION_BODY[s.gid];
    const body = Body ? /* @__PURE__ */ React$1.createElement(Body, { s, sid }) : list;
    const title = gsHeadTitle(s, ed);
    const label = gsHeadGame(s) + " · " + gsHeadDay(gsSessDate(s));
    const art = s.art;
    if (s.unfinished) return /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, back, /* @__PURE__ */ React$1.createElement("main", { className: "gs-wrap gs-main" }, /* @__PURE__ */ React$1.createElement(GsSessHead, { art, label, title }), /* @__PURE__ */ React$1.createElement("p", null, (gsRhythm(s.gid) === "daily" ? "The day" : "The week") + " ended before you finished. What you played stays in your history."), body));
    return /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, back, /* @__PURE__ */ React$1.createElement("main", { className: "gs-wrap gs-main" }, /* @__PURE__ */ React$1.createElement(GsSessHead, { art, label, title, actions: kept ? /* @__PURE__ */ React$1.createElement(GsNeedsPass, { gid: s.gid, text: "This session is kept. Carrying it on comes with the Pass." }) : s.live ? /* @__PURE__ */ React$1.createElement(DS.Button, { onClick: () => gs.play(s.game, sid) }, "Play") : /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, again, text && /* @__PURE__ */ React$1.createElement(DS.Button, { onClick: () => setShare(true) }, "Share")) }), !Body && /* @__PURE__ */ React$1.createElement(GsSessResult, { s, title }), body, s.credit && /* @__PURE__ */ React$1.createElement("p", { className: "gs-small gs-muted", style: { overflowWrap: "anywhere", maxWidth: "72ch" } }, GS_BARROW_CREDIT), /* @__PURE__ */ React$1.createElement(GsSharePopup, { open: share, onClose: closeShare, lines: text, linkOnly })));
  };
  const GsSession = () => {
    const r = useGs().route;
    return GS_SESSIONS[r.id] ? /* @__PURE__ */ React$1.createElement(GsSessionRecord, null) : /* @__PURE__ */ React$1.createElement(GsNotFound, null);
  };
  const pgeW = (gid, n = 0) => GS_GAMES[gid].ed[n];
  const pgeNoNum = (gid) => !GS_GAMES[gid].daily && gsRhythm(gid) !== "daily";
  const pgeRowTitle = (gid, e) => pgeNoNum(gid) ? pgeW(gid).charAt(0).toUpperCase() + pgeW(gid).slice(1) + " " + e.n + " · " + e.title : e.title ? "#" + e.n + " · " + e.name : e.name;
  const pgeInfo = (e) => ({ line: GS_GAMES[e.gid].edLine || "", len: GS_PAGES[e.gid].facts.long, who: null });
  const pgeDated = (gid) => !!gsRhythm(gid);
  const pgePlayed = (e) => !!e.status && e.status.kind !== "none" && e.status.kind !== "live";
  const pgeEds = (gs, gid) => edList(gs, gid).map((e) => ({
    ...e,
    name: edName(e),
    when: pgeDated(gid) && e.date ? lbShort(e.date) : void 0,
    played: pgePlayed(e),
    live: !!e.status && e.status.kind === "live",
    held: edNeedsPass(gs, e),
    info: pgeInfo(e),
    hay: phHay(gid, e.key, e.title, pgeDated(gid) && e.date ? phParse(e.date) : null) + " " + pgeRowTitle(gid, { ...e, name: edName(e) }).toLowerCase()
  }));
  const pgePlayedText = (e) => e.live ? "You’re partway through this " + pgeW(e.gid) + "." : "You’ve played this " + pgeW(e.gid) + "." + (gsStartsOver(e.gid) && !e.held ? " To start it over, paste this into your AI." : "");
  let pgeOnceText;
  const pgeScroll = (el) => {
    for (let n = el && el.parentElement; n; n = n.parentElement) {
      const o = getComputedStyle(n).overflowY;
      if ((o === "auto" || o === "scroll") && n.scrollHeight > n.clientHeight) {
        n.scrollTop = 0;
        return;
      }
    }
    gsScrollTop();
  };
  const usePgeList = (gid) => {
    const gs = useGs();
    const k0 = gs.route.pgeList && gs.route.pgeList.gid === gid && gs.route.pgeList || {};
    const [st, setSt] = React$1.useState({ q: k0.q || "", show: k0.show || "all", sort: k0.sort || "new", pg: k0.pg || 0, open: k0.open || gs.route.pgeOpen || null });
    React$1.useEffect(() => {
      gs.keep({ pgeList: { gid, ...st } });
    }, [st]);
    const wait = useGsPart([st.q, st.show, st.sort, st.pg]);
    const box = React$1.useRef(null);
    const set = (k, v) => setSt((p) => ({ ...p, [k]: v, pg: k === "pg" ? v : k === "open" ? p.pg : 0 }));
    const clear = () => setSt((p) => ({ ...p, q: "", show: "all", pg: 0 }));
    const s = phNorm(st.q);
    const all = pgeEds(gs, gid);
    let items = all.filter((x) => (st.show === "all" || st.show === "played" && x.played || st.show === "none" && !x.played || st.show === "can" && !x.held) && phMatch(x.hay, s));
    if (st.sort === "old") items = items.reverse();
    const size = 24;
    const pages = Math.max(1, Math.ceil(items.length / size));
    let pg = Math.min(st.pg, pages - 1);
    if (!k0.pg && st.open && st.pg === 0) {
      const i = items.findIndex((x) => x.key === st.open);
      if (i >= size) pg = Math.floor(i / size);
    }
    return { ...st, s, wait, box, set, clear, pages, pg, rows: items.slice(pg * size, pg * size + size), go: (x) => {
      set("pg", x);
      pgeScroll(box.current);
    } };
  };
  const PgeEmpty = ({ f }) => /* @__PURE__ */ React$1.createElement("div", { className: "gs-nomatch" }, /* @__PURE__ */ React$1.createElement("p", null, "Nothing matches that."), /* @__PURE__ */ React$1.createElement(DS.TextLink, { onClick: f.clear }, "Clear all"));
  const pgeList = (gs, gid, extra) => gs.go(GS_GAMES[gid].route, { page: "record", list: true, ...extra || {} });
  const pgeHistory = (gs, gid, e) => gs.go("history", e ? { game: gid, q: pgeNoNum(gid) ? e.title : "#" + e.n, from: gid } : { game: gid, from: gid });
  const PgeListPage = ({ gid }) => {
    const gs = useGs();
    const g = GS_GAMES[gid];
    const f = usePgeList(gid);
    const fromLib = !!gs.route.fromLib;
    const title = g.edAll || "Every " + pgeW(gid);
    return /* @__PURE__ */ React$1.createElement("main", { className: "gs-wrap gs-main" }, /* @__PURE__ */ React$1.createElement(LbBack, { label: g.name, onClick: () => fromLib ? gs.back() : gs.go(g.route, { page: "record" }) }), /* @__PURE__ */ React$1.createElement("h1", { className: "gs-h1" }, title), /* @__PURE__ */ React$1.createElement("div", { className: "lb-alllay" }, /* @__PURE__ */ React$1.createElement(LbTools, null, /* @__PURE__ */ React$1.createElement(DS.SearchField, { label: "Search", placeholder: !pgeDated(gid) ? "A name" : pgeNoNum(gid) ? "A name or date" : "A number, name or date", value: f.q, onChange: (e) => f.set("q", e.target.value) }), /* @__PURE__ */ React$1.createElement(LbChoice, { label: "Show", value: f.show, opts: [["all", title], ["none", "Not played"]], onPick: (v) => f.set("show", v) }), /* @__PURE__ */ React$1.createElement(LbChoice, { label: "Order", value: f.sort, opts: [["new", "Newest first"], ["old", "Oldest first"]], onPick: (v) => f.set("sort", v) })), !f.wait && !f.rows.length ? /* @__PURE__ */ React$1.createElement(PgeEmpty, { f }) : /* @__PURE__ */ React$1.createElement("div", { ref: f.box, className: "lb-box lb-results ed-results", style: { maxWidth: 960, minWidth: 0 } }, f.wait ? /* @__PURE__ */ React$1.createElement(GsPart, { label: "Loading" }) : /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement(DS.RowList, { label: title }, f.rows.map((e) => /* @__PURE__ */ React$1.createElement(DS.ListRow, { key: e.key, title: pgeRowTitle(gid, e), when: e.when, result: e.played ? "Played" : void 0, onClick: () => f.set("open", e.key) }))), /* @__PURE__ */ React$1.createElement(PhPages, { pg: f.pg, pages: f.pages, go: f.go })))), /* @__PURE__ */ React$1.createElement(PgeEdPanel, { gid, k: f.open, onClose: () => f.set("open", null) }));
  };
  const PgeEdPanel = ({ gid, k, onClose }) => {
    const gs = useGs();
    const g = GS_GAMES[gid];
    const last = React$1.useRef(null);
    const e0 = k ? pgeEds(gs, gid).find((x) => x.key === k) : null;
    if (e0) last.current = e0;
    const e = last.current;
    if (!e) return null;
    const text = gsPromptText({ kind: "edition", e });
    const done = e.played && !gsStartsOver(gid);
    const prompt = !done && !e.held;
    const when = !pgeDated(gid) ? null : gsRhythm(gid) === "weekly" ? "week of " + e.date : e.date;
    const hist = e.played && /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "secondary", block: true, onClick: () => pgeHistory(gs, gid, e) }, "See in History");
    const acts = prompt && e.played ? /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-sm", style: { display: "grid", width: "100%" } }, /* @__PURE__ */ React$1.createElement(GsCopyPrompt, { text, block: true }), hist) : prompt ? /* @__PURE__ */ React$1.createElement(GsCopyPrompt, { text, block: true }) : void 0;
    return /* @__PURE__ */ React$1.createElement(DS.Popup, { kind: "panel", open: !!e0, onClose, title: e.title || edLabel(e), actions: acts }, /* @__PURE__ */ React$1.createElement("div", { className: "pge-panel" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-label" }, [e.title && (pgeNoNum(gid) ? g.name : g.name + " #" + e.n), when, e.info.len].filter(Boolean).join(" · ").toUpperCase()), e.info.line && /* @__PURE__ */ React$1.createElement("p", { style: { margin: 0 } }, e.info.line), e.info.who && /* @__PURE__ */ React$1.createElement("p", { className: "gs-muted", style: { margin: 0 } }, e.info.who), done ? /* @__PURE__ */ React$1.createElement("div", { className: "pge-done" }, /* @__PURE__ */ React$1.createElement(LbResult, { s: e.status }), /* @__PURE__ */ React$1.createElement("p", { style: { margin: 0 } }, pgeOnceText), hist) : e.played && /* @__PURE__ */ React$1.createElement("p", { className: "gs-muted", style: { margin: 0 } }, pgePlayedText(e)), done ? null : e.held ? /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-md", style: { marginTop: e.played ? 0 : -8 } }, /* @__PURE__ */ React$1.createElement(GsNeedsPass, { gid }), hist) : prompt && /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-sm" }, /* @__PURE__ */ React$1.createElement("p", { className: "hw-need gs-small", style: { margin: 0 } }, /* @__PURE__ */ React$1.createElement("b", null, "Connect your AI first."), " ", /* @__PURE__ */ React$1.createElement(GsHowLink, { label: "How to connect" })), /* @__PURE__ */ React$1.createElement(GsPrompt, { text }))));
  };
  function initGsEditions() {
    pgeOnceText = GS_ONCE_LINE;
  }
  const lbAccess = (gs, id) => gs.view === "pass" || GS_GAMES[id].free ? "all" : GS_GAMES[id].first ? "first" : "none";
  const lbPast = (gs) => gs.view === "pass" || gsLapsed(gs);
  const lbOld = (s, gs) => new Date(/\d{4}$/.test(s) ? s : s + " 2026") < gsEndedOn(gs);
  const lbAchView = (items, access, gs) => {
    const past = lbPast(gs);
    const out = [];
    items.forEach((a) => {
      const earn = access === "all" || access === "first" && a.first;
      const got = a.got;
      if (earn) out.push({ ...a, got, state: got ? "earned" : "todo" });
      else if (got && past) out.push({ ...a, got, state: "kept" });
    });
    return out;
  };
  const lbShort = (d) => {
    const p = d.split(" ");
    return p[0] + " " + p[1].slice(0, 3) + (p[2] ? " " + p[2] : "");
  };
  const LbChev = () => /* @__PURE__ */ React$1.createElement(DS.Icon, { name: "back", size: 16, className: "lb-chev", style: { transform: "rotate(180deg)" } });
  const LbBack = ({ label, onClick }) => /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "lb-back", onClick }, /* @__PURE__ */ React$1.createElement(DS.Icon, { name: "back", size: 20 }), label));
  const LbBackTo = ({ gid }) => {
    const gs = useGs();
    const p = gs.route.prev;
    const g = GS_GAMES[gid];
    if (p && p.name === "history") return /* @__PURE__ */ React$1.createElement(LbBack, { label: "History", onClick: gs.back });
    const fromLib = p && p.name === g.route && p.page === "record";
    return /* @__PURE__ */ React$1.createElement(LbBack, { label: g.name, onClick: () => fromLib ? gs.back() : gs.go(g.route, { page: "record" }) });
  };
  const LbHead = ({ id, name, more }) => {
    const gs = useGs();
    const g = GS_GAMES[id];
    const a = GS_ART[g.art] || {};
    const eds = !more && gs.view !== "out";
    return /* @__PURE__ */ React$1.createElement("section", { className: "mcp-cover-head lb-head" }, /* @__PURE__ */ React$1.createElement(DS.Cover, { fill: true, ground: a.ground, extend: a.extend }, /* @__PURE__ */ React$1.createElement("span", { dangerouslySetInnerHTML: { __html: a.svg || "" } })), /* @__PURE__ */ React$1.createElement("div", { className: "mcp-cover-head-text" }, /* @__PURE__ */ React$1.createElement("h1", { className: "gs-h1" }, name || g.name), /* @__PURE__ */ React$1.createElement("div", { className: "mcp-cover-head-links" }, /* @__PURE__ */ React$1.createElement(DS.TextLink, { onClick: () => gs.go(g.route) }, "About this game"), more, eds && /* @__PURE__ */ React$1.createElement(DS.TextLink, { onClick: () => pgeList(gs, id, { fromLib: true }) }, g.edLink || "Every " + g.ed[0]))));
  };
  const lbIcon = (k) => k === "ok" ? "check" : k === "bad" ? "error" : null;
  const LbResult = ({ s }) => /* @__PURE__ */ React$1.createElement("span", { className: "lb-v is-" + s.kind }, lbIcon(s.kind) && /* @__PURE__ */ React$1.createElement(DS.Icon, { name: lbIcon(s.kind), size: 20 }), s.label);
  const LbRun = ({ n, unit, weeks: given, locked, figure, pass, on = "Completed", legend }) => {
    useGs();
    const weeks = Array.from({ length: Math.max(0, 10 - given.length) }, (_, i) => ({ id: "empty" + i, day: "", mon: "", month: "", played: false, empty: true })).concat(given);
    const cut = weeks.length - 6;
    const streak = on === "Completed";
    const off = legend || (streak ? "Not played" : "Not completed");
    const word = (w) => (w.frozen ? "frozen" : w.played ? on : streak && w.failed ? "Failed" : off).toLowerCase();
    return /* @__PURE__ */ React$1.createElement("section", { className: "lb-card lb-runcard" + (pass ? " is-pass" : "") }, pass ? /* @__PURE__ */ React$1.createElement("div", { className: "lb-sechead" }, /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-card" }, c13CapLb(unit) + " in a row")) : /* @__PURE__ */ React$1.createElement("div", { className: "lb-streakhead" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-figure" }, n), /* @__PURE__ */ React$1.createElement("span", { className: "gs-strong" }, figure || (n === 1 ? unit.replace(/s$/, "") : unit) + " in a row"), weeks.some((w) => w.frozen) && /* @__PURE__ */ React$1.createElement("span", { className: "gs-muted gs-strong" }, "· Frozen")), /* @__PURE__ */ React$1.createElement("div", { className: "lb-runbody" }, /* @__PURE__ */ React$1.createElement(
      "div",
      {
        className: "lb-run",
        style: { gridTemplateColumns: "repeat(" + weeks.length + ", minmax(0, 1fr))" },
        role: "img",
        "aria-label": pass ? "The last " + weeks.length + " " + unit + ", oldest first: " + weeks.filter((w) => !w.empty).map((w) => w.day + " " + w.month).join(", ") : "The last " + weeks.length + " " + unit + ", oldest first: " + weeks.map((w) => w.empty ? "before you started" : w.day + " " + w.month + " " + word(w)).join(", ")
      },
      weeks.map((w, i) => {
        const join = i > 0 && !w.empty && (w.played || w.frozen) && (weeks[i - 1].played || weeks[i - 1].frozen && w.frozen);
        const newMon = !w.empty && (i === 0 || weeks[i - 1].empty || weeks[i - 1].mon !== w.mon);
        const fail = streak && !w.played && !w.frozen && !!w.failed;
        const cls = "lb-wk" + (w.played ? " is-on" : "") + (w.frozen ? " is-fz" : "") + (fail ? " is-fail" : "") + (join ? " is-join" : "") + (w.empty ? " is-empty" : "") + (w.now ? " is-now" : "") + (i < cut ? " is-early" : "") + (i === cut ? " is-cut" : "");
        const body = /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("em", null, /* @__PURE__ */ React$1.createElement("b", { className: "lb-mw" }, newMon ? w.mon : ""), /* @__PURE__ */ React$1.createElement("b", { className: "lb-mn" }, newMon || i === cut && !w.empty ? w.mon : "")), /* @__PURE__ */ React$1.createElement("i", null, fail && /* @__PURE__ */ React$1.createElement(DS.Icon, { name: "close", size: 14 })), /* @__PURE__ */ React$1.createElement("span", null, w.empty ? " " : w.day));
        return /* @__PURE__ */ React$1.createElement("span", { key: w.id, className: cls }, body);
      })
    ), !pass && /* @__PURE__ */ React$1.createElement("ul", { className: "lb-legend" }, /* @__PURE__ */ React$1.createElement("li", null, /* @__PURE__ */ React$1.createElement("i", { className: "is-on" }), on), streak && /* @__PURE__ */ React$1.createElement("li", null, /* @__PURE__ */ React$1.createElement("i", { className: "is-fail" }, /* @__PURE__ */ React$1.createElement("svg", { viewBox: "0 0 12 12", width: "12", height: "12", "aria-hidden": "true" }, /* @__PURE__ */ React$1.createElement("path", { d: "M0 0L12 12M12 0L0 12", stroke: "currentColor", strokeWidth: "1.5", fill: "none" }))), "Failed"), /* @__PURE__ */ React$1.createElement("li", null, /* @__PURE__ */ React$1.createElement("i", null), off), weeks.some((w) => w.frozen) && /* @__PURE__ */ React$1.createElement("li", null, /* @__PURE__ */ React$1.createElement("i", { className: "is-fz" }), "Frozen"))));
  };
  const LbRunPass = ({ unit, weeks }) => /* @__PURE__ */ React$1.createElement(LbRun, { unit, weeks: weeks.map((w) => ({ ...w, played: false, frozen: true, now: false })), pass: true });
  const lbBadgeSvg = ([bg, shapes], got) => '<svg viewBox="0 0 48 48" aria-hidden="true">' + (got ? '<rect width="48" height="48" fill="' + bg + '"/>' : "") + shapes.map(([t, a, c]) => "<" + t + " " + a + (got ? ' fill="' + c + '"' : ' fill="none" stroke="#918B80" stroke-width="1.5"') + "/>").join("") + "</svg>";
  const LbBadge = ({ art, got }) => /* @__PURE__ */ React$1.createElement("span", { className: "lb-badge" + (got ? "" : " is-todo") }, /* @__PURE__ */ React$1.createElement("span", { className: "lb-badge-art", dangerouslySetInnerHTML: { __html: lbBadgeSvg(art, got) } }));
  const c13CapLb = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const LB_GROUNDS = ["#1D1B3A", "#421A28", "#163328"];
  const LB_SHAPES = [
    (c) => [["rect", 'x="10" y="10" width="20" height="20"', c], ["circle", 'cx="34" cy="34" r="7"', "#F2EBE0"]],
    (c) => [["path", 'd="M8 40L24 10L40 40Z"', c]],
    (c) => [["circle", 'cx="24" cy="24" r="13"', c], ["rect", 'x="8" y="38" width="32" height="4"', "#F2EBE0"]],
    (c) => [8, 18, 28, 38].map((x) => ["rect", 'x="' + (x - 3) + '" y="14" width="6" height="20"', c])
  ];
  const LB_INKS = ["#E5A63B", "#328A88", "#D66847", "#A390B2", "#4CC38A"];
  const lbAutoBadges = (items) => Object.fromEntries(items.map((a, i) => [a.k, [LB_GROUNDS[i % 3], LB_SHAPES[i % 4](LB_INKS[i % 5])]]));
  const lbAchLine = (a) => a.got ? "Earned " + a.got : a.of ? a.have + " of " + a.of : "Not earned yet";
  const lbDistinct = (f) => (plays) => {
    const seen = /* @__PURE__ */ new Set();
    return plays.filter((p) => {
      const v = f(p);
      if (!v || seen.has(v)) return false;
      seen.add(v);
      return true;
    });
  };
  const lbAchEarned = (list) => list.filter((a) => a.got).length;
  const LbAch = ({ items, badges, access, ended, ed }) => {
    const gs = useGs();
    const [open, setOpen] = React$1.useState(null);
    const list = lbAchView(items, access, gs);
    const kept = list.some((a) => a.state === "kept");
    const of = kept ? items.length : list.length;
    return /* @__PURE__ */ React$1.createElement("section", { className: "lb-card" }, /* @__PURE__ */ React$1.createElement("div", { className: "lb-sechead" }, /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-card" }, "Achievements"), list.length > 0 && /* @__PURE__ */ React$1.createElement("span", { className: "gs-muted" }, lbAchEarned(list) + " of " + of + " earned")), access === "first" && /* @__PURE__ */ React$1.createElement("p", { className: "gs-muted" }, "These are the achievements the first " + (ed || ["edition"])[0] + " can earn. Every other " + (ed || ["edition"])[0] + " comes with the Pass."), kept && /* @__PURE__ */ React$1.createElement("p", { className: "gs-muted" }, "You can’t earn the rest until the Pass returns."), /* @__PURE__ */ React$1.createElement("ul", { className: "lb-ach" }, list.map((a) => /* @__PURE__ */ React$1.createElement("li", { key: a.k }, /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "lb-achbtn", onClick: () => setOpen(a) }, /* @__PURE__ */ React$1.createElement(LbBadge, { art: badges[a.k], got: !!a.got }), /* @__PURE__ */ React$1.createElement("span", { className: "lb-achtx" }, /* @__PURE__ */ React$1.createElement("span", { className: "lb-ach-n" }, a.n), /* @__PURE__ */ React$1.createElement("span", { className: "lb-ach-sub" }, a.how), /* @__PURE__ */ React$1.createElement("span", { className: "lb-ach-sub" }, lbAchLine(a))))))), /* @__PURE__ */ React$1.createElement(DS.Popup, { open: !!open, onClose: () => setOpen(null), title: open ? open.n : "", actions: /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "secondary", onClick: () => setOpen(null) }, "Close") }, open && /* @__PURE__ */ React$1.createElement("div", { className: "lb-achpop" }, /* @__PURE__ */ React$1.createElement(LbBadge, { art: badges[open.k], got: !!open.got }), /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-xs" }, /* @__PURE__ */ React$1.createElement("p", null, open.how), /* @__PURE__ */ React$1.createElement("p", { className: "gs-muted" }, lbAchLine(open))))));
  };
  const lbDate = (d) => d.getDate() + " " + d.toLocaleString("en-GB", { month: "long" }) + (d.getFullYear() !== 2026 ? " " + d.getFullYear() : "");
  const lbMonth = (d) => d.toLocaleString("en-GB", { month: "long" }) + (d.getFullYear() !== 2026 ? " " + d.getFullYear() : "");
  const lbRunOf = (list) => list.slice(0, 10).reverse().map((x, i, a) => {
    const p = x.date.split(" ");
    return { id: x.id, day: p[0], mon: p[1].slice(0, 3), month: p[1], played: x.done != null ? x.done : x.played, failed: !!x.failed, now: i === a.length - 1 };
  });
  const lbFrozen = (weeks, list, get) => ({ weeks: weeks.map((w) => {
    const frozen = !lbOld(w.day + " " + w.month + " 2026");
    return { ...w, frozen, now: frozen ? false : w.now };
  }), n: lbStreak(list.filter((x) => lbOld(get(x)))) });
  const lbStreak = (list) => {
    let n = 0;
    const l = list[0] && !list[0].done ? list.slice(1) : list;
    for (const x of l) {
      if (!x.done) break;
      n += 1;
    }
    return n;
  };
  const LbChoice = ({ label, value, opts, onPick }) => /* @__PURE__ */ React$1.createElement("div", { className: "lb-choicegrp", role: "group", "aria-label": label }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-field-label" }, label), /* @__PURE__ */ React$1.createElement("div", { className: "lb-choice" }, opts.map(([v, l]) => /* @__PURE__ */ React$1.createElement("button", { key: v, type: "button", "aria-pressed": value === v, onClick: () => onPick(v) }, l))));
  const lbfParts = (children) => {
    let search = null;
    const choices = [];
    React$1.Children.toArray(children).forEach((k) => {
      if (!React$1.isValidElement(k)) return;
      if (k.type === LbChoice) choices.push(k.props);
      else if (k.type === DS.SearchField) search = k;
    });
    return { search, choices };
  };
  const lbfLabel = (c) => (c.opts.find(([v]) => v === c.value) || c.opts[0])[1];
  const lbfOn = (c) => c.value !== c.opts[0][0];
  const lbfGames = (g, choices) => {
    const pick = (l) => {
      const c = choices.find((x) => x.label === l);
      return c ? c.value : "all";
    };
    const cat = pick("Genre");
    const rhy = pick("Schedule");
    return g.opts.slice(1).filter(([v]) => v === g.value || (cat === "all" || GS_GAMES[v].category === cat) && (rhy === "all" || gsRhythm(v) === rhy));
  };
  const LbGamePick = ({ g, list, onBack }) => {
    const [q, setQ] = React$1.useState("");
    const s = gsNorm(q);
    const rows = [["all", "All games"]].concat(list).filter(([, l], i) => i === 0 || !s || gsNorm(l).includes(s));
    return /* @__PURE__ */ React$1.createElement("div", { className: "lbf-pick" }, /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "lbf-back", onClick: onBack }, /* @__PURE__ */ React$1.createElement(DS.Icon, { name: "back", size: 16 }), "Filters"), /* @__PURE__ */ React$1.createElement(DS.SearchField, { label: "Find a game", placeholder: "Name", value: q, onChange: (e) => setQ(e.target.value) }), /* @__PURE__ */ React$1.createElement("ul", { className: "lbf-plist", role: "list" }, rows.map(([v, l]) => /* @__PURE__ */ React$1.createElement("li", { key: v }, /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "lbf-prow", "aria-pressed": v === g.value, onClick: () => {
      g.onPick(v);
      onBack();
    } }, /* @__PURE__ */ React$1.createElement("span", null, l), v === g.value ? /* @__PURE__ */ React$1.createElement(DS.Icon, { name: "check", size: 16 }) : /* @__PURE__ */ React$1.createElement("span", { className: "lbf-pgap" })))), rows.length === 1 && s && /* @__PURE__ */ React$1.createElement("li", { className: "lbf-pnone" }, "No game called that.")));
  };
  const LbFilters = ({ children }) => {
    const { search, choices } = lbfParts(children);
    const [open, setOpen] = React$1.useState(false);
    const [deep, setDeep] = React$1.useState(false);
    const on = choices.filter(lbfOn);
    const g = choices.find((c) => c.label === "Game");
    const close = () => {
      setOpen(false);
      setDeep(false);
    };
    const clear = () => {
      on.forEach((c) => c.onPick(c.opts[0][0]));
      setDeep(false);
    };
    const done = /* @__PURE__ */ React$1.createElement(DS.Button, { onClick: close }, "Done");
    return /* @__PURE__ */ React$1.createElement("div", { className: "lbf-top" }, /* @__PURE__ */ React$1.createElement("div", { className: "lbf-bar" }, /* @__PURE__ */ React$1.createElement("div", { className: "lbf-search" }, search), /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "secondary", onClick: () => setOpen(true) }, on.length ? "Filters · " + on.length : "Filters")), /* @__PURE__ */ React$1.createElement(DS.Popup, { kind: "panel", open, onClose: close, title: "Filters", actions: on.length ? /* @__PURE__ */ React$1.createElement(DS.ButtonPair, null, /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "secondary", onClick: clear }, "Clear"), done) : done }, deep && g ? /* @__PURE__ */ React$1.createElement(LbGamePick, { g, list: lbfGames(g, choices), onBack: () => setDeep(false) }) : /* @__PURE__ */ React$1.createElement("div", { className: "lbf-groups" }, choices.map((c) => c === g ? /* @__PURE__ */ React$1.createElement("div", { key: c.label, className: "lbf-grow" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-field-label" }, "Game"), /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "lbf-prow is-open", onClick: () => setDeep(true) }, /* @__PURE__ */ React$1.createElement("span", null, lbfLabel(c)), /* @__PURE__ */ React$1.createElement(LbChev, null))) : /* @__PURE__ */ React$1.createElement(LbChoice, { key: c.label, ...c })))));
  };
  const LbTools = LbFilters;
  const lbCopy = (lines) => {
    const was = document.activeElement;
    const t = lines.join("\n");
    const ta = document.createElement("textarea");
    ta.value = t;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, t.length);
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {
    }
    document.body.removeChild(ta);
    if (was && was !== document.body && was.focus) was.focus({ preventScroll: true });
    if (!ok && navigator.clipboard) navigator.clipboard.writeText(t).catch(() => {
    });
  };
  const LbShare = ({ lines }) => {
    const [open, setOpen] = React$1.useState(false);
    return /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "main", onClick: () => setOpen(true) }, "Share"), /* @__PURE__ */ React$1.createElement(GsSharePopup, { open, onClose: () => setOpen(false), lines }));
  };
  const LbActions = ({ label = "Go to session", onClick, slot }) => /* @__PURE__ */ React$1.createElement("div", { className: "lb-foot" }, /* @__PURE__ */ React$1.createElement(DS.Button, { onClick }, label), slot && /* @__PURE__ */ React$1.createElement("div", { className: "lb-slot gs-muted" }, slot));
  const CprPassEnd = ({ text, className }) => {
    const gs = useGs();
    const head = text.slice(0, -"the Pass.".length);
    return /* @__PURE__ */ React$1.createElement("p", { className }, head, /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "gs-inlink", onClick: () => gs.go("pass") }, "the Pass"), ".");
  };
  const lbNowLabel = (gid) => {
    const r = gsRhythm(gid);
    return r === "daily" ? "TODAY" : r === "weekly" ? "THIS WEEK" : "A " + GS_GAMES[gid].ed[0].toUpperCase();
  };
  const LbNowResult = ({ s, tag }) => s.kind === "live" || tag ? /* @__PURE__ */ React$1.createElement("span", { className: "lb-big" }, /* @__PURE__ */ React$1.createElement(LbResult, { s })) : /* @__PURE__ */ React$1.createElement("p", { className: "gs-vd is-" + (s.kind === "ok" ? "ok" : "over") }, s.label);
  const LbNowCard = ({ gid, label, title, result, tag, play, open, next, pass, span, className, children }) => /* @__PURE__ */ React$1.createElement("section", { className: "lb-card" + (className ? " " + className : ""), style: span ? { gridColumn: "1 / -1" } : void 0 }, /* @__PURE__ */ React$1.createElement("div", { className: "lb-now-in" }, /* @__PURE__ */ React$1.createElement("div", { className: "lb-top" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-xs" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-label" }, label || lbNowLabel(gid)), /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-sec" }, title)), result && /* @__PURE__ */ React$1.createElement(LbNowResult, { s: result, tag })), children), /* @__PURE__ */ React$1.createElement(LbActions, { label: play ? "Play" : void 0, onClick: play || open, slot: pass ? /* @__PURE__ */ React$1.createElement(CprPassEnd, { className: "gs-pu-wrap", text: "Keep playing with the Pass." }) : next }));
  const LbFreshNow = ({ gid, title, line, next, onPlay, span }) => /* @__PURE__ */ React$1.createElement(LbNowCard, { gid, title, play: onPlay, next, span }, /* @__PURE__ */ React$1.createElement("p", null, line));
  const lbWeekDone = (gs) => (gs.review && gs.review.week) !== "live";
  const lbNow = (gs, id) => {
    const done = lbWeekDone(gs);
    if (gsFresh(gs)) return null;
    if (id === "casebook") return gs.view === "pass" ? { status: cbStatus(cbWeek(gs)), open: () => cbGo(gs, CB_LIVE.id) } : null;
    if (id === "delve") return gs.view === "pass" ? { status: dvStatus(done ? DV_DONE : DV_LIVE), open: () => gs.go("session", { id: done ? "delve" : "delve-live" }) } : null;
    const c = PZ && PZ[id];
    if (!c || !gsTodayPlayed(gs)[id]) return null;
    if (!done) return { status: { kind: "live", label: "In progress" }, open: () => gs.go("session", { id: c.liveSid }) };
    const s = GS_SESSIONS[c.today];
    return { status: { kind: s.loss ? "bad" : "ok", label: s.result }, open: () => gs.go("session", { id: c.today }) };
  };
  const GsCover = ({ art, fit, fill }) => {
    const a = GS_ART[art] || {};
    let svg = a.svg || "";
    if (fill) return /* @__PURE__ */ React$1.createElement(DS.Cover, { fill: true, ground: a.ground || "indigo", extend: a.extend || "centre" }, /* @__PURE__ */ React$1.createElement("span", { style: { display: "block" }, dangerouslySetInnerHTML: { __html: svg } }));
    if (fit) svg = svg.replace("xMidYMid slice", a.extend === "bottom" ? "xMidYMax meet" : "xMidYMid meet");
    return /* @__PURE__ */ React$1.createElement(DS.Cover, { className: fit ? "gs-cover-fit is-" + (a.ground || "indigo") : "" }, /* @__PURE__ */ React$1.createElement("span", { style: { display: "contents" }, dangerouslySetInnerHTML: { __html: svg } }));
  };
  const GS_ART_MOTION = ["groups", "casebook", "hunter"];
  const I = (c) => /* @__PURE__ */ React$1.createElement("i", { className: c });
  const GS_ART_LOCAL = {
    murder: { bg: "is-wine", body: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, I("ga-m-ring"), I("ga-m-bar"), I("ga-m-cap")) },
    escape: { bg: "", body: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, I("ga-e-door"), I("ga-e-knob"), I("ga-e-win")) },
    delve: { bg: "is-wine", body: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, I("ga-d-out"), I("ga-d-in"), I("ga-d-st"), I("ga-d-st2"), I("ga-d-st3"), I("ga-d-post l"), I("ga-d-post r"), I("ga-d-fl l"), I("ga-d-fl r")) }
  };
  const GS_RATIO = { square: "mcp-art-1", landscape: "mcp-art-43", wide: "mcp-art-3" };
  const GsArt = ({ art, shape }) => {
    if (GS_ART_MOTION.includes(art)) return /* @__PURE__ */ React$1.createElement(DS.GameArt, { art, shape });
    const p = GS_ART_LOCAL[art];
    if (!p) {
      const a = GS_ART[art] || {};
      if (!shape || !GS_RATIO[shape]) return /* @__PURE__ */ React$1.createElement(GsCover, { art });
      const svg = (a.svg || "").replace("xMidYMid slice", a.extend === "bottom" ? "xMidYMax meet" : "xMidYMid meet");
      return /* @__PURE__ */ React$1.createElement("div", { className: "mcp-art " + GS_RATIO[shape] + (a.ground && a.ground !== "indigo" ? " is-" + a.ground : ""), style: { position: "relative" }, "aria-hidden": "true" }, /* @__PURE__ */ React$1.createElement("span", { style: { position: "absolute", inset: 0, display: "grid" }, dangerouslySetInnerHTML: { __html: svg.replace("<svg ", '<svg style="width:100%;height:100%;display:block" ') } }));
    }
    return /* @__PURE__ */ React$1.createElement("div", { className: "mcp-art " + GS_RATIO[shape] + " " + p.bg, "aria-hidden": "true" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-st" }, p.body));
  };
  const useGsArtHost = () => {
    const ref = React$1.useRef(null);
    React$1.useEffect(() => {
      const host = ref.current && ref.current.closest(".gs-host");
      if (!host) return void 0;
      const on = (e) => {
        if (e.pointerType !== "mouse" && !e.target.closest(":is(a, button):not(.mcp-art-link)")) host.classList.add("is-on");
      };
      const off = () => host.classList.remove("is-on");
      host.addEventListener("pointerdown", on);
      ["pointerup", "pointercancel", "pointerleave"].forEach((t) => host.addEventListener(t, off));
      return () => {
        host.removeEventListener("pointerdown", on);
        ["pointerup", "pointercancel", "pointerleave"].forEach((t) => host.removeEventListener(t, off));
      };
    }, []);
    return ref;
  };
  const GsPassTag = () => {
    const gs = useGs();
    return /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "gs-tagbtn", "aria-label": "Pass. See the Pass", onClick: () => gs.go("pass") }, /* @__PURE__ */ React$1.createElement(DS.Tag, { kind: "locked" }, "Pass"));
  };
  const GsTagList = ({ tags, ed }) => /* @__PURE__ */ React$1.createElement("div", { className: "gs-tags" }, tags.map((t, i) => t === "FREE" ? /* @__PURE__ */ React$1.createElement(DS.Tag, { key: i, kind: "free" }, "Free") : t === "FIRST" ? /* @__PURE__ */ React$1.createElement(DS.Tag, { key: i, kind: "free" }, "First " + (ed ? ed[0] : "edition") + " free") : t === "PASS" ? /* @__PURE__ */ React$1.createElement(GsPassTag, { key: i }) : /* @__PURE__ */ React$1.createElement(DS.Tag, { key: i, kind: "daily" }, t)));
  const GsSteps = ({ items, row }) => /* @__PURE__ */ React$1.createElement("ol", { className: "gs-steps" + (row ? " is-row" : "") }, items.map((it, i) => /* @__PURE__ */ React$1.createElement("li", { key: i, className: "gs-step" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-num" }, i + 1), /* @__PURE__ */ React$1.createElement("div", null, it))));
  const GsWhoCols = ({ ai, server }) => /* @__PURE__ */ React$1.createElement("div", { className: "gs-cols2" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-sm", style: { alignContent: "start" } }, /* @__PURE__ */ React$1.createElement("h3", { className: "mcp-t-card" }, "Your AI"), /* @__PURE__ */ React$1.createElement("p", { className: "gs-muted" }, ai)), /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-sm", style: { alignContent: "start" } }, /* @__PURE__ */ React$1.createElement("h3", { className: "mcp-t-card" }, "The game engine"), /* @__PURE__ */ React$1.createElement("p", { className: "gs-muted" }, server)));
  const GS_COMPARE = [
    { name: "Free games", free: true },
    { name: "The start of select games", free: true },
    { name: "Streaks and achievements in every game you can play", free: true },
    { name: "Your results and history", free: true },
    { name: "Sharing a result", free: true },
    { name: "Play earlier editions", free: false },
    { name: "The full game catalog", free: false },
    { name: "New releases", free: false }
  ];
  const GsCmpMark = ({ on }) => on ? /* @__PURE__ */ React$1.createElement("span", { className: "gs-cmp-cell" }, /* @__PURE__ */ React$1.createElement(DS.Icon, { name: "check" }), /* @__PURE__ */ React$1.createElement("span", { className: "gs-vh" }, "Included")) : /* @__PURE__ */ React$1.createElement("span", { className: "gs-cmp-cell gs-muted" }, /* @__PURE__ */ React$1.createElement("span", { "aria-hidden": "true" }, "–"), /* @__PURE__ */ React$1.createElement("span", { className: "gs-vh" }, "Not included"));
  const GsCompare = ({ foot }) => /* @__PURE__ */ React$1.createElement("section", { className: "gs-cmp", "aria-labelledby": "gs-cmp-h" }, /* @__PURE__ */ React$1.createElement("h2", { id: "gs-cmp-h", className: "mcp-t-sec gs-cmp-h" }, "What you get"), /* @__PURE__ */ React$1.createElement("div", { role: "table", "aria-labelledby": "gs-cmp-h", className: "gs-cmp-t" }, /* @__PURE__ */ React$1.createElement("div", { role: "row", className: "gs-cmp-tr is-head" }, /* @__PURE__ */ React$1.createElement("span", { role: "columnheader" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-vh" }, "What you get")), /* @__PURE__ */ React$1.createElement("span", { role: "columnheader", className: "gs-cmp-cell mcp-t-card" }, "Free"), /* @__PURE__ */ React$1.createElement("span", { role: "columnheader", className: "gs-cmp-cell gs-cmp-band mcp-t-card" }, "Pass")), GS_COMPARE.map((r) => /* @__PURE__ */ React$1.createElement("div", { role: "row", key: r.name, className: "gs-cmp-tr" }, /* @__PURE__ */ React$1.createElement("span", { role: "rowheader", className: "gs-cmp-label" }, /* @__PURE__ */ React$1.createElement("b", null, r.name), r.sub && /* @__PURE__ */ React$1.createElement("span", { className: "gs-muted" }, r.sub)), /* @__PURE__ */ React$1.createElement("span", { role: "cell" }, /* @__PURE__ */ React$1.createElement(GsCmpMark, { on: r.free })), /* @__PURE__ */ React$1.createElement("span", { role: "cell", className: "gs-cmp-band" }, /* @__PURE__ */ React$1.createElement(GsCmpMark, { on: true })))), /* @__PURE__ */ React$1.createElement("div", { className: "gs-cmp-tr is-foot", "aria-hidden": "true" }, /* @__PURE__ */ React$1.createElement("span", null), /* @__PURE__ */ React$1.createElement("span", null), /* @__PURE__ */ React$1.createElement("span", { className: "gs-cmp-band" }))), foot);
  const GsStat = ({ label, figure, line }) => /* @__PURE__ */ React$1.createElement(DS.Card, { style: { gap: 8, alignContent: "start" } }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-label" }, label), /* @__PURE__ */ React$1.createElement("span", { className: "gs-figure" }, figure), /* @__PURE__ */ React$1.createElement("p", { className: "gs-muted" }, line));
  const GsSoonCard = ({ g }) => {
    const gs = useGs();
    const a = GS_ART[g.art] || {};
    return /* @__PURE__ */ React$1.createElement(
      DS.SoonCard,
      {
        art: /* @__PURE__ */ React$1.createElement(DS.Cover, { fill: true, ground: a.ground, extend: a.extend }, /* @__PURE__ */ React$1.createElement("span", { style: { display: "block" }, dangerouslySetInnerHTML: { __html: a.svg || "" } })),
        label: g.label,
        title: g.name,
        line: g.line,
        play: g.play,
        onPlay: g.play ? () => gs.go(g.route) : void 0
      }
    );
  };
  const gsKeepLast = (s) => {
    const i = s.lastIndexOf(" ");
    const j = i > 0 ? s.lastIndexOf(" ", i - 1) : -1;
    return j < 0 ? s : /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, s.slice(0, j + 1), /* @__PURE__ */ React$1.createElement("span", { style: { whiteSpace: "nowrap" } }, s.slice(j + 1)));
  };
  const GsTile = ({ id, pass, page }) => {
    const gs = useGs();
    const g = GS_GAMES[id];
    const host = useGsArtHost();
    return /* @__PURE__ */ React$1.createElement(
      DS.GameTile,
      {
        className: "mcp-art-host gs-host",
        art: /* @__PURE__ */ React$1.createElement("div", { ref: host }, /* @__PURE__ */ React$1.createElement(GsArt, { art: g.art, shape: "square" })),
        pass: !!pass,
        onPass: () => gs.go("pass"),
        title: /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "mcp-gtile-open mcp-art-link", onClick: () => gs.go(g.route, page ? { page } : void 0) }, g.name),
        kind: gsKind(g.category)
      }
    );
  };
  const GsAvatar = ({ big, btn }) => {
    const gs = useGs();
    return /* @__PURE__ */ React$1.createElement("span", { className: "gs-avatar" + (big ? " is-big" : "") + (btn ? " is-btn" : ""), "aria-hidden": "true" }, gsName(gs.user)[0].toUpperCase());
  };
  const gsName = (u) => u.username || u.email || "?";
  const GsIdentityHead = () => {
    const gs = useGs();
    return /* @__PURE__ */ React$1.createElement("div", { className: "gs-idhead" }, /* @__PURE__ */ React$1.createElement(GsAvatar, { big: true }), /* @__PURE__ */ React$1.createElement("span", { className: "gs-stack-xs gs-id-text" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-strong" }, gsName(gs.user)), /* @__PURE__ */ React$1.createElement("span", { className: "gs-small" }, gs.user.email)));
  };
  const GsUserItems = ({ pick, role }) => {
    const gs = useGs();
    const [busy, run] = useGsBusy();
    const item = (key, icon, label, fn, work) => /* @__PURE__ */ React$1.createElement(
      "button",
      {
        key,
        type: "button",
        role,
        className: "gs-menu-item gs-menu-ico",
        "aria-busy": work && busy || void 0,
        onClick: () => work ? run(() => pick(fn)) : pick(fn)
      },
      work && busy ? /* @__PURE__ */ React$1.createElement("span", { className: "gs-ico-slot" }, /* @__PURE__ */ React$1.createElement(GsInkSpin, null)) : icon ? icon === "logout" || icon === "pass" ? /* @__PURE__ */ React$1.createElement(GsGlyph, { name: icon }) : /* @__PURE__ */ React$1.createElement(DS.Icon, { name: icon }) : /* @__PURE__ */ React$1.createElement("span", { className: "gs-ico-space" }),
      label
    );
    return /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, item("acct", "settings", "Manage account", () => gs.go("account", { from: gs.route })), item("pass", "pass", "Pass", () => gs.go("pass")), item("ai", "play", "How it works", () => gs.go("connect")), /* @__PURE__ */ React$1.createElement("div", { className: "gs-menu-div", role: "separator" }), item("out", "logout", "Sign out", gs.signOut, true));
  };
  const gsUseMenuDismiss = (open, setOpen, wrap) => React$1.useEffect(() => {
    if (!open) return void 0;
    const back = () => {
      const b = wrap.current && wrap.current.querySelector("button");
      b && b.focus();
    };
    const onDoc = (e) => {
      if (wrap.current && !wrap.current.contains(e.target)) {
        setOpen(false);
        back();
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        back();
      }
    };
    document.addEventListener("pointerdown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const GsUserMenu = ({ compact }) => {
    const gs = useGs();
    const [open, setOpen] = React$1.useState(false);
    const wrap = React$1.useRef(null);
    gsUseMenuDismiss(open, setOpen, wrap);
    return /* @__PURE__ */ React$1.createElement("div", { className: "gs-acct", ref: wrap }, compact ? /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "secondary", className: "gs-acct-ico", "aria-label": "Your account, " + gsName(gs.user), "aria-expanded": open, "aria-haspopup": "menu", onClick: () => setOpen((o) => !o) }, /* @__PURE__ */ React$1.createElement(GsGlyph, { name: "account", size: 24 })) : /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "gs-acct-btn", "aria-expanded": open, "aria-haspopup": "menu", onClick: () => setOpen((o) => !o) }, /* @__PURE__ */ React$1.createElement(GsAvatar, null), /* @__PURE__ */ React$1.createElement("span", { className: "gs-acct-who" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-strong" }, gsName(gs.user)), /* @__PURE__ */ React$1.createElement("span", { className: "gs-small" }, gs.user.email)), /* @__PURE__ */ React$1.createElement(DS.Icon, { name: "down" })), open && /* @__PURE__ */ React$1.createElement("div", { className: "gs-pop", role: "menu", "aria-label": "Your account" }, /* @__PURE__ */ React$1.createElement(GsIdentityHead, null), /* @__PURE__ */ React$1.createElement(GsUserItems, { role: "menuitem", pick: (fn) => {
      setOpen(false);
      fn();
    } })));
  };
  const GsTopBar = () => {
    const gs = useGs();
    const [menu, setMenu] = React$1.useState(false);
    const mwrap = React$1.useRef(null);
    gsUseMenuDismiss(menu, setMenu, mwrap);
    const out = gs.view === "out";
    const r = gs.route;
    const cur = !out && (r.name === "library" || r.page === "record") ? "library" : r.name === "games" || GS_GAME_ORDER.some((k) => GS_GAMES[k].route === r.name) ? "games" : r.name;
    const links = out ? [["games", "Discover", () => gs.go("games")], ["how", "How it works", gs.goHow], ["pass", "Pricing", () => gs.go("pass")]] : [["games", "Discover", () => gs.go("games")], ["library", "Library", () => gs.go("library")], ["history", "History", () => gs.go("history")]];
    const pick = (fn) => {
      setMenu(false);
      fn();
    };
    return /* @__PURE__ */ React$1.createElement("header", { className: "gs-top" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-wrap gs-top-in" }, /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "gs-brand", "aria-label": "After Pixels, home", onClick: () => gs.go(out ? "home" : "games") }, /* @__PURE__ */ React$1.createElement(GsMark, null), /* @__PURE__ */ React$1.createElement("span", null, "After Pixels")), /* @__PURE__ */ React$1.createElement("nav", { className: "gs-nav", "aria-label": "Main" }, links.map(([id, l, fn]) => /* @__PURE__ */ React$1.createElement("button", { key: id, type: "button", className: "gs-navlink", "aria-current": cur === id ? "page" : void 0, onClick: fn }, l))), /* @__PURE__ */ React$1.createElement("div", { className: "gs-top-end mcp-menu-wrap" }, out ? /* @__PURE__ */ React$1.createElement("div", { className: "gs-wide-only" }, /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "secondary", onClick: () => gs.go("signin") }, "Sign in"), /* @__PURE__ */ React$1.createElement(DS.Button, { onClick: gs.startFree }, "Start free")) : /* @__PURE__ */ React$1.createElement("div", { className: "gs-wide-only" }, /* @__PURE__ */ React$1.createElement(GsUserMenu, null)), /* @__PURE__ */ React$1.createElement("div", { className: "gs-narrow-only gs-menu-anchor", ref: mwrap }, /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "secondary", "aria-expanded": menu, "aria-haspopup": "menu", onClick: () => setMenu((m) => !m) }, "Menu"), menu && /* @__PURE__ */ React$1.createElement("div", { className: "gs-pop", role: "menu", "aria-label": "Menu", style: out ? void 0 : { minWidth: 200 } }, links.map(([id, l, fn]) => /* @__PURE__ */ React$1.createElement("button", { key: id, type: "button", role: "menuitem", className: "gs-menu-item", "aria-current": cur === id ? "page" : void 0, onClick: () => pick(fn) }, l)), out && /* @__PURE__ */ React$1.createElement("div", { className: "gs-menu-div", role: "separator" }), out && /* @__PURE__ */ React$1.createElement("div", { className: "gs-pop-cta" }, /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "secondary", block: true, role: "menuitem", onClick: () => pick(() => gs.go("signin")) }, "Sign in"), /* @__PURE__ */ React$1.createElement(DS.Button, { block: true, role: "menuitem", onClick: () => pick(gs.startFree) }, "Start free")))), !out && /* @__PURE__ */ React$1.createElement("div", { className: "gs-narrow-only" }, /* @__PURE__ */ React$1.createElement(GsUserMenu, { compact: true })))));
  };
  const gsDailyRoute = (gs) => {
    const k = gsGameOfRoute(gs.route.name);
    return !!(k && GS_GAMES[k].daily);
  };
  const gsWeekSwitch = (gs) => {
    const r = gs.route;
    if (r.name === "history") return gs.view !== "out";
    const k = gsGameOfRoute(r.name);
    if (!k || !lbNow || r.page === "record" && r.sid) return false;
    return !!lbNow(gs, k);
  };
  const GsDemoBar = () => {
    const gs = useGs();
    const opts = [["out", "signed out"], ["free", "free"], ["pass", "Pass"]];
    const sw = gsWeekSwitch(gs);
    const daily = gsDailyRoute(gs);
    return /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("div", { className: "gs-demo-space" + (sw ? " is-two" : ""), "aria-hidden": "true" }), /* @__PURE__ */ React$1.createElement("div", { className: "gs-demo", role: "group", "aria-label": "Demo view, not part of the product" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-demo-in" + (sw ? " is-two" : "") }, /* @__PURE__ */ React$1.createElement("span", null, "Demo view:"), opts.map(([v, l], i) => /* @__PURE__ */ React$1.createElement(React$1.Fragment, { key: v }, i > 0 && /* @__PURE__ */ React$1.createElement("span", { "aria-hidden": "true" }, "/"), /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "gs-demo-opt", "aria-pressed": gs.view === v, onClick: () => gs.setDemoView(v) }, l))), sw && /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("span", { "aria-hidden": "true", className: "gs-demo-sep" }), /* @__PURE__ */ React$1.createElement("span", null, gs.route.name === "history" ? "Today and this week:" : daily ? "Today:" : "This week:"), [["live", "in progress"], ["done", daily ? "day complete" : "finished"]].map(([v, l], i) => /* @__PURE__ */ React$1.createElement(React$1.Fragment, { key: v }, i > 0 && /* @__PURE__ */ React$1.createElement("span", { "aria-hidden": "true" }, "/"), /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "gs-demo-opt", "aria-pressed": (gs.review.week === "live" ? "live" : "done") === v, onClick: () => gs.setReview({ week: v }) }, l)))))));
  };
  const GsPlayPopup = () => /* @__PURE__ */ React$1.createElement(GsPlayDialog, null);
  const DL_PHONE = 768;
  const DL_LOGO = "assets/logo.svg";
  (function dlHead() {
    if (document.getElementById("dl-head")) return;
    const l = document.createElement("link");
    l.id = "dl-head";
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,400&display=swap";
    document.head.appendChild(l);
    const s = document.createElement("style");
    s.textContent = ".dl-page :focus-visible{outline:2px solid #0B0B0B;outline-offset:2px}.dl-page button{font:inherit;color:inherit}.dl-page a:hover{text-decoration-thickness:2px}.dl-scroll{scrollbar-width:none}.dl-scroll::-webkit-scrollbar{display:none}";
    document.head.appendChild(s);
  })();
  const dlSvg = (d, size = 20, sw = 1.6) => /* @__PURE__ */ React$1.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" }, d);
  const DL_I = {
    back: /* @__PURE__ */ React$1.createElement("path", { d: "M19 12H5M11 6l-6 6 6 6" }),
    link: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("path", { d: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" }), /* @__PURE__ */ React$1.createElement("path", { d: "M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" })),
    info: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("circle", { cx: "12", cy: "12", r: "9" }), /* @__PURE__ */ React$1.createElement("path", { d: "M12 11v5M12 8h.01" })),
    out: /* @__PURE__ */ React$1.createElement("path", { d: "M7 17 17 7M8 7h9v9" }),
    prev: /* @__PURE__ */ React$1.createElement("path", { d: "M15 6l-6 6 6 6" }),
    next: /* @__PURE__ */ React$1.createElement("path", { d: "M9 6l6 6-6 6" }),
    ext: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("path", { d: "M14 4h6v6M20 4l-9 9" }), /* @__PURE__ */ React$1.createElement("path", { d: "M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" })),
    search: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("circle", { cx: "11", cy: "11", r: "7" }), /* @__PURE__ */ React$1.createElement("path", { d: "m20 20-4-4" })),
    panel: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("rect", { x: "3", y: "4", width: "18", height: "16", rx: "3" }), /* @__PURE__ */ React$1.createElement("path", { d: "M9 4v16" })),
    pen: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("path", { d: "M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" }), /* @__PURE__ */ React$1.createElement("path", { d: "M17.5 3.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z" })),
    images: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("rect", { x: "3", y: "7", width: "13", height: "13", rx: "2" }), /* @__PURE__ */ React$1.createElement("path", { d: "M8 4h11a2 2 0 0 1 2 2v11" }), /* @__PURE__ */ React$1.createElement("path", { d: "m3 17 4-4 5 5" })),
    plugin: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("circle", { cx: "12", cy: "12", r: "9" }), /* @__PURE__ */ React$1.createElement("circle", { cx: "12", cy: "12", r: "3.5" }), /* @__PURE__ */ React$1.createElement("path", { d: "M15.5 12v1.5a2 2 0 0 0 4 0V12" })),
    scope: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("path", { d: "m4 15 9-6 2 3-9 6z" }), /* @__PURE__ */ React$1.createElement("path", { d: "m13 9 3-2 3 4-3 2" }), /* @__PURE__ */ React$1.createElement("path", { d: "M9 18l-2 3M11 17l2 4" })),
    plans: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("path", { d: "M12 3 20 7.5v9L12 21l-8-4.5v-9z" }), /* @__PURE__ */ React$1.createElement("path", { d: "M12 9v6M9 12h6" })),
    gear: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("circle", { cx: "12", cy: "12", r: "3" }), /* @__PURE__ */ React$1.createElement("path", { d: "M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" })),
    help: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("circle", { cx: "12", cy: "12", r: "9" }), /* @__PURE__ */ React$1.createElement("circle", { cx: "12", cy: "12", r: "4" }), /* @__PURE__ */ React$1.createElement("path", { d: "m5.6 5.6 3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6" })),
    arrow: /* @__PURE__ */ React$1.createElement("path", { d: "M5 12h14M13 6l6 6-6 6" })
  };
  const dlIcon = (n, size, sw) => dlSvg(DL_I[n], size, sw);
  const useDlPhone = () => {
    const gs = useGs();
    return gs.width < DL_PHONE;
  };
  const dlText = (text, heads) => text.split("\n").map((l, i) => /* @__PURE__ */ React$1.createElement(React$1.Fragment, { key: i }, i > 0 ? "\n" : null, heads.includes(l) ? /* @__PURE__ */ React$1.createElement("strong", { style: { fontWeight: 600 } }, l) : l));
  const DL_HEADS = ["WHAT YOU CAN PLAY", "HOW IT WORKS"];
  const dlGames = (ai) => "Games you play with your AI assistant. Crack today's puzzle, solve a mystery, go on an adventure. You make the moves; the game holds the rules. " + ai + " does the talking: it sets the scene, plays the characters and follows what you say. The game keeps the score. It holds the rules, the dice and your record, so " + ai + " can't bend the rules or fudge a roll.\n\nYou need an After Pixels account to play. Sign in when you connect. One connection covers every game in the library, and a game you start in one chat carries on in the next.\n\nWHAT YOU CAN PLAY\n• Daily puzzles. A new word puzzle every day.\n• Mysteries. Read the clues, question the people involved and name who did it.\n• Adventures. Explore, take risks and let the dice decide what happens.\n\nHOW IT WORKS\n• Ask " + ai + " what you can play. It lists every game in the library today, how often each one has something new, and how far you have got.\n• Name a game to start it, or ask for the kind of game you want.\n• Every guess, roll and move goes to the game, which decides what happens and keeps count. " + ai + " describes what happened.\n• When you finish, share your result without giving the answer away.";
  const DLC = {
    page: "#F9F9F7",
    head: "#FCFCFB",
    ink: "#0B0B0B",
    grey: "#52514E",
    label: "#898781",
    line: "#E1E1DF",
    link: "#184F95",
    chip: "#EDEDEB",
    clay: "#D97757",
    sans: '"Instrument Sans", ui-sans-serif, system-ui, sans-serif',
    serif: '"Source Serif 4", Georgia, serif',
    mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
  };
  const DLC_ONELINER = "Your AI does the talking. The game keeps the score. Play daily puzzles, mysteries and dice adventures in the chat.";
  const DLC_TOOLS = ["games_library", "games_start", "games_move", "games_read", "games_look", "games_manual", "games_hint", "games_share", "games_stop", "games_abandon"];
  const DLC_GALLERY = [["word", "Daily Word"], ["casebook", "Casebook"], ["barrow", "The Barrow of Hollowmere"]];
  const dlcS = {
    page: { minHeight: "100%", flex: 1, background: DLC.page, color: DLC.ink, font: "400 16px/1.5 " + DLC.sans, WebkitFontSmoothing: "antialiased" },
    head: { background: DLC.head, height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" },
    headPhone: { background: DLC.head, padding: "8px 16px 0" },
    brand: { display: "flex", alignItems: "center", gap: 6, fontFamily: DLC.serif, fontSize: 22, letterSpacing: "-0.01em", color: DLC.ink },
    headRight: { display: "flex", alignItems: "center", gap: 24 },
    copy: { display: "flex", alignItems: "center", gap: 8, background: "none", border: 0, padding: 0, fontSize: 15, cursor: "pointer" },
    signIn: { height: 30, padding: "0 10px", background: "#fff", border: "1px solid " + DLC.line, borderRadius: 6, fontSize: 14, cursor: "pointer" },
    col: { maxWidth: 960, margin: "0 auto", padding: "0 24px" },
    colPhone: { padding: "0 16px" },
    back: { display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, color: DLC.ink, textDecoration: "none", marginTop: 28 },
    titleGrid: { display: "grid", gridTemplateColumns: "minmax(0,1fr) 288px", columnGap: 32, alignItems: "center", marginTop: 16, paddingBottom: 28, borderBottom: "1px solid " + DLC.line },
    titleLeft: { display: "flex", gap: 20, alignItems: "center", minWidth: 0 },
    tile: { width: 80, height: 80, flex: "none", background: "#fff", border: "1px solid " + DLC.line, borderRadius: 8, display: "grid", placeItems: "center" },
    nameRow: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
    name: { margin: 0, fontFamily: DLC.serif, fontWeight: 400, fontSize: 44, lineHeight: 1.1, letterSpacing: "-0.01em" },
    namePhone: { margin: 0, fontFamily: DLC.serif, fontWeight: 400, fontSize: 24, lineHeight: 1.2 },
    tag: { background: DLC.chip, borderRadius: 6, fontSize: 14, lineHeight: "20px", padding: "4px 12px", color: DLC.grey },
    tagPhone: { background: DLC.chip, borderRadius: 6, fontSize: 12, lineHeight: "16px", padding: "2px 8px", color: DLC.grey },
    oneLiner: { margin: "4px 0 0", color: DLC.grey, fontSize: 16, lineHeight: "24px", textWrap: "pretty" },
    add: { height: 40, padding: "0 16px", background: DLC.ink, color: "#fff", border: 0, borderRadius: 8, fontSize: 16, fontWeight: 500, cursor: "pointer", justifySelf: "start" },
    notice: { display: "flex", gap: 12, alignItems: "flex-start", marginTop: 28, background: DLC.head, border: "1px solid " + DLC.line, borderRadius: 12, padding: "16px 20px", fontSize: 15, lineHeight: "20px" },
    noticeIcon: { flex: "none", marginTop: 0, color: DLC.grey, display: "flex" },
    a: { color: DLC.link, textDecoration: "underline", textUnderlineOffset: 3 },
    body: { display: "grid", gridTemplateColumns: "minmax(0,1fr) 288px", columnGap: 32, marginTop: 36 },
    desc: { margin: 0, whiteSpace: "pre-wrap", fontSize: 16, lineHeight: "26px", textWrap: "pretty" },
    gallery: { display: "flex", gap: 16, overflowX: "auto", marginTop: 56, paddingBottom: 4, scrollSnapType: "x mandatory", overscrollBehaviorX: "contain" },
    card: { flex: "0 0 calc((100% - 16px) / 2)", minWidth: 0, scrollSnapAlign: "start", background: "#fff", border: "1px solid " + DLC.line, borderRadius: 16, padding: 8, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" },
    arrows: { display: "flex", gap: 8, marginTop: 16 },
    arrowBtn: { width: 32, height: 32, display: "grid", placeItems: "center", background: "none", border: 0, borderRadius: 6, cursor: "pointer" },
    toolsH: { margin: "64px 0 20px", fontSize: 22, fontWeight: 400, lineHeight: "28px" },
    tools: { display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "repeat(5, auto)", gridAutoFlow: "column", gap: "8px 16px", justifyItems: "start" },
    toolsPhone: { display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gridTemplateRows: "repeat(5, auto)", gridAutoFlow: "column", gap: "8px 16px", justifyItems: "start" },
    tool: { background: DLC.chip, borderRadius: 6, padding: "4px 12px", fontSize: 14, lineHeight: "20px", color: DLC.grey, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
    facts: { display: "flex", flexDirection: "column", gap: 24 },
    label: { fontSize: 13, lineHeight: "16px", letterSpacing: "0.04em", textTransform: "uppercase", color: DLC.label, marginBottom: 6 },
    value: { fontSize: 15, lineHeight: "22px" },
    chips: { display: "flex", flexWrap: "wrap", gap: 8 },
    chip: { background: "#fff", border: "1px solid " + DLC.line, borderRadius: 6, padding: "2px 8px", fontSize: 14, lineHeight: "20px" },
    url: { fontFamily: DLC.mono, fontSize: 14, lineHeight: "20px", overflowWrap: "anywhere" },
    more: { display: "flex", flexDirection: "column", gap: 4 },
    outLink: { color: DLC.link, textDecoration: "underline", textUnderlineOffset: 3, display: "inline-flex", alignItems: "center", gap: 4, fontSize: 15, width: "fit-content" },
    rule: { border: 0, borderTop: "1px solid " + DLC.line, margin: "56px 0 40px" },
    factsPhone: { display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 16 },
    foot: { textAlign: "center", color: DLC.grey, fontSize: 14, lineHeight: "18px", padding: "80px 16px 48px", textWrap: "pretty" },
    footA: { color: DLC.grey, textDecoration: "underline", textUnderlineOffset: 3 }
  };
  const dlNoGo = (e) => e.preventDefault();
  const DlClaudeMark = () => /* @__PURE__ */ React$1.createElement("svg", { width: "20", height: "20", viewBox: "0 0 24 24", "aria-hidden": "true", stroke: DLC.clay, strokeWidth: "2.4", strokeLinecap: "round" }, [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => /* @__PURE__ */ React$1.createElement("line", { key: a, x1: "12", y1: "12", x2: "12", y2: i % 2 ? 3.5 : 1.5, transform: "rotate(" + (a + i % 3 * 4) + " 12 12)" })));
  const DlcFact = ({ label, children }) => /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement("div", { style: dlcS.label }, label), children);
  const DlcOut = ({ title, children }) => /* @__PURE__ */ React$1.createElement("a", { href: "#", title, onClick: dlNoGo, style: dlcS.outLink }, children, dlIcon("out", 16, 1.8));
  const DlcFacts = ({ phone }) => {
    const made = /* @__PURE__ */ React$1.createElement(DlcFact, { label: "Made by" }, /* @__PURE__ */ React$1.createElement(DlcOut, null, "Harness Intent Ltd"));
    const cats = /* @__PURE__ */ React$1.createElement(DlcFact, { label: "Categories" }, /* @__PURE__ */ React$1.createElement("div", { style: dlcS.chips }, /* @__PURE__ */ React$1.createElement("span", { style: dlcS.chip }, "Games"), /* @__PURE__ */ React$1.createElement("span", { style: dlcS.chip }, "Problems & puzzles")));
    const sign = /* @__PURE__ */ React$1.createElement(DlcFact, { label: "Sign-in" }, /* @__PURE__ */ React$1.createElement("div", { style: dlcS.value }, "Required"));
    const url = /* @__PURE__ */ React$1.createElement(DlcFact, { label: "Connector URL" }, /* @__PURE__ */ React$1.createElement("div", { style: dlcS.url }, "https://<domain>/mcp"));
    const more = /* @__PURE__ */ React$1.createElement(DlcFact, { label: "More info" }, /* @__PURE__ */ React$1.createElement("div", { style: dlcS.more }, /* @__PURE__ */ React$1.createElement(DlcOut, { title: "<domain>/how-it-works" }, "Documentation"), /* @__PURE__ */ React$1.createElement(DlcOut, { title: "support@harnessintent.com" }, "Support"), /* @__PURE__ */ React$1.createElement(DlcOut, { title: "<domain>/privacy" }, "Privacy Policy")));
    if (phone) return /* @__PURE__ */ React$1.createElement("div", { style: dlcS.factsPhone }, /* @__PURE__ */ React$1.createElement("div", { style: dlcS.facts }, made, cats, sign), /* @__PURE__ */ React$1.createElement("div", { style: dlcS.facts }, url, more));
    return /* @__PURE__ */ React$1.createElement("div", { style: dlcS.facts }, made, cats, sign, url, more);
  };
  const DlcGallery = ({ phone }) => {
    const row = React$1.useRef(null);
    const [ends, setEnds] = React$1.useState([true, false]);
    const onScroll = () => {
      const el = row.current;
      if (el) setEnds([el.scrollLeft < 4, el.scrollLeft + el.clientWidth > el.scrollWidth - 4]);
    };
    const step = (d) => {
      const el = row.current;
      if (el) el.scrollBy({ left: d * (el.firstChild ? el.firstChild.offsetWidth + 16 : 300), behavior: "smooth" });
    };
    return /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement("div", { ref: row, onScroll, className: "dl-scroll", style: phone ? { ...dlcS.gallery, marginTop: 40 } : dlcS.gallery }, DLC_GALLERY.map(([id, name]) => /* @__PURE__ */ React$1.createElement("div", { key: id, style: phone ? { ...dlcS.card, flex: "0 0 calc(100% - 24px)" } : dlcS.card }, /* @__PURE__ */ React$1.createElement(GsChatPic, { turns: GS_CHATS[id][1].turns, width: 640, height: 262, label: name + " being played in a chat" })))), /* @__PURE__ */ React$1.createElement("div", { style: dlcS.arrows }, /* @__PURE__ */ React$1.createElement("button", { type: "button", "aria-label": "Previous", disabled: ends[0], style: { ...dlcS.arrowBtn, opacity: ends[0] ? 0.3 : 1, cursor: ends[0] ? "default" : "pointer" }, onClick: () => step(-1) }, dlIcon("prev", 18)), /* @__PURE__ */ React$1.createElement("button", { type: "button", "aria-label": "Next", disabled: ends[1], style: { ...dlcS.arrowBtn, opacity: ends[1] ? 0.3 : 1, cursor: ends[1] ? "default" : "pointer" }, onClick: () => step(1) }, dlIcon("next", 18))));
  };
  const DlcTools = ({ phone }) => /* @__PURE__ */ React$1.createElement("section", null, /* @__PURE__ */ React$1.createElement("h2", { style: phone ? { ...dlcS.toolsH, marginTop: 48 } : dlcS.toolsH }, "Tools"), /* @__PURE__ */ React$1.createElement("div", { style: phone ? dlcS.toolsPhone : dlcS.tools }, DLC_TOOLS.map((t) => /* @__PURE__ */ React$1.createElement("span", { key: t, style: dlcS.tool }, t))));
  const DlClaudeListing = () => {
    const phone = useDlPhone();
    const notice = /* @__PURE__ */ React$1.createElement("div", { style: phone ? { ...dlcS.notice, marginTop: 28, padding: "16px 16px" } : dlcS.notice }, /* @__PURE__ */ React$1.createElement("span", { style: dlcS.noticeIcon }, dlIcon("info", 16)), /* @__PURE__ */ React$1.createElement("p", { style: { margin: 0 } }, "Community connectors have undergone automated reviews but aren’t verified by Anthropic. We don’t control the tools they make available and can’t guarantee they’ll work as intended or won’t change, so only connect developers you trust. ", /* @__PURE__ */ React$1.createElement("a", { href: "#", onClick: dlNoGo, style: dlcS.a }, "Learn more"), "."));
    const desc = /* @__PURE__ */ React$1.createElement("p", { style: dlcS.desc }, dlText(dlGames("Claude"), DL_HEADS));
    const logo = (size) => /* @__PURE__ */ React$1.createElement("img", { src: DL_LOGO, alt: "", width: size, height: size, style: { display: "block" } });
    return /* @__PURE__ */ React$1.createElement("main", { className: "dl-page", style: dlcS.page, "aria-label": "Directory listing mock: Claude connector" }, phone ? /* @__PURE__ */ React$1.createElement("header", { style: dlcS.headPhone }, /* @__PURE__ */ React$1.createElement("div", { style: { display: "flex", alignItems: "center", gap: 24 } }, /* @__PURE__ */ React$1.createElement("span", { style: dlcS.brand }, /* @__PURE__ */ React$1.createElement(DlClaudeMark, null), "Claude"), /* @__PURE__ */ React$1.createElement("button", { type: "button", style: dlcS.signIn }, "Sign in")), /* @__PURE__ */ React$1.createElement("div", { style: { display: "flex", justifyContent: "flex-end", padding: "8px 22px 8px 0" } }, /* @__PURE__ */ React$1.createElement("button", { type: "button", "aria-label": "Copy link", style: dlcS.copy }, dlIcon("link", 20)))) : /* @__PURE__ */ React$1.createElement("header", { style: dlcS.head }, /* @__PURE__ */ React$1.createElement("span", { style: dlcS.brand }, /* @__PURE__ */ React$1.createElement(DlClaudeMark, null), "Claude"), /* @__PURE__ */ React$1.createElement("div", { style: dlcS.headRight }, /* @__PURE__ */ React$1.createElement("button", { type: "button", style: dlcS.copy }, dlIcon("link", 18), "Copy link"), /* @__PURE__ */ React$1.createElement("button", { type: "button", style: dlcS.signIn }, "Sign in"))), /* @__PURE__ */ React$1.createElement("div", { style: phone ? dlcS.colPhone : dlcS.col }, /* @__PURE__ */ React$1.createElement("a", { href: "#", onClick: dlNoGo, style: phone ? { ...dlcS.back, marginTop: 20 } : dlcS.back }, dlIcon("back", 16, 1.8), "Directory"), phone ? /* @__PURE__ */ React$1.createElement("div", { style: { marginTop: 16, paddingBottom: 28, borderBottom: "1px solid " + DLC.line } }, /* @__PURE__ */ React$1.createElement("div", { style: dlcS.tile }, logo(56)), /* @__PURE__ */ React$1.createElement("div", { style: { ...dlcS.nameRow, marginTop: 16 } }, /* @__PURE__ */ React$1.createElement("h1", { style: dlcS.namePhone }, "After Pixels"), /* @__PURE__ */ React$1.createElement("span", { style: dlcS.tagPhone }, "Community")), /* @__PURE__ */ React$1.createElement("p", { style: dlcS.oneLiner }, DLC_ONELINER), /* @__PURE__ */ React$1.createElement("button", { type: "button", style: { ...dlcS.add, marginTop: 16 } }, "Sign in to add")) : /* @__PURE__ */ React$1.createElement("div", { style: dlcS.titleGrid }, /* @__PURE__ */ React$1.createElement("div", { style: dlcS.titleLeft }, /* @__PURE__ */ React$1.createElement("div", { style: dlcS.tile }, logo(56)), /* @__PURE__ */ React$1.createElement("div", { style: { minWidth: 0 } }, /* @__PURE__ */ React$1.createElement("div", { style: dlcS.nameRow }, /* @__PURE__ */ React$1.createElement("h1", { style: dlcS.name }, "After Pixels"), /* @__PURE__ */ React$1.createElement("span", { style: dlcS.tag }, "Community")), /* @__PURE__ */ React$1.createElement("p", { style: dlcS.oneLiner }, DLC_ONELINER))), /* @__PURE__ */ React$1.createElement("button", { type: "button", style: dlcS.add }, "Sign in to add")), notice, phone ? /* @__PURE__ */ React$1.createElement("div", { style: { marginTop: 36 } }, desc, /* @__PURE__ */ React$1.createElement(DlcGallery, { phone: true }), /* @__PURE__ */ React$1.createElement(DlcTools, { phone: true }), /* @__PURE__ */ React$1.createElement("hr", { style: dlcS.rule }), /* @__PURE__ */ React$1.createElement(DlcFacts, { phone: true })) : /* @__PURE__ */ React$1.createElement("div", { style: dlcS.body }, /* @__PURE__ */ React$1.createElement("div", { style: { minWidth: 0 } }, desc, /* @__PURE__ */ React$1.createElement(DlcGallery, null), /* @__PURE__ */ React$1.createElement(DlcTools, null)), /* @__PURE__ */ React$1.createElement("aside", null, /* @__PURE__ */ React$1.createElement(DlcFacts, null)))), /* @__PURE__ */ React$1.createElement("p", { style: dlcS.foot }, "Submission to the Directory is governed by the ", /* @__PURE__ */ React$1.createElement("a", { href: "#", onClick: dlNoGo, style: dlcS.footA }, "Software Directory Terms"), "; use of Connectors is governed by your ", /* @__PURE__ */ React$1.createElement("a", { href: "#", onClick: dlNoGo, style: dlcS.footA }, "relevant terms"), "."));
  };
  const DLG = {
    ink: "#0D0D0D",
    grey: "#5D5D5D",
    line: "#E5E5E5",
    sel: "#ECECEC",
    blue: "#1F43B1",
    sans: '-apple-system, BlinkMacSystemFont, Inter, "Segoe UI", Helvetica, Arial, sans-serif'
  };
  const DLG_PROMPTS = ["What can I play today?", "Give me today's word puzzle.", "I want a mystery to solve."];
  const DLG_INFO = [["Developer", "Harness Intent Ltd"], ["Category", "Entertainment"], ["Website", null, "<domain>"], ["Version", "1.0.0"], ["Privacy Policy", null, "<domain>/privacy"], ["Terms of Service", null, "<domain>/terms"]];
  const dlgS = {
    page: { flex: 1, minHeight: "100%", display: "flex", background: "#fff", color: DLG.ink, font: "400 15px/1.4 " + DLG.sans, WebkitFontSmoothing: "antialiased" },
    side: { width: 260, flex: "none", borderRight: "1px solid " + DLG.line, position: "sticky", top: 0, height: "100vh", display: "flex", flexDirection: "column", padding: "20px 12px 20px" },
    sideTop: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 4px 0 8px", marginBottom: 16 },
    sideIcons: { display: "flex", gap: 16 },
    iconBtn: { width: 24, height: 24, display: "grid", placeItems: "center", background: "none", border: 0, padding: 0, cursor: "pointer" },
    nav: { display: "flex", flexDirection: "column", gap: 4 },
    item: { display: "flex", alignItems: "center", gap: 10, height: 44, padding: "0 10px", borderRadius: 8, fontSize: 15, background: "none", border: 0, textAlign: "left", cursor: "pointer", width: "100%" },
    itemSel: { background: DLG.sel },
    sideFoot: { marginTop: "auto", display: "flex", flexDirection: "column" },
    tailor: { borderTop: "1px solid " + DLG.line, marginTop: 12, padding: "16px 8px 0" },
    tailorH: { fontSize: 14, fontWeight: 600, margin: 0 },
    tailorP: { fontSize: 13, lineHeight: "20px", color: DLG.grey, margin: "8px 0 12px" },
    outPill: { width: "100%", height: 40, borderRadius: 999, border: "1px solid " + DLG.line, background: "#fff", fontSize: 15, cursor: "pointer" },
    main: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column" },
    top: { display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, padding: "0 20px" },
    topPhone: { display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, padding: "0 20px 0 16px" },
    crumb: { display: "flex", alignItems: "center", gap: 6, fontSize: 15, background: "none", border: 0, padding: 0, cursor: "pointer" },
    blackPill: { height: 40, padding: "0 18px", borderRadius: 999, background: DLG.ink, color: "#fff", border: 0, fontSize: 15, fontWeight: 500, cursor: "pointer", flex: "none" },
    col: { width: "100%", maxWidth: 776, margin: "0 auto", padding: "36px 18px 96px" },
    colPhone: { padding: "4px 16px 64px" },
    tile: { width: 56, height: 56, borderRadius: 12, border: "1px solid " + DLG.line, display: "grid", placeItems: "center", background: "#fff" },
    nameRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginTop: 40 },
    name: { margin: 0, fontSize: 28, fontWeight: 600, lineHeight: "34px", letterSpacing: "-0.01em" },
    sub: { margin: "4px 0 0", fontSize: 15, color: DLG.grey },
    banner: {
      margin: "24px 8px 0",
      borderRadius: 20,
      minHeight: 228,
      padding: "28px 16px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      background: "radial-gradient(ellipse 40% 30% at 32% 22%, rgba(255,255,255,0.55), transparent 70%), radial-gradient(ellipse 30% 30% at 82% 92%, rgba(255,255,255,0.5), transparent 70%), linear-gradient(90deg, #AACCF2 0%, #BCC8F4 50%, #C8C4F6 100%)"
    },
    pill: { display: "flex", alignItems: "center", gap: 8, minHeight: 44, padding: "8px 8px 8px 8px", borderRadius: 999, background: "rgba(255,255,255,0.82)", fontSize: 16, lineHeight: "24px", maxWidth: "100%" },
    pillPhone: { display: "flex", alignItems: "center", gap: 8, padding: "8px 8px 8px 8px", borderRadius: 12, background: "rgba(255,255,255,0.82)", fontSize: 16, lineHeight: "24px", width: "100%", maxWidth: 240 },
    pillMark: { width: 20, height: 20, verticalAlign: "-4px", marginRight: 4, display: "inline-block" },
    pillName: { color: DLG.blue, fontWeight: 500 },
    go: { width: 28, height: 28, borderRadius: 999, background: "#D9D9DE", display: "grid", placeItems: "center", flex: "none", border: 0, padding: 0, cursor: "pointer" },
    desc: { margin: "28px 0 0", whiteSpace: "pre-wrap", fontSize: 14, lineHeight: "18px", color: DLG.grey, textWrap: "pretty" },
    h2: { margin: "48px 0 16px", fontSize: 15, fontWeight: 600 },
    app: { display: "flex", alignItems: "center", gap: 12, fontSize: 14 },
    appIcon: { width: 40, height: 40, borderRadius: 999, border: "1px solid " + DLG.line, display: "grid", placeItems: "center", background: "#fff" },
    table: { borderTop: "1px solid " + DLG.line, margin: 0 },
    row: { display: "grid", gridTemplateColumns: "160px minmax(0,1fr)", alignItems: "center", minHeight: 45, borderBottom: "1px solid " + DLG.line, fontSize: 14 },
    dt: { color: DLG.grey },
    dd: { margin: 0, display: "flex" },
    ext: { color: DLG.ink, display: "inline-flex" },
    notice: { margin: "48px 0 0", fontSize: 14, lineHeight: "20px", color: DLG.grey, textWrap: "pretty" },
    u: { color: DLG.grey, textDecoration: "underline", textUnderlineOffset: 2 }
  };
  const DlGptMark = () => /* @__PURE__ */ React$1.createElement("svg", { width: "26", height: "26", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", "aria-hidden": "true" }, [0, 60, 120, 180, 240, 300].map((a) => /* @__PURE__ */ React$1.createElement("ellipse", { key: a, cx: "12", cy: "7.2", rx: "3.4", ry: "5", transform: "rotate(" + a + " 12 12)" })));
  const DlgItem = ({ icon, sel, children }) => /* @__PURE__ */ React$1.createElement("button", { type: "button", style: sel ? { ...dlgS.item, ...dlgS.itemSel } : dlgS.item, "aria-current": sel ? "page" : void 0 }, dlIcon(icon, 20, 1.6), children);
  const DlgSidebar = () => /* @__PURE__ */ React$1.createElement("nav", { style: dlgS.side, "aria-label": "ChatGPT sidebar (mock)" }, /* @__PURE__ */ React$1.createElement("div", { style: dlgS.sideTop }, /* @__PURE__ */ React$1.createElement(DlGptMark, null), /* @__PURE__ */ React$1.createElement("div", { style: dlgS.sideIcons }, /* @__PURE__ */ React$1.createElement("button", { type: "button", "aria-label": "Search", style: dlgS.iconBtn }, dlIcon("search", 20)), /* @__PURE__ */ React$1.createElement("button", { type: "button", "aria-label": "Close sidebar", style: dlgS.iconBtn }, dlIcon("panel", 20)))), /* @__PURE__ */ React$1.createElement("div", { style: dlgS.nav }, /* @__PURE__ */ React$1.createElement(DlgItem, { icon: "pen" }, "New chat"), /* @__PURE__ */ React$1.createElement(DlgItem, { icon: "images" }, "Images"), /* @__PURE__ */ React$1.createElement(DlgItem, { icon: "plugin", sel: true }, "Plugins"), /* @__PURE__ */ React$1.createElement(DlgItem, { icon: "scope" }, "Deep research")), /* @__PURE__ */ React$1.createElement("div", { style: dlgS.sideFoot }, /* @__PURE__ */ React$1.createElement(DlgItem, { icon: "plans" }, "See plans and pricing"), /* @__PURE__ */ React$1.createElement(DlgItem, { icon: "gear" }, "Settings"), /* @__PURE__ */ React$1.createElement(DlgItem, { icon: "help" }, "Help"), /* @__PURE__ */ React$1.createElement("div", { style: dlgS.tailor }, /* @__PURE__ */ React$1.createElement("p", { style: dlgS.tailorH }, "Get responses tailored to you"), /* @__PURE__ */ React$1.createElement("p", { style: dlgS.tailorP }, "Log in to get answers based on saved chats, plus create images and upload files."), /* @__PURE__ */ React$1.createElement("button", { type: "button", style: dlgS.outPill }, "Log in"))));
  const DlgPill = ({ text, phone }) => /* @__PURE__ */ React$1.createElement("div", { style: phone ? dlgS.pillPhone : dlgS.pill }, /* @__PURE__ */ React$1.createElement("span", { style: { flex: phone ? 1 : "none", paddingLeft: 4 } }, /* @__PURE__ */ React$1.createElement("img", { src: DL_LOGO, alt: "", style: dlgS.pillMark }), /* @__PURE__ */ React$1.createElement("span", { style: dlgS.pillName }, "After Pixels"), " ", text), /* @__PURE__ */ React$1.createElement("button", { type: "button", "aria-label": "Send: " + text, style: dlgS.go }, dlIcon("arrow", 14, 2)));
  const DlChatGptListing = () => {
    const phone = useDlPhone();
    return /* @__PURE__ */ React$1.createElement("div", { className: "dl-page", style: dlgS.page }, !phone && /* @__PURE__ */ React$1.createElement(DlgSidebar, null), /* @__PURE__ */ React$1.createElement("main", { style: dlgS.main, "aria-label": "Plugin listing mock: ChatGPT" }, /* @__PURE__ */ React$1.createElement("div", { style: phone ? dlgS.topPhone : dlgS.top }, /* @__PURE__ */ React$1.createElement("div", { style: { display: "flex", alignItems: "center", gap: 16 } }, phone && /* @__PURE__ */ React$1.createElement("button", { type: "button", "aria-label": "Open sidebar", style: dlgS.iconBtn }, dlIcon("panel", 20)), /* @__PURE__ */ React$1.createElement("button", { type: "button", style: dlgS.crumb }, dlIcon("prev", 14, 2), "Plugins")), /* @__PURE__ */ React$1.createElement("button", { type: "button", style: phone ? { ...dlgS.blackPill, height: 32, padding: "0 12px", fontSize: 14 } : dlgS.blackPill }, "Log in")), /* @__PURE__ */ React$1.createElement("div", { style: phone ? dlgS.colPhone : dlgS.col }, /* @__PURE__ */ React$1.createElement("div", { style: dlgS.tile }, /* @__PURE__ */ React$1.createElement("img", { src: DL_LOGO, alt: "", width: "40", height: "40" })), /* @__PURE__ */ React$1.createElement("div", { style: phone ? { ...dlgS.nameRow, marginTop: 36 } : dlgS.nameRow }, /* @__PURE__ */ React$1.createElement("h1", { style: dlgS.name }, "After Pixels"), /* @__PURE__ */ React$1.createElement("button", { type: "button", style: dlgS.blackPill }, "Install plugin")), /* @__PURE__ */ React$1.createElement("p", { style: dlgS.sub }, "Daily puzzles and story games"), /* @__PURE__ */ React$1.createElement("div", { style: phone ? { ...dlgS.banner, gap: 16, padding: "32px 16px" } : dlgS.banner }, DLG_PROMPTS.map((p) => /* @__PURE__ */ React$1.createElement(DlgPill, { key: p, text: p, phone }))), /* @__PURE__ */ React$1.createElement("p", { style: dlgS.desc }, dlText(dlGames("ChatGPT"), DL_HEADS)), /* @__PURE__ */ React$1.createElement("h2", { style: dlgS.h2 }, "App"), /* @__PURE__ */ React$1.createElement("div", { style: dlgS.app }, /* @__PURE__ */ React$1.createElement("span", { style: dlgS.appIcon }, /* @__PURE__ */ React$1.createElement("img", { src: DL_LOGO, alt: "", width: "26", height: "26" })), "After Pixels"), /* @__PURE__ */ React$1.createElement("h2", { style: dlgS.h2 }, "Information"), /* @__PURE__ */ React$1.createElement("dl", { style: dlgS.table }, DLG_INFO.map(([k, v, t]) => /* @__PURE__ */ React$1.createElement("div", { key: k, style: phone ? { ...dlgS.row, gridTemplateColumns: "162px minmax(0,1fr)" } : dlgS.row }, /* @__PURE__ */ React$1.createElement("dt", { style: dlgS.dt }, k), /* @__PURE__ */ React$1.createElement("dd", { style: dlgS.dd }, v || /* @__PURE__ */ React$1.createElement("a", { href: "#", onClick: dlNoGo, title: t, "aria-label": k + " (" + t + ")", style: dlgS.ext }, dlIcon("ext", 18, 1.7)))))), /* @__PURE__ */ React$1.createElement("p", { style: dlgS.notice }, "When connected to After Pixels, ChatGPT may share relevant chats and memories with this app to help provide context for your requests. After Pixels's use of this data is subject to their ", /* @__PURE__ */ React$1.createElement("a", { href: "#", onClick: dlNoGo, style: dlgS.u }, "terms"), " and ", /* @__PURE__ */ React$1.createElement("a", { href: "#", onClick: dlNoGo, style: dlgS.u }, "privacy policy"), ". If you have ", /* @__PURE__ */ React$1.createElement("a", { href: "#", onClick: dlNoGo, style: dlgS.u }, "Memory"), " enabled, data from the app may be used to proactively provide helpful information or suggestions. ChatGPT always respects your training data preferences, including for data from connected apps. Use of apps may come with ", /* @__PURE__ */ React$1.createElement("a", { href: "#", onClick: dlNoGo, style: dlgS.u }, "elevated risk"), ". You can manage your preferences or disconnect from apps anytime in your settings. ", /* @__PURE__ */ React$1.createElement("a", { href: "#", onClick: dlNoGo, style: dlgS.u }, "Learn more")))));
  };
  const DL_STATES = [
    { group: "Store listing", id: "directory-listing-claude", label: "Directory listing: Claude connector", stage: (c) => c.go("directory-claude") },
    { group: "Store listing", id: "directory-listing-chatgpt", label: "Directory listing: ChatGPT plugin", stage: (c) => c.go("directory-chatgpt") }
  ];
  const GpMini = ({ art, sm }) => /* @__PURE__ */ React$1.createElement("span", { className: "pg-mini" + (sm ? " is-sm" : ""), "aria-hidden": "true", dangerouslySetInnerHTML: { __html: (GS_ART[art] || {}).svg } });
  let GP_CFG;
  let GP_LINE;
  const gpToRecord = (gs, id) => gs.go(GS_GAMES[id].route, { page: "record" });
  const GpCard = ({ id }) => {
    const gs = useGs();
    const g = GS_GAMES[id];
    return /* @__PURE__ */ React$1.createElement("section", { className: "pg-band", "aria-label": "In your library" }, /* @__PURE__ */ React$1.createElement(GpMini, { art: g.art }), /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-xs" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-label" }, "IN YOUR LIBRARY"), /* @__PURE__ */ React$1.createElement("span", { className: "gs-small" }, GP_LINE[id] || "See every " + GP_CFG[id].units.replace(/s$/, "") + " you’ve played and how each one ended.")), /* @__PURE__ */ React$1.createElement("div", { className: "pg-band-link" }, /* @__PURE__ */ React$1.createElement(DS.TextLink, { onClick: () => gpToRecord(gs, id) }, "Go to your " + g.name.replace(/^The /, ""))));
  };
  const gpGame = (id) => () => {
    const gs = useGs();
    if (gs.view !== "out" && gs.route.page === "record") {
      const L = GS_LIBRARY[id];
      return gs.route.list && !gs.route.sid ? /* @__PURE__ */ React$1.createElement(PgeListPage, { key: id, gid: id }) : /* @__PURE__ */ React$1.createElement(L, null);
    }
    const canPlay = gs.view === "pass" || !!(GS_GAMES[id].free || GS_GAMES[id].first);
    return /* @__PURE__ */ React$1.createElement(GsGamePage, { id, top: gs.view !== "out" && canPlay ? /* @__PURE__ */ React$1.createElement(GpCard, { id }) : null });
  };
  let GsDelve;
  let GsWord;
  let GsGroups;
  let GsMystery;
  let GsWhere;
  let GsChain;
  let GsSalvage;
  let GsEscape;
  let GsCasebook;
  let GsHunter;
  let GsBarrow;
  function initGsPlayer() {
    GP_CFG = {
      delve: { units: "runs" },
      word: { units: "words" },
      groups: { units: "groups" },
      mystery: { units: "cases" },
      where: { units: "countries" },
      chain: { units: "chains" },
      salvage: { units: "seas" },
      escape: { units: "rooms" },
      casebook: { units: "cases" },
      hunter: { units: "days" }
    };
    GP_LINE = {
      word: "See every day’s word and how many guesses it took you.",
      groups: "See every day’s groups and how many mistakes you made.",
      mystery: "See every case you closed and every one that got away.",
      where: "See every day’s country and how many guesses it took you.",
      chain: "See every day’s chain and how many wrong guesses you made.",
      salvage: "See every day’s sea and how many dives it took you.",
      escape: "See every room you got out of, with your time against par, hints and wrong tries.",
      casebook: "See every case you’ve worked and the lies you caught.",
      hunter: "See every day you’ve explored, what you learned and who you met.",
      delve: "See every week’s run you’ve played and how each one ended.",
      barrow: "See every chapter you’ve played and how each one ended."
    };
    GsDelve = gpGame("delve");
    GsWord = gpGame("word");
    GsGroups = gpGame("groups");
    GsMystery = gpGame("mystery");
    GsWhere = gpGame("where");
    GsChain = gpGame("chain");
    GsSalvage = gpGame("salvage");
    GsEscape = gpGame("escape");
    GsCasebook = gpGame("casebook");
    GsHunter = gpGame("hunter");
    GsBarrow = gpGame("barrow");
  }
  const useGsDone = (ms) => {
    const [on, setOn] = React$1.useState(false);
    React$1.useEffect(() => {
      if (!on) return void 0;
      const t = setTimeout(() => setOn(false), ms);
      return () => clearTimeout(t);
    }, [on]);
    return [on, () => setOn(true)];
  };
  const GsDone = ({ children }) => /* @__PURE__ */ React$1.createElement("span", { className: "gs-ico-row gs-done", role: "status" }, /* @__PURE__ */ React$1.createElement(DS.Icon, { name: "check" }), children);
  const GsIdentity = ({ open, provider, onCancel, onOk }) => {
    const gs = useGs();
    const [pw, setPw] = React$1.useState("");
    const [tried, setTried] = React$1.useState(false);
    const [codeErr, setCodeErr] = React$1.useState(false);
    const [resent, setResent] = React$1.useState(false);
    const ref = React$1.useRef(null);
    const [busy, run, cancel] = useGsBusy();
    const [sending, runSend] = useGsBusy();
    React$1.useEffect(() => {
      if (open) {
        setPw("");
        setTried(false);
        setCodeErr(false);
        setResent(false);
      }
    }, [open]);
    React$1.useEffect(() => {
      if (!resent) return void 0;
      const t = setTimeout(() => setResent(false), 2600);
      return () => clearTimeout(t);
    }, [resent]);
    const err = tried && !pw ? "Enter your password." : null;
    const refocus = () => setTimeout(() => ref.current && ref.current.focus(), 0);
    const go = (e) => {
      e && e.preventDefault();
      if (busy) return;
      setTried(true);
      if (provider) {
        if (pw.length < 6) {
          setCodeErr(true);
          refocus();
          return;
        }
        run(() => {
          if (pw === "111111") {
            setCodeErr(true);
            refocus();
            return;
          }
          onOk();
        });
        return;
      }
      if (!pw) {
        refocus();
        return;
      }
      run(onOk);
    };
    const close = () => {
      cancel();
      onCancel();
    };
    return /* @__PURE__ */ React$1.createElement(DS.Popup, { open, onClose: close, posture: "window", label: "Confirm it’s you" }, /* @__PURE__ */ React$1.createElement(GsPopTitle, null, "Confirm it’s you"), provider ? /* @__PURE__ */ React$1.createElement("form", { noValidate: true, onSubmit: go, className: "gs-stack-md" }, /* @__PURE__ */ React$1.createElement("p", null, "Enter the code sent to ", /* @__PURE__ */ React$1.createElement("b", null, gs.user.email), "."), /* @__PURE__ */ React$1.createElement(
      DS.TextField,
      {
        label: "Verification code",
        inputMode: "numeric",
        maxLength: 6,
        placeholder: "000000",
        autoComplete: "one-time-code",
        className: "gs-code gs-code-sm",
        value: pw,
        error: codeErr ? "That code’s not right. Check and re-enter." : null,
        inputRef: (el) => {
          ref.current = el;
        },
        onChange: (e) => {
          setPw(e.target.value.replace(/[^0-9]/g, "").slice(0, 6));
          setCodeErr(false);
        }
      }
    ), /* @__PURE__ */ React$1.createElement("div", { className: "gs-link-slot" }, resent ? /* @__PURE__ */ React$1.createElement("span", { className: "gs-ico-row", role: "status" }, /* @__PURE__ */ React$1.createElement(DS.Icon, { name: "check" }), "A fresh code is on its way.") : /* @__PURE__ */ React$1.createElement(DS.TextLink, { onClick: () => runSend(() => {
      setResent(true);
      setPw("");
      setCodeErr(false);
      refocus();
    }), "aria-busy": sending || void 0 }, sending && /* @__PURE__ */ React$1.createElement(GsInkSpin, null), "Send a new code")), /* @__PURE__ */ React$1.createElement(GsActs, null, /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "secondary", onClick: close }, "Cancel"), /* @__PURE__ */ React$1.createElement(DS.Button, { type: "submit", loading: busy }, "Confirm"))) : /* @__PURE__ */ React$1.createElement("form", { noValidate: true, onSubmit: go, className: "gs-stack-md" }, /* @__PURE__ */ React$1.createElement("p", null, "Enter your password to continue."), /* @__PURE__ */ React$1.createElement(
      DS.TextField,
      {
        label: "Password",
        type: "password",
        autoComplete: "current-password",
        placeholder: "••••••••",
        value: pw,
        error: err,
        inputRef: (el) => {
          ref.current = el;
        },
        onChange: (e) => setPw(e.target.value)
      }
    ), /* @__PURE__ */ React$1.createElement(GsActs, null, /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "secondary", onClick: close }, "Cancel"), /* @__PURE__ */ React$1.createElement(DS.Button, { type: "submit", loading: busy }, "Continue"))));
  };
  const GS_ACCT_CARD = { gap: 16, justifyItems: "stretch", alignContent: "start" };
  const GsChangeEmail = () => {
    const gs = useGs();
    const staged = gs.route.stage === "email-code";
    const [phase, setPhase] = React$1.useState(staged ? "code" : "form");
    const [pending, setPending] = React$1.useState(staged ? "new@example.com" : "");
    const [confirm, setConfirm] = React$1.useState(false);
    const [code, setCode] = React$1.useState("");
    const [codeErr, setCodeErr] = React$1.useState(false);
    const codeRef = React$1.useRef(null);
    const [busy, run, cancel] = useGsBusy();
    const [done, showDone] = useGsDone(3600);
    const form = useGsForm({ email: "" }, [
      ["email", (v) => GS_EMAIL_RE.test(v.trim()), "Enter a valid email address."],
      ["email", (v) => v.trim().toLowerCase() !== gs.user.email.toLowerCase(), "That’s already your email. Enter a different one."]
    ], (f) => {
      setPending(f.email.trim());
      setConfirm(true);
    }, { instant: true });
    const cancelCode = () => {
      cancel();
      setPhase("form");
      setCode("");
      setCodeErr(false);
    };
    const confirmCode = (e) => {
      e.preventDefault();
      if (busy) return;
      const wrong = () => {
        setCodeErr(true);
        setTimeout(() => codeRef.current && codeRef.current.focus(), 0);
      };
      if (code.length < 6) {
        wrong();
        return;
      }
      run(() => {
        if (code === "111111") {
          wrong();
          return;
        }
        gs.setUser({ email: pending });
        form.clear();
        cancelCode();
        showDone();
      });
    };
    return /* @__PURE__ */ React$1.createElement(DS.Card, { style: GS_ACCT_CARD }, /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-card" }, "Change email"), phase === "form" ? /* @__PURE__ */ React$1.createElement("form", { noValidate: true, onSubmit: form.submit, className: "gs-stack-md" }, /* @__PURE__ */ React$1.createElement(DS.TextField, { label: "New email", type: "email", autoComplete: "email", placeholder: "new@example.com", ...form.bind("email") }), /* @__PURE__ */ React$1.createElement("div", { className: "gs-card-acts" }, done && /* @__PURE__ */ React$1.createElement(GsDone, null, "Email updated."), /* @__PURE__ */ React$1.createElement(DS.Button, { type: "submit" }, "Update email"))) : /* @__PURE__ */ React$1.createElement("form", { noValidate: true, onSubmit: confirmCode, className: "gs-stack-md" }, /* @__PURE__ */ React$1.createElement("p", null, "Enter the code sent to ", /* @__PURE__ */ React$1.createElement("b", null, pending), ". Your email switches once it’s confirmed."), /* @__PURE__ */ React$1.createElement(
      DS.TextField,
      {
        label: "Verification code",
        inputMode: "numeric",
        maxLength: 6,
        placeholder: "000000",
        autoComplete: "one-time-code",
        className: "gs-code gs-code-sm",
        value: code,
        error: codeErr ? "That code’s not right. Check and re-enter." : null,
        inputRef: (el) => {
          codeRef.current = el;
        },
        onChange: (e) => {
          setCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6));
          setCodeErr(false);
        }
      }
    ), /* @__PURE__ */ React$1.createElement("div", { className: "gs-card-acts gs-card-acts-pair" }, /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "secondary", onClick: cancelCode }, "Cancel"), /* @__PURE__ */ React$1.createElement(DS.Button, { type: "submit", loading: busy }, "Confirm"))), /* @__PURE__ */ React$1.createElement(GsIdentity, { open: confirm, onCancel: () => setConfirm(false), onOk: () => {
      setConfirm(false);
      setPhase("code");
    } }));
  };
  const GsChangePassword = () => {
    const [done, showDone] = useGsDone(3200);
    const form = useGsForm({ cur: "", pw: "", pw2: "" }, [
      ["cur", (v) => v.length > 0, "Enter your current password."],
      ["pw", (v) => v.length >= 8, "Use at least 8 characters."],
      ["pw2", (v, f) => v === f.pw, "Passwords don’t match. Re-enter to confirm."]
    ], () => {
      form.clear();
      showDone();
    });
    return /* @__PURE__ */ React$1.createElement(DS.Card, { style: GS_ACCT_CARD }, /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-card" }, "Change password"), /* @__PURE__ */ React$1.createElement("form", { noValidate: true, onSubmit: form.submit, className: "gs-stack-md" }, /* @__PURE__ */ React$1.createElement(DS.TextField, { label: "Current password", type: "password", autoComplete: "current-password", placeholder: "••••••••", ...form.bind("cur") }), /* @__PURE__ */ React$1.createElement(DS.TextField, { label: "New password", type: "password", autoComplete: "new-password", placeholder: "At least 8 characters", ...form.bind("pw") }), /* @__PURE__ */ React$1.createElement(DS.TextField, { label: "Confirm new password", type: "password", autoComplete: "new-password", placeholder: "Re-enter new password", ...form.bind("pw2") }), /* @__PURE__ */ React$1.createElement("div", { className: "gs-card-acts" }, done && /* @__PURE__ */ React$1.createElement(GsDone, null, "Password updated."), /* @__PURE__ */ React$1.createElement(DS.Button, { type: "submit", loading: form.busy }, "Update password"))));
  };
  const GsDeleteAccount = () => {
    const gs = useGs();
    const [step, setStep] = React$1.useState(gs.route.stage === "delete" ? "alert" : gs.route.stage === "delete-code" ? "identity" : null);
    const provider = gs.provider === "email" ? null : gs.provider;
    const holds = GS_SUB_HOLDS.includes(gs.sub.status);
    const st = gs.sub.status;
    const passLine = !holds ? null : st === "failed" ? "Your Pass ends straight away." : "Your Pass is cancelled. No more payments are taken, and nothing is refunded.";
    return /* @__PURE__ */ React$1.createElement(DS.Card, { style: GS_ACCT_CARD }, /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-card" }, "Delete account"), /* @__PURE__ */ React$1.createElement("p", null, "Your account goes, and so does your play history."), /* @__PURE__ */ React$1.createElement("div", { className: "gs-card-acts" }, /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "secondary", className: "gs-btn-danger-outline", onClick: () => setStep("alert") }, "Delete your account")), /* @__PURE__ */ React$1.createElement(DS.Popup, { open: step === "alert", onClose: () => setStep(null), posture: "window", label: "Delete your account?" }, /* @__PURE__ */ React$1.createElement(GsPopTitle, null, "Delete your account?"), /* @__PURE__ */ React$1.createElement("p", null, "This deletes your name, username, email, results, history, streaks and achievements. It can’t be undone."), passLine && /* @__PURE__ */ React$1.createElement("p", null, passLine), /* @__PURE__ */ React$1.createElement(GsActs, null, /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "secondary", onClick: () => setStep(null) }, "Cancel"), /* @__PURE__ */ React$1.createElement(DS.Button, { variant: "danger", onClick: () => setStep("identity") }, "Delete account"))), /* @__PURE__ */ React$1.createElement(GsIdentity, { open: step === "identity", provider, onCancel: () => setStep(null), onOk: () => {
      setStep(null);
      gs.deleteAccount();
    } }));
  };
  const GsAccount = () => {
    const gs = useGs();
    const providerAcct = gs.provider !== "email";
    return /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("main", { className: "gs-wrap gs-main gs-acct-page" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-xs" }, /* @__PURE__ */ React$1.createElement("h1", { className: "gs-h1" }, "Account"), /* @__PURE__ */ React$1.createElement("p", { className: "gs-muted" }, gs.user.email)), /* @__PURE__ */ React$1.createElement("div", { className: "gs-acct-cards" }, /* @__PURE__ */ React$1.createElement(GsPassCard, null), /* @__PURE__ */ React$1.createElement(GsUsernameCard, null), providerAcct ? /* @__PURE__ */ React$1.createElement(DS.Card, { style: GS_ACCT_CARD }, /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-card" }, "Change email & password"), /* @__PURE__ */ React$1.createElement("p", null, "Your email and password are managed by your sign-in provider and can be changed there.")) : /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement(GsChangeEmail, null), /* @__PURE__ */ React$1.createElement(GsChangePassword, null)), /* @__PURE__ */ React$1.createElement(GsDeleteAccount, null)), /* @__PURE__ */ React$1.createElement("p", null, /* @__PURE__ */ React$1.createElement("a", { className: "gs-support", href: "mailto:" + GS_SUPPORT }, GS_SUPPORT))));
  };
  function kitStateContext(api) {
    const reseed = () => api.reset();
    const reset = () => reseed();
    return { ...api, reseed, reset };
  }
  const gsPassSet = (p) => GsPassStage && GsPassStage.set(p);
  let KIT_STATE_REGISTER;
  let KIT_STATE_GROUP_NOTES;
  let KIT_STATE_INDEX_NAMES;
  let KIT_STATE_ID_RULE;
  const kitRefuseState = (id, why) => console.error("[kit states] refused state id " + JSON.stringify(id) + ": " + why + ". Fix it in KIT_STATE_REGISTER (app/states.jsx).");
  const kitIdsOf = (s) => [s.id, ...s.aliases || []];
  let KIT_STATES_ACCEPTED;
  function buildStatesBase(api) {
    const ctx = kitStateContext(api);
    const states = KIT_STATES_ACCEPTED.map((s) => ({
      id: s.id,
      aliases: s.aliases || [],
      label: s.label,
      group: s.group,
      go: () => {
        if (s.platform && api.setPlatform) api.setPlatform(s.platform);
        const c = kitStateContext(api);
        c.reseed();
        s.stage(c);
      }
    }));
    const byId = {};
    const groups = [];
    states.forEach((s) => {
      byId[s.id] = s;
      s.aliases.forEach((a) => {
        byId[a] = s;
      });
      let g = groups.find((x) => x.title === s.group);
      if (!g) {
        g = { title: s.group, notes: KIT_STATE_GROUP_NOTES[s.group] || null, items: [] };
        groups.push(g);
      }
      g.items.push(s);
    });
    const kitSortKey = (t) => t.replace(/^App:\s*/i, "");
    const kitCompare = (a, b) => kitSortKey(a).localeCompare(kitSortKey(b), void 0, { sensitivity: "base", numeric: true });
    groups.sort((a, b) => kitCompare(a.title, b.title));
    groups.forEach((g) => g.items.sort((a, b) => kitCompare(a.label, b.label)));
    return { states, byId, groups, reset: ctx.reset };
  }
  function kitResolveState() {
    let raw = null;
    try {
      raw = new URLSearchParams(window.location.search).get("state");
    } catch (e) {
      return null;
    }
    const name = (raw || "").trim().toLowerCase();
    if (!name) return null;
    if (KIT_STATE_INDEX_NAMES.includes(name)) return { kind: "index", name };
    if (KIT_STATES_ACCEPTED.some((s) => kitIdsOf(s).includes(name))) return { kind: "state", id: name };
    return { kind: "unresolved", name };
  }
  function kitStateLink(id) {
    const q = "?state=" + encodeURIComponent(id);
    const own = window.location.origin + window.location.pathname + q;
    if (window.parent === window) return own;
    try {
      const p = window.parent.location;
      const route = p.hash.replace(/^#/, "").split("?")[0];
      if (route) return p.origin + p.pathname + "#" + route + q;
    } catch (e) {
    }
    try {
      const m = window.location.pathname.match(/\/app\/([^/]+)\/([^/]+)\/[^/]*$/);
      if (m && document.referrer) {
        const u = new URL(document.referrer);
        return u.origin + u.pathname + "#" + m[1] + "/" + m[2] + q;
      }
    } catch (e) {
    }
    return own;
  }
  function initStates() {
    KIT_STATE_REGISTER = [
      { group: "Screens", id: "home", label: "1. Home, signed out", stage: (c) => c.go("home") },
      { group: "Screens", id: "sign-up", label: "2. Sign up", stage: (c) => c.go("signup") },
      { group: "Screens", id: "sign-in", label: "2. Sign in", stage: (c) => c.go("signin") },
      { group: "Screens", id: "verify-email", label: "2. Sign up: verify your email", stage: (c) => c.go("verify", { ctx: "signup", email: "you@example.com" }) },
      { group: "Screens", id: "reset-password", label: "2. Sign in: reset your password", stage: (c) => c.go("recover") },
      { group: "Sign in", id: "reset-password-code", label: "Reset your password: enter your code", stage: (c) => c.go("recover", { step: "code", email: "you@example.com" }) },
      { group: "Screens", id: "connect", label: "3. How it works", stage: (c) => {
        c.setView("free");
        c.go("connect");
      } },
      { group: "Screens", id: "delve-free", label: "4. Delve, not paying", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("delve");
      } },
      { group: "Screens", id: "delve-pass", label: "4. Delve, with the Pass", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("delve");
      } },
      { group: "Screens", id: "word-free", label: "5. Daily Word, free account (played today)", stage: (c) => {
        gsPassSet({ freeNew: false });
        c.setView("free");
        c.setConnected(true);
        c.go("word");
      } },
      { group: "Screens", id: "word-signed-out", label: "5. Daily Word, signed out", stage: (c) => c.go("word") },
      { group: "Screens", id: "groups-free", label: "5. Daily Groups, free account", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("groups");
      } },
      { group: "Screens", id: "groups-pass", label: "5. Daily Groups, with the Pass (played)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("groups");
      } },
      { group: "Screens", id: "mystery-pass", label: "5. Daily Mystery, with the Pass (today not solved)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("mystery");
      } },
      { group: "Screens", id: "escape-free", label: "5. Escape, free account", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("escape");
      } },
      { group: "Screens", id: "escape-pass", label: "5. Escape, with the Pass (played this week)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("escape");
      } },
      { group: "Screens", id: "casebook-free", aliases: ["fp-product-casebook-free"], label: "5. Casebook, not paying", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("casebook");
      } },
      { group: "Screens", id: "casebook-pass", label: "5. Casebook, with the Pass", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("casebook");
      } },
      { group: "Screens", id: "hunter-free", aliases: ["fp-product-hunter-free"], label: "5. 36,000 Summers Ago, not paying", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("hunter");
      } },
      { group: "Screens", id: "hunter-pass", label: "5. 36,000 Summers Ago, with the Pass", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("hunter");
      } },
      { group: "Screens", id: "barrow-free", label: "5. The Barrow of Hollowmere, not paying", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("barrow");
      } },
      { group: "Screens", id: "barrow-pass", label: "5. The Barrow of Hollowmere, with the Pass", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("barrow");
      } },
      { group: "Library", id: "library-barrow", label: "The Barrow of Hollowmere in your library, with the Pass, chapter 1 finished", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("barrow", { page: "record" });
        gsPassSet({ bwDone: true });
      } },
      { group: "Library", id: "library-barrow-not-played", label: "The Barrow of Hollowmere in your library, with the Pass, not played", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("barrow", { page: "record" });
      } },
      { group: "Library", id: "barrow-all-chapters", label: "The Barrow of Hollowmere, All chapters", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("barrow", { page: "record", list: true });
      } },
      { group: "Library", id: "library-barrow-free", label: "The Barrow of Hollowmere in your library, free account", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("barrow", { page: "record" });
      } },
      { group: "Screens", id: "games", aliases: ["pass-holder"], label: "6. Discover, with the Pass", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("games");
      } },
      { group: "Screens", id: "games-free", label: "6. Discover, free account (played today)", stage: (c) => {
        gsPassSet({ freeNew: false });
        c.setView("free");
        c.setConnected(true);
        c.go("games");
      } },
      { group: "Screens", id: "games-signed-out", label: "6. Discover, signed out", stage: (c) => c.go("games") },
      { group: "Screens", id: "library", aliases: ["pur-pass-holder"], label: "6. Library, with the Pass", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("library");
      } },
      { group: "Screens", id: "library-free", label: "6. Library, free account", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("library");
      } },
      { group: "Screens", id: "library-pass-ended", label: "6. Library, Pass ended", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.setSub({ hadPass: true });
        c.go("library");
      } },
      { group: "Screens", id: "session-delve", aliases: ["session-delve-past"], label: "7. Session page: Delve", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("session", { id: "delve" });
      } },
      { group: "Screens", id: "session-groups", label: "7. Session page: Daily Groups", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("session", { id: "groups-today" });
      } },
      { group: "Screens", id: "session-escape", label: "7. Session page: Escape", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("session", { id: "escape-week" });
      } },
      { group: "Screens", id: "session-escape-on-par", label: "7. Session page: Escape, out on par", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ escape: "par" });
        c.go("session", { id: "escape-par" });
      } },
      { group: "Screens", id: "session-escape-over", label: "7. Session page: Escape, over par", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ escape: "over" });
        c.go("session", { id: "escape-over" });
      } },
      { group: "Screens", id: "session-escape-hard", label: "7. Session page: Escape, the hard play (six locks, 18 tries on one)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ ed: "hard" });
        c.go("session", { id: "escape-hard" });
      } },
      { group: "Screens", id: "session-escape-in-progress", label: "7. Session page: Escape in progress", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ week: "live" });
        c.go("session", { id: "escape-live" });
      } },
      { group: "Screens", id: "session-delve-fallen", label: "7. Session page: Delve, a run that fell", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("session", { id: "delve-fallen" });
      } },
      { group: "Screens", id: "session-delve-hard", label: "7. Session page: Delve, the hard play (overrun, going back three times)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("session", { id: "delve-hard" });
      } },
      { group: "Screens", id: "session-delve-in-progress", label: "7. Session page: Delve in progress (Wren)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ week: "live" });
        c.go("session", { id: "delve-live" });
      } },
      { group: "Screens", id: "session-puzzle", label: "7. Session page: Daily Word", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("session", { id: "word-today" });
      } },
      { group: "Screens", id: "session-word-hard", label: "7. Session page: Daily Word, the hard play (five guesses and the hint)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("session", { id: "word-hard" });
      } },
      { group: "Screens", id: "session-word-failed", label: "7. Session page: Daily Word, failed (six guesses)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("session", { id: "word-failed" });
      } },
      { group: "Screens", id: "session-barrow", label: "7. Session page: The Barrow, chapter 1 finished (Play again)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("session", { id: "gs-pu-barrow-ch1" });
        gsPassSet({ bwDone: true });
      } },
      { group: "Screens", id: "session-kept-pass-ended", label: "7. Session page: Pass ended, an unfinished 36,000 Summers Ago day (kept, no Play)", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.setSub({ hadPass: true });
        c.go("session", { id: "hunter-hg8" });
      } },
      { group: "Screens", id: "session-casebook", aliases: ["library-casebook-case"], label: "7. Session page: Casebook", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("casebook", { page: "record", sid: CB_ID });
      } },
      { group: "Screens", id: "session-hunter", label: "7. Session page: 36,000 Summers Ago", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("session", { id: "hunter-hg0" });
      } },
      { group: "Screens", id: "session-word-in-progress", label: "7. Session page: Daily Word in progress", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ week: "live" });
        c.go("session", { id: "word-live" });
      } },
      { group: "Screens", id: "session-mystery", label: "7. Session page: Daily Mystery", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("session", { id: "mystery-today" });
      } },
      { group: "Screens", id: "session-mystery-in-progress", label: "7. Session page: Daily Mystery in progress", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ week: "live" });
        c.go("session", { id: "mystery-live" });
      } },
      { group: "Screens", id: "history", label: "8. History, with the Pass", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("history");
      } },
      { group: "Screens", id: "pass-free", aliases: ["pass-page-never-subscribed"], label: "9. Pass, with a free account", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("pass");
      } },
      { group: "Screens", id: "pass-holder-page", label: "9. Pass, with the Pass", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("pass");
      } },
      { group: "Library", id: "library-casebook", label: "Casebook in your library, with the Pass", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("casebook", { page: "record" });
      } },
      { group: "Library", id: "library-casebook-in-progress", label: "Casebook in your library, the case in progress", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ week: "live" });
        c.go("casebook", { page: "record" });
      } },
      { group: "Library", id: "library-delve", label: "Delve in your library, with the Pass", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("delve", { page: "record" });
      } },
      { group: "Library", id: "library-delve-in-progress", label: "Delve in your library, this week in progress", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ week: "live" });
        c.go("delve", { page: "record" });
      } },
      { group: "Library", id: "library-delve-hard", label: "Delve in your library, the hard play (overrun, going back three times)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ ed: "hard" });
        c.go("delve", { page: "record" });
      } },
      { group: "Library", id: "library-word", label: "Daily Word in your library, with the Pass", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("word", { page: "record" });
      } },
      { group: "Library", id: "library-word-in-progress", label: "Daily Word in your library, today in progress", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ week: "live" });
        c.go("word", { page: "record" });
      } },
      { group: "Library", id: "library-word-streak-broken", label: "Daily Word in your library, streak broken (yesterday failed)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ broken: true });
        c.go("word", { page: "record" });
      } },
      { group: "Library", id: "library-mystery-never-played", label: "Daily Mystery in your library, free account, never played", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.setReview({ never: "mystery", today: "none" });
        c.go("mystery", { page: "record" });
      } },
      { group: "Library", id: "library-delve-free-in-progress", aliases: ["pur-first-in-progress"], label: "Delve in your library, free account, first run in progress", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.setReview({ week: "live" });
        c.go("delve", { page: "record" });
      } },
      { group: "Library", id: "library-list-free-in-progress", label: "Library list, free account, Delve’s first run in progress", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.setReview({ week: "live" });
        c.go("library");
      } },
      { group: "Library", id: "library-word-free", aliases: ["fp-word-library-free"], label: "Daily Word in your library, free account", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("word", { page: "record" });
      } },
      { group: "Library", id: "library-groups", label: "Daily Groups in your library, with the Pass", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("groups", { page: "record" });
      } },
      { group: "Library", id: "library-groups-in-progress", label: "Daily Groups in your library, today in progress", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ week: "live" });
        c.go("groups", { page: "record" });
      } },
      // The Pass upsell. Its review store (app/gs-pass-store.jsx) resets before every state.
      { group: "Pass upsell", id: "pur-new-account", label: "1. Library, free account, nothing played", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.setUser({ fresh: true });
        c.go("library");
      } },
      { group: "Pass upsell", id: "pur-new-for-you", label: "2. Library, New for you full", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("library");
        gsPassSet({ newEds: "most" });
      } },
      { group: "Pass upsell", id: "pur-first-done", label: "4. Delve, free first run done", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("delve", { page: "record" });
      } },
      { group: "Library", id: "library-casebook-free", aliases: ["library-casebook-no-pass", "fp-casebook-library-free"], label: "Casebook in your library, free account (Pass only)", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("casebook", { page: "record" });
      } },
      { group: "Pass upsell", id: "pur-barrow-done", label: "5. The Barrow, free chapter 1 done", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("barrow", { page: "record" });
        gsPassSet({ bwDone: true });
      } },
      { group: "Pass upsell", id: "pur-word-done", label: "6. Daily Word, today’s word done", stage: (c) => {
        gsPassSet({ freeNew: false });
        c.setView("free");
        c.setConnected(true);
        c.go("word", { page: "record" });
      } },
      { group: "Pass upsell", id: "pur-pass-ended", aliases: ["library-casebook-pass-ended", "fp-casebook-library-lapsed"], label: "7. Casebook, Pass ended", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.setSub({ hadPass: true });
        c.go("casebook", { page: "record" });
      } },
      { group: "Pass upsell", id: "pur-discover-free", aliases: ["free-plan"], label: "9. Discover, free account", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("games");
      } },
      { group: "Pass upsell", id: "pur-pass-ended-every", label: "Pass ended: every case", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.setSub({ hadPass: true });
        c.go("library");
        gsPassSet({ lapsed: "every" });
      } },
      { group: "Library", id: "library-groups-free", label: "Daily Groups in your library, free account", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("groups", { page: "record" });
      } },
      { group: "Library", id: "library-mystery", label: "Daily Mystery in your library, with the Pass", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("mystery", { page: "record" });
      } },
      { group: "Library", id: "library-mystery-in-progress", label: "Daily Mystery in your library, today in progress", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ week: "live" });
        c.go("mystery", { page: "record" });
      } },
      { group: "Library", id: "library-mystery-free", label: "Daily Mystery in your library, free account", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("mystery", { page: "record" });
      } },
      { group: "Library", id: "library-escape", label: "Escape in your library, with the Pass", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("escape", { page: "record" });
      } },
      { group: "Library", id: "library-escape-in-progress", label: "Escape in your library, this week in progress", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ week: "live" });
        c.go("escape", { page: "record" });
      } },
      { group: "Library", id: "library-escape-on-par", label: "Escape in your library, out on par", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ escape: "par" });
        c.go("escape", { page: "record" });
      } },
      { group: "Library", id: "library-escape-over", label: "Escape in your library, over par", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ escape: "over" });
        c.go("escape", { page: "record" });
      } },
      { group: "Library", id: "library-escape-hard", label: "Escape in your library, the hard play", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ ed: "hard" });
        c.go("escape", { page: "record" });
      } },
      { group: "Library", id: "library-escape-free", aliases: ["fp-escape-library-free"], label: "Escape in your library, free account", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("escape", { page: "record" });
      } },
      { group: "Library", id: "library-hunter", label: "36,000 Summers Ago in your library, with the Pass", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("hunter", { page: "record" });
      } },
      { group: "Library", id: "library-casebook-editions", label: "Casebook: every case (the editions list)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("casebook", { page: "record", list: true });
      } },
      { group: "Library", id: "library-delve-no-pass", aliases: ["fp-delve-library-free"], label: "Delve in your library, no Pass", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("delve", { page: "record" });
      } },
      { group: "Library", id: "library-delve-pass-ended", aliases: ["fp-delve-library-lapsed"], label: "Delve in your library, Pass ended", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.setSub({ hadPass: true });
        c.go("delve", { page: "record" });
      } },
      { group: "Library", id: "library-hunter-pass-ended", aliases: ["fp-hunter-library-lapsed"], label: "36,000 Summers Ago in your library, Pass ended", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.setSub({ hadPass: true });
        c.go("hunter", { page: "record" });
      } },
      { group: "Library", id: "history-in-progress", label: "History, today and this week in progress", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ week: "live" });
        c.go("history");
      } },
      { group: "Plans", id: "free-not-played-today", label: "Free account, nothing played today or this week", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.setReview({ today: "none" });
        c.go("word", { page: "record" });
      } },
      { group: "Plans", id: "not-connected", label: "Signed in, AI not connected (Play opens the play pop-up, with How to connect)", stage: (c) => {
        c.setView("free");
        c.go("groups");
      } },
      { group: "Plans", id: "free-puzzle-result", label: "Free account: a puzzle result", stage: (c) => {
        gsPassSet({ freeNew: false });
        c.setView("free");
        c.setConnected(true);
        c.go("session", { id: "word-today" });
      } },
      { group: "Plans", id: "free-history", label: "Free account: History, free games only", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("history");
      } },
      { group: "Plans", id: "lapsed-history", label: "Pass ended: History keeps the Pass-game plays", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.setSub({ hadPass: true });
        c.go("history");
      } },
      { group: "Sign in", id: "provider-sign-in-fails", label: "Google or Apple sign-in fails", stage: (c) => {
        c.setReview({ providerFail: true });
        c.go("signin");
      } },
      { group: "Sign in", id: "sign-in-new-device", label: "Sign in: verify this device", stage: (c) => c.go("verify", { ctx: "device", email: "you@example.com" }) },
      { group: "Sign in", id: "sign-in-new-device-provider", label: "Sign in with Google on a new device: verify this device", stage: (c) => {
        c.setReview({ device: "new" });
        c.go("verify", { ctx: "device", provider: "google", email: "you@example.com" });
      } },
      { group: "Sign in", id: "code-expired", label: "One-time code: expired", stage: (c) => c.go("verify", { ctx: "device", email: "you@example.com", preset: "expired" }) },
      { group: "Sign in", id: "code-wrong", label: "One-time code: wrong", stage: (c) => c.go("verify", { ctx: "device", email: "you@example.com", preset: "wrong" }) },
      { group: "Account", id: "account-email", aliases: ["pass-card-none"], label: "Account, email account", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("account");
      } },
      { group: "Account", id: "account-provider", label: "Account, provider account (Google)", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.setProvider("google");
        c.go("account");
      } },
      { group: "Account", id: "delete-account-confirm", label: "Delete account: confirm", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("account", { stage: "delete" });
      } },
      { group: "Account", id: "delete-account-code-provider", label: "Delete account, Google account: the code step", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.setProvider("google");
        c.go("account", { stage: "delete-code" });
      } },
      { group: "Account", id: "change-email-code", label: "Change email: code step", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("account", { stage: "email-code" });
      } },
      { group: "Username", id: "username-new-account", label: "Your username, after a Google sign-up (no account yet)", stage: (c) => c.go("username", { next: "connect", provider: "google" }) },
      { group: "Username", id: "username-taken", label: "Your username, taken", stage: (c) => c.go("username", { next: "connect", provider: "google", preset: "taken" }) },
      { group: "Username", id: "account-username-wait", label: "Account, username in the 30-day wait", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.setUser({ locked: true });
        c.go("account");
      } },
      { group: "Pass card", id: "pass-card-monthly", label: "Active, monthly", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("account");
      } },
      { group: "Pass card", id: "pass-card-yearly", label: "Active, yearly", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setSub({ plan: "yearly" });
        c.go("account");
      } },
      { group: "Pass card", id: "pass-card-pending-switch", label: "Pending switch to yearly", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setSub({ pending: "yearly" });
        c.go("account");
      } },
      { group: "Pass card", id: "pass-card-failed-pending-switch", label: "Payment failed, with a switch to yearly pending", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setSub({ status: "failed", pending: "yearly" });
        c.go("account");
      } },
      { group: "Pass card", id: "pass-card-payment-failed", label: "Payment failed", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setSub({ status: "failed" });
        c.go("account");
      } },
      { group: "Pass card", id: "pass-card-ending", label: "Ending", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setSub({ status: "ending" });
        c.go("account");
      } },
      { group: "Pass card", id: "pass-card-lapsed", label: "Lapsed", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.setSub({ hadPass: true });
        c.go("account");
      } },
      { group: "Billing", id: "pass-page-subscribed-before", label: "Pass page, had the Pass before", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.setSub({ hadPass: true });
        c.go("pass");
      } },
      { group: "Billing", id: "subscribe", label: "Subscribe page", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.setSub({ hadPass: true });
        c.go("subscribe");
      } },
      { group: "Billing", id: "checkout", label: "Payment provider checkout", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("checkout");
      } },
      { group: "Billing", id: "update-card", label: "Update-card page", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setSub({ status: "failed" });
        c.go("update-card");
      } },
      { group: "Billing", id: "switch-sheet-yearly", label: "Switch sheet: to yearly", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("account", { sheet: "switch" });
      } },
      { group: "Billing", id: "switch-sheet-monthly", label: "Switch sheet: to monthly", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setSub({ plan: "yearly" });
        c.go("account", { sheet: "switch" });
      } },
      { group: "Billing", id: "cancel-sheet", label: "Cancel sheet", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("account", { sheet: "cancel" });
      } },
      { group: "Billing", id: "pass-cancel-sheet-payment-failed", label: "Cancel sheet: payment failed (ends today)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setSub({ status: "failed" });
        c.go("account", { sheet: "cancel" });
      } },
      { group: "Billing", id: "pass-cancel-fails", label: "Cancel sheet, the cancel fails", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ passFail: true });
        c.go("account", { sheet: "cancel" });
      } },
      { group: "Billing", id: "pass-resume-fails", label: "Ending card, Resume fails", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setSub({ status: "ending" });
        c.setReview({ passFail: true });
        c.go("account");
      } },
      { group: "Billing", id: "pass-switch-fails", label: "Switch sheet, the switch fails", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ passFail: true });
        c.go("account", { sheet: "switch" });
      } },
      { group: "Billing", id: "pass-keep-fails", label: "Pending switch, Keep monthly fails", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setSub({ pending: "yearly" });
        c.setReview({ passFail: true });
        c.go("account");
      } },
      { group: "Free and Pass", id: "fp-pass-page-signed-out", label: "Pass page, signed out", stage: (c) => {
        c.setView("out");
        c.setConnected(true);
        c.go("pass");
      } },
      { group: "Site", id: "not-found", label: "Not found", stage: (c) => c.go("nowhere") },
      { group: "Site", id: "not-found-signed-in", label: "Not found, signed in (Go home opens Discover)", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("nowhere");
      } },
      { group: "Site", id: "loading-full", label: "Loading, full screen (held)", stage: (c) => c.go("loading") },
      { group: "Site", id: "loading-in-place", label: "Loading, in place on Discover (held)", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("games", { load: "hold" });
      } },
      { group: "Site", id: "load-failed", label: "Load failed, in place on Discover", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("games", { load: "failed" });
      } },
      { group: "Site", id: "loading-page-discover", label: "Loading, page: Discover (held)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("games", { hold: "page" });
      } },
      { group: "Site", id: "loading-page-library", label: "Loading, page: Library (held)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("library", { hold: "page" });
      } },
      { group: "Site", id: "loading-page-history", label: "Loading, page: History (held)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("history", { hold: "page" });
      } },
      { group: "Site", id: "loading-page-history-game", label: "Loading, page: History filtered to a game (held)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("history", { game: "casebook", from: "casebook", hold: "page" });
      } },
      { group: "Site", id: "loading-page-product", label: "Loading, page: a product page (held)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("casebook", { hold: "page" });
      } },
      { group: "Site", id: "loading-page-product-signed-out", label: "Loading, page: a product page, signed out (held)", stage: (c) => {
        c.go("word", { hold: "page" });
      } },
      { group: "Site", id: "loading-page-library-game", label: "Loading, page: a library game page (held)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("casebook", { page: "record", hold: "page" });
      } },
      { group: "Site", id: "loading-page-library-case", label: "Loading, page: a case inside a library game (held)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("casebook", { page: "record", sid: CB_ID, hold: "page" });
      } },
      { group: "Site", id: "loading-page-session", label: "Loading, page: a session (held)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("session", { id: "delve", hold: "page" });
      } },
      { group: "Site", id: "loading-page-pass", label: "Loading, page: the Pass (held)", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("pass", { hold: "page" });
      } },
      { group: "Site", id: "loading-page-account", label: "Loading, page: Account (held)", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("account", { hold: "page" });
      } },
      { group: "Site", id: "loading-part-discover-games", label: "Loading, part: Discover, All games (held)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("games", { hold: "part" });
      } },
      { group: "Site", id: "loading-part-library-list", label: "Loading, part: Library list (held)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("library", { hold: "part" });
      } },
      { group: "Site", id: "loading-part-history-results", label: "Loading, part: History results (held)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("history", { hold: "part" });
      } },
      { group: "Daily and weekly filters", id: "filter-empty-discover", label: "Discover, All games: Adventure and Daily, nothing matches", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("games", { kind: "ADVENTURE", rhythm: "daily" });
      } },
      { group: "Daily and weekly filters", id: "filter-empty-library", label: "Library: Genre Adventure, Schedule Daily, nothing matches", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("library", { kind: "ADVENTURE", rhythm: "daily" });
      } },
      { group: "Daily and weekly filters", id: "filter-empty-history", label: "History: Show 36,000 Summers Ago, Schedule Daily, nothing matches", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("history", { game: "hunter", rhythm: "daily" });
      } },
      { group: "Site", id: "cant-connect", label: "Can’t connect, full screen", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("offline");
      } },
      // Every edition can be played; a finished one of a game played once says so.
      { group: "Library", id: "library-word-editions", label: "Daily Word: every word (the editions list)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("word", { page: "record", list: true });
      } },
      { group: "Library", id: "edition-word-earlier", label: "Daily Word: an earlier word not played, its prompt", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("word", { page: "record", list: true, pgeOpen: PZ.word.all.find((x) => x.i > 0 && !x.played).id });
      } },
      { group: "Library", id: "edition-word-done", label: "Daily Word: an earlier word played (played once, no prompt)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("word", { page: "record", list: true, pgeOpen: PZ.word.all[2].id });
      } },
      { group: "Library", id: "library-mystery-editions", label: "Daily Mystery: every case (the editions list)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("mystery", { page: "record", list: true });
      } },
      { group: "Library", id: "edition-mystery-earlier", label: "Daily Mystery: an earlier case not played, its prompt", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("mystery", { page: "record", list: true, pgeOpen: PZ.mystery.all.find((x) => x.i > 0 && !x.played).id });
      } },
      { group: "Library", id: "edition-mystery-done", label: "Daily Mystery: an earlier case played (played once, no prompt)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("mystery", { page: "record", list: true, pgeOpen: PZ.mystery.all[2].id });
      } },
      { group: "Library", id: "edition-casebook-done", label: "Casebook: Case 1 played (played once, no prompt)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("casebook", { page: "record", list: true, pgeOpen: CB_ALL[0].id });
      } },
      { group: "Library", id: "edition-barrow-done", label: "The Barrow: chapter 1 finished, its panel (start over, Copy, See in History)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        gsPassSet({ bwDone: true });
        c.go("barrow", { page: "record", list: true, pgeOpen: "bw1" });
      } },
      { group: "Library", id: "edition-barrow-done-free", label: "The Barrow, free account: chapter 1 finished, its panel; chapter 2 needs the Pass", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        gsPassSet({ bwDone: true });
        c.go("barrow", { page: "record", list: true, pgeOpen: "bw1" });
      } },
      { group: "Library", id: "edition-delve-in-progress", label: "Delve: run 1 in progress, its panel", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ week: "live" });
        c.go("delve", { page: "record", list: true, pgeOpen: DV_ALL[0].id });
      } },
      { group: "Library", id: "library-escape-two-in-progress", label: "Escape in your library: two rooms in progress (this week’s and an earlier one)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ week: "live", several: true });
        c.go("escape", { page: "record" });
      } },
      { group: "Library", id: "editions-escape-two-in-progress", label: "Escape: every room, two in progress, no warning", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ week: "live", several: true });
        c.go("escape", { page: "record", list: true });
      } },
      { group: "Library", id: "library-delve-two-in-progress", label: "Delve in your library: two runs in progress (this week’s and an earlier one)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ week: "live", several: true });
        c.go("delve", { page: "record" });
      } },
      { group: "Library", id: "editions-delve-two-in-progress", label: "Delve: every run, two in progress, no warning", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ week: "live", several: true });
        c.go("delve", { page: "record", list: true });
      } },
      { group: "Library", id: "editions-word-free", label: "Daily Word, free account: every word (the editions list)", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("word", { page: "record", list: true });
      } },
      // A game added with sample editions (app/gs-more-games.jsx) and 36,000 Summers Ago: the library game page and the editions list every game has.
      { group: "Library", id: "library-cipher", label: "Daily Cipher in your library (sample editions)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("cipher", { page: "record" });
      } },
      { group: "Library", id: "library-cipher-free", label: "Daily Cipher in your library, free account: needs the Pass", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.go("cipher", { page: "record" });
      } },
      { group: "Library", id: "editions-cipher", label: "Daily Cipher: every cipher (sample editions, numbered)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("cipher", { page: "record", list: true });
      } },
      { group: "Library", id: "editions-winter", label: "The Long Winter: every chapter (sample editions, named, no dates)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("winter", { page: "record", list: true });
      } },
      { group: "Library", id: "editions-hunter", label: "36,000 Summers Ago: every summer (sample editions)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("hunter", { page: "record", list: true });
      } },
      { group: "History", id: "session-word-earlier", label: "Session page, an earlier Daily Word played (played once)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("session", { id: PZ.word.all[2].sid });
      } },
      { group: "History", id: "session-mystery-earlier", label: "Session page, an earlier Daily Mystery played (played once)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("session", { id: PZ.mystery.all[2].sid });
      } },
      { group: "History", id: "history-hunter", label: "History, 36,000 Summers Ago (its days)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("history", { game: "hunter", from: "hunter" });
      } },
      { group: "History", id: "history-search-empty", label: "History, a search that matches nothing", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("history", { q: "#9999" });
      } },
      { group: "Pass ended today", id: "pass-ended-today", label: "Account, the Pass ended today", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.setSub({ hadPass: true, endedOn: GS_DAY0.getTime() });
        c.go("account");
      } },
      { group: "Pass ended today", id: "library-hunter-pass-ended-today", label: "36,000 Summers Ago in your library, the Pass ended today", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.setSub({ hadPass: true, endedOn: GS_DAY0.getTime() });
        c.go("hunter", { page: "record" });
      } },
      { group: "Pass ended today", id: "history-pass-ended-today", label: "History, the Pass ended today (keeps every play)", stage: (c) => {
        c.setView("free");
        c.setConnected(true);
        c.setSub({ hadPass: true, endedOn: GS_DAY0.getTime() });
        c.go("history");
      } },
      { group: "New account", id: "new-account-library", label: "Library, a new account (nothing played)", stage: (c) => {
        c.setView("free");
        c.setUser({ username: "NewPlayer", fresh: true, locked: true, since: GS_DAY0.getTime() });
        c.go("library");
      } },
      { group: "New account", id: "new-account-history", label: "History, a new account (empty)", stage: (c) => {
        c.setView("free");
        c.setUser({ username: "NewPlayer", fresh: true, locked: true, since: GS_DAY0.getTime() });
        c.go("history");
      } },
      { group: "New account", id: "new-account-casebook-pass", label: "Casebook in your library, a new account with the Pass", stage: (c) => {
        c.setView("pass");
        c.setUser({ username: "NewPlayer", fresh: true, locked: true, since: GS_DAY0.getTime() });
        c.go("casebook", { page: "record" });
      } },
      { group: "Ended unfinished", id: "session-groups-unfinished", label: "Session page, a Daily Groups day that ended unfinished", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ unfinished: true });
        c.go("session", { id: "groups-unfinished" });
      } },
      { group: "Ended unfinished", id: "session-delve-unfinished", label: "Session page, Delve run 1 in progress (Wren; no Delve week has ended yet)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ week: "live" });
        c.go("session", { id: "delve-live" });
      } },
      { group: "Ended unfinished", id: "history-unfinished", label: "History, with a Daily Groups day that ended unfinished", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.setReview({ unfinished: true });
        c.go("history");
      } },
      { group: "Site", id: "sign-in-return-library", label: "Signed out, opened the Library: Sign in, then the Library", stage: (c) => c.go("signin", { next: { name: "library" } }) },
      { group: "Site", id: "session-unknown", label: "A session address that doesn’t exist (not found)", stage: (c) => {
        c.setView("pass");
        c.setConnected(true);
        c.go("session", { id: "nowhere" });
      } },
      // Where, Chain and Salvage: held in app/gs-where-chain-salvage.jsx.
      ...DP_STATES || [],
      // Directory listing mocks: held in app/directory-listings.jsx (droppable); absent ⇒ none.
      ...DL_STATES || []
    ];
    KIT_STATE_GROUP_NOTES = {
      "Ended unfinished": [
        "Or set Config “Ended unfinished” to A day: the Daily Groups day shows as Not finished in History and on its library game page. Delve has one run so far, this week’s, so no Delve week can have ended unfinished; its state opens run 1 in progress."
      ],
      "Username": [
        "Account, username change open: it is the Account page itself, the Username card shows its field whenever there is no wait. Change it to start the wait.",
        'Taken: in the demo only "taken", in any capitals, is taken. Your own current name never is.'
      ],
      "Sign in": [
        "Provider sign-in fails: tap Continue with Google or Continue with Apple. The line under the buttons clears on the next try.",
        'Google or Apple on a new device: set Config "Device, for Google and Apple sign-in" to New, then sign in with either. A Google or Apple sign-up never meets a code: it goes straight to Your username.',
        "One-time code: 000000 is expired; 111111, or fewer than six digits, is wrong; any other six digits pass.",
        "Provider sheet cancelled (Config): tapping Google or Apple leaves you on step 1 with nothing shown."
      ],
      "Pass card": [
        "Every card state is on the Account page. The Pass page shows a Pass holder “You have the Pass” with Manage in account and the table, and no card, whatever the card’s state."
      ],
      "Billing": [
        "Checkout: the card inputs only format; any input pays. The plan comes from the Pass page (Yearly by default)."
      ]
    };
    window.KIT_STATE_NOTES = KIT_STATE_GROUP_NOTES;
    KIT_STATE_INDEX_NAMES = ["index", "states"];
    KIT_STATE_ID_RULE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    KIT_STATES_ACCEPTED = KIT_STATE_REGISTER.filter((s, i) => {
      for (const id of kitIdsOf(s)) {
        if (typeof id !== "string" || !KIT_STATE_ID_RULE.test(id)) {
          kitRefuseState(id, "an id is lowercase letters, digits and single hyphens");
          return false;
        }
        if (KIT_STATE_INDEX_NAMES.includes(id)) {
          kitRefuseState(id, "that name opens the states index");
          return false;
        }
        if (KIT_STATE_REGISTER.slice(0, i).some((x) => kitIdsOf(x).includes(id)) || (s.aliases || []).includes(s.id)) {
          kitRefuseState(id, "an earlier entry already has it");
          return false;
        }
      }
      return true;
    });
    window.KIT_STATES = KIT_STATES_ACCEPTED.map(({ id, aliases, label, group }) => ({ id, aliases: aliases || [], label, group }));
  }
  const { useState: useStState, useEffect: useStEffect, useMemo: useStMemo, useRef: useStRef } = React$1;
  const StatesRow = ({ state, onGo }) => {
    const [copied, setCopied] = useStState(null);
    const copy = async () => {
      const url = kitStateLink(state.id);
      let ok = false;
      try {
        await navigator.clipboard.writeText(url);
        ok = true;
      } catch (e) {
        try {
          const ta = document.createElement("textarea");
          ta.value = url;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          ok = document.execCommand("copy");
          document.body.removeChild(ta);
        } catch (e2) {
          ok = false;
        }
      }
      setCopied({ ok, url });
    };
    return /* @__PURE__ */ React$1.createElement("div", { className: "kit-states-item" }, /* @__PURE__ */ React$1.createElement("div", { className: "kit-states-row" }, /* @__PURE__ */ React$1.createElement("button", { className: "kit-states-jump", onClick: () => onGo(state.id) }, /* @__PURE__ */ React$1.createElement("span", { className: "kit-states-label" }, state.label), /* @__PURE__ */ React$1.createElement("span", { className: "kit-states-id" }, "?state=", state.id, state.aliases && state.aliases.length ? " · also " + state.aliases.join(", ") : "")), /* @__PURE__ */ React$1.createElement(
      "button",
      {
        className: "kit-states-copy",
        onClick: copy,
        title: "Copy link to this state",
        "aria-label": "Copy link to " + state.label
      },
      /* @__PURE__ */ React$1.createElement(Icon, { name: copied && copied.ok ? "check" : "link", size: 15 })
    )), copied && /* @__PURE__ */ React$1.createElement("div", { className: "kit-states-copied" }, /* @__PURE__ */ React$1.createElement("span", null, copied.ok ? "Copied" : "Copy by hand"), /* @__PURE__ */ React$1.createElement("input", { readOnly: true, value: copied.url, onFocus: (e) => e.target.select() })));
  };
  const StatesGroups = ({ groups, onGo, forceOpen = false }) => {
    const [open, setOpen] = useStState({});
    return /* @__PURE__ */ React$1.createElement("div", { className: "kit-states-groups" }, groups.map((g) => {
      const isOpen = forceOpen || !!open[g.title];
      const bodyId = "kit-states-g-" + g.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return /* @__PURE__ */ React$1.createElement("div", { className: "kit-states-group", key: g.title }, /* @__PURE__ */ React$1.createElement(
        "button",
        {
          type: "button",
          className: "kit-states-group-head",
          "aria-expanded": isOpen,
          "aria-controls": bodyId,
          onClick: () => setOpen((p) => ({ ...p, [g.title]: !isOpen })),
          disabled: forceOpen
        },
        /* @__PURE__ */ React$1.createElement("span", { className: "kit-config-group-title" }, g.title),
        /* @__PURE__ */ React$1.createElement("span", { className: "kit-states-group-count" }, g.items.length),
        /* @__PURE__ */ React$1.createElement("span", { className: "kit-states-group-chev", "aria-hidden": "true", style: { transform: isOpen ? "rotate(180deg)" : "none" } }, /* @__PURE__ */ React$1.createElement(Icon, { name: "chevron-down", size: 16 }))
      ), isOpen && /* @__PURE__ */ React$1.createElement("div", { id: bodyId }, /* @__PURE__ */ React$1.createElement("div", { className: "kit-states-group-body" }, g.items.map((s) => /* @__PURE__ */ React$1.createElement(StatesRow, { key: s.id, state: s, onGo }))), g.notes && g.notes.length > 0 && /* @__PURE__ */ React$1.createElement("div", { className: "kit-states-notes" }, /* @__PURE__ */ React$1.createElement("div", { className: "kit-states-notes-title" }, "Notes"), /* @__PURE__ */ React$1.createElement("ul", null, g.notes.map((n, i) => /* @__PURE__ */ React$1.createElement("li", { key: i }, n))))));
    }));
  };
  const kitFilterGroups = (groups, q) => {
    const t = q.trim().toLowerCase();
    if (!t) return groups;
    return groups.map((g) => ({ title: g.title, notes: g.notes, items: g.items.filter((s) => (s.label + " " + s.id + " " + (s.aliases || []).join(" ") + " " + g.title).toLowerCase().includes(t)) })).filter((g) => g.items.length > 0);
  };
  const StatesPalette = ({ groups, onGo, onOpenIndex, onClose }) => {
    const [q, setQ] = useStState("");
    const [shown, setShown] = useStState(false);
    const fieldRef = useStRef(null);
    const filtered = useStMemo(() => kitFilterGroups(groups, q), [groups, q]);
    useStEffect(() => {
      let r2;
      const r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => setShown(true));
      });
      return () => {
        cancelAnimationFrame(r1);
        cancelAnimationFrame(r2);
      };
    }, []);
    useStEffect(() => {
      if (fieldRef.current) fieldRef.current.focus();
    }, []);
    useStEffect(() => {
      const onKey = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);
    useStEffect(kitLockScroll, []);
    return /* @__PURE__ */ React$1.createElement(
      "div",
      {
        className: "kit-config-scrim",
        style: { opacity: shown ? 1 : 0 },
        onClick: (e) => {
          if (e.target === e.currentTarget) onClose();
        }
      },
      /* @__PURE__ */ React$1.createElement(
        "div",
        {
          role: "dialog",
          "aria-modal": "true",
          "aria-label": "States",
          className: "kit-config-modal",
          "data-shown": shown ? "1" : void 0,
          style: { opacity: shown ? 1 : 0, transform: shown ? "scale(1)" : "scale(0.97)" }
        },
        /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-head" }, /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-title" }, "States"), /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-subtitle" }, "Every staged state of the app. Jump to one, or copy its link.")), /* @__PURE__ */ React$1.createElement("button", { onClick: onClose, "aria-label": "Close", className: "kit-config-close" }, /* @__PURE__ */ React$1.createElement(Icon, { name: "x", size: 18 }))),
        /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-body" }, /* @__PURE__ */ React$1.createElement(
          "input",
          {
            ref: fieldRef,
            className: "kit-states-search",
            type: "search",
            value: q,
            onChange: (e) => setQ(e.target.value),
            placeholder: "Search states",
            "aria-label": "Search states"
          }
        ), filtered.length === 0 ? /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-hint", style: { margin: "14px 0 0" } }, "Nothing matches “", q, "”.") : /* @__PURE__ */ React$1.createElement(StatesGroups, { groups: filtered, onGo, forceOpen: !!q.trim() }), /* @__PURE__ */ React$1.createElement("div", { className: "kit-states-foot" }, /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-hint", style: { margin: 0 } }, "A link opens the app at that state. The names live in the register (app/states.jsx); a name that is not in it lands on the index."), /* @__PURE__ */ React$1.createElement("button", { className: "kit-config-btn-secondary", onClick: onOpenIndex }, "Open the states index")))
      )
    );
  };
  const StatesIndex = ({ reason, groups, onGo, onDismiss }) => {
    const [q, setQ] = useStState("");
    const filtered = useStMemo(() => kitFilterGroups(groups, q), [groups, q]);
    const unresolved = reason && reason.kind === "unresolved" ? reason.name : null;
    return /* @__PURE__ */ React$1.createElement("div", { className: "kit-index" }, /* @__PURE__ */ React$1.createElement("div", { className: "kit-index-inner" }, /* @__PURE__ */ React$1.createElement("div", { className: "kit-index-eyebrow" }, "Prototype"), /* @__PURE__ */ React$1.createElement("h1", { className: "kit-index-title" }, "States"), /* @__PURE__ */ React$1.createElement("p", { className: "kit-index-lede" }, "Every state this prototype can be opened at. Each one has an address, so a ticket can point straight at it: add ", /* @__PURE__ */ React$1.createElement("code", null, "?state=<name>"), " to this page."), unresolved && /* @__PURE__ */ React$1.createElement("p", { className: "kit-index-note" }, "Nothing is registered under ", /* @__PURE__ */ React$1.createElement("code", null, unresolved), ". It has been renamed or removed since that link was written — the current names are below."), /* @__PURE__ */ React$1.createElement("div", { className: "kit-index-bar" }, /* @__PURE__ */ React$1.createElement(
      "input",
      {
        className: "kit-states-search",
        type: "search",
        value: q,
        onChange: (e) => setQ(e.target.value),
        placeholder: "Search states",
        "aria-label": "Search states"
      }
    ), /* @__PURE__ */ React$1.createElement("button", { className: "kit-config-btn-secondary", onClick: onDismiss }, "Continue to the app")), filtered.length === 0 ? /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-hint" }, "Nothing matches “", q, "”.") : /* @__PURE__ */ React$1.createElement(StatesGroups, { groups: filtered, onGo, forceOpen: !!q.trim() })));
  };
  const KIT_QA = [
    {
      key: "loading-on-action",
      title: "Loading on action",
      note: "On each, press the action: its control shows the spinner for about a second and ignores a second press (and Enter). Sign out is in the account menu. Check at phone and desktop width.",
      steps: ["sign-up", "sign-in", "verify-email", "sign-in-new-device", "reset-password", "username-new-account", "account-email", "change-email-code", "delete-account-confirm", "pass-card-pending-switch", "pass-card-ending", "switch-sheet-yearly", "cancel-sheet", "checkout", "update-card"]
    },
    {
      key: "username-1",
      title: "Usernames",
      note: "By hand: sign up by email (first and last name and username on the form), verify, then Connect your AI. By Google or Apple: no code, straight to Your username, then Connect your AI; from Get the Pass, checkout comes after the username. On Account, rename and watch the menu, avatar and a share card. Config has the Username row.",
      steps: ["sign-up", "username-new-account", "username-taken", "account-email", "account-provider", "account-username-wait", "session-delve"]
    },
    {
      key: "circlists-match-1",
      title: "Circlists match 1: sign-in, menu, Account",
      note: "Also check by hand: Google, black Apple, email order; email sign-in lands on Verify this device; the user menu (signed in, wide).",
      steps: ["sign-in", "sign-up", "sign-in-new-device", "code-expired", "code-wrong", "reset-password", "provider-sign-in-fails", "account-email", "account-provider", "change-email-code", "delete-account-confirm"]
    },
    {
      key: "free-tier-1",
      title: "Free tier 1: everything you play is yours",
      note: "On each session page, press Share: the text as pasted, one Copy button. Check at 390 and 320px.",
      steps: ["free-puzzle-result", "free-history", "lapsed-history", "word-free", "pass-card-none", "pass-card-lapsed", "cancel-sheet", "pass-free", "delve-free", "session-puzzle", "session-delve", "session-casebook"]
    },
    {
      key: "circlists-match-2",
      title: "Circlists match 2: the Pass",
      steps: ["pass-page-never-subscribed", "pass-page-subscribed-before", "checkout", "update-card", "pass-card-none", "pass-card-monthly", "pass-card-yearly", "pass-card-pending-switch", "pass-card-payment-failed", "pass-card-ending", "pass-card-lapsed", "switch-sheet-yearly", "switch-sheet-monthly", "cancel-sheet"]
    },
    {
      key: "circlists-match-3",
      title: "Circlists match 3: footer, legal, not-found, loading",
      note: "Footer and legal pages: open Home, then Terms, Privacy and Refunds from the footer. Check the footer at 720, 420 and 300px.",
      steps: ["home", "not-found", "loading-full", "loading-in-place", "load-failed", "cant-connect"]
    },
    {
      key: "first-release-games",
      title: "First-release games",
      note: 'Each page: facts band, More games. Every "—" is a gap in the record.',
      steps: ["groups-pass", "groups-free", "casebook-pass", "casebook-free", "delve-pass", "hunter-pass", "hunter-free", "session-casebook", "session-hunter", "history", "free-history", "games", "games-free", "games-signed-out"]
    }
  ];
  KIT_QA.unshift({
    key: "daily-puzzles-1213",
    title: "Where, Chain and Salvage (1213)",
    note: "Each game, at phone and desktop width: product page signed out, free (Get the Pass) and with the Pass; library page done, in progress and free (Needs the Pass); the editions list; a session and its Share text (no country, word or square named). Point at, Tab to and press each card, tile and Library or History row: the art moves and holds; with reduced motion it stays still. Daily Pin appears nowhere.",
    steps: [
      "where-signed-out",
      "where-free",
      "where-pass",
      "library-where",
      "library-where-in-progress",
      "library-where-free",
      "library-where-editions",
      "session-where",
      "chain-signed-out",
      "chain-free",
      "chain-pass",
      "library-chain",
      "library-chain-in-progress",
      "library-chain-free",
      "library-chain-editions",
      "session-chain",
      "salvage-signed-out",
      "salvage-free",
      "salvage-pass",
      "library-salvage",
      "library-salvage-in-progress",
      "library-salvage-free",
      "library-salvage-editions",
      "session-salvage",
      "games",
      "games-free",
      "library",
      "history"
    ]
  });
  KIT_QA.unshift({
    key: "iffy-decisions",
    title: "Decisions, 11 October",
    note: 'Delve product page: signed out and free read "Play the first run", Pass reads "Play"; signed in drops "The first run is free with an account." Casebook is Pass-only: its page reads Get the Pass, as Daily Groups’. A played session page names its edition above the result. Sign up by Google or Apple: no code, straight to Your username (Config Device = New still gives Verify this device on sign-in). Share from a session page and a library game page: the same pop-up, a bottom sheet on a phone.',
    steps: ["sign-up", "username-new-account", "verify-email", "sign-in-new-device-provider", "reset-password-code", "session-delve", "history", "library-casebook", "library-delve"]
  });
  KIT_QA.unshift({
    key: "fixes",
    title: "Fixes, 10 October",
    note: "From History, open a row and press its back link: it returns to History, as left. Pass card: cancel, resume, switch and undo each move focus to the control that undoes them and are announced. Tab stays inside every open pop-up.",
    steps: ["history", "session-delve-past", "library-delve", "library-casebook", "library-mystery-never-played", "sign-up", "verify-email", "not-found", "pass-card-monthly", "pass-card-failed-pending-switch", "switch-sheet-yearly", "delete-account-confirm", "cancel-sheet", "session-hunter", "library-delve-no-pass", "library", "games-free", "home", "load-failed"]
  });
  KIT_QA.unshift({
    key: "free-and-pass",
    title: "Free and the Pass (proposed, not ratified)",
    note: "Walk each step. Free player: the dailies and Escape in full; Delve one first edition, no streak; Casebook and 36,000 Summers Ago closed. Pass ended: earned achievements shown as earned; the streak and the rest frozen. The Pass page’s “What you get” table shows what free and the Pass each give.",
    steps: [
      "fp-word-library-free",
      "fp-escape-library-free",
      "fp-casebook-library-free",
      "fp-delve-library-free",
      "fp-casebook-library-lapsed",
      "fp-delve-library-lapsed",
      "fp-hunter-library-lapsed",
      "fp-product-casebook-free",
      "fp-product-hunter-free",
      "games-free",
      "free-history",
      "lapsed-history",
      "pass-card-none",
      "pass-card-lapsed",
      "pass-page-never-subscribed",
      "pass-page-subscribed-before",
      "fp-pass-page-signed-out",
      "checkout",
      "cancel-sheet",
      "pass-card-ending"
    ]
  });
  KIT_QA.unshift({
    key: "loading-pages-and-parts",
    title: "Loading on pages and parts",
    note: "Held states show the wait while it holds; the top bar and footer stay. By hand: click between Discover, Library, History, a game, a session, the Pass, Account (each loads about 1.2 s, Back does not repeat it). Change search, a chip, Genre, Order, Plays, Show or a page number: only that part loads. On Load failed, Try again shows the spinner on the button and ignores a second press. On a library game page, All… opens History loading, then filtered.",
    steps: ["loading-page-discover", "loading-page-library", "loading-page-history", "loading-page-history-game", "loading-page-product", "loading-page-product-signed-out", "loading-page-library-game", "loading-page-library-case", "loading-page-session", "loading-page-pass", "loading-page-account", "loading-part-discover-games", "loading-part-library-list", "loading-part-history-results", "loading-in-place", "load-failed"]
  });
  KIT_QA.unshift({
    key: "discover-and-library",
    title: "Discover and Library",
    note: "Discover: picks, Free to play, Pass band (gone with the Pass), All games with search and chips, Free last, no Free tag on tiles. Library: rows with covers, Genre and Order. Top bar: Discover, Library, History. Check hover and 320px.",
    steps: ["games-signed-out", "games-free", "games", "library-free", "library", "loading-in-place"]
  });
  KIT_QA.unshift({
    key: "split-daily-puzzles",
    title: "Daily Puzzles split into separate games",
    note: 'No "Daily Puzzles" anywhere a player sees. Each daily and Escape: product page, library game page, a session, Share. Home, Games, Library menu and History at 320px.',
    steps: [
      "home",
      "games-signed-out",
      "games-free",
      "games",
      "word-free",
      "word-signed-out",
      "groups-pass",
      "mystery-pass",
      "escape-free",
      "escape-pass",
      "library-word",
      "library-groups-in-progress",
      "library-mystery-in-progress",
      "library-escape",
      "library-escape-in-progress",
      "library-groups-free",
      "session-puzzle",
      "session-groups",
      "session-escape",
      "history",
      "free-history",
      "pass-free",
      "not-connected"
    ]
  });
  KIT_QA.unshift({
    key: "rhythm-filters",
    title: "Daily and weekly filters (not ratified)",
    note: "Each held state shows its surface’s empty list. By hand: Daily shows only Daily Word, Groups and Mystery (or their plays); Weekly only Escape and Delve; Casebook, the Barrow and 36,000 Summers Ago only under All games. Combine with search, genre, Free, Order, Plays, Show; only the list part loads. Check at 320px.",
    steps: ["games", "filter-empty-discover", "library", "filter-empty-library", "history", "filter-empty-history"]
  });
  KIT_QA.unshift({
    key: "walk-sweep",
    title: "Walk sweep 2026-10-10 (not ratified)",
    note: "Walk each new state. By hand: sign up by email (username on the form); sign up with Google (code, then Your username, then Connect your AI); from the Pass page, the username comes before checkout and Cancel and return keeps the plan. Sign out, then Back: no Library, History or Account. After signing in, Back never reopens sign-up. A Pass holder pressing Get the Pass lands on Account. From a play dialog on a phone, How to connect then Back reopens the dialog. Config: Pass changes Fail; Device New.",
    steps: [
      "sign-up",
      "username-new-account",
      "username-taken",
      "sign-in-new-device-provider",
      "account-provider",
      "delete-account-code-provider",
      "delete-account-confirm",
      "pass-card-none",
      "pass-page-never-subscribed",
      "checkout",
      "pass-cancel-sheet-payment-failed",
      "pass-cancel-fails",
      "pass-resume-fails",
      "pass-switch-fails",
      "pass-keep-fails",
      "word-free",
      "escape-free",
      "hunter-free",
      "groups-pass",
      "library-word",
      "library-word-in-progress",
      "library-word-streak-broken",
      "library-mystery-never-played",
      "library-casebook-free",
      "library-delve-free-in-progress",
      "library-list-free-in-progress",
      "games-free",
      "library-casebook-pass-ended",
      "library-delve-pass-ended",
      "library-hunter-pass-ended",
      "free-puzzle-result",
      "session-delve-past",
      "session-hunter",
      "session-casebook",
      "history",
      "home",
      "not-found",
      "not-found-signed-in"
    ]
  });
  KIT_QA.unshift({
    key: "every-edition-playable",
    title: "Every edition can be played",
    note: 'Each daily puzzle has "Every …" beside its name and the same list. An earlier word not played shows its prompt. A played word or case shows its result, says it was played once, and has no prompt or Copy. Check at 390 and 1280px.',
    steps: ["library-word-editions", "edition-word-earlier", "edition-word-done", "edition-casebook-done", "session-word-earlier", "session-casebook", "history"]
  });
  KIT_QA.unshift({
    key: "failed-on-strip",
    title: "Failed on the streak strip",
    note: "A failed day: the Not played outline with a cross; legend Completed / Failed / Not played. 36,000 Summers Ago keeps Played / Not played.",
    steps: ["library-word", "library-word-streak-broken", "library-word-in-progress", "library-mystery-never-played", "library-casebook", "library-delve", "library-casebook-pass-ended", "library-delve-pass-ended"]
  });
  KIT_QA.unshift({
    key: "phone-snags-second-pass",
    title: "Phone snags, second pass",
    note: "On a phone: product pages have no edition card and show the cover small beside the title; a session page shows its buttons without scrolling; More games cards move on press and their art is 2:1; press and hold the home hero, a card, a button: nothing selects. The phone top bar shows Menu and a person icon. Account: Pass, Notifications, then Username. Check at 320, 390 and 1280px.",
    steps: ["home", "word-signed-out", "word-free", "casebook-pass", "session-puzzle", "session-delve", "account-email"]
  });
  KIT_QA.unshift({
    key: "final-audit-snags",
    title: "Final audit snags",
    note: "By hand: from Cancel sheet: payment failed, press Cancel subscription, then Library, 36,000 Summers Ago, then History: the Account card, the library page and History all say 6 October, the last day is 5 October, and History keeps every Pass-game play. Sign up by email (first and last name asked) as a new account: Library never played, History empty, Username changeable on 5 November. On Account, type the current username and press Update: it answers. Signed out (demo bar) on Library, History, Account or a session: Sign in, then that page. Notifications on: Games has Done; off: no count. Type a 70-letter word in each search; type 36000. Check at 390 and 1280px.",
    steps: [
      "pass-cancel-sheet-payment-failed",
      "pass-ended-today",
      "library-hunter-pass-ended-today",
      "history-pass-ended-today",
      "library-hunter-pass-ended",
      "new-account-library",
      "new-account-history",
      "new-account-casebook-pass",
      "sign-up",
      "account-email",
      "account-username-wait",
      "session-groups-unfinished",
      "session-delve-unfinished",
      "history-unfinished",
      "sign-in-return-library",
      "session-unknown",
      "library",
      "home",
      "word-signed-out",
      "pass-page-never-subscribed",
      "pass-page-subscribed-before"
    ]
  });
  KIT_QA.unshift({
    key: "directory-listings",
    title: "Directory listings",
    note: "The copy on both pages awaits the owner’s review. Check each page at desktop and phone width (Config, Viewport).",
    steps: ["directory-listing-claude", "directory-listing-chatgpt"]
  });
  KIT_QA.unshift({
    key: "pass-ended-every-case",
    title: "Pass ended: every case",
    note: "Library as a player whose Pass ended. Escape: free first-room card with Play. Casebook: the never-had Needs the Pass card (its one case is after the Pass ended). The Barrow: “You stopped here.”, CHAPTER 2. Delve: free first-run card, done. Daily Groups: “You stopped here.”, no Play. No Library row for Escape, the Barrow or Delve reads “Pass only”.",
    steps: ["pur-pass-ended-every"]
  });
  KIT_QA.unshift({
    key: "elegance-fixes",
    title: "Elegance fixes, 17 October (not signed off)",
    note: "Check each at phone and desktop width. Free first edition in progress: head card, Your runs, Every run, the session page and the Library row all say In progress with the play date; Config This week finished ends it everywhere. Pass-ended and never-had Game pages show the Needs the Pass card in the now card’s place. Empty filters: “Nothing matches that.” and Clear all, no box. Under 640px every button is full width.",
    steps: [
      "pur-first-in-progress",
      "library-casebook-free",
      "library-delve-free-in-progress",
      "library-list-free-in-progress",
      "pur-first-done",
      "edition-word-done",
      "edition-mystery-done",
      "edition-casebook-done",
      "session-groups-unfinished",
      "session-delve-unfinished",
      "library-hunter-pass-ended",
      "library-hunter-pass-ended-today",
      "fp-hunter-library-lapsed",
      "library-casebook-pass-ended",
      "library-delve-pass-ended",
      "pur-pass-ended",
      "pur-pass-ended-every",
      "library-groups-free",
      "pass-card-lapsed",
      "filter-empty-discover",
      "filter-empty-library",
      "filter-empty-history",
      "history-search-empty",
      "casebook-pass",
      "casebook-free",
      "session-groups",
      "library-word",
      "library-word-free",
      "pur-new-account"
    ]
  });
  KIT_QA.unshift({
    key: "canon-delta-walk",
    title: "Walk rulings, 18 October",
    note: "Pass ended: earned achievements read “Earned {date}”, full-colour badge, and one line, “You can’t earn the rest until the Pass returns.” Account (lapsed, ending, cancel): the one What freezes sentence. Daily Word product page, played today: Play opens the prompt. Connect at phone width: Copy keeps its width beside the address, which scrolls sideways. Escape and Delve free: the Playing earlier line under the page. Two in progress (Escape, Delve): Your rooms or Your runs lists both, each In progress; the list shows both unmarked; an earlier one’s panel shows its prompt and Copy, with no warning; this week’s card still continues this week’s.",
    steps: ["library-escape-two-in-progress", "editions-escape-two-in-progress", "library-delve-two-in-progress", "editions-delve-two-in-progress", "library-delve-pass-ended", "library-pass-ended", "pass-card-lapsed", "pass-card-ending", "word-free", "groups-pass", "session-puzzle", "connect", "library-escape-free", "library-delve-no-pass"]
  });
  KIT_QA.unshift({
    key: "audit-fixes",
    title: "Audit fixes, 18 October: one play record",
    note: "Every play, date, count and earned achievement comes from the play log. Check that the head card, the list of plays, History, the Library row, the editions list and achievements agree, that no date falls after Tue 6 Oct, and that a Pass-ended player has no Pass-only play or earned date after 18 Sep (later days are frozen). Groups, free: the never-had card alone. Summers Ago: a day with no ending reads Not finished; the head matches day 18. Library: Escape reads Today. Also: Account has no Your data or Notifications card; the play box reads #212; the Barrow panel ends on See in History; an empty editions search reads Nothing matches that. with Clear all (search zzzz).",
    steps: ["library-groups-free", "pur-pass-ended-every", "library-pass-ended", "library-casebook-pass-ended", "library-delve-pass-ended", "library-hunter-pass-ended", "pur-first-done", "library-word", "history", "lapsed-history", "session-barrow", "library-barrow", "edition-barrow-done", "edition-barrow-done-free", "library-hunter", "session-hunter", "history-hunter", "library", "session-kept-pass-ended", "word-free", "library-casebook-editions", "editions-word-free", "edition-delve-in-progress", "escape-free", "account-email"]
  });
  const kitQaShown = () => KIT_QA.filter((w) => !w.only || !!window[w.only]);
  const { useState: useQaState, useEffect: useQaEffect } = React$1;
  const QaPalette = ({ statesGroups, onGo, onClose }) => {
    const [shown, setShown] = useQaState(false);
    const labels = {};
    (statesGroups || []).forEach((g) => g.items.forEach((s) => {
      [s.id, ...s.aliases || []].forEach((id) => {
        labels[id] = s.label;
      });
    }));
    useQaEffect(() => {
      let r2;
      const r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => setShown(true));
      });
      return () => {
        cancelAnimationFrame(r1);
        cancelAnimationFrame(r2);
      };
    }, []);
    useQaEffect(() => {
      const onKey = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);
    useQaEffect(kitLockScroll, []);
    return /* @__PURE__ */ React$1.createElement(
      "div",
      {
        className: "kit-config-scrim",
        style: { opacity: shown ? 1 : 0 },
        onClick: (e) => {
          if (e.target === e.currentTarget) onClose();
        }
      },
      /* @__PURE__ */ React$1.createElement(
        "div",
        {
          role: "dialog",
          "aria-modal": "true",
          "aria-label": "QA",
          className: "kit-config-modal",
          "data-shown": shown ? "1" : void 0,
          style: { opacity: shown ? 1 : 0, transform: shown ? "scale(1)" : "scale(0.97)" }
        },
        /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-head" }, /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-title" }, "QA"), /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-subtitle" }, "Work in progress. The states to check for work in flight, in order.")), /* @__PURE__ */ React$1.createElement("button", { onClick: onClose, "aria-label": "Close", className: "kit-config-close" }, /* @__PURE__ */ React$1.createElement(Icon, { name: "x", size: 18 }))),
        /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-body" }, kitQaShown().length === 0 && /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-hint", style: { margin: 0 } }, "Nothing to check right now."), kitQaShown().map((w) => /* @__PURE__ */ React$1.createElement("div", { key: w.key, className: "kit-qa-work" }, /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-group-title" }, w.title), w.note && /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-hint", style: { margin: "4px 0 8px" } }, w.note), /* @__PURE__ */ React$1.createElement("ol", { className: "kit-qa-steps" }, w.steps.map((id, i) => {
          const label = labels[id];
          return /* @__PURE__ */ React$1.createElement("li", { key: id }, label ? /* @__PURE__ */ React$1.createElement("button", { className: "kit-states-jump", onClick: () => onGo(id) }, /* @__PURE__ */ React$1.createElement("span", { className: "kit-states-label" }, i + 1 + ". " + label), /* @__PURE__ */ React$1.createElement("span", { className: "kit-states-id" }, "?state=", id)) : /* @__PURE__ */ React$1.createElement("div", { className: "kit-qa-stale" }, /* @__PURE__ */ React$1.createElement("span", { className: "kit-states-label" }, i + 1 + ". Not in the register"), /* @__PURE__ */ React$1.createElement("span", { className: "kit-states-id" }, "?state=", id)));
        })))), /* @__PURE__ */ React$1.createElement("div", { className: "kit-states-foot" }, /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-hint", style: { margin: 0 } }, "This list is temporary. Each entry lives in app/qa.jsx and is deleted once its work is signed off; the states stay.")))
      )
    );
  };
  KIT_QA.unshift({
    key: "delve-1236",
    title: "Delve: session page and now card (1236, not signed off)",
    note: "Each at desktop and phone width. The sheet in one row on desktop (3B); on a phone folded to the hero and meters, the whole hero row opens it. The run card: the ending word, a hairline, its line; the route; the held roll. Every move collapsed. Now card: the ending word top right, the route at card size; a die opens the session page on that roll.",
    steps: ["library-delve", "library-delve-in-progress", "session-delve", "session-delve-fallen", "session-delve-hard", "session-delve-in-progress"]
  });
  KIT_QA.unshift({
    key: "escape-1236",
    title: "Escape: session page and now card (1236, not signed off)",
    note: "Each at desktop and phone width. Session page: the door and Escaped with the verdict, the line, one lane per lock (two a row on desktop, the picked one alone on a phone), Every move collapsed. Now card: Escaped and the verdict at the head’s right, the line; press a door: the session page opens on that lock’s lane. Hard: the cabinet lane wraps to two rows; doors stay 32px apart.",
    steps: [
      "library-escape",
      "library-escape-on-par",
      "library-escape-over",
      "library-escape-hard",
      "library-escape-in-progress",
      "library-escape-free",
      "session-escape",
      "session-escape-on-par",
      "session-escape-over",
      "session-escape-hard",
      "session-escape-in-progress"
    ]
  });
  KIT_QA.unshift({
    key: "word-1236",
    title: "Daily Word: session page (1236, not signed off)",
    note: 'Each at desktop and phone width; Hard at 1440 x 900 and 1280 x 800 must show the whole board without scrolling. The board on its grey ground, centred, the ground wrapping every tile; the hint a slim row, its letter in its place with "Hint" beside it; no dashed edges; in progress, an underline for each guess left. The cover: the grey square small and thin at rest, full and filled on hover, focus or tap. Every guess collapsed below.',
    steps: ["session-puzzle", "session-word-hard", "session-word-failed", "session-word-in-progress"]
  });
  KIT_QA.unshift({
    key: "this-edition-picks",
    title: "Config: This edition (Average, Hard, Failed)",
    note: "Config → Every game → This edition. Pick Hard, then Failed, then Average: Daily Word, Daily Groups and Daily Mystery change on the now card, Your plays, History and the session page together; Escape changes on Hard only. Daily Word’s History also holds #210 (hard) and #208 (failed). Escape keeps its par pick in its own section.",
    steps: ["history", "library-word", "library-escape"]
  });
  const ConfigExtraBase = () => {
    const api = window.gsApi || {};
    const r = api.review || {};
    const sub = api.sub || {};
    const [, bump] = React$1.useState(0);
    const set = (fn) => {
      fn();
      setTimeout(() => bump((n) => n + 1), 0);
    };
    const Group = ConfigGroup;
    const Row = ConfigRow;
    const o = (pairs) => pairs.map(([value, label]) => ({ value, label }));
    const edVal = r.today === "none" ? "none" : r.week === "live" ? "live" : ["average", "hard", "failed"].includes(r.ed) ? r.ed : null;
    const setEd = (v) => set(() => api.setReview({ today: v === "none" ? "none" : "played", week: v === "live" ? "live" : "done", ed: ["average", "hard", "failed"].includes(v) ? v : null }));
    const setSub = (patch) => set(() => {
      if (api.view === "out") api.setView("free");
      api.setSub(patch);
    });
    const R = (label, value, onChange, options, hint) => /* @__PURE__ */ React$1.createElement(Row, { label, value, onChange, options, hint });
    return /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement(Group, { title: "After Pixels", scope: "global" }, R("Your AI", api.connected ? "yes" : "no", (v) => set(() => api.setConnected(v === "yes")), o([["yes", "Connected"], ["no", "Not connected"]])), R(
      "Account",
      api.user && api.user.fresh ? "new" : "played",
      (v) => set(() => {
        if (api.view === "out") api.setView("free");
        api.setUser({ fresh: v === "new" });
      }),
      o([["played", "Has played"], ["new", "New, nothing played"]]),
      "New: the Library shows every game never played and History is empty, as for an account made here."
    )), /* @__PURE__ */ React$1.createElement(Group, { title: "Subscription", scope: "global" }, R(
      "Subscription",
      sub.status || "none",
      (v) => setSub({ status: v, pending: null, ...v === "none" ? {} : { hadPass: true } }),
      o([["none", "None"], ["active", "Active"], ["failed", "Payment failed"], ["ending", "Ending"]]),
      "The demo bar at the foot of every screen agrees: Free is None, Pass is Active."
    ), R(
      "Had the Pass before",
      sub.hadPass ? "yes" : "no",
      (v) => setSub({ hadPass: v === "yes" }),
      o([["no", "No"], ["yes", "Yes"]]),
      "Subscription None with this set to Yes is the lapsed card."
    ), R("Plan", sub.plan || "monthly", (v) => setSub({ plan: v, pending: null }), o([["monthly", "Monthly"], ["yearly", "Yearly"]]))), /* @__PURE__ */ React$1.createElement(Group, { title: "Sign-in and account" }, R("Signed in with", api.provider || "email", (v) => set(() => api.setProvider(v)), o([["email", "Email"], ["google", "Google"], ["apple", "Apple"]])), R("Provider sheet", r.sheet || "completes", (v) => set(() => api.setReview({ sheet: v })), o([["completes", "Completes"], ["cancelled", "Cancelled"]])), R("Google and Apple sign-in", r.providerFail ? "fail" : "ok", (v) => set(() => api.setReview({ providerFail: v === "fail" })), o([["ok", "Works"], ["fail", "Fails"]])), R(
      "Device",
      r.device === "new" ? "new" : "known",
      (v) => set(() => api.setReview({ device: v })),
      o([["known", "Known"], ["new", "New"]]),
      "Applies to email, Google and Apple sign-in."
    ), R("Username", api.user && api.user.locked ? "recent" : "free", (v) => set(() => api.setUser({ locked: v === "recent", since: v === "recent" ? GS_DAY0.getTime() : null })), o([["free", "Free to change"], ["recent", "Changed recently"]]))), /* @__PURE__ */ React$1.createElement(Group, { title: "Editions" }, R(
      "This edition",
      edVal,
      setEd,
      o([["none", "Not played"], ["live", "In progress"], ["average", "Average"], ["hard", "Hard"], ["failed", "Failed"]]),
      "This edition's play on every screen that shows it: the day for each daily game, the week for Escape and Delve, the case for Casebook. Hard: every try and hint used, still won. Average, Hard and Failed are staged for Daily Word, Daily Groups and Daily Mystery (Escape has Hard only); other games keep their seeded play. Not played applies to a free account. Nothing picked: as seeded."
    ), R(
      "Ended unfinished",
      r.unfinished ? "on" : "off",
      (v) => set(() => api.setReview({ unfinished: v === "on" })),
      o([["off", "None"], ["on", "A day"]]),
      "Adds a Daily Groups day and a Delve week that ended before you finished."
    )), /* @__PURE__ */ React$1.createElement(Group, { title: "Escape" }, R(
      "This week’s room, finished",
      r.escape === "par" || r.escape === "over" ? r.escape : "under",
      (v) => set(() => api.setReview({ escape: v })),
      o([["under", "Under par"], ["par", "On par"], ["over", "Over par"]]),
      "The finished play when This edition is Average or nothing is picked."
    )), GsBarrowConfigRow ? /* @__PURE__ */ React$1.createElement(Group, { title: "The Barrow of Hollowmere" }, /* @__PURE__ */ React$1.createElement(GsBarrowConfigRow, null)) : null, /* @__PURE__ */ React$1.createElement(Group, { title: "Pass changes" }, R(
      "Pass changes",
      r.passFail ? "fail" : "work",
      (v) => set(() => api.setReview({ passFail: v === "fail" })),
      o([["work", "Work"], ["fail", "Fail"]]),
      "Covers cancel, resume, switch and keeping the current plan."
    ), R(
      "Pass ended",
      sub.endedOn ? "today" : "earlier",
      (v) => setSub({ endedOn: v === "today" ? GS_DAY0.getTime() : null }),
      o([["earlier", "18 September"], ["today", "Today"]]),
      "The one date every page prints for an ended Pass (Subscription None, Had the Pass before Yes)."
    )));
  };
  const GsPassConfigRows = () => {
    const v = useCpr();
    const Group = ConfigGroup;
    const Row = ConfigRow;
    return /* @__PURE__ */ React$1.createElement(Group, { title: "Pass upsell" }, /* @__PURE__ */ React$1.createElement(
      Row,
      {
        label: "New editions",
        value: v.newEds,
        onChange: (x) => GsPassStage.set({ newEds: x }),
        options: [{ value: "seed", label: "As seeded" }, { value: "most", label: "Most not played" }],
        hint: "Most not played treats every daily but Daily Word as unplayed today. New for you still holds only what the player can play now."
      }
    ), /* @__PURE__ */ React$1.createElement(
      Row,
      {
        label: "Free: Word and Escape",
        value: v.freeNew ? "new" : "played",
        onChange: (x) => GsPassStage.set({ freeNew: x === "new" }),
        options: [{ value: "new", label: "Not played" }, { value: "played", label: "Played" }],
        hint: "A free account's today's Daily Word and Escape's first room. Not played puts both in New for you."
      }
    ));
  };
  const GsBarrowConfigRow = () => {
    const v = useCpr();
    const Row = ConfigRow;
    return /* @__PURE__ */ React$1.createElement(
      Row,
      {
        label: "Chapter 1",
        value: v.bwDone ? "done" : "none",
        onChange: (x) => GsPassStage.set({ bwDone: x === "done" }),
        options: [{ value: "none", label: "Not played" }, { value: "done", label: "Finished" }]
      }
    );
  };
  const ConfigExtra = () => /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement(ConfigExtraBase, null), /* @__PURE__ */ React$1.createElement(GsPassConfigRows, null));
  const buildStates = (api) => {
    const r = buildStatesBase(api);
    r.states.forEach((s) => {
      const go = s.go;
      s.go = () => {
        GsPassStage.set({ ...CPR_DEFAULTS });
        go();
      };
    });
    return r;
  };
  const fitQuery = () => new URLSearchParams(window.location.search);
  const isFitted = () => fitQuery().get("fit") === "1";
  const isFramed = () => fitQuery().get("pgframe") === "1";
  const fitSubs = /* @__PURE__ */ new Set();
  const useFit = () => {
    const [, bump] = React$1.useState(0);
    React$1.useEffect(() => {
      const f = () => bump((n) => n + 1);
      fitSubs.add(f);
      return () => fitSubs.delete(f);
    }, []);
    return isFitted();
  };
  const fitFrameUrl = () => {
    const u = new URL(window.location.href);
    u.searchParams.delete("fit");
    u.searchParams.set("pgframe", "1");
    return u.toString();
  };
  let fitScrollY = 0;
  const setFit = (on) => {
    const url = new URL(window.location.href);
    if (on) {
      fitScrollY = window.scrollY;
      url.searchParams.set("fit", "1");
    } else url.searchParams.delete("fit");
    window.history.replaceState(null, "", url);
    fitSubs.forEach((f) => f());
    if (!on) requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, fitScrollY)));
  };
  const fitForward = (key, v) => {
    const fr = document.querySelector(".fit-frame");
    if (!fr) return;
    const w = fr.contentWindow;
    if (w && w.pgSetFromParent) w.pgSetFromParent(key, v);
    else fr.src = fitFrameUrl();
  };
  const FIT_WIDTH = 1280;
  const FitView = () => {
    const box = React$1.useRef(null);
    const [size, setSize] = React$1.useState({ w: 0, h: 0 });
    const [src] = React$1.useState(fitFrameUrl);
    React$1.useEffect(() => {
      const el = box.current;
      const read = () => setSize({ w: el.clientWidth, h: el.clientHeight });
      read();
      const ro = new ResizeObserver(read);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);
    const sc = size.w ? Math.min(1, size.w / FIT_WIDTH) : 1;
    return /* @__PURE__ */ React$1.createElement("div", { className: "fit", ref: box }, /* @__PURE__ */ React$1.createElement(
      "iframe",
      {
        className: "fit-frame",
        title: "Desktop view",
        src,
        style: { width: FIT_WIDTH, height: Math.round(size.h / sc), transform: "scale(" + sc + ")" }
      }
    ));
  };
  const {
    useState: useCState,
    useRef: useCRef,
    useEffect: useCEffect,
    useLayoutEffect: useCLayoutEffect,
    useContext: useCContext
  } = React$1;
  const CONFIG_GLOBAL = "Global";
  const CONFIG_PHONE = "(max-width: 639px)";
  const ConfigCtx = React$1.createContext(null);
  const ConfigLauncher = ({
    statesGroups,
    onGoState,
    onOpenStatesIndex,
    onReset,
    layout,
    onLayoutChange,
    platform,
    onPlatformChange
  }) => {
    const fitted = useFit();
    const [open, setOpen] = useCState(false);
    const [statesOpen, setStatesOpen] = useCState(false);
    const [qaOpen, setQaOpen] = useCState(false);
    const [btnPos, setBtnPos] = useCState(() => {
      try {
        const v = JSON.parse(localStorage.getItem("kit_launcher_pos") || "null");
        return v && Number.isFinite(v.x) && Number.isFinite(v.y) ? v : null;
      } catch (e) {
        return null;
      }
    });
    const dragRef = useCRef({ dragging: false, moved: false, dx: 0, dy: 0, last: null });
    const wrapRef = useCRef(null);
    const invokerRef = useCRef(null);
    const onPointerDown = (e) => {
      if (e.button != null && e.button !== 0) return;
      const wrap = e.currentTarget.closest(".kit-config-wrap");
      const rect = wrap.getBoundingClientRect();
      const st = dragRef.current;
      st.dragging = true;
      st.moved = false;
      st.dx = e.clientX - rect.left;
      st.dy = e.clientY - rect.top;
      st.w = rect.width;
      st.h = rect.height;
      st.ox = e.clientX;
      st.oy = e.clientY;
      const move = (ev) => {
        if (!st.dragging) return;
        if (Math.hypot(ev.clientX - st.ox, ev.clientY - st.oy) > 4) st.moved = true;
        const pad = 8;
        const x = Math.max(pad, Math.min(ev.clientX - st.dx, window.innerWidth - st.w - pad));
        const y = Math.max(pad, Math.min(ev.clientY - st.dy, window.innerHeight - st.h - pad));
        st.last = { x, y };
        setBtnPos(st.last);
      };
      const up = () => {
        st.dragging = false;
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        if (st.moved && st.last) {
          try {
            localStorage.setItem("kit_launcher_pos", JSON.stringify(st.last));
          } catch (e2) {
          }
        }
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    };
    useCEffect(() => {
      const clamp = () => setBtnPos((p) => {
        if (!p) return p;
        const el = wrapRef.current;
        const w = el ? el.offsetWidth : 140, h = el ? el.offsetHeight : 40, pad = 8;
        const x = Math.max(pad, Math.min(p.x, window.innerWidth - w - pad));
        const y = Math.max(pad, Math.min(p.y, window.innerHeight - h - pad));
        return x === p.x && y === p.y ? p : { x, y };
      });
      clamp();
      window.addEventListener("resize", clamp);
      return () => window.removeEventListener("resize", clamp);
    }, []);
    const wrapStyle = btnPos ? { left: btnPos.x, top: btnPos.y, right: "auto", bottom: "auto" } : void 0;
    const openAt = (setter) => {
      invokerRef.current = document.activeElement;
      setter(true);
    };
    const closeAt = (setter) => {
      setter(false);
      if (invokerRef.current && invokerRef.current.focus) invokerRef.current.focus();
    };
    const tapped = (fn) => {
      if (dragRef.current.moved) {
        dragRef.current.moved = false;
        return;
      }
      fn();
    };
    const hasStates = !!StatesPalette && !!statesGroups && statesGroups.length > 0;
    const hasQa = hasStates && !!QaPalette;
    return /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-wrap", ref: wrapRef, style: wrapStyle }, /* @__PURE__ */ React$1.createElement("div", { className: "kit-launcher", style: { cursor: "grab", touchAction: "none" } }, /* @__PURE__ */ React$1.createElement(
      "button",
      {
        className: "kit-launcher-half",
        onPointerDown,
        onClick: () => tapped(() => openAt(setOpen)),
        "aria-haspopup": "dialog",
        "aria-expanded": open,
        "data-open": open ? "1" : void 0,
        "aria-label": "Config",
        title: "Config — drag to move"
      },
      /* @__PURE__ */ React$1.createElement(Icon, { name: "settings", size: 20 })
    ), !fitted && hasStates && /* @__PURE__ */ React$1.createElement(
      "button",
      {
        className: "kit-launcher-half",
        onPointerDown,
        onClick: () => tapped(() => openAt(setStatesOpen)),
        "aria-haspopup": "dialog",
        "aria-expanded": statesOpen,
        "data-open": statesOpen ? "1" : void 0,
        "aria-label": "States",
        title: "States — drag to move"
      },
      /* @__PURE__ */ React$1.createElement(Icon, { name: "list", size: 20 })
    ), !fitted && hasQa && /* @__PURE__ */ React$1.createElement(
      "button",
      {
        className: "kit-launcher-half",
        onPointerDown,
        onClick: () => tapped(() => openAt(setQaOpen)),
        "aria-haspopup": "dialog",
        "aria-expanded": qaOpen,
        "data-open": qaOpen ? "1" : void 0,
        "aria-label": "QA",
        title: "QA — drag to move"
      },
      /* @__PURE__ */ React$1.createElement(Icon, { name: "check", size: 20 })
    )), !fitted && hasQa && qaOpen && /* @__PURE__ */ React$1.createElement(
      QaPalette,
      {
        statesGroups,
        onGo: (id) => {
          onGoState(id);
          closeAt(setQaOpen);
        },
        onClose: () => closeAt(setQaOpen)
      }
    ), !fitted && hasStates && statesOpen && /* @__PURE__ */ React$1.createElement(
      StatesPalette,
      {
        groups: statesGroups,
        onGo: (id) => {
          onGoState(id);
          closeAt(setStatesOpen);
        },
        onOpenIndex: () => {
          closeAt(setStatesOpen);
          onOpenStatesIndex();
        },
        onClose: () => closeAt(setStatesOpen)
      }
    ), open && /* @__PURE__ */ React$1.createElement(
      ConfigModal,
      {
        onReset,
        layout,
        onLayoutChange,
        platform,
        onPlatformChange,
        fitted,
        onClose: () => closeAt(setOpen)
      }
    ));
  };
  const CONFIG_GLYPHS = {
    info: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("circle", { cx: "12", cy: "12", r: "9" }), /* @__PURE__ */ React$1.createElement("line", { x1: "12", y1: "11", x2: "12", y2: "16.5" }), /* @__PURE__ */ React$1.createElement("line", { x1: "12", y1: "7.5", x2: "12", y2: "7.6" })),
    next: /* @__PURE__ */ React$1.createElement("polyline", { points: "9 6 15 12 9 18" }),
    back: /* @__PURE__ */ React$1.createElement("polyline", { points: "15 6 9 12 15 18" }),
    fire: /* @__PURE__ */ React$1.createElement("polygon", { points: "7 5 18 12 7 19 7 5" })
  };
  const ConfigGlyph = ({ name, size = 16 }) => /* @__PURE__ */ React$1.createElement(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true"
    },
    CONFIG_GLYPHS[name]
  );
  const configSectionOf = (title, scope) => scope === "global" ? CONFIG_GLOBAL : title;
  const configFlatten = (children, prefix = "") => React$1.Children.toArray(children).flatMap((c) => c && c.type === React$1.Fragment ? configFlatten(c.props.children, prefix + c.key) : [React$1.isValidElement(c) ? React$1.cloneElement(c, { key: prefix + c.key }) : c]);
  const useConfigPhone = () => {
    const [phone, setPhone] = useCState(() => window.matchMedia(CONFIG_PHONE).matches);
    useCEffect(() => {
      const mq = window.matchMedia(CONFIG_PHONE);
      const on = () => setPhone(mq.matches);
      mq.addEventListener("change", on);
      return () => mq.removeEventListener("change", on);
    }, []);
    return phone;
  };
  const ConfigInfo = ({ open, onToggle, label }) => /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "kit-config-info", "aria-expanded": open, "aria-label": label, onClick: onToggle }, /* @__PURE__ */ React$1.createElement(ConfigGlyph, { name: "info", size: 16 }));
  const ConfigRow = ({ label, value, onChange, options, hint }) => {
    const [hintOpen, setHintOpen] = useCState(false);
    return /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-row" }, /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-row-head" }, /* @__PURE__ */ React$1.createElement("span", { className: "kit-config-row-label" }, label), hint && /* @__PURE__ */ React$1.createElement(ConfigInfo, { open: hintOpen, onToggle: () => setHintOpen((v) => !v), label: "About " + label })), /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-seg", role: "radiogroup", "aria-label": label }, options.map((o) => /* @__PURE__ */ React$1.createElement(
      "button",
      {
        key: o.value,
        type: "button",
        role: "radio",
        "aria-checked": o.value === value,
        className: "kit-config-seg-btn",
        "data-active": o.value === value ? "1" : void 0,
        onClick: () => onChange(o.value)
      },
      o.label
    ))), hint && hintOpen && /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-tip" }, hint));
  };
  const ConfigAction = ({ label, onClick }) => /* @__PURE__ */ React$1.createElement(
    "button",
    {
      type: "button",
      className: "kit-config-action",
      onClick: () => {
        if (typeof onClick === "function") onClick();
      }
    },
    /* @__PURE__ */ React$1.createElement(ConfigGlyph, { name: "fire", size: 12 }),
    label
  );
  const ConfigNote = ({ children }) => /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-note" }, children);
  const ConfigGroup = ({ title, scope, children }) => {
    const ctx = useCContext(ConfigCtx);
    const id = React$1.useId();
    const section = configSectionOf(title, scope);
    useCLayoutEffect(() => {
      if (!ctx) return void 0;
      ctx.register(id, section);
      return () => ctx.unregister(id);
    }, [section]);
    if (ctx && ctx.active !== section) return null;
    const items = configFlatten(children);
    const actions = items.filter((c) => c.type === ConfigAction);
    const rest = items.filter((c) => c.type !== ConfigAction);
    return /* @__PURE__ */ React$1.createElement("section", { className: "kit-config-group" }, section === CONFIG_GLOBAL && /* @__PURE__ */ React$1.createElement("h3", { className: "kit-config-group-heading" }, title), rest.length > 0 && /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-rows" }, rest), actions.length > 0 && /* @__PURE__ */ React$1.createElement(ConfigEvents, { actions }));
  };
  const ConfigEvents = ({ actions }) => {
    const [hintOpen, setHintOpen] = useCState(false);
    const hints = actions.filter((a) => a.props.hint);
    return /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-events" }, /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-events-head" }, /* @__PURE__ */ React$1.createElement("span", { className: "kit-config-events-title" }, "Events"), /* @__PURE__ */ React$1.createElement("span", { className: "kit-config-events-sub" }, "Fires once, then closes Config"), hints.length > 0 && /* @__PURE__ */ React$1.createElement(ConfigInfo, { open: hintOpen, onToggle: () => setHintOpen((v) => !v), label: "About these events" })), hintOpen && hints.map((a) => /* @__PURE__ */ React$1.createElement("div", { key: a.key, className: "kit-config-tip" }, /* @__PURE__ */ React$1.createElement("b", null, a.props.label, ":"), " ", a.props.hint)), /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-events-list" }, actions));
  };
  let configLastSection = null;
  const ConfigModal = ({ onReset, layout, onLayoutChange, platform, onPlatformChange, fitted, onClose }) => {
    const isApp = platform === "app";
    const phone = useConfigPhone();
    const [shown, setShown] = useCState(false);
    const [active, setActive] = useCState(configLastSection || CONFIG_GLOBAL);
    const [drilled, setDrilled] = useCState(!!configLastSection);
    const [sections, setSections] = useCState([]);
    const regRef = useCRef(/* @__PURE__ */ new Map());
    const dialogRef = useCRef(null);
    const syncSections = () => {
      const seen = [];
      regRef.current.forEach((s) => {
        if (!seen.includes(s)) seen.push(s);
      });
      const ordered = [CONFIG_GLOBAL, ...seen.filter((s) => s !== CONFIG_GLOBAL)];
      setSections((prev) => prev.join("|") === ordered.join("|") ? prev : ordered);
    };
    const ctx = {
      active,
      register: (id, section) => {
        regRef.current.set(id, section);
        syncSections();
      },
      unregister: (id) => {
        regRef.current.delete(id);
        syncSections();
      }
    };
    const choose = (s) => {
      setActive(s);
      setDrilled(true);
      configLastSection = s;
    };
    useCEffect(() => {
      if (sections.length && !sections.includes(active)) setActive(CONFIG_GLOBAL);
    }, [sections]);
    useCEffect(() => {
      const el = dialogRef.current;
      if (!el) return;
      const target = el.querySelector(phone && drilled ? ".kit-config-back" : phone ? ".kit-config-rail-btn" : '.kit-config-rail-btn[aria-current="true"]');
      if (target) target.focus({ preventScroll: true });
    }, [phone, drilled, sections.length > 1]);
    useCEffect(() => {
      let r2;
      const r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => setShown(true));
      });
      return () => {
        cancelAnimationFrame(r1);
        cancelAnimationFrame(r2);
      };
    }, []);
    useCEffect(() => {
      const onKey = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);
    useCEffect(kitLockScroll, []);
    const onPaneClickCapture = (e) => {
      const btn = e.target.closest && e.target.closest(".kit-config-action");
      if (!btn || btn.dataset.replay === "1") return;
      e.preventDefault();
      e.stopPropagation();
      setShown(false);
      setTimeout(() => {
        btn.dataset.replay = "1";
        btn.click();
        onClose();
      }, 190);
    };
    const inSection = phone && drilled;
    const features = sections.filter((s) => s !== CONFIG_GLOBAL);
    const railBtn = (s, sub) => /* @__PURE__ */ React$1.createElement(
      "button",
      {
        key: s,
        type: "button",
        className: "kit-config-rail-btn",
        "aria-current": !phone && s === active ? "true" : void 0,
        onClick: () => choose(s)
      },
      /* @__PURE__ */ React$1.createElement("span", { className: "kit-config-rail-text" }, /* @__PURE__ */ React$1.createElement("span", { className: "kit-config-rail-name" }, s), sub && /* @__PURE__ */ React$1.createElement("span", { className: "kit-config-rail-sub" }, sub)),
      /* @__PURE__ */ React$1.createElement("span", { className: "kit-config-rail-chev" }, /* @__PURE__ */ React$1.createElement(ConfigGlyph, { name: "next", size: 18 }))
    );
    const Extra = ConfigExtra;
    return /* @__PURE__ */ React$1.createElement(
      "div",
      {
        className: "kit-config-dialog-scrim",
        style: { opacity: shown ? 1 : 0 },
        onClick: (e) => {
          if (e.target === e.currentTarget) onClose();
        }
      },
      /* @__PURE__ */ React$1.createElement(
        "div",
        {
          role: "dialog",
          "aria-modal": "true",
          "aria-label": "Config",
          ref: dialogRef,
          className: "kit-config-dialog",
          "data-shown": shown ? "1" : void 0,
          "data-view": inSection ? "section" : "list"
        },
        /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-dialog-head" }, inSection ? /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "kit-config-back", onClick: () => setDrilled(false) }, /* @__PURE__ */ React$1.createElement(ConfigGlyph, { name: "back", size: 20 }), /* @__PURE__ */ React$1.createElement("span", null, "Config")) : /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-dialog-head-text" }, /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-dialog-title" }, "Config"), /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-dialog-subtitle" }, "Prototype controls, not part of the product.")), /* @__PURE__ */ React$1.createElement("button", { type: "button", onClick: onClose, "aria-label": "Close", className: "kit-config-dialog-close" }, /* @__PURE__ */ React$1.createElement(Icon, { name: "x", size: 18 }))),
        /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-main" }, /* @__PURE__ */ React$1.createElement("nav", { className: "kit-config-rail", "aria-label": "Config sections" }, railBtn(CONFIG_GLOBAL, "Whole prototype"), features.length > 0 && /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-rail-label" }, "Features"), features.map((s) => railBtn(s))), /* @__PURE__ */ React$1.createElement("div", { className: "kit-config-pane", "aria-label": active, onClickCapture: onPaneClickCapture }, /* @__PURE__ */ React$1.createElement("h2", { className: "kit-config-pane-title" }, active), /* @__PURE__ */ React$1.createElement(ConfigCtx.Provider, { value: ctx }, /* @__PURE__ */ React$1.createElement(ConfigGroup, { title: "Review", scope: "global" }, !fitted && /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, onPlatformChange && /* @__PURE__ */ React$1.createElement(
          ConfigRow,
          {
            label: "Platform",
            value: platform || "web",
            onChange: onPlatformChange,
            options: [{ value: "web", label: "Web" }, { value: "app", label: "Mobile" }],
            hint: "Mobile renders the product as a native app, in a phone with its status bar and home indicator."
          }
        ), isApp ? /* @__PURE__ */ React$1.createElement(ConfigNote, null, "Viewport is for Web only: the mobile app always uses the phone.") : /* @__PURE__ */ React$1.createElement(
          ConfigRow,
          {
            label: "Viewport",
            value: layout,
            onChange: onLayoutChange,
            options: [{ value: "auto", label: "Auto" }, { value: "desktop", label: "Desktop" }, { value: "mobile", label: "Mobile" }],
            hint: "Mobile frames every screen in a phone bezel, with no status bar."
          }
        )), (phone || fitted) && /* @__PURE__ */ React$1.createElement(
          ConfigRow,
          {
            label: "Fit",
            value: fitted ? "on" : "off",
            onChange: (v) => setFit(v === "on"),
            options: [{ value: "off", label: "Off" }, { value: "on", label: "On" }],
            hint: "Shows this page laid out as a desktop, scaled to the phone's width."
          }
        ), !fitted && onReset && /* @__PURE__ */ React$1.createElement(ConfigAction, { label: "Reset to seeded data", onClick: onReset })), !fitted && Extra && /* @__PURE__ */ React$1.createElement(Extra, { onClose }))))
      )
    );
  };
  const cprStep = (b, rest) => /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("b", null, b), rest);
  const GS_MORE = [
    {
      k: "cipher",
      name: "Daily Cipher",
      category: "PUZZLE",
      when: "Daily",
      ed: ["cipher", "ciphers"],
      long: "10 min",
      units: "ciphers",
      editions: [[null, "6 October"], [null, "5 October"], [null, "4 October"]],
      once: true,
      blurb: "One line in code. Crack it before midnight.",
      ready: "Today’s cipher is ready",
      art: ["indigo", "centre", '<rect width="160" height="120" fill="#1D1B3A"/><circle cx="80" cy="60" r="38" fill="none" stroke="#A390B2" stroke-width="12"/><circle cx="80" cy="60" r="16" fill="#E5A63B"/><rect x="74" y="10" width="12" height="12" fill="#F2EBE0"/>'],
      page: {
        rhythm: "NEW EVERY DAY",
        heading: "A new cipher every day",
        step: cprStep("Crack today’s cipher.", " Ask for a letter if you’re stuck."),
        often: "New every day",
        h: "One line in code. Crack it before midnight.",
        ps: ["Every letter stands for another. Guess a few, test them on the line, and watch the words come through.", "Your AI takes your guesses and reads back the line as it stands. The game engine holds the key. Name your first letter."],
        ai: "Takes your letter swaps and reads the line back to you.",
        server: "Holds the key, checks every swap and counts your hints."
      },
      chat: ["Swap a letter and the whole line changes.", "I want to play Daily Cipher.", ["Daily Cipher No. 41. One line, every letter swapped for another.", "QEB NRFZH YOLTK CLU. Which letter first?"]]
    },
    {
      k: "nighttrain",
      name: "The Night Train",
      category: "MYSTERY",
      when: "Weekly",
      ed: ["case", "cases"],
      long: "25–40 min",
      units: "cases",
      editions: [["The Sleeper to Inverness", "5 October"], ["A Death in Carriage Four", "28 September"], ["The Last Stop at Crewe", "21 September"]],
      once: true,
      blurb: "Someone left the sleeper car and never reached the next one.",
      ready: "This week’s case is ready",
      art: ["indigo", "bottom", '<rect width="160" height="120" fill="#1D1B3A"/><rect x="14" y="62" width="132" height="36" fill="#D66847"/><rect x="26" y="70" width="16" height="12" fill="#F2EBE0"/><rect x="54" y="70" width="16" height="12" fill="#F2EBE0"/><rect x="82" y="70" width="16" height="12" fill="#1D1B3A"/><rect x="110" y="70" width="16" height="12" fill="#F2EBE0"/><rect x="0" y="106" width="160" height="6" fill="#E5A63B"/><circle cx="128" cy="28" r="10" fill="#A390B2"/>'],
      page: {
        rhythm: "A NEW CASE EVERY WEEK",
        heading: "A new case every week",
        step: cprStep("Work one full case", ", from the first stop to the last."),
        often: "A new case every week",
        h: "Someone left the sleeper car and never reached the next one.",
        ps: ["Eight passengers, one corridor and a train that doesn’t stop until dawn. Everyone saw something. Nobody saw all of it.", "Your AI plays every passenger. The game engine keeps what each one said and where they were. Knock on the first door."],
        ai: "Plays every passenger and the guard, and narrates the train.",
        server: "Holds every statement and timetable, counts your stops and checks your accusation."
      },
      chat: ["Eight passengers, one corridor, no stops until dawn.", "Knock on compartment 4.", ["A tired voice: “I was asleep by eleven. I heard nothing.”", "Her shoes are wet. It hasn’t rained since the last station."]]
    },
    {
      k: "saltmarsh",
      name: "Saltmarsh",
      category: "ADVENTURE",
      when: "Weekly",
      ed: ["voyage", "voyages"],
      long: "30–45 min",
      units: "voyages",
      editions: [["Fog off Blakeney Point", "5 October"], ["The Oyster Beds", "28 September"], ["Crossing the Wash", "21 September"]],
      blurb: "Run the cargo through the marsh before the tide turns.",
      ready: "This week’s voyage is ready",
      art: ["forest", "bottom", '<rect width="160" height="120" fill="#163328"/><path d="M76 24L76 84L40 84Z" fill="#F2EBE0"/><rect x="34" y="88" width="72" height="12" fill="#D66847"/><rect x="0" y="104" width="160" height="16" fill="#328A88"/><circle cx="126" cy="34" r="14" fill="#E5A63B"/>'],
      page: {
        rhythm: "A NEW VOYAGE EVERY WEEK",
        heading: "A new voyage every week",
        step: cprStep("Sail one voyage", ", from the quay to the drop."),
        often: "A new voyage every week",
        h: "Run the cargo through the marsh before the tide turns.",
        ps: ["The channels shift every week, the excise cutter knows half of them, and the tide waits for nobody. Pick your route, read the water, and keep the hold dry.", "Your AI tells the crossing and voices the crew. The game engine rolls every die and keeps the tide clock. Cast off."],
        ai: "Tells the crossing, voices your crew and the excise men.",
        server: "Rolls every die, keeps the tide clock and the cargo, and records your voyage."
      },
      chat: ["Every channel is a roll against the tide.", "Take the north channel.", ["You slip past the reed bank. The cutter’s lamp swings your way, then on.", "Tide: 3 of 6. Two channels to the drop."]]
    },
    {
      k: "heist",
      name: "Heist",
      category: "PUZZLE",
      when: "Weekly",
      ed: ["job", "jobs"],
      long: "20 min",
      units: "jobs",
      editions: [["The Diamond Exchange", "5 October"], ["The Night Mail", "28 September"], ["The Opera House Safe", "21 September"]],
      blurb: "Plan the job. Then make it work when it goes wrong.",
      ready: "This week’s job is ready",
      art: ["wine", "centre", '<rect width="160" height="120" fill="#421A28"/><rect x="44" y="24" width="72" height="72" fill="#A390B2"/><circle cx="80" cy="60" r="20" fill="#F2EBE0"/><rect x="76" y="44" width="8" height="32" fill="#E5A63B"/>'],
      page: {
        rhythm: "A NEW JOB EVERY WEEK",
        heading: "A new job every week",
        step: cprStep("Plan this week’s job", ", then pull it off."),
        often: "A new job every week",
        h: "Plan the job. Then make it work when it goes wrong.",
        ps: ["You get the floor plan, the guard rota and a crew of three. Decide who goes where and when. Something will slip, and you’ll have one move to fix it.", "Your AI briefs you and plays the crew. The game engine runs the guards to the second. Pick your way in."],
        ai: "Briefs you on the job and plays your crew.",
        server: "Runs the guards and the clock, and decides what each move does."
      },
      chat: ["One floor plan, three crew, one way out.", "Send Ines to the loading bay at 2.10.", ["Ines is in. The guard is early: he’s back at 2.14, not 2.20.", "You have one move before he turns the corner."]]
    },
    {
      k: "winter",
      name: "The Long Winter",
      category: "ADVENTURE",
      ed: ["chapter", "chapters"],
      long: "45–60 min",
      units: "chapters",
      editions: [["Wolves at the Gate", "5 October"], ["The Frozen Mill", "28 September"], ["First Snow", "21 September"]],
      blurb: "Keep the settlement fed until the thaw.",
      ready: "Chapter 1 is ready",
      art: ["indigo", "bottom", '<rect width="160" height="120" fill="#1D1B3A"/><rect x="0" y="92" width="160" height="28" fill="#F2EBE0"/><rect x="58" y="60" width="44" height="32" fill="#D66847"/><path d="M52 62L80 38L108 62Z" fill="#E5A63B"/><circle cx="30" cy="30" r="4" fill="#A390B2"/><circle cx="130" cy="22" r="4" fill="#A390B2"/><circle cx="118" cy="48" r="4" fill="#A390B2"/>'],
      page: {
        rhythm: "ONE CHAPTER",
        heading: "A winter told in chapters",
        step: cprStep("Play chapter 1", ", from first snow to the frozen river."),
        often: "At your own pace",
        h: "Keep the settlement fed until the thaw.",
        ps: ["Twelve families, one store of grain and a winter that came a month early. Each chapter is a stretch of weeks: who hunts, who mends, who goes without.", "Your AI speaks for the settlement. The game engine keeps the stores, the weather and everyone’s strength. Open the grain store."],
        ai: "Speaks for the settlement and tells you how each week went.",
        server: "Keeps the stores, the weather and everyone’s strength, and carries them between chapters."
      },
      chat: ["What you ration now decides who sees the thaw.", "Send the two eldest sons to hunt.", ["They come back on the third day with a deer and frostbitten hands.", "Grain: 41 days. Firewood: 18 days."]]
    },
    {
      k: "farside",
      name: "Far Side",
      category: "LEARNING",
      ed: ["mission", "missions"],
      long: "30 min",
      units: "missions",
      editions: [["Landing at Shackleton", "5 October"], ["Around the Far Side", "28 September"], ["Leaving Earth Orbit", "21 September"]],
      blurb: "Bring the crew home from behind the Moon.",
      ready: "Mission 1 is ready",
      art: ["indigo", "centre", '<rect width="160" height="120" fill="#1D1B3A"/><circle cx="62" cy="66" r="38" fill="#F2EBE0"/><circle cx="128" cy="28" r="12" fill="#328A88"/><rect x="108" y="74" width="12" height="12" fill="#E5A63B"/>'],
      page: {
        rhythm: "ONE MISSION",
        heading: "A flight told in missions",
        step: cprStep("Fly mission 1", ", from launch to splashdown."),
        often: "At your own pace",
        h: "Bring the crew home from behind the Moon.",
        ps: ["Burn too long and you miss the window. Burn too short and you never leave orbit. Each mission teaches one piece of the flight, and the next one leans on it.", "Your AI is mission control and explains each decision. The game engine flies the spacecraft. Call your first burn."],
        ai: "Plays mission control and explains the why behind each burn.",
        server: "Flies the spacecraft, keeps the fuel and the clock, and records your mission."
      },
      chat: ["Every burn is worked out by the engine.", "Burn for 40 seconds.", ["Good burn. You’re on the way out of Earth orbit.", "Fuel: 72%. Next window in 3 hours."]]
    },
    {
      k: "ashcourt",
      name: "The Court of Ash",
      category: "MYSTERY",
      ed: ["night", "nights"],
      long: "90 min",
      units: "plays",
      editions: [["The Night of the Bells", "5 October"], ["The Winter Feast", "28 September"], ["The Eve of the Crowning", "21 September"]],
      blurb: "The king is dead, and the whole court had a reason.",
      ready: "The court is ready",
      art: ["wine", "bottom", '<rect width="160" height="120" fill="#421A28"/><rect x="56" y="30" width="48" height="90" fill="#A390B2"/><path d="M50 56L50 34L64 46L80 28L96 46L110 34L110 56Z" fill="#E5A63B"/><rect x="72" y="70" width="16" height="16" fill="#F2EBE0"/>'],
      page: {
        rhythm: "ONE NIGHT",
        heading: "A different court every time",
        step: cprStep("Play the night", ", from the bell to the dawn."),
        often: "A different culprit every time you start",
        h: "The king is dead, and the whole court had a reason.",
        ps: ["The queen, the chancellor, the bishop and the king’s brother were all in the castle. By dawn the court picks a culprit, with your help or without it.", "Your AI plays the court. The game engine decides who did it and keeps every word. Ask your first question."],
        ai: "Plays the whole court and narrates the castle.",
        server: "Picks the culprit, keeps every statement and checks your verdict."
      },
      chat: ["Everyone at court has something to hide.", "Ask the chancellor where he was at midnight.", ["“In the chapel, praying for His Majesty.”", "The bishop says the chapel was locked at eleven."]]
    },
    {
      k: "tidepool",
      name: "Low Tide",
      category: "LEARNING",
      ed: ["tide", "tides"],
      long: "1 hour",
      units: "tides",
      editions: [["Low Water at Kimmeridge", "5 October"], ["Spring Tide at Wembury", "28 September"], ["The Pools at Robin Hood’s Bay", "21 September"]],
      blurb: "One low tide on a rocky shore. Turn over every stone.",
      ready: "Low tide is ready",
      art: ["forest", "bottom", '<rect width="160" height="120" fill="#163328"/><rect x="0" y="84" width="160" height="36" fill="#328A88"/><rect x="24" y="66" width="40" height="22" fill="#A390B2"/><circle cx="104" cy="96" r="12" fill="#D66847"/><circle cx="132" cy="24" r="14" fill="#E5A63B"/>'],
      page: {
        rhythm: "ONE TIDE",
        heading: "A different shore every time",
        step: cprStep("Explore the shore", " until the water comes back."),
        often: "A different shore every time you start",
        h: "One low tide on a rocky shore.",
        ps: ["You have an hour before the sea returns. Lift stones, wade the pools and see what lives where the water just was.", "Your AI describes everything you find and answers what you ask about it. The game engine keeps the tide and what each pool holds. Lift the first stone."],
        ai: "Describes what you find and answers your questions about it.",
        server: "Keeps the tide, decides what each pool holds and records what you found."
      },
      chat: ["Every pool holds something different.", "Lift the flat stone by the big pool.", ["Two shore crabs scatter sideways. Under them, a cluster of tiny white eggs.", "Tide: 40 minutes until it turns."]]
    },
    {
      k: "clockwork",
      name: "Clockwork",
      category: "PUZZLE",
      ed: ["vault", "vaults"],
      long: "45 min",
      units: "machines",
      editions: [["The Cathedral Clock", "5 October"], ["The Banker’s Strongroom", "28 September"], ["The Lighthouse Lock", "21 September"]],
      blurb: "Build the machine that opens the vault.",
      ready: "The workshop is ready",
      art: ["indigo", "centre", '<rect width="160" height="120" fill="#1D1B3A"/><circle cx="64" cy="64" r="28" fill="none" stroke="#E5A63B" stroke-width="10"/><circle cx="110" cy="44" r="16" fill="none" stroke="#328A88" stroke-width="8"/><circle cx="64" cy="64" r="6" fill="#F2EBE0"/><circle cx="110" cy="44" r="4" fill="#F2EBE0"/>'],
      page: {
        rhythm: "ONE MACHINE",
        heading: "A different vault every time",
        step: cprStep("Build the machine", ", one part at a time."),
        often: "A different vault every time you start",
        h: "Build the machine that opens the vault.",
        ps: ["Gears, springs, levers and a lock that wants turning eleven times. Fit the parts, set it going and see how far it gets.", "Your AI describes the workbench and what the machine does. The game engine runs every turn of every gear. Pick your first part."],
        ai: "Describes the workbench and what your machine does when it runs.",
        server: "Runs every gear and spring, and decides whether the vault opens."
      },
      chat: ["Fit a part, set it going, see what moves.", "Put the large gear on the left spindle and wind it.", ["The large gear turns the small one three times. The lock moves one notch.", "Ten notches to go."]]
    }
  ];
  const GS_MORE_IDS = GS_MORE.map((d) => d.k);
  const MgLibrary = ({ id }) => {
    const gs = useGs();
    const g = GS_GAMES[id];
    const e = edList(gs, id)[0];
    return /* @__PURE__ */ React$1.createElement("main", { key: gs.view, className: "gs-wrap gs-main" }, /* @__PURE__ */ React$1.createElement(LbHead, { id }), /* @__PURE__ */ React$1.createElement("div", { className: "lb-lay" }, cprLocked(gs, id) ? /* @__PURE__ */ React$1.createElement(LbNeedsPass, { id, access: "none" }) : /* @__PURE__ */ React$1.createElement(LbFreshNow, { gid: id, title: e.title || edLabel(e), line: g.blurb, span: true, onPlay: () => gs.playReq({ kind: "edition", e }) })));
  };
  const GS_MORE_SCREENS = {};
  function initGsMoreGames() {
    GS_MORE.forEach((d) => {
      const tags = [d.when, d.long].filter(Boolean);
      GS_ART[d.k] = { ground: d.art[0], extend: d.art[1], svg: GS_SVG(d.art[2]) };
      GS_GAMES[d.k] = gsAccess({ access: "pass", name: d.name, category: d.category, art: d.k, route: d.k, ed: d.ed, once: d.once, added: true, blurb: d.blurb, tags });
      GS_PAGES[d.k] = {
        rhythm: d.page.rhythm,
        box: {
          label: "ONLY WITH THE PASS",
          heading: d.page.heading,
          session: null,
          steps: [GS_STEP_CONNECT, d.page.step, /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("b", null, "Keep your result."), " It stays in your history.")],
          small: d.name + " comes only with the After Pixels Pass."
        },
        facts: { long: d.long, often: d.page.often },
        tags: [],
        pitch: { h: d.page.h, ps: d.page.ps },
        who: { ai: d.page.ai, server: d.page.server },
        week: { title: d.page.heading, line: d.blurb }
      };
      GS_CHATS[d.k] = [{ cap: d.chat[0], turns: [gscU(d.chat[1]), gscAi(d.k, d.chat[2])] }];
      GS_LIB_READY[d.k] = d.ready;
      GS_EDITIONS[d.k] = (gs) => edSample(gs, d.k, d.editions);
      GS_LIBRARY[d.k] = () => /* @__PURE__ */ React$1.createElement(MgLibrary, { id: d.k });
      GP_CFG[d.k] = { units: d.units };
      GS_GAME_ORDER.push(d.k);
      CPR_STAGE[d.k] = GS_GAMES[d.k].access;
      CPR_SHOWN.push(d.k);
      GS_MORE_SCREENS[d.k] = gpGame(d.k);
    });
  }
  const GsPass = () => {
    const gs = useGs();
    const holds = gs.view === "pass";
    return /* @__PURE__ */ React$1.createElement("main", { className: "gs-wrap gs-main" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-pass-page" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-pass-head" }, /* @__PURE__ */ React$1.createElement("h1", { className: "gs-h1" }, "After Pixels Pass"), holds && /* @__PURE__ */ React$1.createElement("div", { className: "gs-pass-have" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-marker" }, /* @__PURE__ */ React$1.createElement(DS.Icon, { name: "check" }), "You have the Pass"), /* @__PURE__ */ React$1.createElement(DS.TextLink, { onClick: () => gs.go("account") }, "Manage in account"))), /* @__PURE__ */ React$1.createElement(GsCompare, { foot: !holds && /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-sm" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-pass-foot" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-pass-price gs-num-text" }, GS_PLAN.yearly.price, /* @__PURE__ */ React$1.createElement("span", { className: "gs-muted" }, " or ", GS_PLAN.monthly.price)), /* @__PURE__ */ React$1.createElement(DS.Button, { onClick: () => gs.go("subscribe") }, "Choose a plan")), /* @__PURE__ */ React$1.createElement("p", { className: "gs-small gs-pu-wrap gs-pu-payline" }, GS.purchase)) })));
  };
  const CPR_PICKS = [["casebook", "ONE CASE"], ["word", "A NEW WORD EVERY DAY"]];
  const cprSelection = (gs) => {
    const shown = CPR_PICKS.map((p) => p[0]);
    const take = (ks) => {
      const out = ks.filter((k) => CPR_SHOWN.includes(k) && !shown.includes(k));
      shown.push(...out);
      return out;
    };
    const added = take(GS_ADDED);
    const free = gs.view === "pass" ? [] : CPR_SHOWN.filter((k) => CPR_STAGE[k] !== "pass");
    return { added, free };
  };
  const CprDiscoverBody = ({ f, setF }) => {
    const { q, cat, rhy } = f;
    const setQ = (v) => setF((p) => ({ ...p, q: v }));
    const setCat = (v) => setF((p) => ({ ...p, cat: v }));
    const setRhy = (v) => setF((p) => ({ ...p, rhy: v }));
    const gs = useGs();
    const wait = useGsPart([q, cat, rhy]);
    const tools = React$1.useRef(null);
    const filtering = cat !== "all" || rhy !== "all" || !!q.trim();
    const clearAll = () => {
      setF({ q: "", cat: "all", rhy: "all" });
      setTimeout(() => {
        const i = tools.current && tools.current.querySelector("input");
        if (i) i.focus({ preventScroll: true });
      }, 0);
    };
    const ids = CPR_SHOWN.filter((k) => (cat === "all" || GS_GAMES[k].category === cat) && (rhy === "all" || gsRhythm(k) === rhy) && gsFind(q, k));
    const sel = cprSelection(gs);
    const cardRow = (title, ks) => ks.length ? /* @__PURE__ */ React$1.createElement("section", { className: "dc-sec" }, /* @__PURE__ */ React$1.createElement(DS.CardRow, { title, className: "gs-row4" }, ks.map((k) => /* @__PURE__ */ React$1.createElement(GsCard, { key: k, id: k })))) : null;
    return /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("div", { ref: tools }, /* @__PURE__ */ React$1.createElement(LbTools, null, /* @__PURE__ */ React$1.createElement(DS.SearchField, { label: "Search", placeholder: "Name", value: q, onChange: (e) => setQ(e.target.value) }), /* @__PURE__ */ React$1.createElement(LbChoice, { label: "Genre", value: cat, opts: [["all", "All games"], ...gsKinds().map((c) => [c, gsKind(c)])], onPick: setCat }), /* @__PURE__ */ React$1.createElement(LbChoice, { label: "Schedule", value: rhy, opts: [["all", "All games"], ...GS_RHYTHMS], onPick: setRhy }))), !filtering && /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("div", { className: "mcp-gpicks" }, CPR_PICKS.map(([k, l]) => /* @__PURE__ */ React$1.createElement(GsPick, { key: k, id: k, label: l }))), cardRow("Just added", sel.added), cardRow("Free to play", sel.free)), /* @__PURE__ */ React$1.createElement("section", { className: "dc-sec" }, /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-sec" }, "All games"), wait ? /* @__PURE__ */ React$1.createElement(GsPart, { label: "Loading games" }) : ids.length ? /* @__PURE__ */ React$1.createElement("div", { className: "mcp-gwall" }, ids.map((k) => /* @__PURE__ */ React$1.createElement(GsTile, { key: k, id: k, pass: cprLocked(gs, k) }))) : /* @__PURE__ */ React$1.createElement("div", { className: "gs-nomatch" }, /* @__PURE__ */ React$1.createElement("p", null, "Nothing matches that."), /* @__PURE__ */ React$1.createElement(DS.TextLink, { onClick: clearAll }, "Clear all"))));
  };
  const GsGames = () => {
    const gs = useGs();
    const [load, setLoad] = React$1.useState(gs.route.load || null);
    const fOf = (r, prevQ) => {
      const k = r.dcKeep || {};
      return { q: k.q != null ? k.q : prevQ, cat: k.cat || r.kind || "all", rhy: k.rhy || r.rhythm || "all" };
    };
    const [f, setF] = React$1.useState(() => fOf(gs.route, ""));
    React$1.useEffect(() => {
      setLoad(gs.route.load || null);
      setF((p) => fOf(gs.route, p.q));
    }, [gs.route]);
    React$1.useEffect(() => {
      gs.keep({ dcKeep: f });
    }, [f]);
    React$1.useEffect(() => {
      if (load !== "loading") return void 0;
      const t = setTimeout(() => setLoad(null), 1200);
      return () => clearTimeout(t);
    }, [load]);
    return /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("main", { className: "gs-wrap gs-main" }, /* @__PURE__ */ React$1.createElement("h1", { className: "gs-h1" }, "Discover"), load === "hold" || load === "loading" ? /* @__PURE__ */ React$1.createElement("div", { className: "gs-inplace" }, /* @__PURE__ */ React$1.createElement(GsSpin, null)) : load === "failed" ? /* @__PURE__ */ React$1.createElement(GsLoadFailed, { onRetry: () => setLoad(null) }) : /* @__PURE__ */ React$1.createElement(CprDiscoverBody, { f, setF })));
  };
  const PG = {};
  const pgRegister = (id, def) => {
    PG[id] = def;
  };
  const pgQuery = () => new URLSearchParams(window.location.search);
  const pgActive = () => {
    const id = pgQuery().get("pg");
    return id && PG[id] ? PG[id] : null;
  };
  const pgOption = (s, v) => s.options.find((o) => o.value === v) || s.options[0];
  const pgValue = (s) => pgOption(s, pgQuery().get(s.key)).value;
  const pgSubs = /* @__PURE__ */ new Set();
  const usePgSetting = (key) => {
    const [, bump] = React$1.useState(0);
    React$1.useEffect(() => {
      const f = () => bump((n) => n + 1);
      pgSubs.add(f);
      return () => pgSubs.delete(f);
    }, []);
    const def = pgActive();
    const s = def && def.settings.find((x) => x.key === key);
    return s ? pgValue(s) : null;
  };
  const pgOpen = (o, url, arriving) => {
    if (o.state) {
      const had = url.searchParams.get("state") === o.state;
      url.searchParams.set("state", o.state);
      if (!(arriving && had) && window.kitGoState) window.kitGoState(o.state);
    }
    if (o.go) pgPending = o.go;
  };
  let pgPending = null;
  const pgSet = (s, v) => {
    const url = new URL(window.location.href);
    url.searchParams.set(s.key, v);
    pgOpen(pgOption(s, v), url);
    window.history.replaceState(null, "", url);
    pgSubs.forEach((f) => f());
    if (isFitted()) fitForward(s.key, v);
  };
  window.pgSetFromParent = (key, v) => {
    var _a;
    const s = (_a = pgActive()) == null ? void 0 : _a.settings.find((x) => x.key === key);
    if (s) pgSet(s, v);
  };
  const PgPick = ({ s, v }) => {
    const [open, setOpen] = React$1.useState(false);
    const wrap = React$1.useRef(null);
    gsUseMenuDismiss(open, setOpen, wrap);
    return /* @__PURE__ */ React$1.createElement("div", { className: "pg-pick gs-menu-anchor", ref: wrap }, /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "pg-pick-btn", "aria-label": s.label + ": " + pgOption(s, v).label, "aria-expanded": open, "aria-haspopup": "menu", onClick: () => setOpen((o) => !o) }, pgOption(s, v).label), open && /* @__PURE__ */ React$1.createElement("div", { className: "gs-pop pg-pop", role: "menu", "aria-label": s.label }, s.options.map((o) => /* @__PURE__ */ React$1.createElement("button", { key: o.value, type: "button", role: "menuitemradio", "aria-checked": o.value === v, className: "gs-menu-item", onClick: () => {
      setOpen(false);
      pgSet(s, o.value);
    } }, o.label))));
  };
  const PgBar = () => {
    const def = pgActive();
    const [, bump] = React$1.useState(0);
    React$1.useEffect(() => {
      const f = () => bump((n) => n + 1);
      pgSubs.add(f);
      return () => pgSubs.delete(f);
    }, []);
    React$1.useEffect(() => {
      if (pgPending) {
        const f = pgPending;
        pgPending = null;
        f(window.gsApi);
      }
    });
    React$1.useEffect(() => {
      const url = new URL(window.location.href);
      def.settings.forEach((s) => pgOpen(pgOption(s, pgValue(s)), url, true));
      window.history.replaceState(null, "", url);
    }, []);
    const framed = isFramed();
    const fitted = useFit();
    return /* @__PURE__ */ React$1.createElement("header", { className: "gs-top pg-top", "aria-label": "Playground: " + def.title, ...framed ? { inert: "", "aria-hidden": "true" } : {} }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-wrap pg-top-in" }, /* @__PURE__ */ React$1.createElement("span", { className: "pg-title" }, def.title), def.settings.filter((s) => !s.when || pgValue(def.settings.find((x) => x.key === s.when.key)) === s.when.value).map((s) => {
      const v = pgValue(s);
      return /* @__PURE__ */ React$1.createElement("div", { key: s.key, className: "pg-set", role: "group", "aria-label": s.label }, /* @__PURE__ */ React$1.createElement("span", { className: "pg-label" }, s.label), /* @__PURE__ */ React$1.createElement(PgPick, { s, v }));
    }), /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "pg-fit-btn", "aria-pressed": fitted, onClick: () => setFit(!fitted) }, "Fit")));
  };
  const pgrPlay = (s) => {
    const ev = wdRead(s).events;
    const guesses = ev.filter((e) => e.kind === "guess");
    return { n: guesses.length, hint: ev.find((e) => e.kind === "hint") || null, won: !s.live && !s.loss, r: wdResult(s) };
  };
  const PgrBand = ({ p, lines }) => /* @__PURE__ */ React$1.createElement("div", { className: "dv7r-band pgr-band" }, /* @__PURE__ */ React$1.createElement("h2", { className: "dv7r-word is-" + p.r.tone }, p.r.word), (lines || []).filter(Boolean).map((l, i) => /* @__PURE__ */ React$1.createElement("p", { key: i, className: "dv7r-line" }, l)));
  const RING_R = 52;
  const RING_C = 2 * Math.PI * RING_R;
  const RING_SEG = RING_C / 6;
  const RING_GAP = 7;
  const PgrRing = ({ s, p, label }) => {
    const seg = (i) => i <= p.n ? p.won && i === p.n ? "win" : s.loss ? "lost" : "used" : "spare";
    return /* @__PURE__ */ React$1.createElement("div", { className: "pgr-ring", role: "img", "aria-label": p.n + (p.n === 1 ? " guess" : " guesses") + " of six" }, /* @__PURE__ */ React$1.createElement("svg", { viewBox: "0 0 128 128", "aria-hidden": "true" }, [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ React$1.createElement(
      "circle",
      {
        key: i,
        className: "is-" + seg(i),
        cx: "64",
        cy: "64",
        r: RING_R,
        strokeDasharray: RING_SEG - RING_GAP + " " + (RING_C - RING_SEG + RING_GAP),
        transform: "rotate(" + (-90 + (i - 1) * 60 + RING_GAP / RING_C * 180) + " 64 64)"
      }
    ))), /* @__PURE__ */ React$1.createElement("span", { className: "pgr-ring-n", "aria-hidden": "true" }, /* @__PURE__ */ React$1.createElement("b", null, p.n), !label && /* @__PURE__ */ React$1.createElement("span", null, p.n === 1 ? "guess" : "guesses")));
  };
  const PgrPlaces = ({ s, p }) => /* @__PURE__ */ React$1.createElement("div", { className: "pgr-places" + (p.hint ? "" : " is-none"), role: "img", "aria-label": p.hint ? "Hint: " + p.hint.text : s.live ? "Hint not used yet" : "No hint" }, /* @__PURE__ */ React$1.createElement("div", { className: "pgr-places-row", "aria-hidden": "true" }, [0, 1, 2, 3, 4].map((j) => p.hint && p.hint.pos === j ? /* @__PURE__ */ React$1.createElement("span", { key: j, className: "pgr-place is-hint" }, p.hint.letter) : /* @__PURE__ */ React$1.createElement("span", { key: j, className: "pgr-place" }))), !p.hint && /* @__PURE__ */ React$1.createElement("span", { className: "pgr-note", "aria-hidden": "true" }, s.live ? "Not used yet" : "None taken"));
  const PgrAnswer = ({ s }) => s.loss && s.answer ? /* @__PURE__ */ React$1.createElement("div", { className: "pgr-ans", role: "img", "aria-label": "The word was " + s.answer }, /* @__PURE__ */ React$1.createElement("span", { className: "pgr-cap", "aria-hidden": "true" }, "The word"), /* @__PURE__ */ React$1.createElement("div", { className: "pgr-ans-row", "aria-hidden": "true" }, s.answer.split("").map((ch, i) => /* @__PURE__ */ React$1.createElement("span", { key: i, className: "wd-t pgr-ans-t" }, ch)))) : null;
  const pgrFacts = (s, p) => [p.n + (p.n === 1 ? " guess" : " guesses"), p.hint ? "1 hint" : s.live ? "hint not used" : "no hint"];
  const PgrTop = ({ p, line }) => /* @__PURE__ */ React$1.createElement("div", { className: "dv7r-band" }, /* @__PURE__ */ React$1.createElement("h2", { className: "dv7r-word is-" + p.r.tone }, p.r.word), line && /* @__PURE__ */ React$1.createElement("p", { className: "dv7r-line" }, line));
  const Pgr6a = ({ s, lift }) => {
    const p = pgrPlay(s);
    return /* @__PURE__ */ React$1.createElement("section", { className: "dv2 pgr-card pgr-6a" + (lift ? " pgr-lift" : ""), "aria-label": "How it went" }, /* @__PURE__ */ React$1.createElement(PgrTop, { p }), /* @__PURE__ */ React$1.createElement("div", { className: "pgr-duo" }, /* @__PURE__ */ React$1.createElement("div", { className: "pgr-boardcol" }, /* @__PURE__ */ React$1.createElement(WdBoard, { s, guessesOnly: true })), /* @__PURE__ */ React$1.createElement("div", { className: "pgr-panel" }, /* @__PURE__ */ React$1.createElement("div", { className: "pgr-prow" }, /* @__PURE__ */ React$1.createElement("span", { className: "pgr-cap" }, "Guesses"), /* @__PURE__ */ React$1.createElement(PgrRing, { s, p, label: true })), /* @__PURE__ */ React$1.createElement("div", { className: "pgr-prow" }, /* @__PURE__ */ React$1.createElement("span", { className: "pgr-cap" }, "Hint"), /* @__PURE__ */ React$1.createElement(PgrPlaces, { s, p })), /* @__PURE__ */ React$1.createElement(PgrAnswer, { s }))));
  };
  const Pgr7a = ({ s }) => {
    const p = pgrPlay(s);
    return /* @__PURE__ */ React$1.createElement("section", { className: "dv2 pgr-card pgr-7a", "aria-label": "How it went" }, /* @__PURE__ */ React$1.createElement(PgrTop, { p, line: /* @__PURE__ */ React$1.createElement("span", { className: "pgr-facts" }, pgrFacts(s, p).map((f, i) => /* @__PURE__ */ React$1.createElement("span", { key: i }, f)), s.loss && s.answer && /* @__PURE__ */ React$1.createElement("span", null, "The word was ", /* @__PURE__ */ React$1.createElement("b", { className: "pgr-answ" }, s.answer))) }), /* @__PURE__ */ React$1.createElement("div", { className: "pgr-boardc" }, /* @__PURE__ */ React$1.createElement(WdBoard, { s })));
  };
  const Pgr7aBeside = ({ s }) => {
    const p = pgrPlay(s);
    return /* @__PURE__ */ React$1.createElement("section", { className: "dv2 pgr-card", "aria-label": "How it went" }, /* @__PURE__ */ React$1.createElement("div", { className: "pgr-split" }, /* @__PURE__ */ React$1.createElement("div", { className: "pgr-split-res" }, /* @__PURE__ */ React$1.createElement(PgrBand, { p, lines: [
      /* @__PURE__ */ React$1.createElement("span", { key: "f", className: "pgr-facts" }, pgrFacts(s, p).map((f, i) => /* @__PURE__ */ React$1.createElement("span", { key: i }, f))),
      s.loss && s.answer ? /* @__PURE__ */ React$1.createElement("span", { key: "w", className: "pgr-word" }, "The word was ", /* @__PURE__ */ React$1.createElement("b", null, s.answer)) : null
    ] })), /* @__PURE__ */ React$1.createElement("div", { className: "pgr-boardc" }, /* @__PURE__ */ React$1.createElement(WdBoard, { s }))));
  };
  const Pgr6aBeside = ({ s }) => {
    const p = pgrPlay(s);
    return /* @__PURE__ */ React$1.createElement("section", { className: "dv2 pgr-card", "aria-label": "How it went" }, /* @__PURE__ */ React$1.createElement("div", { className: "pgr-split" }, /* @__PURE__ */ React$1.createElement("div", { className: "pgr-split-res pgr-split-6" }, /* @__PURE__ */ React$1.createElement(PgrBand, { p }), /* @__PURE__ */ React$1.createElement("div", { className: "pgr-split-figs" }, /* @__PURE__ */ React$1.createElement("div", { className: "pgr-prow" }, /* @__PURE__ */ React$1.createElement("span", { className: "pgr-cap" }, "Guesses"), /* @__PURE__ */ React$1.createElement(PgrRing, { s, p, label: true })), /* @__PURE__ */ React$1.createElement("div", { className: "pgr-prow" }, /* @__PURE__ */ React$1.createElement("span", { className: "pgr-cap" }, "Hint"), /* @__PURE__ */ React$1.createElement(PgrPlaces, { s, p })))), /* @__PURE__ */ React$1.createElement("div", { className: "pgr-boardcol" }, /* @__PURE__ */ React$1.createElement(WdBoard, { s, guessesOnly: true }), /* @__PURE__ */ React$1.createElement(PgrAnswer, { s }))));
  };
  const PgrPicked = ({ s }) => /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement(Pgr6a, { s, lift: true }), /* @__PURE__ */ React$1.createElement(GsMoves, { s }));
  const PgrBody = ({ s }) => {
    const dir = usePgSetting("dir");
    if (dir === "canon") return /* @__PURE__ */ React$1.createElement(WdSessBody, { s });
    return /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, dir === "6a" ? /* @__PURE__ */ React$1.createElement(Pgr6a, { s }) : dir === "6a-lift" ? /* @__PURE__ */ React$1.createElement(Pgr6a, { s, lift: true }) : dir === "6a-beside" ? /* @__PURE__ */ React$1.createElement(Pgr6aBeside, { s }) : dir === "7a-beside" ? /* @__PURE__ */ React$1.createElement(Pgr7aBeside, { s }) : /* @__PURE__ */ React$1.createElement(Pgr7a, { s }), /* @__PURE__ */ React$1.createElement(GsMoves, { s }));
  };
  const initPlaygroundGuessResult = () => {
    GS_SESSIONS["pgr-word-nohint"] = {
      ...GS_SESSIONS["word-today"],
      number: 211,
      hints: 0,
      result: "Solved in 4 of 6",
      share: "Solved in 4 of 6",
      date: "Monday 5 October",
      lines: gsWordLines("STILL", ["CRANE", "SLATE", "STALL", "STILL"])
    };
    pgRegister("guess-result", { title: "Guess result", settings: [
      { key: "dir", label: "Direction", options: [{ value: "6a", label: "6a Ring" }, { value: "6a-lift", label: "6a Ring lifted" }, { value: "6a-beside", label: "6a beside" }, { value: "7a", label: "7a Short line" }, { value: "7a-beside", label: "7a beside" }, { value: "canon", label: "Canon" }] },
      { key: "play", label: "Play", options: [
        { value: "solved", label: "Solved in 3", state: "session-puzzle" },
        { value: "hard", label: "Solved in 5", state: "session-word-hard" },
        { value: "nohint", label: "No hint", state: "session-puzzle", go: (gs) => gs.go("session", { id: "pgr-word-nohint" }) },
        { value: "failed", label: "Failed", state: "session-word-failed" },
        { value: "live", label: "In progress", state: "session-word-in-progress" }
      ] }
    ] });
    GS_SESSION_BODY.word = pgActive() ? PgrBody : PgrPicked;
  };
  const WdNowResult = ({ s }) => {
    const r = wdResult(s);
    return r.tone === "live" ? /* @__PURE__ */ React$1.createElement("span", { className: "lb-big" }, /* @__PURE__ */ React$1.createElement(LbResult, { s: { kind: "live", label: "In progress" } })) : /* @__PURE__ */ React$1.createElement("p", { className: "gs-vd is-" + (r.tone === "ok" ? "ok" : "over") }, r.word);
  };
  const pgnHere = () => new URLSearchParams(window.location.search).get("pg") === "guess-now";
  const pgnPlay = (s) => {
    const ev = wdRead(s).events;
    const gsv = ev.filter((e) => e.kind === "guess");
    return { ev, n: gsv.length, last: gsv[gsv.length - 1], hint: ev.find((e) => e.kind === "hint") || null, won: !s.live && !s.loss };
  };
  const pgnTrail = (p) => [...p.ev.filter((e) => e !== p.last), ...Array.from({ length: 6 - p.n }, () => ({ kind: "empty" }))];
  const pgnSaid = (trail) => trail.map((e) => e.kind === "guess" ? wdSay(e) : e.kind === "hint" ? "Hint, " + e.text : "Not used").join(". ");
  const PgnTrail = ({ p }) => {
    const trail = pgnTrail(p);
    return /* @__PURE__ */ React$1.createElement("div", { className: "wd-trail", role: "img", "aria-label": pgnSaid(trail) }, trail.map((e, i) => /* @__PURE__ */ React$1.createElement(WdTr, { key: i, e })));
  };
  const PgnLast = ({ s, p, cls = "pgn-tiles" }) => {
    const ansSet = usePgSetting("ans");
    const ans = pgnHere() ? ansSet : "word";
    if (ans === "word" && s && s.loss && s.answer) return /* @__PURE__ */ React$1.createElement("div", { className: cls + " pgn-ans", role: "img", "aria-label": "The word was " + s.answer }, s.answer.split("").map((ch, j) => /* @__PURE__ */ React$1.createElement("span", { key: j, className: "wd-t pgn-ans-t", "aria-hidden": "true" }, ch)));
    return /* @__PURE__ */ React$1.createElement("div", { className: cls, role: "img", "aria-label": wdSay(p.last) }, p.last.word.split("").map((ch, j) => /* @__PURE__ */ React$1.createElement("span", { key: j, className: "wd-t is-" + p.last.marks[j], "aria-hidden": "true" }, ch)));
  };
  const PGN_RING_R = 52;
  const PGN_RING_C = 2 * Math.PI * PGN_RING_R;
  const PGN_RING_SEG = PGN_RING_C / 6;
  const PGN_RING_GAP = 7;
  const PgnRing = ({ s, p }) => {
    const seg = (i) => i <= p.n ? p.won && i === p.n ? "win" : s.loss ? "lost" : "used" : "spare";
    return /* @__PURE__ */ React$1.createElement("div", { className: "pgn-ring", role: "img", "aria-label": p.n + (p.n === 1 ? " guess" : " guesses") + " of six" }, /* @__PURE__ */ React$1.createElement("svg", { viewBox: "0 0 128 128", "aria-hidden": "true" }, [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ React$1.createElement(
      "circle",
      {
        key: i,
        className: "is-" + seg(i),
        cx: "64",
        cy: "64",
        r: PGN_RING_R,
        strokeDasharray: PGN_RING_SEG - PGN_RING_GAP + " " + (PGN_RING_C - PGN_RING_SEG + PGN_RING_GAP),
        transform: "rotate(" + (-90 + (i - 1) * 60 + PGN_RING_GAP / PGN_RING_C * 180) + " 64 64)"
      }
    ))), /* @__PURE__ */ React$1.createElement("span", { className: "pgn-ring-n", "aria-hidden": "true" }, p.n));
  };
  const PgnHintBox = ({ s, p }) => /* @__PURE__ */ React$1.createElement("div", { className: "pgn-hint", role: "img", "aria-label": p.hint ? "Hint: " + p.hint.text : s.live ? "Hint not used yet" : "No hint" }, /* @__PURE__ */ React$1.createElement("span", { className: "pgn-place" + (p.hint ? " is-hint" : ""), "aria-hidden": "true" }, p.hint ? p.hint.letter : ""), p.hint ? /* @__PURE__ */ React$1.createElement("span", { className: "pgn-cap is-label", "aria-hidden": "true" }, "Hint") : /* @__PURE__ */ React$1.createElement("span", { className: "pgn-note", "aria-hidden": "true" }, s.live ? "Not used yet" : "None taken"));
  const PgnHead = ({ number, s }) => /* @__PURE__ */ React$1.createElement("div", { className: "lb-top" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-xs" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-label" }, "TODAY"), /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-sec" }, "#" + number)), s && /* @__PURE__ */ React$1.createElement(WdNowResult, { s }));
  const PgnFresh = ({ c, dir }) => {
    const gs = useGs();
    const number = GS_SESSIONS[c.today].number;
    const p = { n: 0, hint: null, won: false };
    const empty = { loss: false, live: true };
    return /* @__PURE__ */ React$1.createElement("section", { className: "lb-card pgn pgn-" + dir }, /* @__PURE__ */ React$1.createElement(PgnHead, { number }), dir === "b-rows" ? /* @__PURE__ */ React$1.createElement("div", { className: "pgn-row" }, /* @__PURE__ */ React$1.createElement("p", { className: "pgn-line" }, "Five letters. Six guesses.")) : /* @__PURE__ */ React$1.createElement("div", { className: "pgn-row" }, /* @__PURE__ */ React$1.createElement("div", { className: "pgn-tiles", role: "img", "aria-label": "Five empty tiles" }, [0, 1, 2, 3, 4].map((j) => /* @__PURE__ */ React$1.createElement("span", { key: j, className: "wd-t is-empty", "aria-hidden": "true" }))), /* @__PURE__ */ React$1.createElement(PgnRing, { s: empty, p }), /* @__PURE__ */ React$1.createElement(PgnHintBox, { s: empty, p })), /* @__PURE__ */ React$1.createElement(LbActions, { label: "Play", onClick: () => gs.playReq({ kind: "edition", e: edList(gs, "word")[0] }), slot: c.next }));
  };
  const PgnA = ({ c, done, sid }) => {
    const gs = useGs();
    const s = GS_SESSIONS[sid];
    const p = React$1.useMemo(() => pgnPlay(s), [s]);
    return /* @__PURE__ */ React$1.createElement("section", { className: "lb-card wd-now pgn-a" }, /* @__PURE__ */ React$1.createElement("div", { className: "wd-now-in" }, /* @__PURE__ */ React$1.createElement("div", { className: "lb-top" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-xs" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-label" }, "TODAY"), /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-sec" }, "#" + s.number)), /* @__PURE__ */ React$1.createElement(WdNowResult, { s })), p.last && /* @__PURE__ */ React$1.createElement("div", { className: "wd-now-pic" }, /* @__PURE__ */ React$1.createElement("div", { className: "wd-now-line" }, /* @__PURE__ */ React$1.createElement(PgnTrail, { p }), /* @__PURE__ */ React$1.createElement(PgnLast, { s, p, cls: "wd-now-row" })))), /* @__PURE__ */ React$1.createElement(LbActions, { onClick: () => gs.go("session", { id: sid }), slot: c.next }));
  };
  const PgnB = ({ c, sid }) => {
    const gs = useGs();
    const s = GS_SESSIONS[sid];
    const p = React$1.useMemo(() => pgnPlay(s), [s]);
    return /* @__PURE__ */ React$1.createElement("section", { className: "lb-card pgn pgn-b-rows" }, /* @__PURE__ */ React$1.createElement(PgnHead, { number: s.number, s }), /* @__PURE__ */ React$1.createElement("div", { className: "pgn-row" }, /* @__PURE__ */ React$1.createElement(PgnTrail, { p }), /* @__PURE__ */ React$1.createElement(PgnLast, { s, p }), /* @__PURE__ */ React$1.createElement("div", { className: "pgn-facts" }, /* @__PURE__ */ React$1.createElement("span", null, p.n + " of 6 guesses"), /* @__PURE__ */ React$1.createElement("span", null, p.hint ? "1 hint" : s.live ? "Hint not used" : "No hint"))), /* @__PURE__ */ React$1.createElement(LbActions, { onClick: () => gs.go("session", { id: sid }), slot: c.next }));
  };
  const PgnC = ({ c, sid }) => {
    const gs = useGs();
    const s = GS_SESSIONS[sid];
    const p = React$1.useMemo(() => pgnPlay(s), [s]);
    return /* @__PURE__ */ React$1.createElement("section", { className: "lb-card pgn pgn-c-ring" }, /* @__PURE__ */ React$1.createElement(PgnHead, { number: s.number, s }), /* @__PURE__ */ React$1.createElement("div", { className: "pgn-row" }, /* @__PURE__ */ React$1.createElement(PgnLast, { s, p }), /* @__PURE__ */ React$1.createElement(PgnRing, { s, p }), /* @__PURE__ */ React$1.createElement(PgnHintBox, { s, p })), /* @__PURE__ */ React$1.createElement(LbActions, { onClick: () => gs.go("session", { id: sid }), slot: c.next }));
  };
  const PgnD = ({ c, sid }) => {
    const gs = useGs();
    const s = GS_SESSIONS[sid];
    const p = React$1.useMemo(() => pgnPlay(s), [s]);
    return /* @__PURE__ */ React$1.createElement("section", { className: "lb-card wd-now pgn-a pgn-d" }, /* @__PURE__ */ React$1.createElement("div", { className: "wd-now-in" }, /* @__PURE__ */ React$1.createElement("div", { className: "lb-top" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-xs" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-label" }, "TODAY"), /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-sec" }, "#" + s.number)), /* @__PURE__ */ React$1.createElement(WdNowResult, { s })), p.last && /* @__PURE__ */ React$1.createElement("div", { className: "wd-now-pic" }, /* @__PURE__ */ React$1.createElement("div", { className: "wd-now-line" }, /* @__PURE__ */ React$1.createElement(PgnLast, { s, p, cls: "wd-now-row" }), /* @__PURE__ */ React$1.createElement(PgnRing, { s, p }), /* @__PURE__ */ React$1.createElement(PgnHintBox, { s, p })))), /* @__PURE__ */ React$1.createElement(LbActions, { onClick: () => gs.go("session", { id: sid }), slot: c.next }));
  };
  const PgnDx = ({ c, sid, v, vc, fresh }) => {
    const gs = useGs();
    const s0 = GS_SESSIONS[sid];
    const s = fresh ? { ...s0, live: true, loss: false } : s0;
    const p = React$1.useMemo(() => fresh ? { n: 0, hint: null, won: false, last: { word: "     ", marks: ["empty", "empty", "empty", "empty", "empty"] } } : pgnPlay(s), [s, fresh]);
    const facts = /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement(PgnRing, { s, p }), /* @__PURE__ */ React$1.createElement(PgnHintBox, { s, p }));
    return /* @__PURE__ */ React$1.createElement("section", { className: "lb-card pgn-dx pgn-" + v + (vc ? " pgn-vc-" + vc : "") }, /* @__PURE__ */ React$1.createElement("div", { className: "pgn-dx-body" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-stack-xs pgn-dx-head" }, /* @__PURE__ */ React$1.createElement("span", { className: "gs-label" }, "TODAY"), /* @__PURE__ */ React$1.createElement("h2", { className: "mcp-t-sec" }, "#" + s.number)), /* @__PURE__ */ React$1.createElement("div", { className: "pgn-dx-res" }, !fresh && /* @__PURE__ */ React$1.createElement(WdNowResult, { s })), v === "d3" ? /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("div", { className: "pgn-dx-pic" }, /* @__PURE__ */ React$1.createElement(PgnLast, { s, p })), /* @__PURE__ */ React$1.createElement("div", { className: "pgn-dx-panel" }, facts)) : v === "d2" ? /* @__PURE__ */ React$1.createElement("div", { className: "pgn-dx-pic" }, /* @__PURE__ */ React$1.createElement(PgnLast, { s, p }), /* @__PURE__ */ React$1.createElement("div", { className: "pgn-dx-facts" }, facts)) : /* @__PURE__ */ React$1.createElement("div", { className: "pgn-dx-pic" }, /* @__PURE__ */ React$1.createElement(PgnLast, { s, p }), facts)), fresh ? /* @__PURE__ */ React$1.createElement(LbActions, { label: "Play", onClick: () => gs.playReq({ kind: "edition", e: edList(gs, "word")[0] }), slot: c.next }) : /* @__PURE__ */ React$1.createElement(LbActions, { onClick: () => gs.go("session", { id: sid }), slot: c.next }));
  };
  const PgnCard = ({ children, ...props }) => {
    const dirSet = usePgSetting("dir");
    const dir = pgnHere() ? dirSet : "d2";
    useGs();
    if (dir === "canon") return children;
    const VC = { d2a: "tiles", d2b: "room", d2c: "big" };
    if (VC[dir]) return /* @__PURE__ */ React$1.createElement(PgnDx, { c: props.c, sid: props.none ? props.c.today : props.done ? props.c.today : props.c.liveSid, v: "d2", vc: VC[dir], fresh: !!props.none });
    if (props.none && ["d1", "d2", "d3"].includes(dir)) return /* @__PURE__ */ React$1.createElement(PgnDx, { c: props.c, sid: props.c.today, v: dir, fresh: true });
    if (props.none) return /* @__PURE__ */ React$1.createElement(PgnFresh, { c: props.c, dir });
    if (dir === "a-space") return /* @__PURE__ */ React$1.createElement(PgnA, { ...props, sid: props.done ? props.c.today : props.c.liveSid });
    if (dir === "d-c-in-a") return /* @__PURE__ */ React$1.createElement(PgnD, { c: props.c, sid: props.done ? props.c.today : props.c.liveSid });
    if (["d1", "d2", "d3"].includes(dir)) return /* @__PURE__ */ React$1.createElement(PgnDx, { c: props.c, sid: props.done ? props.c.today : props.c.liveSid, v: dir });
    const sid = props.done ? props.c.today : props.c.liveSid;
    return dir === "b-rows" ? /* @__PURE__ */ React$1.createElement(PgnB, { c: props.c, sid }) : /* @__PURE__ */ React$1.createElement(PgnC, { c: props.c, sid });
  };
  const played = (ed) => (gs) => gs.setReview({ today: "played", week: "done", ed });
  const initPlaygroundGuessNow = () => {
    pgRegister("guess-now", { title: "Guess now card", settings: [
      { key: "dir", label: "Direction", options: [{ value: "a-space", label: "A Space" }, { value: "b-rows", label: "B Second row" }, { value: "c-ring", label: "C Ring and places" }, { value: "d-c-in-a", label: "D C in A spacing" }, { value: "d1", label: "D1 Centred on the card" }, { value: "d2", label: "D2 Tiles over facts" }, { value: "d2a", label: "D2a Tiles centred" }, { value: "d2b", label: "D2b Taller card" }, { value: "d2c", label: "D2c Taller, big tiles" }, { value: "d3", label: "D3 Facts panel" }, { value: "canon", label: "Canon" }] },
      { key: "play", label: "Play", options: [
        { value: "solved", label: "Solved in 3", state: "library-word", go: played(null) },
        { value: "hard", label: "Solved in 5", state: "library-word", go: played("hard") },
        { value: "failed", label: "Failed", state: "library-word", go: played("failed") },
        { value: "live", label: "In progress", state: "library-word-in-progress" },
        { value: "fresh", label: "Not yet played", state: "free-not-played-today" }
      ] },
      { key: "ans", label: "On a loss", options: [{ value: "last", label: "Last guess" }, { value: "word", label: "The word" }] }
    ] });
    GS_NOW.word = PgnCard;
  };
  const chnRead = (s) => {
    const P = s.play;
    const last = P.w.length - 1;
    const w = P.w.map((word, i) => {
      const end = i === 0 || i === last;
      return { i, word, state: end ? "end" : "hidden", shown: end ? word.length : 1 };
    });
    const g = P.p.map(([guess, k, near], j) => {
      const x = w[k];
      let res;
      if (guess === x.word) {
        res = "right";
        x.state = "found";
      } else {
        x.shown += 1;
        res = x.shown >= x.word.length ? "given" : near ? "near" : "wrong";
        if (res === "given") {
          x.state = "given";
          x.shown = x.word.length;
        }
      }
      return { n: j + 1, res };
    });
    const r = s.live ? { tone: "live", word: "In progress" } : w.some((x) => x.state === "given") ? { tone: "bad", word: "Failed" } : { tone: "ok", word: "Solved" };
    return { w, g, r, long: Math.max(...w.map((x) => x.state === "hidden" ? x.shown + 1 : x.word.length)) };
  };
  const ChnTiles = ({ x }) => x.state === "hidden" ? /* @__PURE__ */ React$1.createElement("div", { className: "chn-row", role: "img", "aria-label": "Starts " + x.word.slice(0, x.shown) }, x.word.slice(0, x.shown).split("").map((ch, j) => /* @__PURE__ */ React$1.createElement("span", { key: j, className: "wd-t chn-t is-shown", "aria-hidden": "true" }, ch)), /* @__PURE__ */ React$1.createElement("span", { className: "wd-t chn-t is-more", "aria-hidden": "true" })) : /* @__PURE__ */ React$1.createElement("div", { className: "chn-row", role: "img", "aria-label": x.word + (x.state === "given" ? ", given away" : "") }, x.word.split("").map((ch, j) => /* @__PURE__ */ React$1.createElement(
    "span",
    {
      key: j,
      "aria-hidden": "true",
      className: "wd-t chn-t is-" + (x.state === "end" ? "end" : x.state === "given" ? "given" : j < x.shown ? "shown" : "found")
    },
    ch
  )));
  const ChnJoint = () => /* @__PURE__ */ React$1.createElement("div", { className: "chn-joint", "aria-hidden": "true" }, /* @__PURE__ */ React$1.createElement("svg", { width: "16", height: "22", viewBox: "0 0 16 22" }, /* @__PURE__ */ React$1.createElement("rect", { x: "1.5", y: "1.5", width: "8", height: "12", rx: "4" }), /* @__PURE__ */ React$1.createElement("rect", { x: "6.5", y: "8.5", width: "8", height: "12", rx: "4" })));
  const CHN_W = 16;
  const CHN_H = 30;
  const CHN_STEP = CHN_H + 8;
  const CHN_P = 2 * (CHN_H - CHN_W) + Math.PI * CHN_W;
  const CHN_GAP = { wrong: 14, near: 6, given: 8 };
  const chnDash = (res) => res === "right" ? void 0 : res === "given" ? CHN_P / 2 - CHN_GAP.given + " " + CHN_GAP.given : CHN_P - CHN_GAP[res] + " " + CHN_GAP[res];
  const chnOffset = (res, across) => res === "right" ? void 0 : CHN_P - CHN_GAP[res] / 2 - (across ? (CHN_H - CHN_W) / 2 : Math.PI * CHN_W / 4 + (CHN_H - CHN_W) / 2);
  const ChnLoop = ({ res, x, y, across }) => /* @__PURE__ */ React$1.createElement(
    "rect",
    {
      x,
      y,
      width: across ? CHN_H : CHN_W,
      height: across ? CHN_W : CHN_H,
      rx: CHN_W / 2,
      className: "chn-loop is-" + res,
      strokeDasharray: chnDash(res),
      strokeDashoffset: chnOffset(res, across)
    }
  );
  const ChnChain = ({ g, across }) => {
    const len = 8 + (g.length - 1) * CHN_STEP + CHN_H;
    return across ? /* @__PURE__ */ React$1.createElement("svg", { className: "chn-chain is-across", width: len, height: "46", viewBox: "0 0 " + len + " 46", style: { "--cw": len, "--ch": 46 }, "aria-hidden": "true" }, g.slice(1).map((t, i) => /* @__PURE__ */ React$1.createElement("line", { key: "b" + i, className: "chn-bar", x1: 4 + i * CHN_STEP + CHN_H, y1: 4 + CHN_W / 2, x2: 4 + (i + 1) * CHN_STEP, y2: 4 + CHN_W / 2 })), g.map((t, i) => /* @__PURE__ */ React$1.createElement(ChnLoop, { key: i, res: t.res, across: true, x: 4 + i * CHN_STEP, y: 4 })), g.map((t, i) => /* @__PURE__ */ React$1.createElement("text", { key: "n" + i, x: 4 + i * CHN_STEP + CHN_H / 2, y: "42", textAnchor: "middle" }, t.n))) : /* @__PURE__ */ React$1.createElement("svg", { className: "chn-chain is-down", width: "56", height: len, viewBox: "0 0 56 " + len, style: { "--cw": 56, "--ch": len }, "aria-hidden": "true" }, g.slice(1).map((t, i) => /* @__PURE__ */ React$1.createElement("line", { key: "b" + i, className: "chn-bar", x1: 32 + CHN_W / 2, y1: 4 + i * CHN_STEP + CHN_H, x2: 32 + CHN_W / 2, y2: 4 + (i + 1) * CHN_STEP })), g.map((t, i) => /* @__PURE__ */ React$1.createElement(ChnLoop, { key: i, res: t.res, x: 32, y: 4 + i * CHN_STEP })), g.map((t, i) => /* @__PURE__ */ React$1.createElement("text", { key: "n" + i, x: "20", y: 4 + i * CHN_STEP + CHN_H / 2 + 4, textAnchor: "end" }, t.n)));
  };
  const CHN_KINDS = [["right", "Right"], ["wrong", "Wrong"], ["near", "Near miss"], ["given", "Given away"]];
  const ChnGuesses = ({ g }) => {
    const kinds = CHN_KINDS.map(([k, label]) => [k, label, g.filter((t) => t.res === k).length]).filter((x) => x[2] > 0);
    return /* @__PURE__ */ React$1.createElement("div", { className: "chn-guesses", role: "img", "aria-label": g.length + (g.length === 1 ? " guess: " : " guesses: ") + kinds.map((x) => x[2] + " " + x[1].toLowerCase()).join(", ") }, /* @__PURE__ */ React$1.createElement(ChnChain, { g, across: true }), /* @__PURE__ */ React$1.createElement(ChnChain, { g }), /* @__PURE__ */ React$1.createElement("ul", { className: "chn-key", "aria-hidden": "true" }, kinds.map(([k, label, n]) => /* @__PURE__ */ React$1.createElement("li", { key: k }, /* @__PURE__ */ React$1.createElement("svg", { width: "12", height: "20", viewBox: "0 0 20 34" }, /* @__PURE__ */ React$1.createElement(ChnLoop, { res: k, x: 2, y: 2 })), label, " ", /* @__PURE__ */ React$1.createElement("b", null, n)))));
  };
  const ChnSessBody = ({ s }) => {
    if (!s.play) return s.lines.length ? /* @__PURE__ */ React$1.createElement(GsMoves, { s }) : null;
    const p = chnRead(s);
    return /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("section", { className: "dv2 pgr-card pgr-6a pgr-lift chn-card", style: { "--chn-n": p.long, "--chn-rows": p.w.length }, "aria-label": "How it went" }, /* @__PURE__ */ React$1.createElement(PgrTop, { p }), /* @__PURE__ */ React$1.createElement("div", { className: "pgr-duo" }, /* @__PURE__ */ React$1.createElement("div", { className: "pgr-boardcol" }, /* @__PURE__ */ React$1.createElement("div", { className: "chn-board" }, p.w.map((x, i) => /* @__PURE__ */ React$1.createElement(React$1.Fragment, { key: i }, /* @__PURE__ */ React$1.createElement(ChnTiles, { x }), i < p.w.length - 1 && /* @__PURE__ */ React$1.createElement(ChnJoint, null))))), /* @__PURE__ */ React$1.createElement("div", { className: "pgr-panel chn-panel" }, /* @__PURE__ */ React$1.createElement("div", { className: "pgr-prow" }, /* @__PURE__ */ React$1.createElement("span", { className: "pgr-cap" }, "Guesses"), /* @__PURE__ */ React$1.createElement(ChnGuesses, { g: p.g }))))), /* @__PURE__ */ React$1.createElement(GsMoves, { s }));
  };
  const initGsChain = () => {
    GS_SESSION_BODY.chain = ChnSessBody;
  };
  const { useState, useEffect, useRef } = React$1;
  let GS_REVIEW_DEFAULT;
  let GS_USER_DEFAULT;
  let GS_SUB_DEFAULT;
  let GS_BARE;
  let GS_LISTING;
  let GS_FOOTER;
  let GS_SIGNED_IN_ONLY;
  let GS_GUARDED;
  const gsSignInFor = (r) => ({ name: "signin", next: { ...r, prev: void 0, next: void 0 } });
  let GS_AUTH_ONLY;
  let GS_ROUTES;
  const gsWithout = (list, r) => list.includes(r.name) && r.page !== "record";
  const GsScreen = ({ name }) => {
    const More = GS_MORE_SCREENS && GS_MORE_SCREENS[name];
    if (More) return /* @__PURE__ */ React$1.createElement(More, null);
    switch (name) {
      case "home":
        return /* @__PURE__ */ React$1.createElement(GsHome, null);
      case "signup":
        return /* @__PURE__ */ React$1.createElement(GsSignUp, null);
      case "signin":
        return /* @__PURE__ */ React$1.createElement(GsSignIn, null);
      case "verify":
        return /* @__PURE__ */ React$1.createElement(GsVerify, null);
      case "username":
        return /* @__PURE__ */ React$1.createElement(GsUsername, null);
      case "recover":
        return /* @__PURE__ */ React$1.createElement(GsRecover, null);
      case "returning":
        return /* @__PURE__ */ React$1.createElement(GsReturning, null);
      case "connect":
        return /* @__PURE__ */ React$1.createElement(GsConnect, null);
      case "games":
        return /* @__PURE__ */ React$1.createElement(GsGames, null);
      case "library":
        return /* @__PURE__ */ React$1.createElement(GsLibrary, null);
      case "delve":
        return /* @__PURE__ */ React$1.createElement(GsDelve, null);
      case "word":
        return /* @__PURE__ */ React$1.createElement(GsWord, null);
      case "groups":
        return /* @__PURE__ */ React$1.createElement(GsGroups, null);
      case "mystery":
        return /* @__PURE__ */ React$1.createElement(GsMystery, null);
      case "where":
        return /* @__PURE__ */ React$1.createElement(GsWhere, null);
      case "chain":
        return /* @__PURE__ */ React$1.createElement(GsChain, null);
      case "salvage":
        return /* @__PURE__ */ React$1.createElement(GsSalvage, null);
      case "escape":
        return /* @__PURE__ */ React$1.createElement(GsEscape, null);
      case "casebook":
        return /* @__PURE__ */ React$1.createElement(GsCasebook, null);
      case "hunter":
        return /* @__PURE__ */ React$1.createElement(GsHunter, null);
      case "barrow":
        return /* @__PURE__ */ React$1.createElement(GsBarrow, null);
      case "session":
        return /* @__PURE__ */ React$1.createElement(GsSession, null);
      case "history":
        return /* @__PURE__ */ React$1.createElement(GsHistory, null);
      case "pass":
        return /* @__PURE__ */ React$1.createElement(GsPass, null);
      case "subscribe":
        return /* @__PURE__ */ React$1.createElement(GsSubscribe, null);
      case "checkout":
        return /* @__PURE__ */ React$1.createElement(GsCheckout, null);
      case "update-card":
        return /* @__PURE__ */ React$1.createElement(GsUpdateCard, null);
      case "account":
        return /* @__PURE__ */ React$1.createElement(GsAccount, null);
      case "legal":
        return /* @__PURE__ */ React$1.createElement(GsLegal, null);
      case "loading":
        return /* @__PURE__ */ React$1.createElement(GsFullLoader, null);
      case "offline":
        return /* @__PURE__ */ React$1.createElement(GsOffline, null);
      case "directory-claude":
        return DlClaudeListing ? /* @__PURE__ */ React$1.createElement(DlClaudeListing, null) : null;
      case "directory-chatgpt":
        return DlChatGptListing ? /* @__PURE__ */ React$1.createElement(DlChatGptListing, null) : null;
      default:
        return /* @__PURE__ */ React$1.createElement(GsNotFound, null);
    }
  };
  let GS_ARRIVES;
  const GsArrival = ({ name, quick }) => {
    const gs = useGs();
    const r = gs.route;
    const held = r.hold === "page";
    const skip = quick || !GS_ARRIVES.includes(name) || name === "games" && !!r.load;
    const [ready, setReady] = useState(skip && !held);
    useEffect(() => {
      if (ready || held) return void 0;
      const t = setTimeout(() => setReady(true), GS_LOAD_MS);
      return () => clearTimeout(t);
    }, []);
    if (ready) return /* @__PURE__ */ React$1.createElement(GsScreen, { name });
    return /* @__PURE__ */ React$1.createElement("main", { className: "gs-wrap gs-main", "aria-busy": "true" }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-inplace", style: { minHeight: "60vh" } }, /* @__PURE__ */ React$1.createElement(GsSpin, null)));
  };
  const KitPhoneBars = () => /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("div", { className: "kit-phone-status", "aria-hidden": "true" }, /* @__PURE__ */ React$1.createElement("span", null, "9:41"), /* @__PURE__ */ React$1.createElement("span", { className: "kit-phone-island" }), /* @__PURE__ */ React$1.createElement("svg", { width: "27", height: "13", viewBox: "0 0 27 13", fill: "none" }, /* @__PURE__ */ React$1.createElement("rect", { x: "0.5", y: "0.5", width: "23", height: "12", rx: "3.5", stroke: "currentColor", opacity: "0.4" }), /* @__PURE__ */ React$1.createElement("rect", { x: "2", y: "2", width: "20", height: "9", rx: "2", fill: "currentColor" }), /* @__PURE__ */ React$1.createElement("path", { d: "M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z", fill: "currentColor", opacity: "0.4" }))), /* @__PURE__ */ React$1.createElement("div", { className: "kit-phone-home", "aria-hidden": "true" }));
  const KitApp = () => {
    const fitted = useFit();
    const [layout, setLayout] = useState("auto");
    const [platform, setPlatform] = useState("web");
    const isApp = platform === "app";
    const forcedMobile = layout === "mobile" || isApp;
    const [route, setRoute] = useState({ name: "home" });
    const [signedIn, setSignedIn] = useState(false);
    const [sub, setSubState] = useState(GS_SUB_DEFAULT);
    const [user, setUserState] = useState(GS_USER_DEFAULT);
    const [provider, setProvider] = useState("email");
    const [choice, setChoice] = useState("yearly");
    const [connected, setConnected] = useState(false);
    const [review, setReviewState] = useState(GS_REVIEW_DEFAULT);
    const [playing, setPlaying] = useState(null);
    const [width, setWidth] = useState(() => window.innerWidth);
    const rootRef = useRef(null);
    const view = !signedIn ? "out" : GS_SUB_HOLDS.includes(sub.status) ? "pass" : "free";
    const viewRef = useRef(view);
    viewRef.current = view;
    const land = (r, v) => {
      if (v !== "out" && (GS_AUTH_ONLY.includes(r.name) || r.name === "home")) return { name: "games" };
      if (v === "out" && GS_GUARDED.includes(r.name)) return gsSignInFor(r);
      if (v === "out" && GS_SIGNED_IN_ONLY.includes(r.name)) return { name: "home" };
      if (v === "pass" && (r.name === "checkout" || r.name === "subscribe")) return { name: "account" };
      return r;
    };
    const stack = useRef([{ name: "home" }]);
    const idx = useRef(0);
    const backNav = useRef(false);
    useEffect(() => {
      try {
        window.history.replaceState({ ...window.history.state || {}, gsIdx: 0 }, "");
      } catch (e) {
      }
      const onPop = (e) => {
        const i = e.state && e.state.gsIdx;
        if (typeof i === "number" && stack.current[i]) {
          const r = land(stack.current[i], viewRef.current);
          stack.current[i] = r.reopen ? { ...r, reopen: null } : r;
          idx.current = i;
          backNav.current = true;
          setPlaying(r.reopen || null);
          setRoute(stack.current[i]);
        }
      };
      window.addEventListener("popstate", onPop);
      return () => window.removeEventListener("popstate", onPop);
    }, []);
    const go = (name, extra, asView) => {
      const r0 = { name, ...extra || {} };
      const r = asView === false ? r0 : land(r0, asView || view);
      const cur = stack.current[idx.current];
      if (asView !== false && cur) r.prev = { name: cur.name, page: cur.page || null };
      idx.current += 1;
      backNav.current = false;
      stack.current = stack.current.slice(0, idx.current).concat([r]);
      try {
        window.history.pushState({ gsIdx: idx.current }, "");
      } catch (e) {
      }
      setPlaying(null);
      setRoute(r);
      setTimeout(gsScrollTop, 0);
    };
    const setReview = (patch) => setReviewState((r) => ({ ...r, ...patch }));
    const setSub = (patch) => setSubState((s) => ({ ...s, ...patch }));
    const setUser = (patch) => setUserState((u) => ({ ...u, ...patch }));
    const setView = (v) => {
      if (v === "out") {
        setSignedIn(false);
        return;
      }
      setSignedIn(true);
      if (v === "free") setSubState({ ...GS_SUB_DEFAULT });
      if (v === "pass") setSubState({ ...GS_SUB_DEFAULT, status: "active", hadPass: true });
    };
    const reset = () => {
      setSignedIn(false);
      setSubState(GS_SUB_DEFAULT);
      setUserState(GS_USER_DEFAULT);
      setProvider("email");
      setChoice("yearly");
      setConnected(false);
      setReviewState(GS_REVIEW_DEFAULT);
      go("home", null, "out");
    };
    const gs = {
      route,
      view,
      sub,
      user,
      provider,
      choice,
      connected,
      review,
      playing,
      width,
      narrow: width < 640,
      isApp,
      go,
      setConnected,
      setReview,
      setView,
      setSub,
      setUser,
      setProvider,
      setChoice,
      // keep: write a page's own state into its history entry, so browser Back returns it as it was left.
      keep: (patch) => {
        const i = idx.current;
        stack.current[i] = { ...stack.current[i], ...patch };
      },
      // The preview frame can swallow history.back() with no popstate; if nothing moved, step the stack ourselves.
      back: () => {
        const from = idx.current;
        if (from < 1) return;
        try {
          window.history.back();
        } catch (e) {
        }
        setTimeout(() => {
          if (idx.current !== from) return;
          const i = from - 1;
          const r = land(stack.current[i], viewRef.current);
          stack.current[i] = r;
          idx.current = i;
          backNav.current = true;
          setPlaying(null);
          setRoute(r);
        }, 120);
      },
      goHow: () => go("connect"),
      howFromPlay: () => {
        stack.current[idx.current] = { ...stack.current[idx.current], reopen: playing };
        go("connect");
      },
      startFree: () => view === "out" ? go("signup") : go("games"),
      signOut: () => {
        setSignedIn(false);
        go("home", null, "out");
      },
      // Each view has its own home: signed out is `home`, signed in is `games`. Switching views swaps one for the other.
      // After signing in, and from Home or an auth screen on the demo bar, every player lands on Library.
      setDemoView: (v) => {
        setView(v);
        if (v === "out" && GS_GUARDED.includes(route.name)) go("signin", gsSignInFor(route), "out");
        else if (v === "out" && (GS_SIGNED_IN_ONLY.includes(route.name) || route.name === "games" && view !== "out")) go("home", null, "out");
        else if (v !== "out" && (route.name === "home" || GS_AUTH_ONLY.includes(route.name))) go("library", null, v);
      },
      // Every play control opens the play dialog with its prompt (gs-connect.jsx). The store can't know whether the AI is connected.
      play: (name) => setPlaying(gsPlayReq(gs, name)),
      playReq: (req) => setPlaying(req),
      closePlay: () => setPlaying(null),
      // Billing needs an account: signed out signs up first, then goes to checkout.
      // A Pass holder is sent to Account (land), so no second purchase starts.
      getPass: () => view === "out" ? go("signup", { next: "checkout" }) : go("checkout"),
      // An account exists only once it has a username, so the username always comes before any payment page.
      // Email: the username is on the sign-up form and the account is made when the email is verified.
      // Google or Apple: the provider returns, then Your username (no code); the account is made there.
      // A new account: names from the email form (a provider supplies its own), the username locked for 30 days from today, nothing played.
      accountMade: (name, how, next, names) => {
        setSignedIn(true);
        setProvider(how || "email");
        setConnected(false);
        setUser({ username: name, locked: true, since: GS_DAY0.getTime(), fresh: true, ...names && names.first ? { first: names.first, last: names.last } : {} });
        go(next === "checkout" ? "checkout" : "connect", null, "free");
      },
      afterCheckout: () => go("subscribe"),
      // Back from checkout's "Cancel and return" returns to the subscribe page with the plan still chosen (MCPG-012 EF-01).
      // next: where sign-in returns: a route name (the subscribe page, when sign-in started from its sign-up route), or the guarded page asked for.
      signedIn: (how, next) => {
        setSignedIn(true);
        setProvider(how || "email");
        setConnected(true);
        setUser({ fresh: false });
        const n = next && typeof next === "object" ? next : { name: next || "library" };
        go(n.name, n, "free");
      },
      paid: () => {
        const months = GS_PLAN[choice].months;
        setSubState({
          ...GS_SUB_DEFAULT,
          status: "active",
          plan: choice,
          hadPass: true,
          renew: gsAddMonths(GS_DAY0, months).getTime()
        });
        go("pass", null, "pass");
      },
      deleteAccount: () => {
        setSignedIn(false);
        setSubState(GS_SUB_DEFAULT);
        setConnected(false);
        go("signin", null, "out");
      }
    };
    window.gsApi = gs;
    const [landing, setLanding] = useState(() => kitResolveState ? kitResolveState() : null);
    const { byId: STATE_BY_ID, groups: STATE_GROUPS } = buildStates ? buildStates({ reset, setView, setConnected, setReview, go: (n, e) => go(n, e, false), setSub, setProvider, setChoice, setUser, setPlatform }) : { byId: {}, groups: [] };
    const goState = (id) => {
      const s = STATE_BY_ID[id];
      if (s) {
        s.go();
        setLanding(null);
      }
    };
    window.kitGoState = goState;
    const resetAndShow = buildStates && (() => {
      reset();
      setLanding(null);
    });
    const deepLinked = useRef(false);
    useEffect(() => {
      if (deepLinked.current || !landing || landing.kind !== "state") return;
      const st = STATE_BY_ID[landing.id];
      if (!st) return;
      deepLinked.current = true;
      st.go();
    }, [landing]);
    const StatesIndexView = StatesIndex;
    const showIndex = !!StatesIndexView && !!landing && (landing.kind === "index" || landing.kind === "unresolved");
    useEffect(() => {
      const el = rootRef.current;
      if (!el || !window.ResizeObserver) return void 0;
      const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
      ro.observe(el);
      return () => ro.disconnect();
    }, [forcedMobile, showIndex]);
    const Cand = window.KitCandidate || null;
    if (Cand && Cand.bind) Cand.bind(gs);
    const appTree = /* @__PURE__ */ React$1.createElement(GsCtx.Provider, { value: gs }, /* @__PURE__ */ React$1.createElement("div", { className: "gs-root" + (fitted ? " fitted" : ""), ref: rootRef }, GS_ROUTES.includes(route.name) && !gsWithout(GS_BARE, route) && (pgActive() ? /* @__PURE__ */ React$1.createElement(PgBar, null) : !fitted && /* @__PURE__ */ React$1.createElement(GsTopBar, null)), fitted ? /* @__PURE__ */ React$1.createElement(FitView, null) : /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, Cand && Cand.Screen ? /* @__PURE__ */ React$1.createElement(Cand.Screen, { api: gs }) : /* @__PURE__ */ React$1.createElement(GsArrival, { key: idx.current, name: route.name, quick: backNav.current }), (GS_FOOTER.includes(route.name) || !GS_ROUTES.includes(route.name)) && /* @__PURE__ */ React$1.createElement(GsFooter, null), /* @__PURE__ */ React$1.createElement("div", { id: "gs-announce", className: "gs-vh", role: "status", "aria-live": "polite" }), !gsWithout(GS_LISTING, route) && /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement(GsPlayPopup, null), /* @__PURE__ */ React$1.createElement(GsDemoBar, null)))));
    return /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, showIndex ? /* @__PURE__ */ React$1.createElement(StatesIndexView, { reason: landing, groups: STATE_GROUPS, onGo: goState, onDismiss: () => setLanding(null) }) : forcedMobile ? /* @__PURE__ */ React$1.createElement("div", { className: "kit-stage" }, /* @__PURE__ */ React$1.createElement("div", { className: "kit-phone" }, /* @__PURE__ */ React$1.createElement("div", { className: "kit-phone-clip", "data-app": isApp ? "1" : void 0 }, /* @__PURE__ */ React$1.createElement("div", { className: "kit-phone-screen" }, appTree), isApp && /* @__PURE__ */ React$1.createElement(KitPhoneBars, null)))) : appTree, ConfigLauncher && !isFramed() && /* @__PURE__ */ React$1.createElement(
      ConfigLauncher,
      {
        statesGroups: STATE_GROUPS,
        onGoState: goState,
        onOpenStatesIndex: () => setLanding({ kind: "index", name: "index" }),
        onReset: resetAndShow,
        layout,
        onLayoutChange: setLayout,
        platform,
        onPlatformChange: setPlatform
      }
    ));
  };
  function initMain() {
    registerCasebook();
    registerDelveLibrary();
    registerPuzzlesLibrary();
    registerHunterLibrary();
    registerBarrowLibrary();
    registerPassLibrary();
    registerEscape();
    registerWord();
    registerDelve();
    GS_REVIEW_DEFAULT = { providerFail: false, device: "known", passFail: false, sheet: "completes", week: "done", today: "played", unfinished: false, several: false, escape: "under", ed: null };
    GS_USER_DEFAULT = { username: "MonaLaser", first: "Mona", last: "Lasker", locked: false, since: null, fresh: false, email: "you@example.com" };
    GS_SUB_DEFAULT = { status: "none", plan: "monthly", hadPass: false, pending: null, renew: null };
    GS_BARE = ["signup", "signin", "verify", "username", "recover", "returning", "checkout", "update-card", "loading", "offline", "directory-claude", "directory-chatgpt", ...GS_MORE_IDS || []];
    GS_LISTING = ["directory-claude", "directory-chatgpt", ...GS_MORE_IDS || []];
    GS_FOOTER = ["home", "games", "library", "delve", "word", "groups", "mystery", ...DP_IDS, "escape", "casebook", "hunter", "barrow", "pass", "subscribe", "legal", "connect", "history", "session", "account"];
    GS_FOOTER.push(...GS_MORE_IDS || []);
    GS_SIGNED_IN_ONLY = ["library", "history", "account", "update-card", "checkout", "session"];
    GS_GUARDED = ["library", "history", "account", "session"];
    GS_AUTH_ONLY = ["signup", "signin", "verify", "username", "recover", "returning"];
    GS_ROUTES = [
      "home",
      "signup",
      "signin",
      "verify",
      "username",
      "recover",
      "returning",
      "connect",
      "games",
      "library",
      "delve",
      "word",
      "groups",
      "mystery",
      ...DP_IDS,
      "escape",
      "casebook",
      "hunter",
      "barrow",
      "session",
      "history",
      "pass",
      "subscribe",
      "checkout",
      "update-card",
      "account",
      "legal",
      "loading",
      "offline",
      "directory-claude",
      "directory-chatgpt",
      ...GS_MORE_IDS || []
    ];
    GS_ARRIVES = ["games", "library", "history", "session", "pass", "subscribe", "account", "delve", "word", "groups", "mystery", ...DP_IDS, "escape", "casebook", "hunter", "barrow", ...GS_MORE_IDS || []];
    client.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React$1.createElement(KitApp, null));
  }
  initGsChats();
  initGsGame();
  initGsWhereChainSalvage();
  initGsChain();
  initGsCasebookData();
  initGsCasebook();
  initGsDelveLibrary();
  initGsPuzzlesLibrary();
  initGsHunterLibrary();
  initGsBarrowLibrary();
  initGsPlayer();
  initGsDiscover();
  initStates();
  initGsHistory();
  initGsEditions();
  initGsPassStore();
  initGsMoreGames();
  initGsPassHome();
  initGsPassLibrary();
  initGsDelve();
  initMain();
  initPlaygroundGuessResult();
  initPlaygroundGuessNow();
})(React, ReactDOM);
