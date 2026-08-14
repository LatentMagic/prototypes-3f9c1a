// ============================================================================
// Discourse v4 — the feed card.
// The shipped enriched card (dense body + footer, copied from app/feed.jsx —
// a copy is unavoidable when content must sit INSIDE the card's border), with
// the direction's treatment in the slot underneath, plus two structural
// variants the treatments need:
//   invite  the headline slot belongs to the sharer's sentence; the article
//           title demotes to a source line under it.
//   stem    the record lives on the back; the card flips.
// ============================================================================

const { Icon: P4kIcon, Avatar: P4kAvatar } = window;
const { Pg4Treatment, Pg4Invite, Pg4Huddle, Pg4MicroDot, PGD4_RESPOND } = window;
const { useState: p4kS } = React;

const p4kHost = (url) => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return url; } };
const P4K_TINTS = [['#3a3a38', '#5a5a56'], ['#33413f', '#54655f'], ['#403830', '#645749'], ['#343a4a', '#565f77'], ['#42323c', '#66505d']];
const p4kHash = (s) => { let h = 0; s = String(s || ''); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
const p4kTint = (key) => { const g = P4K_TINTS[p4kHash(key) % P4K_TINTS.length]; return 'linear-gradient(135deg,' + g[0] + ',' + g[1] + ')'; };

const P4kShell = {
  background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
  borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-5)',
  display: 'flex', flexDirection: 'column',
};

const Pg4Back = ({ item, res, cfg, dir, onFlip, onRespond }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span className="d4-eyebrow" style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.source || p4kHost(item.url)}</span>
      <button type="button" onClick={onFlip} className="d4-quiet" style={{ background: 'transparent', border: 0, padding: '6px 0', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--color-fg-2)' }}>Turn back</button>
    </div>
    <Pg4Treatment res={res} cfg={cfg} dir={dir} onRespond={onRespond} pk={item.id} />
  </div>
);

const Pg4Card = ({ item, res, cfg, dir, tab, pointed, onPoint, onMarkRead, onDelete, onRespond, onDoor, onTable }) => {
  const [flipped, setFlipped] = p4kS(false);
  const [imgBroken, setImgBroken] = p4kS(false);
  const host = p4kHost(item.url);
  const source = item.source || host;
  const pretty = item.url.replace(/^https?:\/\//, '');
  const showImage = item.hasImage !== false;
  const faviconOk = item.faviconExists !== false;
  const isYou = /^added by you$/i.test(item.attribution);
  const former = /former member/i.test(item.attribution);
  const whoName = item.attribution.replace(/^added by\s+/i, '').replace(/\.$/, '');

  const treat = cfg.treat;
  const invite = treat === 'invite' && res.showThought && res.thought;
  const backable = treat === 'stem' && !res.sealed && (res.count > 0 || res.canRespond);
  const inline = ['ledger', 'margin', 'qa', 'same', 'epigraph'].indexOf(treat) >= 0;
  const showInline = inline && (res.showThought || (!res.sealed && (res.count > 0 || res.canRespond)));
  const atTable = treat === 'page' && item.onTable;

  const titleLink = (big) => (item.title
    ? <a href={item.url} target="_blank" rel="noopener noreferrer" className="circ-cardtitle" style={{
        fontFamily: 'var(--font-sans)', fontWeight: big ? 600 : 500, fontSize: big ? 16 : 13,
        lineHeight: big ? 1.3 : 1.45, letterSpacing: big ? '-0.01em' : 0,
        color: big ? 'var(--color-fg-1)' : 'var(--color-fg-2)', textDecoration: 'none', textWrap: 'pretty',
        display: '-webkit-box', WebkitLineClamp: big ? 2 : 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>{item.title}</a>
    : <a href={item.url} target="_blank" rel="noopener noreferrer" className="circ-cardtitle" style={{
        fontFamily: 'var(--font-mono)', fontWeight: big ? 600 : 500, fontSize: big ? 14 : 12,
        lineHeight: 1.45, color: big ? 'var(--color-fg-1)' : 'var(--color-fg-2)', textDecoration: 'none',
        wordBreak: 'break-all', display: '-webkit-box', WebkitLineClamp: big ? 3 : 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>{pretty}</a>);

  const head = (
    <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: invite ? 9 : 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          {faviconOk && (
            <span style={{ width: 15, height: 15, borderRadius: 3, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--color-border-2)', display: 'inline-flex' }}>
              <img src={'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(host) + '&sz=64'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </span>
          )}
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: item.source ? 600 : 500, fontSize: 13, color: 'var(--color-fg-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: 1 }}>{source}</span>
          {res.marker && (
            <span className="d4-eyebrow" style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <svg viewBox="0 0 24 24" width="11" height="11" aria-hidden="true" style={{ stroke: 'var(--color-fg-3)', strokeWidth: 2, fill: 'none', strokeLinecap: 'round' }}><line x1="4" y1="8" x2="20" y2="8" /><line x1="4" y1="16" x2="14" y2="16" /></svg>
              {res.marker}
            </span>
          )}
          {atTable && <span className="d4-eyebrow" style={{ flexShrink: 0 }}>at the table</span>}
        </div>
        {invite ? (
          <React.Fragment>
            <Pg4Invite thought={res.thought} cfg={{ ...cfg, names: 'muted' }} />
            {titleLink(false)}
          </React.Fragment>
        ) : titleLink(true)}
      </div>
      {showImage && (
        <a href={item.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true" className="circ-thumblink" style={{ flexShrink: 0, display: 'block', width: 60, height: 60, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border-2)' }}>
          {item.image && !imgBroken
            ? <img src={item.image} alt="" onError={() => setImgBroken(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : <span style={{ display: 'block', width: '100%', height: '100%', background: p4kTint(source) }} />}
        </a>
      )}
    </div>
  );

  const foot = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
      <P4kAvatar name={former ? null : (isYou ? 'Sam Rivera' : whoName)} size={28} accent={isYou} />
      <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, lineHeight: 1.3, letterSpacing: '-0.005em', color: 'var(--color-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.attribution}</span>
      {backable && (
        <button type="button" onClick={() => setFlipped(true)} className="d4-quiet" style={{
          background: 'transparent', border: 0, padding: '8px 6px', minHeight: 44, cursor: 'pointer', flexShrink: 0,
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-2)', whiteSpace: 'nowrap',
        }}>{res.count} on the back</button>
      )}
      {atTable && !res.sealed && (
        <button type="button" onClick={onTable} className="d4-quiet" style={{
          background: 'transparent', border: 0, padding: '8px 6px', minHeight: 44, cursor: 'pointer', flexShrink: 0,
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-2)', whiteSpace: 'nowrap',
        }}>Continue</button>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginRight: -13 }}>
        {tab === 'read'
          ? ((item.reactions || []).length > 0 && (
            <button type="button" onClick={onDoor} aria-label="How the circle landed" aria-haspopup="dialog"
              style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', border: 0, background: 'transparent', padding: 0, minHeight: 44, flexShrink: 0 }}>
              <span style={{ paddingLeft: 8, display: 'inline-flex' }}><Pg4Huddle reactions={item.reactions} /></span>
              {res.dot && <span style={{ paddingLeft: 6, display: 'inline-flex' }}><Pg4MicroDot /></span>}
              <span style={{ height: 44, paddingLeft: 6, paddingRight: 15.5, display: 'inline-flex', alignItems: 'center' }}>
                <svg viewBox="0 0 24 24" width={13} height={13} aria-hidden="true" style={{ stroke: 'var(--color-fg-3)', strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                  <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              </span>
            </button>
          ))
          : (
            <button className="circ-cardaction circ-cardaction-icon" onClick={onMarkRead} aria-label="Mark as read" title="Mark as read">
              <P4kIcon name="check" size={18} />
            </button>
          )}
        <button className="circ-cardaction circ-cardaction-icon" onClick={onDelete} aria-label="Delete this link" title="Delete">
          <P4kIcon name="trash" size={17} />
        </button>
      </div>
    </div>
  );

  const front = (
    <React.Fragment>
      {treat === 'margin' && showInline ? (
        <div className="d4-mgrid">
          <div>{head}{foot}</div>
          <aside className="d4-mnote">
            <Pg4Treatment res={res} cfg={cfg} dir={dir} onRespond={onRespond} pk={item.id} pointed={pointed} onPoint={onPoint} />
          </aside>
        </div>
      ) : (
        <React.Fragment>
          {head}
          {foot}
          {showInline && (
            <div style={{ marginTop: 13, paddingTop: 13, borderTop: '1px solid var(--color-border-2)' }}>
              <Pg4Treatment res={res} cfg={cfg} dir={dir} onRespond={onRespond} pk={item.id} pointed={pointed} onPoint={onPoint} />
            </div>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );

  if (backable) {
    return (
      <div style={{ perspective: 1200 }}>
        <div className="d4-flipper" style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
          <article className="circ-card d4-face" style={{ ...P4kShell, visibility: flipped ? 'hidden' : 'visible', position: flipped ? 'absolute' : 'static', inset: flipped ? 0 : undefined }}>{front}</article>
          <article className="circ-card d4-face d4-back" style={{ ...P4kShell, visibility: flipped ? 'visible' : 'hidden', position: flipped ? 'static' : 'absolute', inset: flipped ? undefined : 0 }}>
            <Pg4Back item={item} res={res} cfg={cfg} dir={dir} onFlip={() => setFlipped(false)} onRespond={onRespond} />
          </article>
        </div>
      </div>
    );
  }
  return <article className="circ-card" style={P4kShell}>{front}</article>;
};

Object.assign(window, { Pg4Card, p4kHost });
