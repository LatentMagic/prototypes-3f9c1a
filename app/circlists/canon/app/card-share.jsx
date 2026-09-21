// ============================================================================
// Circlists — sharing a card.
//
//   CardShareButton      — the act, in the card's action row.
//   CardShareMenuItem    — the act, as an item in the card's kebab menu (run 10).
//   circCardLocalUrl     — the address it hands over.
//   circReadCardParam    — reading one back on boot.
//
// A DELETABLE AID. Drop this file and every share affordance disappears, the
// action rows return to what they were, and an incoming card address falls
// through to the ordinary circle. Same contract as feed-lens, feed-saved and
// the rest.
//
// ---- WHAT IS SHARED --------------------------------------------------------
//
// **The card, not the link inside it.** The URL somebody added is already
// shareable — anyone can copy it out of the card and send it. What has no route
// today is the card itself: who added it, the thought they left on it, what the
// circle said back. The backlog concept says exactly this, and it is the whole
// reason a share button is worth a slot in a row this app keeps deliberately
// thin.
//
// ---- WHAT THE FOLLOWER MEETS (LM-797) --------------------------------------
//
// **One address, one destination: the card's Overview.** Read or unread, the
// address resolves to the same place. What read-state decides is what that
// Overview SHOWS — pre-read it withholds the conversation and stands
// Mark-as-Read in the head card's door slot (app/talk-surface.jsx) — never
// where the address leads.
//
// This replaces a two-destination arrival: read went to Overview, unread went
// to the Active feed with the card POINTED AT, wearing a 2px accent bar and the
// arrival glow. Both the second destination and its treatment are retired. The
// rule it was protecting — an unread card carries no way through — is intact:
// nothing on the Active feed opens an unread card's Overview, and the shared
// address remains the only way in. The conversation is not spoiled either,
// because the pre-read Overview does not render it.
//
// What the sharer has to think about is unchanged, which was always the point:
// nothing. The address means "this card", and the app decides what this card
// looks like for the person who follows it.
//
// ---- WHO MAY FOLLOW ONE ----------------------------------------------------
//
// A member of that circle. Everyone else — a non-member, a member of a
// different circle, a card deleted for everyone — meets the not-found page,
// which deliberately never says whether the thing exists (hld.md Decision-44).
// That is the entire privacy answer and it needed nothing new: the page built
// for item 5 already answers this question correctly.
// ============================================================================

// The address a share hands over.
//
// The route this PROPOSES for the product is `/c/<circle>/card/<card>` — the
// card as a first-class address under its circle. That shape is the proposal
// and it lives in the spec; it is deliberately not built here as a dead
// constant, because a symbol nothing calls reads as live code and is not.
//
// What the button actually copies is the address that resolves in THIS build,
// so a link taken out of the prototype opens the card when it is pasted back.
// `?card=<id>` is read once at boot (main.jsx) and then cleaned out of the bar.
const circCardLocalUrl = (item) => {
  if (!item || typeof window === 'undefined') return '';
  const u = new URL(window.location.href);
  u.search = '';
  u.searchParams.set('card', item.id);
  return u.toString();
};

// ---- The act ---------------------------------------------------------------
// Native share sheet where the platform has one, clipboard where it does not.
// No bespoke sheet either way: a share UI this app drew itself would be a
// second thing to learn for a job the phone already does better, and it is the
// one place where deferring to the platform IS the elegant answer.
//
// The confirmation is a FORM change, not a toast and not a colour: the glyph
// becomes a check for a beat and returns. That is the app's own grammar for a
// completed gesture — the save toggle changes form, the lens trigger changes
// shape — and a toast would be the first in the product.
const CardShareButton = ({ item, space, className, size = 15, announce }) => {
  const [done, setDone] = React.useState(false);
  const timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  const flash = () => {
    setDone(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(false), 1600);
  };

  const share = async () => {
    const url = circCardLocalUrl(item);
    const title = item.title || item.source || 'A link';
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        // No flash on the native path: the sheet is its own acknowledgement,
        // and a check appearing behind a dismissed sheet reads as a second
        // thing having happened.
        return;
      }
    } catch (e) {
      // A cancelled share is not a failure and says nothing.
      if (e && e.name === 'AbortError') return;
    }
    try {
      await navigator.clipboard.writeText(url);
      flash();
      if (announce) announce('Link copied');
    } catch (e) {
      // Clipboard refused (an insecure origin, or permission). The gesture
      // still has to resolve into something, so the address goes on screen for
      // the member to take themselves rather than failing silently.
      if (announce) announce('Copy the link from the address shown');
      window.prompt('Copy this link', url);
    }
  };

  return (
    <button type="button" className={className} onClick={share}
      aria-label="Share this card"
      title={done ? 'Link copied' : 'Share this card'}>
      <Icon name={done ? 'check' : 'share'} size={size} />
    </button>
  );
};

// ---- The act, as a menu item (run 10) ---------------------------------------
// Same gesture as CardShareButton above, wearing the card's own kebab-menu
// grammar (spaces.jsx's per-row menu) instead of a standing icon. Kept
// alongside CardShareButton, not in its place — a superseded state (run 9's
// row) still renders the old button, and the deletable-aid contract in this
// file's header covers both: drop the file and the menu simply has no Share
// item, everything else unchanged.
//
// The acknowledgement stays inside the control pressed, same as the button's
// own form-change grammar, just spoken as this item's own label rather than
// its glyph: native path, the platform sheet is the acknowledgement, so
// `onDone` fires at once and nothing flashes; clipboard path, the label reads
// "Link copied" for the same 1600ms beat the button used, then `onDone` fires
// and the menu closes.
const CardShareMenuItem = ({ item, space, announce, onDone }) => {
  const [done, setDone] = React.useState(false);
  const timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  const share = async () => {
    const url = circCardLocalUrl(item);
    const title = item.title || item.source || 'A link';
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        onDone && onDone();
        return;
      }
    } catch (e) {
      // A cancelled share is not a failure and says nothing.
      if (e && e.name === 'AbortError') { onDone && onDone(); return; }
    }
    try {
      await navigator.clipboard.writeText(url);
      setDone(true);
      if (announce) announce('Link copied');
      clearTimeout(timer.current);
      timer.current = setTimeout(() => { setDone(false); onDone && onDone(); }, 1600);
    } catch (e) {
      // Clipboard refused (an insecure origin, or permission). Same fallback
      // as the button: the address goes on screen for the member to take.
      if (announce) announce('Copy the link from the address shown');
      window.prompt('Copy this link', url);
      onDone && onDone();
    }
  };

  return (
    <button type="button" role="menuitem" className="circ-menuitem" onClick={share}
      style={{
        // 44px floor (ui.md:53/113), not spaces.jsx's 40 — see feed.jsx's
        // menuItemBase for the same note.
        display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
        background: 'transparent', border: 0, cursor: 'pointer', padding: '11px 10px', minHeight: 44,
        borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 14,
        color: 'var(--color-fg-1)', whiteSpace: 'nowrap',
      }}>
      <Icon name={done ? 'check' : 'share'} size={16} />
      {done ? 'Link copied' : 'Share'}
    </button>
  );
};

// ---- Arriving from one ------------------------------------------------------
// Read once at boot and then held in app state; the address is cleaned out of
// the bar afterwards so a refresh does not re-point at a card the member has
// already dealt with. `replaceState`, so no history entry — the same call the
// console's own deep-linking makes.
const circReadCardParam = () => {
  try {
    const u = new URL(window.location.href);
    const id = u.searchParams.get('card');
    if (!id) return null;
    u.searchParams.delete('card');
    window.history.replaceState(null, '', u.pathname + (u.search || '') + u.hash);
    return id;
  } catch (e) { return null; }
};

Object.assign(window, {
  circCardLocalUrl, circReadCardParam, CardShareButton, CardShareMenuItem,
});
