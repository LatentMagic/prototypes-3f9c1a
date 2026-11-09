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
    const HEX = "18,0 36,10 36,30 18,40 0,30 0,10";
    const RIM = "18,-3.5 39,8 39,32 18,43.5 -3,32 -3,8";
    const SPARKLE = "M18 13 Q19 19 25 20 Q19 21 18 27 Q17 21 11 20 Q17 19 18 13Z";
    const foeAt = (crit, adv) => crit ? adv ? [-10, -9.5] : [-7, -6.5] : adv ? [-7, -6] : [-3.5, -3];
    function DelveDie({ kind = "miss", value, other, crit = false, fumble = false, foe = false, selected = false, surface = "card", size = 36, className = "" }) {
      const big = size >= 64;
      const adv = other != null && !big && !selected;
      const layer = foe && !big && !selected ? foeAt(crit, adv) : null;
      const cls = ["mcp-dl-die", "is-" + kind, crit && "is-crit", fumble && "is-fumble", selected && "is-sel", surface === "popup" && "is-popup", className].filter(Boolean).join(" ");
      return /* @__PURE__ */ React2.createElement("svg", { className: cls, viewBox: "-5 -5 46 50", width: size, height: Math.round(size * 50 / 46), "aria-hidden": "true" }, layer && /* @__PURE__ */ React2.createElement("polygon", { className: "fo", points: HEX, transform: "translate(" + layer[0] + " " + layer[1] + ")" }), adv && /* @__PURE__ */ React2.createElement("polygon", { className: "gh", points: HEX, transform: crit ? "translate(-7 -6.5)" : "translate(-3.5 -3)" }), /* @__PURE__ */ React2.createElement("polygon", { className: "hx", points: HEX }), crit && /* @__PURE__ */ React2.createElement("polygon", { className: "rim", points: RIM }), kind === "use" ? /* @__PURE__ */ React2.createElement("path", { className: "gl", d: SPARKLE }) : /* @__PURE__ */ React2.createElement("text", { className: "nm", x: "18", y: "20.5" }, value), other != null && big && /* @__PURE__ */ React2.createElement("g", { className: "tw", transform: "translate(25 28) scale(.42)" }, /* @__PURE__ */ React2.createElement("polygon", { points: HEX }), /* @__PURE__ */ React2.createElement("text", { x: "18", y: "21" }, other)), /* @__PURE__ */ React2.createElement("polygon", { className: "sl", points: RIM }));
    }
    function DelveUseDie({ foe = false, selected = false, surface = "card", size = 36, className = "" }) {
      return /* @__PURE__ */ React2.createElement(DelveDie, { kind: "use", foe, selected, surface, size, className });
    }
    function DelveFoeDie({ value, other, hit = false, surface = "card", size = 34, className = "" }) {
      const cls = ["mcp-dl-foe", other != null && "has-other", hit && "is-hit", surface === "popup" && "is-popup", className].filter(Boolean).join(" ");
      return /* @__PURE__ */ React2.createElement("svg", { className: cls, viewBox: "-2 -2 40 44", width: size, height: Math.round(size * 44 / 40), "aria-hidden": "true" }, other != null && /* @__PURE__ */ React2.createElement("polygon", { className: "gf", points: "18,0 36,20 18,40 0,20", transform: "translate(-3.5 -4.5)" }), /* @__PURE__ */ React2.createElement("polygon", { className: "fx", points: "18,0 36,20 18,40 0,20" }), /* @__PURE__ */ React2.createElement("text", { className: "nm", x: "18", y: "20.5" }, value));
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
    const TIME_CHIPS = { tiny: "5–15 min", small: "25–45 min" };
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
      "weekly-interrogation": '<svg viewBox="0 0 171 108" preserveAspectRatio="xMidYMid slice"><rect width="171" height="108" fill="#421A28"/><circle cx="75" cy="54" r="36" fill="none" stroke="#D66847" stroke-width="14"/><rect x="107" y="20" width="14" height="68" fill="#F2EBE0"/><rect x="107" y="20" width="14" height="22" fill="#E5A63B"/></svg>',
      "dungeon-quest": '<svg viewBox="0 0 171 108" preserveAspectRatio="xMidYMid slice"><rect width="171" height="108" fill="#163328"/><path d="M31.7,108 L64.4,51.8 L97.2,108Z" fill="#E5A63B"/><path d="M67.6,108 L103.4,40.9 L139.3,108Z" fill="#A390B2"/><path d="M67.6,108 L82.4,80.3 L97.2,108Z" fill="#328A88"/></svg>',
      "dungeon-quest-single": '<svg viewBox="0 0 171 108" preserveAspectRatio="xMidYMid slice"><rect width="171" height="108" fill="#163328"/><path d="M47,108 L93,22 L139,108Z" fill="#A390B2"/></svg>'
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
    function Card2({ title, action, children, className = "", style, href, onClick, label, chevron = true }) {
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
    function GameTile({ art, pass, onPass, first, soon, title, kind, className = "", style }) {
      const m = gameMark({ soon, pass, onPass, first });
      return /* @__PURE__ */ React2.createElement("div", { className: ("mcp-gtile " + (soon ? "is-soon " : "") + className).trim(), style }, /* @__PURE__ */ React2.createElement("div", { className: "mcp-gtile-art" }, art, m), /* @__PURE__ */ React2.createElement("span", { className: "mcp-gtile-name" }, title), kind && /* @__PURE__ */ React2.createElement("span", { className: "mcp-gtile-kind" }, kind));
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
    ns.DelveDie = DelveDie;
    ns.DelveUseDie = DelveUseDie;
    ns.DelveFoeDie = DelveFoeDie;
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
    ns.Card = Card2;
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
    word: { access: "daily", name: "Guess", category: "PUZZLE", art: "word", route: "word", ed: ["word", "words"], edLine: "Five letters. Six guesses.", daily: true, once: true, blurb: "Six guesses to find today’s five-letter word.", tags: ["Daily"], size: "tiny" },
    groups: { access: "pass", name: "Daily Groups", category: "PUZZLE", art: "groups", route: "groups", ed: ["puzzle", "puzzles"], edLink: "See all groups", edAll: "All groups", edLine: "Sixteen words hide four groups. Find all four.", daily: true, once: true, blurb: "Sixteen words hide four groups. Find all four.", tags: ["Daily", "10 min"] },
    mystery: { access: "daily", name: "Accuse", category: "PUZZLE", art: "murder", route: "mystery", ed: ["case", "cases"], edLine: "One suspect, one weapon, one room. One accusation.", daily: true, once: true, blurb: "There’s a body and a story that doesn’t add up.", tags: ["Daily"], size: "tiny" },
    escape: { access: "first", soon: true, name: "Escape", category: "PUZZLE", art: "escape", route: "escape", ed: ["room", "rooms"], blurb: "The door’s locked and you’re on the wrong side of it.", tags: ["Weekly"], size: "small" },
    // Casebook is episodic: cases are its editions, with no schedule.
    casebook: { access: "pass", name: GS_NAME.casebook, category: "MYSTERY", art: "casebook", route: "casebook", ed: ["case", "cases"], once: true, blurb: "Ask the question they haven’t prepared for.", tags: ["25–40 min"] },
    delve: { access: "first", name: "Delve", category: "ADVENTURE", art: "delve", route: "delve", ed: ["run", "runs"], blurb: "Get her out before the ritual is complete.", tags: ["Weekly"], size: "small" },
    // Chapters are its editions; a free player gets chapter 1. Sample content.
    barrow: { access: "first", name: "The Barrow of Hollowmere", category: "ADVENTURE", art: "barrow", route: "barrow", ed: ["chapter", "chapters"], edLink: "All chapters", edAll: "All chapters", blurb: "Bring the lost bell home from the barrow. Your hero carries on.", tags: ["Several sessions"] },
    hunter: { access: "pass", name: GS_NAME.hunter, category: "LEARNING", art: "hunter", route: "hunter", ed: ["summer", "summers"], blurb: "Grey dawn below Chauvet cave. Go where you like.", tags: ["2 hours"] }
  };
  const gsAccess = (g) => {
    g.free = g.access === "daily";
    g.first = g.access === "first";
    g.tags = [{ daily: "FREE", first: "FIRST", pass: "PASS" }[g.access], ...g.tags.filter((t) => !["FREE", "FIRST", "PASS"].includes(t)), ...g.size ? [DS.TIME_CHIPS[g.size]] : []];
    return g;
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
    ["Strength", "Heavy attack: Cleave", "Miss", "Rolled 9 + 3 = 12 against DC 14", "Struck back: d20 14, the higher of 14 and 6, vs 13, hit, 1 damage, HP 11/13"],
    ["Dexterity", "Weak hit", "Rolled 11 + 1 = 12 against DC 12", "Struck back: d20 6 vs 13, missed"],
    ["Dexterity", "Strong hit", "Rolled 18 + 1 = 19 against DC 12"],
    ["Room", "Entered the warren"],
    ["Turn", "The turncoat joins", GS_DV_TURNCOAT],
    ["Ability", "Used shield bash", "Warren guard: track 3 → 2", "Struck back: d20 7 vs 13, missed"],
    ["Strength", "Weak hit", "Rolled 9 + 3 = 12 against DC 12", "Struck back: d20 8 vs 13, missed"],
    ["Strength", "Weak hit", "Rolled 13 + 3 = 16 against DC 12", "Struck back: d20 15 vs 13, hit, 2 damage, HP 9/13"],
    ["Strength", "Strong hit", "Rolled 17 + 3 = 20 against DC 12"],
    ["Dexterity", "Rifle the stolen sacks", "Success", "Natural 20", "Rolled 20 + 1 = 21 against DC 12"],
    ["Room", "Entered Snaggle's den"],
    ["Gear", "Used a pepper pouch", "Snaggle: track 3 → 1", "Struck back: d20 15 vs 13, hit, 1 damage, HP 8/13"],
    ["Strength", "Strong hit", "Rolled 18, the higher of 15 and 18, + 3 = 21 against DC 12"],
    ["Gear", "Took the iron key"],
    ["Room", "Doubled back to the warren", "The ritual +1"],
    ["Lock", "Opened the bone gate with the iron key"],
    ["Room", "Entered the shrine cavern"],
    ["Strength", "Strong hit", "Rolled 19, the higher of 11 and 19, + 3 = 22 against DC 12", "Struck back: d20 5 vs 13, missed"],
    ["Strength", "Strong hit", "Rolled 17, the higher of 17 and 9, + 3 = 20 against DC 12"]
  ];
  const GS_DV_LIVE = [
    ["Oracle", "Is anyone awake down here?", "Yes", "Rolled d100 23 against 25"],
    ["Room", "Entered the chime run"],
    ["Dexterity", "Weak hit", "Rolled 13 + 3 = 16 against DC 12", "Struck back: d20 7 vs 13, missed"],
    ["Dexterity", "Strong hit", "Rolled 16 + 3 = 19 against DC 12"],
    ["Room", "Entered the warren"],
    ["Turn", "The turncoat joins", GS_DV_TURNCOAT],
    ["Dexterity", "Strong hit", "Rolled 14 + 3 = 17 against DC 12", "Struck back: d20 3 vs 13, missed"],
    ["Dexterity", "Strong hit", "Rolled 14, the higher of 8 and 14, + 3 = 17 against DC 12", "Struck back: d20 10 vs 13, missed"],
    ["Intelligence", "Study the wall scratchings", "Success", "Rolled 19, the higher of 19 and 15, + 1 = 20 against DC 12"],
    ["Room", "Entered Snaggle's den"],
    ["Dexterity", "Strong hit", "Rolled 14, the higher of 14 and 5, + 3 = 17 against DC 12", "Struck back: d20 9 vs 13, missed"],
    ["Dexterity", "Strong hit", "Rolled 18, the higher of 18 and 7, + 3 = 21 against DC 12", "Struck back: d20 12 vs 13, missed"],
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
      figures: ["Threat 5/12", "11 rolls", "1 natural 20", "HP 8/13"],
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
      number: 212,
      answer: "STILL",
      hints: 1,
      result: "Solved in 3 of 6",
      date: GS.today,
      share: "Solved in 3 of 6",
      lines: gsWordLines("STILL", ["CRANE", "SLATE", ["Hint", "Letter 2 is T."], "STILL"])
    },
    // Sample plays for the session page (1236). No. 210, the hard play: solved on the fifth guess with the hint; after ROBOT only
    // letter 4 was green, so the hint gave letter 1. No. 208, lost: the SHA_E trap, four letters in place from guess 2 to 6.
    "word-hard": {
      kind: "puzzle",
      gid: "word",
      game: "Guess",
      art: "word",
      number: 210,
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
      number: 208,
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
      number: 211,
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
      number: 212,
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
  (new URLSearchParams(window.location.search).get("cur") || "GBP").toUpperCase();
  document.createElement("canvas");
  const SLV_COLS = "ABCDEFGH";
  const SLV_N8 = [1, 2, 3, 4, 5, 6, 7, 8];
  const SLV_WRECKS = [["A5", "B5", "C5", "D5"], ["E3", "F3", "G3"], ["F6", "G6", "H6"], ["G8", "H8"], ["C1", "C2"]];
  const SLV_DIVES = 20;
  const slvColOf = (sq) => SLV_COLS.indexOf(sq[0]);
  const slvRowOf = (sq) => +sq.slice(1) - 1;
  const slvAt = (c, r) => SLV_COLS[c] + (r + 1);
  const slvWreckOf = (sq) => SLV_WRECKS.findIndex((w) => w.includes(sq));
  const slvLineSquares = ({ axis, name }, from) => {
    const sq = SLV_N8.map((_, i) => axis === "row" ? slvAt(i, +name - 1) : slvAt(SLV_COLS.indexOf(name), i));
    return from === "right" || from === "bottom" ? sq.reverse() : sq;
  };
  const slvLineCount = (line) => slvLineSquares(line).filter((s) => slvWreckOf(s) > -1).length;
  const slvLineWords = ({ axis, name }) => (axis === "row" ? "Row " : "Column ") + name;
  const slvCountWords = (n) => n === 0 ? "no wreck squares." : n + (n === 1 ? " wreck square" : " wreck squares") + ", found or not.";
  const slvPatch = (sq) => {
    const c = slvColOf(sq), r = slvRowOf(sq);
    const out = [];
    for (let y = Math.max(0, r - 1); y <= Math.min(7, r + 1); y++) for (let x = Math.max(0, c - 1); x <= Math.min(7, c + 1); x++) out.push(slvAt(x, y));
    return out;
  };
  const slvRunPlay = (moves) => {
    const hit = /* @__PURE__ */ new Set();
    const raised = /* @__PURE__ */ new Set();
    const lines = [];
    const tools = {};
    const miss = [];
    const marks = [];
    let dives = 0;
    const strike = (sq) => {
      hit.add(sq);
      const w = slvWreckOf(sq);
      if (SLV_WRECKS[w].every((s) => hit.has(s)) && !raised.has(w)) {
        raised.add(w);
        return SLV_WRECKS[w].length;
      }
      return 0;
    };
    moves.forEach((m) => {
      if (m.dive) {
        if (hit.has(m.dive)) return;
        dives += 1;
        const w = slvWreckOf(m.dive);
        let res = "miss";
        if (w < 0) miss.push(m.dive);
        else {
          const sunk = strike(m.dive);
          res = sunk ? "raised: the wreck of " + sunk : "hit";
        }
        marks.push(res === "miss" ? "○" : res === "hit" ? "✕" : "■");
        lines.push(["Dive " + dives, m.dive, res]);
      } else if (m.sonar) {
        const count = slvLineCount(m.sonar);
        tools.sonar = { line: m.sonar, squares: slvLineSquares(m.sonar) };
        marks.push("📡");
        lines.push(["Hint", slvLineWords(m.sonar) + ": " + slvCountWords(count)]);
      } else if (m.detector) {
        const sq = slvPatch(m.detector);
        const count = sq.filter((s) => slvWreckOf(s) > -1).length;
        tools.detector = { squares: sq };
        marks.push("🧲");
        lines.push(["Metal detector", m.detector + " and around it: " + slvCountWords(count)]);
      } else if (m.net) {
        const run = slvLineSquares(m.net, m.net.from);
        const i = run.findIndex((s) => slvWreckOf(s) > -1);
        const snag = i < 0 ? null : run[i];
        const head = slvLineWords(m.net) + " from the " + m.net.from;
        let say = head + ": no wreck squares.";
        if (snag && hit.has(snag)) say = head + ": the dragnet snags at " + snag + ", already found.";
        else if (snag) {
          const sunk = strike(snag);
          say = head + ": the dragnet snags at " + snag + (sunk ? " and raises the wreck of " + sunk + "." : ", a hit.");
        }
        tools.net = { squares: snag ? run.slice(0, i + 1) : run };
        marks.push("🕸️");
        lines.push(["Dragnet", say]);
      }
    });
    const state = raised.size === 5 ? "won" : dives >= SLV_DIVES ? "lost" : "live";
    if (state === "lost") SLV_WRECKS.forEach((w) => lines.push(["Wreck", "The wreck of " + w.length + ": " + w[0] + " to " + w[w.length - 1]]));
    return { state, dives, hit, raised, miss, tools, lines, marks, sweep: tools.sonar ? tools.sonar.line : null };
  };
  const slvDive = (s) => s.split(" ").map((d) => ({ dive: d }));
  const SLV_WON_HEAD = [
    { sonar: { axis: "col", name: "G" } },
    ...slvDive("A5 B5 C5 D5"),
    { detector: "F4" },
    ...slvDive("D3 E3 F3 G3"),
    { net: { axis: "row", name: 6, from: "left" } },
    ...slvDive("G6 H6 G7 G8 H8")
  ];
  const SLV_MOVES = {
    begun: [],
    won: [...SLV_WON_HEAD, ...slvDive("C3 C2 C1")],
    hard: [...SLV_WON_HEAD, ...slvDive("A1 H1 H2 A8 C3 C2 C1")],
    // Lost: all 20 dives spent with two wrecks not raised; the dragnet not used.
    lost: [...slvDive("A1 B1 C1 C2 D3 E3 F3 G3 A5 B5 C5 D5"), { sonar: { axis: "row", name: 8 } }, { detector: "G5" }, ...slvDive("H4 F5 G6 G7 E8 F8 A8 B8")],
    // In progress: 9 dives, sonar and detector used, a hit on the wreck in column C.
    live: [{ sonar: { axis: "col", name: "A" } }, ...slvDive("A5 B5 C5 D5"), { detector: "E4" }, ...slvDive("D3 E3 F3 G3 C1")]
  };
  Object.fromEntries(Object.entries(SLV_MOVES).map(([fx, moves]) => [fx, slvRunPlay(moves)]));
  ({
    sonar: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("circle", { cx: "5", cy: "12", r: "1.6", fill: "currentColor" }), /* @__PURE__ */ React$1.createElement("path", { d: "M9 8.5a5 5 0 0 1 0 7M12.5 5.5a9.5 9.5 0 0 1 0 13M16 3a13 13 0 0 1 0 18" })),
    detector: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("path", { d: "M5 3l7 12" }), /* @__PURE__ */ React$1.createElement("ellipse", { cx: "15", cy: "18", rx: "6", ry: "3" }))
  });
  /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, /* @__PURE__ */ React$1.createElement("b", null, "Connect your AI"), " in about two minutes. ChatGPT, Claude, OpenClaw and others.");
  const CM_C7 = [
    { items: ["EGG", "TORTOISE", "PEANUT", "HERMIT CRAB"], link: "Shell", fits: "An egg, a tortoise, a peanut and a hermit crab all have one." },
    { items: ["A PRINTER", "A ZIP", "A DOOR", "A RADIO SIGNAL"], link: "Jam", fits: "A printer, a zip, a door and a radio signal can all jam." },
    { items: ["A DRUM", "THE TRAFFIC", "A DUSTY RUG", "THE OTHER TEAM"], link: "Beat", fits: "You can beat a drum, the traffic, a dusty rug and the other team." }
  ];
  ({ m: [0, 1, 2].flatMap((k) => [[k, "more"], [k, "more"], [k, "more"], [k, CM_C7[k].link + ".", true]]) });
  const I = (c) => /* @__PURE__ */ React$1.createElement("i", { className: c });
  ({
    murder: { body: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, I("ga-m-ring"), I("ga-m-bar"), I("ga-m-cap")) },
    escape: { body: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, I("ga-e-door"), I("ga-e-knob"), I("ga-e-win")) },
    delve: { body: /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, I("ga-d-out"), I("ga-d-in"), I("ga-d-st"), I("ga-d-st2"), I("ga-d-st3"), I("ga-d-post l"), I("ga-d-post r"), I("ga-d-fl l"), I("ga-d-fl r")) }
  });
  const DL_FOES = { "the chime run": ["Chime-rat", 2], "the warren": ["Warren guard", 3], "snaggle's den": ["Snaggle", 3], "the shrine cavern": ["Ritual priest", 2] };
  const DL_HEROES = {
    "Bryn the Fighter": {
      name: "Bryn",
      cls: "Fighter",
      stats: { Strength: 3, Dexterity: 1, Constitution: 2, Intelligence: 0, Wisdom: 0, Charisma: -1 },
      abilities: [{ name: "Shield bash", of: 2, does: "Strikes at once, no roll" }],
      gear: [{ name: "Pepper pouch", kind: "once", does: "Flung in a face, it blinds for a blow" }]
    },
    "Wren the Rogue": {
      name: "Wren",
      cls: "Rogue",
      stats: { Strength: 0, Dexterity: 3, Constitution: 0, Intelligence: 1, Wisdom: 1, Charisma: 2 },
      abilities: [{ name: "Backstab", of: 2, does: "Strikes from behind at once, no roll" }],
      gear: [{ name: "Smoke pellet", kind: "once", does: "Burst underfoot, it hides you for a breath" }]
    }
  };
  const DL_TIER = { strong: "Strong hit", weak: "Weak hit", miss: "Miss" };
  const DL_GRADE = /^(Strong hit|Weak hit|Miss|Success|Partial success|Failure)$/;
  const dlStruck = (parts) => {
    const sb = /^Struck back: d20 (?:(\d+), the higher of (\d+) and (\d+),|(\d+)) vs (\d+), (hit|missed)(?:, (\d+) damage)?/.exec(parts.find((p) => /^Struck back: /.test(p)) || "");
    if (!sb) return null;
    const roll = +(sb[1] || sb[4]);
    const two = sb[1] != null;
    return { roll, other: two ? +sb[2] === roll ? +sb[3] : +sb[2] : null, dc: +sb[5], hit: sb[6] === "hit", dmg: sb[7] ? +sb[7] : 0 };
  };
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
    return { stat: l[0], kept, other, mod: +m[5], total: +m[6], dc: +m[7], gap: +m[6] - +m[7], tier, crit, fumble, two, hp: hp ? +hp[1] : null, foe: dlStruck(parts), action: DL_GRADE.test(parts[0]) ? "" : /^Heavy attack/.test(parts[0]) ? "Heavy attack" : parts[0], move: (/^Heavy attack: (.+)$/.exec(parts[0]) || [])[1] || "" };
  };
  const DL_USE_KINDS = /^(Ability|Ultimate|Gear)$/;
  const dlUse = (l, hero) => {
    const m = DL_USE_KINDS.test(l[0]) && /^Used (?:the |an? )?(.+)$/i.exec(String(l[1]));
    if (!m) return null;
    const parts = l.slice(1).map(String);
    const sheet = DL_HEROES[hero] || DL_HEROES["Wren the Rogue"];
    const name = dlCap(m[1]);
    const has = [...sheet.abilities, ...sheet.gear].find((x) => x.name === name);
    const hp = /HP\s+(\d+)\/(\d+)/.exec(parts.join(" · "));
    return { use: true, what: l[0], name, does: has ? has.does.charAt(0).toLowerCase() + has.does.slice(1) : "", tier: "use", foe: dlStruck(parts), hp: hp ? +hp[1] : null };
  };
  const DL_END = { won: "The winning blow", fallen: "The last blow", overrun: "The last roll", live: "Latest roll" };
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
    const turns = [];
    const order = [];
    let cur = null;
    let hp = s.hpMax;
    const foeHp = {};
    const foeOf = () => {
      const f = cur && DL_FOES[cur.name.toLowerCase()];
      return f ? { f, k: cur.key } : null;
    };
    const open = (name, back2) => {
      name = name && dlCap(name);
      const key = name || "_first";
      if (!order.includes(key)) order.push(key);
      cur = { i: stops.length, key, name: name || "First room", back: back2, num: order.indexOf(key) + 1, rolls: [], turns: [] };
      stops.push(cur);
    };
    (s.lines || []).forEach((l) => {
      if (l[0] === "Room") {
        const p = String(l[1]);
        open(p.replace(/^(Entered|Doubled back to) /, ""), /^Doubled back to /.test(p));
        return;
      }
      if (!cur) open(null, false);
      const wear = DL_USE_KINDS.test(l[0]) && /→ (\d+)$/.exec(String(l[2] || ""));
      const fo = foeOf();
      if (wear && fo) foeHp[fo.k] = +wear[1];
      const u = dlUse(l, s.hero);
      if (u) {
        u.t = turns.length + 1;
        u.stop = cur.i;
        u.room = cur.name;
        u.back = cur.back;
        u.harm = u.hp != null ? Math.max(0, hp - u.hp) : 0;
        if (u.hp != null) hp = u.hp;
        if (fo && u.foe) {
          const max = (s.foeMax || {})[fo.k.toLowerCase()] || fo.f[1];
          u.foe = { ...u.foe, name: fo.f[0], health: foeHp[fo.k] != null ? foeHp[fo.k] : max, max };
        }
        turns.push(u);
        cur.turns.push(u);
        return;
      }
      const r = dlRoll(l);
      if (!r) return;
      r.n = rolls.length + 1;
      r.t = turns.length + 1;
      r.stop = cur.i;
      r.room = cur.name;
      r.back = cur.back;
      r.harm = r.hp != null ? Math.max(0, hp - r.hp) : 0;
      if (r.hp != null) hp = r.hp;
      if (fo && (!r.action || r.action === "Heavy attack")) {
        const left = foeHp[fo.k] != null ? foeHp[fo.k] : (s.foeMax || {})[fo.k.toLowerCase()] || fo.f[1];
        foeHp[fo.k] = r.tier === "miss" ? left : Math.max(0, left - (r.crit ? 2 : 1));
        if (r.foe) r.foe = { ...r.foe, name: fo.f[0], health: foeHp[fo.k], max: (s.foeMax || {})[fo.k.toLowerCase()] || fo.f[1] };
      }
      rolls.push(r);
      turns.push(r);
      cur.rolls.push(r);
      cur.turns.push(r);
    });
    let run = 0;
    rolls.forEach((r) => {
      run = r.tier === "strong" ? run + 1 : 0;
    });
    const end = s.live ? "live" : s.end;
    const moments = dlMoments(rolls, end);
    return { stops, rolls, turns, hp, run, end, mom: Object.fromEntries(moments.map((x) => [x.r.n, x])) };
  };
  const dlSay = (r, foe = true) => r.use ? r.what + " used, " + r.room + ": " + r.name + (foe && r.foe ? r.foe.hit ? ", the foe hit back" : ", the foe missed back" : "") : "Roll " + r.n + ", " + r.room + ": " + (r.action ? r.action + ", " : "") + r.stat + " " + r.total + " against " + r.dc + ", " + DL_TIER[r.tier].toLowerCase() + (r.crit ? ", natural 20" : r.fumble ? ", natural 1" : "") + (r.two ? ", two dice, the higher kept" : "") + (foe && r.foe ? r.foe.hit ? ", the foe hit back" : ", the foe missed back" : "");
  const DlDie = ({ r, size = 36, sel, foe = true, surface }) => r.use ? /* @__PURE__ */ React$1.createElement(DS.DelveUseDie, { foe: foe && !!r.foe, selected: sel, surface, size }) : /* @__PURE__ */ React$1.createElement(DS.DelveDie, { kind: r.tier, value: r.kept, other: r.two ? r.other : void 0, crit: r.crit, fumble: r.fumble, foe: foe && !!r.foe, selected: sel, surface, size });
  const DlDieBtn = ({ r, size, act, on, foe }) => /* @__PURE__ */ React$1.createElement("button", { type: "button", className: "dv2-dbtn", "aria-pressed": act === r.t, "aria-label": dlSay(r, foe !== false), onClick: () => on.sel(r.t), onMouseEnter: () => on.hov(r.t), onMouseLeave: () => on.hov(null) }, /* @__PURE__ */ React$1.createElement(DlDie, { r, size, sel: act === r.t, foe }));
  const DlFoeDie = ({ f }) => /* @__PURE__ */ React$1.createElement(DS.DelveFoeDie, { value: f.roll, other: f.other != null ? f.other : void 0, hit: f.hit, surface: "popup" });
  const DlHeld = ({ m, act }) => {
    const r = act ? m.turns[act - 1] : null;
    if (!r) return null;
    const x = r.use ? null : m.mom[r.n];
    const tcls = r.fumble ? "fumble" : r.tier;
    const foeRow = r.foe && /* @__PURE__ */ React$1.createElement("div", { className: "dv3-foe" }, /* @__PURE__ */ React$1.createElement("dt", null, "Foe roll"), /* @__PURE__ */ React$1.createElement("dd", null, /* @__PURE__ */ React$1.createElement(DlFoeDie, { f: r.foe }), /* @__PURE__ */ React$1.createElement("b", { className: r.foe.hit ? "is-err" : "" }, r.foe.hit ? "Hit you for " + r.foe.dmg : "Missed you"), " ", /* @__PURE__ */ React$1.createElement("span", null, "vs defence ", r.foe.dc)));
    return /* @__PURE__ */ React$1.createElement("div", { className: "dv3-live", "aria-live": "polite" }, /* @__PURE__ */ React$1.createElement("div", { className: "dv3-held is-ledger" + (x ? " is-mo" : "") }, x && /* @__PURE__ */ React$1.createElement("i", { className: "dv3-mk", role: "img", "aria-label": "Key moment" }), /* @__PURE__ */ React$1.createElement("div", { className: "dv3-lh" }, /* @__PURE__ */ React$1.createElement(DlDie, { r, size: 72, surface: "popup" }), /* @__PURE__ */ React$1.createElement("div", { className: "dv3-lht" }, /* @__PURE__ */ React$1.createElement("div", { className: "dv3-hk" }, /* @__PURE__ */ React$1.createElement("p", { className: "dv3-k" }, r.use ? r.what + " used" : x ? x.kicker : "Roll " + r.n), x && /* @__PURE__ */ React$1.createElement("p", { className: "dv3-n" }, "Roll ", r.n)))), /* @__PURE__ */ React$1.createElement("dl", { className: "dv3-dl" }, /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement("dt", null, "Room"), /* @__PURE__ */ React$1.createElement("dd", null, (r.back ? "Back in " : "") + r.room)), r.use && /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement("dt", null, "Used"), /* @__PURE__ */ React$1.createElement("dd", null, r.name, " ", /* @__PURE__ */ React$1.createElement("span", { className: "is-does" }, [r.what.toLowerCase(), r.does].filter(Boolean).join(", ")))), !r.use && r.action && /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement("dt", null, "Action"), /* @__PURE__ */ React$1.createElement("dd", null, r.action, r.move && /* @__PURE__ */ React$1.createElement(React$1.Fragment, null, " ", /* @__PURE__ */ React$1.createElement("span", null, r.move)))), !r.use && /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement("dt", null, "Roll"), /* @__PURE__ */ React$1.createElement("dd", null, r.stat, " ", r.total, " ", /* @__PURE__ */ React$1.createElement("span", null, "vs ", r.dc))), !r.use && /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement("dt", null, "Outcome"), /* @__PURE__ */ React$1.createElement("dd", { className: "is-" + tcls }, DL_TIER[r.tier])), foeRow, r.harm > 0 && !r.foe && /* @__PURE__ */ React$1.createElement("div", null, /* @__PURE__ */ React$1.createElement("dt", null, "Cost"), /* @__PURE__ */ React$1.createElement("dd", null, "Lost ", r.harm, " HP")), r.foe && /* @__PURE__ */ React$1.createElement("div", { className: "dv3-fm" }, /* @__PURE__ */ React$1.createElement(DlMeter, { label: r.foe.name, n: r.foe.health, of: r.foe.max })))));
  };
  const DlBackArrow = () => /* @__PURE__ */ React$1.createElement("svg", { className: "dv2-back", viewBox: "0 0 12 12", "aria-hidden": "true", focusable: "false" }, /* @__PURE__ */ React$1.createElement("path", { d: "M4.5 10.5 1.5 7.5l3-3M1.5 7.5h6a3 3 0 0 0 0-6H5", fill: "none", stroke: "currentColor", strokeWidth: "1.5" }));
  const DlStopHead = ({ st, named }) => /* @__PURE__ */ React$1.createElement("span", { className: "dvA2-head", "aria-label": (st.back ? "Back to " : "Room " + st.num + ", ") + st.name }, /* @__PURE__ */ React$1.createElement("span", { className: "dv2-num" + (st.back ? " is-back" : "") }, st.back && /* @__PURE__ */ React$1.createElement(DlBackArrow, null), st.num), named && /* @__PURE__ */ React$1.createElement("span", { className: "dv2-sname" }, st.name));
  const DlRoute = ({ m, act, on }) => {
    const sel = act ? m.turns[act - 1].stop : null;
    return /* @__PURE__ */ React$1.createElement("div", { className: "dvE-main" }, /* @__PURE__ */ React$1.createElement("div", { className: "dvA2-route is-e is-cols-between", style: { "--dv-stops": m.stops.length }, "aria-label": "The way you went" }, m.stops.map((st) => /* @__PURE__ */ React$1.createElement("div", { key: st.i, className: "dvA2-stop" + (sel === st.i ? " is-on" : "") }, /* @__PURE__ */ React$1.createElement(DlStopHead, { st, named: true }), /* @__PURE__ */ React$1.createElement("div", { className: "dvA2-dice" }, st.turns.length ? st.turns.map((r) => !r.use && m.mom[r.n] ? /* @__PURE__ */ React$1.createElement("span", { key: r.t, className: "dvE-mom" }, /* @__PURE__ */ React$1.createElement(DlDieBtn, { r, act, on, size: 52 })) : /* @__PURE__ */ React$1.createElement(DlDieBtn, { key: r.t, r, act, on, size: 30 })) : /* @__PURE__ */ React$1.createElement("i", { className: "dv2-pass", "aria-label": "No rolls" }))))), /* @__PURE__ */ React$1.createElement("div", { className: "dvE-side" }, /* @__PURE__ */ React$1.createElement(DlHeld, { m, act })));
  };
  const DlMeter = ({ label, n, of }) => /* @__PURE__ */ React$1.createElement("div", { className: "dv6-bar" }, /* @__PURE__ */ React$1.createElement("span", null, label), /* @__PURE__ */ React$1.createElement(DS.ProgressBar, { label, value: n, max: of, showValue: false }), /* @__PURE__ */ React$1.createElement("small", null, n + "/" + of));
  const GRADE = { s: "Strong hit", w: "Weak hit", m: "Miss" };
  const OPT = { s: "Success", w: "Partial success", m: "Failure" };
  const HP0 = 11;
  const buildRun = (stops) => {
    let hp = HP0;
    const lines = [];
    const rolled = (kept, mod, other) => "Rolled " + kept + (other != null ? ", the higher of " + other + " and " + kept + "," : "") + " + " + mod + " = " + (kept + mod) + " against DC 12";
    stops.forEach((st, i) => {
      if (i > 0) lines.push(["Room", (st.back ? "Doubled back to " : "Entered ") + st.name]);
      st.t.forEach((x) => {
        if (x.use) {
          lines.push(["Ability", "Used " + x.use, "Struck back: d20 9 vs 13, missed"]);
          return;
        }
        if (x.lock) {
          lines.push(["Lock", x.lock]);
          return;
        }
        const nat = x.nat ? [x.nat] : [];
        if (x.opt) {
          lines.push([x.stat, x.opt, OPT[x.g], ...nat, rolled(x.k, x.mod, x.two)]);
          return;
        }
        const struck = [];
        if (x.foe === "x") struck.push("Struck back: d20 8 vs 13, missed");
        else if (x.foe) {
          hp -= x.foe;
          struck.push("Struck back: d20 16 vs 13, hit, " + x.foe + " damage, HP " + hp + "/" + HP0);
        }
        lines.push([x.stat, GRADE[x.g], ...nat, rolled(x.k, x.mod, x.two), ...struck]);
      });
    });
    return dlBuild({ hero: "Wren the Rogue", hpMax: HP0, end: "overrun", lines });
  };
  const F = (stat, g, k, mod, foe, more) => ({ stat, g, k, mod, foe, ...more });
  const O = (stat, opt, g, k, mod, more) => ({ stat, opt, g, k, mod, ...more });
  const ROOMS = {
    first: { name: "First room", t: [O("Wisdom", "Search the lock-keeper's niche", "s", 14, 1)] },
    chime: { name: "The chime run", t: [F("Dexterity", "m", 8, 3, 1), F("Dexterity", "w", 9, 3, "x"), F("Dexterity", "s", 16, 3, "x")] },
    warren: { name: "The warren", t: [F("Strength", "w", 9, 3, "x"), F("Strength", "s", 14, 3, "x"), F("Strength", "m", 1, 3, 2, { nat: "Natural 1" }), F("Strength", "s", 15, 3, "x", { two: 6 }), F("Strength", "s", 17, 3)] },
    ante: { name: "The bone-gate antechamber", t: [O("Intelligence", "Read the bone-gate carvings", "w", 11, 1)] },
    hall: { name: "The long hall of drums and bones", t: [O("Dexterity", "Slip between the drums", "s", 13, 3), O("Wisdom", "Listen for the watch", "m", 6, 1), O("Dexterity", "Muffle the great drum", "s", 16, 3)] },
    crawl: { name: "The rat-catcher's crawlway", t: [O("Dexterity", "Squeeze through the crawlway", "s", 12, 3), O("Strength", "Lift the grate", "w", 9, 0), O("Wisdom", "Follow the draught", "s", 14, 1)] },
    gallery: { name: "The painted gallery", t: [O("Intelligence", "Read the wall paintings", "s", 13, 1), O("Wisdom", "Find the hidden latch", "w", 11, 1)] },
    shrine: { name: "The shrine cavern", t: [F("Dexterity", "w", 10, 3, 2), F("Dexterity", "s", 17, 3, "x"), F("Dexterity", "s", 20, 3, "x", { nat: "Natural 20" }), F("Dexterity", "m", 7, 3, 1, { two: 5 }), F("Dexterity", "w", 11, 3, "x"), F("Dexterity", "s", 15, 3, 2)] }
  };
  const back = (r, t) => ({ name: r.name, back: true, t });
  const RUN10 = [
    ROOMS.first,
    ROOMS.chime,
    ROOMS.warren,
    ROOMS.ante,
    back(ROOMS.warren, []),
    ROOMS.hall,
    back(ROOMS.warren, [{ use: "Backstab" }, F("Dexterity", "s", 17, 3, "x"), F("Dexterity", "m", 7, 3, 1)]),
    ROOMS.crawl,
    back(ROOMS.warren, [O("Strength", "Force the bone gate", "m", 6, 0), O("Strength", "Force the bone gate", "m", 11, 0), O("Strength", "Force the bone gate", "s", 14, 0), { lock: "Forced the bone gate" }]),
    ROOMS.shrine
  ];
  const RUN12 = [...RUN10.slice(0, 9), ROOMS.gallery, back(ROOMS.warren, [F("Dexterity", "s", 14, 3, "x")]), RUN10[9]];
  const M10 = buildRun(RUN10);
  const M12 = buildRun(RUN12);
  const colsFor = (n, width, minCol) => {
    const fit = Math.max(1, Math.floor(width / minCol));
    return n <= fit ? n : Math.ceil(n / Math.ceil(n / fit));
  };
  const useCols = (n, minCol) => {
    const ref = React$1.useRef(null);
    const [cols, setCols] = React$1.useState(n);
    React$1.useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return void 0;
      const read = () => setCols(colsFor(n, el.clientWidth, minCol));
      read();
      const ro = new ResizeObserver(read);
      ro.observe(el);
      return () => ro.disconnect();
    }, [n, minCol]);
    return [ref, cols];
  };
  const chunk = (a, k) => Array.from({ length: Math.ceil(a.length / k) }, (_, i) => a.slice(i * k, i * k + k));
  const useActive = (m, first) => {
    const [act, setAct] = React$1.useState(first);
    const on = React$1.useMemo(() => ({ sel: setAct, hov: () => {
    } }), []);
    return [act, on];
  };
  const pressInLast = (m) => {
    const ts = m.stops[m.stops.length - 1].turns;
    return ts[Math.min(3, ts.length - 1)].t;
  };
  const Stop = ({ m, st, act, on, named }) => {
    const sel = act ? m.turns[act - 1].stop : null;
    return /* @__PURE__ */ React$1.createElement("div", { className: "dvA2-stop" + (sel === st.i ? " is-on" : "") }, /* @__PURE__ */ React$1.createElement(DlStopHead, { st, named }), /* @__PURE__ */ React$1.createElement("div", { className: "dvA2-dice" }, st.turns.length ? st.turns.map((r) => !r.use && m.mom[r.n] ? /* @__PURE__ */ React$1.createElement("span", { key: r.t, className: "dvE-mom" }, /* @__PURE__ */ React$1.createElement(DlDieBtn, { r, act, on, size: 52 })) : /* @__PURE__ */ React$1.createElement(DlDieBtn, { key: r.t, r, act, on, size: 30 })) : /* @__PURE__ */ React$1.createElement("i", { className: "dv2-pass", "aria-label": "No rolls" })));
  };
  const RowRoute = ({ m, act, on, minCol, named }) => {
    const [ref, cols] = useCols(m.stops.length, minCol);
    return /* @__PURE__ */ React$1.createElement("div", { ref, className: "cv-rows", "aria-label": "The way you went" }, chunk(m.stops, cols).map((row, ri) => /* @__PURE__ */ React$1.createElement("div", { key: ri, className: "dvA2-route is-e is-cols-between cv-row", style: { "--dv-stops": cols, "--cv-cols": cols } }, row.map((st) => /* @__PURE__ */ React$1.createElement(Stop, { key: st.i, m, st, act, on, named })))));
  };
  const VRow = ({ m, st, act, on, inline, first, last }) => {
    const sel = act ? m.turns[act - 1].stop : null;
    const keys = st.turns.filter((r) => !r.use && m.mom[r.n]);
    const rest = st.turns.filter((r) => r.use || !m.mom[r.n]);
    const [dref, dcols] = useCols(rest.length, 44);
    return /* @__PURE__ */ React$1.createElement("div", { className: "cv-vrow" + (sel === st.i ? " is-on" : "") + (first ? " is-first" : "") + (last ? " is-last" : "") }, /* @__PURE__ */ React$1.createElement("span", { className: "dv2-num cv-vnum" + (st.back ? " is-back" : ""), "aria-label": (st.back ? "Back to " : "Room " + st.num + ", ") + st.name }, st.back && /* @__PURE__ */ React$1.createElement(DlBackArrow, null), st.num), /* @__PURE__ */ React$1.createElement("div", { className: "cv-vbody" }, /* @__PURE__ */ React$1.createElement("p", { className: "cv-vname dv2-sname" }, st.name, !st.turns.length && /* @__PURE__ */ React$1.createElement("i", { className: "dv2-pass cv-vpass", "aria-label": "No rolls" })), rest.length > 0 && /* @__PURE__ */ React$1.createElement("div", { className: "cv-vdice", ref: dref, style: { "--cv-dcols": dcols } }, rest.map((r) => /* @__PURE__ */ React$1.createElement(DlDieBtn, { key: r.t, r, act, on, size: 30 }))), keys.map((r) => /* @__PURE__ */ React$1.createElement("div", { key: r.t, className: "cv-vkey" }, /* @__PURE__ */ React$1.createElement(DlDieBtn, { r, act, on, size: 52 }))), inline && sel === st.i && /* @__PURE__ */ React$1.createElement("div", { className: "cv-vheld" }, /* @__PURE__ */ React$1.createElement(DlHeld, { m, act }))));
  };
  const VList = ({ m, act, on, inline }) => /* @__PURE__ */ React$1.createElement("div", { className: "cv-vlist", "aria-label": "The way you went" }, m.stops.map((st, i) => /* @__PURE__ */ React$1.createElement(VRow, { key: st.i, m, st, act, on, inline, first: i === 0, last: i === m.stops.length - 1 })));
  const CTally = ({ m, st, act, on, mode }) => {
    const keys = st.turns.filter((r) => !r.use && m.mom[r.n]);
    const rest = st.turns.filter((r) => r.use || !m.mom[r.n]);
    const dot = (r, big) => /* @__PURE__ */ React$1.createElement("i", { key: r.t, className: "dl-now-mark is-" + r.tier + (big ? " cv-kdot" : "") });
    if (mode === "dots") return /* @__PURE__ */ React$1.createElement("span", { className: "cv-km" }, st.turns.map((r) => dot(r, !r.use && m.mom[r.n])));
    if (mode === "hex") return /* @__PURE__ */ React$1.createElement("span", { className: "cv-km cv-hexes" }, st.turns.map((r) => /* @__PURE__ */ React$1.createElement(DlDieBtn, { key: r.t, r, act, on, size: !r.use && m.mom[r.n] ? 30 : 18 })));
    if (mode === "now") return /* @__PURE__ */ React$1.createElement("span", { className: "cv-km" }, keys.map((r) => /* @__PURE__ */ React$1.createElement(DlDieBtn, { key: r.t, r, act, on, size: 34 })), rest.length > 0 && /* @__PURE__ */ React$1.createElement("span", { className: "cv-km cv-dots" }, rest.map((r) => dot(r))));
    return /* @__PURE__ */ React$1.createElement("span", { className: "cv-tally", "aria-label": st.turns.length + " rolls" }, st.turns.map((r) => /* @__PURE__ */ React$1.createElement("i", { key: r.t, className: "is-" + (r.tier || "use") })));
  };
  const CRow = ({ m, st, act, on, open, setOpen, first, last, mode }) => {
    const isOpen = open === st.i;
    const sel = act ? m.turns[act - 1].stop : null;
    const onT = React$1.useMemo(() => ({ ...on, sel: (t) => {
      setOpen(st.i);
      on.sel(t);
    } }), [on, st.i]);
    return /* @__PURE__ */ React$1.createElement("div", { className: "cv-vrow cv-crow" + (isOpen ? " is-on" : "") + (first ? " is-first" : "") + (last ? " is-last" : "") }, /* @__PURE__ */ React$1.createElement("span", { className: "dv2-num cv-vnum" + (st.back ? " is-back" : "") }, st.back && /* @__PURE__ */ React$1.createElement(DlBackArrow, null), st.num), /* @__PURE__ */ React$1.createElement("div", { className: "cv-vbody" }, /* @__PURE__ */ React$1.createElement("div", { className: "cv-chead" + (mode === "now" || mode === "hex" ? " is-wrap" : ""), role: "button", tabIndex: st.turns.length ? 0 : -1, "aria-expanded": isOpen, onClick: () => st.turns.length && setOpen(isOpen ? null : st.i) }, /* @__PURE__ */ React$1.createElement("span", { className: "cv-vname dv2-sname" }, st.name), st.turns.length ? !isOpen || !mode ? /* @__PURE__ */ React$1.createElement("span", { onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React$1.createElement(CTally, { m, st, act, on: onT, mode })) : null : /* @__PURE__ */ React$1.createElement("i", { className: "dv2-pass", "aria-label": "No rolls" }), st.turns.length > 0 && /* @__PURE__ */ React$1.createElement("span", { className: "cv-chev", "aria-hidden": "true" }, isOpen ? "▾" : "▸")), isOpen && /* @__PURE__ */ React$1.createElement("div", { className: "cv-cdice" }, st.turns.map((r) => /* @__PURE__ */ React$1.createElement(DlDieBtn, { key: r.t, r, act, on, size: !r.use && m.mom[r.n] ? 44 : 30 }))), isOpen && sel === st.i && /* @__PURE__ */ React$1.createElement("div", { className: "cv-vheld" }, /* @__PURE__ */ React$1.createElement(DlHeld, { m, act }))));
  };
  const CList = ({ m, initial, mode }) => {
    const [act, on] = useActive(m, initial);
    const [open, setOpen] = React$1.useState(m.turns[initial - 1].stop);
    return /* @__PURE__ */ React$1.createElement("section", { className: "dv2 dv7r is-3", "aria-label": "How the run went" }, /* @__PURE__ */ React$1.createElement("div", { className: "cv-vlist", "aria-label": "The way you went" }, m.stops.map((st, i) => /* @__PURE__ */ React$1.createElement(CRow, { key: st.i, m, st, act, on, open, setOpen, mode, first: i === 0, last: i === m.stops.length - 1 }))));
  };
  const Card = ({ m, kind, initial }) => {
    const [act, on] = useActive(m, initial);
    let route;
    if (kind === "today") return /* @__PURE__ */ React$1.createElement("section", { className: "dv2 dv7r is-3", "aria-label": "How the run went" }, /* @__PURE__ */ React$1.createElement(DlRoute, { m, act, on }));
    if (kind === "list") route = /* @__PURE__ */ React$1.createElement(VList, { m, act, on });
    if (kind === "inline") route = /* @__PURE__ */ React$1.createElement(VList, { m, act, on, inline: true });
    if (kind === "rows") route = /* @__PURE__ */ React$1.createElement(RowRoute, { m, act, on, minCol: 44 });
    if (kind === "named") route = /* @__PURE__ */ React$1.createElement(RowRoute, { m, act, on, minCol: 80, named: true });
    return /* @__PURE__ */ React$1.createElement("section", { className: "dv2 dv7r is-3", "aria-label": "How the run went" }, /* @__PURE__ */ React$1.createElement("div", { className: "dvE-main" }, route, kind !== "inline" && /* @__PURE__ */ React$1.createElement("div", { className: "dvE-side" }, /* @__PURE__ */ React$1.createElement(DlHeld, { m, act }))));
  };
  const Frame = ({ w, card, note, clip, scroll, children }) => {
    const outer = React$1.useRef(null);
    const page = React$1.useRef(null);
    const win = React$1.useRef(null);
    const [avail, setAvail] = React$1.useState(w);
    const [full, setFull] = React$1.useState(0);
    const [shift, setShift] = React$1.useState(0);
    React$1.useLayoutEffect(() => {
      const el = outer.current;
      const read = () => setAvail(el.clientWidth);
      read();
      const ro = new ResizeObserver(read);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);
    const scale = Math.min(1, avail / w);
    React$1.useLayoutEffect(() => {
      const el = page.current;
      if (!el) return void 0;
      const read = () => {
        setFull(el.offsetHeight);
        if (!clip) return;
        if (scroll === "held") {
          const side = el.querySelector(".dvE-side");
          const k = el.getBoundingClientRect().height / el.offsetHeight || 1;
          setShift(side ? -((side.getBoundingClientRect().top - el.getBoundingClientRect().top) / k - 16) : 0);
        } else setShift(-Math.max(0, el.offsetHeight - clip));
      };
      read();
      const ro = new ResizeObserver(read);
      ro.observe(el);
      return () => ro.disconnect();
    }, [clip, scroll]);
    const h = clip || full;
    const gutter = w <= 480 ? 16 : (w - card) / 2;
    return /* @__PURE__ */ React$1.createElement("figure", { className: "cv-frame" }, /* @__PURE__ */ React$1.createElement("figcaption", null, /* @__PURE__ */ React$1.createElement("b", null, w, " px wide"), clip ? " × " + clip : "", " · card ", card, " px", scale < 0.98 ? " · shown at " + Math.round(scale * 100) + "%" : "", /* @__PURE__ */ React$1.createElement("span", null, note)), /* @__PURE__ */ React$1.createElement("div", { className: "cv-fit", ref: outer, style: { height: h * scale } }, /* @__PURE__ */ React$1.createElement("div", { className: "cv-win", ref: win, style: { width: w, height: h, transform: "scale(" + scale + ")" } }, /* @__PURE__ */ React$1.createElement("div", { className: "cv-gs", style: { width: w } }, /* @__PURE__ */ React$1.createElement("div", { className: "cv-page", ref: page, style: { padding: "24px " + gutter + "px", transform: clip ? "translateY(" + shift + "px)" : void 0 } }, children)))));
  };
  const PHONES = [[390, "a 390 phone"], [320, "a 320 phone"], [280, "a 280 phone"]];
  const phone = (w) => w - 32;
  const press10 = pressInLast(M10);
  const VERSIONS = [
    {
      id: "today",
      tab: "Today",
      n: "0",
      title: "Today: the route as canon draws it",
      cap: "One row, a column per room: room names are not drawn on a phone, and 10 rooms leave columns of about 32, 25 and 21 px.",
      frames: () => PHONES.map(([w]) => /* @__PURE__ */ React$1.createElement(Frame, { key: w, w, card: phone(w), note: "names hidden by canon below 720 px" }, /* @__PURE__ */ React$1.createElement(Card, { m: M10, kind: "today", initial: M10.turns.length })))
    },
    {
      id: "a",
      tab: "1 · A",
      n: "1",
      title: "A: vertical list on phones",
      cap: "One row per room: number on a rule, the full name wrapping, then its dice at 44 px; the held roll stays above, as today.",
      frames: () => [
        ...PHONES.map(([w]) => /* @__PURE__ */ React$1.createElement(Frame, { key: w, w, card: phone(w), note: "held roll above the list" }, /* @__PURE__ */ React$1.createElement(Card, { m: M10, kind: "list", initial: M10.turns.length }))),
        /* @__PURE__ */ React$1.createElement(Frame, { key: "press", w: 390, card: 358, clip: 844, scroll: "held", note: "after pressing a die in the shrine cavern, the page scrolls up to the held roll (the die is now off screen)" }, /* @__PURE__ */ React$1.createElement(Card, { m: M10, kind: "list", initial: press10 }))
      ]
    },
    {
      id: "a-inline",
      tab: "2 · A inline",
      n: "2",
      title: "A-inline: the pressed room opens its own roll",
      cap: "The held roll opens under the room that was pressed, so there is no card above to scroll to; this changes the ratified held-roll position on phones.",
      frames: () => [/* @__PURE__ */ React$1.createElement(Frame, { key: "i", w: 390, card: 358, clip: 844, scroll: "end", note: "pressed a die in the shrine cavern, the last room" }, /* @__PURE__ */ React$1.createElement(Card, { m: M10, kind: "inline", initial: press10 }))]
    },
    {
      id: "b",
      tab: "3 · B",
      n: "3",
      title: "B: horizontal rows on phones, no names",
      cap: "The now card's rule on the session route: balanced rows of 44 px columns, a room number and its dice, no names.",
      frames: () => PHONES.map(([w]) => /* @__PURE__ */ React$1.createElement(Frame, { key: w, w, card: phone(w), note: "rows shared evenly, held roll above" }, /* @__PURE__ */ React$1.createElement(Card, { m: M10, kind: "rows", initial: M10.turns.length })))
    },
    {
      id: "c",
      tab: "4 · C",
      n: "4",
      title: "C: desktop and tablet, horizontal with names",
      cap: "From 720 px of card up the route keeps its names; where 80 px columns do not fit it wraps into balanced rows, and a 768 window (card under 720) takes the vertical list.",
      frames: () => [
        /* @__PURE__ */ React$1.createElement(Frame, { key: "1440", w: 1440, card: 1152, note: "10 rooms, one row of 81 px columns" }, /* @__PURE__ */ React$1.createElement(Card, { m: M10, kind: "named", initial: M10.turns.length })),
        /* @__PURE__ */ React$1.createElement(Frame, { key: "1024", w: 1024, card: 976, note: "10 rooms wrap into 5 and 5" }, /* @__PURE__ */ React$1.createElement(Card, { m: M10, kind: "named", initial: M10.turns.length })),
        /* @__PURE__ */ React$1.createElement(Frame, { key: "768", w: 768, card: 720, note: "inside the card, 686 px: under 720, so the list" }, /* @__PURE__ */ React$1.createElement(Card, { m: M10, kind: "list", initial: M10.turns.length }))
      ]
    },
    {
      id: "a-12",
      tab: "5 · A, 12",
      n: "5",
      title: "A at 12 stops, 280 px",
      cap: "Headroom: 12 rooms in the vertical list on the narrowest phone; the page grows downward and nothing breaks.",
      frames: () => [/* @__PURE__ */ React$1.createElement(Frame, { key: "12", w: 280, card: 248, note: "12 rooms" }, /* @__PURE__ */ React$1.createElement(Card, { m: M12, kind: "list", initial: M12.turns.length }))]
    },
    {
      id: "closed",
      tab: "6 · Closed rooms",
      n: "6",
      title: "Closed rooms: tap a room on the path to open it",
      cap: "Quick and dirty, from the low-fi pick. Every room is one line with a tally of its dice; tap a line to open that room (one at a time), tap a die and its roll opens under it. Starts with the last room open.",
      frames: () => [/* @__PURE__ */ React$1.createElement(Frame, { key: "390", w: 390, card: 358, note: "a 390 phone" }, /* @__PURE__ */ React$1.createElement(CList, { m: M10, initial: press10 })), /* @__PURE__ */ React$1.createElement(Frame, { key: "280", w: 280, card: 248, note: "a 280 phone" }, /* @__PURE__ */ React$1.createElement(CList, { m: M10, initial: press10 }))]
    },
    {
      id: "km-now",
      tab: "7a · Now card rule",
      n: "7a",
      title: "Key moments on a closed line: the Now card's rule",
      cap: "As Delve's Now card already draws a room: its key moments as small dice you can press, its other rolls as dots (green strong, yellow weak, a ring for a miss). Pressing a key die opens the room on that roll.",
      frames: () => [/* @__PURE__ */ React$1.createElement(Frame, { key: "390", w: 390, card: 358, note: "a 390 phone" }, /* @__PURE__ */ React$1.createElement(CList, { m: M10, initial: press10, mode: "now" }))]
    },
    {
      id: "km-dots",
      tab: "7b · Dots",
      n: "7b",
      title: "Key moments on a closed line: dots only",
      cap: "Every roll a dot; a key moment is a bigger ringed dot. Quietest; nothing on the line is pressable but the room.",
      frames: () => [/* @__PURE__ */ React$1.createElement(Frame, { key: "390", w: 390, card: 358, note: "a 390 phone" }, /* @__PURE__ */ React$1.createElement(CList, { m: M10, initial: press10, mode: "dots" }))]
    },
    {
      id: "km-hex",
      tab: "7c · Tiny dice",
      n: "7c",
      title: "Key moments on a closed line: tiny dice",
      cap: "Every roll a tiny die (18 px) and a key moment a bigger one (30 px), all pressable. Most Delve-looking, busiest; numbers at 18 px are hard to read.",
      frames: () => [/* @__PURE__ */ React$1.createElement(Frame, { key: "390", w: 390, card: 358, note: "a 390 phone" }, /* @__PURE__ */ React$1.createElement(CList, { m: M10, initial: press10, mode: "hex" }))]
    }
  ];
  const App = () => {
    const read = () => {
      const h = (window.location.hash || "").replace("#", "");
      return VERSIONS.some((v2) => v2.id === h) ? h : "today";
    };
    const [id, setId] = React$1.useState(read);
    React$1.useEffect(() => {
      const f = () => setId(read());
      window.addEventListener("hashchange", f);
      return () => window.removeEventListener("hashchange", f);
    }, []);
    const v = VERSIONS.find((x) => x.id === id);
    return /* @__PURE__ */ React$1.createElement("main", { className: "cv" }, /* @__PURE__ */ React$1.createElement("header", { className: "cv-head" }, /* @__PURE__ */ React$1.createElement("h1", null, "Delve route: a long run, long room names"), /* @__PURE__ */ React$1.createElement("p", null, "The route of the rooms a run passed through, with their dice. Sample run: the Goblin Warren, 10 rooms stood in (12 on the last tab), names up to 32 characters. Press any die.")), /* @__PURE__ */ React$1.createElement("nav", { className: "cv-tabs", role: "tablist", "aria-label": "Versions" }, VERSIONS.map((x) => /* @__PURE__ */ React$1.createElement("button", { key: x.id, type: "button", role: "tab", "aria-selected": x.id === id, className: x.id === id ? "is-on" : "", onClick: () => {
      window.location.hash = x.id;
      setId(x.id);
    } }, x.tab))), /* @__PURE__ */ React$1.createElement("section", { className: "cv-ver", key: id }, /* @__PURE__ */ React$1.createElement("h2", null, /* @__PURE__ */ React$1.createElement("span", { className: "cv-n" }, v.n), v.title), /* @__PURE__ */ React$1.createElement("p", { className: "cv-cap" }, v.cap), v.frames()));
  };
  client.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React$1.createElement(App, null));
})(React, ReactDOM);
