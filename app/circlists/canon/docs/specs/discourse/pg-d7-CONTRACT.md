# pg-d7 direction module contract

Binding interface for the ten discourse direction modules in the v7 playground. Ten agents implement against this document without talking to each other. Everything here is exact.

Rig: [discourse-playground-v7.html](../../../discourse-playground-v7.html) · [pg-d7-shell.jsx](pg-d7-shell.jsx) · [pg-d7-data.jsx](pg-d7-data.jsx) · [pg-d7-addlink.jsx](pg-d7-addlink.jsx).

Read before writing: [PLAYGROUND.md](../../../PLAYGROUND.md), [GOTCHA.md](../../../GOTCHA.md), [CLAUDE.md](../../../CLAUDE.md).

---

## 1. What you build

**One version of the app, complete, carrying one direction.** Not a fragment, not a demo of a component. The reviewer taps your name in a flat list and *uses the app*. Your direction is discovered by playing, never by reading.

**No explanatory copy anywhere in your module.** No claim, no cost, no trade-off, no "this direction shows…". Theory lives in [FINAL-TEN.md](/home/user/business-ops/work/apps/circlists/discourse/_resources/ideation/FINAL-TEN.md), never in the reviewer's path. Product copy only — evergreen, present-tense, verb-led, no emoji.

The rig owns the shell, the rail, the top bar, the tabs, the feed loop, the card, the add flow, the Swell, the sheets, the driver, persistence. **You own only what your direction changes.**

### Your file

| # | id | file |
|---|----|------|
| 01 | `question` | `pg-d7-dir-01-question.jsx` |
| 02 | `depths` | `pg-d7-dir-02-depths.jsx` |
| 03 | `countercard` | `pg-d7-dir-03-countercard.jsx` |
| 04 | `seal` | `pg-d7-dir-04-seal.jsx` |
| 05 | `pulled-line` | `pg-d7-dir-05-pulled-line.jsx` |
| 06 | `sounding` | `pg-d7-dir-06-sounding.jsx` |
| 07 | `seats` | `pg-d7-dir-07-seats.jsx` |
| 08 | `dispatch` | `pg-d7-dir-08-dispatch.jsx` |
| 09 | `palimpsest` | `pg-d7-dir-09-palimpsest.jsx` |
| 10 | `stream` | `pg-d7-dir-10-stream.jsx` |

All in `docs/specs/discourse/`. Kebab-case, always. Write **only** your own file. Never edit the rig, the data, the HTML, or another direction's module.

### Babel scope

Every module is a separate `<script type="text/babel">`. **Scripts do not share scope.** Read every dependency off `window` at the top of your file, and prefix your own top-level names so they cannot collide with another direction's:

```jsx
const { PGD7, Button, Icon, Avatar, Field } = window;
const { useState: q1S, useEffect: q1E, useRef: q1R } = React;   // your own prefix
```

Never write a bare `const styles = {}`. Name style objects per component.

---

## 2. Registration

Your file ends with exactly one call:

```jsx
PGD7.register({ id: 'question', name: 'The Question', /* … */ });
```

The rig boots after every module has run. A module that throws or fails to register leaves its rail row greyed out; the rest of the rig still works.

### The spec

| key | type | required | what it is |
|---|---|---|---|
| `id` | string | **yes** | exactly the id from the table above |
| `name` | string | **yes** | the name in the rail and the driver strip. The *only* text about your direction the reviewer ever sees. Title case, no tagline, no punctuation |
| `face` | `{ slot, demoteTitle }` | no | where your card content sits. `slot` is one of `'above-title'` · `'description'` · `'title-attribution'` · `'below-attribution'` · `'none'` (default). `demoteTitle: true` steps the item's own headline down to a source line — only for a direction whose authored text outranks the item |
| `Card` | component | no | rendered at `face.slot`, inside the card's border. Omit (and leave `face.slot: 'none'`) and the rig mounts the **shipped** `FeedCard` untouched |
| `Compose` | component | no | beat 1. Step two of the add flow: the thought attached alongside the link |
| `Landing` | component | no | beat 2. Replaces the Swell's reveal at commit, in a sheet |
| `Respond` | component | no | beat 3. Opened on a Read card, in a sheet |
| `Continue` | component | no | beat 4. A full page, entered with the app's own sub-view chrome |
| `Aside` | component | no | a permanent second column at ≥ 1024; the same body is a full page below that |
| `Banner` | component | no | a band directly above the Active/Read tabs |
| `order` | `(items, ctx) => items` | no | reorder or filter the visible tab list (pinning, clustering) |
| `beats` | `{ attach, land, respond, continue }` | no | override any driver beat. Each is `(api) => void` |
| `initialState` | object | no | your module's private state at first entry. Default `{}` |
| `landingMerged` | boolean | no | default `true` — the Swell flow is **unmounted at commit** and `Landing` takes the sheet's place. Set `false` to let the shipped reveal play first, then open `Landing` after it |
| `continueTitle` | string | no | sub-view title for `Continue`. Default `'Continue'` |
| `asideTitle` | string | no | sub-view title for `Aside` below 1024. Default `'The stream'` |

Every component receives `{ ctx }` plus its own extras (§4). All are optional — but see §5: **all four beats must land somewhere real.**

---

## 3. `ctx`

Handed to every component you register.

```
ctx.circle          { id, name, champion, … }        the one circle
ctx.members         [ member × 5 ]                   includes you
ctx.me              member                           { id:'you', name:'You', realName:'Sam Rivera' }
ctx.others          [ member × 4 ]
ctx.nameOf(id)      → 'Priya N.'                     roster name for a member id
ctx.memberById(id)  → member | null
ctx.REGISTERS       ['gist','trust','reflection','takeaway']
ctx.GLYPHS          the Swell's five glyphs, in dial order

ctx.items           [ item ]                         LIVE — seed + your plays merged
ctx.activeItems     [ item ]                         ctx.items where !read
ctx.readItems       [ item ]                         ctx.items where read
ctx.itemById(id)    → item | null

ctx.isMobile        boolean                          true below 1024, or in app posture
ctx.appPosture      boolean                          the framed app posture
ctx.narrow          alias of isMobile
ctx.tab             'active' | 'read'
ctx.route           'feed' | 'continue' | 'aside'
ctx.beat            the driver beat last fired, or null

ctx.state           your private state (§6)
ctx.setState(patch) merge-patch, or a (state) => patch updater
ctx.actions         mutations (below)
```

Navigation, also on `ctx` (these are the same functions the driver uses):

```
ctx.setTab(t)            ctx.setRoute(r)
ctx.openAdd()            ctx.openSwell(item)      ctx.openLanding(item)
ctx.openRespond(item)    ctx.openContinue()       ctx.openAside()
ctx.closeOverlay()       ctx.firstUnread()        ctx.firstRead()
```

### `ctx.actions`

```
markRead(item, reaction)     move to Read; reaction may be null
setUnread(item)              move back to Active — the return device
setThought(itemId, thought)  replace an item's thought (succession, overwriting)
respond(itemId, response)    append a response by you
addItem(partial)             put a new card in Active
del(item)                    remove it for everyone
reset()                      wipe this direction's play back to seed
```

`thought` = `{ text, register, by, at }` — `by` and `at` fill in as yours.
`response` = `{ text, register }` — `id`, `by: 'you'`, `at` fill in.

All writes persist to `sessionStorage` under `pg_d7_v1`, scoped per direction. Switching away and back is not a loss. Never write to storage yourself.

---

## 4. The data model

`ctx.items` merges the seed ([pg-d7-data.jsx](pg-d7-data.jsx)) with the reviewer's play. One circle, five members, eleven links.

```
item = {
  id, url, title, source, image, hasImage, faviconExists, at,
  by,               member id of the sharer
  attribution,      'Added by Priya N.' — what the card prints
  read,             YOUR read state
  reactions,        [ { name, glyph, intensity } | { name, skipped:true } ]
  thought,          { by, register, text, at }  |  null
  responses,        [ { id, by, register, text, at } ]
  pulls,            [ { by, text } ]   sentences members took out of the source
  prose,            [ paragraph ]      the source's own text, inline
  sharedBeforeReading,  true on the two items vouched for unread
}
```

**Registers.** Four kinds of thing a member says. Treat them differently or ignore them; never invent a fifth.

`gist` functional — what this is · `trust` pre-read vouching · `reflection` personal · `takeaway` the one thing carried away.

**Seeded coverage — every state and every fallback.** Your direction must survive all of it:

| case | items |
|---|---|
| no thought attached | `a2`, `r3` |
| a long thought (≈70 words) | `a4` |
| shared before reading | `a3`, `r4` |
| nobody responded yet | `a1`, `a6`, `r3` |
| everyone responded (all four others) | `a4`, `r1` |
| no reactions at all — the first-one-here moment | `a6` |
| everyone who read it skipped the Swell | `r3` |
| no preview image, no favicon, no source | `a6`, `r4` |
| a long response | `r4` |

Render `null` where a direction has nothing to show; **never** a placeholder, never "no thought yet" chatter. A bare card is a legitimate face.

---

## 5. The four beats

The driver is four buttons: **Attach · Land · Respond · Continue** — the four ratified layers. One tap must put the app in that state, with the distinctive moment of your direction on screen. This is how the reviewer walks your idea, so **all four must land somewhere real.** A beat that opens nothing is a failed direction.

| beat | layer | rig default | what yours must do |
|---|---|---|---|
| `attach` | 1 Contribution | `ctx.openAdd()` — the app's own AddReveal, then your `Compose` | show how a thought is attached at share. If your contribution is deliberately dull, omit `Compose` and say so by omission |
| `land` | 2+3 Reaction · Reading | opens the **real** `SwellReactionFlow` on the first unread item; at commit the flow unmounts and your `Landing` takes the sheet's place | show what the reader meets on marking read — the circle's words in your grammar, and the affordance to give their own back |
| `respond` | 3 Reading | opens `Respond` on the first Read item | take the reader's own contribution and commit it visibly through `ctx.actions` |
| `continue` | 4 Continuation | `Aside` → `openAside()`; else `Continue` → `openContinue()`; else Read tab | demonstrate the continuation mechanism itself — the card returning to Active, the next round, the shelf, the column |

Override any beat:

```jsx
beats: {
  continue: (api) => {
    const t = api.readItems.find((i) => i.responses.length > 1) || api.firstRead();
    api.setTab('read');
    api.openRespond(t);
  },
},
```

`api` is `ctx` plus the navigation functions — the same object, at the moment the beat fires.

The rig closes the drawer as a beat fires, so on a narrow viewport the app is actually visible when it lands.

---

## 6. Private state

Anything your direction needs that the shared seed does not carry — seats taken, a seal's elapsed window, cast cards, strata, a dispatch issue — lives in `ctx.state`, persisted per direction.

```jsx
initialState: { seats: { r1: ['marcus', 'ada'] } },

// inside a component
const taken = (ctx.state.seats || {})[item.id] || [];
ctx.setState((s) => ({ seats: { ...(s.seats || {}), [item.id]: [...taken, 'you'] } }));
```

Key by item id where the thing belongs to an item. Never mutate `ctx.state` in place. Never touch another direction's state.

---

## 7. The card

If your direction puts nothing inside the card's border, set nothing: the rig mounts the **shipped `FeedCard`** and you inherit it exactly. Only when content must sit inside that border does the rig swap in its slotted copy of the card body.

The four slots, and precisely where each sits:

| slot | position |
|---|---|
| `above-title` | above the source line — the top of the card, ahead of everything |
| `description` | under the title, **inside the left text column**, beside the 60px thumbnail |
| `title-attribution` | full card width, below the title+thumbnail row, above the attribution footer |
| `below-attribution` | full card width, below the attribution footer and its actions |

`Card` receives `{ ctx, item, tab, where }`. Return `null` for items your direction has nothing to say about.

The four card-face directions each occupy a **different** slot, in a different type register, under a different attribution rule. Do not drift toward a line under an attribution — that collision is exactly what this set was rebuilt to avoid. Card faces:

- 01 The Question — `above-title`, `demoteTitle: true`
- 05 The Pulled Line — `title-attribution`
- 07 Seats — `below-attribution`
- 09 Palimpsest — `description`

Directions 02, 03, 04, 06, 08, 10 either leave the card alone or carry a mark rather than a line; check your entry in FINAL-TEN.

---

## 8. Surfaces

**`Compose` — `{ ctx, item, draft, setDraft, submit }`.** Rendered inside the add sheet, under the resolved link. `draft` is `{ text, register }`. Call `submit(payload)` to attach and `submit(null)` to attach nothing. Skipping is a real product state, not a cancel.

**`Landing` — `{ ctx, item, glyph, close }`.** In a sheet. `glyph` is the reaction just given, or undefined on a skip.

**`Respond` — `{ ctx, item, close }`.** In a sheet.

**`Continue` — `{ ctx, close }`.** A full page. The top bar becomes back-arrow + `continueTitle`; the app-posture bottom bar hides itself. Constrain your own measure — `maxWidth: 'var(--max-feed-width)'`.

**`Aside` — `{ ctx, close, docked }`.** At ≥ 1024 it is a permanent 340px right column and `docked` is `true`; below that the same body is a full page and `docked` is undefined. One body, two placements, never forked.

**`Banner` — `{ ctx }`.** A band above the tabs. Keep it one line tall; it costs the feed vertical room on a phone.

Sheets come from the rig — `window.PGD7.Sheet` — if you need one of your own. Never build another overlay mechanism.

---

## 9. Mount what exists; never reinvent it

Read the app before writing a line of chrome. If it is there, mount it.

| you need | mount |
|---|---|
| a button | `window.Button` — `primary` · `secondary` · `tertiary` · `destructive` · `destructive-secondary` · `ghost` |
| a text input with label + inline error | `window.Field` |
| an icon | `window.Icon` — see `LP_ICONS` in [primitives.jsx](../../../app/primitives.jsx) for the set |
| a member's face | `window.Avatar` (`accent` for you) |
| the reaction gesture | `window.SwellReactionFlow` — the rig already mounts it on `land` |
| the reaction revisit | `window.SwellDoor` — the rig already puts it on Read cards |
| an overlay | `window.PGD7.Sheet` |
| a card | the rig's, via `face` + `Card` |

Re-implemented geometry, easing, breakpoints or icons are a defect **even when they look identical**, because they drift.

---

## 10. Constraints

**Invariants — every direction obeys, no exceptions.**

- Discourse and reactions are one paired subject. Never a system bolted beside the Swell.
- Calm is the floor. **No counts, no tallies, no badges, no toasts, no unread numbers, no urgency.**
- Communal library, individual read-state. No "who read it" signals outside the Swell's own roster.
- The Read tab must not carry a floating mass of conversation. Encapsulate it.
- Brevity is structural — built into the shape, never policed by a character-count rule shown to the reader.
- Not WhatsApp, not Slack.
- Accent green `#047857` = primary actions, active states, focus rings only. Never status, never decoration. Danger red `#991b1b` = destructive only.
- Hierarchy through size and weight, never colour. 4px grid. `Inter` + `JetBrains Mono` via the `--font-sans` / `--font-mono` tokens. **No emoji in UI copy** (the Swell's five reaction glyphs are the product's own vocabulary and are not "emoji in copy").
- Style with `tokens.css` variables. Never hard-code a hex the tokens already name.

**Both viewports are first-class.** It must work at **390 × 844** and at **1024 × 720**. The breakpoint is the app's own — `1024`, from `main.jsx`. Never invent one. Readable at 320. Use `100dvh`, never `100vh`. Keep safe-area insets. Adapt to the width you are handed — container queries and `cqi`, not posture flags (GOTCHA #8).

**Motion traps.** Any `.focus()` inside a sheet must pass `{ preventScroll: true }` (GOTCHA #1). Never put a standing `transform` on a layer at rest — it captures every `position: fixed` inside it (GOTCHA #5). Do not trust a screenshot to confirm a mount transition (GOTCHA #2).

**Structure, not compensation.** If spacing needs a negative margin, the structure is wrong (GOTCHA #6).

---

## 11. Checking your module

The sandbox blocks unpkg, so the entry HTML renders blank there. Scaffolding is vendored:

```sh
cd app/circlists/canon
sh .verify/make.sh                 # writes v7-verify.html against local React + Babel
node ../../../server.js            # http://localhost:4321/app/circlists/canon/v7-verify.html
```

Then, driving it with `playwright-core` against `/opt/pw-browsers`:

1. Your name appears in the rail; tapping it enters your version.
2. At **1024 × 720**: rail docked, no menu button, no horizontal page scroll.
3. At **390 × 844**: menu button opens the app's MobileDrawer with the list; the driver strip is reachable by thumb.
4. Viewport → **Mobile**: the framed app posture; Home shows the direction list; your surfaces still pin inside the phone frame.
5. All four beats land on something real, one tap each.
6. No console errors from your module. (One React warning about a non-boolean `mono` attribute comes from the shipped `AddReveal` and is pre-existing — leave it.)
7. Walk every coverage case in §4 without a crash or an empty box.

`.verify/` and `v7-verify.html` are scaffolding. Do not commit them.

---

## 12. Worked skeleton

A complete, deliberately thin module — every part of the contract wired end to end. It is a skeleton, not a design: the real direction 01 is far more than this.

```jsx
// ============================================================================
// Discourse v7 — direction 01, The Question.
// The only authored text is interrogative: the sharer attaches a question, and
// the ask outranks the item it is about.
// ============================================================================
const { PGD7, Button } = window;
const { useState: q1S } = React;

// ---- The card face: the ask above the title, which demotes to a source line -
const QCard = ({ ctx, item }) => {
  const q = (ctx.state.asked || {})[item.id] || (item.thought && item.thought.text);
  if (!q) return null;                       // no thought attached — a bare card
  return (
    <div style={{
      fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 17, lineHeight: 1.3,
      letterSpacing: '-0.01em', color: 'var(--color-fg-1)',
      textWrap: 'pretty', margin: '0 0 10px',
    }}>{q}</div>
  );
};

// ---- Beat 1: attach ---------------------------------------------------------
const QCompose = ({ draft, setDraft, submit }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <textarea rows={3} value={draft.text} placeholder="Ask the circle something."
      onChange={(e) => setDraft({ ...draft, text: e.target.value })}
      style={{
        width: '100%', fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.5,
        padding: 12, borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border-1)', resize: 'vertical',
      }} />
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
      <Button variant="secondary" onClick={() => submit(null)}>Skip</Button>
      <Button variant="primary" onClick={() => submit({ text: draft.text, register: 'gist' })}>Attach</Button>
    </div>
  </div>
);

// ---- Beats 2 and 3: one surface, the live question and its answers ----------
const QAnswers = ({ ctx, item, close }) => {
  const [v, setV] = q1S('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 17, color: 'var(--color-fg-1)' }}>
        {(item.thought && item.thought.text) || 'What did you make of it?'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {item.responses.map((r) => (
          <div key={r.id} style={{ fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.5, color: 'var(--color-fg-1)' }}>
            <span style={{ color: 'var(--color-fg-3)' }}>{ctx.nameOf(r.by)} </span>{r.text}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={v} onChange={(e) => setV(e.target.value)} placeholder="One line."
          style={{
            flex: 1, minWidth: 0, fontFamily: 'var(--font-sans)', fontSize: 16,
            padding: '10px 12px', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border-1)',
          }} />
        <Button variant="primary" onClick={() => {
          if (v.trim()) ctx.actions.respond(item.id, { text: v.trim(), register: 'gist' });
          close();
        }}>Answer</Button>
      </div>
    </div>
  );
};

// ---- Beat 4: asking again returns the card to Active ------------------------
const QAgain = ({ ctx }) => {
  const [v, setV] = q1S('');
  const target = ctx.readItems[0];
  if (!target) return null;
  return (
    <div style={{ maxWidth: 'var(--max-feed-width)', margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, color: 'var(--color-fg-1)' }}>{target.title}</div>
      <input value={v} onChange={(e) => setV(e.target.value)} placeholder="Ask the next question."
        style={{
          fontFamily: 'var(--font-sans)', fontSize: 16, padding: '12px 14px',
          borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-1)',
        }} />
      <div>
        <Button variant="primary" onClick={() => {
          if (!v.trim()) return;
          ctx.setState((s) => ({ asked: { ...(s.asked || {}), [target.id]: v.trim() } }));
          ctx.actions.setUnread(target);     // back into Active for everyone who read it
          ctx.setRoute('feed'); ctx.setTab('active');
        }}>Ask</Button>
      </div>
    </div>
  );
};

PGD7.register({
  id: 'question',
  name: 'The Question',
  face: { slot: 'above-title', demoteTitle: true },
  initialState: { asked: {} },
  Card: QCard,
  Compose: QCompose,
  Landing: QAnswers,
  Respond: QAnswers,
  Continue: QAgain,
  continueTitle: 'Ask again',
  beats: {
    // Land on a card that already carries a question, so the ask is on screen.
    land: (api) => {
      const t = api.activeItems.find((i) => i.thought) || api.firstUnread();
      api.setTab('active'); api.openSwell(t);
    },
  },
});
```

---

## 13. Done when

- Your name is in the rail and entering it gives a working, inhabited app.
- All four beats land on something real, one tap each, at 390 × 844 **and** 1024 × 720.
- The direction is legible by playing alone — no explanatory copy anywhere.
- Every coverage case in §4 renders without a crash, an empty box, or a placeholder.
- No console errors, no horizontal page scroll, no invented breakpoint, no re-implemented app component.
- You changed exactly one file: your own.
