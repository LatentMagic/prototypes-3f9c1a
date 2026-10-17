// Playground only: the "Needs the Pass" block. Card size and place never change; only what fills it.
// ?layout=record | art | split (the three options, default record); older: now | foot | middle | centred. ?action=link|button (default button).
// Everything beyond the label, heading and line is placeholder copy.
const PE_OPTIONS = [['record', 'Record strip below'], ['art', 'Art beside the words'], ['split', 'What stays, what returns']];
const PE_OLD = ['now', 'foot', 'middle', 'centred'];
const peParam = (k) => { try { return new URLSearchParams(window.location.search).get(k); } catch (e) { return null; } };
const peAction = () => (peParam('action') === 'link' ? 'link' : 'button');
const peLayout = () => { const l = peParam('layout'); return PE_OPTIONS.some(([k]) => k === l) || PE_OLD.includes(l) ? l : 'record'; };

// The game's own art on its ground, anchored as the art extends (never stretched or cropped).
const PeArt = ({ game }) => {
  const a = GS_ART[game] || {};
  const svg = (a.svg || '').replace('xMidYMid slice', a.extend === 'bottom' ? 'xMidYMax meet' : 'xMidYMid meet').replace('<svg ', '<svg style="width:100%;height:100%;display:block" ');
  return <div className={'pe-pic is-' + (a.ground || 'indigo')} aria-hidden="true" dangerouslySetInnerHTML={{ __html: svg }} />;
};

const PeBlock = ({ label, heading, line, action, style, game, facts, kept, gains, gainsLabel }) => {
  const gs = useGs(); const go = () => gs.go('pass'); const lay = peLayout();
  // The switcher changes ?layout= in place and announces it; re-render to pick it up.
  const [, bump] = React.useState(0);
  React.useEffect(() => { const f = () => bump((n) => n + 1); window.addEventListener('pe-switch', f); return () => window.removeEventListener('pe-switch', f); }, []);
  const words = (
    <div className="gs-stack-xs">
      {label && <span className="gs-label">{label}</span>}
      {heading && <h2 className="mcp-t-sec gs-pu-wrap">{heading}</h2>}
      {line && <p>{line}</p>}
    </div>
  );
  const act = <div className="pe-act">{peAction() === 'button' ? <DS.Button variant="secondary" onClick={go}>{action}</DS.Button> : <DS.TextLink onClick={go}>{action}</DS.TextLink>}</div>;
  const cls = 'lb-card gs-pu-return pe-block' + (lay === 'now' ? '' : ' pe-' + lay);
  if (lay === 'record') return (
    <section className={cls} style={style}>
      <div className="lb-top">{words}{act}</div>
      {facts && <dl className="lb-facts pe-facts">{facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>}
    </section>
  );
  if (lay === 'art') return (
    <section className={cls} style={style}>
      {game && <PeArt game={game} />}
      <div className="pe-text">{words}{act}</div>
    </section>
  );
  if (lay === 'split') return (
    <section className={cls} style={style}>
      <div className="pe-half">{words}{kept && <p className="gs-muted pe-kept">{kept}</p>}</div>
      <div className="pe-half pe-gains">
        <div className="gs-stack-xs">
          <span className="gs-label">{gainsLabel || 'WITH THE PASS'}</span>
          {(gains || []).map((g) => <p key={g}>{g}</p>)}
        </div>
        {act}
      </div>
    </section>
  );
  return <section className={cls} style={style}>{words}{act}</section>;
};
Object.assign(window, { PeBlock, peAction, peLayout, PE_OPTIONS });
