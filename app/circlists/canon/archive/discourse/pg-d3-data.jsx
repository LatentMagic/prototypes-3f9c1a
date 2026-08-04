// ============================================================================
// Discourse v3 — the version list.
// Twelve versions of the app. Each one IS the app: a complete set of lever
// answers plus a seeded feed whose distinctive moment is one or two natural
// touches away. No claims, no trade-offs, no theory — that lives in
// `ideation-2026-07-31-discourse-v2.md`. Name and one line, nothing more.
//
// Reuses the v2 data layer wholesale (`pg-d2-data.jsx`): the items, the levers,
// the spine defaults and `d2Resolve`. This file only re-derives the option list
// and the seeding.
// ============================================================================

const {
  D2_SPINE: D3_SPINE, D2_ITEMS: D3_BASE, D2_LEVERS: D3_LEVERS, D2_DEFAULT_CFG: D3_DEFAULT_CFG,
} = window;

const D3_URL = {
  pe: 'https://newsletter.pragmaticengineer.com/p/scaling-on-call',
  rust: 'https://blog.rust-lang.org/2026/01/async-internals',
  cd: 'https://martinfowler.com/articles/cd-pipeline.html',
  dl: 'https://danluu.com/percentile-latency/',
  go: 'https://go.dev/blog/pipelines',
  dns: 'https://jvns.ca/blog/2026/02/dns-resolvers/',
  yt: 'https://www.youtube.com/watch?v=Kx7Bvksk_qg',
  kernel: 'https://www.kernel.org/doc/html/latest/process/submitting-patches.html',
  fm: 'https://martinfowler.com/bliki/FormerMember.html',
};

// Hoist the items that carry a version's moment to the top of their tab, so it
// is reachable without scrolling for it.
const d3Hoist = (urls) => (items) => {
  const rank = (u) => { const i = urls.indexOf(u); return i < 0 ? urls.length : i; };
  return [...items].sort((a, b) => rank(a.url) - rank(b.url));
};

// A sharer who holds their own line back. Seeds the held marker into Active.
const d3Seal = (urls) => (items) => items.map((it) => (
  urls.indexOf(it.url) >= 0 && it.preface ? { ...it, preface: { ...it.preface, seal: true } } : it
));

// The question register: the sharer asks instead of explains.
const D3_ASKS = {
  [D3_URL.pe]: 'Are we measuring the platform team by the wrong thing?',
  [D3_URL.cd]: 'Is our pipeline the one he warns about?',
  [D3_URL.go]: 'Who owns the first week here?',
  [D3_URL.dns]: 'Does anyone else read resolvers this way?',
  [D3_URL.yt]: 'Do we trust our numbers enough for this argument?',
};
const d3Ask = (items) => items.map((it) => {
  if (!it.preface) return it;
  const ask = it.preface.ask || D3_ASKS[it.url];
  return ask ? { ...it, preface: { ...it.preface, ask, seal: false } } : it;
});

const d3Chain = (...fns) => (items) => fns.reduce((acc, f) => f(acc), items);

// ---- The twelve ------------------------------------------------------------
// cfg  = this version's answer to every lever, over the settled spine.
// def  = what `d2Resolve` reads directly (turns / graduate / land).
// tab  = where you land.
// seed = how the feed is arranged for this version.
const D3_VERSIONS = [
  {
    id: 'reasons', n: '01', name: 'Reasons on the card',
    line: 'Every share carries the sharer\u2019s line up front. Everything the circle said stays behind the door.',
    def: { turns: 'one', graduate: 'none', land: false },
    cfg: { preface: 'card', bloat: 'lean' }, tab: 'active',
    seed: d3Hoist([D3_URL.pe, D3_URL.cd, D3_URL.dl, D3_URL.rust]),
  },
  {
    id: 'sealed', n: '02', name: 'Sealed by the sharer',
    line: 'The sharer decides whether their line travels with the link or waits until you have been through it.',
    def: { turns: 'one', graduate: 'none', land: false },
    cfg: { preface: 'sealed' }, tab: 'active',
    seed: d3Chain(d3Seal([D3_URL.pe, D3_URL.cd]), d3Hoist([D3_URL.pe, D3_URL.cd, D3_URL.dl, D3_URL.rust])),
  },
  {
    id: 'breath', n: '03', name: 'The record, in one breath',
    line: 'You react, and the same sheet becomes the record. The shape it landed in, what the circle said, your line. You close it.',
    def: { turns: 'one', graduate: 'none', land: false },
    cfg: { preface: 'card', record: 'merged' }, tab: 'active',
    seed: d3Hoist([D3_URL.pe, D3_URL.dl, D3_URL.cd, D3_URL.rust]),
  },
  {
    id: 'same', n: '04', name: 'Same',
    line: 'One tap points at somebody\u2019s sentence \u2014 the cheapest thing you can say, and the only way to answer a response.',
    def: { turns: 'one', graduate: 'none', land: false },
    cfg: { echo: 'same' }, tab: 'read',
    seed: d3Hoist([D3_URL.go, D3_URL.dns, D3_URL.yt]),
  },
  {
    id: 'oneline', n: '05', name: 'One line each',
    line: 'One line, forever. Nothing to reply to, nothing owed.',
    def: { turns: 'one', graduate: 'none', land: false },
    cfg: { echo: 'off' }, tab: 'read',
    seed: d3Hoist([D3_URL.go, D3_URL.yt, D3_URL.dns]),
  },
  {
    id: 'living', n: '06', name: 'A line you can rewrite',
    line: 'Your line stays yours until somebody points at it. Changing your mind is the second turn.',
    def: { turns: 'living', graduate: 'none', land: false },
    cfg: {}, tab: 'read',
    seed: d3Hoist([D3_URL.yt, D3_URL.go, D3_URL.dns]),
  },
  {
    id: 'addressed', n: '07', name: 'Answer a person',
    line: 'Past your own line, one reply to each member who spoke \u2014 addressed to them, never nested underneath.',
    def: { turns: 'addressed', graduate: 'none', land: false },
    cfg: {}, tab: 'read',
    seed: d3Hoist([D3_URL.yt, D3_URL.go, D3_URL.dns]),
  },
  {
    id: 'rounds', n: '08', name: 'Rounds',
    line: 'Everyone who has finished it leaves a line. The round closes when the readers have spoken, and the next one opens.',
    def: { turns: 'rounds', graduate: 'none', land: false },
    cfg: {}, tab: 'read',
    seed: d3Hoist([D3_URL.go, D3_URL.yt, D3_URL.dns]),
  },
  {
    id: 'asking', n: '09', name: 'Every turn after the first is a question',
    line: 'Say as much as you like, as long as you keep handing the floor over.',
    def: { turns: 'question', graduate: 'none', land: false },
    cfg: {}, tab: 'read',
    seed: d3Hoist([D3_URL.go, D3_URL.yt, D3_URL.dns]),
  },
  {
    id: 'table', n: '10', name: 'Take it to the table',
    line: 'A member walks an item into a room where you can speak freely. Landing it drains the room.',
    def: { turns: 'open', graduate: 'member', land: true },
    cfg: {}, tab: 'table',
    seed: d3Hoist([D3_URL.go, D3_URL.yt, D3_URL.dns]),
  },
  {
    id: 'land', n: '11', name: 'Land it',
    line: 'Say anything, until somebody writes what the circle takes from it. Then that sits on top, forever.',
    def: { turns: 'open', graduate: 'none', land: true },
    cfg: {}, tab: 'read',
    seed: d3Hoist([D3_URL.go, D3_URL.yt, D3_URL.dns]),
  },
  {
    id: 'ask', n: '12', name: 'Ask, don\u2019t tell',
    line: 'The sharer poses a question instead of a reason, and what comes back is an answer.',
    def: { turns: 'one', graduate: 'none', land: false },
    cfg: { preface: 'card' }, tab: 'active',
    seed: d3Chain(d3Ask, d3Hoist([D3_URL.dl, D3_URL.pe, D3_URL.cd, D3_URL.go])),
  },
];

// Version answers first, then any explicit override. Same contract as v2's
// `d2Merge`, with the version standing where the spine + option `def` stood.
const d3Merge = (v, ov) => {
  const c = { ...D3_SPINE, ...v.cfg, ...v.def };
  Object.keys(ov || {}).forEach((k) => {
    const val = ov[k];
    if (val == null || val === 'auto') return;
    if (k === 'limit') c.limit = Number(val);
    else if (k === 'land') c.land = val === 'on';
    else c[k] = val;
  });
  return c;
};

const d3Items = (v) => (v.seed ? v.seed(D3_BASE) : D3_BASE);

Object.assign(window, { D3_VERSIONS, D3_LEVERS, D3_DEFAULT_CFG, d3Merge, d3Items });
