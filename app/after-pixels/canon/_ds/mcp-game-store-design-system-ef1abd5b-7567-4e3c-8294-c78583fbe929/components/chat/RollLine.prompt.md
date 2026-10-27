RollLine shows a roll and what came of it. Block type `roll`.

```jsx
<RollLine label="Stealth" roll={11} mod={3} target={15} result="weak"/>
```

- One line per roll. Several rolls in a turn are several `roll` blocks.
- What the roll changed (threat up, item found) goes in the turn's text or a Track under it.
