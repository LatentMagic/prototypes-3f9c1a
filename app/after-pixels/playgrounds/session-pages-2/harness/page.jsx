// ============================================================================
// Session pages 2: the parts every option shares, built from canon's own parts and classes.
// Sp2Top is canon's session head as GsSessionRecord draws it today (gs-session.jsx): cover, edition, result, date,
// then Play (a play in progress), Share, or nothing, and the played-once line. Canon draws it inline, so it is
// composed here from the same parts; it is never restyled.
// Sp2EveryMove is canon's plain list (title + gs-lines), inside the design system's Disclosure, closed.
// ============================================================================
const Sp2Top = ({ s, sid }) => {
  const gs = useGs();
  const [share, setShare] = React.useState(false);
  const ed = window.gsSessEd ? gsSessEd(gs, sid) : null;
  const over = gsStartsOver(s.gid);
  const text = gsShareText(s);
  const again = over ? <DS.Button variant="secondary" onClick={() => gs.play(s.game, sid)}>Start over</DS.Button> : null;
  return (
    <section className="gs-sess-head">
      <GsCover art={s.art} />
      <div className="gs-stack-md" style={{ justifyItems: 'start' }}>
        <span className="mcp-t-card">{ed ? edLabel(ed) : s.game}</span>
        <h1 className="gs-h1">{gsOr(s.result)}</h1>
        <div className="gs-figs">
          <span className="gs-fig gs-fig-quiet">{gsShortDay(gsSessDate(s, gs))}</span>
          {(s.figures || []).map((f, i) => <span key={i} className="gs-fig">{gsOr(f)}</span>)}
        </div>
        <div className="gs-pairwrap">
          {s.live ? <DS.Button onClick={() => gs.play(s.game, sid)}>Play</DS.Button>
            : text ? (again ? <DS.ButtonPair>{again}<DS.Button onClick={() => setShare(true)}>Share</DS.Button></DS.ButtonPair>
              : <DS.Button onClick={() => setShare(true)}>Share</DS.Button>)
            : again}
        </div>
        {!s.live && !over && <p>{GS_ONCE_LINE}</p>}
      </div>
      <GsSharePopup open={share} onClose={() => setShare(false)} lines={text} />
    </section>
  );
};

const Sp2EveryMove = ({ s }) => (
  <section className="sp2-moves">
    <DS.Disclosure title={gsOr(s.listTitle)}>
      {s.lines.length > 0 && <ol className="gs-lines">
        {s.lines.map((l, i) => <li key={i}><span className="gs-strong">{l[0]}</span> · {l.slice(1).join(' · ')}</li>)}
      </ol>}
    </DS.Disclosure>
  </section>
);

// One whole session page: canon's back link, the top section, the option's own area, Every move.
const Sp2Page = ({ s, sid, children }) => (
  <>
    <div className="gs-wrap gs-backbar" style={{ paddingTop: 24 }}><LbBackTo gid={s.gid} /></div>
    <main className="gs-wrap gs-main sp2-main">
      <Sp2Top s={s} sid={sid} />
      <section className="sp2-area" aria-label="This play">{children}</section>
      <Sp2EveryMove s={s} />
    </main>
  </>
);

Object.assign(window, { Sp2Page, Sp2Top, Sp2EveryMove });
