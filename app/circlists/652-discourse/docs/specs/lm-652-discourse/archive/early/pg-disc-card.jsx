// ============================================================================
// Discourse playground — the feed card.
// The shipped enriched card (dense body + footer, copied from app/feed.jsx) with
// one discourse slot underneath, rendered in whichever shape the option asks
// for: a stack on the card, a margin, a flip to the back, or nothing at all.
// ============================================================================

const { Icon: PgcIcon, Avatar: PgcAvatar } = window;
const { PgdLine, PgdThoughtBody, PgdResponseBody, PgdGlyphHuddle } = window;
const { useState: pgcS } = React;

const pgcHost = (url) => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return url; } };
const PGC_TINTS = [['#3a3a38', '#5a5a56'], ['#33413f', '#54655f'], ['#403830', '#645749'], ['#343a4a', '#565f77'], ['#42323c', '#66505d']];
const pgcHash = (s) => { let h = 0; s = String(s || ''); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
const pgcTint = (key) => { const g = PGC_TINTS[pgcHash(key) % PGC_TINTS.length]; return 'linear-gradient(135deg,' + g[0] + ',' + g[1] + ')'; };

const PGC_RESPOND_LABEL = {
  notes: 'Pass a note back', margin: 'Add to the margin', table: 'Take it to the table',
  stems: 'Finish a sentence', door: 'Open the door', echo: 'Echo this', ask: 'Answer',
};

// ---- The discourse stack ---------------------------------------------------
// Thought first, responses under it, your own last. Progressive disclosure keeps
// a busy card short: two responses, then a count.
const PgdStack = ({ res, cfg, opt, onRespond, indent }) => {
  const [more, setMore] = pgcS(false);
  const list = res.responses;
  const shown = more ? list : list.slice(0, 2);
  const hidden = list.length - shown.length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {res.thought && (
        <PgdLine by={res.thought.by} cfg={cfg} indent={indent}>
          <PgdThoughtBody thought={res.thought} opt={opt} cfg={cfg} />
        </PgdLine>
      )}
      {shown.map((r, i) => (
        <PgdLine key={i} by={r.by} cfg={cfg} indent={indent}>
          <PgdResponseBody r={r} opt={opt} cfg={cfg} />
        </PgdLine>
      ))}
      {hidden > 0 && (
        <button type="button" onClick={() => setMore(true)} className="pgd-quiet" style={{
          alignSelf: 'flex-start', background: 'transparent', border: 0, padding: '4px 0', marginLeft: indent || 0,
          cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--color-fg-3)',
        }}>{hidden} more</button>
      )}
      {res.canRespond && onRespond && (
        <button type="button" onClick={onRespond} className="pgd-respond" style={{
          alignSelf: 'flex-start', marginLeft: indent || 0, background: 'transparent',
          border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-md)',
          padding: '8px 12px', minHeight: 40, cursor: 'pointer',
          fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--color-fg-1)',
        }}>{PGC_RESPOND_LABEL[opt.id] || 'Respond'}</button>
      )}
    </div>
  );
};

// ---- The back of the card (guided statements) ------------------------------
const PgdBack = ({ item, res, cfg, opt, onFlip, onRespond }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 132 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', color: 'var(--color-fg-3)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.source || pgcHost(item.url)}</span>
      <button type="button" onClick={onFlip} className="pgd-quiet" style={{ background: 'transparent', border: 0, padding: '6px 0', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'var(--color-fg-2)' }}>Turn back</button>
    </div>
    <PgdStack res={res} cfg={cfg} opt={opt} onRespond={onRespond} />
  </div>
);

// ---- The card --------------------------------------------------------------
const PgdCard = ({ item, res, cfg, opt, tab, onMarkRead, onDelete, onRespond, onDoor, onTable }) => {
  const [flipped, setFlipped] = pgcS(false);
  const [imgBroken, setImgBroken] = pgcS(false);
  const host = pgcHost(item.url);
  const source = item.source || host;
  const title = item.title;
  const pretty = item.url.replace(/^https?:\/\//, '');
  const showImage = item.hasImage !== false;
  const faviconOk = item.faviconExists !== false;
  const isYou = /^added by you$/i.test(item.attribution);
  const former = /former member/i.test(item.attribution);
  const whoName = item.attribution.replace(/^added by\s+/i, '').replace(/\.$/, '');
  const has = !!(res.thought || res.responses.length);

  const inCard = cfg.home === 'card' || cfg.home === 'margin';
  const showStack = !res.sealed && inCard && (has || res.canRespond);
  const atTable = cfg.home === 'table' && !res.sealed && has;
  const backable = cfg.home === 'back' && !res.sealed && (has || res.canRespond);

  const front = (
    <React.Fragment>
      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            {faviconOk && (
              <span style={{ width: 15, height: 15, borderRadius: 3, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--color-border-2)', display: 'inline-flex' }}>
                <img src={'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(host) + '&sz=64'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </span>
            )}
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: item.source ? 600 : 500, fontSize: 13, color: 'var(--color-fg-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: 1 }}>{source}</span>
            {res.marker && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.04em', color: 'var(--color-fg-3)', flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <svg viewBox="0 0 24 24" width="11" height="11" aria-hidden="true" style={{ stroke: 'var(--color-fg-3)', strokeWidth: 2, fill: 'none', strokeLinecap: 'round' }}><line x1="4" y1="8" x2="20" y2="8" /><line x1="4" y1="16" x2="14" y2="16" /></svg>
                {res.marker}
              </span>
            )}
          </div>
          {title
            ? <a href={item.url} target="_blank" rel="noopener noreferrer" className="circ-cardtitle" style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, lineHeight: 1.3, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', textDecoration: 'none', textWrap: 'pretty', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{title}</a>
            : <a href={item.url} target="_blank" rel="noopener noreferrer" className="circ-cardtitle" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 14, lineHeight: 1.45, color: 'var(--color-fg-1)', textDecoration: 'none', wordBreak: 'break-all', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{pretty}</a>}
        </div>
        {showImage && (
          <a href={item.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true" className="circ-thumblink" style={{ flexShrink: 0, display: 'block', width: 60, height: 60, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border-2)' }}>
            {item.image && !imgBroken
              ? <img src={item.image} alt="" onError={() => setImgBroken(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : <span style={{ display: 'block', width: '100%', height: '100%', background: pgcTint(source) }} />}
          </a>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
        <PgcAvatar name={former ? null : (isYou ? 'Sam Rivera' : whoName)} size={28} accent={isYou} />
        <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, lineHeight: 1.3, letterSpacing: '-0.005em', color: 'var(--color-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.attribution}</span>
        {backable && (
          <button type="button" onClick={() => setFlipped(true)} className="pgd-quiet" style={{
            background: 'transparent', border: 0, padding: '8px 6px', minHeight: 44, cursor: 'pointer', flexShrink: 0,
            fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--color-fg-2)', whiteSpace: 'nowrap',
          }}>{res.responses.length + (res.thought ? 1 : 0)} on the back</button>
        )}
        {atTable && (
          <button type="button" onClick={onTable} className="pgd-quiet" style={{
            background: 'transparent', border: 0, padding: '8px 6px', minHeight: 44, cursor: 'pointer', flexShrink: 0,
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.03em', color: 'var(--color-fg-3)', whiteSpace: 'nowrap',
          }}>at the table</button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginRight: -13 }}>
          {tab === 'read'
            ? ((item.reactions || []).length > 0 && (
              <button type="button" onClick={onDoor} className="circ-swell-door" aria-label="How the circle landed" aria-haspopup="dialog"
                style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', border: 0, background: 'transparent', padding: 0, minHeight: 44, flexShrink: 0 }}>
                <span style={{ paddingLeft: 8, display: 'inline-flex' }}><PgdGlyphHuddle reactions={item.reactions} /></span>
                <span style={{ height: 44, paddingLeft: 6, paddingRight: 15.5, display: 'inline-flex', alignItems: 'center' }}>
                  <svg viewBox="0 0 24 24" width={13} height={13} aria-hidden="true" style={{ stroke: 'var(--color-fg-3)', strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                    <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                </span>
              </button>
            ))
            : (
              <button className="circ-cardaction circ-cardaction-icon" onClick={onMarkRead} aria-label="Mark as read" title="Mark as read">
                <PgcIcon name="check" size={18} />
              </button>
            )}
          <button className="circ-cardaction circ-cardaction-icon" onClick={onDelete} aria-label="Delete this link" title="Delete">
            <PgcIcon name="trash" size={17} />
          </button>
        </div>
      </div>

      {showStack && (
        cfg.home === 'margin' ? (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--color-border-2)' }}>
            <div style={{ borderLeft: '2px solid var(--color-border-1)', paddingLeft: 12, maxWidth: 300 }}>
              <PgdStack res={res} cfg={cfg} opt={opt} onRespond={onRespond} />
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--color-border-2)' }}>
            <PgdStack res={res} cfg={cfg} opt={opt} onRespond={onRespond} />
          </div>
        )
      )}
    </React.Fragment>
  );

  const shell = {
    background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
    borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-5)',
    display: 'flex', flexDirection: 'column',
  };

  if (backable) {
    return (
      <div className="pgd-flipwrap" style={{ perspective: 1200 }}>
        <div className="pgd-flipper" style={{ transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
          <article className="circ-card pgd-face" style={{ ...shell, visibility: flipped ? 'hidden' : 'visible' }}>{front}</article>
          <article className="circ-card pgd-face pgd-back" style={{ ...shell, visibility: flipped ? 'visible' : 'hidden' }}>
            <PgdBack item={item} res={res} cfg={cfg} opt={opt} onFlip={() => setFlipped(false)} onRespond={onRespond} />
          </article>
        </div>
      </div>
    );
  }
  return <article className="circ-card" style={shell}>{front}</article>;
};

Object.assign(window, { PgdCard, PgdStack, PGC_RESPOND_LABEL });
