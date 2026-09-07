// ============================================================================
// Circlists — sharing a card (BIZ-136 wild feature. NOT ratified.)
//
//   CardShareButton      — the act, in the card's action row.
//   circCardLocalUrl     — the address it hands over.
//   circReadCardParam    — reading one back on boot.
//   circPointedStyle     — how a card that was pointed at is drawn.
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
// ---- WHAT THE FOLLOWER MEETS, WHICH IS THE HARD PART -----------------------
//
// One address, two states, decided by the FOLLOWER'S OWN read-state rather than
// by the sharer.
//
//   they have read it   ──▶ Overview. The card's own surface, the conversation
//                           on it, everything. Nothing new is built for this.
//   they have not       ──▶ the feed, on Active, scrolled to that card, with
//                           the card POINTED AT.
//
// The second branch exists because of a product rule, not a technical limit:
// an unread card carries no way through, so Overview is reachable only from a
// card the member has already read. Landing a follower on Overview would break
// that rule AND spoil the conversation before they had read the thing it is
// about. So the address means "this card" and the app decides what this card
// looks like for you — which also means the sharer never has to think about the
// state of the person they are sending it to.
//
// **Not a scrim, and not a lift.** The obvious drawing of "pointed at" is to
// dim the feed and raise the card. Both were rejected: a scrim implies
// modality — something to dismiss — and there is nothing here to dismiss, the
// card is not a dialog; and a raised card with a shadow reads as picked up or
// dragging, which is a gesture this app does not have.
//
// What it uses instead is the app's OWN language for "this one": the 2px accent
// left bar that RailBody draws on the active circle and LensList draws on the
// selected contributor. A card wearing that bar reads as the one being pointed
// at, in a vocabulary the member has already met twice, and it costs two
// pixels. It is joined by the arrival glow — `CircGlow`, already built, already
// one-shot, already reduced-motion aware — because a card someone sent you IS
// an arrival, and the glow is this app's existing way of saying look here.
//
// **No banner.** "Shared with you" above the feed was considered and cut. The
// person who sent it told you what it was in the message they sent it in; a
// strip repeating that is chrome earning nothing. The bar and the scroll are
// the whole affordance. If that proves too quiet on a phone, the strip is the
// thing to add — recorded rather than built.
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

// The pointed-at treatment, as a style fragment rather than a component, so the
// card keeps its single `article` element and nothing wraps it. A wrapper would
// have broken the grid's own row sizing, which run 5 had to fix once already.
//
// The bar is drawn INSIDE the card's border box, so the card does not grow and
// nothing beside it shifts — a pointed card must not move the cards around it,
// or arriving at one rearranges the feed you were sent to.
const circPointedStyle = () => ({
  boxShadow: 'inset 2px 0 0 0 var(--color-accent)',
});

Object.assign(window, {
  circCardLocalUrl, circReadCardParam, circPointedStyle, CardShareButton,
});
