# Handoff: the app posture and its system bars (kit update)

2026-10-15. Source: the kit update "the app posture and its system bars" (kit branch `kit/mobile-posture`).

## Path taken (section 0)

No Platform switch existed, so every section was done, section 1 included. Owner ruling of 15 October: MCP Game Store takes the full carry. Platform defaults to Web, so nothing changes until someone switches it.

## What changed, and where

- `app/main.jsx`: `platform` state beside `layout`; `isApp`; `forcedMobile = layout === 'mobile' || isApp` (the build had no `isMobile`, so none was added). `KitPhoneBars` above `KitApp`. The clip gets `data-app` and the bars in the app posture. `isApp` is on the app context (`gs.isApp`, which is also the candidate API); `setPlatform` goes to `buildStates`; `platform` / `onPlatformChange` go to the Config launcher.
- `app/config.jsx`: the Platform row (Web / Mobile) above Viewport, and the new Viewport hint.
- `app/states.jsx`: the optional `platform` field, documented in the header and applied in `go` before staging. No entry uses it yet.
- `index.html`: the system-bar styles after `.kit-phone-screen`, with `var(--text)` as the icon fallback (the product's main text colour; it does not use `--color-fg-1`). The viewport meta already had `viewport-fit=cover`. The corrections are listed below.
- `ARCHITECTURE.md`: a § Postures section after the intro.
- `CLAUDE.md`: the § Designing block, word for word, before the product-copy block. Nothing else changed.

## `--kit-status-fg`

Not set. Every top surface is dark (`--page` #1B1917), and the fallback `--text` (#F0EEE8) reads on it. The product has no light top chrome to set it for.

## Audit (app posture, phone frame)

Each line gives the surface, its state address, and the result. "Fixed" means the miss was padded by the variable and nothing else was touched.

Top edge
- Top bar `.gs-top` (sticky, every chromed screen), `home`, `games`: missed, content under the status bar. Fixed: `padding-top` by the top inset. Its `--page` background runs up under the status bar, with no band.
- Auth frame `.gs-auth` (sign-in, sign-up, verify, recover, returning, username, and the provider frame for checkout / update-card), `sign-in`, `verify-email`, `reset-password`, `username-new-account`, `checkout`, `update-card`: missed, the back button sat under the status bar. Fixed: `padding-top` by the top inset.
- Not found `.gs-nf` (no top bar, wordmark first), `not-found`: missed. Fixed: `24px` + the top inset.
- Full-screen loader / offline `.gs-full`, `loading-full`: content is centred, so it holds; the top inset was added to its top padding so a short screen still centres clear of the bar.
- Push banner `.gs-pushask` (under the top bar), `push-banner-discover`: holds, because it inherits the bar's clearance.
- Simulated permission dialog `.gs-osperm` (fixed, `top: 8px`), `push-permission-dialog`: missed, a fixed offset. Fixed: `8px` + the top inset.
- Account menu `.gs-pop` (anchored to its button): holds.

Bottom edge
- Demo bar `.gs-demo` (fixed bottom, a prototype control) and its spacer `.gs-demo-space`: missed, under the home indicator. Fixed: the bar is padded by the bottom inset, and the spacer (44px, and 88px when it is two rows) grows by the same amount.
- Footer `.gs-ft`: holds, because it ends above the demo spacer.
- Bottom sheets `.mcp-pop.is-sheet` (play pop-up, Account sheets), `switch-sheet-yearly`: missed, a bare `env(safe-area-inset-bottom)` in the design system's `components.css`. Fixed locally in `index.html` with the variable form. **Carry upstream to Popup**, then delete the local rule.
- Config / States / QA sheets: mounted outside the phone frame, so they are out of scope.

`100vh` / `100%`
- `.gs-root`, `.gs-full` and `.gs-nf` use `100vh` but have `.kit-phone-clip … { min-height: 100% }` overrides, so they hold.
- `.gs-auth` used `min-height: calc(100vh - 44px)` with no phone override, so in both phone postures the auth foot sat below the fold. Fixed on the owner's word (2026-10-15): in the phone frame, `.kit-phone-clip .gs-auth { min-height: 0; flex: 1 0 auto; }`, so it fills the screen less the demo spacer.
- `.lb-tools` (sticky, `100vh`) applies only from 900px and never shows in the phone.

Bare `env()` / fixed offsets in `app/` and `index.html`: none left, apart from the sheet override, which reads the variable first. History (archive, old handoffs and playgrounds) was left alone.

Viewport: Mobile with Platform: Web sets no variables, so every correction resolves to `env()`, which is 0 in a desktop browser. Nothing moves, and no bars are drawn.

## Not done or unresolved

- Sheet inset: done 2026-10-15. Upstream `components/components.css` was synced into `_ds/` (cache key `?v=inset1`) and the local override deleted. Checked in the app posture: the clip sets `--safe-area-inset-bottom: 34px`, the sheet's bottom padding computes to 34px, and its last button ends above the home indicator.
- Popup shape: done 2026-10-15. Upstream `_ds_bundle.js` (Popup measures the layer it renders in) was synced into `_ds/` (cache key `?v=inset2`). Checked with the window at 924px, in the app posture: History → Filters opens as a sheet (`is-sheet is-panel`) flush with the screen's foot, with 34px bottom padding, and Done sits above the home indicator. No local override was added.
- Bundle hygiene (2026-10-15): the upstream bundle carries 9 non-component sections (`docs/archive/…`, `docs/specs/canonical-row/…`, `docs/specs/card-snug-title/…`, `ui_kits/shop/Screens.jsx`). Three of them call `createRoot` on the app's `#root`. The local copy keeps only the `components/…` sections (all 29 exports present) and is cached as `?v=inset3`. The createRoot warning is gone and `__errors` is empty. **Carry upstream:** the design system's bundler should take `components/` only. Until then, strip those sections again on every sync.
- No state carries `platform` yet. None is app-only today.

## Next

Get the owner's ruling on the `.gs-auth` height. Carry the sheet fix to the design system's Popup. When the product gets app-only content, add its states with `platform: 'app'` beside their web twins.
