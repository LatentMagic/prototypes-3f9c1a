// ============================================================================
// Discourse v9 — the feed card.
// COPY of FeedCard (app/feed.jsx): body, layout, typography and action geometry
// unchanged. A copy is unavoidable — discourse has to sit INSIDE the card's
// border, which wrapping the shipped card cannot do (PLAYGROUND.md).
//
// The slots a state may fill:
//   st.cardHead({item, ctx, sourceRow, titleEl})  restructure the head (the spine)
//   st.onCard(item, ctx)        the contributor's thought on the face
//   st.cardActions({...})       what stands in the action row beside delete
//   st.cardBelow({...})         inside the card's border, under the action row
//   st.cardCorner({...})        the card's top-right corner (the fold)
//   st.cardMeta(item, ctx)      what the attribution line's micro text says
//   st.attribOpens              the attribution row is a way in
//
// INVARIANT, enforced here rather than per state: on Read every card carries the
// Reaction door. A state may add a way in beside it; none may take it away.
// v8 broke this once and the review lost a card's worth of evidence to it.
// ============================================================================
const d9HostOf = (url) => {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch (e) { return String(url).replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]; }
};
const d9DeriveTitle = (url) => {
  try {
    const seg = (new URL(url).pathname.split('/').filter(Boolean).pop() || '')
      .replace(/\.(html?|php|aspx?)$/i, '').replace(/[-_]+/g, ' ').trim();
    if (!seg || /^\d+$/.test(seg) || seg.length < 3) return null;
    return seg.charAt(0).toUpperCase() + seg.slice(1);
  } catch (e) { return null; }
};
const D9_TINTS = [
  ['#3a3a38', '#5a5a56'], ['#33413f', '#54655f'], ['#403830', '#645749'],
  ['#343a4a', '#565f77'], ['#42323c', '#66505d'],
];
const d9Hash = (s) => { let h = 0; s = String(s || ''); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
const d9Tint = (key) => { const g = D9_TINTS[d9Hash(key) % D9_TINTS.length]; return 'linear-gradient(135deg,' + g[0] + ',' + g[1] + ')'; };

const D9Card = ({ item, tab, user, st, ctx }) => {
  const [favBroken, setFavBroken] = React.useState(false);
  const [imgBroken, setImgBroken] = React.useState(false);
  const former = /former member/i.test(item.attribution);
  const attribution = item.attribution.replace(/^(added by\s+)you\b/i, '$1you');
  const attribPre = /^added by\s+/i.exec(attribution);
  const whoName = attribution.replace(/^added by\s+/i, '').replace(/\.$/, '');
  const isYou = /^you$/i.test(whoName);
  const avatarName = isYou ? window.displayName(user) : whoName;

  const host = d9HostOf(item.url);
  const source = item.source || host;
  const title = item.title || d9DeriveTitle(item.url);
  const prettyUrl = item.url.replace(/^https?:\/\//, '');
  const showImage = item.hasImage !== false;
  const faviconOk = item.faviconExists !== false && !favBroken;
  const faviconUrl = (window.CircFavicons && window.CircFavicons(host))
    || ('https://www.google.com/s2/favicons?domain=' + encodeURIComponent(host) + '&sz=64');
  const meta = (st.cardMeta ? st.cardMeta(item, ctx) : null) || window.circWhen(item.at);

  const openLinkProps = { href: item.url, target: '_blank', rel: 'noopener noreferrer' };

  const sourceRow = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
      {faviconOk && (
        <span style={{ width: 15, height: 15, borderRadius: 3, overflow: 'hidden', flexShrink: 0, borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--color-border-2)', display: 'inline-flex' }}>
          <img src={faviconUrl} alt="" onError={() => setFavBroken(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </span>
      )}
      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: item.source ? 600 : 500, fontSize: 13, color: 'var(--color-fg-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: 1 }}>{source}</span>
    </div>
  );
  const titleEl = title
    ? <a {...openLinkProps} className="circ-cardtitle" style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, lineHeight: 1.3, letterSpacing: '-0.01em', color: 'var(--color-fg-1)', textDecoration: 'none', textWrap: 'pretty', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{title}</a>
    : <a {...openLinkProps} className="circ-cardtitle circ-cardurl" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 14, lineHeight: 1.45, color: 'var(--color-fg-1)', textDecoration: 'none', wordBreak: 'break-all', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{prettyUrl}</a>;

  const head = st.cardHead
    ? st.cardHead({ item, ctx, tab, sourceRow, titleEl, title, prettyUrl, openLinkProps })
    : (
      <React.Fragment>
        {sourceRow}
        {titleEl}
        {st.onCard && st.onCard(item, ctx, tab)}
      </React.Fragment>
    );

  const below = st.cardBelow && st.cardBelow({ item, tab, ctx });
  const corner = st.cardCorner && st.cardCorner({ item, tab, ctx });

  return (
    <article className="circ-card" data-d9-card-body={item.id} style={{
      position: 'relative',
      background: 'var(--color-surface)', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--color-border-1)',
      borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-5)',
      display: 'flex', flexDirection: 'column',
    }}>
      {corner}
      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>{head}</div>
        {showImage && (
          <a {...openLinkProps} tabIndex={-1} aria-hidden="true" className="circ-thumblink" style={{ flexShrink: 0, display: 'block', width: 60, height: 60, borderRadius: 'var(--radius-md)', overflow: 'hidden', borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--color-border-2)' }}>
            {item.image && !imgBroken
              ? <img src={item.image} alt="" onError={() => setImgBroken(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              : <span style={{ display: 'block', width: '100%', height: '100%', background: d9Tint(source) }} />}
          </a>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
        <D9AttribSlot item={item} st={st} ctx={ctx}>
          <window.Avatar name={former ? null : avatarName} size={28} accent={isYou} />
          <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 9 }}>
            <span style={{ minWidth: 0, fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-semibold)', fontSize: 14, lineHeight: 1.3, color: 'var(--color-fg-1)', letterSpacing: '-0.005em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {attribPre
                ? <React.Fragment><span className="circ-attrib-pre">{attribPre[0]}</span><span className="circ-attrib-rest">{attribution.slice(attribPre[0].length)}</span></React.Fragment>
                : attribution}
            </span>
            {meta && <span style={{ flexShrink: 0, fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 11, lineHeight: 1.3, color: 'var(--color-fg-3)', whiteSpace: 'nowrap' }}>{meta}</span>}
          </div>
        </D9AttribSlot>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginRight: -13 }}>
          {tab === 'read' && (st.cardActions ? st.cardActions({ item, tab, ctx }) : <window.SwellDoor item={item} />)}
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
      {below}
    </article>
  );
};

// The attribution row is a way IN for one state and inert for the rest, so the
// decision lives in one place instead of being repeated in every state.
const D9AttribSlot = ({ item, st, ctx, children }) => {
  if (!st.attribOpens || !item.read) return <React.Fragment>{children}</React.Fragment>;
  return (
    <button type="button" onClick={() => ctx.openRecord(item)} className="circ-d9-attrib" style={{
      flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
      background: 'transparent', borderWidth: 0, padding: '4px 6px', margin: '-4px -6px', borderRadius: 'var(--radius-md)',
      cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
      aria-label="Open this card's page">
      {children}
      <window.Icon name="chevron-right" size={16} color="var(--color-fg-3)" />
    </button>
  );
};

Object.assign(window, { D9Card, d9DeriveTitle, d9HostOf });
