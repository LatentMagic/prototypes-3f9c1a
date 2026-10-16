// ============================================================================
// Golden Sample App - Home, the queue (S7-S9). Items live in GsaStore; this file
// holds the list, the tabs, the add form and mark as done. Styles: gsa-queue.css.
// Operations are list, create and mark done. Nothing more.
// ============================================================================

const GSA_QUEUE_LOAD_MS = 200;
const GSA_QUEUE_SAVE_MS = 400;
const GSA_QUEUE_TABS = [{ id: 'active', label: 'Active' }, { id: 'done', label: 'Done' }];

function gsaQueueTitleRule(value) {
  const t = (value || '').trim();
  if (!t) return 'Title is required';
  if (t.length > 200) return 'Title must be 200 characters or fewer';
  return null;
}

// Matches monorepo main (item-validators.ts, content-item.schema.ts): trimmed; must parse as a URL
// (an empty host does not); then the case-sensitive scheme check; at most 2048.
function gsaQueueUrlRule(value) {
  const u = (value || '').trim();
  let parses = true;
  try { new URL(u); } catch (e) { parses = false; }
  if (/\s/.test(u)) parses = false; // main's server (Node) refuses a space in the host; browsers encode it
  if (!parses && /^https?:\/\//.test(u)) return 'Enter a valid URL, like https://example.com';
  if (!parses || !/^https?:\/\//.test(u)) return 'URL must use http or https protocol';
  if (u.length > 2048) return 'URL must be 2048 characters or fewer';
  return null;
}

function gsaQueueNewest(items, status) {
  return items
    .filter((i) => i.status === status)
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function GsaQueueCard({ item, onDone }) {
  const done = item.status === 'done';
  return (
    <li className="gsa-queue-card" id={'gsa-queue-item-' + item.id} tabIndex={-1} data-status={item.status}>
      <div className="gsa-queue-card-title">{item.title}</div>
      <div className="gsa-queue-card-url">{item.url}</div>
      {done ? null : (
        <div className="gsa-queue-card-foot">
          <GsaButton kind="secondary" aria-label={'Mark ' + item.title + ' as done'} onClick={() => onDone(item)}>Mark as done</GsaButton>
        </div>
      )}
    </li>
  );
}

function GsaQueueForm({ onCancel, onAdded }) {
  const [busy, run] = useGsaBusy(900);
  const [failed, setFailed] = React.useState(false);
  const form = useGsaForm({ title: gsaQueueTitleRule, url: gsaQueueUrlRule });
  // "+ Add item" opens the form with focus on Title.
  React.useEffect(() => {
    const el = document.getElementById('gsa-form-title');
    if (el) el.focus({ preventScroll: true });
  }, []);
  const send = form.submit((values) => {
    setFailed(false);
    run(() => {
      if (window.GsaStore.get().queue.save === 'fail') { setFailed(true); return; }
      const item = {
        id: 'item-' + Date.now(),
        title: values.title.trim(),
        url: values.url.trim(),
        status: 'active',
        createdAt: new Date(),
      };
      window.GsaStore.set((s) => ({ items: [item].concat(s.items) }));
      onAdded(item);
    });
  });
  return (
    <form className="gsa-queue-form" onSubmit={send} noValidate>
      <GsaField label="Title" placeholder="What are you saving?" autoComplete="off" {...form.bind('title')} />
      <GsaField label="URL" placeholder="https://..." type="url" autoComplete="off" {...form.bind('url')} />
      {failed ? <div className="gsa-queue-error" role="alert">That item was not added. Your title and URL are kept; please try again.</div> : null}
      <div className="gsa-queue-form-actions">
        <GsaButton kind="secondary" onClick={onCancel} disabled={busy}>Cancel</GsaButton>
        <GsaButton type="submit" busy={busy}>Add to Queue</GsaButton>
      </div>
    </form>
  );
}

function GsaQueueTabs({ tab, onTab }) {
  const keys = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const at = GSA_QUEUE_TABS.findIndex((t) => t.id === tab);
    const next = GSA_QUEUE_TABS[(at + (e.key === 'ArrowRight' ? 1 : GSA_QUEUE_TABS.length - 1)) % GSA_QUEUE_TABS.length];
    onTab(next.id);
    const el = document.getElementById('gsa-queue-tab-' + next.id);
    if (el) el.focus();
  };
  return (
    <div className="gsa-queue-tabs" role="tablist" aria-label="Queue" onKeyDown={keys}>
      {GSA_QUEUE_TABS.map((t) => (
        <button
          key={t.id}
          id={'gsa-queue-tab-' + t.id}
          type="button"
          role="tab"
          className="gsa-queue-tab"
          aria-selected={tab === t.id ? 'true' : 'false'}
          aria-controls="gsa-queue-panel"
          tabIndex={tab === t.id ? 0 : -1}
          onClick={() => onTab(t.id)}
        >{t.label}</button>
      ))}
    </div>
  );
}

function GsaHome() {
  const g = useGsa();
  const Ask = window.GsaPushAsk;
  const [tab, setTab] = React.useState('active');
  const [adding, setAdding] = React.useState(false);
  const [phase, setPhase] = React.useState('pending');
  const [loaded, setLoaded] = React.useState(false);
  const [markError, setMarkError] = React.useState(false);
  const inflight = React.useRef(false);
  const alive = React.useRef(true);
  const panel = React.useRef(null);
  const heading = React.useRef(null);
  const addBtn = React.useRef(null);
  const retryBtn = React.useRef(null);
  // Focus the form's exit or the next thing, once the screen has re-rendered (ui-design: focus restoration).
  const focusNext = React.useRef(null);
  const flag = g.queue.load;

  React.useEffect(() => () => { alive.current = false; }, []);

  // Each tab switch and each Try again fetches the list again. Held: stays pending.
  React.useEffect(() => {
    if (phase !== 'pending' || flag === 'hold') return undefined;
    const t = setTimeout(() => {
      if (flag === 'fail') { setPhase('failed'); return; }
      setPhase('ready');
      setLoaded(true);
    }, GSA_QUEUE_LOAD_MS);
    return () => clearTimeout(t);
  }, [phase, flag]);

  React.useEffect(() => {
    const want = focusNext.current;
    if (!want) return;
    const opts = { preventScroll: false };
    if (want.kind === 'add') { if (addBtn.current) { addBtn.current.focus(opts); focusNext.current = null; } return; }
    if (want.kind === 'item') {
      if (phase === 'pending' && !loaded) return;
      const card = document.getElementById('gsa-queue-item-' + want.id);
      const el = card || heading.current;
      if (el) el.focus(opts);
      focusNext.current = null;
      return;
    }
    if (want.kind === 'retry') {
      if (phase === 'pending') return;
      const el = phase === 'failed' ? retryBtn.current : panel.current;
      if (el) el.focus(opts);
      focusNext.current = null;
    }
  });

  const refetch = () => setPhase('pending');
  const retry = () => { focusNext.current = { kind: 'retry' }; refetch(); };
  const closeForm = () => { focusNext.current = { kind: 'add' }; setAdding(false); };
  const added = (item) => { focusNext.current = { kind: 'item', id: item.id }; setAdding(false); };
  const pickTab = (id) => { if (id === tab) return; setTab(id); refetch(); };

  const markDone = (item) => {
    if (inflight.current) return;
    inflight.current = true;
    setMarkError(false);
    window.GsaStore.set((s) => ({ items: s.items.map((i) => (i.id === item.id ? { ...i, status: 'done' } : i)) }));
    if (panel.current) panel.current.focus({ preventScroll: true });
    setTimeout(() => {
      inflight.current = false;
      if (window.GsaStore.get().queue.save !== 'fail') return;
      window.GsaStore.set((s) => ({ items: s.items.map((i) => (i.id === item.id ? { ...i, status: 'active' } : i)) }));
      if (alive.current) setMarkError(true);
    }, GSA_QUEUE_SAVE_MS);
  };

  const shown = gsaQueueNewest(g.items, tab);
  let body;
  if (phase === 'failed') {
    body = (
      <div className="gsa-load-failed" role="alert">
        <h2 className="gsa-queue-failed-title">Couldn't load your queue</h2>
        <p>Something went wrong. Please try again.</p>
        <GsaButton ref={retryBtn} kind="secondary" onClick={retry}>Try again</GsaButton>
      </div>
    );
  } else if (phase === 'pending' && !loaded) {
    body = <GsaSpin />;
  } else {
    body = (
      <>
        {phase === 'pending' ? <div className="gsa-queue-refreshing" role="status">Refreshing…</div> : null}
        {shown.length === 0 ? (
          tab === 'active' ? (
            <div className="gsa-queue-empty"><p className="gsa-queue-empty-title">Your queue is empty</p><p>Items you add will appear here</p></div>
          ) : (
            <div className="gsa-queue-empty"><p className="gsa-queue-empty-title">No completed items yet</p></div>
          )
        ) : (
          <ul className="gsa-queue-list">
            {shown.map((item) => <GsaQueueCard key={item.id} item={item} onDone={markDone} />)}
          </ul>
        )}
      </>
    );
  }

  return (
    <div className="gsa-page gsa-queue">
      {Ask ? <Ask /> : null}
      <div className="gsa-queue-head">
        <h1 className="gsa-heading" tabIndex={-1} ref={heading}>Content Queue</h1>
        {adding ? null : <GsaButton ref={addBtn} onClick={() => setAdding(true)}>+ Add item</GsaButton>}
      </div>
      {adding ? <GsaQueueForm onCancel={closeForm} onAdded={added} /> : null}
      {markError ? <div className="gsa-queue-error" role="alert">Couldn't mark that as done. Please try again.</div> : null}
      <GsaQueueTabs tab={tab} onTab={pickTab} />
      <div id="gsa-queue-panel" className="gsa-queue-panel" role="tabpanel" aria-labelledby={'gsa-queue-tab-' + tab} tabIndex={-1} ref={panel}>
        {body}
      </div>
    </div>
  );
}

Object.assign(window, { GsaHome });
