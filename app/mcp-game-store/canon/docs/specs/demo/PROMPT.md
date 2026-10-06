# Prompt, 2026-10-06 (original, verbatim)

The user's message, followed by the pasted brief it carried.

## Message

> https://claude.ai/design/p/3f1df829-2c1f-4d73-ba41-17bf783de9b7?file=circlists.html&via=share get reuseable surfaces, mainly for sign in / sign out (tho not design). its important to note that we will repeat elements that are repeatable. That has nothing to do with design. Only essential surfaces etc. My main concern is simple the billing and sign in/sign up because it makes use of our third party.
>
> dont forget ui-design.md:
>
> EXECUTE the attached

## Pasted brief

Build a small clickable prototype of a website that sells small games you
play by talking to your AI assistant (Claude, ChatGPT and others). Nine
screens, linked so someone can click from the home page through sign-up
to a played game and its result.

Use the design system as it stands for everything visual: its colours,
fonts, spacing, square corners, buttons, cards, tags and covers. Where
a part isn't in the design system (top bar, chat windows, server panel,
stat tiles, share card, demo bar), build it from the system's colours,
type, spacing and square corners. No new colours or fonts. The "Pass"
tag is the system's "Locked" tag with the word Pass. Every game cover is a few flat basic shapes in
the cover colours. Design for a phone first, then desktop. Where I say
"beside", stack it on a phone. The site's name is the placeholder
"[Platform]". All content is demo content; nothing needs to work beyond
moving between screens.

THE TWO GAMES AND WHO GETS WHAT (use this everywhere)
- Daily Puzzles: a pack of three small puzzles, new every day: an escape
  room, a murder mystery and a word puzzle. Free.
- Delve: a longer adventure, one scene of 25–40 minutes, new each week.
  Needs the Pass. There is no free scene.
Not paying: today's puzzles, and nothing is kept.
Paying (the Pass): plus the weekly games, plus past puzzles, plus your
streak and your record.
Mark anything that needs the Pass with a small "Pass" tag, and anything
free with "Free". A thin demo bar fixed to the foot of every screen
switches the whole prototype between three views: "Demo view: signed
out / free / Pass". It is not part of the product.

SHARED TOP BAR
Signed out: "[Platform]", links "Games", "How it works", "Pricing",
link "Sign in", main button "Start free".
Signed in: "[Platform]", links "Games", "History", and an account menu
(Your AI, Pass, Sign out).

SCREEN 1: HOME (signed out)
Explains the product and shows the games.
- Headline: "Someone's lying to you. Go and find out who."
- Under it: "Small games you play by talking to Claude or ChatGPT. New
  ones every day."
- Main button "Start free". Beside or under it: "Works with Claude ·
  ChatGPT · Goose · any assistant that supports MCP connectors".
- How it works, three numbered steps: "Connect your AI in about two
  minutes." / "Play today's puzzles free. No card needed." /
  "The Pass keeps your results and your streak."
- "Who does what", two columns. Your AI: "Narrates, voices the
  characters, and asks what you do next." Our server: "Rolls every die,
  keeps the score, decides each outcome and records your session."
- One chat window showing what play looks like (the word puzzle window
  from screen 5).
- Games, as two large cover cards. "Daily Puzzles": "Three small
  puzzles, new every day." Tags: Free, about 10 min, Solo. Opens
  screen 5. "Delve": "Get her out before the drums stop." Tags: Pass,
  25–40 min, Solo, 12+. Opens screen 4.
- A short free and paid comparison in two columns, as in "who gets
  what" above, with a link "See the Pass".
- A line near the foot: "Purchases only ever happen on this site; your AI
  will never ask you to pay."

SCREEN 2: SIGN UP AND SIGN IN
Copy the flow and structure of the linked Circlists prototype's sign-up
and sign-in screens exactly: the same steps, the same choices in the same
order, the same field behaviour and error placement. Change only the
look, to this design system, and the name, to "[Platform]". If you
can't open the link: first a screen of three full-width buttons
(Continue with Google, Continue with Apple, Continue with email); then
email and password, "Forgot password?", a main button "Create account"
or "Sign in", and a link to switch between the two. After signing up, go
to screen 3. After signing in, go to screen 6.

SCREEN 3: CONNECT YOUR AI (first thing after sign-up)
Heading: "Connect your AI". Line: "About two minutes. You do this once."
A choice of assistant (Claude, ChatGPT, Goose, Other), then three
numbered steps for the chosen one: copy the shop's link, paste it into
the assistant's settings, approve the connection. A copy button on the
link. A waiting state, then a connected state: "Connected. Tell your AI
you want to play today's puzzles." with a button "Browse games".

SCREEN 4: GAME PAGE (Delve)
Top to bottom, with this wording exactly:

A. BREADCRUMB
"Games / Adventures / Delve"

B. HEADER: cover beside a play card (cover about two-thirds wide)
Cover: a few flat basic shapes in the cover colours on a cover background.
No illustration. Over its bottom-left corner: small label
"ADVENTURE · ONE SCENE" above the large title "Delve".
Card:
- Small label: "PART OF THE PASS"
- Heading: "A new scene every week"
- Three numbered steps, each with a bold lead:
  1. "Connect your AI" in about two minutes. Claude, ChatGPT, Goose and
     others.
  2. "Play one full scene", start to ending.
  3. "Keep your result." It stays in your history.
- Full-width main button. Not paying: "Get the Pass". Paying: "Play in
  your AI".
- Small print: "Delve is part of the [Platform] Pass. Purchases only
  ever happen on this site; your AI will never ask you to pay."
- Not paying only, a secondary link: "Play today's puzzles free"
- A thin line, then small label "WORKS WITH" and: "Claude · ChatGPT ·
  Goose · any assistant that supports MCP connectors"

C. TAGS: one row of six
"AI-essential: your AI is the Dungeon Master" (the lead tag, marked with
a small dot) · "Adventure" · "12+ · fantasy peril, no gore" ·
"25–40 min" · "Solo" · "One scene · new warren layout each run"

D. PITCH: story beside a "who does what" card (story a little wider)
Heading: "Get her out before the drums stop"
Paragraph: "Goblins have dragged the miller's daughter into the warren
beneath Gallows Hill. When the drums stop, the ritual is complete. You
have one scene: sneak, talk, fight or bluff your way through tunnels,
fungus galleries and a bone bridge to the ritual chamber, then get back
out."
Paragraph: "Every risky move is a d20 roll, made by our server where
nobody can fudge it. Two tracks decide the scene: your progress towards
the captive, and the threat clock that fills as the warren wakes. Your AI
tells the story around the dice." (bold "progress" and "threat clock")
Card, small label "WHO DOES WHAT", two columns:
- "Your AI": "Narrates the warren, voices the goblins and the captive,
  and asks what you do next."
- "Our server": "Rolls every die, keeps both tracks, decides each outcome
  and records your session."

E. HOW IT LOOKS IN YOUR CHAT: the centre of the page, give it most room
Heading: "How it looks in your chat". Small note opposite: "Real play,
shown in a generic chat window".
Three chat windows side by side. Each has a title bar reading
"Your AI app", a chat, and a caption along its foot. In the chat, the
player's lines sit right in a bubble; the assistant's lines are plain
text on the left; and the shop's server speaks through a bordered panel
set inside the chat, clearly a different thing from the assistant's
words. Each panel starts with a small label beginning "[PLATFORM] ·".
Dice and counters in the panels use tabular numbers.

Window 1
- Player: "Let's play Delve."
- Assistant: "You crouch at the lip of a sinkhole on Gallows Hill. Far
  below, drums. Somewhere under them, Wren is waiting. You are Tamsin, a
  ranger, 12 HP." (bold "Tamsin")
- Panel "[PLATFORM] · DELVE": "Progress 0/6" and "Threat 0/6" side by
  side.
- Assistant: "How do you go down: the rope the goblins left, or the
  root-choked crack beside it?"
- Caption: "The scene opens. The server sets up both tracks."

Window 2
- Player: "I squeeze through the crack, quietly."
- Panel "[PLATFORM] · STEALTH CHECK": a square badge showing a big "11"
  with a tiny "WEAK" under it, in the warning colour. Beside it two
  lines: "d20 11 + 3 = 14 vs 15" and "Weak hit: through, but heard".
  Below: "Progress 1/6" and, in the error colour with a small up arrow,
  "Threat 1/6".
- Assistant: "You slither free into the fungus gallery, but a loose stone
  clatters behind you. A goblin voice: "Who's there?""
- Caption: "A weak hit: progress, with a cost the server applies."

Window 3
- Assistant: "The drums falter, then stop. But Wren is already on your
  back, and the escape tunnel smells of rain. You're out."
- Panel "[PLATFORM] · SCENE COMPLETE": bold "Rescued · threat 5/6", then
  "11 rolls · 1 natural 20 · HP 5/12", then a link "See your session
  page".
- Player: "That was so close."
- Caption: "The ending, with a link back to your full session."

F. THREE STAT TILES in a row: small label, big figure, one muted line
- "IN A SCENE" / "6–7 locations" / "Sinkhole to ritual chamber, shuffled
  each run."
- "TYPICAL RUN" / "10–14 rolls" / "Every one listed on your session page
  afterwards."
- "ENDINGS" / "4 ways out" / "Clean rescue, close call, alone, or caught."

G. IF YOU LIKE DELVE: heading, then two game cards side by side, each a
small flat-shape cover with a title and one muted line. Both carry a
"Coming soon" tag and do not open anything
- "Derelict" / "The same game, in science fiction · 15+"
- "The Barrow of Hollowmere" / "A short campaign with levels and loot ·
  12+"

SCREEN 5: GAME PAGE (Daily Puzzles)
- Cover, small label "PUZZLES · NEW EVERY DAY", title "Daily Puzzles",
  tags: Free, about 10 min each, Solo.
- "Today", with the date: three cards, one per puzzle, each with its own
  small cover, a one-line cold open and a button "Play in your AI":
  - Escape Room: "The door's locked and you're on the wrong side of it."
  - Murder Mystery: "There's a body, a locked door and a story that
    doesn't add up. Your move."
  - Word Puzzle: "You already know today's answer. You can't see it yet,
    so start guessing."
  Show one as already solved, with its result and a link "See your
  session page".
- One chat window showing a puzzle being played, in the same form as the
  Delve windows: the player's line, a "[PLATFORM] · WORD PUZZLE" panel
  showing "Guess 3 of 6" and the letters found so far, then the
  assistant's line.
- "Earlier puzzles": the three days before today, each a row with the
  date and its three puzzles. Paying: each opens and can be played, and
  ones already played show their result. Not paying: the rows are
  visible but closed, with a "Pass" tag and one line: "Past puzzles come
  with the Pass."
- "Your streak" and "Your record". Paying: "Streak: 12 days" and
  "Record: 41 solved, 6 missed", with the last seven days as a row of
  small squares, filled or empty. Not paying: the same panel closed,
  with "Your streak and record are kept with the Pass."

SCREEN 6: GAMES
The catalogue. A heading "Games" and the two cover cards from the home
page, each with its Free or Pass tag, age, length and "Solo". A played
game shows a small "Played today" or "Played this week" mark. After
them, the two "Coming soon" cards from the Delve page (Derelict, The
Barrow of Hollowmere), which do not open anything.

SCREEN 7: SESSION PAGE (where "See your session page" goes)
The record of one played scene, and the page a player would share.
- Cover, "Delve", and the result large: "Rescued".
- A row of figures: "Threat 5/6", "11 rolls", "1 natural 20",
  "HP 5/12", and the date.
- The two tracks drawn as they ended: Progress 6/6, Threat 5/6.
- "Every roll": a list of all 11, each one line in the same form as the
  chat panels, for example "Stealth check · d20 11 + 3 = 14 vs 15 · Weak
  hit: through, but heard". Use tabular numbers.
- "Endings": the four ways out (Clean rescue, Close call, Alone, Caught)
  with the one this session reached marked.
- A main button "Share", opening a pop-up with a preview of a share card
  (cover, "Delve", "Rescued · threat 5/6 · 11 rolls · 1 natural 20") and
  two actions: "Copy link" and "Download image".
- A secondary button "Play again".
A puzzle's session page has the same form: the puzzle's cover and name,
the result large ("Solved in 3 of 6"), each guess listed, and Share.
Not paying, a puzzle's session page is shown straight after play with
one line above it: "This result isn't kept. The Pass keeps your
history."

SCREEN 8: HISTORY
Paying: "History", a list of played sessions, newest first. Each row:
small cover, game, result, date, and it opens that session page. Show
six rows: today's three puzzles, two earlier puzzles and one Delve
scene, one of them a loss. Above the list, the streak and record figures
from screen 5.
Not paying: no list. "Nothing is kept on the free plan. Play today's
puzzles as often as you like; the Pass keeps your results, your streak
and your record." with a button "See the Pass".

SCREEN 9: PASS
"[Platform] Pass". Two columns side by side:
- "Not paying": today's puzzles; nothing kept.
- "Paying": everything free, plus the weekly games, plus past puzzles,
  plus your streak and your record.
A main button "Get the Pass" with the price shown as "£—" (not decided).
The line: "Purchases only ever happen on this site; your AI will never
ask you to pay." Signed in and not paying, show "You're on the free
plan" above the columns; paying, show "You have the Pass".

LINKS BETWEEN SCREENS
Home "Start free" → sign up → connect your AI → games (screen 6).
"How it works" → that part of the home page. "Games" and "Browse games"
→ screen 6. "Your AI" → screen 3. The Delve card → screen 4. The Daily
Puzzles card → screen 5. "Play in your AI" → connect your AI if not
connected, otherwise a short pop-up: "Tell your AI: let's play Delve."
(or the puzzle's name), with a link "See a finished session (demo)" →
session page. The "See your session page" links → session page. History
rows → session page. Every "Pass" tag, "Pricing", "See the Pass" and
"Get the Pass" on a game page → the Pass screen. "Get the Pass" on the
Pass screen → switches the demo view to Pass.
