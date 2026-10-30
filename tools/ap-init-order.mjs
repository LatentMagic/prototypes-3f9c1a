// Init-order analysis for After Pixels canon, used by tools/ap-names.mjs (`--check` and `--order`).
//
// Each file's load-time code lives in an exported `init<File>()` that main.jsx calls in a fixed order. This
// works out, statically, what every init SETS (assigns a shared binding, mutates a shared object or array,
// writes `window.<name>`) and what it READS, from the init body plus the functions it calls on the way
// (callbacks of forEach/map/etc. count; callbacks and components that run later do not). From that:
//
//   init A needs init B   when A reads a name B sets, and B does not read anything A sets.
//
// A name is a shared binding, narrowed to its first static key: `GS_LIBRARY.delve` and `GS_LIBRARY.word` do
// not meet, `GS_LIBRARY[id]` (a computed key) meets every key of GS_LIBRARY. `Object.assign(X, …)` and
// `Object.defineProperties(X, …)` set every key of X (`X.*`, certain to meet any read of X). A method call on
// the binding itself (`X.map(…)`, `X.includes(…)`) or `X.length` reads the whole value, so it meets `X.push(…)`.
//
// What it cannot decide is reported, never guessed:
//   - two inits that both read and set overlapping names (a wrap of a wrap): the order matters, direction unknown;
//   - two inits that set overlapping names and read nothing of each other's (last write wins): direction unknown;
//   - a shared binding passed as an argument to a call the analysis cannot follow;
//   - a local alias taken from a shared object more than five hops deep.
// `--check` fails on any of these, and on any init that runs before one it needs, except the pairs in ACCEPTED.
// Not analysed: top-level code outside an init (the codemod left only function-like declarations there),
// functions reached through values rather than names, and runtime-computed property names beyond `*`.

import _traverse from '@babel/traverse';

const traverse = _traverse.default || _traverse;
const ITER = new Set(['forEach', 'map', 'filter', 'reduce', 'some', 'every', 'flatMap', 'find', 'findIndex', 'sort']);
const MUTATORS = new Set(['push', 'unshift', 'splice', 'set', 'add', 'pop', 'shift', 'sort', 'reverse', 'fill', 'delete', 'clear']);
const OBJECT_WRITERS = new Set(['assign', 'defineProperty', 'defineProperties', 'setPrototypeOf']);
// Writers that may set any key of their target, so a set through them meets every read of it.
const ALL_KEY_WRITERS = new Set(['assign', 'defineProperties']);
const GLOBALS = new Set(['Object', 'Array', 'Math', 'JSON', 'console', 'String', 'Number', 'Boolean', 'Date', 'Set', 'Map', 'Promise', 'Reflect', 'Symbol', 'RegExp', 'Intl']);
const SAFE_METHODS = new Set([...ITER, 'join', 'includes', 'slice', 'concat', 'keys', 'values', 'entries', 'indexOf', 'at', 'get', 'has', 'toString', 'startsWith', 'endsWith', 'replace', 'split', 'trim', 'toLowerCase', 'toUpperCase']);

// Accepted, pre-existing: pairs where main.jsx's order has a reader run before a writer of the same name. Each
// was there when the check learned to see it, and the live page depends on the order as it stands, so `--check`
// passes these and `--order` prints them. Never add one to get a build through: fix the order instead.
//   reader: runs first and reads `name`; setter: runs later and sets it. `both`: each reads what the other sets.
const ACCEPTED = [
  // initGsGame reads GS_NAME.casebook; initGsWhereChainSalvage's Object.assign adds only where/chain/salvage.
  { reader: 'initGsGame', setter: 'initGsWhereChainSalvage', name: 'GS_NAME.*' },
  // The splice finds 'mystery', which is in the base order; the ten more games are pushed after it.
  { reader: 'initGsWhereChainSalvage', setter: 'initGsMoreGames', name: 'GS_GAME_ORDER.*' },
  // ED3 is built before the ten more games are pushed, so their editions lists are not in it.
  { reader: 'initGsEditions', setter: 'initGsMoreGames', name: 'GS_GAME_ORDER.*' },
  // GS_KINDS is built before the ten more games are pushed; initGsMoreGames then extends Discover's GS_LIB_READY.
  { reader: 'initGsDiscover', setter: 'initGsMoreGames', name: 'GS_GAME_ORDER.*', both: true },
  // CPR_STAGE and CPR_SHOWN are built before the ten more games are pushed; initGsMoreGames then extends them.
  { reader: 'initGsPassStore', setter: 'initGsMoreGames', name: 'GS_GAME_ORDER.*', both: true },
];
const accepted = (reader, setter, name, both = false) => ACCEPTED.some((x) => x.reader === reader && x.setter === setter && x.name === name && !!x.both === both);

const isFn = (n) => n && ['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'].includes(n.type);
// A read meets a set of the same shared name when: the set replaced the whole binding; or the read takes the
// whole value; or either key is computed (`*`); or both keys are the same literal. A '#' read only needs the
// binding to exist, so only a whole set meets it.
const overlap = (r, s) => r.root === s.root && (s.whole || (r.key !== '#' && (r.key === null || r.key === '*' || s.key === '*' || r.key === s.key)));
// A strong meet is certain: the set replaced the binding, the read takes the whole value, or both name the same
// literal key. A meet through a computed key (`X[id]`) on either side may or may not be the same entry.
// A set through Object.assign / defineProperties (`all`) is treated as certain to meet any keyed read.
const strong = (r, s) => overlap(r, s) && (s.whole || r.key === null || (s.all && r.key !== '#') || (r.key !== '#' && r.key !== '*' && r.key === s.key));
const label = (k) => (k.key === null || k.key === '#' ? k.root : `${k.root}.${k.key}`);
const sameWrite = (a, b) => a.root === b.root && ((a.whole && b.whole) || (a.key !== null && a.key !== '*' && a.key === b.key));

export function analyzeInitOrder({ ast, files }) {
  // Top-level functions by name (declarations and `const f = () =>`), across every file.
  const functions = new Map(); const initDefs = new Map();
  for (const f of files) {
    for (const n of ast[f].program.body) {
      const d = n.type === 'ExportNamedDeclaration' && n.declaration ? n.declaration : n;
      if (d.type === 'FunctionDeclaration') {
        functions.set(d.id.name, { file: f, node: d });
        if (/^init[A-Z]/.test(d.id.name)) initDefs.set(d.id.name, { file: f, node: d });
      } else if (d.type === 'VariableDeclaration') {
        for (const dc of d.declarations) if (dc.id.type === 'Identifier' && isFn(dc.init)) functions.set(dc.id.name, { file: f, node: dc.init });
      }
    }
  }
  const pathOf = {};
  for (const f of files) traverse(ast[f], { Program(p) { pathOf[f] = p; p.stop(); } });
  const fnPath = ({ file, node }) => {
    let found = null;
    pathOf[file].traverse({ Function(p) { if (p.node === node) { found = p; p.stop(); } } });
    return found;
  };

  // The order main.jsx calls them in.
  const order = [];
  for (const n of ast['main.jsx'].program.body) {
    if (n.type === 'ExpressionStatement' && n.expression.type === 'CallExpression' && n.expression.callee.type === 'Identifier' && initDefs.has(n.expression.callee.name)) {
      order.push({ name: n.expression.callee.name, line: n.loc.start.line });
    }
  }
  const problems = [];
  const called = new Set(order.map((o) => o.name));
  for (const [name, def] of initDefs) if (!called.has(name)) problems.push(`${def.file} exports ${name}() but main.jsx never calls it`);

  // Analyse one init: what it sets and reads.
  const analyse = (name) => {
    const def = initDefs.get(name);
    const sets = []; const reads = []; const unknown = []; const seen = new Set();
    // Events arrive in run order. A read is the init's own need only if nothing it set earlier meets it.
    const setIt = (k, line, file, whole = false) => { if (!sets.some((x) => x.root === k.root && x.key === k.key && x.whole === whole && !!x.all === !!k.all)) sets.push({ ...k, whole, line, file }); };
    const readIt = (k, line, file) => { if (!sets.some((x) => overlap(k, x)) && !reads.some((x) => x.root === k.root && x.key === k.key)) reads.push({ ...k, line, file }); };
    const pending = new Map();
    const defer = (node, fn) => { if (!pending.has(node)) pending.set(node, []); pending.get(node).push(fn); };
    const flush = (p) => { const l = pending.get(p.node); if (l) { l.forEach((fn) => fn()); pending.delete(p.node); } };

    const run = (fp, file) => {
      if (seen.has(fp.node)) return;
      seen.add(fp.node);
      // The shared binding an identifier stands for (module-level or import), following local aliases.
      const sharedRoot = (id, scope) => {
        let cur = id; let key = null;
        for (let hop = 0; hop < 5; hop++) {
          const b = scope.getBinding(cur.name);
          if (!b) return cur.name === 'window' ? { window: true } : null;
          if (b.scope.path.isProgram()) return { root: cur.name, key };
          const init = b.path.isVariableDeclarator() && b.path.node.id.type === 'Identifier' ? b.path.node.init : null;
          if (!init) return null;
          let n = init; let first = null;
          while (n.type === 'MemberExpression') { if (!n.computed && n.property.type === 'Identifier') first = n.property.name; else if (n.computed && n.property.type === 'StringLiteral') first = n.property.value; else first = '*'; n = n.object; }
          if (n.type !== 'Identifier') return null;
          key = key ?? first; cur = n;
        }
        unknown.push(`${file}: alias of a shared object nested more than five deep`);
        return null;
      };
      // From an identifier path: the chain it heads, its first static key, and the node that ends the chain.
      const chainOf = (p) => {
        const props = []; let top = p;
        while (top.parentPath.isMemberExpression() && top.parent.object === top.node) {
          const m = top.parent;
          props.push(!m.computed && m.property.type === 'Identifier' ? m.property.name : m.computed && m.property.type === 'StringLiteral' ? m.property.value : '*');
          top = top.parentPath;
        }
        return { props, top };
      };
      const target = (p) => {
        const root = sharedRoot(p.node, p.scope); if (!root) return null;
        const { props, top } = chainOf(p);
        if (root.window) { const first = props[0]; if (first === undefined) return null; return { k: { root: `window.${first}`, key: props[1] ?? null }, props, top, window: true }; }
        // `X.length` or a method called on X itself (`X.map(…)`) reads the whole value, not a key named after it.
        const wholeRead = root.key === null && props.length === 1 && (props[0] === 'length' || (top.parentPath.isCallExpression() && top.parent.callee === top.node));
        return { k: { root: root.root, key: wholeRead ? null : root.key ?? props[0] ?? null }, props, top };
      };
      const visitor = {
        Function(p) {
          const par = p.parent;
          const runsNow = par.type === 'CallExpression' && (par.callee === p.node || (par.callee.type === 'MemberExpression' && ITER.has(par.callee.property.name)));
          if (!runsNow) p.skip();
        },
        AssignmentExpression: { enter(p) {
          const l = p.node.left;
          const ids = [];
          const pat = (x) => {
            if (!x) return;
            if (x.type === 'Identifier') ids.push(x);
            else if (x.type === 'ObjectPattern') x.properties.forEach((y) => pat(y.value || y.argument));
            else if (x.type === 'ArrayPattern') x.elements.forEach(pat);
            else if (x.type === 'AssignmentPattern') pat(x.left);
            else if (x.type === 'RestElement') pat(x.argument);
          };
          pat(l);
          for (const id of ids) {
            const b = p.scope.getBinding(id.name);
            if (b && b.scope.path.isProgram()) {
              if (p.node.operator !== '=') readIt({ root: id.name, key: null }, id.loc.start.line, file);
              defer(p.node, () => setIt({ root: id.name, key: null }, id.loc.start.line, file, true));
            }
          }
        }, exit: flush },
        UpdateExpression(p) {
          const a = p.node.argument;
          if (a.type === 'Identifier') { const b = p.scope.getBinding(a.name); if (b && b.scope.path.isProgram()) { readIt({ root: a.name, key: null }, a.loc.start.line, file); setIt({ root: a.name, key: null }, a.loc.start.line, file, true); } }
        },
        CallExpression: { exit: flush, enter(p) {
          const c = p.node.callee;
          let followed = null;
          if (c.type === 'Identifier') {
            const b = p.scope.getBinding(c.name);
            if (b && !b.scope.path.isProgram() && (b.path.isFunctionDeclaration() || (b.path.isVariableDeclarator() && isFn(b.path.node.init)))) {
              const inner = b.path.isVariableDeclarator() ? b.path.get('init') : b.path;
              run(inner, file); followed = true;
            } else if (functions.has(c.name) && !initDefs.has(c.name)) {
              const fn = functions.get(c.name); const fp = fnPath(fn); if (fp) { run(fp, fn.file); followed = true; }
            }
          }
          if (!followed) {
            const ok = c.type === 'MemberExpression' && ((c.object.type === 'Identifier' && GLOBALS.has(c.object.name)) || SAFE_METHODS.has(c.property.name) || MUTATORS.has(c.property.name));
            const unsafe = c.type === 'Identifier' || (c.type === 'MemberExpression' && !ok);
            if (unsafe) {
              for (const a of p.node.arguments) {
                if (a.type === 'Identifier') {
                  const b = p.scope.getBinding(a.name);
                  if (b && b.scope.path.isProgram() && !functions.has(a.name) && b.path.isVariableDeclarator() && !isFn(b.path.node.init)) unknown.push(`${file}:${a.loc.start.line} passes ${a.name} to a call the analysis cannot follow`);
                }
              }
            }
          }
        } },
        Identifier(p) {
          if (!p.isReferencedIdentifier()) return;
          const t = target(p); if (!t) return;
          const { top } = t; const line = p.node.loc.start.line;
          const tp = top.parent; const tpp = top.parentPath.parentPath;
          const isLeft = tp.type === 'AssignmentExpression' && tp.left === top.node;
          const isUpdate = tp.type === 'UpdateExpression' || (tp.type === 'UnaryExpression' && tp.operator === 'delete');
          const mut = t.props.length && top.parentPath.isCallExpression() && top.parent.callee === top.node && MUTATORS.has(t.props[t.props.length - 1]);
          const objWrite = top.parentPath.isCallExpression() && top.parent.arguments[0] === top.node && top.parent.callee.type === 'MemberExpression' && top.parent.callee.object.type === 'Identifier' && ['Object', 'Reflect'].includes(top.parent.callee.object.name) && (OBJECT_WRITERS.has(top.parent.callee.property.name) || top.parent.callee.property.name === 'set');
          const exist = () => { if (t.k.key !== null && t.k.key !== '#') readIt({ root: t.k.root, key: '#' }, line, file); };
          // `X.push(...)` / `X.a.push(...)`: the contents of X (or of X.a) change.
          if (mut) { const own = t.props.length === 1; const k = own ? { root: t.k.root, key: '*' } : t.k; defer(top.parent, () => { exist(); setIt(k, line, file); }); return; }
          if (isLeft || isUpdate || objWrite) {
            const whole = t.window && t.props.length === 1;
            const allKeys = objWrite && ALL_KEY_WRITERS.has(top.parent.callee.property.name) && !whole;
            const k = allKeys ? { root: t.k.root, key: t.k.key ?? '*', all: true } : t.window ? { root: t.k.root, key: whole ? null : t.k.key } : t.k;
            const at = objWrite ? top.parent : isLeft ? tp : null;
            if ((isLeft && tp.operator !== '=') || tp.type === 'UpdateExpression') readIt(k, line, file);
            const doSet = () => { if (!whole) exist(); setIt(k, line, file, whole); };
            if (at) defer(at, doSet); else doSet();
            return;
          }
          readIt(t.k, line, file);
        },
        JSXIdentifier(p) {
          const par = p.parent;
          const isTag = (par.type === 'JSXOpeningElement' && par.name === p.node) || (par.type === 'JSXMemberExpression' && par.object === p.node);
          if (!isTag || !/^[A-Z]/.test(p.node.name)) return;
          const b = p.scope.getBinding(p.node.name);
          if (b && b.scope.path.isProgram()) readIt({ root: p.node.name, key: null }, p.node.loc.start.line, file);
        },
      };
      fp.traverse(visitor);
    };
    run(fnPath(def), def.file);
    return { name, file: def.file, line: def.node.loc.start.line, sets, reads, unknown };
  };

  const info = new Map(order.map((o) => [o.name, analyse(o.name)]));
  const pos = new Map(order.map((o, i) => [o.name, i]));
  const hit = (reads, sets, test = strong) => {
    for (const r of reads) for (const s of sets) if (test(r, s)) return { r, s };
    return null;
  };
  // Every name through which A's reads meet B's sets.
  const meets = (reads, sets) => [...new Set(reads.flatMap((r) => sets.filter((s) => strong(r, s)).map(label)))];

  const needs = new Map(order.map((o) => [o.name, []])); const sensitive = []; const computed = [];
  for (const a of order) for (const b of order) {
    if (a.name === b.name) continue;
    const A = info.get(a.name); const B = info.get(b.name);
    const ab = hit(A.reads, B.sets); const ba = hit(B.reads, A.sets);
    if (ab && !ba) needs.get(a.name).push({ on: b.name, via: ab.s, line: ab.s.line, file: ab.s.file });
    else if (ab && ba && pos.get(a.name) < pos.get(b.name)) {
      const open = meets(A.reads, B.sets).filter((n) => !accepted(a.name, b.name, n, true));
      sensitive.push({ a: a.name, b: b.name, via: open.length ? open.join(', ') : meets(A.reads, B.sets).join(', '), accepted: !open.length });
    }
    else if (!ab && !ba && pos.get(a.name) < pos.get(b.name)) {
      const w = A.sets.flatMap((x) => B.sets.filter((y) => sameWrite(x, y)).map((y) => ({ s: y })))[0];
      if (w) sensitive.push({ a: a.name, b: b.name, via: label(w.s), writeOnly: true });
    }
    if (!ab) {
      const weak = hit(A.reads, B.sets, overlap);
      if (weak && !(weak.r.key === '#')) computed.push({ reader: a.name, setter: b.name, name: label(weak.s) });
    }
  }
  const pre = [];
  for (const a of order) for (const on of new Set(needs.get(a.name).map((n) => n.on))) {
    if (pos.get(on) < pos.get(a.name)) continue;
    const all = meets(info.get(a.name).reads, info.get(on).sets);
    const open = all.filter((n) => !accepted(a.name, on, n));
    const n = needs.get(a.name).find((x) => x.on === on && (!open.length || open.includes(label(x.via)))) || needs.get(a.name).find((x) => x.on === on);
    if (open.length) problems.push(`main.jsx:${a.line} ${a.name}() runs before ${on}(), which it needs: it reads ${open.join(', ')}, set by ${on} (${n.file}:${n.line})`);
    else pre.push(`  ${a.name}() runs before ${on}(): reads ${all.join(', ')}`);
  }
  for (const s of sensitive) {
    if (s.accepted) pre.push(`  ${s.a}() then ${s.b}(): both read and set ${s.via}`);
    else problems.push(`main.jsx: order matters between ${s.a}() and ${s.b}() (${s.writeOnly ? 'both set' : 'both read and set'} ${s.via}), direction not determined; make one depend on the other`);
  }
  for (const o of order) for (const u of info.get(o.name).unknown) problems.push(`${o.name}(): UNKNOWN: ${u}`);
  // An accepted pair the code no longer has is stale, so the list cannot hide a new pair under an old name.
  for (const x of ACCEPTED) {
    const live = x.both ? sensitive.some((s) => s.accepted && s.a === x.reader && s.b === x.setter && s.via.split(', ').includes(x.name)) : pre.some((l) => l.startsWith(`  ${x.reader}() runs before ${x.setter}(): `) && l.split(': reads ')[1].split(', ').includes(x.name));
    if (!live) problems.push(`tools/ap-init-order.mjs: ACCEPTED lists ${x.reader}() before ${x.setter}() on ${x.name}, which the code no longer has; remove it`);
  }

  const report = [];
  order.forEach((o, i) => {
    const I = info.get(o.name);
    report.push(`${String(i + 1).padStart(2)}. ${o.name}()  ${I.file}`);
    report.push(`      sets:   ${I.sets.length ? I.sets.map(label).join(', ') : '(nothing shared)'}`);
    const nd = needs.get(o.name);
    report.push(`      needs:  ${nd.length ? [...new Map(nd.map((n) => [n.on, n])).values()].map((n) => `${n.on} (${nd.filter((x) => x.on === n.on).map((x) => label(x.via)).filter((v, j, arr) => arr.indexOf(v) === j).join(', ')})`).join('; ') : '(none)'}`);
    for (const u of I.unknown) report.push(`      UNKNOWN: ${u}`);
  });
  const open = sensitive.filter((s) => !s.accepted);
  if (open.length) {
    report.push('', 'Order matters between these pairs, direction not determined statically (fails --check):');
    for (const s of open) report.push(`  ${s.a}() then ${s.b}(): ${s.writeOnly ? 'both set' : 'both read and set'} ${s.via}`);
  }
  if (pre.length) report.push('', 'Reader before writer, accepted, pre-existing (ACCEPTED in tools/ap-init-order.mjs; keep the current order):', ...pre);
  if (computed.length) {
    report.push('', 'Reads and sets through a computed key (X[id]) may or may not meet; not decided statically, not checked:');
    const by = new Map();
    for (const c of computed) { const k = `${c.reader}() reads ${c.name}`; (by.get(k) || by.set(k, []).get(k)).push(c.setter); }
    for (const [k, v] of by) report.push(`  ${k}; set by ${[...new Set(v)].map((x) => `${x}()`).join(', ')}`);
  }
  return { problems, report: report.join('\n') };
}
