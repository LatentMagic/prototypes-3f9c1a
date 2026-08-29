// ============================================================================
// Discourse v8 — the feed card.
// COPY of FeedCard (app/feed.jsx), unchanged in body, layout, typography and
// action geometry. A copy is unavoidable here: discourse has to sit INSIDE the
// card's border, which wrapping the shipped card cannot do
// (skills/build-playground).
// The only additions are four call-outs to the selected state:
//   st.onCard(item)        — how the contributor's thought presents on the face
//   st.cardActions(props)  — what stands in the action row beside delete
//   st.cardWrap(props)     — a state that owns the whole card (the flip)
//   st.cardMeta(item)      — what the attribution line's micro text says
// Nothing else is tuned. Source: app/feed.jsx, FeedCard.
// ============================================================================
const d8HostOf = (url) => {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch (e) { return String(url).replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]; }
};
const d8DeriveTitle = (url) => {
  try {
    const seg = (new URL(url).pathname.split('/').filter(Boolean).pop() || '')
      .replace(/\.(html?|php|aspx?)$/i, '').replace(/[-_]+/g, ' ').trim();
    if (!seg || /^\d+$/.test(seg) || seg.length < 3) return null;
    return seg.charAt(0).toUpperCase() + seg.slice(1);
  } catch (e) { return null; }
};
const D8_TINTS = [
  ['#3a3a38', '#5a5a56'], ['#33413f', '#54655f'], ['#403830', '#645749'],
  ['#343a4a', '#565f77'], ['#42323c', '#66505d'],
];
const d8Hash = (s) => { let h = 0; s = String(s || ''); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
const d8Tint = (key) => { const g = D8_TINTS[d8Hash(key) % D8_TINTS.length]; return 'linear-gradient(135deg,' + g[0] + ',' + g[1] + ')'; };

const D8Card = ({ item, tab, user, st, ctx }) => {
  const [favBroken, setFavBroken] = React.useState(false);
  const [imgBroken, setImgBroken] = React.useState(false);
  const former = /former member/i.test(item.attribution);
  const attribution = item.attribution.replace(/^(added by\s+)you\b/i, '$1you');
  const attribPre = /^added by\s+/i.exec(attribution);
  const whoName = attribution.replace(/^added by\s+/i, '').replace(/\.$/, '');
  const isYou = /^you$/i.test(whoName);
  const avatarName = isYou ? window.displayName(user) : whoName;

  const host = d8HostOf(item.url);
  const source = item.source || host;
  const title = item.title || d8DeriveTitle(item.url);
  const prettyUrl = item.url.replace(/^https?:\/\//, '');
  const showImage = item.hasImage !== false;
  const faviconOk = item.faviconExists !== false && !favBroken;
  const faviconUrl = (window.CircFavicons && window.CircFavicons(host))
    || ('https://www.google.com/s2/favicons?domain=' + encodeURIComponent(host) + '&sz=64');
  const meta = (st.cardMeta ? st.cardMeta(item, ctx) : null) || window.circWhen(item.at);

  const openLinkProps = { href: item.url, target: '_blank', rel: 'noopener noreferrer' };

  const face = (
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
                <img src={faviconUrl} alt="" onError={() => setFavBroken(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </span>
            )}
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: item.source ? 600 : 500, fontSize: 13, color: 'var(--color-fg-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: 1 }}>{source}</span>
          </div>
          {title
            ? <a {...openLinkProps} className="circ-cardtitle" style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, lineHeight: 1.3, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', textDecoration: 'none', textWrap: 'pretty', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{title}</a>
            : <a {...openLinkProps} className="circ-cardtitle circ-cardurl" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 14, lineHeight: 1.45, color: 'var(--color-fg-1)', textDecoration: 'none', wordBreak: 'break-all', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{prettyUrl}</a>}
          {st.onCard && st.onCard(item, ctx)}
        </div>
        {showImage && (
          <a {...openLinkProps} tabIndex={-1} aria-hidden="true" className="circ-thumblink" style={{ flexShrink: 0, display: 'block', width: 60, height: 60, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border-2)' }}>
            {item.image && !imgBroken
              ? <img src={item.image} alt="" onError={() => setImgBroken(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : <span style={{ display: 'block', width: '100%', height: '100%', background: d8Tint(source) }} />}
          </a>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
        <D8AttribSlot item={item} st={st} ctx={ctx}>
          <window.Avatar name={former ? null : avatarName} size={28} accent={isYou} />
          <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 9 }}>
            <span style={{ minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-semibold)', fontSize: 14, lineHeight: 1.3, color: 'var(--color-fg-1)', letterSpacing: '-0.005em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {attribPre
                ? <React.Fragment><span className="circ-attrib-pre">{attribPre[0]}</span><span className="circ-attrib-rest">{attribution.slice(attribPre[0].length)}</span></React.Fragment>
                : attribution}
            </span>
            {meta && <span style={{ flexShrink: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 11, lineHeight: 1.3, color: 'var(--color-fg-3)', whiteSpace: 'nowrap' }}>{meta}</span>}
          </div>
        </D8AttribSlot>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginRight: -13 }}>
          {st.cardActions
            ? st.cardActions({ item, tab, ctx })
            : (tab === 'read' ? <window.SwellDoor item={item} /> : null)}
          {tab !== 'read' && (
            <button className="circ-cardaction circ-cardaction-icon" onClick={() => ctx.onMarkRead(item)} aria-label="Mark as read" title="Mark as read">
              <window.Icon name="check" size={18} />
            </button>
          )}
          <button className="circ-cardaction circ-cardaction-icon" onClick={() => ctx.onDelete(item)} aria-label="Delete this link" title="Delete">
            <window.Icon name="trash" size={17} />
          </button>
        </div>
      </div>
    </article>
  );

  return st.cardWrap ? st.cardWrap({ item, tab, ctx, face }) : face;
};

// The attribution row is a way IN for one state and inert for the rest, so the
// decision lives in one place instead of being repeated in every state.
const D8AttribSlot = ({ item, st, ctx, children }) => {
  if (!st.attribOpens || !item.read) return <React.Fragment>{children}</React.Fragment>;
  return (
    <button type="button" onClick={() => ctx.openRecord(item)} className="circ-d8-attrib" style={{
      flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
      background: 'transparent', border: 0, padding: '4px 6px', margin: '-4px -6px', borderRadius: 'var(--radius-md)',
      cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
      aria-label={'Open the circle\u2019s page for this link'}>
      {children}
    </button>
  );
};

Object.assign(window, { D8Card, d8DeriveTitle, d8HostOf });
