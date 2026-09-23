# LM-771 — share intake · handoff

## 2026-09-23 — five fixes on canon (fuzz pass + intent audit)

Latest round. The sections below it are the 2026-09-22 build record; the
audit's own rulings are in `handoff-2026-09-23_share-intake-audit.md`.

**Built** (all in `app/main.jsx` unless named):
1. **Sign-out clears the held link** — `signOut` calls `cancelShareAdd()` +
   `setShareLink('')`. Completing sign-up (OTC and Google, `post-signup`)
   clears it too. Clearing is on *completion*, not on tapping "Create an
   account", so going back to sign-in still shows the lead.
2. **Add timer cancels on early exit** — `shareAddTimer` ref holds
   `{ id, spaceId }` while the 760ms beat runs. An effect on `[route,
   currentId]` cancels (clearTimeout + `setAddPrefill('')`) the moment
   `route !== 'space'` or `currentId !== spaceId`. The timer nulls the ref when
   it fires. Staying in the circle is unchanged.
3. **Recovery returns to the picker** — `onForgot` sets `postAuthTo` to
   `'share-intake'` on a share arrival (else `'space'`), as Google already did;
   `Recovery`'s `onDone` returns to `share-intake` when `postAuthTo` says so
   *and* a link is held, else `goHome()`.
4. **Signed out, no link** — no change needed; `shareArrival` is still gated on
   `shareLink`, which items 1–2 now keep empty.
5. **Text-plus-link** — `circShareExtractUrl` (top of `main.jsx`), applied
   inside the `setShareLink` wrapper, so every writer (arrival, stagers, ×,
   pick) goes through it. `shareLink` → picker line → `addPrefill` only ever
   hold the bare URL; no URL ⇒ `''` ⇒ bare arrival. The thought field is
   untouched.
6. **Register** — `share-intake-text-link` in `app/states.jsx`;
   `stageShareIntake`'s `link` now also takes a raw payload string
   (`CIRC_SHARE_TEXT`).

**Choices, and why:**
- **Regex:** first match of `https?://[^\s<>"'\`]+`, then trailing `.,;:!?` and
  closing curly quotes are stripped, and a closing `)`/`]`/`}` is stripped only
  when unbalanced (keeps `/Foo_(bar)`, drops the `)` of `(https://a.b)`). A match
  with no host is rejected. It runs **in the setter**, not on arrival, because
  the setter is the one door every path uses — a guarantee at one point rather
  than a rule each caller must remember.
- **Mock string:** `Replicated Log — Patterns of Distributed Systems https://martinfowler.com/…/replicated-log.html`
  — headline then link, the shape reader and news apps hand over, reusing the
  existing long link so the line still scrolls.
- **Leaving the circle** = any route other than `space`, or a different
  `currentId`. This also cancels if Account opens inside the 760ms; that drops
  the link, the safe side of the rule.

**Unresolved:** nothing new. Sign-up and asleep-circle drops stand as ratified.

**Next:** the owner walks the acceptance list at 390 and 1280, especially the
760ms early exit (tap a circle, then Home or another circle at once).

---

**Date:** 2026-09-22 · **State:** built into the main app, unratified. The owner
audits it in place.

## What was built, and where

The share intake is the screen a member lands on after sharing a link into
Circlists from another app. One new surface (the picker); everything else is an
existing screen reached the way it is already reached.

| File | Change |
|---|---|
| `app/share-intake.jsx` | **New.** `ShareIntake` (the picker page, incl. the no-circles body), `ShareHeldLink`, `ShareSignInLead`, `ShareNoCirclesLine`. Droppable module — `main.jsx` reads `window.CircShareIntake` per render. |
| `app/home.jsx` | Extracted the circle row into `CircleRow` and exported it (+ `circleSummary`). `CirclesHome` now maps to it. Nothing about the row changed. |
| `app/main.jsx` | `shareLink` + `addPrefill` state (ephemeral, never persisted), `shareIntakePick` (the tap-through), the `share-intake` route branch, the sign-in lead + post-auth return, `initialUrl` on `AddReveal`, `setShareLink` into the register's context. |
| `app/feed.jsx`, `app/talk-add.jsx` | `AddReveal` / `CandAddReveal` take `initialUrl`, read on open only. Both, because `talk-add.jsx` re-publishes `window.AddReveal`. |
| `app/auth.jsx` | `AuthFrame` takes an optional `lead` slot above the card; `SignIn` passes it through. No auth surface changes without it. |
| `app/states.jsx` | `stageShareIntake` + five register entries (group **Share intake**). `reseed` clears the held link. |
| `circlists.html` | Loads `app/share-intake.jsx` after wizard / home / spaces / auth. |

The picker is a frameless `WizardShell` with `flow={null}` — × only, no step
dots, no back — in every posture. × clears the held link and goes home, no
confirm.

## Addresses

| State | `?state=` |
|---|---|
| Picker, several circles, one asleep | `share-intake-picker` |
| Picker, a member with one circle | `share-intake-one-circle` |
| A bare arrival (no link held) | `share-intake-bare` |
| No circles yet | `share-intake-no-circles` |
| Signed out, holding a link | `share-intake-signed-out` |
| Picker, link extracted from shared text | `share-intake-text-link` |

The tap-through of its own: it lands on a circle's feed with its
own add open, and on a circle's wake-up page — both already addressable.

Nothing was added to **Config**. The launcher's own split is that a setting is a
mode you hold and a state is an address you open; a share arrival is an arrival,
so it belongs in the register, and the States palette picks these five up from
the register with no Config edit.

## What I chose, and why

**Title — "Add to which circle?"** The working copy, kept. It is the only
question the screen asks, it is sentence case with the question mark the app's
dialog titles already use, and it names the act (*add*) rather than the
mechanism (*share*) — the member has already shared; what is left is where it
lands.

**The link — one truncated mono line, centred under the title, ellipsis at the
end.** Mono because a URL is mono everywhere in this app. Truncated from the
*right* so the domain survives: the domain is the part a member reads to confirm
the app handed over the right thing. The full URL is in the element's `title`,
which costs nothing and adds no surface. `mb` on the title tightens from 20 to
12 when a link is present, so the two read as one block rather than as a title
and a stray line.

**The no-circles body carries no title.** "Add to which circle?" over a screen
saying you are in none would be a question the screen cannot answer.
`NoSpaceHome` brings its own heading, so the picker's title stands down.

**The add opens 760ms after the tap** — just past the feed's own 700ms load
beat, so the sheet slides up over a circle that has arrived rather than over a
spinner. "As if the member had tapped the circle's add button" is what that
number is serving.

**Two link fields, not one.** `shareLink` (held by the intake) and `addPrefill`
(handed to the add) are separate, and the FAB clears the prefill on tap, so a
member's own add can never inherit a link from an arrival.

**`share-intake` is unresumable.** It joins `CIRC_UNRESUMABLE` in `main.jsx`:
the held link is ephemeral by design, so a restored picker would be a share
screen with nothing being shared. The RESTORE path only — stagers set the route
after boot, so every register entry still opens.

## Unresolved — the owner's calls

1. **The wizard column is 300px.** The picker inherits `WIZARD_COL`, so its rows
   are narrower than home's and the link truncates early (`…/articles/pat…` at
   390 and at 1280 alike). That is the ratified wizard shape held literally.
   Whether *this* page should widen its column is a question I did not answer
   for myself.
2. **An asleep circle drops the link silently.** Ratified behaviour — the circle
   opens on its wake-up page and the link is not carried — and nothing says so.
   I did not add a line, per the brief. If a member should be told, that is a
   line, not a screen.
3. **Create an account, from the signed-out state.** Sign-in returns to the
   picker (email and Google both). Signing *up* was not named: it runs the canon
   post-signup path and lands on home with the link dropped. Worth a ruling.
4. **No `CHANGELOG.md` entry** yet. The shape of the product did change, which
   earns one by the project's own rule, but the design is unratified — so the
   entry waits on the audit rather than recording a decision nobody has made.

## What I would do next

Read the five states at 390 and 1280, then rule on (1) — the column width is the
only thing in this build that makes the picker look unlike home. Everything else
here is a line of copy the audit can cut without touching the flow.
