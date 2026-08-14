// ============================================================================
// Discourse v2 — the shell.
// The rail replaces the circle rail (docked >= 1024, the app's own MobileDrawer
// below it, the app posture's Home destination on a phone) and carries four
// panes: the settled shape, the seven continuation directions, the levers, and
// the loop driver. One app surface renders whatever is selected.
// ============================================================================

const { useState: dS, useEffect: dE, useRef: dRef } = React;
const {
  D2_OPTIONS, D2_LEVERS, D2_DEFAULT_CFG, D2_SHAPE, D2_ITEMS, D2_USER, D2_WORDS,
  d2Merge, d2Resolve, D2Card, D2Record, D2AddSheet, D2TableEntry, D2Tabs, D2Empty,
  AppShellNative, SwellReactionFlow, TopBar, MobileDrawer, FAB,
} = window;

// Posture exactly as main.jsx resolves it. Never invent a breakpoint.
const D2_BREAK = 1024;
const D2_KEY = 'pg_d2_discourse_v1';
const d2Load = () => { try { return JSON.parse(localStorage.getItem(D2_KEY)) || {}; } catch (e) { return {}; } };

const D2Seg = ({ label, value, opts, onChange }) => (
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
const D2Surface = ({ appPosture, isMobile, framed, home, railBody, onGoHome, railOpen, onToggleRail,
  cfg, opt, items, local, onLocal, onAddItem, tab, setTab, jump, onJumpDone }) => {
  const [overlay, setOverlay] = dS(null);
  const [flow, setFlow] = dS(null);

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

  const all = items.map(withLocal);
  const resolved = all.map((it) => ({ it, res: d2Resolve(it, cfg, opt) }));
  const active = resolved.filter((r) => !r.it.read);
  const read = resolved.filter((r) => r.it.read);
  const table = resolved.filter((r) => r.res.tableOn);
  const find = (id) => resolved.find((r) => r.it.id === id);

  dE(() => {
    if (!jump) return;
    const w = jump.what;
    if (w === 'add') setOverlay({ kind: 'add' });
    if (w === 'wait') { setTab('active'); setOverlay(null); }
    if (w === 'read') { const t = active[0]; if (t) { setTab('active'); setFlow(t.it); } }
    if (w === 'record') { const t = read.find((r) => r.res.words) || read[0]; if (t) { setTab('read'); openRecord(t.it.id); } }
    if (w === 'continue') {
      if (cfg.graduate !== 'none' && table.length) setTab('table');
      else { const t = read.find((r) => r.res.canSpeak || r.res.addressable.length) || read[0]; if (t) { setTab('read'); openRecord(t.it.id); } }
    }
    if (w === 'land') {
      if (cfg.graduate !== 'none' && table.length) setTab('table');
      else { const t = read.find((r) => r.res.words) || read[0]; if (t) { setTab('read'); openRecord(t.it.id); } }
    }
    onJumpDone();
  }, [jump]);

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
    // Rewriting replaces your line rather than adding one (K1).
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
          onMarkRead={(item, rx) => commitReaction(flow, rx)} onClose={() => setFlow(null)} />
      )}
      {overlay && overlay.kind === 'add' && (
        <D2AddSheet cfg={cfg} onClose={() => setOverlay(null)}
          onAdd={(p) => { if (p && p.url) { onAddItem(p); setTab('active'); } setOverlay(null); }} />
      )}
      {overlay && overlay.kind === 'record' && ov && (
        <D2Record item={ov.it} res={ov.res} cfg={cfg} opt={opt} moment={overlay.moment}
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

// ---- The loop --------------------------------------------------------------
const D2Loop = ({ opt, cfg, onJump }) => {
  const beats = [
    { k: 'add', n: '1', t: 'A link goes out with a reason', b: cfg.preface === 'hidden' ? 'The line is written at share and held back until each member has read the item.' : cfg.preface === 'card' ? 'The line is written at share and travels with the link.' : 'The line is written at share and travels with the link. Its author can seal it.', c: 'Open Add' },
    { k: 'wait', n: '2', t: 'It waits, and the reason is readable', b: cfg.preface === 'hidden' ? 'Nothing is readable yet \u2014 the card is a headline, as it is today.' : 'The card carries the sharer\u2019s line. That is what makes somebody pick this one out of eight.', c: 'Show the list' },
    { k: 'read', n: '3', t: 'You finish it, and react', b: 'The shipped reaction pad, unchanged \u2014 the real component, the real gesture.', c: 'Mark one read' },
    { k: 'record', n: '4', t: 'The record opens in the same breath', b: 'No timer. The reaction commits and the record takes the sheet\u2019s place: the disc, then what the circle said, then your line.', c: 'Open a record' },
    { k: 'continue', n: '5', t: 'It continues \u2014 or it cannot', b: D2_WORDS.turns[cfg.turns] + (cfg.graduate !== 'none' ? ', and freely at the table.' : '.'), c: cfg.graduate !== 'none' ? 'Go to the table' : 'Open a record' },
    { k: 'land', n: '6', t: 'It lands', b: cfg.land ? 'Somebody writes what the circle takes from it. The record closes with that at the top, and the item leaves the table.' : 'Nothing closes it. This direction has no ending \u2014 the exchange just stops.', c: cfg.land ? 'Where landing happens' : 'See where it would go' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="d2-pane-h">The loop</div>
      {beats.map((b) => (
        <div key={b.k} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)', padding: '12px 14px', boxShadow: 'var(--shadow-raised)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-fg-3)' }}>{b.n}</span>
            <span style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--color-fg-1)' }}>{b.t}</span>
          </div>
          <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--color-fg-2)', margin: '5px 0 0' }}>{b.b}</div>
          <button onClick={() => onJump(b.k)} className="pg-ghost" style={{ marginTop: 9 }}>{b.c}</button>
        </div>
      ))}
      <div className="d2-pane-h" style={{ marginTop: 8 }}>Its answers</div>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-lg)', padding: '4px 14px' }}>
        {[['Turns', D2_WORDS.turns[cfg.turns]], ['The table', D2_WORDS.graduate[cfg.graduate]],
          ['Landing', cfg.land ? 'anyone can close it with a takeaway' : 'no ending'],
          ['Sharer\u2019s line', D2_WORDS.preface[cfg.preface]], ['Read card', D2_WORDS.bloat[cfg.bloat]],
          ['The record', D2_WORDS.record[cfg.record]], ['Pointing', D2_WORDS.echo[cfg.echo]],
          ['Prompt', D2_WORDS.prompt[cfg.prompt]], ['Names', D2_WORDS.names[cfg.names]],
          ['Length', cfg.limit + ' characters']].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', gap: 12, alignItems: 'baseline', padding: '7px 0', borderBottom: '1px solid var(--color-border-2)' }}>
            <span style={{ width: 92, flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-fg-3)' }}>{k}</span>
            <span style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--color-fg-1)' }}>{v}</span>
          </div>
        ))}
        <div style={{ padding: '9px 0', fontSize: 12, lineHeight: 1.5, color: 'var(--color-fg-3)' }}>Why it is not a chat: {opt.theory}</div>
      </div>
    </div>
  );
};

// ---- The rail body ---------------------------------------------------------
const D2RailBody = ({ opt, optId, cfg, ov, setOv, pane, setPane, pick, dirty, posture, setPosture, onJump, onReset }) => {
  const paneBtn = (id, label) => (
    <button onClick={() => setPane(id)} aria-pressed={pane === id} style={{
      flex: 1, background: pane === id ? 'var(--color-surface)' : 'transparent', border: 0, cursor: 'pointer',
      boxShadow: pane === id ? 'var(--shadow-raised)' : 'none', borderRadius: 6, padding: '7px 6px', minHeight: 36,
      fontFamily: 'var(--font-sans)', fontWeight: pane === id ? 600 : 500, fontSize: 12.5,
      color: pane === id ? 'var(--color-fg-1)' : 'var(--color-fg-2)', whiteSpace: 'nowrap',
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
        {paneBtn('shape', 'The shape')}
        {paneBtn('cont', 'Continue')}
        {paneBtn('cfg', 'Levers')}
        {paneBtn('loop', 'Loop')}
      </div>

      {pane === 'shape' && (
        <React.Fragment>
          <p style={{ margin: '0 4px 14px', fontSize: 12.5, lineHeight: 1.5, color: 'var(--color-fg-2)' }}>
            Ten statements your notes settled. They are the app in front of you, in every direction {'\u2014'} argue with any of them and it becomes a lever.
          </p>
          <ol style={{ margin: 0, padding: '0 4px', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 11 }}>
            {D2_SHAPE.map(([s, from], i) => (
              <li key={i} style={{ display: 'flex', gap: 9 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-fg-3)', paddingTop: 2, flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--color-fg-1)' }}>{s}</span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--color-fg-3)', marginTop: 3 }}>{from}</span>
                </span>
              </li>
            ))}
          </ol>
          <div style={{ margin: '18px 4px 0', paddingTop: 14, borderTop: '1px solid var(--color-border-1)', fontSize: 12.5, lineHeight: 1.5, color: 'var(--color-fg-3)' }}>
            Parked on purpose: the card flip, marginalia as its own direction, stems as a grammar (kept as the losing position under Levers), and a table that takes items out of the feed.
          </div>
        </React.Fragment>
      )}

      {pane === 'cont' && (
        <React.Fragment>
          <p style={{ margin: '0 4px 16px', fontSize: 12.5, lineHeight: 1.5, color: 'var(--color-fg-2)' }}>
            The open question: what happens when one line is not enough? Seven answers, each with a different reason it does not become a chat.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {D2_OPTIONS.map((o) => {
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
            Every lever defaults to <strong style={{ fontWeight: 600 }}>Auto</strong>{' \u2014 the settled spine, or this direction\u2019s own answer where it has one.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {D2_LEVERS.filter((l) => l.group === 'shape').map((l) => (
              <D2Seg key={l.key} label={l.label} value={ov[l.key]} opts={l.opts} onChange={(v) => setOv({ ...ov, [l.key]: v })} />
            ))}
            <div style={{ height: 1, background: 'var(--color-border-1)', margin: '4px 0' }} />
            {D2_LEVERS.filter((l) => l.group === 'state').map((l) => (
              <D2Seg key={l.key} label={l.label} value={ov[l.key]} opts={l.opts} onChange={(v) => setOv({ ...ov, [l.key]: v })} />
            ))}
            <div style={{ height: 1, background: 'var(--color-border-1)', margin: '4px 0' }} />
            <D2Seg label="Viewport" value={posture} opts={[['auto', 'Auto'], ['mobile', 'Mobile']]} onChange={setPosture} />
          </div>
          {dirty && (
            <div style={{ marginTop: 12, fontSize: 12, lineHeight: 1.5, color: 'var(--color-fg-3)' }}>
              The app is no longer showing the settled answer to every lever.
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {dirty && <button onClick={() => setOv({ ...D2_DEFAULT_CFG })} className="pg-ghost">Reset to Auto</button>}
            <button onClick={onReset} className="pg-ghost">Reset feed</button>
          </div>
        </React.Fragment>
      )}

      {pane === 'loop' && <D2Loop opt={opt} cfg={cfg} onJump={onJump} />}
    </React.Fragment>
  );
};

// ---- App -------------------------------------------------------------------
const D2App = () => {
  const saved = d2Load();
  const [optId, setOptId] = dS(saved.optId || 'table');
  const [ov, setOv] = dS({ ...D2_DEFAULT_CFG, ...(saved.ov || {}) });
  const [tab, setTab] = dS('active');
  const [pane, setPane] = dS(saved.pane || 'shape');
  const [local, setLocal] = dS({});
  const [added, setAdded] = dS([]);
  const [jump, setJump] = dS(null);
  const [winW, setWinW] = dS(window.innerWidth);
  const [posture, setPosture] = dS(saved.posture || 'auto');
  const [railOpen, setRailOpen] = dS(false);
  const [route, setRoute] = dS('circle');

  dE(() => {
    const on = () => setWinW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  dE(() => { try { localStorage.setItem(D2_KEY, JSON.stringify({ optId, ov, pane, posture })); } catch (e) {} }, [optId, ov, pane, posture]);

  const appPosture = posture === 'mobile';
  const isMobile = appPosture ? true : winW < D2_BREAK;
  const docked = !appPosture && !isMobile;
  const opt = D2_OPTIONS.find((o) => o.id === optId) || D2_OPTIONS[0];
  const cfg = d2Merge(opt, ov);
  const dirty = Object.keys(D2_DEFAULT_CFG).some((k) => ov[k] !== 'auto');
  const onLocal = (id, patch) => setLocal((m) => ({ ...m, [id]: { ...(m[id] || {}), ...patch } }));
  // A real add: the link lands in Active with your line, exactly as shared.
  const addItem = (p) => {
    const url = /^https?:\/\//i.test(p.url) ? p.url : 'https://' + p.url;
    setAdded((a) => [{
      id: 'd2-you-' + Date.now(), url, attribution: 'Added by you', reactions: [], read: false,
      preface: p.text ? { by: 'You', ...(p.ask ? { ask: p.text } : { text: p.text }), seal: !!p.seal } : null,
      voices: [], table: null,
    }].concat(a));
  };
  const reset = () => { setLocal({}); setAdded([]); setTab('active'); };
  const pick = (id) => { setOptId(id); setLocal({}); setAdded([]); setTab('active'); setRoute('circle'); if (!docked) setRailOpen(false); };

  const railBody = (
    <D2RailBody opt={opt} optId={optId} cfg={cfg} ov={ov} setOv={setOv} pane={pane} setPane={setPane}
      pick={pick} dirty={dirty} posture={posture} setPosture={setPosture} onReset={reset}
      onJump={(what) => { setJump({ what, at: Date.now() }); setRoute('circle'); if (!docked) setRailOpen(false); }} />
  );

  return (
    <div className="d2-page">
      {docked && <aside className="d2-rail">{railBody}</aside>}
      <D2Surface key={optId + JSON.stringify(ov)} appPosture={appPosture} isMobile={isMobile} framed={appPosture}
        home={appPosture && route === 'home'} railBody={railBody} onGoHome={() => setRoute('home')}
        railOpen={railOpen} onToggleRail={() => setRailOpen((v) => !v)}
        cfg={cfg} opt={opt} items={added.concat(D2_ITEMS)} local={local} onLocal={onLocal} onAddItem={addItem}
        tab={tab} setTab={setTab} jump={jump} onJumpDone={() => setJump(null)} />
      {!appPosture && isMobile && (
        <MobileDrawer open={railOpen} width={340} onClose={() => setRailOpen(false)}>{railBody}</MobileDrawer>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<D2App />);
