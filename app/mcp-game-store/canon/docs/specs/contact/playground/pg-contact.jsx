// Contact playground: the real app, signed out, with the footer swapped per option.
// The footer markup is copied from GsFooter (app/gs-site.jsx), which has no slot for its contact column.
// Option 2's page renders through the legal route (doc: 'contact'); every other legal page is the shipped one.
const CT_KEY = 'pg_contact_v1';
let ctState = { opt: '1', open: true, ...(() => { try { return JSON.parse(localStorage.getItem(CT_KEY)) || {}; } catch (e) { return {}; } })() };
const ctSubs = new Set();
const ctSet = (p) => { ctState = { ...ctState, ...p }; try { localStorage.setItem(CT_KEY, JSON.stringify(ctState)); } catch (e) {} ctSubs.forEach((f) => f(ctState)); };
const useCt = () => { const [s, setS] = React.useState(ctState); React.useEffect(() => { ctSubs.add(setS); return () => ctSubs.delete(setS); }, []); return s; };

// Placeholder addresses: the owner supplies the real ones.
const CT_WHO = [
  { id: 'help', label: 'Help with a game or your account', mail: window.GS_SUPPORT, line: 'Say which game or account it’s about, and what happened.' },
  { id: 'make', label: 'Make a game for [Platform]', mail: 'games@[platform].example', line: 'Send a short pitch: the game, who it’s for, and what your AI does in it.' },
  { id: 'buy', label: 'Buy or license the platform', mail: 'partners@[platform].example', line: 'Write with your company, what you’d build on it, and when.' },
];

const CT_OPTS = [
  { id: '0', name: 'Today', idea: 'One support address in the footer, for everyone.', cost: 'A contributor or a buyer writes to support, or doesn’t write at all.' },
  { id: '1', name: 'Three addresses', idea: 'The footer lists one address for each kind of person, on every page, with no click.', cost: 'Three inboxes to run and answer, all open to spam. The footer grows on a phone.' },
  { id: '2', name: 'Contact page', idea: 'The footer links to one page that says what to send to each address, and who runs the company.', cost: 'One click further, and a buyer has to look in the footer first. Another page to keep true.' },
  { id: '3', name: 'Contact panel', idea: 'A panel asks what it’s about, then gives one address to copy or write to.', cost: 'No address shows until the panel opens, and picking a topic is a step most people don’t need.' },
  { id: '4', name: 'Partners band', idea: 'A line above the footer speaks to studios and buyers on every page. Support stays where it is.', cost: 'A business pitch sits under every player page, in a shop written for players.' },
];
const ctOpt = (s) => CT_OPTS.find((o) => o.id === s.opt) || CT_OPTS[0];

const CtBrand = () => <span className="gs-brand" style={{ cursor: 'default', pointerEvents: 'none' }}><GsMark /><span>[Platform]</span></span>;
const CtMail = ({ to, mono }) => <a className={'gs-ft-mail' + (mono ? ' ct-mono' : '')} href={'mailto:' + to}>{to}</a>;
const CT_LEGAL = [['privacy', 'Privacy'], ['terms', 'Terms'], ['refunds', 'Refunds']];

const CtFooter = () => {
  const gs = useGs(); const st = useCt(); const o = st.opt;
  const [panel, setPanel] = React.useState(false);
  const legal = (doc) => gs.go('legal', { doc });
  const page = () => gs.go('legal', { doc: 'contact' });
  const open = o === '2' ? page : () => setPanel(true);
  const getInTouch = <button type="button" className="gs-ft-link" onClick={open}>Get in touch</button>;
  const legalCol = <div className="gs-ft-col"><h2 className="gs-ft-h">legal</h2>{CT_LEGAL.map(([d, l]) => <button key={d} type="button" className="gs-ft-link" onClick={() => legal(d)}>{l}</button>)}</div>;
  const legalRun = <div className="gs-ft-run">{CT_LEGAL.map(([d, l], i) => <React.Fragment key={d}>{i > 0 && <span className="gs-ft-dot" aria-hidden="true">·</span>}<button type="button" className="gs-ft-link" onClick={() => legal(d)}>{l}</button></React.Fragment>)}</div>;
  const copy = <p className="gs-ft-copy">© 2026 Harness Intent Ltd</p>;
  const three = <ul className="ct-who">{CT_WHO.map((w) => <li key={w.id}><span className="ct-who-l">{w.label}</span><CtMail to={w.mail} /></li>)}</ul>;
  const contact = o === '1' ? three : (o === '2' || o === '3') ? getInTouch : <CtMail to={window.GS_SUPPORT} />;
  return (
    <footer className={'gs-ft' + (o === '1' ? ' ct-ft-three' : '')} data-ct-footer="">
      <div className="gs-wrap">
        {o === '4' && (
          <section className="ct-band" aria-labelledby="ct-band-h">
            <div className="gs-stack-xs">
              <h2 id="ct-band-h" className="ct-band-h">For studios and partners</h2>
              <p className="ct-band-p">License [Platform] for your own product, or make a game for it.</p>
            </div>
            <div className="ct-band-links">
              <DS.TextLink href={'mailto:' + CT_WHO[2].mail}>Talk about licensing</DS.TextLink>
              <DS.TextLink href={'mailto:' + CT_WHO[1].mail}>Pitch a game</DS.TextLink>
            </div>
          </section>
        )}
        <div className="gs-ft-wide">
          <div className="gs-ft-brand"><CtBrand />{copy}</div>
          <div className="gs-ft-col"><h2 className="gs-ft-h">contact</h2>{contact}</div>
          {legalCol}
        </div>
        <div className="gs-ft-narrow">
          {o === '1' ? (<>
            <div className="gs-ft-top"><span className="gs-ft-mark"><CtBrand /></span></div>
            {three}
          </>) : (
            <div className="gs-ft-top"><span className="gs-ft-mark"><CtBrand /></span>{o === '2' || o === '3' ? getInTouch : <CtMail to={window.GS_SUPPORT} mono />}</div>
          )}
          <div className="gs-ft-bottom">{legalRun}{copy}</div>
        </div>
      </div>
      {o === '3' && <CtPanel open={panel} onClose={() => setPanel(false)} />}
    </footer>
  );
};

const CtPanel = ({ open, onClose }) => {
  const gs = useGs();
  const [pick, setPick] = React.useState(null);
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => { if (!open) { setPick(null); setCopied(false); } }, [open]);
  const w = CT_WHO.find((x) => x.id === pick);
  const doCopy = () => { try { navigator.clipboard.writeText(w.mail); } catch (e) {} setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <DS.Popup open={open} onClose={onClose} posture={gs.narrow ? 'sheet' : 'window'} title="Get in touch">
      <div className="ct-panel">
        <p>Pick what it’s about and you’ll get the right address.</p>
        <div className="lb-choice ct-choice" role="group" aria-label="What it’s about">
          {CT_WHO.map((x) => <button key={x.id} type="button" aria-pressed={pick === x.id} onClick={() => { setPick(x.id); setCopied(false); }}>{x.label}</button>)}
        </div>
        {w && (
          <div className="ct-answer" aria-live="polite">
            <p>{w.line}</p>
            <p className="ct-addr">{w.mail}</p>
            <div className="ct-acts">
              <DS.Button variant="secondary" done={copied} doneLabel="Copied" onClick={doCopy}>Copy address</DS.Button>
              <DS.Button onClick={() => { window.location.href = 'mailto:' + w.mail; }}>Write an email</DS.Button>
            </div>
          </div>
        )}
      </div>
    </DS.Popup>
  );
};

const CtPage = () => (
  <main className="gs-wrap gs-legal">
    <article className="gs-legal-col">
      <header className="gs-stack-sm"><h1 className="gs-legal-h1">Get in touch</h1></header>
      {CT_WHO.map((w) => (
        <section key={w.id} className="gs-legal-sec">
          <h2 className="gs-legal-h2">{w.label}</h2>
          <p>{w.line}</p>
          <p><a href={'mailto:' + w.mail}>{w.mail}</a></p>
        </section>
      ))}
      <section className="gs-legal-sec">
        <h2 className="gs-legal-h2">Who runs [Platform]</h2>
        <p>Harness Intent Ltd runs [Platform]. Registered address · [address]. Company number · [number].</p>
      </section>
    </article>
  </main>
);

const CtLegal = () => { const gs = useGs(); return gs.route.doc === 'contact' ? <CtPage /> : <window.GsLegalReal />; };

const ctScroll = () => setTimeout(() => {
  const t = document.querySelector('[data-ct-footer]'); if (!t) return;
  const box = t.closest('.kit-phone-screen');
  if (box) box.scrollTo({ top: box.scrollHeight }); else window.scrollTo({ top: document.documentElement.scrollHeight });
}, 60);

let ctBooted = false;
const CtStrip = () => {
  const gs = useGs(); const st = useCt(); const o = ctOpt(st);
  const [why, setWhy] = React.useState(false);
  React.useEffect(() => { if (!ctBooted) { ctBooted = true; gs.setDemoView('out'); setTimeout(() => { window.gsApi && window.gsApi.go('home'); ctScroll(); }, 0); } }, []);
  const pick = (id) => { ctSet({ opt: id }); if (gs.route.name === 'legal' && gs.route.doc === 'contact' && id !== '2') gs.go('home'); ctScroll(); };
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {st.open ? (
        <div className="pg-strip-row">
          <span className="ct-k">Option</span>
          {CT_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={st.opt === x.id} title={x.name} onClick={() => pick(x.id)}>{x.id}</button>)}
          <span className="pg-name">{o.name}</span>
          <button type="button" className="gs-demo-opt" onClick={ctScroll}>Footer</button>
          <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
          <button type="button" className="gs-demo-opt" onClick={() => ctSet({ open: false })}>Hide</button>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => ctSet({ open: true })}>Show · {o.id} {o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} posture={gs.narrow ? 'sheet' : 'window'} title={o.id + ' · ' + o.name}>
        <div className="pg-why"><p>{o.idea}</p><p><b>Cost.</b> {o.cost}</p></div>
        <DS.Button variant="secondary" block onClick={() => setWhy(false)}>Close</DS.Button>
      </DS.Popup>
    </div>
  );
};

window.GsLegalReal = window.GsLegal;
window.GsLegal = CtLegal;
window.GsFooter = CtFooter;
window.GsDemoBar = CtStrip;
