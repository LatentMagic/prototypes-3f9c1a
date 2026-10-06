# Handoff: app posture, the Subscription card and sleeping circles (2026-10-06)

App posture only (Platform: App, Mobile payments Off). Web unchanged.

## What changed
- `app/pricing-account.jsx`: in the app, Ending and Payment failed are now status only, like Active and free month.
  - Ending: marker, Plan, Ends on, "Your circles then go to sleep." (only for a champion), then `PppManageLine`.
  - Payment failed: marker, Plan, "Your circles go to sleep in 30 days." (or "Your subscription ends in 30 days."), then `PppManageLine`.
  - No buttons and no billing foot. In the app, Switch and Cancel can't open from any subscribed state.
- `app/pricing-circle.jsx`, sleeping circle in the app:
  - No button that starts or resumes a subscription: Start your subscription, Take over (not subscribed), Resume subscription, Update payment card. Leave this circle stays. A subscribed member keeps "Take over this circle".
  - The line under the buttons is cut in the app for your own sleeping circle, a member who isn't subscribed, and a member whose own subscription is Ending or Payment failed. Only a subscribed member keeps it. **Built, not ratified.**
- Register: `ppp-app-ending`, `ppp-app-payment-failed`, `ppp-app-lapsed-circle`, `ppp-app-takeover`, `ppp-app-takeover-ending` and `ppp-app-takeover-failed`, each beside its web twin. The six web twins now set Platform: Web. All are listed in "Mobile app: where it differs" and its QA entry.

## Built, not ratified
- Cutting the sleeping circle's under-button line in the app.
- In its place (agreed as shown 6 Oct, then built): your own sleeping circle reads "You can't manage your subscription in this app." A member whose subscription is ending reads "Your subscription ends on <date>. You can't manage it in this app." A member whose payment failed reads "Your last payment didn't go through. You can't manage your subscription in this app." A member who isn't subscribed reads "Taking it over needs a subscription."
- New circle form while Ending or Payment failed, in the app: "It goes to sleep on <date>. You can't manage your subscription in this app." The resume / update-the-card offer and its link are removed. The manage line was added to match the sleeping circle (my call, from the conversation). States `ppp-app-create-ending`, `ppp-app-create-failed`; web twins now set Platform: Web.

