---
date: '2026-10-15'
topic: 'contact'
status: 'in-progress'
type: 'exploration'
---

# Handoff: contact: the "Get in touch" page

## Current Focus

The owner is choosing the copy for the contact page. 2d (2a rewritten) waits on their reaction; the last question put to them was "Does 2d read right, or do you want to change one of the headings?" Do not build anything into `app/` until a page is ratified in words.

Round 3 (later, same day): the owner rejected 2d's copy: it didn't say who it was speaking to, and "Write about a game" read as "write an essay about a game". Say hello must signal contributing and stay a quiet catch-all (a business could write). Three rewrites, 2e Plain, 2f You first, 2g One voice line, keep 2d's shape and change only the Help and Say hello lines. Recommended: 2f.

Round 4: the owner liked 2f's Help and 2g's friendlier Help, disliked 2f's Say hello, wants "contribute" instead of "make", and is unsure about one-word headings. 2h (long headings) and 2i (short headings) carry the same merged copy. Waiting on the heading call.

Round 5 (2j): "Contribute" as a heading was wrong; it is one reason within the catch-all. "Here" pointing at the address was rejected as illogical; each line names who you email.

## Decisions

Ratified by the owner, 2026-10-15:
- Option 2 from round 1: the footer's contact column holds one "Get in touch" link, which opens a page.
- Two addresses: support, and one address for everything else (contributors, partners, ideas).
- No wording about buying or licensing the platform ("we can't say we're open to being sold").
- Harness Intent links to https://www.harnessintent.com/.
- 2a's direction, not 2b or 2c.
- Second section heading "Talk to the team"; line "If you'd like to contribute, or have anything else in mind, email the team."

- 2j in full, integrated into `app/gs-site.jsx` (GsContact, footer "Get in touch" link) and `.gs-legal-foot` in `index.html`. Second address is `hello@` (ratified 2026-10-15); the domain waits on the product name, so `GS_HELLO` reads `hello@[platform].example`.

Formerly proposed, now ratified: Help heading "Get help"; line "Email support about anything to do with a game, your account or the Pass. Say where you got stuck."

Leanings, not ratified:
- The owner likes "hello" as the second address. The real address is not chosen; the playground uses `hello@[platform].example`.
- The owner disliked these in 2a: the heading "Who runs [Platform]", the line "Say which game or account it's about, and what happened", the line "Pitch a game, offer to help…", and "makes and runs it". They found 2a unfriendly and inelegant overall.

## Task(s)

- Done: round 1, options 0 to 4 (`playground/index.html`, `playground/pg-contact.jsx`).
- Done: round 2, options 2a to 2c with a critique of each, plus 2d (`playground/page-options.html`, `playground/pg-contact-page.jsx`).
- Done: round 3, options 2e to 2g (same rig; copy in `CP_OPTS`).
- Open: the owner's pick of 2e to 2g; then the real second address; then where the company number and registered office go.

## 2d copy, as built

- H1 "Get in touch".
- "Help": "Write about a game, your account or the Pass." support address.
- "Say hello": "Write with an idea, a game you'd like to make, or anything else." hello@ address.
- Closing line: "[Platform] is made by Harness Intent." (linked).

## Recent changes

- `docs/specs/contact/playground/pg-contact-page.jsx`: the round 2 rig. `CP_OPTS` holds each option's critique (Correct, Elegant, Copy), shown under Why. `CpPageA` to `CpPageD` are the pages. The footer always shows the option 2 footer. On load the rig opens signed out on the contact page.
- `docs/specs/contact/playground/page-options.html`: a copy of `index.html` loading the new module, with `.cp-*` rules added at the end of its `<style>`.
- `playgrounds.json`: new entry "Contact page, options 2a to 2d" under the contact ticket; touched set to 2026-10-15.

## Learnings

- Every ready-check on these entries warns of 44 missing files. It is the `<base href="../../../../">` false positive: the depth is right for `docs/specs/contact/playground/`. 2a to 2c were seen rendering. 2d was not looked at on screen.
- Voice (`guidelines/voice.md` in the design system) bans "we" and verbless fragments. Contact copy says "the team" or uses no subject.

## Action Items & Next Steps

1. Get the owner's verdict on 2d. Rework only what they name.
2. Ask for the real second address.
3. Done: company number and registered office go in Terms, "Who we are", when Terms are written (owner, 2026-10-15). A REQUIRED comment above `GS_LEGAL` in `app/gs-site.jsx` holds it; any session rewriting Terms must flag it if missing.
4. Once ratified: build the page and footer link into `app/gs-site.jsx` (GsFooter, GsLegal with `doc: 'contact'`), then ask whether it earns a `CHANGELOG.md` entry.
5. Archive both rigs to `docs/archive/contact/` and update `playgrounds.json`.

## Other Notes

- Product name is still the placeholder `[Platform]`; footer copyright reads "© 2026 Harness Intent Ltd".
- `uploads/` holds six screenshots from 2026-10-13, not from this session; they were left alone.
