// ============================================================================
// After Pixels — Escape's character sheet (1236): the card above Escape's own card on the session page. Three stat cards (Room,
// Notes, Pockets), each a numeral that opens its things as chips; a tap on a chip reads that thing in one reader under the chips.
// Beside the cards, the latest slot: the play's latest move while it runs, its last move once finished. The sheet is read from the
// session's own moves (GS_SESSIONS[sid].lines, the lines Every move lists), so it holds what the player would hold at that point of
// that play. Room 1's text is verbatim from the room's content (content/escape/1.v3.json); the hard play's own locks and objects use
// the words of its moves. The sheet has no fold. Styles: app/gs-escape-sheet.css (the card itself is Delve's sheet surface, .dv4).
// ============================================================================
import React from 'react';
import { GS_ES1, GS_SESSIONS } from './gs-data.jsx';

// ---- The room's text, verbatim (content/escape/1.v3.json). `open` is the text once its lock gave way (the lock's rewrite), `lit` the
// text once the clock hands are set (the clock-hands lock's rewrites). An object with neither keeps its text. ----
const ESX_ROOM = {
  text: 'A dim study at the top of a narrow house: a workbench under a cold lamp, a glass cabinet of pocket watches, a tall case clock, a portrait of a girl, and a fireplace with carved panelling. Grey light seeps through a small round window. The door behind you is shut fast.',
  lit: 'Late-afternoon sun pours through the round window, and a single beam crosses the study: first over the workbench, then the portrait, then the glass cabinet, and last the fireplace, where a panel has swung back on a narrow oak door.' };
const ESX_OBJS = [
  { id: 'bench', key: 'workbench', name: 'The workbench',
    text: 'A workbench scattered with tools. On a tray sits a train of four brass gears with 20, 9, 3 and 11 teeth. The crank turns the 20-tooth gear, which turns the 9, which turns the 3, which turns the 11. The tray reads “One tooth, one letter.” Below it, a drawer with a four-letter lock.',
    open: 'A workbench scattered with tools. On a tray sits a train of four brass gears with 20, 9, 3 and 11 teeth, and the crank still turns them. Below it, the drawer hangs open and empty.',
    lit: 'A workbench scattered with tools, now in a bar of sunlight. Where the beam lands, a letter scratched into the wood, too faint to see before, stands out in shadow: T. The gear tray sits beside it, and the drawer hangs open.' },
  { id: 'cabinet', key: 'glass cabinet', name: 'The glass cabinet',
    text: 'A glass cabinet with a four-digit lock. Through the glass, four pocket watches hang on tagged chains: Thursday’s shows nine o’clock, Monday’s seven, Wednesday’s one, Tuesday’s four. A brass plate on the frame: “My code is my watches’ hours, Monday to Thursday.”',
    lit: 'A glass cabinet with a four-digit lock. Four pocket watches hang on tagged chains: Thursday’s shows nine o’clock, Monday’s seven, Wednesday’s one, Tuesday’s four. A brass plate on the frame: “My code is my watches’ hours, Monday to Thursday.” The sunlight through the glass throws a shadow on the wall behind, where the watch chains hang in the curve of a letter: C.' },
  { id: 'clock', key: 'case clock', name: 'The case clock',
    text: 'A tall case clock, stopped, its hands stiff. There is a winding hole in its face.',
    lit: 'A tall case clock, ticking again, its hands at a quarter to four.' },
  { id: 'portrait', key: 'portrait', name: 'The portrait',
    text: 'A girl of about ten, reaching up to a tall clock, a locket at her throat lost in the gloom. Beneath, in Ezra’s hand: “Ada.”',
    lit: 'A girl of about ten, reaching up to a tall clock. The sunbeam catches the gilt locket at her throat, and you see it is shaped like a letter: O. Beneath, in Ezra’s hand: “Ada.”' },
  { id: 'fireplace', key: 'fireplace', name: 'The fireplace',
    text: 'Cold ashes in an iron grate. The panelling beside it is carved with tiny gears, too shadowed to make out.',
    lit: 'Cold ashes in an iron grate. In the low, raking light, one of the tiny gears carved in the panelling shows a letter cut into its centre: K. Beside it, a narrow oak door stands in the wall.' },
];
const ESX_OAK = { id: 'oak', key: 'oak door', name: 'The oak door', text: GS_ES1.door };
const ESX_KEY = { id: 'key', name: 'Brass winding key', text: 'A small brass key, its bow shaped like a clock face.', use: 'Used on the case clock' };

// ---- The sheet, read from a session's own moves, so the sheet and the card below hold the same locks, items and objects. Every object
// shown (looked at or not), pockets (held or used up), notes (what each opened lock said). A lock whose answer is the room's own text
// (GS_ES1, the deployed content) also rewrites the room as the content says; one that answers in its own words (the hard play's
// invented locks) does not. The oak door is shown once the clock hands are set, or once looked at. ----
const esxKeyOf = (n) => n.replace(/^the /i, '').toLowerCase();
const esxCap = (n) => n.replace(/^./, (c) => c.toUpperCase());
const esxRead = (sid) => {
  const objs = ESX_OBJS.slice(); const extra = []; const seen = new Set(); const text = {}; const fixed = new Set(); const notes = [];
  let room = ESX_ROOM.text; let n = 0; const at = {}; const stamp = (id) => { if (!(id in at)) at[id] = ++n; };
  let held = false; let used = false; let reveal = false;
  const objOf = (k) => objs.find((o) => o.key === k) || (k === ESX_OAK.key ? ESX_OAK : null) || extra.find((o) => o.key === k);
  const rewrite = (field) => objs.forEach((o) => { if (o[field]) { text[o.id] = o[field]; fixed.add(o.id); } });
  GS_SESSIONS[sid].lines.forEach(([label, what = '', res = '', more]) => {
    let m;
    if (label === 'Item') { held = true; stamp('key'); return; }
    if (!/^Move \d+$/.test(label)) return;
    if ((m = /^Examined the (.+)$/.exec(what))) {
      let o = objOf(m[1]); if (!o) { o = { id: m[1], key: m[1], name: 'The ' + m[1], text: res }; extra.push(o); }
      seen.add(o.id); stamp(o.id); if (!fixed.has(o.id)) text[o.id] = res; return;
    }
    if ((m = /^Used the brass winding key on the (.+)$/.exec(what))) { used = true; const o = objOf(m[1]); if (o && more) { text[o.id] = more; fixed.add(o.id); } return; }
    const typed = /^Tried (\S+) on (.+)$/.exec(what); const mech = /^Set (the .+?): /.exec(what);
    const name = typed ? typed[2] : mech && mech[1]; if (!name) return;
    if (typed ? res === 'Wrong' : /^\d+ of \d+ .* into place\.$/.test(res)) return;
    if (res !== 'Out') { notes.push({ id: esxKeyOf(name), name: esxCap(name), text: res, kind: 'note' }); stamp(esxKeyOf(name)); }
    if (esxKeyOf(name) === 'workbench drawer' && res === GS_ES1.drawer) { held = true; stamp('key'); rewrite('open'); }
    if (esxKeyOf(name) === 'clock hands') { reveal = true; if (res === GS_ES1.hands) { room = ESX_ROOM.lit; rewrite('lit'); } }
  });
  const shown = [...objs, ...extra, ...(reveal || seen.has(ESX_OAK.id) ? [ESX_OAK] : [])]
    .map((o) => ({ id: o.id, kind: 'thing', name: o.name, seen: seen.has(o.id), text: text[o.id] || o.text, at: at[o.id] }));
  return { room, shown, held, used, notes: notes.map((x) => ({ ...x, at: at[x.id] })), keyAt: at.key };
};
const esxGroups = (sid) => {
  const r = esxRead(sid);
  return [
    { key: 'room', head: 'Room', items: [{ id: 'room', kind: 'room', name: 'The room', text: r.room, at: 0 }, ...r.shown] },
    { key: 'pockets', head: 'Pockets', items: r.held ? [{ ...ESX_KEY, kind: 'item', used: r.used, at: r.keyAt }] : [] },
    { key: 'notes', head: 'Notes', items: r.notes },
  ];
};

// KEEP: only a thing that opens something real is tappable: an object not yet looked at has no sentence yet, and a used item
// says its use in place, so both are static (no border, no underline, no tap).
const esxOpens = (it) => (it.kind === 'thing' ? it.seen : it.kind === 'item' ? !it.used : true);
const esxThings = (grp) => grp.items.filter((i) => i.kind === 'thing');
// A group's count, said once in its card: Room 2/5, Pockets 1, Notes 1.
const esxCount = (grp) => (grp.key === 'room' ? esxThings(grp).filter((i) => i.seen).length + '/' + esxThings(grp).length
  : grp.key === 'pockets' ? String(grp.items.filter((i) => !i.used).length) : String(grp.items.length));
// A group's count split for display: Room "6/8" is "6" and "/8".
const esxCountParts = (grp) => { const c = esxCount(grp); const i = c.indexOf('/'); return i < 0 ? [c, ''] : [c.slice(0, i), c.slice(i)]; };
// A name in a compact spot drops its leading "The", so it fits whole; "The room" keeps it.
const esxShortName = (it) => (it.kind === 'room' ? it.name : it.name.replace(/^The /, '').replace(/^./, (c) => c.toUpperCase()));

// ---- Marks: only what the data knows, and no doors (Escape's card owns those). Looked at: a filled square; not looked at: an empty
// outlined one. The room: a door frame, its own permanent icon. An item: Delve's pocket box, struck once used up. A note: a plain
// slip with two ruled lines. ----
const ESX_POUCH = 'M5 9h14l-1.5 11h-11zM9 9V7a3 3 0 0 1 6 0v2';
const ESX_DOOR = 'M6 21V3.5h12V21M3.5 21h17M14.5 12.5h.01';
const EsxIcon = ({ d, cls }) => <span className={cls} aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter"><path d={d} /></svg></span>;
const EsxMark = ({ it }) => {
  if (it.kind === 'item') return <EsxIcon d={ESX_POUCH} cls={'dv4-g esx-g' + (it.used ? ' is-used' : '')} />;
  if (it.kind === 'room') return <EsxIcon d={ESX_DOOR} cls="esx-mk esx-door" />;
  if (it.kind === 'note') return <span className="esx-mk" aria-hidden="true"><i className="esx-slip" /></span>;
  return <span className="esx-mk" aria-hidden="true"><i className={'esx-sq' + (it.seen ? '' : ' is-unread')} /></span>;
};
const ESX_GMARK = { room: { kind: 'room' }, notes: { kind: 'note' }, pockets: { kind: 'item', used: false } };

// Height open and shut by grid rows (0fr to 1fr), the system's dropdown motion; it keeps its last content while it shuts.
export const EsxFold = ({ open, children }) => {
  const kept = React.useRef(null); if (open) kept.current = children;
  return <div className={'esx-fold' + (open ? ' is-open' : '')}><div>{open ? children : kept.current}</div></div>;
};
// KEEP: opened text is never left under the prototype's floating aids: once it has opened, the page scrolls it up to clear the
// bottom 150px, after every open and swap, but never lifts the sheet's top above 80px, so swaps cannot creep the sheet away.
const esxReveal = (el, wait = 260) => setTimeout(() => { if (!el) return; const r = el.getBoundingClientRect(); const lim = window.innerHeight - 150;
  if (r.bottom > lim) window.scrollBy({ top: Math.max(0, Math.min(r.bottom - lim, el.closest('.esx-sheet').getBoundingClientRect().top - 80)), behavior: 'smooth' }); }, wait);
const useEsxReveal = (ref, key) => React.useEffect(() => { if (!key || !ref.current) return undefined; const t = esxReveal(ref.current); return () => clearTimeout(t); }, [key]);

// One thing, opened: its name and mark (14px), then its sentence (16px body).
const EsxRead = ({ it }) => <div key={it.id} className="esx-read esx-in"><span className="esx-nm"><EsxMark it={it} /><b>{it.name}</b></span><p className="esx-tx">{it.text}</p></div>;
// A static name: an object not looked at (its empty box says so, no caption: the game holds no text for it until the player looks),
// or a used item (struck mark, its use in the label only).
const EsxStill = ({ it }) => (
  <div className={'esx-still esx-chip ' + (it.kind === 'thing' ? 'is-unread' : 'is-used')} aria-label={it.name + ', ' + (it.kind === 'thing' ? 'not looked at' : it.use.toLowerCase())}>
    <EsxMark it={it} /><span className="esx-rn">{esxShortName(it)}</span>
  </div>);
// One thing as a chip: a bordered button when it opens something, static otherwise.
const EsxChip = ({ it, sel, pick }) => (esxOpens(it)
  ? <button type="button" className="esx-chip" aria-expanded={sel === it.id} onClick={() => pick(it.id)}><EsxMark it={it} /><b>{esxShortName(it)}</b></button>
  : <EsxStill it={it} />);
// KEEP: a thing opens into ONE reader under its chips, never under the tapped chip, so a swap never moves the chips.
const EsxReader = ({ it }) => { const read = React.useRef(null); useEsxReveal(read, it && it.id);
  return <div ref={read}><EsxFold open={!!it}>{it && <EsxRead it={it} />}</EsxFold></div>; };
// A group opened: its things as chips in an even grid.
const EsxChips = ({ grp, sel, pick }) => <div key={grp.key} className="esx-chips esx-in" role="group" aria-label={grp.head}>
  {grp.items.map((it) => <EsxChip key={it.id} it={it} sel={sel} pick={pick} />)}</div>;

// The latest slot reads the last Every move line labelled Move N, Hint or Item (other labels never reach it). Static text, no tap.
const esxLastLine = (sid) => GS_SESSIONS[sid].lines.filter(([label]) => /^(Move \d+|Hint|Item)$/.test(label)).pop();
// In progress: "Latest"; finished: "Last move". `tail` is the phone's short result beside the line.
const esxLatest = (sid) => {
  const last = esxLastLine(sid); if (!last) return null;
  const [label, what = '', res = '', more = ''] = last;
  let l1; let l2; let tail = '';
  if (label === 'Hint') { l1 = res + ' · ' + what; l2 = more; }
  else if (label === 'Item') { l1 = what; l2 = res; }
  else { l1 = what; l2 = res; if (res.length <= 20) tail = res; }
  return { head: GS_SESSIONS[sid].live ? 'Latest' : 'Last move', l1, l2, tail };
};
const EsxLatest = ({ lt }) => lt && <div className="esx-latest"><span className="esx-lh">{lt.head}</span>
  <b className="esx-l1">{lt.l1}</b>{lt.tail && <span className="esx-lt">{' · ' + lt.tail}</span>}{lt.l2 && <p className="esx-l2">{lt.l2}</p>}</div>;

// ---- The sheet: three stat cards (the group's mark and name, and its numeral; no item marks, the count and the tap carry them) and
// the latest slot. A tap opens the group's things as chips under the cards (one size; three to a row, two on a phone); a chip's tap
// opens its sentence in the reader. A group holding one thing opens straight to its sentence. ----
export const EsSheet = ({ sid }) => {
  const g = React.useMemo(() => esxGroups(sid), [sid]); const lt = React.useMemo(() => esxLatest(sid), [sid]);
  const [open, setOpen] = React.useState(null); const [sel, setSel] = React.useState(null);
  const it = sel && g.flatMap((x) => x.items).find((x) => x.id === sel);
  const grp = g.find((x) => x.key === open);
  const tiles = ['room', 'notes', 'pockets'].map((k) => g.find((x) => x.key === k));
  const tap = (x) => { const shut = open === x.key; setOpen(shut ? null : x.key); setSel(!shut && x.items.length === 1 && esxOpens(x.items[0]) ? x.items[0].id : null); };
  return <section className="dv4 esx-sheet" aria-label="Character sheet">
    <div className="esx-stat">
      <div className="esx-cards">{tiles.map((x) => { const [n, of] = esxCountParts(x);
        return <button key={x.key} type="button" className={'esx-card is-' + x.key + (open === x.key ? ' is-open' : '')} aria-expanded={open === x.key}
          aria-label={x.head + ' ' + esxCount(x)} disabled={!x.items.length} onClick={() => tap(x)}>
          <span className="esx-hole" aria-hidden="true" />
          <span className="esx-cl1"><EsxMark it={ESX_GMARK[x.key]} /><span>{x.head}</span></span>
          <b className="esx-num">{n}{of && <i>{of}</i>}</b>
        </button>; })}</div>
      <EsxLatest lt={lt} /></div>
    <EsxFold open={!!grp}>{grp && <EsxChips grp={grp} sel={sel} pick={(id) => setSel(sel === id ? null : id)} />}</EsxFold>
    <EsxReader it={it} />
  </section>;
};
