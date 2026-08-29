// ============================================================================
// Discourse v10 — CHAPTER R: what happens when somebody leaves a thought in
// reflection to a post.
//
// v9's miss, stated plainly: all five states shipped the SAME reveal —
// SwellReview + the tail of the thread — and the same textarea in five frames.
// The reaction moment was never ideated at all; only its wrapper was.
//
// Six answers here, and they disagree with each other about what a reflection
// IS: a thing addressed to a person · a thing carried by your mark · a place in
// a sequence · a weight · how you will find the card again · nothing at all.
// Each owns both halves of the moment — the writing zone AND what the reveal
// does with what you left — because they are one idea, not two.
//
// Inside the laws: nothing here waits on other people (L1), nobody is shut out
// of speaking (L2), nothing already written is displaced (L3), every surface is
// bounded (L4), no prompts or stems (P1), and it all still happens in the
// reaction modal — no second screen (P2).
// ============================================================================
const { D9Write: RW, D9Composer: RCO, D9JoinIn: RJOIN, D9Utterance: RUTT, d9Order: rOrder,
        d9MyName: rMy, d9Title: rTtl, SwellScatter: RScatter, SwellReview: RReview,
        levelFromIntensity: rLevel, depthWord: rDepth } = window;

const r10Others = (item) => (item.talk || []).filter(t => t.by !== 'You');
const r10Last = (item) => { const o = r10Others(item); return o.length ? o[o.length - 1] : null; };
// Who your words are addressed to when the surface has an address: whoever
// spoke last, and failing that whoever handed the card over.
const r10Addressee = (item) => {
  const last = r10Last(item);
  if (last) return last.by;
  if (item.thought && item.thought.by !== 'You') return item.thought.by;
  return null;
};
// Lines nobody has answered yet — the reveal's own reason to exist in R1.
const r10Unanswered = (item) => {
  const all = item.talk || [];
  return all.filter(t => t.by !== 'You' && !all.some(x => x.replyTo === t.id));
};
const r10Eyebrow = (children, style) => (
  <span style={{ font: '500 10.5px/1 var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase',
    color: 'var(--color-fg-3)', ...(style || {}) }}>{children}</span>
);
const r10Rule = (m) => <div aria-hidden="true" style={{ height: 1, background: 'var(--color-border-2)', margin: m || '16px 0' }} />;

// ============================================================================
// R1 · HANDED TO SOMEBODY
// The reaction is for the circle; the words are for a person. The surface says
// who has them before you write, and the reveal is a delivery — then it shows
// the lines nobody has answered, because that is the state of the room and the
// one thing your presence can change.
// ============================================================================
const R1Write = ({ text, setText, item }) => {
  const to = r10Addressee(item);
  return (
    <div style={{ width: '100%', marginTop: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        {to ? <window.Avatar name={to} size={22} /> : null}
        <span style={{ flex: 1, minWidth: 0, font: '500 12.5px/1.4 var(--font-sans)', color: 'var(--color-fg-2)' }}>
          {to ? 'To ' + to : 'To the circle \u2014 nobody has spoken here yet'}
        </span>
      </div>
      <RW value={text} onChange={setText} lines={2} max={220} frame="box"
        placeholder={to ? 'Answer ' + to : 'Say something to the circle'} />
      <p style={{ margin: '8px 0 0', font: '400 12.5px/1.5 var(--font-sans)', color: 'var(--color-fg-3)', textWrap: 'pretty' }}>
        The reaction goes to the circle. Words are addressed{to ? ' to ' + to : ''}, and the circle reads them either way.
      </p>
    </div>
  );
};

const R1Reveal = ({ item, mine, text, ctx }) => {
  const to = r10Addressee(item);
  const [replyTo, setReplyTo] = React.useState(null);
  const open = r10Unanswered(item).filter(t => t.by !== to).slice(0, 2);
  return (
    <div style={{ width: '100%', textAlign: 'left' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', padding: '4px 0 2px' }}>
        {mine && mine.glyph
          ? <span style={{ fontSize: 30, lineHeight: 1 }}>{mine.glyph}</span>
          : <window.D9WatchRing on size={20} />}
        <span style={{ font: '400 13.5px/1.5 var(--font-sans)', color: 'var(--color-fg-2)', textWrap: 'pretty' }}>
          {mine && mine.glyph ? 'How it landed is with the circle.' : 'You read it quietly. The circle knows that much.'}
        </span>
      </div>
      {text ? (
        <React.Fragment>
          {r10Rule('16px 0 14px')}
          <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
            <window.Avatar name={to || 'Circle'} size={30} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', font: '600 13.5px/1.35 var(--font-sans)', color: 'var(--color-fg-1)' }}>
                {to ? to + ' has it' : 'The circle has it'}
              </span>
              <p style={{ margin: '5px 0 0', font: '400 14.5px/1.6 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{text}</p>
              <span style={{ display: 'block', marginTop: 6, font: '400 12.5px/1.5 var(--font-sans)', color: 'var(--color-fg-3)' }}>
                Anyone in the circle can read it. It is answerable by all of them.
              </span>
            </div>
          </div>
        </React.Fragment>
      ) : null}
      {open.length ? (
        <React.Fragment>
          {r10Rule('16px 0 12px')}
          {r10Eyebrow('nobody has answered these', { display: 'block', marginBottom: 12 })}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {open.map(e => <RUTT key={e.id} entry={e} all={item.talk} depth={0} showGlyph onReply={setReplyTo} />)}
          </div>
          {replyTo && (
            <div style={{ marginTop: 14 }}>
              <RCO item={item} ctx={ctx} lines={2} max={220} autoFocus replyTo={replyTo}
                onCancelReply={() => setReplyTo(null)} cta="Leave it" />
            </div>
          )}
        </React.Fragment>
      ) : null}
    </div>
  );
};

// ============================================================================
// R2 · YOUR WORDS RIDE YOUR MARK
// No list anywhere. What you said is carried BY the reaction you gave: the disc
// is the record, your line hangs off your own glyph, and reading the circle is
// touching a face. Words without a reaction sit at the rim, said and unplaced.
// ============================================================================
const R2Write = ({ swell, text, setText }) => (
  <div style={{ width: '100%', marginTop: 14, display: 'flex', gap: 10, alignItems: 'stretch' }}>
    <div style={{ width: 30, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span style={{ width: 30, height: 30, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderStyle: 'solid', borderColor: swell.glyph ? 'var(--color-border-1)' : 'var(--color-border-2)',
        background: 'var(--color-surface)', flexShrink: 0 }}>
        {swell.glyph ? <span style={{ fontSize: 17, lineHeight: 1 }}>{swell.glyph}</span>
          : <span aria-hidden="true" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-border-1)' }} />}
      </span>
      <span aria-hidden="true" style={{ flex: 1, width: 1, background: 'var(--color-border-2)', marginTop: 2 }} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <RW value={text} onChange={setText} lines={2} max={140} rule frame="box"
        placeholder={swell.glyph ? 'What the mark does not say' : 'Say it without a reaction, if you like'} />
      <p style={{ margin: '7px 0 0', font: '400 12px/1.5 var(--font-sans)', color: 'var(--color-fg-3)', textWrap: 'pretty' }}>
        {swell.glyph ? 'Your words will hang off this mark on the disc.' : 'With no mark, your words sit at the rim of the disc.'}
      </p>
    </div>
  </div>
);

const R2Reveal = ({ item, mine, text, narrow }) => {
  const others = (item.reactions || []).filter(r => r.name !== 'You' && r.glyph);
  const said = (name) => {
    const rows = (item.talk || []).filter(t => t.by === name);
    return rows.length ? rows[rows.length - 1].text : null;
  };
  const all = [...others, ...(mine && mine.glyph ? [{ ...mine, name: 'You' }] : [])];
  const size = Math.min(narrow ? 250 : 270, (typeof window !== 'undefined' ? window.innerWidth : 400) - 110);
  const [sel, setSel] = React.useState(all.length ? all.length - 1 : null);
  const cur = sel != null ? all[sel] : null;
  const curText = cur ? (cur.name === 'You' ? (text || said('You')) : said(cur.name)) : null;
  const rim = !mine || !mine.glyph ? (text || null) : null;
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <RScatter all={all} size={size} selected={sel} onSelect={setSel} interactive />
      </div>
      <div style={{ minHeight: 96, marginTop: 14, textAlign: 'left' }}>
        {cur ? (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 20, lineHeight: 1, paddingTop: 1 }}>{cur.glyph}</span>
            <div style={{ minWidth: 0 }}>
              <span style={{ display: 'block', font: '600 13.5px/1.3 var(--font-sans)', color: cur.name === 'You' ? 'var(--color-accent)' : 'var(--color-fg-1)' }}>
                {cur.name} <span style={{ fontWeight: 400, color: 'var(--color-fg-3)' }}>{rDepth ? rDepth({ intensity: cur.intensity }) : ''}</span>
              </span>
              <p style={{ margin: '4px 0 0', font: '400 14.5px/1.6 var(--font-sans)',
                color: curText ? 'var(--color-fg-1)' : 'var(--color-fg-3)', textWrap: 'pretty' }}>
                {curText || 'Left the mark and nothing else.'}
              </p>
            </div>
          </div>
        ) : (
          <p style={{ margin: 0, font: '400 13.5px/1.6 var(--font-sans)', color: 'var(--color-fg-3)' }}>Touch a mark to read what that person said.</p>
        )}
        {rim ? (
          <div style={{ marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)' }}>
            {r10Eyebrow('at the rim, no mark', { display: 'block', marginBottom: 6 })}
            <p style={{ margin: 0, font: '400 14.5px/1.6 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{rim}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

// ============================================================================
// R3 · WHERE YOU STAND
// A reflection is a place in a sequence, not an item in a set. The reveal is the
// card's read order — who has been here, in the order they arrived, with what
// they said where they said it — and you have just been written into it. It
// counts nothing and asks nothing of anybody: L1 holds.
// ============================================================================
const r3Order = (item, mine) => {
  const rows = (item.reactions || []).filter(r => r.name !== 'You').map(r => ({
    name: r.name, glyph: r.glyph, intensity: r.intensity, at: r.at || 0,
    text: (item.talk || []).filter(t => t.by === r.name).slice(-1).map(t => t.text)[0] || null,
  }));
  (item.talk || []).forEach(t => {
    if (t.by === 'You') return;
    if (!rows.some(r => r.name === t.by)) rows.push({ name: t.by, glyph: t.glyph, intensity: t.intensity, at: t.at, text: t.text });
  });
  rows.sort((a, b) => a.at - b.at);
  return rows;
};

const R3Write = ({ text, setText, item }) => {
  const n = r3Order(item).length + 1;
  const ord = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth'][Math.min(8, n - 1)];
  return (
    <div style={{ width: '100%', marginTop: 14 }}>
      {r10Eyebrow('you are the ' + ord + ' here', { display: 'block', marginBottom: 8 })}
      <RW value={text} onChange={setText} lines={2} max={220} frame="box" placeholder="Say something to the circle" />
    </div>
  );
};

const R3Reveal = ({ item, mine, text }) => {
  const rows = r3Order(item);
  const mineRow = { name: 'You', glyph: mine && mine.glyph, intensity: mine && mine.intensity, text: text || null, me: true };
  const seq = [...rows, mineRow];
  const total = 9;
  const left = Math.max(0, total - seq.length);
  return (
    <div style={{ width: '100%', textAlign: 'left' }}>
      {r10Eyebrow('the order people got here', { display: 'block', marginBottom: 14 })}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {seq.map((r, i) => (
          <div key={r.name + i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '9px 0' }}>
            <span style={{ width: 22, flexShrink: 0, textAlign: 'right', font: '500 11.5px/1.5 var(--font-mono)',
              color: r.me ? 'var(--color-accent)' : 'var(--color-fg-3)' }}>{i + 1}</span>
            <span style={{ width: 20, flexShrink: 0, display: 'inline-flex', justifyContent: 'center', paddingTop: 1 }}>
              {r.glyph ? <span style={{ fontSize: 15, lineHeight: 1.2 }}>{r.glyph}</span>
                : <span aria-hidden="true" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-border-1)', marginTop: 7 }} />}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ font: '600 13.5px/1.4 var(--font-sans)', color: r.me ? 'var(--color-accent)' : 'var(--color-fg-1)' }}>{r.name}</span>
              {r.text
                ? <p style={{ margin: '3px 0 0', font: '400 14px/1.55 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{r.text}</p>
                : <p style={{ margin: '3px 0 0', font: '400 13px/1.5 var(--font-sans)', color: 'var(--color-fg-3)' }}>read it, said nothing</p>}
            </div>
          </div>
        ))}
      </div>
      {left ? (
        <p style={{ margin: '14px 0 0', paddingTop: 12, borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)',
          font: '400 13px/1.6 var(--font-sans)', color: 'var(--color-fg-3)', textWrap: 'pretty' }}>
          {left} {left === 1 ? 'person has' : 'people have'} not been here. Whatever they say will come after you.
        </p>
      ) : null}
    </div>
  );
};

// ============================================================================
// R4 · WEIGHT
// The Swell already knows how strongly you felt; nothing in the record has ever
// used it. Here it sets the words: a reflection is typeset at the depth behind
// it, so the record reads as a page of voices at their own volume — no avatars,
// no rows, no chrome. Your line takes its size as you type it.
// ============================================================================
const r4Size = (intensity) => 15 + Math.round((intensity == null ? 0.35 : intensity) * 10);

const R4Write = ({ swell, text, setText }) => {
  const [val, setVal] = [text, setText];
  const size = r4Size(swell.intensity);
  return (
    <div style={{ width: '100%', marginTop: 14 }}>
      <RW value={val} onChange={setVal} lines={2} max={200} frame="box" size={size}
        placeholder={swell.glyph ? 'Say it at that depth' : 'Say something to the circle'} />
      <p style={{ margin: '7px 0 0', font: '400 12px/1.5 var(--font-sans)', color: 'var(--color-fg-3)', textWrap: 'pretty' }}>
        {swell.glyph ? 'The circle reads your words at the depth you gave.' : 'With no reaction, your words read at their plain size.'}
      </p>
    </div>
  );
};

const R4Reveal = ({ item, mine, text }) => {
  const lines = (item.talk || []).filter(t => t.by !== 'You').map(t => ({
    by: t.by, text: t.text, intensity: t.intensity != null ? t.intensity
      : ((item.reactions || []).find(r => r.name === t.by) || {}).intensity,
  }));
  if (text) lines.push({ by: 'You', text, intensity: mine && mine.intensity, me: true });
  const bare = (item.reactions || []).filter(r => r.glyph && !(item.talk || []).some(t => t.by === r.name))
    .concat(mine && mine.glyph && !text ? [{ ...mine, name: 'You' }] : []);
  return (
    <div style={{ width: '100%', textAlign: 'left' }}>
      {lines.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {lines.map((l, i) => (
            <div key={i}>
              <p style={{ margin: 0, font: '400 ' + r4Size(l.intensity) + 'px/1.5 var(--font-sans)',
                letterSpacing: r4Size(l.intensity) > 20 ? '-0.015em' : '0',
                color: l.me ? 'var(--color-accent)' : 'var(--color-fg-1)', textWrap: 'pretty' }}>{l.text}</p>
              <span style={{ display: 'block', marginTop: 5, font: '500 11px/1 var(--font-mono)', letterSpacing: '0.08em',
                textTransform: 'uppercase', color: 'var(--color-fg-3)' }}>{l.by}</span>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ margin: 0, font: '400 14px/1.6 var(--font-sans)', color: 'var(--color-fg-3)' }}>Nobody has put words here. Only marks.</p>
      )}
      {bare.length ? (
        <div style={{ marginTop: 22, paddingTop: 14, borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)' }}>
          {r10Eyebrow('and, without words', { display: 'block', marginBottom: 10 })}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'flex-end' }}>
            {bare.map((r, i) => (
              <span key={i} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: r4Size(r.intensity), lineHeight: 1 }}>{r.glyph}</span>
                <span style={{ font: '400 11px/1 var(--font-sans)', color: 'var(--color-fg-3)' }}>{r.name}</span>
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

// ============================================================================
// R5 · IT BECOMES HOW YOU FIND IT AGAIN
// A reflection is not filed away in a record — it is fixed to the card, at the
// head, on YOUR shelf. What you said is how you will recognise the thing in a
// month. Nothing is overwritten: the contributor's note stays under it, and
// what the circle sees is unchanged (L3).
// ============================================================================
const R5Write = ({ text, setText, item }) => (
  <div style={{ width: '100%', marginTop: 14 }}>
    <div style={{ borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-sunken)', padding: 12 }}>
      {r10Eyebrow('how this card will read for you', { display: 'block', marginBottom: 9 })}
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', borderWidth: 1, borderStyle: 'solid',
        borderColor: 'var(--color-border-2)', padding: '11px 13px' }}>
        <div style={{ borderLeftWidth: 2, borderLeftStyle: 'solid', borderLeftColor: text.trim() ? 'var(--color-accent)' : 'var(--color-border-2)', paddingLeft: 11 }}>
          <RW value={text} onChange={setText} lines={2} max={200} frame="plain" placeholder="Your note on this, for later" />
        </div>
        <span style={{ display: 'block', marginTop: 9, font: '600 12.5px/1.35 var(--font-sans)', color: 'var(--color-fg-2)' }}>{rTtl(item)}</span>
      </div>
    </div>
  </div>
);

const R5Reveal = ({ item, mine, text }) => (
  <div style={{ width: '100%', textAlign: 'left' }}>
    <div style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--color-border-1)', borderRadius: 'var(--radius-lg)',
      background: 'var(--color-surface)', padding: '14px 15px', boxShadow: 'var(--shadow-raised)' }}>
      {text ? (
        <div style={{ borderLeftWidth: 2, borderLeftStyle: 'solid', borderLeftColor: 'var(--color-accent)', paddingLeft: 12, marginBottom: 11 }}>
          <p style={{ margin: 0, font: '400 15px/1.55 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{text}</p>
          <span style={{ display: 'block', marginTop: 4, font: '600 12.5px/1.3 var(--font-sans)', color: 'var(--color-accent)' }}>You</span>
        </div>
      ) : null}
      <span style={{ display: 'block', font: '600 12.5px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>{item.source || window.d9HostOf(item.url)}</span>
      <span style={{ display: 'block', marginTop: 3, font: '600 15px/1.35 var(--font-sans)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)' }}>{rTtl(item)}</span>
      {item.thought ? (
        <p style={{ margin: '9px 0 0', font: '400 13px/1.55 var(--font-sans)', color: 'var(--color-fg-3)', textWrap: 'pretty' }}>
          {item.thought.by}: {item.thought.text}
        </p>
      ) : null}
      {mine && mine.glyph ? (
        <div style={{ marginTop: 11, display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 15, lineHeight: 1 }}>{mine.glyph}</span>
          {r10Eyebrow('your mark, on the card')}
        </div>
      ) : null}
    </div>
    <p style={{ margin: '14px 0 0', font: '400 13.5px/1.6 var(--font-sans)', color: 'var(--color-fg-2)', textWrap: 'pretty' }}>
      {text
        ? 'That is how the card reads on your shelf from now on. The circle still reads it under ' + (item.thought ? item.thought.by + '\u2019s note' : 'its own title') + ', with your words in the conversation.'
        : 'Nothing to fix to it, so the card reads as it always did.'}
    </p>
  </div>
);

// On the shelf, this state prefers YOUR note at the head of the card, with the
// contributor's demoted beneath it — the completion of the idea, visible without
// opening anything.
const R5Card = ({ item }) => {
  const mine = (item.talk || []).filter(t => t.by === 'You').slice(-1)[0];
  if (!mine) return <window.D9ThoughtMargin item={item} />;
  return (
    <div style={{ margin: '6px 0 0' }}>
      <div style={{ borderLeftWidth: 2, borderLeftStyle: 'solid', borderLeftColor: 'var(--color-accent)', paddingLeft: 12 }}>
        <p style={{ margin: 0, font: '400 14.5px/1.55 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{mine.text}</p>
        <span style={{ display: 'block', marginTop: 4, font: '600 12.5px/1.3 var(--font-sans)', color: 'var(--color-accent)' }}>You</span>
      </div>
      {item.thought ? (
        <p style={{ margin: '8px 0 0', font: '400 13px/1.55 var(--font-sans)', color: 'var(--color-fg-3)', textWrap: 'pretty' }}>
          {item.thought.by}: {item.thought.text}
        </p>
      ) : null}
    </div>
  );
};

// ============================================================================
// R6 · NOTHING
// The null option, built so the others can be judged against it. You leave what
// you leave and the modal closes on a receipt: no disc, no thread, no way in.
// The record only ever lives on the card. This is v8's behaviour, stated as a
// deliberate position rather than an omission.
// ============================================================================
const R6Reveal = ({ item, mine, text }) => (
  <div style={{ width: '100%', textAlign: 'left', padding: '4px 0' }}>
    <p style={{ margin: 0, font: '400 14.5px/1.6 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>
      {mine && mine.glyph ? 'Your reaction is with the circle.' : 'Marked read.'}{text ? ' Your words are on the card.' : ''}
    </p>
    <p style={{ margin: '8px 0 0', font: '400 13px/1.6 var(--font-sans)', color: 'var(--color-fg-3)', textWrap: 'pretty' }}>
      Whatever the circle says next is on the card too, whenever you want it.
    </p>
  </div>
);

// ---- the chapter ----------------------------------------------------------
const D10_REFLECT = [
  {
    id: 'r1', n: 'R1', name: 'Handed to somebody',
    stance: 'A reflection is addressed. The reaction is for the circle; the words are for whoever spoke last, or for whoever handed the card over \u2014 named before you write. The reveal is the delivery, and then it shows the lines nobody has answered, because that is what your being here can change.',
    cost: 'Addressing edges towards a private message inside a communal library, and everyone still sees it \u2014 so the address is a courtesy, not a channel. The unanswered list can read as a chore.',
    patch: { flowSub: 'A reaction for the circle. Words for a person. Both optional.', write: (p) => <R1Write {...p} />, reveal: (p) => <R1Reveal {...p} /> },
  },
  {
    id: 'r2', n: 'R2', name: 'Your words ride your mark',
    stance: 'There is no list at all. What you said is carried by the reaction you gave: the disc IS the record, your line hangs off your own glyph, and reading the circle means touching a face. Words with no mark sit at the rim.',
    cost: 'One voice at a time and nothing can be skimmed \u2014 nine people is nine taps. Long thoughts do not fit a mark, so the field is the tightest of the six.',
    patch: { flowSub: 'A reaction, words, both or neither. Words ride the mark you give.', write: (p) => <R2Write {...p} />, reveal: (p) => <R2Reveal {...p} /> },
  },
  {
    id: 'r3', n: 'R3', name: 'Where you stand',
    stance: 'A reflection is a place in a sequence. The reveal is the order people got here, with what each of them said, and you have just been written into it \u2014 fourth of nine, and the five who follow will answer you.',
    cost: 'Turning reading into an order invites late-to-it feeling, which is the one thing the product is built to avoid. It also implies everyone is expected to arrive.',
    patch: { flowSub: 'A reaction, words, both or neither. You are being written into the order.', write: (p) => <R3Write {...p} />, reveal: (p) => <R3Reveal {...p} /> },
  },
  {
    id: 'r4', n: 'R4', name: 'Weight',
    stance: 'The depth you gave sets the size of your words. The record is a page of voices at their own volume \u2014 no avatars, no rows, no chrome \u2014 and you type at the size you will be read at.',
    cost: 'Intensity becomes typographic authority: the strongest feeling shouts and a measured line whispers. Uses the one Swell value nothing else has ever spent.',
    patch: { flowSub: 'A reaction, words, both or neither. Depth sets how loudly you read.', write: (p) => <R4Write {...p} />, reveal: (p) => <R4Reveal {...p} /> },
  },
  {
    id: 'r5', n: 'R5', name: 'It becomes how you find it again',
    stance: 'A reflection is fixed to the card, at the head, on your shelf: what you said is how you will recognise it in a month. The reveal is the card as it now reads for you, and the contributor\u2019s note keeps its place underneath.',
    cost: 'Two readings of one card in one circle \u2014 yours and everyone else\u2019s. A card you said nothing about looks unmarked next to one you did, which is a quiet nudge to comment.',
    patch: { flowSub: 'A reaction, words, both or neither. Words stay on the card, for you.', write: (p) => <R5Write {...p} />, reveal: (p) => <R5Reveal {...p} />, onCard: (item) => <R5Card item={item} /> },
  },
  {
    id: 'r6', n: 'R6', name: 'Nothing',
    stance: 'The act ends where it ends. A receipt, and the modal closes: no disc, no thread, no way in. Everything the circle says lives on the card, and you go there when you want it \u2014 never because a surface asked you to.',
    cost: 'The calmest and the coldest: you leave words into what feels like a drawer, and nothing tells you the conversation was already happening. This is what v8 did.',
    patch: { flowSub: 'A reaction, words, both or neither. Nothing here is required.', reveal: (p) => <R6Reveal {...p} /> },
  },
];

Object.assign(window, { D10_REFLECT, R1Write, R1Reveal, R2Write, R2Reveal, R3Write, R3Reveal, R4Write, R4Reveal, R5Write, R5Reveal, R5Card, R6Reveal, r10Addressee, r10Unanswered });
