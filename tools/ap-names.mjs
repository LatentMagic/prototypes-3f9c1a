#!/usr/bin/env node
// Guard for After Pixels canon's modules: `npm run build` runs it first.
//
//   node tools/ap-names.mjs --check    exit 1 on any problem
//   node tools/ap-names.mjs            the same, plus each file's imports
//   node tools/ap-names.mjs --order    the init order: what each init sets, which earlier inits it needs (also checked)
//
// A forgotten import builds cleanly (the bundle is one scope) and throws only when the screen that
// uses it renders, so this fails the build on: a name another file declares used without an import;
// a read or write of `window.<name>` for a name some file declares (the external interface excepted);
// an assignment to an identifier nothing declares; a name declared by two files; an init that main.jsx runs
// before one it needs, or never calls (tools/ap-init-order.mjs).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import { analyzeInitOrder } from './ap-init-order.mjs';

const traverse = _traverse.default || _traverse;
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'app', 'after-pixels', 'canon', 'app');
const showOrder = process.argv.includes('--order');
const verbose = !process.argv.includes('--check') && !showOrder;
const EXTERNAL = new Set(['KIT_STATES', 'KIT_STATE_NOTES', 'kitGoState', 'gsApi', 'KitCandidate', '__gsTrap', 'MCPGameStoreDesignSystem_ef1abd']);

const files = fs.readdirSync(dir).filter((f) => /\.(jsx|js)$/.test(f)).sort();
const ast = {}; const declaredIn = new Map(); const problems = [];
const isWindow = (n) => n && n.type === 'Identifier' && n.name === 'window';
const names = (n) => {
  if (n.id && (n.type === 'FunctionDeclaration' || n.type === 'ClassDeclaration')) return [n.id.name];
  const out = [];
  const pat = (p) => {
    if (p.type === 'Identifier') out.push(p.name);
    else if (p.type === 'ObjectPattern') p.properties.forEach((x) => pat(x.value || x.argument));
    else if (p.type === 'ArrayPattern') p.elements.forEach((x) => x && pat(x));
    else if (p.type === 'AssignmentPattern') pat(p.left);
    else if (p.type === 'RestElement') pat(p.argument);
  };
  (n.declarations || []).forEach((d) => pat(d.id));
  return out;
};
for (const f of files) {
  ast[f] = parse(fs.readFileSync(path.join(dir, f), 'utf8'), { sourceType: 'module', plugins: ['jsx'] });
  for (const n of ast[f].program.body) {
    const d = n.type === 'ExportNamedDeclaration' ? n.declaration : n;
    if (d && ['FunctionDeclaration', 'ClassDeclaration', 'VariableDeclaration'].includes(d.type)) for (const name of names(d)) {
      if (declaredIn.has(name)) problems.push(`${f}: ${name} is also declared in ${declaredIn.get(name)}`);
      declaredIn.set(name, f);
    }
  }
}
for (const f of files) {
  const uses = new Map();
  const use = (name, line) => { const o = declaredIn.get(name); if (o && o !== f) problems.push(`${f}:${line} uses ${name} (declared in ${o}) without importing it`); };
  traverse(ast[f], {
    Identifier(p) {
      if (p.isReferencedIdentifier() && !p.scope.hasBinding(p.node.name, true)) use(p.node.name, p.node.loc.start.line);
    },
    JSXIdentifier(p) {
      const par = p.parent; const isTag = (par.type === 'JSXOpeningElement' || par.type === 'JSXClosingElement') && par.name === p.node;
      const isObj = par.type === 'JSXMemberExpression' && par.object === p.node;
      if ((isTag || isObj) && (isObj || /^[A-Z]/.test(p.node.name)) && !p.scope.hasBinding(p.node.name, true)) use(p.node.name, p.node.loc.start.line);
    },
    MemberExpression(p) {
      const n = p.node;
      if (isWindow(n.object) && !n.computed && declaredIn.has(n.property.name) && !EXTERNAL.has(n.property.name)) problems.push(`${f}:${n.loc.start.line} reads or writes window.${n.property.name}; import it instead`);
    },
    AssignmentExpression(p) {
      const l = p.node.left;
      if (l.type === 'Identifier' && !p.scope.hasBinding(l.name, true)) problems.push(`${f}:${l.loc.start.line} assigns to undeclared ${l.name}`);
    },
    ImportDeclaration(p) { if (verbose) uses.set(p.node.source.value, p.node.specifiers.map((s) => s.local.name)); },
  });
  if (verbose) { console.log(`== ${f}`); for (const [from, ns] of uses) console.log(`  from ${from}: ${ns.join(' ')}`); }
}
const init = analyzeInitOrder({ ast, files });
problems.push(...init.problems);
if (showOrder) console.log(init.report);
if (problems.length) { console.error(problems.join('\n')); console.error(`${problems.length} problem(s)`); process.exit(1); }
if (verbose) console.log(`ok: ${files.length} files, ${declaredIn.size} names`);
