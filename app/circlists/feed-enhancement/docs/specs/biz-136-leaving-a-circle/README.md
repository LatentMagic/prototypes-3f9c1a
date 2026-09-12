# biz-136-leaving-a-circle

Playground: three ways a member gets out of a circle and back to home on a
phone, with nothing persistent at the foot of the screen. The round after the
whiteboard in [biz-136-mobile-chrome](../biz-136-mobile-chrome/README.md), which
settled that the bottom bar either holds account-level destinations permanently
or does not exist at all — and, in ruling the barless direction the interesting
one, left the exit stranded in the top-left, the one place a thumb cannot reach.

## The three

| | | Stance in a line | What it costs |
|---|---|---|---|
| **A** | Back at the top | Direction 3 from the whiteboard, unchanged: back arrow and gear in the top bar, Add floating where the web already floats it. The baseline. | Leaving is a top-left tap — the hardest target on the screen. |
| **B** | Close, not back | The circle is a sheet laid over home, dismissed rather than returned from: a quiet disc in the thumb corner opposite the FAB, a drag down from anywhere in the feed, or a tap on the shoulder of home showing above. | Two floating objects over the feed, and the sheet idiom promises transience about the place members actually live. |
| **C** | Pull it aside | The exit is the edge, not an object: pull the circle off from the left and home is already underneath, moving with you; let go short of a third of the width and nothing commits. A handle proud of the edge at thumb height is what you pull; the circle's name is the up-affordance. | A handle carries no word, and in a browser tab the gesture is the browser's own back-swipe. |

## The files

| | |
|---|---|
| [pg-lc-app.jsx](pg-lc-app.jsx) | The app: one state machine, one set of bodies, all shipped components mounted. Nothing here is a variation — which is why switching does not drop you out of where you were standing. |
| [pg-lc-chrome.jsx](pg-lc-chrome.jsx) | The three variations. Chrome only. Carries the copies of `TopBarNative` and `useNativePush` that `app/app-shell.jsx` does not export, and says so at the top. |
| [pg-lc-rig.jsx](pg-lc-rig.jsx) | The switcher pill, the viewport control, the root. |
| [rig.css](rig.css) | The rig's own furniture, plus B's sheet and C's pull layer. |
| [build.mjs](build.mjs) | Writes both artefacts. `node docs/specs/biz-136-leaving-a-circle/build.mjs` from the candidate build root. |

Entry HTML lives at the project root so `app/*` and `tokens.css` resolve:
`leaving-a-circle-playground.html` (Babel, the working rig) and
`leaving-a-circle-playground-standalone.html` (compiled, self-contained, the
one that gets published). The standalone is generated output — regenerate it,
never edit it.
