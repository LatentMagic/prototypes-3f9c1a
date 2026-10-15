# Handoff — store listings — 2026-10-15

## Built
- `app/store-listings.jsx` (deletable aid, loaded after `app/startup.jsx`): `CircStoreAppStore`, `CircStoreGooglePlay`. No Circlists tokens in the chrome.
- Routes `store-app-store`, `store-google-play` in `app/main.jsx`, rendered without the shell, guarded on `window`, both in `CIRC_UNRESUMABLE`.
- Register group `Store listings` in `app/states.jsx` (no `platform`):
  - `circlists.html?state=store-listing-app-store`
  - `circlists.html?state=store-listing-google-play`
- QA entry `store-listings` in `app/qa.jsx`.
- Row in `ARCHITECTURE.md` → Deletable aids; one entry in `CHANGELOG.md`.
- Assets: the ten PNGs, moved from `uploads/store-listings-uploads/` (where the upload landed) to `uploads/store-listings/`, the brief's paths.

## Yours to decide: what was chosen
- **Desktop width.** One phone-width column (max 430px), centred on a neutral grey ground (Apple #E5E5EA, Play #E8EAED). No second device frame. In Viewport: Mobile or Platform: Mobile the column fills the prototype's own phone, and pads top and bottom by the safe-area variables. Why: both store pages are phone pages; at desktop width a stretched store page would misrepresent them.
- **Access.** The owner raised (chat, 15 Oct) whether these belong behind a special button, or with the mobile platform, since they sit apart from the app. Built as the brief settles: the States palette and the address only, no Platform forced. **Ratified by the owner, 15 Oct: States palette only.**
- **Chrome.** Apple: "‹ Search" bar, header, three-cell facts row with small uppercase labels (Ratings / Age / Category), screenshot row, promo text, description clamped to 3 lines with "more", an "Information" table (Seller, Copyright) and the three links as rows (deck label in blue, URL at right). Play: back and more glyphs, feature graphic, header, chips row with vertical hairlines, Install, screenshot row, "About this app →" (arrow turns down when open), an "App support" heading over the three links.
- **Feature graphic lockup** uses `brand/assets/circlists-lockup.svg` (mark + wordmark) rather than redrawing them.
- **Fonts.** Inter (Apple fallback after system SF) and Roboto, loaded from Google Fonts by the module only when a store page opens.

## Set by the brief, owner has not ruled
- Play feature graphic: banner option A (cream) with "A shared list, with your own place in it."
- Apple `No Ratings`; Play chips `Rated for 18+`, `Social`, `No reviews yet`.
- Not rendered: Apple keywords, Play account-deletion URL, age-rating answers.

## Unresolved
- The brief's Play field list says the third chip is `New`; its Settled list and chip list say `No reviews yet`. Built `No reviews yet`.
- Apple's real page labels links "Developer Website / App Support / Privacy Policy"; the deck's field names (Support, Marketing, Privacy) are shown instead.
- Store chrome labels added that the deck does not hold: "Search", "Ratings", "Age", "Category", "Information", "Seller", "Copyright", "About this app", "App support", "Get", "Install".

## Next
- Owner reviews copy and shots (QA → Store listings).
