# Handoff — Create → Fund wizard (mobile fit + flow)

## Why this exists
Audit of the **Create circle → Fund circle** flow. Two problems drove it:
1. **Fund circle didn't fit one mobile screen** — the old layout was a vertically-centred card + hero that overran the viewport and clipped on small phones.
2. **The two screens didn't feel like one wizard** — different alignment, no progress, no connective copy, and an ugly "New circle · name" eyebrow reintroducing context from nowhere.

The user cares a lot about this flow and wanted it *resolved*, but explicitly **did not want a heavy overhaul**. Path B (consolidating name + funding onto one screen) was explored and **vetoed** — it read as splicing/bloat and diverges from homepage copy. We are on **Path A: keep two steps, bind them into one wizard.**

## What's LOCKED (do not relitigate)
- **Two-step wizard**, funding stays its own surface (room to become a richer funding page later).
- **Fund page fits one screen** — already integrated. No card; back + X both in the top bar; body is `overflow:auto` + `justify-content: safe center` so it centres on tall screens and top-aligns/scrolls rather than clipping on small ones. Natural content ~370px clears a 360×640 screen with headroom.
- **Progress = segmented dots**, and the dots are **IMMUTABLE** — dead-centre in the header, never shifted by anything (a version that stacked the circle name above the dots was rejected because it moved the indicator).
- **Headings**: "Name your circle" (step 1) → "Fund your circle" (step 2). Kept as verb-led actions. Do **not** put the circle name *as* the heading ("Fund Backend Pod") — same font/size as a heading reads like the screen's title, not the user's value. Rejected twice.
- **No eyebrows.** No mono all-caps context line above the body, no pill/chip. The user vetoed these repeatedly and strongly.
- **Responsive rule**: one narrow content column in both contexts; the primary button spans the *column*, never the full desktop width. Only vertical placement changes — **centred < ~640px, pinned toward the top (~56px down) on desktop.**
- **Price**: keep the big £3 + "per circle / month" + "Founding rate" pill. Drop any secondary "£3/mo" — redundant with the big £3.
- **"Billed to <email>"** stays — it tells the champion which account is charged.
- **"powered by a payment provider"** — REMOVED from this screen (generic, non-branded; the real provider checkout is the next screen and carries branding/security/terms). Do not reintroduce.
- **Circle name on step 2** — REMOVED entirely (see session notes below). Not a "where to put it" question anymore; the answer is "nowhere."

## What happened this session (newest work)
Two decisions landed and one mistake to avoid repeating.

**1. The circle name is REMOVED from step 2.** We chased "where does the name live on the fund screen" hard — footer pairings, a champion bullet ("You fund **[name]** as its champion"), stacked variants — and every option either wrapped badly at long names (~30 chars) or read as noise. The user's call, firmly: **drop the name entirely.** The wizard dots + flow already establish which circle you're funding, so step 2 needs no name. Do NOT reintroduce it. The champion bullet is now generic: **"You fund the circle as its champion."**

**2. Footer microcopy is settled: "Billed to <email>. Cancel anytime."** — one line/unit, nothing else beneath the button. The "powered by a payment provider" / "Secure checkout" row is GONE (I accidentally reintroduced it by reusing an old `FinePrint` component — removed again). Do not bring it back on this screen.

**3. Desktop treatment — PARKED, not decided.** The user pushed on why the desktop mock is a white card floating on empty canvas. Correct read: that floating-card state is **not a real pattern** — it was a half-finished mock (a card with nothing behind it). It only becomes legitimate as either (a) a **modal** — same card sitting on a dimmed overlay *over the actual app screen*, or (b) **full-page** — content on the page, no card. The user has NOT yet chosen. **Next action: get the pick (modal-over-app vs full-page step), then build only that.** Latest mock is `Create → Fund - wizard desktop.html` (centered ~460px card, name already removed, footer already fixed) — but it needs the app-behind-it or to be converted to full-page.

### Process note (the user was explicit about this)
I lost their trust this session by (a) building out a full direction when they'd only flagged a problem, and (b) reintroducing already-cut copy. Going forward: **when they flag a problem, confirm the direction before building it out**, and never re-add copy we've removed. They don't mind the work — they mind changes happening without being asked.

## Where the real code lives
- **`app/subscriptions.jsx`** → `FundingPage` — already carries the integrated Option-1 layout (back + X in header, no card, safe-centred). This is the file to edit when applying the final footer + the wizard chrome (dots) decisions.
  - `IconBtn` helper is defined here. `mode='refund'` variant is preserved (returning-champion copy, "Re-fund", no founding badge, X-only header/no back) — keep it working through any change.
- **`circlists.html`** → added `.circ-iconbtn:hover { background: var(--color-surface-sunken) }`. Note `.circ-iconbtn` is otherwise app-defined via inline styles.
- Step 1 ("Name your circle") lives in **`app/spaces.jsx`** → `CreateSpace`. The wizard chrome (shared header + dots + the center-on-mobile/top-on-desktop rule) still needs to be applied to BOTH steps for the flow to actually read as one wizard — the playgrounds mock this but it is **not yet in the real app**.

## Still parked (not yet addressed in real code)
- **Desktop step-1 controls** — user disliked the input field + Continue button on desktop; needs tuning. (See `Create → Fund - wizard desktop.html`.)
- **Applying the shared wizard chrome to step 1** in `app/spaces.jsx` (dots, responsive placement) — mocked, not integrated.
- The "size of the screen jumps between step 1 and 2" observation — user decided to **not** worry about it; leave unless raised again.

## Playground files (exploration artifacts, newest → oldest)
- `Create → Fund - footer pairing.html` — **current**: D / G / F footer groupings.
- `Create → Fund - footer email.html` — one-line vs two-line footer with email.
- `Create → Fund - beneath the button.html` — five ways to calm the sub-button microcopy.
- `Create → Fund - name home options.html` — five homes for the name (all but "strip"/"fine-print" rejected).
- `Create → Fund - wizard responsive.html` — desktop top-align vs mobile centre + naming toggle.
- `Create → Fund - wizard refined.html` — dots/text/bar progress treatments (dots won).
- `Create → Fund - wizard playground.html` — original: problem framing + Path A (3) + Path B (3, vetoed).
- `Fund circle — mobile fit options.html` / `Fund circle - Option 1 across dimensions.html` — the original 5 fit options + the dimension stress-test (Option 1 won, integrated).

## Working style the user expects
Direct, minimal, no bloat. They react hard to anything that feels like "throwing information onto the screen." Present options as phone-framed side-by-side comparisons with clear trade-offs; give a lean but don't over-steer. Calm/minimal is the floor. No emoji in product copy.
