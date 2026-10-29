#!/usr/bin/env node
// Name report for After Pixels canon: how the no-build files share names.
//
//   node tools/ap-names.mjs            print the report
//   node tools/ap-names.mjs --check    print only the problems; exit 1 if any
//
// Files are read in index.html's tag order, because that order is the
// behaviour: each `text/babel` top-level declaration is a `window` property,
// and a later `window.X = ...` replaces it for every file.
//
// Per file it lists: top-level declarations; free references to names another
// file declares; `window.<name>` reads and writes; top-level statements that
// are not declarations; names published by more than one file; assignments to
// identifiers no file declares in scope (an error in strict-mode modules).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';

const traverse = _traverse.default || _traverse;
const canon = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'app', 'after-pixels', 'canon');
const check = process.argv.includes('--check');

const html = fs.readFileSync(path.join(canon, 'index.html'), 'utf8');
const files = [...html.matchAll(/<script type="text\/babel" src="app\/([^"]+)"/g)].map((m) => m[1]);

// Names the browser or React supplies; never canon's.
const BROWSER = new Set(['React', 'ReactDOM', 'window', 'document', 'undefined']);

const info = {};
for (const f of files) {
  const code = fs.readFileSync(path.join(canon, 'app', f), 'utf8');
  const ast = parse(code, { sourceType: 'script', plugins: ['jsx'] });
  info[f] = { ast, decls: new Set(), pubs: new Map(), winReads: [], other: [], free: [], loadTime: [], undeclared: [] };
}

const declNames = (node) => {
  if (node.type === 'FunctionDeclaration' || node.type === 'ClassDeclaration') return [node.id.name];
  const out = [];
  const pat = (p) => {
    if (p.type === 'Identifier') out.push(p.name);
    else if (p.type === 'ObjectPattern') p.properties.forEach((x) => pat(x.value || x.argument));
    else if (p.type === 'ArrayPattern') p.elements.forEach((x) => x && pat(x));
    else if (p.type === 'AssignmentPattern') pat(p.left);
    else if (p.type === 'RestElement') pat(p.argument);
  };
  node.declarations.forEach((d) => pat(d.id));
  return out;
};
const isDecl = (n) => ['FunctionDeclaration', 'ClassDeclaration', 'VariableDeclaration'].includes(n.type);
const isWindow = (n) => n && n.type === 'Identifier' && n.name === 'window';
const line = (n) => n.loc.start.line;
// `Object.assign(window, { A, B })`: the file's own declarations put on window. A bare declaration is already
// a window property under Babel, so this changes nothing today; the module step drops it.
const isExport = (n) => n.type === 'ExpressionStatement' && n.expression.type === 'CallExpression'
  && n.expression.callee.type === 'MemberExpression' && n.expression.callee.object.name === 'Object' && n.expression.callee.property.name === 'assign'
  && isWindow(n.expression.arguments[0]) && n.expression.arguments.length === 2 && n.expression.arguments[1].type === 'ObjectExpression'
  && n.expression.arguments[1].properties.every((p) => p.type === 'ObjectProperty' && p.value.type === 'Identifier' && p.key.name === p.value.name);

// Pass 1: declarations and publishers.
const declaredIn = new Map(); // name -> file
for (const f of files) {
  const r = info[f];
  for (const node of r.ast.program.body) {
    if (isDecl(node)) for (const n of declNames(node)) {
      r.decls.add(n);
      if (declaredIn.has(n)) r.other.push(`line ${line(node)}: redeclares ${n} (also in ${declaredIn.get(n)})`);
      declaredIn.set(n, f);
    }
  }
}

// Pass 2: window writes/reads, free references, load-time reads, bad assigns.
const writePub = (r, f, name, valueNode, ln) => {
  const own = valueNode && valueNode.type === 'Identifier' && valueNode.name === name && r.decls.has(name);
  if (!r.pubs.has(name)) r.pubs.set(name, []);
  const alias = !own && valueNode && valueNode.type === 'Identifier' && r.decls.has(valueNode.name);
  r.pubs.get(name).push({ line: ln, own, alias: alias ? valueNode.name : null });
};
for (const f of files) {
  const r = info[f];
  traverse(r.ast, {
    AssignmentExpression(p) {
      const l = p.node.left;
      if (l.type === 'MemberExpression' && isWindow(l.object) && !l.computed) {
        writePub(r, f, l.property.name, p.node.right, line(p.node));
      } else if (l.type === 'Identifier' && !p.scope.hasBinding(l.name)) {
        r.undeclared.push(`line ${line(p.node)}: assigns to undeclared ${l.name}`);
      }
    },
    UpdateExpression(p) {
      const a = p.node.argument;
      if (a.type === 'Identifier' && !p.scope.hasBinding(a.name)) r.undeclared.push(`line ${line(p.node)}: updates undeclared ${a.name}`);
    },
    CallExpression(p) {
      const c = p.node.callee;
      if (c.type === 'MemberExpression' && c.object.name === 'Object' && c.property.name === 'assign' && isWindow(p.node.arguments[0])) {
        for (const arg of p.node.arguments.slice(1)) {
          if (arg.type !== 'ObjectExpression') { r.other.push(`line ${line(p.node)}: Object.assign(window, <non-literal>)`); continue; }
          for (const prop of arg.properties) {
            if (prop.type === 'ObjectProperty') writePub(r, f, prop.key.name || prop.key.value, prop.value, line(prop));
            else r.other.push(`line ${line(prop)}: Object.assign(window, spread or method)`);
          }
        }
      }
    },
    MemberExpression(p) {
      const n = p.node;
      if (!isWindow(n.object) || n.computed) return;
      const par = p.parent;
      const isWrite = par.type === 'AssignmentExpression' && par.left === n;
      if (!isWrite) r.winReads.push(`line ${line(n)}: window.${n.property.name}`);
    },
    Identifier(p) {
      const name = p.node.name;
      if (!p.isReferencedIdentifier() || BROWSER.has(name) || p.scope.hasBinding(name)) return;
      const owner = declaredIn.get(name);
      if (!owner || owner === f) return;
      r.free.push({ name, owner, line: line(p.node) });
      if (!p.getFunctionParent()) r.loadTime.push(`line ${line(p.node)}: reads ${name} (${owner}) at load`);
    },
  });
  // Top-level statements that are not declarations.
  for (const node of r.ast.program.body) {
    if (isDecl(node) || isExport(node)) continue;
    r.other.push(`line ${line(node)}: ${node.type}${node.expression ? ' ' + code(f, node) : ''}`);
  }
}
function code(f, node) {
  const src = fs.readFileSync(path.join(canon, 'app', f), 'utf8').slice(node.start, node.end).split('\n')[0];
  return src.length > 90 ? src.slice(0, 90) + '...' : src;
}

// Multi-publisher: a name declared in one file and replaced/published by another,
// or published by several files. A file's own `window.X = X` is not a second publisher.
const publishers = new Map(); // name -> [{file, how, line}]
const aliases = [];
for (const f of files) {
  const r = info[f];
  for (const n of r.decls) {
    if (!publishers.has(n)) publishers.set(n, []);
    publishers.get(n).push({ file: f, how: 'declares' });
  }
  for (const [n, list] of r.pubs) for (const w of list) {
    if (w.own) continue;
    if (w.alias) aliases.push(`${f}:${w.line} window.${n} = ${w.alias}`);
    if (!publishers.has(n)) publishers.set(n, []);
    publishers.get(n).push({ file: f, how: `window.${n} =`, line: w.line });
  }
}
const multi = [...publishers].filter(([, l]) => l.length > 1);

// Report.
const problems = [];
const out = [];
out.push(`After Pixels canon names, ${files.length} files in tag order`, '');
for (const f of files) {
  const r = info[f];
  out.push(`== ${f}`);
  out.push(`declares (${r.decls.size}): ${[...r.decls].join(' ')}`);
  const ext = new Map();
  for (const x of r.free) { if (!ext.has(x.owner)) ext.set(x.owner, new Set()); ext.get(x.owner).add(x.name); }
  for (const [o, s] of ext) out.push(`uses from ${o}: ${[...s].join(' ')}`);
  const wr = [...r.pubs].flatMap(([n, l]) => l.map((w) => `${n}${w.own ? '' : ' (override)'}@${w.line}`));
  if (wr.length) out.push(`window writes: ${wr.join(' ')}`);
  if (r.winReads.length) out.push(`window reads: ${r.winReads.join('; ')}`);
  if (r.other.length) { out.push('top-level non-declarations:'); r.other.forEach((x) => out.push(`  ${x}`)); }
  if (r.loadTime.length) { out.push('load-time reads of other files:'); r.loadTime.forEach((x) => out.push(`  ${x}`)); }
  if (r.undeclared.length) { out.push('undeclared assignments:'); r.undeclared.forEach((x) => out.push(`  ${x}`)); }
  out.push('');
}
out.push(`== names with more than one publisher (${multi.length})`);
for (const [n, l] of multi) out.push(`${n}: ${l.map((p) => `${p.file}${p.line ? ':' + p.line : ''} ${p.how}`).join(' -> ')}`);
out.push('', `== names published under another local name (${aliases.length})`, ...aliases);
const nUndecl = files.reduce((s, f) => s + info[f].undeclared.length, 0);
const nOther = files.reduce((s, f) => s + info[f].other.length, 0);
out.push('', `summary: multi-publisher ${multi.length}, aliased ${aliases.length}, undeclared assignments ${nUndecl}, top-level non-declarations ${nOther}`);

if (multi.length) problems.push(`${multi.length} names with several publishers`);
if (nUndecl) problems.push(`${nUndecl} undeclared assignments`);
if (aliases.length) problems.push(`${aliases.length} names published under another local name`);
if (check) {
  if (problems.length) { console.error(problems.join('; ')); process.exit(1); }
} else console.log(out.join('\n'));
