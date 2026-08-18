# Delta prompt — App posture, shared core, web-only payments

> The verbatim follow-up instruction that produced the **app platform posture**
> (third presentation posture) landed 2026-07-24. Kept for provenance; see the
> CHANGELOG entry "App platform posture — a third presentation, one shared core"
> and the Key reminder in `CLAUDE.md`. Implementation: `app/app-shell.jsx`
> (`AppShellNative`), `WebHandoff` in `app/subscriptions.jsx`, Config controls in
> `app/config.jsx`, posture wiring + payment-route guard in `app/main.jsx`.

---

# Claude Design — mobile app variant, shared core, web-only payments

> Delta instruction for the existing Circlists prototype session. Paste as a follow-up message. Only the changes named below — preserve everything else.

**Check before building.** For each change below, first verify the prototype does not already have it. If it is already present, skip it — do not rebuild or alter what works. Build only what is genuinely missing.

### App platform mode — third presentation posture, one shared core

Prototype today has two postures: desktop and mobile *web*. Add a third: **app** — how Circlists reads as a native mobile app. Not a fork, not a second app: same routes, same state, same data, same tokens, same copy. Only presentation components differ, and only where mobile-app paradigms genuinely diverge from mobile web.

- Structure it so the app posture inherits everything by default. A surface gets an app-specific variant **only** when a web pattern fails on native mobile; everything else renders the shared component. Future changes to shared surfaces must land in the app posture with zero extra work — that is the acceptance bar for the architecture.
- Add a **Platform: Web / App** switch to the Config launcher (prototype aid, sits with the existing viewport/layout controls). Default Web. App mode implies phone viewport.
- Web posture (desktop and mobile web) is **frozen** — restructure underneath it if needed, but it must render and behave exactly as it does now. No visual or behavioural change in Web mode is acceptable.

### Mobile-app presentation — paradigm shift, not shrunk web

Where the app posture diverges, follow native mobile-app conventions rather than compressing web layouts. You own the design judgement; these are the known constraints, not a pixel spec:

- **Thumb-first.** Primary navigation and high-frequency actions live in the lower reach zone. Top of the screen is for status and low-frequency actions only.
- **Bottom navigation** replaces the rail/drawer paradigm for primary destinations. Circle switching and account access get app-native homes.
- **No hover.** Anything hover-revealed on web needs an explicit touch affordance.
- **Sheets over centered modals.** Contextual overlays and menus slide from the bottom edge; full-screen takeovers where a modal would cramp.
- **Touch targets ≥ 44px**, generous spacing, single-column flows.
- Keep one coherent platform vocabulary — lean iOS-flavoured, do not mix in Android-only signatures (no FAB).
- Pulse Modernist, the brand, the calm floor, and all product copy rules carry over untouched. The app posture is the same product wearing native clothes.

### Web-only payments in app mode

Real app stores make in-app payment legally and commercially fraught; Circlists takes payment on the web only. In app mode the champion cannot pay in-app.

- Add a **Mobile payments: Off / On** toggle to the Config launcher. Default **Off** in app mode. Web mode ignores it — payments always work on web.
- Payments Off + app mode: every path that today reaches the funding/checkout wizard (create circle, re-fund a dormant circle, manage funding) instead lands on a calm handoff surface — the circle is named/set up as far as possible in-app, and the user is told to finish funding on the web. Voice rules apply: direct, non-blaming, no urgency. No checkout, no price-entry, and no provider surface is reachable in-app while Off.
- Payments On + app mode: the existing wizard runs, presented in the app posture.
- The create→fund wizard itself is settled design — locked decisions in the session hold. The app-mode handoff replaces where the flow *ends* when payments are off; it does not redesign the steps.

---

Leave everything else unchanged — the design language, the copy, and every surface or element not named above.

**Acceptance criteria** — done when:

- [ ] Config launcher has Platform (Web / App) and Mobile payments (Off / On) controls.
- [ ] Platform = Web: prototype is pixel- and behaviour-identical to today, desktop and mobile web postures both.
- [ ] Platform = App: every surface reachable today is reachable, running on the same shared state — an item marked read in App mode stays read after switching back to Web.
- [ ] App mode chrome is thumb-first and bottom-anchored; no hover-dependent affordance remains; overlays present as sheets or full-screen takeovers.
- [ ] App mode + payments Off: create circle, re-fund, and manage funding all end at the finish-on-web handoff; no checkout surface reachable.
- [ ] App mode + payments On: full funding wizard works in the app posture.
- [ ] A shared-surface change (e.g. seed-data or feed tweak) shows up in both postures with no app-side edit.

---

**Session addendum (from the user):** Config should include a toggle for App mode — distinct from the normal viewport-size controls, not to be confused with the mobile viewport for the web app.
