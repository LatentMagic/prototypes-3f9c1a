// ============================================================================
// Discourse v2 — the feed card.
// The shipped enriched card (app/feed.jsx, copied because the sharer's line has
// to sit inside the card's border), plus exactly one addition: the preface,
// hanging off the attribution. The conversation never appears here — that is
// what the door is for — unless the Read card lever is pushed to "with the words"
// so the v1 bloat can be seen losing.
// ============================================================================

const { Icon: D2cIcon, Avatar: D2cAvatar, MicroDot: D2cMicroDot } = window;
const { D2Preface, D2Held, D2Huddle, D2Line, D2Pointed } = window;
const { useState: d2cS } = React;

const d2Host = (url) => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return url; } };
const D2_TINTS = [['#3a3a38', '#5a5a56'], ['#33413f', '#54655f'], ['#403830', '#645749'], ['#343a4a', '#565f77'], ['#42323c', '#66505d']];
const d2cHash = (s) => { let h = 0; s = String(s || ''); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
const d2Tint = (key) => { const g = D2_TINTS[d2cHash(key) % D2_TINTS.length]; return 'linear-gradient(135deg,' + g[0] + ',' + g[1] + ')'; };

// The words on the card — only ever rendered when the Read-card lever asks for
// it. Kept so the density it costs is visible next to the lean card.
const D2CardWords = ({ res, cfg }) => (
  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--color-border-2)', display: 'flex', flexDirection: 'column', gap: 9 }}>
    {res.voices.slice(0, 3).map((v, i) => (
      <D2Line key={i} by={v.by} cfg={cfg} sub
        foot={v.echoes && v.echoes.length ? <D2Pointed names={v.echoes} cfg={cfg} /> : null}>
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13.5, lineHeight: 1.5, color: 'var(--color-fg-2)', textWrap: 'pretty' }}>{v.line}</span>
      </D2Line>
    ))}
    {res.voices.length > 3 && (
      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12.5, color: 'var(--color-fg-3)', paddingLeft: 29 }}>{res.voices.length - 3} more</span>
    )}
  </div>
);

const D2Card = ({ item, res, cfg, tab, unseen, onMarkRead, onDelete, onDoor, onTable }) => {
  const [imgBroken, setImgBroken] = d2cS(false);
  const host = d2Host(item.url);
  const source = item.source || host;
  const title = item.title;
  const pretty = item.url.replace(/^https?:\/\//, '');
  const showImage = item.hasImage !== false;
  const faviconOk = item.faviconExists !== false;
  const attribution = item.attribution.replace(/^(added by\s+)you\b/i, '$1you');
  const attribPre = /^added by\s+/i.exec(attribution);
  const whoName = attribution.replace(/^added by\s+/i, '').replace(/\.$/, '');
  const isYou = /^you$/i.test(whoName);
  const former = /former member/i.test(attribution);
  const when = window.circWhen ? window.circWhen(item.at) : null;
  const faviconUrl = (window.CircFavicons && window.CircFavicons(host))
    || ('https://www.google.com/s2/favicons?domain=' + encodeURIComponent(host) + '&sz=64');

  return (
    <article className="circ-card" style={{
      background: 'var(--color-surface)', border: '1px solid var(--color-border-1)',
      borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-5)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            {faviconOk && (
              <span style={{ width: 15, height: 15, borderRadius: 3, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--color-border-2)', display: 'inline-flex' }}>
                <img src={faviconUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </span>
            )}
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: item.source ? 600 : 500, fontSize: 13, color: 'var(--color-fg-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: 1 }}>{source}</span>
          </div>
          {title
            ? <a href={item.url} target="_blank" rel="noopener noreferrer" className="circ-cardtitle" style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, lineHeight: 1.3, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', textDecoration: 'none', textWrap: 'pretty', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{title}</a>
            : <a href={item.url} target="_blank" rel="noopener noreferrer" className="circ-cardtitle" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 14, lineHeight: 1.45, color: 'var(--color-fg-1)', textDecoration: 'none', wordBreak: 'break-all', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{pretty}</a>}
        </div>
        {showImage && (
          <a href={item.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true" className="circ-thumblink" style={{ flexShrink: 0, display: 'block', width: 60, height: 60, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border-2)' }}>
            {item.image && !imgBroken
              ? <img src={item.image} alt="" onError={() => setImgBroken(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : <span style={{ display: 'block', width: '100%', height: '100%', background: d2Tint(source) }} />}
          </a>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
        <D2cAvatar name={former ? null : (isYou ? 'Sam Rivera' : whoName)} size={28} accent={isYou} />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 9 }}>
          <span style={{ minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, lineHeight: 1.3, letterSpacing: '-0.005em', color: 'var(--color-fg-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {attribPre
              ? <React.Fragment><span className="circ-attrib-pre">{attribPre[0]}</span><span className="circ-attrib-rest">{attribution.slice(attribPre[0].length)}</span></React.Fragment>
              : attribution}
          </span>
          {when && <span style={{ flexShrink: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 11, lineHeight: 1.3, color: 'var(--color-fg-3)', whiteSpace: 'nowrap' }}>{when}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginRight: -13 }}>
          {tab === 'read'
            ? (((item.reactions || []).length > 0 || res.words) && (
              // The shipped door, plus the app's own arrival grammar: a micro dot
              // when the record holds words you have not seen. Never a count.
              <button type="button" onClick={onDoor} className="circ-swell-door" aria-haspopup="dialog"
                aria-label={unseen ? 'How the circle landed \u2014 unseen words' : 'How the circle landed'}
                style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', border: 0, background: 'transparent', padding: 0, minHeight: 44, flexShrink: 0 }}>
                {unseen && <span style={{ paddingLeft: 8, display: 'inline-flex', alignItems: 'center' }}><D2cMicroDot size={9} /></span>}
                <span style={{ paddingLeft: 8, display: 'inline-flex' }}><D2Huddle reactions={item.reactions} /></span>
                <span style={{ height: 44, paddingLeft: 6, paddingRight: 15.5, display: 'inline-flex', alignItems: 'center' }}>
                  <svg viewBox="0 0 24 24" width={13} height={13} aria-hidden="true" style={{ stroke: 'var(--color-fg-3)', strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                    <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                </span>
              </button>
            ))
            : (
              <button className="circ-cardaction circ-cardaction-icon" onClick={onMarkRead} aria-label="Mark as read" title="Mark as read">
                <D2cIcon name="check" size={18} />
              </button>
            )}
          <button className="circ-cardaction circ-cardaction-icon" onClick={onDelete} aria-label="Delete this link" title="Delete">
            <D2cIcon name="trash" size={17} />
          </button>
        </div>
      </div>

      {/* The invitation. Hangs off the name, so attribution and speech are one
          thing — never a rule, never a box, never a bubble. */}
      {(res.prefaceOnCard || res.prefaceHeld) && (
        <div style={{ paddingLeft: 40, marginTop: 6 }}>
          {res.prefaceOnCard ? <D2Preface preface={res.preface} cfg={cfg} /> : <D2Held preface={res.preface} />}
          {res.prefaceOnCard && res.mineSealed && <div style={{ marginTop: 5 }}><D2Held preface={res.preface} /></div>}
        </div>
      )}

      {res.tableOn && (
        <div style={{ paddingLeft: 40, marginTop: 8 }}>
          <button type="button" onClick={onTable} className="circ-doorlink" style={{
            background: 'transparent', border: 0, padding: '4px 0', cursor: 'pointer',
            fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12.5, color: 'var(--color-accent)',
            textDecoration: 'underline', textDecorationColor: 'color-mix(in oklab, var(--color-accent) 35%, transparent)', textUnderlineOffset: 3,
          }}>{res.landed ? 'Landed at the table' : 'Still being talked about at the table'}</button>
        </div>
      )}

      {cfg.bloat === 'onCard' && !res.sealed && res.words && <D2CardWords res={res} cfg={cfg} />}
    </article>
  );
};

Object.assign(window, { D2Card, d2Host, d2Tint });
