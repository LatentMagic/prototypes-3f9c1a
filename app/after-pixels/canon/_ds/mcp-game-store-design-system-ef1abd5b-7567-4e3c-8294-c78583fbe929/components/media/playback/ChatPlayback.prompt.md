ChatPlayback plays a chat out turn by turn: the same window, turns and blocks as ChatPicture, arriving in order. Use it where a page shows a game being played rather than a finished chat (a hero, later a product page). Pass the turns once; never keep a second copy of the words for the moving version.

```jsx
<ChatPlayback turns={turns} mark="assets/logo.svg" toolBy="After Pixels" fill/>
```

- **How a turn arrives.** The user's line is typed into the reply box, then sent: it leaves the box and appears as the bubble. An AI turn waits a beat, then its tool-call line, each block and each `after` block fade and rise in one at a time (4px, --time-popup, --ease). Its paragraphs fill in word by word, in place, so the turn never reflows as it writes. Without the reply box (`composer={false}`) the user's line simply fades in.
- **Pace.** Defaults suit reading at a glance. `speed` scales everything; `pace` overrides single timings (see the `.d.ts`); a turn's `hold` sets how long that turn is held after it lands.
- **It stops** on the finished chat. The control then reads Play again. `loop` holds the finished chat (4s) and starts over; keep it for places nobody reads closely.
- **Pause.** A 32px square with 8px rounded corners (so it follows the window's corner) in the top-left corner in the chat's send colours, 44px to press: Pause while playing, Play when paused, Play again when finished. Resuming carries on from the same moment. Don't hide it or build your own.
- **Scrolling.** It follows the newest piece. A reader who scrolls up takes over: the chat keeps playing below and stops following until they scroll back to the bottom. The top fade and the "Back to the start" pill behave as in ChatPicture.
- **Reduced motion.** With `prefers-reduced-motion: reduce` it never plays. It draws the finished chat as a ChatPicture, still, with no control.

## Show it at a given time

`time` (ms from the start) draws exactly what is on screen at that moment, from the turns and the time alone: no random values, no clock reads, nothing left over from earlier frames. Seeking forward or back gives the same picture. While `time` is set no clock runs, the control is hidden and the chat always follows the newest piece.

```jsx
const end=ChatPlayback.duration(turns);              // ms to the finished chat
root.render(<ChatPlayback turns={turns} time={frame*1000/60} autoplay={false}/>);
```

For a recorder: wait for `document.fonts.ready` once, then for each frame render with the new `time` and capture after the next animation frame. Pass the same `speed`, `pace` and `composer` to `duration` as to the component.
