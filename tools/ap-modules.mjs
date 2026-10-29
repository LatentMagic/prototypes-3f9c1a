#!/usr/bin/env node
// One-off codemod: After Pixels canon from no-build `window` scripts to ES modules.
// Run once, on the step-2 files, then delete the output's reliance on it. It rewrites each
// app/*.jsx in place by source splicing (formatting kept): drops `Object.assign(window, ...)`,
// turns `window.<canon name>` into the bare name, adds an `import` for every canon name a file
// uses from another file, and `export`s what other files import.
//
// Load-time code keeps today's order. A top-level statement, or a declaration that is not a function, runs at
// load; once a file has one that reads another file's names, it and everything after it in the file moves into
// `init<File>()`, and main.jsx calls the init functions in index.html's tag order. A declaration that moves
// becomes `let` and is assigned there. What stays at module level is function-like, so evaluation order
// between modules cannot change a result.
//
// Tag order comes from index.html's text/babel scripts, so run it before index.html is edited.
//   node tools/ap-modules.mjs [--hook]    --hook also adds a temporary window.__seeds to main.jsx

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';

const traverse = _traverse.default || _traverse;
const canon = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'app', 'after-pixels', 'canon');
const hook = process.argv.includes('--hook');
const html = fs.readFileSync(path.join(canon, 'index.html'), 'utf8');
const files = [...html.matchAll(/<script type="text\/babel" src="app\/([^"]+)"/g)].map((m) => m[1]);

// Still on `window`: read by tools/check.js, scripts and agents, or by the page itself.
const EXTERNAL = new Set(['KIT_STATES', 'KIT_STATE_NOTES', 'kitGoState', 'gsApi', 'KitCandidate', '__gsTrap', 'MCPGameStoreDesignSystem_ef1abd']);
const REGISTRY = ['GS_LIBRARY', 'GS_SESSION_BODY', 'GS_SESSION_QUIET'];
const WINDOW_DESTRUCTURE = { 'gs-config.jsx': ['ConfigGroup', 'ConfigRow'], 'gs-pass-aids.jsx': ['ConfigGroup', 'ConfigRow'] };

const isWindow = (n) => n && n.type === 'Identifier' && n.name === 'window';
const src = {}; const ast = {};
for (const f of files) { src[f] = fs.readFileSync(path.join(canon, 'app', f), 'utf8'); ast[f] = parse(src[f], { sourceType: 'script', plugins: ['jsx'] }); }

const declNames = (n) => {
  if (n.type === 'FunctionDeclaration' || n.type === 'ClassDeclaration') return [n.id.name];
  const out = [];
  const pat = (p) => {
    if (p.type === 'Identifier') out.push(p.name);
    else if (p.type === 'ObjectPattern') p.properties.forEach((x) => pat(x.value || x.argument));
    else if (p.type === 'ArrayPattern') p.elements.forEach((x) => x && pat(x));
    else if (p.type === 'AssignmentPattern') pat(p.left);
    else if (p.type === 'RestElement') pat(p.argument);
  };
  n.declarations.forEach((d) => pat(d.id));
  return out;
};
const isDecl = (n) => ['FunctionDeclaration', 'ClassDeclaration', 'VariableDeclaration'].includes(n.type);
const isExportStmt = (n) => n.type === 'ExpressionStatement' && n.expression.type === 'CallExpression'
  && n.expression.callee.type === 'MemberExpression' && n.expression.callee.object.name === 'Object' && n.expression.callee.property.name === 'assign'
  && isWindow(n.expression.arguments[0]);

const declaredIn = new Map(REGISTRY.map((n) => [n, 'registry.js']));
for (const f of files) for (const n of ast[f].program.body) if (isDecl(n)) for (const name of declNames(n)) {
  if (declaredIn.has(name)) throw new Error(`${name} declared twice`);
  declaredIn.set(name, f);
}

const edits = {}; const needs = {}; const usesReact = {}; const unresolved = [];
for (const f of files) {
  edits[f] = []; needs[f] = new Map(); usesReact[f] = false;
  const need = (name, local = f) => { const owner = declaredIn.get(name); if (owner && owner !== local) needs[f].set(name, owner); };
  for (const n of ast[f].program.body) {
    if (isExportStmt(n)) {
      const a = n.expression.arguments;
      if (a.length !== 2 || a[1].type !== 'ObjectExpression' || !a[1].properties.every((p) => p.type === 'ObjectProperty' && p.value.type === 'Identifier' && p.key.name === p.value.name)) throw new Error(`${f}: Object.assign(window) is not a plain export list`);
      for (const pr of a[1].properties) if (declaredIn.get(pr.key.name) !== f) throw new Error(`${f}: exports ${pr.key.name}, which it does not declare`);
      edits[f].push([n.start, n.end + (src[f][n.end] === '\n' ? 1 : 0), '']);
    }
  }
  traverse(ast[f], {
    MemberExpression(p) {
      const n = p.node;
      if (!isWindow(n.object) || n.computed || p.scope.hasBinding('window')) return;
      const name = n.property.name;
      if (EXTERNAL.has(name) || !declaredIn.has(name)) { if (!EXTERNAL.has(name) && !/^(history|location|parent|innerWidth|innerHeight|addEventListener|removeEventListener|matchMedia|open|getSelection|ResizeObserver)$/.test(name)) unresolved.push(`${f}:${n.loc.start.line} window.${name}`); return; }
      if (p.parent.type === 'AssignmentExpression' && p.parent.left === n) throw new Error(`${f}:${n.loc.start.line} writes window.${name}`);
      const decl = p.parentPath.parentPath;
      if (p.parent.type === 'VariableDeclarator' && p.parent.id.type === 'Identifier' && p.parent.id.name === name && decl.node.declarations.length === 1) {
        edits[f].push([decl.node.start, decl.node.end, '']); need(name); return; // `const X = window.X;` inside a function: X is the import
      }
      edits[f].push([n.start, n.end, name]); need(name);
    },
    JSXMemberExpression(p) {
      const n = p.node;
      if (n.object.type === 'JSXIdentifier' && n.object.name === 'window' && declaredIn.has(n.property.name)) { edits[f].push([n.start, n.end, n.property.name]); need(n.property.name); }
    },
    Identifier(p) {
      if (!p.isReferencedIdentifier()) return;
      const name = p.node.name;
      if (name === 'React') usesReact[f] = true;
      if (!p.scope.hasBinding(name)) need(name);
    },
    JSXIdentifier(p) {
      const name = p.node.name; const par = p.parent;
      const isTag = (par.type === 'JSXOpeningElement' || par.type === 'JSXClosingElement') && par.name === p.node;
      const isObj = par.type === 'JSXMemberExpression' && par.object === p.node;
      if ((isTag || isObj) && /^[A-Z_a-z]/.test(name) && (isObj || /^[A-Z]/.test(name)) && !(name === 'window' && isObj) && !p.scope.hasBinding(name)) need(name);
    },
    JSXElement() { usesReact[f] = true; },
    JSXFragment() { usesReact[f] = true; },
  });
  if (WINDOW_DESTRUCTURE[f]) {
    const code = src[f]; const m = code.match(/const \{ ConfigGroup: Group, ConfigRow: Row \} = window;/);
    if (!m) throw new Error(`${f}: window destructure not found`);
    edits[f].push([m.index, m.index + m[0].length, 'const Group = ConfigGroup; const Row = ConfigRow;']);
    WINDOW_DESTRUCTURE[f].forEach((n) => need(n));
  }
}

if (hook) for (const [name, owner] of declaredIn) if (owner !== 'main.jsx') needs['main.jsx'].set(name, owner);
// What each file exports: every name another file imports.
const exportsOf = {};
for (const f of files) for (const [name, owner] of needs[f]) (exportsOf[owner] ||= new Set()).add(name);


const importLine = (names, from) => `import { ${[...names].join(', ')} } from './${from}';`;
const initName = (f) => 'init' + f.replace(/\.jsx$/, '').split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join('');
const FN = new Set(['ArrowFunctionExpression', 'FunctionExpression']);
const isFnLike = (n) => n.type === 'VariableDeclaration' && n.declarations.every((d) => d.init && FN.has(d.init.type));
const hasInit = {};

for (const f of files) {
  // Phase A: window.X -> X, drop the window export lists.
  let code = src[f]; const e = edits[f];
  e.sort((a, b) => b[0] - a[0] || b[1] - a[1]);
  for (const [s, t, text] of e) code = code.slice(0, s) + text + code.slice(t);
  if (f === 'main.jsx') code = code.replace('ReactDOM.createRoot(', 'createRoot(');

  // Phase B: which top-level code runs at load and reads another file.
  const ast2 = parse(code, { sourceType: 'module', plugins: ['jsx'] });
  const refsOf = (stmt) => {
    const other = new Set(); const locals = new Set();
    const see = (p, name) => {
      if (p.scope.hasBinding(name, true)) { const b = p.scope.getBinding(name); if (b && b.scope.path.isProgram()) locals.add(name); return; }
      const owner = declaredIn.get(name); if (owner && owner !== f) other.add(name);
    };
    traverse(ast2, {
      Program(pp) {
        const sp = pp.get('body').find((x) => x.node === stmt);
        sp.traverse({
          Identifier(p) { if (p.isReferencedIdentifier()) see(p, p.node.name); },
          JSXIdentifier(p) {
            const par = p.parent; const isTag = (par.type === 'JSXOpeningElement' || par.type === 'JSXClosingElement') && par.name === p.node;
            const isObj = par.type === 'JSXMemberExpression' && par.object === p.node;
            if ((isTag || isObj) && (isObj || /^[A-Z]/.test(p.node.name))) see(p, p.node.name);
          },
        });
        pp.stop();
      },
    });
    return { other, locals };
  };
  let late = false; const lateNames = new Set(); const plan = [];
  for (const n of ast2.program.body) {
    if (n.type === 'FunctionDeclaration') continue;
    if (n.type === 'ClassDeclaration') { if (refsOf(n).other.size) throw new Error(`${f}: class ${n.id.name} reads another file at load`); continue; }
    if (isFnLike(n) && !late) continue;
    if (isFnLike(n) && late) continue;
    const r = refsOf(n);
    if (late || r.other.size || [...r.locals].some((x) => lateNames.has(x))) {
      late = true; plan.push(n);
      if (n.type === 'VariableDeclaration') declNames(n).forEach((x) => lateNames.add(x));
    }
  }
  const lines = code.split('\n');
  const lineStart = (n) => { // include the comment lines directly above (no blank line between)
    const ln = n.loc.start.line - 1; const off = lines.slice(0, ln).join('\n').length + (ln > 0 ? 1 : 0);
    if (code.slice(off, n.start).trim() !== '') return n.start;
    let i = ln; while (i > 0 && lines[i - 1].trim().startsWith('//')) i--;
    return lines.slice(0, i).join('\n').length + (i > 0 ? 1 : 0);
  };
  const bodies = []; const cuts = [];
  for (const n of plan) {
    const start = lineStart(n); const comment = code.slice(start, n.start); let body; let hoist = '';
    if (n.type === 'VariableDeclaration') {
      const names = declNames(n);
      const exp = exportsOf[f] && names.some((x) => exportsOf[f].has(x));
      hoist = `${exp ? 'export ' : ''}let ${names.join(', ')};`;
      body = n.declarations.filter((d) => d.init).map((d) => {
        const init = code.slice(d.init.start, d.init.end);
        return d.id.type === 'Identifier' ? `${d.id.name} = ${init};` : `(${code.slice(d.id.start, d.id.end)} = ${init});`;
      }).join('\n');
    } else body = code.slice(n.start, n.end) + (code[n.end - 1] === ';' || code[n.end - 1] === '}' ? '' : '');
    bodies.push(comment + body);
    cuts.push([start, n.end, hoist]);
  }
  // exports on what stays
  const keeps = ast2.program.body.filter((n) => !plan.includes(n) && isDecl(n) && declNames(n).some((x) => exportsOf[f] && exportsOf[f].has(x)));
  const all = [...cuts.map(([s, t, h]) => [s, t, h]), ...keeps.map((n) => [n.start, n.start, 'export '])];
  all.sort((a, b) => b[0] - a[0] || b[1] - a[1]);
  for (const [s, t, text] of all) code = code.slice(0, s) + text + code.slice(t);
  if (plan.length) { hasInit[f] = true; code = code.replace(/\s*$/, '\n') + `\n// Load-time code, run by main.jsx in index.html's old tag order.\nexport function ${initName(f)}() {\n${bodies.join('\n')}\n}\n`; }

  // imports after the leading comment block
  const ls = code.split('\n'); let i = 0;
  while (i < ls.length && (ls[i].startsWith('//') || ls[i].trim() === '')) i++;
  const imp = [];
  if (usesReact[f]) imp.push("import React from 'react';");
  if (f === 'main.jsx') imp.push("import { createRoot } from 'react-dom/client';", "import './canon.css';");
  const byFile = new Map();
  for (const [name, owner] of needs[f]) (byFile.get(owner) || byFile.set(owner, []).get(owner)).push(name);
  const order = [...byFile.keys()].sort((a, b) => (a === 'registry.js') - (b === 'registry.js') || files.indexOf(a) - files.indexOf(b));
  for (const o of order) imp.push(importLine(byFile.get(o), o));
  ls.splice(i, 0, ...imp, '');
  fs.writeFileSync(path.join(canon, 'app', f), ls.join('\n'));
}
// main.jsx: import the init functions, call them in tag order, then main's own.
{
  const f = 'main.jsx'; let code = fs.readFileSync(path.join(canon, 'app', f), 'utf8');
  const inits = files.filter((x) => hasInit[x] && x !== f);
  const imps = files.filter((x) => x !== f).map((x) => (hasInit[x] ? `import { ${initName(x)} } from './${x}';` : `import './${x}';`));
  const ls = code.split('\n'); const k = ls.findIndex((l) => l.startsWith("import './canon.css'")) + 1;
  ls.splice(k, 0, ...imps);
  code = ls.join('\n');
  if (hasInit[f]) code = code.replace(`export function ${initName(f)}() {`, `function ${initName(f)}() {`);
  code += `\n${inits.map((x) => `${initName(x)}();`).join('\n')}\n${hasInit[f] ? `${initName(f)}();\n` : ''}`;
  if (hook) code += `\nwindow.__seeds = { ${[...declaredIn.keys()].join(', ')} };\n`;
  fs.writeFileSync(path.join(canon, 'app', f), code);
}
fs.writeFileSync('/private/tmp/claude-501/ap-modules-unresolved.txt', unresolved.join('\n'));
console.log(`${files.length} files rewritten; ${Object.keys(hasInit).length} with init functions; ${unresolved.length} unresolved window reads`);
