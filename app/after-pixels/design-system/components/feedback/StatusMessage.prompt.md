StatusMessage is the tinted in-place line for a result, a warning or a failure; put it next to what it reports, never as a floating toast.

```jsx
<StatusMessage kind="success">Saved. Your streak is kept.</StatusMessage>
<StatusMessage kind="warning">Today's puzzle ends in two hours.</StatusMessage>
<StatusMessage kind="error">Could not reach Claude. Try again.</StatusMessage>
```

- Plain thing first. Errors and payment messages never carry a dare.
