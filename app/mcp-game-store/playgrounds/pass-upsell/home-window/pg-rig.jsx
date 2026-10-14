// Rig shell for `home-window`: four labelled frames of the real Home, signed out.
// ?frame=1A|1B|1C|1D  one frame alone, full-bleed 390x844, no chrome (for screenshots). No ?frame: the index of all four.
// Posture is signed out; the DS-changes the frames fake are named in each note.
const { GsCtx } = window;

const PG_SUB = { status: 'none', plan: 'monthly', hadPass: false, pending: null, renew: null };
const PG_USER = { username: 'MonaLaser', first: 'Mona', last: 'Lasker', locked: false, since: null, fresh: false, email: 'you@example.com' };
const PG_REVIEW = { providerFail: false, device: 'known', passFail: false, sheet: 'completes', week: 'done', today: 'played', unfinished: false };
const pgMakeGs = ({ route, width, log }) => {
  const noop = (name) => (...a) => log && log(name + '(' + a.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(', ') + ')');
  return {
    route, view: 'out', sub: PG_SUB, user: PG_USER, provider: 'email', choice: 'yearly', connected: false, review: PG_REVIEW, playing: null,
    width, narrow: width < 640, push: { ...(window.GS_PUSH_DEFAULT || {}) },
    setPush: noop('setPush'), go: noop('go'), setConnected: noop('setConnected'), setReview: noop('setReview'), setView: noop('setView'),
    setSub: noop('setSub'), setUser: noop('setUser'), setProvider: noop('setProvider'), setChoice: noop('setChoice'),
    keep: noop('keep'), back: noop('back'), goHow: noop('goHow'), howFromPlay: noop('howFromPlay'), startFree: noop('startFree'),
    signOut: noop('signOut'), setDemoView: noop('setDemoView'), play: noop('play'), playReq: noop('playReq'), closePlay: noop('closePlay'),
    getPass: noop('getPass'), accountMade: noop('accountMade'), afterCheckout: noop('afterCheckout'), signedIn: noop('signedIn'), paid: noop('paid'),
    deleteAccount: noop('deleteAccount'),
  };
};
const PgApp = ({ route, children, onNav }) => {
  const [width, setWidth] = React.useState(390);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current && ref.current.querySelector('.gs-root'); if (!el || !window.ResizeObserver) return undefined;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width)); ro.observe(el); return () => ro.disconnect();
  }, []);
  return (
    <GsCtx.Provider value={pgMakeGs({ route, width, log: onNav })}>
      <div ref={ref} style={{ display: 'contents' }}>
        <div className="gs-root"><GsTopBar />{children}<GsFooter /><div id="gs-announce" className="gs-vh" role="status" aria-live="polite"></div></div>
      </div>
    </GsCtx.Provider>
  );
};

// ---- the frames --------------------------------------------------------------------------------------------------------------
const PG_FRAMES = [
  { id: '1A', name: 'Quiet window (recommended)',
    note: 'Hero caption says your AI never asks you to pay. Band names what the account opens, no price. A corner lock marks the one Pass-only card; free and part-free cards carry nothing.',
    cost: 'Cost: the cut-off between free and Pass stays hidden until the product page. Corner lock is a design-system change, faked here.',
    v: { hero: 'caption', band: 'a', cards: 'lock', trust: true } },
  { id: '1B', name: 'Split tags, price',
    note: 'Band adds the price. Part-free cards carry a two-half tag: the open part, then Pass. Daily cards say Every day.',
    cost: 'Cost: a price on the first screen, and a new tag shape. Split tag is a design-system change, faked here.',
    v: { hero: 'caption', band: 'b', cards: 'split', trust: true } },
  { id: '1C', name: 'The chat says it',
    note: 'No Pass band. The hero chat ends on the honest finished-edition reply. The row runs open to Pass, with a line saying so. Cards are stock.',
    cost: 'Cost: needs AF-09 shipped first (specced, not deployed) [Q-G5] or the hero misdescribes chat; the sub-line carries all the weight at 390px; reopens the ratified Home band.',
    v: { hero: 'chat', band: 'none', cards: 'order', rowSub: 'Start on the left. Further right comes with the Pass.' } },
  { id: '1D', name: 'Visible (O7)',
    note: 'Band sits right under the hero with the price. Every card carries its access tag: Every day, Room 1, Scene 1, Chapter 1, or locked Pass.',
    cost: 'Cost: price and the free line on Home, and a tag on every card; more doors on one screen than Joe likes.',
    v: { hero: 'stock', band: 'd', cards: 'visible' } },
];

const PgFrame = ({ f, onNav }) => <PgApp route={{ name: 'home' }} onNav={onNav}><PgHome v={f.v} /></PgApp>;
const PgPhone = ({ children, full }) => (
  <div className="kit-phone-clip" style={{ width: 390, height: full ? 844 : 780, borderRadius: full ? 0 : 24, flex: 'none', border: full ? 0 : '1px solid #444' }}>
    <div className="kit-phone-screen">{children}</div>
  </div>
);

const PgRig = () => {
  const q = new URLSearchParams(location.search);
  const forced = (q.get('frame') || '').toUpperCase();
  const found = PG_FRAMES.find((f) => f.id === forced);
  const [log, setLog] = React.useState([]);
  const [only, setOnly] = React.useState('all');
  if (found) { document.body.style.margin = '0'; return <PgPhone full><PgFrame f={found} /></PgPhone>; }
  const shown = only === 'all' ? PG_FRAMES : PG_FRAMES.filter((f) => f.id === only);
  const tab = (v, l) => <button key={v} type="button" aria-pressed={only === v} onClick={() => setOnly(v)} className="pg-tab">{l}</button>;
  return (
    <div className="pg-shell">
      <div className="pg-bar" role="group" aria-label="Playground controls, not part of the product">
        <b>Home window</b>{tab('all', 'All four')}{PG_FRAMES.map((f) => tab(f.id, f.id))}
      </div>
      <p className="pg-stage">Signed out, first visit. Staged to Joe’s free line (his 2026-10-14 position, not a ruling): two free dailies (Word, Mystery), first edition free for Escape and Delve, Barrow and The Drowned Light chapter 1 free (fixture, not canon), The Lantern Keepers Pass only (fixture, not canon; 36,000 Summers Ago is gone from deployed). Casebook is off Home’s row. Derelict is the only game coming soon.</p>
      <div className="pg-row">
        {shown.map((f) => (
          <div key={f.id} className="pg-col">
            <div className="pg-cap"><b>{f.id} · {f.name}</b><br />{f.note}<br /><i>{f.cost}</i><br /><a className="pg-link" href={'?frame=' + f.id}>full-bleed {f.id}</a></div>
            <PgPhone><PgFrame f={f} onNav={(s) => setLog((l) => [s, ...l].slice(0, 5))} /></PgPhone>
          </div>
        ))}
      </div>
      <div className="pg-log">canon callbacks (stubbed, nothing navigates): {log.length ? log.join('  ·  ') : 'tap something'}</div>
    </div>
  );
};

const pgStyle = document.createElement('style');
pgStyle.textContent = `
  .pg-shell { min-height: 100vh; background: #1c1c1a; color: #eee; font: 13px/1.4 system-ui, sans-serif; padding-bottom: 24px; }
  .pg-bar { position: sticky; top: 0; z-index: 50; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; padding: 8px 12px; background: #111; border-bottom: 1px solid #333; }
  .pg-tab { background: #2a2a27; color: #ddd; border: 1px solid #444; border-radius: 6px; padding: 6px 14px; min-height: 48px; min-width: 48px; cursor: pointer; font: inherit; }
  .pg-tab[aria-pressed="true"] { background: #FF2EC4; color: #000; border-color: #FF2EC4; }
  .pg-link { color: #9cf; }
  .pg-stage { max-width: 840px; margin: 12px auto 0; padding: 0 16px; color: #bbb; }
  .pg-row { display: flex; flex-wrap: wrap; gap: 24px; justify-content: center; padding: 16px; }
  .pg-col { display: grid; gap: 8px; justify-items: center; align-content: start; }
  .pg-cap { color: #ccc; max-width: 390px; }
  .pg-log { padding: 0 16px; color: #999; text-align: center; }`;
document.head.appendChild(pgStyle);
ReactDOM.createRoot(document.getElementById('root')).render(<PgRig />);
