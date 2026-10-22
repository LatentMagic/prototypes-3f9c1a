# After Pixels Design System

After Pixels (afterpixels.com) is a shop of small games you play by talking to an AI assistant (Claude or ChatGPT) over MCP. Players browse covers, connect their assistant, and start a game in chat. New games arrive every day: daily puzzles, a weekly interrogation, murder mysteries, escape rooms, dungeon quests, word puzzles.

The system is one dark surface: warm near-black pages, off-white type and actions, square corners, and colour that lives only in game covers and status. The shop itself has no colour.

## Where things are

- [Voice and content](guidelines/voice.md)
- [Visual foundations](guidelines/visual-foundations.md): colour, type, spacing, surfaces, motion, states
- [Layout and adaptive patterns](guidelines/layout-and-patterns.md): page layout, overlays, loading, card rows
- [Iconography](guidelines/iconography.md)
- [Game art motion](guidelines/game-art-motion.md) and [UI standard](guidelines/ui-standard.md)
- [Sources and file index](guidelines/sources-and-index.md)
- Click-through in `ui_kits/shop/`, tokens in `tokens/`

## Components

- `components/actions/`: Button, ButtonPair, TextLink
- `components/forms/`: TextField, SearchField, Checkbox
- `components/feedback/`: Tag, StatusMessage, ProgressBar, Loader
- `components/surfaces/`: Card, Heading, FormCard, Popup, Menu, Disclosure, PageGrid, CardRow, GameCard, GamePick, GameTile, SoonCard, NeedsPass, ListRow, RowList
- `components/media/`: Cover, Icon, GameArt, ChatPicture (a game played in a generic chat, for product pages; the one light picture on the dark surface), ChatPlayback (the same chat played out turn by turn; can be shown at any given time)
- `components/chat/`: the parts a game draws inside a ChatPicture AI turn, each also a block type: TileGrid, WordBoard, ChoiceButtons, ConfirmCard, FactRows, StatRow, StatusTag, EntityCards, ClueCards, ResultCard, Track, RollLine, NavButtons, MenuRows
