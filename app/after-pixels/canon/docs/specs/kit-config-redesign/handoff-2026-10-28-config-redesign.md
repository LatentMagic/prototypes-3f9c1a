# Handoff 2026-10-28: Config modal redesign (kit 8 to 9)

Version before: 8. Now: 9.

## Sections and rows
- Global: After Pixels (Your AI, Account); Subscription (Subscription, Had the Pass before, Plan). 5 rows. Reset to seeded data (Review group) as an event.
- Sign-in and account: Signed in with, Provider sheet, Google and Apple sign-in, Device, Username. 5 rows.
- Editions: This edition, Ended unfinished. 2 rows.
- Escape: This week's room, finished. 1 row.
- The Barrow of Hollowmere: Chapter 1 (GsBarrowConfigRow). 1 row.
- Pass changes: Pass changes, Pass ended. 2 rows.
- Pass upsell: New editions, Free: Word and Escape. 2 rows.

## Kept from the old Config
- The Pass upsell rows (gs-pass-aids.jsx) still wrap the shipped ConfigExtra; two files publish it on purpose, the second renders the first.
- Launcher pill (pink, bottom 60px, 20px icons) and its open state; States and QA palettes and their shell styles untouched.
- Pass changes and Pass ended were under "Pass" with the subscription rows; split out to their own feature section (placement is my call, please confirm).

## Not done
No ConfigAction or ConfigNote used: this product has no events beyond Reset. Hints shortened; the This edition hint is still long because every fact in it is needed.
ConfigSeg and old kit-config-row/-eyebrow/-sep rules removed.

## Next
Check the Config at 1280x800 and 390 wide.
