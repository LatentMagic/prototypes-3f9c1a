Button is the 48px square-cornered action; use `main` for the one main action on a surface, `secondary` beside it, `danger` only for delete.

```jsx
<Button>Add to Claude</Button>
<Button variant="secondary">See how it plays</Button>
<Button variant="danger">Delete save</Button>
<Button loading loadingLabel="Adding">Add to Claude</Button>
<Button onClick={()=>api.add()} loadingLabel="Adding" done={added} doneLabel="Added">Add to Claude</Button>
<ButtonPair><Button variant="secondary">Sign in</Button><Button>Sign up</Button></ButtonPair>
```

- Every action that changes state shows it is working. From the press until the result, the pressed button is in the working state: spinner beside the label, no second press. Return a promise from `onClick` and the button does it for you; or drive `loading` yourself.
- The working state is not `disabled`: the button keeps its colour and focus. Usually it is the submit button.
- Pairs go secondary first, then main.
- Width follows the screen, not a prop: under 640px every button is full width and a pair stacks; at 640px and up natural width, also in a narrow column. `block` forces full width at every width; reach for it rarely. A Popup's actions and a Menu's trigger keep their own rule.
- A link sharing a row with a button: lay the row out as a wrapping flex row (`display:flex;flex-wrap:wrap`) and the full-width button pushes the link onto its own line beneath it under 640px.
- Disabled exists but prefer a plain statement in the button's slot.
- The done swap is the acknowledgement; no toast follows it.
