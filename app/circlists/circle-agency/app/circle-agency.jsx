// ============================================================================
// Circle agency candidate (proposal pictures, unratified). Three stories:
//   S1  delete a circle you are alone in
//   S2  a champion leaves a circle that has other members (two doors / one door)
//   S3  hand a circle on to a member
// Hooks into app/spaces.jsx through window.CircAgency (champion slot, roster
// marker, member-menu items, sheets), and into the router through
// window.CircPricing.renderRoute (the recipient's accept screen). Mounts the
// existing components: PppOverlay (sheet on phone, modal on desktop), the invite
// link box, the take-over screen's markup. Everything here is a picture of a
// proposal: copy and design are proposals, not decisions. Loads after
// pricing-main.jsx, before main.jsx.
// ============================================================================
const CA_GROUP = 'Circle agency (proposal)';
const caApi = () => (window.__pppApi || null);
const caFirst = (name) => (String(name || '').includes(' ') ? String(name).split(' ')[0] : String(name || ''));
const caKey = (space, name) => space.id + '|' + name;

window.CircAgency = (() => {
  const DEFAULT = { variant: 'a', sheet: null, target: null, offers: {}, pointing: false, reveal: null, menu: null, copied: false };
  let st = { ...DEFAULT };
  const subs = new Set();
  return {
    get: () => st,
    set(p) { st = { ...st, ...p }; subs.forEach((f) => f()); },
    reset(p) { st = { ...DEFAULT, offers: {}, ...(p || {}) }; subs.forEach((f) => f()); },
    subscribe(f) { subs.add(f); return () => subs.delete(f); },
  };
})();
const useCa = () => {
  const [, tick] = React.useReducer((n) => n + 1, 0);
  React.useEffect(() => window.CircAgency.subscribe(tick), []);
  return window.CircAgency.get();
};

// ---- Member menu + roster marker ---------------------------------------------
const CaMenuItem = ({ icon, children, onClick }) => (
  <button role="menuitem" className="circ-menuitem" onClick={onClick}
    style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
      background: 'transparent', border: 0, cursor: 'pointer', padding: '9px 10px', minHeight: 40,
      borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14,
      color: 'var(--color-fg-1)', whiteSpace: 'nowrap' }}>
    <Icon name={icon} size={16} /> {children}
  </button>
);
window.CircAgency.menuItems = (space, m, close) => {
  const CA = window.CircAgency; const st = CA.get();
  if (st.offers[caKey(space, m.name)]) {
    return <CaMenuItem icon="x" onClick={() => { close(); CA.set({ offers: { ...st.offers, [caKey(space, m.name)]: false } }); }}>Withdraw offer</CaMenuItem>;
  }
  return <CaMenuItem icon="crown" onClick={() => { close(); CA.set({ sheet: 'handon', target: m.name, pointing: false }); }}>Hand circle on</CaMenuItem>;
};
window.CircAgency.rowMarker = (space, m) => (window.CircAgency.get().offers[caKey(space, m.name)]
  ? <span className="ca-marker">Offered</span> : null);
window.CircAgency.rosterHint = () => (window.CircAgency.get().pointing
  ? <p className="ca-hint" role="status">Choose a member below. Open their menu and pick Hand circle on.</p> : null);

// ---- The champion's slot --------------------------------------------------------
const caPoint = () => {
  window.CircAgency.set({ sheet: null, pointing: true });
  setTimeout(() => { const r = document.querySelector('[data-ca-roster]'); if (r && r.scrollIntoView) r.scrollIntoView({ block: 'start', behavior: 'smooth' }); }, 30);
};
const CaSlot = ({ space }) => {
  const st = useCa(); const CA = window.CircAgency;
  const ref = React.useRef(null);
  const alone = space.members.length <= 1;
  React.useEffect(() => {
    if (st.reveal === 'slot' && ref.current) { ref.current.scrollIntoView({ block: 'center' }); CA.set({ reveal: null }); }
  });
  const line = alone ? <>You{'’'}re the only one here.</>
    : st.variant === 'a' ? <>You champion this circle. Hand it to a member, or leave and let it{' '}sleep.</>
    : <>You champion this circle.</>;
  return (
    <div ref={ref} className="ca-slot">
      <div className="ca-line">
        <span style={{ marginTop: 1, flexShrink: 0 }}><Icon name="crown" size={15} /></span>
        <span>{line}</span>
      </div>
      <div className={'ca-pair' + (alone || st.variant === 'b' ? ' ca-one' : '')}>
        {alone
          ? <Button variant="destructive-secondary" icon={<Icon name="trash" size={16} />} onClick={() => CA.set({ sheet: 'sole' })}>Delete this circle</Button>
          : <>
              {st.variant === 'a' && <Button variant="secondary" icon={<Icon name="crown" size={16} />} onClick={caPoint}>Hand it on</Button>}
              <Button variant="destructive-secondary" icon={<Icon name="logout" size={16} />} onClick={() => CA.set({ sheet: st.variant === 'a' ? 'leave-a' : 'leave-b' })}>Leave circle</Button>
            </>}
      </div>
    </div>
  );
};

// ---- Sheets (bottom sheet on a phone, centred modal on desktop) ------------------
// Actions: [{ label, variant, onClick, focus }]. Sheet: stacked, primary on top.
// Modal: a row, dismiss left and primary right; `stack` keeps them stacked.
const CaActions = ({ items, stack }) => {
  const api = caApi(); const sheet = api ? api.isSheet : true;
  const ref = React.useRef(null);
  const col = sheet || stack;
  const list = col ? items : items.slice().reverse();
  // A destructive confirm never lands focus on the destructive act: the dismiss holds it.
  const at = list.findIndex((a) => a.focus);
  React.useEffect(() => {
    const t = setTimeout(() => { const b = ref.current && ref.current.querySelectorAll('button')[at]; if (b && at >= 0) b.focus({ preventScroll: true }); }, 90);
    return () => clearTimeout(t);
  }, []);
  return (
    <div ref={ref} className={col ? 'ppp-actions-stack' : 'ppp-actions-row'}>
      {list.map((a) => <Button key={a.label} variant={a.variant || 'secondary'} full={col} onClick={a.onClick}>{a.label}</Button>)}
    </div>
  );
};

const CaSheets = ({ space }) => {
  const st = useCa(); const CA = window.CircAgency; const api = caApi();
  const Overlay = window.PppOverlay;
  if (!st.sheet || !api || !Overlay) return null;
  const close = () => CA.set({ sheet: null });
  const name = space.name;
  const gone = () => { api.setSpaces((prev) => prev.filter((s) => s.id !== space.id)); CA.set({ sheet: null }); api.goHome(); };

  if (st.sheet === 'sole') {
    return (
      <Overlay title={'Delete ' + name + '?'} onClose={close}>
        <p className="ppp-overlay-body ca-body">The circle and everything in it are gone for good. This can{'\u2019'}t be{'\u00a0'}undone.</p>
        <CaActions items={[
          { label: 'Delete ' + name, variant: 'destructive', onClick: gone },
          { label: 'Keep it', focus: true, onClick: close }]} />
      </Overlay>
    );
  }
  if (st.sheet === 'leave-a' || st.sheet === 'leave-b') {
    const b = st.sheet === 'leave-b';
    const items = [{ label: 'Leave and let it sleep', variant: 'destructive', onClick: gone }];
    if (b) items.push({ label: 'Hand it to a member instead', onClick: caPoint });
    items.push({ label: 'Stay', focus: true, onClick: close });
    return (
      <Overlay title={'Leave ' + name + '?'} onClose={close}>
        <p className="ppp-overlay-body ca-body">
          It goes to sleep until a member takes it over. Anyone who subscribes can take it over in one{'\u00a0'}step. You can rejoin only if{'\u00a0'}invited.
        </p>
        <CaActions items={items} stack={b} />
      </Overlay>
    );
  }
  const first = caFirst(st.target);
  const member = space.members.find((m) => m.name === st.target) || { name: st.target };
  if (st.sheet === 'handon') {
    return (
      <Overlay title={'Hand ' + name + ' to ' + first + '?'} onClose={close}>
        <div className="ca-points">
          <p>{first} becomes champion once they accept.</p>
          <p>Their subscription covers the circle.</p>
          <p>You stay a member.</p>
          <p>You can withdraw the offer until they accept.</p>
        </div>
        <CaActions items={[
          { label: 'Create hand-on link', variant: 'primary', onClick: () => CA.set({ sheet: 'handon-link', offers: { ...st.offers, [caKey(space, st.target)]: true } }) },
          { label: 'Cancel', onClick: close }]} />
      </Overlay>
    );
  }
  if (st.sheet === 'handon-link') {
    const tok = (typeof inviteToken === 'function') ? inviteToken(member.email || st.target, space.id) : 'x7k2-m9pq';
    const url = 'https://circlists.com/hand-on/' + tok;
    const copy = async () => {
      try { await navigator.clipboard.writeText(url); } catch (e) {}
      CA.set({ copied: true });
      setTimeout(() => CA.set({ copied: false }), 2400);
    };
    return (
      <Overlay title={'Hand-on link for ' + first} onClose={close}>
        <div className="circ-invite-linkhead" style={{ marginTop: 0 }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-2)' }}>Hand-on link</span>
        </div>
        <button type="button" onClick={copy} title="Copy link" className="circ-invite-box circ-invite-copy circ-glow">
          <span style={{ display: 'inline-flex', flexShrink: 0 }}><Icon name="link" size={15} color="var(--color-fg-3)" /></span>
          <span className="circ-invite-url">{url}</span>
          <span className="circ-invite-glyph"><Icon name={st.copied ? 'check' : 'copy'} size={16} /></span>
        </button>
        <p className="ca-note">Send it to {first} yourself. It works only for them, for 30{' '}days.</p>
        <CaActions items={[
          { label: st.copied ? 'Link copied' : 'Copy link', variant: 'primary', onClick: copy },
          { label: 'Done', onClick: close }]} />
        <span className="circ-vh" role="status" aria-live="polite">{st.copied ? 'Link copied.' : ''}</span>
      </Overlay>
    );
  }
  return null;
};

Object.assign(window.CircAgency, { Slot: CaSlot, Sheets: CaSheets });

// ---- The recipient's screen: opening a hand-on link --------------------------------
const CaAccept = () => {
  const st = usePPP(); const api = caApi();
  const space = api && api.space;
  if (!api || !space) return null;
  const subscribed = pppSubscribed(st);
  const from = space.champion && space.champion !== 'You' ? space.champion : 'Joe M.';
  const take = () => {
    if (subscribed) {
      api.setSpaces((prev) => prev.map((s) => (s.id === space.id ? { ...s, champion: 'You', championEmail: api.user.email } : s)));
      api.enterSpace(space.id);
      return;
    }
    window.CircPPP.set({ ctx: { from: 'takeover', spaceId: space.id, name: space.name } });
    api.setRoute('subscribe');
  };
  const SupportLine = window.SupportLine;
  return (
    <main className="circ-dormant ca-accept">
      <div className="circ-dormant-mid">
        <div className="circ-dormant-col">
          <h1 className="circ-dormant-title">{from} is handing {space.name}{' '}to{' '}you.</h1>
          <p className="circ-dormant-body">
            <span className="ca-line-block"><PppS>You champion it, and can invite, remove and{' '}rename.</PppS></span>
            <span className="ca-line-block"><PppS>{subscribed ? 'Your subscription covers it, so it costs nothing more.' : 'A subscription of your own covers it.'}</PppS></span>
          </p>
          <div className="circ-dormant-actions">
            <Button variant="secondary" size="lg" full onClick={() => api.enterSpace(space.id)}>Not now</Button>
            <Button variant="primary" size="lg" full onClick={take}>{subscribed ? 'Take on ' + space.name : 'Start your free month and take it on'}</Button>
          </div>
          {!subscribed && <p className="circ-dormant-cap"><PppS>Your first month is free, then {'£'}3 a month or {'£'}30 a{' '}year.</PppS> <PppS>One subscription covers every circle you{' '}champion.</PppS></p>}
        </div>
      </div>
      {SupportLine && <div className="circ-dormant-foot"><SupportLine /></div>}
    </main>
  );
};
const caRender = window.CircPricing.renderRoute.bind(window.CircPricing);
window.CircPricing.renderRoute = (route) => (route === 'ca-accept'
  ? { shell: true, body: <CaAccept />, opts: { showMembers: false } }
  : caRender(route));

// ---- Staged states ----------------------------------------------------------------
const caChampionBook = (list) => list.map((s) => (s.id === 'sp-book'
  ? { ...s, champion: 'You', championEmail: window.CircSeed.DEFAULT_USER.email } : s));
const caSole = (list) => {
  const email = window.CircSeed.DEFAULT_USER.email;
  const sam = list.find((s) => s.id === 'sp-sam');
  const shelf = { ...sam, id: 'sp-shelf', name: 'Reading Shelf', description: '', champion: 'You', championEmail: email,
    members: [window.CircSeed.M('You', email)], items: sam.items.slice(1) };
  return [shelf, ...list.filter((s) => s.id !== 'sp-sam')];
};
const caHandBook = (list) => list.map((s) => (s.id === 'sp-book'
  ? { ...s, champion: 'Priya N.', championEmail: 'priya.n@example.com' } : s));
const caAsleep = (list) => list.map((s) => (s.id === 'sp-book'
  ? { ...s, funded: false, dormancy: 'terminal', funding: null, championLeft: true, champion: null, championEmail: null, members: s.members.filter((m) => m.name !== 'Joe M.') } : s));
const CA_SUB = { status: 'none', usedFreeMonth: false };
const CA_PEND = { 'sp-book|Priya N.': true };
const CA_STATE_DEFS = [
  ['ca-sole', 'Delete: circle settings, champion alone in the circle', { spaces: caSole, current: 'sp-shelf', route: 'members', ca: { reveal: 'slot' } }],
  ['ca-sole-confirm', 'Delete: confirm sheet', { spaces: caSole, current: 'sp-shelf', route: 'members', ca: { sheet: 'sole' } }],
  ['ca-leave-a', 'Champion leaves, option A: two doors', { spaces: caChampionBook, current: 'sp-book', route: 'members', ca: { variant: 'a', reveal: 'slot' } }],
  ['ca-leave-b', 'Champion leaves, option B: one door', { spaces: caChampionBook, current: 'sp-book', route: 'members', ca: { variant: 'b', reveal: 'slot' } }],
  ['ca-leave-confirm-a', 'Champion leaves, option A: confirm sheet', { spaces: caChampionBook, current: 'sp-book', route: 'members', ca: { variant: 'a', sheet: 'leave-a' } }],
  ['ca-leave-confirm-b', 'Champion leaves, option B: confirm sheet', { spaces: caChampionBook, current: 'sp-book', route: 'members', ca: { variant: 'b', sheet: 'leave-b' } }],
  ['ca-asleep-after-leave', 'What the members see after the champion leaves', { spaces: caAsleep, current: 'sp-book' }],
  ['ca-handon-menu', 'Hand on: member menu open', { spaces: caChampionBook, current: 'sp-book', route: 'members', ca: { menu: 'Priya N.' } }],
  ['ca-handon-sheet', 'Hand on: confirm sheet', { spaces: caChampionBook, current: 'sp-book', route: 'members', ca: { sheet: 'handon', target: 'Priya N.' } }],
  ['ca-handon-link', 'Hand on: link made', { spaces: caChampionBook, current: 'sp-book', route: 'members', ca: { sheet: 'handon-link', target: 'Priya N.', offers: CA_PEND } }],
  ['ca-handon-pending', 'Hand on: offered, waiting to be accepted', { spaces: caChampionBook, current: 'sp-book', route: 'members', ca: { offers: CA_PEND, menu: 'Priya N.' } }],
  ['ca-accept-subscribed', 'Hand on, recipient opens the link: subscribed', { store: {}, current: 'sp-book', route: 'ca-accept' }],
  ['ca-accept-unsubscribed', 'Hand on, recipient opens the link: not subscribed', { store: CA_SUB, current: 'sp-book', route: 'ca-accept' }],
  ['ca-handon-done', 'Hand on: accepted, your view as an ordinary member', { spaces: caHandBook, current: 'sp-book', route: 'members', ca: { menu: 'You' } }],
];
const caStage = (api, def) => {
  const { seedSpaces, DEFAULT_USER } = window.CircSeed;
  try { localStorage.removeItem(api.STATE_KEY); } catch (e) {}
  let list = seedSpaces(DEFAULT_USER.email).filter((s) => !/^TEST\b/i.test(s.name || ''));
  if (def.spaces) list = def.spaces(list);
  window.CircPPP.reset(def.store || {});
  window.CircAgency.reset(def.ca && { ...def.ca, menu: null });
  api.setUser(DEFAULT_USER); api.setSpaces(list);
  api.setLoadingFeed(false); api.setHoldLoading(false);
  if (api.setHomeStripOpen) api.setHomeStripOpen(false);
  api.setTab('active');
  api.setCurrentId(def.current || null); api.setRoute(def.route || 'space');
  if (def.ca && def.ca.menu) setTimeout(() => window.CircAgency.set({ menu: def.ca.menu }), 160);
};
const CA_STATES = CA_STATE_DEFS.map(([id, label, def]) => ({ id, label, def }));
const CA_IDS = CA_STATES.map((s) => s.id);
window.__caGo = (id) => { const s = CA_STATES.find((x) => x.id === id); if (s && window.__caStatesApi) caStage(window.__caStatesApi, s.def); };
const caBuild = window.buildStates;
window.buildStates = (api) => {
  window.__caStatesApi = api;
  const r = caBuild(api);
  const mine = CA_STATES.map((s) => ({ id: s.id, label: s.label, group: CA_GROUP, go: () => caStage(api, s.def) }));
  mine.forEach((m) => { r.byId[m.id] = m; });
  r.groups = [{ title: CA_GROUP, notes: ['Unratified proposal pictures. Per-person world: the champion has a subscription; funding is not in circle settings.'], items: mine }, ...r.groups];
  return r;
};
const caResolve = window.circResolveState;
window.circResolveState = () => {
  let name = '';
  try { name = (new URLSearchParams(window.location.search).get('state') || '').trim().toLowerCase(); } catch (e) {}
  return CA_IDS.includes(name) ? { kind: 'state', id: name } : caResolve();
};

// ---- Config: the champion's exit, two options ------------------------------------
const CaConfig = () => {
  const st = useCa(); const CA = window.CircAgency;
  const Prev = window.__caPrevConfig;
  return (
    <div>
      {Prev ? <Prev /> : null}
      <div className="circ-config-eyebrow">Circle agency (proposal)</div>
      <div className="circ-config-row">
        <span className="circ-config-row-label">Champion leaving</span>
        <div className="circ-config-seg" role="radiogroup" aria-label="Champion leaving">
          {[['a', 'Two doors'], ['b', 'One door']].map(([v, t]) => (
            <button key={v} type="button" role="radio" aria-checked={v === st.variant} className="circ-config-seg-btn"
              data-active={v === st.variant ? '1' : undefined} onClick={() => CA.set({ variant: v })}>{t}</button>
          ))}
        </div>
      </div>
    </div>
  );
};
window.__caPrevConfig = window.ConfigExtra;
window.ConfigExtra = CaConfig;
