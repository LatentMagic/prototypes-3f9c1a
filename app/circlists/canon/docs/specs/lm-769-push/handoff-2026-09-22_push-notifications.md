---
date: '2026-09-22'
ticket: 'LM-769'
topic: 'push-notifications'
status: 'in-progress'
type: 'implementation'
---

# Handoff: LM-769 push notifications — the ask is being reset

## Current Focus

**The user has called a complete reset on the form of the in-app ask. Do not
open the rig and ask him to pick again.** His words, closing the session of
2026-09-22 (second session): *"I think we need to do a complete reset here. I'm
not a big fan of where things are going. I think you and I are miscommunicating,
and I think we need to start again."*

So the next session does **not** start by drawing a fifth form. It starts in
chat, with him, re-establishing what the ask is for, where it lives, and what it
is not allowed to be — before anything is built. Four forms now exist in the rig
and every one of them has drawn an objection; the rig has stopped being a way to
decide and has become a way to keep asking.

Everything else in the feature is built and working, and is background until
that lands. Nothing about the ask, the Account setting, the statements or the
device preview has been ratified.

## Task(s)

Done:

- Built the whole feature into the app (not beside it): the ask, the Account
  setting with its four states, the simulated device dialog, the device
  preview, six register entries.
- Folded `docs/specs/pwa-notifications/` into this folder when the ticket id
  arrived, per `CLAUDE.md`'s rename rule. One launcher ticket, two rigs.
- Built the option rig after the user called the first ask "one of the most
  poorly designed pieces of UX I've ever seen" and asked to stop iterating in
  the app.
- Second session (onboarding): added a **fourth** form to the rig, twice. First
  as "the pill" — the New pill's chrome carrying the sentence — which he
  rejected outright ("it's just 3 without the lines"); then rebuilt as what he
  had actually asked for, option 3's row with its hairlines removed and nothing
  in their place. That is what option 4 is now.

Not done: desktop firing frequency (deferred by the user, untouched); whether
the app icon carries a badge count on desktop (never discussed); the
`CHANGELOG.md` entry (owed — the product's shape changed — but withheld until
the choices are ratified, because the changelog is not where a decision gets
settled).

## Critical References

- `CLAUDE.md` — the ratification rule (nothing is decided without the user
  saying so in words) and the ~150-word chat-reply rule. The user objected this
  session to ratification items being parked in a handoff rather than put in
  chat: **put the ask to him in the reply, not here.**
- `skills/build-playground/SKILL.md` — the rig follows it; the shared dark bar
  (`pg-push-topbar.jsx`) is a verbatim copy of the discourse rig's, which is
  what that file was written for.
- `specs/governance/standards/ui-design.md` (monorepo, read live) — the
  statement-over-a-disabled-control rule is what both Account statements are
  built on.

## Recent changes

Shipped build:

- `app/push.jsx` — `CircPushAsk`, `CircPushSetting`, `CircPermissionAsk`,
  `CircSwitch`. Droppable module.
- `app/push-preview.jsx` — `CircDevicePreview`: iPhone lock screen, iPhone Home
  Screen with the badge, and the Android shade.
- `app/main.jsx` — the `push` object (`perm`/`on`/`ask`/`channel`), persisted in
  the state blob; `permAsk`, `devicePreview`; `pushWantOn` / `pushAnswer` /
  `pushSetOn` / `pushDismissAsk` / `pushAskVisible`; the ask rendered **first**
  in the feed column (above the returns bar and the New pill); the dialog above
  every app overlay; the preview as a top-level branch beside the states index.
- `app/spaces.jsx` — `AccountSettings` takes `push` / `onPushChange`; `PushRow`
  renders **first on the page** in both the password and SSO branches.
- `app/states.jsx` — `stagePushAsk`, `stagePushSetting`, `stageDevicePreview`,
  six entries, and a push reset inside `reseed`.
- `circlists.html` — two script tags; `.circ-pushask*` and `.circ-osdialog*` CSS.
- `brand/assets/notification-badge.svg` — the user's supplied asset, copied in.

Rig:

- `docs/specs/lm-769-push/playground/pg-the-ask.html` — entry, `<base href="../../../../" />`.
- Option 4 (`id: 'pill'`, name "The row") in `pg-push-asks.jsx` / `pg-push-store.jsx`
  / `pg-push-wire.jsx` + `.pgp-row` CSS in the entry. The id is `pill` for
  historical reasons — it was the pill before it was the row. Rename or drop the
  whole option when the reset settles what the ask is.
- `…/pg-push-store.jsx`, `…/pg-push-asks.jsx`, `…/pg-push-wire.jsx`,
  `…/pg-push-topbar.jsx`.
- `playgrounds.json` — one LM-769 ticket carrying both rigs.

## Learnings

**The user's objections to the ask, in order, and what each one was actually
about.** Worth reading before touching it again, because each was a different
class of mistake:

1. *A bordered band with a filled primary and a "Dismiss" button.* Three faults
   at once — the box gave a passing offer a card's weight, the filled accent
   made it the loudest thing on a screen of links, and a worded dismiss set
   refusing beside accepting as if it were a decision worth spelling out. He
   also flagged the Account placement (it sat between Change password and
   Delete account) as "a bit weird". **An × is the right size for "no".**
2. *The × parked at the column edge.* A corridor of dead space between the
   control and the thing it closes; it reads as an orphan. It belongs at the
   end of the sentence.
3. *Left-aligned prose.* "01 isn't even viable cos it's left aligned" — a line
   that starts on the cards' left edge and stops nowhere reads as a fragment
   that failed to fill its row. The app's one other transient, once-only,
   column-spanning thing in that exact slot is the New pill, and it is centred.
   He is still unsure about centring; that is why it is a lever.
4. *"Turn them on".* No antecedent — after "new links land in your circles",
   *them* reads as the links or the circles, never the notifications, which the
   sentence never names. He also rejected offering this as a lever: "presumably
   there's just an appropriate option". Fixed to **"Turn on notifications"**.

**A lever is only legitimate where there is no correct answer.** Words had one;
alignment does not. Offering a choice where an answer exists reads as ducking
the design.

**He didn't want a pill.** That is the whole of the objection to the first
option 4 — not weight, not chrome, not containers. He asked for the hairlines
off option 3; a pill was built instead; he rejected it because it was a pill.
Do not reconstruct a larger theory out of it.

**"I don't like X" means remove X.** He said the hairlines were new design that
doesn't fit the app. The correct response was to take them off option 3. Instead
a fifth thing was invented, and that is what the miscommunication and the reset
are about. Take the instruction literally before offering an alternative to it.

**Do not put ratification items in a handoff.** Explicitly objected to this
session. The handoff records what was decided and what is open; the *asking*
happens in chat, in the reply's last line.

**`<base href>` depth for this folder is four** (`../../../../`). The preview's
"referenced file not found" warning fires either way, so it cannot distinguish
a correct base from a wrong one — count the path.

**The rig cannot reset push from the app side.** The device answer is persisted
by design (the platform asks once), so "Put it back" writes the default into
`pg_push_state_v1` and reloads. A reset hook in `main.jsx` would exist only for
the rig, which is why there isn't one.

**The Babel preview caches modules.** After editing a `.jsx`, re-`show_html`
before screenshotting or you will read the previous build and chase a ghost.

## Artifacts

- `docs/specs/lm-769-push/handoff.md` — the build write-up: every "yours to
  decide" item and its reasoning.
- `docs/specs/lm-769-push/README.md` — scope, what is here, settled vs open.
- `docs/specs/lm-769-push/playground/pg-the-ask.html` (+ four `pg-push-*.jsx`).
- `docs/specs/lm-769-push/playground/wb-notification-banner.html` — the earlier
  reference board, moved.
- `docs/specs/lm-769-push/handoff-2026-09-22_pwa-notification-banner.md`,
  `…/prompt-android-notification-badge.md` — moved.
- `app/push.jsx`, `app/push-preview.jsx`, `brand/assets/notification-badge.svg`.

## Action Items & Next Steps

1. **Reset the ask, in conversation, before building anything.** Establish with
   him what work the ask has to do, where it lives, what it may not be, and
   whether an options rig is even the right instrument here. Then — and only
   then — land one form in `app/push.jsx` + the `.circ-pushask*` CSS and archive
   the rig. The four existing options are evidence of what has been rejected,
   not a menu to re-present.
2. **Then the rest of the unratified set**, one at a time: the dismiss never
   returning; the refused and Safari-tab statements; Notifications first on
   Account; the preview's three frames.
3. **Write the `CHANGELOG.md` entry** once the shape is ratified — one terse
   title, 2–4 shape-level bullets, written once and left alone.
4. Desktop firing frequency — still deferred.
5. Whether the app icon carries a badge count — never discussed, do not assume.

## Other Notes

- **The addresses** (launcher → States, or `?state=<id>`): `push-ask`,
  `push-setting-on`, `push-setting-off`, `push-setting-refused`,
  `push-setting-safari-tab`, `push-device-preview`.
- **Known and left alone:** the New pill's negative margin pulls it 12px closer
  to whatever sits above it on desktop. Pre-existing under the returns bar; the
  ask did not introduce it and fixing it is the pill's own question.
- **The standing placement objection** — whether rigs belong at the root rather
  than in `docs/specs/` — is still unresolved and was not raised again this
  session.
- `uploads/` holds three screenshots the user dropped this session plus
  `notification-badge.svg` (now also copied to `brand/assets/`). Sweep them at
  session end per `CLAUDE.md`; do not touch `uploads/card-previews/` or
  `uploads/card-favicons/`.
