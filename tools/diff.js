#!/usr/bin/env node
'use strict';

// Pixel diff of two screenshot folders.
//
//   npm run diff -- <dirA> <dirB>
//
// Compares same-named PNGs. For each pair that differs, writes a diff image to
// <dirB>/_diff/<name>.png and prints the changed-pixel count. Files present in
// only one folder are listed. Exit 1 if anything differs or is missing.

const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

function pngsIn(dir) {
  return fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.png')).sort();
}

function compare(fileA, fileB, diffPath) {
  const a = PNG.sync.read(fs.readFileSync(fileA));
  const b = PNG.sync.read(fs.readFileSync(fileB));
  if (a.width !== b.width || a.height !== b.height) {
    return { sizeA: `${a.width}x${a.height}`, sizeB: `${b.width}x${b.height}`, changed: null };
  }
  const diff = new PNG({ width: a.width, height: a.height });
  const changed = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.1 });
  if (changed > 0) {
    fs.mkdirSync(path.dirname(diffPath), { recursive: true });
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
  }
  return { changed };
}

function main() {
  const [dirA, dirB] = process.argv.slice(2).map((d) => d && path.resolve(d));
  if (!dirA || !dirB) {
    console.error('usage: npm run diff -- <dirA> <dirB>');
    process.exit(2);
  }
  for (const d of [dirA, dirB]) {
    if (!fs.existsSync(d) || !fs.statSync(d).isDirectory()) {
      console.error(`diff: not a folder: ${d}`);
      process.exit(2);
    }
  }
  const filesA = new Set(pngsIn(dirA));
  const filesB = new Set(pngsIn(dirB));
  const both = [...filesA].filter((f) => filesB.has(f));
  const onlyA = [...filesA].filter((f) => !filesB.has(f));
  const onlyB = [...filesB].filter((f) => !filesA.has(f));

  let differing = 0;
  for (const f of both) {
    const r = compare(path.join(dirA, f), path.join(dirB, f), path.join(dirB, '_diff', f));
    if (r.changed === null) {
      differing++;
      console.log(`DIFF  ${f}  size differs: ${r.sizeA} vs ${r.sizeB}`);
    } else if (r.changed > 0) {
      differing++;
      console.log(`DIFF  ${f}  ${r.changed} pixels changed  -> ${path.join(dirB, '_diff', f)}`);
    }
  }
  for (const f of onlyA) console.log(`ONLY  ${f}  only in ${dirA}`);
  for (const f of onlyB) console.log(`ONLY  ${f}  only in ${dirB}`);
  console.log(`summary: ${both.length} pairs compared, ${differing} differ, ${onlyA.length + onlyB.length} in one folder only`);
  process.exit(differing || onlyA.length || onlyB.length ? 1 : 0);
}

main();
