// ============================================================================
// After Pixels — Session page (screen 7) with its share pop-up. History (screen 8) is in gs-history.jsx.
// A session in progress (s.live) has no Share: one button carries it on in your AI.
// A finished daily, weekly or fixed-answer play shows nothing that starts it; a finished chapter has Play again (gsStartsOver).
// One shared head (GsSessHead) serves every game: cover, then label (game · day played), edition title, actions. A game supplies data, never a head.
// A session page is one play: it lists no other plays.
// A 36,000 Summers Ago day has no result to share: Share carries the product page link only.
// gsShareText is the one share text for a result, wherever Share is offered (the session page and the game pages).
// ============================================================================
// The line and button a player without the Pass sees on an edition that needs it. Written for that edition, never for the free first one (which never reaches here).
// text: the line where it isn't the edition's own (a kept session).
import React from 'react';
import { useGs, GS_GAMES, DS, gsLink, GS_SESSIONS, GS_ED_SIDS, gsStartsOver, gsSessDate, gsRhythm, GS_BARROW_CREDIT } from './gs-data.jsx';
import { GsNotFound } from './gs-site.jsx';
import { GsCover } from './gs-parts.jsx';
import { GsGap, gsOr } from './gs-game.jsx';
import { lbCopy, LbBackTo } from './gs-library.jsx';
import { DP_PZ } from './gs-where-chain-salvage.jsx';
import { PZ } from './gs-puzzles-library.jsx';
import { gsSessEd } from './gs-connect.jsx';
import { PH_FIRST, PH_UNF } from './gs-history.jsx';
import { ES_SIDS } from './gs-escape.jsx';
import { GS_SESSION_BODY } from './registry.js';

export const GsNeedsPass = ({ gid, text }) => {
  const gs = useGs();
  return (
    <div className="gs-stack-sm" style={{ justifyItems: 'start' }}>
      <span className="gs-muted">{text || 'This ' + GS_GAMES[gid].ed[0] + ' comes with the Pass.'}</span>
      <DS.Button variant="secondary" onClick={() => gs.go('pass')}>Get the Pass</DS.Button>
    </div>
  );
};
// Share text, as it will be pasted: emoji, no letters, nothing of the scene,
// ending with the game's product page. Null where nothing is decided.
const gsWordRow = (guess, answer) => {
  const g = guess.split(''); const res = g.map(() => '⬛'); const left = {};
  answer.split('').forEach((ch, i) => { if (g[i] === ch) res[i] = '🟩'; else left[ch] = (left[ch] || 0) + 1; });
  g.forEach((ch, i) => { if (res[i] !== '🟩' && left[ch]) { res[i] = '🟨'; left[ch] -= 1; } });
  return res.join('');
};
// The session's date box is one button wide, so its weekday is shortened: Tuesday → Tue.
const gsShortDay = (d) => (typeof d === 'string' ? d.replace(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)[a-z]*day\b/, '$1') : d);
export const gsShareText = (s) => {
  if (s.share == null) return null;
  const link = gsLink(s.gid);
  // A result whose card is written out in full (Casebook, Escape, Delve, the Barrow), with the product link last.
  if (s.shareLines) return [...s.shareLines, link];
  if (s.gid === 'word' && s.number) {
    // A Hint line is not a guess: the tile rows and the count skip it.
    const guesses = s.lines.filter((l) => /^Guess/.test(l[0])).map((l) => l[1]); const answer = s.answer || guesses[guesses.length - 1];
    const h = s.hints || 0;
    const head = 'Daily Word No. ' + s.number + ' · ' + (s.loss ? 'X' : guesses.length) + '/6' + (h ? ' · ' + h + (h === 1 ? ' hint ' : ' hints ') + '💡'.repeat(h) : '');
    return [head, '', ...guesses.map((g) => gsWordRow(g, answer)), link];
  }
  if (s.gid === 'mystery' && s.number) {
    const q = s.q != null ? s.q : s.lines.filter((l) => /^Question/.test(l[0])).length;
    const qn = q === 0 ? 'no questions' : q === 1 ? '1 question' : q + ' questions';
    return ['Daily Mystery No. ' + s.number + ' · ' + (s.loss ? 'wrong accusation' : 'solved') + ' · ' + qn + (q ? ' ' + '🔎'.repeat(q) : ''), s.loss ? '❌' : '✅', link];
  }
  if (s.shareHead) return [s.shareHead, ...(s.rows || []), link];
  if (s.kind === 'delve') return ['Delve 🎲 ' + s.result + ', ' + s.reached.toLowerCase(), '🎲 ' + s.lines.length + ' rolls  ⏳ threat ' + s.tracks.threat + '/6', link];
  if (s.kind === 'case') return [s.game + ' 🔎 ' + s.result, s.figures.join(' · '), link];
  return [s.game + ' · ' + s.share, link];
};
// KEEP: a blank share line (Daily Word's, after its head) shows as a blank line while the card's gaps stay one 4px token, and Copy
// still carries it, so what's pasted matches what's shown.
const GsShareText = ({ lines }) => {
  const shown = []; (lines || []).forEach((l) => { if (l === '' && shown.length) shown[shown.length - 1] += '\n'; else shown.push(l); });
  return (
    <DS.Card style={{ gap: 4, justifyItems: 'start' }}>
      {lines ? shown.map((l, i) => <span key={i} className="gs-num-text" style={{ overflowWrap: 'anywhere', whiteSpace: 'pre-line' }}>{/\n$/.test(l) ? l + '\u200b' : l}</span>) : <GsGap />}
    </DS.Card>
  );
};

// The one Share pop-up, opened from the session page and every library game page.
// A panel by ui-design.md: it is neither one question nor a short list of commands, so it is a bottom sheet on a phone.
export const GsSharePopup = ({ open, onClose, lines, linkOnly }) => {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => { if (!open) setCopied(false); }, [open]);
  const copy = () => {
    if (lbCopy) lbCopy(lines);
    else { try { navigator.clipboard && navigator.clipboard.writeText(lines.join('\n')); } catch (e) {} }
    setCopied(true);
  };
  return (
    <DS.Popup open={open} onClose={onClose} kind="panel" title={linkOnly ? 'Share this game' : 'Share this result'}
      actions={lines && <DS.Button done={copied} doneLabel="Copied" onClick={copy}>Copy</DS.Button>}>
      <GsShareText lines={lines} />
    </DS.Popup>
  );
};

// The session card a daily puzzle's body is built on (Daily Word's, Where's, Chain's): the result statement top left; below it the game's
// board, and beside it a panel ruled off at its left, a captioned figure per row (Guesses, Hint) and an optional last row (the
// answer on a loss). Phone: the result, the board, then the figures side by side under a rule. Styles: app/gs-sess-card.css.
export const GsSessCard = ({ r, board, rows, last, className = '', style }) => (
  <section className={'dv2 gs-sc ' + className} style={style} aria-label="How it went">
    <div className="dv7r-band"><h2 className={'dv7r-word is-' + r.tone}>{r.word}</h2></div>
    <div className="gs-sc-duo">
      <div className="gs-sc-board">{board}</div>
      <div className="gs-sc-panel">
        {rows.map(([cap, fig]) => <div key={cap} className="gs-sc-row"><span className="gs-sc-cap">{cap}</span>{fig}</div>)}
        {last}
      </div>
    </div>
  </section>);

// Every move: the game's list as the design system's MoveList, closed, below the game's own section; the same for every game.
export const GsMoves = ({ s }) => (
  <section className="gs-moves">
    <DS.Disclosure title={gsOr(s.listTitle) + ' (' + s.lines.length + ')'}>
      <DS.MoveList label={gsOr(s.listTitle)}>
        {s.lines.map((l, i) => <DS.MoveRow key={i} label={l[0]} parts={l.slice(1)} />)}
      </DS.MoveList>
    </DS.Disclosure>
  </section>
);

// ---- The one session head. A game supplies data only: its name, its edition's name or number, the day played, its art, which actions apply. ----
// The label's game name: Daily Word is called Guess on this page.
const gsHeadGame = (s) => (s.gid === 'word' ? 'Guess' : s.gid && GS_GAMES[s.gid] ? GS_GAMES[s.gid].name : s.game);
// The day played, short: "Tuesday 6 October, 21:40" → "Tue 6 Oct".
const gsHeadDay = (d) => (typeof d === 'string' ? gsShortDay(d.split(',')[0]).replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*/, '$1') : d);
// The edition as its game names it: a room's name, or a number ("No. 212"). Falls back to the session's own title (a 36,000 Summers Ago day), then its number.
const gsHeadTitle = (s, ed) => (ed ? (ed.title || 'No. ' + ed.n) : s.title || (s.number != null ? 'No. ' + s.number : null));
const GsSessHead = ({ art, label, title, actions }) => (
  <section className="gs-sess-head">
    <GsCover art={art} fill />
    <div className="gs-sess-text">
      <span className="gs-sess-label">{label}</span>
      <h1 className="gs-h1 gs-sess-title">{title}</h1>
      {actions && <div className="gs-sess-acts">{actions}</div>}
    </div>
  </section>
);
// The result and figures a head does not carry: a game with no body of its own tells them here, under the head.
const GsSessResult = ({ s, title }) => (
  <section className="gs-stack-md" style={{ justifyItems: 'start' }}>
    <h2 className="mcp-t-sec">{gsOr(s.result)}</h2>
    {(s.figures || []).filter((f) => f !== title).length > 0 && <div className="gs-figs">{s.figures.filter((f) => f !== title).map((f, i) => <span key={i} className="gs-fig">{gsOr(f)}</span>)}</div>}
  </section>
);

// KEEP: a session page open on this edition's play follows Config → This edition and the demo bar while it is open: in progress
// shows the play so far, finished shows the play Config picks. An earlier edition's page is left alone.
const gsThisEdSid = (gs, sid) => {
  const s = GS_SESSIONS[sid]; const gid = s && s.gid; const live = gs.review && gs.review.week === 'live';
  if (gid === 'delve') return sid === 'delve' || sid === 'delve-live' ? (live ? 'delve-live' : 'delve') : sid;
  const c = gid && ((typeof PZ !== 'undefined' && PZ[gid]) || (typeof DP_PZ !== 'undefined' && DP_PZ[gid])); if (!c) return sid;
  const mine = [c.todayBase || c.today, c.liveSid, ...Object.values((GS_ED_SIDS || {})[gid] || {}), ...(gid === 'escape' && typeof ES_SIDS !== 'undefined' ? Object.values(ES_SIDS) : [])];
  if (!mine.includes(sid)) return sid;
  const to = live ? c.liveSid : c.today;
  return GS_SESSIONS[to] ? to : sid;
};
const GsSessionRecord = () => {
  const gs = useGs();
  const sid = gsThisEdSid(gs, gs.route.id);
  const s = GS_SESSIONS[sid];
  const [share, setShare] = React.useState(false);
  // A game with no result block (36,000 Summers Ago) shares its product page link only (MCPG-030 AF-04).
  const linkOnly = s.share == null && s.kind === 'day' && !s.live;
  const text = linkOnly ? ['https://afterpixels.com/' + GS_GAMES[s.gid].route] : gsShareText(s);
  const closeShare = () => setShare(false);
  // A finished chapter can be started over: a new session, no Pass tag or line. Anything else finished is played once.
  const ed = gsSessEd ? gsSessEd(gs, sid) : null;
  const over = !!s.gid && gsStartsOver(s.gid);
  // Controls only where they work: a player without the Pass can carry on or start over only a free game or its free first edition.
  // A Pass-ended player's unfinished Pass-only session is kept: it says so, with the Pass page, and no Play.
  const canPlay = !s.gid || gs.view === 'pass' || GS_GAMES[s.gid].free || (!!PH_FIRST && PH_FIRST[s.gid] === (s.phEd || s.edKey));
  const kept = !canPlay && (s.live || (over && s.result === PH_UNF.label));
  const again = over && canPlay ? <DS.Button variant="secondary" onClick={() => gs.play(s.game, sid)}>Play again</DS.Button> : null;
  const back = s.gid && <div className="gs-wrap gs-backbar" style={{ paddingTop: 24 }}><LbBackTo gid={s.gid} /></div>;
  // A game's own session body: GS_SESSION_BODY[gid] draws its part under the shared head (Escape's: app/gs-escape.jsx), result included.
  // A game without one shows the result and the closed list.
  const list = s.lines.length > 0 ? <GsMoves s={s} /> : null;
  const Body = GS_SESSION_BODY && GS_SESSION_BODY[s.gid];
  const body = Body ? <Body s={s} sid={sid} /> : list;
  const title = gsHeadTitle(s, ed);
  const label = gsHeadGame(s) + ' · ' + gsHeadDay(gsSessDate(s, gs));
  const art = s.art;
  // A day or week that ended before the player finished: no result, no score line, no play control. What was played stays.
  if (s.unfinished) return (<>
    {back}
    <main className="gs-wrap gs-main">
      <GsSessHead art={art} label={label} title={title} />
      <p>{(gsRhythm(s.gid) === 'daily' ? 'The day' : 'The week') + ' ended before you finished. What you played stays in your history.'}</p>
      {body}
    </main>
  </>);
  return (<>
    {back}
    <main className="gs-wrap gs-main">
      <GsSessHead art={art} label={label} title={title} actions={
        kept ? <GsNeedsPass gid={s.gid} text="This session is kept. Carrying it on comes with the Pass." />
          : s.live ? <DS.Button onClick={() => gs.play(s.game, sid)}>Play</DS.Button>
          : <>{again}{text && <DS.Button onClick={() => setShare(true)}>Share</DS.Button>}</>
      } />
      {!Body && <GsSessResult s={s} title={title} />}

      {body}

      {s.credit && <p className="gs-small gs-muted" style={{ overflowWrap: 'anywhere', maxWidth: '72ch' }}>{GS_BARROW_CREDIT}</p>}

      <GsSharePopup open={share} onClose={closeShare} lines={text} linkOnly={linkOnly} />
    </main>
  </>);
};

export const GsSession = () => { const r = useGs().route; return GS_SESSIONS[r.id] ? <GsSessionRecord /> : <GsNotFound />; };

