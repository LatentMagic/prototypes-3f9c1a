// ============================================================================
// After Pixels — Daily Word's own parts (1236): the session page's body (the board, then Every guess) and the cover the
// session page shows. Reads the plays in app/gs-data.jsx (word-today, word-hard, word-failed, word-live). Loads after
// app/gs-escape.jsx and extends the same seams in app/gs-session.jsx.
// The record holds each guess with its marks and each hint as "Letter N is X." (game spec daily-word.md § 2): the place of
// the first letter not yet green. The answer is never printed; the seed's answer only computes the marks.
// ============================================================================

// ---- The model: the record's lines read as guesses (with the engine's marks) and the hint, in the order they came. ----
// The engine's marking: greens first, then each remaining letter of the answer lights at most one amber, left to right.
const wdScore = (word, answer) => {
  const w = word.split(''); const a = answer.split(''); const marks = w.map(() => 'miss'); const left = {};
  a.forEach((ch, i) => { if (w[i] === ch) marks[i] = 'hit'; else left[ch] = (left[ch] || 0) + 1; });
  w.forEach((ch, i) => { if (marks[i] !== 'hit' && left[ch]) { marks[i] = 'near'; left[ch] -= 1; } });
  return marks;
};
const wdRead = (s) => {
  const events = []; let n = 0;
  (s.lines || []).forEach((l) => {
    if (/^Guess/.test(l[0])) { n += 1; events.push({ kind: 'guess', n, word: l[1], marks: wdScore(l[1], s.answer || l[1]) }); }
    else if (l[0] === 'Hint') { const m = /Letter (\d) is ([A-Z])/.exec(l[1]); if (m) events.push({ kind: 'hint', pos: Number(m[1]) - 1, letter: m[2], text: l[1], after: n }); }
  });
  return { events, spare: s.live ? 6 - n : 0 };
};
const WD_SAY = { hit: 'in place', near: 'in the word', miss: 'not in the word' };

// ---- The board: one row a guess; the hint a slim row of its own where it was taken, its letter lit in its column and
// "Hint" in the column beside it; in progress, a slot row for each guess left. Tiles have no hover. ----
const WdRow = ({ g }) => (
  <div className="wd-row" role="img" aria-label={'Guess ' + g.n + ', ' + g.word + ': ' + g.word.split('').map((ch, i) => ch + ' ' + WD_SAY[g.marks[i]]).join(', ')}>
    {g.word.split('').map((ch, i) => <span key={i} className={'wd-t is-' + g.marks[i]} aria-hidden="true">{ch}</span>)}
  </div>);
// KEEP: the label takes the column after the hint's, or the one before when the hint is in the last place.
const WdHint = ({ h }) => { const lab = h.pos < 4 ? h.pos + 1 : h.pos - 1; return (
  <div className="wd-row is-hint" role="img" aria-label={'Hint, after guess ' + h.after + ': ' + h.text}>
    <span className="wd-t is-hint" style={{ gridColumn: h.pos + 1 }} aria-hidden="true">{h.letter}</span>
    <span className={'wd-hlab' + (lab < h.pos ? ' is-before' : '')} style={{ gridColumn: lab + 1, gridRow: 1 }} aria-hidden="true">Hint</span>
  </div>); };
const WdSlots = () => <div className="wd-row" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <span key={i} className="wd-t is-empty" />)}</div>;
const WdBoard = ({ s }) => {
  const p = React.useMemo(() => wdRead(s), [s]);
  return (
    <div className="wd-board">
      {p.events.map((e, i) => (e.kind === 'guess' ? <WdRow key={i} g={e} /> : <WdHint key={i} h={e} />))}
      {Array.from({ length: p.spare }, (_, i) => <WdSlots key={'e' + i} />)}
    </div>);
};

// ---- The session page's own part, under the shared head. Every guess is the store's plain list, collapsed. ----
const WdSessBody = ({ s }) => <>
  <section className="wd-play" aria-label="The board"><WdBoard s={s} /></section>
  <section className="wd-every">
    <DS.Disclosure title={gsOr(s.listTitle) + ' (' + s.lines.length + ')'}>
      <ol className="gs-lines">{s.lines.map((l, i) => <li key={i}><span className="gs-strong">{l[0]}</span> · {l.slice(1).join(' · ')}</li>)}</ol>
    </DS.Disclosure>
  </section>
</>;

window.GS_SESSION_BODY = { ...(window.GS_SESSION_BODY || {}), word: WdSessBody };

Object.assign(window, { wdRead, wdScore, WdBoard });
