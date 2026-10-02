# Notes: taking over and creating while your subscription is ending

Rig: `pg-lapsing-takeover.html`. Nothing here is ratified. The options carry numbers only on screen (the brief says don't label them), so the name, the stance and the cost for each are written here.

## 1 · Fix first, on the screen
- **Take-over:** the sleeping circle's primary act becomes the fix. Ending shows **Resume subscription**. Payment failed shows **Update payment card**, which opens the provider page and comes back to the circle. The caption says why: "Your subscription ends on 28 October. Resume it, then take this circle over." Once it's fixed, the same screen offers **Take over this circle**, with a receipt line ("Subscription resumed." / "Card updated.").
- **Create:** a second line under the lede, at the lede's size and weight 500: "Your subscription ends on 28 October. This circle goes to sleep then, unless you resume." There's no act in it; the fix lives on Account.
- **Stance:** two separate acts, each named for what it does. Resume stays as it is in canon (no confirm), and the take-over stays as it is in canon (no confirm when you're subscribed).
- **Cost:** two taps when Ending. Take over isn't on the screen until you've fixed things, so the circle's own act gives way to a billing act for one step. On create, you have to go to Account to fix it.

## 2 · Fix in the take-over sheet
- **Take-over:** the screen keeps **Take over this circle**, and the caption warns you: "Taking it over resumes your subscription, which ends on 28 October." Tapping it opens a sheet in the Switch and Cancel panel style: Now · Monthly · Ends 28 Oct → From today · Monthly · Renews 28 Oct, then "Sunday Long Reads wakes for all 6 members, with you as its champion." The buttons are **Resume and take over** and Cancel. On Payment failed, the button is **Update payment card**. Saving the card finishes the take-over and lands you in the circle.
- **Create:** a note opens in front of the form, before you type. It uses the same panel (Now · Monthly · £5 a month → From 28 Oct · Asleep · Nothing charged). The buttons are **Resume subscription** (or Update payment card) and **Not now**.
- **Stance:** one confirm covers both acts, and the panel shows what changes. Members are named because they're who the rule protects.
- **Cost:** it adds a confirm to a take-over that canon makes with one tap. "Not now" is a dismiss rather than a descriptive label. The note costs one tap on every create while you're lapsing.

## 3 · Fix on the button
- **Take-over:** the button carries both acts: **Resume and take over**, or **Update card and take over**. The caption states the price and the role: "This resumes it at £5 a month and makes you this circle's champion." One tap and no confirm. On Payment failed, saving the card finishes the take-over.
- **Create:** one quiet line under Create circle: "It goes to sleep on 28 October unless you resume your subscription." The link resumes in place. Update the card goes to the provider page, takes what you've typed with it, and brings you back to the form.
- **Stance:** the fewest taps. The label is the confirmation.
- **Cost:** a billing change in one tap, with no panel. The labels are long ("Update card and take over"). The create line is the easiest of the three to miss.

## Tensions the levers didn't name, and how each option answers
- **Where Update card returns:** in the candidate it returns to Account. Here it returns to where you opened it: the circle in 1, the circle already taken over in 2 and 3, and the form in create. Cancel and return puts you back on the sleeping circle with nothing changed.
- **Typed input on create:** 2 asks before you type. 3 carries the name and description through the card page. 1 has no link to leave by.
- **An honest caption before the tap:** the candidate's subscribed caption ("Your subscription covers it…") stops being true while you're lapsing, so every option replaces it.
- **Acknowledgement:** 1 shows a receipt line after the fix. In 2 and 3, landing in the awake circle is the acknowledgement.

## Rig mechanics
- The rig is the whole candidate in an iframe (`pg-lapsing-takeover-app.html`), with `pg-lapsing-takeover.jsx` loaded before `app/main.jsx`. It has its own state key, and its subscription store is remapped to `pg_lto_ppp_v1`, so playing here never touches the candidate.
- Ending date: `PPP_RENEW_DAYS` is set to 26 inside the rig only, so the Account card and the options both read 28 Oct. The fix-by date is today plus 30.
- `app/spaces.jsx` gained one hook, `CircPricing.createFoot`, under the Create button. When the hook is absent, nothing renders.
