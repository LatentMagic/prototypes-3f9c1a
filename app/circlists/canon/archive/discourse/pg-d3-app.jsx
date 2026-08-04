// ============================================================================
// Discourse v3 — the shell.
// One flat list of versions of the app, in the place the app puts its circle
// list: docked at >= 1024, the app's own MobileDrawer below it, the Home
// destination in the app posture. Tap one and the app in front of you IS that
// version, seeded so its moment is a touch or two away.
//
// The levers are still here, behind "Under the hood" — secondary on purpose.
// The v2 component layer is mounted unchanged (`pg-d2-*.jsx`).
// ============================================================================

const { useState: tS, useEffect: tE } = React;
const {
  D3_VERSIONS, D3_LEVERS, D3_DEFAULT_CFG, d3Merge, d3Items,
  d2Resolve, D2_USER,
  D2Card, D2Record, D2AddSheet, D2TableEntry, D2Tabs, D2Empty,
  AppShellNative, SwellReactionFlow, TopBar, MobileDrawer, FAB,
} = window;

const D3_BREAK = 1024; // main.jsx's own breakpoint. Never invent one.
const D3_KEY = 'pg_d3_discourse_v1';
const d3Load = () => { try { return JSON.parse(localStorage.getItem(D3_KEY)) || {}; } catch (e) { return {}; } };

const D3Seg = ({ label, value, opts, onChange }) => (
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

// ---- The list --------------------------------------------------------------
const D3List = ({ vid, pick, hood, setHood, ov, setOv, dirty, posture, setPosture, onReset }) => {
  if (hood) {
    return (
      <React.Fragment>
        <button onClick={() => setHood(false)} className="pg-ghost" style={{ marginBottom: 16 }}>Versions</button>
        <p style={{ margin: '0 4px 14px', fontSize: 12.5, lineHeight: 1.5, color: 'var(--color-fg-2)' }}>
          Every lever sits on <strong style={{ fontWeight: 600 }}>Auto</strong> {'\u2014'} the version{'\u2019'}s own answer. Change one and you are no longer playing the version as built.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {D3_LEVERS.filter((l) => l.group === 'shape').map((l) => (
            <D3Seg key={l.key} label={l.label} value={ov[l.key]} opts={l.opts} onChange={(v) => setOv({ ...ov, [l.key]: v })} />
          ))}
          <div style={{ height: 1, background: 'var(--color-border-1)', margin: '4px 0' }} />
          {D3_LEVERS.filter((l) => l.group === 'state').map((l) => (
            <D3Seg key={l.key} label={l.label} value={ov[l.key]} opts={l.opts} onChange={(v) => setOv({ ...ov, [l.key]: v })} />
          ))}
          <div style={{ height: 1, background: 'var(--color-border-1)', margin: '4px 0' }} />
          <D3Seg label="Viewport" value={posture} opts={[['auto', 'Auto'], ['mobile', 'Mobile']]} onChange={setPosture} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          {dirty && <button onClick={() => setOv({ ...D3_DEFAULT_CFG })} className="pg-ghost">Back to Auto</button>}
          <button onClick={onReset} className="pg-ghost">Reset this version</button>
        </div>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <div style={{ padding: '0 4px 12px' }}>
        <div className="d2-eyebrow">Discourse</div>
        <div style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em', marginTop: 2 }}>Twelve versions of the app</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {D3_VERSIONS.map((v) => {
          const on = v.id === vid;
          return (
            <button key={v.id} onClick={() => pick(v.id)} className="pg-railitem" aria-pressed={on} style={{
              background: on ? 'var(--color-surface)' : 'transparent',
              borderLeft: on ? '2px solid var(--color-accent)' : '2px solid transparent',
              boxShadow: on ? 'var(--shadow-raised)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: on ? 'var(--color-accent)' : 'var(--color-fg-3)', flexShrink: 0 }}>{v.n}</span>
                <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em', textWrap: 'pretty' }}>{v.name}</span>
              </div>
              <div style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--color-fg-2)', marginTop: 4, paddingLeft: 27, textWrap: 'pretty' }}>{v.line}</div>
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--color-border-1)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => setHood(true)} className="pg-ghost">Under the hood</button>
        {dirty && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--color-fg-3)' }}>overridden</span>}
      </div>
    </React.Fragment>
  );
};

// ---- The app surface -------------------------------------------------------
const D3Surface = ({ appPosture, isMobile, framed, home, listBody, onGoHome, listOpen, onToggleList,
  cfg, version, items, local, onLocal, onAddItem, tab, setTab }) => {
  const [overlay, setOverlay] = tS(null);
  const [flow, setFlow] = tS(null);

  const withLocal = (it) => {
    const l = local[it.id];
    if (!l) return it;
    let voices = [...(it.voices || [])];
    if (l.voices) voices = voices.concat(l.voices);
    if (l.mineLine != null) {
      voices = voices.some((v) => v.by === 'You')
        ? voices.map((v) => (v.by === 'You' ? { ...v, line: l.mineLine } : v))
        : [...voices, { by: 'You', line: l.mineLine, echoes: [], r: 1 }];
    }
    const pts = l.points || [];
    voices = voices.map((v) => (pts.indexOf(v.by) >= 0 ? { ...v, echoes: [...(v.echoes || []), 'You'] } : v));
    let table = it.table;
    if (l.tableOn != null || l.turns || l.landed) {
      const base = table || { on: false, turns: [] };
      table = { ...base, on: l.tableOn != null ? l.tableOn : base.on, turns: [...(base.turns || []), ...(l.turns || [])], landed: l.landed || base.landed };
    }
    return {
      ...it, read: l.read != null ? l.read : it.read,
      reactions: l.reaction ? [...(it.reactions || []), l.reaction] : it.reactions,
      voices, table, fresh: l.seen ? false : it.fresh,
    };
  };

  const resolved = items.map(withLocal).map((it) => ({ it, res: d2Resolve(it, cfg, version) }));
  const active = resolved.filter((r) => !r.it.read);
  const read = resolved.filter((r) => r.it.read);
  const table = resolved.filter((r) => r.res.tableOn);
  const find = (id) => resolved.find((r) => r.it.id === id);

  const openRecord = (id, moment) => { onLocal(id, { seen: true }); setOverlay({ kind: 'record', id, moment: !!moment }); };

  // The one breath: the reaction commits, the shipped flow leaves at once — no
  // five-second glimpse — and the record takes over the same position.
  const commitReaction = (item, rx) => {
    onLocal(item.id, {
      read: true, seen: true,
      reaction: rx && !rx.skipped ? { ...rx, name: 'You' } : { name: 'You', skipped: true },
    });
    setFlow(null);
    setOverlay({ kind: 'record', id: item.id, moment: true });
  };

  const sendVoice = (id, r, res) => {
    const line = r.stem ? r.stem[0] + ' ' + r.stem[1] : r.text;
    const l = local[id] || {};
    if (res.turns === 'living' && res.mine) onLocal(id, { mineLine: line });
    else onLocal(id, { voices: [...(l.voices || []), { by: 'You', line, echoes: [], to: r.to || null, r: res.round }] });
  };
  const point = (id, name) => {
    const l = local[id] || {};
    const pts = l.points || [];
    onLocal(id, { points: pts.indexOf(name) >= 0 ? pts.filter((n) => n !== name) : [...pts, name] });
  };

  const list = tab === 'active' ? active : tab === 'read' ? read : table;
  const body = (
    <React.Fragment>
      <D2Tabs active={tab} onChange={setTab} table={cfg.graduate !== 'none'} />
      <main style={{ flex: 1, width: '100%' }}>
        <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', padding: '16px 16px 28px', display: 'flex', flexDirection: 'column', gap: tab === 'table' ? 16 : 12 }}>
          {list.length === 0 ? (
            tab === 'table'
              ? <D2Empty primary="Nothing on the table." supporting="Items arrive here when a member takes one, and leave when somebody lands it." />
              : <D2Empty primary="Nothing here." supporting={tab === 'read' ? 'Links you mark as read land here, but stay in everyone else\u2019s list.' : 'Links shared in this circle land in everyone\u2019s list, to consume at your own pace.'} />
          ) : tab === 'table'
            ? list.map((r) => (
              <D2TableEntry key={r.it.id} item={r.it} res={r.res} cfg={cfg}
                onDoor={() => openRecord(r.it.id)}
                onSend={(v) => onLocal(r.it.id, { turns: [...((local[r.it.id] || {}).turns || []), { by: 'You', text: v.text }] })}
                onLand={(v) => onLocal(r.it.id, { landed: { by: 'You', text: v.text } })} />
            ))
            : list.map((r) => (
              <D2Card key={r.it.id} item={r.it} res={r.res} cfg={cfg} tab={tab}
                unseen={!!r.it.fresh && r.res.words}
                onMarkRead={() => setFlow(r.it)} onDelete={() => {}}
                onDoor={() => openRecord(r.it.id)} onTable={() => setTab('table')} />
            ))}
        </div>
      </main>
    </React.Fragment>
  );

  const ov = overlay && overlay.id ? find(overlay.id) : null;
  const space = { id: 'sp-backend', name: 'Backend Pod' };
  const shell = appPosture ? (
    <AppShellNative user={D2_USER} space={space} spaces={[]} currentId="sp-backend" isHome={home}
      canAdd onAdd={() => setOverlay({ kind: 'add' })} onHome={onGoHome} onMembers={() => {}}>
      {home ? <div style={{ flex: 1, background: 'var(--color-page)', padding: '16px 14px 32px' }}>{listBody}</div> : body}
    </AppShellNative>
  ) : (
    <div style={{ minHeight: 'var(--circ-vh)', display: 'flex', flexDirection: 'column', background: 'var(--color-canvas)' }}>
      <TopBar isMobile={isMobile} space={space} showMembers={false} onMenu={onToggleList} menuOpen={listOpen} />
      {body}
      {FAB && <FAB onClick={() => setOverlay({ kind: 'add' })} expanded={!!(overlay && overlay.kind === 'add')} isMobile={isMobile} />}
    </div>
  );

  const overlays = (
    <React.Fragment>
      {flow && (
        <SwellReactionFlow key={flow.id} item={flow}
          onMarkRead={(item, rx) => commitReaction(flow, rx)} onClose={() => setFlow(null)} />
      )}
      {overlay && overlay.kind === 'add' && (
        <D2AddSheet cfg={cfg} onClose={() => setOverlay(null)}
          onAdd={(p) => { if (p && p.url) { onAddItem(p); setTab('active'); } setOverlay(null); }} />
      )}
      {overlay && overlay.kind === 'record' && ov && (
        <D2Record item={ov.it} res={ov.res} cfg={cfg} opt={version} moment={overlay.moment}
          onClose={() => setOverlay(null)}
          onSend={(r) => sendVoice(ov.it.id, r, ov.res)}
          onPoint={(name) => point(ov.it.id, name)}
          onGraduate={() => onLocal(ov.it.id, { tableOn: true })}
          onOpenTable={() => { setOverlay(null); setTab('table'); }}
          onLand={(r) => onLocal(ov.it.id, { landed: { by: 'You', text: r.text } })} />
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
    <div className="d2-surface">
      <div className="d2-screen">{shell}</div>
      {overlays}
    </div>
  );
};

// ---- App -------------------------------------------------------------------
const D3App = () => {
  const saved = d3Load();
  const first = D3_VERSIONS.find((v) => v.id === saved.vid) || D3_VERSIONS[0];
  const [vid, setVid] = tS(first.id);
  const [ov, setOv] = tS({ ...D3_DEFAULT_CFG, ...(saved.ov || {}) });
  const [hood, setHood] = tS(false);
  const [tab, setTab] = tS(first.tab);
  // Play state is held per version, so coming back to one is not a loss.
  const [play, setPlay] = tS({});
  const [winW, setWinW] = tS(window.innerWidth);
  const [posture, setPosture] = tS(saved.posture || 'auto');
  const [listOpen, setListOpen] = tS(false);
  const [route, setRoute] = tS('home');

  tE(() => {
    const on = () => setWinW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  tE(() => { try { localStorage.setItem(D3_KEY, JSON.stringify({ vid, ov, posture })); } catch (e) {} }, [vid, ov, posture]);

  const appPosture = posture === 'mobile';
  const isMobile = appPosture ? true : winW < D3_BREAK;
  const docked = !appPosture && !isMobile;
  const version = D3_VERSIONS.find((v) => v.id === vid) || D3_VERSIONS[0];
  const cfg = d3Merge(version, ov);
  const dirty = Object.keys(D3_DEFAULT_CFG).some((k) => ov[k] !== 'auto');

  const mine = play[vid] || { local: {}, added: [] };
  const setMine = (patch) => setPlay((p) => ({ ...p, [vid]: { ...(p[vid] || { local: {}, added: [] }), ...patch } }));
  const onLocal = (id, patch) => setMine({ local: { ...mine.local, [id]: { ...(mine.local[id] || {}), ...patch } } });
  const addItem = (p) => {
    const url = /^https?:\/\//i.test(p.url) ? p.url : 'https://' + p.url;
    setMine({ added: [{
      id: 'd3-you-' + Date.now(), url, attribution: 'Added by you', reactions: [], read: false,
      preface: p.text ? { by: 'You', ...(p.ask ? { ask: p.text } : { text: p.text }), seal: !!p.seal } : null,
      voices: [], table: null,
    }].concat(mine.added) });
  };
  const reset = () => setMine({ local: {}, added: [] });

  const pick = (id) => {
    const v = D3_VERSIONS.find((x) => x.id === id) || D3_VERSIONS[0];
    setVid(id);
    setTab(v.tab);
    setRoute('circle');
    if (!docked) setListOpen(false);
  };

  const listBody = (
    <D3List vid={vid} pick={pick} hood={hood} setHood={setHood} ov={ov} setOv={setOv}
      dirty={dirty} posture={posture} setPosture={setPosture} onReset={reset} />
  );

  return (
    <div className="d2-page">
      {docked && <aside className="d2-rail">{listBody}</aside>}
      <D3Surface key={vid + JSON.stringify(ov)} appPosture={appPosture} isMobile={isMobile} framed={appPosture}
        home={appPosture && route === 'home'} listBody={listBody} onGoHome={() => setRoute('home')}
        listOpen={listOpen} onToggleList={() => setListOpen((v) => !v)}
        cfg={cfg} version={version} items={mine.added.concat(d3Items(version))}
        local={mine.local} onLocal={onLocal} onAddItem={addItem} tab={tab} setTab={setTab} />
      {!appPosture && isMobile && (
        <MobileDrawer open={listOpen} width={340} onClose={() => setListOpen(false)}>{listBody}</MobileDrawer>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<D3App />);
