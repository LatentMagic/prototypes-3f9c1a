// ============================================================================
// Discourse playground — the shell.
// Rail = the seven directions plus the reaction-only baseline. Heading = the
// levers (Auto + override) and the data/state switches. One phone renders the
// selected treatment across the whole feed; the side column walks the loop.
// ============================================================================

const { useState: pgS, useEffect: pgE, useRef: pgRef } = React;
const {
  PGD_OPTIONS, PGD_LEVERS, PGD_DEFAULT_CFG, PGD_ITEMS, PGD_USER, PGD_WORDS,
  pgdMergeCfg, pgdResolve, PgdCard, PgdTabs, PgdTableEntry, PgdEmpty,
  PgdMoment, PgdDoorSheet, PgdAddSheet, PGC_RESPOND_LABEL,
  AppShellNative, SwellReactionFlow, TopBar, MobileDrawer, FAB,
} = window;

// The playground is the app, not a picture of it: no bezel, no forced phone.
// The config rail IS the circle rail here, so it behaves exactly as the app's
// rail does at the app's own breakpoint (`main.jsx`: < 1024 = mobile):
//   ≥ 1024  — permanently docked beside the app, no toggle, nothing to collapse.
//   < 1024  — behind the top bar's circles-menu button, opening the app's own
//             MobileDrawer (`app/shell.jsx`, mounted verbatim).
// Viewport: Mobile switches to the app posture, where the rail is Home, framed
// in the app's phone frame — the same thing `main.jsx` does for forced mobile.
const PGD_MOBILE_BREAK = 1024;

const PG_KEY = 'pg_discourse_v1';
const pgLoad = () => { try { return JSON.parse(localStorage.getItem(PG_KEY)) || {}; } catch (e) { return {}; } };

const PGD_ATTACH_LINE = {
  baseline: 'Nothing is attached. A share is a URL.',
  stems: 'Pick a stem in the Add sheet, then finish the sentence.',
  ask: 'The Add sheet asks for a question, not a summary.',
  door: 'One sealed sentence \u2014 the preface \u2014 travels with the link.',
  echo: 'One line on why, attached at share.',
  notes: 'One line on why, attached at share.',
  margin: 'One line on why \u2014 the first note in the margin.',
  table: 'One line on why, attached at share.',
};
const PGD_LIVES_LABEL = { card: 'Open the Read tab', margin: 'Open the Read tab', back: 'Open the Read tab', table: 'Walk to the Table', door: 'Open a door', none: 'Open the Read tab' };

// ---- Heading control -------------------------------------------------------
const PgSeg = ({ label, value, opts, onChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
    <span style={{ fontWeight: 600, fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-fg-3)', flexShrink: 0 }}>{label}</span>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)', padding: 2, gap: 2 }}>
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

// ---- The app surface -------------------------------------------------------
const PgdSurface = ({ appPosture, isMobile, framed, home, railBody, onGoHome, railOpen, onToggleRail, cfg, opt, items, local, onLocal, tab, setTab, jump, onJumpDone }) => {
  const [overlay, setOverlay] = pgS(null);      // {kind:'add'|'door'|'moment', id}
  const [flow, setFlow] = pgS(null);            // item currently in the Swell
  const committed = pgRef(null);

  const withLocal = (it) => {
    const l = local[it.id];
    if (!l) return it;
    return {
      ...it, read: l.read != null ? l.read : it.read,
      reactions: l.reaction ? [...(it.reactions || []), l.reaction] : it.reactions,
      responses: l.response ? [...(it.responses || []), l.response] : it.responses,
    };
  };
  const all = items.map(withLocal);
  const resolved = all.map((it) => ({ it, res: pgdResolve(it, cfg, opt) }));
  const active = resolved.filter((r) => !r.it.read);
  const read = resolved.filter((r) => r.it.read);
  const table = resolved.filter((r) => r.it.read && (r.res.thought || r.res.responses.length));
  const find = (id) => resolved.find((r) => r.it.id === id);

  // The loop's beats, drivable from the side column.
  pgE(() => {
    if (!jump) return;
    if (jump.what === 'add') setOverlay({ kind: 'add' });
    if (jump.what === 'read') { const t = active[0]; if (t) { setTab('active'); setFlow(t.it); } }
    if (jump.what === 'respond') { const t = read.find((r) => r.res.canRespond) || read[0]; if (t) { setTab(cfg.home === 'table' ? 'table' : 'read'); setOverlay({ kind: 'moment', id: t.it.id }); } }
    if (jump.what === 'lives') {
      if (cfg.home === 'table') setTab('table');
      else if (cfg.home === 'door') { const t = read.find((r) => (r.it.reactions || []).length); setTab('read'); if (t) setOverlay({ kind: 'door', id: t.it.id }); }
      else setTab('read');
    }
    onJumpDone();
  }, [jump]);

  const markRead = (item) => setFlow(item);
  const commitReaction = (item, rx) => {
    committed.current = rx;
    onLocal(item.id, { read: true, reaction: rx && !rx.skipped ? { ...rx, name: 'You' } : { name: 'You', skipped: true } });
    if (cfg.reveal === 'swell' && cfg.respond !== 'none') {
      setFlow(null);
      setOverlay({ kind: 'moment', id: item.id, glyph: rx && rx.glyph });
    }
  };
  const closeFlow = (item) => {
    const rx = committed.current; committed.current = null;
    setFlow(null);
    if (rx && cfg.reveal === 'after' && cfg.respond !== 'none') setOverlay({ kind: 'moment', id: item.id, glyph: rx.glyph });
    else if (rx) setTab('read');
  };
  const sendResponse = (id, r) => { onLocal(id, { response: r }); setOverlay(null); setTab(cfg.home === 'table' ? 'table' : 'read'); };

  const cardProps = (r) => ({
    item: r.it, res: r.res, cfg, opt,
    onMarkRead: () => markRead(r.it),
    onDelete: () => {},
    onRespond: () => setOverlay({ kind: 'moment', id: r.it.id }),
    onDoor: () => setOverlay({ kind: 'door', id: r.it.id }),
    onTable: () => setTab('table'),
  });

  const list = tab === 'active' ? active : tab === 'read' ? read : table;
  const body = (
    <React.Fragment>
      <PgdTabs active={tab} onChange={setTab} extra={cfg.home === 'table'} />
      <main style={{ flex: 1, width: '100%' }}>
        <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', padding: '16px 16px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {list.length === 0 ? (
            tab === 'table'
              ? <PgdEmpty primary="Nothing on the table." supporting="Cards arrive here when someone says something about them." />
              : <PgdEmpty primary="Nothing here." supporting={tab === 'read' ? 'Links you mark as read land here, but stay in everyone else\u2019s list.' : 'Links shared in this circle land in everyone\u2019s list, to consume at your own pace.'} />
          ) : tab === 'table'
            ? list.map((r) => <PgdTableEntry key={r.it.id} item={r.it} res={r.res} cfg={cfg} opt={opt}
                onRespond={() => setOverlay({ kind: 'moment', id: r.it.id })} onDoor={() => setOverlay({ kind: 'door', id: r.it.id })} />)
            : list.map((r) => <PgdCard key={r.it.id} tab={tab} {...cardProps(r)} />)}
        </div>
      </main>
    </React.Fragment>
  );

  const ov = overlay && overlay.id ? find(overlay.id) : null;

  const space = { id: 'sp-backend', name: 'Backend Pod' };
  const shell = appPosture ? (
    <AppShellNative user={PGD_USER} space={space} spaces={[]} currentId="sp-backend" isHome={home}
      canAdd onAdd={() => setOverlay({ kind: 'add' })} onHome={onGoHome} onMembers={() => {}}>
      {home ? <div style={{ flex: 1, background: 'var(--color-page)', padding: '16px 14px 32px' }}>{railBody}</div> : body}
    </AppShellNative>
  ) : (
    <div style={{ minHeight: 'var(--circ-vh)', display: 'flex', flexDirection: 'column', background: 'var(--color-canvas)' }}>
      {/* The app's own TopBar: the circles-menu button appears at exactly the
          widths the app shows it, because the config rail IS the circle rail. */}
      <TopBar isMobile={isMobile} space={space} showMembers={false} onMenu={onToggleRail} menuOpen={railOpen} />
      {body}
      {FAB && <FAB onClick={() => setOverlay({ kind: 'add' })} expanded={!!(overlay && overlay.kind === 'add')} isMobile={isMobile} />}
    </div>
  );

  const overlays = (
    <React.Fragment>
      {flow && (
        <SwellReactionFlow key={flow.id} item={flow}
          onMarkRead={(item, rx) => commitReaction(flow, rx)}
          onClose={() => closeFlow(flow)} />
      )}
      {overlay && overlay.kind === 'add' && <PgdAddSheet cfg={cfg} opt={opt} onClose={() => setOverlay(null)} />}
      {overlay && overlay.kind === 'door' && ov && (
        <PgdDoorSheet item={ov.it} res={ov.res} cfg={cfg} opt={opt} onClose={() => setOverlay(null)}
          onRespond={() => setOverlay({ kind: 'moment', id: ov.it.id })} />
      )}
      {overlay && overlay.kind === 'moment' && ov && (
        <PgdMoment item={ov.it} res={ov.res} cfg={cfg} opt={opt} glyph={overlay.glyph}
          withDisc={cfg.reveal === 'swell'} onClose={() => setOverlay(null)}
          onSend={(r) => sendResponse(ov.it.id, r)} />
      )}
    </React.Fragment>
  );

  // Forced mobile on a wide screen gets the app's own phone frame (the same
  // classes circlists.html uses) — that is what the product does for this
  // posture. Auto never frames anything.
  if (framed) {
    return (
      <div className="circ-stage">
        <div className="circ-phone">
          <div className="circ-phone-clip">
            <div className="circ-phone-screen">{shell}</div>
            {overlays}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pgd-surface">
      <div className="pgd-screen">{shell}</div>
      {overlays}
    </div>
  );
};

// ---- Side column — the loop, end to end ------------------------------------
const PgdLoop = ({ opt, cfg, onJump }) => {
  const beats = [
    { k: 'add', n: '1', title: 'A thought is attached', body: PGD_ATTACH_LINE[opt.id], cta: 'Open Add' },
    { k: 'read', n: '2', title: 'It unseals on read', body: cfg.home === 'none' ? 'Nothing unseals \u2014 the reaction is the whole moment.' : 'Mark an item read, leave your reaction, and what came with it is revealed.', cta: 'Mark one read' },
    { k: 'respond', n: '3', title: 'A response goes back', body: cfg.respond === 'none' ? 'There is no response. This is the gap.' : PGD_WORDS.respond[cfg.respond] + ', ' + (cfg.reveal === 'swell' ? 'written inside the Swell.' : cfg.reveal === 'after' ? 'written straight after the reveal.' : 'written where the exchange lives.'), cta: 'Open the response' },
    { k: 'lives', n: '4', title: 'The exchange lives on', body: PGD_WORDS.home[cfg.home] + (cfg.persist === 'fades' ? ', and fades after a while.' : '.'), cta: PGD_LIVES_LABEL[cfg.home] || 'Show me' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-fg-3)' }}>The loop</div>
      {beats.map((b) => (
        <div key={b.k} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)', padding: '12px 14px', boxShadow: 'var(--shadow-raised)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-fg-3)' }}>{b.n}</span>
            <span style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--color-fg-1)' }}>{b.title}</span>
          </div>
          <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: '5px 0 0' }}>{b.body}</div>
          <button onClick={() => onJump(b.k)} className="pg-ghost" style={{ marginTop: 9 }}>{b.cta}</button>
        </div>
      ))}
      <div style={{ fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-fg-3)', marginTop: 8 }}>Its answers</div>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)', padding: '4px 14px' }}>
        {[['Lives', PGD_WORDS.home[cfg.home]], ['Attach', PGD_WORDS.attach[cfg.attach]], ['Reveal', PGD_WORDS.reveal[cfg.reveal]],
          ['Response', PGD_WORDS.respond[cfg.respond]], ['Whose thought', PGD_WORDS.whose[cfg.whose]],
          ['Length', cfg.limit ? cfg.limit + ' characters' : 'n/a'], ['Persistence', PGD_WORDS.persist[cfg.persist]], ['Names', PGD_WORDS.attrib[cfg.attrib]]].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', gap: 12, alignItems: 'baseline', padding: '7px 0', borderBottom: '1px solid var(--color-border-2)' }}>
            <span style={{ width: 96, flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-fg-3)' }}>{k}</span>
            <span style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--color-fg-1)' }}>{v}</span>
          </div>
        ))}
        <div style={{ padding: '9px 0', fontSize: 12, lineHeight: 1.5, color: 'var(--color-fg-3)' }}>{opt.from}</div>
      </div>
    </div>
  );
};

// ---- The rail body ---------------------------------------------------------
// Rendered in two places, never forked: the rail on a web posture (docked on a
// wide window, in the app's MobileDrawer below 1024), and the app posture's Home
// destination (Home IS the circles list — MOBILE.md — so here it is the
// directions list).
const PgdRailBody = ({ opt, optId, cfg, ov, setOv, pane, setPane, pick, dirty, posture, setPosture, onJump, onResetFeed }) => {
  const paneBtn = (id, label) => (
    <button onClick={() => setPane(id)} aria-pressed={pane === id} style={{
      flex: 1, background: pane === id ? 'var(--color-surface)' : 'transparent', border: 0, cursor: 'pointer',
      boxShadow: pane === id ? 'var(--shadow-raised)' : 'none', borderRadius: 6, padding: '7px 10px', minHeight: 36,
      fontFamily: 'var(--font-sans)', fontWeight: pane === id ? 600 : 500, fontSize: 13,
      color: pane === id ? 'var(--color-fg-1)' : 'var(--color-fg-2)',
    }}>{label}</button>
  );
  return (
    <React.Fragment>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '0 4px 10px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-accent)' }}>{opt.n}</span>
        <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em' }}>{opt.name}</span>
        {dirty && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--color-fg-3)', marginLeft: 'auto' }}>overridden</span>}
      </div>
      <div style={{ display: 'flex', gap: 2, padding: 2, marginBottom: 14, background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border-2)', borderRadius: 'var(--radius-md)' }}>
        {paneBtn('opts', 'Directions')}
        {paneBtn('cfg', 'Config')}
        {paneBtn('loop', 'The loop')}
      </div>

      {pane === 'opts' && (
        <React.Fragment>
          <p style={{ margin: '0 4px 16px', fontSize: 12.5, lineHeight: 1.5, color: 'var(--color-fg-2)' }}>
            Every direction answers the whole loop — thought attached, thought received, response given, exchange kept — and states how it relates to the Swell. None of them builds a thread.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PGD_OPTIONS.map((o) => {
              const on = o.id === optId;
              return (
                <button key={o.id} onClick={() => pick(o.id)} className="pg-railitem" style={{
                  background: on ? 'var(--color-surface)' : 'transparent',
                  borderLeft: on ? '2px solid var(--color-accent)' : '2px solid transparent',
                  boxShadow: on ? 'var(--shadow-raised)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: on ? 'var(--color-accent)' : 'var(--color-fg-3)' }}>{o.n}</span>
                    <span style={{ fontWeight: 600, fontSize: 13.5 }}>{o.name}</span>
                  </div>
                  <div style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--color-fg-2)', marginTop: 5 }}>{o.line}</div>
                  {on && (
                    <div style={{ marginTop: 9, display: 'flex', flexDirection: 'column', gap: 7 }}>
                      <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--color-fg-1)' }}>{o.claim}</div>
                      <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--color-fg-3)' }}>Trade-off: {o.cost}</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </React.Fragment>
      )}

      {pane === 'cfg' && (
        <React.Fragment>
          <p style={{ margin: '0 4px 14px', fontSize: 12.5, lineHeight: 1.5, color: 'var(--color-fg-2)' }}>
            Every lever defaults to <strong style={{ fontWeight: 600 }}>Auto</strong> — the selected direction’s own intended answer. Override one to A/B it across all of them.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {PGD_LEVERS.filter((l) => l.group === 'shape').map((l) => (
              <PgSeg key={l.key} label={l.label} value={ov[l.key]} opts={l.opts} onChange={(v) => setOv({ ...ov, [l.key]: v })} />
            ))}
            <div style={{ height: 1, background: 'var(--color-border-1)', margin: '4px 0' }} />
            {PGD_LEVERS.filter((l) => l.group === 'state').map((l) => (
              <PgSeg key={l.key} label={l.label} value={ov[l.key]} opts={l.opts} onChange={(v) => setOv({ ...ov, [l.key]: v })} />
            ))}
            <div style={{ height: 1, background: 'var(--color-border-1)', margin: '4px 0' }} />
            <PgSeg label="Viewport" value={posture} opts={[['auto', 'Auto'], ['mobile', 'Mobile']]} onChange={setPosture} />
          </div>
          {dirty && (
            <div style={{ marginTop: 12, fontSize: 12, lineHeight: 1.5, color: 'var(--color-fg-3)' }}>
              The app is no longer showing {opt.name}’s own intended answer.
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {dirty && <button onClick={() => setOv({ ...PGD_DEFAULT_CFG })} className="pg-ghost">Reset to Auto</button>}
            <button onClick={onResetFeed} className="pg-ghost">Reset feed</button>
          </div>
        </React.Fragment>
      )}

      {pane === 'loop' && <PgdLoop opt={opt} cfg={cfg} onJump={onJump} />}
    </React.Fragment>
  );
};

// ---- App -------------------------------------------------------------------
const PgdApp = () => {
  const saved = pgLoad();
  const [optId, setOptId] = pgS(saved.optId || 'notes');
  const [ov, setOv] = pgS({ ...PGD_DEFAULT_CFG, ...(saved.ov || {}) });
  const [tab, setTab] = pgS('active');
  const [pane, setPane] = pgS(saved.pane || 'opts');
  const [local, setLocal] = pgS({});
  const [jump, setJump] = pgS(null);
  const [winW, setWinW] = pgS(window.innerWidth);
  const [posture, setPosture] = pgS(saved.posture || 'auto');
  const [railOpen, setRailOpen] = pgS(false);
  // Where the app posture is standing: the circle, or Home (= the rail).
  const [route, setRoute] = pgS('circle');

  pgE(() => {
    const on = () => setWinW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);

  pgE(() => { try { localStorage.setItem(PG_KEY, JSON.stringify({ optId, ov, pane, posture })); } catch (e) {} }, [optId, ov, pane, posture]);

  // Posture exactly as main.jsx resolves it: forced mobile, else the window.
  const appPosture = posture === 'mobile';
  const isMobile = appPosture ? true : winW < PGD_MOBILE_BREAK;
  // Web posture at desktop width: the rail is permanent, like the app's.
  const docked = !appPosture && !isMobile;
  const opt = PGD_OPTIONS.find((o) => o.id === optId) || PGD_OPTIONS[0];
  const cfg = pgdMergeCfg(opt, ov);
  const dirty = Object.keys(PGD_DEFAULT_CFG).some((k) => ov[k] !== 'auto');
  const onLocal = (id, patch) => setLocal((m) => ({ ...m, [id]: { ...(m[id] || {}), ...patch } }));
  const resetFeed = () => { setLocal({}); setTab('active'); };
  // Picking a direction enters it, exactly as picking a circle does.
  const pick = (id) => { setOptId(id); setLocal({}); setTab('active'); setRoute('circle'); if (!docked) setRailOpen(false); };

  const railBody = (
    <PgdRailBody opt={opt} optId={optId} cfg={cfg} ov={ov} setOv={setOv} pane={pane} setPane={setPane}
      pick={pick} dirty={dirty} posture={posture} setPosture={setPosture} onResetFeed={resetFeed}
      onJump={(what) => { setJump({ what, at: Date.now() }); setRoute('circle'); if (!docked) setRailOpen(false); }} />
  );

  return (
    <div className="pg-page">
      {docked && <aside className="pg-rail">{railBody}</aside>}
      <PgdSurface key={optId + JSON.stringify(ov)} appPosture={appPosture} isMobile={isMobile} framed={appPosture}
        home={appPosture && route === 'home'} railBody={railBody} onGoHome={() => setRoute('home')}
        railOpen={railOpen} onToggleRail={() => setRailOpen((v) => !v)}
        cfg={cfg} opt={opt} items={PGD_ITEMS}
        local={local} onLocal={onLocal} tab={tab} setTab={setTab} jump={jump} onJumpDone={() => setJump(null)} />
      {/* Below 1024 the rail lives behind the top bar's circles-menu button, in
          the app's own drawer — same geometry, scrim and easing. */}
      {!appPosture && isMobile && (
        <MobileDrawer open={railOpen} width={336} onClose={() => setRailOpen(false)}>{railBody}</MobileDrawer>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<PgdApp />);
