# Validation: final audit snags, 2026-10-11

Checked against `handoff-2026-10-11-final-audit-snags.md` and the QA entry `final-audit-snags`. Staged through the States palette. Sizes: desktop at the preview's own width (about 924px), phone through Config Viewport (phone frame, about 380 by 470).

### Could not check

- **Desktop at 1440 and 1280.** The preview could not be widened past about 924px. Two-column layouts were seen at 924 only.
- **Phone at 390 by 664 in a real window.** The phone frame was 470 tall, which is shorter than 664, so short-screen fit was covered. Anything that reads the window width instead of the frame was not covered: the Games panel opened as a centred window inside the frame, not a bottom sheet. That may be the frame or may be real, so check it on a phone.
- **Same-username answer** on Account. Typing the current name and pressing Update username did not show the answer in my captures. My script may have caused that, so it is not reported as a break. Check it by hand.
- **By-hand flows in the QA note**: cancelling with a failed payment through to History, a full email sign-up through Verify, the demo-bar sign-out on each guarded page. Their end states were checked through staged states only.
- Overlay motion, which screenshots here cannot show (`GOTCHA.md` 2).

### Ran and clean

1. Console on load: no errors (only the in-browser Babel warning).
2. Dead or unreachable: every listed state opened its screen. Sign in from `sign-in-return-library` landed on Library. `session-unknown` shows not-found.
3. Layout: no overflow, overlap or clipping at either size, measured against the screen on 15 states. A 70-letter search in Library and History wraps inside its card. `36000` and `summers` both find 36,000 Summers Ago.
4. What a picture misses: no unnamed controls on any state measured. No sideways scroll in the phone screen.
5. Declared rules: Notifications off makes the Games row a plain statement (no count, no chevron). Unfinished Groups and Delve sessions show "Not finished", the date and the line, with no play control. History rows say Not finished. The needs-Pass sessions read "This {room, scene} comes with the Pass." with Get the Pass. Dates: the Pass ended on 6 October and the last day is 5 October.

## Handoff

Checked the final-audit-snags states at about 924px and in the phone frame. Nothing broken was found, so nothing was changed. Left for the owner: a desktop pass at 1280 or wider, the Games panel shape on a real phone, the same-username answer, and the by-hand flows above.
