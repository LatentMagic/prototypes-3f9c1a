// ============================================================================
// The text-input font floor — three answers, played side by side.
//
// One question, asked on the two surfaces where raising a field to 16px costs
// something: is the box you type into part of the type scale around it, or its
// own register? Every specimen mounts the shipped CandWrite / CandProse from
// app/talk-parts.jsx; only their size props differ between columns.
//
// The link slot is MIRRORED from app/talk-add.jsx (CandLinkSlot) rather than
// mounted: it is neither exported nor parameterised for size, and app/ is not
// touched to serve a playground. If an option ratifies, that mirror goes away
// with the fix.
// ============================================================================
const PG_KEY = 'pg_font_floor_v1';
const PAPER = window.CAND_PAPER;

// Today's sizes, for the readouts.
const NOW = { url: 14, card: 12.5, turn: 14.5 };

const PG_OPTS = [
  { n: '01', name: 'Match up',
    claim: 'The field and the words beside it move together.',
    cost: 'The thought on a card grows 28%. Density drops on the densest surface in the app.',
    url: 16, card: { write: 16, read: 16, lines: 2 }, turn: { write: 16, read: 16, lines: 1 } },
  { n: '02', name: 'Its own register',
    claim: 'A field is a tool, not the words. Only the field moves.',
    cost: 'Entering an edit jumps a size — the box is bigger than the text it replaced.',
    url: 16, card: { write: 16, read: NOW.card, lines: 2 }, turn: { write: 16, read: NOW.turn, lines: 1 } },
  { n: '03', name: 'Back on the scale',
    claim: 'The field takes 16; the words beside it take the nearest token \u2014 13 and 15.',
    cost: 'Moves read type the floor never asked about, on two surfaces at once.',
    url: 16, card: { write: 16, read: 13, lines: 2 }, turn: { write: 16, read: 15, lines: 1 } },
];

const SEED = {
  card: 'The bit on how a team keeps its own record is what made me send it \u2014 we have argued this three times.',
  turn: 'Agreed on the record part. The staffing numbers underneath it looked thin to me though.',
};

// Mirror of app/talk-add.jsx CandLinkSlot — same geometry, size taken as a prop.
const PgLinkSlot = ({ size }) => {
  const [v, setV] = React.useState('theverge.com/notes/how-teams-keep-records');
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', minHeight: 46,
      background: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
      border: '1px solid ' + (focus ? 'var(--color-accent)' : 'var(--color-border-1)'),
      transition: 'border-color var(--duration-base)' }}>
      <span style={{ color: 'var(--color-fg-3)', display: 'inline-flex', flexShrink: 0 }}><Icon name="link" size={16} /></span>
      <input value={v} onChange={(e) => setV(e.target.value)} type="text" inputMode="url" aria-label="The link"
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder="paste a link"
        style={{ flex: 1, minWidth: 0, border: 0, outline: 'none', background: 'transparent', padding: 0,
          font: '500 ' + size + 'px/1.5 var(--font-mono)', color: 'var(--color-fg-1)' }} />
    </div>
  );
};

const PgHead = ({ children, who, when }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
    <Avatar name={who} size={26} accent={who === 'You'} />
    <span style={{ font: '600 14px/1.25 var(--font-sans)', letterSpacing: '-0.006em', color: 'var(--color-fg-1)' }}>{who}</span>
    <span style={{ font: '400 11.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{when}</span>
    {children}
  </div>
);

const PgLabel = ({ children, from, to }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 7 }}>
    <span style={{ font: '500 11.5px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>{children}</span>
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--color-fg-3)', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>{from} &rarr; {to}</span>
  </div>
);

// The thought on a card — the alt face's warm paper, its name row, its words.
const PgCardSpec = ({ opt, mode, text, draft, setDraft, commit, onMeasure }) => {
  const box = React.useRef(null);
  React.useLayoutEffect(() => {
    const el = box.current; if (!el || !onMeasure) return;
    const set = () => onMeasure(Math.round(el.getBoundingClientRect().height));
    set();
    const ro = new ResizeObserver(set); ro.observe(el);
    return () => ro.disconnect();
  }, [mode, draft, text]);
  return (
    <div style={{ background: PAPER.bg, border: '1px solid ' + PAPER.bd, borderRadius: 'var(--radius-lg)', padding: '14px 16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <PgHead who="You" when="2d" />
        <div ref={box}>
          {mode === 'edit'
            ? <CandWrite value={draft} onChange={setDraft} max={500} minLines={opt.card.lines} size={opt.card.write}
                placeholder="What made you share it?" ariaLabel="Add a thought" onSend={commit} />
            : <CandProse text={text} size={opt.card.read} lh={1.85} color="var(--color-fg-2)" />}
        </div>
      </div>
    </div>
  );
};

// A turn in the conversation — white surface, the turn's own name row.
const PgTurnSpec = ({ opt, mode, text, draft, setDraft, commit }) => (
  <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)', padding: '14px 16px' }}>
    <div style={{ display: 'flex', gap: 10 }}>
      <span aria-hidden="true" style={{ width: 3, height: 22, borderRadius: 2, flexShrink: 0, marginTop: 2, background: 'var(--color-sage)' }} />
      <Avatar name="Mara Ellis" size={26} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, flexWrap: 'wrap' }}>
          <span style={{ font: '600 13.5px/1.3 var(--font-sans)', color: 'var(--color-fg-1)' }}>Mara Ellis</span>
          <span style={{ font: '400 11.5px/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>4h</span>
        </div>
        {mode === 'edit'
          ? <CandWrite value={draft} onChange={setDraft} max={500} minLines={opt.turn.lines} size={opt.turn.write}
              ariaLabel="Edit what you said" onSend={commit} />
          : <CandProse text={text} size={opt.turn.read} lh={1.55} />}
      </div>
    </div>
  </div>
);

const PgColumn = ({ opt, mode }) => {
  const [card, setCard] = React.useState(SEED.card);
  const [turn, setTurn] = React.useState(SEED.turn);
  const [cardDraft, setCardDraft] = React.useState('');
  const [turnDraft, setTurnDraft] = React.useState(SEED.turn);
  const [h, setH] = React.useState(0);
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <header style={{ display: 'flex', flexDirection: 'column', gap: 5, minHeight: 134 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-fg-3)', letterSpacing: '0.04em' }}>{opt.n}</span>
          <h2 style={{ margin: 0, font: '600 17px/1.25 var(--font-sans)', letterSpacing: '-0.01em', color: 'var(--color-fg-1)' }}>{opt.name}</h2>
          <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--color-fg-3)' }} title="Height of the thought block, live">{h}px</span>
        </div>
        <p style={{ margin: 0, font: '400 13px/1.5 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{opt.claim}</p>
        <p style={{ margin: 0, font: '400 12.5px/1.5 var(--font-sans)', color: 'var(--color-fg-3)', textWrap: 'pretty' }}>Cost: {opt.cost}</p>
      </header>
      <div>
        <PgLabel from={NOW.url + ' mono'} to={opt.url + ' mono'}>Add a link · the URL</PgLabel>
        <PgLinkSlot size={opt.url} />
      </div>
      <div>
        <PgLabel from={NOW.card} to={mode === 'edit' ? opt.card.write : opt.card.read}>{mode === 'edit' ? 'Writing a thought on a card' : 'Your thought on a card'}</PgLabel>
        <PgCardSpec opt={opt} mode={mode} text={card} draft={cardDraft} setDraft={setCardDraft} onMeasure={setH}
          commit={() => setCard(cardDraft.trim() || card)} />
      </div>
      <div>
        <PgLabel from={NOW.turn} to={mode === 'edit' ? opt.turn.write : opt.turn.read}>{mode === 'edit' ? 'Editing a turn' : 'A turn in the conversation'}</PgLabel>
        <PgTurnSpec opt={opt} mode={mode} text={turn} draft={turnDraft} setDraft={setTurnDraft}
          commit={() => setTurn(turnDraft.trim() || turn)} />
      </div>
    </section>
  );
};

const PgFontFloor = () => {
  const [mode, setMode] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(PG_KEY) || '{}').mode || 'read'; } catch (e) { return 'read'; }
  });
  React.useEffect(() => { try { localStorage.setItem(PG_KEY, JSON.stringify({ mode })); } catch (e) {} }, [mode]);
  return (
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '28px 24px calc(48px + env(safe-area-inset-bottom, 0px))' }}>
      <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 16, marginBottom: 24 }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1 style={{ margin: '0 0 6px', font: '600 24px/1.2 var(--font-sans)', letterSpacing: '-0.015em' }}>The text-input font floor</h1>
          <p style={{ margin: 0, maxWidth: 620, font: '400 14px/1.55 var(--font-sans)', color: 'var(--color-fg-2)', textWrap: 'pretty' }}>
            Every option puts the field at 16px. What they disagree about is the words beside it.
            Today the card reads at 12.5 and a turn at 14.5 — neither is on the token scale (12, 13, 15, 16).
            Press Writing and watch which column lurches.
          </p>
        </div>
        <div className="pg-seg" role="group" aria-label="Reading or writing">
          <button type="button" aria-pressed={mode === 'read'} onClick={() => setMode('read')}>Reading</button>
          <button type="button" aria-pressed={mode === 'edit'} onClick={() => setMode('edit')}>Writing</button>
        </div>
      </header>
      <div className="pg-cols">
        {PG_OPTS.map(o => <PgColumn key={o.n} opt={o} mode={mode} />)}
      </div>
      <p style={{ margin: '32px 0 0', maxWidth: 720, font: '400 12.5px/1.6 var(--font-sans)', color: 'var(--color-fg-3)', textWrap: 'pretty' }}>
        Not shown, because they cost nothing to decide: the add sheet’s thought box (15.5 &rarr; 16, five pixels taller),
        CandWrite’s default for the conversation composer (15 &rarr; 16), and the states aid’s search field (13.5 &rarr; 16).
        They follow whichever option wins.
      </p>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<PgFontFloor />);
