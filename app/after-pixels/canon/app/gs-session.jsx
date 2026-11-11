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
import { useGs, GS_GAMES, DS, gsLink, GS_SESSIONS, GS_ED_SIDS, gsEdPick, gsStartsOver, gsSessDate, gsFresh, GS_BARROW_CREDIT, gsLiveSid, gsBegunId } from './gs-data.jsx';
import { GsNotFound } from './gs-site.jsx';
import { GsCover } from './gs-parts.jsx';
import { GsGap, gsOr } from './gs-game.jsx';
import { lbCopy, LbBackTo } from './gs-library.jsx';
import { PZ } from './gs-puzzles-library.jsx';
import { gsSessEd } from './gs-connect.jsx';
import { PH_FIRST, phThis } from './gs-history.jsx';
import { cprFirstState } from './gs-pass-store.jsx';
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
    const head = 'Guess No. ' + s.number + ' · ' + (s.loss ? 'X' : guesses.length) + '/6' + (h ? ' · ' + h + (h === 1 ? ' hint ' : ' hints ') + '💡'.repeat(h) : '');
    return [head, '', ...guesses.map((g) => gsWordRow(g, answer)), link];
  }
  if (s.shareHead) return [s.shareHead, ...(s.rows || []), link];
  if (s.kind === 'delve') return ['Delve 🎲 ' + s.result + ', ' + s.reached.toLowerCase(), '🎲 ' + s.lines.length + ' rolls  ⏳ threat ' + s.tracks.threat + '/6', link];
  if (s.kind === 'case') return [s.game + ' 🔎 ' + s.result, s.figures.join(' · '), link];
  return [s.game + ' · ' + s.share, link];
};
// KEEP: a blank share line (Guess's, after its head) shows as a blank line while the card's gaps stay one 4px token, and Copy
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

// The session card a daily puzzle's body is built on (Guess's, Where's, Chain's): the result statement top left; below it the game's
// board, and beside it a panel ruled off at its left, a captioned figure per row (Guesses, Hint) and an optional last row (the
// answer on a loss). Phone: the result, the board, then the figures side by side under a rule. Styles: app/gs-sess-card.css.
export const GsSessCard = ({ r, board, rows, last, className = '', style }) => (
  <section className={'dv2 gs-sc ' + className} style={style} aria-label="How it went">
    {r && <div className="dv7r-band"><h2 className={'dv7r-word is-' + r.tone}>{r.word}</h2></div>}
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
    <DS.Disclosure title={'Every move (' + s.lines.length + ')'}>
      <DS.MoveList label="Every move">
        {s.lines.map((l, i) => <DS.MoveRow key={i} label={l[0]} parts={l.slice(1)} />)}
      </DS.MoveList>
    </DS.Disclosure>
  </section>
);

// ---- The one session head. A game supplies data only: its name, its edition's name or number, the day played, its art, which actions apply. ----
// The label's game name.
const gsHeadGame = (s) => (s.gid && GS_GAMES[s.gid] ? GS_GAMES[s.gid].name : s.game);
// The day played, short: "Tuesday 6 October, 21:40" → "Tue 6 Oct".
const gsHeadDay = (d) => (typeof d === 'string' ? gsShortDay(d.split(',')[0]).replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*/, '$1') : d);
// The edition as its game names it: a room's name, or a number ("No. 34"). Falls back to the session's own title (a 36,000 Summers Ago day), then its number.
const gsHeadTitle = (s, ed) => (ed ? (ed.title || 'No. ' + ed.n) : s.title || (s.number != null ? 'No. ' + s.number : null));
// A replay (s.replay) carries the design system's Tag (the dark chip), "Replay", on the label line; the head is the same for every game, so any game's replay gets it.
const GsSessHead = ({ art, label, title, actions, replay }) => (
  <section className="gs-sess-head">
    <GsCover art={art} fill />
    <div className="gs-sess-text">
      {replay
        ? <div className="gs-sess-labelrow"><span className="gs-sess-label">{label}</span><DS.Tag kind="daily">Replay</DS.Tag></div>
        : <span className="gs-sess-label">{label}</span>}
      <h1 className="gs-h1 gs-sess-title">{title}</h1>
      {actions && <div className="gs-sess-acts">{actions}</div>}
    </div>
  </section>
);
// The result and figures a head does not carry: a game with no body of its own tells them here, under the head.
export const GsSessResult = ({ s, title }) => (
  <section className="gs-stack-md" style={{ justifyItems: 'start' }}>
    <h2 className="mcp-t-sec">{gsOr(s.result)}</h2>
    {(s.figures || []).filter((f) => f !== title).length > 0 && <div className="gs-figs">{s.figures.filter((f) => f !== title).map((f, i) => <span key={i} className="gs-fig">{gsOr(f)}</span>)}</div>}
  </section>
);

// This edition's session ids for a game: the seeded finished play, the ones Config → This edition picks (GS_ED_SIDS), Escape's own finished plays, and the in-progress one.
const gsEdMine = (gid) => {
  const c = PZ[gid]; const ids = (GS_ED_SIDS || {})[gid] || {};
  // c.liveSid reads the begun id while Config has it set, so the live id is taken back from it.
  const live = c ? c.liveSid.replace(/-begun$/, '-live') : ids.live;
  return [c && (c.todayBase || c.today), live, live && gsBegunId(live), ...Object.values(ids), ...(gid === 'escape' && typeof ES_SIDS !== 'undefined' ? Object.values(ES_SIDS) : [])].filter(Boolean);
};
// This account has no play of this edition, by the library page's own tests (the record's play of it, cprFirstState, review.never, gsFresh): a new account,
// a game marked never played, a free player's unplayed first Escape room or Delve run, or a game whose play of this edition the record does not hold.
const gsNoPlay = (gs, gid) => {
  if (gsFresh(gs) || (gs.review && gs.review.never === gid)) return true;
  if (gs.view === 'free' && (gid === 'escape' || gid === 'delve')) return cprFirstState(gs, gid) === 'none';
  // A Pass holder's games with an edition play, and a free player's dailies, as lbNow reads them: a play of this edition exists only for a game the account can play.
  if (gs.view === 'pass') return !!(PZ[gid] || GS_ED_SIDS[gid]) && !phThis(gs, gid);
  return !!PZ[gid] && gs.view !== 'out' && GS_GAMES[gid].free && !phThis(gs, gid);
};
// KEEP: This edition's session as Config → This edition and the demo bar leave it: in progress shows the play so far, finished shows the play Config
// picks, and null means this edition has no play (Not played). Every surface that opens this edition's play reads it from here.
export const gsThisEdOf = (gs, gid) => {
  const c = PZ[gid]; const ids = (GS_ED_SIDS || {})[gid] || {}; const live = gs.review && gs.review.week === 'live';
  if (gsNoPlay(gs, gid)) return null;
  if (live) return c ? c.liveSid : ids.live ? gsLiveSid(ids.live, gs) : null;
  return c ? c.today : gsEdPick(gid, gs) || ids.average;
};
// KEEP: a session page open on this edition's play follows Config → This edition and the demo bar while it is open: in progress
// shows the play so far, finished shows the play Config picks, Not played has no page. An earlier edition's page is left alone.
export const gsThisEdSid = (gs, sid) => {
  const s = GS_SESSIONS[sid]; const gid = s && s.gid; if (!gid) return sid;
  if (!gsEdMine(gid).some((m) => GS_SESSIONS[m] === s)) return sid;
  const to = gsThisEdOf(gs, gid);
  return to === null ? null : GS_SESSIONS[to] ? to : sid;
};
// Config → This edition changed while a session page of an earlier edition is open: that page no longer is the edition Config describes, so the player
// goes to this edition's play, or to the game's library page when this edition has no play. Off a game, or on a page that updates in place, nothing moves.
export const gsEdFollow = (gs) => {
  const r = gs.route; const s = r.name === 'session' && GS_SESSIONS[r.id]; const gid = s && s.gid;
  if (!gid || !gsEdMine(gid).length || gsEdMine(gid).some((m) => GS_SESSIONS[m] === s)) return;
  const to = gsThisEdOf(gs, gid);
  if (to) gs.go('session', { id: to }); else gs.go(GS_GAMES[gid].route, { page: 'record' });
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
  // A Pass-ended player's Pass-only session in progress is kept: it says so, with the Pass page, and no Play. A restarted 36,000 Summers Ago day is kept the same way.
  const canPlay = !s.gid || gs.view === 'pass' || GS_GAMES[s.gid].free || (!!PH_FIRST && PH_FIRST[s.gid] === (s.phEd || s.edKey));
  const kept = !canPlay && (s.live || (over && s.restarted));
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
  return (<>
    {back}
    <main className="gs-wrap gs-main">
      <GsSessHead art={art} label={label} title={title} replay={!!s.replay} actions={
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

// This edition has no play to show (Not played): the game's library page takes the place of this one.
const GsSessionGone = ({ gid }) => { const gs = useGs(); React.useEffect(() => { gs.go(GS_GAMES[gid].route, { page: 'record', replace: true }); }, []); return null; };
export const GsSession = () => {
  const gs = useGs(); const r = gs.route;
  if (!GS_SESSIONS[r.id]) return <GsNotFound />;
  return gsThisEdSid(gs, r.id) === null ? <GsSessionGone gid={GS_SESSIONS[r.id].gid} /> : <GsSessionRecord />;
};

