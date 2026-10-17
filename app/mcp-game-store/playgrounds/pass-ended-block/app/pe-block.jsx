// Playground only: the "Needs the Pass" block. ?action=link|button (default link); ?layout=foot|middle|centred (default: as now). Card size and place never change.
const peAction = () => { try { return new URLSearchParams(window.location.search).get('action') === 'button' ? 'button' : 'link'; } catch (e) { return 'link'; } };
const peLayout = () => { try { const l = new URLSearchParams(window.location.search).get('layout'); return ['foot', 'middle', 'centred'].includes(l) ? l : 'now'; } catch (e) { return 'now'; } };
const PeBlock = ({ label, heading, line, action, style }) => {
  const gs = useGs(); const go = () => gs.go('pass'); const lay = peLayout();
  return (
    <section className={'lb-card gs-pu-return pe-block' + (lay === 'now' ? '' : ' pe-' + lay)} style={style}>
      <div className="gs-stack-xs">
        <span className="gs-label">{label}</span>
        {heading && <h2 className="mcp-t-sec gs-pu-wrap">{heading}</h2>}
        {line && <p>{line}</p>}
      </div>
      <div className="pe-act">{peAction() === 'button' ? <DS.Button variant="secondary" onClick={go}>{action}</DS.Button> : <DS.TextLink onClick={go}>{action}</DS.TextLink>}</div>
    </section>
  );
};
Object.assign(window, { PeBlock, peAction, peLayout });
