DelveDie is one turn of a Delve run, drawn as a hexagon on the route. DelveUseDie is the turn where the hero used something and made no roll.

```jsx
<DelveDie kind="strong" value={14}/>
<DelveDie kind="weak" value={9} other={4}/>
<DelveDie kind="miss" value={5} foe/>
<DelveDie kind="strong" value={20} crit/>
<DelveDie kind="strong" value={13} biggest/>
<DelveDie kind="strong" value={20} crit biggest/>
<DelveDie kind="miss" value={1} fumble/>
<DelveUseDie foe/>
```

- Grade is the fill: green strong, yellow weak, empty miss. The number is always drawn, so colour is never the only signal. A use has no grade, so no fill and no number.
- `biggest` marks the run's Biggest hit (the attack that dealt the most damage): a hit with a dark ring just inside its edge, which also sits inside a natural 20's rim. Only a strong die takes it.
- `won` fills a use's sparkle green: only the use that ends a won run, as its closing key moment. Every other use stays grey.
- One sparkle stands for every use: an ability, the ultimate, gear of any kind. Never give a kind its own icon.
- The foe's red hex shows that the foe struck back, hit or missed; the held roll says which. It never appears on the held roll's large die.
- Draw it 24-52px on a route, 72px in the held roll with `surface="popup"`. The die is a picture: wrap it in a button for a tap target, and label that button.
