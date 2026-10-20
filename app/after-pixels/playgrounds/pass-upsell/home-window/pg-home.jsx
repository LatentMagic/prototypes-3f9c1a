// Rig module: PgHome = canon's Home (canon/app/gs-home.jsx, GsHome) with the four things this rig varies pulled out as options:
// hero caption / hero chat, the Pass band (copy and place), the card tag treatment, and the soon row.
// Copied once, renamed, because GsHome's band, card row and chat are inline in one component and GsFeature / GsWhatsNew are
// same-file consts that cannot be swapped from outside (scaffold.md). Everything else is canon's own: DS components, GsCard parts, GsSoonCard.
// The hero, What's new and the footer line follow gs-home.jsx line for line except where a variant says so.
// DS changes FAKED in this module, built from DS tokens, never in canon: corner lock on GameCard (1A), split Tag (1B).
const { GS_GAMES: PG_G, GS_SOON: PG_SOON, GS_HERO_CHAT: PG_HERO_CHAT } = window;

// ---- Staging: Joe's free line (2026-10-14 position), in the rig only. Restored on unmount. ----------------------------------
// Escape is first-edition-only under his line (the prototype has it free in full). Nothing else on Home's row needs changing.
const pgStageEscape = () => pgPatchData(PG_G.escape, { tags: ['FIRST', 'Weekly', '10 min'], free: false, first: true });

// FIXTURES, not canon: canon has no The Drowned Light and no The Lantern Keepers (they are deployed in the monorepo catalogue,
// libs/mcp-games/shared/catalogue/src/lib/games/{drowned-light,lantern-keepers}.ts). Names, blurbs and lengths follow that catalogue.
// Covers are rig-made from cover-palette tokens. Added to canon's data objects while mounted, removed on unmount.
// The row's Pass-only card is The Lantern Keepers: deployed removed 36,000 Summers Ago (absent from the catalogue at monorepo e6ef1300).
const PG_FIX_ART = {
  drowned: { ground: 'indigo', extend: 'bottom', svg: '<svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice"><rect width="160" height="120" fill="#1D1B3A"/><rect x="70" y="30" width="20" height="90" fill="#F2EBE0"/><rect x="66" y="22" width="28" height="12" fill="#E5A63B"/><rect x="0" y="86" width="160" height="34" fill="#328A88"/><circle cx="30" cy="40" r="8" fill="#A390B2"/></svg>' },
  lantern: { ground: 'forest', extend: 'bottom', svg: '<svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice"><rect width="160" height="120" fill="#163328"/><rect x="60" y="48" width="40" height="72" fill="#D66847"/><rect x="68" y="30" width="24" height="22" fill="#E5A63B"/><circle cx="130" cy="28" r="10" fill="#F2EBE0"/><rect x="14" y="96" width="30" height="24" fill="#A390B2"/></svg>' },
};
const PG_FIX_GAMES = {
  drowned: { name: 'The Drowned Light', category: 'ADVENTURE', art: 'drowned', route: 'barrow', ed: ['chapter', 'chapters'], first: true, blurb: 'The light on Gull Rock is dark. Carry it up from the sea.', tags: ['FIRST', 'Several sessions'] },
  lantern: { name: 'The Lantern Keepers', category: 'ADVENTURE', art: 'lantern', route: 'barrow', blurb: 'A storm on Gull Rock, and everyone remembers what you chose.', tags: ['PASS', '20–30 min'] },
};
const pgStage = () => {
  const undoEsc = pgStageEscape();
  Object.assign(window.GS_ART, PG_FIX_ART); Object.assign(PG_G, PG_FIX_GAMES);
  return () => { undoEsc(); Object.keys(PG_FIX_ART).forEach((k) => delete window.GS_ART[k]); Object.keys(PG_FIX_GAMES).forEach((k) => delete PG_G[k]); };
};
// Home's row for this rig: canon's, with the Pass-only card swapped to The Lantern Keepers and The Drowned Light added after Barrow.
const PG_ROW = ['word', 'mystery', 'escape', 'delve', 'barrow', 'drowned', 'lantern'];

// ---- Access, per game on Home's row. open = free to anyone; part = first part free; pass = Pass only. -----------------------
const PG_ACCESS = {
  word: { kind: 'open' }, mystery: { kind: 'open' },
  escape: { kind: 'part', unit: 'Room 1' }, delve: { kind: 'part', unit: 'Scene 1' }, barrow: { kind: 'part', unit: 'Chapter 1' },
  // Drowned Light: chapter 1 free, and no Pass half while no chapter 2 exists (solo: split tag drawn as the open half alone).
  drowned: { kind: 'part', unit: 'Chapter 1', solo: true },
  lantern: { kind: 'pass' },
};
// The tags that are not about access: cadence and length. Daily is dropped where an access tag already says "Every day".
const pgOthers = (id, dropDaily) => PG_G[id].tags.filter((t) => t !== 'FREE' && t !== 'FIRST' && t !== 'PASS' && !(dropDaily && t === 'Daily'));

// FAKE (DS change): a chip in two halves. Left filled = the open part, right outlined = the Pass.
const PgSplitTag = ({ open }) => {
  const gs = useGs();
  return (
    <button type="button" className="gs-tagbtn" aria-label={open + ', then Pass. See the Pass'} onClick={() => gs.go('pass')}>
      <span className="pg-split"><DS.Tag kind="free">{open}</DS.Tag><DS.Tag kind="locked" go={false}>Pass</DS.Tag></span>
    </button>
  );
};

// 1B: a Pass-only card's tag is the same outlined chip as the split tags' Pass half, with no chevron.
const PgPlainPass = () => { const gs = useGs(); return <button type="button" className="gs-tagbtn" aria-label="Pass. See the Pass" onClick={() => gs.go('pass')}><DS.Tag kind="locked" go={false}>Pass</DS.Tag></button>; };

const PgTags = ({ id, mode }) => {
  const a = PG_ACCESS[id], g = PG_G[id];
  if (mode === 'order') return <GsTagList tags={g.tags} ed={g.ed} />;                       // 1C: stock tags, cards untouched
  if (mode === 'lock') return <GsTagList tags={pgOthers(id, false)} />;                      // 1A: access tag leaves the row
  const lengthOnly = mode === 'split' && a.kind === 'part';                                  // 1B: the split tag carries the cadence, so one row
  const others = <GsTagList tags={pgOthers(id, a.kind === 'open').filter((t) => !(lengthOnly && /^(Weekly|Daily)$/.test(t)))} />;                       // 1B, 1D
  if (mode === 'split') {
    return <div className="gs-tags">{a.kind === 'open' ? <DS.Tag kind="free">Every day</DS.Tag> : a.kind === 'part' ? (a.solo ? <DS.Tag kind="free">{a.unit}</DS.Tag> : <PgSplitTag open={a.unit} />) : <PgPlainPass />}{others.props.tags.map((t, i) => <DS.Tag key={i} kind="daily">{t}</DS.Tag>)}</div>;
  }
  return <div className="gs-tags">{a.kind === 'open' ? <DS.Tag kind="free">Every day</DS.Tag> : a.kind === 'part' ? <DS.Tag kind="free">{a.unit}</DS.Tag> : <GsPassTag />}{others.props.tags.map((t, i) => <DS.Tag key={i} kind="daily">{t}</DS.Tag>)}</div>;  // 'visible'
};

// A card: GsCard's own composition (canon/app/gs-parts.jsx GsCard), with the tag slot and a cover-corner slot as props.
const PgCard = ({ id, mode }) => {
  const gs = useGs(); const g = PG_G[id]; const host = useGsArtHost();
  const corner = mode === 'lock' && PG_ACCESS[id].kind === 'pass';
  return (
    <DS.GameCard className="mcp-art-host gs-host"
      art={<div ref={host} style={{ position: 'relative' }}><GsArt art={g.art} shape="wide" />
        {corner && <span className="pg-corner"><DS.Icon name="lock" size={16} /><span className="pg-corner-l">Pass</span></span>}</div>}
      title={<button type="button" className="gs-titlebtn mcp-art-link" onClick={() => gs.go(g.route)}>{g.name}</button>}
      blurb={gsKeepLast(g.blurb)}
      tags={<PgTags id={id} mode={mode} />} />
  );
};

// ---- Band (home-window rows 1.2) ----------------------------------------------------------------------------------------------
const PgBand = ({ kind }) => {
  const gs = useGs();
  const link = <DS.TextLink onClick={() => gs.go('pass')}>Everything else</DS.TextLink>;
  return (
    <section id="gs-how" className="gs-band">
      <div className="gs-stack-sm">
        <h2 className="mcp-t-sec">The Pass</h2>
        {(kind === 'a' || kind === 'b') && <><p>Two daily puzzles and the start of select games come with your account.</p>
          <p className="pg-inline">{link} {kind === 'a' ? 'comes with the Pass.' : 'comes with the Pass, for £30 a year or £3 a month.'}</p></>}
        {kind === 'd' && <p className="pg-inline">Two daily puzzles and the start of select games come with your account. <DS.TextLink onClick={() => gs.go('pass')}>The Pass</DS.TextLink> is the rest, for £30 a year or £3 a month.</p>}
      </div>
    </section>
  );
};

// ---- What's new (copied from gs-home.jsx, where it is a same-file const) ------------------------------------------------------
const PG_WHATSNEW = [
  { v: '1.9', d: '1 October 2026', t: 'Copy any result as text', x: 'You can copy any finished result as text and paste it anywhere. The full record of rolls, guesses and statements stays on its session page.' },
  { v: '1.8', d: '24 September 2026', t: 'Streaks carry across devices', x: 'Your daily streak and record now follow your account, so they stay intact wherever you connect your AI.' },
  { v: '1.7', d: '10 September 2026', t: 'Connect in under two minutes', x: 'A single link now connects Claude, ChatGPT and other MCP assistants. No settings to copy between apps.' },
];
const PgWhatsNew = () => (
  <section className="gs-band" aria-labelledby="gs-wn-h">
    <h2 className="mcp-t-sec" id="gs-wn-h">What’s new</h2>
    <div className="wn-panel"><ul className="wn-list">
      {PG_WHATSNEW.map((e, i) => (
        <li key={e.v} className={'wn-e' + (i === 0 ? ' is-latest' : '')}>
          <div className="wn-body"><h3 className="wn-t">{e.t}</h3><p className="wn-d">{e.x}</p></div>
          <div className="wn-meta"><time>{e.d}</time></div>
        </li>))}
    </ul></div>
  </section>
);

// Hero chat for 1C: the Casebook conversation, ending on the honest refusal (1.1-B).
// Earlier turns trimmed to the last case beat so the closing exchange is in view. [Q-G5]
// Finished: the closing exchange follows the end of case 1, so the last card says the case is solved, not "Turn 5 of 16".
const PG_CASE_DONE = window.GS_CHATS.casebook[2].turns.map((t, i, a) => i === a.length - 1
  ? { ...t, blocks: [{ type: 'list', items: ['Lie exposed: Maeve Doyle', 'Case solved'] }] } : t);
const PG_REFUSAL_CHAT = [...PG_CASE_DONE, { from: 'user', text: 'Is there another case?' }, { from: 'ai', tool: 'casebook', text: 'You’ve finished this one. The other cases are part of the Pass.' }];

// v = { hero: 'caption' | 'chat' | 'stock', band: 'a' | 'b' | 'd' | 'none', cards: 'lock' | 'split' | 'order' | 'visible', rowSub, trust }
const PgHome = ({ v }) => {
  const gs = useGs(); const field = React.useRef(null);
  const restore = React.useRef(null);
  if (!restore.current) restore.current = pgStage();
  React.useEffect(() => () => restore.current && restore.current(), []);
  React.useEffect(() => {   // as gs-home.jsx: the Casebook pose plays while a finger is down
    const f = field.current; if (!f) return undefined;
    const on = (e) => { if (e.pointerType !== 'mouse' && e.target.closest('.gs-hero-name, .gs-hero-shapes4')) f.classList.add('is-on'); };
    const off = () => f.classList.remove('is-on'); const ends = ['pointerup', 'pointercancel', 'pointerleave'];
    f.addEventListener('pointerdown', on); ends.forEach((t) => f.addEventListener(t, off));
    return () => { f.removeEventListener('pointerdown', on); ends.forEach((t) => f.removeEventListener(t, off)); };
  }, []);
  return (
    <main className="gs-wrap gs-main gs-home">
      <section className="gs-hero3">
        <div className="gs-hero-copy">
          <h1 className="gs-h1 gs-h1-home"><span>Your AI does the talking.</span> <span>The game keeps the score.</span></h1>
          <p className="gs-hero-sub">Play small games by talking to Claude or ChatGPT. The game holds the rules, the dice and your record.</p>
          <div className="gs-hero-act">
            <DS.Button onClick={gs.startFree}>Start free</DS.Button>
            <DS.Button variant="secondary" onClick={gs.goHow}>See how it works</DS.Button>
          </div>
          <div className="gs-works"><span className="gs-label">WORKS WITH</span><p className="gs-muted">{GS.works}</p></div>
        </div>
        <div className="gs-hero-field" ref={field}>
          <div className="gs-hero-shapes4" aria-hidden="true" onClick={() => gs.go(GS_GAMES.casebook.route)}>
            <i style={{ background: '#D66847', '--h': '62%', '--rise': '12px' }}></i>
            <i style={{ background: '#A390B2', '--h': '86%', '--rise': '6px' }}></i>
            <i style={{ background: '#F2EBE0', '--h': '66%', '--rise': '18px' }}></i>
            <b></b>
          </div>
          <button type="button" className={'gs-hero-name' + (v.hero === 'caption' ? ' pg-cap-wrap' : '')} onClick={() => gs.go(GS_GAMES.casebook.route)}>
            <span className="gs-label">{v.hero === 'caption' ? 'YOUR AI NEVER ASKS YOU TO PAY' : 'A NEW CASE EVERY WEEK'}</span>
            <span className="gs-hero-name-t">{GS_NAME.casebook} <DS.Icon name="down" size={20} style={{ transform: 'rotate(-90deg)' }} /></span>
          </button>
          <GsChatPic turns={v.hero === 'chat' ? PG_REFUSAL_CHAT : GS_HERO_CHAT} height={340} width={480} label="A Casebook case being played in a chat" />
        </div>
      </section>

      {v.band === 'd' && <PgBand kind="d" />}

      <section className="gs-band">
        <DS.CardRow title="Available games" sub={v.rowSub} className="gs-row4">
          {PG_ROW.map((k) => <PgCard key={k} id={k} mode={v.cards} />)}
        </DS.CardRow>
        <div className="gs-grid2">{PG_SOON.filter((g) => !g.label).map((g) => <GsSoonCard key={g.name} g={g} />)}</div>
        <div><DS.TextLink onClick={() => gs.go('games')}>All games</DS.TextLink></div>
      </section>

      {(v.band === 'a' || v.band === 'b') && <PgBand kind={v.band} />}

      <PgWhatsNew />

      {!v.trust && <p className="gs-small gs-foot">{GS.purchase}</p>}
    </main>
  );
};

const pgHomeStyle = document.createElement('style');
pgHomeStyle.textContent = `
  .pg-corner { position: absolute; top: 0; right: 0; height: 32px; padding: 0 8px; display: inline-flex; align-items: center; gap: 4px;
    background: var(--page); color: var(--text); border-left: 1.5px solid var(--control-edge); border-bottom: 1.5px solid var(--control-edge); }
  .pg-corner-l { font: 600 12px/16px var(--font-sans, inherit); }
  .pg-cap-wrap { max-width: calc(54% - 32px); }
  .pg-inline .mcp-lnk { display: inline-block; min-height: 48px; box-sizing: border-box; padding: 12px 0; margin: -12px 0; vertical-align: baseline; line-height: 24px; font: inherit; font-weight: 600; }
  .pg-split { display: inline-flex; align-items: center; }
  .pg-split > .mcp-tag-locked { border-left-width: 0; padding-left: 8px; }`;
document.head.appendChild(pgHomeStyle);

Object.assign(window, { PgHome });
