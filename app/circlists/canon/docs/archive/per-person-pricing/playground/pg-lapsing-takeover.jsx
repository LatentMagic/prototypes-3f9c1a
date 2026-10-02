// ============================================================================
// Playground: taking over and creating while your subscription is ending or a
// payment failed. Loads inside pg-lapsing-takeover-app.html (the candidate, whole)
// after the cand-ppp-* files and before app/main.jsx. It re-publishes three
// candidate surfaces per option: the sleeping circle (window.DormantSpace), the
// create lede (CircPricing.createLede) and the create form's foot
// (CircPricing.createFoot, an absent-by-default hook in app/spaces.jsx). The
// header in pg-lapsing-takeover.html drives it through window.PgLto.go.
// ============================================================================
const PG_LTO_KEY = 'pg_lto_v1';
const PG_LTO_NB = '\u00a0';
// The ending date in the brief is 28 Oct (today + 26). The Account card reads the
// same constant, so both say one date.
try { PPP_RENEW_DAYS = 26; } catch (e) {}
const pgLtoSaved = () => {
  const d = { opt: 1, st: 'ending', scene: 'circle', vp: 'auto' };
  try { return { ...d, ...JSON.parse(localStorage.getItem(PG_LTO_KEY) || '{}') }; } catch (e) { return d; }
};
window.PgLto = (() => {
  let s = { ...pgLtoSaved(), fixed: null, cardReturn: null, noteDone: false, sheet: false };
  const subs = new Set();
  return {
    get: () => s,
    set(p) { s = { ...s, ...p }; subs.forEach((f) => f()); },
    subscribe(f) { subs.add(f); return () => subs.delete(f); },
  };
})();
const usePgLto = () => {
  const [, tick] = React.useReducer((n) => n + 1, 0);
  React.useEffect(() => window.PgLto.subscribe(tick), []);
  return window.PgLto.get();
};
const pgLtoDay = (n, short) => new Date(Date.now() + n * 864e5).toLocaleDateString('en-GB', { day: 'numeric', month: short ? 'short' : 'long' });
const pgLtoDates = () => {
  let n = 18; try { n = PPP_RENEW_DAYS; } catch (e) {}
  return { end: pgLtoDay(n), endShort: pgLtoDay(n, true), fix: pgLtoDay(30), fixShort: pgLtoDay(30, true) };
};
const pgLtoLapsing = (st) => st.status === 'ending' || st.status === 'failed';

// ---- seed: Priya, and Sunday Long Reads asleep with 6 members -------------
const PG_LTO_USER = { firstName: 'Priya', lastName: 'Nair', name: 'You', email: 'priya.n@example.com' };
const pgLtoAsMe = (list) => list.map((sp) => ({
  ...sp,
  championEmail: sp.champion === 'You' ? PG_LTO_USER.email : sp.championEmail,
  members: (sp.members || []).filter((m) => m.name !== 'Priya N.').map((m) => (m.name === 'You' ? { ...m, email: PG_LTO_USER.email } : m)),
  items: (sp.items || []).map((it) => {
    const rs = it.reactions || [];
    const mine = rs.some((r) => r.name === 'You');
    return { ...it,
      attribution: it.attribution === 'Added by Priya N.' ? 'Added by you' : it.attribution,
      reactions: mine ? rs.filter((r) => r.name !== 'Priya N.') : rs.map((r) => (r.name === 'Priya N.' ? { ...r, name: 'You' } : r)) };
  }),
}));
const pgLtoStage = () => {
  const api = window.__pppStatesApi; const p = pppApi();
  if (!api || !p) return false;
  const { seedSpaces, M } = window.CircSeed;
  const sel = window.PgLto.get();
  try { localStorage.removeItem(api.STATE_KEY); } catch (e) {}
  let list = pgLtoAsMe(seedSpaces(PG_LTO_USER.email).filter((s) => !/^TEST\b/i.test(s.name || '')));
  const book = list.find((s) => s.id === 'sp-book');
  list.push({
    id: 'sp-sunday', name: 'Sunday Long Reads',
    description: 'Long pieces for a slow Sunday: essays, profiles, and the occasional podcast worth the hour.',
    funded: false, dormancy: 'terminal', funding: null, champion: 'Ada L.', championEmail: 'ada.l@example.com',
    members: [M('You', PG_LTO_USER.email), M('Ada L.', 'ada.l@example.com'), M('Marcus T.', 'marcus.t@example.com'), M('Dev K.', 'dev.k@example.com'), M('Lena P.', 'lena.p@example.com'), M('Joe M.', 'joe.m@example.com')],
    items: (book ? book.items : []).map((it) => ({ ...it, id: it.id + '-sun' })),
  });
  window.CircPPP.reset({ status: sel.st === 'failed' ? 'failed' : 'ending', plan: 'monthly', usedFreeMonth: true });
  window.PgLto.set({ fixed: null, cardReturn: null, noteDone: false, sheet: false });
  api.setUser(PG_LTO_USER); api.setSpaces(list);
  api.setLoadingFeed(false); api.setHoldLoading(false);
  if (api.setHomeStripOpen) api.setHomeStripOpen(false);
  api.setTab('active');
  if (p.setLayout) p.setLayout(sel.vp === 'phone' ? 'mobile' : 'auto');
  if (sel.scene === 'create') {
    api.setCurrentId(null); api.setRoute('home');
    // The route presses New circle, as a member would.
    setTimeout(() => window.CircPricing.openCreate(), 80);
  } else { api.setCurrentId('sp-sunday'); api.setRoute('space'); }
  return true;
};
window.PgLto.go = (sel) => { window.PgLto.set(sel || {}); pgLtoStage(); };
(() => { const t = setInterval(() => { if (pgLtoStage()) clearInterval(t); }, 120); })();

// ---- shared acts: the candidate's own take-over, Resume and Update card ----
const pgLtoTakeOver = (space) => {
  const api = pppApi();
  api.setSpaces((prev) => prev.map((s) => (s.id === space.id
    ? { ...s, funded: true, dormancy: null, funding: null, openUntil: null, champion: 'You', championEmail: api.user.email } : s)));
  api.setTab('active'); api.enterSpace(space.id);
};
const pgLtoResume = () => window.CircPPP.set({ status: 'active' });
// Update card is the candidate's provider page. It returns to Account; from here it
// returns to where it was opened instead (see the bind wrapper below).
const pgLtoToCard = (ret) => { window.PgLto.set({ cardReturn: ret }); pppApi().setRoute('ppp-card'); };
const pgLtoCardBack = (api, ret) => {
  window.PgLto.set({ cardReturn: null });
  const saved = window.CircPPP.get().status !== 'failed';
  if (saved) window.PgLto.set({ fixed: 'card' });
  if (ret.to === 'create') { api.setRoute('create-space'); return; }
  const space = api.spaces.find((s) => s.id === ret.spaceId);
  if (saved && ret.takeOver && space) { pgLtoTakeOver(space); return; }
  api.setTab('active'); api.enterSpace(ret.spaceId);
};
const pgLtoBind = window.CircPricing.bind.bind(window.CircPricing);
window.CircPricing.bind = function (api) {
  pgLtoBind(api);
  const ret = window.PgLto.get().cardReturn;
  if (ret) window.__pppApi = { ...api, setRoute: (r) => (r === 'account' ? pgLtoCardBack(api, ret) : api.setRoute(r)) };
};

const pgLtoCell = (k, a, b, on) => (
  <div className={'ppp-ba-cell' + (on ? ' ppp-ba-on' : '')}>
    <div className="ppp-ba-k">{k}</div><div className="ppp-ba-plan">{a}</div><div className="ppp-ba-price">{b}</div>
  </div>
);
const PgLtoArrow = () => <span className="ppp-ba-arrow" aria-hidden="true"><Icon name="arrow-right" size={18} /></span>;

// ---- 2: the take-over sheet, after the tap ---------------------------------
const PgLtoTakeSheet = ({ space, failed, d }) => {
  const close = () => window.PgLto.set({ sheet: false });
  const n = (space.members || []).length;
  const acts = failed
    ? [{ label: 'Update payment card', variant: 'primary', onClick: () => { close(); pgLtoToCard({ to: 'circle', spaceId: space.id, takeOver: true }); } }]
    : [{ label: 'Resume and take over', variant: 'primary', onClick: () => { close(); pgLtoResume(); pgLtoTakeOver(space); } }];
  acts.push({ label: 'Cancel', variant: 'secondary', onClick: close });
  return (
    <PppOverlay title={failed ? 'Update your card to take over?' : 'Resume and take over?'} onClose={close} actions={acts}>
      <div className="ppp-ba">
        {failed ? pgLtoCell('Now', pppNb('Payment failed'), pppNb('Fix by ' + d.fixShort)) : pgLtoCell('Now', 'Monthly', pppNb('Ends ' + d.endShort))}
        <PgLtoArrow />
        {failed ? pgLtoCell(pppNb('Once updated'), 'Monthly', pppNb('£5 a month'), true) : pgLtoCell(pppNb('From today'), 'Monthly', pppNb('Renews ' + d.endShort), true)}
      </div>
      <p className="ppp-overlay-body ppp-cx-line">{space.name} wakes for all {n} members, with you as its{PG_LTO_NB}champion.</p>
    </PppOverlay>
  );
};

// ---- the sleeping circle, per option ---------------------------------------
// One sentence per line where they fit (the candidate's .ppp-lede-ph precedent): a
// sentence never strands its last words past the full stop (ui-design.md, no overhanging line).
const PgLtoS = ({ children }) => <span className="pg-lto-s">{children}</span>;
const PgLtoBase = window.DormantSpace;
const PgLtoDormant = (props) => {
  const { space, dormancy, onLeave } = props;
  const st = usePPP(); const pg = usePgLto(); const api = pppApi();
  if (dormancy === 'suspended' || !api || !space || space.champion === 'You') return <PgLtoBase {...props} />;
  const lapsing = pgLtoLapsing(st);
  if (!lapsing && !pg.fixed) return <PgLtoBase {...props} />;
  const d = pgLtoDates(); const failed = st.status === 'failed';
  const take = () => pgLtoTakeOver(space);
  let label = 'Take over this circle'; let act = take; let cap; let icon = null;
  if (!lapsing) {
    // 1, after Resume or a saved card: back on the circle, the take-over now open.
    cap = <><PgLtoS>{pg.fixed === 'card' ? 'Card updated.' : 'Subscription resumed.'}</PgLtoS> <PgLtoS>It covers this circle, so taking it over costs nothing{PG_LTO_NB}more.</PgLtoS></>;
  } else if (pg.opt === 1) {
    if (failed) {
      label = 'Update payment card'; icon = <Icon name="card" size={18} />;
      act = () => pgLtoToCard({ to: 'circle', spaceId: space.id });
      cap = <><PgLtoS>Your last payment didn{'\u2019'}t go through.</PgLtoS> <PgLtoS>Update the card, then take this circle{PG_LTO_NB}over.</PgLtoS></>;
    } else {
      label = 'Resume subscription';
      act = () => { window.PgLto.set({ fixed: 'resumed' }); pgLtoResume(); };
      cap = <><PgLtoS>Your subscription ends on {pppNb(d.end)}.</PgLtoS> <PgLtoS>Resume it, then take this circle{PG_LTO_NB}over.</PgLtoS></>;
    }
  } else if (pg.opt === 2) {
    act = () => window.PgLto.set({ sheet: true });
    cap = failed ? <>Taking it over starts with updating your payment{PG_LTO_NB}card.</>
      : <>Taking it over resumes your subscription, which ends on {pppNb(d.end)}.</>;
  } else {
    if (failed) {
      label = 'Update card and take over';
      act = () => pgLtoToCard({ to: 'circle', spaceId: space.id, takeOver: true });
      cap = <><PgLtoS>Your last payment didn{'\u2019'}t go through.</PgLtoS> <PgLtoS>Save a new card and this circle wakes, with you as its{PG_LTO_NB}champion.</PgLtoS></>;
    } else {
      label = 'Resume and take over';
      act = () => { pgLtoResume(); take(); };
      cap = <><PgLtoS>Your subscription ends on {pppNb(d.end)}.</PgLtoS> <PgLtoS>This resumes it at {pppNb('£5 a month')} and makes you this circle{'\u2019'}s{PG_LTO_NB}champion.</PgLtoS></>;
    }
  }
  const SupportLine = window.SupportLine;
  return (
    <main className="circ-dormant">
      <div className="circ-dormant-mid">
        <div className="circ-dormant-col">
          <h1 className="circ-dormant-title">This circle is asleep.</h1>
          <p className="circ-dormant-body"><PgLtoS>Its champion{'\u2019'}s subscription has{PG_LTO_NB}ended.</PgLtoS> <PgLtoS>Everything in it is still{PG_LTO_NB}here.</PgLtoS></p>
          <div className="circ-dormant-actions">
            {onLeave && <Button variant="destructive-secondary" size="lg" full onClick={onLeave}>Leave this circle</Button>}
            <Button variant="primary" size="lg" full icon={icon} onClick={act}>{label}</Button>
          </div>
          <p className="circ-dormant-cap">{cap}</p>
        </div>
      </div>
      {SupportLine && <div className="circ-dormant-foot"><SupportLine /></div>}
      {pg.opt === 2 && pg.sheet && lapsing && <PgLtoTakeSheet space={space} failed={failed} d={d} />}
    </main>
  );
};
window.DormantSpace = PgLtoDormant;

// ---- create: 1 under the lede ----------------------------------------------
const pgLtoLede = window.CircPricing.createLede;
window.CircPricing.createLede = (cap) => {
  const base = pgLtoLede(cap);
  const st = window.CircPPP.get();
  if (window.PgLto.get().opt !== 1 || !pgLtoLapsing(st)) return base;
  const d = pgLtoDates();
  return (
    <>{base}<span className="pg-lto-lede">{st.status === 'failed'
      ? <>Your last payment didn{'\u2019'}t go through. Update the card by {pppNb(d.fix)}, or this circle goes to sleep{PG_LTO_NB}then.</>
      : <>Your subscription ends on {pppNb(d.end)}. This circle goes to sleep then, unless you{PG_LTO_NB}resume.</>}</span></>
  );
};

// ---- create: 2 a note before the form --------------------------------------
const PgLtoCreateNote = () => {
  const st = usePPP(); const pg = usePgLto();
  const open = !pg.noteDone && pgLtoLapsing(st);
  // The form focuses its name field on mount; the note is in front, so it takes focus back.
  React.useEffect(() => {
    if (!open) return undefined;
    const t = setTimeout(() => { const b = document.querySelector('.ppp-scrim [role="dialog"] button'); if (b) b.focus(); }, 140);
    return () => clearTimeout(t);
  }, [open]);
  if (!open) return null;
  const failed = st.status === 'failed'; const d = pgLtoDates();
  const done = () => window.PgLto.set({ noteDone: true });
  return (
    <PppOverlay title={failed ? 'Your last payment didn\u2019t go through' : 'Your subscription is ending'} onClose={done} actions={[
      failed ? { label: 'Update payment card', variant: 'primary', onClick: () => { done(); pgLtoToCard({ to: 'create' }); } }
        : { label: 'Resume subscription', variant: 'primary', onClick: () => { done(); pgLtoResume(); } },
      { label: 'Not now', variant: 'secondary', onClick: done },
    ]}>
      <div className="ppp-ba">
        {pgLtoCell('Now', 'Monthly', failed ? pppNb('Payment failed') : pppNb('£5 a month'))}
        <PgLtoArrow />
        {pgLtoCell(pppNb('From ' + (failed ? d.fixShort : d.endShort)), 'Asleep', pppNb('Nothing charged'), true)}
      </div>
      <p className="ppp-overlay-body ppp-cx-line">A circle you create now goes to sleep then, with the rest. {failed ? 'Update the card to keep them' : 'Resume to keep them'}{PG_LTO_NB}awake.</p>
    </PppOverlay>
  );
};
const pgLtoRender = window.CircPricing.renderRoute.bind(window.CircPricing);
window.CircPricing.renderRoute = (route) => {
  const r = pgLtoRender(route);
  if (route === 'create-space' && r && r.body && window.PgLto.get().opt === 2) return { ...r, body: <>{r.body}<PgLtoCreateNote /></> };
  return r;
};

// ---- create: 3 beside the Create button ------------------------------------
const PgLtoCreateFoot = () => {
  const st = usePPP(); const pg = usePgLto();
  if (pg.opt !== 3) return null;
  if (!pgLtoLapsing(st)) return pg.fixed ? <p className="pg-lto-foot">{pg.fixed === 'card' ? 'Card updated.' : 'Subscription resumed.'}</p> : null;
  const failed = st.status === 'failed'; const d = pgLtoDates();
  // Leaving for the provider page carries what's typed, so it is there on return.
  const toCard = () => {
    const name = (document.querySelector('input[name="space-name"]') || {}).value || '';
    const description = (document.getElementById('space-description') || {}).value || '';
    const p = pppApi(); if (p.setFundFlow) p.setFundFlow({ mode: 'new', name, description, spaceId: null });
    pgLtoToCard({ to: 'create' });
  };
  return (
    <p className="pg-lto-foot">It goes to sleep on {pppNb(failed ? d.fix : d.end)} unless you{' '}
      <button type="button" className="circ-doorlink ppp-link44" onClick={failed ? toCard : () => { window.PgLto.set({ fixed: 'resumed' }); pgLtoResume(); }}>{failed ? 'update the\u00a0card' : 'resume your\u00a0subscription'}</button>.</p>
  );
};
window.CircPricing.createFoot = () => <PgLtoCreateFoot />;
