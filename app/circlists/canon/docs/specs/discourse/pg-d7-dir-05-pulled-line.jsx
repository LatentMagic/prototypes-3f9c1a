// ============================================================================
// Discourse v7 — direction 05, The Pulled Line.
// ----------------------------------------------------------------------------
// The sharer writes nothing. They pull a sentence out of the thing they share,
// and every reader who marks read pulls one too. There is no free field
// anywhere in the direction: the only text the product ever carries is text
// that was already in the source.
//
// THE CARD FACE — the source's voice, inset. The excerpt sits between the title
// and the attribution, inside the item rather than attached to a person, on a
// measure narrower than the card, inset from the left with a hairline rule
// running its full height. No quotation glyphs: the rule and the measure do
// that work. One caption line beneath at metadata size — "Priya pulled this" —
// so the name attaches to the act of pulling and never to the words. The card
// carries exactly ONE line, ever: the sharer's in Active, the most recent pull
// in Read.
//
// THE PAIRING — the Swell attaches to the line, not the item. The reaction you
// commit on marking read lands on the sentence the card was carrying, so
// `deeply` means *this sentence, deeply*, and every line in the column is shown
// with the depth its puller gave.
//
// SELECTION IS PERFORMED, NEVER PICKED FROM A LIST. Every surface that takes a
// pull renders the source's own prose inline and takes the sentence you touch.
// Picking from a shortlist would answer a question about the shortlist.
//
// CONTINUATION IS ACCRETION, NOT REPLY. The column is the source itself with
// the circle's pulls standing in the margin where they fall: agreement reads as
// convergence on one passage, disagreement as distance between passages.
// ============================================================================

const { PGD7, Button } = window;
const { useState: plS } = React;

// ---- The depth vocabulary ---------------------------------------------------
// Copied once from app/swell-reactions.jsx, which keeps DEPTH_WORDS and
// levelFromIntensity internal. PLAYGROUND.md allows the copy; this is the
// pointer to its source. Verbatim — never "improved", or it stops being
// evidence of what the product actually says.
const PL_DEPTH_WORDS = ['a little', 'moderately', 'deeply'];
const plDepthOf = (i) => { const v = i == null ? 0.42 : i; return v < 0.34 ? 1 : v < 0.67 ? 2 : 3; };

// ============================================================================
// The source text.
// ----------------------------------------------------------------------------
// Seeded items carry their own prose (pg-d7-data.jsx). A link the reviewer adds
// does not, so a small bank stands in for the reader view the product would
// have — keyed by host, the same shape the extractor's table uses. A host in
// neither place is the direction's own stated cost arriving honestly: a source
// that resists quotation, where the only move left is to take the sentence by
// hand.
// ============================================================================
const PL_PROSE_BANK = {
  'longreads.com': [
    'The road out of the valley is nineteen miles of switchback and my mother walked it twice a week for eleven years, once with me on her hip and once without.',
    'She never described it as hardship. Hardship was a word for other people, applied from a distance, and she had no use for a word she could not do anything with.',
    'What I understood only much later is that the walk was the part of the week that belonged to her. Everything either side of it was owed to somebody.',
  ],
  'theparisreview.org': [
    'I do not believe in inspiration and I have never met anybody who does who has finished a book.',
    'The sentence you write on a bad morning is the sentence that survives revision, because you had no faith in it and so you left it alone.',
    'A novel is not a thing you plan and then execute. It is a thing you keep failing to abandon.',
  ],
  'sqlite.org': [
    'SQLite does not compete with client/server databases. It competes with fopen.',
    'The right question is not whether SQLite scales, but whether the thing you are building has one writer or many, because that is the boundary the design actually draws.',
    'For most applications the database is smaller than the machine it runs on, and a file is a better answer than a server nobody wanted to operate.',
  ],
};

// Sentence splitting, done without lookbehind so the rig behaves the same in
// every browser the reviewer might open it in.
const plSplitSentences = (para) => {
  const s = String(para || '');
  const out = [];
  let cur = '';
  for (let i = 0; i < s.length; i++) {
    cur += s[i];
    if ('.?!'.indexOf(s[i]) < 0) continue;
    const rest = s.slice(i + 1);
    if (rest && !/^\s/.test(rest)) continue;
    const next = (rest.match(/\S/) || [''])[0];
    if (next && /["'‘“A-Z]/.test(next)) { out.push(cur.trim()); cur = ''; }
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
};

// One split per source, kept for the life of the page: the prose never changes.
const PL_SENTENCE_CACHE = {};
const plProseOf = (item) => {
  if (!item) return [];
  if (item.prose && item.prose.length) return item.prose;
  const host = window.pgd7Host(item.url);
  if (PL_PROSE_BANK[host]) return PL_PROSE_BANK[host];
  const seeded = PGD7.data.items.find((i) => window.pgd7Host(i.url) === host && i.prose && i.prose.length);
  return seeded ? seeded.prose : [];
};
const plSentences = (item) => {
  if (!item) return [];
  const key = item.id + '|' + item.url;
  if (PL_SENTENCE_CACHE[key]) return PL_SENTENCE_CACHE[key];
  const out = [];
  plProseOf(item).forEach((para, p) => {
    plSplitSentences(para).forEach((text, s) => out.push({ key: p + ':' + s, p, s, text }));
  });
  PL_SENTENCE_CACHE[key] = out;
  return out;
};
const plParagraphs = (item) => {
  const rows = [];
  plProseOf(item).forEach((para, p) => {
    rows.push({ p, sentences: plSplitSentences(para).map((text, s) => ({ key: p + ':' + s, p, s, text })) });
  });
  return rows;
};

// Where a line falls in the source. Everything the circle has pulled is a
// sentence out of the text, so this is an exact hit; a pull taken by hand from
// a source with no text sits at the end, in the order it was taken.
const plPosOf = (item, text) => {
  const hit = plSentences(item).find((x) => x.text === text);
  if (hit) return { p: hit.p, s: hit.s };
  const para = plProseOf(item).findIndex((x) => String(x).indexOf(text) >= 0);
  if (para >= 0) return { p: para, s: 0.5 };
  return { p: 9999, s: 0 };
};

// ============================================================================
// The pulls.
// ----------------------------------------------------------------------------
// Sharing requires an excerpt, so every seeded item has a sharer's line: the
// sentence they took, by position in their own source. The circle's later pulls
// come from the seed; the reviewer's are committed through ctx.actions.respond
// carrying `pull`, so they persist with everything else the rig stores.
// ============================================================================
const PL_SHARER = {
  a1: [0, 0], a2: [1, 1], a3: [0, 0], a4: [0, 0], a5: [1, 0], a6: [0, 0], a7: [2, 0],
  r1: [1, 0], r2: [2, 0], r3: [1, 0], r4: [0, 0],
};

const plSeedSharerLine = (item) => {
  const at = PL_SHARER[item.id];
  if (!at) return null;
  const hit = plSentences(item).find((x) => x.p === at[0] && x.s === at[1]);
  return hit ? hit.text : null;
};

const plPulls = (item) => {
  if (!item) return [];
  const out = [];
  const seedSharer = plSeedSharerLine(item);
  if (seedSharer) out.push({ key: item.id + '-share', by: item.by, text: seedSharer, sharer: true });
  (item.pulls || []).forEach((p, i) => out.push({ key: item.id + '-p' + i, by: p.by, text: p.text }));
  (item.responses || []).forEach((r) => {
    if (r.pull) out.push({ key: r.id, by: r.by, text: r.text, sharer: !!r.sharer, at: r.at });
  });
  return out.sort((a, b) => {
    const pa = plPosOf(item, a.text), pb = plPosOf(item, b.text);
    return pa.p - pb.p || pa.s - pb.s;
  });
};

const plSharerLine = (item) => {
  const all = plPulls(item);
  return all.find((x) => x.sharer) || null;
};
const plLatestLine = (item) => {
  const all = plPulls(item);
  const mine = all.filter((x) => x.at);
  if (mine.length) return mine[mine.length - 1];
  const others = all.filter((x) => !x.sharer);
  return others.length ? others[others.length - 1] : (all[0] || null);
};
const plMinePulled = (item) => (item.responses || []).some((r) => r.pull && r.by === 'you');

// Convergence: two people on the same sentence are one line in the column, with
// both names under it. That is the only way this direction says "we agree".
const plColumn = (item) => {
  const rows = [];
  plPulls(item).forEach((pull) => {
    const hit = rows.find((r) => r.text === pull.text);
    if (hit) hit.by.push(pull.by);
    else rows.push({ key: pull.key, text: pull.text, by: [pull.by], sharer: pull.sharer });
  });
  return rows;
};

// ---- People -----------------------------------------------------------------
const plWho = (ctx, id) => (id === 'you' ? 'You' : String(ctx.nameOf(id)).split(' ')[0]);
const plCaption = (ctx, ids) => {
  const names = ids.map((id) => plWho(ctx, id));
  const joined = names.length === 1 ? names[0]
    : names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
  return joined + ' pulled this';
};
// The Swell a member gave this item — which, here, they gave to the line the
// card was carrying when they read it.
const plSwellOf = (ctx, item, id) => {
  const m = ctx.memberById(id);
  if (!m) return null;
  let hit = null;
  (item.reactions || []).forEach((r) => { if (r && r.name === m.name && r.glyph) hit = r; });
  return hit;
};

// ============================================================================
// Styles + the small shared parts.
// ============================================================================
const PL_META = {
  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em',
  color: 'var(--color-fg-3)', lineHeight: 1.5,
};
const PL_TITLE = {
  fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, lineHeight: 1.3,
  letterSpacing: '-0.01em', color: 'var(--color-fg-1)', textWrap: 'pretty',
};
const PL_EXCERPT = {
  fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 15, lineHeight: 1.6,
  color: 'var(--color-fg-1)', textWrap: 'pretty', letterSpacing: '0.001em',
};

// The rule and the measure are the quotation marks. Nothing else is.
const PlLine = ({ children, tight = false }) => (
  <div style={{
    borderLeft: '1px solid var(--color-border-strong)',
    paddingLeft: tight ? 12 : 14, marginLeft: 2,
    maxWidth: 'min(100%, 46ch)', minWidth: 0,
  }}>{children}</div>
);

const PlDepth = ({ rx }) => (rx ? (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
    <span aria-hidden="true" style={{ fontSize: 12.5, lineHeight: 1 }}>{rx.glyph}</span>
    <span style={PL_META}>{PL_DEPTH_WORDS[plDepthOf(rx.intensity) - 1]}</span>
  </span>
) : null);

const PlHead = ({ item }) => (
  <div style={{ paddingRight: 34, minWidth: 0 }}>
    <div style={{ ...PL_META, marginBottom: 3 }}>{item.source || window.pgd7Host(item.url)}</div>
    <div style={PL_TITLE}>{item.title || item.url.replace(/^https?:\/\//, '')}</div>
  </div>
);

// ============================================================================
// The picker — the source's prose, inline, one sentence at a time. Selection is
// performed against the text itself, which is the only way the act means what
// the direction says it means.
// ============================================================================
// A sentence has to be a genuine inline box, or the prose stops being prose: a
// <button> is laid out as an inline-block whatever its display says, so a long
// sentence pushes itself onto its own line and the paragraph reads as a list.
const PlSentence = ({ text, on, marked, onPick, style }) => (
  <span role="button" tabIndex={0} aria-pressed={on} className="pl7-sent"
    onClick={() => onPick(on ? null : text)}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(on ? null : text); } }}
    style={{
      cursor: 'pointer', padding: '2px 3px', margin: '0 -3px', borderRadius: 4,
      WebkitBoxDecorationBreak: 'clone', boxDecorationBreak: 'clone',
      background: on ? 'var(--color-accent)' : (marked ? 'var(--color-surface-sunken)' : 'transparent'),
      color: on ? 'var(--color-fg-inverse)' : (marked ? 'var(--color-fg-1)' : undefined),
      fontWeight: marked && !on ? 500 : undefined,
      ...(style || {}),
    }}>{text}</span>
);

const PlPicker = ({ item, taken, value, onChange, height = 250 }) => {
  const sentences = plSentences(item);
  if (!sentences.length) return null;
  return (
    <div style={{
      maxHeight: height, overflowY: 'auto', overscrollBehavior: 'contain',
      border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)',
      padding: '4px 4px', background: 'var(--color-surface)',
    }}>
      {plParagraphs(item).map((para) => (
        <p key={para.p} style={{ ...PL_EXCERPT, fontSize: 14.5, margin: '8px 6px 14px' }}>
          {para.sentences.map((sn) => (
            <React.Fragment key={sn.key}>
              <PlSentence text={sn.text} on={value === sn.text}
                marked={taken.indexOf(sn.text) >= 0} onPick={onChange} />{' '}
            </React.Fragment>
          ))}
        </p>
      ))}
    </div>
  );
};

// ============================================================================
// The card face — the source's voice, inset between the title and the person
// who put it there. One line, one caption, nothing else.
// ============================================================================
const PlCard = ({ ctx, item, tab }) => {
  const pull = tab === 'read' ? plLatestLine(item) : plSharerLine(item);
  if (!pull) return null;                       // pulled nothing — a bare card
  const open = () => (item.read ? ctx.openRespond(item) : ctx.openSwell(item));
  return (
    <div style={{ margin: '12px 0 4px' }}>
      <button type="button" onClick={open} style={{
        appearance: 'none', border: 0, background: 'transparent', padding: 0,
        textAlign: 'left', cursor: 'pointer', display: 'block', width: '100%', minWidth: 0,
      }}>
        <PlLine>
          <div style={PL_EXCERPT}>{pull.text}</div>
        </PlLine>
        <div style={{ ...PL_META, paddingLeft: 17, marginTop: 7 }}>
          {plCaption(ctx, pull.by ? [pull.by] : [item.by])}
        </div>
      </button>
    </div>
  );
};

// ============================================================================
// Beat 1 — attach. Sharing is a URL and one sentence out of it. There is no
// free field: what the card will carry is chosen out of the text, and it is
// shown in the treatment it will have on the card as it is chosen.
// ============================================================================
const PlCompose = ({ ctx, item, submit }) => {
  const sentences = plSentences(item);
  const [line, setLine] = plS(null);
  const [typed, setTyped] = plS('');
  const byHand = !sentences.length;
  const chosen = byHand ? typed.trim() : line;

  const pull = () => {
    if (!chosen) return;
    ctx.actions.respond(item.id, { text: chosen, register: 'gist', pull: true, sharer: true });
    submit(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div style={{ ...PL_META, color: 'var(--color-fg-2)' }}>
        {byHand ? 'Take a sentence out of it' : 'Pull a line out of it'}
      </div>

      {byHand ? (
        <textarea rows={3} value={typed} placeholder="Paste the sentence."
          onChange={(e) => setTyped(e.target.value)} style={{
            width: '100%', boxSizing: 'border-box', ...PL_EXCERPT, fontSize: 16,
            padding: '10px 12px', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-1)', background: 'var(--color-surface)',
            resize: 'vertical', minHeight: 76,
          }} />
      ) : (
        <PlPicker item={item} taken={[]} value={line} onChange={setLine} height={244} />
      )}

      {chosen && (
        <div>
          <PlLine>
            <div style={PL_EXCERPT}>{chosen}</div>
          </PlLine>
          <div style={{ ...PL_META, paddingLeft: 17, marginTop: 7 }}>You pulled this</div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
        <Button variant="secondary" onClick={() => submit(null)}>Skip</Button>
        <Button variant="primary" disabled={!chosen} onClick={pull}>Pull it</Button>
      </div>
    </div>
  );
};

// ============================================================================
// Beats 2 and 3 — one surface. Marking read opens the pull: the line you met,
// carrying the depth you just gave it, and then the source itself so you can
// take your own. Pass and you get the circle's lines with their Swells; pull
// and yours joins them, in the place it falls in the text.
// ============================================================================
const PlReading = ({ ctx, item, glyph, close }) => {
  const [line, setLine] = plS(null);
  const [typed, setTyped] = plS('');
  const [passed, setPassed] = plS(false);
  const met = plSharerLine(item);
  const sentences = plSentences(item);
  const byHand = !sentences.length;
  const chosen = byHand ? typed.trim() : line;
  const done = plMinePulled(item);
  const all = plColumn(item);
  const taken = all.map((r) => r.text);
  // The line you met is already at the top of this surface with your depth on
  // it; the column below is where everybody else stopped.
  const column = all.filter((r) => !met || r.text !== met.text);
  const metRow = met ? all.find((r) => r.text === met.text) : null;
  const mine = plSwellOf(ctx, item, 'you');
  const rx = mine || (glyph ? { glyph } : null);

  const pull = () => {
    if (!chosen) return;
    ctx.actions.respond(item.id, { text: chosen, register: 'takeaway', pull: true });
    setLine(null); setTyped('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <PlHead item={item} />

      {met && (
        <div>
          <PlLine>
            <div style={{ ...PL_EXCERPT, fontSize: 16 }}>{met.text}</div>
          </PlLine>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', paddingLeft: 17, marginTop: 8 }}>
            <span style={PL_META}>{plCaption(ctx, (metRow && metRow.by) || [met.by])}</span>
            {rx && rx.glyph && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ ...PL_META, color: 'var(--color-fg-2)' }}>You</span>
                <PlDepth rx={rx} />
              </span>
            )}
          </div>
        </div>
      )}

      {!done && !passed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ ...PL_META, color: 'var(--color-fg-2)' }}>Take your own line</div>
          {byHand ? (
            <textarea rows={3} value={typed} placeholder="Paste the sentence."
              onChange={(e) => setTyped(e.target.value)} style={{
                width: '100%', boxSizing: 'border-box', ...PL_EXCERPT, fontSize: 16,
                padding: '10px 12px', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-1)', background: 'var(--color-surface)',
                resize: 'vertical', minHeight: 76,
              }} />
          ) : (
            <PlPicker item={item} taken={taken} value={line} onChange={setLine} height={228} />
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
            <Button variant="secondary" onClick={() => setPassed(true)}>Pass</Button>
            <Button variant="primary" disabled={!chosen} onClick={pull}>Pull it</Button>
          </div>
        </div>
      )}

      {(done || (passed && column.length > 0)) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', borderTop: '1px solid var(--color-border-2)', paddingTop: 'var(--space-4)' }}>
          {column.map((row) => (
            <div key={row.key}>
              <PlLine tight>
                <div style={{ ...PL_EXCERPT, fontSize: 14.5 }}>{row.text}</div>
              </PlLine>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', paddingLeft: 15, marginTop: 6 }}>
                <span style={PL_META}>{plCaption(ctx, row.by)}</span>
                {row.by.map((id) => {
                  const r = plSwellOf(ctx, item, id);
                  return r ? <PlDepth key={id} rx={r} /> : null;
                })}
              </div>
            </div>
          ))}
          {done && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => { close(); ctx.setState({ focus: item.id }); ctx.openContinue(); }}>
                See the column
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Beat 4 — continue. The column is the source itself, with the circle standing
// in the margin where each of them stopped. Convergence is a passage several
// people took; disagreement is the distance between two passages. Speaking
// again is pulling a second line, which is done here, against the text, and is
// the same act contribution was.
// ============================================================================
const PlColumnPage = ({ ctx }) => {
  const item = ctx.itemById(ctx.state.focus) || ctx.readItems[0] || ctx.items[0] || null;
  const [line, setLine] = plS(null);
  if (!item) return null;

  const column = plColumn(item);
  const paras = plParagraphs(item);
  const rowFor = (text) => column.find((r) => r.text === text) || null;
  // A line that runs across two sentences, or one taken by hand from a source
  // with no text, has no single place in the margin. It still belongs to the
  // column, so it stands under the source rather than being dropped.
  const placed = plSentences(item).map((x) => x.text);
  const unplaced = column.filter((r) => placed.indexOf(r.text) < 0);

  const pull = () => {
    if (!line) return;
    ctx.actions.respond(item.id, { text: line, register: 'takeaway', pull: true });
    setLine(null);
  };

  return (
    <div className="pl7-src" style={{
      maxWidth: 'var(--max-feed-width)', margin: '0 auto', width: '100%', boxSizing: 'border-box',
      padding: '20px 16px 40px', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)',
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ ...PL_META, marginBottom: 4 }}>{item.source || window.pgd7Host(item.url)}</div>
        <div style={{ ...PL_TITLE, fontSize: 19 }}>{item.title || item.url.replace(/^https?:\/\//, '')}</div>
      </div>

      {paras.map((para) => {
        const marks = para.sentences.map((sn) => rowFor(sn.text)).filter(Boolean);
        const selectedHere = para.sentences.some((sn) => sn.text === line);
        return (
          <div key={para.p} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="pl7-para">
              <p style={{ ...PL_EXCERPT, color: 'var(--color-fg-3)', margin: 0, minWidth: 0 }}>
                {para.sentences.map((sn) => {
                  const row = rowFor(sn.text);
                  const on = line === sn.text;
                  return (
                    <React.Fragment key={sn.key}>
                      <PlSentence text={sn.text} on={on} marked={!!row} onPick={setLine} />{' '}
                    </React.Fragment>
                  );
                })}
              </p>
              <div className="pl7-marg" style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                {marks.map((row) => (
                  <div key={row.key} style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                    <span style={PL_META}>{plCaption(ctx, row.by)}</span>
                    <span style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {row.by.map((id) => {
                        const r = plSwellOf(ctx, item, id);
                        return r ? <PlDepth key={id} rx={r} /> : null;
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {selectedHere && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                <Button variant="secondary" size="sm" onClick={() => setLine(null)}>Leave it</Button>
                <Button variant="primary" size="sm" onClick={pull}>Pull this line</Button>
              </div>
            )}
          </div>
        );
      })}

      {unplaced.length > 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 'var(--space-4)',
          borderTop: paras.length ? '1px solid var(--color-border-2)' : 0,
          paddingTop: paras.length ? 'var(--space-4)' : 0,
        }}>
          {unplaced.map((row) => (
            <div key={row.key}>
              <PlLine tight><div style={{ ...PL_EXCERPT, fontSize: 14.5 }}>{row.text}</div></PlLine>
              <div style={{ ...PL_META, paddingLeft: 15, marginTop: 6 }}>{plCaption(ctx, row.by)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---- The two rules the inline styles cannot carry ---------------------------
// A container query, so the margin sits beside the text on the width it is
// handed rather than on a posture flag (GOTCHA #8), and a hover for the
// sentences, which is a state inline styles have no way to express.
const PL_CSS = `
.pl7-src { container-type: inline-size; }
.pl7-para { display: grid; grid-template-columns: minmax(0,1fr); gap: 8px; align-items: start; }
.pl7-sent:hover { background: var(--color-surface-sunken); }
.pl7-sent[aria-pressed="true"]:hover { background: var(--color-accent-hover); }
@container (min-width: 620px) {
  .pl7-para { grid-template-columns: minmax(0,1fr) 150px; gap: 20px; }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('pl7-css')) {
  const el = document.createElement('style');
  el.id = 'pl7-css';
  el.textContent = PL_CSS;
  document.head.appendChild(el);
}

PGD7.register({
  id: 'pulled-line',
  name: 'The Pulled Line',
  // Between the title and the attribution: inside the item, not attached to a
  // person. The only card in the set whose text is somebody else's voice.
  face: { slot: 'title-attribution' },
  initialState: { focus: null },
  Card: PlCard,
  Compose: PlCompose,
  Landing: PlReading,
  Respond: PlReading,
  Continue: PlColumnPage,
  continueTitle: 'The column',
  beats: {
    // Land on a card whose line somebody has already answered with a second
    // one, so the Swell commits onto a sentence and the column it joins is
    // inhabited rather than empty.
    land: (api) => {
      const lively = (i) => plSharerLine(i) && plPulls(i).length > 1;
      const t = api.activeItems.find(lively) || api.activeItems.find(plSharerLine) || api.firstUnread();
      if (!t) return;
      api.setTab('active');
      api.openSwell(t);
    },
    // A read card where two people took the same sentence and a third took a
    // different one: convergence and distance in the same column.
    respond: (api) => {
      const t = api.itemById('r1') || api.readItems.find((i) => plPulls(i).length > 2) || api.firstRead();
      if (!t) return;
      api.setTab('read');
      api.openRespond(t);
    },
    // The column against its source, on the card that carries the most of it.
    continue: (api) => {
      const t = api.itemById('r1') || api.readItems.find((i) => plPulls(i).length > 1) || api.firstRead();
      api.setState({ focus: t ? t.id : null });
      api.openContinue();
    },
  },
});
