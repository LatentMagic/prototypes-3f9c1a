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
- Disabled exists but prefer a plain statement in the button's slot.
- The done swap is the acknowledgement; no toast follows it.
