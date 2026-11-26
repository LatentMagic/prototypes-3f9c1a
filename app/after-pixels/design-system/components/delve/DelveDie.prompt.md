DelveDie is one turn of a Delve run, drawn as a hexagon on the route. DelveUseDie is the turn where the hero used something and made no roll.

```jsx
<DelveDie kind="strong" value={14}/>
<DelveDie kind="weak" value={9} other={4} behind/>
<DelveDie kind="strong" value={20} crit/>
<DelveDie kind="strong" value={13} biggest/>
<DelveDie kind="strong" value={20} crit biggest/>
<DelveDie kind="miss" value={1} fumble/>
<DelveUseDie/>
```

- Grade is the fill: green strong, yellow weak, empty miss. The number is always drawn, so colour is never the only signal. A use has no grade, so no fill and no number.
- `biggest` marks the run's Biggest hit (the attack that dealt the most damage): a hit with a dark ring just inside its edge, which also sits inside a natural 20's rim; without a natural 20 the die is grown to the size the rim takes, so both take the same space. Only a strong die takes it.
- `won` fills a use's sparkle green: only the use that ends a won run, as its closing key moment. Every other use stays grey.
- One sparkle stands for every use: an ability, the ultimate, gear of any kind. Never give a kind its own icon.
- `behind` draws the other die of an advantage roll as a grey hex behind the die, only in the held roll's head: no route, map or Now card die has one, and no die has a foe hex. The hex is the die's own outline moved a fixed step, so it sits evenly behind every die.
- Draw it 24-52px on a route, 72px in the held roll with `surface="popup"`. The die is a picture: wrap it in a button for a tap target, and label that button.
