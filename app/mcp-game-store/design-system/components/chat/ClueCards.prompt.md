ClueCards sorts the facts found so far by kind. Block type `clues`.

```jsx
<ClueCards groups={[{kind:'Objects',facts:['Delphine Rooke had the iron poker.']},{kind:'Statements',facts:[{text:'Was Delphine Rooke in the dining room? No.',new:true}]}]}/>
```

- One card. Each kind is a section headed by its name and count; each fact sits on its own ruled line. A new fact is tinted and marked New at the end of its line.
- Always grouped. A flat list of clues didn't help players; sorted under kinds, it did.
- Mark only what this turn added. Next turn, drop the mark.
- Keep the kinds a game uses stable from turn to turn so the player finds the same heading in the same place.
