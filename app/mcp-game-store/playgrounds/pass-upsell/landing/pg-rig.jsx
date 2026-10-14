// Rig shell: supplies the context canon's main.jsx would, mounts REAL canon screens, switches frames.
// Reads: ?frame=<screen>-<a|b>   one frame alone, full-bleed at 390x844, no rig chrome (for screenshots)
//        ?posture=out|free|pass  who is looking (default out)
const { GsCtx, GS_GAMES } = window;

// ---- posture -> the context object (shape from canon/app/main.jsx `gs`; every field the mounted screens read) ----------
const PG_SUB = { none: { status: 'none', plan: 'monthly', hadPass: false, pending: null, renew: null },
  active: { status: 'active', plan: 'monthly', hadPass: true, pending: null, renew: new Date(2026, 10, 6).getTime() } };
const PG_USER = { username: 'MonaLaser', first: 'Mona', last: 'Lasker', locked: false, since: null, fresh: false, email: 'you@example.com' };
const PG_REVIEW = { providerFail: false, device: 'known', passFail: false, sheet: 'completes', week: 'done', today: 'played', unfinished: false };

const pgMakeGs = ({ posture, route, width, log }) => {
  const noop = (name) => (...a) => log && log(name + '(' + a.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(', ') + ')');
  return {
    route, view: posture, sub: posture === 'pass' ? PG_SUB.active : PG_SUB.none, user: PG_USER, provider: 'email', choice: 'yearly',
    connected: posture !== 'out', review: PG_REVIEW, playing: null, width, narrow: width < 640, push: { ...(window.GS_PUSH_DEFAULT || {}) },
    setPush: noop('setPush'), go: noop('go'), setConnected: noop('setConnected'), setReview: noop('setReview'), setView: noop('setView'),
    setSub: noop('setSub'), setUser: noop('setUser'), setProvider: noop('setProvider'), setChoice: noop('setChoice'),
    keep: noop('keep'), back: noop('back'), goHow: noop('goHow'), howFromPlay: noop('howFromPlay'), startFree: noop('startFree'),
    signOut: noop('signOut'), setDemoView: noop('setDemoView'), play: noop('play'), playReq: noop('playReq'), closePlay: noop('closePlay'),
    getPass: noop('getPass'), accountMade: noop('accountMade'), afterCheckout: noop('afterCheckout'), signedIn: noop('signedIn'), paid: noop('paid'),
    deleteAccount: noop('deleteAccount'),
  };
};

// Mounts children under the context in a canon-shaped .gs-root; measures width like main.jsx does.
const PgApp = ({ posture, route, children, onNav }) => {
  const [width, setWidth] = React.useState(390);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current && ref.current.querySelector('.gs-root'); if (!el || !window.ResizeObserver) return undefined;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width)); ro.observe(el); return () => ro.disconnect();
  }, []);
  const gs = pgMakeGs({ posture, route, width, log: onNav });
  return (
    <GsCtx.Provider value={gs}>
      <div ref={ref} style={{ display: 'contents' }}>
        <div className="gs-root">
          {route.name !== 'none' && <GsTopBar />}
          {children}
          <GsFooter />
          <div id="gs-announce" className="gs-vh" role="status" aria-live="polite"></div>
        </div>
      </div>
    </GsCtx.Provider>
  );
};

// ---- the frames: 5A, 5B, 5C (modules pg-landing-*.jsx). Posture is always free (Joe's free line, staged in pg-landing-lib / hub). ----
const PG_FRAMES = {
  '5a': { id: '5A', name: 'Library as landing', note: 'Signed-in players land on Library: a Today group of the free dailies, then Your games saying state only (5.2-A, now core, not only O5), then a link to Discover.',
    route: { name: 'library' }, node: () => <PgLanding5A /> },
  '5b': { id: '5B', name: 'The games hub', note: 'Discover recomposed: search and chips first, each game once in a 2-up grid under Every day / Every week / In chapters, doors under each tile, no lock anywhere. Same data state as 5A: doors follow what is played. Marks: "Every ..." doors [Q-G5]; "Play the first scene" [Q-G3] [Q-G13]. Games with no free part (Daily Groups, 36,000 Summers Ago) not shown.',
    ds: 'DS change, faked: tile doors (a play door where something is unplayed, and an "Every ..." door, under the GameTile).', route: { name: 'games' }, node: () => <PgLanding5B /> },
  '5c': { id: '5C', name: 'Discover, tidied', note: 'Today\u2019s Discover with only the tidy of 6.1-C: search and chips moved above the rows, each game once on the first screen (picks, then Just added and Free to play without repeats), the Pass band a plain text link. Everything else is canon\u2019s Discover, same data state as 5A.',
    ds: 'Band note (B3.2): in the real product this link would stay hidden until today\u2019s free thing is done; shown here so the link form can be judged. Fixtures, not canon: The Drowned Light and its cover.', route: { name: 'games' }, node: () => <PgLanding5C /> },
  '5c-n': { id: '5C-N', name: 'Discover tidied, every first part played', note: 'The 3.3-A note, once ever: every free first part is done (Word and Mystery today, Escape room 1, Casebook case 1, Delve scene 1 [noun], Barrow chapter 1, Drowned Light chapter 1), so the "Free to play" row is replaced by a note built on the notification banner\u2019s dismiss pattern. "Everything else" links to the Pass page; "Got it" retires it (B3.5). Rest as 5C.',
    ds: 'Faked: the note reuses canon\u2019s .gs-pushask banner markup inside the page. Part-free cards carry no tag (1.3-A). Fixtures, not canon: The Drowned Light (a second chaptered campaign, chapter 1 free) and its cover.', route: { name: 'games' }, node: () => <PgLanding5C allDone /> },
};
const PgFrame = ({ id, posture, onNav }) => {
  const f = PG_FRAMES[id];
  return <PgApp key={id + posture} posture={posture} route={f.route} onNav={onNav}>{f.node()}</PgApp>;
};

// A 390-wide phone-ish viewport using canon's own scroll/containing-block classes. full => exactly 390x844, no rounding.
const PgPhone = ({ children, full }) => (
  <div className="kit-phone-clip" style={{ width: 390, height: full ? 844 : 780, borderRadius: full ? 0 : 24, flex: 'none', border: full ? 0 : '1px solid #444' }}>
    <div className="kit-phone-screen">{children}</div>
  </div>
);

const PgRig = () => {
  const q = new URLSearchParams(location.search);
  const forced = q.get('frame');
  const [ab, setAb] = React.useState('both');
  const [log, setLog] = React.useState([]);
  const onNav = (s) => setLog((l) => [s, ...l].slice(0, 5));
  if (forced && PG_FRAMES[forced.toLowerCase()]) {   // capture mode: the frame alone, full-bleed 390x844, no chrome
    document.body.style.margin = '0';
    return <PgPhone full><PgFrame id={forced.toLowerCase()} posture="free" /></PgPhone>;
  }
  const tab = (v, l) => <button key={v} type="button" aria-pressed={ab === v} onClick={() => setAb(v)} className="pg-tab">{l}</button>;
  const ids = Object.keys(PG_FRAMES);
  const shown = ab === 'both' ? ids : [ab];
  return (
    <div className="pg-shell">
      <div className="pg-bar" role="group" aria-label="Playground controls, not part of the product">
        <b>Rig 5 landing</b>
        {tab('both', 'Both')}{ids.map((i) => tab(i, PG_FRAMES[i].id))}
        <span className="pg-sep" />
        {ids.map((i) => <a key={i} href={'?frame=' + i} className="pg-link">{PG_FRAMES[i].id} full-bleed</a>)}
      </div>
      <p className="pg-stage"><b>Staged on Joe's free line (2026-10-14), not the prototype's:</b> posture is a signed-in free player. Free dailies are Daily Word and Daily Mystery only (Daily Groups hidden). Escape, Casebook and Delve: edition 1 free. Barrow and The Drowned Light (a fixture, not canon): chapter 1 free. The Lantern Keepers (fixture, not canon) has no free part. Every state shown is fake data. 5A and 5B carry no Pass line; 5C keeps one text link, as the tidy specifies.</p>
      <div className="pg-row">
        {shown.map((id) => (
          <div key={id} className="pg-col">
            <div className="pg-cap"><b>{PG_FRAMES[id].id} · {PG_FRAMES[id].name}</b><br />{PG_FRAMES[id].note}{PG_FRAMES[id].ds && <><br /><i>{PG_FRAMES[id].ds}</i></>}</div>
            <PgPhone><PgFrame id={id} posture="free" onNav={onNav} /></PgPhone>
          </div>
        ))}
      </div>
      <div className="pg-log">canon callbacks (stubbed, nothing navigates): {log.length ? log.join('  ·  ') : 'tap something'}</div>
    </div>
  );
};

// Rig chrome styles: pg- prefix, tooling look (dark strip), never product.
const pgStyle = document.createElement('style');
pgStyle.textContent = `
  .pg-shell { min-height: 100vh; background: #1c1c1a; color: #eee; font: 13px/1.4 system-ui, sans-serif; padding-bottom: 24px; }
  .pg-bar { position: sticky; top: 0; z-index: 50; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; padding: 8px 12px; background: #111; border-bottom: 1px solid #333; }
  .pg-tab { background: #2a2a27; color: #ddd; border: 1px solid #444; border-radius: 6px; padding: 6px 10px; min-height: 32px; cursor: pointer; font: inherit; }
  .pg-tab[aria-pressed="true"] { background: #FF2EC4; color: #000; border-color: #FF2EC4; }
  .pg-sep { width: 1px; height: 20px; background: #444; margin: 0 4px; }
  .pg-link { color: #9cf; margin-left: 4px; }
  .pg-row { display: flex; flex-wrap: wrap; gap: 24px; justify-content: center; padding: 16px; }
  .pg-col { display: grid; gap: 8px; justify-items: center; }
  .pg-cap { color: #bbb; max-width: 390px; text-align: center; }
  .pg-stage { max-width: 840px; margin: 12px auto 0; padding: 0 16px; color: #bbb; }
  .pg-log { padding: 0 16px; color: #999; text-align: center; }`;
document.head.appendChild(pgStyle);

ReactDOM.createRoot(document.getElementById('root')).render(<PgRig />);
