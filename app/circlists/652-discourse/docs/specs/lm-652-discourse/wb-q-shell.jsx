// ============================================================================
// Four whiteboards (LM-652 open questions) — shared shell: the page chrome, the
// section strips, the frames, the seed, and the thread furniture the boards mount.
// Whiteboard, bare: no app shell, no rail, no config panel. Everything visible
// by scrolling. Nothing here is product code and nothing carries between boards.
// Loads after app/* and cand-lm652-parts.jsx.
// ============================================================================
const { Icon, Button, Avatar, CandEyebrow, CandFoldGlyph } = window;
const WB_PAPER = window.CAND_PAPER || { bg: '#F2F1EB', bd: '#DEDCD3', bdHover: '#CFCDC2' };

// ---- housekeeping: the drivers keep their place across reloads --------------
const WB_KEY = 'pg_wb_open_questions_v1';
const wbLoad = () => { try { return JSON.parse(localStorage.getItem(WB_KEY)) || {}; } catch (e) { return {}; } };
const wbSave = (o) => { try { localStorage.setItem(WB_KEY, JSON.stringify(o)); } catch (e) {} };
const useWbState = (key, init) => {
  const [v, setV] = React.useState(() => { const s = wbLoad(); return (key in s) ? s[key] : init; });
  React.useEffect(() => { const s = wbLoad(); s[key] = v; wbSave(s); }, [key, v]);
  return [v, setV];
};

// ---- seed ------------------------------------------------------------------
const DAY = 86400000;
const WB_USER = { name: 'You', realName: 'Sam R.' };
const WB_ITEM = {
  id: 'moby', url: 'https://www.gutenberg.org/ebooks/2701', title: 'Moby-Dick; or, The Whale',
  source: 'Project Gutenberg', attribution: 'Added by Joe M.', at: Date.now() - 7 * DAY,
  read: true, watching: true, reactions: [], hasImage: true,
};
const WB_THOUGHT = {
  by: 'Joe M.', at: Date.now() - 7 * DAY,
  text: 'I started this expecting a novel and got a manual for looking at things closely. The chapters that stop the plot dead to explain rope, or oil, or the anatomy of a jaw are the best of it. Read it slowly — a chapter at a time is plenty.',
};
const WB_TURNS = [
  { id: 't1', by: 'Priya N.', at: Date.now() - 3 * DAY, text: 'The chapter on the rope is the one I keep going back to. Nothing else I have read makes the case that well for the danger being in the ordinary equipment.' },
  { id: 't2', by: 'Ada L.', at: Date.now() - 2 * DAY, text: 'Took me three attempts over about ten years. The fourth stuck, and the difference was reading it out loud.' },
  { id: 't3', by: 'Marcus T.', at: Date.now() - 30 * 60e3, replyTo: 't1', text: 'Same. I sent that chapter to my team and nobody replied, which I have decided to read as awe.' },
];
const WB_TYPED = 'Made me rethink how we do handovers — the middle section especially.';
const WB_TYPED_PART = 'Made me rethink how we';
const WB_DOMAIN = 'gutenberg.org';

const wbWhen = (at) => (window.circWhen ? window.circWhen(at) : '');

// ---- page chrome -----------------------------------------------------------
const WbHead = () => (
  <header className="wb-top">
    <div className="wb-wrap">
      <div className="wb-eyebrow">whiteboards · lm-652 · open questions</div>
      <h1 className="wb-h1">Four questions, on one page</h1>
      <p className="wb-lede">Each board answers one open question with options that differ on structure and behaviour, never on palette or type. Nothing here is a finished design, and nothing carries from one board to another.</p>
    </div>
  </header>
);

// The strip: the question in a sentence, then every option's note. Notes live
// here and never inside an option, so the options themselves stay comparable.
const WbStrip = ({ n, title, question, notes, driver, hint }) => (
  <div className="wb-strip">
    <div className="wb-wrap">
      <div className="wb-strip-top">
        <div className="wb-strip-no">{String(n).padStart(2, '0')}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 className="wb-h2">{title}</h2>
          <p className="wb-q">{question}</p>
        </div>
      </div>
      {driver}
      <div className="wb-notes">
        {notes.map((o) => (
          <p key={o.n} className="wb-note"><span className="wb-note-n">{o.n}</span><span><b>{o.name}</b> — {o.stance} <span className="wb-cost">Cost: {o.cost}</span></span></p>
        ))}
      </div>
      {hint && <p className="wb-hint">{hint}</p>}
    </div>
  </div>
);

const WbSection = ({ children }) => <section className="wb-section"><div className="wb-wrap">{children}</div></section>;

const WbOption = ({ n, name, aside, children, cols }) => (
  <div className="wb-opt">
    <div className="wb-opt-head">
      <span className="wb-opt-n">{n}</span>
      <span className="wb-opt-name">{name}</span>
      <span className="wb-opt-rule" />
      {aside}
    </div>
    <div className={cols ? 'wb-opt-body wb-cols' : 'wb-opt-body'}>{children}</div>
  </div>
);

// A frame is a slice of the real surface at a stated width. The caption is the
// width, never a description — descriptions are in the strip.
const WbFrame = ({ w, label, children, pad = true, sheet }) => (
  <div className="wb-frame" style={w ? { width: w, flexShrink: 0 } : { flex: 1, minWidth: 300 }}>
    <div className="wb-frame-cap">{label}</div>
    <div className={sheet ? 'wb-sheet' : (pad ? 'wb-surface' : '')}>{children}</div>
  </div>
);

const WbSeg = ({ value, onChange, options, label }) => (
  <div className="wb-driver">
    <span className="wb-driver-label">{label}</span>
    <div className="wb-seg">
      {options.map((o) => (
        <button key={o.v} type="button" className="wb-seg-btn" data-active={value === o.v ? '' : undefined} onClick={() => onChange(o.v)}>{o.t}</button>
      ))}
    </div>
  </div>
);

// ---- thread furniture (the surface's own anatomy, item 6) ------------------
const WbTurn = ({ t, reply, children }) => (
  <div style={{ display: 'flex', gap: reply ? 9 : 10, padding: reply ? '8px 0' : '10px 0' }}>
    <Avatar name={t.by} size={reply ? 22 : 26} accent={t.by === 'You'} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginBottom: 3 }}>
        <span style={{ font: (reply ? '600 12.5px' : '600 13.5px') + '/1.3 var(--font-sans)', color: reply ? 'var(--color-fg-2)' : 'var(--color-fg-1)' }}>{t.by}</span>
        <span style={{ font: (reply ? '500 11px' : '500 11.5px') + '/1.3 var(--font-sans)', color: 'var(--color-fg-3)' }}>{wbWhen(t.at)}</span>
      </div>
      <p style={{ margin: 0, font: '400 14.5px/1.6 var(--font-sans)', color: 'var(--color-fg-1)', textWrap: 'pretty' }}>{t.text}</p>
      {children}
    </div>
  </div>
);

// The thread head: eyebrow + hairline + the watching control at the row's end.
const WbThreadHead = ({ name, on = true }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 20 }}>
    <CandEyebrow style={{ flexShrink: 0 }}>{name}</CandEyebrow>
    <span aria-hidden="true" style={{ flex: 1, height: 1, background: 'var(--color-border-2)' }} />
    <span className="cand-watchglyph" style={{ color: on ? 'var(--color-accent)' : 'var(--color-fg-3)', display: 'inline-flex', flexShrink: 0 }}>
      <CandFoldGlyph size={15} filled={on} />
    </span>
  </div>
);

// The reply group's rail (one per group, furniture recedes with depth).
const WbGroup = ({ children }) => (
  <div style={{ marginLeft: 12, paddingLeft: 14, borderLeft: '1px solid var(--color-border-2)' }}>{children}</div>
);

Object.assign(window, {
  WB_PAPER, WB_KEY, useWbState, WB_USER, WB_ITEM, WB_THOUGHT, WB_TURNS, WB_TYPED, WB_TYPED_PART, WB_DOMAIN,
  wbWhen, WbHead, WbStrip, WbSection, WbOption, WbFrame, WbSeg, WbTurn, WbThreadHead, WbGroup,
});
