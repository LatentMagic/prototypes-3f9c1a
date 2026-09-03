// ============================================================================
// Circlists — Not-found + feed load-error (feed-enhancement candidate build).
//
//   CircNotFound — the app-level not-found page. A thin CalmPage (app/spaces.jsx)
//                   wrapper, in the same shape as that file's own InvalidInvite /
//                   SpaceFull: this is a THIRD calm full page, not a new pattern.
//   FeedError    — the feed region's own load-failure state. NOT a page: the
//                   shell, the tabs and the lens chip row all render outside
//                   this component (main.jsx builds them before `feed`), so a
//                   failed fetch never takes the chrome down with it.
//
// A DELETABLE AID, in this app's own idiom (see feed-saved.jsx / feed-lens.jsx's
// own headers): main.jsx guards CircNotFound's mount (`window.CircNotFound &&`),
// so an absent file leaves the not-found route rendering nothing rather than
// throwing. FeedError's render site is guarded the same way (`feedError &&
// window.FeedError`), so the error branch falls through to the ordinary feed
// rather than throwing — which matters most for the homepage demo entry, whose
// own module list is separate from this one's and need not carry this file.
// ============================================================================

// ---- App-level not-found -----------------------------------------------
// No eyebrow: InvalidInvite and SpaceFull both say "Invitation" because they
// belong to that flow; this page answers a bare bad address and belongs to
// nothing, so the slot is left empty rather than reused for a synthetic label.
//
// The body deliberately never says WHICH is true — gone, or never yours. That
// is not a missing detail, it is the ruled shape: confirming a circle exists
// (even by name, even by omission — a different wording for each case would
// do exactly that) leaks membership to somebody with a stale or guessed link.
// Modelled on Notion's own not-found wording for the same reason.
const CircNotFound = ({ onHome }) => (
  <CalmPage
    title="Page not found."
    body="Either this address doesn’t exist, or it isn’t available to you."
    actionLabel="Go home" onAction={onHome} />
);

// ---- Feed load-error ------------------------------------------------------
// Built to SavedNoMatch's shape (app/feed-saved.jsx) so every zero/error state
// in the feed body reads as one family: centred column, same padding and gap,
// same two-line register, same bordered ghost button.
//
// NOT accent, matching SavedNoMatch's own button rather than LensNoMatch's.
// Retrying a failed fetch is a recovery action, not a primary one — the same
// reasoning SavedNoMatch's comment gives for its own outline treatment, and it
// applies harder here: an accent button reads as "the thing to do", but the
// member did nothing wrong and there is no thing to do beyond trying again.
const FeedError = ({ onRetry }) => (
  <div role="status" style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', padding: '56px 24px', gap: 6,
  }}>
    <p style={{
      margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)',
      fontWeight: 600, color: 'var(--color-fg-1)',
    }}>This didn’t load.</p>
    <p style={{
      margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)',
      color: 'var(--color-fg-2)', maxWidth: 320, lineHeight: 1.5,
    }}>Something went wrong fetching this circle’s links.</p>
    <button type="button" onClick={onRetry} style={{
      marginTop: 10, background: 'transparent', cursor: 'pointer',
      border: '1px solid var(--color-border-1)', borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 600,
      color: 'var(--color-fg-1)', minHeight: 'var(--tap-target-min)', padding: '0 16px',
    }}>Try again</button>
  </div>
);

Object.assign(window, { CircNotFound, FeedError });
