---
date: '2026-08-14'
ticket: 'LM-652'
topic: 'candidate-first-build'
status: 'in-progress'
type: 'implementation'
---

# Handoff: candidate-first-build — the discourse delta built as the first candidate build

## Current Focus

**The build is out for the owner's review.** `circlists-lm652.html` (project root) carries all eight
items of the delta prompt as a candidate build — the real app plus an overlay set, per
`docs/specs/candidate-builds/README.md`. Nothing is ratified; the owner said tweaks are expected.
The next session takes his notes one at a time and changes only what is named.

Background only: the onboarding, the pre-build confirms, and the rig record (v7–v12) — do not reopen.

## Task(s)

**Done — the delta prompt built** (verbatim prompt in this session's chat; the eight items:
Add popover · thought on the card · way-through · conversation surface · reveal · return banner ·
own-card foot line · plain text). Two confirms were settled with the owner before building:
the Read-card emoji analytics button is REPLACED by the new way-through button (roster draws on the
surface); the tucked-under band is Active-only (on Read the way in is the surface).

**Done — the candidate-build mechanism proven.** One `app/`, two entries. The overlay-after-load
step (the route's one untested assumption) works: free identifiers in Babel scripts resolve off
`window` at render time, so overlays that load after `feed.jsx`/`swell-reactions.jsx` but BEFORE
`main.jsx` replace `AddReveal` and `SwellDoor` with no copies and no flash.

**Pending — owner review**, then: `skills/build-candidate/SKILL.md` (agreed: written from what the
build took, only after it survives review), a `CHANGELOG.md` entry (needs his nod), and the
`ui-design.md` governance re-check on any convention the tweaks touch.

## Critical References

- `docs/specs/candidate-builds/README.md` — the route this build instantiates.
- `CLAUDE.md` — ratification; last-line-carries-the-ask; kebab-case filenames.
- `GOTCHA.md` 1/2/5 — before touching any sheet/overlay here, and before "verifying" one from a
  screenshot.

## Choices flagged as mine (the prompt asked which parts were chosen, not inherited)

1. **Way-through** = a monoline speech-bubble icon in the old door's slot, always present on a Read
   card. Cost accepted: the at-a-glance glyph huddle left the card; the roster lives on the surface.
2. **Surface title** = "Conversation" (frame like Settings/Account).
3. **Reveal control** = "Go to the conversation" / "Start the conversation" when nothing has been
   said; empty-case line "Nothing has been said on it yet."; excerpts clamp at three lines (the
   permanent-ellipsis route — the expand-past-a-size alternative was not built).
4. **Band honesty rule**: a thought that fits whole on one line is read there, band inert; a
   held-back one truncates + "Read more" → warm-paper panel over the feed, card actions at the foot.
5. **Watching control** = house bordered control, page-with-folded-corner glyph, "Watch" ↔
   "Watching" (accent when on); the word kept because the prompt's banner copy uses it. Card fold =
   accent corner, watching only, not pressable.
6. **W4 copy** = collapsed "See what they said", expanded "Pick one to open its conversation";
   house radius-md chevron box instead of the circular target.
7. **Item 7 minimum** = 4 responses (`CAND_OWN_MIN`, marked placeholder); champion split per-circle.
8. **Compose** = the same warm-paper borderless field everywhere words are written; Send appears
   only once there is text; "n left" under 60 remaining.
9. **Turn marks**: "· edited"; deleted → "{name} removed what they said."; a member's blind
   reaction rides their first turn as a small glyph by their name.

## Recent changes

- `app/main.jsx` — additive candidate hooks: `STATE_KEY` override (top), `window.CircCandidate`
  handle + `candApi`/`bind` (before render-route), route hook (before `members`), `FeedLead` +
  `CardRow` in the feed column. All no-op when no candidate is loaded.
- `app/swell-reactions.jsx` — internals exported (final `Object.assign`); reveal step replaceable
  via `window.CircSwellReveal` (timer skipped, ✕ shown when overridden).
- `docs/specs/lm-652-discourse/cand-lm652-{parts,data,add,card,reveal,surface,return,main}.jsx` — new.
- `circlists-lm652.html` — new entry: `circlists.html` + state-key script + cand script tags + a
  small `.cand-*` style block.
- `docs/specs/lm-652-discourse/README.md` — "Where it is now" repointed at the candidate.
- `github.md` — last-sync date refreshed (copy-voice doc read live before writing product copy).

## Learnings

- **The override-after-load step needs no `FeedCard` slots at all.** v8/v10 copied components
  because they missed that `main.jsx`'s and `feed.jsx`'s free identifiers (`AddReveal`, `SwellDoor`)
  resolve through `window` at render time. Re-publish the name, load before `main.jsx`, done.
- **Load order matters once**: overlays must precede `main.jsx` or the first paint renders the
  shipped names (mount happens at `main.jsx` load; nothing re-renders after).
- **A candidate needs its own localStorage key** (`window.CIRC_STATE_KEY`) or the two entries
  cross-hydrate. Seeds extend via wrapping `window.CircSeed.seedSpaces` before `main.jsx` reads it.
- **The Swell's reveal could not be replaced from outside** (file-scoped `SwellReview` reference), so
  the one in-file hook (`CircSwellReveal`) was the honest minimum — not a defect of the route.
- Turn actions keep the 44px floor with inset padding + negative margins (`candQuietBtn`,
  `cand-lm652-surface.jsx`) — visual density without shrinking targets.

## Artifacts

`circlists-lm652.html` · `docs/specs/lm-652-discourse/cand-lm652-*.jsx` (8) · additive edits to
`app/main.jsx` + `app/swell-reactions.jsx` · this handoff (build receipt included above) · README
repointed.

## Action Items & Next Steps

1. **Take the owner's review notes** on the live build; change only what is named. The nine flagged
   choices above are the likeliest targets.
2. **After it survives review**: write `skills/build-candidate/SKILL.md` from this handoff's
   learnings; note it in `CLAUDE.md`; ask about a `CHANGELOG.md` entry.
3. Verify the app posture and 320px width by hand in the live view if the review raises layout —
   the background verifier ran, but mount transitions can only be judged live (GOTCHA 2).

## Other Notes

- **Demo path:** Backend Pod → Read tab: bubble button on any card → the surface (roster, thought
  intro, turns, compose, watching control). Head of either feed: the banner ("Ada L., Lena P. and
  others spoke…"). Active tab: bands on three cards (one inert short, one long, one with bullets);
  mark `danluu.com` or the rust-lang card read for the new reveal. Own-card foot lines: ACM Queue
  card (Backend Pod, champion line) and Middlemarch card (Book Club, non-champion line). Add (+):
  the new popover with thought + toggle + collapsed Swell.
- Interpretations to re-check with the owner if raised: item 7's champion split is read per-circle
  (`isChampion(space)`); "watching" kept as the state word because the prompt's banner copy uses it.
- Contributor's own unread card has no way into its conversation — the owner's standing answer
  ("you can only read from Read"); noted, not solved.
- Reply style enforced this session: short beats, no forms, last line carries the ask (emoji-led).
