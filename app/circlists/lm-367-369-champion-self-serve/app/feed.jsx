// ============================================================================
// LatentPulse — Feed. The product's heart.
// FeedCard (URL + attribution ONLY), AddReveal (sheet/popover), EmptyState,
// FeedLoading, ConfirmDialog (mark-read calm / delete destructive).
// ============================================================================

// ---- FeedCard --------------------------------------------------------------
// Anatomy: URL line (mono) + attribution block (sans, co-equal weight). No
// thumbnail, no title, no domain line, no badge. Actions are recessive.
const FeedCard = ({ item, tab, onOpen, onMarkRead, onDelete }) => {
  const former = /former member/i.test(item.attribution);
  // Display name parsed out of "Added by Sam R." for the avatar.
  const who = item.attribution.replace(/^added by\s+/i, '').replace(/\.$/, '');
  return (
    <article className="lp-card" style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border-1)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-5)',
      display: 'flex', flexDirection: 'column', gap: 'var(--space-4)',
    }}>
      {/* URL line — JetBrains Mono, inherits the old domain line's typographic role */}
      <a
        href={item.url} target="_blank" rel="noopener noreferrer"
        onClick={() => onOpen && onOpen(item)}
        className="lp-url"
        style={{
          fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 15,
          lineHeight: 1.5, color: 'var(--color-fg-1)',
          textDecoration: 'none', wordBreak: 'break-all',
          textDecorationColor: 'transparent',
        }}
      >{item.url}</a>

      {/* Attribution block — co-equal with the URL, never a footer. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <Avatar name={former ? null : who} size={32} />
        <span style={{
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16,
          lineHeight: 1.3, color: 'var(--color-fg-1)', letterSpacing: '-0.005em',
        }}>{item.attribution}</span>
      </div>

      {/* Recessive actions — quiet, separated by a hairline. */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 'var(--space-2)', paddingTop: 'var(--space-3)',
        borderTop: '1px solid var(--color-border-2)',
      }}>
        <button className="lp-cardaction" onClick={() => onOpen && onOpen(item)}>
          <Icon name="external-link" size={16} /><span>Open</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
          {tab === 'active' && (
            <button className="lp-cardaction" onClick={() => onMarkRead(item)}>
              <Icon name="check" size={16} /><span>Mark as read</span>
            </button>
          )}
          <button className="lp-cardaction lp-cardaction-icon" onClick={() => onDelete(item)} aria-label="Delete this link">
            <Icon name="trash" size={16} />
          </button>
        </div>
      </div>
    </article>
  );
};

// ---- Feed loading — a single quiet indicator (NOT a skeleton) --------------
const FeedLoading = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    gap: 'var(--space-3)', padding: '88px 24px', color: 'var(--color-fg-3)',
  }}>
    <Spinner size={22} light={false} />
    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-3)' }}>
      Loading this space…
    </span>
  </div>
);

// ---- Empty state — one neutral typographic destination, no illustration ----
// A single register, shown on an empty Active tab or an empty Read tab. No
// separate fresh-space variant, no "add the first link" CTA — the Add affordance
// (FAB / popover) already serves that.
const EMPTY_COPY = {
  primary: 'Nothing here.',
  supporting: 'Links shared in this space land in everyone’s queue, to read at your own pace.',
};
const EmptyState = () => {
  const c = EMPTY_COPY;
  return (
    <div style={{
      textAlign: 'center', minHeight: 320, padding: '72px 24px',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      gap: 'var(--space-3)',
    }}>
      <h2 style={{
        fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-3xl)',
        lineHeight: 1.2, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: 0,
      }}>{c.primary}</h2>
      <p style={{
        fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 16, lineHeight: 1.5,
        color: 'var(--color-fg-2)', margin: 0, maxWidth: 420,
      }}>{c.supporting}</p>
    </div>
  );
};

// ---- Add reveal surface — sheet (mobile) / popover (desktop) ---------------
const URL_RE = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i;
const AddReveal = ({ open, isMobile, onClose, onAdd }) => {
  const [url, setUrl] = React.useState('');
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef(null);
  const invokerRef = React.useRef(null);

  // Mount-transition: stay mounted through the slide-out before unmounting (mobile sheet).
  const [render, setRender] = React.useState(open);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    if (open) {
      setRender(true);
      let r2; const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setShown(true)); });
      return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
    }
    setShown(false);
    if (!isMobile) { setRender(false); return; }
    const t = setTimeout(() => setRender(false), 240);
    return () => clearTimeout(t);
  }, [open, isMobile]);

  React.useEffect(() => {
    if (open) {
      invokerRef.current = document.activeElement;
      setUrl(''); setError(null); setLoading(false);
      const id = setTimeout(() => inputRef.current && inputRef.current.focus(), 60);
      return () => clearTimeout(id);
    } else if (invokerRef.current && invokerRef.current.focus) {
      invokerRef.current.focus();
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!render) return null;

  const submit = (e) => {
    e.preventDefault();
    const v = url.trim();
    if (!URL_RE.test(v)) {
      setError('That doesn’t look like a valid URL. Check it and try again.');
      return;
    }
    setError(null); setLoading(true);
    const normalized = /^https?:\/\//i.test(v) ? v : 'https://' + v;
    // Commit holds a loading state until the write confirms.
    setTimeout(() => {
      onAdd({ id: 'i' + Date.now(), url: normalized, attribution: 'Added by You.', read: false });
      setLoading(false);
      onClose();
    }, 900);
  };

  const surface = isMobile
    ? {
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 121,
        background: 'var(--color-surface)',
        borderTopLeftRadius: 16, borderTopRightRadius: 16,
        padding: 'var(--space-5) var(--space-5) calc(var(--space-5) + env(safe-area-inset-bottom, 0px))',
        boxShadow: 'var(--shadow-overlay)',
        transform: shown ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform var(--duration-slow) var(--ease-quiet)',
      }
    : {
        position: 'fixed', right: 32, bottom: 100, width: 380, zIndex: 121,
        background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-1)',
        padding: 'var(--space-5)', boxShadow: 'var(--shadow-overlay)',
      };

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 120,
        background: isMobile ? 'var(--color-scrim)' : 'transparent',
        opacity: isMobile ? (shown ? 1 : 0) : 1,
        transition: isMobile ? 'opacity var(--duration-slow) ease-in-out' : 'none',
      }} />
      <form role="dialog" aria-label="Add a link" onSubmit={submit} style={surface}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--color-fg-1)' }}>Add a link</div>
          <button type="button" onClick={onClose} aria-label="Close" style={{
            background: 'transparent', border: 0, padding: 6, margin: -6, cursor: 'pointer',
            color: 'var(--color-fg-2)', display: 'inline-flex',
          }}><Icon name="x" size={18} /></button>
        </div>
        <Field
          ref={inputRef} name="add-url" mono type="text" inputMode="url"
          placeholder="https://" value={url} disabled={loading}
          onChange={(e) => { setUrl(e.target.value); if (error) setError(null); }}
          error={error}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" loading={loading}>{loading ? 'Adding…' : 'Add'}</Button>
        </div>
      </form>
    </>
  );
};

// ---- FAB — Active tab only -------------------------------------------------
const FAB = ({ onClick, expanded, isMobile }) => (
  <button onClick={onClick} aria-label="Add a link" style={{
    position: 'fixed', right: isMobile ? 24 : 32, bottom: isMobile ? 24 : 32, zIndex: 80,
    width: 56, height: 56, borderRadius: '50%',
    background: 'var(--color-accent)', color: '#fff', border: 0, cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(4,120,87,0.28), 0 1px 3px rgba(10,10,10,0.12)',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    transition: 'transform var(--duration-slow) var(--ease-quiet), background var(--duration-base)',
    transform: expanded ? 'rotate(45deg)' : 'none',
  }}>
    <Icon name="plus" size={24} color="#fff" strokeWidth={2} />
  </button>
);

// ---- ConfirmDialog — one primitive, calm vs destructive --------------------
const CONFIRM = {
  'mark-read': {
    title: 'Mark as read?',
    body: 'Moves to your Read tab. Others still see it in theirs.',
    primary: 'Mark as read', variant: 'primary', role: 'dialog',
  },
  'delete': {
    title: 'Delete this link?',
    body: 'It’s removed from the space for everyone, and can’t be undone.',
    primary: 'Delete', variant: 'destructive', role: 'alertdialog',
  },
};
const ConfirmDialog = ({ kind, onConfirm, onCancel }) => {
  const v = CONFIRM[kind];
  const cancelRef = React.useRef(null);
  const invokerRef = React.useRef(null);
  React.useEffect(() => {
    invokerRef.current = document.activeElement;
    const id = setTimeout(() => cancelRef.current && cancelRef.current.focus(), 40);
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(id);
      window.removeEventListener('keydown', onKey);
      if (invokerRef.current && invokerRef.current.focus) invokerRef.current.focus();
    };
  }, []);
  if (!v) return null;
  return (
    <div role={v.role} aria-modal="true" aria-label={v.title}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 130, background: 'var(--color-scrim)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }} className="lp-anim-fade">
      <div style={{
        background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)', maxWidth: 400, width: '100%',
        boxShadow: 'var(--shadow-overlay)',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 'var(--text-2xl)',
          lineHeight: 1.3, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', margin: '0 0 8px',
        }}>{v.title}</h2>
        <p style={{
          fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 15, lineHeight: 1.55,
          color: 'var(--color-fg-2)', margin: '0 0 var(--space-6)',
        }}>{v.body}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
          <Button ref={cancelRef} variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant={v.variant} onClick={onConfirm}>{v.primary}</Button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { FeedCard, FeedLoading, EmptyState, AddReveal, FAB, ConfirmDialog });
