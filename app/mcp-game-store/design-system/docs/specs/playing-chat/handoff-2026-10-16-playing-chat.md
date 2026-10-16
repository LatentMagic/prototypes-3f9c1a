---
date: '2026-10-16'
topic: 'playing-chat'
status: 'complete'
type: 'implementation'
---

# Handoff: playing-chat — a chat that plays itself

## Current Focus

Built; owner review of the card comes next. The product's home hero is untouched (that is its own later change).

## Task(s)

Delta "a chat that plays itself". All five items built: the part, show-at-a-time, pause and reduced motion, card + `.prompt.md` + `.d.ts`, usage note (in the prompt file).

## What was built and where

- `components/media/playback/ChatPlayback.jsx` / `.d.ts` / `.prompt.md`: the part. Sits in Media beside ChatPicture.
- `components/media/playback/chatplayback.card.html` (own folder: the Design System tab ties a folder's card to its components, so two chat components in one folder showed one card under the other's name): Casebook hero turns (`GS_HERO_CHAT`, copied from the product's `app/gs-chats.jsx`, the three casebook chats joined) playing at 300px, and at 440px under a seek slider.
- `components/media/ChatPicture.jsx`: the drawing is split into `chatTurn` (one turn) and `chatShell` (the window), both exported lowercase so they are shared but not on the namespace. ChatPicture calls them with no `fx` and renders the same markup as before. ChatPlayback calls them with an `fx` that says, per piece, whether it is drawn yet and how far it has entered. Nothing is copied.
- `components/components.css` (after the ChatPicture block): `.mcp-chat-fx` wrapper for entering blocks (keeps the parts' stretch rule), typed text and caret in the reply box, send-press, `.mcp-chat-pause`.
- `components/media/Icon.jsx`: new `pause` icon.
- `readme.md`, `ChatPicture.prompt.md`: one line each pointing to ChatPlayback.

## Props

Everything ChatPicture takes (`turns`, `title`, `toolBy`, `mark`, `height`, `width`, `fill`, `composer`, `placeholder`, `label`, `more`, `className`), plus:
`time` (ms, given time; no clock, no control), `autoplay` (default true), `loop` (default false), `speed` (default 1), `pace` (partial override of the defaults, see `.d.ts`), `pauseLabel` / `playLabel` / `replayLabel`. A turn may carry `hold` (ms) to override its own hold. Static `ChatPlayback.duration(turns, {pace, speed, composer})` gives ms to the finished chat.

## Show it at a given time

```jsx
const end=ChatPlayback.duration(turns);
root.render(<ChatPlayback turns={turns} time={ms}/>);
```
The picture comes from `timeline(turns, pace)` (pure: start times of every piece) and `frame(timeline, T)` (pure: what is drawn at T). Easing is the `--ease` curve solved in JS. Under `time` the body always pins to the bottom. Checked: seeking 2.1s → 24.7s and back gives identical body markup at each time. Recorder: wait for `document.fonts.ready`, render each frame's time, capture after the next animation frame.

## Choices ("Yours to decide")

- **How a turn appears.** User line typed into the reply box, then sent (box clears, bubble fades in): it reads as the player's move. AI: a think beat, then tool call, each block and each `after` block fade and rise 4px one at a time; paragraphs fill word by word in place (unrevealed words are laid out at opacity 0), so text never reflows and scroll never jitters mid-paragraph. Without the reply box the user line just fades in.
- **Pacing.** Defaults: type 32 chars/s (450–1600ms), think 700, word 55, enter 260 (`--time-popup`), read 1400 after an AI turn. One `speed`, partial `pace` overrides, per-turn `hold`. Casebook hero runs ~24.7s.
- **Loop.** Stops on the finished chat by default (a hero should end on a readable picture); the control turns into Play again. `loop` holds 4s and restarts for places nobody reads closely.
- **Pause control.** 32px square, top-left, chat send colours (warm grey, white icon), 44px hit area. Square because it is the system's control, not the host chat's; top-left because top-centre is the pill and the right edge is the scrollbar. Pause / Play / Play again.
- **Scrolling.** Follows the newest piece by snapping (pieces fade in, so the snap reads as arrival). A reader who scrolls takes over; playback continues and following resumes when they return to the bottom. Top fade and pill behave as in ChatPicture.
- **Name and place.** `ChatPlayback`, in `components/media/` beside ChatPicture: it is the same picture, moving. Time passed as `time` in ms.

## Not built / unresolved

- With `title` set, the pause control overlaps the header. No current use has a title.
- Under reduced motion it renders the finished ChatPicture even when `time` is given; a recorder on a reduced-motion machine gets the still. Fine for now.
- Screen readers hear turns as they are added (not-yet-started turns are not in the DOM). No live region added.

## Next

1. Owner reviews the card at phone and desktop width.
2. Later change: the product hero swaps ChatPicture for ChatPlayback with the same `GS_HERO_CHAT`.
