// ============================================================================
// Discourse v4 — the rig.
// The real app, engaged the normal way. The direction selector stands exactly
// where the circle rail stands: docked at >= 1024, the app's own MobileDrawer
// behind the top bar's menu button below it, and the Home destination in the
// app posture (Home IS the circles list, so here it is the directions list).
// A flat list of named versions, one line each. No theory in the reviewer's
// path — levers are folded away and secondary.
// ============================================================================

const { useState: p4aS, useEffect: p4aE, useRef: p4aR } = React;
const {
  PGD4_DIRS, PGD4_LEVERS, PGD4_DEFAULT_OV, PGD4_ITEMS, PGD4_USER,
  pgd4Merge, pgd4Resolve, Pg4Card, Pg4Tabs, Pg4TableEntry, Pg4Empty,
  Pg4RecordSheet, Pg4Moment, Pg4AddSheet,
  AppShellNative, SwellReactionFlow, TopBar, MobileDrawer, FAB,
} = window;

// main.jsx's own breakpoint. Never invent one, never disable a branch.
const P4A_BREAK = 1024;
const P4A_KEY = 'pg_discourse_v4';
const p4aLoad = () => { try { return JSON.parse(localStorage.getItem(P4A_KEY)) || {}; } catch (e) { return {}; } };
const P4A_BEATS = [['add', 'Attach a line'], ['read', 'Mark one read'], ['respond', 'Respond'], ['cont', 'Continue']];

// ---- The app surface -------------------------------------------------------
const Pg4Surface = ({ appPosture, isMobile, framed, home, railBody, onGoHome, railOpen, onToggleRail,
  cfg, dir, play, onPlay, jump, onJumpDone }) => {
  const [overlay, setOverlay] = p4aS(null);
  const [flow, setFlow] = p4aS(null);
  const committed = p4aR(null);
  const tab = play.tab || 'active';
  const setTab = (t) => onPlay({ tab: t });

  const withPlay = (it) => {
    const l = (play.local || {})[it.id];
    const landed = (play.landed || {})[it.id];
    if (!l && !landed) return it;
    return {
      ...it,
      read: l && l.read != null ? l.read : it.read,
      reactions: l && l.reaction ? [...(it.reactions || []), l.reaction] : it.reactions,
      responses: l && l.response ? [...(it.responses || []), l.response] : it.responses,
      turns: l && l.turn ? [...(it.turns || []), l.turn] : it.turns,
      takeaway: landed || it.takeaway,
      onTable: it.onTable || (l && l.graduated),
    };
  };
  const all = PGD4_ITEMS.map(withPlay);
  const resolved = all.map((it) => ({ it, res: pgd4Resolve(it, cfg, dir) }));
  const active = resolved.filter((r) => !r.it.read);
  const read = resolved.filter((r) => r.it.read);
  const table = resolved.filter((r) => r.it.onTable);
  const find = (id) => resolved.find((r) => r.it.id === id);
  const hasTable = cfg.treat === 'page';

  const openRecord = (id, opts) => setOverlay({ kind: 'record', id, ...(opts || {}) });
  const openMoment = (id, glyph) => setOverlay({ kind: cfg.swell === 'merged' ? 'record' : 'moment', id, glyph, moment: cfg.swell === 'merged' });

  // The beats, drivable from the rail. Each puts the app one touch from the
  // distinctive moment of THIS direction.
  p4aE(() => {
    if (!jump) return;
    const w = jump.what;
    if (w === 'add') setOverlay({ kind: 'add' });
    if (w === 'read') { const t = active[0]; if (t) { setTab('active'); setFlow(t.it); } }
    if (w === 'respond') {
      const t = read.find((r) => r.res.canRespond) || read[0];
      if (t) { setTab('read'); openMoment(t.it.id, null); }
    }
    if (w === 'cont') {
      if (hasTable) setTab('table');
      else { const t = read.find((r) => r.res.count > 0) || read[0]; setTab('read'); if (t) openRecord(t.it.id); }
    }
    onJumpDone();
  }, [jump]);

  const commitReaction = (item, rx) => {
    committed.current = rx;
    onPlay({ local: { ...(play.local || {}), [item.id]: { ...((play.local || {})[item.id] || {}), read: true, reaction: rx && !rx.skipped ? { ...rx, name: 'You' } : { name: 'You', skipped: true } } } });
    // Merged directions: the shipped flow is UNMOUNTED at commit and the record
    // takes the sheet's place. That is what deletes the five-second timeout —
    // you dismiss the record, it never dismisses itself.
    if (cfg.swell === 'merged' && cfg.respond !== 'none') {
      setFlow(null);
      setOverlay({ kind: 'record', id: item.id, glyph: rx && rx.glyph, moment: true });
    }
  };
  const closeFlow = (item) => {
    const rx = committed.current; committed.current = null;
    setFlow(null);
    if (rx && cfg.swell === 'after' && cfg.respond !== 'none') setOverlay({ kind: 'moment', id: item.id, glyph: rx.glyph });
    else if (rx) setTab('read');
  };
  const patch = (id, p) => onPlay({ local: { ...(play.local || {}), [id]: { ...((play.local || {})[id] || {}), ...p } } });
  const sendResponse = (id, r) => { patch(id, { response: r }); setOverlay(null); if (!hasTable) setTab('read'); };
  const point = (key) => onPlay({ pointed: { ...(play.pointed || {}), [key]: !(play.pointed || {})[key] } });

  const list = tab === 'active' ? active : tab === 'read' ? read : table;
  const body = (
    <React.Fragment>
      <Pg4Tabs active={tab} onChange={setTab} table={hasTable} />
      <main style={{ flex: 1, width: '100%' }}>
        <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', padding: '16px 16px 28px', display: 'flex', flexDirection: 'column', gap: tab === 'table' ? 20 : 12 }}>
          {list.length === 0 ? (
            tab === 'table'
              ? <Pg4Empty primary="Nothing on the table." supporting="A member brings an item here when it stops being a link and becomes a conversation." />
              : <Pg4Empty primary="Nothing here." supporting={tab === 'read' ? 'Links you mark as read land here, and stay in everyone else\u2019s list.' : 'Links shared in this circle land in everyone\u2019s list, to read, watch or listen at your own pace.'} />
          ) : tab === 'table'
            ? list.map((r) => (
              <Pg4TableEntry key={r.it.id} item={r.it} res={r.res} cfg={cfg}
                landed={(play.landed || {})[r.it.id]}
                onDoor={() => openRecord(r.it.id)}
                onSend={(v) => patch(r.it.id, { turn: { by: 'You', text: v.text } })}
                onLand={(v) => onPlay({ landed: { ...(play.landed || {}), [r.it.id]: { by: 'You', text: v.text } } })} />
            ))
            : list.map((r) => (
              <Pg4Card key={r.it.id} tab={tab} item={r.it} res={r.res} cfg={cfg} dir={dir}
                pointed={play.pointed || {}} onPoint={point}
                onMarkRead={() => setFlow(r.it)} onDelete={() => {}}
                onRespond={() => openMoment(r.it.id, null)}
                onDoor={() => openRecord(r.it.id)}
                onTable={() => { patch(r.it.id, { graduated: true }); setTab('table'); }} />
            ))}
        </div>
      </main>
    </React.Fragment>
  );

  const ov = overlay && overlay.id ? find(overlay.id) : null;
  const space = { id: 'sp-backend', name: 'Backend Pod' };
  const shell = appPosture ? (
    <AppShellNative user={PGD4_USER} space={space} spaces={[]} currentId="sp-backend" isHome={home}
      canAdd onAdd={() => setOverlay({ kind: 'add' })} onHome={onGoHome} onMembers={() => {}}>
      {home ? <div style={{ flex: 1, background: 'var(--color-page)', padding: '16px 14px 32px' }}>{railBody}</div> : body}
    </AppShellNative>
  ) : (
    <div style={{ minHeight: 'var(--circ-vh)', display: 'flex', flexDirection: 'column', background: 'var(--color-canvas)' }}>
      <TopBar isMobile={isMobile} space={space} showMembers={false} onMenu={onToggleRail} menuOpen={railOpen} />
      {body}
      {FAB && <FAB onClick={() => setOverlay({ kind: 'add' })} expanded={!!(overlay && overlay.kind === 'add')} isMobile={isMobile} />}
    </div>
  );

  const overlays = (
    <React.Fragment>
      {flow && (
        <SwellReactionFlow key={flow.id} item={flow}
          onMarkRead={(item, rx) => commitReaction(flow, rx)} onClose={() => closeFlow(flow)} />
      )}
      {overlay && overlay.kind === 'add' && <Pg4AddSheet cfg={cfg} dir={dir} onClose={() => setOverlay(null)} />}
      {overlay && overlay.kind === 'record' && ov && (
        <Pg4RecordSheet item={ov.it} res={ov.res} cfg={cfg} dir={dir} moment={!!overlay.moment} glyph={overlay.glyph}
          pointed={play.pointed || {}} onPoint={point} onClose={() => setOverlay(null)}
          onSend={(r) => sendResponse(ov.it.id, r)} onTable={() => { setOverlay(null); setTab('table'); }} />
      )}
      {overlay && overlay.kind === 'moment' && ov && (
        <Pg4Moment item={ov.it} res={ov.res} cfg={cfg} dir={dir} glyph={overlay.glyph}
          pointed={play.pointed || {}} onPoint={point}
          onClose={() => setOverlay(null)} onSend={(r) => sendResponse(ov.it.id, r)} />
      )}
    </React.Fragment>
  );

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

// ---- One lever control -----------------------------------------------------
const Pg4Seg = ({ label, value, opts, onChange }) => (
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

// ---- The rail body — one body, rendered in three places, never forked ------
const Pg4Rail = ({ dirId, pick, ov, setOv, dirty, posture, setPosture, onJump, onReset }) => {
  const [open, setOpen] = p4aS(false);
  return (
    <React.Fragment>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {PGD4_DIRS.map((d) => {
          const on = d.id === dirId;
          return (
            <button key={d.id} onClick={() => pick(d.id)} className="pg-railitem" style={{
              background: on ? 'var(--color-surface)' : 'transparent',
              borderLeft: on ? '2px solid var(--color-accent)' : '2px solid transparent',
              boxShadow: on ? 'var(--shadow-raised)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: on ? 'var(--color-accent)' : 'var(--color-fg-3)' }}>{d.n}</span>
                <span style={{ fontWeight: 600, fontSize: 13.5 }}>{d.name}</span>
              </div>
              <div style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--color-fg-2)', marginTop: 4 }}>{d.line}</div>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 18, padding: '0 4px' }}>
        {P4A_BEATS.map(([k, l]) => <button key={k} onClick={() => onJump(k)} className="pg-ghost">{l}</button>)}
      </div>

      <div style={{ marginTop: 16, borderTop: '1px solid var(--color-border-1)', paddingTop: 12 }}>
        <button onClick={() => setOpen(!open)} aria-expanded={open} className="pg-ghost" style={{ border: 0, background: 'transparent', padding: '6px 4px' }}>
          {open ? 'Hide levers' : 'Levers'}{dirty ? ' \u00B7 overridden' : ''}
        </button>
        {open && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 10 }}>
            {PGD4_LEVERS.map((l) => (
              <Pg4Seg key={l.key} label={l.label} value={ov[l.key]} opts={l.opts} onChange={(v) => setOv({ ...ov, [l.key]: v })} />
            ))}
            <div style={{ height: 1, background: 'var(--color-border-1)', margin: '4px 0' }} />
            <Pg4Seg label="Viewport" value={posture} opts={[['auto', 'Auto'], ['mobile', 'Mobile']]} onChange={setPosture} />
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              {dirty && <button onClick={() => setOv({ ...PGD4_DEFAULT_OV })} className="pg-ghost">Reset to Auto</button>}
              <button onClick={onReset} className="pg-ghost">Reset this direction</button>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

// ---- App -------------------------------------------------------------------
const P4A_BLANK = { tab: 'active', local: {}, pointed: {}, landed: {} };

const Pg4App = () => {
  const saved = p4aLoad();
  const [dirId, setDirId] = p4aS(saved.dirId || 'invite');
  const [ov, setOv] = p4aS({ ...PGD4_DEFAULT_OV, ...(saved.ov || {}) });
  const [posture, setPosture] = p4aS(saved.posture || 'auto');
  // Play state is kept PER DIRECTION, so switching back is not a loss.
  const [plays, setPlays] = p4aS({});
  const [jump, setJump] = p4aS(null);
  const [winW, setWinW] = p4aS(window.innerWidth);
  const [railOpen, setRailOpen] = p4aS(false);
  const [route, setRoute] = p4aS('circle');

  p4aE(() => {
    const on = () => setWinW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  p4aE(() => { try { localStorage.setItem(P4A_KEY, JSON.stringify({ dirId, ov, posture })); } catch (e) {} }, [dirId, ov, posture]);

  const appPosture = posture === 'mobile';
  const isMobile = appPosture ? true : winW < P4A_BREAK;
  const docked = !appPosture && !isMobile;
  const dir = PGD4_DIRS.find((d) => d.id === dirId) || PGD4_DIRS[0];
  const cfg = pgd4Merge(dir, ov);
  const dirty = Object.keys(PGD4_DEFAULT_OV).some((k) => ov[k] !== 'auto');
  const play = plays[dirId] || P4A_BLANK;
  const onPlay = (p) => setPlays((m) => ({ ...m, [dirId]: { ...(m[dirId] || P4A_BLANK), ...p } }));

  const pick = (id) => { setDirId(id); setRoute('circle'); if (!docked) setRailOpen(false); };
  const railBody = (
    <Pg4Rail dirId={dirId} pick={pick} ov={ov} setOv={setOv} dirty={dirty}
      posture={posture} setPosture={setPosture}
      onReset={() => setPlays((m) => ({ ...m, [dirId]: { ...P4A_BLANK } }))}
      onJump={(what) => { setJump({ what, at: Date.now() }); setRoute('circle'); if (!docked) setRailOpen(false); }} />
  );

  return (
    <div className="pg-page">
      {docked && <aside className="pg-rail">{railBody}</aside>}
      <Pg4Surface key={dirId + JSON.stringify(ov)} appPosture={appPosture} isMobile={isMobile} framed={appPosture}
        home={appPosture && route === 'home'} railBody={railBody} onGoHome={() => setRoute('home')}
        railOpen={railOpen} onToggleRail={() => setRailOpen((v) => !v)}
        cfg={cfg} dir={dir} play={play} onPlay={onPlay}
        jump={jump} onJumpDone={() => setJump(null)} />
      {!appPosture && isMobile && (
        <MobileDrawer open={railOpen} width={336} onClose={() => setRailOpen(false)}>{railBody}</MobileDrawer>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Pg4App />);
