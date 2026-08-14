// ============================================================================
// App IA playground — the shell. Rail = the five directions. Heading = levers
// (Auto + override). One phone renders whichever combination is selected; the
// compare column stacks every option's bottom bar so evenness is judged
// side-by-side rather than from memory.
// ============================================================================

const { useState: pgaS, useEffect: pgaE } = React;
const {
  PG_IA_OPTIONS, PG_IA_LEVERS, PG_IA_DEFAULT_CFG, pgMergeCfg, PG_IA_CIRCLES, PG_IA_USER, PG_IA_FEED,
  PgPresent, usePgPresent, PgCirclesBody, PgAccountBody, PgAddBody, PgHomeBody, pgRow,
  PgTopBar, PgHomeTopBar, PgCircleHeader, PgBottomBar, PgFeed, PgTabs, pgBarSlots,
  Icon: PgaIcon, Avatar: PgaAvatar, displayName: pgaName,
} = window;

const PG_KEY = 'pg_appia_v2';
const pgLoad = () => { try { return JSON.parse(localStorage.getItem(PG_KEY)) || {}; } catch (e) { return {}; } };

// ---- Config control --------------------------------------------------------
const PgSeg = ({ label, value, opts, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    <span style={{ fontWeight: 600, fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-fg-3)' }}>{label}</span>
    <div style={{ display: 'flex', background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', padding: 2, gap: 2 }}>
      {opts.map(([v, l]) => (
        <button key={v} onClick={() => onChange(v)} style={{
          background: value === v ? 'var(--color-surface)' : 'transparent', border: 0, cursor: 'pointer',
          boxShadow: value === v ? 'var(--shadow-raised)' : 'none', borderRadius: 6, padding: '5px 9px',
          fontFamily: 'var(--font-sans)', fontWeight: value === v ? 600 : 500, fontSize: 12,
          color: value === v ? 'var(--color-fg-1)' : 'var(--color-fg-2)', whiteSpace: 'nowrap',
        }}>{l}</button>
      ))}
    </div>
  </div>
);

// ---- Circle settings stub (always a full-screen sub-view, as in the app) ----
const PgSettingsBody = ({ circle }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
    <div style={{ fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-fg-3)', padding: '0 4px 6px' }}>{circle.members} members</div>
    {['You', 'Sam R.', 'Priya N.', 'Marcus T.', 'Ada L.'].map((n) => (
      <div key={n} style={{ ...pgRow, cursor: 'default' }}><PgaAvatar name={n} size={30} accent={n === 'You'} /> {n}</div>
    ))}
    <div style={{ height: 1, background: 'var(--color-border-2)', margin: '10px 4px' }} />
    <button className="circ-appsheet-row" style={{ ...pgRow, fontWeight: 600, color: 'var(--color-accent)' }}>Invite people</button>
    <button className="circ-appsheet-row" style={pgRow}>Rename circle</button>
    <button className="circ-appsheet-row" style={pgRow}>Manage funding</button>
  </div>
);

// ---- The phone -------------------------------------------------------------
// Two levels, not one screen: HOME (account level) and CIRCLE (circle level).
// `cfg.home` decides whether home exists and how the circle relates to it —
// 'root' pushes the circle over home (no bar on home), 'slot' makes home a peer
// the permanent bar switches to, 'none' is 01–05: circle only.
const PgPhone = ({ cfg, option, circle, circles, onSelectCircle }) => {
  const [open, setOpen] = pgaS(null);   // 'circles' | 'account' | 'add' | 'settings' | null
  const [tab, setTab] = pgaS('active');
  const hasHome = cfg.home === 'root' || cfg.home === 'slot' || cfg.home === 'push';
  const [view, setView] = pgaS(hasHome ? 'home' : 'circle');
  const close = () => setOpen(null);
  // 'root' and 'push' both slide the circle over home; they differ only in where
  // the way back lives — top-bar control vs a slot in the circle's own bar.
  const push = cfg.home === 'root' || cfg.home === 'push';
  const goHome = () => setView('home');

  // The circle level slides in over home in 'root'; same choreography as a page.
  const { render: circRender, shown: circShown } = usePgPresent(push && view === 'circle', goHome);

  const onNav = (k) => {
    if (k === 'home') return setView('home');
    if (k === 'reading') { setView('circle'); return setOpen(null); }
    setOpen(k);
  };

  const active = open === 'circles' ? 'circles' : open === 'account' ? 'account'
    : (cfg.home === 'slot' && view === 'home') ? 'home' : 'reading';

  const circleScreen = (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-canvas)' }}>
      <PgTopBar circle={circle} variant={cfg.home === 'root' ? 'back' : cfg.entry === 'chip' ? 'chip' : 'plain'} gear={cfg.settings === 'top'}
        onBack={goHome} onChip={() => setOpen('circles')} onSettings={() => setOpen('settings')} />
      {(cfg.add === 'inline' || cfg.settings === 'inline') && (
        <PgCircleHeader circle={circle} showAdd={cfg.add === 'inline'} showSettings={cfg.settings === 'inline'}
          onAdd={() => setOpen('add')} onSettings={() => setOpen('settings')} />
      )}
      <PgTabs active={tab} onChange={setTab} />
      <PgFeed items={PG_IA_FEED} tab={tab} />
      <PgBottomBar cfg={cfg} view="circle" user={PG_IA_USER} active={active} circle={circle} onNav={onNav} />
    </div>
  );

  const homeScreen = (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', background: 'var(--color-canvas)' }}>
      <PgHomeTopBar user={PG_IA_USER} onAccount={() => setOpen('account')} />
      <PgHomeBody circles={circles} currentId={circle.id} showCurrent={cfg.home === 'slot'}
        onSelect={(id) => { onSelectCircle(id); setView('circle'); }} />
      <PgBottomBar cfg={cfg} view="home" user={PG_IA_USER} active={active} circle={circle} onNav={onNav} />
    </div>
  );

  return (
    <div className="pg-phone">
      <div className="pg-phone-clip">
        <div className="pg-phone-screen">
          {!hasHome ? circleScreen : push ? homeScreen : (view === 'home' ? homeScreen : circleScreen)}
        </div>

        {push && circRender && (
          <div className="pg-phone-layer" style={{
            position: 'absolute', inset: 0, zIndex: 60, background: 'var(--color-canvas)',
            overflowY: 'auto', overscrollBehavior: 'contain', boxShadow: 'var(--shadow-overlay)',
            transform: circShown ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform var(--duration-slow) var(--ease-quiet)',
          }}>{circleScreen}</div>
        )}

        <PgPresent open={open === 'circles'} onClose={close} mode={cfg.circles} head={cfg.sheetHead} title="Circles">
          <PgCirclesBody circles={circles} currentId={circle.id} withEyebrow={cfg.sheetHead !== 'title' && cfg.circles !== 'page' && cfg.circles !== 'chipmenu'}
            showSettings={cfg.settings === 'insheet'} onSettings={() => setOpen('settings')}
            onSelect={(id) => { onSelectCircle(id); close(); }} />
        </PgPresent>

        <PgPresent open={open === 'account'} onClose={close} mode={cfg.account} head={cfg.sheetHead} title="Account">
          <PgAccountBody user={PG_IA_USER} />
        </PgPresent>

        <PgPresent open={open === 'add'} onClose={close} mode="sheet" head="grab" title="Add a link">
          <PgAddBody circleName={circle.name} scopeHint={cfg.scopeHint} />
        </PgPresent>

        <PgPresent open={open === 'settings'} onClose={close} mode="page" title={cfg.settings === 'circle' ? circle.name : 'Circle settings'}>
          <PgSettingsBody circle={circle} />
        </PgPresent>
      </div>
    </div>
  );
};

// ---- Bar comparison column -------------------------------------------------
const PgBarCompare = ({ ov, activeId, onPick }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div style={{ fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-fg-3)' }}>Bars, side by side</div>
    <div style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--color-fg-3)', marginTop: -6 }}>Each bar as it appears inside a circle. 06 shows none on home; 07 shows this one everywhere.</div>
    {PG_IA_OPTIONS.map((o) => {
      const c = pgMergeCfg(o, ov);
      const on = o.id === activeId;
      return (
        // A div, not a button: the card contains a live preview bar made of
        // buttons, and button-in-button is invalid DOM.
        <div key={o.id} role="button" tabIndex={0} aria-pressed={on} onClick={() => onPick(o.id)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(o.id); } }} style={{
            background: 'var(--color-surface)', border: on ? '1px solid var(--color-accent)' : '1px solid var(--color-border-1)',
            borderRadius: 'var(--radius-lg)', padding: '10px 10px 0', cursor: 'pointer', textAlign: 'left',
            boxShadow: on ? '0 0 0 3px var(--color-accent-ring)' : 'var(--shadow-raised)', overflow: 'hidden',
          }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-fg-3)' }}>{o.n}</span>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{o.name}</span>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-fg-3)' }}>{pgBarSlots(c, 'circle').length} slots</span>
          </div>
          <div style={{ pointerEvents: 'none', width: 340, maxWidth: '100%', paddingTop: c.add === 'dock' ? 20 : 0 }}>
            <PgBottomBar cfg={c} view="circle" user={PG_IA_USER} active={c.home === 'slot' ? 'home' : 'reading'} onNav={() => {}} preview />
          </div>
        </div>
      );
    })}
  </div>
);

// ---- App -------------------------------------------------------------------
const PgApp = () => {
  const saved = pgLoad();
  const [optId, setOptId] = pgaS(saved.optId || 'homebar');
  const [ov, setOv] = pgaS(Object.assign({}, PG_IA_DEFAULT_CFG, saved.ov || {}));
  const [circleId, setCircleId] = pgaS(saved.circleId || PG_IA_CIRCLES[0].id);
  const [compare, setCompare] = pgaS(saved.compare !== false);

  pgaE(() => {
    try { localStorage.setItem(PG_KEY, JSON.stringify({ optId, ov, circleId, compare })); } catch (e) {}
  }, [optId, ov, circleId, compare]);

  const option = PG_IA_OPTIONS.find((o) => o.id === optId) || PG_IA_OPTIONS[0];
  const cfg = pgMergeCfg(option, ov);
  const circle = PG_IA_CIRCLES.find((c) => c.id === circleId) || PG_IA_CIRCLES[0];
  const dirty = Object.keys(PG_IA_DEFAULT_CFG).some((k) => ov[k] !== 'auto');

  return (
    <div className="pg-page">
      <aside className="pg-rail">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px 14px' }}>
          <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em' }}>App IA</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-fg-3)' }}>8 directions</span>
        </div>
        <p style={{ margin: '0 4px 14px', fontSize: 12.5, lineHeight: 1.5, color: 'var(--color-fg-2)' }}>
          Add and circle settings are <strong style={{ fontWeight: 600 }}>circle-local</strong>; Circles and Account are global. A bar holding both mixes scopes.
        </p>
        <p style={{ margin: '0 4px 16px', fontSize: 12.5, lineHeight: 1.5, color: 'var(--color-fg-2)' }}>
          01–05 clarify the mix. <strong style={{ fontWeight: 600 }}>06–08 remove it</strong>: a home screen takes the global destinations, so every slot left is the circle's. 08 goes furthest — the bar is never rendered outside a circle, so the bar itself carries the scope.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PG_IA_OPTIONS.map((o) => {
            const on = o.id === optId;
            return (
              <React.Fragment key={o.id}>
              {o.n === '06' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 4px 2px' }}>
                  <span style={{ fontWeight: 600, fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-fg-3)' }}>With a home screen</span>
                  <span style={{ flex: 1, height: 1, background: 'var(--color-border-1)' }} />
                </div>
              )}
              <button onClick={() => setOptId(o.id)} className="pg-railitem" style={{
                background: on ? 'var(--color-surface)' : 'transparent', borderLeft: on ? '2px solid var(--color-accent)' : '2px solid transparent',
                boxShadow: on ? 'var(--shadow-raised)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: on ? 'var(--color-accent)' : 'var(--color-fg-3)' }}>{o.n}</span>
                  <span style={{ fontWeight: 600, fontSize: 13.5 }}>{o.name}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.45, color: 'var(--color-fg-2)', marginTop: 5 }}>{o.ia}</div>
                {on && (
                  <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--color-fg-1)' }}>{o.claim}</div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--color-fg-3)' }}>Trade-off: {o.cost}</div>
                  </div>
                )}
              </button>
              </React.Fragment>
            );
          })}
        </div>
      </aside>

      <div className="pg-main">
        <div className="pg-head">
          <div className="pg-levers">
            {PG_IA_LEVERS.filter((l) => l.group === 'ia').map((l) => (
              <PgSeg key={l.key} label={l.label} value={ov[l.key]} opts={l.opts} onChange={(v) => setOv({ ...ov, [l.key]: v })} />
            ))}
            <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--color-border-1)', margin: '0 2px' }} />
            {PG_IA_LEVERS.filter((l) => l.group === 'present').map((l) => (
              <PgSeg key={l.key} label={l.label} value={ov[l.key]} opts={l.opts} onChange={(v) => setOv({ ...ov, [l.key]: v })} />
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
              <button onClick={() => setCompare(!compare)} className="pg-ghost">{compare ? 'Hide bars' : 'Compare bars'}</button>
              {dirty && <button onClick={() => setOv({ ...PG_IA_DEFAULT_CFG })} className="pg-ghost">Reset to Auto</button>}
            </div>
          </div>
          {dirty && (
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--color-fg-3)' }}>
              Overrides active — the phone no longer shows {option.name}'s own intended answer.
            </div>
          )}
        </div>

        <div className="pg-stage">
          <PgPhone key={optId + JSON.stringify(ov)} cfg={cfg} option={option} circle={circle} circles={PG_IA_CIRCLES}
            onSelectCircle={setCircleId} />
          {compare && <div className="pg-side"><PgBarCompare ov={ov} activeId={optId} onPick={setOptId} /></div>}
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<PgApp />);
