// ============================================================================
// Discourse v7 — direction 08, The Dispatch.
// ----------------------------------------------------------------------------
// The circle's talk does not trickle onto cards. It compiles, on a cadence, into
// one finite artefact that arrives for everyone at the same moment — read or
// unread. Discourse is a property of a PERIOD, not of a card.
//
// WHAT THE CARD KEEPS. A thought written at share is held: the card carries a
// thin rule and the word "Thought" under the attribution, at metadata size, and
// nothing else. No content, no preview, no author beyond the attribution the
// card already prints. The card says a thought exists and refuses to show it.
//
// WHERE THE WORDS GO. Into the next issue. A dispatch is a composed document —
// masthead, the period's items in order, each entry carrying the item, the
// circle's settled swell drawn as a SHAPE (never a tally), the sharer's thought
// set as the entry's opening line, and readers' lines beneath it GROUPED BY
// RUNG: everything said at `deeply` sits together. That grouping is the pairing
// — the reaction layer orders the words, so this is not a second system bolted
// beside the Swell but the periodical view of the same material.
//
// CONTINUATION IS CARRYING. An entry can be carried into the next issue; you
// write under it and your line prints beneath it next time. Its spine shows how
// many issues it has run, as a stack of hairlines, never a number. A long spine
// is a conversation.
//
// THE ROUTE — THE DISPATCH IS NOT A PLACE YOU GO. IT IS A THING THAT ARRIVES,
// and the app already has one grammar for that. MOBILE.md fixes three
// circle-local bar slots and says a fourth does not earn its place, so
// Dispatches can never be a bar slot — and a slot dark six days in seven would
// be a worse lie than a hairline anyway. Its home is ONE SLOT ABOVE THE
// ACTIVE/READ TABS, with three states:
//   1  between issues   a single hairline row carrying the last issue's date at
//                       metadata size. One line. No mark, no word, no emphasis.
//   2  an issue lands   the same row becomes a BAND — the issue's title and
//                       date at reading weight, standing where the New pill
//                       stands for cards. Its PRESENCE is the signal; there is
//                       no second one and it needs none, because a periodical
//                       either has landed or it has not.
//   3  you open it      the band collapses back to the hairline and stays.
// Pressing either state opens the current issue as a full page whose masthead
// carries the spine of previous issues — the shelf hangs off the newest issue,
// not off the app's chrome, which is why the app grows one row and not a
// section.
//
// THE PRICE, STATED. The chrome does not vanish. The app gains ONE PERMANENT
// HAIRLINE ROW above the tabs, in every circle, on every posture, forever. That
// is what buys an issue that can never become unreachable and a shelf that
// accrues no dead chrome beyond one line. Judge it as the price it is.
//
// CARRYING — the real continuation act — happens INSIDE the issue, on an entry,
// while reading it. There is no other place to press it and no notification
// that invites you to. Continuation and reading are one visit, which is what it
// means for discourse to be a property of a period rather than of a card.
//
// THE REACTION DOOR, REACHED FROM INSIDE THE ISSUE. Each entry is headed by its
// item, set inline, CARRYING ITS OWN SWELL DOOR: opening it gives the disc for
// that item without leaving the issue. The door keeps the reactions and loses
// the words, but the two are the same material in two registers, and this makes
// that literal — the dispatch becomes a second, unmissable route to the door,
// arriving on a cadence rather than waiting on the Read tab to be visited.
//
// On desktop the page takes a reading measure with the shelf and the entry list
// as a sidebar, where the phone's cost largely does not arise.
//
// A composed periodical is a typography problem, so the setting here is the
// design: mono kickers, a double rule under the masthead, one measure, a lead
// paragraph, and an end.
// ============================================================================

// No Avatar here on purpose: a printed issue attributes in type, not in faces.
// The Swell door is the shipped one, mounted — never a second drawing of it.
const { PGD7, Button, Icon, SwellDoor } = window;
const { useState: dsS, useEffect: dsE, useRef: dsR } = React;

// ---- The depth vocabulary ---------------------------------------------------
// Copied once from app/swell-reactions.jsx, which keeps DEPTH_WORDS and
// levelFromIntensity internal. PLAYGROUND.md allows the copy; this is the
// pointer to its source. Verbatim — never "improved", or it stops being
// evidence of what the product actually says.
const DS_DEPTH_WORDS = ['a little', 'moderately', 'deeply'];
const dsLevel = (i) => { const v = i == null ? 0.42 : i; return v < 0.34 ? 1 : v < 0.67 ? 2 : 3; };

// ---- The swell, drawn as a shape --------------------------------------------
// The geometry below is COPIED from app/swell-reactions.jsx (glyphAngle, iv,
// swellJitterR, swellLayout), which keeps all of it internal. Same allowance,
// same rule: it carries this pointer and is not tuned. The entry header renders
// it PASSIVE and unlabelled — a shape, with no roster, no names and no count.
const DS_GLYPHS = window.RX_GLYPHS || [];
const DS_MAXR = 0.46;
const dsGlyphIndex = (g) => DS_GLYPHS.indexOf(g);
const dsAngle = (idx) => (-90 + idx * (360 / (DS_GLYPHS.length || 5))) * Math.PI / 180;
const dsIv = (r) => (r && r.intensity != null ? r.intensity : 0.42);
const DS_GAP = 0.075;
const dsLayout = (list) => {
  const arr = list || [];
  const groups = {};
  arr.forEach((r, i) => { const idx = r && r.glyph ? dsGlyphIndex(r.glyph) : -1; (groups[idx] = groups[idx] || []).push(i); });
  const anchor = {};
  Object.keys(groups).forEach((key) => {
    const idx = Number(key);
    const ids = groups[idx];
    const mean = ids.reduce((s, i) => s + dsIv(arr[i]), 0) / ids.length;
    let rr = idx >= 0 ? 0.13 + mean * 0.20 : 0.05;
    rr = Math.max(0.1, Math.min(0.34, rr));
    anchor[idx] = { rr, mean };
  });
  const seen = {};
  const pts = arr.map((r) => {
    const idx = r && r.glyph ? dsGlyphIndex(r.glyph) : -1;
    const n = (groups[idx] || []).length;
    const k = (seen[idx] = (seen[idx] == null ? 0 : seen[idx] + 1));
    const base = idx >= 0 ? dsAngle(idx) : -Math.PI / 2;
    const A = anchor[idx] || { rr: 0.13 + dsIv(r) * 0.20, mean: dsIv(r) };
    const ax = 0.5 + Math.cos(base) * A.rr, ay = 0.5 + Math.sin(base) * A.rr;
    if (n === 1) return { x: ax, y: ay };
    const ur = [Math.cos(base), Math.sin(base)];
    const ut = [-Math.sin(base), Math.cos(base)];
    const ang = k * 2.399963;
    const pr = DS_GAP * 0.95 * Math.sqrt(k);
    const tan = Math.cos(ang) * pr;
    const rad = Math.sin(ang) * pr + (dsIv(r) - A.mean) * 0.16;
    return { x: ax + ut[0] * tan + ur[0] * rad, y: ay + ut[1] * tan + ur[1] * rad };
  });
  const halfOf = (r) => 0.05 + dsIv(r) * 0.045;
  for (let it = 0; it < 26; it++) {
    let moved = false;
    for (let a = 0; a < pts.length; a++) {
      for (let b = a + 1; b < pts.length; b++) {
        let dx = pts[b].x - pts[a].x, dy = pts[b].y - pts[a].y;
        let d = Math.hypot(dx, dy);
        if (d < 0.001) { const ang = a * 2.39996; dx = Math.cos(ang); dy = Math.sin(ang); d = 0.001; }
        const min = (halfOf(arr[a]) + halfOf(arr[b])) * 0.62;
        if (d < min) {
          const push = (min - d) / 2, ux = dx / d, uy = dy / d;
          pts[a].x -= ux * push; pts[a].y -= uy * push;
          pts[b].x += ux * push; pts[b].y += uy * push;
          moved = true;
        }
      }
    }
    for (const p of pts) { const cx = p.x - 0.5, cy = p.y - 0.5, dd = Math.hypot(cx, cy); if (dd > DS_MAXR) { p.x = 0.5 + cx * DS_MAXR / dd; p.y = 0.5 + cy * DS_MAXR / dd; } }
    if (!moved) break;
  }
  return pts;
};

// ---- The cadence -------------------------------------------------------------
// One issue a week. Three have printed; the fourth is still open, and everything
// written now goes into it. Dates are relative to the session so the shelf is
// always inhabited and the pending issue always has a date still ahead of it.
const DS_DAY = 864e5;
const DS_T0 = Date.now();
const dsAt = (days) => DS_T0 + days * DS_DAY;
const dsDateLabel = (ms) => new Date(ms).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

// Seeded issues, oldest first. `items` is the period's running order — the
// entries the issue printed. `r1` prints twice: it was carried once already, so
// a spine exists before the reviewer touches anything.
const DS_ISSUES = [
  { id: 'i-3', at: dsAt(-15), items: ['r4', 'r3'] },
  { id: 'i-2', at: dsAt(-8), items: ['r1', 'r2'] },
  { id: 'i-1', at: dsAt(-1), items: ['a4', 'a5', 'a7', 'a2', 'a1', 'r1'] },
];
const DS_PENDING = { id: 'pending', at: dsAt(6), items: [] };
const DS_SEQ = [...DS_ISSUES.map((i) => i.id), DS_PENDING.id];
const dsIssue = (id) => (id === DS_PENDING.id ? DS_PENDING : DS_ISSUES.find((i) => i.id === id) || null);
const DS_CURRENT = 'i-1';

// ---- Lines -------------------------------------------------------------------
// A line is one thing a member said in a period: the sharer's thought (the
// entry's opening line) or a reader's line given back on reading.
const dsLines = (item) => {
  const out = [];
  if (item.thought) {
    out.push({
      key: item.id + '-lead', by: item.thought.by, text: item.thought.text,
      at: item.thought.at || item.at, issue: item.thought.issue || null, lead: true,
    });
  }
  (item.responses || []).forEach((r) => {
    out.push({ key: r.id, by: r.by, text: r.text, at: r.at, issue: r.issue || null });
  });
  return out;
};

// Which issues an entry has run in, in cadence order. Seeded runs, plus anything
// the reviewer has carried, plus the pending issue once a line is set for it.
const dsRuns = (ctx, item) => {
  const carried = ((ctx.state && ctx.state.carried) || {})[item.id] || [];
  const pendingLine = dsLines(item).some((l) => l.issue === DS_PENDING.id);
  const set = {};
  DS_ISSUES.forEach((is) => { if (is.items.indexOf(item.id) >= 0) set[is.id] = true; });
  carried.forEach((id) => { set[id] = true; });
  if (pendingLine) set[DS_PENDING.id] = true;
  const runs = DS_SEQ.filter((id) => set[id]);
  // Nothing seeded and nothing carried — a link the reviewer added themselves.
  // Its thought was written this period, so it prints in the next issue.
  return runs.length ? runs : [DS_PENDING.id];
};

// Which of an entry's runs a line prints in. An explicit issue wins — that is
// what a line written now carries, and it is the only way into the issue that
// has not printed yet. Everything else resolves against the PRINTED runs: the
// period that contains it, clamped to the nearest end so no line is ever
// silently dropped, and never pulled forward out of an issue that has landed.
const dsRunFor = (line, runs) => {
  if (line.issue) return line.issue;
  const real = runs.filter((id) => id !== DS_PENDING.id);
  if (!real.length) return DS_PENDING.id;
  for (let i = 0; i < real.length; i++) {
    const is = dsIssue(real[i]);
    if (is && line.at > is.at - 7 * DS_DAY && line.at <= is.at) return real[i];
  }
  const first = dsIssue(real[0]);
  if (first && line.at <= first.at) return real[0];
  return real[real.length - 1];
};

const dsLinesIn = (ctx, item, issueId) => {
  const runs = dsRuns(ctx, item);
  return dsLines(item).filter((l) => dsRunFor(l, runs) === issueId);
};

// The entries an issue carries, in the period's running order.
const dsEntries = (ctx, issueId) => {
  const seeded = (dsIssue(issueId) || { items: [] }).items;
  const carrying = ctx.items.filter((it) => dsRuns(ctx, it).indexOf(issueId) >= 0);
  const bySeed = [];
  seeded.forEach((id) => { const hit = carrying.find((it) => it.id === id); if (hit) bySeed.push(hit); });
  carrying.forEach((it) => { if (bySeed.indexOf(it) < 0) bySeed.push(it); });
  return bySeed;
};

// A member's reaction on an item — the rung their lines print under.
const dsReactionOf = (ctx, item, by) => {
  const name = by === 'you' ? 'You' : ctx.nameOf(by);
  let hit = null;
  (item.reactions || []).forEach((r) => { if (r && r.name === name) hit = r; });
  return hit;
};
const dsRungOf = (ctx, item, by) => {
  const rx = dsReactionOf(ctx, item, by);
  return rx && rx.glyph ? dsLevel(rx.intensity) : 0;
};

// Rung sections, deepest first. A section with nothing in it does not print.
const DS_RUNGS = [
  [3, 'Deeply'], [2, 'Moderately'], [1, 'A little'], [0, 'Read, no reaction'],
];

// ============================================================================
// Shared setting.
// ============================================================================
const DS_KICKER = {
  fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.14em',
  textTransform: 'uppercase', color: 'var(--color-fg-3)',
};
const DS_META = {
  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.03em',
  color: 'var(--color-fg-3)',
};
const DS_LEAD = {
  fontFamily: 'var(--font-sans)', fontSize: 17, lineHeight: 1.58,
  color: 'var(--color-fg-1)', textWrap: 'pretty', minWidth: 0,
};
const DS_BODY = {
  fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.6,
  color: 'var(--color-fg-1)', textWrap: 'pretty', minWidth: 0,
};
const DS_TEXTAREA = {
  width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-sans)',
  fontSize: 16, lineHeight: 1.5, color: 'var(--color-fg-1)',
  padding: '10px 12px', borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border-1)', background: 'var(--color-surface)',
  resize: 'vertical', minHeight: 66,
};

// The circle's settled swell, as a shape. Passive: no roster, no names, nothing
// countable. Nobody has reacted, or everyone skipped -> no shape at all.
const DsShape = ({ item, size = 74 }) => {
  const live = (item.reactions || []).filter((r) => r && r.glyph);
  if (!live.length) return null;
  const pts = dsLayout(live);
  return (
    <div aria-hidden="true" style={{
      position: 'relative', width: size, height: size, flexShrink: 0,
      borderRadius: '50%', background: 'var(--color-surface-sunken)',
      border: '1px solid var(--color-border-2)',
    }}>
      {live.map((r, i) => (
        <span key={i} style={{
          position: 'absolute', left: pts[i].x * size, top: pts[i].y * size,
          transform: 'translate(-50%, -50%)', lineHeight: 1,
          fontSize: 10 + dsIv(r) * 6,
        }}>{r.glyph}</span>
      ))}
    </div>
  );
};

// How many issues an entry has run, as a stack of hairlines. Never a number.
const DsSpine = ({ runs }) => (
  <span aria-hidden="true" style={{ display: 'inline-flex', flexDirection: 'column', gap: 3, paddingTop: 5, flexShrink: 0 }}>
    {runs.map((id) => (
      <span key={id} style={{ display: 'block', width: 16, height: 1, background: 'var(--color-fg-3)' }} />
    ))}
  </span>
);

// The app's own divider treatment, carrying the rung's name.
const DsRule = ({ label }) => (
  <div className="circ-fdiv" role="separator" aria-label={label}>
    <span className="circ-fdiv-label">{label}</span>
  </div>
);

// One printed line: who said it, the glyph they gave the item, the words.
const DsLine = ({ ctx, item, line }) => {
  const rx = dsReactionOf(ctx, item, line.by);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
        <span style={{ ...DS_KICKER, color: 'var(--color-fg-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {ctx.nameOf(line.by)}
        </span>
        {rx && rx.glyph && <span aria-hidden="true" style={{ fontSize: 12, lineHeight: 1, flexShrink: 0 }}>{rx.glyph}</span>}
      </div>
      <div style={DS_BODY}>{line.text}</div>
    </div>
  );
};

// ============================================================================
// An entry. The item, the circle's shape, the sharer's opening line, and the
// readers' lines grouped under the rung they gave it.
// ============================================================================
const DsEntry = ({ ctx, issueId, item, wide }) => {
  const [draft, setDraft] = dsS('');
  const runs = dsRuns(ctx, item);
  const pending = issueId === DS_PENDING.id;
  // An issue that has not printed shows you your own words and nobody else's.
  // Nothing anyone has set for it is readable until it lands, for everyone, at
  // the same moment — which is the whole of the direction's answer to the
  // early passer.
  const lines = dsLinesIn(ctx, item, issueId).filter((l) => !pending || l.by === 'you');
  const lead = pending ? null : (lines.find((l) => l.lead) || null);
  const rest = lines.filter((l) => l !== lead);
  const carriedOn = runs.indexOf(DS_PENDING.id) >= 0;
  const source = item.source || (window.pgd7Host ? window.pgd7Host(item.url) : item.url);
  const title = item.title || (window.pgd7TitleFromUrl ? window.pgd7TitleFromUrl(item.url) : null) || item.url.replace(/^https?:\/\//, '');

  const carry = () => {
    ctx.setState((s) => {
      const map = (s && s.carried) || {};
      const had = map[item.id] || [];
      if (had.indexOf(DS_PENDING.id) >= 0) return {};
      return { carried: { ...map, [item.id]: [...had, DS_PENDING.id] }, open: DS_PENDING.id };
    });
  };
  const write = () => {
    const t = draft.trim();
    if (!t) return;
    ctx.actions.respond(item.id, { text: t, register: 'takeaway', issue: DS_PENDING.id });
    setDraft('');
  };

  return (
    <article id={'ds-entry-' + issueId + '-' + item.id} style={{
      display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0,
      paddingTop: 22, borderTop: '1px solid var(--color-border-2)',
    }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', minWidth: 0 }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <span style={{ ...DS_KICKER, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{source}</span>
            {runs.length > 1 && <DsSpine runs={runs} />}
          </div>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="circ-cardtitle" style={{
            fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: wide ? 21 : 19,
            lineHeight: 1.25, letterSpacing: '-0.015em', color: 'var(--color-fg-1)',
            textDecoration: 'none', textWrap: 'pretty',
          }}>{title}</a>
          {/* The item's own attribution row, set in type rather than faces —
              and at its right edge the SHIPPED Swell door, mounted, so the disc
              for this item opens without leaving the issue. The door renders
              nothing until somebody has read the item, exactly as it does on a
              card, so a fresh entry simply has none. */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, marginTop: 2 }}>
            <span style={{ ...DS_META, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.attribution || ('Added by ' + ctx.nameOf(item.by))}
            </span>
            <span style={{ flexShrink: 0, marginRight: -13 }}><SwellDoor item={item} /></span>
          </div>
        </div>
        <DsShape item={item} size={wide ? 82 : 68} />
      </div>

      {lead && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
          <div style={DS_LEAD}>{lead.text}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={DS_KICKER}>{ctx.nameOf(lead.by)}</span>
            {(() => { const rx = dsReactionOf(ctx, item, lead.by); return rx && rx.glyph
              ? <span aria-hidden="true" style={{ fontSize: 12, lineHeight: 1 }}>{rx.glyph}</span> : null; })()}
          </div>
        </div>
      )}

      {/* Grouped by rung: everything the circle said at `deeply` sits together.
          The reaction layer orders the words, which is what keeps this the
          periodical view of the Swell rather than a system beside it. An issue
          still open holds only your own lines, so it has nothing to group. */}
      {pending
        ? rest.map((l) => <DsLine key={l.key} ctx={ctx} item={item} line={l} />)
        : DS_RUNGS.map(([level, label]) => {
          const group = rest.filter((l) => dsRungOf(ctx, item, l.by) === level);
          if (!group.length) return null;
          return (
            <div key={level} style={{ display: 'flex', flexDirection: 'column', gap: 13, minWidth: 0 }}>
              <DsRule label={label} />
              {group.map((l) => <DsLine key={l.key} ctx={ctx} item={item} line={l} />)}
            </div>
          );
        })}

      {pending ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <textarea rows={2} value={draft} placeholder="Write under it."
            onChange={(e) => setDraft(e.target.value)} style={DS_TEXTAREA} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" size="sm" onClick={write}>Set it</Button>
          </div>
        </div>
      ) : carriedOn ? (
        <div style={DS_META}>Carried to the next issue</div>
      ) : (
        <div><Button variant="ghost" size="sm" onClick={carry}>Carry to the next issue</Button></div>
      )}
    </article>
  );
};

// ============================================================================
// One issue, set as a document. Masthead, the period's entries in order, and an
// end — a printed issue has a bottom of the page. The pending one has no end,
// because it has not been printed.
// ============================================================================
const DsIssue = ({ ctx, issueId, wide }) => {
  const issue = dsIssue(issueId);
  if (!issue) return null;
  const pending = issueId === DS_PENDING.id;
  const entries = dsEntries(ctx, issueId);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 9, minWidth: 0 }}>
        <span style={DS_KICKER}>{pending ? 'Next issue' : 'Dispatch'}</span>
        <div style={{
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: wide ? 30 : 25,
          lineHeight: 1.1, letterSpacing: '-0.025em', color: 'var(--color-fg-1)', textWrap: 'balance',
        }}>{ctx.circle.name}</div>
        <div aria-hidden="true">
          <div style={{ height: 2, background: 'var(--color-fg-1)' }} />
          <div style={{ height: 3 }} />
          <div style={{ height: 1, background: 'var(--color-border-1)' }} />
        </div>
        <div style={{ ...DS_META, color: 'var(--color-fg-2)' }}>
          {pending ? 'Prints ' + dsDateLabel(issue.at) : dsDateLabel(issue.at)}
        </div>
      </header>

      {entries.map((item) => (
        <DsEntry key={item.id} ctx={ctx} issueId={issueId} item={item} wide={wide} />
      ))}

      {!pending && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 6 }}>
          <div aria-hidden="true" style={{ height: 1, background: 'var(--color-border-2)' }} />
          <div style={{ ...DS_KICKER, textAlign: 'center' }}>The issue ends</div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// The shelf. Dated spines, newest first, the pending one at the head. Older
// issues sit here and are never pushed — a late joiner is handed one bounded
// document, not a history.
// ============================================================================
const DsShelf = ({ ctx, openId, onOpen }) => {
  const rows = [DS_PENDING, ...DS_ISSUES.slice().reverse()];
  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
      <DsRule label="The shelf" />
      {rows.map((is) => {
        const on = is.id === openId;
        const pending = is.id === DS_PENDING.id;
        return (
          <button key={is.id} type="button" onClick={() => onOpen(is.id)} style={{
            position: 'relative', textAlign: 'left', cursor: 'pointer', border: 0,
            background: on ? 'var(--color-surface-sunken)' : 'transparent',
            borderRadius: 'var(--radius-md)', padding: '10px 12px', minHeight: 44,
            display: 'flex', alignItems: 'center', gap: 10, minWidth: 0,
          }}>
            {on && <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: 9, bottom: 9, width: 2, borderRadius: 2, background: 'var(--color-accent)' }} />}
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.02em',
              color: on ? 'var(--color-fg-1)' : 'var(--color-fg-2)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1,
            }}>{pending ? 'Prints ' + dsDateLabel(is.at) : dsDateLabel(is.at)}</span>
          </button>
        );
      })}
    </nav>
  );
};

// The entries of the open issue, as a running order you can jump into. Sidebar
// only — the narrow page is one scroll with a last page, and needs no index.
const DsContents = ({ ctx, issueId }) => {
  const entries = dsEntries(ctx, issueId);
  if (!entries.length) return null;
  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
      <DsRule label="In this issue" />
      {entries.map((item) => (
        <button key={item.id} type="button" onClick={() => {
          const el = document.getElementById('ds-entry-' + issueId + '-' + item.id);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }} style={{
          textAlign: 'left', cursor: 'pointer', border: 0, background: 'transparent',
          borderRadius: 'var(--radius-md)', padding: '9px 12px', minHeight: 40, minWidth: 0,
          fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, lineHeight: 1.35,
          color: 'var(--color-fg-2)',
        }}>
          <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {item.title || item.url.replace(/^https?:\/\//, '')}
          </span>
        </button>
      ))}
    </nav>
  );
};

// ============================================================================
// Beat 4 — continue. The dispatch itself, a full page. Carrying an entry is the
// continuation mechanism: it reprints next issue with your line under it.
//
// The layout adapts to the WIDTH IT IS HANDED, measured, never to a posture flag
// (GOTCHA #8): with room, the shelf and the running order take a sidebar and the
// document keeps a reading measure; without it, one scroll, and the shelf sits
// after the end where it is opt-in rather than pushed.
// ============================================================================
const DsPage = ({ ctx }) => {
  const hostRef = dsR(null);
  const [w, setW] = dsS(0);
  dsE(() => {
    const el = hostRef.current;
    if (!el) return undefined;
    const read = () => setW(el.getBoundingClientRect().width);
    read();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', read);
      return () => window.removeEventListener('resize', read);
    }
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const openId = (ctx.state && ctx.state.open) || DS_CURRENT;
  const setOpen = (id) => ctx.setState({ open: id });
  // 740 is the width at which a 200px sidebar and a reading measure both fit
  // inside the app column at the desktop minimum (1024 less the rail).
  const wide = w >= 740;

  return (
    <div ref={hostRef} style={{ width: '100%', padding: wide ? '30px 24px 60px' : '20px 16px 44px', boxSizing: 'border-box' }}>
      <div style={{
        display: 'flex', gap: 28, alignItems: 'flex-start',
        maxWidth: wide ? 1000 : 'var(--max-feed-width)', margin: '0 auto', minWidth: 0,
      }}>
        {wide && (
          <div style={{ width: 200, flexShrink: 0, position: 'sticky', top: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <DsShelf ctx={ctx} openId={openId} onOpen={setOpen} />
            <DsContents ctx={ctx} issueId={openId} />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0, maxWidth: 660, display: 'flex', flexDirection: 'column', gap: 30 }}>
          <DsIssue ctx={ctx} issueId={openId} wide={wide} />
          {!wide && <DsShelf ctx={ctx} openId={openId} onOpen={setOpen} />}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// The slot above the tabs — the dispatch's whole home, in three states.
// ----------------------------------------------------------------------------
//   band      an issue has landed and you have not opened it. Title and date at
//             reading weight. Its presence is the signal: no mark, no count, no
//             word for how many. A periodical either has landed or it has not.
//   hairline  everything else. One line, the last issue's date, metadata size,
//             no emphasis. This is the permanent front door, so an issue is
//             never unreachable — and it is the honest price of the route.
// Both press through to the same page. Opening the issue collapses the band and
// it does not come back for that issue.
// ============================================================================
const DsBanner = ({ ctx }) => {
  const issue = dsIssue(DS_CURRENT);
  const opened = ((ctx.state && ctx.state.opened) || {})[DS_CURRENT];
  const landed = !opened;
  const open = () => ctx.setState((st) => ({
    open: DS_CURRENT,
    opened: { ...((st && st.opened) || {}), [DS_CURRENT]: true },
  }));

  const dsSlotBase = {
    display: 'flex', alignItems: 'center', width: '100%',
    cursor: 'pointer', textAlign: 'left',
    background: 'var(--color-surface)', border: 0,
    borderBottom: '1px solid var(--color-border-2)',
  };

  if (landed) {
    return (
      <button type="button" onClick={() => { open(); ctx.openContinue(); }} className="ds8-slot"
        style={{ ...dsSlotBase, gap: 12, minHeight: 60, padding: '10px 16px' }}>
        <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{
            fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, lineHeight: 1.3,
            letterSpacing: '-0.01em', color: 'var(--color-fg-1)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{ctx.circle.name}</span>
          <span style={{ ...DS_META, color: 'var(--color-fg-2)' }}>{dsDateLabel(issue.at)}</span>
        </span>
        <span style={{ flexShrink: 0, color: 'var(--color-fg-3)' }}><Icon name="chevron-right" size={16} /></span>
      </button>
    );
  }

  return (
    <button type="button" onClick={() => { open(); ctx.openContinue(); }} className="ds8-slot"
      aria-label={'Dispatch, ' + dsDateLabel(issue.at)}
      style={{ ...dsSlotBase, gap: 8, minHeight: 30, padding: '0 16px' }}>
      <span style={{ ...DS_KICKER, flexShrink: 0 }}>Dispatch</span>
      <span style={{
        flex: 1, minWidth: 0, ...DS_META,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{dsDateLabel(issue.at)}</span>
    </button>
  );
};

// The one rule inline styles cannot carry: the slot answers the pointer,
// because it is pressable in both of its states.
const DS_CSS = `
.ds8-slot:hover { background: var(--color-surface-sunken); }
`;
if (typeof document !== 'undefined' && !document.getElementById('ds8-css')) {
  const dsStyleEl = document.createElement('style');
  dsStyleEl.id = 'ds8-css';
  dsStyleEl.textContent = DS_CSS;
  document.head.appendChild(dsStyleEl);
}

// ============================================================================
// The card face — a mark, not a line. A thin rule and the word Thought under the
// attribution, at metadata size. No content, no preview, no author beyond the
// attribution the card already carries. Nothing attached, nothing printed.
// ============================================================================
const DsCard = ({ item }) => {
  if (!item.thought) return null;
  return (
    <div style={{ marginTop: 11, paddingTop: 9, borderTop: '1px solid var(--color-border-2)' }}>
      <span style={DS_KICKER}>Thought</span>
    </div>
  );
};

// ============================================================================
// Beat 1 — attach. Written at share, held. The field says where the words go and
// when, and the card will show only that they exist.
// ============================================================================
const DsCompose = ({ draft, setDraft, submit }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
    <textarea rows={3} value={draft.text} placeholder="Say what you make of it."
      onChange={(e) => setDraft({ ...draft, text: e.target.value })} style={DS_TEXTAREA} />
    <div style={DS_META}>Prints {dsDateLabel(DS_PENDING.at)}</div>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
      <Button variant="secondary" onClick={() => submit(null)}>Skip</Button>
      <Button variant="primary" onClick={() => submit(draft.text.trim() ? { text: draft.text.trim(), register: 'gist' } : null)}>Attach</Button>
    </div>
  </div>
);

// ============================================================================
// Beats 2 and 3 — one surface. The shipped reveal plays first and unchanged
// (landingMerged: false), so the reader meets the circle's FEELING at the
// moment of reading; the words are elsewhere, on a cadence. What follows is a
// single field: add to the dispatch. Address-free by construction — nobody is
// written to, and nothing of anyone else's words is shown here.
//
// The line prints under the rung you just gave the item, which is where the
// reaction layer and the words meet.
// ============================================================================
const DsAdd = ({ ctx, item, close }) => {
  const [draft, setDraft] = dsS('');
  const mine = dsReactionOf(ctx, item, 'you');
  const rung = mine && mine.glyph ? DS_DEPTH_WORDS[dsLevel(mine.intensity) - 1] : null;
  const runs = dsRuns(ctx, item);
  const held = dsLinesIn(ctx, item, DS_PENDING.id).filter((l) => l.by === 'you');
  const printed = runs.filter((id) => id !== DS_PENDING.id);
  const source = item.source || (window.pgd7Host ? window.pgd7Host(item.url) : '');
  const title = item.title || item.url.replace(/^https?:\/\//, '');

  const set = () => {
    const t = draft.trim();
    if (!t) return;
    ctx.actions.respond(item.id, { text: t, register: 'reflection', issue: DS_PENDING.id });
    setDraft('');
    close();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div style={{ paddingRight: 34, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <span style={DS_KICKER}>{source}</span>
        <div style={{
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 17, lineHeight: 1.28,
          letterSpacing: '-0.015em', color: 'var(--color-fg-1)', textWrap: 'pretty',
        }}>{title}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={DS_META}>Prints {dsDateLabel(DS_PENDING.at)}</span>
        {rung && (
          <React.Fragment>
            <span aria-hidden="true" style={{ ...DS_META, color: 'var(--color-border-strong)' }}>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span aria-hidden="true" style={{ fontSize: 13, lineHeight: 1 }}>{mine.glyph}</span>
              <span style={DS_META}>under {rung}</span>
            </span>
          </React.Fragment>
        )}
      </div>

      {held.length > 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 8,
          background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-1)',
          borderRadius: 'var(--radius-md)', padding: '12px 12px 11px',
        }}>
          <span style={DS_KICKER}>Yours</span>
          {held.map((l) => <div key={l.key} style={DS_BODY}>{l.text}</div>)}
        </div>
      )}

      <textarea rows={3} value={draft} placeholder="Say what you carry away."
        onChange={(e) => setDraft(e.target.value)} style={DS_TEXTAREA} />

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <Button variant="secondary" onClick={close}>Say nothing</Button>
        <Button variant="primary" onClick={set}>Add to the dispatch</Button>
      </div>

      {printed.length > 0 && (
        <div style={{ borderTop: '1px solid var(--color-border-2)', paddingTop: 'var(--space-3)' }}>
          <Button variant="tertiary" size="sm" onClick={() => {
            ctx.setState({ open: printed[printed.length - 1] });
            close();
            ctx.openContinue();
          }}>Read the issue it ran in</Button>
        </div>
      )}
    </div>
  );
};

PGD7.register({
  id: 'dispatch',
  name: 'The Dispatch',
  // A mark, never a line: the rule and the word sit under the attribution and
  // carry no words of their own.
  face: { slot: 'below-attribution' },
  // The shipped reveal plays in full FIRST, and the field comes after it. The
  // reaction is immediate and on the card; the words are on a cadence, and this
  // is where the direction pays for that separation.
  landingMerged: false,
  initialState: { open: DS_CURRENT, carried: {}, opened: {} },
  Card: DsCard,
  Banner: DsBanner,
  Compose: DsCompose,
  Landing: DsAdd,
  Respond: DsAdd,
  Continue: DsPage,
  continueTitle: 'Dispatch',
  beats: {
    // Land on a card whose circle has already reacted, so the reveal has a shape
    // to show and the field that follows has a rung to print under.
    land: (api) => {
      const a1 = api.itemById('a1');
      const t = (a1 && !a1.read) ? a1 : (api.activeItems.find((i) => (i.reactions || []).some((r) => r.glyph)) || api.firstUnread());
      if (!t) return;
      api.setTab('active');
      api.openSwell(t);
    },
    // A read card whose entry has already run twice — the spine is there, and
    // adding a line is adding to the issue that has not printed yet.
    respond: (api) => {
      const t = api.itemById('r1') || api.firstRead();
      if (!t) return;
      api.setTab('read');
      api.openRespond(t);
    },
    // The issue that landed this week, where an entry is carried forward. The
    // band collapses as it opens, exactly as it does when a member presses it.
    continue: (api) => {
      api.setState((st) => ({ open: DS_CURRENT, opened: { ...((st && st.opened) || {}), [DS_CURRENT]: true } }));
      api.openContinue();
    },
  },
});
