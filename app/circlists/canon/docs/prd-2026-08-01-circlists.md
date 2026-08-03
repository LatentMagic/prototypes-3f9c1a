# Circlists — Product Requirements

> Point-in-time copy saved 2026-08-01 from the canonical PRD (pasted into chat;
> it was not previously stored in this project). The timestamp in the filename
> marks when it was captured — treat anything newer in the wiki or the specs as
> overriding this copy.

## Problem statement

People share interesting links inside small trusted groups — engineering pods, book clubs, study cohorts, couples — but available tools collapse into two failure modes. Group chats bury links in conversation chronology and expose no read state. Shared-database tools collapse individual state into global state — one person marks an item done, it's done for everyone — punishing reading at your own pace.

Neither respects how small high-trust groups consume content: together on what's worth attention, apart on when and whether to read it. The shared-curation middle ground — communal library, individual reading state — sits empty.

## Users

Members of small trusted groups (2–10 people): engineering pods, book clubs, study cohorts, close friends, couples. Every member is a peer. No admin tier, no roles.

Within a circle, one member is a **champion** — the member whose subscription funds the circle. Everyone else is simply a member. Content is fully peer: every member adds, marks read, and deletes identically, with no admin tier. The champion controls the circle's container — its membership (inviting and removing members) and its identity — because they fund it; content stays peer. Entitlement resolves uniformly: access requires membership in a funded circle, regardless of who funds it.

## Value proposition

Drop a link once. It lands in everyone's list, attributed. Each person reads at their own pace and marks read in their own list without affecting anyone else's. Library is communal; reading is individual.

One member — the champion — funds a circle; everyone they invite joins free. No other member ever sees a paywall. The circle is a shared resource, funded collectively through one person's commitment.

Underlying model is superposed state: one item with independent per-user states. Incumbents cannot retrofit it without significant rework. It enables a product shape no other tool offers — shared curation paired with individual consumption state for groups that trust each other.

## Emotional intent

The felt target is the quiet sense of being on the same page as your group: a real, valued sense of belonging that gives each member a reason to contribute. Ideas land somewhere they won't rot. Your list clears when you're ready. No pings, no-one hovering, just the warm awareness that your people are paying attention to the same things you are, and that when you read something you can feel how they met it too.

Four felt moments carry the product:

- **Confident release** — dropping a link into the shared list and trusting it is held. What you share lands where your people will find it, attributed to you.
- **Quiet cohesion** — scanning a populated feed of named contributors, someone's link waiting on next open, the loop closed without a conversation. Your group's attention, made visible without chasing.
- **Shared reception** — marking a link read and, in the same moment, feeling how the circle received it: who else read it, and how it landed for them. The reader's loop closes; reading is met by belonging where before it met silence.
- **Composed relief** — an empty Active tab that reads as arrival. You're caught up, and the quiet is earned.

Calm is the floor, alert is the signal. Non-urgency is structural: no streaks, no pings. Yet the experience reads populated and current, earned through composition and restraint rather than spectacle.

The one guardrail: belonging must never curdle into performance pressure, the sense that reading or reacting is being scored, ranked, or performed for an audience keeping count. That failure is what the product designs against. Concrete forms of it — scores, leaderboards, running tallies of who did what — are examples of the failure, not an exhaustive ban list. A new surface earns scrutiny by whether it turns reading into a scoreboard, not by whether others can technically see it. A post-read, opt-in, uncounted reaction a reader offers to their circle is belonging; a tally that ranks readers is the line the product will not cross.

Also designed against: perpetual-backlog anxiety, and dead minimalism where calm collapses into empty.

## The three axes of distinction

Three things make the work distinct. Every feature, tweak, and styling call is weighed against them.

**1 · Simple, Lovable, Complete.** Focus that is felt, delight that is felt, and genuine completeness — no fundamental capability missing, no surface left half-finished. Against a wave of half-finished apps, this one is finished.

**2 · The superposed-state gap, and what deepens it.** Closing the gap set out in Problem statement is the reason to exist; beyond closing it, whatever strengthens what a circle is to its members extends it.

**3 · Lightening the load.** The calm set out in Emotional intent is a constraint as well as a feeling — belonging to a circle must never become overwhelming, and staying on the pulse must never become a chore.

Axes 2 and 3 pull against each other, and that tension is named on every call — every feature that deepens the circle adds something to attend to, and one that scores high on 2 while quietly loading the member is a net loss. Both can also pull against 1: bloat costs completeness, and an app growing in every direction stops being finished.

## Goals

- Ship a real, paid, hosted SaaS for small trusted groups — full vertical stack in genuine hands.
- Validate the superposed-state thesis with a real friends-and-family cohort: small trusted groups adopt a shared list when individual reading state is preserved.
- Sustain usage past novelty with at least one cohort of real users — measured at week 4.

## Success metrics

| Metric                                                                                                                            | Target | Why                                                                                            |
| --------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------- |
| Read-through rate — % of items added marked read by at least one other member within 30 days                                      | ≥ 60%  | Primary loop signal. Product is doing its job when contributed content reaches fellow members. |
| Week-4 circle retention — % of qualifying circles (≥ 2 members, ≥ 3 items in week 1) still adding or marking-read items in week 4 | ≥ 50%  | Sustained use past novelty.                                                                    |
| Stretch user target — real (non-founder-adjacent) users in steady use by month 3                                                  | 10     | Existence of genuine external demand.                                                          |

## Out of scope

Much is still to come. The absences below are the ones most likely to surprise — the boundary as it stands today, not a permanent shape.

**Feed and items**

- No live sync — another member's changes surface on next navigation or refresh, not in real time.
- Read state is one-way — a read item cannot be returned to unread.
- Delete removes an item for everyone — there is no personal hide.
- Cards show URL and attribution only — no title, thumbnail, or preview.
- Items cannot be edited after adding — a committed URL cannot be changed.
- Duplicate links are not detected — visually distinct URLs pointing to the same resource (`youtu.be/x` vs `youtube.com/watch?v=x`) appear as separate items.

**Account and circle lifecycle**

- Deleting an account, deleting a circle, leaving a circle, and champion hand-off are handled by the operator over email, not in-app.

## Functional requirements

### Auth

| ID         | Title                        |
| ---------- | ---------------------------- |
| `CIRC-001` | Sign up                      |
| `CIRC-002` | Sign in                      |
| `CIRC-003` | Sign in with Google          |
| `CIRC-004` | Sign out                     |
| `CIRC-005` | Recover a forgotten password |
| `CIRC-006` | Change password              |
| `CIRC-021` | Change email                 |

Forgotten-password recovery, change-password, and change-email are delivered in-app, built on the identity provider's headless SDK — see `hld.md` Decision-05, Decision-06, and Decision-25. "Manage account" and "Sign out" are surfaced through the authenticated app shell's user menu; funding is managed per-circle from each circle's surface (see `hld.md` Decision-20), not the user menu.

### Circles

| ID         | Title                         |
| ---------- | ----------------------------- |
| `CIRC-007` | Create a circle               |
| `CIRC-019` | Remove a member from a circle |
| `CIRC-020` | Rename a circle               |
| `CIRC-025` | View a circle's roster        |

Removal and rename are in-app and champion-gated (see `hld.md` Decision-27); leaving a circle and champion hand-off remain operator-arbitrated.

A circle holds at most 10 members (the creator plus up to 9 invited members). The cap is enforced when an invitation is accepted (`CIRC-009`); inviting into a full circle is refused at submission (`CIRC-008`). See `hld.md` Decision-15 for the rationale.

A member lands in their default circle — its Active tab if funded, the dormant state if not — or the no-circle home when they belong to none, and moves between their circles from the app shell. See `hld.md` Decision-22 and Decision-26.

### Invitations

| ID         | Title                       |
| ---------- | --------------------------- |
| `CIRC-008` | Invite a member to a circle |
| `CIRC-009` | Accept a circle invitation  |

### Feed

| ID         | Title                          |
| ---------- | ------------------------------- |
| `CIRC-010` | Add a link to a circle          |
| `CIRC-012` | Open a link                     |
| `CIRC-013` | Delete a link                   |
| `CIRC-022` | Mark a link as read and react   |
| `CIRC-023` | Reflect account deletion        |
| `CIRC-024` | Review a link's reactions       |

### Subscriptions

One plan: £3 per circle per month — an introductory rate, signalled as such, that may rise later. The champion funds the circle; invited members join free; a circle holds up to 10 members including the champion. No tiers, no per-seat pricing, no free circles.

| ID         | Title                                   |
| ---------- | --------------------------------------- |
| `CIRC-014` | Cancel a circle's funding               |
| `CIRC-015` | Update a circle's payment card          |
| `CIRC-016` | Recover a dormant circle                |
| `CIRC-017` | Reflect provider subscription lifecycle |

## Non-functional requirements

- `CIRC-SEC-001` — All traffic is served over HTTPS. No plaintext access to user data.
- `CIRC-SEC-002` — The access-control rule (member of a funded circle) is enforced server-side on every request; the frontend is not the enforcement boundary.
- `CIRC-A11Y-001` — The application meets WCAG 2.2 AA across all user-facing surfaces.
- `CIRC-COMPAT-001` — The application supports modern evergreen browsers: Safari iOS, Chrome iOS, Chrome Android, Safari macOS, Chrome and Firefox on desktop (Windows + macOS). No IE, no pre-iOS-15 Safari.
- `CIRC-PRIV-001` — Circlists stores the minimum personal data needed to function: account identity, display name (first name + surname initial), membership records, per-user per-item read state, and per-user per-item reaction (the chosen glyph and its intensity, including a skip).
- `CIRC-PRIV-002` — Circlists complies with GDPR obligations for the personal data it stores.
