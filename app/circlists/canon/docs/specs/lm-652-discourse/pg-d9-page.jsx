// ============================================================================
// Discourse v9 — the card's page (state 2's record surface).
// Not a new destination: it is the card, opened. It is reached only from the
// card, it carries the card's own material, and the way back is the shell's own
// back control. What it buys over a sheet is room — the article is at the top,
// the conversation has the middle, and the composer is not fighting a scroll
// inside a scroll on a phone.
// ============================================================================
const { D9Thread: PTH, D9Composer: PCO, D9ThoughtHead: PHEAD, D9Landed: PLANDED,
        D9Watch: PWT, d9Title: pTitle, d9HostOf: pHost } = window;

const D9CardPage = ({ item, ctx, wanted, st, goTo }) => {
  const [replyTo, setReplyTo] = React.useState(null);
  const [imgBroken, setImgBroken] = React.useState(false);
  const host = pHost(item.url);
  const source = item.source || host;
  return (
    <main style={{ flex: 1, width: '100%' }}>
      <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', width: '100%',
        padding: '20px 20px calc(40px + env(safe-area-inset-bottom, 0px))',
        display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* the article, whole and reachable */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ font: '600 12.5px/1.3 var(--font-sans)', color: 'var(--color-fg-2)' }}>{source}</span>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="circ-cardtitle"
              style={{ font: '600 20px/1.3 var(--font-sans)', letterSpacing: '-0.015em', color: 'var(--color-fg-1)', textDecoration: 'none', textWrap: 'pretty' }}>
              {pTitle(item)}
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 2 }}>
              <a href={item.url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, minHeight: 40, textDecoration: 'none',
                  font: '600 13px/1 var(--font-sans)', color: 'var(--color-accent)' }}>
                <window.Icon name="external-link" size={14} color="var(--color-accent)" />Open the article
              </a>
              <PWT item={item} onToggle={ctx.toggleWatch} />
            </div>
          </div>
          {item.hasImage !== false && (
            <a href={item.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true" className="circ-thumblink"
              style={{ flexShrink: 0, display: 'block', width: 72, height: 72, borderRadius: 'var(--radius-md)', overflow: 'hidden',
                borderWidth: 1, borderStyle: 'solid', borderColor: 'var(--color-border-2)' }}>
              {item.image && !imgBroken
                ? <img src={item.image} alt="" onError={() => setImgBroken(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                : <span style={{ display: 'block', width: '100%', height: '100%', background: 'linear-gradient(135deg,#33413f,#54655f)' }} />}
            </a>
          )}
        </div>

        {item.thought && (
          <div style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)', paddingTop: 18 }}>
            <PHEAD item={item} size={16} />
          </div>
        )}

        <div style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)', paddingTop: 6 }}>
          <PLANDED item={item} />
        </div>

        <div style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)', paddingTop: 20 }}>
          <PTH item={item} avatars showGlyph collapse tail={4} onReply={setReplyTo} gap={22} />
        </div>

        <div style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: 'var(--color-border-2)', paddingTop: 18 }}>
          <PCO item={item} ctx={ctx} lines={3} max={260} replyTo={replyTo} onCancelReply={() => setReplyTo(null)}
            placeholder={item.thought ? 'Answer ' + (item.thought.by === 'You' ? 'your own note' : item.thought.by) + ', or say your own thing' : 'Say something to the circle'} />
        </div>

        {wanted && goTo && <window.D9PageNext wanted={wanted} st={st} item={item} goTo={goTo} />}
      </div>
    </main>
  );
};

Object.assign(window, { D9CardPage });
