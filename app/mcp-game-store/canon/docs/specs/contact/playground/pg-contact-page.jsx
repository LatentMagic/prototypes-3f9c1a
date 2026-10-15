// Contact page, round 2: option 2 (a "Get in touch" page from the footer) chosen 2026-10-15.
// Two addresses: support, and one address for everything else. Three takes on the page.
// The footer markup is copied from GsFooter (app/gs-site.jsx); the page renders through the legal route (doc: 'contact').
const CP_KEY = 'pg_contact_page_v1';
let cpState = { opt: 'a', open: true, ...(() => { try { return JSON.parse(localStorage.getItem(CP_KEY)) || {}; } catch (e) { return {}; } })() };
const cpSubs = new Set();
const cpSet = (p) => { cpState = { ...cpState, ...p }; try { localStorage.setItem(CP_KEY, JSON.stringify(cpState)); } catch (e) {} cpSubs.forEach((f) => f(cpState)); };
const useCp = () => { const [s, setS] = React.useState(cpState); React.useEffect(() => { cpSubs.add(setS); return () => cpSubs.delete(setS); }, []); return s; };

// Placeholder: the owner names the second address.
const CP_HELLO = 'hello@[platform].example';
const CP_SITE = 'https://www.harnessintent.com/';

const CP_OPTS = [
  { id: 'a', name: 'Two sections', idea: 'Support first, one section for everything else, then who runs it. Same shape as the other legal pages.',
    correct: 'Right two addresses, right order: most people writing need help. No company number or registered office, which a UK company site must show somewhere (Terms could carry it).',
    elegant: 'Quietest of the three. Three equal headings make support and a partnership look the same size of thing.',
    copy: '“Anything else” is honest but limp, and reads as a leftover. “Tell the team” dodges “we” as the voice asks.' },
  { id: 'b', name: 'Address first', idea: 'Each address is the biggest thing in its section, with one line under it on what to send.',
    correct: 'Same two addresses. Puts the thing people came for, the address, where the eye lands. Same gap on company details as a.',
    elegant: 'Strongest scan: two addresses, nothing to read before them. The mono address at size is new on this site and needs the owner’s eye.',
    copy: '“Make something together” covers games, art and partnerships without saying “sell”. It speaks for “us” implicitly, which the voice permits only just.' },
  { id: 'c', name: 'One door, support aside', idea: 'The page leads with working together; support sits in one line at the top for people who came to the wrong place.',
    correct: 'Carries the full company details a UK site needs, so nothing else has to. Risks sending a stuck player past their answer.',
    elegant: 'Least like a form, most like a letter. Asymmetry says what the page is for.',
    copy: '“Every message gets read” promises a person, which must stay true. Registered office and number are blanks until supplied.' },
];
CP_OPTS.push({ id: 'd', name: '2a, rewritten', idea: '2a with friendlier copy: Help and Say hello, and a closing line in place of “Who runs”.',
  correct: 'Same two addresses. “Say hello” matches hello@, so the heading tells you which address it is. Company number and registered office still need a home, most likely Terms.',
  elegant: 'Two short headings, one line each, one line to close. Nothing on the page asks you to fill anything in.',
  copy: 'Every line is a whole sentence with a verb and no “we”. “Anything else” keeps it open to contributors and partners without naming a sale.' });
// Round 3 (2026-10-15): 2d's shape kept; Help and Say hello rewritten to speak to the reader. Say hello leads with contributing and stays open to anyone, including a business.
CP_OPTS.push(
  { id: 'e', name: 'Plain', idea: 'Each line says when to use the address, from the reader’s side.',
    help: 'If a game, your account or the Pass isn’t working, email support.',
    hello: 'If you’d like to make a game, or work with the team on something else, write here.',
    correct: 'Help names the trigger (something isn’t working) so nobody wonders which address. “Work with the team on something else” leaves room for a partner or a buyer without saying so.',
    elegant: 'Two matching “If…” lines read as a pair. Plainest of the three.',
    copy: 'No voice at all. Safe for a working page, a little dry.' },
  { id: 'f', name: 'You first', idea: 'Help says what you can send; Say hello describes who might be writing.',
    help: 'You can email support about anything to do with a game, your account or the Pass.',
    hello: 'You might make games, write, draw or run a business. Tell the team what you have in mind.',
    correct: 'Help covers every support case without listing problems. “Run a business” is the quiet door for a buyer or partner, sitting among the contributors.',
    elegant: 'Say hello is two short sentences; the reader finds themselves in the first and is told what to do in the second.',
    copy: 'Speaks to “you” throughout. “Tell the team what you have in mind” is open-ended by design.' },
  { id: 'g', name: 'One voice line', idea: 'Plain thing first, then one line in the site’s voice on Say hello only.',
    help: 'Email support about a game, your account or the Pass, and say where you got stuck.',
    hello: 'Every game here started as someone’s idea. Send yours, or anything else you’d like to work on.',
    correct: '“Every game here started as someone’s idea” must stay true. “Anything else you’d like to work on” keeps the catch-all.',
    elegant: 'The only option with a line that sounds like the shop front. Help stays plain, as errors and support should.',
    copy: 'Puts making a game first, so contributing is the obvious reading. “Say where you got stuck” assumes the reader is stuck, which fits most support mail.' },
);
// Round 4 (2026-10-15): 2f and 2g merged, "contribute" in place of "make". 2h and 2i differ only in heading length.
const CP_R4_HELP = 'Email support about anything to do with a game, your account or the Pass. Say where you got stuck.';
const CP_R4_HELLO = 'Email here to contribute a game, writing or art, or to work with the team.';
CP_OPTS.push(
  { id: 'h', name: 'Merged, long headings', idea: '2f’s Help plus 2g’s “say where you got stuck”; Say hello rewritten around “contribute”. Headings say what each section is for.',
    hTitle: 'Get help with a game or your account', helloTitle: 'Contribute a game or an idea', help: CP_R4_HELP, hello: CP_R4_HELLO,
    correct: '“Work with the team” stays the quiet catch-all for partners and buyers.',
    elegant: 'Longer headings carry the meaning, so the body lines can be read or skipped.',
    copy: 'Heading and body both say “contribute” once between them, so it never repeats on a line.' },
  { id: 'i', name: 'Merged, short headings', idea: 'Same copy as 2h with one-word headings.',
    hTitle: 'Help', helloTitle: 'Contribute', help: CP_R4_HELP, hello: CP_R4_HELLO,
    correct: 'Same as 2h.',
    elegant: 'Quieter page; the body lines do all the explaining.',
    copy: '“Contribute” appears in the heading and the line under it.' },
);
CP_OPTS.push({ id: 'j', name: 'Round 5', idea: 'Second section ratified 2026-10-15: “Talk to the team” and its line. Help heading and line proposed, not yet ratified.',
  hTitle: 'Get help', helloTitle: 'Talk to the team', help: CP_R4_HELP,
  hello: 'If you’d like to contribute, or have anything else in mind, email the team.',
  correct: 'The second section is the catch-all; contributing is one reason among many.',
  elegant: 'Both headings fit one line on a phone.',
  copy: 'Each line names who you’re emailing, support or the team, with the address under it.' });
const cpOpt = (s) => CP_OPTS.find((o) => o.id === s.opt) || CP_OPTS[0];

const CpBrand = () => <span className="gs-brand" style={{ cursor: 'default', pointerEvents: 'none' }}><GsMark /><span>[Platform]</span></span>;
const CP_LEGAL = [['privacy', 'Privacy'], ['terms', 'Terms'], ['refunds', 'Refunds']];
const CpExt = ({ children }) => <a href={CP_SITE} target="_blank" rel="noopener">{children}</a>;
const CpMail = ({ to, big }) => <a className={big ? 'cp-addr' : undefined} href={'mailto:' + to}>{to}</a>;

const CpFooter = () => {
  const gs = useGs();
  const legal = (doc) => gs.go('legal', { doc });
  const getInTouch = <button type="button" className="gs-ft-link" onClick={() => legal('contact')}>Get in touch</button>;
  const copy = <p className="gs-ft-copy">© 2026 Harness Intent Ltd</p>;
  return (
    <footer className="gs-ft" data-ct-footer="">
      <div className="gs-wrap">
        <div className="gs-ft-wide">
          <div className="gs-ft-brand"><CpBrand />{copy}</div>
          <div className="gs-ft-col"><h2 className="gs-ft-h">contact</h2>{getInTouch}</div>
          <div className="gs-ft-col"><h2 className="gs-ft-h">legal</h2>{CP_LEGAL.map(([d, l]) => <button key={d} type="button" className="gs-ft-link" onClick={() => legal(d)}>{l}</button>)}</div>
        </div>
        <div className="gs-ft-narrow">
          <div className="gs-ft-top"><span className="gs-ft-mark"><CpBrand /></span>{getInTouch}</div>
          <div className="gs-ft-bottom"><div className="gs-ft-run">{CP_LEGAL.map(([d, l], i) => <React.Fragment key={d}>{i > 0 && <span className="gs-ft-dot" aria-hidden="true">·</span>}<button type="button" className="gs-ft-link" onClick={() => legal(d)}>{l}</button></React.Fragment>)}</div>{copy}</div>
        </div>
      </div>
    </footer>
  );
};

const CpPageA = () => (<>
  <header className="gs-stack-sm"><h1 className="gs-legal-h1">Get in touch</h1></header>
  <section className="gs-legal-sec">
    <h2 className="gs-legal-h2">Help with a game or your account</h2>
    <p>Say which game or account it’s about, and what happened.</p>
    <p><CpMail to={window.GS_SUPPORT} /></p>
  </section>
  <section className="gs-legal-sec">
    <h2 className="gs-legal-h2">Anything else</h2>
    <p>Pitch a game, offer to help, or tell the team what you’d build together.</p>
    <p><CpMail to={CP_HELLO} /></p>
  </section>
  <section className="gs-legal-sec">
    <h2 className="gs-legal-h2">Who runs [Platform]</h2>
    <p><CpExt>Harness Intent</CpExt> makes and runs it.</p>
  </section>
</>);

const CpPageB = () => (<>
  <header className="gs-stack-sm"><h1 className="gs-legal-h1">Get in touch</h1></header>
  <section className="gs-legal-sec cp-sec">
    <h2 className="cp-k">Help with a game or your account</h2>
    <CpMail to={window.GS_SUPPORT} big />
    <p>Say which game or account it’s about, and what happened.</p>
  </section>
  <section className="gs-legal-sec cp-sec">
    <h2 className="cp-k">Make something together</h2>
    <CpMail to={CP_HELLO} big />
    <p>Games, art, writing and partnerships all come here. Say who you are and what you have in mind.</p>
  </section>
  <p className="cp-foot">[Platform] is made by <CpExt>Harness Intent</CpExt>.</p>
</>);

const CpPageC = () => (<>
  <header className="gs-stack-sm">
    <h1 className="gs-legal-h1">Get in touch</h1>
    <p className="cp-aside">Stuck in a game or your account? Write to <CpMail to={window.GS_SUPPORT} />.</p>
  </header>
  <section className="gs-legal-sec">
    <h2 className="gs-legal-h2">Work on [Platform]</h2>
    <p>You might make games, draw, write, or run a company that could use this. Send a few lines on who you are and what you’d like to do. Every message gets read.</p>
    <p><CpMail to={CP_HELLO} big /></p>
  </section>
  <section className="gs-legal-sec cp-co">
    <h2 className="cp-k">Company</h2>
    <p><CpExt>Harness Intent Ltd</CpExt>, registered in England and Wales.</p>
    <p>Company number [number]. Registered office [address].</p>
  </section>
</>);

const CpPageD = () => (<>
  <header className="gs-stack-sm"><h1 className="gs-legal-h1">Get in touch</h1></header>
  <section className="gs-legal-sec">
    <h2 className="gs-legal-h2">Help</h2>
    <p>Write about a game, your account or the Pass.</p>
    <p><CpMail to={window.GS_SUPPORT} /></p>
  </section>
  <section className="gs-legal-sec">
    <h2 className="gs-legal-h2">Say hello</h2>
    <p>Write with an idea, a game you’d like to make, or anything else.</p>
    <p><CpMail to={CP_HELLO} /></p>
  </section>
  <p className="cp-foot">[Platform] is made by <CpExt>Harness Intent</CpExt>.</p>
</>);

const CpPageR3 = ({ o }) => (<>
  <header className="gs-stack-sm"><h1 className="gs-legal-h1">Get in touch</h1></header>
  <section className="gs-legal-sec">
    <h2 className="gs-legal-h2">{o.hTitle || 'Help'}</h2>
    <p>{o.help}</p>
    <p><CpMail to={window.GS_SUPPORT} /></p>
  </section>
  <section className="gs-legal-sec">
    <h2 className="gs-legal-h2">{o.helloTitle || 'Say hello'}</h2>
    <p>{o.hello}</p>
    <p><CpMail to={CP_HELLO} /></p>
  </section>
  <p className="cp-foot">[Platform] is made by <CpExt>Harness Intent</CpExt>.</p>
</>);

const CpPage = () => { const st = useCp(); const o = cpOpt(st); if (o.help) return <main className="gs-wrap gs-legal"><article className="gs-legal-col"><CpPageR3 o={o} /></article></main>; const P = st.opt === 'b' ? CpPageB : st.opt === 'c' ? CpPageC : st.opt === 'd' ? CpPageD : CpPageA; return <main className="gs-wrap gs-legal"><article className="gs-legal-col"><P /></article></main>; };
const CpLegal = () => { const gs = useGs(); return gs.route.doc === 'contact' ? <CpPage /> : <window.GsLegalReal />; };

const cpTop = () => setTimeout(() => { const t = document.querySelector('[data-ct-footer]'); const box = t && t.closest('.kit-phone-screen'); if (box) box.scrollTo({ top: 0 }); else window.scrollTo({ top: 0 }); }, 60);
const cpScroll = () => setTimeout(() => {
  const t = document.querySelector('[data-ct-footer]'); if (!t) return;
  const box = t.closest('.kit-phone-screen');
  if (box) box.scrollTo({ top: box.scrollHeight }); else window.scrollTo({ top: document.documentElement.scrollHeight });
}, 60);

let cpBooted = false;
const CpStrip = () => {
  const gs = useGs(); const st = useCp(); const o = cpOpt(st);
  const [why, setWhy] = React.useState(false);
  const toPage = () => { if (!(gs.route.name === 'legal' && gs.route.doc === 'contact')) gs.go('legal', { doc: 'contact' }); cpTop(); };
  React.useEffect(() => { if (!cpBooted) { cpBooted = true; gs.setDemoView('out'); setTimeout(() => { window.gsApi && window.gsApi.go('legal', { doc: 'contact' }); }, 0); } }, []);
  return (
    <div className="gs-demo pg-strip" role="group" aria-label="Playground controls, not part of the product">
      {st.open ? (
        <div className="pg-strip-row">
          <span className="ct-k">Option</span>
          {CP_OPTS.map((x) => <button key={x.id} type="button" className="gs-demo-opt" aria-pressed={st.opt === x.id} title={x.name} onClick={() => { cpSet({ opt: x.id }); toPage(); }}>2{x.id}</button>)}
          <span className="pg-name">{o.name}</span>
          <button type="button" className="gs-demo-opt" onClick={cpScroll}>Footer</button>
          <button type="button" className="gs-demo-opt" onClick={() => setWhy(true)}>Why</button>
          <button type="button" className="gs-demo-opt" onClick={() => cpSet({ open: false })}>Hide</button>
        </div>
      ) : (
        <div className="gs-demo-in"><button type="button" className="gs-demo-opt" onClick={() => cpSet({ open: true })}>Show · 2{o.id} {o.name}</button></div>
      )}
      <DS.Popup open={why} onClose={() => setWhy(false)} posture={gs.narrow ? 'sheet' : 'window'} title={'2' + o.id + ' · ' + o.name}>
        <div className="pg-why">
          <p>{o.idea}</p>
          <p><b>Correct.</b> {o.correct}</p>
          <p><b>Elegant.</b> {o.elegant}</p>
          <p><b>Copy.</b> {o.copy}</p>
        </div>
        <DS.Button variant="secondary" block onClick={() => setWhy(false)}>Close</DS.Button>
      </DS.Popup>
    </div>
  );
};

window.GsLegalReal = window.GsLegal;
window.GsLegal = CpLegal;
window.GsFooter = CpFooter;
window.GsDemoBar = CpStrip;
