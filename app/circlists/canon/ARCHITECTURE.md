# Architecture

How the Circlists prototype is put together. App-wide structure only — the app posture's own
rules live in [`MOBILE.md`](MOBILE.md).

## One app, three postures

Desktop web, mobile web, and **app** (native mobile) are three *presentation postures* of one
product, not three products. The rule that keeps them one:

> A change to a shared surface lands in all three postures with no per-posture edit.

Only the persistent **chrome** may differ between postures. Everything a user reads or acts on
inside that chrome — the feed, cards, members/settings, account, dormant, funding — is the same
component in every posture.

## How the swap works

`app/main.jsx` is the root state machine. It decides *which screen you are on* and never renders
chrome itself: it wraps the screen it built in `inShell(...)`.

```js
const Shell = (isApp && window.AppShellNative) ? window.AppShellNative : AppShell;
const inShell = (content, opts = {}) => <Shell {...props}>{content}</Shell>;
```

- **Web postures** get `AppShell` (`app/shell.jsx`) — rail on desktop, drawer on mobile web.
- **App posture** gets `AppShellNative` (`app/app-shell.jsx`) — top bar + bottom bar.
- Both shells take the **same prop surface** and the **same children**, so the screen inside is
  literally the same component either way. You cannot fork a surface per posture without visibly
  breaking that contract — which is the point.
- `isApp` comes from one switch: **Config → Platform (Web / Mobile)**. Session-only, not persisted.
  App posture always implies the phone viewport.
- **Only the app posture draws the system bars.** With Platform: Mobile the phone clip gets
  `data-app`, draws a status bar and a home indicator over the screen (`KitPhoneBars`, `main.jsx`),
  and sets `--safe-area-inset-top` / `--safe-area-inset-bottom` (59px / 34px). Content reads them as
  `var(--safe-area-inset-*, env(safe-area-inset-*, 0px))`. Viewport: Mobile on Web draws neither and
  sets nothing. The native top bar publishes the top inset as `--circ-app-top-inset` for the shared
  surfaces that stick below it.

The other posture-aware branches are payments (below) and a short, named list of content
differences the owner asked for on 5 Oct: the not-subscribed line and the status-only Subscription
card (`pppAppNoPay()`), the notifications card without
the Home Screen line, and the splash. Each is one check inside the shared component, never a second
copy; the table is in `MOBILE.md` → Named content differences. Everything else is chrome.

## Deletable aids and droppable modules

Files the app tolerates being **absent**, read once per render off `window` so no import breaks:

| File | Kind | Absent ⇒ |
|---|---|---|
| `app/app-shell.jsx` | droppable module | app posture gone; everything falls back to `AppShell` |
| `app/home.jsx` | droppable body | home falls back to its empty state (`NoSpaceHome`) |
| `app/gate.jsx` | droppable module | preview gate gone; real flows run |
| `app/config.jsx` | deletable aid | Config pill + review settings gone |
| `app/config-extra.jsx` | deletable aid | candidate overlays' Config rows gone (it is the one file that publishes `window.ConfigExtra`) |
| `app/states.jsx`, `app/states-ui.jsx` | deletable aids | states register gone: no `?state=`, no palette, no index |
| `app/qa.jsx` | deletable aid (draft) | QA half of the Config pill gone; the states it points at stay |
| `app/report-block.jsx` | droppable module | Report and Block gone; cards, comments and Members rows read as before |
| `app/startup.jsx` | droppable module | no splash and no can't-connect page; the app opens as before |
| `app/store-listings.jsx` | deletable aid | the two store-page routes render nothing; the register's Store listings group goes stale |
| `app/circ-tweaks.jsx`, `app/tweaks-panel.jsx` | deletable aids | Tweaks gone; baked-in defaults render |

## Addressable states

A ticket in the real build links to this prototype, so a reviewer has to be able to arrive at the
state the ticket is about — leaving a circle, a dormant circle, a payment retrying — without knowing
a click path.

Upstream law: monorepo
[`specs/governance/process/design-prototypes.md`](https://github.com/LatentMagic/monorepo/blob/main/specs/governance/process/design-prototypes.md)
— read it live (see `github.md`). It sets how our output is treated downstream, and two clauses bear
directly on the register. Validation compares the rendered surface against the prototype **live in a
browser, side by side** — which is what an address is for: the reviewer opens the state rather than
navigating to it. And it already uses the word *state* for something else: the console-level states
of a prototype (`canon/`, `next/`), read at the console, not tracked in the monorepo. Ours is a finer
register **inside** one of those. Keep the two senses apart when citing either.

`app/states.jsx` is the **register**: one entry per staged state, `{ group, id, label, stage }`. The
`id` is the state's address (`dormant-circle`, `funding-retrying`); `stage` is the staging function
(these moved out of Config, which now holds review settings only). Everything else is derived from
that one list and cannot drift from it:

- **`?state=<id>`** on the entry. `main.jsx` reads it once at mount (`circResolveState`) and stages
  the named state in an effect, so a named state **overrides the restored `localStorage` route**.
  Nothing in the address ⇒ the app opens on the top circle, exactly as the real app does.
- **`?state=index`, or a name the register does not hold** ⇒ the states index (`StatesIndex`,
  `app/states-ui.jsx`) renders instead of the app. That is how a stale ticket link shows itself: the
  reader sees a catalogue that does not contain the name they came for, rather than the wrong screen.
- **The palette** — the Config pill's second half. Jump to a state, or copy its link.
- **`window.CIRC_STATES`** — ids, labels and groups, published on the page for anything inspecting
  it. No staging functions, nothing runnable. A sibling JSON file would not survive the single-file
  export, which is why it is a global.

A state earns an entry by being hard to reach — a situation the app has to be staged into (a circle
you do not champion, a dormant circle, a retrying payment). A screen you can click to from a state
already in the register does not get one; the register is not a sitemap, and doubling the app as a
second index leaves two things to keep in step.

An id names the situation, not the app's internals — `members-non-champion`, never
`sp-book-settings`. Internals move; the situation is what a ticket was written about.

An `id` is **public** once a ticket links to it: renaming or removing one breaks those links, and the
index is the only thing that catches it.

An entry may carry **`platform: 'app' | 'web'`**. An app-only state sets Config → Platform to Mobile
(and Mobile payments Off) so its address opens it correctly; its web twin sets Web. An entry without
one leaves the Platform as it is. App-only states are a named exception to “a state is never a
twin”: the app differs in content, not width, so each sits beside its web twin. The pinned group
**Mobile app: where it differs** indexes them by address; it holds no staging of its own.

> **The resolver looks inert in preview, and is not.** Nothing in the design tool can hand this page
> a URL, so `?state=` does nothing there, in every posture. It is exercised by driving the register
> directly (`window.buildStates`, the palette, the index) — never by concluding from a screenshot
> that the address reading is dead. **Do not delete it on that evidence.** It also depends on the
> console forwarding the query string onto the iframe `src`; that is outside this project.

## Web-only payments

App posture + **Config → Mobile payments: Off** routes every create / funding / checkout / provider
path to the finish-on-web handoff (`WebHandoff`, `app/subscriptions.jsx`). It is a single
render-level guard in `main.jsx` covering `PAYMENT_ROUTES`, so *all* entry points — real flows and
Config scenarios alike — are covered and no checkout, price, or provider surface is reachable
in-app. Creating a circle is in that list because it is a funding act: the circle exists only once
it is funded, so the block lands on the tap rather than after the member has named and described
something the phone cannot keep.
`On` runs the real wizard in the app posture. Web ignores the setting entirely.
(Every state in the register goes through the same guard, so a deep link cannot reach a checkout
surface in-app either.)

## Conventions

- **JSX over `window`.** Every file exports with `Object.assign(window, { ... })`; scripts do not
  share Babel scope. Load order is fixed in `circlists.html`.
- **No `const styles = {}`.** Name style objects after their component — collisions across files
  are silent and fatal.
- **Container / presentation split**, focused components, split past ~200 lines. See
  `skills/frontend-ui-engineering/SKILL.md`.
- **State** lives in `main.jsx` unless it is purely local chrome state (a drawer, a transition).
- **Comments never cite a `docs/` path.** A comment never points at a task folder or a handoff: those move when work is archived, and the pointer then leads nowhere.
- **Comments carry intent and mapping, and flag the special; nothing else.**
  - Intent: a rule or decision the code keeps, with its reason.
  - Mapping: a short label that helps a reader find their way around a file, or says where a part sits in the product.
  - The special: behaviour a rebuild from screenshots of the usual states would get wrong (adaptive styling, overlap or overflow handling, a value chosen against the default). Mark it `// KEEP:` and state the outcome the product must keep, in plain words with any numbers that matter, then one clause of why. Never the algorithm. These marks are written for another agent: the one that integrates this prototype into the product reads `KEEP:` as "preserve this", so it never needs speccing in a ticket. Change that behaviour and you update or remove its `KEEP:` in the same edit.
  - No narration. A comment that restates what the code plainly does is deleted.

## Adding a Config row

- **A Config row:**
  1. Edit `config-extra.jsx`, or replace it with a file of your own. That file defines one component that holds every product row, and ends with `Object.assign(window, { ConfigExtra: YourComponent });`.
  2. Build the component from the four parts `config.jsx` publishes on `window`. Never write Config markup or `circ-config-*` classes by hand.
     - `ConfigGroup({ title, scope, children })` holds rows. A group with `scope="global"` joins the Global section, which holds the settings for the whole prototype, such as who is signed in; its `title` shows as a heading inside Global. Every other group is one feature's settings, and its `title` names its own section in the rail.
     - `ConfigRow({ label, value, onChange, options, hint })` is one choice. `options` is a list of `{ value, label }`; `onChange` receives the chosen `value`.
     - `ConfigAction({ label, onClick, hint })` is a one-shot event, such as a renewal that fails. Config shows a group's actions together under Events. A click plays Config's exit, then runs `onClick` and closes Config, so an animated act plays on a clear screen. The handler never closes Config itself.
     - `ConfigNote({ children })` is one short line that says why a row is absent, such as "Plans page: off while Takes payment is No".
  3. Keep each `hint` to one or two short sentences. A hint opens under its row from an info button; an action's hint opens from the Events heading.
  4. Only one file can publish `window.ConfigExtra`. With two, the one loaded last wins and the other's rows never show. If you replace the file, swap its script tag in `../circlists.html` (after `config.jsx`, before `main.jsx`).

Here `config-extra.jsx` composes the rows each candidate overlay exports (`PppConfig`, `CandTalkConfig`); a new overlay exports its component and is added there. The rows driven by `main.jsx` props (Platform, Viewport, Mobile payments, Preview gate, TEST circles, Reset, Sign-in, Liveliness, Notifications) live in `ConfigModal` itself.
