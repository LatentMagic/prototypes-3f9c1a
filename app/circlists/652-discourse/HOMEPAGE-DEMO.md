# The homepage demo

The demo a stranger plays with on `circlists.com`, embedded there in an iframe. It is **not a
separate build of the app** — it is the app, reached through its own entry, booting into its own
state. It lives in this project, travels with the working line, and **must be reproduced by every
export**.

If the demo is missing from an export, that is a defect: the marketing page then has nothing to
embed, and the old hand-maintained delete-list comes back.

## What it is made of

| File | Role |
|---|---|
| `circlists-homepage-demo.html` | the demo entry, at the project root beside `circlists.html`. **The entry is the manifest** — the downstream build reads its `<script>` tags to know which modules to compile and in what order. |
| `demo/demo-overlay.jsx` | arms the preview gate, sets the demo's own persisted-state key. Nothing else. |
| `demo/demo-seed.jsx` | the demo's **own** seed. Loaded instead of `app/seed-data.jsx`. |

Everything else is `app/*`, unmodified. The working line — `circlists.html`, `app/`, its seed — is
untouched by the demo, exactly as a candidate build leaves it untouched.

## Omission, not deletion

A module the entry does not list is not in the demo. That is the whole mechanism: there is no
delete-list for a person to keep in step, and the reason a module is absent sits next to its absence,
in the entry's own comment.

Left out today, and why each is unreachable:

- `app/seed-data.jsx` — replaced by `demo/demo-seed.jsx`.
- `app/config.jsx`, `app/tweaks-panel.jsx`, `app/circ-tweaks.jsx` — development aids; `main.jsx`
  guards on their `window` names and falls back to `CIRC_TWEAK_FALLBACK`.
- `app/auth.jsx` — the `signin` route is reached only by Sign out or Delete account, both behind the
  account control, which the gate takes over.
- `app/wizard.jsx` — rendered only by `CreateSpace` / `FundingPage`, both behind **New circle**.
- `app/subscriptions.jsx` — funding, checkout, provider, dormant, web-handoff. Every entry point is
  New circle, circle settings, or an unfunded circle; the first two are gated and the demo seed has
  no unfunded circle.

Kept although it looks droppable: **`app/spaces.jsx`** — `main.jsx` renders `NoSpaceHome` and
`ReverifyDialog` from it unconditionally, and its `ContentPage` frames the in-shell pages.

### The rule that makes omission safe

Modules are separate scripts, so a name a kept module *refers to* but never renders resolves late.
That is why leaving a module out works — and it is also the failure mode: **if a route reaches a
component whose module the entry did not load, the demo white-screens at that moment**, on whatever
a visitor clicked.

So the gate is not a convenience, it is what makes the omissions correct. Any change to the entry's
module list, to the gate's scope, or to the seed has to be walked route by route before it lands.

## The gate covers exactly three controls

**New circle**, **circle settings**, **account**. Each opens the sign-up blocker
(`app/gate.jsx`) instead of routing on. Widening or narrowing that scope is a product decision — not
something to adjust to make an omission work. If a route would reach an omitted module and the gate
does not cover it, keep the module and raise it.

Everything else stays live and real: both tabs, adding a link, the reaction flow and its reveal,
the reaction door on a read card, delete (everyone-delete), switching circles, the refresh receipt.

## The seed is its own, and it is purpose-built

The development seed exercises failure — dormant circles, terminal states, former members, stress
fixtures, `TEST - *` circles. The demo needs the opposite: **two circles that look like real
circles, doing the ordinary thing well.** One the visitor champions, one championed by someone else,
with other members' names, read-state that is not the visitor's, and reactions — the proposition is
that this is shared, so a demo where the visitor is alone demonstrates nothing.

Never reuse the development seed and strip it back. Nothing broken, nothing labelled TEST, and no
more rows than it takes to feel real — every extra row is weight on a marketing page.

**No third-party request, for any reason.** A visitor's browser hands its IP to nobody before the
demo runs. Two traps live in the seed:

- `feed.jsx` falls back to Google's favicon service for any host `window.CircFavicons` does not
  answer. So every seeded item must either use a host with a baked-in favicon
  (`uploads/card-favicons/`) or carry `faviconExists: false`.
- Preview images must be local files (`uploads/card-previews/`).

React and the fonts (`tokens.css` imports Google Fonts) are vendored by the downstream build. Do not
add any other external URL to the entry, the overlay, or the seed.

## What the demo must not do

- Change the working line. Not `app/`, not its seed, not `circlists.html`.
- Change how the app decides its layout. The marketing page's wrapper passes layout mode in
  explicitly and handles the phone case itself; it is built on the app's current behaviour and would
  break silently. In particular the overlay must **not** set `window.CIRC_TWEAK_DEFAULTS` — that is
  the wrapper's injection point.
- Carry behaviour of its own. If the demo would be better with a product change, that is a separate
  conversation.

## Keeping it alive

Every export reproduces `circlists-homepage-demo.html`, `demo/demo-overlay.jsx` and `demo/demo-seed.jsx`
alongside the working line. When a module is added to or removed from `circlists.html`, decide
whether it belongs in the demo entry too, and record the reason in the entry's comment. When a new
route or affordance appears in the app, walk the demo again: the question is always whether a
visitor can now reach something the entry did not load.
