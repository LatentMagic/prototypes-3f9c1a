// ============================================================================
// Circlists — Feed. The product's heart.
// FeedCard (URL + attribution ONLY), AddReveal (sheet/popover), EmptyState,
// FeedLoading, ConfirmDialog (mark-read calm / delete destructive).
// ============================================================================

// ---- FeedCard --------------------------------------------------------------
// Enriched card (BIZ-80) — "List dense — foot, edge-matched". Dense body
// (source line + extracted title + right-hand preview), the real app's footer
// below (attribution left, actions right). The trailing action's optical edge
// is pulled onto the image's right edge, so tick/delete read as aligned to the
// media rather than floating — the resolution the alignment study landed on.
//   - Open affordance = title + image ONLY (both link out). Source, favicon,
//     attribution and footer never open.
//   - Failed extraction -> the URL becomes the headline (mono, black, a touch
//     smaller): an honest raw address, never a naked/broken card. Source still
//     falls back to the bare domain.
//   - Favicon is an optional garnish beside the source; genuine absence shows
//     nothing (never a fabricated globe). No preview -> a calm source-keyed
//     tint block (never a fabricated photo).
//   - Mark-as-read (Active tab) opens the Swell flow; the Read tab shows the
//     Swell door in its place. Delete opens the confirm dialog. Both unchanged.
const feedHostOf = (url) => {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch (e) { return String(url).replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]; }
};
// Best-effort title from the URL path when extraction gave one but the seed
// carries none — the test fixtures rely on it; the real spaces author titles.
const feedDeriveTitle = (url) => {
  try {
    const seg = (new URL(url).pathname.split('/').filter(Boolean).pop() || '')
      .replace(/\.(html?|php|aspx?)$/i, '').replace(/[-_]+/g, ' ').trim();
    if (!seg || /^\d+$/.test(seg) || seg.length < 3) return null;
    return seg.charAt(0).toUpperCase() + seg.slice(1);
  } catch (e) { return null; }
};
// Source-keyed tint blocks — the "bits of colour" fallback preview: never a
// fabricated photo, just a calm two-tone block so a card is never naked. Muted,
// paper-adjacent hues that sit inside the theme.
const FEED_TINTS = [
  ['#3a3a38', '#5a5a56'], ['#33413f', '#54655f'], ['#403830', '#645749'],
  ['#343a4a', '#565f77'], ['#42323c', '#66505d'],
];
const feedHash = (s) => { let h = 0; s = String(s || ''); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
const feedTint = (key) => { const g = FEED_TINTS[feedHash(key) % FEED_TINTS.length]; return 'linear-gradient(135deg,' + g[0] + ',' + g[1] + ')'; };

const FeedCard = ({ item, tab, user, showTime = true, onOpen, onMarkRead, onDelete }) => {
  const [favBroken, setFavBroken] = React.useState(false);
  const [imgBroken, setImgBroken] = React.useState(false);

  const former = /former member/i.test(item.attribution);
  // The current user always reads lower-case "you" in the shared view; normalise
  // here so older persisted state ('Added by You') renders the same as new items.
  const attribution = item.attribution.replace(/^(added by\s+)you\b/i, '$1you');
  // Adaptive attribution: split the "Added by " prefix so a container query can
  // drop it on a very narrow card (see .circ-attrib-pre in circlists.html).
  const attribPre = /^added by\s+/i.exec(attribution);
  // Display name parsed out of "Added by Sam R." for the avatar. The line always
  // reads "You" for the current user's own items (shared-view convention); the
  // avatar uses the account's real name + accent, same as the roster.
  const whoName = attribution.replace(/^added by\s+/i, '').replace(/\.$/, '');
  const isYou = /^you$/i.test(whoName);
  const avatarName = isYou ? displayName(user) : whoName;

  const host = feedHostOf(item.url);
  const source = item.source || host;               // source is always present
  const title = item.title || feedDeriveTitle(item.url);
  const prettyUrl = item.url.replace(/^https?:\/\//, '');
  const showImage = item.hasImage !== false;
  const faviconOk = item.faviconExists !== false && !favBroken;
  // Favicons: baked-in local files win over Google's live service, so the demo
  // renders the real mark offline (see uploads/card-favicons/). Host is matched
  // on the registrable domain, so www./sub. hosts hit the same file.
  const faviconUrl = (window.CircFavicons && window.CircFavicons(host))
    || ('https://www.google.com/s2/favicons?domain=' + encodeURIComponent(host) + '&sz=64');

  // When it landed — coarse words on the attribution line (never a clock time,
  // never a count). Derived from the item's own timestamp so it stays honest as
  // the session ages; absent unless the item carries one.
  const when = showTime ? (window.circWhen ? window.circWhen(item.at) : null) : null;

  const open = () => onOpen && onOpen(item);
  const openLinkProps = { href: item.url, target: '_blank', rel: 'noopener noreferrer', onClick: open };

  // Pending — extraction still resolving. Same layout, but the source line and
  // preview render as quiet skeletons and the URL stands in as the title; the
  // slot is held so the resolve fills in place with no reflow. Never a spinner.
  if (item.pending) {
    return (
      <article className="circ-card" style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
        borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-5)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="circ-skel" aria-hidden="true" style={{ width: 120, height: 13, borderRadius: 3 }} />
            <a {...openLinkProps} className="circ-cardtitle circ-cardurl" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 14, lineHeight: 1.45, color: 'var(--color-fg-3)', textDecoration: 'none', wordBreak: 'break-all', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{prettyUrl}</a>
          </div>
          <span className="circ-skel" aria-hidden="true" style={{ flexShrink: 0, width: 60, height: 60, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-2)' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
          <Avatar name={avatarName} size={28} accent={isYou} />
          <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-semibold)', fontSize: 14, lineHeight: 1.3, color: 'var(--color-fg-1)', letterSpacing: '-0.005em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{attribution}</span>
          <div aria-hidden="true" style={{ display: 'flex', alignItems: 'center', gap: 0, marginRight: -13, opacity: 0.4, pointerEvents: 'none' }}>
            <span className="circ-cardaction circ-cardaction-icon"><Icon name="check" size={18} /></span>
            <span className="circ-cardaction circ-cardaction-icon"><Icon name="trash" size={17} /></span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="circ-card" style={{
      background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
      borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-5)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Open zone — source + title (left), preview (right). Title + image are
          the only open targets; nothing else in the card opens. */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            {faviconOk && (
              <span style={{ width: 15, height: 15, borderRadius: 3, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--color-border-2)', display: 'inline-flex' }}>
                <img src={faviconUrl} alt="" onError={() => setFavBroken(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </span>
            )}
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: item.source ? 600 : 500, fontSize: 13, color: 'var(--color-fg-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: 1 }}>{source}</span>
          </div>
          {title
            ? <a {...openLinkProps} className="circ-cardtitle" style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, lineHeight: 1.3, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', textDecoration: 'none', textWrap: 'pretty', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{title}</a>
            : <a {...openLinkProps} className="circ-cardtitle circ-cardurl" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 14, lineHeight: 1.45, color: 'var(--color-fg-1)', textDecoration: 'none', wordBreak: 'break-all', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{prettyUrl}</a>}
        </div>
        {showImage && (
          <a {...openLinkProps} tabIndex={-1} aria-hidden="true" className="circ-thumblink" style={{ flexShrink: 0, display: 'block', width: 60, height: 60, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border-2)' }}>
            {item.image && !imgBroken
              ? <img src={item.image} alt="" onError={() => setImgBroken(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : <span style={{ display: 'block', width: '100%', height: '100%', background: feedTint(source) }} />}
          </a>
        )}
      </div>

      {/* Footer — attribution (left) + recessive actions (right). The action
          cluster's optical edge is pulled onto the card's content edge (= the
          image's right edge). On Read, the Swell door takes the tick's place. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
        <Avatar name={former ? null : avatarName} size={28} accent={isYou} />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 9 }}>
          <span style={{ minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-semibold)', fontSize: 14, lineHeight: 1.3, color: 'var(--color-fg-1)', letterSpacing: '-0.005em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {attribPre
              ? <React.Fragment><span className="circ-attrib-pre">{attribPre[0]}</span><span className="circ-attrib-rest">{attribution.slice(attribPre[0].length)}</span></React.Fragment>
              : attribution}
          </span>
          {/* Micro text right after the attribution, separated by space alone — no
              interpunct. Never shrinks, so a long name ellipses first. */}
          {when && (
            <span style={{ flexShrink: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 11, lineHeight: 1.3, color: 'var(--color-fg-3)', whiteSpace: 'nowrap' }}>{when}</span>
          )}
        </div>
        {/* Edge-locked actions (BIZ-80 alignment study). The trailing delete's
            optical edge is pulled onto the image's right edge via the -13 nudge;
            each action keeps a full 44px target with its hover fill inset, and
            that inset gap carries the separation — no drawn hairline. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginRight: -13 }}>
          {tab === 'read'
            ? <SwellDoor item={item} />
            : (
              <button className="circ-cardaction circ-cardaction-icon" onClick={() => onMarkRead(item)} aria-label="Mark as read" title="Mark as read">
                <Icon name="check" size={18} />
              </button>
            )}
          <button className="circ-cardaction circ-cardaction-icon" onClick={() => onDelete(item)} aria-label="Delete this link" title="Delete">
            <Icon name="trash" size={17} />
          </button>
        </div>
      </div>
    </article>
  );
};

// ---- Feed loading — a single quiet indicator (NOT a skeleton) --------------
const FeedLoading = () => (
  <div role="status" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {/* No caption — the mark is the whole loading state (spec's calm floor).
        Centred by the parent <main>. The SVG's aria-label="Loading" inside this
        role="status" region carries the accessible announcement; no visible
        text is needed for a11y. */}
    <BrandSpinner size={100} />
  </div>
);

// ---- Empty state — one neutral typographic destination, no illustration ----
// A single register, shown on an empty Active tab or an empty Read tab. No
// separate fresh-space variant, no "add the first link" CTA — the Add affordance
// (FAB / popover) already serves that.
const EMPTY_COPY = {
  active: {
    primary: 'Nothing here.',
    supporting: 'Links shared in this circle land in everyone\u2019s list, to consume at your own pace.',
  },
  read: {
    primary: 'Nothing here.',
    supporting: 'Links you mark as read land here, but stay in everyone else\u2019s list.',
  },
};
const EmptyState = ({ tab, onStartCircle }) => {
  const c = EMPTY_COPY[tab === 'read' ? 'read' : 'active'];
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
      {/* Door: quiet line, only the verb phrase is the link. */}
      <p style={{
        fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 14, lineHeight: 1.5,
        color: 'var(--color-fg-3)', margin: 'var(--space-4) 0 0',
      }}>When you want a circle of your own, <button type="button" onClick={onStartCircle} className="circ-doorlink" style={{
        backgroundColor: 'transparent', border: 0, padding: 0, cursor: 'pointer', font: 'inherit',
      }}>start one</button>.</p>
    </div>
  );
};

// ---- Add reveal surface — sheet (mobile) / popover (desktop) ---------------
const URL_RE = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i;
const AddReveal = ({ open, isMobile, onClose, onAdd }) => {
  const [url, setUrl] = React.useState('');
  const [error, setError] = React.useState(null);
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
      setUrl(''); setError(null);
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
      setError('That doesn\u2019t look like a valid URL. Check it and try again.');
      return;
    }
    setError(null);
    const normalized = /^https?:\/\//i.test(v) ? v : 'https://' + v;
    // Extraction is slow + unreliable, so add never blocks on it: the sheet
    // closes at once and the card lands PENDING in the feed. Metadata fills it
    // in place when it resolves (main.jsx schedules the async settle).
    onAdd({ id: 'i' + Date.now(), url: normalized, attribution: 'Added by you', read: false, pending: true, at: Date.now() });
    onClose();
  };

  const surface = isMobile
    ? {
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 121,
        background: 'var(--color-surface)',
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
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
          placeholder="example.com/article" value={url}
          onChange={(e) => { setUrl(e.target.value); if (error) setError(null); }}
          error={error}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Add</Button>
        </div>
      </form>
    </>
  );
};

// ---- FAB — Active + Read tabs ------------------------------------------------
// Glyph is a single 24px SVG carrying two shapes: the plus/cross (rotates 45°
// when open → ×) and a tick that resolves in on a successful add. States:
//   plus  — idle
//   cross — open (× — rotated plus)
//   tick  — a brief post-add confirmation, then self-clears back to plus
// Cancel goes cross→plus (no tick); submit goes cross→tick→plus. The tick grows
// in as it resolves — a small, quiet moment, never a colour shift or halo.
const FAB = ({ onClick, expanded, isMobile, confirm }) => {
  const glyph = confirm ? 'tick' : (expanded ? 'cross' : 'plus');
  return (
  <button onClick={onClick} aria-label="Add a link" style={{
    position: 'fixed', right: isMobile ? 24 : 32, bottom: isMobile ? 24 : 32, zIndex: 80,
    width: 56, height: 56, borderRadius: '50%',
    background: 'var(--color-accent)', color: '#fff', border: 0, cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(4,120,87,0.28), 0 1px 3px rgba(10,10,10,0.12)',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background var(--duration-base)',
  }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <g stroke="#fff" strokeWidth="2" strokeLinecap="round" style={{
        transformBox: 'fill-box', transformOrigin: 'center',
        transform: (glyph === 'cross' ? 'rotate(45deg) ' : 'rotate(0deg) ') + (glyph === 'tick' ? 'scale(0.7)' : 'scale(1)'),
        opacity: glyph === 'tick' ? 0 : 1,
        transition: 'transform var(--duration-slow) var(--ease-quiet), opacity var(--duration-base) var(--ease-quiet)',
      }}>
        <line x1="12" y1="4" x2="12" y2="20" />
        <line x1="4" y1="12" x2="20" y2="12" />
      </g>
      <path d="M4.8 12.6 L10 17.6 L19.2 7.4" pathLength="1" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{
        transformBox: 'fill-box', transformOrigin: 'center',
        // Draw-on: the checkmark strokes itself from the heel to the tip, then a
        // faint scale settle as it lands. Retracts (offset 0\u21921) on the way out.
        strokeDasharray: 1,
        strokeDashoffset: glyph === 'tick' ? 0 : 1,
        transform: glyph === 'tick' ? 'scale(1.06)' : 'scale(0.92)',
        opacity: glyph === 'tick' ? 1 : 0,
        transition: glyph === 'tick'
          ? 'stroke-dashoffset 300ms var(--ease-quiet), transform 300ms var(--ease-quiet), opacity 90ms linear'
          : 'stroke-dashoffset 160ms var(--ease-quiet), transform 160ms var(--ease-quiet), opacity 120ms linear 40ms',
      }} />
    </svg>
  </button>
  );
};

// ---- ConfirmDialog — one primitive; destructive delete. (Mark-as-read no
// longer confirms: it opens the Swell reaction flow — see SwellReactionFlow.)
const CONFIRM = {
  'delete': {
    title: 'Delete this link?',
    body: 'It\u2019s removed from the circle for everyone, and can\u2019t be undone.',
    primary: 'Delete', variant: 'destructive', role: 'alertdialog',
  },
  // Leaving a circle. Written to the Remove-a-member dialog's shape: three
  // beats \u2014 what you lose, what stays and whose name it keeps, how you get back.
  // The read-state reseed is deliberately not here; it is detail for the moment
  // you rejoin, not for the moment you decide.
  'leave': {
    title: 'Leave this circle?',
    body: 'You lose access to it. Everything you added stays, with your name. Only the champion can invite you back.',
    primary: 'Leave', variant: 'destructive', role: 'alertdialog',
  },
  // Stands in front of the provider deep-link: the cost is carried BEFORE the act.
  'cancel-funding': {
    title: 'Cancel this circle\u2019s funding?',
    body: 'Your champion powers end when the paid period does. The circle then goes to sleep for everyone, and whoever funds it next becomes its champion.',
    primary: 'Continue', dismiss: 'Back', variant: 'destructive', role: 'alertdialog',
  },
  // The split, ratified: the CARD carries what is true for every member; the DIALOG
  // carries what is true only for champions. Two beats, no third: the irreversible
  // fact, then the funding consequence. The funding beat is AGENTIVE on purpose -
  // 'Deleting cancels your funding', not 'your funding is cancelled'. The passive
  // reads as weather and hid that WE end it unless the champion acts first.
  // NO signpost to circle settings. It was restored, then cut again 2026-08-03: with
  // no self-serve handover, managing funding yourself reaches the same outcome this
  // sentence already states, so the line offered an escape that does not exist and
  // said the same thing twice. Do not reintroduce it without a handover route to
  // point at. No circle is named or counted.
  'delete-account': {
    title: 'Delete your account?',
    body: 'It can\u2019t be undone. Deleting cancels your funding \u2014 any circle you champion runs to the end of its paid period, then goes to sleep.',
    primary: 'Delete account', variant: 'destructive', role: 'alertdialog',
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
      }} className="circ-anim-fade">
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
          <Button ref={cancelRef} variant="secondary" onClick={onCancel}>{v.dismiss || 'Cancel'}</Button>
          <Button variant={v.variant} onClick={onConfirm}>{v.primary}</Button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { FeedCard, FeedLoading, EmptyState, AddReveal, FAB, ConfirmDialog });
