# Handoff: Block for a member with no name (2026-10-06)

## The check
A block is held by name. With no name, blocking stored `''`. That would have matched every nameless member, and every comment or card whose author name is blank. **Confirmed, and fixed.**

## What changed
- `app/report-block.jsx`:
  - `rbKey(x)`: a member with no name is keyed by address (`email:<address>`). This follows the Champion badge, which already matches by email. A named member is still keyed by name.
  - `isBlocked`, `block` and `unblock` accept a name or a member.
  - The view filter never matches a blank name.
  - Block dialog with no name: title "Block this member?", body "You won't see this member's links or comments in any circle you share. This member won't be told, and can still see yours."
- `app/spaces.jsx`:
  - The row menu reads "Block this member" / "Unblock this member" when there is no name.
  - The row passes the member, not the name.
  - A register-only listener (`circ-stage-block`) opens Block on a member by address.
- `app/talk-surface.jsx`: a blocked comment with no author name reads "This member is blocked."
- `app/states.jsx`: new state `members-block-nameless`, beside `members-champion-nameless-email-hidden`. It's in QA as "Block a member with no name".
- A named member is unchanged.

## Limit (prototype only)
The prototype tracks people by name. So a block keyed by address hides nothing on cards or comments, and "This member is blocked." can't be reached here. The real app gives every member an ID that links and comments record, so a nameless member's block hides their content like anyone else's. The block ticket already requires this. No ticket change.

## Other places that print a blank name (prototype only, not fixed)
The live app already prints "A member" in feed cards and comments (code check, 5 Oct). These blanks exist only in the prototype, and no ticket needs to change.
- `app/report-block.jsx:134`: the comment menu's accessible label "About 's comment".
- `app/talk-surface.jsx:194`: " removed what they said."
- `app/talk-surface.jsx:205`: the comment author name.
- `app/talk-surface.jsx:342`: the reply placeholder and label "Reply to ".
- `app/feed.jsx`: the "Added by" attribution on a card.
- The Remove-member confirm (`app/spaces.jsx`), reaction attribution, and the feed lens's contributor list: not checked.
