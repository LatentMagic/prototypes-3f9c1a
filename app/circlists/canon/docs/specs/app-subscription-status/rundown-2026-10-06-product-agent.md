# Rundown for the product agent: 5–6 Oct deltas

Each item: what the prompt asked, what was built, and how the build differs from the prompt. Everything is canon (`app/`). Web is unchanged unless stated.

## 1. Hidden email on Members
**Prompt:** where the address is hidden, show "Email hidden" on the champion's row (seen by a member) and on your own row. Same position, quieter weight, not a link. Add two register states.
**Built:** as asked.
**Deltas:**
- Treatment: italic. Weight and colour were already at their floor, so italic is the "quieter" lever. **Ratified 6 Oct.**
- Copy "Email hidden": **built, not ratified.**
- A hidden address is detected by the suffix `@privaterelay.appleid.com`.
- The existing "Members — non-champion" state now resets both addresses, so a hidden state can't leak into it.
- Handoff: `docs/specs/hidden-email/handoff-2026-10-05-hidden-email.md`. It lists every other place canon shows an email (not touched).

## 2. Member with no name
**Prompt:** a Members row with no name reads "A member". The avatar keeps its two dots. Add one state: a nameless champion with a hidden email, seen by a member.
**Built:** as asked.
**Deltas (needed to make it work):**
- The champion was identified by name. A nameless champion is now matched to their row by email.
- A circle whose champion has no name still counts as championed.
- Not touched or checked: other surfaces may still show a blank name (Block dialog, comment and reaction attribution, "Added by" lines, the Remove-member confirm).

## 3. App: Subscription card, Ending and Payment failed
**Prompt:** status only, matching Active and free month: marker, Plan, (Ends on), the circles line, then "You can't manage your subscription in this app."
**Built:** as asked.
- Ending: "Your circles then go to sleep." (only for a champion).
- Payment failed: "Your circles go to sleep in 30 days." or, for someone who champions no circle, "Your subscription ends in 30 days."
**Delta:** in the app, Switch and Cancel can no longer open from any subscribed state.

## 4. App: sleeping circle
**Prompt:** remove any button that starts or resumes a subscription. Keep the asleep text. Add nothing that names the website or a price.
**Built:** the buttons removed are Start your subscription, Take over (not subscribed), Resume subscription and Update payment card. Leave this circle stays.
**Deltas:**
- A subscribed member keeps "Take over this circle" (it starts nothing).
- The small line under the buttons was rewritten in the app (owner agreed each line as shown). **All built, not ratified.**
  - Your own sleeping circle. Was "Subscribing again wakes every circle you champion." Now "You can't manage your subscription in this app."
  - Member, not subscribed. Was "Any member can take it over by starting their own subscription." Now "Taking it over needs a subscription."
  - Member, own subscription ending. Was "Your subscription ends on <date>. Resume it, then take this circle over." Now "Your subscription ends on <date>. You can't manage it in this app."
  - Member, own payment failed. Was "Your last payment didn't go through. Update the card, then take this circle over." Now "Your last payment didn't go through. You can't manage your subscription in this app."
  - Member, subscribed: unchanged.

## 5. App: New circle form, Ending or Payment failed
**Prompt:** keep "It goes to sleep on <date>." and remove the resume / update-the-card offer and its link.
**Built:** "It goes to sleep on <date>. You can't manage your subscription in this app."
**Delta:** the manage line was added (my call, to match the sleeping circle). **Built, not ratified.** Ending and Payment failed read the same; only the date differs.

## Register, QA and process
- New app states, each beside its web twin: `ppp-app-ending`, `ppp-app-payment-failed`, `ppp-app-lapsed-circle`, `ppp-app-takeover`, `ppp-app-takeover-ending`, `ppp-app-takeover-failed`, `ppp-app-create-ending`, `ppp-app-create-failed`. They are listed in "Mobile app: where it differs". Their web twins now set Platform: Web.
- Members states: `members-champion-email-hidden`, `members-own-email-hidden`, `members-champion-nameless-email-hidden`.
- QA list cleared to one entry: "App: Subscription card and sleeping circles" (8 steps).
- CLAUDE.md: new rule, open files by their plain path (no `?state=`).
- Handoffs: `docs/specs/hidden-email/`, `docs/specs/app-subscription-status/`.
