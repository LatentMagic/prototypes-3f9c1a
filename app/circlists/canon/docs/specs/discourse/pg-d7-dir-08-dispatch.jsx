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
// THE APP-POSTURE HOME, stated under the constraint. MOBILE.md fixes three
// circle-local bar slots and says a fourth does not earn its place, so
// Dispatches cannot be a bar slot. Its home is a single band above the
// Active/Read tabs announcing the current issue, pushing to a full page. On
// desktop the page takes a reading measure with the shelf and the entry list as
// a sidebar, where that cost does not arise.
//
// A composed periodical is a typography problem, so the setting here is the
// design: mono kickers, a double rule under the masthead, one measure, a lead
// paragraph, and an end.
// ============================================================================

// No Avatar here on purpose: a printed issue attributes in type, not in faces.
const { PGD7, Button, Icon } = window;
const { useState: dpS, useEffect: dpE, useRef: dpR } = React;

// ---- The depth vocabulary ---------------------------------------------------
// Copied once from app/swell-reactions.jsx, which keeps DEPTH_WORDS and
// levelFromIntensity internal. PLAYGROUND.md allows the copy; this is the
// pointer to its source. Verbatim — never "improved", or it stops being
// evidence of what the product actually says.
const DP_DEPTH_WORDS = ['a little', 'moderately', 'deeply'];
const dpLevel = (i) => { const v = i == null ? 0.42 : i; return v < 0.34 ? 1 : v < 0.67 ? 2 : 3; };

// ---- The swell, drawn as a shape --------------------------------------------
// The geometry below is COPIED from app/swell-reactions.jsx (glyphAngle, iv,
// swellJitterR, swellLayout), which keeps all of it internal. Same allowance,
// same rule: it carries this pointer and is not tuned. The entry header renders
// it PASSIVE and unlabelled — a shape, with no roster, no names and no count.
const DP_GLYPHS = window.RX_GLYPHS || [];
const DP_MAXR = 0.46;
const dpGlyphIndex = (g) => DP_GLYPHS.indexOf(g);
const dpAngle = (idx) => (-90 + idx * (360 / (DP_GLYPHS.length || 5))) * Math.PI / 180;
const dpIv = (r) => (r && r.intensity != null ? r.intensity : 0.42);
const DP_GAP = 0.075;
const dpLayout = (list) => {
  const arr = list || [];
  const groups = {};
  arr.forEach((r, i) => { const idx = r && r.glyph ? dpGlyphIndex(r.glyph) : -1; (groups[idx] = groups[idx] || []).push(i); });
  const anchor = {};
  Object.keys(groups).forEach((key) => {
    const idx = Number(key);
    const ids = groups[idx];
    const mean = ids.reduce((s, i) => s + dpIv(arr[i]), 0) / ids.length;
    let rr = idx >= 0 ? 0.13 + mean * 0.20 : 0.05;
    rr = Math.max(0.1, Math.min(0.34, rr));
    anchor[idx] = { rr, mean };
  });
  const seen = {};
  const pts = arr.map((r) => {
    const idx = r && r.glyph ? dpGlyphIndex(r.glyph) : -1;
    const n = (groups[idx] || []).length;
    const k = (seen[idx] = (seen[idx] == null ? 0 : seen[idx] + 1));
    const base = idx >= 0 ? dpAngle(idx) : -Math.PI / 2;
    const A = anchor[idx] || { rr: 0.13 + dpIv(r) * 0.20, mean: dpIv(r) };
    const ax = 0.5 + Math.cos(base) * A.rr, ay = 0.5 + Math.sin(base) * A.rr;
    if (n === 1) return { x: ax, y: ay };
    const ur = [Math.cos(base), Math.sin(base)];
    const ut = [-Math.sin(base), Math.cos(base)];
    const ang = k * 2.399963;
    const pr = DP_GAP * 0.95 * Math.sqrt(k);
    const tan = Math.cos(ang) * pr;
    const rad = Math.sin(ang) * pr + (dpIv(r) - A.mean) * 0.16;
    return { x: ax + ut[0] * tan + ur[0] * rad, y: ay + ut[1] * tan + ur[1] * rad };
  });
  const halfOf = (r) => 0.05 + dpIv(r) * 0.045;
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
    for (const p of pts) { const cx = p.x - 0.5, cy = p.y - 0.5, dd = Math.hypot(cx, cy); if (dd > DP_MAXR) { p.x = 0.5 + cx * DP_MAXR / dd; p.y = 0.5 + cy * DP_MAXR / dd; } }
    if (!moved) break;
  }
  return pts;
};

// ---- The cadence -------------------------------------------------------------
// One issue a week. Three have printed; the fourth is still open, and everything
// written now goes into it. Dates are relative to the session so the shelf is
// always inhabited and the pending issue always has a date still ahead of it.
const DP_DAY = 864e5;
const DP_T0 = Date.now();
const dpAt = (days) => DP_T0 + days * DP_DAY;
const dpDateLabel = (ms) => new Date(ms).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

// Seeded issues, oldest first. `items` is the period's running order — the
// entries the issue printed. `r1` prints twice: it was carried once already, so
// a spine exists before the reviewer touches anything.
const DP_ISSUES = [
  { id: 'i-3', at: dpAt(-15), items: ['r4', 'r3'] },
  { id: 'i-2', at: dpAt(-8), items: ['r1', 'r2'] },
  { id: 'i-1', at: dpAt(-1), items: ['a4', 'a5', 'a7', 'a2', 'a1', 'r1'] },
];
const DP_PENDING = { id: 'pending', at: dpAt(6), items: [] };
const DP_SEQ = [...DP_ISSUES.map((i) => i.id), DP_PENDING.id];
const dpIssue = (id) => (id === DP_PENDING.id ? DP_PENDING : DP_ISSUES.find((i) => i.id === id) || null);
const DP_CURRENT = 'i-1';

// ---- Lines -------------------------------------------------------------------
// A line is one thing a member said in a period: the sharer's thought (the
// entry's opening line) or a reader's line given back on reading.
const dpLines = (item) => {
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
const dpRuns = (ctx, item) => {
  const carried = ((ctx.state && ctx.state.carried) || {})[item.id] || [];
  const pendingLine = dpLines(item).some((l) => l.issue === DP_PENDING.id);
  const set = {};
  DP_ISSUES.forEach((is) => { if (is.items.indexOf(item.id) >= 0) set[is.id] = true; });
  carried.forEach((id) => { set[id] = true; });
  if (pendingLine) set[DP_PENDING.id] = true;
  const runs = DP_SEQ.filter((id) => set[id]);
  // Nothing seeded and nothing carried — a link the reviewer added themselves.
  // Its thought was written this period, so it prints in the next issue.
  return runs.length ? runs : [DP_PENDING.id];
};

// Which of an entry's runs a line prints in. An explicit issue wins — that is
// what a line written now carries, and it is the only way into the issue that
// has not printed yet. Everything else resolves against the PRINTED runs: the
// period that contains it, clamped to the nearest end so no line is ever
// silently dropped, and never pulled forward out of an issue that has landed.
const dpRunFor = (line, runs) => {
  if (line.issue) return line.issue;
  const real = runs.filter((id) => id !== DP_PENDING.id);
  if (!real.length) return DP_PENDING.id;
  for (let i = 0; i < real.length; i++) {
    const is = dpIssue(real[i]);
    if (is && line.at > is.at - 7 * DP_DAY && line.at <= is.at) return real[i];
  }
  const first = dpIssue(real[0]);
  if (first && line.at <= first.at) return real[0];
  return real[real.length - 1];
};

const dpLinesIn = (ctx, item, issueId) => {
  const runs = dpRuns(ctx, item);
  return dpLines(item).filter((l) => dpRunFor(l, runs) === issueId);
};

// The entries an issue carries, in the period's running order.
const dpEntries = (ctx, issueId) => {
  const seeded = (dpIssue(issueId) || { items: [] }).items;
  const carrying = ctx.items.filter((it) => dpRuns(ctx, it).indexOf(issueId) >= 0);
  const bySeed = [];
  seeded.forEach((id) => { const hit = carrying.find((it) => it.id === id); if (hit) bySeed.push(hit); });
  carrying.forEach((it) => { if (bySeed.indexOf(it) < 0) bySeed.push(it); });
  return bySeed;
};

// A member's reaction on an item — the rung their lines print under.
const dpReactionOf = (ctx, item, by) => {
  const name = by === 'you' ? 'You' : ctx.nameOf(by);
  let hit = null;
  (item.reactions || []).forEach((r) => { if (r && r.name === name) hit = r; });
  return hit;
};
const dpRungOf = (ctx, item, by) => {
  const rx = dpReactionOf(ctx, item, by);
  return rx && rx.glyph ? dpLevel(rx.intensity) : 0;
};

// Rung sections, deepest first. A section with nothing in it does not print.
const DP_RUNGS = [
  [3, 'Deeply'], [2, 'Moderately'], [1, 'A little'], [0, 'Read, no reaction'],
];

// ============================================================================
// Shared setting.
// ============================================================================
const DP_KICKER = {
  fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.14em',
  textTransform: 'uppercase', color: 'var(--color-fg-3)',
};
const DP_META = {
  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.03em',
  color: 'var(--color-fg-3)',
};
const DP_LEAD = {
  fontFamily: 'var(--font-sans)', fontSize: 17, lineHeight: 1.58,
  color: 'var(--color-fg-1)', textWrap: 'pretty', minWidth: 0,
};
const DP_BODY = {
  fontFamily: 'var(--font-sans)', fontSize: 15, lineHeight: 1.6,
  color: 'var(--color-fg-1)', textWrap: 'pretty', minWidth: 0,
};
const DP_TEXTAREA = {
  width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-sans)',
  fontSize: 16, lineHeight: 1.5, color: 'var(--color-fg-1)',
  padding: '10px 12px', borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border-1)', background: 'var(--color-surface)',
  resize: 'vertical', minHeight: 66,
};

// The circle's settled swell, as a shape. Passive: no roster, no names, nothing
// countable. Nobody has reacted, or everyone skipped -> no shape at all.
const DpShape = ({ item, size = 74 }) => {
  const live = (item.reactions || []).filter((r) => r && r.glyph);
  if (!live.length) return null;
  const pts = dpLayout(live);
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
          fontSize: 10 + dpIv(r) * 6,
        }}>{r.glyph}</span>
      ))}
    </div>
  );
};

// How many issues an entry has run, as a stack of hairlines. Never a number.
const DpSpine = ({ runs }) => (
  <span aria-hidden="true" style={{ display: 'inline-flex', flexDirection: 'column', gap: 3, paddingTop: 5, flexShrink: 0 }}>
    {runs.map((id) => (
      <span key={id} style={{ display: 'block', width: 16, height: 1, background: 'var(--color-fg-3)' }} />
    ))}
  </span>
);

// The app's own divider treatment, carrying the rung's name.
const DpRule = ({ label }) => (
  <div className="circ-fdiv" role="separator" aria-label={label}>
    <span className="circ-fdiv-label">{label}</span>
  </div>
);

// One printed line: who said it, the glyph they gave the item, the words.
const DpLine = ({ ctx, item, line }) => {
  const rx = dpReactionOf(ctx, item, line.by);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
        <span style={{ ...DP_KICKER, color: 'var(--color-fg-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {ctx.nameOf(line.by)}
        </span>
        {rx && rx.glyph && <span aria-hidden="true" style={{ fontSize: 12, lineHeight: 1, flexShrink: 0 }}>{rx.glyph}</span>}
      </div>
      <div style={DP_BODY}>{line.text}</div>
    </div>
  );
};

// ============================================================================
// An entry. The item, the circle's shape, the sharer's opening line, and the
// readers' lines grouped under the rung they gave it.
// ============================================================================
const DpEntry = ({ ctx, issueId, item, wide }) => {
  const [draft, setDraft] = dpS('');
  const runs = dpRuns(ctx, item);
  const pending = issueId === DP_PENDING.id;
  // An issue that has not printed shows you your own words and nobody else's.
  // Nothing anyone has set for it is readable until it lands, for everyone, at
  // the same moment — which is the whole of the direction's answer to the
  // early passer.
  const lines = dpLinesIn(ctx, item, issueId).filter((l) => !pending || l.by === 'you');
  const lead = pending ? null : (lines.find((l) => l.lead) || null);
  const rest = lines.filter((l) => l !== lead);
  const carriedOn = runs.indexOf(DP_PENDING.id) >= 0;
  const source = item.source || (window.pgd7Host ? window.pgd7Host(item.url) : item.url);
  const title = item.title || (window.pgd7TitleFromUrl ? window.pgd7TitleFromUrl(item.url) : null) || item.url.replace(/^https?:\/\//, '');

  const carry = () => {
    ctx.setState((s) => {
      const map = (s && s.carried) || {};
      const had = map[item.id] || [];
      if (had.indexOf(DP_PENDING.id) >= 0) return {};
      return { carried: { ...map, [item.id]: [...had, DP_PENDING.id] }, open: DP_PENDING.id };
    });
  };
  const write = () => {
    const t = draft.trim();
    if (!t) return;
    ctx.actions.respond(item.id, { text: t, register: 'takeaway', issue: DP_PENDING.id });
    setDraft('');
  };

  return (
    <article id={'dp-entry-' + issueId + '-' + item.id} style={{
      display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0,
      paddingTop: 22, borderTop: '1px solid var(--color-border-2)',
    }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', minWidth: 0 }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <span style={{ ...DP_KICKER, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{source}</span>
            {runs.length > 1 && <DpSpine runs={runs} />}
          </div>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="circ-cardtitle" style={{
            fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: wide ? 21 : 19,
            lineHeight: 1.25, letterSpacing: '-0.015em', color: 'var(--color-fg-1)',
            textDecoration: 'none', textWrap: 'pretty',
          }}>{title}</a>
        </div>
        <DpShape item={item} size={wide ? 82 : 68} />
      </div>

      {lead && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
          <div style={DP_LEAD}>{lead.text}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={DP_KICKER}>{ctx.nameOf(lead.by)}</span>
            {(() => { const rx = dpReactionOf(ctx, item, lead.by); return rx && rx.glyph
              ? <span aria-hidden="true" style={{ fontSize: 12, lineHeight: 1 }}>{rx.glyph}</span> : null; })()}
          </div>
        </div>
      )}

      {/* Grouped by rung: everything the circle said at `deeply` sits together.
          The reaction layer orders the words, which is what keeps this the
          periodical view of the Swell rather than a system beside it. An issue
          still open holds only your own lines, so it has nothing to group. */}
      {pending
        ? rest.map((l) => <DpLine key={l.key} ctx={ctx} item={item} line={l} />)
        : DP_RUNGS.map(([level, label]) => {
          const group = rest.filter((l) => dpRungOf(ctx, item, l.by) === level);
          if (!group.length) return null;
          return (
            <div key={level} style={{ display: 'flex', flexDirection: 'column', gap: 13, minWidth: 0 }}>
              <DpRule label={label} />
              {group.map((l) => <DpLine key={l.key} ctx={ctx} item={item} line={l} />)}
            </div>
          );
        })}

      {pending ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <textarea rows={2} value={draft} placeholder="Write under it."
            onChange={(e) => setDraft(e.target.value)} style={DP_TEXTAREA} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" size="sm" onClick={write}>Set it</Button>
          </div>
        </div>
      ) : carriedOn ? (
        <div style={DP_META}>Carried to the next issue</div>
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
const DpIssue = ({ ctx, issueId, wide }) => {
  const issue = dpIssue(issueId);
  if (!issue) return null;
  const pending = issueId === DP_PENDING.id;
  const entries = dpEntries(ctx, issueId);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 9, minWidth: 0 }}>
        <span style={DP_KICKER}>{pending ? 'Next issue' : 'Dispatch'}</span>
        <div style={{
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: wide ? 30 : 25,
          lineHeight: 1.1, letterSpacing: '-0.025em', color: 'var(--color-fg-1)', textWrap: 'balance',
        }}>{ctx.circle.name}</div>
        <div aria-hidden="true">
          <div style={{ height: 2, background: 'var(--color-fg-1)' }} />
          <div style={{ height: 3 }} />
          <div style={{ height: 1, background: 'var(--color-border-1)' }} />
        </div>
        <div style={{ ...DP_META, color: 'var(--color-fg-2)' }}>
          {pending ? 'Prints ' + dpDateLabel(issue.at) : dpDateLabel(issue.at)}
        </div>
      </header>

      {entries.map((item) => (
        <DpEntry key={item.id} ctx={ctx} issueId={issueId} item={item} wide={wide} />
      ))}

      {!pending && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 6 }}>
          <div aria-hidden="true" style={{ height: 1, background: 'var(--color-border-2)' }} />
          <div style={{ ...DP_KICKER, textAlign: 'center' }}>The issue ends</div>
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
const DpShelf = ({ ctx, openId, onOpen }) => {
  const rows = [DP_PENDING, ...DP_ISSUES.slice().reverse()];
  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
      <DpRule label="The shelf" />
      {rows.map((is) => {
        const on = is.id === openId;
        const pending = is.id === DP_PENDING.id;
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
            }}>{pending ? 'Prints ' + dpDateLabel(is.at) : dpDateLabel(is.at)}</span>
          </button>
        );
      })}
    </nav>
  );
};

// The entries of the open issue, as a running order you can jump into. Sidebar
// only — the narrow page is one scroll with a last page, and needs no index.
const DpContents = ({ ctx, issueId }) => {
  const entries = dpEntries(ctx, issueId);
  if (!entries.length) return null;
  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
      <DpRule label="In this issue" />
      {entries.map((item) => (
        <button key={item.id} type="button" onClick={() => {
          const el = document.getElementById('dp-entry-' + issueId + '-' + item.id);
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
const DpPage = ({ ctx }) => {
  const hostRef = dpR(null);
  const [w, setW] = dpS(0);
  dpE(() => {
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

  const openId = (ctx.state && ctx.state.open) || DP_CURRENT;
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
            <DpShelf ctx={ctx} openId={openId} onOpen={setOpen} />
            <DpContents ctx={ctx} issueId={openId} />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0, maxWidth: 660, display: 'flex', flexDirection: 'column', gap: 30 }}>
          <DpIssue ctx={ctx} issueId={openId} wide={wide} />
          {!wide && <DpShelf ctx={ctx} openId={openId} onOpen={setOpen} />}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// The band above the tabs. MOBILE.md leaves no fourth bar slot, so this is the
// dispatch's home in every posture: one line, announcing the current issue,
// pushing to the page.
// ============================================================================
const DpBanner = ({ ctx }) => {
  const issue = dpIssue(DP_CURRENT);
  return (
    <button type="button" onClick={() => { ctx.setState({ open: DP_CURRENT }); ctx.openContinue(); }} style={{
      display: 'flex', alignItems: 'center', gap: 10, width: '100%', minHeight: 44,
      padding: '0 16px', cursor: 'pointer', textAlign: 'left',
      background: 'var(--color-surface)', border: 0,
      borderBottom: '1px solid var(--color-border-2)',
    }}>
      <span style={DP_KICKER}>Dispatch</span>
      <span style={{
        flex: 1, minWidth: 0, fontFamily: 'var(--font-mono)', fontSize: 12,
        color: 'var(--color-fg-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{dpDateLabel(issue.at)}</span>
      <span style={{ flexShrink: 0, color: 'var(--color-fg-3)' }}><Icon name="chevron-right" size={16} /></span>
    </button>
  );
};

// ============================================================================
// The card face — a mark, not a line. A thin rule and the word Thought under the
// attribution, at metadata size. No content, no preview, no author beyond the
// attribution the card already carries. Nothing attached, nothing printed.
// ============================================================================
const DpCard = ({ item }) => {
  if (!item.thought) return null;
  return (
    <div style={{ marginTop: 11, paddingTop: 9, borderTop: '1px solid var(--color-border-2)' }}>
      <span style={DP_KICKER}>Thought</span>
    </div>
  );
};

// ============================================================================
// Beat 1 — attach. Written at share, held. The field says where the words go and
// when, and the card will show only that they exist.
// ============================================================================
const DpCompose = ({ draft, setDraft, submit }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
    <textarea rows={3} value={draft.text} placeholder="Say what you make of it."
      onChange={(e) => setDraft({ ...draft, text: e.target.value })} style={DP_TEXTAREA} />
    <div style={DP_META}>Prints {dpDateLabel(DP_PENDING.at)}</div>
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
const DpAdd = ({ ctx, item, close }) => {
  const [draft, setDraft] = dpS('');
  const mine = dpReactionOf(ctx, item, 'you');
  const rung = mine && mine.glyph ? DP_DEPTH_WORDS[dpLevel(mine.intensity) - 1] : null;
  const runs = dpRuns(ctx, item);
  const held = dpLinesIn(ctx, item, DP_PENDING.id).filter((l) => l.by === 'you');
  const printed = runs.filter((id) => id !== DP_PENDING.id);
  const source = item.source || (window.pgd7Host ? window.pgd7Host(item.url) : '');
  const title = item.title || item.url.replace(/^https?:\/\//, '');

  const set = () => {
    const t = draft.trim();
    if (!t) return;
    ctx.actions.respond(item.id, { text: t, register: 'reflection', issue: DP_PENDING.id });
    setDraft('');
    close();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div style={{ paddingRight: 34, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <span style={DP_KICKER}>{source}</span>
        <div style={{
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 17, lineHeight: 1.28,
          letterSpacing: '-0.015em', color: 'var(--color-fg-1)', textWrap: 'pretty',
        }}>{title}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={DP_META}>Prints {dpDateLabel(DP_PENDING.at)}</span>
        {rung && (
          <React.Fragment>
            <span aria-hidden="true" style={{ ...DP_META, color: 'var(--color-border-strong)' }}>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span aria-hidden="true" style={{ fontSize: 13, lineHeight: 1 }}>{mine.glyph}</span>
              <span style={DP_META}>under {rung}</span>
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
          <span style={DP_KICKER}>Yours</span>
          {held.map((l) => <div key={l.key} style={DP_BODY}>{l.text}</div>)}
        </div>
      )}

      <textarea rows={3} value={draft} placeholder="Say what you carry away."
        onChange={(e) => setDraft(e.target.value)} style={DP_TEXTAREA} />

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
  initialState: { open: DP_CURRENT, carried: {} },
  Card: DpCard,
  Banner: DpBanner,
  Compose: DpCompose,
  Landing: DpAdd,
  Respond: DpAdd,
  Continue: DpPage,
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
    // The issue that landed this week, where an entry is carried forward.
    continue: (api) => {
      api.setState({ open: DP_CURRENT });
      api.openContinue();
    },
  },
});
